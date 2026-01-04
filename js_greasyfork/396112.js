// ==UserScript==
// @name         自用—合格证批量顺序打开学员证书页面（新）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  合格证批量顺序打开学员证书页面，i值为1号学员的tid值，i<=学号最后一个学员的tid值。
// @author       You
// @match        http://222.172.224.41:8001/Home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396112/%E8%87%AA%E7%94%A8%E2%80%94%E5%90%88%E6%A0%BC%E8%AF%81%E6%89%B9%E9%87%8F%E9%A1%BA%E5%BA%8F%E6%89%93%E5%BC%80%E5%AD%A6%E5%91%98%E8%AF%81%E4%B9%A6%E9%A1%B5%E9%9D%A2%EF%BC%88%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/396112/%E8%87%AA%E7%94%A8%E2%80%94%E5%90%88%E6%A0%BC%E8%AF%81%E6%89%B9%E9%87%8F%E9%A1%BA%E5%BA%8F%E6%89%93%E5%BC%80%E5%AD%A6%E5%91%98%E8%AF%81%E4%B9%A6%E9%A1%B5%E9%9D%A2%EF%BC%88%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    document.getElementsByTagName("title")[0].innerText = 'vige提供—合格证批量顺序打开学员证书页面';
for(var i=667261;i<=667271;i++)
{var s="http://222.172.224.41:8001/baseInfo/businesss/Print?tid="+i;window.open(s);
 }
    // Your code here...
})();