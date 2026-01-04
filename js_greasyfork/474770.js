// ==UserScript==
// @name         DouyinPlusOne
// @namespace    Cedros
// @version      2.22
// @description  抖音实现CC+1功能
// @author       Cedros
// @match        *://live.douyin.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474770/DouyinPlusOne.user.js
// @updateURL https://update.greasyfork.org/scripts/474770/DouyinPlusOne.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ondblclick = function(event){
        let txt = GetMouseText(event)
        SendMessage(txt)
    }

    function GetDanmuElement(){
        return document.getElementsByClassName("xgplayer-danmu danmu")[0]
    }

    function GetMouseText(event){
        let myDiv = GetDanmuElement()
        for (let i = 0; i < myDiv.children.length; i++) {
            let child = myDiv.children[i];
            if(isInDiv(event, child)){
                return GetText(child)
            }
        }
        return null
    }

    function GetText(div){
        let txt = div.querySelector('.webcast-chatroom___content-with-emoji-text').textContent
        if(txt) return txt
        return null
    }

    function GetTop(e){
        var offset = e.offsetTop
        if(e.offsetParent!=null) offset += GetTop(e.offsetParent)
        return offset
    }

    function GetLeft(e){
        var offset = e.offsetLeft
        if(e.offsetParent!=null) offset += GetLeft(e.offsetParent)
        return offset
    }

    function GetTranslateX(div){
        let transform = window.getComputedStyle(div).getPropertyValue("transform")
        let matrix = new DOMMatrixReadOnly(transform)
        let translateX = matrix.m41;
        return translateX
    }

    function isInDiv(event,div){
        var x=event.clientX
        var y=event.clientY
        var divx1 = GetLeft(div) + GetTranslateX(div)
        var divy1 = GetTop(div)
        var divx2 = GetLeft(div) + div.offsetWidth + GetTranslateX(div)
        var divy2 = GetTop(div) + div.offsetHeight

        return !(x < divx1 || x > divx2 || y < divy1 || y > divy2)
    }

    function setNativeValue(element, value) {
        let valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        let prototype = Object.getPrototypeOf(element);
        let prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    function SendMessage(msg){
        if(msg == null) return

        let txtarea = document.querySelector('.webcast-chatroom___textarea');
        setNativeValue(txtarea,msg);
        txtarea.dispatchEvent(new Event('input', { bubbles: true }));

        let send_btn = document.querySelector('.webcast-chatroom___send-btn');
        //send_btn.click()

    }

})();