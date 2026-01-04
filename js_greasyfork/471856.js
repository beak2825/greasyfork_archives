// ==UserScript==
// @name         Create box function
// @namespace    create_box_owot
// @version      1.3.2
// @description  Really useful for making boxes 👍
// @author       e_g.
// @match        https://ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471856/Create%20box%20function.user.js
// @updateURL https://update.greasyfork.org/scripts/471856/Create%20box%20function.meta.js
// ==/UserScript==

setupModals = function(){
    //Box creator modal
    function makeBoxCreatorModal() {
        var modal = new Modal();
        modal.createForm();
        modal.createCheckboxField();
        modal.setFormTitle("Let's create a box!\n");
        for(var inputs of ["x", "y", "width", "height", "borderSize"]){
            window[inputs] = modal.addEntry(inputs, "text", "number").input;
        };
        for(var inputs of ["mainColor", "borderColor", "textColor", "textBgColor"]){
            window[inputs] = modal.addEntry(inputs, "color").input;
        };
        for(var inputs of ["title", "description", "footer"]){
            window[inputs] = modal.addEntry(inputs, "text", "string").input;
        };
        for(var inputs of ["titleAlign", "descAlign", "footerAlign"]){ //thanks poopman
            window[inputs+"Options"] = [
                { label: "Left", value: "left"},
                { label: "Center", value: "center", default: (inputs == "footerAlign" ? false : true) },
                { label: "Right", value: "right", default: (inputs == "footerAlign" ? true : false)},
            ];
            window[inputs] = (inputs == "footerAlign" ? "right" : "center");
            createRadioButtons(modal, inputs, window[inputs+"Options"]);
        }; //poopman's part stops here
        modal.setMaximumSize(500, 600);
        for(var inputs of ["footer2space", "borderCollision"]){
            window[inputs] = modal.addCheckbox(inputs)
            window[inputs].cbElm.title = {
                footer2space: "2 horizontal spaces instead of 1. Doesn't apply when using centered footer.",
                borderCollision: "Makes the text stick to the border instead of having a spacement."
            }[inputs];
        };
        modal.onSubmit(function(){
            createBox({
                x: +x.value,
                y: +y.value,
                width: +width.value,
                height: +height.value,
                borderSize: +borderSize.value,
                mainColor: parseInt(mainColor.value, 16),
                borderColor: parseInt(borderColor.value, 16),
                textColor: parseInt(textColor.value, 16),
                textBgColor: parseInt(textBgColor.value, 16),
                title: title.value,
                description: description.value,
                footer: footer.value,
                titleAlign: document.querySelector('input[name="titleAlign"]:checked').value, //thanks poopman
                descAlign: document.querySelector('input[name="descAlign"]:checked').value,
                footerAlign: document.querySelector('input[name="footerAlign"]:checked').value, //poopman's part stops here
                footer2space: footer2space.cbElm.checked,
                borderCollision: borderCollision.cbElm.checked
            });
        });
        modal.client.firstChild.append(...modal.client.children[1].children);
        modal.client.firstChild.insertBefore(modal.client.firstChild.children[2], modal.client.firstChild.lastChild.nextSibling);
        w.ui.boxCreatorModal = modal;
    };
    makeBoxCreatorModal();
    function createRadioButtons(modal, name, options) { //thanks poopman
        const radioDiv = document.createElement("div");
        radioDiv.style.display = "flex";
        const radioText = document.createElement("label");
        radioText.innerHTML = name + ":";
        radioDiv.appendChild(radioText);
        for (const option of options) {
            const label = document.createElement("label");
            label.style.marginRight = "10px";
            const input = document.createElement("input");
            input.type = "radio";
            input.name = name;
            input.value = option.value;
            if (option.default) {
                input.checked = true;
            }
            label.appendChild(input);
            label.appendChild(document.createTextNode(option.label));
            radioDiv.appendChild(label);
        }
        modal.formField.appendChild(radioDiv);
    } //poopman's part stops here
    //Create menu option
    menu.addOption("Create box", function(){
        var region = RegionSelection();
        region.init();
        region.startSelection();
        region.onselection(function(xy, _, width, height){
            var options = w.ui.boxCreatorModal.client.firstChild.children[1];
            options.children[1].value = xy[0] * 16 + xy[2];
            options.children[3].value = xy[1] * 8 + xy[3];
            options.children[5].value = width;
            options.children[7].value = height;
            w.ui.boxCreatorModal.open();
        });
    });
}
setupModals();

createBox = function(box){
    // Errors and warnings
    if(box.title.length > box.width - box.borderSize * 4 - !box.borderCollision * 2) return console.error("Title too big" + (box.title.length <= box.width - box.borderSize * 4 ? ", activate borderCollision so you can use that title." : "."));
    if(box.footer && box.footer.length > box.width - box.borderSize * 4 - !box.borderCollision * 2 + box.footer2space) return console.error("Footer too big, try deactivating footer2space and/or activating borderCollision so you can use that footer.");
    box.size = box.width * box.height + ((box.width - box.borderSize * 4) * (box.height - box.borderSize * 2)) * !!box.borderSize + box.title.length + box.description.length + (box.footer ? box.footer.length : 0);
    if(state.worldModel.char_rate.reduce((x, y) => x * 1e3 / y) * 24 < box.size) return console.error("Your rate limit is too low to draw the box (would take longer than 24 seconds).");
    if(state.worldModel.char_rate.reduce((x, y) => x * 1e3 / y) * 2 < box.size) console.warn("The box might be messed up because your rate limit is too low for the box's size.");
    for(var options of ["x", "y", "width", "height", "borderSize"]){
        box[options] = Math.floor(box[options]);
    };
    if(box.borderSize * 4 >= box.width / 2) console.warn("Consider reducing border's size to add space for the main content!");
    if(box.footer2space && box.borderCollision) console.warn("Both footer2space and borderCollision are activated, this may cause conflict for the box.");
    // Avoid glitching when a word is too big for the box
    if(!box.description.endsWith(" ") && box.description.split(" ").at(-1).length > box.width - box.borderSize * 4 - 2) box.description += " ";
    // Rest of description's separating setup + see if it's too big for the box
    if(box.description.length > box.width - box.borderSize * 4 - !box.borderCollision * 2 && box.description.split(" ").length > 1){
        box.formattedDesc = [...box.description.match(RegExp(`.{0,${box.width - box.borderSize * 4 - !box.borderCollision * 2}} |.{${box.width - box.borderSize * 4 - !box.borderCollision * 2}}`, "g")), box.description.split(" ").at(-1)];
        if(box.formattedDesc.slice(-2).join("").length <= box.width - box.borderSize * 4 - !box.borderCollision * 2) box.formattedDesc = [...box.formattedDesc.slice(0, box.formattedDesc.length - 2), box.formattedDesc.slice(-2).join("")];
        box.formattedDesc = box.formattedDesc.map(x => x.replace(/ +$/, ""));
    }
    else box.formattedDesc = box.description.match(RegExp(`.{0,${box.width - box.borderSize * 4 - !box.borderCollision * 2}}`, "g"));
    box.formattedDesc = box.formattedDesc.filter(x => x != "");
    if(box.formattedDesc.length == 1 && box.formattedDesc[0] == "") box.formattedDesc = [];
    if(box.formattedDesc.length > box.height - box.borderSize * 2 - 2 - !box.borderCollision * 2 - !!box.footer * 2) return console.error("Description too long for the size of this box. Try activating borderCollision, or if that doesn't work, set a bigger size for the box or shorten the description.");
    //Make the box and box's border (reversed order)
    if(box.borderSize) filltoxy(box.x, box.y, box.width, box.height, "█", box.borderColor);
    filltoxy(box.x + box.borderSize * 2, box.y + box.borderSize, box.width - box.borderSize * 4, box.height - box.borderSize * 2, "█", box.mainColor);
    //Alignment formula of title and draw it
    if(!box.titleAlign) box.titleAlign = "center";
    if(box.titleAlign == "center"){
        box.titleFormula = Math.ceil(box.x + box.width / 2 - box.title.length / 2);
    }
    else if(box.titleAlign == "left"){
        box.titleFormula = Math.ceil(box.x + box.borderSize * 2 + !box.borderCollision);
    }
    else if(box.titleAlign == "right"){
        box.titleFormula = Math.ceil(box.x + (box.width - box.borderSize * 2 - !box.borderCollision - box.title.length));
    };
    texttoxy(box.titleFormula, box.y + box.borderSize + !box.borderCollision, box.title, box.textColor, box.textBgColor);
    //Alignment formula of description and draw it
    if(!box.descAlign) box.descAlign = "center";
    if(box.descAlign == "center"){
        box.descFormula = function(formattedDesc, descIndex){
            return Math.ceil(box.x + box.width / 2 - formattedDesc[descIndex - box.borderSize - 3].length / 2);
        };
    }
    else if(box.descAlign == "left"){
        box.descFormula = function(){
            return Math.ceil(box.x + box.borderSize * 2 + !box.borderCollision);
        };
    }
    else if(box.descAlign == "right"){
        box.descFormula = function(formattedDesc, descIndex){
            return Math.ceil(box.x + (box.width - box.borderSize * 2 - !box.borderCollision - formattedDesc[descIndex - box.borderSize - 3].length));
        };
    };
    for(box.descIndex = box.borderSize + 3; box.descIndex < box.formattedDesc.length + box.borderSize + 3; box.descIndex++){
        texttoxy(box.descFormula(box.formattedDesc, box.descIndex), box.y + box.descIndex - !!box.borderCollision, box.formattedDesc[box.descIndex - box.borderSize - 3], box.textColor, box.textBgColor);
    };
    //Alignment formula of footer and draw it IF there's any
    if(!box.footer) return;
    if(!box.footerAlign) box.footerAlign = "right";
    if(box.footerAlign == "center"){
        box.footerFormula = Math.ceil(box.x + box.width / 2 - box.footer.length / 2);
    }
    else if(box.footerAlign == "left"){
        box.footerFormula = Math.ceil(box.x + box.borderSize * 2 + !box.borderCollision + !!box.footer2space);
    }
    else if(box.footerAlign == "right"){
        box.footerFormula = Math.ceil(box.x + (box.width - box.borderSize * 2 - !box.borderCollision - !!box.footer2space - box.footer.length));
    };
    texttoxy(box.footerFormula, box.y + box.height - box.borderSize - 1 - !box.borderCollision, box.footer, box.textColor, box.textBgColor);
}