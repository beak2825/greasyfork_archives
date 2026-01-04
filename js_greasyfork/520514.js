// ==UserScript==
// @name               Pixiv预览器（轻量级）
// @name:en            PixivPreviewer(Light)
// @namespace          https://greasyfork.org/zh-CN/users/866669-shikataganai
// @author             shikataganai
// @version            1.12
// @description        Pixiv 插画预览器（轻量级），无需进入作品页即可：快速预览单图、多图、动图，支持快捷键旋转图片、翻页、GIF暂停、GIF逐帧翻页、复制图片ID等
// @description:en     Pixiv image previewer (Light), No need to enter the artwork page: quick preview of single images, multiple images, dynamic images, support shortcut keys to rotate images, flip pages, pause GIFs, flip GIFs frame by frame, copy image IDs, etc
// @license            MIT
// @supportURL         https://github.com/kuroChef/PixivPreviewer
// @icon               https://www.pixiv.net/favicon.ico
// @match              https://www.pixiv.net/*
// @downloadURL https://update.greasyfork.org/scripts/520514/Pixiv%E9%A2%84%E8%A7%88%E5%99%A8%EF%BC%88%E8%BD%BB%E9%87%8F%E7%BA%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520514/Pixiv%E9%A2%84%E8%A7%88%E5%99%A8%EF%BC%88%E8%BD%BB%E9%87%8F%E7%BA%A7%EF%BC%89.meta.js
// ==/UserScript==

/* 6.52->1.12
快捷键（Shortcut keys）：
- alt+z 开关预览（Switch preview）
- alt+c 悬停时复制插画PID（Copy illustration PID when hovering）
- qQeE 旋转图片（Rotate Image）
- aA← 上一页（Previous Page）
- dD→ 下一页（Next page）
- sS 暂停/播放GIF（Suspend/Play GIF）
*/


class QPreviewer {
    distanceRate = .95;
    distanceMinValue = 20;
    imgSize = ["360x360_70", "240x480", "600x600"];
    curImgSize = this.imgSize[2];
    RE_FullDTWithPID = /\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{7,}/;
    RE_PID = /\d{7,}/;
    illustrationURL_head = `https://i.pximg.net/c/${this.curImgSize}/img-master/img/`;
    frameURL_head = "https://i.pximg.net/img-original/img/";
    gifLoadLimit = 0;
    offDisplay = !1;
    eleProp_imgProcessed = "QP_imgProcessed";
    eleProp_imgInfo = "QP_imgInfo";
    eleProp_originImg = "QP_originImg";
    enableMarkStyle = !0;
    themeColor = "0, 151, 249";
    themeBgColor = `rgba(${this.themeColor}, 0.1)`;
    loadedBgColor = "rgba(0, 0, 0, 0.1)";
    cardStyleMap = {
        normalCardStyle: {borderRadius: "8px", backgroundColor: this.themeBgColor},
        smallArtCartStyle: {borderBottom: `2px solid rgba(${this.themeColor}, 0.5)`}
    };
    imgClassMap = {
        "sc-a57c16e6-10 exCFUZ": [t => "sc-a57c16e6-0 jVdyIn" === this.getRelativePathElement(t, [4]).getAttribute("class") ? ["smallArtCartStyle", [4]] : ["normalCardStyle", [6]], t => "sc-a57c16e6-0 fLGiwc" === this.getParent(t, 4).getAttribute("class") ? this.getParent(t, 8) : t],
        "sc-a57c16e6-10 cKDtIF": [() => ["normalCardStyle", [6]]],
        "sc-a57c16e6-10 edUjMF": [() => ["normalCardStyle", [9]]],
        "sc-6096dbd0-3 kIyWrq": [() => ["smallArtCartStyle", [7]]],
        "sc-a57c16e6-10 jWGwLB": [() => ["smallArtCartStyle", [7]]],
        "sc-ad1ab819-2 gTxBqA": [() => ["normalCardStyle", [3]]],
        "sc-6096dbd0-3 ldSnLS": [t => {
            let e = this.getRelativePathElement(t, [5]);
            return "sc-ececffe2-1 bftNza" === e?.getAttribute("class") ? ["smallArtCartStyle", [6]] : ["normalCardStyle", [6]]
        }, t => {
            let e = this.getRelativePathElement(t, [5]);
            return "sc-ececffe2-1 bftNza" === e?.getAttribute("class") && this.getRelativePathElement(e, [2]).children.length > 1 && (this.getRelativePathElement(e, [2, -1]).style.pointerEvents = "none"), t
        }],
        "sc-20e77054-2 JsOWo": [() => ["smallArtCartStyle", [0]], t => (t.style.zIndex = 5, t.style.position = "relative", this.getRelativePathElement(t, [2, -2]).style.zIndex = 6, t)]
    };
    curImgInfo = null;
    curPage = 0;
    curGIFShow = !1;
    curGIFPause = !1;
    gifInfo = {};
    curImgLoaded = !1;
    checkLoadImg;
    imgDisplayDiv;
    imgShower;
    imgShowerRotateDeg = 0;
    imgInfoDiv;

    constructor() {
        this.msg("Works"), this.checkLoadImg = document.createElement("img"), this.imgDisplayDiv = document.createElement("div"), this.imgDisplayDiv.style = "display:none;position:fixed;top:0px;Height:100vh;z-index:100;transition:background-color 0.5s ease-in-out 0s;text-align:center;", this.imgShower = document.createElement("img"), this.imgDisplayDiv.appendChild(this.imgShower), this.imgShower.style = "max-width:100%;height:100%;object-fit:contain;transform-origin:center;", document.body.appendChild(this.imgDisplayDiv), this.imgInfoDiv = document.createElement("div"), this.imgInfoDiv.style = "color:#fff;font-size:12px;text-align:center;padding:5px;position:absolute;top:10px;background-color:rgba(0,151,249,0.6);border-radius:10px;z-index:101;", this.imgDisplayDiv.appendChild(this.imgInfoDiv), this.initImgInfoDiv(this.imgInfoDiv), this.checkLoadImg.cbParent = this, this.checkLoadImg.addEventListener("load", this.onImgLoadCB), this.checkLoadImg.addEventListener("error", this.onImgErrorCB), document.addEventListener("keydown", this.hotKeyCB), new MutationObserver((t => {
            for (let e of t) {
                let t = e.target.children;
                if (t) for (let e = 0; e < t.length; e++) "IMG" === t[e].tagName && this.checkImgClass(t[e]) && this.processImg(t[e])
            }
        })).observe(document.body, {attributes: !1, childList: !0, subtree: !0}), setTimeout((function () {
            console.log("timeout get all..."), document.QP.processAllTargetImgList()
        }), 2e3)
    }

    onImgLoadCB = () => {
        this.curImgInfo && (this.curImgLoaded = !0, this.rotateImgShower(0), this.curGIFShow || (this.curImgInfo.isGIF && !this.gifInfo[this.curImgInfo.PID].ok ? (this.gifInfo[this.curImgInfo.PID].framePostfixChecked = !0, this.preloadGIF()) : this.imgDisplayDiv.style.backgroundColor = this.loadedBgColor))
    };
    onImgErrorCB = () => {
        if (!this.curImgInfo) return;
        let t = this.curImgInfo.PID;
        this.curImgInfo.isGIF && !this.gifInfo[t].framePostfixChecked && ("jpg" === this.gifInfo[t].framePostfix ? this.gifInfo[t].framePostfix = "png" : this.gifInfo[t].framePostfix = "jpg", this.imgDisplay())
    };
    hotKeyCB = t => {
        if ("Escape" !== t.key) if (!t.altKey || "z" !== t.key && "Z" !== t.key) {
            if (this.curImgInfo) if (!t.altKey || "c" !== t.key && "C" !== t.key) {
                if ("q" === t.key || "Q" === t.key ? this.rotateImgShower(90) : "e" !== t.key && "E" !== t.key || this.rotateImgShower(-90), this.curImgInfo.pageAmount > 1) {
                    if (!this.curImgInfo.isGIF || "s" !== t.key && "S" !== t.key || (this.curGIFPause ? (this.curGIFPause = !1, this.playGIF()) : this.curGIFPause = !0, this.updateGIFInfo()), this.curGIFShow && !this.curGIFPause) return;
                    "a" === t.key || "ArrowLeft" === t.key || "A" === t.key ? (this.imgDisplayDiv.style.backgroundColor = this.themeBgColor, this.curPage <= 0 ? this.curPage = this.curImgInfo.pageAmount - 1 : this.curPage--, this.imgDisplay()) : "d" !== t.key && "ArrowRight" !== t.key && "D" !== t.key || (this.imgDisplayDiv.style.backgroundColor = this.themeBgColor, this.curPage >= this.curImgInfo.pageAmount - 1 ? this.curPage = 0 : this.curPage++, this.imgDisplay())
                }
            } else navigator.clipboard.writeText(this.curImgInfo.PID)
        } else this.offDisplay ? (this.offDisplay = !1, this.processAllTargetImgList()) : (this.clearImgDisplay(), this.offDisplay = !0); else this.clearImgDisplay(!0)
    };

    initImgInfoDiv(t) {
        t.span_imgPID = document.createElement("span"), t.span_imgPG = document.createElement("span"), t.span_imgGIF = document.createElement("span"), t.span_imgDT = document.createElement("span"), t.appendChild(t.span_imgPID), t.appendChild(t.span_imgPG), t.appendChild(t.span_imgGIF), t.appendChild(document.createElement("br")), t.appendChild(t.span_imgDT)
    }

    setImgInfoDiv(t = null, e = null, i = null, s = null) {
        null !== t && (this.imgInfoDiv.span_imgPID.innerText = t), null !== e && (this.imgInfoDiv.span_imgPG.innerText = e), null !== i && (this.imgInfoDiv.span_imgGIF.innerText = i), null !== s && (this.imgInfoDiv.span_imgDT.innerText = s)
    }

    checkImgClass(t) {
        return t.getAttribute("class") in this.imgClassMap
    }

    processAllTargetImgList() {
        this.msg("Process all target");
        let t = document.querySelectorAll("img");
        for (let e = 0; e < t.length; e++) this.checkImgClass(t[e]) && this.processImg(t[e])
    }

    processImg(t) {
        if (this.offDisplay) return;
        if (t[this.eleProp_imgProcessed]) return;
        t[this.eleProp_imgProcessed] = !0;
        let e = this.imgClassMap[t.getAttribute("class")];
        if (this.enableMarkStyle) {
            let i = e[0](t);
            this.updateElementStyles(this.getRelativePathElement(t, i[1]), this.cardStyleMap[i[0]])
        }
        let i = e[1] ? e[1](t) : t;
        i[this.eleProp_originImg] = t, i.addEventListener("mouseover", this.setImgShower), i.addEventListener("mousemove", this.setImgDisplayPosition), i.addEventListener("mouseout", this.clearImgDisplay), i.addEventListener("click", this.clearImgDisplay), this.imgDisplayDiv.addEventListener("mousemove", this.clearImgDisplay)
    }

    setImgShower = t => {
        if (this.offDisplay || this.curImgInfo) return;
        let e = t.target[this.eleProp_originImg];
        e && (this.curImgInfo = this.getImgInfo(e), void 0 === this.curImgInfo && (this.curImgInfo = this.extractImgInfo(e)), this.imgDisplayDiv.style.display = "block", this.setImgInfoDiv(this.curImgInfo.PID, null, null, this.curImgInfo.DTP.split("/", 3).join("-")), 0 !== this.curImgInfo.pageAmount ? (this.curImgInfo.pageAmount > 1 && this.updatePGInfo(), this.imgDisplay(), this.setImgDisplayPosition(t)) : this.getGIFFrames(e))
    };

    getImgPageAmount(t) {
        this.getParent(t, 3);
        let e = this.getRelativePathElement(t, [3, -2, -2, -1, -2]);
        if ("SPAN" === e?.tagName) return Number(e.textContent);
        let i = this.getRelativePathElement(t, [1, -2]);
        return "svg" === i?.tagName ? 0 : 1
    }

    extractImgInfo(t) {
        let e = 0, i = this.getImgPageAmount(t);
        i || (e = 1);
        let s = {PID: this.RE_PID.exec(t.src)[0], DTP: this.RE_FullDTWithPID.exec(t.src)[0], isGIF: e, pageAmount: i};
        return this.setImgInfo(t, s), s
    }

    setImgInfo(t, e) {
        t[this.eleProp_imgInfo] = e
    }

    getImgInfo(t) {
        return t[this.eleProp_imgInfo]
    }

    imgDisplay() {
        if (!this.curImgInfo) return;
        let t;
        if (this.updatePGInfo(), this.curImgInfo.isGIF) {
            if (t = `${this.frameURL_head}${this.curImgInfo.DTP}_ugoira${this.curPage}.${this.gifInfo[this.curImgInfo.PID].framePostfix}`, this.gifInfo[this.curImgInfo.PID].ok && !this.curGIFShow && !this.curGIFPause) return void this.playGIF()
        } else t = this.illustrationURL_head + `${this.curImgInfo.DTP}_p${this.curPage}_master1200.jpg`, this.imgDisplayDiv.style.backgroundColor = this.themeBgColor;
        this.curImgLoaded = !1, this.checkLoadImg.src = t, this.imgShower.src = t
    }

    clearImgDisplay = t => {
        this.rotateImgShower(), this.curPage = 0, this.curGIFShow = !1, this.curGIFPause = !1, this.curImgLoaded = !1, this.curImgInfo = null, this.resetImgShowerScale(), this.imgShower.src = "", this.checkLoadImg.src = "", this.imgDisplayDiv.style.display = "none", this.setImgInfoDiv("", "", "", "")
    };
    setImgDisplayPosition = t => {
        let e = t.clientX, i = document.documentElement.clientWidth;
        e >= i / 2 ? (e - e * this.distanceRate < this.distanceMinValue ? this.imgDisplayDiv.style.width = e - this.distanceMinValue + "px" : this.imgDisplayDiv.style.width = e * this.distanceRate + "px", this.imgDisplayDiv.style.left = "0px", this.imgDisplayDiv.style.right = "", this.imgInfoDiv.style.left = "10px", this.imgInfoDiv.style.right = "") : (i - e - (i - e) * this.distanceRate < this.distanceMinValue ? this.imgDisplayDiv.style.width = i - e - this.distanceMinValue + "px" : this.imgDisplayDiv.style.width = (i - e) * this.distanceRate + "px", this.imgDisplayDiv.style.left = "", this.imgDisplayDiv.style.right = "0px", this.imgInfoDiv.style.right = "10px", this.imgInfoDiv.style.left = ""), this.setImgShowerScale()
    };

    rotateImgShower(t) {
        if (void 0 === t) this.imgShowerRotateDeg = 0, this.imgShower.style.rotate = "0deg"; else {
            if (!this.curImgLoaded) return;
            this.imgShowerRotateDeg += t, this.imgShower.style.rotate = `${this.imgShowerRotateDeg}deg`, this.imgShowerRotateDeg % 180 ? this.setImgShowerScale() : this.resetImgShowerScale()
        }
    }

    resetImgShowerScale() {
        this.imgShower.style.scale = "", this.imgShower.style.translate = "", this.imgShower.style.height = "100%", this.imgShower.style.maxWidth = "100%"
    }

    setImgShowerScale() {
        if (!(this.curImgLoaded && this.imgShowerRotateDeg % 180)) return;
        let t, e = this.imgDisplayDiv.clientWidth, i = this.imgDisplayDiv.clientHeight, s = this.imgShower.naturalWidth,
            o = this.imgShower.naturalHeight;
        t = e / i <= o / s ? e / o : i / s;
        let r = 0;
        s > e && (r = (e - s) / 2), this.imgShower.style.translate = `${r}px ${(i - o) / 2}px`, this.imgShower.style.maxWidth = "", this.imgShower.style.height = "", this.imgShower.style.scale = t
    }

    updatePGInfo() {
        if (1 === this.curImgInfo.pageAmount) return;
        let t = ` | ${this.curPage + 1}/${this.curImgInfo.pageAmount}`;
        this.curImgInfo.isGIF && this.gifInfo[this.curImgInfo.PID].framesAmount > this.curImgInfo.pageAmount && (t += `(${this.gifInfo[this.curImgInfo.PID].framesAmount})`), this.setImgInfoDiv(null, t, null, null)
    }

    updateGIFInfo() {
        this.curImgInfo?.isGIF && (this.gifInfo[this.curImgInfo.PID].ok ? this.curGIFPause ? this.setImgInfoDiv(null, null, " ▶", null) : this.setImgInfoDiv(null, null, " ∥", null) : this.setImgInfoDiv(null, null, ` ${Math.round(this.gifInfo[this.curImgInfo.PID].loadedCount / this.gifInfo[this.curImgInfo.PID].framesLimit * 100)}%(${this.gifInfo[this.curImgInfo.PID].loadedCount})`, null))
    }

    getGIFFrames(t) {
        let e = this.getImgInfo(t);
        if (!e.isGIF || e.PID in this.gifInfo) return;
        let i = new XMLHttpRequest;
        i.open("get", `https://www.pixiv.net/ajax/illust/${e.PID}/ugoira_meta`, !0), i.onreadystatechange = () => {
            if (200 === i.status && i.responseText && !(e.PID in this.gifInfo)) {
                let s = JSON.parse(i.responseText).body.frames;
                this.gifInfo[e.PID] = {
                    frames: s,
                    framesAmount: s.length,
                    framesLimit: this.gifLoadLimit && this.gifLoadLimit < s.length ? this.gifLoadLimit : s.length,
                    framePostfix: "jpg",
                    framePostfixChecked: !1,
                    loaded: {},
                    loadedCount: 0,
                    ok: !1
                }, e.pageAmount = this.gifInfo[e.PID].framesLimit, this.setImgInfo(t, e), e.PID === this.curImgInfo?.PID && (this.curImgInfo = e, this.imgDisplay())
            } else 200 !== i.status && console.error(`[@Pixiv Script] get GIF failed, qPID: ${e.PID} cPID: ${this.curImgInfo.PID}\n${i}`)
        }, i.send()
    }

    preloadGIF() {
        let t = this.curImgInfo?.PID;
        if (!this.curImgInfo?.isGIF || !this.gifInfo[t].framePostfixChecked || this.gifInfo[t].ok) return;
        let e = this.curImgInfo.DTP, i = this.gifInfo[t].framePostfix;
        for (let s = 0; s < this.gifInfo[t].framesLimit && t === this.curImgInfo.PID; s++) {
            if (s in this.gifInfo[t].loaded) continue;
            let o = document.createElement("img");
            o.src = this.frameURL_head + `${e}_ugoira${s}.${i}`, o.addEventListener("load", (() => {
                this.gifInfo[t].loaded[s] = o, this.gifInfo[t].loadedCount++, this.gifInfo[t].loadedCount >= this.gifInfo[t].framesLimit && (this.imgDisplayDiv.style.backgroundColor = this.loadedBgColor, this.gifInfo[t].ok = !0, this.playGIF()), this.updateGIFInfo()
            }))
        }
    }

    async playGIF() {
        let t = this.curImgInfo?.PID;
        if (!this.curImgInfo?.isGIF || !this.gifInfo[t].ok || this.curGIFShow) return;
        let e = this.gifInfo[t].framesLimit;
        this.curGIFShow = !0, this.updateGIFInfo(), this.curPage === e - 1 && (this.curPage = 0);
        for (let i = this.curPage; i < e && (!this.curGIFPause && this.curGIFShow); i++) this.curPage = i, this.imgDisplay(), await this.sleep(Number(this.gifInfo[t].frames[i].delay));
        this.curGIFShow = !1, this.curGIFPause || this.playGIF()
    }

    sleep(t) {
        return new Promise((e => {
            setTimeout((() => {
                e()
            }), t)
        }))
    }

    getParent(t, e) {
        return e <= 0 ? t : this.getParent(t?.parentNode, --e)
    }

    getRelativePathElement(t, e) {
        let i = t;
        for (let t = 0; t < e.length; t++) e[t] > 0 ? i = this.getParent(i, e[t]) : e[t] < 0 && (i = i?.children[Math.abs(e[t]) - 1]);
        return i
    }

    updateElementStyles(t, e) {
        for (let i in e) t.style[i] = e[i]
    }

    msg(t) {
        console.log(`[@PixivPreviewer]: ${t}`)
    }
}

!function () {
    "use strict";
    new QPreviewer
}();