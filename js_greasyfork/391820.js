// ==UserScript==
// @name         Bosses F YOU TO TC
// @namespace    MizterBoss
// @version      1.0
// @description  FUCK PAYING FOR TC
// @author       BOSS
// @match        https://tinychat.com/*
// @exclude      https://tinychat.com/*?off*
// @exclude      /.*tinychat\.com\/(settings|promote|gifts|subscription|coins|start|privacy\.|terms\.)([#\/].+)?/
// @downloadURL https://update.greasyfork.org/scripts/391820/Bosses%20F%20YOU%20TO%20TC.user.js
// @updateURL https://update.greasyfork.org/scripts/391820/Bosses%20F%20YOU%20TO%20TC.meta.js
// ==/UserScript==

    setInterval(function(){
      try{
      var bodyElem = document.querySelector("body");

      var webappOuter = document.querySelector("tinychat-webrtc-app");
      if(webappOuter != null)
      {
        var webappElem = webappOuter.shadowRoot;
        if(webappElem != null){
          var videolistElem = webappElem.querySelector("tc-videolist").shadowRoot;

          var camQueryString = ".videos-items:last-child > .js-video";
          var camElems = videolistElem.querySelectorAll(camQueryString);
          camElems.forEach(function(item, index){
          
            item.querySelector("tc-video-item").shadowRoot.querySelector(".video").classList.remove("blured");
          });

        }
      }
      }catch(e){
      	console.log(e);
      }
    }, 20);