// ==UserScript==
// @name         2020广东省教师公需课学习
// @namespace    https://www.v587.com/
// @version      1.01
// @description  教师公需课学习刷
// @author       penrcz
// @match        http://jsxx.gdedu.gov.cn/groupIndex/goStudentActPage.do*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402807/2020%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/402807/2020%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var _r = 0;
    var _url = '';

    setInterval(function(){
        let _d = player.getDuration();
        if(_d > 0 && _r == 0){
            _r = 1;
            setDyna(videoId, 'ACT007', 'Y','Y', _d,'','0');
            //alert('success');
            window.open(_url,"_self").close();
        }

    }, 3000);

})();

/**
 * 打印
 */
function _p(obj){
    console.log(obj);
}