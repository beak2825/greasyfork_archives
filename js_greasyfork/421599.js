// ==UserScript==
// @name         屏蔽高速下载器
// @namespace    http://www.baidu.com
// @version      2.0.2
// @description  屏蔽高速下载器，自动去除高速下载器毒瘤，只保留普通下载地址，不会吧不会吧，不会真有人用高速下载器下载东西吧？
// @author       Jesen
// @icon         https://github.githubassets.com/favicon.ico
// @match        *://*.onlinedown.net/*
// @match        *://*.xitongzhijia.net/*
// @match        *://*.xitongtiandi.net/*
// @match        *://*.soft-down.net/*
// @match        *://*.downza.cn/*
// @match        *://*.singdown.com/*
// @match        *://*.ucbug.com/*
// @match        *://*.42xz.com/*
// @match        *://*.xz7.com/*
// @match        *://*.32r.com/*
// @match        *://dl.pconline.com.cn/*
// @match        *://pc.qq.com/*
// @match        *://*.qqtn.com/*
// @match        *://*.ddooo.com/*
// @match        *://*.pc6.com/*
// @match        *://*.xiazaiba.com/*
// @match        *://*.cr173.com/*
// @match        *://*.cncrk.com/*
// @match        *://*.crsky.com/*
// @match        *://*.mydown.com/*
// @match        *://*.bear20.com/*
// @match        *://*.duote.com/*
// @match        *://*.xpgod.com/*
// @match        *://*.uzzf.com/*
// @match        *://*.yesky.com/*
// @match        *://*.opdown.com/*
// @match        *://*.jb51.net/*
// @match        *://*.pchome.net/*
// @match        *://*.jisuxz.com/*
// @match        *://*.pc0359.cn/*
// @match        *://*.itmop.com/*
// @match        *://*.greenxiazai.com/*
// @match        *://*.wmzhe.com/*
// @match        *://*.xfdown.com/*
// @match        *://*.veryhuo.com/*
// @match        *://*.weidown.com/*
// @match        *://*.easck.com/*
// @match        *://*.downcc.com/*
// @match        *://*.aiweibk.com/*
// @match        *://*.xphome.org/*
// @match        *://*.downxia.com/*
// @match        *://xiazai.zol.com.cn/*
// @match        *://*.dyjqd.com/*
// @match        *://*.winwin7.com/*
// @match        *://*.51xiazai.cn/*
// @match        *://*.3dmgame.com/*
// @match        *://*.liqucn.com/*
// @match        *://*.ali213.net/*
// @match        *://*.youxi527.com*/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/421599/%E5%B1%8F%E8%94%BD%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421599/%E5%B1%8F%E8%94%BD%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var blackReg = /高速下载|安全下载|软件管家|Windsoul|anquanxiazai/i;
    var tmp = undefined;
    function s_remove(selectName) {
        let tmp = document.querySelectorAll(selectName);
        for (let i = 0; i < tmp.length; i++) {
            tmp[i]?.remove() || -1;
        }
    }
    function c_setnone(cname) {
        let tmp = document.getElementsByClassName(cname);
        for (let i = 0; i < tmp.length; i++) {
            tmp[i].style.display = "none";
        }
    }
    function c_set0h(cname) {
        let tmp = document.getElementsByClassName(cname);
        for (let i = 0; i < tmp.length; i++) {
            tmp[i].style.height = 0;
        }
    }
    function t_setnone(tname, blackword) {
        let tmp = document.getElementsByTagName(tname);
        for (let i = 0; i < tmp.length; i++) {
            if (blackReg.test(tmp[i].innerHTML) || (blackword && tmp[i].innerHTML.indexOf(blackword) != -1)) {
                tmp[i].style.display = "none";
            }
        }
    }
    function w_setnone(tname, blackword) {
        let tmp = document.getElementsByTagName(tname);
        for (let i = 0; i < tmp.length; i++) {
            // if(tmp[i].innerText.indexOf(bword)!=-1){
            if (blackReg.test(tmp[i].innerHTML) || (blackword && tmp[i].innerHTML.indexOf(blackword) != -1)) {
                tmp[i].style.display = "none";
            }
        }
    }
    if (location.host.indexOf("onlinedown.net") != -1) {
        //华军软件园
        c_setnone("gaosu");
        w_setnone("a");
        w_setnone("h4");
        w_setnone("h3")
        setInterval(() => {
            c_setnone("down_gaosu");
        }, 300)
        return;
    }
    if (location.host.indexOf("downza.cn") != -1) {
        //下载之家
        c_setnone("gaosu");
        w_setnone("a");
        w_setnone("h4");
        w_setnone("p");
        return;
    }
    if (location.host.indexOf("singdown.com") != -1) {
        //星动下载
        c_setnone("top-speed-download");
        c_setnone("newDownloadBox_bottom");
        c_setnone("aqDownload");
        w_setnone("button");
        return;
    }
    if (location.host.indexOf("ucbug.com") != -1) {
        //ucbug
        c_setnone("downnow");
        document.getElementsByClassName("downloader")[0].innerHTML = ""; //高速下载提示框
        document.getElementsByClassName("bendown")[0].style.background = ""; //本来是暗色不容易看见，改成了绿色
        document.getElementsByClassName("BzClick")[0].innerHTML = ""; //高速下载地址
        document.getElementsByClassName("BzClick")[1].innerHTML = ""; //高速下载地址
        return;
    }
    if (location.host.indexOf("xitongzhijia.net") != -1) {
        //xitongzhijia
        c_setnone("btn-dl_swift");
        c_setnone("m_swift");
        c_setnone("Acnowk");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("xitongtiandi.net") != -1) {
        //xitongtiandi
        c_setnone("load_qk");
        c_setnone("xzq");
        return;
    }
    if (location.host.indexOf("42xz.com") != -1) {
        //42xz绿盒
        c_setnone("gsxz");
        c_setnone("one");
        c_setnone("two");
        c_setnone("dxxz");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("xz7.com") != -1) {
        //jiguangxiazaizhan
        c_setnone("bzxz");
        c_setnone("xx_yd");
        t_setnone("b");
        return;
    }
    if (location.host.indexOf("32r.com") != -1) {
        //3322下载站
        c_setnone("gsdbtn");
        c_setnone("ptgsxz");
        t_setnone("p");
        t_setnone("a");
        return;
    }
    if (location.host.indexOf("dl.pconline.com.cn") != -1) {
        //pconline
        let tmp = document.getElementsByClassName("sh-down-btn")[0];
        if (tmp != undefined) {
            tmp.parentNode.removeChild(tmp);
        }
        tmp = document.getElementById("fast_0");
        if (tmp != undefined) {
            tmp.parentNode.removeChild(tmp);
        }
        t_setnone("span");
        return;
    }
    if (location.host.indexOf("qqtn.com") != -1) {
        //qqtn
        c_setnone("u-gs-btn");
        c_setnone("left_add");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("ddooo.com") != -1) {
        //多多软件
        setInterval(() => {
            w_setnone("li", "电脑助手");
            s_remove(".ddgs_down")
        }, 500)
        // tmp = document.getElementsByClassName("DownloadSfotCon")[0].children[1];
        // tmp.style.display = "none";
        return;
    }
    if (location.host.indexOf("pc6.com") != -1 || location.host.indexOf("pc0359.cn") != -1) {
        //pc6
        c_setnone("downnow");
        c_setnone("one");
        t_setnone("h3");
        tmp = document.getElementById("gaosuxiazai");
        tmp.style.display = "none";
        return;
    }
    if (location.host.indexOf("xiazaiba.com") != -1) {
        //下载吧
        document.getElementsByClassName("soft-down")[1].style.display = "none";
        t_setnone("span");
        c_setnone("down-group");
        return;
    }
    if (location.host.indexOf("cr173.com") != -1 || location.host.indexOf("xfdown.com") != -1 || location.host.indexOf("downcc.com") != -1) {
        //西西软件or旋风下载or绿色资源网
        c_setnone("downnowgaosu");
        c_setnone("xiazaiqi");
        t_setnone("b");
        t_setnone("h3");
        c_setnone("downurl");
        return;
    }
    if (location.host.indexOf("bear20.com") != -1 || location.host.indexOf("mydown.com") != -1) {
        //极速下载，小熊下载
        c_setnone("dx_bths1");
        c_setnone("gs_btns");
        return;
    }
    if (location.host.indexOf("xiazai..com.cn") != -1) {
        //下载
        //document.getElementById("downloader_main1").style.display = "none"
        document.getElementById("downloader_main").style.display = "none"
        c_setnone("xiazaic-topb-box");
        c_setnone("higha");
        c_setnone("one");
        c_setnone("two");
        w_setnone("h4", "官方下载地址")
        return;
    }
    if (location.host.indexOf("cncrk.com") != -1) {
        //起点
        document.getElementById("gsxza").style.display = "none"
        c_setnone("gaosu_btn");
        c_setnone("dxzq");
        c_setnone("one");
        c_setnone("two");
        t_setnone("span")
        return;
    }
    if (location.host.indexOf("crsky.com") != -1) {
        //非凡软件站crsky
        c_setnone("Gs_d");
        c_setnone("wxImg_btn");
        t_setnone("span");
        t_setnone("h4");
        return;
    }
    if (location.host.indexOf("duote.com") != -1) {
        //多特软件站
        c_setnone("fast-down-btn");
        c_setnone("down-title");
        c_setnone("downFast-list");
        t_setnone("span");
        t_setnone("h4");
        return;
    }
    if (location.host.indexOf("xpgod.com") != -1) {
        //系统天堂
        c_setnone("bzxz");
        c_setnone("new_xzq");
        c_setnone("show_xzq");
        return;
    }
    if (location.host.indexOf("uzzf.com") != -1) {
        //东坡下载
        c_setnone("f-uzzf-down");
        c_setnone("f-uzzf-link");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("jb51.net") != -1) {
        //jb51脚本之家
        c_setnone("gsdown");
        c_setnone("downgs");
        c_setnone("gs");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("yesky") != -1) {
        //tianji
        c_setnone("ad_360");
        c_setnone("down_referer");
        c_setnone("down_referrer");
        t_setnone("h4");
        c_setnone("newdown");
        w_setnone("button");
        tmp = document.getElementsByTagName("a");
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].innerHTML.indexOf("下载") != -1) {
                if (tmp[i] != undefined && tmp[i].onclick != undefined && tmp[i].onclick.toString().indexOf("底部'") != -1) {
                    tmp[i].style.display = "none";
                }
            }
        }
        return;
    }
    if (location.host.indexOf("pchome.net") != -1) {
        //pchome
        c_setnone("ad");
        c_setnone("dl-tip");
        return;
    }
    if (location.host.indexOf("opdown.com") != -1) {
        //欧普下载
        c_setnone("downnows");
        c_setnone("c_down");
        return;
    }
    if (location.host.indexOf("jisuxz.com") != -1) {
        //jisuxz
        c_setnone("dl_gaosu");
        setInterval(function () { c_setnone("xiazaiqi"); t_setnone("span"); }, 100)
        return;
    }
    if (location.host.indexOf("itmop.com") != -1) {
        //itmop
        c_setnone("xiazaiqi");
        c_setnone("downnowgaosu");
        t_setnone("h3");
        tmp = document.getElementById("gaosuxiazai");
        tmp.style.display = "none";

        return;
    }
    if (location.host.indexOf("greenxiazai.com") != -1) {
        //greenxiazai
        tmp = document.getElementsByClassName("downbtn")[0].children;
        tmp[1].style.display = "none";

        setInterval(function () {
            t_setnone("b");
            t_setnone("span");
            c_setnone("yinsu_xz");
            c_set0h("yinsu_xz");
            c_setnone("bzxz");
            c_set0h("bzxz");
        }, 100)
        return;
    }
    if (location.host.indexOf("wmzhe.com") != -1) {
        //完美下载站
        c_setnone("gs");
        c_setnone("downloader");
        return;
    }
    if (location.host.indexOf("11684.com") != -1) {
        //巴士下载站
        c_setnone("bzxz");
        c_setnone("bzClick");
        c_setnone("sm-soft");
        return;
    }
    if (location.host.indexOf("veryhuo.com") != -1) {
        //必火
        c_setnone("bendown");
        c_setnone("gs");
        c_setnone("gs2");
        return;
    }
    if (location.host.indexOf("weidown.com") != -1) {
        //weidown
        t_setnone("a");
        t_setnone("p");
        return;
    }
    if (location.host.indexOf("easck.com") != -1) {
        //easck
        c_setnone("bzxz1");
        c_setnone("bzxz2");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("aiweibk.com") != -1) {
        //easck
        c_setnone("gsxz");
        c_setnone("lili");
        t_setnone("p");
        return;
    }
    if (location.host.indexOf("soft-down.net") != -1) {
        //soft-down.net
        c_setnone("soft-text-r");
        c_setnone("box-top-xiazai");
        t_setnone("span");
        return;
    }
    if (location.host.indexOf("downxia.com") != -1) {
        //soft-down.net
        c_setnone("bendown");
        c_setnone("gaosu_down_div");
        t_setnone("h3");
        return;
    }
    if (location.host.indexOf("dyjqd.com") != -1) {
        //dyjqd.com
        c_setnone("bzxz");
        c_setnone("BZ_DOWN");
        c_setnone("bzClick");
        return;
    }
    if (location.host.indexOf("winwin7.com") != -1) {
        //winwin7.com
        c_setnone("gsdt");
        c_setnone("bzxz1");
        return;
    }
    if (location.host.indexOf("51xiazai.cn") != -1) {
        //51xiazai.cn
        w_setnone("a", "优先下载金山毒霸");
        return;
    }
    if (location.host.indexOf("3dmgame.com") != -1) {
        //3dmgame.com
        c_setnone("btnsecurity");
        c_setnone("Bean_buns"); //豆包广告
        return;
    }
    if (location.host.indexOf("liqucn.com") != -1) {
        //liqucn.com
        w_setnone("a", "安全下");
        return;
    }
    if (location.host.indexOf("pc.qq.com") != -1) {
        //腾讯电脑管家推广
        console.log("2131322");
        setInterval(() => {
            c_setnone("inner_content_box_b");
            w_setnone("a", "下载电脑管家");
            w_setnone("a", "使用管家下载");
        }, 500);
        return;
    }
    if (location.host.indexOf("ali213.net") != -1 || location.host.indexOf("youxi527.com") != -1) {
        //游侠
        console.log("2131322");

        setInterval(() => {
            document.querySelector("#box99btn").remove();
        }, 500);
        return;
    }
    if (location.host.indexOf("zol.com.cn") != -1) {
        //zol
        s_remove('#downBoxGaosu');
        s_remove('.down-append-mol__pic');
        s_remove('.gmine_ad');
        s_remove('.fixed-bar');
        s_remove('.downloat-box');
        s_remove('#DomId');s_remove('#sideDoubao');
        return;
    }
})();