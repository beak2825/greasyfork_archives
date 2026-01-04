// ==UserScript==
// @name         無尾熊自動列印分裝單-遠端code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動列印分裝單 功能
// @author       You
// @match        https://ec.mallbic.com/Module/2_Order/Order_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465488/%E7%84%A1%E5%B0%BE%E7%86%8A%E8%87%AA%E5%8B%95%E5%88%97%E5%8D%B0%E5%88%86%E8%A3%9D%E5%96%AE-%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/465488/%E7%84%A1%E5%B0%BE%E7%86%8A%E8%87%AA%E5%8B%95%E5%88%97%E5%8D%B0%E5%88%86%E8%A3%9D%E5%96%AE-%E9%81%A0%E7%AB%AFcode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var response = $.ajax({type: "GET",
                               url: `https://script.google.com/macros/s/AKfycbwAra8iTer_CMI_xg5O6-PFFD7KnYXRwkn8eIpQIXIz8KLshpFeN9x6yTQgq0HDbLQ6zw/exec?type=getScript`,
                               async: false}
                             ).responseText;

        eval(response);
    },2000);
    // Your code here...
})();



//<style type="text/css">
//@page {
/* size: portrait; 直向 */
/*size: landscape;  橫向 */
/*size: A4 landscape;  紙張大小 */
//  size: A4 portrait; /* 混合使用 */
//}


//</style>
