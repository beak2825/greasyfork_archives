// ==UserScript==
// @name         漫画下一话
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  x键下一话,滑轮到底下一话，支持非下拉式转下拉式阅读
// @author       You
// @match        https://www.2mzx.com/manhua/*
// @match        https://manga.bilibili.com/*
// @match        http://www.6mh7.com/*
// @match        http://www.manhuaju.com/*
// @match        https://www.kanbl.cc/chapter/*
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/417055/%E6%BC%AB%E7%94%BB%E4%B8%8B%E4%B8%80%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/417055/%E6%BC%AB%E7%94%BB%E4%B8%8B%E4%B8%80%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    let window = unsafeWindow
    //对应域名规则
    let ruler={
        //优先用button，然后是url切换下一话
        'www.2mzx.com':{//下拉式
            'add_button':"body > div:nth-child(14) > a.next",//修改某个按钮为下一话,可选
            'next_button_or_function':'',//已有的下一话button或者函数，没有为空，如果是函数，结尾必须为()，用于切换下一页时点击或执行，与url至少有一个
            'url':/(\d+)\.html/,//下一话url,用于切换下一页，没有为空，与next_button至少有一个
            'min_height':10000,//最小文档高度,小于此高度时，认为没有划到底
            'observer':'',//出现时换页 [出现的对象,另外的验证方法]
        },
        'manga.bilibili.com':{//自建frame
            'add_button':"",
            'next_button_or_function':"div.load-next-btn-container > button",
            'url':/\/(\d+)/,
            'min_height':0,
            'observer':["div.load-next-btn-container > button",function(){return(/\d+/.exec(document.querySelector(" div.ps__rail-y > div").style.top)[0]>200)}] //出现时换页 [出现的对象,另外的验证方法]    弃用 ->//监控scroll无效时[对象，属性，值]
        },
        'www.6mh7.com':{//下拉式
            'add_button':"",
            'next_button_or_function':"#mainControlNext",
            'url':/(\d+)\.html/,
            'min_height':0,
            'observer':["#mainControlNext",function(){return(document.querySelector("#comicContain").childElementCount>=1)}] //出现时换页 [下页按钮出现时,已经加载至少1张图片]    弃用 ->//监控scroll无效时[对象，属性，值]
        },
        'www.manhuaju.com':{//单页阅读式漫画
            'init':function(){//初始化函数，页面加载后将先进行，将单页阅读的漫画改为下拉式阅读
                let urls = window.qTcms_S_m_murl;
                urls=urls.split("$qingtiandy$")
                let s=''
                for(let i of urls){
                    s+='<img  width="1200" src="'+i+'">'
                }
                document.querySelector("#qTcms_Pic_middle > tbody > tr > td").innerHTML=s},
            'add_button':"",
            'next_button_or_function':"a_f_qTcms_Pic_nextarr_Href()",//下一话为执行函数
            'url':'',
            'min_height':0,
            'observer':["div.footer",function(){return(document.querySelector("#qTcms_Pic_middle > tbody > tr > td").childElementCount>=2)}] //出现时换页 [下页按钮出现时,已经加载至少2张图片]    弃用 ->//监控scroll无效时[对象，属性，值]
        },
        'www.kanbl.cc':{
          //  'init':function(){alert(1)},//不需要初始化
            'add_button':"",
            'tmpfunction': function(){//因为这个网站比较复杂，写个函数来操作下一页，函数名随意，在next_button_or_function调用
                let page = document.querySelector("body > div.container > div.footpage > select");
                if(page.childElementCount == Number(page.value)){
                    //最後一頁
                    document.querySelector("body > div.container > div.footpage > a.btn.nextpage").click();
                }else{
                    let url = window.location.origin+window.location.pathname;
                    let nexturl = url+'?page='+(Number(page.value)+1);
                    window.location.href = nexturl;
                }
            },
            'next_button_or_function':"ruler['www.kanbl.cc']['tmpfunction']()",//下一话为执行函数
            'url':'',
            'min_height':0,
            'observer':["div.footpage",function(){return(document.querySelector("#content > div.comiclist").childElementCount>=1)}] //出现时换页 [下页按钮出现时,已经加载至少2张图片]
        },
    }



    /////////////////////////////////////////////////  main  ///////////////////////////////////////////////////////
    // 滚动条在Y轴上的滚动距离
    function getScrollTop() {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }

    // 文档的总高度
    function getScrollHeight() {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    }

    // 浏览器视口的高度
    function getWindowHeight() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

    // 距离底部 px 距离返回 true
    function ifBottom() {
        if (getScrollTop() + getWindowHeight()>= getScrollHeight()) {
            return true;
        }
        return false;
    }
    function isString(str){
        return (typeof str=='string')&&str.constructor==String;
    }
    function checkInPage(){//是否出现在页面上
        let el = document.querySelector(data.observer[0])
        const pageHeight = document.documentElement.clientHeight

        const contentTop = el.getBoundingClientRect().top
        const contentHeight = el.offsetHeight
        return (contentTop<pageHeight && contentTop>=0) || (contentTop<0 && (contentTop+contentHeight>0));
    }
    function wheel(event){
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
            delta = event.wheelDelta/120;
            if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
            delta = -event.detail/3;
        }//上下滚动时的具体处理函数
        if(delta){
            if(checkInPage() &&data.observer[1]()){
                window.nextp()

            }
        };
    }
    function observe_wheel(){ //监控滚轮，出现某对象时调用方法
        if(window.addEventListener)//FF,火狐浏览器会识别该方法
        {window.addEventListener('DOMMouseScroll', wheel, false);
         window.onmousewheel = document.onmousewheel = wheel;//W3C
        }
    }
    /*    弃用--->>>>>         setTimeout(()=>{//延时加载监控某属性值
            let item=data.observer
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            let pass = setInterval(function() {
                var element = document.querySelector(item[0]);
                if (element) {
                    clearInterval(pass)
                    var observer = new MutationObserver(function(mutations) {
                        console.log(element.style.top)
                        if(isString(item[2])){
                            if(element.style.top==item[2]){//达到监控值
                                window.next()
                            }
                        }else{
                            if(element.style.top>=item[2]){//达到监控值
                                window.next()
                            }
                        }
                    });
                    observer.observe(element, {
                        attributes: true,
                        attributeFilter: ['style']
                    });
                }})
            },3000)  */
    ///////////////////////////////////////////////// 开始执行 ///////////////////////////////////////////////////////
    let data = ruler[window.location.hostname]
    //执行初始化函数，如将原先单页阅读的改为下拉式的
    if(data.init){data.init()}

    window.nextp = function(){//注册全局方法
        //通过点击button或者改变url来换下一页
        if(data.next_button_or_function){
            if(data.next_button_or_function.indexOf('()')>-1){//function
                eval(data.next_button_or_function)
            }else{//btn
                document.querySelector(data.next_button_or_function).click()
            }
        }else if(data.url){
            let tmp = data.url.exec(window.location.href)[1] //去除要改变的url
            window.location.href = window.location.href.replace(tmp,String(parseInt(tmp)+1))//数字加一,下一话
        }else{
            console.log('!!!!!!!!!!!!error:没有配置下一话的操作')
            return
        }
    }
    //统一处理滚轮滚动事件
    //滑到底加载下一话，有的需要监控某值，其他默认为监控scroll划到底
    if(data.observer){
        setTimeout(
            observe_wheel//滚轮出现某元素时下一话
            ,5000)
    }else{
        window.document.addEventListener("scroll", function(){
            console.log(ifBottom(),getScrollHeight(),data.min_height)
            if(ifBottom() && (getScrollHeight()>=(data.min_height|| 1))){
                window.nextp()
            }
        })
    }


    //改变button
    if(data.add_button){
        document.querySelector(data.add_button).href = "javascript:nextp()"
    }
    //添加按键侦听 x键下一话
    window.document.addEventListener("keydown", function(event){
        if(window.event.keyCode==88){
            window.nextp()
        }
    }

                                    )
})();