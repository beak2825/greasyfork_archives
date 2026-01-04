// ==UserScript==
// @name         优酷（youku）快捷操作
// @namespace    hhh2000
// @version      0.1
// @description  滚轮音量调节；鼠标功能键全屏；快捷键：开关弹幕D、网页全屏W、隐藏有边框Q、↑↓键音量调节、←→快进快退改成5s、Ctrl+←→快进快退30s
// @author       hhh2000
// @match        http*://v.youku.com/v_show/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @grant        none
// @compatible   chrome
/* globals jQuery, $, waitForkeyElements */
/* eslint-disable no-multi-spaces, dot-notation */
/* eslint no-eval:0 */
// @downloadURL https://update.greasyfork.org/scripts/457114/%E4%BC%98%E9%85%B7%EF%BC%88youku%EF%BC%89%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/457114/%E4%BC%98%E9%85%B7%EF%BC%88youku%EF%BC%89%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

'use strict';
(function() {
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
    let h5Player

    let log = console.log
    let dir = console.dir
    let err = console.error
    function waitForTrue(ifTrue, callback, time=100) {
        if(--time < 0) {err('waitForTrue 超时 '+ifTrue); return false;}
        const fn = waitForTrue;
        //let fn = arguments.callee;
        if (ifTrue()) {
            callback(); return true;
        } else {
            setTimeout(function() { fn(ifTrue, callback, time); }, 50);
        }
    }
    function geth5Player(){ return $('video')[0] }

    function set_progress(selector, percent, limit_begin, limit_end){

        function calc_bar_offset(percent, bar_length, limit_begin, limit_end){
            let p = Math.max(Math.min(+percent, limit_end), limit_begin);
            let limit = limit_end - limit_begin;
            let bar_offset = (p-limit_begin) * bar_length / limit;
            //console.log(p, limit, bar_offset)
            //return Math.round(bar_offset);  //百分比对应进度条位置
            return bar_offset;  //百分比对应进度条位置
        }

        $('.kui-dashboard-dashboard-panel').css('display','flex')
        $('.kui-volumecontrol-').addClass('kui-s-hover')

        let e = new MouseEvent('click')

        let rect = selector.getBoundingClientRect()
        //console.log(rect)
        //console.log(percent, rect.bottom-rect.top, limit_begin, limit_end)
        let bar_offset = calc_bar_offset(percent, rect.bottom-rect.top, limit_begin, limit_end)
        let clientY = rect.bottom - bar_offset
        //console.log(bar_offset+' - '+clientY)
        e.initMouseEvent('click',1,1,window,1,0,0,0,clientY+0.5,0,0,0,0,0,null)
        selector.dispatchEvent(e)

        $('.kui-volumecontrol-').removeClass('kui-s-hover')
        $('.kui-dashboard-dashboard-panel').css('display','')
    }

    function adjust_progress(selector, inc_percent, range_bengin, range_end){
        const curr_percent = parseInt($('#volume-tip').text())
        //console.log(curr_percent,inc_percent,(curr_percent+parseInt(inc_percent)))
        set_progress(selector, curr_percent+parseInt(inc_percent), 0, 100)
    }

    //显示hint
    function cut_InfoDisappear(){
        if($('.kui-message-information-item').css('animation-name') === 'InfoDisappear'){
            $('.kui-message-information-item').css('animation-name', 'InfoDisappear1')
        }else{
            $('.kui-message-information-item').css('animation-name', 'InfoDisappear')
        }
    }

    function select_rate(diff){
        let rate_text = ['0.5X','1.0X','1.25X','1.5X','2.0X']
        let curr_rate_text = $('.kui-playrate-rate-item[style*=color]').text()
        //console.log(curr_rate_text)
        let rate_index = rate_text.indexOf(curr_rate_text) + diff
        rate_index = Math.min(Math.max(rate_index, 0), rate_text.length-1)
        //console.log(rate_index)
        $(`.kui-playrate-rate-item:contains(${rate_text[rate_index]})`).click()
        $('.kui-message-information-item .kui-message-information-text').text(`${rate_text[rate_index]}`)
        //curr_rate_text = $('.kui-playrate-rate-item[style*=color]').text()
        //console.log(curr_rate_text)
    }

    function setCurrentTime(second){
        h5Player = geth5Player()
        h5Player.currentTime = h5Player.currentTime + second;
    }

    //滚轮音量调节；鼠标功能键全屏；快捷键：开关弹幕D、网页全屏W、隐藏有边框Q、↑↓键音量调节、←→快进快退改成5s、Ctrl+←→快进快退30s
    function run(){
        log('youku快捷操作加载完毕')
        h5Player = geth5Player()
        let keystrokes = 0

        //非全屏滚轮音量调节
        $('#player').off('mousewheel.hhh_youku').on('mousewheel.hhh_youku',function(e){
            let delta = e.originalEvent.wheelDelta
            if(delta >= 120){  //up
                adjust_progress($('#kui_dashboard_volume-control_volumeSlider')[0], 1, 0, 100)
            }else{
                adjust_progress($('#kui_dashboard_volume-control_volumeSlider')[0], -1, 0, 100)
            }
            return false
        })

        //功能键全屏
        $('#player').off('mousedown.hhh_youku').on('mousedown.hhh_youku',function(e){
            if(e.buttons > 2){
                $('.kui-webfullscreen-icon-0').click()
                return false
            }
        })

        //======快捷键======
        $('body').off('keyup.hhh_youku').on('keyup.hhh_youku',function(e){
            if(e.ctrlKey && (e.keyCode === keycode['left'] || e.keyCode === keycode['right'])){  //←→ +/-30s
                return false
            }

            if(e.keyCode === keycode['left'] || e.keyCode === keycode['right']){  //←→ +/-5s
                //log('keystrokes: ',keystrokes)
                if(e.keyCode === keycode['right'] && keystrokes > 1){
                    keystrokes = 0
                    return
                }
                keystrokes = 0
                let secode = e.keyCode === keycode['left'] ? 5 : -10
                setCurrentTime(secode)
                h5Player.play()
                //h5Player.playbackRate = 1
                //return false
            }
        })

        $('body').off('keydown.hhh_youku').on('keydown.hhh_youku',function(e){
            //---功能键---
            if(e.ctrlKey && (e.keyCode === keycode['up'] || e.keyCode === keycode['down'])){  //Ctrl+↑↓ 视频速度
                if(e.keyCode === keycode['up']){
                    select_rate(1)
                }else{
                    select_rate(-1)
                }
                return false
            }else if(e.ctrlKey && (e.keyCode === keycode['left'] || e.keyCode === keycode['right'])){  //Ctrl+←→ +/-30s
                let secode = e.keyCode === keycode['left'] ? -30 : 30
                setCurrentTime(secode)
                h5Player.play();
                return false
            }

            if(e.ctrlKey || e.shiftKey || e.altKey) return;

            //---非功能键---
            if(e.keyCode === keycode['up'] || e.keyCode === keycode['down']){  //↑↓音量
                if(e.keyCode === keycode['up']){
                    adjust_progress($('#kui_dashboard_volume-control_volumeSlider')[0], 5, 0, 100)
                }else{
                    adjust_progress($('#kui_dashboard_volume-control_volumeSlider')[0], -5, 0, 100)
                }
                //$('.kui-message-information-text font').text($('#volume-tip').text())  //set hint text
                //cut_InfoDisappear()
                return false
            }else if(e.keyCode === keycode['NumPad_Decimal'] || e.keyCode === keycode['NumPad0']){  //NumPad_Decimal numpad1音量
                if(e.keyCode === keycode['NumPad_Decimal']){
                    adjust_progress($('.kui-volumecontrol-volume-dashboard')[0], -1, 0, 100)
                }else{
                    adjust_progress($('.kui-volumecontrol-volume-dashboard')[0], 1, 0, 100)
                }
                return false
            }else if(e.keyCode === keycode['right']){  //
                ++keystrokes
                //if(keystrokes === 1) return false
            }else if(e.keyCode === 'W'.charCodeAt()){  //W 网页全屏
                $('.kui-webfullscreen-icon-0').click()
            }else if(e.keyCode === 'Q'.charCodeAt()){  //W 宽屏
                $('.iconzhankaijiantou-shang, .iconzhankaijiantou-xia').click()
            }else if(e.keyCode === 'D'.charCodeAt()){  //D 开关弹幕
                $('.switch-img_12hDa:first').click()
            }
        })
    }

    waitForTrue(()=>$('#kui_dashboard_volume-control_volumeSlider').length>0, ()=>{
        run()
    })

})();