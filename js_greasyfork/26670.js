// ==UserScript==
// @name        BetterRabbit
// @namespace   soulweaver
// @description Improves the Rabbit experience
// @include     https://www.rabb.it/*
// @version     1
// @grant       none
// @require https://code.jquery.com/jquery-2.2.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/26670/BetterRabbit.user.js
// @updateURL https://update.greasyfork.org/scripts/26670/BetterRabbit.meta.js
// ==/UserScript==

var vObs;
var twitchEmotes;
var bttvEmotes;
var gBttvEmotes = {};

$(document).ready(function() {
  //alert("Plese don't open chat until the 'Chat ready' alert appers, thanks! *click ok*");
  
  //MutationObserver helper
  var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback(mutations, observer);
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){I 
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
  })();
  
  // Download latest global emotes and store them in a variable
  $.getJSON('https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0', function(data) {
    twitchEmotes = data;
  });
  
  $.getJSON('https://cdn.rawgit.com/Jiiks/BetterDiscordApp/master/data/emotedata_bttv.json', function(data) {
    bttvEmotes = data;
  });
  
  $.getJSON('https://api.betterttv.net/2/emotes', function(data) {
    $.each(data.emotes, function(key, val) {
      gBttvEmotes[val.code] = val.id;
    });
  });
  
  
  
  
  // Apparently I suck at Javascript and $(document).on just doesn't work. kden. So hacky workaround
  setTimeout(function() {
    //alert('Chat ready');
    console.log('timedone');
    console.log(gBttvEmotes);
    $('.toolbarButton.chatButton > .noCounter > .icon').click(function() { 
     if($(this).hasClass('on')) {
       console.log('Chat gone');
       vObs.disconnect();
     } else {
       console.log('chat here');
       setTimeout(function() {
         observeDOM(document.getElementsByClassName("messages")[0], function(mutation, observer){ 
           vObs = observer;
           //console.log(mutation);
           var message = $(mutation[0].addedNodes[0]).find('span')
           var messageContent = message[0].innerText;
           var messageWords = messageContent.split(/([^\s]+)([\s]|$)/g).filter(function(e){ return e});
           
           var scrollPos = $('.conversationMessageCollectionView').scrollTop();
           var scrollHeight = $('.conversationMessageCollectionView')[0].scrollHeight - $('.conversationMessageCollectionView')[0].clientHeight; 
           
           function callback(array) {
             //console.log(array);
             var content = array.join('');
             message.replaceWith("<span class='messageBody'>" + content + "</span>");
             if (scrollPos >= scrollHeight) {
               $('.conversationMessageCollectionView').scrollTop(10000);
             }
           }
           
           var wordsDone = 0;
           messageWords.forEach(function(w, i, a) {
             //console.log('word: ' + w + " | index: " + i + " | array: " + a);
             
             twitchEmotes.emoticon_sets[0].forEach(function (emote, i2) {
               if (w == emote.code) {
                 a[i] = "<img src='https://static-cdn.jtvnw.net/emoticons/v1/" + emote.id + "/1.0' alt='" + emote.code + "'>";
               }
             });
             
             if (gBttvEmotes.hasOwnProperty(w)) {
               a[i] = "<img src='https://cdn.betterttv.net/emote/" + gBttvEmotes[w] + "/1x'>";
             } else if (bttvEmotes.hasOwnProperty(w)) {
               a[i] = "<img src='https://cdn.betterttv.net/emote/" + bttvEmotes[w] + "/1x'>";
             }
             
//              if(twitchEmotes.emotes.hasOwnProperty(w)) {
//                 a[i] = "<img src='https://static-cdn.jtvnw.net/emoticons/v1/" + twitchEmotes.emotes[w].image_id + "/1.0'>";
//                 //console.log(twitchEmotes.emotes[w]);
//              };
             wordsDone++;
             if(wordsDone === a.length) {
               callback(a);
             }
           });
        });
       }, 1000)  
     }
    });
  }, 6000);
});



console.log('BetterRabbit loaded');