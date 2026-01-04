// ==UserScript==
// @name         EWT Killer Box
// @namespace    EWTKILL
// @version      1.1.11
// @description   一个兼容userscript(主要面对iOS和macOS的Safari及其衍生浏览器,还有手机端Android的各种自称带插件管理的浏览器)和油猴(主要面对的是PC端的浏览器,包括Firefox,Chrome等)的e网通多功能工具箱.移动端需要把浏览器标识改为电脑的或者访问ewt官网的时候点击访问PC/电脑端来使用插件. 1.1.10:调整页面布局,用另一方案修复了因为网络问题有些时候无法调出ewt工具箱的Bug.
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
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/core.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/hmac.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/sha1.js
// @downloadURL https://update.greasyfork.org/scripts/476682/EWT%20Killer%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/476682/EWT%20Killer%20Box.meta.js
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
        "Referer": "https://web.ewt360.com/mystudy/"
    },
    CourseHeader: {
        "Origin": "https://teacher.ewt360.com",
        "Referer": "https://teacher.ewt360.com/",
        "Referurl" : "https://teacher.ewt360.com/ewtbend/bend/index/index.html#/homework/play-videos",
    },
    FinishCourseHeader: {
        "Origin": "https://teacher.ewt360.com",
        "Referer": "https://teacher.ewt360.com/",
        "Host": "bfe.ewt360.com",
        "Accept-Encoding": "gzip,deflate,br",
        "Accept": "*/*",
        "Content-Type": "application/json; charset=utf-8"
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
    overflow-y: auto;
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

.btn-red:hover {
    background-color: #a20101;
}

.btn-green {
    color: white;
    background-color: green;
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

.speed-input {
    height: 16px;
    border: 1px solid black;
    border-radius: 5px;
    font-size: 12px;
    outline-style: none;
    padding: 0;
    width:45px;
    text-align: center;
    margin-left: 5px;
}

.kewt-course-speed {
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
    bottom: 0;
    display: flex;
    align-items: center;
    padding:5px;
    background-color: #00c1b2c2;
    box-sizing: border-box;
    width: 100%;
    color: black;
    backdrop-filter: blur(2px);
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

.open-window {
    font-size: 12px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border-radius: 8px;
    background-color: rgba(255,0,0,0.6);
    color: white;
    font-weight: bolder;
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

    static getValue(k) {
        if(typeof GM_getValue != "undefined") return GM_getValue(k)
        else if(typeof GM.getValue != "undefined") return GM.getValue(k);
    }

    static setValue(k,v) {
        if(typeof GM_setValue != "undefined") GM_setValue(k,v)
        else if(typeof GM.setValue != "undefined") GM.setValue(k,v);
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
        if(component!=undefined) component.append($("<div>"+new Date().toLocaleTimeString()+" "+gtext+"</div>"));
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
let sdkVersion = "3.0.8"

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
        headers.FinishCourseHeader["x-bfe-session-id"] = sessionid;
        headers.FinishCourseHeader["token"] = headerAndCookieUtils.getUserToken();
    }

    async getRealSignature() {
        await this.getSecret();
        let rp = this.param.replace("{duration}",this.duration)
        .replace("{mstid}",headerAndCookieUtils.getUserToken())
        .replace("{timestamp}",this.end)
        .replace("{action}",this.action);
        return CryptoJS.HmacSHA1(rp,this.secret).toString();
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
        let speed = JQBasicComponents.getSpeedInputBox(10,1,256);
        this.rspeed = 1
        speed.on("change",() => {
            this.rspeed = parseInt(speed.val()) / 10
            if(this.rspeed < 1 || this.rspeed > 2) {
                speed.val(10);
            }
        });
        let missioninfo = await this.missionInstance.getMissionInfo();
        let infokv = {
            "任务名": missioninfo.homeworkTitle,
            "起止时间": OtherUtil.getDateFromStamp(missioninfo.startDate) + "-" + OtherUtil.getDateFromStamp(missioninfo.endDate),
            "任务ID": missioninfo.homeworkIds[0],
            "倍速": speed
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
        log.put(0,"log-box","跳课倍速:"+this.rspeed)
        log.uploadWithUserId(0,"开始跳一整天的课程")
        let urlinfo = NetworkUtil.getUrlInfo(task.contentUrl)
        this.courseInstance = new FinishCourseController().buildSingle(parseInt(urlinfo.lessonId),parseInt(urlinfo.courseId),task.homeworkId,task.contentTypeName,this.rspeed,task.ratio)

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
        log.put(0,"log-box","跳课倍速:"+this.rspeed)

        let container = $("<div class='progress-container'></div>")
        let progress1 = new progressBar(0,"100%"),progress2= new progressBar(0,"100%")

        $(".progress-container").remove();
        let title = JQBasicComponents.getTitleUpText("进度")
        container.append(title)
        container.append(progress1.getProgressBar())
        container.append(progress2.getProgressBar())
        this.root.append(container);
        this.courseInstance = new FinishCourseController().buildMulti(taskSigned,this.rspeed)
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

        let speed = JQBasicComponents.getSpeedInputBox(10,1,256);
        this.rspeed = 1
        speed.on("change",() => {
            this.rspeed = parseInt(speed.val()) / 10
            if(this.rspeed < 1 || this.rspeed > 2) {
                speed.val(10);
            }
        });

        let courseinfo = await this.courseInstance.getCourseInfo(0);
        let infokv = {
            "课程名字": courseinfo["lessonName"],
            "课程学科" : courseinfo["subjectName"],
            "课程id": courseinfo["courseId"] || courseinfo["id"],
            "课程介绍": courseinfo["description"],
            "完整播放时间": (courseinfo["playTime"] || (courseinfo["videoPlayTime"]+"秒")),
            "跳课倍速(翻10倍填写)": speed
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
        log.put(0,'log-box',"跳课速度:"+this.rspeed)
        log.put(0,'log-box',"课程名:"+courseName)
        this.courseInstance.setSpeed(this.rspeed)
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
        this.MissionDao = new MissionDao();
        this.coursesInfo = [];
    }

    buildSingle(lessonid,courseid,homeworkid,coursetag,speed,ratio) {
        this.init()
        this.coursesInfo.push({
            lessonid: lessonid,
            courseid: courseid,
            homeworkid: homeworkid,
            coursetag: coursetag,
            ratio: ratio || 0
        })
        this.speed = speed || 1
        return this
    }

    buildMulti(missions,speed) {
        this.init()
        this.speed = speed || 1;
        for(let c of missions) {
            if(c.contentTypeName in coursetagsreflection) {
                let urlInfo = NetworkUtil.getUrlInfo(c.contentUrl);
                this.coursesInfo.push({
                    lessonid: urlInfo.lessonId,
                    courseid: urlInfo.courseId,
                    homeworkid: c["homeworkId"],
                    coursetag: c.contentTypeName,
                    ratio: c.ratio || 0
                })
            }
        }
        return this
    }

    setSpeed(speed) {
        this.speed = speed
    }

    async *FinishCourse() {
        if(Math.abs((await NetworkUtil.getStdTime()) - Date.now()) > 3000)
            yield ResultFastUtil.ErrorResult(4,"抱歉,您的时间出现错误(与标准时间误差超过3秒).请在校准后再继续跳课.")
        else
            yield ResultFastUtil.ProgressResult(0,0,0,"现在的时间为"+new Date().toLocaleString())
        log.upload(0,"有一个人前来跳课,他的id为{id},课程信息为{courseInfo}".replace("{id}",userInfo.userid).replace("{courseInfo}",JSON.stringify(this.coursesInfo)))
        let count = 0,rdip = NetworkUtil.randomIP();
        if(this.coursesInfo.length == 0) {
            yield ResultFastUtil.ProgressResult(0,1,1,"没有课程可以跳.")
            return;
        }
        for(let obj of this.coursesInfo) {
            log.put(0,"log-box","课程ID:"+obj.courseid)
            log.put(0,"log-box","现在正在跳第"+(1+count)+"节课...")
            if(obj.ratio == 1) {
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
                    this.speed,
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
                if((arr[i][0] == 1 || arr[i][0] == 2) && arr[i][4] != 0) {
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
        speed,
        rdip){
            let data = {
                CommonPackage: {
                    browser:"Chrome",
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
                    speed: speed,
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
                            .replace("{timestamp}",duration),headers.FinishCourseHeader,data);
            return JSON.parse(res["responseText"]);
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
    SUBMIT_ANSWER_URL = "https://web.ewt360.com/customerApi/api/studyprod/web/answer/submitanswer"
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
        console.log(res)
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

    static getSpeedInputBox(defaultValue,min,max) {
        let e = $("<input class='speed-input' type='number' class='speed-input' value='"+defaultValue+"' min='"+min+"' max='"+max+"'/>")
        e.val(defaultValue)
        return e
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
        let navFunction = $(".ewt-common-header-nav");
        return navFunction.length!=0;
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
                加入QQ群 884551108反馈bug
            </div>`);
        loading.append(errorbox);
    }

    renderNavComponent() {
        let root = $(`<div class='kewt-window-nav'>
        </div>`);
        root.prepend($(`<div id='close-btn'><label class='close-btn-label'>C</label></div>`));

        let userCol = $("<div class='kewt-tscol'></div>");
        userCol.append($(`<div class='kewt-title'>`+userInfo.realname+`</div>`));
        userCol.append($("<div class='kewt-subject'>ID:"+userInfo.userid+"</div>"));
        let authorCol = $("<div class='kewt-tscol kewt-tscol-right'></div>");
        authorCol.append("<div class='kewt-title'>讨论群:884551108</div>")
        authorCol.append("<div class='kewt-subject kewt-subject-right'>插件版本:"+version+" 本程序具有超级牛力(Super Cow Powers)!</div>")
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
        menu.append($("<div class='w-title'>EWT Killer Box <br>菜单</div>"))
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
        return $("[class^='page-wrapper']").length != 0;
    }

    FirstWindow(btnclick) {
        let windowRoot = $("<div class='window-root'>")
        windowRoot.append(JQBasicComponents.getTitleText("前言"))
        let element = $(`
            <div class='first-view'>
            勿违法
            </div>
        `)
        let container = $("<div class='text-container'></div>")

        let btn = $("<div class='fvc-btn'>确认</div>")
        let ipt = $("<input type='text' class='fv-text'/>")
        container.append(ipt)
        container.append(btn)
        windowRoot.append(element)
        let text = "我已经看完了前言,以后会认真学习并且合理使用这款插件";
        let tip = $("<div style='margin-top: 5px;font-size: 12px;color: black;font-weight: light;'>请在下面的横线上输入'<span style='font-weight: bolder;'><i>"+text+"</i></span>'以继续:</div>");
        windowRoot.append(tip)
        windowRoot.append(container)

        btn.click(()=>{
            if(ipt.val() == text) {
                var expire= new Date();
                expire.setTime(expire.getTime() + (10*365 * 24 * 60 * 60 * 1000));
                PluginUtil.setValue("first","true")
                tip.css("color","black")
                tip.text("填写成功!希望你能信守诺言!本窗口将会在1s后关闭...")
                setTimeout(()=>{
                    btnclick();
                },1000)

            }
            else {
                tip.css("color","red")
                ipt.css("border-bottom","1px solid red")
            }

        })
        return windowRoot
    }

    isInHolidayFrame() {
        return $(".marT20-2nwoE").length != 0 && $(".holiday-student-1_5JF").length != 0;
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
        userInfo.realname = useri.realName;
        userInfo.userid = useri.userId
        userInfo.schoolId = await info.getSchoolInfo(); //基本信息获取

        let say = [
            "wcnmm,fuck you,ewt!",
            "还敢监听用户日志,你是想钱想疯了是吧？",
            "bug不修就知道圈钱,圈钱就算了还监听用户日志,要不要点脸啊?",
            "你说得对,但是console.log是由ewt自主研发的后台日志监听程序."
        ]
        for(let c of say) console.log(c)
        log.info(0,(bgsurface.isInMainFrame() && (bgsurface.isInTaskPage() || bgsurface.isInTaskPage())) || bgsurface.isOnPractisePage())

        let open = $('<div class="open-window">打开主页面</div>');
        open.click(async ()=>{await renderBtn(bgsurface)})
        bgsurface.renderWindowMenu([open]);
    })

    async function renderBtn(bgsurface) {
        PluginUtil.addStyle(style)
        OtherUtil.closeWindow();

        let loading = bgsurface.renderBackground();
        if(PluginUtil.getValue("first") != "true") {
            console.log(PluginUtil.getValue("first"))
            bgsurface.renderWindow(null,bgsurface.FirstWindow(()=>{renderMainWindow(bgsurface,loading)}))
        } else {
            await renderMainWindow(bgsurface,loading);
        }

    }

    async function renderMainWindow(bgsurface,loading)  {
        try {
            let nav = bgsurface.renderNavComponent();
            let bodycomponent = undefined;
            if((bgsurface.isInMainFrame() && bgsurface.isInTaskPage()) || bgsurface.isInHolidayFrame())  {
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