// ==UserScript==
// @name   不学习何以强国
// @namespace   https://greasyfork.org/zh-CN/users/714887-%E7%A8%8B%E9%B9%8F233
// @version   20220930
// @icon   data:image/jpeg;base64,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
// @homepage  https://cpddd.tk/
// @description  `学习强国` 读文章,看视频，做习题。
// @author  程鹏
// @match   https://www.xuexi.cn/*
// @match   https://pc.xuexi.cn/points/exam-practice.html
// @match   https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match   https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @require   https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @original-script https://github.com/Xu22Web/tech-study-js
// @original-author Xu22Web
// @license MIT
// @run-at   document-start
// @grant   GM_addStyle
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @grant   GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/452267/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E5%BC%BA%E5%9B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/452267/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E5%BC%BA%E5%9B%BD.meta.js
// ==/UserScript==
/***
 *                    _ooOoo_
 *                   o8888888o
 *                   88" . "88
 *                   (| -_- |)
 *                    O\ = /O
 *                ____/`---'\____
 *              .   ' \\| |// `.
 *               / \\||| : |||// \
 *             / _||||| -:- |||||- \
 *               | | \\\ - /// | |
 *             | \_| ''\---/'' | |
 *              \ .-\__ `-` ___/-. /
 *           ___`. .' /--.--\ `. . __
 *        ."" '< `.___\_<|>_/___.' >'"".
 *       | | : `- \`.;`\ _ /`;.`/ - ` : | |
 *         \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 *                    `=---='
 *
 * .............................................
 *🙏佛祖保佑  永无BUG  刷课不被抓  挂科比不挂柯南🙏
 */
/**
 * @description url配置
 */
const URL_CONFIG = {
    // 主页
    home: /^https\:\/\/www\.xuexi\.cn(\/(index\.html)?)?$/,
    // 每日答题页面
    examPractice: 'https://pc.xuexi.cn/points/exam-practice.html',
    // 每周答题页面
    examWeekly: 'https://pc.xuexi.cn/points/exam-weekly-detail.html',
    // 专项练习页面
    examPaper: 'https://pc.xuexi.cn/points/exam-paper-detail.html',
    // 登录界面
    login: 'https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=ffdea2ded23f45ab%2FKQreTlDFe1Id3B7BVdaaYcTMp6lsTBB%2Fs3gGevuMKfvpbABDEl9ymG3bbOgtpSN&check_login=https%3A%2F%2Fpc-api.xuexi.cn',
};


/**
 * @description api配置
 */
const API_CONFIG = {
    // 用户信息
    userInfo: 'https://pc-api.xuexi.cn/open/api/user/info',
    // 总分
    totalScore: 'https://pc-api.xuexi.cn/open/api/score/get',
    // 当天分数
    todayScore: 'https://pc-api.xuexi.cn/open/api/score/today/query',
    // 任务列表
    taskList: 'https://pc-proxy-api.xuexi.cn/api/score/days/listScoreProgress?sence=score&deviceType=2',
    // 新闻数据
    todayNews: [
        'https://www.xuexi.cn/lgdata/1jscb6pu1n2.json',
        'https://www.xuexi.cn/lgdata/1ap1igfgdn2.json',
        'https://www.xuexi.cn/lgdata/35il6fpn0ohq.json',
    ],
    // 视频数据
    todayVideos: [
        'https://www.xuexi.cn/lgdata/525pi8vcj24p.json',
        'https://www.xuexi.cn/lgdata/11vku6vt6rgom.json',
        'https://www.xuexi.cn/lgdata/2qfjjjrprmdh.json',
        'https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json',
        'https://www.xuexi.cn/lgdata/591ht3bc22pi.json',
    ],
    // 每周答题列表
    weeklyList: 'https://pc-proxy-api.xuexi.cn/api/exam/service/practice/pc/weekly/more',
    // 专项练习列表
    paperList: 'https://pc-proxy-api.xuexi.cn/api/exam/service/paper/pc/list',
    // 文本服务器保存答案
    answerSave: 'https://a6.qikekeji.com/txt/data/save',
    // 文本服务器获取答案
    answerSearch: 'https://api.answer.uu988.xyz:4545/answer/search',
};


/**
 * @description 获取cookie
 * @param name
 * @returns
 */
function getCookie(name) {
    // 获取当前所有cookie
    const strCookies = document.cookie;
    // 截取变成cookie数组
    const cookieText = strCookies.split(';');
    // 循环每个cookie
    for (const i in cookieText) {
        // 将cookie截取成两部分
        const item = cookieText[i].split('=');
        // 判断cookie的name 是否相等
        if (item[0].trim() === name) {
            return item[1].trim();
        }
    }
    return null;
}
/**
 * @description 防抖
 * @param callback
 * @param delay
 * @returns
 */
function debounce(callback, delay) {
    let timer = -1;
    return function (...args) {
        if (timer !== -1) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}
/**
 * @description 选择器
 * @param selector
 * @returns
 */
function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}
/**
 * @description 关闭子窗口
 */
function closeWin() {
    try {
        window.opener = window;
        const win = window.open('', '_self');
        win?.close();
        top?.close();
    }
    catch (e) { }
}
/**
 * @description 等待窗口关闭
 * @param newPage
 * @returns
 */
function waitingClose(newPage) {
    return new Promise((resolve) => {
        const doing = setInterval(() => {
            if (newPage.closed) {
                clearInterval(doing); // 停止定时器
                resolve('done');
            }
        }, 500);
    });
}
/**
 * @description 等待时间
 * @param time
 * @returns
 */
function waitingTime(time) {
    if (!Number.isInteger(time)) {
        time = 500;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('done');
        }, time);
    });
}
/**
 * @description 判断是否为移动端
 * @returns
 */
function hasMobile() {
    let isMobile = false;
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        console.log('移动端');
        isMobile = true;
    }
    if (document.body.clientWidth < 800) {
        console.log('小尺寸设备端');
        isMobile = true;
    }
    return isMobile;
}
/**
 * @description 将 GET 请求参数插入 URL
 * @param url
 * @param params
 * @returns
 */
function stringfyParamsURL(url, params) {
    // 参数名
    const keys = Object.keys(params);
    // 参数名存在
    if (keys.length) {
        // 完整链接
        const fullURL = `${url}?${keys
            .filter((key) => key.length)
            .map((key) => `${key}=${params[key]}`)
            .join('&')}`;
        return fullURL;
    }
    return url;
}
/**
 * @description 创建元素节点
 * @param eleName
 * @param props
 * @param attrs
 * @param children
 * @returns
 */
function creatElementNode(eleName, props, attrs, children) {
    // 元素
    let ele;
    // 格式化元素名
    const formatEleName = eleName.toLowerCase();
    // 需要命名空间的svg元素
    const specficSVGElement = [
        'svg',
        'use',
        'circle',
        'rect',
        'line',
        'marker',
        'linearGradient',
        'g',
        'path',
    ];
    // 需要命名空间的html元素
    const specficHTMLElement = 'html';
    if (formatEleName === specficHTMLElement) {
        // html元素命名空间
        const ns = 'http://www.w3.org/1999/xhtml';
        // 创建普通元素
        ele = document.createElementNS(ns, formatEleName);
    }
    else if (specficSVGElement.includes(formatEleName)) {
        // svg元素命名空间
        const ns = 'http://www.w3.org/2000/svg';
        // 创建普通元素
        ele = document.createElementNS(ns, formatEleName);
    }
    else {
        // 创建普通元素
        ele = document.createElement(formatEleName);
    }
    // props属性设置
    for (const key in props) {
        if (props[key] instanceof Object) {
            for (const subkey in props[key]) {
                ele[key][subkey] = props[key][subkey];
            }
        }
        else {
            ele[key] = props[key];
        }
    }
    // attrs属性设置
    for (const key in attrs) {
        // 属性值
        const value = attrs[key];
        // 处理完的key
        const formatKey = key.toLowerCase();
        // xlink命名空间
        if (formatKey.startsWith('xlink:')) {
            // xlink属性命名空间
            const attrNS = 'http://www.w3.org/1999/xlink';
            if (value) {
                ele.setAttributeNS(attrNS, key, value);
            }
            else {
                ele.removeAttributeNS(attrNS, key);
            }
        }
        else if (formatKey.startsWith('on')) {
            // 事件监听
            const [, eventType] = key.toLowerCase().split('on');
            // 事件类型
            if (eventType) {
                // 回调函数
                if (value instanceof Function) {
                    ele.addEventListener(eventType, value);
                    // 回调函数数组
                }
                else if (value instanceof Array) {
                    for (const i in value) {
                        // 回调函数
                        if (value[i] instanceof Function) {
                            ele.addEventListener(eventType, value[i]);
                        }
                    }
                }
            }
        }
        else {
            // 特殊属性
            const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
            if (specificAttrs.includes(key) && value) {
                ele.setAttribute(key, '');
            }
            else {
                if (value) {
                    ele.setAttribute(key, value);
                }
                else {
                    ele.removeAttribute(key);
                }
            }
        }
    }
    // 子节点
    if (children) {
        if (children instanceof Array) {
            if (children.length === 1) {
                ele.append(children[0]);
            }
            else {
                // 文档碎片
                const fragment = document.createDocumentFragment();
                for (const i in children) {
                    fragment.append(children[i]);
                }
                ele.append(fragment);
            }
        }
        else {
            ele.append(children);
        }
    }
    return ele;
}
/**
 * @description 创建文字节点
 * @param text
 * @returns
 */
function createTextNode(...text) {
    if (text && text.length === 1) {
        return document.createTextNode(text[0]);
    }
    const fragment = document.createDocumentFragment();
    for (const i in text) {
        const textEle = document.createTextNode(text[i]);
        fragment.append(textEle);
    }
    return fragment;
}


const css = ':root {\n  --themeColor: #fa3333;\n  --scale: 1;\n  font-size: calc(10px * var(--scale));\n}\n.icon {\n  width: 1em;\n  height: 1em;\n  vertical-align: -0.15em;\n  fill: currentColor;\n  overflow: hidden;\n}\n.egg_btn {\n  transition: 0.5s;\n  outline: none;\n  border: none;\n  padding: 1.2rem 2rem;\n  border-radius: 1.2rem;\n  cursor: pointer;\n  font-size: 1.8rem;\n  font-weight: bold;\n  text-align: center;\n  color: rgb(255, 255, 255);\n  background: #666777;\n}\n.egg_btn.manual {\n  background: #e3484b;\n}\n.egg_setting_box {\n  position: fixed;\n  top: 7rem;\n  left: 1rem;\n  padding: 1.2rem 2rem;\n  border-radius: 1rem;\n  background: #fff;\n  box-shadow: 0 0 0.4rem 0.1rem #ccc;\n  transition: 80ms ease-out;\n  z-index: 99999;\n}\n.egg_setting_box hr {\n  height: 0.1rem;\n  border: none;\n  background: #eee;\n}\n.egg_setting_item {\n  margin-top: 0.5rem;\n  min-height: 3rem;\n  min-width: 20rem;\n  font-size: 1.6rem;\n  display: flex;\n  justify-items: center;\n  justify-content: space-between;\n}\n.egg_info {\n  flex-direction: column;\n}\n.egg_userinfo {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.egg_login_status {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.egg_login_status button {\n  outline: none;\n  padding: 0.4rem 0.8rem;\n  background: #ccc;\n  font-size: 1.4rem;\n  border: none;\n  border-radius: 1rem;\n  color: white;\n  cursor: pointer;\n}\n.egg_login_status.active {\n  flex-grow: 1;\n}\n.egg_login_status.active button {\n  background: var(--themeColor);\n  padding: 0.8rem 2.4rem;\n}\n.egg_userinfo .egg_user {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 0.5rem 0;\n}\n.egg_userinfo .egg_user .egg_sub_nickname,\n.egg_userinfo .egg_user .egg_avatar_img {\n  height: 5rem;\n  width: 5rem;\n  border-radius: 50%;\n  background: var(--themeColor);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  font-size: 2rem;\n  color: white;\n}\n.egg_userinfo .egg_user .egg_name {\n  padding-left: 0.5rem;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: 10rem;\n}\n.egg_scoreinfo {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 0.8rem;\n}\n.egg_scoreinfo .egg_totalscore,\n.egg_scoreinfo .egg_todayscore {\n  font-size: 1.2rem;\n}\n.egg_scoreinfo span {\n  color: var(--themeColor);\n  padding-left: 0.4rem;\n  font-weight: bold;\n}\n.egg_setting_item label {\n  flex-grow: 1;\n}\n.egg_progress {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 0;\n}\n.egg_progress .egg_track {\n  background: #ccc;\n  height: 0.5rem;\n  border-radius: 1rem;\n  flex: 1 1 auto;\n  overflow: hidden;\n  box-shadow: -0.1rem 0.1rem 0.1rem -0.1rem #999 inset,\n    0.1rem 0.1rem 0.1rem -0.1rem #999 inset;\n}\n.egg_progress .egg_track .egg_bar {\n  height: 0.5rem;\n  background: var(--themeColor);\n  border-radius: 1rem;\n  width: 0;\n  transition: width 0.5s;\n}\n.egg_progress .egg_percent {\n  font-size: 1.2rem;\n  padding-left: 0.5rem;\n  width: 3.5rem;\n}\ninput[type=\'checkbox\'].egg_setting_switch {\n  cursor: pointer;\n  margin: 0;\n  outline: 0;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  position: relative;\n  width: 4.2rem;\n  height: 2.2rem;\n  background: #ccc;\n  border-radius: 5rem;\n  transition: background 0.3s;\n  --border-padding: 0.5rem;\n  box-shadow: -0.1rem 0 0.1rem -0.1rem #999 inset,\n    0.1rem 0 0.1rem -0.1rem #999 inset;\n}\ninput[type=\'checkbox\'].egg_setting_switch::after {\n  content: \'\';\n  display: inline-block;\n  width: 1.4rem;\n  height: 1.4rem;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 0 0.2rem #999;\n  transition: 0.4s;\n  position: absolute;\n  top: calc(50% - (1.4rem / 2));\n  position: absolute;\n  left: var(--border-padding);\n}\ninput[type=\'checkbox\'].egg_setting_switch:checked {\n  background: var(--themeColor);\n}\ninput[type=\'checkbox\'].egg_setting_switch:checked::after {\n  left: calc(100% - var(--border-padding) - 1.4rem);\n}\n.egg_start_btn {\n  justify-content: center;\n}\n.egg_study_btn {\n  outline: none;\n  background: var(--themeColor);\n  padding: 0.8rem 2.4rem;\n  font-size: 1.4rem;\n  border: none;\n  border-radius: 1rem;\n  color: white;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.egg_study_btn:hover {\n  opacity: 0.8;\n}\n@keyframes fade {\n  from {\n    opacity: 0.8;\n  }\n  to {\n    opacity: 0.4;\n    background: #ccc;\n  }\n}\n.egg_study_btn.loading {\n  animation: fade 2s ease infinite alternate;\n}\n.egg_study_btn.disabled {\n  background: #ccc;\n}\n.egg_tip {\n  position: fixed;\n  bottom: 2rem;\n  left: 2rem;\n  padding: 1.2rem 1.4rem;\n  border: none;\n  border-radius: 1rem;\n  background: #222222;\n  color: #ffffff;\n  font-size: 1.4rem;\n  font-weight: bold;\n  transition: all 0.8s ease;\n  opacity: 0;\n  transform: scale(0.9) translateY(10px);\n}\n.egg_tip.active {\n  opacity: 1;\n  transform: scale(1) translateY(0);\n}\n.egg_frame {\n  position: relative;\n  box-sizing: border-box;\n  margin: 0 auto;\n}\n.egg_frame.active {\n  padding: 4px;\n  width: 21.8rem;\n  height: 21.8rem;\n  overflow: hidden;\n}\n.egg_frame .egg_frame_login {\n  position: absolute;\n  left: -6.9rem;\n  top: -2.6rem;\n}\n.egg_frame iframe {\n  width: 284px;\n  height: 241px;\n  border: none;\n  transform: scale(var(--scale));\n  transform-origin: top left;\n}\n';
// 嵌入样式
GM_addStyle(css);
/* Config·配置 */
// 每周答题开启逆序答题: false: 顺序答题; true: 逆序答题
const examWeeklyReverse = true;
// 专项答题开启逆序答题: false: 顺序答题; true: 逆序答题
const examPaperReverse = true;
//  答题请求速率限制
const ratelimitms = 1000;
// 单次最大新闻数
const maxNewsNum = 6;
// 单次最大视频数
const maxVideoNum = 6;
/* Config End·配置结束 */
/* Tools·工具函数  */
// 暂停锁
function pauseLock(callback) {
    return new Promise((resolve) => {
        if (pause) {
            const doing = setInterval(() => {
                if (!pause) {
                    // 停止定时器
                    clearInterval(doing);
                    console.log('答题等待结束！');
                    if (callback && callback instanceof Function) {
                        callback('done');
                    }
                    resolve('done');
                    return;
                }
                if (callback && callback instanceof Function) {
                    callback('pending');
                }
                console.log('答题等待...');
            }, 500);
            return;
        }
        resolve('done');
    });
}
// 暂停学习锁
function pauseStudyLock(callback) {
    return new Promise((resolve) => {
        if (pauseStudy) {
            const doing = setInterval(() => {
                if (!pauseStudy) {
                    // 停止定时器
                    clearInterval(doing);
                    console.log('学习等待结束！');
                    if (callback && callback instanceof Function) {
                        callback('done');
                    }
                    resolve('done');
                    return;
                }
                if (callback && callback instanceof Function) {
                    callback('pending');
                }
                console.log('学习等待...');
            }, 500);
            return;
        }
        resolve('done');
    });
}
/* Tools End·工具函数结束 */
/* API请求函数 */
// 获取用户信息
async function getUserInfo() {
    try {
        const res = await fetch(API_CONFIG.userInfo, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            return data;
        }
    }
    catch (err) { }
}
// 获取总积分
async function getTotalScore() {
    try {
        const res = await fetch(API_CONFIG.totalScore, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            // 总分
            const { score } = data;
            return score;
        }
    }
    catch (err) { }
}
// 获取当天总积分
async function getTodayScore() {
    try {
        const res = await fetch(API_CONFIG.todayScore, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            // 当天总分
            const { score } = data;
            return score;
        }
    }
    catch (err) { }
}
// 获取任务列表
async function getTaskList() {
    try {
        const res = await fetch(API_CONFIG.taskList, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            // 进度和当天总分
            const { taskProgress } = data;
            return taskProgress;
        }
    }
    catch (err) { }
}
// 获取新闻数据
async function getTodayNews() {
    // 随机
    const randNum = ~~(Math.random() * API_CONFIG.todayNews.length);
    try {
        // 获取重要新闻
        const res = await fetch(API_CONFIG.todayNews[randNum], {
            method: 'GET',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    }
    catch (err) { }
}
// 获取视频数据
async function getTodayVideos() {
    // 随机
    const randNum = ~~(Math.random() * API_CONFIG.todayVideos.length);
    try {
        // 获取重要新闻
        const res = await fetch(API_CONFIG.todayVideos[randNum], {
            method: 'GET',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    }
    catch (err) { }
}
// 专项练习数据
async function getExamPaper(pageNo) {
    // 链接
    const url = `${API_CONFIG.paperList}?pageSize=50&pageNo=${pageNo}`;
    try {
        // 获取专项练习
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            const paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
            // JSON格式化
            const paper = JSON.parse(paperJson);
            return paper;
        }
    }
    catch (err) {
        return [];
    }
    return [];
}
// 每周答题数据
async function getExamWeekly(pageNo) {
    // 链接
    const url = `${API_CONFIG.weeklyList}?pageSize=50&pageNo=${pageNo}`;
    try {
        // 获取每周答题
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            const paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
            // JSON格式化
            const paper = JSON.parse(paperJson);
            return paper;
        }
    }
    catch (err) {
        return [];
    }
    return [];
}
// 获取答案
async function getAnswer(question) {
    console.log('获取网络答案');
    // 数据
    const data = {
        question,
    };
    try {
        // 请求
        const res = await fetch(API_CONFIG.answerSearch, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            // 状态
            const { errno } = data;
            if (errno !== -1) {
                // 答案
                const { answers } = data.data;
                console.log('answers', answers);
                return answers;
            }
        }
    }
    catch (error) { }
    return [];
}
// 保存答案
async function saveAnswer(key, value) {
    // 内容
    const content = JSON.stringify([{ title: key, content: value }]);
    // 数据
    const data = {
        txt_name: key,
        txt_content: content,
        password: '',
        v_id: '',
    };
    // 请求体
    const body = Object.keys(data)
        .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    })
        .join('&');
    // 请求
    const res = await fetch(API_CONFIG.answerSave, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body,
    });
    // 请求成功
    if (res.ok) {
        try {
            const data = await res.json();
            return data;
        }
        catch (err) {
            return null;
        }
    }
    return null;
}
/* API请求函数结束 */
/* 变量 */
// 任务进度
const tasks = [];
// 获取 URL
const { href } = window.location;
// 设置
let settings = [true, true, true, true, true, false, false];
// 已经开始
let started = false;
// 是否暂停答题
let pause = false;
// 是否暂停学习
let pauseStudy = false;
// 初始化登录状态
let login = !!getCookie('token');
// 用户信息
let userInfo;
// 新闻
let news = [];
// 视频
let videos = [];
// load
window.addEventListener('load', () => {
    console.log('加载脚本');
    // 主页
    if (URL_CONFIG.home.test(href)) {
        console.log('进入主页面！');
        let ready = setInterval(() => {
            if ($$('.text-wrap')[0]) {
                // 停止定时器
                clearInterval(ready);
                // 设置字体
                initFontSize();
                // 初始化设置
                initSetting();
                // 渲染菜单
                renderMenu();
            }
        }, 800);
    }
    else if (typeof GM_getValue('readingUrl') === 'string' &&
        href === GM_getValue('readingUrl')) {
        // 初始化设置
        initSetting();
        reading(0);
    }
    else if (typeof GM_getValue('watchingUrl') === 'string' &&
        href === GM_getValue('watchingUrl')) {
        // 初始化设置
        initSetting();
        let randNum = 0;
        const checkVideoPlayingInterval = setInterval(() => {
            let temp = getVideoTag();
            if (temp.video) {
                if (!temp.video.muted) {
                    temp.video.muted = true;
                }
                if (temp.video.paused) {
                    console.log('正在尝试播放视频');
                    if (randNum === 0) {
                        // 尝试使用js的方式播放
                        try {
                            temp.video.play(); // 尝试使用js的方式播放
                        }
                        catch (e) { }
                        randNum++;
                    }
                    else {
                        try {
                            temp.pauseButton?.click(); // 尝试点击播放按钮播放
                        }
                        catch (e) { }
                        randNum--;
                    }
                }
                else {
                    console.log('成功播放');
                    clearInterval(checkVideoPlayingInterval);
                    reading(1);
                }
            }
            else {
                console.log('等待加载');
            }
        }, 800);
    }
    else if (href.includes(URL_CONFIG.examPaper) ||
        href.includes(URL_CONFIG.examPractice) ||
        href.includes(URL_CONFIG.examWeekly)) {
        console.log('进入答题页面！');
        // 答题页面
        const ready = setInterval(() => {
            if ($$('.title')[0]) {
                clearInterval(ready); // 停止定时器
                // 创建“手动答题”按钮
                createManualButton();
                // 开始答题
                doingExam();
            }
        }, 500);
    }
    else {
        console.log('此页面不支持加载学习脚本！');
    }
});
// 获取video标签
function getVideoTag() {
    let iframe = $$('iframe')[0];
    let video;
    let pauseButton;
    var u = navigator.userAgent;
    if (u.indexOf('Mac') > -1) {
        // Mac
        if (iframe && iframe.innerHTML) {
            // 如果有iframe,说明外面的video标签是假的
            video = iframe.contentWindow?.document.getElementsByTagName('video')[0];
            pauseButton = (iframe.contentWindow?.document.getElementsByClassName('prism-play-btn')[0]);
        }
        else {
            // 否则这个video标签是真的
            video = $$('video')[0];
            pauseButton = $$('.prism-play-btn')[0];
        }
        return {
            video: video,
            pauseButton: pauseButton,
        };
    }
    else {
        if (iframe) {
            // 如果有iframe,说明外面的video标签是假的
            video = (iframe.contentWindow?.document.getElementsByTagName('video')[0]);
            pauseButton = (iframe.contentWindow?.document.getElementsByClassName('prism-play-btn')[0]);
        }
        else {
            // 否则这个video标签是真的
            video = $$('video')[0];
            pauseButton = $$('.prism-play-btn')[0];
        }
        return {
            video: video,
            pauseButton: pauseButton,
        };
    }
}
// 读新闻或者看视频
// type:0为新闻，1为视频
async function reading(type) {
    // 看文章或者视频
    let time = 1;
    if (type === 0) {
        // 80-100秒后关闭页面，看文章
        time = ~~(Math.random() * 20 + 80) + 1;
    }
    if (type === 1) {
        // 100-150秒后关闭页面，看视频
        time = ~~(Math.random() * 50 + 100) + 1;
    }
    let firstTime = time - 2;
    let secendTime = 12;
    // 滚动长度
    const scrollLength = document.body.scrollHeight / 2;
    await createTip('距离关闭页面还剩', time, (time) => {
        if (time === firstTime) {
            window.scrollTo(0, 394);
        }
        if (time === secendTime) {
            window.scrollTo(0, scrollLength / 3);
        }
        if (time === 0) {
            if (type === 0) {
                GM_setValue('readingUrl', null);
            }
            else {
                GM_setValue('watchingUrl', null);
            }
            // 关闭窗口
            closeWin();
        }
    });
    // 关闭文章或视频页面
}
// 创建学习提示
async function createTip(text, delay, callback) {
    return new Promise((resolve) => {
        // 提示
        let tipInfo = creatElementNode('div', undefined, {
            id: 'studyTip',
            class: 'egg_tip',
        });
        // 插入节点
        document.body.append(tipInfo);
        // 操作
        const operate = {
            destroy() {
                if (tipInfo) {
                    // 隐藏
                    operate.hide();
                    tipInfo.remove();
                    tipInfo = null;
                }
            },
            hide() {
                if (tipInfo) {
                    tipInfo.classList.remove('active');
                }
            },
            show() {
                if (tipInfo) {
                    tipInfo.classList.add('active');
                }
            },
        };
        tipInfo.append(text ? text : '');
        if (delay && delay >= 0) {
            // 倒计时
            const countdown = creatElementNode('span', {
                innerText: ` ${delay} s`,
            }, {
                class: 'egg_countdown',
            });
            tipInfo.appendChild(countdown);
            operate.show();
            // 定时
            const timer = setInterval(() => {
                countdown.innerText = ` ${delay} s`;
                if (typeof delay === 'number' && callback) {
                    callback(delay, operate);
                }
                // 倒计时结束
                if (!delay) {
                    // 清除计时器
                    clearInterval(timer);
                    // 隐藏
                    operate.hide();
                    resolve(operate);
                    return;
                }
                delay--;
            }, 1000);
            return;
        }
        operate.show();
        resolve(operate);
    });
}
// 获取新闻列表
function getNews() {
    return new Promise(async (resolve) => {
        // 需要学习的新闻数量
        const need = tasks[0].need < maxNewsNum ? tasks[0].need : maxNewsNum;
        console.log(`还需要看 ${need} 个新闻`);
        // 获取重要新闻
        const data = await getTodayNews();
        if (data && data.length) {
            // 数量补足需要数量
            while (news.length < need) {
                // 随便取
                const randomIndex = ~~(Math.random() * data.length);
                // 新闻
                const item = data[randomIndex];
                // 是否存在新闻
                if (item.dataValid && item.type === 'tuwen') {
                    news.push(item);
                }
            }
        }
        else {
            news = [];
        }
        resolve('done');
    });
}
// 获取视频列表
function getVideos() {
    return new Promise(async (resolve) => {
        // 需要学习的视频数量
        const need = tasks[1].need < maxVideoNum ? tasks[1].need : maxVideoNum;
        console.log(`还需要看 ${need} 个视频`);
        // 获取重要视频
        const data = await getTodayVideos();
        if (data && data.length) {
            // 数量补足需要数量
            while (videos.length < need) {
                // 随便取
                const randomIndex = ~~(Math.random() * data.length);
                // 视频
                const item = data[randomIndex];
                // 是否存在视频
                if (item.dataValid &&
                    (item.type === 'shipin' || item.type === 'juji')) {
                    videos.push(item);
                }
            }
        }
        else {
            videos = [];
        }
        resolve('done');
    });
}
// 阅读文章
async function readNews() {
    await getNews();
    for (const i in news) {
        // 暂停
        await pauseStudyLock();
        // 链接
        GM_setValue('readingUrl', news[i].url);
        console.log('正在看第' + (Number(i) + 1) + '个新闻');
        // 新页面
        const newPage = GM_openInTab(news[i].url, {
            active: true,
            insert: true,
            setParent: true,
        });
        // 等待窗口关闭
        await waitingClose(newPage);
        // 等待一段时间
        await waitingTime(500);
        // 刷新菜单数据
        await refreshMenu();
        // 任务完成跳出循环
        if (settings[0] && tasks[0].status) {
            break;
        }
    }
    // 任务完成状况
    if (settings[0] && !tasks[0].status) {
        console.log('任务未完成，继续看新闻！');
        await readNews();
    }
}
// 看学习视频
async function watchVideo() {
    // 获取视频
    await getVideos();
    // 观看视频
    for (const i in videos) {
        // 暂停
        await pauseStudyLock();
        // 链接
        GM_setValue('watchingUrl', videos[i].url);
        console.log('正在观看第' + (Number(i) + 1) + '个视频');
        // 页面
        const newPage = GM_openInTab(videos[i].url, {
            active: true,
            insert: true,
            setParent: true,
        });
        // 等待窗口关闭
        await waitingClose(newPage);
        // 等待一段时间
        await waitingTime(500);
        // 刷新菜单数据
        await refreshMenu();
        // 任务完成跳出循环
        if (settings[1] && tasks[1].status) {
            break;
        }
    }
    // 任务完成状况
    if (settings[1] && !tasks[1].status) {
        console.log('任务未完成，继续看视频！');
        await watchVideo();
    }
}
// 做每日答题
async function doExamPractice() {
    // 暂停
    await pauseStudyLock();
    console.log('正在完成每日答题');
    // 新页面
    const newPage = GM_openInTab(URL_CONFIG.examPractice, {
        active: true,
        insert: true,
        setParent: true,
    });
    // 等待窗口关闭
    await waitingClose(newPage);
    // 等待一段时间
    await waitingTime(500);
    // 刷新菜单数据
    await refreshMenu();
    // 任务完成状况
    if (settings[2] && !tasks[2].status) {
        console.log('任务未完成，继续完成每日答题！');
        await doExamPractice();
    }
}
// 做每周答题
async function doExamWeekly() {
    // id
    const examWeeklyId = await findExamWeekly();
    if (examWeeklyId) {
        // 暂停
        await pauseStudyLock();
        console.log('正在做每周答题...');
        // 新页面
        const newPage = GM_openInTab(`${URL_CONFIG.examWeekly}?id=${examWeeklyId}`, { active: true, insert: true, setParent: true });
        // 等待窗口关闭
        await waitingClose(newPage);
        // 等待一段时间
        await waitingTime(500);
        // 刷新菜单数据
        await refreshMenu();
        // 任务完成状况
        if (!tasks[3].status) {
            console.log('任务未完成，继续完成每周答题！');
            return await doExamWeekly();
        }
        return true;
    }
    return false;
}
// 做专项练习
async function doExamPaper() {
    // id
    const examPaperId = await findExamPaper();
    if (examPaperId) {
        // 暂停
        await pauseStudyLock();
        console.log('正在做专项练习...');
        // 新页面
        const newPage = GM_openInTab(`${URL_CONFIG.examPaper}?id=${examPaperId}`, {
            active: true,
            insert: true,
            setParent: true,
        });
        // 等待窗口关闭
        await waitingClose(newPage);
        // 等待一段时间
        await waitingTime(500);
        // 刷新菜单数据
        await refreshMenu();
        // 任务完成状况
        if (!tasks[4].status) {
            console.log('任务未完成，继续专项练习！');
            return await doExamPaper();
        }
        return true;
    }
    return false;
}
// 初始化每周答题总页数属性
async function InitExam(type) {
    if (type === 0) {
        // 默认从第一页获取全部页属性
        var data = await getExamWeekly(1);
        if (data) {
            return data.totalPageCount;
        }
    }
    if (type === 1) {
        var data = await getExamPaper(1); // 默认从第一页获取全部页属性
        if (data) {
            return data.totalPageCount;
        }
    }
    await waitingTime(ratelimitms);
}
// 查询每周答题列表看看还有没有没做过的，有则返回id
async function findExamWeekly() {
    console.log('初始化每周答题');
    // 获取总页数
    const total = await InitExam(0);
    // 当前页数
    let current = examPaperReverse ? total : 1;
    console.log('每周答题,开启逆序模式,从最早的题目开始答题');
    console.log('正在寻找未完成的每周答题...');
    while (current <= total && current) {
        // 请求数据
        const data = await getExamWeekly(current);
        if (data) {
            // 逆序
            if (examWeeklyReverse) {
                // 若开启逆序答题, 则反转列表
                data.list.reverse();
            }
            for (const i in data.list) {
                // 获取每周的测试列表
                const examWeeks = data.list[i].practices;
                // 若开启逆序, 则反转每周的测试列表
                if (examWeeklyReverse) {
                    examWeeks.reverse();
                }
                for (const j in examWeeks) {
                    // 遍历查询有没有没做过的
                    if (examWeeks[j].status !== 2) {
                        // status： 1为"开始答题" , 2为"重新答题"
                        return examWeeks[j].id;
                    }
                }
            }
            // 增加页码
            current += examWeeklyReverse ? -1 : 1;
            // 等待
            await waitingTime(ratelimitms);
        }
        else {
            break;
        }
    }
}
// 查询专项练习列表看看还有没有没做过的，有则返回id
async function findExamPaper() {
    console.log('初始化专项练习');
    // 获取总页数
    const total = await InitExam(0);
    // 当前页数
    let current = examPaperReverse ? total : 1;
    console.log('专项练习,开启逆序模式,从最早的题目开始答题');
    console.log('正在寻找未完成的专项练习...');
    while (current <= total && current) {
        // 请求数据
        const data = await getExamPaper(current);
        if (data) {
            // 获取专项练习的列表
            const examPapers = data.list;
            if (examPaperReverse) {
                // 若开启逆序答题, 则反转专项练习列表
                examPapers.reverse();
            }
            for (const i in examPapers) {
                // 遍历查询有没有没做过的
                if (examPapers[i].status !== 2) {
                    // status： 1为"开始答题" , 2为"重新答题"
                    return examPapers[i].id;
                }
            }
            // 增加页码 (若开启逆序翻页, 则减少页码)
            current += examPaperReverse ? -1 : 1;
            // 等待
            await waitingTime(ratelimitms);
        }
        else {
            break;
        }
    }
}
// 获取答题按钮
function getNextButton() {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            // 答题按钮
            const nextAll = $$('.ant-btn').filter((next) => next.innerText);
            if (nextAll.length) {
                clearInterval(timer); // 停止定时器
                if (nextAll.length === 2) {
                    resolve(nextAll[1]);
                    return;
                }
                resolve(nextAll[0]);
            }
        }, 500);
    });
}
// 暂停答题
async function pauseExam() {
    // 按钮
    const manualButton = $$('#manualButton')[0];
    if (manualButton) {
        console.log('自动答题失败，切换为手动');
        pause = true;
        manualButton.innerText = '开启自动答题';
        manualButton.classList.add('manual');
        createTip('已暂停，请答题后手动开启自动答题! ', 10);
        // 暂停
        await pauseLock();
    }
}
// 等待验证
function waitVerify() {
    return new Promise((resolve) => {
        // 滑动验证
        const mask = $$('#nc_mask')[0];
        if (mask && getComputedStyle(mask).display !== 'none') {
            // 定时器
            const timer = setInterval(() => {
                // 滑动验证
                const mask = $$('#nc_mask')[0];
                if (!mask || getComputedStyle(mask).display === 'none') {
                    console.log('学习等待结束！');
                    clearInterval(timer);
                    resolve(true);
                }
                console.log('等待滑动验证...');
            }, 100);
            return;
        }
        resolve(true);
    });
}
// 处理选项
function handleChoiceBtn(answers) {
    // 选项按钮
    const allBtns = $$('.q-answer');
    // 答案存在
    if (answers.length && allBtns.length) {
        // 作答
        return answers.every((answer) => {
            // 答案存在
            if (answer && answer.length) {
                // 包含答案最短长度选项
                let minLengthChoice;
                // 遍历
                allBtns.forEach((choice) => {
                    // 选项文本
                    const choiceText = choice.innerText.trim();
                    // 无符号选项文本
                    const unsignedChoiceText = choiceText.replaceAll(/[、，,。 ]/g, '');
                    // 无符号答案
                    const unsignedAnswer = answer.replaceAll(/[、，,。 ]/g, '');
                    // 包含答案
                    if (choiceText === answer ||
                        choiceText.includes(answer) ||
                        answer.includes(choiceText) ||
                        unsignedChoiceText.includes(unsignedAnswer)) {
                        // 最小长度选项有值
                        if (minLengthChoice) {
                            // 最短长度选项与当前选项比较长度
                            if (minLengthChoice.innerText.length > choiceText.length) {
                                minLengthChoice = choice;
                            }
                        }
                        else {
                            // 最小长度选项赋值
                            minLengthChoice = choice;
                        }
                    }
                });
                // 存在选项
                if (minLengthChoice) {
                    // 选择
                    if (!minLengthChoice.classList.contains('chosen')) {
                        minLengthChoice.click();
                    }
                    return true;
                }
            }
            return false;
        });
    }
    return false;
}
// 随机处理选项
function handleChoiceBtnRand(answers) {
    // 选项按钮
    const allBtns = $$('.q-answer');
    // 按钮存在
    if (allBtns.length) {
        const index = ~~(Math.random() * allBtns.length);
        const randBtn = allBtns[index];
        // 选择
        if (!randBtn.classList.contains('chosen')) {
            randBtn.click();
        }
    }
}
// 处理填空
const handleBlankInput = (answers) => {
    // 所有填空
    const blanks = $$('.blank');
    // 答案存在
    if (blanks.length && answers.length) {
        // 填空数量和答案数量一致
        if (answers.length === blanks.length) {
            return answers.every((answer, i) => {
                // 答案存在
                if (answer && answer.length) {
                    // 输入事件
                    const inputEvent = new Event('input', {
                        bubbles: true,
                    });
                    // 设置答案
                    blanks[i].setAttribute('value', answer);
                    // 触发输入input
                    blanks[i].dispatchEvent(inputEvent);
                    return true;
                }
                return false;
            });
        }
        // 填空数量为1和提示数量大于1
        if (blanks.length === 1 && answers.length > 1) {
            // 直接将所有答案整合填进去
            const answer = answers.join('');
            // 答案存在
            if (answer && answer.length) {
                // 输入事件
                const inputEvent = new Event('input', {
                    bubbles: true,
                });
                // 设置答案
                blanks[0].setAttribute('value', answer);
                // 触发输入input
                blanks[0].dispatchEvent(inputEvent);
                return true;
            }
        }
    }
    return false;
};
// 答题过程(整合)
async function doingExam() {
    // 下一个按钮
    let nextButton;
    // 保存答案
    let shouldSaveAnswer = false;
    while (true) {
        // 先等等再开始做题
        await waitingTime(2500);
        // 暂停
        await pauseLock();
        // 获取下一个按钮
        nextButton = await getNextButton();
        // 结束
        const finish = ['再练一次', '再来一组', '查看解析'];
        if (finish.includes(nextButton.innerText)) {
            break;
        }
        // 点击提示
        $$('.tips')[0]?.click();
        // 所有提示
        const allTips = $$('font[color=red]');
        // 答案
        const answers = allTips.map((tip) => tip.innerText.trim());
        // 获取题目的文本内容
        const question = $$('.q-body')[0].innerText;
        // 等待一段时间
        await waitingTime(500);
        // 选项按钮
        const allBtns = $$('.q-answer');
        // 所有填空
        const blanks = $$('input[type=text][class=blank]');
        // 问题类型
        const questionType = ($$('.q-header')[0].innerText.substring(0, 3));
        // 题型分类作答
        switch (questionType) {
            case '填空题': {
                // 根据提示作答
                if (answers.length) {
                    const res = handleBlankInput(answers);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                // 根据题库作答
                if (answersNetwork.length) {
                    const res = handleBlankInput(answersNetwork);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 暂停答题
                await pauseExam();
                // 提交答案
                shouldSaveAnswer = true;
                break;
            }
            case '多选题': {
                // 根据提示作答
                if (answers.length) {
                    // 选项文本
                    const choicesText = allBtns.map((btn) => btn.innerText);
                    // 选项内容
                    const choicesContent = choicesText
                        .map((choiceText) => choiceText.split(/[A-Z]./)[1].trim())
                        .join('');
                    // 空格
                    const blanks = question.match(/（）/g);
                    // 填空数量、选项数量、答案数量相同 | 选项全文等于答案全文
                    if (allBtns.length === blanks.length ||
                        question === choicesContent ||
                        allBtns.length === 2) {
                        // 全选
                        allBtns.forEach((choice) => {
                            if (!choice.classList.contains('chosen')) {
                                choice.click();
                            }
                        });
                        break;
                    }
                    // 选项数量大于等于答案
                    if (allBtns.length >= answers.length) {
                        const res = handleChoiceBtn(answers);
                        // 成功
                        if (res) {
                            break;
                        }
                    }
                }
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                // 答案存在
                if (answersNetwork.length) {
                    const res = handleChoiceBtn(answersNetwork);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 暂停答题
                await pauseExam();
                // 提交答案
                shouldSaveAnswer = true;
                break;
            }
            case '单选题': {
                // 根据提示作答
                if (answers.length) {
                    // 提示为1
                    if (answers.length === 1) {
                        const res = handleChoiceBtn(answers);
                        // 成功
                        if (res) {
                            break;
                        }
                    }
                    else {
                        // 可能的分隔符
                        const seperator = [
                            '',
                            ' ',
                            '，',
                            ';',
                            ',',
                            '、',
                            '-',
                            '|',
                            '+',
                            '/',
                        ];
                        // 可能的答案
                        const answersLike = seperator.map((s) => answers.join(s));
                        // 答案存在
                        if (answersLike.every((answer) => answer.length)) {
                            // 可能答案是否正确
                            const res = answersLike.some((answer) => {
                                // 尝试查找点击
                                return handleChoiceBtn([answer]);
                            });
                            if (res) {
                                break;
                            }
                        }
                    }
                }
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                // 存在答案
                if (answersNetwork.length) {
                    // 单答案单选项
                    if (answersNetwork.length === 1) {
                        // 尝试查找点击
                        const res = handleChoiceBtn(answersNetwork);
                        if (res) {
                            break;
                        }
                    }
                    else {
                        // 多答案单选项 选项意外拆分
                        // 可能分隔符
                        const seperator = ['', ' '];
                        // 可能答案
                        const answersLike = seperator.map((s) => answers.join(s));
                        // 答案存在
                        if (answersLike.every((answer) => answer.length)) {
                            // 可能答案是否正确
                            const res = answersLike.some((answer) => {
                                // 尝试查找点击
                                return handleChoiceBtn([answer]);
                            });
                            if (res) {
                                break;
                            }
                        }
                    }
                }
                // 暂停答题
                await pauseExam();
                // 提交答案
                shouldSaveAnswer = true;
                break;
            }
        }
        // 获取下一个按钮
        nextButton = await getNextButton();
        // 确认
        if (nextButton.innerText === '确 定') {
            // 需要提交答案
            if (shouldSaveAnswer) {
                // 获取key
                const key = getKey(question);
                // 答案
                const answers = [];
                if (questionType === '填空题') {
                    blanks.forEach((blank) => {
                        answers.push(blank.value);
                    });
                }
                if (questionType === '单选题' || questionType === '多选题') {
                    allBtns.forEach((choice) => {
                        if (choice.classList.contains('chosen')) {
                            // 带字母的选项
                            const answerTemp = choice.innerText;
                            // 从字符串中拿出答案
                            const [, answer] = answerTemp.split('. ');
                            if (answer && answer.length) {
                                answers.push(answer);
                            }
                        }
                    });
                }
                // 答案
                const answer = answers.join(';');
                // 存在答案
                if (answer.length) {
                    // 答案
                    console.log(`上传了手工答案\nkey:${key},答案:${answer}`);
                    await saveAnswer(key, answer);
                }
            }
            // 确认
            nextButton.click();
            // 等待一段时间
            await waitingTime(1000);
            // 答案解析
            const answerBox = $$('.answer')[0];
            // 答题错误
            if (answerBox) {
                // 获取key
                const key = getKey(question);
                const answerTemp = answerBox.innerText;
                // 从字符串中拿出答案
                const [, answer] = answerTemp.split('：');
                if (answer && answer.length) {
                    answer.replaceAll(' ', ';');
                    console.log(`上传了错题答案 key:${key} answer:${answer}`);
                    await saveAnswer(key, answer);
                }
                // 每周、专项暂停
                if (href.includes(URL_CONFIG.examWeekly) ||
                    href.includes(URL_CONFIG.examPaper)) {
                    // 暂停答题
                    await pauseExam();
                }
            }
            // 滑动验证
            await waitVerify();
        }
        // 获取按钮
        nextButton = await getNextButton();
        if (nextButton.innerText === '下一题' ||
            nextButton.innerText === '完 成' ||
            nextButton.innerText === '交 卷') {
            // 等待一段时间
            await waitingTime(1500);
            // 下一题
            nextButton.click();
        }
    }
    closeWin();
}
// 获取关键字
function getKey(content) {
    // 外部引用md5加密
    const key = md5(content);
    console.log(`获取 key:${key}`);
    return key;
}
// 初始化配置
function initSetting() {
    try {
        let settingTemp = JSON.parse(GM_getValue('studySetting'));
        if (settingTemp) {
            settings = settingTemp;
        }
        else {
            settings = [true, true, true, true, true, false, false];
        }
    }
    catch (e) {
        // 没有则直接初始化
        settings = [true, true, true, true, true, false, false];
    }
}
// 初始化配置
function initFontSize() {
    // 移动端
    const moblie = hasMobile();
    if (moblie) {
        // 缩放比例
        const scale = ~~(window.innerWidth / window.outerWidth) || 1;
        document.documentElement.style.setProperty('--scale', String(scale));
        window.addEventListener('resize', () => {
            // 缩放比例
            const scale = ~~(window.innerWidth / window.outerWidth) || 1;
            document.documentElement.style.setProperty('--scale', String(scale));
        });
    }
}
// 创建“手动答题”按钮
function createManualButton() {
    const title = $$('.title')[0];
    // 按钮
    const manualButton = creatElementNode('button', { innerText: '关闭自动答题' }, {
        id: 'manualButton',
        class: 'egg_btn',
        type: 'button',
        onclick: clickManualButton,
    });
    // 插入节点
    title.parentNode.insertBefore(manualButton, title.nextSibling);
}
// 点击手动学习按钮
function clickManualButton() {
    const manualButton = $$('#manualButton')[0];
    pause = !pause;
    if (pause) {
        manualButton.innerText = '开启自动答题';
        manualButton.classList.add('manual');
    }
    else {
        manualButton.innerText = '关闭自动答题';
        manualButton.classList.remove('manual');
    }
}
// 加载用户信息
async function loadUserInfo() {
    const egg_userinfo = $$('.egg_userinfo')[0];
    egg_userinfo.innerHTML = '';
    // 登录状态
    const loginStatus = creatElementNode('div', undefined, {
        class: 'egg_login_status',
    });
    if (login) {
        // 获取用户信息
        userInfo = await getUserInfo();
        if (userInfo) {
            const { avatarMediaUrl, nick } = userInfo;
            const avatarItems = [];
            if (avatarMediaUrl) {
                // 图片
                const img = creatElementNode('img', undefined, {
                    src: avatarMediaUrl,
                    class: 'egg_avatar_img',
                });
                avatarItems.push(img);
            }
            else {
                // 文字
                const subNickName = creatElementNode('div', { innerText: nick.substring(1, 3) }, { class: 'egg_sub_nickname' });
                avatarItems.push(subNickName);
            }
            // 头像
            const avatar = creatElementNode('div', undefined, { class: 'egg_avatar' }, avatarItems);
            // 昵称
            const nickName = creatElementNode('div', { innerText: nick }, { class: 'egg_name' });
            // 关于用户
            const user = creatElementNode('div', undefined, { class: 'egg_user' }, [
                avatar,
                nickName,
            ]);
            egg_userinfo.append(user);
        }
        // 退出按钮
        const logoutBtn = creatElementNode('button', { innerText: '退出' }, {
            type: 'button',
            onclick() {
                const logged = $$("a[class='logged-link']")[0];
                logged.click();
            },
        });
        loginStatus.classList.remove('active');
        loginStatus.append(logoutBtn);
    }
    else {
        // 登录按钮
        const loginBtn = creatElementNode('button', { innerText: '请先登录' }, {
            type: 'button',
            onclick() {
                loginWindow();
            },
        });
        loginStatus.classList.add('active');
        loginBtn.addEventListener('click', () => {
            loginWindow();
        });
        loginStatus.append(loginBtn);
    }
    egg_userinfo.append(loginStatus);
}
// 加载分数
async function loadScoreInfo() {
    if (login) {
        // 获取总分
        const totalScore = await getTotalScore();
        // 获取当天总分
        const todayScore = await getTodayScore();
        // 更新分数
        const totalScoreSpan = $$('.egg_scoreinfo .egg_totalscore span')[0];
        const todayScoreSpan = $$('.egg_scoreinfo .egg_todayscore span')[0];
        totalScoreSpan.innerText = totalScore;
        todayScoreSpan.innerText = todayScore;
    }
}
// 加载任务列表
async function loadTaskList() {
    // 原始任务进度
    const taskProgress = await getTaskList();
    if (taskProgress) {
        // 文章
        const { currentScore: artCur, dayMaxScore: artMax } = taskProgress[0];
        tasks[0] = {
            currentScore: artCur,
            dayMaxScore: artMax,
            status: false,
            need: artMax - artCur,
        };
        // 视频
        const { currentScore: videoCur1, dayMaxScore: videoMax1 } = taskProgress[1];
        const { currentScore: videoCur2, dayMaxScore: videoMax2 } = taskProgress[3];
        tasks[1] = {
            currentScore: videoCur1 + videoCur2,
            dayMaxScore: videoMax1 + videoMax2,
            status: false,
            need: videoMax1 + videoMax2 - (videoCur1 + videoCur2),
        };
        // 每日答题
        const { currentScore: dayCur, dayMaxScore: dayMax } = taskProgress[6];
        tasks[2] = {
            currentScore: dayCur,
            dayMaxScore: dayMax,
            status: false,
            need: dayMax - dayCur,
        };
        // 每周答题
        const { currentScore: weekCur, dayMaxScore: weekMax } = taskProgress[2];
        tasks[3] = {
            currentScore: weekCur,
            dayMaxScore: weekMax,
            status: false,
            need: weekMax - weekCur,
        };
        // 专项练习
        const { currentScore: exerCur, dayMaxScore: exerMax } = taskProgress[5];
        tasks[4] = {
            currentScore: exerCur,
            dayMaxScore: exerMax,
            status: false,
            need: exerMax - exerCur,
        };
        // 更新数据
        for (const i in tasks) {
            const { currentScore, dayMaxScore } = tasks[i];
            // 进度
            let rate = (100 * currentScore) / dayMaxScore;
            // 修复专项练习成组做完,进度条显示异常
            if (dayMaxScore <= currentScore) {
                rate = 100;
            }
            if (rate === 100) {
                tasks[i].status = true;
            }
            if (rate > 0) {
                // 设置进度条
                setProgress(Number(i), Number(rate.toFixed(2)));
            }
        }
    }
}
// 刷新菜单数据
async function refreshMenu() {
    // 加载分数信息
    await loadScoreInfo();
    // 加载任务列表
    await loadTaskList();
}
// 渲染菜单
async function renderMenu() {
    // 设置项
    const settingItems = [];
    // 用户信息
    const userinfo = creatElementNode('div', undefined, {
        class: 'egg_userinfo',
    });
    // 总分
    const totalScoreSpan = creatElementNode('span', { innerText: 0 });
    const totalScoreDiv = creatElementNode('div', { innerHTML: '总积分' }, { class: 'egg_totalscore' }, totalScoreSpan);
    // 当天总分
    const todayScoreSpan = creatElementNode('span', { innerText: 0 });
    const todayScoreDiv = creatElementNode('div', { innerHTML: '当天积分' }, { class: 'egg_todayscore' }, todayScoreSpan);
    // 分数信息
    const scoreinfo = creatElementNode('div', undefined, { class: 'egg_scoreinfo' }, [totalScoreDiv, todayScoreDiv]);
    // 信息
    const info = creatElementNode('div', undefined, { class: 'egg_setting_item egg_info' }, [userinfo, scoreinfo]);
    settingItems.push(info);
    // 任务标签
    const settingTaskLabels = [
        '文章选读',
        '视听学习',
        '每日答题',
        '每周答题',
        '专项练习',
    ];
    // 分割线
    settingItems.push(creatElementNode('hr'));
    for (const i in settingTaskLabels) {
        // 进度条
        const bar = creatElementNode('div', undefined, { class: 'egg_bar' });
        // 轨道
        const track = creatElementNode('div', undefined, { class: 'egg_track' }, bar);
        // 百分比符号
        const percentSymbol = creatElementNode('span', { innerText: '%' }, { class: 'egg_percentsymbol' });
        // 数值
        const percent = creatElementNode('div', { innerText: '0' }, { class: 'egg_percent' }, percentSymbol);
        // 进度
        const progress = creatElementNode('div', undefined, { class: 'egg_progress' }, [track, percent]);
        // 标签
        const label = creatElementNode('label', {
            innerText: settingTaskLabels[i],
        }, undefined, progress);
        // 处理设置选项变化
        const handleCheckChange = debounce(async (checked) => {
            if (settings[i] !== checked) {
                // 创建提示
                const { destroy } = await createTip(`${settingTaskLabels[i]}已${checked ? '打开' : '关闭'}`, 2);
                // 销毁
                destroy();
                settings[i] = checked;
                // 运行时是否要隐藏
                GM_setValue('studySetting', JSON.stringify(settings));
            }
        }, 500);
        // 选项
        const input = creatElementNode('input', undefined, {
            title: settingTaskLabels[i],
            class: 'egg_setting_switch',
            type: 'checkbox',
            checked: settings[i] ? 'checked' : '',
            onchange(e) {
                const { checked } = e.target;
                handleCheckChange(checked);
            },
        });
        // 设置项
        const item = creatElementNode('div', undefined, { class: 'egg_setting_item' }, [label, input]);
        settingItems.push(item);
    }
    // 分割线
    settingItems.push(creatElementNode('hr'));
    // 设置标签
    const settingLabel = ['运行隐藏', '自动开始'];
    for (const i in settingLabel) {
        // 标签
        const label = creatElementNode('label', {
            innerText: settingLabel[i],
        });
        // 当前序号
        const currentIndex = Number(i) + settingTaskLabels.length;
        // 处理设置选项变化
        const handleCheckChange = debounce(async (checked) => {
            if (settings[currentIndex] !== checked) {
                settings[currentIndex] = checked;
                // 设置
                GM_setValue('studySetting', JSON.stringify(settings));
                // 创建提示
                const { destroy } = await createTip(`${settingLabel[i]}已${checked ? '打开' : '关闭'}！`, 2);
                // 销毁
                destroy();
            }
        }, 300);
        // 选项
        const input = creatElementNode('input', undefined, {
            title: settingLabel[i],
            class: 'egg_setting_switch',
            type: 'checkbox',
            checked: settings[currentIndex] ? 'checked' : '',
            onchange: (e) => {
                const { checked } = e.target;
                handleCheckChange(checked);
            },
        });
        // 设置项
        const item = creatElementNode('div', undefined, { class: 'egg_setting_item' }, [label, input]);
        settingItems.push(item);
    }
    // 窗口项
    const login_frame = creatElementNode('div', undefined, {
        class: 'egg_frame_login',
    });
    // 窗口项
    const frame = creatElementNode('div', undefined, { class: 'egg_frame' }, [
        login_frame,
    ]);
    settingItems.push(frame);
    // 设置
    const settingBox = creatElementNode('div', undefined, { class: 'egg_setting_box' }, settingItems);
    // 菜单
    const menu = creatElementNode('div', undefined, {
        id: 'settingData',
        class: `egg_menu${hasMobile() ? ' mobile' : ''}`,
    }, settingBox);
    // 根容器
    const base = creatElementNode('div', undefined, undefined, menu);
    // 插入节点
    document.body.append(base);
    // 加载用户信息
    await loadUserInfo();
    console.log('加载用户信息');
    // 加载分数信息
    await loadScoreInfo();
    console.log('加载分数信息');
    // 加载任务列表
    await loadTaskList();
    console.log('加载任务列表');
    // 渲染开始按钮
    if (login) {
        // 开始学习按钮
        const startButton = creatElementNode('button', { innerText: '开始学习' }, {
            id: 'startButton',
            class: 'egg_study_btn',
            type: 'button',
            onclick: start,
        });
        // 设置项
        const item = creatElementNode('div', undefined, { class: 'egg_setting_item egg_start_btn' }, startButton);
        settingBox.append(item);
        // 完成任务
        if (tasks.every((task) => task.status)) {
            finishTask();
        }
    }
    // 自动答题
    if (login && settings[6]) {
        await createTip('即将开始自动答题', 5);
        // 再次查看是否开启
        if (settings[6] && !started) {
            createTip('开始自动答题', 2);
            start();
        }
        else {
            createTip('已取消自动答题！', 2);
        }
    }
}
// 是否显示目录
function showMenu(isShow = true) {
    // 菜单
    const menu = $$('.egg_menu')[0];
    menu.style.display = isShow ? 'block' : 'none';
}
// 登录状态
function loginStatus() {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            // 获取token
            if (getCookie('token')) {
                clearInterval(timer);
                resolve(true);
            }
        }, 100);
    });
}
// 登录窗口
async function loginWindow() {
    // egg_frame_login
    const frame_login = $$('.egg_frame_login')[0];
    // 配置
    const frame = $$('.egg_frame')[0];
    if (frame_login) {
        let iframe = frame_login.querySelector('iframe');
        if (!iframe) {
            iframe = creatElementNode('iframe');
            frame_login.append(iframe);
        }
        frame.classList.add('active');
        // 登录页面
        iframe.src = URL_CONFIG.login;
        // 刷新
        const timer = window.setInterval(() => {
            console.log('登录刷新');
            // 登录刷新
            iframe.src = URL_CONFIG.login;
        }, 100000);
        // 登录状态
        const res = await loginStatus();
        if (res) {
            // 登录成功
            window.clearInterval(timer);
            console.log('登录成功！');
            window.location.reload();
            return;
        }
        return;
    }
}
// 学习
async function study() {
    console.log('开始学习');
    // 暂停
    await pauseStudyLock();
    // 任务
    if (tasks.length) {
        // 检查新闻
        if (settings[0] && !tasks[0].status) {
            console.log('任务一：看新闻');
            // 暂停
            await pauseStudyLock();
            // 看新闻
            await readNews();
        }
        if (settings[1] && !tasks[1].status) {
            console.log('任务二：看视频');
            // 暂停
            await pauseStudyLock();
            // 看视频
            await watchVideo();
        }
        // 检查每日答题
        if (settings[2] && !tasks[2].status) {
            console.log('任务三：做每日答题');
            // 暂停
            await pauseStudyLock();
            // 做每日答题
            await doExamPractice();
        }
        // 检查每周答题
        if (settings[3] && !tasks[3].status) {
            console.log('任务四：做每周答题');
            // 暂停
            await pauseStudyLock();
            // 做每周答题
            const res = await doExamWeekly();
            // 无题可做
            if (!res) {
                // 如果是全都完成了，已经没有能做的了
                tasks[3].status = true;
                // 进度条对象
                const taskProgressList = $$('.egg_progress');
                // 进度条
                const bar = taskProgressList[3].querySelector('.egg_bar');
                // 百分比
                const percent = taskProgressList[3].querySelector('.egg_percent');
                // 长度
                bar.style.width = `100%`;
                // 文字
                percent.innerText = `100%`;
            }
        }
    }
    // 检查专项练习
    if (settings[4] && !tasks[4].status) {
        console.log('任务五：做专项练习');
        // 暂停
        await pauseStudyLock();
        // 做专项练习
        const res = await doExamPaper();
        // 无题可做
        if (!res) {
            // 如果是全都完成了，已经没有能做的了
            tasks[4].status = true;
            // 进度条对象
            const taskProgressList = $$('.egg_progress');
            // 进度条
            const bar = taskProgressList[4].querySelector('.egg_bar');
            // 百分比
            const percent = taskProgressList[4].querySelector('.egg_percent');
            // 长度
            bar.style.width = `100%`;
            // 文字
            percent.innerText = `100%`;
        }
    }
}
// 设置进度条
function setProgress(index, progress) {
    // 进度条对象
    const taskProgressList = $$('.egg_progress');
    // 进度条
    const bar = taskProgressList[index].querySelector('.egg_bar');
    // 百分比
    const percent = taskProgressList[index].querySelector('.egg_percent');
    // 长度
    bar.style.width = `${progress}%`;
    // 文字
    percent.innerText = `${progress}%`;
}
// 暂停任务
function pauseTask() {
    // 开始按钮
    const startButton = $$('#startButton')[0];
    pauseStudy = true;
    startButton.innerText = '继续学习';
    startButton.classList.remove('loading');
    startButton.removeEventListener('click', pauseTask);
    startButton.addEventListener('click', continueTask);
}
// 继续任务
function continueTask() {
    // 开始按钮
    const startButton = $$('#startButton')[0];
    pauseStudy = false;
    startButton.innerText = '正在学习，点击暂停';
    startButton.classList.add('loading');
    startButton.removeEventListener('click', continueTask);
    startButton.addEventListener('click', pauseTask);
}
// 完成任务
function finishTask() {
    // 开始按钮
    const startButton = $$('#startButton')[0];
    startButton.innerText = '已完成';
    startButton.classList.remove('loading');
    startButton.classList.add('disabled');
    startButton.setAttribute('disabled', '');
}
// 开始
async function start() {
    // 保存配置
    console.log('初始化...');
    console.log('检查是否登录...');
    if (login) {
        started = true;
        // 开始按钮
        const startButton = $$('#startButton')[0];
        startButton.innerText = '正在学习，点击暂停';
        startButton.classList.add('loading');
        startButton.removeEventListener('click', start);
        // 点击暂停
        startButton.addEventListener('click', pauseTask);
        // 隐藏菜单
        if (settings[5]) {
            showMenu(false);
        }
        // 查询今天还有什么任务没做完
        console.log('检查今天还有什么任务没做完');
        // 任务
        if (tasks.length) {
            // 学习
            await study();
            // 未完成
            if (!tasks.every((task) => task.status)) {
                await study();
            }
            // 刷新菜单数据
            await refreshMenu();
            finishTask();
            console.log('已完成');
        }
        if (settings[5]) {
            showMenu();
        }
    }
    else {
        // 提醒登录
        alert('请先登录');
        console.log('登录中...');
        // 登录窗口
        await loginWindow();
    }
}

