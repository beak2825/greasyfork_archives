// ==UserScript==
// @name         nihongo_dict
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  毎日日本語を勉強しましょう
// @author       Ch4p1
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tv-asahi.co.jp
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @grant           GM_getResourceText
// @grant      GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @resource IMPORTED_CSS https://li1862-245.members.linode.com/audio/audio/tampermonkey.css
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/457552/nihongo_dict.user.js
// @updateURL https://update.greasyfork.org/scripts/457552/nihongo_dict.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    var player;
    var t = 0;
    var speed = 1;
    var touchL = false;
    var loopT = [];
    //next page
    const splitArr = window.location.href.split(/[\/,.=?]+/);
    var lastNumber = splitArr.findLast(v => parseInt(v) > 0);
    const selInd = window.location.href.lastIndexOf(lastNumber);
    //init ui
    let menu = document.createElement("div");
    menu.classList = "menu";
    let menuBtns = document.createElement("div");
    menuBtns.classList = "btns";
    menu.appendChild(menuBtns);
    createBtn('ㄆ', () => { oepnHelp() });
    createBtn('X', (e) => { e.target.parentElement.remove() });
    document.body.appendChild(menu);

    //get serifu
    var gotSerifu = false;
    //get serifu for kktv
    var serifuArr = {};
    if (window.location.hostname == "kktv.me" || window.location.hostname == "www.kktv.me") {
        XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (value) {
            this.addEventListener("progress", function (e) {
                //zh-Hant.vtt ja.vtt
                var filename = e.target.responseURL.split('/').pop()
                if (filename == "zh-Hant.vtt" || filename == "ja.vtt") {
                    var matchArr = e.target.response.match(/\d+:\d+:\d+.\d+ --> \d+:\d+:\d+.\d+\n.+/gm, "");
                    matchArr.map(v => {
                        var tarr = v.split("-->");
                        var serifu = tarr[1].split("\n");
                        if (filename == "ja.vtt") {
                            if (!serifuArr[tarr[0].trim()]) serifuArr[tarr[0].trim()] = {}
                            serifuArr[tarr[0].trim()].endT = serifu[0].trim();
                            serifuArr[tarr[0].trim()].jp = serifu[1].trim();
                        }
                        else {
                            if (!serifuArr[tarr[0].trim()]) serifuArr[tarr[0].trim()] = {}
                            serifuArr[tarr[0].trim()].endT = serifu[0].trim();
                            serifuArr[tarr[0].trim()].tw = serifu[1].trim();
                        }
                    });
                    if (gotSerifu == false) {
                        tempAlert("字幕loading...", 2000);
                        createBtn('字幕', () => { copyKktv() });
                        gotSerifu = true;
                    }
                }

            }, false);
            this.realSend(value);
        };
    }
    /* function time2sec(s) {
        const sec = s.split(":").reduce((a, c, ind) => {
            var s = 1;
            if (ind == 0) s = 3600;
            else if (ind == 1) s = 60;
            return a + (parseFloat(c) * s)
        }, 0);
        return sec;
    }
    var responseTextArr = {};
    var temp_serifuArr = [];
    if (window.location.hostname == "www.netflix.com") {
        XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (value) {
            this.addEventListener("progress", function (e) {
                //1 下載字幕 區分出中日
                try {
                    if ( e.target.responseText.substring(0, 6) == "WEBVTT") {
                        var lang = e.target.responseText.includes("c.japanese") ? "jp" : "tw";
                        console.log(">>>>",lang)
                        responseTextArr[lang] = e.target.responseText;
                        if (responseTextArr.jp && responseTextArr.tw) {
                            //process jp
                            var matchArr = responseTextArr.jp.match(/\d+:.+\n.+/gm, "");
                            matchArr.map(v => {
                                var teimArr = v.match(/\d+:\d+:\d+.\d+/gm, "");
                                var serifu = v.match(/(?<=bg_transparent>)(.+)(?=<\/c.bg)/gm);
                                if (serifu && serifu.length > 0)
                                    temp_serifuArr.push({ start: time2sec(teimArr[0]), end: time2sec(teimArr[1]), jp: serifu[0].trim(), tw: "" })
                                else
                                    console.log("~~~~~~~~~~", serifu, v);
                            });
                            console.log("~~~~")
                            //process tw
                            matchArr = responseTextArr.tw.match(/\d+:.+\n.+/gm, "");
                            matchArr.map(v => {
                                var teimArr = v.match(/\d+:\d+:\d+.\d+/gm, "");
                                var serifu = v.match(/(?<=bg_transparent>)(.+)(?=<\/c.bg)/gm);
                                if (serifu && serifu.length > 0) {
                                    var startSec = time2sec(teimArr[0]);
                                    var findObj = temp_serifuArr.find(vv => (startSec >= vv.start && startSec <= vv.end));
                                    if (findObj) {
                                        findObj.tw += serifu[0].trim();
                                    }
                                }
                                else {
                                    console.log("~~~~~~~~~~", serifu, v);
                                }
                            });
                            console.log("---------", temp_serifuArr);
                            tempAlert("字幕loading...", 2000);
                            createBtn('字幕', () => { copyKktv() });
                            gotSerifu = true;
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }, false);
            this.realSend(value);
        };
    } */
    if (window.location.hostname == "ncode.syosetu.com") {
        var matchArr = document.querySelector(".novel_view").innerText.match(/.+\n/gm, "");

        if (matchArr.length > 0) {
            matchArr.map((v, k) => {
                serifuArr["f_" + k] = { jp: v.trim() };
            });
            tempAlert("字幕loading...", 2000);
            createBtn('字幕', () => { copyKktv() });
            gotSerifu = true;
        }
    }

    function getPlayer() {
        return document.querySelector("video") ? document.querySelector("video") : document.querySelector("audio");
    }

    setInterval(() => {
        if (!player) {
            player = getPlayer();
            if (player && (window.location.hostname == "kktv.me" || window.location.hostname == "www.kktv.me")) {
                const observer = new MutationObserver(function (mutations) {
                    const targetDiv = document.querySelector(".main-subtitle");
                    if (targetDiv) {
                        targetDiv.style.userSelect = "text";
                    }
                });
                const div = document.querySelector(".kktv-player");
                observer.observe(div, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                });
            }
        }
        if (loopT.length == 2 && player.currentTime > loopT[1]) {
            player.currentTime = loopT[0];
            player.play();
        }
    }, 200);



    function createBtn(title, fn) {
        let btn = document.createElement("div");
        btn.classList = "menuBtn";
        btn.innerHTML = title;
        btn.onclick = fn
        menuBtns.appendChild(btn);
    }
    var hotkeyList = [
        { cmd: "mediaPlayStart", hotkey: "O", tip: "標記影片返回點" },
        { cmd: "mediaPlayEnd", hotkey: "P", tip: "按住回到O點並播放，放開停止" },
        { cmd: "mediaPause", hotkey: "SPACE", tip: "暫/播放" },
        { cmd: "mediaSetLoop", hotkey: "Q", tip: "設定循環播放範圍，連按2次清除" },
        { cmd: "mediaRepaet", hotkey: "‰", tip: "設定repeat" },
        { cmd: "nihongoHira", hotkey: "⁄", tip: "日文單字(若找的)顯示拼音" },
        { cmd: "nihongoDict", hotkey: "€", tip: "中日字典" },
        { cmd: "nihongoSakura", hotkey: "‹", tip: "日日字典sakura" },
        { cmd: "nihongoGoo", hotkey: "Í", tip: "日日字典goo" },
        { cmd: "nihongoSpeak", hotkey: "Å", tip: "日文發音" },
        { cmd: "enTranslate", hotkey: "Œ", tip: "英文字典google" },
        { cmd: "google", hotkey: "¸", tip: "google" },
        { cmd: "nextPage", hotkey: "˘", tip: "下一頁" },
        { cmd: "prevPage", hotkey: "¯", tip: "上一頁" },
        { cmd: "comm", hotkey: "-", tip: "↑↓速度←→前後" },
    ];
    hotkeyList.map(v => {
        const _key = GM_getValue(v.cmd);
        if (_key && _key != "")
            v.hotkey = _key;
    });

    function createInfo(obj) {
        let div = document.createElement("div");
        let hotkey = document.createElement("input");
        let tip = document.createElement("span");
        div.classList = "memo";
        if (obj.cmd != "comm") {
            hotkey.type = "text";
            hotkey.maxLength = "1";
            hotkey.value = obj.hotkey;
            hotkey.style = "width: 18px;";
            hotkey.onkeyup = (e) => {
                console.log("e.target.value", e.target.value, obj);
                obj.hotkey = e.target.value;
                GM_setValue(obj.cmd, obj.hotkey);
            };
            div.appendChild(hotkey);
        }
        tip.innerHTML = obj.tip;
        div.appendChild(tip);
        return div;
    }
    function tempAlert(msg, duration) {
        document.querySelectorAll(".tempAlert").forEach(el => {
            el.style.bottom = (parseInt(el.style.bottom) + 24) + "px";
        });
        var el = document.createElement("div");
        el.className = "tempAlert";
        el.setAttribute("style", "position:absolute;bottom:5px;left:1%;padding: 0 1rem;background-color:black;color: white;font-size: 20px;");
        el.innerHTML = msg;
        setTimeout(function () {
            el.parentNode.removeChild(el);
        }, duration);
        document.body.appendChild(el);
    }
    function copyKktv() {
        try {
            document.querySelector(".modalxx").remove();
        }
        catch (e) {
            /* var data = [];
            document.querySelectorAll(".kktv-player>div>:nth-child(2)>:nth-child(2)>button").forEach(button => {
                const divs = button.querySelectorAll("div");
                data.push({ id: button.id, jp: divs[0].innerText, tw: divs[1].innerText });
            }); */
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
            fetch('https://li1862-245.members.linode.com:3006/serifu', {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ str: serifuArr })
            })
                .then((response) => {
                    return response.json();
                }).then((ret) => {
                    let canvas = document.createElement("div");
                    canvas.classList = "modalxx";
                    let img = document.createElement("img");
                    img.src = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=https://li1862-245.members.linode.com/kktvreader/build/?key=' + ret.key + '&choe=UTF-8';
                    img.onclick = (e) => {
                        window.open(
                            'https://li1862-245.members.linode.com/kktvreader/build/?key=' + ret.key, "_blank");
                    }
                    img.target = "_blank";
                    canvas.appendChild(img);
                    menu.appendChild(canvas);
                }).catch((err) => {
                    console.log('錯誤:', err);
                });
        }
    }
    function oepnHelp() {
        try {
            document.querySelector(".modalxx").remove();
        }
        catch (e) {
            let canvas = document.createElement("div");
            canvas.classList = "modalxx";
            hotkeyList.map(v => {
                canvas.appendChild(createInfo(v));
            });
            menu.appendChild(canvas);
        }
    }
    function addLoop() {
        if (loopT.length === 1) {
            loopT.push(player.currentTime);
            tempAlert("add loop end", 2000);
        }
        else if (loopT.length === 0) {
            loopT.push(player.currentTime);
            tempAlert("add loop start", 2000);
        }
    }
    function isRepeatKey(event) {
        return (event.key == lastKey.key && (performance.now() - lastKey.t) < 1000)
    }
    function clearAllLoop() {
        loopT = [];
    }
    function padLeft(str, len) {
        str = '' + str;
        if (str.length >= len) {
            return str;
        } else {
            return padLeft("0" + str, len);
        }
    }
    var lastKey = { key: "", t: 0 };

    document.body.addEventListener("keyup", function (event) {
        const hotkeyObj = hotkeyList.find(v => { return v.hotkey.toLowerCase() == event.key.toLowerCase() });
        if (player) {
            if (hotkeyObj.cmd === "mediaPlayEnd") {//L roolback
                console.log("keyup mediaPlayEnd")
                touchL = false;
                player.pause();
            }
        }
    });

    document.body.addEventListener("keydown", function (event) {
        var selectTxt = "";
        const hotkeyObj = hotkeyList.find(v => { return v.hotkey.toLowerCase() == event.key.toLowerCase() });
        if (player) {
            if (hotkeyObj.cmd === "mediaPlayEnd" && touchL == false) {//L roolback
                console.log("mediaPlayStart")
                touchL = true;
                player.currentTime = t;
                player.play();
            }
            else if ((hotkeyObj.cmd === "mediaPlayStart")) {//k set point
                if (isRepeatKey(event)) {
                    t -= 0.5;
                    player.currentTime = t;
                    player.play();
                }
                else {
                    t = player.currentTime;
                }
            }
            else if (hotkeyObj.cmd === "mediaSetLoop") {
                if (isRepeatKey(event)) {
                    clearAllLoop();
                    tempAlert("clear loop", 2000);
                }
                else {
                    addLoop();
                }
            }
            else if (hotkeyObj.cmd === "mediaRepaet") {//L roolback
                player.loop = !player.loop;
                tempAlert("repeat " + player.loop, 2000);
            }
            else if (event.key === "ArrowRight") {//back
                player.currentTime += 1;
            }
            else if (event.key === "ArrowLeft") {//font
                player.currentTime -= 1;
            }
            else if (event.key === "ArrowUp") {//up speed up
                speed += 0.1;
                if (speed >= 1) {
                    speed = 1;
                }
                player.playbackRate = speed;
            }
            else if (event.key === "ArrowDown") {//down speed down
                speed -= 0.1;
                if (speed <= 0.1) {
                    speed = 0.1;
                }
                player.playbackRate = speed;
            }
        }
        if (hotkeyObj.cmd === "nihongoHira") {
            //日文拼音
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            GM.xmlHttpRequest({
                method: "GET",
                url: "https://dict.asia/jc/" + selectTxt.toString(),
                headers: {
                    "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
                    "Accept": "text/xml"            // If not specified, browser defaults will be used.
                },
                onload: function (ret) {
                    console.log(ret);
                    let parser = new DOMParser();
                    const document = parser.parseFromString(ret.responseText, "text/html");
                    var kijis = document.querySelectorAll("#jp_comment");
                    if (kijis != null && kijis.length > 0) {
                        const kiji = kijis[0];
                        var kana = kiji.querySelector(".trs_jp");
                        var kanaStr = "";
                        if (kana != null) {
                            kanaStr = kana.textContent.replaceAll(/【|】/g, '');
                            selectTxt.anchorNode.parentElement.innerHTML = selectTxt.anchorNode.parentElement.innerHTML.replaceAll(selectTxt.toString(), "<ruby>" + selectTxt.toString() + "<rt>" + kanaStr + "</rt></ruby>")
                        }
                    }
                    else {
                        tempAlert("can't find", 2000);
                    }
                }
            });
        }
        else if (hotkeyObj.cmd === "nihongoDict") {
            //日文字典 2
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            window.open(
                "https://dict.asia/jc/" + selectTxt.toString(), "_blank");
        }
        else if (hotkeyObj.cmd === "nihongoSakura") {
            //日文字典 3
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            window.open(
                "https://sakura-paris.org/dict/%E5%BA%83%E8%BE%9E%E8%8B%91/prefix/" + selectTxt.toString(), "_blank");
        }
        else if (hotkeyObj.cmd === "nihongoGoo") {
            //日文字典goo找前面一致 s
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            window.open(
                "https://dictionary.goo.ne.jp/srch/jn/" + selectTxt.toString() + "/m0u/", "_blank");
        }
        else if (hotkeyObj.cmd === "nihongoSpeak") {
            //發音 a
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            window.open(
                "https://ja.forvo.com/word/" + selectTxt.toString() + "/#ja", "_blank");
        }
        else if (hotkeyObj.cmd === "enTranslate") {
            //google translate q
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            window.open(
                "https://translate.google.com.tw/?hl=zh-TW&tab=rT&sl=en&tl=zh-TW&text=" + selectTxt.toString() + "&op=translate", "_blank");
        }
        else if (hotkeyObj.cmd === "google") {
            //google Z
            if (window.getSelection) {
                selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            window.open(
                "https://www.google.com/search?q=" + selectTxt.toString(), "_blank");
        }
        else if (hotkeyObj.cmd === "nextPage") {
            //next page >

            lastNumber = padLeft(Number(lastNumber) + 1, lastNumber.length);
            window.location.href = window.location.href.substring(0, selInd) + lastNumber + window.location.href.substring(selInd + lastNumber.length);
        }
        else if (hotkeyObj.cmd === "prevPage") {
            //prev page >
            lastNumber = padLeft(Number(lastNumber) - 1, lastNumber.length);
            window.location.href = window.location.href.substring(0, selInd) + lastNumber + window.location.href.substring(selInd + lastNumber.length);
        }
        lastKey = { key: event.key, t: performance.now() };
    });
})();
