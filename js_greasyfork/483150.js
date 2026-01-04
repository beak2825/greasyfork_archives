// ==UserScript==
// @name         浪潮学习
// @namespace    https://edu.inspur.com/
// @version      0.4
// @author       KZ
// @description  用于浪潮爱学习学习，可以在课程界面自动开始学习，edge>设置>系统和性能>不让这些站点进入睡眠：添加“https://edu.inspur.com/”
// @match        https://edu.inspur.com/*
// @require      https://cdn.bootcss.com/jquery/3.6.1/jquery.min.js
// @grant        unsafeWindow
// @grant        window.addEventListener
// @grant        window.close
// @grant        window.alert
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/483150/%E6%B5%AA%E6%BD%AE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/483150/%E6%B5%AA%E6%BD%AE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
let dataId = 'data-v-d7c91f6e'

;(function () {
    'use strict'
    let $ = window.jQuery

    let playValue = GM_getValue('play');
    console.log("初始化播放状态："+('1'==playValue?'正在播放':'0'==playValue?'播放完成':'初始化'))
    if('0'!=playValue||'1'!=playValue){
        GM_setValue('play','0')
    }
    /**
   * 添加自动播放按钮
   */
    function addAutoPlayButton(callback) {
        // 自动播放按钮
        let autoPlayButton = `<li data-v-d7c91f6e="" class="themeColor-background-opacity-10-hover"><div data-v-d7c91f6e="" class="item" style="display: none;"><i data-v-d7c91f6e="" class="icon-com themeColor-color icon-com-top"></i>
                        自动播放
                    </div><div data-v-d7c91f6e="" class="item"><i data-v-d7c91f6e="" class="icon-com themeColor-color icon-com-top" id="autoPlay"></i><span data-v-d7c91f6e="" class="side-item-text">自动播放</span></div></li>`

    // 等待其他按钮加载完成之后，添加自动播放按钮
    let timer = setInterval(function () {
        if ($('ul['+dataId+']').length != 0 && $('ul['+dataId+'] #autoPlay').length == 0) {
            console.log('🔄添加自动播放按钮')
            $('ul['+dataId+']').append(autoPlayButton)
            // 监听开始按钮点击事件
            $('ul['+dataId+'] #autoPlay').click(callback)
            clearInterval(timer)
        }
    }, 2000)
    }

    /**
   * 课程主页面功能
   */
    function mainPageHelper() {
        if (location.hash.match('#/branch-list-v/')) {
            let opener = unsafeWindow.opener
            let timerMain = null
            let pageNum = 1
            //更新测试
            console.log('🔵开始自动学习')
            unsafeWindow.document.title = '🔵开始自动学习'
            if (timerMain) {
                clearInterval(timerMain)
            }
            timerMain = setInterval(scanClass, 5000)

            function scanClass() {
                let bq = $('li.active.themeColor-border-color')
                pageNum = bq.children().text().trim()
                //console.log(bq[0])
                bq[0].click()
                let playValuex = GM_getValue('play')
                console.log("当前页"+pageNum+"播放状态："+('1'==playValuex?'正在播放':'播放完成'))
                if('1'==playValuex){return}
                playSection()

            }

            function playSection(){
                let currPageAllOk = true
                let classList = $('div.card-box.themeColor-parent-hover')
                for(let idx = 0;idx<classList.length;idx++){
                    let classItem = classList.eq(idx)
                    let status = classItem.find('.status').text().trim()
                    let clickBox = classItem.find('.content-box')[0]
                    //console.log(status)
                    if('已完成'==status){continue}
                    else{
                        currPageAllOk=false
                        //console.log(clickBox);
                        GM_setValue('play', '1')
                        console.log("开始播放："+classItem.find('.title-row .themeColor-child-color .text-overflow').text().trim())
                        clickBox.click()
                        //location.reload()
                        break
                    }
                }
                if(currPageAllOk){
                    console.log("全部学习完成，开始下一页")
                    let nextPageBtn = $('li.themeColor-parent-hover.zxy-pagination-next')
                    //console.log(nextPageBtn);
                    nextPageBtn[0].click()
                }
            }
        }
    }

    /**
   * 课程学习页面功能
   */
    function courseHelper() {
        if (location.hash.match('#/study/course/detail/')) {
            GM_setValue('play', '1')
            let opener = unsafeWindow.opener
            let timer = null
            // 添加自动播放按钮
            // addAutoPlayButton(autoPlay)
            // 专题自动播放进入，直接开始自动播放
            if (opener && opener.isAutoPlay) {
                autoPlay()
            }
            let runTimer =setInterval(autoPlay, 2000)

            /**
       * 自动播放
       */
            function autoPlay() {
                clearInterval(runTimer)

                let ncPlay = $('img#D213registerMask')
                if(ncPlay!=null)ncPlay.click()



                if (unsafeWindow.isAutoPlay) {
                    return
                }
                console.log('🔵开始自动播放')
                unsafeWindow.document.title = '🔵开始自动播放'
                unsafeWindow.isAutoPlay = true
                playSection()
                if (timer) {
                    clearInterval(timer)
                }
                timer = setInterval(playSection, 5000)
            }

            /**
       * 播放章节
       */
            function playSection() {
                let items = $('.section-arrow .chapter-list-box')

                for (let idx = 0; idx < items.length; idx++) {
                    let item = items.eq(idx)
                    let name = item.find('.chapter-item').children().eq(1).text().trim()
                    let statusList = item.find('.section-item .pointer')
                    let status = '0'
                    if(statusList.length>1)status='1'
                    // let status = item.find('.section-item .pointer').eq(statusIdx).text().trim()
                    let type = item.find('.section-item .sub-text').text().trim()
                    let lock = item.find('.chapter-left .icon-suo')
                    // 已完成
                    if ('0' == status || status.includes('考试') || type.includes('考试') || lock.length > 0) {
                        // 全部完成，通知父页面并关闭当前页面
                        if (idx == items.length - 1) {
                            if (opener) {
                                opener.postMessage('autoPlayComplete')
                            }
                            GM_setValue('play', '0')
                            unsafeWindow.close()
                        }
                    }
                    // 未完成
                    else {
                        // 未播放则点击播放
                        let isFocus = item.hasClass('focus')
                        if (!isFocus) {
                            console.log(`▶️[${idx + 1}/${items.length}]开始播放【${name}】`)
                            item.click()
                        } else {
                            unsafeWindow.document.title = `🟢[${idx + 1}/${items.length}]正在播放【${name}】`
              console.log(`🟢[${idx + 1}/${items.length}]正在播放【${name}】`)
                        }
                        break
                    }
                }

                // 自动禁音播放视频
                let video = document.querySelector('video')
                if (video && !video.muted) {
                    video.muted = true
                }
                let randomPaused = $('div#D228btn-ok')
                if(randomPaused!=null){
                    randomPaused.click();
                    if(randomPaused.length!=0)randomPaused[0].click();
                }
                if (video && video.paused) {
                    console.log('⏸视频被暂停，自动恢复播放')
                    video.muted = true
                    video.play()
                }
            }
        }
    }

    // 统一调用助手功能
    mainPageHelper()
    courseHelper()
})()
