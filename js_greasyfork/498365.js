// ==UserScript==
// @name         东鼎学院助手
// @namespace    https://github.com/ShiroMaple
// @version      1.2
// @description  用于基于知学云平台的东鼎学院学习助手，专题和课程页面点击右侧边栏的自动播放按钮，可以实现无人值守挂课；在考试页面提供复制功能，但不能替你考试。
// @author       ShiroMaple
// @license      GPL
// @match        https://izpje.zhixueyun.com/
// @icon         https://zxy9.zhixueyun.com/default/M00/03/19/Ci7mTVx80puAedq_AAAN-JKULPE589.png.webp
// @grant       unsafeWindow
// @grant       window.close
// @require     https://cdn.bootcss.com/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/498365/%E4%B8%9C%E9%BC%8E%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498365/%E4%B8%9C%E9%BC%8E%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//参考了 SharonLee 提供的 知学云助手，非常感谢！

;(function () {
    'use strict'
    let $ = window.jQuery

    /**
   * 添加自动播放按钮
   */
    function addAutoPlayButton(callback) {
        // 自动播放按钮的 HTML 结构
        let autoPlayButton = `
        <li data-v-45a39d9c class="themeColor-background-opacity-10-hover">
           <div data-v-45a39d9c class="item">
              <div data-v-45a39d9c id="autoPlay" class="view">
                 <i data-v-45a39d9c class="iconfont icon-play icon-com themeColor-color"></i>
                 <div data-v-45a39d9c class="side-item-text">自动播放</div>
              </div>
           </div>
       </li>
    `

    // 等待其他按钮加载完成之后，添加自动播放按钮
        let timer = setInterval(function () {
            // 判断是否存在 ul.list 元素，并且自动播放按钮还未添加
            if ($('ul.list').find('li').length != 0 && $('ul.list #autoPlay').length == 0) {
                console.log('🔄 添加自动播放按钮');
                $('ul.list').append(autoPlayButton);
                // 监听开始按钮点击事件
                $('ul.list #autoPlay').click(callback);
                clearInterval(timer);
            }
        }, 200);
    }

    /**
   * 专题页面功能
   */
    function subjectHelper() {
        // 专题页面
        if (location.hash.match('#/study/subject/detail/')) {
            console.log('🔄匹配专题页面')
            // 课程列表
            let items = null
            // 当前课程索引
            let currentIdx = -1
            let timer = null
            let opener = unsafeWindow.opener
            // 添加自动播放按钮
            addAutoPlayButton(autoPlay)

            // 如果是自动打开的，直接自动播放
            if (opener && opener.isAutoPlay) {
                autoPlay()
            }

            /**
       * 自动播放
       */
            function autoPlay() {
                console.log('🔵开始自动播放')
                unsafeWindow.document.title = '🔵开始自动播放'
                unsafeWindow.isAutoPlay = true
                items = $('.subject-catalog .item')
                currentIdx = -1
                playNextCourse()
                checkCurrentCourse()
                // 定时检查当前课程状态
                if (timer) {
                    clearInterval(timer)
                }
                timer = setInterval(checkCurrentCourse, 5000)
            }

            /**
       * 播放下一个课程
       */
            function playNextCourse() {
                currentIdx++
                items = $('.subject-catalog .item')

                let item = items.eq(currentIdx)
                if (item.length < 1) {
                    return
                }
                let name = item.find('.name-des').text()
                let status = item.find('.operation').text().trim()
                // 已完成当前课程
                if (status == '重新学习' || status.includes("考试")) {
                    // 全部课程完成
                    if (currentIdx == items.length - 1) {
                        console.log('✅已完成当前专题下的所有课程')
                        unsafeWindow.document.title = '✅已完成当前专题下的所有课程'
                        alert('✅已完成当前专题下的所有课程')
                        // 通知打开的页面
                        if (opener) {
                            opener.postMessage('autoPlayComplete')
                        }
                    }
                    // 播放下一个课程
                    else {
                        playNextCourse()
                    }
                }
                // 未完成当前课程
                else {
                    console.log(`▶️[${currentIdx + 1}/${items.length}]开始播放【${name}】`)
                    item.click()
                }
            }

            // 监听事件
            unsafeWindow.addEventListener('message', function (e) {
                if (e.data == 'autoPlayComplete') {
                    console.log('📢接收到课程完成通知，开始播放下一个课程')
                    playNextCourse()
                }
                if (e.data == 'resourceNotExist'){
                    console.log('📢课程资源不存在，跳过并开始播放下一个课程')
                    playNextCourse()
                }
            })

            // 检查当前课程状态
            function checkCurrentCourse() {
                items = $('.subject-catalog .item')
                // 课程可能未加载完毕
                if (items.length < currentIdx + 1) {
                    return
                }
                let item = items.eq(currentIdx)
                let name = item.find('.name-des').text()
                let status = item.find('.operation').text().trim()

                // 已经完成自动播放下一个课程
                if (status == '重新学习' || status.includes("考试")) {
                    playNextCourse()
                } else {
                    unsafeWindow.document.title = `🟢[${currentIdx + 1}/${items.length}]正在播放【${name}】`
          console.log(`🟢[${currentIdx + 1}/${items.length}]正在播放【${name}】`)
                }
            }
        }
    }

    /**
   * 课程页面功能
   */
    function courseHelper() {
        if (location.hash.match('#/study/course/detail/')) {
            console.log('🔄匹配课程页面')
            let opener = unsafeWindow.opener
            let timer = null
            // 添加自动播放按钮
            addAutoPlayButton(autoPlay)
            // 专题自动播放进入，直接开始自动播放
            if (opener && opener.isAutoPlay) {
                autoPlay()
            }

            /**
       * 自动播放
       */
            function autoPlay() {
                if (unsafeWindow.isAutoPlay) {
                    return
                }
                console.log('🔵开始自动播放')
                unsafeWindow.document.title = '🔵开始自动播放'
                unsafeWindow.isAutoPlay = true
                playSection()

                //针对东鼎学院的首次播放触发一次id为D200的元素的click方法
                let initialPlay=document.querySelector('#D200registerMask')
                if (initialPlay){initialPlay.click()}
                let initialPlay2=document.querySelector('button[title="Play Video"]')
                if (initialPlay2){initialPlay2.click()}

                //每5秒执行一次playSection
                if (timer) {
                    clearInterval(timer)
                }
                timer = setInterval(playSection, 5000)
            }

            /**
       * 播放章节
       */
            function playSection() {
                //已学课程
                if (location.hash.match('#/study/transition-page/')) {
                if (document.body.innerText.includes('是否继续学习')) {
                    console.log('继续学习')
                    document.querySelectorAll('[id$="goOnStudy"]')[0].click()
                }
                }
                //资源不存在
                if (document.body.innerText.includes('该资源已不存在')) {
                    if (opener) {
                        opener.postMessage('resourceNotExist')
                    }
                    unsafeWindow.close()
                }
                //获取chapter列表
                let items = $('.section-arrow .chapter-list-box')
                for (let idx = 0; idx < items.length; idx++) {
                    let item = items.eq(idx)
                    //章节名
                    let name = item.find('.chapter-item').children().eq(0).text().trim()
                    //章节状态 时长、需学时间
                    let status = item.find('.section-item .pointer').text().trim()
                    //章节类型 必修或选修 文档或视频
                    let type = item.find('.section-item .sub-text').text().trim()
                    let lock = item.find('.chapter-left .icon-suo')
                    // 已完成
                    if ('重新学习' == status || status.includes('考试') || type.includes('考试') || lock.length > 0 || !status.includes('需')) {
                        // 全部完成，通知父页面并关闭当前页面
                        if (idx == items.length - 1) {
                            if (opener) {
                                opener.postMessage('autoPlayComplete')
                            }
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

                //针对视频课件
                let video = document.querySelector('video')
                if (video){
                    // 自动禁音
                    if (!video.muted) {
                        console.log('已自动静音')
                        video.muted = true
                    }
                    // 自动续播
                    if (video.paused) {
                        // 如果出现挂机检测弹窗，模拟点击ID为'D215btn-ok'的按钮
                        if (document.body.innerText.includes('计时中')) {
                            document.getElementById('D215btn-ok').click();
                            console.log('⏸侦测到挂机检测，自动恢复播放')
                        }
                        //console.log('⏸视频被暂停，自动恢复播放')
                        //video.muted = true
                        //video.play()
                    }
                }

                //处理异常弹窗
                let erobtn=document.querySelector('#D218close-btn')
                if (erobtn) {erobtn.click()}

            }
        }
    }

    /**
   * 已学课程页面
   */
    function skipStudied(){
        if (location.hash.match('#/study/transition-page/')) {
            console.log('🔄匹配已学课程页面')
            let timer = null
            if (timer) {
                clearInterval(timer)
            }
            timer = setInterval(autoClick, 5000)
        }
        function autoClick(){
            //已学课程
            if (document.body.innerText.includes('是否继续学习')) {
                console.log('继续学习')
                //document.querySelector('#D321goOnStudy').click()
                document.querySelectorAll('[id$="goOnStudy"]')[0].click()
            }
        }
    }

    /**
   * 活动页面功能
   */
    function trainHelper() {
        if (location.hash.match('#/train-new/class-detail')) {
            // 添加自动播放按钮
            addAutoPlayButton(playNextSection)

            let sectionIdx = -1
            let courseIdx = -1

            function playNextSection() {
                unsafeWindow.isAutoPlay = true
                sectionIdx++
                courseIdx = -1
                let timerId = setInterval(function() {
                    let pointer = $('.course-box .section-title .right-area > .pointer').eq(sectionIdx)
                    if (pointer.hasClass('icon-triangle-down')) {
                        pointer.click()
                    } else {
                        if ($('.course-box .btn.load-more').length > 0) {
                            $('.course-box .btn.load-more').click()
                        } else {
                            clearInterval(timerId)
                            playNextCourse()
                        }
                    }
                }, 200)
                }

            function playNextCourse() {
                courseIdx++
                if ($('.course-box .train-citem .row-title-a').length <= courseIdx) {
                    playNextSection()
                } else {
                    if ($('.course-box .train-citem .ms-train-state').eq(courseIdx).text().trim()=='已完成') {
                        playNextCourse()
                    } else {
                        $('.course-box .train-citem .row-title-a').eq(courseIdx).click()
                    }
                }
            }

            // 监听事件
            unsafeWindow.addEventListener('message', function (e) {
                if (e.data == 'autoPlayComplete') {
                    console.log('📢接收到课程完成通知，开始播放下一个课程')
                    playNextCourse()
                }
            })
        }
    }

    /**
   * 外部链接页面功能
   */
    function externalUrlHelper() {
        // 10 秒后自动关闭外部链接
        if (location.href.match('https://cms.myctu.cn/safe/topic')) {
            let opener = unsafeWindow.opener
            unsafeWindow.document.title = '10秒后关闭此页面'
            setTimeout(function () {
                if (opener) {
                    opener.postMessage('autoPlayComplete')
                    unsafeWindow.close()
                }
            }, 10000)
        }
    }

    /**
   * 考试页面功能
   */
    function examHelper() {
        if (location.hash.match('#/exam/exam/answer-paper')) {
            console.log('🔄匹配考试页面')
            let allowSwitchAndCopyButton = `<div id="allowSwitchAndCopy" class="hand-save-btn themeColor-border-color themeColor-color">允许复制</div>`

      // 添加允许切屏/复制按钮
      let timer = setInterval(function () {
          if ($('#D165submit').length > 0) {
              $('#D165submit').parent().prepend(allowSwitchAndCopyButton)
              $('#allowSwitchAndCopy').click(allowSwitchAndCopy)
              clearInterval(timer)
          }
      }, 200)

      let interval = null
      /**
       * 允许切屏和复制
       */
      function allowSwitchAndCopy() {
          // 允许切屏
          allowSwitch()
          if (interval) {
              clearInterval(interval)
          }
          // 每 500 毫秒监控一次
          interval = setInterval(function () {
              // 允许复制
              allowCopy()
          }, 500)
          alert('操作成功')
      }

            /**
       * 允许切屏
       */
            function allowSwitch() {
                unsafeWindow.onblur = null
                Object.defineProperty(unsafeWindow, 'onblur', {
                    set: function (xx) {
                        /* 忽略 */
                    }
                })
            }

            /**
       * 允许复制
       */
            function allowCopy() {
                let previewContent = document.querySelector('.preview-content')
                previewContent.oncontextmenu = null
                previewContent.oncopy = null
                previewContent.oncut = null
                previewContent.onpaste = null
            }
        }
    }

    /**
   * pdf下载功能
   */
    function pdfDownloadHelper() {
        // 等待 PDF.js 加载完成
        let interval = setInterval(function() {
            if (typeof PDFJS !== 'undefined') {
                console.log('PDFJS loaded');
                // 停止定时检查
                clearInterval(interval);

                // 保存原始的 PDFViewer 构造函数
                let OriginalPDFViewer = PDFJS.PDFViewer;
                // 确认PDFJS被定义了
                console.log('PDFJS内容：',PDFJS);
                console.log('PDFJS.PDFViewer内容：',PDFJS.PDFViewer);
                console.log('OriginalPDFViewer内容：',OriginalPDFViewer);
                // 替换 PDFViewer 构造函数以进行拦截
                PDFJS.PDFViewer = function(options) {
                    console.log('PDFViewer instance created');

                    // 创建 PDFViewer 实例
                    let instance = new OriginalPDFViewer(options);
                    unsafeWindow.pdfViewer = instance;

                    // 返回修改后的 PDFViewer 实例
                    return instance;
                };
                // 确认PDFViewer是否被替换了
                console.log(PDFJS.PDFViewer === OriginalPDFViewer); // 应该返回false
            }
        }, 100); // 每隔100毫秒检查一次，可以根据需要调整时间间隔

        // 设置超时计数器，最多轮询20秒钟
        let timeoutCounter = 0;
        let maxTimeout = 20000; // 20秒钟

        let timeoutInterval = setInterval(function() {
            let fullScreenDiv = $('.pull-right .icon-com-a-fullscreen1');
            let downloadDiv = $('#MyDownload')
            if (unsafeWindow.pdfViewer && fullScreenDiv.length && !downloadDiv.length) {
                // 创建下载按钮
                downloadDiv = $('<div id="MyDownload" class="iconfont icon-xiazai2 m-left" title="下载"></div>');

                // 附加点击事件回调
                downloadDiv.click(function() {
                    pdfViewer.pdfDocument.getData().then((data) => {
                        const blob = new Blob([data], { type: 'application/pdf' });
                        const url = window.URL.createObjectURL(blob);

                        // 创建一个下载链接
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = $('.other-toolbar .other-title').text() || 'document.pdf'; // 设置文件名
                        document.body.appendChild(a);

                        // 触发点击事件以下载文件
                        a.click();

                        // 清理URL对象以释放内存
                        window.URL.revokeObjectURL(url);
                    });
                });

                // 在fullScreenDiv后面添加下载按钮
                fullScreenDiv.after(downloadDiv);
            }

            timeoutCounter += 1;
            if (timeoutCounter >= maxTimeout / 1000) {
                // 超过20秒钟，停止轮询
                clearInterval(interval);
                clearInterval(timeoutInterval);
            }
        }, 1000); // 每隔1秒检查一次超时计数器
    }

    // 统一调用助手功能
    subjectHelper()
    trainHelper()
    courseHelper()
    //skipStudied()
    //externalUrlHelper()
    examHelper()
    //pdfDownloadHelper()
})()