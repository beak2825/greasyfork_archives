// ==UserScript==
// @name         虫虫钢琴免VIP扒谱
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  免VIP扒谱+去除部分烦人广告
// @author       HowardZhangdqs
// @grant        GM_addStyle
// @include      *://www.gangqinpu.com/*
// @require      https://greasyfork.org/scripts/468396-tampermonkeyrouter/code/TamperMonkeyRouter.js?version=1203270
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468400/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E5%85%8DVIP%E6%89%92%E8%B0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/468400/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E5%85%8DVIP%E6%89%92%E8%B0%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.TamperMonkeyRouter("*://www.gangqinpu.com/sheetplayer/web.html*", () => {
        !document.referrer && (location.href += "");
        GM_addStyle(`.print { display: none !important }`);
    });

    /**
     * Creates a floating button with the given bottom position.
     * @param {number} bottom - The bottom position of the button.
     * @returns {HTMLButtonElement} The created button element.
     */
    const make_fleating_btn = (bottom = 20) => {
        var button = document.createElement('button');

        button.textContent = '悬浮按钮';
        button.style.position = 'fixed';
        button.style.bottom = `${bottom}px`;
        button.style.left = '20px';
        button.style.zIndex = "9999";
        button.classList.add("btn-primary")
        document.body.appendChild(button);

        return button;
    }

    window.TamperMonkeyRouter(/.*?:\/\/www.gangqinpu.com\/(cchtml|jianpu).*?/, () => {
        // 去除顶部睿智横幅广告
        GM_addStyle(`#header > div.content-box-0 { display: none !important }`);

        // 还有下面的一些睿智广告
        GM_addStyle(`body > section > div.content-w > div > a > img { display: none !important }`);
    })

    window.TamperMonkeyRouter(/.*?:\/\/www.gangqinpu.com\/cchtml.*?/, () => {

        const btn = make_fleating_btn();

        btn.textContent = '点我扒谱';

        btn.addEventListener("click", () => {

            
            let $modes = document.querySelectorAll("body > section > div.content-w > div.score_details_box > aside > div > div > div.s-d-m-b-blockstyle > p:nth-child(3) > a");
            $modes = Array.from($modes);
            console.log($modes.map($mode => $mode.innerHTML));

            if ($modes.length == 1 && $modes[0].innerHTML == "五线谱") {
                btn.textContent = "Sorry，该琴谱暂不支持扒谱，我正在努力找解决办法……";
                

            } else {
                window.localStorage.setItem("TamperMonkeyCrack", "true");
                btn.textContent = "扒谱中…";
                window.open(window.location.href.replace("/cchtml/", "/jianpu/"));
            }


        });
    });

    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    /**
     * Retrieves the URL of the piano score and generates buttons to open the score in staff notation or simplified notation.
     * @param {HTMLElement} btn - The button element that triggers the score retrieval.
     * @returns {Promise<void>} - A Promise that resolves when the score URL is retrieved and the buttons are generated.
     */
    const get_puzi_url = async (btn) => {
        btn.textContent = '扒谱中…';

        let $score_src;

        loop: while (true) {
            await sleep(100);
            try {
                $score_src = document.getElementById("ai-score").src;
                break loop;
            } catch { }
        }
        btn.textContent = '扒谱完成';
        console.log($score_src);
        btn.textContent = '新页面中Ctrl+P即可打印琴谱';

        const jianpu1 = make_fleating_btn(20 + 50);
        const jianpu0 = make_fleating_btn(20 + 100);

        jianpu0.textContent = "点此打开五线谱";
        jianpu1.textContent = "点此打开简谱";

        jianpu0.addEventListener("click", () => {
            window.open($score_src.replace("jianpuMode=1", "jianpuMode=0"));
        });

        jianpu1.addEventListener("click", () => {
            window.open($score_src);
        });
    };

    window.TamperMonkeyRouter(/.*?:\/\/www.gangqinpu.com\/jianpu.*?/, () => {

        const btn = make_fleating_btn();

        btn.textContent = '点我扒谱';

        if (window.localStorage.getItem("TamperMonkeyCrack") == "true") {
            window.localStorage.removeItem("TamperMonkeyCrack");
            get_puzi_url(btn);
        } else {
            btn.addEventListener("click", () => {
                get_puzi_url(btn);
            });
        }
    });
})();