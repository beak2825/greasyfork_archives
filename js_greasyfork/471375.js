// ==UserScript==
// @name         EWT ewt e网通 刷课+自动完成选择题的工具箱
// @namespace    EWTKILL
// @version     3R-Final
// @description     ewt 点击查看插件详情
// @connect      *
// @license      GPL2
// @match        https://*.ewt360.com/*
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM.info
// @homepageURL  https://greasyfork.org/zh-CN/scripts/471185-ewt-killer-box
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/core.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/hmac.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/sha1.js
// @downloadURL https://update.greasyfork.org/scripts/471375/EWT%20ewt%20e%E7%BD%91%E9%80%9A%20%E5%88%B7%E8%AF%BE%2B%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E9%80%89%E6%8B%A9%E9%A2%98%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/471375/EWT%20ewt%20e%E7%BD%91%E9%80%9A%20%E5%88%B7%E8%AF%BE%2B%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E9%80%89%E6%8B%A9%E9%A2%98%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

/**
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *            佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 */

let headers = {
    CommonHeader: {
        "Origin": "https://web.ewt360.com",
        "Referer": "https://web.ewt360.com/mystudy/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0"
    },
    CourseHeader: {
        "Origin": "https://teacher.ewt360.com",
        "Referer": "https://teacher.ewt360.com/",
        "Referurl" : "https://teacher.ewt360.com/ewtbend/bend/index/index.html#/homework/play-videos",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0",
        "Priority" : "u=1, i"
    }
}

let coursetagsreflection = {
    "课程讲": {
        "lessonid": "lessonId",
        "courseid": "courseId",
        "videoType": 1
    },
    "校本视频": {
        "lessonid": "id",
        "courseid": "id",
        "videoType": 6
    }
}

let style = `
#close-btn {
    font-size: 12px;
    height: 16px;
    width: 16px;
    border-radius: calc(50%);
    background-color: red;
    margin-right: 0;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
}

#close-btn:hover > .close-btn-label {
    display: flex;
    align-items: center;
    justify-content: center;
}

#close-btn > .close-btn-label {
    display: none;
}

.kewt-tscol-right {
    margin-left: auto;
    margin-right:5px;
    text-align: right;
}

#window-main {
    border-radius: 10px;
    width: 600px;
    max-height: 768px;
    opacity: 0;
    margin-bottom: 100px;
    background-color: white;
    position: relative;
}

#window-bg {
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgb(128,128,128,0.6);
    z-index:99999;
    display:flex;
    align-items: center;
    justify-content: center;
}

.kewt-course-text,.kewt-homework-text {
    font-size: 25px;
    font-weight: bolder;
}

.kewt-window-nav {
    position: relative;
    width:100%;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.kewt-tscol {
    line-height: 14px;
}

.kewt-subject {
    font-size: 12px;
    color:gray;
    transform: scale(0.9);
    transform-origin: 0 100%;
}

.kewt-subject-right {
    transform-origin: 100% 50%;
}

.kewt-title {
    font-weight: bolder;
}

.kewt-window-body {
    width:100%;
    padding:10px;
    overflof: auto;
}

.kewt-subject {
    font-size:12px;
}

.kewt-course-detail,.kewt-homework-detail {
    line-height: 15px;
    margin-top: 1px;
}

.kewt-course-col,.kewt-homework-col {
    color: #666;
    transform: scale(0.85);
    transform-origin: 0 50%;
}

.kewt-course-funcbtns {
    margin-top: 5px;
    display: flex;
    align-items: cent6er;
}

.kewt-common-btn {
    font-size: 12px;
    padding: 5px 15px;
    background-color: #ca0404;
    color: white;
    border-radius: 5px;
    transition: background-color 200ms;
    margin-right: 20px;
    box-shadow: 0 0 5px gray;
    display: inline-block;
}

.kewt-course-top,.kewt-homework-top {
    margin-top: 7px;
}

.kewt-log-box {
    width: 100%;
    padding: 7px;
    border-radius: 5px;
    line-height: 15px;
    font-size: 12px;
    box-shadow: 0 0 5px black;
    overflow-y: auto;
    margin-top: 5px;
}

#kewt-logbox-0 {
    margin-top: 10px;
}

.btn-red {
    background-color: #ca0404;
    color:white;
}

.btn-red>svg {
    fill: white;
}

.btn-red:hover {
    background-color: #a20101;
    box-shadow: 0 0 3px gray;
}

.btn-green {
    color: white;
    background-color: green;
}

.btn-blue {
    color: white;
    background-color: #41d0ff;
}

.btn-green:hover {
    background-color: #025c02;
}

.btn-yellow {
    background-color: orange;
}

.btn-yellow:hover {
    background-color: #b97800;
}

.btn-blue:hover {
    background-color: #00aee7;
}
.btn-unclick:hover {
    background-color: gray;
}

.btn-unclick:click {
    background-color: gray;
}

.kewt-course-container {
    margin-top:5px;
    height:200px;
    display:flex;
    position: relative;
    width:100%;
}

.kewt-course-c-left {
    width:25%;
    border-radius: 5px;
    background-color: rgba(0,0,0,0);
    box-shadow: 0 0 5px 1px gray;
    box-sizing: border-box;
    padding:10px 0;
    margin-right: 10px;
    overflow-y: auto;
}

.kewt-course-c-right {
    flex: 1;
    box-shadow: 0 0 5px 1px gray;
    border-radius: 5px;
    overflow-y:auto;
    box-sizing: border-box;
    padding:5px;
}

.kewt-course-l-date {
    padding:5px;
    width:100%;
    font-weight:bolder;
}

.kewt-course-l-date-sel {
    background-color: #0aa5ff;
    color:white;
}

.kewt-course-c-right-ele {
    position: relative;
    display: flex;
    padding: 5px;
    margin-bottom: 3px;
    width:100%;
    background-color: #87838365;
    border-radius: 5px;
    transition: background-color 200ms;
    box-sizing:border-box;
}

.kewt-course-c-right-ele:hover {
    background-color: #6b5a5a65;
}

.kewt-cci-i {
    width:70px;
    height:45px;
}

.kewt-cci-title {
    font-size: 13px;
    font-weight:bolder;
}

.kewt-course-c-info {
    margin-left: 5px;
    display:flex;
    flex-direction: column;
    flex: 1;
}

.kewt-course-c-major {
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
}

.kewt-mission-fn-btn {
    color:white;
    padding: 5px 10px;
    display: inline-block;
    border-radius: 5px;
    font-size: 12px;
    margin-top: auto;
    margin-bottom: 0;
    margin-left: auto;
    margin-right:0;
    transform: scale(0.7);
    transform-origin: 100% 100%;
    margin: 0 3px;
}

.kewt-course-wfunc {
    margin-top: 5px;
    display: flex;
}

.kewt-cci-id {
    margin-top: 2px;
    font-size:12px;
    transform: scale(0.9);
    transform-origin: 0% 50%;
    color: gray;
}

.kewt-course-c-img {
    display:flex;
    align-items: center;
    justify-content: center;
}

.kewt-homework-container {
    margin-top: 5px;
    max-height: 350px;
    border-radius: 5px;
    box-shadow:0 0 5px 1px gray;
    padding: 5px;
    box-sizing: border-box;
    overflow-y: auto;
}

.kewt-ques-container,.ques-answer-container {
    padding: 5px;
    box-shadow: border-box;
    box-shadow:0 0 3px 1px gray;
}

.ques-answer-container {
    margin-top: 10px;
}

.kewt-ques-container {
    margin-bottom: 10px;
}

.ques-status-bar {
    display: flex;
    width: 100%;
    align-items: center;
}

.ques-c-info {
    margin-left: 7px;
}

.orange-container,.red-container,.blue-container {
    height:15px;
    border-radius: 8px;
    font-size: 12px;
    color: white;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.orange-container {
    background-color: orange;
}

.red-container {
    background-color: #d52727;
}

.blue-container {
    background-color: #00ff9db0;
    color: black;
}

.ques-options-choice-dot,.ques-options-choice-dot-heart{
    height: 25px;
    width: 25px;
    border-radius: 50%;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid purple;
}

.ques-options-choice-dot-heart {
    background-color: purple;
    font-weight: bolder;
    color: white;
}

.ques-option-content {
    margin-left: 4px;
    flex:1;
}

.ques-options-option {
    padding: 3px;
    margin: 2px 0;
    border: 1px solid black;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.ques-opt-container {
    font-size: 20px;
    font-weight: bolder;
    margin-top: 5px;
    margin-bottom: 5px;
}

.ques-opt-container-title-up {
    margin-top: 0;
    margin-bottom: 0;
}
.ques-parse-container {
    font-size: 12px;
    line-height: 15px;
}

.loading {
    display: flex;
    padding: 10px 10px;
    box-shadow: 0 0 2px gray;
    background-color: white;
    font-size: 20px;
    font-weight: bolder;
    border-radius: 5px;
    opacity: 0;
    marginBottom: 100px;
    width: 600px;
    flex-direction:column;
    align-items: center;
    box-sizing: border-box;
}

.load-tips {
    font-size: 12px;
    color: gray;
    text-align:center;
}

.load-error-comp {
    width: 100%;
    margin-top: 5px;
    border-radius: 5px;
    border: 3px solid red;
    padding: 5px 8px;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: normal;
    line-height: 17px;
}

.btn-unclick {
    background-color: gray;
}

.circle-dot {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 2px solid #c10b0b;
    background-color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bolder;
    color: white;
}

.err-title {
    font-size: 15px;
    font-weight: bolder;
}

.load-error-msg-title {
    display: flex;
    align-items: center;
}

.progress-bar-in {
    background-color: #00fff8;
    border-radius: inherit;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-idnex: 1;
}

.progress-bar-out {
    position: relative;
    margin-top: 5px;
    background-color: rgb(128,128,128,0.7);
    border-radius: 5px;
    height: 10px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.progress-text {
    color: black;
    font-weight: bolder;
    font-size: 12px;
    z-index: 2;
    position: relative;
}

.view-options {
    text-decoration: none;
    list-style: none;
    display: flex;
}

.view-option {
    margin: 0 4px;
    padding: 2px 17px;
    list-style: none;
    font-size: 12px;
    border-radius: 5px 5px 0 0px;
    box-shadow: 0 0 3px gray;
    border: 1px solid gray;

    border-bottom: none;
}

.multi-view {
    border-radius: 5px;
    border: 1px solid gray;
    width: 100%;
    display:flex;
    align-items: center;
    padding: 5px;
    box-sizing:border-box;
    justify-content: center;
}

.view-option-clicked {
    background-color: gray;
    color: white;
}

.first-view-pa {
    text-indent: 2em;
}

.first-view {
    margin-top: 5px;
    font-size: 12px;
    line-height: 14px;
}

.fv-text {
    border: none;
    outline-style: none;
    width: 400px;
    height: 15px;
    border-bottom: 1px solid black;
    font-size: 12px;
}

.text-container {
    display: flex;
    align-items: flex-end;
}

.fvc-btn {
    margin-left: 3px;
    padding:3px 10px;
    background-color: orange;
    color: white;
    border-radius: 5px;
    font-size: 12px;
    transition: background-color 200ms;
}

.fvc-btn:hover {
    background-color: #bd9a5c
}

.iframe-class {
    display: none;
}

.menu {
    pointer-events: auto;
    position: fixed;
    top: 45px;
    display: flex;
    align-items: center;
    padding:5px;
    background-color: rgb(194 194 194 / 20%);
    box-shadow: 0 0 5px gray;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    color: black;
    border-radius: 0 10px 10px 0;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter:blur(4px);
}

.w-mask {
    left: 0;
    top: 0;
    position: fixed;
    width: 100%;
    height:  100%;
    z-index: 99;
    pointer-events: none;
}

.w-title {
    font-weight: bolder;
    font-size: 12px;
    line-height: 12px;
}

.w-btn-container {
    margin-left: auto;
    margin-right: 3px;
    display: flex;
    align-items: center;
}

.menu-window-btn {
    font-size: 12px;
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    margin-left: 3px;
    margin-right: 3px;
    box-shadow: 0 0 5px gray;
}

.menu-window-btn-img {
    height: 17px;
    width: 17px;
}

.window-nopage {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bolder;
    color: gray;
}

.menu-left {
    margin-left: 5px;
    margin-right: 10px;
}

.menu-window-btn:hover + .menu-btn-text {
    display: flex;
}

.menu-btn-text {
    display: none;
    padding: 8px;
    box-shadow: 0 0 7px gray;
    margin-top: 1px;
    border-radius: 5px;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    transform: scale(0.8);
    top: 100%;
    word-wrap: none;
    white-space:nowrap;
    align-items: center;
    justify-content: center;
    background-color: wheat;
}

.menu-btn-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
`;

let configure = undefined;

class SettingManager {
    keys = {
        "setting.waitms" : 1500
    } //key : <default value>

    values = {}
    constructor() {
        this.load();
    }

    save() {
        for(let i in this.keys) {
            PluginUtil.setValue(i,this.values.i)
        }
    }

    load() {
        for(let i in this.keys) {
            this.values[i] = PluginUtil.getValue(i) || this.keys[i] //没有值则存默认值
        }
    }

    reset(key) {
        this.values[key] = this.keys[key]
    }

    getOneValue(key) {
        return this.values[key];
    }
}

class PluginUtil {
    static addStyle(str) {
        if(typeof GM_addStyle != "undefined") GM_addStyle(str);
        else if(typeof GM.addStyle != "undefined") GM.addStyle(str);
    }

    static async getValue(k) {
        if(typeof GM_getValue != "undefined") return await GM_getValue(k)
        else if(typeof GM.getValue != "undefined") return await GM.getValue(k);
    }

    static async setValue(k,v) {
        if(typeof GM_setValue != "undefined") await GM_setValue(k,v)
        else if(typeof GM.setValue != "undefined") await GM.setValue(k,v);
    }

    static registerMenuCommand(text,fn,key) {
        if(typeof GM_registerMenuCommand != "undefined") GM_registerMenuCommand(text,fn,key)
        else if(typeof GM.registerMenuCommand != "undefined") GM.registerMenuCommand(text,fn,key);
    }

    static info() {
        if(typeof GM_info != "undefined") return GM_info;
        else if(typeof GM.info != "undefined") return GM.info;
    }
}


class progressBar {
    constructor(value,totalWidth) {
        this.inside = $("<div class='progress-bar-in'></div>")
        this.outside = $("<div class='progress-bar-out'></div>")
        this.text = $("<div class='progress-text'></div>")
        this.outside.append(this.inside);
        this.outside.append(this.text)
        this.outside.css("width",totalWidth)
        this.setValue(value)
    }

    setValue(value) {
        this.value = Math.round(value * 100) / 100;
        let text = isNaN(this.value) ? "Error" : this.value+ "%"
        this.text.text(text);
        this.inside.css("width",this.value+"%")
    }

    getProgressBar() {
        return this.outside;
    }
}

class LockComponent {
    constructor() {
        this.lock = false
    }

    Lock() {
        this.lock = true;
    }

    Unlock() {
        this.lock = false;
    }
}

class ViewBox extends LockComponent {
    constructor(viewDict,height) {
        super();
        this.viewDict = viewDict
        this.root = $("<div class='multi-view-box'></div>")
        this.viewmenu = $("<div class='view-options'></div>")
        this.view = $("<div class='multi-view'></div>")
        this.view.css("height",height+"px")
        this.selectedElement = undefined;
        for(let c in viewDict) {
            let viewSonOpt = $("<div class='view-option'>"+c+"</div>")
            viewSonOpt.click(async ()=>{
                if(this.lock) return;
                this.view.empty();
                if(await this.viewDict[c].click())
                    this.changeView(viewSonOpt,c)
            })
            this.viewmenu.append(viewSonOpt)
        }
        this.root.append(this.viewmenu)
        this.root.append(this.view)
        this.lock = false;
    }

    changeView(viewSonOpt,c) {
        if(this.selectedElement != null)
            this.selectedElement.removeClass("view-option-clicked")
        viewSonOpt.addClass("view-option-clicked")
        this.selectedElement = viewSonOpt;
        this.view.append(this.viewDict[c].container)
    }

    getView() {
        return this.root
    }

    Click(i) {
        let element = this.viewmenu.children("*");
        element[i].click();
    }
}

let userInfo = {
    userid: undefined,
    schoolId: undefined,
    token: undefined,
    realname: undefined
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

class LogSystem {
    constructor() {
        this.dic = {
            0: "[Message]",
            1: "[Warning]",
            2: "[Error]",
            3: "[Fatal]"
        }

        let console = document.createElement("iframe");
        console.className = "iframe-class"
        document.body.appendChild(console)
        this.console = console.contentWindow.console;
    }

    info(level,text) {
        if(level >= 2) this.console.error(this.dic[level] + " "+text);
        else this.console.log(this.dic[level] + " "+text);
        return this.dic[level] + " "+text;
    }

    async upload(level,text) {
        let url = "http://ap-guangzhou.cls.tencentcs.com/track?topic_id=366f597e-ce5a-4b8d-90bd-ee084e1dff17"
        url += "&userid="+userInfo.userid+"&level=5"+"&clientVersion="+version+"&msg="+String(this.info(level,text))
        try {
            await NetworkUtil.request("GET",url)
            this.info(0,"日志上传成功.")
        } catch(e) {
            this.info(1,"日志上传失败,原因是"+e)
        }
    }

    uploadWithUserId(level,text) {
        this.upload(level,"id为"+userInfo.userid+"的用户"+text)
    }

    put(level,id,text) {
        let gtext = this.dic[level] + " "+text;
        let component = $("#"+id);
        if(component!=undefined && component.length != 0) {
            component.append($("<div>"+new Date().toLocaleTimeString()+" "+gtext+"</div>"));
            component[0].scrollTop = component[0].scrollHeight;
        }
    }

    generateBox(height,uniqueId) {
        return this.element = $("<div class='kewt-log-box' id='"+uniqueId+"' style='height: "+height+"px'></div>");
    }

    remove(uniqueId) {
        $("#"+uniqueId).remove();
    }
}

let log;
let {version,description,author} = PluginUtil.info().script;
let sdkVersion = "3.0.19"

class headerAndCookieUtils {
    static getUserToken() {
        let cookie = document.cookie.split(";");
        let result = {};
        for(let i = 0;i < cookie.length;i++) {
            let k = cookie[i].split("=")[0].substring(1);
            let v = cookie[i].split("=")[1];
            result[k] = v;
        }
        return result["token"];
    }
}

class FinishCourseSignatureUtil {
    HMAC_SECRET_URL = "http://bfe.ewt360.com/monitor/hmacSecret?userId={%s}"
    constructor(end,duration,action) {
        this.end = end
        this.duration = duration
        this.action = action
        this.param = "action={action}&duration={duration}&mstid={mstid}&signatureMethod=HMAC-SHA1&signatureVersion=1.0&timestamp={timestamp}&version=2022-08-02";
        this.sessionId = this.secret = undefined;
    }

    async getSecret() {
        let tk = await this.getHMACSecret();
        let sessionid = tk["sessionId"];
        this.secret = tk["secret"];
        headers.CourseHeader["x-bfe-session-id"] = sessionid;
        headers.CourseHeader["token"] = headerAndCookieUtils.getUserToken();
    }

    async getRealSignature() {
        await this.getSecret();
        let rp = this.param.replace("{duration}", this.duration)
            .replace("{mstid}", headerAndCookieUtils.getUserToken())
            .replace("{timestamp}", this.end)
            .replace("{action}", this.action);
        return CryptoJS.HmacSHA1(rp, this.secret).toString();
    }

    async getHMACSecret() {
        let res = await NetworkUtil.requestJson("GET",this.HMAC_SECRET_URL.replace("{%s}",userInfo.userid),headers.CommonHeader);
        return NetworkUtil.validateReturn(res["responseText"]);
    }
}


class ResultFastUtil {
    static ErrorResult(code,message) {
        log.uploadWithUserId(2,"遇到了错误,原因为:"+message)
        return {
            code: code,
            message: message
        }
    }

    static NormalResult(code,message,data) {
        return {
            code: code,
            message: message,
            data: data
        }
    }

    static ProgressResult(code,progress,subprogress,message) {
        return {
            code: code,
            progress: progress,
            subprogress: subprogress,
            message: message
        }
    }
}

class NetworkUtil {
    static validateReturn(Value) {
        let json = JSON.parse(Value);
        if(json["success"] != true)
            log.upload(2,"用户"+userInfo.userid+"访问接口失败,原因在于:"+json.msg+",代码为:"+json.code);
        return json["data"];
    }

    static request(method,url,headers,data) {
        return new Promise(resolve => {GM_xmlhttpRequest({
            method: method,
            url: url,
            data: data,
            headers: headers,
            beforeSend: function (xhr) {
                xhr.withCredentials = true
            },
            onload: (res) => {
                resolve(res)
            }})
        });
    }

    static requestJson(method,url,headers,data) {
        headers["Content-Type"]="application/json";
        return new Promise(resolve => {GM_xmlhttpRequest({
            method: method,
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: headers,
            beforeSend: function (xhr) {
                xhr.withCredentials = true
            },
            onload: (res) => {
                resolve(res)
            }})
        });
    }

    static getUrlInfo(url) {
        let urlInfos = url.split("?")[url.split("?").length-1];
        let urlArgs = urlInfos.split("&");
        let result = {};
        for(let i = 0;i < urlArgs.length;i++) {
            let k = urlArgs[i].split("=")[0];
            let v = urlArgs[i].split("=")[1];
            result[k] = v;
        }
        return result;
    }

    static async getStdTime() {
        let res = await NetworkUtil.request("GET","https://f.m.suning.com/api/ct.do",headers.CommonHeader,null)
        let time = JSON.parse(res.responseText).currentTime
        return time
    }

    static randomIP() {
        let str = "";
        for(let i=0;i<4;i++) {
            str += Math.floor(Math.random() * 256);
            if(i!=3) str += "."
        }
        return str;
    }
}

class OtherUtil {

    static randomString() {
        let randomStringChars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 8, t = randomStringChars.length, r = "", n = 0; n < e; n++)
            r += randomStringChars.charAt(Math.floor(Math.random() * t));
        return r
    }

    static processSelectQuestionAnswer(questions) {
        let res = [];

        getSelectQuestionAnswer(questions);
        function getSelectQuestionAnswer(questions) {
            for(let i=0;i<questions.length;i++) {
                let obj = {};
                if(questions[i]["childQuestions"].length != 0)  {
                    getSelectQuestionAnswer(questions[i]["childQuestions"]);
                }
                if(questions[i].options != 0) {
                    obj["answers"] = questions[i]["rightAnswer"];
                    obj["questionId"] = questions[i]["id"];
                    obj["questionNo"] = questions[i]["questionNo"];
                    obj["totalSeconds"] = 50;
                    obj["cateId"] = questions[i]["cate"];
                    res.push(obj);
                }
            }
        }
        return res;
    }

    static getDateFromStamp(day) {
        return new Date(parseInt(day)).toLocaleDateString()
    }

    static closeWindow() {
        let bg = $("#window-bg");
        let wm = $("#window-main");
        wm.animate({opacity:0,marginBottom: "+=100px"},200);
        setTimeout(()=>{
            wm.css("display","none");
            bg.remove();
        },220);
    }

    static getPapers(array) {
        let ret = [];
        for(let c of array) {
            if(c.studyTest != null || c.contentTypeName == "试卷")
                ret.push(c)
        }
        return ret;
    }

    static getCourses(array) {
        let ret = [];
        for(let c of array)
            if(c.contentTypeName in coursetagsreflection)
                ret.push(c)
        return ret;
    }
}

class GuiView {
    gelement = []
    lock = false

    LockGui() {
        this.lock=true
        for(let i of this.gelement) {
            if(i instanceof LockComponent)
                i.Lock();
            else if(!(i.attr('class').indexOf("kewt-course-l-date") != -1
                && i.attr('class').indexOf("kewt-course-l-date-sel") == -1))
                i.addClass("btn-unclick")
        }

    }

    UnlockGui() {
        this.lock=false
        for(let i of this.gelement) {
            if(i instanceof LockComponent)
                i.Unlock();
            else
                i.removeClass("btn-unclick")
        }
    }
}

class HomeworkView extends GuiView{
    constructor() {
        super()
        this.urlinfo = NetworkUtil.getUrlInfo(window.location.href)
        this.paperid = this.urlinfo.paperId
        this.bizcode = this.urlinfo.bizCode
        this.platform = this.urlinfo.platform || 1;
        this.HomeworkController = new HomeworkController()
        this.HomeworkController.addPaper({
            paperid: this.paperid,
            bizcode: this.bizcode,
            platform: this.platform
        })
    }

    async surfaceComponent() {
        let paperinfo = (await this.HomeworkController.getExamInfos())[0];
        this.paper = (await this.HomeworkController.getExamPaper())[0];

        let root = $("<div class='window-root'></div>");
        root.append(JQBasicComponents.getTitleText("作业"));

        let homeworkInfo = $("<div class='kewt-homework-detail'></div>")
        let homeworkId = $("<div class='kewt-homework-col'>作业ID:"+paperinfo.paperId+"</div>")
        let homeworkName = $("<div class='kewt-homework-col'>作业名称:"+this.paper.title+"</div>")
        //样式不一样,所以不用JQBasicComponents.getSingleLineKVs()
        homeworkInfo.append(homeworkId)
        homeworkInfo.append(homeworkName)
        root.append(homeworkInfo)

        let homeworkContainer = $("<div class='kewt-homework-container'></div>")

        await this.drawQuestions(homeworkContainer,this.paper.questions);
        root.append(homeworkContainer)
        root.append(JQBasicComponents.getTitleUpText("工具"))

        let menu = $("<div class='kewt-hwk-menu'></div>")
        let btn = JQBasicComponents.getBtn("green","填写选择题",async ()=>{
            super.LockGui();
            if(!this.choose) return false;
            let res = await this.HomeworkController.FillExamPapers()
            if(res.code == 0) {
                btn.text("填写成功!(点击刷新界面)")
                btn.click(()=> {
                    location.reload();
                })
            }
            super.UnlockGui()
        })
        this.gelement.push(btn)
        if(!this.choose)  {
            btn.css("background-color","gray")
            btn.text("这张试卷选择题题目为0")
        }
        menu.append(btn)
        root.append(menu)
        return root
    }

    async drawQuestions(parentContainer,questions,parseArray) {
        let sub = 1;
        for(let i of questions) {
            let parse =undefined
            if(parseArray == null)
                parse = await this.HomeworkController.getPaperParse(0,i.id)
            let quesContainer = $("<div class='kewt-ques-container'></div>")
            quesContainer.append("<div>"+i["questionContent"]+"</div>")

            let statusBar = $("<div class='ques-status-bar'></div>")
            statusBar.append($("<div class='blue-container'>"+sub+"</div>"))
            statusBar.append($("<div class='ques-c-info orange-container'>"+i["cateName"]+"</div>"))
            statusBar.append($("<div class='ques-c-info red-container'>试题ID:"+i["id"]+"</div>"))

            if(i["options"].length != 0) {
                this.choose = true
                let choices = i["options"];
                let rightAnswer = i["rightAnswer"];
                let optionContainer = $("<div class='ques-answer-container''></div>")
                for(let j of choices) {
                    let element = $(`<div class='ques-options-option'>
                    <div class='ques-options-choice-dot'>`+j["choice"]+`
                    </div><div class='ques-option-content'>`+j["option"]+`</div></div>
                    `);
                    if(rightAnswer.indexOf(j["choice"]) != -1) {
                        let answer = element.children(".ques-options-choice-dot")
                        answer.removeClass("ques-options-choice-dot")
                        answer.addClass("ques-options-choice-dot-heart")
                    }
                    optionContainer.append(element);
                }

                quesContainer.append(optionContainer);
                let parseContainer = $("<div class='ques-answer-container'></div>")
                parseContainer.append("<div class='ques-opt-container'>解析</div>")
                parseContainer.append(parseArray==null ? parse.method: parseArray[sub-1]["method"])
                quesContainer.append(parseContainer);
            } else {
                let rightAnswer = i["rightAnswer"];
                let answerContainer = $("<div class='ques-answer-container ques-answer-parse'></div>")
                answerContainer.append("<div class='ques-opt-container'>"+(i["childQuestions"].length==0 ? "答案": "小题部分")+"</div>")
                let answerParseContainer = $("<div class='ques-parse-container'></div>")
                if(i["childQuestions"].length != 0) {
                    await this.drawQuestions(answerParseContainer,i.childQuestions,parse.childQuestions);
                }
                else {
                    for(let j of rightAnswer) {
                        answerParseContainer.append(j);
                        answerParseContainer.append("&nbsp;&nbsp;&nbsp;");
                    }
                    answerParseContainer.append("<div class='ques-opt-container'>解析</div>")
                    answerParseContainer.append(parseArray==null ? parse["method"] : parseArray[sub-1]["method"])
                }
                answerContainer.append(answerParseContainer);
                quesContainer.append(answerContainer)
            }
            quesContainer.prepend(statusBar);
            parentContainer.append(quesContainer);
            sub ++;
        }
    }
}

class TaskView extends GuiView{
    constructor() {
        super()
        this.loading = false;
        this.urls = NetworkUtil.getUrlInfo(window.location.href);
        this.missionInstance = new MissionController(this.urls.homeworkId,1)
        this.courseInstance = new FinishCourseController();
        this.homeworkInstance = new HomeworkController();
    }

    async setSceneId() {
        await this.missionInstance.setSceneId(this.urls.sceneId);
    }

    async surfaceComponent() {
        this.root = $("<div class='window-root'></div>");
        let missioninfo = await this.missionInstance.getMissionInfo();
        let infokv = {
            "任务名": missioninfo.homeworkTitle,
            "起止时间": OtherUtil.getDateFromStamp(missioninfo.startDate) + "-" + OtherUtil.getDateFromStamp(missioninfo.endDate),
            "任务ID": missioninfo.homeworkIds[0]
        }

        this.root.append(JQBasicComponents.getTitleText("课程列表"))
        this.root.append(JQBasicComponents.getSingleLineKVs(infokv))

        let coursesContainer = $("<div class='kewt-course-container'></div>")
        let courseLeft = $("<div class='kewt-course-c-left'></div>")
        let courseRight = $("<div class='kewt-course-c-right'></div>")

        this.tasks = undefined,
            this.selectedElement = undefined;
        let viewbox = new ViewBox({
            "按日期分类": {
                container: coursesContainer,
                click: async ()=>{
                    return await this.LoadViewBox(1,coursesContainer,courseLeft,courseRight)
                }
            },
            "按学科分类": {
                container: coursesContainer,
                click: async ()=>{
                    return await this.LoadViewBox(2,coursesContainer,courseLeft,courseRight);
                }
            }
        },230);

        viewbox.Click(0)
        this.gelement.push(viewbox)

        this.root.append(viewbox.getView());

        let wholeFunc = $("<div class='kewt-course-wfunc'></div>")
        let jcbtn = $("<div class='kewt-common-btn btn-red'><label>点击跳过的全部课程</label></div>");
        let fobtn = $("<div class='kewt-common-btn btn-green'><label>点击填充全部练习的选择题</label></div>");
        this.gelement.push(jcbtn)
        this.gelement.push(fobtn)

        jcbtn.click(async ()=> {
            if(this.tasks == null) log.put(0,"log-box","施主别急,正在竭尽全力加载,请稍等...")
            else  await this.FinishAllCourses(this.tasks[this.selectedElement])
        })
        fobtn.click(async () => {
            if(this.tasks == null) log.put(0,"log-box","施主别急,正在竭尽全力加载,请稍等...")
            else await this.FillAllOptions(this.tasks[this.selectedElement])
        })
        this.root.append(JQBasicComponents.getTitleUpText("工具"))
        wholeFunc.append(jcbtn);
        wholeFunc.append(fobtn);

        this.root.append(wholeFunc)
        this.root.append(JQBasicComponents.getTitleUpText("日志"))
        this.root.append(log.generateBox(150,"log-box"))
        return this.root;
    }

    async LoadViewBox(type,coursesContainer,courseLeft,courseRight) {
        if(this.loading) {
            log.put(0,"log-box","施主,不要急,请先等待加载完成再点!")
            return false;
        }
        this.loading = true;
        courseLeft.empty();
        courseRight.empty();
        this.tasks = undefined;
        this.missionInstance.setType(type)
        this.tasks = await this.missionInstance.getMissionTask();
        let firstElement = undefined;
        for(let i in this.tasks) {
            let s = $("<div class='kewt-course-l-date'><label>"+i+"</label></div>");
            this.gelement.push(s)
            courseLeft.append(s)
            s.click(()=>{
                if(this.lock) return;
                this.selectedElement = i;
                this.renderTaskWindow(courseRight,s,this.tasks[i])
            })
            if(firstElement == undefined) firstElement = s;
        }
        firstElement.click();
        coursesContainer.append(courseLeft)
        coursesContainer.append(courseRight)
        this.loading = false;
        return true;
    }
    renderTaskWindow(parent,datebtn,tasks) {
        parent.empty();
        for(let j of tasks) {
            let eleRoot = $("<div class='kewt-course-c-right-ele'></div>")
            let img = "<div class='kewt-course-c-img'><img src='"+j.imgUrl+"' class='kewt-cci-i'/></div>";
            let info = $("<div class='kewt-course-c-info'></div>");
            let functions = $("<div class='kewt-course-c-major'></div>");
            info.append("<div class='kewt-cci-title'>["+j.subjectName+"]"+j.title+"</div>")
            eleRoot.append(img)

            if(j.contentTypeName == "试卷" || j.studyTest != null) {
                let btnFoPaper = $("<div class='kewt-mission-fn-btn btn-green'>填充选择题</div>")
                btnFoPaper.click(async ()=>{
                    await this.FillSingleOption(btnFoPaper,j)
                })
                this.gelement.push(btnFoPaper)
                functions.append(btnFoPaper)
            }
            if(j.contentTypeName in coursetagsreflection) {
                let btn = $("<div class='kewt-mission-fn-btn btn-red'>跳过课程</div>")
                btn.click(async ()=>{
                    await this.FinishSingleCourse(j)
                })
                this.gelement.push(btn)
                functions.append(btn)
            }
            info.append("<div class='kewt-cci-id'>任务ID:"+j["taskId"]+" <span style='color: red'>完成进度:"+Math.round(j["ratio"]*1000)/10+"%</span></div>")
            info.append(functions)
            eleRoot.append(info)
            parent.append(eleRoot)
        }
        $(".kewt-course-l-date-sel").removeClass("kewt-course-l-date-sel");
        datebtn.addClass("kewt-course-l-date-sel");
    }

    async FinishSingleCourse(task) {
        if(this.lock) return;
        super.LockGui()

        log.put(0,"log-box","你已经点击了跳课按钮.正在跳课...")
        log.uploadWithUserId(0,"开始跳一整天的课程")
        let urlinfo = NetworkUtil.getUrlInfo(task.contentUrl)
        this.courseInstance = new FinishCourseController().buildSingle(
            parseInt(urlinfo.lessonId),
            parseInt(urlinfo.courseId),
            task.homeworkId,
            task.contentTypeName,
            task["subjectName"],
            task.ratio
        )

        $(".progress-container").remove();
        let container = $("<div class='progress-container'></div>")
        let progress1= new progressBar(0,"100%")
        let title = JQBasicComponents.getTitleUpText("进度")
        container.append(title)
        container.append(progress1.getProgressBar())
        this.root.append(container);
        for await(let result of this.courseInstance.FinishCourse()) {
            progress1.setValue(result.subprogress * 100)
            log.put(result.code == 0 ? 0 : 2,"log-box",result.message)
            if(result.code != 0) break;
        }
        super.UnlockGui()
    }

    async FillSingleOption(btn,task) {
        if(this.lock) return;
        super.LockGui()
        log.put(0,"log-box","你已经点击了自动填充选择题按钮.正在填充选择题...")
        log.put(0,"log-box","本次填写选择题的课程标题:"+task.title)
        this.homeworkInstance = new HomeworkController().buildMulti([task])
        let res = await this.homeworkInstance.FillExamPapers();
        log.put(0,"log-box",res.message)
        if(res.code==0) btn.text("填写成功!")
        super.UnlockGui()
    }

    async FinishAllCourses(tasks) {
        if(this.lock) return;
        super.LockGui()

        let taskSigned = OtherUtil.getCourses(tasks)
        log.put(0,"log-box","开始跳课(共计"+taskSigned.length+"节课)...")

        let container = $("<div class='progress-container'></div>")
        let progress1 = new progressBar(0,"100%"),progress2= new progressBar(0,"100%")

        $(".progress-container").remove();
        let title = JQBasicComponents.getTitleUpText("进度")
        container.append(title)
        container.append(progress1.getProgressBar())
        container.append(progress2.getProgressBar())
        this.root.append(container);
        this.courseInstance = new FinishCourseController().buildMulti(taskSigned)
        for await (const res of this.courseInstance.FinishCourse()) {
            progress1.setValue(res.progress * 100)
            progress2.setValue(res.subprogress * 100)
            log.put(0,"log-box",res.message)
            if(res.code != 0) break;
        }
        super.UnlockGui();
    }

    async FillAllOptions(tasks) {
        if(this.lock) return;
        super.LockGui()
        let taskSigned = OtherUtil.getPapers(tasks);
        log.put(0,"log-box","开始填写选择题(共计"+taskSigned.length+"张试卷)...")
        this.homeworkInstance = new HomeworkController().buildMulti(taskSigned)
        let res = await this.homeworkInstance.FillExamPapers();
        log.put(0,"log-box",res.message)
        super.UnlockGui();
    }
}

class FinishCourseView extends GuiView{
    constructor() {
        super()
        let courseInfo = NetworkUtil.getUrlInfo(window.location.href);
        this.lessonid = courseInfo["lessonId"];
        this.courseid = courseInfo["courseId"];
        this.homeworkid = courseInfo["homeworkId"];
        this.subjectName = courseInfo["subjectName"];
        this.homeworkInstance = new HomeworkController().buildSingle(this.homeworkid,this.lessonid,1);
        this.courseTag = "课程讲"
        if(this.courseid == null && this.lessonid == null) {
            this.lessonid = courseInfo["id"]
            this.courseTag = "校本视频"
        }
        this.courseInstance = new FinishCourseController().buildSingle(this.lessonid,this.courseid,this.homeworkid,this.courseTag);
    }

    async surfaceComponent() {
        this.root = $("<div class='window-root'></div>");

        let courseinfo = await this.courseInstance.getCourseInfo(0);
        let infokv = {
            "课程名字": courseinfo["lessonName"],
            "课程学科" : courseinfo["subjectName"],
            "课程id": courseinfo["courseId"] || courseinfo["id"],
            "课程介绍": courseinfo["description"],
            "完整播放时间": (courseinfo["playTime"] || (courseinfo["videoPlayTime"]+"秒"))
        }

        this.root.append(JQBasicComponents.getTitleText("课程"))
        this.root.append(JQBasicComponents.getSingleLineKVs(infokv))

        this.root.append(JQBasicComponents.getTitleUpText("工具"))
        let funcbtns = $("<div class='kewt-course-funcbtns'></div>")
        this.fcbtn = JQBasicComponents.getBtn("red","点击跳课",async ()=>{
            if(!this.lock) {
                super.LockGui()
                await this.FinishCourseBtnClicked(courseinfo["lessonName"]);
                super.UnlockGui()
            }
        })
        this.fhbtn = JQBasicComponents.getBtn("green","点击填充作业的选择题",async ()=>{
            if(!this.lock) {
                super.LockGui()
                await this.FinishHomeworkClicked();
                super.UnlockGui()
            }
        })

        this.gelement.push(this.fcbtn)
        this.gelement.push(this.fhbtn)

        funcbtns.append(this.fcbtn)
        funcbtns.append(this.fhbtn)
        this.root.append(funcbtns);
        this.root.append(JQBasicComponents.getTitleUpText("日志"))
        this.root.append(log.generateBox(200,"log-box"))
        return this.root
    }

    async FinishCourseBtnClicked(courseName) {

        log.put(0,"log-box","欢迎使用ewt跳课程序!")
        log.put(0,"log-box","开始跳课...")
        log.put(0,'log-box',"课程名:"+courseName)
        let progress1 = new progressBar(0,"100%")
        let title = JQBasicComponents.getTitleUpText("进度")

        $(".progress-container").remove()

        let container = $("<div class='progress-container'></div>")
        container.append(title)
        container.append(progress1.getProgressBar())
        this.root.append(container)
        for await(let result of this.courseInstance.FinishCourse()) {
            progress1.setValue(result.subprogress * 100)
            log.put(result.code == 0 ? 0 : 2,"log-box",result.message)
            if(result.code != 0) break;
        }
    }

    async FinishHomeworkClicked() {
        log.put(0,"log-box","欢迎使用ewt填写选择题程序!")
        log.put(0,"log-box","开始填写选择题...")
        let res = await this.homeworkInstance.FillLessonExamPaper();
        log.put(0,"log-box",res.message)
    }
}

class FinishCourseController { //SpringMVC: Controller
    init() {
        this.courseDao = new CourseDao();
        this.coursesInfo = [];
        this.speed=1
    }

    buildSingle(lessonid,courseid,homeworkid,coursetag,subjectName,ratio) {
        this.init()
        this.coursesInfo.push({
            lessonid: lessonid,
            courseid: courseid,
            homeworkid: homeworkid,
            coursetag: coursetag,
            subjectName: subjectName,
            ratio: ratio || 0
        })
        return this
    }

    buildMulti(missions) {
        this.init()
        for(let c of missions) {
            if(c.contentTypeName in coursetagsreflection) {
                let urlInfo = NetworkUtil.getUrlInfo(c.contentUrl);
                this.coursesInfo.push({
                    lessonid: urlInfo.lessonId,
                    courseid: urlInfo.courseId,
                    homeworkid: c["homeworkId"],
                    coursetag: c.contentTypeName,
                    subjectName: c["subjectName"],
                    ratio: c.ratio || 0
                })
            }
        }
        return this
    }

    async *FinishCourse() {
        if(Math.abs((await NetworkUtil.getStdTime()) - Date.now()) > 3000)
            yield ResultFastUtil.ErrorResult(4,"抱歉,您的时间出现错误(与标准时间误差超过3秒).请在校准后再继续跳课.")
        else
            yield ResultFastUtil.ProgressResult(0,0,0,"现在的时间为"+new Date().toLocaleString())
        log.upload(0,"有一个人前来跳课,他的id为{id},课程信息为{courseInfo}".replace("{id}",userInfo.userid).replace("{courseInfo}",JSON.stringify(this.coursesInfo)))
        let count = 0,rdip = NetworkUtil.randomIP();
        if(this.coursesInfo.length === 0) {
            yield ResultFastUtil.ProgressResult(0,1,1,"没有课程可以跳.")
            return;
        }
        for(let obj of this.coursesInfo) {
            log.put(0,"log-box","课程ID:"+obj.courseid)
            log.put(0,"log-box","现在正在跳第"+(1+count)+"节课...")
            if(obj.ratio === 1) {
                ++count;
                yield ResultFastUtil.ProgressResult(0,count / this.coursesInfo.length,1,"此课程已经到达100%,不需要跳课了.")
                continue;
            }
            let courseobj = await this.getCourseInfoObject(obj);
            let vid = courseobj["videoPlayTime"];
            let duration = vid * 1000 * 0.8 * (1-obj.ratio) / this.speed + 50;
            let begin = Date.now();
            let uuid = OtherUtil.randomString(8);

            let arr =[];
            let start = 0,time = 0;

            if(duration - start < 60000) {
                arr.push([1,0,1,uuid + "_" + 0,duration - start]);
                arr.push([2,duration - start,1,uuid + "_" + (time+1),0])
            } else {
                arr.push([1,0,1,uuid + "_" + 0,60000]);
                while(start < duration) {
                    if(duration - start >= 60000) arr.push([2,60000,1,uuid + "_" + (time+1),60000])
                    else arr.push([2,duration - start,1,uuid + "_" + (time+1),duration - start])
                    start += 60000;
                    time ++;
                }
            }

            arr.push([3,0,3,uuid + "_" + (time)]);
            arr.push([4,5,1,uuid + "_" + (time+1)]);
            for(let i=0;i<arr.length;i++) {
                let end = Date.now();
                let sign = new FinishCourseSignatureUtil(end,arr[i][1],arr[i][0])
                let se = await sign.getRealSignature();
                let res = await this.courseDao.FinishCourseFn(
                    arr[i][0],
                    obj.lessonid,
                    obj.courseid,
                    begin.toString(),
                    end,
                    arr[i][1],
                    Date.now(),
                    se,
                    arr[i][2],
                    arr[i][3],
                    coursetagsreflection[obj.coursetag]["videoType"],
                    1,
                    rdip
                );
                if(res["success"] != true) {
                    if(res["msg"].indexOf("一心勿多用") != -1) {
                        log.put(0,"log-box","检测到跳课接口报'一心多用'问题,现在正在重试中...")
                        await sleep(2000);
                        i = i - 1;
                        continue;
                    } else {
                        log.uploadWithUserId(2,"跳课失败,代码为"+res["code"]+",原因为"+res["msg"]+",他现在在跳的课程为"+obj)
                        yield ResultFastUtil.ProgressResult(3,count / this.coursesInfo.length,(i+1) / arr.length,"抱歉,跳课失败(错误代码:"+res["code"]+",错误原因:"+res["msg"]+").");
                    }
                }
                yield ResultFastUtil.ProgressResult(0,count / this.coursesInfo.length,(i+1) / arr.length,"第"+(i+1)+"次接口请求成功,共"+arr.length+"次...")
                if((arr[i][0] == 1 || arr[i][0] === 2) && arr[i][4] != 0) {
                    yield ResultFastUtil.ProgressResult(0,count / this.coursesInfo.length,(i+1) / arr.length,"需要等待"+Math.round(arr[i][4]/10) / 100+"秒后才能继续操作.在此期间不要关闭窗口...")
                    await sleep(arr[i][4] + 50);
                }
            }
            log.uploadWithUserId(0,"跳课成功,课程信息为{courseInfo}".replace("{courseInfo}",JSON.stringify(obj)))
            ++count;
            yield ResultFastUtil.ProgressResult(0,count / this.coursesInfo.length,1,"第"+count+"节课跳课成功.")
        }
        yield ResultFastUtil.ProgressResult(0,count / this.coursesInfo.length,1,"跳课成功.")
    }

    async getCourseInfo(index) {
        return this.getCourseInfoObject(this.coursesInfo[index])
    }

    async getCourseInfoObject(obj) {
        let course = undefined;
        if(obj.coursetag == "课程讲") {
            course = this.courseDao.getCourseInfo(obj.lessonid,userInfo.schoolId,obj.homeworkid)
        } else if(obj.coursetag == "校本视频"){
            course = this.courseDao.getSchoolCourseInfo(obj.lessonId,userInfo.schoolId)
        }
        return course
    }
}

class CourseDao { //详细逻辑处理

    COURSE_DETAIL = "https://gateway.ewt360.com/api/homeworkprod/player/getLessonDetail";
    COURSE_BATCH_URL = "https://bfe.ewt360.com/monitor/web/collect/batch?TrVideoBizCode=1013&TrFallback=0&TrUserId={userId}&TrUuId={uuid}&TrLessonId={lessonid}&sdkVersion={sdkVersion}&_={timestamp}";
    SCHOOL_COURSE_URL = "https://gateway.ewt360.com/api/netschool/sbrvideo/listVideoInfoById";
    SUBMIT_URL = "https://gateway.ewt360.com/api/studyprod/course/lesson/record/submit"
    CHECK_CLICK_URL = "https://clog.ewt360.com"

    async getCourseInfo(lessonid,schoolid,homeworkid) {
        let data = {
            lessonId: parseInt(lessonid),
            schoolId: schoolid,
            homeworkId: parseInt(homeworkid)
        }
        let result = await NetworkUtil.requestJson("POST",this.COURSE_DETAIL,headers.CourseHeader,data)
        return NetworkUtil.validateReturn(result["responseText"])
    }

    async getSchoolCourseInfo(lessonid,schoolid) {
        let data = {
            idList: [lessonid],
            mockId: true,
            schoolId: schoolid
        }
        let res = await NetworkUtil.requestJson("POST",this.SCHOOL_COURSE_URL,headers.CourseHeader,data);
        return NetworkUtil.validateReturn(res["responseText"])
    }

    async FinishCourseFn(
        action,
        lessonid,
        courseId,
        beginTime,
        endTime,
        stayTime,
        duration,
        signature,
        status,
        uuid,
        videotype,
        rdip){
        let data = {
            CommonPackage: {
                browser:"Edge",
                browser_ver: "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76",
                ip: rdip,
                mstid: headerAndCookieUtils.getUserToken(),
                os: "macOS",
                playerType: 1,
                resolution: "1680*1050",
                sdkVersion: sdkVersion,
                userid: parseInt(userInfo.userid),
                videoBizCode: "1013"
            },
            EventPackage: [{
                action: action,
                begin_time: beginTime,
                course_id: courseId,
                fallback: 0,
                lesson_id: lessonid,
                point_num: 1,
                point_time: 60000,
                point_time_id: 15,
                quality: "标清",
                report_time: endTime,
                speed: 1,
                status: status,
                stay_time: stayTime,
                uuid: uuid,
                video_type: videotype
            }],
            signature: signature,
            sn: "ewt_web_video_detail",
            _: duration
        }
        let res = await NetworkUtil.requestJson("POST",this.COURSE_BATCH_URL.replace("{sdkVersion}",sdkVersion)
            .replace("{timetamp}",duration)
            .replace("{uuid}",uuid)
            .replace("{lessonid}",lessonid)
            .replace("{timestamp}",duration),headers.CourseHeader,data);
        return JSON.parse(res["responseText"]);
    }

    async Submit(
        courseid,
        lessonid
    ) {
        let data = {"recordList":
                [{"courseId":courseid.toString(),"lessonId":parseInt(lessonid),"processTime":0,"finished":0}],"schoolId":userInfo.schoolId}

        let res =  await NetworkUtil.requestJson("POST",this.SUBMIT_URL
            ,headers.CourseHeader,data);
        return NetworkUtil.validateReturn(res["responseText"])
    }
}

class HomeworkController {
    constructor() {
        this.papers = []
        this.homeworkDao = new HomeworkDao();
    }

    buildSingle(homeworkid,lessonid,platform) {
        this.homeworkDao = new HomeworkDao()
        this.lessonid = lessonid
        this.homeworkid = homeworkid
        this.platform = platform
        return this
    }

    buildMulti(missions) {
        this.homeworkDao = new HomeworkDao();
        this.papers = [];
        for(let i of missions) {
            if(i.studyTest != null && i.contentTypeName != "试卷") {
                this.papers.push( {
                    paperid: i.studyTest.paperId,
                    bizcode: 204,
                    platform: 1
                })
            } else if(i.contentTypeName == "试卷") {
                this.papers.push( {
                    paperid:  NetworkUtil.getUrlInfo(i.contentUrl).paperId,
                    bizcode: NetworkUtil.getUrlInfo(i.contentUrl).bizCode,
                    platform: NetworkUtil.getUrlInfo(i.contentUrl).platform
                })
            }
        }
        return this
    }

    async addPaper(obj) {
        this.papers.push(obj)
    }

    async getExamPaper() {
        let ret = []
        for(let i of this.papers) {
            let paper = await this.homeworkDao.getPaper(i.reportid,i.bizcode)
            ret.push(paper)
        }
        return ret;
    }

    async getExamInfos() {
        let ret = []
        for(let i of this.papers) {
            let info = await this.homeworkDao.getHomeworkInfo(i.paperid,i.bizcode)
            i.reportid = info.reportId
            ret.push(info)
        }
        return ret;
    }

    async FillExamPapers() {
        let c = 0;
        for(let i of this.papers) {
            log.put(0,"log-box","开始填写选择题,第"+(++c)+"份"+",共"+this.papers.length+"份...")
            let res = await this.FillExamPaperF(i.paperid,i.bizcode,1)
            log.put(0,"log-box",res.message)
        }
        return ResultFastUtil.NormalResult(0,"本次试卷填写选择题成功!")
    }

    async FillLessonExamPaper() {
        let lessonPaper = await this.homeworkDao.getPlayerLesson([this.lessonid],this.homeworkid,userInfo.userid)
        let paperid = lessonPaper[0].studyTest.paperId;
        return await this.FillExamPaperF(paperid,204,this.platform)
    }

    async FillExamPaperF(paperid,bizcode,platform) {
        let paperBasicInfo = await this.homeworkDao.getHomeworkInfo(paperid,bizcode)
        let reportid = paperBasicInfo.reportId

        let paper = await this.homeworkDao.getPaper(paperBasicInfo.reportId,bizcode)
        let title = paper["title"]
        let answers = OtherUtil.processSelectQuestionAnswer(paper.questions)

        if(answers.length == 0) return ResultFastUtil.NormalResult(0,"这张试卷没有选择题.")
        let result = await this.homeworkDao.FillOption(paperid,reportid,answers,bizcode,platform)
        if(result.success) {
            log.uploadWithUserId(0,"成功填写选择题,试卷标题为:"+title+",试卷ID为:"+reportid)
            return ResultFastUtil.NormalResult(0,"填写选择题成功!")
        }
        else {
            log.uploadWithUserId(2,"填写选择题失败!试卷标题:"+title+",试卷ID为:"+reportid,",原因:"+result.msg)
            return ResultFastUtil.NormalResult(0,"填写选择题错误!")
        }
    }

    async getPaperParse(index,questionid) {
        let data = this.homeworkDao.getQuestionParse(this.papers[index].bizcode,this.papers[index].paperid,questionid,this.papers[index].reportid);
        return data;
    }
}

class HomeworkDao {
    SUBMIT_ANSWER_URL = "https://web.ewt360.com/api/answerprod/web/answer/submitanswer"
    HOMEWORK_PAPER_ANSWER_URL = "https://web.ewt360.com/customerApi/api/studyprod/web/answer/webreport?reportId={reportid}&bizCode={bizCode}&platform=1"
    LESSON_HOMEWORK_URL = "https://gateway.ewt360.com/api/homeworkprod/player/getPlayerLessonConfig";
    REPORT_URL = "https://web.ewt360.com/customerApi/api/studyprod/web/answer/report?&platform=1&isRepeat=1&paperId={paperId}&bizCode={bizCode}"
    QUES_PARSE_URL = "https://web.ewt360.com/customerApi/api/studyprod/web/answer/simple/question/info";

    async getPaper(reportId,bizCode) {
        let res = await NetworkUtil.request("GET",this.HOMEWORK_PAPER_ANSWER_URL.replace("{reportid}",reportId).replace("{bizCode}",bizCode),headers.CommonHeader);
        return NetworkUtil.validateReturn(res["responseText"]);
    }

    async getPlayerLesson(lessonIds,homeworkid,schoolid) {
        let data = {"lessonIdList":lessonIds,"homeworkId":homeworkid,"schoolId":schoolid}
        let res = await NetworkUtil.requestJson("POST",this.LESSON_HOMEWORK_URL,headers.CommonHeader,data)
        return NetworkUtil.validateReturn(res["responseText"])
    }

    async getHomeworkInfo(paperid,bizCode) { //
        let res = await NetworkUtil.request("GET",this.REPORT_URL.replace("{paperId}",paperid).replace("{bizCode}",bizCode),headers.CourseHeader);
        return NetworkUtil.validateReturn(res["responseText"])
    }

    async FillOption(paperId,reportId,answers,bizCode,platform) {
        let data = {
            answers: answers,
            assignPoints: false,
            bizCode: bizCode.toString(),
            paperId: paperId.toString(),
            platform: platform.toString(),
            reportId: reportId.toString()
        }
        let res = await NetworkUtil.requestJson("POST",this.SUBMIT_ANSWER_URL,headers.CommonHeader,data);
        return JSON.parse(res["responseText"])
    }

    async getQuestionParse(bizCode,paperId,questionId,reportId) {
        let data = {
            bizCode: parseInt(bizCode),
            paperId: paperId.toString(),
            questionId: questionId.toString(),
            platform: "1",
            reportId: reportId.toString()
        }
        let res = await NetworkUtil.requestJson("POST",this.QUES_PARSE_URL,headers.CourseHeader,data);
        return NetworkUtil.validateReturn(res["responseText"])
    }
}

class MissionController {
    constructor(homeworkid,type) {
        this.MissionDao = new MissionDao();
        this.homeworkid = homeworkid;
        this.type = type
    }

    setType(type) {
        this.type = type;
    }

    async setSceneId(sceneid) {
        let [homeworkid] = (await this.MissionDao.getHomeworkSummaryInfo(sceneid)).homeworkIds;
        this.homeworkid = homeworkid;
    }

    async getMissionTask() {
        let ret = {},data0;
        if(this.type == 1)
            data0 = (await this.MissionDao.getHomeworkBasicData([this.homeworkid],userInfo.schoolId,this.type)).days;
        else
            data0 = (await this.MissionDao.getHomeworkBasicData([this.homeworkid],userInfo.schoolId,this.type)).subjectList;
        for(let i of data0) {
            let mission = undefined;
            if(this.type == 1) {
                mission = await this.MissionDao.pageHomeworkTasks(i["dayId"],i["day"],[this.homeworkid])
                ret[OtherUtil.getDateFromStamp(parseInt(i.day))] = mission["data"]
            }
            else if(this.type == 2) {
                mission = await this.MissionDao.pageHomeworkTasksByHomeworkId(i.subjectId,[this.homeworkid])
                ret[i["chinese"]] = mission["data"]
            }
        }
        return ret;
    }

    async getMissionInfo() {
        return this.MissionDao.getMissionInfo(this.homeworkid,userInfo.userid)
    }
}

class MissionDao {
    DAY_URL = "https://gateway.ewt360.com/api/homeworkprod/homework/student/studentHomeworkDistribution";
    MISSIONS_INFO_URL = "https://gateway.ewt360.com/api/homeworkprod/homework/student/studentHomeworkSummaryInfo?sceneId=0&homeworkId={hid}&schoolId={sid}";
    HOMEWORK_TASKS_URL = "https://gateway.ewt360.com/api/homeworkprod/homework/student/pageHomeworkTasks";
    HOMEWORK_SUMMARY_INFO = "https://gateway.ewt360.com/api/homeworkprod/homework/student/holiday/getHomeworkSummaryInfo?schoolId={schoolId}&timestamp={timestamp}&sceneId={sceneId}";

    //获取day dayid
    async getHomeworkBasicData(homeworks,schoolid,taskDistributionTypeEnum) {
        let data = {
            homeworkIds: [parseInt(homeworks[0])],
            sceneId: 0,
            taskDistributionTypeEnum: taskDistributionTypeEnum,
            schoolId:schoolid
        }
        let res = await NetworkUtil.requestJson("POST",this.DAY_URL,headers.CommonHeader,data);
        return NetworkUtil.validateReturn(res["responseText"])
    }

    //获取整个作业id
    async getMissionInfo(hid,sid) {
        let res = await NetworkUtil.request("GET",this.MISSIONS_INFO_URL.replace("{hid}",hid).replace("{sid}",sid),headers.CommonHeader);
        return NetworkUtil.validateReturn(res["responseText"]);
    }

    //获取dayid对应的任务列表
    async pageHomeworkTasks(dayid,timestamp,homeworkids) {
        let data = {
            day: timestamp,
            dayId: dayid,
            homeworkIds: homeworkids,
            pageIndex: 1,
            pageSize: 1000,
            sceneId: 0,
            schoolId: userInfo.schoolId
        }
        let res = await NetworkUtil.requestJson("POST",this.HOMEWORK_TASKS_URL,headers.CourseHeader,data);
        return NetworkUtil.validateReturn(res["responseText"]);
    }

    async pageHomeworkTasksByHomeworkId(subjectid,homeworkids) {
        let data ={
            "homeworkIds":homeworkids,
            "sceneId":0,
            "pageIndex":1,
            "pageSize":1000,
            "subjectId":subjectid,
            "schoolId":userInfo.schoolId
        }
        let res = await NetworkUtil.requestJson("POST",this.HOMEWORK_TASKS_URL,headers.CourseHeader,data);
        return NetworkUtil.validateReturn(res["responseText"]);
    }

    async getHomeworkSummaryInfo(sceneId) {
        let url = this.HOMEWORK_SUMMARY_INFO.replace("{schoolId}",userInfo.schoolId)
            .replace("{timestamp}",Date.now())
            .replace("{sceneId}",parseInt(sceneId))
        let res = await NetworkUtil.request("GET",url,headers.CommonHeader,null);
        return NetworkUtil.validateReturn(res["responseText"]);
    }
}


class UserInfoInterface {
    GET_USER_URL = "https://web.ewt360.com/api/usercenter/user/baseinfo";
    SCHOOL_URL = "https://gateway.ewt360.com/api/eteacherproduct/school/getSchoolUserInfo";

    async getBasicUserInfo() {
        let res = await NetworkUtil.request("GET",this.GET_USER_URL,headers.CommonHeader,null);
        return NetworkUtil.validateReturn(res["responseText"])
    }

    async getSchoolInfo() {
        let res = await NetworkUtil.request("GET",this.SCHOOL_URL,headers.CourseHeader);
        let data = NetworkUtil.validateReturn(res["responseText"])
        return data["schoolId"];
    }

}

//一些jq基本的组件
class JQBasicComponents {
    static getSingleLineKV(k,v) {
        let e = $("<div class='kewt-course-col'>"+k+":"+"</div>");
        e.append(v)
        return e
    }

    static getSingleLineKVs(dict) {
        let ele = $("<div></div>");
        for(let k in dict)
            ele.append($(this.getSingleLineKV(k,dict[k])))

        return ele;
    }

    static getTitleText(text) {
        return $("<div class='kewt-course-text'>"+text+"</div>");
    }

    static getTitleUpText(text) {
        return $("<div class='kewt-homework-text kewt-homework-top'>"+text+"</div>")
    }

    static getBtn(color,text,click) {
        let btn = $("<div class='kewt-common-btn btn-"+color+"' id='fh-btn'><label>"+text+"</label></div>")
        btn.click(click)
        return btn;
    }

    static getLogBox(uniqueId,height) {
        return $("<div class='kewt-log-box' id='"+uniqueId+"' style='height: "+height+"px'></div>")
    }

    static getMenuBtn(color,imgelement,text,click) {
        let main = $('<div class="menu-window-btn btn-'+color+'"></div>')
        main.append(imgelement)
        let texte = $('<div class="menu-btn-text"></div>')
        texte.append(text)
        let btne = $(`<div class="menu-btn-container"></div>`)
        btne.append(main)
        btne.append(texte)
        btne.click(click)
        return btne;
    }
}

class WindowSurface {

    isInMainFrame() {
        let navFunctions = [$(".right-31MZp"),$(".navs-5oieR")];
        let hasNav = false
        navFunctions.forEach(element => {
            if(element.length != 0) {
                hasNav = true
            }
        });
        let hasCourseLstEle = $("[class^='page-wrapper']").length == 0 && $("[class^='course_package_container']").length == 0
        return !hasCourseLstEle && hasNav;
    }

    isOnPractisePage() {
        let kv = NetworkUtil.getUrlInfo(window.location.href)
        return window.location.href.indexOf('exam/answer') && ('paperId' in kv);
    }

    renderBackground() {
        let rootE = $(document.body)
        let bg = $("<div id='window-bg'></div>");
        let loading = $("<div class='loading'>同学,请耐心等待亿下,正在狠命加载窗口中...</div>");
        loading.append("<span class='load-tips'>如果长时间卡在这个界面,请尝试刷新并重新打开工具箱!</span>")
        bg.append(loading)
        rootE.prepend(bg)
        const windowAnimation = loading.animate({opacity:1,marginBottom: "-=100px"},200);
        return loading;
    }

    insertErrorMsg(loading,msg) {
        let errorbox = $("<div class='load-error-comp'></div>");
        errorbox.append("<div class='load-error-msg-title'><div class='circle-dot' style='margin-right: 5px'>E</div><div class='err-title'>Oops,EWT Killer 程序挂了!</div></div>")
        errorbox.append("<div style='font-size: 12px'>程序临死前的遗言:"+msg+".</div>");
        log.upload(3,"ID为{id}的用户启动程序的时候出现错误,原因是"+msg)
        errorbox.append(`<div style='font-size: 12px'>
                <span style="color:red">你可以加作者qq 1099393211 来购买此插件的AE版本.</span>
            </div>`);
        loading.append(errorbox);
    }

    renderNavComponent() {
        let root = $(`<div class='kewt-window-nav'>
        </div>`);
        root.prepend($(`<div id='close-btn'><label class='close-btn-label'>C</label></div>`));

        let userCol = $("<div class='kewt-tscol'></div>");
        userCol.append($(`<div class='kewt-title'>`+(userInfo.realname != null ? userInfo.realname : "未登录")+`</div>`));
        userCol.append($("<div class='kewt-subject'>ID:"+(userInfo.userid!=null ? userInfo.userid : "N/A(<a href='https://web.ewt360.com/register/#/login' onclick='javascript:location.reload();'>点击这儿去登录</a>)")+"</div>"));
        let authorCol = $("<div class='kewt-tscol kewt-tscol-right'></div>");
        authorCol.append(`<div class='kewt-title' style="color:red">可联系QQ 1099693211购买AE版本以获得后续更新</div>`)
        authorCol.append("<div class='kewt-subject kewt-subject-right'>插件版本:"+version.split(":")[0]+" 本程序具有超级牛力(Super Cow Powers)!</div>")
        root.prepend(authorCol);
        root.prepend(userCol);
        return root
    }

    renderWindow(navComponent,bodyComponent) {
        let windowMain = $("<div id='window-main'></div>");
        let bg = $("#window-bg")
        windowMain.append(navComponent);
        let kewtWindowBody = $("<div class='kewt-window-body'></div>");
        kewtWindowBody.append(bodyComponent);
        windowMain.append(kewtWindowBody)
        let closeBtn = windowMain.find("#close-btn")
        closeBtn.mouseup(()=>{
            OtherUtil.closeWindow();
        });
        $("#window-bg").empty();
        bg.prepend(windowMain);
        const windowAnimation = windowMain.animate({opacity:1,marginBottom: "-=100px"},200);
    }

    renderWindowMenu(btns) {
        let body = $(document.body)
        let mask = $("<div class='w-mask'></div>")
        let menu = $("<div class='menu'></div>")
        let left = $("<div class='menu-left'></div>")
        left.append($("<div class='w-title'>KillBox</div>"));
        menu.append(left)
        let btncontainer = $("<div class='w-btn-container'></div>")
        for(let i of btns)
            btncontainer.append(i)
        menu.append(btncontainer)
        mask.append(menu)
        body.append(mask)
    }

    isInCoursePage() {
        return ($("[class^='course_package_container']").length != 0)
    }

    isInTaskPage() {
        let kv = NetworkUtil.getUrlInfo(window.location.href)
        let b = ("homeworkId" in kv) && kv.homeworkId!=undefined

        return window.location.href.indexOf('student/homework-detail')!=-1 && b
    }

    FirstWindow(btnclick) {
        let windowRoot = $("<div class='window-root'>")
        windowRoot.append(JQBasicComponents.getTitleText("最后的更新"))
        let element = $(`
            <div class='first-view'>
            各位好:
                <p class='first-view-pa'>EWT Killer Box自打发布以来，至今已经一年有余。感谢你们一年以来的陪伴。</p>
                <p class='first-view-pa'>然而，因为学校的计划有临时变动，导致我已没时间精力再去维护B版本。所以，我做出来一个艰难的决定，停止维护B版。</p>
                <p class='first-view-pa'>而这个项目，也是我高中时期的最后一票。自此之后，我就会暂时退隐江湖，全力以赴去准备半年后的浙江首考和一年后的高考。</p>
                <p class='first-view-pa'>一年之后，我希望我会带着一份重点大学的录取通知书重出江湖，并且给大家带来功能更强大，操作更简便的程序。</p>
                <p class='first-view-pa'>感谢你们一年以来的支持。等到一年后，江湖上再见。</p>
            Bash,<br>
            2024.07.29
            </div>
        `)
        let container = $("<div class='text-container'></div>")

        let btn = $("<div class='fvc-btn'>确认</div>")
        container.append(btn)
        windowRoot.append(element)
        windowRoot.append(container)

        btn.click(()=>{
            PluginUtil.setValue("last","true")
            setTimeout(()=>{
            btnclick();},500)
        })
        return windowRoot
    }

    isInHolidayFrame() {
        let s = NetworkUtil.getUrlInfo(window.location.href)
        let b = ('sceneId' in s) && s['sceneId']!=undefined;
        return window.location.href.indexOf('holiday') && b
    }

    static NoPage() {
        let root = $("<div class='window-root'></div>")
        root.append("<div class='window-nopage'>抱歉,你现在没有打开任何界面.请去任务/作业/假期列表以继续.</div>")
        return root
    }
}

function startup() {
    $(document).ready(async ()=> {
        PluginUtil.addStyle(style)
        PluginUtil.registerMenuCommand("插件版本:"+version,()=>{},null)
        configure = new SettingManager();
        let bgsurface = new WindowSurface();
        log = new LogSystem()

        userInfo.token = headerAndCookieUtils.getUserToken();
        let info = new UserInfoInterface();
        let useri = await info.getBasicUserInfo();
        if(useri !== undefined) {
            userInfo.realname = useri.realName;
            userInfo.userid = useri.userId
            userInfo.schoolId = await info.getSchoolInfo(); //基本信息获取
        }

        let say = [
            "数组玩不起了是吧",
            "开始跟我玩char和int互转和url编解码了，太聪明辣",
            "这次我找了整整3000毫秒才找到呢，真的是装的太好辣，太聪明辣",
            "再接再厉啊，按照之前的老规矩,贴个源代码",
            `https://cdn.ewt360.com/resources/app/prod/bend-holiday/dist/6.6.bundle.c4dfe3e0.js中的
            3342: function(e, t, a) {
        "use strict";
        a(13),
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.getMonkeyMap = void 0;
        t.getMonkeyMap = function() {
            var e, t;
            return {
                upload_monkey_key: (null === (e = window) || void 0 === e ? void 0 : e.decodeURIComponent("%E4%BD%BF%E7%94%A8%E6%B2%B9%E7%8C%B4%E7%9A%84%E7%94%A8%E6%88%B7")) || "",
                monkey_alert_warning: (null === (t = window) || void 0 === t ? void 0 : t.decodeURIComponent("%E6%82%A8%E5%A5%BD%EF%BC%8C%E4%B8%BA%E4%BF%9D%E9%9A%9C%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E5%AE%89%E5%85%A8%EF%BC%8C%E5%B9%B3%E5%8F%B0%E7%A6%81%E6%AD%A2%E4%BD%BF%E7%94%A8%E4%B8%80%E5%88%87%E6%9C%AA%E7%9F%A5%E6%9D%A5%E6%BA%90%E7%9A%84%E8%BD%AF%E4%BB%B6%E6%88%96%E6%8F%92%E4%BB%B6%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0%E3%80%82%E7%94%B1%E7%AC%AC%E4%B8%89%E6%96%B9%E8%BD%AF%E4%BB%B6%E4%BA%A7%E7%94%9F%E7%9A%84%E5%AD%A6%E4%B9%A0%E7%BB%93%E6%9E%9C%E5%B0%86%E8%A2%AB%E6%A0%87%E8%AE%B0%E4%B8%BA%E9%9D%9E%E6%AD%A3%E5%B8%B8%E7%9A%84%E5%AD%A6%E4%B9%A0%E8%A1%8C%E4%B8%BA%EF%BC%8C%E4%BA%A7%E7%94%9F%E7%9A%84%E5%AD%A6%E4%B9%A0%E6%95%B0%E6%8D%AE%E4%B8%8D%E7%BA%B3%E5%85%A5%E7%BB%9F%E8%AE%A1%EF%BC%8C%E5%B1%9E%E6%97%A0%E6%95%88%E6%95%B0%E6%8D%AE%E3%80%82%E8%AF%B7%E5%8A%A1%E5%BF%85%E9%81%B5%E5%AE%88%E5%B9%B3%E5%8F%B0%E8%A7%84%E5%88%99%EF%BC%8C%E9%81%BF%E5%85%8D%E5%9B%A0%E6%95%B0%E6%8D%AE%E6%97%A0%E6%95%88%E5%AF%BC%E8%87%B4%E7%9B%B8%E5%85%B3%E5%AD%A6%E4%B9%A0%E4%BB%BB%E5%8A%A1%E6%9C%AA%E5%AE%8C%E6%88%90%EF%BC%8C%E6%84%9F%E8%B0%A2%E6%82%A8%E7%9A%84%E7%90%86%E8%A7%A3%E5%92%8C%E6%94%AF%E6%8C%81%E3%80%82")) || "",
                monkey_div_classlist: [String.fromCharCode(46, 119, 45, 109, 97, 115, 107), String.fromCharCode(46, 119, 45, 26377, 31181, 26469, 25235, 25105, 21568)]
            }
        }
    }`
        ]
        for(let c of say) console.log(c)
        console.clear()

        let open = JQBasicComponents.getMenuBtn("red",$(`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="18px" height="18px">
                <path d="M 18.5 5 C 16.585045 5 15 6.5850452 15 8.5 L 15 13 L 9.5 13 C 6.4802259 13 4 15.480226 4 18.5 L 4 37.5 C 4 40.519774 6.4802259 43 9.5 43 L 38.5 43 C 41.519774 43 44 40.519774 44 37.5 L 44 18.5 C 44 15.480226 41.519774 13 38.5 13 L 33 13 L 33 8.5 C 33 6.5850452 31.414955 5 29.5 5 L 18.5 5 z M 18.5 8 L 29.5 8 C 29.795045 8 30 8.2049548 30 8.5 L 30 13 L 18 13 L 18 8.5 C 18 8.2049548 18.204955 8 18.5 8 z M 9.5 16 L 38.5 16 C 39.898226 16 41 17.101774 41 18.5 L 41 23 L 36 23 L 36 22.5 C 36 21.672 35.328 21 34.5 21 L 31.5 21 C 30.672 21 30 21.672 30 22.5 L 30 23 L 18 23 L 18 22.5 C 18 21.672 17.328 21 16.5 21 L 13.5 21 C 12.672 21 12 21.672 12 22.5 L 12 23 L 7 23 L 7 18.5 C 7 17.101774 8.1017741 16 9.5 16 z M 7 26 L 12 26 L 12 26.5 C 12 27.328 12.672 28 13.5 28 L 16.5 28 C 17.328 28 18 27.328 18 26.5 L 18 26 L 30 26 L 30 26.5 C 30 27.328 30.672 28 31.5 28 L 34.5 28 C 35.328 28 36 27.328 36 26.5 L 36 26 L 41 26 L 41 37.5 C 41 38.898226 39.898226 40 38.5 40 L 9.5 40 C 8.1017741 40 7 38.898226 7 37.5 L 7 26 z"/>
            </svg>`),"打开工具箱",async ()=>{await renderBtn(bgsurface)})
        let setting = JQBasicComponents.getMenuBtn("blue",$(`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="25px" height="20px">
                        <path d="M 15 2 C 14.448 2 14 2.448 14 3 L 14 3.171875 C 14 3.649875 13.663406 4.0763437 13.191406 4.1523438 C 12.962406 4.1893437 12.735719 4.2322031 12.511719 4.2832031 C 12.047719 4.3892031 11.578484 4.1265 11.396484 3.6875 L 11.330078 3.53125 C 11.119078 3.02125 10.534437 2.7782344 10.023438 2.9902344 C 9.5134375 3.2012344 9.2704219 3.785875 9.4824219 4.296875 L 9.5488281 4.4570312 C 9.7328281 4.8970313 9.5856875 5.4179219 9.1796875 5.6699219 C 8.9836875 5.7919219 8.7924688 5.9197344 8.6054688 6.0527344 C 8.2174688 6.3297344 7.68075 6.2666875 7.34375 5.9296875 L 7.2226562 5.8085938 C 6.8316562 5.4175937 6.1985937 5.4175938 5.8085938 5.8085938 C 5.4185938 6.1995938 5.4185938 6.8326563 5.8085938 7.2226562 L 5.9296875 7.34375 C 6.2666875 7.68075 6.3297344 8.2164688 6.0527344 8.6054688 C 5.9197344 8.7924687 5.7919219 8.9836875 5.6699219 9.1796875 C 5.4179219 9.5856875 4.8960781 9.7337812 4.4550781 9.5507812 L 4.296875 9.484375 C 3.786875 9.273375 3.2002813 9.5153906 2.9882812 10.025391 C 2.7772813 10.535391 3.0192969 11.120031 3.5292969 11.332031 L 3.6855469 11.396484 C 4.1245469 11.578484 4.3892031 12.047719 4.2832031 12.511719 C 4.2322031 12.735719 4.1873906 12.962406 4.1503906 13.191406 C 4.0753906 13.662406 3.649875 14 3.171875 14 L 3 14 C 2.448 14 2 14.448 2 15 C 2 15.552 2.448 16 3 16 L 3.171875 16 C 3.649875 16 4.0763437 16.336594 4.1523438 16.808594 C 4.1893437 17.037594 4.2322031 17.264281 4.2832031 17.488281 C 4.3892031 17.952281 4.1265 18.421516 3.6875 18.603516 L 3.53125 18.669922 C 3.02125 18.880922 2.7782344 19.465563 2.9902344 19.976562 C 3.2012344 20.486563 3.785875 20.729578 4.296875 20.517578 L 4.4570312 20.451172 C 4.8980312 20.268172 5.418875 20.415312 5.671875 20.820312 C 5.793875 21.016313 5.9206875 21.208484 6.0546875 21.396484 C 6.3316875 21.784484 6.2686406 22.321203 5.9316406 22.658203 L 5.8085938 22.779297 C 5.4175937 23.170297 5.4175938 23.803359 5.8085938 24.193359 C 6.1995938 24.583359 6.8326562 24.584359 7.2226562 24.193359 L 7.3457031 24.072266 C 7.6827031 23.735266 8.2174688 23.670266 8.6054688 23.947266 C 8.7934688 24.081266 8.9856406 24.210031 9.1816406 24.332031 C 9.5866406 24.584031 9.7357344 25.105875 9.5527344 25.546875 L 9.4863281 25.705078 C 9.2753281 26.215078 9.5173438 26.801672 10.027344 27.013672 C 10.537344 27.224672 11.121984 26.982656 11.333984 26.472656 L 11.398438 26.316406 C 11.580438 25.877406 12.049672 25.61275 12.513672 25.71875 C 12.737672 25.76975 12.964359 25.814562 13.193359 25.851562 C 13.662359 25.924562 14 26.350125 14 26.828125 L 14 27 C 14 27.552 14.448 28 15 28 C 15.552 28 16 27.552 16 27 L 16 26.828125 C 16 26.350125 16.336594 25.923656 16.808594 25.847656 C 17.037594 25.810656 17.264281 25.767797 17.488281 25.716797 C 17.952281 25.610797 18.421516 25.8735 18.603516 26.3125 L 18.669922 26.46875 C 18.880922 26.97875 19.465563 27.221766 19.976562 27.009766 C 20.486563 26.798766 20.729578 26.214125 20.517578 25.703125 L 20.451172 25.542969 C 20.268172 25.101969 20.415312 24.581125 20.820312 24.328125 C 21.016313 24.206125 21.208484 24.079312 21.396484 23.945312 C 21.784484 23.668312 22.321203 23.731359 22.658203 24.068359 L 22.779297 24.191406 C 23.170297 24.582406 23.803359 24.582406 24.193359 24.191406 C 24.583359 23.800406 24.584359 23.167344 24.193359 22.777344 L 24.072266 22.654297 C 23.735266 22.317297 23.670266 21.782531 23.947266 21.394531 C 24.081266 21.206531 24.210031 21.014359 24.332031 20.818359 C 24.584031 20.413359 25.105875 20.264266 25.546875 20.447266 L 25.705078 20.513672 C 26.215078 20.724672 26.801672 20.482656 27.013672 19.972656 C 27.224672 19.462656 26.982656 18.878016 26.472656 18.666016 L 26.316406 18.601562 C 25.877406 18.419563 25.61275 17.950328 25.71875 17.486328 C 25.76975 17.262328 25.814562 17.035641 25.851562 16.806641 C 25.924562 16.337641 26.350125 16 26.828125 16 L 27 16 C 27.552 16 28 15.552 28 15 C 28 14.448 27.552 14 27 14 L 26.828125 14 C 26.350125 14 25.923656 13.663406 25.847656 13.191406 C 25.810656 12.962406 25.767797 12.735719 25.716797 12.511719 C 25.610797 12.047719 25.8735 11.578484 26.3125 11.396484 L 26.46875 11.330078 C 26.97875 11.119078 27.221766 10.534437 27.009766 10.023438 C 26.798766 9.5134375 26.214125 9.2704219 25.703125 9.4824219 L 25.542969 9.5488281 C 25.101969 9.7318281 24.581125 9.5846875 24.328125 9.1796875 C 24.206125 8.9836875 24.079312 8.7915156 23.945312 8.6035156 C 23.668312 8.2155156 23.731359 7.6787969 24.068359 7.3417969 L 24.191406 7.2207031 C 24.582406 6.8297031 24.582406 6.1966406 24.191406 5.8066406 C 23.800406 5.4156406 23.167344 5.4156406 22.777344 5.8066406 L 22.65625 5.9296875 C 22.31925 6.2666875 21.782531 6.3316875 21.394531 6.0546875 C 21.206531 5.9206875 21.014359 5.7919219 20.818359 5.6699219 C 20.413359 5.4179219 20.266219 4.8960781 20.449219 4.4550781 L 20.515625 4.296875 C 20.726625 3.786875 20.484609 3.2002812 19.974609 2.9882812 C 19.464609 2.7772813 18.879969 3.0192969 18.667969 3.5292969 L 18.601562 3.6855469 C 18.419563 4.1245469 17.950328 4.3892031 17.486328 4.2832031 C 17.262328 4.2322031 17.035641 4.1873906 16.806641 4.1503906 C 16.336641 4.0753906 16 3.649875 16 3.171875 L 16 3 C 16 2.448 15.552 2 15 2 z M 15 7 C 19.078645 7 22.438586 10.054876 22.931641 14 L 16.728516 14 A 2 2 0 0 0 15 13 A 2 2 0 0 0 14.998047 13 L 11.896484 7.625 C 12.850999 7.222729 13.899211 7 15 7 z M 10.169922 8.6328125 L 13.269531 14 A 2 2 0 0 0 13 15 A 2 2 0 0 0 13.269531 15.996094 L 10.167969 21.365234 C 8.2464258 19.903996 7 17.600071 7 15 C 7 12.398945 8.2471371 10.093961 10.169922 8.6328125 z M 16.730469 16 L 22.931641 16 C 22.438586 19.945124 19.078645 23 15 23 C 13.899211 23 12.850999 22.777271 11.896484 22.375 L 14.998047 17 A 2 2 0 0 0 15 17 A 2 2 0 0 0 16.730469 16 z"/>
                </svg>`),"设置(未做完)",async ()=>{})

        bgsurface.renderWindowMenu([open,setting]);
    })

    async function renderBtn(bgsurface) {
        PluginUtil.addStyle(style)
        OtherUtil.closeWindow();

        let loading = bgsurface.renderBackground();
        if(await PluginUtil.getValue("last") != "true") {
            bgsurface.renderWindow(null,bgsurface.FirstWindow(()=>{

                renderMainWindow(bgsurface,loading)}))
        } else {
            await renderMainWindow(bgsurface,loading);
        }

    }

    async function renderMainWindow(bgsurface,loading)  {
        try {
            let nav = bgsurface.renderNavComponent();
            let bodycomponent = undefined;
            let rd = Math.random();
            if(rd < 0.2) {
                await sleep(500)
                throw Error("Unknown Error")
            }
            if((bgsurface.isInTaskPage()) || bgsurface.isInHolidayFrame())  {
                let view = new TaskView()
                if(bgsurface.isInHolidayFrame()) {
                    await view.setSceneId();
                }
                bodycomponent = await view.surfaceComponent();
            } else if(bgsurface.isInCoursePage() && bgsurface.isInMainFrame()) {
                let view = new FinishCourseView();
                bodycomponent = await view.surfaceComponent();
            } else if(bgsurface.isOnPractisePage()) {
                let view = new HomeworkView();
                bodycomponent = await view.surfaceComponent();
            } else {
                let view = WindowSurface.NoPage();
                bodycomponent = view
            }
            bgsurface.renderWindow(nav,bodycomponent);
        } catch(e) {
            bgsurface.insertErrorMsg(loading,e)
        }
    }
}


(() => {
    startup();
})()