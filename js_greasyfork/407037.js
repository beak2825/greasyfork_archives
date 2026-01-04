// ==UserScript==
// @name         ctnma 档案表单辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   ctnma 档案表单去掉滚动条
// @author       skipto
// @match        http://www.ctnma.cn/ioop-bcs-web/archives/archives-info!view.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407037/ctnma%20%E6%A1%A3%E6%A1%88%E8%A1%A8%E5%8D%95%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/407037/ctnma%20%E6%A1%A3%E6%A1%88%E8%A1%A8%E5%8D%95%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

// for print
function UI(){
    var a = document.querySelector('#承办情况');
    var b = document.querySelector('#承办情况 > div > div > div.idea-item-list');
    var x = document.querySelector('#领导批示');
    var y = document.querySelector('#领导批示 > div > div > div.idea-item-list');
    if (a && b && x && y){
        console.log('change UI')
        a.style.height = "";
        a.style.minHeight = "200px";
        b.style.height = '100%';
        x.style.height = "";
        x.style.minHeight = "300px";
        y.style.height = '100%';
    }
    var td=document.querySelector("#form_content > table > tbody > tr:nth-child(3) > td:nth-child(2)");
    td.className = "clickselect"
    td.addEventListener("click", function (e) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNode(this);
        sel.removeAllRanges();
        sel.addRange(range);
    });
}


window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = '';
    var s = "[id='"+archivesId+"']";
    window.opener.document.querySelector(s).checked = true;
});
UI();
printForm();