// ==UserScript==
// @name         获取百度百科条目的概要
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://baike.baidu.com/item/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/limonte-sweetalert2/8.11.8/sweetalert2.all.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406606/%E8%8E%B7%E5%8F%96%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E6%9D%A1%E7%9B%AE%E7%9A%84%E6%A6%82%E8%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/406606/%E8%8E%B7%E5%8F%96%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E6%9D%A1%E7%9B%AE%E7%9A%84%E6%A6%82%E8%A6%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

   const css = `
._imzhi_button {
    font-size: 18px;
    padding: 5px;
}
`;
    GM_addStyle(css);

    // 去掉 [1] 类似的文本，并且将双引号替换为实体字符
    function filter(text) {
        return text.replace(/\s*\[\d+(?:\-\d+)?\]\s*/g, '').replaceAll('"', '&quot;');
    }

    var text = '';
    document.querySelectorAll('#root .J-summary [data-tag="paragraph"]').forEach(function (el) {
        text += filter(el.innerText);
    });
    setTimeout(function() {
        Swal.fire({
            html:
            '<textarea class="swal2-textarea" id="imzhi-baike-textarea" data-clipboard-target="#imzhi-baike-textarea">'+text+'</textarea>',
            showConfirmButton: false,
            onOpen: function() {
                new ClipboardJS('#imzhi-baike-textarea');
            },
        });
    }, 200);

    const $para_title = $('#root .J-lemma-content').eq(0);
    if (!$para_title.length) {
        return;
    }

    const intro_filter = [];
    $para_title.find('[data-tag="paragraph"] [data-text="true"]').each(function (i, elm) {
        intro_filter.push(filter($(elm).text().trim()));
    })
    console.log('intro_filter__', intro_filter)

    if (!intro_filter.length) {
        return;
    }
    const $intro_btn = $(`<button type="button" id="imzhi-baike-intro" class="_imzhi_button" data-clipboard-text="${intro_filter.filter(t => !!t).join("\n\n")}">复制剧情简介</button>`);
    new ClipboardJS('#imzhi-baike-intro');
    $para_title.before($intro_btn);
})();