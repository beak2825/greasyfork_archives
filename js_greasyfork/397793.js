// ==UserScript==
// @name           殁漂遥（停止更新）
// @namespace   ACScript
// @version         1.2020.5.5
// @description   老殁已经利益熏心，变成了他眼里的靠XX软件赚钱的人，恶心
// @author          小殁
// @include         *://www.mpyit.com/*
// @grant            none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/397793/%E6%AE%81%E6%BC%82%E9%81%A5%EF%BC%88%E5%81%9C%E6%AD%A2%E6%9B%B4%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/397793/%E6%AE%81%E6%BC%82%E9%81%A5%EF%BC%88%E5%81%9C%E6%AD%A2%E6%9B%B4%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

//半自动填暗号
(function() {
	setTimeout(function(){
		document.querySelector("#comein").value = "1052"
	}, 1000);

//去除复制弹窗
(function() {
document.body.oncopy=null;void(0);
   })();

    //文本变链接
document.onclick = function(e) {
    var link = /((https?:\/\/)(\.|\w|-|#|\?|=|\/|\+|@|%|&|:|;|!|\*|(?![\u4e00-\u9fa5\s*\n\r'"]))+)/g;
    if (!e.target.innerHTML.match(/<a/) && e.target.innerText.match(link) && e.path.length > 4) {
        e.target.innerHTML = e.target.innerHTML.replace(link ,'<a target="_blank" href="$1" style="text-decoration:underline;">$1</a>');
    }
};

})();