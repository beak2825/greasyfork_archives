// ==UserScript==
// @name        jeu de carte, casino Au Dés d'Argent
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     0.2
// @grant       none
// @author 			Xaios & Ianouf
// @description jeu de carte
// @downloadURL https://update.greasyfork.org/scripts/15852/jeu%20de%20carte%2C%20casino%20Au%20D%C3%A9s%20d%27Argent.user.js
// @updateURL https://update.greasyfork.org/scripts/15852/jeu%20de%20carte%2C%20casino%20Au%20D%C3%A9s%20d%27Argent.meta.js
// ==/UserScript==
     
    $(document).ready(function() {
            var chatBox = $('#chatForm .text_chat').eq(0);
            chatBox.keypress(function(event) {
                     if ( event.which == 13 ) {
                            var text = chatBox.val();
                            if(text.substr(0,6) == '/carte'){
                                    chatBox.val('/roll 1D52');     
                            }
                    }
            });
    });
     
    MenuChat.prototype.updateSave = MenuChat.prototype.update;
    MenuChat.prototype.update = function(a) {
            nav.getChat().updateSave(a);
            var chatContent = $(a).find('#chatContent');
            if(chatContent.length){
                    var val = chatContent.html();
                    var nom = $('#txt_pseudo').html();
                    var pattern = nom+' lance 1 dé de 52 et fait ';
                    var pos = val.indexOf(pattern);
                    if(pos >0){
                            var res = val.substr(pos+pattern.length, 2);
                            if(res.substr(1,1)=='<') res = res.substr(0,1);
                            var tirage = '/me tire '+getCartePicked(res);
                            $("#chatForm .text_chat").val(tirage);
                            nav.getChat().send();
                    }
            }
    }
     
    function getCartePicked(res){
            var content = '';
           
            var chiffre = res%13;
            if(chiffre==1) chiffre = 'As';
            else if(chiffre==11) chiffre = 'Valet';
            else if(chiffre==12) chiffre = 'Dame';
            else if(chiffre==0) chiffre = 'Roi';
           
            var couleur = Math.floor((res-1)/13);
            if(couleur == 0) content = 'rouge]'+chiffre+' ♥';
            else if(couleur == 1) content = 'noir]'+chiffre+' ♣';
            else if(couleur == 2) content = 'rouge]'+chiffre+' ♦';
            else content = 'noir]'+chiffre+' ♠';
           
            return '[couleur='+content+'[/couleur]';
    }
     
    console.log('jeu de carte');