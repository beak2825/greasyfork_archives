// ==UserScript==
// @name         Doracoin的自用工具
// @namespace    https://greasyfork.org/scripts/36797-doracoin%E7%9A%84%E8%87%AA%E7%94%A8%E5%B7%A5%E5%85%B7
// @version      1.8.6
// @description  清除某些页面自己不喜欢的内容，或更改某些网站的样式
// @author       Doracoin
// @license      MIT
// @match        *://*/*
// @match        *://www.sohu.com/a/*
// @match        *://jiecaobao.com/*
// @match        *://wuzhi.me/*
// @match        *://rule34.xxx/*
// @match        *://mp.weixin.qq.com/s?*
// @match        *://blog.csdn.net/*
// @match        *://www.pixiv.net/search.php*
// @match        *://www.pixiv.net/*/artworks/*
// @match        *://996.icu/*
// @match        *://hennojin.com/*
// @match        *://*.lvv2.com/*
// @match        *://*.javbus22.com/*.jpg
// @match        *://*.bilibili.com/video/*
// @match        *://js.org/
// @match        *://item.jd.com/*
// @match        *://www.msn.cn/zh-cn/news/other/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36797/Doracoin%E7%9A%84%E8%87%AA%E7%94%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/36797/Doracoin%E7%9A%84%E8%87%AA%E7%94%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = document.location.toString();
    console.log("doracoin's kit: current host is : " + window.location.host);
    console.log("URL is : " + url);

    GM_registerMenuCommand('生成当前网页二维码', () => {
        //new qrcode(document.body, window.location.href);
        let qrCodeUrl = "https://doracoin.cc/usr/themes/aria/lib/getQRCode.php?url=" + window.location.href
        GM_openInTab(qrCodeUrl, { active: true, insert: true, setParent: true })

        let qrCodeSize = 256;
        let borderWitdh = 10;//px
        let qrCodeMask = document.createElement("div");
        qrCodeMask.setAttribute("id", "qrcode_mask");
        qrCodeMask.style.cssText = "background: #00000040; width: 100%; height: 100%; position: fixed; left: 0; top: 0; text-align: center;";
        document.body.append(qrCodeMask);
        qrCodeMask.onclick = function () {
            qrCodeMask.parentNode.removeChild(qrCodeMask);
        };

        let qrCodeDiv = document.createElement("div");
        qrCodeDiv.setAttribute("id", "qrcode");
        qrCodeDiv.style.cssText = "width:" + (qrCodeSize + borderWitdh * 2) + "px; height:" + (qrCodeSize + borderWitdh * 2) + "px; background: white; position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto;";
        qrCodeMask.append(qrCodeDiv);
        //new QRCode(document.getElementById("qrcode"), window.location.href);
        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: qrCodeSize,
            height: qrCodeSize,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        qrCodeDiv.childNodes[1].style.cssText += "position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto;z-index: 10010;"
    })

    GM_registerMenuCommand('开启当前网页翻译功能', () => {
        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= 'https://res.zvo.cn/translate/inspector_v2.js';
        head.appendChild(script);
    })

    // bilibili.com
    if (window.location.host.indexOf("bilibili.com") > -1) {
        GM_registerMenuCommand('获取此视频封面', () => {
            GM_openInTab(document.querySelector('meta[itemprop="image"]').getAttribute('content'), { insert: true, setParent: true })
        })
        var checkAdCounts = 0;
        var checkAdInterval = null;
        window.onload = function () {
            checkAdInterval = setInterval(function () {
                if (++checkAdCounts > 10 && checkAdInterval != null) {
                    clearInterval(checkAdInterval);
                    return;
                };
                var ad = document.querySelector(".ad-report.video-card-ad-small");
                if (ad != null) {
                    ad.style = "display:none;"
                }
                var liveAd = document.querySelector(".pop-live-small-mode");
                if (liveAd != null) {
                    liveAd.style = "display:none;"
                }
                var bannerAd = document.querySelector("#bannerAd");
                if (bannerAd != null) {
                    bannerAd.style = "display:none;"
                }
            }, 1000);
        }
    }

    // jianshu.com
    if (window.location.host.indexOf("jianshu.com") > -1) {
        setTimeout(()=>{
            var mask = document.querySelector("._23ISFX-mask");
            console.log(`jianshu mask: ${mask}`);
            if (mask != null) {
                mask.remove();
            }
            var wrap = document.querySelector("._23ISFX-wrap");
            console.log(`jianshu wrap: ${wrap}`);
            if (wrap != null) {
                wrap.remove();
            }
        }, 3000)
    }

    // zhihu.com
    if (window.location.host.indexOf("zhihu.com") > -1) {
        var zhHeaderRemoveCounts = 0;
        var zhHeaderRemoveFunc = function () {
            let zhHeader = document.querySelector("header");
            if (zhHeader) {
                zhHeader.classList.remove("is-fixed");
            }
            if(++zhHeaderRemoveCounts<5){
                setTimeout(zhHeaderRemoveFunc,1000);
                console.log(`zhihu去除标题栏浮动第${zhHeaderRemoveCounts}次尝试`);
            }else{
                zhHeaderRemoveCounts=0;
            }
        };
        window.onscroll = function() {
            console.log("zhihu去除标题栏浮动onscroll");
            zhHeaderRemoveFunc();
        };
        window.onload = function () {
            console.log("zhihu去除标题栏浮动onload");
            zhHeaderRemoveFunc();
        }
    }

    // js.org
    if (window.location.host.indexOf("js.org") > -1) {
        document.querySelector("html").style.backgroundColor = "rgba(255, 231, 11, 0.54)";
    }

    // www.msn.cn
    if (window.location.host.indexOf("www.msn.cn") > -1) {
        window.onload = function () {
            console.log("窗口加载完成");
            setTimeout(function () {
                console.log("查询源链接信息");
                var originHref = document.querySelector('link[rel="canonical"]').href;
                var originLink = document.createElement("a");
                originLink.href = originHref;
                originLink.innerHTML = originHref;
                var p = document.createElement("p");
                p.innerHTML = "源链接:<br>";
                p.appendChild(originLink);
                document.querySelector(".viewsHeaderInfoLeft-DS-EntryPoint1-1").appendChild(p);
            }, 1500);
        }
    }

    // jiecaobao.com
    if (window.location.host == "jiecaobao.com") {
        var unlikeImg = document.getElementsByClassName("alignnone");
        console.log('unlikeImg: ' + unlikeImg);
        if (unlikeImg.length > 0) {
            unlikeImg[unlikeImg.length - 1].src = "http://wx4.sinaimg.cn/mw690/7eb932c3ly1fmwb9f12zlj205k05k750.jpg";
            console.log("已替换该网页上自己讨厌的插图");
        }
    }

    // 吾志-日记网站
    else if (window.location.host == "wuzhi.me") {
        var header = document.getElementsByClassName("header");
        if (header != null && header.length > 0) {
            header[0].style.background = "#0097A7";
        }
        var header_w = document.getElementsByClassName("header_w");
        if (header_w != null && header_w.length > 0) {
            for (var i = 0; i < header_w.length; i++) {
                header_w[i].style.color = "#FFFFFF";
            }
        }
        var header_reg = document.getElementsByClassName("header_reg");
        if (header_reg != null && header_reg.length > 0) {
            for (var j = 0; j < header_reg.length; j++) {
                header_reg[j].style.color = "#FFFFFF";
            }
        }
        var footer_container = document.getElementsByClassName("footer container");
        if (footer_container != null && footer_container.length > 0) {
            //
        }
        console.log("已更改部分页面样式");
    }

    // 屏蔽搜狐右边的垃圾推荐
    else if (window.location.host == "www.sohu.com") {
        var sohuRightBar = document.getElementsByClassName("sidebar right");
        if (sohuRightBar != null && sohuRightBar.length > 0) {
            sohuRightBar[0].style.display = "none";
            console.log("已屏蔽搜狐右侧垃圾推荐信息");
        }
    }

    // 屏蔽某网站广告
    else if (window.location.host == "rule34.xxx") {
        var paginator = document.getElementById("paginator");
        if (paginator != null) {
            console.log(paginator);
            var inners = document.getElementsByTagName("center");
            if (inners != null && inners.length > 0) {
                console.log(inners);
                for (var k = 0; k < inners.length; k++) {
                    inners[k].style.display = "none";
                }
            }
        }
    }

    // 尝试显示微信文章封面图片
    else if (window.location.host == "mp.weixin.qq.com") {
        console.log("doracoin");
        GM_registerMenuCommand('获取此文章封面', () => {
            GM_openInTab(document.querySelector('meta[property="og:image"]').getAttribute('content'), { insert: true, setParent: true })
        })
        // 尝试打印更多推荐的链接
        window.setTimeout(function () {
            var wxMoreList = document.querySelectorAll("div[data-url]");
            console.log("▽查询到的推荐元素：" + wxMoreList.length + "个:");
            console.log(wxMoreList);
            var wxMoreListTitle = document.querySelectorAll('div.mask_ellipsis_text[aria-hidden="true"]');
            console.log("▽查询到的推荐标题：");
            console.log(wxMoreListTitle);
            for (var inx = 0; inx < wxMoreList.length; inx++) {
                var title = "";
                if (inx < wxMoreListTitle.length) {
                    title = wxMoreListTitle[inx].textContent;
                }
                console.log("更多推荐 " + (inx + 1) + "：" + title + "\"" + wxMoreList[inx].getAttribute("data-url") + "\"");
            }
        }, 2000);
    }

    // 清除CSDN学院广告
    else if (window.location.host == "blog.csdn.net") {
        // 展开全文按钮
        var btnReadMore = document.getElementById("btn-readmore-zk");
        if (btnReadMore != null) {
            btnReadMore.click();
        }
        // 去广告，但不一定生效
        var csdn_edu = document.getElementsByClassName("edu-promotion");
        if (csdn_edu != null && csdn_edu.length > 0) {
            csdn_edu[0].style.display = "none";
        }
        var csdn_edu2 = document.getElementsByClassName("p4course_target");
        if (csdn_edu2 != null && csdn_edu2.length > 0) {
            csdn_edu2[0].style.display = "none";
        }
        var csdn_edu3 = document.getElementsByClassName("fourth_column");
        if (csdn_edu3 != null && csdn_edu3.length > 0) {
            csdn_edu3[0].style.display = "none";
        }
        var loginDiv = document.getElementsByClassName("pulllog-box");
        if (loginDiv != null && loginDiv.length > 0) {
            loginDiv[0].style.display = "none";
        }
        console.log("已隐藏CSDN广告并自动展开全文");
    }

    // 去除 Pixiv搜索结果中提示“premium会员”的蒙板
    else if (window.location.host == "www.pixiv.net") {
        console.log("正在尝试去除会员广告的蒙板");
        var pxPreAD = document.getElementsByClassName("popular-introduction-overlay");
        if (pxPreAD != null && pxPreAD.length > 0) {
            pxPreAD[0].style.display = "none";
        }
        // 去除Pixiv作品页右侧动图广告
        var gifAds = document.getElementById("ad_img");
        if (gifAds != null) {
            gifAds.src = "https://www.pixiv.net/favicon.ico";
        }
        var frameAds = document.getElementById("imobile_adspotframe1");
        if (frameAds != null) {
            frameAds.style.display = "none";
        }
    }

    // 996.ICU的背景色粉色太伤眼睛了，自行替换为深蓝色
    else if (window.location.host == "996.icu") {
        document.body.style.backgroundColor = "#003873";
        var lang = document.getElementsByClassName("language-menu");
        if (lang != null && lang.length > 0) {
            lang[0].style.backgroundColor = "#337ede";
        }
    }

    // hennojin.com 漫画网
    else if (window.location.host == "hennojin.com") {
        var mlinks = document.getElementsByTagName("a");
        for (i = 0; i <= mlinks.length; i++) {
            var item = mlinks[i];
            if (item.text == "Read Online") {
                item.href = item.href.replace("view=page", "view=multi");
                console.log("已找到阅读按钮并替换链接: " + item.href);
                break;
            }
        }
    }

    // 网站字体优化
    else if (window.location.host == "reader.doracoin.cc") {
        var titleClass = document.getElementsByClassName("flux_header");
        if (titleClass != null && titleClass.length > 0) {
            for (i = 0; i <= titleClass.length; i++) {
                //titleClass[i].style.fontSize="1rem";
                //titleClass[i].style.lineHeight="1.2rem";
            }
        }
    }

    // 隐藏底部广告
    else if (window.location.host == "www.lvv2.com" || window.location.host == "lvv2.com") {
        var lvv2Ad = document.getElementsByClassName("interest-news-area");
        if (lvv2Ad != null) {
            console.log("感兴趣布局共" + lvv2Ad.length + "元素");
            console.log("child: " + lvv2Ad[0] + "\nparent: " + lvv2Ad[0].parentNode);
            lvv2Ad[0].parentNode.removeChild(lvv2Ad[0]);
            console.log("已移除 猜你感兴趣布局");
        }
        var lvv2Side = document.getElementsByClassName("side");
        if (lvv2Side != null) {
            var sideBar = lvv2Side[0];
            var sideBarChildCounts = sideBar.children.length;
            console.log("已找到 侧边栏，共 " + sideBarChildCounts + " 项子元素");
            for (i = 1; i <= 2; i++) {
                sideBar.removeChild(sideBar.children[sideBarChildCounts - i]);
            }
            console.log("已移除 侧边栏");
        }
        var loginPopup = document.getElementById("login-popup");
        if (loginPopup != null) {
            loginPopup.parentNode.removeChild(loginPopup);
            console.log("已移除 登录弹窗，为了删掉布局内的登录图片");
        }
    }

    else if (window.location.host == "item.jd.com") {
        var divQrCode = document.getElementById("toolbar-qrcode");
        console.log("已找到JD右下角二维码布局: " + divQrCode);
        if (divQrCode != null) {
            divQrCode.parentNode.removeChild(divQrCode);
            console.log("已移除京东网页右下角二维码弹窗");
        }
    }

    //javbus
    else if (window.location.host.indexOf("javbus") > -1) {
        if (url.indexOf("middle") > -1) {
            window.location.href = url.replace("middle", "big");
            //var gotoLink = document.createElement('a');
            //gotoLink.href = url.replace("middle", "big");
            //document.body.appendChild(gotoLink);
            //gotoLink .click();
        }
    }

    //18comic
    else if (window.location.host.indexOf("18comic") > -1) {
        console.log("已匹配到18comic")
        var ele = document.querySelector("[itemprop='name']")
        if (ele != null) {
            var tempIn = document.createElement("input")
            tempIn.value = `[${window.location.pathname.replace("/album_download/","")}]${ele.innerText}`
            tempIn.style.width="1200px"
            ele.parentElement.appendChild(tempIn)
            console.log("已添加标题复制栏")
        }
    }

    // zhihu
    else if (window.location.host == "link.zhihu.com") {
        var btns = document.getElementsByClassName("button");
        if (btns != null) {
            btns[0].click();
        }
    }
})();
