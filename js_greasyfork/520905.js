// ==UserScript==
// @name         e-typing 長文拡張
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ワードの出現・打ち切り回数保存、任意の文字までのリザルト表示
// @author       nora
// @license MIT
// @match        https://www.e-typing.ne.jp/app*
// @exclude      https://www.e-typing.ne.jp/app/ad*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/520905/e-typing%20%E9%95%B7%E6%96%87%E6%8B%A1%E5%BC%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/520905/e-typing%20%E9%95%B7%E6%96%87%E6%8B%A1%E5%BC%B5.meta.js
// ==/UserScript==

$(document).one("loadComplete", (_, settingXML) => {
    let type = settingXML.querySelector("type").textContent;
    if (type === "4" && window !== parent) {
        let title = settingXML.querySelector("title").textContent;
        let mode = settingXML.querySelector("snsURL").textContent.includes("kana") ? "K" : "R";
        parent.chobun = new Chobun(title, mode);
    }
})



class Chobun {
    constructor(title, mode){
        console.log(title, mode === "R" ? "ローマ字" : "かな");

        document.head.insertAdjacentHTML("afterbegin","<style>#exampleList { width: 371px !important; } .sentence span:hover { outline: solid 1px #000; }</style>");

        this.title = title;
        this.mode = mode;

        this.chobunData = JSON.parse(GM_getValue("chobun", "{}"));
        this.words = this.chobunData[this.title]?.[this.mode]?.words ?? {};
        this.focusWords = [];

        this.parentDoc = parent.document;
        this.setElem();

        this.levelList = ["E-","E","E+","D-","D","D+","C-","C","C+","B-","B","B+","A-","A","A+","S","Good!","Fast","Thunder","Ninja","Comet","Professor","LaserBeam","EddieVH","Meijin","Rocket","Tatujin","Jedi","Godhand","Joker"];

        $(document).on({
            "end_countdown.etyping": this.repeat,
            "replay": () => $(document).on("end_countdown.etyping", this.repeat)
        });

        window.addEventListener("beforeunload", this.close);
        parent.$pp_overlay.fadeOut = (a,c,d) => {this.close(); return parent.$pp_overlay.animate({opacity:"hide"},a,c,d)};
    }

    repeat = e => {
        this.typingStartTime = e.timeStamp;
        this.typingData = [{}];
        this.replayFlag = false;
        let prevCorrectTime = 0;
        $(document).on({
            ["correct.etyping error.etyping"]: e => {
                let time =  e.timeStamp - this.typingStartTime;
                let charData = this.typingData.at(-1);
                if (e.type === "correct") {
                    charData.time = time - prevCorrectTime;
                    prevCorrectTime = time;
                    this.typingData.push({});
                } else {
                    charData.miss ? charData.miss.push(time - prevCorrectTime) : charData.miss = [time - prevCorrectTime];
                }
            },
            ["complete.etyping interrupt.etyping"]: e => {
                let time =  e.timeStamp - this.typingStartTime;
                e.type === "interrupt" ? this.typingData.pop() : this.typingData.at(-1).time = time - prevCorrectTime;
                setTimeout(() => this.end(e.type));
            }
        })

        setTimeout(() => {
            if (this.focusWords.length && !this.focusWords.includes(document.getElementById("exampleText").textContent)) {
                this.replayFlag = true;
                $(document).trigger("interrupt.etyping");
            }
        })
    }

    end(type){
        const resultObserver = new MutationObserver(() => {
            if (document.getElementsByClassName("result_data").length) {
                this.add(document.getElementsByClassName("example")[0].textContent, type);

                if (this.replayFlag) return $(document).trigger("replay");

                const prevResultElem = document.getElementsByClassName("result_data")[1];
                const savePrevResult = prevResultElem.innerHTML;
                const sentence = document.getElementsByClassName("sentence")[0];

                sentence.addEventListener("mouseover",e => e.target.matches(".sentence span") && this.dispSentenceResult(e));
                sentence.addEventListener("mouseleave", e => e.relatedTarget?.parentElement.className !== "time-tooltip" && (prevResultElem.innerHTML = savePrevResult));
            }
            resultObserver.disconnect();
        })
        resultObserver.observe(document.getElementById("result"),{childList:true});
    }

    add(word, type){
        if (this.words[word]) {
            this.words[word].count++;
            this.words[word].compCount += type === "interrupt" ? 0 : 1;
        } else {
            this.words[word] = {
                count: 1,
                compCount: type === "interrupt" ? 0 : 1
            }
        }

        this.dispWordData([word]);
    }

    close = () => {
        this.chobunData[this.title] ??= {};
        this.chobunData[this.title][this.mode] = { words: this.words };
        GM_setValue("chobun", JSON.stringify(this.chobunData));

        this.parentDoc.getElementById("word-container").remove();
    }

    dispSentenceResult = e => {
        let index = Math.min(this.typingData.length, [...e.target.parentNode.children].indexOf(e.target) + 1);
        let data = this.typingData.slice(0, index);

        let time = data.reduce((acc, charData) => acc + charData.time, 0);

        let inputTime = (time < 60000 ? "" : Math.floor(time / 60000) + "分") + (time / 1000 % 60).toFixed(2).replace(".","秒");
        let typingCount = index;
        let missTypeCount = data.reduce((acc, e) => acc + (e?.miss?.length || 0), 0);
        let correctRate = Math.floor(Math.max(10000 * (typingCount - missTypeCount) / typingCount, 0));
        let latency = this.typingData[0].time;
        let wpm = Math.floor(typingCount * (6000000 / time)) / 100;
        let rkpm = ((typingCount - 1) / (time - latency) * 60000) || 0;
        let score = 60000 * (typingCount - missTypeCount) / time * (correctRate / 10000) ** 2;
        let level = this.levelList[score < 22 ? 0 : score < 39 ? 1 : score < 56 ? 2 : score < 73 ? 3 : score < 90 ? 4 : score < 107 ? 5 : score < 124 ? 6 : score < 141 ? 7 : score < 158 ? 8 : score < 175 ? 9 : score < 192 ? 10 : score < 209 ? 11 : score < 226 ? 12 : score < 243 ? 13 : score < 260 ? 14 : score < 277 ? 15 : score < 300 ? 16 : score < 325 ? 17 : score < 350 ? 18 : score < 375 ? 19 : score < 400 ? 20 : score < 450 ? 21 : score < 500 ? 22 : score < 550 ? 23 : score < 600 ? 24 : score < 650 ? 25 : score < 700 ? 26 : score < 750 ? 27 : score < 800 ? 28 : 29];

        let prevResultDataElem = document.getElementsByClassName("result_data")[1].getElementsByClassName("data");
        prevResultDataElem[0].textContent = score.toFixed(2);
        prevResultDataElem[1].textContent = level;
        prevResultDataElem[2].textContent = inputTime;
        prevResultDataElem[3].textContent = typingCount;
        prevResultDataElem[4].textContent = missTypeCount;
        prevResultDataElem[5].textContent = wpm.toFixed(2);
        prevResultDataElem[6].textContent = correctRate / 100 + "%";
        prevResultDataElem[7].textContent = (latency / 1000).toFixed(3);
        prevResultDataElem[8].textContent = rkpm.toFixed(2);
    }

    setElem(){
        let top = parent.scrollY + 145;
        let left = this.parentDoc.documentElement.clientWidth / 2 - 374;

        this.parentDoc.body.insertAdjacentHTML("afterbegin",`
            <table id="word-container" style="top: ${top + 602 + 10}px; left: ${left + 10 + 57.5}px;">
                <tbody id="words"></tbody>
            </table>`);

        this.parentDoc.head.insertAdjacentHTML("afterbegin",`
            <style>
                #word-container {
                    position: absolute;
                    z-index: 15000;
                    color: black;
                    padding: 5px;
                    background-color: rgba(5, 127, 255, 0.8);
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    border: 2px solid #0005;
                    border-radius: 10px;
                    border-collapse: separate;
                    user-select: none;
                }

                #word-container:hover {
                    cursor: grab;
                }

                #word-container:active {
                    cursor: grabbing;
                }

                #words td {
                    color: black;
                    max-width: 300px;
                    height: 20px;
                    line-height: 2;
                    padding-left: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .highlight::after {
                    content: "";
                    position: absolute;
                    animation: pathmove 3s ease-in-out infinite;
                    opacity: 0;
                    box-shadow: 0px -3px 1px 1px rgba(222, 222, 7, 0.9);
                }

                @keyframes pathmove{
                    0% { width: 0; left: 0; opacity: 0; }
                    10% { opacity: 1; }
                    30% { width: 200px; }
                    70% { left: 60%; opacity: 1; }
                    100% { width: 30px; left: 60%; opacity: 0; }
                }
            `);

        this.parentDoc.getElementById("word-container").addEventListener("pointermove",function(e){
            if(e.buttons){
                this.style.left = this.offsetLeft + e.movementX + "px";
                this.style.top = this.offsetTop + e.movementY + "px";
                this.setPointerCapture(e.pointerId);
            }
        })

        this.parentDoc.getElementById("word-container").addEventListener("dblclick",e => {
            if (e.target.matches("td")) {
                let targetWord = e.target.textContent;
                if (!this.focusWords.includes(targetWord)) {
                    this.focusWords.push(targetWord);
                    e.target.style = `outline: 1px solid aqua; border-radius: 10px; background-color: rgba(127, 255, 212, 0.5);`;
                } else {
                    this.focusWords = this.focusWords.filter(word => word !== targetWord);
                    e.target.removeAttribute("style");
                }
            }
        })

        this.dispWordData(Object.keys(this.words));
    }

    dispWordData(addedWords){
        let HTML = Object.keys(this.words).sort((a,b) => this.words[b].count - this.words[a].count).reduce((HTML, word) => {
            let count = this.words[word].count;
            let compCount = this.words[word].compCount;
            let completeRate = (compCount / count * 100).toFixed(2);
            let focusWordStyle = this.focusWords.includes(word) ? "style='outline: 1px solid aqua; border-radius: 10px; background-color: rgba(127, 255, 212, 0.5);'" : "";

            return HTML + `<tr>
                    <td title="${completeRate}%">${compCount}/${count}</td>
                    <td title="${word}" colspan="2" ${focusWordStyle}>${word}</td>
                </tr>`
        },"") || "<td>Let's typing!</td>";

        this.parentDoc.getElementById("words").innerHTML = HTML;
        this.highlight(addedWords);
    }

    highlight(addedWords){
        addedWords.forEach(addedWord => {
            let elem = this.parentDoc.querySelector(`[title="${addedWord}"]`);
            let highlight = `<div class="highlight" style="top: ${elem.clientHeight}px"></div>`
            elem.insertAdjacentHTML("beforeend", highlight)
        })

        setTimeout(() => { [...this.parentDoc.getElementsByClassName("highlight")].forEach(e => e.remove()); }, 3000);
    }
}