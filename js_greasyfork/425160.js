// ==UserScript==
// @name         跳转主流网站 + 主流网页文章界面优化 + 网盘失效链接网站自动关闭 + 超链接增强 + 搜索引擎页面 按G键打开前10个搜索 + 去百度百科图片水印
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  个人使用,跳转主流网站 + 主流文本优化 + 超链接增强 + 搜索引擎按G键打开前10个搜索
// @author       白水
// @include      *
// @note         http://www.kisssub.org/show-*.html
// @note         http://www.comicat.org/show-*.html
// @note         https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.11.1/tocbot.min.js
// @namespace    http://www.kisssub.org/
// @namespace    http://www.comicat.org/
// @run-at       document-start
// @icon         http://www.kisssub.org/images/favicon/kisssub.ico
// @icon         https://translate.google.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @note         词频统计/历史记录分析/自动点击签到
// @downloadURL https://update.greasyfork.org/scripts/425160/%E8%B7%B3%E8%BD%AC%E4%B8%BB%E6%B5%81%E7%BD%91%E7%AB%99%20%2B%20%E4%B8%BB%E6%B5%81%E7%BD%91%E9%A1%B5%E6%96%87%E7%AB%A0%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%20%2B%20%E7%BD%91%E7%9B%98%E5%A4%B1%E6%95%88%E9%93%BE%E6%8E%A5%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%20%2B%20%E8%B6%85%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA%20%2B%20%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E9%A1%B5%E9%9D%A2%20%E6%8C%89G%E9%94%AE%E6%89%93%E5%BC%80%E5%89%8D10%E4%B8%AA%E6%90%9C%E7%B4%A2%20%2B%20%E5%8E%BB%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%9B%BE%E7%89%87%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/425160/%E8%B7%B3%E8%BD%AC%E4%B8%BB%E6%B5%81%E7%BD%91%E7%AB%99%20%2B%20%E4%B8%BB%E6%B5%81%E7%BD%91%E9%A1%B5%E6%96%87%E7%AB%A0%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%20%2B%20%E7%BD%91%E7%9B%98%E5%A4%B1%E6%95%88%E9%93%BE%E6%8E%A5%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%20%2B%20%E8%B6%85%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA%20%2B%20%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E9%A1%B5%E9%9D%A2%20%E6%8C%89G%E9%94%AE%E6%89%93%E5%BC%80%E5%89%8D10%E4%B8%AA%E6%90%9C%E7%B4%A2%20%2B%20%E5%8E%BB%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%9B%BE%E7%89%87%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';
    Array.prototype.isNull = function () { return (!this || this == [] || this.length <= 0)}
    String.prototype.isEmpty = function () { return (this.length === 0 || !this.trim())}
    String.prototype.isNull = function () { return (this === undefined || null)}
    //能不能倒叙取值
    String.prototype.splits = function (splitStrHead,splitStrFoot){var splitment = this;if(splitStrHead){splitment = splitment.split(splitStrHead)[1]};if(splitStrFoot){splitment = splitment.split(splitStrFoot)[0]};return splitment}
    String.prototype.asciiEncode = function () {return this.replace(":","%3A").replace("#","%23").replaceAll("/","%2F").replaceAll(" ","%20")}
    //encodeURIComponent() 替代
    String.prototype.asciiDecode = function () {return this.replace("%3A", ":").replace("%23", "#").replaceAll("%2F", "/").replaceAll("%20"," ")}
    //window.open.("read://http_www.360doc.com/?url="+location.href.asciiEncode())
    //var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    String.prototype.httpHtml = function(){return this.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g, '<a href="$1$2">$1$2</a>')}
    Element.prototype.httpHtml = function (){if(!this){return false};this.innerHTML = this.innerHTML.httpHtml();return this.innerHTML}
    HTMLCollection.prototype.httpHtml = function(){for (var i = this.length - 1; i > -1 ;i--){this[i].httpHtml()}}

    Element.prototype.remove = function () {if(this){this.parentNode.removeChild(this)}}
    HTMLCollection.prototype.remove = function(){for (var i = this.length - 1; i > -1 ;i--){this[i].remove()}}
    NodeList.prototype.remove = function(){for (var i = this.length - 1; i > -1 ;i--){this[i].remove()}}
    Element.prototype.removeBesideChildren = function(){for (var i = this.parentNode.childNodes.length - 1; i > -1 ;i--){if(this.parentNode.childNodes[i].className == this.className){continue};this.parentNode.childNodes[i].remove()}}
    Element.prototype.removeLastChildren = function(){for (var i = this.parentNode.childNodes.length - 1; i > -1 ;i--){if(this.parentNode.childNodes[i].className == this.className){break};this.parentNode.childNodes[i].remove()}}
    Element.prototype.removeBeforeChildren = function(){for (var i = 0;i<this.parentNode.childNodes.length - 1;i++){if(this.parentNode.childNodes[0].className == this.className){break};this.parentNode.childNodes[0].remove()}}
    Element.prototype.removeTree = function(j){if(this){this.removeBesideChildren();var parent = this.parentNode;j = j||3;for(var i = 0;i<j;i++){parent.removeBesideChildren();parent = parent.parentNode}}}

    Element.prototype.targetBlank = function(){if(this && !this.href.includes("javascript")){this.target = '_blank'}}
    HTMLCollection.prototype.targetBlank = function(){for (var i=0,length = this.length; i<length;i++){this[i].targetBlank()}}
    NodeList.prototype.targetBlank = function(){for (var i=0,length = this.length; i<length;i++){this[i].targetBlank()}}

    Element.prototype.autoClick = function (getElementTextIncludes){if(this.textContent && this.textContent.includes(getElementTextIncludes)){this.click();console.log("点击成功")}}//整个网页加载成功

    HTMLCollection.prototype.toArray = function(){return [].slice.call(this)}
    NodeList.prototype.toArray = function(){return [].slice.call(this)}
    /**
    NodeList.prototype.click = function() {
        if (this){
            for (let elem of this) {
               elem.click()
            }
            console.log(this.length)
        }
        else{alert("目标不存在")}
    }
    **/

    /*备选案例 toArray
            document.getElementsByTagName('a').toArray().forEach(function(e, i){
                console.log(e + '->' + i);
        });
    */
    //HTMLCollection forEach语法糖
    //选取
    NodeList.prototype.href = function() {
        let res = "";
        if (this){
            for (let elem of this) {
                    res += elem.href + "\n"
            }
            console.log(this.length)
            console.log(res)
            copy(res)
        }
        else{alert("目标不存在")}
    }

        NodeList.prototype.hrefAndtextContent = function() {
        let res = "";
        if (this){
            for (let elem of this) {
                    res += elem.href + "\t" + elem.textContent + "\n"
            }
            console.log(this.length)
            console.log(res)
            copy(res)
        }
        else{alert("目标不存在")}
    }

            NodeList.prototype.hrefAndinnerText = function() {
        let res = "";
        if (this){
            for (let elem of this) {
                    res += elem.href + "\t" + elem.innerText + "\n"
            }
            console.log(this.length)
            console.log(res)
            copy(res)
        }
        else{alert("目标不存在")}
    }


    NodeList.prototype.textContent = function() {
        let res = "";
        if (this){
            for (let elem of this) {
                res += elem.textContent + "\n"
            }
            console.log(this.length)
            console.log(res)
            copy(res)
        }
        else{alert("目标不存在")}
    }
    NodeList.prototype.innerText = function() {
        let res = "";
        if (this){
            for (let elem of this) {
                res += elem.innerText + "\n"
            }
            console.log(this.length)
            console.log(res)
            copy(res)
        }
        else{alert("目标不存在")}
    }

    NodeList.prototype.facebookGroupScarpy = function() {
        let res = "";
        if (this) {
            if (document.querySelector("#mount_0_0_8t h1 > span").textContent) {
                let keyword = document.querySelector("#mount_0_0_8t h1 > span").textContent
                let i = 1
                let elema = document.querySelectorAll("div[role=main] h2 a")

                for (let elem of this) {
                    res += keyword + "\t" + elem.href + "\t" + elem.innerText + "\t" + elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].children[0].textContent + "\n"
                }

            } else {
                console.log("找不到关键词")
            }
            copy(res)
            console.log(res)
            console.log(this.length)
            return
        } else {
            alert("目标不存在")
        }
    }

    NodeList.prototype.googleScarpy = function() {
        let res = "";
        if (this){
            if (document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").value){
                let keyword = document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").value
                let host = location.host
                let i = 1
                for (let elem of this) {
                    if(elem.href!==""&&!elem.href.includes(".apple.com")&&!elem.href.includes(".quora.com")&&!elem.href.includes("lalibre.be")&&!elem.href.includes("linkedin.")&&!elem.href.includes("stackoverflow.")&&!elem.href.includes(".gov")&&!elem.href.includes(".org")&&!elem.href.includes(".globalsources.")&&!elem.href.includes("www.sunsky-online.")&&!elem.href.includes(".wikipedia.")&&!elem.href.includes(".pinterest.")&&!elem.href.includes(".alibaba.")&&!elem.href.includes(".made-in-china.")&&!elem.href.includes(".ebay.")&&!elem.href.includes(".aliexpress.")&&!elem.href.includes(".lg.com")&&!elem.href.includes(".gov.uk")&&!elem.href.includes(".samsung.com")&&!elem.href.includes("github")&&!elem.href.includes("ntaow.com")&&!elem.href.includes("google")&&!elem.href.includes("bing")&& !elem.href.includes("bing")&& !elem.href.includes("amazon")&& !elem.href.includes("yahoo")&& !elem.href.includes("ebay")&& !elem.href.includes("twitter")&& !elem.href.includes("youtube")&& !elem.href.includes("facebook")){
                        res += host + "\t" + keyword + "\t" + i + "\t" + elem.textContent + "\t" + elem.parentElement.parentElement.childNodes[1].textContent + "\t" + elem.href + "\n"
                    }
                    i++
                }
            }else{
                console.log("找不到关键词")
            }
            copy(res)
            console.log(res)
            console.log(this.length)
            return
        }
        else{alert("目标不存在")}
    }


        NodeList.prototype.googleScarpyFacebook = function() {
        let res = "";
        if (this){
            if (document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").value){
                let keyword = document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").value
                let host = location.host
                let i = 1
                for (let elem of this) {
                    if(elem.href.includes("facebook")){
                        res += host + "\t" + keyword + "\t" + i + "\t" + elem.textContent + "\t" + elem.parentElement.parentElement.childNodes[1].textContent + "\t" + elem.href + "\n"
                    }
                    i++
                }
            }else{
                console.log("找不到关键词")
            }
            copy(res)
            console.log(res)
            console.log(this.length)
            return
        }
        else{alert("目标不存在")}
    }
    // 自动加载代码
    /*
    var fn = function(){
        if(document.querySelectorAll("div.yuRUbf > a")){document.querySelectorAll("div.yuRUbf > a").googleScarpy()}
    }
    setInterval(fn,1000);
    */

    const getLocation = location,
          getHostname = getLocation.hostname,
          getPathname = getLocation.pathname,
          getHref = getLocation.href,
          getSearch = getLocation.search,
          getTitle = document.title,
          //isSearchEmpty = getSearch.isEmpty(),
          //功能
          //fast reload justict
          isRedirect_Universal=true,//重定向
          //document reload
          isAddTarget_blank = true,//自动新标签打开
          isCheckTagP_UrlLink = false,//检查Url地址
          //js reload
          isAutoClick = true,//自动点击
          QQNum = "1037482258",
          isDefaultTranslate_ZH = false,//自动转换中文标题
          isYoutubeGetDownloadUrl = false,//youtube下载链接
          isShowPager = false,//自动翻页功能
          isdeObverse = false,//反监听功能
          isHistory = false,//历史记录
          isKeyword = false,//关键词
          isCiPin = true,//词频
          iskeyPress = true,//按键映射
          isVideoEnhanced = true,//Video增强
          isSpider = true,//简易式爬虫
          isPaper = true,//文章优化
          isHerf = true,//标签处理
          isAjax = false,//Ajax
          isBaikeSrcChange = true,//百科图片监听
          isTest= false
    ;

    //function autoClick(getElement,getElementTextIncludes){if(getElement && getElement.textContent.includes(getElementTextIncludes)){getElement.click();console.log("点击成功")}};//整个网页加载成功
    //百度百科 图片监察
    //反监听
    if(isdeObverse){
        let div = document.createElement('div');
        let loop = setInterval(() => {
            console.log(div);
            console.clear()});
        // 监听id，当有人访问到div对象的id时，触发的事件。
        // 当我们打开浏览器并且输入console.log(div)时，chrome dev tool默认会打印（访问）DOM对象的id。这是一个细节。所以就会触发这个事件
        Object.defineProperty(div,"id",{get: () =>{
            clearInterval(loop);
            alert("Dev Tools detected!")}});
    }
    if(isBaikeSrcChange && getHostname == "baike.baidu.com" && getPathname.includes("pic")){setInterval((TargetNode = document.getElementById("imgPicture"))=>{if (TargetNode && TargetNode.src.includes('?')){document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}},500)}
    if(isAutoClick){
        let clickEvent = ""
        if(getHref == "https://www.52pojie.cn/"){let clickEvent = ()=>{if(document.querySelector("#um > p:nth-child(3) > a:nth-child(1) > img").src == "https://www.52pojie.cn/static/image/common/qds.png"){document.querySelector("#um > p:nth-child(3) > a:nth-child(1)").click()}}}
        if(getHref == "https://moeli-desu.com/"){let clickEvent = ()=>{if(document.querySelector("#inn-nav__point-sign-daily > a").textContent.trim() == "签到"){document.querySelector("#inn-nav__point-sign-daily > a").click()}}}
        if(getHref == "https://nbsd.live/user" ){let clickEvent = ()=>{if(document.querySelector("#checkin").textContent.includes("点我签到")){document.querySelector("#checkin").click()}}}
        if(clickEvent !== ""){setInterval(clickEvent, 500)}
    }
    //谷歌翻译ditto翻译错误
    if(isRedirect_Universal){
        console.log(`${getHostname},${document.title}`)
        //google translate
        if(getHostname == "translate.google.com" && getPathname.includes("?tl=en#auto/en/")) {location.replace(decodeURIComponent(getHref).replace("?tl=en#auto/en/", "?text="))}
        //m.vk & m.facebook
        //else if (getHostname == "m.facebook.com" || getHostname == "m.vk.com"){location.host = getHostname.replace("m.","")}
        else if (/^m\./.test(getHostname)){location.host = getHostname.substr(2)}
        //csdn
        //TBD asciiDecode() encodeURIComponent encodeURI
        else if (getHostname == "link.zhihu.com" || getHostname == "link.csdn.net" && getHref.includes("?target=")) {location.replace(decodeURIComponent(getHref.splits("?target=")))}
        //jianshu
        //https://www.jianshu.com/go-wild?ac=2&url=https%3A%2F%2Fwww.anaconda.com%2Fdownload%2F%23linux
        else if (getHostname == "www.jianshu.com" && getHref.includes("&url=")) {location.replace(decodeURIComponent(getHref).splits("&url="))}
        //agefans 重定向
        else if (getHostname == "www.agefans.cc" || getHostname == "www.agefans.vip" && getPathname.includes("detail")){location.replace(getHref.replace("detail","play") + "?playid=3_1")}
        //qq邮箱 重定向
        else if (getHostname == "mail.qq.com" && getSearch.includes("gourl=")) {location.replace(decodeURIComponent(getHref).splits("gourl=","&"))}
        //百度网盘
        //失效链接 自动关闭
        else if (getHostname == "pan.baidu.com" && getTitle == "百度网盘-链接不存在") {alert(document.title);window.close()}
        //js mozilla 中文 语言选择 重定向
        //加载不动window.onload
        //else if (getHostname == "developer.mozilla.org" && getPathname.includes("/zh-CN/") && document.querySelector("#content > div.fallback-document.notecard.success")){location.replace(getHref.replace("/zh-CN/","/en-US/"))}
        else if (getHostname == "developer.mozilla.org" && getPathname.includes("/en-US/")){window.open(getHref.replace("/en-US/","/zh-CN/"))}
        else if (getHostname == "www.jishu5.com" && document.querySelector("#mainContent > div:nth-child(1) > div.content > div.desc > div > a").textContent == "访问网址"){location.replace(document.querySelector("#mainContent > div:nth-child(1) > div.content > div.desc > div > a").href)}
        else {console.log("不用转跳");}
    }
    /*  案例
    https://csdnnews.blog.csdn.net/article/details/112781687
    https://blog.csdn.net/qq_41699100/article/details/84976425
    https://www.zhihu.com/question/440955191/answer/1697038419
    https://zhuanlan.zhihu.com/p/55026716
    https://www.jianshu.com/p/921e0b89909b
    https://segmentfault.com/a/1190000038406115
    https://www.sohu.com/a/270273105_270867
    http://www.360doc.com/content/11/1209/13/2795334_171000215.shtml
    https://baike.baidu.com/item/%E5%BF%83%E7%90%86%E5%AD%A6/6215
*/
    //Tree & js remove()
    window.onload = function(){
        if (getHostname == "www.agefans.cc" || getHostname == "www.agefans.vip" && getHref.includes("?playid=3_1") && document.title.includes("对不起")){location.replace(getHref.replace("?playid=3_1","?playid=2_1"))}
        if (getHostname == "www.agefans.cc" || getHostname == "www.agefans.vip" && getHref.includes("?playid=2_1") && document.title.includes("对不起")){location.replace(getHref.replace("?playid=2_1","?playid=1_1"))}
        if(isPaper){
            //csdn
            if (getHostname == "csdnnews.blog.csdn.net" || "blog.csdn.net" && getPathname.includes("/article/")) {
                document.querySelector("#mainBox > main > div.blog-content-box").removeTree();
                document.querySelectorAll(".ouvJEz")[1].remove();
            }
            //百度百科


            else if (getHostname == "baike.baidu.com" && getPathname.includes("/item/")) {
                if(document.querySelector("div.feature_poster")){
                    document.querySelector("div.main-content").removeLastChildren()
                    document.querySelector("body > div.body-wrapper.feature.feature_small.custom").removeBesideChildren()
                    document.querySelector("body > div > div.feature_poster").removeBeforeChildren()
                    document.querySelector("body > div > div.tabCards").remove()
                }
                if(!document.querySelector("div.feature_poster")){document.querySelector("div.main-content").removeTree()}
                if(document.querySelector("div.main-content")){document.querySelector("div.main-content").style.width = "1050px"}

                document.querySelector("h1").removeLastChildren()
                document.querySelector("div.top-tool").remove()
                document.querySelector("#side-share").remove()

                document.querySelector("#tashuo_bottom").remove()
                document.querySelectorAll("iframe").remove()
                document.querySelector("body > div > div.content-wrapper > div > div > div.main_tab.main_tab-defaultTab.curTab > iframe").remove()
                document.querySelectorAll("a.edit-icon").remove()
            }
            //百度知道
            else if(getHostname == "zhidao.baidu.com" && getPathname.includes("/question/")){document.querySelector("#body").removeBesideChildren()}
            //知乎 问题页面
            else if (getHostname == "www.zhihu.com" && getPathname.includes("/question/")) {document.querySelector("#root > div > main > div > div.Question-main > div.Question-mainColumn").removeBesideChildren()}
            //知乎专栏
            else if (getHostname == "zhuanlan.zhihu.com" && getPathname.includes("/p/")) {}
            //简书
            else if (getHostname == "www.jianshu.com" && getPathname.includes("/p/")) {document.querySelector("article").removeTree(4)}
            //思否
            else if (getHostname == "segmentfault.com" && getPathname.includes("/a/")) {document.querySelector("#root > div.article-content.container > div.row > div.col-12.col-xl.w-0.col > div.border-0.mb-4.card").removeTree()}
            //360文档 无法加载removeTree
            else if (getHostname == "www.360doc.com" && getPathname.includes("/content/")) {
                //document.querySelector("body > div.doc360article_content > div.a_left > div:nth-child(2)").remove();
                document.querySelector("#bgchange").removeTree()
                document.querySelector("body > div > div > div:nth-child(2)").remove()
            }
            //搜狐
            else if (getHostname == "www.sohu.com" && getPathname.includes("/a/")) {
                document.querySelector("#article-container > div.left.main > div:nth-child(1)").removeTree()
                if(document.querySelector("#article-container > div")){document.querySelector("#article-container > div").style.width = "850px"}
            }
            else{console.log("不是文章")}
        }
        if(isHerf){
            //tagA_csdn/zhihu redrict
            if(getHostname == "zhuanlan.zhihu.com"||getHostname == "www.zhihu.com"||getHostname == "blog.csdn.net"||getHostname == "csdnnews.blog.csdn.net"){for(var element of document.links){if(element.href.includes("https://link.zhihu.com/?")){element.href = decodeURIComponent(element.href).splits("?target=")}}}
            //Tree加载tagA_blank
            if(isAddTarget_blank){document.links.targetBlank()}
        }
        if(iskeyPress){
            document.onkeydown = keyPress;
            function keyPress(){
                /*
                if(document.querySelector('video').webkitSupportsFullscreen){
                    if(!document.querySelector('video').webkitDisplayingFullscreen){
                        if(event.keyCode ==13){

                        }
                    }
                }
                */
                //if(event.keyCode ==13){submit()}
                //禁止事件 ctrl + 输入框 按下按键
                if(!event.ctrlKey && document.activeElement.tagName !== "INPUT"){
                    //简易式爬虫
                    //if(isSpider){
                    var targetElements = "";
                    if(getHostname.includes("www.google.") && getPathname == "/search"){targetElements = document.querySelectorAll("div.yuRUbf > a")}
                    else if(getHostname.includes(".bing.com") && getPathname == "/search"){targetElements = document.querySelectorAll("h2 > a")}
                    else if(getHostname.includes("www.baidu.com") && getPathname == "/s"){targetElements = document.querySelectorAll("div.result.c-container.new-pmd > h3.t >a")}
                    else if(getHostname == "search.bilibili.com" && getPathname=="/all"){targetElements = document.querySelectorAll("#all-list > div.flow-loader > div.mixin-list > ul > li > a")}
                    else if(getHostname == "search.gitee.com"){targetElements = document.querySelectorAll("#hits-list > div > div.header > div > a")}
                    else if(getHostname == "github.com" && getPathname == "/search"){targetElements =document.querySelectorAll("#js-pjax-container > div > div.col-12.col-md-9.float-left.px-2.pt-3.pt-md-0.codesearch-results > div > ul > li > div.mt-n1 > div.f4.text-normal > a")}
                    else{console.log("不是搜索引擎")}
                    //KeyF
                    if(!location.hostname=="www.facebook.com" && event.keyCode == 70){
                        if(targetElements != ""){for (let element of targetElements){if(this && this.href !== "javascript:void(0)" && this.href !== "javascript:;" && !element.href.includes("cn.bing.com")){window.open(element.href)}}}
                        else{for (let element of document.links) {window.open(element.href)}}
                    }
                    //KeyG
                    if(event.keyCode == 71){for (var i =0; i<10 ;i++){window.open(targetElements[i].href)}}
                    //KeyC
                    if(event.keyCode == 67){copy(document.querySelectorAll("#toViewData > div.panel-body > table > tbody > tr> td > div > div.col-xs-8 > h4 > span:nth-child(2)").textContent())}//c
                    //}
                    //划词搜索
                    if(window.getSelection().toString()){
                        //KeyS
                        if(event.keyCode == 83){window.open("https://cn.bing.com/search?q=" + window.getSelection().toString())}
                        if(event.keyCode == 83){window.open("https://www.bing.com/search?q=" + window.getSelection().toString())}
                        //KeyD
                        if(event.keyCode == 68){window.open(window.getSelection().toString())}
                        //KeyM
                        if(event.keyCode == 77){window.open("https://cn.bing.com/maps?q=" + window.getSelection().toString())}
                        if(event.keyCode == 77){window.open("https://www.bing.com/maps?q=" + window.getSelection().toString())}
                    }
                    //切换搜索引擎
                    if(getPathname == "/search"){
                        if(getHostname == "cn.bing.com" && event.keyCode == 83){location.host = "www.google.co.jp"}
                        if(getHostname == "www.google.co.jp"|"www.google.com" && event.keyCode == 83){location.host = "cn.bing.com"}
                    }
                    if(isVideoEnhanced){
                        var video = document.querySelector("bwp-video")||document.querySelector("video");
                        /*
                        var video;
                        if(document.querySelector("bwp-video").playbackRate){video = document.querySelector("bwp-video")}
                        else if(document.querySelector("video").playbackRate){video = document.querySelector("video")}
                        else{console.log("不存在视频")}
                        */

                        if(video){
                            var cha = 48;
                            if(event.keyCode == 1 + cha ){video.playbackRate = 1}
                            if(event.keyCode == 2 + cha ){video.playbackRate = 2}
                            if(event.keyCode == 3 + cha ){video.playbackRate = 3}
                            if(event.keyCode == 4 + cha ){video.playbackRate = 4}
                            if(event.keyCode == 5 + cha ){video.playbackRate = 16}
                            if(event.keyCode == 90){video.playbackRate = 1}//z
                            if(event.keyCode == 88){video.playbackRate = video.playbackRate - 0.1}//x
                            if(event.keyCode == 67){video.playbackRate = video.playbackRate + 0.1}//c
                        }
                    }
                    //alt+a
                    //f
                }
            }
        }
        if(isTest){
            //github中文
            if(isDefaultTranslate_ZH && getHostname == "github.com"){
                var replacement ={
                    0:"body > div.position-relative.js-header-wrapper > header > div.Header-item.Header-item--full.flex-column.flex-md-row.width-full.flex-order-2.flex-md-order-none.mr-0.mr-md-3.mt-3.mt-md-0.Details-content--hidden-not-important.d-md-flex > nav",
                    1:"n-toolbar > div > div > div.toolbar-container-left > li"
                }
                console.log(document.querySelector(replacement[0]));
            }
            //无法找到这个目标
            //youtube下载
            if(isYoutubeGetDownloadUrl && getHostname == "www.youtube.com" && getPathname.includes("channel")){
                var urls = [];
                var urlsStr = '';
                //无法找到这个目标
                var list = document.querySelectorAll('ytd-grid-video-renderer div[id="meta"] a');
                for (var z in list) {
                    if ( !! list[z].href) {
                        urls.push(list[z].href);
                        urlsStr += ('\n\n' + list[z].href)}
                }
                var jsonStr = JSON.stringify(urls) + '\n\n\n\n\n\n' + urls;
                var mimeType = "text/plain";
                var btn = document.createElement("a");
                btn.style.cssText = "display: block; position: fixed; right:0; top: 40%; font-size: 20px;";
                btn.href = "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(jsonStr);
                btn.innerHTML = "下载视频列表";
                btn.download="code.txt";
                document.getElementsByTagName('ytd-app')[0].appendChild(btn);
            }
            //HtmlCollection
            //if(isAddTarget_blank){document.querySelectorAll("a[href]").targetBlank()}//NodeList
            if(isCheckTagP_UrlLink){}
            //自动签到
            if(isDefaultRegister_AutoClick){
                if( isDefaultLoginQQ_AutoClick && getHostname == "graph.qq.com" && getHref.includes("/oauth2.0/show?")){autoClick(document.querySelector("#img_out_"+ QQNum).parentElement, QQNum)}
                else if( getHref == "https://www.52pojie.cn/" && getHref.includes("")){autoClick(document.querySelector("#um > p:nth-child(3) > img"),"签到打卡")}
                else if( getHref == "https://nbsd.live/user" && getHref.includes("")){autoClick(document.querySelector("#checkin"),"点我签到")}
                else if( getHref == "https://user.qzone.qq.com/1037482258/infocenter" && getHref.includes("")){autoClick(document.querySelector("#checkin_button"),"")}
                else{console.log("不需要签到")}
            }
            //自动翻页
            if(isShowPager){
                // 自动无缝翻页，修改自 https://greasyfork.org/scripts/14178
                function showPager() {
                    ShowPager = {
                        getFullHref: function (e) {
                            if(e == null) return '';
                            "string" != typeof e && (e = e.getAttribute("href"));
                            var t = this.getFullHref.a;
                            return t || (this.getFullHref.a = t = document.createElement("a")), t.href = e, t.href;
                        },
                        createDocumentByString: function (e) {
                            if (e) {
                                if ("HTML" !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, "application/xhtml+xml");
                                var t;
                                try {t = (new DOMParser).parseFromString(e, "text/html")}
                                catch (e) {}
                                if (t) return t;
                                if (document.implementation.createHTMLDocument) t = document.implementation.createHTMLDocument("ADocument");
                                else try {
                                    (t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)),
                                        t.documentElement.appendChild(t.createElement("head")), t.documentElement.appendChild(t.createElement("body"))
                                }catch (e) {}
                                if (t) {
                                    var r = document.createRange();
                                    r.selectNodeContents(document.body);
                                    var n = r.createContextualFragment(e);
                                    t.body.appendChild(n);
                                    for (var a, o = {
                                        TITLE: !0,
                                        META: !0,
                                        LINK: !0,
                                        STYLE: !0,
                                        BASE: !0
                                    }, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                                    return t;
                                }
                            } else console.error("没有找到要转成DOM的字符串");
                        },
                        loadMorePage: function () {
                            if (curSite.pager) {
                                let curPageEle = getElementByXpath(curSite.pager.nextLink);
                                var url = this.getFullHref(curPageEle);
                                //console.log(`${url} ${curPageEle} ${curSite.pageUrl}`);
                                if(url === '') return;
                                if(curSite.pageUrl === url) return;// 不会重复加载相同的页面
                                curSite.pageUrl = url;
                                // 读取下一页的数据
                                curSite.pager.startFilter && curSite.pager.startFilter();
                                GM_xmlhttpRequest({
                                    url: url,
                                    method: "GET",
                                    timeout: 5000,
                                    onload: function (response) {
                                        try {
                                            var newBody = ShowPager.createDocumentByString(response.responseText);
                                            let pageElems = getAllElements(curSite.pager.pageElement, newBody, newBody);
                                            let toElement = getAllElements(curSite.pager.HT_insert[0])[0];
                                            if (pageElems.length >= 0) {
                                                let addTo = "beforeend";
                                                if (curSite.pager.HT_insert[1] == 1) addTo = "beforebegin";
                                                // 插入新页面元素
                                                pageElems.forEach(function (one) {
                                                    toElement.insertAdjacentElement(addTo, one);
                                                });
                                                //删除悬赏贴
                                                delateReward();
                                                // 替换待替换元素
                                                try {
                                                    let oriE = getAllElements(curSite.pager.replaceE);
                                                    let repE = getAllElements(curSite.pager.replaceE, newBody, newBody);
                                                    if (oriE.length === repE.length) {
                                                        for (var i = 0; i < oriE.length; i++) {oriE[i].outerHTML = repE[i].outerHTML}}}
                                                catch (e) {console.log(e)}}}
                                        catch (e) {console.log(e)}}})}},}}}
        }
        /*历史记录测试*/
        if(isHistory){function goBack(){history.back()};function goForward(){history.forward()}}
        if(isCiPin){
            String.prototype.cipin=function(){
                var array=this.split(/，|。| |,|\.|、|\+|\-|—|_|=|:|：|;|；|《|》|‘|’|'|"|【|】|\[|\]|\|| |\*|\/|\(|\)|（|）|！|!|…|·|为|了|的|每|一個|一个|一種|一种|和|是否|不是|于是|是|以及|和|并且|並且|或者|或许|或|对|时|我|你|他|们|这|该|谁|怎么|什么|根据|进行|那里|哪里|所有|全部|此|如此|为|比|上|面|利用|©|\r|\n|\\s|\d/);
                //var array=this.split(/;|:|,|，|.|。|!|！|？|\?|、|\/|‘|’|"| |\r|\n/);
                //var array=this.split(/;|:|,|，|.|。|、|\/|‘|’|"| |\r|\n/);
                var map ={};
                for(var i=0;i<array.length;i++){
                    var strWord =array[i];
                    if(!map[strWord]){map[strWord]=1}
                    else{map[strWord]++}}
                console.log(map);
                for(var word in map){console.info(word+"-------"+map[word])}
            }
            Element.prototype.zishu=function(){return this.textContent.length}
            HTMLCollection.prototype.zishu=function(){for(var i = 0,length = this.length;i < length;i++){console.log(this[i].zishu())}}
        }
        if(isKeyword){
            /**
             * 多关键字查询
             * @param  {[type]} content [description]
             * @param  {[type]} keyword [description]
             * @return {[type]}         [description]
             */
            let oTable = document.getElementById('table1');
            let oName = document.getElementById('name')
            let oBtn = document.getElementById('btn')
            oBtn.onclick = function () {
                for (var i = 0; i < oTable.tBodies[0].rows.length; i++) { //循环每一行
                    var oTd = oTable.tBodies[0].rows[i].cells[1].innerHTML.toLowerCase()
                    var oInp = oName.value.toLowerCase()
                    var arr = oInp.split(' ') //将字符串分割成数组
                    //oTable.tBodies[0].rows[i].style.background = '' //将所有行的背景颜色清空
                    oTable.tBodies[0].rows[i].style.display = "none" //将所有行设为不显示
                    for (var j = 0; j < arr.length; j++) { //将数组里的每一个元素和比较列去对比
                        if (oTd.search(arr[j]) != -1) { //字符串中的search()，如果包含返回字符的位置、不包含返回 -1
                            //oTable.tBodies[0].rows[i].style.background = 'red'
                            oTable.tBodies[0].rows[i].style.display = "" //显示符合条件的行（筛选效果）
                        }
                    }
                }
            }

            function mutilMarkSearchWord(keywords,dom){
                var content = document.html();
                if (keywords.length == 0) {
                    return false;
                }
                for (var i = 0; i < keywords.length; i++) {
                    var regExp = new RegExp(keywords[i], 'g');
                    console.log(regExp);
                    content = content.replace(regExp, '<mark class="marked_'+i+'">' + keywords[i] + '</mark>');
                }
                ///console.log(content);
                document.html(content);
                //默认将页面定位到第一个匹配的关键字处
                var X = document.querySelector('.marked_0').offset().top;
                var Y = document.querySelector('.marked_0').offset().left;
                //console.log('x:',X,',y:',Y);
                window.scrollTo(X, Y);
            }
            var keywords = ['浏览器','段落'];
            mutilMarkSearchWord(keywords,'#content')
        }
        if(isAjax){
            let oBtn = document.getElementById('btn')
            oBtn.onclick = function(){
                ajax('aaa.txt?t=' + Date.now(), function(data){
                    alert(data)
                })
            }
        }
    }
    //window.setTimeout(window.close(), 5000)
})();

/*
        var TargetNode = document.getElementById("imgPicture");
        var changeEvent = ()=>{if (TargetNode && TargetNode.src.includes('?')){ document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}};
        changeEvent;
        new MutationObserver(changeEvent).observe(TargetNode, {attributes: true,childList: false,subtree: false});
    */
/*
            var TargetNode = document.getElementById("imgPicture");
        var changeEvent = ()=>{if (TargetNode && TargetNode.src.includes('?')){document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}};
        setInterval(changeEvent,500)
    */
/*
            //var TargetNode = document.getElementById("imgPicture");
        //var changeEvent = ()=>{if (TargetNode && TargetNode.src.includes('?')){document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}};
        setInterval((TargetNode = document.getElementById("imgPicture"))=>{if (TargetNode && TargetNode.src.includes('?')){document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}},500)}
    */


/*
    if(getHostname == "baike.baidu.com" && getPathname.includes("pic")){
        var TargetNode = document.getElementById("imgPicture");
        var changeEvent = ()=>{if (TargetNode && TargetNode.src.includes('?')){ document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}};

        var TargetNode = document.getElementById("imgPicture");
        var changeEvent = ()=>{if (TargetNode && TargetNode.src.includes('?')){ document.querySelector('a.tool-button.origin').href = TargetNode.src = TargetNode.src.split("?")[0]}};
        changeEvent;
        new MutationObserver(changeEvent).observe(TargetNode, {attributes: true,childList: false,subtree: false});

        setInterval(changeEvent,500)}
*/




/*
    //isRedirect_ZH &&
        if(window.location.pathname.includes("/en-US/")) location.replace(getHref.replace("/en-US/","/zh-CN/"));//developer.mozilla.org
        else if(window.location.hostname.includes("en.")) location.replace(getHref.replace("en.","zh."));//.toLowerCase()
        else {console.log("中文重定向 none")}
*/

//@todo BesideChildren 构建多个除外对象
//Element.prototype.remove = function() {var parent = this.parentNode;parent.removeChild(this)};
//remvoe自身,BesideChildren remove同级其他.都只唯一
//Element.prototype.width = function (width){if(this){this.style.width = width + "px"}}

/*
更改字体颜色
var node=document.createElement("A");
var textnode=document.createTextNode("Water");
node.setAttribute("href","www.把床上.,")
node.appendChild(textnode);
document.querySelector("#content > p:nth-child(3)").appendChild(node);
    //document.title=123;
    //document.body.innerHTML='abc';
    //ByTagName动态方法特性
    var aBtn=document.getElementsByTagName('input');
    var oBtn=document.getElementById('btn');
    document.body.innerHTML='<input type="button" value="点击我"><input id="btn" type="button" value="点击我"><input type="button" value="点击我">';
    //alert(aBtn.length);
    aBtn[0].onclick=function(){alert(1);};
    aBtn[1].onclick=function(){alert(2);};
    aBtn[2].onclick=function(){alert(3);};
*/

/*
// 监听 DOM 是否可用的函数
function domReady(f) {
    // 假如DOM已经加载，马山执行函数
    if(domReady.done) return f();

    // 假如我们已经增加了一个函数
    if(domReady.timer) {
        // 把它假如待执行函数清单中
        domReady.ready.push(f);
    } else {
        // 为页面加载完毕绑定一个事件，以防它最先完成。
        addEvent(window, "load", isDOMReady);
        // 初始化执行函数的数组
        domReady.ready = [f];
        // 尽可能快的检查DOM是否已可用
        domReady.timer = setInterval(isDOMReady, 13);
    }
}

// 检查 DOM 是否已可操作
function isDOMReady() {
    // 如果我们能判断出DOM已可能，忽略
    if(domReady.done) return false;

    // 检查若干函数和元素是否可能
    if(document && document.getElementsByTagName && document.getElementById && document.body) {
        // 如果可用，我们停止检查
        clearInterval(domReady.timer);
        domReady.timer = null;

        // 执行所有正在等待的函数
        for(var i = 0; i < domReady.ready.length; i++) {
            domReady.ready[i]();
            // 记录我们在此已经完成
            domReady.ready = null;
            domReady.done = true;
        }
    }
}
*/

//下级所有可以除外,引用父位太sb,否掉
//Element.prototype.removeChildren = function(excludeClassName){for (var i = this.childNodes.length - 1; i > -1 ;i--){if(this.childNodes[i].className == excludeClassName){continue};this.removeChild(this.childNodes[i])}}
//HTMLCollection.prototype.bodyRemoveClidrenExcludeElements = function (className) { for (var i = this.length - 1; i > -1; i--) { if (document.body.children[i].className == className){continue};document.body.removeChild[i]();}}
//Element.prototype.removeChildren = function(excludeClassName){for (var i = this.childNodes.length - 1; i > -1 ;i--){if(this.childNodes[i].className == excludeClassName){continue};this.removeChild(this.childNodes[i])}}
//function Click(getElement) { if(this.getElement){this.getElement.click}};
//HTMLCollection.prototype.parentNode = function () { for (var i = 0; i > this.length - 1; i++) { return (this[i].parentNode.tagName) } }
//function parentNode(elements) { for (var i = 0; i > elements.length - 1; i++) { (elements[i].parentNode.tagName) } }
//parentNode(document.getElementsByTagName("p"))

/*
    var v = "欢迎访问我的个人网站：http://www.zhangxinxu.com/";
    alert(v.httpHtml());
    document.httpHtml()
    document.querySelector("#postmessage_35950620 > font:nth-child(91)").innerHTML = document.querySelector("#postmessage_35950620 > font:nth-child(91)").innerHTML.httpHtml()
    document.body.innerHTML = document.body.innerHTML.httpHtml()
    */

/*
    Element.prototype.observe = function (changeEvent){
        //替换有水印的图片，替换“原图”中的链接
        //changeEvent = ()=>{if (this.src.includes('?')){ document.querySelector('a.tool-button.origin').href = this.src = this.src.split("?")[0]}}
        //首次进入需要运行一次，后续的为监测自动执行
        changeEvent;
        //启动检测：          修改动作          监测对象与配置
        new MutationObserver(changeEvent).observe(this, {attributes: true,childList: false,subtree: false});
    }
    */
//遍历
//function zhengxubianLi(){for (var i=0,length = this.length; i<length;i++){}}
//function daoxubianLi(){for (var i = this.length - 1; i > -1 ;i--){}}
//how to run cmd then run software
/*
    function runcmd(value) {
        let WSH=new ActiveXObject("WScript.Shell");
        WSH.run(value);
        console.log('222'+ value)
        cmd = null;
    }
    function run() {
        var command = "mstsc C:/a.rdp /v:101.91.194.13 /admin /f" //这里是执行的DOS命令
        runcmd(command);
    }
    run()
    */
//onclick = function() {console.log(this)
//常量
//划词功能
//var selecter = window.getSelection().toString();
//is=true//
//host
//重定向
//document.querySelector("body > div.body-wrapper > div.content-wrapper > div > div.main-content.main-content-margin").removeTree()
//document.querySelector("body > div.body-wrapper > div.content-wrapper > div > div.main-content").width(1050)
//document.querySelector("body > div.body-wrapper > div.content-wrapper > div > div.main-content.main-content-margin").width(1050)
//if(document.querySelector("body > div.body-wrapper > div.content-wrapper > div > div.main-content")){document.querySelector("body > div.body-wrapper > div.content-wrapper > div > div.main-content").style.width = "1050px"}


/*
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom").removeBesideChildren();
            document.querySelector("#tashuo_bottom").remove()
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.polysemant-list").remove();
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.secondsknow-large-container.J-secondsknow-large-container").remove();
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.tabCards").remove();
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.after-content").remove();
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.content-wrapper > div > div.main-content > div.main_tab.main_tab-defaultTab.curTab > iframe").remove();
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.content-wrapper > div > div.side-content").remove();
            document.querySelector("body > div.body-wrapper.feature.feature_small.custom > div.content-wrapper > div > div").style.width = "1000px";
    */

//document.querySelector("#article-container > div.left.main > div:nth-child(1)").removeTree()
/*
            document.querySelector("#root > div.article-content.container > div.row > div.col-12.col-xl.w-0.col > div.border-0.mb-4.card").removeBesideChildren();
            document.querySelector("#root > div.article-content.container > div.row > div.col-12.col-xl.w-0.col").removeBesideChildren();
            setInterval(function () { //每5秒刷新一次图表
                //需要执行的代码写在这里
                //document.querySelector("#root > div.article-content.container > div.row > div.col-12.col-xl.w-0.col > div.border-0.mb-4.card").removeBesideChildren();
            }, 1000);
*/
/*
            //目标
        var imgPicture = document.querySelector('#imgPicture');
        //替换有水印的图片，替换“原图”中的链接
        var changeImg = ()=>{if (imgPicture.src.includes('?')){ document.querySelector('a.tool-button.origin').href = imgPicture.src = imgPicture.src.split("?")[0]}}
        //首次进入需要运行一次，后续的为监测自动执行
        changeImg;
        //启动检测：          修改动作          监测对象与配置
        new MutationObserver(changeImg).observe(imgPicture, {attributes: true,childList: false,subtree: false});
    */

/*
        var pTags = document.getElementsByTagName('p');
        for (var i=0;length = i<pTags.length;i++){aTags[i].target = '_blank'}
    */

/*
            if (imgPicture.src.includes('?')){
                //var imgId = window.location.href.split('pic=')[1];
                //imgPicture.src = 'https://bkimg.cdn.bcebos.com/pic/' + imgId;
                //imgPicture.url=imgPicture.src;
                document.querySelector('a.tool-button.origin').href = imgPicture.src = imgPicture.src.split("?")[0];
            }
            //if(this && this.src && this.src.includes("?")) {this.src = this.src.split("?")[0]}
            //if (imgPicture.src.includes('?')){imgPicture.url = imgPicture.src = }
            */


/*
            Element.prototype.observer = function(func){
            var observer = new MutationObserver(function (mutations, observer) {
                mutations.forEach(function (mutation) {console.log(mutation)});
                if(func){func};
            })
        };
        let func = (function(){if(this && this.src && this.src.includes("?")) {this.src = this.src.split("?")[0]}})(document.getElementById('imgPicture'));
        document.getElementById('imgPicture').observer(this,{ attributes: true, childList: false, subtree: false });
        //observer.observe(this,{ attributes: true, childList: false, subtree: false });
    }
    */


/*
    else if(getHost == "www.v2ex.commm" ){
        $(document).ready(function() {
            //搜索改为百度
            $("#Search form").submit(function() {
                var q = $("#q");
                if (q.val() !== "") {
                    var url = "https://www.baidu.com/s?wd=site:v2ex.com%20" + q.val();
                    if (navigator.userAgent.indexOf('iPad') > -1 || navigator.userAgent.indexOf('iPod') > -1 || navigator.userAgent.indexOf('iPhone') > -1) {
                        location.href = url;
                    } else {
                        window.open(url, "_blank");
                    }
                    return false;
                } else {
                    return false;
                }
            });
            var nowurl = location.pathname;
            //超链接改为新标签打开
            if (nowurl == "/" || nowurl.substr(0, 6) == "/?tab=" || nowurl.substr(0, 4) == "/go/" || nowurl == "/recent") {
                $("span.item_title a").attr("target", "_blank");
            }
            //楼主标记
            if (nowurl.substr(0, 3) == "/t/") {
                $("a[rel=nofollow]").attr("target", "_blank");
                $(".inner a").attr("target", "_blank");
                $(".inner:first a").removeAttr("target");
                var lzname = $(".header .gray a").text();
                var replynum = $("div.cell[id^=r_] strong a").length;
                for (var aa = 0; aa < replynum; aa++) {
                    // console.log($("div.cell[id^=r_]:eq("+aa+") strong a").text());
                    if ($("div.cell[id^=r_]:eq(" + aa + ") strong a").text() == lzname) {
                        $("div.cell[id^=r_]:eq(" + aa + ") strong").html($("div.cell[id^=r_]:eq(" + aa + ") strong").html() + "&nbsp;[楼主]");
                    }
                }
            }
            $("#Rightbar .box .sidebar_compliance").parent().hide(); //屏蔽右侧广告
            $("#Search form").removeAttr("onsubmit"); //原搜索删除
        })
    }
    */
//自动标记 AC
//if(isHilghLight){}

/*
            const imgPicture = document.querySelector('#imgPicture');
        //替换有水印的图片，替换“原图”中的链接
        const changeImg = ()=>{
            if (imgPicture.src.indexOf('\?') !== -1)
            {
                var imgId=window.location.href.split('pic=')[1];
                imgPicture.src='https://bkimg.cdn.bcebos.com/pic/' + imgId;
                imgPicture.url=imgPicture.src;
                document.querySelector('a.tool-button.origin').href = imgPicture.src;
            }
        };
        //首次进入需要运行一次，后续的为监测自动执行
        changeImg();
        //启动检测：          修改动作          监测对象与配置
        new MutationObserver(changeImg).observe(imgPicture, {
            attributes: true,
            childList: false,
            subtree: false
        });
        */

/*
        if(getHost == "translate.google.com") {location.replace(getHref.asciiConverter().replace("?tl=en#auto/en/", "?text="))}
    if(isRedirect_Universal){
        if (isSearchEmpty) {
            if(getHost == "translate.google.com") {location.replace(getHref.asciiConverter().replace("?tl=en#auto/en/", "?text="))}
            else if (getHost == "pan.baidu.com" && document.title == "百度网盘-链接不存在") {alert(document.title);window.close()}
            else if (getHost == "www.agefans.net" && getPath.includes("detail")){location.replace(getHref.replace("detail","play") + "?playid=3_1")}
            else{console.log("不需要跳转")}
        }
        else if (!isSearchEmpty) {
            if (getHost == "mail.qq.com") {
                location.replace(getHref.splits("gourl=","&").asciiConverter())}
            else if (getHost == "link.zhihu.com" || "link.csdn.net") {
                location.replace(getHref.splits("?target=").asciiConverter())}
            else { console.log("无法跳转") }
        }
        else {console.log("警告,特殊情况查看")}
    };
*/


/*
    //当页面加载状态改变的时候执行这个方法.
    document.onreadystatechange = subSomething;
    //当页面加载状态
    //myform.submit()
    //表单提交
    function subSomething() {
        if(document.readyState == "complete"){
            addTaget_blank();
            if(isDefaultRegister_AutoClick){autoClick()};
        }
    }
    subSomething()
    */
/*
    function urlDecodeReplace(replaceStrHead, replaceStrFoot) {
        var url = getHref
        //console.log(replaceStrHead.constructor)
        //replaceStrHead = replaceStrHead || "";
        //replaceStrFoot = replaceStrFoot || "";
        //url = (url.split(replaceStrHead))[1];
        //url = (url.split(replaceStrFoot))[0];

        if (replaceStrHead !== undefined||null) { url = (url.split(replaceStrHead))[1]};
        if (replaceStrFoot !== undefined||null) { url = (url.split(replaceStrFoot))[0]};

        //if (!isNull(replaceStrHead)) { url = (url.split(replaceStrHead))[1]};
        //if (!isNull(replaceStrFoot)) { url = (url.split(replaceStrFoot))[0]};
        //if (!replaceStrHead.isNull()) { url = (url.split(replaceStrHead))[1]};
        //if (!replaceStrFoot.isNull()) { url = (url.split(replaceStrFoot))[0]};
        //window.location.href = "about:blank";
        location.replace(url.asciiConverter());
    }
*/

/*
    ///狗哥图标重要不能删除,否则会跨域
    //if (location.href.includes("https://translate.google.com/?tl=en")) {window.location.replace(location.href.replace("?tl=en#auto/en/", "?text="));}
*/

//String.prototype.isNull = function () {return (this.toString().length <= 0)};
//Object.prototype.isNull = function () { return (!this ||this === undefined || null)};
//function isNull(){return this === undefined||null}
//多行缓慢解法
/*
    var getUrl = window.location.href;
    //var res = str.split("https://translate.google.com/?tl=en#auto/en/");
    //if (window.location.host = "link.zhihu.com"){
    //window.location.href = str.replace("https://link.zhihu.com/?target=http%3A","http:");
    //}
    //@note: 开坑; csdn跳转
    //https://opensource.com/article/19/3/favorite-terminal-emulators
    //https://link.csdn.net/?target=https%3A%2F%2Fopensource.com%2Farticle%2F19%2F3%2Ffavorite-terminal-emulators
    //https://mail.qq.com/cgi-bin/readtemplate?t=safety&check=false&gourl=https%3A%2F%2Fdiscourse.xianqubot.com%2Ft%2Ftopic%2F988&subtemplate=gray&evil=0
    //https://translate.google.com/?tl=en#auto/en/else%20if
    //https://pan.baidu.com/s/172TevKdaUq8kCWuXLqBOpQ
    */

/*
    String.prototype.urlDecodeReplace = function(replaceStr1,splitArrNum1,replaceStr2,splitArrNum2){
        //var res = getUrl.split("?target=");
        var str = this
        str = (str.split(replaceStr1))[splitArrNum1];
        str = (str.split(replaceStr2))[splitArrNum2];
        str = str.replace("%3A",":");
        str = str.replace("%23","#");
        str = str.replaceAll("%2F","/");
        return str;
    };
    */

/*
        if (getHost == "pan.baidu.com" && document.title == "百度网盘-链接不存在") {
        //document.getElementsByTagName("title")[0].innerText;
        alert("百度网盘-链接不存在");
        //window.location.href = "about:blank";
        window.close();
       }
    */


//getHost = (getHost.replace("%3A",":")).replaceAll("%2F","/")
//location.replace = "about:blank";
//location.replace(((getHref.split("gourl=")[1].split("&")[0].replace("%3A",":")).replaceAll("%2F","/")).replace("%23","#"))
//location.replace = "about:blank";
//location.replace(((location.href.split("?target=")[1].replace("%3A",":")).replaceAll("%2F","/")).replace("%23","#"))
/*
            else if (getHost == "translate.google.com" && getHref.includes("https://translate.google.com/?tl=en")) {
            //console.log("translate.google.com");

            if(location.href.includes("https://translate.google.com/?tl=en")){
               //https://translate.google.com/?tl=en#auto/en/else%20if
               getHref = location.href;
               location.replace(getHref.replace("?tl=en#auto/en/","?text="))
            }

            //window.location.replace(getHref.replace("?tl=en#auto/en/","?text="));
            //window.location.replace = "about:blank";
            //window.location.replace(getHref.replace("?tl=en#auto/en/","?text="));

    */


//采用字典法
/*
    var replacements = {
        "my" : "his",
        "is" : "was",
        "can": "could"
    };
    replacements.my
    replacements = [
    {"my" : "his"},
    {"is" : "was"},
    {"can": "could"}
    ];
    replacements[0]//{my: "his"};
    var regex = new RegExp(properties(replacements).map(RegExp.escape).join("|"), "g");
    str = str.replace(regex, function($0) { return replacements[$0]; });

    window.location.href = str
    */
