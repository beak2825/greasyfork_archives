// ==UserScript==
// @name         （终结者）文章阅读助手
// @namespace    http://tampermonkey.net/
// @author AloneChenwen
// @description Automatically generate article outline directory, highlight code, link to text, automatically expand more, and other functions
// @description:zh-CN 自动生成文章大纲目录、代码高亮、链接转文字、自动展开更多等等功能，破除所有多余元素，还原阅读本质
// @version 1.0.6
// @match *://*/*.html
// @match *://*/*
// @match file:///*/*
// @exclude https://www.bilibili.com/video/*
// @exclude https://www.runoob.com/try*
// @exclude https://*/search?*
// @exclude https://*/*query=*
// @exclude https://*/*q=*
// @exclude https://www.baidu.com/*s*?*=*
// @exclude https://*wistron.com*
// @license MIT
// @run-at document-idle
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @noframes
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require https://apps.bdimg.com/libs/highlight.js/9.1.0/highlight.min.js
// @resource css https://apps.bdimg.com/libs/highlight.js/9.1.0/styles/rainbow.min.css
// @require https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify-css.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify-html.min.js

// @downloadURL https://update.greasyfork.org/scripts/473208/%EF%BC%88%E7%BB%88%E7%BB%93%E8%80%85%EF%BC%89%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473208/%EF%BC%88%E7%BB%88%E7%BB%93%E8%80%85%EF%BC%89%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {

    // 是否包含代码块
    function hasCode(params) {
        let codeNum = params.querySelectorAll("[iscode]").length;
        console.log(params.tagName.toLowerCase() + "的代码块数：" + codeNum);
        return codeNum;
    }

    // 标记是否有标题
    let hasOption;
    // 文章标题
    let wenzhangheads = [];
    // 标记是否有文章模块
    let hasAtr;
    // 标记是否有标题
    let hasTitle;
    // body是否有代码块
    let bodycodenum;
    //初选文章容器
    let main;
    let zhutiArry = [];
    let zhutiArry2 = [];
    //终选文章最小容器
    let wenzhangzhuti;

    // nodelist转数组
    function makeAarry(nodelist) {
        let arr = [];
        for (let i = 0, len = nodelist.length; i < len; i++) {
            arr.push(nodelist[i]);
        }

        return arr;
    }

    //定义数组remove方法
    Array.prototype.indexOf = function (val) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };


    function findTextCom(list) {

        let FirList = [];
        let layerL = [];//元素层数
        for (const iterator of list) {
            if (iterator.offsetWidth > window.screen.availWidth / 3
                && iterator.innerText.trim().length > 0
                && /[`_–‘’“”\-~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g.test(iterator.innerText)) {
                FirList.push(iterator)
                // console.log("span: " + iterator.innerText);
                layerL.push($(iterator).parents().length)
            }
        }

        // 以p层数众数为准
        let pubLayer = majorityElement(layerL)

        let resultL = []
        for (const iterator of FirList) {
            if ($(iterator).parents().length == pubLayer) {
                resultL.push(iterator)
            }
        }

        // if (resultL.length && countTagTextL(resultL, false) < 100 && resultL[0].getBoundingClientRect().top + document.documentElement.scrollTop > window.screen.availHeight - 100) {
        //     resultL = []
        // }
        return resultL;

    }

    // 查找纯P的标签数量
    function findP(element) {

        let Ps = element.querySelectorAll(
            "p:not(:is(button,[about],[about]~*,a,[notcode],[hascode],span,header,[id*='header' i],[class*='header' i],footer,[id*='footer' i],[class*='footer' i],[comment],[id*='recommend' i],[class*='recommend' i],[id*='recommend' i]~*,[class*='recommend' i]~*) p,p[class],p[id],:has(p[class],p[id])),:is(article,[id*='article' i],[class*='article' i]) p:not(p[class],p[id])"
        );
        // for (const iterator of Ps) {
        //     console.log("P: " + iterator.innerText);
        // }
        // console.log(element.tagName + "(" + element.className + ")的P数量:" + Ps.length);

        return findTextCom(Ps)

    }

    // 查找纯span的标签数量
    function findSpan(element) {
        let Spans = element.querySelectorAll("span:not(:is(button,[about],[about]~*,a,[notcode],[hascode],span,header,[id*='header' i],[class*='header' i],footer,[id*='footer' i],[class*='footer' i],[comment],[id*='recommend' i],[class*='recommend' i],[id*='recommend' i]~*,[class*='recommend' i]~) span,span[class],span[id],:has(span[class],span[id]))")

        return findTextCom(Spans)
    }

    // 位置符合，有内容
    function positionAndHasText(params) {
        let result = false;
        // 大小限制
        // if (params.offsetHeight > 500) {
        // 符合在屏幕中轴区域
        const left =
            params.getBoundingClientRect().left +
            document.documentElement.scrollLeft;
        const right =
            window.screen.availWidth - params.offsetWidth - left;
        if (
            window.screen.availWidth - left > window.screen.availWidth / 2 &&
            window.screen.availWidth - right > window.screen.availWidth / 2
        ) {
            // 纵坐标在屏幕中，文字数量大于零
            if (params.getBoundingClientRect().top + document.documentElement.scrollTop < window.screen.availHeight - 100
                && params.innerText.length > 0) {
                result = true;
            }
        }
        return result;
    }

    // main、wenzhangdiv公共验证步骤
    function ComVerify(param) {
        let Verify = false;
        if (positionAndHasText(param)) {
            Verify = true;
            // 如果有代码块，那么iterator也要有
            let Icode = param.querySelectorAll("[iscode]");
            console.log("item代码块数：" + Icode.length);
            if (bodycodenum && !Icode.length) {
                Verify = false;
            }
        }

        return Verify;
    }

    // 替换节点(转P元素)
    function changeP(ele) {
        for (const iterator of ele.childNodes) {
            if (iterator.nodeType == 3 && iterator.nodeValue.length > 0) {
                let newnode = document.createElement("p")
                newnode.innerText = iterator.nodeValue
                ele.replaceChild(newnode, iterator)
            }
        }
    }


    // 主体选择器 section
    let zhutis;
    let num = 0; //记录getWen函数的执行次数
    let preWenHtml;
    let preWenText;
    let wenzhangcodenum;
    function getWen() {
        num++;
        // 功能：寻找wenzhangzhuti
        // 初选
        // 是否有article文章模块
        let atr = document.querySelectorAll("article");
        // body是否有代码块
        bodycodenum = hasCode(document.body);

        // body是否含有P
        let bodyP = findP(document.body);
        let bodyPL = bodyP.length
        console.log("body的P数量" + bodyPL);
        // let bodyPTextL = countTagTextL(bodyP, true);

        // body是否含有Span
        let bodySpan = findSpan(document.body);
        let bodySpanL = bodySpan.length;
        console.log("body的span数量" + bodySpanL);
        // let bodySpanTextL = countTagTextL(bodySpan, true);

        // 寻找评论区
        let findComment = function (element) {
            let comment = element.querySelectorAll("[id*='comment' i],[class*='comment' i]");
            for (const iterator of comment) {
                let avatar = iterator.querySelector("img:not(iscode img)")
                if ((avatar && avatar.clientHeight < 45) || (iterator.getAttribute("id") && iterator.getAttribute("id").includes("comment"))) {
                    iterator.setAttribute("comment", "")
                    break;
                }
            }
        }

        findComment(document.body)

        // 去除图片等元素干扰坐标位置
        let imgsty = document.createElement("style");
        // for (const iterator of document.querySelectorAll("[style*='background-image']:empty,img:empty")) {
        //     if (iterator.getBoundingClientRect().top + document.documentElement.scrollTop < window.screen.availHeight - 100 && (iterator.clientHeight > 100 || iterator.clientWidth > 100)) {
        //         iterator.setAttribute("headImg", "headImg");
        //     }
        // }

        for (let iterator of document.querySelectorAll("*")) {
            let style = window.getComputedStyle(iterator, null); //获取最终样式
            let backgroundImage = style.getPropertyValue('background-image');
            if (
                (iterator.tagName === "IMG" || backgroundImage && backgroundImage !== 'none')
                &&
                iterator.getBoundingClientRect().top + document.documentElement.scrollTop < window.screen.availHeight - 100
                &&
                (iterator.clientHeight > 200 || iterator.clientWidth > 200)

            ) {
                iterator.setAttribute("headImg", "headImg");
                break
            }
        }
        document.body.prepend(imgsty);
        imgsty.innerText = /*css*/`
            * {
                padding-top: 0!important;
                margin-top: 0!important;
                padding-bottom: 0!important;
                margin-bottom: 0!important;
                /* float: left!important; */
                /*width: fit-content!important; */
            }
            :is([maindiv] [comment],[about],[headImg],:has([headImg]):not(:has(:nth-child(n+2))),video,:has(video):not(:has(:nth-child(n+2)))):not(body,html,[iscode],[iscode] *),:empty:not(img),header,nav,[class*='search' i],[id*='search' i],:is([class*='nav' i],[id*='nav' i]):has(a){
                /* display:none!important; */
                height: 0!important;
                /* width: 0!important; */
            }
            [comment],[comment]~ *,[about],[about]~ *{
                display:none!important;
            }
            /* [maindiv] :is([style*='padding'],[style*='margin'],[style*='height']):has(img,[style*='background-image']):not([iscode],[iscode] *){
                padding-top: 0!important;
                margin-top: 0!important;
                padding-bottom: 0!important;
                margin-bottom: 0!important;
                height: 0!important;
            } */
            /* 展开隐藏内容 */
            [style*='height'][style*='overflow']:not([style*='height: 0'],[style*='height:0']){
                height: auto!important;
                overflow: visible!important;
            }
        `;

        zhutis = document.body.querySelectorAll(
            ":is(dd,.GM2GFRGCNNB,article,[id*='article' i],[class*='article' i],[id*='body' i],[class*='body' i],main,[role=main],[id*='main' i],[class*='main' i],[id*='content' i],[class*='content' i],[class*='post' i],[id*='post' i],[class*='left' i],[id*='left' i],[class*='right' i],[id*='right' i]):not([class*='code' i],[id*='code' i],[comment],[comment] *,:has(> [comment]:only-child))"
        )
        if (atr.length > 0) {
            if (positionAndHasText(atr[0]) &&
                (location.href.indexOf("article") != -1 ||
                    atr[0].querySelectorAll("p").length > 0 ||
                    hasCode(atr[0]))
            ) {
                // if (!((bodyPL && bodyPL != findP(atr[0]).length) || (bodySpanL && bodySpanL != findSpan(atr[0]).length))) {
                hasAtr = true;
                main = atr[0];
                console.log("本文章有符合要求的article模块");
                // }
            }
        }

        if (!hasAtr) {
            // let top = document.querySelector("body").getBoundingClientRect().top;
            console.log("\n筛选maindiv");
            const totalHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
            for (const i of zhutis) {
                if (ComVerify(i) && i.scrollHeight > totalHeight / 5) {
                    let ItemP = findP(i)
                    let ItemSpan = findSpan(i)
                    let ItemPL = ItemP.length
                    let ItemSpanL = ItemSpan.length
                    // 文字文本符合要求
                    if ((bodyPL && bodyPL == ItemPL) || (bodySpanL && bodySpanL == ItemSpanL)) {
                        zhutiArry.push(i);
                    }
                    // }
                    // 备用方案
                    if (i.innerText.length > 100) {
                        zhutiArry2.push(i);
                    }
                }
            }

            main = zhutiArry.length ? zhutiArry[zhutiArry.length - 1] : zhutiArry2[0]

            if (!main) {
                // 重定义备用方案
                zhutiArry2 = []
                zhutis = document.body.querySelectorAll("div[class],div[id]")
                for (const iterator of zhutis) {
                    if (ComVerify(iterator)) {
                        if (iterator.innerText.length > 100) {
                            zhutiArry2.push(iterator);
                        }
                    }
                }
                main = zhutiArry2.length ? zhutiArry2[0] : null;
            }



            if (!main) {
                // 重定义备用方案
                zhutiArry2 = []
                zhutis = document.body.querySelectorAll("div")
                for (const iterator of zhutis) {
                    if (ComVerify(iterator)) {
                        if (iterator.innerText.length > 100) {
                            zhutiArry2.push(iterator);
                        }
                    }
                }
                main = zhutiArry2.length ? zhutiArry2[0] : null;
            }



            if (!main) {
                // 第一个div元素
                main = document.querySelector("div")
            }

        }

        // 特例特解
        // if (
        //     window.location.host == "app.yinxiang.com"
        // ) {
        //     let iframe = document.querySelector("[id*='entinymce_'][id$='_ifr']")
        //     // 检查 iframe 是否已加载完成
        //     if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        //         // 获取 iframe 内部的文档对象
        //         let iframeDoc = iframe.contentDocument;
        //         main = iframeDoc.querySelector("#tinymce");
        //     }
        // }

        if (window.location.host == "wenku.baidu.com") {
            main = document.querySelector(".creader-root")
        }

        // 最后的倔强
        if (!main) {
            main = document.body.firstElementChild;
        }


        main.setAttribute("mainDiv", "mainDiv");

        //识别 关于、分享，猜你，兴趣，文章，相关，更多，推荐
        let pattT = /(关于|分享|猜你|兴趣|文章|相关|更多|推荐)/;

        let findAbout = function (element) {
            // ul,ol...
            let abouts = element.querySelectorAll(":has(a[href*='/']:not([conversion]))");
            if (abouts.length) {
                // 循环遍历
                for (const iterator of abouts) {
                    let lis = iterator.querySelectorAll("li");
                    if (lis.length == iterator.children.length) {
                        iterator.setAttribute("noth", "noth");
                    }

                    let lia = iterator.querySelectorAll(
                        "a[href*='/']:not([conversion])"
                    );
                    if (lia.length && lia.length < 2) {
                        continue;
                    }
                    // if (lia.length >= iterator.children.length) {
                    // 正则 /^(\d{1,2}(\.|\、|）|\))){1}(.){2,30}/;
                    let BDistance = element.getBoundingClientRect().bottom - iterator.getBoundingClientRect().bottom
                    let TDistance = iterator.getBoundingClientRect().top - element.getBoundingClientRect().top
                    if (TDistance > 200 &&
                        (
                            (BDistance < element.clientHeight / 8 && BDistance < 200)
                            ||
                            (iterator.innerText.trim().length > 40 && element.innerText.trim().endsWith(iterator.innerText.trim())
                            )
                        )
                    ) {
                        if (pattT.test(iterator.firstElementChild.innerText) && (iterator.firstElementChild.offsetHeight < 70 || !iterator.firstElementChild.innerText.includes("\n"))) {
                            iterator.setAttribute("about", "about");
                            break;
                        }

                        let preBrother = iterator.previousElementSibling;
                        if (preBrother &&
                            preBrother.innerText &&
                            (preBrother.offsetHeight < 70 || !preBrother.innerText.includes("\n")) &&
                            pattT.test(preBrother.innerText) &&
                            lia.length >= iterator.children.length &&
                            iterator.tagName != "div"
                        ) {
                            let father = iterator.parentElement;
                            if (father && father.offsetHeight < iterator.offsetHeight + 100) {
                                father.setAttribute("about", "father");
                            }
                            preBrother.setAttribute("about", "brother");
                            iterator.setAttribute("about", "about");
                            break;
                        }
                    }
                    // }
                }
            }
        }

        findAbout(main);

        for (const iterator of main.querySelectorAll("[class*='recommend' i],[id*='recommend' i]")) {
            if (pattT.test(iterator.innerText) && iterator.querySelectorAll(
                "a[href]".length > 0
            )) {
                iterator.setAttribute("about", "about");
            }
        }


        // 标记是否包含P
        let mainP = findP(main)
        let mainPTextL = countTagTextL(mainP, false)
        let mainPL = mainP.length

        console.log("main的P数量" + mainPL);

        // 标记是否包含span
        let mainSpan = findSpan(main)
        let mainSpanTextL = countTagTextL(mainSpan, false)
        let mainSpanL = mainSpan.length
        console.log("main的span数量" + mainSpanL);

        // 终选
        let wenzhangzhutiS = [];
        let wenzhangzhutiS2 = [];
        // let wenzhangzhutiS3 = [];
        // let LongTextMainChilds = [];
        let mainChilds = main.querySelectorAll(
            ":is(div,section):not([iscode],[iscode] *,:has(> .codelang),[comment],[comment] *,:has(> [comment]:only-child))"
        );

        if (hasAtr) {
            let ArtmainChilds = mainPL || mainSpanL
                ? mainChilds : main.querySelectorAll(
                    ":is([id*='body' i],[class*='body' i],main,[role=main],[id*='main' i],[class*='main' i],[id*='content' i],[class*='content' i],[class*='post' i],[id*='post' i],[class*='left' i],[id*='left' i],[class*='right' i],[id*='right' i]):not([class*='code' i],[id*='code' i],[comment],[comment] *,:has(> [comment]:only-child))"
                );
            mainChilds = ArtmainChilds.length ? ArtmainChilds : mainChilds
        }

        console.log("\n筛选wenzhangdiv");
        // let mainTop = main.getBoundingClientRect().top
        for (const iterator of mainChilds) {
            if (ComVerify(iterator) && ((iterator.innerText && iterator.innerText.length > main.innerText.length / 5) || (iterator.scrollHeight > main.scrollHeight / 5))) {
                let ItemP = findP(iterator)
                let ItemSpan = findSpan(iterator)
                let ItemPL = ItemP.length
                let ItemSpanL = ItemSpan.length
                let ItemPTextL = countTagTextL(ItemP, false)
                let ItemSpanTextL = countTagTextL(ItemSpan, false)
                // 存在p标签或span标签
                if (
                    (mainPL && mainPL == ItemPL) ||
                    (!mainPL && mainSpanL && mainSpanL == ItemSpanL) ||
                    (mainPL > 4 && ItemPL > 4 && ItemPL > mainPL - 4) ||
                    (!mainPL && mainSpanL > 4 && ItemSpanL > 4 && ItemSpanL > mainSpanL - 4)) {
                    // hasAtr高度限制，防止少多代表多数
                    // if (hasAtr && main.scrollHeight / 2 > iterator.scrollHeight) {

                    // hasAtr字数限制，防止少多代表多数
                    if (hasAtr &&
                        (
                            (mainPTextL > 200 && ItemPTextL < 200)
                            ||
                            (mainSpanTextL > 200 && ItemSpanTextL < 200)
                        )
                    ) {
                        // if (iterator.innerText.length > 100) {
                        //     wenzhangzhutiS2.push(iterator);
                        // }
                        continue;
                    }
                    wenzhangzhutiS.push(iterator);
                } else {
                    //备用方案，p或span数量不符合，高度要大于初选main的高度的二分之一
                    if (iterator.scrollHeight > main.scrollHeight / 2 || iterator.scrollHeight > 500) {
                        wenzhangzhutiS2.push(iterator);
                    }
                    // else {
                    //     if (iterator.innerText.length > 100) {
                    //         wenzhangzhutiS3.push(iterator);
                    //     }
                    // }


                    // 统计在main中轴的，含有一定文字长度的div
                    // if (iterator.innerText.length > 100 && iterator.offsetWidth > main.offsetWidth * 2 / 3) {
                    //     LongTextMainChilds.push(iterator);
                    // }
                }
            }
        }

        console.log((mainPL ? "P" : "") + (mainSpanL ? "Span" : "") + "符合的数组wenzhangzhutiS: " + wenzhangzhutiS.length);
        console.log("高度符合的数组wenzhangzhutiS2: " + wenzhangzhutiS2.length);

        if (wenzhangzhutiS.length > 0) {
            wenzhangzhuti = wenzhangzhutiS.pop();
            console.log("符合" + (mainPL ? "P" : "") + (mainSpanL ? "Span" : "") + "数量准则, 选定wenzhangzhutiS的第一个元素作为wenzhangzhuti");
        }

        if (!wenzhangzhuti && mainP > 3) {
            console.log("wenzhangzhuti选择maindiv。。。。。。。。。。");
            wenzhangzhuti = main
        }

        // console.log("wenzhangzhutiS3: " + wenzhangzhutiS3.length);
        // console.log("LongTextMainChilds: " + LongTextMainChilds.length);

        if (!wenzhangzhuti) {
            console.log("启用备用二号wenzhangzhutiS2第一个作为wenzhangzhuti。。。。。。。。。。");
            wenzhangzhuti = wenzhangzhutiS2.pop();
        }
        // if (!wenzhangzhuti) {
        //     console.log("备用三号wenzhangzhutiS3。。。。。。。。。。");
        //     wenzhangzhuti = wenzhangzhutiS3.length ? wenzhangzhutiS3[0] : null;
        // }

        // if (!wenzhangzhuti || (LongTextMainChilds.length - wenzhangzhutiS2.length > 2)) {
        if (!wenzhangzhuti) {
            console.log("wenzhangzhuti选择maindiv。。。。。。。。。。");
            wenzhangzhuti = main;
        }



        // 特例特解
        // if (window.location.host == "www.360doc.com") {
        //     wenzhangzhuti = document.querySelector("#artContent")
        // }
        if (
            window.location.host == "app.yinxiang.com"
        ) {
            let iframe = document.querySelector("[id*='entinymce_'][id$='_ifr']")
            // // 检查 iframe 是否已加载完成
            // if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            //     // 获取 iframe 内部的文档对象
            //     let iframeDoc = iframe.contentDocument;
            //     wenzhangzhuti = iframeDoc.querySelector("#tinymce") || main;
            // }
            if (iframe) {
                wenzhangzhuti = iframe.parentElement || main;
            }
        }


        wenzhangzhuti.setAttribute("myAttr", "wenzhangdiv");
        preWenHtml = wenzhangzhuti.innerHTML;
        preWenText = wenzhangzhuti.innerText;

        // 恢复图片显示
        imgsty.remove();
        for (const iterator of document.querySelectorAll("[headImg]")) {
            iterator.removeAttribute("headImg")
        }


        // 再次排除about
        findAbout(wenzhangzhuti);

        wenzhangcodenum = wenzhangzhuti.querySelectorAll("[iscode]").length
    }

    // 处理换行问题,拆解重组
    function handleBr(items) {
        //接受节点列表
        let remake = false; //标记是否重组了
        // items = makeAarry(items)
        for (let item of items) {
            let html = item.innerHTML;
            if (html.indexOf("<br>") != -1 && item.firstElementChild) {
                remake = true;
                /*      let Newhtml = "";
                     let lines = html.split("<br>");
                     for (let line of lines) {
                         let tag = item.tagName.toLowerCase();
                         line = "<" + tag + ">" + line + "</" + tag + ">";
                         Newhtml = Newhtml + line;
                     }
                     item.outerHTML = Newhtml;
                     */
                let tag = item.tagName.toLowerCase();
                item.outerHTML = item.outerHTML.replace(/<br>/g, "</" + tag + "><" + tag + ">")
            }
        }
        return remake;
    }

    /**
    * @param {number[]} nums
    * @return {number}
    */
    function majorityElement(nums) {
        let hash = {};
        let majority_element;
        let max_num = 0;
        for (let num of nums) {
            if (hash[num]) {
                hash[num]++;
            } else {
                hash[num] = 1;
            }
            if (hash[num] > max_num) {
                max_num = hash[num];
                majority_element = num;
            }
        }
        return majority_element;
    };

    let preTitle;
    function getTitle() {
        preTitle = document.title;
        // 功能（依赖wenzhangzhuti）：处理标题
        // 获取宽度
        // let wenStyle = window.getComputedStyle(wenzhangzhuti, null); //获取文章最终样式
        // let wenWidth = parseFloat(wenStyle.getPropertyValue('width')); //获取文章宽度

        // 临时宽度
        // wenzhangzhuti.style.width = "800px";
        //使用setProperty  如果要设置!important，推荐用这种方法设置第三个参数,属性名不用驼峰写法
        wenzhangzhuti.style.setProperty("box-sizing", "border-box", "important");
        wenzhangzhuti.style.setProperty("width", "800px", "important");
        wenzhangzhuti.style.setProperty("padding", "40px", "important");

        // 排除标题
        let preHeads = wenzhangzhuti.querySelectorAll(
            ":is(h1,h2,h3,h4,h5):not(:is(code,pre,iframe,[about]) *,[translation-origin='off'],[about],[about]~ *,[about]~ * *)"
        );
        // if (window.location.host == "app.yinxiang.com") {
        //     preHeads = document.querySelectorAll(":is(h1,h2,h3,h4,h5):not(:is(code,pre,iframe) *)");
        // }

        // let Left = wenzhangzhuti.querySelector("[myAttr] *").offsetLeft;

        // 通过判断标题的左边距离是否符合预期
        let style = window.getComputedStyle(wenzhangzhuti, null); //获取文章最终样式
        let paddingL = parseFloat(style.getPropertyValue("padding-left")); //获取文章左侧内边距
        // let Left = wenzhangzhuti.offsetLeft + paddingL;

        // 文章内容横坐标
        let Left =
            wenzhangzhuti.getBoundingClientRect().left +
            document.documentElement.scrollLeft +
            paddingL;

        // 文章中轴
        let Wcenter =
            wenzhangzhuti.getBoundingClientRect().left +
            document.documentElement.scrollLeft +
            wenzhangzhuti.offsetWidth / 2;

        let Num1 = preHeads.length; //统计排除后剩余数量

        for (const iterator of preHeads) {
            // 如果标题位置偏离 或者 B标签和strong标签是嵌套的话，排除掉
            // if (iterator.offsetLeft - Left > 10 || iterator.parentNode.innerText.length - iterator.innerText.length > 0) {
            // 有效字符串
            let text = iterator.innerText.replace(/[\r\n]/g, "").trim();

            // 如果包含a标签，且连续，则排除 && ((iterator.nextElementSibling && pattHead.test(iterator.nextElementSibling.tagName)) || (iterator.previousElementSibling && pattHead.test(iterator.previousElementSibling.tagName)))
            // 正则
            // let pattHead = /^H(\d){1}/
            if (iterator.querySelectorAll("a").length > 0) {
                Num1--;
            }

            // 标题左坐标
            let HLeft =
                iterator.getBoundingClientRect().left +
                document.documentElement.scrollLeft;
            if (HLeft > Wcenter || text.length < 2) {
                // let X = iterator.getBoundingClientRect().left + document.documentElement.scrollLeft;
                // if (X - Left > 50 && hasAtr == false) {
                iterator.setAttribute("Ex", "exclusion");
                Num1--;
            } else {
                iterator.setAttribute("head", "head"); //符合条件即可获得head属性
            }
        }

        // 找疑似标题的标签，并筛选之
        let preNotH = wenzhangzhuti.querySelectorAll(
            ":is([class*='strong' i],strong,b,font,[myAttr] li:not([highlight] li,[about] li,li::before),.bjh-h3):not(:is(code,pre,iframe,table,[noth],[about]) *,[about],[about]~ *,[about]~ * *)"
        );
        // if (window.location.host == "app.yinxiang.com") {
        //     preNotH = document.querySelectorAll(":is([class*='strong'],strong,b,font,[myAttr]>li,.bjh-h3):not(:is(code,pre,iframe) *)");
        // }

        // 处理换行问题,拆解重组
        if (handleBr(preNotH)) {
            preNotH = wenzhangzhuti.querySelectorAll(
                ":is([class*='strong' i],strong,b,font,[myAttr] li:not([highlight] li,[about] li,li::before),.bjh-h3):not(:is(code,pre,iframe,table,[noth],[about]) *,[about],[about]~ *,[about]~ * *)"
            );
        }

        // 左坐标众数为准
        let lefts = [];
        for (const iterator of preNotH) {
            lefts.push(
                Math.round(
                    (iterator.getBoundingClientRect().left +
                        document.documentElement.scrollLeft) /
                    10
                ) * 10
            );
        }

        let Left2 = majorityElement(lefts); //标准横坐标

        // 中轴众数为准
        let middles = [];
        for (const iterator of preNotH) {
            // 有效字符串
            let text = iterator.innerText.replace(/[\r\n]/g, "").trim();
            // 左边横坐标
            let ILeft =
                iterator.getBoundingClientRect().left +
                document.documentElement.scrollLeft;
            // 右边横坐标
            let Iright = ILeft + iterator.offsetWidth;
            if (
                Wcenter > ILeft &&
                Wcenter < Iright &&
                iterator.parentElement != wenzhangzhuti &&
                iterator.parentElement.innerText.replace(/[\r\n]/g, "").trim().length ==
                text.length &&
                iterator.offsetHeight < 40 &&
                text.length > 2
            ) {
                middles.push(
                    Math.round(
                        (iterator.getBoundingClientRect().left +
                            document.documentElement.scrollLeft) /
                        10
                    ) *
                    10 +
                    iterator.offsetWidth / 2
                );
            }
        }

        let middle = majorityElement(middles); //标准中轴

        let WillShowItems = makeAarry(preNotH); //将会显示的标题数组

        for (let i = 0; i < preNotH.length; i++) {
            const iterator = preNotH[i];
            iterator.setAttribute("head2", "head2"); //使之获取head2属性，后续使用css选择器去重

            // 横坐标不符且偏离中轴,则排除；含有句号,则排除；如果是文段里的, 占两行且无标题标志，也要排除;其父节点是标题，要排除
            // 左边横坐标
            let ILeft =
                iterator.getBoundingClientRect().left +
                document.documentElement.scrollLeft;
            // 中轴坐标
            let Icenter = ILeft + iterator.offsetWidth / 2;
            // 右边横坐标 (iterator.offsetHeight > 40 )
            // let Iright = ILeft + iterator.offsetWidth;
            // 有效字符串
            let text = iterator.innerText.replace(/[\r\n]/g, "").trim();
            // 正则汉字数字、 二级标题
            let pattH = /^[一二三四五六七八九十]{1,2}(\.|\、){1}(.){2,30}/;
            let panduanH = pattH.test(text);
            // 正则阿拉伯数字. 三级标题
            let pattA = /^(\d{1,2}\.|\d{1,2}\、){1}(.){2,30}/;
            let panduanA = pattA.test(text);

            // Wcenter > ILeft && Wcenter < Iright && iterator.parentElement != wenzhangzhuti && iterator.parentElement.innerText.replace(/[\r\n]/g, "").trim().length != text.length && (panduanH == false || panduanA == false)
            // && Math.abs(ILeft - Left2) > 10
            // || text.split("。").length > 1
            if (
                (Math.abs(ILeft - Left2) > 10 &&
                    Math.abs(Icenter - middle) > 10 &&
                    Math.abs(Icenter - Wcenter) > 40 &&
                    iterator.parentElement != wenzhangzhuti &&
                    iterator.parentElement.innerText.replace(/[\r\n]/g, "").trim()
                        .length != text.length) ||
                iterator.parentElement.hasAttribute("head") ||
                iterator.parentElement.hasAttribute("head2") ||
                text.length < 2 ||
                (iterator.parentElement != wenzhangzhuti &&
                    iterator.parentElement.innerText.replace(/[\r\n]/g, "").trim()
                        .length != text.length &&
                    iterator.offsetHeight > 40 &&
                    panduanH == false &&
                    panduanA == false) ||
                (Math.abs(ILeft - Left2) > 10 &&
                    iterator.offsetHeight < 40 &&
                    iterator.parentElement != wenzhangzhuti &&
                    iterator.parentElement.innerText.replace(/[\r\n]/g, "").trim()
                        .length != text.length) ||
                (text.split("。").length > 1 &&
                    panduanH == false &&
                    panduanA == false) ||
                Wcenter < ILeft
            ) {
                iterator.setAttribute("Ex", "exclusion");
                WillShowItems.remove(iterator);
            }
        }

        let Num2 = WillShowItems.length; //排除后的余量

        // 将会显示的标题只有一个，也不再显示
        if (Num2 == 1) {
            WillShowItems[0].setAttribute("Ex", "exclusion");
        }

        // 遍历将要显示的标题，如果有序号或在中轴的话，将作为h标签显示
        if (Num1 < 3) {
            for (const i of WillShowItems) {
                // 横坐标
                let ILeft =
                    i.getBoundingClientRect().left + document.documentElement.scrollLeft;
                // 右边横坐标
                // let Iright = ILeft + i.offsetWidth;
                // 中轴坐标
                let Icenter = ILeft + i.offsetWidth / 2;
                // 有效字符串
                let text = i.innerText.replace(/[\r\n]/g, "").trim();

                let pattH = /^[一二三四五六七八九十]{1,2}(\.|\、){1}(.){2,30}/;
                let panduanH = pattH.test(text);
                let pattA = /^(\d{1,2}\.|\d{1,2}\、){1}(.){2,30}/;
                let panduanA = pattA.test(text);

                // if (Math.abs(ILeft - Left2) < 10||) {
                // 正则汉字数字、 二级标题
                if (panduanH) {
                    // i.removeAttribute("head2");
                    i.innerHTML = "<h2 head='append'>" + text + "</h2>";
                    console.log(text + "  添加了h2标签");
                }
                // 正则阿拉伯数字. 三级标题
                if (panduanA) {
                    // i.removeAttribute("head2");
                    i.innerHTML = "<h3 head='append'>" + text + "</h3>";
                    console.log(text + "  添加了h3标签");
                }
                // }

                // 无正则但居中 四级标题
                // 字数与物理长度向契合 Math.abs(i.offsetWidth - text.length * 20) < 60)
                // 非文本嵌套
                if (
                    !panduanH &&
                    !panduanA &&
                    (Math.abs(Icenter - middle) < 10 ||
                        Math.abs(Icenter - Wcenter) < 40) &&
                    i.offsetHeight < 40 &&
                    i.parentElement != wenzhangzhuti &&
                    i.parentElement.innerText.replace(/[\r\n]/g, "").trim().length ==
                    text.length &&
                    i.offsetWidth - text.length * 20 < 60 &&
                    ILeft != Left
                ) {
                    // i.removeAttribute("head2");
                    i.innerHTML = "<h4 head='append'>" + text + "</h4>";
                    console.log("添加了h4标签");
                }

                if (i.querySelectorAll("[head]").length) {
                    i.removeAttribute("head2");
                }
            }
        }

        // 寻找隐性标题

        // if (Num1 < 3 && Num2 < 1) {
        if (Num1 < 3 && Num2 < 3) {

            // 给文章主体的标题文字节点转成p元素节点
            for (const iterator of wenzhangzhuti.childNodes) {
                if (iterator.nodeType == 3 && iterator.nodeValue.match(/(\d{1,2}(\.|\、|）|\))){1}(.){2,30}/g)) {
                    let newnode = document.createElement("p")
                    newnode.innerText = iterator.nodeValue
                    wenzhangzhuti.replaceChild(newnode, iterator)
                }
            }



            // 寻找有序号的p标签
            let eles = wenzhangzhuti.querySelectorAll(
                "p:not(:is(code,pre,iframe) *)"
            );
            // if (window.location.host == "app.yinxiang.com") {
            //     eles = document.querySelectorAll("p:not(:is(code,pre,iframe) *)");
            // }

            // 处理换行问题,拆解重组
            if (handleBr(eles)) {
                eles = wenzhangzhuti.querySelectorAll("p:not(:is(code,pre,iframe) *)");
            }

            console.log("p标签的数量" + eles.length);
            // let tem
            let h = 0;
            for (const i of eles) {
                // 有效字符串
                let text = i.innerText.replace(/[\r\n]/g, "").trim();

                console.log("执行");
                let pattH = /^[一二三四五六七八九十]{1,2}(\.|\、){1}(.){2,30}/;
                // let patt = /^([\u4E00-\u9FA5]{1,2}\.|[\u4E00-\u9FA5]{1,2}\、){1}([\u4E00-\u9FA5A-Za-z0-9_]){2,30}/;
                let panduanH = pattH.test(text);

                if (panduanH) {
                    console.log("正则匹配" + text);
                    if (i.getBoundingClientRect().left - Left < 10) {
                        // 一分为二
                        let space = "";
                        let point = text.match(/[:,?;：，。？；]/u); //一个数组，第一个元素的是正则匹配结果
                        let textList = [];
                        if (point) {
                            space = point[0];
                            let spaceindex = text.indexOf(space);

                            i.outerHTML =
                                "<h2 head>" +
                                text.substring(0, spaceindex + 1) +
                                "</h2> <p>" +
                                text.substring(spaceindex + 1) +
                                "</P>";
                            console.log("P标签添加了h2标签");
                            h++;
                        } else {
                            i.innerHTML = "<h2 head='append'>" + text + "</h2>";
                            console.log("P标签添加了h2标签");
                            h++;
                        }
                    }
                }

                let pattA = /^(\d{1,2}(\.|\、|）|\))){1}(.){2,30}/;
                let panduanA = pattA.test(text);
                if (panduanA) {
                    console.log("正则匹配" + text);
                    if (i.getBoundingClientRect().left - Left < 10) {
                        // i.setAttribute("class", "h3");

                        // 一分为二
                        let space = "";
                        let point = text.match(/[:,?;：，。？；]/u); //一个数组，第一个元素的是正则匹配结果
                        let textList = [];
                        if (point) {
                            space = text.indexOf(point[0]);

                            i.outerHTML =
                                "<h3 head>" +
                                text.substring(0, space + 1) +
                                "</h3> <p>" +
                                text.substring(space + 1) +
                                "</P>";
                            console.log("P标签添加了h3标签");
                            h++;
                        } else {
                            i.innerHTML = "<h3 head='append'>" + text + "</h3>";
                            console.log("P标签添加了h3标签");
                            h++;
                        }
                        // if (i.getBoundingClientRect().left - Left > 10) {
                        // iterator.setAttribute("Ex", "exclusion");
                        // h--;
                        // }
                    }
                }
            }
            console.log("隐性标题数量:" + h);

            /*             if (h < 3 && Num2 < 3) {
                            // 若啥也没有，则标记没有标题
                            hasOption = false;
                        }
             */

        }

        // chatgpt
        for (const iterator of document.querySelectorAll(".text-base:has(img) .whitespace-pre-wrap")) {
            iterator.innerHTML = "<h2 head>" + iterator.innerHTML + "</h2>"
        }

        for (const iterator of wenzhangzhuti.querySelectorAll("[head2]:not([Ex]):not([head] [head2],[head2] [head2]),[head]:not([Ex]):not([head] [head])")) {
            if (iterator.offsetHeight > 0 || iterator.clientHeight > 0) {
                wenzhangheads.push(iterator)
            }
        }
        hasOption = wenzhangheads.length;

        // 恢复宽度
        wenzhangzhuti.style.removeProperty("width");
        wenzhangzhuti.style.removeProperty("box-sizing");
        wenzhangzhuti.style.removeProperty("padding");

    }

    function handelLink() {
        // 功能（依赖wenzhangzhuti）：处理链接
        // 主体内容设置完毕
        // 文本转链接
        // let jjjq = $.noConflict();
        // let wenText = wenzhangzhuti.innerText
        // wenText = wenText.replace(webSiteReg, "<a href='$1' target='_blank'>$1</a>");

        let webSiteReg =
            /((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g;
        // let linkList = $('[myAttr]').text().match(webSiteReg);
        let linkList = wenzhangzhuti.innerText.match(webSiteReg);
        if (linkList && linkList.length) {
            let flag = false;
            // 遍历正则匹配的链接
            for (let link of linkList) {
                flag = false;
                let elements = $("[myattr] :contains(" + link + ")");
                if (!elements.length) {
                    elements = $("[maindiv] :contains(" + link + ")");
                }
                if (!elements.length) {
                    elements = $("body :contains(" + link + ")");
                }
                //   = elements[elements.length - 1];
                // makeAarry
                if (!elements.length) {
                    continue;
                }
                elements = makeAarry(elements);
                let element = undefined;

                for (const iterator of elements) {
                    if (iterator) {
                        // 不要code里面的a
                        if (iterator.tagName == "CODE") {
                            flag = true;
                            break; //结束循环
                        }
                        // elements.remove(iterator)
                        if (iterator.innerText.length == link.length) {
                            element = iterator;
                        }
                    }
                }
                if (flag) {
                    continue;
                }

                // 如果上面没找到，则取最后一个
                if (!element) {
                    let lastE = elements[elements.length - 1];
                    if (lastE.innerHTML.length < wenzhangzhuti.innerHTML.length) {  //该元素必须是wenzhangzhuti子元素
                        lastE.innerText = lastE.innerText.replace(webSiteReg, "$1 ");
                        lastE.innerHTML = lastE.innerHTML.replace(
                            webSiteReg,
                            "<a conversion href='$1' target='_blank'>$1</a>"
                        );
                        console.log("...文本转链接处理完毕！");
                    }
                }

                if (element) {
                    if (element.tagName == "A") {
                        // 在新页面打开
                        // element.setAttribute("target", "_blank")
                        element.setAttribute("href", link);
                        continue;
                    }
                    let newHTML = element.innerText.replace(
                        link,
                        "<a conversion href='" + link + "' target='_blank'>" + link + "</a>"
                    );
                    element.innerHTML = newHTML;
                }
            }
        }

        // href="https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FuhL9VZuKg1-CtnGlI0YO7A"
        // 去重定向，直接访问

        let links = document.querySelectorAll("a");

        for (const iterator of links) {
            let href = iterator.getAttribute("href");
            if (href && href.length && href.indexOf("http") != -1) {
                let hrefs = href.split("=");
                if (hrefs.length > 1 && !/[\u4e00-\u9fa5]/.test(hrefs)) {
                    let target = hrefs.pop(); // 重定向地址

                    // 转码
                    if (target.split("%").length > 1) {
                        let unescapeUrl = unescape(target);
                        if (unescapeUrl.split("%").length > 1) {
                            let decodeURIurl = decodeURI(target);
                            if (decodeURIurl.split("%").length > 1) {
                                let decodeURIComponenturl = decodeURIComponent(target);
                                if (decodeURIComponenturl.split("%").length > 1) {
                                } else {
                                    iterator.setAttribute("href", decodeURIComponenturl);
                                }
                            } else {
                                iterator.setAttribute("href", decodeURIurl);
                            }
                        } else {
                            iterator.setAttribute("href", unescapeUrl);
                        }
                    }

                    // 重写点击链接事件
                    // iterator.onclick = function () {
                    //     //active:true，新标签页获取页面焦点
                    //     //setParent :true:新标签页面关闭后，焦点重新回到源页面
                    //     GM_openInTab(iterator.getAttribute("href"), {
                    //         active: true,
                    //         setParent: true,
                    //     });
                    // };
                }
            }
        }
    }

    // 比较字符串相似度
    function similar(s, t, f) {
        if (!s || !t) {
            return 0
        }
        let l = s.length > t.length ? s.length : t.length
        let n = s.length
        let m = t.length
        let d = []
        f = f || 3
        let min = function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        let i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        let res = (1 - d[n][m] / l)
        return res.toFixed(f)
    }

    //查找两个字符串的最长公共子串
    function findSubStr(s1, s2) {
        let S = sstr = "",
            L1 = s1.length,
            L2 = s2.length;
        if (L1 > L2) {
            let s3 = s1;
            s1 = s2, s2 = s3, L1 = s2.length;
        }
        for (let j = L1; j > 0; j--)
            for (let i = 0; i <= L1 - j; i++) {
                sstr = s1.substr(i, j);
                if (s2.indexOf(sstr) >= 0) return sstr;
            }
        return "";
    }

    // 去除特殊符号
    function removePoint(params) {
        return params.replace(/[`_–‘’“”\-~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, "").toLowerCase()
    }


    // 页面简洁处理
    function clean() {
        // wenzhangzhuti祖先元素添加属性
        $("[myattr]")
            .parents()
            .each(function () {
                this.setAttribute("wenwen", "parents");
            });

        // 功能（任意时段，独立）：添加头部标题
        let ti = document.createElement("div");
        ti.setAttribute("wenwen", "title");
        document.body.prepend(ti);

        // 去除CSDN标题污染
        document.title = document.title.replace(/(.){0,}条消息\) /, "")

        let titleStrs = document.title.split(/-|_|\|/);

        // [a-zA-Z]
        let pattT = /[a-zA-Z0-9]$/;
        let showText;
        let main1 = zhutiArry.length ? zhutiArry[0] : main
        let h1;
        let hList = main1.querySelectorAll("h1,h2,h3,h4,h5,h6")
        findH(hList)

        if (!h1) {
            hList = document.querySelectorAll("h1,h2,h3,h4,h5,h6")
            findH(hList)
        }

        if (!h1) {
            hList = document.querySelectorAll("[class*='title' i],[id*='title' i]")
            findH(hList)
        }
        if (!h1) {
            hList = document.querySelectorAll("div[class],div[id]")
            let temp = []
            for (const iterator of hList) {
                if (positionAndHasText(iterator) && iterator.innerText.length <= document.title.length && iterator.offsetWidth > wenzhangzhuti.offsetWidth * 2 / 3) {
                    temp.push(iterator)
                }
            }
            findH(temp)
        }

        function getStrWith(params) {
            let letter = params.match(/[a-zA-Z0-9]/g)
            let Chinese = params.match(/[\u4E00-\u9FA5]/g)
            let letterNum = letter ? letter.length : 0
            let ChineseNum = Chinese ? Chinese.length : 0
            return letterNum + 2 * ChineseNum
        }

        function findH(params) {
            if (params) {
                for (const iterator of params) {
                    if (iterator.innerText && removePoint(iterator.innerText) && (Math.abs(wenzhangzhuti.getBoundingClientRect().left - iterator.getBoundingClientRect().left) < 40 || wenzhangzhuti.getBoundingClientRect().left < iterator.getBoundingClientRect().left || main1.contains(iterator))) {
                        // 防止H标签加料，公共部分与H内容需要高度相似
                        let common = findSubStr(removePoint(document.title), removePoint(iterator.innerText))
                        // let sim = similar(removePoint(document.title), removePoint(iterator.innerText))
                        if (removePoint(document.title).indexOf(removePoint(iterator.innerText)) == 0
                            || (getStrWith(removePoint(iterator.innerText)) > getStrWith(removePoint(document.title)) * 0.4 && getStrWith(common) > 16)) {
                            h1 = iterator
                            break;
                        }
                    }
                }
            }
        }

        if (h1) {
            showText = h1.innerText;
            // 匹配成功，有标题
            hasTitle = true
            console.log("title: " + showText);
        } else {
            /*             showText = titleStrs[0];
                        // 如果标题形如：CSS repeating-linear-gradient() 函数
                        let panduanT = pattT.test(showText);
                        if (panduanT && titleStrs.length > 1) {
                            let gangMatch = document.title.replace(/\s/g).match(/[a-zA-Z0-9]\-/g);
                            let gang = gangMatch ? gangMatch.length : 0
                            for (let index = 1; index <= gang; index++) {
                                showText = showText + "-" + titleStrs[index];
                            }

                        } */

            showText = document.title

        }
        if (!document.title.trim()) {
            showText = document.querySelector("h1,h2,h3,h4,h5,h6") ? document.querySelectorAll("h1,h2,h3,h4,h5,h6")[0] : (hList ? hList[0] : "")
        }
        // ti.innerHTML = "<h1 wenwen='title'><img wenwen='title'></img>" + showText + "</h1>";
        ti.innerHTML = "<h1 wenwen='title'></h1>";
        // 添加双击事件监听器
        ti.addEventListener('dblclick', function () {
            const input = document.createElement('textarea');
            wenzhangzhuti.appendChild(input);
            input.value = "# [" + ti.innerText + "](" + window.location.href.split("#")[0] + ")"
            input.select();
            let res = document.execCommand('Copy');
            wenzhangzhuti.removeChild(input);

            if (res) {
                let t = document.createElement("div");
                t.setAttribute("id", "tips")
                t.innerHTML = "复制标题成功";

                document.body.prepend(t);
                setTimeout(function () {
                    document.body.removeChild(t);
                }, 1000);
            }


        });

        ti.firstElementChild.innerText = showText;
        if (ti.firstElementChild.innerText.length > 40) {
            ti.firstElementChild.setAttribute("title", showText);
        }
        // }
        // else {
        // ti.innerHTML = "<h1 wenwen='title'><img wenwen='title'></img>" + document.title + "</h1>";
        // }

        let img = document.createElement("img");
        ti.firstElementChild.prepend(img);
        //https://favicon.yandex.net/favicon/v2/https://blog.csdn.net/Altaba/article/details/78539752?size=32
        let url = window.location.host;
        let iconurl =
            // "https://favicon.yandex.net/favicon/v2/https://" + url + "?size=32";
            "https://favicon.cccyun.cc/" + url
        let imgSrc = document.head.querySelector("link[rel*='icon'][href]") ? document.head.querySelector("link[rel*='icon'][href]").getAttribute("href") : iconurl
        // 添加属性
        img.setAttribute("src", imgSrc);
        img.onerror = function () {
            img.setAttribute("src", iconurl);
        }
        img.setAttribute("wenwen", "title");
    }




    // ---------------- TocBar ----------------------
    const TOC_BAR_STYLE = /*css*/`
    .toc-bar {
        all: initial;
        --toc-bar-active-color: #54BC4B;
        background-color: #d7ccc8 !important;
        position: fixed;
        z-index: 999999;
        right: 5px;
        top: 80px;

        width: 340px;
        font-size: 14px;
        box-sizing: border-box;
        padding: 0 10px 10px 0;
        box-shadow: 0 1px 3px #DDD;
        border-radius: 4px;
        transition: width 0.2s ease;
        color: #333;
        background: #FEFEFE;

        user-select:none;
        -moz-user-select:none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .toc-bar__header .shang {
        background-color: #4caf50 !important;
        font: 14px/1.5"PingFang SC", "微软雅黑", "Microsoft YaHei", Helvetica, "Helvetica Neue", Tahoma, Arial, sans-serif;
        font-weight: bold;
        padding: 2px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
    }

    .toc-bar__refresh {
        position: relative;
        top: -2px;
        margin-left: auto!important;
        height: 100%!important;
    }

    .toc-bar__refresh svg {
        background: #4caf50 !important;
    }

    .toc-bar__icon-btn {
        height: 1em;
        width: 1em;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .toc-bar__icon-btn:hover {
        opacity: 0.7;
    }

    .toc-bar__icon-btn svg {
        max-width: 100%;
        max-height: 100%;
        vertical-align: top;
        padding: 0!important;
    }

    .toc-bar__header-left {
        align-items: center;
    }

    .toc-bar__toggle {
        height: 1em;
        width: 1em;
        padding: 8px 8px;
        box-sizing: content-box;
    }

    .toc-bar__toggle svg {
        max-width: 100%;
        max-height: 100%;
        vertical-align: top;
        padding: 0!important;
        background: #4caf50 !important;
    }

    .toc-bar__title {
        margin-left: 5px;
        font-weight: 700
    }

    .toc-bar a.toc-link {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        line-height: 1.6;
    }

    #toc-bar .flex {
        display: flex;
        flex-direction: row !important;
    }

    /* tocbot related */
    .toc-bar__toc {
        max-height: 80vh;
        overflow-y: auto;
    }

    .toc-list-item>a:hover {
       /*  text-decoration: underline; */
    }

    .toc-list {
        padding-inline-start: 0;
    }

    .toc-bar__toc>.toc-list {
        margin: 0;
        overflow: hidden;
        position: relative;
        padding-left: 5px;
    }

    .toc-bar__toc>.toc-list li {
        list-style: none;
        padding-left: 8px;
        position: static;
    }

    a.toc-link {
        color: currentColor;
        height: 100%;
    }

    .is-collapsible {
        max-height: 1000px;
        overflow: hidden;
        transition: all 300ms ease-in-out;
    }

    .is-collapsed {
        max-height: 0;
    }

    .is-position-fixed {
        position: fixed !important;
        top: 0;
    }

    .toc-link::before {
        background-color: #EEE;
        content: ' ';
        display: inline-block;
        height: inherit;
        left: 0;
        margin-top: -1px;
        position: absolute;
        width: 2px;
    }

    #toc-bar {
        z-index: 999999 !important;
        padding-bottom: 10px;
    }

    .toc-bar {
        padding: 0px;
    }


    .toc-bar__actions{
        margin-right: 8px;
        height: 20px!important;
        width: 40px!important;
    }

    a.toc-link {
        font-weight: 700;
        font-style: normal;
        background-color: #d7ccc8 !important;
        border: 0px;
        font-size: 17px !important;
        font-family: consoals
    }

    .toc-link::before {
        background-color: #d7ccc8;
        content: ' ';
        display: inline-block;
        height: inherit;
        left: 0;
        margin-top: -1px;
        position: absolute;
        width: 4px;
    }

    .is-active-link {
        font-weight: 700;
        background-color: #fff59d !important;
        border: 2px solid red !important;
        font-weight: 700;
    }



    .is-active-link::before {
        background-color: #4caf50 !important;
    }


    .toc-list-item {
        padding-left: 0 !important;
        margin:0!important;
        padding:0!important;
    }

    /* toc样式 */
    .toc-bar__toc * {
        background-color: #d7ccc8 !important;
    }

    .shang * {
        background-color: inherit !important;
    }

    #toc-bar .but {
        cursor: pointer !important;
        /*height: 20px !important;
        width: 50px !important;*/
        padding: 2px !important;
        word-break: normal !important;
        font-weight: 700;
        text-align: center;
        line-height: 20px;
        margin-left: 135px;
    }

    #toc-bar #butC {
        border-radius: 4px;
        color: #81c784 !important;
        background-color: #33691e !important;
    }

    #toc-bar #butO {
        color: #33691e !important;
        background-color: #81c784 !important;
    }

    .toc-list {
        margin: 0;
    }

    /*修改提示框*/
    #mytitle {
        position: absolute;
        font-size: 14px;
        padding: 4px;
        background: #f7f7f7!important;
        border: solid 1px #e9f7f6;
        border-radius: 5px;
        z-index:1000000;
        font-weight: 700;
    }

    /* 目标锚点高亮 */
    [here] {
        border-bottom: 2px solid yellow !important;
    }


    /* 文章标题 */
    div[wenwen*='title'] {
        height: 40px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: fixed;
        top: 0;
        left: 0;
        font-size: 22px;
        z-index: 999999;
        padding: 0px;
        background-color: #c5e0b3;
        width: 100%;
        color: blue;
        border-bottom: 1px solid green;
        background-image: none!important;
    }

    h1[wenwen*='title'] {
        all: unset;
        font-family: consoals!important;
        font-weight: 700!important;
        line-height: 40px!important;
        padding: 0!important;
        font-size: 22px!important;
        margin: 0!important;
        color: blue !important;
        display: flex!important;
        align-items: center!important;
        margin-left: 80px!important;
        text-indent: 0 !important;
        background-image: none!important;
    }



    img[wenwen*="title"] {
        height: 20px !important;
        width: 20px !important;
        /* float: left !important; */
        margin: 0 5px 0 0 !important;
    }

    /* 大纲样式 */
    [head="head"]::before,
    [head="head"]::after {
        content: none !important;
    }


    /* 代码块样式*/
    input.codelang{
        font: -webkit-control!important;
        cursor:text!important;
        float: right!important;
        position: relative!important;
        padding:0!important;
        margin-left: 80%!important;
        margin-bottom: 0!important;
        border: 0!important;
        box-shadow: none!important;
        outline:none!important;
        color: gray!important;
        font-weight: 700!important;
        font-family: consoals!important;
        height: 26px!important;
        text-align: right!important;
        background: none!important;
        background-color: rgba(0,0,0,0)!important;
        caret-color: yellow!important;
        /*text-decoration:underline!important;*/
        width: 150px!important;
    }

   /*  input.codelang:hover{
        color:  yellow!important;
        text-decoration:none!important;
        box-shadow: inset -1px -1px 4px white!important;
    }*/


    input.codelang::-webkit-input-placeholder {
        color: gray!important;
    }

    [wenwen] [myattr] .codelang~*{
        background-color: black!important;
    }

    .isfull code:not(code code){
        background: black!important;
    }

    [iscode] *:not(.button,abc)
    {
        line-height: 28px!important;
        background: none!important;
    }

    [innercode] li{
        height: 28px!important;
    }

    [iscode] [innercode]{
        margin:0!important;
        padding:10px!important;
        border: none!important;
        background-color: #000000!important;
        box-sizing:border-box!important;
        width: 100%!important;
        display: block!important;
        text-shadow:none!important;
    }

    [iscode] [innercode] span{
        text-shadow:none!important;
    }

    [iscode] [innercode]::before{
        content: none!important;
    }

    [wenwen] [iscode]{
        background: none!important;
        padding: 0!important;
        border: none!important;
        margin-left: 0!important;
        margin-right: 0!important;
        display: block!important;
    }

    [iscode] *:has([innercode]){
        padding: 0!important;
        border: none!important;
        margin: 0!important;
        min-width: 600px!important;
        box-sizing:border-box!important;
        width: 100%!important;
        display: block!important;
    }

    [iscode] button{
        display:none!important;
    }

    :is([iscode],code,pre)::before{
        content: none!important;
    }

    :is([iscode],code,pre){
        box-shadow: none!important;
    }

    :is(li code, p code, span code):not([iscode] code, pre code, [class*='code'] code) {
        background-color: white !important;
        border-radius: 10px !important;
        color: #ff5252 !important;
        padding: 0 8px !important;
        font-family: consoals !important;
        font-weight: normal !important;
        font-size: 17px !important;
        height: auto !important;
        margin: 2px !important;
    }

    `;


    // 设置导航跳转
    function Navigation() {
        // 仅限于本页跳转
        // let lias = document.querySelectorAll("#toc-bar a");
        // for (const iterator of lias) {
        //     iterator.setAttribute("target", "_self");
        // }

        // 解决锚点偏移
        $("#toc-bar a").click(function (e) {
            $('#mytitle').remove();
            $("#mytitlecss").remove();
            bansync = false;
            pageScroll()

            let here = document.querySelector("[here]");
            if (here) {
                here.removeAttribute("here");
            }
            let target = $(this).attr("href"); // target获取的是a标签里的链接
            $("html, body").animate(
                {
                    scrollTop: $(target).offset().top - 60, //60为设置的偏移值
                },
                300
            );
            document.querySelector(target).setAttribute("here", "here");

            setTimeout(
                () => {
                    $(".is-active-link").removeClass('is-active-link');
                    $(e.target).addClass("is-active-link")
                }
                , 380
            )


            return false;
        });

    }


    function countTagTextL(eles, print) {
        let length = 0;
        for (const iterator of eles) {
            if (print) {
                console.log(iterator.tagName + ": " + iterator.innerText);
            }
            length = iterator.innerText.length + length;
        }
        return length;
    }
    // toc样式控制
    let openM;
    let butC;
    // let but2 = header.querySelector("#but2");
    let butO;
    function tocControl() {

        butC = document.querySelector("#butC");
        butO = document.querySelector("#butO");

        // bodystyle
        let style = document.createElement("style");
        style.setAttribute("bodystyle", "tttt");
        document.head.appendChild(style);

        // tocstyle
        let style2 = document.createElement("style");
        style2.setAttribute("tocstyle", "tttt");
        document.head.appendChild(style2);


        let bodystyle = /*css*/`
                  :not([myAttr], [myAttr] *, #toc-bar, #toc-bar *, [wenwen], [id^='pv-'], [id^='pv-'] *, [class^='pv-'], [class^='pv-'] *, [id='stylebot'], [id='stylebot'] *, .simpread-read-root, .simpread-read-root *) {
                      display: none !important;
                  }

                  /* 文章主体样式 max-width: 800px !important;background-color: #c5e0b3 !important;*/
                  [myattr] {
                  font-family: consoals!important;
                  z-index: 999998!important;
                  box-sizing:border-box!important;
                  padding: 40px!important;
                  height: auto !important;
                  margin:0!important;
                  box-shadow: 0px 0px 30px gray;
                  background: none;
                  overflow: visible !important;
                  width: 800px !important;
                  max-width: none !important;
                  max-height: none !important;
                  position: absolute !important;
                  top: 100px !important;
                  left: 80px !important;
                  margin-bottom: 200px !important;
                  font-size: 20px!important;
                  }

                  [myattr] div:not([iscode] div){
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-size: 20px!important;
                  }

                  [myattr] *:not(.isfull,.isfull *),[myattr] :is(img,table){
                    max-width: 720px!important;
                  }

                  [myAttr] a {
                      color: #135888!important;
                  }

                  [wenwen*='parents'] {
                      max-width: 100vw !important;
                      /* 展开隐藏内容 */
                      overflow: visible !important;

                      box-shadow: none !important;
                      display: block !important;
                      position: absolute !important;
                      top: 0!important;
                      left: 0 !important;
                      right: 0 !important;
                      bottom: 0!important;
                      width: 100% !important;
                      margin: 0 !important;
                      margin-left: 0 !important;
                      padding: 0 !important;
                      border: none !important;
                      background: none !important;
                      background-color: #d4e6bb !important;
                  }

                  /* 终选展开全文 */
                  [myattr] div[show]:not(#toc-bar,#toc-bar *){
                      overflow: visible!important;
                      height: auto!important;
                      display: block!important;
                  }

                  #butO {
                      display: none
                  }


                  /* 去广告 , 推荐，评论区*/
                  [myattr] :is([about],[about]~*,[comment]){
                      display:none!important;
                  }

                  a[href*='http'] img:not([myattr] img),[class*="advert"]{
                    display:none!important;
                  }

                  /* 文章样式 */
                  /* 表格 */
                    [myAttr] table:not([iscode],[iscode] table):has(th) {
                        border: 1px solid #cdcdcd !important;
                        border-collapse: collapse !important;
                        margin: 10px 0 !important
                    }

                    [myAttr] table:not([iscode],[iscode] table) th {
                        color: #3f51b5 !important;
                        background-color: #dce775 !important;
                        border: 1px solid #cdcdcd !important;
                        padding: 10px !important;
                        font-size: 19px!important;
                    }

                    [myAttr] table:not([iscode],[iscode] table):has(th) td {
                        background-color: #f0f4c3 !important;
                        border: 1px solid #cdcdcd !important;
                        padding: 10px !important
                    }

                /*    [myAttr] h3 {
                        line-height: 30px !important;
                    } */

                  [myattr] :is(h1, h2, h3, h4, h5) {
                    border-left: 0 !important;
                    text-decoration: none !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                    /* 	overflow: hidden!important; */
                  }
                  :is([myAttr]) code,
                    pre code sapn[class] {
                        font-family: consolas !important;
                    }

                  [myAttr] p:not(:is(code,video,[class*='video' i],[id*='video' i]) p),
                    [myAttr] span:not(:is(code,[head],[head2],video,[class*='video' i],[id*='video' i]) span) {
                        /* Font & Text */
                        /* 	font-family: -apple-system, system-ui, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif!important; */
                        font-family: arial!important;
                        font-size: 19px !important;
                        font-style: normal !important;
                        font-variant: normal;
                        font-weight: 400;
                        letter-spacing: normal;
                        line-height: 32px;
                        text-decoration: none solid rgb(89, 89, 89);
                        text-align: start;
                        text-indent: 0px;
                        text-transform: none;
                        vertical-align: baseline;
                        white-space: normal;
                        word-spacing: 0px;

                        /* Color & Background */
                        background-attachment: scroll;
                        background-color: rgba(0, 0, 0, 0);
                        background-image: none;
                        background-position: 0% 0%;
                        background-repeat: repeat;
                        color: black !important;
                    }
                  /* 文字可选可复制 */
                  [mainDiv] * {
                      user-select: text
                  }

                  [head],
                  [head2],
                  .h3 {

                      margin-left: 0 !important;
                      padding-left: 0 !important;
                      /* 锚点偏移 */
                      /*
                        margin-top: -60px !important;
                        padding-top: 60px !important;
                        */
                      background-color: rgb(0, 0, 0, 0) !important;
                      background-image: none !important;

                      border-left: 0 !important;
                      text-decoration: none !important;
                      box-shadow: none !important;
                      text-shadow: none !important;
                  }

                  :is([head],
                      [head2],
                      .h3)::before {
                      background:none!important;
                      content: none!important;
                      }

                      /* toc样式 */
                      #toc-bar a {
                        text-align: left !important;
                        text-decoration: none !important;
                      }

                      a.toc-link.node-name--H1,
                      .toc-level-h1 a,
                      h1 {
                          color: blue !important;
                          /* margin-left: 0px; */
                          font-weight: 700;
                      }

                      a.toc-link.node-name--H2,
                      .toc-level-h2 a,
                      h2 {
                          color: blueviolet !important;
                          margin-left: 10px;
                          font-weight: 700;
                      }

                      a.toc-link.node-name--H3,
                      .toc-level-h3 a,
                      h3 {
                          color: brown !important;
                          margin-left: 20px;
                          font-weight: 700;
                      }

                      a.toc-link.node-name--H4,
                      .toc-level-h4 a,
                      h4 {
                          color: #d78906 !important;
                          margin-left: 30px;
                          font-weight: 700;
                      }

                      a.toc-link.node-name--H5,.toc-level-h5 a,
                      h5 {
                          color: #35684e !important;
                          margin-left: 40px;
                          font-weight: 700;
                      }

                      a.toc-link:not([class*='H']) {
                          margin-left: 50px;
                          font-weight: 700;
                          color: black!important;
                      }

                      /* tip样式 */
                      #tips {
                        display: block !important;
                        background-color: #68af02 !important;
                        color: #fff !important;
                        position: fixed;
                        height: 24px;
                        line-height: 24px;
                        top: 10px;
                        right: 50%;
                        font-size: 14px;
                        text-align: center;
                        border-radius: 5px;
                        margin-left: 300px;
                        z-index: 1000000;
                      }

                          /* 滚动条 */
                        ::-webkit-scrollbar {
                            background-color: white !important;
                            height: 15px !important;
                            border-radius: 4px !important;
                            width: 15px !important;
                        }

                        ::-webkit-scrollbar-thumb,
                        ::-webkit-scrollbar-thumb:hover {
                            background-color: #00a0d8 !important;
                            visibility: visible !important;
                            border-radius: 4px !important;
                        }
                  `;


        let tocstyle = /*css*/`
                  #toc-bar{
                    opacity:0.5;
                  }

                  #toc-bar:hover{
                    opacity:1;
                  }

                  .toc-bar__toggle,
                  .toc-bar__title,
                  .toc-bar__toc {
                      display: none;
                  }

                  #toc-bar .shang{
                      padding: 5px 0 5px 5px!important;
                  }

                  #toc-bar .but {
                      margin-left: 0!important;
                  }

                  #toc-bar {
                      padding: 0 !important;
                      width: 100px;
                  }

                  .shang {
                      padding-bottom: 0 !important
                  }

                  #toc-bar * {
                      border-radius: 4px !important;
                  }

                  .toc-bar__header {
                      margin: 0 !important
                  }
                  `;

        // p标签内容长度
        // ("p:not(ul p,a p,p[class],p[id],header p,footer p,p p)");
        let theps = findP(wenzhangzhuti)
        if (!theps.length) {
            theps = document.querySelectorAll(
                "[myattr='wenzhangdiv']>p:not(p[class],p[id])"
            );
        }
        let strLength = countTagTextL(theps, true);
        console.log("文章主体的P数量：" + theps.length);

        // span标签内容长度
        let thespans = findSpan(wenzhangzhuti)
        if (!thespans.length) {
            thespans = document.querySelectorAll(
                "[myattr='wenzhangdiv']>span:not(span[class],span[id])"
            );
        }
        let spanTextLength = 0;
        if (thespans.length) {
            for (const iterator of thespans) {
                console.log("span: " + iterator.innerText);
                spanTextLength = iterator.innerText.length + spanTextLength;
            }
        }
        console.log("文章主体的span数量：" + thespans.length);

        // 统计元素的#text
        function countText(ele) {
            let textLeng = 0;
            for (const iterator of ele.childNodes) {
                if (iterator.nodeType == 3 && iterator.nodeValue.length > 0) {
                    textLeng = textLeng + iterator.nodeValue.length
                }
            }
            return textLeng;
        }
        // 统计#text
        // let divTextLength = 0;
        // divTextLength = countText(wenzhangzhuti);
        // for (const iterator of wenzhangzhuti.querySelectorAll("div")) {
        //     if (iterator.offsetWidth > wenzhangzhuti.offsetWidth * 2 / 3) {
        //         divTextLength = divTextLength + countText(iterator);
        //     }
        // }


        // 判断文章特征
        if (!hasAtr && window.location.href.includes("article") && document.querySelectorAll("article,[id*='article' i],[class*='article' i]").length > 0) {
            hasAtr = true
        }
        if (document.querySelectorAll("article").length > 2 && (strLength < 200 || spanTextLength < 200)) {
            hasAtr = false
        }

        let wenzhangTextLength = 0;
        if (!wenzhangzhuti.querySelector(":not(:empty)")) {
            wenzhangTextLength = wenzhangzhuti.innerText.length
        }

        let conditions = [hasTitle, (strLength > 200 || spanTextLength > 200 || wenzhangTextLength > 200), wenzhangcodenum, hasAtr]
        let Trues = 0;
        for (const iterator of conditions) {
            if (iterator) {
                Trues++
            }
        }
        console.log(
            "文章高度: " +
            wenzhangzhuti.offsetHeight +
            "\nstrLength字数(大于200): " +
            strLength +
            "\nspanTextLength字数(大于200): " +
            spanTextLength +
            // "\ndivTextLength字数(大于200,已经不作为判断依据): " +
            // divTextLength +
            "\n文章文本节点长度(无子元素且大于200): " +
            wenzhangTextLength +
            "\nhasAtr: " +
            hasAtr +
            "\nwenzhangcodenum: " +
            wenzhangcodenum +
            "\nhasTitle: " +
            hasTitle +
            "\nhasOption: " +
            hasOption +
            "\npathname: " +
            window.location.pathname
        );
        // if (hasTitle && (strLength > 200 || bodycodenum || hasAtr || hasOption)) {
        let website = ["baijiahao.baidu.com", "baike.baidu.com", "mp.weixin.qq.com"]
        if ((Trues > 1 || website.includes(window.location.host)) && window.location.pathname != "/") {  //满足一个以上的条件特征则视为文章
            console.log("确认有文章特征");
            wenzhangzhuti.setAttribute("myAttr", "wenzhangdiv");
            openM = true;
            style.innerText = bodystyle;
            style2.innerText = ``;
            // 无标题
            if (!hasOption) {
                style2.innerText = tocstyle;
            }
        } else {
            console.log("未能识别文章");
            wenzhangzhuti.removeAttribute("myAttr")
            openM = false;
            style2.innerText = tocstyle;
            style.innerText = `
                      #butC,[wenwen='title']{
                          display:none!important
                      }
                      `;
        }


        butC.onclick = function () {
            wenzhangzhuti.removeAttribute("myAttr")
            // 暂停同步
            bansync = true;
            // 收窄
            // if (example1 || (!example2 && !hasOption)) {
            style2.innerText = tocstyle;
            // } else {
            //     style2.innerText = `

            //     `
            // }

            style.innerText = `
                      #butC,[wenwen='title']{
                          display:none!important
                      }
                      `;

            styleH.innerText = ``

        };

        butO.onclick = function () {
            wenzhangzhuti.setAttribute("myAttr", "wenzhangdiv");
            // 开启同步
            bansync = false;
            pageScroll();

            // 宽松收窄
            if (!hasOption) {
                style2.innerText = tocstyle;
            } else {
                style2.innerText = `

                      `;
            }

            style.innerText = bodystyle;

            styleH.innerText = `
            [wenwen*='parents']{
                height:${wenzhangzhuti.offsetHeight + 300}px!important;
            }
            `
            setTimeout(() => {
                if (toc.getBoundingClientRect().right > document.documentElement.clientWidth) {
                    toc.style.left = toc.getBoundingClientRect().left - (toc.getBoundingClientRect().right - document.documentElement.clientWidth) + "px"
                }
            }, 200);

        };
    }


    // 功能：代码高亮
    let preCodeHtmls = []
    let datalist = document.createElement("datalist")
    datalist.id = "LangDatas";
    datalist.innerHTML = `
        <option value="javascript">
        <option value="typescript">
        <option value="html">
        <option value="css">
        <option value="java">
        <option value="json">
        <option value="coffeescript">
        <option value="auto">
        <option value="reset">
    `
    document.body.prepend(datalist)
    function CodeHL() {
        let ols = document.querySelectorAll("ol");
        for (const iterator of ols) {
            if (
                iterator.querySelector("span[style*=color]") &&
                iterator.offsetHeight <
                iterator.querySelectorAll("li").length * 30 + 100
            ) {
                iterator.setAttribute("highlight", "highlight");
            }
        }

        // 寻找代码块
        let cicodes = document.querySelectorAll(":is([class*='code' i],[id*='code' i],[class*='highlight' i]):not(header,footer,body,html,[id*='comment' i]~ *,[id*='comment' i],[id*='comment' i] *)")
        if (cicodes.length) {
            for (const iterator of cicodes) {
                // 不可有以下元素
                let IdQrIndex = iterator.getAttribute("id") ? iterator.getAttribute("id").toLocaleLowerCase().indexOf("qr") : -1;
                let img = iterator.querySelector("img");
                if ((img && img.clientHeight > 40) || iterator.querySelector("p:not(table p),[class*='qr' i],[id*='qr' i]") || (iterator.getAttribute("class") && iterator.getAttribute("class").toLocaleLowerCase().indexOf("qr") != -1) || IdQrIndex != -1) {
                    iterator.setAttribute("notcode", "")
                } else {
                    if (
                        iterator.offsetWidth > window.screen.availWidth / 3 &&
                        iterator.innerText.trim().length > 0 &&
                        /[a-zA-Z]/.test(iterator.innerText)
                    ) {
                        iterator.setAttribute("hascode", "")
                    }
                }
            }
        }
        //let codes = document.getElementsByTagName("pre");

        /*         let codes = document.querySelectorAll(
                    ":is(pre,[class*='code']:not([class*='qr'],[class*='Qr'],[class*='QR']),[id*='code']:not([id*='qr'],[id*='Qr'],[id*='QR']),[highlight],[class*='highlighter']):not(:is(pre,[class*='code'],[id*='code']) *,html,body)"
                ); */
        let codes = document.querySelectorAll(
            ":is(pre,[hascode],[highlight]):not(:is(pre,[hascode],header,[id*='header' i],[class*='header' i],footer,[id*='footer' i],[class*='footer' i],[id*='comment' i],a) *,header,[id*='header' i],[class*='header' i],footer,[id*='footer' i],[class*='footer' i],[id*='comment' i]~ *,[id*='comment' i],a,html,body)"
        );



        // let code = document.querySelector("pre");
        // console.log("复制代码块");
        // if(code.firstElementChild.tagName=="CODE"){
        // codes=document.querySelectorAll("code")
        // }

        // console.log("代码块:" + codes);
        if (codes.length < 0) {
            console.log("无代码块");
        }

        // 标记是否要染色
        // let color;

        // 添加js可控样式
        let stylel = document.createElement("style");
        stylel.setAttribute("codestyle", "tttt");
        document.head.appendChild(stylel);

        // 其他样式
        // 背景样式(依情况而定有无内容)
        // let styleb = document.createElement("style");
        // styleb.setAttribute("backstyle", "tttt");
        // document.head.appendChild(styleb);

        // 鼠标悬浮样式
        // sheet.addRule(' .Copybutton :hover ', 'opacity: 1; cursor:pointer; background-color: white;');

        // // 添加高亮脚本
        // let script = document.createElement('script');
        // script.setAttribute('src', 'https://apps.bdimg.com/libs/highlight.js/9.1.0/highlight.min.js');
        // document.head.appendChild(script);

        // }

        // 循环遍历寻找代码块
        for (const i of codes) {
            if (
                i.offsetWidth > window.screen.availWidth / 3 &&
                i.innerText.trim().length > 0 &&
                /[a-zA-Z]/.test(i.innerText)
            ) {
                // 是否是二维码
                let codeimg = i.querySelectorAll("img");
                if (codeimg.length == 1 && codeimg[0].offsetHeight > 40) {
                    continue;
                }

                // 是否为中文
                let text = i.innerText.trim()
                if (/[\u4e00-\u9fa5]$/.test(text) && /^[\u4e00-\u9fa5]/.test(text) && !text.includes('\n') && !text.includes('<!--') && !i.innerText.includes('<!--')) {
                    continue;
                }

                // 是否有行号,复制按钮？
                let varia = i.querySelectorAll(".pre-numbering,.gutter,.copy-code-btn,.zeroclipboard-container");
                if (varia.length) {
                    for (const iterator of varia) {
                        iterator.remove();
                    }
                }

                // 是否有杂乱元素
                // let varia = i.querySelectorAll(":not(pre,code,span,p)")
                // if (varia.length) {
                // for (const iterator of varia) {
                // iterator.remove();
                // }
                // }


                // 筛选通过，设置属性
                preCodeHtmls.push(i.outerHTML)
                i.setAttribute("isCode", "isCode");

                console.log("\n");
                console.log("##################代码块###################");

                // 简并层数
                if (i.tagName === "PRE" && window.location.host === "chat.openai.com") {
                    i.innerHTML = i.querySelector("code").outerHTML
                }

                let containers = i.querySelectorAll(
                    "table [class*='container' i],[class*='code' i],[id*='code' i]"
                );
                let targets = [];
                if (containers.length) {
                    //有table,pre,[class*='code'],[id*='code']
                    for (const iterator of containers) {
                        if (iterator.innerText && /[a-zA-Z#\/\-]/.test(iterator.innerText) && iterator.innerText.length + 10 > i.innerText.length && i.offsetWidth > window.screen.availWidth / 3) {
                            targets.push(iterator);
                        }
                    }
                    if (targets.length) {   //简并层数
                        if (targets[targets.length - 1].querySelector("span")) {
                            i.innerText = targets[targets.length - 1].innerText;
                        } else {
                            // 防止格式不换行
                            let lines = i.querySelectorAll(".container .line")
                            if (lines.length) {
                                let Text = "";
                                for (const iterator of lines) {
                                    Text = Text + iterator.innerText + "\n"
                                }
                                i.innerText = Text
                            } else {
                                i.innerHTML = targets[targets.length - 1].innerHTML;
                            }
                        }
                    }

                    let tdcode = i.querySelector("td [class*='code' i]")
                    if (tdcode) {
                        i.innerHTML = tdcode.innerHTML;
                    }

                }

                if (i.tagName == "PRE") {
                    // if (!i.firstElementChild || (i.firstElementChild && i.firstElementChild.tagName != "CODE")) {
                    if (i.querySelectorAll("code").length != 1) {
                        // continue;
                        i.innerHTML = "<code>" + i.innerHTML + "</code>";
                    }
                } else {
                    i.innerHTML = "<pre><code>" + i.innerHTML + "</code></pre>";
                }

                if (i.tagName == "TABLE") {
                    i.innerHTML = "<tbody><tr><td><pre><code>" + i.innerHTML + "</code></pre></td></tr></tbody>"
                }

                // let codes = i.querySelectorAll("code")
                // let code = i.querySelector("code")

                // 最里面的code
                let precodes = i.querySelectorAll("code");
                let codeL = precodes[precodes.length - 1];
                if (precodes.length > 2) {
                    codeL = i.querySelector("code");
                }
                codeL.setAttribute("innercode", "");

                // 备份
                let preText = codeL.innerText;
                let preHtml = codeL.innerHTML;

                // let codeC = i.firstChild;

                // 创建代码工具容器元素
                let abc = document.createElement("abc");
                // 创建复制按钮
                let btnC = document.createElement("btn-c");
                btnC.style.setProperty("line-height", "35px", "important");
                // 创建全屏显示按钮
                let btnB = document.createElement("btn-b");
                btnB.style.setProperty("line-height", "35px", "important");
                btnB.innerText = "Full";
                let btnE = document.createElement("btn-e");
                btnE.style.setProperty("line-height", "35px", "important");
                btnE.innerText = "Esc";
                btnE.style.display = "none";

                abc.append(btnC);
                abc.append(btnB);
                abc.append(btnE);

                // let precode = i.querySelector("code");

                let scrollEle;
                let originalScrollPosition;

                // 点击全屏
                btnB.onclick = function () {
                    let divElements = document.querySelectorAll("[wenwen*='parents']")
                    scrollEle = Array.from(divElements).find(function (div) {
                        return div.scrollHeight > div.clientHeight;
                    });
                    originalScrollPosition = scrollEle ? scrollEle.scrollTop : 0;

                    // // 给予属性
                    // i.setAttribute("thisCode", "thisCode")
                    // // 给予父元素属性
                    // $("[thisCode]").parents().each(function () {
                    // this.setAttribute("codeParents", "codeParents")
                    // });

                    btnE.style.display = "block";
                    btnB.style.display = "none";
                    // i.style.paddingTop = "10%"
                    // i.classList.add("isfull")

                    i.setAttribute("class", "isfull");
                    document.querySelector("#toc-bar").style.display = "none";
                    document.querySelector("[wenwen='title']").style.display = "none";
                    codeL.style.setProperty("padding", "40px 64px", "important");

                    stylel.innerText = /*css*/`
                      [wenwen*='parents']:has(.isfull) {
                        overflow: hidden !important;
                      }
                      :not(:has([iscode]),[iscode],[iscode] *){
                        display: none;
                      }

                      `;
                    if (codeL.clientHeight > window.innerHeight) {
                        stylel.innerText = /*css*/`
                        [wenwen*='parents']:has(.isfull) {
                          overflow: hidden !important;
                          height: 100vh!important;
                          width: 100vw!important;
                        }
                        :not(:has([iscode]),[iscode],[iscode] *){
                         display: none;
                        }
                        `;
                    }


                    // document.body.style.paddingTop = "100vh";

                    // 监听键盘
                    document.onkeydown = function (event) {
                        let e =
                            event || window.event || arguments.callee.caller.arguments[0];
                        if (e && e.keyCode == 27) {
                            // 按 Esc
                            //要做的事情，退出全屏
                            restore();
                        }
                    };
                };
                // 点击退出全屏
                btnE.onclick = function () {
                    restore();
                };

                btnC.innerHTML = "Copy"; //innerText也可以,区别是innerText不会解析html

                btnC.onclick = function () {
                    // alert("点击了按钮");
                    btnC.innerHTML = "";
                    btnB.innerHTML = "";
                    btnE.innerHTML = "";
                    GM_setClipboard(i.innerText);
                    btnC.innerHTML = "OK";
                    btnB.innerHTML = "Full";
                    btnE.innerHTML = "Esc";
                    // setTimeout(function () {
                    // btnC.innerHTML = "OK"
                    // }, 300);
                };

                // <code>
                i.onmouseenter = function () {
                    btnC.style.display = "block";
                    codeL.prepend(abc);
                };

                i.onmouseleave = function () {
                    // btnC.style.display = "none";
                    btnC.innerHTML = "Copy";
                    abc.remove();
                };

                // 代码语言框
                let lang = document.createElement("input")
                lang.type = "text";
                lang.placeholder = "Language"
                lang.className = "codelang"

                // lang.list = "LangDatas";
                lang.setAttribute("list", "LangDatas")

                // i.style.setProperty("overflow", "visible", "important");
                // let langMarginTop = parseFloat(window.getComputedStyle(i, null).getPropertyValue('padding-top').replace("px", "")) + 26;
                // lang.style.setProperty("margin-top", "-" + langMarginTop + "px", "important");
                lang.style.setProperty("margin-top", "-26px", "important");

                let hasCodeDiv = false;
                if (i.parentElement.tagName == "DIV" && i.parentElement.innerText.trim().length == i.innerText.trim().length && !i.parentElement.getAttribute("myattr")) {
                    hasCodeDiv = true;
                    // 在i.parentElement的内部前头添加
                    i.parentElement.prepend(lang);
                    i.parentElement.style.setProperty("margin-top", "-26px", "important");
                    i.parentElement.style.setProperty("padding-top", "26px", "important");
                    /*                let iParentPaddingTop = parseFloat(window.getComputedStyle(i.parentElement, null).getPropertyValue('padding-top').replace("px", "")) + 26
                                   i.parentElement.style.setProperty("padding-top", iParentPaddingTop + "px", "important");

                                   let iPpreEMb = parseFloat(window.getComputedStyle(i.parentElement.previousElementSibling, null).getPropertyValue("margin-bottom").replace("px", ""))
                                   if (iPpreEMb > 10) {
                                       i.parentElement.style.setProperty("margin-top", "-26px", "important");
                                   } else {
                                       let iParentMarginTop = parseFloat(window.getComputedStyle(i.parentElement, null).getPropertyValue('margin-top').replace("px", "")) - 26
                                       i.parentElement.style.setProperty("margin-top", iParentMarginTop + "px", "important");
                                   } */

                } else {
                    i.prepend(lang);

                    let iPaddingTop = parseFloat(window.getComputedStyle(i, null).getPropertyValue('padding-top').replace("px", "")) + 26
                    i.style.setProperty("padding-top", iPaddingTop + "px", "important");

                    let ipreEMb = i.previousElementSibling ? parseFloat(window.getComputedStyle(i.previousElementSibling, null).getPropertyValue("margin-bottom").replace("px", "")) : 0
                    if (ipreEMb > 10) {
                        i.style.setProperty("margin-top", "-26px", "important");
                    } else {
                        let iMarginTop = parseFloat(window.getComputedStyle(i, null).getPropertyValue('margin-top').replace("px", "")) - 26
                        i.style.setProperty("margin-top", iMarginTop + "px", "important");
                    }
                }

                codeL.style.setProperty("padding", "10px 10px 10px 16px", "important");

                lang.onmouseenter = function () {
                    abc.style.setProperty("display", "none", "important")
                };

                lang.onmouseleave = function () {
                    abc.style.removeProperty("display");
                }
                // 有div嵌套[iscode]时，不遮挡codeLang，不要改动其父元素
                /*             if (i.parentElement.tagName == "DIV" && i.parentElement.innerText.trim().length == i.innerText.trim().length) {
                                // i.style.setProperty("overflow", "visible", "important");
                                // i的padding-top增26px, i.parentElement的margin-top减26px
                                let iPaddingTop = parseFloat(window.getComputedStyle(i, null).getPropertyValue('padding-top').replace("px", "")) + 26
                                i.style.setProperty("padding-top", iPaddingTop + "px", "important");

                                // let iParentMarginTop = parseFloat(window.getComputedStyle(i.parentElement, null).getPropertyValue('margin-top').replace("px", "")) - 26
                                // i.parentElement.style.setProperty("margin-top", iParentMarginTop + "px", "important");
                            } */


                let custom = false;
                let colorDeep = true;
                // lang.onkeydown = function (event) {
                //     let e =
                //         event || window.event || arguments.callee.caller.arguments[0];
                //     if (e && e.keyCode == 13 && lang.value) {
                //         // 自定义语言染色
                //         custom = true
                //         HiLight(i)
                //     }
                //     if (e && e.keyCode == 46 && lang.value) {
                //         // 删除输入
                //         lang.value = ""
                //     }
                // };

                lang.onchange = function () {
                    let temp = getLang(i)
                    if (!lang.value.trim()) {//|| lang.value != temp
                        lang.value = temp || "";
                    } else {
                        // 自定义语言染色
                        custom = true
                        switch (lang.value) {
                            case "re": //还原
                            case "reset":
                                codeL.className = ""
                                lang.value = preLang;
                                codeL.setAttribute("language", preLang)
                                codeL.innerHTML = preHtml;
                                lang.blur()
                                return;
                            case "auto"://自动识别
                                codeL.className = ""
                                codeL.innerHTML = preHtml;
                                let pattern = /\n[ ]{0,}\n/g;
                                codeL.innerText = codeL.innerText.replace(pattern, "\n");
                                codeL.innerText = codeL.innerText.replace(/[\n]{2}/g, "\n");
                                hljs.highlightBlock(codeL);
                                reColorWhenNoBR()
                                lang.value = getLang(i);
                                codeL.setAttribute("language", lang.value)
                                lang.blur()
                                return;
                            default:
                                HiLight(i)
                                break;
                        }
                    }
                    lang.blur()
                };

                lang.onblur = function () {
                    let temp = getLang(i)
                    if (!lang.value.trim()) {//|| lang.value != temp
                        lang.value = temp || "";
                    }
                };

                lang.onfocus = function () {
                    lang.value = ""
                }

                lang.value = getLang(i).toLowerCase();
                codeL.setAttribute("language", lang.value)
                let preLang = lang.value;
                console.log("preLang：" + preLang);

                let coded = false;
                let precolorkinds = colorkinds().length

                // 判断背景颜色深浅
                determineBgColorDeep = function (element) {
                    let isDeepColor = false;
                    let codeStyle = window.getComputedStyle(element, null); //获取code最终样式
                    let codeLbgcolor = codeStyle.getPropertyValue('background-color'); //获取code背景颜色
                    let RgbValueArry = codeLbgcolor.replace(/[rgba\(\)]/g, "").split(",")
                    let $grayLevel = RgbValueArry[0] * 0.299 + RgbValueArry[1] * 0.587 + RgbValueArry[2] * 0.114;
                    if ($grayLevel >= 130 || /rgba\((.){0,}0\)/.test(codeLbgcolor)) {
                        isDeepColor = false
                    } else {
                        isDeepColor = true
                    }
                    return isDeepColor;
                }

                if (determineBgColorDeep(i) || determineBgColorDeep(codeL)) {
                    console.log("背景深色")
                } else {
                    colorDeep = false
                    console.log("%c以下代码背景浅色，需要染色：", "color:blue");
                    console.log(i.innerText);
                    HiLight(i);
                    coded = true;
                }


                // 无染色则代码高亮
                if (!coded && precolorkinds < 4) {
                    console.log("%c以下代码无染色，需要染色：", "color:blue");
                    console.log(i.innerText);
                    HiLight(i);
                    coded = true;
                }

                if (!coded) {
                    // console.log("有染色");
                    // 染色粗糙则重染色
                    let codeChilds = codeL.childNodes;
                    for (const iterator of codeChilds) {
                        if (iterator.nodeName == "#text") {
                            if (iterator.nodeValue.replace(/\s+/g, '').length > 30) {
                                recolorFlag = true;
                                console.log("%c以下代码染色粗糙需重染色(#text过长)：", "color:blue");
                                console.log(i.innerText);
                                console.log("#text过长:" + iterator.nodeValue.trim());
                                console.log("长度：" + iterator.nodeValue.replace(/\s+/g, '').length);
                                HiLight(i);
                                break;
                            }
                        } else {
                            if (
                                iterator.innerText &&
                                iterator.innerText.length > 30 &&
                                iterator.tagName != "CODE" &&
                                iterator.className.indexOf("com") == -1 &&
                                iterator.className.indexOf("str") == -1 &&
                                iterator.querySelectorAll("span").length == 0
                            ) {
                                recolorFlag = true;
                                console.log("%c以下代码染色粗糙需重染色(html标签内容过长)：", "color:blue");
                                console.log(i.innerText);
                                console.log("html标签内容过长:" + iterator.innerText);
                                console.log("长度：" + iterator.innerText.length);
                                HiLight(i);
                                break;
                            }
                        }
                    }
                }

                // 如果i的innerText没有换行\n或换行在末尾处，则需要格式化（有注释块则不做格式化）
                if (!coded) {
                    let colorCode = i.querySelector("code.hljs");
                    if (colorCode && !colorCode.querySelectorAll("[class*='com' i]").length) {
                        // if (colorCode) {
                        if (
                            colorCode.innerText.length > 200 &&
                            (colorCode.innerText.indexOf("\n") >=
                                colorCode.innerText.length / 2 ||
                                colorCode.innerText.indexOf("\n") == -1)
                        ) {
                            console.log("格式化前");
                            console.log(colorCode.innerText);
                            colorCode.innerText = getBeautifyCode(colorCode);
                            console.log("格式化后");
                            HiLight(i);
                        }
                    }
                }



                // 是否有#text
                function hasText(ele) {
                    let hastext = false
                    for (const iterator of ele.childNodes) {
                        if (iterator.nodeName == "#text") {
                            hastext = true
                        }
                    }
                    return hastext
                }

                // 点击退出全屏
                function restore() {
                    // // 给予父元素属性
                    // $("[thisCode]").parents().each(function () {
                    // this.removeAttribute("codeParents", "codeParents")
                    // });
                    // // 给予属性
                    // i.removeAttribute("thisCode", "thisCode")

                    btnE.style.display = "none";
                    btnB.style.display = "block";
                    i.classList.remove("isfull");
                    codeL.style.setProperty("padding", "10px 10px 10px 16px", "important");
                    document.querySelector("#toc-bar").style.display = "block";
                    document.querySelector("[wenwen='title']").style.display = "block";
                    stylel.innerText = "";
                    // document.body.style.removeProperty("padding-top");

                    if (scrollEle && originalScrollPosition && originalScrollPosition != 0 && originalScrollPosition != scrollEle.scrollTop) {
                        scrollEle.scrollTop = originalScrollPosition;
                    }
                }

                // 获取代码语言类型
                function getLang(node) {
                    let className = node.className || '';
                    let language = (className.match(/language-(\S+)/) || [null, ''])[1] || (className.match(/hljs (\S+)/) || [null, ''])[1] || node.getAttribute("language") || node.getAttribute("lang") || "";

                    let hljsNode = node.querySelector("code.hljs")

                    // if (!language) {
                    if (!language && hljsNode) {
                        // hljs
                        // language = node.querySelector("code.hljs").classList[1]
                        language = (hljsNode.className.match(/language-(\S+)/) || [null, ''])[1] || (hljsNode.className.match(/hljs (\S+)/) || [null, ''])[1];
                        hljsNode.className = ""
                    }

                    if (!language && node.querySelector("[class*='lang-' i]")) {
                        language = (node.querySelector("[class*='lang-' i]").className.match(/lang-(\S+)/) || [null, ''])[1];
                    }
                    if (!language && node.querySelector(":is(pre,code)[class*='language-' i]")) {
                        language = (node.querySelector(":is(pre,code)[class*='language-' i]").className.match(/language-(\S+)/) || [null, ''])[1];
                    }

                    if (!language && node.querySelector("[language]")) {
                        language = node.querySelector("[language]").getAttribute("language")
                    }

                    if (!language && node.querySelector("[lang]")) {
                        language = node.querySelector("[lang]").getAttribute("lang")
                        node.querySelector("[lang]").removeAttribute("lang");
                    }
                    // }
                    return language.replace("language-", "");
                }

                // 代码染色操作
                function codehighlight() {
                    if (custom) {  //自主手动染色
                        // 补全
                        switch (lang.value.trim()) {
                            case "js":
                                codeL.innerText = js_beautify(codeL.innerText);
                                lang.value = "javascript"
                                break;
                            case "html":
                            case "ht":
                                lang.value = "html"
                                codeL.innerText = html_beautify(codeL.innerText);
                                break;
                            case "css":
                                codeL.innerText = css_beautify(codeL.innerText);
                                break;
                            case "json":
                                lang.value = "json"
                                try {
                                    let jsonObj = JSON.parse(codeL.innerText)
                                    codeL.innerText = JSON.stringify(jsonObj, null, 4)
                                } catch (error) {
                                    // lang.value = preLang;
                                    // codeL.setAttribute("language", preLang)
                                    codeL.innerHTML = preHtml;
                                    // return;
                                }
                                break;
                            case "ts":
                                lang.value = "typescript"
                                break;
                        }
                        codeL.className = "hljs " + lang.value.trim();
                        hljs.highlightBlock(codeL);
                        reColorWhenNoBR()
                        // 更新代码语言
                        codeL.setAttribute("language", lang.value.trim())
                    } else {
                        // 自动识别染色
                        hljs.highlightBlock(codeL);
                        // 更新代码语言
                        lang.value = codeL.classList[1];
                        codeL.setAttribute("language", lang.value.trim())
                        switch (lang.value.trim()) {   //根据语言类型进行格式化
                            case "js":
                            case "ts":
                            case "javascript":
                            case "typescript":
                                codeL.innerText = js_beautify(codeL.innerText);
                                break;
                            case "html":
                            case "xml":
                                codeL.innerText = html_beautify(codeL.innerText);
                                break;
                            case "css":
                                codeL.innerText = css_beautify(codeL.innerText);
                                break;
                            case "json":
                                try {
                                    let jsonObj = JSON.parse(codeL.innerText)
                                    codeL.innerText = JSON.stringify(jsonObj, null, 4)
                                } catch (error) {
                                    codeL.innerHTML = preHtml;
                                }
                                break;
                        }
                        // 根据语言类型再次染色
                        hljs.highlightBlock(codeL);
                    }
                }

                // 染色处理
                function HiLight(i) {
                    // 二次染色时清空格式化带来的格式变动
                    codeL.innerHTML = preHtml;
                    // 二次染色时清空代码之外的文字
                    btnC.innerHTML = "";
                    btnB.innerHTML = "";
                    btnE.innerHTML = "";
                    // 去除旧的样式
                    // i.className = ""

                    if (!i.querySelector("table")) {
                        color = true;
                        // console.log(i);
                        // console.log(i.innerText);

                        // let webSiteReg = new RegExp('((http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?)|((www.)|[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?)', 'g');
                        // let wenText = wenzhangzhuti.innerText
                        // wenText = wenText.replace(webSiteReg, "<a href='$1' target='_blank'>$1</a>");

                        // 文本模式
                        // let matchs = undefined;
                        // if (!i.querySelector("[class*='com']")) {

                        // 解决多个换行问题
                        // codeL.innerHTML = codeL.innerHTML.replace(/<br><br>/g, "<br>").replace(/<br><br>/g, "<br>")
                        let pattern = /\n[ ]{0,}\n/g;
                        // if (codeL.innerText.match(pattern)) {
                        codeL.innerText = codeL.innerText.replace(pattern, "\n");
                        codeL.innerText = codeL.innerText.replace(/[\n]{2}/g, "\n");

                        // // 避嫌，防止误杀
                        // codeL.innerText = codeL.innerText
                        //     .replace(/</g, "&lt;")
                        //     .replace(/>/g, "&gt;")

                        // codeL.innerHTML = codeL.innerHTML
                        //     .replace(/</g, "&lt;")
                        //     .replace(/>/g, "&gt;")
                        //     .replace(/&lt;br&gt;&lt;br&gt;/g, "<br>")
                        //     .replace(/&lt;br&gt;/g, "<br>");

                        // // 还原
                        // codeL.innerText = codeL.innerText
                        //     .replace(/&lt;/g, "<")
                        //     .replace(/&gt;/g, ">")

                        // 清空(去除)语言设定
                        if (i.classList.length) {
                            for (const iterator of i.classList) {
                                if (iterator.indexOf("lang") != -1) {
                                    i.classList.remove(iterator)
                                }
                            }
                        }
                        i.className.replace(/hljs (\S+)/, "")
                        for (const iterator of i.querySelectorAll("code")) {
                            iterator.className = "";
                        }


                        // 解决行注释边界混淆问题
                        let pattC =
                            /(^(\# |\/\/){1}|([^:'"A-Za-z0-9\-]\# |[^:'"A-Za-z0-9\-]\/\/){1})((.){0,})[ ]{0,}/g;
                        // let pattC = /(^(\#|\/\/){1}|([\s ;\{\}\)`]\#|[\s ;\{\}\)`]\/\/){1})((.){2,})[ ]{0,}/g
                        let matchs = codeL.innerText.match(pattC);

                        // codeL.innerHTML = code.innerText.replace(pattC, "<span comment>/*$2*/</span><br>")

                        // 删除位于首位的换行和首尾空格
                        // if (codeL.innerText.indexOf("\n") == 0) {
                        //     codeL.innerText = codeL.innerText.replace(/\n/, "")
                        // }

                        if (matchs) {   // 有代码行注释
                            // 若疑似html代码,含有标签，不篡改innerHtml，避免引起html代码被渲染成了元素，只改innerText
                            // if (i.innerText.indexOf(">") != -1 && i.innerText.indexOf("<") != -1) {
                            if (i.innerText.trim().indexOf("<") == 0) {
                                codeL.className = "hljs html";
                            }

                            // 防止套娃（块注释里面出现//）
                            let pattCC = /(\/\*|<!--)([\s\S]*?)(\*\/|-->)/g;
                            // let pattCC = /(\/\*|<!--)([\s\S]*?)(\*\/|-->)\s/g;
                            // let pattCC = /(\/\*|<!--)(.){0,}(\*\/|-->)/g;

                            let CCmatchs = codeL.innerText.match(pattCC) || [];
                            codeL.innerText = codeL.innerText.replace(
                                pattCC,
                                "/*placeholderplaceholder*/"
                            );

                            // 添加空格间隔隔断
                            codeL.innerText = codeL.innerText.replace(/([{},;\(\)])\/\//g, "$1 //");
                            // 匹配行注释，替换占位
                            matchs = codeL.innerText.match(pattC) || [];
                            codeL.innerText = codeL.innerText.replace(
                                pattC,
                                "/*placeholder*/"
                            );

                            // codeL.innerText = !codeL.innerText.includes("\n") && preText.includes("\n") ? preText : codeL.innerText

                            if (!codeL.innerText.includes("\n") && preText.includes("\n")) {  // 没有换行，修改innerText走不通
                                matchs = []
                                codeL.innerHTML = "<div>" + preText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, "</div><br><div>") + "</div>";
                                for (const div of codeL.querySelectorAll("div")) {
                                    let CC = div.innerText.match(pattCC)
                                    if (CC) {
                                        CCmatchs = CCmatchs.concat(CC)
                                        div.innerText = div.innerText.replace(
                                            pattCC,
                                            "/*placeholderplaceholder*/"
                                        );
                                    }
                                    div.innerText = div.innerText.replace(/([{},;\(\)])\/\//g, "$1 //");

                                    let C = div.innerText.match(pattC)
                                    if (C) {
                                        matchs = matchs.concat(C)
                                        div.innerText = div.innerText.replace(
                                            pattC,
                                            "/*placeholder*/"
                                        );
                                    }

                                }
                                // CCmatchs去重
                                CCmatchs = [...new Set([...CCmatchs])]
                            }

                            console.log("有行注释的代码，重构完成");
                            console.log("");

                            // 染色操作
                            codehighlight()

                            // 还原占位
                            let comSpans = i.querySelectorAll(".hljs-comment:not(.hljs-comment .hljs-comment)");
                            if (
                                (matchs && comSpans.length < matchs.length) ||
                                (CCmatchs && comSpans.length < CCmatchs.length)
                            ) {
                                //失败，还原
                                console.log("注释标签数量不合，还原");
                                console.log(codeL.innerText);
                                if (precolorkinds > 3) { //有染色的，还原html
                                    codeL.innerHTML = preHtml;
                                } else {
                                    codeL.innerText = preText;
                                    codehighlight()
                                }
                            } else {
                                //成功
                                let index = 0;
                                let CCindex = 0;
                                for (const iterator of comSpans) {
                                    if (iterator.innerText == "/*placeholder*/") {
                                        iterator.innerText = matchs[index];
                                        index++;
                                    }
                                    if (CCmatchs) {
                                        if (iterator.innerText == "/*placeholderplaceholder*/") {
                                            iterator.innerText = CCmatchs[CCindex];
                                            CCindex++;
                                        }
                                    }
                                }

                                if (codeL.innerText.indexOf("/*placeholder") != -1) {
                                    console.log("占位注释placeholder无法染色，还原");
                                    console.log(codeL.innerText);
                                    //失败，还原
                                    if (precolorkinds > 3) { //有染色的，还原html
                                        codeL.innerHTML = preHtml;
                                    } else {
                                        codeL.innerText = preText;
                                        codehighlight()
                                    }

                                }
                            }
                            // }
                            // else { //非html语言，篡改innerhtml
                            //     // for (const iterator of i.querySelectorAll("code")) {
                            //     //     iterator.className = "hljs javascript"
                            //     // }

                            //     codeL.innerHTML = codeL.innerText.replace(pattC, "<span comment>/* */</span>")

                            //     hljs.highlightBlock(i.querySelector("code"))

                            //     // 还原占位
                            //     let comSpans = i.querySelectorAll("[comment]")
                            //     if (comSpans.length) {
                            //         for (let index = 0; index < comSpans.length; index++) {
                            //             comSpans[index].innerText = matchs[index]
                            //             comSpans[index].setAttribute("class", "hljs-comment")
                            //             // if (comSpans[index].innerText.indexOf("//www.") == 0) {
                            //             //     comSpans[index].className = ""
                            //             // }
                            //         }

                            //     }
                            // }
                        } else {
                            // 无代码行注释，免除顾忌
                            codehighlight()
                        }

                        // 误染还原
                        let rep = /(www\.|\.com)/g;
                        let iscomSpans = i.querySelectorAll(".hljs-comment:not(.hljs-comment .hljs-comment)");
                        for (const iterator of iscomSpans) {
                            if (rep.test(iterator.innerText)) {
                                iterator.className = "";
                            }
                        }

                        // 若自动染色后不理想，还原原状
                        if (!custom) {
                            reColorWhenNoBR()

                            let rough = precolorkinds >= colorkinds().length
                            if (rough && colorDeep) {
                                let autoLang = lang.value
                                console.log("自动染色语言:" + autoLang);
                                console.log("自动染色后" + (rough ? "更粗糙，" : "") + "还原原状:");
                                codeL.className = ""
                                lang.value = preLang;
                                codeL.setAttribute("language", preLang)
                                codeL.innerHTML = preHtml;
                                console.log(preText)
                                // 若原先有语言类型设定
                                if (preLang && autoLang != preLang) {
                                    console.log("按原有语言类型染色");
                                    codeL.className = "hljs " + preLang;
                                    hljs.highlightBlock(codeL);
                                    console.log("原：" + precolorkinds + "现：" + colorkinds().length);
                                    // 若还是粗糙，则还原原状
                                    if (precolorkinds >= colorkinds().length) {
                                        console.log("按原有语言类型染色后更粗糙，还原原状");
                                        codeL.className = ""
                                        lang.value = preLang;
                                        codeL.setAttribute("language", preLang)
                                        codeL.innerHTML = preHtml;
                                    }
                                }
                            }
                        }


                        // 背景
                        // i.style.setProperty("background-color", "black", "important");

                    }
                    btnC.innerHTML = "Copy";
                    btnB.innerHTML = "Full";
                    btnE.innerHTML = "Esc";

                }

                // 代码颜色种类
                function colorkinds() {
                    let ColorKinds = [];
                    let SpanClassList = [];
                    let spanKinds = i.querySelectorAll("span");
                    for (const iterator of spanKinds) {
                        if (
                            SpanClassList.indexOf(iterator.className) == -1 &&
                            iterator.className.length
                        ) {
                            SpanClassList.push(iterator.className);
                        }
                    }

                    if (SpanClassList) {
                        for (const iterator of SpanClassList) {
                            let element;
                            let eles = i.getElementsByClassName(iterator)
                            for (const iterator of eles) {
                                if (hasText(iterator)) {
                                    element = iterator
                                }
                            }
                            if (!element) {
                                continue;
                            }
                            let color = window.getComputedStyle(element, null).getPropertyValue('color'); //获取颜色值
                            if (color && ColorKinds.indexOf(color) == -1) {
                                ColorKinds.push(color);
                                console.log("%c" + iterator + ":" + color, "color:" + color);
                            }
                        }
                    }

                    let styColors = i.querySelectorAll("span[style*='color']:not([class])")
                    if (styColors.length) {
                        for (const iterator of styColors) {
                            let color = iterator.style.color
                            if (hasText(iterator) && ColorKinds.indexOf(color) == -1) {
                                ColorKinds.push(color);
                            }
                        }
                    }

                    let codeLcolor = window.getComputedStyle(codeL, null).getPropertyValue('color')
                    if (hasText(codeL) && codeLcolor && ColorKinds.indexOf(codeLcolor) == -1) {
                        ColorKinds.push(codeLcolor);
                        console.log("%ccodeLcolor:" + codeLcolor, "color:" + codeLcolor);
                    }

                    return ColorKinds;
                }


                // 格式化
                function getBeautifyCode(el) {
                    if (!el || !el.innerText) return "";
                    let code = el.innerText || "";
                    let className = el.classList ? el.classList.value || "" : "";
                    if (className.indexOf("html") !== -1) {
                        code = html_beautify(code);
                        // .replace(/</g, '&lt;')
                        // .replace(/>/g, '&gt;')
                    }
                    if (className.indexOf("css") !== -1) {
                        code = css_beautify(code);
                    }
                    if (className.indexOf("javascript") !== -1) {
                        code = js_beautify(code);
                    }

                    return code;
                }

                // 染色后不换行则重新染色
                function reColorWhenNoBR() {
                    let notNewLine = codeL.innerText.trim().match(/\n/g) == null && preText.trim().match(/\n/g) != null
                    if (notNewLine) {   //自动染色后不换行时补救
                        console.log("不换行，进行补救:")
                        console.log(codeL.innerText)
                        console.log("原代码:")
                        console.log(preText)
                        if (!custom) {
                            codeL.className = ""
                            // lang.value = preLang;
                            // codeL.setAttribute("language", preLang)
                        }
                        let pattern = /\n[ ]{0,}\n/g;
                        codeL.innerHTML = "<div>" + preText.replace(pattern, "\n").replace(/[\n]{2}/g, "\n").replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, "</div><br><div>") + "</div>";

                        hljs.highlightBlock(codeL);

                        if (!custom) {
                            // 更新代码语言
                            lang.value = getLang(i);
                            codeL.setAttribute("language", lang.value)
                        }
                    }
                    notNewLine = codeL.innerText.trim().match(/\n/g) == null && preText.trim().match(/\n/g) != null
                    if (notNewLine) {
                        console.log(codeL.innerText)
                        console.log("自动染色语言:" + lang.value);
                        console.log("自动染色后" + (notNewLine ? "不换行，" : "") + "还原原状:");
                        codeL.className = ""
                        lang.value = preLang;
                        codeL.setAttribute("language", preLang)
                        codeL.innerHTML = preHtml;
                    }
                }



                /*               let codeStyle = window.getComputedStyle(i, null); //获取code最终样式
                              let codeLbgcolor = codeStyle.getPropertyValue('background-color'); //获取code背景颜色
                              let RgbValueArry = codeLbgcolor.replace(/[rgba\(\)]/g, "").split(",")
                              let $grayLevel = RgbValueArry[0] * 0.299 + RgbValueArry[1] * 0.587 + RgbValueArry[2] * 0.114;
                              if ($grayLevel >= 130 || /rgba\((.){0,}0\)/.test(codeLbgcolor)) {
                                  console.log("原code浅色")
                              } else {
                                  console.log("原code深色")
                                  codeL.style.setProperty("background", "black", "important");
                                  if (!hasCodeDiv) {
                                      i.style.setProperty("background", "none", "important");
                                  }

                              } */
            }

        }
        // 循环结束


        // 复制代码默认样式
        let stylem = document.createElement("style");
        stylem.setAttribute("defstyle", "tttt");
        document.head.appendChild(stylem);
        stylem.innerText = /*css*/`
              pre code button {
              display: none !important;
              }

            [iscode] abc {
              all: initial;
              border: 1px;
              margin-bottom: -200px;
              float: right;
              position: relative;
              z-index: 4;
              display: flex;
              flex-direction: row;
              background:none!important
              }

            [wenwen] [iscode] abc :is(btn-c,btn-b,btn-e) {
              all: initial;
              cursor: pointer;
              width: 64px !important;
              padding: 0px!important;
              height: 35px !important;
              /*
              line-height: 35px !important;
              */
              text-align: center;
              color: white!important;
              font-family: Consolas!important;
              border-radius: 5px;
              border: 1px solid white!important;
              background-color: rgba(0,0,0,0.4) !important;
              margin-left: 3px;
              /* border: 1px;
              margin-bottom: -200px;
              float: right;
              position: relative;
              z-index: 4; */
              }

              btn-c :hover,btn-b :hover,btn-e :hover {
              cursor: pointer;
              color: white !important
              }

              .isfull abc {
              position: fixed;
              top: 20px;
              right: 30px;
              }


              html body .isfull pre{
              max-width: none!important;
              }

              [wenwen] .isfull [innercode]{
              /* height: 90vh;
              width: 90vw; */
              position: fixed!important;
              top: 0!important;
              bottom: 0!important;
              left: 0!important;
              right: 0!important;
              z-index: 99999!important;
              overflow: auto!important;

              margin: 0!important
              }

              `;

        // GM_addStyle(style)
    }

    function titleTip() {
        // 溢出容器文本提示
        // $("#toc-bar a").each(function (index, item) {
        //     let containerLength = $(item).width();
        //     let textLength = item.scrollWidth;
        //     let text = $(item).html();
        //     if (textLength > containerLength) {
        //         $(item).attr("title", text);
        //     }
        // })
        let x = -240;
        let y = 20;
        let newtitle = '';
        $('#toc-bar a').mouseover(function (e) {
            let containerLength = this.clientWidth;
            let textLength = this.scrollWidth;
            newtitle = this.innerText;
            if (textLength <= containerLength) {
                return
            }
            let linkStyle = window.getComputedStyle(this, null);
            let linkColor = linkStyle.getPropertyValue('color');
            $('#toc-bar').append(`<div id="mytitle" wenwen></div>`);
            document.querySelector("#mytitle").innerText = newtitle
            // $('#mytitle').hide()   //先隐藏才能有逐渐显示效果
            $('body').append(`
            <style id="mytitlecss">
                #mytitle {
                    color:${linkColor}!important;
                    box-shadow:0px 0px 15px grey!important;
                }
            </style>`)

            let tocBar = document.querySelector("#toc-bar")
            let tocX = tocBar.getBoundingClientRect().left + document.documentElement.scrollLeft;
            let tocY = tocBar.getBoundingClientRect().top + document.documentElement.scrollTop;

            $('#mytitle').css({
                'left': (e.pageX - tocX + x + 'px'),
                'top': (e.pageY - tocY + y + 'px'),
            }).fadeIn(500);

        }).mouseout(function () {
            $('#mytitle').remove();
            $("#mytitlecss").remove();
        }).mousemove(function (e) {
            let tocBar = document.querySelector("#toc-bar")
            let tocX = tocBar.getBoundingClientRect().left + document.documentElement.scrollLeft;
            let tocY = tocBar.getBoundingClientRect().top + document.documentElement.scrollTop;
            $('#mytitle').css({
                'left': (e.pageX - tocX + x + 'px'),
                'top': (e.pageY - tocY + y + 'px'),
            }).fadeIn(500);
        })

    }

    let bansync = false;
    let pageScroll = () => { };
    // 节流
    function throttle(fn, delay) {
        let flag = true;
        return function () {
            if (flag) {
                setTimeout(() => {
                    fn.call(this)
                    flag = true;
                }, delay);
            }
            flag = false;
        }
    }

    // 滚动
    function scrollToc() {
        let tocDiv = document.querySelector(".toc-bar__toc")
        let tocTop = tocDiv.getBoundingClientRect().top + document.documentElement.scrollTop
        let tocBott = tocTop + tocDiv.offsetHeight;

        // 获取active状态的li
        let activeLink = tocDiv.querySelector(".is-active-link")
        let activeLinkTop = activeLink.getBoundingClientRect().top + document.documentElement.scrollTop
        let activeLinkBott = activeLinkTop + activeLink.offsetHeight;

        if (activeLinkTop < tocTop + 140) {  //activeLink将在顶部溢出，需要上滚
            // tocDiv.scrollTop = tocDiv.scrollTop - (tocTop - activeLinkTop) - 240;
            $(".toc-bar__toc").animate(
                {
                    scrollTop: tocDiv.scrollTop - (tocTop - activeLinkTop) - 240
                },
                300
            );
        }

        if (activeLinkBott > tocBott - 140) { //activeLink将在底部溢出，需要下滚
            // tocDiv.scrollTop = tocDiv.scrollTop + (activeLinkBott - tocBott) + 240
            $(".toc-bar__toc").animate(
                {
                    scrollTop: tocDiv.scrollTop + (activeLinkBott - tocBott) + 240
                },
                300
            );
        }

    }

    function syncToc() {
        let tocDiv = document.querySelector(".toc-bar__toc")
        if (tocDiv.offsetHeight < tocDiv.scrollHeight) {
            //页面滚动scroll事件
            pageScroll = throttle(function () {
                if (!bansync) {
                    // console.log("目录同步");
                    scrollToc()
                }
            }, 300)

            window.onscroll = pageScroll;

            // 防止toc滚动影响window滚动
            /*            let toc = document.querySelector("#toc-bar");
                       toc.onmouseenter = function () {
                           $('body').append(`
                           <style id="scrollbar">
                               [wenwen='parents']{
                                   overflow: hidden!important;
                               }
                           </style>`)
                           // toc位移一个滚动条的宽度
                           toc.style.right = parseFloat(toc.style.right.replace("px", "")) + 14 + "px"
                       }

                       toc.onmouseleave = function () {
                           $("#scrollbar").remove();
                           // toc位移一个滚动条的宽度
                           toc.style.right = parseFloat(toc.style.right.replace("px", "")) - 14 + "px"
                       } */

            /*            function preventDefault(e) {
                           console.log(e.target.tagName);
                           if (e.target.tagName != "A") {
                               e.preventDefault();
                           }

                       }
                       function preventDefaultForScrollKeys(e) {
                           if (e.target.tagName == "BODY") {
                               if (keys[e.keyCode]) {
                                   preventDefault(e);
                                   return false;
                               }
                           }
                       }
                       let supportsPassive = false;
                       try {
                           window.addEventListener("test", null, Object.defineProperty({}, "passive", {
                               get: function () {
                                   supportsPassive = true;
                               },
                           })
                           );
                       } catch (e) { }
                       const wheelOpt = supportsPassive ? { passive: false } : false;
                       const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

                       let toc = document.querySelector("#toc-bar");
                       let body = document.querySelector("body");
                       toc.onmouseenter = function () {
                           // 禁止页面滚动
                           console.log("禁止页面滚动");
                           body.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
                           body.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
                           body.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
                           body.addEventListener("keydown", preventDefaultForScrollKeys, false);
                       }
                       toc.onmouseleave = function () {
                           // 允许页面滚动
                           console.log("允许页面滚动");
                           body.removeEventListener("DOMMouseScroll", preventDefault, false);
                           body.removeEventListener(wheelEvent, preventDefault, wheelOpt);
                           body.removeEventListener("touchmove", preventDefault, wheelOpt);
                           body.removeEventListener("keydown", preventDefaultForScrollKeys, false);
                       } */
            // let toc = document.querySelector("#toc-bar");
            tocDiv.onmouseenter = function () {
                // console.log("tocDiv.onmouseenter");
                bansync = true;
            }
            tocDiv.onmouseleave = function () {
                // console.log("tocDiv.onmouseleave");
                bansync = false
            }

            let eventType = "mousewheel";
            if (document.mozHidden) {
                eventType = "DOMMouseScroll";
            }
            tocDiv.addEventListener(eventType, function (e) {
                // console.log("目录在滚动");
                $('#mytitle').remove();
                $("#mytitlecss").remove();

                let event = window.e || e;
                let delta = event.wheelDelta ? event.wheelDelta : -(event.detail);
                let scrollTop = this.scrollTop;
                let offsetHeight = this.offsetHeight;
                let scrollHeight = this.scrollHeight;
                if ((delta > 0 && Math.floor(scrollTop) <= 0) || (delta < 0 && Math.ceil(scrollTop) >= scrollHeight - offsetHeight)) {
                    // console.log("禁止页面滚动");
                    this.scrollTop = delta > 0 ? 0 : scrollHeight;
                    if (event.preventDefault)
                        event.preventDefault();
                    else {
                        event.returnValue = false
                    }

                }
            }, false)


            /*             $.fn.scrollUnique = function() {
                            return $(this).each(function() {
                                let eventType = 'mousewheel';
                                // 火狐是DOMMouseScroll事件
                                if (document.mozHidden !== undefined) {
                                    eventType = 'DOMMouseScroll';
                                }
                                $(this).on(eventType, function(event) {
                                    // 一些数据
                                    let scrollTop = this.scrollTop,
                                        scrollHeight = this.scrollHeight,
                                        height = this.offsetHeight;
                                    let delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);
                                    if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                                        // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                                        this.scrollTop = delta > 0? 0: scrollHeight;
                                        // 向上滚 || 向下滚
                                        event.preventDefault();
                                    }
                                });
                            });
                        };
                        $(".toc-bar__toc").scrollUnique();
             */
        }
    }

    // 文章去除遮挡物
    let ListenNum = 0;
    let banListen = false;
    function removeCovers() {
        // 监听页面元素变化，自动刷新组件列表
        // Firefox和Chrome早期版本中带有前缀
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        // 选择目标节点
        let target = wenzhangzhuti;
        // 创建观察者对象

        let observer = new MutationObserver(function (mutations) {

            if (ListenNum > 0 || banListen) {
                observer.disconnect();
                console.log("终止元素监听");
                return;
            }
            mutations.forEach(function (mutation) {
                console.log(mutation);
                // 检测到变化后执行的动作
                if (mutation.type == "childList" && mutation.addedNodes) {
                    for (const e of mutation.addedNodes) {
                        console.log(e);
                        if (e.nodeType == 1 && parseInt($(e).css('z-index')) > 999999) {
                            e.style.setProperty("display", "none", "important");
                            observer.disconnect();
                            console.log("终止元素监听");
                        }
                    }
                }
            });
            ListenNum++;
            console.log("元素监听函数执行次数" + ListenNum);

        });
        // 配置观察选项: 监听后代元素变化
        let config = {
            childList: true,
            subtree: true,
        }
        // 传入目标节点和观察选项
        observer.observe(target, config);
        // 随后,你还可以停止观察
        // setTimeout(observer.disconnect(), 20000)
        // observer.disconnect();

        console.log("去除文章遮挡");
    }

    // 目录定位跟随锚点位置
    function followMao() {
        let Maos = document.querySelectorAll("[id*='tocbar']")
        for (const item of Maos) {
            let Htop = item.getBoundingClientRect().top
            if (Htop > 0.25 * window.screen.availHeight && Htop < 0.75 * window.screen.availHeight) {

                $(".is-active-link").removeClass('is-active-link');
                let href = item.getAttribute("id")
                let tocS = "[href*='" + href + "']"
                $(tocS).addClass("is-active-link")

                return
            }
        }

    }

    // 设置背景高度
    function setParentH() {
        if (wenzhangzhuti && openM) {
            styleH.innerText = `
            [wenwen*='parents']{
                height:${wenzhangzhuti.offsetHeight + 300}px!important;
            }
            `
        } else {
            styleH.innerText = ``
        }
    }

    let toc;
    let refreshElement;
    function insertToc() {
        // 创建新的 <div> 元素
        toc = document.createElement('div');
        toc.id = 'toc-bar';
        toc.className = 'toc-bar';
        toc.style.top = '0px';
        toc.style.right = '0px';

        document.body.prepend(toc);

        toc.innerHTML = /*html*/`
            <div class="toc-bar__header">
                <div class="shang flex">
                    <div class="flex toc-bar__header-left">
                        <div class="toc-bar__toggle">
                        <svg t="1692177692390" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3808" width="48" height="48"><path d="M918.187 140.16H309.973c-37.44 0-68.16 30.72-68.16 68.16s30.72 68.16 68.16 68.16h608.214c37.44 0 68.16-30.72 68.16-68.16s-30.72-68.16-68.16-68.16z m0 304H309.973c-37.44 0-68.16 30.72-68.16 68.16s30.72 68.16 68.16 68.16h608.214c37.44 0 68.16-30.72 68.16-68.16s-30.72-68.16-68.16-68.16z m0 306.667H309.973c-37.44 0-68.16 30.72-68.16 68.16s30.72 68.16 68.16 68.16h608.214c37.44 0 68.16-30.72 68.16-68.16s-30.72-68.16-68.16-68.16z m-813.547-609.6c-37.013 0-67.2 30.293-67.2 67.2v1.92c0 37.013 30.293 67.2 67.2 67.2 37.013 0 67.2-30.294 67.2-67.2v-1.92c0-36.907-30.187-67.2-67.2-67.2z m0 304c-37.013 0-67.2 30.293-67.2 67.2v1.92c0 37.013 30.293 67.2 67.2 67.2 37.013 0 67.2-30.294 67.2-67.2v-1.92c0-36.907-30.187-67.2-67.2-67.2z m0 306.666c-37.013 0-67.2 30.294-67.2 67.2v1.92c0 37.014 30.293 67.2 67.2 67.2 37.013 0 67.2-30.293 67.2-67.2v-1.92c0-36.906-30.187-67.2-67.2-67.2z" fill="#000000" p-id="3809"></path></svg>

                        </div>
                        <div class="toc-bar__title ">TOC Bar</div>
                        <div id="butO" class="but">Open</div>
                        <div id="butC" class="but">Close</div>
                    </div>
                    <div class="toc-bar__actions ">
                        <div class="toc-bar__refresh toc-bar__icon-btn" title="refresh">
                        <svg t="1692177782998" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5097" width="48" height="48"><path d="M684.032 403.456q-17.408-8.192-15.872-22.016t11.776-22.016q3.072-2.048 19.968-15.872t41.472-33.28q-43.008-49.152-102.4-77.312t-129.024-28.16q-64.512 0-120.832 24.064t-98.304 66.048-66.048 98.304-24.064 120.832q0 63.488 24.064 119.808t66.048 98.304 98.304 66.048 120.832 24.064q53.248 0 100.864-16.896t87.04-47.616 67.584-72.192 41.472-90.624q7.168-23.552 26.624-38.912t46.08-15.36q31.744 0 53.76 22.528t22.016 53.248q0 14.336-5.12 27.648-21.504 71.68-63.488 132.096t-99.84 103.936-128.512 68.096-148.48 24.576q-95.232 0-179.2-35.84t-145.92-98.304-98.304-145.92-36.352-178.688 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352q105.472 0 195.584 43.52t153.6 118.272q23.552-17.408 39.424-30.208t19.968-15.872q6.144-5.12 13.312-7.68t13.312 0 10.752 10.752 6.656 24.576q1.024 9.216 2.048 31.232t2.048 51.2 1.024 60.416-1.024 58.88q-1.024 34.816-16.384 50.176-8.192 8.192-24.576 9.216t-34.816-3.072q-27.648-6.144-60.928-13.312t-63.488-14.848-53.248-14.336-29.184-9.728z" p-id="5098" fill="#000000"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="toc-bar__toc">
                <ol class="toc-list ">
                </ol>
            </div>
        `
        refreshElement = toc.querySelector(".toc-bar__refresh");
        let tocList = toc.querySelector(".toc-list");
        let index = 1;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        for (const iterator of wenzhangheads) {
            let newLi = document.createElement('li');
            newLi.className = 'toc-list-item';

            let tagname = iterator.tagName
            let text = iterator.innerText
            iterator.setAttribute("id", "tocbar-" + index)
            newLi.innerHTML = /*html*/`
               <a href="#tocbar-${index}" class="toc-link node-name--${tagname}" target="_self">${text}</a>
            `
            tocList.appendChild(newLi)
            if (index === 1 && scrollTop === 0) {
                newLi.classList.add("is-active-li")
                newLi.querySelector(".toc-link").classList.add("is-active-link")
            }
            index++
        }

        //页面滚动scroll事件
        let currentSectionIndex = 0;
        let tocLinks = toc.querySelectorAll('a[href*="#tocbar-"]');
        window.addEventListener('scroll', function () {
            if (wenzhangheads.length > 0) {
                // 目录跟随浏览位置高亮
                for (let i = 0; i < wenzhangheads.length; i++) {
                    let rect = wenzhangheads[i].getBoundingClientRect();
                    if (rect.top <= 150) {
                        currentSectionIndex = i;
                    }
                }
                $(".is-active-link").removeClass('is-active-link');
                $(tocLinks[currentSectionIndex]).addClass("is-active-link")
            }
        });


        // 刷新
        refreshElement.addEventListener("click", () => {
            // 复原文章主体
            if (preTitle && preTitle == document.title && preWenText.trim()) {
                wenzhangzhuti.innerHTML = preWenHtml;
            }

            document.querySelector("[wenwen*='title']").remove();
            document.querySelector("#toc-bar").remove();
            document.querySelector("[tocstyle]").remove();
            document.querySelector("[bodystyle]").remove();

            for (const iterator of document.querySelectorAll(".codelang")) {
                iterator.remove();
            }

            // 添加的标题要还原
            /*             let appends = document.querySelectorAll("[head*='append']");
                        if (appends.length) {
                            for (const iterator of appends) {
                                iterator.parentElement.innerText = iterator.innerText;
                            }
                        } */



            // let attrs = document.querySelectorAll("[wenwen],[Ex],[head],[head2],[about],[myattr]")


            // 还原代码
            let index = 0;
            for (const iterator of document.querySelectorAll("[iscode]")) {
                iterator.outerHTML = preCodeHtmls[index]
                // 清除添加的元素属性
                // let attrList = ["notcode", "hascode", "highlight"];
                // for (const attr of attrList) {
                //     let eles = document.querySelectorAll("[" + attr + "]");
                //     if (eles.length) {
                //         for (const iterator of eles) {
                //             iterator.removeAttribute(attr);
                //         }
                //     }
                // }
                index++
            }
            document.querySelector("[codestyle]").remove();
            document.querySelector("[defstyle]").remove();
            // document.querySelector("[backstyle]").remove();

            // 整个页面内，添加的属性要去除
            let attrList = ["wenwen", "Ex", "head", "head2", "about", "myattr", "notcode", "hascode", "highlight", "maindiv"];
            for (const attr of attrList) {
                let eles = document.querySelectorAll("[" + attr + "]");
                if (eles.length) {
                    for (const iterator of eles) {
                        iterator.removeAttribute(attr);
                        if (
                            (attr == "head" || attr == "head2") &&
                            iterator.getAttribute("id")
                        ) {
                            iterator.removeAttribute("id");
                        }
                    }
                }
            }
            toc.remove()

            // 恢复全局变量默认值

            // 标记是否有标题
            hasOption = false;
            wenzhangheads = []
            // 标记是否有文章模块
            hasAtr = false;
            // 标记是否有标题
            hasTitle = false;
            // body是否有代码块
            bodycodenum = 0;
            //初选文章容器
            main = null;
            zhutiArry = [];
            zhutiArry2 = [];
            //终选文章最小容器
            wenzhangzhuti = null;

            num = 0; //记录getWen函数的执行次数
            preWenHtml = "";

            openM = false;
            preCodeHtmls = []

            bansync = false;
            pageScroll = () => { };

            // 文章去除遮挡物
            // ListenNum = 0;
            banListen = true;

            // 样式
            styleH.innerText = ""
            Style.innerText = ""


            CodeHL();
            mainFuc();
            setParentH();
            let tocDiv = document.querySelector(".toc-bar__toc")
            if (tocDiv.offsetHeight < tocDiv.scrollHeight) {
                //页面滚动scroll事件
                pageScroll = throttle(function () {
                    if (!bansync) {
                        // console.log("目录同步");
                        scrollToc()
                    }
                }, 300)
            }
            titleTip();
        });
    }

    // 标记是拖曳还是点击
    let isClick = true
    // 元素拖曳功能（实现防止与点击功能冲突）
    function suspensionBall(dragId) {
        let startEvt, moveEvt, endEvt
        // 判断是否支持触摸事件
        if ('ontouchstart' in window) {
            startEvt = 'touchstart'
            moveEvt = 'touchmove'
            endEvt = 'touchend'
        } else {
            startEvt = 'mousedown'
            moveEvt = 'mousemove'
            endEvt = 'mouseup'
        }
        // 获取元素
        let drag = document.getElementById(dragId)

        drag.style.cursor = 'move'


        let disX, disY, left, top, starX, starY

        drag.addEventListener(startEvt, function (e) {
            // 阻止页面的滚动，缩放
            e.stopPropagation()
            // 兼容IE浏览器
            e = e || window.event
            isClick = true
            // 手指按下时的坐标
            starX = e.touches ? e.touches[0].clientX : e.clientX
            starY = e.touches ? e.touches[0].clientY : e.clientY
            // starX = e.clientX
            // starY = e.clientY
            // 手指相对于拖动元素左上角的位置
            disX = starX - drag.offsetLeft
            disY = starY - drag.offsetTop
            // 按下之后才监听后续事件
            document.addEventListener(moveEvt, moveFun)
            document.addEventListener(endEvt, endFun)
        })

        function moveFun(e) {

            // 兼容IE浏览器
            e = e || window.event
            // 防止触摸不灵敏，拖动距离大于20像素就认为不是点击，小于20就认为是点击跳转
            if (
                Math.abs(starX - (e.touches ? e.touches[0].clientX : e.clientX)) > 20 ||
                Math.abs(starY - (e.touches ? e.touches[0].clientY : e.clientY)) > 20
                // Math.abs(starX - (e.clientX)) > 20 ||
                // Math.abs(starY - (e.clientY)) > 20
            ) {
                // 判断为拖动行为
                isClick = false
                butC.style.pointerEvents = 'none';
                butO.style.pointerEvents = 'none';
                refreshElement.style.pointerEvents = 'none';
            }
            left = (e.touches ? e.touches[0].clientX : e.clientX) - disX
            top = (e.touches ? e.touches[0].clientY : e.clientY) - disY
            // left = (e.clientX) - disX
            // top = (e.clientY) - disY
            // 限制拖拽的X范围，不能拖出屏幕
            if (left < 0) {
                left = 0
            } else if (left > document.documentElement.clientWidth - drag.offsetWidth) {
                left = document.documentElement.clientWidth - drag.offsetWidth
            }
            // 限制拖拽的Y范围，不能拖出屏幕
            if (top < 0) {
                top = 0
            } else if (top > document.documentElement.clientHeight - drag.offsetHeight) {
                top = document.documentElement.clientHeight - drag.offsetHeight
            }
            drag.style.left = left + 'px'
            drag.style.top = top + 'px'
        }

        function endFun(e) {
            butC.style.pointerEvents = 'auto';
            butO.style.pointerEvents = 'auto';
            refreshElement.style.pointerEvents = 'auto';

            // stopBubble(e);
            document.removeEventListener(moveEvt, moveFun)
            document.removeEventListener(endEvt, endFun)
            // if (isClick) { // 点击
            //     // event.preventDefault()
            // } else {
            //     e.preventDefault()
            // }
        }

    }


    // ----------------end TocBar -------------------

    // 主函数入口
    function mainFuc() {

        if (window.location.pathname === "/") {
            return;
        }
        // 排除代码编辑器
        // let editor = document.querySelectorAll(".CodeMirror");

        // if (editor.length == 1) {
        //     return;
        // }

        // inject style
        // GM_addStyle(TOC_BAR_STYLE)
        // $(document).ready(function () {
        // window.onload = function() {

        // 获取wenzhangzhuti
        getWen();

        // 去除文章遮挡物
        removeCovers()

        // 处理标题
        getTitle();

        // 生成toc元素
        insertToc();

        // 拖曳功能
        suspensionBall("toc-bar")

        // 处理导航跳转问题
        Navigation();

        // 目录跟随锚点
        // $(window).bind('scroll', followMao);

        // 处理页面链接
        handelLink();

        // 页面简洁处理
        clean();

        // 页面样式控制
        tocControl();

        // 插入固定样式
        // inject style
        // GM_addStyle(TOC_BAR_STYLE);
        Style.innerText = TOC_BAR_STYLE;

    }


    let time = 1500;
    switch (location.host) {
        case 'segmentfault.com':
            time = 2500;
            break;

        default:
            break;
    }

    // 文章父层高度样式
    let styleH = document.createElement("style")
    document.head.appendChild(styleH);
    // 固定样式
    let Style = document.createElement("style")
    document.head.appendChild(Style);
    setTimeout(function () {

        CodeHL();
        // 代码高亮样式
        GM_addStyle(GM_getResourceText("css"));

        mainFuc();

        // 文章主体样式基本定型
        setParentH()

        // 页面滚动同步toc
        syncToc()

        // 提示文字
        titleTip()

    }, time);

    // 页面加载完毕时机
    window.onload = function () {
        // 文章主体若已定义，则样式已定型
        setParentH()

    }


})();

