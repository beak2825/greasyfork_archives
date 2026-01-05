// ==UserScript==
// @name        小粉红解锁代码生成脚本
// @namespace   bbs.jjwxc.net
// @description 仅适用于noframes锁帖法。进入被锁帖后自动生成解锁代码，复制后用&page=99大法回帖。生成结果依浏览器可能有不同，不保证对所有浏览器都有效，可尝试用不同浏览器生成后再次回帖。对已解锁贴有误伤，不解锁时最好禁用
// @include     http://bbs.jjwxc.net/showmsg.php*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1871/%E5%B0%8F%E7%B2%89%E7%BA%A2%E8%A7%A3%E9%94%81%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/1871/%E5%B0%8F%E7%B2%89%E7%BA%A2%E8%A7%A3%E9%94%81%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var body = document.getElementsByTagName("body")[0];
var noframesArr = document.getElementsByTagName("noframes");
var tagStr = "";
if(noframesArr.length>0)
{
    var last = noframesArr[noframesArr.length-1];
    while (last != null && last != body) {
            tagStr = tagStr + "</" + last.tagName + ">";
            last = last.parentElement;
        }
}
if (tagStr.length > 0)
    prompt("please copy：", tagStr);