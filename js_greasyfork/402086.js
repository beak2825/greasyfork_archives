// ==UserScript==
// @name         ConfluenceAddMarkdown
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Confluence 快速插入 Markdown 宏 和 目录宏
// @author       mocobk
// @match        https://confluence.sui.work/pages/createpage.action*
// @match        https://confluence.sui.work/pages/editpage.action*
// @match        https://confluence.sui.work/pages/resumedraft.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402086/ConfluenceAddMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/402086/ConfluenceAddMarkdown.meta.js
// ==/UserScript==

const mdContentStr = `
<div><table class="wysiwyg-macro" data-macro-name="html" data-macro-id="250dad51-272f-4812-ba99-f7d9a1fa1efd" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" style="background-image: url(/plugins/servlet/confluence/placeholder/macro-heading?definition=e2h0bWx9&amp;locale=zh_CN&amp;version=2); background-repeat: no-repeat"><tbody><tr><td class="wysiwyg-macro-body"><pre>&lt;script src = "https://mocobk.gitee.io/catalogjs/catalog.js"&gt;&lt;/script&gt;</pre></td></tr></tbody></table>
<p><br></p>
<table class="wysiwyg-macro" data-macro-name="markdown" data-macro-id="cf737580-1d5b-4774-9ccc-38701bbbbd02" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" style="background-image: url(/plugins/servlet/confluence/placeholder/macro-heading?definition=e21hcmtkb3dufQ&amp;locale=zh_CN&amp;version=2); background-repeat: no-repeat"><tbody><tr><td class="wysiwyg-macro-body"><pre><br></pre></td></tr></tbody></table></div>
`
function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.firstElementChild;
};

// 添加操作按钮
function addOptionBtn(){
    let title = null;
    let timer = setInterval(() => {
        title = $('#content-title-div')[0];
        if (!!title){
            let btnE = parseDom(`<a href="#" style="margin-left: 10px;">插入Markdown</a>`);
            btnE.addEventListener('click', () => {
                let editIframe = document.getElementById('wysiwygTextarea_ifr');
                let editBody = editIframe.contentDocument.getElementById('tinymce');
                let mdContentEl = parseDom(mdContentStr);
                editBody.firstElementChild.before(mdContentEl);
            });
            title.before(btnE);
            clearInterval(timer);
        }
    }, 500);


};


(function() {
    'use strict';
    addOptionBtn();

})();