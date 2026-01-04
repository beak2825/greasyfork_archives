// ==UserScript==
// @name         Coursera SubEx / Coursera multiple subtitles show below the video / Coursera多字幕显示在视频下方插件
// @namespace    http://tampermonkey.net/
// @version      0.95
// @description  Coursera SubEx , Show multiple subtitles/captions of any languge below the video in coursera.org's learning page at your wish.
// @description:zh-CN  Coursera SubEx: 根据你的选择，同时显示多种语言的字幕显示在coursera.org课程学习页面的视频播放器下方。 不占用视频内容区域，还可以方便拷贝字幕做笔记。
// @description:zh-TW  Coursera SubEx: 根據你的選擇，同時顯示多種語言的字幕顯示在coursera.org課程學習頁面的視頻播放器下方。 不占用視頻內容區域，還可以方便拷貝字幕做筆記。
// @author       DryTofu
// @match        *://www.coursera.org/learn/*
// @match        *://coursera.org/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454521/Coursera%20SubEx%20%20Coursera%20multiple%20subtitles%20show%20below%20the%20video%20%20Coursera%E5%A4%9A%E5%AD%97%E5%B9%95%E6%98%BE%E7%A4%BA%E5%9C%A8%E8%A7%86%E9%A2%91%E4%B8%8B%E6%96%B9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/454521/Coursera%20SubEx%20%20Coursera%20multiple%20subtitles%20show%20below%20the%20video%20%20Coursera%E5%A4%9A%E5%AD%97%E5%B9%95%E6%98%BE%E7%A4%BA%E5%9C%A8%E8%A7%86%E9%A2%91%E4%B8%8B%E6%96%B9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
// coursera字幕处理
// 参考 https://stackoverflow.com/questions/32252337/how-to-style-text-tracks-in-html5-video-via-css/45087610#45087610
// https://stackoverflow.com/questions/64505385/html5-video-subtitles-positioning

// 2023-11-10 修改
// 之前使用 https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// 现在改成用    https://code.jquery.com/jquery-1.12.4.min.js

let videoCss = `
  .ex-subtitle-line-wrap {
    font-size: 24px;
  }
  .ex-subtitle-line {
    margin: 5px auto;
    text-align: center;
    border: 1px dashed #aaa;
  }
  .ex-subtitle-line span {
    padding-right: 2px;
    padding-left: 2px;
    line-height: 120%;
  }
  .ex-subtitle-line .subEx_beforeSubItem {
    color: #ccc;
  }
  .ex-subtitle-line .subEx_currentSubItem {
    background-color: #afe9f7;
    color: #111;
  }
  .ex-subtitle-line .subEx_afterSubItem {
    color: #ccc;
  }

.exLngToolbar {
  margin-top: 10px;
}
.exLngToolbar label {
   font-weight: normal;
   padding: 5px 10px 5px 5px;
   background-color: transparent;
}

.exLngToolbar label.selected {
  font-weight: bold;
  background-color: #aaa;
}

.exLngToolbar button{
  margin-left: 10px;
  padding: 0px 5px;
}
  #ym_subExBtnWrap {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 9999;
  }
  .ym_subExBtn {
      background-color: #34A853;
      color: #fff;
      border: none;
      padding: 2px 5px;
      margin-right: 8px;
  }

`;
    (function(factory) {
        factory(document, jQuery)
    })(function (document, $) {
        GM_addStyle(videoCss)

        const Setting = (function() {
            let selectedLngs = null, keepSubBeforeCount = null, keepSubAfterCount = null;
            const DEFAULT_SELECTED_LNGS = [],
                  DEFAULT_SUB_FONT_SIZE = '24px',
                  DEFAULT_KEEP_SUB_BEFORE_COUNT = 0,
                  DEFAULT_KEEP_SUB_AFTER_COUNT = 0;

            const LS_KEY_SEL_LNG = "coursera_video_ext_selected_lngs",
                  LS_KEY_SUB_FONT_SIZE = "coursera_video_ext_sub_font_size",
                  LS_KEY_KEEP_SUB_BEFORE_COUNT = "coursera_video_ext_keep_sub_before",
                  LS_KEY_KEEP_SUB_AFTER_COUNT = "coursera_video_ext_keep_sub_after";;


            function getIntValFromLs(key, defaultVal) {
                let n = parseInt(localStorage.getItem(key))
                if(isNaN(n)) {
                    return defaultVal
                }
                return n;
            }

            function saveIntValToLs(key, val, defaultVal) {
                let intVal = parseInt(val)
                if(isNaN(intVal)) {
                    intVal = defaultVal
                }
                localStorage.setItem(key, intVal)
                return intVal
            }

            function getArrayValFromLs(key, defaultVal) {
                let arr = null
                try {
                    arr = JSON.parse(localStorage.getItem(key));
                } catch(e) {
                }
                if(!arr) {
                    arr = defaultVal
                }
                return arr
            }

            function saveArrayValToLs(key, val, defaultVal) {
                localStorage.setItem(key, JSON.stringify(val))
                return val
            }

            function getSubFontSize() {
                return localStorage.getItem(LS_KEY_SUB_FONT_SIZE) || DEFAULT_SUB_FONT_SIZE;
            }

            function saveSubFontSize(fontSize) {
                localStorage.setItem(LS_KEY_SUB_FONT_SIZE, fontSize)
            }

            function getKeepSubBeforeCount() {
                if(keepSubBeforeCount === null) {
                    keepSubBeforeCount = getIntValFromLs(LS_KEY_KEEP_SUB_BEFORE_COUNT, DEFAULT_KEEP_SUB_BEFORE_COUNT);
                }
                return keepSubBeforeCount;
            }

            function saveKeepSubBeforeCount(count) {
                keepSubBeforeCount = saveIntValToLs(LS_KEY_KEEP_SUB_BEFORE_COUNT, count, DEFAULT_KEEP_SUB_BEFORE_COUNT)
            }

            function getKeepSubAfterCount() {
                if(keepSubAfterCount === null) {
                    keepSubAfterCount = getIntValFromLs(LS_KEY_KEEP_SUB_AFTER_COUNT, DEFAULT_KEEP_SUB_AFTER_COUNT);
                }
                return keepSubAfterCount;
            }

            function saveKeepSubAfterCount(count) {
                keepSubAfterCount = saveIntValToLs(LS_KEY_KEEP_SUB_AFTER_COUNT, count, DEFAULT_KEEP_SUB_AFTER_COUNT)
            }


            function removeElm(arr, elm) {
                let i = arr.indexOf(elm)
                if(i > -1) {
                    arr.splice(i, 1)
                }
                return arr
                // return arr.filter(l => l != elm)
            }

            function getSelectedLngs() {
                if(!selectedLngs) {
                    selectedLngs = getArrayValFromLs(LS_KEY_SEL_LNG, DEFAULT_SELECTED_LNGS)
                }
                return selectedLngs
            }

            function saveSelectedLngs(arr) {
                selectedLngs = saveArrayValToLs(LS_KEY_SEL_LNG, arr, DEFAULT_SELECTED_LNGS)
                return selectedLngs
            }

            function addLng(lng) {
                if(!lng) {
                    return
                }
                if(!selectedLngs) {
                    selectedLngs = getSelectedLngs()
                }
                if(!selectedLngs.includes(lng)) {
                    selectedLngs.push(lng)
                    saveSelectedLngs(selectedLngs)
                }
                return selectedLngs
            }

            function removeLng(lng) {
                if(!lng) {
                    return
                }
                if(!selectedLngs) {
                    selectedLngs = getSelectedLngs()
                }
                selectedLngs = removeElm(selectedLngs, lng)
                saveSelectedLngs(selectedLngs)
                return selectedLngs
            }

            function clearSelectedLngs() {
                selectedLngs = []
                saveSelectedLngs(selectedLngs)
                return selectedLngs
            }

            return {
                getSelectedLngs,
                clearSelectedLngs,
                removeLng,
                addLng,
                saveSelectedLngs,

                getSubFontSize,
                saveSubFontSize,

                getKeepSubBeforeCount,
                saveKeepSubBeforeCount,
                getKeepSubAfterCount,
                saveKeepSubAfterCount,
            }
        })()

        // global objects 全局变量
        // $videoWrapper 是包含video的比较上级的div
        let $video = null, video = null, showMode, $videoWrapper = null;
        let $extSubtitleWrap = null, $exLngToolbar = null;
        let subtitleLineMap = {}; // 语言string到字幕显示区jQuery对象的映射表

        // if (i.language == "zh-CN" || i.language == "zh-TW" || i.language == "en-US" || i.language == "en") {
        const lngWeightMap = {
            "zh-CN": 10,
            "zh": 20,
            "en-US": 30,
            "en-GB": 40,
            "en": 50,
            "zh-TW": 60,
        }
        const lngWeight = function(lng) {
            return lngWeightMap[lng] || 1000
        }
        function printTracks(msg, $tracks) {
            let arr = []
            $tracks.forEach($track => {
                arr.push($track.attr('srclang') + '-' + $track.attr('label') + '-' + $track.data('lngweight'))
            })
            console.log(msg, arr)
        }

        function printTextTracks(msg, textTracks) {
            for(let i=0; i<textTracks.length; ++i) {
                let track = textTracks[i];
                let cues = track.cues;
                let cuesLen = cues ? cues.length : 0;
                console.log('track' + i, track, cuesLen)
            }
        }

        function textTracksToLngs(textTracks) {
            let lngs = []
            for (const track of textTracks) {
                lngs.push(track.language)
            }
            return lngs;
        }

        // 把 textTracks 按照语言权重排序 生成简单对象数组
        function textTracksToSortedObjs(textTracks) {
            let objs = []
            for (const track of textTracks) {
                objs.push({
                    language: track.language,
                    label: track.label,
                    lngweight: lngWeight(track.language),
                })
            }
            objs.sort(function(a, b) {
                return a.lngweight - b.lngweight
            })
            return objs;
        }

        // 检查已开选中字幕语言和当前视频存在的字幕语言，去掉当前视频不存在的，并保存到localstorage，返回选中语言和当前可用语言的交集
        function checkSelectedLngsValid(selectedLngs, textTracks) {
            const allLngs = textTracksToLngs(textTracks) // 当前视频的全部可用字幕语言
            const notValidLngs = selectedLngs.filter(lng => !allLngs.includes(lng)) // 找出selectedLngs含有，但当前视频不存在的字幕语言
            if(notValidLngs && notValidLngs.length) {
                notValidLngs.forEach(lng => Setting.removeLng(lng))
            }
            return Setting.getSelectedLngs()
        }

        // 根据选中的语言，处理video中的textTracks 和 生成对应的字幕栏
        function applySelectedLngs(selectedLngs, textTracks, $extSubtitleWrap) {
            subtitleLineMap = {}
            $extSubtitleWrap.find(">.ex-subtitle-line").each(function() { // 先把现有字幕栏缓存起来，并且从父节点删除
                let $subtitleLine = $(this) // 这是显示一种字幕语言的div
                let lng = $subtitleLine.attr("data-lng")
                if(lng) {
                    // 尝试把去掉的字幕栏也暂存起来，如果出现奇怪错误，就用后面的判断语句
                    subtitleLineMap[lng] = $subtitleLine
                   /*
                   if(selectedLngs.includes(lng)) {
                       subtitleLineMap[lng] = $subtitleLine
                    }
                   */
                }
                $subtitleLine.remove()
            })

            selectedLngs.forEach(lng => { // 按照当前选中语言初始化各个语言的字幕栏
                let $subtitleLine = subtitleLineMap[lng]
                if(!$subtitleLine) {
                    $subtitleLine = $(`<div class="ex-subtitle-line cds-1 css-0 cds-3 cds-grid-item cds-48">${lng}</div>`).attr('data-lng', lng)
                    subtitleLineMap[lng] = $subtitleLine
                }
                $extSubtitleWrap.append($subtitleLine)
            })

            if(selectedLngs && selectedLngs.length) { // 有选中字幕才处理
                // 先设置 track的mode属性 hidden 和 disabled ， hidden是激活但不在video中显示的字幕轨
                for (const track of textTracks) {
                    if(selectedLngs.includes(track.language)) {
                        track.mode = 'hidden'
                    } else {
                        track.mode = 'disabled'
                    }
                }
                // 绑定 cue事件  因为大多数时候不是把track激活，就能拿到cues的，需要加载，所以这里用了重试循环任务
                let maxTryTime = 1000, tryTime = 0;
                let bindCueEvent = function() {
                    let cueLoadFlag = true; // 所有选中字幕轨的cues是否都已经加载成功的标志
                    ++tryTime
                    // console.log("开始尝试第" + tryTime + "次------->")
                    for (const track of textTracks) { // 循环字幕track
                        let trackLng = track.language
                        if(selectedLngs.includes(trackLng)) { // 选中语言包含这个字幕，需要处理的字幕轨
                            let cues = track.cues
                            if(cues && cues.length) { // 本字幕轨的cues 加载成功！
                                // console.log("尝试" + tryTime + "次:" + trackLng + '--成功找到cues:' + cues.length, cues)
                                for (let j=0; j<cues.length; ++j) {
                                    let cue = cues[j]
                                    // console.log('cues[' + j + "]", cue)
                                    // 设置字幕中一条字幕cue的事件
                                    cue.onenter = function() {
                                        applyCurrentSub(trackLng, cues, j)
                                    };
                                    cue.onexit = function() {
                                        // console.log(trackLng + ' 字幕退出:' + this.text)
                                    };
                                }
                            } else { // 这个字幕轨的cues没有加载，设置标志为false，等待下次定时任务执行
                                // console.log("XX-尝试" + tryTime + "次:" + trackLng + '--找到空字幕:' + cues.length, cues)
                                cueLoadFlag = false
                            }
                        }
                    }
                    if(cueLoadFlag) { // 如果cues都装载上了 ， 需要处理当前字幕显示
                        // 判断当前视频所处时间点加载当前字幕
                        let currentTime = video.currentTime
                        console.log('所选语言字幕轨全部加载完毕，video.currentTime=' + video.currentTime)
                        for (const track of textTracks) { // 循环字幕track
                            let trackLng = track.language
                            if(selectedLngs.includes(trackLng)) { // 选中语言包含这个字幕，需要处理的字幕轨
                                let cues = track.cues

                                if(cues && cues.length) { // 本字幕轨的cues 加载成功！
                                    let matchIdx = findMatchCue(currentTime, cues, trackLng)
                                    applyCurrentSub(trackLng, cues, matchIdx)
                                }
                            }
                        }
                    }
                    if(!cueLoadFlag && tryTime < maxTryTime) { // 如果有 cues没有正常处理，且在最大重试次数内
                        setTimeout(bindCueEvent, 500)
                    }
                }
                bindCueEvent() // 执行字幕cue事件绑定
            }
            console.log('--After applySelectedLngs', textTracks)
        }

        function findMatchCue(currentTime, cues, lng) {
            currentTime = currentTime || 0
            for (let j=0; j<cues.length; ++j) {
                let cue = cues[j]
                if(currentTime >= cue.startTime && currentTime <= cue.endTime) {
                    console.log('currentTime=' + currentTime + ',在语言:' + lng + "中找到匹配字幕:" + j, cue)
                    return j
                }
            }
            console.log('currentTime=' + currentTime + ',在语言:' + lng + "中没有找到匹配字幕，返回0")
            return 0
        }

        // 根据video当前播放时间显示字幕
        // lng : 当前语言
        // cues: 当前cues
        // j: 当前所处字幕index
        function applyCurrentSub(lng, cues, j) {
            // console.log(trackLng + ' 字幕进入:' + this.text)
            let beforeCount = Setting.getKeepSubBeforeCount(), afterCount = Setting.getKeepSubAfterCount();
            // console.log('----j=' + j)
            let beforeTexts = []
            if(beforeCount > 0) {
                let beforeFromIdx = j - beforeCount
                if(beforeFromIdx < 0) {
                    beforeFromIdx = 0;
                }
                for(let k=beforeFromIdx; k<j; ++k) {
                    beforeTexts.push(_cueToSpan(cues[k], 'subEx_beforeSubItem'))
                }
            }
            let afterTexts = []
            if(afterCount > 0) {
                let afterToIdx = j + afterCount + 1
                if(afterToIdx > cues.length) {
                    afterToIdx = cues.length;
                }
                for(let k=j+1; k<afterToIdx; ++k) {
                    // afterTexts.push('<span class="subEx_afterSubItem">' + cues[k].text + ' </span>')
                    afterTexts.push(_cueToSpan(cues[k], 'subEx_afterSubItem'))
                }
            }
            //let subHtml = beforeTexts.join('') + '<span class="subEx_currentSubItem">' + cues[j].text + ' </span>'
            let subHtml = beforeTexts.join('') + _cueToSpan(cues[j], 'subEx_currentSubItem')
            + afterTexts.join('')
            subtitleLineMap[lng].html(subHtml)
            subtitleLineMap[lng].find('span').dblclick(function() {
                var _$me = $(this)
                console.log('双击字幕: '+ _$me.text() + '将跳转到: ' + _$me.attr('startTime'), _$me.attr('endTime'))
                let startTime = parseFloat(_$me.attr('startTime'))
                video.currentTime = startTime
                video.play()
            })
        }

        function _cueToSpan(cue, cls) {
            return '<span class="' + cls + '" startTime="' + cue.startTime + '" endTime="' + cue.endTime + '">' + cue.text + '</span> '
        }


        function removeHeader() {
            var $h = $('header.rc-DesktopHeaderControls')
            if($h.length) {
                $h = $h.closest('div.cds-grid-item')
                if($h.length) {
                    $h.remove()
                }
            }
            $('#header-container').remove()
        }


        function doWork() { // 找到视频元素之后 初始化字幕和控制元素
            if($extSubtitleWrap) {
                $extSubtitleWrap.remove()
            }
            if($exLngToolbar) {
                $exLngToolbar.remove()
            }

            $extSubtitleWrap = $(`<div class="cds-1 css-0 cds-3 cds-grid-item cds-48 ex-subtitle-line-wrap" id="extSubtitleWrap"></div>`);

            let selectedLngs = Setting.getSelectedLngs()
            let textTracks = video.textTracks
            console.log("tracks", textTracks);
            // 求 selectedLngs 和 textTracks 的交集，如果 selectedLngs 有textTracks中不存在的，则需要删除 （也会存储到 localstorage）
            selectedLngs = checkSelectedLngsValid(selectedLngs, textTracks)
            console.log('selectedLngs', selectedLngs)

            let trackInfoObjs = textTracksToSortedObjs(textTracks)
            console.log('trackInfoObjs', trackInfoObjs)

            $exLngToolbar = $('<div class="cds-1 css-0 cds-3 cds-grid-item exLngToolbar" id="exLngToolbar"></div>')
            trackInfoObjs.forEach(obj => {
                $exLngToolbar.append(`<label>${obj.label}<input type="checkbox" value="${obj.language}" /></label> &nbsp; `)
            })
            // 字幕语言选择checkbox初始化和事件绑定
            $exLngToolbar.find('input[type=checkbox]').each(function() {
                let $checkbox = $(this), lng = $checkbox.val()
                if(selectedLngs.includes(lng)) {
                    $checkbox.prop('checked', true)
                    $checkbox.closest('label').addClass('selected')
                }
                $checkbox.click(function() {
                    if($checkbox.prop('checked')) {
                        console.log(lng + ' 选中')
                        selectedLngs = Setting.addLng(lng)
                        $checkbox.closest('label').addClass('selected')
                    } else {
                        console.log(lng + ' 取消选中')
                        selectedLngs = Setting.removeLng(lng)
                        $checkbox.closest('label').removeClass('selected')
                    }
                    console.log('selectedLngs', selectedLngs)
                    applySelectedLngs(selectedLngs, video.textTracks, $extSubtitleWrap)
                })
            })

            // ----- 开始 增加 font size 和 最近字幕显示多少条的配置
            let exSubFontSize = Setting.getSubFontSize()
            let selectCtrlStrArr = ['<select name="subExSubFontSizeSel" id="subExSubFontSizeSel">']
            let fontSizeList = ["0.5rem", "0.8rem", "1rem", "1.2rem", "1.5rem", "1.8rem", "2rem", "2.5rem", "3rem", "3.5rem", "4rem", "4.5rem", "5rem"]
            for(let i=6; i<=120; ++i) {
                fontSizeList.push(i + 'px')
            }
            fontSizeList.forEach(fs => {
                selectCtrlStrArr.push('<option value="' + fs + '"' + (fs==exSubFontSize ? ' selected' : '') + '>' + fs + '</option>')
            })
            selectCtrlStrArr.push('</select>')
            let $exSubFontSizeSel = $(selectCtrlStrArr.join(''))
            function applySubExFontSize() {
                $extSubtitleWrap.css("font-size", $exSubFontSizeSel.val())
            }
            $exSubFontSizeSel.change(function() {
                Setting.saveSubFontSize($(this).val())
                applySubExFontSize()
            })
            applySubExFontSize()
            $exLngToolbar.append($exSubFontSizeSel)

            let keepSubBeforeCount = Setting.getKeepSubBeforeCount()
            selectCtrlStrArr = ['<select name="subExkeepSubBeforeCountSel" id="subExkeepSubBeforeCountSel">']
            for(let i=0; i<=10; ++i) {
                selectCtrlStrArr.push('<option value="' + i + '"' + (i==keepSubBeforeCount ? ' selected' : '') + '>' + i + '</option>')
            }
            selectCtrlStrArr.push('</select>')
            let $keepSubBeforeCountSel = $(selectCtrlStrArr.join(''))
            $keepSubBeforeCountSel.change(function() {
                Setting.saveKeepSubBeforeCount($(this).val())
            })

            let keepSubAfterCount = Setting.getKeepSubAfterCount()
            selectCtrlStrArr = ['<select name="subExkeepSubAfterCountSel" id="subExkeepSubAfterCountSel">']
            for(let i=0; i<=10; ++i) {
                selectCtrlStrArr.push('<option value="' + i + '"' + (i==keepSubAfterCount ? ' selected' : '') + '>' + i + '</option>')
            }
            selectCtrlStrArr.push('</select>')
            let $keepSubAfterCountSel = $(selectCtrlStrArr.join(''))
            $keepSubAfterCountSel.change(function() {
                Setting.saveKeepSubAfterCount($(this).val())
                // TODO
            })

            let $exSubShowLastSubCountSelLabel = $('<span> &nbsp; Keep </span>')
            $exLngToolbar.append( $('<span> &nbsp; Keep </span>')).append($keepSubBeforeCountSel)
                .append('<span> : </span>').append($keepSubAfterCountSel)

            // ----- 结束 增加 font size 和 最近字幕显示多少条的配置

            // ----- 开始 增加 mode=1 的时候增大缩小视频播放div的控制按钮
            if(showMode == 1) {
                let $addVideoWrapBtn = $('<button>+</button>'), $reduceVideoWrapBtn = $('<button>-</button>'), stepPx = 10; // 设置增大缩小视频播放窗口每次缩放量 setting
                let posVideoWrapperAddTimeOut = null, posVideoWrapperReduceTimeout = null, timeOutFreq = 150;
                $addVideoWrapBtn.mousedown(function() {
                    posVideoWrapperAdd(stepPx, 0)
                    posVideoWrapperAddTimeOut = setInterval(function() {
                        posVideoWrapperAdd(stepPx, 0)
                    }, timeOutFreq)
                }).on('mouseout mouseup', function() {
                    if(posVideoWrapperAddTimeOut) {
                        clearInterval(posVideoWrapperAddTimeOut)
                    }
                    posVideoWrapperAddTimeOut = null
                })
                $reduceVideoWrapBtn.click(function() {
                    posVideoWrapperReduce(stepPx, 0)
                })
                $reduceVideoWrapBtn.mousedown(function() {
                    posVideoWrapperReduce(stepPx, 0)
                    posVideoWrapperReduceTimeout = setInterval(function() {
                        posVideoWrapperReduce(stepPx, 0)
                    }, timeOutFreq)
                }).on('mouseout mouseup', function() {
                    // console.log('mouseout or mouseup事件触发！！！')
                    if(posVideoWrapperReduceTimeout) {
                        clearInterval(posVideoWrapperReduceTimeout)
                    }
                    posVideoWrapperReduceTimeout = null
                })
                $exLngToolbar.append($addVideoWrapBtn).append($reduceVideoWrapBtn)
            }

            // ----- 结束 增加 mode=1 的时候增大缩小视频播放div

            // 语言checkbox toolbar
            let $toolbarWrap = $("div.rc-VideoToolbar > .cds-grid-item:first")
            // 2023-11-10 修改开始  （页面发生变化  $toolbarWrap 不存在了！ ）
            if($toolbarWrap.length > 0) {
                $toolbarWrap.find("> .exLngToolbar").remove()
                $toolbarWrap.append($exLngToolbar)
            } else {
                $videoWrapper.after($exLngToolbar)
            }
            // 2023-11-10 修改结束
            
            // let $videoToolbar = $("div.rc-VideoToolbar > .cds-grid-item").append($exLngToolbar)

            // --- 语言选择栏处理完毕 --
            applySelectedLngs(selectedLngs, video.textTracks, $extSubtitleWrap)

            if(showMode == 1) { // 视频显示模式，浮动显示
                /*****************
                // 这段代码在把把字幕栏和字幕语言选择工具栏放到页面下方的方法
                // 把字幕栏和字幕语言选择工具栏放到页面下方
                let $addPoint = $('.rc-ItemFeedback:first').parent().parent()
                console.log('subtitle opt addPoint:', $addPoint)
                $addPoint.before($extSubtitleWrap, $exLngToolbar)
                **********/
                // 改成加在滚动内容区域的头部
                let $addPoint = $('.ItemLecture_Video_Title:first')
                console.log('subtitle opt addPoint:', $addPoint)
                $addPoint.before($extSubtitleWrap, $exLngToolbar)

                videoFloatShow()
            } else { // showMode == 0 字幕栏插入到播放器下方，播放器不浮动
                // 在video上层div后方插入 字幕栏和语言选择工具栏
                // TODO
                if($videoWrapper.hasClass('ym_videoFloatWrapper')) { // 从浮动状态下来
                    $videoWrapper.removeClass('ym_videoFloatWrapper')
                    $videoWrapper.removeAttr("style");
                    /*
                    $videoWrapper.css({
                        "position": "static",
                        "left": 'auto',
                        "width": 'auto',
                        'z-index': 'auto',
                    })
                    */
                    let $videoAddPoint = $('.ItemLecture_Video_Notes_Navigation')
                    if(!$videoAddPoint.length) {
                        $videoAddPoint = $('.ItemLecture_Video_Title')
                        if(!$videoAddPoint.length) {
                            console.error('Coursear页面结构发生变化，找不到视频插入点')
                        }
                    }
                    $videoAddPoint.after($videoWrapper.remove())
                    $extSubtitleWrap.css('margin-top', '10px')
                }
                $videoWrapper.after($extSubtitleWrap, $exLngToolbar)
            }

            console.log("---------结束执行 YM Coursera 字幕处理 ")
        }

        let _findVideoRetryTime = 0, _findVideoRetryMaxTime = 60
        function findVideo(_showMode) {
            showMode = _showMode
            ++_findVideoRetryTime
            $video = $("video.vjs-tech:first");
            if($video.length > 0) {
                console.log("## 找到video")
                video = $video.get(0)
                // 2023-11-10 修改开始
                // $videoWrapper = $video.closest('.cds-grid-item') // 设置包含video的上级层全局变量   video > .video-main-player-container > .rc-VideoMiniPlayer > .cds-1 css-0 cds-3 cds-grid-item cds-48
                $videoWrapper = $video.closest('#video-player-row') // 设置包含video的上级层全局变量   video > .video-main-player-container > .rc-VideoMiniPlayer > .cds-1 css-0 cds-3 cds-grid-item cds-48
                if($videoWrapper.length == 0) {
                    // console.error("video的上级层没有找到：通过 $video.closest('.cds-grid-item')，页面可能发生变化！");
                    console.error("video的上级层没有找到：通过 $video.closest('#video-player-row')，页面可能发生变化！");
                }
                // 2023-11-10 修改结束
                _findVideoRetryTime = 0 // 清零，下次找新的video重新算
                doWork()
                removeHeader()   // 20240-02-11 增加 （删除头部）
               return
            } else {
                if(_findVideoRetryTime >= _findVideoRetryMaxTime) {
                   console.log("-- 没有找到video元素，尝试超过最大尝试次数" + _findVideoRetryMaxTime +"次，退出！ 刷新页面重试吧......")
                    return
                } else {
                    setTimeout(findVideo, 3000)
                }
            }
        }

        console.log("---------开始执行 YM Coursera 字幕处理 ")

        // 先注销改成 按钮触发
        // findVideo()

        // 放置 $videoWrapper 到合适的位置

        function posVideoWrapperAdd(addVal, doScrollType) {
            posVideoWrapper($videoWrapper.width() + addVal, doScrollType)
        }

        function posVideoWrapperReduce(addVal, doScrollType) {
            posVideoWrapper($videoWrapper.width() - addVal, doScrollType)
        }

        // showMode==1 浮动模式下，计算video播放窗口大小和位置
        // doScrollType = 0  字幕区域不滚动到视频下方
        // doScrollType = 1  字幕区域直接设置到视频下方位置，不做动画
        // doScrollType = 2  字幕区域直置到视频下方位置，用动画方式滚动
        function posVideoWrapper(targetWidth, doScrollType) {
            let $refBlock = $('.ItemLecture_Video_Title:first')
            if(!$refBlock.length) {
                $refBlock = $('.rc-VideoHighlightingManager:first')
                if(!$refBlock.length) {
                    $refBlock = $('h1.video-name')
                    if(!$refBlock.length) {
                        console.error('courser页面结构变化很大，找不到视频参考元素in posVideoWrapper');
                    }
                }
            }
            let left = 10, top = 16, width = 0;
            if($refBlock.length) {
                left = $refBlock.offset().left;
                width = $refBlock.width()
            }
            if(targetWidth && targetWidth > 0) { // 如果显式指定width
                if(targetWidth <= width) {
                    left = Math.floor(left + (width - targetWidth) / 2)
                    width = targetWidth
                } else {
                    if(targetWidth > 1200) {
                        targetWidth = 1200
                    }
                    left = Math.floor(left - (targetWidth - width) / 2)
                    let $winWidth = $(window).width()
                    if(left + targetWidth > $winWidth) {
                        left = $winWidth - targetWidth
                        if(left < 10) {
                            left = 10
                            targetWidth = $winWidth - left
                        }
                    }
                    width = targetWidth
                }
            }
            let posCss = {
                "top": top + 'px',
                "left": left + 'px',
            }
            if(width && width > 0) {
                posCss.width = width + "px"
            }
            $videoWrapper.css(posCss)
            // console.log('posVideoWrapper set posCss', posCss)

            let height = $videoWrapper.height()

            let $contentWrap = $('.ItemPageLayout_content_body:first')
            $extSubtitleWrap.css('margin-top', (height + 40 - $contentWrap.offset().top) + 'px')
            if(doScrollType == 2) {
                $contentWrap.animate({
                    scrollTop: 20
                }, 1000);
            } else if(doScrollType == 1) {
                $contentWrap.scrollTop(20)
            }
        }

        /***** 这个计算方法废弃
        // 计算video播放窗口大小和位置
        function posVideoWrapper(targetWidth) {
            let RIO = 0.62
            let $win = $(window),maxWidth = $win.width() - 25, maxHeight = $win.height() - 200, width, height;
            if(maxWidth * RIO > maxHeight) {
                if(maxHeight < 50) {
                    maxHeight = Math.floor($win.height() * 0.7)
                }
                height = maxHeight
                width = Math.floor(height / RIO)
            } else {
                width = maxWidth
                height = Math.floor(width * RIO)
            }
            console.log('videoWrap重置宽高计算出来的值:', width, height)
            if(targetWidth && targetWidth > 0 && targetWidth < width) {
                width = targetWidth
            }
            let left = 5 + Math.floor(($win.width() - 25 - width) / 2)

            $videoWrapper.css({
                "top": 20 + 'px',
                "left": left + 'px',
                "width": width + "px",
                // "height": height + "px",
            })

            width = $videoWrapper.width()
            height = $videoWrapper.height()
            console.log('videoWrap重置宽高实际值:', width, height)
        }
        ***********/


        // 视频浮动显示
        function videoFloatShow() {
            // 计算video的大小

            // 先把 $videoWrapper 挪到页面 absolute 流中
            $videoWrapper.addClass('ym_videoFloatWrapper')
            $videoWrapper.css({
                "position": "absolute",
                "z-index": 99999,
            })
            $(document.body).append($videoWrapper.remove())

            posVideoWrapper(0, 2)

            $(window).resize(function() {
                if(showMode == 1) {
                    posVideoWrapper(0, 1)
                }
            })

            let $contentWrap = $('.ItemPageLayout_content_body:first')
            let $videoPlayer = $('.rc-VideoMiniPlayer:first')
            $contentWrap.scroll(function() { // 防止出现coursera自带的右下角mini播放器效果
                $videoPlayer.removeClass('mini')
                $videoPlayer.find('.video-placeholder').css('height', '0px')
                setTimeout(function() {
                    $videoPlayer.removeClass('mini')
                    $videoPlayer.find('.video-placeholder').css('height', '0px')
                }, 10)
            })

            /***************
            // **** 这段代码在把字幕区域加到文档末尾时可用， 不要删除，留着备用和参考。
            // 带脚本文本的长文本滚动区域
            let $contentWrap = $('.ItemPageLayout_content_body:first')
            let initScrollTop = $contentWrap.scrollTop() + $extSubtitleWrap.offset().top - height - 25
            console.log('计算滚动区域scrollTop', $contentWrap.scrollTop(), $extSubtitleWrap.offset(), height, initScrollTop)
            // $contentWrap.scrollTop(initScrollTop)
            $contentWrap.animate({
                scrollTop: initScrollTop
            }, 2000);
            // ItemLecture_Video_Highlights

            // $contentWrap.scroll(function() {
            //    console.log('$contentWrap.scroll', $contentWrap.offset(), $extSubtitleWrap.offset(), $contentWrap.scrollTop())
            // })
            // console.log("$extSubtitleWrap.offset()", $extSubtitleWrap.offset())
            *******************/

        }

        $(function() { // document ready
            let $subExBtnWrap = $('#ym_subExBtnWrap')
            if(!$subExBtnWrap.length) {
                let $exSubtitleInitBtn = $(`<button class="ym_subExBtn">SubEx</button>`)
                $exSubtitleInitBtn.click(function() {
                    findVideo(0)
                })
                // 2023-11-10 修改把 VidEx 按钮暂时屏蔽
                let $exVideoExActionBtn = $(`<button class="ym_subExBtn">VidEx</button>`)
                $exVideoExActionBtn.click(function() {
                    findVideo(1)
                })
                // $subExBtnWrap = $(`<div id="ym_subExBtnWrap"></div>`).append($exSubtitleInitBtn).append($exVideoExActionBtn)
                $subExBtnWrap = $(`<div id="ym_subExBtnWrap"></div>`).append($exSubtitleInitBtn)
                // 2023-11-10 修改把 VidEx 按钮暂时屏蔽
                $(document.body).append($subExBtnWrap)
            }
        })
    })

})();