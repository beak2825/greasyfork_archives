// ==UserScript==
// @name         marumaru tweaks
// @namespace    http://tampermonkey.net/
// @version      0.101
// @description  마루마루 정주행을 편하게 해주는 트윅들
// @license      
// @author       Ackphill
// @hompage      https://github.com/Jn58/marumaru_tweaks
// @supportURL   https://github.com/Jn58/marumaru_tweaks/issues
// @match        http://wasabisyrup.com/archives/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34920/marumaru%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/34920/marumaru%20tweaks.meta.js
// ==/UserScript==

'use strict';

(function () {


    
    // remove some ads
    var element = document.getElementById("header-anchor");
    if (element !== null) element.outerHTML = "";
    element = document.getElementById("footer-anchor");
    if (element !== null) element.outerHTML = "";




    // maek image space
    var img = document.getElementsByTagName("img");
    for (var i = 0; i < img.length; ++i) {
        img[i].style.height = "1080px";
        img[i].onload = function () {
            this.style.height = "";
        };
    }



    // bug need to be fixed

    // // get next page button
    var NP = {
        btn:null,
        activate:false,
        nextPage:null
    }
    NP.btn = document.getElementsByClassName("btn-go-next")[0];
    NP.nextPage = function () { NP.btn.click(); }
    NP.makeEdge = function() {
        var b = document.getElementsByTagName('body')[0];
        NP.edge = document.createElement('div');
        NP.edge.style = 'color:black;height:100px;width:100%;background-color:powderblue;display:none';
        b.appendChild(NP.edge);
    }
    NP.showEdge = function() {
        NP.edge.style.display = 'block';
    } 

    NP.hideEdge = function() {
        NP.edge.style.display = 'none';
    }
    
    NP.stopScrollEvent = function() {
        removeEventListener("scroll", NP.scrollEvent);
    }

    NP.startScrollEvent = function() {
        window.addEventListener("scroll", NP.scrollEvent);
    }

    NP.deactivate = function() {
        NP.active = false;
        NP.stopScrollEvent();
        NP.hideEdge();
        window.scrollTo(window.scrollX, window.scrollY - 2);
        NP.startScrollEvent();
    }
    
    NP.activate = function() {
        NP.showEdge();
        NP.active = true;
        NP.startScrollEvent();
        window.scrollTo(window.scrollX, window.scrollY - 1);
        setTimeout(NP.deactivate, 2000);
    }
    
    NP.makePause = function() {
        NP.stopScrollEvent();
        setTimeout(NP.activate, 400);
    }
    
    NP.scrollEvent = function() {
        if (window.scrollY + window.innerHeight + 1 >= document.body.scrollHeight) {
            if (NP.active === true) {
                NP.nextPage();
            } else {
                NP.makePause();
            }
        }
    }

    if(NP.btn!=undefined && NP.btn.href)
    {
        NP.makeEdge();
        NP.startScrollEvent();
        window.onload = function () {
            console.log('start preloading');
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET",NP.btn.href,true);
            xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState=== XMLHttpRequest.DONE && xmlhttp.status === 200){
                    console.log('start loading');
                    var parser = new DOMParser();
                    var nextPage=parser.parseFromString(xmlhttp.response,"text/html");
                    var img=nextPage.querySelectorAll("img");
                    img.forEach(function(element){
                        new Image().src="http://wasabisyrup.com"+element.getAttribute("data-src");
                    });
                    console.log('loading end');

                }

            };
            xmlhttp.send();
        };
    }
})();