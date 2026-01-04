// ==UserScript==
// @name         e-typing chobun plus
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ワードの表示・打ち切り回数保存、任意の文字間のリザルト・リプレイ再生
// @author       tai
// @license MIT
// @match        https://www.e-typing.ne.jp/app*
// @exclude      https://www.e-typing.ne.jp/app/ad*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @require      https://update.greasyfork.org/scripts/530545/1558131/keyboardevent-chobun.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530572/e-typing%20chobun%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/530572/e-typing%20chobun%20plus.meta.js
// ==/UserScript==

$(document).one("loadComplete", (_, setting) => {
    let type = setting.querySelector("type").textContent;
    if (type === "4" || type === "255") {
        console.log("(`･▿･´ )ﾉ");

        let snsURL = setting.querySelector("snsURL").textContent;
        let title = setting.querySelector("title").textContent;
        let mode = snsURL.includes("english") ? "E" : snsURL.includes("kana") ? "K" : "R";
        new Chobun(title, mode);
    } else {
        console.log("_(- ᴗ -_)_ …zzz");
    }
})



class Chobun {
    constructor(title, mode){
        this.title = title;
        this.mode = mode;

        this.chobun = JSON.parse(GM_getValue("chobun", "{}"));
        this.words = this.chobun[this.title]?.[this.mode]?.words ?? {};
        this.focusWords = [];

        this.wordList = new WordList(this.title, this.mode, this.chobun, this.words, this.focusWords);

        this.insertStyle();

        $(document).on({
            "end_countdown.etyping": this.start,
            "replay": () => {
                Result.clear();
                Replay.clear();
                Typing.clear();
                $(document).on("end_countdown.etyping", this.start);
            }
        });

        window.addEventListener("beforeunload", this.close);
        parent.$pp_overlay && (parent.$pp_overlay.fadeOut = (a,c,d) => {this.close(); return parent.$pp_overlay.animate({opacity:"hide"},a,c,d)});
    }

    start = () => {
        let typingStartTime = performance.now();
        let time, char;
        Typing.data.push({ char: null, index: null, time: null }); //logで見やすく
        this.replayFlag = false;

        const handleKeydown = e => {
            time = e.timeStamp - typingStartTime;
            char = this.mode === "K" ? e.kana : this.mode === "R" ? e.char.toUpperCase() : e.char;
        };

        document.addEventListener("keydown", handleKeydown);

        let index = 0;
        $(document).on({
            ["correct.etyping error.etyping"]: e => {
                let charData = Typing.data.at(-1);

                if (e.type === "correct") {
                    charData.index = index;
                    charData.char = char;
                    charData.time = time;
                    index++;
                } else {
                    charData.index = index;
                    charData.char = char;
                    charData.time = time;
                    charData.isMiss = true;
                }

                Typing.data.push({ char: null, index: null, time: null });
            },
            ["complete.etyping interrupt.etyping"]: e => {
                let charData = Typing.data.at(-1);
                charData.index = index;
                charData.char = char;
                charData.time = time;
                charData.isInterrupt = charData.isInterrupt = e.type === "interrupt";

                document.removeEventListener("keydown", handleKeydown);

                console.log(Typing.data);
                setTimeout(() => this.end(e.type));
            }
        })

        setTimeout(() => {
            this.word = this.mode !== "E" ? document.getElementById("exampleText").textContent : document.getElementById("sentenceText").textContent.replace(/␣/g," ");

            this.words = this.wordList.add(this.word, "show");

            if (this.focusWords.length && !this.focusWords.includes(this.word)) {
                this.replayFlag = true;
                $(document).trigger("interrupt.etyping");
            }
        })
    }

    end(type){
        const resultObserver = new MutationObserver(() => {
            if (document.getElementsByClassName("result_data").length) {
                if (this.replayFlag) {
                    resultObserver.disconnect();
                    return $(document).trigger("replay");
                }

                if (type === "complete") {
                    this.wordList.add(this.word, type);
                }

                Result.init(this.mode);

                resultObserver.disconnect();
            }
        })

        resultObserver.observe(document.getElementById("result"), { childList: true });
    }

    insertStyle(){
        document.head.insertAdjacentHTML("afterbegin",`<style>
            #exampleList {
                width: 371px !important;
            }

            .entered {
                color: #ffd0a6;
            }

            .sentence {
                font-size: 20px;
                font-family: "Consolas", "Cascadia Mono", "Menlo", "DejaVu Sans Mono", monospace;
                line-break: anywhere;
            }

            .sentence span {
                cursor: pointer;
            }

            .sentence .hover {
                outline: 1px solid #000000;
            }

            .sentence .selected {
                background-color: rgba(5, 127, 255, 0.8);
                outline: 1px solid #0000ff;
            }

            .result_data.fixed {
                background-color: rgba(255, 255, 0, 0.5) !important;
            }
        </style>`);
    }

    close(){
        parent.document.getElementById("word_list").remove();
    }
}



class Result {
    static init(mode){
        this.mode = mode;

        this.sentence = document.getElementsByClassName("sentence")[0];
        !document.getElementById("latency") && this.plus(Typing.data);

        this.prev = document.getElementById("prev");
        this.savePrev = this.prev.innerHTML;

        this.sentence.title = "クリックでこの文字を固定（もう一度押して解除）\n\nショートカット:\n[s] リザルトを固定 (もう一度押して解除)\n[a] リプレイ再生\n[Escape] リプレイ停止、リザルト画面初期化";
        [...this.sentence.children].forEach(e => e.textContent = e.textContent === " " ? "_" : e.textContent);
        this.mode === "K" && (this.sentence.style.fontSize = "16px");

        Replay.init();

        this.fixed = false;
        this.selected = null;
        if (Typing.latestIndex()) {
            this.sentence.addEventListener("click", e => e.target.matches(".sentence span") && !this.fixed && this.#sentenceClick(e));
            this.sentence.addEventListener("mouseover", e => e.target.matches(".sentence span") && !this.fixed && this.#sentenceMouseOver(e));
            this.sentence.addEventListener("mouseleave", e => !this.fixed && this.#sentenceMouseLeave(e));

            document.addEventListener("keydown", this.#handleKeydown);
            parent.document.addEventListener("keydown", this.#handleKeydown);
        }
    }

    static plus(typingData){
        document.getElementById("app").style.height = "502px";
        document.querySelector("#result article").style.height = "452px";
        document.getElementById("current").style.height = "367px";
        document.getElementById("prev").style.height = "367px";
        document.getElementById("exampleList").style.height = "284px";
        document.querySelectorAll(".result_data").forEach(e => { e.children[0].children[7].remove(); e.style.height = "318px" });


        document.getElementsByClassName("result_data")[1].children[0].insertAdjacentHTML("beforeend", `<li id="previous_latency"><div class="data">${this.latency === undefined ? "-" : (this.latency / 1000).toFixed(3)}</div></li><li id="previous_rkpm"><div class="data">${this.rkpm === undefined ? "-" : this.rkpm.toFixed(2)}</div></li>`);

        this.latency = Typing.latency();
        this.rkpm = Typing.rkpm();
        document.getElementsByClassName("result_data")[0].children[0].insertAdjacentHTML("beforeend", `<li id="latency"><div class="title">Latency</div><div class="data">${(this.latency / 1000).toFixed(3)}</div></li><li id="rkpm"><div class="title">RKPM</div><div class="data">${this.rkpm.toFixed(2)}</div></li>`);


        this.sentence.innerHTML = this.sentence.textContent.split("").map((char, i) => {
            let charData = Typing.data.findLast(e => e.index === i);
            let isMiss = Typing.data.some(e => e.index === i && e.isMiss);

            return !charData || charData.isInterrupt ? `<span style="opacity: 0.6; display: inline;">${char}</span>` : isMiss ? `<span class="miss">${char}</span>` : `<span>${char}</span>`;
        }).join("");
    }

    static show(start, end, indexBreak = true){
        start = Math.max(0, start);
        end = indexBreak ? Math.min(Typing.latestIndex() - (Typing.data.at(-1).isInterrupt ? 1 : 0), end) : end;

        const data = Typing.result(start, end, indexBreak);

        document.querySelector("#prev h1").textContent = indexBreak ? `${start + 1}～${end + 1}まで` : `${data.typingCount}${data.missTypeCount ? " (" + data.missTypeCount + ")文字" : "文字"}`;
        let prevRsltElem = document.getElementsByClassName("result_data")[1].getElementsByClassName("data");
        prevRsltElem[0].textContent = data.score.toFixed(2);
        prevRsltElem[1].textContent = data.level;
        prevRsltElem[2].textContent = data.inputTime;
        prevRsltElem[3].textContent = data.typingCount;
        prevRsltElem[4].textContent = data.missTypeCount;
        prevRsltElem[5].textContent = data.wpm.toFixed(2);
        prevRsltElem[6].textContent = (data.correctRate / 100).toFixed(2) + "%";
        prevRsltElem[7].textContent = (data.latency / 1000).toFixed(3);
        prevRsltElem[8].textContent = data.rkpm.toFixed(2);
    }

    static #sentenceClick = e => {
        let sentences = [...e.target.parentNode.children];

        if (this.selected === null) {
            this.selected = Math.min(Typing.latestIndex() - (Typing.data.at(-1).isInterrupt ? 1 : 0), sentences.indexOf(e.target));
            this.show(this.selected, this.selected);
            sentences[this.selected].classList.add("selected");
        } else {
            this.selected = null;
            this.show(0, sentences.indexOf(e.target));
            document.getElementsByClassName("selected")[0]?.classList.remove("selected");
        }
    }

    static #sentenceMouseOver = e => {
        let sentences = [...e.target.parentNode.children];
        let targetIndex = sentences.indexOf(e.target);

        document.getElementsByClassName("hover")[0]?.classList.remove("hover");
        sentences[Math.min(Typing.latestIndex() - (Typing.data.at(-1).isInterrupt ? 1 : 0), targetIndex)].classList.add("hover");

        let [start, end] = [this.selected || 0, targetIndex].sort((a, b) => a - b);
        this.show(start, end);
    }

    static #sentenceMouseLeave = e => {
        if (e.relatedTarget?.className !== "time-tooltip" && e.relatedTarget?.parentElement.className !== "time-tooltip") {
            this.selected = null;
            document.getElementsByClassName("hover")[0]?.classList.remove("hover");
            document.getElementsByClassName("selected")[0]?.classList.remove("selected");

            this.prev.innerHTML = this.savePrev;
        }
    }

    static #handleKeydown = e => {
        switch (e.key) {
            case "s":
                this.fixed && this.selected && (this.selected = null, document.getElementsByClassName("selected")[0]?.classList.remove("selected"));
                this.fixed && document.getElementsByClassName("hover")[0]?.classList.remove("hover");


                this.fixed = !this.fixed;
                document.getElementsByClassName("result_data")[1].classList.toggle("fixed");
                break;
        }
    }

    static clear(){
        this.prev = null;
        this.savePrev = null;

        document.removeEventListener("keydown", this.#handleKeydown);
        parent.document.removeEventListener("keydown", this.#handleKeydown);
    }
}

class WordList {
    constructor(title, mode, chobun, words, focusWords){
        this.title = title;
        this.mode = mode;

        this.chobun = chobun;
        this.words = words;
        this.focusWords = focusWords;

        this.pDoc = parent.document;
        this.insert();
    }

    insert(){
        let top = parent.scrollY + 137.5;
        let left = this.pDoc.documentElement.clientWidth / 2 - 374;

        this.pDoc.body.insertAdjacentHTML("afterbegin",`
            <table id="word_list" style="top: ${top + 371 + 90}px; left: ${left + 10 + 57.5 + 608 * 3 / 4}px;">
                <tbody id="words"></tbody>
            </table>`);

        this.pDoc.head.insertAdjacentHTML("afterbegin",`
            <style>
                #word_list {
                    position: absolute;
                    z-index: 15000;
                    color: black;
                    padding: 5px;
                    background-color: rgba(5, 127, 255, 0.8);
                    outline: 1px solid #0000ff;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                    border-radius: 10px;
                    border-collapse: separate;
                    user-select: none;
                }

                #word_list:hover {
                    cursor: grab;
                }

                #word_list:active {
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

                .focus_word {
                    outline: 1px solid aqua;
                    background-color: rgba(127, 255, 212, 0.5);
                    border-radius: 10px;
                }

                .highlight::after {
                    content: "";
                    position: absolute;
                    animation: pathmove 3s ease-in-out infinite;
                    opacity: 0;
                    box-shadow: 0px -3px 1px 1px rgba(222, 222, 7, 0.9);
                }

                @keyframes pathmove {
                    0% { width: 0; left: 0; opacity: 0; }
                    10% { opacity: 1; }
                    30% { width: 200px; }
                    70% { left: 60%; opacity: 1; }
                    100% { width: 30px; left: 60%; opacity: 0; }
                }
            `);



        this.wordList = this.pDoc.getElementById("word_list");

        this.wordList.addEventListener("pointermove", function(e){
            if (e.buttons) {
                this.style.left = this.offsetLeft + e.movementX + "px";
                this.style.top = this.offsetTop + e.movementY + "px";
                this.setPointerCapture(e.pointerId);
            }
        });

        this.wordList.addEventListener("click", e => {
            if (e.target.matches("td") && [...e.target.classList].includes("word")) {
                let targetWord = e.target.textContent;
                if (!this.focusWords.includes(targetWord)) {
                    this.focusWords.push(targetWord);
                    e.target.classList.add("focus_word");
                } else {
                    this.focusWords.splice(this.focusWords.findIndex(word => word === targetWord), 1);
                    e.target.classList.remove("focus_word");
                }
            }
        })

        this.show(Object.keys(this.words));
    }

    add(word, type){
        this.words[word] = this.words[word] || { count: 0, compCount: 0 };
        this.words[word].count += type === "show" ? 1 : 0;
        this.words[word].compCount += type === "complete" ? 1 : 0;

        this.chobun[this.title] ??= {};
        this.chobun[this.title][this.mode] = { words: this.words };
        GM_setValue("chobun", JSON.stringify(this.chobun));

        this.show([word]);
    }

    show(addedWords){
        let innerHTML = Object.keys(this.words).sort((a, b) => this.words[b].count - this.words[a].count).reduce((accHTML, word) => {
            let count = this.words[word].count;
            let compCount = this.words[word].compCount;
            let compRate = (compCount / count * 100).toFixed(2);
            let isFocusWord = this.focusWords.includes(word);

            return accHTML + `<tr>
                <td title="${compRate}%">${compCount}/${count}</td>
                <td title="${word}" class="word${isFocusWord ? " focus_word" : ""}">${word}</td>
            </tr>`;
        }, "") || "<td>Let's typing!</td>";

        this.pDoc.getElementById("words").innerHTML = innerHTML;
        this.highlight(addedWords);
    }

    highlight(addedWords){
        addedWords.forEach(addedWord => {
            let target = this.wordList.querySelector(`[title="${addedWord}"]`);
            target.insertAdjacentHTML("beforeend", "<div class='highlight'></div>");
        })

        setTimeout(() => { [...this.wordList.getElementsByClassName("highlight")].forEach(e => e.remove()); }, 3000);
    }
}

class Replay {
    static scrollLine = 7;

    static init(){
        document.getElementById("btn_area").insertAdjacentHTML("beforeend",`<a id="miss_only_btn" class="btn">リプレイ</a>`);
        document.getElementById("miss_only_btn").addEventListener("click", () => Replay.load(...[Result.selected || 0, !document.getElementsByClassName("hover")[0] ? Typing.latestIndex() : [...document.getElementsByClassName("sentence")[0].children].indexOf(document.getElementsByClassName("hover")[0])].sort((a, b) => a - b), true));

        document.addEventListener("keydown", this.#handleKeydown);
        parent.document.addEventListener("keydown", this.#handleKeydown);
    }

    static load(start, end, play = true){
        this.data = Typing.dataSlice(start, end, true);

        this.sentence = document.getElementsByClassName("sentence")[0];
        this.sentences = document.querySelectorAll(".sentence span");

        this.charWidth = this.sentences[0].getBoundingClientRect().width;
        this.charHeight = this.sentences[0].getBoundingClientRect().height;
        this.lineLimit = Math.floor(this.sentence.getBoundingClientRect().width / this.charWidth);


        play && this.play(start, end);
    }

    static play(start, end){
        document.querySelector("#prev h1").textContent = "-";
        document.getElementsByClassName("result_data")[1].querySelectorAll(".data").forEach(e => e.textContent = "-");
        this.sentences.forEach((e, i) => (i < start || i > end) && (e.style = "opacity: 0.6; display: inline;"));
        this.sentences.forEach((_, i) => this.sentences[i].classList.remove("miss", "entered"));

        Result.fixed = true;
        document.getElementsByClassName("result_data")[1].classList.add("fixed");

        document.getElementById("exampleList").scrollTo({ top: this.sentences[start].offsetTop });

        this.stop = false;
        let startIndex = Typing.data.findIndex(e => e.index === start);
        let i = 0;
        let startTime = performance.now();
        this.tick(() => {
            if (!this.data?.[i] || !document.getElementsByClassName("sentence")[0]) {
                return false;
            }

            let currentTime = performance.now() - startTime;
            let charTime = this.data[i].time;

            if (currentTime >= charTime) {
                if (this.data[i].isInterrupt) {
                    return false;
                }

                let char = this.data[i].char;
                let isMiss = this.data[i].isMiss;
                let index = this.data[i].index;

                this.sentences[index].textContent = char;
                this.sentences[index].classList.add(isMiss ? "miss" : "entered");
                Result.show(startIndex, startIndex + i, false);
                i++;

                if (!isMiss && this.lineLimit * (this.scrollLine - Number(!!(start % this.lineLimit))) <= index - start && !(index % this.lineLimit)) {
                    document.getElementById("exampleList").scrollBy(0, this.charHeight);
                }
            }

            return true;
        })
    }

    static tick(callback) {
        if (this.currentTick) {
            cancelAnimationFrame(this.currentTick);
            console.log("stop");
        }

        const loop = () => {
            if (!callback() || this.stop) {
                console.log(this.stop ? "stop" : "end");
                this.data = null;
                this.currentTick = null;

                Typing.data.forEach(e => {
                    if (!e.isInterrupt) {
                        this.sentences[e.index].style = "";
                        e.isMiss && this.sentences[e.index].classList.add("miss");
                    }
                })
                return;
            }
            this.currentTick = requestAnimationFrame(loop);
        };

        this.currentTick = requestAnimationFrame(loop);
    }

    static #handleKeydown = e => {
        switch (e.key) {
            case "a":
                document.getElementById("miss_only_btn").click();
                break;
            case "Escape":
                this.stop = true;

                this.sentences && Typing.data.forEach(e => {
                    !e.isMiss && !e.isInterrupt && (this.sentences[e.index].textContent = e.char);
                    e.isMiss && this.sentences[e.index].classList.add("miss");
                    this.sentences[e.index].style = e.isInterrupt ? "opacity: 0.6; display: inline;" : "";
                    this.sentences[e.index].classList.remove("entered");
                })

                Result.selected && (Result.selected = null, document.getElementsByClassName("selected")[0]?.classList.remove("selected"));
                document.getElementsByClassName("hover")[0]?.classList.remove("hover");

                Result.fixed = false;
                document.getElementsByClassName("result_data")[1].classList.remove("fixed");
                setTimeout(() => Result.prev.innerHTML = Result.savePrev);
                break;
        }
    }

    static clear(){
        this.stop = false;
        this.data = null;
        this.sentence = null;
        this.sentences = null;

        document.removeEventListener("keydown", this.#handleKeydown);
        parent.document.removeEventListener("keydown", this.#handleKeydown);
    }
}



class Typing {
    static levelList = ["E-", "E", "E+", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S", "Good!", "Fast", "Thunder", "Ninja", "Comet", "Professor", "LaserBeam", "EddieVH", "Meijin", "Rocket", "Tatujin", "Jedi", "Godhand", "Joker", "Error"];
    static data = [];

    static score(data = this.data){
        const ms = this.data.at(-1).time;
        const typingCount = this.typingCount(data);
        const missTypeCount = this.missTypeCount(data);
        const correctRate = Math.floor(Math.max(10000 * (typingCount - missTypeCount) / typingCount, 0));
        return 60000 * (typingCount - missTypeCount) / ms * (correctRate / 10000) ** 2;
    }

    static level(score){
        return this.levelList[score < 22 ? 0 : score < 39 ? 1 : score < 56 ? 2 : score < 73 ? 3 : score < 90 ? 4 : score < 107 ? 5 : score < 124 ? 6 : score < 141 ? 7 : score < 158 ? 8 : score < 175 ? 9 : score < 192 ? 10 : score < 209 ? 11 : score < 226 ? 12 : score < 243 ? 13 : score < 260 ? 14 : score < 277 ? 15 : score < 300 ? 16 : score < 325 ? 17 : score < 350 ? 18 : score < 375 ? 19 : score < 400 ? 20 : score < 450 ? 21 : score < 500 ? 22 : score < 550 ? 23 : score < 600 ? 24 : score < 650 ? 25 : score < 700 ? 26 : score < 750 ? 27 : score < 800 ? 28 : score < 1100 ? 29 : 30];
    }

    static inputTime(data = this.data){
        const ms = data.at(-1).time;
        return (ms < 60000 ? "" : Math.floor(ms / 60000) + "分") + (ms / 1000 % 60).toFixed(2).replace(".","秒");
    }

    static typingCount(data = this.data){
        return data.filter(e => !e.isMiss && !e.isInterrupt).length;
    }

    static missTypeCount(data = this.data){
        return data.filter(e => e.isMiss && !e.isInterrupt).length;
    }

    static wpm(data = this.data){
        const ms = this.data.at(-1).time;
        const typingCount = this.typingCount(data);
        return Math.floor(typingCount * (6000000 / ms)) / 100;
    }

    static correctRate(data = this.data){
        const typingCount = this.typingCount(data);
        const missTypeCount = this.missTypeCount(data);
        return Math.floor(Math.max(10000 * (typingCount - missTypeCount) / typingCount, 0));
    }

    static latency(data = this.data){
        return data.find(e => !e.isMiss && !e.isInterrupt)?.time || NaN;
    }

    static rkpm(data = this.data){
        const ms = this.data.at(-1).time;
        const typingCount = this.typingCount(data);
        const latency = this.latency(data);
        return (typingCount - 1) / (ms - latency) * 60000 || 0;
    }

    static result(start = 0, end = this.data.length, indexBreak){
        const data = this.dataSlice(start, end, indexBreak);

        const latency = this.latency(data);
        const ms = data.at(-1).time;
        const inputTime = (ms < 60000 ? "" : Math.floor(ms / 60000) + "分") + (ms / 1000 % 60).toFixed(2).replace(".","秒");

        const typingCount = this.typingCount(data);
        const wpm = Math.floor(typingCount * (6000000 / ms)) / 100;

        const missTypeCount = this.missTypeCount(data);
        const correctRate = Math.floor(Math.max(10000 * (typingCount - missTypeCount) / typingCount, 0));
        const score = 60000 * (typingCount - missTypeCount) / ms * (correctRate / 10000) ** 2;
        const level = this.level(score);

        const rkpm = (typingCount - 1) / (ms - latency) * 60000 || 0;

        return {
            score: score,
            level: level,
            inputTime: inputTime,
            typingCount: typingCount,
            missTypeCount: missTypeCount,
            wpm: wpm,
            correctRate: correctRate,
            latency: latency,
            rkpm: rkpm
        }
    }

    static dataSlice(start, end, indexBreak){
        let data = indexBreak ? this.data.slice(this.data.findIndex(e => e.index === start), this.data.findLastIndex(e => e.index === Math.min(end, this.latestIndex())) + 1) : this.data.slice(start, end + 1);
        return start === 0 ? data : data.map(e => ({ ...e, time: e.time - this.data.findLast(e => e.index === (!indexBreak ? this.data[start].index : start) - 1).time }));
    }

    static latestIndex(){
        return this.data.at(-1).index;
    }

    static clear(){
        this.data = [];
    }
}