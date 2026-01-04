// ==UserScript==
// @name         jsoncn
// @namespace    https://blog.lovek.vip/
// @version      0.2
// @description  clean json.cn!
// @author       Rui
// @match        https://www.json.cn/
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471305/jsoncn.user.js
// @updateURL https://update.greasyfork.org/scripts/471305/jsoncn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_log('sorry, json.cn')
    document.getElementsByClassName('nav nav-tabs tab-after custom-tab custom-tab-two')[0].style.display = 'none'
    document.getElementById('loginRegBtnBox').style.display = 'none'

    var dropdowns = document.getElementsByClassName('dropdown')
    for(var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.display = 'none'
    }


    document.getElementsByClassName('footer-gg-b-addr')[0].style.display = 'none'
    document.getElementsByClassName('footer-nav-list')[0].style.display = 'none'

    // json 数据输入框高度
    var inputH = document.getElementsByClassName('editor-con')[0].clientHeight + 50
    document.getElementsByClassName('editor-con')[0].style.height = inputH +'px'

    //$('main .col-md-5').width('100px')
    $('#dragEle').css('left', '200px');

})();