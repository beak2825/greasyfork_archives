// ==UserScript==
// @name         avgle 过滤低评分
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  avgle 过滤低评分,自动记录音量
// @author       en20
// @match        *://*.avgle.com/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/411375/avgle%20%E8%BF%87%E6%BB%A4%E4%BD%8E%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/411375/avgle%20%E8%BF%87%E6%BB%A4%E4%BD%8E%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

;(function () {
    // 移除低评分
    function removeMinRating() {


        // 每个视频框
        let $avList = $('.row .col-sm-4,.col-sm-6 ')

        // console.log($avList.length, $avList)
        for (let i = 0; i < $avList.length; i++) {

            // 去掉低评分
            let rating = $(".video-rating", $avList[i]).text().replace(/ /g, "").replace(/%/g, "")
            // console.log('rating',rating,(parseInt(rating) || 0) , window.minRating,(parseInt(rating) || 0) < window.minRating)
            if ((parseInt(rating) || 0) < window.minRating) {
                $avList[i].remove()
            }
        }
    }

    // 设置音量
    function setVolume() {
        let videoEle = document.querySelector('#video-player_html5_api')
        let savedVolume = localStorage.getItem('avgleVolume') || .2
        if (videoEle) {

            videoEle.volume = savedVolume
        }


    }

    // 自动记录音量
    function addVolumeChangeListener() {
        let videoEle = document.querySelector('#video-player_html5_api')


        videoEle && videoEle.addEventListener('volumechange', (e) => {
            let volume = e.target.volume

            localStorage.setItem('avgleVolume', volume)
        })
    }


    function controlPanel() {

        let style = `
.panel{
    position: fixed;
    top: 250px;
    left: 45px;
    border: 1px cadetblue solid !important;
    padding: 20px 10px;
}
        `
        let panel = `
        <div class='panel'>

        <input type='text' id='minRatingInput' >
        <button onclick='btnReset()'>重置</button>
</div>
        `
            $('body').append($(panel)),
            $('body').append($("<style></style>").html(style))

    }


    let minRating = localStorage.getItem('avgleMinRating')

    // 最低评分
    window.minRating = minRating || 78
    window.btnReset = function () {
        let inputVal = $('#minRatingInput')[0].value
        localStorage.setItem('avgleMinRating', parseInt(inputVal) || window.minRating)
        window.location.reload()
    }
    controlPanel()
    $('#minRatingInput')[0].setAttribute('placeholder', window.minRating)
    $('#minRatingInput').bind('keypress', function (event) {
        if (event.keyCode === 13) {
            window.btnReset()
        }
    })
    removeMinRating()
    setVolume()
    addVolumeChangeListener()

})()
