// ==UserScript==
// @name         WendaPlus: Save Questions as Markdown
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  保存问题内容为 Markdown
// @author       xgugugu
// @match        https://wenda.codingtang.com/questions/*/
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @require      https://cdn.staticfile.org/turndown/7.1.2/turndown.min.js
// @downloadURL https://update.greasyfork.org/scripts/483435/WendaPlus%3A%20Save%20Questions%20as%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/483435/WendaPlus%3A%20Save%20Questions%20as%20Markdown.meta.js
// ==/UserScript==

function getUrlBase64(url)
{
    return new Promise((resolve, reject) => {
        let canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = function() {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const dataURL = canvas.toDataURL("image/jpeg", 1);
            resolve(dataURL);
            canvas = null;
            img = null;
        };
        img.onerror = function() {
            reject(new Error("Could not load image at " + url));
        };
    });
}

if ($('.post-entry ').length > 0)
{
    $('.header_container')
        .children()
        .children()
        .append($('<button class="cws_button small">复制为Markdown</button>').click(async () => {
            for (let x of $('.post-entry ').children('.entry.alignleft').find('img'))
            {
                let url = await getUrlBase64($(x).attr('src'));
                $(x).attr('src', url);
            };
            navigator.clipboard
                .writeText(TurndownService().turndown($('.post-entry ').children('.entry.alignleft').html()))
                .then(() => { alert('已复制至剪贴板'); });
        }));
}
