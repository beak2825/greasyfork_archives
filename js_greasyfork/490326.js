// ==UserScript==
// @name         【etai2019】明里小秘书
// @version      0.1.7
// @description  评论区、优优收藏馆、紬宝图片馆。侧边展示、简洁排版和无限翻页
// @author       etai2019
// @license      GPL-3.0 License
// @namespace    etai2019

// @match        *://*.sehuatang.net/forum.php?mod=viewthread&tid=*
// @match        *://*.sehuatang.org/forum.php?mod=viewthread&tid=*
// @match        *://*.sehuatang.*/forum.php?mod=viewthread&tid=*
// @match        *://*.jq2t4.com/forum.php?mod=viewthread&tid=*
// @match        *://*.0krgb.com/forum.php?mod=viewthread&tid=*
// @match        *://*.xxjsnc.co/forum.php?mod=viewthread&tid=*
// @match        *://*.o4vag.com/forum.php?mod=viewthread&tid=*
// @match        *://*.weterytrtrr.*/forum.php?mod=viewthread&tid=*
// @match        *://*.qweqwtret.*/forum.php?mod=viewthread&tid=*
// @match        *://*.retreytryuyt.*/forum.php?mod=viewthread&tid=*
// @match        *://*.qwerwrrt.*/forum.php?mod=viewthread&tid=*
// @match        *://*.ds5hk.app/forum.php?mod=viewthread&tid=*
// @match        *://*.30fjp.com/forum.php?mod=viewthread&tid=*
// @match        *://*.18stm.cn/forum.php?mod=viewthread&tid=*
// @match        *://*.xo6c5.com/forum.php?mod=viewthread&tid=*
// @match        *://*.mzjvl.com/forum.php?mod=viewthread&tid=*
// @match        *://*.9xr2.app/forum.php?mod=viewthread&tid=*
// @match        *://*.kzs1w.com/forum.php?mod=viewthread&tid=*
// @match        *://*.nwurc.com/forum.php?mod=viewthread&tid=*
// @match        *://*.zbkz6.app/forum.php?mod=viewthread&tid=*
// @match        *://*.ql75t.cn/forum.php?mod=viewthread&tid=*
// @match        *://*.0uzb0.app/forum.php?mod=viewthread&tid=*
// @match        *://*.d2wpb.com/forum.php?mod=viewthread&tid=*
// @match        *://*.5aylp.com/forum.php?mod=viewthread&tid=*
// @match        *://*.8otvk.app/forum.php?mod=viewthread&tid=*

// @match        *://*.sehuatang.net/thread*
// @match        *://*.sehuatang.org/thread*
// @match        *://*.sehuatang.*/thread*
// @match        *://*.jq2t4.com/thread*
// @match        *://*.0krgb.com/thread*
// @match        *://*.xxjsnc.co/thread*
// @match        *://*.o4vag.com/thread*
// @match        *://*.weterytrtrr.*/thread*
// @match        *://*.qweqwtret.*/thread*
// @match        *://*.retreytryuyt.*/thread*
// @match        *://*.qwerwrrt.*/thread*
// @match        *://*.ds5hk.app/thread*
// @match        *://*.30fjp.com/thread*
// @match        *://*.18stm.cn/thread*
// @match        *://*.xo6c5.com/thread*
// @match        *://*.mzjvl.com/thread*
// @match        *://*.9xr2.app/thread*
// @match        *://*.kzs1w.com/thread*
// @match        *://*.nwurc.com/thread*
// @match        *://*.zbkz6.app/thread*
// @match        *://*.ql75t.cn/thread*
// @match        *://*.0uzb0.app/thread*
// @match        *://*.d2wpb.com/thread*
// @match        *://*.5aylp.com/thread*
// @match        *://*.8otvk.app/thread*

// @icon         data:image/jpeg;base64,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

// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/490326/%E3%80%90etai2019%E3%80%91%E6%98%8E%E9%87%8C%E5%B0%8F%E7%A7%98%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/490326/%E3%80%90etai2019%E3%80%91%E6%98%8E%E9%87%8C%E5%B0%8F%E7%A7%98%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .app {
            padding: .5em;
            position: fixed;
            top: 4%;
            right: 2%;
            background-color: #fff;
            border: 1px solid black;
            border-radius: 10px;
            overflow: hidden;
            opacity: .6;
        }
        .app:hover {
            opacity: 1;
            z-index: 2;
        }

        .panel-toggle
        {
            text-align: center;
            font-size: 1.2em;
            width: 3.5em;
            margin-left: .2em;
            line-height: 2.2em;
        }
        .toggle-group>.hover,
        .panel-toggle:hover {
            cursor: pointer;
            font-weight: bold;
        }

        .panel {
            height: 90vh;
        }

        .scroll-view {
            height: 91%;
            overflow: auto;
        }

        .panel-header {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #eee;
            padding: .5em .5em;
        }

        .app-header-title {
            font-size: 1.4em;
            font-weight: bold;
        }

        .scroll-body .pstatus,
        .scroll-body .pstatus~br {
            display: none;
        }

        .comment-item {
            padding: 10px 5px;
            display: flex;
        }

        .comment-item:hover .footer-action {
            display: inline;
        }

        .comment-left {
            width: 50px;
            height: 50px;
            padding-top: .8em;
        }

        .comment-left>img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: contain;
        }

        .comment-right {
            flex: 1;
            padding: 5px 10px;
            border-bottom: 1px solid #ddd;
            overflow: hidden;
        }

        .comment-basic {
            display: flex;
            justify-content: space-between;

            color: grey;
        }

        .comment-user a {
            color: grey;
            font-weight: normal;
        }

        .comment-content {
            padding: .4em 0;
            color: black;
            font-size: 1.2em;
            max-height: 20em;
            overflow: auto;
        }

        .comment-content img[smilieid] {
            max-width: 1.5em;
        }

        .comment-time {
            color: grey;
        }

        .scroll-footer {
            text-align: center;
            font-size: 12px;
            padding: 0 0 20px 0;
        }

        .footer-action {
            color: grey;
            padding: 0 .4em;
            display: none;
        }

        .footer-action:hover {
            text-decoration: none;
        }

        .panel-wrapper a:hover{
            text-decoration: none;
        }

        .panel-message {
            display: none;
        }
        .panel-message a {
            font-size: .8em;
            font-weight: normal;
        }

        .panel-title:hover {
            cursor: pointer;
        }

        .panel-avatar {
            border-radius: 50%;
            margin-right: .5em;
        }
        .panel-avatar:hover {
            cursor: pointer;
        }

        .app-header {
            display: flex;
            justify-content: space-between;

        }

        .toggle-group {
            display: flex;
            align-items: center;
        }

        .page-link {
            padding: 0 .2em;
        }
        .page-link:hover {
            decoration: none;
            cursor: pointer;
        }

        .rate-popup {
            background: rgba(0, 0, 0, 0.2);
            position: fixed;
            display: flex;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
        }
        .rate-popup-body {
            width: 30%;
            height: 20%;
            background-color: white;
            font-size: 2em;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 20px;
            border: 1px solid #000;
            border-radius: 10px;
            box-shadow: 10px 5px 5px red;
        }
        .rate-popup div:hover {
            cursor: pointer
        }

        .image-gallery {
            position: fixed;
            top: 20%;
            left: 20%;
            height: 60%;
            width: 60%;
            padding-bottom: 4em;
            background-color: black;
            border-radius: .5em;
            border: 1px solid #000;
            box-sizing: border-box;
            overflow: hidden;
            display: none;
        }

        .gallery-image-box {
            width: 20%;
            height: 30%;
            position: relative;
            display: inline-block;
        }
        .gallery-image-box img{
            height: 100%;
            width: 100%;
            position: relative;
            object-fit: contain;
        }
        .gallery-image-box-goto {
            position:absolute;
            bottom: 0px;
            right: 0px;
            background-color: purple;
            padding: .5em;
            border-radius: 50%;
            color: #fff;
        }
        .gallery-image-box-goto:hover {
            cursor: pointer;
        }

        .gallery-top-image {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            display: none;
            background-color: rgba(0,0,0,0.8);
            z-index: 2;
        }

        .gallery-top-image img {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }

        .gallery-header {
            background-color: #f2f2f2;
            display: flex;
            justify-content: space-between;
            padding: .5em;
            font-size: 1.5em;
            border-bottom: 1px solid #000;
        }

        .gallery-header div:last-of-type {
            padding: 0 1em;
        }

        .gallery-header div:last-of-type:hover {
            cursor: pointer;
        }
    `);

    const wd = window.unsafeWindow || document.defaultView || window;
    wd.Vue = Vue;

    const app$ = document.createElement('div');
    app$.id = "app";
    document.body.appendChild(app$);

    const template = `
    <div class="rate-popup" v-if="showPopup">
        <div class="rate-popup-body">
            <div style="text-align: center" @click="jumpPopup">好用请一定点我回个贴吧！小秘书真的非常需要你的回帖来完善（只弹一次）</div>
            <div style="text-align: center" @click="closePopup">点我关闭</div>
        </div>
    </div>

    <div ref="bubbles" class="bubbles">
        <img style="border-radius:50%; opacity: 0.6;" :src="avatar2" @click="onShowImageGallery"></img>
    </div>
    <div ref="gallery$" class="image-gallery">
        <div class="gallery-header">
            <div>紬宝图片馆 - 已装载 {{imageGalleryLinks.length}} 张图片</div>
            <div @click="onShowImageGallery">关闭</div>
        </div>
        <div style="height: 100%; overflow: auto;">
            <div ref="galleryTopImage$" class="gallery-top-image" @click="$refs.galleryTopImage$.style.display='none'">
                <img :src="galleryTopImageLink"></img>
            </div>
            <div class="gallery-image-box" v-for="link in imageGalleryLinks" :key="link">
                <img :src="link" @click="onShowTopImage(link)"></img>
                <div class="gallery-image-box-goto" @click="onGotoImage(link)">Go</div>
            </div>
        </div>
    </div>

    <div class="app" ref="app">
        <div class="app-header">
            <div class="toggle-group">
                <img class="panel-avatar" :src="avatar" @click="onShowImageGallery">
                <div v-if="toggleOn" class="app-header-title">{{ title }}</div>
            </div>
            <div class="toggle-group">
                <div class="panel-toggle" :class=" {hover:activePanel == '评论区'} " @click="onToggleTab('评论区')">评论区</div>
                <div class="panel-toggle" :class=" {hover:activePanel == '收藏馆'} " @click="onToggleTab('收藏馆')">收藏</div>
            </div>
        </div>
        <div class="panel-wrapper">
            <!-- 评论区 -->
            <div v-if="toggleOn && activePanel=='评论区'" class="panel">
                <div class="panel-header">
                    <div style="display: flex; justify-content: space-between">
                        <div>
                            <select @change="onJumpToPage(selectedPage)" v-model="selectedPage">
                                <option v-for="i in totalPages" :selected="i == selectedPage" :key="i">{{i}}</option>
                            </select>
                            <span>/ {{ totalPages }} 页</span>

                            <span v-if="selectedPage < totalPages"class="page-link" @click="onJumpToPage(totalPages)">末页</span>
                            <span v-if="selectedPage < totalPages"class="page-link" @click="onJumpToPage(selectedPage + 1)">下一页</span>
                            <span v-if="selectedPage > 1" class="page-link" @click="onJumpToPage(selectedPage - 1)" >上一页</span>
                        </div>
                        <div>
                            <a :href="replyThreadUrl">回复帖子</a>
                        </div>
                    </div>
                    <div class="content-length-slider" style="display: flex">
                        <input style="flex:1" type="range" min="1" max="30" v-model="minContentLength" @change="onMinContentLengthChange" />
                        <span>长度 ≥ {{ minContentLength }} 字 </span>
                        <span>（已过滤：{{ comments.length - filteredComments.length }}）</span>
                    </div>
                </div>
                <div class="scroll-view" @scroll="onScroll">
                    <div class="scroll-body">
                        <div class="comment-item" v-for="(item, i) in filteredComments" :key="i">
                            <div class="comment-left" v-html="item.avatar"></div>
                            <div class="comment-right">
                                <div class="comment-basic">
                                    <div class="comment-user" v-html="item.user"></div>
                                    <div class="comment-post-number">{{item.postNum}}</div>
                                </div>

                                <div class="comment-content" v-html="item.content"></div>
                                <div class="comment-footer">
                                    <span class="comment-time" v-html="item.time"></span>
                                    <a class="footer-action" :href="item.postUrl">跳转</a>
                                    <a class="footer-action" v-if="item.replyUrl" :href="item.replyUrl" onclick="if (!window.__cfRLUnblockHandlers) return false; showWindow('reply', this.href)">回复</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="scroll-footer">{{ isLoading ? "紬宝正在努力加载下一页..." : "紬宝：没有更多评论啦~" }}</div>
                </div>

                <div class="panel-footer" style="display: flex">
                    <span>宽度: {{ appWidth }}%</span>
                    <input style="flex:1" type="range" min="15" max="50" v-model="appWidth" @change="onWidthSliderChange" />
                </div>
            </div>

            <!-- 收藏馆 -->
            <div v-if="toggleOn && activePanel=='收藏馆'" class="gallery">
                <div class="fs-body">
                    <div class="fs-message" style="text-align: center">{{ keywordDetail || "紬宝：今天试试「" + keywords[Math.floor(Math.random() * keywords.length)] + "」吧？" }}</div>

                    <div class="fs-button-group">
                        <div class="fs-button-group-item" v-for="(item, index) in keywords" :key="item">
                            <div class="fs-button" @mouseover="hoveredKeyword=item"  @mouseleave="hoveredKeyword=''" @click="onSearch(item)">
                                {{ item }}
                            </div>
                            <div class="fs-button-close" @click="onRemove(item)">-</div>
                        </div>
                    </div>

                    <div v-if="loading" class="fs-mask">唤起搜索中，请等待...</div>
                </div>
                <div class="fs-footer"><input v-model="addKeyword" :placeholder="inputHint" /><div class="fs-button" @click="onAdd">+</div></div>

                <div class="panel-footer" style="display: flex">
                    <span>宽度: {{ appWidth }}%</span>
                    <input style="flex:1" type="range" min="15" max="50" v-model="appWidth" @change="onWidthSliderChange" />
                </div>
            </div>


        </div>
    </div>
    `

    const app = Vue.createApp({
        template: template,
        data() {
            return {
                activePanel: "",
                avatar: "",
                avatar2: "",
                toggleOn: true,
                commentsPerPage: 9,
                showPopup: false,
                lifetimePages: 0,

                // 图片展
                isShowImageGallery: false,
                imageGalleryLinks: [],
                galleryTopImageLink: '',

                // 评论区
                appWidth: 22,
                comments: [],
                isLoading: false,
                nextPageUrl: "",
                totalComments: 0,
                totalPages: 1,
                selectedPage: 1,
                replyThreadUrl: "",
                minContentLength: 0,
                hasInit: false,

                // 收藏馆
                keywords: ['明里'],
                addKeyword: "",
                loading: false,
                inputHint: "添加收藏快捷搜索~",
                keywordStats: {},
                hoveredKeyword: "",
            }
        },
        computed: {
            title() {
                if (this.activePanel == "评论区") {
                    return `${this.totalComments} 条评论`
                } else if (this.activePanel == "收藏馆") {
                    return `${this.keywords.length} 项收藏`
                } else {
                    return ""
                }
            },
            filteredComments() {
                return this.comments.filter(x => x.contentText.length >= this.minContentLength);
            },
            keywordDetail() {
                if (this.hoveredKeyword == "") return "";
                if (!(this.hoveredKeyword in this.keywordStats)) return `没有搜索过 ${this.hoveredKeyword} 哦~`;

                const stat = this.keywordStats[this.hoveredKeyword]
                return `搜索次数：${stat["clicks"]}，最近搜索：${new Date(stat["last"]).toLocaleDateString()}`;
            }
        },
        methods: {
            applyGalleryDisplay() {
                this.$refs.gallery$.style.display = this.isShowImageGallery ? 'block' : 'none';
            },
            onGotoImage(link){
                const el = document.querySelector(`img[file^="${link}"]`);
                el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                // console.log(el)
                this.isShowImageGallery = false;
                this.applyGalleryDisplay();
            },
            onShowTopImage(link) {
                this.galleryTopImageLink = link;
                this.$refs.galleryTopImage$.style.top = this.$refs.gallery$.scrollTop + "px";
                this.$refs.galleryTopImage$.style.display = 'block';
            },
            onShowImageGallery(){
                this.isShowImageGallery = !this.isShowImageGallery;
                this.applyGalleryDisplay();
            },
            jumpPopup() {
                window.open(`https://${window.location.host}/thread-1960202-1-1.html`);
                this.closePopup();
            },
            closePopup() {
                this.showPopup = false;
            },
            onWidthSliderChange(){
                this.saveToConfig();
                this.$refs.app.style.width = this.appWidth + "%";
            },
            async checkAndLoadMoreCommentsInFirstPage() {
                if (this.filteredComments.length < this.commentsPerPage) {
                    await this.loadNextPage();
                }
            },
            async onMinContentLengthChange(){
                await this.checkAndLoadMoreCommentsInFirstPage();
                this.saveToConfig();
            },
            addComments(comments$, pageUrl) {
                const newComments = []
                for (const comment$ of comments$) {
                    try {
                        const avatar = comment$.querySelector('.avatar img').outerHTML;
                        const user = comment$.querySelector('.authi').innerHTML;
                        const content = comment$.querySelector('.t_f').innerHTML;
                        const contentText = comment$.querySelector('.t_f').innerText.trim();
                        const time = comment$.querySelector('[id^="authorpost"]').innerHTML;
                        const postUrl = pageUrl.split('#')[0] + '#' + comment$["id"];
                        const replyUrl = comment$.querySelector('.fastre');
                        const postNum = comment$.querySelector('.pi strong').textContent;

                        if (postNum.trim() == "楼主") continue;

                        newComments.push({
                            avatar,
                            user,
                            content,
                            time,
                            postUrl,
                            replyUrl,
                            postNum,
                            contentText
                        });
                    } catch (error) {
                        console.error("parse error", comment$);
                        console.log(error)
                    }
                }

                this.comments.push(...newComments);
            },
            async loadNextPage(minCommentsCount) {
                if (minCommentsCount == null) {
                    minCommentsCount = this.commentsPerPage
                }

                if (minCommentsCount <= 0 || !this.nextPageUrl) {
                  return;
                }

                if (!this.nextPageUrl.startsWith("http")) {
                    this.nextPageUrl = location.protocol + "//" + location.host + "/" + this.nextPageUrl;
                }

                this.isLoading = true;

                const response = await fetch(this.nextPageUrl);
                const text = await response.text();

                const div = document.createElement("div");
                div.innerHTML = text;

                const comments$ = Array.from(div.querySelectorAll(`div[id^="post_"]:not([id^="post_ra"], [id^="post_new"])`));
                const prevCommentsCount = this.filteredComments.length;
                this.addComments(comments$, this.nextPageUrl);

                console.log(this.nextPageUrl);
                // 页面地址格式可能不同
                if (new URL(this.nextPageUrl).searchParams.get("page") != null) {
                    // https://sehuatang.net/forum.php?mod=viewthread&tid=1947970&extra=page%3D1&page=2
                    this.selectedPage = parseInt(new URL(this.nextPageUrl).searchParams.get("page"))
                } else {
                    // https://sehuatang.net/thread-1947970-3-1.html
                    this.selectedPage = parseInt(new URL(this.nextPageUrl).pathname.split('-').at(-2));
                }

                // 载入完成
                this.nextPageUrl = div.querySelector(".nxt")?.getAttribute("href");
                this.isLoading = false;

                // 继续加载下一页
                const newMinCommentsCount = minCommentsCount - (this.filteredComments.length - prevCommentsCount);
                await this.loadNextPage(newMinCommentsCount);

                // 弹窗宣传
                ++this.lifetimePages;
                this.saveToConfig();
                if (this.lifetimePages == 50) {
                    this.showPopup = true;
                }
            },
            async onJumpToPage(pageNum) {
                if (pageNum < 1 || pageNum > this.totalPages) return;

                const url = new URL(location.href);
                url.searchParams.set("page", pageNum);
                url.hash = "";
                this.nextPageUrl = url.href;
                this.comments = []
                this.selectedPage = pageNum;
                await this.loadNextPage();
            },
            async onScroll() {
                const commentPanel$ = document.querySelector('.scroll-view');
                if (commentPanel$.clientHeight + commentPanel$.scrollTop >= commentPanel$.scrollHeight - 100 && !app.isLoading) {
                    await app.loadNextPage();
                }
            },
            loadFromConfig() {
                this.keywords = GM_getValue("fsKeywords", '明里').split("\n");
                // this.keywords.sort((a, b) => a.localeCompare(b));
                this.appWidth = GM_getValue("appWidth", 22);
                this.minContentLength = GM_getValue("minContentLength", 5);
                this.keywordStats = JSON.parse(GM_getValue("keywordStats", "{}"));
                this.lifetimePages = GM_getValue("lifetimePages", 0);
            },
            saveToConfig() {
                GM_setValue("fsKeywords", this.keywords.join("\n"));
                GM_setValue("appWidth", this.appWidth);
                GM_setValue("minContentLength", this.minContentLength);
                GM_setValue("keywordStats", JSON.stringify(this.keywordStats));
                GM_setValue("lifetimePages", this.lifetimePages);
            },
            onAdd() {
                if (this.addKeyword?.trim() == "") {
                    this.inputHint = "请至少输入一个字符哦"
                    setTimeout(() => {
                        this.inputHint = "添加收藏快捷搜索~"
                    }, 2000);
                    return;
                }

                this.loadFromConfig();
                this.keywords = [...this.keywords, this.addKeyword];
                this.keywords = [...new Set(this.keywords)];
                this.saveToConfig();

                this.loadFromConfig();
                this.addKeyword = "";
            },
            onRemove(item) {
                this.keywords = this.keywords.filter(x => x != item);
                this.saveToConfig();
                this.loadFromConfig();
            },
            onSearch(query){
                const formhash = document.querySelector('input[name="formhash"]')?.value;
                const sehuatangURL = `https://${window.location.host}`;

                if (formhash) {
                    this.loading = true;

                    const this$ = this;
                    GM_xmlhttpRequest({
                        method: "post",
                        url: sehuatangURL+"/search.php?mod=forum",
                        data: `formhash=${formhash}&srchtxt=${query}&searchsubmit=yes`,
                        headers:  {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Origin":sehuatangURL,
                            "Referer":sehuatangURL
                        },
                        onload: function(data){
                            if(data.finalUrl){
                                window.open(data.finalUrl);
                            } else{
                                window.open(`${sehuatangURL}/search.php`);
                            }

                            this$.loading = false;
                            this$.logKeyword(query);
                        },
                        onerror : function(err){
                            console.log('SearchSehuatang error')
                            console.log(err)

                            window.open(`${sehuatangURL}/search.php`);
                            this$.logKeyword(query);

                            this$.loading = false;
                        }
                    });
                } else {
                    window.open(`${sehuatangURL}/search.php`);
                    this$.logKeyword(query);
                }
            },
            async onToggleTab(panelName) {
                if (this.activePanel != panelName) {
                    this.toggleOn = true;
                    this.activePanel = panelName;
                } else {
                    this.toggleOn = !this.toggleOn;
                }

                // 面板宽度
                if (!this.toggleOn) {
                    this.activePanel = "";
                    this.$refs.app.style.removeProperty('width');
                } else {
                    this.$refs.app.style.width = this.appWidth + "%";
                }

                // 初次载入
                if (this.activePanel == "评论区" && this.toggleOn && !this.hasInit) {
                    console.log("初始化评论区");
                    this.hasInit = true;
                    const comments$ = Array.from(document.querySelectorAll(`div[id^="post_"]:not([id^="post_ra"], [id^="post_new"])`));
                    this.addComments(comments$, location.href);
                    // 尝试加载首页
                    await this.checkAndLoadMoreCommentsInFirstPage();
                }

                // GM_setValue("ToggleOn", this.toggleOn);
            },
            logKeyword(keyword) {
                this.loadFromConfig();
                if (!(keyword in this.keywordStats)) {
                    this.keywordStats[keyword] = {
                        last: Date.now(),
                        clicks: 0
                    };
                }

                this.keywordStats[keyword]['last'] = Date.now();
                this.keywordStats[keyword]['clicks']++;
                this.saveToConfig();
            },
        },
        mounted() {
            // 初始化气泡
            if (this.imageGalleryLinks.length > 0) {
                const scrolltop$ = document.querySelector('#scrolltop');
                scrolltop$.insertBefore(this.$refs.bubbles, scrolltop$.childNodes[0]);
                showTopLink();
                scrolltop$.style.visibility = 'visible';
            }
        },
        async created() {
            // 初始化图片展
            const imgs$ = Array.from(document.querySelector('.t_fsz').querySelectorAll('img[file],img[src]'))
                .filter(x => {
                    const imageLink = (x.getAttribute('file') || x.getAttribute('src'))
                    return imageLink.startsWith("http") && imageLink.indexOf("static") < 0;
                });
            imgs$.forEach(x => {
                const imageLink = x.getAttribute('file') || x.getAttribute('src')
                x.setAttribute("src", imageLink);
                x.setAttribute("lazyloaded", true);
                this.imageGalleryLinks.push(imageLink);
            });

            // 初始化收藏馆
            this.loadFromConfig();

            // 初始化评论区
            // const comments$ = Array.from(document.querySelectorAll(`div[id^="post_"]:not([id^="post_ra"], [id^="post_new"])`));
            // this.addComments(comments$, location.href);
            // // 默认加载下一页
            // await this.checkAndLoadMoreCommentsInFirstPage();

            this.nextPageUrl= document.querySelector(".nxt")?.getAttribute("href");
            this.replyThreadUrl = location.href.split('#')[0] + '#f_pst';

            this.selectedPage = parseInt(new URL(location.href).searchParams.get('page')) || 1;
            this.totalPages = parseInt(document.querySelector('.pg label span')?.textContent.match(/\d/g).join("")) || 1;

            const reply = Array.from(document.querySelectorAll('.hm .xi1')?.values()).at(1)?.innerText;
            this.totalComments = reply != null ? parseInt(reply) : this.totalPages * 10;

            // 初始化面板状态
            this.toggleOn = GM_getValue("ToggleOn", false);
            this.avatar = "data:image/jpeg;base64,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";
            this.avatar2 = "data:image/jpeg;base64,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";

        }
    }).mount('#app')

    // Your code here...
})();

(function() {
    GM_addStyle(`
        .fs-button-group {
            display: flex;
            flex-wrap: wrap;
            padding: 0 1em;
        }
        .fs-button-group-item {
            display: flex;
            height: 2em;
            font-size: 1.2em;
            margin: .3em;
            align-items: center;
        }
        .fs-button {
            border: .1em solid brown;
            border-radius: .8em;
            color: black;
            padding: 0 .8em;
            line-height: 2em;
            margin-right: .2em;
        }
        .fs-button:hover {
            cursor: pointer;
            border: .1em solid orange
        }

        .fs-button-close {
            border-radius: 50%;
            height: 1em;
            width: 1em;
            line-height: 1em;
            border: .2em solid #777;
            text-align: center;
            background-color: grey;
            color: #fff;
            margin: 0 0 1em -1em;
        }
        .fs-button-close:hover {
            cursor: pointer;
            border: .2em solid orange;
        }

        .fs-edit {
            padding: 0 1em;
        }

        .fs-edit-area {
            width: 100%;
            height: 20em;
            display: block;
            box-sizing: border-box;
        }

        .fs-mask {
            background-color: rgba(0, 0, 0, 0.6);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #eee;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .fs-footer {
            display: flex;
            justify-content: space-between;
            margin-top: .5em;
            padding: .5em 2em .2em;
            border-top: 1px solid #ddd;
            font-size: 1.2em;
        }

        .fs-footer input {
            flex: 1;
            border-radius: 1em;
            margin-right: .5em;
            text-align: center;
            border: 1px solid black;
        }
    `);
})();
