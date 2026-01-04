// ==UserScript==
// @name                 Youtube 指定片段循環播放
// @name:en              Youtube Repeat Specific Part
// @namespace            -
// @version              20200428.1
// @description          可自由設定影片循環播放，無須轉跳其他網站服務。
// @description:en       Freely set the start and end time to loop. No other sites used.
// @author               LianSheng
// @match                *://*.youtube.com/*
// @require              https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_registerMenuCommand
// @compatible           chrome >= 71
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/377204/Youtube%20%E6%8C%87%E5%AE%9A%E7%89%87%E6%AE%B5%E5%BE%AA%E7%92%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/377204/Youtube%20%E6%8C%87%E5%AE%9A%E7%89%87%E6%AE%B5%E5%BE%AA%E7%92%B0%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

// 內部版本號: 0.7.0

// TODOLIST:
// * 儲存循環 & 清單
// * 清單匯出匯入
// * 微調循環設定時間
// * 循環接軌預覽 (預計前後各 5 秒)

(function() {
    'use strict';
    // ================【全域設定】================ //
    let tm_repeat_button_icon_size     = "18px";  // 設定按鈕圖示大小
    let tm_repeat_button_size          = "24px";  // 設定按鈕長寬（需大於等於圖示大小）

    let tm_repeat_start_bg_color       = "#9920"; // 開始時間按鈕 背景顏色
    let tm_repeat_end_bg_color         = "#9920"; // 結束時間按鈕 背景顏色
    let tm_repeat_set_bg_color         = "#2d20"; // 執行循環按鈕 背景顏色
    let tm_repeat_unset_bg_color       = "#d550"; // 解除循環按鈕 背景顏色

    let tm_repeat_save_bg_color        = "#22e0"; // [TODOLIST] 儲存目前循環 背景顏色

    let tm_repeat_start_color          = "#ffff"; // 開始時間按鈕 顏色
    let tm_repeat_end_color            = "#ffff"; // 結束時間按鈕 顏色
    let tm_repeat_set_color            = "#ffff"; // 執行循環按鈕 顏色
    let tm_repeat_unset_color          = "#ffff"; // 解除循環按鈕 顏色

    let tm_repeat_save_color           = "#ffff"; // [TODOLIST] 儲存目前循環 顏色

    let tm_repeat_time_check_period    = 33;      // 檢查目前時間是否在指定重複範圍內。單位爲毫秒，預設爲 33 毫秒（約一秒檢查 30 次）。
                                                  // 數值越小將能體驗更流暢的銜接，同時也越吃效能。
    // ================【Special】================ //
    let sp_debug_mode_begin = "";
    let sp_debug_mode_end = "";

    // ================【Language】================ //

    const codeTable = {
        "1": "zh-tw",
        "2": "en"
    }

    const LOCALE = {
        "zh-tw": {
            repeat_set_start: "設定循環開始",
            repeat_set_end: "設定循環結束",
            repeat_set: "執行循環",
            repeat_unset: "停止循環",
            more: "更多選項",
            more_copy_share: "複製連結",
            more_copy_share_title: "複製此片段的連結",
            more_copy_share_copied: "連結已複製"
        },
        "en": {
            repeat_set_start: "set repeat start",
            repeat_set_end: "set repeat end",
            repeat_set: "repeat start",
            repeat_unset: "repeat stop",
            more: "more",
            more_copy_share: "copy link",
            more_copy_share_title: "copy link of this part",
            more_copy_share_copied: "copied"
        }
    }

    // ================【程式開始】================ //

    let locale = {};
    if(GM_getValue("lang")){
        let code = GM_getValue("lang");
        let selectLang = codeTable[code];
        locale = LOCALE[selectLang];
    } else {
        chooseLang();
        locale = LOCALE.en;
    }

    
    let debug_mode = false;

    let tm_video_start_time = new URL(location.href).searchParams.get("start");
    let tm_video_end_time = new URL(location.href).searchParams.get("end");

    // 頁面進入點判斷 (TODOLIST)
    let chk_in_watch = 1;

    let css = `
/* 主要區塊 */
#tm_main {
    display: block;
    padding-top: 2px;
}

/* 選取時間區塊 */
#tm_select_time_range {

}

/* 主要按鈕群 */
button.tm_repeat_button {
    cursor: pointer;
    width: ${tm_repeat_button_size} !important;
    height: ${tm_repeat_button_size} !important;
    font-size: ${tm_repeat_button_icon_size};
    border: none;
    outline: none;
    user-select: none;
    opacity: 0.8;
    white-space: nowrap;
}
button.tm_repeat_button:hover {
    opacity: 1;
}
[data-title] {
    font-size: 30px;
    position: relative;
}
:not(.tm_repeat_more_open)[data-title]:hover::before {
    content: attr(data-title);
    position: absolute;
    bottom: 46px;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 2px;
    background: #222;
    color: #fff;
    font-size: 12px;
    font-family: sans-serif;
    white-space: nowrap;
}

/* 更多選項區塊 */
.tm_repeat_more_content {
    position: absolute;
    bottom: 46px;
    display: inline-block;
    border-radius: 2px;
    background-color: #222d;
    color: #fff;
    font-size: 12px;
    font-family: sans-serif;
    white-space: nowrap;
    z-index: 60;
    padding-top: 8px;
    padding-bottom: 8px;
}
.tm_repeat_more_content > div {
    user-select: none;
    height: 32px;
    padding-left: 12px;
    padding-right: 12px;
}
.tm_repeat_more_content > div:hover {
    background-color: #5559;
}

/* 更多按鈕 - 細項（通用） */
[id^="tm_more_"] > span {
    font-size: 14px;
}

/* 更多按鈕 - 複製連結 */
#tm_more_copy_share:hover {
    cursor: pointer;
}
`;

    let html_main = `
<!-- 主要按鈕群 -->
<span id="tm_main" style="user-select: none;">
    <span id="tm_debug_current_time"></span>
    <button class="tm_repeat_button" id="tm_repeat_set_start" onclick="setRepeatStart()" data-title="${locale.repeat_set_start}" style="background-color: ${tm_repeat_start_bg_color}; color: ${tm_repeat_start_color};">
        <i class="fas fa-sign-out-alt"></i>
    </button>
    <button class="tm_repeat_button" id="tm_repeat_set_end" onclick="setRepeatEnd()" data-title="${locale.repeat_set_end}" style="background-color: ${tm_repeat_end_bg_color}; font-size: ${tm_repeat_button_icon_size}; color: ${tm_repeat_end_color};">
        <i class="fas fa-sign-in-alt"></i>
    </button>
    <span id="tm_select_time_range">
        <span>&nbsp;</span>
        <span id="tm_repeat_start_time">0:00:00.0</span>
        <span> ~ </span>
        <span id="tm_repeat_end_time">0:00:00.0</span>
    </span>
    <button class="tm_repeat_button" id="tm_repeat_set" onclick="setRepeat()" data-title="${locale.repeat_set}" style="background-color: ${tm_repeat_set_bg_color}; font-size: ${tm_repeat_button_icon_size}; color: ${tm_repeat_set_color};">
        <i class="fas fa-check"></i>
    </button>
    <button class="tm_repeat_button" id="tm_repeat_unset" onclick="unsetRepeat()" data-title="${locale.repeat_unset}" style="background-color: ${tm_repeat_unset_bg_color}; font-size: ${tm_repeat_button_icon_size}; color: ${tm_repeat_unset_color};">
        <i class="fas fa-times"></i>
    </button>
    <button class="tm_repeat_button" id="tm_repeat_more" onclick="tm_more_click()" data-title="${locale.more}" style="background-color: ${tm_repeat_unset_bg_color}; font-size: ${tm_repeat_button_icon_size}; color: ${tm_repeat_unset_color};">
        <i class="fas fa-bars"></i>
    </button>
    <!-- [TODOLIST] <button class="tm_repeat_button" id="tm_repeat_unset" onclick="saveRepeatDialog()" data-title="儲存循環" style="background-color: ${tm_repeat_save_bg_color}; font-size: ${tm_repeat_button_icon_size}; color: ${tm_repeat_save_color};">
        <i class="fas fa-save"></i>
    </button>-->
</span>

<!-- 更多選項區塊 -->
<div class="tm_repeat_more_content" style="display: none;">
    <div id="tm_more_playlock" hidden>
        <span data-title="打勾後將鎖定播放">播放鎖定</span>
        <input type="checkbox">
    </div>
    <div id="tm_more_copy_share">
        <span data-title="${locale.more_copy_share_title}">${locale.more_copy_share}</span>
    </div>
</div>

<div>
    <input id="tm_for_copy">
</div>
`;

    let html_progressBar = `
<!-- [TODOLIST] 進度條：選取範圍 -->
<!--<div class="tm_repeat_area">
    <div style="background-color: #5f5b !important; left: 200px; transform: scaleX(0.38); z-index: 35;" class="ytp-play-progress"></div>
    <div style="background-color: black !important; left: 0px; transform: scaleX(0.7); z-index: 36; class="ytp-play-progress"></div>
</div>-->
`;

    let js = `
var tm_startTime = 0;
var tm_endTime = 0;
var tm_video = document.querySelector("video");
var tm_interval_id = undefined;
var tm_check_url = location.href;
var tm_for_copy = document.querySelector("#tm_for_copy");

document.querySelector("#tm_more_copy_share").addEventListener("click", copyShare);

// check url per 0.1s
setInterval(function(){
    let now_url = location.href;
    if(now_url != tm_check_url) {
        changePageInit();
        tm_check_url = now_url;
    }
}, 100)

// ${sp_debug_mode_begin} [DEBUG] check url per 0.033s
if(${debug_mode}) {
    setInterval(function(){
        document.querySelector("#tm_debug_current_time").innerHTML = readable(tm_video.currentTime, 3);
    }, 33)
}
// ${sp_debug_mode_end}

// 若網址有 start 與 end 則執行（更多選項：複製連結）
if(${tm_video_start_time} != null && ${tm_video_end_time} != null) {
    setRepeatStart(${tm_video_start_time});
    setRepeatEnd(${tm_video_end_time});
    setRepeat();
}

// 更多選項：複製連結
function copyShare() {
    let tm_video_id = new URL(location.href).searchParams.get("v");
    tm_for_copy.value = "https://www.youtube.com/watch?v=" + tm_video_id + "&start=" + tm_startTime + "&end=" + tm_endTime;
    tm_for_copy.select();
    document.execCommand("copy");

    // 提示：已複製連結
    document.querySelector("#tm_more_copy_share > span").innerText = "${locale.more_copy_share_copied}";
    document.querySelector("#tm_more_copy_share > span").style.color = "#f55";

    // 恢復原始樣貌
    setTimeout(function(){
        document.querySelector("#tm_more_copy_share > span").innerText = "${locale.more_copy_share}";
        document.querySelector("#tm_more_copy_share > span").style.color = "#fff";
    }, 3000);
}

// 設定開始時間
function setRepeatStart(time=""){
    if(time == ""){
        document.querySelector("#tm_repeat_start_time").innerText = readable(tm_video.currentTime);
        tm_startTime = tm_video.currentTime;

        if(tm_startTime > tm_endTime) {
            tm_endTime = tm_startTime;
            document.querySelector("#tm_repeat_end_time").innerText = readable(tm_video.currentTime);
        }
    } else {
        document.querySelector("#tm_repeat_start_time").innerText = readable(time);
        tm_startTime = time;

        if(tm_startTime > tm_endTime) {
            tm_endTime = tm_startTime;
            document.querySelector("#tm_repeat_end_time").innerText = readable(time);
        }
    }
}

// 設定結束時間
function setRepeatEnd(time=""){
    if(time == ""){
        document.querySelector("#tm_repeat_end_time").innerText = readable(tm_video.currentTime);
        tm_endTime = tm_video.currentTime;

        if(tm_endTime < tm_startTime) {
            tm_startTime = tm_endTime;
            document.querySelector("#tm_repeat_start_time").innerText = readable(tm_video.currentTime);
        }
    } else {
        document.querySelector("#tm_repeat_end_time").innerText = readable(time);
        tm_endTime = time;

        if(tm_endTime < tm_startTime) {
            tm_startTime = tm_endTime;
            document.querySelector("#tm_repeat_start_time").innerText = readable(time);
        }
    }
}

// 執行重複播放
function setRepeat(){
    if(tm_interval_id != undefined) clearInterval(tm_interval_id);

    // check video duration per ${tm_repeat_time_check_period} ms
    tm_interval_id = setInterval(function(){
        if(tm_video.currentTime < tm_startTime || tm_video.currentTime > tm_endTime) tm_video.currentTime = tm_startTime;
    }, ${tm_repeat_time_check_period})
}

// 解除重複播放
function unsetRepeat(){
    clearInterval(tm_interval_id);
    tm_interval_id = undefined;
}

// 點擊【更多設定】按鈕
function tm_more_click() {
    let tm_more_button = document.querySelector("#tm_repeat_more");
    let tm_more_content = document.querySelector(".tm_repeat_more_content");

    if (tm_more_content.style.display === "none") {
        tm_more_content.style.display = "inline-block";
        tm_more_content.style.left = tm_more_button.offsetLeft + "px";
    } else {
        tm_more_content.style.display = "none";
    }

    tm_more_button.classList.toggle("tm_repeat_more_open");
}

// 換頁時初始化所有循環設定
function changePageInit(){
    clearInterval(tm_interval_id);
    tm_interval_id = undefined;
    tm_startTime = 0;
    tm_endTime = 0;
    document.querySelector("#tm_repeat_start_time").innerText = readable(tm_startTime);
    document.querySelector("#tm_repeat_end_time").innerText = readable(tm_endTime);
}

// 可視化：預設精度爲 0.1 秒
function readable(floatNum, precision=1){
    let h = parseInt(floatNum / 3600);
    let m = parseInt((floatNum - h*3600) / 60);
    let s = parseFloat(floatNum - h*3600 - m*60).toFixed(precision);

    if(m < 10) m = "0" + m;
    if(s < 10) s = "0" + s;

    return h + ":" + m + ":" + s;
}
`;
    GM_registerMenuCommand("Set Language", chooseLang);

    let inserted = false;

    let insertID = setInterval(function(){
        let url = location.href;

        if(url.match(/youtube\.com\/watch/) != null){
            inserted = true;
            addStyleLink("https://use.fontawesome.com/releases/v5.7.0/css/all.css");
            addStyle(css, ".ytp-chrome-controls");
            addHTML(html_main, ".ytp-chrome-controls");
            addHTML(html_progressBar, ".ytp-progress-list");
            addScript(js, ".ytp-chrome-controls");
        }

        if(inserted) {
            clearInterval(insertID);
        }
    }, 200);

    function chooseLang() {
        let input = 0;

        while(input <= 0 || input >= 3) {
            input = prompt("（變更語言）請輸入語言代號\n(Change Language) Please input language code.\n(中文: 1, English: 2)", "");
        }

        alert("語言已變更。重整頁面後才會生效。\nLanguage changed. Page refresh required.");
        GM_setValue("lang", input);
    }
})();