// ==UserScript==
// @name         斗鱼（douyu）快捷操作__
// @namespace    hhh2000
// @version      0.4.4
// @description  滚轮音量调节；鼠标功能键全屏；快捷键：开关弹幕D、网页全屏W、隐藏有边框Q、↑↓键音量调节等
// @author       hhh2000
// @match        http*://www.douyu.com/*dyshid*
// @match        http*://www.douyu.com/*topic*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @grant        none
// @compatible   chrome
/* globals jQuery, $, waitForkeyElements */
/* eslint-disable no-multi-spaces, dot-notation */
/* eslint no-eval:0 */
// @downloadURL https://update.greasyfork.org/scripts/457115/%E6%96%97%E9%B1%BC%EF%BC%88douyu%EF%BC%89%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C__.user.js
// @updateURL https://update.greasyfork.org/scripts/457115/%E6%96%97%E9%B1%BC%EF%BC%88douyu%EF%BC%89%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C__.meta.js
// ==/UserScript==

'use strict';
(function() {
    let log = console.log
    let err = console.error

    // log = ()=>{}

    log(location.href)

    // const key = 'hasRunOnce_' + location.hostname
    // if (!GM_getValue(key, false)) {
    //     GM_setValue(key, true)
    //     // ✅ 这里写你只想运行一次的逻辑
    //     console.log('✅ 脚本第一次运行')
    // } else {
    //     console.log('⏭️ 脚本已运行过，跳过')
    //     return
    // }


    function getkeyCode(k) {
        var keyCodes = {
            300: '滚↑轮',
            301: '滚↓轮',
            302: '鼠标左键',
            303: '鼠标右键',
            304: '鼠标中键',
            305: '鼠标左前侧键',
            306: '鼠标左后侧键',
            307: '鼠标右前侧键',
            308: '鼠标右后侧键',
            309: '鼠标中前侧键',
            310: '鼠标中后侧键',

            0: "",
            3: "break",
            8: "Backspace",
            9: "Tab",
            12: "Clear",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            19: "PauseBreak",
            20: "CapsLock",
            27: "Escape",
            32: "Space",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "←",   //LeftArrow ↑ ↓ ← →
            38: "↑",   //UpArrow
            39: "→",   //RightArrow
            40: "↓",   //DownArrow
            45: "Insert",
            46: "Delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            93: "ContextMenu",
            96: "NumPad0",
            97: "NumPad1",
            98: "NumPad2",
            99: "NumPad3",
            100: "NumPad4",
            101: "NumPad5",
            102: "NumPad6",
            103: "NumPad7",
            104: "NumPad8",
            105: "NumPad9",
            106: "NumPad_Multiply",
            107: "NumPad_Add",
            108: "NumPad_Separator",
            109: "NumPad_Subtract",
            110: "NumPad_Decimal",
            111: "NumPad_Divide",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            124: "F13",
            125: "F14",
            126: "F15",
            127: "F16",
            128: "F17",
            129: "F18",
            130: "F19",
            144: "NumLock",
            145: "ScrollLock",
            166: "BrowserBack",
            167: "BrowserForward",
            170: "BrowserSearch",
            172: "BrowserHome",
            173: "AudioVolumeMute",
            174: "AudioVolumeDown",
            175: "AudioVolumeUp",
            176: "MediaTrackNext",
            177: "MediaTrackPrevious",
            178: "MediaStop",
            179: "MediaPlayPause",
            180: "LaunchMail",
            181: "LaunchMediaPlayer",
            183: "LaunchApp2",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            193: "ABNT_C1",
            194: "ABNT_C2",
            219: "[",
            220: "\\",
            221: "]",
            222: "'",
            223: "OEM_8",
            226: "OEM_102",
            229: "KeyInComposition",
        };
        return keyCodes[k];
    }
    let keycode = {
        'Enter': 13,
        'Ctrl': 17,
        'Esc': 27,
        'left': 37,
        'right': 39,
        'up': 38,
        'down': 40,
        'space': 32,
        'NumPad0': 96,
        'NumPad_Decimal': 110,
    }

    function set_progress(selector, curr_percent, inc_percent, limit_begin, limit_end){

        function calc_bar_offset(percent, bar_length, limit_begin, limit_end){
            let p = Math.max(Math.min(+percent, limit_end), limit_begin);
            let limit = limit_end - limit_begin;
            let bar_offset = (p-limit_begin) * bar_length / limit;
            //log(p, limit, bar_length, 128/100*p, bar_offset)
            return bar_offset;  //百分比对应进度条位置
        }

       // $('.controlbar-f41e38').removeClass('hide-6cf943')

        let e1 = new MouseEvent('mousedown'), e2 = new MouseEvent('mouseup')
        // log(selector)
        let rect = selector.getBoundingClientRect()

        let padding_top = +$(selector).css('padding-top').match(/\d+/)?.[0]
        let padding_bottom = +$(selector).css('padding-bottom').match(/\d+/)?.[0]
        let bar_offset = calc_bar_offset(curr_percent-inc_percent, (rect.height-padding_top-padding_bottom), limit_begin, limit_end)
        let clientY = rect.bottom - padding_bottom - bar_offset + 1

        let o1 = calc_bar_offset(curr_percent, (rect.height-padding_top-padding_bottom), limit_begin, limit_end)
        let o2 = calc_bar_offset(curr_percent+inc_percent, (rect.height-padding_top-padding_bottom), limit_begin, limit_end)
        let o3 = calc_bar_offset(curr_percent-inc_percent, (rect.height-padding_top-padding_bottom), limit_begin, limit_end)
        // log(`当前音量：${curr_percent}   加音量${curr_percent+inc_percent}   减音量${curr_percent-inc_percent}`)
        // log(`当前距离：${o1}   加距离${o2}   减距离${o3}`)

        let percent = Math.max(Math.min(curr_percent - inc_percent, limit_end), limit_begin)
        let step = (rect.height-padding_top-padding_bottom)/(limit_end - limit_begin)/2
        // 动态调整
        for(let i=0; i<Math.abs(inc_percent*10); ++i){
            //log(`------音量：${i}------`)
            //log(`原音量：${curr_percent}/${parseInt($('.tips-3df825').text().match(/\d+/))}`)
            e1.initMouseEvent('mousedown',1,1,window,1,0,0,0,clientY,0,0,0,0,0,null);
            e2.initMouseEvent('mouseup'  ,1,1,window,1,0,0,0,clientY,0,0,0,0,0,null);
            selector.dispatchEvent(e1); selector.dispatchEvent(e2);

            let next_percent = parseInt($('.tips-3df825').text().match(/\d+/))
            //log(`新音量：${percent}/${next_percent}/${$('.tips-3df825').text().match(/\d+/)}`)

            //log(`原音量：${percent} 新音量：${next_percent} 增减音量：${inc_percent} clientY: ${clientY} step: ${step}`)
            if(percent == next_percent) break
            else if(inc_percent > 0 && percent < next_percent) clientY += step
            else if(inc_percent < 0 && percent > next_percent) clientY -= step
            else break

        }
    }

    function adjust_progress(selector_str, inc_percent, range_bengin, range_end){
        //new
        // let container   = document.querySelector('.player__jsy1T');
        // container.classList.add('in__HeN9a', 'player-is-hover'); // 方便加样式
        // let volumeBar   = document.querySelector('.VolumeBar-164ea4');
        // volumeBar.classList.add('active-a5d033'); // 方便加样式

        // log(window.location.href)
        if(window.location.href.includes('www.douyu.com/beta/') === true){
            // log('===new===');
            function set_percent(percent) {
                percent = Math.max(0, Math.min(100, percent))
                // log(2,percent)
                let back = $('.volume-07c230 .back-85f312')[0]
                let rect = back.getBoundingClientRect()
                let clientY = rect.bottom - percent
                const e1 = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    detail: 0,
                    screenX: 0,
                    screenY: 0,
                    clientX: 0,
                    clientY: clientY,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: null
                })
                const e2 = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    detail: 0,
                    screenX: 0,
                    screenY: 0,
                    clientX: 0,
                    clientY: clientY,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: null
                })
                back?.dispatchEvent(e1); back?.dispatchEvent(e2);
            }

            const $box  = $('.volume-07c230');
            const $front = $box?.find('.front-99e2aa');
            const $point = $box?.find('.point-6ef744');
            const $label = $box?.find('.tips2-9bb064');
            const $tip   = $box?.find('.tips-d0d0f1');
            if ($front.length <= 0) return;

            let volumeBar = document.querySelector('.VolumeBar-164ea4');
            let e1 = new MouseEvent('mouseover'), e2 = new MouseEvent('mouseout')
            e1.initMouseEvent('mouseover',1,1,window,1,0,0,0,0,0,0,0,0,0,null)
            volumeBar?.dispatchEvent(e1)

            const curr_percent = parseInt($tip.text().match(/\d+/))  //tips-d0d0f1 - tips2-9bb064
            // log('1:',curr_percent, parseInt(inc_percent))
            // set_percent(parseInt(curr_percent) - parseInt(inc_percent))
            set_percent(curr_percent - parseInt(inc_percent))

//             $tip.css({ visibility: 'visible', opacity: 1 })

//             let t = $box.data('hhh_timeout')
//             clearTimeout(t)
//             t = setTimeout(()=>{
//                 $tip.css({ visibility: 'hidden', opacity: 0 })
//                 e2.initMouseEvent('mouseout',1,1,window,1,0,0,0,0,0,0,0,0,0,null)
//                 volumeBar?.dispatchEvent(e2)
//             }, 1000)
//             $box.data('hhh_timeout', t)

            // let timer

            // $tip[0].style.visibility = 'visible';
            // $tip[0].style.opacity = '1';
            // clearTimeout(timer);
            // timer = setTimeout(() => {
            //     $tip[0].style.transition = 'opacity .3s';
            //     $tip[0].style.opacity = '0';
            //     setTimeout(() => $tip[0].style.visibility = 'hidden', 300);
            //     volumeBar.classList.remove('active-a5d033')
            // }, 1000)

//             const MAX = range_end - range_bengin           // 滑条最大 px 高度
//             let vol = 20

//             /* 更新 UI 并显示提示 */
//             const setVol = v => {

//                 let vol = Math.max(0, Math.min(100, v));
//                 const h = (vol / 100) * MAX;
//                 front.style.height = `${h}px`;
//                 point.style.bottom = `${h + 7}px`;
//                 label.textContent = `音量${vol}%`;
//                 //
//                 let rect = point.getBoundingClientRect()
//                 let clientY = rect.bottom
//                 const e1 = new MouseEvent('mousedown', {
//                     bubbles: true,
//                     cancelable: true,
//                     view: window,
//                     detail: 0,
//                     screenX: 0,
//                     screenY: 0,
//                     clientX: 0,
//                     clientY: clientY,
//                     ctrlKey: false,
//                     altKey: false,
//                     shiftKey: false,
//                     metaKey: false,
//                     button: 0,
//                     relatedTarget: null
//                 })
//                 const e2 = new MouseEvent('mouseup', {
//                     bubbles: true,
//                     cancelable: true,
//                     view: window,
//                     detail: 0,
//                     screenX: 0,
//                     screenY: 0,
//                     clientX: 0,
//                     clientY: clientY,
//                     ctrlKey: false,
//                     altKey: false,
//                     shiftKey: false,
//                     metaKey: false,
//                     button: 0,
//                     relatedTarget: null
//                 })
//                 // let e1 = new MouseEvent('mousedown'), e2 = new MouseEvent('mouseup')
//                 // e1.initMouseEvent('mousedown',1,1,0,window,0,0,0,clientY,0,0,0,0,0,null);
//                 // e2.initMouseEvent('mouseup'  ,1,1,0,window,0,0,0,clientY,0,0,0,0,0,null);
//                 point?.dispatchEvent(e1); point?.dispatchEvent(e2);
//                 log('2',v, vol, parseInt($('.tips-d0d0f1').text().match(/\d+/)), clientY)

//                 $tip[0].style.visibility = 'visible';
//                 $tip[0].style.opacity = '1';
//                 clearTimeout(timer);
//                 timer = setTimeout(() => {
//                     tip.style.transition = 'opacity .3s';
//                     tip.style.opacity = '0';
//                     setTimeout(() => tip.style.visibility = 'hidden', 300);
//                     volumeBar.classList.remove('active-a5d033')
//                 }, 1000)
//             }

//             const curr_percent = parseInt($('.tips-d0d0f1').text().match(/\d+/))  //tips-d0d0f1 - tips2-9bb064
//             log(inc_percent, curr_percent)
//             setVol(curr_percent - (inc_percent < 0 ? -5 : 5))

            /* 绑定滚轮 */
            // document.querySelector('#__h5player').addEventListener('wheel', e => {
            //     e.preventDefault();
            //     // setVol(vol + (e.deltaY < 0 ? 5 : -5));
            //     log(e, inc_percent)
            //     setVol(vol + (e.deltaY < 0 ? 1 : -1));
            // });
        }else{  //old
            let e1 = new MouseEvent('mouseover'), e2 = new MouseEvent('mouseout')
            e1.initMouseEvent('mouseover',1,1,window,1,0,0,0,0,0,0,0,0,0,null)
            $('.volume-8e2726')?.[0]?.dispatchEvent(e1)
            $('.volume-silent-3eb726')?.[0]?.dispatchEvent(e1)
            //$('.VolumeBar-9010af').css('visibility', 'hidden')

            let selector = $(selector_str)[0] //VolumeBar-164ea4
            const curr_percent = parseInt($('.tips-3df825').text().match(/\d+/))  //tips-d0d0f1

            set_progress(selector, curr_percent, parseInt(inc_percent), 0, 100)
            $('.tips-3df825').css({'visibility': 'visible'})

            // $('.VolumeBar-9010af').css('visibility', 'visible')
            let t = $('.volume-bar-06542d').data('hhh_timeout')
            clearTimeout(t)
            t = setTimeout(()=>{
                e2.initMouseEvent('mouseout',1,1,window,1,0,0,0,0,0,0,0,0,0,null)
                $('.volume-8e2726')?.[0]?.dispatchEvent(e2)
                $('.volume-silent-3eb726')?.[0]?.dispatchEvent(e2)
            }, 1000)
            $('.volume-bar-06542d').data('hhh_timeout', t)
        }
    }

    //显示hint XXX
    function cut_InfoDisappear(){
        if($('.kui-message-information-item').css('animation-name') === 'InfoDisappear'){
            $('.kui-message-information-item').css('animation-name', 'InfoDisappear1')
        }else{
            $('.kui-message-information-item').css('animation-name', 'InfoDisappear')
        }
    }


    function waitForTrue(ifTrue, callback, time=100) {
        // log($('#player-control-video').length)
        // log(document.querySelectorAll('#__h5player').length)
        //log(ifTrue())
        if(--time < 0) {err('waitForTrue 超时 '+ifTrue); return false;}
        const fn = waitForTrue;
        //let fn = arguments.callee;
        if (ifTrue()) {
            callback(); return true;
        } else {
            setTimeout(function() { fn(ifTrue, callback, time); }, 50);
        }
    }

    //滚轮音量调节；鼠标功能键全屏；快捷键：开关弹幕D、网页全屏W、隐藏有边框Q、↑↓键音量调节
    function run(){


        log('douyu快捷操作加载完毕')

        $('.ActBase').hide()

        //非全屏滚轮音量调节
        $('#__h5player').off('wheel.hhh_douyu').on('wheel.hhh_douyu',function(e){
            let delta = e.originalEvent.wheelDelta
            // log(delta, e)
            if(delta >= 0){  //up
                adjust_progress('.volume-bar-06542d', -1, 0, 100)  //volume-bar-06542d
            }else{
                adjust_progress('.volume-bar-06542d',  1, 0, 100)
            }
            e.preventDefault();
            return false
        })

        //功能键全屏
        $('#__h5player').off('mousedown.hhh_douyu').on('mousedown.hhh_douyu',function(e){
            if(e.buttons > 2){
                $('.wfs-2a8e83, .wfs-exit-180268').not('.removed-9d4c42').click()
                return false
            }
        })

        //快捷键
        $('body').off('keydown.hhh_douyu').on('keydown.hhh_douyu',function(e){
            // log(e.keyCode, e)
            if(e.keyCode === keycode['up'] || e.keyCode === keycode['down']){  //↑↓音量
                if(e.keyCode === keycode['up']){
                    adjust_progress('.volume-bar-06542d', -5, 0, 100)
                }else{
                    adjust_progress('.volume-bar-06542d',  5, 0, 100)
                }
                //$('.kui-message-information-text font').text($('#volume-tip').text())  //set hint text
                //cut_InfoDisappear()
                return false
            }else if(e.keyCode === keycode['NumPad_Decimal'] || e.keyCode === keycode['NumPad0']){  //NumPad_Decimal numpad1 音量
                // log(e.target.className, e.target.nodeName, $(e.target).attr('type'))
                // log(e.originalEvent.path[0].nodeName)
                // log($(e.originalEvent.path[0]).attr('type'))
                let classnames = /editor/
                let nodenames = ['INPUT', 'TEXTAREA']
                let target_classnames = e.target.className
                let target_nodename = e.target.nodeName
                if(nodenames.includes(target_nodename) === false && target_classnames.match(classnames) === null){  //排除发送弹幕等情况
                    if(e.keyCode === keycode['NumPad_Decimal']){
                        adjust_progress('.volume-bar-06542d', -1, 0, 100)
                    }else{
                        adjust_progress('.volume-bar-06542d',  1, 0, 100)
                    }
                    return false
                }
            }else if(e.keyCode === 'W'.charCodeAt()){  //W 网页全屏
                $('.wfs-2a8e83, .wfs-exit-180268').not('.removed-9d4c42').click()
            }else if(e.keyCode === 'F'.charCodeAt()){  //W 全屏
                $('.fs-781153, .fs-exit-b6e6a7').not('.removed-9d4c42').click()
            }else if(e.keyCode === 'Q'.charCodeAt()){  //W 隐藏右边框
                $('.layout-Player-asidetoggleButton').click()
            }else if(e.keyCode === 'D'.charCodeAt()){  //D 开关弹幕
                $('.showdanmu-42b0ac, .hidedanmu-5d54e2').not('.removed-9d4c42').click()
                $('.showdanmuWrap-9c22cd>.icon-c8be96').click()
            }
        })
    }

    waitForTrue(()=>$('#player-control-video').length>0, ()=>{
        run()
    })

})();