// ==UserScript==
// @name                蜜雪学习通助手｜超星学习通｜💯自动答题｜▶️自动刷课｜⚡一键操作｜✨字体解密｜📝最新题库自动更新）｜支持AI搜题｜🔔课桌通知
// @version             1.1.0
// @description         蜜雪学习通助手强大的浏览器脚本，旨在帮助用户更高效地完成超星学习通平台上的学习任务。本项目基于开源技术，使用ChatGPT智能引擎进行答题，蜜雪冰城官方题库。一键安装，一键使用，内置详细使用教程，课后测验，期末考试等，本脚本仅供个人研究学习使用，请勿用于非法用途，产生一切法律责任用户自行承担。具体的功能请查看脚本悬浮窗中的教程页面，群聊1：1031406829 群聊2：1030240109 蜜雪冰城官网题库 https://tk.mixuelo.cc/
// @author            
// @namespace           https://github.com/MiXue-Lo/MiXue-ChaoXing
// @license             MIT
// @supportURL          https://github.com/MiXue-Lo/MiXue-ChaoXing/issues
// @match               *://*.chaoxing.com/*
// @match               *://*.edu.cn/*
// @match               *://*.nbdlib.cn/*
// @match               *://*.uooc.net.cn/*
// @connect             tk.mixuelo.cc
// @connect             tk.mixuelo.cc
// @run-at              document-end
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_info
// @grant               GM_getResourceText
// @grant               GM_notification
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM_addStyle
// @icon                https://a.pengzi.cc/index/pengzi/images/思考2.gif
// @require          https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32
// @require  		 https://code.jquery.com/jquery-3.7.1.js5@0.8.3/src/md5.min.js
// @compatible          chrome 80以上版本
// @compatible          firefox 75以上版本
// @compatible          edge 最新版本
// @downloadURL https://update.greasyfork.org/scripts/533346/%E8%9C%9C%E9%9B%AA%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E2%96%B6%EF%B8%8F%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9C%E2%9A%A1%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%E2%9C%A8%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86%EF%BD%9C%F0%9F%93%9D%E6%9C%80%E6%96%B0%E9%A2%98%E5%BA%93%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%EF%BC%89%EF%BD%9C%E6%94%AF%E6%8C%81AI%E6%90%9C%E9%A2%98%EF%BD%9C%F0%9F%94%94%E8%AF%BE%E6%A1%8C%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/533346/%E8%9C%9C%E9%9B%AA%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E2%96%B6%EF%B8%8F%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9C%E2%9A%A1%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%E2%9C%A8%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86%EF%BD%9C%F0%9F%93%9D%E6%9C%80%E6%96%B0%E9%A2%98%E5%BA%93%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%EF%BC%89%EF%BD%9C%E6%94%AF%E6%8C%81AI%E6%90%9C%E9%A2%98%EF%BD%9C%F0%9F%94%94%E8%AF%BE%E6%A1%8C%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

// 定义API基础URL，方便统一管理和修改
const API_BASE_URL = (() => {
  // 确保API URL使用与当前页面相同的协议（避免混合内容问题）
  const baseUrl = "tk.mixuelo.cc/api.php";
  const protocol = window.location.protocol; // 当前页面的协议
  if (protocol === 'https:') {
    return "https://" + baseUrl;
  } else {
    return "http://" + baseUrl;
  }
})();

/*
 * 蜜雪学习通智能助手
 * 版本: 1.0.0
 * 
 * 功能特色:
 * 1. 智能AI答题系统 - 使用先进算法匹配选项
 * 2. 人工智能匹配 - 多种方式识别正确答案
 * 3. 桌面通知系统 - 任务完成提醒
 * 4. 自定义界面 - 可拖拽面板
 * 5. 优化的字体解密功能
 * 6. 支持大部分高校超星系统
 * 
 * 答题优先级说明:
 * 1. 系统首先尝试在题库中查找答案
 * 2. 若题库中未找到答案，根据设置尝试使用AI回答
 * 3. 若AI未开启或无法提供答案，会尝试随机答题(如已开启)
 * 4. 所有方法都失败时，将提示用户手动选择答案
 * 
 * 更新日志:
 * v1.0.0 - 首次发布
 * 
 * 项目主页: https://github.com/MiXue-Lo/MiXue-ChaoXing
 */

/*********************************自定义配置区******************************************************** */
var setting = {
  // 基础界面设置
  showBox: 1,             // 显示脚本浮窗，0为关闭，1为开启
  darkMode: 0,            // 深色模式，0为关闭，1为开启
  panelPosition: 'right', // 控制面板位置，可选 'left', 'right'

  // 任务处理设置
  task: 0,                // 只处理任务点任务，0为关闭，1为开启
  taskInterval: 3000,     // 任务切换间隔时间，默认3秒

  // 媒体处理设置
  video: 1,               // 处理视频，0为关闭，1为开启
  audio: 1,               // 处理音频，0为关闭，1为开启
  rate: 1,                // 视频/音频倍速，0为秒过，1为正常速率，最高16倍
  muteMedia: 0,           // 静音播放，0为关闭，1为开启
  review: 0,              // 复习模式，0为关闭，1为开启可以补挂视频时长

  // 答题设置
  work: 1,                // 测验自动处理，0为关闭，1为开启
  time: 1000,             // 答题时间间隔，默认1s=1000ms
  randomTime: 0,          // 随机答题时间，0为关闭，1为开启，在time基础上随机±500ms
  sub: 0,                 // 测验自动提交，0为关闭,1为开启
  force: 0,               // 测验强制提交，0为关闭，1为开启
  share: 0,               // 自动收录答案，0为关闭，1为开启
  decrypt: 1,             // 字体解密，0为关闭，1为开启

  // 考试设置
  examTurn: 0,            // 考试自动跳转下一题，0为关闭，1为开启
  examTurnTime: 0,        // 考试自动跳转下一题随机间隔时间(3-7s)之间，0为关闭，1为开启
  goodStudent: 1,         // 好学生模式,不自动选择答案,仅提示答案
  alterTitle: 1,          // 修改题目,将AI回复的答案插入题目中

  // AI设置
  aiMode: 'smart',        // AI模式: 'smart'-智能匹配, 'letter'-优先识别字母, 'content'-优先内容匹配
  aiConfidence: 80,       // AI匹配置信度，低于此值会提示可能不准确，范围0-100

  // 通知设置
  desktopNotify: 1,       // 桌面通知，0为关闭，1为开启
  soundNotify: 0,         // 声音通知，0为关闭，1为开启

  // 登录设置
  autoLogin: 0,           // 自动登录，0为关闭，1为开启
  phone: '',              // 登录手机号/超星号
  password: ''            // 登录密码
}
var Z = unsafeWindow, _ = location, Se = Z.document, i = Z.jQuery || top.jQuery, ye = ye || window.md5, F = Z.UE, oe = "", oe = "http://tk.mixuelo.cc", v, G, E, U, ie, H, pe = 0; const be = document.createElement("style"); be.textContent = `
    .gpt-box {
        position: fixed;
        top: 80px;  /* 调整为距离顶部更远，避免遮挡内容 */
        right: 10px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        padding: 15px;
        font-family: "Microsoft YaHei", sans-serif;
        transition: all 0.3s ease;
        animation: slideIn 0.5s ease;
    }
    
    /* 拖动条样式 */
    .gpt-box-header {
        cursor: move;
        padding: 5px 0;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .gpt-box-title {
        font-weight: bold;
        color: #FC3A72;
    }
    
    .gpt-box-actions {
        display: flex;
        gap: 8px;
    }
    
    .gpt-box-actions button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 12px;
        color: #888;
        padding: 2px 5px;
        border-radius: 3px;
    }
    
    .gpt-box-actions button:hover {
        background: #f5f5f5;
        color: #FC3A72;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .gpt-box:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    .gpt-box::-webkit-scrollbar {
        width: 6px;
    }
    .gpt-box::-webkit-scrollbar-thumb {
        background: #FC3A72;
        border-radius: 3px;
    }
    .gpt-message {
        margin: 8px 0;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-all;
    }
    .gpt-message.pink {
        background: #fce4ec;
        color: #e91e63;
        border-left: 4px solid #e91e63;
    }
    .gpt-message.orange {
        background: #fff3e0;
        color: #ff9800;
        border-left: 4px solid #ff9800;
    }
    .gpt-message.red {
        background: #ffebee;
        color: #f44336;
        border-left: 4px solid #f44336;
    }
    .gpt-message.purple {
        background: #f3e5f5;
        color: #9c27b0;
        border-left: 4px solid #9c27b0;
    }
    .gpt-message.green {
        background: #e8f5e9;
        color: #4caf50;
        border-left: 4px solid #4caf50;
    }
    .gpt-message.blue {
        background: #e3f2fd;
        color: #2196f3;
        border-left: 4px solid #2196f3;
    }
    .gpt-messages-container {
        max-height: 350px;
        overflow-y: auto;
    }
`; document.head.appendChild(be); function n(e, t = "black") { var d; let r = document.querySelector(".gpt-box"); if (!r) { r = document.createElement("div"), r.className = "gpt-box", r.style.position = "fixed", r.style.top = "80px", r.style.right = "10px", r.style.zIndex = "9999"; const f = document.createElement("div"); f.className = "gpt-box-header"; const m = document.createElement("div"); m.className = "gpt-box-title", m.textContent = "蜜雪助手"; const g = document.createElement("div"); g.className = "gpt-box-actions"; const b = document.createElement("button"); b.textContent = "清空", b.title = "清空日志", b.onclick = function () { const p = document.querySelector(".gpt-messages-container"); p && (p.innerHTML = "", n("日志已清空", "green")) }; const y = document.createElement("button"); y.textContent = "隐藏", y.title = "隐藏面板", y.onclick = function () { r.style.display = "none", localStorage.setItem("GPTJsSetting.hideGptBox", "true") }, g.appendChild(b), g.appendChild(y), f.appendChild(m), f.appendChild(g); const h = document.createElement("div"); h.className = "gpt-messages-container", r.appendChild(f), r.appendChild(h), localStorage.getItem("GPTJsSetting.hideGptBox") === "true" && (r.style.display = "none"), document.body.appendChild(r); let l = !1, u, c; f.addEventListener("mousedown", function (p) { l = !0, u = p.clientX - r.getBoundingClientRect().left, c = p.clientY - r.getBoundingClientRect().top, r.style.transition = "none" }), document.addEventListener("mousemove", function (p) { if (l) { const x = p.clientX - u, k = p.clientY - c, S = window.innerWidth - r.offsetWidth, w = window.innerHeight - r.offsetHeight; r.style.left = Math.max(0, Math.min(x, S)) + "px", r.style.top = Math.max(0, Math.min(k, w)) + "px", r.style.right = "auto" } }), document.addEventListener("mouseup", function () { l && (l = !1, r.style.transition = "all 0.3s ease") }) } let s = e; if (e.includes("发送请求数据:")) try { const f = e.substring(e.indexOf("{")), m = JSON.parse(f), g = m.model, b = ((d = m.messages.find(y => y.role === "user")) == null ? void 0 : d.content) || ""; s = `发送请求：使用模型 ${g}，问题："${b.substring(0, 50)}${b.length > 50 ? "..." : ""}"` } catch { } else if (e.includes("收到响应:")) try { const f = e.substring(e.indexOf("{"), e.lastIndexOf("}") + 1), m = JSON.parse(f); m.code === 200 ? s = "收到响应：请求成功，服务器状态正常" : s = `收到响应：${m.msg || "服务器返回未知状态"}` } catch { s = "收到服务器响应" } const o = document.createElement("div"); o.className = `gpt-message ${t}`, o.innerHTML = s; const a = r.querySelector(".gpt-messages-container") || r; a.appendChild(o), a.scrollTop = a.scrollHeight } window.onload = function () { localStorage.getItem("GPTJsSetting.showBox") == "hide" ? (i("#ne-21box").css("display", "none"), i("#ne-21box").css("opacity", "0")) : (i("#ne-21box").css("display", "block"), i("#ne-21box").css("opacity", "1")); const e = i("#modelSelect"); e.on("change", function () { const r = e.val(); localStorage.setItem("GPTJsSetting.model", r) }); const t = localStorage.getItem("GPTJsSetting.model"); t && e.val(t), ve() }; function ve() { setTimeout(function () { const e = document.getElementById("ne-21box"); e && (e.addEventListener("mouseover", function () { this.style.boxShadow = "0 12px 42px 0 rgba(31, 38, 135, 0.5)" }), e.addEventListener("mouseout", function () { this.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }), (!e.style.left || e.style.left === "") && (e.style.right = "auto", e.style.left = "20px", e.style.top = "20px")) }, 1500) } i(document).keydown(function (e) { e.keyCode == 120 && i("#ne-21notice")[0] != null && (localStorage.getItem("GPTJsSetting.showBox") == "hide" ? (i("#ne-21box").css("display", show = "block"), i("#ne-21box").css("opacity", "1"), localStorage.setItem("GPTJsSetting.showBox", "show")) : (i("#ne-21box").css("display", show = "none"), localStorage.setItem("GPTJsSetting.showBox", "hide"))) }); i(".navshow").find("a:contains(体验新版)")[0] && i(".navshow").find("a:contains(体验新版)")[0].click(); setting.decrypt && Ze(); if (!(_.hostname == "i.mooc.chaoxing.com" || _.hostname == "i.chaoxing.com")) if (_.pathname == "/login" && setting.autoLogin) $(), setTimeout(() => { Ee() }, 3e3); else if (_.pathname.includes("/mycourse/studentstudy")) $(), i("#ne-21log", window.parent.document).html("初始化完毕！"); else if (_.pathname.includes("/knowledge/cards")) { var Y = Ge(); Y == null || Y == "$mArg" || i.parseJSON(Y).attachments.length <= 0 ? (n("无任务点可处理，即将跳转页面", "red"), X()) : setTimeout(() => { top.checkJob && (top.checkJob = () => !1), E = [], v = i.parseJSON(Y).attachments, G = i.parseJSON(Y).defaults, i.each(i(".wrap .ans-cc .ans-attach-ct"), (e, t) => { E.push(i(t).find("iframe")) }), O() }, 3e3) } else _.pathname.includes("/exam/test/reVersionTestStartNew") ? ($(), setTimeout(() => { qe() }, 3e3)) : _.pathname.includes("/exam/test/reVersionPaperMarkContentNew") ? setting.share && ($(), setTimeout(() => { je() }, 3e3)) : _.pathname.includes("/mooc2/work/dowork") ? ($(), setTimeout(() => { $e() }, 3e3)) : _.pathname.includes("/mooc2/work/view") ? setting.share && ($(), setTimeout(() => { Ne() }, 3e3)) : _.pathname.includes("/work/phone/doHomeWork") ? (_oldal = Z.alert, Z.alert = function (e) { if (e != "保存成功") return _oldal(e) }, _oldcf = Z.confirm, Z.confirm = function (e) { return e.includes("确认提交") || e.includes("未做完") ? !0 : _oldcf(e) }) : _.pathname.includes("/mooc2/exam/exam-list") || _.pathname == "/mycourse/stu" && Ie(); function Ie() { var e = navigator.userAgent; e.indexOf("Chrome") == -1 || GM_info.scriptHandler != "ScriptCat" } function _e(e) { return _url = e.replace(/^http:/, "https:"), _url } function Ae() { let t = window.location.search.substring(1).split("&"), r = {}; for (let s = 0; s < t.length; s++) { let o = t[s].split("="); r[o[0]] = o[1] } return r } function me(e) { for (var t = new Date().getTime(), r = t + e; ;)if (new Date().getTime() > r) return } var R = document.getElementById("moreSettingsBtn"), le = document.getElementById("moreSettings"), ce = document.getElementById("userInfo"), q = !1; R.addEventListener("click", function () { ce.style.display = q ? "block" : "none", le.style.display = q ? "none" : "block", de.style.display = "none", ue.style.display = "none", R.textContent = q ? "设置" : "返回", q && (W.textContent = "AI功能", L.textContent = "教程"), q = !q, j = !1, M = !1 }); var W = document.getElementById("newFeatureBtn"), de = document.getElementById("newFeaturePanel"), j = !1; W.addEventListener("click", function () { ce.style.display = j ? "block" : "none", de.style.display = j ? "none" : "block", le.style.display = "none", ue.style.display = "none", W.textContent = j ? "AI功能" : "返回", j && (R.textContent = "设置", L.textContent = "教程"), j = !j, q = !1, M = !1 }); var L = document.getElementById("tutorialBtn"), ue = document.getElementById("tutorialPanel"), M = !1; L.addEventListener("click", function () { ce.style.display = M ? "block" : "none", ue.style.display = M ? "none" : "block", le.style.display = "none", de.style.display = "none", L.textContent = M ? "教程" : "返回", M && (R.textContent = "设置", W.textContent = "AI功能"), M = !M, q = !1, j = !1 });["sub", "force", "examTurn", "goodStudent", "alterTitle", "hideGptBox", "notification", "skipTest", "useAI", "randomAnswer", "useTiku"].forEach(function (e) { var t = document.getElementById("GPTJsSetting." + e); t.addEventListener("change", Pe), t.checked = localStorage.getItem("GPTJsSetting." + e) === "true", localStorage.getItem("GPTJsSetting." + e) === null && (e === "sub" ? (localStorage.setItem("GPTJsSetting." + e, setting.sub ? "true" : "false"), t.checked = setting.sub === 1) : e === "force" ? (localStorage.setItem("GPTJsSetting." + e, setting.force ? "true" : "false"), t.checked = setting.force === 1) : e === "alterTitle" ? localStorage.setItem("GPTJsSetting." + e, "true") : e === "hideGptBox" ? localStorage.setItem("GPTJsSetting." + e, "false") : e === "notification" ? localStorage.setItem("GPTJsSetting." + e, "true") : e === "skipTest" || e === "useAI" || e === "randomAnswer" ? localStorage.setItem("GPTJsSetting." + e, "false") : e === "useTiku" && localStorage.setItem("GPTJsSetting." + e, "true")), e === "hideGptBox" && t.checked && document.querySelectorAll(".gpt-box").forEach(s => { s.style.display = "none" }) }); function Pe(e) { var t = e.target; localStorage.setItem(t.id, t.checked), t.id === "GPTJsSetting.hideGptBox" && document.querySelectorAll(".gpt-box").forEach(s => { s.style.display = t.checked ? "none" : "block" }) } const V = document.getElementById("GPTJsSetting.model"); if (V) { const e = localStorage.getItem("GPTJsSetting.model"); e ? V.value = e : localStorage.setItem("GPTJsSetting.model", V.value), V.addEventListener("change", function () { localStorage.setItem("GPTJsSetting.model", this.value), n("AI模型已更改为: " + this.value, "#1890ff") }) } const Q = document.getElementById("GPTJsSetting.model"); if (Q) { const e = localStorage.getItem("GPTJsSetting.model"); e ? Q.value = e : localStorage.setItem("GPTJsSetting.model", Q.value), Q.addEventListener("change", function () { localStorage.setItem("GPTJsSetting.model", this.value), n("AI模型已更改为: " + this.value, "#1890ff") }) } function $() {
    const e = document.querySelector(".gpt-box"); if (e && (e.style.display = e.style.display === "none" ? "block" : "none"), setting.showBox && top.document.querySelector("#ne-21notice") == null) {
        var t = `<div id="ne-21box" style="box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            opacity: 1;
            width: 330px;
            position: fixed;
            top: 20px;
            left: 20px;
            right: auto;
            z-index: 99999;
            overflow-x: auto;
            display: block;
            border-radius: 10px;
            cursor: move;
            user-select: none;
            transition: box-shadow 0.3s ease;">
            <div class="ne-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              padding: 10px;
                background: rgba(255, 255, 255, 0.75);
                border-radius: 10px 10px 0 0;
                border-bottom: 2px solid #e8eaf6;">
                
                <div class="ne-title" style="
                    display: flex;
                    align-items: center;
                    gap: 10px;">
                    <img src="https://a.pengzi.cc/index/pengzi/images/思考2.gif" style="width: 24px; height: 24px;">
                  
                    <h3 style="
                        margin: 0;
                        color: #56cabf;
                        font-size: 18px;
                        font-weight: 600;
                        font-family: 'Microsoft YaHei', sans-serif;">
                        蜜雪学习通助手
                    </h3>
                </div>
                
                <div id="ne-21close" style="
                    color: #9fa8da;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                    background: #e8eaf6;
                    font-weight: 500;"
                    onmouseover="this.style.background='#c5cae9'"
                    onmouseout="this.style.background='#e8eaf6'"
                    title="按F9键即可恢复面板">
                    F9显隐面板
                </div>
            </div>
            <div style="padding: 10px;">
            
            <div id="ne-21notice" style="
                margin: 10px 0;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.5;"></div>

            <div id="userInfo" style="
                margin: 10px 0;
                padding: 10px;
                background: #e3f2fd;
                border-radius: 8px;
                font-size: 14px;
                color: #1976d2;"></div>

            <div id="moreSettings" style="
                display: none;
                margin: 10px 0;
                padding: 15px;
                background: #fafafa;
                border-radius: 8px;">
                
                <div style="margin-bottom: 15px;">
                    <div style="margin-bottom: 10px;">
                        <label for="GPTJsSetting.key" style="color: #555;">Key:</label>
                        <input type="text" id="GPTJsSetting.key" style="
                            width: 200px;
                            padding: 5px;
                            border: 1px solid #ddd;
                            border-radius: 4px;">
                        <button id="saveKeyBtn" style="
                            margin-left: 10px;
                            padding: 5px 10px;
                            background-color: #FC3D74;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            ">
                            保存
                        </button>
                        <div id="saveKeyMsg" style="
                            margin-top: 8px;
                            padding: 6px 10px;
                            border-radius: 4px;
                            font-size: 13px;
                            color: white;
                            background-color: #FC3A72;
                            display: none;
                            opacity: 0;
                            transform: translateY(-10px);
                            transition: all 0.3s ease;
                        "></div>
                    </div>
                </div>

                <div style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    font-size: 14px;">
                    <div>
                        <input type="checkbox" id="GPTJsSetting.sub">
                        <label for="GPTJsSetting.sub">测验自动提交</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.force">
                        <label for="GPTJsSetting.force">测验强制提交</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.hideGptBox">
                        <label for="GPTJsSetting.hideGptBox">隐藏答案盒子</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.examTurn">
                        <label for="GPTJsSetting.examTurn">考试自动跳转</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.goodStudent">
                        <label for="GPTJsSetting.goodStudent">答案加粗不选择</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.alterTitle" checked>
                        <label for="GPTJsSetting.alterTitle">答案插入题目后</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.notification" checked>
                        <label for="GPTJsSetting.notification">桌面通知</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.skipTest">
                        <label for="GPTJsSetting.skipTest">不做测验</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.useAI">
                        <label for="GPTJsSetting.useAI">AI自动答题</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.randomAnswer">
                        <label for="GPTJsSetting.randomAnswer">随机答题</label>
                    </div>
                    <div>
                        <input type="checkbox" id="GPTJsSetting.useTiku" checked>
                        <label for="GPTJsSetting.useTiku">题库答题</label>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px;">
                <label for="GPTJsSetting.model" style="color: #555;">AI模型:</label>
                <select id="GPTJsSetting.model" style="
                    width: 200px;
                    padding: 5px;
                    border: 1px solid #ddd;
                    border-radius: 4px;">
                    <option value="gpt-3.5-turbo-16k">GPT-3.5-Turbo</option>
                    <option value="gpt-4o-mini">GPT-4o-Mini</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="deepseek-chat">DeepSeek</option>
                    <option value="glm-4-flash">智谱GLM-4</option>
                </select>
            </div>

            <!-- 新增功能面板 -->
            <div id="newFeaturePanel" style="
                display: none;
                margin: 10px 0;
                padding: 15px;
                background: #fff0f6;
                border-radius: 8px;">
                
                <h4 style="
                    margin-top: 0;
                    color: #fc3d74;
                    border-bottom: 1px solid #ffd6e7;
                    padding-bottom: 8px;
                ">
                    AI 助手
                </h4>
                
                <div style="margin-bottom: 12px;">
                    <div style="color: #555; font-size: 13px; margin-bottom: 5px;">选择模型：</div>
                    <select style="width: 100%; border: 1px solid #ffadd2; border-radius: 4px; padding: 6px; font-size: 14px;" id="modelSelect">
                        <option value="gpt-3.5-turbo-16k">GPT-3.5-Turbo (经济实用)</option>
                        <option value="deepseek-chat">DeepSeek-Chat (推荐)</option>
                        <option value="gpt-4o-mini">GPT-4o-Mini (高性价比)</option>
                        <option value="gpt-4">GPT-4 (高精度)</option>
                        <option value="glm-4-flash">GLM-4-Flash (速度优先)</option>
                    </select>
                </div>
                
                <div class="ai-question-section" style="margin-bottom: 10px;">
                    <div style="color: #555; font-size: 13px; margin-bottom: 5px;">输入问题：</div>
                    <textarea id="ai-question" style="
                        width: 95%;
                        min-height: 60px;
                        padding: 8px;
                        border: 1px solid #ffadd2;
                        border-radius: 4px;
                        resize: vertical;
                        font-size: 14px;
                        background-color: #fff;
                        color: #333;
                        margin-bottom: 8px;
                    "></textarea>
                    <div style="display: flex; justify-content: flex-end;">
                        <button id="ai-send-btn" style="
                            padding: 6px 12px;
                            background-color: #FC3D74;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        ">获取答案</button>
                    </div>
                </div>
                
                <div class="ai-answer-section">
                    <div style="
                        color: #555; 
                        font-size: 13px; 
                        margin-bottom: 5px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span>AI 回答：</span>
                        <button id="ai-copy-btn" style="
                            padding: 3px 8px;
                            background-color: #722ed1;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">复制答案</button>
                    </div>
                    <div id="ai-answer" style="
                       
                        min-height: 100px;
                        max-height: 250px;
                        padding: 10px;
                        border: 1px solid #d3adf7;
                        border-radius: 4px;
                        background-color: #f9f0ff;
                        overflow-y: auto;
                        font-size: 14px;
                        line-height: 1.5;
                        color: #333;
                        margin-bottom: 10px;
                    ">AI 助手已准备就绪，请输入您的问题...</div>
                    
                    <!-- 添加日志控制按钮 -->
                    <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <button id="ai-log-toggle" style="
                            padding: 6px 12px;
                            background-color: #8c8c8c;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        ">显示日志</button>
                        <span style="font-size: 12px; color: #888;">控制日志窗口显示/隐藏</span>
                    </div>
                </div>
            </div>

            <!-- 添加教程面板 -->
            <div id="tutorialPanel" style="
                display: none;
                margin: 10px 0;
                padding: 15px;
                background: #e6f7f5;
                border-radius: 8px;">
                
                <!-- 使用教程部分 -->
                <div id="usageTutorial" style="display: none;">
                    <h4 style="
                        margin-top: 0;
                        color: #56CABF;
                        border-bottom: 1px solid #a8e6e0;
                        padding-bottom: 8px;
                    ">
                        脚本使用教程
                    </h4>
                    
                    <div style="margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #333;">
                        <p style="margin-bottom: 10px;"><strong>脚本功能完全免费，不存在付费情况，进入相应页面即可使用。</strong></p>
                        <p style="margin-bottom: 10px;">脚本没有开发自己的题库，而是接入了多个第三方题库，如需填写密钥，依次操作：[1] 点击标签页"答题" --> [2] 在文本框内填写 --> [3] 刷新</p>
                        <p style="margin-bottom: 10px; color: #ff4d4f;"><strong>注意事项：</strong></p>
                        <ul style="margin-left: 20px; color: #666;">
                            <li style="margin-bottom: 8px;">脚本出现相关问题，请在脚本反馈区反馈，或者私信作者修复。</li>
                            <li style="margin-bottom: 8px;">题库密钥请确认能够搜索到题目再获取，题库均为网络收集的第三方题库，出现任何问题与脚本无关。如果你是程序员，可以自行接入自己的题库，这里不提供任何教程，也不会回复任何询问，请自行查看源代码修改即可，不会改的绕道。</li>
                        </ul>
                    </div>
                </div>

                <!-- 协议部分 -->
                <div id="agreement" style="display: none;">
                    <h4 style="
                        margin-top: 0;
                        color: #56CABF;
                        border-bottom: 1px solid #a8e6e0;
                        padding-bottom: 8px;
                    ">
                        免责声明
                    </h4>
                    
                    <div style="margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #333;">
                        <p style="margin-bottom: 10px;">1、本脚本仅供学习和研究目的使用，并应在24小时内删除。脚本的使用不应违反任何法律法规及学术道德标准。</p>
                        <p style="margin-bottom: 10px;">2、用户在使用脚本时，必须遵守所有适用的法律法规。任何由于使用脚本而引起的违法行为或不当行为，其产生的一切后果由用户自行承担。</p>
                        <p style="margin-bottom: 10px;">3、开发者不对用户使用脚本所产生的任何直接或间接后果负责。用户应自行评估使用脚本的风险，并对任何可能的负面影响承担全责。</p>
                        <p style="margin-bottom: 10px;">4、本声明的目的在于提醒用户注意相关法律法规与风险，确保用户在明智、合法的前提下使用脚本。</p>
                        <p style="margin-bottom: 10px;">5、如用户在使用脚本的过程中有任何疑问，建议立即停止使用，并删除所有相关文件。</p>
                        <p style="margin-bottom: 10px;">6、本免责声明的最终解释权归脚本开发者所有。</p>
                    </div>
                </div>

                <!-- 切换按钮 -->
                <div style="display: flex; gap: 10px;">
                    <button onclick="document.getElementById('usageTutorial').style.display='block';document.getElementById('agreement').style.display='none';" 
                            style="padding: 5px 10px; background: #56CABF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        使用教程
                    </button>
                    <button onclick="document.getElementById('agreement').style.display='block';document.getElementById('usageTutorial').style.display='none';" 
                            style="padding: 5px 10px; background: #56CABF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        免责声明
                    </button>
                </div>
            </div>

            <div id="ne-21log" style="
                max-height: 200px;
                overflow-y: auto;
                margin-top: 10px;
                padding: 10px;
                background: #fff;
                border-radius: 8px;
                border: 1px solid #e0e0e0;"></div>
        </div>`; i(t).appendTo("body"), i("#ne-21close").click(function () { let o = i("#ne-21box").css("display"); i("#ne-21box").css("display", o == "block" ? "none" : "block"), o == "block" ? (i(".tiku-settings-btn").parent().css("display", "flex"), R.textContent = "设置", W.textContent = "AI功能", L.textContent = "教程", q = !1, j = !1, M = !1) : i(".tiku-settings-btn").parent().css("display", "none") }), i("#GPTJsSetting\\.key").val(localStorage.getItem("GPTJsSetting.key") || ""); const s = localStorage.getItem("GPTJsSetting.notification") !== "false"; i("#GPTJsSetting\\.notification").prop("checked", s), i("#GPTJsSetting\\.notification").change(function () { localStorage.setItem("GPTJsSetting.notification", this.checked); const o = document.getElementById("saveKeyMsg"); o.innerText = this.checked ? "桌面通知已开启" : "桌面通知已关闭", o.style.backgroundColor = this.checked ? "#4CAF50" : "#FF9800", o.style.display = "block", setTimeout(function () { o.style.opacity = "1", o.style.transform = "translateY(0)" }, 10), setTimeout(function () { o.style.opacity = "0", o.style.transform = "translateY(-10px)", setTimeout(function () { o.style.display = "none" }, 300) }, 3e3) }), i("#saveKeyBtn").click(function () { const o = i("#GPTJsSetting\\.key").val().trim(); if (!o) { const a = document.getElementById("saveKeyMsg"); a.innerText = "请输入Key！", a.style.backgroundColor = "#f44336", a.style.display = "block", setTimeout(function () { a.style.opacity = "1", a.style.transform = "translateY(0)" }, 10), J("请输入Key！", "请输入Key！", ""), setTimeout(function () { a.style.opacity = "0", a.style.transform = "translateY(-10px)", setTimeout(function () { a.style.display = "none" }, 300) }, 3e3); return } GM_xmlhttpRequest({ url: API_BASE_URL + "?act=verify_key", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: "key=" + encodeURIComponent(o), onload: function (a) { try { const d = JSON.parse(a.responseText), f = document.getElementById("saveKeyMsg"); d.code === 1 ? (localStorage.setItem("GPTJsSetting.key", o), localStorage.setItem("tiku_key", o), f.innerText = "API Key 保存成功！", f.style.backgroundColor = "#4CAF50", f.style.display = "block", setTimeout(function () { f.style.opacity = "1", f.style.transform = "translateY(0)" }, 10), J("API Key 保存成功！", "您的API Key已成功保存", "")) : (f.innerText = d.msg || "Key验证失败", f.style.backgroundColor = "#f44336", f.style.display = "block", setTimeout(function () { f.style.opacity = "1", f.style.transform = "translateY(0)" }, 10), J("Key验证失败", d.msg || "Key验证失败", "")), setTimeout(function () { f.style.opacity = "0", f.style.transform = "translateY(-10px)", setTimeout(function () { f.style.display = "none" }, 300) }, 3e3) } catch { alert("验证请求失败，请稍后重试") } }, onerror: function () { alert("验证请求失败，请检查网络连接") } }) })
    } else i("#ne-21log", window.parent.document).html(""); let r = ge("_uid") || ge("UID"); i("#ne-21notice").html(`<div>
    <div>&#24403;&#21069;&#23398;&#20064;&#36890;&#36134;&#21495;&#85;&#73;&#68;:`+ r + `</div>
     <div style="color: #56CABF; font-size: 12px; margin-top: 5px;">&#25346;&#26426;&#19981;&#26159;&#25366;&#30719;&#65292;&#25152;&#20197;&#19981;&#24314;&#35758;&#38271;&#26102;&#38388;&#26368;&#23567;&#21270;&#31383;</div>
    <a target="_blank" href="`+ oe + "?uid=" + r + `"><button
            style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color: #56CABF; border: none;"
            onmouseover="this.style.backgroundColor='#FC3D74'" onmouseout="this.style.backgroundColor='#3A8BFF'"
            onmousedown="this.style.backgroundColor='#3e8e41'"
            onmouseup="this.style.backgroundColor='#3A8BFF'">&#34588;&#38634;&#39064;&#24211;&#23448;&#32593;</button></a>
    <button id="moreSettingsBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color:rgb(64, 158, 255); border: none;transform: translateX(5px);">设置</button>
    <button id="newFeatureBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color:#FC3D74; border: none;transform: translateX(10px);">AI功能</button>
    <button id="tutorialBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color:#56CABF; border: none;transform: translateX(15px);">教程</button>
</div>`), GM_xmlhttpRequest({ method: "GET", url: oe + "/api/v1/auth?uid=" + r + "&v=" + GM_info.script.version, timeout: 1e4, onload: function (s) { if (s.status == 200) { var o = i.parseJSON(s.responseText) || {}, a = o.data.notice, d = o.data.score; if (i("#userInfo").html(a + "积分余额:" + d), o.data.models) { var f = i("#modelSelect").val(); i("#modelSelect").html(o.data.models), i("#modelSelect").val(f) } } }, ontimeout: function () { i("#userInfo").html("欢迎使用，获取服务器公告超时！") } })
} function re(e, t, r) { let s = e.match(new RegExp(`${t}(.*?)${r}`)); return s ? s[1] : null } function Ge() { try { var e = Se.scripts, t = null; for (let r = 0; r < e.length; r++)if (e[r].innerHTML.indexOf('mArg = "";') != -1 && e[r].innerHTML.indexOf("==UserScript==") == -1) return t = re(e[r].innerHTML.replace(/\s/g, ""), "try{mArg=", ";}catch"), t; return t } catch { return null } } function ge(e) { var t; return (t = document.cookie.match(`[;s+]?${e}=([^;]*)`)) == null ? void 0 : t.pop() } function Ee() { if (n("用户已设置自动登录", "green"), setting.phone.length <= 0 || setting.password.length <= 0) { n("用户未设置登录信息", "red"); return } setTimeout(() => { i("#phone").val(setting.phone), i("#pwd").val(setting.password), i("#loginBtn").click() }, 3e3) } function X() { Me().then(e => { if (setting.review || !setting.work) { setTimeout(() => { if (i("#ne-21log", window.parent.document).html(""), top.document.querySelector("#mainid > .prev_next.next") == null) { top.document.querySelector("#prevNextFocusNext").click(); return } top.document.querySelector("#mainid > .prev_next.next").click() }, 5e3); return } let t = []; i.each(i(e).find("li"), (o, a) => { let d = i(a).find(".posCatalog_select").attr("id"), f = i(a).find(".prevHoverTips").text(), m = i(a).find(".posCatalog_name").attr("title"); d.indexOf("cur") != -1 && t.push({ curid: d, status: f, name: m }) }); let r = i("#coursetree", window.parent.document).find(".posCatalog_active").attr("id"), s = t.findIndex(o => o.curid == r); for (s; s < t.length - 1; s++) { if (t[s].status.indexOf("待完成") != -1) { let a = top.document.querySelectorAll("#prev_tab li"), d = top.document.querySelector("#prev_tab li.active"); if (a && d && d.getAttribute("id").replace(/dct/, "") != a.length) { setTimeout(() => { if (i("#ne-21log", window.parent.document).html(""), top.document.querySelector("#mainid > .prev_next.next") == null) { top.document.querySelector("#prevNextFocusNext").click(); return } top.document.querySelector("#mainid > .prev_next.next").click() }, 5e3); return } } let o = t[s + 1]; if (o.status.indexOf("待完成") != -1) { J("准备切换下一个任务", `即将切换到: ${o.name}`, ""), setTimeout(() => { if (i("#ne-21log", window.parent.document).html(""), top.document.querySelector("#mainid > .prev_next.next") == null) { top.document.querySelector("#prevNextFocusNext").click(); return } top.document.querySelector("#mainid > .prev_next.next").click(), $() }, 5e3); return } else if (o.status.indexOf("闯关") != -1) { n("当前为闯关模式，存在未完成任务点，脚本已暂停运行，请手动完成并点击下一章节", "red"); return } else if (o.status.indexOf("开放") != -1) { n("章节未开放", "red"); return } } J("课程完成", "此课程所有任务点已处理完毕", ""), n("此课程处理完毕", "green") }) } function O() { try { if ($(), v.length <= 0) return J("任务点完成", "此页面所有任务点已处理完毕，准备跳转页面", ""), n("此页面任务处理完毕，准备跳转页面", "green"), X(); let e = v[0].type, t = E[0], r = v[0]; switch (e == null && (e = v[0].property.module), n("正在处理任务类型: " + e, "blue"), e) { case "video": if (v[0].property.module == "insertvideo") { n("开始处理视频", "purple"), Je(t, r); break } else if (v[0].property.module == "insertaudio") { n("开始处理音频", "purple"), Ce(t, r); break } else { n("未知类型任务，请联系作者，跳过", "red"), T(); break } case "workid": if (n("开始处理测验", "purple"), localStorage.getItem("GPTJsSetting.skipTest") === "true") return n("已设置不做测验，跳过测验任务", "orange"), X(); De(t, r); break; case "document": n("开始处理文档", "purple"), Oe(t, r); break; case "read": n("开始处理阅读", "purple"), ze(t, r); break; case "insertbook": n("开始处理读书", "purple"), Be(t, r); break; default: ["insertimage"].indexOf(e) != -1 ? (n("发现无需处理任务，跳过。", "red"), T()) : (n("暂不支持处理此类型:" + e + "，跳过。", "red"), T()) } } catch (e) { n("初始化任务系统出错: " + e, "red"); try { v && v.length > 0 && v.splice(0, 1), E && E.length > 0 && E.splice(0, 1), n("将在5秒后尝试继续执行任务系统", "orange"), setTimeout(() => { try { O() } catch (t) { n("无法恢复任务系统，请刷新页面: " + t, "red") } }, 5e3) } catch (t) { n("恢复过程失败，请刷新页面: " + t, "red") } } } function Ce(e, t) { if (!setting.audio) { n("用户设置不处理音频任务，准备开始下一个任务。", "red"); try { T() } catch (s) { n("音频任务切换失败: " + s, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } let r; if (setting.task ? (n("当前只处理任务点任务", "red"), t.jobid != null ? r = !0 : r = !1) : (n("当前默认处理所有任务（包括非任务点任务）", "red"), r = !0), r) { let s = G.clazzId, o = G.userid, a = G.fid, d = G.reportUrl, f = t.isPassed, m = t.otherInfo, g = t.property._jobid, b = t.property.name, y = t.property.objectid; if (setting.maskImg) { let h = i(e).attr("style"); i(e).contents().find("body").find(".main").attr("style", "visibility:hidden;"), i(e).contents().find("body").prepend('<img src="https://pic.521daigua.cn/bg.jpg!/format/webp" style="' + h + 'display:block;width:100%;"/>') } if (!setting.review && f == !0) { n("音频：" + b + "检测已完成，准备处理下一个任务", "green"), T(); return } else setting.review && n("已开启复习模式，开始处理音频：" + b, "pink"); i.ajax({ url: _.protocol + "//" + _.host + "/ananas/status/" + y + "?k=" + a + "&flag=normal&_dc=" + String(Math.round(new Date)), type: "GET", success: function (h) { try { let u = h.duration, c = h.dtoken, p = "0_" + u, x = 0, k = 3; var l = .9; setting.rate == 0 ? (n("已开启音频秒过，99.9%会导致进度重置、挂科等问题。", "red"), n("已开启音频秒过，请等待5秒！！！", "red")) : setting.rate > 1 && setting.rate <= 16 ? (n("已开启音频倍速，当前倍速：" + setting.rate + ",99.9%会导致进度重置、挂科等问题。", "red"), n("已开启音频倍速，进度40秒更新一次，请等待！", "red")) : setting.rate > 16 ? (setting.rate = 1, n("超过允许设置的最大倍数，已重置为1倍速。", "red")) : n("音频进度每隔40秒更新一次，请等待耐心等待...", "blue"), n("音频：" + b + "开始播放"), he(d, c, s, x, u, p, y, m, g, o, k, l).then(w => { switch (w) { case 1: n("音频：" + b + "已播放" + String(x / u * 100).slice(0, 4) + "%", "purple"), k = 0; break; case 3: l = 1; break; default: console.log(w) } }); let S = setInterval(() => { x += 40 * setting.rate, x >= u || setting.rate == 0 ? (clearInterval(S), x = u, k = 4) : (rt = x == 40 * setting.rate) ? k = 3 : k = 0, he(d, c, s, x, u, p, y, m, g, o, k, l).then(w => { switch (w) { case 0: x -= 40; break; case 1: n("音频：" + b + "已播放" + String(x / u * 100).slice(0, 4) + "%", "purple"); break; case 2: clearInterval(S), n("音频：" + b + "检测播放完毕，准备处理下一个任务。", "green"), T(); break; case 3: x -= 40, l = Number(l) == 1 ? .9 : 1; break; default: console.log(w) } }) }, setting.rate == 0 ? 5e3 : 4e4) } catch (u) { n("发生错误：" + u, "red") } } }) } else { n("用户设置只处理属于任务点的任务，准备处理下一个任务", "green"), T(); return } } function Je(e, t) { if (!setting.video) { n("用户设置不处理视频任务，准备开始下一个任务。", "red"); try { T() } catch (f) { n("视频任务切换失败: " + f, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } G.clazzId, G.userid, G.fid, G.reportUrl; let r = t.isPassed; t.otherInfo, t.property._jobid; let s = t.property.name; if (t.property.objectid, !setting.review && r == !0) { n("视频：" + s + "检测已完成，准备处理下一个任务", "green"), T(); return } const o = i("iframe").get(0), a = o.src, d = o.contentDocument; if (a.includes("video")) { n("发现一个视频，正在解析"); let f = !1; const m = setInterval(() => { const g = d.documentElement.querySelector("video"); if (g && !f) { if (n("播放成功"), !g) return; g.pause(), g.muted = !0, g.play(); const b = () => { me(2e3).then(() => { g.play() }) }; g.addEventListener("pause", b), g.addEventListener("ended", () => { n("视频已播放完成"), g.removeEventListener("pause", b), resolve() }), f = !0, clearInterval(m) } }, 2500) } else if (a.includes("audio")) { n("发现一个音频，正在解析"); let f = !1; const m = setInterval(() => { const g = d.documentElement.querySelector("audio"); if (g && !f) { if (n("播放成功"), !g) return; g.pause(), g.muted = !0, g.play(); const b = () => { me(2e3).then(() => { g.play() }) }; g.addEventListener("pause", b), g.addEventListener("ended", () => { n("音频已播放完成"), g.removeEventListener("pause", b), resolve() }), f = !0, clearInterval(m) } }, 2500) } } function Be(e, t) { if (setting.task && t.jobid == null) { n("当前只处理任务点任务,跳过", "red"); try { T() } catch (m) { n("书籍任务切换失败: " + m, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } let r = t.property.jobid, s = t.property.bookname, o = t.jtoken, a = G.knowledgeid, d = G.courseid, f = G.clazzId; if (t.job == null) { n("读书：" + s + "检测已完成，准备执行下一个任务。", "green"), T(); return } i.ajax({ url: _.protocol + "//" + _.host + "/ananas/job?jobid=" + r + "&knowledgeid=" + a + "&courseid=" + d + "&clazzid=" + f + "&jtoken=" + o + "&_dc=" + String(Math.round(new Date)), method: "GET", success: function (m) { m.status ? n("读书：" + s + m.msg + ",准备执行下一个任务。", "green") : n("读书：" + s + "处理异常,跳过。", "red"), T() } }) } function Oe(e, t) { if (setting.task && t.jobid == null) { n("当前只处理任务点任务,跳过", "red"), T(); return } let r = t.property.jobid, s = t.property.name, o = t.jtoken, a = G.knowledgeid, d = G.courseid, f = G.clazzId; if (t.job == null) { n("文档：" + s + "检测已完成，准备执行下一个任务。", "green"); try { T() } catch (m) { n("文档任务切换失败: " + m, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } i.ajax({ url: _.protocol + "//" + _.host + "/ananas/job/document?jobid=" + r + "&knowledgeid=" + a + "&courseid=" + d + "&clazzid=" + f + "&jtoken=" + o + "&_dc=" + String(Math.round(new Date)), method: "GET", success: function (m) { m.status ? n("文档：" + s + m.msg + ",准备执行下一个任务。", "green") : n("文档：" + s + "处理异常,跳过。", "red"); try { T() } catch (g) { n("文档任务切换失败: " + g, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } } }) } function ze(e, t) { if (setting.task && t.jobid == null) { n("当前只处理任务点任务,跳过", "red"); try { T() } catch (m) { n("阅读任务切换失败: " + m, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } let r = t.property.jobid, s = t.property.title, o = t.jtoken, a = G.knowledgeid, d = G.courseid, f = G.clazzId; if (t.job == null) { n("阅读：" + s + ",检测已完成，准备执行下一个任务。", "green"); try { T() } catch (m) { n("阅读任务切换失败: " + m, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } i.ajax({ url: _.protocol + "//" + _.host + "/ananas/job/readv2?jobid=" + r + "&knowledgeid=" + a + "&courseid=" + d + "&clazzid=" + f + "&jtoken=" + o + "&_dc=" + String(Math.round(new Date)), method: "GET", success: function (m) { m.status ? n("阅读：" + s + m.msg + ",准备执行下一个任务。", "green") : n("阅读：" + s + "处理异常,跳过。", "red"); try { T() } catch (g) { n("阅读任务切换失败: " + g, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } } }) } function De(e, t) { if (!setting.work) { n("用户设置不自动处理测验，准备处理下一个任务", "green"); try { T() } catch (o) { n("测验任务切换失败: " + o, "red"), setTimeout(() => { try { T() } catch { n("使用initializeTaskSystem作为备选", "orange"), setTimeout(O, 2e3) } }, 3e3) } return } let r; if (setting.task) if (n("当前只处理任务点任务", "red"), t.jobid != null) r = !0; else { r = !1; try { n("非任务点测验，跳过", "orange"), T() } catch (o) { n("任务切换失败: " + o, "red"), setTimeout(O, 3e3) } return } else n("当前默认处理所有任务（包括非任务点任务）", "red"), r = !0; if (r) if (t.jobid !== void 0) { var s = _.protocol + "//" + _.host + "/work/phone/work?workId=" + t.jobid.replace("work-", "") + "&courseId=" + G.courseid + "&clazzId=" + G.clazzId + "&knowledgeId=" + G.knowledgeid + "&jobId=" + t.jobid + "&enc=" + t.enc; setTimeout(() => { te(0, e, s) }, 3e3) } else setTimeout(() => { K(0, e) }, 3e3); else { n("用户设置只处理属于任务点的任务，准备处理下一个任务", "green"), T(); return } } function Fe(e) { let t = e.find(".Wrappadding form"); U = t.find(".zquestions .zsubmit .btn-ok-bottom"), $okBtn = e.find("#okBtn"), ie = t.find(".zquestions .zsubmit .btn-save"); let r = t.find(".zquestions .Py-mian1"); A(0, r) } function A(e, t) {
    if (e == t.length) { localStorage.getItem("GPTJsSetting.sub") === "true" ? (n("测验处理完成，准备自动提交。", "green"), setTimeout(() => { U.click(), setTimeout(() => { n("提交成功，准备切换下一个任务。", "green"), v.splice(0, 1), E.splice(0, 1), setTimeout(() => { T() }, 3e3) }, 3e3) }, 5e3)) : localStorage.getItem("GPTJsSetting.force") === "true" ? (n("测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。", "red"), setTimeout(() => { U.click(), setTimeout(() => { $okBtn.click(), n("提交成功，准备切换下一个任务。", "green"), v.splice(0, 1), E.splice(0, 1), setTimeout(() => { T() }, 3e3) }, 3e3) }, 5e3)) : (n("测验处理完成，存在无答案题目或用户设置不自动提交，自动保存！", "green"), setTimeout(() => { n("保存成功，准备切换下一个任务。", "green"), ie.click(), setTimeout(() => { n("保存成功，准备切换下一个任务。", "green"), v.splice(0, 1), E.splice(0, 1); try { n("正在执行任务切换...", "blue"), O() } catch (b) { n("任务切换出错: " + b, "red"), setTimeout(() => { try { T() } catch (y) { n("通过switchMission切换任务也失败: " + y, "red"), n("将在5秒后重试，如仍失败请刷新页面", "orange"), setTimeout(() => { try { X() } catch { n("无法自动切换，请手动切换到下一任务", "red") } }, 5e3) } }, 3e3) } }, 3e3) }, 5e3)); return } let r = i(t[e]).find(".Py-m1-title").html(), s = N(r).replace(/.*?\[.*?题\]\s*\n\s*/, "").trim(), o = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 选择题: 5 }[r.match(/.*?\[(.*?)]|$/)[1]], a = [], d; var f = 0; switch (o) {
        case 0: d = i(t[e]).find(".answerList.singleChoice li"); var g = []; d.each(function () { var l = i(this).text().replace(/[ABCD]/g, "").trim(); g.push(l) }), g = g.join("|"), n("单选题: " + s + `
`+ g, "blue"); let b = s; for (var m = 0; m < d.length; m++)if (i(d[m]).attr("aria-label")) { n(e + 1 + "此题已作答，准备切换下一题", "green"), f = 1, setTimeout(() => { A(e + 1, t) }, 300); break } f == 0 && I(o, b).then(l => { d = i(t[e]).find(".answerList.singleChoice li"), i.each(d, (c, p) => { a.push(P(i(p).html()).replace(/^[A-Z]\s*\n\s*/, "").trim()) }); let u = -1; if (!l || l.trim() === "") { n("未获取到有效答案，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time); return } if (/^[A-D]$/i.test(l.trim())) { let c = l.trim().toUpperCase().charCodeAt(0) - 65; c >= 0 && c < d.length && (u = c) } else if (/答案：?[A-D]/i.test(l)) { let c = l.match(/答案：?([A-D])/i); if (c && c[1]) { let p = c[1].toUpperCase().charCodeAt(0) - 65; p >= 0 && p < d.length && (u = p, n("从答案文本中提取选项: " + c[1] + "，对应索引: " + u, "green")) } } else if (u = a.findIndex(c => c == l), u == -1 && !l.includes("未找到答案") && l !== "暂无答案") { for (let c = 0; c < a.length; c++)if (l.includes(a[c]) || a[c].includes(l)) { u = c, n("使用内容模糊匹配找到选项，索引: " + u, "green"); break } } u == -1 ? (n("无法匹配正确答案,请手动选择，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time)) : (i(d[u]).click(), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { A(e + 1, t) }, setting.time)) }).catch(l => { n("答案获取失败，跳过此题", "red"), l.c == 0 && setTimeout(() => { A(e + 1, t) }, setting.time) }); break; case 1: d = i(t[e]).find(".answerList.multiChoice li"); var g = []; d.each(function () { var l = i(this).text().replace(/[ABCD]/g, "").trim(); g.push(l) }), g = g.join("|"), n("多选题: " + s + `
`+ g, "blue"); let y = s; for (var m = 0; m < d.length; m++)if (i(d[m]).attr("aria-label")) { n(e + 1 + "此题已作答，准备切换下一题", "green"), f = 1, setTimeout(() => { A(e + 1, t) }, 300); break } f == 0 && I(o, y).then(l => { if (!l || l.trim() === "" || l.includes("未找到答案") || l === "暂无答案") { n("未获取到有效答案，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time); return } else { if (d = i(t[e]).find(".answerList.multiChoice li"), /^[A-D]+$/i.test(l.trim())) { let c = l.trim().toUpperCase().split(""); n("识别到多选题选项字母: " + c.join(","), "green"), c.forEach(p => { let x = p.charCodeAt(0) - 65; x >= 0 && x < d.length && setTimeout(() => { i(d[x]).click() }, 300) }) } else if (/答案：?[A-D]+/i.test(l)) { let c = l.match(/答案：?([A-D]+)/i); if (c && c[1]) { let p = c[1].toUpperCase().split(""); n("从答案文本中提取选项: " + p.join(","), "green"), p.forEach(x => { let k = x.charCodeAt(0) - 65; k >= 0 && k < d.length && setTimeout(() => { i(d[k]).click() }, 300) }) } } else i.each(d, (c, p) => { let x = P(i(p).html()).replace(/^[A-Z]\s*\n\s*/, "").trim(); l.indexOf(x) != -1 && setTimeout(() => { i(d[c]).click() }, 300) }); let u = 0; setTimeout(() => { i.each(d, (c, p) => { i(p).attr("class").indexOf("cur") != -1 && (u = 1) }), u ? n("自动答题成功，准备切换下一题", "green") : (n("未能正确选择答案，请手动选择，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1)), setTimeout(() => { A(e + 1, t) }, setting.time) }, 1e3) } }).catch(l => { l.c == 0 && setTimeout(() => { A(e + 1, t) }, setting.time) }); break; case 2: let h = i(t[e]).find(".blankList2 input"); if (i(h).val() !== null) { n("此题已作答,跳过", "green"), setTimeout(() => { A(e + 1, t) }, 300); break } I(o, s).then(l => { if (l == "暂无答案" || l === "") { n("AI无法完美匹配正确答案,请手动选择，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time); return } let u = l; if (u.includes("答案：")) { let x = u.split("答案："); x.length > 1 && (u = x[1].trim(), u = u.split(/[\n\r]+/)[0].trim(), n("从AI回答中提取填空答案: " + u, "green")) } let c; u.includes("#") ? (c = u.split("#"), n("使用#号分隔填空答案", "green")) : u.includes("，") || u.includes(",") ? (c = u.split(/[,，]/), n("使用逗号分隔填空答案", "green")) : u.includes(" ") || u.includes("	") ? (c = u.split(/[\s\t]+/), n("使用空格分隔填空答案", "green")) : u.includes("；") || u.includes(";") ? (c = u.split(/[;；]/), n("使用分号分隔填空答案", "green")) : (c = [u], n("填空答案无分隔符，作为单个答案处理", "green")); let p = i(t[e]).find(".blankList2 input"); i.each(p, (x, k) => { if (x < c.length) { let S = c[x].trim(); S = S.replace(/^\s*[\(（]?\d+[\)）\.]?\s*/, ""), setTimeout(() => { i(k).val(S) }, 200) } }), n("填空题自动答题成功，准备切换下一题", "green"), setTimeout(() => { A(e + 1, t) }, setting.time) }).catch(l => { l.c == 0 && setTimeout(() => { A(e + 1, t) }, setting.time) }); break; case 3: n("判断题(只回答正确或错误): " + s, "blue"), I(o, s).then(l => { if (!l || l.trim() === "" || l.includes("未找到答案") || l === "暂无答案") { n("未获取到有效答案，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time); return } let u = "正确|是|对|√|T|ri|true|yes", c = "错误|否|错|×|F|wr|false|no"; d = i(t[e]).find(".answerList.panduan li"); let p = l; l.includes("答案：") && (p = l.split("答案：")[1].trim().split(/[\n\r]/)[0].trim(), n("从AI回答中提取判断结果: " + p, "green")); let x = !1, k = !1; u.split("|").forEach(S => { p.toLowerCase().includes(S.toLowerCase()) && (x = !0) }), c.split("|").forEach(S => { p.toLowerCase().includes(S.toLowerCase()) && (k = !0) }), x && !k ? (n('判断为"正确"', "green"), i.each(d, (S, w) => { i(w).attr("val-param") == "true" && i(w).click() })) : k && !x ? (n('判断为"错误"', "green"), i.each(d, (S, w) => { i(w).attr("val-param") == "false" && i(w).click() })) : u.indexOf(p) != -1 ? (n('使用原有逻辑判断为"正确"', "green"), i.each(d, (S, w) => { i(w).attr("val-param") == "true" && i(w).click() })) : (n('默认判断为"错误"', "orange"), i.each(d, (S, w) => { i(w).attr("val-param") == "false" && i(w).click() })), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { A(e + 1, t) }, setting.time) }).catch(l => { l.c == 0 && setTimeout(() => { A(e + 1, t) }, setting.time) }); break; case 4: n("判断题(只回答正确或错误): " + s, "blue"), I(o, s).then(l => { if (!l || l.trim() === "" || l.includes("未找到答案") || l === "暂无答案") { n("未获取到有效答案，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time); return } let u = "正确|是|对|√|T|ri|true|yes", c = "错误|否|错|×|F|wr|false|no"; d = i(t[e]).find(".answerList.panduan li"); let p = l; l.includes("答案：") && (p = l.split("答案：")[1].trim().split(/[\n\r]/)[0].trim(), n("从AI回答中提取判断结果: " + p, "green")); let x = !1, k = !1; u.split("|").forEach(S => { p.toLowerCase().includes(S.toLowerCase()) && (x = !0) }), c.split("|").forEach(S => { p.toLowerCase().includes(S.toLowerCase()) && (k = !0) }), x && !k ? (n('判断为"正确"', "green"), i.each(d, (S, w) => { i(w).attr("val-param") == "true" && i(w).click() })) : k && !x ? (n('判断为"错误"', "green"), i.each(d, (S, w) => { i(w).attr("val-param") == "false" && i(w).click() })) : u.indexOf(p) != -1 ? (n('使用原有逻辑判断为"正确"', "green"), i.each(d, (S, w) => { i(w).attr("val-param") == "true" && i(w).click() })) : (n('默认判断为"错误"', "orange"), i.each(d, (S, w) => { i(w).attr("val-param") == "false" && i(w).click() })), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { A(e + 1, t) }, setting.time) }).catch(l => { l.c == 0 && setTimeout(() => { A(e + 1, t) }, setting.time) }); break; case 5: I(o, s).then(l => { localStorage.setItem("GPTJsSetting.sub", !1), n("此类型题目无法区分单/多选，请手动选择答案", "red"), setTimeout(() => { A(e + 1, t) }, setting.time) }).catch(l => { l.c == 0 && setTimeout(() => { A(e + 1, t) }, setting.time) }); break; default: n("暂不支持处理此类型题目：" + r.match(/.*?\[(.*?)]|$/)[1] + ",跳过！请手动作答。", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { A(e + 1, t) }, setting.time); break
    }
} function te(e, t, r) { if (e == t.length) { n("此页面全部测验已处理完毕！准备进行下一项任务"), setTimeout(ne, 5e3); return } n("等待测验框架加载...", "purple"), se(i(t[e]).contents()[0], "iframe").then(s => { let o = s; o.length == 0 && setTimeout(() => { te(e, t) }, 5e3); let a = i(o).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim(); if (!a) { E.splice(0, 1), setTimeout(ne, 2e3); return } setting.share && a.indexOf("已完成") != -1 ? (n("测验：" + (e + 1) + ",检测到此测验已完成,准备收录答案。", "green"), setTimeout(() => { xe(e, t, o) }, 2e3)) : a.indexOf("待做") != -1 || a.indexOf("待完成") != -1 || a.indexOf("未达到及格线") != -1 ? (n("测验：" + (e + 1) + ",准备处理此测验...", "purple"), i(o).attr("src", r), se(i(t[e]).contents()[0], 'iframe[src="' + r + '"]').then(d => { setTimeout(() => { Fe(i(d).contents()) }, 3e3) })) : a.indexOf("待批阅") != -1 ? (v.splice(0, 1), E.splice(0, 1), n("测验：" + (e + 1) + ",测验待批阅,跳过", "red"), setTimeout(() => { te(e + 1, t, r) }, 5e3)) : (v.splice(0, 1), E.splice(0, 1), n("测验：" + (e + 1) + ",未知状态或用户选择不收录答案,跳过", "red"), setTimeout(() => { te(e + 1, t, r) }, 5e3)) }) } function K(e, t) { if (e == t.length) { n("此页面全部测验已处理完毕！准备进行下一项任务"), setTimeout(ne, 5e3); return } n("等待测验框架加载...", "purple"), se(i(t[e]).contents()[0], "iframe").then(r => { let s = r; s.length == 0 && setTimeout(() => { K(e, t) }, 5e3); let o = i(s).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim(); if (!o) { E.splice(0, 1), setTimeout(ne, 2e3); return } setting.share && o.indexOf("已完成") != -1 ? (n("测验：" + (e + 1) + ",检测到此测验已完成,准备收录答案。", "green"), setTimeout(() => { xe(e, t, s) }, 2e3)) : o.indexOf("待做") != -1 || o.indexOf("待完成") != -1 ? (n("测验：" + (e + 1) + ",准备处理此测验...", "purple"), setTimeout(() => { Ke(e, t, s) }, 5e3)) : o.indexOf("待批阅") != -1 ? (v.splice(0, 1), E.splice(0, 1), n("测验：" + (e + 1) + ",测验待批阅,跳过", "red"), setTimeout(() => { K(e + 1, t) }, 5e3)) : (v.splice(0, 1), E.splice(0, 1), n("测验：" + (e + 1) + ",未知状态或用户选择不收录答案,跳过", "red"), setTimeout(() => { K(e + 1, t) }, 5e3)) }) } function se(e, t, r = 0) { return new Promise(s => { let o = e.querySelector(t); if (o) return s(o); let a; const d = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver; if (d) { const f = new d(m => { for (let g of m) for (let b of g.addedNodes) if (b instanceof Element && (o = b.matches(t) ? b : b.querySelector(t), o)) return f.disconnect(), a && clearTimeout(a), s(o) }); f.observe(e, { childList: !0, subtree: !0 }), r > 0 && (a = setTimeout(() => (f.disconnect(), s(null)), r)) } else { const f = m => { if (m.target instanceof Element && (o = m.target.matches(t) ? m.target : m.target.querySelector(t), o)) return e.removeEventListener("DOMNodeInserted", f, !0), a && clearTimeout(a), s(o) }; e.addEventListener("DOMNodeInserted", f, !0), r > 0 && (a = setTimeout(() => (e.removeEventListener("DOMNodeInserted", f, !0), s(null)), r)) } }) } function $e() { n("开始处理作业", "green"); let t = i(".mark_table").find("form").find(".questionLi"); C(0, t) } function C(e, t) {
    if (e == t.length) { n("作业题目已全部完成", "green"); return } let r = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 写作题: 5, 翻译题: 6 }[i(t[e]).attr("typename")], s = i(t[e]).find(".mark_name").html(), o = N(s).replace(/^[(].*?[)]/, "").trim(), a = [], d, f; var m = 0; switch (r) {
        case 0: d = i(t[e]).find(".stem_answer").find(".answer_p"); var b = []; d.each(function () { var c = i(this).text().replace(/[ABCD]/g, "").trim(); b.push(c) }), b = b.join("|"), o = "单选题:" + o + `
`+ b; for (var g = 0; g < d.length; g++)if (i(d[g]).parent().find("span").attr("class").indexOf("check_answer") != -1) { n(e + 1 + "此题已作答，准备切换下一题", "green"), m = 1, setTimeout(() => { C(e + 1, t) }, 300); break } m == 0 && I(r, o).then(c => { i.each(d, (x, k) => { a.push(P(i(k).html())) }); let p = a.findIndex(x => x == c); if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let x = i(t[e]).find(".mark_name"); x.html(x.html() + "<p></p>" + c) } p == -1 ? (n("AI无法完美匹配正确答案,请手动选择，跳过此题", "red"), setTimeout(() => { C(e + 1, t) }, setting.time)) : setTimeout(() => { i(d[p]).parent().find("span").attr("class").indexOf("check_answer") == -1 && i(d[p]).parent().click(), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, setting.time) }, 300) }).catch(c => { c.c == 0 && setTimeout(() => { C(e + 1, t) }, setting.time) }); break; case 1: d = i(t[e]).find(".stem_answer").find(".answer_p"); var b = []; d.each(function () { var c = i(this).text().replace(/[ABCD]/g, "").trim(); b.push(c) }), b = b.join("|"), o = "多选题:" + o + `
`+ b; for (var g = 0; g < d.length; g++)if (i(d[g]).parent().find("span").attr("class").indexOf("check_answer") != -1) { n(e + 1 + "此题已作答，准备切换下一题", "green"), m = 1, setTimeout(() => { C(e + 1, t) }, 300); break } m == 0 && I(r, o).then(c => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let p = i(t[e]).find(".mark_name"); p.html(p.html() + "<p></p>" + c) } i.each(d, (p, x) => { c.indexOf(P(i(x).html())) != -1 && setTimeout(() => { i(d[p]).parent().find("span").attr("class").indexOf("check_answer_dx") == -1 && i(d[p]).parent().click() }, 300) }), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, setting.time) }).catch(c => { c.c == 0 && setTimeout(() => { C(e + 1, t) }, setting.time) }); break; case 2: o = '填空题,用"|"分割多个答案:' + o, f = i(t[e]).find(".stem_answer").find(".Answer .divText .textDIV textarea"); let y = i(f).attr("id"); F.getEditor(y).getContent() !== "" ? (n(e + 1 + "此题已作答，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, 300)) : I(r, o).then(c => { i.each(f, (p, x) => { let k = i(x).attr("id"); if (F.getEditor(k).getContent() === "") { let S = c.split("|"); setTimeout(() => { F.getEditor(k).setContent(S[p]) }, 300) } }), setTimeout(() => { C(e + 1, t) }, setting.time), n("自动答题成功，准备切换下一题", "green") }); break; case 3: let h = "正确|是|对|√|T|ri", l = "错误|否|错|×|F|wr", u = 0; d = i(t[e]).find(".stem_answer").find(".answer_p"), o = "判断题(只回答正确或错误):" + o + `
`+ d.text(), i.each(d, (c, p) => { a.push(i(p).text().trim()) }); for (var g = 0; g < d.length; g++)if (i(d[g]).parent().find("span").attr("class").indexOf("check_answer") != -1) { n(e + 1 + "此题已作答，准备切换下一题", "green"), m = 1, setTimeout(() => { C(e + 1, t) }, 300); break } m == 0 && I(r, o).then(c => { if (h.indexOf(c) != -1) u = a.findIndex(p => h.indexOf(p) != -1); else if (l.indexOf(c) != -1) u = a.findIndex(p => l.indexOf(p) != -1); else { n("答案匹配出错，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, setting.time); return } setTimeout(() => { i(d[u]).parent().find("span").attr("class").indexOf("check_answer") == -1 && i(d[u]).parent().click() }, 300), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, setting.time) }).catch(c => { c.c == 0 && setTimeout(() => { C(e + 1, t) }, setting.time) }); break; case 4: o = "用50字简要回答:" + o, f = i(t[e]).find(".stem_answer").find(".eidtDiv textarea"), i.each(f, (c, p) => { let x = i(p).attr("id"); F.getEditor(x).getContent() !== "" ? (n(e + 1 + "此题已作答，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, 300)) : I(r, o).then(k => { setTimeout(() => { F.getEditor(x).setContent(k) }, 300), n("自动答题成功，准备切换下一题", "green"), setTimeout(() => { C(e + 1, t) }, setting.time) }).catch(k => { k.c == 0 && setTimeout(() => { C(e + 1, t) }, setting.time) }) }); break; case 5: _answerEle = $_ansdom.find(".subEditor textarea"), jdt = "用英文根据题目进行写作:" + o, i.each(_answerEle, (c, p) => { I(_qType, jdt).then(x => { let k = i(p).attr("name"); setTimeout(() => { F.getEditor(k).setContent(x) }, 300) }) }); break; case 6: _answerEle = $_ansdom.find(".subEditor textarea"), jdt = "中文英文翻译题:" + o, i.each(_answerEle, (c, p) => { I(_qType, jdt).then(x => { let k = i(p).attr("name"); setTimeout(() => { F.getEditor(k).setContent(x) }, 300) }) }); break; default: _answerEle = $_ansdom.find(".subEditor textarea"), _answerEle !== null ? (jdt = i(t[e]).attr("typename") + ":" + o, i.each(_answerEle, (c, p) => { I(_qType, jdt).then(x => { let k = i(p).attr("name"); setTimeout(() => { F.getEditor(k).setContent(x) }, 300) }) })) : (n("暂不支持处理此题型：" + i(t[e]).attr("typename") + ",跳过。", "red"), setTimeout(() => { C(e + 1, t) }, setting.time))
    }
} function qe() {
    let e = i(".mark_table").find(".whiteDiv"), t = P(e.find("h3.mark_name").html().trim()), r = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 论述题: 4, 写作题: 5, 翻译题: 6 }[t.match(/[(](.*?),.*?分[)]|$/)[1]], s = N(t.replace(/[(].*?分[)]/, "").replace(/^\s*/, "")), o = e.find("#submitTest").find(".stem_answer"), a, d = []; switch (r) {
        case 0: a = o.find(".clearfix.answerBg .fl.answer_p"); var f = []; a.each(function () { var h = i(this).text().replace(/[ABCD]/g, "").trim(); f.push(h) }), f = f.join("|"), s = "单选题:" + s + `
`+ f, s = N(s.replace(/[(].*?分[)]/, "").replace(/^\s*/, "")), I(r, s).then(h => { if (i.each(a, (u, c) => { d.push(P(i(c).html())) }), localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let u = e.find("h3.mark_name"); u.html(u.html() + h) } let l = d.findIndex(u => u == h); l == -1 ? (n("AI无法完美匹配正确答案,请手动选择，跳过此题", "red"), setTimeout(B, 5e3)) : setTimeout(() => { i(a[l]).parent().find("span").attr("class").indexOf("check_answer") == -1 ? (localStorage.getItem("GPTJsSetting.goodStudent") === "true" ? i(a[l]).parent().find("span").css("font-weight", "bold") : setTimeout(() => { i(a[l]).parent().click() }, 300), n("自动答题成功，准备切换下一题", "green"), B()) : (n(index + 1 + "此题已作答，准备切换下一题", "green"), B()) }, 300) }).catch(h => { h.c == 0 && B() }); break; case 1: a = o.find(".clearfix.answerBg .fl.answer_p"); var f = []; a.each(function () { var h = i(this).text().replace(/[ABCD]/g, "").trim(); f.push(h) }), f = f.join("|"), s = "多选题:" + s + `
`+ f, I(r, s).then(h => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let l = e.find("h3.mark_name"); l.html(l.html() + h) } o.find(".clearfix.answerBg span.check_answer_dx").length > 0 ? (n(index + 1 + "此题已作答，准备切换下一题", "green"), B()) : (i.each(a, (l, u) => { h.indexOf(P(i(u).html())) != -1 && (localStorage.getItem("GPTJsSetting.goodStudent") === "true" ? i(a[y]).parent().find("span").css("font-weight", "bold") : setTimeout(() => { i(a[l]).parent().click() }, 300)) }), n("自动答题成功，准备切换下一题", "green"), B()) }).catch(h => { h.c == 0 && B() }); break; case 2: s = '填空题,用"|"分割多个答案:' + s; let m = o.find(".Answer .divText .subEditor textarea"); I(r, s).then(h => { let l = h.split("|"); i.each(m, (u, c) => { let p = i(c).attr("id"); setTimeout(() => { F.getEditor(p).setContent(l[u]) }, 300) }), n("自动答题成功，准备切换下一题", "green"), B() }); break; case 3: let g = "正确|是|对|√|T|ri", b = "错误|否|错|×|F|wr", y = 0; s = "判断题(只回答正确或错误):" + s, a = o.find(".clearfix.answerBg .fl.answer_p"), i.each(a, (h, l) => { d.push(i(l).text().trim()) }), I(r, s).then(h => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let l = e.find("h3.mark_name"); l.html(l.html() + h) } if (g.indexOf(h) != -1) y = d.findIndex(l => g.indexOf(l) != -1); else if (b.indexOf(h) != -1) y = d.findIndex(l => b.indexOf(l) != -1); else { n("答案匹配出错，准备切换下一题", "green"), B(); return } i(a[y]).parent().find("span").attr("class").indexOf("check_answer") == -1 ? (localStorage.getItem("GPTJsSetting.goodStudent") === "true" ? setTimeout(() => { i(a[y]).parent().find("span").css("font-weight", "bold") }, 300) : i(a[y]).parent().click(), n("自动答题成功，准备切换下一题", "green"), B()) : (n(index + 1 + "此题已作答，准备切换下一题", "green"), B()) }).catch(h => { h.c == 0 && B() }); break; case 4: _answerEle = o.find(".subEditor textarea"), jdt = "用50字简要回答:" + s, i.each(_answerEle, (h, l) => { I(r, jdt).then(u => { let c = i(l).attr("name"); setTimeout(() => { F.getEditor(c).setContent(u) }, 300), B() }) }); break; case 5: _answerEle = o.find(".subEditor textarea"), jdt = "用英文根据题目进行写作:" + s, i.each(_answerEle, (h, l) => { I(r, jdt).then(u => { let c = i(l).attr("name"); setTimeout(() => { F.getEditor(c).setContent(u) }, 300), B() }) }); break; case 6: _answerEle = o.find(".subEditor textarea"), jdt = "中文英文翻译题:" + s, i.each(_answerEle, (h, l) => { I(r, jdt).then(u => { let c = i(l).attr("name"); setTimeout(() => { F.getEditor(c).setContent(u) }, 300), B() }) }); break; default: _answerEle = o.find(".Answer .divText .subEditor textarea"), typeof _answerEle < "u" ? (jdt = t.match(/[(](.*?),.*?分[)]|$/)[1] + ':填空题,用"|"分割多个答案:' + s, I(r, s).then(h => { let l = h.split("|"); i.each(_answerEle, (u, c) => { let p = i(c).attr("id"); setTimeout(() => { F.getEditor(p).setContent(l[u]) }, 300) }), n("自动答题成功，准备切换下一题", "green"), B() })) : (n("暂不支持处理此题型：" + i(TiMuList[index]).attr("typename") + ",跳过。", "red"), setTimeout(() => { C(index + 1, TiMuList) }, setting.time))
    }
} function B() { if (localStorage.getItem("GPTJsSetting.examTurn") === "true") { let t = i(".mark_table").find(".whiteDiv").find(".nextDiv a.jb_btn"); setTimeout(() => { t.click() }, setting.examTurnTime ? 2e3 + Math.floor(Math.random() * 5 + 1) * 1e3 : 2e3) } else n("用户设置不自动跳转下一题，请手动点击", "blue") } function je() { n("考试答案收录功能处于bate阶段，遇到bug请及时反馈!!", "red"), n("考试答案收录功能处于bate阶段，遇到bug请及时反馈!!", "red"), n("开始收录考试答案", "green"); let e = i(".mark_table .mark_item .questionLi"), t = []; i.each(e, (r, s) => { let o = {}, a, d, f = [], m = N(i(s).find("h3").html()), g = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[m.match(/[(](.*?)[)]|$/)[1].replace(/,.*?分/, "")], b = m.replace(/^[(].*?[)]|$/, "").trim(), y = i(s).find(".mark_answer").find(".colorGreen").text().replace(/正确答案[:：]/, "").trim(); switch (g) { case 0: if (y.length <= 0) if (_isTrue = i(s).find(".mark_answer").find(".mark_score span").attr("class"), _isZero = i(s).find(".mark_answer").find(".mark_score .totalScore.fr i").text(), _isTrue == "marking_dui" || _isZero != "0") y = i(s).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(); else break; d = i(s).find(".mark_letter li"), i.each(d, (u, c) => { f.push(P(i(c).html()).replace(/[A-Z].\s*/, "")) }); let h = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[y]; a = f[h], o.question = b, o.type = g, o.answer = a, t.push(o); break; case 1: if (a = [], y.length <= 0) if (_isTrue = i(s).find(".mark_answer").find(".mark_score span").attr("class"), _isZero = i(s).find(".mark_answer").find(".mark_score .totalScore.fr i").text(), _isTrue == "marking_dui" || _isTrue == "marking_bandui" || _isZero != "0") y = i(s).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(); else break; d = i(s).find(".mark_letter li"), i.each(d, (u, c) => { f.push(P(i(c).html()).replace(/[A-Z].\s*/, "")) }), i.each(y.split(""), (u, c) => { let p = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[c]; a.push(f[p]) }), o.question = b, o.type = g, o.answer = a.join("#"), t.push(o); break; case 2: d = []; let l = i(s).find(".mark_answer").find(".colorDeep").find("dd"); y.length <= 0 ? (i.each(l, (u, c) => { if (_isTrue = i(c).find("span:eq(1)").attr("class"), _isTrue == "marking_dui") y = i(c).find("span:eq(0)").html(), d.push(y.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim()); else return }), a = d.join("#")) : a = y.replace(/\s/g, "").replace(/[(][0-9].*?[)]/g, "#").replace(/第.*?空:/g, "#").replace(/^#*/, ""), a.length != 0 && (o.question = b, o.type = g, o.answer = a, t.push(o)); break; case 3: if (y.length <= 0) if (_isTrue = i(s).find(".mark_answer").find(".mark_score span").attr("class"), _isZero = i(s).find(".mark_answer").find(".mark_score .totalScore.fr i").text(), _isTrue == "marking_dui" || _isZero != "0") y = i(s).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(); else { let u = "正确|是|对|√|T|ri"; y = i(s).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(), u.indexOf(y) != -1 ? y = "错" : y = "对" } o.question = b, o.type = g, o.answer = y, t.push(o); break; case 4: if (y.length <= 0) break; o.question = b, o.type = g, o.answer = y, t.push(o); break } }), setTimeout(() => { fe(t) }, 1500) } function Me() { let e = Ae(); return new Promise((t, r) => { i.ajax({ url: _.protocol + "//" + _.host + "/mycourse/studentstudycourselist?courseId=" + e.courseid + "&chapterId=" + e.knowledgeid + "&clazzid=" + e.clazzid + "&mooc2=1", type: "GET", dateType: "html", success: function (s) { t(s) } }) }) } function he(e, t, r, s, o, a, d, f, m, g, b, y) { return new Promise((h, l) => { (void 0).then(u => { pe && (e = _e(e)), i.ajax({ url: e + "/" + t + "?clazzId=" + r + "&playingTime=" + s + "&duration=" + o + "&clipTime=" + a + "&objectId=" + d + "&otherInfo=" + f + "&jobid=" + m + "&userid=" + g + "&isdrag=" + b + "&view=pc&enc=" + u + "&rt=" + Number(y) + "&dtype=Audio&_t=" + String(Math.round(new Date)), type: "GET", success: function (c) { try { c.isPassed ? setting.review && s != o ? h(1) : h(2) : setting.rate == 0 && s == o ? h(2) : h(1) } catch (p) { n("发生错误：" + p, "red"), h(0) } }, error: function (c) { c.status == 403 ? (n("超星返回错误信息，尝试更换参数，40s后将重试，请等待...", "red"), h(3)) : (pe = 1, n("超星返回错误信息，如果持续出现，请联系作者", "red")) } }) }) }) } function xe(e, t, r) { let o = i(r).contents().find(".CeYan").find(".TiMu"), a = []; for (let d = 0; d < o.length; d++) { let f = {}, m = i(o[d]).find(".Zy_TItle.clearfix > div.clearfix").html().trim(), g = N(m), b = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[m.match(/^【(.*?)】|$/)[1]]; f.question = g, f.type = b; let y = i(o[d]).find(".Py_answer.clearfix > i").attr("class"); switch (b) { case 0: if (y == "fr dui") { let x = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[i(o[d]).find(".Py_answer.clearfix > span").html().trim().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim()], k = i(o[d]).find(".Zy_ulTop li"), S = i(k[x]).find("a.fl").html(); f.answer = P(S) } break; case 1: let h = i(o[d]).find(".Py_answer.clearfix > span").html().trim().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim(), l = i(o[d]).find(".Zy_ulTop li"), u = []; if (y == "fr dui" || y == "fr bandui") for (let x = 0; x < h.length; x++) { let k = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[h[x]]; u.push(i(l[k]).find("a.fl").html()) } else break; f.answer = P(u.join("#")); break; case 2: let c = i(o[d]).find(".Py_answer.clearfix .clearfix"), p = []; for (let x = 0; x < c.length; x++) { let k = c[x]; i(k).find("i").attr("class") == "fr dui" && p.push(i(k).find("p").html().replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim()) } if (p.length <= 0) break; f.answer = P(p.join("#")); break; case 3: if (y == "fr dui") { let x = i(o[d]).find(".Py_answer.clearfix > span > i").html().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim(); f.answer = P(x) } else if (i(o[d]).find(".Py_answer.clearfix > span > i").html()) { let x = i(o[d]).find(".Py_answer.clearfix > span > i").html().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim(); f.answer = P(x) == "√" ? "x" : "√" } else break; break }if (f.answer != null) a.push(f); else continue } fe(a).then(() => { v.splice(0, 1), E.splice(0, 1), setTimeout(() => { K(e + 1, t) }, 3e3) }) } function Ne() { n("开始收录答案", "green"); let t = i(".mark_table").find(".mark_item").find(".questionLi"), r = []; i.each(t, (s, o) => { let a = {}, d, f, m = [], g = N(i(o).find("h3.mark_name").html()), b = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[g.match(/[(](.*?)[)]|$/)[1].replace(/, .*?分/, "")], y = g.replace(/^[(].*?[)]|$/, "").trim(), h = i(o).find(".mark_answer").find(".colorGreen").text().replace(/正确答案[:：]/, "").trim(); switch (b) { case 0: if (h.length <= 0) if (_isTrue = i(o).find(".mark_answer").find(".mark_score span").attr("class"), _isZero = i(o).find(".mark_answer").find(".mark_score .totalScore.fr i").text(), _isTrue == "marking_dui" || _isZero != "0") h = i(o).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(); else return; f = i(o).find(".mark_letter li"), i.each(f, (c, p) => { m.push(P(i(p).html()).replace(/[A-Z].\s*/, "")) }); let l = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[h]; d = m[l], a.question = y, a.type = b, a.answer = d, r.push(a); break; case 1: if (d = [], h.length <= 0) if (_isTrue = i(o).find(".mark_answer").find(".mark_score span").attr("class"), _isZero = i(o).find(".mark_answer").find(".mark_score .totalScore.fr i").text(), _isTrue == "marking_dui" || _isTrue == "marking_bandui" || _isZero != "0") h = i(o).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(); else break; f = i(o).find(".mark_letter li"), i.each(f, (c, p) => { m.push(P(i(p).html()).replace(/[A-Z].\s*/, "")) }), i.each(h.split(""), (c, p) => { let x = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[p]; d.push(m[x]) }), a.question = y, a.type = b, a.answer = d.join("#"), r.push(a); break; case 2: f = []; let u = i(o).find(".mark_answer").find(".colorDeep").find("dd"); h.length <= 0 ? (i.each(u, (c, p) => { if (_isTrue = i(p).find("span:eq(1)").attr("class"), _isTrue == "marking_dui") h = i(p).find("span:eq(0)").html(), f.push(h.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim()); else return }), d = f.join("#")) : d = h.replace(/\s/g, "").replace(/[(][0-9].*?[)]/g, "#").replace(/第.*?空:/g, "#").replace(/^#*/, ""), d.length != 0 && (a.question = y, a.type = b, a.answer = d, r.push(a)); break; case 3: if (h.length <= 0) if (_isTrue = i(o).find(".mark_answer").find(".mark_score span").attr("class"), _isZero = i(o).find(".mark_answer").find(".mark_score .totalScore.fr i").text(), _isTrue == "marking_dui" || _isZero != "0") h = i(o).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(); else { let c = "正确|是|对|√|T|ri"; h = i(o).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim(), c.indexOf(h) != -1 ? h = "错" : h = "对" } a.question = y, a.type = b, a.answer = h, r.push(a); break; case 4: if (h.length <= 0) break; a.question = y, a.type = b, a.answer = h, r.push(a); break } }), setTimeout(() => { fe(r) }, 1500) } function I(e, t) {
    return n("题目:" + t, "pink"), new Promise((r, s) => {
        let o = t, a = e; t.startsWith("单选题:") ? (a = "0", o = t.substring(4), n("从题目中提取题型: 单选题", "blue")) : t.startsWith("多选题:") ? (a = "1", o = t.substring(4), n("从题目中提取题型: 多选题", "blue")) : t.startsWith("判断题:") && (a = "3", o = t.substring(4), n("从题目中提取题型: 判断题", "blue")); let d = localStorage.getItem("GPTJsSetting.key") || localStorage.getItem("tiku_key") || ""; if (!d) { n("未配置Key，请在设置中配置您的Key", "red"), s("请在设置中配置您的Key"); return } if (localStorage.getItem("GPTJsSetting.useTiku") !== "true") { n("题库答题功能已关闭，跳过题库查询", "orange"), n("题库答题功能状态：" + (localStorage.getItem("GPTJsSetting.useTiku") === "true" ? "已开启" : "未开启"), "#1890ff"), n("AI答题功能状态：" + (localStorage.getItem("GPTJsSetting.useAI") === "true" ? "已开启" : "未开启"), "#1890ff"), n("随机答题功能状态：" + (localStorage.getItem("GPTJsSetting.randomAnswer") === "true" ? "已开启" : "未开启"), "#1890ff"), n("使用模型：" + (localStorage.getItem("GPTJsSetting.model") || "gpt-3.5-turbo-16k"), "#1890ff"); let u = { 0: "单选题", 1: "多选题", 2: "填空题", 3: "判断题", 4: "简答题", 5: "选择题" }[a] || "未知题型"; if (n("题目类型: " + u, "#1890ff"), localStorage.getItem("GPTJsSetting.useAI") === "true") { n("已开启AI答题功能，准备获取AI答案...", "#1890ff"), n("传递给AI的题型: " + u, "#1890ff"); let c = setTimeout(() => { if (n("AI答题系统响应超时，切换到随机答题...", "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("尝试使用随机答题功能作为备选...", "#1890ff"); const p = D(u); n("成功生成随机答案: " + p, "green"), r(p) } else localStorage.setItem("GPTJsSetting.sub", !1), r("") }, 3e4); ee(o, u).then(p => { clearTimeout(c), n("AI成功回答，继续处理...", "green"), r(p) }).catch(p => { if (clearTimeout(c), n("AI回答失败: " + p, "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("尝试使用随机答题功能作为备选...", "#1890ff"); const x = D(u); n("成功生成随机答案: " + x, "green"), r(x) } else localStorage.setItem("GPTJsSetting.sub", !1), r("") }); return } if (localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("已开启随机答题功能，准备生成随机答案...", "#1890ff"); const c = D(u); n("成功生成随机答案: " + c, "green"), r(c); return } n("未开启AI答题和随机答题功能，留空并继续下一题...", "red"), localStorage.setItem("GPTJsSetting.sub", !1), r(""); return } let f = ""; try { const l = [".option-content", ".el-radio__label", ".el-checkbox__label", ".ant-radio-wrapper", ".ant-checkbox-wrapper", "label.option", ".option-item", ".answer-item", ".subject-item", "li.option", 'div[class*="option"]', 'span[class*="option"]', 'input[type="radio"] + label', 'input[type="checkbox"] + label'], u = document.querySelectorAll(l.join(", ")); if (u && u.length > 0) { const c = []; if (u.forEach(p => { let x = p.textContent.trim(); x = x.replace(/^[A-Z][\.\、\s]+/i, "").trim(), x && !c.includes(x) && c.push(x) }), c.length === 0) { const p = t.match(/\(([^)]+)\)/); if (p && p[1]) c.push(...p[1].split(/[,，、|]/)); else { const x = t.match(/[A-D][\.、][\s\S]+?[A-D][\.、][\s\S]+/); x && c.push(...x[0].split(/[A-D][\.、]/)); const k = t.split(/[|,，、]/); k.length > 1 && k[k.length - 1].match(/[A-D]/) && c.push(...k) } } f = c.join("|"), n("提取到选项: " + f, "blue") } } catch (l) { n("提取选项失败: " + l, "red") } let m = ""; const g = o.lastIndexOf(" "); if (g !== -1) { const l = o.substring(g + 1); l.includes("|") && (o = o.substring(0, g), m = l, n("从题目中提取选项: " + m, "blue")) } if (!m) { const l = o.match(/\(\)[\s]*([^()]+)$/); if (l && l[1]) { const u = l[1].trim(); u.includes("|") && (m = u, o = o.replace(/\(\)[\s]*[^()]+$/, "()"), n("从题目括号后提取选项: " + m, "blue")) } } let y = { 0: "单选题", 1: "多选题", 2: "填空题", 3: "判断题", 4: "简答题", 5: "选择题" }[a] || "未知题型"; n("题目类型: " + y, "green"), m ? n("使用题目中提取的选项: " + m, "green") : f && n("使用页面元素提取的选项: " + f, "green"); let h = "key=" + encodeURIComponent(d) + "&question=" + encodeURIComponent(o) + "&type=" + encodeURIComponent(a); m ? h += "&options=" + encodeURIComponent(m) : f && (h += "&options=" + encodeURIComponent(f)), GM_xmlhttpRequest({
            method: "POST", url: API_BASE_URL + "?act=xxt", headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + d }, data: h, timeout: 12e4, onload: function (l) {
                if (l.status == 200) try {
                    if (!l.responseText) { n("服务器响应内容为空", "red"), s("服务器响应内容为空"); return } let u = JSON.parse(l.responseText); if (u.msg && u.msg.includes("未找到答案")) if (n("题库返回：" + u.msg + "，准备使用AI尝试回答...", "orange"), n("题库答题功能状态：" + (localStorage.getItem("GPTJsSetting.useTiku") === "true" ? "已开启" : "未开启"), "#1890ff"), n("AI答题功能状态：" + (localStorage.getItem("GPTJsSetting.useAI") === "true" ? "已开启" : "未开启"), "#1890ff"), n("随机答题功能状态：" + (localStorage.getItem("GPTJsSetting.randomAnswer") === "true" ? "已开启" : "未开启"), "#1890ff"), n("使用模型：" + (localStorage.getItem("GPTJsSetting.model") || "gpt-3.5-turbo-16k"), "#1890ff"), J("题库无答案", `题型: ${y}
题目: ${o.substring(0, 30)}...`, ""), localStorage.getItem("GPTJsSetting.useAI") === "true") { n("已开启AI答题功能，准备获取AI答案...", "#1890ff"), ee(o, y).then(c => { n("AI成功回答，继续处理...", "green"), r(c) }).catch(c => { if (n("AI回答失败: " + c, "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("尝试使用随机答题功能作为备选...", "#1890ff"); const p = D(y); n("成功生成随机答案: " + p, "green"), r(p) } else localStorage.setItem("GPTJsSetting.sub", !1), r("") }); return } else if (localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("未开启AI答题但已开启随机答题，准备生成随机答案...", "#1890ff"); const c = D(y); n("成功生成随机答案: " + c, "green"), r(c); return } else { n("未开启AI答题和随机答题功能，留空并继续下一题...", "red"), localStorage.setItem("GPTJsSetting.sub", !1), r(""); return } if (u.code === 0) {
                        if (n("错误: " + u.msg, "red"), u.msg.includes("Key验证失败") || u.msg.includes("请提供有效的Key")) {
                            n("请在设置中配置正确的Key", "red"), J("Key验证失败", "请检查您的Key是否正确，并在设置中重新配置", ""); const c = document.createElement("div"); c.textContent = "Key验证失败，请检查您的Key是否正确", c.style.cssText = `
                  position: fixed;
                  top: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: #F56C6C;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 4px;
                  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
                  z-index: 10000;
                  transition: all 0.3s;
                `, document.body.appendChild(c), setTimeout(() => { c.style.opacity = "0", setTimeout(() => { document.body.removeChild(c) }, 500) }, 3e3), s(u.msg); return
                        } if (!u.msg.includes("未找到答案")) { s(u.msg); return }
                    } if ((u.code == 200 || u.code == 1e3) && u.data && u.data.answer && u.data.answer.trim() !== "") n("答案:" + u.data.answer, "pink"), r(u.data.answer); else {
                        if (n("题库未返回有效答案，准备使用AI尝试回答...", "orange"), n("AI答题功能状态：" + (localStorage.getItem("GPTJsSetting.useAI") === "true" ? "已开启" : "未开启"), "#1890ff"), n("随机答题功能状态：" + (localStorage.getItem("GPTJsSetting.randomAnswer") === "true" ? "已开启" : "未开启"), "#1890ff"), n("使用模型：" + (localStorage.getItem("GPTJsSetting.model") || "gpt-3.5-turbo-16k"), "#1890ff"), J("题库无答案", `题型: ${y}
题目: ${o.substring(0, 30)}...`, ""), localStorage.getItem("GPTJsSetting.useAI") === "true") { n("已开启AI答题功能，准备获取AI答案...", "#1890ff"), ee(o, y).then(c => { n("AI成功回答，继续处理...", "green"), r(c) }).catch(c => { if (n("AI回答失败: " + c, "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("尝试使用随机答题功能作为备选...", "#1890ff"); const p = D(y); n("成功生成随机答案: " + p, "green"), r(p) } else localStorage.setItem("GPTJsSetting.sub", !1), r("") }); return } if (localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("已开启随机答题功能，准备生成随机答案...", "#1890ff"); const c = D(y); n("成功生成随机答案: " + c, "green"), r(c); return } n("未开启AI答题和随机答题功能，留空并继续下一题...", "red"), localStorage.setItem("GPTJsSetting.sub", !1), r("")
                    }
                } catch (u) { n("解析响应出错: " + u, "red"), J("解析响应出错", `错误信息: ${u}`, ""), s(u) } else n("请求失败，状态码: " + l.status, "red"), J("请求失败", `状态码: ${l.status}`, ""), s("请求失败，状态码: " + l.status)
            }, onerror: function (l) { n("请求出错: " + (l.statusText || "网络错误"), "red"), J("请求出错", `错误信息: ${l.statusText || "网络错误"}`, ""), s(l.statusText || "网络错误") }, ontimeout: function () { if (n("请求超时，服务器响应时间过长", "red"), n("尝试重新连接到服务器...", "orange"), J("请求超时", "请求答案超时，正在尝试使用备选方案", ""), localStorage.getItem("GPTJsSetting.useAI") === "true") n("尝试使用AI回答...", "orange"), ee(o, y).then(l => { n("AI回答成功，继续处理...", "green"), r(l) }).catch(l => { if (n("AI回答失败: " + l, "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { const u = D(y); n("使用随机答案: " + u, "green"), r(u) } else s("请求超时，且备用方案失败") }); else if (localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { const l = D(y); n("使用随机答案: " + l, "green"), r(l) } else s("请求超时") }
        })
    })
} function Ke(e, t, r) { H = i(r).contents(); let o = H.find(".CeYan").find(".TiMu"); U = H.find(".ZY_sub").find(".btnSubmit"), ie = H.find(".ZY_sub").find(".btnSave"), z(e, t, 0, o) } function z(e, t, r, s) {
    if (r == s.length) { localStorage.getItem("GPTJsSetting.sub") === "true" ? (n("测验处理完成，准备自动提交。", "green"), setTimeout(() => { U.click(), setTimeout(() => { H.find("#confirmSubWin > div > div > a.bluebtn").click(), n("提交成功，准备切换下一个任务。", "green"), v.splice(0, 1), E.splice(0, 1), setTimeout(() => { K(e + 1, t) }, 3e3) }, 3e3) }, 5e3)) : localStorage.getItem("GPTJsSetting.force") === "true" ? (n("测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。", "red"), setTimeout(() => { U.click(), setTimeout(() => { H.find("#confirmSubWin > div > div > a.bluebtn").click(), n("提交成功，准备切换下一个任务。", "green"), v.splice(0, 1), E.splice(0, 1), setTimeout(() => { K(e + 1, t) }, 3e3) }, 3e3) }, 5e3)) : (n("测验处理完成，存在无答案题目或者用户设置不提交，自动保存！", "green"), setTimeout(() => { ie.click(), setTimeout(() => { n("保存成功，准备切换下一个任务。", "green"), v.splice(0, 1), E.splice(0, 1), setTimeout(() => { K(e + 1, t) }, 3e3) }, 3e3) }, 5e3)); return } let o = i(s[r]).find(".Zy_TItle.clearfix > div").html(); o = N(o).replace("/<span.*?>.*?</span>/", ""); let a = N(o), d = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[o.match(/^【(.*?)】|$/)[1]], f = [], m; switch (d) {
        case 0: m = i(s[r]).find(".Zy_ulTop li").find("a"); var g = []; m.each(function () { var l = i(this).text().replace(/[ABCD]/g, "").trim(); g.push(l) }), g = g.join("|"), n("单选题: " + a + `
`+ g, "blue"), i.each(m, (l, u) => { f.push(P(i(u).html())) }), I(d, a).then(l => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let c = i(s[r]).find(".Zy_TItle.clearfix > div"); c.html(c.html() + l) } if (!l || l.trim() === "" || l.includes("未找到答案") || l === "暂无答案") { n("未获取到有效答案，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { z(e, t, r + 1, s) }, setting.time); return } i.each(m, (c, p) => { l.indexOf(P(i(p).html())) != -1 && (i(m[c]).parent().click(), f.push(["A", "B", "C", "D", "E", "F", "G"][c])) }); let u = re(i(s[r]).find(".Zy_ulTop li:nth-child(1)").attr("onclick"), "addcheck(", ");").replace("(", "").replace(")", ""); f.length <= 0 ? (n("无法匹配正确答案,请手动选择，跳过", "red"), localStorage.setItem("GPTJsSetting.sub", !1)) : i(s[r]).find(".Zy_ulTop").parent().find("#answer" + u).val(f.join("")), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }).catch(l => { n("答案获取失败，跳过此题", "red"), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }); break; case 1: m = i(s[r]).find(".Zy_ulTop li").find("a"); var g = []; m.each(function () { var l = i(this).text().replace(/[ABCD]/g, "").trim(); g.push(l) }), g = g.join("|"), n('多选题,用"#"分割多个答案: ' + a + `
`+ g, "blue"), I(d, a).then(l => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let c = i(s[r]).find(".Zy_TItle.clearfix > div"); c.html(c.html() + l) } i.each(m, (c, p) => { l.indexOf(P(i(p).html())) != -1 && (i(m[c]).parent().click(), f.push(["A", "B", "C", "D", "E", "F", "G"][c])) }); let u = re(i(s[r]).find(".Zy_ulTop li:nth-child(1)").attr("onclick"), "addcheck(", ");").replace("(", "").replace(")", ""); f.length <= 0 ? (n("AI无法完美匹配正确答案,请手动选择，跳过", "red"), localStorage.setItem("GPTJsSetting.sub", !1)) : i(s[r]).find(".Zy_ulTop").parent().find("#answer" + u).val(f.join("")), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }).catch(l => { setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }); break; case 2: let b = i(s[r]).find(".Zy_ulTk .XztiHover1"); I(d, a).then(l => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let c = i(s[r]).find(".Zy_TItle.clearfix > div"); c.html(c.html() + l) } let u = l.split("#"); i.each(b, (c, p) => { setTimeout(() => { i(p).find("#ueditor_" + c).contents().find(".view p").html(u[c]), i(p).find("textarea").html("<p>" + u[c] + "</p>") }, 300) }), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }).catch(l => { setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }); break; case 3: m = i(s[r]).find(".Zy_ulTop li").find("a"); let y = "正确|是|对|√|T|ri"; i.each(m, (l, u) => { f.push(P(i(u).html())) }), n("判断题，只回答正确或错误: " + a, "blue"), I(d, a).then(l => { if (localStorage.getItem("GPTJsSetting.alterTitle") === "true") { let c = i(s[r]).find(".Zy_TItle.clearfix > div"); c.html(c.html() + l) } if (!l || l.trim() === "" || l.includes("未找到答案") || l === "暂无答案") { n("未获取到有效答案，跳过此题", "red"), localStorage.setItem("GPTJsSetting.sub", !1), setTimeout(() => { z(e, t, r + 1, s) }, setting.time); return } l = y.indexOf(l) != -1 ? "对" : "错"; let u = f.findIndex(c => c == l); u == -1 ? (n("未匹配到正确答案，跳过", "red"), localStorage.setItem("GPTJsSetting.sub", !1)) : i(m[u]).parent().click(), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }).catch(l => { n("答案获取失败，跳过此题", "red"), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }); break; case 4: let h = i(s[r]).find(".Zy_ulTk .XztiHover1"); I(d, a).then(l => { l == "暂无答案" && localStorage.setItem("GPTJsSetting.sub", !1); let u = l.split("#"); i.each(h, (c, p) => { setTimeout(() => { i(p).find("#ueditor_" + c).contents().find(".view p").html(u[c]), i(p).find("textarea").html("<p>" + u[c] + "</p>") }, 300) }), setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }).catch(l => { setTimeout(() => { z(e, t, r + 1, s) }, setting.time) }); break
    }
} function fe(e) { return new Promise((t, r) => { GM_xmlhttpRequest({ url: API_BASE_URL + "/api/v1/save?v=" + GM_info.script.version, data: "data=" + encodeURIComponent(JSON.stringify(e)), method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, onload: function (s) { try { let o = i.parseJSON(s.responseText); o.code == 200 ? n("答案收录成功！！此次收录" + o.data.total + "道题目，准备处理下一个任务。", "green") : n("答案收录失败了，请向作者反馈，准备处理下一个任务。", "red"), t() } catch { s.responseText.indexOf("防火墙") != -1 ? n("答案收录失败了，已被防火墙拦截，请联系作者手动收录。", "red") : n("答案收录失败了，未知错误，请向作者反馈。", "red"), t() } } }) }) } function T() { if (v.length > 0) { let e = ""; try { e = v[0].property.name || "任务点" } catch { e = "任务点" } J("完成一个任务点", `已完成: ${e}`, "") } else J("没有任务点", "当前页面没有可处理的任务点", ""); v.splice(0, 1), E.splice(0, 1), setTimeout(O, 5e3) } function ne() { n("通过missonStart别名调用initializeTaskSystem", "blue"); try { O() } catch (e) { if (n("通过missonStart调用initializeTaskSystem失败: " + e, "red"), $(), v.length <= 0) return J("任务点完成", "此页面所有任务点已处理完毕，准备跳转页面", ""), n("此页面任务处理完毕，准备跳转页面", "green"), X(); let t = v[0].type; E[0], v[0], t == null && (t = v[0].property.module), n("尝试继续执行任务: " + t, "orange"), setTimeout(() => { T() }, 5e3) } } function P(e) { if (!e) return null; let t = e.replace(/<(?!img).*?>/g, ""); return t = t.replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "").replace(/&nbsp;/g, "").replace(new RegExp("&nbsp;", "gm"), "").trim().replace(/^\s+/, "").replace(/\s+$/, ""), t } function N(e) { if (!e) return null; let t = P(e); return t = t.replace(/^\d+[\.、]/, "").replace("javascript:void(0);", ""), t } function Ze() { var e = i("style:contains(font-cxsecret)"); if (e.length) { var t = e.text().match(/base64,([\w\W]+?)'/)[1]; t = Typr.parse(He(t))[0]; for (var r = JSON.parse(GM_getResourceText("Table")), s = {}, o = 19968; o < 40870; o++)e = Typr.U.codeToGlyph(t, o), e && (e = Typr.U.glyphToPath(t, e), e = ye(JSON.stringify(e)).slice(24), s[o] = r[e]); i(".font-cxsecret").html(function (a, d) { return i.each(s, function (f, m) { f = String.fromCharCode(f), f = new RegExp(f, "g"), m = String.fromCharCode(m), d = d.replace(f, m) }), d }).removeClass("font-cxsecret") } } function He(e) { for (var t = window.atob(e), r = new Uint8Array(t.length), s = 0; s < t.length; ++s)r[s] = t.charCodeAt(s); return r } i(document).ready(function () { let e = !1, t, r; function s() { const a = document.getElementById("ne-21box"); if (a) { const d = { left: parseInt(a.style.left) || 20, top: parseInt(a.style.top) || 5 }; localStorage.setItem("GPTJsSetting.boxPosition", JSON.stringify(d)) } } function o() { const a = document.getElementById("ne-21box"); if (a) { let d = localStorage.getItem("GPTJsSetting.boxPosition"), f = { left: 20, top: 5 }; if (d) try { f = JSON.parse(d) } catch { console.error("无法解析存储的位置信息") } a.style.right = "auto", a.style.left = f.left + "px", a.style.top = f.top + "px" } } i(document).on("mousedown", ".ne-header", function (a) { e = !0; const d = document.getElementById("ne-21box"); t = a.clientX - (parseInt(d.style.left) || 0), r = a.clientY - (parseInt(d.style.top) || 0), a.target === d && (d.style.cursor = "move") }), i(document).on("mousemove", function (a) { if (e) { a.preventDefault(); const d = a.clientX - t, f = a.clientY - r, m = document.getElementById("ne-21box"), g = window.innerWidth - m.offsetWidth, b = window.innerHeight - m.offsetHeight; m.style.right = "auto", m.style.left = Math.max(0, Math.min(d, g)) + "px", m.style.top = Math.max(0, Math.min(f, b)) + "px" } }), i(document).on("mouseup", function (a) { if (e) { e = !1; const d = document.getElementById("ne-21box"); d && (d.style.cursor = ""), s() } }), setTimeout(o, 1e3) }); function ke() {
    if (document.querySelector(".tiku-settings-btn")) return; localStorage.getItem("tiku_key"); const e = !localStorage.getItem("tiku_key"), t = document.createElement("div"); t.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 9999;
  `; const r = document.createElement("div"); r.textContent = e ? "未配置" : "F9显示面板", r.style.cssText = `
    background: #FC3D74;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s;
  `; const s = document.createElement("div"); s.className = "tiku-settings-btn", s.innerHTML = "🔎", s.style.cssText = `
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #20e5fe;
    color: white;
    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  `, s.onmouseover = function () { this.style.transform = "scale(1.1)", this.style.boxShadow = "0 4px 12px 0 rgba(0,0,0,0.2)", r.style.opacity = "1", r.style.transform = "translateY(0)" }, s.onmouseout = function () { this.style.transform = "scale(1)", this.style.boxShadow = "0 2px 12px 0 rgba(0,0,0,0.1)", r.style.opacity = "0", r.style.transform = "translateY(10px)" }, s.onclick = function () { let o = document.getElementById("ne-21box"); if (o || ($(), o = document.getElementById("ne-21box")), o) { let a = o.style.display === "none" || o.style.display === ""; o.style.display = a ? "block" : "none", t.style.display = a ? "none" : "flex" } }, t.appendChild(r), t.appendChild(s), document.body.appendChild(t), document.addEventListener("keydown", function (o) { if (o.key === "F9") { o.preventDefault(); let a = document.getElementById("ne-21box"); if (a || ($(), a = document.getElementById("ne-21box")), a) { let d = a.style.display === "none" || a.style.display === ""; a.style.display = d ? "block" : "none", t.style.display = d ? "none" : "flex" } } })
} window.addEventListener("load", function () { setTimeout(ke, 1e3) }); window.addEventListener("load", function () { Ue(), setTimeout(ke, 1e3) }); function Ue() { if (window.tikuInitialized) return; window.tikuInitialized = !0; let e = localStorage.getItem("GPTJsSetting.key") || ""; !localStorage.getItem("tiku_key") && e ? localStorage.setItem("tiku_key", e) : localStorage.getItem("tiku_key") && !e && (localStorage.setItem("GPTJsSetting.key", localStorage.getItem("tiku_key")), e = localStorage.getItem("tiku_key")), ae() } function J(e, t, r = "") { if (localStorage.getItem("GPTJsSetting.notification") === "false") return; if (!("Notification" in window)) { n("您的浏览器不支持桌面通知", "red"); return } const o = r || "https://a.pengzi.cc/index/pengzi/images/思考2.gif"; Notification.permission === "granted" ? new Notification(e, { body: t, icon: o }) : Notification.permission !== "denied" && Notification.requestPermission().then(function (a) { a === "granted" ? new Notification(e, { body: t, icon: o }) : n("您拒绝了通知权限", "red") }) } function Ye() { J("通知测试", "如果您看到这条消息，说明通知功能正常工作！", "") } i("#GPTJsSetting\\.notification").change(function () { localStorage.setItem("GPTJsSetting.notification", this.checked); const e = document.getElementById("saveKeyMsg"); e.innerText = this.checked ? "桌面通知已开启" : "桌面通知已关闭", e.style.backgroundColor = this.checked ? "#4CAF50" : "#FF9800", e.style.display = "block", setTimeout(function () { e.style.opacity = "1", e.style.transform = "translateY(0)" }, 10), this.checked && Ye(), setTimeout(function () { e.style.opacity = "0", e.style.transform = "translateY(-10px)", setTimeout(function () { e.style.display = "none" }, 300) }, 3e3) }); function ae() {
    document.querySelectorAll(".gpt-box").forEach(t => {
        if (t.querySelector(".notification-toggle-btn")) return; const r = document.createElement("div"); r.className = "notification-toggle-btn"; const s = localStorage.getItem("GPTJsSetting.notification") !== "false"; r.innerHTML = s ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', r.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${s ? "#4CAF50" : "#FF9800"};
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      z-index: 1000;
      opacity: 0.7;
      transition: all 0.3s ease;
    `, r.addEventListener("mouseover", () => { r.style.opacity = "1" }), r.addEventListener("mouseout", () => { r.style.opacity = "0.7" }), r.addEventListener("click", () => {
            const o = localStorage.getItem("GPTJsSetting.notification") !== "false"; localStorage.setItem("GPTJsSetting.notification", !o), r.innerHTML = o ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>', r.style.backgroundColor = o ? "#FF9800" : "#4CAF50"; const a = document.getElementById("GPTJsSetting.notification"); a && (a.checked = !o); const d = o ? "桌面通知已关闭" : "桌面通知已开启", f = document.createElement("div"); f.textContent = d, f.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${o ? "#FF9800" : "#4CAF50"};
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        z-index: 10000;
        transition: all 0.3s;
      `, document.body.appendChild(f), setTimeout(() => { f.style.opacity = "0", setTimeout(() => { document.body.contains(f) && document.body.removeChild(f) }, 500) }, 3e3)
        }), t.style.position = "relative", t.appendChild(r)
    })
} function Re() { const e = new MutationObserver(r => { r.forEach(s => { s.addedNodes && s.addedNodes.length > 0 && s.addedNodes.forEach(o => { o.nodeType === 1 && o.classList && o.classList.contains("gpt-box") && ae() }) }) }), t = { childList: !0, subtree: !0 }; e.observe(document.body, t), ae() } window.addEventListener("load", Re); document.getElementById("ai-send-btn").addEventListener("click", Te); document.getElementById("ai-copy-btn").addEventListener("click", we); function Te() { const e = document.getElementById("ai-question").value.trim(); if (!e) { document.getElementById("ai-answer").innerText = "请输入问题内容"; return } document.getElementById("ai-answer").innerText = "正在思考中，请稍候..."; const t = document.getElementById("modelSelect").value; let r = localStorage.getItem("GPTJsSetting.key") || localStorage.getItem("tiku_key") || ""; if (!r) { document.getElementById("ai-answer").innerText = "请在设置中配置您的Key", n("未配置Key，请在设置中配置您的Key", "red"); return } n("使用模型: " + t, "#1890ff"); const s = { messages: [{ role: "system", search: "true", content: "你是一个专业的答题助手,请帮我解答以下问题。" }, { role: "user", content: e }], model: t }; GM_xmlhttpRequest({ method: "POST", url: API_BASE_URL + "?act=ai", headers: { Accept: "application/json", Authorization: "Bearer " + r, "Content-Type": "application/json" }, data: JSON.stringify(s), timeout: 1e4, onload: function (o) { try { const a = JSON.parse(o.responseText); if (o.status === 200) { if (a.code === 1001) { document.getElementById("ai-answer").innerText = "错误: " + a.msg, n("AI回答失败: " + a.msg, "red"); return } if ((a.code === 1e3 || a.code === 200) && a.data && a.data.answer) { const d = a.data.answer; document.getElementById("ai-answer").innerText = d, n("AI回答成功", "#10b981") } else document.getElementById("ai-answer").innerText = "获取答案失败: API返回格式错误", n("AI回答失败: API返回格式错误", "red") } else document.getElementById("ai-answer").innerText = "获取答案失败: 服务器响应错误 " + o.status, n("AI回答失败: 服务器响应错误 " + o.status, "red") } catch (a) { document.getElementById("ai-answer").innerText = "获取答案失败: " + a.message, n("AI回答失败: " + a.message, "red") } }, onerror: function (o) { document.getElementById("ai-answer").innerText = "获取答案失败，请检查网络连接", n("AI请求错误: " + o.message, "red") }, ontimeout: function () { document.getElementById("ai-answer").innerText = "获取答案失败，请求超时", n("AI请求超时", "red") } }) } function we() { const e = document.getElementById("ai-answer").innerText; e && e !== "正在思考中，请稍候..." && e !== "AI 助手已准备就绪，请输入您的问题..." && navigator.clipboard.writeText(e).then(() => { n("答案已复制到剪贴板", "#10b981"); const t = document.getElementById("ai-copy-btn"), r = t.innerText; t.innerText = "复制成功", t.style.backgroundColor = "#52c41a", setTimeout(() => { t.innerText = r, t.style.backgroundColor = "#722ed1" }, 1500) }).catch(t => { n("复制失败: " + t, "red") }) } function We() { const e = document.querySelector(".gpt-box"), t = document.getElementById("ai-log-toggle"); e && (e.style.display === "none" ? (e.style.display = "block", t.innerText = "隐藏日志", t.style.backgroundColor = "#1890ff", localStorage.setItem("GPTJsSetting.hideGptBox", "false")) : (e.style.display = "none", t.innerText = "显示日志", t.style.backgroundColor = "#8c8c8c", localStorage.setItem("GPTJsSetting.hideGptBox", "true"))) } function Le() { const e = document.getElementById("ai-log-toggle"); if (!e) return; e.addEventListener("click", We), localStorage.getItem("GPTJsSetting.hideGptBox") === "true" ? (e.innerText = "显示日志", e.style.backgroundColor = "#8c8c8c") : (e.innerText = "隐藏日志", e.style.backgroundColor = "#1890ff") } document.getElementById("ai-send-btn").addEventListener("click", Te); document.getElementById("ai-copy-btn").addEventListener("click", we); setTimeout(() => { document.getElementById("ai-log-toggle") && Le() }, 1e3); function ee(e, t) { return new Promise((r, s) => { if (!e || e.trim() === "") { s("问题不能为空"); return } n(`尝试使用AI回答问题: ${e.substring(0, 30)}...`, "#1890ff"), n(`题型: ${t || "未知题型"}`, "#1890ff"); const o = localStorage.getItem("GPTJsSetting.model") || "gpt-3.5-turbo-16k"; n(`使用模型: ${o}`, "#1890ff"); let a = localStorage.getItem("GPTJsSetting.key") || localStorage.getItem("tiku_key") || ""; if (!a) { n("未配置Key，无法使用AI回答", "red"), s("未配置Key"); return } let d = "你是一个专业的答题助手。"; t && (d += `这是一道${t}，请给出准确答案。`, t.includes("单选题") || t.includes("多选题") ? d += "请直接给出选项字母，例如A或ABC。" : t.includes("判断题") ? d += "请直接回答'正确'或'错误'。" : t.includes("填空题") && (d += "请直接给出填空内容，无需额外说明。")); const f = { messages: [{ role: "system", search: "true", content: d }, { role: "user", content: e }], model: o }; let m = !1; const g = setTimeout(() => { if (m = !0, n("AI请求超时，未收到响应", "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("转为使用随机答题...", "orange"); const b = D(t); r(b) } else s("请求超时，未收到响应") }, 13e4); try { GM_xmlhttpRequest({ method: "POST", url: API_BASE_URL + "?act=autoai", headers: { Accept: "application/json", Authorization: "Bearer " + a, "Content-Type": "application/json" }, data: JSON.stringify(f), timeout: 12e4, onload: function (b) { if (clearTimeout(g), !m) try { if (!b.responseText) { n("AI响应内容为空", "red"), s("响应内容为空"); return } const y = JSON.parse(b.responseText); if (b.status === 200) { if (y.code === 1001) { n("AI回答失败: " + y.msg, "red"), s(y.msg); return } if ((y.code === 1e3 || y.code === 200) && y.data && y.data.answer) { const h = y.data.answer; if (!h.trim() || h.trim() === "无法回答" || h.trim() === "我不知道") { n("AI回答内容为空或无意义", "red"), s("无有效答案内容"); return } let l = h, u = !1; if (t && (t.includes("单选题") || t.includes("多选题"))) { const c = h.match(/(?:^|\s|答案[:：]?\s*)([A-D]+)(?:\s|$|\.)/i); c && c[1] && (l = c[1].toUpperCase(), u = !0) } else if (t && t.includes("判断题")) h.includes("正确") || /^(对|是|√|T|ri|true|yes)$/i.test(h.trim()) ? (l = "正确", u = !0) : (h.includes("错误") || /^(错|否|×|F|wr|false|no)$/i.test(h.trim())) && (l = "错误", u = !0); else if (t && t.includes("填空题")) { if (h.includes("答案：") || h.includes("答案:")) { const c = h.split(/答案[:：]/); c.length > 1 && (l = c[1].trim(), l = l.split(/[\n\r]+/)[0].trim(), u = !0) } l = l.replace(/^['"\[\(（【]|['"\]\)）】]$/g, "") } u = !0, n("最终处理后的AI答案: " + l, "green"), r(l) } else n("AI响应格式不正确或答案为空", "red"), s("无法提取有效答案") } else n("AI请求返回非200状态码: " + b.status, "red"), s("请求失败, 状态码: " + b.status) } catch (y) { n("处理AI响应时出错: " + y.message, "red"), s("解析响应失败: " + y.message) } }, onerror: function (b) { if (clearTimeout(g), !m) if (n("AI请求发送失败: " + (b.statusText || b), "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("请求失败，转为使用随机答题...", "orange"); const y = D(t); r(y) } else s("请求发送失败: " + (b.statusText || b)) }, ontimeout: function () { if (clearTimeout(g), !m) if (n("AI请求超时", "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("请求超时，转为使用随机答题...", "orange"); const b = D(t); r(b) } else s("请求超时") } }) } catch (b) { if (clearTimeout(g), n("发送AI请求时出错: " + b.message, "red"), localStorage.getItem("GPTJsSetting.randomAnswer") === "true") { n("异常错误，转为使用随机答题...", "orange"); const y = D(t); r(y) } else s("发送请求失败: " + b.message) } }) } function D(e) {
    n("准备使用随机答题功能...", "orange"), e || (e = "未知题型", n("题型未知，默认使用单选题随机答案", "orange")); let t = ""; if (e.includes("单选题")) { const r = ["A", "B", "C", "D"]; t = r[Math.floor(Math.random() * r.length)], n("随机生成单选题答案: " + t, "#E6A23C") } else if (e.includes("多选题")) { const r = ["A", "B", "C", "D"], s = Math.floor(Math.random() * 3) + 1; t = [...r].sort(() => .5 - Math.random()).slice(0, s).sort().join(""), n("随机生成多选题答案: " + t, "#E6A23C") } else if (e.includes("判断题")) t = Math.random() > .5 ? "正确" : "错误", n("随机生成判断题答案: " + t, "#E6A23C"); else if (e.includes("填空题")) t = "随机答案" + Math.floor(Math.random() * 1e3), n("随机生成填空题答案: " + t, "#E6A23C"); else { const r = ["A", "B", "C", "D"]; t = r[Math.floor(Math.random() * r.length)], n("随机生成未知题型答案: " + t, "#E6A23C") } return J("随机答题", `题型: ${e}
随机答案: ${t}`, ""), t
}
