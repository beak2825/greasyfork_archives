// ==UserScript==
// @name         FM_luckair
// @namespace    http://ren.min.bi/
// @version      0.2.9
// @description  for fandamiao work
// @author       Zhilun
// @match        https://fltnet.hnair.net/crew/assistant/attendance/query-attendance.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368287/FM_luckair.user.js
// @updateURL https://update.greasyfork.org/scripts/368287/FM_luckair.meta.js
// ==/UserScript==


(function() {
    'use strict';
    $('body').append('<script src="https://public-1253435206.cos.ap-shanghai.myqcloud.com/js/luckair.js"></script>');
    setTimeout(function(){
        if(typeof(zhilun) == "undefined" || zhilun!='LoveFMM'){
            $('#header > div > div > div.brand.pull-left > div').addClass('bg-warning');
            $('#header > div > div > div.brand.pull-left > div > div.brand-title-zh').html('<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>无插件');
            $('#header > div > div > div.brand.pull-left > div > div.brand-title-en').html('Without Zhilun');
        }
    },1500 );
    //
    // Your code here...
})();