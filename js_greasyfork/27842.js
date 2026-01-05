// ==UserScript==
// @name         BS GET KEY
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  shows how to use babel compiler
// @icon         https://cdn.bundlestars.com/production/brand/logo.png
// @author       KamiXuan
// @match        https://www.bundlestars.com/en/orders*
// @downloadURL https://update.greasyfork.org/scripts/27842/BS%20GET%20KEY.user.js
// @updateURL https://update.greasyfork.org/scripts/27842/BS%20GET%20KEY.meta.js
// ==/UserScript==
//扩散范围仅限STEAMCN论坛 当然你扩散到其他地方我也是管不到你的 
$ = unsafeWindow.jQuery;
(function($) {
    unsafeWindow.redeem=function redeem()
    {$("a[ng-click='redeemSerial(order._id, item._id, game)'][class='ng-scope'][style='color:#d0fe00']").click();};
    unsafeWindow.get=function get(){
        $("#kamitext").val("");
        $("input[ng-model='game.key']").each(function(index){if(index%2!==0){
        $("#kamitext").val($("#kamitext").val()+$(this).val()+"\n");}});};
    unsafeWindow.getWithName=function (){
        $("#kamitext").val("");
        $("input[ng-model='game.key']").each(function(index){if(index%2!==0){
    $("#kamitext").val($("#kamitext").val()+$(this).parent().parent().parent().parent().find(".title").text()+":"+this.value+"\n");}});};
    $("<button value='redeem' onclick='redeem()' id='kamiredeem'>REDEEM</button>").insertAfter($("h2"));
    $("<button value='get' onclick='get()' id='kamiget'>GET</button>").insertAfter($("#kamiredeem"));
    $("<button value='getwithname' onclick='getWithName()' id='kamigetname'>GETwithNAME</button>").insertAfter($("#kamiget"));
    $("</br><textarea id='kamitext' style='width:400px;height:400px;'></textarea>").insertAfter($("#kamigetname"));})(jQuery);
