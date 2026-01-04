// ==UserScript==
// @name         OnlyEncodes BON Giveaway
// @description  BON Givaway for UNIT3D Chat
// @version      1
// @namespace    http://tampermonkey.net/
// @icon         https://onlyencodes.cc/favicon.ico
// @match        https://onlyencodes.cc/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485270/OnlyEncodes%20BON%20Giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/485270/OnlyEncodes%20BON%20Giveaway.meta.js
// ==/UserScript==

//GET RID OF MOST OF THE JAVASCRIPT IN FAVOR OF HTML
//ALLOW NUMBER OF REMINDERS TO BE SET
//COUNTODWN TIMER LOSES 1 SECOND EVERY 15 SECONDS
//INCLUSIVE NUMBERS NOT WORKING?
//FIGURE OUT HOW TO SPLIT ENTRIES
//TIEBREAKS
//2ND AND 3RD?

const chatboxID = "chat-message";
const chatbox = document.querySelector(`#${chatboxID}`);
const enterKey = new KeyboardEvent("keydown", { keyCode: 13 });

var numberEntries = new Map();
var chatLog = [];
var fancyNames = new Map();
var regNum = /^-?\d+$/;
var countdownTimerID;
var giveawayTimerID;
var reminderTimerID;

var whitespace = document.createTextNode("\u00A0");

var coinsIcon = document.createElement("i");
    coinsIcon.setAttribute("class", "fas fa-coins");

var goldCoins = document.createElement("i");
    goldCoins.setAttribute("class", "fas fa-coins");
    goldCoins.style.color = "#ffc00a";
    goldCoins.style.padding = "5px";

var giveawayBTN = document.createElement("a");
    giveawayBTN.setAttribute("class", "form__button form__button--text");
    giveawayBTN.textContent = "Giveaway";
    giveawayBTN.prepend(coinsIcon.cloneNode(false));
    giveawayBTN.onclick = giveawayMenu;

var giveawayFrame = document.createElement("section");
    giveawayFrame.id = "giveawayFrame";
    giveawayFrame.setAttribute("class", "panelV2");
    giveawayFrame.style.width = "450px";
    giveawayFrame.style.height = "90%";
    giveawayFrame.style.position = "fixed";
    giveawayFrame.style.zIndex = "9999";
    giveawayFrame.style.inset = "50px 150px auto auto";
    giveawayFrame.style.overflow = "auto";
    giveawayFrame.style.borderStyle = "solid";
    giveawayFrame.style.borderWidth = "1px";
    giveawayFrame.style.borderColor = "black";

var giveawayTitle = document.createElement("h4");
    giveawayTitle.setAttribute("class", "panel__heading");
    giveawayTitle.textContent = "Giveaway Menu";
    var giveawayIcon = coinsIcon.cloneNode(false);
        giveawayIcon.style.padding = "5px";
    giveawayTitle.prepend(giveawayIcon);

var resetButton = document.createElement("button");
    resetButton.setAttribute("class", "form__button form__button--text");
    resetButton.textContent = "Reset";
    resetButton.onclick = resetGiveaway;

var closeButton = document.createElement("button");
    closeButton.setAttribute("class", "form__button form__button--text");
    closeButton.textContent = "Close";
    closeButton.onclick = giveawayMenu;

var buttonLeft = document.createElement("div");
    buttonLeft.setAttribute("class", "button-left");
    buttonLeft.append(giveawayTitle);

var buttonRight = document.createElement("div");
    buttonRight.setAttribute("class", "button-right");
    buttonRight.append(resetButton);
    buttonRight.append(closeButton);

var buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "button-holder no-space");
    buttonHolder.append(buttonLeft);
    buttonHolder.append(buttonRight);

var giveawayHeader = document.createElement("header");
    giveawayHeader.setAttribute("class", "panel__heading");
    giveawayHeader.append(buttonHolder);

var coinHeader = document.createElement("h1");
    coinHeader.setAttribute("class", "panel__heading--centered");
    coinHeader.textContent = document.getElementsByClassName("ratio-bar__points")[0].firstElementChild.textContent.trim();
    coinHeader.prepend(goldCoins.cloneNode(false));

var coinInput = document.createElement("input");
    coinInput.setAttribute("class", "form__text");
    coinInput.setAttribute("required", "");
    coinInput.id = "giveawayAmount";
    coinInput.inputmode = "numeric";
    coinInput.pattern = "[0-9]*";
    coinInput.placeholder = " ";
    coinInput.type = "text";

var coinLabel = document.createElement("label");
    coinLabel.setAttribute("class", "form__label form__label--floating");
    coinLabel.htmlFor = "giveawayAmount";
    coinLabel.textContent = "Giveaway Amount";

var coinContainer = document.createElement("p");
    coinContainer.setAttribute("class", "form__group");
    coinContainer.style.maxWidth = "50%";
    coinContainer.append(coinInput);
    coinContainer.append(coinLabel);

var startButton = document.createElement("button");
    startButton.setAttribute("class", "form__button form__button--filled");
    startButton.textContent = "Start";
    startButton.onclick = startGiveaway;

var buttonContainer = document.createElement("p");
    buttonContainer.setAttribute("class", "form__group");
    buttonContainer.style.textAlign = "center";
    buttonContainer.append(startButton);

var startInput = document.createElement("input");
    startInput.setAttribute("class", "form__text");
    startInput.setAttribute("required", "");
    startInput.id = "startNum";
    startInput.inputmode = "numeric";
    startInput.pattern = "-?[0-9]*";
    startInput.placeholder = " ";
    startInput.type = "text";
    startInput.value = "1";

var startLabel = document.createElement("label");
    startLabel.setAttribute("class", "form__label form__label--floating");
    startLabel.htmlFor = "startNum";
    startLabel.textContent = "Start #";

var endInput = document.createElement("input");
    endInput.setAttribute("class", "form__text");
    endInput.setAttribute("required", "");
    endInput.id = "endNum";
    endInput.inputmode = "numeric";
    endInput.pattern = "-?[0-9]*";
    endInput.placeholder = " ";
    endInput.type = "text";
    endInput.value = "50";

var endLabel = document.createElement("label");
    endLabel.setAttribute("class", "form__label form__label--floating");
    endLabel.htmlFor = "endNum";
    endLabel.textContent = "End #";

var startContainer = document.createElement("p");
    startContainer.setAttribute("class", "form__group");
    startContainer.style.width = "35%";
    startContainer.append(startInput);
    startContainer.append(startLabel);

var endContainer = document.createElement("p");
    endContainer.setAttribute("class", "form__group");
    endContainer.style.width = "35%";
    endContainer.append(endInput);
    endContainer.append(endLabel);

var intervalDiv = document.createElement("div");
    intervalDiv.setAttribute("class", "panel__body");
    intervalDiv.style.display = "flex";
    intervalDiv.style.flexFlow = "column";
    intervalDiv.style.alignItems = "center";
    intervalDiv.textContent = "to";
    intervalDiv.prepend(startContainer);
    intervalDiv.append(endContainer);

var timerInput = document.createElement("input");
    timerInput.setAttribute("class", "form__text");
    timerInput.setAttribute("required", "");
    timerInput.id = "timerNum";
    timerInput.inputmode = "numeric";
    timerInput.pattern = "[0-9]*";
    timerInput.placeholder = " ";
    timerInput.type = "text";
    timerInput.value = "15";

var timerLabel = document.createElement("label");
    timerLabel.setAttribute("class", "form__label form__label--floating");
    timerLabel.htmlFor = "timerNum";
    timerLabel.textContent = "Time (minutes)";

var timerContainer = document.createElement("p");
    timerContainer.setAttribute("class", "form__group");
    timerContainer.style.width = "35%";
    timerContainer.append(timerInput);
    timerContainer.append(timerLabel);

var countdownHeader = document.createElement("h2");
    countdownHeader.setAttribute("class", "panel__heading--centered");
    countdownHeader.hidden = true;

var entriesTable = document.createElement("table");
    entriesTable.setAttribute("class", "data-table");
    entriesTable.innerHTML = "<thead><tr><th>User</th><th>Entry #</th></tr></thead><tbody></tbody>";

var entriesWrapper = document.createElement("div");
    entriesWrapper.setAttribute("class", "data-table-wrapper");
    entriesWrapper.append(entriesTable);
    entriesWrapper.hidden = true;

var entryForm = document.createElement("form");
    entryForm.setAttribute("class", "form");
    entryForm.id = "entryForm";
    entryForm.style.display = "flex";
    entryForm.style.flexFlow = "column";
    entryForm.style.alignItems = "center";
    entryForm.append(coinContainer);
    entryForm.append(intervalDiv);
    entryForm.append(timerContainer);
    entryForm.append(buttonContainer);

var frameBody = document.createElement("div");
    frameBody.setAttribute("class", "panel__body");
    frameBody.append(coinHeader);
    frameBody.append(entryForm);
    frameBody.append(countdownHeader);
    frameBody.append(entriesWrapper);

giveawayFrame.append(giveawayHeader);
giveawayFrame.append(frameBody);

document.getElementsByClassName("button-right")[0].prepend(giveawayBTN);
giveawayBTN.parentNode.insertBefore(whitespace, giveawayBTN.nextSibling)

function giveawayMenu() {
    if (document.body.contains(giveawayFrame)) {
        document.body.removeChild(giveawayFrame)
    } else {
        document.body.prepend(giveawayFrame)
    };
};

function startGiveaway() {
    if (!entryForm[0].checkValidity() || !entryForm[1].checkValidity() || !entryForm[2].checkValidity() || !entryForm[3].checkValidity()) {
        return
    };

    startButton.disabled = true;
    coinInput.disabled   = true;
    startInput.disabled  = true;
    endInput.disabled    = true;
    timerInput.disabled  = true;

    var totalTime = timerInput.value * 60000;

    var giveawayAmount = coinInput.value;

    var startNum = startInput.value;

    var endNum = endInput.value;

    var winningNumber = getRandomInt(startNum, endNum);

    var introMessage  = `I am hosting a giveaway for [b][color=#ffc00a]${giveawayAmount} BON[/color][/b]. `;
        introMessage += `Entries will be open for [b][color=green]${totalTime / 60000} minutes[/color][/b]. `;
        introMessage += `You may enter by submitting a whole number [b]between [color=red]${startNum} and ${endNum}[/color] inclusive[/b].`;
    sendMessage(chatbox, enterKey, introMessage);

    var startTime = new Date().getTime()

    checkMessages(startNum, endNum)

    countdownTimer(totalTime, countdownHeader)

    giveawayTimerID = setInterval(function () {
        if (new Date().getTime() - startTime > totalTime) {
            clearInterval(giveawayTimerID)
            checkMessages(startNum, endNum)
            endGiveaway(winningNumber, giveawayAmount)
            return;
        }
        checkMessages(startNum, endNum)
    }, 5000)

    reminderTimer(totalTime, startTime, giveawayAmount, startNum, endNum)

    return false;
}

//REVAMP MESSAGE HANDLING
function checkMessages(startNum, endNum) {
    var messageList = document.getElementsByClassName("messages")[0].firstChild.childNodes
    if (chatLog === undefined || chatLog.length == 0) {
        messageList.forEach((listMessage) => {
            var author = listMessage.childNodes[2].firstChild.textContent.trim()
            var messageContent = listMessage.lastChild.firstChild.textContent

            chatLog.push(`${author}:${messageContent}`)
        })
    }
    messageList.forEach((listMessage) => {
        var author = listMessage.childNodes[2].firstChild.textContent.trim()
        var messageContent = listMessage.lastChild.firstChild.textContent
        var fancyName = listMessage.childNodes[2].childNodes[0].outerHTML

        if (regNum.test(messageContent)) {
            if (chatLog.includes(`${author}:${messageContent}`)) {
                return;
            }

            if (parseInt(messageContent) <= parseInt(startNum) || parseInt(messageContent) >= parseInt(endNum)) {
                return;
            }

            var guesses = [...numberEntries.values()]

            if (guesses.includes(messageContent)) {
                return;
            }

            if (!numberEntries.has(author)) {
                numberEntries.set(author, messageContent)
                fancyNames.set(author, fancyName)
            }
        }
    })

    updateEntries()
}

function updateEntries() {
    entriesWrapper.hidden = false
    let tableStart = "<thead><tr><th>User</th><th>Entry #</th></tr></thead><tbody>"
    let tableEntries = ""
    let tableEnd = "</tbody>"
    numberEntries.forEach((entry, author) => {
        fancyName = fancyNames.get(author)
        tableEntries += `<tr><td id="1">${fancyName}</td><td>${entry}</td></tr>`
    })
    entriesTable.innerHTML = tableStart + tableEntries + tableEnd
}

function endGiveaway(winningNumber, giveawayAmount) {
    clearInterval(countdownTimerID)

    var bestGuess = Number.MAX_VALUE
    var entryAuthor
    numberEntries.forEach((entry, author) => {
        if (Math.abs(winningNumber - bestGuess) > Math.abs(winningNumber - entry)) {
            bestGuess = entry
            entryAuthor = author
        }
    })

    if (bestGuess == winningNumber) {
        var winMessage = `With a guess of [color=green][b]${bestGuess}[/b][/color] hitting the winning number exactly, [color=red][b]${entryAuthor}[/b][/color] has won [color=#ffc00a][b]${giveawayAmount} BON[/b][/color]!`
        sendMessage(chatbox, enterKey, winMessage)
    } else {
        var winMessage = `With a guess of [color=green][b]${bestGuess}[/b][/color] only [color=green][b]${Math.abs(winningNumber - bestGuess)}[/b][/color] away from the winning number [color=green][b]${winningNumber}[/b][/color], [color=red][b]${entryAuthor}[/b][/color] has won [color=#ffc00a][b]${giveawayAmount} BON[/b][/color]!`
        sendMessage(chatbox, enterKey, winMessage)
    }

    var giftMessage = `/gift ${entryAuthor} ${giveawayAmount} Congratulations!`

    sendMessage(chatbox, enterKey, giftMessage)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function countdownTimer(duration, display) {
    display.hidden = false
    var timer = duration / 1000, minutes, seconds
    countdownTimerID = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 0 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        display.textContent = minutes + ":" + seconds

        if (--timer < 0) {
            timer = duration
        }
    }, 1000)
}

function reminderTimer(duration, startTime, giveawayAmount, startNum, endNum) {
    var reminderSplit = (duration / 4) + 100
    var remainingTime = duration

    reminderTimerID = setInterval(function () {
        if (new Date().getTime() - startTime > duration) {
            clearInterval(reminderTimerID)
            return;
        }

        remainingTime -= reminderSplit

        var reminderMessage = `There is an ongoing giveaway for [b][color=#ffc00a]${giveawayAmount} BON[/color][/b]. There are [b][color=green]${(remainingTime / 60000).toFixed(2)} minutes[/color][/b] remaining. You may enter by submitting a whole number [b]between [color=red]${startNum} and ${endNum}[/color] inclusive[/b].`
        sendMessage(chatbox, enterKey, reminderMessage)
    }, reminderSplit)
}


function sendMessage(chatbox, enterKey, messageStr) {
    chatbox.value = messageStr
    chatbox.dispatchEvent(enterKey)
}

function resetGiveaway() {
    numberEntries = new Map()
    chatLog = []
    fancyNames = new Map()

    entriesWrapper.hidden = true
    countdownHeader.hidden = true

    startButton.disabled = false
    coinInput.disabled = false
    startInput.disabled = false
    endInput.disabled = false
    timerInput.disabled = false

    clearInterval(countdownTimerID)
    clearInterval(giveawayTimerID)
    clearInterval(reminderTimerID)
}