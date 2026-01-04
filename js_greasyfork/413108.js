// ==UserScript==
// @name         洛谷刷犇犇
// @namespace    https://www.luogu.com.cn/user/352464
// @version      1.2
// @description  发愁犇犇发送太慢？用这个脚本！在洛谷的犇犇一次发送多条信息！
// @author       JJA
// @match        https://www.luogu.com.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413108/%E6%B4%9B%E8%B0%B7%E5%88%B7%E7%8A%87%E7%8A%87.user.js
// @updateURL https://update.greasyfork.org/scripts/413108/%E6%B4%9B%E8%B0%B7%E5%88%B7%E7%8A%87%E7%8A%87.meta.js
// ==/UserScript==

(function crNode2(){
    const status_html = `
<h3 align="center">刷犇犇</h3>
<div align="center"><small>您现在在使用刷犇犇脚本，点击“发射犇犇”会发射多个（P.S.如果遇到发不出去可以刷新）</small></div>
`;
    var node = document.createElement('div');
		node.className = 'lg-article';
		node.innerHTML = status_html;
    function sb(){
        for(i=0;i<2;i++){
            document.getElementById("feed-submit").click();
        }
    }
    document.querySelector('div.lg-index-benben > div:nth-child(2)').insertAdjacentElement('afterend', node);
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $("#feed-submit").click(function(){
        sb();
    });
})();