// ==UserScript==
// @name         動畫瘋自動播放
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  啟用自動播放。更新：重構程式。
// @author       南蠻酋長
// @match        *://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://i2.bahamut.com.tw/anime/baha_s.png
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/392942/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/392942/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function htmlToElement(html) {
        var template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    /*
    * 用來從腳本插件的儲存區中讀取自動播放的設定選項
    * Key 必須與網頁 Checkbox 元件的 HTML id 一致
    * Value 是 boolean
    */

    async function loadOptionsFromStore() {
        return {
            "age-skip" : await GM_getValue("age-skip", true),
            "ad-skip" : await GM_getValue("ad-skip", true),
            "auto-play" : await GM_getValue("auto-play", true)
        };
    }

    function createCheckboxElement(id, labelText) {
        let html = `
            <div class="ani-setting-item ani-flex">
                <div class="ani-setting-label">
                    <span class="ani-setting-label__mian">${labelText}</span>
                </div>
                <div class="ani-setting-value ani-set-flex-right">
                    <div class="ani-checkbox">
                        <label class="ani-checkbox__label">
                            <input class="auto-play-option" type="checkbox" name="ani-checkbox" id="${id}">
                            <div class="ani-checkbox__button"></div>
                        </label>
                    </div>
                </div>
            </div>
        `;
        let elem = htmlToElement(html);
        return elem;
    }

    function createOptionSectionElement(arr) {
        let html =`
        <div class="ani-setting-section">
            <h4 class="ani-setting-title">自動播放設定</h4>
        </div>
        `;
        let elem = htmlToElement(html);
        for(var i = 0; i < arr.length; i++) elem.appendChild(arr[i]);
        return elem;
    }

    function createFirefoxWarningElement() {
        let img = `<img style="max-width:100%;" src="https://greasyfork.org/system/screenshots/screenshots/000/018/105/original/firefox_I0MYCfKtaD-compressor.jpg"/>`;
        let html =
            `<div class="ani-setting-section">
                <h4 class="ani-setting-title">你使用的是 Firefox 瀏覽器</h4>
                <div class="ani-setting-item ani-flex">
                    <div class="ani-setting-label">
                        <span class="ani-setting-label__mian">因為 Firefox 預設會阻擋網站的自動影音播放，需要將動畫瘋加入允許自動播放的名單中才能運作喔！</span>
                    </div>
                </div>
                <div class="ani-setting-item">${img}</div>
            </div>`;
        return htmlToElement(html);
    }

    /*
    * 腳本主要邏輯入口。
    */
    let initInterval = setInterval(function(){
        let optionPlaneElem = document.getElementById("ani-tab-content-2");
        let documentReady = document.readyState === "complete"
            || (document.readyState !== "loading" && !document.documentElement.doScroll);
        if(optionPlaneElem && documentReady) {
            const qs = (q) => document.querySelector(q);
            let optionSectionElem = createOptionSectionElement([
                createCheckboxElement("age-skip", "自動確認年齡分級"),
                createCheckboxElement("ad-skip", "自動跳過剩餘廣告"),
                createCheckboxElement("auto-play", "自動播放下一集")
            ]);
            optionPlaneElem.appendChild(optionSectionElem);

            let ageSkipHandle = new OptionRegistry(
                document.getElementById("age-skip"),
                function (self) {
                    if(qs(".R18") && qs("#adult")){
                        qs("#adult").click();
                        self.enableInterval(false);
                    }
                }
            );
            let adSkipHandle = new OptionRegistry(
                document.getElementById("ad-skip"),
                function(self) {
                    console.log('ad check');
                    if(qs("#adSkipButton")
                    && qs("#adSkipButton").classList.contains("enabled"))
                    {
                        qs("#adSkipButton").click();
                        self.enableInterval(false);
                    }
                    if(qs(".nativeAD-skip-button")
                    && qs(".nativeAD-skip-button").classList.contains("enable"))
                    {
                        qs(".nativeAD-skip-button").click();
                        self.enableInterval(false);
                    }
                }
            );
            let autoPlayHandle = new OptionRegistry(
                document.getElementById("auto-play"),
                function(self) {
                    if(qs("#ani_video_html5_api")
                    && (qs("#ani_video_html5_api").readyState != 0)
                    && qs("#ani_video_html5_api").ended)
                    {
                        let replayPage = qs(".replay");
                        let nextEpBtn = replayPage? replayPage.childNodes[1] : null;
                        if(nextEpBtn){
                            nextEpBtn.click();
                        }
                    }
                }
            );

            if (navigator.userAgent.search("Firefox") != -1) {
                optionPlaneElem.appendChild(createFirefoxWarningElement());
            }

            clearInterval(initInterval);
        }
    },500);

    /*
    * 這個類用來幫助註冊事件，以及託管計時器狀態。
    */
    class OptionRegistry {
        constructor(elem, intervalCallback) {
            this._id = elem.id;
            this._interval = null;
            this._intervalCallback = () => { intervalCallback(this); };
            this.elem = elem;
            loadOptionsFromStore().then( options => {
                let enable = options[this._id];
                elem.checked = enable;
                elem.addEventListener("click", (event) => { this._handleClick(event); });
                this.enableInterval(enable);
            });
        }
        enableInterval(flag) {
            if (!flag) {
                clearInterval(this._interval);
                this._interval = null;
            }
            if (flag && (this._interval == null) && (this._intervalCallback != null)) {
                this._interval = setInterval(this._intervalCallback, 1000);
            }
        }
        _handleClick(event) {
            let target = event.target;
            this.enableInterval(target.checked);
            GM_setValue(target.id, target.checked);
        }
    }

/***** ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡ *****/
})();
