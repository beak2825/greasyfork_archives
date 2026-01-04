// ==UserScript==
// @name         【网页版万能视频倍速】各类专业技术人员，新疆继续教育，教师，会计，华医网，好医生，医学继续教育公需课专业课·····
// @version      2.2.1
// @description  16倍速播放看全网视频，要是播放不了，那我也没办法【可合作微study-088】。
// @author       万能脚本
// @match        *://*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxx.edu.cn
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        none
// @run-at       document-end
// @license      MIT

// @namespace https://greasyfork.org/users/1030542
// @downloadURL https://update.greasyfork.org/scripts/499207/%E3%80%90%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E3%80%91%E5%90%84%E7%B1%BB%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%EF%BC%8C%E6%96%B0%E7%96%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%8C%E6%95%99%E5%B8%88%EF%BC%8C%E4%BC%9A%E8%AE%A1%EF%BC%8C%E5%8D%8E%E5%8C%BB%E7%BD%91%EF%BC%8C%E5%A5%BD%E5%8C%BB%E7%94%9F%EF%BC%8C%E5%8C%BB%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%E4%B8%93%E4%B8%9A%E8%AF%BE%C2%B7%C2%B7%C2%B7%C2%B7%C2%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/499207/%E3%80%90%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E3%80%91%E5%90%84%E7%B1%BB%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%EF%BC%8C%E6%96%B0%E7%96%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%8C%E6%95%99%E5%B8%88%EF%BC%8C%E4%BC%9A%E8%AE%A1%EF%BC%8C%E5%8D%8E%E5%8C%BB%E7%BD%91%EF%BC%8C%E5%A5%BD%E5%8C%BB%E7%94%9F%EF%BC%8C%E5%8C%BB%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%E4%B8%93%E4%B8%9A%E8%AF%BE%C2%B7%C2%B7%C2%B7%C2%B7%C2%B7.meta.js
// ==/UserScript==

(function () {
    //     'use strict';



    window.onload = function () {
        setInterval(() => {
            const video = document.querySelector('video')
            video.play();
            video.addEventListener('ratechange',function(){
                video.playbackRate=4
            })
            video.playbackRate=4
             video.addEventListener("ended", function() {
           setTimeout(()=>{window.close();},1000)
                 setTimeout(() => { location.reload();},1000)
               })
        }, 2000)
    }
                    })();