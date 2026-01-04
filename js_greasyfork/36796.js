// ==UserScript==
// @name         虾米网页播放器
// @namespace    https://github.com/maijz128
// @version      1.0.1
// @description  给虾米网页播放器添加快捷键：音量（E-上调；D-下调）、下一首（F）、上一首（S）、隐藏/显示播放器（Q）
// @author       MaiJZ
// @match        *://www.xiami.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36796/%E8%99%BE%E7%B1%B3%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/36796/%E8%99%BE%E7%B1%B3%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==



const KEYS = {
    ENTER: 13, SPACE: 32, ESC: 27,
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
    A: 65, D: 68, E: 69, F: 70, R: 82, S: 83, W: 87, Z: 90, Q: 81
};

const G = {
    UpVolume: KEYS.E, DownVolume: KEYS.D, PrevSong: KEYS.S, NextSong: KEYS.F, 
    Pause: KEYS.SPACE, ToggleUI: KEYS.Q, ToggleList: KEYS.R
};

(function () {
    main();
})();

function main() {
    if (matchURL('/radio/play/')) {
        new Radio();
    } else if (matchURL('xiami.com/play')) {
        new OnlinePlayer();
    } else {
        window._NewUI_Player = new NewUI_Player();

        // old index ui
        setTimeout(function () {
            tosign();
        }, 1000);
    }
}

function NewUI_Player(){
    var self = this;
    this.isHide = false;

    this.togglePlayerUI = function(){
        var elBtn = document.querySelector('#player-toggle-button');
        var elPlayer = document.querySelector(".player");

        self.isHide = !self.isHide;

        if(self.isHide){
            elBtn.innerHTML = '>>';
            elPlayer.classList.add('player-hide');
        }else{
            elBtn.innerHTML = '<<';
            elPlayer.classList.remove('player-hide');
        }
    };

    // init
    var timeout = 1000;
    setTimeout(function () {
        onKeyDown();
        addShortcutKeySwitch();
        addToggleButton();
    }, timeout);



    function addToggleButton(){
        var container = document.querySelector(".play-bar");
        if (container) {
            var style='';
            style += '.player-toggle-button { float: right; height: 72px; cursor: pointer; background: #fff; border: 1px solid #ccc;}';
            style += '.player .audio-progress, .player .play-bar { visibility: visible;  opacity: 1; transition: visibility 0.5s, opacity 0.5s linear; } ';
            style += '.player-hide .audio-progress, .player-hide .play-bar { visibility: hidden;  opacity: 0;  } ';
            style += '.player-hide .player-toggle-button { position: absolute; left: 0; bottom: 0;} ';
            style += '.player-hide .common-mode { width: 40px;} '; 
            addStyle(style);

            var elButton = document.createElement("button");
            elButton.setAttribute('id', 'player-toggle-button');
            elButton.classList.add('player-toggle-button');
            elButton.onclick = self.togglePlayerUI;
            elButton.innerHTML = '<<';

            // container.appendChild(elButton);
            $(container).before(elButton);

        }
    }
    
    function addShortcutKeySwitch() {
        var container = document.querySelector(".play-bar");
        if (container) {
            var style='text-align: center; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-align-items: center; -ms-flex-align: center; align-items: center; margin-left: 10px;';
            style = '.player-bar-item {' + style +'}';
            addStyle(style);

            var elCheckbox = document.createElement("div");
            elCheckbox.classList.add('player-bar-item');
            elCheckbox.innerHTML =
                '<input type="checkbox" name="shortchut_key" id="mjz_shortcutkeyswitch" checked="true">快捷键';

            container.appendChild(elCheckbox);
        }
    }

    function isShortcutKey() {
        var elSwitch = document.getElementById("mjz_shortcutkeyswitch");
        if (elSwitch) {
            return elSwitch.checked;
        }
        return true;
    }

    function notPressControlKey(e){
       return !(e.altKey || e.ctrlKey || e.shiftKey);        
    }

    function onKeyDown() {
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && isShortcutKey() && notPressControlKey(e)) {
                handleKeyDown(e.keyCode);
            }
        };
    }

    function handleKeyDown(keyCode) {
        var player_main = document.querySelector(".page-container .player");
        var player_audio = document.querySelector('.page-container .player audio');

        if(!(player_main && player_audio)){
            console.error('not found player');
            return;
        }

        var volume = null;
        switch (keyCode) {
            case G.UpVolume:
                // fireKeyEvent(player_main, "keydown", KEYS.UP);
                volume = player_audio.volume + 0.1;
                if(volume > 1) { volume = 1; }
                player_audio.volume = volume;
                console.log(keyCode + ": UpVolume = " + volume);
                break;

            case G.DownVolume:
                // fireKeyEvent(player_main, "keydown", KEYS.DOWN);
                volume = player_audio.volume - 0.1;
                if(volume < 0) { volume = 0; }
                player_audio.volume = volume;
                console.log(keyCode + ": DownVolume = " + volume);
                break;

            case G.PrevSong:
                console.log(keyCode + ": PrevSong");
                // fireKeyEvent(player_main, "keydown", KEYS.LEFT);
                var btn = document.querySelector('.main-control-wrapper .main-control .prev');
                if(btn){
                    eventFire(btn, 'click');
                }
                break;

            case G.NextSong:
                console.log(keyCode + ": NextSong");
                // fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
                var btn = document.querySelector('.main-control-wrapper .main-control .next');
                if(btn){
                    eventFire(btn, 'click');
                }
                break;

            case G.Pause:
                console.log(keyCode + ": PauseSong");
                // fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
                var btn = document.querySelector('.main-control-wrapper .main-control .play-btn');
                if(btn){
                    eventFire(btn, 'click');
                }
                break;

            case G.ToggleUI:
                console.log(keyCode + ": ToggleUI");
                self.togglePlayerUI();
                break;

            case G.ToggleList:
                console.log(keyCode + ": ToggleList");
                var play_list_control = document.querySelector('.play-list-control');
                if(play_list_control){
                    eventFire(play_list_control, 'click');
                }
                break;
            default:
                break;
        }
    }
}

// 自动签到
function tosign() {
    var b_tosign = $(' div.content  div.action .tosign');
    if (b_tosign) {
        b_tosign.click();
    }
}

function Radio() {

    hide_sidebutton();

    // onKeyDown();

    function canShortcutKey() {
        // const elSwitch = document.getElementById("mjz_shortcutkeyswitch");
        // if (elSwitch) {
        //     return elSwitch.checked;
        // }
        return true;
    }

    function onKeyDown() {
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && canShortcutKey()) {
                handleKeyDown(e.keyCode);
            }
        };
    }

    function handleKeyDown(keyCode) {
        const player_main = document.getElementById("radioPlayer");
        switch (keyCode) {
            case G.UpVolume:
                console.log(keyCode + ": UpVolume");
                fireKeyEvent(player_main, "keydown", KEYS.UP);
                break;

            case G.DownVolume:
                console.log(keyCode + ": DownVolume");
                fireKeyEvent(player_main, "keydown", KEYS.DOWN);
                break;

            case G.PrevSong:
                console.log(keyCode + ": PrevSong");
                fireKeyEvent(player_main, "keydown", KEYS.LEFT);
                break;

            case G.NextSong:
                console.log(keyCode + ": NextSong");
                fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
                break;

            default:
                break;
        }
    }

    function hide_sidebutton(){
        var style = `
        @media only screen and  (max-height: 500px) {
            #sidebutton {
              display: none;
            }
          }
        `;

        addStyle(style);
    }
}

function OnlinePlayer() {
    playerHQ();
    addShortcutKeySwitch();
    onKeyDown();


    function playerHQ() {
        var timeout = 2000;
        setTimeout(function () {
            const elHQ = document.getElementById("J_playerHQ");
            if (elHQ) {
                elHQ.click();
                closeDialog_clt();
            }
        }, timeout);
    }

    // 当点击切换音质时，出现付费提示，自动关闭它
    function closeDialog_clt() {
        var timeout = 500;
        setTimeout(function () {
            const el_dialog_clt = document.getElementById("dialog_clt");
            // 官方方法
            closedialog();
        }, timeout);
    }


    function addShortcutKeySwitch() {
        var timeout = 1000;
        setTimeout(function () {
            const el = document.querySelector(".player-controls");
            if (el) {
                const elCheckbox = document.createElement("lable");
                elCheckbox.innerHTML =
                    '<input type="checkbox" name="shortchut_key" id="mjz_shortcutkeyswitch" checked="true">快捷键';

                el.appendChild(elCheckbox);
            }
        }, timeout);
    }
    function isShortcutKey() {
        const elSwitch = document.getElementById("mjz_shortcutkeyswitch");
        if (elSwitch) {
            return elSwitch.checked;
        }
        return true;
    }

    function onKeyDown() {
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && isShortcutKey()) {
                handleKeyDown(e.keyCode);
            }
        };
    }

    function handleKeyDown(keyCode) {
        const player_main = document.getElementById("player-main");
        switch (keyCode) {
            case G.UpVolume:
                console.log(keyCode + ": UpVolume");
                fireKeyEvent(player_main, "keydown", KEYS.UP);
                break;

            case G.DownVolume:
                console.log(keyCode + ": DownVolume");
                fireKeyEvent(player_main, "keydown", KEYS.DOWN);
                break;

            case G.PrevSong:
                console.log(keyCode + ": PrevSong");
                fireKeyEvent(player_main, "keydown", KEYS.LEFT);
                break;

            case G.NextSong:
                console.log(keyCode + ": NextSong");
                fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
                break;

            default:
                break;
        }
    }


}

// Usage: fireKeyEvent(input元素, 'keydown', 13);  
// http://blog.csdn.net/lovelyelfpop/article/details/52471878
function fireKeyEvent(el, evtType, keyCode) {
    var doc = el.ownerDocument;
    var win = doc.defaultView || doc.parentWindow,
        evtObj;
    if (doc.createEvent) {
        if (win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get : function () { return this.keyCodeVal; }
            });
            Object.defineProperty(evtObj, 'which', {
                get : function () { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    }
    else if (doc.createEventObject) {
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

function eventFire(el, eType){
    if (el.fireEvent) {
      el.fireEvent('on' + eType);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(eType, true, false);
      el.dispatchEvent(evObj);
    }
}

function matchURL(url) {
    const URL = window.location.href; return URL.indexOf(url) > -1;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style"); elStyle.innerHTML = styleContent; document.head.appendChild(elStyle);
}