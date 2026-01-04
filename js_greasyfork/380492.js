// ==UserScript==
// @name         百度搜索 - 优化 - 旧版
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/380492
// @description  1.屏蔽广告和推广 2.单列居中 3.双列居中 4.三列居中 5.去除重定向 6.自动下一页 7.去除百家号
// @version      3.3.9
// @author       浮生未歇
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @exclude      https://www.baidu.com/s*tn=news*
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @resource     baiduIndexStyle   https://SSHIN.coding.me/Baidu/2018-06-05/baiduIndexStyle.css
// @resource     baiduIndexStyleNo https://SSHIN.coding.me/Baidu/2018-06-05/baiduIndexStyleNo.css
// @resource     baiduCommonStyle  https://SSHIN.coding.me/Baidu/2018-06-05/commonStyle.css
// @resource     baiduMyMenuStyle  https://SSHIN.coding.me/Baidu/2018-06-05/customMenuStyle.css
// @resource     baiduOnePageStyle https://SSHIN.coding.me/Baidu/2018-06-05/onePageCenterStyle.css
// @resource     baiduTwoPageStyle https://SSHIN.coding.me/Baidu/2018-06-05/twoPageCenterStyle.css
// @run-at       document-body
// @connect      *
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/380492/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96%20-%20%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/380492/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96%20-%20%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==


(function() {

    'use strict';

    /**
     * 模块:配置
     **/
    var Config = {

        /////////////////////////////////////////////////////

        //可自定义 --- 自定义样式 (1: 开启自定义样式，0 关闭自定义样式)
        isCustomStyle : 1 ,

        //可自定义 --- 自定义样式链接地址，例如 customStyleURL : "https://demo.com/style.css"，
        //只有在 isCustomStyle:1 时才有效。当 isCustomStyle:0 可以清除自定义样式。
        customStyleURL : "" ,

        //可自定义 --- Google窗口打开方式，双击百度搜索框打开Google（0 :表示新标签打开 ， 1 :表示当前标签打开）
        openGoogleWay : 0,

        //可自定义 --- 侧边栏触发方式，是否滑动触发显示"网页、新闻、贴吧"（1 :表示开启，0:表示关闭）
        isSlide : 1,

        ////////////////////////////////////////////////

        //是否开启DEBUG。true:表示开启，false:表示关闭
        isDebug : false,

        //是否开启重定向。true:表示开启，false表示关闭
        redirect : GM_getValue("redirect",false),

        //是否开启自动加载下一页。true:表示开启，false表示关闭
        //preLoader : GM_getValue("preLoader",false),

        //是否导入首页样式
        isImportIndexStyple : false,

        //Run刷新名称,
        //runResetElementName : "#isRunReset",

        //功能选择页。0:普通页，1:居中单页，2:居中双页, 3:居中双页(高级版)
        option : GM_getValue("option",0),

        //监测点元素默认最大高度。检测值在最高和最低间，触发脚本
        testDefinedMaxHeight : 50,

        //监测元素默认最小高度
        testDefinedMinHeight : 5,

        //监测点元素(用于判断是首页或者是普通页)
        testElementName : "#form",

        //自定义样式 存储地址名称
        customStyleName : "customStyleURL",

        //自定义样式 缓存内容名称
        customStyleCache : "customStyleCache",


        //样式集
        styles:[{
            //百度首页(已登录)
            indexStyle   : "baiduIndexStyle",

            //百度首页(未登录)
            indexStyleNo : "baiduIndexStyleNo",

            //普通样式
            commonStyle  : "baiduCommonStyle",

            //居中单页样式
            onePageStyle : "baiduOnePageStyle",

            //居中双页样式
            twoPageStyle : "baiduTwoPageStyle",

            //自定义菜单样式
            menuStyle    : "baiduMyMenuStyle",
        }],

        //需要安装重置Run的选择器（让函数可以再次运行） //不用
        /*
        resetSelectors : [
            "#page a",
            "#su",
            "#result_logo",
            "#s_kw_wrap",
        ],
        */

        //需要屏蔽的广告
        ads : [
            "#content_left>div[style*='display:block !important;']",
            "#content_left>div:not([id])",
            "#content_left>#clone",
        ],

        //需要重定向的元素(重定向过的元素会添加 "redirect"类)
        redirectElements : [
            "#content_left .c-container h3 > a:not([class*='redirect'])",
        ],

        //重定向地址
        redirectURL : "www.baidu.com/link",

        //自动加载下一页
        preLoaderConfig : [{
            //当前域名
            hostName     : "https://www.baidu.com" ,
            //下一页按钮
            nextPageButton : "#page a[href*='rsv_page=1']" ,
            //页码按钮
            pageButton : "#page > a:first",

            //条目块
            itemSelector : ".c-container" ,

            //条目总数可能值(即一页加载多少结果)
            itemNums : [10,20,50],
        }],

    };

    /**
     * 模块:Cache
     **/

    var Cache = {};


    /**
     * 模块:Debug
     **/
    var Debug = {
        isDebug:Config.isDebug,
        printDebugInfo:function(name,message){
            if(this.isDebug){
                console[name](message);
            }
        },
        group:function(message){
            this.printDebugInfo("group",message);
        },
        groupEnd:function(message){
            this.printDebugInfo("groupEnd",message);
        },
        log:function(message){
            this.printDebugInfo("log",message);
        },
        info:function(message){
            this.printDebugInfo("info",message);
        },
        error:function(message){
            this.printDebugInfo("error",message);
        },
        count:function(message){
            this.printDebugInfo("count",message);
        }
    };

    /**
     * 模块:Run运行
     *
     **/
    var Run = {
        _ready:function(callback){
            return function(){
                $(document).ready(callback);
            };
        },
        ready:function(callback){
            this._ready(callback)();
        },

    };
    /*
    模块:样式
    */
    var Style ={
        //缓存
        cache: [],
        //清除缓存
        clearCache:function(){
            this.cache = [];
        },
        //加入样式队列
        addQueue:function(style){
            this.cache.push(style);
        },

        //开始导入样式(必须先将样式加入队列)
        import: function(){
            var styles = null;
            this.cache.forEach(function(style,index,arr){
                styles += GM_getResourceText (style);
                Debug.log("import( " + style + " )style……" );
            });
            try{
                GM_addStyle(styles);
            }catch(e){
                Debug.log(e);
            }
            this.clearCache();
        },
    };

    /**
     * 模块:数据
     **/
    var Data={
        getGmValue(name){
            return GM_getValue(name,Config[name]);
        },
        setGmValue(name,value){
            GM_setValue(name,value);
        },
        resetCount(){
            Config.count = 0;
        },
        resetRun(){
            Config.runCache = [];
        },
        resetAll(){
            Data.resetCount();
            Data.resetRun();

        }
    };

    /**
     * 模块:检查
     **/
    var Check = {
        //获取到顶部的距离
        isOffsetHight:function(){
            var offsetTopHight = $(Config.testElementName).offset().top;// 0 < top < 50
            Debug.log("offsetTopHight : " + offsetTopHight);
            //异常处理（有时出现 offsetTopHight 异常大的情况）
            if( offsetTopHight > 200 && location.href.indexOf("https://www.baidu.com/s?" ) > -1 ){
                offsetTopHight = 30;
            }
            return !!(Config.testDefinedMinHeight < offsetTopHight  && offsetTopHight < Config.testDefinedMaxHeight);
        },
        //是否为搜索结果页
        isSearchWeb:function(){
            return $("#content_left").length > 0;
        },

        //页布局 0: 普通页,1:单页居中，2:双页居中，3:
        isLayout:function(num){
            return Data.getGmValue("option") == num;
        },
        //存在元素
        isExist:function(elementName){
            return $(elementName).length > 0;
        },
        //是否重定向
        isRedirect:function(){
            return Data.getGmValue("redirect");
        },

        isRunCommon:function(){
            var name = "baidu-isCommonRun";
            if(!!$("#content_left").attr(name)){
                return true;
            }else{
                var info = $("#content_left").attr(name,true);
                return false;
            }

        },
        isRunIndex:function(){
            var name = "baidu-isIndexRun";
            if(!!$("body").attr(name)){
                return true;
            }else{
                var info = $("body").attr(name,true);
                return false;
            }
        },

    };

    /**
     * 模块:多页布局
     **/
    var MultiColumnLayout = {
        //添加LIST类，用于存放ITEM
        addList:function($parent,list,colsum){
            //if( $parent.children(list).length > 0)return;
            var div = "";
            for(var i = 1; i <= colsum; i++){
                div += "<div id='list" + i + " ' class='list'></div>";
            }
            $parent.prepend(div);
        },

        //将结果移动到list
        addItem: function($item){
            var $list  = $("#content_left > .list");
            if($item.length == 0 || $list.length == 0)return;
            $item.each(function(){
                var heightArray = [] ; //高度集合
                var minHightIndex = 0; //最小高度 INDEX
                $list.each(function(){
                    heightArray.push($(this).height());
                });
                minHightIndex = heightArray.indexOf(Math.min.apply(window,heightArray));
                $(this).appendTo($list.eq(minHightIndex));
            });

        }
    };
    /**
     * 模块 - 重定向
     **/
    var Redirect = {
        isRedirect:Check.isRedirect(),
        start: function(){
            if(!this.isRedirect)return;
            $(Config.redirectElements.join()).each(function(){
                var that = this;
                var URL = $(that).attr("href");
                if(URL.indexOf(Config.redirectURL) > 0){
                    $(that).removeAttr("data-click");
                    GM_xmlhttpRequest({
                        url:URL,
                        method:"HEAD",
                        onload:function(xhr){
                            //Debug.log("finalUrl:" + xhr.finalUrl);
                            try{
                                //将真实地址替换原来地址,并添加标志类（防止再次重定向）
                                $(that).attr("href",xhr.finalUrl).addClass("redirect");
                            }catch(e){
                                Debug.log("重定向发生错误:" + e);
                            }
                        },

                    });
                }

            });

        },
    };



    /**
     * 自动加载下一页
     **/
    function PreLoader(config){
        //当前配置
        this.config = config;

        //条目计数器
        this.item_sum = 0;

        //页地址 (需要初始化)
        this.page_url = null;

        //缓存数据（需要初始化）
        this.cache = [];

        //第几页(0表示本页)（需要初始化）
        this.page_count = 1;

    }
    PreLoader.prototype={

        //是否存在缓存
        hasCache:function(){
            return this.cache.length > 0;
        },

        //重置
        reset:function(){
            this.cache = [];
            this.page_count = 1;
            this.page_url = null;
        },

        //获取解析地址
        getPageURL:function(){
            if(this.page_url == null){
                this.page_url = this.config.hostName + $(this.config.pageButton).attr("href");
            }
            return this.page_url;
        },
        //获取条目数量
        getItemSum:function(){
            if(this.item_sum == 0){
                var URL = this.getPageURL();
                this.config.itemNums.forEach($.proxy(function(num){
                    if(URL.indexOf("pn=" + num) > 0){
                        this.item_sum = num;
                    }
                },this));
            }
            return this.item_sum;
        },
        //获取下一页地址
        getNextPageURL:function(pageCount){
            var url = this.getPageURL();
            var sum = this.getItemSum();
            return url.replace(/pn=\d+/g, "pn="+ pageCount * sum);
        },
        //发送请求
        send: function(callback){
            Debug.log("sendRequest");
            var that = this;
            var isNeedSend = false;
            var URL = this.getNextPageURL(this.page_count++);
            $.ajax({
                url      : URL,
                async    : true,
                timeOut  : 5000 ,
                type     : "GET",
                dataType : "html",
                beforeSend:function(){
                    if(that.hasCache()){
                        //导入数据到网页
                        that.addDataToWeb()
                        //回调函数
                        if(typeof callback === "function"){
                            callback();
                        }
                    }else{
                        isNeedSend = true;
                    }
                },
                success  : function(data,status){
                    //处理数据
                    var reg = /<body[\s\S.]+<\/body>/g;
                    var body = reg.exec(data)[0];
                    var item = $(body).find(that.config.itemSelector);
                    that.cache.push(item);

                    //重新发送
                    if(isNeedSend){
                        that.send(callback);
                    }

                },
                error :function(e){
                    Debug.log("自动加载下一页->发送数据失败: " + e);
                }
            });
        },

        //将数据加载到网页中
        addDataToWeb: function(){
            Debug.log("addDataToWeb");
            MultiColumnLayout.addItem(this.cache.shift());
            Redirect.start();
            return true;
        },

        //加载(中间件)
        load:function(callback){
            //发送数据
            this.send(callback);
        },

        //启动
        start:function(callback){
            var $parent =$("#content_left");
            var className = "PreLoaderInit";
            var hide = ["#rs","#page"];
            //如果还没有初始化
            if( $parent.length && !$parent.hasClass(className)){
                $parent.addClass(className);

                $(hide.join()).hide();

                //重置数据
                this.reset();

                //开始发送数据
                this.load(callback);

            }

        }
    };



    /*****************************************************************************************/
    /* 函数功能化  */
    /*****************************************************************************************/

    var Launch = {

        //导入首页样式(已登录版)
        importIndexStyles: function(){
            Style.addQueue(Config.styles[0].indexStyle);
            Style.import();
        },

        //导入首页样式(未登录版)
        importIndexStylesNo: function(){
            Style.addQueue(Config.styles[0].indexStyleNo);
            Style.import();
        },

        //导入搜索页样式
        importStyles: function(itemOption){
            var styles = Config.styles[0];
            var option = itemOption || Data.getGmValue("option");
            Debug.log("option:"+option);
            Style.addQueue(styles.commonStyle);
            Style.addQueue(styles.menuStyle);
            switch(option){
                case 1:Style.addQueue(styles.onePageStyle);break;
                case 2:
                case 3:Style.addQueue(styles.twoPageStyle);break;
            }
            Style.import();
        },

        //屏蔽广告
        removeAds: function(){
            //1. 屏蔽普通广告
            var removeCommonAds = function(){
                $( Config.ads.join()).remove();
            };

            //2. 屏蔽再次出现的广告
            var removeLaterAds = function(){
                /*
                var $selector = $("#content_left > div[id='1']");
                var $result1 =  $selector.next().attr('id') == 2;
                var $result2 =  $("#content_left > div[id]").length != 1;
                if($result1){
                    $selector.attr("id","a1");
                }
                if($result2){
                    GM_addStyle("#content_left > div[id='1'],#content_left .result~div[id='1'] {display: none!important;}");
                }
                */

                var $selector = $("#2,#3");

                //结果改id
                $selector.prev("#1").attr("id","a1");
                $("#1").remove();
                GM_addStyle("#content_left .c-container[id='1'],#content_left .result~div[id='1'] {display: none!important;}");


            };

            //自执行
            (function(){
                removeCommonAds();
                removeLaterAds();
            })();


        },
        //插入导航块
        insertTab:function(){
            var selector = ".head_wrapper";
            var selectorID = "baidu-banner";
            //如果存在则返回
            if(Check.isExist("#" + selectorID) ) return;
            //插入标签
            $(selector).prepend($("<div>",{"id":selectorID,"title":"单击显示导航栏"}));

        },
        //绑定导航事件
        bindTabEvent:function(){
            var $selectorID = "#baidu-banner";
            var $tab = $("#s_tab");
            //绑定事件
            $($selectorID).unbind("click").click(function(){
                $tab.addClass("show");
            });
            //加入滑动样式
            if(Config.isSlide){
                GM_addStyle("#s_tab:hover { left: 0px;transition: left .5s;opacity: 1;}");
            }

        },
        //插入自定义菜单
        inserCustomMenu: function(){
            var parent = "#u";
            var content = "";
            var div = "";

            if(Check.isExist("#CustomMenu") ) return;

            //1.添加三种排版
            content += "<li>普通样式</li> <li>居中单列</li> <li>居中双列</li>";

            //2.添加居中双列高级版
            content += "<li  title='自动加载下一页'>居中双列(高级版)</li>";

            //3.添加重定向
            if(Check.isRedirect()){
                content += "<li class='error'>关闭重定向</li>";
            }else{
                content += "<li class='success'>开启重定向</li>";
            }

            //拼接完整div
            div = "<a id='CustomMenu'><ol class='button'><li>自定义</li> </ol> <ol class='menu'>"+ content +"</ol></a>";
            $(parent).prepend($(div));

        },
        //绑定自定义菜单事件
        bindCustomMenuEvent: function(){
            var $menu =  $("#CustomMenu .menu");
            var $li  =  $("#CustomMenu .menu li");
            //自定义菜单点击
            $("#CustomMenu").unbind('click').click(function() {
                $menu.css("display", "block");
            });

            //自定义菜单选择
            $li .each(function(index){
                $(this).unbind('click').click(function(){
                    //页面布局(0,1,2,3)
                    if(0 <= index && index <= 3){
                        Data.setGmValue("option",index);
                    }
                    //重定向(4)
                    if(index == 4){
                        if(Check.isRedirect()){
                            Data.setGmValue("redirect",false); //关闭重定向
                        }else{
                            Data.setGmValue("redirect",true);  //开启重定向
                        }
                    }
                    location.href = location.href;
                });
            });

        },

        //全局关闭显示
        removeShow(){
            //关闭自定义菜单
            $(document).unbind('mouseup').mouseup(function(e) {
                var _con = null;
                var $menu =  $("#CustomMenu .menu");
                var $tab = $("#s_tab");

                //关闭菜单栏显示
                _con = $menu;
                if(!_con.is(e.target) && _con.has(e.target).length === 0) {
                    $menu.css("display", "none");
                }

                //关闭导航栏显示
                _con = $tab;
                if(!_con.is(e.target) && _con.has(e.target).length === 0) {
                    $tab.removeClass("show");
                }
            });
        },


        //双页布局
        addTwoList: function(){
            var $parent = $("#content_left");
            var $item   = $("#content_left > .c-container");
            var list    = "#content_left > .list";
            //如果存在则退出
            if( $(list).length > 0) return;

            //添加节点（在 content_left 插入 2 个 list ）
            MultiColumnLayout.addList($parent,list,2);

            //添加结果列表(将 item 结果添加到 list 中)
            MultiColumnLayout.addItem($item);

        },

        //绑定快捷键
        bindQuickHotkey: function(){
            $(document).keydown(function(event) {
                //上一页  Ctrl + <-
                if(event.keyCode == 37 && event.ctrlKey) {
                    $(".n:first").click();
                }
                //下一页  Ctrl + ->
                if(event.keyCode == 39 && event.ctrlKey) {
                    $(".n:last").click();
                }
                //搜索框  Ctrl + Enter
                if(event.keyCode == 13 && event.ctrlKey ) {
                    $("#kw").select();
                }
            });
        },

        //改变百度首页logo图片
        changeBaiduIndexLogo: function(){
            var URL = "https://s1.ax1x.com/2018/04/15/CZXxG4.gif";
            $("#head #lg>img").attr("src",URL);
        },

        openGoogle:function(){
            var openWay = !!Config.openGoogleWay;
            var googleURL = "https://www.google.com/search?q=";
            var $searchBtn = $("#su");
            var $inputMsg = $("#kw");
            $searchBtn.unbind("dblclick").dblclick(function(){
                var msg  = googleURL + $inputMsg.val();
                if(openWay){
                    location.href = msg;
                }else{
                    window.open(msg);
                }

            });
        },
        //导入自定义样式
        customStyle:function(){
            var url = Config.customStyleURL;
            var name = Config.customStyleName;
            var style = Config.customStyleCache;
            var cache = GM_getValue(style,"");

            //未开启自定样式，退出
            if( !Config.isCustomStyle ){
                GM_deleteValue(name);
                GM_deleteValue(style);
                return;
            }

            //开启自定样式，未设置地址退出
            if( Config.isCustomStyle && GM_getValue(name,url) === "" ){
                return;
            }

            //防止更改新地址无效
            if( url !== "" ){
                GM_setValue(name,url);
            }

            //使用缓存数据
            if( cache !== "" ){
                GM_addStyle(cache);
            }

            //获取最新的地址
            var styleURL = Data.getGmValue(name);

            //导入样式
            GM_xmlhttpRequest({
                url : styleURL,
                method : "GET",
                onload : function(xhr){
                    try{
                        if( xhr.status == 200 || xhr.status == 304 ){
                            GM_addStyle(xhr.response);
                            GM_setValue(style, xhr.response);
                        }else{
                            console.error("百度搜索-优化 : 未找到“自定义样式”地址的内容");
                        }
                    }catch( e ){
                        console.log("百度搜索-优化 : " + e);
                    }

                },
                onerror : function(e){
                    console.error("百度搜索-优化 : 异步请求发生错误，请检查 : " + e);
                },

            });

        },


        //初始化加载
        init:function(num){

            Launch.importStyles(num);
            Launch.customStyle();          //导入自定义样式
            Launch.insertTab();            //添加导航按钮
            Launch.bindTabEvent();         //绑定导航事件
            Launch.inserCustomMenu();      //插入自定义菜单
            Launch.bindCustomMenuEvent();  //绑定菜单事件
            Launch.bindQuickHotkey();      //绑定快捷键
            Launch.removeShow();           //去除显示
            Launch.removeAds();            //移除广告
            Launch.openGoogle();           //双击到Google
            Redirect.start();              //重定向
        }

    };


    /*****************************************************************************************/
    /* 自动加载下一页（只对双页居中有效） - 初始化  */
    /*****************************************************************************************/

    var preLoader = new PreLoader(Config.preLoaderConfig[0]);
    var scrollTop = 0;     //获取滚动条到顶部的距离
    var scrollHeight = 0;  //获取滚动条的高度
    var windowHeight = 0;  //获取文档区域高度

    //滚动加载下一页
    function scrollLoadPage(){
        $(window).unbind("scroll").scroll(function(){
            scrollTop    = $(this).scrollTop();     //获取滚动条到顶部的距离
            scrollHeight = $(this).height();        //获取滚动条的高度
            windowHeight = $(document).height();    //获取文档区域高度

            if( scrollTop + scrollHeight + 800  >= windowHeight){
                $(this).unbind("scroll");
                preLoader.load(scrollLoadPage);

            }
        });

    }

    //回到顶部按钮
    function insertButtonTop(){
        var selector = $("#content_left>#banner");
        if(selector.length == 0){
            $("#content_left").append("<div id='banner'><div class='uicon'></div></div>" );
            $("#banner").unbind("click").click(function () {
                var speed= "slow";//滑动的速度
                $('body,html').animate({ scrollTop: 0 }, speed);
                return false;
            });
        }
    }

    /*****************************************************************************************/
    /* 动态函数 */
    /*****************************************************************************************/
    function  mutationfunc(){
        //普通页
        if( (Check.isSearchWeb() || Check.isOffsetHight()) && !Check.isRunCommon() ){
            try{
                Debug.count("multationfunc()执行的次数");
                //普通页
                if(Check.isLayout(0)){
                    Launch.init(0);
                    return true;
                }
                //居中单页
                if(Check.isLayout(1)){
                    Launch.init(1);
                    return true;
                }
                //居中双页
                if(Check.isLayout(2)){
                    Launch.init(2);
                    //添加双列表
                    Launch.addTwoList();
                    return true;

                }
                //居中双页(高级版)
                if(Check.isLayout(3)){
                    Launch.init(3);
                    //添加双列表
                    Launch.addTwoList();
                    //添加回到顶部按钮
                    insertButtonTop();
                    //加载下一页
                    preLoader.start(scrollLoadPage);
                    return true;
                }

            }catch(e){
                Debug.error("mutationfunc()->普通页出现问题:" + e);
            }
            return true;
        }

        //首页
        if( (!Check.isSearchWeb() || !Check.isOffsetHight() ) && !Check.isRunIndex() ){
            //根据帐号是否登录加载不同样式
            try{
                if( Check.isExist("#u1") ){
                    Launch.changeBaiduIndexLogo();
                    Launch.importIndexStylesNo();
                }else{
                    Launch.importIndexStyles();
                }
            }catch(e){
                Debug.error("mutationfunc()->首页问题:" + e);
            }
            return true;
        }

    }

    /*****************************************************************************************/
    /* 执行区域 */
    /*****************************************************************************************/

    //1.导入样式（防止加载出现闪烁）
    function importOneStyle(){
        var url = "https://www.baidu.com/s?";
        if(location.href.indexOf(url) >  -1){
            Launch.importStyles();
        }
    }
    importOneStyle();

    //2.关闭广告收集 (提取于百度js代码)
    function closeAdsCookie (){
        var cpro_url = "http://help.wangmeng.baidu.com/cpro.php";
        var img = document.createElement("img");
        img.src = cpro_url + "?pry=" + 1 + "&_t=" + (new Date()).getTime();
    };
    closeAdsCookie();

    //3.动态监视并执行
    $(document).ready(function(){
        try{
            //动态监视DOM树的变化
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if( !!MutationObserver ){
                var observer = new MutationObserver(mutationfunc);
                var wrapper = document.querySelector("#wrapper");
                var observerConfig = {
                    "childList": true,
                    "subtree":true,
                    //"attributes": true,
                    //"characterData":true,
                    //"attributesFilter": ["class"],
                };

                //开始观察
                observer.observe(wrapper,observerConfig);

            }else{
                //浏览题版本过旧导致不支持MutationObserver
                console.error("<百度搜索-优化> : 浏览器版本过旧,导致不支持 'MutationObserver' 接口，请升级浏览器");
                mutationfunc();
            }
        }catch(e){
            Debug.error(e);
        }

    });


})();

