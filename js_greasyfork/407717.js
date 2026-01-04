// ==UserScript==
// @name         WoD Duel Autostart Enhanced
// @namespace    https://www.wannaexpresso.com
// @version      0.1
// @description  try to take over the world!
// @author       DotIN13
// @include      http*://*.wannaexpresso.com/wod/spiel/tournament/duell.php*
// @include      http*://*.world-of-dungeons.*/wod/spiel/tournament/duell.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407717/WoD%20Duel%20Autostart%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/407717/WoD%20Duel%20Autostart%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertButton(node, value, func) {
        var newButton = document.createElement("input");
        newButton.setAttribute("type", "button");
        newButton.setAttribute("class", "button");
        newButton.setAttribute("value", value);
        newButton.addEventListener("click", func, false);
        node.parentNode.insertBefore(newButton, node.nextSibling);
    }

    // Frontend
    var header = document.getElementsByClassName("font_headline_h1")[0];
    if (header.innerHTML == "您的决斗" && header) {
        insertButton(header, "全部接受", e => handleDuel("accept"));
        insertButton(header, "全部拒绝", e => handleDuel("reject"));
        insertButton(header, "全部休息", e => handleDuel("prepare"));
    }

    // Button callbacks
    function handleDuel(type) {
        var nativeButtons = document.querySelectorAll("form>table input[type='submit']:last-child");
        var form = document.querySelector("form[name='the_form']");

        // Construct formdata from buttons
        var queryData = new FormData(form);
        for (const b of nativeButtons) {
            queryData.append(b.name.replace(/reject|prepare|accept/, type), "true");
        }

        // debug
        // for (const e of queryData) { console.log(e) }

        // POST duel form
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                location.reload();
            } else if (req.status == 404 || req.status == 502) {
                alert(req.status + "错误，请重试。")
            };
        };
        req.open("POST", form.action);
        req.send(queryData);
    }
})();