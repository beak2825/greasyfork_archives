// ==UserScript==
// @name         ニコニコ静画、簡単NGスクリプト
// @namespace    http://tampermonkey.net/
// @version      1.814
// @description  申し訳ないが見たくないイラストはNG
// @author       cbxm
// @match        https://seiga.nicovideo.jp/tag/*
// @match        https://seiga.nicovideo.jp/seiga/*
// @match        https://seiga.nicovideo.jp/watch/*
// @match        https://seiga.nicovideo.jp/my/personalize*
// @match        https://nicoad.nicovideo.jp/widget/*
// @match        https://seiga.nicovideo.jp/search/*
// @match        https://seiga.nicovideo.jp/illust/list
// @match        https://seiga.nicovideo.jp/shunga/list
// @connect      seiga.nicovideo.jp
// @connect      nicoad.nicovideo.jp
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/413659/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%E3%80%81%E7%B0%A1%E5%8D%98NG%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/413659/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%E3%80%81%E7%B0%A1%E5%8D%98NG%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==
(async () => {
    "use strict";
    ;
    ;
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
            var div = document.createElementNS('https://www.w3.org/1999/xhtml', 'div');
            div.innerHTML = '<svg xmlns="https://www.w3.org/2000/svg">' + s + '</svg>';
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
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    url: url,
                    ...optopns,
                    onload: (response) => {
                        // リダイレクトを処理(Chromeだと処理できないバグ？https://github.com/Tampermonkey/tampermonkey/issues/2134)
                        if (response.responseText == null && response.status >= 300 && response.status < 400) {
                            if (url != response.finalUrl) {
                                return this.GMFetchText(response.finalUrl, optopns);
                            }
                            console.error("リダイレクトを処理できませんでした");
                        }
                        resolve(response.responseText);
                    },
                    onerror: (e) => {
                        console.error(e);
                        reject("");
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
    class Fetcher {
        static GMFetchText(url) {
            return Util.GMFetchText(url, {
                method: "GET"
            });
        }
        static async FetchIllustDatas(ids) {
            if (ids.length == 0) {
                return { illusts: [], userIds: [] };
            }
            const url = `https:\/\/seiga.nicovideo.jp/api/illust/info?id_list=${ids.join()}`;
            const res = await this.GMFetchText(url);
            const obj = Util.XmlToObj(res);
            if (obj.response == undefined) {
                return { illusts: [], userIds: [] };
            }
            const list = Array.isArray(obj.response.image_list) ? obj.response.image_list : [obj.response.image_list.image];
            const illusts = [];
            for (let i = 0; i < list.length; i++) {
                illusts[i] = {
                    illustId: list[i].id,
                    created: new Date(list[i].created)
                };
            }
            return {
                illusts: illusts,
                userIds: list.map(l => l.user_id)
            };
        }
        static async FetchUserName(userId) {
            const url = "https://seiga.nicovideo.jp/api/user/info?id=" + userId;
            const json = Util.XmlToObj(await this.GMFetchText(url));
            if (json.response == undefined) {
                return { illusts: [], userIds: [] };
            }
            return json.response.user.nickname;
        }
        static async FetchUserId(illustId) {
            const url = "https://seiga.nicovideo.jp/api/illust/info?id=im" + illustId;
            const resultText = await this.GMFetchText(url);
            const json = Util.XmlToObj(resultText);
            if (json.response == undefined) {
                return { illusts: [], userIds: [] };
            }
            return json.response.image.user_id;
        }
    }
    ;
    class Storage {
        constructor(storageName) {
            this.storageName = "";
            this.storageName = storageName;
        }
        async GetStorageData(defaultValue = null) {
            const text = await GM.getValue(this.storageName, null);
            return text != null ? JSON.parse(decodeURIComponent(text)) : defaultValue;
        }
        async SetStorageData(data) {
            await GM.setValue(this.storageName, encodeURIComponent(JSON.stringify(data)));
        }
    }
    ;
    ;
    //MutationObserver使った便利関数
    class Observer {
        static Wait(predicate, parent = document, option = null) {
            return new Promise(r => {
                if (option == null) {
                    option = {
                        childList: true,
                        subtree: true
                    };
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
                    option = {
                        childList: true,
                        subtree: true
                    };
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
                    option = {
                        childList: true,
                        subtree: true
                    };
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
    //暫定OK、暫定荒らし、確定OK、確定荒らし
    //type Status = "OK" | "NG" | "LOK" | "LNG"
    let VirtualPageType;
    (function (VirtualPageType) {
        VirtualPageType[VirtualPageType["None"] = -1] = "None";
        VirtualPageType[VirtualPageType["TAG_SEARCH"] = 0] = "TAG_SEARCH";
        VirtualPageType[VirtualPageType["ILLUST"] = 1] = "ILLUST";
        VirtualPageType[VirtualPageType["PERSONALIZE"] = 2] = "PERSONALIZE";
        VirtualPageType[VirtualPageType["ADS"] = 3] = "ADS";
        VirtualPageType[VirtualPageType["KEYWORD_SEARCH"] = 4] = "KEYWORD_SEARCH";
        VirtualPageType[VirtualPageType["MAX"] = 5] = "MAX";
    })(VirtualPageType || (VirtualPageType = {}));
    ;
    ;
    ;
    const pageInfos = [
        {
            type: VirtualPageType.TAG_SEARCH,
            regex: /https:\/\/seiga.nicovideo.jp\/tag\/.*/,
            name: "タグ検索",
        },
        {
            type: VirtualPageType.ILLUST,
            regex: /https:\/\/seiga.nicovideo.jp\/(seiga|watch)\/.*/,
            name: "イラストページ",
        },
        {
            type: VirtualPageType.PERSONALIZE,
            regex: /https:\/\/seiga.nicovideo.jp\/my\/personalize.*/,
            name: "定点観測",
        },
        {
            type: VirtualPageType.ADS,
            regex: /https:\/\/nicoad.nicovideo.jp\/widget\/.*/,
            name: "ニコニ広告",
        },
        {
            type: VirtualPageType.KEYWORD_SEARCH,
            regex: /https:\/\/seiga.nicovideo.jp\/search\/.*/,
            name: "キーワード検索",
        },
        {
            type: VirtualPageType.TAG_SEARCH,
            regex: /https:\/\/seiga.nicovideo.jp\/illust\/list/,
            name: "静画イラスト一覧",
        },
        {
            type: VirtualPageType.KEYWORD_SEARCH,
            regex: /https:\/\/seiga.nicovideo.jp\/shunga\/list/,
            name: "春画イラスト一覧",
        }
    ];
    const virtualPageInfos = [
        {
            illustListName: "item_list",
            illustItemName: "list_item",
        },
        {
            illustListName: "item_list",
            illustItemName: "list_item_cutout",
        },
        {
            illustListName: "list_body",
            illustItemName: "illust_thumb",
        },
        {
            // 空ならul,ilを使う
            illustListName: "",
            illustItemName: "",
        },
        {
            illustListName: "illust_pict_all",
            illustItemName: "illust_list_img",
        }
    ];
    let Status;
    (function (Status) {
        Status[Status["NONE"] = 0] = "NONE";
        Status[Status["OK"] = 1] = "OK";
        Status[Status["NG"] = 2] = "NG";
        Status[Status["WHITE"] = 3] = "WHITE";
        Status[Status["BLACK"] = 4] = "BLACK";
        Status[Status["AUTO"] = 5] = "AUTO";
        Status[Status["MAX"] = 6] = "MAX";
    })(Status || (Status = {}));
    class Main {
        constructor() {
            this.cache = new Map();
            this.illustInfos = [];
            this.illustListElements = new Set();
            this.selectedList = [];
            this.cacheStorage = new Storage("NICONICO_RENTO_ARASI_NG_DATA_CACHE");
            this.optionStorage = new Storage("NICONICO_RENTO_ARASI_NG_OPTION_CACHE");
            this.imgIntersectionObserver = new IntersectionObserver(entries => {
                for (let e of entries) {
                    if (e.intersectionRatio > 0) {
                        const img = e.target;
                        if (img.src != null && img.dataset != null && img.dataset.src != null) {
                            img.src = img.dataset.src;
                        }
                        this.imgIntersectionObserver.unobserve(img);
                    }
                }
            });
        }
        ListToMap(list) {
            for (let o of list) {
                o.name ?? (o.name = "");
            }
            if (list[0] != null && list[0].userId != null) {
                return new Map(list.map(o => {
                    const userId = o.userId;
                    delete o.userId;
                    for (let illust of o.illusts) {
                        illust.illustId = illust.id;
                        delete illust.id;
                    }
                    return [userId, o];
                }));
            }
            return new Map(list);
        }
        async GetStorageData() {
            const obj = await this.cacheStorage.GetStorageData([]);
            this.cache = this.ListToMap(obj);
            //console.log(this.cache);
            const defaultOption = {
                usePages: [true, true, true, true, true, true, true],
                judge: {
                    isJudge: false,
                    time: 1 * 60 * 60 * 1000, //一時間
                    postCount: 5,
                    period: 30,
                    isAutoNGHidden: false
                },
                createUserLink: true,
                createBlackWhiteButton: true,
                okCacheMax: 1000, //どのくらいがいいのかわからない
            };
            this.option = await this.optionStorage.GetStorageData(defaultOption);
            if (this.option.usePages == undefined) {
                this.option.usePages = defaultOption.usePages;
            }
            for (let i = 0; i < VirtualPageType.MAX; i++) {
                if (this.option.usePages[i] == undefined) {
                    this.option.usePages[i] = defaultOption.usePages[i];
                }
            }
            if (this.option.judge == undefined) {
                this.option.judge = defaultOption.judge;
            }
            if (this.option.judge.time == undefined) {
                this.option.judge.time = defaultOption.judge.time;
            }
            if (this.option.judge.postCount == undefined) {
                this.option.judge.postCount = defaultOption.judge.postCount;
            }
            if (this.option.judge.period == undefined) {
                this.option.judge.period = defaultOption.judge.period;
            }
            if (this.option.judge.isJudge == undefined) {
                this.option.judge.isJudge = defaultOption.judge.isJudge;
            }
            if (this.option.judge.isAutoNGHidden == undefined) {
                this.option.judge.isAutoNGHidden = defaultOption.judge.isAutoNGHidden;
            }
            if (this.option.createUserLink == undefined) {
                this.option.createUserLink = defaultOption.createUserLink;
            }
            if (this.option.createBlackWhiteButton == undefined) {
                this.option.createBlackWhiteButton = defaultOption.createBlackWhiteButton;
            }
            if (this.option.okCacheMax == undefined) {
                this.option.okCacheMax = defaultOption.okCacheMax;
            }
            //console.log(this.option);
        }
        GetInfo(illustId) {
            for (let [userId, user] of this.cache) {
                if (user.illusts == null) {
                    console.log(userId, user);
                    user.illusts = [];
                }
                for (let illust of user.illusts) {
                    if (illust.illustId == illustId) {
                        return { userId: userId, user: user, illust: illust };
                    }
                }
            }
            return undefined;
        }
        CheckAutoNG(user) {
            if (user.illusts.length == 0 || user.status != Status.OK) {
                return;
            }
            const createdNumbers = user.illusts.map(illust => {
                if (typeof illust.created == "string") {
                    illust.created = new Date(illust.created);
                }
                return illust.created.getTime();
            });
            //新しい順
            const sorted = createdNumbers.sort((a, b) => b - a);
            const currentDateNumber = new Date().getTime();
            const periodMS = this.option.judge.period * 86400000;
            for (let i = 0; i < sorted.length; i++) {
                if (periodMS != 0 && sorted[i] <= currentDateNumber - periodMS) {
                    break;
                }
                let j = i + 1;
                let postCount = 1;
                while (true) {
                    if (j >= sorted.length || sorted[i] - sorted[j] > this.option.judge.time || (periodMS != 0 && sorted[j] <= currentDateNumber - periodMS)) {
                        break;
                    }
                    j++;
                    postCount++;
                }
                if (postCount >= this.option.judge.postCount) {
                    user.status = Status.AUTO;
                    return;
                }
            }
        }
        ;
        GetIllustIds(itemListElement) {
            const illustIdElements = itemListElement.getElementsByTagName("img");
            const illustIds = new Set();
            for (let i = 0; i < illustIdElements.length; i++) {
                // https://lohas.nicoseiga.jp//thumb/xxxxxxuz?yyyyyy から xxxxx を抜き出す
                const idMatchs = illustIdElements[i].src.match(/(\d+).+?(?:\?\d+)?$/);
                if (idMatchs == null) {
                    continue;
                }
                const id = idMatchs[idMatchs.length - 1];
                illustIds.add(id);
            }
            return [...illustIds];
        }
        DrawList() {
            if (this.optionDialog == null) {
                return;
            }
            const list = this.optionDialog.getElementsByClassName("scrollUL")[0];
            const onlyCurrentPageCheckbox = this.optionDialog.getElementsByClassName("onlyCurrentPageCheckbox")[0];
            const listStatusSelect = this.optionDialog.getElementsByClassName("listStatusSelect")[0];
            if (list == undefined || onlyCurrentPageCheckbox == undefined || listStatusSelect == undefined) {
                return;
            }
            const status = listStatusSelect.value == "ALL" ? "" : Status[listStatusSelect.value];
            list.innerHTML = "";
            for (let [userId, user] of this.cache) {
                if (status != "" && user.status != status) {
                    continue;
                }
                const info = this.illustInfos.find(info => info.userId == userId);
                let sampleIllustId = (info == undefined) ? undefined : info.illust.illustId;
                if (onlyCurrentPageCheckbox.checked && sampleIllustId == undefined) {
                    continue;
                }
                if (sampleIllustId == undefined && user.illusts[0] != undefined) {
                    sampleIllustId = user.illusts[0].illustId;
                }
                const div = document.createElement("div");
                div.style.height = "70px";
                div.style.display = "flex";
                div.style.flexDirection = "column";
                div.className = "userInfoItem";
                list.appendChild(div);
                div.addEventListener("mouseup", e => this.ClickList(div));
                {
                    const nameIdDiv = document.createElement("div");
                    nameIdDiv.style.top = "relative";
                    nameIdDiv.style.position = "4px";
                    div.appendChild(nameIdDiv);
                    {
                        const nameSpan = document.createElement("span");
                        nameSpan.className = "userName";
                        nameSpan.textContent = user.name;
                        nameSpan.style.fontSize = "130%";
                        nameSpan.style.color = "black";
                        nameSpan.style.width = "66px";
                        nameSpan.style.height = "24px";
                        nameSpan.style.padding = "3px";
                        nameIdDiv.appendChild(nameSpan);
                        const idSpan = document.createElement("span");
                        idSpan.className = "userId";
                        idSpan.textContent = userId;
                        idSpan.style.fontSize = "130%";
                        idSpan.style.color = "black";
                        idSpan.style.width = "66px";
                        idSpan.style.padding = "3px";
                        nameIdDiv.appendChild(idSpan);
                    }
                    const userAndSampleImgDiv = document.createElement("div");
                    div.appendChild(userAndSampleImgDiv);
                    {
                        const aUser = document.createElement("a");
                        aUser.href = `https:\/\/seiga.nicovideo.jp/user/illust/${userId}`;
                        userAndSampleImgDiv.appendChild(aUser);
                        {
                            const imgUser = document.createElement("img");
                            imgUser.dataset.src = `https:\/\/secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${Math.floor(parseInt(userId) / 10000)}/${userId}.jpg`;
                            imgUser.style.height = "40px";
                            imgUser.style.position = "relative";
                            imgUser.style.padding = "0 20px 0 10px";
                            imgUser.style.top = "-5px";
                            this.imgIntersectionObserver.observe(imgUser);
                            aUser.appendChild(imgUser);
                            imgUser.addEventListener("error", () => {
                                imgUser.src = "https:\/\/secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg";
                            });
                        }
                        if (sampleIllustId != undefined) {
                            const aSample = document.createElement("a");
                            aSample.href = `https:/\/seiga.nicovideo.jp/seiga/im${sampleIllustId}`;
                            userAndSampleImgDiv.appendChild(aSample);
                            {
                                const imgSample = document.createElement("img");
                                imgSample.dataset.src = `https:\/\/lohas.nicoseiga.jp\/\/thumb/${sampleIllustId}c`;
                                imgSample.style.height = "30px";
                                this.imgIntersectionObserver.observe(imgSample);
                                imgSample.style.position = "relative";
                                imgSample.style.top = "-5px";
                                aSample.appendChild(imgSample);
                                const bigSample = document.createElement("img");
                                bigSample.dataset.src = `https:\/\/lohas.nicoseiga.jp\/\/thumb/${sampleIllustId}c`;
                                bigSample.style.height = "100px";
                                this.imgIntersectionObserver.observe(bigSample);
                                bigSample.style.pointerEvents = "none";
                                bigSample.style.position = "absolute";
                                bigSample.style.zIndex = "110";
                                imgSample.addEventListener("mouseover", () => {
                                    const clientRect = imgSample.getBoundingClientRect();
                                    const x = window.scrollX + clientRect.left + imgSample.width / 2 - 50;
                                    const y = window.scrollY + clientRect.top + imgSample.height / 2 - 50;
                                    bigSample.style.top = y + "px";
                                    bigSample.style.left = x + "px";
                                    document.body.appendChild(bigSample);
                                });
                                imgSample.addEventListener("mouseleave", () => {
                                    bigSample.remove();
                                });
                            }
                        }
                    }
                }
            }
        }
        ClickList(target) {
            if (target != null) {
                if (this.selectedList.includes(target)) {
                    target.style.backgroundColor = "";
                    this.selectedList = this.selectedList.filter(s => s != target);
                }
                else {
                    target.style.backgroundColor = "rgba(0, 140, 255, 0.5)";
                    this.selectedList.push(target);
                }
            }
        }
        async SetOptionButton() {
            if (document.getElementById("optionSpan") != null) {
                return;
            }
            const optionSpan = document.createElement("span");
            optionSpan.id = "optionSpan";
            optionSpan.style.margin = "0 10px";
            optionSpan.style.lineHeight = "29px";
            if (this.currentPage == VirtualPageType.KEYWORD_SEARCH) {
                const nextSibling = await Util.WithTimeOut(Observer.DefinitelyGetElementByClassName("search_tab_border"), 10000);
                if (nextSibling == null) {
                    return;
                }
                nextSibling.insertAdjacentElement("beforebegin", optionSpan);
            }
            else {
                const parent = await Util.WithTimeOut(Observer.DefinitelyGetElementByClassName("sg_pankuzu"), 10000);
                if (parent == null) {
                    return;
                }
                parent.appendChild(optionSpan);
            }
            {
                const optionButton = document.createElement("input");
                optionButton.type = "button";
                optionButton.value = "簡単NGスクリプト";
                optionButton.style.backgroundColor = "yellow";
                optionButton.style.padding = "1px 10px";
                optionButton.style.fontSize = "110%";
                optionButton.style.cssText += "color: black !important;";
                optionButton.addEventListener("click", () => {
                    if (this.optionDialog.parentElement == null) {
                        optionSpan.appendChild(this.optionDialog);
                        return;
                    }
                    this.optionDialog.style.display = (this.optionDialog.style.display == "none") ? "block" : "none";
                });
                optionSpan.appendChild(optionButton);
                this.optionDialog = document.createElement("div");
                this.optionDialog.style.backgroundColor = "white";
                this.optionDialog.style.position = "absolute";
                this.optionDialog.style.padding = "5px";
                this.optionDialog.style.marginLeft = "10px";
                this.optionDialog.style.zIndex = "100";
                this.optionDialog.style.border = "2px solid";
                {
                    const list1 = document.createElement("div");
                    list1.style.display = "flex";
                    list1.style.paddingTop = "5px";
                    list1.style.paddingBottom = "10px";
                    this.optionDialog.appendChild(list1);
                    {
                        const listStatusSelect = document.createElement("select");
                        listStatusSelect.className = "listStatusSelect";
                        listStatusSelect.style.margin = "5px";
                        list1.appendChild(listStatusSelect);
                        for (let i = 1; i <= Status.MAX; i++) {
                            const option = document.createElement("option");
                            const text = i == Status.MAX ? "ALL" : Status[i];
                            option.value = text;
                            option.textContent = text;
                            listStatusSelect.appendChild(option);
                        }
                        listStatusSelect.addEventListener("change", () => {
                            while (this.selectedList.length != 0) {
                                const element = this.selectedList.pop();
                                if (element != undefined) {
                                    element.style.backgroundColor = "";
                                }
                            }
                            this.DrawList();
                        });
                        const onlyCurrentPageLabel = document.createElement("label");
                        onlyCurrentPageLabel.style.color = "black";
                        onlyCurrentPageLabel.style.padding = "3px";
                        onlyCurrentPageLabel.style.display = "flex";
                        list1.appendChild(onlyCurrentPageLabel);
                        {
                            const onlyCurrentPageCheckbox = document.createElement("input");
                            onlyCurrentPageCheckbox.type = "checkbox";
                            onlyCurrentPageCheckbox.className = "onlyCurrentPageCheckbox";
                            onlyCurrentPageCheckbox.checked = true;
                            onlyCurrentPageCheckbox.style.padding = "3px";
                            onlyCurrentPageCheckbox.style.margin = "10px";
                            onlyCurrentPageCheckbox.style.marginRight = "3px";
                            onlyCurrentPageCheckbox.style.marginLeft = "0px";
                            onlyCurrentPageLabel.appendChild(onlyCurrentPageCheckbox);
                            onlyCurrentPageCheckbox.addEventListener("change", () => this.DrawList());
                            const onlyCurrentPageText = document.createElement("div");
                            onlyCurrentPageText.textContent = "このページだけ";
                            onlyCurrentPageText.style.color = "black";
                            onlyCurrentPageLabel.appendChild(onlyCurrentPageText);
                        }
                        const allSelect = document.createElement("input");
                        allSelect.type = "button";
                        allSelect.value = "全選択";
                        allSelect.style.color = "black";
                        allSelect.style.fontSize = "120%";
                        allSelect.style.padding = "0 5px";
                        allSelect.style.margin = "3px";
                        list1.appendChild(allSelect);
                        allSelect.addEventListener("click", () => {
                            const infos = Array.from(document.getElementsByClassName("userInfoItem"));
                            for (let info of infos) {
                                this.ClickList(info);
                            }
                        });
                        const detailButton = document.createElement("input");
                        detailButton.type = "button";
                        detailButton.value = "設定";
                        detailButton.style.color = "black";
                        detailButton.style.fontSize = "120%";
                        detailButton.style.margin = "3px";
                        detailButton.style.marginLeft = "45px";
                        detailButton.style.padding = "0 10px";
                        list1.appendChild(detailButton);
                        detailButton.addEventListener("click", () => detailDialog.style.display = (detailDialog.style.display == "none") ? "block" : "none");
                        const detailDialog = document.createElement("div");
                        detailDialog.style.backgroundColor = "white";
                        detailDialog.style.display = "none";
                        detailDialog.style.position = "absolute";
                        detailDialog.style.paddingLeft = "10px";
                        detailDialog.style.zIndex = "100";
                        detailDialog.style.border = "2px solid";
                        detailDialog.style.left = "360px";
                        detailDialog.style.top = "10px";
                        detailDialog.style.minWidth = "350px";
                        list1.appendChild(detailDialog);
                        const useSettingH3 = document.createElement("h1");
                        useSettingH3.textContent = "使うところ";
                        useSettingH3.style.fontSize = "140%";
                        useSettingH3.style.marginTop = "10px";
                        useSettingH3.style.color = "black";
                        detailDialog.appendChild(useSettingH3);
                        const setUseListDiv = document.createElement("div");
                        setUseListDiv.style.marginBottom = "10px";
                        setUseListDiv.style.display = "flex";
                        setUseListDiv.style.flexWrap = "wrap";
                        detailDialog.appendChild(setUseListDiv);
                        {
                            for (let i = 0; i < pageInfos.length; i++) {
                                const setUseLabel = document.createElement("label");
                                setUseLabel.style.display = "inline-block";
                                setUseListDiv.appendChild(setUseLabel);
                                {
                                    const setUsePageCheckbox = document.createElement("input");
                                    setUsePageCheckbox.type = "checkbox";
                                    setUsePageCheckbox.checked = this.option.usePages[i];
                                    setUsePageCheckbox.style.padding = "3px";
                                    setUsePageCheckbox.style.margin = "10px";
                                    setUsePageCheckbox.style.marginRight = "3px";
                                    setUseLabel.appendChild(setUsePageCheckbox);
                                    setUsePageCheckbox.addEventListener("change", async () => {
                                        this.option.usePages[i] = setUsePageCheckbox.checked;
                                        await this.optionStorage.SetStorageData(this.option);
                                    });
                                    const setUsePageText = document.createElement("span");
                                    setUsePageText.textContent = pageInfos[i].name;
                                    setUsePageText.style.padding = "3px";
                                    setUsePageText.style.fontSize = "120%";
                                    setUsePageText.style.color = "black";
                                    setUseLabel.appendChild(setUsePageText);
                                }
                            }
                        }
                        const otherSettingH3 = document.createElement("h1");
                        otherSettingH3.textContent = "イラストサムネ";
                        otherSettingH3.style.fontSize = "140%";
                        otherSettingH3.style.marginTop = "10px";
                        otherSettingH3.style.color = "black";
                        detailDialog.appendChild(otherSettingH3);
                        const setCreateUserLinkDiv = document.createElement("div");
                        setCreateUserLinkDiv.style.display = "flex";
                        detailDialog.appendChild(setCreateUserLinkDiv);
                        {
                            const setCreateUserLinkChackbox = document.createElement("input");
                            setCreateUserLinkChackbox.type = "checkbox";
                            setCreateUserLinkChackbox.id = "createUserLink";
                            setCreateUserLinkChackbox.checked = this.option.createUserLink;
                            setCreateUserLinkChackbox.style.padding = "3px";
                            setCreateUserLinkChackbox.style.margin = "10px";
                            setCreateUserLinkChackbox.style.marginRight = "3px";
                            setCreateUserLinkDiv.appendChild(setCreateUserLinkChackbox);
                            setCreateUserLinkChackbox.addEventListener("change", async () => {
                                this.option.createUserLink = setCreateUserLinkChackbox.checked;
                                await this.optionStorage.SetStorageData(this.option);
                            });
                            const setCreateUserLinkDivLabel = document.createElement("label");
                            setCreateUserLinkDivLabel.htmlFor = "createUserLink";
                            setCreateUserLinkDivLabel.textContent = "ユーザー名をユーザーページへのリンクにする";
                            setCreateUserLinkDivLabel.style.color = "black";
                            setCreateUserLinkDivLabel.style.padding = "3px";
                            setCreateUserLinkDivLabel.style.fontSize = "120%";
                            setCreateUserLinkDiv.appendChild(setCreateUserLinkDivLabel);
                        }
                        const setCreateBlackWhiteButtonDiv = document.createElement("div");
                        setCreateBlackWhiteButtonDiv.style.display = "flex";
                        detailDialog.appendChild(setCreateBlackWhiteButtonDiv);
                        {
                            const setCreateBlackWhiteButtonChackbox = document.createElement("input");
                            setCreateBlackWhiteButtonChackbox.type = "checkbox";
                            setCreateBlackWhiteButtonChackbox.id = "setCreateBlackWhiteButton";
                            setCreateBlackWhiteButtonChackbox.checked = this.option.createBlackWhiteButton;
                            setCreateBlackWhiteButtonChackbox.style.padding = "3px";
                            setCreateBlackWhiteButtonChackbox.style.margin = "10px";
                            setCreateBlackWhiteButtonChackbox.style.marginRight = "3px";
                            setCreateBlackWhiteButtonDiv.appendChild(setCreateBlackWhiteButtonChackbox);
                            setCreateBlackWhiteButtonChackbox.addEventListener("change", async () => {
                                this.option.createBlackWhiteButton = setCreateBlackWhiteButtonChackbox.checked;
                                await this.optionStorage.SetStorageData(this.option);
                            });
                            const setCreateBlackWhiteButtonLabel = document.createElement("label");
                            setCreateBlackWhiteButtonLabel.htmlFor = "setCreateBlackWhiteButton";
                            setCreateBlackWhiteButtonLabel.textContent = "白黒ボタンを付ける";
                            setCreateBlackWhiteButtonLabel.style.color = "black";
                            setCreateBlackWhiteButtonLabel.style.padding = "3px";
                            setCreateBlackWhiteButtonLabel.style.fontSize = "120%";
                            setCreateBlackWhiteButtonDiv.appendChild(setCreateBlackWhiteButtonLabel);
                        }
                        const otherSettingH4 = document.createElement("h1");
                        otherSettingH4.textContent = "連投自動NG";
                        otherSettingH4.style.fontSize = "140%";
                        otherSettingH4.style.marginTop = "10px";
                        otherSettingH4.style.color = "black";
                        detailDialog.appendChild(otherSettingH4);
                        const judgeRigorCover = document.createElement("div");
                        const setIsJudgeDiv = document.createElement("div");
                        setIsJudgeDiv.style.display = "flex";
                        detailDialog.appendChild(setIsJudgeDiv);
                        {
                            const isJudgeCheckbox = document.createElement("input");
                            isJudgeCheckbox.type = "checkbox";
                            isJudgeCheckbox.id = "isJudgeCheckbox";
                            isJudgeCheckbox.checked = this.option.judge.isJudge;
                            isJudgeCheckbox.style.padding = "3px";
                            isJudgeCheckbox.style.margin = "10px";
                            isJudgeCheckbox.style.marginRight = "3px";
                            setIsJudgeDiv.appendChild(isJudgeCheckbox);
                            isJudgeCheckbox.addEventListener("change", async () => {
                                this.option.judge.isJudge = isJudgeCheckbox.checked;
                                if (this.option.judge.isJudge) {
                                    judgeRigorCover.style.visibility = "hidden";
                                }
                                else {
                                    judgeRigorCover.style.visibility = "visible";
                                }
                                await this.optionStorage.SetStorageData(this.option);
                            });
                            const isJudgeLabel = document.createElement("label");
                            isJudgeLabel.htmlFor = "isJudgeCheckbox";
                            isJudgeLabel.textContent = "有効にする";
                            isJudgeLabel.style.color = "black";
                            isJudgeLabel.style.padding = "3px";
                            isJudgeLabel.style.fontSize = "120%";
                            setIsJudgeDiv.appendChild(isJudgeLabel);
                        }
                        const setJudgeDiv = document.createElement("div");
                        setJudgeDiv.style.padding = "5px";
                        setJudgeDiv.style.position = "relative";
                        detailDialog.appendChild(setJudgeDiv);
                        {
                            const setJudgeRigorDiv = document.createElement("div");
                            setJudgeRigorDiv.style.padding = "0px 10px 5px 10px";
                            setJudgeDiv.appendChild(setJudgeRigorDiv);
                            {
                                const setJudgeTime = document.createElement("input");
                                setJudgeTime.type = "time";
                                setJudgeTime.style.height = "20px";
                                setJudgeTime.style.fontSize = "120%";
                                const hour = ('00' + Math.floor(this.option.judge.time / 60 / 1000 / 60).toString()).slice(-2);
                                const minutes = ('00' + (this.option.judge.time / 60 / 1000 % 60).toString()).slice(-2);
                                setJudgeTime.value = `${hour}:${minutes}`;
                                setJudgeTime.addEventListener("change", async () => {
                                    const [h, m] = setJudgeTime.value.split(":").map(s => parseInt(s));
                                    const ms = ((h * 60) + m) * 60 * 1000;
                                    if (ms >= 1) {
                                        this.option.judge.time = ms;
                                        await this.optionStorage.SetStorageData(this.option);
                                    }
                                    else {
                                        const hour = ('00' + Math.floor(this.option.judge.time / 60 / 1000 / 60).toString()).slice(-2);
                                        const minutes = ('00' + (this.option.judge.time / 60 / 1000 % 60).toString()).slice(-2);
                                        setJudgeTime.value = `${hour}:${minutes}`;
                                    }
                                });
                                setJudgeRigorDiv.appendChild(setJudgeTime);
                                const setJudgeText1 = document.createElement("span");
                                setJudgeText1.textContent = "以内に";
                                setJudgeText1.style.color = "black";
                                setJudgeText1.style.fontSize = "15px";
                                setJudgeRigorDiv.appendChild(setJudgeText1);
                                const setJudgePostCount = document.createElement("input");
                                setJudgePostCount.type = "number";
                                setJudgePostCount.value = this.option.judge.postCount.toString();
                                setJudgePostCount.min = "2";
                                setJudgePostCount.style.width = "40px";
                                setJudgePostCount.style.height = "20px";
                                setJudgePostCount.style.fontSize = "120%";
                                setJudgePostCount.addEventListener("change", async () => {
                                    const num = parseInt(setJudgePostCount.value);
                                    if (num >= 2) {
                                        this.option.judge.postCount = num;
                                        await this.optionStorage.SetStorageData(this.option);
                                    }
                                    else {
                                        this.option.judge.postCount = 2;
                                        setJudgePostCount.value = this.option.judge.postCount.toString();
                                    }
                                });
                                setJudgeRigorDiv.appendChild(setJudgePostCount);
                                const setJudgeText2 = document.createElement("span");
                                setJudgeText2.textContent = "回投稿で仮荒らし認定";
                                setJudgeText2.style.color = "black";
                                setJudgeText2.style.fontSize = "15px";
                                setJudgeRigorDiv.appendChild(setJudgeText2);
                            }
                            const setJudgePeriodDiv = document.createElement("div");
                            setJudgePeriodDiv.style.padding = "0px 10px 5px 10px";
                            setJudgeDiv.appendChild(setJudgePeriodDiv);
                            {
                                //日
                                const setJudgePeriod = document.createElement("input");
                                setJudgePeriod.style.marginRight = "5px";
                                setJudgePeriod.type = "text";
                                setJudgePeriod.style.width = "40px";
                                setJudgePeriod.style.height = "18px";
                                setJudgePeriod.style.fontSize = "120%";
                                setJudgePeriod.value = this.option.judge.period.toString();
                                setJudgePeriodDiv.appendChild(setJudgePeriod);
                                setJudgePeriod.addEventListener("change", async () => {
                                    const num = Number(setJudgePeriod.value);
                                    if (num >= 0) {
                                        this.option.judge.period = num;
                                        await this.optionStorage.SetStorageData(this.option);
                                    }
                                    else {
                                        this.option.judge.period = 0;
                                        setJudgePeriod.value = this.option.judge.period.toString();
                                    }
                                });
                                const setJudgePeriodText = document.createElement("span");
                                setJudgePeriodText.textContent = "日前のイラストまで対象(0で無限)";
                                setJudgePeriodText.style.color = "black";
                                setJudgePeriodText.style.fontSize = "15px";
                                setJudgePeriodDiv.appendChild(setJudgePeriodText);
                            }
                            const setAutoNGHiddenDiv = document.createElement("div");
                            setAutoNGHiddenDiv.style.padding = "0px 10px";
                            setJudgeDiv.appendChild(setAutoNGHiddenDiv);
                            {
                                const setAutoNGHiddenLabel = document.createElement("label");
                                setAutoNGHiddenDiv.appendChild(setAutoNGHiddenLabel);
                                {
                                    const setAutoNGHiddenCheckbox = document.createElement("input");
                                    setAutoNGHiddenCheckbox.style.padding = "3px";
                                    setAutoNGHiddenCheckbox.style.marginRight = "5px";
                                    setAutoNGHiddenCheckbox.type = "checkbox";
                                    setAutoNGHiddenCheckbox.checked = this.option.judge.isAutoNGHidden;
                                    setAutoNGHiddenLabel.appendChild(setAutoNGHiddenCheckbox);
                                    setAutoNGHiddenCheckbox.addEventListener("change", async () => {
                                        this.option.judge.isAutoNGHidden = setAutoNGHiddenCheckbox.checked;
                                        for (let info of this.illustInfos) {
                                            this.UpdateIllust(info);
                                            this.DrawBlackWhiteButton(info);
                                        }
                                        this.UpdateIllustList();
                                        await this.optionStorage.SetStorageData(this.option);
                                    });
                                    const setAutoNGHiddenText = document.createElement("span");
                                    setAutoNGHiddenText.textContent = "自動NGしたのを非表示にする";
                                    setAutoNGHiddenText.style.color = "black";
                                    setAutoNGHiddenText.style.fontSize = "15px";
                                    setAutoNGHiddenLabel.appendChild(setAutoNGHiddenText);
                                }
                            }
                            judgeRigorCover.style.backgroundColor = "gray";
                            judgeRigorCover.style.width = "320px";
                            judgeRigorCover.style.height = "100%";
                            judgeRigorCover.style.zIndex = "1000";
                            judgeRigorCover.style.opacity = "0.5";
                            judgeRigorCover.style.position = "absolute";
                            judgeRigorCover.style.top = "0";
                            setJudgeDiv.appendChild(judgeRigorCover);
                            if (this.option.judge.isJudge) {
                                judgeRigorCover.style.visibility = "hidden";
                            }
                            else {
                                judgeRigorCover.style.visibility = "visible";
                            }
                        }
                        const otherSettingH5 = document.createElement("h1");
                        otherSettingH5.textContent = "その他";
                        otherSettingH5.style.fontSize = "140%";
                        otherSettingH5.style.marginTop = "10px";
                        otherSettingH5.style.color = "black";
                        detailDialog.appendChild(otherSettingH5);
                        //const setToOKPeriodDiv = document.createElement("div");
                        //setToOKPeriodDiv.style.padding = "5px";
                        //detailDialog.appendChild(setToOKPeriodDiv);
                        //{
                        //    const setToOKPeriodText1 = document.createElement("div");
                        //    setToOKPeriodText1.textContent = "取得したなかで最新絵が";
                        //    setToOKPeriodText1.style.color = "black";
                        //    setToOKPeriodText1.style.fontSize = "15px";
                        //    setToOKPeriodDiv.appendChild(setToOKPeriodText1);
                        //    const setToOKPeriodText2 = document.createElement("div");
                        //    setToOKPeriodText2.textContent = "これより前のものなら未分類化(0で無効)";
                        //    setToOKPeriodText2.style.color = "black";
                        //    setToOKPeriodText2.style.fontSize = "15px";
                        //    setToOKPeriodDiv.appendChild(setToOKPeriodText2);
                        //    for (let i = Status.OK; i < Status.MAX; i++) {
                        //        const setToOKPeriodStatusDiv = document.createElement("div");
                        //        setToOKPeriodDiv.appendChild(setToOKPeriodStatusDiv);
                        //        const setToOKPeriodStatusNameText = document.createElement("span");
                        //        setToOKPeriodStatusNameText.textContent = Status[i]+": ";
                        //        setToOKPeriodStatusNameText.style.color = "black";
                        //        setToOKPeriodStatusNameText.style.fontSize = "15px";
                        //        setToOKPeriodStatusDiv.appendChild(setToOKPeriodStatusNameText);
                        //        if (i == Status.OK) {
                        //            const setToOKPeriodStatusOKText = document.createElement("span");
                        //            setToOKPeriodStatusOKText.textContent = "これが未分類リスト";
                        //            setToOKPeriodStatusOKText.style.color = "black";
                        //            setToOKPeriodStatusOKText.style.fontSize = "15px";
                        //            setToOKPeriodStatusDiv.appendChild(setToOKPeriodStatusOKText);
                        //            continue;
                        //        }
                        //        //日
                        //        const setToOKPeriod = document.createElement("input");
                        //        setToOKPeriod.style.marginRight = "5px";
                        //        setToOKPeriod.type = "text";
                        //        setToOKPeriod.style.width = "40px";
                        //        setToOKPeriod.style.height = "5px";
                        //        setToOKPeriod.style.fontSize = "120%";
                        //        setToOKPeriod.value = this.option.judge.period.toString();
                        //        setToOKPeriodStatusDiv.appendChild(setToOKPeriod);
                        //        setToOKPeriod.addEventListener("change", async () => {
                        //            const num = Number(setToOKPeriod.value);
                        //            if (num >= 0) {
                        //                this.option.judge.period = num;
                        //                await this.optionStorage.SetStorageData(this.option);
                        //            } else {
                        //                this.option.judge.period = 0;
                        //                setToOKPeriod.value = this.option.judge.period.toString();
                        //            }
                        //        });
                        //        const setToOKPeriodText = document.createElement("span");
                        //        setToOKPeriodText.textContent = "日";
                        //        setToOKPeriodText.style.color = "black";
                        //        setToOKPeriodText.style.fontSize = "15px";
                        //        setToOKPeriodStatusDiv.appendChild(setToOKPeriodText);
                        //    }
                        //}
                        const setOKCacheMaxFlex = document.createElement("div");
                        setOKCacheMaxFlex.style.padding = "5px";
                        detailDialog.appendChild(setOKCacheMaxFlex);
                        {
                            const setOKCacheMaxText1 = document.createElement("span");
                            setOKCacheMaxText1.textContent = "OKユーザーのキャッシュ最大数：";
                            setOKCacheMaxText1.style.color = "black";
                            setOKCacheMaxText1.style.fontSize = "15px";
                            setOKCacheMaxFlex.appendChild(setOKCacheMaxText1);
                            const setOKCacheMax = document.createElement("input");
                            setOKCacheMax.type = "number";
                            setOKCacheMax.value = this.option.okCacheMax.toString();
                            setOKCacheMax.style.width = "80px";
                            setOKCacheMax.min = "100";
                            setOKCacheMax.style.height = "20px";
                            setOKCacheMax.style.fontSize = "120%";
                            setOKCacheMax.addEventListener("change", async () => {
                                const num = parseInt(setOKCacheMax.value);
                                if (num >= 100) {
                                    this.option.okCacheMax = num;
                                    await this.optionStorage.SetStorageData(this.option);
                                }
                                else {
                                    this.option.okCacheMax = 100;
                                    setOKCacheMax.value = this.option.okCacheMax.toString();
                                }
                            });
                            setOKCacheMaxFlex.appendChild(setOKCacheMax);
                        }
                    }
                    const list2 = document.createElement("div");
                    list2.style.position = "relative";
                    list2.style.display = "flex";
                    this.optionDialog.appendChild(list2);
                    {
                        const userInfoList = document.createElement("ul");
                        userInfoList.className = "scrollUL";
                        userInfoList.style.overflowY = "scroll";
                        userInfoList.style.overflowX = "hidden";
                        userInfoList.style.height = "400px";
                        userInfoList.style.width = "250px";
                        list2.appendChild(userInfoList);
                        const buttonList = document.createElement("ul");
                        buttonList.style.width = "90px";
                        list2.appendChild(buttonList);
                        {
                            const moveButtonList = document.createElement("div");
                            moveButtonList.style.marginTop = "20px";
                            moveButtonList.style.marginBottom = "10px";
                            buttonList.appendChild(moveButtonList);
                            {
                                for (let i = Status.OK; i < Status.MAX; i++) {
                                    const div = document.createElement("div");
                                    moveButtonList.appendChild(div);
                                    {
                                        const toButton = document.createElement("input");
                                        toButton.type = "button";
                                        toButton.style.padding = "3px";
                                        toButton.style.fontSize = "130%";
                                        toButton.style.margin = "3px";
                                        toButton.value = "→ " + Status[i];
                                        toButton.name = Status[i];
                                        div.appendChild(toButton);
                                        toButton.addEventListener("click", async () => {
                                            while (this.selectedList.length != 0) {
                                                const element = this.selectedList.pop();
                                                if (element == undefined) {
                                                    continue;
                                                }
                                                element.style.backgroundColor = "";
                                                const userId = element.getElementsByClassName("userId")[0].textContent;
                                                if (userId == undefined) {
                                                    continue;
                                                }
                                                const user = this.cache.get(userId);
                                                if (user != undefined) {
                                                    user.status = Status[toButton.name];
                                                }
                                            }
                                            for (let info of this.illustInfos) {
                                                this.UpdateIllust(info);
                                                this.DrawBlackWhiteButton(info);
                                            }
                                            this.UpdateIllustList();
                                            this.DrawList();
                                            await this.cacheStorage.SetStorageData([...this.cache]);
                                        });
                                    }
                                }
                            }
                            const DeleteSelectedUser = () => {
                                while (this.selectedList.length != 0) {
                                    const element = this.selectedList.pop();
                                    if (element == undefined) {
                                        continue;
                                    }
                                    const userId = element.getElementsByClassName("userId")[0].textContent;
                                    if (userId == undefined) {
                                        continue;
                                    }
                                    this.cache.delete(userId);
                                    const infos = this.illustInfos.filter(info => info.userId == userId);
                                    for (let info of infos) {
                                        info.user.status = Status.WHITE;
                                        this.UpdateIllust(info);
                                        this.DrawBlackWhiteButton(info);
                                    }
                                    this.UpdateIllustList();
                                    this.illustInfos = this.illustInfos.filter(info => info.userId != userId);
                                }
                            };
                            const div = document.createElement("div");
                            buttonList.appendChild(div);
                            {
                                const selectedCacheClearButton = document.createElement("input");
                                selectedCacheClearButton.type = "button";
                                selectedCacheClearButton.style.padding = "3px";
                                selectedCacheClearButton.style.fontSize = "120%";
                                selectedCacheClearButton.style.margin = "3px";
                                selectedCacheClearButton.style.marginTop = "5px";
                                selectedCacheClearButton.style.backgroundColor = "yellow";
                                selectedCacheClearButton.style.cssText += "color: black !important";
                                selectedCacheClearButton.value = "→ DELETE";
                                div.appendChild(selectedCacheClearButton);
                                selectedCacheClearButton.addEventListener("click", async () => {
                                    if (!window.confirm("選択したアイテムのキャッシュクリアしていいですか？\nホワイト・ブラックリストも削除されます。")) {
                                        return;
                                    }
                                    DeleteSelectedUser();
                                    this.DrawList();
                                    await this.cacheStorage.SetStorageData([...this.cache]);
                                });
                            }
                            const div2 = document.createElement("div");
                            buttonList.appendChild(div2);
                            {
                                const allCacheClearButton = document.createElement("input");
                                allCacheClearButton.type = "button";
                                allCacheClearButton.style.padding = "3px";
                                allCacheClearButton.style.fontSize = "120%";
                                allCacheClearButton.style.margin = "3px";
                                allCacheClearButton.style.backgroundColor = "red";
                                allCacheClearButton.value = "ALL DELETE";
                                div2.appendChild(allCacheClearButton);
                                allCacheClearButton.addEventListener("click", async () => {
                                    if (!window.confirm("全キャッシュクリアしていいですか？\nホワイト・ブラックリストも削除されます。")) {
                                        return;
                                    }
                                    for (let info of this.illustInfos) {
                                        info.user.status = Status.WHITE;
                                        this.UpdateIllust(info);
                                        this.DrawBlackWhiteButton(info);
                                    }
                                    this.illustInfos = [];
                                    this.UpdateIllustList();
                                    this.cache.clear();
                                    this.DrawList();
                                    await this.cacheStorage.SetStorageData([...this.cache]);
                                });
                            }
                            const div3 = document.createElement("div");
                            buttonList.appendChild(div3);
                            {
                                const reStartButton = document.createElement("input");
                                reStartButton.type = "button";
                                reStartButton.style.padding = "3px";
                                reStartButton.style.fontSize = "120%";
                                reStartButton.style.margin = "3px";
                                reStartButton.style.marginTop = "10px";
                                reStartButton.style.backgroundColor = "green";
                                reStartButton.style.cssText += "color: white !important";
                                reStartButton.value = "RE START";
                                div3.appendChild(reStartButton);
                                reStartButton.addEventListener("click", async () => {
                                    await this.Run();
                                });
                            }
                            const div4 = document.createElement("div");
                            div4.style.marginTop = "10px";
                            div4.style.marginBottom = "10px";
                            buttonList.appendChild(div4);
                            {
                                const importDiv = document.createElement("div");
                                importDiv.style.position = "relative";
                                div4.appendChild(importDiv);
                                {
                                    const importButton = document.createElement("input");
                                    importButton.type = "button";
                                    importButton.style.padding = "3px";
                                    importButton.style.fontSize = "120%";
                                    importButton.style.margin = "3px";
                                    importButton.style.marginTop = "10px";
                                    importButton.value = "← IMPORT";
                                    importDiv.appendChild(importButton);
                                    const importFile = document.createElement("input");
                                    importFile.type = "file";
                                    importFile.style.position = "absolute";
                                    importFile.style.opacity = "0";
                                    importFile.style.width = "80px";
                                    importFile.style.top = "8px";
                                    importFile.style.left = "0";
                                    importFile.accept = "text/plain";
                                    importFile.style.padding = "0";
                                    importDiv.appendChild(importFile);
                                    importFile.addEventListener("change", async (e) => {
                                        if (e.target == null) {
                                            return;
                                        }
                                        const files = e.target.files;
                                        if (files == null) {
                                            return;
                                        }
                                        const file = files[0];
                                        if (file.type != "text/plain") {
                                            alert("テキストファイルを入れてください。");
                                            return;
                                        }
                                        if (!window.confirm("インポートしていいですか?\nインポートする前に、今選択しているユーザーは削除されます。")) {
                                            return;
                                        }
                                        DeleteSelectedUser();
                                        this.DrawList();
                                        const reader = new FileReader();
                                        reader.readAsText(file);
                                        reader.onload = async () => {
                                            if (typeof reader.result != "string") {
                                                return;
                                            }
                                            const importUsers = this.ListToMap(JSON.parse(reader.result));
                                            for (let [imUserId, imUser] of importUsers) {
                                                for (let illust of imUser.illusts) {
                                                    illust.created = new Date(illust.created);
                                                }
                                            }
                                            for (let [imUserId, imUser] of importUsers) {
                                                if (imUser == null) {
                                                    continue;
                                                }
                                                const cachedUser = this.cache.get(imUserId);
                                                if (cachedUser == undefined) {
                                                    this.cache.set(imUserId, imUser);
                                                }
                                                else {
                                                    cachedUser.status = imUser.status;
                                                    for (let illust of cachedUser.illusts) {
                                                        if (cachedUser.illusts.some(c => c.illustId == illust.illustId)) {
                                                            continue;
                                                        }
                                                        if (illust == null) {
                                                            continue;
                                                        }
                                                        cachedUser.illusts.push(illust);
                                                    }
                                                }
                                            }
                                            await this.cacheStorage.SetStorageData([...this.cache]);
                                            this.Run();
                                        };
                                    });
                                }
                                const exportEiv = document.createElement("div");
                                div4.appendChild(exportEiv);
                                {
                                    const reStartButton = document.createElement("input");
                                    reStartButton.type = "button";
                                    reStartButton.style.padding = "3px";
                                    reStartButton.style.fontSize = "120%";
                                    reStartButton.style.margin = "3px";
                                    reStartButton.style.marginTop = "5px";
                                    reStartButton.value = "→ EXPORT";
                                    exportEiv.appendChild(reStartButton);
                                    reStartButton.addEventListener("click", async () => {
                                        const selectedUsers = new Map();
                                        for (let element of this.selectedList) {
                                            if (element == undefined) {
                                                continue;
                                            }
                                            const userId = element.getElementsByClassName("userId")[0].textContent;
                                            if (userId == null) {
                                                continue;
                                            }
                                            const user = this.cache.get(userId);
                                            if (user != undefined) {
                                                selectedUsers.set(userId, user);
                                            }
                                        }
                                        if (selectedUsers.size == 0) {
                                            alert("出力するユーザーを選択してください");
                                            return;
                                        }
                                        const listStatusSelect = this.optionDialog.getElementsByClassName("listStatusSelect")[0];
                                        const status = listStatusSelect.value;
                                        const blob = new Blob([JSON.stringify(selectedUsers)], { type: "text/plain" });
                                        const dlUrl = URL.createObjectURL(blob);
                                        await Util.Download(dlUrl, `niconicoNG_${status}.txt`);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        UpdateIllust(info) {
            const img = info.element.getElementsByTagName("img")[0] ?? info.element.getElementsByClassName("image-layer")[0];
            if (info.user.status == Status.OK || info.user.status == Status.WHITE) {
                if (img != null) {
                    img.style.filter = "brightness(1)";
                }
                if (info.element.parentElement == null) {
                    info.parent.appendChild(info.element);
                }
            }
            if (info.user.status == Status.NG || (info.user.status == Status.AUTO && !this.option.judge.isAutoNGHidden)) {
                if (img != null) {
                    img.style.filter = "brightness(0.3)";
                }
                info.parent.appendChild(info.element);
            }
            if (info.user.status == Status.BLACK || (info.user.status == Status.AUTO && this.option.judge.isAutoNGHidden)) {
                info.element.remove();
            }
        }
        UpdateIllustList() {
            for (let illustListElement of this.illustListElements) {
                if (this.currentPage == VirtualPageType.ILLUST) {
                    for (let moreLink of Array.from(illustListElement.getElementsByClassName("list_more_link"))) {
                        if (moreLink.parentElement == null) {
                            continue;
                        }
                        moreLink.parentElement.appendChild(moreLink);
                    }
                }
                if (this.currentPage == VirtualPageType.KEYWORD_SEARCH) {
                    const brs = illustListElement.getElementsByTagName("br");
                    while (brs.length) {
                        brs[0].remove();
                    }
                    for (var i = 0; i < illustListElement.childElementCount; i++) {
                        if ((i % 6) != 4) {
                            continue;
                        }
                        illustListElement.children[i].insertAdjacentHTML("afterend", "<br clear='all'>");
                    }
                    illustListElement.insertAdjacentHTML("beforeend", "<br clear='all'>");
                }
                if (this.currentPage == VirtualPageType.PERSONALIZE) {
                    const brs = Array.from(illustListElement.getElementsByTagName("br"));
                    for (let br of brs) {
                        br.remove();
                    }
                    const items = Array.from(illustListElement.getElementsByClassName(virtualPageInfos[this.currentPage].illustItemName));
                    for (let i = 0; i < items.length; i++) {
                        if ((i + 1) % 4 == 0 || i == items.length - 1) {
                            const br = document.createElement("br");
                            br.clear = "all";
                            items[i].insertAdjacentElement("afterend", br);
                        }
                    }
                }
                if (this.currentPage == VirtualPageType.ADS) {
                    const ds = illustListElement.getElementsByClassName("ADS_Dammy");
                    while (ds.length)
                        ds[0].remove();
                    if (1 < illustListElement.childElementCount) {
                        for (var i = illustListElement.childElementCount; i < 3; i++) {
                            const dammy = document.createElement("div");
                            dammy.classList.add("ADS_Dammy");
                            dammy.style.width = illustListElement.children[0].clientWidth + "px";
                            illustListElement.appendChild(dammy);
                        }
                    }
                }
            }
        }
        CreateUserLink(illustInfo) {
            if (this.currentPage == VirtualPageType.PERSONALIZE || !this.option.createUserLink || illustInfo.element.getElementsByClassName("userLink").length > 0) {
                return;
            }
            const userElement = illustInfo.element.getElementsByClassName("user")[0];
            if (userElement == null) {
                return;
            }
            const userA = document.createElement("a");
            userA.className = "userLink";
            userA.href = "https://seiga.nicovideo.jp/user/illust/" + illustInfo.userId;
            userA.style.left = "0";
            userA.style.zIndex = "10";
            userA.style.right = "10px";
            userA.style.position = "absolute";
            userA.style.border = "0";
            userA.style.opacity = "0";
            userA.addEventListener("mouseover", () => {
                userA.style.border = "solid 1px silver";
                userA.style.opacity = "0.3";
            });
            userA.addEventListener("mouseleave", () => {
                userA.style.border = "0";
                userA.style.opacity = "0";
            });
            if (this.currentPage == VirtualPageType.TAG_SEARCH) {
                userA.style.height = "10px";
                userA.style.top = "34px";
                userA.style.backgroundColor = "silver";
            }
            if (this.currentPage == VirtualPageType.ILLUST) {
                userA.style.height = "20px";
                userA.style.top = "20px";
                userA.style.backgroundColor = "black";
            }
            userElement.style.position = "relative";
            userElement.style.zIndex = "20";
            userElement.style.pointerEvents = "none";
            userElement.insertAdjacentElement("beforebegin", userA);
        }
        async DrawBlackWhiteButton(illustInfo) {
            if (!this.option.createBlackWhiteButton) {
                return;
            }
            if (illustInfo.user.status == Status.BLACK || illustInfo.user.status == Status.WHITE) {
                if (illustInfo.user.status == Status.WHITE) {
                    const list = Array.from(illustInfo.element.getElementsByClassName("toListButton"));
                    for (let l of list) {
                        l.remove();
                    }
                }
                return;
            }
            if (illustInfo.element.getElementsByClassName("toListButton").length > 0) {
                return;
            }
            const whiteButton = document.createElement("input");
            const blackButton = document.createElement("input");
            whiteButton.style.zIndex = "20";
            whiteButton.style.visibility = "hidden";
            whiteButton.style.cursor = "default";
            if (this.currentPage == VirtualPageType.TAG_SEARCH) {
                whiteButton.style.left = "117px";
                whiteButton.style.top = "-30px";
                whiteButton.style.width = "40px";
                whiteButton.style.height = "25px";
                whiteButton.style.position = "relative";
            }
            if (this.currentPage == VirtualPageType.ILLUST) {
                whiteButton.style.left = "54px";
                whiteButton.style.top = "-19px";
                whiteButton.style.width = "30px";
                whiteButton.style.height = "19px";
                whiteButton.style.position = "relative";
            }
            if (this.currentPage == VirtualPageType.PERSONALIZE) {
                whiteButton.style.top = "240px";
                whiteButton.style.width = "40px";
                whiteButton.style.height = "25px";
                whiteButton.style.position = "absolute";
                illustInfo.element.style.position = "relative";
                illustInfo.element.style.height = "258px";
            }
            if (this.currentPage == VirtualPageType.ADS) {
                whiteButton.style.top = "85px";
                whiteButton.style.width = "30px";
                whiteButton.style.height = "19px";
                whiteButton.style.position = "absolute";
                whiteButton.style.border = "2px solid #736b5e";
                illustInfo.element.style.position = "relative";
            }
            if (this.currentPage == VirtualPageType.KEYWORD_SEARCH) {
                whiteButton.style.top = "144px";
                whiteButton.style.width = "30px";
                whiteButton.style.height = "19px";
                whiteButton.style.position = "absolute";
                illustInfo.element.style.position = "relative";
            }
            //上記のスタイルを両方に適用
            blackButton.style.cssText = whiteButton.style.cssText;
            whiteButton.type = "button";
            blackButton.type = "button";
            whiteButton.className = "toListButton";
            blackButton.className = "toListButton";
            whiteButton.name = "white";
            blackButton.name = "black";
            whiteButton.style.cssText += `background-color : white !important;`;
            blackButton.style.cssText += `background-color : black !important;`;
            if (this.currentPage == VirtualPageType.PERSONALIZE) {
                whiteButton.style.left = "77px";
                blackButton.style.left = "117px";
            }
            if (this.currentPage == VirtualPageType.ADS) {
                whiteButton.style.left = "135px";
                blackButton.style.left = "165px";
            }
            if (this.currentPage == VirtualPageType.KEYWORD_SEARCH) {
                whiteButton.style.right = "28px";
                blackButton.style.right = "-2px";
            }
            whiteButton.addEventListener("contextmenu", async (e) => {
                e.preventDefault();
                illustInfo.user.status = Status.OK;
                for (let info of this.illustInfos) {
                    this.UpdateIllust(info);
                }
                this.UpdateIllustList();
                this.DrawList();
                await this.cacheStorage.SetStorageData([...this.cache]);
            });
            whiteButton.addEventListener("click", async () => {
                illustInfo.user.status = Status.WHITE;
                for (let info of this.illustInfos) {
                    this.UpdateIllust(info);
                    const buttons = info.element.getElementsByClassName("toListButton");
                    while (buttons.length != 0) {
                        buttons[0].remove();
                    }
                }
                this.UpdateIllustList();
                this.DrawList();
                await this.cacheStorage.SetStorageData([...this.cache]);
            });
            blackButton.addEventListener("contextmenu", async (e) => {
                e.preventDefault();
                illustInfo.user.status = Status.NG;
                for (let info of this.illustInfos) {
                    this.UpdateIllust(info);
                }
                this.UpdateIllustList();
                this.DrawList();
                await this.cacheStorage.SetStorageData([...this.cache]);
            });
            blackButton.addEventListener("click", async () => {
                illustInfo.user.status = Status.BLACK;
                for (let info of this.illustInfos) {
                    this.UpdateIllust(info);
                }
                this.UpdateIllustList();
                this.DrawList();
                await this.cacheStorage.SetStorageData([...this.cache]);
            });
            if (this.currentPage == VirtualPageType.TAG_SEARCH) {
                const infoElement = illustInfo.element.getElementsByClassName("illust_count")[0];
                blackButton.addEventListener("mouseover", () => {
                    infoElement.style.opacity = "1";
                });
                blackButton.addEventListener("mouseleave", () => {
                    infoElement.style.opacity = "";
                });
                whiteButton.addEventListener("mouseover", () => {
                    infoElement.style.opacity = "1";
                });
                whiteButton.addEventListener("mouseleave", () => {
                    infoElement.style.opacity = "";
                });
            }
            if (this.currentPage == VirtualPageType.ILLUST) {
                const infoElement = illustInfo.element.getElementsByClassName("illust_info")[0];
                blackButton.addEventListener("mouseover", () => {
                    infoElement.style.bottom = "0px";
                });
                blackButton.addEventListener("mouseleave", () => {
                    infoElement.style.bottom = "";
                });
                whiteButton.addEventListener("mouseover", () => {
                    infoElement.style.bottom = "0px";
                });
                whiteButton.addEventListener("mouseleave", () => {
                    infoElement.style.bottom = "";
                });
            }
            illustInfo.element.addEventListener("mouseover", () => {
                blackButton.style.visibility = "visible";
                whiteButton.style.visibility = "visible";
            });
            illustInfo.element.addEventListener("touchstart", () => {
                blackButton.style.visibility = "visible";
                whiteButton.style.visibility = "visible";
            });
            illustInfo.element.addEventListener("mouseleave", () => {
                blackButton.style.visibility = "hidden";
                whiteButton.style.visibility = "hidden";
            });
            illustInfo.element.addEventListener("touchend", () => {
                blackButton.style.visibility = "hidden";
                whiteButton.style.visibility = "hidden";
            });
            if (this.currentPage == VirtualPageType.ADS) {
                illustInfo.element.insertAdjacentElement("afterbegin", blackButton);
                illustInfo.element.insertAdjacentElement("afterbegin", whiteButton);
                return;
            }
            illustInfo.element.appendChild(whiteButton);
            illustInfo.element.appendChild(blackButton);
        }
        async AddInfos(illustListElement) {
            const illustItemName = virtualPageInfos[this.currentPage].illustItemName;
            let illustElements;
            if (this.currentPage == VirtualPageType.KEYWORD_SEARCH || this.currentPage == VirtualPageType.PERSONALIZE) {
                illustElements = Array.from(illustListElement.getElementsByClassName(illustItemName));
            }
            else {
                illustElements = Array.from(illustListElement.getElementsByTagName("li"))
                    .filter(e => illustItemName == "" || e.classList.contains(illustItemName) || e.firstElementChild?.classList.contains(illustItemName));
            }
            const illustIds = this.GetIllustIds(illustListElement);
            const names = Array.from(illustListElement.getElementsByClassName("user"));
            //console.log(illustIds);
            //console.log(illustElements);
            //console.log(names);
            //キャッシュからの情報と合わせて追加（もうこれ分かんねぇこともある）
            for (let i = 0; i < illustIds.length; i++) {
                if (this.illustInfos.some(info => info.illust.illustId == illustIds[i] && info.element == illustElements[i])) {
                    continue;
                }
                if (illustElements[i] == null) {
                    continue;
                }
                const info = this.GetInfo(illustIds[i]);
                if (info != undefined && names[i]?.textContent != null) {
                    info.user.name = names[i].textContent ?? info.user.name;
                }
                this.illustInfos.push({
                    userId: info == undefined ? "" : info.userId,
                    illust: info == undefined ? { created: "", illustId: illustIds[i] } : info.illust,
                    user: info == undefined ? { illusts: [], status: Status.NONE, name: names[i]?.textContent ?? "" } : info.user,
                    element: illustElements[i],
                    parent: illustListElement
                });
            }
        }
        SetCurrentPage(url) {
            for (let i = 0; i < pageInfos.length; i++) {
                if (pageInfos[i].regex.test(url)) {
                    this.currentPage = pageInfos[i].type;
                    return this.option.usePages[i];
                }
            }
            this.currentPage = VirtualPageType.None;
            return false;
        }
        GetPage() {
            return this.currentPage;
        }
        //メインクラス、メイン関数の肥大化もう始まってる！
        async Run(illustListElements) {
            const illustListName = virtualPageInfos[this.currentPage].illustListName;
            let firstIllustListElement;
            if (illustListName == "") {
                firstIllustListElement = await Observer.DefinitelyGetElementByTagName("ul", undefined, { isDeepSearch: true });
            }
            else {
                firstIllustListElement = await Observer.DefinitelyGetElementByClassName(illustListName, undefined, { isDeepSearch: true });
            }
            if (this.currentPage == VirtualPageType.ADS) {
                await Observer.DefinitelyGetElementByTagName("li", undefined, { isDeepSearch: true });
                if (firstIllustListElement) {
                    firstIllustListElement.style.visibility = "hidden";
                    firstIllustListElement.style.overflow = "hidden";
                }
            }
            await Util.WithTimeOut(Observer.DefinitelyGetElementById("footer"), 1000);
            if (illustListElements == null) {
                if (illustListName == "") {
                    illustListElements = Array.from(document.getElementsByTagName("ul"));
                }
                else {
                    illustListElements = Array.from(document.getElementsByClassName(illustListName));
                }
            }
            for (let illustListElement of illustListElements) {
                illustListElement.style.visibility = "hidden";
                await this.AddInfos(illustListElement);
                this.illustListElements.add(illustListElement);
            }
            //console.log("infos", this.illustInfos, this.illustInfos.length);
            //誰のイラストかこれもう分かんねぇやつ達
            const unkownInfos = this.illustInfos.filter(info => info.userId == "");
            //console.log("unkownInfos", unkownInfos);
            //この戻り値なんかダサい・・・ダサくない？
            const result = await Fetcher.FetchIllustDatas(unkownInfos.map(info => info.illust.illustId));
            //誰のかこれもう分かんねぇやつらとキャッシュまで！？の情報更新
            for (let i = 0; i < unkownInfos.length; i++) {
                if (result.illusts[i] == null) {
                    //alert("null!!!");
                    //console.log(result);
                    //debugger;
                    continue;
                }
                unkownInfos[i].illust = result.illusts[i];
                unkownInfos[i].userId = result.userIds[i];
                let cachedUser = this.cache.get(result.userIds[i]);
                if (cachedUser == undefined) {
                    if (unkownInfos[i].user == null) {
                        //alert("null!!!");
                        //console.log(unkownInfos);
                        //debugger;
                        continue;
                    }
                    unkownInfos[i].user.status = Status.OK;
                    this.cache.set(unkownInfos[i].userId, unkownInfos[i].user);
                }
                else {
                    ////キャッシュ使ったら後ろにしとく
                    this.cache.delete(result.userIds[i]);
                    this.cache.set(result.userIds[i], cachedUser);
                    unkownInfos[i].user = cachedUser;
                }
                if (!unkownInfos[i].user.illusts.some(illust => illust.illustId == result.illusts[i].illustId)) {
                    unkownInfos[i].user.illusts.push(result.illusts[i]);
                }
            }
            // IDが見つからないものを削除する
            this.illustInfos = this.illustInfos.filter(info => info.userId != "");
            //増えすぎたキャッシュ削除
            if (this.cache.size > 0) {
                let okCount = 0;
                for (let [userId, user] of this.cache) {
                    if (user.status == Status.OK) {
                        okCount++;
                    }
                }
                for (let [userId, user] of this.cache) {
                    if (okCount < this.option.okCacheMax) {
                        break;
                    }
                    //OK以外消さない
                    //今使ってたら消さない
                    if (user.status == Status.OK && !this.illustInfos.some(info => info.userId == userId)) {
                        this.cache.delete(userId);
                        okCount--;
                    }
                }
            }
            //console.log(result);
            //ブラック,ホワイトリストにないイラストエレメントにボタン追加
            for (let illustInfo of this.illustInfos) {
                this.DrawBlackWhiteButton(illustInfo);
                this.CreateUserLink(illustInfo);
            }
            if (this.option.judge.isJudge) {
                //投稿者の荒らし判定更新 ↓これは重複排除
                for (let c of [...new Set(this.illustInfos.map(u => u.user))]) {
                    this.CheckAutoNG(c);
                }
            }
            await this.cacheStorage.SetStorageData([...this.cache]);
            for (let info of this.illustInfos) {
                this.UpdateIllust(info);
            }
            this.UpdateIllustList();
            for (let illustListElement of illustListElements) {
                illustListElement.style.visibility = "visible";
            }
            await this.SetOptionButton();
            this.DrawList();
        }
        async StartObserve() {
            const illustListName = virtualPageInfos[this.currentPage].illustListName;
            if (illustListName == "") {
                return;
            }
            const illustListParent = (await Observer.DefinitelyGetElementByClassName(illustListName)).parentNode;
            const mutationObserver = new MutationObserver(async (mrs) => {
                for (let mr of mrs) {
                    for (let i = 0; i < mr.addedNodes.length; i++) {
                        const element = mr.addedNodes[i];
                        if (element.classList == null) {
                            continue;
                        }
                        if (element.classList.contains(illustListName)) {
                            await this.Run([element]);
                        }
                    }
                }
            });
            mutationObserver.observe(illustListParent ?? document, {
                childList: true,
                subtree: true
            });
        }
    }
    ;
    const main = new Main();
    await main.GetStorageData();
    const isUseNG = main.SetCurrentPage(location.href);
    await Util.WaitDocumentElement();
    main.SetOptionButton();
    if (!isUseNG) {
        return;
    }
    await main.Run();
    await main.StartObserve();
})();
