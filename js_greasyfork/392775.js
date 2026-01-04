// ==UserScript==
// @name         放牧的风-将每条转换成url
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       chenngLee
// @match        https://www.youneed.win/free-ss
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392775/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E-%E5%B0%86%E6%AF%8F%E6%9D%A1%E8%BD%AC%E6%8D%A2%E6%88%90url.user.js
// @updateURL https://update.greasyfork.org/scripts/392775/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E-%E5%B0%86%E6%AF%8F%E6%9D%A1%E8%BD%AC%E6%8D%A2%E6%88%90url.meta.js
// ==/UserScript==

(function() {
 function utf8ToBase64(str){
  return btoa(unescape(encodeURIComponent(str)));
}
var s2 = document.querySelectorAll("#post-box > div > section > div > table > tbody > tr")
var ss_LinkList = [];
for (var i=0; i<s2.length; i++) {
ss_LinkList.push('ss://'+utf8ToBase64((s2[i].children[3].innerText+':'+s2[i].children[2].innerText+'@'+s2[i].children[0].innerText+':'+s2[i].children[1].innerText )));
}
console.log(ss_LinkList.join('\n'))

alert("请按F12,查看console")

})();