// ==UserScript==
// @name           Select Code Block Buttons
// @namespace      stackoverflow
// @include        *stackoverflow.com*
// @include        *stackexchange.com*
// @include        *stackapps.com*
// @version        2.0
// @description    Add select button to select code blocks in stackoverflow
// @downloadURL https://update.greasyfork.org/scripts/383089/Select%20Code%20Block%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/383089/Select%20Code%20Block%20Buttons.meta.js
// ==/UserScript==

(function () {
    function with_jquery(f) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.textContent = "(" + f.toString() + ")(jQuery)";
        document.body.appendChild(script);
    };

    with_jquery(function ($) {
        addButtons();
        function selectText(element) {
            let doc = document;
            if (doc.body.createTextRange) {
                let range = doc.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) {
                let selection = window.getSelection();
                let range = doc.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        function addButtons() {
            $("pre").each(function (i, codeBlock) {
                var qContainer = $("<div style='position: relative;'></div>");
                var id = "select-button-" + i;
                $(codeBlock).replaceWith(qContainer);
                qContainer.append(codeBlock);

                qContainer.mouseenter(function() {
                    var qButton = $('<div style="position: absolute; opacity: 0.6; display: inline; cursor: pointer; background-color: rgb(0, 0, 0); color: rgb(255, 255, 255); font-size: 12pt; padding: 3px; right: 0; top: 0;">Select</div>');
                    qButton.attr("id", id);
                    qContainer.append(qButton);


                    qButton.click(function() {
                        selectText(codeBlock);
                    });
                    qButton.stop(true, true).animate({ opacity: '+=0.6' });
                });

                qContainer.mouseleave(function() {
                    $("#" + id)
                    .stop(true, true)
                    .animate({ opacity: '-=0.6' }, function () { 
                        $("#" + id).remove(); 
                    });
                });
            });
        }
    });
})();