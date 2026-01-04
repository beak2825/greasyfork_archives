// ==UserScript==
// @name         开发者常用网站去广告
// @namespace    http://zhengkai.blog.csdn.net/
// @version      1.1
// @description  我的世界从此清静了！文库复制、知乎去弹窗、csdn/cnblog/oschina无广告
// @author       zhengkai.blog.csdn.net
// @match        *://my.oschina.net/*
// @match        *://www.cnblogs.com/*
// @match        *://*.csdn.net/*
// @match        *://www.baidu.com/*
// @match        *://wenku.baidu.com/*
// @match        *://www.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415896/%E5%BC%80%E5%8F%91%E8%80%85%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/415896/%E5%BC%80%E5%8F%91%E8%80%85%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cnblogs = /www.cnblogs.com/
    var oschina = /my.oschina.net/
    var csdn = /csdn.net/
    var baidu = /www.baidu.com/
    var wenku = /wenku.baidu.com/
    var zhihu = /www.zhihu.com/
    var currentURL = window.location.href;

    setTimeout(function () {
        if(oschina.test(currentURL)){
            document.getElementsByClassName("adsbygoogle").remove();
        }
        if(cnblogs.test(currentURL)){
            document.getElementById("div-gpt-ad-1539008685004-0").remove();//文章底部广告
            document.getElementById("cnblogs_c1").remove();
            document.getElementById("cnblogs_a1").remove();
            for(var i = 1 ; i<5;i++){
                document.getElementById("cnblogs_b"+i).remove();//首页右侧广告
            }
        }
        //百度移除烦人的推荐
        if(baidu.test(currentURL)){
            document.getElementById("s_wrap").remove();
            document.getElementById("head_wrapper").style.height="100%";
            //去掉版权信息
            document.addEventListener("copy", function (e) {
                console.log('copy');
                var data = e.clipboardData;
                var text = data.getData('text');
                var pos = text.indexOf('————————————————');
                if (pos !== -1) {
                    text = text.substring(0, pos - 2);
                    data.setData('text', text);
                }
            });
        }
        //移除阻碍复制的功能
        if(wenku.test(currentURL)){
            if(document.getElementsByClassName("dialog-mask")){
                document.getElementsByClassName("sf-edu-wenku-vw-container").style="";
                document.getElementsByClassName("dialog-mask")[0].remove();
                document.getElementsByClassName("copy-limit-dialog")[0].remove();
                //document.getElementsByClassName("dialog-mask")[1].remove();
                //document.getElementsByClassName("copy-limit-dialog")[1].remove();
                //document.getElementsByClassName("toast-over-text-wrap").remove();
                document.getElementsByClassName("read-all").click();
                console.log("解锁copy");
            }
        }
        //CSDN主页以及博客页面去广告
        if(csdn.test(currentURL)){
            //主页
            document.getElementsByClassName("banner-ad-box")[0].remove();
            document.getElementsByClassName("indexSuperise")[0].remove();//自定义首页右侧悬浮广告去除
            document.getElementsByClassName("slide-outer right_top")[0].remove();//首页右侧轮播广告
            document.getElementsByClassName("right_box magazine_box")[0].remove();//
            //文章页面
            if (document.getElementById("btn-readmore")){
                document.getElementById("btn-readmore").click(); //CSDN文章自动展开
                localStorage.setItem("anonymousUserLimit", "");
            }
            for(var j = 1 ; j<5;j++){
                document.getElementsByClassName("programmer"+j+"Box").remove();//右侧广告
            }
            //自动展开
            document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove(); //左上广告
            document.getElementById("asideFooter").remove();
            document.getElementById("adContent").remove();
            document.getElementsByClassName("p4course_target")[0].remove();
            document.getElementsByClassName("bdsharebuttonbox")[0].remove();
            document.getElementsByClassName("vip-caise")[0].remove();
            document.getElementsByClassName("fourth_column")[0].remove();
            //去掉版权信息
            document.addEventListener("copy", function (e) {
                console.log('copy');
                var data = e.clipboardData;
                var text = data.getData('text');
                var pos = text.indexOf('————————————————');
                if (pos !== -1) {
                    text = text.substring(0, pos - 2);
                    data.setData('text', text);
                    console.log("解锁copy");
                }
            });
        }
        //移除知乎烦人的弹窗
        if(zhihu.test(currentURL)){
          document.getElementsByClassName("Modal-wrapper")[0].remove();
        }
        //console.log("https://zhengkai.blog.csdn.net")
    }, 3000);
})();