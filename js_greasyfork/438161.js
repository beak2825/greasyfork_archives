// ==UserScript==
// @name         DoubanSearch
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RT
// @author       Pidanmeng
// @grant        GM_openInTab
// @match        *
// @include      *
// @grant        none
// ==/UserScript==

//豆瓣电影搜索助手
// 配置参数

let ev = null;
var text = window.getSelection().toString().trim();

document.addEventListener('mouseup', function (e) {
    ev = e;//划词鼠标结束位置
});

const SettingOptions = {
    defaultsearchengine: "db",      // 默认搜索引擎
    searchPattern: "automatic",     // 搜索模式
    selectPattern: "select",        // 划词模式
    selectKey: "Ctrl",              // 划词键
    selectIconPosition: "right",    // 划词图标位置
};

// 图标
const Images = {
    IconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAIAAABoJHXvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQjkwRDlGOTgyM0YxMUUyOTYyNEE4NkVDQjBDRTBENSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQjkwRDlGQTgyM0YxMUUyOTYyNEE4NkVDQjBDRTBENSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJCOTBEOUY3ODIzRjExRTI5NjI0QTg2RUNCMENFMEQ1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJCOTBEOUY4ODIzRjExRTI5NjI0QTg2RUNCMENFMEQ1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EQTxdwAAEetJREFUeNrsXQt4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',
    DbSvg: '<svg t="1634541962091" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2799" width="16" height="16"><path d="M701.44 519.168l-382.976 0 0-191.488 382.976 0 0 191.488zM877.568 69.632q34.816 0 59.392 24.064t24.576 59.904l0 731.136q0 34.816-24.576 59.392t-59.392 24.576l-732.16 0q-34.816 0-58.88-24.576t-24.064-59.392l0-731.136q0-35.84 24.064-59.904t58.88-24.064l732.16 0zM187.392 197.632l648.192 0 0-63.488-648.192 0 0 63.488zM253.952 263.168l0 318.464 512 0 0-318.464-512 0zM857.088 774.144l-176.128 0 62.464-111.616-70.656-53.248q-5.12 12.288-9.216 23.552t-9.728 23.552-11.776 23.552q-17.408 29.696-31.744 57.856t-19.456 36.352l-158.72 0q-4.096-8.192-18.432-36.352t-31.744-57.856q-7.168-11.264-12.288-23.552t-9.216-23.552-9.216-23.552l-70.656 53.248 62.464 111.616-176.128 0 0 65.536 690.176 0 0-65.536z" p-id="2800" fill="#4da64d"></path></svg>',
        ImdbSvg: '<svg t="1634544643843" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3906" width="16" height="16"><path d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96zM106.6 458.4H106c0.2-0.2 0.4-0.6 0.6-0.8zM258 639.6H192V384h66z m226.4 0h-57.4v-172.8l-23.2 172.8h-41.2l-24.4-169v169h-58V384h85.6c6.6 39.6 12 79.8 17.4 119.8l15.2-119.8h86z m22.8 0V384h49.2c35.2 0 89.4-3.2 98 41.8 3.4 15.2 2.8 32.6 2.8 48.8 0 177 22.2 165.2-150 165z m321.8-58.4c0 31.4-4.8 61.8-44.4 61.8-18 0-30.4-6-41.8-19.6l-3.8 16.2h-59.6V384h63.4v83.4c12-13 24-18.4 41.8-18.4 42.8 0 44.4 25.6 44.4 60.2zM594 459.8c0-19.4 3.2-32-20.6-32v167.4c24.4 0.6 20.6-17.4 20.6-36.8z m171 52.2c0-10.8 2.2-25.4-12.4-25.4-12 0-9.8 17.8-9.8 25.4 0 1.2-2.2 79.2 2.2 89.4 1.6 3.2 4.4 4.8 7.6 4.8 15.6 0 12.4-18 12.4-28.8z" p-id="3907" fill="#f4ea2a"></path></svg>',
    MovieIconBase64: 'data:image/png;base64,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',
    BookIconBase64: 'data:image/png;base64,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',
    VideoDefaultImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABbCAYAAAAsuui4AAAAAXNSR0IArs4c6QAAA3VJREFUeAHtmw1PMjEQhIuACEII//9PGuUbhdenl2kOEol8bI2vswl3ba8t3enMbrlo5/X19ZD+uD38cf+z+wbhEwaDYBCaYGAmmAlmQoOAmWAmmAkFAcvBcihk8DnBcrAcLIeCgOVgORQyODtYDpaD5VAQsBwsh0IGZwfLwXKwHAoClkMDRa+NSM3y+/t72m63ab/fp263mwaDQXp4+Jk4/SMgrNfrtFwujzCnbTwep36/f9Reo1Id+o+PjwwAuz+dTtNsNkuTyST7Op/P0+FQ/88lqoEA7VerVcJR7Pn5Ocug0+nk3R8OhxmAxWKRdrtd7lPrUkUOOHW6yzChbb1esxTiBJ/Hx8cMFCBFWzgI0JvdxaC9nD11DlCQBv2JFwBB36enp2gMYv9IA4c2m03OANCdoIfzpwDgpdrJEEiFusZGoxAWEwAACSgLnNL/nGMAAAsIoi8vL4nMEWlhcmAXiQXkf1hw6RkANiiTACQgRqXPMBDQNMaO3hLtAREQYMOvA4GUiCko5soNF1gRZWFMgAGwQQehWxx4e3srWeWWeb4aGwaCAiGxQOWvFnGuXQy4ZY5z8/MsHAScwAFYwY8mdE0djQMQ5wDKyIcy/YkhMIkDUw0QwlKkdk5O4BjOUsdhymQQjLuA4DllBVON13x5wJ0vYUxQSpQTOiixw2KA+pABAIY6z2EEd0zj1ffO/ufpwkDgwMPuyQmozUc2Go1UPDoaCwg9ZDxtzBdlYXJgwW0QrnUAhkRKgXWFgiAK48g1xjiO378aBC1ekrgUCI3TPJeO/27/UCZo8XLmu4tSP43TPGq/9z0sMLJQLV7OQG/OC8iEIMm5gQ/9yB48ow/P6KNxktW9ndd8oUwgoredwSl+DPGaDeMsQB3nMdqpy3kA0Ry5Q9AllAmsmV1mtzExQAzhzq7rTEAZALTzlNU3TxB0qQICO86u4hCv1WU4zUfGewcZWYExUT+f9T3cq4DAF0H5tsO0nTMdm/8LJuC4tI7eLzHiwSXAXTJ3u2+nxj+Htl+4tr/8XFnxQ/HhXN9bn4XLgQWyozVenV8LRmiKvHZRtccZhE/EDYJBaIRnJpgJZkKDgJlgJpgJBQHLwXIoZPA5wXKwHCyHgoDlYDkUMjg7WA6Wg+VQELAcLIdCBmcHy8FysBwKApaD5VDI4OxgOTRk+AcCjnlZW2tDmAAAAABJRU5ErkJggg==',
}

// 链接
const Urls = {
    DbMoviePageUrl: 'https://movie.douban.com',
    ImDbVideoPageUrl: 'https://www.imdb.com',
    DbVideoInfoPageUrl: 'https://movie.douban.com/subject/{subjectId}',                 // 豆瓣视频详情页面
    DbBookPageUrl: 'https://book.douban.com',
    DbBookInfoPageUrl: 'https://book.douban.com/subject/{subjectId}',                   // 豆瓣读书详情页面
    ImdbVideoInfoPageUrl: 'https://www.imdb.com/title/{imdbId}',                        // imdb 视频详情页面
    DbVideoSearchResultPageUrl: 'https://www.douban.com/search?cat=1002&q={title}',     // 豆瓣电影搜索结果页面
    DbBookSearchResultPageUrl: 'https://www.douban.com/search?cat=1001&q={title}',      // 豆瓣读书搜索结果页面
    MovieSearchResultPageUrl: 'https://movie.douban.com/subject_search?search_text={title}',
    BookSearchResultPageUrl: 'https://book.douban.com/subject_search?search_text={title}',
    DbVideoSearchApiUrl: 'https://www.douban.com/j/search?q={title}&cat=1002',          // 豆瓣电影官方搜索接口
    DbBookSearchApiUrl: 'https://www.douban.com/j/search?q={title}&cat=1001',           // 豆瓣读书官方搜索接口
    IframePageHost: 'https://yyy.rth1.me',                                              // 取词遮罩地址 使用的热铁盒网页托管
    ImgHandleUrl: 'https://images.weserv.nl/?url={url}',                                // 图片处理接口 可以缓存、修改图片尺寸等 本脚本用来防止图片跨域
    DbImdbApiUrl: 'https://movie.querydata.org/api?id={subjectId}',                     // 可以获取豆瓣-imdb-烂番茄信息的聚合接口 api来自https://github.com/iiiiiii1/douban-imdb-api
}

const Logger = {
    debug: console.debug,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
}

const Utils = {
    /**
         * 字符串模板格式化
         * @param {string} formatStr - 字符串模板
         * @returns {string} 格式化后的字符串
         * @example
         * Utils.StringFormat("ab{0}c{1}ed",1,"q")  output "ab1cqed"
         */
    StringFormat: function (formatStr) {
        let args = arguments;
        return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
            i = parseInt(i);
            return args[i + 1];
        });
    },

    /**
         * 日期格式化
         * @param {Date} date - 日期
         * @param {string} formatStr - 格式化模板
         * @returns {string} 格式化日期后的字符串
         * @example
         * Utils.DateFormat(new Date(),"yyyy-MM-dd")  output "2020-03-23"
         * @example
         * Utils.DateFormat(new Date(),"yyyy/MM/dd hh:mm:ss")  output "2020/03/23 10:30:05"
         */
    DateFormat: function (date, formatStr) {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(formatStr)) {
                formatStr = formatStr.replace(
                    RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return formatStr;
    },

    // 获取配置参数
    GetSettingOptions: function () {
        let optionsJson = GM_getValue("db-search-options") || "";
        if (optionsJson != "") {
            let optionsData = JSON.parse(optionsJson);
            for (let key in SettingOptions) {
                if (SettingOptions.hasOwnProperty(key) && optionsData.hasOwnProperty(key)) {
                    SettingOptions[key] = optionsData[key];
                }
            }
        }
        return SettingOptions;
    },

    // 设置配置参数
    SetSettingOptions: function () {
        let optionsJson = JSON.stringify(SettingOptions);
        GM_setValue("db-search-options", optionsJson);
    },

    /**
         * 人员格式化
         * @param {Array} personList - 人员数组
         * @param {Number} len - 需要的数量
         * @returns {String} 格式化后的字符串
         * @example
         * Utils.FmtDbPerson([{name: '张 zhang'},{name:  '王 wang'},{name:  '李 li'}],2) output "张/王"
         * Utils.FmtDbPerson([{data: [{name: '张'}]},{data: [{name: '王'}]},{data: [{name: '李'}]}],2) output "张/王"
         */
    FmtDbPerson: function (personList, len) {
        if (personList && personList.length > 0) {
            if (len && personList.length > len) {
                personList = personList.slice(0, len);
            }
            let nameArr = [];
            personList.forEach((item) => {
                if (item.hasOwnProperty('data')) { // db2使用
                    nameArr.push(item.data[0].name);
                } else {
                    nameArr.push(item.name.split(' ')[0]); // db使用
                }
            })
            return nameArr.join(' / ');
        }
        return '';
    },

    /**
         * 解析视频列表 dom 元素
         * @param {Document} htmlDoc - 视频列表dom
         * @param {String} selector - 选择器
         * @returns {[VideoInfo]} 视频列表数组
         * @example
         * Utils.ParseVideoListDom(document.getElementById('a'),'li') output [{videoInfo},{videoInfo},...]
         */
    ParseVideoListDom: function (htmlDoc, selector) {
        let videoList = [];
        let bookList = [];
        if (htmlDoc) {
            let liDoc = $(htmlDoc).find(selector);
            liDoc.each((index, item) => {
                let titleADom = $(item).find('.title a');
                let title = titleADom.html() || '';
                let onclickStr = titleADom.attr("onclick"); // moreurl(this,{i: '14', query: 'hh', from: 'dou_search_movie', sid: 25741647, qcat: '1002'})
                let id = 0;
                if (onclickStr) {
                    id = onclickStr.split(',')[4].replace(/[^0-9]/ig, '');
                }
                let image = $(item).find('img').attr("src");
                let cast = ($(item).find('.subject-cast').html() || '').replace('/  / ', '/').replace(/原名:(.*?)\//g, '');
                let socreDoc = $(item).find('.rating_nums');
                let score = socreDoc.html() || '';
                let ratingCount = '';
                if (score && socreDoc.next() && socreDoc.next().html()) {
                    let count = socreDoc.next().html().replace(/[^0-9]/ig, '');
                    if (count) {
                        ratingCount = `${count} 人参与评分`;
                    }
                }
                let videoInfo = {
                    subjectId: id,
                    image: Urls.ImgHandleUrl.replace('{url}', encodeURIComponent(image)),
                    url: Urls.DbVideoInfoPageUrl.replace('{subjectId}', id),
                    description: $(item).find('p').html() || '',
                    title, score, ratingCount, cast: cast,
                }
                videoList.push(videoInfo);
                let bookInfo = {
                    subjectId: id,
                    image: Urls.ImgHandleUrl.replace('{url}', encodeURIComponent(image)),
                    url: Urls.DbBookInfoPageUrl.replace('{subjectId}', id),
                    description: $(item).find('p').html() || '',
                    title, score, ratingCount, cast: cast,
                }
                bookList.push(bookInfo);
            });
        }
        return videoList;
    },

    /**
         * 解析String 为 dom 元素
         * @param {String} text - 文档字符
         * @returns {Document} 文档对象
         * @example
         * Utils.ParseDomFromString('<div>a</div>') output Document
         */
    ParseDomFromString: function (text) {
        if (!text) {
            return new Document();
        }

        let parser = new DOMParser();
        return parser.parseFromString(text, "text/html");
    },
    //查找第5次出现/索引
    findStrIndex: function(str, cha, num) {
        var x = str.indexOf(cha);
        for (var i = 0; i < num-1; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    },
}

// 随机因子 用于元素属性后缀 以防止属性名称重复
const randomCode = Utils.DateFormat(new Date(), "yyMM").toString() + (Math.floor(Math.random() * 900000) + 100000).toString();

// 豆瓣搜索引擎1 爬虫模式
const DoubanMovieSearchByDom = {
    code: "db",
    codeText: "豆瓣",
    SearchVideoList: function (title) {
        return new Promise((resolve, reject) => {
            if (!title) {
                resolve([]);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: Urls.DbVideoSearchResultPageUrl.replace('{title}', encodeURIComponent(title)),
                onload: function (response) {
                    let videoList = [];
                    if (response.status == 200) {
                        let htmlDoc = Utils.ParseDomFromString(response.responseText);
                        videoList = Utils.ParseVideoListDom(htmlDoc, '.result-list .result');
                    } else {
                        Logger.warn('查询失败，title：' + title, response.statusText);
                    }

                    resolve(videoList);
                }
            });
        })
    },
    SearchVideoInfo: function (subjectId) {
        let self = this;
        return new Promise((resolve, reject) => {
            if (!subjectId) {
                resolve(null);
            }

            let url = Urls.DbVideoInfoPageUrl.replace('{subjectId}', subjectId);
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status == 200) {
                        let doubanInfo = {};
                        let htmlDoc = Utils.ParseDomFromString(response.responseText);

                        if (htmlDoc) {
                            let ldJsonDb = $(htmlDoc).find('script[type="application/ld+json"]');
                            let ldJsonDbOthers = $(htmlDoc).find('meta[name="keywords"]'); //中文标题
                            let ldJsonDbScri = $(htmlDoc).find('span[property="v:summary"]');
                            let ldJsonDbAttrs = $(htmlDoc).find('span[class="attrs"]');
                            let ldJsonDbDirector = ldJsonDbAttrs[0].innerText;
                            
                            if(ldJsonDbAttrs[2]) {
                                if(ldJsonDbAttrs[2].innerText.split('/').length > 7) {
                                    ldJsonDbAttrs = ldJsonDbAttrs[2].innerText.slice(0, Utils.findStrIndex(ldJsonDbAttrs[2].innerText, "/", 6)) + "/ 更多…"
                                } else {
                                    ldJsonDbAttrs = ldJsonDbAttrs[2].innerText;
                                }
                            } else {
                                ldJsonDbAttrs =ldJsonDbAttrs[1].innerText;
                            }
                            if (ldJsonDb && ldJsonDb.length > 0 && ldJsonDb[0].innerText) {
                                try {
                                    doubanInfo = JSON.parse(ldJsonDb[0].innerText.replace(/\r\n/g, '').replace(/\n/g, ''));
                                    //console.log(htmlDoc);
                                    let videoInfo = {
                                        //title: doubanInfo.name,
                                        title: ldJsonDbOthers[0].content.split(',')[0],
                                        image: Urls.ImgHandleUrl.replace('{url}', encodeURIComponent(doubanInfo.image)),
                                        url: Urls.DbMoviePageUrl + doubanInfo.url,
                                        //description: doubanInfo.description,
                                        description: ldJsonDbScri[0].innerText.replace(/\r\n/g, '').replace(/\n/g, '').trim(),
                                        //director: Utils.FmtDbPerson(doubanInfo.director, 2),
                                        director: ldJsonDbDirector,
                                        //actor: Utils.FmtDbPerson(doubanInfo.actor, 6),
                                        actor: ldJsonDbAttrs,
                                        score: doubanInfo.aggregateRating.ratingValue,
                                        ratingCount: doubanInfo.aggregateRating.ratingCount,
                                        genre: doubanInfo.genre.join(' / '),
                                        time: doubanInfo.datePublished,
                                    }

                                    // 获取imdbId
                                    let imdb_anchor = $(htmlDoc).find('#info span.pl:contains("IMDb")');
                                    if (imdb_anchor && imdb_anchor.length > 0) {
                                        let imdbId = imdb_anchor[0].nextSibling.nodeValue.trim();
                                        if (imdbId) {
                                            videoInfo.imdbId = imdbId;
                                            videoInfo.imdbUrl = Urls.ImdbVideoInfoPageUrl.replace('{imdbId}', imdbId);

                                            self.SearchImdbRating(imdbId);
                                        }
                                    }

                                    resolve(videoInfo);
                                } catch (e) {
                                    Logger.log('解析失败', ldJsonDb[0].innerText, e)
                                }
                            }
                        }
                    } else {
                        Logger.warn(response.statusText);
                    }

                    resolve(null);
                }
            });
        });
    },

    // 查询imdb评分 直接替换dom 不是太好的解决方案
    SearchImdbRating: function (imdbId) {
        GM_xmlhttpRequest({
            method: "GET",
            url: Urls.ImdbVideoInfoPageUrl.replace('{imdbId}', imdbId),
            onload: function (response) {
                if (response.status == 200) {
                    let imdbHtmlDoc = Utils.ParseDomFromString(response.responseText);
                    let ldJsonImdb = $(imdbHtmlDoc).find('head > script[type="application/ld+json"]');

                    if (ldJsonImdb && ldJsonImdb.length > 0 && ldJsonImdb[0].innerText) {
                        let select = Utils.StringFormat('.videoInfo{0} #imdbScore{0}_' + imdbId, randomCode);
                        let imdbDom = $(select);
                        try {
                            let imdbInfo = JSON.parse(ldJsonImdb[0].innerText.replace(/\r\n/g, '').replace(/\n/g, ''));
                            let imdbScore = '';
                            let imdbRatingCount = '';
                            if (imdbInfo && imdbInfo.aggregateRating) {
                                let imdbRating = imdbInfo.aggregateRating.ratingValue;
                                //imdbRatingCount = imdbInfo.aggregateRating.ratingCount || 0;
                                imdbRatingCount = imdbInfo.aggregateRating.ratingCount || '';
                                imdbScore = imdbRating ? imdbRating.toFixed(1) : '';
                            }
                            // 替换评分
                            if (imdbDom) {
                                if (imdbScore) {
                                    //imdbDom.removeClass(Utils.StringFormat('loading{0}', randomCode));
                                    imdbDom.html(imdbScore);
                                    //imdbDom.html(imdbScore + " " + imdbRatingCount);
                                    //imdbDom.parents('a').attr('title', `${imdbRatingCount}`);
                                    imdbDom.next().html("(" + imdbRatingCount + ")");
                                    //console.log(imdbDom.next().text());
                                }
                            }
                        } catch (e) {
                            Logger.log('解析失败', ldJsonImdb[0].innerText, e);
                            if (imdbDom) {
                                imdbDom.parents('a').remove();
                            }
                        }
                    }
                }
            }
        })
    }
};

//豆瓣搜索引擎2 使用api 接口评分不太准确 有imdb评分
const DoubanSearchByApi = {
    code: "db2",
    codeText: "豆瓣2",
    SearchVideoList: function (title) {
        return new Promise((resolve, reject) => {
            if (!title) {
                return resolve([]);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: Urls.DbVideoSearchApiUrl.replace('{title}', encodeURIComponent(title)),
                onload: function (response) {
                    let videoList = [];
                    if (response.status == 200) {
                        let responseText = response.responseText;
                        let fmtText = responseText.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\\/g, '');
                        let match = fmtText.match(/{"items":(.*?),"total":(\d+),"limit":(\d+),"more":(.*?)}/);
                        if (match && match[1]) {
                            let htmlDoc = Utils.ParseDomFromString(match[1]);
                            videoList = Utils.ParseVideoListDom(htmlDoc, '.result');
                        }
                    } else {
                        Logger.warn(response.statusText);
                    }
                    resolve(videoList);
                }
            });
        })
    },
    SearchVideoInfo: function (subjectId) {
        return new Promise((resolve, reject) => {
            if (!subjectId) {
                resolve(null);
            }

            let url = Urls.DbImdbApiUrl.replace('{subjectId}', subjectId);
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status == 200) {
                        let doubanInfo = JSON.parse(response.responseText);
                        if (doubanInfo && doubanInfo.data) {
                            let data = doubanInfo.data[0];
                            let videoInfo = {
                                title: data.name,
                                image: data.poster,
                                url: Urls.DbVideoInfoPageUrl.replace('{subjectId}', doubanInfo.doubanId),
                                //description: data.description.slice(0, 100) + "…",
                                description: data.description,
                                director: Utils.FmtDbPerson(doubanInfo.director, 2),
                                actor: Utils.FmtDbPerson(doubanInfo.actor, 6),
                                score: doubanInfo.doubanRating,
                                ratingCount: doubanInfo.doubanVotes,
                                imdbScore: doubanInfo.imdbRating,
                                imdbRatingCount: doubanInfo.imdbVotes,
                                imdbUrl: Urls.ImdbVideoInfoPageUrl.replace('{imdbId}', doubanInfo.imdbId),
                                genre: data.genre,
                                time: Utils.DateFormat(new Date(doubanInfo.dateReleased), "yyyy-MM-dd"),
                            }
                            resolve(videoInfo);
                        }
                    } else {
                        Logger.warn(response.statusText);
                    }
                    resolve(null);
                }
            });
        });
    },
};

// 豆瓣读书搜索引擎1 爬虫模式
const DoubanBookSearchByDom = {
    code: "db",
    codeText: "豆瓣",
    SearchBookList: function (title) {
        return new Promise((resolve, reject) => {
            if (!title) {
                resolve([]);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: Urls.DbBookSearchResultPageUrl.replace('{title}', encodeURIComponent(title)),
                onload: function (response) {
                    let bookList = [];
                    if (response.status == 200) {
                        let htmlDoc = Utils.ParseDomFromString(response.responseText);
                        bookList = Utils.ParseVideoListDom(htmlDoc, '.result-list .result');
                    } else {
                        Logger.warn('查询失败，title：' + title, response.statusText);
                    }

                    resolve(bookList);
                }
            });
        })
    },
    SearchBookInfo: function (subjectId) {
        let self = this;
        return new Promise((resolve, reject) => {
            if (!subjectId) {
                resolve(null);
            }

            let url = Urls.DbBookInfoPageUrl.replace('{subjectId}', subjectId);
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status == 200) {
                        let doubanInfo = {};
                        let htmlDoc = Utils.ParseDomFromString(response.responseText);

                        if (htmlDoc) {
                            let ldJsonDb = $(htmlDoc).find('script[type="application/ld+json"]');
                            let ldJsonDbImg = $(htmlDoc).find('meta[property="og:image"]');
                            let ldJsonDbScri = $(htmlDoc).find('meta[property="og:description"]');
                            let ldJsonDbAuth = $(htmlDoc).find('meta[property="book:author"]');
                            let ldJsonDbOthers = $(htmlDoc).find('meta[name="keywords"]');
                            let ldJsonDbScore = $(htmlDoc).find('strong[property="v:average"]');
                            let ldJsonDbCount = $(htmlDoc).find('span[property="v:votes"]');
                            if (ldJsonDb && ldJsonDb.length > 0) {
                                try {
                                    doubanInfo = JSON.parse(ldJsonDb[0].innerText.replace(/\r\n/g, '').replace(/\n/g, ''));

                                    let bookInfo = {
                                        title: doubanInfo.name,
                                        image: Urls.ImgHandleUrl.replace('{url}', encodeURIComponent(ldJsonDbImg[0].content)),
                                        url: doubanInfo.url,
                                        //description: ldJsonDbScri[0].content.slice(0, 100) + "…",
                                        description: ldJsonDbScri[0].content,
                                        author: ldJsonDbAuth[0].content,
                                        score: ldJsonDbScore[0].innerText,
                                        ratingCount: ldJsonDbCount[0].innerText,
                                        //genre: doubanInfo.genre.join(' / '),
                                        publisher: ldJsonDbOthers[0].content.split(',简介')[0].split(',')[ldJsonDbOthers[0].content.split(',简介')[0].split(',').length-2].split(',')[0],
                                        orignal: '',
                                        translator: '',
                                        time:  ldJsonDbOthers[0].content.split(',简介')[0].split(',')[ldJsonDbOthers[0].content.split(',简介')[0].split(',').length-1],
                                    }

                                    resolve(bookInfo);
                                } catch (e) {
                                    Logger.log('解析失败', ldJsonDb[0].innerText, e)
                                }
                            }
                        }
                    } else {
                        Logger.warn(response.statusText);
                    }

                    resolve(null);
                }
            });
        });
    },
};

const SearchMovie = {
    searchEngineList: {},       // 搜索引擎实例列表
    searchEngine: "",           // 当前搜索引擎。 db:豆瓣
    searchEngineObj: {},        // 当前搜索引擎实例
    searchText: "",             // 被搜索内容
    searchVideoList: [],        // 当前搜索视频列表
    searchVideoInfo: null,      // 当前搜索视频内容
    searchSelectTitle: '',      // 列表选中的视频标题
    Execute: function (h_onloadfn) {
        this.ResetSearchResult();
        let title = this.searchText;
        this.searchEngineObj.SearchVideoList(title).then((videoList) => {
            this.searchVideoList = videoList;
            if (SettingOptions.searchPattern == 'automatic') {
                if (videoList && videoList.length > 0) {
                    let subjectId = videoList[0].subjectId
                    // 如果在列表中选择过视频，切换引擎后重新选中该视频
                    if (this.searchSelectTitle) {
                        try {
                            videoList.forEach((v, i) => {
                                if (v && v.title == this.searchSelectTitle) {
                                    subjectId = v.subjectId;
                                    throw new Error('EndForEach');
                                }
                            })
                        } catch (e) {
                            if (e.message != 'EndForEach') {
                                Logger.error(e);
                            }
                        }
                    }

                    this.searchEngineObj.SearchVideoInfo(subjectId).then((result) => {
                        this.searchVideoInfo = result;
                        h_onloadfn();
                    });
                } else {
                    h_onloadfn();
                }
            } else if (SettingOptions.searchPattern == 'manual') {
                h_onloadfn();
            }
        });
    },
    UpdateVideoInfo: function (subjectId, h_onloadfn) {
        this.searchVideoInfo = null;

        this.searchEngineObj.SearchVideoInfo(subjectId).then((result) => {
            this.searchVideoInfo = result;
            h_onloadfn();
        })
    },
    Update: function () {
        this.ResetSearchResult();
        this.searchEngineObj = this.searchEngineList[this.searchEngine];
    },
    Clear: function () {
        this.searchEngine = "";
        this.searchText = "";
        this.searchVideoList = [];
        this.searchVideoInfo = null;
    },
    ResetSearchResult: function () {
        this.searchVideoInfo = null;
        this.searchVideoList = [];
    },
    //注册搜索引擎接口并执行搜索引擎的初始化接口
    RegisterEngine: function () {
        /**
             * 搜索引擎必须提供以下接口
                code:"",                                    // 代号
                codeText:"",                                // 代号描述
                SearchVideoList: function (title) {},       // 返回视频列表
                SearchVideoInfo: function (subjectId) {},   // 返回视频信息
                init:function(){},                          // 可选，初始化接口，在脚本创建时立即执行
             */
        const searchEngineListObj = {};
        searchEngineListObj[DoubanMovieSearchByDom.code] = DoubanMovieSearchByDom;
        searchEngineListObj[DoubanSearchByApi.code] = DoubanSearchByApi;

        this.searchEngineList = searchEngineListObj;
        for (let key in this.searchEngineList) {
            if (this.searchEngineList.hasOwnProperty(key) && this.searchEngineList[key].hasOwnProperty("init")) {
                this.searchEngineList[key].init();
            }
        }
    }
};

const SearchBook = {
    searchEngineList: {},       // 搜索引擎实例列表
    searchEngine: "",           // 当前搜索引擎。 db:豆瓣
    searchEngineObj: {},        // 当前搜索引擎实例
    searchText: "",             // 被搜索内容
    searchBookList: [],        // 当前搜索视频列表
    searchBookInfo: null,      // 当前搜索视频内容
    searchSelectTitle: '',      // 列表选中的视频标题
    Execute: function (h_onloadfn) {
        this.ResetSearchResult();
        let title = this.searchText;
        this.searchEngineObj.SearchBookList(title).then((bookList) => {
            this.searchBookList = bookList;
            if (SettingOptions.searchPattern == 'automatic') {
                if (bookList && bookList.length > 0) {
                    let subjectId = bookList[0].subjectId
                    // 如果在列表中选择过视频，切换引擎后重新选中该视频
                    if (this.searchSelectTitle) {
                        try {
                            bookList.forEach((v, i) => {
                                if (v && v.title == this.searchSelectTitle) {
                                    subjectId = v.subjectId;
                                    throw new Error('EndForEach');
                                }
                            })
                        } catch (e) {
                            if (e.message != 'EndForEach') {
                                Logger.error(e);
                            }
                        }
                    }

                    this.searchEngineObj.SearchBookInfo(subjectId).then((result) => {
                        this.searchBookInfo = result;
                        h_onloadfn();
                    });
                } else {
                    h_onloadfn();
                }
            } else if (SettingOptions.searchPattern == 'manual') {
                h_onloadfn();
            }
        });
    },
    UpdateBookInfo: function (subjectId, h_onloadfn) {
        this.searchBookInfo = null;

        this.searchEngineObj.SearchBookInfo(subjectId).then((result) => {
            this.searchBookInfo = result;
            h_onloadfn();
        })
    },
    Update: function () {
        this.ResetSearchResult();
        this.searchEngineObj = this.searchEngineList[this.searchEngine];
    },
    Clear: function () {
        this.searchEngine = "";
        this.searchText = "";
        this.searchBookList = [];
        this.searchBookInfo = null;
    },
    ResetSearchResult: function () {
        this.searchBookInfo = null;
        this.searchBookList = [];
    },
    //注册搜索引擎接口并执行搜索引擎的初始化接口
    RegisterEngine: function () {
        /**
             * 搜索引擎必须提供以下接口
                code:"",                                    // 代号
                codeText:"",                                // 代号描述
                SearchVideoList: function (title) {},       // 返回视频列表
                SearchVideoInfo: function (subjectId) {},   // 返回视频信息
                init:function(){},                          // 可选，初始化接口，在脚本创建时立即执行
             */
        const searchEngineListObj = {};
        searchEngineListObj[DoubanBookSearchByDom.code] = DoubanBookSearchByDom;

        this.searchEngineList = searchEngineListObj;
        for (let key in this.searchEngineList) {
            if (this.searchEngineList.hasOwnProperty(key) && this.searchEngineList[key].hasOwnProperty("init")) {
                this.searchEngineList[key].init();
            }
        }
    }
};

// 面板
const Panel = {
    popBoxEl: {},
    Create: function (title, placement, isShowArrow, content, shownFn) {
        let self = this;
        $(self.popBoxEl).jPopBox({
            title: title,
            className: 'JPopBox-tip-white',
            placement: placement,
            trigger: 'none',
            isTipHover: true,
            isShowArrow: isShowArrow,
            content: function () {
                return Utils.StringFormat('<div id="panelBody{0}">{1}</div>', randomCode, content);
            }
        });
        $(self.popBoxEl).on("shown.jPopBox", function () {
            let $panel = $("div.JPopBox-tip-white");
            typeof shownFn === 'function' && shownFn($panel);
        });
        $(self.popBoxEl).jPopBox('show');
    },
    Update: function (Fn) {
        let $panel = $("div.JPopBox-tip-white");
        Fn($panel);
    },
    Destroy: function () {
        $(this.popBoxEl).jPopBox("destroy");
    },
    CreateStyle: function () {
        let s = "";
        s += Utils.StringFormat("#panelBody{0}>div input,#panelBody{0}>div select{padding:3px;margin:0;background:#fff;font-size:14px;border:1px solid #a9a9a9;color:black;width:auto;height:25px;display:inline-block;position: static;}#panelBody{0} a{text-decoration:none;border-bottom:0;color:#494949}", randomCode);
        s += Utils.StringFormat("#panelBody{0} .head{0}{display:flex;align-items:center;height:30px}#panelBody{0} .logo{0}{width:75px;margin:0;vertical-align:bottom}#panelBody{0} .text{0}{margin:10px 0 0 10px;color:#388e8e;font-size:10px;cursor:pointer;opacity:0.6}#panelBody{0} .listBtn{0}{margin:10px 0 0 1px;color:#999;font-size:10px;cursor:pointer}", randomCode);
        s += Utils.StringFormat("#panelBody{0} .content{0} .noData{0}{margin:30px 40%}#panelBody{0} .content{0} .loading{0}{border:5px solid #f3f3f3;border-radius:50%;border-top:5px solid #3498db;width:30px;height:30px;animation:db_search_turn{0} 2s linear infinite;margin:20px;margin-left:45%}", randomCode);
        //s += Utils.StringFormat("#panelBody{0} .score{0}{position:absolute;top:5px;right:5px;display:flex;align-items:center;column-gap:10px}#panelBody{0} .score{0}>a{display:flex;align-items:center}#panelBody{0} .score{0} svg{background:0}#panelBody{0} .score{0} span{font-size:30px}#panelBody{0} .score{0} span.loading{0}{border:3px solid #f3f3f3;border-radius:50%;border-top:3px solid #3498db;width:20px;height:20px;animation:db_search_turn{0} 2s linear infinite;margin:5px;display:inline-block}", randomCode);
        s += Utils.StringFormat("#panelBody{0} .info{0} .title{0}{font-size:18px;font-weight:bold;margin:5px 0}#panelBody{0} .score{0}{position:absolute;right:15px;display:flex;align-items:center;column-gap:5px}#panelBody{0} .score{0}>a{display:flex;align-items:center}#panelBody{0} .score{0} svg{background:0;padding-bottom:1px;padding-right:3px}#panelBody{0} .score{0} .iscore{0}{font-size:18px}#panelBody{0} .score{0} .count{0}{font-size:8px;padding-top:3px;padding-left:2px;}#panelBody{0} .score{0} span.loading{0}{border:3px solid #f3f3f3;border-radius:50%;border-top:3px solid #3498db;width:20px;height:20px;animation:db_search_turn{0} 2s linear infinite;margin:5px;display:inline-block}#panelBody{0} .info{0} .left{0}{float:left;margin:3px 5px 0 0;display:block;position:relative;width:120px;height:168px;background-repeat:no-repeat;background-position:50%;background-image:url({1});background-size:100%}#panelBody{0} .info{0} .left{0}>img{width:120px;height:168px}#panelBody{0} .info{0} .right{0}{min-height:175px;padding-left:132px}#panelBody{0} .info{0} .right{0} .item{0}>span{color:#666}", randomCode, Images.VideoDefaultImg);
        //s += Utils.StringFormat("#panelBody{0} .list{0}{overflow:auto;height:200px;margin-top:5px}#panelBody{0} .list{0}::-webkit-scrollbar{display:none}#panelBody{0} .list{0} .listItem{0}{margin-top:5px;height:70px;position:relative}#panelBody{0} .listItem{0} .left{0}{float:left;margin-right:5px;display:block;position:relative;width:48px;height:68px;background-repeat:no-repeat;background-position:50%;background-image:url({1});background-size:100%}#panelBody{0} .listItem{0} .left{0}>img{width:48px;height:68px}#panelBody{0} .listItem{0} .right{0} .title{0}{width:320px;font-size:18px;margin-bottom:9px;font-weight:bold;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;word-break:break-all}#panelBody{0} .listItem{0} .right{0} .score{0}{position:absolute;right:5px;top:0;font-size:25px}#panelBody{0} .listItem{0} .right{0} .info{0}{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;word-break:break-all;font-size:12px;border:0}", randomCode, Images.VideoDefaultImg);
        s += Utils.StringFormat("#panelBody{0} .list{0}{overflow:auto;height:200px;margin-top:5px}#panelBody{0} .list{0}::-webkit-scrollbar{display:none}#panelBody{0} .list{0} .listItem{0}{margin-top:5px;height:70px;position:relative;padding-top:5px;padding-bottom:5px;}#panelBody{0} .listItem{0} .left{0}{float:left;margin-right:5px;display:block;position:relative;width:48px;height:68px;background-repeat:no-repeat;background-position:50%;background-image:url({1});background-size:100%}#panelBody{0} .listItem{0} .left{0}>img{width:48px;height:68px}#panelBody{0} .listItem{0} .right{0}{padding-left:60px}#panelBody{0} .listItem{0} .right{0} .title{0}{width:320px;font-size:13px;margin-bottom:9px;/*font-weight:bold;*/white-space:nowrap;text-overflow:ellipsis;overflow:hidden;word-break:break-all;color:#3377aa}#panelBody{0} .listItem{0} .right{0} .score{0}{position:absolute;right:5px;top:0px;padding-top:5px;font-size:13px;color:#e09015}#panelBody{0} .listItem{0} .right{0} .info{0}{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;word-break:break-all;font-size:12px;border:0;color:#9d9d9d}", randomCode, Images.VideoDefaultImg);
        return s;
    }
};

// 电影搜索面板
const MovieSearchPanel = {
    Create: function (popBoxEl) {
        var text = window.getSelection().toString().trim();
        let self = this;
        let searchEngineOptionsHtml = "";
        for (let k in SearchMovie.searchEngineList) {
            if (SearchMovie.searchEngineList.hasOwnProperty(k)) {
                let v = SearchMovie.searchEngineList[k].codeText;
                let selectOption = "";
                if (SearchMovie.searchEngine == k) {
                    selectOption = 'selected="selected"';
                }
                searchEngineOptionsHtml += Utils.StringFormat('<option value="{0}" {2}>{1}</option>', k, v, selectOption);
            }
        }
        let wordSearchPanelHtml = '';
        //let headHtml = Utils.StringFormat(`<div class="head{0}"><a href="" class="link22" target="_blank"><img class="logo{0}" src="" title="" /></a><select class="select22">{1}</select><div id="showSearchList_{0}" class="listBtn{0}">展示搜索列表</div></div>`, randomCode, searchEngineOptionsHtml);
        //let headHtml = Utils.StringFormat(`<div class="head{0}"><a href="${Urls.MovieSearchResultPageUrl.replace('{title}', encodeURIComponent(text))}" class="link22" target="_blank"><img id="doubanLogo_{0}" class="logo{0}"  src="${Images.MovieIconBase64}"  title="豆瓣电影" /></a><div id="showSearchText_{0}" class="text{0}">${text}</div><div id="showSearchList_{0}" class="listBtn{0}">展示搜索列表</div></div>`, randomCode, searchEngineOptionsHtml);
        let headHtml = Utils.StringFormat(`<div class="head{0}"><img id="doubanLogo_{0}" class="logo{0}" src="${Images.MovieIconBase64}"  title="豆瓣电影" /><div id="showSearchText_{0}" class="text{0}">${text}</div><div id="showSearchList_{0}" class="listBtn{0}">展示搜索列表</div></div>`, randomCode, searchEngineOptionsHtml);
        wordSearchPanelHtml += headHtml;
        wordSearchPanelHtml += Utils.StringFormat('<div class="content{0}">', randomCode);
        if (SettingOptions.searchPattern == 'automatic') {
            wordSearchPanelHtml += self.GetVideoInfoHtml();
        } else if (SettingOptions.searchPattern == 'manual') {
            wordSearchPanelHtml += self.GetVideoListHtml();
        }
        wordSearchPanelHtml += '</div>';

        Panel.popBoxEl = popBoxEl;
        Panel.Create("", "auto bottom", false, wordSearchPanelHtml, function ($panel) {
            console.log('pageX:' + ev.pageX + ' pageY:' + ev.pageY)
            console.log('clientX:' + ev.clientX + ' clientY:' + ev.clientY)
            //设置搜索结果面板鼠标位置
            /*if(ev.pageX < 945) {
                $panel.css({
                    left: ev.pageX + 'px',
                    top: ev.pageY + 12 + 'px'
                });
            } else {
                $panel.css({
                    left: 945 + 'px',
                    top: ev.pageY + 12 + 'px'
                });
            }*/
            if(ev.pageX < 945 && ev.clientY < 475) {
            // if(ev.pageX < 945 && ev.pageY < 485) {
                $panel.css({
                    left: ev.pageX + 'px',
                    top:  ev.pageY + 12 + 'px'
                });
            // } else if(ev.pageX < 945 && ev.clientY > 485) {
            } else if(ev.pageX < 945 && ev.pageY > 475) {
                $panel.css({
                    left: ev.pageX + 'px',
                    // top:  ev.pageY - 300 - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + 'px'
                    top:  ev.pageY - 265 + 'px'
                });
            } else if(ev.pageX > 945 && ev.clientY < 475) {
            // } else if(ev.pageX > 945 && ev.pageY < 485) {
                $panel.css({
                    left: 945 + 'px',
                    top:  ev.pageY + 12 + 'px'
                });
            // } else if(ev.pageX > 945 && ev.clientY > 485) {
            } else if(ev.pageX > 945 && ev.pageY > 475) {
                $panel.css({
                    left: 945 + 'px',
                    // top:  ev.pageY - 300 - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + 'px'
                    top:  ev.pageY - 265 + 'px'
                });
            /*} else {
                $panel.css({
                    left: 945 + 'px',
                    top:  ev.pageY + 12 + 'px'
                });*/
            }
            // 搜索引擎
            $panel.find(Utils.StringFormat("#panelBody{0} div:eq(0) select:eq(0)", randomCode)).change(function (e) {
                SearchMovie.searchEngine = $(this).find("option:selected").val();
                self.Loading($panel);
                SearchMovie.Update();
                SearchMovie.Execute(function () {
                    if (SettingOptions.searchPattern == 'automatic') {
                        self.Update();
                    } else if (SettingOptions.searchPattern == 'manual') {
                        self.ShowSearchList();
                    }
                });
            });

            // 搜索列表
            $panel.find(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).click(function (e) {
                self.ShowSearchList();
            });
            
            $panel.find(Utils.StringFormat("#panelBody{0} .logo{0}", randomCode)).click(function () {
                GM_openInTab(Urls.MovieSearchResultPageUrl.replace('{title}', encodeURIComponent(text)), {
                    active: false
                });
                //console.log("ok")
            });

            if (SettingOptions.searchPattern == 'manual') {
                // 列表点击事件
                $panel.find(Utils.StringFormat("#panelBody{0} .listItem{0}", randomCode)).click(function () {
                    let subjectId = $(this).attr('data-id');
                    SearchMovie.searchSelectTitle = $(this).attr('data-name');
                    self.Loading($panel);
                    SearchMovie.UpdateVideoInfo(subjectId, function () {
                        self.Update();
                    });
                    $(Utils.StringFormat("#panelBody{0} #doubanLogo_{0}", randomCode)).hide();//logo隐藏
                    $(Utils.StringFormat("#panelBody{0} #showSearchText_{0}", randomCode)).hide();//划词隐藏
                });
            }

            if (SettingOptions.searchPattern == 'manual' || !SearchMovie.searchVideoList || SearchMovie.searchVideoList.length == 0) {
                $(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).hide();
                
                
            }

        });
    },
    Update: function () {
        let self = this;
        Panel.Update(function ($panel) {
            let html = self.GetVideoInfoHtml();
            $panel.find(Utils.StringFormat("#panelBody{0} .content{0}", randomCode)).html("").html(html);
        });
        if (SearchMovie.searchVideoList && SearchMovie.searchVideoList.length > 0) {
            $(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).css("display", "inline");
            $(Utils.StringFormat("#panelBody{0} #doubanLogo_{0}", randomCode)).css("display", "none");//logo隐藏
            $(Utils.StringFormat("#panelBody{0} #showSearchText_{0}", randomCode)).css("display", "none");//划词隐藏
            
        }
        
        //点title后台打开电影读书页面
        //console.log(self.GetUrl())
        var url = self.GetUrl();
        let $panel = $("div.JPopBox-tip-white");
        $panel.find(Utils.StringFormat("#panelBody{0} .title{0}", randomCode)).click(function () {
            GM_openInTab(url, {
                active: false
            });
            //console.log("ok")
        });

        $panel.find(Utils.StringFormat("#panelBody{0} .left{0}", randomCode)).click(function () {
            GM_openInTab(url, {
                active: false
            });
            //console.log("ok")
        });
    },
    ShowSearchList: function () {
        let self = this;

        let html = self.GetVideoListHtml();
        let $panel = $("div.JPopBox-tip-white");
        $panel.find(Utils.StringFormat("#panelBody{0} .content{0}", randomCode)).html("").html(html);

        $panel.find(Utils.StringFormat("#panelBody{0} .listItem{0}", randomCode)).click(function () {
            let subjectId = $(this).attr('data-id');
            SearchMovie.searchSelectTitle = $(this).attr('data-name');
            self.Loading($panel);
            SearchMovie.UpdateVideoInfo(subjectId, function () {
                self.Update();
            });
        });
        $(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).hide();
        $(Utils.StringFormat("#panelBody{0} #doubanLogo_{0}", randomCode)).css("display", "inline");//列表logo显示
        $(Utils.StringFormat("#panelBody{0} #showSearchText_{0}", randomCode)).css("display", "inline");//列表划词显示
    },
    GetVideoListHtml: function () {
        let htmlArr = [];
        let videoList = SearchMovie.searchVideoList;
        if (videoList && videoList.length > 0) {
            let itemTemplate = `
                    <div class="listItem{0}" data-id="{4}" data-name="{2}">
                        <div class="left{0}"><img src="{1}" onerror="javascript:this.src='${Images.VideoDefaultImg}'"></div>
                        <div class="right{0}">
                            <div class="title{0}">{2}</div>
                            <div class="score{0}" title="{7}">{3}</div>
                            <div class="info{0}">{6}</div>
                            <div class="info{0}">{5}</div>
                        </div>
                    </div>`;

            htmlArr.push(Utils.StringFormat('<div class="list{0}">', randomCode));
            videoList.forEach((item) => {
                let videoItem = Utils.StringFormat(itemTemplate, randomCode, item.image, item.title, item.score, item.subjectId, item.description, item.cast, item.ratingCount);
                htmlArr.push(videoItem);
            })
            htmlArr.push('</div>');
        } else {
            htmlArr.push(Utils.StringFormat('<div class="noData{0}">未搜索到内容</div>', randomCode));
        }

        return htmlArr.join('');
    },
    GetVideoInfoHtml: function () {
        let videoInfoHtml = '';
        let videoInfo = SearchMovie.searchVideoInfo;
        if (videoInfo) {
            let templateArr = [];

            templateArr.push('<div class="videoInfo{0}">');
            if (videoInfo.score || videoInfo.imdbScore || videoInfo.imdbId) { // 评分
                templateArr.push('<div class="score{0}">');
                if (videoInfo.score) {
                    //templateArr.push(`<a href="{3}" target="_blank" title="{13} 人参与评分">${Images.DbSvg}<span>{5}</span></a>`);
                    //templateArr.push(`<a href="{3}" target="_blank" title="">${Images.DbSvg}<span>{5}</span></a>`);
                    templateArr.push(`<a href="{3}" target="_blank" class="link22" title="">${Images.DbSvg}<span class="iscore{0}">{5}</span><span class="count{0}">({13})</span></a>`);
                    //templateArr.push(`<a href="javascript:;" onclick="widnow.open(\'{3}\')" class="link22" title="{13} 人参与评分">${Images.DbSvg}<span class="score22">{5}</span></a>`);
                    //templateArr.push(`<a href="javascript:GM_openInTab(\'{3}\', {active: false})" class="link22" title="{13} 人参与评分">${Images.DbSvg}<span class="score22">{5}</span></a>`);
                }
                if (videoInfo.imdbScore || videoInfo.imdbId) { // imdb 有评分直接展示 没有评分有id的情况展示loading  豆瓣2不会传imdbId 用来区分
                    /*templateArr.push(`<a href="{11}" target="_blank" class="link22" title="{14} 人参与评分">${Images.ImdbSvg}
                                            <span class="score22" id="imdbScore{0}_{12}">{10}</span>
                                          </a>`);*/
                    /*templateArr.push(`<a href="{11}" target="_blank" class="link22" title="">${Images.ImdbSvg}
                                            <span class="score22" id="imdbScore{0}_{12}">{10}</span>
                                          </a>`);*/
                    templateArr.push(`<a href="{11}" target="_blank" class="link22" title="">${Images.ImdbSvg}
                                            <span class="iscore{0}" id="imdbScore{0}_{12}">{10}</span>
                                            <span class="count{0}">{14}</span>
                                          </a>`);                      
                    /*templateArr.push(`<a href="javascript:;" onclick="window.open(\'{3}\'')" class="link22" title="{14} 人参与评分">${Images.ImdbSvg}
                                            <span class="${videoInfo.imdbScore ? 'score22' : 'loading{0}'}" id="imdbScore{0}_{12}">{10}</span>
                                          </a>`); */  
                    /*templateArr.push(`<a href="javascript:GM_openInTab(\'{3}\', {active: false})" class="link22" title="{14} 人参与评分">${Images.ImdbSvg}
                                            <span class="score22" id="imdbScore{0}_{12}">{10}</span>
                                          </a>`); */
                    
                }
                templateArr.push('</div>');
            }
            

            templateArr.push(`
                                <div class="info{0}">
                                    <!--<div class="title{0}"><a href="{3}" class="link22" target="_blank">{1}</a></div>-->
                                    <!--<div class="title{0}"><a href="" target="_blank">{1}</a></div>-->
                                    <div class="title{0}">{1}</div>
                                    <div class="left{0}"><img src="{2}" onerror="javascript:this.src='${Images.VideoDefaultImg}'"/></div>
                                    <div class="right{0}">`);
            /*templateArr.push(`
                                <div class="info{0}">
                                    <div class="title{0}"><a href="javascript:;" onclick="openlink(\'{3}\')" class="link22" target="_blank">{1}</a></div>
                                    <div class="left{0}"><img src="{2}" onerror="javascript:this.src='${Images.VideoDefaultImg}'"/></div>
                                    <div class="right{0}">`);*/
            if (videoInfo.director) {
                templateArr.push('<div class="item{0}"><span class="item22">导演</span>：{9}</div>');
            }
            if (videoInfo.actor) {
                templateArr.push('<div class="item{0}"><span class="item22">主演</span>：{8}</div>');
            }
            if (videoInfo.genre) {
                templateArr.push('<div class="item{0}"><span class="item22">类型</span>：{7}</div>');
            }
            if (videoInfo.time) {
                templateArr.push('<div class="item{0}"><span class="item22">时间</span>：{6}</div>');
            }
            if (videoInfo.description) {
                templateArr.push('<div class="item{0}"><span class="item22">简介</span>：{4}</div>');
            }
            templateArr.push(`</div></div>`);

            /*videoInfoHtml = Utils.StringFormat(templateArr.join(''), randomCode,
                                               videoInfo.title.slice(0, 35), videoInfo.image, videoInfo.url, videoInfo.description,
                                               videoInfo.score, videoInfo.time, videoInfo.genre, videoInfo.actor, videoInfo.director,
                                               videoInfo.imdbScore || '', videoInfo.imdbUrl, videoInfo.imdbId || 0,
                                               videoInfo.ratingCount || 0, videoInfo.imdbRatingCount || 0);*/
            videoInfoHtml = Utils.StringFormat(templateArr.join(''), randomCode,
                                                videoInfo.title, videoInfo.image, videoInfo.url, videoInfo.description,
                                                videoInfo.score, videoInfo.time, videoInfo.genre, videoInfo.actor, videoInfo.director,
                                                videoInfo.imdbScore || '', videoInfo.imdbUrl, videoInfo.imdbId || 0,
                                                videoInfo.ratingCount || 0, videoInfo.imdbRatingCount || '');                                   
        } else {
            videoInfoHtml = Utils.StringFormat('<div class="noData{0}">未搜索到内容</div>', randomCode);
        }

        return videoInfoHtml;
    },
    Loading: function (panel) {
        panel.find(Utils.StringFormat("#panelBody{0} .content{0}", randomCode)).html("").html(Utils.StringFormat('<div class="loading{0}"></div>', randomCode));
    },
    GetUrl: function () { //返回电影读书页面
        let videoInfo = SearchMovie.searchVideoInfo;
        var url = videoInfo.url;
        return url;
    }
};

// 读书搜索面板
const BookSearchPanel = {
    Create: function (popBoxEl) {
        var text = window.getSelection().toString().trim();
        let self = this;
        let searchEngineOptionsHtml = "";
        for (let k in SearchBook.searchEngineList) {
            if (SearchBook.searchEngineList.hasOwnProperty(k)) {
                let v = SearchBook.searchEngineList[k].codeText;
                let selectOption = "";
                if (SearchBook.searchEngine == k) {
                    selectOption = 'selected="selected"';
                }
                searchEngineOptionsHtml += Utils.StringFormat('<option value="{0}" {2}>{1}</option>', k, v, selectOption);
            }
        }
        let wordSearchPanelHtml = '';
        //let headHtml = Utils.StringFormat(`<div class="head{0}"><a href="" class="link22" target="_blank"><img class="logo{0}" src="" title="" /></a><select class="select22">{1}</select><div id="showSearchList_{0}" class="listBtn{0}">展示搜索列表</div></div>`, randomCode, searchEngineOptionsHtml);
        //let headHtml = Utils.StringFormat(`<div class="head{0}"><a href="${Urls.BookSearchResultPageUrl.replace('{title}', encodeURIComponent(text))}" class="link22" target="_blank"><img id="doubanLogo_{0}" class="logo{0}" src="${Images.BookIconBase64}" title="豆瓣读书" /></a><div id="showSearchText_{0}" class="text{0}">${text}</div><div id="showSearchList_{0}" class="listBtn{0}">展示搜索列表</div></div>`, randomCode, searchEngineOptionsHtml);
        let headHtml = Utils.StringFormat(`<div class="head{0}"><img id="doubanLogo_{0}" class="logo{0}" src="${Images.BookIconBase64}" title="豆瓣读书" /><div id="showSearchText_{0}" class="text{0}">${text}</div><div id="showSearchList_{0}" class="listBtn{0}">展示搜索列表</div></div>`, randomCode, searchEngineOptionsHtml);
        wordSearchPanelHtml += headHtml;
        wordSearchPanelHtml += Utils.StringFormat('<div class="content{0}">', randomCode);
        if (SettingOptions.searchPattern == 'automatic') {
            wordSearchPanelHtml += self.GetBookInfoHtml();
        } else if (SettingOptions.searchPattern == 'manual') {
            wordSearchPanelHtml += self.GetBookListHtml();
        }
        wordSearchPanelHtml += '</div>';

        Panel.popBoxEl = popBoxEl;
        Panel.Create("", "auto bottom", false, wordSearchPanelHtml, function ($panel) {
            /*if(ev.pageX < 945) {
                $panel.css({
                    left: ev.pageX + 'px',
                    top: ev.pageY + 12 + 'px'
                });
            } else {
                $panel.css({
                    left: 945 + 'px',
                    top: ev.pageY + 12 + 'px'
                });
            }*/
            if(ev.pageX < 945 && ev.clientY < 475) {
            // if(ev.pageX < 945 && ev.pageY < 485) {
                $panel.css({
                    left: ev.pageX + 'px',
                    top:  ev.pageY + 12 + 'px'
                });
            // } else if(ev.pageX < 945 && ev.clientY > 485) {
            } else if(ev.pageX < 945 && ev.pageY > 475) {
                $panel.css({
                    left: ev.pageX + 'px',
                    // top:  ev.pageY - 300 - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + 'px'
                    top:  ev.pageY - 265 + 'px'
                });
            } else if(ev.pageX > 945 && ev.clientY < 475) {
            // } else if(ev.pageX > 945 && ev.pageY < 485) {
                $panel.css({
                    left: 945 + 'px',
                    top:  ev.pageY + 12 + 'px'
                });
            // } else if(ev.pageX > 945 && ev.clientY > 485) {
            } else if(ev.pageX > 945 && ev.pageY > 475) {
                $panel.css({
                    left: 945 + 'px',
                    // top:  ev.pageY - 300 - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + document.documentElement.scrollTop + 'px'
                    // top:  ev.clientY - 255 + 'px'
                    top:  ev.pageY - 265 + 'px'
                });
            /*} else {
                $panel.css({
                    left: 945 + 'px',
                    top:  ev.pageY + 12 + 'px'
                });*/
            }
            // 搜索引擎
            $panel.find(Utils.StringFormat("#panelBody{0} div:eq(0) select:eq(0)", randomCode)).change(function (e) {
                SearchBook.searchEngine = $(this).find("option:selected").val();
                self.Loading($panel);
                SearchBook.Update();
                SearchBook.Execute(function () {
                    if (SettingOptions.searchPattern == 'automatic') {
                        self.Update();
                    } else if (SettingOptions.searchPattern == 'manual') {
                        self.ShowSearchList();
                    }
                });
            });

            // 搜索列表
            $panel.find(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).click(function (e) {
                self.ShowSearchList();
            });
            
            $panel.find(Utils.StringFormat("#panelBody{0} .logo{0}", randomCode)).click(function () {
                GM_openInTab(Urls.BookSearchResultPageUrl.replace('{title}', encodeURIComponent(text)), {
                    active: false
                });
                //console.log("ok")
            });

            if (SettingOptions.searchPattern == 'manual') {
                // 列表点击事件
                $panel.find(Utils.StringFormat("#panelBody{0} .listItem{0}", randomCode)).click(function () {
                    let subjectId = $(this).attr('data-id');
                    SearchBook.searchSelectTitle = $(this).attr('data-name');
                    self.Loading($panel);
                    SearchBook.UpdateBookInfo(subjectId, function () {
                        self.Update();
                    });
                    $(Utils.StringFormat("#panelBody{0} #doubanLogo_{0}", randomCode)).hide();//logo隐藏
                    $(Utils.StringFormat("#panelBody{0} #showSearchText_{0}", randomCode)).hide();//划词隐藏
                });
            }

            if (SettingOptions.searchPattern == 'manual' || !SearchBook.searchBookList || SearchBook.searchBookList.length == 0) {
                $(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).hide();
            }

        });
    },
    Update: function () {
        let self = this;
        Panel.Update(function ($panel) {
            let html = self.GetBookInfoHtml();
            $panel.find(Utils.StringFormat("#panelBody{0} .content{0}", randomCode)).html("").html(html);
        });
        if (SearchBook.searchBookList && SearchBook.searchBookList.length > 0) {
            $(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).css("display", "inline");
            $(Utils.StringFormat("#panelBody{0} #doubanLogo_{0}", randomCode)).css("display", "none");//列表logo显示
            $(Utils.StringFormat("#panelBody{0} #showSearchText_{0}", randomCode)).css("display", "none");//列表划词显示
        }
        
        //点title后台打开电影读书页面
        //console.log(self.GetUrl())
        var url = self.GetUrl();
        let $panel = $("div.JPopBox-tip-white");
        $panel.find(Utils.StringFormat("#panelBody{0} .title{0}", randomCode)).click(function () {
            GM_openInTab(url, {
                active: false
            });
            //console.log("ok")
        });

        $panel.find(Utils.StringFormat("#panelBody{0} .left{0}", randomCode)).click(function () {
            GM_openInTab(url, {
                active: false
            });
            //console.log("ok")
        });
    },
    ShowSearchList: function () {
        let self = this;

        let html = self.GetBookListHtml();
        let $panel = $("div.JPopBox-tip-white");
        $panel.find(Utils.StringFormat("#panelBody{0} .content{0}", randomCode)).html("").html(html);

        $panel.find(Utils.StringFormat("#panelBody{0} .listItem{0}", randomCode)).click(function () {
            let subjectId = $(this).attr('data-id');
            SearchBook.searchSelectTitle = $(this).attr('data-name');
            self.Loading($panel);
            SearchBook.UpdateBookInfo(subjectId, function () {
                self.Update();
            });
        });
        $(Utils.StringFormat("#panelBody{0} #showSearchList_{0}", randomCode)).hide();
        $(Utils.StringFormat("#panelBody{0} #doubanLogo_{0}", randomCode)).css("display", "inline");//列表logo显示
        $(Utils.StringFormat("#panelBody{0} #showSearchText_{0}", randomCode)).css("display", "inlinee");//列表划词显示
    },
    GetBookListHtml: function () {
        let htmlArr = [];
        let bookList = SearchBook.searchBookList;
        if (bookList && bookList.length > 0) {
            let itemTemplate = `
                    <div class="listItem{0}" data-id="{4}" data-name="{2}">
                        <div class="left{0}"><img src="{1}" onerror="javascript:this.src='${Images.VideoDefaultImg}'"></div>
                        <div class="right{0}">
                            <div class="title{0}">{2}</div>
                            <div class="score{0}" title="{7}">{3}</div>
                            <div class="info{0}">{6}</div>
                            <div class="info{0}">{5}</div>
                        </div>
                    </div>`;

            htmlArr.push(Utils.StringFormat('<div class="list{0}">', randomCode));
            bookList.forEach((item) => {
                let bookItem = Utils.StringFormat(itemTemplate, randomCode, item.image, item.title, item.score, item.subjectId, item.description, item.cast, item.ratingCount);
                htmlArr.push(bookItem);
            })
            htmlArr.push('</div>');
        } else {
            htmlArr.push(Utils.StringFormat('<div class="noData{0}">未搜索到内容</div>', randomCode));
        }

        return htmlArr.join('');
    },
    GetBookInfoHtml: function () {
        let bookInfoHtml = '';
        let bookInfo = SearchBook.searchBookInfo;
        if (bookInfo) {
            let templateArr = [];
            templateArr.push('<div class="videoInfo{0}">');

            if (bookInfo.score) { // 评分
                templateArr.push('<div class="score{0}">');
                if (bookInfo.score) {
                    //templateArr.push(`<a href="{3}" target="_blank" class="link22" title="{11} 人参与评分">${Images.DbSvg}<span class="score22">{6}</span></a>`);
                    //templateArr.push(`<a href="{3}" target="_blank" class="link22" title="">${Images.DbSvg}<span class="score22">{6}</span></a>`);
                    templateArr.push(`<a href="{3}" target="_blank" class="link22" title="">${Images.DbSvg}<span class="iscore{0}">{6}</span><span class="count{0}">({11})</span></a>`);
                    //templateArr.push(`<a href="javascript:;" onclick="GM_openInTab(\'{3}\', loadInBackground)" class="link22" title="{11} 人参与评分">${Images.DbSvg}<span class="score22">{6}</span></a>`);
                }
                templateArr.push('</div>');
            }

            templateArr.push(`
                                <div class="info{0}">
                                    <!--<div class="title{0}"><a href="{3}" class="link22" target="_blank">{1}</a></div>-->
                                    <div class="title{0}">{1}</div>
                                    <div class="left{0}"><img src="{2}" onerror="javascript:this.src='${Images.VideoDefaultImg}'"/></div>
                                    <div class="right{0}">`);
            if (bookInfo.author) {
                templateArr.push('<div class="item{0}"><span class="item22">作者</span>：{5}</div>');
            }
            if (bookInfo.publisher) {
                templateArr.push('<div class="item{0}"><span class="item22">出版社</span>：{7}</div>');
            }
            if (bookInfo.orignal) {
                templateArr.push('<div class="item{0}"><span class="item22">原作名</span>：{8}</div>');
            }
            if (bookInfo.time) {
                templateArr.push('<div class="item{0}"><span class="item22">出版年</span>：{10}</div>');
            }
            if (bookInfo.description) {
                templateArr.push('<div class="item{0}"><span class="item22">简介</span>：{4}</div>');
            }
            templateArr.push(`</div></div>`);

            /*bookInfoHtml = Utils.StringFormat(templateArr.join(''), randomCode,
                                              bookInfo.title.slice(0, 35), bookInfo.image, bookInfo.url, bookInfo.description,
                                              bookInfo.author, bookInfo.score, bookInfo.publisher, bookInfo.orignal,
                                              bookInfo.translator, bookInfo.time, bookInfo.ratingCount || 0);*/
            bookInfoHtml = Utils.StringFormat(templateArr.join(''), randomCode,
                                              bookInfo.title, bookInfo.image, bookInfo.url, bookInfo.description,
                                              bookInfo.author, bookInfo.score, bookInfo.publisher, bookInfo.orignal,
                                              bookInfo.translator, bookInfo.time, bookInfo.ratingCount || '');
        } else {
            bookInfoHtml = Utils.StringFormat('<div class="noData{0}">未搜索到内容</div>', randomCode);
        }

        return bookInfoHtml;
    },
    Loading: function (panel) {
        panel.find(Utils.StringFormat("#panelBody{0} .content{0}", randomCode)).html("").html(Utils.StringFormat('<div class="loading{0}"></div>', randomCode));
    },
    GetUrl: function () { //返回电影读书页面
        let bookInfo = SearchBook.searchBookInfo;
        var url = bookInfo.url;
        return url;
    }
};

// 选词 代码来自扩展 uBlock Origin https://github.com/gorhill/uBlock/blob/master/src/js/scriptlets/epicker.js
const DoubanPickerTool = {
    sessionId: '',
    iframeHost: '',
    textFilterCandidates: [],
    targetElements: [],
    pickerRoot: null,

    initDoubanPicker: function (iframeHost) {
        if (!iframeHost) { return; }
        this.iframeHost = iframeHost;

        // 主页面监听message事件,接收子组件的值
        let self = this;
        window.addEventListener('message', function (e) {
            if (e.origin == self.iframeHost) {
                self.onDialogMessage(e.data)
            }
        }, false);
    },

    getElementBoundingClientRect: function (elem) {
        let rect = typeof elem.getBoundingClientRect === 'function' ? elem.getBoundingClientRect() : { height: 0, left: 0, top: 0, width: 0 };

        if (rect.width !== 0 && rect.height !== 0) {
            return rect;
        }

        let left = rect.left,
            right = rect.right,
            top = rect.top,
            bottom = rect.bottom;

        for (const child of elem.children) {
            rect = this.getElementBoundingClientRect(child);
            if (rect.width === 0 || rect.height === 0) {
                continue;
            }
            if (rect.left < left) { left = rect.left; }
            if (rect.right > right) { right = rect.right; }
            if (rect.top < top) { top = rect.top; }
            if (rect.bottom > bottom) { bottom = rect.bottom; }
        }

        return { height: bottom - top, left, top, width: right - left };
    },

    highlightElements: function (elems, force) {
        if (
            (force !== true) &&
            (elems.length === this.targetElements.length) &&
            (elems.length === 0 || elems[0] === this.targetElements[0])
        ) {
            return;
        }
        this.targetElements = [];

        const ow = self.innerWidth;
        const oh = self.innerHeight;
        const islands = [];

        for (const elem of elems) {
            if (elem === this.pickerRoot) { continue; }
            this.targetElements.push(elem);
            const rect = this.getElementBoundingClientRect(elem);

            if (
                rect.left > ow || rect.top > oh ||
                rect.left + rect.width < 0 || rect.top + rect.height < 0
            ) {
                continue;
            }
            islands.push(
                `M${rect.left} ${rect.top}h${rect.width}v${rect.height}h-${rect.width}z`
            );
        }

        this.sendMessageToIframe({
            ocean: `M0 0h${ow}v${oh}h-${ow}z`,
            islands: islands.join(''),
            what: "svgPaths"
        });
    },

    textFilterFromElement: function (elem) {
        if (elem === null) { return 0; }
        if (elem.nodeType !== 1) { return 0; }
        if (elem.nodeName === "HTML" || elem.nodeName === "BODY") { return 0; }
        this.textFilterCandidates = this.getNodeText(elem);
        return 1;
    },

    getNodeText: function (elem) {
        let temp = []
        if (elem) {
            const forFn = function (ele) {
                if (ele.childNodes.length > 0 && ele.nodeName != 'A') {
                    let children = Array.from(ele.childNodes);
                    children.forEach((c) => {
                        forFn(c);
                    })
                } else {
                    let text = ele.textContent;
                    if (ele.nodeName == 'INPUT') {
                        text = ele.value;
                    } else if (ele.nodeName == 'A') {
                        text = ele.innerText;
                    }

                    if (text && text.trim()) {
                        temp.push(text.trim());
                    }
                }
            }
            forFn(elem);
        }

        return temp;
    },

    filtersFrom: function (x, y) {
        this.textFilterCandidates.length = 0
        let elem = null;
        if (typeof x === 'number') {
            elem = this.elementFromPoint(x, y);
        } else if (x instanceof HTMLElement) {
            elem = x;
            x = undefined;
        }

        this.textFilterFromElement(elem);

        return this.textFilterCandidates.length;
    },

    showDialog: function () {
        this.sendMessageToIframe({
            what: 'showDialog',
            text: this.textFilterCandidates
        });
    },

    elementFromPoint: function (x, y) {
        let lastX, lastY;

        if (x !== undefined) {
            lastX = x; lastY = y;
        } else if (lastX !== undefined) {
            x = lastX; y = lastY;
        } else {
            return null;
        }
        if (!this.pickerRoot) { return null; }
        this.pickerRoot.style.pointerEvents = 'none';
        let elems = document.elementsFromPoint(x, y);
        elems = elems.filter(ele => ele.name != 'myFrame') || [];
        let elem = elems[0];
        this.pickerRoot.style.pointerEvents = '';
        return elem;
    },

    highlightElementAtPoint: function (mx, my) {
        const elem = this.elementFromPoint(mx, my);
        this.highlightElements(elem ? [elem] : []);
    },

    filterElementAtPoint: function (mx, my) {
        if (this.filtersFrom(mx, my) === 0) { return; }
        this.showDialog();
    },

    onKeyPressed: function (ev) {
        // Esc
        if (ev.key === 'Escape' || ev.which === 27) {
            ev.stopPropagation();
            ev.preventDefault();
            this.quitPicker();
            return;
        }
    },

    onViewportChanged: function () {
        this.highlightElements(this.targetElements, true);
    },

    startPicker: function () {
        this.pickerRoot.focus();

        this.pickerRoot.addEventListener('scroll', this.onViewportChanged, { passive: true });
        this.pickerRoot.addEventListener('resize', this.onViewportChanged, { passive: true });
        this.pickerRoot.addEventListener('keydown', this.onKeyPressed, true);
    },

    quitPicker: function () {
        this.pickerRoot.removeEventListener('scroll', this.onViewportChanged, { passive: true });
        this.pickerRoot.removeEventListener('resize', this.onViewportChanged, { passive: true });
        this.pickerRoot.removeEventListener('keydown', this.onKeyPressed, true);

        if (this.pickerRoot === null) { return; }

        let parent = this.pickerRoot.parentElement;
        this.pickerRoot.remove();
        this.pickerRoot = null;

        parent.focus();
    },

    onDialogMessage: function (msg) {
        switch (msg.what) {
            case 'start':
                this.startPicker();
                if (this.targetElements.length === 0) {
                    this.highlightElements([document.body], true);
                }
                break;
            case 'quitPicker':
                this.quitPicker();
                break;
            case 'highlightElementAtPoint':
                this.highlightElementAtPoint(msg.mx, msg.my);
                break;
            case 'filterElementAtPoint':
                this.filterElementAtPoint(msg.mx, msg.my);
                break;
            case 'togglePreview':
                if (msg.state === false) {
                    this.highlightElements(this.targetElements, true);
                }
                break;
            default:
                break;
        }
    },

    sendMessageToIframe: function (msg) {
        this.pickerRoot.contentWindow.postMessage(msg, this.iframeHost);
    },

    showPicker: function () {
        const self = this;
        if (this.pickerRoot) {
            return;
        }

        // loading
        let loadingRoot = document.createElement('div');
        loadingRoot.innerHTML = `
                <div style='z-index:2147483647;background: #000; opacity: 0.3; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;'></div>
                <div style="z-index:2147483647;border: 5px solid #f3f3f3; border-radius: 50%; border-top: 5px solid #3498db; width:4vw; height:4vw;min-width:30px;min-height:30px;max-width:50px;max-height:50px;animation: db_search_turn${randomCode} 2s linear infinite; margin: 20px; margin-left: 48%; top: 45%; position: fixed"></div>`;
        document.documentElement.append(loadingRoot);

        // iframe
        const pickerRoot = document.createElement('iframe');
        pickerRoot.setAttribute('name', 'myFrame');
        pickerRoot.setAttribute('src', this.iframeHost + '/picker.html');
        pickerRoot.style = `color-scheme:initial;box-shadow:none !important;display:block !important;height:100vh !important;left:0px !important;max-height:none !important;max-width:none !important;min-height:unset !important;min-width:unset !important;opacity:1 !important;pointer-events:auto !important;position:fixed !important;top: 0px !important;visibility:visible !important;width:100% !important;z-index:2147483647 !important;background:transparent !important;border-width:0px !important;border-style:initial !important;border-color:initial !important;border-image:initial !important;border-radius:0px !important;margin:0px !important;outline:0px !important;padding: 0px !important`;
        pickerRoot.onload = function () {
            setTimeout(() => {
                loadingRoot.remove();
                self.sendMessageToIframe({ what: 'connectionAccepted' })
            }, 500);
        };
        this.pickerRoot = pickerRoot;
        document.documentElement.append(pickerRoot);
    },
}

//设置面板
const SettingPanel = {
    config: [{ title: "", name: "", type: "", attrName: "", item: [{ code: "", text: "" }] }],
    Create: function (popBoxEl) {
        let self = this;
        let settingHtml = [];
        this.InitConfig();
        settingHtml.push(Utils.StringFormat('<div class="setting{0}">', randomCode));
        for (let index = 0; index < this.config.length; index++) {
            let configItem = this.config[index];
            settingHtml.push(Utils.StringFormat(`<div class="configItem{0}"><div class="title{0}">{1}</div><div class="right{0}">`, randomCode, configItem.title));
            for (let itemIndex = 0; itemIndex < configItem.item.length; itemIndex++) {
                let itemObj = configItem.item[itemIndex];
                settingHtml.push(Utils.StringFormat('<label><input type="radio" name="search{3}{0}" value="{1}">{2}</label>', randomCode, itemObj.code, itemObj.text, configItem.name));
            }
            settingHtml.push('</div></div>');
        }

        settingHtml.push(Utils.StringFormat(`<div class="bottom{0}"><button id="saveBtn{0}">保存</button><span id="saveStatus{0}" class="msg{0}">设置已保存。</span></div></div>`, randomCode));

        let settingHtmlStr = settingHtml.join("");
        Panel.popBoxEl = popBoxEl;
        Panel.Create("设置", "auto bottom", false, settingHtmlStr, function ($panel) {
            $panel.css({
                position: "fixed",
                top: "120px"
            });
            self.Update();
            //保存设置
            $panel.find(Utils.StringFormat("#panelBody{0} #saveBtn{0}", randomCode)).click(function (e) {
                self.config.forEach((item) => {
                    let selecter = `#panelBody{0} input[name='search${item.name}{0}']:checked`;
                    let value = $panel.find(Utils.StringFormat(selecter, randomCode)).val();
                    SettingOptions[item.attrName] = value;
                });
                Utils.SetSettingOptions();
                $panel.find(Utils.StringFormat("#panelBody{0} #saveStatus{0}", randomCode)).fadeIn(function () {
                    setTimeout(function () {
                        $panel.find(Utils.StringFormat("#panelBody{0} #saveStatus{0}", randomCode)).fadeOut();
                    }, 1500);
                });
            });
        });
    },
    Update: function () {
        let self = this;
        Utils.GetSettingOptions();
        Panel.Update(function ($panel) {
            self.config.forEach((item) => {
                let selecter = `#panelBody{0} input[name='search${item.name}{0}'][value='{1}']`;
                $panel.find(Utils.StringFormat(selecter, randomCode, SettingOptions[item.attrName])).prop("checked", true);
            });
        });
    },
    InitConfig: function () {
        this.config = [];
        let engineConfigObj = { title: "默认搜索引擎", name: "Engine", attrName: "defaultsearchengine", item: [] };
        /*for (let k in Search.searchEngineList) {
                if (Search.searchEngineList.hasOwnProperty(k)) {
                    let v = Search.searchEngineList[k].codeText;
                    engineConfigObj.item.push({ code: k, text: v });
                }
            }*/
        this.config.push(engineConfigObj);

        let patternConfigObj = { title: "搜索模式", name: "Pattern", attrName: "searchPattern", item: [{ code: "automatic", text: "自动" }, { code: "manual", text: "手动" }] };
        this.config.push(patternConfigObj);
        let selectConfigObj = { title: "划词模式", name: "Select", attrName: "selectPattern", item: [{ code: "select", text: "划词" }, { code: "hold", text: "划词键 + 划词" }] };
        this.config.push(selectConfigObj);
        let keyConfigObj = { title: "划词键", name: "Key", attrName: "selectKey", item: [{ code: "Ctrl", text: "Ctrl" }, { code: "Alt", text: "Alt" }] };
        this.config.push(keyConfigObj);
        let positionConfigObj = { title: "图标位置", name: "Position", attrName: "selectIconPosition", item: [{ code: "right", text: "右" }, { code: "left", text: "左" }, { code: "top", text: "上" }] };
        this.config.push(positionConfigObj);
    },
    CreateStyle: function () {
        let s = "";
        s += Utils.StringFormat("#panelBody{0} .setting{0} .configItem{0}{display:flex;padding:5px}#panelBody{0} .configItem{0} .title{0}{width:90px;font-size: 14px}#panelBody{0} .configItem{0} .right{0}{margin-left:10px}#panelBody{0} .configItem{0} .right{0} label{cursor:pointer;display:inline-block;min-width:60px}#panelBody{0} .configItem{0} .right{0} input{cursor:pointer;vertical-align:middle;margin-top:-2px;margin-bottom:1px}", randomCode);
        s += Utils.StringFormat("#panelBody{0} .setting{0} button{border:0.5px solid black;margin:5px;padding:1px 5px;border-radius:revert;font:revert}#panelBody{0} .setting{0} .bottom{0} .msg{0}{display: none; margin-left:5px;background-color:#fff1a8;padding:3px}", randomCode);
        return s;
    }
};

//主程序
const WebSearchlate = function () {
    const $doc = $(document);
    const $body = $("html body");
    const createHtml = function () {
        const wordSearchIconHtml = Utils.StringFormat('<div id="wordSearch{0}" class="wordSearch{0}"><div class="wordSearchIcon{0}"></div></div>', randomCode);
        $body.append(Utils.StringFormat('<div id="webSearch{0}">', randomCode) + wordSearchIconHtml + '</div>');
    };
    const createStyle = function () {
        //尽可能避开csp认证
        GM_xmlhttpRequest({
            method: "get",
            url: "https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jPopBox/dist/jPopBox.min.css",
            onload: function (r) {
                GM_addStyle(r.responseText + ".JPopBox-tip-white{width: 482px;max-width: 550px;min-width: 450px}");
            }
        });
        let s = Utils.StringFormat("@keyframes db_search_turn{0}{0%{transform:rotate(0deg)}25%{transform:rotate(90deg)}50%{transform:rotate(180deg)}75%{transform:rotate(270deg)}100%{transform:rotate(360deg)}}", randomCode);
        s += Utils.StringFormat(".wordSearch{0}{background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none} .wordSearch{0}.animate{animation: db_search_turn{0} 5s linear infinite}", randomCode);
        s += Utils.StringFormat(".wordSearchIcon{0}{background-image: url({1});background-size: 25px;height: 25px;width: 25px}", randomCode, Images.IconBase64);
        s += Panel.CreateStyle();
        s += SettingPanel.CreateStyle();
        GM_addStyle(s);
    };

    const RegMenu = function () {
        //GM_registerMenuCommand("设置", function () {
        //    if (DoubanPickerTool.pickerRoot) {
        //        DoubanPickerTool.quitPicker();
        //    }
        //    $("div#wordSearch" + randomCode).hide();
        //    SearchMovie.Clear();
        //    SearchBook.Clear();
        //    Panel.Destroy();
        //    SettingPanel.Create($body);
        //});

        //GM_registerMenuCommand("进入取词模式", function () {
        //    if (DoubanPickerTool.pickerRoot) {
        //        return;
        //    }
        //    $("div#wordSearch" + randomCode).hide();
        //    SearchMovie.Clear();
        //    SearchBook.Clear();
        //    Panel.Destroy();
        //    DoubanPickerTool.showPicker();
        //});
    };
    this.init = function () {
        SearchMovie.RegisterEngine();
        SearchBook.RegisterEngine();
        createStyle();
        createHtml();
        RegMenu();
        Utils.GetSettingOptions();
        DoubanPickerTool.initDoubanPicker(Urls.IframePageHost)
    };
};

