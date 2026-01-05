// ==UserScript==
// @name        PC Parts Picker Helper
// @namespace   StoleMyOwnCar
// @description Makes it so you can't overwrite your old builds at random on accident, and also generates strings for saving new builds faster.
// @include     http*://pcpartpicker.com/parts/partlist/*
// @include     http*://pcpartpicker.com/p/*
// @author      StoleMyOwnCar/xshadowinxbc
// @include     http*://pcpartpicker.com/user/*/saved/*
// @version     0.001
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3949/PC%20Parts%20Picker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/3949/PC%20Parts%20Picker%20Helper.meta.js
// ==/UserScript==
var bunnies = document.getElementById('partlist_save_button');
bunnies.addEventListener('click', function ()
{
    window.setTimeout(tiger, 30);
});
function tiger()
{
    console.log('TRYING TO FIND THE STUFF');
    var elephantintheroom = document.getElementById('NULLBUILDOPTION');
    var camel = document.getElementById('partlist_save_new_text');
    var horse = document.getElementById('partlist_save_existing_choice');
    if (camel && horse && !elephantintheroom)
    {
        var givemedamoney = document.getElementById('lg_partlist');
        var damoney = givemedamoney.innerHTML.match(/>\s*Total:\s*([^>]+>){2}(\$\d+\.\d{2})/) [2];
        var dabuild = document.title.match(/^(([^,]+,){2})/) [0].replace(/,$/, '');
        var whatsthetime = new Date;
        var curdate = whatsthetime.getMonth() + '/' + whatsthetime.getDate() + '/' + whatsthetime.getFullYear();
        camel.value = curdate + ' ' + damoney + ' ' + dabuild;
        var nulloption = document.createElement('option');
        nulloption.text = 'Select a Build';
        nulloption.value = 'null';
        nulloption.id = 'NULLBUILDOPTION';
        horse.add(nulloption, horse[0]);
        nulloption.selected = 'selected';
    } 
    else window.setTimeout(tiger, 30);
}