// ==UserScript==
// @name         Messenger Alert
// @namespace    https://www.facebook.com/messages/people/t/*
// @version      0.3
// @description  Avverti quando il/la tuo/a amico/a è Online
// @author       You
// @match        https://www.facebook.com/messages/people/t/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27959/Messenger%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/27959/Messenger%20Alert.meta.js
// ==/UserScript==

// Your code here...
(function() {
    var t = setInterval(function() {
        var nomi = $('div._364g');
        var len = nomi.length;
        var nome = [];
        var player = document.createElement('audio');
        player.src = ("https://dl.dropboxusercontent.com/u/7079101/coin.mp3");
        var aggiorna = 0;
        for(var i = 0; i < len; i++){
            nome.push(nomi[i].textContent);
        }
        if($.inArray("write your friend's fb name here", nome) != -1){
            player.play();
            setTimeout(function(){alert("Friend online!");},1000);
            aggiorna = 1;
        }
        if(aggiorna > 0){
            clearTimeout(t);
        }
    }, 7000 );
})();