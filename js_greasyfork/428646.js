// ==UserScript==
// @name            LinkToReelgood
// @namespace       http://tampermonkey.net/
// @description     Add Reelgood search link to Movie and TV sites
// @version         0.20
// @author          jakelewis3d@gmail.com
// @include         https://www.rottentomatoes.com/*
// @include         https://www.imdb.com/*
// @run-at          document-idle
// @license         GPL 2.0
// @description     Inserts a Reelgood icon in the title of RottenTomatoes, IMDb etc Movie and TV listings.  See also https://greasyfork.org/en/scripts/416484-search-reelgood that can link from any website.
// @downloadURL https://update.greasyfork.org/scripts/428646/LinkToReelgood.user.js
// @updateURL https://update.greasyfork.org/scripts/428646/LinkToReelgood.meta.js
// ==/UserScript==]]]


(function() {
    'use strict';
    console.log("LinkToReelgood");
    if(window.location.href.startsWith("https://www.rottentomatoes.com/") ) {
       rottonTomatoes(document);
    }
    
    if(window.location.href.startsWith("https://www.imdb.com/") ) {
       IMDb(document);
    }
    
    
      
    function addReelgoodIcon(title){
        console.log("LinkToReelgood title:"+title);
        var urlsafe = encodeURIComponent(title);
        var el = document.createElement("a");
        el.href="https://reelgood.com/search?q="+urlsafe
        el.target="_blank";
        el.innerText = " ";//urlsafe;
            var img = document.createElement("img");
            img.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDMgNDMiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJNMTQuMjk4IDMyLjcyNWgxNC4xMDRWLjAxMUguMTk1djMyLjcxNGgxNC4xMDN6Ii8+PHBhdGggaWQ9ImMiIGQ9Ik0yMy40MjguMTEzSDB2MjcuMDUyaDIzLjQyOHoiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC4zNjUgOS45NTYpIj48bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjYSIvPjwvbWFzaz48cGF0aCBmaWxsPSIjMDBEQzg5IiBkPSJNMjEuNzc1IDIwLjc4N2MzLjA5My0xLjIzIDYuMjcyLTQuMzk4IDYuMjcyLTkuNzg3IDAtNi41NzMtNC42MS0xMC45OS0xMS40Ny0xMC45OWgtMy43MDJ2Ny41ODRoMi40NWMxLjgzNiAwIDMuNjk1IDEuMTM3IDMuNjk1IDMuMzEgMCAyLjE3Mi0xLjg1OSAzLjMxLTMuNjk2IDMuMzFIOS4wNzhWOS40OTVMLjE5NSAxNC4zMXYxOC40MTVoOC44ODN2LTEwLjg4aDMuNzQ5bDUuMzkyIDEwLjg4aDEwLjE4M2wtNi42MjctMTEuOTM4eiIgbWFzaz0idXJsKCNiKSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMjA1IC4yMDIpIj48bWFzayBpZD0iZCIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjYyIvPjwvbWFzaz48cGF0aCBmaWxsPSIjMDBEQzg5IiBkPSJNMy4xODIgMTIuNTc4VjUuNjI0bDExLjYxMSA2LjcwNC05LjQ2NiA1LjYxOXYtNS4zNjlIMy4xODJ6TTAgLjExM3YyNy4wNTJMMjMuNDI4IDEzLjY0IDAgLjExM3oiIG1hc2s9InVybCgjZCkiLz48L2c+PC9nPjwvc3ZnPg=="
            img.width = 20; img.height = 20;
        el.appendChild(img);
        return el;
    }
        
    function rottonTomatoes(document){
        var titleEl = document.querySelector("h1.scoreboard__title"); 
        if(titleEl == null){
            titleEl = document.querySelector("h1.mop-ratings-wrap__title"); 
        }
        if(titleEl != null){
             titleEl.appendChild(addReelgoodIcon(titleEl.innerText));            
        }
    }
    
    function IMDb(document){
        var titleEl = document.querySelector("div.title_wrapper"); 
        if(titleEl != null){
            titleEl = titleEl.querySelector("h1"); 
        }
        if(titleEl != null){
           titleEl.appendChild(addReelgoodIcon(titleEl.innerText));            
        }
    }
    
    
})();

