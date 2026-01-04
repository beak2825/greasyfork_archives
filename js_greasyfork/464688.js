// ==UserScript==
// @name         WJX producer
// @namespace    https://blog.csdn.net/SundaySmarty
// @version      1.0.12
// @description  Make producing wjx easier
// @author       SundaySmarty
// @match        https://www.wjx.cn/mysojump/questionnairemng/designnew.aspx*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAADVNJREFUeAHtWg2UlUUZfua7d+8uyI8imloiGAologdRSLcASc2TipBJCKIoooIooMc4JIWdEDyUYB31oPmTldqiiFpoBuwC8hNgpUZBWWElFhAgy8/uvd/9pueduXN/9i679+79wVPOntmZ+/3MzPu8z/vOOzMf8HH6/0ZAlV18rRUeqH+C/Z4HD69gaqfpZR9DWofhtHp5qg/uvwpKXZ/obHJ5Oj18L97hb5XgTq0m4Go2FLv1vD04u8OqEvSSV5PlBeDtxvFQodPIAOLgLcUQ5WuNsP4zjstr1EV8uHwALNTtKfg3KTm1HxIGvGTkeBtfxIe4sYgy5dVU+QCIBVMIwIlGeOU1on3kNTNSH1fDx01kQvkdMgdQHgB+pI+leHeT/iSAYcAK3Kjq9SZUIIYrmU/FSjLhCKTyAHAAMyh4Z9JeqM+sLP19XEThjyEDgCgmHAH5y8CAhbobe5lEoY35I6Q0f79shPUxkgDAABBgmP4lji83CKVnQAjfRgiVzIBEHSFsxM3qA70ZEQo/DHFeExCiNIdDGMdaWVNpAXhKn0FtX2uEFwAke1hiJNyJSyh4ZyO8Y0G0/M6wtAB4mEOBvQwAIrD2H0MvQ32xf8eCGD6Nn+JCA1CZ/pUOgGd0NUW/PEF7q/0Q3sUY9QcjW4CfGwBE+44BAsah8jrD0gHgYW6G5q0PsNqnnOoSbKHmf5NkgZ0JxCFeqR8pnzMsDQA1+gpq/4IsAEIJ+hsK8F8XLEKA7Uk/IExopHM8gOvdI6Uuiw+A1mLz9xnhrde33r8Cu3AV1mQIVIVXqWufTHifs4A1BWsSZYsMiw/AS7iOwp9hAJDWreeX8hUGQ0E6AGoA3qK+fcaBXegr1pIJ2gDRiJ6YiSHpz5aqXlwAanUVBb3XOD7RfnpuSv+UREsodjv0wPkEYjsnxjdoFn8pV2TI8KwNqUaHsJ9aO7S/KxpjXdEQOw5Rlqd36YVj2k1rpsVDXPB2RX91sOk9/QaqKexqMxWKIxQTkGlxH/5BdrxKfmwkIBsI0WZ1tbnTtImCfmcD8JYewEH0pjPqys67sk4hOXypRxPZp/CNMYUoDbeROcpR+/5WDDjpFDq/KmrUJmld6hL6DlXDElczCq4CPdQZR/gJ9pGKCaTusgDi4yCBkFljI9vcwPpGdTuZUmAKx6dgktcOy9UcTks2vc+V24Mc1oBk22IoIoyzaRmQWdTQwEPMYR1Dn2N8aqwq+Y5URHh5TzXx/nIvkbg4DHSdWRvc5K5llbad9myvmveqTbscg/4edhtA4gmWRAjK3fhX1vstXFCxqVjHHaozaa8Tw/fjafPsZi1T0XxqfKKhZLqHdvUoRyUMEO13UsvR86ihWf1YfgWk7wnop3Zm3U9cIACXsp+lpq90rYs5yG/LAFtKvaUc0HQ0AYlbllAlm9QsGtRhkordwSkojJMIgizXn/KqMIkvWFtdr8eQ/gsJRHszOBmQA0DqMV+jg16BHhVWeKdxKVPpDQxUn0/9zK6ZhdF27KCwnY3ATnAHhgNB5hBXbw4Euc8cyD2WmiXXnpq/t9LUNlRo3KLmM9ZMS0LqUaRhQ4Kq1xO5TXoW+phnBqqfcI02kJ79XUN/0SgZb+oe7bZbeC1Oo/Dp3j69HqEuIpwVWknqDMKquGcgwDkQm74jfTtgLbOaPgEKabK7LXsvvCQ/e/PfWOI6rulLchP+nRhB7S+icLJ0gScL0xAmq5l43LywSXemtd1P9E8kI2TS2kZSf4rPVjRtMPlbsw2FF9BXLUpea6XC/YDRhKKabKtkX4rZM2WQKOMs47wupdyXMkj7LQ6V141jlet8j9pXHLG5HmhsiyzI3H80AMi44l/HrXzsYdm1YgllNfkMSXmzmsRJ7380JQEQ+eIzuHmhMFOEN0AICBX4Eyk+Uk3F7z6qGDCW6EjWaPImbiLLcxCX2SWX8WYAIC/EZ+IxznDjhQWG4AJChD4ijGnqNjwiz3xUktlU3WZWndOMbxKDtMyVMfPEgYCEsY4zwZX0M7ubG3cWALqGTW3GYv6/ItmYZYIAsggdMF6NOfy00lwnpbhG4bvhj9w+CdFnuPGll7b+EllxjeqfmNWaGYjoOSOZcLMzvkb81iZvCEzigQN8lVz4rX4a/ZP3jkBFr8VwzvaP0eFVU8ekLbObHt3UGeD7XF2MaEl4GXoWAHJRTaMH78jdHEWMJaVPP5pLlgBr9LO43dwr4z8eoVXqlfgBZ4rnOAl/NitwskAEHN9UdSHuyMUPZJlAujwMNU9mY+tIs08m/YFQS3KEuZIbnFW4QV2GPenvlaKua7lEDvAztt2PBvgW3sNZZkwyDmf7ETN9j1ZfwYu5jqFZBriX1Z0kWoi7twp73TVTOtg0T3V8msRSBkslTPp1jGL8IQuhfobqOwm4ixallBwwkozzuDUP4WXILQIgD9AcNhuHKNGiM4XM8hQCtEovx10MQBw08mrBibbeTr9KW4/hGQrX0QgvNr47LTS3QGzl1YFqFH6db6etAiANctm5mlCNYpa4KpVcXZOEAeZhFV4oFgikfBg7sYz2Pj7DyYmdN5pI0To+n71qfE6Nxd9SA8u9lhMA0pyaSHvXPOIS7acET/Vkrw3nGuy21MUCanu4EvXpx51XTy+jBMdS/1lCfzHH1mYflDMAIoq6lStDcHHjTECEbgqG5m5wMVKcDvjwU5xsjtyHezCa7GwspLu8AJCO1E2YRaEfNZ0KEE3BUHRWxUhxHpinaz29fjJe5Ic23+A053pvc495A2B62sodnn34fVavMhwPz2ddb8sFD69Tyx9m2L8DoUOTnae2tJ94p20AAEPpcjoR/6Y7LZvUufhrAeNJvsqINEo7X2JYkB7pSV2jR/LBAittA6ASgxkIdeMu4jumf0fEkAlUChxSxus1ST/g/IEF48gBoOfjaHres00kGNDh7cWbxhEKCIqLpWKmM/EranuvAUEWtw6EgOF4kVL+DPAwiBboGQAkDP13wgsrrFcXMEDNIemN6MV4QQLqFhMXMjEK/WJScAcAd6YYfVa2+HKON/MHQOgvsbd0LwBohqfiCzzUtNYnFzIX61X0Hg00njX4QK9jkNNairNdp30pJct22DZ0b+3VXO7nD0AFz+xEeAeAnAUcpOZboL9EdXoZZtOtvUa+dDeckUOWBjxGUJ7T6+lQD5fCWE6h92SwQECIFccR5gUAN0u6UPC+RvOOBQLEIbyphuCfzcnAjc6TUY86PjODAPA0yQzebq9LvZEfSu3ngqoO5zb3vrq5GTMQAGRZXoSUFwDsbxAXRsoAkGIAqMlmFyH6ee4p7ONeYpTO0gprV24Su0mWa/b6qQRojX4Ndza7lkg3AzsLHBkGUHCZ/ux+gDBA6hEStGPiszf+lESmRPSP8QCBeZkCdkkKmg5CSngHQgWf/y4/nPkFHVzmt8Pn0Azi+I+xf+cHihQL5MeACO1ffHcmCHVchm43kovwT5Ca9XRxUUxNaDelaQdASvuaYr2DrahjXs395/U8gumAD/BD/Ti3uxKJ5uXzL3M28IvjA1qditwg6MjkpNieGIkWBLoAT7CcknzmYe4ZRrl+1zxNUIln5KbUXZbfoLh/p5gN3OUJ81zS7ehIKUkO5ipwmX6SjvMo3Js4FpegKH3WONU8W+C/3BkQof2HE/YvK/VKbjUP5xe/w1DPgVbpB7ll7nPKiibO9yRuF41LaZeuUpdDyxG4AZ+hD5jN9hqM8M6hWpNyM4zH+zMJ5mwj4/moJeC7xAy0NYOjTVBmbrb9X+4AhEh/GWgFP3XpiD7qS/bIWy/g93676ARjuMUIbHdorNBOeB8reP8ievTz1ASu5LiKU3O52dGT2o/gOwRTvhN1PsXu8TkzC3EHmMmYgcZiIzwdoSnrCzeD3AEIcyu8EhPUIFzBiG+HDErPxVjS9U1qtq/RsgicElpT20uYB3DNPpR5mbyTntQ4NKgZ1HIlNzgrufyVmcWCnNp4DeN0zg49E+/JV2XsmNmyoEfiepuLnHwApyaPruoa1deu9PQ8WuZBPKQbcB21ae1bhmDrAsGzDI/mclPVfhQp91pIarL5OGMwZ45x7GkeqX8ssz2JFkBCuIz/F3AjvJb7wTspv5kl+MlVwX4gJwZQyCAp/EzStp5H6D6/BhN7FDqKyAFn8gAPsdZT3YOx6q7chOfzyaSuxZOMCXtT+KeSJiFAhPFleUicIZWxOKF9flpSThPgAOLTMYECb4jzG6KAQhvB49jHQc3l7e7qW7iNwr8ng21rUpdjF7e2xxEAmXK3GCDC+ILeQs/D5AWoEdAT4JfJBGahU3AAj1LokY7yZPsO0nWBOhoPe9O5c1PkpC5FHb8cOYurgOk0gRn8ZOcidrGYS6+VaiN2UPvHk74FA5CTCfj70S/ug4fOHEIc79H2JnsnoHtoLuaoEgjvsJQvR1Q1j+yraHYh+h0mExNofnhhnWH3ZkNn10AOJRWZW9ILUeFvwaBwZ9SpWcbX5/ZiCZ6K3YXBNINasnFleCBnmBJ8P1iCYRevST0LXnQKntZT+bHOx+ljBApC4L9OPJvWSf3AzQAAAABJRU5ErkJggg==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464688/WJX%20producer.user.js
// @updateURL https://update.greasyfork.org/scripts/464688/WJX%20producer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("beforeunload", function(e) {
        e.preventDefault();
        GM_deleteValue("execOnce");
    });

    if(!GM_getValue("execOnce", false)) GM_setValue("execOnce", true);
    else {return ;}

    function sleep(time){
        return new Promise(resolve => setTimeout(resolve, time));
    }

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if(index > -1) {
            this.splice(index, 1);
        }
    };

    function getRadioValue(radioName){
        let radio = document.getElementsByName(radioName);
        for(let i = 0; i < radio.length; i++){
            if(radio[i].checked) {
                return radio[i].value;
            }
        }
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

    // Basic structure
    let producerButton = document.createElement("button");
    producerButton.textContent = "WJX producer";
    producerButton.style.paddingLeft = "20px";
    producerButton.style.paddingRight = "20px";
    producerButton.style.height = "30px";
    producerButton.style.textAlign = "center";
    producerButton.style.background = "thistle";
    producerButton.style.color = "white";
    producerButton.style.border = "1px solid thistle";
    producerButton.style.borderRadius = "4px";
    producerButton.style.position = "fixed";
    producerButton.style.top = "0";
    producerButton.style.right = "0";
    producerButton.style.zIndex = "2000";
    producerButton.addEventListener("click", clickProducerButton);

    let producer = document.createElement("div");
    producer.style.width = "40%";
    producer.style.height = "100%";
    producer.style.background = "white";
    producer.style.position = "fixed";
    producer.style.top = "0";
    producer.style.right = "0";
    producer.style.display = "none";
    producer.style.zIndex = "1000";

    let producerContainer = document.createElement("div");
    producerContainer.style.width = "80%";
    producerContainer.style.height = "80%";
    producerContainer.style.padding = "10%";
    producerContainer.style.overflowY = "auto";
    producerContainer.style.overflowX = "hidden";

    let producerHeaderContainer = document.createElement("div");
    producerHeaderContainer.style.width = "90%";
    producerHeaderContainer.style.textAlign = "center";
    producerHeaderContainer.style.margin = "5%";

    let producerHeader = document.createElement("p");
    producerHeader.innerHTML = "WJX producer";
    producerHeader.style.fontSize = "24px";
    producerHeader.style.fontWeight = "bold";
    producerHeader.style.color = "black";

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
    usageContainer.style.width = "80%";
    usageContainer.style.height = "80%";
    usageContainer.style.padding = "10%";
    usageContainer.style.overflowY = "auto";
    usageContainer.style.overflowX = "hidden";

    let usageHeaderContainer = document.createElement("div");
    usageHeaderContainer.style.width = "90%";
    usageHeaderContainer.style.textAlign = "center";
    usageHeaderContainer.style.margin = "5%";

    let usageHeader = document.createElement("p");
    usageHeader.innerHTML = "WJX producer usage";
    usageHeader.style.fontSize = "24px";
    usageHeader.style.fontWeight = "bold";
    usageHeader.style.color = "black";

    let usageContentContainer = document.createElement("div");
    usageContentContainer.style.width = "100%";

    document.body.appendChild(producerButton);
    document.body.appendChild(producer);
    producer.appendChild(producerContainer);
    producerContainer.appendChild(producerHeaderContainer);
    producerHeaderContainer.appendChild(producerHeader);
    producerContainer.appendChild(contentContainer);
    producer.appendChild(usageButton);
    producer.appendChild(usage);
    usage.appendChild(usageContainer);
    usageContainer.appendChild(usageHeaderContainer);
    usageHeaderContainer.appendChild(usageHeader);
    usageContainer.appendChild(usageContentContainer);

    writePInUsage('A textbox will appear when you enter WJX Producer.');
    writePInUsage('The format of your input in this textbox is "S/N of your question; number of choices; score of each question; available choices"(no quotation marks).');
    writePInUsage('For example, if you enter "1~2,5;4;1;ABCDEFGH", then Question 1, 2 and 5 will be produced. Each of the three questions will have 4 choices and a score of 1. The available choices of question 1 and 5 will be ABCD and the available choices of question 2 will be EFGH.');
    writeImgInUsage("https://s6.imgcdn.dev/rSdRe.png");
    writePInUsage('After clicking Confirm Button, you can set answers for each of your questions as shown below.');
    writeImgInUsage("https://s6.imgcdn.dev/rSWUC.png");
    writePInUsage('Answers of multi-answer questions should be entered in a format of [Answers] like [AC].');

    let canFocus = false;
    function clickProducerButton() {
        if(producer.style.display == "none") {
            producer.style.display = "block";
            producerButton.textContent = "Close";
            if(canFocus) {
                MCNumInput.focus();
            }
        }
        else {
            producer.style.display = "none";
            producerButton.textContent = "WJX producer";
        }
    }

    function clickUsageButton() {
        if(usage.style.display == "none") {
            usage.style.display = "block";
            usageButton.textContent = "Close";
            producerButton.style.display = "none";
        }
        else {
            usage.style.display = "none";
            usageButton.textContent = "Usage";
            producerButton.style.display = "block";
            if(canFocus) {
                MCNumInput.focus();
            }
        }
    }

    function writePInUsage(text) {
        let p = document.createElement("p");
        p.style.width = "90%";
        p.style.margin = "5%";
        p.style.fontSize = "18px";
        p.style.color = "black";
        p.style.wordBreak = "normal";
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

    let testQuestionBar = document.getElementById("divKaoShiT");
    let MCNumInputList = [];

    if(testQuestionBar.style.display != "none") {
        var MCHeaderContainer = document.createElement("div");
        MCHeaderContainer.style.width = "90%";
        MCHeaderContainer.style.margin = "5%";
        var MCHeader = document.createElement("p");
        MCHeader.innerHTML = "Multiple Choice";
        MCHeader.style.fontWeight = "bold";
        MCHeader.style.fontSize = "20px";
        MCHeader.style.color = "black";
        contentContainer.appendChild(MCHeaderContainer);
        MCHeaderContainer.appendChild(MCHeader);

        var MCNumInputContainer = document.createElement("div");
        MCNumInputContainer.style.width = "90%";
        MCNumInputContainer.style.margin = "5%";
        var MCNumInput = document.createElement("input");
        MCNumInput.setAttribute("type", "text");
        MCNumInput.style.width = "100%";
        MCNumInput.style.height = "30px";
        MCNumInput.style.fontSize = "20px";
        MCNumInput.addEventListener("beforeinput", e => e.data && (/[\w\;\~\,]+/.test(e.data) || e.preventDefault()));
        contentContainer.appendChild(MCNumInputContainer);
        MCNumInputContainer.appendChild(MCNumInput);
        MCNumInputList.push(MCNumInput);

        var singleMultiContainer = document.createElement("div");
        singleMultiContainer.style.width = "90%";
        singleMultiContainer.style.margin = "5%";
        var single = document.createElement("input");
        single.setAttribute("type", "radio");
        single.setAttribute("id", "single");
        single.setAttribute("name", "MC");
        single.setAttribute("value", 0);
        single.setAttribute("checked", true);
        let singleLabel = document.createElement("label");
        singleLabel.innerHTML = "Single Answer ";
        singleLabel.style.color = "black";
        singleLabel.style.fontSize = "15px";
        singleLabel.setAttribute("for", "single");
        var multi = document.createElement("input");
        multi.setAttribute("type", "radio");
        multi.setAttribute("id", "multi");
        multi.setAttribute("name", "MC");
        multi.setAttribute("value", 1);
        let multiLabel = document.createElement("label");
        multiLabel.innerHTML = "Multi Answer ";
        multiLabel.style.color = "black";
        multiLabel.style.fontSize = "15px";
        multiLabel.setAttribute("for", "multi");
        contentContainer.appendChild(singleMultiContainer);
        singleMultiContainer.appendChild(single);
        singleMultiContainer.appendChild(singleLabel);
        singleMultiContainer.appendChild(multi);
        singleMultiContainer.appendChild(multiLabel);

        var submitButtonContainer = document.createElement("div");
        submitButtonContainer.style.width = "90%";
        submitButtonContainer.style.margin = "5%";
        submitButtonContainer.style.display = "flex";
        submitButtonContainer.style.flexDirection = "column";
        submitButtonContainer.style.alignItems = "center";
        var confirmButton = document.createElement("button");
        confirmButton.style.paddingLeft = "20px";
        confirmButton.style.paddingRight = "20px";
        confirmButton.style.height = "30px";
        confirmButton.style.marginBottom = "3%";
        confirmButton.textContent = "Confirm";
        confirmButton.addEventListener("click", clickConfirmButton);
        var modifyButton = document.createElement("button");
        modifyButton.style.paddingLeft = "20px";
        modifyButton.style.paddingRight = "20px";
        modifyButton.style.height = "30px";
        modifyButton.style.marginBottom = "3%";
        modifyButton.textContent = "Modifier";
        modifyButton.addEventListener("click", clickModifyButton);
        var revealButton = document.createElement("button");
        revealButton.style.display = "none";
        revealButton.style.paddingLeft = "20px";
        revealButton.style.paddingRight = "20px";
        revealButton.style.height = "30px";
        revealButton.style.marginBottom = "3%";
        revealButton.textContent = "Reveal";
        revealButton.addEventListener("click", clickRevealButton);
        var backButton = document.createElement("button");
        backButton.style.display = "none";
        backButton.style.paddingLeft = "20px";
        backButton.style.paddingRight = "20px";
        backButton.style.height = "30px";
        backButton.style.marginBottom = "3%";
        backButton.textContent = "Back";
        backButton.addEventListener("click", clickBackButton);
        contentContainer.appendChild(submitButtonContainer);
        submitButtonContainer.appendChild(confirmButton);
        submitButtonContainer.appendChild(modifyButton);
        submitButtonContainer.appendChild(revealButton);
        submitButtonContainer.appendChild(backButton);

        var covering = document.createElement("div");
        covering.style.width = "100%";
        covering.style.height = "100%";
        covering.style.background = "grey";
        covering.style.opacity = "0.4";
        covering.style.position = "fixed";
        covering.style.top = "0";
        covering.style.left = "0";
        covering.style.display = "none";
        covering.style.zIndex = "800";
        document.body.appendChild(covering);

        var load = document.createElement("div");
        load.style.width = "80px";
        load.style.height = "80px";
        load.style.position = "fixed";
        load.style.top = "50%";
        load.style.left = "50%";
        load.style.marginTop = "-40px";
        load.style.marginLeft = "-40px";
        load.style.display = "none";
        load.style.zIndex = "1200";
        document.body.appendChild(load);

        let loading = document.createElement("img");
        loading.setAttribute("src", "data:image/gif;base64,R0lGODlh8ADwAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgUFBQoKCg8PDxERERMTExQUFBYWFhgYGBoaGhwcHB4eHiAgICIiIiQkJCcnJykpKSsrKy4uLjIyMjY2Njs7O0NDQ0xMTFJSUllZWWBgYGNjY2VlZWdnZ2lpaWtra21tbXJycnd3d3t7e4WFhZCQkJiYmJ6enqKioqWlpaenp6qqqq2tra+vr7GxsbKysrS0tLW1tbm5uby8vL+/v8HBwcPDw8bGxsnJycvLy87OztHR0dTU1NbW1tjY2Nvb293d3d/f3+Hh4eLi4uTk5Ofn5+vr6+/v7/Ly8vb29vn5+fv7+/7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAgCsACwAAAAA8ADwAAAI/gBZCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADC05aZYgMExgwmJAxpMpgsTIuGJhMefIFGY+9OglRuTPlEE4ya4XhuTRlEqKvTjHN2kCM1FVNtGY9A7bUGrNb17D9tIqG3K158G4KBHhrB0SGL41hvDWG0MqRlmjeOgSW6EclU2dtArtRDNtb/sPwTlR2eNa7yQeVcZ61gyPqgQ5pzxpE/J9VtNP3rOK+T/b7lUaDfz1xFmBnDyxB4E5UHOjZCAvuRIODnb0WYU4vUFgZEhfm5IKGk0HYIU4ogGgAZiPeNJ2GDUSR4k0GUnjCizYxUQGIP9BY0w8ghqBjTQBSWNuPM6WgYQTXESkTCBpaqCRMTWj4wBRPxhTkgS9UGRMJFDYghZYvNfEAhVmC6dIMFDpApZktjUChk2yq5ASFFMTZUoYODmmnShY4aN+eKqHpYI6ApsTkgd0VihIOFLqo6EkiOAjnoyPt4KAHlELq4BCZlnSDgy10WpIHB1YgKklX0kfoqSBdMWaA/iuwKlILB0Yga0hHbHorSJEGON6uHgm635/AduSgo8VutOJ+6SWrEW4BouAsRwduMO1Gbgb4xLUZpXreDdxipMSBoYZ70QYBimDuRSXu58C6FkG7H4fwTiTFgc3WG1Gf+5Wpb0TLtofavxExt5+1BEPUw4FXJPxQFAcq4fBDr9Lnw8QOHUqfnhgrZB59v3asEGn7zSiyQsK2J+LJCC08LMsJ5bofBjAjBPF+D9SM0IFJ6kxQxe1R4XNBN+4HxdAE/bafgkgLROp+STQtkMbtwSc11ecZITUrWIen9dUBWt300/RFLbXS9DHddNH0bSs10Oet2TTPUt9MX85Sy0zf/gVbu0wfsUinfN7KSJNMn8lNf9xeyEh3vR3HQ8Md3sVN202fxE37TV/DTRtMH8JNB3zewE3zS5+/Q1PRQID5+nzFgfQiPW6AW3u7Hc1SF7dfCVs3uB/kQ8cYXgdfbq0CfSlsLRCP7QmhvEAnnDfp1pLPBsHzBOmwXXLYD0QEBMA9oEP3BnluGuLkFyRECh90FoIKq6aP0BQ+wACE0PLnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDnrwgyAMoQhHSMISmvCEKEyhClfIwha68IUwjKEMZ0jDGtrwhjjMoQ53yMMe+vCHCkAMohCHSMQXBQQAIfkECQIAvAAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAwMDBAQEBQUFBgYGBwcHCQkJCwsLEBAQFRUVGRkZGhoaGxsbHR0dHh4eHx8fISEhIiIiJCQkJycnKSkpKioqKysrKysrKysrKysrKysrLCwsLCwsLCwsLS0tLS0tLS0tLi4uMTExMzMzNjY2Ojo6Pj4+QkJCRUVFSEhISkpKTExMTk5OUFBQUlJSVVVVV1dXWlpaXFxcX19fYWFhYmJiY2NjZmZmaGhobGxscHBwc3NzdnZ2eHh4enp6e3t7fX19fn5+gICAhYWFjIyMkZGRlZWVmZmZnJycn5+foaGho6OjpaWlp6enqqqqrKysr6+vsLCwsrKytbW1u7u7wcHBxsbGycnJzc3Nz8/P0tLS1dXV19fX2NjY2tra3d3d3t7e39/f5eXl5+fn6urq7Ozs8PDw9PT09/f3/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AeQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTPgmHDFwCpMdY4TGBQOQLdAgYkWxVyqQM2uGHMSyVjo1NouG3OGNZ6tsRquGDOU0VQ2rV2NxHdVI7NhfaDsNczv2gzG6mRbpHVsDm+BKZRCPHaMO8qN0lt/u8dzoGOm3l1QnGgX77Svbhf5y8e67THigbsjHhnEeKAj1q4m09/kD/uoq83lWsa9agpr8O4XGn2g1AKiTHAOO1pqBOPGW4GZmMIjTEQ9qVqCENwlRYWZSYHiTDhsaQIFpHtYUQ4hAlFjTGo9tCIaKNDlYYQww0iRFiFTUOBMRG2bgnI4xwbDhE0DGlFqFEshRJEw3VpjEkjDlUKEDiUHZEhsTOGmlS1NsqOSWLAmYIJFgrtRGhRaUyVISFU6h5koYPPjCmyph9uCLdKIkZILU5XnSeA+S6GdJMzy44KAkffFgCYiapFyCYjRKkhYPGiEpSSIkeMGlIzU5IJ6cflQHBQkWEWpItg246akfmfFgpP6sevQof9rF2lGXA7Jna0eB7soRiAOC56tGVyTY2bAaJfgBshrZkKAbzGLkqX1aRHtRGgkeYe1FHwwow7YWDTEgBOBWVOyAZ5Q7ERwJzqauRHHy9+S7EQFrHw70RvTEgMvm+5CiA/7oL0NvJJjGwA6Ryh+oCCu0p31uNrxQDwPWKnFCSwyY4sUJ2WnfhRwfBMaAc4Z8UBkDamDyQQXzR8HKByUoMMwCZcnflzQL1KJ90OYskAcD/uczL5nyl+7QLwxo3tAPw7e0z02r93TOSfM3Nc1F23e0z0DzJ7TPO8PXs88224dzzjIP3bJ9Lw+NMn8qDz0yfyX77DF8NgzNS/7G/G3sM8X8MaF31OTlOLTC9jEM89r2HewzwPzNDPO+/PXrs73w4Tt0vPbNmzO7wQ59Ln8R+iwuf+QO3bV93/qMRrZDTwtfFkM7O2AbQyfogejGDo05fMKinaCgMOPKn645z2qfxTC7CqnPqfKHAdKl+lzHAwkqbjIZmg7d3YCWXv489AOGoDcWAx6a8xkDEp+zBfaxoLdAUsKnvs/XqdfE/AOx6V0H/CPIe7CztQDyQnm36ZABCYK+27xgDQs0yBnEJBrmRbAgaegCFICAAyVgYQxnu6AIR0jCEprwhChMoQpXyMIWuvCFMIyhDGdIwxra8IY4zKEOd8jDHvrwhzFADKIQh0jEIhrxiEhMohKXyMQmOvGJUIyiFKdIxSpa8YpYzKIWt8jFLnrxi2CES0AAACH5BAkCALIALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQMDAwQEBAUFBQYGBgcHBwgICAkJCQwMDBAQEBUVFRsbGxwcHCIiIicnJywsLDExMTQ0NDg4ODw8PEJCQkhISExMTE5OTlBQUFJSUlVVVVdXV1xcXF9fX2NjY2dnZ2tra25ubnBwcHR0dHh4eHp6enx8fH19fYCAgISEhIeHh46OjpKSkpaWlpiYmJqamp2dnZ+fn6GhoaSkpKampqenp6qqqq2trbGxsbS0tLm5ub6+vsXFxcjIyMvLy83Nzc/Pz9HR0dXV1dfX19jY2Nra2tzc3N3d3d7e3t7e3t/f3+Dg4OHh4eLi4uPj4+Xl5efn5+rq6u3t7fDw8PX19fj4+Pr6+vv7+/39/f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDhqcEuZFEDGKwPk5kMEDZgAQQL5w81splReXPlSnI2Hx1B+jTlTVoIT1VBerXlImwhooENuwGSGY75WAbdoUqupfa6G27g+PgSDcQt30C+dEty3vHcF60SPTePqgPlXHddoMl2oP+guhum0N4oNzJw15x3qd19bB5tOcJHf5rCU/m71RuH3UI/ToN1x9qNgCYE28DnsaEgTdNkeBpIDB4Ew0PgoaDhDaRUGFlE2SBYU0ebEhZCh/SJIUFIhpQRIkzGZGiByzOhEOKOcQok2cbXnCcjS91ICINPMIkhYgSdBHkSzeI+MKRL42wYQNcMNnSFBJsuKSULOWwIQReYMlSCBsC6aVKVWxowZgrwbChDmiqdEGF5rWJkg4bGiEnSj4+2NydJgmx4RZ8mvRBhQUGShIRFW5gaEmDPpjboiIFUSELkI7E34AXVCrSjA/aqelHYVDwIHufftTCg5mW6hETFR6hqkf+jQ4Iw6sdaZlgnLRuVKGHuWqkYYLZ9ZqRDw+SKGxGD2ZwbEZgJgjcshZxOuAP0Fr0xIMtVGvRZAPCqC1Frg34wLcUEZvgguRGxMWDwaYL0ZsDXunuQ7/2J8K8EFE4oLL4OvTegDv2q1B9A+YnMEOiDrjiwQvl2R+bDCt0QoLTRZxQDAkaa/FBdA7438YH/WsfriATtESCqZZMkBYJjqtyQQ8G/PIECXb58kAoDsjrzbJw218UPAt0qX1NBC0Lgv2BFzTS9ilhNNPwOb10gkrzPDR8RQfts30G85xzf1cYTfOARgb9YBhBszzgBEafjKnRIsNH8ssd9/cxzxgPiIL+0RPLarTD9tUYdML9LXwzwf1pxnPc8Mlcsr798ctzvfbdGzS8/cn78rrABm3ugFnfHG5/ERi9NXwfBO3Egy4EnWSCQQTd7IBYmJ2g5C9/3p8KQVNuH7U8VwjozbYO2EHQsfZX8cusOsrzqSjzHOqoPEs7oKcvXw3fmTdL+iClNyffn6svI/qgouFXWMPNfu56M+D9mXBz3QkaXjLmA869sZoVCl5ymRXinspmlyAx/W9DDyhbycZTIc1tzAobYsDwSqa7eN3MBRUq0s1C9CADqqxCOuKZ+OADsZvxrz/e4ln7+oO9mw2pP6kzmixMYJ8GAE2Gq4OPA4N2wutcSIZ0BMEfcTAARIOwIDoxLGJBksDA11igUEo8CA1E8DUDVCAEL4BCFBnShB3wIHRbDKMYx0jGMprxjGhMoxrXyMY2uvGNcIyjHOdIxzra8Y54zKMe98jHPvrxj4AMpCAHSchCGvKQiEykIhfJyEY68pGQjCQbAwIAIfkECQIAtAAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICBwcHDg4ODw8PEBAQEhISFRUVHBwcIyMjJycnLS0tMTExMzMzNzc3Ozs7Pz8/QkJCRUVFR0dHSUlJS0tLTU1NT09PUlJSVVVVWVlZW1tbXl5eYWFhYmJiZGRkZmZmaGhoaGhoaWlpampqb29vcnJydXV1eHh4fHx8gICAh4eHjIyMkZGRlJSUmJiYnJycnp6eoKCgo6OjqKioq6urrq6usLCws7OzuLi4vb29wsLCxsbGysrKzMzMzs7O0NDQ0tLS1NTU1tbW2dnZ29vb3d3d3t7e39/f4ODg4uLi5OTk5ubm6Ojo6enp6+vr7e3t7u7u8fHx9PT09vb29/f3+Pj4+fn5+/v7/f39/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AaQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEyteHDQLEh49kmhhvJWKCQsHMmu2UGIJZatEIGgerRkCjs9TUZBerZkDaqgVWMs+YKHKa6YsZs++cFtpEd26Q/RG2gG47hvDiz4xDjxI8qFBmANv8jwoDem6N1QHWhz7bBfbff56B/4jPM/u41lDkGJep430s4W3xzkE/mwd829OsT/bSX6bJ/DHGgj/1aSFgKzxUCBNQCBI2gOTLSgTBw6OpoKEMk0RW4WZHYFhTEdwmJlrH8K0g4gH9FAiTC6IOMGKMG0g4mkwtkQFil3U2NKJHNagY0sliLjFjytRIVqFPhKpEg8cQuCFkiqFwCGNUJ5UBYcVVJlSDRyqqOVJmDmowZcn9cChh2SWJKODKKRZUn0VRuimSB5UmMOcI/3mYAZ4joSegEr0GZIQFc4gaEgZOJjloR/xiCCajHJERgQOxhCpRzNUeGlHTlSYxKYc/WkfcqBqxCSC2pWqUYVZqJpRkP4IOufqRQ0iyMKsGDnIG64WSYngFbxW5Ch/QgRLURQOGmrsRBcg2MGyE7XgILQS1SrgE9RCdGCs2UIUJn9JdtsQrPyNIK5DOCC467kLGTEtuwttK2AU8C5EqYCQ1nvQmvx5qe9BqglI6r8GvSfgCgQfZKaAIiRskLsCjukwQU0gaMHEBGWBYAQYE/Rux7Qcyd+TIG/IHxYg09KsgFOknKiAUKSsAYL+gcyvfUykfDN8OYM8s4A1d/wyfzGDvDJ/LZeMIMogi2wfyR07aAbIGiOYcsUCXgwyxPxJ3PHC/MnXscH8IQxywPwNjPHO6fmL8b385euwvPzR2zHX/E3dcf66AkKQMrn2kZDyt/aFOzHd9smKsbX8YduxtH2nfLR9z3aMLILKYjysfcV27KuAwEaNoN8dM27frR0DnjjIrHZ8qoCpYiwqfGon3KmDn2KcqcUdT+ogDB1vbp/cBA8tYMeEJtvx7PDl7rCeCGLQcZ0O3jkxnA62OjHb8J2AMdiPYkw4f9JPzGWFbv97JYcYf44glQS/7iDU/xrZ48SqCyjnv8KD6/CNTcpRwrhnH/jpq0UcsoDe+Iei9MErRCIi0b80hCLisYtCIjLbv/InoAhoT18wQNEBFPSv24noAwkbn4Mcp6/diQg//9qCCMWmLwiKiD0EywGKypOwEYgIPJUOkwCHYpcw4wmIOhODHLe+56DaJUwJCGoTyMKgQuxwYIGus08EbJMygYAgPQ8IVBcHkp4ijJFiTtMNBDxzxoLwTTclaCNCiDC50VjAgXIciBiaEIQbnOAEOBiCE8SQx0Ia8pCITKQiF8nIRjrykZCMpCQnSclKWvKSmMykJjfJyU568pOgDKUoR0nKUprylKhMpU4CAgAh+QQJAgCzACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQECAgIFBQUICAgJCQkLCwsQEBAUFBQdHR0lJSUrKyswMDAzMzM2NjY5OTk7Ozs+Pj5AQEBDQ0NFRUVHR0dKSkpMTExOTk5QUFBTU1NYWFhcXFxhYWFlZWVlZWVmZmZmZmZnZ2dnZ2doaGhoaGhpaWlqampvb29ycnJ2dnZ4eHh6enp/f3+Hh4eNjY2QkJCUlJSYmJicnJyenp6goKCioqKmpqaqqqqtra2vr6+zs7O4uLi9vb3CwsLGxsbJycnMzMzOzs7Q0NDS0tLU1NTW1tbZ2dnb29vd3d3e3t7f39/g4ODh4eHj4+Pk5OTm5ubn5+fp6enr6+vt7e3w8PDz8/P4+Pj5+fn6+vr7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBnCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjvmGWVHmstUsNERUKaI6Q4QQOylSPZNZMunSHLKCh1ijNmvWQ1E1byy7dA7bSEbNzF4hh++gP3bqD9CbqZTTw2U6GCw1yXPcF5UFXN8/NAvrPDtN1/7De80H23BCk/nDX2eS7bhDjc3oxr1tHepwW2OdO/r5mCvmzP9SvyQP/bB77zURFBP61FoEWAcrkQ4GtoZCgTB8wyNoRD8LkhISlaVAhTP1hqFltG7qkgocFTBDiSxiQ+NmJLFFBYgRfsMjSDiTWICNLuHnIxY0qUeEdhjbymFKHGMYoJEogeLjikSZV4aGJTJ4knYQgRlkSBRg+Z2VJPXhI4ZYkpSihCWCSNISHCJYpEgcY5qCmSEZgaMGbIm2AYRJ0gnSmhDPkCVJ8DDbg50dEFvjloBuJQSCDvCHK0QwSUuAoRxdKqMSkG9nJ4A2YalQoflp2ihGGW4iKEQkSCmeqRUBI6OCq/hZJWAGsFiXJ4BW0UkQjg0LkOlEUfPo6kXH4bSCsRPcV+MCxEbXKIH3MNrRFqtE+hGWBQVbLEKoFiqBtQzgwOOu3C8XJIBnkKjQtg1Gkq9Ci/h3qrkFi+lflvAWZsCm+B93A4Kv8EtRlgegFTJC5/oVq8CzlFQjlwrNkISHEA0mILsUQMGgkxBMwiAXFsxArn3gUA+rfEyBfwGATINeLHxMtMwgzxSoXyHLJDKJMscjskcwxg6hhrDHIFlMsMYMgN+zfwwsjjN+cFA/sX8EQ+1sgwAvrWyCnFLss370Gw4ufvAGvW2C7EDuN38ULh1vguBBz65+3FF/rX7YGm+2f/qoLO1sgtAYn69+yOzNoLMTAMtgnxLsW2CvEthaIK8SyUuy3f1gHLPfeFGOYpsGfyqdwwJpuDXGlDOK5MKQMSrqwohI2CjqGZONrsn8OQLyn4hCXXqDqAav9NMRsSuimwbszWKrBXuNHpsFSM1i7u3YXOPq8UzIItrtOYsg0vpEzuCS+ofu38bxUZAykwTliuCO/jUuIt7suegiBFwE379/47o7ooevkI1EBtvetIwhQQ/iaQsdIND1tZUCAmSPX5iR0IHyhQIAFANC8WEci/czLBhgsAOC+ZTUBHi9dIMQg1cjFQRKFx10XDOF20jVBD1WHXFN4YAgxkK4jLDCEyTfTVvk8xLdq+S+EBeCatrSGxOdpK3wYxADbomVAJBZAApPRVhiqh8FLfYsGViyAEdLFRRIVsVpQsCIBmfWbEO5gXjAIoXvmVUMGvRFfOhDgGrWFBDMaDAwOwNAYF+Y7+UjAiwtjjn8wkEWKicB5IBuIGOTDP5BFrzmviWRBpqC/1lgACppECA/ExhoNAC+UB3HCDk4wGgdoQAZACAMqHdKFmc3ylrjMpS53ycte+vKXwAymMIdJzGIa85jITKYyl8nMZjrzmQoJCAAh+QQJAgCzACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQECAgIEBAQHBwcJCQkMDAwPDw8SEhIUFBQYGBgaGhodHR0hISEjIyMlJSUoKCgsLCwvLy8xMTEyMjI1NTU4ODg+Pj5DQ0NISEhKSkpMTExOTk5RUVFUVFRYWFhdXV1iYmJlZWVmZmZmZmZnZ2dnZ2doaGhoaGhoaGhsbGxvb29ycnJ1dXV5eXmCgoKKioqQkJCUlJSYmJiampqcnJyenp6goKCjo6Onp6erq6uvr6+ysrK2tra7u7vAwMDIyMjLy8vNzc3Pz8/Q0NDS0tLU1NTV1dXW1tbY2NjZ2dna2trb29vd3d3e3t7f39/h4eHk5OTm5ubp6ens7Ozt7e3v7+/y8vL19fX39/f4+Pj5+fn7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBnCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55810sSHzZIrNBRBMoYylF5FBhNmvSFIKCduijNmvSK1EqZtJ49+gLso2Fo6/aQ5TbRDrp1W/AttEbw4CSI/0Ry/HgP5T11ND9OBfpOFdODj7CuE0P24Dq4/t/s8v24E/E1m5QPLgJ9TQjrdfNwP3NEfNoQttCPieM+bRX7wXSEf7QdEeBLJBDYGggHugSGgq091yBL0kFIWgVmTMiSBxaSloOGK13RIWlegKjSDiMWcIOJKpkwIgNcsIjSFQ+MuKKMJ4nWYQNf4HiSfR1+6GNJWIz4wJAm3TCihEiOVEGHHTRJUg8jIiHlSBxamMKVIhExYoxcghRCh+GF+ZERHW5gppgdJrGmR0N0SMObHm1gYQV0dqQjhAbmqREZ8EE4g58b0dAhoRqpZ6ESiGY0JoQ4NIrRngRGKelFHYJ5KUUuQijEphUFYeFroFJk4XClTgSkglqkKhGK/hAO4WpEUlhYw6wReacgg7g+tAKEDvT6kKgQnicsQ1xY+OmxDD2p4I3MKtQpgSVEu1AOEGJgrUJoQpjhtgclC+EU4CIUKIF9lltQlgQyqe5AKUD6bkH9KUjqvAJRqeB2+Ao0oIJq9juLbAqi2u8WEEIgsEAWLjxLjQr2KDAFELYqsK4EViewnQpCsTBwCjaxMLv+MTEyhCYLDDKBIm8M4RMLY+yfxv1SzOrCEBMocb8WfosvwgoqLDDBBBqM77+VLqwvgfz2Wy+B9+Ibr4KRCkzyfe7Oe65/6c4rroLk9tutggtjW/DC0/pXrcDOEgit18oKTKyCxuL7q4LBXgwh/q/4RmGrwLAqKGu/qxJoMb4WZiD3qAKn7d+yiFuoH76U+ueBwI9S3a+iELqJr6EQTtAvoBYOSnmHXavLsYIU9BunhXPim7mCnr879tmyk4mvlx1O/u7V/m0579J84tu2gpa+q2SHWW9bZIetz1u4gkKqWzmBDuwMLo02zuu4gpqCG7iFb28rYoolqgs8gdWDy0KKFPi87fUKNs8scynyva0VNo+YerQfSFEBomat70HId9a6W4rmAy7jCLA94HpaiuoWLQmOqEzWsmCHmhYtBwrwATRjlgIFCIRtGdBCLrCWFQIowNFcLlpI6F8LW3Ys+o0IcsJ6XwtJUzVhXWF9/iMSnrDGt8MPyM9VVzjhiCyABWHxIGc7LEADGIUrLEwvikbo1fKiWBoclqoHx+NiAewnKSIAcYc7cBUYZifG0aQxVUOYQBtZ88ZScWCOrCEjoq7YRi9eCml4dEAWUxWGC+BxNBagYqpscMgCgKCJs7LAIVNwRFBB4ZA9nBUQ5tgAP6ZKBm30AA17pUQUWqtCOyyhtZKwwxGEkFlgaIAAMQguEIxIBBQElxAsBAEG4qsEClIBAuc1Bv+A4H/4It50GqBHfFnhjKVZQA4q6TCBPFE3FUhB+qqJECfsQAUZGI0DQECDIISBmw/pQsrQyc52uvOd8IynPOdJz3ra8574BsynPl8SEAAh+QQJAgCzACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIEBAQFBQUHBwcKCgoMDAwODg4PDw8UFBQZGRkgICAmJiYsLCwvLy8yMjI2NjY6Ojo+Pj5BQUFERERFRUVHR0dKSkpMTExOTk5RUVFUVFRZWVleXl5kZGRlZWVlZWVmZmZnZ2dnZ2dnZ2doaGhoaGhpaWlqampxcXF3d3d8fHyAgICHh4eMjIyQkJCSkpKVlZWYmJibm5udnZ2fn5+hoaGlpaWpqamtra2wsLCysrKzs7O3t7e5ubm7u7u/v7/CwsLExMTHx8fJycnLy8vNzc3Pz8/R0dHT09PW1tbZ2dnc3Nze3t7g4ODh4eHi4uLj4+Pl5eXo6Ojr6+vs7Ozu7u7y8vL29vb5+fn6+vr7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBnCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5i3ioESpEaJEjaCPAGTmekQCwVSq1Zto3RSG6tjq+7gumiUB7Jzp25SW6ju3wXE9P75AbjuClWG89Rh/LcF5TrDVGj+WwV0nEyoA5dy3SYP7b8//nSviQL8bx3jZ14wrxsCl/QxJbDXfQI+TBHzdSOx7/JG/twb8NfSEf/lxoOAK4VRoGwUkIGgSjgsGFtrD6Y0gYSqPeBFhSgxh2FqNHCI0ggfptaFiCZd4UCJIaJY0g4lFkCaiySBUCKFNIp0RYkU5EgSDSUe6KNIFHyIwZAifffhfkiClMGHJjQJ0hAlvielRxx8eMOVHhXx4QVcerTBh0yEyZEQH8pgJkfrSdjjmhp5KCGTcF40BgQYwlBnRjJg+OaeFkVBJqAXjSlhDYRaBKOEGSRq0YdWOioRiRICIelEQGCIwqUTYVgBpxLZKCEWoEKUA4ZClPoQFRjOoOpD/qgtqMGrDpUnIa0NZSohd7gqxAWGlvaqUJELtigsQpQWKMKxCcG24HPMHmQEhg5GW9CvElJhrUF4LnjEtgU9uaCQ4ApkwqHlDgTkgvWlO4uSBYLg7izTLtiou1BI+Km7W2A47yz+zovbgjOmS2yBW8w73YLJudtmgVPMi4GEUcwrboFQWCxhxu5OvGDFDksYsbsLF9iwwRJqIbCEBZdLLb8SQjBvvgvum269Bd6bLrz/yevuugW2m+65CyLq7sX/kVtutwV+my62C2p788vpOlugzeUm+9+y7h78n7HgQl1gsOXquiCv5dq6oMISBpguqxK6mu6pEgbhrqgLkpou/obQlq2pu1r/Rza4kKa7qL3uGlp0uoJiWGa5fbqZ7p0YxpCunAvSue3DBcpcLpoYqlmu4gs+vq2XGIJZbpYYbgkulYWDi3SBUYLLc+blep1zuUBLqDSzO374p7V4S4hjtIdL6EDLx14xMIZgMxt4gQycaC3dH0YvrBUxarjt7Asef6wKMQ5/LOYY/t4rEjEW4DazVug+p7UatC/0sdMv6F60apeIHrMzaF8BaMOs3pUIbb2qgQALgIMCLtBnwgqgAB9wMlz1L0Y/wN8CC9CC7dVvgbNan/w+1ACQ0Qp97Rucqsi3wQIY7VVWAF+Mavcq7G3wfaW6Qv5i5IArvGoH/itq4W5UdYXitbAIqjJgC+0GKh6McIHqI9QQZLjB/0mqCKwT4mpycCkhkE6LqbEioMagA86BMTVRNFMUZMC0M6pGhWvawRfdWAAHILFOQNihGytgOi6R4QdGpONqNuDDMIlBgoLUjQmqxaUgXCiRunkhl4gGydzAsUk2rKRqLGBCLsFNk6tZQZ30SMcHZBBOVgMlCCpoJlKesYGAeuIZP4BAOFVBkw8Q456CUMkTJMxRmQSjBpwmKSfQkQI7KNUYgihEB9hgDK/ygBZnYL1XIbJ9DJhBpGg1hTZiaAI22BCzFGikZIIrVgUqATHB1a/8XOAGv/zXBYFDARks4V8GLTkCFVMzgRhoDp8FCcMPYHCxDIxABP8EqELEoAThKPShEI2oRCdK0YpaVCABAQAh+QQJAgC1ACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEDAwMHBwcLCwsODg4REREUFBQXFxcaGhoeHh4iIiInJycqKiouLi4wMDA0NDQ3Nzc7OztAQEBDQ0NHR0dJSUlLS0tMTExOTk5QUFBSUlJVVVVYWFhbW1teXl5fX19fX19gYGBhYWFhYWFiYmJkZGRlZWVmZmZmZmZnZ2doaGhsbGxvb290dHR5eXmBgYGHh4eMjIyQkJCVlZWZmZmbm5udnZ2fn5+hoaGkpKSpqamsrKyvr6+wsLCxsbGysrKzs7O1tbW3t7e6urq9vb3BwcHExMTHx8fLy8vPz8/R0dHU1NTW1tbX19fZ2dnb29vd3d3e3t7g4ODh4eHj4+Pk5OTl5eXn5+fp6enq6urs7Ozv7+/z8/P39/f4+Pj5+fn7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBrCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPKME/EeF46xMUGCARSS/BQw8noojlSy56d+sbroGQy0N6d2gKZ2z2t8B6eWjRwnQ+ID8dwPOcI5cQrNLfJA7pyG9Np6rY+fMGX7DIb/nAnvgI8TCzjlTMx73JJeuIa2Lfc8Z64D/krhdQfLkEN/pRS7DdcDv+hVIaAvDUwRoEnVYDgbrYxWBIQD9K2QBgSlqRBhbNFmKFIQ3AoGwO/fSiSByKmRqCJIW2RYmosinTDi/fFCJIEKUpn40c+vLjejh5tx2EJQHpUxIvfFckRBynqoCRHSOT4JEcbpAjFlBoRkWINWGpkgYgSdJlRdSL+KGZFaIjHIQ1nXlQDmG1aNIWVcVZUJYc41ElRDyJmoCdFKSb5J0TPcSjEoBHpx6ELiEYkIgWNQoQih1xE6hCZFRJhaUPCcYjdpgxRwKGfoC70AocMlLqQohVSoWpC/mGIeOirCOFYoYe0FlTogyHkelBsFULgq0FKiOjfsAOBIeIVyBKk5oNmNiskgjU2W4sJeForEA4cqqBtLT1W6MG37lXInLZzVjjBt15w2MC3tRj77bMIlmhtBBx68a2oFWbx7ZcVVvEtBhxO8e20AhqsLcL7KWwtwRU63CzADwqsLb8P+qstvhXqqy29AtrbrLzWtsvht+k+uK625T54rrXhPjiuttxWWJ622FaY58IcVtssyPtFO6yyHDJrbbEcHtsssA9Cqu2uCILwra0P4jpsrIZqy+qDrlp7aoWpXszhBtp2WuGnzWL64BDaTlphpdaK+IDWIjJqLdQIzjqy/oiCDsvnqNreqbO1KVd4ZbNvchhms2mKyGbaKQqdK8UPLo6sliJy2azghjcbpYgXWMukiE4ie2Sg0qZoQrMxcyj5q1Sb2+yMKfpMq4spOtCs2xyu6OvfKYr8qhZAI2j1qyK8SACGvqrN4fGlaqF8A8KryvCDvtMKg/L9Na88AbaX2sT38eWaBcc++rqh8t7mijffubrwPQE85GrD/DO/WvP3Xau6v/I7oNX/XpS/Ut1vfgvAwqvkNz8CBOFV70uRDFSVhfXNj1SgagL65iexSDnve3qz1PYamJqdWUoL13sRkTb1QfIpDVFaSB4JUzMBLViqBwyYYWoYcDhEbYF3/jNEQqRop8PUhFBPPoidDsPXpiKksIH1+xMSRldE2USxTkTgXBXpVyc08IByWwRfnKZQg+JV8YhT6oEWw5gaIXZJCBFk4wR6WCQr8ACIbJyNBrZQpDAI4QUYyyNvTPDCDIFBCTkYgRIFyRsT/gcMS/ABDkyQATMycjcMQGN2yDCEG3BgAZfcTwY6CB4gOCiUAprgf2SIyv088D+tFNAHFPgfIsZyPAEs0PhuOR4P9A8/YjglL5XTgB5kyJbD5I0K+lagECRzOBp43X8C+UwCRMCYLDJDNWWzgBycwUYB2qYNmGcjLlTTBnArkgN46QAcgAFLaxRkBXbwzS597ZIgXihCnILASArggJZ1KkEYG7ACabbJkiJywAn0uSkmNLACNjAoovgJJhP4QGO+IsMK9rOADNAgCADVVg8uAB0KfOAGQZACvBASBkSKIAQbkIEPmGCFNKz0pjjNqU5zFRAAIfkECQIAuwAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICwsLDg4OExMTGRkZHx8fISEhIyMjJycnKSkpLi4uMTExMzMzNjY2OTk5PT09Pz8/QUFBQkJCRERERUVFRkZGSEhISkpKTExMTk5OUFBQVFRUWlpaX19fY2NjZmZmZmZmZ2dnZ2dnaGhoaGhobGxsb29vdHR0fHx8goKCiYmJkJCQlJSUl5eXmZmZmpqanJycnp6eoKCgoqKipaWlqamprq6usLCwsrKytLS0tra2t7e3uLi4vr6+wsLCxsbGysrKzc3N0NDQ0tLS09PT1NTU1dXV1tbW1tbW19fX19fX2NjY2dnZ2tra3Nzc39/f4uLi5OTk5eXl6Ojo6+vr7Ozs7e3t7e3t7u7u7+/v8PDw8vLy8/Pz+vr6+/v7/f39/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AdwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4serfILGNJGnexYYaFAAQsteDhB/dNNDte4cxdw0Yb2zicPdAsv0MCHb5wphisvwOJ4TSDLlz9xLpPMhOjKKRyhDtMF9uUWuP67BPM9+g7xLJGUXz7hDXqVO9YvP/8eJQr5y83UP0kBv/Ic+5nEgX/DNVBGgCTZQOBwACIo0hALChdBGg6GRF6EutFX4UcgYJhbeBt+9ISHuf0Q4ketkVhAByd69IOKrs3WIkcewOjCjBwdAWMBY+C4kQgw8uCjRkrAmMGQGoUAIxRIYqSjijc0idEGKoIoZUU+wCjjlRO9cR2JNnBZ0Q0qUiAmRVQseeZESpKow5oSZUmiB3BKBGOPdT7EgopF5PkQESrC4OdDKh45aEP3kRjGoQz1oKIRjC6khYo4RLpQBiSCYKlCMKi4aUKAkljFpweRwSepB6WIYYOoErSnh/4qtFpQfB5iICtBS3h6q0CmktjFrgJ9iSETwO5So4cmAuudh28CqwOJLxQLnYcoFJurhywCOwWJFxQ7BokTFLuLiu4BKwGJFAKraoRiFIuph14US6WHVhTbAYlTFHsshvkCu2+E/e56r4cB3zovhvUC+y6G8apLYrvmolusrrt+62G42pJo5a3XYriBtCRW6yy0xS6LYbO7/rtgsrsKGyGxu/bqIRfAdoxhubfSiqGhu76KYawOe8iqrDJj2OeuoXpIBbCdkuhupsBiQSmwjpK43a6JerjoroUCmzSGgvZ8KtcqkrGrnB5yAGybzO6apopM3kqmxrt6qWKYt6Lt4f6WrR6M4caoPklilLey7WHcrRapotq3AqmikLIKTiKeraoc4Y2yvqjlretimG2rt8HIMqlh7GimrCfsqCGpens4YatgnAvj0J+usGMBB6Ja9eyw316AfqhajuHqm8ZwuwU4b9o6iaNb6oTvmpIKRuck8m3pB75HS6rPME5AuaVN327cpzj4XoAJpD5r/tKbqu875Ja6f7vIlpZvfgENRxq+70Nsyv3tMrAUGLB3PzpFygnUg9ECCuan5d3uaIcy3v1cgzI/gUF4O8LcoHY3QRAkD05gsN0EXXOB0zRQdiOMQBT8FIbUjRA3SvBT6F7oGgiu6QcJvF/zuHQEDN6vB/5wUoLjaIgbIJ7pCIYjYgGMeKU3+MBvSizADn1EhRu4LIoFsOGQfJBELEYghkgiwv+wSMIV4kgLPcgaGXXTga2FiAxEgMHC1igcDSKIDEvYAQtySEfcVBAzbmBDGb6nkDFMYQlA0IELPHDFPirnAVqkzBR8AIN5NcA1ErBABjbQAQ94oAMbyIAFUOhI/3iAgZTZQSNLOcIAYoYNA2MlESXQP8yUQZZRREH+LqMBXBIRfpjhgS9faIJRaeZ5w7xfcTrToWRmj5CYUcMlnQmjD1jvmNSs0hQ1o7NsEigCO/hgZ0ToTf/kIHeimVs514MDiJFGcutUzgR0YDbfdCGey4XJAA/cwB0M4FM3J7iaeNQZTwvkwJj1mWM2WyDQADHBmyoQwhpORFBWVsAFRmCDj+zXxwWIYAeIQ5IUYklEC6hgB08Qp5RycAFlbqAFO0CCGwdlhSFcgAIUICV2MsmBE7xAB0BwggmB9QYzhAELU5BCFKAQhShMwQpgKAM/xUXVqlp1UAEBACH5BAkCALIALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgUFBQcHBwsLCw4ODhERERQUFBoaGh8fHyQkJCsrKzAwMDMzMzU1NTk5OT4+PkJCQkVFRUhISEpKSkxMTE5OTlFRUVVVVVhYWFtbW15eXmFhYWVlZWVlZWZmZmZmZmpqam5ubnFxcXR0dHx8fIKCgomJiY6OjpOTk5iYmJubm52dnZ+fn6Kioqampqqqqq2trbCwsLKysrOzs7W1tba2tre3t7i4uLq6ury8vL+/v8XFxcrKys7OztDQ0NLS0tPT09TU1NXV1dXV1dbW1tbW1tbW1tfX19jY2NnZ2dvb297e3uHh4ePj4+bm5ujo6Orq6uzs7Ozs7O3t7e/v7/Hx8fT09Pb29vj4+Pv7+/39/f//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////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+vr7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBzCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy757pciLDhlM/HhyZrZMKyQMCB8+3IUa3y6BEF8+HIMR5CqxMJ8+/AR0lBqoa2dyveQN7eB7/ncPWQU8+BXjQ6owDx5F+o/Z2VPX8L6jdPnap9TfeAS/9hb7afSCf9odF+BFAxI4XRAHXlSEgtN50KBFW0A4nRUTVmSBhcvlkCFFLHBI3AYfTkSEiMTpVyJEb2SAonA4rBhRDi8aQKKMD2VRowEY4uiQCDX24KNDD74IwpAO7Wggkgqt9+ISTC6kRI0zRLlQjTdaiZAJNaKhJUJD1MjdlwZ9UaMOZB7EwYshpGlQDTW6WdCUL2oh50Bq1AjlnQJt8KKQfObipIjuBfrDixwEmksUNcYRaJ4vhqGoiyhKoSgILz4XaAt/KtrDizEoasSLJijKKIpHBnqfiFnemUac/orCGugFL7ahaHwipqHomiiWoWgHL25x6YtZDIsiFsaKiGygmKJYbKDAoihsoLyKSMatL+o664tsxPqio3y+iiIGiq7KYatynipiqnyOimKpgX6KYqibdspsppO+aCmfkKIoKZ/qigjunYeiiK6bg3JoXaB+ogjonf2KuOeddKJoJ59wvrjriyIE6sWZgYb54ph3cvmil3zWmCifFYtYJZ8JczixnEryWSSqgQJpr5w61tijnDS+ePCXLdYY450n1qiinB7UeAGfTezo4Z06v/hzmlDsKOGdI+zIoJxO7GjAkmk2+yKAcrqr9J0NG3mnvDVqmiYaYtMnZwli/yDn/s0vWtBtmmfQuuPDZMYsYgRkayny4G6eIbYBF/xNptk16p3md2JvMLCWSYstt5ZTPG5Am2SageuOS2sZguj0fmn4uIkzOYPoBhBBpg60k0Am3I9fbKUPtBsgxJe8iw2vlbgHf62VswefhJav13iDlWasHjy7SE5x+uMVPItk58HP7CPmwRtAOI5nUE472kMuXn4Im694RvRiU4AyjkUIXr5wV/iIBt77G04UfFS8/YkvQ0ZoWwAN8DmzrGEKQVBBDphwP6k4QX0BHEJagvCB6XBgCFWAChS6tkDiaPAsaaiadkTQBKY0QYUlNMAJzQI+9niACG8wyhuIEK0YDqeB/mMxg4UykAPv/SQLOaCUD4dzwLFgkEAiKIJPigDDJVoACmnhG4pUoAScKIF+MdzA1cqiBQzQzgRD8AJMvjAEky1xOiGooFncRzsO1EAJsROJGpRQg2q9cTrsS0uCSrgBFfwgCnm8iBqi8AMVKPCP1DkfWvy4xAyAoAU9MEIUsKAthqQBC1EwQg9aAAIlQpI9TXTgKcFzAQ1woAMgiCUIOsABDehvlQoCgRHV0jNc+rKE04OLGX9JTNpd4HlxcWMxl4miEvhKLsBjpjQtNDy6PGGa2MRPCXxHFxJm85vLwYDt8FIecJrTADFI5FwGeU5phiB1emmnNDcAxL0UTJ640LzAD+LnFys8Ep8+7IHkBnOGEzgAoAFVZ2DY8IPtIbRuPxjoYorQwYfu6AP1bIwUQmRRDrUAnpNJAxB62FHzeCAIndRMFW7g0JIaQAM4GKNnoCCDluJTAzYYIGqosIOm4dMDPAiha85wBBf8s5gbcMERxOObMCThBk98IwhukIR/1QcOV0CCDkpw1MdtgAQ5OMIVcogjN2whCkTowQtK8IENDJM9F9iAB0jgAh4MAQpacIOichEHNqShDFvIAhawkIUtjAENbCDrXhfL2MYOKSAAIfkECQIAvAAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAgICAwMDBAQECAgICgoKDAwMDg4OEBAQExMTFhYWGhoaHh4eIiIiKCgoKioqLS0tMDAwMjIyNDQ0NjY2OTk5PDw8PT09Pj4+Pz8/Pz8/QEBAQEBAQUFBQkJCQ0NDRERERkZGR0dHSUlJS0tLTU1NT09PUVFRVFRUVlZWWFhYW1tbXV1dXl5eYGBgYWFhYmJiZGRkZWVlaWlpbW1tcXFxdHR0eXl5fHx8f39/g4ODh4eHi4uLjo6OkZGRk5OTl5eXmpqanJycnp6en5+foqKipaWlqKiorKysrq6ur6+vs7Oztra2ubm5vb29w8PDxsbGycnJy8vLzc3Nzs7O0NDQ0dHR09PT1NTU1dXV19fX19fX2NjY2dnZ2tra3d3d4ODg4+Pj5ubm7Ozs7+/v8vLy9/f3/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////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l5mZmZubm52dnZ+fn6Ojo6enp6urq66urq+vr7CwsLKysrOzs7S0tLa2tre3t7i4uLq6uru7u7+/v8PDw8jIyM3Nzc/Pz9HR0dPT09TU1NXV1dfX19nZ2dvb29zc3N3d3d3d3d7e3t/f3+Dg4OHh4eLi4uPj4+bm5urq6uvr6+3t7e/v7/Ly8vX19ff39/z8/P7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH06cbZsrSm540IACCBQugop/1LIBgfXr10mUkc4xCPbv2J/+cMeoBrz56zfGW8xwvr0V9RN9tJ+vBj7ELfPnmwBk32GL/PMt0R9DgmAAYHssDLhQGgfO14eCCVHRYHtZQIjQDxOex4OFBwGRoXkbcGjQGB+al4eIBPlRInhboDhQHit+h4SLA30Q43Ut0CiQEDdah4GOw2TRo3Vt6NjHkAhoASQHQwqo4w5D5gDkE0N+AGQYSBZiJJJxAKnBkGMAacKQVQApX49NAMnEkEAAacWQNgApxpAlALnGkB0AyceQGQA5DJJ+stcjfzoy2eMeQNrYoxxAhjCkG0CSMCQbQJYw5BqVXhrppI0+muiQjBY6JKI6CnojoTRmqeOeQ9o5ZAT+ctLp5pDp6bhmj23qeOaNTIhJppdgbjlklzRiOaSWNFLZY4hPRrlkk8L2qCSNQg5ZJI089vijjoremCONcCA5I41SINkijTcgeWKqVepYbY9BNDvktC4iicCDLko45Ak6uoBkmi6yYW8aNB6BJAc0EvLlkEbQOIW9ZtAoApLMoogfkkfQ6C+SBKMIhr0j0BiDvVC4yIW9CPDh4phI+uBiFShvh6KhsqK4BMplingHygijaAPK4omoL5IYoAqhHaZCK6IOKN8rYrkoO2khHU0j8IeILNsbtIVENM0BshA+3HTOPM1hR2RmVI3CTmY8oYOhHPQQRcSLzUGzvTLfRIj+EvP9MIhiKVSd601nWADgBGIgBmXVKt+UQ4ZSGOZd1VTgdPKHSRCWRNUIxInT3RP2GtitVV9r0+YxAuxXE5wjEAVOR/YoOl+kN13rTSQOmfleqFedQag3QWFvvHlNznmFOT1u7w54Lc55ETtVh3IKc9A1R+Ct87vTxF7TDZcZoDdN6U7ZVj0FXGK3nmRPMLdOhFtdq4+A6jsxqL4JdKhFR9at9/CTIB2QHwIidxaoyW8FQRma+nRwtrHYgWkC7MAdhPIzAWagcmGhQtLUV5+hCPA6NphgV+5QwQ+CoSjK+iACpJaVm6lwfUZpnwo5QLaqVCF86qthUQyoQhNwgSr+XODfBwmYFB6qMAYnfAoYRvZC6xBRKUZUoQvOpZQtbKyJA3yKDLEogikQwiiEmIKjsGgdHTJFC2S8jgaOMD6gsOEIC0sjvaAChguk8TouwCBPqHDFNGIgiVNJQwDveJ0dIM8mWXAeITvQsarYQQWE/M4NpAAHmMRBCumK5HVWIMKrEKIHmvzOB4SQBXyZpA9ZEEK3QokAH4AtK7VjpXU4sIMnhMGUG+lDGJ6wAxyGcnZc0QIFZHkeDZjAB0ywghjW0DiG8GENYrACE3xggjgSEzsUmGNX2CDEa7YnAxz4QAhIUIISkCAEH+DABr15nhG0MSzxY6c81fc+s2BhnfP+zGeMsJAWOWRSnwD90A2Al5YoBPSgB3qdW9pQQoQ61Do1MN1bqGDNh+pTA+ejSx88ZFF9AqGZdTHDCjrKThXkLS83JCkrNWDGvBTiCfhU6Qcv8IRX+uUPS4iATF8YgSVcrTB9WIIdd6q+JeDSMIB4gi+JuqInGG0xVZAUU2NUgpY2hgygnOqEfHBSyvABCtzTqnlGAAWQZiYNR1iqSjlwhEaCpgxGUOtBN2CErpImDUzoJkBP0AS3roYPWgjCKr35gSBo4aixycMWkMCCoRLyAixAwhbW1Zs2aGEJORgs5z6QgyVoQaLFIUQcxlAFJgDhBiToQEXbo4EOkMAGQGAkQhXGEIcvAqkQgNiDHNzAhjWsgQ1ukMMeAGFTPxn3uMiVTkAAACH5BAkCAMMALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQICAgUFBQgICAoKCgwMDA4ODhAQEBMTExUVFRUVFRcXFxoaGiAgICIiIiQkJCYmJicnJykpKSoqKiwsLC0tLS8vLzAwMDExMTExMTIyMjIyMjMzMzMzMzQ0NDY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT09PT8/P0FBQUREREZGRklJSUtLS0xMTE5OTk9PT1BQUFFRUVRUVFZWVlpaWl1dXWBgYGFhYWRkZGRkZGZmZmhoaGlpaW5ubnR0dHl5eX5+foODg4eHh4uLi4+Pj5OTk5aWlpiYmJqamp2dnZ+fn6KioqWlpaqqqq2trbCwsLCwsLKysrOzs7W1tbe3t7i4uLm5ubu7u7y8vMDAwMTExMnJyczMzM7OztHR0dPT09TU1NXV1dfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Hh4eLi4ubm5uvr6+3t7e/v7/Hx8fPz8/X19ff39/z8/P7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufOIb7Qs8SHFTJ/nFwU54XCgu/cDJab+YJ9Yhvv38wdm8Bn/UAf6992rsGdYAr59N/MTUrFvH0P+g39cwJ99TvxXEBMD8reFgQN1kKB9RjA4zBwP2veChFxUeB+DTWgIHxUMHuHhe0Uw+MWI6O3AIBkonlcBg2K0eF4hBvYh43dyMEjBjd2RwSALPB5wBYNDBPkEg08EGaGBVwSpA4NjBIkCg20EyQGDfARJgYRBHkCjgRME+QeDGgS5noEO8kgHgyIE+QaDJgTZBoMqBMkGnXbCKSebbjKY5o1rGlgmj2f+FyaPYxrY5Zf5ZcnjlgZWyeOVBkbJ45RMOomkkkQa+WOQQxq4I48+/mdjkDn+F2OQjM4XRZD+HjD4Q5A9MLhBkAWa2uWC/2nRJX7/IRGkBH4GKYOBcXTZhIH7BcmFge4FuYeisBroa5BHGDhrkLzm1+UB1+VnRZcsGDhDl0fmJ2mQavzXYZAb/EfIqDwu8V8V35bx3whdxptfF98um9+5XbY7XxjfkvDfDd9K8e+34KqkhxlVWJFGuKIB2eUQKKUxAwbocfDDGqA1me9JWAwYARSf3dqlCSf5UOGFnDkBcagkWeAhpZnlAfEEJgGBYqmYRdtlFCU1i6J8l+ELcaIitaFzixLgYRkeh3aZ60jXyuiDZTJ/CwHGIkERJIiTKa21SUUGeYdkd0B8wAR+mMRvkOVGpvH+t0ibBLESkCkht78mkQAx04w5fTNKRMhtBmNmyH0ADCm9CrEGdihmx6AQ64sSwHK7oJgLki+J0h93Q/wDYtvKTfZJW0h+QLaFiSg54ipxDrHAgr0rNw4uuSH7AekClqTswLY0xfDF93W85OLBZLTczev1vNxPxkRH1nLznpfvktcxUxbDz66X7bJrUZPgw69+V+uS22vT3pK7kPlcdpA+fAs4tRFB+Rp4XFzMoDu5RWBOOIld+Q6AO7Yobnjdwsn1ZAe4trCvfNXDSdvKx4K3peUO9JMdx3pCCP0tEG1mUdvwYNCqndzBZQv0gdXGgoewLZADeQiKGv63wLk1sCv+VZBAD7tjsKCAYYjd0UEOu5KH6S0wDEVRIBK3lhWbIfEAERzKuK64AZxV5QowHKIXi6LCHrKgC1TpQgh7+EMyXtE7N4DiU8LAsDceAIVKKeMQZ4DGpXSBYHZsI1JMZscDjKAKhDAKIarQpkIKKSpSLCQFmoBAoLShCfQqZBadgjBHemcGVvCJFQDpSTlORQ1h9OQP1HcTLcDPkxwoIlXyAANPokcHVIgDTORABSfaEgYzxMoGbfmdDiBBC68bSR+0gAQPEBM9Q2jhVSb4TO9s4AdREEMyMdIHMUThB6msZncymJUt8FCc76EAC4bwhCuMoQ2FWggf2jCGKzxhCCz+yCQ6vxOBTW6lDWvcp30moIEOiMAEKlCBCUTQAQ1wT6D8YUElw3JBiFp0gRUsSxaEeNGOyo2VZ5mDLz1KUg3hIFBqkUJJV6qh6LWlDTlgqUzfk4PkvaUKD51pSQXZFj4UQacrNcI240IGEwJVoDDwnF6sEM6jerKLfyEEFDjqVEdOIArS5IsfnACBqr4RAk6oW2H64ASqenV4ThiqYP4Qhamd9VsPiALUGHMFFLyVRyMY42PKMMy7PmgISq1MH6SQOr++pwNSUCtl1NCEAt51A02Q5WfIsISm6nQDSwhsadTwhDrplAVPkKxq+KAFI/zJoh44whYUy5o8cKEJMThSpycj8IImcGFavnHDFpzAA2f20AM9cMIWbFqcQsiBDPY0wg5UwAF9DnQDJtBBEZ5ghTHIIavjKcQf9jCHN7SBDWxogxvmsIc/JFJC6E2vepUTEAAh+QQJAgDHACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIEBAQHBwcKCgoNDQ0QEBAWFhYYGBgcHBwiIiIlJSUpKSkqKiosLCwtLS0tLS0uLi4uLi4vLy8wMDAxMTExMTEyMjIzMzM0NDQ2NjY4ODg6Ojo7Ozs8PDw+Pj5AQEBCQkJERERGRkZISEhJSUlKSkpLS0tMTExNTU1OTk5OTk5PT09RUVFTU1NWVlZZWVlcXFxfX19jY2NpaWltbW1ycnJzc3N0dHR1dXV4eHh8fHyAgICDg4OGhoaKioqNjY2Pj4+RkZGSkpKXl5ecnJyhoaGjo6OmpqaoqKiqqqqsrKytra2urq6wsLCxsbGzs7O0tLS4uLi8vLy/v7/Dw8PHx8fLy8vOzs7R0dHU1NTW1tba2trd3d3f39/g4ODi4uLj4+Pk5OTl5eXm5ubn5+fp6enr6+vs7Ozt7e3v7+/y8vLz8/P09PT19fX19fX29vb39/f6+vr7+/v8/Pz+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCPCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1L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dnp6en9/f4ODg4eHh42NjZKSkpaWlpmZmZycnJ6enqKioqWlpaioqKurq7CwsLS0tLa2tri4uLm5ubu7u729vb+/v8HBwcTExMfHx8rKys3NzdDQ0NPT09bW1tjY2Nvb29zc3N3d3d7e3t/f3+Dg4OHh4eHh4eLi4uPj4+Xl5efn5+jo6Orq6uvr6+zs7O3t7fDw8Pb29vf39/z8/P7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MP+ix9PHiSgMlSEfNCwYwoYPeW7dDhAv379JuOb2N9fn0OX72jwJ2B9PHhnwYAIjsGdDwgiSEEg2l3RYINOZCcIBxM2KAZ2bWTYoBTYieEhgj1gJ+GIAm6A3RMoDvjGdSi0KKAX15UgI39rXCfCjfuxcd18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//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCDCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DD/osfT768+fPo06u/iwZLECFZzuwx36ZHhwT482+A4WV8lvwABggEeGt8EOCB+qHhHYIM5hfcHV9EQYMUX8xRkQ8NNliEb1iYgKAITgASkRcZZtjFbnDsUOIHX0D0QokNdhBHblHAmJ8QDqlhY4P93TbFjvlZ0dAWQCJIxW1xFJnfGgw1oWSAPNxmw5MJxMCQh1Tix4FtRGYZxUIcZJkfHrUFISYJC20gJn5p1EbCmnooZOCaYdCmx5oJKJgQlmJqQZsWeG6hEBB4SkGbFHgKmdCPaw44G6FrDqHQf2uuQNsKeFahkBh4bjlbmGuKodAbeCZAZmx4lPrGQqXWGVsY/qWKqNAImcpWBZ4jMKQDnj3I1gOeOjBU45ofyDanmF8u1EWpecCWR6knLrRGqVzAxkWpTDJUqhGwGYGnBg7BgKcIsImAJwwOPaGqa26U+oRDJOKJhWtXlNojQ3aUioNrOJRqx0O04ulaqeQ+RAS1rF2L54YPLcsra7/iGa1DqZbKWqmmRmQunlmoRumaJUjE6JpWphZDqVNIdAbGaqCmY6lnTHSsmE6g5kSpxU7ERKkc/GHaH6CuyQRFZGA8b2lYYExGRTNnGXJpJfBs0c32khYvnjVXtHKpJYt2MswX8bkmGKKBgbEJGFmB8QyizYCxohZVXGqLn32BccYYQYqn/qWfYVqqoxgVjXHHnX2M59IanYBxzpw1nSUKHBm+ZrKaDVsq4Rt5cDcdmtFxtwce3YrxDZrdcLemHd15N+aVSQ7nR5bjuQHnldGhJsaUd/Ts3VFWxsPdCTQLUux4XkFZvXfn7tHud1sY2RzAZyB8SKJjzDdkfmOM+kiOi6kEZEoA/4GsI7m+5tGMJQ086yO9CDziigl+N+QnyY+xB3IoJofm76d0MPAuUIwLgJcAIqhEbnfr1WEiBrxTpUR9wGMYYYpAwASgTyU1qOC7BqMuApKuJdOqoKECg6gKZqslaqtgyv4yMuDBzSWmE6FfSkjAfcVEDhXEzwb10kECbmBG/jLpUgUleBcK5lBQNFlCDhOgQLswkIBLuEn2COiC/M1FDgPM4fVq8rIcegB+byED/3LYMpw4bIkXZAsEczgxnLSwgt9rS/iWmIAV7kRvWnQeWuYwxQoCbieAcB8djXcW5NExgD/xHB3xwwPaiYUOv1ukBxzpEzQsEj8bYF9XsnC7RcZMKGa7ZAJuQEmt0CGGlyQbUc54SeVdhXh0bONQzJfDD2hSKlnoXg5vKZQ1XnIFdJPKF/q4yDQaxZCiTMAMVOkUMLgtmfgh5FJ8KcoY3CspXvgaNC34FFousgRY8FlR/oCFqG0TP7xMCiu3yQEnlBEoanBC0M4py2aeM0Ax/khnTbKgzXsmgJlSQYMuodmDat2EC0/0JwY+WRU6CNKf+cHBFdwAkzdgoV8QBVAJSlkVPGYUPyIwAhemV5I8cMEIG/tofoBAvqy8UaX4+UAPqhAGB24ED2GoQg8GmlE7cmWdMA0QB1YABCloIQxpsKlC8JCGMGhBCkBYwTyDCqAJ1HMralAcVXe0AQ+IoAQnSEEKTlACEXigk1stUQneGRYlpvWtl4yiWbaAVrjatVRIPIscaHDXvooJB0BUSwr9SlgbvXAta0BlYRcLoBuc8C3UZGxfOWDMt+Dhf5LtKxGUOhcyPDSzVH0BGPHiTdCeswP6tEv1THvPDWwPMHmIwEIFWLvNKJBUMLHVAG0XaVvF6KEKdd3tmjxQhTg5JgspEO6aUJDaxJDBo8qFERBGOxk8WEFs0T2QCazA2cucgWrZjakTGAoaMjThPrvtABOoO5ozTIEFmV3BFMi7Gjx0oQhT3eoIitCF7r7GDl54grg+up8neOFfvllDF6Kgg+AScAQ6iEIXHmucN4ghC1MYgg1IkN8GYeADKMABEaaQBTG8oaXUAYQe7hAHNqghDWlQQxvicAc9oHg9OM6xjvUSEAAh+QQJAgDHACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQECAgIDAwMEBAQGBgYICAgKCgoNDQ0PDw8TExMXFxcaGhofHx8iIiIlJSUmJiYnJycpKSksLCwuLi4wMDAyMjI0NDQ1NTU4ODg6Ojo8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJERERGRkZHR0dJSUlKSkpLS0tNTU1OTk5PT09RUVFTU1NVVVVYWFhbW1tcXFxeXl5gYGBhYWFiYmJkZGRkZGRkZGRkZGRkZGRlZWVlZWVlZWVmZmZnZ2dnZ2doaGhoaGhqamptbW1wcHBzc3N1dXV4eHh7e3t9fX2BgYGFhYWJiYmNjY2QkJCTk5OWlpaampqcnJyenp6hoaGkpKSqqqqysrK3t7e5ubm8vLy+vr7BwcHExMTHx8fKysrNzc3Ozs7Pz8/R0dHS0tLV1dXX19fZ2dnb29vd3d3e3t7f39/g4ODh4eHj4+Pl5eXo6Ojr6+vt7e3u7u7w8PD39/f4+Pj6+vr7+/v9/f3+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCPCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iz681zBgycRNod/nLR4SGB+QQYaFyxEx4hnh3n45/XsKV9QTDy858PAcj+sSD6BWiefWcIKGAR4RHCgYECqqEdgAwGiIIh2AESoYFlYNfGhQJOgd0YHEqI3QohBogdBiXqR6F1FaSY34rVuZjfdYXIGF8G11loo3kdXKfHjuaBcJ0dQCZAwnV0FHnCdXIUiQKTTiKp5JBFHmndj0AKaZ2OO/ZoHSFF4nhdkQlgR2Z/1nVQpBzXnVBkGtfdUOQY1xFRZBa6/bEGGFPEQEUYa+hBkRZFAoGbIVMIGAMcEoEIZAq3vfFBhF9EpEaRGthWRYg/QIQHmYHQZkWKXEBEJpyybehiGw+FUGSp/rKhIKMHoTakQ5E8yIbGjj44hEWRHsh2xI4fOGQGqLAZsuCOgjRUB5lmwHYskG44ROYRsA0LJBkOsVCklq6BUKQXDo1aJB6u3XGqQ7sWCYZr+BVZh0N+kGmDazaQ6cdDahbpGpkYQGQEtKxNC+S9Dxm8Y66r8UDwQ4GQWeZqEtf6UApkiqGaGGRCGhGhRbagWgtkaiHRGxLTgVqSZL4xkQZkVoHapsBSRAWZGiBiGiIwF+nhRGtIHIZpYUi8RkXlVWlaCWQGWxHNRaJBWrtFylwRymSKPBrJLV9kgsSogpaGxCZg5IXEL4j2gsTkXhSxxFJ/RnWRFlsEhMQee4Yx/pmGZhS0xBp3xrHRG8natGdJF1n2RoOTiQVnv0pMJ0c9k8mHZnxInICXHHGheQ2a1aA5rBwRgqLQmBWteSEfRQ7wHpbtkYHmj38kiOYJ7GAZfJo3C5LrZFY6WbwS1w7SILgnAHtke+CewSAjea553o/tLTHpISWSfBOQNYG7B+CR1DjqjamueeAlkYj70Yv9rfkKKLkvcQeCJqZHv5qzf5KduKugmArJI4JK3oY7hhnGYc6r20nMpzkjGGZgyRsaS0SXPCsQxly4A11LnpW8BOApMFnoYALm5ZKzddBkfwFZ8tr2EhiI8IN8CWEHNQiTPJyugnzBoPPyMJMyiDAB/g7MCwQ7mCGaPOGHBqwLAjv4hJt8TYQqqJ9c9ABAEYoAJ3P44eb095Y14K+Dc8iJwjooQbcwsIPR0okKRci9tnhPiyjcyd20mILloWUP1hNh33iSCPVp8V1n+YIWzbOC8PWED5Ma5A7sGJY98E6LH2BkT7A2yAyU8SthuOEPMeAyoYxtkOapweW6wgcKgjJsQhmjFo2XFeANMo1FGd8gPYC+qoghcaCsZVGIB8oEpCBuUkFDHkEJyKQIspfneQEqmZKGtSHTPMJbCi+R2QJgJgUNXHtmAorJFFkiswRh0FlREBEGEmjzPLpkiiqRqYEqqCwodKhC5c4JS6h88pzn/mlBOnEihmziMwHLhAocJvDP+PCgnjQxwxILmoFOVoUPfiyoeWwAhjvABA9gyJdEz7OCUV4lEXPc6HlAcAQzKHAkgTDDEcQl0vMAwZBZWWNLzeMBHnAhDSfFSCDSwAUe4HKmCYgjV9YJ1ARoIAVAyMIY0iAHNDEEEHJIwxiyAIQUzLOo5rkAQrkyh2FiNUAZ6AAISHACFKDgBCQAQQdm91UGpSCMYzliW+cqwiaaxYd0zWuYingWPcRAr4BN0Q2kmBYTBvawAmIhW+pAA8Q69jwzICFczvhYumrgknEJBP8qO1ci5DQua4goZ1u6Ai7i5ZajFSktASO91J4zA9j7wssgXOnaH1YAC9ArjCBoW1uJYQALvkMMIbiwgd7OjwuEeIwYDGdcF6Fgn41ZQ0ibGyEgmHYygfDCE6mbHxN44bOVeUMVftrbdjoUNGuYAnkf6wEqXHc0b9CCV/WaAi2cdzUpNQJL2xoCI5jUNn5AgxXme04WWAEN+/JNHcyABR24apAg0AEWziBZ4yQCD2oQgxaIYAMUEJRDGfgACmxABC2IQQ3owk4iCAGIPNhhDnKQwxzskAdAEAKm/smxjnf8moAAACH5BAkCAMcALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQICAgMDAwcHBw0NDRMTExYWFhoaGh0dHSAgICQkJCYmJikpKSwsLC0tLS0tLS0tLS4uLi8vLzAwMDExMTIyMjMzMzMzMzQ0NDU1NTc3Nzk5OTo6Ojw8PD09PT4+PkBAQEJCQkVFRUdHR0lJSUtLS0xMTE5OTk9PT1FRUVNTU1VVVVhYWFpaWl1dXV5eXmBgYGJiYmRkZGRkZGRkZGVlZWVlZWVlZWZmZmZmZmZmZmhoaGtra25ubnJycnV1dXd3d3l5eXt7e319fYCAgIODg4eHh4qKio2NjZCQkJKSkpWVlZiYmJqamp2dnaGhoaWlpaysrLS0tLi4uLy8vL6+vsDAwMPDw8bGxsjIyMvLy87Ozs/Pz9HR0dLS0tXV1dfX19nZ2dvb293d3d7e3t/f3+Dg4OHh4ePj4+Xl5ejo6Ovr6+3t7e7u7vHx8ff39/j4+Pr6+vv7+/39/f7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AI8JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmT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KiwsLC4uLi8vLzIyMjQ0NDU1NTc3Nzo6Ojs7Oz4+PkBAQEJCQkREREdHR0lJSUtLS01NTU9PT1FRUVNTU1ZWVlhYWFpaWl1dXWBgYGJiYmZmZmZmZmdnZ2dnZ2dnZ2hoaGhoaGhoaGpqamtra21tbW9vb3FxcXR0dHZ2dnl5eXt7e35+foCAgISEhIaGhomJiYqKioyMjI6OjpGRkZKSkpOTk5SUlJaWlpeXl5mZmZmZmZubm56enqGhoaOjo6WlpaioqKurq62tra+vr7Kysre3t729vcPDw8jIyM3NzdLS0tfX19ra2t3d3d7e3t/f3+Hh4eLi4uTk5OXl5efn5+np6evr6+zs7O3t7e3t7e/v7/Dw8PLy8vT09Pf39/39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buE++EaOkBQcSRb6wyc2yD5AGyJMnTzGGOMo0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xMTEx8fHysrKzMzMzs7O0NDQ0tLS1NTU1tbW2NjY2dnZ3Nzc39/f4ODg4eHh4uLi5OTk6enp6+vr7e3t8PDw8/Pz9fX19/f3+fn5+/v7/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AeQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4seTbq06atvxJweOmZKEBENGnS4AeXK6p5UOMTezXsGl9s405zgTZz3EOA1qRRfzhu5zDrMozeY4hxmDunRzVRv2QN79B7bV/7C0eA9uu3wKJeUj+4E/Uk366PXcG/SSXzmHOiTjHM/umr9IUXRH3NuABjSBwMWF4KBICmXIHHgMehRCQ8SR52EHGVRIXEFYrjRDxvuBoSHG8EXYmznkYiRFCc2MIOKGo3QIhYwYuRFizHUiJF6J1qh40UIhjjCjxZpeOKFRE6UxIkd2JEkRUFuuMSTE9144hhUSvTEiTlmGdFwIVLh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//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCJCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly0sBuRmjxccPL2bmEMLcNAyD06hRkxBDWqmS1LBR72htFE7s26c5vKEtNBDu3wx4A8UTAjjuKsJ9kjD+20zynUmY/y4h6DlOOtKBs7F+E0f232C4/tc0/R13EPEz/ZT/bQK9zCHrcXtwDzNNfNw26L+Ucf+2Fv0tidHfbc4BuNJyA8IWiIEqdZEgbKwxiBIgD6bWnoQoZVEhamFgeNIfG542m4cmabhhB3mQWBIgHYTYoYokObghDjCWBEKIetQ4koAbZqHjSCVsOMKPItm3YYREfgTEhi0kCZJ6GxboZEdebEjDlB+lsOEZWHbUxoYzdNmRFBuWISZHI1SIwpkbGfngi2xi1ESFHhgSZ0YbVCjFnRh9WaEcfF60RYVhBmrRChXCaahEUD64aEVkVDjioxIRUeEYlE6EYIKZSsRHhTR2ClEZFYYn6kNUVFjHqQ/N8GAJ/qw+VGERsTaE3YOY1rpQpA/+oetCJg445K8K6fDgpMQeZMKDXSSbUIVcOmuQHRX6Ia1BaDw437UF8Thgk9wSNGiCQIRLEHwJ/meuQN4liKS5iCYY7bppJhjHugLlmWAf+BJTYb8UJthBv308KEK/d7za760DrolvHA+u0K9tCbIw8YMWPxzxwg86vG7CCcKKb8EJHoxvwAMOjO8h//bLwYP84rtpf/fiG++A85rb7oDvhivEg+quO+6A5eLrbX/grpttgtuuS+2D1q7L8oM5h7tsgs3ia2yCyIYbbH/Drstrgr6uO8el/c7ar6sh95vqg3bgS+qDppr76YOhrjtz/n/9WoorvmMP2PW1jXJqc6L4Dj1goeb6+SCg62agJ75M0GmnuW4mqCi39SbocbhkVmhm42DiqyW061ZZ4ZXmFp6glNwuWWHS3Gbu7rpBVhg2t0cn6KO5N26YY7gygmpuIC1uuLmzXwucIrcghjh4ss0nWLe0KG/4/LXFz27u3gkmEW7vb4bLX4gMpFE7+gyIgAe36IYIA7euS6qYIXOU0YUZdBwSFHnoI8JhxLCC5KGmAyy4Hk9uwD4GIGcwhqgccGwACJ8wDH1B+wsevkMGn3yhgQzYAmAUJ53t9GRnGPSLFu7jP57gwQMgfKBeqtAfGe5kDCBkgADz4rf+dLAn/kvI4fTisoMHnccnuWsgDN43FzzAoEIX6okcctg+9cUlDSIIUdl6ErgGLk8tANwSUEjIPvG1JTrsy9pPZJfDFmzvLHloAQjRIJTzUVGBYwEDFSsYFD2Aj307eCNY8lDEHKqAKG6g4gG/uJUwGBCEZhzKGRSJGhwMjyt6QGEOTUiULlLxd1qpHgi9gBTy5XAEPZuKGDqnyA8oRY+URE0LYAcVM8gxlqdxw1JgiUsG0KBqSzkDDXp5mh3ukpinmcHolFIGthETj0kxJSVREIbLEcUQYUABMk+TyqV4EpcekALkgCIHKcBwmwz4YVQmic5kMtImYXDmNjsAzKe44Y/E/txBrmwyhkK2kwEk0KVV9GDHfzIAB2BY1UvsAAZNtlMGl7TKIdho0NOUoAhj2GJJ/jCGIiSxogwAQgu1QkaQjmAHXThD1DjihzN0YQesBOlpROgVMrxMprfxQAuAoAUxnCEOMWNIH+JwBjFoAQgtOCdOYcMBdXolDrdcKnM6IIISoGAFLGDBClBQAhE8Uqq/aUHNxBJEsJqViks4Cw7PytYNaWCfZsGDQ9tKV+nggIlq+WBd98qcL7yFDgzkq2BTQwM6yCUMGhisYN/JFj/ET7FnHcJK65KGgkJWpjKwol7EgM/LEnM1fzlEF77qWVx2oAsj/QsgspDY0sZyA1ngvyNh/pAF0ro2RFnQqGEA0b3baqsLsmWMGLTp2/6soJuNScMPilueH2i2Mn7wwkeZC5sUeGGypGmDFGLq2xFIoQ3oSQMTuKtYEjDhufRpwxaiytcWbAG8KvIDGYhwNbN6gAhkwK6O+FAGKsDgpu3swAyoUAY+BGoOZMiCDj5ASRPoIAtkMCyrDmEHNIhhC0PAwQpIoFTjeIAEK8DBELYgBjTYIbXmOgQg+oAHOsghDnGQAx3w0IcF9evGOM6xswICACH5BAkCAM0ALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQICAgQEBAUFBQgICAkJCQoKCg4ODhISEhUVFRYWFhgYGBkZGR0dHSAgICMjIyQkJCYmJicnJykpKSkpKSkpKSkpKSkpKSoqKioqKiwsLC0tLS8vLzExMTMzMzQ0NDY2Njg4ODk5OTs7Ozw8PD09PT09PT4+Pj8/P0BAQEBAQEFBQUJCQkNDQ0REREVFRUdHR0lJSUpKSkxMTE1NTU5OTk5OTk9PT1FRUVJSUlRUVFVVVVZWVlhYWFlZWVtbW11dXV5eXmBgYGFhYWJiYmNjY2VlZWdnZ2lpaWlpaWpqamtra2tra2xsbG1tbW5ubm9vb3BwcHJycnV1dXd3d3h4eHp6enx8fH5+foCAgIKCgoeHh4qKio6OjpWVlZ2dnaGhoaSkpKmpqa6urrOzs7e3t7q6ury8vL6+vsHBwcTExMfHx8rKys3Nzc7OztDQ0NHR0dTU1NbW1tjY2NnZ2dvb293d3d7e3t/f3+Hh4eLi4uTk5OXl5enp6fPz8/X19ff39/j4+Pn5+fr6+vv7+/z8/P7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AJsJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiKf6gTOlRIYibe48SsyVT48EmDNnHkM5axvNoDN7oNOZqp/QqDMXKR21T+rXCfKwdpoIA+zUFSTNXlppxe3XZXYrdfIbNh7hR9EUh80GeVE5y2EbcT70D4XorztQFwoDO+xD23/+YvH+PXzPOOSzm+dZyEL61NPX6wzyPnVz+Tg/10d9HL/NP/uhFpx/NvkQIGgVVEJgTW8cCBohC9K0iHsOYpZEhDRJUSFmMmA40x0bJtABeB7GJEOI/ZX4EhwhwqEiTJN0sCEWL8K0xoYw1PjSIxQ6iIiOLpWx4RtAtuSIBBUiUWRLQjp4wY9LqvRIBRW6GKVKNzooxJUrcVBhIlymxKKDZoSZ0gsOemAmSiA6aOWaJT3hYI5wluRIhaTVSZJ+AeagZ0ktOGjHnyPx4WANhI70hYN5JgqSjAGy4GhIbQb45qQdZXFgBpNg+pEHB4LhqUd7OBjIqB2dcSCiqHKEpqX+rW7EiIOxbgRdgBfWmhEVB8qha0YgHPgrRogcuOWwFs1xIJHIVrRogBA2S9EMAYYgbUXX7XfFtRMB0iu3Et26nyPgRkRGgGqWC9EQuKoLUQgB3ucuQ5QcOOi8DBFyILn4LlTpexn0y9CY9dEpcELK7ffEwQrxuh8aDCckBKwRH/RqffdWXNAHAf6hsUE9vtfIxwUJS/JAkAR4wckDNRKgdiw3c0i1MTczSIAr1Oztfi/UDOB+Bp98GtA+B9hzzILgXHMhNMe8yMs1P6JyzZOYHPMFAY4cM6j7eRyzCwFmfDIQFLOs4cM1mxHgwjET/F7QJNsRYMAx3xwgvydLYm/+zcHuJ+/J7O6XK8vn7pcuy+LWhzfJO+/na8xUalsztftZGzMYB0Z7srIBMnuyIsbWDG+ANVfxLeIHDk6yy1af3F3ZJCe8H6snG3rgqSxzvZ+oLGuxaacn/1vfpR9Dul/OLD8bYKMfl7pqzCwIyjKf+/l5MusHMq9xE3OyLPzwLIN94OEfu71fmSdv8OXJalR47MePZHsg8REXfqAFUGqM/YFKkmz/siSb0obyV7H2VQhuDJOE8Q5Eo/K1iGQn2lCKIva9/YzoY1MIUYc0xgjbbEh1DGtQiKzwMbKFiDMVC0SIMHMGjblhhQlIg8YmtsIWRswQ8tsQChmGHhiSMGL+moIhCPt1MQ2SSGCNW2EHJoivxK2QfmsBRBy20IIMCGENdSAgVGQHwwayxQ+UQ80TFvcUOcEQMzDQYlkQ4TDYYACKvAnjGT1XFhEuhwhSSQTHzogZJKjRK4hAAnm01xQ+hAyGF4CjVuBwyOj8cSly42NmhACmriSChu9RwlScyEf0aUVtB1rDVMzHRw8o8ilw0F2AnEAVO0oSjYR0Ch1eV6EWVMWVr0xADsTGFDvkAIYUsAouc1mDWBaFDjWQ5CCsQspcsgAOwCPKJODgm1dqjiqczGUCMgAG3AElEGDIgDaDiRU7RE6boKnBKWkCh2SiMwFHw0ofFvjOzCThcTb+kUMS6pmZKGwlEXLk5yTfcE2WEOINmBRoAkS5lUqYUaGgCcEV5EDGkThCDlcYHUQxM4OvcHGjmvFAEthgh4pixBF2YEMSVAlSzPQBLHLIYUtBkwEYPAENcLDDH7TGkEb8wQ5wQMMTYCDOmaKGoWABBC2N+psLdCAEK3gBDGDwghWEoANYY2pxNEmWIGr1q5JUw1nikFWwmtVBE1inVwyR0LO61Ts2MARbXvjWui7HDW8RBH3sytfQBMGbb4FDWfta1zfWxRFtJOxZqcDTuuBhqYo16gzuwBdGRnamH1ArXdhw2Y2yQUGBeYQZJtDZd5phMoVxhBkaWdoKWeC0lHmuBBu81NoKbYANkNgNHIpYW/K8QLOHucNDe7ucJ1B2PY5oQzWJm5oWtKGx+OEDGOjZWw+AgQ81usMWZBrZD2zhuEviAxogW9cYpAG7cGqEHKwggrOKwApzMGmdFjEHMbhzozUYAx0WMaxAyMEMRGivJENQBDPIAbDgqkQh7hBUKgjhBR/w4G8qoIEXCIEKOL1DIWo2kEcwwhCDAMQf/gCIQRiCEY8ALYdXzOIWzysgACH5BAkCAMIALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDAwgICAkJCQkJCQoKCgoKCgsLCw4ODhAQEBISEhQUFBUVFRcXFxgYGBkZGRsbGx0dHR4eHiAgICIiIiQkJCYmJigoKCoqKi0tLS8vLzIyMjQ0NDU1NTY2Njc3Nzg4ODk5OTs7Ozw8PD4+Pj8/P0BAQEJCQkREREVFRUdHR0hISEpKSk1NTU9PT1BQUFJSUlNTU1RUVFZWVlhYWFpaWlxcXF9fX2NjY2ZmZmdnZ2pqampqamtra2xsbG5ubnBwcHJycnNzc3V1dXh4eHp6en5+foCAgIKCgoeHh42NjZGRkZiYmJ6enqGhoaampqqqqq+vr7S0tLe3t7q6ury8vL6+vsHBwcTExMfHx8rKys3Nzc7OztDQ0NHR0dTU1NbW1tjY2NnZ2dvb293d3eDg4OLi4uTk5Obm5ujo6Orq6vDw8PLy8vT09PX19fb29vf39/j4+Pr6+vz8/P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2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SUlMTExOTk5QUFBSUlJTU1NVVVVXV1dZWVlbW1teXl5hYWFkZGRlZWVmZmZnZ2doaGhoaGhpaWlqampqampra2tsbGxsbGxsbGxtbW1tbW1ubm5ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV4eHh5eXl7e3t8fHyAgICDg4OIiIiNjY2RkZGWlpacnJyioqKkpKSoqKirq6uurq6xsbG1tbW3t7e5ubm7u7u9vb2/v7/BwcHExMTHx8fKysrMzMzNzc3Pz8/Q0NDT09PV1dXX19fa2trc3Nzd3d3e3t7f39/g4ODh4eHj4+Pq6uru7u7x8fHz8/P29vb39/f4+Pj5+fn7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCfCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltu3OR3rYCFnA48wdRW7zImTkZIHfv3+B8NFL+JkRwIgBTyncNhGGxJD9bmCs9k7kywu6UD7rBjPmQpvHdnriGbOR0GEh2SjtGQ5qr4Q8sPaM5DVXPo9nY55sO6tl3aXx9rZaBzhrO8OrzjF+PPnU5cyDO48KPTrmDNOhFrfu+Uh2p7+5/mNW850pH/GeNzQqr5RQbvSR5bBP+qgD/MtA5iPtBON+5A76IUWaf4lVEeBRbRBY4IFGhaegX3QwWFQiFzzoFwd/SFiUCRYuAMMjGhJlRYdLhEiUHR0uZqJQjrxH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+Pn5+fv7+/39/f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AJ8JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKVYhJ0BwpHjxImSMI09i3HSvJ6bCgrt26HeTA3XvxzYW7gO2+iMS38MNEHwIrtvvGsOOEcRZLrmvpsWWBjYpMnvzk8uM6GDZvvuO5sBfRoj+4LT0W0QrUqAGxFmvnL2zRcWaDbXMbthLdXTs16Q27A/Ctj2AQL3486yC6y1E3aX6VT+joqHNTp2oH++0/26f+0vF+u3J4qHLIw2ZzHr161CDaP03/XjQi+U3H19+sF//S7vtJloJ5/iXVR4CSEXFJgUoNch2Cd2EwB4NKRcIBhIAlAQmFSXkiA4Z39cchUk+AWFcLj4yYFG8meqFiUgCCOOGLRyFiG4QcgEfjUS2ACEOKOxp1GoZJBHlUHSByYaRRjTwYIBpLGkUEhuxFSVRkELZhJVGJULklUUNACOWXQtEXoJJkBlVJBggWmWZQWCAIw5tB+YEgB0DS6VMMCOqoZ0/67Tfjnzx5cuF+LhLaExwBtqBoT5awuV+ej+bERoAiVopTJQG6qaml+2Ww4ac4XeIkeYOSahOj9RGhak7+G+xH2Ks2BapelbTWlEJ9HORqk5310eFrTU7U5+iwM3Fanx7IzoSlej00O5MI9fEhbUyC1HfDtTGNsSy3MB1KngjgvgSseqmWq9IX72XAibotiesdGfCylO17idS7EovkbauvSq+h+29Kyqo3cEoxeufpwSVt8Z4dDJ+UmMERlyTJe0VUXFIe72WqMUhnvMfIxyPRoN4HJI906nJdpBxSl+pB7PJHCWNXycwfXUperzh7hIR6C/es0cTewSE0R56818fRGzXy3s1MZ3QudhlErZGt0R1r9UX8YtfZ1hfFSZ6WYFs0JXnCll0RCuotrTZF0Hl339sTSeod1HRD1Mn+e3lLZIl6VfcNESXq8Sy4Q06Th/LhDimiXgiMO4SIeihE3pAh6q1gOUOYk6f55gpNTl7loCfkOHmQl45Q4t4trrpBhO/8+kF/kxf47ATtTTHuBNltM+8ExY3d3MA/syt5bhevGdrFCyS2d2QX33V0XxeP9XJaAz91dLcDz/rdzSfddvPPCB+d0c3/TF7QuOvsneHA1xwd3rzDTJ7Mxa9MXMvN13Ay+SFTz8iKxzH1eGx2k8AY+YjmHfJx4WHNk99y2Pe6gpGHfD0SmPTe4y/g3Us9+SperNRDr+KFoV3v0l590jU7eWEndcAjw7c8qK3mmQ871gLes8gTLeBZkDz+zAJeid6Tvdltzztp493xCme9/eAKdyN8z6xwx6r3uIp3phIU8NynHgyManY/XN8WMcW72k2Kd1UkIu88EcX3JGp210MV7z4UID+p7og7o1TptCAn3IURaLibA4TQ9LowIWhMqrNfgJ4Iuh3uJ3qlWx6CGGk5R/huP4gEHZIwREjQDQlCFGRcBiH0o9KJDkM5Kp0EtQi66SHojZYbIohQtDlPvMBEdTlg3yJxwzZ98XAOwuUCMsDCvPFBmHUhwhQFt0oIUZJucURlEvtmJmS2IIjUROZdepDDvFVTmzfA5tuiiUsRzCGFamsmLjNAhhCWzTraVMwNinm058RzMUn+wF/UIkHHeyqmCHIY4NE8IUt/KuYDXbAD/WbmSoMGhgNJgEMfFqqx2jgUNhlowRPaQIc+IIKiCKkEIvpABzjowQsSBSmdEjHKiy4nAxz4QAhQsIIVoCAEH+DAJQNTAu08il0udakJBFGpTQb1ovxTlCOMcNSLTpNQjmyqNlX6JkUYUqrahOWj5rBTrGJIn4+qBB+9isvqfcoP/SQrglynKjr0Uq3k+aWq0ghX9YjzVZZgw43qih1dqqoSbNAfX1EziGtdAg6CHaxkVsMtOixRsZOhQb38UCzISgYM/6pEHKhlWcDYUV+CIIMLBzuGj/kBDJA1jssE0Qa2wVWuKatbxB244AGpDoGxTJtEHs5Qg8Sa6KllS4Qd2IAEBt4JCGIorOU80Qg/0KENWijCCDrQVcVkoAMpKIIWzpAGPJCPIJeghCMWgYhDHAIRi3AEJS7hie+6973wtVxAAAAh+QQJAgDEACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIGBgYNDQ0SEhIVFRUXFxcZGRkdHR0iIiIoKCgrKysvLy8wMDAxMTEyMjIyMjIzMzMzMzM0NDQ0NDQ1NTU2NjY3Nzc4ODg5OTk5OTk6Ojo7Ozs7Ozs8PDw8PDw9PT0+Pj4/Pz9BQUFDQ0NERERGRkZISEhKSkpNTU1PT09QUFBUVFRYWFhdXV1hYWFlZWVpaWlubm5ycnJ1dXV2dnZ4eHh5eXl7e3t9fX1/f3+CgoKEhISGhoaIiIiKioqMjIyRkZGUlJSXl5eampqcnJyfn5+goKCioqKkpKSoqKitra2xsbG0tLS3t7e5ubm7u7u+vr7AwMDExMTHx8fLy8vOzs7S0tLV1dXX19fZ2dna2trc3Nzd3d3f39/h4eHk5OTl5eXm5ubo6Ojq6urs7Ozt7e3v7+/x8fH19fX39/f6+vr+/v7+/v7+/v7+/v7+/v7+/v7/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////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Q0NFRUVGRkZISEhJSUlLS0tMTExNTU1OTk5PT09QUFBSUlJUVFRVVVVWVlZXV1dYWFhaWlpdXV1iYmJlZWVpaWlsbGxvb29xcXFzc3N1dXV4eHh7e3t+fn6Dg4OHh4eLi4uQkJCUlJSZmZmenp6fn5+goKCioqKjo6OkpKSmpqanp6epqamsrKyvr6+xsbG0tLS3t7e7u7u+vr7CwsLGxsbLy8vQ0NDT09PV1dXY2Njb29vf39/i4uLj4+Pj4+Pk5OTl5eXl5eXl5eXm5ubm5ubu7u7u7u7u7u7u7u76+vr+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCJCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTpyO5VEmSAsMHHU+wnIHKdagYDwrCih3bpKtZnmpSjF071oSfs3BppjnCtu7YNXHztjxTxK5fsXoDnzQT5K9hBUkEKwZZxsfhx1cWS84Ih+7jy3sma554hcPlz2o2i2645sfn01pGq0ZIJcPp01BWyxaYxsbr10Fmq/4T5fbtIbpFl1Hr+/WU4JqhFPctBvniP4WX32bjXDAbE9Jve/hTXS8Y19lf/mPpnldK+Ns+yMe1fP7zBfVwV7R/HRo+1z8b5n8ua58rG/2X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//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCfCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtGhRRXfuLDLKtOlEPC2CcGBAlcGHJHCcat1KsJKcD1XDhh2Bh6vZon6YiF0r1sjZtz7toGBLN6wIuHhtWnrjoa7fqnnyCn45KY2Gv4ipVhrMGGUlNIkjM4jSuLJITW4OS47MyLJnjnX6bpZ857Npi3xajB795bRriJGarF5947XthXM2zJ59u3fBQ0F2z97hu3gc4bvRFL+9aAjy3WWXu7aj+/lsRdJPR7G+u0f2z4dU/nDfzee75Tuax4+mbL5xG/WzPbRn7Ekt/NFM5g+GhOP+Zg576CcYISD4F9kGcmQiYF58pGdgXT3YsaBgeDzoFwdkYDdhXnZYSBcJdXCyoWB1eLhWD4GNKBgdJoYVRHkqrtgiVTHoEeNgHbYIgoQ3CnbHjGv0ONgeLRYRiZCCCeKgfxvUgaRgjRRoYRKQPJmXJjR4SIeVgilhYQyPcJnXGhZKIWZePz7o5JlwGfLgB36wCVcnJRh4gyNywgWFgUnkCVeO97Hnp1mLLMndGYO+JYR/bSR61nH3ueGoWYcwOqlZwcGH6KVbsQifoJw2FUl14/UZqlayqVfbqU71Ad8H/niy2lSW6sUpK1MlqrfmrUVxAtZ4ZvJqFBzqxSCsUZaQal2YxxJF5nhbNjtUJYbuZqq0Qj1r3QZVYhvUJcoit6u3P0FqXRHkCiWadUem+xOgzwXp7k/iWQfCvD/5MR6P+PJk33PG9stTJePZKPBOcnAXxME8kcAdjAzjNAh33kWcExncpWjxTb8iR8LGOOlr3bggz1SFdRyIWHJNUiJHxso1TWydhjDL5IZ1FdcsUwzW8avzSwRb97NMFT537dAubfdcaUi/1LJwTb8kiXVuRd1SHtZFa/VKZ1i31NYr7fDcXWCvVO1moJZtkiLWMa32SUUjt9jbJ2m72710n4SE/tF5nyTCc3H0bZJ1EAseEiPWzW14SK4ix8HiI8E7W8CQg3QzcvlVDtKeyDWq+UdGPOfz5xut8FwfpHv09GyJpN6RdZS4zpHQsmt0yXMb1K4RJc99oHtGjYz9O0aLPPfx8BaxjZwKyFuUyHMtNF8RItBLT5HywjFvvUTFe7y9RMEjR/b3D03SO/kQ3Y5c7ug/RHv7DU2FXOzwM7T6aq3Xv5DpyKGuv0KhQ87o/lcQzgnHcwQ8yOWEk7kEGkRyq6GcAwnSOOE8boIFQdxzFIfBZ3iCcB0kyP1GE7gQCiSAwjlaB+02G7yZMG7C4SAGsScct4XQOmnDIA+EZ8JndO05/p154ch6OLXnVM2Ef3tOD59hwBr2EIbW6mHQlNhDnomuhwsUTs46KLPn0KyDIxzNy0x4suekzIQiew7JJpgB6xwvhBizjsYw2EXkbBGDDgNhCBNmnYWFcIrPMVgHl8AdCU4wjVcMIf+e40IMQnA38upgx57TLgya6zno6iC4xrNGArJQONzqILVKFcJPCkdrDkyWepg1wUsCrIOeCONsgjXBRwqnk/rLAXxs5UBEWgdWGGyidVblwEqEi28TzJV6cqg/ItxnUwmk4XgQSMA5+EdSDkSheqipv/A904FpCpQDpcAnB1rxPnciYCKOyR04ERCK8MHl97J4H1rW71/+9AHT/3RpIVSiLxKy5A6V6kcIEzWpfnwoUiXJB08DRZJ8trzPjtqnTBPVCH2emtGLyFfRFqHoexF9EAl42byGmogJnbAeH9hpojkOj0AzEssfrBcJfsaUKgqSXn1uSpUqzJOnDBjg8Ez6IO1tLxHnNKjKvkfOGX1xe3dgKXxcur1GaNNAWamfNS1EVfIpwpkGeir8OjqenBKwEsI0Xgf9YNPnQNORAU2MUUPoiThIFTFfW6IlTIkYGy7xGXvdTCD+epBLxEF+dTlDSgmbEDVIYS5jaUJ0GMsQS/QBDnyQIWU3y9nOevazoA2taEdL2tKa9rRCCggAIfkECQIAvQAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAwMDBwcHCwsLEBAQFhYWHBwcHh4eISEhJycnKSkpKioqKioqKioqKioqKioqKysrKysrKysrLCwsLCwsLS0tLS0tLi4uLy8vMTExMjIyNTU1ODg4PDw8Pz8/QkJCRUVFSUlJTU1NUFBQUlJSVFRUV1dXWlpaXV1dYWFhZWVlampqbm5ubm5ub29vb29vcHBwcXFxc3NzdHR0d3d3eHh4enp6e3t7fn5+gYGBhISEiYmJjY2NkpKSl5eXnZ2doKCgpKSkqampra2tsbGxtbW1t7e3ubm5urq6vLy8vr6+wsLCxsbGycnJzMzMz8/P0dHR09PT1dXV2NjY29vb3t7e4eHh5OTk5+fn5+fn6Ojo6enp8PDw9fX1+Pj4+fn5/Pz8/f39/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AewkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz5xyvsj5SbRoyiw3csRQwDRGkSpwjEqdmlHLjwxMs2pV0EEK1a9gGXoBomGrWa0y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/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3DlwjZ0uTrrY4Um06Es3VlRkuKCgaVMSQbYYnUoVpBcmIZxq3aqAR9WvYCdm+aGBq1mtGLCEXcu2IJcfGc7K3Rqmrd2qaJp0mMtXa4a7gHleUdG3sNYngRPTtPOEg+HHTr8ontwSTRKmkDMDocz5pJkemUM3BdG5dMgzPESrVkDHtGuNb46sXq3lte2KTjDPFu3ktu+HVvbuXt3lt/GEZVYM3z30uPOBTpbvJvH8uZes0mcHqX68SfbhUrn+3xZT4vtur+JtRzG/G0P613xssN+t9n3pLx7mr85Q135nKvqthph/nS0RYGgfMHEGgZz98cKBj3XwgxWAMMhZGiNA2JcKUSxoYWdfbKChXC5Y8aFrWeg2olMmTHHia1as6BcSZbz42hQyNuWBFBXa6Np6MppwhY/qyXhCFkQWOeII9SXpGoAabuCikzCOyASVtmWhYQppYPkaGBBiIIWXr6XhWIAtdEmma+UFGMWar9EQ4Ahqwlmad/ptZqdpMeo35p6lkaFidhpwAahpGbJXQp2HUhbEfC40WloV8/kgaWdpzKfEpZ2lwF4TnHIGxaehUmYGqaVO5ul3m6aqmBT+5lnqamJvmBfprImlll0JuCa2xXcaMNprW21KZ+iwd+GY3Z/IthWIiNLp2Wxb0Uk3wrR20YFBdsJi+xUT2b3p7VpwWCBdC+OyBe5yGHSbrlF2LPtuWNUOl8K8YQ26mrv48qTscFf2WxUIy20gcFVcSDflwUbJOdy1DBsFh3RNRszTqMOdYLFRZ+6G5MY8fbGcCSAThcRyQ5a8E7SzfaDyTr8Ox+zLNw0xXAY90nwTy6shoTNOIg9X48824TkbyUTblOhsCyctU63DOV1Tn7PdKrVMPgxn4tUyCTcb1zKpMZwKYMd0xXDilu2SEsN5qHZLJuzWwdsvbTvbD3S3VIb+1nmzRPVqcPS90rqrGSy4SizsZvXhJ3mtWm+MnxTIcB9HXhIawwVueUla7PbX5iX9qxrEoI9ktGo0lE6SrquBqrpIhM1GxesiYUcb7SF1rBoZuINk92pu9O7R5LsJ71G8s7lnPEds7KbB8hxlOtvc0Gt06mweVK/R3rORpj1GZOwWwvfgi0/+Rdyv5v35FF2/WvbsUyT9atTHL1Hzsz1vv0TIr6b8/hAh3tcAGJHfqSZ4BHyI7kTDuwQ6xHaqqY0DGxK71cxuggxhnWpch0GFnE40qeugQkQnGtKJ8CCdm83nTngQzO1GcywsiABXU7kYEsRxvLGhQRJXNR0WhHD+qjGcDwXyN9XA0IfpW83WhigMA4oGb0wURtymF0VhsG03bvPh2XaTNh+KbTdkiyIORVPFrO1miT4somgWp0OoFS+KS1tN03T4QdEgbYhB283Qhsgz1fiMiTbzXM50GLPdzEyHfRQN/IZ4suGkzId5PFoUF6iaGtoQY7vR2BAntpyK2dBhuzGhDRO2nDnGkGDDEaIOSbiagPlQX6rhVwfrtZt7+bB/MhsiEJMnywmW61y6DJcPtcUtH9IylD58VnakFUNWzuaQJyzWco4Vw0IuJ1g61OBweGVDN0qHjSKE1XdkFcNVZadVLHRfdjh4Qkxmpwo2NGd2/BDD+WUnhCyrpJR50CjCR32nA3uwIQnMU5wYlgGWAtKhGmfzAh/WsXBDBOVuOMBEaa7mBkw0Uy6ZCKbdSCaKWiocH6oojIUaBgokFQiUMkOdlArkmIXppQ8rWBjIuXQgc5DoWWgwh5seJDhn6QA/fUqQPXThCS/YwAZe8IQuBJSoUI2qVKdK1apa9apYzapWt8rVrnr1q2ANq1jHStaymvWsaE2rWtfK1ra69a1wjatchREQACH5BAkCAMEALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQICAgICAgMDAwMDAwMDAwQEBAgICA4ODhMTExkZGRoaGhsbGx4eHiEhISUlJSoqKi4uLjAwMDMzMzQ0NDU1NTc3Nzg4ODg4ODk5OTo6Ojs7Ozw8PD09PT4+PkBAQEFBQUNDQ0VFRUdHR0hISEtLS05OTlBQUFJSUlRUVFZWVlpaWl1dXWBgYGRkZGhoaGxsbG5ubm9vb29vb3BwcHNzc3V1dXh4eHp6en19fYKCgoaGhomJiYyMjI+Pj5KSkpaWlpqamp2dnaCgoKKioqampqysrK+vr7KysrW1tbe3t7q6ur29vcHBwcPDw8XFxcfHx8nJyczMzM7Ozs/Pz9DQ0NPT09XV1dfX19nZ2dra2tvb29zc3N7e3uDg4OLi4uXl5efn5+jo6Onp6erq6uvr6+3t7e7u7vDw8PLy8vz8/P7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AIMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2aY8Q8udLmps+fQAm+sdKDw4QJCJIi6JBDSdCnUFfCoeLjg9KrWBGM8BK1q9eOXpCMyEo2a5GvaNNCzPJjQ9m3WYOonUt3YBcgGuDqzQqmrt+ubpaA2EsYqwc9fxP7zIKjsGOsQBRLjrkHSojHmK/CmcxZpZwkGTKLTsqls2mScIpEGM36yenXHuUUYU0bQWTYuC/uUXKhNm0YuYNPjOLWN225wpMz3HLCuO8oyqMfhOPDufEt0rMLhBLaum822qP+m5nh3Tjw8MmblHceBn3wNTTWG3ftHveU3vJr76iPG0h+307xdxoZJPxHGwdcCWhaFfgZmJkHPNChoGlJOIgZBzgskceEpu2xg4WEgfADFXJw+JobKYAIFw1PpGEibmB4oCJZOFDxYnBZYDDjVSxAd2NwVeyYVAZClPGjcFEIGQIUexwpHBQ7smCFk8k9MeMLWVCZHJQgknCFlsklaSEHPoIJJIhHmJlcFhbS4IaawoXhIAZlwombGzL+d8ObdgaX4n/09Znbh/mR0JOguVWY3w+InpkfFI3mRkaD3m1QWqS4FbjeCeBhCpt/6+HgqX3yMTrqa2vId9apr9WwHhL+rL6mXnlJxHqaGa/aehp53q2qK2dcWmfqr5PFUYF3ohLLWXXWnaAsZ1tU2umziv3p3KXUJiamc5Bmq1gHwnqr2BLWkSBuYnbo6Nyh59Z1hHWBtjuXHEgZd4O8fr1rHAZ84qvWHeo+5y9d5BpHw8B0Wdcvwl9tW1uaDKd1mW8cRJxWtMbVaXFUhNZm7sZexeHclyB3xYRxL5Ts1WC+ZakyVF8Yx8LLUQlh3JQ0P1UcbSHk/BTGtXXr80+g0pZBk0P/xIFvQiT9U8y+Gen0TYrSNvPUN2lKm8ZYxySyb13bFGRtyYY90w++2Wj2TCzTtvZMb/h28NsxWeFbvHS3RIT+b2jkDZMJtX3gN0wBjzbs4CvhWpvaiK80Nm0lNr6SvqxVLPlKNpB9+Up50bbE5int0TLoKKXhWxyknwT0aBmkfpLDon3sOklVj7bf7CQxy1qtuI8UH21S9D7SWLRpIbxIebJGxvEhdcfaZsx7JHpt0X90R20YVO8RHLVtoH1HagT+PUdn1Nbz+BqRUdsI6Gs0hsftZ/Q+bbLHX5H6tLFvv0Xl87y/ReGjjeD+RxHu0cZ7BJzI9WiTvQRKZHpuc6BEfAM9CT4keaNZngUfQjzWGG+DDvkda4IHwobobjS8K+FCaiea26lQIbDLTP1eeJDViaZ1NEyI6WqDuhweBIL+rHGZDw3SttF8bogGyRxtyobEgVBuNJZr4kAex5rISTEYiqMN465YONEcToosqA0IrjiQ2dTGRWS0W23whsS41WZuZOxcBMmItsWRMRhUHA0Tm/g16t1Ra6zh2hBZKJqrXRFqtZHaFcFVm6aRsWisORoZbTgaoUlxZ6w53xVt5hucSREMMrujCIwjxCbOqjYpu2Ifa0MyKerAODMcIhecI8gcdvBAZJSCcyAmRefVZmFDLJjcrogH69TyhU9kIDBzKAfrNOGKyaTNhpqYLufk4IrCrI0GrrgHRvpmDFeM4WhIKEVr0eY2UqSkaO5FxhMa8Y6rHA22rhgs0VQAD3eJFMgtMaOCfAoki5kp5R0h6RhY+XMgPcgM0g4qEMxUgaEFsdJePNAeiBYEDa8sCwZ4aVGDXOEIMFBXCH4QBQ12dCFkqMNJV8rSlrr0pTCNqUxnStOa2vSmOM2pTnfK05769KdADapQh0rUohr1qEhNqlKXytSmOvWpUI2qVKdK1apa9apYzWrvAgIAIfkECQIAvwAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAwMDBQUFCQkJDg4OEhISFhYWGxsbHBwcHx8fIyMjKCgoLi4uMjIyMjIyMzMzMzMzNDQ0NTU1NjY2Nzc3Nzc3ODg4OTk5Ojo6Ozs7PDw8Pj4+Pz8/QUFBQkJCRERERkZGSEhIS0tLTU1NUFBQUlJSVFRUVlZWWVlZXV1dYGBgY2NjZ2dna2trbm5ubm5ub29vb29vcHBwcXFxcnJydHR0dnZ2eHh4enp6e3t7f39/gYGBhISEiYmJjY2NkZGRlJSUmJiYnZ2dn5+foaGho6OjpaWlqKioq6urra2tsLCwtLS0t7e3u7u7vr6+wMDAw8PDx8fHzs7O09PT2NjY3Nzc39/f4uLi5OTk5ubm6Ojo6urq7Ozs7e3t7e3t7e3t7e3t7e3t7u7u7+/v7+/v8PDw8vLy8/Pz9fX1+Pj4+/v7/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AfwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZpmsuT4gMHEBQ84mFwxc7Oo0ZtqtBRhcUGB06dQFWCAcrSq1ZRssPjwELWr1xdXw4rlSIYJCa9o0xIdy7ZtQzBANqSdizaD27t4BZIRooGuX7RU8wq2yiYKiL+I0YIZzNgmmB2JI3td0bgyzCohJGuOakGP5c8o5zzJsLk01DGgU4tso8S066dSVMvmCKf169s8Zuu26OdJ09u3e+weHrGKXODAqxBfvhBMCuTQ1zKfPpCND+jQ7VLfPgU79hvbp/6boeEdu5jwy6OUxw4E/XA0NdZnd7/7ym/5wKXTTw0EP/LA+6Vmxln+vRYDGQGqlkWBpmHAQxhsJKgaEwxGtgEOT3zRhoSy+QFZhXR58AMWG3KomxoqgJhWDVOgYSJxZXCgYlc4YPEic1/cN2MLVNw43YIzSiWEfj4OV0WQH0zRR5HTdadiC1swSZ0UKr7ghZTUOckgCVxgSd2RDG6gnJc/VqgEmdR5wSANaqA5XRkFXtCjm8ylISN+N6RBJ3N+PIdfbHsy9+F6JOgZ6HIUytfeocsBud4UjC5nhgXraRBGpMsR6N0JhmK6W3/l4eApcVas98Oo761nBKrDxefdEv6s7qaed03EqtsZ5cFq62zkYbfqrrJR4d2pwKrGho63iVqsatdBd8KyqoGBnQadQmtZitBdau1nYCIH6baW+XEccIuCW9kT0JFgrmVwIOtatesKZhtw38Y7WBsVIAeevYzN+9oF8PLr1hzuljanwHmhCxwNCA/WF3BtNoxXt6+dKTFemd22wcV4SZscx3fpAJy6ILfVBnJdlszWrK+BpTJbh9125ctikQFcCzSPJQRwUeYcFgW3geBzWB6/Vu/QR4HqGgZLIl3VuKYJ4XRVNt9G5NQ1JeoazlgbpalpB3ddExvAiV2Uo6Ypa3ZNP9xm49o1cfUa3DWpcVsNdNOkxf5tR+f9UhG3neG3TCy85sHgMt1GLOIumeE24y+hXVqJkLPk72YbV96Sq2lr3tKdpj3h+Up+3PbF6CqhcRvlqJtUdGkYtJ4SxZuRLLtJWpe2w+0nNWsaE7ybxHlpYwY/UsamnW78SKCXdvXyHRUcWYTQh3Rb9SHN8S/2IK3xmgbcf6S6a4eH3xGurn1gfkeOuxbC+hy1b5oI8G8kf2n015/R/Zu9rz9G6DON+v53kTQYjoAXIZtrwIfAithhew2syPUiSJHbUI+CEWneZp6HwYUgrzTK6+BDhreZ4omwIb4rDfBO6JDcbWZ3LGwI7TRjuxgq5HWbiZ0NFzI+17Buh/4HMR0QFSK30A0xITd4jdqOWJDLaSZzTCyI5DbzwygG0DRviyJB8uWaxWlRINgyTfm+KBDAvcZFZPzFFviWxl/Y7TV4ayPUStPGX7TtNVn84hQ1s0QtKnBubfyawdrows1wjYxVew0HhzjHzUgtjUprUNO+iMPSzIyMjdSMxci4s9cMEJHAgUMbY+aaEH6RZaZxQhv/mLw65uA1omxjJSMjtDr+gjSlKVcbhVUaBNnyF0HYTN/qqEG/+O+XAjFgZN6ATILMQZBoAcEcmmkQJ9AlCdREiBZ48IGomAAI2spmQtrwBSeEYZriTKc618nOdrrznfCMpzznSc962vOe+EPMpz73yc9++vOfAA2oQAdK0IIa9KAITahCF8rQhjr0oRCNqEQnStGKWvSiGM2oRjfK0Y569KMgDalIR0rSkprUTQEBACH5BAkCALgALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQICAgMDAwQEBAUFBQYGBgkJCQwMDA8PDxERERMTExUVFRgYGB0dHSQkJCkpKS4uLjAwMDExMTIyMjMzMzMzMzQ0NDQ0NDQ0NDQ0NDU1NTU1NTY2Njg4ODk5OTo6Ojs7Oz09PUNDQ0lJSU1NTVFRUVRUVFdXV1lZWV5eXmFhYWVlZWlpaW1tbW9vb3FxcXR0dHh4eH19fYKCgomJiY6OjpSUlJeXl5ubm6CgoKGhoaSkpKenp6qqqq2trbCwsLW1tbq6ur29vcHBwcPDw8XFxcfHx8nJycvLy87OztDQ0NPT09fX19vb2+Dg4OTk5Orq6u7u7u7u7u/v7/Dw8PHx8fLy8vPz8/T09Pb29v39/f7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AHEJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPK7PhlihEoSLSwmcmzp8+IXZwQGbEBgdGjCDLUGOLlp9OnM8M8EYICqdWrCDQUgcq1a0kxTnyEwEoWawgxXtOqvXilyIqycMuunUt3IZUfIOLqJdujrt+6WIB82EuY7JS/iLmKOTKisGOsJs4knsyTio7HmLEyoczZpZLGmUMj/dG59EkyRgaLXm3UhOnXIccQYU376E7YuDPKrs0bgZXcwCsaydCb9+3gyBsqyVu8Nozk0BVSgdG8t5Do2AmK6VG9eJPs2ZP+aOjeO8QY8NC71CBfPAn65EfYF5/xPjiY9fJ7t6mfmwnx/LXRQAZ/uP0AYG0ePEEgbFyIcOBqGNAgRBgLvtbEg5hpgIIORFBRIW6zYajXBzgYMQVaHwJ3mYhkheADEyimGFwY1LFolQ1IfCFjdFgwZyMCOGy2I3ZSYPDjDO4Nmd2FLGoARBdKgqcEiyIkcVyU0SEh4gwKYgmelg/SIIWX6IEJIApQkInelAB+oISa6DGZHxFwoicFgDZQWGd2WOSXQZJ7YgfGf+TdAEag2bVRI3lIIAreit2hcKij2IXYnQ+ULskeoJkmx4UF3X3gYafRVVXdC5OSmpwP3eGganT+S3TX16vJDVrddbQmZ0N1dOaKXHzNbeVrcF3wOixy+Fl3bHBJNDfrsriJMV5vrkKbGw/FvWBtblQU90Gq25q2aG2jhmsam7xxai5nbfhIG6brmmZEbyjEa9oYhNIGrr2TWUpbo/xyJgYFvN0QcGf+rpbBvgf7RYaRtanbsF/z1mbDxJR5wJueGP+FLmu9dvxXCbV9IDJi3db25sl+QbpavSzXJQZvacZMF7Cs0WBzXaCxNubOa/VJG31ArxVEbV0WnVZRrImgtFopsybx004ZyJoGV1L9lLuhAaF1V0KzBuXXUBUxNNlcvSU12k/NTBvbT8kpWrVw+8Qda0LW3dP+WKzp7VMYtF3sN09P/Ds4T0ezpuPhMsnAWgiMz/Ru5DEVizflMMkdWoyYs5QwZiZ37tINrNEt+kp8i2bE6Sy1QdthrKv0BW2cx27SFFfbrtLHmcGs+0mfP6bD7yhhu1rIxJO062orJ08SyavB7vxIXGPGxfQkTSta7dh35Hrf3YdEBmsZhB+S26KFbr5HYDy+/kdeNP2+R1ywRsL8HW3Bmmv4b6T/avzrX0bqt5r7CTAj8VuN0w6IkfatBnIMvAj6QqO+CFJkfAqzoEW+txoNWoR2HqQIqFZzvRBKBHqikZ4JH7I80TRvhQ4xnmiQB0OGBM8xw6uhQ3iHGd/pcCH+uFuNBn7YkNmxhntELAgHU5jEhaQuNKtrYkJItxrTSbEgNyxMBa9IEM1hBgNo4KJBLLearIkRF7QZ2xkHohrRAGyNAsEBa1S4xlit5jxwFAgbXCAaA+ZRIFbLDLz+iIuoYQYLhBwIEDIztTxWLy5+TKRAHFgYPEpyIGpIFlxEMKBLGoSHVhmCJxOCBR+QwCou+EEVRsmQMUyhCFXoJCtnScta2vKWuMylLnfJy1768pfADKYwh0nMYhrzmMhMpjKXycxmOvOZ0IymNKdJzWpa85rYzKY2t8nNbnrzm+AMpzjHSc5ymvOc6EynOtfJzna6853wjKc850nPetrznvgNzKc+98nPfvrzn/wKCAAh+QQJAgC8ACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQECAgIDAwMDAwMDAwMDAwMEBAQEBAQEBAQFBQUICAgLCwsQEBASEhIUFBQWFhYYGBgaGhodHR0fHx8gICAiIiIlJSUoKCgrKysuLi4xMTEzMzMzMzMzMzM0NDQ1NTU2NjY5OTk6Ojo8PDw+Pj5AQEBCQkJFRUVJSUlMTExPT09TU1NXV1dbW1tfX19jY2NnZ2dqampubm5vb29xcXF1dXV5eXl/f3+GhoaMjIyPj4+RkZGUlJSWlpaampqbm5uenp6hoaGkpKSnp6eoqKiqqqqsrKyurq6ysrK2tra6urq8vLy+vr7AwMDCwsLExMTHx8fJycnLy8vOzs7Q0NDS0tLV1dXY2Njc3Nzg4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fp6enr6+vu7u7x8fH09PT29vb+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gB5CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjyuRoxwwWJj9smLiBowiUL3FmCh1KlOEYKERwlDjAtKnTpkWKSp0KE40UITEyPN3K9UCKM1TDig3JBooPDl3TplUytq1bil6KrFBLVy2Zt3jzHswCZEPdv2lH6B381ksQEIATpzVCuLFUNkdQKJ6cNovjyzGz7KDMuesRzKBXMknRufRWHaFTk5RjxLTrp4JVy+74hsjr207dzN59MQ4RCLiDHxDDu3hEO0YwCA+uwbjzhky0Lg9+47n1vTCmL2d8vTubHtqn/lvpfl2JhvDLZ5B/PsYG+ulb1htH8n56D/m8zdyoPx3/7if8LZeEf7P9EGBwOpRBoGpjqHCgaxnQUMQVC6oWhXIPJqbBCjsU0QQWYtRRoWxFZFgXCDkYcUUbIzq3mYlckeADFLq1+Bwa2cHo1A1KKGjjdV+EoCNTOUDx43pXSGeiDEwcKR8UMGoQxBhOyseEiScoIWKV6ymRoQxTcIlfEg/OQKGY8nkZ4ApVoInflfyB0KSbTwZIBJ34XcGfDWjgKd8XGIaXwRJ+yoeGkOjlAFah5NnhwnsDMrrei9qtsKik3ZUY3g+YrgdleGx12p0Y4X1gmajdzTXdC5ei+pyB/tPl4Gp3AE7nw6zXmaFkcEPget1+y0Xl63P0BTsse9MJe6xx7gnX67LGLbHcrdAWx8ZyslZbHHjBvaBtcVkI90Gr36qWI26nlisbnLiFqq5sHQTH6buytYbbCvTKFodw5OZ7mW24ReovaG8El+3AoAH8Wgb9IjyYHLuaRqjDmNn7mg0Ug/YBbn1m7Bi7rt3psWOkvQbCyI6Fe9ucKA9GqWn4tjxYG7i1KbNeR9ym3s16LfXamTwXdpsMQecVxG1hFv0WYq6doPRbKrvm7tNiAfGaBltSLdZ5rgWh9Vhe3Ebl12FpahrRZIelqmksp13Uta+5TdWnph0sN1E+vGbk/t1F+Wwa30Wh8Vp1gA8lxWsCFy6TEK/5qLhMMbhGwuNCvUYt5TCNoTfmMdFdWo2cu6RwZyeH/hKwpdlt+kokuMbd6ivZ8TPsLJnxGou0q4SFa83lrhLInMXsO0pmd7bD8ClxW5qyyJeEemdNNH9SyaVhIb1JiJZG3PUkcV3aGtyTFHf4IskBIfkiqeHaB+iHZLtpk7f/ERlNy/8RqaalYL9HYbimwv4d6Z9p/gfAjeCvNPoroEboZxqnKTAj7ytN/B54EfWZRgQUxEgc4lUaFGQQI8+jDA8+eJHRUQYJJLQI8CbDhRRWRAsSnIMLKzKEzthshhShXmKehUOKzIEysj28iAD/ggEwBBEjsFKL6o5YETVxRQTRY6JG4vCFJxRBBzs4QhXGkDUpevGLYAyjGMdIxjKa8YxoTKMa18jGNrrxjXCMoxznSMc62vGOeMyjHvfIxz768Y+ADKQgB0nIQhrykIhMpCIXychGOvKRkIykJCdJyUpa8pKYzKQmN8nJTnryk6AMpShHScpSmvKUqEylKlfJyla68pWwjKUsZ0nLWtrylrjMpS53ycte+lKWAQEAIfkECQIAuwAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBBAQECAgICQkJCgoKDAwMDQ0NDw8PEBAQExMTFRUVGBgYGRkZGhoaHBwcHR0dICAgIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqLCwsLi4uLy8vMDAwMjIyNDQ0NTU1Nzc3Ozs7Pj4+QEBASUlJT09PWFhYXl5eY2NjZ2dna2trbm5udHR0d3d3enp6f39/hYWFjY2NkJCQkZGRk5OTlJSUl5eXmZmZnZ2doKCgo6Ojp6enqqqqrKysr6+vsrKytra2urq6vr6+v7+/wMDAwsLCw8PDxsbGycnJzMzMz8/P0tLS19fX3Nzc39/f4+Pj5OTk5eXl5+fn6enp6urq6+vr7Ozs7u7u7+/v8fHx8/Pz9fX19fX19vb29/f3+Pj4+Pj4+fn5+vr6+/v7/Pz8/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AdwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8rkKKdLlCM/cNAYcSGChg83ilhZM7Oo0aMJtyjpUSMEgqdQo0r1IASp1astvSzZESOC1K9go8L4grWsWY9glOBwGratWwRAzsqdG9GKDxdv874tQ7evX4JRdHDQS9jtjb+Iz17ZsaGwY7dLEks2GiaIiseY24YgOrlzSyk3MotuO8WzaZRH8I5e/TXI6dch0QDRwLq2VBuwc28c00OC7d9QPegeXpFMDwjAkyP4QLz5wzhAfCtPfti59YRGBk9XXuS6d8Awtv5vt/LdOxgc4rd74Fy++RDp6ZVXbU9cC43422HQJx4Ev3iy+8HWxX3+TRdXgK8lAV+Bv93AF4Kn5cBgciFEBqFpWqg24WoZ5HAEFmxcaJoSXm1IWAUv3PADElFoAYaIuf1g4lsd2AAEFGLA6Jwcoc34lQg5KDGGjt55EYOPUdUwRBdElofFB0giYIMSTdIHBXIzymBElfstMWMFPGzB5X5HmJhCEXGMud8QG8rAhJoBCjHhDFDAGSCbBb7ghJ0BlulfB0fwGaASBfogaIBP+FcDgIe2d0WJ4kmwZaP0eeFBfDZ4QSl9cYSX3nybttfjdi9oGmp7PqSnw6n0ESped/6slqcFlsptIEWs7bWwXQym4uqdhNPh5ut3SWyXw7DfdbHgbzwg+10N0xnq7HX9KffDtNdtES221xEIXLPcOkeEcseG2xwYFCQnrLnEoQdcDOw2J0VyG/Qab25HAnfrvbr5+Rus/OZ26W+rBpwbEMC9YHBuZiy7mr0Le5bqb0NE/NoYtLK2rsUS/zYBxBwnhobDok0acmcI21bDyabRZhujLCfmL2vSxiyZrrV1YPNkUfwW6M6JjbqawkAjBsZvexb9V7WszaA0YinYVufTfVlhmwxU+7WDbW9mTZfLq6ngNV091wbw2GbpUFsFaaJ9VmOsget2WVXYJubcZU28Gv7WeJeF82om943U0bUJjpWrq21suFHurkbl4kixtRrkSH1R28qUG8VEbRVnXhQPtTHp+UwysBbC6EVBKlq5qMOkLWuPt/4S4qMNKftLPbCm8+0v5Tua4ryrdAFrBwa/0hy1TW28Sl3UluPyKpHBWgXQr0QFa0RXj5L0q1WnPUodrKbF9ylBOxp75JcEumhip3/SFKMR4T5KuWMG/PwjXfaY6PibhMZjPehfSsjwt7dcS4AqKcJbaMA/BKbkCjp4gVRKgIMkOBAma6CCEJzwogt68IMgDKEIR0jCEprwhChMoQpXyMIWuvCFMIyhDGdIwxra8IY4zKEOd8jDHvrwh3dADKIQh0jEIhrxiEhMohKXyMQmOvGJUIyiFKdIxSpa8YpYzKIWt8jFLnrxi2AMoxjHSMYymvGMaEyjGtfIxja68Y1wjKMc50jHOtrxjnjMox73yMc++vGPgAykIAdJyEIa8pCITKQiF8nIRjrykZCMpCQnOcSAAAAh+QQJAgC8ACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAwMGBgYJCQkNDQ0SEhIWFhYYGBgaGhocHBweHh4iIiInJycqKiouLi4wMDAxMTEyMjIzMzMzMzMzMzM0NDQ0NDQ1NTU1NTU1NTU2NjY3Nzc5OTk6Ojo7Ozs9PT0+Pj5AQEBCQkJHR0dQUFBXV1dbW1tkZGRqampvb29zc3N3d3d9fX2FhYWKioqRkZGWlpaZmZmenp6kpKSrq6uvr6+ysrK1tbW4uLi7u7u/v7/Dw8PHx8fJycnLy8vNzc3Pz8/S0tLU1NTW1tbZ2dnc3Nzf39/f39/g4ODg4ODh4eHi4uLj4+Pj4+Pk5OTm5ubn5+fn5+fo6Ojq6urr6+vs7Ozu7u7v7+/w8PDw8PDx8fHy8vLz8/P19fX9/f3+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gB5CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXJOWuyPJHjsqbNmyPnYGFSBMgOHCU8XFhAlGgMH0jW4FzKtKnCKkd+4ABRtKrVqyKQON3KteUWJD5iDL1KtmzRHV3Tqv0oBgkPqmbjytWwtq5diVCCoJDLty+Pu4ADF2zSw0Pfw32ZCF68FooPDogj8wVBhrFlpmOGhJDMme+Py6BdNtHRubRcGqFToyxCwrRrsxdoqp79UU2QDa9zl4VCu7dGMj/G6h5edYjv4xTR/KhAvHnVJMijO5wTRLhz51qka09YpMP17ws8/mwfT7DJC/Dgc5AfL2YHevRB1msnguE9+BLyo1e5YR/9k/zHDdEfep8BSFsWOAwIXg8G0nZEfQo690EUDc7WQ4TX9RBHhalVsQKGr2HAgQhCIBGFGRymhoQFIB6WAQo6AGEEE1SIkeJxQbQYVwc5CLFEZTdqNwdpOloFAg9HABnkeFrAUGRROBCBxZL5RWFYkTkcQaWBS1gX4QxFbNkgEi1m4EMVYjZYBIgiECFbmgASgeEM0MHZoIAK1rCEnRXKOSAKdfJp4Jr9dRCmoA0eMSAQiFaoRH84bNFog1B46RwGh04KoBZXppedpgDO4SR6RIDaIJHfofCpqfnlCN5f/qwCSCZ4pcaaXxUsXsdBE7YCuNd1L6zaK3k8fKfesPIpeh2syJKXBYTN+dCsfAk6x+i05OHZXHzYjlfFddd2u121xEkr7nZ+EsfsudGNkUFzx7IrnXvEvSCvdk00x4Gw9/o26nC89oscocPVKrBvc3g33LoH0+aqbig0fBwa0ObGr8Sp/UCcwRirRgZzusXbsWoa64bBxSNbloalpWWacmgPv4bDy7PhppukNIdG8Gvh5nxZa7l14HNo+erm8tCLoepaxEhbNsZwgTYtmBC61SC1ZSPotufVgkGh2wxcL+aDblGHbZcGuYlgdmBFv8bx2mt9+FoGb8K9FlyumWt3/l2QvYbm3mthkRvYgK+lrGtHF77V4aYpvpYVr4nsOFfvmqbl5GmRyxkGmKtVcmcFds5VFjZzZqPoXWkbmRGoqzWDZJK3vtUHiNEl+1rpxhX77VxFIYNZGrzNe1pxIBFEDiIsIIIOQRzx9/DQRy/99NRXb/312Gev/fbcd+/99+CHL/745Jdv/vnop6/++uy37/778Mcv//z012///fjnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDnrwgyAMoQhHSMISmvCEKEyhClfIwha68IUwjKEMZ0jDGtrwhjjMoQ53yMMe+vCHKkAMohCHSMQiGvGISEyiEpfIxCY68YlQjKIUp0jFKlrxiljMoha3CMWAAAAh+QQJAgC4ACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEDAwMFBQUMDAwTExMYGBgcHBweHh4hISEkJCQmJiYpKSksLCwuLi4xMTExMTEyMjIyMjIyMjIyMjIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0NDQ0NDQ0NDQ1NTU2NjY2NjY3Nzc5OTk6Ojo8PDw+Pj5AQEBDQ0NJSUlPT09VVVVfX19paWl0dHR9fX2FhYWMjIyRkZGWlpadnZ2hoaGkpKSmpqapqamqqqqrq6utra2vr6+ysrK0tLS3t7e5ubm7u7u9vb3AwMDDw8PGxsbKysrNzc3Q0NDT09PW1tba2tre3t7i4uLl5eXn5+fq6urt7e3u7u7u7u7v7+/w8PDx8fHz8/P09PT19fX39/f5+fn7+/v8/Pz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBxCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsuVJMmC8cFEixqXNmzhDvukSxYiQHzxEaLCQoKjRBBx+EJmSs6nTpwi3IAnCg8PRq1ix/oDKtetKMEqC3KiQtaxZoxeoeF3LlmMYJD+snp1L90jbu3gfXhGygq7fvzXzCh6MawqQC38T++1BuPHaK0AwKJ7sl4jjyznDDPlAubPfMZhDr5Tiw7NpuldEqy5pJMTp12ftrp7dkYwQybBzZw1CuzdGMUHI6h5+lYfv4xLHBKFAvPnRrcijL3wjhKjz6wksS99u0EgG7OCf/nAfX9gG+PNcyEsP8+P8+Q1t1CMvYt09diTyfW/ZYf889PyzEdHfewDO5gUPA4K3QoGrHVFfgs0VwaBqQEB4HQdSTBiaFiVYeJoFGGzggQhCHDFFF/FpeBkSzHlIlwUr+CCEEVFoAYaKxwnholkZ9DBEFGHgyJ0bpe14VFJIBCbkeF/QYGRRPBTRxZL5XfHdjj3gRyWATwhnIQ5GbMkgEh5aAMQWYjJohIUeFOFGmgwWASEOS8A5oYAD5gCFnRPK2d8KTfA54Zr2ZRCmoAwm0R9viDIIhX08fNEog1h4eV0Fh04K4BeIgdeDpJoC+IZ54GkXKoBFXrcCqKfmpyN2/kC0WiCZ2Ekoa35aWDocBkzdml+HztHgha/5VegcY8TKd8R1/yU7nhe65saos+Qh2Ny01HI3hHNCZEveFs5h6610/BEn7rjzNdcsusiB8SBsyLIrXXvD0SDvdlMQh8Gw90ZXA3G99nscobrZKrBvb3SaW6wHH7etbgs27NsYLebGqsSzWZubwRiv1oYGusXb8Wrg5mbBxSOL1oRumaas2sOvGefybKmehvLMmNXs2bk4XwazZxn0PNvKp7UsNGYlexbx0aJ9bFqgTKtG8GRDRD1bD5SJYDVt0c4V5NarZaFYt2DTFgRdHWhRtm9NbGAWz2urpoYVRPjQgQU8DCGF0pJx9+3334AHLvjghBdu+OGIJ6744ow37vjjkEcu+eSUV2755ZhnrvnmnHfu+eeghy766KSXbvrpqKeu+uqst+7667DHLvvstNdu++2456777rz37vvvwAcv/PDEF2/88cgnr/zyzDfv/PPQRy/99NRXb/312Gev/fbcd+/99+CHL/745Jdv/vnop6/++uy37/778Mcv//z012///fjnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDuYlIAAh+QQJAgC1ACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIHBwcMDAwQEBAWFhYYGBgbGxsfHx8iIiImJiYqKiotLS0vLy8wMDAxMTEyMjIyMjIzMzMzMzMzMzMzMzM0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ2NjY4ODg6Ojo8PDw9PT0/Pz9AQEBBQUFCQkJDQ0NERERHR0dKSkpMTExOTk5QUFBRUVFVVVVYWFhaWlphYWFqampxcXF3d3d9fX2EhISLi4uRkZGXl5ebm5ugoKCjo6Ompqapqamtra2xsbGzs7O2tra6urq+vr7CwsLFxcXHx8fKysrMzMzQ0NDU1NTZ2dnf39/i4uLm5ubr6+vs7Ozu7u7w8PDy8vL09PT29vb5+fn8/Pz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBrCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqVJNWPCfPHShYsVKi5z6tz58UwXKUuODMEBYoMFBUiTJr2wA4kUnlCjSi2YRguTIjg2KN3KtauCGlemih2L0ksTIiG8ql2rlAjZt3A1fmEiRAPbu3gVxN3Lt6EVIx/yCr67pK/hw1OIYBjM+K6Xw5DJXimyuLHltUEia+YJJkngy6DXPt1MWmWVIKFTrz1SunVJJmlVy+5qw7Vtj2WQZJjNm+uF28AxijlSobfxrVyCK484hvjx50nFLJ++UA2So9Chd6DO/SATrdmz/g/pTr5WFRjh0yspTx3MkPTwrbBfrgQ7/Oxu5wPfUuN++gz6AZeEf/EF6FoX/REYXhMGtsaEguH5IF2Dm6HxHoTQrUfhZlh8hqFlFmjQwQcilFBCEUpAoQUZG2724Id3XYCCEEcwQQUXYbQ4nREwerXBD0lQMaGO3ZnRQ49KdUCEE0MSWZ4XICCpwA5LPOZkgFZU9uEPTlxJIRQwzsCElxu+qOAFRXRB5oZKQPjBEmqsueGABM4QhZwt0nlfDVPg2WKb96Ewmp8ULnHfBmMSumET97Gm6IZSwLcDGI9uiEVx2VmQaKUNfmFXdj5QymmDaqCXXWGjUogadCiImqqB/kfg9yqFTpw6a4NdYGqcBvLdaqCWvcHwha8G0vDcD8QaKMYFx+WXrH5CHGfEswGCcZyj1M4XaW9IZBsgEr1h6y17O/A27bj6ARuas+iyF6VqyLarXxGqwSBvgLWGpsGw987XRWq99jtfDKChKvB8UVzG7sHsAdFYZgwb2FjEuIJ3FwZNUqyfmWoVoXGLXvygrgIZ+BDWx0RqscQQRDSRHMowxyzzzDTXbPPNOOes88489+zzz0AHLfTQRBdt9NFIJ6300kw37fTTUEct9dRUV2311VhnrfXWXHft9ddghy322GSXbfbZaKet9tpst+3223DHLffcdNdt99145633ht589+3334AHLvjghBdu+OGIJ6744ow37vjjkEcu+eSUV2755ZhnrvnmnHfu+eeghy766KSXbvrpqKeu+uqst+7667DHLvvstNdu++2456777rz37vvvwAcv/PDEF2/88cgnr/zyzDfv/PPQRy/99NRXb/312Gev/fbcd+/99+CHL/74IgUEACH5BAkCAK4ALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgcHBwwMDBAQEBUVFRkZGR0dHSIiIiYmJigoKCkpKSsrKy0tLS0tLS4uLi8vLy8vLzAwMDAwMDAwMDExMTIyMjMzMzMzMzQ0NDQ0NEBAQE5OTllZWWdnZ3d3d4SEhI+Pj5iYmJ6enqOjo6enp6qqqq2trbCwsLOzs7a2tri4uLq6ur29vcDAwMLCwsTExMfHx8vLy8/Pz9XV1dvb2+Hh4eXl5ejo6Ozs7O/v7/Dw8PHx8fLy8vPz8/X19fb29vj4+Pr6+vz8/P39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AF0JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcksUZw0WbJEiZKaPLC43MmzJ8crS4DkuFFjhgkPGhgoXcpUqYwbPKL4nEq16kAlO27M+NC0q1evJHhYHUvWZBMeNmRk+Mq2bdMaZePKxehkRw2ubvPqZcBhrt+/C4/cWLG38F4bgBMDHmLDg+HHe4MonjwWSWPImPWCeEK5884nOEhkHq33hufTKYfUIM067wzUsEfqaNG6dlsNWWLr3hgFRwfbwNki2U284pMbSYMr75qjuPOHUG4sn97Vx/PrCbEgp859aRPs4An+5vjdvfuH8OGDuCjPngb6605Ws2eP473zHMnnd29hn7iSGfrNZ0R/uuEQ4HymEYgaEwAeWB5iCp6mw1oOcvfBcBF2poUNFXZngxUZdqZECh1mpoEHIJCwggsurEACDTfoQIQTIXa2A4UlsrUBDDXEGMQSnNV4nXQ5duUBDTgEEaSQ6GUhX5EMgGDDDksyaV8TMkBJQw5MWJkhEnh1SMMOXtYIRH4HzqBDmULyUOEGNizBppA6OEhCDrnNWSOHAc7Qg55MJtEnEIBaycF8MFhXKJMGlufBmosyeQR7CUbKJJ/UzUCjpVaSOJ0GkHLKZBTU0fCdqFYKMV1zqHrZKHD+MJzaqpVFBAfhrF6SahuruJaZJWseENHrnJhmJoOsw3o5BGnuJatnsYbd6uycaO5V6bRzAvHYtdjOmcShem3a7aKvfsXtuIUeYYOnS4VQg1jothqFEElWGe+9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGHHfs8ccghyzyyCSXbPLJKKes8sost+zyyzDHLPPMNNds880456zzzjz37PPPQAct9NBEF2300UgnrfTSTDft9NNQRy311FRXbfXVWGet9dZcd+3112CHLfbYZJdt9tlop6322my37fbbcMct99x012333XjnrfdT3nz37fffgAcu+OCEF2744YgnrvjijDfu+OOQRy755JRXbvnlmGeu+eacd+7556CHLvropJdu+umop6766qy37vrrsMcu++y012777bjnrrvmAQEAIfkECQIApQAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICBgYGDAwMExMTHR0dHx8fISEhIyMjJSUlJycnKSkpLCwsLi4uLi4uLy8vLy8vMjIyNDQ0NjY2Ozs7R0dHUVFRWVlZY2Njbm5ueHh4goKCi4uLkJCQlJSUmJiYm5ubnZ2doKCgoqKipKSkp6enqqqqra2ts7OzvLy8w8PDysrK0dHR1tbW19fX2dnZ3Nzc39/f4eHh5OTk6Ojo7Ozs8fHx9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4ASwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybJlySVJjAQB8qNmTSBDjCRZ4rKnz58ZlwjhMcMFixQkMlxQwLSpU6cWVsDogQSo1atYgeBwoaLD069gwzZ1gbWsWZNIdrhAsVSs27dOPQA5S7fuxSU8WoiAy7dv0xd2AwtWOCRGCr+IEScZzFiwkBcmEkv2u6Kx5bJJZKCYzNkvjsuge/JY0bl03w1KQqs+qSQGCNOw+fZYTTvkkBZtY+sWC7i2b40/WOwe7lbF7+MVf5AmzhxsBuTQHwZZ3ry6Uw3RsydE0sK6d6eVtf6LHwgj93fvMsaL3/HhvHsFPtRHJ0L9vfcMqeUfh2HBvnsY+v0GxGH+nXdCgL7BUOB7RSC42hCvLXhebw6CBkMFEn6HghEVhuZCht8B2CFoH4KY2AUYcPABCSWUQMIHHGCQQQYqvMBDVSNeNoSJYl1gwgouzMDDD0fkKJ8KPDZFo41FGllhDDxywIINODqZY4QLphBDEFZ2acSCKtjQ5ZgC6WAfCumRqWaJ3l3QwlxqxrmZdR/IwFOceLJJHAo54OmnQDswhwIPfxZKxHAm6FDooqVwEFsGMzDKaHemkSUpo0tk0FkKDV4qaaCSWZCmp5fWx5cKRJCqqoJ9xaDqq/6lADGnWDHkB+urLnjw1QUlxHfrr6Uk4UMNMOzAJbDIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAEF2zwwQgnrPDCDDfs8MMQRyzxxBRXbPHFGGes8cYcd+zxxyCHLPLIJJds8skop6zyyiy37PLLMMcs88w012zzzTjnrPPOPPfs889ABy300EQXbfTRSCet9NJMN+3001BHLfXUVFdt9dVYZ6311lx37fXXYIct9thkl2322WinrfbabLft9ttwxy333HTXbffdeOet9yfefPft99+ABy744IQXbvjhiCeu+OKMN+7445BHLvnklFdu+eUlBQQAIfkECQIAtgAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAgICAgICAwMDBAQEBAQEBgYGBwcHCQkJCwsLDg4OEhISFhYWGhoaHx8fIyMjJSUlKCgoLS0tLS0tLi4uLy8vLy8vMDAwMDAwMDAwMTExMTExMTExMTExMTExMjIyMjIyMjIyMjIyMjIyMjIyMzMzMzMzMzMzNzc3Ozs7Pj4+QUFBSEhIV1dXY2NjbGxsdHR0fHx8goKCiYmJkJCQl5eXn5+fqKiorKyssbGxtLS0t7e3urq6vb29wsLCycnJzs7O0tLS1tbW2tra3d3d39/f4uLi5OTk5ubm6enp6+vr7u7u8fHx9PT09/f3+/v7/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AbQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKlSS9ZqkyRIiUKzSlVsHQR47Knz58atURJUiTIjx0hOiRYyrSp0wwbPBxpYgWo1atWuTgxEkQHB6dgw4pt2sMJ1rNoSUo5AkTE2LdwxQpJS7euxSlGfnyNy7cv0xF2AwtOyCRICL+IE/sYzNiuGCVANiSenFhJ48tXnQSRTLkz4qqYQ6+0QsSt59N+gYhebZLJD9Sw/XpgTRvkkRKxc/edUrs3xi5EPOgeHheJ7+MStwzJQLz52yDIozPsAmSC8+tif0jffhCKcOzgnf4a4U5eYJDw6JtCKc89vfsEGL6wl37kfXoe86NXsZ8+SX7kQPAXnnb/+baEgOGFUaBvQyCInXEL9uaDg83lAFqEte1FYWwcQIhhbVNsKNYGH4hAwgo11LACCSJ8IFkFS40AxBFUfOgbFxRykAMQRCDRxBRaONQFGAraGJ1p6YHwQxFNbGHkkwgFCJ4IQSThJJRYImTEdT8cUUWWYCb0BHE/+BfmmQmdBxsPHqLp5kEfeMaBELy9aedBY05GwhFF3ulnQUkgxoNlfxZqkBgNwtUDE4Y2ehATPFgAVghH1OnopQV58UQRPwiRxJeYhirqqKSWauqpqKaq6qqsturqq/2wxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAEF2zwwQgnrPDCDDfs8MMQRyzxxBRXbPHFGGes8cYcd+zxxyCHLPLIJJds8skop6zyyiy37PLLMMcs88w012zzzTjnrPPOPPfs889ABy300EQXbfTRSCet9NJMN+3001BHLfXUVFdt9dVYZ6311lx37fXXYIct9thkl2322WinrfbabLft9ttwxy333HTXbffdVwcEACH5BAkCAK0ALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQMDAwcHBwoKCg0NDRERERQUFBkZGR0dHSMjIyYmJigoKCsrKywsLC0tLS4uLi4uLi8vLzExMTMzMzU1NTc3Nzk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0JCQkVFRUlJSUxMTFRUVGRkZHFxcXp6eoKCgoiIiI2NjZGRkZWVlZmZmZ2dnaKioqenp6+vr7i4uL29vcLCwsnJydTU1N7e3unp6enp6erq6urq6uvr6+zs7O7u7u/v7/Dw8PLy8vT09Pb29vj4+Pr6+vz8/P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AFsJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypckqTJYoSUKzppIlULC43Mmzp0YqSYr40IEjhogOFxYoXcqUqYYPKFqswGHEp9WrPrEkCaKDhoemYMOKbfoBBw+saNOKXDIkh4qxcOPCTXFErd27E5cIyfFBrt+/YXXgHUzYIJIdKQArXrxUcOHHao3k+Mq48mIkkDP3JHJjg+XPiz9Y0UxaZZIZoFMvzlG6dUkfqmMrXuK69kccsnP7rWq7d0YeuoPD/eG7eMUjwpOHZW28+UMmlJVLXzDDuXWGuKdPd3y9u8EO2qf+B/FOfmCS8NPrlicfBL102uu953CfHEd88jfoB+cg5b532PrlNoR/3iEXYGz2EdgdFRgcmBpxCnrngoOW3aBEhOQRoZ8GHoAwQgoqqJDCCCB4oIFYHtxwFoblzRfcBirgsEMQRiQBH0NLJGEEEjzeyOJ60X2WIg9FMPHjkRUtYRkIOQxhJJJQWnRFdn7Z8MOFUWaJkRAcwHXDgFqGmZESP+AQglIZtOADb2K2uRETSbgp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6qvPsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGHHfs8ccghyzyyCSXbPLJKKes8sost+zyyzDHLPPMNNds880456zzzjz37PPPQAct9NBEF2300UgnrfTSTDft9NNQRy31sAEBACH5BAkCAKIALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQICAgMDAwYGBgoKCg8PDxUVFRoaGh8fHyIiIiUlJScnJygoKCoqKiwsLC4uLi8vLy8vLzQ0NDo6OkBAQEhISE9PT1RUVFlZWV5eXmNjY2hoaG1tbXJycnh4eIWFhZCQkJmZmaioqLe3t8LCwsrKytHR0dbW1tra2t3d3eLi4ubm5uvr6+3t7e/v7/Ly8vb29vn5+fz8/P39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AEUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypckgPXTguGGjpo0bOHT0EOKyp8+fGoXgoBHjhQoTIDBQQMC0qVOnFTCIMKHihQwaOHgC3cq1540ZL0xoeEq2rFmzK2LQ6Mq2LcgYJzJMOEu3rl0TOdzq3StxBokLdgMLPhuDr+HDB1cMXszYqQnEkPnmwNC4MuMZkTN3DWK58+IdmkP7POG5tN0UolOvlGG6NV3MqmOTvGHBtW2yL2TrDhnjtu+mj3cL56ji9+8Lw5NnBGH8d17l0CUCaf5bR/TrD2tQv40Bu3eGnLf+u0bxvXxCEuJbwzDPvqCL9KbXtp8/A75n1PPn9xhrv/EEIPnl11t/jBUWYH7oESgYeQfmJ4SCdnlgQ4MH+lCCaRVcoIEHIowwgggeaHBBBYKtRyGFMwBmVwUjpGAVDTaA1tAONtAgwwsppDCCBSW8MAMPJwa5gwskLNVUVCfAQAOQQTY5khA1yGADEEE4aeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6qu0sMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGHHfs8ccghyzyyCSXbPLJKKes8sost+zyyzDHLPPMNNds880456zzzjz3nGtAACH5BAkCAKgALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQMDAwQEBAUFBQYGBgYGBgcHBwgICAoKCg4ODhgYGCYmJjk5OUhISFpaWl9fX2NjY2lpaWxsbHBwcHV1dXp6enx8fH5+foGBgYWFhYmJiY+Pj5KSkpWVlZeXl5eXl5iYmJiYmJmZmZqamqSkpK2trbW1tby8vMHBwcbGxsrKys7OztLS0tXV1djY2Nvb297e3uHh4eXl5ejo6Ovr6+/v7/Ly8vf39/f39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vv7+/z8/Pz8/P39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AFEJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypUkmP3jkuGGjRg0bN3Lw+JHEpc+fQDvuyHDBgoUKEwooXcqU6YQKFzBoAJEiBg4mQbNq3QrjQoWmYMOKbWohqggbW9OqNblhrNu3YiFg+JBjrd27GHV8hcu3r9IKJfAKHtxQiN/Dfi8QXsx4IAbEkOFWaEwZ74vImN2eqMx56w0KmUOHpdG59M8TolMzvRDEtOuVGlTLLuDite2TFmar5nC7t8ggulUr9k2844zgqoUUX57RMHLRM5hLt3jheejW07NH9GAd83Dt4Bv+Xu4OmXf48wp95CZ/WAX69whRs+9LAS38+wSrz4drAr9/gUzs9xYG/xUIhH4CNkVBgQyi8sJeCRZAYIMM8uDBBRGE9ZRRF3RY1FFJQVYbhSQmkcMMOshgQw8O9WBDDCyAQBRoYFFwQXQk5shRDzLwIENVOugo5JBEFmnkkUgmqeSSTDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quZsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGHHfs8ccghyzyyCSXbPLJXgYEACH5BAkCAKEALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQICAgQEBAYGBgkJCQ4ODhMTExYWFhoaGhsbGx0dHR4eHh8fHyAgICEhISIiIiMjIyYmJioqKjAwMDY2Njw8PENDQ0tLS1NTU1paWmZmZnR0dH9/f4eHh46OjpSUlJ+fn6enp6+vr7W1tbu7u8DAwMXFxcrKytHR0dfX193d3ePj4+Xl5efn5+np6e3t7fHx8ff39/r6+v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AEMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmyJcsdM3Lk2MEDyBCXOHPqNFnDRYoMCIIKDVphAwkUKlrAoKHj5s6nUKMmDKJiqNWrWEOgYBEjh9SvYFvCmIC1rFmrG1LE+BG2rVuPKc7KnYuAxAoab/PqlYiDrl+5K/YKHoxwxN/DZSvMIMxYcAvEkLHeaEy5bY/ImIdaqMxZ6ozMoBG46ExaJ4vQoG2UXs3yBOrMgVnLPmnhNWYSs3OTNGw7MhDdwD+u6B0Zb/DjGmEQh9wCufOLN5YjrvG8+sQgG6T//W29+0Pl2uf+lvBO3qHr8Gdjl1+fEP1Z4+zjF8xRwf1V9fLzD3xsn6j+/wTNEEJ/iwFooBA60AADCySQMAIIGNQXmgWTGWjhQjzgoCALKpRQG12jXShiRD3Q0MJPZA1ll2ojtjgREELk8AIN3Llo44045qjjjjz26OOPQAYp5JBEFmnkkUgmqeSSTDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quFsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxZ0FBAAh+QQJAgCiACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQECAgIFBQUJCQkPDw8UFBQXFxcZGRkZGRkaGhoaGhobGxsgICAlJSUrKyswMDA1NTU/Pz9HR0dOTk5UVFRZWVlcXFxgYGBlZWVoaGhra2tubm5xcXF0dHR3d3d8fHyHh4eSkpKcnJylpaWtra24uLjCwsLNzc3T09PY2Nja2trc3Nze3t7i4uLm5ubs7Oz09PT4+Pj8/Pz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBFCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypwpakeNFiVInJBxYwfNn0CDOgzCwkOCo0iTfigBo4YOoVCjypxxIanVq0hHtKjxQ6rXryNDYB1L1gIJGkDAql1bkQTZt28x1AjCtq5dhDfg6iXrYcbdv3aFGN1L+OoIIoATf3VRuPFVuoojBx3suPIIyZhn6qjM+WiNzKBd0ujM+ULX0KhRriDN2UXq1yVLsLYMu3ZIGbMdVxhiuzfHvLkb4/BNHCOQ4I39Fl9OUSzyvTaYS4+I+7neHtOzOxxh/W0H7eAX/v7oTtZE+PMIZ5DHGgO9+4I6qq4/GuK9fYIv5icYfr9/jRQiWGCda/0VONANNMBwQoCksWDggwcBcUMMJXBAWAf8QahhhDSoQNlVKwix4YgK6aCDDSuMsMIMN5xG4oswxijjjDTWaOONOOao44489ujjj0AGKeSQRBZp5JFIJqnkkkw26eSTUEYp5ZRUVmnllVhmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145qnnnnz26eefgAYq6KCEFmrooYgmquiijDbq6KOQRirppJRWaumlmGaq6aacdurpp6CGKuqopJZq6qmopqrqqqy26uqrd7DGKuustNZq66245qrrrrz26uuvwAYr7LDEFmvsscgmq+yyzDbr7LPQRivttNRWa+212Gar7bbcduvtt+CGK+645JZr7rnopqvuuuy26+678MYr77z01mvvvfjmq+++/Pbr778AByzwwAQXbPDBCCes8MIMCxsQACH5BAkCAKIALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgMDAwcHBwsLCw4ODhAQEBISEhQUFBUVFRYWFhkZGRwcHB4eHiYmJiwsLDIyMjY2NkBAQElJSVRUVGBgYG1tbXl5eYWFhYuLi5GRkZWVlZqamp6enqOjo6ioqK6urrW1tbq6ur+/v8TExMzMzNPT09ra2tzc3N3d3d/f3+Hh4ePj4+bm5unp6e3t7fHx8fX19fr6+v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AEUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bJofc6IGzp8+fA3WkMAEigdELEzaUiMETqNOnKll0MEq1atUTMHxA3cq1YwmrYMNOSGGjq9mzEMOqVVvBBA20cOMOVLG2btgKKXLI3bu1ht2/YDWs4EvY55ARgBNXJVG4cc0XiiMb/eC4MkwUkiW3sMx5JeLMkct2Hl2yAujII4aQXg3yxmnJMFjL5gjkdeQUs3NnDGE7sQndwCue6A04RPDjEVsQB4y8ecMbppevNe68esIU0tf+ts7d4IfsYXH+dx8v0AZ4sC/Iq4dxniqGG+rVE8F+nkX8+zNGUJC+/f59IjGYMNVrGPhnIEE/vHBCUZGVcOCDBeHAwld/uQDhhQa9YMIGgZFQA4YgGqRTCy3QwEOIKKao4oostujiizDGKOOMNNZo44045qjjjjz26OOPQAYp5JBEFmnkkUgmqeSSTDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6qtrsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLDCIAQEAIfkECQIAnAAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAwMDBAQEDg4OGBgYICAgKSkpMjIyPDw8R0dHT09PV1dXX19fa2trdXV1gYGBk5OTpKSks7Ozv7+/yMjIzs7O09PT1tbW2NjY2dnZ29vb3Nzc3t7e4eHh4+Pj5eXl6Ojo7e3t8vLy+Pj4/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AOQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz58zS5SIAbSoUZMdMlSAcKAphQgWQBydSvWiCAtNs2ptGmGD1KpgwybssLVs2Q0hxKoNi8Gs260SOrRYSxdoiLd4t1boULdvzhcR8grOegGF38MzNwxe3NQD4sctTzCefAGyZZQfJk/+erlzSA6aJ7PwTNoj1tCLM5RerTEw6sWcWcuWSOH1Yg6zc0dUbFtwZd3AGWbunVdC8OMJRxAXfAK584Knl7tV8bw6p+HSyxq3Xr1t9q2quf5X/76Vr/jnJCSQb5r2fHUP5MO7r95ig+veD2DMFw/Dw4Xeju033wfeTYaBgAhy4kF0eFEgQoIQjrCBem6ZB+GFnLTwQQZPXcABCHNhKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5JJMNunkk1BGKeWUVFZp5ZVYZqnlllx26eWXYIYp5phklmnmmWimqeaabLbp5ptwxinnnHTWaeedeOap55589unnn4AGKuighBZq6KGIJqrooow26uijkEYq6aSUVmrppZhmqummnHbq6aeghirqqKSWauqpqKaq6qqsturqq2GwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qsvWAEBACH5BAkCAJwALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQICAgICAggICBcXFy0tLT8/P1FRUWJiYnV1dX5+foiIiJKSkpqamqKioq6urru7u8bGxs7OztfX19zc3ODg4OLi4uTk5Obm5ufn5+np6evr6+3t7e/v7/Hx8fT09Pj4+Pj4+Pn5+fr6+vv7+/z8/P39/f7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+ADkJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqhUjiQwYLByxk+ABiqdWrnEZcOMC1a9cJGVBgHUs0g9ezZy9UJcuWJwW0cL1K6NC2rk0McfN61cDCrl+XIfQK7oqBxN/DKKEOXpwBsWORGhZLjvq4csetkyWLsMz54tvMiyd0Hi1RBOjJGkirbtjh9OQPq2MjbO16cYUXsnMPNF178Wbduif0HuwBuG7Fw/OmNi7bbPK8F5jLHvH5Odro0mNvsA53efbVyLn+cy3+PXZ18b/Lr+Ygnmtf9bFHhB/uHX7sD/NPW7BvXEQG4a7xJ10MHFQAWggCfoffYhfAkKB6H+CV1wYP8oeCBxhUMAEFUnGwVoUghijiiCSWaOKJKKao4oostujiizDGKOOMNNZo44045qjjjjz26OOPQAYp5JBEFmnkkUgmqeSSTDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6qtZsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPReGhAAIfkECQIAnAAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDGRkZMDAwQ0NDU1NTZGRkbm5ueHh4f39/hISEiIiIjIyMm5ubqqqqubm5wsLCysrK0NDQ1dXV29vb39/f5eXl7Ozs9PT09fX19fX19vb29vb29/f3+Pj4+Pj4+fn5+vr6+/v7/Pz8/f39/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AOQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQUcYgQSKqVaMnMligkKCrBAoWMFwd2/PDhK5o0yaQcAEF2bc1MaidmzbDCbh4XVqgyxdtBrd5A5v80LdwVw2CE4ccYbhxAg+KI2tsUcFx4wkfJGumSNiyYwp3N4tuqMGzZQomRqtOuNe0ZcSrYw/k6toyYNmrJdS2bAF37LO7HWf2Pbp1cMMTUhAXneG4YxDLN3tw3phDdM0jdFPv2/u6ZA7b+/5O8K65cvi548lLPj+3u3rFI4CzT9DhveYO8xNAty/ZBO3wofEn2QfmOZeBgKMReBwFCK72wX+mjdBgbB7I5xhsE8bWXGMUlJChbyhM1xeGH/p2ggcXVDDBBBVc0MF+JcYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5JJMNunkk1BGKeWUVFZp5ZVYZqnlllx26eWXYIYp5phklmnmmWimqeaabLbp5ptwxinnnHTWaeedeOap55589unnn4AGKuighBZq6KGIJqrooow26uijkEYq6aSUVmrppZhmqummnHbq6aeghirqqKSWauqpqKaq6qqsturqq2ewxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/eQYEACH5BAkCAKMALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgMDAwUFBQgICAoKCgwMDA0NDRQUFBgYGBsbGx8fHyIiIiUlJScnJygoKCwsLDY2NkZGRlNTU19fX2pqanZ2doKCgouLi5iYmKOjo66urrm5ucfHx9DQ0Nvb2+Pj4+jo6O3t7fHx8fb29vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/P39/f39/f39/f7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AEcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLHOYJGiRAoWM7KKpWnig4QDaNFK+GACxti3K2GASEuX7gMScPOWRFG3L10KJ/QK9qjCr+G0H1QMXnxxxuHHaEW4YEw5IgnImANX3qyQL2bMIFhwHl1QxOfTJkir5nD6NIgWqje/aN36QYnYlFPQpu0B9+ISu2lf8C24cPDWI4jnhXGc9grlcD80dw397Yjpp29Xz2ocO2QQ28X+Xvf+2EJ4sRnIPxZ9/moL9Yc1t7cqYy78uvLnW9V9Py17/VelIN19FQA41gkYwAeegWNdRh5eDI7Vgn3NWQBbhG+dMEFzqWEIVwshBPeBh4KZQFsGJA7WwniQ5ZeiXiwkaNgHz73IGAwnkBACax2EUAIKMdgo5JBEFmnkkUgmqeSSTDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6qtysMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIBxoQACH5BAkCALAALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQICAgMDAwUFBQkJCQwMDA8PDxISEhQUFBYWFhcXFxkZGRoaGhwcHB0dHSAgICIiIiUlJScnJyoqKisrKy0tLS8vLzExMTQ0NDc3Nzk5OTs7Oz09PT8/P0BAQEJCQkNDQ0VFRUdHR0lJSUtLS05OTlNTU1hYWF5eXmVlZWtra3FxcXd3d3t7e4CAgIWFhYaGhoeHh4qKio6OjpKSkpaWlpiYmJqampycnJ6enqCgoKKioqOjo6SkpKWlpaampqenp6mpqaqqqqysrK6urrGxsbW1tbq6ur+/v8bGxs3NzdPT0/Pz8/z8/P7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGEJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYJFqSaKjhAUZPqhsCctWZBQVCOLKlXvjSdu7G23M3TtXBRe8gCdu4UtYLgQigRM75FC4MYIYaxVLNmjEsWUhkzPDGmzZsozImgPX6NyZQpLQgS+QJp0D9d0sq1ej0OI6LJHYqycsqf0VB+7YPXh39f179Y0uwrUeKR5bBOjkVbUwj10hC/SrGKavhvD8etTR2kn+c/BOFUv41T7IT81xnjQV9VIttLfMoTv8pZznN0Z8H+pt/YTh0F9UQgDIVwkDRrWFDAbO9VeCUBVBQYMIYAGhguAB+OCFUA0BoAocTrUFCvPtECJV7J2324lT/TfdCRuyGNUVGkx3hYxVbZFCcenhaFWGpMngI1b5WXbEkFlxQVxhKFiHpFY+1MCYXBSwsEOMT2q1xRNDZIFclmCGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quKsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGfgYEACH5BAkCAJ8ALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQICAgUFBQkJCQ4ODhUVFR0dHSIiIiQkJCsrKzExMTk5OT8/P0dHR05OTlVVVWBgYGhoaHBwcHV1dXl5eX19fX9/f4KCgoaGhomJiYyMjJKSkpiYmJycnKGhoaWlpaurq7GxsbW1tbq6ur+/v8XFxczMzM/Pz9PT09fX19vb29/f3+Xl5e7u7vf39/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AD8JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu27M8dMFTU8GG27cYWIDAgmDt3Q4gZbvNK9OGBrl+/IHDoHbzwxd/DfkkQXlxwBuLHczvoYLzYB+TLE1pQHhzisucQm92y8Exag43QZTOQJi3BBWqxO1bLVvz6KwzZsj/8qN11BG7ZG3bw3srht2wLNYZnJWFctoQYyq/GaI7bdXSqOqjjZnGdqlztq1f+dJcqArxsFeOjajAfPv3THOxXc3fftEV80tbpL61x37N4/UvxMEF/j1UAIFM79EXgYfMdqNQKCx4mmINK6bBehHN5QCFTnWFIwYZMQYhhciAqNUMFEf5XYlI6bLAgCCsypeB9MMa4FAj9qWhjUuXFR+KOSjFn3odAMlWCeRoWyZSQ1E2o5FI9GtfgkzcaZwGVT6Hwm5NYMpWDap4l2SVUJ0C2AQxjTsVDDCR0QEEGIbRwQ5p01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quWsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGHHfs8ccghyzyyCSXPG9AACH5BAkCAJ0ALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQQEBAcHBwwMDBISEhYWFh8fHyYmJi8vLzMzMzg4ODw8PEBAQENDQ0ZGRklJSUxMTE9PT1JSUlVVVVhYWFxcXF9fX2NjY2RkZGdnZ2lpaWtra21tbW9vb3FxcXR0dHh4eHx8fIGBgYeHh46Ojpqamqenp7a2tsrKytLS0tvb2+Li4uvr6/X19f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+ADsJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcs2Zg0ZJjBEoNChxYwabfMmxNHhgN+/gFnoHTxQBuDDgCnMIJy3L+LHfkEwXlsDsuUDF25MPpvj8uUHNDaXHeHZswvRYmmULh1iB+qvLlaXxoDjdVcOsktTsGF7q4TcpR/g7X0VB3DZi4lXNX58dXLlUyc0Xy0D+tQQ06lbjxoju/btTiv+ey/9HPxS0uM9lzePdMeD9J6Hs086A/5n3vOTdrcPmULt/Ejl8B5/iGHgGoBH4XABgYiFgGBSJjB42AsPImWYhH+FVqFRNUiH4QOabVgUDhhgiJmIR31g4gcoGlWCieu1CBQLGFYgY1GxSRjDjUS9gKF8PAKVI4HVBSkUjQSqYORQL/LHwZJDqWgfBVAOVSJ8EVQpFA4ejneBlkKJN94IYAp1oXc7lhlUhN4BqaZPC05H5ptB4TDgcTrQKdQNzbmpp08wAMfin0PVcOdlaRI61A4tXMZBiIoWVQMMHng4wQcwaBipUjj8t+mnoIYq6qiklmrqqaimquqqrLbq6qu8sMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zxxRhnrPHGHHfs8ccghyzyyCSXbPLJKKes8sost+zyyzDHLPPMNNds880456zzzjz37PPPQAct9NAYBQQAIfkECQIAnwAsAAAAAPAA8ACHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICBwcHDg4OFxcXJCQkLi4uMTExNDQ0ODg4PDw8Pz8/Q0NDR0dHSUlJT09PVFRUV1dXX19fZ2dnb29vdnZ2fHx8gYGBhoaGi4uLj4+Pk5OTmJiYnp6epaWlrq6uu7u7wsLCycnJ0NDQ1NTU2dnZ39/f5+fn7+/v9/f3+Pj4+fn5+/v7/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4APwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dwteaY8cLEhxEqYNTQEbevwBMJAgsWbMGF37c2MAxeLHgEjcNrWTCeLPgFZLQ1KGtOcOKyWQubNYvo4Vks4NCaNdwo/TUG6tAVZLDumuJ16AkwZm8NYRu1Yd1YQfcOzQK4VRzDX6swTpVGcuXMp1J4jnp5dKgeqKMuft3pae2bf/53XwoDPOrc45dmN785RnqlmdlrrmDjfdLa8ilj4Gv/aIn8lIHQH1IvADiZCQMeJZmBi4mX4FAxVMDgYDM8WJQNGkwY2AU8WFgUCBomMIKHRY0QYgskEvXfhBLUkOJQJmjYwYtDfWdgCjQKFeOEj+UI1IoGzugjUCYyyN2QPoFo4AQ4IPlThgaO6GRPNkhooHtT8uSagRZk2dOCAB7pZU4kGEgBaWPqlIGBlqWZ0w0GauCmTisAKEEOc+akpHxY5mnTDRPkh4KfOIFpnoCE3rSeeSQkehOc7KHoqE07glfhpDZZSV0FmN7UAniIdlpTmdTVJ2qmz7V5ak0zJMfBquM4udBbl7DihMOempVQ604qaLZBn7vmlIMMLZRw1wowmBrsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAEF2zwwQgnrPDCDDfs8MMQRyzxxBRXbPHFGGes8cYcd+zxxyCHLPLIJJds8skop6zyyiy37PLLMMcs88w012zzzTjnrPPOPPfs889ABy300EQXbfTRSCet9NJMN+3001BHLfXUVFdt9dVYZ6311lx37fXXYIctdlABAQAh+QQJAgCfACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIFBQUKCgoREREZGRkmJiYtLS0wMDA0NDQ3NzdERERPT09ZWVlqamp4eHiEhISOjo6VlZWfn5+oqKixsbG3t7e7u7vAwMDExMTIyMjLy8vQ0NDS0tLU1NTW1tbZ2dnd3d3h4eHj4+Pm5ubo6Ojr6+vv7+/y8vL19fX39/f4+Pj5+fn7+/v9/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gA/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Ldy4MEyE8cPgwAsWMunBVbEBAuHDhDoDbhjDMuLAFFYnTdmhMmTCGyGZBVN58IQZmsSg2i66Q4vPXGRVEi5ZQwnRXDqpjj3C9lULs2CJoY11x+3YI3VZF9L4NAjhVD8OJG5cKO3ns38ufLnaOO7rT0NRjk7DO9IaE7LFP/nBfqgG8agosxiclYV71BRvqkU5uv3lDfKSp6Vf2cN/oDf2b5dYfUTTkByBjKAxIVAzlHWiYBTcoSFRzDhKGmIRDIVchYdBhGJSGG0LmYVAfbIiABiMKVeKGH6RIookJuvgTiAdmICNQNAJY3I0+UXjgCzz61OCBHATZUwwGAridkTudUOEFTPIknIMdRolTju1RgIOVOmXgYItc4hSDgxH8FeZN0wHI35k3+UifDGzaFMMEB4IZJ01T6hdBDXfWNJiOfdI0JoAUBErTivoJaGhMSZp32aIx5UmfCZDG5KV+RVb6EnsA0qDpS3/SZ9+nLZUA4IWksjSkeVCmyhKn/u1F4GpLF+jnwqwrSQrerbimtAOd5snaq0pYJtfqsCix0B6qyJ5UbG87NnvSDOBlKi1Kz6rm2bUp2ZbcktyixNtw1oabkmaqTaCouSqlEGpjHXjKrksqiNCBBRRsAEIJ287r778AByzwwAQXbPDBCCes8MIMN+zwwxBHLPHEFFds8cUYZ6zxxhx37PHHIIcs8sgkl2zyySinrPLKLLfs8sswxyzzzDTXbPPNOOes88489+zzz0AHLfTQRBdt9NFIJ6300kw37fTTUEct9dRUV2311VhnrfXWXHft9ddghy322GSXbfbZaKet9tpst+3223DHLffcdNdt99145633Et589+3334AHLvjghBduuFsBAQAh+QQJAgCwACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEFBQUHBwcKCgoMDAwODg4REREUFBQXFxcbGxsfHx8iIiImJiYnJycnJycoKCgoKCgoKCgpKSkpKSkpKSkqKiotLS0xMTE0NDQ3Nzc7Ozs9PT1AQEBDQ0NFRUVHR0dJSUlLS0tNTU1OTk5QUFBRUVFSUlJaWlpgYGBwcHB/f3+MjIyVlZWfn5+kpKSpqamsrKyvr6+zs7O3t7e8vLzBwcHHx8fLy8vPz8/T09PX19fc3Nzh4eHl5eXq6urt7e3u7u7v7+/x8fHz8/P29vb39/f5+fn6+vr7+/v8/Pz9/f3+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBhCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jzCoRC5AcMBS98DHGid+2THQoSK1b84kjhsz4WS17co8rjsR0ma05cYcllsJE3b67g+DPXJaJTKxBieqsM1amDtMb6A7ZqILOt2rB9OzdVDrx7+4baJDhs3MOdCjEOW3ZypsuZqx7yfOkT6bCRVFeaGbvoDEy2/iPN4T11CCnijdYuLzpGeqMl2Ivu8Z7oEPmikdcPygP/5tL7AYWYf5J1EEWAQZFH4GI1IBhUDwsu9oODQIUWoQLaUejTehGGoIWGG16oAH0g9sThgkWU2JOFBILwoYo7QRihDzDypOCCStS4kwsRvqCjTlB0R6BzP96ERIQcXFEkTkHMuCROMhL4xJM3tbAgiVTSBEWE4WVJExAL7uBlTTgs6NmYMkFxAYE8oDlTkwQ24aZMNBCI5ZwubUkgeni+xCJ7E/b5kgf+eSDoS3DiR92hLVmJnwyMtlQEgYRFutJf+NFoqUpH+PfBpiu94F+GoJ5EhH93llqSCvhpoCpK/omyZ8SrJm2RAX6p0hrSn9hxoGtJxeGXxK8kiSqfpsSGFKt3LCQ7kn8HOgvSjeWxJu1H0bFnw7UgtcrtR3XKF+23G4Ep3xTkcnSdfKSmmxEI8gXqbkZRegfgvBdl6x2f+F6UBbzehdCvRrwG1+bAGCVR3qIIX1SmdMg2bFEW2G0hcUanGpfjxRkpzBvDHGOERcGLyUBFyB0FwcKai13Agn4od7RFE30V4YTFMees88489+zzz0AHLfTQRBdt9NFIJ6300kw37fTTUEct9dRUV2311VhnrfXWXHft9ddghy322GSXbfbZaKet9tpst+3223DHLffcdNdt99145633Rd589+3334AHLvjghBdu+OGIJ6744ow37vjjkEcu+eSUV2755ZhnrvnmnHfu+eeghy766KSXbvrpqKeu+uqst+7666sHBAAh+QQJAgCoACwAAAAA8ADwAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIGBgYLCwsNDQ0ODg4PDw8QEBASEhIXFxceHh4kJCQoKCgrKysuLi4xMTEzMzM2NjY4ODg8PDxAQEBERERISEhMTExRUVFWVlZdXV1gYGBlZWVqamptbW1vb29xcXFzc3N0dHR2dnZ4eHiAgICHh4eNjY2RkZGVlZWZmZmcnJyfn5+hoaGkpKSoqKiurq60tLS7u7u/v7/FxcXLy8vQ0NDT09PW1tbZ2dne3t7h4eHm5ubq6urv7+/x8fH09PT29vb5+fn+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBRCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t0rsMmPJnzbJsnBwoOBwx5Y5EgS+CyNC4cjS75Ao/FYJx8ka5b8wYjlr0o2i5Zs43PXzKNTlzaddUfq1wYqs7Z6hALs1zNmV21xG7Zs3VFR905dAzhUJw6Gw85h3CkQ5bd5NGc6AzpsB0CmK+VhHXaFItqR/h7pDpsD4PBGMZB/TQK9URPrX79wT/RG/Nc46A8NcT91EP1BjdefaBo4ASBQOgwo2gkHAiWDgput1mBPLEAomQNETOgTDBZGFoKGG3Z4mAwg9sShiP+VuFOFHX6o4k4niPjbiziR0OEDR9CoUwcdmqBjTkVU0GEPP+LkQ4cdFIkTDR0Wp6RNKFhYgYFP1sSBhTFUWZMRFj7AmJYzMQnhfGDONAKEDSBRpkxGJKcgmWvCVAOEDigRZ0wiQJjlnS9xqWAFfML0AoROBtqSkANuYKhLNkBI5KIsXTlgCZCyxJ2COVaqEggKkqhpSj0omMGnKgl33w+kouTagCmkilIG/gMC6qpJYvb36KwjOQHBgCjgWpIKsfpKkhAKoiqsSKauB+exH83ZnwbMioRptCDZ2F9+1HqUw4A+ZuvRgBZ461Ge/Xkm7ka1xqfDuRsRMaAK7G4E2X0exKtRlPc5YG9G2/YnxL4XITEgcwBbhGh8LhRskbXxjaBwRTH0d8HDFIXaH5UUQyRwfxlmHNGu993qsUOSxifhyA2V0B+8KDt0YnwutsxQo/dhIHNDFsfHwc0MBdEfCDwvtER/rQatkGHxzWi0QYPG58PSCa26XqZQG5TEvN0VXfVB6SpnARNbJ5Rsb9mFjZAT1rFsNkJKjD0aC2sztINtqW1gbNwLHdHClQduHmYBCXvi/ZATQMywg7mCJ6744ow37vjjkEcu+eSUV2755ZhnrvnmnHfu+eeghy766KSXbvrpqKeu+uqst+7667DHLvvstNdu++2456777rz37vvvwAcv/PDEF2/88cgnr/zyzDfv/PPQRy/99NRXb/312Gev/fbcd+/99+CHL/745Jdv/vnop6/++uy37/77IQUEACH5BAkCAKkALAAAAADwAPAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQMDAwcHBw0NDRMTExkZGRwcHCgoKDAwMDc3Nzs7Oz8/P0JCQkVFRUdHR0pKSktLS05OTlJSUlVVVVlZWV1dXWNjY2VlZWhoaGpqamxsbG5ubnBwcHFxcXJycnNzc3R0dHZ2dnd3d39/f4WFhYuLi5GRkZWVlZiYmJubm56enqCgoKOjo6ampqysrLOzs7u7u8DAwMXFxcrKys/Pz9LS0tbW1tnZ2dzc3ODg4OTk5Onp6e7u7vDw8PPz8/f39/z8/P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AFMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+1T4r0uBEkyd+0LTIkWMy4ggYch8cGUcy4MmMSkcG2sMyZsQUembm66Ex6sY3QWYuUXg0ZtVUNq1m7phojduwcs6VisB27R+6nSXjbBvK76Q/hsScQKb60NvLVFwwzR9rheewNUaYfrWE9NmbtRYP+dI89AzxRJuNj7zA/FHb60kXYB7XxvrSG7PJ/uq/P+UT+n8Hx1xlu//V0nICWSXBEgT3RgKBlHTDYE3cPMnaahDs5WOFi8WGo02gbRuihTihsmMANI+o0woYTKJFiThtsaMKLOClxwYZB0HiTEBtqoONNOGzY2o80pVChBfgROdN+AtagJE1KVEhBE0/OFOSDMFQ504oPMqFlTEpQ8GAMX8aUw4NTlgkTCA86qaZLSzx4wZsvzfCgDnS6dKOAPubJkg4PCuEnS0y+N+OgKgHRJaIqVSfghYyeJB6fkabEAYLLVWrSgfy1oOlJlNU356clXcmfoKSOFEUFAqqQKkn+m/E36qshGYHgELSKdCl/NOQa0pn89enrRwguMexHXNYH2rEd9SCgf8x2JCAG0XbEJn/SVZuRqe/5pm1GSLT6rUahpifsuBaVyF+S6FLkLH8dtksRevytJ29Fe77n6b0UJZueB/xSROF71AYs0aT1QWFwRPTWZ8TCEbFaH3EQP1Rod0NWzJAJ/GWpcUMaGvpxQ4DWJ+LICiGcXgYoL2SrqC0r1HB6FMSskIDs2kyQmPVRqbNB+abn4s8FlTseEkQXzd/DSQ90sXXxNv30c1EnPTVyVRN9tXBMN52K0d0t6PXX2I6dStDjGTs2z+85YbYF/JmdisTpSSB3jO+d7LW6ke/1avYNE8utcndeyh1CepCaHWV3LMs9ELfCZW324ch95zhBito2QcaXD8QEx6WZ8ETnCQFBAwhwJ3BBCTegSjpDSQz9+uy012777bjnrvvuvPfu++/ABy/88MQXb/zxyCev/PLMN+/889BHL/301Fdv/fXYZ6/99tx37/334Icv/vjkl2/++einr/767Lfv/vvwxy///PTXb//9+Oev//789+///wAMoAAHSMACGvCACEygAhd4l4AAADsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=");
        load.appendChild(loading);

        producer.addEventListener("keydown", function(e) {
            if(e.keyCode === 13) {clickConfirmButton();}
        });

        canFocus = true;
    }

    let pos = 0;
    let numOfChoice = 0;
    let score = 0;
    let startChoice = [];
    let MCInputList = [];
    let continuousMC = [];
    let MAInputList = []; // This is only for modifier!
    let continuousMA = []; // This is only for modifier!
    let questionTypeDict = {"考试单选": 0, "考试多选": 1};
    let scoreAvailable = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 60, 70, 80, 90, 100];
    function clickConfirmButton() {
        if(pos == 0) {
            let stop = false;
            MCNumInput.value = MCNumInput.value.replace(/\s*/g,"");
            // isEmpty
            if(MCNumInput.value.length == 0) stop = true;
            let input = MCNumInput.value.split(";");
            // isFourPart
            if(!stop && input.length != 4) {stop = true; window.alert("Wrong Input!");}
            if(!stop) {
                // isPartEmpty
                for(let i = 0; i < input.length; i++) {
                    if(input[i] == "") {
                        stop = true;
                        window.alert("Wrong Input!");
                        break;
                    }
                }
                if(!stop) {
                    // lastThreePart
                    if(isNaN(Number(input[1])) || isNaN(Number(input[2])) || !(Number(input[1]) >= 2) || !(Number.isInteger(Number(input[1]))) || !(scoreAvailable.indexOf(Number(input[2])) >= 0) || !(/^[a-zA-Z]+$/.test(input[3]))) {
                        stop = true;
                        window.alert("Wrong Input!");
                    }
                    if(!stop) {
                        numOfChoice = Number(input[1]);
                        score = Number(input[2]);
                        input[3] = input[3].toUpperCase();
                        startChoice = input[3].split("");
                        // lastPartNum
                        if(startChoice.length % numOfChoice != 0) {
                            stop = true;
                            window.alert("Wrong Input!");
                        }
                        if(!stop) {
                            // isFirstPartEmpty
                            let MCNumSection = input[0].split(',');
                            for(let i = 0; i < MCNumSection.length; i++) {
                                if(MCNumSection[i] == "") {
                                    stop = true;
                                    window.alert("Wrong Input!");
                                    break;
                                }
                            }
                            if(!stop) {
                                // checkOverlap
                                continuousMC = [];
                                let checkOverlapList = [];
                                for(let i = 0; i < MCNumSection.length; i++) {
                                    let range = MCNumSection[i].split('~');
                                    if(range.length == 1) {
                                        if(range[0] == "" || isNaN(Number(range[0])) || !(Number.isInteger(Number(range[0]))) || Number(range[0]) <= 0) {
                                            stop = true;
                                            window.alert("Wrong Input!");
                                            break;
                                        }
                                        else {
                                            if(!checkOverlapList.includes(Number(range[0]))) checkOverlapList.push(Number(range[0]));
                                            else {
                                                stop = true;
                                                window.alert("Wrong Input!");
                                                break;
                                            }
                                            continuousMC.push([Number(range[0]), 1]);
                                        }
                                    }
                                    else if(range.length == 2) {
                                        if(range[0] == "" || range[1] == "" || isNaN(Number(range[0])) || isNaN(Number(range[1])) || !(Number.isInteger(Number(range[0]))) || !(Number.isInteger(Number(range[1]))) || Number(range[1]) < Number(range[0]) || Number(range[0]) <= 0) {
                                            stop = true;
                                            window.alert("Wrong Input!");
                                            break;
                                        }
                                        else {
                                            for(let j = Number(range[0]); j <= Number(range[1]); j++) {
                                                if(!checkOverlapList.includes(j)) checkOverlapList.push(j);
                                                else {
                                                    stop = true;
                                                    window.alert("Wrong Input!");
                                                    break;
                                                }
                                            }
                                            if(!stop) {
                                                let nAtALine = 15;
                                                if(getRadioValue("MC") == 1) nAtALine = 5;
                                                let j = Number(range[0]);
                                                while(j + nAtALine - 1 <= Number(range[1])) {
                                                    continuousMC.push([j, nAtALine]);
                                                    j += nAtALine;
                                                }
                                                if(Number(range[1]) >= j) continuousMC.push([j, Number(range[1]) - j + 1]);
                                            }
                                        }
                                    }
                                    else {
                                        stop = true;
                                        window.alert("Wrong Input!");
                                        break;
                                    }
                                }
                                if(!stop) {
                                    pos = 1;
                                    MCNumInputContainer.style.display = "none";
                                    backButton.style.display = "block";
                                    singleMultiContainer.style.display = "none";
                                    modifyButton.style.display = "none";

                                    MCInputList = [];
                                    continuousMC = continuousMC.sort(function(a, b){return a[0] - b[0];});
                                    for(let j = 0; j < continuousMC.length; j++) {
                                        let MCTitleContainer = document.createElement("div");
                                        MCTitleContainer.style.width = "90%";
                                        MCTitleContainer.style.margin = "5%";
                                        let MCTitle = document.createElement("p");
                                        MCTitle.style.color = "black";
                                        MCTitle.style.fontSize = "15px";
                                        if(continuousMC[j][1] == 1) MCTitle.innerHTML = continuousMC[j][0] + " | " + continuousMC[j][1] + " Answer";
                                        else MCTitle.innerHTML = continuousMC[j][0] + '~' + (continuousMC[j][0] + continuousMC[j][1] - 1) + " | " + continuousMC[j][1] + " Answers";
                                        let MCInputContainer = document.createElement("div");
                                        MCInputContainer.style.width = "90%";
                                        MCInputContainer.style.margin = "5%";
                                        let MCInput = document.createElement("input");
                                        MCInput.setAttribute("type", "text");
                                        MCInput.style.width = "100%";
                                        MCInput.style.height = "30px";
                                        MCInput.style.fontSize = "20px";
                                        if(getRadioValue("MC") == 0) {
                                            MCInput.addEventListener("beforeinput", e => {
                                                if(e.data) {
                                                    e.preventDefault();
                                                    const data = e.data.replace(/\s*/g,"");
                                                    if(/^[A-Za-z]+$/.test(data)) {
                                                        for(let i = 0; i < data.length; i++) {
                                                            let cursorPosition = MCInput.selectionStart;
                                                            MCInput.value = MCInput.value.slice(0, cursorPosition) + data[i] + MCInput.value.slice(cursorPosition);
                                                            MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                                                            MCInput.dispatchEvent(new Event("input"));
                                                        }
                                                    }
                                                }
                                            });
                                            MCInput.addEventListener("input", function(e) {
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
                                        }
                                        if(getRadioValue("MC") == 1) {
                                            MCInput.addEventListener("beforeinput", e => e.data && (/^[A-Za-z\[\]]+$/.test(e.data) || e.preventDefault()));
                                            MCInput.addEventListener("keydown", function(e) {
                                                const key = e.key;
                                                if(key === "[" && isBracketValid(MCInput.value)) {
                                                    e.preventDefault();
                                                    const cursorPosition = MCInput.selectionStart;
                                                    const currentValue = MCInput.value;
                                                    const newValue = currentValue.slice(0, cursorPosition) + "[]" + currentValue.slice(cursorPosition);
                                                    MCInput.value = newValue;
                                                    MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                                                }
                                                if(key === "]") {
                                                    e.preventDefault();
                                                    const cursorPosition = MCInput.selectionStart;
                                                    const currentValue = MCInput.value;
                                                    const newValue = currentValue.slice(0, cursorPosition) + "]" + currentValue.slice(cursorPosition);
                                                    if(MCInput.value[cursorPosition] === "]") MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                                                    else {MCInput.value = newValue; MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);}
                                                }
                                                if(key === "Backspace" && isBracketValid(MCInput.value)) {
                                                    e.preventDefault();
                                                    const cursorPosition = MCInput.selectionStart;
                                                    const currentValue = MCInput.value;
                                                    if(MCInput.value.substring(cursorPosition - 1, cursorPosition + 1) === "[]") {
                                                        const newValue = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition + 1);
                                                        MCInput.value = newValue;
                                                        MCInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                                                    }
                                                    else if(MCInput.value.substring(cursorPosition - 2, cursorPosition) === "[]") {
                                                        const newValue = currentValue.slice(0, cursorPosition - 2) + currentValue.slice(cursorPosition);
                                                        MCInput.value = newValue;
                                                        MCInput.setSelectionRange(cursorPosition - 2, cursorPosition - 2);
                                                    }
                                                    else {
                                                        const newValue = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition);
                                                        MCInput.value = newValue;
                                                        MCInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                                                    }
                                                }
                                            });
                                        }
                                        contentContainer.insertBefore(MCTitleContainer, submitButtonContainer);
                                        MCTitleContainer.appendChild(MCTitle);
                                        contentContainer.insertBefore(MCInputContainer, submitButtonContainer);
                                        MCInputContainer.appendChild(MCInput);
                                        MCInputList.push(MCInput);
                                    }
                                    for(let k = 0; k < MCInputList.length; k++) {
                                        let prev = k - 1;
                                        let next = k + 1;
                                        if(prev < 0) prev += MCInputList.length;
                                        if(next == MCInputList.length) next = 0;
                                        // eslint-disable-next-line no-loop-func
                                        MCInputList[k].addEventListener("keydown", function(e) {
                                            if(e.keyCode === 38) {
                                                MCInputList[prev].focus();
                                            }
                                            else if(e.keyCode === 40) {
                                                MCInputList[next].focus();
                                            }
                                        });
                                    }

                                    covering.style.display = "block";
                                    load.style.display = "block";
                                    confirmButton.disabled = true;
                                    backButton.disabled = true;
                                    for(let i = 0; i < MCInputList.length; i++) MCInputList[i].disabled = true;
                                    (async () => {
                                        let lastPos = await clearQuestion();
                                        await addMC((continuousMC[continuousMC.length - 1][0] + continuousMC[continuousMC.length - 1][1] - 1) - lastPos, getRadioValue("MC"));
                                        await setScoreAndNum(numOfChoice, score, continuousMC);
                                    })()
                                        .then(() => {
                                        MCNumInput.value = "";
                                        covering.style.display = "none";
                                        load.style.display = "none";
                                        confirmButton.disabled = false;
                                        backButton.disabled = false;
                                        for(let i = 0; i < MCInputList.length; i++) MCInputList[i].disabled = false;
                                        MCInputList[0].focus();
                                    })
                                }
                            }
                        }

                    }
                }
            }
        }
        else if(pos == 1) {
            let stop = false;
            let numOfQuestion = 0;
            let choiceNumList = [];
            if(getRadioValue("MC") == 0) {
                for(let i = 0; i < MCInputList.length; i++) {
                    MCInputList[i].value = MCInputList[i].value.replace(/\s*/g,"");
                    MCInputList[i].value = MCInputList[i].value.toUpperCase();
                    if(MCInputList[i].value.length == 0) {
                        let tempNumList = [];
                        for(let j = 0; j < continuousMC[i][1]; j++) {
                            tempNumList.push(-1);
                            numOfQuestion++;
                        }
                        choiceNumList.push(tempNumList);
                        continue;
                    }
                    if(MCInputList[i].value.length != continuousMC[i][1] || !(/^[A-Z\*]+$/.test(MCInputList[i].value))) {
                        stop = true;
                        MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                        MCInputList[i].value = MCInputList[i].value.trim();
                        window.alert("Wrong Input!");
                        break;
                    }
                    if(!stop) {
                        let tempNumList = [];
                        for(let j = 0; j < MCInputList[i].value.length; j++) {
                            let flag = false;
                            if(MCInputList[i].value[j] == "*") {
                                flag = true;
                                tempNumList.push(-1);
                            }
                            for(let k = 0; k < numOfChoice; k++) {
                                if(MCInputList[i].value[j] == startChoice[(numOfQuestion % (startChoice.length / numOfChoice)) * numOfChoice + k]) {
                                    flag = true;
                                    tempNumList.push(k);
                                }
                            }
                            if(!flag) {
                                stop = true;
                                MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                                MCInputList[i].value = MCInputList[i].value.trim();
                                window.alert("Wrong Input!");
                                break;
                            }
                            numOfQuestion++;
                        }
                        choiceNumList.push(tempNumList);
                    }
                    MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                    MCInputList[i].value = MCInputList[i].value.trim();
                }
            }
            if(getRadioValue("MC") == 1) {
                for(let i = 0; i < MCInputList.length; i++) {
                    MCInputList[i].value = MCInputList[i].value.replace(/\s*/g,"");
                    MCInputList[i].value = MCInputList[i].value.toUpperCase();
                    if(MCInputList[i].value.length == 0) {
                        let tempNumList = [];
                        for(let j = 0; j < continuousMC[i][1]; j++) {
                            tempNumList.push(-1);
                            numOfQuestion++;
                        }
                        choiceNumList.push(tempNumList);
                        continue;
                    }
                    let multiList = MCInputList[i].value.match(/\[[A-Z]{2,}\]|\*/g);
                    let allList = MCInputList[i].value.match(/\[.+?\]|\*/g);
                    if(multiList == null || multiList.length != continuousMC[i][1] || multiList.length != allList.length) {
                        stop = true;
                        window.alert("Wrong Input!");
                        break;
                    }
                    if(!stop) {
                        let tempNumList = [];
                        for(let j = 0; j < multiList.length; j++) {
                            let subTempNumList = [];
                            if(multiList[j] == "*") {
                                tempNumList.push(-1);
                                numOfQuestion++;
                                continue;
                            }
                            for(let n = 1; n < multiList[j].length - 1; n++) {
                                let flag = false;
                                for(let k = 0; k < numOfChoice; k++) {
                                    if(multiList[j][n] == startChoice[(numOfQuestion % (startChoice.length / numOfChoice)) * numOfChoice + k]) {
                                        flag = true;
                                        subTempNumList.push(k);
                                    }
                                }
                                if(!flag) {
                                    stop = true;
                                    window.alert("Wrong Input!");
                                    break;
                                }
                            }
                            tempNumList.push(subTempNumList);
                            numOfQuestion++;
                        }
                        choiceNumList.push(tempNumList);
                    }
                }
            }
            if(!stop) {
                setAnswer(continuousMC, choiceNumList, getRadioValue("MC"));
            }
        }
        else if(pos == 2) {
            let question = document.getElementsByClassName("div_question");
            let numOfQuestion = 0;
            for(let i = 0; i < MCInputList.length; i++) {
                MCInputList[i].value = MCInputList[i].value.replace(/\s*/g,"");
                MCInputList[i].value = MCInputList[i].value.toUpperCase();
                if(MCInputList[i].value.length == 0) {
                    continue;
                }
                if(MCInputList[i].value.length != continuousMC[i][1] || !(/^[A-Z\*]+$/.test(MCInputList[i].value))) {
                    MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                    MCInputList[i].value = MCInputList[i].value.trim();
                    window.alert("Wrong input!");
                    break;
                }
                else {
                    let posAns = 0;
                    for(let j = 0; j < MCInputList[i].value.length; j++) {
                        let correctChoice = false;
                        if(MCInputList[i].value[j] == "*") {
                            continue;
                        }
                        question[continuousMC[i][0] + j].children[0].click();
                        let selected = question[continuousMC[i][0] + j].children[0].children[1].children[1].children[1].getElementsByTagName("li");
                        for(let n = 0; n < selected.length; n++) if(selected[n].children[0].children[0] !== null && typeof selected[n].children[0].children[0] !== "undefined") posAns = n;
                        let choiceTable = question[continuousMC[i][0] + j].children[1].children[0].children[3].children[1].children[0].children[1].children[0].children[0];
                        for(let n = 1; n < choiceTable.children.length; n++) {
                            let choice = choiceTable.children[n].children[0].children[0].value;
                            if((choice.length == 1 && choice === MCInputList[i].value[j]) || String.fromCharCode(65 + n - 1) === MCInputList[i].value[j]) {
                                if(posAns !== n - 1) choiceTable.children[n].children[5].children[0].children[1].click();
                                correctChoice = true;
                            }
                        }
                        question[continuousMC[i][0] + j].children[0].click();
                        if(!correctChoice) {
                            MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                            MCInputList[i].value = MCInputList[i].value.trim();
                            window.alert("Wrong Input");
                            break;
                        }
                    }
                }
                MCInputList[i].value = MCInputList[i].value.replace(/(.{5})/g, '$1 ');
                MCInputList[i].value = MCInputList[i].value.trim();
            }
            for(let i = 0; i < MAInputList.length; i++) {
                MAInputList[i].value = MAInputList[i].value.replace(/\s*/g,"");
                MAInputList[i].value = MAInputList[i].value.toUpperCase();
                if(MAInputList[i].value.length === 0) continue;
                let multiList = MAInputList[i].value.match(/\[[A-Z]{2,}\]|[*]+?/g);
                let allList = MAInputList[i].value.match(/\[.+?\]|[*]+?/g);
                if(multiList == null || multiList.length != continuousMA[i][1] || multiList.length != allList.length) {
                    window.alert("Wrong input!");
                    break;
                }
                else {
                    for(let j = 0; j < multiList.length; j++) {
                        if(multiList[j] == "*") {
                            continue;
                        }
                        question[continuousMA[i][0] + j].children[0].click();
                        let selected = question[continuousMA[i][0] + j].children[0].children[1].children[1].children[1].getElementsByTagName("li");
                        let choiceTable = question[continuousMA[i][0] + j].children[1].children[0].children[3].children[1].children[0].children[1].children[0].children[0];
                        for(let n = 0; n < selected.length; n++) {
                            if(selected[n].children[0].children[0] !== null && typeof selected[n].children[0].children[0] !== "undefined") {
                                choiceTable.children[n + 1].children[5].children[0].children[1].click();
                            }
                        }
                        for(let x = 1; x < multiList[j].length - 1; x++) {
                            let correctChoice = false;
                            for(let k = 1; k < choiceTable.children.length; k++) {
                                let choice = choiceTable.children[k].children[0].children[0].value;
                                if((choice.length == 1 && choice === multiList[j][x]) || String.fromCharCode(65 + k - 1) === multiList[j][x]) {
                                    choiceTable.children[k].children[5].children[0].children[1].click();
                                    correctChoice = true;
                                }
                            }
                            if(!correctChoice) {
                                window.alert("Wrong Input!");
                                break;
                            }
                        }
                        question[continuousMA[i][0] + j].children[0].click();
                    }
                }
            }
        }
    }

    async function activateQuestion() {
        let question = document.getElementsByClassName("div_question");
        for(let i = 0; i < question.length; i++) {
            if((question[i].getAttribute("title") === null || question[i].getAttribute("title") == "") && typeof question[i].children[1] === "undefined") {
                question[i].children[0].dispatchEvent(new MouseEvent("mouseover",{"bubbles": true}));
                await sleep(1);
                question[i].children[0].click();
                await sleep(1);
                question[i].children[0].click();
                await sleep(1);
            }
        }
    }

    async function clearQuestion() {
        let question = document.getElementsByClassName("div_question");
        let i = question.length - 1;
        let lastPos = 0;
        await activateQuestion()
            .then(() => {
            while(i >= 0) {
                if((question[i].getAttribute("title") === null || question[i].getAttribute("title") == "") && question[i].children[0].children[0].children[0].textContent != "") {
                    if(parseFloat(question[i].children[0].children[0].children[0].textContent) < continuousMC[0][0]) {
                        lastPos = parseFloat(question[i].children[0].children[0].children[0].textContent);
                        break;
                    }
                    question[i].children[0].children[2].children[3].children[0].children[2].dispatchEvent(new MouseEvent("mouseover",{"bubbles": true}));
                    question[i].children[0].children[2].children[3].children[0].children[2].children[0].dispatchEvent(new MouseEvent("click",{"bubbles": true}));
                }
                else break;
                i--;
            }
        });
        return lastPos;
    }

    async function addMC(n, opt) {
        let questionTypeList = testQuestionBar.children[1].children[1];
        let MC1 = questionTypeList.children[0].children[0];
        let MC2 = questionTypeList.children[2].children[0];
        if(opt == 0) {
            for(let i = 0; i < n; i++) {
                MC1.click();
            }
        }
        if(opt == 1) {
            for(let i = 0; i < n; i++) {
                MC2.click();
            }
        }
    }

    async function setScoreAndNum(num, score, MCList) {
        let question = document.getElementsByClassName("div_question");
        await activateQuestion()
            .then(() => {
            let k = 0;
            let numOfQuestion = 0;
            for(let i = 0; i < MCList.length; i++) {
                for(let j = MCList[i][0]; j < MCList[i][0] + MCList[i][1]; j++) {
                    while(true) {
                        if((question[k].getAttribute("title") === null || question[k].getAttribute("title") == "") && question[k].children[0].children[0].children[0].textContent != "") {
                            if(question[k].children[0].children[0].children[0].textContent == j) {
                                question[k].children[0].click();
                                let scoreSelect = question[k].children[1].children[0].children[1].children[2].children[3].children[0].children[0].children[1];
                                let choice = question[k].children[1].children[0].children[3].children[1].children[0].children[1].children[0].children[0];
                                let addChoice = choice.children[1].children[0].children[1];
                                scoreSelect.value = score;
                                scoreSelect.dispatchEvent(new Event("change", {"bubbles": true}));
                                for(let i = 0; i < num - 2; i++) {
                                    addChoice.click();
                                }
                                for(let i = 0; i < num; i++) {
                                    let choiceInput = choice.children[i + 1].children[0].children[0];
                                    choiceInput.value = startChoice[(numOfQuestion % (startChoice.length / num)) * num + i];
                                }
                                question[k].children[0].click();
                                numOfQuestion++;
                                break;
                            }
                        }
                        k++;
                    }
                }
            }
            if(numOfQuestion == 1) question[k].children[0].click();
        });
    }

    function setAnswer(MCList, choiceNumList, opt) {
        let question = document.getElementsByClassName("div_question");
        let k = 0;
        if(opt == 0) {
            let posAns = 0;
            for(let i = 0; i < MCList.length; i++) {
                let numOfQuestion = 0;
                for(let j = MCList[i][0]; j < MCList[i][0] + MCList[i][1]; j++) {
                    while(true) {
                        if((question[k].getAttribute("title") === null || question[k].getAttribute("title") == "") && question[k].children[0].children[0].children[0].textContent != "") {
                            if(question[k].children[0].children[0].children[0].textContent == j) {
                                if(choiceNumList[i][numOfQuestion] == -1) {
                                    numOfQuestion++;
                                    break;
                                }
                                question[k].children[0].click();
                                let selected = question[k].children[0].children[1].children[1].children[1].getElementsByTagName("li");
                                for(let n = 0; n < selected.length; n++) if(selected[n].children[0].children[0] !== null && typeof selected[n].children[0].children[0] !== "undefined") posAns = n;
                                let choiceTable = question[k].children[1].children[0].children[3].children[1].children[0].children[1].children[0].children[0];
                                if(choiceNumList[i][numOfQuestion] != posAns) choiceTable.children[choiceNumList[i][numOfQuestion] + 1].children[5].children[0].children[1].click();
                                question[k].children[0].click();
                                numOfQuestion++;
                                break;
                            }
                        }
                        k++;
                    }
                }
            }
        }
        if(opt == 1) {
            for(let i = 0; i < MCList.length; i++) {
                let numOfQuestion = 0;
                for(let j = MCList[i][0]; j < MCList[i][0] + MCList[i][1]; j++) {
                    while(true) {
                        if((question[k].getAttribute("title") === null || question[k].getAttribute("title") == "") && question[k].children[0].children[0].children[0].textContent != "") {
                            if(question[k].children[0].children[0].children[0].textContent == j) {
                                if(choiceNumList[i][numOfQuestion] == -1) {
                                    numOfQuestion++;
                                    break;
                                }
                                question[k].children[0].click();
                                let selected = question[k].children[0].children[1].children[1].children[1].getElementsByTagName("li");
                                let choiceTable = question[k].children[1].children[0].children[3].children[1].children[0].children[1].children[0].children[0];
                                for(let n = 0; n < selected.length; n++) {
                                    if(selected[n].children[0].children[0] !== null && typeof selected[n].children[0].children[0] !== "undefined") {
                                        choiceTable.children[n + 1].children[5].children[0].children[1].click();
                                    }
                                }
                                for(let x = 0; x < choiceNumList[i][numOfQuestion].length; x++) {
                                    choiceTable.children[choiceNumList[i][numOfQuestion][x] + 1].children[5].children[0].children[1].click();
                                }
                                question[k].children[0].click();
                                numOfQuestion++;
                                break;
                            }
                        }
                        k++;
                    }
                }
            }
        }
    }

    function clickBackButton() {
        if(pos == 1) {
            pos = 0;
            MCNumInputContainer.style.display = "block";
            backButton.style.display = "none";
            singleMultiContainer.style.display = "block";
            modifyButton.style.display = "block";
            for(let i = 0; i < MCInputList.length; i++) {
                const a = MCInputList[i].parentNode;
                const b = a.previousElementSibling;
                const c = a.parentNode;
                c.removeChild(a);
                c.removeChild(b);
            }
            MCInputList = [];
        }
        else if(pos == 2) {
            pos = 0;
            MCHeaderContainer.style.display = "block";
            MCNumInputContainer.style.display = "block";
            modifyButton.style.display = "block";
            revealButton.style.display = "none";
            backButton.style.display = "none";
            singleMultiContainer.style.display = "block";
            confirmButton.disabled = false;
            let modifierContainer = document.getElementById("modifier-container");
            if(modifierContainer !== null || typeof modifierContainer === "undefined") contentContainer.removeChild(modifierContainer);
        }
    }

    async function clickModifyButton() {
        pos = 2;
        MCHeaderContainer.style.display = "none";
        MCNumInputContainer.style.display = "none";
        modifyButton.style.display = "none";
        singleMultiContainer.style.display = "none";
        revealButton.style.display = "block";
        revealButton.disabled = true;
        backButton.style.display = "block";
        backButton.disabled = true;
        confirmButton.disabled = true;
        covering.style.display = "block";
        load.style.display = "block";
        let question = document.getElementsByClassName("div_question");
        continuousMC = [];
        continuousMA = [];
        await activateQuestion()
            .then(() => {
            let numOfMC = 0;
            let firstMC = true;
            let firstMCPos = 0;
            let nAtALine = 15;
            let numOfMA = 0;
            let firstMA = true;
            let firstMAPos = 0;
            let nAtALine2 = 5;
            for(let i = 0; i < question.length; i++) {
                if((question[i].getAttribute("title") === null || question[i].getAttribute("title") == "") && question[i].children[0].children[0].children[0].textContent != "") {
                    let questionType = questionTypeDict[question[i].children[1].children[0].children[1].children[2].children[0].children[0].options[0].text];
                    // Multiple Choice - Single Answer
                    if(questionType == 0) {
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
                    if(questionType == 1) {
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
                }
            }
            if(numOfMC != 0 && numOfMC % nAtALine != 0) continuousMC.push([firstMCPos, numOfMC]);
            if(numOfMA != 0 && numOfMA % nAtALine != 0) continuousMA.push([firstMAPos, numOfMA]);
            if(continuousMC.length != 0 || continuousMA.length != 0) {
                MCHeaderContainer.style.display = "block";
                var modifierContainer = document.createElement("div");
                modifierContainer.style.width = "100%";
                modifierContainer.setAttribute("id", "modifier-container");
                contentContainer.insertBefore(modifierContainer, submitButtonContainer);
            }
            MCInputList = [];
            if(continuousMC.length != 0) {
                let singleHeaderContainer = document.createElement("div");
                singleHeaderContainer.style.width = "90%";
                singleHeaderContainer.style.margin = "5%";
                let singleHeader = document.createElement("p");
                singleHeader.innerHTML = "Single Answer";
                singleHeader.style.fontWeight = "bold";
                singleHeader.style.fontSize = "18px";
                singleHeader.style.color = "black";
                modifierContainer.appendChild(singleHeaderContainer);
                singleHeaderContainer.appendChild(singleHeader);
            }
            for(let i = 0; i < continuousMC.length; i++) {
                let MCTitleContainer = document.createElement("div");
                MCTitleContainer.style.width = "90%";
                MCTitleContainer.style.margin = "5%";
                let MCTitle = document.createElement("p");
                MCTitle.style.color = "black";
                MCTitle.style.fontSize = "15px";
                if(continuousMC[i][1] != 1) MCTitle.innerHTML = parseFloat(question[continuousMC[i][0]].children[0].children[0].children[0].textContent) + '~' + parseFloat(question[continuousMC[i][0] + continuousMC[i][1] - 1].children[0].children[0].children[0].textContent) + " | " + continuousMC[i][1] + " Answers";
                else MCTitle.innerHTML = parseFloat(question[continuousMC[i][0]].children[0].children[0].children[0].textContent) + " | " + continuousMC[i][1] + " Answer";
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
                        if(/^[A-Za-z]+$/.test(data)) {
                            for(let i = 0; i < data.length; i++) {
                                let cursorPosition = MCInput.selectionStart;
                                MCInput.value = MCInput.value.slice(0, cursorPosition) + data[i] + MCInput.value.slice(cursorPosition);
                                MCInput.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                                MCInput.dispatchEvent(new Event("input"));
                            }
                        }
                    }
                });
                MCInput.addEventListener("input", function(e) {
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

                modifierContainer.appendChild(MCTitleContainer);
                MCTitleContainer.appendChild(MCTitle);
                modifierContainer.appendChild(MCInputContainer);
                MCInputContainer.appendChild(MCInput);
                MCInputList.push(MCInput);
            }
            MAInputList = [];
            if(continuousMA.length != 0) {
                let multiHeaderContainer = document.createElement("div");
                multiHeaderContainer.style.width = "90%";
                multiHeaderContainer.style.margin = "5%";
                let multiHeader = document.createElement("p");
                multiHeader.innerHTML = "Multi Answer";
                multiHeader.style.fontWeight = "bold";
                multiHeader.style.fontSize = "18px";
                multiHeader.style.color = "black";
                modifierContainer.appendChild(multiHeaderContainer);
                multiHeaderContainer.appendChild(multiHeader);
            }
            for(let i = 0; i < continuousMA.length; i++) {
                let MATitleContainer = document.createElement("div");
                MATitleContainer.style.width = "90%";
                MATitleContainer.style.margin = "5%";
                let MATitle = document.createElement("p");
                MATitle.style.color = "black";
                MATitle.style.fontSize = "15px";
                if(continuousMA[i][1] != 1) MATitle.innerHTML = parseFloat(question[continuousMA[i][0]].children[0].children[0].children[0].textContent) + '~' + parseFloat(question[continuousMA[i][0] + continuousMA[i][1] - 1].children[0].children[0].children[0].textContent) + " | " + continuousMA[i][1] + " Answers";
                else MATitle.innerHTML = parseFloat(question[continuousMA[i][0]].children[0].children[0].children[0].textContent) + " | " + continuousMA[i][1] + " Answer";
                let MAInputContainer = document.createElement("div");
                MAInputContainer.style.width = "90%";
                MAInputContainer.style.margin = "5%";
                let MAInput = document.createElement("input");
                MAInput.setAttribute("type", "text");
                MAInput.style.width = "100%";
                MAInput.style.height = "30px";
                MAInput.style.fontSize = "20px";
                MAInput.addEventListener("beforeinput", e => e.data && (/^[A-Za-z\[\]]+$/.test(e.data) || e.preventDefault()));
                MAInput.addEventListener("keydown", function(e) {
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
                modifierContainer.appendChild(MATitleContainer);
                MATitleContainer.appendChild(MATitle);
                modifierContainer.appendChild(MAInputContainer);
                MAInputContainer.appendChild(MAInput);
                MAInputList.push(MAInput);
            }

            let allInputList = MCInputList.concat(MAInputList);

            if(allInputList.length != 0) allInputList[0].focus();

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

            backButton.disabled = false;
            if(allInputList.length != 0) {confirmButton.disabled = false; revealButton.disabled = false;}
            covering.style.display = "none";
            load.style.display = "none";
        });
    }

    function clickRevealButton() {
        let question = document.getElementsByClassName("div_question");
        for(let i = 0; i < continuousMC.length; i++) {
            let ans = "";
            for(let j = 0; j < continuousMC[i][1]; j++) {
                let selected = question[continuousMC[i][0] + j].children[0].children[1].children[1].children[1].getElementsByTagName("li");
                for(let n = 0; n < selected.length; n++) {
                    if(selected[n].children[0].children[0] !== null && typeof selected[n].children[0].children[0] !== "undefined") {
                        let tempAns = selected[n].children[0].children[2].textContent;
                        if(tempAns.length == 1 && /^[A-Z]+$/.test(tempAns)) {
                            ans += tempAns;
                        }
                        else {
                            ans += String.fromCharCode(65 + n);
                        }
                    }
                }
            }
            ans = ans.replace(/\s*/g,"");
            ans = ans.replace(/(.{5})/g, '$1 ');
            ans = ans.trim();
            MCInputList[i].value = ans;
        }
        for(let i = 0; i < continuousMA.length; i++) {
            let ans = "";
            for(let j = 0; j < continuousMA[i][1]; j++) {
                let selected = question[continuousMA[i][0] + j].children[0].children[1].children[1].children[1].getElementsByTagName("li");
                let tempAnsList = [];
                for(let n = 0; n < selected.length; n++) {
                    if(selected[n].children[0].children[0] !== null && typeof selected[n].children[0].children[0] !== "undefined") {
                        let tempAns = selected[n].children[0].children[2].textContent;
                        if(tempAns.length == 1 && /^[A-Z]+$/.test(tempAns)) {
                            tempAnsList.push(tempAns);
                        }
                        else {
                            tempAnsList.push(String.fromCharCode(65 + n));
                        }
                    }
                }
                ans += "[" + tempAnsList.join("") + "]";
            }
            MAInputList[i].value = ans;
        }
    }

})();