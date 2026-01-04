// ==UserScript==
// @name        TSDM签到
// @namespace   https://greasyfork.org/zh-CN/users/821
// @author      ashcarbide
// @description 天使动漫自动签到
// @include     *://tsdm39.com/plugin.php?id=dsu_paulsign:sign
// @include     *://tsdm39.com/forum.php
// @include     *://www.tsdm39.com/plugin.php?id=dsu_paulsign:sign
// @include     *://www.tsdm39.com/forum.php
// @version     1.0
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at      document-end
// @license     GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/522950/TSDM%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522950/TSDM%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

/*

$(document).ready(function(){
  setTimeout(function(){$('#advids div:eq(0) a').click();}, 400);
  setTimeout(function(){$('#advids div:eq(1) a').click();}, 800);
  setTimeout(function(){$('#advids div:eq(2) a').click();}, 1200);
  setTimeout(function(){$('#advids div:eq(3) a').click();}, 1600);
  setTimeout(function(){$('#advids div:eq(4) a').click();}, 2000);
  setTimeout(function(){$('#advids div:eq(5) a').click();}, 2400);

  setTimeout(function(){$('#stopad a').click();}, 5000);
 });
//    setTimeout(function(){$('#stopad').children().trigger("click");},2000);


if(isURL('tid=321479'))
{
    window.open('plugin.php?id=np_cliworkdz:work');
    setInterval((function() {
    window.location.reload();
 }), 21640000);
}
else if(!isURL('np_cliworkdz:work'))
{}

*/
qian('签到领奖!');

function qian(keyword) {
    if (isURL('dsu_paulsign:sign')) {
        if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
            $("#kx_s").attr('checked', true);
            $("#todaysay").val("天使动漫赛高。。。");
            $("#qiandao").submit();
        }
    } else if (window.find(keyword)) {
        toURL("plugin.php?id=dsu_paulsign:sign");
    }
}

function isURL(x) {
    return window.location.href.indexOf(x) != -1;
}

function toURL(x) {
    window.location.href=x;
}