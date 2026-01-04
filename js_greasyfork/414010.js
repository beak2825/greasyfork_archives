// ==UserScript==
// @name         阅读全文、自动展开全文、自动移除万恶弹框
// @namespace    http://tampermonkey.net/
// @version      2.18.2
// @require      https://greasyfork.org/scripts/415668-zmquery3-5-1/code/zmQuery351.js?version=866815
// @description  【非自动关注】【自用，长期维护】【功能有】1. 阅读全文网站支持：CSDN、github.io、xz577.com、iteye.com、720ui.com、cloud.tencent.com、新浪、头条、网易新闻、腾讯新闻、51CTO、知乎、果壳科技（移动版）、awesomes.cn、javascriptcn.com、人民日报（移动版）、凤凰网、虎扑移动版、百度经验、360文档（个人图书馆）、乐居买房（移动版）、电子发烧友网（PC、移动版）、悟空问答（PC、移动版）、百家号、百度文章、简书移动版、搜狐移动版、goodreads（PC、移动版）、百度文库(移动、PC版)、36氪移动版、弟弟快看<br>备注： 反馈问题的小伙伴们请附加上有问题的网址链接哈
// @author       zhengmingliang
// @match        https://*.csdn.net/*
// @match        *://*.github.io/*
// @match        *://www.iocoder.cn/*
// @match        *://*.jianshu.com/p/*
// @match        *://m.sohu.com/a/*
// @match        *://*.xz577.com/*
// @match        *://*.javascriptcn.com/*
// @match        *://*.baidu.com/*
// @exclude      https://www.baidu.com/*
// @exclude      *://tieba.baidu.com/*
// @exclude      *://pan.baidu.com/*
// @exclude      *://wen.baidu.com/*
// @match        *://*.iteye.com/*
// @match        *://*.720ui.com/*
// @match        *://*.goodreads.com/book/show/*
// @match        *://www.wukong.com/question/*
// @match        *://cloud.tencent.com/developer/article/*
// @match        *://m.leju.com/*
// @match        *://*.didispace.com/*
// @match        *://*.sina.cn/*
// @match        *://*.toutiao.com/*
// @match        *://weibo.com/ttarticle/p/show*
// @match        *://card.weibo.com/article/m/show/id/*
// @match        *://3g.163.com/*
// @match        *://*.*.163.com/news/*
// @match        *://*.inews.qq.com/*
// @match        *://*.36kr.com/p/*
// @match        *://*.elecfans.com/*
// @match        *://inews.qq.com/*
// @match        *://xw.qq.com/*
// @match        *://blog.51cto.com/*
// @match        *://*.zhihu.com/question/*
// @match        *://*.guokr.com/*
// @match        *://*.awesomes.cn/*
// @match        *://*.javazhiyin.com/*
// @match        *://m.hupu.com/bbs/*
// @match        *://bugstack.cn/md/*
// @match        *://wap.peopleapp.com/article/*
// @match        *://jingyan.baidu.com/article/*
// @match        *://*.ifeng.com/c/*
// @match        *://*.360doc.com/content/*
// @match        *://www.hi-linux.com/posts/*
// @match        *://www.ddkk.com/zhuanlan/*
// @match        *://ddkk.com/zhuanlan/*
// @match        *://www.tapd.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414010/%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E3%80%81%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E3%80%81%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E4%B8%87%E6%81%B6%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/414010/%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E3%80%81%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E3%80%81%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E4%B8%87%E6%81%B6%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 阅读全文 规则1(openwrite.cn 插件规则)
     * @param readMoreSelector
     * @param contentSelector
     */
    function readAllRule1(readMoreSelector, contentSelector,isCurrent) {
        if ($$$(readMoreSelector).length > 0) {
            console.log("检测到有阅读全文关注限制。。。。")
            // 移除阅读全文
            if(isCurrent){
                $$$(readMoreSelector).remove();
            }else {
                $$$(readMoreSelector).parent().remove();
            }
            // 使滚动条可见
            // $$$("#article_content").css('overflow','auto')
            // 优化后：直接将style置为空
            console.log("style:%s", $$$(contentSelector).prop('style'))
            $$$(contentSelector).prop('style', '')
            $$$(contentSelector).attr('style', '')
            $$$(contentSelector).css('max-height', 'none')
            $$$(contentSelector).css('height', 'auto')
            $$$(contentSelector).css('overflow', 'visible')
            console.log("已解除阅读全文关注限制。。。。")
        }
    }

    /**
     * 阅读全文 规则1(openwrite.cn 插件规则)
     * @param readMoreSelector
     * @param contentSelector
     */
    function readAllRule1ByOrigin(readMoreSelector, contentSelector,removeCurrent) {
        var dom;
        var parentElement, contentElement;
        if (readMoreSelector.startsWith("#")) {
            dom = document.getElementById(readMoreSelector.substring(1))
            parentElement = removeCurrent ? dom : dom.parentElement;
        } else if (readMoreSelector.startsWith(".")) {
            dom = document.getElementsByClassName(readMoreSelector.substring(1))
            if (dom.length > 0) {
                parentElement = removeCurrent ? dom : dom[0].parentElement;
            }


        } else {
            dom = document.getElementsByTagName(readMoreSelector)
            parentElement = document.getElementsByClassName(readMoreSelector)[0].parentElement;
        }

        if (contentSelector.startsWith("#")) {
            contentElement = document.getElementById(contentSelector.substring(1))
            contentElement.style = ''
        } else if (contentSelector.startsWith(".")) {
            contentElement = document.getElementsByClassName(contentSelector.substring(1))
            contentElement[0].style = ''

        } else {
            contentElement = document.getElementsByTagName(contentSelector)
            contentElement[0].style = ''
        }
        console.log(111)
        parentElement.parentElement.removeChild(parentElement);
    }

    /**
     * 规则2：移除指定标签的某个class样式
     * @param readMoreSelector
     * @param removeSelector
     * @param removeClass
     */
    function readAllRule2(readMoreSelector, removeSelector, removeClass) {
        if ($$$(readMoreSelector).length > 0) {
            console.log("检测到有阅读全文关注限制。。。。")
            // 移除阅读全文
            $$$(readMoreSelector).remove();
            // 使滚动条可见
            // $$$("#article_content").css('overflow','auto')
        }

        if($$$(removeSelector).length > 0){
            // 优化后：直接将style置为空
            $$$(removeSelector).removeClass(removeClass)
            console.log("已解除阅读全文关注限制。。。。")
        }
    }

    /**
     *  直接点击展开
     * @param clickSelector
     */
    function readAllRule3(clickSelector) {
        var selector = $$$(clickSelector);
        if (!selector) {
            selector = jQuery(clickSelector);
        }
        if (selector.length > 0) {
            console.log("检测到有阅读全文关注限制。。。。")
            // 点击展开
            selector.trigger("click")
            console.log("已解除阅读全文关注限制。。。。")
        }
    }

    /**
     * 使用openwrite.cn策略的个人博客或其他使用类似的规则
     */
    function readAllRule4(removeSelector) {
        console.log("检测到有阅读全文关注限制。。。。")
        // 移除阅读全文
        $$$(removeSelector).parent().remove();
        var zIndexArray = [];
        var parentSelector = "div[style]"
        if ($$$("article[style]").length > 0) {
            parentSelector = "article[style]"
        }
        var flag = false
        //存放只有height属性的节点
        let heightArray = [];
        findElements();
        if (flag) {
            console.log("已解除阅读全文关注限制。。。")
        } else {

            if (parentSelector == "div[style]" && heightArray.length == 1) {
                heightArray[0].prop("style", "")
                console.log("已解除阅读全文关注限制。。。。")
            } else {
                parentSelector = "div[style]"
                heightArray = [];
                findElements();
                if (heightArray.length == 1) {
                    heightArray[0].prop("style", "")
                    console.log("已解除阅读全文关注限制。。。。。")
                }
            }
        }

        function findElements() {
            $$$(parentSelector).each(function (index) {
                var attr = $$$(this).attr('style');
                if (attr.indexOf("overflow") != -1 && attr.indexOf("height") != -1) {
                    var overflow = $$$(this).css("overflow");
                    if ('hidden' == overflow) {
                        $$$(this).prop("style", "")
                        flag = true
                    }
                } else if (attr.indexOf("height") != -1) {
                    console.log("index:", index, $$$(this))
                    heightArray.push($$$(this))
                }
                let text = $$$(this).text();
                if (attr.indexOf("z-index") != -1 && (text.indexOf("首次访问") != -1 || text.indexOf("人机检测") != -1)) {
                    let zIndex = $$$(this).css("z-index");
                    console.log("zIndex:", zIndex)
                    let lastDiv = $$$("div[style]").filter(function () {
                        return $$$(this).attr('style').indexOf("z-index") != -1 && $$$(this).css("z-index") == zIndex - 1
                    })
                    console.log("lastDiv:", lastDiv)
                    if (lastDiv && lastDiv.length > 0) {
                        lastDiv.remove();
                    }
                }

            })
        }
    }

    /**
     * java学习 javazhiyin.com
     */
    function removeFirstLayer() {
        if ($$$(".layui-layer-page").length > 0) {
            var text = $$$(".layui-layer-page").text();
            if (text.indexOf('首次访问') != -1 || text.indexOf('人机识别')) {

            }

            $$$(".layui-layer-page").remove();
            $$$(".layui-layer-shade").remove();
        }
        $$$("div[index]")

    }

    /**
     * 对layui或layer 样式进行重写，使其弹框进行隐藏
     */
   function addLayerCssStyle() {
       $$$("style").get(0).append(".layui-layer-shade{display:none !important} .layui-layer-page{display:none !important}")

    }
    function addLayerCssStyle2() {
       $$$("style").get(0).append(".layer-main{display:none !important}")

    }

    /**
     * 对class 样式进行重写，使滚动条显示
     */
   function addOverflowCssStyle(cssSelector) {
        console.log("style:%s", $$$(cssSelector).prop('style'))
        $$$(cssSelector).prop('style', '')
        $$$(cssSelector).attr('style', '')
        $$$(cssSelector).css('max-height', 'none')
        $$$(cssSelector).css('height', 'auto')
        $$$(cssSelector).css('overflow', 'visible')
    }

    /**
     * 对class 样式进行重写
     */
   function addDisplayStyle(cssSelector) {
       $$$(cssSelector).css("display","none");
       $$$(cssSelector).attr("style","display:none");
    }

    function addDisplayCssStyle() {
       $$$("style").get(0).append("article{opacity: 1 !important;display: block !important;}" +
           "#menu li{opacity: 1;display: block;}")

    }

    function removeAlertRule1() {
        $$$("div[style]").each(function (index) {
            let attr = $$$(this).attr('style');
            let text = $$$(this).text();
            if (attr.indexOf("z-index") != -1 && (text.indexOf("首次访问") != -1 || text.indexOf("人机检测") != -1)) {
                let zIndex = $$$(this).css("z-index");
                console.log("zIndex:", zIndex)
                let lastDiv = $$$("div[style]").filter(function () {
                    return $$$(this).attr('style').indexOf("z-index") != -1 && $$$(this).css("z-index") == zIndex - 1
                })
                console.log("lastDiv:", lastDiv)
                if (lastDiv && lastDiv.length > 0) {
                    lastDiv.remove();
                }
                $$$(this).remove();
                $$$('body').css("overflow", 'auto');
            }

        })

        readAllRule1("#locker",".lock",true)
    }

    /**
     * 公共阅读全文规则1： 查找当前页面所有div接单，判断其style属性是否包含特征值
     */
    function commonReadAllRule1() {
        $$$("div").each(function (index) {
            let attr = $$$(this).attr('style');
            if(attr){
                if (attr.indexOf("height") != -1 && attr.indexOf("overflow") != -1 && attr.indexOf("hidden") != -1) {
                    let id = $$$(this).attr('id');
                    let cls = $$$(this).attr('class');
                    let founded = false;
                    if(id){
                        console.log("检测到隐藏了全文的id：%s",id)
                        founded = true
                    }
                    if(cls){
                        console.log("检测到隐藏了全文的class：%s",cls)
                        founded = true
                    }

                    if(founded){
                        $$$(this).prop('style','')
                        $$$(this).attr('style','')
                    }

                }
            }

        })
    }

    /**
     * 公共移除dom节点
     */
    function commonRemoveRules1(selectors,isRemoveParent) {
        if ('string' == typeof (selectors)) {
            return commonRemoveRule1(selectors,isRemoveParent)
        }else {
            for (let index in selectors) {
                commonRemoveRule1(selectors[index],isRemoveParent)
            }
        }

    }

    /**
     * 公共查找节点名称
     */
    function commonFindRules1(keys) {
        let split = keys.split(",");
        let selector = $$$("div").filter(function (){
            let text = $$$(this).text();
            let flag = false;
            for (let i in split) {
                flag = text.indexOf(split[i]) && flag ;
            }
            return flag && $$$(this).children().length == 0
        })
        let id = selector.attr("id");
        if(id){
           return "#"+id;
        }
        let cls = selector.attr("class");
        if(cls){
           return "."+cls;
        }
        return selector;
    }

    function commonRemoveRule1(selector,isRemoveParent) {
        var $selector = $$$(selector);
        if($selector.length > 0){
            if(isRemoveParent){
                $selector.parent().remove();
            }else {
                $selector.remove();
            }
        }

    }

    /**
     * 公共隐藏
     * @param selectors
     * @param isRemoveParent
     */
    function commonHideRule1(selectors) {
        var selectorArray = selectors.split(",");
        for (let index in selectorArray) {
            if ($$$("style").length > 0) {
                $$$("style").get(0).append(selectorArray[index] + "{display:none !important}");
            }else {
                $$$("header").append("<style></style>");
                $$$("style").get(0).append(selectorArray[index] + "{display:none !important}");
            }
        }




    }
    var $$$ = $ || window._$ || zmQuery;
    var href = window.location.href

    function intervalReadAllRule2(checkSelector, removeSelector, removeClass) {
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(checkSelector).length > 0) {
                readAllRule2(checkSelector, removeSelector, removeClass)
                clearInterval(interval)
            }

        }, 1000)
    }

// csdn
    if (href.indexOf('csdn') != -1) {
        console.log("检测到CSDN。。。。")
        // 已登录
        readAllRule1("#btn-readmore-zk", "#article_content")
        // 未登录
        readAllRule1(".btn-readmore", "#article_content")
        // 移动端处理
        readAllRule1(".btn_mod", ".article_content")
        $$$("style").get(0).append(".passport-login-container{display:none !important} \r\n .login-mark{display:none !important}");

        // 处理未登录时不能复制代码的问题
        if ($$$('.hljs-button').attr('data-title') == '登录后复制') {
            $$$('.hljs-button').attr('data-title','复制(当前未登录)')
            // 将复制 按钮 的点击事件更换为copyCode
            $$$('code').attr('onclick','mdcp.copyCode(event)')
        }

        // 修改csdn 登陆按钮跳转逻辑 从 弹框改为 跳转到登录页
        $$$(".toolbar-btn-login").on('click',function (){
           window.location.href='https://passport.csdn.net/account/login'
        })
    } else if (href.indexOf('github.io') != -1) { //hoxis.github.io
        console.log("检测到github.io。。。。")
        readAllRule1("#read-more-btn", "#container")
        addDisplayCssStyle();
    }  else if (href.indexOf('jianshu.com') != -1) { //jianshu.com
        console.log("检测到jianshu.com。。。。")
        commonHideRule1(".download-app-guidance,.call-app-btn,#jianshu-header")
        readAllRule1(".close-collapse-btn", ".collapse-free-content",)
    }   else if (href.indexOf('m.sohu.com') != -1) { //m.sohu.com
        console.log("m.sohu.com。。。。")
        commonHideRule1(".lookall-box")
        readAllRule2("#artLookAll", ".hidden-content","hide")
        $$$(".content-image").each(function () {
            var src = $$$(this).data("src");
            $$$(this).attr("src",src);
            $$$(this).attr("data-lazy-load-completed","1");

        })
    }  else if (href.indexOf('jingyan.baidu.com') != -1) { //百度经验
        console.log("检测到百度经验。。。。")
        readAllRule2(".read-whole-mask", ".exp-content-container.fold","fold")

    } else if (href.indexOf('xz577') != -1) { //www.xz577.com
        console.log("检测到xz577。。。。")
        readAllRule1(".m-zk", "#mewsmian")
        // Your code here...
    } else if (href.indexOf('cloud.tencent.com') != -1) { //cloud.tencent.com
        console.log("检测到tencent。。。。")
        let interval = setInterval(function () {
            if ($$$(".cdc-expand-area__toggle").length > 0) {
                readAllRule1(".cdc-expand-area__toggle", ".cdc-expand-area__main", true)
                // readAllRule2(".com-markdown-collpase-toggle", ".com-markdown-collpase-hide", "com-markdown-collpase-hide")
                clearInterval(interval)
            }
        }, 1000)
        // Your code here...
    } else if (href.indexOf('bugstack.cn') != -1) { //虫洞栈
        console.log("检测到bugstack.cn。。。。")
        var count = 0;
        let interval = setInterval(function () {
            if ($$$("#read-more-mask").length > 0) {
                readAllRule1("#read-more-mask", ".theme-default-content")
                clearInterval(interval)
            }
            count ++;
            if(count > 50){
                clearInterval(interval)
            }
        }, 1000)
        // Your code here...
    } else if (href.indexOf('iteye.com') != -1) { //iteye.com
        console.log("检测到iteye.com。。。。")
        readAllRule3("#btn-readmore")
        // Your code here...
    } else if (href.indexOf('720ui.com') != -1) { // 720ui.com
        console.log("检测到720ui.com。。。。")
        readAllRule1("#read-more-btn", "#main")
    } else if (href.indexOf('360doc.com') != -1) { // 360doc
        console.log("检测到360doc.com。。。。")
        addOverflowCssStyle(".article_container")
        addDisplayStyle(".article_showall")
    } else if (href.indexOf('m.leju.com') != -1) { // 360doc
        console.log("检测到m.leju.com。。。。")
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".ztt_more").length > 0) {
                readAllRule1(".ztt_more", ".ztt_outer",true)
                clearInterval(interval)
            }
        }, 1000)
    }else if (href.indexOf('tapd.cn') != -1) { // tapd
        console.log("检测到tapd.cn。。。。")
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".company-renew-dialog").length > 0) {
                readAllRule1(".company-renew-dialog", ".company-renew-dialog",true)
                 readAllRule1(".v-modal", ".v-modal",true)
                clearInterval(interval)
            }
        }, 1000)
    } else if (href.indexOf('card.weibo.com') != -1) { // 微博
        console.log("检测到weibo.com。。。。")
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".f-art-opt").length > 0) {
                readAllRule1(".f-art-opt", ".f-art",true)
                clearInterval(interval)
            }
        }, 1000)
    } else if (href.indexOf('weibo.com') != -1) { // 微博
        console.log("检测到weibo.com。。。。")
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".artical_add_box").length > 0) {
                readAllRule1(".artical_add_box", ".WB_editor_iframe_new",true)
                clearInterval(interval)
            }
        }, 1000)
    } else if (href.indexOf('sina.cn') != -1) { // k.sina.cn
        console.log("检测到sina.cn。。。。")
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".unfold-btn1").length > 0) {
                readAllRule1ByOrigin(".unfold-btn1", ".main-body")
                clearInterval(interval)
            }else if ($$$(".ztt_more").length > 0) {
                readAllRule1ByOrigin(".ztt_more", ".ztt_outer",true)
                clearInterval(interval)
            }else if ($$$(".look_more_a").length > 0) {
                readAllRule1ByOrigin("#artFoldBox", ".s_card z_c1",true)
                clearInterval(interval)
            }
            commonRemoveRules1(".callApp_fl_btn")
        }, 1000)
    } else if (href.indexOf('toutiao') != -1) { // toutiao.com
        console.log("检测到toutiao。。。。")
        // 循环检测
        intervalReadAllRule2(".fold-btn", ".fold-btn-content", "fold-btn-content-fold");
        // document.removeEventListener('click',getEventListeners($$$(document).get(0)).click[0].listener)


    } else if (href.indexOf('3g.163.com') != -1) { // 3g.163.com
        console.log("检测到163.com。。。。")
        // 循环检测
       let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".expand_more").length > 0) {
                readAllRule1(".expand_more", "article")
                clearInterval(interval)
            }
            $$$(".article_comment").css("display","block")
        }, 1000)

    }  else if (href.indexOf('baijiahao') != -1|| href.indexOf('mbd.baidu.com') != -1) { // 百度文章
        console.log("检测到百家号。。。。")
        // 循环检测
       let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".oPadding").length > 0) {
                readAllRule1(".oPadding", ".mainContent",true)
                $$$(".scrollHide").removeClass("scrollHide");
                clearInterval(interval)
            }
            if ($$$(".height-fold").length > 0) {
                readAllRule1(".height-fold", ".dynamic-item",true)
                $$$(".scrollHide").removeClass("scrollHide");
                clearInterval(interval)
            }
        }, 1000)
        addLayerCssStyle2();
    }  else if (href.indexOf('wenku.baidu.com') != -1) { // 百度文库PC版
        console.log("检测到百度文库。。。。")
        // 循环检测
       let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$("#reader-container").length > 0) {
                $$$("#reader-container").css("height","fit-content");
                commonHideRule1(".try-end-fold-page")
                clearInterval(interval)
            }
        }, 1000)
    } else if (href.indexOf('wk.baidu.com') != -1) { // 百度文库移动版
        console.log("检测到百度文库。。。。")
        // 循环检测
       let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".fold-pager").length > 0) {
                $$$("#reader-container").css("height","fit-content");
                commonHideRule1(".fold-pager")
                $$$(".reader-wrap").css('height', 'auto')
                $$$("#view-app").css('max-height', '')
                $$$(".try-end-fold-page").css('display', 'block')
                clearInterval(interval)
            }
        }, 1000)
    } else if (href.indexOf('www.elecfans.com') != -1) { // elecfans.com
        console.log("检测到电子发烧友。。。。")
        // 循环检测
        let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".seeHide").length > 0) {
                readAllRule1(".seeHide", ".simditor-body", true)
                clearInterval(interval)
            }
        }, 1000)

    } else if (href.indexOf('m.elecfans.com') != -1) { // elecfans.com
        console.log("检测到电子发烧友。。。。")
        // 循环检测
        let
            interval = setInterval(function () {
                console.log("轮训检测...")
                if ($$$(".see_more_arc").length > 0) {
                    readAllRule2(".see_more_arc", ".limit_height", "limit_height")
                    clearInterval(interval)
                    commonRemoveRule1(".open_app",false)
                    commonRemoveRule1(".open_app_arc",false)
                    commonRemoveRule1(".open_app_btn",false)

                }
            }, 1000)


    } else if (href.indexOf('wukong.com') != -1) { // elecfans.com
        console.log("检测到悟空问答。。。。")
        // 循环检测
        let
            interval = setInterval(function () {
                console.log("轮训检测...")
                if ($$$(".fold").length > 0) {
                    readAllRule2(".expand-bottom", ".fold", "fold")

                }
            }, 1000)

         let   interval2 = setInterval(function () {
                console.log("轮训检测...")
                if ($$$(".read-mask").length > 0) {
                    readAllRule1(".read-mask", ".content", true)
                    clearInterval(interval2)
                    commonRemoveRule1(".btn",false)
                    commonRemoveRule1(".download",false)

                }
            }, 1000)


    } else if (href.indexOf('peopleapp.com') != -1) { // peopleapp.com
        console.log("检测到人民日報。。。。")
        let count = 0;
        // 循环检测
       let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$(".read-more-mask").length > 0) {
                readAllRule1(".read-more-mask", ".has-more-high",)
                $$$("#header").remove()
                if(count++ > 10){
                    clearInterval(interval)
                }
            }
        }, 1000)

    } else if (href.indexOf('ifeng.com') != -1) { // ifeng.com
        console.log("检测到鳳凰网。。。。")
        // 循环检测
       let interval = setInterval(function () {
            console.log("轮训检测...")
            if ($$$("div[class^=tip-]").length > 0) {
                // readAllRule4(, "div[class^=main_content-]")
                commonRemoveRules1(["div[class^=tip-]",".link-1xGgkMtk"])
                commonReadAllRule1();
                clearInterval(interval)
            }
        }, 1000)

    } else if (href.indexOf('awesomes.cn') != -1) { // awesomes.com
        console.log("检测到awesomes.cn。。。。")
        // 循环检测
        if ($$$(".read_more_mask").length > 0) {
            readAllRule1(".read_more_mask", ".content")
        }

    } else if (href.indexOf('javascriptcn.com') != -1) { // javascriptcn.com
        console.log("检测到javascriptcn.com。。。。")
        // 循环检测
        if ($$$(".read_more_mask").length > 0) {
            readAllRule1(".read_more_mask", ".markdown-body")
        }

    }  else if (href.indexOf('hupu.com') != -1) { // hupu.com
        console.log("hupu.com。。。。")
        // 循环检测
        let interval = setInterval(function (){
            console.log("轮训检测...")
            if ($$$(".open-btn").length > 0) {
                readAllRule1(".open-btn", "#bbs-detail-wrap")
                clearInterval(interval)
            }

        },1000)


    } else if (href.indexOf('xw.qq.com') != -1) { // xw.qq.com
        console.log("检测到xw.qq.com。。。。")
        // 循环检测
       intervalReadAllRule2("div[aria-label]", "#article_body", "jsx-2375966888");
        $$$("#article_body").prop("style","margin:0 0.18rem; position:relative")
    } else if (href.indexOf('inews.qq.com') != -1) { // inews.qq.com
        console.log("检测到inews.qq.com。。。。")
        // 循环检测
        let interval = setInterval(function (){
            console.log("轮训检测...")
            if($$$("._1mAOD6Nkgp2wM7xlGCHeNi").length > 0){
                commonRemoveRules1(["._1mAOD6Nkgp2wM7xlGCHeNi","._1GTaS1LTuTrKnZ-oQ6KFRG"],true)
                commonReadAllRule1()
                clearInterval(interval)
            }

        },1000)

    } else if (href.indexOf('goodreads.com') != -1) { // goodreads.com
        console.log("检测到goodreads.com。。。。")
        // 循环检测
        let interval = setInterval(function (){
            console.log("轮训检测...")

            if($$$("a[onclick^=swapContent").length > 0){
                // PC 版本
                $$$(".readable >  span:nth-child(2)").attr("style","display:block")
                // 移动版本
                $$$(".bookReviewBody >  span:nth-child(2)").attr("style","display:block")
                $$$("a[onclick^=swapContent").attr("style","display:none")
                clearInterval(interval)
            }

        },1000)

    } else if (href.indexOf('51cto.com') != -1) { // blog.51cto.com
        console.log("检测到blog.51cto.com。。。。")
        // 循环检测
        /*$$$(document).scroll(function (){
            let count = 0;
            console.log("轮训检测")
            let interval = setInterval(function (){
                if($$$("#login_iframe_mask").length > 0){
                    console.log("已清理登录弹框")
                    $$$("#login_iframe_mask").remove();
                    clearInterval(interval)
                }
                if( count ++ > 10){
                    count = 0;
                    clearInterval(interval)
                }

            },1000)
        })*/
        // modify by zml 2020年10月31日 23:07:07 将原来监听是否有元素方式改为页面中添加css样式的方式来更好的解决弹框不停弹出的问题
        $$$("style").get(0).append("#login_iframe_mask{display:none}");

    } else if (href.indexOf('zhihu.com') != -1 && document.documentElement.clientWidth<768) { // blog.51cto.com
        console.log("检测到zhihu.com。。。。")
        let count = 0;
        let interval = setInterval(function (){
            if(".ModalWrap-body".length > 0){
                $$$(".ModalWrap-body").prop("style","").removeClass("ModalWrap-body")
            }
            if(".is-collapsed".length > 0){
                $$$(".is-collapsed").removeClass("is-collapsed");
            }
            if($$$(".RichContent-inner").length > 0){
                // $$$(".RichContent-inner").prop("style","").removeClass("RichContent-inner--collapsed")
                addOverflowCssStyle(".RichContent-inner--collapsed")
                addOverflowCssStyle(".RichContent--unescapable")
                addOverflowCssStyle(".is-collapsed")
            }
            if ($$$(".expandButton").length > 0) {
                console.log("移除阅读全文")
                // $$$(".expandButton").remove()
                addDisplayStyle(".expandButton")
            }
            if ($$$(".ContentItem-expandButton").length > 0) {
                console.log("移除阅读全文")
                // $$$(".ContentItem-expandButton").remove()
                addDisplayStyle(".ContentItem-expandButton")
            }
            if(count++ > 100){
                clearInterval(interval);
            }

        },100)

        $$$("style").get(0).append(".ModalWrap{display:none}");

    } else if (href.indexOf('36kr.com') != -1 && document.documentElement.clientWidth<768) { // 36氪
        console.log("检测到36kr.com。。。。")

        let interval = setInterval(function (){
            if($$$(".tips-mask").length > 0){
                commonHideRule1(".tips-mask");
                commonHideRule1(".tips-content");
                commonHideRule1(".swiper-wrapper");
                $$$("#body-content").removeClass(" no-open")
                $$$("body").attr("style","")
                commonHideRule1(".article-goapp");
                clearInterval(interval);
            }


        },100)


    } else if (href.indexOf('m.guokr.com') != -1) { // m.guokr.com
        console.log("检测到m.guokr.com。。。。")
        //let height = $$$(".styled__ArticleContent-sc0ctyfcr-4").position().top-$$$(".styled__ArticleContent-sc0ctyfcr-4").children().position().top
        //$$$(".styled__ArticleContent-sc0ctyfcr-4").css("height",height);
        $$$(".jYkhp").css("max-height","100%");
        $$$(".jYkhp").css("overflow","auto");
        $$$(".styled__Button-sc-1ctyfcr-7").parent().remove()
        $$$(".gJghO").css("display","none")// 移除底部APP横幅广告
    } else if ($$$("#read-more-btn").length > 0) {
        console.log("检测到可能使用了openwrite推广工具。。。。")
        readAllRule4("#read-more-btn");
    } else if ($$$(".mask").length > 0 && $$$(".info").length > 0) { // cmsblogs.com
        console.log("检测到%s。。。。", href)
        readAllRule4(".info");
    } else if (href.indexOf("iocoder") != -1) {
        setInterval(removeAlertRule1(), 10000);
    } else if (href.indexOf("javazhiyin") != -1) {
        addLayerCssStyle();
        // 每隔10s移除弹出的关注检测弹框
        setInterval(removeFirstLayer(), 10000)
    } else if (href.indexOf("ddkh") != -1) {
        readAllRule1("#locker", ".row-content", true)
    } else {


    }
})();
