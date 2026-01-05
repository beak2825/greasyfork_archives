// ==UserScript==
// @name         Agarode
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  An agar.io extension
// @author       Tinsten
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22302/Agarode.user.js
// @updateURL https://update.greasyfork.org/scripts/22302/Agarode.meta.js
// ==/UserScript==
var menuOpen = false;
var i = 0;
var feed = false;
var feedSpeed = 20;
//Open/Close Menu
window.addEventListener('keydown', openclose);
function openclose(e) {
     if(e.keyCode == 77) {
         if(menuOpen) {
         //Close menu
             $('#agarodeMenu').css('display','none');
             //$('#helloContainer').css('display','block');
             menuOpen = false;
         } else if(!menuOpen) {
         //Open menu
             $('#agarodeMenu').css('display','block');
             //$('#helloContainer').css('display','none');
             menuOpen = true;
         }
     }
}
$(document).ready(function(){
    $('<div id="agarodeMenu" style="opacity: 0.8; top: 0px;"><div id="menuNav"><i class="material-icons menuNavItem" id="navHome">home</i><i class="material-icons menuNavItem" id="navSettings">build</i><i class="material-icons menuNavItem" id="navTheme">brush</i><i class="material-icons menuNavItem" id="navHotkeys">keyboard</i></div><div class="menuPage" id="menuHome"></div><div class="menuPage" id="menuSettings"></div><div class="menuPage" id="menuTheme"></div><div class="menuPage" id="menuHotkeys"><div id="hotkeys"><div id="tableHeader"></div><div id="table"><span class="tableText">Feature</span><span class="tableText">Hotkey</span></div><div class="row"><span class="rowText">Max split</span><span class="tableText insertKey"><input type="text" class="getKey" readonly onclick="getKey(this)"/></span></div></div></div></div>').appendTo('#overlays');
    $('#agarodeMenu')
    .css('height','800px')
    .css('width','100%')
    .css('display','none')
    .css('position','absolute')
    .css('z-index','1')
    .css('background-color','black');
    
    
    var maxSplit_Key;

    $('#instructions').attr('id','agarodeForm');
    $('canvas').css('position','absolute');
    $('#menuNav')
    .css('width','100%')
    .css('text-align','center');
    $('.menuPage').css('display','none');
    $('.menuNavItem').css('margin','40px');
    $('.btn-settings, #tags-container').remove();
    $('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>').appendTo('head');
    //Order settings page
    $('<div id="choiceForm" style="float: left"></div><div id="movePanels"><label class="checkboxBtn labelPanel"><input type="checkbox" id="showPanelShop" class="panelCheckbox">Show shop panel</label><label class="checkboxBtn labelPanel"><input type="checkbox" id="showPanelProfile" class="panelCheckbox">Show profile panel</label><label class="checkboxBtn labelPanel"><input type="checkbox" id="showPanelFreecoins" class="panelCheckbox">Show freecoins panel</label><label class="checkboxBtn labelPanel"><input type="checkbox" id="showPanelPromoTop" class="panelCheckbox">Show right top panel</label><label class="checkboxBtn labelPanel"><input type="checkbox" id="showPanelPromoBottom" class="panelCheckbox">Show right bottom panel</label><label class="checkboxBtn labelPanel"><input type="checkbox" id="showPanelAds" class="panelCheckbox">Show ads</label></div><div id="checkboxForm" style="float: right"></div>').appendTo('#menuSettings');
    $("#settings div:nth-child(2)").appendTo('#agarodeForm');
    $("#settings div:nth-child(1), #settingsChoice").appendTo('#choiceForm');
    $('#options').appendTo('#checkboxForm').css('margin','10px').css('height','100px');
    $('#checkboxForm').css('width','700px');
    $('#options').children().css('display','inline-block').addClass('checkboxBtn');
    $('#settings').remove();
    $('#movePanels').appendTo('#checkboxForm')
        .css('margin','10px')
        .css('height','100px')
        .css('margin-top','63px');
    $('.panelCheckbox').css('display','inline-block').addClass('checkboxBtn');
    $('label.checkboxBtn').css('margin-right','380px');
    $('label.checkboxBtn.labelPanel').css('margin-right','300px').css('text-align','left').css('font-size','85%');
    $('.checkboxBtn.labelPanel').children().css('text-align','right');
    $('#movePanels')
    .css('text-align','center')
    .css('width','600px');
    $('#text-color').val(localStorage.themeInputText);
    $('#panel-color').val(localStorage.themeInputPanel);
    $('#input-color').val(localStorage.themeInputInput);
    $('#showPanelShop, #showPanelProfile, #showPanelFreecoins, #showPanelPromoTop, #showPanelPromoBottom, #showPanelAds').prop('checked', true);
    });
var shopPanel, profilePanel, promoTopPanel, promoBottomPanel, adsPanel, freecoinsPanel;
setInterval(function(){
    if($('#showPanelShop').is(':checked')) {
    $('.agario-shop-panel').css('display','block');
        shopPanel = "true";
    } else {
    $('.agario-shop-panel').css('display','none');
        shopPanel = "false";
    }
    if($('#showPanelProfile').is(':checked')) {
    $('.agario-profile-panel').css('display','block');
        profilePanel = "true";
    } else {
    $('.agario-profile-panel').css('display','none');
        profilePanel = "false";
    }
    if($('#showPanelFreecoins').is(':checked')) {
    $('.agario-panel-freecoins').css('display','block');
        freecoinsPanel = "true";
    } else {
    $('.agario-panel-freecoins').css('display','none');
        freecoinsPanel = "false";
    }
    if($('#showPanelPromoTop').is(':checked')) {
    $('.agario-promo').css('display','block');
        promoTopPanel = "true";
    } else {
    $('.agario-promo').css('display','none');
        promoTopPanel = "false";
    }
    if($('#showPanelPromoBottom').is(':checked')) {
    $('.diep-cross').css('display','block');
        promoBottomPanel = "true";
    } else {
    $('.diep-cross').css('display','none');
        promoBottomPanel = "false";
    }
    if($('#showPanelAds').is(':checked')) {
    $('#advertisement').css('display','block');
        adsPanel = "true";
    } else {
    $('#advertisement').css('display','none');
        adsPanel = "false";
    }
},500);
$('#checkboxBtn').click(function(){
    //Start game again if playing
});
$('#navHome').click(function(){
$('.menuPage').css('display','none');
$('#menuHome.menuPage').css('display','block');
});
$('#navSettings').click(function(){
$('.menuPage').css('display','none');
$('#menuSettings.menuPage').css('display','block');
});
$('#navTheme').click(function(){
$('.menuPage').css('display','none');
$('#menuTheme.menuPage').css('display','block');
});
$('#navHotkeys').click(function(){
$('.menuPage').css('display','none');
$('#menuHotkeys.menuPage').css('display','block');
});
$('#settings').appendTo('#menuSettings')
.css('display','block');
//Theming
$('<div id="themeBlocks"><div class="theme-block">Text Color: <input type="color" class="themeInput" id="text-color" value="000000"></div><div class="theme-block">Panel Color: <input type="color" class="themeInput" id="panel-color" value="FFFFFF"></div><div class="theme-block">Background Color: <input type="color" class="themeInput" id="background-color" value="000000"></div><div class="theme-block">Pellet Color: <input type="color" class="themeInput" id="pellet-color" value="73FCFF"></div><div class="theme-block">Textfield Color: <input type="color" class="themeInput" id="input-color" value="000000"></div></div>').appendTo('#menuTheme');
$('.theme-block').css('display','inline-block')
.css('margin','100px');
var setColors = setInterval(function(){
$('p, h1, h2, h3, h4, h5, h6, input').css('color',$('#text-color').val());
$('div.agario-panel').css('background-color',$('#panel-color').val());
$('input, select, textarea').css('background-color',$('#input-color').val());
$('.themeInput').css('background-color','white');
localStorage.themeInputText = $('#text-color').val();
localStorage.themeInputPanel = $('#panel-color').val();
localStorage.themeInputInput = $('#input-color').val();

},500);
//Key features
window.addEventListener('keydown',keydown);
setInterval(function(){
if(feed) {
    $("body").trigger($.Event("keydown", { keyCode: 87}));
    $("body").trigger($.Event("keyup", { keyCode: 87}));
}
},feedSpeed);
function keydown(e) {
//Max split
    if(e.keyCode == 84) {
        while(i < 2) {
            $("body").trigger($.Event("keydown", { keyCode: 32}));
            $("body").trigger($.Event("keyup", { keyCode: 32}));
            i++;
        }
    }
//Double split
    if(e.keyCode == 68) {
        while(i < 4) {
            $("body").trigger($.Event("keydown", { keyCode: 32}));
            $("body").trigger($.Event("keyup", { keyCode: 32}));
            i++;
        }
    }
//Macro feed
    if(e.keyCode == 69) {
    feed = true;
    }
}
function keyup(e) {
//Macro feed
    if(e.keyCode == 69) {
    feed = false;
    }
}
