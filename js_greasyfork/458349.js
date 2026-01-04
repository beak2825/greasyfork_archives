// ==UserScript==
// @name         🏸LCSD
// @namespace    https://greasyfork.org/zh-TW/scripts/458349/
// @version      0.1.1
// @description  semi-automation for leisurelink *Xen jeh's badminton cohort only*
// @author       MS
// @match        https://*.leisurelink.lcsd.gov.hk/*
// @icon         https://fav-gen.com/public/assets/img/emoji/svg/1f3f8.svg
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
 
// @downloadURL https://update.greasyfork.org/scripts/458349/%F0%9F%8F%B8LCSD.user.js
// @updateURL https://update.greasyfork.org/scripts/458349/%F0%9F%8F%B8LCSD.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
 
 
var ok=100;
(function() {
    'use strict';
    var player = document.createElement('audio');
    player.src = 'https://raw.githubusercontent.com/akx/Notifications/master/OGG/Cloud.ogg';
    player.preload = 'auto';
    window.addEventListener("load", function(event) {
        if(window.location.href.includes("leisurelink.lcsd.gov.hk/index/index") || window.location.href.includes("leisurelink.lcsd.gov.hk/leisurelink/application/SmartHomeAction")){
            GM_setValue("MS_LCSD_tokenFailedCount", 0);
            var now=new Date(),
                then=new Date(),
                diff;
            then.setHours(7);
            then.setMinutes(0);
            then.setSeconds(0);
            diff=then.getTime()-now.getTime();
 
 
 
            var box_a = document.createElement( 'div' );
            box_a.id = 'myAlertBox';
            GM_addStyle(
                ' #myAlertBox {             ' +
                '    background: white;     ' +
                '    border: 2px solid red; ' +
                '    padding: 4px;          ' +
                '    position: fixed;       ' +
                '    right: 8px; bottom: 8px;' +
                '    max-width: 400px;      ' +
                '    z-index: 2147483647;   ' +
                '    font-size: large;      ' +
                ' } '
            );
            box_a.innerHTML = "<input type='checkbox' id='automate'>  <select id='sessionTime' ><option value=''>- 請選擇時段 -</option><option value='AM'>早上(上午07:00 - 下午01:00)</option><option value='PM' selected='selected'>下午(下午12:00 - 下午07:00)</option><option value='EV'>晚間(下午06:00 - 下午11:00)</option>" + atob("PC9zZWxlY3Q+PC9icj5Gb3IgWGVuIGplaCdzIGJhZG1pbnRvbiBjb2hvcnQ=");
            document.body.appendChild( box_a );
            $("#sessionTime").val(GM_getValue( "MS_LCSD_sessionTime","EV"));
            //$("#sessionTime").on( "change", sessionTime2setvalue);
            $("#sessionTime").change(sessionTime2setvalue);
            $('#automate').click(function(){
                if($(this).is(':checked')){
                    onFocus();
                    window.onfocus = onFocus;
                }
                else {
 
                    window.onfocus = null;
                }
            });
            if (diff>=0){
                setTimeout(function() {
                    $('#automate').click();
                }, diff);
            };
 
            $(document).keypress(function(event){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    $("#LCSD_1").click(); //普及版
                    //$("#LCSD_2").click(); //個人版
                }});
        };
 
        if(window.location.href.includes("leisurelink.lcsd.gov.hk/leisurelink/application/checkCode")){
            waitForKeyElements('div:contains("可供租訂設施的日期")',submitdrag);
        };
 
        if(document.body.textContent.includes("請稍後再試") || window.location.href.includes("busy.htm") || window.location.href.includes("tokenVerifyFailed.jsp")){
            if (window.location.href.includes("tokenVerifyFailed.jsp")) {
                GM_setValue("MS_LCSD_tokenFailedCount", GM_getValue("MS_LCSD_tokenFailedCount",0)+1);
            } else {
                GM_setValue("MS_LCSD_tokenFailedCount", 0);
            }
            if (GM_getValue("MS_LCSD_tokenFailedCount",0) < 3) {
                window.close();
            }
        };
        embedFunction(openwin);
        if(window.location.href.includes("/lcsd/leisurelink/facilityBooking/login")){
 
            $(document).keypress(function(event){
 
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    $("#searchBtnPanel > input.actionBtnContinue").click();
                }});
            player.play();
            customselectionlabel("羽毛球場");
            $('#sessionTimePanel > select').val(GM_getValue( "MS_LCSD_sessionTime","EV")).change();
            //customselectionlabel("下午(下午12:00 - 下午07:00)");
            //customselectionlabel("晚間(下午06:00 - 下午11:00)");
           Preset1();
 
 
            var box_b = document.createElement( 'div' );
            box_b.id = 'myAlertBox';
            GM_addStyle(
                ' #myAlertBox {             ' +
                '    background: white;     ' +
                '    border: 2px solid red; ' +
                '    padding: 4px;          ' +
                '    position: fixed;       ' +
                '    right: 8px; bottom: 8px;' +
                '    max-width: 400px;      ' +
                '    z-index: 2147483647;   ' +
                '    font-size: large;      ' +
                ' } '
            );
            box_b.innerHTML = "<a id='Preset1'>[Preset 1]</a></br><a id='Preset2'>[Preset 2]</a></br><a id='Preset3'>[Preset 3]</a></br><a id='Preset4'>[Preset 4]</a> ";
            document.body.appendChild( box_b );
 
            $("#Preset1").click (Preset1);
            $("#Preset2").click (Preset2);
            $("#Preset3").click (Preset3);
            $("#Preset4").click (Preset4);
            setInterval(function() {
                if (ok==0){
                    $("#searchBtnPanel > input.actionBtnContinue:eq(0)").click();
                    ok=100;
                };
            }, 100);
 
        };
 
 
        if(window.location.href.includes("/lcsd/leisurelink/facilityBooking/confirm")){
 
            $(document).keypress(function(event){
 
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    $("#buttonPanel > div > input.actionBtnContinue:eq(1)").click();
                    $("#buttonPanel > div > input.actionBtnContinue:eq(0)").click();
                }});
 
 
            $('input[name="emailAddress"]').val(atob("c2l0aG90aW5nQGdtYWlsLmNvbSx4ZW5pYS54aUBvdXRsb29rLmNvbQ=="));
            $('input[name="facilityDeclare.answer"][value="Y"]').attr('checked', true);
        };
    });
 
 
})();
 
 
function embedFunction(s) {
    document.body.appendChild(document.createElement('script'))
        .innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
}
 
function openwin(url) {
    window.open(url);
}
function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
 
function customselectionaction(jNode) {
    jNode.attr('selected', true);
    jNode.trigger("input");
    jNode.trigger("change");
    --ok;
    return false;
}
 
function submitdrag(){
    $('form[name="CheckCodeForm"]').submit();
}
 
function customselectionlabel(label){
    $('select option:contains("' + label + '")').attr('selected', true);
    $('select option:contains("' + label + '")').trigger("input");
    $('select option:contains("' + label + '")').trigger("change");
}
 
function sessionTime2setvalue(){
    var localvalue = $("#sessionTime").find(":selected").val();
    GM_setValue( "MS_LCSD_sessionTime",localvalue);
}
/* function Preset4(){
    $("*").removeData('alreadyFound');
    ok=4;
    $('#facilityTypePanel > select').val("22").change(); //羽毛球場 (新界區)
    //waitForKeyElements('select option:contains("羽毛球場 (新界區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*NTW"]',customselectionaction,true); //新界西 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*NTW"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("荔景體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option:contains("楊屋道體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("青衣體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function Preset1(){
    $("*").removeData('alreadyFound');
    ok=5;
    //$('#facilityTypePanel > select').val("504").change(); //羽毛球場 (空調)(市區)
    waitForKeyElements('select option:contains("羽毛球場 (空調)(市區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*KLN"]',customselectionaction,true); //九龍 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*KLN"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("北河街體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option:contains("九龍城體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("彩虹道體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function Preset2(){
    $("*").removeData('alreadyFound');
    ok=4;
    $('#facilityTypePanel > select').val("504").change(); //羽毛球場 (空調)(市區)
    //waitForKeyElements('select option:contains("羽毛球場 (空調)(市區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*KLN"]',customselectionaction,true); //九龍 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*KLN"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("花園街體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option:contains("長沙灣體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("九龍公園體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function Preset3(){
    $("*").removeData('alreadyFound');
    ok=4;
    $('#facilityTypePanel > select').val("504").change(); //羽毛球場 (空調)(市區)
    //waitForKeyElements('select option:contains("羽毛球場 (空調)(市區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*KLN"]',customselectionaction,true); //九龍 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*KLN"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("大角咀體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option:contains("順利邨體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("牛池灣體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
} */
 
 
 
function Preset1(){
    $("*").removeData('alreadyFound');
    ok=5;
    //$('#facilityTypePanel > select').val("504").change(); //羽毛球場 (空調)(市區)
    waitForKeyElements('select option:contains("羽毛球場 (空調)(市區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*KLN"]',customselectionaction,true); //九龍 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*KLN"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("九龍灣體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option:contains("彩虹道羽毛球中心"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("彩虹道體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function Preset2(){
    $("*").removeData('alreadyFound');
    ok=4;
    $('#facilityTypePanel > select').val("504").change(); //羽毛球場 (空調)(市區)
    //waitForKeyElements('select option:contains("羽毛球場 (空調)(市區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*KLN"]',customselectionaction,true); //九龍 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*KLN"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("長沙灣體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option:contains("北河街體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("保安道體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function Preset3(){
    $("*").removeData('alreadyFound');
    ok=5;
    $('#facilityTypePanel > select').val("504").change(); //羽毛球場 (空調)(市區)
    //waitForKeyElements('select option:contains("羽毛球場 (空調)(市區)")',customselectionaction,true);
    waitForKeyElements('select option[value="*KLN"]',customselectionaction,true); //九龍 - 所有地區
 
    var timer=setInterval(function() {
        if ($('select option[value="*KLN"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("界限街體育館"):eq(0)',customselectionaction,true);
            waitForKeyElements('select option[value="125005236"]',customselectionaction,true); //主場 (二號館)
            waitForKeyElements('select option:contains("花園街體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("九龍公園體育館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function Preset4(){
    $("*").removeData('alreadyFound');
    ok=4;
    $('#facilityTypePanel > select').val("22").change(); //羽毛球場 (新界區)
    //waitForKeyElements('select option:contains("羽毛球場 (新界區)")',customselectionaction,true);
    //waitForKeyElements('select option[value="*NTW"]',customselectionaction,true); //新界西 - 所有地區
    waitForKeyElements('select option[value="*NTE"]',customselectionaction,true); //新界東 - 所有地區
    var timer=setInterval(function() {
        if ($('select option[value="*NTE"]').data('alreadyFound') ) {
            waitForKeyElements('select option:contains("顯徑體育館"):eq(0)',customselectionaction,true);
            //waitForKeyElements('select option[value="125006886"]',customselectionaction); //主場 (2 樓)
            //waitForKeyElements('select option[value="125006889"]',customselectionaction,true); //副場 (地下)
            waitForKeyElements('select option:contains("坑口體育館"):eq(1)',customselectionaction,true);
            waitForKeyElements('select option:contains("香港單車館"):eq(2)',customselectionaction,true);
            clearInterval(timer);}
    }, 50);
 
}
 
function onFocus(){
    $("#LCSD_1").click(); //普及版
    //$("#LCSD_2").click(); //個人版
}
/* function customselectionvalue(value){
    $('select option[value=' + value + ']').attr('selected', true);
    $('select option[value=' + value + ']').trigger("input");
    $('select option[value=' + value + ']').trigger("change");
}
 */