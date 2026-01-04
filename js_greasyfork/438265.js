// ==UserScript==
// @name         Gold information
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  just write in chat !pickaxe !bomb !buyall !stash !bow !spear
// @author       You
// @match        zombs.io
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438265/Gold%20information.user.js
// @updateURL https://update.greasyfork.org/scripts/438265/Gold%20information.meta.js
// ==/UserScript==

var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!pickaxe") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To buy full pickaxe need 132 500 gold",
             channel: "Local"
         });
         }, 1000)
     }
  }
});


var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!spear") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To buy full spear need 178 500 gold",
             channel: "Local"
         });
         }, 1000)
     }
  }
});

var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!bow") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To buy full bow need 153 500 gold",
             channel: "Local"
         });
         }, 1000)
     }
  }
});


var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!shield") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To buy full shield need 234k gold",
             channel: "Local"
         });
         }, 1000)
     }
  }
});


var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!bomb") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To buy full bomb need 152 500 gold",
             channel: "Local"
         });
         }, 1000)
     }
  }
});

var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!buyall") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To buy all and full need 616k",
             channel: "Local"
         });
         }, 1000)
     }
  }
});


var facts = [
      "What's the difference between a pickpocket and a peeping tom?", " what a lod"];
    var facts = Math.floor(Math.random() * facts.length);
    game.network.addRpcHandler('ReceiveChatMessage', function(e) {
 if(e.uid == game.ui.playerTick.uid) {
     if(e.message == "!stash") {
          console.log('');
         setTimeout(() => {
         game.network.sendRpc({
             name: "SendChatMessage",
             message: "To upgrade full stash need 583k gp;d",
             channel: "Local"
         });
         }, 1000)
     }
  }
});