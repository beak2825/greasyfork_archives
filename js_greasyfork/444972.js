// ==UserScript==
// @name         略过知乎、csdn、简书、掘金、gitee、微博安全中心中间页站外链接直达跳转，CSDN免登录复制
// @namespace    https://github.com/waahah/
// @version      0.1.3
// @description  动态监测整个页面链接变化，略过知乎、csdn、简书、掘金、gitee、微博安全中心中间页站外链接直接跳转。解除csdn未登录复制限制，移除知乎、csdn的强制登陆弹窗,getbootstrap4中文网及上述网站去除冗余的广告
// @author       waahah
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M13.06 8.11l1.415 1.415a7 7 0 0 1 0 9.9l-.354.353a7 7 0 0 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415 1.415-1.414zm6.718 6.011l-1.414-1.414a5 5 0 1 0-7.071-7.071l-.354.354a5 5 0 0 0 0 7.07l1.415 1.415-1.415 1.414-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 0 1 9.9 9.9z'/%3E%3C/svg%3E
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @match        *://getbootstrap.net/docs/*
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://www.zhihu.com/question/*
// @match        *://www.zhihu.com
// @match        *://www.zhihu.com/people/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://www.jianshu.com/p/*
// @match        *://juejin.cn/post/*
// @match        *://gitee.com/*
// @match        *://weibo.com/*
// @license      Apache-2.0
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/444972/%E7%95%A5%E8%BF%87%E7%9F%A5%E4%B9%8E%E3%80%81csdn%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E6%8E%98%E9%87%91%E3%80%81gitee%E3%80%81%E5%BE%AE%E5%8D%9A%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%E4%B8%AD%E9%97%B4%E9%A1%B5%E7%AB%99%E5%A4%96%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE%E8%B7%B3%E8%BD%AC%EF%BC%8CCSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444972/%E7%95%A5%E8%BF%87%E7%9F%A5%E4%B9%8E%E3%80%81csdn%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E6%8E%98%E9%87%91%E3%80%81gitee%E3%80%81%E5%BE%AE%E5%8D%9A%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%E4%B8%AD%E9%97%B4%E9%A1%B5%E7%AB%99%E5%A4%96%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE%E8%B7%B3%E8%BD%AC%EF%BC%8CCSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //转载请注明出处谢谢
    const path = window.location.host;
    function bs4(){
        //$(".adsbygoogle").remove();
        setTimeout( () => {
            $("p.bd-lead + p").remove();
            $("ins.adsbygoogle.adsbygoogle-noablate");
            $(".adsbygoogle").remove();
        },0);
    }

    //站外链接直接跳转
    async function directLink (str) {
        //console.log("a[href^="+str+"]");
        let link = document.querySelectorAll(`a[href^='${str}']`);
        if(str==undefined){
            link = document.querySelectorAll("#content_views a[href]");
        }
        //如果索引顺序很重要，请不要在数组上使用 for in。索引顺序依赖于实现，可能不会按照期望的顺序访问数组值。
        for(let ee=0; ee<link.length; ee++){
            let url = link[ee].href.replace(str, '');
            //replace对掘金简书不起作用
            if(str=='https://link.juejin.cn?target='){
                url = url.split('?target=')[1];
            }
            if(str=='https://link.jianshu.com?t='){
                url = url.split('?t=')[1];
            }
            if(str==undefined){
                url = link[ee].href;
            }
            if(str=='//weibo.cn/sinaurl?u='){
                //url = url.replace('https:','');
                url = url.substr(6);
            }
            //增加对www.xxx.com这类没有http协议的处理
            if(url.indexOf('http')==-1){
                url = "https://" + url;
            }
            let decodeUrl= decodeURIComponent(url);
            console.log(decodeUrl);
            link[ee].setAttribute('href',decodeUrl);
            link[ee].addEventListener('click',e => {
                if (e && e.preventDefault)
                    e.preventDefault();
                else
                    window.event.returnValue = false; //兼容IE
                window.open(decodeUrl,"_blank");
            })
        }
    }

    function zhihu(){
        const pathname = location.pathname.split('/')[1];
        setTimeout( () => {
            //删除右栏广告
            $('div.Card.AppBanner').remove();
            $('div.Banner-adsense').hide();
            //$('div.Pc-card-button-close ').click();
            const btu = $("button.Button.Modal-closeButton.Button--plain");
            if(btu){
                btu.click();
            }
        },200);
        const str = () => {
            if (pathname =='people') {
                return "http://link.zhihu.com/?target=";
            }else{
                return "https://link.zhihu.com/?target=";
            }
        }
        (async () => str()) ().then(
            async value => {
                await directLink(value);
            }
        );
    }

    function blogCsdn(){
        setTimeout( () => {
            try{
                //debug
                $('code').css({'user-select':'unset'})
                $('#content_views pre').css({'user-select':'unset'})
                $('div#asideNewNps').remove();
                $('#recommendNps').remove();
                const node = $('.passport-login-container');
                if(node){
                    $('.passport-login-container').hide();
                    $('.login-mark').hide();
                    $("div#passportbox span").click();
                }
            }catch(e){
                //TODO handle the exception
                console.log("出错啦！"+e.message);
                console.log(e.stack);
            }
        },100);
        //console.log('csdn功能已启用！');
        (async () => await directLink()) ();
        /*const script = () => {
            let el = document.createElement("script");
            el.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js";
            let s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(el, s);
        }
        const once = fun => {
            var tag=true;
            return function(){
                if(tag){
                    tag=false;
                    fun();
                }
            }
        }
        once(script());*/
    }

    function juejin(){
        setTimeout( () => {
            $('div[data-growing-title="掘金插件"]').remove();
            $('div.extension').remove();
            $('div.sidebar-block.app-download-sidebar-block.shadow').remove();
        },50);
        setTimeout( () => {
            $('div.sidebar-block.author-block.pure').remove();
            $('div ul.sidebar-bd-entry').hide();
            $('div.article-suspended-panel.article-suspended-panel').remove();
            /*let node = $('div.sidebar-block.related-entry-sidebar-block.shadow');
            let copy_node = node.clone(true);
             node.hide();
            copy_node.css('float','left');
            copy_node.insertAfter($('div.sticky-block-box'));*/
        },400);

        const self = (async () => await "https://link.juejin.cn?target=")
        self().then(
            async value => {
                await directLink(value);
            }
        );
    }

    function jianshu(){
        $('section.-umr26').hide();
        $('h1._1RuRku').css('margin-top','0');
        //$('aside section:nth-child(2)').hide();
        $('div._27yofX').remove();
        //不需要decode解码
        async function self() {
            return await "https://link.jianshu.com?t=";
        }
        self().then(
            async value => {
                await directLink(value);
            }
        );
        //console.log("简书功能已启用");
    }

    function gitee(){
        //删除gitee封面人物
        const stars = $('div.gitee-stars-main-widget.pendan-widget');
        if(stars){
            stars.remove();
        }
        async function self() {
            return await "https://gitee.com/link?target=";
        }
        self().then(
            async value => {
                await directLink(value);
            }
        );
        //setTimeout(self,100);
    }

    function weiboCom(){
        const tips = $('div.woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter.TipsAd_wrap_3QB_0.TipsAd_bottomGap_1P4hW');
        if(tips){
            tips.remove();
        }
        const self_weiboCom = () => {
            return "//weibo.cn/sinaurl?u=";
        }
        (async () => self_weiboCom()) ().then(
            async value => {
                await directLink(value);
            }
        );
    }

    const host = [
        {"name":"Bootstarp4.1Docs","url":"getbootstrap.net","fun":"bs4()"},
        {"name":"知乎专栏","url":"zhuanlan.zhihu.com","fun":"zhihu()"},
        {"name":"知乎","url":"www.zhihu.com","fun":"zhihu()"},
        {"name":"CSDN","url":"blog.csdn.net","fun":"blogCsdn()"},
        {"name":"简书","url":"www.jianshu.com","fun":"jianshu()"},
        {"name":"掘金","url":"juejin.cn","fun":"juejin()"},
        {"name":"Gitee","url":"gitee.com","fun":"gitee()"},
        {"name":"weibo.com","url":"weibo.com","fun":"weiboCom()"}

    ]

    //初始化页面
    async function main (){
        for(const even in host){
            if(path ==host[even].url){
                eval(host[even].fun);
                console.log(host[even].name);
                break;
            }
        }
    }


    //在时间线拉到下面动态获取新的问答的时候，Dom 会变化，所以动态监测页面dom变化并检查替换。
    async function mo () {
        //观察到变动时执行回调函数
        async function callback (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
            await main();
        }

        const config = {
            'attributes': false,
            'childList': true,
            'subtree': true
        };
        // 以上述配置开始观察目标节点
        const promise = new Promise((resolve, reject) => {
            const observe = new MutationObserver(callback);
            resolve(observe);
        })
        promise.then(observe => observe.observe(document.body,config));
    }

    main().then(async () => await mo());

})();