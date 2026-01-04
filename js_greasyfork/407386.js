// ==UserScript==
// @name         WoD Skill Config Insertion
// @namespace    https://www.wannaexpresso.com
// @version      0.3
// @description  Make it easier to insert actions in skill config.
// @author       DotIN13
// @include      https://*.wannaexpresso.com/wod/spiel/hero/skillconf*
// @include      http*://*.world-of-dungeons.*/wod/spiel/hero/skillconf*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407386/WoD%20Skill%20Config%20Insertion.user.js
// @updateURL https://update.greasyfork.org/scripts/407386/WoD%20Skill%20Config%20Insertion.meta.js
// ==/UserScript==

WodUiActionList.prototype.insertAction = function(action, index) {
    this.list.insertItem(new WodUiActionListItem(action), index);
};

(function () {
    'use strict';

    // Frontend button
    var insertButton = document.createElement("div");
    insertButton.innerHTML = "插入";

    // Add insertion button to both preroundAction and roundAction lists
    ["preroundActionList", "roundActionList"].forEach(el => {
        var _this = THE_ORDERS.dungeon.level[el];

        // Add a text button using native JavaScript to distinguish from the existing copy button
        var insertButton = document.createElement("button");
        insertButton.innerHTML = "插";
        insertButton.setAttribute("style", "color: white; background-color: #191919; width: 24px; height: 24px; padding: 0; text-align: center; font-weight: bold;");
        insertButton.addEventListener("click", function(e) {
            e.preventDefault();
            var src = _this.getSelectedAction();

            if (typeof src != undefined) {
                var dst = new WodAction();

                dst.copyFrom(src);
                _this.insertAction(dst, _this.list.getSelectedIndex());
                _this.rebuildModel();
                _this.list.setSelectedIndex( _this.list.getSelectedIndex()+1 );
            }
        });

        _this.list.buttonTd.element.appendChild(insertButton);

        /*_this.list.addButton(new WodUiImage('button-copy.png', 24, 24, "插入"), function() {
            var src = _this.getSelectedAction();

            if (typeof src != undefined) {
                var dst = new WodAction();

                dst.copyFrom(src);
                _this.insertAction(dst, _this.list.getSelectedIndex());
                _this.rebuildModel();
                _this.list.setSelectedIndex( _this.list.getSelectedIndex()+1 );
            }
        })*/

        // Make buttons sticky
        var buttons = _this.list.buttonTd.element;
        var stickyButtons = document.createElement("div");
        while (buttons.childNodes.length) {
            stickyButtons.appendChild(buttons.firstChild);
        }
        buttons.appendChild(stickyButtons);
        stickyButtons.setAttribute("style", "position: sticky; top: 0;");
        _this.list.buttonTd = stickyButtons;

        // Make modBox sticky
        _this.modBox.element.setAttribute("style", "width: 300px; padding-bottom: 10px; float: right; position: sticky; top: 0;");
    })
})();
