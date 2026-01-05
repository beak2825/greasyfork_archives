// ==UserScript==
// @name        Discuz论坛快速回复添加签名选项
// @description 支持任意网站的Discuz论坛，没有签名实在是太难受了
// @namespace   5d53275bd82117e0173b77ee509df360
// @match     */thread*.html
// @match     */forum.php*mod=viewthread*
// @match     */viewthread.php*
// @version     2013.09.08.2
// @downloadURL https://update.greasyfork.org/scripts/11762/Discuz%E8%AE%BA%E5%9D%9B%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D%E6%B7%BB%E5%8A%A0%E7%AD%BE%E5%90%8D%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/11762/Discuz%E8%AE%BA%E5%9D%9B%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D%E6%B7%BB%E5%8A%A0%E7%AD%BE%E5%90%8D%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

if (document.getElementById("fastpostsubmit") && !document.getElementById("usesig")) {
    document.getElementById("fastpostsubmit").parentNode.innerHTML+="<input type='checkbox' id='usesig' name='usesig' checked='checked' value='1'><label for='usesig'>签名档</label>"
}