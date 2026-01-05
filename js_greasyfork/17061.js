// ==UserScript==
// @name        Facebook Chat Bracket Memes
// @namespace   omareco14
// @include     *facebook.com/*
// @version     1.0
// @grant       none
// @description Replaces [[xxx]] expressions with their respective pictures on facebook chat. "The New Edition"
// @author      omareco14
// @downloadURL https://update.greasyfork.org/scripts/17061/Facebook%20Chat%20Bracket%20Memes.user.js
// @updateURL https://update.greasyfork.org/scripts/17061/Facebook%20Chat%20Bracket%20Memes.meta.js
// ==/UserScript==

        setInterval(function(){
              var all = document.getElementsByClassName("_5yl5");
              for(var i = 0; i<all.length;i++){
                     if(all[i].innerHTML.indexOf("[[") != -1){
                           var meme = all[i].innerHTML.substring(all[i].innerHTML.indexOf("[[")+2,all[i].innerHTML.indexOf("]]"));
                           all[i].innerHTML = all[i].innerHTML.replace("[["+meme+"]]", '<img title="'+meme+'" alt="'+meme+'" height=16 width=16 src="https://graph.facebook.com/'+meme+'/picture?width=10&height=10">');
                    }
              }
              var all2 = document.getElementsByClassName("UFICommentBody");
              for(var i = 0; i<all2.length;i++){
                     if(all2[i].innerHTML.indexOf("[[") != -1){
                           var meme = all2[i].innerHTML.substring(all2[i].innerHTML.indexOf("[[")+2,all2[i].innerHTML.indexOf("]]"));
                           all2[i].innerHTML = all2[i].innerHTML.replace("[["+meme+"]]", '<img title="'+meme+'" alt="'+meme+'" height=16 width=16 src="https://graph.facebook.com/'+meme+'/picture?width=10&height=10">');
                    }
              }
              var all3 = document.getElementsByClassName("_5wj- _5pbx userContent");
              for(var i = 0; i<all3.length;i++){
                     if(all3[i].innerHTML.indexOf("[[") != -1){
                           var meme = all3[i].innerHTML.substring(all3[i].innerHTML.indexOf("[[")+2,all3[i].innerHTML.indexOf("]]"));
                           all3[i].innerHTML = all3[i].innerHTML.replace("[["+meme+"]]", '<img title="'+meme+'" alt="'+meme+'" height=16 width=16 src="https://graph.facebook.com/'+meme+'/picture?width=10&height=10">');
                    }
              }
        },10);