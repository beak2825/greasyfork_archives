// ==UserScript==
// @name         xnyy_bip_tool
// @namespace    https://bip.taiji.com:11651/nccloud/
// @version      1.3
// @description  自动修改业务日期
// @author       You
// @match       https://bip.taiji.com:11651/nccloud/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493509/xnyy_bip_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/493509/xnyy_bip_tool.meta.js
// ==/UserScript==
$(document).ready(function() {
    var datestr=$(".single-input")[0].value;
    var daystr=datestr.slice(-2);
    var yearstr=datestr.substring(0, 4);
    var monthstr=datestr.substring(5,7);
    var daynum=parseInt(daystr, 10)
    var monthnum=parseInt(monthstr, 10)
    var yearnum=parseInt(yearstr, 10)
    if(daynum>20){
        monthnum++;
        if(monthnum>12){
            yearnum++;
            monthnum=1;
        }
        var newdatestr=yearnum.toString().padStart(4, '0')+'-'+monthnum.toString().padStart(2, '0')+'-'+"01"
        $($(".single-input")[0]).val(newdatestr);
        $($(".single-input")[0]).attr("value", '2024-05-01')
    }
})