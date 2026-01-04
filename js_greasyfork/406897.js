// ==UserScript==
// @name         Youtube restore slim thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.4.6.1
// @description  Restore slim thumbnails on home and subs pages. Disable autoplay on unsub channel's home.
// @author       me
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406897/Youtube%20restore%20slim%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/406897/Youtube%20restore%20slim%20thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var firstRun = true;
    var initObs = false;
    var activeObs = false;
    var obs = undefined;
    var resObs = undefined;

    //https://stackoverflow.com/a/52809105----
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });

    //https://stackoverflow.com/a/45956628----
    //youtube wtf events
    //new layout > 2017
    window.addEventListener("yt-navigate-finish", function(event) {
        window.dispatchEvent(new Event('locationchange'))
    });

    //old layout < 2017
    window.addEventListener("spfdone", function(e) {
        window.dispatchEvent(new Event('locationchange'))
    });

    //should made portable my settings
    const getRelative = () => {
        var p = document.createElement("p");
        p.innerHTML = "test";
        p.style.fontSize = "16px";
        document.body.appendChild(p);
        var relative = 19/p.offsetHeight;
        p.innerHTML = "";
        return relative;
    }

    const disableAutoplayUnsubChannel = () => {
        if(interval != null){
            clearInterval(interval);
        }
        //(c|channel|user|u) wtf youtube!
        if(document.URL.match(/^(https:\/\/www\.youtube\.com)\/(c|channel|user|u)\/([a-z0-9_]*)(\/featured)?$/i) != null){
            var interval3 = setInterval(() => {
                var videos = document.getElementsByClassName("video-stream html5-main-video");
                if( videos != null){
                    videos[videos.length-1].addEventListener("play", () => {
                        videos[videos.length-1].pause();
                    }, {once: true});
                    videos[videos.length-1].pause();
                    clearInterval(interval3);
                }
            },100);
        }
    }

    const startObserve = () => {
        if(document.URL.match(/^(https:\/\/www\.youtube\.com)(\/|\/[^/]+\/(videos|streams)|\/feed\/subscriptions|\/\?gl\=[a-z]+)?$/i) != null){
            var interval_2 = setInterval(function(){
                if(document.querySelectorAll("ytd-browse[role=\"main\"] ytd-rich-grid-renderer>#contents")[0] !== undefined){
                    clearInterval(interval_2);

                    var grid_renderer_contents = document.querySelectorAll("ytd-browse[role=\"main\"] ytd-rich-grid-renderer>#contents")[0];
                    const fixThubnails = function(){
                        document.querySelectorAll("ytd-browse[role=\"main\"] ytd-rich-grid-renderer>#contents > ytd-rich-grid-row > #contents > ytd-rich-item-renderer:not([is-shorts-grid=\"\"])").forEach(
                            function(element){
                                if(element.querySelectorAll("ytd-thumbnail-overlay-time-status-renderer[overlay-style=\"SHORTS\"]")[0] === undefined){
                                    element.parentNode.parentNode.insertAdjacentElement('beforebegin',element);
                                }
                            }
                        );
                        document.querySelectorAll("ytd-browse[role=\"main\"] ytd-rich-grid-renderer>#contents > ytd-rich-grid-row").forEach(
                            function(element){element.remove()}
                        );
                    }
                    fixThubnails();
                    //if(obs !== undefined) obs.disconnect();
                    obs = new MutationObserver(function (mutationList,observer){
                        observer.disconnect();
                        //if(obs !== undefined) obs.disconnect();
                        if(document.URL.match(/^(https:\/\/www\.youtube\.com)(\/|\/[^/]+\/(videos|streams)|\/feed\/subscriptions|\/\?gl\=[a-z]+)?$/i) != null){

                            fixThubnails();
                            observer.observe(grid_renderer_contents,{childList: true});
                        }
                    });
                    obs.observe(grid_renderer_contents,{childList: true});
                    initObs = true;

                }
            },5);
        } //else if(obs !== undefined) obs.disconnect();
    }

    const restoreSlimTubnails = () => {
        //work only on www.youtube.com and www.youtube.com/feed/subscriptions. If run on video's page it causes cpu load
        if(document.URL.match(/^(https:\/\/www\.youtube\.com)(\/|\/[^/]+\/(videos|streams)|\/feed\/subscriptions|\/\?gl\=[a-z]+)?$/i) == null) return;
        if(!firstRun && !initObs){
            startObserve();
            return;
        }

        if(!firstRun) return;

        var relative = getRelative();
        var itemWidth = 240*relative;
        var postWidth = 350*relative;
        var subsWidth = 214;
        var padding = 48;
        var fontSize = 1.4*relative;
        var lineHeight = 1.8*relative;
        let parentSize = document.createElement("style");
        var parent = document.getElementById("page-manager");
        if(parent == null) return;

        var toResObs = document.querySelector("ytd-browse:not([hidden]) > #header");
        if(toResObs == null) return;


        const updateParentSize = () => {
            parentSize.innerHTML = ":root{--how-many-items:"+parseInt(parent.offsetWidth/itemWidth)+";"+
                "--how-many-posts:"+parseInt(parent.offsetWidth/postWidth)+";"+
                "--variable-columns-width:"+parseInt((parent.offsetWidth-padding)/subsWidth)*subsWidth+"px}";
        }

        updateParentSize();

        let style = document.createElement("style");
        style.innerHTML = "ytd-rich-grid-renderer.ytd-two-column-browse-results-renderer{"+
            "--ytd-rich-grid-items-per-row:var(--how-many-items) !important;"+
            "--ytd-rich-grid-posts-per-row:var(--how-many-posts) !important;"+
            "--ytd-rich-grid-movies-per-row:11 !important;}"+

            "#metadata-line.ytd-video-meta-block,ytd-channel-name{"+
            "max-height: 7.1rem !important;"+
            "font-size:"+fontSize+"rem !important;"+
            "line-height:"+lineHeight+"rem !important}"+

            "ytd-two-column-browse-results-renderer[page-subtype='subscriptions']{"+
            "width:var(--variable-columns-width) !important;"+
            "max-width:var(--variable-columns-width) !important}"+

            "ytd-two-column-browse-results-renderer[page-subtype='home'] > #primary > ytd-rich-grid-renderer > #contents{"+
            "width:auto}"+

            //new fix
            "ytd-rich-section-renderer[align-within-rich-grid] #content.ytd-rich-section-renderer{margin:0 8px !important}"+
            "ytd-rich-grid-renderer>#contents{max-width: calc( var(--ytd-rich-grid-items-per-row) * (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin)) - var(--ytd-rich-grid-item-margin) );"+
            "padding: 0 24px;}";
        document.body.appendChild(parentSize);
        document.body.appendChild(style);
        new ResizeObserver(updateParentSize).observe(toResObs);
        firstRun = false;
        startObserve();

        //new fix after some youtube changes
        /*var grid_renderer_contents = document.querySelectorAll("ytd-rich-grid-renderer>#contents")[0];
        const fixThubnails = function(){
            document.querySelectorAll("ytd-rich-grid-renderer>#contents > ytd-rich-grid-row > #contents > ytd-rich-item-renderer").forEach(
                function(element){element.parentNode.parentNode.insertAdjacentElement('beforebegin',element);}
            );
            document.querySelectorAll("ytd-rich-grid-renderer>#contents > ytd-rich-grid-row").forEach(
                function(element){element.remove()}
            );
        }
        fixThubnails();
        new MutationObserver(function (mutationList,observer){
            observer.disconnect();
            fixThubnails();
            observer.observe(grid_renderer_contents,{childList: true});
        }).observe(grid_renderer_contents,{childList: true});*/
    }

    const run = () => {
        firstRun = true;
        initObs = false;
        if(obs !== undefined) obs.disconnect();
        disableAutoplayUnsubChannel();
        restoreSlimTubnails();
    }

    var interval = setInterval(()=>{
        if(document.body !== null){
            clearInterval(interval);
            run();
        }
    },5);

    window.addEventListener('locationchange', run);
})();