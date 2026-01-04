// ==UserScript==
// @name         静画疑似ニコるβ
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  静画コメントをニコれるようにします。通知実装しました。
// @author       cbxm
// @match        https://seiga.nicovideo.jp/*
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/420959/%E9%9D%99%E7%94%BB%E7%96%91%E4%BC%BC%E3%83%8B%E3%82%B3%E3%82%8B%CE%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/420959/%E9%9D%99%E7%94%BB%E7%96%91%E4%BC%BC%E3%83%8B%E3%82%B3%E3%82%8B%CE%B2.meta.js
// ==/UserScript==
//汎用関数
class Util {
    static WaitDocumentElement() {
        return new Promise(r => {
            if (document.documentElement != null) {
                return r();
            }
            window.addEventListener("DOMContentLoaded", () => {
                return r();
            });
        });
    }
    //https://stackoverflow.com/questions/69368851/type-safe-way-of-narrowing-type-of-arrays-by-length-when-nouncheckedindexedacces
    //TypeScriptくんを納得させるための関数
    static HasLengthAtLeast(arr, len) {
        return arr != null && arr.length >= len;
    }
    //TypeScriptくんを納得させるための関数
    static IsLength(arr, len) {
        return arr != null && arr.length == len;
    }
    //xmlString=未探査部分
    static XmlToObj(xmlString) {
        const F = (xmlString, obj) => {
            //タグを抜き出す
            let tagMatchs = null;
            while (true) {
                tagMatchs = xmlString.match(/<([^>]+)>/); //タグを探す
                //タグがないということはそれが値になる
                if (tagMatchs == null) {
                    return xmlString;
                }
                if (tagMatchs[1]?.[tagMatchs[1].length - 1] == "/") {
                    xmlString = xmlString.replace(/<[^>]+>([^]*)/, "$1");
                }
                else {
                    break;
                }
            }
            if (!Util.HasLengthAtLeast(tagMatchs, 2)) {
                return xmlString;
            }
            const tag = tagMatchs[1];
            //タグの内側とその先を抜き出す
            const matchChildlen = [];
            while (true) {
                const matchs = xmlString.match(new RegExp(`^[^<]*<${tag}>([^]+?)<\/${tag}>([^]*)`));
                if (matchs == null || !Util.HasLengthAtLeast(matchs, 3)) {
                    break;
                }
                matchChildlen.push(matchs[1]);
                xmlString = matchs[2];
            }
            //タグあったのにマッチしなかったおかしい
            if (matchChildlen.length == 0) {
                return obj;
            }
            //そのタグが一つしかないとき、オブジェクトになる
            if (Util.IsLength(matchChildlen, 1)) {
                //子を探す
                obj[tag] = F(matchChildlen[0], {});
            }
            //そのタグが複数あるとき、配列になる
            if (matchChildlen.length > 1) {
                obj = [];
                for (let i = 0; i < matchChildlen.length; i++) {
                    //子を探す
                    obj[i] = F(matchChildlen[i], {});
                }
            }
            //兄弟を探す
            F(xmlString, obj);
            return obj;
        };
        //初期化で<xml>を取り除く
        xmlString = xmlString.replace(/\s*<[^>]+>([^]+)/, "$1");
        return F(xmlString, {});
    }
    static HtmlToDocument(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }
    static HtmlToChildNodes(str) {
        return this.HtmlToDocument(str).body.childNodes;
    }
    static HtmlToElement(str) {
        return this.HtmlToDocument(str).body.firstElementChild;
    }
    static HtmlToSVG(s) {
        var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
        var frag = document.createDocumentFragment();
        while (div.firstChild?.firstChild)
            frag.appendChild(div.firstChild.firstChild);
        return frag;
    }
    static Wait(ms) {
        return new Promise(r => setTimeout(() => r(null), ms));
    }
    static WithTimeOut(p, ms) {
        return Promise.race([p, this.Wait(ms)]);
    }
    static async Retry(p, retryCount, wait, predicate) {
        for (let i = 0; i < retryCount; i++) {
            const result = await p();
            if (predicate(result)) {
                return result;
            }
            //console.log("wait...");
            await Util.Wait(wait);
        }
        return null;
    }
    static async Download(url, name) {
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.download = name;
        link.href = url;
        link.click();
        //すぐに消すと反応しないとか
        await this.Wait(100);
        document.body.removeChild(link);
    }
    static GMFetchText(url, optopns) {
        //console.log(url);
        return new Promise(r => {
            GM.xmlHttpRequest({
                url: url,
                ...optopns,
                onload: (response) => {
                    r(response.responseText);
                },
                onerror: (e) => {
                    console.error(e);
                    r("");
                }
            });
        });
    }
    static Unique(array) {
        return Array.from(new Set(array));
    }
    //reflow起こすから注意
    static IsElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
}
;
class PerformanceLogger {
    constructor() {
        this.startTime = 0;
        this.points = [];
        this.SetPoint("start");
    }
    SetPoint(name) {
        this.points.push({
            name: name,
            time: performance.now() - this.startTime
        });
    }
    Log() {
        let log = "";
        let i = 0;
        let bef = 0;
        for (const p of this.points) {
            log += `[${i}]${p.name ?? ""}: ${p.time} +${p.time - bef}\n`;
            bef = p.time;
            i++;
        }
        console.log(log);
    }
}
class GMStorage {
    constructor(storageName, defaultFaildVal) {
        this.storageName = "";
        this.storageName = storageName;
        this.defaultFaildVal = defaultFaildVal;
    }
    async GetDataOrDefault() {
        return this.GetData(this.defaultFaildVal);
    }
    async GetData(faildValue) {
        const val = faildValue;
        const text = await GM.getValue(this.storageName);
        //ダメだったとき
        if (text == null || text.length == 0 || text == "null" || text == "undefined") {
            switch (typeof val) {
                case "undefined":
                    return null;
                case "function":
                    return new val();
            }
            return val;
        }
        return this.Parse(text, faildValue);
    }
    Parse(text, faildValue) {
        const obj = JSON.parse(decodeURIComponent(text), function (key, val) {
            for (const c of GMStorage.classList) {
                if (this[key].$type === c.typeString) {
                    return new c.class(this[key].value);
                }
            }
            return val;
        });
        const val = faildValue;
        switch (typeof val) {
            case "undefined": //undefinedならチェックできない
                return obj;
            case "function": //functionならちゃんと求める型になってるかチェック
                if (obj instanceof val) {
                    return obj;
                }
                else {
                    return new val(obj);
                }
        }
        return obj;
    }
    SetData(data) {
        GM.setValue(this.storageName, encodeURIComponent(JSON.stringify(data, function (key, val) {
            for (const c of GMStorage.classList) {
                if (this[key] instanceof c.class) {
                    return {
                        $type: c.typeString,
                        value: val //valはシリアライズ済み this[key]!=val
                    };
                }
            }
            return val;
        })));
    }
}
//シリアライズ時に登録したクラスなら$typeプロパティ作って
//自動でデシリアライズできるようにする deep対応
GMStorage.classList = [];
//cはコンストラクタでstringify(parse())されたのを受け入れないといけない
GMStorage.RegisterClass = (c) => {
    GMStorage.classList.push({ typeString: c.name, class: c });
};
;
;
//MutationObserver使った便利関数
class Observer {
    static Wait(predicate, parent = document, option = null) {
        return new Promise(r => {
            if (option == null) {
                option = {};
            }
            if (option.childList == undefined && option.attributes == undefined && option.characterData == undefined) {
                option.childList = true;
                option.subtree = true;
            }
            const mutationObserver = new MutationObserver((mrs) => {
                if (predicate(mrs)) {
                    mutationObserver.disconnect();
                    r(mrs);
                    return;
                }
            });
            mutationObserver.observe(parent, option);
        });
    }
    ;
    static WaitAddedNodes(predicate, parent, option = null) {
        return new Promise(r => {
            if (option == null) {
                option = {};
            }
            if (option.childList == undefined && option.attributes == undefined && option.characterData == undefined) {
                option.childList = true;
                option.subtree = true;
            }
            const mutationObserver = new MutationObserver(async (mrs) => {
                //console.log(document.head.innerHTML);
                //console.log(document.body.innerHTML);
                const result = [];
                for (let node of mrs) {
                    //console.log(added);
                    for (let i = 0; i < node.addedNodes.length; i++) {
                        result.push(...await predicate(node.addedNodes[i]));
                    }
                }
                if (result.length != 0) {
                    mutationObserver.disconnect();
                    r(result);
                    return;
                }
            });
            mutationObserver.observe(parent, option);
        });
    }
    ;
    static WaitAddedNode(predicate, parent, option = null) {
        return new Promise(r => {
            if (option == null) {
                option = {};
            }
            if (option.childList == undefined && option.attributes == undefined && option.characterData == undefined) {
                option.childList = true;
                option.subtree = true;
            }
            const mutationObserver = new MutationObserver(async (mrs) => {
                //console.log(document.head.innerHTML);
                //console.log(document.body.innerHTML);
                for (let node of mrs) {
                    //console.log(added);
                    for (let i = 0; i < node.addedNodes.length; i++) {
                        const ret = await predicate(node.addedNodes[i]);
                        if (ret != null) {
                            mutationObserver.disconnect();
                            r(ret);
                            return;
                        }
                    }
                }
            });
            mutationObserver.observe(parent, option);
        });
    }
    ;
    static async DefinitelyGetElementById(id, parent = document.documentElement, option = null) {
        if (!(option?.doNotNormalCheck ?? false)) {
            const e = document.getElementById(id);
            if (e != null) {
                return e;
            }
        }
        return this.WaitAddedNode(e => (e instanceof Element && e.id == id) ? e : null, parent, option);
    }
    //getElementsByClassNameをつかうけど単体
    static async DefinitelyGetElementByClassName(className, parent = document.documentElement, option = null) {
        if (!(option?.doNotNormalCheck ?? false)) {
            const e = parent.getElementsByClassName(className)[0];
            if (e != null) {
                return e;
            }
        }
        return this.WaitAddedNode(e => {
            if (e instanceof Element) {
                if (e.classList.contains(className)) {
                    return e;
                }
                if (option?.isDeepSearch ?? false) {
                    const c = e.getElementsByClassName(className);
                    if (c.length != 0) {
                        return c[0];
                    }
                }
            }
            return null;
        }, parent, option);
    }
    //getElementsByTagNameをつかうけど単体
    static async DefinitelyGetElementByTagName(tagName, parent = document.documentElement, option = null) {
        tagName = tagName.toUpperCase();
        if (!(option?.doNotNormalCheck ?? false)) {
            const e = parent.getElementsByTagName(tagName)[0];
            if (e != null) {
                return e;
            }
        }
        return this.WaitAddedNode(e => {
            if (e instanceof Element) {
                if (e.tagName == tagName) {
                    return e;
                }
                if (option?.isDeepSearch ?? false) {
                    const c = e.getElementsByTagName(tagName);
                    if (c.length != 0) {
                        return c[0];
                    }
                }
            }
            return null;
        }, parent, option);
    }
    static async DefinitelyGetElementsByClassName(className, parent = document.documentElement, option = null) {
        if (!(option?.doNotNormalCheck ?? false)) {
            const e = parent.getElementsByClassName(className);
            if (e.length != 0) {
                return Array.from(e);
            }
        }
        return this.WaitAddedNodes(e => {
            const ret = [];
            if (e instanceof Element) {
                if (e.classList.contains(className)) {
                    ret.push(e);
                }
                if (option?.isDeepSearch ?? false) {
                    ret.push(...Array.from(e.getElementsByClassName(className)));
                }
            }
            return ret;
        }, parent, option);
    }
    static async DefinitelyGetElementsByTagName(tagName, parent = document.documentElement, option = null) {
        tagName = tagName.toUpperCase();
        if (!(option?.doNotNormalCheck ?? false)) {
            const e = parent.getElementsByTagName(tagName);
            if (e.length != 0) {
                return Array.from(e);
            }
        }
        return this.WaitAddedNodes(e => {
            const ret = [];
            if (e instanceof Element) {
                if (e.tagName == tagName) {
                    ret.push(e);
                }
                if (option?.isDeepSearch ?? false) {
                    ret.push(...Array.from(e.getElementsByTagName(tagName)));
                }
            }
            return ret;
        }, parent, option);
    }
}
;
//2分探索して検索、挿入ができる
class SortedArray extends Array {
    constructor(array) {
        super(...(array == undefined) ? [] :
            Array.isArray(array) ? array :
                [array]);
        this.bsNearestCache = { cacheId: -1, nearest: -1 };
        if (Array.isArray(array) && !this.isSorted()) {
            this.sortOrder();
        }
    }
    isSorted() {
        for (let i = 0; i < this.length - 1; i++) {
            if (this[i].id > this[i + 1].id) {
                return false;
            }
        }
        return true;
    }
    sortOrder() {
        Array.prototype.sort.call(this, (a, b) => a.id - b.id); //昇順
    }
    //破壊的ソートさせない
    sort(compareFn) {
        if (compareFn != undefined) {
            console.warn("ソートさせないぞ");
        }
        this.sortOrder();
        return this;
    }
    //非破壊のこっちでやってね！
    sortNonDestructive(compareFn) {
        return Array.from(this).sort(compareFn);
    }
    binarySearchNearest(id) {
        if (this.bsNearestCache.cacheId == id &&
            this.bsNearestCache.nearest != -1) {
            return this.bsNearestCache.nearest;
        }
        let lower = 0;
        let upper = this.length;
        while (lower < upper) {
            const mid = Math.floor(lower + (upper - lower) / 2);
            if (this[mid].id < id) {
                lower = mid + 1;
            }
            else {
                upper = mid;
            }
        }
        this.bsNearestCache.cacheId = id;
        this.bsNearestCache.nearest = lower;
        return lower;
    }
    binarySearchIndex(id) {
        const nearest = this.binarySearchNearest(id);
        if (nearest in this && this[nearest].id == id) {
            return nearest;
        }
        else {
            return -1;
        }
    }
    binarySearch(id) {
        const index = this.binarySearchIndex(id);
        if (index == -1) {
            return undefined;
        }
        else {
            return this[index];
        }
    }
    // 上書き・挿入
    insert(value) {
        const nearest = this.binarySearchNearest(value.id);
        if (nearest in this && this[nearest].id == value.id) {
            this[nearest] = value;
        }
        else {
            this.splice(nearest, 0, value);
        }
        return this[nearest];
    }
    toJSON() {
        return [...this];
    }
    //最初突合せてダメなら検索して見つかるかを返す。1つでも見つからないとfalse
    IsMatingOk(ids) {
        let i = 0;
        //正引きで突合せていく
        for (; i < ids.length; i++) {
            if (ids[i] != this[i]?.id) {
                break;
            }
        }
        for (; i < ids.length; i++) {
            if (this.binarySearch(ids[i]) == undefined) {
                break;
            }
        }
        return i == ids.length;
    }
    //最初突合せてダメなら検索した結果の配列を返す。1つでも見つからないとnull
    GetMatingList(ids) {
        const list = [];
        let i = 0;
        //正引きで突合せていく
        for (; i < ids.length; i++) {
            if (ids[i] != this[i]?.id) {
                break;
            }
            list.push(this[i]);
        }
        for (; i < ids.length; i++) {
            const t = this.binarySearch(ids[i]);
            if (t == undefined) {
                break;
            }
            list.push(t);
        }
        return i == ids.length ? list : null;
    }
}
;
//サーバーとの通信とりあえずスコープ作るだけ
class Fettcher {
    static async FetchNicoru(obj) {
        const method = "POST";
        const data = JSON.stringify(obj);
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const res = await Util.GMFetchText(Fettcher.END_POINT, { method, headers, data });
        //console.log(res);
        if (res == "") {
            return false;
        }
        const resJson = JSON.parse(res);
        return resJson.isSuccessful;
    }
    static async FetchNicorare(illustId) {
        const method = "GET";
        //console.log("FetchNicorare");
        const res = await Util.GMFetchText(Fettcher.END_POINT + "?illustId=" + illustId.toString(), { method });
        //console.log(res);
        if (res == "") {
            return null;
        }
        return JSON.parse(res);
    }
    static async FetchNicorares(illustIds) {
        const method = "POST";
        const data = JSON.stringify({ illustIds: illustIds });
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const res = await Util.GMFetchText(Fettcher.END_POINT, { method, headers, data });
        //console.log(res);
        if (res == "") {
            return null;
        }
        const resJson = JSON.parse(res);
        return resJson;
    }
}
Fettcher.END_POINT = "https://script.google.com/macros/s/AKfycbw90hndb0WxHRTh4lHhIfBVJgocf-iwVIi9ExLYQpPtlwXkgj555RE9tp5l8ro2vOG5PA/exec";
//クラス化サボってたら関数が増えたのでせめてコメントをつけた
//-----イラストページ
//イラストページでやること
const SetIllustPage = async () => {
    const res = await Fettcher.FetchNicorare(illustId);
    if (res == undefined || !res.isSuccessful || res.result == undefined) {
        console.error("fetch nicorare Error");
        return;
    }
    nicorares = res.result;
    document.head.insertAdjacentHTML("beforeend", `<style>
.nicoruSVG.enable {
	animation: nicoruSpinKey 200ms linear 1 normal forwards;
cursor: default;
}
.NicoruCell {
cursor:pointer;
}
.NicoruCell.enable {
cursor: default;
}
.NicoruCell.disable {
cursor: default;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info > .user{
margin:0;
}

@keyframes nicoruSpinKey {
	0% {transform: rotate(0deg);}
	100% {transform: rotate(-90deg);}
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item.user .comment_info.nicoruZero{
background-color:#f8f8f8;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item.user .comment_info.nicoruOne{
background-color:#fefbec;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item.user .comment_info.nicoruThree{
background-color:#fef5cf;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item.user .comment_info.nicoruSix{
background-color:#fdeba0;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item.user .comment_info.nicoruNine{
background-color:#fcd842;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info.nicoruZero{
background-color:#f8f8f8;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info.nicoruOne{
background-color:#fefbec;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info.nicoruThree{
background-color:#fef5cf;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info.nicoruSix{
background-color:#fdeba0;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info.nicoruNine{
background-color:#fcd842;
}
</style>`);
    commentListElements = await Util.Retry(() => Observer.DefinitelyGetElementsByClassName("comment_list"), 5, 1000, r => r.length >= 2) ?? [];
    if (commentListElements.length == 0) {
        console.error("commentListElementsが2つない");
        return;
    }
    SetNicoru(commentListElements.flatMap(l => Array.from(l.children)));
    const mutationObserver = new MutationObserver(async (mrs) => {
        const nicorus = new Set();
        for (let mr of mrs) {
            for (let i = 0; i < mr.addedNodes.length; i++) {
                const element = mr.addedNodes[i];
                if (!(element instanceof HTMLElement)) {
                    continue;
                }
                if (element.classList.contains("comment_list_item")) {
                    nicorus.add(element);
                }
                if (element.classList.contains("comment_list")) {
                    const children = element.children;
                    for (const c of children) {
                        nicorus.add(c);
                    }
                }
            }
        }
        SetNicoru(nicorus);
    });
    commentListElements.forEach(e => mutationObserver.observe(e, {
        childList: true
    }));
    const uniqueParents = Util.Unique(commentListElements.map(e => e.parentElement));
    uniqueParents.forEach(e => mutationObserver.observe(e, {
        childList: true
    }));
    await SetSubmitCommentObserver();
};
class MicroDOMTask {
    constructor() {
        this.isRun = false;
        this.observer = null;
        this.tasks = [];
        this.element = null;
    }
    AddTask(task) {
        this.tasks.push(task);
    }
    Observe(element, callback) {
        this.element = element;
        if (this.observer == null) {
            this.observer = new IntersectionObserver((entrys, o) => {
                for (const e of entrys) {
                    if (e.isIntersecting) {
                        callback();
                        o.disconnect();
                        return;
                    }
                }
            });
        }
        this.observer.observe(element);
    }
    Start() {
        if (this.element instanceof HTMLElement && this.element.hidden) {
            return false;
        }
        if (!this.isRun) {
            this.isRun = true;
            this.observer?.disconnect();
            for (const t of this.tasks) {
                t();
            }
            return true;
        }
        return false;
    }
}
class BigDOMTask {
    constructor() {
        this.taskList = [];
    }
    AddMicroTask(task, observeElement) {
        if (observeElement != undefined) {
            //task.Observe(observeElement, () => this.taskList.unshift(task)); //配列の先頭に追加
            task.Observe(observeElement, () => {
                this.taskList.unshift(null);
                requestAnimationFrame(() => task.Start());
            }); //次のでやる
            //task.Observe(observeElement, () => task.Start()); //すぐやる
            //それぞれ挙動が違って面白い・・・いや面白くはない！
        }
        this.taskList.push(task);
    }
    Start() {
        if (this.taskList.length > 0) {
            requestAnimationFrame(n => this.ProcessTask.call(this, n));
        }
    }
    ProcessTask(taskStartTime) {
        while (true) {
            const t = this.taskList.shift();
            if (t == undefined) {
                break;
            }
            if (t.Start()) {
                if (performance.now() - taskStartTime > 1) {
                    break;
                }
            }
        }
        if (this.taskList.length > 0) {
            requestAnimationFrame(n => this.ProcessTask.call(this, n));
        }
    }
}
const GetCommentId = (commentIdElement) => {
    const commentIdMatch = commentIdElement.textContent?.match(/\d+/) ?? [];
    if (!Util.HasLengthAtLeast(commentIdMatch, 1)) {
        console.error("comeNull");
        return null;
    }
    const commentId = parseInt(commentIdMatch[0]);
    if (isNaN(commentId)) {
        console.error("comeNaN");
        return null;
    }
    return commentId;
};
const GetCommentItemFromId = (commentListElement, id) => {
    const eSet = new Set();
    const commentIdElements = commentListElement.getElementsByClassName("id");
    for (const idE of commentIdElements) {
        if (GetCommentId(idE) == id) {
            eSet.add(idE.parentElement?.parentElement);
        }
    }
    return eSet;
};
const nicoru = `<li class="NicoruCell" style="display: flex;align-items: center;position: relative;height:15px;float:left;">
<span class="NicoruIcon NicoruCell-icon is-gray" title="ニコる" style="display: inline-block;width: 14px;position: relative;top: 2px;">
<svg class="nicoruSVG" viewBox="0 0 24 24" style="">
<circle cx="12" cy="12" r="9.3" fill="WHITE"></circle>
<path d="M12 22a10 10 0 1110-10 10 10 0 01-10 10zm0-18a8 8 0 108 8 8 8 0 00-8-8z" fill="#999999"></path>
<rect x="8.5" y="6.7" width="2" height="4.5" rx="1" ry="1" fill="#999999"></rect>
<rect x="13.5" y="6.7" width="2" height="4.5" rx="1" ry="1" fill="#999999"></rect>
<path d="M14.5 12.8a1 1 0 00-1 1v1.5h-3v-1.5a1 1 0 10-2 0v2.5a1 1 0 001 1h5a1 1 0 001-1v-2.5a1 1 0 00-1-1z" fill="#999999"></path>
</svg>
</span>
<span class="NicoruCell-count" data-nicoru-count="0" style="margin: 2px;margin-bottom: 2px;position: relative;top: 1px;">0</span>
</li>`;
const nicotta = `<li class="NicoruCell enable" style="display: flex;align-items: center;position: relative;height:15px;float:left;">
<span class="NicoruIcon NicoruCell-icon is-gray" title="ニコる" style="display: inline-block;width: 14px;position: relative;top: 2px;">
<svg class="nicoruSVG enable" viewBox="0 0 24 24" style="" transform="rotate(-90)">
<circle cx="12" cy="12" r="9.3" fill="YELLOW"></circle>
<path d="M12 22a10 10 0 1110-10 10 10 0 01-10 10zm0-18a8 8 0 108 8 8 8 0 00-8-8z" fill="BLACK !important"></path>
<rect x="8.5" y="6.7" width="2" height="4.5" rx="1" ry="1" fill="BLACK !important"></rect>
<rect x="13.5" y="6.7" width="2" height="4.5" rx="1" ry="1" fill="BLACK !important"></rect>
<path d="M14.5 12.8a1 1 0 00-1 1v1.5h-3v-1.5a1 1 0 10-2 0v2.5a1 1 0 001 1h5a1 1 0 001-1v-2.5a1 1 0 00-1-1z" fill="BLACK !important"></path>
</svg>
</span>
<span class="NicoruCell-count" data-nicoru-count="0" style="margin: 2px;margin-bottom: 2px;position: relative;top: 1px;">0</span>
</li>`;
const myComment = "<li class='MyComment' style='font-size: 83.3%; color: #aaaaaa; margin-right: 0px;' >自分</li>";
const nicoruElement = Util.HtmlToElement(nicoru);
const nicottaElement = Util.HtmlToElement(nicotta);
const myCommentElement = Util.HtmlToElement(myComment);
if (nicoruElement == null || nicottaElement == null || myCommentElement == null) {
    console.error("elementNull");
    throw new Error("elementNull");
}
//ニコるくんを設定
const SetNicoru = async (commentItemElements) => {
    let [nicottas, commentedArr, setting] = await Promise.all([
        nicottaStorage.GetDataOrDefault(),
        commentStorage.GetDataOrDefault(),
        settingStorage.GetDataOrDefault()
    ]);
    const bigTask = new BigDOMTask();
    const size = commentItemElements instanceof Set ?
        commentItemElements.size :
        commentItemElements.length;
    for (const info of commentItemElements) {
        const task = GetNicoruTask(info, nicottas, commentedArr, setting.nicoruPosition);
        if (task == undefined) {
            continue;
        }
        if (size < 15) {
            requestAnimationFrame(() => task.Start());
            continue;
        }
        //前回の位置を保存しておいてそこはすぐやる。。。
        bigTask.AddMicroTask(task, info);
    }
    bigTask.Start();
};
const GetNicoruTask = (info, nicottas, commentedArr, pos) => {
    const task = new MicroDOMTask();
    const commentIdElement = info.getElementsByClassName("id")[0];
    if (commentIdElement == undefined) {
        return;
    }
    const commentId = GetCommentId(commentIdElement);
    if (commentId == null) {
        return;
    }
    const isMyComment = commentedArr.binarySearch(illustId)?.comments.find(c => c.id == commentId);
    let nicotta = nicottas.binarySearch(illustId);
    const come = nicorares.find(comment => comment.id == commentId);
    const nicottaCome = nicotta?.comments.find(comment => comment.id == commentId);
    let num = come == undefined ? 0 : come.nicorare;
    if (nicottaCome != undefined && nicottaCome.nicorare > num) {
        num = nicottaCome.nicorare;
    }
    const element = (nicottaCome == undefined ? nicoruElement : nicottaElement).cloneNode(true);
    const countElement = element.getElementsByClassName("NicoruCell-count")[0];
    countElement.style.color = num == 0 ? "#999999" : "black";
    countElement.textContent = num.toString();
    const firestElement = info.firstElementChild;
    if (firestElement instanceof HTMLElement) {
        task.AddTask(() => SetNicoruColorClass(firestElement, num));
    }
    const oldMyComment = info.getElementsByClassName("MyComment")[0];
    if (nicottaCome == undefined) {
        const Nicoru = async (e) => {
            nicottas = await nicottaStorage.GetDataOrDefault();
            nicotta = nicottas.binarySearch(illustId);
            const already = nicotta?.comments.find(c => c.id == commentId);
            if (already != undefined) {
                countElement.textContent = already.nicorare.toString();
                console.warn("nicoru skip!");
                return;
            }
            num++;
            element.removeEventListener("click", Nicoru);
            element.classList.add("enable");
            element.getElementsByTagName("svg")[0]?.classList.add("enable");
            const rectAndPathEs = Array.from(element.querySelectorAll("rect, path"));
            for (let rp of rectAndPathEs) {
                rp.setAttribute("fill", "BLACK !important");
            }
            const circleE = element.getElementsByTagName("circle")[0];
            if (circleE == undefined) {
                console.error("circleがない");
                return;
            }
            circleE.setAttribute("fill", "YELLOW");
            countElement.style.color = "";
            if (info.firstElementChild != null) {
                SetNicoruColorClass(info.firstElementChild, num);
            }
            const comeText = info.getElementsByClassName("text")[0]?.textContent ?? "";
            const title = document.getElementsByClassName("title")[0]?.textContent ?? "";
            const date = new Date();
            if (nicotta == undefined) {
                nicotta = nicottas.insert({ id: illustId, title: title, comments: [{ id: commentId, nicorare: num, text: comeText, date: date }] });
                if (nicotta == undefined) {
                    console.error("nicottaが挿入失敗");
                    return;
                }
            }
            else {
                nicotta.comments.push({ id: commentId, nicorare: num, text: comeText, date: date });
            }
            const [_, res] = await Promise.all([
                LimitedSaveNicotta(undefined, nicottas),
                Fettcher.FetchNicoru({ illustId: illustId, commentId: commentId })
            ]);
            if (res) {
                countElement.textContent = num.toString();
                const list = document.getElementsByClassName("comment_list");
                const eSet = new Set();
                for (let e of list) {
                    if (e != info.parentElement) {
                        GetCommentItemFromId(e, commentId)
                            .forEach(e => eSet.add(e));
                    }
                }
                SetNicoru(eSet);
            }
            else {
                //失敗したらストレージも表示上も元に戻す
                num--;
                element.addEventListener("click", Nicoru);
                nicotta.comments = nicotta.comments.filter(c => c.id != commentId);
                if (nicotta.comments.length == 0) {
                    const index = nicottas.binarySearchIndex(nicotta.id);
                    nicottas.splice(index, 1); //要テスト
                }
                nicottaStorage.SetData(nicottas);
                element.classList.remove("enable");
                circleE.setAttribute("fill", "WHITE");
                for (let rp of rectAndPathEs) {
                    rp.setAttribute("fill", "#999999");
                }
                countElement.style.color = num == 0 ? "#999999" : "";
                if (info.firstElementChild != null) {
                    SetNicoruColorClass(info.firstElementChild, num);
                }
            }
        };
        //自分のコメントかどうか
        if (!isMyComment) {
            element.addEventListener("click", Nicoru);
            task.AddTask(() => {
                oldMyComment?.remove();
            });
        }
        else {
            element.classList.add("disable");
            const userElement = info.getElementsByClassName("user")[0];
            if (!(userElement instanceof HTMLElement)) {
                return;
            }
            if (userElement.style.display == "none") {
                const textElement = info.getElementsByClassName("text")[0];
                if (textElement == undefined) {
                    console.warn("textがない");
                }
                const newCommentElement = myCommentElement.cloneNode(true);
                task.AddTask(() => {
                    if (oldMyComment != undefined) {
                        oldMyComment.replaceWith(newCommentElement);
                    }
                    else {
                        textElement?.insertAdjacentElement("beforebegin", newCommentElement);
                    }
                });
            }
            else {
                task.AddTask(() => {
                    oldMyComment?.remove();
                    userElement.textContent = "自分";
                });
            }
        }
    }
    const insertTarget = pos.target == "Date" ? info.getElementsByClassName("date")[0] : commentIdElement;
    if (insertTarget == null) {
        return;
    }
    const insertPos = pos.where == "After" ? "afterend" : "beforebegin";
    const oldNicoru = info.getElementsByClassName("NicoruCell")[0];
    task.AddTask(() => {
        if (oldNicoru != undefined) {
            oldNicoru.replaceWith(element);
        }
        else {
            insertTarget.insertAdjacentElement(insertPos, element);
        }
    });
    return task;
};
const nicoruClassNameList = ["nicoruNine", "nicoruSix", "nicoruThree", "nicoruOne", "nicoruZero"];
//ニコられ数に応じた色
const SetNicoruColorClass = (element, num) => {
    nicoruClassNameList.forEach(c => element.classList.remove(c));
    element.classList.add(GetNicoruColorClass(num) ?? "");
};
const GetNicoruColorClass = (num) => {
    if (9 <= num) {
        return nicoruClassNameList[0];
    }
    if (6 <= num) {
        return nicoruClassNameList[1];
    }
    if (3 <= num) {
        return nicoruClassNameList[2];
    }
    if (1 <= num) {
        return nicoruClassNameList[3];
    }
    if (num == 0) {
        return nicoruClassNameList[4];
    }
};
//コメントしたときの処理を登録
const SetSubmitCommentObserver = async () => {
    const commentForm = await Observer.DefinitelyGetElementById("comment_post_form");
    commentForm.addEventListener("submit", async () => {
        const commentAddObserver = new MutationObserver(async (mrs) => {
            for (const mr of mrs) {
                for (let i = 0; i < mr.addedNodes.length; i++) {
                    const element = mr.addedNodes[i];
                    if (typeof element.getElementsByClassName != "function") {
                        continue;
                    }
                    const idElement = element?.getElementsByClassName("id")[0];
                    if (idElement == undefined) {
                        continue;
                    }
                    const commentId = GetCommentId(idElement);
                    if (commentId == null) {
                        continue;
                    }
                    //console.log(commentId);
                    commentAddObserver.disconnect();
                    const comments = await commentStorage.GetDataOrDefault();
                    let illust = comments.binarySearch(illustId);
                    const comeText = element?.getElementsByClassName("text")[0]?.textContent ?? "";
                    const title = document.getElementsByClassName("title")[0]?.textContent ?? "";
                    const date = new Date();
                    if (illust == undefined) {
                        illust = comments.insert({ id: illustId, title: title, comments: [{ id: commentId, nicorare: 0, text: comeText, date: date }] });
                    }
                    else {
                        illust.comments.push({ id: commentId, nicorare: 0, text: comeText, date: date });
                    }
                    await LimitedSaveCommented(undefined, comments);
                    return;
                }
            }
            commentAddObserver.disconnect();
        });
        if (!Util.HasLengthAtLeast(commentListElements, 1)) {
            console.error("commentListElementsがない");
            return;
        }
        commentAddObserver.observe(commentListElements[0], {
            childList: true
        });
    });
};
//-----イラストページ
//-----どのページでも実行するやつ(通知とリンク追加)
const CHECK_INTERVAL_TIME = 5 * 1000 * 60; //5分
//5分毎にやることのmain関数てきな
const CheckNoticeInterval = async () => {
    let checkedDate = await storage.GetData();
    const now = new Date();
    let nicorares;
    if (checkedDate == null) {
        await storage.SetData(now);
        nicorares = await CheckNicorares();
    }
    else {
        const diff = now.getTime() - checkedDate.getTime();
        if (diff > CHECK_INTERVAL_TIME) {
            await storage.SetData(now);
            nicorares = await CheckNicorares();
        }
    }
    if (nicorares == undefined) {
        nicorares = await nicorareStorage.GetDataOrDefault();
    }
    await SetNoticeIconBadge(nicorares.some(n => n.needNotification));
};
//コメントがニコられたかサーバーに問い合わせて結果をストレージに
const CheckNicorares = async () => {
    const [comments, setting] = await Promise.all([
        commentStorage.GetDataOrDefault(),
        settingStorage.GetDataOrDefault()
    ]);
    const orderDesByDates = comments.sortNonDestructive((a, b) => b.comments[b.comments.length - 1].date.getTime() - a.comments[a.comments.length - 1].date.getTime());
    if (setting.nicorareCheckMax != -1) {
        orderDesByDates.length = Math.min(orderDesByDates.length, setting.nicorareCheckMax);
    }
    const nicoraresResult = await Fettcher.FetchNicorares(orderDesByDates.map(illust => illust.id));
    if (!(nicoraresResult?.isSuccessful ?? false)) {
        console.error("CheckNicorares error");
        return;
    }
    const fetchedIllusts = nicoraresResult?.result;
    if (fetchedIllusts == undefined) {
        return;
    }
    const nicorares = await nicorareStorage.GetDataOrDefault();
    for (const fetchedIllust of fetchedIllusts) {
        const commentedIllust = comments.binarySearch(fetchedIllust.id);
        if (commentedIllust == undefined) {
            continue;
        }
        for (const fetchedCome of fetchedIllust.come) {
            const come = commentedIllust.comments.find(c => c.id == fetchedCome.id);
            if (come == undefined || come.nicorare == fetchedCome.nicorare) {
                continue;
            }
            //増えたときだけ
            if (come.nicorare < fetchedCome.nicorare) {
                nicorares.push({
                    id: commentedIllust.id,
                    commentId: fetchedCome.id,
                    addedNicorare: fetchedCome.nicorare - come.nicorare,
                    needNotification: true,
                    gettingTime: new Date()
                });
            }
            come.nicorare = fetchedCome.nicorare;
        }
    }
    await Promise.all([
        LimitedSaveNicorare(undefined, nicorares),
        commentStorage.SetData(comments) //come.nicorareが変わってるかもしれないから保存
    ]);
    return nicorares;
};
//通知アイコンに赤いの出したり消したり（バッジって言うらしい）
const SetNoticeIconBadge = async (sw) => {
    const noticeCirclePPP = await Util.WithTimeOut(Observer.DefinitelyGetElementByClassName("common-header-dandf8", undefined, { childList: true, subtree: true, isDeepSearch: true }), 10000);
    let noticeCircleParent = noticeCirclePPP?.firstElementChild?.firstElementChild ?? null;
    if (noticeCircleParent == null) {
        const commentHeader = document.getElementById("CommonHeader");
        noticeCircleParent = commentHeader?.firstElementChild?.firstElementChild?.firstElementChild?.children[1]?.children[1]?.firstElementChild?.firstElementChild?.firstElementChild ?? null;
        if (noticeCircleParent == null) {
            console.error("noticeCircleParentがない・・・");
            return;
        }
    }
    if (Util.HasLengthAtLeast(noticeCircleParent.childNodes, 3)) {
        noticeCircleParent.removeChild(noticeCircleParent.childNodes[2]);
    }
    if (sw) {
        const noticeCircleText = `<circle cx="17" cy="4" r="4" fill="#D0021B" fill-rule="nonzero" style="--darkreader-inline-fill: #fd3b52;" data-darkreader-inline-fill=""></circle>`;
        const noticeCircleElement = Util.HtmlToSVG(noticeCircleText);
        noticeCircleParent.appendChild(noticeCircleElement);
    }
};
const dateRegex = /^(\d+)月(\d+)日\s*(\d+):(\d+)/;
const minuteAgoRegex = /^(\d+)分前/;
const hourAgoRegex = /^(\d+)時間前/;
const IsDateString = (str) => {
    return dateRegex.test(str) ||
        minuteAgoRegex.test(str) ||
        hourAgoRegex.test(str);
};
const ToDateFromDateString = (str) => {
    let matched = str.match(dateRegex);
    if (matched == null) {
        return null;
    }
    matched.shift();
    const ints = matched.map(m => parseInt(m));
    if (!Util.HasLengthAtLeast(ints, 4)) {
        return null;
    }
    return new Date(new Date().getFullYear(), ints[0] - 1, ints[1], ints[2], ints[3]);
};
const ToDateFromMinuteAgoString = (str) => {
    const matched = str.match(minuteAgoRegex);
    if (matched == null) {
        return null;
    }
    if (!Util.HasLengthAtLeast(matched, 2)) {
        return null;
    }
    const minute = parseInt(matched[1]);
    const now = new Date();
    return new Date(now.getTime() - minute * 60 * 1000);
};
const ToDateFromHourAgoString = (str) => {
    const matched = str.match(hourAgoRegex);
    if (matched == null) {
        return null;
    }
    if (!Util.HasLengthAtLeast(matched, 2)) {
        return null;
    }
    const hour = parseInt(matched[1]);
    const now = new Date();
    return new Date(now.getTime() - hour * 60 * 60 * 1000);
};
const ToDate = (str) => {
    const fromDate = ToDateFromDateString(str);
    if (fromDate != null) {
        return fromDate;
    }
    const fromHourAgo = ToDateFromHourAgoString(str);
    if (fromHourAgo != null) {
        return fromHourAgo;
    }
    const fromMinuteAgo = ToDateFromMinuteAgoString(str);
    if (fromMinuteAgo != null) {
        return fromMinuteAgo;
    }
    return null;
};
const ToFormatStringDate = (from) => {
    // 現在時刻との差分＝経過時間
    var diff = new Date().getTime() - from.getTime();
    // 経過時間をDateに変換
    var elapsed = new Date(diff);
    // 大きい単位から順に表示
    if (elapsed.getUTCFullYear() - 1970 || elapsed.getUTCMonth() || elapsed.getUTCDate() - 1) {
        const mo = (from.getMonth() + 1).toString();
        const d = from.getDate().toString().padStart(2, "0");
        const h = from.getHours().toString().padStart(2, "0");
        const mi = from.getMinutes().toString().padStart(2, "0");
        return `${mo}月${d}日 ${h}:${mi}`;
    }
    else if (elapsed.getUTCHours()) {
        return elapsed.getUTCHours().toString() + '時間前';
    }
    else if (elapsed.getUTCMinutes()) {
        return elapsed.getUTCMinutes().toString() + '分前';
    }
    else {
        return '今';
    }
};
//通知アイコンマウスオーバーしたときの処理登録
const SetNoticeIconMouseoverObserver = async () => {
    let observeTarget = await Util.WithTimeOut(Observer.DefinitelyGetElementByClassName("common-header-6zywm", undefined, { childList: true, subtree: true, isDeepSearch: true }), 10000);
    if (observeTarget == null) {
        const commentHeader = document.getElementById("CommonHeader");
        observeTarget = commentHeader?.firstElementChild?.firstElementChild?.firstElementChild?.children?.[1]?.children[1] ?? null;
        if (observeTarget == null) {
            console.error("observeTargetがない・・・");
            return;
        }
    }
    while (true) {
        //今ー＞x分前
        await Observer.WaitAddedNode(e => {
            if (e instanceof Element) {
                //孫も含めた全要素で日付っぽいか判定
                const allChildren = Array.from(e.getElementsByTagName("*"));
                for (const element of allChildren) {
                    if (IsDateString(element.textContent ?? "") &&
                        element.getElementsByClassName("SeigaNicorareNoticeDate").length == 0) { //自分で追加したのじゃないことを判定
                        return element;
                    }
                }
            }
            return null;
        }, observeTarget, { childList: true, subtree: true });
        const [comes, nicorares, setting] = await Promise.all([
            commentStorage.GetDataOrDefault(),
            nicorareStorage.GetDataOrDefault(),
            settingStorage.GetDataOrDefault()
        ]);
        if (nicorares.some(n => n.needNotification)) {
            for (const nicorare of nicorares) {
                nicorare.needNotification = false;
            }
            await nicorareStorage.SetData(nicorares); //通知必要になってたらfalseにしてセット
        }
        await SetNoticeIconBadge(false);
        const commentedArr = comes;
        //このスクリプトで追加したのを消す
        const myNicorareNotices = Array.from(observeTarget.getElementsByClassName("SeigaNicorareNotice"));
        for (const e of myNicorareNotices) {
            e.remove();
        }
        const allChildren = Array.from(observeTarget.getElementsByTagName("*"));
        const alwaysNoticeDateElements = allChildren.filter(e => e.firstChild?.nodeType == Node.TEXT_NODE && IsDateString(e.firstChild?.textContent ?? ""));
        const alwaysNoticeDates = alwaysNoticeDateElements
            .map(e => e.textContent ?? "")
            .map(t => {
            return ToDate(t) ?? new Date();
        });
        let addedCount = 0;
        //降順
        const orderDesByDates = nicorares.sortNonDestructive((a, b) => b.gettingTime.getTime() - a.gettingTime.getTime());
        for (const nicorare of orderDesByDates) {
            if (setting.nicorareNoticeMax != -1 && addedCount >= setting.nicorareNoticeMax) {
                break;
            }
            const illust = commentedArr.binarySearch(nicorare.id);
            const come = illust?.comments.find(c => c.id == nicorare.commentId);
            if (come == null || illust == null) {
                continue;
            }
            const date = new Date(nicorare.gettingTime);
            const dateText = ToFormatStringDate(date) + "(取得日時)";
            const text = come.text.length < 45 ? come.text : come.text.substr(0, 50) + "......";
            const noticeElementText = `
<div class="common-header-1swev0c SeigaNicorareNotice" style="overflow-x:clip;">
<a class="common-header-d2321f" href="https://seiga.nicovideo.jp/my/SeigaNicoru?type=Nicorare" target="_blank">
<div class="common-header-1hpqfmt">
<img class="common-header-uqv5mu" src="https://secure-dcdn.cdn.nimg.jp/nfront/inform/168d439de9621eeeeddec11dd760b2ef.png" alt="静画コメントがニコられました。">
</div>
<div class="common-header-vv8zyj" style="font-weight: bold;">静画コメントがニコられました。
</div>
<div class="common-header-uruoug">
<div class="common-header-ey0i79">${text}
</div>
</div>

<div class="common-header-9l26sq SeigaNicorareNoticeDate">${dateText}</div>

<div class="common-header-1frfhkj">
<svg viewBox="0 0 16 16">
<g fill="none" fill-rule="evenodd">
<path d="M0 0h16v16H0z">
</path>
<path fill="#C2C2C2" d="M2.91 13.09H1a1 1 0 01-1-1V2.456a1 1 0 011-1h11.09a1 1 0 011 1v1.909H15a1 1 0 011 1V15a1 1 0 01-1 1H3.91a1 1 0 01-1-1v-1.91zm10.18-7.272v6.273a1 1 0 01-1 1H4.365v1.454h10.181V5.818h-1.454zM1.456 2.91v8.727h10.181V2.91H1.455z" style="--darkreader-inline-fill: #c1bcb4;" data-darkreader-inline-fill="">
</path>
</g>
</svg>
</div>
</a>
<a  href="https://seiga.nicovideo.jp/seiga/im${illust.id}" target="_blank" style="top: -20px;
left: 223px;
position: relative;
right: 0;
margin: 0;
bottom:0;
float:left;
display: inline;">
<input class="toIllustInput" type="button" value="イラストへ">
</a>
</div>`;
            const noticeElement = Util.HtmlToElement(noticeElementText);
            const toIllustInput = noticeElement.getElementsByClassName("toIllustInput")[0];
            toIllustInput?.addEventListener('auxclick', (e) => {
                if (e?.button == 1) {
                    toIllustInput.click();
                }
            });
            for (let i = 0; i < alwaysNoticeDates.length; i++) {
                if (alwaysNoticeDates[i].getTime() < date.getTime()) {
                    const parent = alwaysNoticeDateElements[i]?.parentElement?.parentElement;
                    if (parent == null) {
                        continue;
                    }
                    parent.parentElement?.insertBefore(noticeElement, parent);
                    addedCount++;
                    break;
                }
            }
        }
    }
};
//https://seiga.nicovideo.jp/my/SeigaNicoru
//のリンクヘッダーにねじ込む
const AddSeigaNicoruLinkToHeader = async () => {
    let commentHeader = await Util.WithTimeOut(Observer.DefinitelyGetElementById("CommonHeader", undefined, { childList: true, subtree: true, isDeepSearch: true }), 10000);
    if (commentHeader == null) {
        console.error("commentHeaderがない・・・");
    }
    const headerObserver = new MutationObserver(async (mrs) => {
        for (let mr of mrs) {
            for (let i = 0; i < mr.addedNodes.length; i++) {
                const element = mr.addedNodes[i];
                if (element.classList != null && element == commentHeader?.firstElementChild?.firstElementChild?.firstElementChild?.children[1]?.children[1]?.children[2]) {
                    const list = element.firstElementChild?.children[1]?.children[1] ?? null;
                    if (list == null) {
                        console.error("listがない・・・");
                        return;
                    }
                    const cloned = list.firstElementChild?.cloneNode(true);
                    cloned.href = "https:\/\/seiga.nicovideo.jp/my/SeigaNicoru";
                    cloned.firstElementChild.textContent = "静画ニコる";
                    list.insertAdjacentElement("beforeend", cloned);
                    //console.log("開いた");
                    return;
                }
            }
        }
    });
    headerObserver.observe(commentHeader ?? document, {
        childList: true,
        subtree: true
    });
};
//-----どのページでも実行するやつ
//-----静画ニコるページ
//パンくずリストを変更
const ChangePankuzuSeigaNicoruPage = () => {
    document.querySelectorAll(".active span[itemprop=title]").forEach(t => {
        t.innerHTML = `静画ニコる`;
    });
};
//-メイン
const seigaNicoruPageTypes = ["Nicorare", "Nicotta", "Commented", "Setting"];
let isSeigaNicoruPageInit = false;
const SetSeigaNicoruPage = async (type) => {
    const url = new URL(location.href);
    type = type ?? url.searchParams.get("type");
    const wrapper = await Observer.DefinitelyGetElementById("wrapper");
    if (wrapper == null) {
        return;
    }
    let contentParent = document.getElementById("SeigaNicoruContentParent");
    if (contentParent == null) {
        contentParent = document.createElement("div");
        contentParent.id = "SeigaNicoruContentParent";
        contentParent.style.display = "flex";
        contentParent.style.maxWidth = "1050px";
        contentParent.style.margin = "0 auto";
        contentParent.style.backgroundColor = "rgb(253, 253, 253)";
        wrapper.appendChild(contentParent);
    }
    if (!isSeigaNicoruPageInit) {
        isSeigaNicoruPageInit = true;
        document.body.style.backgroundColor = "#eeeeee";
        const errorWrapperElement = await Observer.DefinitelyGetElementByClassName("error-wrapper");
        errorWrapperElement.remove();
        const ul = document.createElement("div");
        ul.id = "SeigaNicoruSubMenu";
        ul.style.marginLeft = "20px";
        ul.style.marginTop = "20px";
        ul.style.paddingRight = "10px";
        ul.style.borderRight = "solid 1px";
        contentParent.appendChild(ul);
        await SetSeigaNicoruSubMenuPage(ul);
        ChangePankuzuSeigaNicoruPage();
    }
    let content = document.getElementById("SeigaNicoruContent");
    if (content == null) {
        content = document.createElement("div");
        content.id = "SeigaNicoruContent";
        contentParent.appendChild(content);
    }
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    if (type == null) {
        type = "Nicorare";
    }
    const links = contentParent.getElementsByClassName(`SubMenuLink`);
    for (const link of Array.from(links)) {
        if (link.classList.contains(type)) {
            link.style.backgroundColor = "#e5f2ff";
            link.style.color = "rgb(51, 164, 255)";
        }
        else {
            link.style.backgroundColor = "";
            link.style.color = "";
        }
    }
    document.title = `ニコ履歴:${GetSeigaNicoruSubMenuLabelString(type)}`;
    switch (type) {
        case "Nicorare":
            SetSeigaNicoruNicorarePage(content);
            break;
        case "Nicotta":
            SetSeigaNicoruNicottaPage(content);
            break;
        case "Commented":
            SetSeigaNicoruCommentedPage(content);
            break;
        case "Setting":
            SetSeigaNicoruSettingPage(content);
            break;
    }
};
//-メイン
//-サブメニュー（左のやつ）
const GetSeigaNicoruSubMenuLabelString = (type) => {
    switch (type) {
        case "Nicotta":
            return "ニコった";
        case "Nicorare":
            return "ニコられ";
        case "Commented":
            return "コメ履歴";
        case "Setting":
            return "設定";
    }
};
const SetSeigaNicoruSubMenuPage = async (parent) => {
    for (const type of seigaNicoruPageTypes) {
        const liText = `
<li class="SubMenuLink ${type}">
<span class="SubMenuLink-label">${GetSeigaNicoruSubMenuLabelString(type)}
</span>
</li>
`;
        const subMenuLinkElement = Util.HtmlToElement(liText);
        subMenuLinkElement.style.cursor = "pointer";
        subMenuLinkElement.style.fontSize = "15px";
        subMenuLinkElement.style.borderBottom = "solid 1px";
        subMenuLinkElement.style.padding = "10px 24px";
        subMenuLinkElement.style.paddingLeft = "6px";
        subMenuLinkElement.style.whiteSpace = "nowrap";
        subMenuLinkElement.addEventListener("click", () => {
            SetSeigaNicoruPage(type);
            const url = new URL(location.href);
            url.searchParams.set("type", type);
            history.replaceState("", `静画ニコる:${GetSeigaNicoruSubMenuLabelString(type)}`, url.href);
        });
        parent.appendChild(subMenuLinkElement);
    }
};
//-サブメニュー
//-設定ページ
const nicoruInsertTargets = {
    "Date": "日付",
    "Id": "ID"
};
const nicoruInsertPositions = {
    "Before": "前",
    "After": "後"
};
class SeigaNicoruSetting {
    constructor(other) {
        this.nicorareMax = -1;
        this.nicottaMax = -1;
        this.commentedMax = -1;
        this.nicorareCheckMax = 100;
        this.nicorareNoticeMax = 5;
        this.nicoruPosition = {
            target: "Id",
            where: "After"
        };
        if (other) {
            Object.assign(this, other);
        }
    }
}
const GetInputTextInDiv = (value, label, changedCallback) => {
    const div = document.createElement("div");
    div.textContent = label;
    div.style.margin = "10px";
    const inputText = document.createElement("input", {});
    inputText.type = "text";
    inputText.value = value.toString();
    div.appendChild(inputText);
    inputText.addEventListener("change", async (ev) => {
        if (!(ev.target instanceof HTMLInputElement)) {
            return;
        }
        let int = parseInt(ev.target.value);
        if (isNaN(int) || int < -1) {
            int = value;
        }
        ev.target.value = (await changedCallback(int)).toString();
    });
    return div;
};
const SetSeigaNicoruSettingPage = async (parent) => {
    const p = document.createElement("div");
    p.style.margin = "20px";
    parent.appendChild(p);
    const setting = await settingStorage.GetDataOrDefault();
    const info = document.createElement("div");
    info.textContent = "数値は-1で無限";
    p.appendChild(info);
    const nicorareMaxDiv = GetInputTextInDiv(setting.nicorareMax, "ニコられ保存数", val => SetNicorareMax(val));
    p.appendChild(nicorareMaxDiv);
    const nicottaMaxDiv = GetInputTextInDiv(setting.nicottaMax, "ニコった保存数", val => SetNicottaMax(val));
    p.appendChild(nicottaMaxDiv);
    const commentedMaxDiv = GetInputTextInDiv(setting.commentedMax, "コメ履歴保存数", val => SetCommentedMax(val));
    p.appendChild(commentedMaxDiv);
    const nicorareCheckMaxDiv = GetInputTextInDiv(setting.nicorareCheckMax, "ニコられチェックするコメント数", (val) => {
        setting.nicorareCheckMax = val;
        settingStorage.SetData(setting);
        return setting.nicorareCheckMax;
    });
    p.appendChild(nicorareCheckMaxDiv);
    const nicorareNoticeMaxDiv = GetInputTextInDiv(setting.nicorareNoticeMax, "ニコられ通知に表示する最大数", (val) => {
        setting.nicorareNoticeMax = val;
        settingStorage.SetData(setting);
        return setting.nicorareNoticeMax;
    });
    p.appendChild(nicorareNoticeMaxDiv);
    const nicoruPos = document.createElement("div");
    nicoruPos.textContent = "ニコるアイコンの位置";
    nicoruPos.style.margin = "5px";
    p.appendChild(nicoruPos);
    const targetSelect = document.createElement("select");
    targetSelect.style.margin = "5px";
    for (let target of Object.keys(nicoruInsertTargets)) {
        const targetElement = document.createElement("option");
        targetElement.value = target;
        targetElement.textContent = nicoruInsertTargets[target];
        if (setting.nicoruPosition.target == target) {
            targetElement.selected = true;
        }
        targetSelect.appendChild(targetElement);
    }
    targetSelect.addEventListener("change", e => {
        const target = e.target;
        const val = target.value;
        setting.nicoruPosition.target = val in nicoruInsertTargets ? val : "Id";
        settingStorage.SetData(setting);
    });
    nicoruPos.appendChild(targetSelect);
    const betweenEelect = document.createElement("span");
    betweenEelect.style.margin = "5px";
    betweenEelect.textContent = "の";
    nicoruPos.appendChild(betweenEelect);
    const posSelect = document.createElement("select");
    posSelect.style.margin = "5px";
    for (let pos of Object.keys(nicoruInsertPositions)) {
        const posElement = document.createElement("option");
        posElement.value = pos;
        posElement.textContent = nicoruInsertPositions[pos];
        if (setting.nicoruPosition.where == pos) {
            posElement.selected = true;
        }
        posSelect.appendChild(posElement);
    }
    posSelect.addEventListener("change", e => {
        const target = e.target;
        const val = target.value;
        setting.nicoruPosition.where = val in nicoruInsertPositions ? val : "After";
        settingStorage.SetData(setting);
    });
    nicoruPos.appendChild(posSelect);
};
//-設定ページ
//-その他各ページ
const SetSeigaNicoruCommentedPage = async (parent) => {
    const ul = document.createElement("ul");
    parent.appendChild(ul);
    const illusts = await commentStorage.GetDataOrDefault();
    for (let illust of illusts) {
        for (let comment of illust.comments) {
            comment.date = new Date(comment.date);
        }
    }
    const dateSorted = illusts.sortNonDestructive((a, b) => {
        return b.comments[b.comments.length - 1].date.getTime() - a.comments[a.comments.length - 1].date.getTime();
    });
    for (let illust of dateSorted) {
        const illustElement = CreateIllustElement(illust);
        ul.appendChild(illustElement);
    }
    if (dateSorted.length == 0) {
        const div = document.createElement("div");
        div.textContent = "まだコメントしてません。";
        div.style.margin = "30px";
        ul.appendChild(div);
    }
};
const SetSeigaNicoruNicottaPage = async (parent) => {
    const ul = document.createElement("ul");
    parent.appendChild(ul);
    const illusts = await nicottaStorage.GetDataOrDefault();
    for (let illust of illusts) {
        for (let comment of illust.comments) {
            comment.date = new Date(comment.date);
        }
    }
    const dateSorted = illusts.sortNonDestructive((a, b) => {
        return b.comments[b.comments.length - 1].date.getTime() - a.comments[a.comments.length - 1].date.getTime();
    });
    for (let illust of dateSorted) {
        const illustElement = CreateIllustElement(illust);
        ul.appendChild(illustElement);
    }
    if (dateSorted.length == 0) {
        const div = document.createElement("div");
        div.textContent = "まだニコってません。";
        div.style.margin = "30px";
        ul.appendChild(div);
    }
};
const SetSeigaNicoruNicorarePage = async (parent) => {
    const ul = document.createElement("ul");
    parent.appendChild(ul);
    const illusts = await commentStorage.GetDataOrDefault();
    const nicorares = await nicorareStorage.GetDataOrDefault();
    const dateSorted = nicorares.sortNonDestructive((a, b) => {
        return b.gettingTime.getTime() - a.gettingTime.getTime();
    });
    for (const nicorare of dateSorted) {
        nicorare.gettingTime = new Date(nicorare.gettingTime);
        const illust = illusts.binarySearch(nicorare.id);
        const comment = illust?.comments.find(c => c.id == nicorare.commentId);
        if (illust == undefined || comment == undefined) {
            continue;
        }
        comment.date = new Date(comment.date);
        const illustElement = CreateIllustElement(illust, comment.id);
        const nicorukunDiv = document.createElement("div");
        nicorukunDiv.className = "NicoruHistoryPassive";
        nicorukunDiv.style.marginTop = "10px";
        const dateText = document.createElement("div");
        nicorukunDiv.appendChild(dateText);
        //2021/1/5 22:12
        const y = nicorare.gettingTime.getFullYear().toString();
        const mo = (nicorare.gettingTime.getMonth() + 1).toString();
        const d = nicorare.gettingTime.getDate().toString();
        const h = nicorare.gettingTime.getHours().toString().padStart(2, "0");
        const mi = nicorare.gettingTime.getMinutes().toString().padStart(2, "0");
        dateText.innerHTML = `${y}/${mo}/${d} ${h}:${mi}</br>(取得日時)`;
        dateText.style.whiteSpace = "nowrap";
        dateText.style.margin = "0px";
        dateText.style.fontSize = "70%";
        dateText.style.color = "#b3aac2";
        const nicorukun = document.createElement("span");
        nicorukun.className = "NicoruHistoryPassiveNicorukun";
        nicorukun.style.backgroundImage =
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='9.3' fill='%23fcd842'/%3E%3Cpath d='M12 22a10 10 0 1110-10 10 10 0 01-10 10zm0-18a8 8 0 108 8 8 8 0 00-8-8z' fill='%23252525'/%3E%3Crect x='8.5' y='6.7' width='2' height='4.5' rx='1' ry='1' fill='%23252525'/%3E%3Crect x='13.5' y='6.7' width='2' height='4.5' rx='1' ry='1' fill='%23252525'/%3E%3Cpath d='M14.5 12.8a1 1 0 00-1 1v1.5h-3v-1.5a1 1 0 10-2 0v2.5a1 1 0 001 1h5a1 1 0 001-1v-2.5a1 1 0 00-1-1z' fill='%23252525'/%3E%3C/svg%3E")`;
        nicorukun.style.transform = `rotate(-90deg)`;
        nicorukun.style.width = `24px`;
        nicorukun.style.height = `24px`;
        nicorukun.style.display = "inline-block";
        nicorukunDiv.appendChild(nicorukun);
        const nicorukunCount = document.createElement("span");
        nicorukunCount.className = "NicoruHistoryPassiveCount";
        nicorukunCount.innerHTML = nicorare.addedNicorare.toString();
        nicorukunCount.style.position = "relative";
        nicorukunCount.style.top = "-6px";
        nicorukunCount.style.fontSize = "150%";
        nicorukunDiv.appendChild(nicorukunCount);
        const comeText = illustElement.getElementsByClassName("ComeText")[0];
        comeText.style.fontSize = "130%";
        comeText.style.lineHeight = "130%";
        comeText.style.marginTop = "6px";
        if (comeText.parentElement != null) {
            comeText.parentElement.style.border = "";
        }
        const comes = illustElement.getElementsByClassName("Comes")[0];
        comes.style.display = "flex";
        comes.style.justifyContent = "space-between";
        comes.appendChild(nicorukunDiv);
        ul.appendChild(illustElement);
        nicorare.needNotification = false;
    }
    //needNotificationが変わってるかも
    await nicorareStorage.SetData(nicorares);
    if (dateSorted.length == 0) {
        const div = document.createElement("div");
        div.textContent = "まだニコられてません。";
        div.style.margin = "30px";
        ul.appendChild(div);
    }
};
const CreateIllustElement = (illust, commentId) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.padding = "10px";
    li.style.borderBottom = "solid 1px";
    const a = document.createElement("a");
    li.appendChild(a);
    a.style.margin = "5px";
    a.href = `https:\/\/seiga.nicovideo.jp/seiga/im${illust.id}`;
    a.style.width = "180px";
    a.style.height = "180px";
    a.style.display = "flex";
    a.style.flexDirection = "column"; /* 子要素をflexboxにより縦方向に揃える
    a.style.justifyContent = "center"; /* 子要素をflexboxにより中央に配置する */
    a.style.alignItems = "center"; /* 子要素をflexboxにより中央に配置する */
    const img = document.createElement("img");
    a.appendChild(img);
    img.src = `https:\/\/lohas.nicoseiga.jp\/thumb/${illust.id}u`;
    img.style.maxHeight = "100%";
    img.style.maxWidth = "100%";
    const titleComeFlex = document.createElement("div");
    li.appendChild(titleComeFlex);
    titleComeFlex.style.margin = "5px";
    titleComeFlex.style.width = "100%";
    const title = document.createElement("div");
    titleComeFlex.appendChild(title);
    title.textContent = illust.title;
    title.className = "title";
    title.style.fontSize = "130%";
    title.style.margin = "10px";
    const comes = document.createElement("div");
    titleComeFlex.appendChild(comes);
    comes.style.margin = "10px";
    comes.className = "Comes";
    for (const come of illust.comments) {
        if (commentId != undefined && come.id != commentId) {
            continue;
        }
        const comeP = document.createElement("div");
        comes.appendChild(comeP);
        comeP.style.margin = "10px";
        comeP.style.borderBottom = "solid 1px";
        comeP.style.borderColor = "rgb(179, 170, 194)";
        const dateText = document.createElement("div");
        comeP.appendChild(dateText);
        //2021/1/5 22:12
        const y = come.date.getFullYear().toString();
        const mo = (come.date.getMonth() + 1).toString();
        const d = come.date.getDate().toString();
        const h = come.date.getHours().toString().padStart(2, "0");
        const mi = come.date.getMinutes().toString().padStart(2, "0");
        dateText.textContent = `${y}/${mo}/${d} ${h}:${mi}`;
        dateText.style.margin = "0px";
        dateText.style.fontSize = "70%";
        dateText.style.color = "#b3aac2";
        const comeText = document.createElement("div");
        comeText.className = "ComeText";
        comeP.appendChild(comeText);
        comeText.textContent = come.text;
        comeText.style.wordBreak = "break-word";
        comeText.style.maxWidth = "500px";
    }
    return li;
};
//-その他各ページ
//-----静画ニコるページ
//これでDateにキャストしなくてよくなったけど互換性のため使うときにいちいちキャストしてる
GMStorage.RegisterClass(Date);
GMStorage.RegisterClass(SortedArray);
//グローバル
let nicorares;
let illustId;
let commentListElements;
const storage = new GMStorage("CHECK_DATE", Date);
const nicottaStorage = new GMStorage("NICOTTA", SortedArray);
const commentStorage = new GMStorage("COMMENTED", SortedArray);
const nicorareStorage = new GMStorage("NICORARE", SortedArray);
const settingStorage = new GMStorage("SETTING", SeigaNicoruSetting);
//似たような処理書きまくってる
//ストレージごとにクラス化してインターフェース実装でもいいけど面倒
//要素が増えたかもしれないときはこっち使うとかいう酷いルール...
const LimitedSaveNicorare = async (setting, nicorares) => {
    setting = setting ?? (await settingStorage.GetDataOrDefault());
    nicorares = nicorares ?? await nicorareStorage.GetDataOrDefault();
    //制限以内ならそのままセーブ
    if (setting.nicorareMax == -1 || nicorares.length <= setting.nicorareMax) {
        await nicorareStorage.SetData(nicorares);
        return;
    }
    for (let nicorare of nicorares) {
        nicorare.gettingTime = new Date(nicorare.gettingTime);
    }
    const dateSorted = nicorares.sortNonDestructive((a, b) => {
        return b.gettingTime.getTime() - a.gettingTime.getTime();
    });
    dateSorted.length = setting.nicorareMax;
    await nicorareStorage.SetData(new SortedArray(dateSorted));
};
const SetNicorareMax = async (limit, setting, nicorares) => {
    setting = setting ?? (await settingStorage.GetDataOrDefault());
    nicorares = nicorares ?? await nicorareStorage.GetDataOrDefault();
    if (limit == -1 || limit >= nicorares.length) {
        setting.nicorareMax = limit;
        settingStorage.SetData(setting);
        return setting.nicorareMax;
    }
    if (!window.confirm(`${nicorares.length - limit}件削除されます。OK？`)) {
        return setting.nicorareMax;
    }
    setting.nicorareMax = limit;
    await Promise.all([
        settingStorage.SetData(setting),
        LimitedSaveNicorare(setting, nicorares)
    ]);
    return setting.nicorareMax;
};
const LimitedSaveNicotta = async (setting, illusts) => {
    setting = setting ?? (await settingStorage.GetDataOrDefault());
    illusts = illusts ?? await nicottaStorage.GetDataOrDefault();
    //制限以内ならそのままセーブ
    if (setting.nicottaMax == -1 || nicorares.length <= setting.nicottaMax) {
        await nicottaStorage.SetData(illusts);
        return;
    }
    for (let illust of illusts) {
        for (let comment of illust.comments) {
            comment.date = new Date(comment.date);
        }
    }
    const dateSorted = illusts.sortNonDestructive((a, b) => {
        return b.comments[b.comments.length - 1].date.getTime() - a.comments[a.comments.length - 1].date.getTime();
    });
    dateSorted.length = setting.nicottaMax;
    await nicottaStorage.SetData(new SortedArray(dateSorted));
};
const SetNicottaMax = async (limit, setting, illusts) => {
    setting = setting ?? (await settingStorage.GetDataOrDefault());
    illusts = illusts ?? await nicottaStorage.GetDataOrDefault();
    if (limit == -1 || limit >= illusts.length) {
        setting.nicottaMax = limit;
        settingStorage.SetData(setting);
        return setting.nicottaMax;
    }
    if (!window.confirm(`${illusts.length - limit}件削除されます。OK？`)) {
        return setting.nicottaMax;
    }
    setting.nicottaMax = limit;
    await Promise.all([
        settingStorage.SetData(setting),
        LimitedSaveNicotta(setting, illusts)
    ]);
    return setting.nicottaMax;
};
const LimitedSaveCommented = async (setting, illusts) => {
    setting = setting ?? (await settingStorage.GetDataOrDefault());
    illusts = illusts ?? await commentStorage.GetDataOrDefault();
    //制限以内ならそのままセーブ
    if (setting.commentedMax == -1 || illusts.length <= setting.commentedMax) {
        await commentStorage.SetData(illusts);
        return;
    }
    for (let illust of illusts) {
        for (let comment of illust.comments) {
            comment.date = new Date(comment.date);
        }
    }
    const dateSorted = illusts.sortNonDestructive((a, b) => {
        return b.comments[b.comments.length - 1].date.getTime() - a.comments[a.comments.length - 1].date.getTime();
    });
    dateSorted.length = setting.commentedMax;
    await commentStorage.SetData(new SortedArray(dateSorted));
};
const SetCommentedMax = async (limit, setting, illusts) => {
    setting = setting ?? (await settingStorage.GetDataOrDefault());
    illusts = illusts ?? await commentStorage.GetDataOrDefault();
    if (limit == -1 || limit >= illusts.length) {
        setting.commentedMax = limit;
        await settingStorage.SetData(setting);
        return setting.commentedMax;
    }
    if (!window.confirm(`${illusts.length - limit}件削除されます。OK？`)) {
        return setting.commentedMax;
    }
    setting.commentedMax = limit;
    await Promise.all([
        settingStorage.SetData(setting),
        LimitedSaveCommented(setting, illusts)
    ]);
    return setting.commentedMax;
};
//メイン
(async () => {
    "use strict";
    console.log("start");
    await Util.WaitDocumentElement();
    //イラストページのとき
    const illustIdMatchs = location.href.match(/im(\d+)/);
    if (Util.HasLengthAtLeast(illustIdMatchs, 2)) {
        illustId = parseInt(illustIdMatchs[1]);
        if (isNaN(illustId)) {
            console.error("idNaN");
            return;
        }
        SetIllustPage();
    }
    //nico履歴のとき
    if (location.href.match("https://seiga.nicovideo.jp/my/SeigaNicoru") != null) {
        SetSeigaNicoruPage();
    }
    //リンク追加
    AddSeigaNicoruLinkToHeader();
    //通知チェック
    CheckNoticeInterval();
    //通知チェック5分毎でセット
    setInterval(CheckNoticeInterval, CHECK_INTERVAL_TIME);
    //通知アイコンマウスオーバーしたときの処理を登録
    SetNoticeIconMouseoverObserver();
})();
