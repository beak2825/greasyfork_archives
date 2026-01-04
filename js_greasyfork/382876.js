// ==UserScript==
// @name         Fluentcards background
// @description  Helps change css styles for the fluentcards page, read code comments
// @match        *://video.fluentcards.com/
// @match        file:///C:/path/to/your/file/Videobook.html
// @grant        none
// @version      1.03
// @namespace    https://greasyfork.org/users/300861
// @downloadURL https://update.greasyfork.org/scripts/382876/Fluentcards%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/382876/Fluentcards%20background.meta.js
// ==/UserScript==

// Various styles such as font sizes and colors can be customized by changing the values below.
// If you want to use a local fluentcards page, replace second @match with the url to your local fluentcards html file from the address bar. If using tampermonkey, this requires you to go to Extension Settings > Tamper Monkey > Details > "Allow Access to File URLs" switch to Checked

//-/-/-/-/-/-/-/-/-/-/-/-/-/-///
// Customization STARTS here. //
//-/-/-/-/-/-/-/-/-/-/-/-/-/-///

let mainBackgroundColor = "black"; // color names or hex codes work ex: "#E926FF", "orange"
let mainSubtitleFontSize = "medium"; // sizes or numberic values in px or em work ex: "14px", "medium"
let mainSubtitleFontColor = "dimgrey"; // color names or hex codes work ex: "#E926FF", "orange"
let mainSubtitleFontOutline = "unset" // change to "5px black" to try it. You will have to play with the size. [NOTE: Not well supported on Chrome. The outline will expand into the character, hiding it. It looks bad unless your font size is much larger than your stroke size.]
let fixSeekBarMouseover = false; // If you experience the problem that you can't use the seek bar because it doesn't show up when you mouse over it, change this to true. However, you won't be able to mouseover or select the main subs and will have to use the right-side ones.
let rightSidebarWidth = "0%"; // works with %, px, em. "0%" sets it to the smallest width possible. Increasing the % increases the width.
let rightSidebarBackgroundColor = "black"; // color names or hex codes work ex: "#E926FF", "orange"
let rightSidebarFontColor = "#777777"; // color names or hex codes work ex: "#E926FF", "orange"
let rightSidebarFontSize = "medium"; // sizes or numberic values in px or em work ex: "14px", "medium"
let rightSidebarMouseoverBackgroundColor = "#91aab1"; // The background color when you move your mouse over the right sidebar.
let rightSidebarMouseoverFontColor = "black"; // The text color when you move your mouse over the right sidebar.
let rightSidebarCurrentLineBackgroundColor = "#59757d"; // The background color of the subtitle line that is currently playing in the right sidebar.
let rightSidebarCurrentLineFontColor = "black"; // The text color of the subtitle line that is currently playing in the right sidebar.
let rightSidebarEndedLineBackgroundColor = "#4a6268"; // When there are no subtitles currently playing, the last played subtitle line will have this background color. Set this to a color slightly darker than the Current line color (or same color if you're lazy).
let rightSidebarEndedLineFontColor = "black"; // When there are no subtitles currently playing, the last played subtitle line will have this text color. You probably want the same color as the Current line text color.

//-/-/-/-/-/-/-/-/-/-/-/-/-///
// Customization ENDS here. //
//-/-/-/-/-/-/-/-/-/-/-/-/-///

// Below is the code.

// Main bg color
document.getElementsByClassName("vb-drop")[0].style.backgroundColor = mainBackgroundColor;
// Subtitle font size & font color
document.getElementsByClassName("vb-video__cc")[0].style.fontSize = mainSubtitleFontSize;
document.getElementsByClassName("vb-video__cc")[0].style.color = mainSubtitleFontColor;
// Subtitle font outline, also called "stroke". Make sure your font size is big enough relative to the thickness of the stroke. Paint order works on firefox but not chrome. On chrome, the stroke is centered rather than expanding out of the character.
document.getElementsByClassName("vb-video__cc")[0].style.webkitTextStroke = mainSubtitleFontOutline;
document.getElementsByClassName("vb-video__cc")[0].style.paintOrder = "stroke fill";
//document.getElementsByClassName("vb-video__cc")[0].style.webkitFontSmoothing = "subpixel-antialiased";
// Subtitle area width.
document.getElementsByClassName("home__aside")[0].style.flexBasis = rightSidebarWidth;
// Hide the title above the video
document.getElementsByClassName("home__title")[0].style.display = "none";

if (fixSeekBarMouseover) {
    // make mouse events go through the subtitle div
    document.getElementsByClassName("vb-video__cc")[0].style.pointerEvents = "none";
}

// Next part styles the elements that are created some time after the initial page load (such as subs, that are created when subs are added)

var targetNode = document.getElementsByClassName('home__captions')[0];
// Callback function to execute when mutations are observed (when subs are added)
var callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type != 'childList') {
            return;
        }
        mutation.addedNodes.forEach(function(elm) {
            if (elm.tagName === 'VB-CAPTIONS') {
                let memeattr = elm.firstChild.attributes[0].name;

                // Right sidebar default colors
                let cssTemplateString = '.vb-captions__caption[' + memeattr + '] {background-color: ' + rightSidebarBackgroundColor + ';}';
                cssTemplateString = cssTemplateString + '.vb-captions__caption[' + memeattr + '] {color: ' + rightSidebarFontSize + ';}';
                cssTemplateString = cssTemplateString + '.vb-captions__caption[' + memeattr + '] {font-size: ' + rightSidebarFontSize + ';}';
                // Right sidebar line hover colors
                cssTemplateString = cssTemplateString + '.vb-captions__caption[' + memeattr + ']:hover {background-color: ' + rightSidebarMouseoverBackgroundColor + ';}';
                cssTemplateString = cssTemplateString + '.vb-captions__caption[' + memeattr + ']:hover {color: ' + rightSidebarMouseoverFontColor + ';}';
                // Right sidebar line current active colors
                cssTemplateString = cssTemplateString + '.vb-captions__caption_active[' + memeattr + '] {background-color: ' + rightSidebarCurrentLineBackgroundColor + ';}';
                cssTemplateString = cssTemplateString + '.vb-captions__caption_active[' + memeattr + '] {color: ' + rightSidebarCurrentLineFontColor + ';}';
                // Right sidebar line previous colors
                cssTemplateString = cssTemplateString + '.vb-captions__caption_previous[' + memeattr + '] {background-color: ' + rightSidebarEndedLineBackgroundColor + ';}';
                cssTemplateString = cssTemplateString + '.vb-captions__caption_previous[' + memeattr + '] {color: ' + rightSidebarEndedLineFontColor + ';}';

                let styleTag = document.createElement("style");
                styleTag.innerHTML = cssTemplateString;
                document.head.insertAdjacentElement('beforeend', styleTag);
                observer.disconnect();
            }
        });
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);
var config = {childList: true, subtree: true };
observer.observe(targetNode, config);

// Fix display of 4:3 ratio videos
document.getElementsByClassName("vb-video")[0].style.display = "flex";
document.getElementsByClassName("vb-video")[0].style.maxHeight = "100vh";
//document.getElementsByClassName("vb-video__element")[0].style.flex = "1 1 auto";