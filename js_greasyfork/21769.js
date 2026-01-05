// ==UserScript==
// @name         LorientOwnage
// @namespace     LorientOwnage
// @version      1.2
// @description  Il écrit des trucs chelou Staline56 :malade:
// @author
// @include     http://www.jeuxvideo.com/*
// @include     https://www.jeuxvideo.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21769/LorientOwnage.user.js
// @updateURL https://update.greasyfork.org/scripts/21769/LorientOwnage.meta.js
// ==/UserScript==

(function(){
  'use strict'
  function isForum() {
        return (document.URL.indexOf("/0-") != -1) ? true : false;
    }
    function isTopic() {
        return (document.URL.indexOf("/42-") != -1 || document.URL.indexOf("/1-") != -1) ? true : false;
    }

  function changeSujet(){
    var array = document.getElementsByClassName('text-modo');
    for(var i=0;i <array.length; i++){
      if(array[i].text.trim() == "Lorient56") getSujet(array[i].parentElement.getAttribute("data-id"));
    }
  }

  function getSujet(id){
    GM_xmlhttpRequest({
    method: "GET",
    url: "https://warm-earth-35063.herokuapp.com/randomSujet",
    onload: function(result) {
      document.querySelector('li[data-id="'+id+'"] .topic-subject .topic-title').innerHTML= JSON.parse(result.responseText).sujet;
    }
    });
  }


  function changeTopic(){
    var lorientMessage = new Array();
    var array = document.getElementsByClassName('text-modo');
    if (document.getElementsByClassName('bloc-pseudo-msg')[0].text.trim() == "Lorient56") {
      if (array.length == 1) {
        getTopic(array[0].parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"));
      }
      else {
        getTopic(array[0].parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"));
        for (var i = 1; i < array.length; i++) {
          if (array[i].text.trim()=="Lorient56") {
            getMessage(array[i].parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"));
          }
        }
      }
    }
    else {
      for (var i = 0; i < array.length; i++) {
        if (array[i].text.trim()=="Lorient56") {
            getMessage(array[i].parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"));
        }
      }
    }
  }

  function getTopic(id){

      GM_xmlhttpRequest({
          method: "GET",
          url: "https://warm-earth-35063.herokuapp.com/randomTopic",
          onload: function(response) {
            document.querySelector('div[data-id="'+id+'"] .txt-msg').innerHTML = JSON.parse(response.responseText).textedefdp;
            document.querySelector('#bloc-title-forum').innerHTML = JSON.parse(response.responseText).sujet;
          }
      });

  }

  function getMessage(id){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://warm-earth-35063.herokuapp.com/randomMessage",
        onload: function(response) {
          document.querySelector('div[data-id="'+id+'"] .txt-msg').innerHTML = JSON.parse(response.responseText).textedefdp;
        }
    });
  }

  (function startScript() {
        isForum() && changeSujet();
        isTopic() && changeTopic();
    })();

})();
