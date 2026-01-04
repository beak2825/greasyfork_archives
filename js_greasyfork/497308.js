// ==UserScript==
// @name         e-typing 長文拡張v2
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  途中経過リザルトなど
// @author       nora
// @license MIT
// @match        https://www.e-typing.ne.jp/app/*chobun*
// @match        https://www.e-typing.ne.jp/app/*variety.long*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497308/e-typing%20%E9%95%B7%E6%96%87%E6%8B%A1%E5%BC%B5v2.user.js
// @updateURL https://update.greasyfork.org/scripts/497308/e-typing%20%E9%95%B7%E6%96%87%E6%8B%A1%E5%BC%B5v2.meta.js
// ==/UserScript==

if (!localStorage.getItem("chobun")) localStorage.setItem("chobun","{}");

class chobun {
    constructor(title,mode){
        this.title = title; //雨の長文,源氏物語1など
        this.mode = mode; //ロマかな

        //例文リスト
        let chobunData = JSON.parse(localStorage.getItem("chobun"))[this.title]?.[this.mode];
        this.wordList = chobunData?.wordList ?? [];
        this.focusWordList = [];

        //例文リストを表示する要素を作る
        this.setElem();

        $(window).on("beforeunload",() => this.close());
        $(document).on("click","#close_btn",() => this.close());
        $(window.parent.document.getElementsByClassName("pp_close")).on("click",() => this.close());
    }

    close = function(){
        $(window.parent.document.getElementById("listHolder")).remove();

        //消す前にコード停止する
        /*$(window.parent.document.getElementById("listHolder")).animate({
            opacity: 0,
        },"fast",function(){
            $(this).remove();
        });*/

        //iframe閉じる際にワードリストを保存しておく
        let chobunData = JSON.parse(localStorage.getItem("chobun"));
        if (!chobunData[this.title]) chobunData[this.title] = {};
        chobunData[this.title][this.mode] = {
            wordList: this.wordList,
        };

        localStorage.setItem("chobun",JSON.stringify(chobunData))
    }

    setElem = function(){
        console.log(window.parent.document.getElementById("pp_full_res"));

        let top = window.parent.scrollY + 145;
        let left = window.parent.document.documentElement.clientWidth / 2 - 374; // 374 = iframeホルダーのWidth / 2

        let ptop = $(window.parent.document.getElementById("pp_full_res")).offset().top;
        let pleft = $(window.parent.document.getElementById("pp_full_res")).offset().left;

        console.log(top,left,ptop,pleft)

        window.parent.document.body.insertAdjacentHTML("afterbegin",`
            <table id="listHolder" style="top: ${top + 550}px; left: ${left + 10 + 57.5}px;">
                <tbody id="wordList"></tbody>
            </table>`);

        window.parent.document.body.insertAdjacentHTML("afterbegin",`
            <style>
                #listHolder {
                    position: absolute;
                    z-index: 15000; /* 10001 de 最前面表示 */
                    color: black;
                    padding: 5px;
                    background-color: rgba(5,127,255,.8);
                    box-shadow: 0px 0px 10px rgba(0,0,0,.5);
                    border: 2px solid #0005;
                    border-radius: 10px;
                    border-collapse: separate;
                    user-select: none;
                }

                #listHolder:hover {
                    cursor: grab;
                }

                #listHolder:active {
                    cursor: grabbing;
                }

                #wordList td {
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
                    animation: pathmove 4.4s ease-in-out infinite;
                    opacity: 0;
                    box-shadow: 0px -3px 1px 1px rgba(255,193,7,.8);
                }

                @keyframes pathmove{
                    0% {width: 0; left: 0; opacity: 0;}
                    10% {opacity: 1;}
                    30% {width: 200px;}
                    70% {left: 60%; opacity: 1;}
                    100% {width: 30px; left: 60%; opacity: 0;}
                }
            </style>`);

        //jQuery未対応
        window.parent.document.getElementById("listHolder").onpointermove = function(e){
            if(e.buttons){
                this.style.left = this.offsetLeft + e.movementX + "px";
                this.style.top = this.offsetTop + e.movementY + "px";
                this.setPointerCapture(e.pointerId);
            }
        }

        $(window.parent.document.getElementById("listHolder")).on("dblclick","td.word",e => {
            let word = $(e.target).text();
            if(!this.focusWordList.includes(word)){
                this.focusWordList.push(word);
                $(e.target).css({
                    outline: "1px solid aqua",
                    borderRadius: "10px",
                    backgroundColor: "rgba(127,255,212,.5)",
                });
            }else{
                this.focusWordList = this.focusWordList.filter(listWord => listWord != word);
                $(e.target).removeAttr("style");
            }
        });

        this.dispList(this.wordList,this.wordList.map(e => e.word));
    }

    end = function(e,missObj){
        this.missObj = missObj;

        const resultObserver = new MutationObserver(() => {
            this.add($(".example").text(),e.type);
            if (this.replayFlag) return $("#replay_btn").click();

            $("#wordList").css("width","371px"); //横方向のスクロールバーが消える幅に

            const savePrevData = $(".result_data:eq(1)").html(); //前回の結果保存
            $(".sentence").eq(0).on({
                "mouseover":e => {
                    if($(e.target).is("[data-tooltip]")){
                        this.progResult(e);
                    }
                },
                "mouseleave":e => {
                    if (e.relatedTarget?.closest(".time-tooltip")?.className == "time-tooltip") return;
                    $(".result_data:eq(1) > ul").replaceWith(savePrevData);
                }
            })
            resultObserver.disconnect();
        })
        resultObserver.observe(document.getElementById("result"),{childList:true});
    }

    progResult = (e) => {
        let scoreElem = $(".data:eq(9)");
        let inputTimeElem = $(".data:eq(11)");
        let typingCountElem = $(".data:eq(12)");
        let missTypeCountElem = $(".data:eq(13)");
        let wpmElem = $(".data:eq(14)");
        let correctRateElem = $(".data:eq(15)");
        let rkpmElem = $(".data:eq(17)");

        $(".data:gt(8)").text("-"); //前回の結果消去
        let typingCount = $("[data-tooltip]").index(e.target) + 1;
        let time = $("[data-tooltip]:lt(" + typingCount + ")").get().reduce((time,e) => time + parseFloat($(e).attr("data-tooltip")),0);

        let miss = Object.values(this.missObj)[$(e.target).prevAll().addBack().filter(".miss").length - 1] ?? 0;
        let acc = Math.max((typingCount - miss) / typingCount * 100,0);
        let wpm = (typingCount / time) * 60;
        let score = wpm * (acc / 100) ** 3;
        let inputTime = (time < 60 ? "" : parseInt(time / 60) + "分") + String((time % 60).toFixed(2)).replace(".","秒");
        let rkpm = ((typingCount - 1) / (time - $(".data:eq(7)").text()) * 60) || 0;

        scoreElem.text(score.toFixed(2));
        inputTimeElem.text(inputTime);
        typingCountElem.text(typingCount);
        missTypeCountElem.text(miss);
        wpmElem.text(wpm.toFixed(2));
        correctRateElem.text(acc.toFixed(2) + "%");
        rkpmElem.text(rkpm.toFixed(2));
    }

    //wordListに追加する処理
    add = function(word,eventType){
        let elem = this.wordList.find(e => e.word == word);
        if(elem){
            elem.count++;
            elem.compCount = eventType == "interrupt" ? elem.compCount : elem.compCount + 1;
        }else{
            this.wordList.push({
                word: word,
                count: 1,
                compCount: eventType == "interrupt" ? 0 : 1
            })
        };

        this.wordList.sort((a,b) => b.count - a.count);
        this.dispList(this.wordList,[word]);
    };

    //親ウィンドウにwordListを表示する
    dispList = function(list,addedWords){
        let HTML = list.reduce((HTML,e) => {
            let completeRate = (e.compCount / e.count * 100).toFixed(2);
            let focusWordStyle = this.focusWordList.includes(e.word) ? "style='outline: 1px solid aqua; border-radius: 10px; background-color: rgba(127,255,212,.5);'" : "";

            return HTML + `<tr>
                        <td title="${completeRate}%">${e.compCount}/${e.count}</td>
                        <td title="${e.word}" class="word" colspan="2" ${focusWordStyle}>${e.word}</td>
                    </tr>`
        },"");

        window.parent.document.getElementById("wordList").innerHTML = HTML;
        this.highlight(addedWords);
    }

    highlight = function(addedWords){
        addedWords.forEach(addedWord => {
            let elem = window.parent.document.querySelector(`[title="${addedWord}"]`);
            let highlight = $("<div class='highlight'></div>").css("top",$(elem).height() + "px");
            $(elem).append(highlight);

            setTimeout(() => {
                highlight.remove();
            },4400);
        })
    }
}

const isChobun = [ //@matchで処理中
    () => location.href.match(/chobun|variety.long/),
    () => $(".title").text().includes("長文"),
]

const startObserver = new MutationObserver(mutation => {
    if(mutation[0].addedNodes[0].id == "start_view"){
        // if(isChobun.some(calc => calc())){
            let title = $(".title").text();
            let mode = window.parent.document.title.match("ローマ字") ? "R" : "K";
            let c = new chobun(title,mode);
            window.parent.c = c;

            (function repeat(){
                let miss = 0;
                let missObj = {};
                $(document).on("end_countdown.etyping",() => {
                    setTimeout(()=>{
                        if (!c.focusWordList.length || c.focusWordList.includes($("#exampleText").text())){
                            c.replayFlag = false;
                        }else{
                            document.dispatchEvent(new KeyboardEvent("keydown",{keyCode:27}));
                            c.replayFlag = true;
                        }
                    })

                    $(document).off("replay");
                    $(document).on({
                        "error.etyping":() => {
                            let entered = $(".entered:eq(2)").text() || $(".entered:eq(1)").text(); //ロマ = eq(2), かな = eq(1)
                            let missTypeIndex = $("#sentenceText").text().lastIndexOf($("#sentenceText").text().replace(entered,""));
                            miss++;
                            missObj[missTypeIndex] = miss;
                        },
                        "interrupt.etyping complete.etyping":(event) => {
                            setTimeout(() => c.end(event,missObj));
                        },
                        "replay":() => {
                            $(document).off("end_countdown.etyping");
                            repeat();
                        }
                    })
                })
            })()
            startObserver.disconnect();
        // }
    }
})
startObserver.observe(document.getElementById("app"),{childList:true})