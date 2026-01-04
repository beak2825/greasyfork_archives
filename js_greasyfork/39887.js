// ==UserScript==
// @name         lab.mkblog.cn：音乐播放器-快捷键
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  快捷键：音量（E-上调；D-下调）、下一首（F）、上一首（S）、播放|暂停（Space）。
// @author       MaiJZ
// @match        *://lab.mkblog.cn/music/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39887/labmkblogcn%EF%BC%9A%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8-%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/39887/labmkblogcn%EF%BC%9A%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8-%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==



const MAI_KEYS = {
    ENTER: 13, SPACE: 32, ESC: 27,
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
    A: 65, D: 68, E: 69, F: 70, S: 83, W: 87, Z: 90
};

const MAI_G = {
    UpVolume: MAI_KEYS.E,
    DownVolume: MAI_KEYS.D,
    PrevSong: MAI_KEYS.S,
    NextSong: MAI_KEYS.F,
    TogglePlay: MAI_KEYS.SPACE
};

(function () {
    main();
})();

function main() {
    Shortcuts();
}

function Shortcuts() {

    function nextSong() {
        nextMusic();
    }
    function prevSong() {
        prevMusic();
    }
    function isPlay() {
        return rem.paused === false;
    }
    function togglePlay() {
        pause();
    }
    function currentVolume() {
        return playerReaddata('volume');
    }
    function upVolume() {
        setVolume(currentVolume() + 0.1);
    }
    function downVolume() {
        setVolume(currentVolume() - 0.1);
    }
    function setVolume(newVolume){
        if(newVolume < 0) newVolume = 0;    // 范围限定
        if(newVolume > 1) newVolume = 1;

        vBcallback(newVolume);
        volume_bar.goto(newVolume);
    }

    function isShortcutKey() {
        // const elSwitch = document.getElementById("mjz_shortcutkeyswitch");
        // if (elSwitch) {
        //     return elSwitch.checked;
        // }
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
        switch (keyCode) {
            case MAI_G.UpVolume:
                console.log(keyCode + ": UpVolume");
                upVolume();
                break;

            case MAI_G.DownVolume:
                console.log(keyCode + ": DownVolume");
                downVolume();
                break;

            case MAI_G.PrevSong:
                console.log(keyCode + ": PrevSong");
                prevSong();
                break;

            case MAI_G.NextSong:
                console.log(keyCode + ": NextSong");
                nextSong();
                break;

            case MAI_G.TogglePlay:
                console.log(keyCode + ": TogglePlay");
                togglePlay();
                break;

            default:
                break;
        }
    }

    onKeyDown();

}

/*
function OnlinePlayer() {

    addShortcutKeySwitch();



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



}
*/


function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}