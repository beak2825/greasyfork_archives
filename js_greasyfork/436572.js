// ==UserScript==
// @name         免登录下载视觉交大网站的美图
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  绕过视觉交大的登录环节，免登录下载视觉交大网站的美图
// @author       danyang685
// @match        https://vs.sjtu.edu.cn/*
// @icon         data:image/png;base64,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
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436572/%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD%E8%A7%86%E8%A7%89%E4%BA%A4%E5%A4%A7%E7%BD%91%E7%AB%99%E7%9A%84%E7%BE%8E%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436572/%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD%E8%A7%86%E8%A7%89%E4%BA%A4%E5%A4%A7%E7%BD%91%E7%AB%99%E7%9A%84%E7%BE%8E%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(".btn").each(function (idx, elem) {
        if ($(elem).text() == "登录") {
            $(elem).remove()
        }
    })

    showImageInfo=function(img_id){
        window.open("imageInfo?imageId="+img_id)
    }

    function removeHeartButton() {
        $(".icon-heart").parent().remove()
    }
    removeHeartButton();

    function downloadImageCheck() {
        if ($('input:radio[name="imageType"]:checked').val() == undefined) {
            window.alert("请选择照片尺寸")
        } else {
            downloadImage()
        }
    }
    $(".btn.download-btn").attr("onclick", "")
    $(".btn.download-btn").on("click", downloadImageCheck)

    const observer = new MutationObserver(function (mutations) {
        removeHeartButton()
    }).observe(document.querySelector("#waterfall"), {
        childList: true,
        subtree: true
    })
})();