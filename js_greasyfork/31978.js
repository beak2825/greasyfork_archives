// ==UserScript==
// @name         Spotify hotkeys
// @version      1.9.4
// @description  Allows hotkeys and media keys to control the Spotify web player from any tab
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Spotify%20hotkeys]%20
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/31978/Spotify%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/31978/Spotify%20hotkeys.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

const playpauseButton = "[data-testid=control-button-playpause]";
const previousButton = "[data-testid=control-button-skip-back]";
const skipButton = "[data-testid=control-button-skip-forward]";
const loveButton = '#context-menu > ul > li:has([d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"]) > button:has([style*="#656565"])';
const unloveButton = '#context-menu > ul > li:has([d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z"]) > button:has([style*="#107434"])';
const rightclickTrackButton = () => document.querySelector("[data-testid=context-item-info-title] > span > a")?.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
const clickContextButton = (button) => {
    rightclickTrackButton();
    setTimeout(() => { document.querySelector(button)?.click() ?? rightclickTrackButton() }, 0);
};
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && e.key == "p" || e.key == "MediaPlayPause")
        GM_setValue("ctrl", playpauseButton);
    if (e.ctrlKey && e.altKey && e.key == "s" || e.key == "MediaStop")
        GM_setValue("ctrl", "stop");
    if (e.ctrlKey && e.altKey && e.key == "," || e.key == "MediaTrackPrevious")
        GM_setValue("ctrl", previousButton);
    if (e.ctrlKey && e.altKey && e.key == "." || e.key == "MediaTrackNext")
        GM_setValue("ctrl", skipButton);
    if (e.ctrlKey && e.altKey && e.key == "l")
        GM_setValue("ctrl", "love");
    if (e.ctrlKey && e.altKey && e.key == "u")
        GM_setValue("ctrl", "unlove");
}, false);
if (document.domain == "open.spotify.com") {
    setInterval(function () {
        let ctrl = GM_getValue("ctrl");
        if (!ctrl)
            return;
        if (ctrl == "stop"){
            if (document.title.includes(" • "))
                document.querySelector(playpauseButton)?.click();
        }
        else if (ctrl == "love"){
            clickContextButton(loveButton);
        }
        else if (ctrl == "unlove"){
            clickContextButton(unloveButton);
        } else {
            document.querySelector(ctrl)?.click();
        }
        GM_setValue("ctrl", "");
    }, 100);
}
