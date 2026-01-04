// ==UserScript==
// @name         静画5ch風コメント
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  複数コメントしてるユーザーを簡単に見分けられます
// @author       cbxm
// @match        https://seiga.nicovideo.jp/seiga/*
// @grant        GM.xmlHttpRequest
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434137/%E9%9D%99%E7%94%BB5ch%E9%A2%A8%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/434137/%E9%9D%99%E7%94%BB5ch%E9%A2%A8%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.meta.js
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
    static IsElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
    static SetCookie(key, value, option = "") {
        window.document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + "; " + option;
    }
    static SetCookieKeyAndValue(keyAndValue) {
        window.document.cookie = keyAndValue;
    }
    static GetAllCookie() {
        const cookies = window.document.cookie.split(";").map(c => decodeURI(c).replace(/^\s/, ""));
        let keyVal = [];
        for (let i = 0; i < cookies.length; i++) {
            //cookies[i]=cookies[i].replace(/^\s/,"");     ???
            const s = cookies[i].match(/^(.*?)=(.*?)$/);
            if (Util.HasLengthAtLeast(s, 3)) {
                keyVal.push({ key: s[1], val: s[2] });
            }
        }
        return keyVal;
    }
    static GetCookie(key) {
        const cookies = window.document.cookie.split(";").map(c => decodeURI(c).replace(/^\s/, ""));
        for (var c of cookies) {
            if (RegExp(key).test(c)) {
                return c;
            }
        }
        return null;
    }
    static GetCookieVal(key) {
        const cookies = window.document.cookie.split(";").map(c => decodeURI(c).replace(/^\s/, ""));
        for (var c of cookies) {
            const matched = c.match(`${key}=([^]*)`);
            if (Util.HasLengthAtLeast(matched, 2)) {
                return matched[1];
            }
        }
        return null;
    }
    static DeleteCookie(key) {
        window.document.cookie = encodeURI(key) + "=; max-age=0";
    }
}
;
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
class CommentList {
    constructor(illustId) {
        this.illustId = illustId;
    }
    async FetchCommentList() {
        const endPoint = `https://seiga.nicovideo.jp/ajax/illust/comment/list`;
        const method = "GET";
        //console.log("FetchNicorare");
        const res = await Util.GMFetchText(`${endPoint}?id=${this.illustId.toString()}&mode=all`, { method });
        //console.log(res);
        if (res == "") {
            return false;
        }
        const result = JSON.parse(res);
        if (result?.result != "true" || result.comment_list == null) {
            return false;
        }
        result.comment_list.forEach(c => {
            if (typeof c.id == "string") {
                c.id = parseInt(c.id);
            }
        });
        this.commentList = new SortedArray(result.comment_list);
        this.CountComment();
        return true;
    }
    GetList() {
        return this.commentList;
    }
    CountComment() {
        for (const comment of this.commentList) {
            if (comment.thisUserComments != undefined) {
                continue;
            }
            const trueList = this.commentList.filter(c => c.user == comment.user);
            for (const trued of trueList) {
                trued.thisUserComments = trueList;
            }
        }
    }
}
class PopUp {
    constructor(createdElement, parent) {
        this.createdElement = createdElement;
        this.parent = parent;
        this.children = [];
    }
    SetElement(parentParentElement, comes) {
        const commentListElement = parentParentElement.getElementsByClassName("comment_list")[0];
        if (!(commentListElement instanceof HTMLElement)) {
            return;
        }
        this.blackFilterElement = document.createElement("div");
        this.blackFilterElement.style.backgroundColor = "rgba(0,0,0,0.3)";
        this.blackFilterElement.style.position = "absolute";
        if (this.parent == null) {
            this.blackFilterElement.style.top = commentListElement.offsetTop + "px";
            this.blackFilterElement.style.height = commentListElement.offsetHeight + "px";
        }
        else {
            this.blackFilterElement.style.top = this.parent.popupElement?.offsetTop + "px";
            this.blackFilterElement.style.height = this.parent.popupElement?.offsetHeight + "px";
        }
        this.blackFilterElement.style.width = "300px";
        parentParentElement.insertAdjacentElement("beforeend", this.blackFilterElement);
        //クリックしたところに合わせて消す
        this.blackFilterElement.addEventListener("click", (e) => {
            if (popup != null) {
                e.stopPropagation();
                const all = popup.GetAll();
                for (const p of all) {
                    if (p.createdElement == this.createdElement) {
                        p.RemoveAll();
                        if (popup == p) {
                            popup = null;
                        }
                        return;
                    }
                }
            }
        });
        this.popupElement = document.createElement("ul");
        this.popupElement.className = "comment_list";
        this.popupElement.style.position = "absolute";
        this.popupElement.style.overflowY = "auto";
        this.popupElement.style.width = "300px";
        this.popupElement.style.backgroundColor = "white";
        parentParentElement.insertAdjacentElement("beforeend", this.popupElement);
        this.popupElement.addEventListener("click", (e) => {
            if (popup != null) {
                e.stopPropagation();
            }
        });
        this.borderElement = document.createElement("div");
        this.borderElement.style.position = "absolute";
        this.borderElement.style.width = "299px";
        this.borderElement.style.border = "1px solid";
        this.borderElement.style.pointerEvents = "none";
        parentParentElement.insertAdjacentElement("beforeend", this.borderElement);
        const triangleSvgParent = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        triangleSvgParent.style.position = "relative";
        triangleSvgParent.setAttribute("width", "20");
        triangleSvgParent.setAttribute("height", "5");
        this.borderElement.appendChild(triangleSvgParent);
        const triangleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        triangleSvg.setAttribute('d', 'M0 0 L10 5 L20 0 Z');
        triangleSvg.setAttribute('fill', 'white');
        triangleSvg.setAttribute('stroke', 'white');
        triangleSvg.setAttribute('stroke-width', "0");
        triangleSvgParent.appendChild(triangleSvg);
        const userTempIdInnserElement = document.createElement("span");
        userTempIdInnserElement.textContent = comes[0].user;
        userTempIdInnserElement.style.userSelect = "all";
        const userTempIdElement = document.createElement("li");
        userTempIdElement.textContent = `仮ID: `;
        userTempIdElement.style.margin = "3px";
        userTempIdElement.style.fontSize = "83%";
        userTempIdElement.style.textAlign = "center";
        userTempIdElement.appendChild(userTempIdInnserElement);
        this.popupElement.appendChild(userTempIdElement);
        for (const c of comes) {
            const e = Util.HtmlToElement(`
                <li class="comment_list_item PopupComment" data-bind="css:{unpublic: !is_visible(), user: is_owner, unpublic : is_filtered()}">
                  <ul class="comment_info" data-display_flag="">
                    <li class="count_new" data-bind="visible: is_new"${c.is_new ? "" : 'style="display: none;"'}> NEW</li>
                    <li class="date"><span data-bind="text: date">${c.date}</span></li>
                    <li class="id">No.<span data-bind="text: id">${c.id}</span></li>
                    <li class="user" data-bind="visible: is_owner" ${c.is_owner ? "" : 'style="display: none;"'}>投稿者</li>
                    <li class="text" data-bind="text: is_filtered()? '###このコメントは表示されません###' : text">${c.text}</li>

                  </ul>
                </li>`);
            //, event:{contextmenu: $parent.showNgMenu}
            //`                    <li class="ng_menu">
            //          <ul class="ng_menu_list">
            //            <li class="add_ng_comment" data-bind="click: $parent.addNgComment">NGコメントに追加</li>
            //            <li class="add_ng_user" data-bind="click: $parent.addNgUser">NGユーザーに追加</li>
            //            <li class="open_ng_comment">NG設定一覧を見る</li>
            //          </ul>
            //        </li>`
            if (e == null || !(e instanceof HTMLElement)) {
                continue;
            }
            this.popupElement.appendChild(e);
        }
        const lastE = this.popupElement.lastElementChild;
        lastE.firstElementChild.style.marginBottom = "0";
        //位置大きさ計算
        let padBottomBefore = parseFloat(window.getComputedStyle(this.popupElement, null).getPropertyValue('padding-bottom'));
        if (isNaN(padBottomBefore)) {
            padBottomBefore = 0;
        }
        const maxTop = commentListElement.offsetTop +
            parentParentElement.scrollTop;
        const maxHeight = commentListElement.offsetHeight;
        let popupTop = this.createdElement.getBoundingClientRect().y -
            parentParentElement.getBoundingClientRect().y +
            parentParentElement.scrollTop -
            this.popupElement.offsetHeight +
            padBottomBefore - 3;
        let popupHeight = this.popupElement.offsetHeight;
        let padBottomNext = 0;
        if (popupTop < maxTop) {
            const popupTopOther = popupTop + this.popupElement.offsetHeight + this.createdElement.offsetHeight - padBottomBefore + 6;
            // popupHeight -= maxTop - popupTop;
            // popupTop = maxTop;
            popupTop = popupTopOther;
            if (maxHeight < popupHeight + popupTop && padBottomBefore != 0) {
                padBottomNext = padBottomBefore;
            }
            triangleSvgParent.style.top = -13 + "px";
            triangleSvgParent.setAttribute("transform", "rotate(180)");
        }
        else {
            triangleSvgParent.style.top = popupHeight - padBottomBefore - 10 + 1 + "px";
        }
        triangleSvgParent.style.left = this.createdElement.offsetLeft + "px";
        this.popupElement.style.paddingBottom = padBottomNext + "px";
        // this.popupElement.style.height = popupHeight - padBottomBefore + "px";
        this.popupElement.style.top = popupTop + "px";
        this.borderElement.style.height = popupHeight - padBottomBefore - 1 + "px";
        this.borderElement.style.top = popupTop + "px";
        let p = this.parent;
        let zIndex = 2001;
        while (p != null) {
            zIndex++;
            p = p.parent;
        }
        const zIndexStr = zIndex.toString();
        this.blackFilterElement.style.zIndex = zIndexStr;
        this.popupElement.style.zIndex = zIndexStr;
        this.borderElement.style.zIndex = zIndexStr;
    }
    GetAncestor() {
        let p = this;
        while (true) {
            if (p.parent == null) {
                return p;
            }
            p = p.parent;
        }
    }
    GetAll() {
        const cs = [this];
        for (const c of this.children) {
            cs.push(...c.GetAll());
        }
        return cs;
    }
    Remove() {
        this.blackFilterElement?.remove();
        this.popupElement?.remove();
        this.borderElement?.remove();
    }
    RemoveAll() {
        this.GetAll().forEach(e => e.Remove());
        if (this.parent != null) {
            this.parent.children = this.parent.children.filter(p => p != this);
        }
    }
}
let popup = null;
const SetCommentCountElement = async (commentListElements, commentList) => {
    const bigTask = new BigDOMTask();
    for (const commentListElement of commentListElements) {
        const idElements = Array.from(commentListElement.getElementsByClassName("id")).filter(e => e.firstElementChild?.textContent?.length != 0);
        const ids = idElements.map(e => parseInt(e.firstElementChild?.textContent ?? ""));
        let matingList = commentList.GetList().GetMatingList(ids);
        if (matingList == null) {
            await commentList.FetchCommentList();
            matingList = commentList.GetList().GetMatingList(ids) ?? null;
            if (matingList == null) {
                console.error("見つからない謎エラー");
                continue;
            }
        }
        const comeCounts = Array.from(commentListElement.getElementsByClassName("ComeCount"));
        for (let i = 0; i < idElements.length; i++) {
            const idElement = idElements[i];
            const come = matingList[i];
            const id = ids[i];
            if (come?.thisUserComments == null || id == undefined) {
                continue;
            }
            const commentCountText = `[${come.thisUserComments.findIndex(c => c.id == come.id) + 1}/${come.thisUserComments.length}]`;
            const beforeElement = comeCounts[i];
            if (beforeElement != undefined) {
                //前のと同じならやめる、違ったら前の消しとく
                if (beforeElement.textContent == commentCountText) {
                    continue;
                }
                else {
                    beforeElement.remove();
                }
            }
            //コメント全体の要素
            const commentItemElement = idElement.parentElement?.parentElement;
            if (commentItemElement == null) {
                continue;
            }
            const countElement = document.createElement("li");
            countElement.textContent = commentCountText;
            countElement.className = "ComeCount";
            const task = new MicroDOMTask();
            task.AddTask(() => idElement.insertAdjacentElement("beforebegin", countElement));
            if (idElements.length < 15) {
                requestAnimationFrame(() => task.Start());
            }
            else {
                bigTask.AddMicroTask(task, commentItemElement);
            }
            if (come.thisUserComments.length >= 2) {
                countElement.style.color = "rgb(35, 148, 216)";
            }
            if (come.thisUserComments.length >= 5) {
                countElement.style.color = "rgb(216, 35, 35)";
            }
            countElement.style.cursor = "pointer";
            countElement.addEventListener("click", (e) => {
                e.stopPropagation();
                let parentPopup = null;
                if (popup != null) {
                    const all = popup.GetAll();
                    for (const p of all) {
                        //生成元をクリックしてる場合 その子供含めて消す
                        if (p.createdElement == countElement) {
                            p.RemoveAll();
                            if (popup == p) {
                                popup = null;
                            }
                            return;
                        }
                        for (const element of Array.from(p.popupElement?.children ?? [])) {
                            //このポップアップ要素の子供をクリックしてる場合 親にする
                            if (element == commentItemElement) {
                                parentPopup = p;
                                p.children.forEach(p => p.RemoveAll());
                            }
                        }
                    }
                }
                const newPopup = new PopUp(countElement, parentPopup);
                if (parentPopup == null) {
                    popup?.RemoveAll();
                    popup = newPopup;
                }
                else {
                    parentPopup.children.push(newPopup);
                }
                newPopup.SetElement(commentListElement.parentElement, come.thisUserComments);
            });
        }
    }
    bigTask.Start();
};
(async () => {
    "use strict";
    console.log("start");
    //イラストページのとき
    const illustIdMatchs = location.href.match(/im(\d+)/);
    if (Util.HasLengthAtLeast(illustIdMatchs, 2)) {
        const illustId = parseInt(illustIdMatchs[1]);
        const commentList = new CommentList(illustId);
        await commentList.FetchCommentList();
        await Util.WaitDocumentElement();
        const commentListElements = await Util.Retry(() => Observer.DefinitelyGetElementsByClassName("comment_list"), 5, 1000, r => r.length >= 2) ?? [];
        if (commentListElements.length == 0) {
            console.error("commentListElementsが2つない");
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `<style>
.illust_main .illust_side .illust_comment .comment_list .comment_list_item.PopupComment .comment_info::after {
	background: none;
	background-image: none;
 content: none;
}
.illust_main .illust_side .illust_comment .comment_list .comment_list_item .comment_info > li{
margin: 0 6px 0 0;
}
</style>`);
        document.getElementById("wrapper")?.addEventListener("click", () => {
            popup?.RemoveAll();
            popup = null;
        });
        SetCommentCountElement(commentListElements, commentList);
        //通常のリストにコメントが追加されたときのオブザーバー
        const mutationObserver = new MutationObserver(async (mrs) => {
            const nicorus = new Set();
            for (let mr of mrs) {
                for (let i = 0; i < mr.addedNodes.length; i++) {
                    const element = mr.addedNodes[i];
                    if (!(element instanceof HTMLElement)) {
                        continue;
                    }
                    if (element.classList.contains("comment_list_item")) {
                        nicorus.add(element.parentElement);
                        break;
                    }
                }
            }
            SetCommentCountElement([...nicorus], commentList);
        });
        for (let e of commentListElements) {
            mutationObserver.observe(e, {
                childList: true,
            });
        }
        const uniqueParents = Util.Unique(commentListElements.map(e => e.parentElement));
        //リスト自体が追加されたときのオブザーバー
        const mutationObserverParent = new MutationObserver(async (mrs) => {
            const nicorus = new Set();
            for (let mr of mrs) {
                for (let i = 0; i < mr.addedNodes.length; i++) {
                    const element = mr.addedNodes[i];
                    if (!(element instanceof HTMLElement)) {
                        continue;
                    }
                    if (element.classList.contains("comment_list")) {
                        nicorus.add(element);
                        break;
                    }
                }
            }
            SetCommentCountElement([...nicorus], commentList);
        });
        for (let e of uniqueParents) {
            mutationObserverParent.observe(e, {
                childList: true,
            });
        }
    }
})();
