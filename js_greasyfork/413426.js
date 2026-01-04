// ==UserScript==
// @name              激战2维基辅助 一键复制API ID
// @name:en           API ID copy tool on wiki.guildwars2.com
// @namespace         https://greasyfork.org/scripts/413426
// @version           1.1
// @description       在激战2维基百科上，一键复制技能、特性和物品等的 ID 代码
// @description:en    add a button to copy API ID code of items, skills, traits on wiki.guildwars2.com
// @icon              https://wiki.guildwars2.com/favicon.ico
// @author            买本子@bilibili
// @run-at            document-end
// @require           https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @match             https://wiki.guildwars2.com/wiki/*

// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/413426/%E6%BF%80%E6%88%982%E7%BB%B4%E5%9F%BA%E8%BE%85%E5%8A%A9%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6API%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/413426/%E6%BF%80%E6%88%982%E7%BB%B4%E5%9F%BA%E8%BE%85%E5%8A%A9%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6API%20ID.meta.js
// ==/UserScript==

/* global $ */

// 作者简介
// 买本子@bilibili

// 如有 Bug 请在 greasyfork.org 我的脚本评论区进行反馈。
// 私人脚本可联系我付费定制，QQ：610915518

// 版权申明
// 本脚本为 买本子@bilibili 原创，未经作者授权禁止转载，禁止转载范围包括但不仅限于：贴吧、NGA论坛等。

$('a[rel="nofollow"][class="external text"]').each(function(){
    if ($(this).attr("href") && $(this).attr("href").startsWith("https://api.guildwars2.com/v2") ) {
        var iidd = $(this).attr("href").toString().split("ids=", 2)[1].split("&", 2)[0];
        var text_copy_items = '<button type="button" onclick=copyBtnItems('+iidd +')>copy 物品</button>';
        var text_copy_traits = '<button type="button" onclick=copyBtnTraits('+iidd +')>copy 特性</button>';
        var text_copy_skills = '<button type="button" onclick=copyBtnSkills('+iidd +')>copy 技能</button>';
        var text_copy = '<button type="button" onclick=copyBtnID('+iidd +')>copy '+iidd+'</button>';

        $(this).after(text_copy_traits);
        $(this).after(text_copy_skills);
        $(this).after(text_copy_items);
        $(this).after(text_copy);
    };
});


var ctc = `<script>

function copyBtnID(iidd) {
    navigator.clipboard.writeText(iidd);
}

function copyBtnItems(iidd) {
    var stringText = '<span data-armory-embed="items" data-armory-ids="iidd" data-armory-inline-text="wiki" data-armory-size="24" />'.replaceAll("iidd", iidd);
    navigator.clipboard.writeText(stringText);
}

function copyBtnTraits(iidd) {
    var stringText = '<span data-armory-embed="traits" data-armory-ids="iidd" data-armory-inline-text="wiki" data-armory-size="24" />'.replaceAll("iidd", iidd);
    navigator.clipboard.writeText(stringText);
}

function copyBtnSkills(iidd) {
    var stringText = '<span data-armory-embed="skills" data-armory-ids="iidd" data-armory-inline-text="wiki" data-armory-size="24" />'.replaceAll("iidd", iidd);
    navigator.clipboard.writeText(stringText);
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}
</script>`

$('#globalWrapper').after(ctc);