// ==UserScript==
//只是在原作者little3022的基础上增加了有关广厦学院的支持，感谢原作者little3022
// @name         英华网课课助手（广厦学院版本 转载原作者little3022）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动连播网课
// @author       原作者little3022
// @match        *://gsxyshixun.yinghuaonline.com/user/node?*
// @match        *://gsxyshixun.yinghuaonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439743/%E8%8B%B1%E5%8D%8E%E7%BD%91%E8%AF%BE%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E5%B9%BF%E5%8E%A6%E5%AD%A6%E9%99%A2%E7%89%88%E6%9C%AC%20%E8%BD%AC%E8%BD%BD%E5%8E%9F%E4%BD%9C%E8%80%85little3022%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/439743/%E8%8B%B1%E5%8D%8E%E7%BD%91%E8%AF%BE%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E5%B9%BF%E5%8E%A6%E5%AD%A6%E9%99%A2%E7%89%88%E6%9C%AC%20%E8%BD%AC%E8%BD%BD%E5%8E%9F%E4%BD%9C%E8%80%85little3022%EF%BC%89.meta.js
// ==/UserScript==

class OcTip {
    /**
     * 类名: OcTip
     * 说明: 提示框类. 可同时显示一些顺序排列的提示框.
     * 初始化参数:
     *     parent: 父元素
     **/
    constructor(parent) {
        this.parent = parent;
        this.HTML = document.createElement("div");
        this.queue = [];
        this.mainTimer = 0;
        this.paused = false;
        this.mtID = null;

        this.init();
    }

    init() {
        this.HTML.className = 'oc-container';
        this.parent.appendChild(this.HTML);
        //绑定事件
        this.HTML.onmouseover = () => {this.paused = true;};
        this.HTML.onmouseleave = () => {this.paused = false;};
        //添加公共样式
        var elStyle = document.createElement("style");
        elStyle.innerHTML = '.oc-container {z-index: 9999;position: relative;top: calc((100% - var(--height, 32px)) / 2);left: calc((100% - var(--width, 64px)) / 2);overflow: hidden;}.oc-tip {outline: 3px solid #ffff00;margin: 9px;border: 2px dashed #ffaa00;padding: 6px;background-color: #ffff00;overflow: hidden;transition: opacity 1s;}.oc-tip:hover {transition: opacity 0s;}.oc-tip .title,.oc-tip .content {margin: 0;vertical-align: middle;overflow: auto;}.oc-tip .title {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}';
        this.HTML.appendChild(elStyle);
        //设置主时钟
        !this.mtID && (this.mtID = setInterval(() => {
            this._handleQueue();
            //刷新大小及位置
            {
                let maxWidth = parseInt(this.parent.offsetWidth * 0.8);
                let maxHeight = parseInt(this.parent.offsetHeight * 0.8);
                this.HTML.style.maxWidth = (maxWidth >= 64 ? maxWidth : 64) + 'px';
                this.HTML.style.maxHeight = (maxHeight >= 64 ? maxHeight : 64) + 'px';
            }
            this.HTML.style.setProperty("--width", this.HTML.offsetWidth + "px");
            this.HTML.style.setProperty("--height", this.HTML.offsetHeight + "px");
            //刷新时钟
            (!this.paused) && (this.mainTimer += 100);
        }, 100));
    }

    append(text, title = null, delay = 1200) {
        /**
         * 成员函数名: append()
         * 说明: 显示一个显示 3s 的提示性文本框, 可包含标题及文本.
         * 参数:
         *     text: 显示文本
         *     title: 标题(默认不显示)
         **/
        var elTip = document.createElement('div');
        var elContent = document.createElement("p");

        elTip.className = "oc-tip";
        elContent.className = 'content';
        //设置标题
        if (title) {
            let elTitle = document.createElement("h3");
            elTitle.className = 'title';
            elTitle.innerHTML = title;
            elTitle.title = title;
            elTip.appendChild(elTitle);
        }
        //设置内容
        elContent.innerHTML = text;
        elContent.title = text;
        elTip.appendChild(elContent);
        //添加悬停事件
        elTip.onmouseover = () => {elTip.style.opacity = 1;};

        this._insertQueue(elTip, delay);

        return true;
    }

    destroy() {
        /**
         * 成员函数名: destroy()
         * 说明: 清除成员内容, 释放内存.
         * 参数:
         *     parent: 父元素
         *     text: 显示文本
         *     title: 标题(默认不显示)
         **/
        this.HTML && this.parent.removeChild(this.HTML);
        this.HTML = null;
        this.queue = [];
        this.mtID && clearInterval(this.mtID);

        return true;
    }

    _insertQueue(elTip, duration) {
        duration = parseInt(duration / 100) * 100;
        this.queue.push({
            inTime: this.mainTimer,
            outTime: this.mainTimer + duration,
            display: false,
            elTip: elTip
        });
    }

    _handleQueue() {
        this.queue.forEach((obj, index, queue) => {
            if(!obj.display && obj.inTime >= this.mainTimer) {
                this.HTML.appendChild(obj.elTip);
                obj.display = true;
            }
            else if(obj.display && this.mainTimer == obj.outTime) {
                //淡出效果
                obj.elTip.style.opacity = 0;
            }
            else if(obj.display && this.mainTimer >= obj.outTime + 1000) {
                this.HTML.removeChild(obj.elTip);
                obj.display = false;
                obj.elTip = null;
                queue.splice(index, 1);
            }
        });
    }
}


class Course {
	constructor(courseId) {
        this.prefixURL1 = 'https://gsxyshixun.yinghuaonline.com';
        this.prefixURL2 = 'https://gsxyshixun.yinghuaonline.com/user/study_record.json?courseId=';
        this.index = -1; //本视频索引
		this.nodeId = "";
		this.chapterId = "";
		this.courseId = courseId;
		this.title = ""; //课程名
		this.name = ""; //json 视频名
		this.viewCount = 0; //json 观看次数
		this.duration = 0; //json 视频播放时长
        this.videoDuration = 0; //json 视频总时长
		this.state = "";
        this.finished = false; //是否完成播放
		this.url = ""; //json 本页面地址
        this.pageInfo = {
            keyName: null,
            page: -1,
            pageCount: -1,
            recordsCount: -1,
            onlyCount: -1,
            pageSize: -1
        }
		this.errCode = 0;
		this.errMsg = "";
        this._urls = []; //本次所有视频 HTML a 对象
        this._json = null; //请求的课程 json
        this._tID = Math.floor(Math.random() * (1622097000000 - 1622097888888)) + 1622097000000; //请求 json 所用 ID

        this.init();
	}

	init() {
        //单独获取标题
        this.title = document.querySelector('#wrapper > div.curPlace > div.center > a:nth-child(3)').innerText;
        this.parseIndex();
        this.requireJson();
        this._updateProperty();
	}

    parseIndex() { //分析当前视频索引
        if(this.index != -1) return;
        //解析本地 HTML 列表
        var obj = document.querySelectorAll("div.nwrap > div > div.detmain-navs > div.detmain-navlist > div.group.two > div.list > div > a");

        for(let [k, v] of obj.entries()) {
            if(v.innerText == "章节测验") continue;
            else {
                v.href = `https://gsxyshixun.yinghuaonline.com/user/node?courseId=${this.courseId}&chapterId=${this.chapterId}&nodeId=${/nodeId=(\d+)/.exec(v.href)[1]}`;
                this._urls.push(v);
            }
        }
        //获取视频索引
        for(let i = 0; i < this._urls.length; i++) {
            if(this._urls[i].className == "on") {
                this.index = i;

                return i;
            }
        }
        this.index = -1;

        return -1;
    }

	requireJson() { //请求视频列表
        var xhttp = new XMLHttpRequest();
        var page = 0;

        page = parseInt((this.index + 20) / 20);
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                this._json = JSON.parse(xhttp.response);
            }
            else if(xhttp.readyState == 4 && xhttp.status == 0) {
                this.errorCode = 404;
                if(this._json.status && this._json.status == false) {
                    this.errorMsg = `Error: [${this.errorCode}] ${JSON.parse(xhttp.response).msg}`;
                }
                else {
                    this.errorMsg = `Error: [${this.errorCode}] 课程信息请求失败!}`;
                }
            }
        };
        xhttp.open("GET", this.prefixURL2 + this.courseId + "&page=" + page + "&_=" + this._tID++, false);
        xhttp.send();

        return this._json;
	}

    refresh() { //刷新当前课程信息
        var json = null;
        if(this.parseIndex() != -1 && this.requireJson()) {
            this._updateProperty();
            return true;
        }
        else {
            return false;
        }
    }

	_updateProperty() { //设置属性
        this.id = this._json.list[this.index % 20].id;
        this.chapterId = this._json.list[this.index % 20].chapterId;
        this.courseId = this._json.list[this.index % 20].courseId;
        this.name = this._json.list[this.index % 20].name;
        this.viewCount = parseInt(this._json.list[this.index % 20].viewCount);
        this.duration = parseInt(this._json.list[this.index % 20].duration);
        this.videoDuration = parseSec(this._json.list[this.index % 20].videoDuration);
        this.state = /(未学完|未学|已学)/.exec(this._json.list[this.index % 20].state)[0];
        if(this.state == "已学") this.finished = true;
        this.url = this.prefixURL1 + this._json.list[this.index % 20].url;
        this.pageInfo = this._json.pageInfo;
        // 保存 json 至本地(SKM_courseId_page_recordsCount_pageSize)
        writeSessionStorage(`SKM_${this.courseId}_${this._json.pageInfo.page}_${this._json.pageInfo.recordsCount}_${this._json.pageInfo.pageSize}`, JSON.stringify(this._json), true);
	}
}


class YHAssistant {
	constructor() {
		this.HTML = document.createElement("div");
        this.baseInfo = null;
        this.mainTimer = 0; //主时钟
        this.currentDuration = -1; //观看时长
        this.countdown = -1; //倒计时
		this.course = null; //自定义课程对象
		this.elTable = null; //HTML 表格对象
        this.video = null; //HTML 视频对象
        this.autoplay = true;
        this.onduty = false; //是否值守
        this.ocTip = null;
        this._timer1 = 0; //值守计时器
        this._timer2 = 0; //播放时长计时器(非Interval)
        this._mtID = null; //主时钟 ID
        this._tID1 = null; //值守计时器 ID
        this._fg1 = false; //已切换背景
        this._fg2 = false; //倒计时为 0
        this._fg3 = false; //暂停计时
        this._pageOther = false; //是否为其他页面

        if(/\w+:\/\/gsxyshixun\.yinghuaonline\.com\/user\/node\?\S+/.exec(location.href)) this.init();
        else {
            this.initOther();
            this._pageOther = true;
        }
	}

	init() { //播放界面初始化
        var elStyle = null;

		//添加 innerHTML
		this.HTML.className = "YHAssistant";
        this.HTML.innerHTML += '<div class="titlebar"> <svg class="bt-menu" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M130.2 848.89c-17.14 0-31.59-14.44-31.59-32.03 0-17.38 14.44-32.05 31.59-32.05h33.62c17.14 0 31.82 14.67 31.82 32.05 0 17.58-14.67 32.03-31.82 32.03H130.2z m228.83-610.58c-17.17 0-31.61-14.24-31.61-31.61 0-17.58 14.44-31.59 31.61-31.59h534.33c17.58 0 32.02 14 32.02 31.59 0 17.37-14.44 31.61-32.02 31.61H359.03z m-228.83 0c-17.14 0-31.59-14.24-31.59-31.61 0-17.58 14.44-31.59 31.59-31.59h33.62c17.14 0 31.82 14 31.82 31.59 0 17.37-14.67 31.61-31.82 31.61H130.2z m228.83 203.52c-17.17 0-31.61-14.44-31.61-31.82 0-17.58 14.44-31.82 31.61-31.82h534.33c17.58 0 32.02 14.24 32.02 31.82 0 17.38-14.44 31.82-32.02 31.82H359.03z m-228.83 0c-17.14 0-31.59-14.44-31.59-31.82 0-17.58 14.44-31.82 31.59-31.82h33.62c17.14 0 31.82 14.24 31.82 31.82 0 17.38-14.67 31.82-31.82 31.82H130.2z m228.83 203.54c-17.17 0-31.61-14.21-31.61-31.59 0-17.61 14.44-32.05 31.61-32.05h534.33c17.58 0 32.02 14.44 32.02 32.05 0 17.38-14.44 31.59-32.02 31.59H359.03z m-228.83 0c-17.14 0-31.59-14.21-31.59-31.59 0-17.61 14.44-32.05 31.59-32.05h33.62c17.14 0 31.82 14.44 31.82 32.05 0 17.38-14.67 31.59-31.82 31.59H130.2z m228.83 203.52c-17.17 0-31.61-14.44-31.61-32.03 0-17.38 14.44-32.05 31.61-32.05h534.33c17.58 0 32.02 14.67 32.02 32.05 0 17.58-14.44 32.03-32.02 32.03H359.03z" fill="black"></path> </svg> <div class="label-title"> <h3>Title</h3> </div> <div class="menu-container" style="right: 36px;"> <span class="bt-audio false" title="取消静音"> <svg viewBox="0 0 1066 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M548.48 0c282.752 0 512 229.248 512 512s-229.248 512-512 512c-282.794667 0-512-229.248-512-512s229.205333-512 512-512z m0 42.666667c-259.242667 0-469.333333 210.133333-469.333333 469.333333s210.090667 469.333333 469.333333 469.333333c259.2 0 469.333333-210.133333 469.333333-469.333333s-210.133333-469.333333-469.333333-469.333333zM307.925333 259.157333a29.269333 29.269333 0 0 1 37.76 3.072L806.826667 723.413333l3.114666 3.626667a29.269333 29.269333 0 0 1-44.501333 37.717333l-29.568-29.525333a33.578667 33.578667 0 0 1-23.637333-8.874667c-8.874667-5.930667-8.874667-14.805333-8.874667-23.637333l-44.330667-44.373333a31.445333 31.445333 0 0 1-35.456-5.888c-11.861333-8.874667-11.861333-23.68-5.930666-35.498667l-47.317334-47.274667v198.058667c0 17.706667-17.706667 26.581333-32.512 17.706667L357.546667 655.402667H289.536c-17.749333 0-29.568-11.818667-29.568-29.568V401.194667c0-17.749333 11.818667-29.568 29.568-29.568h67.968l8.874667-5.930667-62.08-62.08a29.269333 29.269333 0 0 1 0-41.386667z m401.365334 44.458667a31.658667 31.658667 0 0 1 41.386666-2.986667 272.384 272.384 0 0 1 100.48 212.906667c0 56.149333-17.706667 106.410667-44.330666 150.741333l-44.373334-44.373333a212.48 212.48 0 0 0 29.610667-106.410667c0-67.968-29.568-127.104-79.786667-165.546666a29.738667 29.738667 0 0 1-2.986666-44.330667zM620.586667 371.626667c11.818667-8.874667 26.624-11.818667 38.442666-2.986667a180.48 180.48 0 0 1 73.898667 144.853333c0 23.68-2.986667 44.373333-11.818667 65.066667l-47.317333-47.317333c2.986667-5.930667 2.986667-11.818667 2.986667-17.749334 0-38.4-20.693333-73.898667-53.205334-97.536-14.805333-8.874667-14.805333-32.512-2.986666-44.373333z m-82.773334-130.090667c11.818667-8.874667 32.512 0 32.512 17.749333v168.533334l-121.173333-121.258667z" fill="#467CFD" style="--darkreader-inline-fill:#0231a1;"></path> </svg> </span> <span class="bt-audio true" title="静音"> <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M218.495828 334.609871c-0.390903-0.019443-0.773619-0.019443-1.164522-0.019443L100.022553 334.590428c-21.744233 0-39.087227 17.448394-39.087227 39.001269l0 273.866415c0 21.551852 17.505699 38.999223 39.087227 38.999223l117.308753 0c0.057305 0 0.113587 0 0.171915 0l0 0.153496 287.22056 185.975668c6.824429 5.842055 15.691377 9.354042 25.370831 9.354042 21.590737 0 39.096437-17.505699 39.096437-39.095413 0-1.794879-0.124843-3.551896-0.354064-5.270027L568.836985 183.473685c0.229221-1.718131 0.354064-3.475148 0.354064-5.269004 0-21.590737-17.505699-39.096437-39.096437-39.096437-8.895601 0-17.105586 2.977821-23.682375 7.979742L218.495828 334.609871zM757.858012 953.491133l0.085958 0.075725c123.876332-107.514689 202.211445-266.13329 202.211445-443.041442 0-177.214121-78.603219-336.062965-202.851011-443.61654l-0.11461 0.11461c-4.963035-3.817955-11.17655-6.109138-17.925255-6.109138-16.197914 0-29.322839 13.133112-29.322839 29.321816 0 6.757914 2.28095 12.981662 6.109138 17.926278l-0.333598 0.342808c0.821715 0.706081 1.641383 1.393743 2.462075 2.119267 1.173732 1.202385 2.452865 2.329045 3.817955 3.321652 110.054535 96.710622 179.51349 238.550071 179.51349 396.578224 0 158.02713-69.458955 299.866578-179.51349 396.577201-1.36509 0.99363-2.644223 2.118244-3.817955 3.321652-0.600681 0.533143-1.212618 1.048889-1.822508 1.564635l0.229221 0.230244c-4.152577 5.058203-6.643304 11.530614-6.643304 18.593474 0 16.188704 13.124925 29.321816 29.322839 29.321816C746.317165 960.134437 752.798786 957.651896 757.858012 953.491133zM713.998085 729.35433l0.23843 0.24764c55.380308-56.43022 89.532129-133.76454 89.532129-219.077577 0-85.409229-34.228569-162.800853-89.704045-219.249493l-0.268106 0.267083c-4.886287-3.64604-10.966773-5.821589-17.543561-5.821589-16.197914 0-29.322839 13.133112-29.322839 29.321816 0 6.566556 2.166339 12.657274 5.822612 17.544585l-0.162706 0.170892c0.773619 0.782829 1.547239 1.584078 2.310625 2.38635 0.075725 0.076748 0.152473 0.171915 0.23843 0.248663 43.3626 45.587268 69.983911 107.248629 69.983911 175.132716 0 67.884087-26.621311 129.544425-69.983911 175.131693-0.085958 0.077771-0.162706 0.171915-0.23843 0.24764-0.706081 0.74599-1.422396 1.471514-2.13871 2.214435l0.144286 0.134053c-3.751441 4.926196-5.976108 11.092639-5.976108 17.754363 0 16.188704 13.124925 29.321816 29.322839 29.321816C702.925912 735.328391 709.072913 733.113957 713.998085 729.35433z" fill="#467CFD" style="--darkreader-inline-fill:#0231a1;"></path> </svg> </span> </div> <div class="menu-container" style="right: 6px;"> <span class="bt-refresh" title="刷新记录"> <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M981.314663 554.296783a681.276879 681.276879 0 0 1-46.986468 152.746388q-105.706098 230.734238-360.983096 242.19829a593.06288 593.06288 0 0 1-228.689008-33.853939v-1.022615l-31.808709 79.979258a55.759429 55.759429 0 0 1-20.506122 22.551352 40.043451 40.043451 0 0 1-21.04434 5.382184 51.076928 51.076928 0 0 1-19.483507-5.382184 95.210839 95.210839 0 0 1-13.347817-7.158305 52.314831 52.314831 0 0 1-5.382184-4.628679L71.671707 731.908862a57.427906 57.427906 0 0 1-7.158305-21.528737 46.932646 46.932646 0 0 1 1.022615-17.438277 35.952991 35.952991 0 0 1 7.158305-13.347816 74.435608 74.435608 0 0 1 10.279972-10.279972 60.495751 60.495751 0 0 1 11.248765-7.373593 50.431066 50.431066 0 0 1 8.18092-3.606063 6.189512 6.189512 0 0 0 3.067845-1.776121l281.003839-74.866183a91.497132 91.497132 0 0 1 35.899168-2.583448 122.337047 122.337047 0 0 1 22.174599 6.404799 21.528737 21.528737 0 0 1 12.325202 12.325202 76.157907 76.157907 0 0 1 4.628679 14.854829 47.63233 47.63233 0 0 1 0 14.370431 55.167388 55.167388 0 0 1-2.04523 10.764369 10.764368 10.764368 0 0 0-1.022615 3.606063l-32.831324 79.979258a677.50935 677.50935 0 0 0 164.264262 39.505232q77.395809 7.696523 131.809692-3.606063a358.507291 358.507291 0 0 0 101.023598-36.921784 381.27393 381.27393 0 0 0 73.951211-50.753997 352.64071 352.64071 0 0 0 48.708767-55.382676 410.391547 410.391547 0 0 0 26.910921-41.550462c3.767529-7.481236 6.673908-13.616926 8.719139-18.460892zM40.885614 449.667121a685.69027 685.69027 0 0 1 63.563595-176.427998q118.0313-212.273346 374.330913-207.160271a571.803252 571.803252 0 0 1 207.160271 39.989629l33.853939-78.956643A75.619688 75.619688 0 0 1 735.187378 9.189165a37.67529 37.67529 0 0 1 15.393047-8.234742 42.303968 42.303968 0 0 1 14.854829-0.538219 47.578509 47.578509 0 0 1 13.347817 3.606064 102.907362 102.907362 0 0 1 11.302586 6.13569 49.569917 49.569917 0 0 1 6.673909 4.628678l3.067845 3.067845 154.84544 276.913379a81.970666 81.970666 0 0 1 6.13569 22.712817 46.986468 46.986468 0 0 1-1.022615 17.438277 32.293105 32.293105 0 0 1-7.696523 13.347817 69.322533 69.322533 0 0 1-10.764369 9.741753 92.142994 92.142994 0 0 1-11.302587 6.673909l-8.18092 4.09046a7.104483 7.104483 0 0 1-3.067845 1.022615l-283.049068 67.546412a112.003254 112.003254 0 0 1-46.125319-1.022615c-11.571696-3.390776-19.160576-8.019454-22.551352-13.832214a41.173709 41.173709 0 0 1-5.382184-21.04434 97.256069 97.256069 0 0 1 1.291724-17.438277 24.381295 24.381295 0 0 1 3.067845-8.234742L600.632773 296.81309a663.730958 663.730958 0 0 0-164.102797-43.057474q-77.987849-9.203535-131.809692 0a348.227319 348.227319 0 0 0-101.292707 33.853938 368.571976 368.571976 0 0 0-75.350579 49.246986 383.31916 383.31916 0 0 0-50.269601 54.360061 408.507783 408.507783 0 0 0-28.740863 41.012244A113.025869 113.025869 0 0 0 40.885614 449.667121z m0 0" fill="#467CFD" style="--darkreader-inline-fill:#0231a1;"></path> </svg> </span> </div> </div> <div class="info"> <table class="table" border="1px" cellspacing="0" cellpadding="0"> <caption> <h4>Name</h4> </caption> <tr> <th width="99px">观看次数</th> <td>Data</td> </tr> <tr> <th>观看时长</th> <td>Data</td> </tr> <tr> <th>视频时长</th> <td>Data</td> </tr> <tr> <th>剩余时长</th> <td>Data</td> </tr> <tr> <th>状态</th> <td>Data</td> </tr> <tr> <th>计时</th> <td>Data</td> </tr> </table> <p class="discription">注：在刚开始播放视频时请激活该页面，否则将导致计时系统失效。</p> </div>';
		//添加样式
		elStyle = document.createElement("style");
		elStyle.innerHTML = ':root {--root-width: 230px;--root-height: 325px;}.YHAssistant {z-index: 999;position: fixed;top: 30%;left: 5px;width: 50px;height: 50px;font-size: 16px;color: black;background-color: gainsboro;transition: width .5s ease, height .5s ease;overflow: hidden;}.YHAssistant h3,.YHAssistant h4,.YHAssistant p {margin: 0;}.YHAssistant:hover {width: var(--root-width);height: var(--root-height);}.YHAssistant>.titlebar {position: relative;top: 0;left: 0;}.YHAssistant:hover .bt-menu {top: 0;left: 0;}.YHAssistant:hover .label-title {visibility: visible;}.YHAssistant:hover .menu-container {visibility: visible;}.YHAssistant:hover .info {visibility: visible;}.titlebar>.bt-menu {position: absolute;top: 6px;left: 6px;margin: 3px;width: 32px;height: 32px;vertical-align: middle;fill: currentcolor;overflow: hidden;--darkreader-inline-fill: currentcolor;transition: .2s ease;}.titlebar>.label-title {position: absolute;top: 3px;left: 42px;width: calc(100% - 110px);line-height: 32px;overflow: hidden;visibility: hidden;}.titlebar>.label-title h3 {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}.menu-container {position: absolute;top: 6px;border-radius: 3px;padding: 3px;width: 24px;height: 24px;text-align: center;vertical-align: middle;visibility: hidden;}.menu-container:hover {background-color: rgba(128, 128, 128, 0.3);}.menu-container .bt-refresh,.menu-container .bt-audio {vertical-align: middle;fill: currentcolor;overflow: hidden;--darkreader-inline-fill: currentcolor;}.menu-container .bt-audio.true {display: none;}@keyframes rotate {from {-webkit-transform: rotate(0deg);}to {-webkit-transform: rotate(360deg);}}.menu-container:hover .bt-refresh svg {animation: rotate 2s linear infinite backwards;}.YHAssistant .info {position: relative;top: 32px;visibility: hidden;}.info .table {position: absolute;top: 15px;left: 10px;width: calc(var(--root-width) - 20px);}.info .table caption {height: 30px;}.info .table h4 {width: calc(var(--root-width) - 56px);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}.info .table td {text-align: center;}.info .discription {position: absolute;top: 195px;left: 10px;box-sizing: content-box;border: 1px dashed red;padding: 8px;width: calc(var(--root-width) - 38px);color: #bc2352;background-color: #ecb6c5;text-decoration:line-through;overflow: hidden;opacity: 0.8;}';
        this.HTML.appendChild(elStyle);
		//获得表格对象
		this.elTable = this.HTML.querySelector("div.info > table");
        //获得视频对象
        this.video = document.getElementsByTagName('video')[0];
        this.video.muted = true;
        this.video.volume = 0.3;
        this._bindVideoEvent();
        //初始化基本信息
        this.baseInfo = parseBaseInfo();
        //绑定菜单按钮
		this.bindBtMenu();
        //绑定值守事件
        this._bindOnDuty();
        //绑定移动事件
		bindMover(this.HTML);
        //初始化提示类
        this.ocTip = new OcTip(this.HTML);
	}

    initOther() { //其他界面初始化
        var elStyle = null;
		var elTitle = null;

		//添加 innerHTML
		this.HTML.className = "YHAssistant";
        this.HTML.innerHTML += '<div class="titlebar"> <svg class="bt-menu" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M130.2 848.89c-17.14 0-31.59-14.44-31.59-32.03 0-17.38 14.44-32.05 31.59-32.05h33.62c17.14 0 31.82 14.67 31.82 32.05 0 17.58-14.67 32.03-31.82 32.03H130.2z m228.83-610.58c-17.17 0-31.61-14.24-31.61-31.61 0-17.58 14.44-31.59 31.61-31.59h534.33c17.58 0 32.02 14 32.02 31.59 0 17.37-14.44 31.61-32.02 31.61H359.03z m-228.83 0c-17.14 0-31.59-14.24-31.59-31.61 0-17.58 14.44-31.59 31.59-31.59h33.62c17.14 0 31.82 14 31.82 31.59 0 17.37-14.67 31.61-31.82 31.61H130.2z m228.83 203.52c-17.17 0-31.61-14.44-31.61-31.82 0-17.58 14.44-31.82 31.61-31.82h534.33c17.58 0 32.02 14.24 32.02 31.82 0 17.38-14.44 31.82-32.02 31.82H359.03z m-228.83 0c-17.14 0-31.59-14.44-31.59-31.82 0-17.58 14.44-31.82 31.59-31.82h33.62c17.14 0 31.82 14.24 31.82 31.82 0 17.38-14.67 31.82-31.82 31.82H130.2z m228.83 203.54c-17.17 0-31.61-14.21-31.61-31.59 0-17.61 14.44-32.05 31.61-32.05h534.33c17.58 0 32.02 14.44 32.02 32.05 0 17.38-14.44 31.59-32.02 31.59H359.03z m-228.83 0c-17.14 0-31.59-14.21-31.59-31.59 0-17.61 14.44-32.05 31.59-32.05h33.62c17.14 0 31.82 14.44 31.82 32.05 0 17.38-14.67 31.59-31.82 31.59H130.2z m228.83 203.52c-17.17 0-31.61-14.44-31.61-32.03 0-17.38 14.44-32.05 31.61-32.05h534.33c17.58 0 32.02 14.67 32.02 32.05 0 17.58-14.44 32.03-32.02 32.03H359.03z" fill="black"></path> </svg> <div class="label-title"> <h3>Title</h3> </div> <div class="menu-container" style="right: 36px;"> <span class="bt-audio false" title="取消静音"> <svg viewBox="0 0 1066 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M548.48 0c282.752 0 512 229.248 512 512s-229.248 512-512 512c-282.794667 0-512-229.248-512-512s229.205333-512 512-512z m0 42.666667c-259.242667 0-469.333333 210.133333-469.333333 469.333333s210.090667 469.333333 469.333333 469.333333c259.2 0 469.333333-210.133333 469.333333-469.333333s-210.133333-469.333333-469.333333-469.333333zM307.925333 259.157333a29.269333 29.269333 0 0 1 37.76 3.072L806.826667 723.413333l3.114666 3.626667a29.269333 29.269333 0 0 1-44.501333 37.717333l-29.568-29.525333a33.578667 33.578667 0 0 1-23.637333-8.874667c-8.874667-5.930667-8.874667-14.805333-8.874667-23.637333l-44.330667-44.373333a31.445333 31.445333 0 0 1-35.456-5.888c-11.861333-8.874667-11.861333-23.68-5.930666-35.498667l-47.317334-47.274667v198.058667c0 17.706667-17.706667 26.581333-32.512 17.706667L357.546667 655.402667H289.536c-17.749333 0-29.568-11.818667-29.568-29.568V401.194667c0-17.749333 11.818667-29.568 29.568-29.568h67.968l8.874667-5.930667-62.08-62.08a29.269333 29.269333 0 0 1 0-41.386667z m401.365334 44.458667a31.658667 31.658667 0 0 1 41.386666-2.986667 272.384 272.384 0 0 1 100.48 212.906667c0 56.149333-17.706667 106.410667-44.330666 150.741333l-44.373334-44.373333a212.48 212.48 0 0 0 29.610667-106.410667c0-67.968-29.568-127.104-79.786667-165.546666a29.738667 29.738667 0 0 1-2.986666-44.330667zM620.586667 371.626667c11.818667-8.874667 26.624-11.818667 38.442666-2.986667a180.48 180.48 0 0 1 73.898667 144.853333c0 23.68-2.986667 44.373333-11.818667 65.066667l-47.317333-47.317333c2.986667-5.930667 2.986667-11.818667 2.986667-17.749334 0-38.4-20.693333-73.898667-53.205334-97.536-14.805333-8.874667-14.805333-32.512-2.986666-44.373333z m-82.773334-130.090667c11.818667-8.874667 32.512 0 32.512 17.749333v168.533334l-121.173333-121.258667z" fill="#467CFD" style="--darkreader-inline-fill:#0231a1;"></path> </svg> </span> <span class="bt-audio true" title="静音"> <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M218.495828 334.609871c-0.390903-0.019443-0.773619-0.019443-1.164522-0.019443L100.022553 334.590428c-21.744233 0-39.087227 17.448394-39.087227 39.001269l0 273.866415c0 21.551852 17.505699 38.999223 39.087227 38.999223l117.308753 0c0.057305 0 0.113587 0 0.171915 0l0 0.153496 287.22056 185.975668c6.824429 5.842055 15.691377 9.354042 25.370831 9.354042 21.590737 0 39.096437-17.505699 39.096437-39.095413 0-1.794879-0.124843-3.551896-0.354064-5.270027L568.836985 183.473685c0.229221-1.718131 0.354064-3.475148 0.354064-5.269004 0-21.590737-17.505699-39.096437-39.096437-39.096437-8.895601 0-17.105586 2.977821-23.682375 7.979742L218.495828 334.609871zM757.858012 953.491133l0.085958 0.075725c123.876332-107.514689 202.211445-266.13329 202.211445-443.041442 0-177.214121-78.603219-336.062965-202.851011-443.61654l-0.11461 0.11461c-4.963035-3.817955-11.17655-6.109138-17.925255-6.109138-16.197914 0-29.322839 13.133112-29.322839 29.321816 0 6.757914 2.28095 12.981662 6.109138 17.926278l-0.333598 0.342808c0.821715 0.706081 1.641383 1.393743 2.462075 2.119267 1.173732 1.202385 2.452865 2.329045 3.817955 3.321652 110.054535 96.710622 179.51349 238.550071 179.51349 396.578224 0 158.02713-69.458955 299.866578-179.51349 396.577201-1.36509 0.99363-2.644223 2.118244-3.817955 3.321652-0.600681 0.533143-1.212618 1.048889-1.822508 1.564635l0.229221 0.230244c-4.152577 5.058203-6.643304 11.530614-6.643304 18.593474 0 16.188704 13.124925 29.321816 29.322839 29.321816C746.317165 960.134437 752.798786 957.651896 757.858012 953.491133zM713.998085 729.35433l0.23843 0.24764c55.380308-56.43022 89.532129-133.76454 89.532129-219.077577 0-85.409229-34.228569-162.800853-89.704045-219.249493l-0.268106 0.267083c-4.886287-3.64604-10.966773-5.821589-17.543561-5.821589-16.197914 0-29.322839 13.133112-29.322839 29.321816 0 6.566556 2.166339 12.657274 5.822612 17.544585l-0.162706 0.170892c0.773619 0.782829 1.547239 1.584078 2.310625 2.38635 0.075725 0.076748 0.152473 0.171915 0.23843 0.248663 43.3626 45.587268 69.983911 107.248629 69.983911 175.132716 0 67.884087-26.621311 129.544425-69.983911 175.131693-0.085958 0.077771-0.162706 0.171915-0.23843 0.24764-0.706081 0.74599-1.422396 1.471514-2.13871 2.214435l0.144286 0.134053c-3.751441 4.926196-5.976108 11.092639-5.976108 17.754363 0 16.188704 13.124925 29.321816 29.322839 29.321816C702.925912 735.328391 709.072913 733.113957 713.998085 729.35433z" fill="#467CFD" style="--darkreader-inline-fill:#0231a1;"></path> </svg> </span> </div> <div class="menu-container" style="right: 6px;"> <span class="bt-refresh" title="刷新记录"> <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M981.314663 554.296783a681.276879 681.276879 0 0 1-46.986468 152.746388q-105.706098 230.734238-360.983096 242.19829a593.06288 593.06288 0 0 1-228.689008-33.853939v-1.022615l-31.808709 79.979258a55.759429 55.759429 0 0 1-20.506122 22.551352 40.043451 40.043451 0 0 1-21.04434 5.382184 51.076928 51.076928 0 0 1-19.483507-5.382184 95.210839 95.210839 0 0 1-13.347817-7.158305 52.314831 52.314831 0 0 1-5.382184-4.628679L71.671707 731.908862a57.427906 57.427906 0 0 1-7.158305-21.528737 46.932646 46.932646 0 0 1 1.022615-17.438277 35.952991 35.952991 0 0 1 7.158305-13.347816 74.435608 74.435608 0 0 1 10.279972-10.279972 60.495751 60.495751 0 0 1 11.248765-7.373593 50.431066 50.431066 0 0 1 8.18092-3.606063 6.189512 6.189512 0 0 0 3.067845-1.776121l281.003839-74.866183a91.497132 91.497132 0 0 1 35.899168-2.583448 122.337047 122.337047 0 0 1 22.174599 6.404799 21.528737 21.528737 0 0 1 12.325202 12.325202 76.157907 76.157907 0 0 1 4.628679 14.854829 47.63233 47.63233 0 0 1 0 14.370431 55.167388 55.167388 0 0 1-2.04523 10.764369 10.764368 10.764368 0 0 0-1.022615 3.606063l-32.831324 79.979258a677.50935 677.50935 0 0 0 164.264262 39.505232q77.395809 7.696523 131.809692-3.606063a358.507291 358.507291 0 0 0 101.023598-36.921784 381.27393 381.27393 0 0 0 73.951211-50.753997 352.64071 352.64071 0 0 0 48.708767-55.382676 410.391547 410.391547 0 0 0 26.910921-41.550462c3.767529-7.481236 6.673908-13.616926 8.719139-18.460892zM40.885614 449.667121a685.69027 685.69027 0 0 1 63.563595-176.427998q118.0313-212.273346 374.330913-207.160271a571.803252 571.803252 0 0 1 207.160271 39.989629l33.853939-78.956643A75.619688 75.619688 0 0 1 735.187378 9.189165a37.67529 37.67529 0 0 1 15.393047-8.234742 42.303968 42.303968 0 0 1 14.854829-0.538219 47.578509 47.578509 0 0 1 13.347817 3.606064 102.907362 102.907362 0 0 1 11.302586 6.13569 49.569917 49.569917 0 0 1 6.673909 4.628678l3.067845 3.067845 154.84544 276.913379a81.970666 81.970666 0 0 1 6.13569 22.712817 46.986468 46.986468 0 0 1-1.022615 17.438277 32.293105 32.293105 0 0 1-7.696523 13.347817 69.322533 69.322533 0 0 1-10.764369 9.741753 92.142994 92.142994 0 0 1-11.302587 6.673909l-8.18092 4.09046a7.104483 7.104483 0 0 1-3.067845 1.022615l-283.049068 67.546412a112.003254 112.003254 0 0 1-46.125319-1.022615c-11.571696-3.390776-19.160576-8.019454-22.551352-13.832214a41.173709 41.173709 0 0 1-5.382184-21.04434 97.256069 97.256069 0 0 1 1.291724-17.438277 24.381295 24.381295 0 0 1 3.067845-8.234742L600.632773 296.81309a663.730958 663.730958 0 0 0-164.102797-43.057474q-77.987849-9.203535-131.809692 0a348.227319 348.227319 0 0 0-101.292707 33.853938 368.571976 368.571976 0 0 0-75.350579 49.246986 383.31916 383.31916 0 0 0-50.269601 54.360061 408.507783 408.507783 0 0 0-28.740863 41.012244A113.025869 113.025869 0 0 0 40.885614 449.667121z m0 0" fill="#467CFD" style="--darkreader-inline-fill:#0231a1;"></path> </svg> </span> </div> </div> <div class="info"> <table class="table" border="1px" cellspacing="0" cellpadding="0"> <caption> <h4>Name</h4> </caption> <tr> <th width="99px">观看次数</th> <td>Data</td> </tr> <tr> <th>观看时长</th> <td>Data</td> </tr> <tr> <th>视频时长</th> <td>Data</td> </tr> <tr> <th>剩余时长</th> <td>Data</td> </tr> <tr> <th>状态</th> <td>Data</td> </tr> <tr> <th>计时</th> <td>Data</td> </tr> </table> <p class="discription">注：在刚开始播放视频时请激活该页面，否则将导致计时系统失效。</p> </div>';
		//添加样式
		elStyle = document.createElement("style");
		elStyle.innerHTML = ':root {--root-width: 230px;--root-height: 325px;}.YHAssistant {z-index: 999;position: fixed;top: 30%;left: 5px;width: 50px;height: 50px;font-size: 16px;color: black;background-color: gainsboro;transition: width .5s ease, height .5s ease;overflow: hidden;}.YHAssistant h3,.YHAssistant h4,.YHAssistant p {margin: 0;}.YHAssistant:hover {width: var(--root-width);height: var(--root-height);}.YHAssistant>.titlebar {position: relative;top: 0;left: 0;}.YHAssistant:hover .bt-menu {top: 0;left: 0;}.YHAssistant:hover .label-title {visibility: visible;}.YHAssistant:hover .menu-container {visibility: visible;}.YHAssistant:hover .info {visibility: visible;}.titlebar>.bt-menu {position: absolute;top: 6px;left: 6px;margin: 3px;width: 32px;height: 32px;vertical-align: middle;fill: currentcolor;overflow: hidden;--darkreader-inline-fill: currentcolor;transition: .2s ease;}.titlebar>.label-title {position: absolute;top: 3px;left: 42px;width: calc(100% - 110px);line-height: 32px;overflow: hidden;visibility: hidden;}.titlebar>.label-title h3 {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}.menu-container {position: absolute;top: 6px;border-radius: 3px;padding: 3px;width: 24px;height: 24px;text-align: center;vertical-align: middle;visibility: hidden;}.menu-container:hover {background-color: rgba(128, 128, 128, 0.3);}.menu-container .bt-refresh,.menu-container .bt-audio {vertical-align: middle;fill: currentcolor;overflow: hidden;--darkreader-inline-fill: currentcolor;}.menu-container .bt-audio.true {display: none;}@keyframes rotate {from {-webkit-transform: rotate(0deg);}to {-webkit-transform: rotate(360deg);}}.menu-container:hover .bt-refresh svg {animation: rotate 2s linear infinite backwards;}.YHAssistant .info {position: relative;top: 32px;visibility: hidden;}.info .table {position: absolute;top: 15px;left: 10px;width: calc(var(--root-width) - 20px);}.info .table caption {height: 30px;}.info .table h4 {width: calc(var(--root-width) - 56px);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}.info .table td {text-align: center;}.info .discription {position: absolute;top: 195px;left: 10px;box-sizing: content-box;border: 1px dashed red;padding: 8px;width: calc(var(--root-width) - 38px);color: #bc2352;background-color: #ecb6c5;overflow: hidden;opacity: 0.8;}';
        this.HTML.appendChild(elStyle);
		//获得表格对象
		this.elTable = this.HTML.querySelector("div.info > table");
        //初始化基本信息
        this.baseInfo = parseBaseInfo();
        //绑定移动事件
		bindMover(this.HTML);

		//刷新课程名
        elTitle = this.HTML.querySelector("div.titlebar > div > h3");
        elTitle.innerText = document.querySelector('div.wrapper > div.nwrap > div > div.stuelearn-swrapper > div.stuelearn-intro > div.title').innerText.substr(5);
        elTitle.title = elTitle.innerText;
		//刷新视频名
		this.elTable.caption.innerHTML = `<h4>${null}</h4>`;
		//刷新状态
        this.elTable.rows[4].cells[1].innerText = '该页面不可用';
    }

	refreshUI() { //刷新整个UI
		var elTitle = null;

		//刷新课程名
		elTitle = this.HTML.querySelector("div.titlebar > div > h3");
        elTitle.innerText = this.course.title;
        elTitle.title = this.course.title;
		//刷新视频名
		this.elTable.caption.innerHTML = `<h4>${this.course.name}</h4>`;
		this.elTable.caption.title = this.course.name;
		//刷新观看次数
        this.elTable.rows[0].cells[1].innerText = this.course.viewCount + 1;
		//刷新观看时长
        this.currentDuration = this.course.duration;
        this.elTable.rows[1].cells[1].innerText = this.currentDuration + " s";
		//刷新视频时长
        this.elTable.rows[2].cells[1].innerText = this.course.videoDuration + " s";
		//刷新剩余时长
        this.countdown = this.course.videoDuration - this.currentDuration;
        (this.countdown > 0)? 1: this.countdown = 0;
        this.elTable.rows[3].cells[1].innerText = this.countdown + ' s';
		//刷新状态
        this.elTable.rows[4].cells[1].innerText = this.course.state;
	}

	_refreshTimer() { //计时并显示
		//刷新观看时长
        this.elTable.rows[1].cells[1].innerText = ++this.currentDuration + " s";
		//刷新剩余时长
        this.countdown = this.course.videoDuration - this.currentDuration;
        (this.countdown > 0)? 1: this.countdown = 0;
        this.elTable.rows[3].cells[1].innerText = this.countdown + ' s';
	}

    _setBG() { //完成后设置背景色为绿色
        if(!this._fg1 && this.course.finished) {
            this.HTML.style.backgroundColor = "mediumseagreen";
            this._fg1 = true;
        }
    }

	bindBtMenu() { //绑定菜单按钮事件
        var btAudioFalse = this.HTML.querySelector('div.titlebar > div:nth-child(3) > span.bt-audio.false');
        var btAudioTrue = this.HTML.querySelector('div.titlebar > div:nth-child(3) > span.bt-audio.true');
        var btRefresh = this.HTML.querySelector('div.titlebar > div:nth-child(4) > span.bt-refresh');

        //绑定刷新按钮
        btRefresh.onclick = () => {
            //请求数据
            if(this.course.refresh()) {
                this.ocTip.append("刷新成功");
                //更新显示
                this.refreshUI();
                this.course.finished && this.next();
                //设置时间并播放
                this.video.currentTime = this.course.duration;
                this.video.play();
            }
            else {
                this.ocTip.append(`刷新失败, 错误码[${this.course.errCode}],<br> 信息: ${this.course.errMsg}.`);
            }
        };
        //绑定静音按钮
        btAudioFalse.onclick = () => {
            btAudioFalse.style.display = 'none';
            btAudioTrue.style.display = 'block';
            this.video.muted = false;
            this.ocTip.append('已取消静音');
        }
        btAudioTrue.onclick = () => {
            btAudioTrue.style.display = 'none';
            btAudioFalse.style.display = 'block';
            this.video.muted = true;
            this.ocTip.append("已静音.");
        }
	}

    _bindOnDuty() { //绑定值守事件
        //执行值守时钟
        !this._tID1 && (this._tID1 = setInterval(() => {
            this._timer1++;
            (this._timer1 >= 5) && (this.onduty = false);
        }, 1000));
        //定义鼠标移动事件
        document.body.onmousemove = () => {
            this.onduty = true;
            this._timer1 = 0;
        };
    }

    _bindVideoEvent() { //绑定视频事件
        this.video.ontimeupdate = () => { //视频播放时间改变
            if(this._timer2 != parseInt(this.video.currentTime)) { //经过 1s
                this._timer2 = parseInt(this.video.currentTime);
                //刷新计时
                this._refreshTimer();
                if(!this._fg2 && this.countdown == 0) { //倒计时为 0 判断是否完成
                    this.fg2 = true;
                    this.refreshUI();
                    if(this.course.refresh() && this.course.finished) {
                        this.next();
                    }
                    else { //设置时间并播放
                        this.video.currentTime = this.course.duration;
                        this.video.play();
                        this._fg2 = false;
                    }
                }
            }
        };

        this.video.addEventListener('pause', () => { //视频播放暂停
            var popup = document.querySelector('div.layui-layer');

            if(popup && popup.querySelector('div.layui-layer-btn a').innerText == "开始播放") { //输入验证码
                popup.querySelector('div.layui-layer-btn a').onclick = () => { //点击确认
                    if(!this.video.paused) { //验证成功
                        document.body.removeChild(popup);
                    }
                };
                !this.onduty && playBeep();
            }
            else if(popup) { //时长上传失败
                var shade = document.querySelector('div.layui-layer-shade');

                shade && document.body.removeChild(shade);
                document.body.removeChild(popup);
                this.video.play();
                setTimeout(()=>{this.video.paused && !this.onduty && playBeep();}, 5000);
            }
        });

        this.video.addEventListener('ended', () => { //视频播放结束
            if(this.course && this.course.refresh() && this.course.finished) {
                this.next();
            }
            else {
                this.refreshUI();
                this.video.currentTime = this.course.duration;
                this.video.play();
            }
        });
    }

    next() { //切换下一个
        this.course && this.course._urls[this.course.index + 1].click();
    }

    jumpNext() { //跳转至下一个未完成页面
        for(let obj of this.course._json.list) { //遍历当前页状态
            if(/(未学完|未学|已学)/.exec(obj.state)[0] != '已学') {
                let url = this.course.prefixURL1 + obj.url;
                location.replace(url);
                return true;
            }
        }
        //已完成当前页所有视频
        if(this.course.pageInfo.page == this.course.pageInfo.pageCount) { //已完成所有视频
            alert('恭喜, 您已看完所有视频啦, 再接再厉!');
        }
        else { //播放下页首个视频
            this.course._urls[this.course.pageInfo.page * this.course.pageInfo.pageSize + 1].click();
        }
    }

    show() {
    	document.body.appendChild(this.HTML);
    }

    exec() {
        if(this._pageOther) {
            this._exec();
            return true;
        }
        //启动主时钟
        !this._mtID && (this._mtID = setInterval(() => {
            //更新计时器
            this.mainTimer++;
            this.elTable.rows[5].cells[1].innerText = `${this.mainTimer} s`;
            //设置背景
            this._setBG()
            //离开前 5 秒, 每 2 秒播放提示音
            !this.onduty && this._timer1 < 10 && (this._timer1 % 2 != 0) && this.video.paused && playBeep();
            //离开 15-60 秒, 每 5 秒播放提示音
            this._timer1 >= 15 && this._timer1 < 60 && (this._timer1 % 5 == 0) && this.video.paused && playBeep();
        }, 1000));
        //初始化课程对象并刷新显示
        if(this.baseInfo) this.course = new Course(this.baseInfo.courseId);
        else alert('课程 ID 获取失败, 请重试!');
        this.refreshUI();
        //是否已完成
        if(this.course.finished && this.autoplay) { //该视频已完成
            this.jumpNext();
            return true;
        }
        else if(this.course.finished && !this.autoplay) {
            if(confirm('恭喜, 您已经看完成这个视频了, 点击"确定"跳转至下一视频!')) { //确定
                this.jumpNext()
                return true;
            }
        }
        //是否自动播放
        this.autoplay && this.video.play();

        return true;
    }

    _exec() {

    }
}


function parseBaseInfo() { //初始化时获得临时信息
    if(!readSessionStorage('baseInfo')) {
        const [, courseId, , chapterId] = location.search.substr(1).split(/[=&]/);
        const baseInfo = {courseId, chapterId};
        if(!writeSessionStorage('baseInfo', JSON.stringify(baseInfo))) return false;
    }
    return JSON.parse(sessionStorage.baseInfo);
}

function playBeep() {
    var beep = document.createElement("audio");
    var beepURL = "https://ppt-mp3cdn.hrxz.com/d/file/filemp3/hrxz.com-x4doomn0dzp64687.mp3";

    beep.src = beepURL;
    beep.play()
    delete beep;
}


function readSessionStorage(key, displace=null) {
    if(sessionStorage.getItem(key)) {
        return sessionStorage.getItem(key);
    }
    else {
        return displace;
    }
}

function writeSessionStorage(key, value, cover=false) {
    if(!sessionStorage.getItem(key) || cover) {
        sessionStorage.setItem(key, value);
        return true;
    }
    return false;
}

function bindMover(el) {
    el.onmousedown = (e) => {
        let disX = e.clientX - el.offsetLeft;
        let disY = e.clientY - el.offsetTop;
        document.onmousemove = function(e) {
            let tX = e.clientX - disX;
            let tY = e.clientY - disY;
            if (tX >= 0 && tX <= window.innerWidth - el.offsetWidth) {
                el.style.left = tX + 'px';
            }
            if (tY >= 0 && tY <= window.innerHeight - el.offsetHeight) {
                el.style.top = tY + 'px';
            }
        };
        document.onmouseup = function(e) {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
}

function waitingUntil(call, judge=false, sensitivity=250) {
    if(!judge) {
        setTimeout(call, sensitivity);
    }
    else {
        waitingUntil(call, judge, sensitivity);
    }
}

function parseSec(time="") {
    /**
     * 函数名: parseSec()
     * 说明: 把时间格式的字符串转换为秒数.*/
    let sec = 0;
    if(time != "" && !isNaN(Date.parse("1970-1-1 " + time))) { //判断是否是时间格式
        let t = time.split(":");
        sec += parseInt(t[0]) * 3600 + parseInt(t[1]) * 60 + parseInt(t[2]);
    }
    else return -1;
    return sec;
}

function formatSec(sec) {
    /**
     * 函数名: formateSec()
     * 说明: 把秒数转换为时间格式的字符串.*/
     return (new Date(sec * 1000).toTimeString().slice(0, 8));
}


(function() {
    'use strict';

    $(document).ready(function() {
        window.yha = new YHAssistant();

        window.yha.show();
        window.yha.exec();
    });
})();
