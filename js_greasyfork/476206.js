// ==UserScript==
// @name         网页阅读优化
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @license      MIT
// @description  对百度百科/CSDN/知乎/简书/360doc/思否/搜狐/网易/剑鱼标讯/企查查/ICONFINDER阅读体验进行优化
// @icon         https://cdn4.iconfinder.com/data/icons/coronavirus-flat/64/mobile-news-app-follow-read-256.png
// @author       CWong
// @home-url     https://greasyfork.org/zh-CN/scripts/476206
// @match        https://baike.baidu.com/item/*
// @match        https://www.zhihu.com
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://blog.csdn.net
// @match        https://blog.csdn.net/*
// @match        https://*.blog.csdn.net/*
// @match        https://www.jianshu.com/p/*
// @match        http://www.360doc.com/content/*
// @match        https://segmentfault.com/a/*
// @match        https://www.sohu.com/a/*
// @match        http://news.sohu.com/a/*
// @match        https://www.qcc.com/*
// @match        https://www.163.com/*
// @match        https://www.jianyu360.cn/*
// @match        https://www.iconfinder.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.js
// @downloadURL https://update.greasyfork.org/scripts/476206/%E7%BD%91%E9%A1%B5%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476206/%E7%BD%91%E9%A1%B5%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//--------------常用封装--------------------
//写入JQuery 3.5.1
//(function(url) { document.body.appendChild(document.createElement('script')).src = url; })("https://code.jquery.com/jquery-3.5.1.js");
//var $;//不能写入
//写入以下的var,太多方法没啥必要
//(function(textContent) { document.body.appendChild(document.createElement('script')).textContent = textContent; })(usefulVar);
//--------------定义--------------
var host = window.location.host, //host
    href = window.location.href; //href
/** get 指定JS querySelector的对象,返回一个对象
 * @param {*} querySelector JS 选择器
 */
function getByQuerySelector(querySelector) {
    if (!document.querySelector(querySelector)) return false;
    return document.querySelector(querySelector);
}
/** get 指定id属性值的对象,返回一个对象
 * @param {*} Id
 */
function getById(Id) {
    if (!document.getElementsById(Id)) return false;
    return document.getElementsById(Id);
}
/**get 指定TagName的对象，返回一个数组
 * @param {*} TagName 指定tag的对象
 */
function getByTagNameArr(TagName) {
    if (!document.getElementsByTagName(TagName)) return false;
    return document.getElementsByTagName(TagName);
}
/** get 指定Name属性的对象，返回一个数组
 * @param {*} Name 指定Name的对象
 */
function getByNameArr(Name) {
    if (!document.getElementsByName(Name)) return false;
    return document.getElementsByName(Name);
}
/** get 指定ClassName的对象，返回一个数组//仅仅缩写
 * @param {*} ClassName 类名称
 */
function getByClassNameArr(ClassName) {
    if (!document.getElementsByClassName(ClassName)) return false; //几乎百分百不会触发
    return document.getElementsByClassName(ClassName);
}
/** get 筛选指定ClassName,利用getByClassNameArr数组返回一个数组
 * @param {*} ClassName 类名称
 */
function getClassUniqueArr(ClassName) {
    var oElements = getByClassNameArr(ClassName),
        boxArr = new Array();
    for (var i = 0, len = oElements.length; i < len; i++) {
        if (oElements[i].className == ClassName) {
            boxArr.push(oElements[i]);
        }
    }
    return boxArr;
}

function QRemove(querySelector) {
    if (!getByQuerySelector(querySelector)) console.log("错误:QRemove不存在;返回值:" + getByQuerySelector(querySelector) + "参数:" + querySelector);
    else getByQuerySelector(querySelector).remove();
}

function CRemove(ClassName) {
    if (getByClassNameArr(ClassName).length == 0) console.log("错误:CRemove不存在;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName);
    else if (getByClassNameArr(ClassName).length == 1) getByClassNameArr(ClassName)[0].remove(); //唯一
    else {
        console.log("提示:CRemove不唯一;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName);
        ArrRomve(getByClassNameArr(ClassName));
    }
}

function ParentRemoveByCRemove(ClassName) {
    if (getByClassNameArr(ClassName).length == 0) console.log("错误:ParentRemoveByCRemove不唯一;返回值:" + ParentRemoveByCRemove(ClassName) + "参数:" + ClassName);
    else if (getByClassNameArr(ClassName).length == 1) getByClassNameArr(ClassName)[0].remove(); //唯一
    else {
        console.log("提示:ParentRemoveByCRemove不唯一;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName);
        ArrRomve(getByClassNameArr(ClassName));
    }
}

/** 倒序遍历删除编辑按钮
 * @param {*} getByArr getBy系列Arr
 */
function ArrRomve(Arr) {
    if (Arr.length == 0) console.log("错误:ArrRomve不存在;返回值:" + ArrRomve(Arr) + "参数:" + Arr);
    else {
        for (var i = Arr.length - 1; i > 0; i--) {
            Arr[i].remove();
        }
    }
}

/*
Element.prototype.remove = function() {
    //   像那些属性节点，注释节点，文本节点等等根本不可能做父节点，所以可以说parentNode返回的一般都是父元素节点====一直没有判断这个节点是否存在
    //if (!this) return false;
    //if (!this.parentNode) return false;
    this.parentNode.removeChild(this); //父元素节点里删除调用者
};
 */
/*
HTMLCollection.prototype.remove = function() {
    //   像那些属性节点，注释节点，文本节点等等根本不可能做父节点，所以可以说parentNode返回的一般都是父元素节点====一直没有判断这个节点是否存在
    //if (this) return false; //HTMLCollection [] 必定存在
    if (this.length == 0) return false; //不存在
    //if (!this.parentNode) return false;
    this.parentNode.removeChild(this); //父元素节点里删除调用者
};
*/
//--------------Function--------------
//--------------常用封装--------------------


(function() {
    'use strict';
    //文章优化
    function paper() {
        //CSDN
        function csdn() {
            //this指向paper
            CRemove("csdn-side-toolbar"); //右下角引导按钮
            QRemove("#mainBox > aside"); //左边博主信息
            QRemove("#recommend-list-box"); //右边推广
            QRemove("#mainBox > main > div.first-recommend-box.recommend-box"); //底下第一下载推广
            QRemove("#mainBox > main > div.second-recommend-box.recommend-box"); //底下第二下载推广
            QRemove("#mainBox > main > div.blog-footer-bottom"); //脚注???经常删不掉
            QRemove("#passportbox"); //移除登录
        }
        //剑鱼标讯
        function jianyu360() {
            QRemove("body > div.page-detail.j-content > div.main-content > div.exposure-content-right--group"); //右边
            QRemove("#B2"); //底部1
            QRemove("#A1"); //商机页底部
            const addivs = document.querySelectorAll('div[data-list-ad]');
            for (let i = 0; i < addivs.length; i++) {
                addivs[i].remove();
            }
        }
        //知乎
        function zhihu() {
            QRemove("#root > div > div.AdblockBanner"); //首页广告拦截
            QRemove("body > div.__web-inspector-hide-shortcut__"); //移除登录
            QRemove("#root > div > main > div > div > div.GlobalSideBar.GlobalSideBar--old > div > div"); //右边创作
            QRemove("#root > div > main > div > div > div.Question-main > div.Question-sideColumn.Question-sideColumn--sticky.css-1qyytj7 > div:nth-child(3) > div.Question-sideColumnAdContainer"); //移除右1广告
            QRemove("#root > div > main > div > div > div.Question-main > div.Question-sideColumn.Question-sideColumn--sticky.css-1qyytj7 > div:nth-child(3) > div:nth-child(3)"); //移除右2广告
            QRemove(".container"); //移除右3广告
            QRemove("#root > div > main > div > div.Question-main > div > div > div.Card.QuestionInvitation"); //问问题
            QRemove("#root > div > main > div > div > div.GlobalSideBar.GlobalSideBar--old > div > div.Sticky.is-fixed > footer"); //脚注
            QRemove("#root > div > main > div > div.Question-main > div.Question-sideColumn.Question-sideColumn--sticky"); //右边博主信息
        }
        //知乎专栏
        function zhihuzhuanlan() {
            QRemove("#root > div > main > div > div.ColumnPageHeader-Wrapper"); //广告拦截
        }
        //简书
        function jianshu() {
            QRemove("#__next > div._3Pnjry"); //左边分享
            QRemove("#__next > div._21bLU4._3kbg6I > div > aside"); //右边推广
            QRemove("#__next > footer"); //下方评论
            QRemove("body > div:nth-child(13)"); //下载推广
        }
        //企查查
        function qcc() {
            QRemove("a.company-banner"); //中间会员广告
        }
        //网易
        function netease() {
            QRemove("#contain > div.post_area.post_columnad_top"); //顶部广告
            let elems = document.querySelectorAll("div.ad_module"); //右侧广告模块
            for (let i = 0; i < elems.length; i++) {
                elems[i].remove();
            }
        }
        //百度百科
        function baidubaike() {
            mustDelete();

            function mustDelete() {
                getByQuerySelector("body > div.header-wrapper.pc-header-new > div > div").style.height = "0px";
                QRemove("body > div.lemmaWgt-searchHeader > div > div.tool-buttons"); //滚动之后,顶部右上角工具栏
                QRemove("body > div.header-wrapper.pc-header-new > div.topbar.cmn-clearfix"); //顶部百度更多导航内容
                QRemove("#searchForm > a.help"); //顶部帮助
                QRemove("#J-declare-wrap"); //顶部免责声明
                QRemove("#J-union-wrapper"); //右边内容
                QRemove("body > div.navbar-wrapper"); //头部百科导航都能删除
                CRemove("top-tool "); //右上角贴边删除class一次性去除试试?ok!
                getByQuerySelector("body > div.body-wrapper > div.content-wrapper > div.content").style.width = "850px"; //中间内容
                QRemove("body > div.body-wrapper > div.content-wrapper > div > div.side-content"); //中间侧边内容
                QRemove("#side-share"); //中间右边贴边固定分享
                QRemove("#tashuo_bottom"); //脚部他说
                QRemove("#J-related-search"); //脚部相关搜索
                QRemove("body > div.body-wrapper > div.after-content"); //脚部内容
                QRemove("body > div.wgt-footer-main"); //脚部备案
                CRemove('edit-icon'); //删除编辑按钮
            }

            if (getByQuerySelector("body > div.body-wrapper.feature.feature_small.custom > div.secondsknow-large-container.J-secondsknow-large-container")) {
                console.log("推广百科");
                CRemove("edit-lemma"); //编辑
                CRemove("lemma-discussion"); //讨论
                QRemove("body > div.body-wrapper.feature.feature_small.custom > div.secondsknow-large-container.J-secondsknow-large-container"); //推广秒懂,学慧网
                QRemove("#pageTabs"); //中间最上面推广标签
                QRemove("body > div.body-wrapper.feature.feature_small.custom > div.content-wrapper > div > div.main-content > div.main_tab.main_tab-defaultTab.curTab > iframe"); //推广视频,学慧网等等.容易因为这个出bug,删除不掉导致各种问题,
            }

            if (getByQuerySelector("body > div.body-wrapper > div.content-wrapper > div > div.main-content > span")) {
                console.log("科普中国");
                QRemove("body > div.body-wrapper > div.before-content"); //秒懂_科普
                QRemove("body > div.body-wrapper > div.before-content > div.J-wgt-seconds-know-container"); //秒懂_科普
                QRemove("body > div.body-wrapper > div.content-wrapper > div > div.main-content > span"); //专家贡献
                QRemove("body > div.body-wrapper > div.content-wrapper > div.content > div.main-content > span.posterFlag.expert-icon"); //专家贡献
                QRemove("#hotspotmining_s"); //中间上面推广他说_科普
                QRemove("body > div.body-wrapper > div.content-wrapper > div > div.main-content > div.special-topic"); //秒懂_科普
            }

            if (getByQuerySelector("body > div.body-wrapper > div.before-content > div")) {
                console.log("普通词条");
                CRemove("edit-lemma"); //编辑
                CRemove("lemma-discussion"); //讨论
                QRemove("body > div.body-wrapper > div.content-wrapper > div > div.main-content > dl.lemmaWgt-lemmaTitle.lemmaWgt-lemmaTitle- > dd > a.add-video.cmn-btn-hover-blue.cmn-btn-28.J-add-video-link"); //上传视频
                QRemove("body > div.body-wrapper > div.before-content > div"); //秒懂视频_普通词条
            }
            //getByQuerySelector("body > div.body-wrapper > div.content-wrapper > div > div.side-content > div.side-catalog").empty()//empty导航目录提取
        }
        //360doc
        /**
         * //顶部bar???不知道是否有需求删除
         * //转载???无法删除,原因:动态加载
         * //vip??????360的js无法加载,原因未明
         */
        function doc360() {
            if (document.querySelector("#bgchange")) document.querySelector("#bgchange").style.width = "1000px"; //外部1000px
            if (document.querySelector("#articlecontent > table")) document.querySelector("#articlecontent > table").style.width = "1000px"; //内部1000px

            //CRemove("header"); //顶部bar???;不知道是否有需求删除;是否需要直接使用搜索框
            //QRemove("#zcommondID > span.newbtn_forward"); //转载???无法删除;原因:动态加载;解决方案:1.直接去掉整个工具栏,2.硬要看一下收藏:有待解决
            QRemove("#adarttopgoogle"); //vip广告
            CRemove("floatqrcode"); //左边二维码
            CRemove("a_right"); //右侧返回顶部
            QRemove("#goTop2"); //右下角返回顶部

            //先去除div3一大串东西先
            if (document.querySelector("body > div.doc360article_content > div.a_left >  div:nth-child(3)").style.width == "676px") {
                QRemove("body > div.doc360article_content > div > div:nth-child(3)");
            }
            QRemove("#bgchange > div.bottom_controler"); //bottom_controler
            QRemove("#bgchange > div.prev_next"); //推荐
            QRemove("#divtort"); //与我们联系
            QRemove("body > div.atfixednav"); //浮动顶部
            //异步动态js
            QRemove("#registerOrLoginLayer"); //登录可以复制
        }

        //segmentfault
        function segmentfault() {
            CRemove("functional-area-left sticky-top d-none d-xl-flex"); //左侧分享
            QRemove("#sf-article > div.row > div.col-12.col-xl-auto"); //右侧广告栏
            QRemove("#footer"); //脚注
        }

        //sohu
        function sohu() {
            // QRemove("#main-header"); //顶部
            QRemove("#article-container > div.column.left"); //左边
            QRemove("#right-side-bar"); //右边
            let elems = document.querySelectorAll("div.godR"); //右侧广告模块
            for (let i = 0; i < elems.length; i++) {
                elems[i].remove();
            }
            QRemove("#float-btn"); //右边按钮
            QRemove("#backsohucom > span.backword");
            QRemove("#article-container > div > div > div > div.statement");
            QRemove("#article-container > div > div > div > div.bottom-relate-wrap.clear.type-3");
            QRemove("#left-bottom-god"); //左下角

            //利用遍历删除所有element,只能用倒序????


            //利用.children[i],test complete
            function test01() {
                if (getByQuerySelector("#article-container > div.left.main")) {
                    for (var i = 0, j = 0, len = document.querySelector("#article-container > div.left.main").children.length; i < len; i++) {
                        //Element.hasAttributes()必定有ture/flase,下次一定要把else写完整
                        //if (document.querySelector("#article-container > div").children[j].hasAttributes()) {
                        if (getByQuerySelector("#article-container > div").children[j].attributes[0].value == "content") {
                            j++;
                        } else {
                            getByQuerySelector("#article-container > div").children[j].remove();
                            //改用CSS3选择器:nth-child,测试好像是不能够更改变量
                            //document.querySelector("#article-container > div:nth-child(" + j + ")").remove();
                        }
                        //} else;
                    }
                }
            }

            test02();
            //利用css3:nth.child,test complete
            function test02() {
                if (getByQuerySelector("#article-container > div.left.main")) {
                    for (var i = 0, j = 1, len = document.querySelector("#article-container > div.left.main").children.length; i < len; i++) {
                        //Element.hasAttributes()必定有ture/flase,下次一定要把else写完整
                        //if (document.querySelector("#article-container > div").children[j].hasAttributes()) {
                        if (document.querySelector("#article-container > div > div:nth-child(" + j + ")").attributes[0].value == "content") {
                            j++;
                        } else {
                            //getByQuerySelector("#article-container > div").children[j].remove();
                            //改用CSS3选择器:nth-child,测试好像是不能够更改变量
                            document.querySelector("#article-container > div > div:nth-child(" + j + ")").remove();
                        }
                        //} else;
                    }
                }
            }

        }
        
        //ICONFINFER
        function iconfinder() {
            QRemove("#carbonads");
            QRemove("div.istockphoto-placeholder.d-block"); //中间非Pro加载广告
        }

        //判断网页host
        switch (host) {
            case "blog.csdn.net":
                csdn();
                break;
            case "www.zhihu.com":
                zhihu();
                break;
            case "zhuanlan.zhihu.com":
                zhihuzhuanlan();
                break;
            case "www.jianshu.com":
                jianshu();
                break;
            case "baike.baidu.com":
                baidubaike();
                break;
            case "www.360doc.com":
                doc360();
                break;
            case "segmentfault.com":
                segmentfault();
                break;
            case "csdnnews.blog.csdn.net":
                csdn();
                break;
            case "www.sohu.com":
                sohu();
                break;
            case "news.sohu.com":
                sohu();
                break;
            case "www.qcc.com":
                setTimeout(qcc, 1000);
                break;
            case "www.163.com":
                netease();
                break;
            case "www.jianyu360.cn":
                jianyu360();
                break
            case "www.iconfinder.com":{
                setTimeout(iconfinder, 3000);
                break;
            }
            default:
                console.log(host + "域名不是文章");
        }
    }
    //延时
    //window.onload = function() { setTimeout(paper(), 0); };
    //jQuery预载

    var $ = jQuery.noConflict(true);
    $(document).ready(paper());
})();