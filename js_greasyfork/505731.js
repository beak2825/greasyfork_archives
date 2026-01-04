// ==UserScript==
// @name         编程猫html修复【较为安全】
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  编程猫html修复，对恶意代码进行防范
// @author       Fantasy
// @match        https://shequ.codemao.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @icon         https://static.codemao.cn/FjCi6RLz1-HB5C47m7M_0gZqJNDG
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505731/%E7%BC%96%E7%A8%8B%E7%8C%ABhtml%E4%BF%AE%E5%A4%8D%E3%80%90%E8%BE%83%E4%B8%BA%E5%AE%89%E5%85%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/505731/%E7%BC%96%E7%A8%8B%E7%8C%ABhtml%E4%BF%AE%E5%A4%8D%E3%80%90%E8%BE%83%E4%B8%BA%E5%AE%89%E5%85%A8%E3%80%91.meta.js
// ==/UserScript==

console.log('编程猫html修复已启用')
const tagList = ['embed', 'iframe', 'script', 'link', 'object']
const eventAttributes = [
    'onclick', 'onerror', 'onload', 'onmouseover', 'onmouseout',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
    'onselect', 'onabort', 'onkeydown', 'onkeypress', 'onkeyup',
    'onmousedown', 'onmousemove', 'onmouseup', 'ondblclick', 'oncontextmenu'
  ];
  

function edit_html(){
  const tagsPattern = tagList.map(tag => `<${tag}[^>]*>`).join('|');
  const regex = new RegExp(`${tagsPattern}|<\\/${tagsPattern}>`, 'gi');
    const eventAttributesPattern = eventAttributes.join('|');
    const regex2 = new RegExp(`<[^>]*?\\b(${eventAttributesPattern})\\b[^>]*>`, 'gi');

    $('.r-community-r-detail--forum_content,.r-community-r-detail-c-comment_item--content').each(function(){
        let old_content_str = $(this).html().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(regex,'').replace('<p style="color:orange">【检测到html格式排版,已自动修复】</p>','').replace(regex2, '');
        $(this).text('').append(`${old_content_str} ${old_content_str.includes('<') ? '<p style="color:orange">【检测到html格式排版,已自动修复】</p>' : ''}`)
        // 关闭提示请自行删除${old_content_str.includes('<') ? '<p style="color:orange">【检测到html格式排版,已自动修复】</p>' : ''}
    })


}

if(window.location.href.includes("https://shequ.codemao.cn/wiki") ||window.location.href.includes("https://shequ.codemao.cn/community/")){
    setInterval(edit_html,100)
}

