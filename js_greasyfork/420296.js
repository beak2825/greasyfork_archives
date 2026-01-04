// ==UserScript==
// @name         Dynalist image pasting
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Paste into top left Input Box then paste again into the list in app and press enter
// @author       You
// @match        https://dynalist.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420296/Dynalist%20image%20pasting.user.js
// @updateURL https://update.greasyfork.org/scripts/420296/Dynalist%20image%20pasting.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

(function() {
    GM_addStyle('img { width:100% }');
    $('body').append('<div class="AppHeader-pastebox" style="left: 18px; top: 2px;position: absolute; z-index:1000"><input data-lpignore="true" autocomplete="off" style="font-size: 16px; padding: 3px 0"></div>')
    $('.AppHeader-pastebox').on('paste', function (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        var clipboardData = ev.originalEvent.clipboardData;
        if (clipboardData) {
            if (clipboardData.items.length == 0)
                return;
            $.each(clipboardData.items, function (i, item) {
                if (item.type.indexOf("image") !== -1) {
                    insertBinaryImage(item.getAsFile(),ev);
                }
            });
            return false;
        }
    });

    // Inserts a base64-encoded image to the editor.
    function insertBinaryImage(file, ev) {
        var reader = new FileReader();
        reader.addEventListener('loadend', function () {
            $('.modal-container.file-upload-upsell.is-shown').removeClass('is-shown')
            let text = `![](${reader.result})`;
            navigator.clipboard.writeText(text).then(function() {
                $('.AppHeader-pastebox input').val('Copied!');
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });
        });
        reader.readAsDataURL(file);
    }
})();