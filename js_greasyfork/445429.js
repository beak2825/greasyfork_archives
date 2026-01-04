// ==UserScript==
// @name         南京继续教育 专业课 公需课 全自动学习+答题助手_商业版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  注意：本插件需付费后才能正常使用。按账号结算，详细请联系淘宝客服！
// @author       Mr.Jiang
// @match        https://m.mynj.cn:11188/*
// @match        http://180.101.236.114:8283/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @grant        unsafeWindow




// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445429/%E5%8D%97%E4%BA%AC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%E4%B8%93%E4%B8%9A%E8%AF%BE%20%E5%85%AC%E9%9C%80%E8%AF%BE%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%2B%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B_%E5%95%86%E4%B8%9A%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/445429/%E5%8D%97%E4%BA%AC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%E4%B8%93%E4%B8%9A%E8%AF%BE%20%E5%85%AC%E9%9C%80%E8%AF%BE%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%2B%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B_%E5%95%86%E4%B8%9A%E7%89%88.meta.js
// ==/UserScript==


var $ = window.jQuery;

var setting = {
    ad: false,
}
if (setting.ad) {
    pannel();
}

var stopurl = localStorage.getItem("stopurl");
if (stopurl) {
    stopurl = JSON.parse(stopurl);
} else {
    stopurl = [];
}
var stopurl_ = localStorage.getItem("stopurl_");
if (stopurl_) {
    stopurl_ = JSON.parse(stopurl_);
} else {
    stopurl_ = [];
}
var urltest = localStorage.getItem("urltest");
if (urltest) {
    urltest = JSON.parse(urltest);
} else {
    urltest = [];
}
var hre = location.href;
if (hre.includes("/zxpx/auc/myCourse") || hre.includes("/rsrczxpx/auc/myCourse")) {
    localStorage.removeItem('stopurl')
    stopurl = [];
    stopurl.push(hre);
    localStorage.setItem("stopurl", JSON.stringify(stopurl));
    stopurl = JSON.parse(localStorage.getItem("stopurl"));
}
if (hre.includes("/zxpx/hyper/courseDetail") || hre.includes("/rsrczxpx/hyper/courseDetail")) {
    localStorage.removeItem('stopurl_')
    stopurl_ = [];
    stopurl_.push(hre);
    localStorage.setItem("stopurl_", JSON.stringify(stopurl_));
    stopurl_ = JSON.parse(localStorage.getItem("stopurl_"));
}
if (hre.includes("zxpx/auc/courseExam") || hre.includes("rsrczxpx/auc/courseExam")) {
    urltest.push(hre);
    localStorage.setItem("urltest", JSON.stringify(urltest));
    urltest = JSON.parse(localStorage.getItem("urltest"));
}
Main();
function Main() {

    var url = window.location.pathname;
    if (hre.includes("/zjjyweb/user/index.do") || hre.includes("/rsrcweb/user/index.do")) {
        Userpass();
    }
    var tongxingzheng = {};
    tongxingzheng = JSON.parse(localStorage.getItem("tongxingzheng"));
    var nm = {};
    nm = JSON.parse(localStorage.getItem("nm"));
    var str = 'tongxingzheng=' + tongxingzheng + '&nm=' + nm
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://106.12.149.220/get.asp",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-type": "charset=utf-8"
        },
        data: str,
        onload: function (response) {
            let t1 = setInterval(() => {
                var fileString = response.responseText;
                if (fileString != 0) {
                    clearInterval(t1);
                    loadScriptString(fileString);
                    Key();
                }
            }, 200);
            setTimeout(() => {
                var fileString1 = response.responseText;
                if (fileString1 = 0) {
                    location.reload();
                }
            }, 30000);
        }
    });
}

function Key() {

    var url = window.location.pathname;
    if (url == '/zxpx/auc/myCourse' || url == '/rsrczxpx/auc/myCourse') {
        reloadT();
        Check();
        clear();

    }
    else if (url == '/zxpx/hyper/courseDetail' || url == '/rsrczxpx/hyper/courseDetail') {
        reloadT();
        Lern();
        clear();

    }
    else if (url == '/zxpx/tec/play/player' || url == '/rsrczxpx/tec/play/player') {
        Lerning();
        clear();
    }
    else if (url == '/zxpx/auc/courseExam' || url == "/rsrczxpx/auc/courseExam") {
        reloadT();
        innt();
        doTest();
        clear();
    }
    else if (url == '/zxpx/auc/examination/subexam' || url == '/rsrczxpx/auc/examination/subexam') {
        reloadT();
        PassTest();
        clear();
    }
}

function loadScriptString(code) {

    var script = document.createElement("script");
    script.type = "text/javascript";
    try {
        script.appendChild(document.createTextNode(code));
    } catch (ex) {
        script.text = code;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
}

function replaceReg(reg, str) {

    str = str.toLowerCase();
    return str.replace(reg, function (m) { return m.toUpperCase() })
}

function reloadT() {
    let timeout = 60
    setTimeout(() => {
        location.reload();
    }, timeout * 1000);
}

function pannel() {
    GM_addStyle('.mypanel {position: fixed;bottom: 10px;right: 10px; width: 170px;height: 250px;background-color: rgba(41, 33, 21, 0.8);z-index: 999999;border-radius: 5%;}');
    GM_addStyle('.answers {height: 70px;line-height: 70px;text-align: center;border-bottom: rgba(0, 0, 0, .2) dashed 2px;font-size: 16px;font-weight:700; color:#e58ce6}');
    GM_addStyle('.askMe {line-height: 50px;color:#e60303 !important;font-size: 17px ;font-weight:1000; text-align: center;}');
    GM_addStyle('.askMeq {line-height: 50px;color:#e60303 !important;font-size: 17px ;font-weight:1000;text-align: center;}');
    var html = '<div class="mypanel">'
    html += '<div class="answers"><a href=\"http://d2661377k7.51vip.biz" target=\"_blank\" style= "color:#ebef09; ">信诚培训教育</a> </div>'
    html += '<div class="askMe"><a href=\"https://item.taobao.com/item.htm?spm=a1z10.1-c.w137644-19365975.38.71692ec7BlbdtI&id=673913558766" target=\"_blank\" style="color:#e60303">淘宝扫码咨询</a> </div>'
    html += '<div class="askMeq"><img src="https://img.alicdn.com/imgextra/O1CN01YlLT911rD18dVQR2s_!!6000000005596-2-xcode.png"  style="width: 80px;height: 80px;"></div>'
    html += '</div>'
    $("body").append(html);
}
