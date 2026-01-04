// ==UserScript==
// @name         ComfyUI Textarea Text Drag Enabler
// @name:en      ComfyUI Textarea Text Drag Enabler
// @name:ja      ComfyUI テキストエリアのテキストドラッグを有効化
// @namespace    https://greasyfork.org/ja/users/1091033-zalucas
// @version      1.0.2
// @description  Enables dragging and dropping to move selected text within textareas in ComfyUI. This overrides the default file-drop behavior on these areas.
// @description:en Enables dragging and dropping to move selected text within textareas in ComfyUI. This overrides the default file-drop behavior on these areas.
// @description:ja ComfyUIのテキストエリア内で、選択したテキストをドラッグ＆ドロップで移動できるようにします。このスクリプトは、テキストエリアへのファイルドロップ機能を上書きします。
// @author       ai
// @match        http://127.0.0.1*
// @match        http://localhost*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/543502/ComfyUI%20Textarea%20Text%20Drag%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/543502/ComfyUI%20Textarea%20Text%20Drag%20Enabler.meta.js
// ==/UserScript==

// Original idea from: https://github.com/Comfy-Org/ComfyUI_frontend/pull/3776


(function() {
    'use strict';
    console.log('ComfyUI Textarea Text Drag Enabler is active.');
    document.addEventListener('drop', (event) => {
        if (event.target && event.target.tagName === 'TEXTAREA') {
            event.stopImmediatePropagation();
        }
    }, { capture: true });
})();