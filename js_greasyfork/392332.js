// ==UserScript==
// @name        TW2Pro tools
// @namespace   Blood Killer
// @author      Jaroslav Jursa
// @homepage    https://forum.the-west.sk/index.php?threads/tw2pro.22238/
// @include     http*://*.the-west.*
// @exclude     http*://forum.the-west.*
// @version     1
// @grant       none
// @run-at      document-idle
// @description javascript:void $.getScript("//greasyfork.org/scripts/392332-tw2pro-tools/code/TW2Pro%20tools.user.js")
// @downloadURL https://update.greasyfork.org/scripts/392332/TW2Pro%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/392332/TW2Pro%20tools.meta.js
// ==/UserScript==
/*


MIT License

Copyright (c) 2014-2019 Jaroslav Jursa

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
(function() {
    if (typeof TW2Pro === "undefined") TW2Pro = {};
    TW2Pro.ui = {};
    TW2Pro.inventory = {};
    TW2Pro.mousePopup = {
        filter: function(text) {
            return /inventory_popup/.test(text) ? text.replace(/(<\/div><div>)(<img src="[^"]+divider\.png[^>]+><\/div><\/div>)/, '$1<span><b>Item ID:</b> <span class="tw2pro_item_id">?</span></span><br>$2<br>').replace(/(<[^>]+>)([\d ]+)(<\/[^>]+>)(\s*\-\s*)(<[^>]+>)([\d ]+)(<\/[^>]+>)([^(]+)(<\/[^>]+>)/, function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
                return $1 + $2 + $3 + $4 + $5 + $6 + $7 + " (~" + ((+$2 + (+$6)) / 2) + ")" + $8 + $9;
            }) : text;
        }
    };
    TW2Pro.ui.dialog = {
            itemInfoKeyDown: false,
            close: function(i) {
                var dialog = document.getElementsByClassName("tw2gui_dialog_framefix")[i || 0];
                if (dialog) dialog.parentNode.removeChild(dialog);
            }
        },
        TW2Pro.ui.tw2guiButton = function(title, onclick, style) {
            return '<div' + (style ? ' style="' + style + '"' : "") + ' onclick="' + onclick + '" class="tw2gui_button"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="tw2gui_button_middle_bg"></div><div class="textart_title">' + title + '</div></div>';
        };
    TW2Pro.skinPacksInfo = function() {
        new west.gui.Dialog().setTitle('Skin packs coming soon...').setText('<div>skript na skiny e\u0161te nie je hotov\u00fd, pre viac info sledujte vl\u00e1kno na f\u00f3re<br><br>&nbsp;&nbsp;<a target="_blank" href="https://forum.the-west.sk/index.php?threads/tw2pro.22238/page-2">https://forum.the-west.sk/index.php?threads/tw2pro.22238/page-2</a><br>&nbsp;&nbsp;<a target="_blank" href="https://forum.the-west.cz/index.php?threads/tw2pro.28911/page-2">https://forum.the-west.cz/index.php?threads/tw2pro.28911/page-2</a><br><br>\u010dakanie si m\u00f4\u017eete spr\u00edjemni\u0165 meme obr\u00e1zkami s t\u00e9matikou The West<br><br>&nbsp;&nbsp;<a target="_blank" href="https://forum.the-west.cz/index.php?threads/the-west-memes.31153/">https://forum.the-west.cz/index.php?threads/the-west-memes.31153/</a><br><br>alebo zauj\u00edmavou h\u00e1dankou, co m\u00e1 marcelka v kabelce<br><br>&nbsp;&nbsp;<a target="_blank" href="https://forum.the-west.cz/index.php?threads/co-m%C3%A1-marcelka-v-kabelce.31157/">https://forum.the-west.cz/index.php?threads/co-m%C3%A1-marcelka-v-kabelce.31157/</a></div>').addButton('Ok').show();
    };
    document.addEventListener("keyup", function(e) {
        if (e.keyCode === 17)
            if (TW2Pro.ui.dialog.itemInfoKeyDown) TW2Pro.ui.dialog.itemInfoKeyDown = false;
            else TW2Pro.ui.dialog.close();
    });
    document.addEventListener("keydown", function(e) {
        if (e.keyCode === 17 && !document.getElementsByClassName("tw2gui_dialog_framefix")[0] && document.getElementById("popup").style.display === "block" && !isNaN(+document.getElementsByClassName("tw2pro_item_id")[0].textContent)) {
            var width = (document.getElementsByClassName("mousepopup")[0].offsetWidth - 36) + "px";
            TW2Pro.ui.dialog.itemInfoKeyDown = true,
                new west.gui.TextInputDialog().setWidth(width).setTitle("Item info").setText(document.getElementsByClassName("popup_content")[0].innerHTML + "<br>" + TW2Pro.ui.tw2guiButton("Add to skin pack", "TW2Pro.skinPacksInfo()") + "<br><br>Item BB code.").addButton("Copy", function() {
                    input.select(),
                        document.execCommand("copy");
                }).show();
            var input = document.getElementsByClassName("tw2gui_dialog")[0].getElementsByTagName("input")[0];
            document.getElementsByClassName("tw2gui_dialog")[0].style.minWidth = width,
                document.getElementsByClassName("fbar-add-dialog")[0].style.textAlign = "left",
                input.value = "[item=" + TW2Pro.inventory.itemId + "]",
                input.readOnly = true,
                input.onclick = function() {
                    this.select();
                },
                input.select();
        };
    });
    var inventory = Inventory.open,
        setxhtml = MousePopup.prototype.setXHTML,
        updateposition = MousePopup.prototype.updatePosition;
    MousePopup.prototype.setTimeout = function() {
            document.getElementById("popup").style.display = "block",
                this.notify("onShow");
        },
        MousePopup.prototype.setXHTML = function() {
            arguments[0] = TW2Pro.mousePopup.filter(arguments[0]);
            return setxhtml.apply(this, arguments);
        },
        MousePopup.prototype.updatePosition = function() {
            var itemId = $(arguments[0].target).data("itemId");
            updateposition.apply(this, arguments);
            if (itemId && TW2Pro.inventory.itemId !== itemId) TW2Pro.inventory.itemId = itemId;
            else if (document.getElementsByClassName("tw2pro_item_id")[0]) document.getElementsByClassName("tw2pro_item_id")[0].textContent = itemId || "?";
        },
        Inventory.open = function() {
            var windowInventory = document.getElementsByClassName("tw2gui_win2 inventory")[0];
            var filter = function() {
                var focused = windowInventory.className.match(/focused_([^ ]*)/)[1];
                Array.prototype.forEach.call(document.getElementById("bag").getElementsByTagName("div"), function(item) {
                    var popup = item._mpopup.text = item._mpopup.text;
                    item.style.opacity = focused === "wear" || focused === "marketplace" && /inventory_popup_auctionable/.test(popup) || focused === "new_item_shop" && !/not_sellable/.test(item.className) || focused === "win_item_upgrade" && !/not_upgradeable/.test(item.className) ? "1" : "0.5";
                });
            };

            if (!wman.getById("inventory")) {
                var original = inventory.apply(this, arguments);
                windowInventory = document.getElementsByClassName("tw2gui_win2 inventory")[0];
                return windowInventory.getElementsByClassName("filters")[0].addEventListener("click", filter),
                    windowInventory.getElementsByClassName("bag_navigation")[0].addEventListener("click", filter),
                    filter(), original;
            } else {
                var original = inventory.apply(this, arguments);
                filter();
                return original;
            };

        };
    TheWestApi.register("TW2ProTools", "TW2Pro tools", "2.10.0", "99", "Jaroslav Jursa (Blood Killer)", "https://greasyfork.org/sk/users/383161-jaroslav-jursa").setGui("MIT License, Copyright (c) 2014-2019 Jaroslav Jursa (Blood Killer)");
})();