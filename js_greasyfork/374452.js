// ==UserScript==
// @name         Youtube Timelord
// @namespace    nulledroot
// @version      0.1
// @description  Adds a text input and button so you can set the time on youtube videos easy
// @author       Nulled Root
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @grant        none
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/374452/Youtube%20Timelord.user.js
// @updateURL https://update.greasyfork.org/scripts/374452/Youtube%20Timelord.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var onclickvalue = "timeValues = document.getElementById(\"yt-timelord\").value.split(\":\"); secondsValue = parseInt(timeValues[0])*60 + parseInt(timeValues[1]); newurl = document.URL.replace(/(&t=[0-9]*s)/g, '') + \"&t=\"+ secondsValue + \"s\"; window.location.href = newurl"
    var div = document.createElement("div")
    var input = document.createElement("input")
    var button = document.createElement("button")
    var id = document.createAttribute("id")
    var onClick = document.createAttribute("onclick")
    var size = document.createAttribute("size")
    var placeholder = document.createAttribute("placeholder")
    var dStyle = document.createAttribute("style")
    var iStyle = document.createAttribute("style")
    var bStyle = document.createAttribute("style")

    onClick.value = onclickvalue
    placeholder.value = "00:00"
    id.value = "yt-timelord"
    size.value = "4"
    iStyle.value = "background-color: hsla(0, 0%, 100%, .15); color:lightgray; border-color:transparent;"
    bStyle.value = "background-color: hsla(0, 0%, 100%, .08); color:lightgray; border-color:transparent;"
    dStyle.value = "float: right;"
    input.setAttributeNode(iStyle)
    input.setAttributeNode(placeholder)
    input.setAttributeNode(id)
    input.setAttributeNode(size)
    button.setAttributeNode(bStyle)
    button.setAttributeNode(onClick)
    button.innerHTML = 'Set Time';
    div.setAttributeNode(dStyle)
    div.appendChild(input)
    div.appendChild(button)
    document.getElementById('info').appendChild(div)
})();