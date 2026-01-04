// ==UserScript==
// @name         Chat Highlighter
// @namespace    LordBusiness.CH
// @version      1.9
// @description  Highlights your name on chat.
// @author       LordBusiness
// @require      https://cdn.rawgit.com/tovic/color-picker/e10819addb0abfc4af1877a3ca29073f08c34bcc/color-picker.min.js
// @resource     ColorpickCSS https://cdn.rawgit.com/tovic/color-picker/e10819addb0abfc4af1877a3ca29073f08c34bcc/color-picker.min.css
// @match        *.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/370491/Chat%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/370491/Chat%20Highlighter.meta.js
// ==/UserScript==

const flush = () => {localStorage.setItem("LBSchatHighlight", "{}")}
if(localStorage.getItem("LBSchatHighlight") === null) {
    flush();
}

var highlightObj = JSON.parse(localStorage.LBSchatHighlight);
var cssRules = "";

for (let player in highlightObj) {
    if (highlightObj.hasOwnProperty(player)) {
        if(highlightObj[player].colored == "1") {
            cssRules += `[class^="message"] a[href$="=${player}"] { color: ${highlightObj[player].color}; }`;
        }
    }
}
GM_addStyle(cssRules);


const getPlayerID = () => {return ($(".basic-list > li:contains('Name')").first().text()).replace( /[\w_-]+/, '').replace( /[^0-9]/g, '')}
const savetoStorage = () => { localStorage.LBSchatHighlight = JSON.stringify(highlightObj)}
const addPProperty = (PID) => { if(!highlightObj.hasOwnProperty(PID)) {highlightObj[PID] = {}}}
const checkChecked = (PID) => {
    let ifchecked = document.getElementById("lbschatcolor").checked;
    $(".lbs-chat-color").prop('disabled', !ifchecked);

    if(PID) {
        addPProperty(PID);
        if(ifchecked) {
            highlightObj[PID].color = document.querySelector('.lbs-chat-color').value;
            highlightObj[PID].colored = "1";
        } else {
            highlightObj[PID].colored = "0";
        }
        savetoStorage();
    }
};
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if(node.classList && node.classList.contains('basic-info')) {
                observer.disconnect();
                $(".basic-list > li:contains('Life')").first().after(
`<li>
    <div class="user-information-section left width112"><span class="bold">Chat color</span></div>
    <div class="choice-container">
         <input class="checkbox-css" type="checkbox" id="lbschatcolor" name="lbschatcolor">
         <label for="lbschatcolor" class="marker-css"><input type="text" class="lbs-chat-color" style="background: transparent; color: transparent" value="#03a9f4" spellcheck="false"></label>
    </div>
    <div id="lbscurrCSS"><style></style></div>
</li>`);
                GM_addStyle(GM_getResourceText("ColorpickCSS"));

                const PlayerID = getPlayerID();
                if(highlightObj.hasOwnProperty(PlayerID)) {
                    if(highlightObj[PlayerID].colored == "1") {
                        $("#lbschatcolor").prop('checked', true);
                    }
                    $('.lbs-chat-color').val(highlightObj[PlayerID].color);
                }
                checkChecked(false);
                const cpick = document.querySelector('.lbs-chat-color');
                const picker = new CP(cpick);
                cpick.addEventListener('blur', () => {
                    addPProperty(PlayerID);
                    highlightObj[PlayerID].color = cpick.value;
                    savetoStorage();
                })
                picker.on("change", function(color) {
                    var col = "#" + color;
                    this.target.value = col;
                    this.target.style.textShadow = "0 0 0 " + col;
                    if(document.getElementById("lbschatcolor").checked) {
                        $("#lbscurrCSS style").html(`[class^="message"] a[href$="=${PlayerID}"] { color: ${col} !important; }`);
                    }
                });
                $( "#lbschatcolor" ).on( "click", function() {checkChecked(PlayerID)} );
                return;
            }
        }
    }
})

const wrapper = document.querySelector('#profileroot');
const currenturl = location.href;

if(currenturl.startsWith("https://www.torn.com/profiles.php?XID=")) {
    observer.observe(wrapper, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
}

if(currenturl.startsWith("https://www.torn.com/index.php")) {
    $(".sortable-box:contains('General Information')").find(".info-cont-wrap > li.last").before(`<li><span class="divider"><span>Chat color</span></span><span class="desc"><a href="#" style="padding-left: 3px" title="Use this option if you experience trouble or would like to reset." id="lbs-chat-reset">Reset all chat colors.</a></span></li>`);
    $('#lbs-chat-reset').one('click', function(e) {
        flush();
        $(this).closest("li").slideUp();
        e.preventDefault();
        e.stopPropagation();
    });
}