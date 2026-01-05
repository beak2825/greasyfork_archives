// ==UserScript==
// @name         GitHub CopyCode
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @version      0.4
// @description  Copy content of a code-block everywhere on GitHub
// @author       Peter Badida
// @copyright    2016+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/CopyCode
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://assets-cdn.github.com/favicon.ico
// @include      *github.com*
// @exclude      *gist.github.com*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @downloadURL https://update.greasyfork.org/scripts/20196/GitHub%20CopyCode.user.js
// @updateURL https://update.greasyfork.org/scripts/20196/GitHub%20CopyCode.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function () {
    function selectText(element) {
        var range;
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    function addButtons() {
        $("pre").each(function (i, codeBlock) {
            var id = "codeButton-" + i;
            var parentId = "codeButton-parent-" + i;
            var codeContainer = $('<div id="' + parentId + '"></div>');

            // ignore PRE if it's a GH online editor
            if (~String(codeBlock.getAttribute("class")).indexOf("CodeMirror")) {
                return;
            }

            // ignore PRE if it already has a button
            var oldId = codeBlock.parentNode.getAttribute("id");
            if (~String(oldId).indexOf("-parent-")) {
                return;
            }

            // put PRE block into DIV for easier adding of COPY button
            $(codeBlock).replaceWith(codeContainer);
            codeContainer.append(codeBlock);

            // mark the container, so that it's ignored later
            codeContainer.attr("id", parentId);

            // create COPY button on mouse enter
            codeContainer.mouseenter(function () {
                var codeButton = $('<div style="background-color: #000; ' +
                                   'color: #fff; cursor: pointer; display:' +
                                   'inline; font-size: 12pt; opacity: 0.5;' +
                                   'padding: 3px; position: absolute;">Copy' +
                                   '</div>');

                // give button an ID for easier removing later
                codeButton.attr("id", id);

                codeContainer.append(codeButton);
                codeButton.css('top', codeContainer.position().top);
                codeButton.css('left',
                               codeContainer.position().left +
                               codeContainer.width() - 50);

                // select the whole text in PRE and copy to the clipboard
                codeButton.click(function () {
                    selectText(codeBlock);
                    document.execCommand("copy");
                });

                // hovering styles
                codeButton.mouseover(function () {
                    codeButton.css('opacity', 1.0);
                });
                codeButton.mouseleave(function () {
                    codeButton.css('opacity', 0.5);
                });
            });

            // remove COPY button on mouse leave
            codeContainer.mouseleave(function () {
                $("#" + id).remove();
            });
        });
    }

    function appendMe() {
        var av_style = "opacity: 0.3; border-radius: 10px;"
        var av_cont_style = "margin: 2px 10px -2px 0px;"
        var av = $('<li style="' + av_cont_style + '">' +
                   '<div style="float: right;"><a href="' +
                   'https://github.com/KeyWeeUsr/Userscripts">' +
                   '<img id="kwu_av" style="' + av_style + '" ' +
                   'src="https://github.com/identicons/KeyWeeUsr.png" ' +
                   'width="24"></img></a></div></li>');

        av.mouseenter(function () {
            $('#kwu_av').css('opacity', 1.0);
        });

        av.mouseleave(function () {
            $('#kwu_av').css('opacity', 0.3);
        });
        $('.pagehead-actions').prepend(av);
    }

    function run() {
        addButtons();
        if (!document.getElementById('kwu_av')){
            appendMe();
        }
    }
    // repeat in case of switching e.g. GH tabs
    var runCheck = setInterval(run, 250)
})();
