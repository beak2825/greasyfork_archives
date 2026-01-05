// ==UserScript==
// @name         The West - Numeracja sektorów
// @version      1.00
// @description  Numeracja sektorów na bitwei
// @author       Thathanka Iyothanka i Wojcieszy
// @include		http*://*.the-west.*/game.php*
// @include		http*://*.the-west.*.*/game.php*
// @grant        none
// @namespace https://greasyfork.org/pl/users/21312
// @downloadURL https://update.greasyfork.org/scripts/19861/The%20West%20-%20Numeracja%20sektor%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/19861/The%20West%20-%20Numeracja%20sektor%C3%B3w.meta.js
// ==/UserScript==

(function (fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}) (function () {
    var maps = ['http://i.imgur.com/xnHDC70.png','http://i.imgur.com/mxe4d0W.png','https://i.imgur.com/h46WnB8.png']
    document.styleSheets[1].insertRule(".fortbattle .button_store:hover {background-position: 0px -25px;}",document.styleSheets[1].cssRules.length)
    document.styleSheets[1].insertRule(".fortbattle .button_store {cursor: pointer;position: absolute;background: url('https://i.imgur.com/qOmZPFu.png');width: 25px; height: 25px;}",document.styleSheets[1].cssRules.length)

    var button = '<div class="fort_battle_button button_store" title="'+'Pokaż sektory'+'"></div>'
    FortBattleWindow.showBattleOrigin=FortBattleWindow.showBattle
    FortBattleWindow.showBattle=function(response){
        FortBattleWindow.showBattleOrigin.call(this,response)
        var mainEl=this.window.getContentPane();
        $('.fort_battle_buttons',mainEl).append(button);
        $('.button_store',mainEl).on("click",function(){$('.store_fb',mainEl).toggle();});
        Ajax.remoteCallMode("fort","display",{fortid:this.fortId},function(resp){
            mainEl.insertAdjacentHTML('beforeend', '<div class="store_fb" style="display:none"><img style="pointer-events:none;z-index:10;position:absolute;left:6px;top:44px" src="'+maps[resp.data.type]+'"></div>');
        })
    }


    FortBattleWindow.renderPreBattleOrigin=FortBattleWindow.renderPreBattle
    FortBattleWindow.renderPreBattle=function(preBattle){
        console.log(preBattle)

        FortBattleWindow.renderPreBattleOrigin.call(this,preBattle)
        var mainEl=this.window.getContentPane();
        $('.fort_battle_buttons',mainEl).append(button);
        $('.button_store',mainEl).on("click",function(){$('.store_prefb',mainEl).toggle();});
        Ajax.remoteCallMode("fort","display",{fortid:preBattle.fortId},function(resp){
            $('.fort_battle_battleground',mainEl).append('<div class="store_prefb" style="display:none"><img style="pointer-events:none;z-index:10;position:absolute;top:0px;left:0px" src="'+maps[resp.data.type]+'"></div>');
        })
    }               
})