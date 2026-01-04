// ==UserScript==
// @name         YouTuBeChangeScreen
// @namespace    http://roastwind.com/
// @version      0.1.6
// @description  改变YouTuBe视频为竖屏播放
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @require https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://localhost:8083/*
// @match http://s.ytimg.com/yts/jsbin/html5player*
// @match https://s.ytimg.com/yts/jsbin/html5player*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @copyright  2018+, Find
// @author RoastWind
// @icon http://icons.iconarchive.com/icons/dtafalonso/android-l/256/Youtube-icon.png
// @downloadURL https://update.greasyfork.org/scripts/387513/YouTuBeChangeScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/387513/YouTuBeChangeScreen.meta.js
// ==/UserScript==

document.onreadystatechange = function () {
    // console.log(document.readyState)
    switch(document.readyState){
        // ready
        case 'interactive':
            // init()
            break;
        // load
        case 'complete':
            break;
    }
}

var ready = function(callback) {
    var href = window.location.href
    var isYoutubePlay = /^https?:\/\/www\.youtube.com\/watch\?/.test(href)
    if (!isYoutubePlay) return
    var timer = setInterval(function() {
        var player = document.querySelector('#player-container')
        var container = document.querySelector('.ytd-video-primary-info-renderer')
        if (player && container) {
            clearInterval(timer)
            callback && callback()
        }
    }, 100)
}

ready(function() {
    init()
})

var getVideoVerticalHeight = function() {
    var innerHeight = document.documentElement.clientHeight;
    var headerHeight = document.querySelector('#masthead-container').clientHeight || 0;
    var vedieoPaddingTop = 24;
    var verticalHeight = innerHeight - headerHeight - vedieoPaddingTop;
    return verticalHeight;
}

var updateVideoInfoStatus = function(opacity) {
    var domIds = ['title yt-formatted-string', 'top-row', 'bottom-row']
    domIds.forEach(function(domId) {
        var dom = document.querySelector('#' + domId)
        dom.style.opacity = opacity
    })
}

var updateButtonPosition = function(isVertical) {
    var videoTitle = document.querySelector('#title yt-formatted-string')
    var titleWidth = videoTitle.offsetWidth
    var button = getButton()
    button.style.marginLeft = isVertical ? '0' : `${buttonMarginLeft}px`
    button.style.position = isVertical ? 'absolute' : 'initial'
    if (isVertical) {
        button.style.left = `-${videoMarginLeft}px`
        button.style.zIndex = 3000
    } else {
        delete button.style.left
        delete button.style.zIndex
    }
}

var getButton = function() {
    return document.querySelector('#'+btnId)
}

var changeVideo = function() {
    // header
    var container = document.querySelector('#masthead-container').offsetHeight
    // var container = document.querySelector('.style-scope ytd-masthead')
    var topHeight = container.offsetHeight
    // video container
    var playerContainer = document.querySelector('#player-container')
    var player = document.querySelector('#ytd-player')
    var video = player.querySelector('video')
    var changeScreenBtn = getButton()
    // video.addEventListener('play', function () {
       // console.log('play')
    // })

    // var newTop = (videoBaseWidth - videoBaseHeight) / 2
    // 减去顶部的高度
    // videoBaseWidth = videoBaseWidth - topHeight
    // 减去工具栏的高度(没有标签页)
    // videoBaseWidth = videoBaseWidth - 70
    // var screenHeight = document.documentElement.clientHeight
    // if (videoBaseWidth > screenHeight - topHeight) {
        // videoBaseWidth = screenHeight - topHeight
    // }
    isVertical = !isVertical
    updateVideoInfoStatus(isVertical ? 0 : 1)
    updateButtonPosition(isVertical)
    if (isVertical) {
        var videoBaseHeight = video.offsetHeight
        var videoBaseWidth = video.offsetWidth
        var verticalHeight = getVideoVerticalHeight()
        globalVideoBaseHeight = videoBaseHeight
        globalVideoBaseWidth = videoBaseWidth

        video.style.width = videoBaseWidth + 'px'
        video.style.height = verticalHeight + 'px'
        video.style.top = '0px'
        video.style.transform = 'rotate(90deg)'
        player.style.height = verticalHeight + 'px'
        playerContainer.style.height = verticalHeight + 'px'
        playerContainer.style.maxHeight = 'none'
        changeScreenBtn.innerText = baseBtnResetText
    }
    else {
        video.style.width = globalVideoBaseWidth + 'px'
        video.style.height = globalVideoBaseHeight + 'px'
        video.style.transform = 'rotate(0deg)'
        player.style.height = globalVideoBaseHeight + 'px'
        playerContainer.style.height = globalVideoBaseHeight + 'px'
        playerContainer.style.maxHeight = 'max-height: calc(100vh - 169px);'
        changeScreenBtn.innerText = baseBtnText
    }
}

var isInitReady = false // 需要等待youtube加载完毕
var waitTime = 2e3
var isVertical = false
var globalVideoBaseHeight = 400 // 视频原本高度
var globalVideoBaseWidth = 400 // 视频原本宽度
var buttonMarginLeft = 24
var videoMarginLeft = 24
var btnId = 'you-tu-be-change-screen'
var baseBtnText = '切换竖屏'
var baseBtnResetText = '切换横屏'

var initButton = function() {
    var container = document.querySelector('ytd-watch-metadata')
    var h1 = container.querySelector('h1')
    var title = h1.querySelector('yt-formatted-string')
    // h1.style.position = 'relative'
    var button = document.createElement('button')
    button.innerText = baseBtnText
    button.style.color = 'gray'
    button.addEventListener('click', function() {
        if (isInitReady) {
            changeVideo()
        }
        else {
            alert('please wait for the video ready')
        }
    })
    title.after(button)
    // button.style.position = 'absolute'
    button.style.marginLeft = buttonMarginLeft + 'px'
    button.setAttribute('id', btnId)
    // button.style.marginTop = '-60px'
    setTimeout(() => {
        isInitReady = true
        button.style.color = 'black'
    }, waitTime)
}

var init = function() {
    initButton()
}