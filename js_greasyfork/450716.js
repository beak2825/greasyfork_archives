// ==UserScript==
// @name                    Sonarr-Title-i18n
// @name:zh                 Sonarr 标题国际化
// @description             利用 TMDB 接口把 Sonarr 中的标题替换成其他语言标题
// @namespace               https://github.com/LuckyPuppy514
// @version                 1.0.5
// @homepage                https://github.com/LuckyPuppy514/Sonarr-Title-i18n
// @author                  LuckyPuppy514
// @copyright               2022, Grant LuckyPuppy514 (https://github.com/LuckyPuppy514)
// @license                 MIT
// @icon                    https://cdn.lckp.top/gh/selfhst/icons/png/sonarr.png
// @include                 *://*sonarr*
// @include                 *://*:8989/*
// @run-at                  document-end
// @require                 https://unpkg.com/jquery@3.2.1/dist/jquery.min.js
// @grant                   GM_setValue
// @grant                   GM_getValue
// @grant                   GM_deleteValue
// @grant                   GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/450716/Sonarr-Title-i18n.user.js
// @updateURL https://update.greasyfork.org/scripts/450716/Sonarr-Title-i18n.meta.js
// ==/UserScript==

'use strict';

// 默认语言代码
const DEFAULT_LANGUAGE_CODE = "zh-CN";
// GM_setValue key
const KEY_TMDB_API_KEY = "KEY_TMDB_API_KEY";
const KEY_LANGUAGE_CODE = "KEY_LANGUAGE_CODE";
const KEY_ERROR_MESSAGE = "KEY_ERROR_MESSAGE";
const KEY_TITLE_PREFIX = "TITLE_";
const KEY_TVDBID_PREFIX = "TVDBID_";
const KEY_OVERVIEW_PREFIX = "OVERVIEW_";
// className
const RIGHT_HEADERF_CLASS_NAME = "PageHeader-right-e8LU4";
const POSTER_TITLE_CLASS_NAME = "SeriesIndexPoster-title-rhAQh";
const OVERVIEW_TITLE_CLASS_NAME = "SeriesIndexOverview-title-LQthD SeriesIndexOverview-link-ltHLM Link-link-RInnp Link-link-RInnp Link-to-kylTi";
const DETAILS_TITLE_CLASS_NAME = "SeriesDetails-title-pJv1g";
const CALENDAR_TITLE_CLASS_NAME = "CalendarEvent-seriesTitle-QSWzp";
const CALENDAR_TITLE_AGENDA_CLASS_NAME = "AgendaEvent-seriesTitle-uBPt0";
const DETAILS_OVERVIEW_CLASS_NAME = "SeriesDetails-overview-cQJdA";
const SERIES_TITLE_CLASS_NAME = "Link-link-RInnp Link-to-kylTi";
// url path
const DETAILS_TITLE_PATH = "/series/";
const CALENDAR_TITLE_PATH = "/calendar";
const SERIES_TITLE_PATH = "/serieseditor, /seasonpass, /queue, /history, /blocklist, /missing, /cutoffunmet";
// element id
const i18n_BUTTON_ID = "i18n-button";
const SETTING_HIDDEN_DIV_ID = "setting-hidden-div";
const SETTING_SHOW_DIV_ID = "setting-show-div";
const CLOSE_BUTTON_ID = "close-button";
const SAVE_BUTTON_ID = "save-button";
const CLEAR_CACHE_BUTTON_ID = "clear-cache-button";
const TMDB_API_KEY_INPUT_ID = "tmdb-api-key";
const LANGUAGE_CODE_INPUT_ID = "language-code";
const ERROR_MESSAGE_TEXTAREA_ID = "error-message";
// css
const CSS = `
#i18n-button {
	width: 25px;
	height: 25px;
	margin-top: 17px;
	margin-left: -15px;
	margin-right: 17px;
	border: 0px;
	border-radius: 50%;
	background: rgba(255,255,255, 0);
	background-repeat: no-repeat;
	cursor: pointer;
	z-index: 999
}
#i18n-button-svg {
	width: 23px;
	height: 23px;
}

#setting-div {
	display: flex;
	justify-content: center;
}
#setting-hidden-div {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #000000;
	opacity: 0.3;
	display: none;
}
#setting-show-div {
	width: 500px;
	height: 260px;
	background-color: rgba(64, 68, 84, 0.9);
	display: none;
	flex-direction: column;
	border-radius: 5px;
	align-items: center;
	padding-top: 40px;
	box-sizing: border-box;
	position: absolute;
	top: 200px;
}
#close-button {
	position: absolute;
	top: 7px;
	right: 7px;
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background-size: cover;
	background-image: url(https://cdn.jsdelivr.net/gh/LuckyPuppy514/pic-bed/common/icons8-close-48.png);
	background-repeat: no-repeat;
	background-color: rgba(91, 137, 254, 0);
	color: rgba(255, 255, 255, 0);
	font-weight: normal;
}
#close-button:hover {
	background-color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
}
#setting-show-div input {
	width: 280px;
	height: 25px;
	border-radius: 5px;
	border: none;
	outline: none;
	padding-left: 5px;
	background-color: rgba(0, 0, 0, 1);
	color: rgba(255, 255, 255, 1);
}
#setting-show-div input::-webkit-input-placeholder {
	color: rgb(255, 255, 255);
	opacity: 0.4;
}
#setting-show-div input:first-child {
    margin-top: 5px;
	margin-bottom: 5px;
}
#save-button {
	cursor: pointer;
	width: 300px;
	height: 30px;
	border-radius: 5px;
	border: none;
	outline: none;
	margin-left: 5px;
	padding-left: 5px;
	background-color: rgba(0, 255, 0, 0.8);
	color: rgba(255, 255, 255, 1);
}
#clear-cache-button:hover {
	background-color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
}
#clear-cache-button {
	position: absolute;
	bottom: 8px;
	right: 8px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-size: cover;
	background-image: url(https://cdn.jsdelivr.net/gh/LuckyPuppy514/pic-bed/common/icons8-broom-64.png);
	background-repeat: no-repeat;
	background-color: rgba(91, 137, 254, 0);
	color: rgba(255, 255, 255, 0);
	font-weight: normal;
}
strong:hover:after {
	position: absolute;
	left: 30px;
	top: -25px;
	padding: 0px;
	border: 1px solid rgb(255, 255, 255);
	background-color: rgba(0,0,0,0.8);
	border-radius: 3px;
	color: rgba(255, 255, 255, 1);
	content: attr(data-tips);
	text-align: center;
	z-index: 2;
	width: 90px;
	height: 30px;
}
#error-message {
	width: 280px;
	height: 50px;
	border-radius: 5px;
	border: none;
	outline: none;
	padding-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
	background-color: rgba(0, 0, 0, 1);
	color: rgba(255, 255, 255, 1);
}
#setting-table {
	width: 420px;
    height: 100px;
    border: none;
}
`
// html
const i18n_BUTTON = `
<svg id="i18n-button-svg" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#CFD8DC" d="M15,13h25c1.104,0,2,0.896,2,2v25c0,1.104-0.896,2-2,2H26L15,13z"/><path fill="#546E7A" d="M26.832,34.854l-0.916-1.776l0.889-0.459c0.061-0.031,6.101-3.208,9.043-9.104l0.446-0.895l1.79,0.893l-0.447,0.895c-3.241,6.496-9.645,9.85-9.916,9.989L26.832,34.854z"/><path fill="#546E7A" d="M38.019 34l-.87-.49c-.207-.116-5.092-2.901-8.496-7.667l1.627-1.162c3.139 4.394 7.805 7.061 7.851 7.087L39 32.26 38.019 34zM26 22H40V24H26z"/><path fill="#546E7A" d="M32 20H34V24H32z"/><path fill="#2196F3" d="M33,35H8c-1.104,0-2-0.896-2-2V8c0-1.104,0.896-2,2-2h14L33,35z"/><path fill="#3F51B5" d="M26 42L23 35 33 35z"/><path fill="#FFF" d="M19.172,24h-4.36l-1.008,3H11l4.764-13h2.444L23,27h-2.805L19.172,24z M15.444,22h3.101l-1.559-4.714L15.444,22z"/></svg>
`
const SETTING_DIV = `
<div id="setting-div">
	<div id="setting-hidden-div"></div>
	<div id="setting-show-div">
        <strong id="close-button" data-tips="Close"></strong>
        <table id="setting-table">
            <tr>
                <td>🔑 TMDB API Key</td>
                <td><input type="text" id="tmdb-api-key" placeholder="Please input TMDB API Key"></td>
            </tr>
            <tr>
                <td>✨ Language Code</td>
                <td><input type="text" id="language-code" placeholder="Please input Language Code"></td>
            </tr>
            <tr>
                <td>😰 Error Message</td>
                <td><textarea type="text" id="error-message" readonly></textarea></td>
            </tr>
        </table>
        <button type="button" id="save-button">Save</button>
        <a href="https://www.themoviedb.org/settings/api" target="_blank" style="text-decoration: none; color: rgba(0, 255, 0, 0.8); margin-top: 10px">🔑 Get TMDB API Key 🔑<a>
        <strong id="clear-cache-button" data-tips="Clear Cache"></strong>
	</div>
</div>
`

// 添加按钮和设置组件
function addi18nButtonAndSettingDiv() {
    // 添加 CSS
    var css = document.createElement("style");
    css.innerHTML = CSS.trim();
    document.head.appendChild(css);

    // 添加 i18n 按钮
    var i18nButton = document.createElement("button");
    i18nButton.id = i18n_BUTTON_ID;
    i18nButton.innerHTML = i18n_BUTTON.trim();
    // 延时等待右导航栏加载
    setTimeout(function () {
        let rightHeader = document.getElementsByClassName(RIGHT_HEADERF_CLASS_NAME)[0];
        if (rightHeader) {
            rightHeader.appendChild(i18nButton);
        }
    }, 1000);

    // 添加设置组件
    var div = document.createElement("div");
    div.innerHTML = SETTING_DIV.trim();
    document.body.appendChild(div);

    // 添加事件
    var closeButton = document.getElementById(CLOSE_BUTTON_ID);
    var saveButton = document.getElementById(SAVE_BUTTON_ID);
    var clearCacheButton = document.getElementById(CLEAR_CACHE_BUTTON_ID);
    var tmdbApiKeyInput = document.getElementById(TMDB_API_KEY_INPUT_ID);
    var languageCodeInput = document.getElementById(LANGUAGE_CODE_INPUT_ID);
    var errorMessageTextarea = document.getElementById(ERROR_MESSAGE_TEXTAREA_ID);
    // 打开设置界面
    i18nButton.onclick = function () {
        let tmdbApiKey = GM_getValue(KEY_TMDB_API_KEY);
        let languageCode = GM_getValue(KEY_LANGUAGE_CODE);
        if (tmdbApiKey) {
            tmdbApiKeyInput.value = tmdbApiKey;
        }
        if (languageCode) {
            languageCodeInput.value = languageCode;
        } else {
            languageCodeInput.value = DEFAULT_LANGUAGE_CODE;
        }
        document.getElementById(SETTING_SHOW_DIV_ID).style.display = "flex";
        document.getElementById(SETTING_HIDDEN_DIV_ID).style.display = "block";
    };
    // 关闭设置界面
    closeButton.onclick = function () {
        let settingShowDiv = document.getElementById(SETTING_SHOW_DIV_ID);
        let settingHiddenDiv = document.getElementById(SETTING_HIDDEN_DIV_ID);
        settingShowDiv.style.display = 'none';
        settingHiddenDiv.style.display = 'none';
        settingShowDiv.style.top = '200px';
        settingShowDiv.style.left = '';
    }
    // 保存设置
    saveButton.onclick = function () {
        GM_setValue(KEY_TMDB_API_KEY, tmdbApiKeyInput.value);
        GM_setValue(KEY_LANGUAGE_CODE, languageCodeInput.value);
        clearCache();
        initSeriesData();
        closeButton.click();
    }
    // 清除缓存
    clearCacheButton.onclick = function () {
        clearCache();
        Toast("Clear Cache Success", 2500);
    }
}
// 清除缓存
function clearCache() {
    let keys = GM_listValues();
    for (let key of keys) {
        if (key.indexOf(KEY_TITLE_PREFIX) != -1 || key.indexOf(KEY_OVERVIEW_PREFIX) != -1 || key == KEY_ERROR_MESSAGE) {
            GM_deleteValue(key);
        }
    }
    document.getElementById(ERROR_MESSAGE_TEXTAREA_ID).value = "";
}
// 保存错误信息
function saveErrorMessage(errorMessage) {
    var errorMessageTextarea = document.getElementById(ERROR_MESSAGE_TEXTAREA_ID);
    errorMessageTextarea.value = errorMessage;
    GM_setValue(KEY_ERROR_MESSAGE, errorMessage);
}
// 初始化数据
function initSeriesData() {
    var tmdbApiKey = GM_getValue(KEY_TMDB_API_KEY);
    var languageCode = GM_getValue(KEY_LANGUAGE_CODE);
    if (!tmdbApiKey || !languageCode) {
        return;
    }
    // 获取 Sonarr apiKey
    $.ajax({
        type: "GET",
        url: "/initialize.json",
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            let apiKey = res.apiKey;
            // 获取所有剧集的标题和 tvdbId
            $.ajax({
                type: "GET",
                url: "/api/v3/series",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "X-Api-Key": apiKey
                },
                success: function (res) {
                    for (let tv of res) {
                        // 没有数据则请求 TMDB 接口
                        if (!GM_getValue(KEY_TITLE_PREFIX + tv.title)) {
                            GM_setValue(KEY_TVDBID_PREFIX + tv.title, tv.tvdbId);
                            translate(tv.title, false);
                        }
                        if (GM_getValue(KEY_ERROR_MESSAGE)) {
                            break;
                        }
                    }
                },
                error: function (err) {
                    let errorMessage = "获取 Sonarr 剧集列表出错: " + JSON.stringify(err);
                    saveErrorMessage(errorMessage)
                    console.log(errorMessage);
                }
            });
        },
        error: function (err) {
            let errorMessage = "获取 Sonarr apiKey 出错: " + JSON.stringify(err);
            saveErrorMessage(errorMessage)
            console.log(errorMessage);
        }
    });
}

// 显示消息
function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

// 通过 TMDB 接口获取对应语言的标题和简介
function translate(title, saveOverview) {
    var tmdbApiKey = GM_getValue(KEY_TMDB_API_KEY);
    var languageCode = GM_getValue(KEY_LANGUAGE_CODE);
    if (!tmdbApiKey || !languageCode || GM_getValue(KEY_ERROR_MESSAGE)) {
        return;
    }
    GM_setValue(KEY_TITLE_PREFIX + title, title);
    let tvdbId = GM_getValue(KEY_TVDBID_PREFIX + title);
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/find/" + tvdbId + "?api_key=" + tmdbApiKey + "&language=" + languageCode + "&external_source=tvdb_id",
        success: function (res) {
            if (res && res.tv_results && res.tv_results.length > 0) {
                GM_setValue(KEY_TITLE_PREFIX + title, res.tv_results[0].name);
                if (saveOverview) {
                    let overview = res.tv_results[0].overview;
                    if (overview) {
                        GM_setValue(KEY_OVERVIEW_PREFIX + title, overview);
                        let overviewDiv = document.getElementsByClassName(DETAILS_OVERVIEW_CLASS_NAME)[0];
                        if (overviewDiv) {
                            overviewDiv.innerHTML = '<div style="overflow: hidden;"><span>' + overview + '</span></div>';
                        }
                    }
                }
            }
        },
        error: function (err) {
            let errorMessage = "请求 TMDB 接口出错: " + JSON.stringify(err);
            saveErrorMessage(errorMessage)
            console.log(errorMessage);
        }
    });
}

// 替换网页中的标题
function replaceTitle() {
    var tmdbApiKey = GM_getValue(KEY_TMDB_API_KEY);
    var languageCode = GM_getValue(KEY_LANGUAGE_CODE);
    if (!tmdbApiKey || !languageCode) {
        return;
    }

    var url = window.location.href;
    var className = POSTER_TITLE_CLASS_NAME;
    var endPath = url.substring(url.lastIndexOf("/"));
    var saveOverview = false;
    if (endPath != "/") {
        if (CALENDAR_TITLE_PATH.indexOf(endPath) != -1) {
            className = CALENDAR_TITLE_CLASS_NAME;
        } else if (SERIES_TITLE_PATH.indexOf(endPath) != -1) {
            className = SERIES_TITLE_CLASS_NAME;
        } else if (url.indexOf(DETAILS_TITLE_PATH) != -1) {
            className = DETAILS_TITLE_CLASS_NAME;
            saveOverview = true;
        }
    }
    var titleDivs = document.getElementsByClassName(className);
    var errorMessageTextarea = document.getElementById(ERROR_MESSAGE_TEXTAREA_ID);
    if (className == POSTER_TITLE_CLASS_NAME && (!titleDivs || titleDivs.length == 0)) {
        titleDivs = document.getElementsByClassName(SERIES_TITLE_CLASS_NAME);
        if (!titleDivs || titleDivs.length == 0) {
            titleDivs = document.getElementsByClassName(OVERVIEW_TITLE_CLASS_NAME);
        }
    }
    if (className == CALENDAR_TITLE_CLASS_NAME && (!titleDivs || titleDivs.length == 0)) {
        titleDivs = document.getElementsByClassName(CALENDAR_TITLE_AGENDA_CLASS_NAME);
    }
    for (let titleDiv of titleDivs) {
        let title = titleDiv.innerHTML;
        if (!title || title.indexOf("<") != -1) {
            continue;
        }
        var translatedTitle = GM_getValue(KEY_TITLE_PREFIX + title);
        if (translatedTitle && title != translatedTitle) {
            titleDiv.innerHTML = translatedTitle;
            if (saveOverview) {
                // 详情页重新加载最新数据
                translate(title, saveOverview);
            }
        }
    };
}

initSeriesData();
addi18nButtonAndSettingDiv();
setInterval(replaceTitle, 500);