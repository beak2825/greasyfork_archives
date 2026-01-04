// ==UserScript==
// @name         优书网 <=> 知轩藏书
// @namespace    http://tampermonkey.net/
// @description  [知轩藏书/早安电子书/书荒网/柚子书]添加优书网评分和直链，[优书网/柚子书]书籍详情页添加[知轩藏书/早安电子书/龙凤互联/书荒网]下载链接
// @require      https://greasyfork.org/scripts/40003-pajhome-md5-min/code/PajHome-MD5-min.js
// @require      https://unpkg.com/gbk.js@0.3.0/dist/gbk.min.js
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @match        *://zxcs.me/sort/*
// @match        *://zxcs.me/post/*
// @match        *://zxcs.me/index.php?keyword=*
// @match        *://www.zxcs.me/sort/*
// @match        *://www.zxcs.me/post/*
// @match        *://www.zxcs.me/author/*
// @match        *://www.zxcs.me/tag/*
// @match        *://www.zxcs.me/index.php?keyword=*
// @match        *://www.yousuu.com/book/*
// @match        *://www.yousuu.com/booklist/*
// @match        *://www.yousuu.com/explore*
// @match        *://www.zadzs.com/txt/*
// @match        *://www.zadzs.com/plus/search.php?*
// @match        *://www.nordfxs.com/*
// @match        *://www.15huang.com/style/*.html
// @match        *://www.15huang.com/style/*
// @match        *://www.15huang.com/e/search/result/*
// @match        *://www.3uww.cc/down/*
// @match        *://www.3uww.cc/author/*
// @match        *://www.3uww.cc/soft*
// @match        *://www.3uww.cc/search.html
// @match        *://www.3uww.cc/top/*
// @match        *://www.xuanquge.com/down/*
// @match        *://www.xuanquge.com/author/*
// @match        *://www.xuanquge.com/soft*
// @match        *://www.xuanquge.com/search.html
// @match        *://www.xuanquge.com/top/*
// @match        *://www.ixuanquge.com/down/*
// @match        *://www.ixuanquge.com/author/*
// @match        *://www.ixuanquge.com/soft*
// @match        *://www.ixuanquge.com/search.html
// @match        *://www.ixuanquge.com/top/*
// @match        *://www.wanbentxt.com/*
// @match        *://www.yuzuhon.com/*
// @match        *://www.zxcs.info/sort/*
// @match        *://www.zxcs.info/post/*
// @match        *://www.zxcs.info/author/*
// @match        *://www.zxcs.info/tag/*
// @match        *://www.zxcs.info/index.php?keyword=*
// @match        *://zxcs.info/sort/*
// @match        *://zxcs.info/post/*
// @match        *://zxcs.info/author/*
// @match        *://zxcs.info/tag/*
// @match        *://zxcs.info/index.php?keyword=*
// @match        *://zxcstxt.com/*
// @match        *://zxcsol.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      www.yousuu.com
// @connect      api.yousuu.com
// @connect      www.zxcs.me
// @connect      zxcs.me
// @connect      www.zadzs.com
// @connect      www.nordfxs.com
// @connect      www.zvzee.com
// @connect      www.15huang.com
// @connect      www.3uww.cc
// @connect      www.ibiquta.com
// @connect      www.mianhuatang.la
// @connect      zhannei.baidu.com
// @connect      www.ixdzs.com
// @connect      www.aixdzs.com
// @connect      www.xuanquge.com
// @connect      www.ixuanquge.com
// @connect      www.wanbentxt.com
// @connect      www.afs360.com
// @connect      www.auzw.com
// @connect      www.mianhuatang.cc
// @connect      www.mhtwx.la
// @connect      www.balingtxt.com
// @connect      www.dushuxiaozi.com
// @connect      jingjiaocangshu.cn
// @connect      www.kenshula.com
// @connect      www.wucuo8.com
// @connect      www.zxcs.info
// @connect      zxcs.info
// @connect      www.ibiquta.com
// @connect      www.mhtxs.la
// @connect      zxcstxt.com
// @connect      zxcsol.com
// @version      0.15
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369850/%E4%BC%98%E4%B9%A6%E7%BD%91%20%3C%3D%3E%20%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/369850/%E4%BC%98%E4%B9%A6%E7%BD%91%20%3C%3D%3E%20%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6.meta.js
// ==/UserScript==

/*================================================= 常量 ================================================*/
// 下载链接缓存时间，默认1天
const DOWNLOAD_EXPIRED_TIME = 86400 * 1000;
// 优书网评分缓存时间，默认1天
const SEARCH_EXPIRED_TIME = 86400 * 1000;
// 优书网最大搜索数目，默认5个
const MAX_SEARCH_NUM = 5;
// 下载链接类型 1:直接获取 2:解析请求bookLink的响应 3:解析原bookList的响应
const DOWNLOAD_TYPE_DIRECT = 1;
const DOWNLOAD_TYPE_FETCH = 2;
const DOWNLOAD_TYPE_PROCESS = 3;

const IS_DEBUG = false;


//扩展名
const SCRIPT_HANDLER_TAMPERMONKEY = 'tampermonkey';

//要排除的下载源key
const EXCEPTED_DOWNLOAD_SITES_KEY = "excepted_sites";

// 无法获取 ready 事件的网站
const SITES_WAIT_KEY_ELEMENT = {
    "www.yuzuhon.com": "#__layout > div > div.app-main > div > div.container > div.book-info-section",
}

/*======================================================================================================*/

/*================================================  类  ================================================*/
/**
 * local storage 存储,支持过期日期
 * 没必要用class,但就是想试试
 */
class Storage {

    /**
     * 构造函数
     */
    constructor() {
        if (this._checkStorageStatus) {
            this._localStorageStatus = true;
        }
    }
    /**
     * 检查 local storage 状态
     */
    _checkStorageStatus() {
        if (!window.localStorage) {
            return false;
        }
        try {
            window.localStorage.setItem('checkLocalStorage', '1203');
        } catch (error) {
            return false;
        }
        if (window.localStorage.getItem('checkLocalStorage') !== '1203') {
            return false;
        }
        window.localStorage.removeItem('checkLocalStorage');
        return true;
    }
    /**
     * 写入
     * @param key 键名
     * @param value 值
     */
    setValue(key, value) {
        if (this._localStorageStatus) {
            let data = JSON.stringify({ value: value, time: new Date().getTime() });
            try {
                window.localStorage.setItem(key, data);
            } catch (error) {
                if (error.name === 'QUOTA_EXCEEDED_ERR') { //存储已满，清空所有
                    window.localStorage.clear();
                }
                console.log(error);
            }
        }
    }

    /**
     * 读取
     * @param key 键名
     * @param expired 到期日
     */
    getValue(key, expired) {
        if (this._localStorageStatus) {
            let value = window.localStorage.getItem(key);
            if (value !== null) {
                let dataObj = JSON.parse(value);
                if (new Date().getTime() - dataObj.time > expired) {
                    window.localStorage.removeItem(key);
                    return null;
                } else {
                    return dataObj.value;
                }
            } else {
                return null;
            }
        }
        return null;
    }

    /**
     * 删除
     * @param key 键名
     */
    deleteValue(key) {
        if (this._localStorageStatus) {
            window.localStorage.removeItem(key);
        }
    }

    /**
     * 清除所有
     */
    clear() {
        if (this._localStorageStatus) {
            window.localStorage.clear();
        }
    }
}

//初始化存储
const storage = new Storage();
/*=====================================================================================================*/

/*===============================================  配置  ===============================================*/
/**
 * 评分来源网站配置
 */
const rateSiteSourceConfig = {
    'yousuu': {
        name: 'yousuu',
        //url前缀
        prefix: 'http://www.yousuu.com/book/',
        //请求参数
        request(bookInfo) {
            return {
                method: "GET",
                url: 'https://api.yousuu.com/api/search/?type=title&value=' + bookInfo.bookName,
            }
        },
        //解析
        parse(bookInfo, response) {
            let rateInfo = { score: 0, num: 0, url: '', match: false };
            let i = 0;
            for (let item of JSON.parse(response.responseText).data.books) {
                i++;
                //超过最大计数,退出
                if (i >= bookInfo.maxNum) {
                    break;
                }
                if (item.bookId === bookInfo.bookId || (item.author == bookInfo.bookAuthor && item.title == bookInfo.bookName)) {
                    rateInfo.score = Number.parseFloat(item.score / 10).toFixed(1);
                    rateInfo.num = Math.round(Number.parseFloat(item.scorerCount));
                    rateInfo.url = this.prefix + item.bookId;
                    rateInfo.match = true;
                    break;
                }
            }
            return rateInfo;
        }
    },
}

/**
 * 需添加评分网站的路由配置
 * 根据页面转换为 rateSiteTargetConfig 的键名
 */
const rateSiteTargetRoute = {
    'www.zxcs.me': () => {
        let tag = location.pathname.split('/')[1];
        let prefix = 'zxcs8.';
        if (tag === 'post') {
            return prefix + 'post';
        }
        if (['sort', 'tag', 'author'].includes(tag)) {
            return prefix + 'sort';
        }
        // 搜索页面
        if (location.pathname.includes('index.php')) {
            return prefix + 'sort';
        }
    },
    'zxcs.me': () => {
        let tag = location.pathname.split('/')[1];
        let prefix = 'zxcs8.';
        if (tag === 'post') {
            return prefix + 'post';
        }
        if (['sort', 'tag', 'author'].includes(tag)) {
            return prefix + 'sort';
        }
        // 搜索页面
        if (location.pathname.includes('index.php')) {
            return prefix + 'sort';
        }
    },
    'zxcstxt.com': () => {
        let tag = location.pathname.split('/')[1];
        let prefix = 'zxcstxt.';
        if (/^(\d)+$/.test(tag)) {
            return prefix + 'post';
        }
        return prefix + 'sort';
    },
    'www.zadzs.com': () => {
        let pathname = location.pathname;
        let prefix = 'zadzs.';
        if (pathname.includes('txt')) {
            return prefix + 'detail';
        }
        if (pathname.includes('search')) {
            return prefix + 'search';
        }
    },
    'www.15huang.com': () => {
        let pathname = location.pathname;
        let prefix = '15huang.';
        // 搜索结果 || 作者
        if (pathname == '/e/search/result/') {
            return prefix + 'category';
        }

        // 详情页
        if (pathname.includes('.html')) {
            return prefix + 'detail';
        }
        return prefix + 'category';
    },
    'www.ibiquta.com': () => {
        let pathname = location.pathname;
        let prefix = '3uww.';
        // 排行
        if (pathname.includes('top')) {
            return prefix + 'category';
        }
        // 详情
        if (pathname.includes('down')) {
            return prefix + 'detail';
        }
        // 作者
        if (pathname.includes('author')) {
            return prefix + 'author';
        }
        // 分类
        if (pathname.search(/soft(\d+)/ig) !== -1) {
            return prefix + 'category';
        }
        // 搜索
        if (pathname.includes('search')) {
            return prefix + 'search';
        }
    },
    'www.wanbentxt.com': () => {
        let pathname = location.pathname;
        let prefix = 'wanbentxt.';
        //详情页(/数字/)
        if (/\/(\d)+\//.test(pathname)) {
            return prefix + 'detail';
        }
    },
    'www.yuzuhon.com': () => {
        let pathname = location.pathname;
        let prefix = 'yuzuhon.';
        if (/^\/book\/\d+$/.test(pathname)) {
            return prefix + 'detail';
        }
    },
    'www.zxcs.info': () => {
        let tag = location.pathname.split('/')[1];
        if (tag === 'post') {
            return 'zxcsinfo.post';
        }
        let prefix = 'zxcs8.';
        if (['sort', 'tag', 'author'].includes(tag)) {
            return prefix + 'sort';
        }
        // 搜索页面
        if (location.pathname.includes('index.php')) {
            return prefix + 'sort';
        }
    },
    'zxcs.info': () => {
        let tag = location.pathname.split('/')[1];
        if (tag === 'post') {
            return 'zxcsinfo.post';
        }
        let prefix = 'zxcs8.';
        if (['sort', 'tag', 'author'].includes(tag)) {
            return prefix + 'sort';
        }
        // 搜索页面
        if (location.pathname.includes('index.php')) {
            return prefix + 'sort';
        }
    },
    'zxcsol.com': () => {
        let tag = location.pathname.split('/')[2];
        let prefix = 'zxcstxt.';
        if (/^(\d)+(\.)html/.test(tag)) {
            return prefix + 'post';
        }
        return prefix + 'sort';
    },
    'www.yousuu.com': () => {
        let tag = location.pathname.split('/')[1];
        let prefix = 'yousuu.';
        switch (tag) {
            case 'booklist':
            case 'explore':
                return prefix + tag;
            default:
                break;
        }
    },
};

/**
 * 需添加评分网站的配置
 */
const rateSiteTargetConfig = {
    'zxcs8.post': {
        name: 'zxcs8.post',
        bookName(item) {
            return item.querySelector('h1').innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.querySelector('h1').innerText);
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<p class="yinyong"><span style="font-size:14px;color:#FF0000;font-weight:bold">优书网评分: <a href = "'
                + bookLink + '" target="_blank">' + rate +
                '</a></span><p><p class="yinyong"><span style="font-size:14px;color:#FF0000;font-weight:bold">评分人数: ' + rateNum + '</span><p>';
        },
        anchorObj(item) {
            let obj = item.querySelector('.yinyong');
            return !obj ? item.querySelector('.pagefujian') : obj;
        },
        anchorPos: 'beforebegin',
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    'zxcs8.sort': {
        name: 'zxcs8.sort',
        bookName(item) {
            return item.firstElementChild.innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.firstElementChild.innerText);
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<a href= "' + bookLink + '" target = "_blank">&nbsp;&nbsp;&nbsp;评分：' + rate + '&nbsp;&nbsp;&nbsp;人数：' + rateNum + '</a>'
        },
        anchorObj(item) {
            return item.lastElementChild.querySelector('div');
        },
        anchorPos: 'beforebegin',
        handler(options, callback) {
            let bookList = Array.from(document.querySelectorAll('#plist'));
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    'zxcsinfo.post': {
        name: 'zxcsinfo.post',
        bookName(item) {
            return item.querySelector('h1').innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return item.querySelector("div.book-info > p.intro").innerText.split("著")[0].trim();
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<p class="intro" style="font-size:14px">评分：<a target = "_blank" href="${bookLink}">${rate}</a> 人数：${rateNum}</p>`;
        },
        anchorObj(item) {
            return item.querySelector('div.book-info > p.intro');
        },
        anchorPos: 'afterend',
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    'zadzs.detail': {
        name: 'zadzs.detail',
        bookName(item) {
            return item.querySelector('h3[title]').title;
        },
        bookAuthor(item) {
            return item.querySelector('h3[title]>span>a').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<tr><td width="42px">评分：</td><td><a href="' + bookLink + '" target = "blank">' +
                rate + '</a></td></tr><tr><td width="42px">人数：</td><td>' + rateNum + '</td></tr>';
        },
        anchorObj(item) {
            return item.querySelector('.m-bookstatus>table>tbody');
        },
        anchorPos: "afterbegin",
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    'zadzs.search': {
        name: 'zadzs.search',
        bookName(item) {
            return item.querySelector('.book>h5>a').innerText;
        },
        bookAuthor(item) {
            return getAuthorName(item.querySelector('.book>.price').innerText);
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<p class="price">评分：<a href="' + bookLink + '" target="_blank">' + rate + '</a>&nbsp;&nbsp;人数：' + rateNum + '</p>';
        },
        anchorObj(item) {
            return item.querySelector('.book>.disc');
        },
        anchorPos: "beforebegin",
        handler(options, callback) {
            let bookList = Array.from(document.querySelectorAll('.searchItem'));
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    '15huang.detail': {
        name: '15huang.detail',
        bookName(item) {
            return item.querySelector('.row>h1').innerText;
        },
        bookAuthor(item) {
            return item.querySelector('p.book-writer>a').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<p class="book-writer">优书评分：<a href="' + bookLink + '" target="_blank">' +
                rate + '</a></p><p class="book-writer">评分人数：' + rateNum + '</p>';
        },
        anchorObj(item) {
            return item.querySelector('p.book-writer');
        },
        anchorPos: "afterend",
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    '15huang.category': {
        name: '15huang.category',
        bookName(item) {
            return item.querySelector('h4.ellipsis').innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return item.querySelector('span.writer').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<em>|</em><span><a href="' + bookLink + '" target="_blank">' +
                rate + '分</a></span><em>|</em><span>' + rateNum + '人</span>';
        },
        anchorObj(item) {
            return item.querySelector('p.info.hei9.ellipsis');
        },
        anchorPos: "beforeend",
        handler(options, callback) {
            let bookList = Array.from(document.querySelectorAll("li.cate-infobox.col.xs-24.md-12"));
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    '3uww.detail': {
        name: '3uww.detail',
        bookName(item) {
            return item.querySelector('#downInfoTitle').innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return item.querySelector('.downInfoRowL>a').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<b>书籍评分：</b><a href="' + bookLink + '" class="strong blue" target="_blank">' +
                rate + '</a><br><b>评价人数：</b>' + rateNum + '<br>';
        },
        anchorObj(item) {
            return item.querySelector('.downInfoRowL>a').parentNode;
        },
        anchorPos: "beforeend",
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    '3uww.author': {
        name: '3uww.author',
        bookName(item) {
            return item.querySelector('.txt99>h2>a').innerText;
        },
        bookAuthor(item) {
            return document.querySelector('#Li1').innerText.replace(/的小说/ig, "");
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<div>书籍评分：<i><a href="' + bookLink + '" class="strong blue" target="_blank">' +
                rate + '</a></i></div><div>评分人数：<i>' + rateNum + '</i></div>';
        },
        anchorObj(item) {
            return item.querySelector('.txt99>ul').children[2];
        },
        anchorPos: "afterbegin",
        handler(options, callback) {
            let bookList = Array.from(document.querySelectorAll('.pinglw'));
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    '3uww.category': {
        name: '3uww.category',
        bookName(item) {
            return item.info.querySelector('span.mainSoftName>a').innerText;
        },
        bookAuthor(item) {
            return item.bottom.querySelectorAll('.mainRunSystem')[1].innerText.replace(/书籍作者：/ig, "").trim();
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '<div class="mainAccredit"><span class="mainGreen">书籍评分：<a href = "' + bookLink + '" target = "_blank" ><u>'
                + rate + '</u></a></span></div><div class="mainstar"><span class="mainGreen">评分人数：</span>' + rateNum + '</div>'
        },
        anchorObj(item) {
            return item.bottom.querySelector('.mainRunSystem');
        },
        anchorPos: "afterend",
        handler(options, callback) {
            let bookInfo = Array.from(document.querySelectorAll('.mainListInfo'));
            let bookBottom = Array.from(document.querySelectorAll('.mainListBottom'));
            bookInfo.forEach((value, index) => {
                callback({ site: this.name, item: { info: value, bottom: bookBottom[index] }, ...options });
            });
        },
    },
    '3uww.search': {
        name: '3uww.search',
        bookName(item) {
            return item.info.querySelector('a').innerText.split('/')[0];
        },
        bookAuthor(item) {
            return item.info.querySelector('a').innerText.split('/')[1].replace(/作者：/ig, "");
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return '&nbsp;&nbsp;评分：<a href="' + bookLink + '" target="_blank"><span style="color:#0066FF">' + rate + '</span></a>&nbsp;&nbsp;人数：' + rateNum;
        },
        anchorObj(item) {
            return item.bottom.querySelector('.oldDate');
        },
        anchorPos: "afterend",
        handler(options, callback) {
            let bookInfo = Array.from(document.querySelectorAll('.searchTopic'));
            let bookBottom = Array.from(document.querySelectorAll('.searchInfo'));
            bookInfo.forEach((value, index) => {
                callback({ site: this.name, item: { info: value, bottom: bookBottom[index] }, ...options });
            });
        }
    },
    'wanbentxt.detail': {
        name: 'wanbentxt.detail',
        bookName(item) {
            return item.querySelector('div.contentDiv > div > div.detail > div.detailTop > div.detailTopMid > div.detailTitle > h1').innerText;
        },
        bookAuthor(item) {
            return item.querySelector('div.contentDiv > div > div.detail > div.detailTop > div.detailTopMid > div.writer > a').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<tr>
                    <td width="10%"><span>书籍评分：</span></td>
                    <td width="10%"><a href="${bookLink}" target="_blank">${rate}</a></td>
                    <td width="10%"><span>评分人数：</span></td>
                    <td width="10%">${rateNum}</td>
                </tr>`;

        },
        anchorObj(item) {
            return item.querySelector('div.detail > div.detailTop > div.detailTopMid > table > tbody').firstElementChild;
        },
        anchorPos: "afterend",
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    'wanbentxt.category': {
        name: 'wanbentxt.category',
        bookName(item) {
            return item.querySelector('div.sortPhr > a').innerText;
        },
        bookAuthor(item) {
            return item.querySelector('div.sortPhr > p.author > a').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<p class="actor" style="margin-top: 7px"><em>评分：</em><a href="${bookLink}" target="_blank">${rate}</a>&nbsp;&nbsp;&nbsp;&nbsp;人数：${rateNum}</p>`;
        },
        anchorObj(item) {
            return item.querySelector('div.sortPhr > p.actor');
        },
        anchorPos: "afterend",
        handler(options, callback) {
            let bookList = Array.from(document.querySelector('div.contentDiv > div > div.sortBottom > div.sortList > ul').children);
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    'yuzuhon.detail': {
        name: 'yuzuhon.detail',
        bookName(item) {
            return item.querySelector("#__layout > div > div.app-main > div > div.container > div.book-info-section > h2").innerText;
        },
        bookAuthor(item) {
            return item.querySelector("#__layout > div > div.app-main > div > div.container > div.book-info-section > div > div.book-info__metadata > div > span > a").innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            let rateStars = this._packageStar(Math.round(rate / 2 * 10) / 10, 5);
            return `<div style="padding: 15px 0px; border-top: 1px solid rgb(234, 234, 234);">
                        <span class="text-secondary"><a href="${bookLink}" target="_blank">优书网</a></span>
                        <div class="d-flex align-items-center mb-2">
                            <div class="book-info__rate"><strong>${rate}</strong></div>
                            <div class="book-info__star">
                                <div class="rate">
                                    ${rateStars}
                                </div>
                                <span> ${rateNum} 人评分 </span>
                            </div>
                        </div>
                    </div>`;
        },
        anchorObj(item) {
            return item.querySelector("#__layout > div > div.app-main > div > div.container > div.book-info-section > div > div.book-info__rate-block.mb-3");
        },
        anchorPos: "beforeend",
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
        _fullStar() {
            return `<span class="el-rate__item" style="cursor: auto;">
                        <i class="el-rate__icon el-icon-star-on" style="color: rgb(235, 159, 43);"></i>
                    </span>`;
        },
        _halfStar() {
            return `<span class="el-rate__item" style="cursor: auto;">
                        <i class="el-rate__icon el-icon-star-on" style="color: rgb(218, 218, 218);">
                            <i class="el-rate__decimal el-icon-star-on" style="color: rgb(235, 159, 43); width: 50%;"></i>
                        </i>
                    </span>`;
        },
        _emptyStar() {
            return `<span class="el-rate__item" style="cursor: auto;">
                        <i class="el-rate__icon el-icon-star-on" style="color: rgb(218, 218, 218);"></i>
                    </span>`;
        },
        _starsTemplate(rate, total, stars) {
            return `<div class="rate">
                        <div role="slider" aria-valuenow="${rate}" aria-valuetext="" aria-valuemin="0" aria-valuemax="${total}" tabindex="0" class="el-rate">
                            ${stars}
                        </div>
                    </div> `;
        },
        _packageStar(rate, total) {
            let stars = '';
            if (rate < 0) {
                for (let i = 0; i < total; i++) {
                    stars += this._emptyStar();
                }
                return this._starsTemplate(rate, total, stars);
            }
            let fullStars = Math.floor(rate);
            let emptyStars = total - Math.ceil(rate);
            let halfStars = total - fullStars - emptyStars;
            for (let i = 0; i < fullStars; i++) {
                stars += this._fullStar();
            }
            for (let j = 0; j < halfStars; j++) {
                stars += this._halfStar();
            }
            for (let k = 0; k < emptyStars; k++) {
                stars += this._emptyStar();
            }
            return this._starsTemplate(rate, total, stars);
        },
    },
    'yousuu.booklist': {
        name: 'yousuu.booklist',
        _utils: {},
        prepare() {
            //获取dataV的值
            let node = document.querySelector('p.book-info-update');
            let dataV = node.innerHTML.match(/data-v-(\w+)/g);
            this._utils.dataV = dataV;
        },
        bookName(item) {
            return item.querySelector('a.book-name').innerText;
        },
        bookAuthor(item) {
            return item.querySelector('a.author-name.ellipsis').innerText;
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<p class="book-info-update" ${this._utils.dataV}="">评分：${rate}&nbsp;&nbsp;&nbsp;&nbsp;人数：${rateNum}</p>`
        },
        anchorObj(item) {
            return item.querySelector('p.book-info-update');
        },
        anchorPos: "afterend",
        handler(options, callback) {
            this.prepare();
            let bookList = Array.from(document.querySelectorAll('div.common-card-layout.booklist-book-item'));
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    'yousuu.explore': {
        name: 'yousuu.explpre',
        _utils: {},
        _checkedClassName: 'gmRateChecked',
        prepare() {
            //获取dataV的值
            let node = document.querySelector('div.comment-content.comment');
            let dataV = node.innerHTML.match(/data-v-(\w+)/g);
            this._utils.dataV = dataV.shift();
        },
        bookName(item) {
            return item.getAttribute('booktitle') || item.querySelector('div.author-info > div.book-name-and-score.space-praiseCom-BookTitleScore-margin > a').innerText;
        },
        bookAuthor(item) {
            //explore 页面没有作者信息
            return null;
        },
        bookId(item) {
            return parseInt(item.getAttribute('bookid'));
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<div ${this._utils.dataV}="" class="comment-content-inner default" style="color:grey">评分：${rate}&nbsp;&nbsp;&nbsp;&nbsp;人数：${rateNum}</div>`
        },
        anchorObj(item) {
            return item.querySelector('div.comment-content-inner.default');
        },
        anchorPos: "beforebegin",
        handler(options, callback) {
            this.prepare();
            let bookList = Array.from(document.querySelectorAll(`div.comment-card.BookCommentItem:not(.${this._checkedClassName})`));
            bookList.forEach((item) => {
                //无限滚动 Feed 流，加个标签区分一下
                item.classList.add(this._checkedClassName);
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
    'zxcstxt.post': {
        name: 'zxcstxt.post',
        bookName(item) {
            return item.querySelector('h1').innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.querySelector('h1').innerText);
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<p style="font-weight:bold">【评分】:<br><a href="${bookLink}" target="_blank">优书网: ${rate}</a>&nbsp;&nbsp;人数: ${rateNum}</p>`;
        },
        anchorObj(item) {
            return item.querySelector('div.theme-box.wp-posts-content > p');
        },
        anchorPos: 'afterend',
        handler(options, callback) {
            callback({ site: this.name, item: document, ...options });
        },
    },
    'zxcstxt.sort': {
        name: 'zxcstxt.sort',
        bookName(item) {
            return item.firstElementChild.innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.firstElementChild.innerText);
        },
        maxNum: MAX_SEARCH_NUM,
        rateItem(rate, rateNum, bookLink) {
            return `<div class="item-tags scroll-x no-scrollbar mb6">
            <a class="but c-blue" href="${bookLink}" target="_blank"><i class="fa fa-book" aria-hidden="true"></i>评分: ${rate}&nbsp;&nbsp;人数: ${rateNum}</a></div>`;
        },
        anchorObj(item) {
            return item.querySelector('.item-meta');
        },
        anchorPos: 'beforebegin',
        handler(options, callback) {
            let bookList = Array.from(document.querySelectorAll('.posts-item'));
            bookList.forEach((item) => {
                callback({ site: this.name, item: item, ...options });
            });
        },
    },
};

/**
 * 下载链接来源网站配置
 */
const downloadSiteSourceConfig = {
    'zxcs8': {
        name: 'zxcs8',
        siteName: '知轩藏书',
        host: 'http://zxcs.me',
        searchConfig(args) {
            return { url: this.host + '/index.php?keyword=' + args.bookName, method: "GET" };
        },
        bookList(item) {
            return Array.from(item.getElementsByTagName('dl'));
        },
        bookName(item) {
            return item.children["0"].innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.children["0"].innerText);
        },
        bookLink(item) {
            let url = item.children["0"].getElementsByTagName('a')[0].href;
            return handleUrl(url,location.origin,this.host);     
        },
        downloadLink(item) {
            let url = item.querySelector('.down_2>a').href;
            return handleUrl(url,location.origin,this.host);  
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_FETCH })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'nordfxs': {
        name: 'nordfxs',
        siteName: '龙凤互联',
        host: 'https://www.zvzee.com',
        searchConfig(args) {
            let data = 'formhash=191940c0&srchtxt=' + args.bookName + '&searchsubmit=yes';
            let headers = { "Content-Type": "application/x-www-form-urlencoded" };
            return { url: this.host + '/search.php?mod=forum', data: data, method: "POST", headers: headers };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll('.pbw'));
        },
        bookName(item) {
            return item.querySelector('.xs3>a').innerText.split('（').shift().replace(/[《,》]/g, '');
        },
        bookAuthor(item) {
            return getAuthorName(item.querySelector('.xs3>a').innerText);
        },
        bookLink(item) {
            return item.querySelector('.xs3>a').href;
        },
        downloadLink(item) {
            return item.querySelector('.xs3>a').href;
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    '15huang': {
        name: '15huang',
        siteName: '书荒网',
        host: 'http://www.15huang.com',
        searchConfig(args) {
            let data = 'show=title%2Cwriter%2Ckeyboard&tbname=news&tempid=1&keyboard=' + encodeURIComponent(args.bookName);
            let headers = { "Content-Type": "application/x-www-form-urlencoded", "Cookie": "alllclastsearchtime=" + (Date.parse(new Date) / 1000 - 480) };
            return { url: this.host + '/e/search/index.php', data: data, method: "POST", headers: headers, anonymous: true };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll("li.cate-infobox.col.xs-24.md-12"));
        },
        bookName(item) {
            return item.querySelector('h4.ellipsis').innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return item.querySelector('span.writer').innerText;
        },
        bookLink(item) {
            return item.querySelector('a.open.bg-hui-hover').href;
        },
        downloadLink(item) {
            return this.host + item.querySelector('.downurl.col.xs-24.md-5>a').href.replace(location.origin, '');
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_FETCH })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    '3uww': {
        name: '3uww',
        siteName: '炫书网',
        host: 'https://www.ibiquta.com',
        searchConfig(args) {
            let data = 'searchkey=' + args.bookName;
            let headers = { "Content-Type": "application/x-www-form-urlencoded" };
            return { url: this.host + '/search.html', data: data, method: "POST", headers: headers };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll('.searchTopic'));
        },
        bookName(item) {
            return item.querySelector('a').innerText.split('/')[0];
        },
        bookAuthor(item) {
            return item.querySelector('a').innerText.split('/')[1].replace(/作者：/ig, "");
        },
        bookLink(item) {
            return item.querySelector('a').href;
        },
        downloadLink(item) {
            return item.querySelector('.downAddress_li>a').href;
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_FETCH })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'ixdzs': {
        name: 'ixdzs',
        siteName: '爱下电子书',
        host: 'https://www.aixdzs.com',
        searchConfig(args) {
            return { url: this.host + '/bsearch?q=' + args.bookName, method: "GET" };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll('div.box_k>ul>li'));
        },
        bookName(item) {
            return item.querySelector('h2.b_name>a').innerText;
        },
        bookAuthor(item) {
            return item.querySelector('p.b_info>span>a').innerText;
        },
        bookLink(item) {
            return this.host + item.querySelector('h2.b_name>a').href.replace(location.origin, '');
        },
        downloadLink(item) {
            return this.host + item.querySelector('h2.b_name>a').href.replace(location.origin, '');
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'wanbentxt': {
        name: 'wanbentxt',
        siteName: '完本神站',
        host: 'https://www.wanbentxt.com',
        _isBookList: false,
        _isBookListChecked: false,
        _isBlockedBySearchTimeGap: false,
        _isBlockedBySearchTimeGapChecked: false,
        _isCurrentBookList(item) {
            //如果匹配到的搜索结果只有一条, 会直接进入对应的书籍详情页，因此需要判断一下
            if (!this._isBookListChecked) {
                this._isBookList = !item.querySelector('div.contentDiv > div > div.detail');
                this._isBookListChecked = true;
            }
            return this._isBookList;
        },
        _isCurrentBlockedBySearchTimeGap(item) {
            //由于搜索时间间隔过短被限制
            if (!this._isBlockedBySearchTimeGapChecked) {
                this._isBlockedBySearchTimeGap = (item.querySelector("div.blockcontent") || { innerText: '' }).innerText.includes('间隔时间不得少于');
                this._isBlockedBySearchTimeGapChecked = true;
            }
            return this._isBlockedBySearchTimeGap;
        },
        searchConfig(args) {
            let data = 'searchtype=articlename&searchkey=' + GBK.URI.encodeURI(args.bookName);
            let headers = { "Content-Type": "application/x-www-form-urlencoded;charset=gbk", "Cookie": "jieqiVisitTime=jieqiArticlesearchTime%3d" + (Date.parse(new Date) / 1000 - 240) };
            let details = { url: this.host + '/modules/article/search.php', data: data, method: 'POST', headers: headers, overrideMimeType: 'text/html;charset=gbk' };
            //Tampermonkey 有个BUG, anonymous = true 时 overrideMimeType 无效
            if (!isTampermonkey()) {
                Object.assign(details, { anonymous: true });
            }
            return details;

        },
        bookList(item) {
            //检查是否由于搜索时间间隔问题而被限制
            this._isCurrentBlockedBySearchTimeGap(item);
            //书籍详情页, 包装下 html 直接返回即可
            if (this._isCurrentBookList(item)) {
                return Array.from(item.querySelectorAll('body > div.contentDiv > div > div.result > div.resultLeft > ul > li'));
            }
            return Array.from(item.querySelectorAll('body'));

        },
        bookName(item) {
            if (this._isCurrentBookList(item)) {
                return item.querySelector('div.sortPhr > a').innerText;
            }
            return item.querySelector('div.contentDiv > div > div.detail > div.detailTop > div.detailTopMid > div.detailTitle > h1').innerText;
        },
        bookAuthor(item) {
            if (this._isCurrentBookList(item)) {
                return item.querySelector('div.sortPhr > p.author > a').innerText;
            }
            return item.querySelector('div.contentDiv > div > div.detail > div.detailTop > div.detailTopMid > div.writer > a').innerText;
        },
        bookLink(item) {
            let href;
            if (this._isCurrentBookList(item)) {
                href = item.querySelector('div.sortPhr > a').href;
            } else {
                href = item.querySelector('div.contentDiv > div > div.route').lastElementChild.href;
            }
            return handleUrl(url,location.origin,this.host);
        },
        downloadLink(item) {
            return this.host + '/down' + this.bookLink(item).replace(location.origin, '').replace(this.host, '');
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_PROCESS })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
        //bookLink是否应该添加缓存
        shouldCacheBookLink(options) {
            return !this._isCurrentBlockedBySearchTimeGap(options.item);
        },
    },
    'afs360': {
        name: 'afs360',
        siteName: '万书网',
        host: 'https://www.afs360.com',
        searchConfig(args) {
            let data = 'show=title&keyboard=' + args.bookName;
            let headers = { "Content-Type": "application/x-www-form-urlencoded", "Cookie": "txt2017lastsearchtime=" + (Date.parse(new Date) / 1000 - 480) };
            return { url: this.host + '/e/search/index.php', data: data, method: "POST", headers: headers, anonymous: true };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll("tr > td > table.box > tbody > tr > td > h2"));
        },
        bookName(item) {
            return item.querySelector('a').innerText;
        },
        bookAuthor(item) {
            return item.lastChild.textContent.slice(1, -1);
        },
        bookLink(item) {
            return this.host + item.querySelector('a').href.replace(location.origin, '').replace(this.host, '');
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'auzw': {
        name: 'auzw',
        siteName: '傲世中文网',
        host: 'https://www.auzw.com',
        searchConfig(args) {
            return { url: this.host + '/search.php?q=' + args.bookName, method: "GET" };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll("div > div> div.book_info"));
        },
        bookName(item) {
            return item.querySelector("a").innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return item.querySelector("p.nowrap > a").innerText;
        },
        bookLink(item) {
            return this.host + item.querySelector('a').href.replace(location.origin, '').replace(this.host, '');
        },
        downloadLink(item) {
            return this.host + item.querySelector('small > a').href.replace(location.origin, '').replace(this.host, '');
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_PROCESS })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'mianhuatang': {
        name: 'mianhuatang',
        siteName: '棉花糖小说网',
        host: 'http://www.mhtwx.la',
        searchConfig(args) {
            let data = 'searchkey=' + args.bookName;
            let headers = { "Content-Type": "application/x-www-form-urlencoded" };
            return { url: this.host + '/search.php', data: data, method: "POST", headers: headers };
        },
        bookList(item) {
            //从第一行开始, 去除表头
            return Array.from(item.querySelectorAll("div.main > div > table > tbody > tr")).slice(1);
        },
        bookName(item) {
            return item.querySelector("a").innerText;
        },
        bookAuthor(item) {
            return item.children[2].innerText;
        },
        bookLink(item) {
            return this.host + item.querySelector('a').href.replace(location.origin, '').replace(this.host, '');
        },
        downloadLink(item) {
            let bookId = this.bookLink(item).match(/\/(\d+)\/$/)[1];
            return this.host + `/down/txt${bookId}.html`;
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_PROCESS })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'balingtxt': {
        name: 'balingtxt',
        siteName: '八零电子书',
        host: 'http://www.balingtxt.com',
        searchConfig(args) {
            let data = 'searchkey=' + args.bookName + '&s=18140131260432570322';
            let headers = { "Content-Type": "application/x-www-form-urlencoded" };
            return { url: this.host + '/modules/article/search.php', data: data, method: "POST", headers: headers };
        },
        bookList(item) {
            //从第一行开始, 去除表头
            return Array.from(item.querySelectorAll("#content > div > ul > li.storelistbt5a"));
        },
        bookName(item) {
            return item.querySelector("a.bookname").innerText.match(/《(.*?)》/)[1];
        },
        bookAuthor(item) {
            return item.querySelector("p > a").innerText;
        },
        bookLink(item) {
            return this.host + item.querySelector('a.bookname').href.replace(location.origin, '').replace(this.host, '');
        },
        downloadLink(item) {
            return this.bookLink(item).replace('.html', '/down.html');
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_PROCESS })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'dushuxiaozi': {
        name: 'dushuxiaozi',
        siteName: '读书小子',
        host: 'https://www.dushuxiaozi.com',
        searchConfig(args) {
            return { url: this.host + '/?s=' + args.bookName, method: "GET" };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll("#main > ul > li.entry-title > a"));
        },
        bookName(item) {
            return item.innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.innerText);
        },
        bookLink(item) {
            return item.href.replace(location.origin, '');
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'jingjiaocangshu': {
        name: 'jingjiaocangshu',
        siteName: '精校藏书',
        host: 'https://jingjiaocangshu.cn',
        searchConfig(args) {
            return { url: this.host + '/?s=' + args.bookName, method: "GET" };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll("#primary-home > article"));
        },
        bookName(item) {
            return item.querySelector("header > h1").innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.querySelector("header > h1").innerText);
        },
        bookLink(item) {
            //实际是下载链接
            return this.host + item.querySelector("div.entry-content > div > div > a").href.replace(location.origin, '').replace(this.host, '');
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'kenshula': {
        name: 'kenshula',
        siteName: '啃书啦',
        host: 'https://www.kenshula.com',
        _isBookList: false,
        _isBookListChecked: false,
        _isCurrentBookList(item) {
            //如果匹配到的搜索结果只有一条, 会直接进入对应的书籍详情页，因此需要判断一下
            if (!this._isBookListChecked) {
                this._isBookList = item.querySelector('#conn > div > div.fleft.column-l > div > div.search-title');
                this._isBookListChecked = true;
            }
            return this._isBookList;
        },
        searchConfig(args) {
            let data = 'area=2&searchkey=' + GBK.URI.encodeURI(args.bookName);
            let headers = { "Content-Type": "application/x-www-form-urlencoded" };
            return { url: this.host + '/modules/article/search.php', data: data, method: 'POST', headers: headers, overrideMimeType: 'text/html;charset=gbk', anonymous: true };

        },
        bookList(item) {
            if (this._isCurrentBookList(item)) {
                return Array.from(item.querySelectorAll('#conn > div > div.fleft.column-l > div > ul > li'));
            }
            return Array.from(item.querySelectorAll('head'));

        },
        bookName(item) {
            if (this._isCurrentBookList(item)) {
                return item.querySelector("div > h3 > a").innerText;
            }
            return item.querySelector('meta[property="og:novel:book_name"]').getAttribute("content");
        },
        bookAuthor(item) {
            if (this._isCurrentBookList(item)) {
                return item.querySelector("p.author").lastChild.wholeText;
            }
            return item.querySelector('meta[property="og:novel:author"]').getAttribute("content");
        },
        bookLink(item) {
            if (this._isCurrentBookList(item)) {
                return this.host + item.querySelector("div > h3 > a").href.replace(location.origin, '').replace(this.host, '');
            }
            return item.querySelector('meta[property="og:novel:read_url"]').getAttribute("content");
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'wucuo8': {
        name: 'wucuo8',
        siteName: '无错吧',
        host: 'https://www.wucuo8.com',
        searchConfig(args) {
            let data = 'tempid=1&tbname=xs&show=writer,title&keyboard=' + args.bookName;
            let headers = { "Content-Type": "application/x-www-form-urlencoded", "Cookie": "swmmjlastsearchtime=" + (Date.parse(new Date) / 1000 - 480) };
            return { url: this.host + '/e/search/index.php', data: data, method: "POST", headers: headers, anonymous: true };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll("div.row.md.bread.w15-1 > div > div"));
        },
        bookName(item) {
            return item.querySelector("div.xq > h2 > a").innerText.split("t")[0];
        },
        bookAuthor(item) {
            return item.querySelector("div.xq > p.writer.ellipsis").innerText.split("|")[2].replace(/\s/g, '');
        },
        bookLink(item) {
            return this.host + item.querySelector("div.xq > h2 > a").href.replace(location.origin, '').replace(this.host, '');
        },
        downloadLink(item) {
            let url = item.querySelector("div.col.xs-24.md-9.loadbutton > a").href;
            return handleUrl(url,location.origin,this.host);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'zxcsinfo': {
        name: 'zxcsinfo',
        siteName: '知轩藏书(info)',
        host: 'https://www.zxcs.info',
        searchConfig(args) {
            return { url: this.host + '/index.php?keyword=' + args.bookName, method: "GET" };
        },
        bookList(item) {
            return Array.from(item.getElementsByTagName('dl'));
        },
        bookName(item) {
            return item.children["0"].innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.children["0"].innerText);
        },
        bookLink(item) {
            let url = item.children["0"].getElementsByTagName('a')[0].href;
            return handleUrl(url,location.origin,this.host);  
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
        // type: DOWNLOAD_TYPE_FETCH 需设置
        fetchConfig(options) {
            return { url: options.url, method: 'GET' };
        },
    },
    'zxcstxt': {
        name: 'zxcstxt',
        siteName: '知轩藏书(txt)',
        host: 'https://zxcstxt.com',
        searchConfig(args) {
            return { url: this.host + '/?s=' + args.bookName + '&type=post', method: "GET" };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll('.posts-item'));
        },
        bookName(item) {
            return item.children["0"].innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.children["0"].innerText);
        },
        bookLink(item) {
            let url = item.children["0"].getElementsByTagName('a')[0].href;
            let bookId = parseInt(url.split("/").pop());
            return `${this.host}/download?post=${bookId}`
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
    },
    'zxcsol': {
        name: 'zxcsol',
        siteName: '知轩藏书(ol)',
        host: 'https://zxcsol.com',
        searchConfig(args) {
            return { url: this.host + '/?s=' + args.bookName + '&type=post', method: "GET" };
        },
        bookList(item) {
            return Array.from(item.querySelectorAll('.posts-item'));
        },
        bookName(item) {
            return item.children["0"].innerText.match('《(.*?)》')[1];
        },
        bookAuthor(item) {
            return getAuthorName(item.children["0"].innerText);
        },
        bookLink(item) {
            let url = item.children["0"].getElementsByTagName('a')[0].href;
            let bookId = parseInt(url.split("/").pop());
            return `${this.host}/download?post=${bookId}`
        },
        downloadLink(item) {
            return this.bookLink(item);
        },
        handler(options) {
            return getDownLoadLink((Object.assign(options, { type: DOWNLOAD_TYPE_DIRECT })));
        },
        parse(bookInfo, handler, response) {
            return parseRawDownloadResponse(bookInfo, handler, response);
        },
    },
};

/**
 * 需要添加下载链接的网站路由
 * 转换为 downloadSiteTargetConfig 的键名
 */
const downloadSiteTargetRoute = {
    'www.yousuu.com': {
        isValid: () => location.pathname.split('/')[1] === 'book',
        targetConfig: () => 'yousuu'

    },
    'www.yuzuhon.com': {
        isValid: () => true,
        targetConfig: () => 'yuzuhon'
    },
};

/**
 * 需要添加下载链接的网站配置
 */
const downloadSiteTargetConfig = {
    'yousuu': {
        name: 'yousuu',
        siteName: '优书网',
        _utils: {},
        //预处理
        prepare() {
            //获取dataV的值
            let node = document.querySelector('div.common-card-layout.main-left-header');
            let dataV = node.outerHTML.match(/data-v-(\w+)/g);
            this._utils.dataV = dataV;
            //插入下载容器
            let content = '<div ' + dataV[0] + '="" class="common-card-layout main-left-header" id="gm-insert-download-box" style="display: none">'
                + '<div ' + dataV[1] + '="" ' + dataV[2] + '="" class="tabs" id="gm-insert-download-content"></div></div>';
            document.querySelector('div.common-card-layout.main-left-header').insertAdjacentHTML('beforebegin', content);
        },
        bookName() {
            return document.querySelector('div.book-info-wrap>div.book-info-detail>h1.book-name').innerText;
        },
        bookAuthor() {
            let author = document.querySelector('div.book-info-wrap>div.book-info-detail>p.book-author>a').innerText;
            if (!author) {
                return '';
            }
            return getAuthorName(author) || author;
        },
        //获取下载链接后的处理
        task(info) {
            let obj = document.querySelector('#gm-insert-download-content');
            let item = '';
            //如果第一次插入,则显示父容器，同时插入标识
            if (obj.parentElement.style.display === 'none') {
                obj.parentElement.setAttribute('style', 'display:run-in');
                item = '<label ' + this._utils.dataV[3] + '="" class="tab current">下载地址</label>';
            }
            item += '<label ' + this._utils.dataV[3] + '="" class="tab"><a href="' + info.downloadLink + '" target="_blank">' + info.siteName + '</a></label>';
            obj.insertAdjacentHTML('beforeend', item);
        },
    },
    'yuzuhon': {
        name: 'yuzuhon',
        siteName: '柚子书',
        //预处理
        prepare() {
            let content =
                `<section class="book-page__section mt-5" id="gm-insert-download-box" style="display: none">
                    <div class="section-head pl-0 border-0">
                        <h2 class="section-head__title">下载地址</h2>
                    </div>
                    <div class="rich-content is-collapsed">
                        <div class="font" id="gm-insert-download-content">
                        </div>
                    </div>
                </section>`;
            //插入下载容器
            document.querySelector('#__layout > div > div.app-main > div > div.container > div > section').insertAdjacentHTML('afterend', content);
        },
        bookName() {
            return document.querySelector("#__layout > div > div.app-main > div > div.container > div.book-info-section > h2").innerText;
        },
        bookAuthor() {
            return document.querySelector("#__layout > div > div.app-main > div > div.container > div.book-info-section > div > div.book-info__metadata > div > span > a").innerText;
        },
        //获取下载链接后的处理
        task(info) {
            let obj = document.querySelector('#gm-insert-download-content');
            let box = document.querySelector('#gm-insert-download-box');
            let item = '';
            //如果第一次插入,则显示父容器，同时插入标识
            if (box.style.display === 'none') {
                box.setAttribute('style', 'display:run-in');
                item = `<a href="${info.downloadLink}" target="_blank" class="">${info.siteName}</a>`;
            } else {
                item =
                    `<span>
                        <span class="dot"></span>
                        <a href="${info.downloadLink}" target="_blank" class="">${info.siteName}</a>
                    </span> `;
            }
            obj.insertAdjacentHTML('beforeend', item);
        },
    }
}

/**
 * 其他链接来源的相关配置
 */
const linkSiteSourceConfig = {
    'baike': {
        name: 'baike',
        siteName: '百度百科',
        link(info) {
            return 'https://baike.baidu.com/search?word=' + info.bookName;
        },
    }
}

/**
 * 需要添加其他链接的网站路由
 * 转换为 downloadSiteTargetConfig 的键名
 */
const linkSiteTargetRoute = {
    'www.yousuu.com': {
        isValid: () => location.pathname.split('/')[1] === 'book',
        targetConfig: () => 'yousuu'
    },
};

/**
 * 需要添加其他链接的网站配置
 */
const linkSiteTargetConfig = {
    'yousuu': {
        name: 'yousuu',
        siteName: '优书网',
        _utils: {},
        //预处理
        prepare() {
            //获取dataV的值
            let node = Array.from(document.querySelectorAll('div.common-card-layout.main-left-header')).pop();
            let dataV = node.outerHTML.match(/data-v-(\w+)/g);
            this._utils.dataV = dataV;
            //插入下载容器
            let content = '<div ' + dataV[0] + '="" class="common-card-layout main-left-header" id="gm-insert-link-box" style="display: none">'
                + '<div ' + dataV[1] + '="" ' + dataV[2] + '="" class="tabs" id="gm-insert-link-content"></div></div>';
            document.querySelector('div.common-card-layout.main-left-header').insertAdjacentHTML('beforebegin', content);
        },
        bookName() {
            return document.querySelector('div.book-info-wrap>div.book-info-detail>h1.book-name').innerText;
        },
        bookAuthor() {
            return document.querySelector('div.book-info-wrap>div.book-info-detail>p.book-author>a').innerText;
        },
        //获取下载链接后的处理
        task(info) {
            let obj = document.querySelector('#gm-insert-link-content');
            let item = '';
            //如果第一次插入,则显示父容器，同时插入标识
            if (obj.parentElement.style.display === 'none') {
                obj.parentElement.setAttribute('style', 'display:run-in');
                item = '<label ' + this._utils.dataV[3] + '="" class="tab current">链接</label>';
            }
            item += '<label ' + this._utils.dataV[3] + '="" class="tab"><a href="' + info.link + '" target="_blank">' + info.siteName + '</a></label>';
            obj.insertAdjacentHTML('beforeend', item);
        },
    },
}

/**
 * 使用 ajax 翻页网站配置
 */
const ajaxSiteTargetRoute = {
    'www.yousuu.com': () => {
        let prefix = 'yousuu.';
        let pathnames = location.pathname.split('/');
        switch (pathnames[1]) {
            case 'booklist':
            case 'explore':
                return `${prefix}${pathnames[1]}`
            default:
                return null;
        }
    },
}
const ajaxSiteTargetConfig = {
    'yousuu.booklist': {
        name: 'yousuu.booklist',
        handler: () => { return callbackWhenUrlChange },
    },
    'yousuu.explore': {
        name: 'yousuu.explore',
        handler: () => { return callbackWhenYousuuExploreFeedLoad },
    }
}
/*======================================================================================================*/

/*===============================================  方法  ================================================*/

/*===============================================  util  ===============================================*/

/**
 * 数组的差集
 * @param {array} firstArray
 * @param {array} secondArray
 * @returns {array}
 */
let arrayDiff = (firstArray, secondArray) => {
    let set = new Set(secondArray);
    return [...firstArray].filter(item => !set.has(item));
}

let log = (...data) => IS_DEBUG && console.log(data);
/*=====================================================================================================*/


/*===============================================  base  ===============================================*/
/**
 * xhr
 * @param options 须满足 GM_xmlhttpRequest 参数
 */
let fetch = async (options) => {
    return new Promise((resolve, reject = (response, url = options.url) => {
        console.log(
            'Error getting ' + url + ' (' + response.status + ' ' + response.statusText + ')'
        );
    }) => {
        GM_xmlhttpRequest({
            onload(response) {
                if (response.status >= 200 && response.status < 400) {
                    resolve(response);
                } else {
                    reject(response);
                }
            },
            onerror(response) {
                reject(response);
            },
            ...options
        });
    });
};

/**
 * 处理提取到的 url, 去除 location.ogrigin，拼接 site host
 * @param {string} url 
 * @param {string} locationOrigin string 
 * @param {string} siteHost string
 * @returns {string}
 */
let handleUrl = (url, locationOrigin, siteHost) => {
    if(!url){
        return '';
    }
    url = url.replace(locationOrigin,'');
    if(url.startsWith('http') || url.startsWith('www') || url.startsWith(siteHost)){
        return url;
    }
    return siteHost + url.replace(siteHost,'');
}

/**
 * 提取冒号后的 author name
 * @param {string} str 
 * @returns {string}
 */
let getAuthorName = (str) => {
    if(!str){
        return '';
    }
    let sep = '：';
    if(!str.includes(sep)){
        sep = ':';
    }
    return (str.split(sep)?.pop() || '').trim();
}
/*=====================================================================================================*/

/*===============================================  评分  ===============================================*/
/**
 * 获取评分信息
 * @param handler
 * @param bookInfo {bookName:'',bookAuthor:''}
 */
let getRateInfo = async (handler, bookInfo) => {
    let cacheKeyPrefix = `GET:RATE:${handler.name.toUpperCase()}`;
    let cacheKey = null;
    if (bookInfo.bookId) {
        cacheKey = `${cacheKeyPrefix}:ID:${bookInfo.bookId}`;
    } else {
        cacheKey = `${cacheKeyPrefix}:NAME:${bookInfo.bookName}:AUTHOR:${bookInfo.bookAuthor}`;
    }
    //查询缓存
    let cacheValue = storage.getValue(cacheKey, SEARCH_EXPIRED_TIME);
    if (cacheValue !== null) {
        return cacheValue;
    }
    let response = await fetch(handler.request(bookInfo));
    log(response,response?.responseText);
    let data = handler.parse(bookInfo, response);
    storage.setValue(cacheKey, data);
    return data;
};

/**
 * 将评分插入目标网站
 * @param options
 */
let insertRate = async (options) => {
    let siteConfig = rateSiteTargetConfig[options.site];
    let args = { bookName: siteConfig.bookName(options.item), bookAuthor: siteConfig.bookAuthor(options.item), maxNum: siteConfig.maxNum };
    //判断是否可以获取到 bookId
    if (siteConfig.hasOwnProperty('bookId')) {
        let bookId = siteConfig.bookId(options.item);
        if (bookId) {
            args.bookId = bookId;
        }
    }
    let data = await getRateInfo(rateSiteSourceConfig[options.rateSourceSite], args);
    if (data.match) {
        siteConfig.anchorObj(options.item).insertAdjacentHTML(siteConfig.anchorPos, siteConfig.rateItem(data.score, data.num, data.url));
    }
};

/**
 * 插入评分(入口)
 * @param hostname
 */
let insertBookRate = (hostname) => {
    if (Object.keys(rateSiteTargetRoute).includes(hostname)) {
        let site = rateSiteTargetRoute[hostname]();
        if (!site) {
            return;
        }
        let siteConfig = rateSiteTargetConfig[site];
        if (!siteConfig) {
            return;
        }
        let options = { site: site, rateSourceSite: 'yousuu' };
        siteConfig.handler(options, insertRate);
    }
}

/*=====================================================================================================*/

/*===============================================  下载  ===============================================*/


/**
 * 获取需要排除的下载源
 * @returns Array
 */
let getExpectedSites = () => {
    let sites = GM_getValue(EXCEPTED_DOWNLOAD_SITES_KEY, []);
    return Array.isArray(sites) ? sites : [];
}
/**
 * 排除下载源
 */
let exceptDownloadSites = () => {
    let sites = getExpectedSites().map((site) => {
        return downloadSiteSourceConfig[site]?.siteName || "";
    }).filter(site => site != null && site != undefined);

    let input = prompt("请输入要排除的下载站(下载地址中的网站名,逗号分隔):", sites.join(",") || "");
    if (input == null || input == undefined) {
        return;
    }

    let siteNameMap = new Map();
    for (const [key, value] of Object.entries(downloadSiteSourceConfig)) {
        siteNameMap.set(value.siteName, key);
    }

    let savedSites = input.split(/[,，]/).map((item) => {
        return siteNameMap.get(item.trim());
    }).filter((item) => item != null && item != undefined);

    GM_setValue(EXCEPTED_DOWNLOAD_SITES_KEY, savedSites);

    if (confirm("刷新当前页面?")) {
        window.location.reload();
    }
};
/**
 * 解析下载链接
 * @param options
 */
let getDownLoadLink = async (options) => {
    let type = options.type;
    let siteConfig = downloadSiteSourceConfig[options.site];
    if (type === DOWNLOAD_TYPE_DIRECT) { //直接获取
        return { downloadLink: options.bookLink, siteName: siteConfig.siteName };
    } else if (type === DOWNLOAD_TYPE_FETCH) { //从链接中再次解析
        //缓存
        let cacheKey = 'GET:DOWNLOADLINK:' + siteConfig.name.toUpperCase() + ':' + hex_md5(options.bookLink);
        let cacheValue = storage.getValue(cacheKey, DOWNLOAD_EXPIRED_TIME);
        if (cacheValue !== null) {
            return { downloadLink: cacheValue, siteName: siteConfig.siteName };
        }
        let response = await fetch(siteConfig.fetchConfig({ url: options.bookLink }));
        log(response,response?.responseText);
        let html = new DOMParser().parseFromString(response.responseText, "text/html");
        let downloadLink = siteConfig.downloadLink(html);
        storage.setValue(cacheKey, downloadLink);
        return { downloadLink: downloadLink, siteName: siteConfig.siteName };
    } else if (type === DOWNLOAD_TYPE_PROCESS) {
        return { downloadLink: siteConfig.downloadLink(options.bookItem), siteName: siteConfig.siteName };
    }
};

/**
 * 从原始响应返回解析下载信息
 * @param bookInfo
 * @param response
 */
let parseRawDownloadResponse = (bookInfo, handler, response) => {
    let html = new DOMParser().parseFromString(response.responseText, "text/html");
    log(html);
    let bookList = handler.bookList(html);
    let bookLink = '';
    let bookItem = '';
    let match = bookList.some((item) => {
        IS_DEBUG && log(handler.bookName(item).trim(),bookInfo.bookName.trim(),handler.bookAuthor(item).trim(),bookInfo.bookAuthor.trim());
        if (handler.bookName(item).trim() === bookInfo.bookName.trim() && handler.bookAuthor(item).trim() === bookInfo.bookAuthor.trim()) {
            bookItem = item;
            bookLink = handler.bookLink(item);
            return true;
        }
    });
    let data = { bookLink: bookLink, bookItem: bookItem, match: match };
    let cache = { bookLink: bookLink, bookItem: (match ? bookItem.innerHTML : ''), match: match };
    return [data, cache];
};

/**
 * 获取下载信息
 * @param handler
 * @param bookInfo
 */
let getDownloadInfo = async (handler, bookInfo) => {
    //查缓存
    let cacheKey = 'GET:BOOKLINK:' + handler.name.toUpperCase() + ':NAME:' + bookInfo.bookName + ':AUTHOR:' + bookInfo.bookAuthor;
    let cacheValue = storage.getValue(cacheKey, DOWNLOAD_EXPIRED_TIME);
    if (cacheValue !== null) {
        return { bookLink: cacheValue.bookLink, bookItem: new DOMParser().parseFromString(cacheValue.bookItem, "text/html"), match: cacheValue.match };
    }

    let response = await fetch(handler.searchConfig({ bookName: bookInfo.bookName }));
    log(response?.responseText);
    let [data, cache] = handler.parse(bookInfo, handler, response);
    //判断是否应该添加缓存
    if (!handler.hasOwnProperty('shouldCacheBookLink') || handler.shouldCacheBookLink({ item: data.bookItem })) {
        storage.setValue(cacheKey, cache);
    }
    return data;
};

/**
 * 将下载链接插入目标网站
 * @param options
 */
let insertDownload = async (options) => {
    let target = downloadSiteTargetConfig[options.downloadTargetSite];
    let bookInfo = { bookName: target.bookName(), bookAuthor: target.bookAuthor() };
    let source = downloadSiteSourceConfig[options.site];
    //获取下载信息
    let downloadInfo = await getDownloadInfo(source, bookInfo);
    if (downloadInfo.match) {
        //解析下载链接
        let data = await source.handler({ site: options.site, ...downloadInfo });
        //处理下载链接
        return target.task(data);
    }
};

/**
 * 插入下载链接(入口)
 * @param hostname
 */
let insertBookDownloadLink = async (hostname) => {
    if (!Object.keys(downloadSiteTargetRoute).includes(hostname)) {
        return;
    }
    let sites = arrayDiff(Object.keys(downloadSiteSourceConfig), getExpectedSites());
    let targetRoute = downloadSiteTargetRoute[hostname];
    if (!targetRoute.isValid()) {
        return;
    }
    let downloadTargetSite = targetRoute.targetConfig();
    let targetConfig = downloadSiteTargetConfig[downloadTargetSite];
    targetConfig.prepare();
    let promises = sites.map((site) => insertDownload({ site: site, downloadTargetSite: downloadTargetSite }).catch(e => console.log(e)));
    await Promise.all(promises);
}

/**
 * 从来源处解析并插入链接
 * @param {String} site
 * @param {Object} bookInfo
 */
let insertLinkFromSource = async (site, targetConfig) => {
    let siteConfig = linkSiteSourceConfig[site];
    let bookName = targetConfig.bookName();
    let bookAuthor = targetConfig.bookAuthor();
    if (!bookName || !bookAuthor) {
        return;
    }
    let bookInfo = { bookName: bookName, bookAuthor: bookAuthor };
    let link = siteConfig.link(bookInfo);
    targetConfig.task({ link: link, siteName: siteConfig.siteName });
}
/**
 *
 * 插入下载链接
 * @param {String} hostname
 */
let insertLinks = async (hostname) => {
    if (!Object.keys(linkSiteTargetRoute).includes(hostname)) {
        return;
    }
    let targetRoute = linkSiteTargetRoute[hostname];
    if (!targetRoute.isValid()) {
        return;
    }
    let targetConfig = linkSiteTargetConfig[targetRoute.targetConfig()];
    targetConfig.prepare();
    let promises = Object.keys(linkSiteSourceConfig).map((site) => insertLinkFromSource(site, targetConfig).catch(e => console.log(e)));
    await Promise.all(promises);
}

/*=====================================================================================================*/

/*===============================================  UI  ===============================================*/

/**
 * 注册菜单
 */
let registerMenu = () => {
    GM_registerMenuCommand('排除不需要的下载源', exceptDownloadSites, 'E');
};
/**
 * 检查插件兼容性
 */
let checkCanUse = () => {
    let message = '脚本 [优书网 <=> 知轩藏书] ';
    let canUse = true;
    if (typeof GM_xmlhttpRequest === "undefined") {
        message += "暂不支持 Greasemonkey 4.x, 请使用 Tampermonkey 或 Violetmonkey 。";
        canUse = false;
    }
    return { canUse: canUse, message: message };
};

let isTampermonkey = () => {
    return (GM_info || { scriptHandler: '' }).scriptHandler.toLowerCase() === SCRIPT_HANDLER_TAMPERMONKEY;
}

/**
 * 开始执行脚本
 */
let start = () => {
    'use strict';
    //检查兼容性
    let checkResult = checkCanUse();
    if (!checkResult.canUse) {
        alert(checkResult.message);
        return;
    }
    //插入评分
    insertBookRate(location.hostname);
    //插入下载链接
    insertBookDownloadLink(location.hostname);
    //插入其他链接
    insertLinks(location.hostname);
}

/**
 * 延时执行脚本
 * @param {integer} interval
 */
let startWithInterval = (interval) => {
    window.setTimeout(start, interval);
}

/**
 * 当前站点是否触发 ready 事件
 * @param {string} hostname
 */
let isSiteTriggerReadyEvent = (hostname) => {
    return !Object.keys(SITES_WAIT_KEY_ELEMENT).includes(hostname);
}

/**
 * 页面 url 参数变化时回调
 * @param {CallableFunction} callback
 */
let callbackWhenUrlChange = (callback) => {
    if (this.lastPathStr !== location.pathname
        || this.lastQueryStr !== location.search
        || this.lastHashStr !== location.hash
    ) {
        this.lastPathStr = location.pathname;
        this.lastQueryStr = location.search;
        this.lastHashStr = location.hash;
        callback();
    }
}

/**
 * 优书网发现页面最后一个 bookId 变化时回调
 * @param {CallableFunction} callback
 */
let callbackWhenYousuuExploreFeedLoad = (callback) => {
    let bookId = document.querySelector('#app > div.app-main > section > div > div.left > div:not([style*="display:none"]):not([style*="display: none"]) >div:nth-last-child(2)').getAttribute("bookid");
    if (this.lastYousuuExploreFeedBookId !== bookId) {
        this.lastYousuuExploreFeedBookId = bookId;
        callback();
    }
}

let ajaxSiteConfig = (hostname) => {
    if (!Object.keys(ajaxSiteTargetRoute).includes(hostname)) {
        return null;
    }
    let site = ajaxSiteTargetRoute[hostname]();
    if (!site) {
        return null;
    }
    return ajaxSiteTargetConfig[site];
}

let startWhenAjax = () => {
    let config = ajaxSiteConfig(location.hostname);
    if (!config) {
        return false;
    }
    window.setInterval(config.handler(), 1000, () => startWithInterval(1000));
    return true;
}

/*======================================================================================================*/
/**
 * 入口
 */

registerMenu();

//使用 ajax 翻页的网站
if (startWhenAjax()) {
    return;
}

if (isSiteTriggerReadyEvent(location.hostname)) {
    startWithInterval(1000);
    return;
}
waitForKeyElements(SITES_WAIT_KEY_ELEMENT[location.hostname], () => startWithInterval(1000));
