// ==UserScript==
// @name         Trello mods
// @namespace    sami@kankaristo.fi
// @version      1.0.3
// @description  Trello modifications.
// @author       sami@kankaristo.fi
// @match        https://trello.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/425354/Trello%20mods.user.js
// @updateURL https://update.greasyfork.org/scripts/425354/Trello%20mods.meta.js
// ==/UserScript==


Util.LOGGING_ID = "Trello mods";
Util.SetMinimumLoggingLevel("WARN");

Util.URL_OPEN_LIMIT = 20;

var fullUrlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,7}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
var partialUrlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,7}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
var ignoreUrlRegex = /([Vv]erkkokauppa.com)([^/]|$)/g;
var videoIdRegex = /[^a-zA-Z0-9_-]([a-zA-Z0-9_-]{11})[^a-zA-Z0-9_-]/g;
var plainVideoIdRegex = /([a-zA-Z0-9_-]{11})/;
var probablyNotVideoIdRegex = /([a-z]{11}|[A-Z]{11}|[A-Z][a-z]{10})/g;

var canvas = null;
var ctx = null;

var topLeft = null;

var allConnectionsDrawn = false;

var urlShortIdRegex = /\/c\/[0-9a-zA-Z]+\/(\d+)\-/;

const BADGE_TEXT_CLASS = "tcc-badge-text";

const BADGE_TEXT_STYLES = `
.${BADGE_TEXT_CLASS}_parent {
    background-color: #666666;
    border: 1px solid black;
    color: white;
    font-weight: bold;
}
.${BADGE_TEXT_CLASS}_project {
    background-color: #333333;
    border: 1px solid black;
    color: white;
    font-weight: bold;
}
.${BADGE_TEXT_CLASS}_outcome {
    background-color: rgba(255, 110, 199, 0.3);
}
.${BADGE_TEXT_CLASS}_updated {
    background-color: rgba(0, 255, 0, 0.2);
}
.${BADGE_TEXT_CLASS}_blockedby {
    background-color: #bf0000;
    color: white;
    font-weight: bold;
}
.${BADGE_TEXT_CLASS}_related {
    background-color: #585858;
    color: black;
}
.${BADGE_TEXT_CLASS}_tracking {
    background-color: #008ea5;
    color: white;
}
.${BADGE_TEXT_CLASS}_order {
    background-color: lightgray;
    color: black;
}
`;

const LINE_COLORS = {
    default:    "#cccccc",
    
    parent:     "#111111",
    
    project:     "#111111",
    
    blockedby:  "#dd1010",
    
    related:    "#999999",
};

var listCardCounts = {};
var loading = true;

function xRel(x) {
    return (x * canvas.width);
}
function yRel(y) {
    return (y * canvas.height);
}
function rel(x, y) {
    return {
        x: xRel(x),
        y: yRel(y)
    };
}


///
/// Add event listener to all cards.
///
function AddListenerToCards() {
    //Util.Log("AddListenerToCards()");
    
    var cards = document.getElementsByClassName("list-card");
    
    for (var i = 0; i < cards.length; ++i) {
        var card = cards[i];
        
        card.addEventListener(
            "click",
            CardClickListener,
            true
        );
        card.addEventListener(
            "auxclick",
            CardClickListener,
            true
        );
        card.addEventListener(
            "contextmenu",
            CardClickListener,
            true
        );
    }
    
    setTimeout(
        AddListenerToCards,
        2500
    );
}


///
/// Add text to a card.
///
async function AddTextToCard(card, swapExisting) {
    Util.Log("AddTextToCard()");
    Util.Log("Clicked card:   ", card);
    Util.Log("Swap existing:  ", swapExisting);
    
    var clickEvent = document.createEvent("Events");
    clickEvent.initEvent("click", true, false);
    
    var newText;
    
    var cardComposer = document.getElementsByClassName("list-card-composer-textarea")[0];
    Util.Log("Card composer: ", cardComposer);
    if ((cardComposer == null) || (cardComposer.offsetParent === null)) {
        Util.Log("Card composer not found or it's hidden, getting text from clipboard");
        
        newText = await navigator.clipboard.readText();
    }
    else {
        // "Prefer" text from the card composer
        newText = cardComposer.value;
        
        // Clear the card composer
        // This should work, but Trello is doing something strange to break it
        //cardComposer.value = "";
        // ...so, let's click the cancel button instead (which clears the card composer)
        document.getElementsByClassName("js-cancel")[0].dispatchEvent(clickEvent);
    }
    
    Util.Log("New text: ", newText);
    
    var videoId = newText.match(plainVideoIdRegex);
    if (videoId && (videoId[0] == newText)) {
        Util.Log("Appending 'youtu.be/' to video ID");
        newText = "youtu.be/" + newText;
        Util.Log("New text: ", newText);
    }
    
    if (newText == "") {
        Util.Log("New text is empty");
        
        return;
    }
    
    // Click the card (to open it)
    card.dispatchEvent(clickEvent);
    
    // Click the edit button
    var editButton = document.querySelector(".js-edit-desc");
    editButton.dispatchEvent(clickEvent);
    
    // Get the card details textarea
    var cardEditBox = document.querySelector("textarea.description");
    
    // Get the current text
    var cardEditText = cardEditBox.value;
    
    if (cardEditText.indexOf(newText) != -1) {
        Util.Log("Text already added, not adding again");
        
        return;
    }
    
    var insertPosition = cardEditText.indexOf("-----");
    var hasDashes = (insertPosition != -1);
    Util.Log("insertPosition: ", insertPosition);
    Util.Log("hasDashes:      ", hasDashes);
    
    if (!hasDashes) {
        cardEditText = "\n-----\n\n" + cardEditText;
        insertPosition = 0;
    }
    
    while (insertPosition > 0) {
        var previousChar = cardEditText[insertPosition - 1];
        Util.Log("previousChar @ " + (insertPosition - 1) + ": ", previousChar);
        if (previousChar == '\n') {
            --insertPosition;
        }
        else {
            ++insertPosition;
            
            break;
        }
    }
    
    Util.Log("insertPosition: ", insertPosition);
    cardEditText = (
        cardEditText.slice(0, insertPosition)
        + newText + "\n"
        + cardEditText.slice(insertPosition)
    );
    
    // Only logging stuff...
    var logCutoffPosition;
    {
        Util.logCutoffPosition = insertPosition + newText.length + 100;
        Util.logCutoffPosition = logCutoffPosition + cardEditText.slice(logCutoffPosition).indexOf("\n");
        logCutoffPosition = Math.max(100, logCutoffPosition);
        Util.Log(cardEditText.slice(0, logCutoffPosition) + "\n...");
    }
    
    if (swapExisting) {
        Util.Log("Swap one existing line after '-----'");
        
        var removePosition = cardEditText.indexOf("-----") + 5;
        
        while (removePosition < cardEditText.length) {
            var nextChar = cardEditText[removePosition + 1];
            Util.Log("nextChar @ " + (removePosition + 1) + ": ", nextChar);
            if (nextChar == '\n') {
                ++removePosition;
            }
            else {
                var textAfterRemovePosition = cardEditText.slice(removePosition + 1);
                if (textAfterRemovePosition.search(/\d+ videos/) == 0) {
                    Util.Log("Skipping /\d+ videos/ line");
                    var lineLength = textAfterRemovePosition.indexOf("\n");
                    if (lineLength != -1) {
                        removePosition += lineLength;
                        
                        continue;
                    }
                }
                
                ++removePosition;
                
                break;
            }
        }
        
        Util.Log("removePosition: ", removePosition);
        var removeLength = cardEditText.slice(removePosition + 1).indexOf("\n");
        if (removeLength == -1) {
            Util.Log("Couldn't find next newline");
            
            return;
        }
        
        removeLength += 1;
        Util.Log("removeLength: ", removeLength);
        
        var textToRemove = cardEditText.slice(removePosition, removePosition + removeLength);
        Util.Log("textToRemove: ", textToRemove);
        
        var urlOpened = OpenCardURL(textToRemove);
        
        if (!urlOpened) {
            Util.Log("Couldn't open URL from removed text, not removing");
        }
        else {
            cardEditText = (
                cardEditText.slice(0, removePosition - 1)
                + cardEditText.slice(removePosition + removeLength)
            );
            
            // Only logging stuff...
            {
                logCutoffPosition = removePosition + removeLength + 100;
                logCutoffPosition = logCutoffPosition + cardEditText.slice(logCutoffPosition).indexOf("\n");
                logCutoffPosition = Math.max(100, logCutoffPosition);
                Util.Log(cardEditText.slice(0, logCutoffPosition) + "\n...");
            }
        }
    }
    
    // Insert new text
    cardEditBox.value = cardEditText;
    
    // Click save button(s)
    var saveButtons = document.getElementsByClassName("js-save-edit");
    for (var i = 0; i < saveButtons.length; ++i) {
        var saveButton = saveButtons[i];
        if (saveButton.offsetParent !== null) {
            saveButton.dispatchEvent(clickEvent);
        }
    }
    
    // Check if the card has the yellow label
    var labelsList = document.getElementsByClassName("js-card-detail-labels-list")[0];
    var yellowLabel = labelsList.querySelector(":scope > .card-label-yellow");
    
    if (yellowLabel == null) {
        // Click the edit labels button
        var editLabelsButton = document.getElementsByClassName("js-edit-labels")[0];
        editLabelsButton.dispatchEvent(clickEvent);
        
        // Click the yellow label button (if yellow label not already there)
        var labelsPopOver = document.getElementsByClassName("edit-labels-pop-over")[0];
        for (i = 0; i < labelsPopOver.childNodes.length; ++i) {
            var labelButton = labelsPopOver.childNodes[i].querySelector(":scope > .card-label");
            if (labelButton.classList.contains("card-label-yellow")) {
                labelButton.dispatchEvent(clickEvent);
                
                break;
            }
        }
        
        var popOverCloseButton = document.getElementsByClassName("pop-over-header-close-btn")[0];
        popOverCloseButton.dispatchEvent(clickEvent);
    }
    
    // Click dialog close button
    //var closeButton = document.getElementsByClassName("js-close-window")[0];
    //closeButton.dispatchEvent(clickEvent);
}


async function BadgeClick(event) {
    Util.Log("NOTE", "BadgeClick()", event);
    
    var badge = event.srcElement;
    
    var card = null;
    
    var badgeText = badge.textContent.split(": ");
    var badgeName = badgeText[0].trim();
    Util.Log("INFO", "Badge name: ", badgeName);
    var url = badgeText[1].trim();
    Util.Log("INFO", "URL: ", url);
    Util.Log("INFO", "Button: ", event.button);
    
    if ((event.button == 1) || (event.button == 2)) {
        // Middle or right click
        
        var shortId = ParseIdFromUrl(url);
        
        card = GetCardById(shortId);
        
        if (card != null) {
            card.dispatchEvent(Util.CreateClickEvent());
        }
        else {
            // Archived card, card on different board, or non-card URL
            
            if (event.button == 1) {
                // Middle click, open in new tab
                GM_openInTab(url, true);
            }
            else {
                // Left click, open in current tab
                window.location.href = url;
            }
        }
    }
    else {
        // Other click (probably left click)
        
        // Copy URL to clipboard
        navigator.clipboard.writeText(url);
        
        if (event.shiftKey) {
            // Also clear the field
            
            card = GetCardUnderMouse();
            
            if (card != null) {
                card.dispatchEvent(Util.CreateClickEvent());
                
                var input = await GetCustomFieldInput(badgeName);
                
                Util.Log("NOTE", "Clearing badge: ", badgeName);
                
                input.value = "";
                
                // This is a hack to simulate user input, so the value is saved
                input.select();
                
                var closeButton = document.querySelector(".dialog-close-button");
                
                if (closeButton != null) {
                    closeButton.dispatchEvent(Util.CreateClickEvent());
                }
            }
        }
    }
    
    event.stopPropagation();
    event.preventDefault();
}


function BadgeMouseOver(event) {
    //Util.Log("BadgeMouseOver()", event);
    
    if (allConnectionsDrawn) {
        return;
    }
    
    var badge = event.srcElement;
    
    //Util.Log("ID: ", ParseIdFromUrl(badge.textContent.split(": ")[1]));
    
    ResizeCanvas();
    DrawConnectionForBadge(badge);
}


function BadgeMouseOut(event) {
    //Util.Log("BadgeMouseOut()", event);
    
    if (allConnectionsDrawn) {
        return;
    }
    
    ClearCanvas();
}


///
/// Card click listener function.
///
function CardClickListener(event) {
    var cardDetails = null;
    var clickedCard = null;
    
    Util.Log(event);
    
    if (event.altKey || event.ctrlKey || (event.button == 1) || (event.button == 2)) {
        Util.Log("Caught event: ", event);
        
        Util.ResetOpenedUrlCounter();
        
        for (var i = 0; i < event.path.length; i++) {
            var elem = event.path[i];
            Util.Log(i, elem);
            if (elem.classList != null) {
                if (elem.classList.contains("tcc-badge-text")) {
                    // Ignore Trello card connections badge clicks
                    return;
                }
                
                if (elem.classList.contains("list-card-details")) {
                    cardDetails = elem;
                    
                    break;
                }
                else if (elem.classList.contains("list-card")) {
                    clickedCard = elem;
                    cardDetails = clickedCard.querySelector(":scope > .list-card-details");
                    
                    break;
                }
            }
        }
        
        
        event.stopPropagation();
        event.preventDefault();
        
        if (event.type == "contextmenu") {
            // Ignore event (only prevent default)
            return;
        }
        
        if (cardDetails === null) {
            Util.Log("Couldn't find element with .list-card-details");
            
            return;
        }
    }
    
    if (clickedCard != null) {
        // The edit button was alternate clicked
        AddTextToCard(clickedCard, event.ctrlKey);
    }
    else if (event.altKey || (event.button == 1) || (event.button == 2)) {
        HandleCardClick(cardDetails, event);
    }
    else if (event.ctrlKey) {
        var cards = cardDetails.parentElement.parentElement.childNodes;
        for (var j = 0; j < cards.length; ++j) {
            var card = cards[j];
            cardDetails = card.childNodes[3];
            if (!HandleCardClick(cardDetails, event)) {
                break;
            }
        }
    }
}


/*!
 * Clear the canvas.
 */
function ClearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


///
/// Create a button.
///
function CreateButton(parent, content, minimizeList = true) {
    var button = document.createElement("button");
    button.textContent = content;
    button.className = "minimize-button";
    button.style.cssText = (
        "box-shadow: none;"
        + "margin: 5px 0 0 0;"
        + "padding: 0;"
    );
    
    if (minimizeList) {
        button.style.cssText += (
            // The actual color is #6b778c, but that looks
            // too dark next to a less "dense" icon
            "color: #838c91;"
            + "font-size: 1.0em;"
            + "margin: 4px 0 0 0;"
            + "padding: 0;"
            + "width: 20px;"
            + "position: absolute;"
            + "    top: 0;"
            + "    right: 27px;"
        );
    }
    
    parent.append(button);
    
    return button;
}


/*!
 * Create the canvas and set the global variables.
 */
function CreateCanvas(board) {
    Util.Log("NOTE", "CreateCanvas");
    
    canvas = document.createElement("canvas");
    canvas.id = "tcc-canvas";
    
    // Initial size, will be resized
    canvas.width = 1920;
    canvas.height = 1080;
    
    ctx = canvas.getContext("2d");
    
    board.append(canvas);
    
    ResizeCanvas();
    
    window.addEventListener(
        "resize",
        function () {
            ResizeCanvas();
            DrawConnections();
        }
    );
}


function CreateCornerElements() {
    var parent = document.getElementById("board");
    topLeft = document.createElement("div");
    topLeft.id = "tcc-board-top-left";
    parent.append(topLeft);
    /*/
    var bottomRight = document.createElement("div");
    bottomRight.id = "tcc-board-bottom-right";
    parent.append(bottomRight);
    //*/
}


function CreateCss(css) {
    Util.Log("NOTE", "SetCss()");

    var style = document.createElement("style");
    style.classList.add("tcc-custom-css");
    style.innerHTML = `
#tcc-board-top-left {
    height: 0;
    width: 0;
    position: absolute;
        top: 0;
        left: 0;
}
#tcc-board-bottom-right {
    height: 0;
    width: 0;
    position: absolute;
        bottom: 0;
        right: 0;
}
#tcc-canvas {
    /* Ignore mouse input (weird that this is in CSS) */
    pointer-events: none;
    position: absolute;
        top: 0;
        left: 0;
    z-index: 10000;
}
.js-badges {
    display: block;
}
.custom-field-front-badges .badge {
    overflow: visible;
}
.${BADGE_TEXT_CLASS} {
    color: #17394d;
    display: block;
    padding-bottom: 2px;
}
.${BADGE_TEXT_CLASS}:hover {
    text-decoration: underline;
}
.${BADGE_TEXT_CLASS}-missing-connection {
    /*/
    text-decoration: line-through;
    //*/
    overflow-y: visible;
}
.${BADGE_TEXT_CLASS}-missing-connection::before {
    background-color: #ffcc00;
    border-radius: 50%;
    color: white;
    content: "?";
    font-size: 2em;
    margin: 0 0.2em 0 0.1em;
    padding: 0 0.3em;
    position: relative;
        top: 2px;
}
/*/
.${BADGE_TEXT_CLASS}-missing-connection:hover {
    text-decoration: underline line-through;
}
//*/
${BADGE_TEXT_STYLES}
    `;
    var body = document.getElementsByTagName("body")[0];
    if (body != null) {
        body.append(style);
    }
    
    var hideFrontBadgesStyle = document.createElement("style");
    hideFrontBadgesStyle.classList.add("tcc-custom-css");
    hideFrontBadgesStyle.classList.add("tcc-custom-css_hide-front-badges");
    hideFrontBadgesStyle.innerHTML = "";
    if (body != null) {
        body.append(hideFrontBadgesStyle);
    }
}


///
/// Create "global" minimize buttons (minimize/unminimize all lists).
///
function CreateGlobalMinimizeButtons() {
    var boardHeaderButtonContainers = document.getElementsByClassName("board-header-btns");
    var boardHeaderLeftButtonContainer = null;
    
    for (var i = 0; i < boardHeaderButtonContainers.length; ++i) {
        var boardHeaderButtonContainer = boardHeaderButtonContainers[i];
        
        if (boardHeaderButtonContainer.classList.contains("mod-left")) {
            boardHeaderLeftButtonContainer = boardHeaderButtonContainer;
            
            break;
        }
    }
    
    if ((boardHeaderLeftButtonContainer != null)
        && (boardHeaderLeftButtonContainer.querySelector(":scope > .minimize-button") == null)) {
        
        var cssText = (
            "color: white;"
            + "margin: 0;"
            + "padding: 6px 8px;"
        );
        
        var minimizeAll = CreateButton(
            boardHeaderLeftButtonContainer,
            "↙",
            false
        );
        minimizeAll.style.cssText += cssText;
        minimizeAll.addEventListener(
            "click",
            MinimizeAllLists
        );
        
        var unminimizeAll = CreateButton(
            boardHeaderLeftButtonContainer,
            "↗",
            false
        );
        unminimizeAll.style.cssText += cssText;
        unminimizeAll.addEventListener(
            "click",
            function () {
                MinimizeAllLists();
                UnminimizeAllLists();
            }
        );
    }
    
    // Run periodically to ensure that the buttons are created
    setTimeout(CreateGlobalMinimizeButtons, 5000);
}


///
/// Create a section in the header.
///
function CreateHeaderSection() {
    Util.Log("CreateHeaderSection()");
    
    var searchInput = document.querySelector("input[type=search]");
    
    if (searchInput == null) {
        return null;
    }
    
    var searchInputParent = searchInput.parentElement;
    var headerLeft = searchInputParent.parentElement;
    
    var headerSection = document.createElement("div");
    headerSection.className = "custom-quick-links";
    headerSection.setAttribute(
        "style",
        "float: left; "
        + "margin-left: 5px;"
        + "position: relative; "
        + "    top: 2px;"
    );
    headerLeft.append(headerSection, searchInputParent);
    
    return headerSection;
}


///
/// Create a label element.
///
function CreateLabel(parent, color) {
    var span = document.createElement("span");
    span.className = "card-label card-label-" + color + " mod-card-front";
    span.style.borderRadius = "0";
    span.style.display = "none";
    span.style.height = "4px";
    span.style.margin = "0";
    var width = 27;
    span.style.minWidth = width + "px";
    span.style.width = width + "px";
    
    span.style.position = "absolute";
    
    if (color == "green") {
        span.style.left = (width * 0) + "px";
    }
    else if (color == "yellow") {
        span.style.left = (width * 1) + "px";
    }
    else if (color == "orange") {
        span.style.left = (width * 2) + "px";
    }
    else if (color == "red") {
        span.style.left = (width * 3) + "px";
    }
    else if (color == "purple") {
        span.style.left = (width * 4) + "px";
    }
    else if (color == "blue") {
        span.style.left = (width * 5) + "px";
    }
    else if (color == "sky") {
        span.style.left = (width * 6) + "px";
    }
    else if (color == "lime") {
        span.style.left = (width * 7) + "px";
    }
    else if (color == "pink") {
        span.style.left = (width * 8) + "px";
    }
    else if (color == "black") {
        span.style.left = (width * 9) + "px";
    }
    
    parent.append(span);
}


///
/// Create minimize buttons.
///
function CreateMinimizeButtons() {
    var listHeaders = document.getElementsByClassName("list-header");
    
    for (var i = 0; i < listHeaders.length; ++i) {
        var listHeader = listHeaders[i];
        var lastChild = listHeader.childNodes[listHeader.childNodes.length - 1];
        
        if (lastChild.className == "minimize-button") {
            // Button already created
            continue;
        }
        
        var listName = null;
        
        for (var j = 0; j < listHeader.childNodes.length; ++j) {
            var child = listHeader.childNodes[j];
            
            if (child.classList.contains("list-header-name-assist")) {
                listName = child.textContent;
                
                break;
            }
        }
        
        Util.Log("Creating minimize button for list: " + listName);
        
        var button = CreateButton(listHeader, "—");
        button.addEventListener(
            "click",
            MinimizeEvent
        );
        
        var list = listHeader.parentElement.parentElement;
        if ((listName.indexOf('~') == (listName.length - 1))) {
            // List name ends in '~'
            Util.Log("Minimizing ignored list: " + listName);
            list.classList.remove("show-list");
            list.classList.add("hide-list");
        }
    }
    
    // Set timeout to create minimize buttons for new lists
    setTimeout(
        CreateMinimizeButtons,
        1000
    );
}


///
/// Create a quick link.
///
function CreateQuickLink(parent, title, url, style) {
    var quickLink = document.createElement("a");
    quickLink.className = "compact-board-tile-link-thumbnail";
    quickLink.setAttribute("title", title);
    quickLink.setAttribute("href", url);
    quickLink.setAttribute(
        "style",
        "border: 1px solid white; "
        + "height: 25px; "
        + "width: 25px; "
        + "opacity: 1.0; "
        + "text-align: center; "
        + "transform: scale(0.8); "
        + style
    );
    
    var firstCharacter = title.substring(0, 1);
    var colonIndex = title.indexOf(":");
    if (colonIndex != -1) {
        firstCharacter = ":" + title.substring(colonIndex + 2, colonIndex + 3);
    }
    
    var quickLinkText = document.createElement("span");
    quickLinkText.textContent = firstCharacter;
    quickLinkText.setAttribute(
        "style",
        "background-color: rgba(0, 0, 0, 0.3); "
        + "color: white; "
        + "padding: 1px 3px 0 3px; "
        + "position: relative; "
        + "    top: 3px;"
    );
    quickLink.append(quickLinkText);
    
    parent.append(quickLink);
    
    return quickLink;
}


function DrawArrowHead(positionX, positionY, angle, color = null) {
    ctx.beginPath();
    
    const deg45 = Math.PI * 0.25;
    
    var headLength = 5;
    
    var s = Math.sin(angle - deg45);
    var c = Math.cos(angle - deg45);
    var xDiff = -headLength * s;
    var yDiff =  headLength * c;
    ctx.moveTo(
        positionX + xDiff,
        positionY + yDiff
    );
    
    ctx.lineTo(positionX, positionY);
    
    s = Math.sin(angle + deg45);
    c = Math.cos(angle + deg45);
    xDiff = -headLength * s;
    yDiff =  headLength * c;
    ctx.lineTo(
        positionX + xDiff,
        positionY + yDiff
    );
    
    if (color != null) {
        ctx.strokeStyle = color;
    }
    else {
        ctx.strokeStyle = LINE_COLORS["default"];
    }
    
    ctx.stroke();
    ctx.closePath();
}


function DrawBezier(startX, startY, endX, endY, point1X, point1Y, point2X, point2Y, color = null) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(point1X, point1Y, point2X, point2Y, endX, endY);
    
    if (color != null) {
        ctx.strokeStyle = color;
    }
    else {
        ctx.strokeStyle = LINE_COLORS["default"];
    }
    
    ctx.stroke();
    ctx.closePath();
}


function DrawConnection(badge, targetCard) {
    //Util.Log("DrawConnection()", badge, targetCard);
    
    var start = PagePosition(badge);
    var target = PagePosition(targetCard);
    var leftDiff = target.left - start.left;
    
    var badgeHeight = start.bottom - start.top;
    //var cardHeight = target.bottom - target.top;
    var cardHeight = 14;
    
    var startX = null;
    var targetX = null;
    var xDiff = null;
    var startY = start.top + badgeHeight / 2;
    var targetY = target.top + cardHeight / 2;
    var yDiff = null;
    var bendDistance = null;
    
    const xDiffMin = 100;
    
    var color = GetColorForBadge(badge);
    
    //Util.Log("start.left, target.left, leftDiff: ", start.left, target.left, leftDiff);
    
    if (Math.abs(leftDiff) < 20) {
        // Target and card are on the same list
        
        startX = start.left;
        targetX = target.left;
        //var xDiff = targetX - startX;
        //var yDiff = targetY - startY;
        DrawBezier(
            startX, startY,
            targetX, targetY,
            startX - 50, startY,
            startX - 50, targetY,
            color
        );
        DrawArrowHead(targetX, targetY, Math.PI / 2, color);
    }
    else if (leftDiff > 0) {
        // Target is to the right of the card
        
        startX = start.left + badge.parentElement.offsetWidth;
        targetX = target.left;
        xDiff = targetX - startX;
        yDiff = targetY - startY;
        if (Math.abs(xDiff) < xDiffMin) {
            bendDistance = Math.abs(yDiff / 3);
            DrawBezier(
                startX, startY,
                targetX, targetY,
                startX + bendDistance, startY,
                targetX - bendDistance, targetY,
                color
            );
        }
        else {
            DrawBezier(
                startX, startY,
                targetX, targetY,
                startX + xDiff / 2, startY,
                startX + xDiff / 2, targetY,
                color
            );
        }
        
        DrawArrowHead(targetX, targetY, Math.PI / 2, color);
    }
    else {
        // Target is to the left of the card
        
        startX = start.left;
        targetX = target.right;
        xDiff = targetX - startX;
        yDiff = targetY - startY;
        if (Math.abs(xDiff) < xDiffMin) {
            bendDistance = Math.abs(yDiff / 3);
            DrawBezier(
                startX, startY,
                targetX, targetY,
                startX - bendDistance, startY,
                targetX + bendDistance, targetY,
                color
            );
        }
        else {
            DrawBezier(
                startX, startY,
                targetX, targetY,
                startX + xDiff / 2, startY,
                startX + xDiff / 2, targetY,
                color
            );
        }
        
        DrawArrowHead(targetX, targetY, -Math.PI / 2, color);
    }
}


///
/// Draw connections for a badge.
///
function DrawConnectionForBadge(badge) {
    Util.Log("DEBUG", "DrawConnectionForBadge()", badge);
    
    if (badge.offsetParent === null) {
        // Don't draw connections for badges on hidden cards
        Util.Log("DEBUG", "Badge hidden, don't draw connection");
        return;
    }
    
    var text = badge.textContent;
    
    // Get the badge text after the badge name
    var fullBadgeText = text.split(/: (.+)/)[1];
    
    // Split at ';' to allow multiple values
    var badgeTexts = fullBadgeText.split("; ");
    
    for (var badgeText of badgeTexts) {
        // Parse target short ID from badge text (if the badge text is a URL)
        var shortId = ParseIdFromUrl(badgeText);
        
        // Find target card by ID
        var targetCard = GetCardById(shortId);
        
        if (targetCard == null) {
            // Find target card by text
            Util.Log("DEBUG", "Find card by text", badgeText);
            targetCard = GetCardByText(badgeText);
        }
        
        if (targetCard == null) {
            // Card not found, skip this badge
            // TODO: Draw "broken" line?
            Util.Log("DEBUG", "Card not found");
            
            continue;
        }
        
        if (targetCard.offsetParent === null) {
            // Don't draw connections to hidden cards
            // TODO: Draw "fading" line?
            Util.Log("DEBUG", "Target card hidden, don't draw connection");
            
            continue;
        }
        
        // Draw the connection
        DrawConnection(badge, targetCard);
    }
}


/*!
 * Draw connections.
 */
function DrawConnections() {
    Util.Log("INFO", "DrawConnections()");
    
    var badges = document.getElementsByClassName(BADGE_TEXT_CLASS);
    
    for (var badge of badges) {
        DrawConnectionForBadge(badge);
    }
}


function DrawLine(startX, startY, endX, endY, color = null) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    
    if (color != null) {
        ctx.strokeStyle = color;
    }
    else {
        ctx.strokeStyle = LINE_COLORS["default"];
    }
    
    ctx.stroke();
    ctx.closePath();
}


///
/// Find a card by the card's short ID.
///
function GetCardById(idToFind) {
    if (idToFind == null) {
        return null;
    }
    
    Util.Log("DEBUG", "GetCardById()", idToFind);
    
    // Prepend '#' to make matching easier
    idToFind = "#" + idToFind.toString();
    
    var cardShortIds = document.getElementsByClassName("card-short-id");
    for (var cardShortId of cardShortIds) {
        var shortId = cardShortId.textContent;
        if (idToFind == shortId) {
            return cardShortId.parentElement.parentElement.parentElement;
        }
    }
    
    return null;
}


///
/// Find a card by the card's text.
///
function GetCardByText(textToFind) {
    if (textToFind == null) {
        return null;
    }
    
    Util.Log("DEBUG", "GetCardByText()", textToFind);
    
    var cardTitleElements = document.querySelectorAll(".list-card-title");
    for (var cardTitleElement of cardTitleElements) {
        // The card title element has hidden text, se let's use innerText
        var cardText = cardTitleElement.innerText;
        if (textToFind == cardText) {
            return cardTitleElement.parentElement.parentElement;
        }
    }
    
    return null;
}


///
/// Get cards from a list.
///
function GetCardsForList(list) {
    var cardParent = list.querySelector(":scope > .list-cards");
    
    return (
        (cardParent != null)
        ? cardParent.childNodes
        : null
    );
}


/*!
 * Get the card currently under the mouse.
 */
function GetCardUnderMouse() {
    var hoverElement = Util.GetElementUnderMouse();
    
    return Util.GetParentWithClass(hoverElement, "list-card");
}


function GetColorForBadge(badge) {
    var color = LINE_COLORS["default"];
    
    for (var key in LINE_COLORS) {
        if (badge.classList.contains(`${BADGE_TEXT_CLASS}_${key}`)) {
            color = LINE_COLORS[key];
            
            break;
        }
    }
    
    return color;
}


/*!
 * Get custom field input element.
 */
async function GetCustomFieldInput(customFieldName) {
    var title = await Util.WaitForSelector("h3[title='" + customFieldName + "']");
    
    return title.parentElement.querySelector("input");
}


/*!
 * Get custom field input element.
 */
async function GetFirstEmptyCustomFieldInput(customFieldName) {
    var input = await GetCustomFieldInput(customFieldName);
    
    if (input.value == "") {
        return input;
    }
    
    var endNumberRegex = /\d+$/;
    
    var endNumber = customFieldName.match(endNumberRegex);
    
    if (endNumber != null) {
        endNumber = endNumber[0] + 1;
        
        customFieldName.replace(endNumberRegex, endNumber);
    }
    else {
        customFieldName += " 2";
    }
    
    return await GetFirstEmptyCustomFieldInput(customFieldName);
}


///
/// Get the label class name for a number key on the keyboard.
///
function GetLabelClassForKey(labelKey) {
    var labelClassNames = {
        "Digit1": "card-label-green",
        "Digit2": "card-label-yellow",
        "Digit3": "card-label-orange",
        "Digit4": "card-label-red",
        "Digit5": "card-label-purple",
        "Digit6": "card-label-blue",
        "Digit7": "card-label-sky",
        "Digit8": "card-label-lime",
        "Digit9": "card-label-pink",
        "Digit0": "card-label-black"
    };
    
    labelClassNames.Numpad1 = labelClassNames.Digit1;
    labelClassNames.Numpad2 = labelClassNames.Digit2;
    labelClassNames.Numpad3 = labelClassNames.Digit3;
    labelClassNames.Numpad4 = labelClassNames.Digit4;
    labelClassNames.Numpad5 = labelClassNames.Digit5;
    labelClassNames.Numpad6 = labelClassNames.Digit6;
    labelClassNames.Numpad7 = labelClassNames.Digit7;
    labelClassNames.Numpad8 = labelClassNames.Digit8;
    labelClassNames.Numpad9 = labelClassNames.Digit9;
    labelClassNames.Numpad0 = labelClassNames.Digit0;
    
    return labelClassNames[labelKey];
}


///
/// Get the list count element from a list wrapper.
///
function GetListCountElement(listWrapper) {
    return listWrapper.querySelector(
        ":scope > .list > .list-header > .list-header-num-cards"
    );
}


///
/// Get all list wrappers.
///
function GetListWrappers() {
    var listWrappers = document.getElementsByClassName("list-wrapper");
    
    // Convert HTMLCollection to array
    listWrappers = Array.prototype.slice.call(listWrappers);
    
    for (var i = 0; i < listWrappers.length; ++i) {
        var listWrapper = listWrappers[i];
        
        if (listWrapper.classList.contains("mod-add")) {
            listWrappers.splice(i, 1);
        }
    }
    
    return listWrappers;
}


///
/// Handle a card click.
///
async function HandleCardClick(cardDetails, event) {
    Util.Log("HandleCardClick()", event);
    
    videoIdRegex.lastIndex = 0;
    var openedUrl = true;
    
    var openMany = (event.shiftKey || (event.button == 1));
    
    var clickEvent = document.createEvent("Events");
    clickEvent.initEvent("click", true, false);
    cardDetails.dispatchEvent(clickEvent);
    
    var cardDescriptionElement = await Util.WaitForSelector(".js-desc-content .js-desc");
    
    var cardDescription = cardDescriptionElement.innerText;
    Util.Log("Card description: " + cardDescription);
    
    var cardLinks = cardDescriptionElement.querySelectorAll("a");
    cardLinks = Array.from(cardLinks).map((link) => link.href);
    
    Util.Log("Card description links:", cardLinks);
    
    var cardWindowClose = document.getElementsByClassName("dialog-close-button")[0];
    cardWindowClose.dispatchEvent(clickEvent);
    
    /**/
    var fullUrl = (cardLinks.length > 0) ? cardLinks : null;
    if (fullUrl) {
        Util.Log("Found full URL");
        
        var fullUrlCounter = 0;
        do {
            openedUrl = Util.OpenUrl(fullUrl[fullUrlCounter], openMany);
            ++fullUrlCounter;
        }
        while (openMany && openedUrl && (fullUrlCounter < fullUrl.length));
        
        return openedUrl;
    }
    /*/
    var fullUrl = cardDescription.match(fullUrlRegex);
    
    if (fullUrl) {
        Util.Log("Found full URL");
        
        var fullUrlCounter = 0;
        do {
            openedUrl = Util.OpenUrl(fullUrl[fullUrlCounter], openMany);
            ++fullUrlCounter;
        }
        while (openMany && openedUrl && (fullUrlCounter < fullUrl.length));
        
        return openedUrl;
    }
    // */
    
    var partialUrl = cardDescription.match(partialUrlRegex);
    
    if (!fullUrl && partialUrl) {
        Util.Log("Found partial URL");
        
        var partialUrlCounter = 0;
        do {
            openedUrl = Util.OpenUrl("http://" + partialUrl[partialUrlCounter], openMany);
            ++partialUrlCounter;
        }
        while (openMany && openedUrl && (partialUrlCounter < partialUrl.length));
        
        return openedUrl;
    }
    
    var videoId = cardDescription.match(videoIdRegex);
    
    if (!fullUrl && !partialUrl && videoId) {
        Util.Log("Found YouTube video ID");
        
        var videoIdCounter = 0;
        do {
            openedUrl = Util.OpenUrl("https://youtu.be/" + videoId[videoIdCounter], openMany);
            ++videoIdCounter;
        }
        while (openMany && openedUrl && (videoIdCounter < videoId.length));
        
        return openedUrl;
    }
    
    var cardName = cardDetails.textContent.split("\n");
    cardName = cardName[cardName.length - 2] + " ";
    Util.Log("Card name: ", cardName);
    
    fullUrl = cardName.match(fullUrlRegex);
    
    if (fullUrl) {
        Util.Log("Found full URL");
        fullUrl = fullUrl[0];
        
        if (cardName.match(ignoreUrlRegex)) {
            Util.Log("...but it matches the ignore URL regex");
        }
        else {
            openedUrl = Util.OpenUrl(fullUrl, openMany);
            
            if (!openedUrl || !openMany) {
                return openedUrl;
            }
        }
    }
    
    partialUrl = cardName.match(partialUrlRegex);
    
    if (!fullUrl && partialUrl) {
        Util.Log("Found partial URL");
        partialUrl = partialUrl[0];
        
        if (cardName.match(ignoreUrlRegex)) {
            Util.Log("...but it matches the ignore URL regex");
        }
        else {
            openedUrl = Util.OpenUrl("http://" + partialUrl, openMany);
            
            if (!openedUrl || !openMany) {
                return openedUrl;
            }
        }
    }
    
    videoId = videoIdRegex.exec(cardName);
    
    if (!fullUrl && !partialUrl && videoId) {
        Util.Log("Found YouTube video ID");
        videoId = videoId[1];
        Util.Log(videoId);
        //videoId = videoId.substring(1, videoId.length);
        
        if (videoId.match(probablyNotVideoIdRegex)) {
            Util.Log("...but it looks like a false positive, skipping");
        }
        else {
            openedUrl = Util.OpenUrl("https://youtu.be/" + videoId, openMany);
            
            if (!openedUrl || !openMany) {
                return openedUrl;
            }
        }
    }
    
    // This returns true even if an URL wasn't opened, so that the next card is handled
    return openedUrl;
}


///
/// Initialize list header labels.
///
function InitHeaderLabels(list) {
    for (var i = 0; i < list.childNodes.length; ++i) {
        var listChild = list.childNodes[i];
        
        if (listChild.className == "list-header-labels") {
            // Labels already created, hide them
            
            for (var j = 0; j < listChild.childNodes.length; ++j) {
                var label = listChild.childNodes[j];
                label.style.display = "none";
            }
            
            return;
        }
    }
    
    var container = document.createElement("div");
    container.className = "list-header-labels";
    container.style.height = "0";
    container.style.position = "relative";
    list.prepend(container);
    
    CreateLabel(container, "green");
    CreateLabel(container, "yellow");
    CreateLabel(container, "orange");
    CreateLabel(container, "red");
    CreateLabel(container, "purple");
    CreateLabel(container, "blue");
    CreateLabel(container, "sky");
    CreateLabel(container, "lime");
    CreateLabel(container, "pink");
    CreateLabel(container, "black");
}


///
/// Initialize the MutationObserver.
///
function InitObserver() {
    var board = document.getElementById("board");
    
    if (board == null) {
        setTimeout(InitObserver, 50);
        
        return;
    }
    
    var observer = new MutationObserver(ObserveBoard);
    observer.observe(board, {childList: true});
}


async function KeyEventListener(event) {
    //Util.Log("Caught event: ", event);
    
    var activeElementType = document.activeElement.tagName.toLowerCase();
    if ((activeElementType == "input") || (activeElementType == "textarea")) {
        Util.Log("INFO", "A text input is active, not handling key events");
        
        return;
    }
    
    var card = null;
    var url = null;
    var parent = null;
    
    if (event.altKey
        && ((event.key == "Left")
            || (event.key == "ArrowLeft")
            || (event.key == "Right")
            || (event.key == "ArrowRight"))) {
        if (event.type == "keyup") {
            var board = document.getElementById("board");
            var scrollAmount = 500;
            var scrollTo = null;
            
            if ((event.key == "Left") || (event.key == "ArrowLeft")) {
                scrollTo = board.scrollLeft - scrollAmount;
                Util.Log("NOTE", "Scroll left", scrollTo);
                
                VerticalSmoothScroll(
                    board,
                    scrollTo,
                    200
                );
            }
            else if ((event.key == "Right") || (event.key == "ArrowRight")) {
                scrollTo = board.scrollLeft + scrollAmount;
                Util.Log("NOTE", "Scroll right", scrollTo);
                
                VerticalSmoothScroll(
                    board,
                    scrollTo,
                    200
                );
            }
        }
        
        event.stopPropagation();
        event.preventDefault();
    }
    else if (event.keyCode == 113) { // F2
        if ((event.type == "keydown") && !event.repeat) {
            ResizeCanvas();
            DrawConnections();
            allConnectionsDrawn = true;
        }
        else if ((event.type == "keyup") && !event.altKey) {
            ClearCanvas();
            allConnectionsDrawn = false;
        }
    }
    else if ((event.key == "h") && (event.type == "keyup")) {
        Util.Log("NOTE", "Toggle hiding front badges");
        
        var hideFrontBadgesStyle = document.querySelector(".tcc-custom-css_hide-front-badges");
        
        if (hideFrontBadgesStyle.innerHTML == "") {
            hideFrontBadgesStyle.innerHTML = `
                .badges {
                    line-height: 0;
                }
                .badge span.tcc-badge-text {
                    font-size: 0;
                    line-height: 0;
                    padding: 0;
                }
            `;
        }
        else {
            hideFrontBadgesStyle.innerHTML = "";
        }
    }
    else if (((event.key == "u") || (event.key == "U")) && (event.type == "keyup")) {
        Util.Log("NOTE", "Set URL to clipboard");
        
        card = GetCardUnderMouse();
        
        if (card != null) {
            // Get the card's URL
            url = card.pathname;
            
            if (event.shiftKey) {
                // Get the card's parent instead of the card's URL
                parent = card.querySelector(`.${BADGE_TEXT_CLASS}_parent`);
                
                if (parent != null) {
                    Util.Log("NOTE", "Set parent URL to clipboard: ", url);
                    url = parent.textContent.split(": ")[1];
                }
                else {
                    url = null;
                }
            }
            else {
                Util.Log("NOTE", "Set card URL to clipboard: ", url);
            }
            
            if (url != null) {
                navigator.clipboard.writeText(url);
            }
        }
    }
    else if (event.altKey && (event.type == "keyup")) {
        card = GetCardUnderMouse();
        
        if (card == null) {
            return;
        }
        
        var textToSet = await navigator.clipboard.readText();
        
        var clickEvent = Util.CreateClickEvent();
        
        card.dispatchEvent(clickEvent);
        
        var input = null;
        
        if (event.key == "p") {
            Util.Log("NOTE", "Set parent badge");
            input = await GetCustomFieldInput("Parent");
        }
        else if (event.key == "r") {
            Util.Log("NOTE", "Set related badge");
            input = await GetFirstEmptyCustomFieldInput("Related");
        }
        else if (event.key == "b") {
            Util.Log("NOTE", "Set blocked by badge");
            input = await GetFirstEmptyCustomFieldInput("Blocked by");
        }
        
        if (input == null) {
            return;
        }
        
        Util.Log("INFO", "Setting text: ", textToSet);
        
        input.value = textToSet;
        
        // This is a hack to simulate user input, so the value is saved
        input.select();
        
        var closeButton = document.querySelector(".dialog-close-button");
        
        if (closeButton != null) {
            Util.Log("INFO", "Closing dialog");
            closeButton.dispatchEvent(clickEvent);
        }
    }
    
    
    if (event.type == "keydown"
        && event.altKey && (event.key == "c")) {
        
        //Util.Log("Caught event: ", event);
        UnarchiveCard();
    }
    
    if (event.type == "keydown"
        && event.shiftKey
        && ((event.code == "Digit1") || (event.code == "Numpad1")
            || (event.code == "Digit2") || (event.code == "Numpad2")
            || (event.code == "Digit3") || (event.code == "Numpad3")
            || (event.code == "Digit4") || (event.code == "Numpad4")
            || (event.code == "Digit5") || (event.code == "Numpad5")
            || (event.code == "Digit6") || (event.code == "Numpad6")
            || (event.code == "Digit7") || (event.code == "Numpad7")
            || (event.code == "Digit8") || (event.code == "Numpad8")
            || (event.code == "Digit9") || (event.code == "Numpad9")
            || (event.code == "Digit0") || (event.code == "Numpad0"))) {
        if (event.ctrlKey) {
            if ((event.code == "Digit9") || (event.code == "Numpad9")) {
                // Toggle script label (pink) off for the entire board
                ToggleScriptLabelOffForBoard();
            }
        }
        else {
            Util.Log("Toggle label: " + event.key);
            var hoverElement = Util.GetElementUnderMouse();
            Util.Log("Mouse hover element: ", hoverElement);
            var list = Util.GetParentWithClass(hoverElement, "list");
            Util.Log("List: ", list);
            
            if (list != null) {
                ToggleLabelForList(list, event);
                
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }
}


///
/// Minimize all lists.
///
function MinimizeAllLists() {
    var listWrappers = GetListWrappers();
    
    for (var i = 0; i < listWrappers.length; ++i) {
        var listWrapper = listWrappers[i];
        MinimizeList(listWrapper);
    }
}


///
/// Minimize empty Trello lists.
///
function MinimizeEmptyAndIgnoredLists() {
    //Util.Log("MinimizeEmptyAndIgnoredLists()");
    
    var cardCountElements = document.getElementsByClassName("list-header-num-cards");
    
    if (cardCountElements.length == 0) {
        // Not ready, call again after delay
        window.setTimeout(MinimizeEmptyAndIgnoredLists, 100);
        
        return;
    }
    
    for (var i = 0; i < cardCountElements.length; i++) {
        var cardCount = cardCountElements[i];
        var listHeader = cardCount.parentElement;
        var list = cardCount.parentElement.parentElement.parentElement;
        var listNameElement = listHeader.querySelector(".list-header-name-assist");
        var listName = listNameElement.textContent;
        
        var previousCardCount = 0;
        
        if (loading) {
            // Trigger empty list hide on load
            previousCardCount = -1;
        }
        
        if (listName in listCardCounts) {
            previousCardCount = listCardCounts[listName];
        }
        
        var currentCardCount = cardCount.textContent.split(" ")[0];
        
        listCardCounts[listName] = currentCardCount;
        
        /*
        if ((currentCardCount == 0) && (previousCardCount != 0)) {
            // Card count dropped to 0, hide the list
            Util.Log("Minimizing empty list: ", listName);
            list.classList.remove("show-list");
            list.classList.add("hide-list");
        }
        else*/ if ((currentCardCount != 0) && (previousCardCount == 0)) {
            // Card count rose above 0, show the list
            Util.Log("Unminimizing non-empty list: ", listName);
            list.classList.remove("hide-list");
            list.classList.add("show-list");
        }
    }
    
    window.setTimeout(MinimizeEmptyAndIgnoredLists, 50);
    
    loading = false;
}


///
/// Event handler for minimize button.
///
function MinimizeEvent(event) {
    Util.Log("Minimize button clicked");
    
    var button = event.path[0];
    
    var list = button.parentElement.parentElement;
    var listWrapper = button.parentElement.parentElement.parentElement;
    
    Util.Log(listWrapper);
    
    ToggleListMinimize(listWrapper);
}


///
/// Minimize/unminimize a list.
///
function MinimizeList(listWrapper, minimize = true) {
    if (minimize) {
        listWrapper.classList.add("hide-list");
        listWrapper.classList.remove("show-list");
    }
    else {
        listWrapper.classList.remove("hide-list");
        listWrapper.classList.add("show-list");
    }
}


function ObserveBoard(mutations, observer) {
    for (var mutation of mutations) {
        var target = mutation.target;
        
        /*/
        if (target.classList.contains("list") && !target.classList.contains("tcc-has-observer")) {
            Util.Log("Set list observer");
            target.classList.add("tcc-has-observer");
            var cardsList = target.querySelector(".list-cards");
            cardsList.classList.add("tcc-has-observer");
            listObserver.observe(cardsList, {childList: true});
        }
        /*/
        if (target.classList.contains("list")) {
            RefreshListObservers(target);
        }
        //*/
    }
}


var cardObserver = new MutationObserver(ObserveCard);
function ObserveCard(mutations, observer) {
    for (var mutation of mutations) {
        var target = mutation.target;
        
        /**/
        Util.Log("INFO", "ObserveCard()", mutation);
        Util.Log("INFO", "ObserveCard()", target);
        //*/
        
        if (target.classList.contains("custom-field-front-badges") && !target.classList.contains("tcc-has-observer")) {
            Util.Log("NOTE", "Set custom field front badge observer");
            target.classList.add("tcc-has-observer");
            frontCustomBadgeListObserver.observe(target, {childList: true});
            
            var badgeTexts = target.querySelectorAll(".badge-text");
            for (var badgeText of badgeTexts) {
                SetCustomBadgeTextClasses(badgeText);
            }
            
            // Update existing badges that link to this card
            var url = target.href;
            //Util.Log("URL: ", url);
            var shortId = ParseIdFromUrl(url);
            badgeTexts = document.querySelectorAll(".tcc-badge-text");
            for (badgeText of badgeTexts) {
                if (badgeText.textContent.indexOf(shortId) != -1) {
                    SetCustomBadgeTextClasses(badgeText);
                }
            }
        }
    }
}


var frontCustomBadgeListObserver = new MutationObserver(ObserveFrontCustomBadgeList);
function ObserveFrontCustomBadgeList(mutations, observer) {
    for (var mutation of mutations) {
        var target = mutation.target;
        
        Util.Log("INFO", "ObserveCustomFrontBadgeList()", target);
        
        var badgeTexts = target.querySelectorAll(".badge-text");
        for (var badgeText of badgeTexts) {
            SetCustomBadgeTextClasses(badgeText);
        }
    }
}


var listObserver = new MutationObserver(ObserveList);
function ObserveList(mutations, observer) {
    for (var mutation of mutations) {
        var target = mutation.target;
        
        if (target.classList.contains("list-cards")) {
            var cards = target.childNodes;
            
            for (var card of cards) {
                RefreshCardObservers(card);
                /**/
                if (!card.classList.contains("tcc-has-observer")) {
                    Util.Log("NOTE", "Set card observer");
                    card.classList.add("tcc-has-observer");
                    cardObserver.observe(card, {childList: true});
                    
                    // Update existing badges that link to this card
                    var url = card.href;
                    //Util.Log("URL: ", url);
                    var shortId = ParseIdFromUrl(url);
                    var badgeTexts = document.querySelectorAll(".tcc-badge-text");
                    for (var badgeText of badgeTexts) {
                        if (badgeText.textContent.indexOf(shortId) != -1) {
                            SetCustomBadgeTextClasses(badgeText);
                        }
                    }
                }
                //*/
            }
        }
        
        /*/
        Util.Log("ObserveList()", mutation);
        Util.Log("ObserveList()", target);
        // */
        
        /*/
        for (var addedNode of mutation.addedNodes) {
            if (addedNode.classList.contains("list-card") && !addedNode.classList.contains("tcc-has-observer")) {
                Util.Log("Set card observer");
                addedNode.classList.add("tcc-has-observer");
                cardObserver.observe(addedNode, {childList: true});
            }
        }
        // */
    }
}


///
/// MutationObserver listener.
///
function ObserveBoard(mutations, observer) {
    for (var mutation of mutations) {
        Util.Log(mutation);
    }
}


///
/// Open a URL from a card.
///
function OpenCardURL(urlText) {
    var fullUrl = urlText.match(fullUrlRegex);
    
    var openedUrl = false;
    
    if (fullUrl) {
        Util.Log("Found full URL");
        fullUrl = fullUrl[0];
        
        if (urlText.match(ignoreUrlRegex)) {
            Util.Log("...but it matches the ignore URL regex");
        }
        else {
            openedUrl = Util.OpenUrl(fullUrl, true);
            
            if (openedUrl) {
                return openedUrl;
            }
        }
    }
    
    var partialUrl = urlText.match(partialUrlRegex);
    
    if (!fullUrl && partialUrl) {
        Util.Log("Found partial URL");
        partialUrl = partialUrl[0];
        
        if (urlText.match(ignoreUrlRegex)) {
            Util.Log("...but it matches the ignore URL regex");
        }
        else {
            openedUrl = Util.OpenUrl("http://" + partialUrl, true);
            
            if (openedUrl) {
                return openedUrl;
            }
        }
    }
    
    var videoId = plainVideoIdRegex.exec(urlText);
    Util.Log("videoId: " + videoId);
    
    if (!fullUrl && !partialUrl && videoId) {
        Util.Log("Found YouTube video ID");
        videoId = videoId[1];
        Util.Log(videoId);
        //videoId = videoId.substring(1, videoId.length);
        
        if (videoId.match(probablyNotVideoIdRegex)) {
            Util.Log("...but it looks like a false positive, skipping");
        }
        else {
            openedUrl = Util.OpenUrl("https://youtu.be/" + videoId, true);
            
            if (openedUrl) {
                return openedUrl;
            }
        }
    }
    
    return openedUrl;
}


function PagePosition(element) {
    var rect = element.getBoundingClientRect();
    var topLeftRect = topLeft.getBoundingClientRect();
    var scrollTop = topLeftRect.top;
    var scrollLeft = topLeftRect.left;
    
    //Util.Log("rect.top", rect.top);
    //Util.Log("scrollTop", scrollTop);
    
    return {
        bottom: rect.bottom - scrollTop,
        left: rect.left - scrollLeft,
        right: rect.right - scrollLeft,
        top: rect.top - scrollTop
    };
}


function ParseIdFromUrl(url) {
    //Util.Log("ParseIdFromUrl()", url);
    
    var match = urlShortIdRegex.exec(url);
    //Util.Log("ParseIdFromUrl()", match);
    
    if (match == null) {
        return null;
    }
    
    return match[1];
}


function RefreshBoardObservers(board) {
    if (canvas != null) {
        ResizeCanvas();
    }
    
    var lists = board.querySelectorAll(".list");
    for (var list of lists) {
        RefreshListObservers(list);
    }
}


function RefreshCardObservers(card) {
    //Util.Log("RefreshCardObservers()", card);
    
    /*/
    if (card.classList.contains("tcc-has-observer")) {
        return;
    }
    //*/
    
    card.classList.add("tcc-has-observer");
    cardObserver.observe(card, {childList: true});
    
    var badges = card.querySelector(".badges");
    
    if (badges == null) {
        return;
    }
    
    var customBadgeList = badges.childNodes[1];
    customBadgeList.classList.add("tcc-has-observer");
    frontCustomBadgeListObserver.observe(customBadgeList, {childList: true});
    
    var badgeTexts = customBadgeList.querySelectorAll(".badge-text");
    for (var badgeText of badgeTexts) {
        SetCustomBadgeTextClasses(badgeText);
    }
    
    var url = card.href;
    if ((url == null) || (url == "")) {
        return;
    }
    
    var shortId = ParseIdFromUrl(url);
    //Util.Log("ID: ", url, shortId);
    badgeTexts = document.querySelectorAll(".tcc-badge-text");
    for (badgeText of badgeTexts) {
        //Util.Log("Check: ", url, badgeText.textContent);
        if (badgeText.textContent.indexOf(shortId) != -1) {
            SetCustomBadgeTextClasses(badgeText);
        }
    }
}


function RefreshListObservers(list) {
    if (list.classList.contains("tcc-has-observer")) {
        return;
    }
    
    list.classList.add("tcc-has-observer");
    
    var cardsList = list.querySelector(".list-cards");
    cardsList.classList.add("tcc-has-observer");
    listObserver.observe(cardsList, {childList: true});
    
    //var cards = cardsList.querySelectorAll(".list-card");
    var cards = cardsList.childNodes;
    for (var card of cards) {
        RefreshCardObservers(card);
    }
}


/*!
 * Resize the canvas.
 */
function ResizeCanvas() {
    const element = canvas.parentElement;
    const width = element.scrollWidth;
    const height = element.clientHeight;
    
    Util.Log("INFO", "ResizeCanvas(" + width.toString() + ", " + height.toString() + ")");
    
    if (canvas.height != height || canvas.width != width) {
        canvas.width = width;
        canvas.style.width = width.toString() + "px";
        canvas.height = height;
        canvas.style.height = height.toString() + "px";
        
        ClearCanvas();
    }
}


function SetCustomBadgeTextClasses(badgeText) {
    Util.Log("DEBUG", "SetCustomBadgeTextClasses()", badgeText);
    
    badgeText.classList.add(BADGE_TEXT_CLASS);
    
    var customBadgeName = badgeText.textContent.toLowerCase().split(":")[0].replace(/\s+/g,'');
    badgeText.classList.add(BADGE_TEXT_CLASS + "_" + customBadgeName);
    
    var connectedId = ParseIdFromUrl(badgeText.textContent);
    //Util.Log("Connected ID: ", connectedId);
    
    if (connectedId != null) {
        var connectedCard = GetCardById(connectedId);
        Util.Log("INFO", "Connected card: ", connectedCard);
        
        if (connectedCard == null) {
            badgeText.classList.add(BADGE_TEXT_CLASS + "-missing-connection");
        }
        else {
            badgeText.classList.remove(BADGE_TEXT_CLASS + "-missing-connection");
        }
    }
    
    badgeText.addEventListener("click", BadgeClick, true);
    badgeText.addEventListener("auxclick", BadgeClick, true);
    badgeText.addEventListener("contextmenu", BadgeClick, true);
    badgeText.addEventListener("mouseover", BadgeMouseOver, true);
    badgeText.addEventListener("mouseout", BadgeMouseOut, true);
}


///
/// Show a label.
///
function ShowLabel(container, color) {
    for (var i = 0; i < container.childNodes.length; ++i) {
        var label = container.childNodes[i];
        
        if ((label == null) || (label.className == null)) {
            Util.Log("CRASH HERE?");
            Util.Log("label: ", label);
            Util.Log("container: ", container);
            
            continue;
        }
        
        if (label.className.indexOf(color) != -1) {
            label.style.display = "inline-block";
            
            break;
        }
    }
}


///
/// Toggle the visibility of list header labels.
///
function ToggleHeaderLabelsVisibility() {
    var labels = document.getElementsByClassName("card-label");
    
    for (var i = 0; i < labels.length; ++i) {
        var label = labels[i];
        
        if (label.parentElement.className == "list-header-labels") {
            continue;
        }
        
        var list = label.parentElement.parentElement.parentElement.parentElement.parentElement;
        var listLabelContainer = list.childNodes[0];
        ShowLabel(listLabelContainer, label.className);
    }
}


///
/// Toggle a label for a card.
///
function ToggleLabelForCard(card, labelClass, toggleState) {
    //Util.Log("card: ", card);
    var details = card.querySelector(":scope > .list-card-details");
    //Util.Log("details: ", details);
    var labels = details.querySelector(":scope > .list-card-labels");
    //Util.Log("labels: ", labels);
    
    var hasLabel = (labels.querySelector(":scope > ." + labelClass) != null);
    
    Util.Log("Card: ", card);
    Util.Log("toggleState, hasLabel: ", toggleState, hasLabel);
    
    if (toggleState != hasLabel) {
        Util.Log("Toggle the label");
        
        var clickEvent = document.createEvent("Events");
        clickEvent.initEvent("click", true, false);
        
        // Click the edit card button
        var editCardButton = card.querySelector(":scope > .icon-edit");
        Util.Log("editCardButton", editCardButton);
        
        if (editCardButton == null) {
            Util.Log("editCardButton is null, stopping");
            
            return;
        }
        
        editCardButton.dispatchEvent(clickEvent);
        // Click the edit labels button
        var editLabelsButton = document.getElementsByClassName("js-edit-labels")[0];
        Util.Log("editLabelsButton", editLabelsButton);
        editLabelsButton.dispatchEvent(clickEvent);
        // Click the label button
        var editLabelsList = document.getElementsByClassName("edit-labels-pop-over")[0];
        for (var i = 0; i < editLabelsList.childNodes.length; ++i) {
            var toggleLabelButton = editLabelsList.childNodes[i].querySelector(":scope > ." + labelClass);
            if (toggleLabelButton != null) {
                Util.Log("Label class: " + labelClass);
                toggleLabelButton.dispatchEvent(clickEvent);
            }
        }
    }
}


///
/// Toggle a label for a list (all cards on the list).
///
function ToggleLabelForList(list, event) {
    var cards = GetCardsForList(list);
    
    var labelClass = GetLabelClassForKey(event.code);
    
    var toggleState = event.altKey;
    
    for (var card of cards) {
        ToggleLabelForCard(card, labelClass, toggleState);
    }
    
    // Click the "Save" button to close the last dialog
    var saveButton = document.getElementsByClassName("js-save-edits")[0];
    if (saveButton != null) {
        var clickEvent = document.createEvent("Events");
        clickEvent.initEvent("click", true, false);
        saveButton.dispatchEvent(clickEvent);
    }
}


///
/// Toggle list minimization on a list.
///
function ToggleListMinimize(listWrapper) {
    listWrapper.classList.toggle("hide-list");
    listWrapper.classList.toggle("show-list");
}


///
/// Toggle the script label off for the entire board.
///
function ToggleScriptLabelOffForBoard() {
    Util.Log("ToggleScriptLabelOffForBoard()");
    
    // Get all pink labels on the board
    var labelClass = "card-label-pink";
    var pinkLabels = document.getElementsByClassName(labelClass);
    for (var pinkLabel of pinkLabels) {
        var card = pinkLabel.parentElement.parentElement.parentElement;
        if (!card.classList.contains("list-card")) {
            // Not a card (probably a list label)
            Util.Log("Not a card");
            
            continue;
        }
        
        Util.Log("Toggling script label off for card: ", card);
        ToggleLabelForCard(card, labelClass, false);
    }
    
    // Click the "Save" button to close the last dialog
    var saveButton = document.getElementsByClassName("js-save-edits")[0];
    if (saveButton != null) {
        var clickEvent = document.createEvent("Events");
        clickEvent.initEvent("click", true, false);
        saveButton.dispatchEvent(clickEvent);
    }
}


///
/// Unarchive the latest archived card.
///
function UnarchiveCard() {
    Util.Log("Unarchive latest archived card");
    
    // Create click event
    var clickEvent = document.createEvent("Events");
    clickEvent.initEvent("click", true, false);
    
    // Find an click the "More" button in the menu
    // (if it can't be found, this is already done)
    var moreButton = document.getElementsByClassName("js-open-more");
    moreButton = (moreButton != null) ? moreButton[0] : null;
    if (moreButton != null) {
        moreButton.dispatchEvent(clickEvent);
    }
    
    // Find an click the "Archived items" button in the menu
    // (if it can't be found, this is already done)
    var archivedItemsButton = document.getElementsByClassName("js-open-archive");
    archivedItemsButton = (archivedItemsButton != null) ? archivedItemsButton[0] : null;
    if (archivedItemsButton != null) {
        archivedItemsButton.dispatchEvent(clickEvent);
    }
    
    WaitForReopenButtons();
}


///
/// Minimize all lists.
///
function UnminimizeAllLists(unminimizeEmpty = false) {
    var listWrappers = GetListWrappers();
    
    for (var i = 0; i < listWrappers.length; ++i) {
        var listWrapper = listWrappers[i];
        var listCount = GetListCountElement(listWrapper);
        
        if (unminimizeEmpty || (listCount.textContent != "0 cards")) {
            MinimizeList(listWrapper, false);
        }
    }
}


function VerticalSmoothScroll(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    
    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    
    if (duration === 0) {
        element.scrollLeft = target;
        
        return Promise.resolve();
    }
    
    var startTime = Date.now();
    var endTime = startTime + duration;
    
    var startLeft = element.scrollLeft;
    var distance = target - startLeft;
    
    var smoothStep = function (start, end, point) {
        if (point <= start) {
            return 0;
        }
        else if (point >= end) {
            return 1;
        }
        
        var x = (point - start) / (end - start);
        
        return x * x * (3 - 2 * x);
    };
    
    return new Promise(
        function (resolve, reject) {
            var previousLeft = element.scrollLeft;
            
            var scrollFrame = function () {
                if (element.scrollLeft != previousLeft) {
                    reject("interrupted");
                    
                    return;
                }
                
                var now = Date.now();
                var point = smoothStep(startTime, endTime, now);
                var frameLeft = Math.round(startLeft + (distance * point));
                element.scrollLeft = frameLeft;
                
                if (now >= endTime) {
                    resolve();
                    
                    return;
                }
                
                if (element.scrollLeft === previousLeft && element.scrollLeft !== frameLeft) {
                    resolve();
                    
                    return;
                }
                
                previousLeft = element.scrollLeft;
                
                setTimeout(scrollFrame, 0);
            };
            
            setTimeout(scrollFrame, 0);
        }
    );
}


///
/// Wait for reopen / "Send to board" buttons to appear, and click them.
///
function WaitForReopenButtons() {
    // Find all "Send to board" buttons, and click the first one
    // (if none can be found, try again until some are found)
    var reopenButtons = document.getElementsByClassName("js-reopen");
    
    if ((reopenButtons == null) || (reopenButtons[0] == null)) {
        Util.Log("Wait more");
        
        setTimeout(
            WaitForReopenButtons,
            50
        );
        
        return;
    }
    
    Util.Log("Waiting done");
    
    // Create click event
    var clickEvent = document.createEvent("Events");
    clickEvent.initEvent("click", true, false);
    
    // Click the first reopen button
    reopenButtons[0].dispatchEvent(clickEvent);
    
    // Find an click the sidebar hide button in the menu
    var sidebarHideButton = document.getElementsByClassName("js-hide-sidebar");
    sidebarHideButton = (sidebarHideButton != null) ? sidebarHideButton[0] : null;
    if (sidebarHideButton != null) {
        sidebarHideButton.dispatchEvent(clickEvent);
    }
}


///
/// Initialize.
///
function Init() {
    Util.Log("NOTE", "Init()");
    
    var board = document.querySelector("#board");
    
    if (board == null) {
        setTimeout(Init, 1000);
        
        return;
    }
    
    var observer = new MutationObserver(ObserveBoard);
    observer.observe(board, {childList: true, subtree: true});
    
    RefreshBoardObservers(board);
    
    CreateCss();
    
    CreateCornerElements();
    
    CreateCanvas(board);
    
    /*/
    document.addEventListener(
        "mousemove",
        MouseMoveListener,
        true
    );
    // */
    
    document.addEventListener(
        "keypress",
        KeyEventListener,
        true
    );
    document.addEventListener(
        "keydown",
        KeyEventListener,
        true
    );
    document.addEventListener(
        "keyup",
        KeyEventListener,
        true
    );
    
    setTimeout(
        function () {
            Util.Log("Adding alt-click listener to cards");
            AddListenerToCards();
        },
        2500
    );
}


function InitHeaders() {
    var lists = document.getElementsByClassName("list");
    
    for (var i = 0; i < lists.length; ++i) {
        InitHeaderLabels(lists[i]);
    }
    
    ToggleHeaderLabelsVisibility();
    
    setTimeout(
        InitHeaders,
        1000
    );
}


///
/// Initialize.
///
function InitQuickLinks() {
    if (document.getElementsByClassName("custom-quick-links").length != 0) {
        // Quick links already created, call again after a delay (to re-create after page change)
        setTimeout(InitQuickLinks, 1000);
        
        return;
    }
    
    var boardsButton = document.querySelector("button[data-test-id=header-boards-menu-button]");
    
    if (boardsButton == null) {
        setTimeout(InitQuickLinks, 1000);
        
        return;
    }
    
    // Click the boards button to load the list of boards
    boardsButton.dispatchEvent(Util.CreateClickEvent());
    
    // This used to be so simple and clean, then Trello switched to random/minified class names...
    //var sidebarBoardsList = document.getElementsByClassName("sidebar-boards-list")[0];
    var sidebarBoardsList = document.querySelector("div[data-test-id=header-boards-menu-popover] > :nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(1)");
    
    if ((sidebarBoardsList == null) || (sidebarBoardsList.childNodes.length < 1)) {
        setTimeout(InitQuickLinks, 1000);
        
        return;
    }
    
    var headerSection = CreateHeaderSection();
    
    if (headerSection == null) {
        setTimeout(InitQuickLinks, 1000);
        
        return;
    }
    
    // Click the close icon to close the boards menu
    var closeIcon = document.querySelector("span[aria-label=CloseIcon]");
    if (closeIcon != null) {
        closeIcon.dispatchEvent(Util.CreateClickEvent());
    }
    else {
        Util.Error("Close icon not found!");
    }
    
    Util.Log("Creating Trello quick links");
    
    for (var i = 0; i < sidebarBoardsList.childNodes.length; ++i) {
        var listItem = sidebarBoardsList.childNodes[i];
        
        var link = listItem.querySelector("a");
        
        var title = link.getAttribute("title");
        var url = link.href;
        var backgroundStyle = link.childNodes[0].style.cssText;
        
        Util.Log(i, title, url, backgroundStyle);
        
        CreateQuickLink(headerSection, title, url, backgroundStyle);
    }
    
    // Hide header logo
    //var headerLogo = document.querySelector(".header-logo");
    var headerLogo = document.querySelector("#header > a[href='/']");
    headerLogo.style.display = "none";
    
    // Quick links created, but call this function again to re-create links after page changes
    setTimeout(InitQuickLinks, 1000);
}


(
    function () {
        "use strict";
        
        Init();
        InitHeaders();
        
        CreateGlobalMinimizeButtons();
        
        CreateMinimizeButtons();
        
        MinimizeEmptyAndIgnoredLists();
        
        InitObserver();
        
        if (Util.InIframe()) {
            return;
        }
        
        //InitQuickLinks();
    }
)();
