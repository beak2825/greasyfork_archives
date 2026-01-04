// ==UserScript==
// @name         Pixiv Novel Download King
// @name:zh-CN   Pixiv小说下载王
// @name:zh-TW   Pixiv小說下載王
// @name:ja      Pixiv小説ダウンロード王
// @name:ko      Pixiv소설 다운로드 킹
// @namespace    calary.tampermonkey
// @version      0.2.2
// @description  Your best Pixiv novel downloader, supporting downloads of single works, series, author collections, tag-based collections, and bookmarks
// @description:zh-CN 您最好的pixiv小说下载助手，支持下载单页、系列、作者、标签、收藏夹的小说
// @description:zh-TW 您最好的pixiv小說下載助手，支持下載單頁、系列、作者、標籤、收藏夾的小說
// @description:ja  最高のPixiv小説ダウンローダー。単一作品、シリーズ、作者コレクション、タグ別コレクション、ブックマークのダウンロードをサポートします
// @description:ko  최고의 Pixiv 소설 다운로더. 단일 작품, 시리즈, 작가별 모음, 태그별 모음, 북마크 다운로드를 지원합니다
// @author       eyeyani
// @license      GPL-3.0
// @match        https://*.pixiv.net/*
// @icon         https://www.pixiv.net/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523666/Pixiv%20Novel%20Download%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/523666/Pixiv%20Novel%20Download%20King.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        maxConcurrent: 5, // 默认并发数
    };

    const lang = (
        window.navigator.language ||
        window.navigator.browserLanguage ||
        "en-us"
    ).toLowerCase();

    const i18nMap = {
        "en-us": {
            ui_title: "Novel Download King",
            ui_dl_page: "Download This Page",
            ui_dl_author: "Batch Download This Author",
            ui_dl_series: "Batch Download This Series",
            ui_dl_list: "Batch Download This List",
            ui_dl_favlist: "Batch Download Bookmark List",
            ui_start: "START",
            ui_pause: "PAUSE",
            ui_resume: "RESUME",
            ui_retry: "RETRY",
            ui_cancel: "CANCEL",
            ui_dl_current_page: "Current Page",
            ui_all: "ZIP All",
            ui_specific: "Specific Chapters",
            ui_merge: "Merge into Single TXT",
            ui_chapter: "Chapter(s)",
            error_default: "Something went wrong",
            error_notpage: "This is not a novel page.",
            error_notauthor: "This is not an author page.",
            error_notseries: "This is not a series page.",
            error_notlist: "This is not a list page.",
            error_notfavlist: "This is not a bookmark page",
            error_invalid_chapter_input: "Invalid chapter input.",
            error_no_chapters_found: "No chapters found matching your input.",
            ui_page: "Page",
            ui_batch_download: "Batch Download",
            ui_batch_download_options: "Batch Download Options",
            ui_single_download: "Single Download",
            ui_start_download: "Start Download",
            ui_download_scope: "Download Scope:",
            ui_auto_detect: "Auto Detect",
            ui_scope_author: "Author",
            ui_scope_series: "Series",
            ui_scope_list: "List",
            ui_scope_favlist: "Favorites",
            ui_chapter_selection: "Chapter Selection:",
            ui_all_chapters: "All",
            ui_specific_chapters: "Specific",
            ui_output_format: "Output Format:",
            ui_format_zip: "ZIP",
            ui_format_txt: "TXT",
            ui_start_batch_download: "Start Batch Download"
        },
        "zh-cn": {
            ui_title: "小说下载王",
            ui_dl_page: "下载此页面",
            ui_dl_author: "批量下载此作者",
            ui_dl_series: "批量下载此系列",
            ui_dl_list: "批量下载此列表页",
            ui_dl_favlist: "批量下载收藏列表",
            ui_start: "开始",
            ui_pause: "暂停",
            ui_resume: "继续",
            ui_retry: "重试",
            ui_cancel: "取消",
            ui_dl_current_page: "当前页",
            ui_all: "打包为ZIP",
            ui_specific: "指定章节",
            ui_merge: "合并TXT",
            ui_chapter: "章节",
            error_default: "出错了",
            error_notpage: "该页不是小说页。",
            error_notauthor: "该页不是作者主页。",
            error_notseries: "该页不是系列页。",
            error_notlist: "该页不是列表页。",
            error_notfavlist: "该页不是收藏列表。",
            error_invalid_chapter_input: "无效的章节输入。",
            error_no_chapters_found: "没有找到符合您输入的章节。",
            txt_title: "标题：",
            txt_novelid: "作品id：",
            txt_author: "作者：",
            txt_authorid: "Pixiv ID：",
            txt_words: "字数：",
            txt_likes: "喜欢：",
            txt_createtime: "创建时间：",
            txt_updatetime: "更新时间：",
            txt_tags: "标签：",
            txt_desc: "描述：",
            txt_words2: "字",
            txt_likes2: "喜欢",
            txt_pageno: "第{0}页",
            txt_fav: "收藏",
            ui_page: "页",
            ui_batch_download: "批量下载",
            ui_batch_download_options: "批量下载选项",
            ui_single_download: "单页下载",
            ui_start_download: "开始下载此章",
            ui_download_scope: "下载范围：",
            ui_auto_detect: "自动检测",
            ui_scope_author: "作者",
            ui_scope_series: "系列",
            ui_scope_list: "列表",
            ui_scope_favlist: "收藏",
            ui_chapter_selection: "章节选择：",
            ui_all_chapters: "全部",
            ui_specific_chapters: "指定",
            ui_output_format: "输出格式：",
            ui_format_zip: "ZIP",
            ui_format_txt: "TXT",
            ui_start_batch_download: "开始批量下载"
        },
        "zh-tw": {
            ui_title: "小說下載王",
            ui_dl_page: "下載此頁面",
            ui_dl_author: "批量下載此作者",
            ui_dl_series: "批量下載此系列",
            ui_dl_list: "批量下載此列表頁",
            ui_dl_favlist: "批量下載收藏列表",
            ui_start: "開始",
            ui_pause: "暫停",
            ui_resume: "繼續",
            ui_retry: "重試",
            ui_cancel: "取消",
            ui_dl_current_page: "當前頁",
            ui_all: "打包爲ZIP",
            ui_specific: "指定章節",
            ui_merge: "合併TXT",
            ui_chapter: "章節",
            error_default: "出錯了",
            error_notpage: "該頁不是小說頁。",
            error_notauthor: "該頁不是作者主頁。",
            error_notseries: "該頁不是系列頁。",
            error_notlist: "該頁不是列表頁。",
            error_notfavlist: "該頁不是收藏列表。",
            error_invalid_chapter_input: "無效的章節輸入。",
            error_no_chapters_found: "沒有找到符合您輸入的章節。",
            txt_title: "標題：",
            txt_novelid: "作品id：",
            txt_author: "作者：",
            txt_authorid: "Pixiv ID：",
            txt_words: "字數：",
            txt_likes: "喜歡：",
            txt_createtime: "創建時間：",
            txt_updatetime: "更新時間：",
            txt_tags: "標籤：",
            txt_desc: "描述：",
            txt_words2: "字",
            txt_likes2: "喜歡",
            txt_pageno: "第{0}頁",
            txt_fav: "收藏",
            ui_page: "頁",
            ui_batch_download: "批量下載",
            ui_batch_download_options: "批量下載選項",
            ui_single_download: "單頁下載",
            ui_start_download: "開始下載此章",
            ui_download_scope: "下載範圍：",
            ui_auto_detect: "自動檢測",
            ui_scope_author: "作者",
            ui_scope_series: "系列",
            ui_scope_list: "列表",
            ui_scope_favlist: "收藏",
            ui_chapter_selection: "章節選擇：",
            ui_all_chapters: "全部",
            ui_specific_chapters: "指定",
            ui_output_format: "輸出格式：",
            ui_format_zip: "ZIP",
            ui_format_txt: "TXT",
            ui_start_batch_download: "開始批量下載"
        },
        "ja": {
            ui_title: "小説ダウンロード王",
            ui_dl_page: "このページをダウンロード",
            ui_dl_author: "この作者をまとめてダウンロード",
            ui_dl_series: "このシリーズをまとめてダウンロード",
            ui_dl_list: "このリストページをまとめてダウンロード",
            ui_dl_favlist: "ブックマークリストをまとめてダウンロード",
            ui_start: "開始",
            ui_pause: "一時停止",
            ui_resume: "再開",
            ui_retry: "再試行",
            ui_cancel: "キャンセル",
            ui_dl_current_page: "現在のページ",
            ui_all: "全部ZIPにする",
            ui_specific: "指定章",
            ui_merge: "TXTを結合",
            ui_chapter: "チャプター",
            error_default: "問題が発生しました",
            error_notpage: "これは小説ページではありません。",
            error_notauthor: "これは作者ページではありません。",
            error_notseries: "これはシリーズページではありません。",
            error_notlist: "これはリストページではありません。",
            error_notfavlist: "これはブックマークページではありません",
            error_invalid_chapter_input: "無効なチャプター入力です。",
            error_no_chapters_found: "入力に一致するチャプターが見つかりませんでした。",
            txt_title: "タイトル：",
            txt_novelid: "作品ID：",
            txt_author: "作者：",
            txt_authorid: "Pixiv ID：",
            txt_words: "文字数：",
            txt_likes: "いいね：",
            txt_createtime: "作成時間：",
            txt_updatetime: "更新時間：",
            txt_tags: "タグ：",
            txt_desc: "説明：",
            txt_words2: "文字",
            txt_likes2: "いいね",
            txt_pageno: "{0}ページ",
            txt_fav: "お気に入り",
            ui_page: "ページ",
            ui_batch_download: "バッチダウンロード",
            ui_batch_download_options: "バッチダウンロードオプション",
            ui_single_download: "シングルダウンロード",
            ui_start_download: "ダウンロードを開始",
            ui_download_scope: "ダウンロード範囲：",
            ui_auto_detect: "自動検出",
            ui_scope_author: "作者",
            ui_scope_series: "シリーズ",
            ui_scope_list: "リスト",
            ui_scope_favlist: "お気に入り",
            ui_chapter_selection: "章の選択：",
            ui_all_chapters: "すべて",
            ui_specific_chapters: "特定",
            ui_output_format: "出力フォーマット：",
            ui_format_zip: "ZIP",
            ui_format_txt: "TXT",
            ui_start_batch_download: "バッチダウンロードを開始"
        },
        "ko": {
            ui_title: "소설 다운로드 왕",
            ui_dl_page: "이 페이지를 다운로드",
            ui_dl_author: "이 작가를 묶어서 다운로드",
            ui_dl_series: "이 시리즈를 묶어서 다운로드",
            ui_dl_list: "이 목록 페이지를 묶어서 다운로드",
            ui_dl_favlist: "북마크 목록을 묶어서 다운로드",
            ui_start: "시작",
            ui_pause: "일시 정지",
            ui_resume: "재개",
            ui_retry: "재시도",
            ui_cancel: "취소",
            ui_dl_current_page: "현재 페이지",
            ui_all: "전부 ZIP으로 묶기",
            ui_specific: "지정 장",
            ui_merge: "TXT를 병합",
            ui_chapter: "챕터",
            error_default: "문제가 발생했습니다",
            error_notpage: "이것은 소설 페이지가 아닙니다.",
            error_notauthor: "이것은 작가 페이지가 아닙니다.",
            error_notseries: "이것은 시리즈 페이지가 아닙니다.",
            error_notlist: "이것은 목록 페이지가 아닙니다.",
            error_notfavlist: "이것은 북마크 페이지가 아닙니다",
            error_invalid_chapter_input: "유효하지 않은 챕터 입력입니다.",
            error_no_chapters_found: "입력과 일치하는 챕터를 찾을 수 없습니다。",
            txt_title: "제목:",
            txt_novelid: "작품 ID:",
            txt_author: "작가:",
            txt_authorid: "Pixiv ID:",
            txt_words: "글자 수:",
            txt_likes: "좋아요:",
            txt_createtime: "작성 시간:",
            txt_updatetime: "업데이트 시간:",
            txt_tags: "태그:",
            txt_desc: "설명:",
            txt_words2: "글자",
            txt_likes2: "좋아요",
            txt_pageno: "{0}페이지",
            txt_fav: "즐겨찾기",
            ui_page: "페이지",
            ui_batch_download: "일괄 다운로드",
            ui_batch_download_options: "일괄 다운로드 옵션",
            ui_single_download: "단일 다운로드",
            ui_start_download: "다운로드 시작",
            ui_download_scope: "다운로드 범위 :",
            ui_auto_detect: "자동 감지",
            ui_scope_author: "작가",
            ui_scope_series: "시리즈",
            ui_scope_list: "목록",
            ui_scope_favlist: "즐겨 찾기",
            ui_chapter_selection: "장 선택 :",
            ui_all_chapters: "모두",
            ui_specific_chapters: "특정",
            ui_output_format: "출력 형식 :",
            ui_format_zip: "ZIP",
            ui_format_txt: "TXT",
            ui_start_batch_download: "일괄 다운로드 시작"
        },
    };
    const i18n = (key, ...args) => {
        let str = (i18nMap[lang] && i18nMap[lang][key]) || i18nMap["en-us"][key];
        args.forEach((value, index) => {
            str = str.replace(`{${index}}`, value);
        });
        return str;
    };

    const fontFamily = 'sans-serif';

    function filterFilename(filename) {
        return filename.replace(/\?|[*:"<>\\/|]/g, "");
    }

    function baseRequest(config) {
        return new Promise((resolve, reject) => {
            $.ajax({
                timeout: 50000,
                ...config,
                success: resolve,
                error: (xhr, status, error) => {
                    if (config.signal && config.signal.aborted) {
                        reject(new Error("Request aborted"));
                    } else {
                        reject(new Error(i18n("error_default")));
                    }
                },
            });
        });
    }

    function request(config) {
        return baseRequest(config).then(({ error, message, body }) => {
            if (error) {
                throw new Error(message);
            }
            return body;
        });
    }

    class Task {
        constructor(title) {
            this.title = title;
            this.status = '';
            this.$item = $(`<div class="task-item">
                <span class="task-title">${i18n(title)}</span>
                <span class="task-status">
                    <span class="current"></span> -
                    <span class="page"></span>
                </span>
            </div>`);
            this.$status = this.$item.find(".task-status").hide();
            this.$currentStatus = this.$item.find(".task-status .current");
            this.$pageStatus = this.$item.find(".task-status .page");
        }

        start() {
            this.status = 'running';
        }

        cancel() {
            this.status = '';
        }

        isRunning() {
            return this.status === 'running';
        }

        isCancelled() {
            return this.status === 'cancelled';
        }

        isPaused() {
            return this.status === 'paused';
        }

        checkRunning() {
            if (!this.isRunning()) {
                throw new Error("CANCELLED");
            }
        }

        errorHandler(e) {
            if (e.message === "CANCELLED") return;
            this.error();
            console.error(e);
            alert(e);
        }

       async getWork(id, isSingle = false, signal) {
            try {
                const body = await request({
                    url: `/ajax/novel/${id}`,
                    responseType: "json",
                    signal: signal,
                });

                 let content = body.content
                    .replace(/\[uploadedimage:\d+\]/g, '')
                    .replace(/\[PARAGRAPH\]/g, "\n")
                    .replace(/\[\[rb:(.+?) > (.+?)\]\]/g, '$1')
                    .replace(/\[newpage\]/g, '')
                    .replace(/\[pixivimage:\d+\]/g, '')
                    .replace(/^\s*\[chapter:(.*?)\]\s*/gim, '$1\n')
                    .replace(/^[ \t　]+/gm, '')
                    .replace(/(\r?\n|\r|\u2028|\u2029)(第[零一二三四五六七八九十]{1,3}章)/g, "$1\n$2")
                    .replace(/\\n/g, "\n")
                    .replace(/\r\n/g, '\n')
                    .replace(/\r/g, '\n')
                    .replace(/\n{2,}/g, '\n')
                    .replace(/(.+?)(?<!\n)$/gm, '$1\n')
                    .replace(/^\n+|\n+$/g, '');


                let filename = '';
                let chapterTitleForFilename = filterFilename(body.title);


               if (isSingle) {
                    filename = `1_${chapterTitleForFilename}.txt`;
                } else {
                    this.chapterCounter++;
                    const chapterNumber = String(this.chapterCounter);
                    filename = `${chapterNumber}_${chapterTitleForFilename}.txt`
                }

                content = `　　${content}`;

                return { id, filename, content: content.trim() };
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log(`Fetch aborted for novel ${id}`);
                    throw new Error("CANCELLED");
                } else {
                    console.error(`Error fetching novel ${id}:`, error);
                    throw error;
                }
            }
        }
    }

    class TaskMultiPage extends Task {
        constructor(title) {
            super(title);
            this.bookTitle = "";
            this.pageParam = "p";
            this.offsetParam = "offset";
            this.limitParam = "limit";
            this.defaultParams = {};
            this.page = 1;
            this.finished = 0;
            this.limit = 24;
            this.total = 0;
            this.pages = 0;
            this.chapterCounter = 0;
            this.mode = "all";
            this.step = "";
            this.url = null;
            this.params = null;
            this.promise = null;
            this.entries = {};
            this.allNovelIds = new Set();
            this.specificChapters = null;
            this.batchScope = "auto";
            this.batchChapters = "all";
            this.batchFormat = "zip";
            this.paused = false;
            this.cancelled = false;
        }

        getUrl() { return ""; }
        getSaveFilename() { return filterFilename(this.bookTitle) + ".zip"; }
        check() {}
        getInitData() { return Promise.resolve(); }
        parseList(payload) { return payload; }

        start() {
            try {
                this.check();
                this.chapterCounter = 0;
            } catch (e) {
                alert(e);
                return;
            }
            this.status = 'running';
            $panel.find('.batch-download-btn').hide();
            $panel.find('.pause-btn').show();
            $panel.find('.cancel-btn').show();
            $panel.find('.resume-btn').hide();
            $batchProgress.hide();

            this.batchScope = $panel.find('select[name="batch_scope"]').val();
            this.batchChapters = $panel.find('input[name="batch_chapters"]:checked').val();
            this.batchFormat = $panel.find('input[name="batch_format"]:checked').val();

            if (this.batchChapters === 'specific') {
                const chaptersInput = $panel.find('input[name="specific_chapters_input"]').val();
                this.specificChapters = this.parseChapterInput(chaptersInput);
                if (!this.specificChapters) {
                    alert(i18n('error_invalid_chapter_input'));
                    this.cancel();
                    return;
                }
            } else {
                this.specificChapters = null;
            }

            const curPageUrl = new URL(window.location.href);
            this.url = this.getUrl();
            this.params = Object.assign({}, this.defaultParams, Object.fromEntries(curPageUrl.searchParams));
            this.page = parseInt(this.params[this.pageParam]) || 1;
            this.allNovelIds.clear();
            this.entries = {};
            this.paused = false;
            this.cancelled = false;

            this.getInitData().then(() => this.getNextList()).catch(this.errorHandler.bind(this));
        }

        parseChapterInput(input) {
            if (!input) return null;
            const ranges = input.split(',');
            const chapters = new Set();
            for (const range of ranges) {
                const match = range.match(/(\d+)(?:-(\d+))?/);
                if (!match) return null;
                const start = parseInt(match[1], 10);
                const end = match[2] ? parseInt(match[2], 10) : start;
                if (isNaN(start) || isNaN(end) || start < 1 || end < start) return null;
                for (let i = start; i <= end; i++) {
                    chapters.add(i);
                }
            }
            return Array.from(chapters).sort((a, b) => a - b);
        }

        pause() {
            this.paused = true;
            $panel.find('.pause-btn').hide();
            $panel.find('.resume-btn').show();
            $batchProgress.show(); // 确保暂停时显示进度条
        }

        resume() {
            this.paused = false;
            $panel.find('.resume-btn').hide();
            $panel.find('.pause-btn').show();
            $batchProgress.show(); // 确保继续时显示进度条
            if (this.step === "list") {
                this.getNextList();
            } else if (this.step === "works") {
                this.getWorks();
            }
        }

        retry() {
            this.page = 1;
            this.allNovelIds.clear();
            this.entries = {};
            this.paused = false;
            this.cancelled = false;
            $panel.find('.resume-btn').hide();
            $panel.find('.cancel-btn').hide();
            $panel.find('.pause-btn').show();
            $batchProgress.show(); // 确保重试时显示进度条
            this.getInitData().then(() => this.getNextList()).catch(this.errorHandler.bind(this));
        }

        isPaused() {
            return this.paused;
        }

        isCancelled() {
            return this.cancelled;
        }

        cancel() {
            this.cancelled = true;

            $panel.find('.batch-download-btn').show();
            $panel.find('.pause-btn').hide();
            $panel.find('.cancel-btn').hide();
            $panel.find('.resume-btn').hide();

            this.clearProgress();
            this.finish();
        }

        finish() {
            this.step = "idle";
            this.clearProgress();
            $panel.find('.batch-download-btn').show();
            $panel.find('.pause-btn').hide();
            $panel.find('.cancel-btn').hide();
            $panel.find('.resume-btn').hide();
        }

        setParams() {
            this.params[this.pageParam] = this.page;
            this.params[this.limitParam] = this.limit;
            this.params[this.offsetParam] = (this.page - 1) * this.limit;
        }

        getNextList() {
            if (this.isPaused() || this.isCancelled()) return;
            this.step = "list";
            this.setParams();

            this.promise = this.getList()
                .then(({ data = [], total }) => {
                    if (this.isPaused() || this.isCancelled()) return;
                    this.total = total;
                    this.pages = Math.ceil(total / this.limit);
                    this.finished = 0;
                    this.updateStatus();

                    if (data.length === 0) return;

                    data.forEach(item => this.allNovelIds.add(item.id));

                    if (this.batchChapters === "all" && this.allNovelIds.size < this.total) {
                        this.page++;
                        this.getNextList();
                    } else {
                        this.getWorks();
                    }
                })
                .catch(this.errorHandler.bind(this));
        }

        async getList() {
            if (this.isPaused() || this.isCancelled()) return { data: [], total: 0 };
            this.setParams();
            try {
                const body = await request({
                    url: this.url,
                    data: this.params,
                    method: "get",
                    responseType: "json",
                });
                if (this.isPaused() || this.isCancelled()) return { data: [], total: 0 };
                return this.parseList(body.page);
            } catch (error) {
                this.errorHandler(error);
                return { data: [], total: 0 };
            }
        }

        async getWorks() {
            if (this.isPaused() || this.isCancelled()) return;
            this.step = "works";

            const novelIdsToDownload = this.batchChapters === 'specific'
                ? Array.from(this.allNovelIds).filter(id => this.specificChapters.includes(parseInt(id, 10)))
                : Array.from(this.allNovelIds);

            if (this.batchChapters === 'specific' && novelIdsToDownload.length === 0) {
                alert(i18n('error_no_chapters_found'));
                this.cancel();
                return;
            }

            const queue = novelIdsToDownload.slice();
            const results = [];
            const workers = Array(config.maxConcurrent).fill(null).map(() => {
                return new Promise(async (resolve, reject) => {
                    while (queue.length > 0) {
                        if (this.isPaused() || this.isCancelled()) return resolve();
                        const id = queue.shift();
                        try {
                            const currentRequestController = new AbortController(); // 仍然需要 AbortController
                            const signal = currentRequestController.signal;
                            const work = await this.getWork(id, false, signal);

                            if (this.isCancelled()) {
                                this.finish();
                                return resolve();
                            }
                            results.push(work);
                            this.entries[id] = work;
                            this.updateStatus(); //更新状态

                        } catch (error) {
                             if(error.message !== "CANCELLED"){
                              this.errorHandler(error);
                            } else {
                              this.finish();
                              return resolve();
                            }
                        }
                    }
                    resolve();
                });
            });

            await Promise.all(workers);

            if (!this.isPaused() && !this.isCancelled()) {
                results.forEach(work => {
                    this.entries[work.id] = work;
                });
                if (this.batchFormat === 'txt') {
                    this.downloadMergedText();
                } else {
                    this.downloadZipped();
                }
            }
        }

        downloadZipped() {
            const zip = new JSZip();
            let hasFile = false;
            Object.values(this.entries).forEach(({ filename, content }) => {
                hasFile = true;
                zip.file(filename, content);
            });

            if (hasFile) {
                zip.generateAsync({ type: "blob" })
                    .then(content => saveAs(content, this.getSaveFilename()));
            }
            this.finish();
        }

         downloadMergedText() {
            let mergedContent = '';
            const sortedEntries = Object.values(this.entries).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
            const bookTitleForMerge = filterFilename(this.bookTitle);
            let chapterNumber = 1;
            let isFirstChapter = true;

            sortedEntries.forEach(entry => {
                const filenameParts = entry.filename.split('_');
                 let chapterTitle = '';
                if (filenameParts.length > 1) {
                    chapterTitle = filenameParts.slice(1).join('_').replace('.txt', '');
                } else {
                     chapterTitle = entry.filename.replace('.txt', '');
                 }

                 const chapterNumberRegex = /(?:第(?:[零一二三四五六七八九十百千〇\d壹貳參肆伍陸柒捌玖拾佰仟]+)[章话話节節集回幕段](?:之[\d]+)?)|第[0-9]+[章回节節集話话幕段]|(?:卷|冊|辑|輯)[\s]?[\d]+|(?:Chapter|Chap|Part|Section|Segment|Book)[\.\s]?[\d]+|(?:Ch|Bk)[\.\s]?[\d]+|(?:\d+[章回节集節話话幕段])|(?:序章|尾[声聲]|引子|楔子|序[言]?|终章|終章|[正]?番外|彩蛋|花絮|完[结結]|[终終]回|最[终終](?:[话話回囘]))[\s]?[\d]*[\s]?[\d]*|#\d+/gui;


                 if (!chapterNumberRegex.test(chapterTitle) && !/^(第[\d一二三四五六七八九十]+章)/.test(chapterTitle)) {
                    chapterTitle = `第${chapterNumber}章 ${chapterTitle}`;
                }
                if (!isFirstChapter) {
                    mergedContent += `\n\n${chapterTitle}\n\n`;
                } else {
                    mergedContent += `${chapterTitle}\n\n`;
                    isFirstChapter = false;
                }


                mergedContent += entry.content;


                chapterNumber++;
            });

            mergedContent = mergedContent.replace(/\[newpage\]/g, "");
            mergedContent = mergedContent.replace(/\\n/g, "\n");

            const filename = filterFilename(`${this.userName}_${bookTitleForMerge}`) + ".txt";
            saveAs(new Blob([mergedContent], { type: "text/plain;charset=UTF-8" }), filename);
            this.finish();
        }

        clearProgress() {
            $batchProgress.empty().hide();
        }

        updateStatus() {
            $batchProgress.show();
            const downloadedCount = Object.keys(this.entries).length;
            $batchProgress.html(`Downloaded: ${downloadedCount}/${this.total}`);

            // 移除可选部分：显示当前下载的章节
            // if (this.currentWork) {
            //    $batchProgress.append(`<br>${this.currentWork.title}`);
            //}
        }
    }

    class TaskPage extends Task {
        constructor(title) {
            super(title);
            this.promise = null;
        }

        async getWork(id, isSingle = true, signal) {
            try {
                const body = await request({
                    url: `/ajax/novel/${id}`,
                    responseType: "json",
                    signal: signal,
                });

                const chapterNumber = String(1);
                const chapterTitle = filterFilename(body.title);
                const filename = `${chapterNumber}_${chapterTitle}.txt`;

                let content = body.content
                    .replace(/\[uploadedimage:\d+\]/g, '')
                    .replace(/\[PARAGRAPH\]/g, "\n")
                    .replace(/\[\[rb:(.+?) > (.+?)\]\]/g, '$1')
                    .replace(/\[newpage\]/g, '')
                    .replace(/\[pixivimage:\d+\]/g, '')
                    .replace(/^\s*\[chapter:(.*?)\]\s*/gim, '$1\n')
                    .replace(/^[ \t　]+/gm, '')
                    .replace(/(\r?\n|\r|\u2028|\u2029)(第[零一二三四五六七八九十]{1,3}章)/g, "$1\n$2")
                    .replace(/\\n/g, "\n")
                    .replace(/\r\n/g, '\n')
                    .replace(/\r/g, '\n')
                    .replace(/\n{2,}/g, '\n')
                    .replace(/(.+?)(?<!\n)$/gm, '$1\n')
                    .replace(/^\n+|\n+$/g, '');

                 content = `　　${content}`;


                return { id, filename, content: content.trim() };
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log(`Fetch aborted for novel ${id}`);
                    throw new Error("CANCELLED");
                } else {
                    console.error(`Error fetching novel ${id}:`, error);
                    throw error;
                }
            }
        }

        start() {
            const exec = /\/novel\/show.php\?id=(\d+)/i.exec(window.location.href);
            if (!exec) {
                alert(i18n("error_notpage"));
                return;
            }
            const id = exec[1];
            super.start();

            this.promise = this.getWork(id)
                .then(({ filename, content }) => {
                    if (!this.isRunning()) return;
                    this.cancel();
                    saveAs(new Blob([content], { type: "text/plain;charset=UTF-8" }), filename);
                })
                .catch(e => {
                    if (e.message !== "CANCELLED") {
                        this.errorHandler(e);
                    }
                });
        }
    }

    class TaskAuthor extends TaskMultiPage {
        constructor(title) {
            super(title);
            this.defaultParams = {
                limit: 10,
                last_order: 0,
                order_by: "asc",
                lang: "zh",
            };
            this.id = "";
            this.limit = 24;
            this.tag = "";
            this.userName = "";
            this.workIds = null;
            this.total = 0;
        }

        check() {
            const pathname = window.location.pathname;
            const exec2 = /^\/users\/(\d+)\/novels\/(.+)$/.exec(pathname);
            const exec1 = /^\/users\/(\d+)(\/novels)*$/.exec(pathname);

            this.id = "";
            this.tag = "";

            if (this.batchScope === "auto") {
                if (exec2) {
                    this.id = exec2[1];
                    this.tag = decodeURIComponent(exec2[2]);
                    this.batchScope = "author";
                } else if (exec1) {
                    this.id = exec1[1];
                    this.batchScope = "author";
                } else {
                    throw new Error(i18n("error_notauthor"));
                }
            } else if (this.batchScope === "author"){
                if (exec2) {
                    this.id = exec2[1];
                    this.tag = decodeURIComponent(exec2[2]);
                } else if (exec1) {
                    this.id = exec1[1];
                } else {
                    throw new Error(i18n("error_notauthor"));
                }
            } else {
                throw new Error(i18n("error_notauthor"));
            }
        }

        async getInitData() {
            const [infoPayload, workPayload] = await Promise.all([
                request({
                    url: `/ajax/user/${this.id}`,
                    method: "get",
                    data: { full: 1, lang: "zh" },
                }),
                request({
                    url: `/ajax/user/${this.id}/profile/all`,
                    method: "get",
                    data: { lang: "zh" },
                })
            ]);
            this.userName = infoPayload.name;
            this.workIds = Object.keys(workPayload.novels).sort((a, b) => b - a);
            this.total = this.workIds.length;
        }

        async getList() {
            if (this.tag) {
                return super.getList();
            }

            const { limit, page, workIds } = this;
            const offset = limit * (page - 1);
            return Promise.resolve({
                total: workIds.length,
                data: workIds.slice(offset, offset + limit).map(id => ({ id })),
            });
        }

        parseList(payload) {
            if (this.tag) {
                return { data: payload.works, total: payload.total };
            }
            return { total: this.total, works: Object.values(payload.works) };
        }

        getUrl() {
            return `/ajax/user/${this.id}/novels/tag`;
        }

        setParams() {
            const { tag, limit, page } = this;
            const offset = limit * (page - 1);
            this.params = { tag, limit, offset, lang: "zh" };
        }

        getSaveFilename() {
            return filterFilename(`${this.userName}_${this.batchFormat === 'txt' ? '合集' : '作品集'}`) + (this.batchFormat === 'txt' ? '.txt' : '.zip');
        }
    }

    class TaskSeries extends TaskMultiPage {
        constructor(title) {
            super(title);
            this.defaultParams = {
                last_order: 0,
                order_by: "asc",
                lang: "zh",
            };
            this.id = "";
            this.limit = 10;
            this.title = "";
            this.userName = "";
            this.total = 0;
        }

        check() {
            if (this.batchScope === "auto" || this.batchScope === "series"){
                const exec = /^\/novel\/series\/(\d+)/i.exec(window.location.pathname);
                if (!exec) {
                    throw new Error(i18n("error_notseries"));
                }
                this.id = exec[1];
            } else {
                throw new Error(i18n("error_notseries"));
            }
        }

        async getInitData() {
            const payload = await request({
                url: `/ajax/novel/series/${this.id}`,
                method: "get",
                data: { lang: "zh" },
            });
            this.bookTitle = filterFilename(payload.title);
            this.title = payload.title;
            this.userName = payload.userName;
            this.total = payload.displaySeriesContentCount;
        }

        parseList(payload) {
            return { data: payload.seriesContents, total: this.total };
        }

        getUrl() {
            return `/ajax/novel/series_content/${this.id}`;
        }

        setParams() {
            this.params.last_order = this.limit * (this.page - 1);
        }

        getSaveFilename() {
            return filterFilename(`${this.userName}_${this.bookTitle}`) + (this.batchFormat === 'txt' ? '.txt' : '.zip');
        }
    }

    class TaskList extends TaskMultiPage {
        constructor(title) {
            super(title);
            this.defaultParams = {
                word: "",
                order: "date_d",
                mode: "all",
                p: 1,
                s_mode: "s_tag_full",
                gs: 0,
                lang: "zh",
            };
            this.tag = "";
        }

        check() {
            if (this.batchScope === "auto" || this.batchScope === "list"){
                const exec = /^\/tags\/(.+)\/novels$/i.exec(window.location.pathname);
                if (!exec) {
                    throw new Error(i18n("error_notlist"));
                }
                this.tag = decodeURIComponent(exec[1]);
                this.defaultParams.word = this.tag;
                this.bookTitle = filterFilename(this.tag);
            } else {
                throw new Error(i18n("error_notlist"));
            }
        }

        async getList() {
            try {
                const payload = await request({
                    url: `/ajax/search/novels/${encodeURIComponent(this.tag)}`,
                    responseType: "json",
                });
                this.checkRunning();
                return this.parseList(payload.novel);
            } catch (error) {
                this.errorHandler(error);
                return { data: [], total: 0 };
            }
        }

        parseList(payload) {
            const { data, total } = payload;
            return { data, total };
        }

        getUrl() {
            return `/ajax/search/novels/${encodeURIComponent(this.tag)}`;
        }

        getSaveFilename() {
            return filterFilename(this.bookTitle) + (this.batchFormat === 'txt' ? '.txt' : '.zip');
        }
    }

    class TaskFavList extends TaskMultiPage {
        constructor(title) {
            super(title);
            this.defaultParams = {
                tag: "",
                offset: 0,
                limit: 24,
                rest: "show",
                lang: "zh",
            };
            this.userId = "";
        }

        check() {
            if (this.batchScope === "auto" || this.batchScope === "favlist"){
                const exec = /^\/users\/(\d+)\/bookmarks\/novels$/i.exec(window.location.pathname);
                if (!exec) {
                    throw new Error(i18n("error_notfavlist"));
                }
                this.userId = exec[1];
                this.bookTitle = i18n("txt_fav");
            } else {
                throw new Error(i18n("error_notfavlist"));
            }
        }

        async getList() {
            try {
                const payload = await request({
                    url: `/ajax/user/${this.userId}/novels/bookmarks`,
                    responseType: "json",
                });
                this.checkRunning();
                return this.parseList(payload);
            } catch (error) {
                this.errorHandler(error);
                return { data: [], total: 0 };
            }
        }

        parseList(payload) {
            const { works, total } = payload;
            const data = works.filter(item => !!item.xRestrict);
            return { data, total };
        }

        getUrl() {
            return `/ajax/user/${this.userId}/novels/bookmarks`;
        }

        getSaveFilename() {
            return filterFilename(this.bookTitle) + (this.batchFormat === 'txt' ? '.txt' : '.zip');
        }
    }

    const taskPage = new TaskPage("ui_dl_page");
    const taskAuthor = new TaskAuthor("ui_dl_author");
    const taskSeries = new TaskSeries("ui_dl_series");
    const taskList = new TaskList("ui_dl_list");
    const taskFavList = new TaskFavList("ui_dl_favlist");

    const $panel = $(`
<div class="pixiv-downloader-panel collapsed">
    <span class="download-icon">⬇</span>
    <h4 class="downloader-title">${i18n("ui_title")}</h4>

    <div class="downloader-section single-download-section">
        <h5 class="section-title">${i18n("ui_single_download")}</h5>
        <button class="downloader-btn single-download-btn">${i18n("ui_start_download")}</button>
        </div>

    <div class="downloader-section batch-download-section">
        <h5 class="section-title">${i18n("ui_batch_download")}</h5>
        <div class="downloader-option">
            <span>${i18n("ui_download_scope")}</span>
            <select name="batch_scope">
                <option value="auto" selected>${i18n("ui_auto_detect")}</option>
                <option value="author">${i18n("ui_scope_author")}</option>
                <option value="series">${i18n("ui_scope_series")}</option>
                <option value="list">${i18n("ui_scope_list")}</option>
                <option value="favlist">${i18n("ui_scope_favlist")}</option>
            </select>
        </div>
        <div class="downloader-option">
            <span>${i18n("ui_chapter_selection")}</span>
            <label><input type="radio" name="batch_chapters" value="all" checked> ${i18n("ui_all_chapters")}</label>
            <label><input type="radio" name="batch_chapters" value="specific"> ${i18n("ui_specific_chapters")}</label>
        </div>
        <div class="downloader-option specific-chapters" style="display: none;">
            <span>${i18n("ui_chapter")}:</span>
            <input type="text" name="specific_chapters_input" placeholder="id,id-id,id" />
        </div>
        <div class="downloader-option">
            <span>${i18n("ui_output_format")}</span>
            <label><input type="radio" name="batch_format" value="zip" checked> ${i18n("ui_format_zip")}</label>
            <label><input type="radio" name="batch_format" value="txt"> ${i18n("ui_format_txt")}</label>
        </div>
        <button class="downloader-btn batch-download-btn">${i18n("ui_start_batch_download")}</button>
        <button class="downloader-btn pause-btn" style="display: none;">${i18n("ui_pause")}</button>
        <button class="downloader-btn resume-btn" style="display: none;">${i18n("ui_resume")}</button>
        <button class="downloader-btn cancel-btn" style="display: none;">${i18n("ui_cancel")}</button>
        <span class="batch-progress" style="margin-left: 10px;"></span>
    </div>

    <div class="collapse-btn"></div>
</div>
`);

    $('body').append($panel);

    const $collapseBtn = $panel.find('.collapse-btn').html('');
    const $downloadIcon = $panel.find('.download-icon');
    const $specificChapters = $panel.find('.specific-chapters');
    const $batchProgress = $panel.find('.batch-progress');

    $panel.on('change', 'input[name="batch_chapters"]', function() {
        $specificChapters.toggle($(this).val() === 'specific');
    });

    $downloadIcon.on('click', function() {
        if ($panel.hasClass('collapsed')) {
            $collapseBtn.click();
        }
    });

    $collapseBtn.on('click', function() {
        const fullWidth = $panel.data('fullWidth') || 300;
        const collapsedWidth = 30;
        const isCollapsed = $panel.hasClass('collapsed');

        if (isCollapsed) {
            $panel.removeClass('collapsed').animate({
                width: fullWidth,
                paddingLeft: '10px'
            }, 300, function() {
                $panel.find('> *:not(.collapse-btn, .download-icon)').fadeIn(100);
                $downloadIcon.hide();
                $collapseBtn.html('◀');
            });
        } else {
            $panel.addClass('collapsed').animate({
                width: collapsedWidth,
                paddingLeft: '5px'
            }, 300, function() {
                $panel.find('> *:not(.collapse-btn, .download-icon)').fadeOut(100);
                $downloadIcon.show();
                $collapseBtn.html('');
            });
        }
    });

    $panel.data('fullWidth', $panel.width());
    $panel.find('> *:not(.download-icon, .collapse-btn)').hide();

$('head').append(`
<style>
    .pixiv-downloader-panel {
        position: fixed;
        left: 10px;
        top: 10px;
        z-index: 999999;
        background: #f8f8f8;
        color: #333;
        font-size: 14px;
        font-family: ${fontFamily};
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #eee;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: width 0.3s ease-in-out, padding-left: 0.3s ease-in-out, opacity: 0.3s ease-in-out;
        width: auto;
        max-width: 400px;
        overflow: hidden;
        opacity: 0.95;
    }

    .pixiv-downloader-panel.collapsed {
        width: 30px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pixiv-downloader-panel.collapsed > .download-icon {
        display: block;
    }

    .pixiv-downloader-panel.collapsed > *:not(.download-icon, .collapse-btn) {
        display: none !important;
    }

    .pixiv-downloader-panel:not(.collapsed) {
        padding-left: 10px;
    }

    .pixiv-downloader-panel:not(.collapsed) > .download-icon {
        display: none;
    }

    .download-icon {
        font-size: 1.5em;
        color: black;
        cursor: pointer;
        display: block;
    }

    .downloader-title {
        margin: 0 0 10px 0;
        padding: 0;
        font-size: 1.4em;
        font-weight: bold;
        display: block;
        text-align: center;
        width: 100%;
        margin-bottom: 10px;
    }

    .downloader-section {
        margin-bottom: 1px;
        padding-bottom: 1px;
        border-bottom: 1px solid #eee;
        width: 100%;
    }

    .downloader-section:last-child {
        border-bottom: none;
    }

    .downloader-section.single-download-section {
        margin-bottom: 10px;
        padding-bottom: 1px;
        border-bottom: 1px solid #eee;
        width: 100%;
    }

    .section-title {
        margin-top: 0;
        margin-bottom: 5px;
        font-size: 1.1em;
        font-weight: bold;
    }

    .downloader-option {
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        font-size: 0.95em;
        flex-wrap: wrap;
    }

    .downloader-option > span {
        margin-right: 8px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    .downloader-option label {
        display: flex;
        align-items: center;
        margin-right: 10px;
}

    .downloader-option input[type="radio"],
    .downloader-option input[type="checkbox"] {
        margin: 0 5px 0 0;
        flex-shrink: 0;
    }

    .downloader-option input[type="text"],
    .downloader-option select {
        margin-left: 5px;
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
        flex-grow: 1;
        min-width: 0;
    }

    .downloader-btn {
        background-color: #e0e0e0;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 1.em;
        margin-top: 5px;
    }

    .downloader-btn:hover {
        background-color: #d0d0d0;
    }

    .collapse-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1em;
        line-height: 1;
        padding: 0;
        color: #666;
        transition: right 0.3s ease-in-out;
    }

    .pixiv-downloader-panel.collapsed .collapse-btn {
        right: -5px;
    }

    .task-item {
        flex-basis: 100%;
        margin-bottom: 2px;
        padding-bottom: 5px;
    }

    .task-item:last-child {
        border-bottom: none;
    }

    .task-title {
        flex-basis: 100%;
        margin-bottom: 2px;
    }

    .task-status {
        font-size: 0.9em;
        color: #777;
        margin-left: auto;
    }
</style>
`);

    $panel.find('.single-download-btn').off('click').on('click', () => taskPage.start());
    $panel.find('.batch-download-btn').off('click').on('click', () => {
        const selectedScope = $panel.find('select[name="batch_scope"]').val();
        switch (selectedScope) {
            case 'author':
                taskAuthor.start();
                break;
            case 'series':
                taskSeries.start();
                break;
            case 'list':
                taskList.start();
                break;
            case 'favlist':
                taskFavList.start();
                break;
            default:
                try {
                    taskAuthor.check();
                    taskAuthor.start();
                } catch (e) {
                    try {
                        taskSeries.check();
                        taskSeries.start();
                    } catch (e) {
                        try {
                            taskList.check();
                            taskList.start();
                        } catch (e) {
                            try {
                                taskFavList.check();
                                taskFavList.start();
                            } catch (e) {
                                alert(i18n("error_default"));
                            }
                        }
                    }
                }
        }
    });

    $panel.find('.pause-btn').on('click', () => {
        if (taskAuthor.isRunning()) {
            taskAuthor.pause();
        } else if (taskSeries.isRunning()) {
            taskSeries.pause();
        } else if (taskList.isRunning()) {
            taskList.pause();
        } else if (taskFavList.isRunning()) {
            taskFavList.pause();
        }
    });
    $panel.find('.resume-btn').on('click', () => {
        if (taskAuthor.isPaused()) {
            taskAuthor.resume();
        } else if (taskSeries.isPaused()) {
            taskSeries.resume();
        } else if (taskList.isPaused()) {
            taskList.resume();
        } else if (taskFavList.isPaused()) {
            taskFavList.resume();
        }
    });
    $panel.find('.cancel-btn').on('click', () => {
        if (taskAuthor.isRunning() || taskAuthor.isPaused()) {
            taskAuthor.cancel();
        } else if (taskSeries.isRunning() || taskSeries.isPaused()) {
            taskSeries.cancel();
        } else if (taskList.isRunning() || taskList.isPaused()) {
            taskList.cancel();
        } else if (taskFavList.isRunning() || taskFavList.isPaused()) {
            taskFavList.cancel();
        }
    });
})();