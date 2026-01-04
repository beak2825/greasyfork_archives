// ==UserScript==
// @name         ニコニコ静画、退会したユーザーの情報を表示
// @namespace    http://tampermonkey.net/
// @version      1.14518
// @description  ユーザーページはわりと雑な再現
// @author       cbxm
// @match        https://seiga.nicovideo.jp/seiga/*
// @match        https://seiga.nicovideo.jp/user/illust/*
// @connect      seiga.nicovideo.jp
// @connect      sp.seiga.nicovideo.jp
// @run-at       document-start
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/411841/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%E3%80%81%E9%80%80%E4%BC%9A%E3%81%97%E3%81%9F%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411841/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%E3%80%81%E9%80%80%E4%BC%9A%E3%81%97%E3%81%9F%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
(async () => {
    ;
    ;
    ;
    const IsData = (d) => typeof (d.illustCount) == "number" && d.illusts != null && d.user != null;
    class Util {
        //xmlString=未探査部分
        static XmlToObj(xmlString) {
            const F = (xmlString, obj) => {
                //タグを抜き出す
                let tagMatchs = null;
                while (true) {
                    tagMatchs = xmlString.match(/<([^>]+)>/);
                    //タグがないということはそれが値になる
                    if (tagMatchs == null) {
                        return xmlString;
                    }
                    if (tagMatchs[1][tagMatchs[1].length - 1] == "/") {
                        xmlString = xmlString.replace(/<[^>]+>([^]*)/, "$1");
                    }
                    else {
                        break;
                    }
                }
                const tag = tagMatchs[1];
                //タグの内側とその先を抜き出す
                const matchChildlen = [];
                while (true) {
                    const matchs = xmlString.match(new RegExp(`^[^<]*<${tag}>([^]+?)<\/${tag}>([^]*)`));
                    if (matchs == null) {
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
                if (matchChildlen.length == 1) {
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
        static Wait(ms) {
            return new Promise(r => setTimeout(r, ms));
        }
    }
    ;
    class Fetcher {
        static GMFetchText(url) {
            return new Promise(r => {
                GM.xmlHttpRequest({
                    url: url,
                    method: "GET",
                    onload: (response) => {
                        r(response.responseText);
                    }
                });
            });
        }
        static async FetchIllustDataMax200(userId) {
            const uel = "https://seiga.nicovideo.jp/api/user/data?id=" + userId;
            const obj = Util.XmlToObj(await this.GMFetchText(uel));
            const list = Array.isArray(obj.response.image_list) ? obj.response.image_list : [obj.response.image_list.image];
            //console.log(list);
            const illusts = [];
            for (let i = 0; i < list.length; i++) {
                illusts[i] = {
                    id: list[i].id,
                    title: list[i].title,
                    view_count: list[i].view_count,
                    comment_count: list[i].comment_count,
                    clip_count: list[i].clip_count,
                    isSyunga: list[i].illust_type != "0"
                };
                if (illusts[i].title == null) {
                    illusts[i].title = "(無題)";
                }
            }
            const illustCount = Number(obj.response.image_count);
            return { illusts: illusts, count: illustCount };
        }
        static async FetchSpUserIllustDocument(userId, page, sort = "image_created") {
            const uel = `https:\/\/sp.seiga.nicovideo.jp/user/illust/${userId}?page=${page}&sort=${sort}`;
            return Util.HtmlToDocument(await this.GMFetchText(uel));
        }
        static GetUserIllustIds(spDocument) {
            var _a, _b;
            const list = spDocument.getElementsByClassName("list_item");
            const ids = [];
            for (let i = 0; i < list.length; i++) {
                const id = (_b = (_a = list.item(i)) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.getAttribute("data-image-id");
                if (id != null && id != undefined) {
                    ids.push(id);
                }
            }
            return ids;
        }
        static GetUserIllustCount(spDocument) {
            var _a;
            const text = (_a = spDocument.getElementsByClassName("num")[0].textContent) !== null && _a !== void 0 ? _a : "0";
            const match = text.match(/\d+/);
            if (match == null) {
                return 0;
            }
            return parseInt(match[0]);
        }
        static async FetchIllustData(ids) {
            if (ids.length == 0) {
                return [];
            }
            const url = `http:\/\/seiga.nicovideo.jp/api/illust/info?id_list=${ids.join()}`;
            const res = await this.GMFetchText(url);
            const obj = Util.XmlToObj(res);
            const list = Array.isArray(obj.response.image_list) ? obj.response.image_list : [obj.response.image_list.image];
            const illusts = [];
            for (let i = 0; i < list.length; i++) {
                illusts[i] = {
                    id: list[i].id,
                    title: list[i].title,
                    view_count: list[i].view_count,
                    comment_count: list[i].comment_count,
                    clip_count: list[i].clip_count,
                    isSyunga: list[i].adult_level != "0"
                };
                if (illusts[i].title == null) {
                    illusts[i].title = "(無題)";
                }
            }
            return illusts;
        }
        static async FetchUserName(userId) {
            const url = "http://seiga.nicovideo.jp/api/user/info?id=" + userId;
            const json = Util.XmlToObj(await this.GMFetchText(url));
            return json.response.user.nickname;
        }
        static async FetchUserId(illustId) {
            const url = "https://seiga.nicovideo.jp/api/illust/info?id=im" + illustId;
            const resultText = await this.GMFetchText(url);
            const json = Util.XmlToObj(resultText);
            return json.response.image.user_id;
        }
    }
    ;
    class Storage {
        constructor(storageName) {
            this.storageName = "";
            this.storageName = storageName;
        }
        async GetStorageData(defaultValue) {
            const text = await GM.getValue(this.storageName, null);
            return text != null ? JSON.parse(decodeURIComponent(text)) : defaultValue;
        }
        async SetStorageData(data) {
            await GM.setValue(this.storageName, encodeURIComponent(JSON.stringify(data)));
        }
    }
    ;
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
        static WaitAddedNode(predicate, parent, option = null) {
            return new Promise(r => {
                if (option == null) {
                    option = {
                        childList: true,
                        subtree: true
                    };
                }
                const mutationObserver = new MutationObserver((mrs) => {
                    //console.log(document.head.innerHTML);
                    //console.log(document.body.innerHTML);
                    for (let node of mrs) {
                        node.addedNodes.forEach(added => {
                            //console.log(added);
                            if (predicate(added)) {
                                mutationObserver.disconnect();
                                r(added);
                                return;
                            }
                        });
                    }
                });
                mutationObserver.observe(parent, option);
            });
        }
        ;
        static async DefinitelyGetElementById(id, parent = document, option = null) {
            const e = document.getElementById(id);
            if (e != null) {
                return e;
            }
            return this.WaitAddedNode(e => e.id != null && e.id == id, parent, option);
        }
        //getElementsByClassNameをつかうけど単体なので注意
        static async DefinitelyGetElementByClassName(className, parent = document, option = null) {
            const e = document.getElementsByClassName(className)[0];
            if (e != null) {
                return e;
            }
            return this.WaitAddedNode(e => e.classList != null && e.classList.contains(className), parent, option);
        }
        //getElementsByTagNameをつかうけど単体なので注意
        static async DefinitelyGetElementByTagName(tagName, parent = document, option = null) {
            tagName = tagName.toUpperCase();
            const e = document.getElementsByTagName(tagName)[0];
            if (e != null) {
                return e;
            }
            return this.WaitAddedNode(e => e.tagName != null && e.tagName == tagName, parent, option);
        }
    }
    ;
    class State {
        constructor() {
            this.storage = new Storage(State.STORAGE_NAME);
        }
        async GetDataFromUserId(userId) {
            try {
                const promises = [
                    Fetcher.FetchUserName(userId),
                    Fetcher.FetchIllustDataMax200(userId),
                    Fetcher.FetchSpUserIllustDocument(userId, "1")
                ];
                const ress = await Promise.all(promises);
                const illustCountNoSyunga = Fetcher.GetUserIllustCount(ress[2]);
                return {
                    user: {
                        id: userId,
                        name: ress[0]
                    },
                    illusts: ress[1].illusts,
                    illustCount: ress[1].count,
                    illustCountNoSyunga: illustCountNoSyunga
                };
            }
            catch (e) {
                return undefined;
            }
        }
        CacheClear() {
            return this.storage.SetStorageData([]);
        }
    }
    State.DEFAULT_ICON_URL = "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg";
    State.CACHE_MAX = 10;
    State.STORAGE_NAME = "ListCache";
    ;
    class UserState extends State {
        constructor() {
            super();
            this.userId = "";
            const userIdMatchs = location.href.match(/https:\/\/seiga.nicovideo.jp\/user\/illust\/(\d+)/);
            if (userIdMatchs != null) {
                this.userId = userIdMatchs[1];
            }
            else {
                throw new Error("ユーザーIDが見つかんないや");
            }
        }
        async IsDisappearedUser() {
            //console.log(document.head.innerHTML);
            const title = await Observer.DefinitelyGetElementByTagName("TITLE");
            return title.textContent == "ニコニコ静画 (イラスト)";
        }
        HideBody() {
            Observer.DefinitelyGetElementByTagName("BODY")
                .then(body => {
                body.style.visibility = "hidden";
            });
        }
        ShowBody() {
            Observer.DefinitelyGetElementByTagName("BODY")
                .then(body => {
                body.style.visibility = "visible";
            });
        }
        async Main() {
            this.HideBody();
            this.cacheList = (await this.storage.GetStorageData([])).filter(IsData);
            let d = this.FindData(this.cacheList);
            if (d == null) {
                d = await this.GetData();
                if (d == undefined) {
                    const errorElement = await Observer.DefinitelyGetElementByClassName("error__messages");
                    errorElement.textContent = "取得を試みましたが、古すぎて削除されている可能性があります";
                    this.ShowBody();
                    return;
                }
                this.cacheList.push(d);
                while (this.cacheList.length > State.CACHE_MAX) {
                    this.cacheList.shift();
                }
                await this.storage.SetStorageData(this.cacheList);
            }
            this.data = d;
            //console.log(d);
            await this.Draw();
            this.ContinueData();
            this.ShowBody();
        }
        async ContinueData() {
            await Util.Wait(3000);
            while (true) {
                //console.log(this.data.illusts.length);
                //console.log(this.data.illustCount);
                if (this.data.illusts.length >= this.data.illustCount) {
                    return;
                }
                const illustLengthNoSyunga = this.data.illusts.reduce((a, c) => {
                    if (c.isSyunga)
                        return a;
                    else
                        return a + 1;
                }, 0);
                //console.log(illustLengthNoSyunga);
                //console.log(this.data.illustCountNoSyunga);
                if (illustLengthNoSyunga >= this.data.illustCountNoSyunga) {
                    return;
                }
                await Util.Wait(3000);
                const doc = await Fetcher.FetchSpUserIllustDocument(this.userId, (Math.floor((illustLengthNoSyunga / 30)) + 1).toString());
                const ids = Fetcher.GetUserIllustIds(doc);
                const illusts = await Fetcher.FetchIllustData(ids);
                const befLen = this.data.illusts.length;
                for (let d of illusts) {
                    if (!this.data.illusts.some(i => i.id == d.id)) {
                        this.data.illusts.push(d);
                    }
                }
                const uls = document.getElementsByClassName("list_item no_trim");
                for (let i = befLen; i < uls.length && i < this.data.illusts.length; i++) {
                    const borderText = this.data.illusts[i].isSyunga ? 'style="border: solid 1px black;"' : "";
                    uls[i].innerHTML = `<a href="/seiga/im${this.data.illusts[i].id}" ${borderText}> <span class="thum"><img src="https:\/\/lohas.nicoseiga.jp/thumb/${this.data.illusts[i].id}q" alt="${this.data.illusts[i].title}"></span>
  <ul class="illust_info">
    <li class="title">${this.data.illusts[i].title}</li>
      </ul>
  <ul class="illust_count">
    <li class="view"><span class="icon_view"></span>${this.data.illusts[i].view_count}</li>
    <li class="comment"><span class="icon_comment"></span>${this.data.illusts[i].comment_count}</li>
    <li class="clip"><span class="icon_clip"></span>${this.data.illusts[i].clip_count}</li>
  </ul>
</a>`;
                }
                document.getElementsByClassName("page_count")[0].innerHTML = `<strong>${this.data.illusts.length} / ${this.data.illustCount}</strong>件表示(200件以降の春画は無理)`;
                await this.storage.SetStorageData(this.cacheList);
            }
        }
        async GetData() {
            const d = await this.GetDataFromUserId(this.userId);
            return d;
        }
        FindData(cacheList) {
            return cacheList.find(d => d.user.id == this.userId);
        }
        async ChangeTitle(user) {
            const title = await Observer.DefinitelyGetElementByTagName("TITLE");
            title.textContent = `${user.name} さんのイラスト一覧 - ニコニコ静画 (イラスト)`;
        }
        async RemoveErrorWrapper() {
            const errorWrapper = await Observer.DefinitelyGetElementByClassName("error-wrapper");
            if (errorWrapper.parentElement != null) {
                errorWrapper.parentElement.removeChild(errorWrapper);
            }
        }
        async DrawCss() {
            //css追加
            const css_all_l = `<link rel="stylesheet" type="text/css" href="/css/illust/all_l.css?aarx9p">`;
            const head = await Observer.DefinitelyGetElementByTagName("HEAD");
            head.insertAdjacentHTML("beforeend", css_all_l);
        }
        //画像下の投稿したその他のイラスト
        async DrawContent(data) {
            const wrapperParent = await Observer.DefinitelyGetElementById("wrapper");
            let wrapperContentHtml = `
<!-- #list_head_bar -->
<section class="userlist_head_bar">
<div class="inner cfix">
<div class="inner_content">
<div class="user_info">
<div class="user_thum"><a href="https://www.nicovideo.jp/user/${data.user.id}"><img alt="${data.user.name}" src="${State.DEFAULT_ICON_URL}"></a></div>
<h1><a href="https://www.nicovideo.jp/user/${data.user.id}"><span class="nickname">${data.user.name}</span><span class="suffix">さん</span></a></h1>
<ul class="list_header_nav" id="ko_watchlist_header" data-id="${data.user.id}" data-is_active="false" data-count="${data.illusts.length}">
<li class="favorite message_target">
<span></span><span>退会済み</span>
</li>
</ul>
</div>
</div>
</div>
<div class="user_nav" data-target_id="${data.user.id}">
<ul>
<li class="illust"><a href="/user/illust/${data.user.id}" class="selected"><span class="span icon_user_illust"></span>投稿イラスト</a></li>
</ul>
</div>
</section>

<!-- #content -->
<div id="content" class="list" data-view_mode="user_illust">


  <!-- #main -->
  <div id="main">


          <!-- .controll -->
      <div class="controll">
        <div class="sort"> 並び：<span>投稿の新しい順</span>
        </div>
        <ul class="pager">
      <li class="prev disabled">&lt;</li>

            <li class="current_index">1</li>

      <li class="next disabled">&gt;</li>
  </ul>        <p class="page_count"><strong>${data.illusts.length} / ${data.illustCount}</strong>件表示(200件以降の春画は無理)</p>
      </div>
      <!-- //.controll -->

      <!-- .illust_list -->
      <div class="illust_list">
        <ul class="item_list autopagerize_page_element">
`;
            //並び替え非対応
            //<div class="sort_form">
            //  <div class="dummy"></div>
            //</div>
            //            <select class="reload_onchange" basepath="/user/illust/${data.user.id}" queries=""><option value="image_created" selected="selected">投稿の新しい順</option><option value="image_created_a">投稿の古い順</option><option value="comment_count">コメントの多い順</option><option value="comment_count_a">コメントの少ない順</option><option value="image_view">閲覧数の多い順</option><option value="image_view_a">閲覧数の少ない順</option></select>
            for (let i = 0; i < data.illustCount; i++) {
                if (i < data.illusts.length) {
                    const borderText = data.illusts[i].isSyunga ? 'style="border: solid 1px black;"' : "";
                    wrapperContentHtml += `<li class="list_item no_trim"><a href="/seiga/im${data.illusts[i].id}" ${borderText}> <span class="thum"><img src="https:\/\/lohas.nicoseiga.jp/thumb/${data.illusts[i].id}q" alt="${data.illusts[i].title}"></span>
  <ul class="illust_info">
    <li class="title">${data.illusts[i].title}</li>
      </ul>
  <ul class="illust_count">
    <li class="view"><span class="icon_view"></span>${data.illusts[i].view_count}</li>
    <li class="comment"><span class="icon_comment"></span>${data.illusts[i].comment_count}</li>
    <li class="clip"><span class="icon_clip"></span>${data.illusts[i].clip_count}</li>
  </ul>
</a></li>    `;
                }
                else {
                    wrapperContentHtml += `<li class="list_item no_trim">
</li>    `;
                }
            }
            wrapperContentHtml += `</ul>
      </div>
      <!-- //.illust_list -->


  </div>
  <!-- //#main -->


<!-- //#pagetop -->
<div id="pagetop" data-target="#content.list" style="display: none; right: 50%;">
  <img src="/img/common/new/module/btn_pagetop.png" alt="ページ上部へ">
</div>
</div>`;
            Util.HtmlToChildNodes(wrapperContentHtml).forEach(node => {
                wrapperParent.appendChild(node);
            });
        }
        //パンくずリストのエラー表示をユーザー名に変更
        async ChangePankuzu(user) {
            await Observer.Wait(() => document.querySelectorAll(".active span[itemprop=title]").length >= 2, document);
            document.querySelectorAll(".active span[itemprop=title]").forEach(t => {
                t.innerHTML = `${user.name}<span class="pankuzu_suffix">&nbsp;さんのイラスト</span>`;
            });
        }
        Draw() {
            const promises = [this.ChangeTitle(this.data.user), this.DrawCss(), this.DrawContent(this.data), this.RemoveErrorWrapper(), this.ChangePankuzu(this.data.user)];
            return Promise.allSettled(promises);
        }
    }
    ;
    class IllustState extends State {
        constructor() {
            super();
            this.currentIllustId = "";
            const match = location.href.match(/https:\/\/seiga.nicovideo.jp\/seiga\/im(\d+)/);
            if (match != null) {
                this.currentIllustId = match[1];
            }
            else {
                throw new Error("イラストIDが見つかんないや");
            }
        }
        async IsDisappearedUser() {
            var _a;
            const test = /.+? \/ .+? さんのイラスト - ニコニコ(春画|静画 \(イラスト\))$/;
            const title = await Observer.DefinitelyGetElementByTagName("TITLE");
            return !test.test((_a = title.textContent) !== null && _a !== void 0 ? _a : "");
        }
        async Main() {
            const cacheList = (await this.storage.GetStorageData([])).filter(IsData);
            let d = this.FindData(cacheList);
            if (d == null) {
                d = await this.GetData();
                if (d == undefined) {
                    return;
                }
                cacheList.push(d);
                while (cacheList.length > State.CACHE_MAX) {
                    cacheList.shift();
                }
                await this.storage.SetStorageData(cacheList);
            }
            this.data = d;
            this.Draw();
        }
        async GetData() {
            const userId = await Fetcher.FetchUserId(this.currentIllustId);
            return await this.GetDataFromUserId(userId);
        }
        FindData(cacheList) {
            return cacheList.find(d => d.illusts.some(i => i.id == this.currentIllustId));
        }
        async ChangeTitle(user) {
            const title = await Observer.DefinitelyGetElementByTagName("TITLE");
            if (title.textContent != null) {
                title.textContent = title.textContent.replace(/- ニコニコ静画 \(イラスト\)$/, `\/ ${user.name} さんのイラスト - ニコニコ静画 \(イラスト\)`);
            }
        }
        async DrawUser(user) {
            //右上のユーザー表示
            const userLinkParent = await Observer.DefinitelyGetElementById("ko_watchlist_header");
            let userLinkHtml = `<ul>
                  <li class="user_link">
                    <a href="/user/illust/${user.id}">
                      <ul>
                        <li class="thum"><img src="${State.DEFAULT_ICON_URL}" alt=""></li>
                        <li class="user_name"><span class="caption">投稿者</span><strong>${user.name}</strong>さん</li>
                      </ul>
                    </a>
                  </li>
                  <li class="user_favorite message_target" style="pointer-events:none;">
                      <span>
                        <span>退会済み</span>
                      </span>
                  </li>
                </ul>`;
            while (userLinkParent.firstChild) {
                userLinkParent.removeChild(userLinkParent.firstChild);
            }
            Util.HtmlToChildNodes(userLinkHtml).forEach(node => {
                userLinkParent.appendChild(node);
            });
        }
        //画像下の投稿したその他のイラスト
        async DrawRelated(data) {
            const relatedParent = await Observer.DefinitelyGetElementByClassName("related_info_main");
            let relatedSting = `<div class="related_user related_box">
          <div class="user" id="ko_watchlist_info" data-id="${data.user.id}" data-status="0" data-count="${data.illusts.length}">
                        <ul class="cfix">
              <li class="thum"><a href="/user/illust/${data.user.id}"><img src="${State.DEFAULT_ICON_URL}" alt=""></a></li>
              <li class="user_name">
                <a href="/user/illust/${data.user.id}"><strong>${data.user.name}</strong>さん</a>
              </li>
              <li>
                  <span>退会済み</span>
              </li>
            </ul>
                      </div>

          <div class="other_illust user_illust">
            <h2>${data.user.name}さんが投稿した他のイラスト</h2>
            <div class="illust_list">
                              <ul class="item_list">
`;
            //他のイラストを並べる
            let index = 0, count = 0;
            while (index < data.illusts.length && count < 5) {
                if (data.illusts[index].id == this.currentIllustId) {
                    index++;
                    continue;
                }
                relatedSting += `<li class="list_item_cutout middle"><a href="/seiga/im${data.illusts[index].id}" title="${data.illusts[index].title}"> <span class="thum"><img src="https:\/\/lohas.nicoseiga.jp//thumb/${data.illusts[index].id}c" alt=""></span>
                      <ul class="illust_info">
                        <li class="title">${data.illusts[index].title}</li>
                        <li class="user">${data.user.name}</li>
                      </ul>
                  </a></li>`;
                count++;
                index++;
            }
            relatedSting += `
                          <li class="list_more_link"><a href="/user/illust/${data.user.id}">もっと見る</a></li>
                                  </ul>
                          </div>
          </div>
        </div>`;
            const currentFirst = relatedParent.firstChild;
            Util.HtmlToChildNodes(relatedSting).forEach(node => {
                relatedParent.insertBefore(node, currentFirst);
            });
        }
        async ChangePankuzu(user) {
            //パンくずリストのエラー表示をユーザー名に変更
            await Observer.Wait(() => document.querySelectorAll(".active span[itemprop=title]").length >= 2, document);
            document.querySelectorAll(".active span[itemprop=title]").forEach(t => {
                var _a;
                (_a = t.parentElement) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforebegin", `<li itemscope="" itemtype="http:\/\/data-vocabulary.org/Breadcrumb"><a href="/user/illust/${user.id}" itemprop="url"><span itemprop="title">${user.name}<span class="pankuzu_suffix">&nbsp;さんのイラスト</span></span></a></li> `);
            });
        }
        Draw() {
            const promises = [this.ChangeTitle(this.data.user), this.DrawUser(this.data.user), this.DrawRelated(this.data), this.ChangePankuzu(this.data.user)];
            return Promise.allSettled(promises);
        }
    }
    ;
    const VERSION_STORAGE_NAME = "Version";
    //イラストページかどうか
    const seigaTest = /https:\/\/seiga.nicovideo.jp\/seiga\//;
    const isIllustPage = seigaTest.test(location.href);
    const state = isIllustPage ? new IllustState() : new UserState();
    //消えてなかったら終わり！閉廷！解散解散！
    if (!(await state.IsDisappearedUser())) {
        return;
    }
    //消えてますね・・・悲しいなぁ
    const versionStorage = new Storage(VERSION_STORAGE_NAME);
    const storageVer = await versionStorage.GetStorageData(null);
    const currentVer = "1.14518";
    if (storageVer == null || storageVer != currentVer) {
        console.log("current", currentVer);
        console.log("strage", storageVer);
        console.log("更新");
        await state.CacheClear();
        await versionStorage.SetStorageData(currentVer);
    }
    //console.log("悲しいなぁ");
    await state.Main();
})();
