// ==UserScript==
// @name         Tumblr Dashboard Fullscreen
// @namespace    http://hisaruki.tumblr.com/
// @version      2
// @description  F / toggle fullscreen
// @author       hisaruki
// @match        https://www.tumblr.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421605/Tumblr%20Dashboard%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/421605/Tumblr%20Dashboard%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement("style");
    style.innerText = 'body > iframe + div, span > svg + div { z-index: 32768 !important; }';
    document.head.insertAdjacentElement("beforeend", style);

    let background = document.createElement("main");
    background.style.background = "rgba(0, 25, 53, 1)";
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.position = "fixed";
    background.style.zIndex = "8192";
    background.style.color = "white";
    background.style.background = "rgba(0, 25, 53, 1)";
    background.style.left = 0;
    background.style.top = 0;
    background.style.textAlign = "right";

    let glass = document.createElement("main");
    glass.setAttribute("id", "glass");
    glass.style.width = "100%";
    glass.style.height = "100%";
    glass.style.position = "fixed";
    glass.style.zIndex = "16384";
    glass.style.left = 0;
    glass.style.top = 0;
    glass.style.transformOrigin = "center top";
    glass.style.textAlign = "center";

    document.body.insertAdjacentElement("beforeend", background);
    document.body.insertAdjacentElement("beforeend", glass);
    glass.style.display = "none";
    background.style.display = "none";

    let show = function(force){
        let post = focused();
        if(glass.getAttribute("data-focused") != post.getAttribute("data-id") || force === true){
            glass.setAttribute("data-focused", post.getAttribute("data-id"));
            glass.innerHTML = post.innerHTML;
            let mirror = glass.querySelector("div");
            mirror.style.display = "inline-block";
            mirror.style.textAlign = "initial";
            Array.from(mirror.querySelectorAll("*")).map(x => x.style.maxWidth = "unset");
            mirror.querySelector("article").style.width = (window.document.documentElement.clientHeight / 2) + "px";
            let scaleWidth = window.document.documentElement.clientWidth / mirror.clientWidth;
            let scaleHeight = window.document.documentElement.clientHeight / mirror.clientHeight;
            let scale = Math.min.apply(null, [scaleWidth, scaleHeight]);
            //console.log(scale, scaleWidth, scaleHeight, window.document.documentElement.clientHeight, mirror.clientHeight);
            glass.style.transform = "scale(" + scale + ")";
            //Array.from(document.querySelectorAll("[data-id] + div")).filter(x => !x.getAttribute("data-id")).map(x => x.parentNode.removeChild(x));
        }
    }

    let focused = function(){
        let posts = Array.from(document.querySelectorAll("[data-id]"));
        return posts.find(function(post){
            return post.offsetTop - document.documentElement.scrollTop > 0;
        });
    };

    let selectPost = function(next){
        let posts = Array.from(document.querySelectorAll("[data-id]"));
        let dataId = focused().getAttribute("data-id");
        let index = posts.map(x => x.getAttribute("data-id")).indexOf(dataId);
        return posts[index];
    }


    let open = function(){
        let post = focused();
        let href = Array.from(post.querySelectorAll("a"))
            .map(x => x.getAttribute("href"))
            .find(x => x.search("href.li") > 0);
        console.log(href);
        window.open(href);
    }

    setInterval(function(){
        show(false);
    }, 0);

    document.addEventListener("animationend", function(e){
        show(true);
        let svg = glass.querySelector("span > svg + div");
        if(svg){
            svg.parentNode.removeChild(svg);
        }
    });

    document.addEventListener("keyup", function(e){
        show(true);
        let svg = glass.querySelector("span > svg + div");
        if(svg){
            svg.parentNode.removeChild(svg);
        }

        if(e.code == "KeyF"){
            if(glass.style.display != "none"){
                document.body.style.overflowY = "auto";
                glass.style.display = "none";
                background.style.display = "none";
            }else{
                document.body.style.overflowY = "hidden";
                glass.style.display = "block";
                background.style.display = "block";
                show(true);
            }
        }
        if(e.code == "KeyV"){
            open();
        }
    });

})();