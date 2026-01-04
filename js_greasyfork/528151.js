// ==UserScript==
// @name         小說語音朗讀
// @namespace    Anong0u0
// @version      2025-10-04.1
// @description  小說朗讀腳本，支援朗讀控制與句子點擊切換
// @author       Anong0u0
// @match        https://*.wa01.com/novel/pagea/*.html
// @match        https://*.ttkan.co/novel/pagea/*.html
// @match        https://ttk.tw/novel/chapters/*/*.html
// @match        https://*.linovelib.com/novel/*/*.html
// @match        https://czbooks.net/n/*/*
// @match        https://mp.weixin.qq.com/*
// @match        https://www.wenku8.net/novel/*/*/*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wenku8.net
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/528151/%E5%B0%8F%E8%AA%AA%E8%AA%9E%E9%9F%B3%E6%9C%97%E8%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/528151/%E5%B0%8F%E8%AA%AA%E8%AA%9E%E9%9F%B3%E6%9C%97%E8%AE%80.meta.js
// ==/UserScript==

const siteMap = {
    "wa01.com" : ".content",
    "ttkan.co" : ".content",
    "ttk.tw" : ".content",
    "linovelib.com" : "#acontent, #TextContent",
    "czbooks.net" : ".content",
    "qq.com" : "#js_content",
    "wenku8.net":"#content"
}

const delay = (ms = 0) => new Promise((r)=>{setTimeout(r, ms)})
const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0, baseElement = null) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        if(baseElement == null) baseElement = document
        while(true)
        {
            if(selectCount != 1) {if((result = baseElement.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = baseElement.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
}

const style = document.createElement("style");
style.textContent = `
    .tts-paragraph,
    .tts-paragraph * {
        cursor: pointer;
        font-family: "Microsoft YaHei" !important;
    }
    .tts-paragraph:hover { text-decoration: underline; }
    .tts-paragraph.active,
    .tts-paragraph.active * {
      color: red !important;
    }
    .tts-control-panel {
        position: fixed;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }
    .tts-button {
        width: 50px;
        height: 50px;
        font-size: 24px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
    }
    .tts-slider-container {
        position: absolute;
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        padding: 5px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
        visibility: hidden;
        pointer-events: auto;
    }
    .tts-slider-container span { color: white; }
    #tts-imgs img { max-width: 1000px; }
`;
document.body.append(style);

let toggleBtn;

document.sc = {
    speechIndex: 0,
    speechPaused: false,
    currentUtterance: null,
    pElements: [],
    speechRate: GM_getValue("speechRate", 5),
    speechVolume: GM_getValue("speechVolume", 0.25),

    toggleSpeech(selector) {
        if (!this.pElements.length) {
            const element = document.querySelector(selector);
            if (!element) {
                console.error("Element not found");
                return;
            }

            this.pElements = element.querySelectorAll("p, section");
            if(this.pElements.length === 0) {
                const imgs = [...element.querySelectorAll("*:has(>img)")].map((img)=>img.innerHTML).join("\n");
                console.log(imgs)
                element.innerHTML = element.innerText.split(/\n+/).map(para => `<p>${para}</p>`).join('')+`<div id="tts-imgs">${imgs}</div>`;
                this.pElements = element.querySelectorAll("p");
            }

            this.pElements.forEach((p, index) => {
                p.classList.add("tts-paragraph");
                p.addEventListener("click", () => {
                    if (this.speechPaused) this.toggleSpeech();
                    this.speakSpecific(index);
                });
            });

            document.addEventListener("keydown", (e) => {
                if ((e.code === "ArrowLeft" || e.code === "ArrowUp") && this.speechIndex > 0) {
                    this.speakSpecific(this.speechIndex - 1);
                } else if ((e.code === "ArrowRight" || e.code === "ArrowDown") && this.speechIndex < this.pElements.length - 1) {
                    this.speakSpecific(this.speechIndex + 1);
                } else if (e.code === "Space") {
                    e.preventDefault();
                    this.toggleSpeech();
                }
            });

            this.speechIndex = 0;
            this.speechPaused = false;
            this.speakNext();
        } else {
            if (this.speechPaused) {
                this.speechPaused = false;
                this.speakNext();
                toggleBtn.innerText ="⏸";
                toggleBtn.style = "background-color: lightcoral";
            } else {
                this.speechPaused = true;
                speechSynthesis.cancel();
                toggleBtn.innerText = "▶";
                toggleBtn.style = "background-color: lightgreen";
            }
        }
    },

    speakNext() {
        if (this.speechIndex >= this.pElements.length || this.speechPaused) return;

        this.speakSpecific(this.speechIndex);
    },

    speakSpecific(index) {
        if (index >= this.pElements.length) return;

        if (this.currentUtterance) {
            speechSynthesis.cancel();
        }

        this.speechIndex = index;
        const currentParagraph = this.pElements[this.speechIndex];
        this.currentUtterance = new SpeechSynthesisUtterance(currentParagraph.innerText);
        this.currentUtterance.lang = "zh-TW";
        this.currentUtterance.rate = this.speechRate;
        this.currentUtterance.volume = this.speechVolume;

        this.pElements.forEach(p => p.classList.remove("active"));
        currentParagraph.classList.add("active");

        currentParagraph.scrollIntoView({ behavior: "smooth", block: "center" });

        this.currentUtterance.onend = () => {
            currentParagraph.classList.remove("active");
            this.speechIndex++;
            this.speakNext();
        };

        speechSynthesis.speak(this.currentUtterance);
    }
};

const controlPanel = document.createElement("div");
controlPanel.className = "tts-control-panel";

const navigateChapter = (offset) => {
    const chapter = Number(location.href.match(/\d+(?=[^\d]*$)/))
    if (!chapter) return;
    location.href = location.href.replace(/\d+(?=[^\d]*$)/, Math.max(1, chapter + offset));
}
const prevChapter = () => {
    if (typeof ReadParams != "undefined" && ReadParams?.url_previous) location.href = ReadParams.url_previous;
    const t = document.querySelector("a.prev-chapter, .mlfy_page>a:nth-child(1), .album_read_nav_prev, #foottext>a:nth-of-type(3)");
    if (t) {
        t.click();
        return;
    }
    navigateChapter(-1);
}
const nextChapter = () => {
    if (typeof ReadParams != "undefined" && ReadParams?.url_next) location.href = ReadParams.url_next;
    const t = document.querySelector("a.next-chapter, .mlfy_page>a:nth-child(5), .album_read_nav_next, #foottext>a:nth-of-type(4)");
    if (t) {
        t.click();
        return;
    }
    navigateChapter(1);
}

const buttons = [
    { icon: "⏮", action: () => prevChapter(), tip: "上一章" },
    { icon: "▲", action: () => {
        if (document.sc.speechIndex > 0) {
            document.sc.speakSpecific(document.sc.speechIndex - 1);
        }
    }, tip: "上一句" },
    { icon: "⏸", action: (e) => document.sc.toggleSpeech(), tip: "播放/暫停" },
    { icon: "▼", action: () => {
        if (document.sc.speechIndex < document.sc.pElements.length - 1) {
            document.sc.speakSpecific(document.sc.speechIndex + 1);
        }
    }, tip: "下一句" },
    { icon: "⏭", action: () => nextChapter(1), tip: "下一章" },
    { icon: "♿", sliderAction: (value) => {
        document.sc.speechRate = value;
        GM_setValue("speechRate", value);
    }, min: 1, max: 10, tip: "語速" },
    { icon: "🔊", sliderAction: (value) => {
        document.sc.speechVolume = value / 100;
        GM_setValue("speechVolume", document.sc.speechVolume);
    }, min: 0, max: 100, tip: "音量" }
];

buttons.forEach(({ icon, action, sliderAction, min, max, tip }) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "relative";

    const button = document.createElement("button");
    button.className = "tts-button";
    button.innerText = icon;
    button.onclick = action;
    button.title = tip;
    if(icon === "⏸") button.style = "background-color: lightcoral";

    buttonContainer.appendChild(button);

    if (sliderAction) {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "tts-slider-container";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = min.toString();
        slider.max = max.toString();
        slider.value = (icon === "🔊" ? document.sc.speechVolume * 100 : document.sc.speechRate).toString();
        slider.oninput = (event) => {
            sliderValue.innerText = event.target.value;
            sliderAction(Number(event.target.value));
            document.sc.toggleSpeech()
            document.sc.toggleSpeech()
        };

        const sliderValue = document.createElement("span");
        sliderValue.innerText = slider.value;

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(sliderValue);

        buttonContainer.addEventListener("mouseenter", () => sliderContainer.style.visibility = "visible");
        buttonContainer.addEventListener("mouseleave", () => setTimeout(() => {
            if (!sliderContainer.matches(":hover")) {
                sliderContainer.style.visibility = "hidden";
            }
        }, 300));

        buttonContainer.appendChild(sliderContainer);
    }
    controlPanel.appendChild(buttonContainer);
});

toggleBtn = controlPanel.querySelector("[title='播放/暫停']");

document.body.appendChild(controlPanel);

const selector = location.host.match(/\w+\.\w+$/);
delay(100)
    .then(() => waitElementLoad(siteMap[selector], 1, -1, 200))
    .then(() => {
    speechSynthesis.cancel();
    document.sc.toggleSpeech(siteMap[selector]);
})

