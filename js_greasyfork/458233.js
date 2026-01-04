// ==UserScript==
// @name         儿子群词条提取器
// @namespace    https://xypp.cc/wordPicker/
// @version      1.3.2
// @description  儿子群词条提取器脚本
// @author       小鱼飘飘
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      xypp.cc
// @downloadURL https://update.greasyfork.org/scripts/458233/%E5%84%BF%E5%AD%90%E7%BE%A4%E8%AF%8D%E6%9D%A1%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458233/%E5%84%BF%E5%AD%90%E7%BE%A4%E8%AF%8D%E6%9D%A1%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==
var btnID = 1;
var word2id = {};
var btnIds = {};
var words = [];
var wordMp = {};
function generateShortName(txt) {
    tl = [];
    let eng = false, chi = false, brk = false;
    txt.split(/[\s-\\/!！？\?:：（）。.·☆★~～]/).forEach((t) => {
        if (/^.*?[章篇话季传版]$/.test(t)) return;
        if (t == "电影") return;
        if (brk) return
        if (/[a-zA-Z0-9]/.test(t)) {
            if (chi) return brk = true;
            else eng = true;
        } else {
            brk = true;
            if (eng) return;
            else chi = true;

        }
        tl.push(t);
    })
    // txt = ((/^(.*?)(.*?[章篇话季传版][\s$])/g.exec(txt) || [])[1]) || txt;
    txt = tl.join('');
    return txt;
}
function openPickWindow(Event) {
    let iid = Event.currentTarget.getAttribute("data-txtid");

    let currentWordLists = [];
    if (wordMp[btnIds[iid].short]) {
        currentWordLists = wordMp[btnIds[iid].short];
    }

    let el = document.createElement("div");
    el.id = "wo-input-contain";
    el.setAttribute("style", `
position:fixed;
top:50px;
left:100px;
right:100px;
background-color:black;
border:1px solid white;
border-radius:5px;
bottom:200px;
z-index:100000;
color:white;
padding:50px;
text-align:center;
line-height:30px;
    `);
    el.innerHTML = `
    <style scoped>
    input {
        display: inline-block;
        width:calc(100% - 70px);
        outline: 0;
        border: 0;
        border-radius: 5px;
        color: black;
        background-color: rgba(255, 255, 255, 0.772);
    }

    input:active {
        box-shadow: skyblue 0 0 5px 3px
    }

    input:focus {
        box-shadow: skyblue 0 0 3px 1px
    }

    input.i {
        height: 30px;
        width: 300px;
        max-width: 100%;
    }
    button {
            color: black;
            background-color: #fff;
            border-radius: 30px;
            padding: 5px 10px;
            margin-right: 10px;
            box-shadow: grey 1px 1px 1px;
            text-align: center;
            display: inline-block;
            vertical-align: middle
        }

        button:hover {
            background-color: #dcdcdc
        }

        button:active {
            box-shadow: inset gray 1px 1px 1px
        }
</style><b>识别短名</b><br>
<small>一般无需更改，用于自动归类</small><br>
<input type="text" value="" id="wo-input-oword"><br>
<b>词条名字</b><br>
<small>词条本名，一般为作品题目或人物名。建议适当缩短字数且通俗易懂的通用翻译名字</small><br>
<input type="text" value="" id="wo-input-word"><br>
<br>
<button id="wo-input-submit">提交</button>
<button id="wo-input-close">关闭</button>
<br>
<br>
<b>已添加的词条：</b>
${currentWordLists.join("，")}
    `
    document.body.appendChild(el);

    document.getElementById("wo-input-submit").onclick = submitWord;
    document.getElementById("wo-input-close").onclick = closePickWindow;
    document.getElementById("wo-input-oword").value = btnIds[iid].short;
    document.getElementById("wo-input-word").value = btnIds[iid].short;
}
function closePickWindow() {
    document.body.removeChild(document.getElementById("wo-input-contain"));
}
function submitWord() {
    let oword = document.getElementById("wo-input-oword").value;
    let word = document.getElementById("wo-input-word").value
    GM_xmlhttpRequest({
        url: "https://xypp.cc/wordPicker?api=add&word=" + word + " & oword=" + oword,
        method: "GET",
        onload: function (xhr) {
            closePickWindow();
            var data = JSON.parse(xhr.responseText);
            alert(data.msg);
        }
    });
}
function createBtn(elem) {
    let iid = "wordPicker_btn" + btnID++, txt = elem.innerText;
    if (elem === mouseTrackEl) iid = 0;
    btnIds[iid] = { text: txt, short: generateShortName(txt) };

    if (!word2id[btnIds[iid].short]) word2id[btnIds[iid].short] = [];
    word2id[btnIds[iid].short].push(iid);
    words.push(btnIds[iid].short);


    btn = `<a id="${iid}" href="#" style="
    font-size: 15px;
    font-weight: normal;
    text-decoration: underline;
    color: white;
    background: gray;
    border-radius: 50px;
    padding: 3px 12px;
">${btnIds[iid].short}[Loading]</a>`;
    elem.innerHTML += btn;
    document.getElementById(iid).setAttribute("data-txtid", iid);
    document.getElementById(iid).onclick = openPickWindow;
    btnIds[iid].elem = document.getElementById(iid);
}
function judgeLegal(txt) {
    if (document.title.includes(txt)) {
        return true;
    }
    return false;
}
var mouseTrackEl = null;
function scanWindow() {
    const elNames = ["h1", "h2", "h3", ".media-right .media-title",".media-info-title .media-info-title-t"];
    elNames.forEach(function (n) {
        document.querySelectorAll(n).forEach(function (el) {
            if (judgeLegal(el.innerText)) {
                createBtn(el);
            }
        });
    });
    mouseTrackEl = document.createElement("div");
    mouseTrackEl.style.position = "fixed";
    mouseTrackEl.style.left = "0";
    mouseTrackEl.style.top = "0";
    mouseTrackEl.style.display = "none";
    mouseTrackEl.style.zIndex = "1000000";
    mouseTrackEl.id = "wordPicker_btn0";
    document.body.appendChild(mouseTrackEl);
    getData();

    setInterval(() => {
        if (!mouseTrackEl) return;
        var select = document.getSelection().toString();
        if (select != "") {
            if (oSelect == select) {
                if (createdSelect != select) {
                    mouseTrackEl.style.display = "block";
                    mouseTrackEl.style.left = window.mouse;
                    mouseTrackEl.innerText = select;
                    createBtn(mouseTrackEl);
                    getDataSingle(btnIds[0].short);
                }
                createdSelect = select;
            } else {
                createdSelect = "";
                mouseTrackEl.style.display = "none";
                mouseTrackEl.innerHTML = "";
            }
        } else {
            createdSelect = "";
            mouseTrackEl.style.display = "none";
            mouseTrackEl.innerHTML = "";
        }
        oSelect = select;
    }, 1000);
}
function getData() {
    GM_xmlhttpRequest({
        url: "https://xypp.cc/wordPicker?api=select&word=" + words.join("|"),
        method: "GET",
        onload: function (xhr) {
            var data = JSON.parse(xhr.responseText);
            wordMp = {};
            data.forEach(function ({ oword, word }) {
                if (!wordMp[oword]) {
                    wordMp[oword] = [];
                }
                wordMp[oword].push(word);
            });
            for (let k in wordMp) {
                (word2id[k] || []).forEach(function (id) {
                    btnIds[id].elem.innerText = btnIds[id].short + "[" + wordMp[k].length + "]"
                });
            }
            words.forEach(function (wo) {
                if (!wordMp[wo]) {
                    (word2id[wo] || []).forEach(function (id) {
                        btnIds[id].elem.innerText = btnIds[id].short + "[0]"
                    })
                }
            });
        }
    });
}
function getDataSingle(toGetWord) {
    GM_xmlhttpRequest({
        url: "https://xypp.cc/wordPicker?api=select&word=" + toGetWord,
        method: "GET",
        onload: function (xhr) {
            var data = JSON.parse(xhr.responseText);
            wordMp = wordMp || {};
            wordMp[toGetWord] = [];
            data.forEach(function ({ oword, word }) {
                if (!wordMp[oword]) {
                    wordMp[oword] = [];
                }
                wordMp[oword].push(word);
            });
            for (let k in wordMp) {
                (word2id[k] || []).forEach(function (id) {
                    btnIds[id].elem.innerText = btnIds[id].short + "[" + wordMp[k].length + "]"
                });
            }
            words.forEach(function (wo) {
                if (!wordMp[wo]) {
                    (word2id[wo] || []).forEach(function (id) {
                        btnIds[id].elem.innerText = btnIds[id].short + "[0]"
                    })
                }
            });
        }
    });
}
var oSelect = "", createdSelect = "";

setTimeout(() => {
    var judgeKeyW = document.title;
    let metas = document.getElementsByTagName("meta");
    for (let i = 0; i < metas.length; i++) {
        judgeKeyW += (metas[i].getAttribute("content") || "") + "|";
    }
    if (judgeKeyW.includes("動漫") || judgeKeyW.includes("动漫") || judgeKeyW.includes("视频") || judgeKeyW.includes("播放")
        || judgeKeyW.includes("观看") || judgeKeyW.includes("ACG") || judgeKeyW.includes("番组")
    ) scanWindow();
}, 2000);