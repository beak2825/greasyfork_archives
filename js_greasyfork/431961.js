    // ==UserScript==
// @name         Youtube focusking
// @namespace    http://tampermonkey.net/
// @version      0.55
// @description  Helps you not overwhelmed with the recommendations from YT.
// @author       dharan
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431961/Youtube%20focusking.user.js
// @updateURL https://update.greasyfork.org/scripts/431961/Youtube%20focusking.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let config = {
        home : {
            hide    : true,
            message : {
                display : true,
                content : "<div style='margin-top:20px; font-weight:500; color: green'> Peace Bruhh !!</div>" +
                          "<div style='margin-top:20px'> Home page blocked <br> Due to " +
                              "<span> Recommendation-engine content manipulation</span> <br>" +
                          "</div><br>",
            }
        },

        related_videos : {
            hide    : true,
        },
    };


    //Home - Utils
    var home = {
       init : function(){
           home.show.message();

           //Listeners
           setTimeout(function(){
               document.getElementById("guide-button").addEventListener("click", function(){
                   home.hide.logo();
                   home.hide.forwards();
               });
           },1000);
       },

       hide : {
          logo : function(){
              let logoElem = document.getElementsByTagName("ytd-topbar-logo-renderer");
              for(let i = 0; i< logoElem.length; i++){
                  logoElem[i].style="pointer-events:none";
              }
          },

          forwards : function(){
              setTimeout(function(){
                  let elem = document.getElementsByTagName("ytd-guide-entry-renderer")[0];
                  if (!!elem){
                      let homeButton = elem.querySelector("[title=Home]");
                      if(!!homeButton) homeButton.remove();
                  }
              }, 900);
          },
       },
       show : {
          message : function(){
              //If home results rendered - then render the message there
              var elements = document.getElementsByTagName("ytd-two-column-browse-results-renderer")
              for(let i =0; i < elements.length; i++){
                  let domElement = elements[i];
                  if(domElement!=null && domElement.getAttribute("page-subtype") == "home")
                  {
                      domElement.style = "color: grey; display: flex; font-size: 20px; color: grey; flex-direction:column; font-size: 20px; margin-left: 65%; margin-top: 19%;"
                      domElement.innerHTML = config.home.message.content;
                  }
              }
          }
       },
    };


    var player = {
        init : function(){
            let playerContainer = document.getElementById("player-theater-container");
            player.align(!!playerContainer && playerContainer.children.length != 0);
            player.hide.recommendations();

            //Observer - init
            if (playerContainer!=undefined){
                var observer = new MutationObserver(function(config){
                    player.align(config[0].addedNodes.length!=0);
                });
                observer.observe(playerContainer, {'childList':true});
            }
        },

        align : function(isTheatre){
            if(isTheatre){
                document.getElementById("movie_player").style = "width:100%";
                document.getElementById("ytd-player").style = "height:100%";
            }
            else{
                setTimeout(function(){
                    let videoDOM = document.getElementsByTagName("video")[0];
                    document.getElementById("movie_player").style = "width:" + videoDOM.style.width;
                    document.getElementById("ytd-player").style   = "height:" + videoDOM.style.height;
                }, 1000);
            }
        },

        hide : {
            recommendations : function(){
                var count = 0;
                var repeater = setInterval(function(){
                    var playerContainer = document.getElementsByTagName("ytd-watch-flexy")[0];
                    if(++count == 10) clearInterval(repeater);
                    if(!!playerContainer && playerContainer.querySelector("[id=secondary]")!=null){
                        playerContainer.querySelector("[id=secondary]").remove();
                    }
                },500);
            }
        },
    }

    var browser = {
        Constants : {
            lastURL : "#",
        },
        isFirefox : function(){
            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        },
        getURL : function(){
            return document.location.href;
        },
        updateURL : function(){
            browser.Constants.lastURL = document.location.href;
        }
    };


    //INIT
    browser.updateURL();
    URLRouter();


    function URLRouter(){
        home.hide.logo();
        home.hide.forwards();

        if(browser.Constants.lastURL.indexOf("watch")!=-1){
            player.init();
        }
        else{
            home.init();
        }
    }

    //URL WATCHER
    new MutationObserver(() => {
        if (browser.getURL() !== browser.Constants.lastURL) {
            browser.updateURL();
            URLRouter();
        }
    }).observe(document, {subtree: true, childList: true});

})();
