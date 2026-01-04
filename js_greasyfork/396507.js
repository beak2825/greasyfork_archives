// ==UserScript==
// @name        TW2 ready (to die) - hide loading screen
// @namespace   Blood Killer
// @author      Jaroslav Jursa
// @homepage    https://forum.the-west.sk/index.php?threads/tw2pro.22238/
// @include     http*://*.the-west.*
// @exclude     http*://*forum.the-west.*
// @version     3
// @grant       none
// @run-at      document-start
// @description javascript:void $.getScript("//greasyfork.org/scripts/396507-tw2-ready-to-die-hide-loading-screen/code/TW2%20ready%20(to%20die)%20-%20hide%20loading%20screen.user.js")
// @downloadURL https://update.greasyfork.org/scripts/396507/TW2%20ready%20%28to%20die%29%20-%20hide%20loading%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/396507/TW2%20ready%20%28to%20die%29%20-%20hide%20loading%20screen.meta.js
// ==/UserScript==
/*


MIT License

Copyright (c) 2020 Jaroslav Jursa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


*/
document.location.pathname === "/game.php" && (function() {
    var temp = document.createElement("style");
    if (temp.type = "text/css",
        temp.innerHTML = ".loader,#ui-loader,#ui-mapfade,#tw2pro_loading_element_frame,.tw2gui_dialog_framefix[style*=\"9999\"]{display:none!important;}.tw2gui_window_content_pane{opacity:1!important;}",
        document.head.appendChild(temp),
        temp = function() {
            MousePopup.prototype.setTimeout = function() {
                    document.getElementById("popup").style.display = "block",
                        this.notify("onShow");
                },
                Config.get("gui.main.animations") && Config.set("gui.main.animations", false),
                TheWestApi.register("TW2ready2die", "TW2 ready (to die)", "2.10.0", "99", "Jaroslav Jursa (Blood Killer)", "https://greasyfork.org/sk/users/383161-jaroslav-jursa").setGui("<img style=\"border:1px solid;\" src=\"https://i.imgur.com/jPZPhXn.gif\" /><br><br>MIT License, Copyright (c) 2020 Jaroslav Jursa (Blood Killer)");
        },
        document.readyState === "complete") temp();
    else window.addEventListener("DOMContentLoaded", temp, false);
})();