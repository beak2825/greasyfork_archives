// ==UserScript==
// @name         酷学院刷学习时长
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  自动刷酷学院刷学习时长
// @author       You
// @run-at     document-start
// @match      https://learning.coolcollege.cn/*
// @exclude      https://learning.coolcollege.cn/*#/index* // 不起作用
// @exclude      https://learning.coolcollege.cn/*#/landing* // 不起作用
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433194/%E9%85%B7%E5%AD%A6%E9%99%A2%E5%88%B7%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/433194/%E9%85%B7%E5%AD%A6%E9%99%A2%E5%88%B7%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var whiteList = ['course/management', 'course/enterpriseCourse', 'course/watch']
    var notMatchList = ['#/landing', '#/index']
    var playVideoTimer, onPauseCount = 0
    var currentUrl = location.href

    getCurrentProject(3)

    window.addEventListener('hashchange', hashchangeHandler)

    if (currentUrl.indexOf('https://learning.coolcollege.cn') > -1 && currentUrl.indexOf('#/home') > -1) {
        location.href = '#/course/management'
    }

    function hashchangeHandler (e) {
        var newUrl = e.newURL
        if (notMatchList.find(u => newUrl.indexOf(u) > -1)) {
            return false
        }
        if (
            !whiteList.find(u => newUrl.indexOf(u) > -1)
        ) {
            location.href = 'https://learning.coolcollege.cn/#/course/management'
        } else if (location.href.indexOf(whiteList[0]) > -1){
            getCurrentProject()
        }
    }

    function tryPageReady (retryCount = 1000) {
        setTimeout(() => {
            if (!whiteList.find(u => location.href.indexOf(u) > -1) && retryCount > 0) {
                return tryPageReady(retryCount - 1)
            } else {
                getCurrentProject()
            }
        }, 1000)
    }

    function nextPage (retryCount = 3) {
        var nextBtn =  document.querySelector('.ant-pagination-next')
        if (nextBtn) {
          nextBtn.click()
          setTimeout(() => {
              getCurrentProject()
          }, 3000)
        } else if (retryCount > 0) {
          setTimeout(function () {
            nextPage(retryCount - 1)
          }, 2000)
        }
    }
    function getCurrentProject (retryCount = 3) {
        setTimeout(() => {
            if (location.href.indexOf('course/management') > -1) {
                var finished = true
                var projectList = document.querySelectorAll('.course-card__cover-box')
                if (!projectList && retryCount > 0) {
                    return getCurrentProject(retryCount - 1)
                }
                var currentProjectIdx = 0
                projectList = [].slice.call(projectList || [])

                for (var i = 0; i < projectList.length; i++) {
                    var status = projectList[i].querySelector('.course-card__cover-box__status').innerText
                    if (status && status.trim() === '已学完') {
                        continue
                    } else {
                        currentProjectIdx = i
                        finished = false
                        break
                    }
                }
                if (finished) {
                    return nextPage()
                }

                projectList[currentProjectIdx].click()
                toLearning(3)
            } else if (location.href.indexOf('course/enterpriseCourse') > -1) {
                toLearning()
            } else if (location.href.indexOf('course/watch') > -1) {
                startPlay()
            } else {
                console.error('页面地址不对')
            }
        }, 2000)
    }

    function toLearning (retryCount = 3) {
        setTimeout(() => {
            var start_btn = document.querySelector('.enterprise-course-top__right__start-btn .ant-btn.ant-btn-primary')

            if (!start_btn && retryCount > 0) {
                return toLearning(retryCount - 1)
            }

            var playList = document.querySelectorAll('.course-ware-list__item')
            playList = [].slice.call(playList || [])
            var notPlay = []
            for (var i = 0; i < playList.length; i++) {
                var progressEl = playList[i].querySelector('.ant-progress-bg')
                var finished = progressEl.style.width === '100%'
                if (!finished) {
                    notPlay.push(i)
                }
            }

            start_btn.click()
            startPlay(notPlay)
        }, 2000)
    }

    function startPlay (notPlay = [], retryCount = 3) {
        setTimeout(() => {
            var sourceList = document.querySelectorAll('.new-watch-course-page__right__catalog__item')
            var currentIdx = 0
            var currentPlayIdx = 0
            if (!sourceList && retryCount > 0) {
                return startPlay(notPlay, 3)
            }
            sourceList = [].slice.call(sourceList || [])

            for (var i = 0; i < sourceList.length; i++) {
                /* eslint-disable-next-line */
                ;((idx) => {
                    sourceList[i].addEventListener('click', () => {
                        currentIdx = idx
                        notPlay = []
                        playVideo()
                    })
                })(i)

            }

            if (notPlay && notPlay.length) {
                currentIdx = notPlay[0]
            }

            function handler (event) {
                console.log('ended cb', event)
                if (notPlay && notPlay.length && currentPlayIdx < notPlay.length - 1) {
                    currentIdx = notPlay[++currentPlayIdx]
                } else {
                    currentIdx++
                }
                if (currentIdx < sourceList.length) {
                    sourceList[currentIdx].click()
                    playVideo()
                } else {
                    location.href = '#/course/management'
                    getCurrentProject(3)
                }
            }

            function playVideo (retryCount = 3) {
                if (playVideoTimer) {
                    console.log('has play video timer')
                    clearTimeout(playVideoTimer)
                }
                playVideoTimer = setTimeout(() => {
                    clearTimeout(playVideoTimer)
                    var video = document.querySelector('video')
                    console.log('start play video')
                    if (video) {
                        console.log('has video')
                        video.play()
                        setTimeout(() => {
                            if (video.paused && retryCount > 0) {
                                console.log('retry', retryCount)
                                playVideo(retryCount - 1)
                            }
                        }, 5000)
                        video.onended = null
                        video.onended = handler
                        video.onpause - null
                        video.onpause = function () {
                            if (onPauseCount > 10) {
                                clearTimeout(playVideoTimer)
                                console.log('onpause 陷入死循环 超过10次')
                                onPauseCount = 0
                                return handler('手动播放下一个视频')
                            }
                            onPauseCount++
                            console.log('on pause event')
                            playVideo(3)
                        }
                    } else if (retryCount > 0) {
                        console.log('has not video retry', retryCount)
                        playVideo(retryCount - 1)
                    }
                }, 2000)
            }
            sourceList[currentIdx] && sourceList[currentIdx].click()

            playVideo()
        }, 2000)

    }
})();