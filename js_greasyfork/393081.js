// ==UserScript==
// @name         放牧的风-获取免费ss（到https://www.youneed.win/free-ss 按F5）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youneed.win/free-ss
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393081/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E-%E8%8E%B7%E5%8F%96%E5%85%8D%E8%B4%B9ss%EF%BC%88%E5%88%B0https%3Awwwyouneedwinfree-ss%20%E6%8C%89F5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/393081/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E-%E8%8E%B7%E5%8F%96%E5%85%8D%E8%B4%B9ss%EF%BC%88%E5%88%B0https%3Awwwyouneedwinfree-ss%20%E6%8C%89F5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
 function utf8ToBase64(str){
  return btoa(unescape(encodeURIComponent(str)));
}
function saveShareContent (content, fileName) {
    let downLink = document.createElement('a')
    downLink.download = fileName
    //字符内容转换为blod地址
    let blob = new Blob([content])
    downLink.href = URL.createObjectURL(blob)
    // 链接插入到页面
    document.body.appendChild(downLink)
    downLink.click()
    // 移除下载链接
    document.body.removeChild(downLink)
}
var s2 = document.querySelectorAll("#post-box > div > section > div > table > tbody > tr")
var ss_LinkList = [];
for (var i=0; i<s2.length; i++) {
    var temp = ''
    for(var j = 0 ; j < s2[i].children.length ; j++){
        if(j==0){
            continue
           }
        temp+=('  '+s2[i].children[j].innerText)
    }
     ss_LinkList.push(temp)
}
saveShareContent(ss_LinkList.join('\n'),'ss')
console.log(ss_LinkList.join('\n'))

})();