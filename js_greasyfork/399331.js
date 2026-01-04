// ==UserScript==
// @name         SMTH_BLACKLIST
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  blacklist based on oooOOOooo's code
// @author       You
// @match        https://www.mysmth.net/nForum/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399331/SMTH_BLACKLIST.user.js
// @updateURL https://update.greasyfork.org/scripts/399331/SMTH_BLACKLIST.meta.js
// ==/UserScript==

(function() {

    var code = `
//黑名单，英文逗号分隔
//修改完记得刷新页面，重新加载这个js
var blacklist = "coollpe,xiaoju,baoai";

bArray = blacklist.split(',');

$("body").on('DOMSubtreeModified', "#body", function() {
//隐藏主题
document.querySelectorAll('a.c63f').forEach(a=>{
bArray.forEach(b=>{
if(a.innerText==b){
a.parentNode.parentNode.style.display = 'none';
}
});
});
//隐藏回复
document.querySelectorAll('span.a-u-name').forEach(n=>{
bArray.forEach(b=>{
if(n.childNodes[0].innerText==b){
n.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none"
}
});
});
});
`;

    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();

})();
