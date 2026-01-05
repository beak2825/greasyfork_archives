// ==UserScript==
// @name         优酷首页优化
// @namespace    http://blog.studyxiao.cn
// @version      0.2.3
// @description  把不需要的板块儿都屏蔽了吧，最主要的是“优酷一点也不懂我”。
// @author       jixun66, studyxiao
// @match        http://www.youku.com/
// @icon         http://daohang.studyxiao.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/30123/%E4%BC%98%E9%85%B7%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/30123/%E4%BC%98%E9%85%B7%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function(style) {
    style.textContent = ""+
        "#m_2566,"+ //大鱼号精选
        "#m_2539,"+ //优酷懂你
        "#m_2569,"+ //娱乐
        "#m_2570,"+ //来疯直播
        "#m_2571,"+ //咨询
        "#m_2574,"+ //搞笑
        "#m_2575,"+ //文化·纪实
        "#m_2591,"+ //生活·时尚
        "#m_2592,"+ //旅游·亲子
        "#m_2593,"+ //教育·公益
        "#m_2594,"+ //汽车
        "#m_2596,"+ //游戏
        "#m_2568,"+ //体育
        "#m_2545,"+
        "#m_2560,"+
        "#m_3363,"+
        "#m_2597,"+
        ".g-footer dl,.g-footer .g-authentication,"+
        "m_test"+
        "{display:none;}";
    document.head.appendChild(style);
    window.onload=function(){
    //页脚简化
    var div_copyright = document.createElement("div");
    div_copyright.textContent = "Copyright©2018 优酷 youku.com 版权所有";
    div_copyright.setAttribute("style","text-align:center;color:black;margin:-10px auto 50px;font-size:16px;");
    var footer = document.querySelector(".g-footer");
    console.log(footer)
    footer.appendChild(div_copyright);
    }
})(document.createElement("style"));