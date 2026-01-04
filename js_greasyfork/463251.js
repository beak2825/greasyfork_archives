// ==UserScript==
// @name 百度 界面精简
// @namespace baiduSimplifyer
// @description 进一步精简百度界面
// @include http://www.baidu.com/
// @include https://www.baidu.com/
// @version 0.3
// @grant none
// @author Acan
// @icon none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463251/%E7%99%BE%E5%BA%A6%20%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/463251/%E7%99%BE%E5%BA%A6%20%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

var url = window.location.href
if (url == "http://www.baidu.com/" || url == "https://www.baidu.com/") {

    var bottomLayer = document.getElementById("bottom_layer")
    if (bottomLayer != null) {
        bottomLayer.innerHTML = ""
        bottomLayer.style.visibility = "hidden"
        bottomLayer.style.width = "0px"
        bottomLayer.style.height = "0px"
    }

    var bottomSpace = document.getElementById("bottom_space")
    if (bottomSpace != null) {
        bottomSpace.innerHTML = ""
        bottomSpace.style.visibility = "hidden"
        bottomSpace.style.width = "0px"
        bottomSpace.style.height = "0px"
    }

    var sTopLeft = document.getElementById("s-top-left")
    if (sTopLeft != null) {
        sTopLeft.style.background = "none"
    }
    var sTopWrap = document.getElementById("s_top_wrap")
    if (sTopWrap != null) {
        sTopWrap.style.background = "none"
    }

    var sSideWrapper = document.getElementById("s_side_wrapper")
    if (sSideWrapper != null) {
        sSideWrapper.innerHTML = ""
    }
}