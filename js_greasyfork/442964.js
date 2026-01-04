// ==UserScript==
// @name         Yuque-HideHelpBar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autoHide bubbles and toolbar when FullScreen
// @author       knightli
// @match        https://yuque.alibaba-inc.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442964/Yuque-HideHelpBar.user.js
// @updateURL https://update.greasyfork.org/scripts/442964/Yuque-HideHelpBar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getMain(){
        return document.getElementById("main");
    }
    var _the_bubbles;
    var _the_left_pin;
    var _the_diagram_top_toolbar;
    function getBubbles(){
        var theMain = getMain();
        if(!theMain) return;
        var svgUseElements = theMain.querySelectorAll("svg use")
        var len = svgUseElements.length;
        var bubbles = [];
        if(len>0) {
            for(var i=0;i<len;i++) {
                var ele = svgUseElements[i];
                var attr = ele.getAttribute("xlink:href");
                if(attr.indexOf('bubble')!=-1){
                    bubbles.push(ele)
                }
            }
        }
        return bubbles;
    }
    function setBubbleVisibility(flag){

        if(!_the_bubbles){
            _the_bubbles = getBubbles();
        }

        if(_the_bubbles && _the_bubbles.length>0) {
            for(var i=0,len=_the_bubbles.length; i<len; i++) {
                var bubble = _the_bubbles[i];
                var container = bubble.parentElement.parentElement;
                container.style.visibility = flag ? "visible" : "hidden";
            }
        }
    }
    function getLeftPin(){
        return document.querySelector(".main-wrapper span[class*=ReaderLayout-module_pinIcon_]");
    }
    function setLeftPinPos(flag){

        if(!_the_left_pin){
            _the_left_pin = getLeftPin();
        }

        if(_the_left_pin) {
            var left_pin_container = _the_left_pin.parentElement;
            if(flag){
                left_pin_container.style.zIndex = "";
                _the_left_pin.style.top = "";
            }
            else{
                left_pin_container.style.zIndex = "1000";
                _the_left_pin.style.top = "25px";
            }
        }
    }
    function getDiagramTopToolBar(){
        return document.querySelector(".lake-diagram-board-top-toolbar");
    }
    function setDiagramTopToolBarPos(flag){
        if(!_the_diagram_top_toolbar){
            _the_diagram_top_toolbar = getDiagramTopToolBar();
        }

        if(_the_diagram_top_toolbar) {
            if(flag){
                _the_diagram_top_toolbar.style.position = "";
                _the_diagram_top_toolbar.style.paddingRight = "";
                _the_diagram_top_toolbar.style.zIndex = "";

            }
            else{
                _the_diagram_top_toolbar.style.position = "fixed";
                _the_diagram_top_toolbar.style.paddingRight = "600px";
                _the_diagram_top_toolbar.style.zIndex = "9999";
            }
        }
    }
    document.addEventListener("fullscreenchange", function(e) {
        console.dir(e);
        if(document.fullscreenElement){
            setBubbleVisibility(0);
            setLeftPinPos(0);
            setDiagramTopToolBarPos(0);
        }
        else{
            setBubbleVisibility(1);
            setLeftPinPos(1);
            setDiagramTopToolBarPos(1);
        }
    });
})();