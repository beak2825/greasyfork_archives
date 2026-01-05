// ==UserScript==
// @name        A h4X0rs Room
// @description A script allowing you to cheat at A Dark Room
// @include     http://adarkroom.doublespeakgames.com/
// @version     2
// @grant       none
// @namespace https://greasyfork.org/users/2236
// @downloadURL https://update.greasyfork.org/scripts/1717/A%20h4X0rs%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/1717/A%20h4X0rs%20Room.meta.js
// ==/UserScript==

$(function() {
   var tmp = $SM.set;
   $SM.set = function(stateName, value, noEvent) {
       tmp(stateName, value, noEvent);
       updateStores();
   }
   World.Weapons["rifle"].cost = {}
   setInterval(function() {$('#gatherButton').click();$('#trapsButton').click()}, 1000)
   setInterval(function() {World.setHp(World.getMaxHealth());$("#wanderer").data("hp", World.getMaxHealth());}, 200);
   setInterval(function() {$("#buttons .weaponButton").click();}, 100);
});

var updateStores = function() {
    $("#stores .storeRow .row_add").remove();
    $("#stores .storeRow").each(function() {
        var ware = $(this);
        var button = $(this).find(".row_key").after('<div class="row_add" style="float: right; text-align: right; width: 30px;">+</div>');
        ware.find('.row_add').bind("click", function() {
            $SM.add('stores.'+ware.find(".row_key").html(), 100000);
        });
    });
}