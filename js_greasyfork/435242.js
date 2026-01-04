// ==UserScript==
// @name         网页限制解除(终极版)
// @namespace    http://tampermonkey.net/
// @version      2.2.7
// @description  适应大部分网站,可以解除禁止复制、剪切、选择文本、右键菜单的限制。
// @author       franztutu
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @match             *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435242/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E7%BB%88%E6%9E%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435242/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E7%BB%88%E6%9E%81%E7%89%88%29.meta.js
// ==/UserScript==
(function() {

    function checkElementType() {
        var activeElement = document.activeElement;
        var inputs = ['input', 'select', 'button', 'textarea'];
        if (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
            return false;
        }
        return true;
    }

    function getSelectedText() {
        if(window.getSelection) {
            if (checkElementType()) {
                return window.getSelection().toString();
            }

        } else if(document.getSelection) {
            if (checkElementType()) {
                return document.getSelection();
            }
        } else if(document.selection) {
            if (checkElementType()) {
                return document.selection.createRange().text;
            }
        }
    }

    (function(){
        document.addEventListener("mouseup", (e) => {
            var copyText = getSelectedText();
            if(!copyText) return "";
            $("#_copy").remove();
            var template = `
                <div id="_copy"
                style="left:${e.pageX + 30}px;top:${e.pageY}px;width:60px;height:30px;background:#4C98F7;color:#fff;position:absolute;z-index:1000;display:flex;justify-content: center;align-items: center;border-radius: 3px;font-size: 13px;cursor: pointer;"
                data-clipboard-text="">复制</div>
            `;

            $("body").append(template);
            $("#_copy").attr("data-clipboard-text", copyText);
            $("#_copy").on("mousedown", (event) => {
                event.stopPropagation();
            })
            $("#_copy").on("mouseup", (event) => {
                event.stopPropagation();
            })
            var clipboard = new ClipboardJS('#_copy')
            clipboard.on('success', function (e) {
                $("#_copy").html("复制成功");
                setTimeout(() => $("#_copy").fadeOut(1000), 1000);
                e.clearSelection();
            })
            clipboard.on('error', function (e) {
                $("#_copy").html("复制失败");
                setTimeout(() => $("#_copy").fadeOut(1000), 1000);
                e.clearSelection();
            })
        });
    })();

    (function(){
        $("body").on("mousedown", (e) => {
            $("#_copy").remove();
        })
        document.oncopy = () => {}
        $("body").on("copy", (e) => {
            e.stopPropagation();
            return true;
        })
    })();
})();