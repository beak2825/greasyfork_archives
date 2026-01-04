// ==UserScript==
// @name         WJX filler
// @namespace    https://blog.csdn.net/SundaySmarty
// @version      1.0.19
// @description  Make filling wjx easier
// @author       SundaySmarty
// @match        https://*.wjx.top/vm/*.aspx
// @match        https://*.wjx.cn/vm/*.aspx
// @match        https://*.wjx.top/vj/*.aspx
// @match        https://*.wjx.cn/vj/*.aspx
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463477/WJX%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/463477/WJX%20filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if(index > -1) {
            this.splice(index, 1);
        }
    };

    // Cancel restriction of copy & paste
    document.oncontextmenu = document.onselectstart = null;

    // Change path
    let path = location.pathname;
    let path1 = path.substring(0, path.substring(1).indexOf('/') + 1);
    let path2 = path.substring(path.substring(1).indexOf('/') + 1);
    if(path1 == "/vj") location.href = "https://" + location.host + "/vm" + path2;

    // Basic structure
    let fillerButton = document.createElement("button");
    fillerButton.textContent = "WJX filler";
    fillerButton.style.paddingLeft = "20px";
    fillerButton.style.paddingRight = "20px";
    fillerButton.style.height = "30px";
    fillerButton.style.textAlign = "center";
    fillerButton.style.background = "thistle";
    fillerButton.style.color = "white";
    fillerButton.style.border = "1px solid thistle";
    fillerButton.style.borderRadius = "4px";
    fillerButton.style.position = "fixed";
    fillerButton.style.top = "0";
    fillerButton.style.right = "0";
    fillerButton.style.zIndex = "2000";
    fillerButton.addEventListener("click", clickFillerButton);

    let filler = document.createElement("div");
    filler.style.width = "40%";
    filler.style.height = "100%";
    filler.style.background = "white";
    filler.style.position = "fixed";
    filler.style.top = "0";
    filler.style.right = "0";
    filler.style.display = "none";
    filler.style.zIndex = "1000";

    let fillerContainer = document.createElement("div");
    fillerContainer.style.width = "100%";
    fillerContainer.style.height = "100%";
    fillerContainer.style.padding = "10%";
    fillerContainer.style.overflowY = "auto";
    fillerContainer.style.overflowX = "hidden";

    let fillerHeaderContainer = document.createElement("div");
    fillerHeaderContainer.style.width = "90%";
    fillerHeaderContainer.style.textAlign = "center";
    fillerHeaderContainer.style.margin = "5%";

    let fillerHeader = document.createElement("p");
    fillerHeader.innerHTML = "WJX filler";
    fillerHeader.style.fontSize = "24px";
    fillerHeader.style.fontWeight = "bold";

    let contentContainer = document.createElement("div");
    contentContainer.style.width = "100%";

    let usageButton = document.createElement("button");
    usageButton.textContent = "Usage";
    usageButton.style.paddingLeft = "20px";
    usageButton.style.paddingRight = "20px";
    usageButton.style.height = "30px";
    usageButton.style.textAlign = "center";
    usageButton.style.background = "thistle";
    usageButton.style.color = "white";
    usageButton.style.border = "1px solid thistle";
    usageButton.style.borderRadius = "4px";
    usageButton.style.position = "fixed";
    usageButton.style.top = "0";
    usageButton.style.zIndex = "3000";
    usageButton.addEventListener("click", clickUsageButton);

    let scrollToTopButton = document.createElement("button");
    scrollToTopButton.textContent = "Top";
    scrollToTopButton.style.paddingLeft = "20px";
    scrollToTopButton.style.paddingRight = "20px";
    scrollToTopButton.style.height = "30px";
    scrollToTopButton.style.textAlign = "center";
    scrollToTopButton.style.background = "thistle";
    scrollToTopButton.style.color = "white";
    scrollToTopButton.style.border = "1px solid thistle";
    scrollToTopButton.style.borderRadius = "4px";
    scrollToTopButton.style.position = "fixed";
    scrollToTopButton.style.bottom = "0";
    scrollToTopButton.style.zIndex = "2000";
    scrollToTopButton.addEventListener("click", clickScrollToTopButton);

    let scrollToBottomButton = document.createElement("button");
    scrollToBottomButton.textContent = "Bottom";
    scrollToBottomButton.style.paddingLeft = "20px";
    scrollToBottomButton.style.paddingRight = "20px";
    scrollToBottomButton.style.height = "30px";
    scrollToBottomButton.style.textAlign = "center";
    scrollToBottomButton.style.background = "thistle";
    scrollToBottomButton.style.color = "white";
    scrollToBottomButton.style.border = "1px solid thistle";
    scrollToBottomButton.style.borderRadius = "4px";
    scrollToBottomButton.style.position = "fixed";
    scrollToBottomButton.style.bottom = "0";
    scrollToBottomButton.style.right = "0";
    scrollToBottomButton.style.zIndex = "2000";
    scrollToBottomButton.addEventListener("click", clickScrollToBottomButton);

    let usage = document.createElement("div");
    usage.style.width = "40%";
    usage.style.height = "100%";
    usage.style.background = "white";
    usage.style.position = "fixed";
    usage.style.top = "0";
    usage.style.right = "0";
    usage.style.display = "none";
    usage.style.zIndex = "2500";

    let usageContainer = document.createElement("div");
    usageContainer.style.width = "100%";
    usageContainer.style.height = "100%";
    usageContainer.style.padding = "10%";
    usageContainer.style.overflowY = "auto";
    usageContainer.style.overflowX = "hidden";

    let usageHeaderContainer = document.createElement("div");
    usageHeaderContainer.style.width = "90%";
    usageHeaderContainer.style.textAlign = "center";
    usageHeaderContainer.style.margin = "5%";

    let usageHeader = document.createElement("p");
    usageHeader.innerHTML = "WJX filler usage";
    usageHeader.style.fontSize = "24px";
    usageHeader.style.fontWeight = "bold";

    let usageContentContainer = document.createElement("div");
    usageContentContainer.style.width = "100%";

    document.body.appendChild(fillerButton);
    document.body.appendChild(filler);
    filler.appendChild(fillerContainer);
    fillerContainer.appendChild(fillerHeaderContainer);
    fillerHeaderContainer.appendChild(fillerHeader);
    fillerContainer.appendChild(contentContainer);
    filler.appendChild(usageButton);
    filler.appendChild(scrollToTopButton);
    filler.appendChild(scrollToBottomButton);
    filler.appendChild(usage);
    usage.appendChild(usageContainer);
    usageContainer.appendChild(usageHeaderContainer);
    usageHeaderContainer.appendChild(usageHeader);
    usageContainer.appendChild(usageContentContainer);

    writePInUsage("WJX filler can only detect multiple choice and rating questions.");
    writePInUsage("For multiple choice, you need to enter your answer into the textbox and WJX filler will automatically click your answer of each multiple choice.");
    writePInUsage("For example, if you enter AB in the textbox under 1~2, then choice A will be clicked for question 1 and choice B will be clicked for question 2.");
    writePInUsage("The format of multi-answer questions should be [Your answer]")
    writePInUsage("Enter * if you want to leave that question blank.");
    writeImgInUsage("https://s6.imgcdn.dev/r1P6T.png");
    writePInUsage("For rating questions, if you enter n (a positive integer) in the textbox, then the nth choice would be clicked for all rating questions.");
    writeImgInUsage("https://s6.imgcdn.dev/r15Lt.png");
    writePInUsage("Plus, top button is for scrolling to top and bottom button is for scrolling to bottom.");
    writePInUsage("Random button is for randomly entering the answers.");

    let canFocus = false;
    let focusWhat = 0;
    function clickFillerButton() {
        if(filler.style.display == "none") {
            filler.style.display = "block";
            fillerButton.textContent = "Close";
            if(canFocus) {
                if(focusWhat == 0) ratingInput.focus();
                if(focusWhat == 1) MCInputList[0].focus();
                if(focusWhat == 2) MAInputList[0].focus();
            }
        }
        else {
            filler.style.display = "none";
            fillerButton.textContent = "WJX filler";
        }
    }

    function clickUsageButton() {
        if(usage.style.display == "none") {
            usage.style.display = "block";
            usageButton.textContent = "Close";
            fillerButton.style.display = "none";
        }
        else {
            usage.style.display = "none";
            usageButton.textContent = "Usage";
            fillerButton.style.display = "block";
            if(canFocus) {
                if(focusWhat == 0) ratingInput.focus();
                if(focusWhat == 1) MCInputList[0].focus();
                if(focusWhat == 2) MAInputList[0].focus();
            }
        }
    }

    function clickScrollToTopButton() {
        scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function clickScrollToBottomButton() {
        scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    }

    function writePInUsage(text) {
        let p = document.createElement("p");
        p.style.width = "90%";
        p.style.margin = "5%";
        p.innerHTML = text;
        usageContentContainer.appendChild(p);
    }

    function writeImgInUsage(imgURL) {
        let imgContainer = document.createElement("div");
        imgContainer.style.textAlign = "center";
        let img = document.createElement("img");
        img.setAttribute("src", imgURL);
        img.style.width = "80%";
        usageContentContainer.appendChild(imgContainer);
        imgContainer.appendChild(img);
    }

    // Find continuous multiple choice
    let field = document.getElementsByClassName("field ui-field-contain");
    let nameField;
    let rating = false;
    let continuousMC = [];
    let numOfMC = 0;
    let firstMC = true;
    let firstMCPos = 0;
    let nAtALine = 15;
    let continuousMA = [];
    let numOfMA = 0;
    let firstMA = true;
    let firstMAPos = 0;
    let nAtALine2 = 5;
    for(let i = 0; i < field.length; i++) {
        // Name
        if(field[i].getAttribute("type") == 1 && field[i].children[1].children[0].getAttribute("verify") == "姓名") {
            nameField = field[i];
        }
        // Multiple Choice - Single Answer
        if(field[i].getAttribute("type") == 3) {
            numOfMC++;
            if(firstMC) {
                firstMC = false;
                firstMCPos = i;
            }
            if(numOfMC % nAtALine == 0) {
                continuousMC.push([firstMCPos, numOfMC]);
                firstMC = true;
                numOfMC = 0;
            }
        }
        else {
            if(numOfMC != 0 && numOfMC % nAtALine != 0) continuousMC.push([firstMCPos, numOfMC]);
            firstMC = true;
            numOfMC = 0;
        }
        // Multiple Choice - Multi Answer
        if(field[i].getAttribute("type") == 4) {
            numOfMA++;
            if(firstMA) {
                firstMA = false;
                firstMAPos = i;
            }
            if(numOfMA % nAtALine2 == 0) {
                continuousMA.push([firstMAPos, numOfMA]);
                firstMA = true;
                numOfMA = 0;
            }
        }
        else {
            if(numOfMA != 0 && numOfMA % nAtALine2 != 0) continuousMA.push([firstMAPos, numOfMA]);
            firstMA = true;
            numOfMA = 0;
        }
        // Rating
        if(field[i].getAttribute("type") == 6 && field[i].getAttribute("ischeck") === null) {
            rating = true;
        }
    }
    if(numOfMC != 0 && numOfMC % nAtALine != 0) continuousMC.push([firstMCPos, numOfMC]);
    if(numOfMA != 0 && numOfMA % nAtALine != 0) continuousMA.push([firstMAPos, numOfMA]);

    let ratingInputList = [];
    if(rating) {
        let ratingHeaderContainer = document.createElement("div");
        ratingHeaderContainer.style.width = "90%";
        ratingHeaderContainer.style.margin = "5%";
        let ratingHeader = document.createElement("p");
        ratingHeader.innerHTML = "Rating";
        ratingHeader.style.fontWeight = "bold";
        ratingHeader.style.fontSize = "20px";
        contentContainer.appendChild(ratingHeaderContainer);
        ratingHeaderContainer.appendChild(ratingHeader);

        let ratingInputContainer = document.createElement("div");
        ratingInputContainer.style.width = "90%";
        ratingInputContainer.style.margin = "5%";
        var ratingInput = document.createElement("input");
        ratingInput.setAttribute("type", "text");
        ratingInput.style.width = "100%";
        ratingInput.style.height = "30px";
        ratingInput.style.fontSize = "20px";
        ratingInput.addEventListener("beforeinput", e => {e.data && (/^\d+$/.test(e.data) || e.preventDefault());});
        contentContainer.appendChild(ratingInputContainer);
        ratingInputContainer.appendChild(ratingInput);
        ratingInputList.push(ratingInput);
    }

    if(continuousMC.length != 0 || continuousMA.length != 0) {
        let MCHeaderContainer = document.createElement("div");
        MCHeaderContainer.style.width = "90%";
        MCHeaderContainer.style.margin = "5%";
        let MCHeader = document.createElement("p");
        MCHeader.innerHTML = "Multiple Choice";
        MCHeader.style.fontWeight = "bold";
        MCHeader.style.fontSize = "20px";
        contentContainer.appendChild(MCHeaderContainer);
        MCHeaderContainer.appendChild(MCHeader);
    }

    //NameAutoSet
    if(nameField != null || typeof(nameField) != "undefined") {
        checkCookie();
        nameField.children[1].children[0].addEventListener("input", nameAutoSet);
    }

    function nameAutoSet() {
        let username = nameField.children[1].children[0].value;
        if (username != "" && username != null){
            setCookie("username", username, 365 * 100);
        }
        else document.cookie = "username=; expires=Mon, 01 Jan 2018 00:00:00 GMT";
    }

    function setCookie(para, cvalue, exdays){
        let date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toGMTString();
        document.cookie = para + "=" + cvalue + "; " + expires;
    }
    function getCookie(para){
        let name = para + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function checkCookie(){
        let username = getCookie("username");
        if (username != ""){
            nameField.children[1].children[0].value = username;
        }
    }

    // Show MCInput
    let MCInputList = [];
    if(continuousMC.length != 0) {
        let singleHeaderContainer = document.createElement("div");
        singleHeaderContainer.style.width = "90%";
        singleHeaderContainer.style.margin = "5%";
        let singleHeader = document.createElement("p");
        singleHeader.innerHTML = "Single Answer";
        singleHeader.style.fontWeight = "bold";
        singleHeader.style.fontSize = "18px";
        contentContainer.appendChild(singleHeaderContainer);
        singleHeaderContainer.appendChild(singleHeader);
    }
    for(let i = 0; i < continuousMC.length; i++) {
        let MCTitleContainer = document.createElement("div");
        MCTitleContainer.style.width = "90%";
        MCTitleContainer.style.margin = "5%";
        let MCTitle = document.createElement("p");
        let n1 = Object.values(field[continuousMC[i][0]].children[0].children).filter(x => x.className === "topicnumber")[0].innerText;
        let n2 = Object.values(field[continuousMC[i][0] + continuousMC[i][1] - 1].children[0].children).filter(x => x.className === "topicnumber")[0].innerText;
        if(continuousMC[i][1] != 1) MCTitle.innerHTML = getSN(n1) + '~' + getSN(n2) + " | " + continuousMC[i][1] + " Answers";
        else MCTitle.innerHTML = getSN(n1) + " | " + continuousMC[i][1] + " Answer";
        let MCInputContainer = document.createElement("div");
        MCInputContainer.style.width = "90%";
        MCInputContainer.style.margin = "5%";
        let MCInput = document.createElement("input");
        MCInput.setAttribute("type", "text");
        MCInput.style.width = "100%";
        MCInput.style.height = "30px";
        MCInput.style.fontSize = "20px";
        MCInput.addEventListener("beforeinput", e => {
            if(e.data) {
                e.preventDefault();
                const data = e.data.replace(/\s*/g,"");
                if(/^[A-Za-z\*]+$/.test(data)) {
                    for(let i = 0; i < data.length; i++) {
                        let cursorPosition = MCInput.selectionStart;
                        MCInput.value = MCInput.value.slice(0, cursorPosition) + data[i] + MCInput.value.slice(cursorPosition);
                        MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                        MCInput.dispatchEvent(new Event("input"));
                    }
                }
            }
        });
        MCInput.addEventListener("input", e => {
            const cursorPosition = MCInput.selectionStart;
            const imValue = MCInput.value;
            MCInput.value = MCInput.value.replace(/\s*/g,"").replace(/(.{5})/g, '$1 ').trim();
            const lenDiff = MCInput.value.length - imValue.length;
            if(cursorPosition == imValue.length) {
                MCInput.setSelectionRange(MCInput.value.length, MCInput.value.length);
                return ;
            }
            if(imValue[cursorPosition] === " " && MCInput.value[cursorPosition - 1] === " ") {
                MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                return ;
            }
            if(imValue[cursorPosition - 1] === " ") {
                MCInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                return ;
            }
            MCInput.setSelectionRange(cursorPosition, cursorPosition);
        });
        contentContainer.appendChild(MCTitleContainer);
        MCTitleContainer.appendChild(MCTitle);
        contentContainer.appendChild(MCInputContainer);
        MCInputContainer.appendChild(MCInput);
        MCInputList.push(MCInput);
    }

    let MAInputList = [];
    if(continuousMA.length != 0) {
        let multiHeaderContainer = document.createElement("div");
        multiHeaderContainer.style.width = "90%";
        multiHeaderContainer.style.margin = "5%";
        let multiHeader = document.createElement("p");
        multiHeader.innerHTML = "Multi Answer";
        multiHeader.style.fontWeight = "bold";
        multiHeader.style.fontSize = "18px";
        contentContainer.appendChild(multiHeaderContainer);
        multiHeaderContainer.appendChild(multiHeader);
    }
    for(let i = 0; i < continuousMA.length; i++) {
        let MATitleContainer = document.createElement("div");
        MATitleContainer.style.width = "90%";
        MATitleContainer.style.margin = "5%";
        let MATitle = document.createElement("p");
        let n1 = Object.values(field[continuousMA[i][0]].children[0].children).filter(x => x.className === "topicnumber")[0].innerText;
        let n2 = Object.values(field[continuousMA[i][0] + continuousMA[i][1] - 1].children[0].children).filter(x => x.className === "topicnumber")[0].innerText;
        if(continuousMA[i][1] != 1) MATitle.innerHTML = getSN(n1) + '~' + getSN(n2) + " | " + continuousMA[i][1] + " Answers";
        else MATitle.innerHTML = getSN(n1) + " | " + continuousMA[i][1] + " Answer";
        let MAInputContainer = document.createElement("div");
        MAInputContainer.style.width = "90%";
        MAInputContainer.style.margin = "5%";
        let MAInput = document.createElement("input");
        MAInput.setAttribute("type", "text");
        MAInput.style.width = "100%";
        MAInput.style.height = "30px";
        MAInput.style.fontSize = "20px";
        MAInput.addEventListener("beforeinput", e => e.data && (/^[A-Za-z\[\]\*]+$/.test(e.data) || e.preventDefault()));
        MAInput.addEventListener("keydown", e => {
            const key = e.key;
            if(key === "[" && isBracketValid(MAInput.value)) {
                e.preventDefault();
                const cursorPosition = MAInput.selectionStart;
                const currentValue = MAInput.value;
                const newValue = currentValue.slice(0, cursorPosition) + "[]" + currentValue.slice(cursorPosition);
                MAInput.value = newValue;
                MAInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
            }
            if(key === "]") {
                e.preventDefault();
                const cursorPosition = MAInput.selectionStart;
                const currentValue = MAInput.value;
                const newValue = currentValue.slice(0, cursorPosition) + "]" + currentValue.slice(cursorPosition);
                if(MAInput.value[cursorPosition] === "]") MAInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                else {MAInput.value = newValue; MAInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);}
            }
            if(key === "Backspace" && isBracketValid(MAInput.value)) {
                e.preventDefault();
                const cursorPosition = MAInput.selectionStart;
                const currentValue = MAInput.value;
                if(MAInput.value.substring(cursorPosition - 1, cursorPosition + 1) === "[]") {
                    const newValue = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition + 1);
                    MAInput.value = newValue;
                    MAInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                }
                else if(MAInput.value.substring(cursorPosition - 2, cursorPosition) === "[]") {
                    const newValue = currentValue.slice(0, cursorPosition - 2) + currentValue.slice(cursorPosition);
                    MAInput.value = newValue;
                    MAInput.setSelectionRange(cursorPosition - 2, cursorPosition - 2);
                }
                else {
                    const newValue = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition);
                    MAInput.value = newValue;
                    MAInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                }
            }
        });
        contentContainer.appendChild(MATitleContainer);
        MATitleContainer.appendChild(MATitle);
        contentContainer.appendChild(MAInputContainer);
        MAInputContainer.appendChild(MAInput);
        MAInputList.push(MAInput);
    }

    function isBracketValid(str) {
        let strArr = str.split('');
        let left = [];
        for(let i = 0; i < strArr.length; i++) {
            if(strArr[i] == '['){
                left.push(strArr[i]);
            }
            else {
                if(strArr[i] == ']' && left.pop() != '['){
                    return false;
                }
            }
        }
        return left.length == 0;
    }

    let allInputList = ratingInputList.concat(MCInputList, MAInputList);

    for(let i = 0; i < allInputList.length; i++) {
        let prev = i - 1;
        let next = i + 1;
        if(prev < 0) prev += allInputList.length;
        if(next == allInputList.length) next = 0;
        allInputList[i].addEventListener("keydown", function(e) {
            if(e.keyCode === 38) {
                allInputList[prev].focus();
            }
            else if(e.keyCode === 40) {
                allInputList[next].focus();
            }
        });
    }

    function getSN(str) {
        let SN = "";
        let pos = 0;
        while(pos < str.length) {
            if(!isNaN(parseFloat(str[pos])) && isFinite(str[pos])) {
                SN += str[pos];
            }
            else break;
            pos++;
        }
        if(SN.length != 0) return SN;
        else return str;
    }

    //SubmitButton
    if(continuousMC.length != 0 || continuousMA.length != 0 || rating) {
        canFocus = true;
        if(continuousMA.length > 0) focusWhat = 2;
        if(continuousMC.length > 0) focusWhat = 1;
        if(rating) focusWhat = 0;
        let submitButtonContainer = document.createElement("div");
        submitButtonContainer.style.width = "90%";
        submitButtonContainer.style.margin = "5%";
        submitButtonContainer.style.display = "flex";
        submitButtonContainer.style.flexDirection = "column";
        submitButtonContainer.style.alignItems = "center";
        let confirmButton = document.createElement("button");
        confirmButton.style.paddingLeft = "20px";
        confirmButton.style.paddingRight = "20px";
        confirmButton.style.height = "30px";
        confirmButton.style.marginBottom = "3%";
        confirmButton.textContent = "Confirm";
        confirmButton.addEventListener("click", clickConfirmButton);
        let randomButton = document.createElement("button");
        randomButton.style.paddingLeft = "20px";
        randomButton.style.paddingRight = "20px";
        randomButton.style.height = "30px";
        randomButton.style.marginBottom = "3%";
        randomButton.textContent = "Random";
        randomButton.addEventListener("click", clickRandomButton);

        contentContainer.appendChild(submitButtonContainer);
        submitButtonContainer.appendChild(confirmButton);
        submitButtonContainer.appendChild(randomButton)

        filler.addEventListener("keydown", function(e) {
            if(e.keyCode === 13) {e.preventDefault(); clickConfirmButton();}
            if(e.altKey && e.keyCode === 82) {e.preventDefault(); clickRandomButton();}
        });
    }

    function clickConfirmButton() {
        for(let i = 0; i < MCInputList.length; i++) {
            if(MCInputList[i].value == "") continue;
            MCInputList[i].value = MCInputList[i].value.replace(/\s*/g,"");
            MCInputList[i].value = MCInputList[i].value.toUpperCase();
            if(MCInputList[i].value.length != continuousMC[i][1]) {
                MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                MCInputList[i].value = MCInputList[i].value.trim();
                window.alert("Wrong input length!\nError position: Multiple Choice (Single Answer) Line " + (i + 1));
                break;
            }
            else {
                for(let j = 0; j < MCInputList[i].value.length; j++) {
                    let correctChoice = false;
                    if(MCInputList[i].value[j] == "*") {
                        continue;
                    }
                    for(let k = 0; k < field[continuousMC[i][0] + j].children[1].children.length; k++) {
                        if((field[continuousMC[i][0] + j].children[1].children[k].children[1].innerText.length == 1 && field[continuousMC[i][0] + j].children[1].children[k].children[1].innerText[0].toUpperCase() == MCInputList[i].value[j]) || String.fromCharCode(65 + k) == MCInputList[i].value[j]) {
                            field[continuousMC[i][0] + j].children[1].children[k].children[0].children[1].click();
                            correctChoice = true;
                        }
                    }
                    if(!correctChoice) {
                        MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                        MCInputList[i].value = MCInputList[i].value.trim();
                        window.alert("Match choice failed!\nError position: Multiple Choice (Single Answer) Line" + (i + 1) + " " + field[continuousMC[i][0] + j].children[0].innerText.split('\n')[0]);
                        break;
                    }
                }
            }
            MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
            MCInputList[i].value = MCInputList[i].value.trim();
        }
        for(let i = 0; i < MAInputList.length; i++) {
            if(MAInputList[i].value == "") continue;
            MAInputList[i].value = MAInputList[i].value.replace(/\s*/g,"");
            MAInputList[i].value = MAInputList[i].value.toUpperCase();
            let multiList = MAInputList[i].value.match(/\[[A-Z]{2,}\]|[*]+?/g);
            let allList = MAInputList[i].value.match(/\[.+?\]|[*]+?/g);
            if(multiList == null || multiList.length != continuousMA[i][1] || multiList.length != allList.length) {
                window.alert("Wrong input length!\nError position: Multiple Choice (Multi Answer) Line " + (i + 1));
                break;
            }
            else {
                for(let j = 0; j < multiList.length; j++) {
                    if(multiList[j] == "*") {
                        continue;
                    }
                    for(let k = 0; k < field[continuousMA[i][0] + j].children[1].children.length; k++) {
                        if(field[continuousMA[i][0] + j].children[1].children[k].getAttribute("class") == "ui-checkbox checked") {
                            field[continuousMA[i][0] + j].children[1].children[k].children[0].children[1].click();
                        }
                    }
                    for(let x = 1; x < multiList[j].length - 1; x++) {
                        let correctChoice = false;
                        for(let k = 0; k < field[continuousMA[i][0] + j].children[1].children.length; k++) {
                            if((field[continuousMA[i][0] + j].children[1].children[k].children[1].innerText.length == 1 && field[continuousMA[i][0] + j].children[1].children[k].children[1].innerText[0].toUpperCase() == multiList[j][x]) || String.fromCharCode(65 + k) == multiList[j][x]) {
                                field[continuousMA[i][0] + j].children[1].children[k].children[0].children[1].click();
                                correctChoice = true;
                            }
                        }
                        if(!correctChoice) {
                            window.alert("Match choice failed!\nError position: Multiple Choice (Multi Answer) Line" + (i + 1) + " " + field[continuousMA[i][0] + j].children[0].innerText.split('\n')[0]);
                            break;
                        }
                    }
                }
            }
        }
        if(rating) {
            if(ratingInput.value == "*" || ratingInput.value == "") return ;
            let ratingChoice = document.getElementsByClassName("rate-off rate-offlarge");
            let ratingMatch = false;
            for(let i = 0; i < ratingChoice.length; i++) {
                if(ratingChoice[i].getAttribute("dval") == ratingInput.value) {
                    ratingChoice[i].click();
                    ratingMatch = true;
                }
            }
            if(!ratingMatch) window.alert("Match choice failed!\nError position: Rating");
        }
    }

    function clickRandomButton() {
        if(rating) {
            let maxRating = 0;
            let ratingChoice = document.getElementsByClassName("rate-off rate-offlarge");
            for(let i = 0; i < ratingChoice.length; i++) {
                if(maxRating < ratingChoice[i].getAttribute("dval")) maxRating = ratingChoice[i].getAttribute("dval");
            }
            ratingInput.value = Math.floor(Math.random() * maxRating) + 1;
        }
        for(let i = 0; i < MCInputList.length; i++) {
            let ans = "";
            for(let j = 0; j < continuousMC[i][1]; j++) {
                let flag = true;
                let u = field[continuousMC[i][0] + j].children[1].children.length;
                for(let k = 0; k < u; k++) {
                    if(field[continuousMC[i][0] + j].children[1].children[k].children[1].innerText.length != 1) flag = false;
                }
                if(flag) ans += field[continuousMC[i][0] + j].children[1].children[Math.floor(Math.random() * u)].children[1].innerText;
                else ans += String.fromCharCode(65 + Math.floor(Math.random() * u));
            }
            ans = ans.replace(/(.{5})/g, '$1 ');
            ans = ans.trim();
            MCInputList[i].value = ans;
        }
        for(let i = 0; i < MAInputList.length; i++) {
            let ans = "";
            for(let j = 0; j < continuousMA[i][1]; j++) {
                ans += "[";
                let flag = true;
                let tempList = [];
                for(let k = 0; k < field[continuousMA[i][0] + j].children[1].children.length; k++) {
                    if(field[continuousMA[i][0] + j].children[1].children[k].children[1].innerText.length != 1) flag = false;
                    tempList.push(k);
                }
                let sortList = [];
                for(let n = 0; n < 2; n++) {
                    let rand = Math.floor(Math.random() * tempList.length);
                    sortList.push(tempList[rand]);
                    tempList.remove(rand);
                }
                sortList.sort();
                for(let n = 0; n < 2; n++) {
                    if(flag) ans += field[continuousMA[i][0] + j].children[1].children[sortList[n]].children[1].innerText;
                    else ans += String.fromCharCode(65 + sortList[n]);
                }
                ans += "]";
            }
            MAInputList[i].value = ans;
        }
    }

})();