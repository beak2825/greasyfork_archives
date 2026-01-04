// ==UserScript==
// @name         常用网站优化
// @namespace    http://blog.studyxiao.cn
// @version      0.1
// @description  把不需要的板块儿都屏蔽了。
// @author       studyxiao
// @match        http://www.youku.com/
// @match        https://www.360kan.com/
// @icon         http://daohang.studyxiao.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/368539/%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/368539/%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function(style) {
    if(isURL('youku.com')){
        style.textContent = ""+
            "#m_26659,"+ //即时热点
            "#m_26664,"+ //优酷懂你
            "#m_26668,"+
            "#m_26684,"+
            "#m_26685,"+ //娱乐
            "#m_26686,"+ //来疯直播
            "#m_26687,"+ //咨询
            "#m_26688,"+ //搞笑
            "#m_26890,"+ //音乐
            "#m_26690,"+ //文化·纪实
            "#m_26691,"+ //财经·科技
            "#m_26692,"+ //生活·时尚
            "#m_26693,"+ //旅游·亲子
            "#m_26694,"+ //教育·公益
            "#m_26695,"+ //汽车
            "#m_250058,"+
            "#m_26697,"+ //游戏
            "#m_26698,"+ //体育
            "#m_26699"+
            "{display:none;}";
    }
    if(isURL('360kan.com')){
        style.textContent = ""+
            "body > div.p-body > div > div:nth-child(1),"+ //热点聚焦
            "body > div.p-body > div > div:nth-child(5) > div > div.bagua," +
            "body > div.p-body > div > div:nth-child(10)," +
            "body > div.p-body > div > div:nth-child(11)," +
            "body > div.p-body > div > div.content-wrap.g-clear.js-dataslider-tj.js-figuread," +
            "#js-xinlan," + //网事大本营
            "body > div.p-body > div > div:nth-child(17)," +
            "body > div.p-body > div > div:nth-child(16)," + //音乐MV
            ".noting" +
            "{display:none!important;}";
    }

    document.head.appendChild(style);

    function isURL(x){
        return window.location.href.indexOf(x) != -1;
    }
})(document.createElement("style"));