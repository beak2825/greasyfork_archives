// ==UserScript==
// @name         阅读模式辅助
// @description  美化滚动条，添加小说目录(仅支持部分网站)，配合插件“Circle 阅读模式”使用更棒哦。
// @author       little3022
// @namespace    little3022.TM.Cataloguer
// @homepageURL  https://greasyfork.org/users/782903
// @supportURL   https://greasyfork.org/scripts/445980/feedback
// @version      0.1.2
// @license      GNU GPL v2.0
// @run-at       document-end
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/445980/%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/445980/%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


class Cataloguer {
    constructor() {
        this.__name__ = 'Cataloguer';

        this.matchRules= [{
            host: '',
            describe: '',

        }];
        this.reHrefs = [
            // 章节及小说主页链接(捕获 1 - n 为主页)的正则表达式
            /(http\S+www\.biquger\.com\/biquge\/\d+)\/\d+/,
            /(http\S+www\.ibswtan\.com\/\d+\/\d+)\/\d+\.html/,
            /(http\S+www\.huaxiaci\.com\/\d+)\/\d+\.html/,
            /(http\S+www\.xbiquge\.la\/\d+\/\d+)\/\d+\.html/,
            /(http\S+www\.bswtan\.com\/\d+\/\d+)\/\d+\.html/,
            /(http\S+www\.360xs\.com\/mulu\/\d+\/\d+)-\d+(\.html)/,
            /(http\S+www\.biduoxs\.com\/biquge\/\S+\/)\S+\.html/,
            /(http\S+www\.biqugee\.com\/book\/\d+\/)\d+.html/,
            /(http\S+www\.bqg99\.cc\/book\/\d+\/)\d+\.html/,
            /(http\S+www\.ncjy\.net\/bxwx\/\d+\/)\d+\.html/,
            /(http\S+www\.xxyanqing5\.com\/book\/\d+\/)\d+\.html/,
            /(http\S+www\.fyrsks\.com\/bqg\/\d+\/)\d+\.html/
        ];
        this.titleSelectors = [
            // 标题选择器 (单一选择器)
			'#info > h1',
            'body > div.container > div.content > div:nth-child(2) > div.bookinfo > h1',
            '#article_right > div > a > h1',
            'body > div.book > div.info > h1',
            'body > div.container > div.row.row-detail > div > div > div.info > div.top > h1'
        ];
        this.catalogueSelectors = [
            // 目录选择器 (群选择器)
			'#list > dl > dd > a',
            '#list-chapterAll > dd > a',
            '#index_list_li1 > a',
            'body > div.listmain > dl > dd > a',
            'body > div.container > div.row.row-section > div > div:nth-child(4) > ul > li > a'
        ];
        this.jData = {
            thisURL: '',
            homeURL: '',
            title: '', // 小说标题
            total: 0, // 总章节数
            active: {
                index: 0, // 活动章节索引
                href: '',
                text: '',
                node: null
            }
        };
        this.sMainElementID = 'OCCataloguer';
        this.elCataloguer = null;
        this.elInfo = null;
        this.elTitle = null;
        this.elProgress = null;
        this.elLastRead = null;
        this.elList = null;

        this._first = true;
    }

    printLog(info) {
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for(var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return fmt;
        }

        let date = new Date();
        // this._tiper.append(`${date.Format('yyyy-MM-dd hh:mm:ss.S')}: ${info}`);
        GM_log(`${date.Format('yyyy-MM-dd hh:mm:ss.S')}: ${info}`);
    }

    checkURL() { // 检查 URL 是否匹配以判断是否在该网页运行此脚本
        for(let re of this.reHrefs) {
            let match = document.URL.match(re);

            if(match && match.length >= 2) {
                this.jData.thisURL = match[0];
                for(let i = 1; i < match.length; i++) {
                    this.jData.homeURL += match[i];
                }

                return true;
            }
        }

        return false;
    }

    showGUI() { // 显示 GUI
        let elCataloguer = document.createElement('div');
        let elStyle = document.createElement('style');
        let elBtShow = document.createElement('div');
        let elWrapper = document.createElement('div');
        let elTitle = document.createElement('h3');
        let elProgress = document.createElement('h5');
        let elLastRead = document.createElement('div');
        let elList = document.createElement('div');
        let elInfo = document.createElement('div');

        elCataloguer.id = this.sMainElementID;
        elBtShow.className = 'OCC-btShow';
        elWrapper.className = 'OCC-wrapper';
        elLastRead.className = 'OCC-lastread';
		elList.className = 'OCC-list';
        elInfo.className = 'OCC-info';

        elStyle.innerText = '#OCCataloguer .OCC-list::-webkit-scrollbar {width: 8px;background-color: rgba(0, 40, 51, 0.8);}#OCCataloguer .OCC-list::-webkit-scrollbar-thumb {background-color: #bbb5ac;}#OCCataloguer {position: fixed;top: calc(50% - 182.5px);left: -280px;width: 300px;height: 365px;border-radius: 0 8px 8px 0;background-color: rgba(0, 50, 64, 0.8);transition: left 0.2s linear;}#OCCataloguer:hover {left: 0px;}#OCCataloguer:hover .OCC-btShow {display: none;}#OCCataloguer:hover .OCC-wrapper {display: block;}#OCCataloguer .OCC-btShow {position: absolute;right: 0px;width: 20px;height: 100%;border-radius: 0 8px 8px 0;line-height: 360px;text-align: center;vertical-align: middle;color: lightgray;}#OCCataloguer .OCC-wrapper {display: none;}#OCCataloguer h3 {margin: 12px 0 0px 16px;width: 200px;color: #beb9b2;white-space: nowrap;overflow: hidden;cursor: pointer;}#OCCataloguer h3:hover {color: green;}#OCCataloguer h5 {margin: 0 0 0 16px;width: 100px;color: #beb9b2;white-space: nowrap;overflow: hidden;}#OCCataloguer .OCC-lastread {margin: 5px 5px 0 5px;border-bottom: 1px dashed #A7A7A7;height: 24px;}#OCCataloguer .OCC-list {width: 300px;height: 265px;overflow-x: hidden;overflow-y: auto;}#OCCataloguer .OCC-info {width: 300px;height: 100%;font-size: 20px;line-height: 280px;text-align: center;vertical-align: middle;color: #beb9b2;overflow: hidden;white-space: nowrap;}#OCCataloguer dl {margin: 0;padding-top: 5px;}#OCCataloguer dd {margin: 0 5px 0 5px;padding: 0 0 0 16px;border-radius: 3px;width: calc(100% - 30px);height: 24px;vertical-align: middle;overflow: hidden;text-overflow: ellipsis;}#OCCataloguer dd:hover {padding: 0 0 0 20px;background-color: rgba(128, 128, 128, 0.35);box-shadow:0 2px 5px #303030,0 -2px 5px #000;}#OCCataloguer a {display: inline-block;width: 100%;font-size: 13px;line-height: 24px;color: #A7A7A7;text-decoration: none;white-space: nowrap;}#OCCataloguer a:visited {color: #00bbff;}#OCCataloguer #OCC-active {margin: 5px 5px 5px 5px;background-color: rgba(0, 199, 0, 0.3);box-shadow:2px 2px 5px #303030,2px -2px 5px #000;}#OCCataloguer .OCC-lastread a {color: salmon;}#OCCataloguer #OCC-active a {color: #A7A7A7;}';
        elBtShow.innerText = '▶';
        elTitle.innerText = 'Title';
        elProgress.innerText = '(9999/9999)';
        elLastRead.innerHTML = '<dd><a href="#">上次读到: ...</a></dd>';
        elInfo.innerText = 'Info...';

        elCataloguer.onmouseenter = () => {
            this.scrollToActive();
        };

        elCataloguer.appendChild(elStyle);
        elCataloguer.appendChild(elBtShow);
        elCataloguer.appendChild(elWrapper);
        elWrapper.appendChild(elTitle);
        elWrapper.appendChild(elProgress);
        elWrapper.appendChild(elLastRead);
        elWrapper.appendChild(elList);
        elList.appendChild(elInfo);

        // 显示上次读到
        let t = this.loadData();
        if(t.homeURL === this.jData.homeURL) {
            elLastRead.innerHTML = `<dd><a href="${t.lastReadURL}">上次读到: ${t.lastReadText}</a></dd>`;
            elLastRead.title = t.lastReadText;
        }

        this.elCataloguer = elCataloguer;
        this.elTitle = elTitle;
        this.elProgress = elProgress;
        this.elLastRead = elLastRead;
        this.elList = elList;
        this.elInfo = elInfo;

        if(!document.getElementById(this.sMainElementID)) {
            document.documentElement.appendChild(elCataloguer);
		}
    }

    refreshGUI(title, catalogues) { // 更新显示数据
        let lastReadIndex = -1;

        if(title) {
            this.jData.title = title;
            this.elTitle.innerText = title;
            this.elTitle.title = `点击跳转《${title}》主页 (${this.jData.homeURL})`;
            this.elTitle.addEventListener('click', () => {
                window.open(this.jData.homeURL, '_self');
            });
        }
        if(catalogues) {
            let elDL = document.createElement('dl');
            let count = 0, flag = false; // 章节总数, 是否自带纯数字序号

//            // 判断是否自带序号
//            for(let i = 0; i < 9; i++) {
//                let a = catalogues[i];
//
//                if(/<a href.+?>\d+?、.+?<\/a>/.test(a)) {
//                    flag = true;
//                    break;
//                }
//            }
//            // 插入目录
//            for(let a of catalogues) {
//                let elDD = document.createElement('dd');
//                if(flag) {
//                    elDD.innerHTML = a.outerHTML;
//                }
//                else {
//                    elDD.innerHTML = a.outerHTML.replace(/(<a href.+?>)(.+?<\/a>)/, `$1${count + 1}、$2`);
//                }
//                elDL.appendChild(elDD);
//                count += 1;
//            }
             // 插入目录
             for(let a of catalogues) {
                 let elDD = document.createElement('dd');
                 elDD.innerHTML = a.outerHTML;
                 elDL.appendChild(elDD);
                 count += 1;
             }
            // 显示目录
            this.elList.innerHTML = '';
            this.elList.appendChild(elDL);
            // 更新目录总数
            this.jData.total = count;
        }
    }

    refreshActiveChapter() { // 更新活动章节信息, 并返回对应 a 标签
        // 若未获取章节总数则退出
        if(!this.jData.total) return null;
        // 已读(已加载)章节列表
        let elRead = document.querySelectorAll('html > div.circle-pager > div > div > h1 > a');

        if(elRead.length > 0) {
            elRead = elRead[elRead.length - 1];
            // 活动章节未改变
            if(this.jData.active.href && this.jData.active.href == elRead.href) {
                return 'nochanged';
            }
            // 迭代章节列表获取活动章节
            for(let [i, elA] of this.elList.querySelectorAll('a').entries()) {
                if(elA.href == elRead.href) {
                    this.jData.active.index = i + 1;
                    this.jData.active.href = elA.href;
                    this.jData.active.text = elA.innerText;
                    this.jData.active.node = elA;

                    return elA;
                }
            }
        }

        return null;
    }

    _parseHTML(responseText) { // 解析源码为 DOM (html) 对象
        let elHTML = document.createElement('html');
        let a = responseText.indexOf('<head>');
        let b = responseText.lastIndexOf('</body>');

        if(a < 0) a = responseText.indexOf('<head');
        if(b === -1) b = responseText.length;
        if(a >= 0 && b > a) {
            elHTML.innerHTML = responseText.slice(a, b + 7);

            return elHTML;
        }

        return null;
    }

    initCatalogue() { // 获取网页源码
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                if(xhttp.responseText) { // 成功获取数据, 初始化并更新列表
                    let elHTML = null;
                    let sTitle = '';
                    let elCatalogues = null;

                    elHTML = this._parseHTML(xhttp.responseText);
                    if(elHTML) {
                        for(let selector of this.titleSelectors) {
                            sTitle = elHTML.querySelector(selector);
                            if(sTitle) {
                                sTitle = sTitle.innerText;
                                break;
                            }
                        }
                        for(let selector of this.catalogueSelectors) {
                            elCatalogues = elHTML.querySelectorAll(selector);
                            if(elCatalogues.length > 0) break;
                        }
                        this.refreshGUI(sTitle, elCatalogues);

                        this.printLog('成功获取目录数据.');
                    }
                    else {
                        this.elInfo.innerText = '数据获取失败!';
                        this.printLog('获取目录数据失败!');
                    }
                }
                else {
                    this.elInfo.innerText = '数据获取失败!';
                    this.printLog('获取目录数据失败!');
                }
            }
            else if(xhttp.readyState == 4) {
                this.elInfo.innerText = '数据获取失败!';
                this.printLog('获取目录数据失败!');
                this.printLog(`status="${xhttp.status}"; responseText="${xhttp.responseText}"`);
            }
        };

        this.elInfo.innerText = '正在获取章节目录...';
        xhttp.open('GET', this.jData.homeURL, true);
        xhttp.send();
    }

    saveData() {
        GM_setValue(this.__name__, {
            homeURL: this.jData.homeURL,
            lastReadURL: this.jData.active.href,
            lastReadText: this.jData.active.text
        });
        this.printLog('阅读历史已保存');
    }

    loadData() {
        return GM_getValue(this.__name__, {
            homeURL: '',
            lastReadURL: '',
            lastReadText: ''
        });
    }

    scrollToActive() { // 跳转至活动章节
        // 更新并获取活动章节索引
        let elActive = this.refreshActiveChapter();

        if(elActive) { // 成功获取进度
            if(elActive != 'nochanged') { // 活动章节已改变
                let tdd = document.getElementById('OCC-active');

                if(tdd) tdd.id = '';
                elActive.parentElement.id = 'OCC-active';
                this.elProgress.innerText = `(${this.jData.active.index}/${this.jData.total})`;
                elActive.parentElement.scrollIntoView();
                this.printLog(`跳转活动章节 ${elActive.innerText}`);

                // 更新阅读历史
                if(!this._first) {
                    this.elLastRead.innerHTML = `<dd><a href="${elActive.href}">上次读到: ${elActive.innerText}</a></dd>`;
                    this.elLastRead.title = elActive.innerText;

                    this.saveData();
                }
                this._first = false;
            }
            else {
                this.jData.active.node.parentElement.scrollIntoView();
                this.printLog('活动章节未改变.');
            }
        }
    }

    setScroller() { // 设置滚动条样式
        document.ondblclick = ()=>{};

        var sty = document.createElement('style');
        sty.id = 'srollStyle';
        sty.innerHTML = '::-webkit-scrollbar {width: 8px;background-color: var(--circle-bgcolor, rgba(0, 40, 51, 0.8));}::-webkit-scrollbar-thumb {background-color: #bbb5ac;}';

        setTimeout(() => {
            document.head.appendChild(sty);
            this.printLog('成功设置滚动条样式');
        }, 500);
    }

    exec() { // 初始化并运行目录程序
        if(!this.checkURL()) return;

        setTimeout(() => {
            this.showGUI();
            this.initCatalogue();
        }, 1000);
    }
}


(function() {
    'use strict';
    let app = new Cataloguer();

    app.exec();
    app.setScroller();
})();
