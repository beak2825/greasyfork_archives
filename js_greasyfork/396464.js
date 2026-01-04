// ==UserScript==
// @name            百度优化
// @author          AC
// @license         GPL-3.0-only
// @create          2015-11-25
// @run-at          document-start
// @version         23.29
// @connect         www.baidu.com
// @include         *://ipv6.baidu.com/*
// @include         *://www.baidu.com/*
// @include         *://m.baidu.com/*
// @include         *://xueshu.baidu.com/s*
// @include         *://encrypted.google.*/search*
// @include         *://*.zhihu.com/*
// @home-url        https://greasyfork.org/zh-CN/scripts/396464
// @home-url2       https://github.com/langren1353/GM_script
// @homepageURL     https://greasyfork.org/zh-CN/scripts/396464
// @copyright       2017, AC
// @lastmodified    2019-12-16
// @resource        baiduCommonStyle     http://xbaidu.ntaow.com/newcss/baiduCommonStyle.css?t=23.18
// @resource        baiduOnePageStyle    http://xbaidu.ntaow.com/newcss/baiduOnePageStyle.css?t=23.18
// @resource        baiduTwoPageStyle    http://xbaidu.ntaow.com/newcss/baiduTwoPageStyle.css?t=23.18
// @resource        baiduLiteStyle       http://xbaidu.ntaow.com/newcss/baiduLiteStyle.css?t=23.18
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_setValue
// @grant           GM.setValue
// @grant			GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @description      优化
// @namespace        1052672227@qq.com
// @downloadURL https://update.greasyfork.org/scripts/396464/%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396464/%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
!function () {
    let isdebug = false;
    let isLocalDebug = isdebug || false;
    let debug = isdebug ? console.log.bind(console) : function () {};

    let inExtMode = typeof(isExtension) != "undefined";
    let inGMMode = typeof(GM_info.scriptHandler) != "undefined"; // = "Greasemonkey" || "Tampermonkey" || "ViolentMonkey"
    // 新版本的GreaseMonkey是带有scriptHandler，但是没有GM_getResourceText；旧版本不带scriptHandler，但是有GM_getResourceText
    let isNewGM = typeof(GM_info.scriptHandler) != "undefined" && GM_info.scriptHandler.toLowerCase() == "greasemonkey";
    let useCNLan = true; // 暂定，之后需要逻辑处理
    // inExtMode & inGMMode
    // true        true =扩展下的GM代码 不执行
    // true        false=扩展下代码 执行
    // false       true =仅GM代码 执行
    // false       false=异常 但是还是要执行代码
    debug("程序开始");
    if (inExtMode == true && inGMMode == true) {
        console.log("扩展模式-脚本不启用");
        return;
    }
    if (typeof(GM) == "undefined") {
        // 这个是ViolentMonkey的支持选项
        GM = {};
        GM.setValue = GM_setValue;
        GM.getValue = GM_getValue;
    }
    (function () {
        debug("程序执行");
        let needDisplayNewFun = true; // 本次更新是否有新功能需要展示
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || window;
                for (var i = 0; i < this.length; i++) {
                    callback.call(thisArg, this[i], i, this);
                }
            };
        }
        if(!Array.prototype.acpush){
            /**
             * 进行不重复插入，插入后执行回调函数
             * @param data 待插入数据
             * @param callback 回调函数
             */
            Array.prototype.acpush = function (data, callback) {
                // 如果是垃圾数据，那么可以丢弃的
                if(data == null) return;
                // 如果数据中有回车，那数据也是无效的正文而已
                if(data.replace(/({|}|,|\+|：|。|\n)/) != data) return;
                if(this.findIndex(m => m == data) < 0){
                    this.push(data);
                    callback && callback(this);
                }
            };
            Array.prototype.acremove = function (data, callback) {
                let delId = this.findIndex(m => m == data);
                if(delId >= 0){
                    this.splice(delId, 1);
                    callback && callback(this);
                } // 删除delId的数据，删除一个
            };
        }
        let ACConfig = {};
        /*存在对未初始化变量的初始化赋值-无需担心迭代兼容问题*/
        let DefaultConfig = {
            isRedirectEnable: true,  // 是否开启重定向功能
            isAdsEnable: true, // 是否开启去广告模式
            isBlockEnable: true, // 是否开启去拦截模式
            isBlockDisplay: true, // 是否删除已拦截的条目
            isBlockBtnDisplay: false, // 是否显示block按钮
            AdsStyleEnable: true, // 是否开启自定义样式模式
            AdsStyleMode_Baidu: 2, // 0-不带css；1-单列靠左；2-单列居中；3-双列居中

            HuYan_Baidu: false, // 护眼模式-百度
            Style_BaiduLite: false, // Baidu_Lite样式表

            defaultHuYanColor: "#DEF1EF",
            doDisableSug: true, // 是否禁止百度搜索预测
            isRightDisplayEnable: false, // 是否开启右侧边栏
            isCounterEnable: false, // 是否显示计数器
            isALineEnable: false, // 是否禁止下划线
            isUserStyleEnable: false, // 是否开启自定义样式
            isEnLang: false,
            isGooleInBaiduModeEnable: false, // 是否开启谷歌搜索结果页的百度图标显示
            UserBlockList: ["baijiahao.baidu.com"],
            UserStyleText:
                `/**计数器的颜色样式*/
div .AC-CounterT{
    background: #FD9999;
}
/**右侧栏的样式-其实不开启更好看一些*/
#content_right{
    padding: 20px 15px 15px;
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
    -webkit-box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
    -moz-box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
}
/****可以加一些自己的背景图片,替换引号内的内容为可外链的图片即可****/
body{
    background-repeat: repeat-y;
    background-size: 100%;
    background-attachment:fixed;
    background-image: url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564756277250&di=868b9eac9be14df1dedd8c7d6a710844&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20130530%2FImg377502333.jpg');
}
/*****窗口背景的透明虚化效果*****/
body>#wrapper,body>.wrap,body>#main,body #appbar,body #hdtbSum{
    background: rgba(225,225,225,0.8);
}
/**隐藏首页的大图标-修复可能导致外援样式异常**/
body[baidu] #s_lg_img_new{
    display:none !important;
}
#wrapper #content_left .result, #wrapper #content_left .c-container{
    border-radius: 5px;
}`,
            oldVersion: "",
            lastSaveTime: new Date().getTime(),
        };
        let CONST = {
            hasNewFuncNeedDisplay: true,
            sortIndex: 1,
            isGoogleImageUrl: false,
            AdsStyleMode: ACConfig.AdsStyleMode_Baidu,
            keySite: "baidu",
            StyleManger: function () {},
            curHosts: [],
        };
        let curSite = {
            SiteTypeID: 1,    // 当前站点的ID
            MainType:"",      // 主体节点，很多个的父节点
            Stype_Normal: "", // 重定向选择器，只有百度-搜狗-好搜
            FaviconType: "",  // favicon的域名检查器cite，用于获取host用
            FaviconAddTo: "", // favicon选择器，用于插入到title之前的
            CounterType: "",  // 计数器添加的位置，一般和favicon位置一致
            BlockType: "",    // 屏蔽按钮的位置，一般在title之后
        };
        let DBSite = {
            baidu: {
                SiteTypeID: 1,
                MainType: "#content_left .c-container",
                Stype_Normal: "h3.t>a, #results .c-container>.c-blocka",
                FaviconType: ".result-op, .c-showurl", // baidu 似乎要改版了？
                FaviconAddTo: "h3",
                CounterType: "#content_left>#double>div[srcid] *[class~=t],[class~=op_best_answer_question],#content_left>div[srcid] *[class~=t],[class~=op_best_answer_question]",
                BlockType: "h3 a",
            },
            sogou: {
                SiteTypeID: 2,
                MainType: "#main .results>div",
                Stype_Normal: "h3.pt>a, h3.vrTitle>a",
                FaviconType: "cite[id*='cacheresult_info_']",
                FaviconAddTo: "h3",
                CounterType: ".results>div",
                BlockType: "h3 a",
            },
            haosou: {
                SiteTypeID: 3,
                MainType: ".res-list",
                Stype_Normal: ".res-list h3>a",
                FaviconType: ".res-linkinfo cite",
                FaviconAddTo: "h3",
                CounterType: ".results>div",
                BlockType: "h3 a",
            },
            google: {
                SiteTypeID: 4,
                MainType: ".srg>div[class~=g] *[class~=rc]",
                FaviconType: ".iUh30",
                FaviconAddTo: "h3",
                CounterType: ".srg>div[class~=g] *[class~=r] h3,._yE>div[class~=_kk] h3",
                BlockType: ".rc>.r>a",
            },
            bing: {
                SiteTypeID: 5,
                MainType: "#b_results>li",
                FaviconType: ".b_attribution>cite",
                FaviconAddTo: "h2",
                CounterType: "#b_results>li[class~=b_ans]>h2,#b_results>li[class~=b_algo]>h2,#b_results>li[class~=b_algo]>h2",
                BlockType: "h2 a",
            },
            mBaidu:{
                SiteTypeID: 6,
                MainType: "#b_results>li",
                FaviconType: ".b_attribution>cite",
                FaviconAddTo: "h2",
                CounterType: "#b_results>li[class~=b_ans]>h2,#b_results>li[class~=b_algo]>h2,#b_results>li[class~=b_algo]>h2",
                BlockType: "h2 a",
            },
            zhihu: {
                SiteTypeID: 7,
            },
            baidu_xueshu:{
                SiteTypeID: 8,
                MainType: "#content_left .result",
                Stype_Normal: "h3.t>a, #results .c-container>.c-blocka",
                FaviconType: ".result-op, .c-showurl", // baidu 似乎要改版了？
                FaviconAddTo: "h3",
                CounterType: "#content_left>#double>div[srcid] *[class~=t],[class~=op_best_answer_question],#content_left>div[srcid] *[class~=t],[class~=op_best_answer_question]",
                BlockType: "h3 a",
            },
            ac_google:{
                SiteTypeID: 4,
                MainType: ".srg>div[class~=g] *[class~=rc]",
                FaviconType: ".iUh30",
                FaviconAddTo: "h3",
                CounterType: ".srg>div[class~=g] *[class~=r] h3,._yE>div[class~=_kk] h3",
                BlockType: ".rc a",
                is_acgoogle: true,
            },
            other: {
                SiteTypeID: 9,
            }
        };
        let SiteType = {
            BAIDU: DBSite.baidu.SiteTypeID,
            MBAIDU: DBSite.mBaidu.SiteTypeID,
            SOGOU: DBSite.sogou.SiteTypeID,
            SO: DBSite.haosou.SiteTypeID,
            GOOGLE: DBSite.google.SiteTypeID,
            AC_GOOGLE: DBSite.ac_google.SiteTypeID,
            BING: DBSite.bing.SiteTypeID,
            ZHIHU: DBSite.zhihu.SiteTypeID,
            BAIDU_XUESHU: DBSite.baidu_xueshu.SiteTypeID,
            OTHERS: 8
        };
        /**初始化所有的设置**/
        Promise.all([GM.getValue("Config")]).then(function (data) {
            if (data[0] != null) {
                try{
                    ACConfig = JSON.parse(data[0]);
                }catch (e) {
                    ACConfig = data[0];
                }
            } else {
                ACConfig = DefaultConfig;
            }
            for(var key in DefaultConfig){
                if(typeof(ACConfig[key]) == "undefined"){
                    ACConfig[key] = DefaultConfig[key];
                }
            }
            if(ACConfig.isUserStyleEnable == false && (new Date().getTime() - ACConfig.lastSaveTime > 2592000000)){ // 大约30天时间
                // 如果用户取消了设置，并且长时间(3天)没有进行过处理，那么直接将数据置空 -> 用于刷新数据
                console.log("ac-baidu css reset for time");
                ACConfig.lastSaveTime = new Date().getTime();
                ACConfig.UserStyleText = DefaultConfig.UserStyleText;
            }
            useCNLan = !ACConfig.isEnLang;
            // 初始化完成之后才能调用正常函数
            callback();
        }).catch(function (except) {
            console.log(except);
        });
        function Reg_Get(HTML, reg) {
            let RegE = new RegExp(reg);
            try {
                return RegE.exec(HTML)[1];
            } catch (e) {
                return "";
            }
        }
        function callback() {
            if (ACConfig.oldVersion == GM_info.script.version) {
                CONST.hasNewFuncNeedDisplay = false;
            } else {
                CONST.hasNewFuncNeedDisplay = needDisplayNewFun;
            }

            !function () {
                let BaiduVersion = " V" + GM_info.script.version;
                let insertLocked = false;
                if (location.host.indexOf("xueshu.baidu.com") > -1) {
                    curSite = DBSite.baidu_xueshu;
                }else if (location.host.indexOf(".baidu.com") > -1) {
                    if(navigator.userAgent.replace(/(android|mobile|iphone)/igm, "") != navigator.userAgent){
                        curSite = DBSite.mBaidu;
                    }else{
                        curSite = DBSite.baidu;
                    }
                } else if (location.host.indexOf("zhihu.com") > -1) {
                    curSite = DBSite.zhihu;
                } else if (location.host.indexOf("sogou") > -1) {
                    curSite = DBSite.sogou;
                } else if (location.host.indexOf("so.com") > -1) {
                    curSite = DBSite.haosou;
                } else if (location.host.indexOf("google") > -1) {
                    if(location.pathname.indexOf("ac-notexist") > -1){
                        curSite = DBSite.ac_google;
                    }else{
                        curSite = DBSite.google;
                    }
                } else if (location.host.indexOf("bing") > -1) {
                    curSite = DBSite.bing;
                }else {
                    curSite = DBSite.other;
                }
                if (curSite.SiteTypeID == SiteType.GOOGLE && location.href.replace(/tbm=(isch|lcl|shop|flm)/, "") != location.href) {
                    // 图片站 、地图站、购物站
                    console.log("特殊站,不加载样式，不添加menu");
                    CONST.isGoogleImageUrl = true;
                }
                if (ACConfig.AdsStyleEnable) {
                    if (curSite.SiteTypeID == SiteType.BAIDU) {
                        CONST.AdsStyleMode = ACConfig.AdsStyleMode_Baidu;
                        CONST.HuYanMode = ACConfig.HuYan_Baidu;
                        CONST.keySite = "baidu";
                    } else if(curSite.SiteTypeID == SiteType.BAIDU_XUESHU){
                        CONST.AdsStyleMode = 2;
                    }
                    CONST.StyleManger = FSBaidu(); // 添加设置项-单双列显示
                }
                console.log("%c[AC-Redirect] %cLet Me Introduce you a Very Good Search Engine：%c %s %cSearch Engine.", "font-weight:bold;color:cornflowerblue", "color:0", "font-weight:bold;color:darkorange", CONST.keySite.replace(CONST.keySite[0],CONST.keySite[0].toUpperCase()), "font-weight:normal;color:0");
                let bodyNameresetTimer = setInterval(function () {
                    if (document.body != null) {
                        document.body.setAttribute(CONST.keySite, "1");
                        if (curSite.SiteTypeID == SiteType.BAIDU && location.href.indexOf("tn=news") >= 0) {
                            document.body.setAttribute("news", "1");
                        }else{
                            document.body.removeAttribute("news");
                        }
                        // clearInterval(bodyNameresetTimer);
                    }
                }, 300);
                let BlockBaidu = {
                    /**
                     * 初始化Block样式
                     */
                    initStyle: function(){
                        AC_addStyle("button.ghhider.ghhb[ac-user-alter='1']::before{content:'取消 - ';}#sp-ac-container .ac-block-item{color:#AAA;margin-left:48px;}#sp-ac-container .ac-block-itemdel{float:right;margin-left:0;padding:0 20px;cursor:pointer;}#sp-ac-container .ac-block-itemdel:hover{color:red;}#sp-ac-container .ac-block-high{color:#000;}.ac-blockList li:hover{background-color:#a3caff;color:white !important;cursor:pointer;} *[ac-needhide] *{display:none} *[ac-needhide] .blockShow{display:unset;cursor:pointer;} *[ac-needhide] .blockShow:hover{border:1px solid #DDD}button.ghhider{color:#555;background-color:#fcfcfc;font-family:sans-serif;font-size:.85em;margin:auto 2px;border:1px solid #ccc;border-radius:4px;padding:2px 3px}h3>button.ghhider{font-size:.75em}button.ghhider:hover{color:#006aff;background:#fff}", "AC-BlockStyle");
                    },
                    /**
                     * 初始化屏蔽按钮加载
                     */
                    init: function () {
                        let checkNodes = document.querySelectorAll(curSite.MainType+":not([acblock])");
                        for (let i = 0; i < checkNodes.length; i++) {
                            try{
                                let curNode = checkNodes[i];
                                let faviconNode = curNode.querySelector(curSite.FaviconType);
                                // if(curNode.hasAttribute("acblock")) continue;
                                let host = getBaiduHost(faviconNode);
                                // if(host == null) continue;
                                let faNode = curNode.querySelector(curSite.BlockType);
                                let nodeStyle = "display:unset;";
                                if(!ACConfig.isBlockBtnDisplay){
                                    nodeStyle = "display:none;";
                                }
                                faNode.insertAdjacentHTML("afterend", `<button style='${nodeStyle}' class='ghhider ghhb' href="${faviconNode.href || faviconNode.innerText}" meta="${host}" data-host="${host}" title='点击即可屏蔽 ${host} 放开，需要在自定义中手动配置放开'>block</button>`);

                                curNode.setAttribute("acblock", "0");
                                curNode.setAttribute("acblock", "0");
                            }catch (e) {
                            }
                        }
                        this.initListener();
                        this.renderDisplay();
                    },
                    initListener: function(){
                        let checkNodes = document.querySelectorAll("button.ghhider:not([acEnv])");
                        for(let i = 0; i < checkNodes.length; i++){
                            checkNodes[i].addEventListener("click", this.doHideEnv);
                            checkNodes[i].setAttribute("acEnv", "0");
                        }
                    },
                    doHideEnv: function(env){
                        // 先插入数据---记得还要写入存储
                        let node = env.sourceTarget || env.target;
                        let host = node.dataset.host;
                        if(node.getAttribute("ac-user-alter") == 1){
                            // 已经屏蔽之后，再次点击block应该是取消状态
                            node.removeAttribute("ac-user-alter");
                            ACConfig.UserBlockList.acremove(host);
                            GM.setValue("Config", JSON.stringify(ACConfig)); // 点击一次，保存一次
                        }else{
                            // 正常屏蔽操作
                            node.removeAttribute("ac-user-alter");
                            ACConfig.UserBlockList.acpush(host);
                            GM.setValue("Config", JSON.stringify(ACConfig)); // 点击一次，保存一次
                        }
                        reloadBlockList();
                        BlockBaidu.renderDisplay();
                        env.stopPropagation();
                    },
                    // 刷新显示效果--耗时操作
                    renderDisplay: function(){
                        let checkNodes = document.querySelectorAll(curSite.MainType);
                        let flag = "ac-needhide";
                        for (let i = 0; i < checkNodes.length; i++) {
                            try{
                                let curNode = checkNodes[i];
                                let curHost = getBaiduHost(curNode.querySelector(curSite.FaviconType));
                                if(curHost == null) continue;
                                {
                                    let BlockBtn = curNode.querySelector(".ghhider.ghhb");
                                    BlockBtn.dataset.host = BlockBtn.dataset.meta = curHost;
                                }
                                if(curNode.querySelector("button[ac-user-alter]") != null) continue; // 用户手动点过显示的，那么跳过check
                                if(ACConfig.UserBlockList.findIndex(
                                    m => {
                                        try {
                                            return new RegExp(m.replace("*", ".*")).test(curHost);
                                        }catch(e){
                                            return m == curHost;
                                        }
                                    }
                                ) >= 0){
                                    // 只检查在屏蔽表中的数据
                                    if(! curNode.hasAttribute(flag)){
                                        if(ACConfig.isBlockDisplay){
                                            curNode.remove();
                                            continue;
                                        }
                                        let curTitle = curNode.querySelector(curSite.BlockType);
                                        curTitle = curTitle.innerText || curTitle.textContent;
                                        curNode.insertAdjacentHTML("afterBegin", `<span class="blockShow" title="如果需要一直显示，请在自定义中DIY目录移除本地址">${curTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -block by ${curHost}</span>`);
                                        curNode.setAttribute(flag, "1");
                                        (function(xcur){
                                            // 已经屏蔽之后的内容，点击一下显示原始内容
                                            xcur.querySelector(".blockShow").addEventListener("click", function (env) {
                                                this.parentNode.querySelector("button.ghhider").setAttribute("ac-user-alter", "1"); // 这个属性用于保持在DOM更新时，按钮不变
                                                xcur.removeAttribute(flag);
                                                safeFunction(function(){
                                                    xcur.querySelector(".blockShow").remove();
                                                });
                                                env.stopPropagation();
                                            });
                                        })(curNode);
                                    }
                                }else{
                                    curNode.removeAttribute(flag);
                                    safeFunction(function(){
                                        curNode.querySelector(".blockShow").remove();
                                    });
                                }
                            }catch (e) {
                            }
                        }
                    }
                };
                function addStyle(css) { //添加CSS的代码--copy的
                    let pi = document.createProcessingInstruction(
                        'xml-stylesheet',
                        'type="text/css" must="false" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
                    );
                    return document.insertBefore(pi, document.documentElement);
                }

                if (ACConfig.isAdsEnable) {
                    // display已经无法隐藏他们了，需要用绝对的隐藏
                    addStyle("#bottomads{display:none;} #content_left>div:not([id])>div[cmatchid], #content_left>div[id*='300']:not([class*='result']),#content_right td>div:not([id]),#content_right>br{position:absolute;top:-6666px;}");
                }
                if (curSite.SiteTypeID == SiteType.GOOGLE && ACConfig.isGooleInBaiduModeEnable){
                    safeWaitFunc("#logo img, #logocont img", function(node){
                        let faNode = node.parentNode.parentNode;
                        faNode.className = faNode.className.replace(/( baidu | baidu$)/, "") + " baidu";
                        node.removeAttribute("src");
                        node.src = "https://pic.rmb.bdstatic.com/c86255e8028696139d3e3e4bb44c047b.png";
                        node.width = "125";
                        node.removeAttribute("height");
                    });
                    safeWaitFunc("#main img[alt='Google']", function(node){
                        node.removeAttribute("srcset");
                        node.src = "https://www.baidu.com/img/bd_logo1.png?where=super";
                        node.setAttribute("height", "129");
                        node.style = "padding-top: 59px;";
                    });
                    document.title = document.title.replace(/^Google/, "百度一下，你就知道").replace(/ - Google 搜索/, "_百度搜索");
                    let linkTarget = document.querySelector("link[type='image/x-icon']") || document.createElement('link');
                    linkTarget.type = 'image/x-icon';
                    linkTarget.rel = 'shortcut icon';
                    linkTarget.href = 'https://www.baidu.com/favicon.ico';
                    document.head.appendChild(linkTarget);
                }
                // ！没啥用了！
                // if(window.top != window){
                //     // 只有当前页面是处于iframe状态下才会发送消息-向父窗体传递当前搜索的串，便于父窗体改变相应的内容
                //     // 用于sheigan.com/search的搜索内容变化
                //     // 用于兼容搜索模式，不存在数据泄露
                //     window.top.postMessage({acv:getSearchValue()}, "*");
                //     if (curSite.SiteTypeID == SiteType.GOOGLE && curSite.is_acgoogle == true){
                //         // 地址跳转到google搜索
                //         document.head.innerHTML = "";
                //         document.body.innerHTML = "";
                //         GM_xmlhttpRequest({
                //             url: "https://www.google.com/search?q="+getSearchValue(),
                //             method: "GET",
                //             timeout: 5000,
                //             onload: function (response) {
                //                 document.body.innerHTML = response.responseText;
                //             }
                //         });
                //     }
                // }
                try {
                    if (curSite.SiteTypeID != SiteType.OTHERS) {
                        document.addEventListener('DOMNodeInserted', MainCallback, false);
                        document.addEventListener('keyup', MainCallback, false);
                        RAFFunction(function(){
                            rapidDeal(); // 定期调用，避免有时候DOM插入没有执行导致的问题
                        }, 800);
                    }
                } catch (e) {
                    console.log(e);
                }

                function MainCallback(e) {
                    if (e.target != null && typeof(e.target.className) == "string" && e.target.className.toUpperCase().indexOf("AC-") == 0) {
                        return;
                    } //屏蔽掉因为增加css导致的触发insert动作
                    rapidDeal();
                }

                function ShowSearchBox(){
                    // TODO 待完成
                }

                function AutoRefresh() {
                    if (!ACConfig.isRightDisplayEnable) {
                        // 移除右边栏 -注意在#wrapper>#con-at>#result-op xpath-log有时候很重要，不能隐藏
                        AC_addStyle("#content_right{display:none !important;}#content_right td>div:not([id]){display:none;}#content_right .result-op:not([id]){display:none!important;}#rhs{display:none;}", "AC-RightRemove");
                    } else {
                        if (CONST.AdsStyleMode == 2) {
                            // 非双列模式下尽可能的显示右侧栏
                            AC_addStyle("@media screen and (min-width: 1250px) {#container{width: 80% !important;}.container_l #content_right{margin-right: calc(18% - 210px);position: absolute;right: -200px;display:block !important;overflow:hidden;width: 22vw !important;}", "AC-RightRemove");
                        }
                    }
                    if (!ACConfig.isALineEnable) {
                        AC_addStyle("a,a em{text-decoration:none}", "AC-NoLine");// 移除这些个下划线
                    }
                    if (ACConfig.isUserStyleEnable) {
                        AC_addStyle(ACConfig.UserStyleText, "AC-userStyle");// 用户自定义的样式表
                    }
                    AC_addStyle(
                        ".opr-recommends-merge-imgtext{display:none!important;}" + // 移除百度浏览器推广
                        ".res_top_banner{display:none!important;}" + // 移除可能的百度HTTPS劫持显示问题
                        ".headBlock, body>div.result-op{display:none;}" // 移除百度的搜索结果顶部一条的建议文字 & 移除可能出现的白屏现象
                        , "AC-special-BAIDU"
                    );
                    /*"自定义"按钮效果*/
                    AC_addStyle(".newFuncHighLight{color:red;font-weight: 100;background-color: yellow;font-weight: 600;}#sp-ac-container label{display:inline;}#u{width:319px}#u #myuser{display:inline}#myuser,#myuser .myuserconfig{padding:0;margin:0}#myuser{display:inline-block;}#myuser .myuserconfig{display:inline-block;line-height:1.5;background:#2866bd;color:#fff;font-weight:700;text-align:center;padding:6px;border:2px solid #E5E5E5;}#myuser .myuserconfig{box-shadow:0 0 10px 3px rgba(0,0,0,.1)}#myuser .myuserconfig:hover{background:#2970d4 !important;color:#fff;cursor:pointer;border:2px solid #73A6F8;}", "AC-MENU_Btn");
                    /*自定义页面内容效果*/
                    AC_addStyle('body[baidu]  #sp-ac-container .container-label:not([class*="baidu"])>label,\n' +
                        '   body[google] #sp-ac-container .container-label:not([class*="google"])>label,\n' +
                        '   body[bing]   #sp-ac-container .container-label:not([class*="bing"])>label,\n' +
                        '   body[sogou]   #sp-ac-container .container-label:not([class*="sogou"])>label,\n' +
                        '   body[baidu]  #sp-ac-container .container-label:not([class*="baidu"])>br,\n' +
                        '   body[google] #sp-ac-container .container-label:not([class*="google"])>br,\n' +
                        '   body[bing]   #sp-ac-container .container-label:not([class*="bing"])>br,\n' +
                        '   body[sogou]   #sp-ac-container .container-label:not([class*="sogou"])>br,\n' +
                        '   body[baidu]  #sp-ac-container .container-label[class*="baidu"]>labelhide,\n' +
                        '   body[google] #sp-ac-container .container-label[class*="google"]>labelhide,\n' +
                        '   body[bing] #sp-ac-container .container-label[class*="bing"]>labelhide,\n' +
                        '   body[sogou]   #sp-ac-container .container-label[class*="sogou"]>labelhide\n' +
                        '{' +
                        'display:none;\n' +
                        '}#sp-ac-container labelHide{cursor:pointer;margin-left:8%;color:blue}#sp-ac-container .linkhref,#sp-ac-container labelHide:hover{color:red}#sp-ac-container .linkhref:hover{font-weight:bold}#sp-ac-container label.menu-box-small{max-width:16px;max-height:16px;cursor:pointer;display:inline-block}.AC-CounterT{background:#FD9999}body > #sp-ac-container{position:fixed;top:3.9vw;right:8.8vw}#sp-ac-container{z-index:999999;text-align:left;background-color:white}#sp-ac-container *{font-size:13px;color:black;float:none}#sp-ac-main-head{position:relative;top:0;left:0}#sp-ac-span-info{position:absolute;right:1px;top:0;font-size:10px;line-height:10px;background:none;font-style:italic;color:#5a5a5a;text-shadow:white 0px 1px 1px}#sp-ac-container input{vertical-align:middle;display:inline-block;outline:none;height:auto;padding:0px;margin-bottom:0px;margin-top:0px}#sp-ac-container input[type="number"]{width:50px;text-align:left}#sp-ac-container input[type="checkbox"]{border:1px solid #B4B4B4;padding:1px;margin:3px;width:13px;height:13px;background:none;cursor:pointer;visibility:visible;position:static}#sp-ac-container input[type="button"]{border:1px solid #ccc;cursor:pointer;background:none;width:auto;height:auto}#sp-ac-container li{list-style:none;margin:3px 0;border:none;float:none;cursor:default;}#sp-ac-container fieldset{border:2px groove #ccc;-moz-border-radius:3px;border-radius:3px;padding:4px 9px 6px 9px;margin:2px;display:block;width:auto;height:auto}#sp-ac-container legend{line-height:20px;margin-bottom:0px}#sp-ac-container fieldset > ul{padding:0;margin:0}#sp-ac-container ul#sp-ac-a_useiframe-extend{padding-left:40px}#sp-ac-rect{position:relative;top:0;left:0;float:right;height:10px;width:10px;padding:0;margin:0;-moz-border-radius:3px;border-radius:3px;border:1px solid white;-webkit-box-shadow:inset 0 5px 0 rgba(255,255,255,0.3),0 0 3px rgba(0,0,0,0.8);-moz-box-shadow:inset 0 5px 0 rgba(255,255,255,0.3),0 0 3px rgba(0,0,0,0.8);box-shadow:inset 0 5px 0 rgba(255,255,255,0.3),0 0 3px rgba(0,0,0,0.8);opacity:0.8}#sp-ac-dot,#sp-ac-cur-mode{position:absolute;z-index:9999;width:5px;height:5px;padding:0;-moz-border-radius:3px;border-radius:3px;border:1px solid white;opacity:1;-webkit-box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3),0px 1px 2px rgba(0,0,0,0.9);-moz-box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3),0px 1px 2px rgba(0,0,0,0.9);box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3),0px 1px 2px rgba(0,0,0,0.9)}#sp-ac-dot{right:-3px;top:-3px}#sp-ac-cur-mode{left:-3px;top:-3px;width:6px;height:6px}#sp-ac-content{padding:0;margin:0px;-moz-border-radius:3px;border-radius:3px;border:1px solid #A0A0A0;-webkit-box-shadow:-2px 2px 5px rgba(0,0,0,0.3);-moz-box-shadow:-2px 2px 5px rgba(0,0,0,0.3);box-shadow:-2px 2px 5px rgba(0,0,0,0.3)}#sp-ac-main{padding:5px;border:1px solid white;-moz-border-radius:3px;border-radius:3px;background-color:#F2F2F7;background:-moz-linear-gradient(top,#FCFCFC,#F2F2F7 100%);background:-webkit-gradient(linear,0 0,0 100%,from(#FCFCFC),to(#F2F2F7))}#sp-ac-foot{position:relative;left:0;right:0;min-height:20px}#sp-ac-savebutton{position:absolute;top:0;right:2px}#sp-ac-container .endbutton{margin-top:8px}#sp-ac-container .sp-ac-spanbutton{border:1px solid #ccc;-moz-border-radius:3px;border-radius:3px;padding:2px 3px;cursor:pointer;background-color:#F9F9F9;-webkit-box-shadow:inset 0 10px 5px white;-moz-box-shadow:inset 0 10px 5px white;box-shadow:inset 0 10px 5px white}#sp-ac-container .sp-ac-spanbutton:hover{background-color:#DDD}label[class="newFunc"]{color:blue}', "AC-MENU_Page");
                }
                AutoRefresh();
                try {
                    GM_registerMenuCommand('AC-重定向脚本设置', function () {
                        document.querySelector("#sp-ac-content").style.display = 'block';
                    });
                } catch (e) {
                }

                function getSearchValue() {
                    let kvl = location.search.substr(1).split("&");
                    let searchV = "";
                    for(let i = 0; i < kvl.length; i++){
                        let value = kvl[i].replace(/^(wd|query|q)=/, "");
                        if(value != kvl[i]){
                            searchV = value;
                        }
                    }
                    //  '+' 百度、搜狗、必应、谷歌、好搜
                    searchV = searchV.replace("+", " ");
                    return searchV;
                }
                function rapidDeal() {
                    try {
                        if (insertLocked == false && curSite.SiteTypeID != SiteType.OTHERS) {
                            insertLocked = true;
                            InsertSettingMenu();
                            ACHandle(); // 处理主重定向
                            AutoRefresh();
                            if (ACConfig.isAdsEnable) { // 放进来，减少卡顿
                                removeAD_baidu_sogou();
                            }
                            if (ACConfig.AdsStyleEnable) { // 单独不需要定时器-頻繁触发-载入css
                                FSBaidu();
                            }
                            if (ACConfig.doDisableSug) { // 不启用移动预测[默认]
                                acSetCookie("ORIGIN", 2, "www.baidu.com");
                                acSetCookie("ISSW", 1);
                                acSetCookie("ISSW", 1, "www.baidu.com");
                            } else {
                                // 启用移动预测-不知道为什么要设置两个-百度自己会变？，反正有效果
                                acSetCookie("ORIGIN", 1, "www.baidu.com");
                                acSetCookie("ISSW", 1);
                                acSetCookie("ISSW", 1, "www.baidu.com");
                            }
                            if (ACConfig.isAdsEnable) { // 移除百度广告
                                removeAD_baidu_sogou();
                            }
                            if (ACConfig.isCounterEnable) { // 显示计数器
                                addCounter(document.querySelectorAll(curSite.CounterType));
                            }
                            if(ACConfig.isBlockEnable){ // 启用屏蔽功能
                                BlockBaidu.initStyle();
                                BlockBaidu.init();
                            }
                            setTimeout(function () {
                                insertLocked = false;
                            }, 200);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    function acSetCookie(cname, cvalue, domain, exdays) {
                        exdays = exdays || 30;
                        let d = new Date();
                        domain = (domain ? "domain=" + domain : "") + ";";
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        let expires = "expires=" + d.toUTCString();
                        document.cookie = cname + "=" + cvalue + "; " + domain + expires + ";path=/";
                    }
                }

                function getBaiduHost(sitetpNode){
                    if(curSite.SiteTypeID == SiteType.BAIDU){
                        var href = null;
                        if(sitetpNode instanceof HTMLElement){
                            href = sitetpNode.getAttribute("href")
                        }
                        if(href != null && href.indexOf("baidu.com/link") < 0){
                            // 已经解析出来了
                            return getHost(href);
                        }
                    }
                    return getHost(sitetpNode.innerText || sitetpNode.textContent);
                }

                function ACHandle() {
                    // 处理主重定向
                    if (curSite.SiteTypeID == SiteType.OTHERS) return;
                    if (ACConfig.isRedirectEnable) {
                        if (curSite.Stype_Normal != null && curSite.Stype_Normal != ""){
                            // 百度搜狗去重定向-普通模式【注意不能为document.query..】
                            resetURLNormal(document.querySelectorAll(curSite.Stype_Normal));
                            if(checkISBaiduMain()){
                                document.querySelectorAll(".s_form .index-logo-src[src*='gif'], .s_form .index-logo-srcnew[src*='gif']").forEach(function (per) {
                                    per.src = "https://pic.rmb.bdstatic.com/c86255e8028696139d3e3e4bb44c047b.png";
                                    // 神奇的百度百家号
                                    // https://imgsa.baidu.com/fex/pic/item/8718367adab44aedcc91ab2bbe1c8701a08bfb26.jpg
                                    // https://baidu.ntaow.com/newcss/baidu.png
                                });
                            }
                        }
                        if (curSite.SiteTypeID == SiteType.GOOGLE) removeOnMouseDownFunc(); // 移除onMouseDown事件，谷歌去重定向
                        if (curSite.SiteTypeID == SiteType.MBAIDU) removeMobileBaiduDirectLink(); // 处理百度手机版本的重定向地址
                        removeRedirectLinkTarget(); // 只移除知乎的重定向问题 & 百度学术重定向问题
                        safeRemove(".res_top_banner"); // 移除百度可能显示的劫持
                    }

                    try{ // 放入异常捕获，防止由于html插入过慢导致的js终止
                        if(! document.querySelector("#sp-ac-style").checked){
                            document.querySelectorAll("input[name*='sp-ac-a_force_style_']" ).forEach(per => {per.setAttribute("disabled", "disabled");per.parentNode.setAttribute("title", "请开启自定义样式")});
                        }else{
                            document.querySelectorAll("input[name*='sp-ac-a_force_style_']" ).forEach(per => {per.removeAttribute("disabled");per.parentNode.setAttribute("title", "AC-自定义样式内容")});
                        }
                        if(! document.querySelector("#sp-ac-block").checked){
                            document.querySelectorAll("#sp-ac-removeBlock, #sp-ac-blockBtnDisplay" ).forEach(per => {per.setAttribute("disabled", "disabled");per.parentNode.setAttribute("title", "请开启自定义样式")});
                        }else{
                            document.querySelectorAll("#sp-ac-removeBlock, #sp-ac-blockBtnDisplay" ).forEach(per => {per.removeAttribute("disabled");per.parentNode.setAttribute("title", "AC-自主拦截功能")});
                        }
                    }catch (e) {
                    }
                }

                function ACtoggleSettingDisplay(e) {
                    e.stopPropagation();
                    // 显示？隐藏设置界面
                    if(document.querySelector(".iframe-father iframe") == null){
                        document.querySelector(".iframe-father").insertAdjacentHTML("beforeend", "<iframe src='https://ghbtns.com/github-btn.html?user=langren1353&repo=GM_script&type=star&count=true' frameborder='0' scrolling='0' style='height: 20px;max-width: 108px;padding-left:5px;box-sizing: border-box;margin-bottom: -5px;display:unset !important;'></iframe>");
                    }
                    setTimeout(function () {
                        if (document.querySelector("#sp-ac-content").style.display == 'block') {
                            document.querySelector("#sp-ac-content").style.display = 'none';
                        } else {
                            ACConfig.oldVersion = GM_info.script.version;
                            GM.setValue("Config", JSON.stringify(ACConfig));
                            document.querySelector(".ac-newversionDisplay").style.display = 'none';
                            document.querySelector("#sp-ac-content").style.display = 'block';
                        }
                    }, 100);
                    return false;
                }

                function getBlockList(){ // 同时处理高亮
                    let insHTML = "";
                    for(let i = 0; i < ACConfig.UserBlockList.length; i++){
                        let insClass = CONST.curHosts.findIndex(m => {
                            try {
                                return new RegExp(ACConfig.UserBlockList[i].replace("*", ".*")).test(m);
                            }catch(e){
                                return m == ACConfig.UserBlockList[i];
                            }
                        }) >= 0 ? " ac-block-high":""; // 如果当前页面存在，则高亮
                        insHTML += `<li><label class="ac-block-item${insClass}" data-host="${ACConfig.UserBlockList[i]}">${ACConfig.UserBlockList[i]}</label><label class="ac-block-item ac-block-itemdel" data-host="${ACConfig.UserBlockList[i]}">x</label></li>\n`;
                    }
                    return insHTML;
                }

                function reloadBlockList(){
                    // 初始化表格内容并绑定按钮事件
                    document.querySelector(".ac-blockList ul").innerHTML = getBlockList();
                }

                function initBlockPage(){
                    try{
                        if(useCNLan){
                            document.querySelector(".setting-second").innerHTML = `<li style='margin-bottom: 8px !important;'><label><span id='sp-ac-blockdiybutton-back' class='sp-ac-spanbutton' title='返回'><-返回</span></label>&nbsp;拦截列表&nbsp;&nbsp;想要生效的话需要手动保存</li><li class='ac-blockList' style='max-height:60vh;overflow-y: scroll;'><ul>${getBlockList()}</ul></li><li>全匹配拦截：<input class="sp-ac-addRuleOne" style='width:55%;'><span id='sp-ac-addRulebutton' class='sp-ac-spanbutton endbutton' title='新增' style='position: relative !important;line-height: 17px;'>新增</span></li>`;
                        }else{
                            document.querySelector(".setting-second").innerHTML = `<li style='margin-bottom: 8px !important;'><label><span id='sp-ac-blockdiybutton-back' class='sp-ac-spanbutton' title='Back'><-Back</span></label>&nbsp;Block List&nbsp;&nbsp;Click Save Button if you want wo save the list</li><li class='ac-blockList' style='max-height:60vh;overflow-y: scroll;'><ul>${getBlockList()}</ul></li><li>Same host Insert ：<input class="sp-ac-addRuleOne" style='width:55%;'><span id='sp-ac-addRulebutton' class='sp-ac-spanbutton endbutton' title='Insert' style='position: relative !important;line-height: 17px;'>Insert</span></li>`;
                        }
                        document.querySelector("#sp-ac-blockdiybutton-back").addEventListener("click", function () {
                            document.querySelector(".setting-main").style = "";
                            document.querySelector(".setting-second").style = "display:none;";
                        });
                        document.querySelector(".ac-blockList").addEventListener("click", function (e) {
                            // 点击移除某个host数据时
                            let target = e.srcElement || e.target;
                            if(target.tagName.toLowerCase() == "label"){
                                let host = target.dataset.host;
                                ACConfig.UserBlockList.acremove(host, function(){
                                    document.querySelectorAll("button[ac-user-alter]").forEach(function (perNode) {
                                        // 移除用户diy之后的属性
                                        perNode.removeAttribute("ac-user-alter");
                                    });
                                    BlockBaidu.renderDisplay();
                                    reloadBlockList();
                                });
                            }
                        });
                        function ckAddRule(){
                            // 手动增加移除规则
                            let inputN = document.querySelector(".sp-ac-addRuleOne");
                            ACConfig.UserBlockList.acpush(inputN.value, reloadBlockList);
                            inputN.value = "";
                        }
                        document.querySelector("#sp-ac-addRulebutton").addEventListener("click", ckAddRule);
                        document.querySelector(".sp-ac-addRuleOne").addEventListener("keypress", function(evt){
                            let e = evt || window.event;
                            if(e.keyCode == 13) ckAddRule();
                        });
                    }catch (e) {
                    }
                }

                function removeMobileBaiduDirectLink(){
                    let nodes = document.querySelectorAll("#page #page-bd #results .result:not([ac_redirectStatus])");
                    for(let i = 0; i < nodes.length; i++){
                        let curNode = nodes[i];
                        safeFunction(function(){
                            let curData = JSON.parse(curNode.dataset.log.replace(/'/gm, "\""));
                            let trueLink = curData.mu;
                            curNode.querySelector("article").setAttribute("rl-link-href", trueLink);
                            curNode.querySelectorAll("a").forEach(function (per) {
                                per.setAttribute("href", trueLink);
                            });
                        });
                        curNode.setAttribute("ac_redirectStatus", "1");
                    }
                }

                function removeOnMouseDownFunc() {
                    try {
                        let resultNodes = document.querySelectorAll(".g .rc .r a");
                        for (let i = 0; i < resultNodes.length; i++) {
                            let one = resultNodes[i];
                            one.setAttribute("onmousedown", ""); // 谷歌去重定向干扰
                            one.setAttribute("target", "_blank"); // 谷歌链接新标签打开
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }

                function removeRedirectLinkTarget() {
                    if (curSite.SiteTypeID == SiteType.ZHIHU) {
                        let nodes = document.querySelectorAll(".RichText a[href*='//link.zhihu.com/?target']");
                        for (let i = 0; i < nodes.length; i++) {
                            let url = decodeURIComponent(nodes[i].href.replace(/https?:\/\/link\.zhihu\.com\/\?target=/, ""));
                            nodes[i].href = url;
                        }
                    } else if (curSite.SiteTypeID == SiteType.BAIDU_XUESHU) {
                        let xnodes = document.querySelectorAll("a[href*='sc_vurl=http']");
                        for (let j = 0; i < xnodes.length; j++) {
                            let xurl = getUrlAttribute(xnodes[j].href, "sc_vurl", true);
                            xnodes[j].href = xurl;
                        }
                    }
                }

                // 提取url元素的参数值
                function getUrlAttribute(url, attribute, needDecode) {
                    let searchValueS = (url.substr(1) + "").split("&");
                    for (let i = 0; i < searchValueS.length; i++) {
                        let key_value = searchValueS[i].split("=");
                        let reg = new RegExp("^" + attribute + "$");
                        if (reg.test(key_value[0])) {
                            let searchWords = key_value[1];
                            return needDecode ? decodeURIComponent(searchWords) : searchWords;
                        }
                    }
                }

                function resetURLNormal(list) {
                    for (var i = 0; i < list.length; i++) {
                        // 此方法是异步，故在结束的时候使用i会出问题-严重!
                        // 采用闭包的方法来进行数据的传递
                        let curNode = list[i];
                        let curhref = curNode.href;
                        if (list[i] != null && list[i].getAttribute("ac_redirectStatus") == null) {
                            list[i].setAttribute("ac_redirectStatus", "0");
                            if (curhref.indexOf("www.baidu.com/link") > -1 ||
                                curhref.indexOf("m.baidu.com/from") > -1 ||
                                curhref.indexOf("www.sogou.com/link") > -1 ||
                                curhref.indexOf("so.com/link") > -1) {
                                (function (c_curnode, c_curhref) {
                                    let url = c_curhref.replace(/^http:/, "https:");
                                    if (curSite.SiteTypeID == SiteType.BAIDU && url.indexOf("eqid") < 0) {
                                        // 如果是百度，并且没有带有解析参数，那么手动带上
                                        url = url + "&wd=&eqid=";
                                    }
                                    let gmRequestNode = GM_xmlhttpRequest({
                                        // from: "acxhr",
                                        extData: c_curhref, // 用于扩展
                                        url: url,
                                        headers: {"Accept": "*/*", "Referer": c_curhref.replace(/^http:/, "https:")},
                                        method: "GET",
                                        timeout: 5000,
                                        onreadystatechange: function (response) {
                                            // 由于是特殊返回-并且好搜-搜狗-百度都是这个格式，故提出
                                            DealRedirect(gmRequestNode, c_curhref, response.responseText, "URL='([^']+)'")
                                            // 这个是在上面无法处理的情况下，备用的 tm-finalurldhdg  tm-finalurlmfdh
                                            if (response.responseHeaders.indexOf("tm-finalurl") >= 0) {
                                                let relURL = Reg_Get(response.responseHeaders, "tm-finalurl\\w+: ([^\\s]+)");
                                                if (relURL == null || relURL == "" || relURL.indexOf("www.baidu.com/search/error") > 0) return;
                                                DealRedirect(gmRequestNode, c_curhref, relURL);
                                            }
                                        }
                                    });
                                })(curNode, curhref); //传递旧的网址过去，读作c_curhref
                            }
                        }
                    }
                }

                let DealRedirect = function (request, curNodeHref, respText, RegText) {
                    if (respText == null || typeof(respText) == "undefined") return;
                    let resultResponseUrl = "";
                    if (RegText != null) {
                        resultResponseUrl = Reg_Get(respText, RegText);
                    } else {
                        resultResponseUrl = respText;
                    }
                    if (resultResponseUrl != null && resultResponseUrl != "" && resultResponseUrl.indexOf("www.baidu.com/link") < 0) {
                        try {
                            if (curSite.SiteTypeID == SiteType.SOGOU) curNodeHref = curNodeHref.replace(/^https:\/\/www.sogou.com/, "");
                            let host = getHost(resultResponseUrl);
                            document.querySelectorAll("*[href*='" + curNodeHref + "']").forEach(function (per) {
                                if(per.querySelector("span") != null){
                                    per.lastChild.insertAdjacentHTML("beforeEnd", "&nbsp;-&nbsp;" + host);
                                }
                                per.setAttribute("ac_redirectStatus", "2");
                                per.setAttribute("href", resultResponseUrl);
                                if(per.hasAttribute("meta")){
                                    per.setAttribute("meta", host);
                                    per.dataset.host = host;
                                }
                            });
                            CONST.curHosts.acpush(host, reloadBlockList);
                            request.abort();
                        } catch (e) {
                            // console.log(e);
                        }
                    }
                };

                function removeAD_baidu_sogou() { // 移除百度自有广告
                    if (curSite.SiteTypeID == SiteType.BAIDU) {
                        // safeRemove(".c-container /deep/ .c-container");
                        // 移除shadowDOM广告；搜索关键字：淘宝；然后点击搜索框，广告会多次重现shadowdom
                        safeRemove(function () {
                            $('.c-container /deep/ .c-container').has('.f13>span:contains("广告")').remove();
                        });
                        safeRemove(function () {
                            $('#content_right>div').has('a:contains("广告")').remove();
                        });
                        // 移除标准广告
                        safeRemove(function () {
                            $('#content_left>div').has('span:contains("广告")').remove();
                        });
                        // 移除右侧栏顶部-底部无用广告
                        safeRemove(function () {
                            $("#content_right td>div:not([id]),#content_right>br").remove();
                        });
                    } else if(curSite.SiteTypeID == SiteType.MBAIDU){
                        /****移除手机模式上的部分广告****/
                        safeRemove(function(){
                            $('#page-bd #results>div:not([class*="result"])').remove();
                        });
                        safeRemove(function(){
                            $('#page-bd #results>div:not([class])').remove();
                        });
                    } else if (curSite.SiteTypeID == SiteType.SOGOU) {
                        safeRemove("#promotion_adv_container");
                        safeRemove("#kmap_business_title");
                        safeRemove("#kmap_business_ul");
                        safeRemove(".sponsored");
                        try {
                            document.querySelector(".rvr-model[style='width:250px;']").style = "display:none";
                        } catch (e) {
                        }
                    } else if (curSite.SiteTypeID == SiteType.SO) {
                        safeRemove("#so_kw-ad");
                        safeRemove("#m-spread-left");
                        safeRemove("#m-spread-bottom");
                    } else if (curSite.SiteTypeID == SiteType.BING) {
                        safeRemove(".b_ad");
                    } else if (curSite.SiteTypeID == SiteType.GOOGLE) {
                        safeRemove("#bottomads");
                    }
                }

                function IsNumber(val) {
                    if (val === "" || val == null) {
                        return false;
                    }
                    if (!isNaN(val)) {
                        return true;
                    } else {
                        return false;
                    }
                }

                function addCounter(citeList) {
                    let cssText = "position:relative;z-index:1;margin-right:4px;display:inline-block;color:white;font-family:'微软雅黑';font-size:16px;text-align:center;width:22px;line-height:22px;border-radius:50%;";
                    let div = document.createElement('div');
                    for (let i = 0; i < citeList.length; i++) {
                        let index = citeList[i].getAttribute('SortIndex');
                        if (index==null || typeof(index) == "undefined") {
                            citeList[i].setAttribute('SortIndex', CONST.sortIndex);
                            citeList[i].inner = citeList[i].innerHTML;
                            div.innerHTML = "<em class='AC-CounterT' style=" + cssText + ">" + CONST.sortIndex + "</em>";
                            citeList[i].innerHTML = div.innerHTML + citeList[i].inner;
                            CONST.sortIndex++;
                        } else {
                            if(index != (i + 1) % 100){ // 按需更新
                                citeList[i].querySelector(".AC-CounterT").innerText = (i + 1) % 100;
                            }
                        }
                    }
                }

                function getHost(sbefore) {
                    sbefore = (sbefore && sbefore.trim()) || "";
                    let send;
                    let result = sbefore.split('-');
                    // --搜狗百度专用；如果第一个是中文的话，地址就是第二个
                    if((result.length > 1 && new RegExp("[\\u4E00-\\u9FFF]+","g").test(sbefore)) && (curSite.SiteTypeID == SiteType.BAIDU || curSite.SiteTypeID == SiteType.SOGOU)){
                        sbefore = result[1];
                    }
                    send = sbefore.replace(/(\/[^/]*|\s*)/, "").replace(/<[^>]*>/g, "").replace(/https?:\/\//g, "").replace(/<\/?strong>/g, "").replace(/<\/?b>/g, "").replace(/<?>?/g, "").replace(/( |\/).*/g, "").replace(/\.\..*/, "");
                    if(send.indexOf(".") < 0) return null;
                    if(send.indexOf("↵")>=0)  return null;
                    return send.trim();
                }

                function addFavicon(citeList) {
                    for (let index = 0; index < citeList.length; index++) {
                        if (null == citeList[index].getAttribute("ac_faviconStatus")) {
                            let curNode = citeList[index];
                            let targetNode = curNode;
                            let url = getBaiduHost(targetNode);
                            if(url == null){ // 跳过baidu.click
                                continue;
                            }else{
                                CONST.curHosts.acpush(url);
                            }
                            let faviconUrl = url;
                            let II = 0;
                            for (; II <= 5; II++) {
                                targetNode = targetNode.parentNode;
                                if (targetNode != null && targetNode.querySelector(curSite.FaviconAddTo) != null) {
                                    break;
                                }
                            }
                            //console.log(index+"."+faviconUrl+"--"+II);
                            if (II <= 5) {
                                // 先用父节点判断一下是否存在img
                                let tmpHTML = targetNode.innerHTML;
                                let pos = tmpHTML.indexOf("fav-url")
                                    & tmpHTML.indexOf("favurl")
                                    & tmpHTML.indexOf("tit-ico")
                                    & tmpHTML.indexOf("img_fav rms_img")
                                    & tmpHTML.indexOf("c-tool-")
                                    & tmpHTML.indexOf("span class=\"c-icon c-icon-")
                                    & tmpHTML.indexOf("img class=\"xA33Gc");
                                //他自己已经做了favicon了
                                if (pos > -1) {
                                    // console.log("已有图片：");
                                    curNode.setAttribute("ac_faviconStatus", "-2");
                                    continue;
                                }
                                targetNode = targetNode.querySelector(curSite.FaviconAddTo);
                                // 特殊处理BING
                                // if (curSite.SiteTypeID == SiteType.BING) curNode = curNode.querySelector("h2");
                                //https://api.byi.pw/favicon/?url=???? 不稳定
                                //http://"+faviconUrl+"/cdn.ico?defaulticon=http://soz.im/favicon.ico 不稳定
                                //https://www.xtwind.com/api/index.php?url=???? 挂了。。。
                                //https://statics.dnspod.cn/proxy_favicon/_/favicon?domain=sina.cn
                                //www.google.com/s2/favicons?domain=764350177.lofter.com
                                //如果地址不正确，那么丢弃
                                let host = faviconUrl.replace(/[^.]+\.([^.]+)\.([^.]+)/, "$1.$2");
                                if (targetNode.querySelector(".AC-faviconT") == null && host.length > 3) {
                                    let insNode = document.createElement("img");
                                    // curNode = curNode.children[0] || curNode.firstChild ; // firstChild容易遇到text对象
                                    curNode.setAttribute("ac_faviconStatus", "1");
                                    // curNode.insertBefore(insNode, curNode.firstChild);
                                    insNode.className = "AC-faviconT";
                                    insNode.setAttribute("referrerpolicy", "no-referrer");
                                    insNode.style = "position:relative;z-index:1;vertical-align:sub;height:16px;width:16px;margin-right:5px;margin-bottom: 2px;";

                                    insNode.src = "https://favicon.yandex.net/favicon/" + host;
                                    insNode.setAttribute("faviconID", "0");
                                    // curNode.innerHTML = insNode.outerHTML + curNode.innerHTML;
                                    // curNode.insertAdjacentHTML("afterEnd", insNode.innerHTML);
                                    let beforeIndex = 0;
                                    if(targetNode.childNodes[beforeIndex].className == "AC-CounterT"){beforeIndex = 1;}
                                    targetNode.insertBefore(insNode, targetNode.childNodes[beforeIndex]);
                                    (function(xcur){
                                        insNode.onload = function(env){
                                            let imgNode = xcur.querySelector(".AC-faviconT");
                                            if(imgNode.naturalWidth < 10){
                                                imgNode.setAttribute("old-src", imgNode.src);
                                                imgNode.src = ACConfig.defaultFaviconUrl;
                                            }
                                            imgNode.onload = "javascript:void(0);";
                                        };
                                    })(targetNode);
                                }
                            }
                        }
                    }
                }
            }(); // 读取个人设置信息
            /**
             * @param callback 回调函数，需要返回是否结束True、False、否则相当于定时器
             * @param period 周期，如:200ms
             */
            function RAFFunction(callback, period){
                // 一秒60次，对应1秒1000ms
                let needCount = period / 1000 * 60;
                let times = 0;
                let hasFinish = false;
                function step(){
                    if(!hasFinish) requestAnimationFrame(step);
                    if(times == 0){
                        times = needCount;
                        hasFinish = callback(); // 只有返回true才会终止，不返回也会继续
                    }
                    times--;
                }
                requestAnimationFrame(step);
            }
            function safeFunction(func){
                safeRemove(func);
            }
            function safeWaitFunc(selector, callbackFunc, time, notClear){
                time = time || 50;
                notClear = notClear || false;
                let doClear = !notClear;
                RAFFunction(function () {
                    if((typeof (selector) == "string" && document.querySelector(selector) != null)) {
                        callbackFunc(document.querySelector(selector));
                        if(doClear) return true;
                    }else if((typeof(selector) == "function" && selector().length > 0)){
                        callbackFunc(selector()[0]);
                        if(doClear)  return true;
                    }
                }, time);
            }
            function AC_addStyle(css, className, addToTarget, isReload, initType) { // 添加CSS代码，不考虑文本载入时间，带有className
                RAFFunction(function() {
                    /**
                     * addToTarget这里不要使用head标签,head标签的css会在html载入时加载，
                     * html加载后似乎不会再次加载，body会自动加载
                     * **/
                    let addTo = document.querySelector(addToTarget);
                    if (typeof(addToTarget) == "undefined")
                        addTo = (document.head || document.body || document.documentElement || document);
                    isReload = isReload || false; // 默认是非加载型
                    initType = initType || "text/css";
                    // 如果没有目标节点(则直接加) || 有目标节点且找到了节点(进行新增)
                    if (typeof(addToTarget) == "undefined" || (typeof(addToTarget) != "undefined" && document.querySelector(addToTarget) != null)) {
                        // clearInterval(tout);
                        // 如果true 强行覆盖，不管有没有--先删除
                        // 如果false，不覆盖，但是如果有的话，要退出，不存在则新增--无需删除
                        if (isReload == true) {
                            safeRemove("." + className);
                        } else if (isReload == false && document.querySelector("." + className) != null) {
                            // 节点存在 && 不准备覆盖
                            return true;
                        }
                        let cssNode = document.createElement("style");
                        if (className != null) cssNode.className = className;
                        cssNode.setAttribute("type", initType);
                        cssNode.innerHTML = css;
                        try {
                            addTo.appendChild(cssNode);
                        } catch (e) {
                            console.log(e.message);
                        }
                        return true;
                    }
                }, 20);
            }
            function safeRemove(cssSelector_OR_NEWfunction) {
                if (typeof(cssSelector_OR_NEWfunction) == "string") {
                    try {
                        let removeNodes = document.querySelectorAll(cssSelector_OR_NEWfunction);
                        for (let i = 0; i < removeNodes.length; i++)
                            removeNodes[i].remove();
                    } catch (e) {
                    }
                } else if (typeof(cssSelector_OR_NEWfunction) == "function") {
                    try {
                        cssSelector_OR_NEWfunction();
                    } catch (e) {
                    }
                } else {
                    console.log("未知命令：" + cssSelector);
                }
            }
            function checkISBaiduMain(){
                // 如果是百度 &&  没有(百度搜索结果的标志-[存在]百度的内容) return;
                return !(curSite.SiteTypeID == SiteType.BAIDU && !(location.href.replace(/(&|\?)(wd|word)=/, "") != location.href || document.querySelector("#content_left") ||
                        ((document.querySelector("#kw") && document.querySelector("#kw").getAttribute("value")) || "") != "")
                )
            }
            function FSBaidu() { // thanks for code from 浮生@未歇 @page https://greasyfork.org/zh-TW/scripts/31642
                debug("初始化FSBAIDU");
                /**
                 * 检查document的子节点是否含有元素
                 * @param nodeClass 待检查元素
                 * @returns {boolean} T|F
                 */
                function checkDocmentHasNode(nodeClass) {
                    for (let i = 0; i < document.childNodes.length; i++) {
                        if (document.childNodes[i].data && document.childNodes[i].data.indexOf(nodeClass) > 0)
                            return true;
                    }
                    return false;
                }
                CONST.StyleManger = {
                    /**
                     * 导入css内容为【文本格式】！！！
                     * @param data css内容
                     * @param toClassName 预期的类名
                     */
                    importStyle: function (data, toClassName, useNormalCSS, mustLoad) {
                        if(typeof(data) == "undefined") {
                            // 这个居然在VM上出问题了，很奇怪
                            console.error("GM_getResourceText获取内容数据异常");
                            return
                        }
                        useNormalCSS = useNormalCSS || false;
                        mustLoad = mustLoad || false;
                        // 普通浏览器模式--但是似乎样式加载的优先级低于head中的style优先级
                        if (!useNormalCSS) {
                            // 通过must参数来判定style是否加载
                            // data = data.replace(/baidu.com#\$#/igm, '');
                            if (data.indexOf("http") != 0) data = "data:text/css;utf-8," + encodeURIComponent(data);
                            if (!checkDocmentHasNode(toClassName)) {
                                let pi = document.createProcessingInstruction(
                                    "xml-stylesheet",
                                    `type="text/css" must="${mustLoad}" class="${toClassName}" href="${data}"`
                                ); // 注意必须要双引号
                                document.insertBefore(pi, document.documentElement);
                            }
                        } else {
                            /* **********多重样式-兼容edge && 黑夜脚本************ */
                            AC_addStyle(data, toClassName, "head", false, "text/css");
                            /* **********多重样式-兼容edge && 黑夜脚本************ */
                        }
                    },
                    //加载普通样式
                    loadCommonStyle: function () {
                        this.loadStyle(CONST.keySite + "CommonStyle", CONST.keySite + "CommonStyle");
                    },
                    loadStyle: function (styleName, insClassName, setUrl, useNormalCSS, mustLoad) {
                        // 全部采用text/css的内容来载入
                        // 如果是debug模式。或者是gm模式
                        if (isLocalDebug) {
                            debug("本地-加载样式：" + insClassName);
                            setUrl = setUrl || "http://127.0.0.1/" + styleName + ".css";
                            this.importStyle(setUrl, "AC-" + insClassName, useNormalCSS, mustLoad);
                        } else if (isNewGM == true) {
                            // 仅用于GreaseMonkey4.0+
                            debug("特殊模式-加载样式：" + insClassName);
                            setUrl = setUrl || "https://baidu.htt5.com/newcss/" + styleName + ".css";
                            this.importStyle(setUrl, "AC-" + insClassName, useNormalCSS, mustLoad);
                        } else {
                            debug("加载样式：" + insClassName);
                            // TamperMonkey + GreaseMonkey < 4.0 + ViolentMonkey (4.0GreaseMonkey不支持GetResource方法)
                            this.importStyle(GM_getResourceText(styleName), "AC-" + insClassName, useNormalCSS, mustLoad);
                        }
                    },
                    //加载护眼模式样式
                    loadHuYanStyle: function (color) {
                        let style = "body[baidu],#wrapper #head,#wrapper #s_tab,form.fm .s_ipt_wr.bg{background-color:#fff}#container #content_left .result-op,#container #content_left .result,#container #rs,#container #content_right{background-color:#aaa;border:1px double #a2d7d4;border-radius:0}#container #content_left .result-op:hover,#container #content_left .result:hover{background-color:#ccc!important}#container #content_left .result-op h3,#container #content_left .c-container h3,#container #rs .tt{background-color:#bbb}.na_cnt .nws_itm,.nws_itmb,#b_content #b_results li,body #b_header{background-color:#aaa;border:1px double #a2d7d4;border-radius:0}#b_content #b_results li:hover{background-color:#ccc!important}#b_content #b_results li h2{background-color:#bbb}.srg .g,.bkWMgd>.g,.bkWMgd g-inner-card,#rhscol #rhs,#rhscol #rhs .g>div,.c2xzTb .g,.ruTcId .g,.fm06If .g,.cUnQKe .g,.HanQmf .g{background-color:#aaa;border:1px double #a2d7d4;border-radius:0}.srg .g:hover,.bkWMgd>.g:hover{background-color:#ccc!important}.bkWMgd .g div.r,.srg .g h3{background-color:#bbb}";
                        if (color.indexOf("#") != 0 || color.length < 7) return;
                        if (isNewGM == false) {
                            style = GM_getResourceText("MainHuYanStyle");
                        }
                        style = style
                            .replace(/#aaa(a*)/igm, color)
                            .replace(/#bbb(b*)/igm, this.Lighter(color, -40))
                            .replace(/#ccc(c*)/igm, this.Lighter(color, 45));
                        AC_addStyle(style, "AC-" + CONST.keySite + "HuYanStyle" + (isNewGM ? "" : "-File"), "head", true, "text/css"); // 需要修改的，所以为true
                    },
                    clip255: function (value) {
                        if (value > 255) return 255;
                        if (value < 0) return 0;
                        return value;
                    },
                    Lighter:function (oriRGB, deltaY) {
                        // 按比例缩放 + 1/deltaY
                        // HEX 2 RGB
                        let rgb = oriRGB.replace("#", "");
                        let R = parseInt("0x" + rgb.substr(0, 2));
                        let G = parseInt("0x" + rgb.substr(2, 2));
                        let B = parseInt("0x" + rgb.substr(4, 2));
                        // RGB 2 YUV
                        let Y = ((66 * R + 129 * G + 25 * B + 128) >> 8) + 16;
                        let U = ((-38 * R - 74 * G + 112 * B + 128) >> 8) + 128;
                        let V = ((112 * R - 94 * G - 18 * B + 128) >> 8) + 128;
                        Y = Y * (1 + 1.0 / deltaY);// 提高亮度
                        // YUV 2 RGB
                        R = this.clip255((298 * (Y - 16) + 409 * (V - 128) + 128) >> 8);
                        G = this.clip255((298 * (Y - 16) - 100 * (U - 128) - 208 * (V - 128) + 128) >> 8);
                        B = this.clip255((298 * (Y - 16) + 516 * (U - 128) + 128) >> 8);
                        return "#" + ((R << 16) + (G << 8) + B).toString(16);
                    },
                    //加载单页样式
                    loadOnePageStyle: function () {
                        this.loadStyle(CONST.keySite + "OnePageStyle", CONST.keySite + "OnePageStyle");
                    },
                    //加载双页样式
                    loadTwoPageStyle: function () {
                        this.loadStyle(CONST.keySite + "TwoPageStyle", CONST.keySite + "TwoPageStyle");
                    },
                    // 加载三列样式
                    loadThreePageStyle: function () {
                        let cssHead = "";
                        if (curSite.SiteTypeID == SiteType.BAIDU) cssHead = "#container #content_left, body[news] #container #content_left>div:not([class]):not([id])";
                        if (curSite.SiteTypeID == SiteType.GOOGLE) cssHead = ".srg,#acid_src";
                        if (curSite.SiteTypeID == SiteType.BING) cssHead = "#b_content #b_results";
                        if (curSite.SiteTypeID == SiteType.SOGOU) cssHead = "#main .results";
                        AC_addStyle(cssHead + "{grid-template-columns: repeat(auto-fit,minmax(33%,1fr));} #container #content_left>*:not([class*='result']),#acid_src div:last-child{grid-column-end: 4;}", "AC-ThreePageStyle", "head");
                    },
                    // 加载四列样式
                    loadFourPageStyle: function () {
                        let cssHead = "";
                        if (curSite.SiteTypeID == SiteType.BAIDU) cssHead = "#container #content_left, body[news] #container #content_left>div:not([class]):not([id])";
                        if (curSite.SiteTypeID == SiteType.GOOGLE) cssHead = ".srg,#acid_src";
                        if (curSite.SiteTypeID == SiteType.BING) cssHead = "#b_content #b_results";
                        if (curSite.SiteTypeID == SiteType.SOGOU) cssHead = "#main .results";
                        AC_addStyle(cssHead + "{grid-template-columns: repeat(auto-fit,minmax(25%,1fr));} #container #content_left>*:not([class*='result']),#acid_src div:last-child{grid-column-end: 5;}", "AC-FourPageStyle", "head");
                    },
                    loadPlainToCSS: function(){
                        for (let i = 0; i < document.childNodes.length; i++) {
                            let curNode = document.childNodes[i];
                            if(curNode.del) curNode.remove();
                        }
                        document.querySelectorAll("style[class*='AC'][del='1']").forEach(function (per) {
                            per.remove();
                        });
                    },
                    // 禁止独立的样式加载
                    loadCSSToPlain: function(){
                        for (let i = 0; i < document.childNodes.length; i++) {
                            let curNode = document.childNodes[i];
                            // 如果是存在css， 且非必须数据
                            if (curNode.target == "xml-stylesheet" && curNode.data.indexOf("must=\"true") < 0) {
                                curNode.data = "";
                                curNode.del = true;
                                if(navigator.userAgent.toLowerCase().indexOf("edge") > 0){
                                    // edge下特殊处理
                                    curNode.remove();
                                }
                            }
                        }
                    }
                };
                let ControlManager = {
                    //居中显示 --- 必须是百度和谷歌的搜索结果页面，其他页面不能加载的--已经通过脚本include标签限制了一部分
                    centerDisplay: function () {
                        AC_addStyle("body[google] .baidu{transform: translate(-10px, -1rem);transition:all 0.3s ease}.minidiv #logo img{width: 100px;height: unset;margin-top: 0.3rem;}", "AC-style-logo", "head");
                        let result = CONST.AdsStyleMode || null;
                        if (document.querySelector(".acCssLoadFlag") == null && document.querySelector(".ACExtension") == null) {
                            debug("in样式即将加载:"+result);
                            let expandStyle = "#content_left .result-op:hover,#content_left .result:hover{box-shadow:0 0 2px gray;background:rgba(230,230,230,0.1)!important;}#wrapper #rs, #wrapper #content_left .result, #wrapper #content_left .c-container{min-width:670px;margin-bottom:14px!important;}.c-span18{width:78%!important;min-width:550px;}.c-span24{width: auto!important;}";
                            if (result == 1) {
                                AC_addStyle(expandStyle, "AC-Style-expand", "head");
                                CONST.StyleManger.loadCommonStyle();
                            } else if (result == 2) {//单页居中
                                AC_addStyle(expandStyle, "AC-Style-expand", "head");
                                CONST.StyleManger.loadCommonStyle();
                                CONST.StyleManger.loadOnePageStyle();
                            } else if (result == 3) { //双页居中
                                CONST.StyleManger.loadCommonStyle();
                                CONST.StyleManger.loadTwoPageStyle();
                            } else if (result == 4) { // 三列
                                CONST.StyleManger.loadCommonStyle();
                                CONST.StyleManger.loadTwoPageStyle();
                                CONST.StyleManger.loadThreePageStyle();
                            } else if (result == 5) { // 四列
                                CONST.StyleManger.loadCommonStyle();
                                CONST.StyleManger.loadTwoPageStyle();
                                CONST.StyleManger.loadFourPageStyle();
                            }
                            let xflag = document.createElement("div");
                            xflag.className = "acCssLoadFlag";
                            document.head.appendChild(xflag);
                            debug("in样式运行结束");
                        }
                        if(curSite.SiteTypeID == SiteType.BAIDU && ACConfig.Style_BaiduLite == true){
                            CONST.StyleManger.loadBaiduLiteStyle();
                        }
                        if (curSite.SiteTypeID != SiteType.BAIDU && curSite.SiteTypeID != SiteType.BAIDU_XUESHU && curSite.SiteTypeID != SiteType.GOOGLE && curSite.SiteTypeID != SiteType.BING && curSite.SiteTypeID != SiteType.SOGOU) return;
                        // 如果是百度 &&  ((地址替换->包含wd关键词[替换之后不等-是百度结果页面]) || 有右边栏-肯定是百度搜索结果页 || value中存在搜索内容) return;
                        if (!checkISBaiduMain()) {
                            CONST.StyleManger.loadCSSToPlain();
                            return;
                        }
                        // 如果是谷歌 && (地址替换->是谷歌图像页面 || 是地图页面)[替换要变] return;
                        if (curSite.SiteTypeID == SiteType.GOOGLE && location.href.replace(/tbm=(isch|lcl|shop|flm)/, "") != location.href) {
                            CONST.StyleManger.loadCSSToPlain();
                            return;
                        }
                        /**护眼Style最后载入**/
                        if (CONST.HuYanMode == true || document.querySelector("style[class*='darkreader']") != null) CONST.StyleManger.loadHuYanStyle();
                        // 启用所有样式表
                        CONST.StyleManger.loadPlainToCSS();
                    },
                    init: function () {
                        if (CONST.isGoogleImageUrl) return;
                        this.centerDisplay();
                    }
                };
                debug("调用加载自定义css");
                ControlManager.init();
                return CONST.StyleManger;
            }
        }
    })();
}();