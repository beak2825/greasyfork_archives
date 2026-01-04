// ==UserScript==
// @name         nicommentDanime
// @namespace    http://tampermonkey.net/
// @version      2025-01-29
// @description  dアニメでニコニコのコメントを流す
// @author       y_kahou
// @match        https://www.nicovideo.jp/watch/*
// @match        https://animestore.docomo.ne.jp/animestore/sc_d_pc*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460377/nicommentDanime.user.js
// @updateURL https://update.greasyfork.org/scripts/460377/nicommentDanime.meta.js
// ==/UserScript==

const OPTIONS = {
    // コメントの行数
    lineNum: 14,

    // コメントの1行の高さ
    // (1.0が1文字分の高さ)
    // (1.0より大きくすることで行間を開けることができます)
    lineHeight: 1.4,

    // コメントの流れる時間(ミリ秒)
    duration: 5000,

    // コメントの色設定
    // (CSSのcolor書式)
    color: "#fff",

    // コメントの太さ設定
    // (CSSのfont-weight書式)
    fontWeight: "bold",

    // コメントのフォント
    // (CSSのfont-family書式)
    fontFamily: `"Helvetica Neue", "メイリオ", Meiryo, Helvetica, Arial, sans-serif`,

    // コメントのドロップシャドウ
    // (CSSのtext-shadow書式)
    textShadow: `
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000,
        0 0 0.1em #000
    `,

    // 透明度
    // (0.0-1.0で指定します。0.0に近いほど透明になります)
    // (CSSのopacity書式)
    // 移植用にあるだけで使ってない
    opacity: 0.6,

    // 表示する文字数制限
    // (超えた場合「…」で省略されます)
    lengthLimit: 60,

    // 表示形式指定
    // ($NAME$が名前、$COMMENT$がコメントに置き換えられます)
    format: "$COMMENT$",

    // コメジェネのcomment.xmlへのパス
    // 相対パスで指定してください
    path: "../comment.xml",

    // comment.xmlの読み込み間隔(ミリ秒)
    loadInterval: 500,
};


const nicommentDstyle = `
*, *::before, *::after {
    margin: 0;
    padding: 0;
    border: 0;
}

html, body {
    width: 100%;
    height: 100%;
    background: transparent;
    overflow: hidden;
}

:root {
    --cLineHeight: 1.4;
    --cDuration: 5000ms;
    --cColor: #fff;
    --cFontSize: 7.14vh;
    --cFontWeight: bold;
    --cFontFamily: "Helvetica Neue", "メイリオ", Meiryo, Helvetica, Arial, sans-serif;
    --cTextShadow:
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000,
        0 0 5px #000
    ;
    --cLengthLimit: 31em;
}

.wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 150;
    pointer-events: none;
}

.line {
    position: relative;
    color: var(--cColor);
    line-height: var(--cLineHeight);
    font-size: var(--cFontSize);
    font-weight: var(--cFontWeight);
    font-family: var(--cFontFamily);
}
.line::before {
    content: "ダミーDummy";
    color: transparent;
    text-shadow: none;
}


.comment {
    position: absolute;
    max-width: var(--cLengthLimit);
    overflow: hidden;
    top: 0;
    padding: 0 var(--cFontSize);
    text-overflow: ellipsis;
    text-shadow: var(--cTextShadow);
    white-space: nowrap;
    animation: var(--cDuration) commentAnimation linear forwards;
}
.comment.pause {
    animation-play-state: paused
}

.line.dummy {
    position: fixed;
    top: 0;
    left: 0;
}
.line.dummy .comment {
    visibility: hidden;
    opacity: 0;
    animation: none;
}

@keyframes commentAnimation {
    0% {
        left: 100%;
        transform: translateX(0%);
    }
    100% {
        left: 0%;
        transform: translateX(-100%);
    }
}

body:not(.nicoruoff) .comment::before {
    position: absolute;
    left: calc(var(--cFontSize) /2);
    width: calc(100% - var(--cFontSize));
    height: 100%;
    z-index: -1;
    content: '';
}
.comment.nicoru1::before { background: #fefbec; }
.comment.nicoru2::before { background: #fef5cf; }
.comment.nicoru3::before { background: #fdeba0; }
.comment.nicoru4::before { background: #fcd842; }

#nicommentCaption .caption {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 200px;
}
#commentButton svg {
    fill: white;
    width: 28px;
    margin-top: 5px;
}
.toggleButton.on .on,
.toggleButton.on .off,
.toggleButton.on::after {
    transform: none!important;
}
`


class CommentData {
    constructor(text, name, time, service) {
        this._text = text;
        this._name = name;
        this._time = time;
        this._service = service;
    }
    get text() {
        return this._text;
    }
    get name() {
        return this._name;
    }
    get time() {
        return this._time;
    }
    get service() {
        return this._service;
    }

    isSame(commentData) {
        return (
            commentData.text == this.text
            && commentData.name == this.name
            && commentData.time == this.time
            && commentData.service == this._service
        )
    }
}
class Comment {
    constructor(commentData, format) {
        this._$elm = document.createElement("p");
        this._$elm.className = "comment";

        if (commentData.name) {
            this._$elm.className += ' nicoru' + commentData.name;
        }

        this._commentData = commentData;
        this._format = format;
        this.text = this.generateFormattedComment(this.data, this.format);
    }
    get $elm() {
        return this._$elm;
    }
    get data() {
        return this._commentData;
    }
    get format() {
        return this._format;
    }
    set format(format) {
        this._format = format;
        this.text = this.generateFormattedComment(this.data, this.format);
    }
    get text() {
        return this._text;
    }
    set text(text) {
        this._text = text;
        this.$elm.innerText = text;
    }

    generateFormattedComment(commentData, format) {
        let res = format;
        res = res.replace(/\$NAME\$/g, commentData.name);
        res = res.replace(/\$COMMENT\$/g, commentData.text);
        return res;
    }
}
class DisplayLine {
    constructor() {
        this._$elm = document.createElement("li");
        this._$elm.className = "line";

        this._comments = [];

        this._listeners = {
            passed: []
        };
    }
    get $elm() {
        return this._$elm;
    }

    on(eventName, cb) {
        if (!this._listeners.hasOwnProperty(eventName)) {
            this._listeners[eventName] = [cb];
        } else {
            this._listeners[eventName].push(cb);
        }
    }
    off(eventName, cb) {
        if (!this._listeners[eventName]) return false;
        if (cb) {
            const i = this._listeners[eventName].indexOf(cb);
            if (i < 0) return false;
            this._listeners[eventName].splice(i, 1);
        } else {
            delete this._listeners[eventName];
        }
        return true;
    }
    emit(eventName, ...args) {
        if (!this._listeners[eventName]) return false;
        this._listeners[eventName].forEach(cb => cb(...args));
    }

    // 混雑状況(流れ切っていない長さが返される。0が最低)
    congestionValue() {
        let val = 0;
        let width = this.$elm.clientWidth;
        this._comments.forEach(comment => {
            let cLeft = comment.$elm.offsetLeft;
            let cWidth = comment.$elm.clientWidth;
            let _val = cLeft + cWidth - width;
            if (_val > val) {
                val = _val;
            }
        });
        return Math.max(val, 0);
    }

    // 渡された横幅のコメントが追加された場合の衝突する時間を返す(値が小さいほど衝突しない)
    calcCollisionTime(cWidth) {
        let wrapWidth = this.$elm.clientWidth;
        let cLeftArrivalTime = wrapWidth / (cWidth + wrapWidth);
        let collisionTime = (1 - this.minProgress()) - cLeftArrivalTime;
        return collisionTime;
    }

    // 一番進んでいないコメントの進み具合が0-1で返される
    minProgress() {
        let minProgress = 1;
        let wrapWidth = this.$elm.clientWidth;
        this._comments.forEach(comment => {
            let cLeft = comment.$elm.offsetLeft;
            let cWidth = comment.$elm.clientWidth;
            let progress = 1 - (cWidth + cLeft) / (cWidth + wrapWidth);
            if (minProgress > progress) {
                minProgress = progress;
            }
        });
        return minProgress;
    }

    addComment(comment) {
        if (this._comments.indexOf(comment) >= 0) return false;
        this._comments.push(comment);
        this.$elm.appendChild(comment.$elm);

        comment.$elm.addEventListener("animationend", () => {
            const i = this._comments.indexOf(comment);
            this._comments.splice(i, 1);
            comment.$elm.remove();
            this.emit("passed", comment);
        });
    }

    clearComment() {
        this._comments.forEach(comment => {
            comment.$elm.remove();
        });
        this._comments = [];
    }
}
class NiCommentManager {
    constructor(options) {
        this._ops = options;
        this._$elm = document.createElement("ul");
        this._$elm.className = "wrap";

        this._$dummyLine = document.createElement("li");
        this._$dummyLine.className = "line dummy";

        this.$elm.appendChild(this.$dummyLine);

        this._lines = [];
        this._comments = [];

        // this._loadManager = new LoadManager(options.path, options.loadInterval);
        // this._loadManager.on("comment", this.addComment.bind(this));

        this.init();
    }
    get $elm() {
        return this._$elm;
    }

    get $dummyLine() {
        return this._$dummyLine;
    }

    onPassed(comment) {
        const i = this._comments.indexOf(comment);
        this._comments.splice(i, 1);
    }

    init() {
        const $elm = this._$elm;
        const ops = this._ops;

        let lineHeight = ops.lineHeight || 1.4;
        lineHeight = Math.min(3, Math.max(1.0, lineHeight));

        let lineNum = ops.lineNum || 10;
        lineNum = Math.min(30, Math.max(1, lineNum));

        let duration = ops.duration || 5000;
        duration = Math.min(10*1000, Math.max(500, duration));

        let color = ops.color;
        let fontWeight = ops.fontWeight;
        let fontFamily = ops.fontFamily;
        let textShadow = ops.textShadow;
        let lengthLimit = ops.lengthLimit;
        let opacity = ops.opacity;

        $elm.style.setProperty("--cLineHeight", ops.lineHeight);
        $elm.style.setProperty("--cDuration", duration + "ms");
        $elm.style.setProperty("--cColor", color);
        $elm.style.setProperty("--cFontSize", 100/(lineHeight*lineNum) + "vh" );
        $elm.style.setProperty("--cFontWeight", fontWeight);
        $elm.style.setProperty("--cFontFamily", fontFamily);
        $elm.style.setProperty("--cTextShadow", textShadow);
        $elm.style.setProperty("--cLengthLimit", lengthLimit * 1.05 + "em");
        $elm.style.setProperty("opacity", opacity);

        for (let i=0; i < lineNum; i++) {
            const line = new DisplayLine();
            this._lines.push(line);
            line.on("passed", this.onPassed.bind(this));
            this.$elm.appendChild(line.$elm);
        }
        // this._loadManager.start();
    }

    addComment(commentData) {
        const comment = new Comment(commentData, this._ops.format);
        this._comments.push(comment);

        let cWidth = this.getCommentWidth(comment);
        let targetLineNum = 0;
        let minCollisionTime = 999999;
        let minCongestionVal = 999999;

        for (let i=0; i < this._lines.length; i++) {
            const line = this._lines[i];
            const cTime = Math.max(0, line.calcCollisionTime(cWidth));
            const cVal = line.congestionValue();
            // 衝突時間と開幕の衝突量が両方0ならその行を使う
            if (cTime == 0 && cVal == 0) {
                targetLineNum = i;
                break;
            }
            // 衝突時間が短くてなおかつ開幕の衝突量も少なければその行を使う
            if (cTime < minCollisionTime && cVal <= minCongestionVal) {
                targetLineNum = i;
                minCollisionTime = cTime;
                minCongestionVal = cVal;
            }
        }

        this._lines[targetLineNum].addComment(comment);
    }
    clearComment() {
        this._lines.forEach(line => {
            line.clearComment();
        })
    }

    getCommentWidth(comment) {
        const $comment = comment.$elm.cloneNode(true);
        this.$dummyLine.appendChild($comment);
        const cWidth = $comment.clientWidth;
        $comment.remove();
        return cWidth;
    }
}


function commentOpacity(percent) {
    document.querySelector('ul.wrap').style.opacity = percent / 100
}


function addNicommentButton() {
    const nicommentCaption = GM_getValue('nicommentCaption') || '動画タイトル'
    const nicommentToggle = GM_getValue('nicommentToggle') ? 'on' : ''
    const nicommentNicoru = GM_getValue('nicommentNicoru') ? 'on' : ''
    const nicommentOpacity = GM_getValue('nicommentOpacity') || 60

    commentOpacity(nicommentToggle == 'on' ? nicommentOpacity : 0)
    document.body.classList.toggle('nicoruoff', !nicommentNicoru)

    const nb = document.createElement('div');
    nb.className = 'setting mainButton'
    nb.innerHTML = `
    <button id="commentButton">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="CommentOnOffButton-iconHide"><path fill-rule="evenodd" d="M6.8 18H3.6c-.9 0-1.6-.7-1.6-1.6V3.6C2 2.7 2.7 2 3.6 2h16.8c.9 0 1.6.7 1.6 1.6v12.8c0 .9-.7 1.6-1.6 1.6h-7.9l-4.2 3.8a1 1 0 0 1-1 .1.8.8 0 0 1-.5-.7V18Z"></path></svg>
    </button>
    <div id="settingPopup" class="popup">
        <div id="settingPopupIn" class="popupIn">
            <div id="nicommentCaption" class="list">
                <div class="caption" title="${nicommentCaption}">${nicommentCaption}</div>
            </div>
            <div id="nicommentToggle" class="list">
                <div class="w6 caption">コメント表示</div>
                <div class="preference">
                    <div id="nToggle" class="toggleButton ${nicommentToggle}">
                        <div class="toggleButtonWrap">
                            <div class="on"><span>ON</span></div>
                            <div class="off"><span>OFF</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="nicommentOpacity" class="list">
                <div class="w4 caption">透過度</div>
                <div class="preference">
                    <div id="nOpacity" class="range">
                        <input type="range" name="opacity" value="${nicommentOpacity}">
                    </div>
                </div>
            </div>
            <div id="nicommentNicoru" class="list">
                <div class="w6 caption">ニコる表示</div>
                <div class="preference">
                    <div id="nNicoru" class="toggleButton ${nicommentNicoru}">
                        <div class="toggleButtonWrap">
                            <div class="on"><span>ON</span></div>
                            <div class="off"><span>OFF</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
    nb.addEventListener('mouseenter', e => {
        e.currentTarget.querySelector('.popup').className = 'popup-hover'
        e.currentTarget.querySelector('.popupIn').className = 'popupIn-hover'
    })
    nb.addEventListener('mouseleave', e => {
        e.currentTarget.querySelector('.popup-hover').className = 'popup'
        e.currentTarget.querySelector('.popupIn-hover').className = 'popupIn'
        GM_setValue('nicommentOpacity', e.currentTarget.querySelector('#nicommentOpacity input').value)
    })

    const toggle = e => {
        let tgl = e.currentTarget.querySelector('.toggleButton').classList.toggle('on');
        GM_setValue(e.currentTarget.id, tgl)
        return tgl;
    }
    nb.querySelector('#nicommentToggle').addEventListener('click', e => {
        const tgl = toggle(e);
        commentOpacity(tgl ? nb.querySelector('#nicommentOpacity input').value : 0);
    })
    nb.querySelector('#nicommentOpacity input').addEventListener('input', e => {
        commentOpacity(e.currentTarget.value)
    })
    nb.querySelector('#nicommentNicoru').addEventListener('click', e => {
        let tgl = toggle(e);
        document.body.classList.toggle('nicoruoff', !tgl)
    })

    let setting = document.querySelector(".setting.mainButton");
    setting.parentNode.insertBefore(nb, setting.nextElementSibling);
}


let commentList = [];
let agoTime = -1;

if (location.href.startsWith('https://animestore.docomo.ne.jp/animestore/sc_d_pc')) {
    GM_addStyle(nicommentDstyle)

    let video = null;
    let iv = setInterval(() => {
        video = document.querySelector('video');
        if (!video || !video.getAttribute('src'))
            return;
        console.log('video読み込み完了');
        clearInterval(iv);

        const cManager = new NiCommentManager(OPTIONS);
        document.body.appendChild(cManager.$elm);

        commentList = GM_getValue('comments');
        addNicommentButton();

        video.addEventListener('timeupdate', () => {
            let currentTime = Math.floor(video.currentTime);
            if (!video.paused && agoTime != currentTime) {
                agoTime = currentTime;
                commentList[currentTime]?.forEach(c => cManager.addComment(new CommentData(c.text, c.nicoru, '', '')))
            }
        })
        video.addEventListener('pause', () => {
            document.querySelectorAll('.comment').forEach(c => c.classList.add('pause'))
        })
        video.addEventListener('play', () => {
            document.querySelectorAll('.comment').forEach(c => c.classList.remove('pause'))
        })
        video.addEventListener('seeked', () => {
            cManager.clearComment()
        })

    }, 500)
}






GM_registerMenuCommand('コメント取得', async function() {
    const comments = await getComments();
    GM_setValue('comments', comments);
    GM_setValue('nicommentCaption', document.querySelector('title').textContent.replace(' - ニコニコ動画', ''))
})

async function getComments() {
    if (!location.href.startsWith('https://www.nicovideo.jp/watch/')) {
        return;
    }
    function sleep(ms){
        return new Promise((s, f) => setTimeout(s, ms))
    }
    let cnt = 0
    const commentArea = document.querySelector('.custom-scrollbar_true')
    const commentSet = new Set()

    // document.querySelector('[aria-label="再生する"]')?.click()
    commentArea.scroll(0,0)

    
    while(commentArea.scrollHeight > Math.round(commentArea.scrollTop) + commentArea.clientHeight + 100) {
        commentArea.querySelectorAll(':scope div[data-index]').forEach(c => commentSet.add(c))
        commentArea.scrollBy(0, 300)
        await sleep(80)
        cnt++
    }
    function time2sec(time) {
        const t = time.split(':')
        return t[0]*60 + t[1]*1
    }

    let newCom = {}
    commentSet.forEach(c => {
        const time = time2sec(c.querySelector(':scope span').textContent)
        if (!newCom[time]) {
            newCom[time] = [];
        }
        newCom[time].push({
            text: c.querySelector(':scope p:first-child').textContent,
            nicoru: c.querySelector(':scope  button p').textContent
        })
    })
    console.log(newCom);

    return newCom;
}