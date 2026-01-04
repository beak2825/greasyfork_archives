// ==UserScript==
// @name         Lynns Fair Game QoL Extension
// @namespace    https://fair.kaliburg.de/#
// @version      0.1.4
// @description  Fair Game QOL Enhancements
// @author       Lynn
// @match        https://fair.kaliburg.de/
// @include      *kaliburg.de*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=kaliburg.de
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440046/Lynns%20Fair%20Game%20QoL%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/440046/Lynns%20Fair%20Game%20QoL%20Extension.meta.js
// ==/UserScript==

// Script made and maintained by Lynn#6969!

// Features include:
// - Scrollable, bigger chat
// - Chat mentions (with sound)
// - Ladder Switch
// - Chat switch

// Todo Features:
// - Time to next multi
// - Time to next bias
// - Top vinegar loss (on ladder 1)
// - Follow person


if (typeof unsafeWindow !== 'undefined') {
    window = unsafeWindow;
}

window.subscribeToDomNode = function(id, callback) {
    let input = $("#"+id)[0];
    if (input) {
        input.addEventListener("change", callback);
    } else {
        console.log(`Id ${id} was not found subscribing to change events`);
    }
}

const sleep = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

(async () => {


    mentionSound = new Audio(
        'https://assets.mixkit.co/sfx/download/mixkit-software-interface-start-2574.wav'
    );

    //Waiting for the base script to load
    while (true) {
        await sleep(100);
        try {
            if (addOption) {
                break;
            }
        } catch (e) {}
    }
    console.log("[FairGame] Initializing Lynn's QOL");

    //Options
    addNewSection("Lynn's Chad tweaks");
    addOption(CheckboxOption("Invert Chad", "invertChad"));
    addOption(CheckboxOption("Scrollable Chad", "scrollableChad"));
    addOption(TextInputOption("Saved Chad Message Count", "chadMessageCount", "# of chad messages, max 9999", "4"))
    chadMessageCount.value = 50;
    addOption(CheckboxOption("Mention Sound", "mentionSounds"));
    addOption(CheckboxOption("Highlight Mentions", "highlightMentions", true));

    addNewSection("Lynn's Ladder tweaks");
    addOption(CheckboxOption("Use Lynns Ladder Code", "useLynnsLadderCode"));

    addNewSection("Lynn's Data tweaks");
    addOption(CheckboxOption("Save Data", "saveData"));


    //Load options
    if (localStorage.getItem("lynnsQOLData") != null) {
        window.lynnsQOLData = JSON.parse(localStorage.getItem("lynnsQOLData"));
        $("#saveData").prop("checked", lynnsQOLData.saveData);
        $("#mentionSounds").prop("checked", lynnsQOLData.mentionSound);
        $("#highlightMentions").prop("checked", lynnsQOLData.mentionHighlight);
        $("#invertChad").prop("checked", lynnsQOLData.invertChad);
        $("#scrollableChad").prop("checked", lynnsQOLData.scrollableChad);
        $("#chadMessageCount").val(lynnsQOLData.chadMessageCount);
        $("#useLynnsLadderCode").prop("checked", lynnsQOLData.useLynnsLadderCode);
    }

    function saveData() {
        //if we want to save data
        if ($("#saveData").prop("checked")) {
            var saveData = {
                mentionSound: $("#mentionSounds").prop("checked"),
                mentionHighlight: $("#highlightMentions").prop("checked"),
                saveData: $("#saveData").prop("checked"),
                invertChad: $("#invertChad").prop("checked"),
                scrollableChad: $("#scrollableChad").prop("checked"),
                chadMessageCount: $("#chadMessageCount").val(),
                useLynnsLadderCode: $("#useLynnsLadderCode").prop("checked")
            };
            localStorage.setItem("lynnsQOLData", JSON.stringify(saveData));
        }
    }

    subscribeToDomNode("invertChad", saveData);
    subscribeToDomNode("scrollableChad", saveData);
    subscribeToDomNode("mentionSounds", saveData);
    subscribeToDomNode("highlightMentions", saveData);
    subscribeToDomNode("saveData", saveData);
    subscribeToDomNode("useLynnsLadderCode", window.updateLadder);
    subscribeToDomNode("chadMessageCount", saveData);
    subscribeToDomNode("chadMessageCount", window.updateChad);
    subscribeToDomNode("useLynnsLadderCode", saveData);





    window.expandChat = function () {
        if($("#scrollableChad").prop("checked"))
        {
            var chatTable = $("#messagesBody").parent()
            var chatParent = chatTable.parent();
            var chatContainer = document.createElement("div");
            chatContainer.className = "chat-container";
            chatContainer.style.width = "100%";
            chatContainer.style.height = "64vh";
            chatContainer.style.overflow = "auto";
            chatContainer.style.border = "gray solid 2px";
            chatParent[0].replaceChild(chatContainer, chatTable[0]);
            chatContainer.appendChild(chatTable[0]);
        }
        else
        {
            if($(".chat-container")[0])
            {
                $(".chat-container")[0].outerHTML = $(".chat-container")[0].innerHTML;
            }
        }
    };

    window.maxLadderReached = ladderData.currentLadder.number;
    window.displayLadderNavigation = function () {
        if (ladderData.currentLadder.number > window.maxLadderReached) {
            window.maxLadderReached = ladderData.currentLadder.number;
        }

        const nextLadder = () => {
            if (ladderData.currentLadder.number + 1 <= window.maxLadderReached) {
                changeLadder(ladderData.currentLadder.number + 1);
            }
        }
        const prevLadder = () => {
            if (ladderData.currentLadder.number > 1) {
                changeLadder(ladderData.currentLadder.number - 1);
            }
        }

        const nextButton = document.createElement('button');
        nextButton.classList.add("btn", "btn-outline-secondary");
        nextButton.innerHTML = "&gt;";
        nextButton.onclick = nextLadder;

        const prevButton = document.createElement('button');
        prevButton.classList.add("btn", "btn-outline-secondary");
        prevButton.innerHTML = "&lt;";
        prevButton.onclick = prevLadder;

        if (ladderData.currentLadder.number <= 1) prevButton.disabled = true;
        if (ladderData.currentLadder.number >= maxLadderReached) nextButton.disabled = true;

        const ladderNum = document.createElement('span');
        ladderNum.innerHTML = ` Ladder # ${ladderData.currentLadder.number} `;

        $('#ladderNumber').empty().append(prevButton).append(ladderNum).append(nextButton);
    }
    window.displayChatNavigation = function () {
        window.currentChat = ladderData.currentLadder.number;
        const nextChad = () => {
            if (window.currentChat + 1 <= window.maxLadderReached) {
                window.currentChat++;
                changeChatRoom(window.currentChat);
                updateChat();
                document.getElementsByClassName("chat-number")[0].innerHTML = "Chad #" + window.currentChat;
                prevButton.disabled = window.currentChat <= 1;
                nextButton.disabled = window.currentChat >= maxLadderReached;
            }
        }
        const prevChad = () => {
            if (window.currentChat > 1) {
                window.currentChat--;
                changeChatRoom(window.currentChat);
                updateChat();
                document.getElementsByClassName("chat-number")[0].innerHTML = "Chad #" + window.currentChat;


                prevButton.disabled = window.currentChat <= 1;
                nextButton.disabled = window.currentChat >= maxLadderReached;
            }
        }

        const nextButton = document.createElement('button');
        nextButton.classList.add("btn", "btn-outline-secondary");
        nextButton.innerHTML = "&gt;";
        nextButton.onclick = nextChad;

        const prevButton = document.createElement('button');
        prevButton.classList.add("btn", "btn-outline-secondary");
        prevButton.innerHTML = "&lt;";
        prevButton.onclick = prevChad;

        if (window.currentChat <= 1) prevButton.disabled = true;
        if (window.currentChat >= maxLadderReached) nextButton.disabled = true;

        const chatNum = document.createElement('span');
        chatNum.classList.add("chat-number");
        chatNum.innerHTML = ` Chad # ${ladderData.currentLadder.number} `;
        var container = document.createElement('div');
        var container2 = document.createElement('div');

        container.className = "row col-2 text-center";
        container.appendChild(container2);
        container2.className = "h5";
        container2.appendChild(prevButton);
        container2.appendChild(chatNum);
        container2.appendChild(nextButton);
        $('#helpLink')[0].parentElement.parentElement.insertBefore(container, $('#helpLink')[0].parentElement);
        rankerCount.parentElement.className = "col-1 text-start";
        helpLink.parentElement.className = "col-1 text-end";
    }
    window.handleChatUpdates = function (message) {
        if (message) {
            if (ladderData.yourRanker.username != "") {
                if (message.message.includes("@" + ladderData.yourRanker.username) &&
                    $("#mentionSounds").is(":checked")) {
                    mentionSound.play();
                }
            }
            chatData.messages.unshift(message);
            while (chatData.messages.length > chadMessageCount.value) chatData.messages.pop(); // <-- Change limit here
        }
        updateChat();
    };

    window.mention = function(name)
    {
        name = name.text
        var messageBox = document.getElementById("messageInput");
        if(messageBox.value.length > 0)
        {
            messageBox.value = messageBox.value + " @" + name + " ";
        }
        else
        {
            messageBox.value = "@" + name + " ";
        }
        messageBox.focus();
    }

    let oldUpdateChat = window.updateChat;
    window.updateChat = function () {


        //go through the chat messages and check if they contain a mention of the user
        if (ladderData.yourRanker.username != "") {

            for (var i = 0; i < chatData.messages.length; i++) {
                if (chatData.messages[i].message.includes("@" + ladderData.yourRanker.username) &&
                    $("#highlightMentions").is(":checked")) {
                    //if they do, and this message was not touched yet, highlight the mention
                    if (chatData.messages[i].highlighted == false || chatData.messages[i].highlighted == undefined) {

                        //make a copy of the message
                        chatData.messages[i].message1 = chatData.messages[i].message;

                        //replace all occurences of the mention with a highlighted version
                        chatData.messages[i].message = chatData.messages[i].message1.replaceAll("@" + ladderData.yourRanker.username, "<a style=\"color: red\">@" + ladderData.yourRanker.username + "</a>");
                        chatData.messages[i].highlighted = true;
                    }
                }
                //if the message was already highlighted, but the user no longer wishes to see it highlighted, then unhighlight it
                else if (chatData.messages[i].highlighted == true &&
                    !$("#highlightMentions").is(":checked")) {
                    chatData.messages[i].message = chatData.messages[i].message1;
                    chatData.messages[i].highlighted = false;
                }

                //check if the username has an onclick event
                if (!chatData.messages[i].username.startsWith("<a onclick='mention(this)'>")) {
                    //if it doesn't, add one
                    chatData.messages[i].username = "<a onclick='mention(this)'>" + chatData.messages[i].username + "</a>";
                }
            }
        }

        //copy the chat data
        var chatDataCopy = JSON.parse(JSON.stringify(chatData));
        if ($("#invertChad").is(":checked")) {
            //reverse the chat data, because we want to display the newest messages on the bottom
            chatData.messages.reverse();
        }
        //update the chat
        oldUpdateChat();
        //restore the chat data
        chatData = chatDataCopy;


        var chatContainer = document.getElementsByClassName("chat-container")[0];
        if(chatContainer)
        {
            if($("#invertChad").prop("checked"))
                chatContainer.scrollTop = chatContainer.scrollHeight + 1000;
            else
                chatContainer.scrollTop = 0;
        }
    }

    function newLine(element)
    {
        var newLine = document.createElement("br");
        element.appendChild(newLine);
    }

    function newValue(element, text, id)
    {
        var tt = document.createTextNode(text);
        var subText = document.createElement("span");
        subText.id = id;
        element.appendChild(tt);
        element.appendChild(subText);
    }

    function insertControls() {
        var controls = document.createElement("div");
        controls.id = "controls";
        var oldControls = document.querySelector(".col-7 > div:nth-child(2)").previousElementSibling;
        oldControls.parentNode.appendChild(controls);

        //insert new value display for time to next multi
        newValue(controls, "Time to next multi: ", "timeToNextMulti");

        //next line
        newLine(controls);

        //insert new value display for time to next bias
        newValue(controls, "Time to next bias: ", "timeToNextBias");
        newLine(controls);
        newValue(controls, "Top vinegar loss: ", "topVinegarLoss");
        newLine(controls);
        newValue(controls, "Highest Multi: ", "highestMulti");
        newLine(controls);
        newValue(controls, "Highest Bias: ", "highestBias");

        //next line
        newLine(controls);


        //Toggle box for follow me on ladder
        var followMe = document.createElement("input");
        followMe.type = "checkbox";
        followMe.id = "followMe";
        followMe.checked = true;
        controls.appendChild(followMe);

        //label for follow me
        var followMeLabel = document.createElement("label");
        followMeLabel.htmlFor = "followMe";
        followMeLabel.innerHTML = "Follow me on ladder";
        followMeLabel.id = "followMeLabel";
        controls.appendChild(followMeLabel);

        window.controlsInserted = true;
    }

    insertControls();
    window.idToFollow = -1;

    //..........Custom Row Colours
    let yourRankerCol = "#dea6de"     //You
    let promotedCol = "#a9a9a9"     //Promoted
    let youNeverCatchThemCol = "#ff8985"     //You Never Catch Them
    let youCanCatchThemCol = "#94f099"     //You Catch Them
    let theyCanCatchYouCol = "#fbc689"     //They Catch You
    let theyNeverCatchYouCol = "#9ce3e8"     //They Never Catch You

    window.originalWriteNewRow = window.writeNewRow;
    window.lynnsWriteNewRow = function(body, ranker) {
        let row = body.insertRow();
        row.id = "ranker-" + ranker.accountId;
        const myAcc = getAcc(ladderData.yourRanker);
        const theirAcc = getAcc(ranker);
        const a = (theirAcc - myAcc) * 0.5;
        const b = (ranker.growing ? ranker.power : 0) - ladderData.yourRanker.power;
        const c = ranker.points - ladderData.yourRanker.points;

        let timeLeft = solveQuadratic(a, b, c);
        timeLeft = secondsToHms(timeLeft);

        if (timeLeft == '') {
            timeLeft = "Never";
        }

        const pointsToFirst = ladderData.firstRanker.points.sub(ranker.points);
        const firstPowerDifference = ranker.power - (ladderData.firstRanker.growing ? ladderData.firstRanker.power : 0);
        const pointsLeftPromote = infoData.pointsForPromote.mul(ladderData.currentLadder.number)
 - ranker.points;
        let timeToFirst = "";
        if (ladderData.firstRanker.points.lessThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
)) {
            // Time to reach minimum promotion points of the ladder
            timeToFirst = 'L' + secondsToHms(solveQuadratic(theirAcc/2, ranker.power, -pointsLeftPromote));
        } else {
            // time to reach first ranker
            timeToFirst =  secondsToHms(solveQuadratic(theirAcc/2, firstPowerDifference, -pointsToFirst));
        }

        if (!ranker.growing || (ranker.rank === 1 && ladderData.firstRanker.points.greaterThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
))) timeToFirst = "";

        if (ladderData.yourRanker.rank == ranker.rank) {
            timeLeft = "";
        }

        let assholeTag = (ranker.timesAsshole < infoData.assholeTags.length) ?
            infoData.assholeTags[ranker.timesAsshole] : infoData.assholeTags[infoData.assholeTags.length - 1];
        let rank = (ranker.rank === 1 && !ranker.you && ranker.growing && ladderData.rankers.length >= Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number) &&
                    ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)
) >= 0 && ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) ?
            '<a href="#" style="text-decoration: none" onclick="throwVinegar(event)">🍇</a>' : ranker.rank;

        let multiPrice = ""
        if ((ranker.rank === 1 && ranker.growing) && qolOptions.multiLeader[$("#leadermultimode")[0].value]) {
            multiPrice = qolOptions.multiLeader[$("#leadermultimode")[0].value]
                .replace("NUMBER",`${numberFormatter.format(Math.pow(ladderData.currentLadder.number+1, ranker.multiplier+1))}`)
                .replace("STATUS", `${(ranker.power >= Math.pow(ladderData.currentLadder.number+1, ranker.multiplier+1)) ? "🟩" : "🟥"}`)
        }
        row.insertCell(0).innerHTML = rank + " " + assholeTag;
        row.insertCell(1).innerHTML = `[+${ranker.bias.toString().padStart(2,"0")} x${ranker.multiplier.toString().padStart(2,"0")}]`;
        row.insertCell(2).innerHTML = `<a onclick="window.idToFollow = ${ranker.accountId}">${ranker.username}</a>`;
        row.cells[2].style.overflow = "hidden";
        row.insertCell(3).innerHTML = `${multiPrice} ${numberFormatter.format(ranker.power)} ${ranker.growing ? ranker.rank != 1 ? "(+" + numberFormatter.format((ranker.rank - 1 + ranker.bias) * ranker.multiplier) + ")" : "" : "(Promoted)"}`;
        row.cells[3].classList.add('text-end');
        row.insertCell(4).innerHTML = timeToFirst;
        row.cells[4].classList.add('text-end');
        row.insertCell(5).innerHTML = timeLeft;
        row.cells[5].classList.add('text-end');
        row.insertCell(6).innerHTML = `${numberFormatter.format(ranker.points)}`;
        row.cells[6].classList.add('text-end');

        if (ranker.you) {
            row.classList.add('table-active');
            row.style['background-color'] = yourRankerCol;
        } else if (!ranker.growing) {
            row.style['background-color'] = promotedCol;
        } else if ((ranker.rank < ladderData.yourRanker.rank && timeLeft == 'Never - ')) {
            row.style['background-color'] = youNeverCatchThemCol;
        } else if ((ranker.rank < ladderData.yourRanker.rank && timeLeft != 'Never - ')) {
            row.style['background-color'] = youCanCatchThemCol;
        } else if ((ranker.rank > ladderData.yourRanker.rank && timeLeft != 'Never - ')) {
            row.style['background-color'] = theyCanCatchYouCol;
        } else if ((ranker.rank > ladderData.yourRanker.rank && timeLeft == 'Never - ')) {
            row.style['background-color'] = theyNeverCatchYouCol;
        }
    }


    let oldUpdateLadder = updateLadder;
    window.updateLadder = ()=>{

        if($("#useLynnsLadderCode")[0].checked) {
            window.writeNewRow = window.lynnsWriteNewRow;
        }
        else {
            window.writeNewRow = window.originalWriteNewRow;
        }

        oldUpdateLadder();

        displayLadderNavigation();
        if(window.chatNavDisplayed !== "yes")
        {
            window.chatNavDisplayed = "yes";
            displayChatNavigation();
        }
        infoText.style.height = "70px";

        if(window.idToFollow == -1 && ladderData.yourRanker.accountId > 0) {
            window.idToFollow = ladderData.yourRanker.accountId;
        }

        var myPoints = ladderData.yourRanker.points;
        var myPower = ladderData.yourRanker.power;

        if(window.lastPoints)
        {
            var change = myPoints - window.lastPoints;
            var changePower = myPower - window.lastPower;
            //round to 2 decimal places
            change = Math.round(change * 100) / 100;
            changePower = Math.round(changePower * 100) / 100;

            var costOfMulti = getUpgradeCost(ladderData.yourRanker.multiplier + 1);
            var costOfBias = getUpgradeCost(ladderData.yourRanker.bias + 1);

            var ticksToNextMulti = Math.ceil((costOfMulti - myPower) / changePower);
            var ticksToNextBias = Math.ceil((costOfBias - myPoints) / change);

            //clamp to 0
            ticksToNextMulti = Math.max(0, ticksToNextMulti);
            ticksToNextBias = Math.max(0, ticksToNextBias);

            var ticksToNextMultiString = secondsToHms(ticksToNextMulti);
            var ticksToNextBiasString = secondsToHms(ticksToNextBias);

            if(window.controlsInserted)
            {
                $("#timeToNextMulti")[0].innerHTML = ticksToNextMultiString;
                $("#timeToNextBias")[0].innerHTML = ticksToNextBiasString;

                //color the text
                {
                    if(ticksToNextMulti == 0)
                    {
                        $("#timeToNextMulti")[0].style.color = "green";
                    }
                    else if(ticksToNextMulti < 10)
                    {
                        $("#timeToNextMulti")[0].style.color = "orange";
                    }
                    else
                    {
                        $("#timeToNextMulti")[0].style.color = "red";
                    }
                    if(ticksToNextBias == 0)
                    {
                        $("#timeToNextBias")[0].style.color = "green";
                    }
                    else if(ticksToNextBias < 10)
                    {
                        $("#timeToNextBias")[0].style.color = "orange";
                    }
                    else
                    {
                        $("#timeToNextBias")[0].style.color = "red";
                    }
                }
                //check if we want to follow me on the ladder
                if($("#followMe")[0].checked && $(".ladder-container")[0])
                {
                    var followedRanker = $("#ranker-" + window.idToFollow)[0];
                    if(followedRanker)
                    {
                        //scroll ladder-container to your ranker minus half the height of the ladder-container
                        $(".ladder-container")[0].scrollTop = followedRanker.offsetTop - $(".ladder-container")[0].offsetHeight/2;
                    }
                }
                try{

                    $("#followMeLabel")[0].innerHTML = "Follow " + ladderData.rankers.find((ranker)=> {return ranker.accountId == window.idToFollow}).username + " (" + window.idToFollow + ")";
                }catch(e){
                    $("#followMeLabel")[0].innerHTML = "Follow " + window.idToFollow;
                }
            }
        }
        window.lastPoints = myPoints;
        window.lastPower = myPower;

        //Update stats for the top ranker
        let vinDecay = 0.9975;

        if(window.topRankerID != ladderData.rankers[0].accountId || isNaN(window.topRankerTickCount))
        {
            window.topRankerTickCount = -1;
            window.topRankerID = ladderData.rankers[0].accountId;
        }
        window.topRankerTickCount++;

        if(ladderData.currentLadder.number == 1 || true /** TODO: Remove the true in next round */)
        {

            let vinLoss = Math.pow(vinDecay, window.topRankerTickCount);
            $("#topVinegarLoss")[0].innerHTML = ((1-vinLoss) * 100).toFixed(2) + "%";
            //color the text red if the loss is 0% and green if it is 100% with a smooth transition
            var hue=((1-vinLoss)*100).toString(10);
            var color = ["hsl(",hue,",50%,50%)"].join("");
            $("#topVinegarLoss")[0].style.color = color;
        }
        else
        {
            $("#topVinegarLoss")[0].style.color = "black";
            $("#topVinegarLoss")[0].innerHTML = "No decay in ladder > 1";
        }

        //calculate the top bias and multi excluding your own
        let topBias = 0;
        let topMulti = 0;
        for(let i = 1; i < ladderData.rankers.length; i++)
        {
            if(ladderData.rankers[i].accountId == ladderData.yourRanker.accountId)
                continue;
            topBias = Math.max(topBias, ladderData.rankers[i].bias);
            topMulti = Math.max(topMulti, ladderData.rankers[i].multiplier);
        }

        $("#highestBias")[0].innerHTML = `${topBias.toFixed(0)} (Yours: ${ladderData.yourRanker.bias.toFixed(0)})`;
        $("#highestMulti")[0].innerHTML = `${topMulti.toFixed(0)} (Yours: ${ladderData.yourRanker.multiplier.toFixed(0)})`;

    };


    //wait until we know our username
    while (ladderData.yourRanker.username == "") {
        await sleep(100);
    }

    subscribeToDomNode("invertChad", updateChat);
    subscribeToDomNode("scrollableChad", expandChat);
    subscribeToDomNode("highlightMentions", updateChat);


    updateChat();
    expandChat();

    if(window.lynnsMods == undefined)
    {
        window.lynnsMods = [
            "Base",
        ];
    }
})();