// ==UserScript==
// @name        自动展开全文阅读更多
// @version     1.178.0
// @author      baster
// @description 自动展开网站全文内容而无需点击，去掉一些烦人广告，去掉需要打开app的提示，站外链直达(支持鼠标左右键和拖拽打开)，避免网址重定向浪费时间，支持免登陆复制文字，兼容手机和电脑端。 -- 【目前已支持上百个网站】
// @supportURL  https://greasyfork.org/zh-CN/users/306433
// @homepageURL https://greasyfork.org/zh-CN/users/306433
// @namespace   https://greasyfork.org/zh-CN/users/306433
// @icon        https://img.icons8.com/stickers/100/000000/double-down.png
// @match       *://theqoo.net/*
// @match       *://m.36kr.com/*
// @match       *://ext.baidu.com/api/comment/*
// @match       *://www.xz577.com/*
// @match       *://*.huanqiu.com/*
// @match       *://iknow.lenovo.com.cn/*
// @match       *://g.pconline.com.cn/*
// @match       *://www.it1352.com/*
// @match       *://www.jianshu.com/p/*
// @match       *://*.csdn.net/*
// @match       *://jingyan.baidu.com/article/*
// @match       *://baijiahao.baidu.com/s*
// @match       *://haokan.baidu.com/v*
// @match       *://zhidao.baidu.com/question/*
// @match       *://m.21jingji.com/article/*
// @match       *://www.bjtzdbzz.com/*
// @match       *://chejiahao.m.autohome.com.cn/info/*
// @match       *://www.bandbbs.cn/threads/*
// @match       *://*.elecfans.com/*
// @match       *://yiidian.com/*
// @match       *://*.yiidian.com/*
// @match       *://m.jb51.cc/*
// @match       *://www.jb51.cc/*
// @match       *://baike.baidu.com/item/*
// @match       *://wap.peopleapp.com/article/*
// @match       *://blog.51cto.com/*
// @match       *://xuedingmiao.com/*
// @match       *://xw.qq.com/*
// @match       *://mbd.baidu.com/newspage/*
// @match       *://ailegal.baidu.com/*
// @match       *://www.cnbeta.com/articles/*
// @match       *://www.zhihu.com/*
// @match       *://zhuanlan.zhihu.com/p/*
// @match       *://*.imooc.com/*
// @match       *://*.py.cn/code/*
// @match       *://*.sina.com.cn/*
// @match       *://juejin.cn/*
// @match       *://www.oschina.net/*
// @match       *://iswbm.com/*
// @match       *://m.so.com/s?q=*
// @match       *://wap.sogou.com/web/*
// @match       *://*.douban.com/*
// @match       *://www.wxnmh.com/*
// @match       *://www.chinaz.com/*
// @match       *://gitee.com/*
// @match       *://www.tianyancha.com/*
// @match       *://www.shaduizi.com/*
// @match       *://show.bookmarkearth.com/view/*
// @match       *://www.423down.com/*
// @match       *://www.itdaan.com/*
// @match       *://www.iteye.com/blog/*
// @match       *://www.360doc.com/*
// @match       *://www.360doc.cn/*
// @match       *://developer.aliyun.com/*
// @match       *://cloud.tencent.com/*
// @match       *://mail.qq.com/*
// @match       *://tieba.baidu.com/*
// @match       *://www.tieba.com/*
// @match       *://*.ifeng.com/*
// @match       *://*.ximalaya.com/*
// @match       *://www.sanzhima.com/*
// @match       *://m.meishichina.com/*
// @match       *://www.logonews.cn/*
// @match       *://segmentfault.com/*
// @match       *://ld246.com/*
// @match       *://*.bilibili.com/*
// @match       *://*.toutiao.com/*
// @match       *://www.itbaoku.cn/*
// @match       *://support.qq.com/*
// @match       *://m.downxia.com/*
// @match       *://*.sohu.com/*
// @match       *://m.weibo.cn/u/*
// @match       *://card.weibo.com/*
// @match       *://www.yunqishi.net/*
// @match       *://stackoom.com/*
// @match       *://www.codeprj.com/*
// @match       *://m.yezicc.com/*
// @match       *://*.ali213.net/*
// @match       *://itpcb.com/*
// @match       *://*.vovososo.com/*
// @match       *://www.lishixinzhi.com/*
// @match       *://www.anquanke.com/*
// @match       *://m.hexun.com/*
// @match       *://www.javascriptcn.com/*
// @match       *://*.zol.com.cn/*
// @match       *://www.5axxw.com/*
// @match       *://3g.163.com/*
// @match       *://*.js-code.com/*
// @match       *://*.wenda.so.com/*
// @match       *://wenda.so.com/*
// @match       *://*.dxy.cn/*
// @match       *://*heidong.com/*
// @match       *://www.tofacebook.com/*
// @match       *://www.ngui.cc/*
// @match       *://ddrv.cn/*
// @match       *://www.qcc.com/*
// @match       *://*.cnr.cn/*
// @match       *://*tinymind.net.cn/*
// @match       *://view.inews.qq.com/*
// @match       *://*gamersky.com/*
// @match       *://*.bugscaner.com/*
// @match       *://*.dgrt.cn/*
// @match       *://devnote.pro/*
// @match       *://betheme.net/*
// @match       *://*.rstk.cn/*
// @match       *://*.taodudu.cc/*
// @match       *://weibo.com/ttarticle/p/show*
// @match       *://weibo.com/cmbchina*
// @match       *://weibo.com/u/*
// @match       *://www.ctfiot.com/*
// @match       *://www.takefoto.cn/*
// @match       *://www.autohotkey.com/*
// @match       *://www.95pm.com/*
// @match       *://*.betheme.net/*
// @match       *://*.zoukankan.com/*
// @match       *://*.hexun.com/*
// @match       *://*.xjx100.cn/*
// @match       *://*.yii666.com/*
// @match       *://*.pianshen.com/*
// @match       *://*.knowbaike.com/*
// @match       *://pythonjishu.com/*
// @match       *://m.freebuf.com/*
// @match       *://www.nuomiphp.com/*
// @match       *://dhexx.cn/*
// @match       *://*.exyb.cn/*
// @match       *://ispacesoft.com/*
// @match       *://www.3424.cn/*
// @match       *://*.cnq.net/*
// @match       *://txc.qq.com/*
// @match       *://m.bjnews.com.cn/*
// @match       *://www.cn-healthcare.com/*
// @match       *://www.wevul.com/*
// @match       *://*.yuque.com/*
// @match       *://*.66law.cn/*
// @match       *://*.ssap.com.cn/*
// @match       *://*.chinaacc.com/*
// @match       *://lvlin.baidu.com/*
// @match       *://*.64365.com/*
// @match       *://programmercarl.com/*
// @match       *://*.qdxiaochuan.com/*
// @match       *://*.zjh336.cn/*
// @match       *://*.volcengine.com/*
// @match       *://*.289.com/*
// @match       *://*.hi-linux.com/*
// @match       *://*.chusan.com/*
// @match       *://*.nowcoder.com/*
// @match       *://*.techgrow.cn/*
// @match       *://*.gaodun.com/*
// @match       *://easylearn.baidu.com/*
// @match       *://*.youlai.cn/*
// @match       *://*.cndzys.com/*
// @match       *://*.jiangzi.com/*
// @match       *://*.dazhong.com/*
// @match       *://discussions*.apple.com/*
// @match       *://www.msn.cn/*
// @match       *://*.pcbaby.com.cn/*
// @match       *://*.youzan.com/*
// @match       *://*.93300.cn/*
// @match       *://sspai.com/*
// @match       *://*.xjishu.com/*
// @match       *://*.eastday.com/*
// @match       *://*.tuidc.com/*
// @match       *://*.saoniuhuo.com/*
// @match       *://*.pingguolv.com/*
// @match       *://*.ppmy.cn/*
// @match       *://*.ultimate-communications.com/*
// @match       *://*.zmtpc.com/*
// @match       *://m.eeo.com.cn/*
// @match       *://*.sina.cn/*
// @match       *://jpom.top/*
// @match       *://*.xlxbk.cn/*
// @match       *://*.dromara.org/*
// @match       *://*.dayi.org.cn/*
// @match       *://*.goodreads.com/*
// @match       *://*.mic-contest.com/*
// @match       *://*.528045.com/*
// @match       *://*.xilichi.com/*
// @match       *://*.ghxi.com/*
// @match       *://*.pixiv.net/*
// @match       *://*.dongchedi.com/*
// @match       *://*.autohome.com.cn/*
// @match       *://*.yicai.com/*
// @match       *://*.eastmoney.com/*
// @match       *://m.familydoctor.com.cn/*
// @match       *://*.jiaochengzhijia.com/*
// @match       *://www.t00ls.com/*
// @match       *://xiaolincoding.com/*
// @match       *://*.dangbei.com/*
// @match       *://*.xinhuaxmt.com/*
// @match       *://forum.butian.net/*
// @match       *://*.zaobao.com/*
// @match       *://*.kdocs.cn/*
// @match       *://m.hexun.com/*
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/440400/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/440400/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function () {
    var websites = [
        {
            match: ["*://m.hexun.com/*"],
            hide: [".article-open", "#download-app", "#info-banner"],
            expand: [".article"],
        },
        {
            match: ["*://*.kdocs.cn/*"],
            js: () => {
                unsafeWindow.localStorage.setItem("skip_domain_security_check", "true");
            },
        },
        {
            // https://www.zaobao.com/realtime/china/story20251202-7906402
            match: ["*://*.zaobao.com/*"],
            hide: [".read-on-app-cover.hidden"],
            expand: ["#article-body"],
        },
        {
            match: ["*://*.xinhuaxmt.com/*"],
            hide: [".content-more-btn", ".link-app > #myfoot", ".banner-container"],
            expand: [".main-text-container.fold-content"],
        },
        {
            match: ["*://forum.butian.net/*"],
            js: () => {
                $("body").off("click", "a");
                $("body").on("click", "a", function (e) {
                    if (!this || !this.href) {
                        return;
                    }
                    try {
                        var url = new URL(this.href);
                        var host = url.host;
                        if (!host.includes(".butian.net")) {
                            window.open(this.href, "_blank");
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                    } catch (error) {
                        return;
                    }
                });
            },
        },
        {
            match: ["*://www.t00ls.com/*"],
            directLink: ["*://www.t00ls.com/link.html?url=*", "url"],
        },
        {
            match: ["*://*.pixiv.net/*"],
            wait: [
                ["button:equals('浏览更多')", "keepclick"],
                ["div[class^='sc-']:equals('阅读作品')", "click"],
                ["div[class^='sc-']:equals('查看全部')", "keepclick"],
            ],
        },
        {
            match: ["*://*.ghxi.com/*"],
            start: () => {
                let wpopt = unsafeWindow.wpopt;
                Object.defineProperty(unsafeWindow, "wpopt", {
                    get: function () {
                        return wpopt;
                    },
                    set: function (value) {
                        wpopt = value;
                        if (wpopt && wpopt.module_site_notice_hash) {
                            unsafeWindow.localStorage.setItem("wpopt_dialog_hash", wpopt.module_site_notice_hash);
                        }
                    },
                    enumerable: true,
                    configurable: false,
                });
                const e = new Date(),
                    t = e.getFullYear(),
                    n = String(e.getMonth() + 1).padStart(2, "0"),
                    r = String(e.getDate()).padStart(2, "0");
                let d = `${t}${n}${r}`;
                unsafeWindow.localStorage.setItem("wpopt_dialog_open_time", d);
                unsafeWindow.localStorage.setItem("wpopt_dialog_open", "true");
            },
            css: () => {
                return `
                .wpcom_ad_wrap { position: absolute !important; left: -3000px !important; }
                `;
            },
        },
        {
            match: ["*://*.goodreads.com/*"],
            wait: [
                [
                    ".Button__labelItem:contains('Show more')",
                    (node) => {
                        let scrollPosition = window.scrollY || document.documentElement.scrollTop;
                        node.click();
                        window.scrollTo(0, scrollPosition);
                        return false;
                    },
                ],
            ],
        },
        {
            match: ["*://*.dongchedi.com/*"],
            wait: [
                [
                    "article[class*='index_article_']",
                    (node) => {
                        node.parentNode.style.height = "auto";
                        node.parentNode.style.overflow = "auto";
                    },
                ],
                [
                    ".tw-text-color-gray-800.tw-text-10.tw-leading-14.tw-text-center:contains('4亿人用过')",
                    (node) => {
                        node.parentNode.parentNode.parentNode.parentNode.remove();
                    },
                ],
                [
                    "article > [class^='index_folder_']",
                    (node) => {
                        node.remove();
                    },
                ],
                [
                    ".tw-w-full.tw-flex.tw-text-16.tw-items-center.tw-justify-center:contains('打开懂车帝APP，阅读完整内容')",
                    (node) => {
                        node.remove();
                    },
                ],
            ],
            js: () => {
                unsafeWindow.localStorage.setItem("_canUseWebp", 1);
            },
        },
        {
            match: ["*://*.dangbei.com/*"],
            wait: [
                [
                    "span:contains('手机客户端下载')",
                    (node) => {
                        node.parentNode.parentNode.remove();
                    },
                ],
            ],
        },
        {
            match: ["*://xiaolincoding.com/*"],
            hide: ["#readmore-wrapper"],
            expand: ["#readmore-container"],
        },
        {
            match: ["*://*.jiaochengzhijia.com/*"],
            hide: [".soft-remark .text-toggle", "#ft_suspension"],
            expand: [".soft-remark .text-inner"],
        },
        {
            match: ["*://m.familydoctor.com.cn/*"],
            hide: [".left"],
            expand: [".article-content"],
        },
        {
            match: ["*://*.eastmoney.com/*"],
            hide: [".readMoreBox"],
            expand: [".newstext"],
        },
        {
            match: ["*://*.yicai.com/*"],
            hide: [".textgradient.zhezhao", "#appdownload"],
            expand: ["#multi-text"],
        },
        {
            match: ["*://*.autohome.com.cn/*"],
            hide: ["#continue_reading", "#oppen_applet"],
            expand: ["#topicContentSection"],
        },
        {
            match: ["*://*.xilichi.com/*"],
            hide: [".show_more_btn"],
            expand: ["#readtxt-content"],
        },
        {
            match: ["*://*.528045.com/*"],
            hide: ["#sgui-collapse"],
            expand: [".sgui-customer-content"],
        },
        {
            match: ["*://*.mic-contest.com/*"],
            hide: ["mip-showmore.linear-gradient:after", ".mip-showmore-btn"],
            expand: ["mip-showmore"],
        },
        {
            match: ["*://*.dayi.org.cn/*"],
            hide: [".w-full.van-button--plain.van-button--info", ".full-button.flex.flex-col.justify-end.items-center"],
            expand: ["#tab-container", ".main-fold.article-module-container-padding"],
        },
        {
            match: ["*://*.xlxbk.cn/*"],
            hide: [".read-more"],
            expand: ["[data-nav='posts']"],
        },
        {
            match: ["*://jpom.top/*", "*://*.dromara.org/*"],
            js: () => {
                unsafeWindow.localStorage.isStarJpomRepo = new Date().getTime();
                unsafeWindow.localStorage.isStarRepo = new Date().getTime();
            },
        },
        {
            match: ["*://*.sina.cn/*"],
            hide: [".read-unfold-box", "#article_end + div", "#m-sentiment3", ".m-guss-caijing.js-guss-caijing.animated.pluse", ".broadcast.js-voice.show", ".broadcast.js-voice.shou"],
            expand: [".main-article-body"],
            wait: [
                [
                    ".snp-container",
                    (node) => {
                        if (node.parentNode) {
                            node.parentNode.remove();
                        }
                        return false;
                    },
                ],
                [
                    ".wap-msg-bar",
                    (node) => {
                        if (node.parentNode) {
                            node.parentNode.remove();
                        }
                        return false;
                    },
                ],
            ],
        },
        {
            match: ["*://m.eeo.com.cn/*"],
            wait: [
                [
                    ".a-load",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
                [
                    ".more",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
            ],
        },
        {
            match: ["*://*.ultimate-communications.com/*"],
            hide: [".readall_box"],
            expand: [".content-content"],
        },
        {
            match: ["*://*.pingguolv.com/*"],
            hide: [".click_more"],
            expand: ["mip-showmore"],
        },
        {
            match: ["*://*.zmtpc.com/*"],
            hide: [".readall"],
            expand: [".article .newstext"],
        },
        {
            match: ["*://*.saoniuhuo.com/*"],
            hide: [".mrc-btn-wrap"],
            expand: [".mrc-content"],
        },
        {
            match: ["*://*.tuidc.com/*"],
            hide: [".bottom_all_text_btn", ".bottom_all_text"],
            expand: [".ty_text_box"],
        },
        {
            match: ["*://*.eastday.com/*"],
            hide: [".expand-btn"],
            expand: [".post-content"],
        },
        {
            match: ["*://*.xjishu.com/*"],
            hide: [".gradBox", ".art-download"],
            expand: [".con-box"],
        },
        {
            match: ["*://sspai.com/*"],
            hide: ["#btn-call-app"],
            directLink: ["*/link?target=*", "target"],
        },
        {
            match: ["*://easylearn.baidu.com/edu-page/tiangong/*"],
            hide: [".bgk-detail .main-bottom", ".bgk-detail .banner", ".vip-banner-cont", ".vip-card-warp", ".business-el-line", ".question-cont .tigan .mask .toogle-btn"],
            expand: [".question-cont .tigan"],
            wait: [
                [
                    ".more-text",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
                [
                    ".dan-btn",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
                [
                    ".exercise-btn-4",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
                [
                    ".expand-btn",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
            ],
        },
        {
            match: ["*://www.msn.cn/*"],
            hide: [".article-cont-read-button-container"],
            expand: [".article-body"],
            start: () => {
                Element.prototype._attachShadow = Element.prototype.attachShadow;
                Element.prototype.attachShadow = function () {
                    let css = `
                    .article-body
                    {
                        height: auto !important;
                        max-height: unset !important;
                        overflow: unset !important;
                        -webkit-line-clamp: unset !important;
                    }
                    `;
                    let style = document.createElement("style");
                    style.type = "text/css";
                    try {
                        style.innerHTML = css;
                    } catch (x) {
                        style.innerText = css;
                    }
                    let shadow = this._attachShadow({ mode: "open" });
                    shadow.appendChild(style);
                    return shadow;
                };
            },
        },
        {
            match: ["*://*.93300.cn/*"],
            hide: [".entry-readmore"],
            expand: [".entry-content"],
        },
        {
            match: ["*://*.youzan.com/*"],
            hide: [".cms-article-lock"],
            expand: [".content-content"],
        },
        {
            match: ["*://ailegal.baidu.com/*"],
            hide: [".article-content .expand", ".article-content .mask"],
            expand: [".article-content .article-text"],
        },
        {
            match: ["*://*.pcbaby.com.cn/*"],
            hide: [".mip-showmore-btn"],
            expand: ["mip-showmore"],
        },
        {
            match: ["*://discussions*.apple.com/*"],
            hide: [".post-content-toggle .post-content-toggle-button"],
            expand: [".post-content-toggle", ".post-body.collapsed"],
        },
        {
            match: ["*://*.dazhong.com/*"],
            hide: ["#read-more", ".content-more"],
            expand: ["#wrap", "#cont"],
        },
        {
            match: ["*://*.jiangzi.com/*"],
            hide: [".show_more_btn"],
            expand: ["#readtxt-video", ".detailText"],
        },
        {
            match: ["*://*.cndzys.com/*"],
            hide: [".content-more"],
            expand: ["#cont"],
        },
        {
            match: ["*://*.youlai.cn/*"],
            hide: [".mip-showore-btn-bar", "div[class*='showBtn']"],
            expand: ["#show-more", "#js-content"],
        },
        {
            match: ["*://*.gaodun.com/*"],
            hide: [".view-more"],
            expand: [".m-context"],
        },
        {
            match: ["*://*.techgrow.cn/*"],
            hide: ["#readmore-wrapper"],
            expand: ["#readmore-container"],
        },
        {
            // https://m.nowcoder.com/discuss/607623789546844160
            // https://greasyfork.org/zh-CN/scripts/440400-%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A/discussions/239120
            match: ["*://*.nowcoder.com/*"],
            hide: [".view-more-btn", ".article-btns-open", "#cyh_banner"],
            expand: ["div[id^='data']", ".xle.pop_.cn_"],
            js: () => {
                $(".continue-btn").click();
                let el = document.querySelector(".ncmain.appwithsplit");
                if (el) {
                    el.__vue__.$options.parent.isShowAll = true;
                }

                nodes = document.querySelectorAll(".wonder-item");
                nodes.forEach((item) => {
                    item.__vue__.maxOneLineFontNum = 1000;
                    item.__vue__.commentDisable = false;
                });
                $(".wonder-list").parent().parent()[0].__vue__.isShowAllList = true;

                nodes = querySelectorIncludesText("span.text-content", "APP内查看完整回复");
                nodes.forEach((item) => {
                    item.remove();
                });
            },
            start: () => {
                var post = {};
                Object.defineProperty(unsafeWindow, "post", {
                    get: function () {
                        return post;
                    },
                    set: function (value) {
                        post = value;
                        post.isTestCmtGoApp = false;
                        post.isTestHotTalkGoApp = false;
                    },
                    enumerable: true,
                    configurable: false,
                });
            },
        },
        {
            match: ["*://*.chusan.com/*"],
            hide: [".view-more-btn", ".article-btns-open", "#cyh_banner"],
            expand: ["div[id^='data']", ".xle.pop_.cn_"],
        },
        {
            match: ["*://*.hi-linux.com/*"],
            hide: ["#read-more-wrap"],
            expand: ["#vip-container"],
        },
        {
            match: ["*://*.289.com/*"],
            hide: [".f-show-cont"],
            expand: [".m-downmain"],
        },
        {
            match: ["*://*.volcengine.com/*"],
            hide: ["div[class*='button-AVOE'][class*='volcfe-flex-middle']", "div[class^='cover-']"],
            expand: ["div[class^='content-'][class*='hidden-']"],
            hookEvent: ["copy"],
        },
        {
            match: ["*://*.zjh336.cn/*"],
            hide: [".readnum"],
            expand: [".viewall_plugin"],
        },
        {
            match: ["*://*.qdxiaochuan.com/*"],
            hide: [".teles, .telesmore"],
            expand: [".postcon"],
        },
        {
            match: ["*://programmercarl.com/*"],
            hide: ["#readmore-wrapper"],
            expand: [".theme-default-content", "#readmore-container"],
        },
        {
            match: ["*://*.64365.com/*"],
            hide: [".zs-unfold .unfd-btn-bar"],
            expand: [".unfd-ovh"],
        },
        {
            match: ["*://lvlin.baidu.com/*"],
            hide: [".check-more.check-fold"],
            expand: [".main-content-box"],
        },
        {
            match: ["*://*.chinaacc.com/*"],
            hide: [".news-con-mod .news-more-panel"],
            expand: [".news-con-mod"],
        },
        {
            match: ["*://*.ssap.com.cn/*"],
            hide: [".yueduqi_over"],
            expand: [".yueduqi_content"],
        },
        {
            match: ["*://*.yuque.com/*"],
            hide: ["div[class^=index-module_bottomAdvertiseWrapper]"],
        },
        {
            match: ["*://www.wevul.com/*"],
            directLink: [
                "*/go/*",
                (node) => {
                    const regex = /\/go\/([^\/]+)$/;
                    const base64Str = node.href.match(regex)[1];
                    const decodedStr = atob(base64Str);
                    node.href = decodedStr;
                    node.setAttribute("target", "_blank");
                },
            ],
        },
        {
            match: ["*://*.66law.cn/*"],
            hide: [".det-unfold .unfd-flex-bar .unfd-btn"],
            expand: [".unfold-bar .unfd-ovh"],
        },
        {
            match: ["*://www.cn-healthcare.com/*"],
            hide: [".mask, .ni_mask", "footer"],
            expand: ["#artbody"],
        },
        {
            match: "*://txc.qq.com/*",
            directLink: ["*/link-jump?jump=*", "jump"],
        },
        {
            match: ["*://m.bjnews.com.cn/*"],
            hide: [".article > .shade"],
            expand: [".article"],
        },
        {
            match: ["*://*.cnq.net/*"],
            hide: ["#readmore-wrapper"],
            expand: ["#readmore-container"],
        },
        {
            match: ["*://www.3424.cn/*"],
            hide: [".div-mask>.div-showbtn"],
            expand: [".contents article"],
        },
        {
            match: ["*://ispacesoft.com/*"],
            hide: [".entry-readmore"],
            expand: [".entry-content"],
        },
        {
            // https://theqoo.net/hot/2963319501
            match: ["*://theqoo.net/*"],
            js: () => {
                var nowScroll = $(window).scrollTop();
                $(document).ajaxComplete(function (event, xhr, settings) {
                    if (settings && settings.data && (settings.data.includes("act=dispBoardContentCommentListTheqoo") || settings.data.includes("act=dispTheqooContentCommentListTheqoo"))) {
                        $(window).scrollTop(nowScroll);
                        if ($(".show_more:not([style='display: none;'])").length > 0) {
                            $(".show_more:not([style='display: none;'])").click();
                        }
                    }
                });
            },
        },
        {
            match: ["*://m.freebuf.com/*"],
            js: () => {
                if (window.innerWidth > 1024) {
                    location.href = location.href.replace("m.freebuf.com", "www.freebuf.com");
                }
            },
        },
        {
            match: ["*://www.nuomiphp.com/*"],
            hide: [".question-richtext .read-more"],
            expand: [".question-richtext"],
        },
        {
            match: ["*://pythonjishu.com/*"],
            hide: [".entry-readmore"],
            expand: [".entry-content"],
        },
        {
            match: ["*://*.knowbaike.com/*"],
            hide: ["#read-more"],
            expand: [".art-txt"],
            js: () => {
                document.oncontextmenu = function () {
                    return true;
                };
                document.onkeydown = function () {
                    return true;
                };
            },
        },
        {
            // 抄袭站直接跳转到原文即可
            match: ["*://*.pianshen.com/*"],
            js: () => {
                $("head").append('<meta name="referrer" content="never">');
                let url = $("#gotosource a").attr("href");
                if (url) {
                    location.href = url;
                }
            },
        },
        {
            // 抄袭站直接跳转到原文即可
            match: ["*://*.yii666.com/*"],
            hide: ["#vipReadAll", ".sidebar"],
            expand: [".article-content-height"],
            js: () => {
                $("head").append('<meta name="referrer" content="never">');
                let url = $(".OpenToUrl").attr("data-href");
                if (url) {
                    location.href = url;
                }
            },
        },
        {
            match: ["*://*.xjx100.cn/*", "*://dhexx.cn/*", "*://*.ppmy.cn/*"],
            js: () => {
                $("head").append('<meta name="referrer" content="never">');
                var originalTextMethod = $.fn.text;
                $.fn.text = function (value) {
                    if (arguments.length === 0) {
                        return originalTextMethod.call(this);
                    } else {
                        let re = originalTextMethod.call(this, value);
                        let text = $(".source_url").text();
                        if (text && (text.includes("http://") || text.includes("https://"))) {
                            let regex = /(https?:\/\/[^\s]+)/;
                            location.href = text.match(regex)[0];
                        }
                        return re;
                    }
                };
                let text = $(".source_url").text();
                if (text && (text.includes("http://") || text.includes("https://"))) {
                    let regex = /(https?:\/\/[^\s]+)/;
                    location.href = text.match(regex)[0];
                } else {
                    var test = false;
                    var scriptTags = $("script");
                    scriptTags.each(function () {
                        var src = $(this).attr("src");
                        if (src && src.includes("?source_url=")) {
                            let { source_url } = parseUrl(src);
                            if (source_url) {
                                test = true;
                                location.href = source_url;
                            }
                        }
                    });
                    if (!test) {
                        let url = $("#vip").find("a").attr("href");
                        if (url) {
                            location.href = $("#vip").find("a").attr("href");
                        }
                    }
                }
            },
        },
        {
            match: ["*://*.zoukankan.com/*"],
            js: () => {
                $("head").append('<meta name="referrer" content="never">');
                let nodeList = querySelectorIncludesText('a[href^="http"]', "查看全文");
                if (nodeList.length > 0) {
                    location.href = nodeList[0].href;
                }
            },
        },
        {
            match: ["*://*.hexun.com/*"],
            hide: ["div.showAll", "div.bottomLayer"],
            expand: ["div.art_contextBox"],
        },
        {
            match: ["*://*.betheme.net/*"],
            hide: ["#vip"],
            expand: [".articleHeight"],
        },
        {
            match: ["*://www.95pm.com/*"],
            hide: [".readall_box"],
            expand: [".readall-body"],
        },
        {
            match: ["*://www.takefoto.cn/*"],
            hide: [".content .article .article-text .load"],
            expand: [".article-text"],
        },
        {
            expand: [".content .article .article-text"],
            match: ["*://www.autohotkey.com/*"],
            js: () => {
                const items = document.querySelectorAll(".codebox > p > a:first-child + :nth-child(2)");
                items.forEach((item) => {
                    expandCode(item);
                });
            },
        },
        {
            match: ["*://www.ctfiot.com/*"],
            directLink: [
                "*/go/?url=*",
                (node) => {
                    let { url } = parseUrl(node.href);
                    if (url) {
                        node.href = atob(url);
                        node.setAttribute("target", "_blank");
                    }
                },
            ],
        },
        {
            // https://weibo.com/cmbchina
            match: ["*://weibo.com/cmbchina*", "*://weibo.com/u/*"],
            wait: [
                [
                    "span.expand",
                    (node) => {
                        node.click();
                        return false;
                    },
                ],
            ],
        },
        {
            // https://weibo.com/ttarticle/p/show?id=2309404890441668493647
            match: ["*://weibo.com/ttarticle/p/show*"],
            hide: [".artical_add_box"],
            expand: [".WB_editor_iframe_new"],
        },
        {
            match: ["*://*.rstk.cn/*", "*://*.taodudu.cc/*", "*://*.dgrt.cn/*", "*://*.exyb.cn/*"],
            hide: ["div#vip"],
            expand: [".article_content"],
        },
        {
            match: ["*://betheme.net/*"],
            hide: ["div#vip"],
            expand: [".articleHeight"],
        },
        {
            match: ["*://devnote.pro/*"],
            hide: [".readmore-box"],
            expand: [".post-mask"],
        },
        {
            match: ["*://*.bugscaner.com/*"],
            hide: ["#div_qrcode_container", "#top-header"],
        },
        {
            match: ["*://*tinymind.net.cn/*"],
            start: () => {
                // 或者废掉DOMMouseScroll
                unsafeWindow.verify_flag = 1;
                unsafeWindow.phone_verify_flag = 1;
                Object.defineProperty(unsafeWindow, "verify_flag", {
                    get: function () {
                        return 1;
                    },
                    enumerable: true,
                    configurable: false,
                });
                Object.defineProperty(unsafeWindow, "phone_verify_flag", {
                    get: function () {
                        return 1;
                    },
                    enumerable: true,
                    configurable: false,
                });
            },
        },
        {
            // https://view.inews.qq.com/k/20210608A045BD00
            match: ["*://view.inews.qq.com/*"],
            hide: ["div[class^=show-more_outer]", "div[class^=slider-top-bar_sliderWrapper]"],
            expand: ["div[class^=show-more_height-not-full]"],
        },
        {
            // https://wap.gamersky.com/news/Content-1571244.html
            match: ["*://*gamersky.com/*"],
            hide: [".gsAreaContextOpen", ".ymwBootDownload"],
            expand: ["#gsAreaContext"],
        },
        {
            match: ["*://www.qcc.com/*"],
            directLink: ["*://www.qcc.com/web/transfer-link?link=*", "link"],
        },
        {
            match: ["*://*.cnr.cn/*"],
            hide: ["#readmore"],
            expand: ["#perny-main"],
        },
        {
            match: ["*://www.ngui.cc/*"],
            hide: ["#vip"],
            expand: ["#contentWraper", ".article_content"],
        },
        {
            match: ["*://ddrv.cn/*"],
            hide: ["#read-more-wrap"],
            expand: ["#container"],
        },
        {
            match: ["*://*.dxy.cn/*"],
            hide: ["div[class^=contentWrapBottom_]"],
            expand: ["div[class^=contentWrap_]"],
        },
        {
            match: ["*://www.tofacebook.com/*"],
            hide: [".topic .more-box"],
            expand: [".topic"],
        },
        {
            // https://wenda.so.com/q/1679797307210735
            match: ["*://*wenda.so.com/*"],
            hide: ["#show-rest-entry", ".answer-part__has-folder__btn", ".unfold-page.js-unfold-page", "#js-unfold-more"],
            expand: ["#det-content", ".answer-part__has-folder", "#js-ans-box-first"],
            wait: [[".hide.js-unfold-answer.answer-fold-box", (node) => node.classList.remove("hide")]],
        },
        {
            match: ["*://*.js-code.com/*"],
            hide: ["#read-more-wrap"],
            expand: ["#codeContent", "#container"],
        },
        {
            match: ["*://*heidong.com/*"],
            hide: [".ggbox"],
            start: () => {
                // 阻止牛皮癣弹框
                unsafeWindow.user_login = true;
                Object.defineProperty(unsafeWindow, "user_login", {
                    get: function () {
                        return true;
                    },
                    enumerable: true,
                    configurable: true,
                });
            },
        },
        {
            // https://wap.zol.com.cn/ask/x_19257207.html
            match: ["*://*.zol.com.cn/*"],
            hide: [".unfold-article-btn", ".wap__bottom-app-button"],
            expand: [".article-content"],
            wait: [["div.show-all-reply", "click"]],
        },
        {
            match: ["*://3g.163.com/*"],
            hide: [".backflow-floating.js-open-app"],
        },
        {
            // 某些采集机翻引流站点
            match: ["*://www.5axxw.com/*"],
            hide: ["#gzh-mask", "#gzh-modal"],
        },
        {
            match: ["*://m.hexun.com/*"],
            hide: [".article-open"],
            expand: [".article"],
        },
        {
            // var key = 'read' + (new Date).toJSON().substring(0, 7); localStorage
            match: ["*://www.javascriptcn.com/*"],
            hide: [".readall_box"],
            expand: [".markdown-body"],
        },
        {
            match: ["*://www.anquanke.com/*"],
            directLink: ["*://*/outLinkPage/?target=*", "target"],
        },
        {
            match: ["*://*.vovososo.com/*"],
            directLink: [
                "*/jump.html?url=*",
                (node) => {
                    let { url } = parseUrl(node.href);
                    if (url) {
                        node.href = atob(url);
                        node.setAttribute("target", "_blank");
                    }
                },
            ],
        },
        {
            match: ["*://itpcb.com/*"],
            hide: ["#read-more-wrap"],
            expand: ["#container"],
        },
        {
            match: ["*://www.lishixinzhi.com/*"],
            hide: ["#showbtn"],
            expand: ["#endtext"],
        },
        {
            match: ["*://*.ali213.net/*"],
            hide: [".unfold-field.unfold-field-download", ".read-all-con", ".download-text"],
            expand: [".detail_content", "#Content"],
        },
        {
            match: ["*://m.yezicc.com/*"],
            hide: [".fulltext-button"],
            expand: ["#article-body > .wrap"],
        },
        {
            match: ["*://stackoom.com/*", "*://www.codeprj.com/*"],
            js: () => {
                if (!$.cookie("openid") || !$.cookie("loginCode")) {
                    $.cookie("openid", "1", { expires: 7 });
                    $.cookie("loginCode", "1", { expires: 7 });
                }
            },
        },
        {
            match: ["*://www.yunqishi.net/*"],
            hide: [".ckgd"],
            expand: [".tw_contain"],
        },
        {
            match: ["*://card.weibo.com/*", "*://weibo.com/ttarticle/*"],
            hide: [".f-art-opt"],
            expand: [".f-art"],
        },
        {
            match: ["*://m.weibo.cn/u/*"],
            directLink: ["*://weibo.cn/sinaurl?u=*", "u"],
        },
        {
            // https://m.sohu.com/a/442909096_120459022/?pvid=000115_3w_a
            match: "*://*.sohu.com/*",
            hide: [".lookall-box", "#CallAppContainer"],
            css: `
                .hidden-content.hide,.control-hide {
                    display: block !important;
                }
            `,
            js: () => {
                $("#artLookAll").click();
            },
        },
        {
            match: "*://m.downxia.com/*",
            hide: ["a.slide-btn"],
            expand: [".chapter-cont"],
            css: `
                .chapter-cont.snbg {
                    position: unset !important;
                }
            `,
        },
        {
            match: ["*://support.qq.com/*"],
            directLink: ["*://support.qq.com/*/link-jump?jump=*", "jump"],
        },
        {
            match: ["*://www.itbaoku.cn/*"],
            hide: [".qa-content-more"],
            expand: ["#qa-content"],
        },
        {
            // https://wukong.toutiao.com/question/6712757183118835972/
            match: ["*://*.toutiao.com/*"],
            hide: ["a.j-expand-showfull.expand-bottom", ".m-share-answer .neck .mask", ".float-openapp", ".expand-container .expand-button-wrapper", ".wenda-answer-content .expand-button-wrapper", ".fold-outer-container .fold-button", ".fold-outer-container .fold-mask", ".arco-show-monitor .m-bottom-container", ".fold-content > .arco-show-monitor", ".content.collapsed > .content-shadow", ".m-top-container.m-top-larger.m-top-no-search.news_article", ".m-top-padding", ".expand-container .expand-button-wrapper"],
            expand: ["div.answer-text-full", "article.content", ".expand-container.folded", ".wenda-answer-content", ".fold-outer-container .fold-container", ".content.collapsed"],
            hookEvent: (type, func, useCapture) => {
                if (type == "click") {
                    console.log(this);
                    console.log("hookEvent", type, func, useCapture);
                }
                return false;
            },
            wait: [[".text:contains('即将离开，打开\"今日头条\"')", (node) => node.parentNode.parentNode.querySelector(".cancel").click()]],
            js: () => {
                let node = document.querySelector(".content.collapsed");
                if (node != null) {
                    node.onclick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    };
                }
            },
        },
        {
            match: ["*://www.bilibili.com/*"],
            hide: [".h5-download-bar", ".read-article-box .read-more .arrow-cnt", ".video-desc-container .toggle-btn"],
            expand: [".read-article-box.limit", ".video-desc-container .basic-desc-info"],
            js: () => {
                // 去掉复制的时候总是带上的尾巴
                let node = document.getElementById("article-content");
                if (node != null) {
                    node.oncopy = function (e) {
                        e.clipboardData.setData("text/plain", window.getSelection().toString());
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    };
                }
            },
        },
        {
            match: ["*://m.bilibili.com/video/*"],
            hide: [".launch-app-btn.m-nav-openapp"],
            wait: [["div.to-see", "click"]],
        },
        {
            match: ["*://m.bilibili.com/*"],
            hide: [".opus-read-more"],
            expand: [".opus-module-content.limit"],
        },
        {
            match: ["*://ld246.com/*"],
            directLink: ["*://*ld246.com/forward?goto=*", "goto"],
        },
        {
            match: ["*://segmentfault.com/*"],
            directLink: [
                "*://link.segmentfault.com/?enc=*",
                (node) => {
                    // segmentfault这东西也去加密了?
                    if (/^https?:\/\//.test(node.innerText) && !node.innerText.endsWith("...")) {
                        node.href = node.innerText;
                    }
                },
            ],
        },
        // 暂时不用这功能
        // {
        //     // https://cn.bing.com/search?form=MOZSBR&pc=MOZI&q=GIT_CLEAN_FLAGS
        //     match: ["*://cn.bing.com/search?*"],
        //     bindClick: [
        //         "a[href^=http]",
        //         (node, e) => {
        //             if (node.target == "_blank" && !node.hostname.includes("bing.com")) {
        //                 e.stopPropagation();
        //             }
        //         },
        //     ],
        // },
        {
            match: ["*://www.logonews.cn/*"],
            directLink: ["*://link.logonews.cn/?url=*", "url"],
        },
        {
            // https://m.meishichina.com/recipe/69477/
            match: ["*://m.meishichina.com/*"],
            hide: [".showmore_page_a"],
            expand: ["#showmorearticle"],
        },
        {
            match: ["*://www.sanzhima.com/*"],
            directLink: [
                "*://www.sanzhima.com/jump.html?url=*",
                (node) => {
                    let { url } = parseUrl(node.href);
                    if (url) {
                        node.href = atob(url);
                        node.setAttribute("target", "_blank");
                    }
                },
            ],
        },
        {
            // https://www.ximalaya.com/sound/357093858
            match: ["*://www.ximalaya.com/*", "*://m.ximalaya.com/*"],
            hide: [".more-intro-wrapper.cY_", ".stretch-box .mask.ib_", "a.init-code.schema-link"],
            expand: [".draft._Fc, .sound-intro .intro._Fc", ".stretch-box.ib_", ".album-intro .intro.Q_v"],
        },
        {
            // https://i.ifeng.com/c/8EJoQhvSkT3
            // https://ihouse.ifeng.com/news/2022_03_12-55263044_0.shtml
            match: "*://*.ifeng.com/*",
            hide: ["section[class^='bottomSlide-']", "header[class^='headerIn-']", "div[class^='callupBtn-']", "div[class^='more-']", "div[class^='tip-']", "div.showall", "div[class^='more-1-']", "div[class^='bottom_box-'] > div[class^='box-']", "div[class^='containerBox-'] >  div[class^='shadow-']", "[class^='index_shadow'] > [class^='index_unfoldIcon']", "section[class^='index_fixSlide_'] > div[class^='index_fixSlideBox_']"],
            expand: ["div[class^='main_content-']", "section.article", "div[class^='containerBox-']", "div[class^='index_containerBox']", "div[class^='index_main_content_']"],
            css: "#root>div[class^='main-'] {margin-bottom: unset !important;}",
        },
        {
            // https://tieba.baidu.com/p/7412962296
            // https://www.tieba.com/p/7745474371
            match: ["*://tieba.baidu.com/*", "*://www.tieba.com/*"],
            hide: [".appPromote", ".appBottomPromote", ".frs_daoliu_for_app", ".pb_cut_hot_recommend", ".father-cut-daoliu-normal-box", ".father-cut-daoliu-from-toutiao-box"],
            directLink: [
                "*://jump*.bdimg.com/safecheck/index?url=*",
                (node) => {
                    if (/^https?:\/\//.test(node.innerText)) {
                        node.href = node.innerText;
                    }
                },
            ],
            start: () => {
                if (location.hostname === "tieba.baidu.com" && location.pathname === "/mo/q/checkurl") {
                    const params = new URLSearchParams(location.search);
                    const url = params.get("url");
                    if (url) {
                        location.href = url;
                    }
                }
            },
        },
        {
            match: "*://mail.qq.com/*",
            bindClick: [
                "a[href^=http]",
                (node, e) => {
                    if (node.target == "_blank" && !node.href.includes("mail.qq.com")) {
                        e.stopPropagation();
                    }
                },
            ],
        },
        {
            // https://cloud.tencent.com/developer/article/1953552
            match: "*://cloud.tencent.com/*",
            hide: [".cdc-expand-area__toggle", ".com-markdown-collpase-hide .com-markdown-collpase-toggle", ".J-headerAdvertising", ".c-nav-advertising"],
            expand: [".cdc-expand-area__main", ".com-markdown-collpase-hide .com-markdown-collpase-main"],
            directLink: ["*://cloud.tencent.com/developer/tools/blog-entry?target=*", "target"],
        },
        {
            // https://developer.aliyun.com/article/875173
            match: "*://developer.aliyun.com/*",
            hide: ["#btn-readmore", ".article-hide-box"],
            expand: [".article-hide-content"],
        },
        {
            // http://www.360doc.com/content/20/0805/05/71057272_928578782.shtml
            match: ["*://www.360doc.com/*", "*://www.360doc.cn/*"],
            hide: [".article_showall"],
            expand: ["#articlecontent", ".article_maxh"],
            bindClick: [
                "a[href^=http]",
                (node, e) => {
                    if (node.target == "_blank" && !node.hostname.includes("360doc.com")) {
                        e.stopPropagation();
                    }
                },
            ],
        },
        {
            // https://www.iteye.com/blog/agile-boy-274366
            match: "*://www.iteye.com/blog/*",
            hide: [".hide-article-box"],
            expand: ["#blog_content"],
        },
        {
            match: "*://www.423down.com/*",
            directLink: [
                "*://www.423down.com/go.php?url=*",
                (node) => {
                    let { url } = parseUrl(node.href);
                    if (url) {
                        node.href = atob(url);
                    }
                },
            ],
        },
        {
            // https://www.itdaan.com/blog/2019/08/06/1b407ea67c33df1c625ab657443ccd45.html
            match: "*://www.itdaan.com/*",
            js: () => {
                if (!$.cookie("openid") || !$.cookie("loginCode")) {
                    $.cookie("openid", "1", { expires: 7 });
                    $.cookie("loginCode", "1", { expires: 7 });
                }
                if ($.cookie("vipuser") != "1") {
                    $.cookie("vipuser", "1", { expires: 7 });
                }
            },
            directLink: [
                "*://www.itdaan.com/link/*",
                (node) => {
                    let url = node.href.split("/link/", 2)[1];
                    if (url) {
                        node.href = atob(url);
                    }
                },
            ],
        },
        {
            match: "*://show.bookmarkearth.com/view/*",
            js: () => {
                let node = document.querySelector("p.link");
                if (node) {
                    location.replace(node.innerText);
                }
            },
        },
        {
            match: "*://www.shaduizi.com/*",
            hide: [".content-container-open-btn"],
            expand: [".content-section.content-section-container"],
        },
        {
            match: "*://www.chinaz.com/*",
            hide: [".contentPadding"],
            expand: ["#article-content"],
        },
        {
            match: "*://www.tianyancha.com/*",
            bindClick: [
                "a[href^=http]",
                (node, e) => {
                    if (node.target == "_blank") {
                        e.stopPropagation();
                    }
                },
            ],
            directLink: ["*://www.tianyancha.com/security?target=*", "target"],
        },
        {
            match: "*://gitee.com/*",
            directLink: ["*://gitee.com/link?target=*", "target"],
        },
        // {
        //     // 百度搜索移动端，该功能还有bug，免重定向跳转去掉，https://github.com/ViCrack/tempermonkey-script/issues/3#issuecomment-1507357746
        //     match: "*://m.baidu.com/*",
        //     bindClick: [
        //         "div.result",
        //         (node) => {
        //             if (node.dataset.log) {
        //                 let link = JSON.parse(node.dataset.log).mu;
        //                 node.querySelector("article").setAttribute("rl-link-href", link);
        //             }
        //         },
        //     ],
        // },
        {
            match: "*://www.wxnmh.com/*",
            hide: [".hide-article-box"],
            expand: ["#message_content"],
        },
        {
            match: "*://*.douban.com/*",
            directLink: ["*.douban.com/link2/?url=*", "url"],
            hide: [".oia-readall"],
            expand: [".note-content"],
        },
        {
            match: "*://wap.sogou.com/web/*",
            directLink: ["*://wap.sogou.com/web/id=*&url=*", "url"],
        },
        {
            match: "*://m.so.com/s?q=*",
            directLink: ["*.so.com/jump?u=*", "u"],
        },
        {
            match: "*://iswbm.com/*",
            hide: ["#read-more-wrap"],
            expand: ["#container"],
        },
        {
            match: "*://www.oschina.net/*",
            hide: ["div.collapse-bar"],
            expand: ["div.article-detail"],
            directLink: ["*://www.oschina.net/action/GoToLink?url=*", "url"],
        },
        {
            match: "*://juejin.cn/*",
            directLink: ["*link.juejin.cn/?target=*", "target"],
            hide: [".top-banners-container > .global-top-banner"],
            css: `
                .header-with-banner {
                    top: 0px !important;
                }
            `,
        },
        {
            match: "*://www.3h3.com/soft/*",
            hide: ["#showmore"],
            expand: ["#ctext"],
        },
        {
            match: "*://finance.sina.com.cn/*",
            hide: ["#sina-cont000", "#sina-pages-u"],
        },
        {
            // https://iask.sina.com.cn/b/new2COrHbarDpB.html
            match: "*://*.sina.com.cn/*",
            hide: [".detail-text-more", "#floating-image", ".answer-mask-box", ".answer-show-button"],
            expand: [".new-pre-answer-text", ".knowledge-list-switch", ".detail-body"],
        },
        {
            match: "*://*.py.cn/code/*",
            start: () => {
                unsafeWindow.IsLevelDate = 1;
                Object.defineProperty(unsafeWindow, "IsLevelDate", {
                    get: function () {
                        return 1;
                    },
                    enumerable: true,
                    configurable: true,
                });
                Object.defineProperty(unsafeWindow, "is_login", {
                    get: function () {
                        return 1;
                    },
                    enumerable: true,
                    configurable: true,
                });
            },
        },
        {
            match: "*://m.36kr.com/*",
            hide: [".kr-mobile-goapp", ".article-goapp", ".float-app-button-wrp", ".article-top-swiper-goapp"],
            expand: ["#body-content"],
        },
        {
            match: ["*://m.imooc.com/*", "*://www.imooc.com/*"],
            hide: [".wenda-more-wrap.js-wenda-more", "#js-appload", ".js-footer-appload", ".detail-content.long-content .showMore", ".hide-articel-box", ".js-show-reply-btn.hide-answer-morebtn"],
            expand: ["#wap_wenda_detail", "#wenda_content", ".detail-content.long-content", "#js-qa-wenda", ".answer-content"],
        },
        {
            match: "*://zhuanlan.zhihu.com/p/*",
            hide: [".OpenInAppButton"],
            directLink: ["*link.zhihu.com/?target=*", "target"],
        },
        {
            match: "*://www.zhihu.com/*",
            hide: [".OpenInAppButton", ".openInApp", ".DownloadGuide", ".Pc-feedAd-container", ".MobileAppHeader-downloadLink", ".ContentItem-expandButton", ".AdBelowMoreAnswers", ".MBannerAd"],
            expand: [".RichContent-inner--collapsed", ".RichContent-inner"],
            wait: [
                [".ModalExp-modalShow", (node) => ((node.parentNode.style.display = "none"), document.body.classList.remove("ModalWrap-body"))],
                [
                    ".is-collapsed",
                    (node) => {
                        node.classList.remove("is-collapsed");
                    },
                ],
                [
                    "div[class^='css-']:equals('是否在知乎 App 内阅读全文')",
                    (node) => {
                        // node的同级下一个元素
                        let nextNode = node.nextElementSibling;
                        if (nextNode) {
                            // 从里面找一个button，text内容是“取消”，点击
                            const buttons = nextNode.querySelectorAll("button");
                            const cancelButton = Array.from(buttons).find((el) => el.textContent.trim() === "取消");
                            if (cancelButton) {
                                cancelButton.click();
                                return true;
                            }
                        }
                    },
                ],
            ],
            directLink: ["*link.zhihu.com/?target=*", "target"],
            css: `
                .RichContent--unescapable.is-collapsed .RichContent-inner {
                    -webkit-mask-image: unset !important;
                    mask-image: unset !important;
                }
                .RichContent.is-collapsed {
                    cursor: unset !important;
                }
                .RichContent-inner {
                    margin-bottom: 40px !important;
                }
            `,
            js: () => {
                setTimeout(() => {
                    querySelectorEqualsText("button[class*='Button--primary']", "打开App").forEach((item) => {
                        item.parentNode.parentNode.remove();
                    });
                }, 1000);
            },
        },
        {
            match: "*://www.cnbeta.com/articles/*",
            hide: ["div[style='display:block !important;position:fixed;bottom:0;margin-top:10px;width:100%;background:#c44;color:#fff;font-size:15px;z-index:99999']"],
        },
        {
            match: "*://xw.qq.com/cmsid/*",
            hide: [".collapseWrapper", ".redbag.item"],
            expand: ["#article_body"],
        },
        {
            // https://xw.qq.com/amphtml/20220222A03ZFF00
            match: "*://xw.qq.com/amphtml/*",
            hide: ["div.ct-unfold"],
            expand: [".article-main.fold"],
        },
        {
            match: "*://xuedingmiao.com/*",
            hide: ["#read-more-wrap"],
            expand: ["#main-content"],
        },
        {
            match: "*://blog.51cto.com/*",
            js: () => {
                safeWaitJQuery(() => {
                    jQuery(function () {
                        $(".copy_btn").removeClass("disable");
                        $(".copy_btn").text("免登录复制");
                        $(".article-content-wrap").unbind("copy");
                        if ("undefined" == typeof unsafeWindow.uid || !unsafeWindow.uid) {
                            unsafeWindow.uid = 1;
                        }
                        $("body")
                            .off()
                            .on("click", ".copy_btn", function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                let $this = $(this);
                                let text = $(this).parents(".hljs-cto").find("pre").find('[class*="language-"]')[0].textContent;
                                copy(text).then(
                                    () => {
                                        $this.text("已复制");
                                        setTimeout(function () {
                                            $this.text("免登录复制");
                                        }, 2000);
                                    },
                                    (e) => {
                                        $this.text("复制失败:" + e);
                                        setTimeout(function () {
                                            $this.text("免登录复制");
                                        }, 2000);
                                    }
                                );
                                return false;
                            });
                    });
                });
            },
        },
        {
            match: "*://wap.peopleapp.com/article/*",
            hide: [".read-more"],
            expand: [".article-wrapper.has-more-high"],
        },
        {
            match: "*://baike.baidu.com/item/*",
            wait: [
                [
                    // 需要循环?
                    ".yx-load-more-inner.J-yx-load-moreContent",
                    (node) => {
                        node.dispatchEvent(new Event("tap"));
                        document.getElementById("ui_refresh_down").style.display = "none";
                        return false;
                    },
                ],
            ],
        },
        {
            match: ["*://m.jb51.cc/*", "*://www.jb51.cc/*"],
            hide: ["#read-more-wrap"],
            expand: ["#container"],
        },
        {
            match: ["*://www.yiidian.com/*", "*://yiidian.com/*"],
            hide: ["#read-more-wrap"],
            expand: ["#yArticle"],
        },
        {
            match: "*://bbs.elecfans.com/m/*",
            hide: [".conMore", ".login-reg-fixed"],
            expand: [".postListCon"],
        },
        {
            match: ["*://www.elecfans.com/*", "*://m.elecfans.com/*"],
            hide: [".seeHide_new_login", ".open_app.open_app_fixed", ".login-reg-fixed", ".seeHide"],
            expand: [".article_content", ".simditor-body"],
        },
        {
            match: "*://www.bandbbs.cn/threads/*",
            hide: [".bbCodeBlock-expandLink.js-expandLink"],
            wait: [[".js-expandWatch:not(.is-expanded)", (node) => node.classList.add("is-expanded")]],
        },
        {
            match: "*://chejiahao.m.autohome.com.cn/info/*",
            hide: ["#continue_reading"],
            expand: [".major-long-details"],
            wait: [[".pgc-details .fn-hide", (node) => node.classList.remove("fn-hide")]],
        },
        {
            match: "*://www.bjtzdbzz.com/*",
            hide: [".pc-request-btn", ".mb-request-btn"],
            expand: [".detail-content-desc-show"],
        },
        {
            match: "*://m.21jingji.com/article/*",
            hide: [".content .mask"],
            expand: [".txtContent"],
        },
        {
            // https://zhidao.baidu.com/question/423275263.html
            match: "*://zhidao.baidu.com/question/*",
            hide: [".w-detail-display-btn-text", ".wgt-best-mask", ".wgt-answers-mask", ".wgt-question-desc-action", ".w-reply-text .unfold", "div.wgt-target .target-text .wgt-target-mask"],
            expand: [".w-detail-container.w-detail-index", "div[id^=best-content-]", "div[id^=answer-content-]", ".wgt-question-desc-inner", ".w-reply-text", "div.wgt-target .target-text", ".w-detail-container.w-detail-single"],
            wait: [
                [
                    "#show-answer-hide",
                    (node) => {
                        if (node.querySelector("span").style.display == "none") {
                            setTimeout(function () {
                                node.dispatchEvent(new Event("click"));
                                node.dispatchEvent(new Event("tap"));
                                console.log("click");
                            }, 1000);
                        }
                    },
                ],
                [
                    ".fold-num-feed.show-more-replies",
                    (node) => {
                        setTimeout(function () {
                            node.dispatchEvent(
                                new Event("click", {
                                    bubbles: true, // 事件冒泡
                                    cancelable: false, // 事件是否可以取消
                                })
                            );
                            node.dispatchEvent(
                                new Event("tap", {
                                    bubbles: true, // 事件冒泡
                                    cancelable: false, // 事件是否可以取消
                                })
                            );

                            console.log("click");
                        }, 1000);
                    },
                ],
            ],
        },
        {
            match: "*://haokan.baidu.com/v*",
            hide: [".share-origin.wx-share-launch", ".player-pause-code-bottom-text", ".player-pause-code-inner"],
        },
        {
            match: "*://www.xz577.com/*",
            hide: [".article-content-body-more1"],
            expand: [".con2"],
        },
        {
            match: "*://www.it1352.com/*",
            hide: [".arc-body-main-more"],
            expand: [".arc-body-main"],
            js: () => {
                $.cookie("olduser", "1", {
                    domain: "it1352.com",
                    expires: 1500,
                });
            },
        },
        {
            match: "*://g.pconline.com.cn/*",
            hide: [".btnForAppOpenA", ".btnForAppOpenImg", ".add_artilce_handle", ".WakeUptop"],
            expand: [".art-content"],
        },
        {
            match: "*://3w.huanqiu.com/*",
            hide: ["#more"],
            expand: ["#content"],
        },
        {
            match: ["*://m.huanqiu.com/*"],
            hide: [".unfold-btn"],
            expand: [".article-content", ".article .content"],
            start: () => {
                Element.prototype._attachShadow = Element.prototype.attachShadow;
                Element.prototype.attachShadow = function () {
                    let css = `
                    .unfold-btn
                    {
                        display: none !important;
                        visibility:hidden !important;
                        max-height: 0 !important;
                        max-width: 0 !important;
                        height: 0 !important;
                        width: 0 !important;
                    }

                    .article-content, .article .content
                    {
                        height: auto !important;
                        max-height: unset !important;
                        overflow: unset !important;
                        -webkit-line-clamp: unset !important;
                    }
                    `;
                    let style = document.createElement("style");
                    style.type = "text/css";
                    try {
                        style.innerHTML = css;
                    } catch (x) {
                        style.innerText = css;
                    }
                    let shadow = this._attachShadow({ mode: "open" });
                    shadow.appendChild(style);
                    return shadow;
                };
            },
            wait: [
                [
                    ".unfold-btn",
                    (node) => {
                        node.dispatchEvent(new Event("click"));
                        node.dispatchEvent(new Event("tap"));
                    },
                ],
            ],
        },
        {
            match: "*://iknow.lenovo.com.cn/*",
            hide: [".coverQRCode"],
            js: () => {
                localStorage.setItem("scanQRCode", "1");
                $(document).off("scroll.unable");
            },
        },
        {
            // https://www.jianshu.com/p/e7dc41b6ea54
            match: "*://www.jianshu.com/p/*",
            hide: [".call-app-btn", "#jianshu-header", "#note-show .content .show-content-free .collapse-tips", ".download", ".note-comment-above-ad-wrap", ".close-collapse-btn", ".open-app-btn", ".app-open", "#guangtui", "#fixed-ad-container", ".fubiao-dialog", ".header-wrap #jianshu-header"],
            expand: ["#note-show .content .show-content-free .collapse-free-content"],
            directLink: ["*://link.jianshu.com/?t=*", "t", "*://links.jianshu.com/go?to=*", "to"],
            js: () => {
                sessionStorage.setItem("showGuidance", 1);
                let node = document.querySelector(".download-app-guidance");
                if (node) {
                    node.__vue__.closeGuidance();
                }
            },
        },
        {
            // 百度新闻, 百家号
            match: ["*://baijiahao.baidu.com/s*", "*://ext.baidu.com/api/comment/v1/page/list*", "*://mbd.baidu.com/newspage/*", "*://www.baidu.com/#iact=wiseindex/tabs/news/activity/newsdetail=*"],
            hide: [".packupButton", ".oPadding", ".newUnfoldFullBox.contentPadding", ".undefined", ".foldMaskWrapper", "#headDeflectorContainer"],
            expand: [".mainContent", "#mainContentContainer"],
            wait: [
                ["p:contains('百度APP内阅读')", (node) => node.parentNode.parentNode.removeChild(node.parentNode)],
                [".layer-content.layer-content-shown", (node) => node.querySelector(".layer-itemBtn.normal").dispatchEvent(new Event("click"))],
            ],
        },
        {
            match: ["*://download.csdn.net/download/*"],
            js: () => {
                let btn = $(".more-wrap").find(".el-button");
                btn.removeAttr("data-report-click");
                btn.click();
                $("#desc-text").prop("checked", true);
            },
        },
        {
            match: ["*://gitcode.csdn.net/*"],
            hide: [".article-show-more", ".article-detail .user-desc-fix", ".content-ai"],
            expand: [".article-detail .main-content .user-article-hide"],
        },
        {
            match: ["*://wenku.csdn.net/*"],
            hide: [".article-box .cont .open", ".article-box .vip", ".article-box pre code .lowerBox"],
            expand: [".article-box .cont.first-show", ".markdown_views .hljs"],
        },
        {
            // https://huaweicloud.csdn.net/657c0ecddafaf23eeaee29b9.html
            match: ["*://huaweicloud.csdn.net/*", "*://openatomworkshop.csdn.net/*"],
            hide: [".article-detail .main-content .user-article-hide .article-show-more", ".article-detail .user-desc-fix"],
            expand: [".article-detail .main-content", ".article-detail .main-content .user-article-hide"],
        },
        {
            // https://ask.csdn.net/questions/8082390/54571405
            match: ["*://ask.csdn.net/*"],
            hide: [".expandBtn"],
            expand: [".ask-issue-content"],
            js: () => {
                $(".answer-more").click();
            },
        },
        {
            match: "*://*blog.csdn.net/*",
            hide: [".weixin-shadowbox.wap-shadowbox", ".aside-header-fixed", ".hide-preCode-box", "#m_toolbar_left .m_toolbar_left_app_btn", ".readall_box", ".feed-Sign-span", ".btn_mod", ".btn_app_link", ".btn-readmore", ".comment_read_more_box", ".btn_open_app_prompt_div", ".feed-Sign-weixin"],
            expand: [".article_content", "#article_content", "#comment", ".set-code-hide"],
            directLink: ["*://link.csdn.net/?target=*", "target"],
            bindClick: [
                "a[href^=http]",
                (node, e) => {
                    if (node.target == "_blank" && !node.hostname.includes(".csdn.net")) {
                        e.stopPropagation();
                    }
                },
            ],
            // https://greasyfork.org/zh-CN/scripts/440400-%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A/discussions/224754
            css: `
                #content_views,code,pre {
                    -webkit-touch-callout: auto !important;
                    -webkit-user-select: auto !important;
                    -khtml-user-select: auto !important;
                    -moz-user-select: auto !important;
                    -ms-user-select: auto !important;
                    user-select: auto !important;
                }
                main div.blog-content-box pre {
                    max-height: unset;
                    overflow-y: unset;
                }
            `,
            js: () => {
                safeWaitJQuery(() => {
                    jQuery(function () {
                        jQuery(function () {
                            jQuery(".recommend-jump-app").removeAttr("id");
                            jQuery(".recommend-jump-app")
                                .off("click")
                                .on("click", (e) => {
                                    let url = jQuery(this).find("a.flag").attr("href");
                                    if (url) {
                                        location.href = url;
                                    }
                                });
                            jQuery("a[data-report-click]").removeAttr("data-report-click");
                            jQuery("a[data-report-query]").removeAttr("data-report-query");
                            if (typeof unsafeWindow.csdn != "undefined") {
                                // https://github.com/adlered/CSDNGreener
                                jQuery("code").attr("onclick", "mdcp.copyCode(event)");
                                try {
                                    unsafeWindow.csdn.copyright.init("", "", "");
                                } catch (err) {}
                                try {
                                    Object.defineProperty(unsafeWindow.csdn.report, "reportClick", {
                                        value: function () {
                                            return true;
                                        },
                                        writable: false,
                                        configurable: false,
                                    });
                                } catch (err) {}
                                try {
                                    Object.defineProperty(unsafeWindow, "articleType", {
                                        value: 0,
                                        writable: false,
                                        configurable: false,
                                    });
                                } catch (err) {}
                            }
                        });
                    });
                });
            },
        },
        {
            match: "*://jingyan.baidu.com/article/*",
            hide: [".read-whole-mask"],
            expand: [".exp-content-container"],
        },
    ];

    function matchRule(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    }

    // https://greasyfork.org/zh-CN/scripts/416338
    function parseUrl(href) {
        if (!href) return {};
        let search;

        try {
            // 链接
            const url = new URL(href);
            ({ search } = url); // 主要处理对hash的search

            if (!search && url.hash.includes("?")) {
                search = url.hash.split("?")[1];
            }
        } catch (err) {
            // 非链接,如：a=1&b=2、?a=1、/foo?a=1、/foo#bar?a=1
            if (href.includes("?")) {
                search = href.split("?")[1];
            } else {
                search = href;
            }
        }

        const searchParams = new URLSearchParams(search);
        return [...searchParams.entries()].reduce((acc, [key, value]) => ((acc[key] = value), acc), {});
    }

    function randomString(length, chars) {
        let result = "";
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + "=; Max-Age=-99999999;";
    }

    function clearAdLoop() {
        let id = setTimeout(";");
        for (let i = 0; i < id; i++) {
            clearTimeout(i);
        }
        id = setInterval(";");
        for (let i = 0; i < id; i++) {
            clearInterval(i);
        }
    }

    function safeWaitJQuery(callbackFunc) {
        let jQueryTimer = setInterval(function () {
            if (typeof jQuery !== "undefined") {
                clearInterval(jQueryTimer);
                callbackFunc(jQuery);
            }
        }, 300);
    }


    function nativeCopy(value) {
        return new Promise((resolve, reject) => {
            let textArea = document.createElement("textarea");
            textArea.value = value;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
                setTimeout(() => {
                    resolve(value);
                }, 1);
            } catch (e) {
                setTimeout(() => {
                    reject(e);
                }, 1);
            }
            document.body.removeChild(textArea);
        });
    }

    function copy(value) {
        return new Promise((resolve, reject) => {
            navigator.clipboard
                ? navigator.clipboard.writeText(value).then(resolve, function () {
                    nativeCopy(text).then(resolve, reject);
                })
                : nativeCopy(text).then(resolve, reject);
        });
    }

    function querySelectorIncludesText(selector, text) {
        return Array.from(document.querySelectorAll(selector)).filter((el) => el.textContent.includes(text));
    }
    function querySelectorEqualsText(selector, text) {
        return Array.from(document.querySelectorAll(selector)).filter((el) => el.textContent.trim() === text);
    }

    // https://github.com/Shawak/TwitchSquad/blob/main/twitchsquad.user.js
    if (typeof GM_addStyle === "undefined") {
        GM_addStyle = function (css) {
            let head = document.getElementsByTagName("head")[0],
                style = document.createElement("style");
            if (!head) {
                return;
            }
            style.type = "text/css";
            try {
                style.innerHTML = css;
            } catch (x) {
                style.innerText = css;
            }
            head.appendChild(style);
        };
    }
    if (typeof unsafeWindow == "undefined") unsafeWindow = window;

    const readyName = randomString(8, "abcdefghijklmnopqrstuvwxyz");

    // https://greasyfork.org/zh-CN/scripts/28497
    var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    var document_addEventListener = document.addEventListener;
    var Event_preventDefault = Event.prototype.preventDefault;


    for (var website of websites) {
        let hit = false;
        if (Array.isArray(website.match)) {
            hit = website.match.some((s) => matchRule(window.location.href, s));
        } else {
            hit = matchRule(window.location.href, website.match);
        }

        if (hit) {
            console.log(website);
            let style = "";
            if ("hide" in website && website.hide.length > 0) {
                style +=
                    website.hide.join(",\n") +
                    `
                {
                    display: none !important;
                    visibility:hidden !important;
                    max-height: 0 !important;
                    max-width: 0 !important;
                    height: 0 !important;
                    width: 0 !important;
                }

                `;
            }
            if ("expand" in website && website.expand.length > 0) {
                style +=
                    website.expand.join(",\n") +
                    `
                {
                    height: auto !important;
                    max-height: unset !important;
                    overflow: unset !important;
                    -webkit-line-clamp: unset !important;
                }

                `;
            }
            if ("disable" in website && website.disable.length > 0) {
                style +=
                    website.disable.join(",\n") +
                    `
                {
                    pointer-events: none !important;
                }

                `;
            }
            if ("css" in website && website.css.length > 0) {
                style += website.css;
            }
            GM_addStyle(style);

            if ("wait" in website) {
                // TODO 需要换种方式优化
                let ready = new Set();
                let id = setInterval(() => {
                    try {
                        for (let w of website.wait) {
                            if (!ready.has(w[0])) {
                                let nodeList;
                                let m = w[0].match(/(.+?):contains\(\s*['"](.+?)['"]\s*\)/);
                                if (m) {
                                    nodeList = querySelectorIncludesText(m[1], m[2]);
                                } else {
                                    m = w[0].match(/(.+?):equals\(\s*['"](.+?)['"]\s*\)/);
                                    if (m) {
                                        nodeList = querySelectorEqualsText(m[1], m[2]);
                                    } else {
                                        nodeList = document.querySelectorAll(w[0]);
                                    }
                                }
                                let allNodeFinish = nodeList.length > 0;
                                nodeList.forEach((node) => {
                                    if (!node.dataset[readyName]) {
                                        if (w[1] === "click") {
                                            node.dispatchEvent(new Event("click"));
                                            node.dispatchEvent(new Event("tap"));
                                            node.click();
                                        } else if (w[1] === "keepclick") {
                                            node.dispatchEvent(new Event("click"));
                                            node.dispatchEvent(new Event("tap"));
                                            node.click();
                                            allNodeFinish = false;
                                            return
                                        } else {
                                            let callret = w[1].call(node, node); // 返回值
                                            if (callret === false) {
                                                allNodeFinish = false;
                                                return;
                                            }
                                        }
                                        node.dataset[readyName] = true;
                                    }
                                });
                                if (allNodeFinish) {
                                    ready.add(w[0]);
                                }
                            }
                        }
                        if (ready.size == website.wait.length) {
                            clearInterval(id);
                        }
                    } catch (x) {
                        console.log(x);
                        clearInterval(id);
                    }
                }, 1000);
            }

            if ("directLink" in website) {
                // 去除链接重定向

                // 支持鼠标左右键和拖拽打开超链接
                document.addEventListener(
                    "mousedown",
                    (e) => {
                        // https://greasyfork.org/zh-CN/scripts/20431-zhihu-link-redirect-fix
                        let dom = e.target;
                        let target = dom.closest("a[href]");
                        if (target) {
                            let d = website.directLink;
                            for (let i = 0; i < d.length; i += 2) {
                                if (matchRule(target.href, d[i])) {
                                    if (typeof d[i + 1] === "function") {
                                        d[i + 1].call(target, target);
                                    } else {
                                        let param = parseUrl(target.href);
                                        if (param[d[i + 1]]) {
                                            target.href = param[d[i + 1]];
                                        }
                                    }
                                    // 避免泄露来源, 加强隐私保护
                                    if (target.target == "_blank") {
                                        let rel = target.getAttribute("rel");
                                        if (rel != null) {
                                            if (!rel.includes("noreferrer")) {
                                                target.setAttribute("rel", rel + " noreferrer");
                                            }
                                        } else {
                                            target.setAttribute("rel", "noreferrer");
                                        }
                                    }
                                }
                            }
                        }
                    },
                    true
                );
            }

            if ("bindClick" in website) {
                document.addEventListener(
                    "click",
                    (e) => {
                        let dom = e.target;
                        let d = website.bindClick;
                        let target = dom.closest(d[0]);
                        if (target) {
                            d[1].call(target, target, e);
                        }
                    },
                    true
                );
            }

            if ("start" in website) {
                website.start();
            }

            if ("js" in website) {
                if (document.readyState == "complete") {
                    website.js();
                    // alert("程序出现异常");
                    // GM_openInTab("https://greasyfork.org/zh-CN/scripts/440400/feedback");
                } else {
                    document.addEventListener("DOMContentLoaded", website.js);
                }
            }

            if ('hookEvent' in website) {

                function addEventListener(type, func, useCapture) {
                    var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
                    if (typeof website.hookEvent === 'function' && website.hookEvent.call(this, type, func, useCapture)) {
                        return true
                    } else if (Array.isArray(website.hookEvent) && website.hookEvent.includes(type)) {
                        return true
                    } else {
                        return _addEventListener.apply(this, arguments);
                    }
                }

                EventTarget.prototype.addEventListener = addEventListener;
                document.addEventListener = addEventListener;

                var frames = document.querySelectorAll("frame")
                if (frames) {
                    for (let i = 0; i < frames.length; i++) {
                        frames[i].contentWindow.document.addEventListener = addEventListener;
                    }
                }

                document.addEventListener("DOMContentLoaded", function () {
                    var frames = document.querySelectorAll("frame")
                    if (frames) {
                        for (let i = 0; i < frames.length; i++) {
                            frames[i].contentWindow.document.addEventListener = addEventListener;
                        }
                    }
                });
            }

            break;
        }
    }
})();
