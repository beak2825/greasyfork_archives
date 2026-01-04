// ==UserScript==
// @name         Insanejournal Batch Icon Crediting
// @namespace    https://wastintime.insanejournal.com/
// @version      0.1.4
// @description  Update your icon credit lines in a batch.
// @author       gracefulally
// @match        https://www.insanejournal.com/editpics.bml
// @match        https://www.dreamwidth.org/manage/icons
// @icon         https://www.google.com/s2/favicons?sz=64&domain=insanejournal.com
// @copyright    2023+, Allyson Moisan
// @license      MIT License
// @supportURL   https://wastintime.insanejournal.com/149281.html#comments
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459049/Insanejournal%20Batch%20Icon%20Crediting.user.js
// @updateURL https://update.greasyfork.org/scripts/459049/Insanejournal%20Batch%20Icon%20Crediting.meta.js
// ==/UserScript==

(function addForm(){
    'use strict';
    const art = document.createElement("article"), f = document.createElement("form"), fs = document.createElement("fieldset"),
          l = document.createElement("legend"), sect = document.createElement("section"), o = document.createElement("output"),
          p1 = document.createElement("p"), p2 = document.createElement("p"), p3 = document.createElement("p"), p4 = document.createElement("p"),
          s1 = document.createElement("span"), s2 = document.createElement("span"), s3 = document.createElement("span"),
          s4 = document.createElement("span"), s5 = document.createElement("span"), s6 = document.createElement("span"),
          r1 = document.createElement("input"), r2 = document.createElement("input"), r3 = document.createElement("input"),
          l1 = document.createElement("label"), l2 = document.createElement("label"), l3 = document.createElement("label"),
          i1 = document.createElement("input"), i2 = document.createElement("input"), i3 = document.createElement("input"),
          l4 = document.createElement("label"), l5 = document.createElement("label"), l6 = document.createElement("label"),
          b1 = document.createElement("button"), b2 = document.createElement("button"), b3 = document.createElement("button");
    art.id = "gmPopupContainer";
    sect.id = "outerSection";
    l.innerHTML = "Update Icon Credit For:";
    p1.id = "radioContainer"; p2.id = "rangeContainer"; p3.id = "creditContainer"; p4.id = "buttonContainer";
    s1.id = "spanR1"; s2.id = "spanR2"; s3.id = "spanR3";
    s4.id = "spanCredit"; s5.id = "spanStart"; s6.id = "spanEnd";
    l1.id = "labelR1"; l2.id = "labelR2"; l3.id = "labelR3";
    l4.id = "labelCredit"; l5.id = "labelStart"; l6.id = "labelEnd";
    r1.type = "radio"; r1.id = "radioAll"; r1.name = "radioButtons"; r1.value = "all";
    r2.type = "radio"; r2.id = "radioBlank"; r2.name = "radioButtons"; r2.value = "blank";
    r3.type = "radio"; r3.id = "radioRange"; r3.name = "radioButtons"; r3.value = "range";
    l1.innerHTML = "All"; l2.innerHTML = "Blank Only"; l3.innerHTML = "Range";
    i1.type = "text"; i1.id = "creditText"; i1.value = "";
    i2.type = "text"; i2.id = "rangeStart"; i2.value = "";
    i3.type = "text"; i3.id = "rangeEnd"; i3.value = "";
    l4.innerHTML = "Credit:"; l5.innerHTML = "Start:"; l6.innerHTML = "End:";
    o.id = "updateOutput"; o.innerHTML = "&nbsp;";
    b1.id = "gmUpdateBtn"; b1.type = "button"; b1.innerHTML = "Update Credit";
    b2.id = "gmCloseBtn"; b2.type = "button"; b2.innerHTML = "Clear Form";
    b3.id = "gmCloseBtn"; b3.type = "button"; b3.innerHTML = "Close Form";
    r1.addEventListener("click", checkRadios, "r1");
    r2.addEventListener("click", checkRadios, "r2");
    r3.addEventListener("click", checkRadios, "r3");
    b1.addEventListener("click", doUpdate);
    b2.addEventListener("click", clearForm);
    b3.addEventListener("click", closeForm);
    art.style.display = "flex"; art.style["justify-content"] = "center"; art.style["flex-direction"] = "column";
    art.style.position = "fixed"; art.style.top = "30%"; art.style.left = "20%"; art.style["font-family"] = "'Open Sans'";
    art.style.padding = "2em"; art.style.background = "lightgray"; art.style.border = "3px solid gray";
    art.style["border-radius"] = "1ex"; art.style["z-index"] = "777"; art.style["min-width"] = "20%";
    sect.style.display = "flex"; sect.style["flex-direction"] = "column"; sect.style["min-width"] = "300px"
    fs.style.display = "flex"; fs.style["flex-direction"] = "column"; fs.style.margin = "0"; l.style.padding = "0 0.5em";
    p1.style.display = "flex"; p1.style["justify-content"] = "center"; p1.style["flex-direction"] = "row";
    p2.style.display = "none"; p2.style["justify-content"] = "center"; p2.style["flex-direction"] = "row";
    p3.style.display = "flex"; p3.style["justify-content"] = "center"; p3.style["flex-direction"] = "row";
    p4.style.display = "flex"; p4.style["justify-content"] = "center"; p4.style["flex-direction"] = "row";
    p4.style.margin = "1em 0 0 0";
    s2.style.margin = "0 0.5em"; l4.style["margin-right"] = "0.5em";
    i2.style.width = "60px"; i2.style.margin = "0 0.5em"; l6.style.margin = "0 0.5em"; i3.style.width = "60px";
    o.style.display = "none"; o.style.margin = "0.5em 0";
    b1.style.cursor = "pointer"; b1.style.border = "1px outset buttonface"; b1.style["font-family"] = "'Open Sans'";
    b2.style.cursor = "pointer"; b2.style.margin = "auto"; b2.style.border = "1px outset buttonface"; b2.style["font-family"] = "'Open Sans'";
    b3.style.cursor = "pointer"; b3.style.border = "1px outset buttonface"; b3.style["font-family"] = "'Open Sans'";
    s1.appendChild(r1); s1.appendChild(l1);
    s2.appendChild(r2); s2.appendChild(l2);
    s3.appendChild(r3); s3.appendChild(l3);
    s4.appendChild(l4); s4.appendChild(i1);
    s5.appendChild(l5); s5.appendChild(i2);
    s6.appendChild(l6); s6.appendChild(i3);
    p1.appendChild(s1); p1.appendChild(s2); p1.appendChild(s3);
    p2.appendChild(s5); p2.appendChild(s6); p3.appendChild(s4);
    p4.appendChild(b1); p4.appendChild(b2); p4.appendChild(b3);
    fs.appendChild(l); fs.appendChild(p1); fs.appendChild(p2); fs.appendChild(p3);
    f.appendChild(fs); f.appendChild(o); f.appendChild(p4);
    sect.appendChild(f); art.appendChild(sect);
    document.body.appendChild(art);
    document.getElementById("radioBlank").checked = true;
})();

function checkRadios(event){
    const radioButtons = document.querySelectorAll('input[name="radioButtons"]'), p2 = document.getElementById("rangeContainer");
    let selectedRadio;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedRadio = radioButton.value;
            break;
        }
    }
    if(selectedRadio === "range"){
        p2.style.display = "flex";
    } else {
        p2.style.display = "none";
    }
}

function doUpdate(event) {
    const radioButtons = document.querySelectorAll('input[name="radioButtons"]'),
          i1 = document.getElementById("creditText"), i2 = document.getElementById("rangeStart"), i3 = document.getElementById("rangeEnd"),
          o = document.getElementById("updateOutput"), elements = document.getElementsByClassName("userpic_comments");
    var i = 0, j = elements.length, all = true, keepGoing = true;
    let selectedRadio;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedRadio = radioButton.value;
            break;
        }
    }
    if(selectedRadio === "blank"){
        all = false;
    } else if (selectedRadio === "range") {
        i = parseInt(i2.value, 10);
        j = parseInt(i3.value, 10);
        if(Number.isNaN(i) || Number.isNaN(j)){
            keepGoing = false;
        } else {
            i--;
        }
    }
    if(keepGoing){
        for(i; i < j; i++){
            var e = elements[i].getElementsByClassName("text")[0];
            if(all || e.value.length == 0){
                e.value = i1.value;
            }
        }
        o.innerHTML = "Credit(s) updated. Remember to Save Settings!";
        o.style.display = "flex";
    } else {
        o.innerHTML = "Start and End must be numbers!";
        o.style.display = "flex";
    }
}

function clearForm(event){
    const o = document.getElementById("updateOutput"), r2 = document.getElementById("radioBlank"), i1 = document.getElementById("creditText"),
          i2 = document.getElementById("rangeStart"), i3 = document.getElementById("rangeEnd"), p2 = document.getElementById("rangeContainer");
    i1.value = "";
    i2.value = "";
    i3.value = "";
    r2.checked = "true";
    p2.style.display = "none"
    o.innerHTML = "&nbsp;"; o.style.display = "none";
}

function closeForm(event){
    var e = document.getElementById("gmPopupContainer");
    if (e.style.display === "none") {
        e.style.display = "flex";
    } else {
        e.style.display = "none";
  }
}