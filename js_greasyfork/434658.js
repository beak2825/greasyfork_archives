// ==UserScript==
// @name         [CityU] Add a link to open embedded frames in Canvas in a new tab
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A link to open Zoom and Some External tools in a new tab will be generated at the top right corner.
// @author       You
// @match        https://canvas.cityu.edu.hk/courses/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434658/%5BCityU%5D%20Add%20a%20link%20to%20open%20embedded%20frames%20in%20Canvas%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/434658/%5BCityU%5D%20Add%20a%20link%20to%20open%20embedded%20frames%20in%20Canvas%20in%20a%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var init = () => {
        var ele = document.getElementsByClassName("right-of-crumbs")[0]

        var newele = document.createElement("a");
        newele.innerHTML = "Open the embedded frame in a new window";

        var iframe = document.getElementsByTagName("iframe")

        var src = iframe[iframe.length - 1].src;
        

        if(src == "about:blank"){
            return;
        } else{
            newele.target = "_blank"
            newele.href = src;
            ele.appendChild(newele)
        }
       


    }


    var initZoom = () => {
        var toolForm = document.getElementById("tool_form")

        if(toolForm){
            var ele = document.getElementsByClassName("right-of-crumbs")[0]
            var newele = document.createElement("a");
            newele.innerHTML = "Open the embedded Zoom frame in a new window";
            newele.target = "_blank"
            newele.href = toolForm.action
            ele.appendChild(newele)

        }
    }


    window.addEventListener("load", () => {

        init();
        initZoom();
    })



})();