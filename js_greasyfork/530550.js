// ==UserScript==
// @name           多重搜索|联合搜索|聚合搜索|搜索跳转|搜索切换|搜索引擎增强工具|searchEngineJump|MultipleSearch
// @author         omoristation
// @contributor    omoristation
// @description    方便的在各个搜索引擎之间跳转,增加可视化设置菜单，能更友好的自定义设置，做到最大兼容性
// @version        0.0.1
// @license        MIT
// @namespace      https://greasyfork.org/zh-CN/scripts/
// @homepage       https://github.com/omoristation/searchEngineJump

// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXoAAAF6CAYAAAAXoJOQAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE6WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wMy0yM1QwMDoyOToxMCswOTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDMtMjNUMDA6MzI6MTcrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDMtMjNUMDA6MzI6MTcrMDk6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjEzZmIwY2M1LWJhMDQtZmY0YS1hMmM3LWNiZTZjYjQzY2E0NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1w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

// @include        *github.io*
// @include        *google.com*
// @include        *baidu.com*
// @include        *bing.com*
// @include        *sogou.com*
// @include        *so.com*
// @include        *yahoo.com*
// @include        *duckduckgo.com*
// @include        *yandex.com*
// @include        *ask.com*
// @include        *aol.com*
// @match          *://*/*

// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/530550/%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2%7C%E8%81%94%E5%90%88%E6%90%9C%E7%B4%A2%7C%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%7C%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%7C%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2%7C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%7CsearchEngineJump%7CMultipleSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/530550/%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2%7C%E8%81%94%E5%90%88%E6%90%9C%E7%B4%A2%7C%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%7C%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%7C%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2%7C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%7CsearchEngineJump%7CMultipleSearch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function iqxinstart(){
        // 根据规则把搜索引擎列表插入到指定网站
        var css ={};
        css = {
           style:"float:left;margin-left:1px;z-index:100000;margin-top:1px;"
        };
        var rules = [
            // 网页搜索/////////////第一个可以当模板看
            {name: "google网页搜索",// 你要加载的网站的名字(方便自己查找)
                // 是否启用.
                enabled: true,
                // 在哪个网站上加载,正则.
                url: /^https?:\/\/www\.google\.com\/search/,
                // 加载哪个类型的列表:
                // ['web'|'music'|'video'|'image'|'download'|'shopping'|'translate'|'knowledge'|'sociality']
                engineList: 'web',
                // 给引擎列表的样式
                style: css.style,

                // 插入文档,相关
                // target 将引擎跳转工具栏插入到文档的某个元素
                    // (请使用xpath匹配,比如: '//*[@id="subform_ctrl"]'  或者 css匹配(请加上 'css;' 的前缀),比如: 'css;#subform_ctrl' );
                // keyword 使用 xpath 或者 css选中一个form input元素 或者 该项是一个函数，使用返回值
                // where 四种:
                    // 'beforeBegin'(插入到给定元素的前面) ;
                    // 'afterBegin'(作为给定元素的第一个子元素) ;
                    // 'beforeEnd' (作为给定元素的最后一个子元素) ;
                    // 'afterEnd'(插入到给定元素的后面);.
                insertIntoDoc: {
                    keyword: '//textarea[@name="q"]',
                    target: 'css;body',
                    where: 'beforeBegin', //整个项目作为独立部分插入head和body之间，最大限度提高兼容性
                },
            },
            {name: "百度网页搜索",
                url: /^https?:\/\/www\.baidu\.com\/(?:s|baidu)/,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="wd"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "必应网页搜索",
                url: /^https?:\/\/www\.bing\.com\/search/,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="q"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "搜狗",
                url: /^https?:\/\/www\.sogou\.com\/(?:web|s)/,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: 'css;.query',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "360",
                url: /^https?:\/\/www\.so\.com\/s/i,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="q"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "雅虎网页搜索",
                url: /^https?:\/\/search\.yahoo\.com\/search/i,
                engineList: 'web',
                enabled: true,
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="p"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "DDG",
                url: /^https?:\/\/duckduckgo\.com\/\?q/i,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="q"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "yandex",
                url: /^https?:\/\/www\.yandex\.com\/search/i,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="text"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
            {name: "ask",
                url: /^https?:\/\/www\.ask\.com\/web\?q/i,
                enabled: true,
                engineList: 'web',
                style: css.style,
                insertIntoDoc: {
                    keyword: '//input[@name="q"]',
                    target: 'css;body',
                    where: 'beforeBegin',
                },
            },
        ];

        // 搜索引擎列表
        var engineList = {};

        // 有些图标需要重复使用
        var imgurl = "//omoristation.github.io/searchEngineJump/images";
        var icon ={};
        icon = {
          google: imgurl+'/google.svg',
          baidu: imgurl+'/baidu.svg',
          sogou: imgurl+'/sogou.svg',
          so: imgurl+'/so.svg',
          bing: imgurl+'/bing.svg',
          yahoo: imgurl+'/yahoo.svg',
          duckduckgo: imgurl+'/duckduckgo.svg',
          yandex: imgurl+'/yandex.svg',
          aol: imgurl+'/aol.svg',
          ask: imgurl+'/ask.svg',
          config: imgurl+'/config.svg',
          edit: imgurl+'/edit.svg',
          del: imgurl+'/del.svg',
          plus: imgurl+'/plus.svg',
        };

        // 网页搜索列表
        engineList.web = [];

        // engineList.web[0] 中间的数字表示排序(数字不能重复，否则后面的会覆盖掉前面的)，越小数字越靠前，小于0该引擎不会显示在页面上
        engineList.web[0] = {
            // 搜索引擎名称
            name: 'Google',
            // 搜索引擎地址，关键字变量用%s代替
            url: 'https://www.google.com/search?q=%s&ie=utf-8&oe=utf-8',
            // 搜索引擎的站点图标
            favicon: icon.google,
            // 搜索引擎编码（默认utf-8）如果跳转后乱码可以填写 'gbk'
            //encoding: 'utf-8',
            // 新标签页打开
            // blank:true,
            // 禁用
            // disable:true,
        };
        engineList.web[1] = {
            name: '百度',
            url: 'https://www.baidu.com/s?wd=%s&ie=utf-8',
            favicon: icon.baidu,
        };
        engineList.web[2] = {
            name: '必应',
            url: 'https://www.bing.com/search?q=%s',
            favicon: icon.bing,
        };
            engineList.web[3] = {
            name: '搜狗',
            url: 'https://www.sogou.com/web?query=%s',
            favicon: icon.sogou,
        };
        engineList.web[4] = {
            name: '360',
            url: 'https://www.so.com/s?ie=utf-8&q=%s',
            favicon: icon.so,
        };
        engineList.web[5] = {
            name: 'yahoo',
            url: 'https://search.yahoo.com/search;?p=%s',
            favicon: icon.yahoo,
            disable:true,
        };
        engineList.web[6] = {
            name: 'DDG',
            url: 'https://duckduckgo.com/?q=%s',
            favicon: icon.duckduckgo,
            disable:true,
        };
        engineList.web[7] = {
            name: 'yandex',
            url: 'https://www.yandex.com/search/?text=%s',
            favicon: icon.yandex,
            disable:true,
        };
        engineList.web[8] = {
            name: 'ask',
            url: 'https://www.ask.com/web?q=%s',
            favicon: icon.ask,
            disable:true,
        };
            engineList.web[9] = {
            name: 'aol',
            url: 'https://search.aol.com/aol/search?q=%s',
            favicon: icon.aol,
            disable:true,
        };
        var settingData = {
          "message":"$相关说明$(status: 这个在将来或许很重要)..."+
                  "(version: 若有新功能加入，靠这个版本号识别)..." +
                  "(addSearchItems: 允许更新时，添加新的搜索到你的搜索列表，将来更新使用)..." +
                  "(modifySearchItems: 允许更新时，修改你的搜索列表中的项目,将来更新使用)..." +
                  "(connectToTheServer: 允许连接到我的服务器(更新列表，将图标转换为base64等),将来更新使用或永不使用)..." +
                  "(closetext: 设置页面右上角的“关闭圆圈”是否显示。true显示，false隐藏)..." +
                  "(newtab: 0为默认设置，1为新标签页打开)..." +
                  "(position: 搜索按钮排列方向，0为水平，1为默认竖排，切换后可以调整left和top值来适应页面)..." +
                  "(left: 搜索按钮到浏览器左边的距离)..." +
                  "(top: 搜索按钮到浏览器上面的距离)..." +
                  "(foldlist: 折叠当前搜索分类列表。true为折叠，false为展开。)..." +
                  "(animation: 关闭搜索按钮动画。true显示，false隐藏)..." +
                  "(setBtnOpacity: 搜索按钮的透明度.)..." +
                  "(debug: debug模式，开启后，控制台会输出一些信息，“关闭并保存”按钮将不会在刷新页面)..." +
                  "(fixedTop: 将搜索按钮固定。 true开启，false关闭)..." +
                  "(engineDetails: 第一个值为分类列表标题名称，第二个值与enginelist相关联，必须匹配,第三个值true为显示列表，false为禁用列表。可以用它将分类列表按自己喜欢排序)..." +
                  "(engineList: 各个搜索的相关信息)" +
                  "(rules: 添加陌生搜索后，需要在此将此搜索的搜索样式插入到目标网页才可以显示按钮，同脚本中的rules设置相同。自带了aol搜索，可仿写)...",
          "status":1,
          "version":0.01,
          "addSearchItems":true,
          "modifySearchItems":true,
          "connectToTheServer":true,
          "closetext":false,
          "newtab":0,
          "position":1,
          "left":1,
          "top":10,
          "foldlist":false,
          "animation":true,
          "setBtnOpacity":0.6,
          "debug":false,
          "fixedTop":true,
          "engineDetails":[['网页', 'web',true]],
          "engineList":{},
          "rules":[{"name": "aol", "url": "/^https?:\\/\\/search\\.aol\\.com\\/aol\\/search/", "enabled": true, "engineList": "web","style": css.style, "insertIntoDoc": {"keyword": "//input[@name='q']", "target": "//body[@*]", "where": "beforeBegin"}}]
        };

        var getSettingData = GM_getValue("searchEngineJumpData");
        if(getSettingData){
            // console.log("本地存在列表：",getSettingData);
            if(!getSettingData.status && confirm("设置发生错误，脚本将会复原出厂设置")){
                GM_deleteValue("searchEngineJumpData");
                window.location.reload();
            }

            // 查看本地配置信息是否完整
            for(let value in settingData){
                if(!getSettingData.hasOwnProperty(value)){
                    console.log("属性不存在： ",value);
                    getSettingData[value] = settingData[value];
                    GM_setValue("searchEngineJumpData",getSettingData);
                }
            }

            // 获取版本，用于搜索列表更新
            // console.log("当前版本号和目标版本号: ",getSettingData.version,settingData.version);
            if(parseFloat(getSettingData.version) < settingData.version){
                console.log("版本过低，开始更新,当前版本号和目标版本号: ",getSettingData.version,settingData.version);

                // 1.93更新 360界面变动
                if(getSettingData.modifySearchItems){
                    getSettingData.engineList = modifySearchItemsFun(getSettingData.engineList,"https://www.google.com/cse?q=%s&newwindow=1&cx=006100883259189159113%3Atwgohm0sz8q","https://cse.google.com/?q=%s&newwindow=1&cx=006100883259189159113%3Atwgohm0sz8q");
                }

                // 更新本地版本 其他相关信息
                getSettingData.version = settingData.version;
                getSettingData.message = settingData.message;
                GM_setValue("searchEngineJumpData",getSettingData);
            }

            engineList = getSettingData.engineList;

        } else {
            console.log("未发现本地列表");
            settingData.engineList = engineList;
            console.log("初始化：",settingData);

            GM_setValue("searchEngineJumpData",settingData);
            getSettingData = GM_getValue("searchEngineJumpData");
        }

        // 处理enginlist.detail的相关信息
        var engineDetails = getSettingData.engineDetails;
        //列表分类显示情况
        var getDetails = engineDetails.map(function(value,index){
            // console.log(value,value[2]);
            return value[2]?index:-index;
        });

        // 列表分类的key value
        var getDetailsL = getDetails.length;
        var details = [];
        for(let i=0;i<getDetailsL;i++){
            details[getDetails[i]] =  engineDetails[i];
        }
        engineList.details = details;

        // debug
        // getSettingData.debug = true;
        reloadDebug(getSettingData.debug);

        ///test -------------- 测试 start
        debug("searchEngineJump test location.href: ",window.location.href);
        ///test -------------- 测试 end

        // 更新已过期的搜索链接
        function modifySearchItemsFun(engineList,oldURL,newURL){
            for(let value in engineList){
                var item = engineList[value];
                for(let i=0;i<item.length;i++){
                    if(item[i].url === oldURL){
                        item[i].url = newURL;
                        return engineList;
                    }
                }
            }
            return engineList;
        }
        // 更新本地 rule
        function modifySearchItemsRuleFun(name,value){
            var oldRule = getSettingData.rules;
            for(let item in oldRule){
                if(oldRule[item].name == name){
                    console.log("匹配成功, 更新 rule : ", name);
                    oldRule[item] = value;
                    GM_setValue("searchEngineJumpData",getSettingData);
                }
            }
        }

        // parseUri 1.2.2
        // (c) Steven Levithan <stevenlevithan.com>
        // MIT License
        var parseUri = function(str) {
            var o = parseUri.options,
                m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                uri = {},
                i = 14;

            while (i--) uri[o.key[i]] = m[i] || "";

            uri[o.ds.name] = {};
            uri[o.ds.name][0] = {};
            uri[o.ds.name][0].key = (uri.protocol ? uri.protocol : "http") + "://" + uri.host + (uri.port ? ":" + uri.port : "") + "/";
            uri[o.ds.name][0].val = "/";
            i = 0;
            var tempsub = "/",
                subs = uri[o.key[10]].substr(1).split("/");
            for (var j = 1; j < (subs.length + 1); j++, i++) {
                tempsub += tempsub === "/" ? subs[i] : "/" + subs[i];
                if (subs[i]) {
                    uri[o.ds.name][j] = {};
                    uri[o.ds.name][j].key = subs[i];
                    uri[o.ds.name][j].val = tempsub;
                }
            }

            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
                if ($1) uri[o.q.name][$1] = $2;
            });
            uri[o.aq.name] = {};
            uri[o.key[13]].replace(o.aq.parser, function($0, $1, $2) {
                if ($1) uri[o.aq.name][$1] = $2;
            });

            return uri;
        };
        parseUri.options = {
            strictMode: false,
            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            aq: {
                name: "anchorqueryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            ds: {
                name: "directorySub"
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };

        function getElementLeft(element){
            var actualLeft = element.offsetLeft;
            var current = element.offsetParent;
            while (current !== null){
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            console.log(actualLeft);
            return actualLeft;
        }
        // --------------------可设置项结束------------------------
        // console.log("engineList: ",engineList);
        //xpath 获取单个元素
        function getElementByXPath(xPath, contextNode, doc) {
            doc = doc || document;
            contextNode = contextNode || doc;
            return doc.evaluate(xPath, contextNode, null, 9, null).singleNodeValue;
        }

        // 从函数中获取多行注释的字符串
        function getMStr(fn) {
            var fnSource = fn.toString();
            var ret = {};
            fnSource = fnSource.replace(/^[^{]+/, '');
            // console.log(fnSource);
            var matched;
            var reg = /var\s+([$\w]+)[\s\S]*?\/\*([\s\S]+?)\*\//g;
            while (matched = reg.exec(fnSource)) {
                // console.log(matched);
                ret[matched[1]] = matched[2];
            }

            return ret;
        }

        // 事件支持检测.
        // 比如 eventSupported('fullscreenchange', document);
        function eventSupported(eventName, elem) {
            elem = elem || document.createElement('div');
            var prefix = ['o', 'ms', 'moz', 'webkit', ''];

            var l = prefix.length;
            var pEventName;
            var isFunction;
            var setAttr;

            while(l --) {
                pEventName = 'on' + prefix[l] + eventName;

                if (pEventName in elem) {
                    return pEventName.slice(2);
                } else if (typeof elem.setAttribute == 'function') { // setAttribute 是元素节点的方法
                    setAttr = false;
                    if (!elem.hasAttribute(pEventName)) {
                        setAttr = true;
                        elem.setAttribute(pEventName, 'return;');
                    }

                    isFunction = typeof elem[pEventName] == 'function';

                    if (setAttr) elem.removeAttribute(pEventName);

                    if (isFunction) {
                        return pEventName.slice(2);
                    }
                }
            }

            return false;
        }

         // 保存指定对象相关数据
        var data = (function () {
            //'use strict';

            var cache = {
                objs: [],
                data: {},
            };

            function data(obj, key, value) {
                var id = cache.objs.indexOf(obj);
                if (id == -1) {
                    id = cache.objs.push(obj) - 1;
                }
                if (!cache.data[id]) {//初始化
                    cache.data[id] = {};
                }
                if (typeof value == 'undefined') {// 取值
                    return typeof key == 'undefined' ? cache.data[id] : cache.data[id][key];
                } else {
                    return cache.data[id][key] = value;
                }
            }

            return data;
        })();

        // 为mouseleave mouseenter事件做个兼容
        // 需要 eventSupported， data函数支持
        var mouseEventListener = (function () {

            var support = {
                mouseleave : eventSupported('mouseleave'),
                mouseenter : eventSupported('mouseenter'),
            };

            var map = {
                mouseleave : 'mouseout',
                mouseenter : 'mouseover',
            };

            return {
                add : function (type, ele, callback) { //事件类型，元素，监听函数
                    if (support[type]) {
                        ele.addEventListener(type, callback, false); //mouseleave,enter不冒泡，所以在冒泡阶段监听事件，不要担心子孙元素进出发生的事件冒泡上来。
                    } else {
                        var listener = data(callback, 'mouseELListener');
                        if (!listener) {
                            listener = function (e) {
                                var relatedTarget = e.relatedTarget; //mouseout，去往的元素；mouseover，来自的元素
                                // 当mouseout（离开ele）去往的元素不是自己的子孙元素
                                // 当mouseover（进入ele）来自的元素不是自己的子孙元素
                                if (!ele.contains(relatedTarget)) { // contains函数，自己.contains(自己) 返回true
                                    callback.call(ele, e);
                                }
                            };
                            data(callback, 'mouseELListener', listener);
                        }

                        ele.addEventListener(map[type], listener, true);
                    }
                },
                remove : function (type, ele, callback) {
                    if (support[type]) {
                        ele.removeEventListener(type, callback, false);
                    } else {
                        ele.removeEventListener(map[type], data(callback, 'mouseELListener'), true);
                    }
                },
            };
        })();

        //获取已滚动的距离
        function getScrolled(container) {
            if (container) {
                return {
                    x:container.scrollLeft,
                    y:container.scrollTop,
                };
            }
            return {
                x: 'scrollX' in window ? window.scrollX : ('pageXOffset' in window ? window.pageXOffset : document.documentElement.scrollLeft || document.body.scrollLeft),
                y: 'scrollY' in window ? window.scrollY : ('pageYOffset' in window ? window.pageYOffset :  document.documentElement.scrollTop || document.body.scrollTop),
            };
        }

        function getElement(selector) {
            if (selector.indexOf('css;') == 0) {
                return document.querySelector(selector.slice(4));
            } else {
                return getElementByXPath(selector);
            }
        }

        function mousedownhandler(e) {
            var target = e.target;

            target = getElementByXPath('ancestor-or-self::a[contains(@class, "sej-engine")]', target);

            // if (!target || target.className.indexOf('sej-engine') == -1) return;
            if (!target || !this.contains(target)) return;

            var value;
            if (typeof iInput == 'function') {
                value = iInput();
            } else {
                if (iInput.nodeName == 'INPUT') {
                    value = iInput.value;
                } else {
                    value = iInput.textContent;
                }
            }

            // // @name     searchEngineJump-NextStage
            if (document.characterSet != "UTF-8") value = encodeURIComponent(value);

            var targetURL = target.getAttribute('url');
            // console.log(targetURL);
            // 如果有post请求
            var postSign = targetURL.indexOf('$post$');
            if(~postSign){
                // var targetBlank =
                var f=getPostFormHTML(targetURL.substring(0,postSign),[targetURL.substring(postSign+6),value],target.getAttribute('target'));
                // a = a.replace("$form$", f);
                target.appendChild(f);
                // a = a.replace("$onclick$", "this.getElementsByTagName('form')[0].submit();return false;");
                // target.removeAttribute('onclick');
                target.setAttribute("onclick","this.getElementsByTagName('form')[0].submit();return false;");
                // alert(f);
            } else{
                console.log(value);
                target.href = target.getAttribute('url').replace('%s', value);
            }
        }
         //获取  POST 的表单的 HTML
        function getPostFormHTML(url, value, newTab) {
            console.log(url,value,newTab);
            var ospan = document.createElement('span');
            ospan.style.cssText = 'width:0px;height:0px;';
            var form = "" +
                "<form method='post'" +
                " action='" + url + "'" +
                (newTab ? " target='_blank'" : "") +
                ">" +
                "<input type='hidden'" +
                    " name='" + value[0] + "'" +
                    " value='" + value[1] + "'" +
                    " />" +
                "</form>";
            ospan.innerHTML = form;
            return ospan;
        }

        // iframe 禁止加载
        if (window.self != window.top) return;

        var url = location.href;
        var matchedRule;
        var marchedSign;

        //先判断用户规则
        marchedSign = getSettingData.rules.some(function (rule) {
            rule.url = new RegExp(rule.url.substring(1,rule.url.length-1));
            if (rule.url.test(url)) {
                matchedRule = rule;
                return true;
            }
        });

        // console.log(marchedSign,matchedRule);
        if(!marchedSign){
            rules.some(function (rule) {
                if (rule.url.test(url)) {
                    matchedRule = rule;
                    return true;
                }
            });
        }

        // console.log(matchedRule);
        if (!matchedRule || !matchedRule.enabled) return;

        var iTarget = getElement(matchedRule.insertIntoDoc.target);
        var iInput = typeof matchedRule.insertIntoDoc.keyword == 'function' ? matchedRule.insertIntoDoc.keyword : getElement(matchedRule.insertIntoDoc.keyword);

        ///test -------------- 测试 start
        debug("searchEngineJump test iTarget, iInput: ",iTarget, iInput);
        ///test -------------- 测试 end

        if (!iTarget || !iInput) {
            console.log("目标有误： iTarget：" + iTarget + "\niInput: " + iInput);
            return;
        }

        // 添加全局样式
        var globalStyle = document.createElement('style');
        globalStyle.type = 'text/css';
        globalStyle.textContent = getMStr(function(){
            var cssText;
            /*
                #sej-container {
                    display: block;
                    #position: absolute;
                    #position: fixed;
                    z-index: 2;
                    padding: 1px 5px 1px 5px;
                    line-height: 1.5;
                    font-size: 13px;
                    font-family: arial,sans-serif;
                    transform-origin: top center;
                    #animation: sejopen 0.3s !important;
                    border-bottom-right-radius: 4px;
                }

                #sej-expanded-category {
                    font-weight: bold;
                }

                .sej-engine {
                    line-height: 1.5;
                    display: inline-block;
                    margin: 4px 0px 0 0;
                    border: none;
                    padding: 4px 4px;
                    text-align:center;
                    text-decoration: none;
                    font-weight:500;
                    color: #333 !important;
                    transition: background-color 0.15s ease-in-out;
                }
                .sej-drop-list-trigger {

                }
                .sej-drop-list-trigger-shown {
                    background-color: #DEEDFF !important;
                }
                .sej-drop-list-trigger::after {
                    content: '';
                    display: inline-block;
                    margin: 0 0 0 3px;
                    padding: 0;
                    width: 0;
                    height: 0;
                    border-top: 6px solid #BCBCBC;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                    border-bottom: 0px solid transparent;
                    vertical-align: middle;
                    transition: -webkit-transform 0.3s ease-in-out;
                    transition: transform 0.3s ease-in-out;
                }
                .sej-drop-list-trigger-shown::after {
                    -webkit-transform: rotate(180deg);
                    transform: rotate(180deg);
                }
                .sej-engine:hover {
                    background-color: #EAEAEA;
                }
                .sej-drop-list > .sej-engine {
                    display: block;
                    padding-top: 4px;
                    padding-bottom: 4px;
                    width: 50px;
                }
                .sej-drop-list > .sej-engine:hover {
                    background-color: #DEEDFF;
                }

                .sej-engine-icon {
                    display: block;
                    width: 50px;
                    height: 50px;
                    border: none;
                    padding: 0;
                    margin: 0 0px 0 0;
                    vertical-align: text-bottom;
                }

                .sej-engine-icon-edit {
                    display: block;
                    width: 20px;
                    height: 20px;
                    border: none;
                    padding: 0;
                    margin: 0 0px 0 0;
                    vertical-align: text-bottom;
                }

                .sej-drop-list {
                    position: absolute;
                    display: none;
                    opacity: 0.3;
                    top: -10000px;
                    left: 0;
                    min-width: 50px;
                    border: 1px solid #FAFAFA;
                    padding: 5px 0;
                    text-align: left;
                    font-size: 13px;
                    -moz-box-shadow: 2px 2px 5px #ccc;
                    -webkit-box-shadow: 2px 2px 5px #ccc;
                    box-shadow: 2px 2px 5px #ccc;
                    background-color: white;
                    transition: opacity 0.2s ease-in-out,
                    top 0.2s ease-in-out;
                }
                @keyframes sejopen {
                    0% {
                        transform: scale(1, 0.1);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1, 1);
                        opacity: 1;
                    }
                }
                @keyframes iqxinsejopen {
                    0% {
                        transform: scale(0.01, 0.01);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1, 1);
                        opacity: 1;
                    }
                }
            */
        }).cssText;
        //document.head.appendChild(globalStyle); 插入head和body之间 插入head中百度会不刷新url重置head,只能作为单独的部分插入页面
           iTarget.parentNode.insertBefore(globalStyle, iTarget);
        // 列表对象
        function DropDownList(a, list) {
            this.a = a;
            this.list = list;
            this.init();
        }
        DropDownList.zIndex = 100000000;

        DropDownList.prototype = {
            hidden: true,
            showDelay: 233,
            hideDelay: 233,
            aShownClass: 'sej-drop-list-trigger-shown',

            init: function () {
                var a = this.a;
                var list = this.list;

                var self = this;

                // 进入显示
                mouseEventListener.add('mouseenter', a, function () {
                    clearTimeout(self.hideTimerId);

                    if (self.hidden) {
                        self.showTimerId = setTimeout(function () {
                            self.show();
                        }, self.showDelay);
                    } else {
                        var style = list.style;
                        style.zIndex = DropDownList.zIndex ++;
                        style.opacity = 0.96;
                    }
                });

                // 离开隐藏
                mouseEventListener.add('mouseleave', a, function () {
                    clearTimeout(self.showTimerId);

                    if (!self.hidden) {
                        //list.style.top = parseInt(list.style.top)+6 +"px";
                        list.style.opacity = 0.04;
                        self.hideTimerId = setTimeout(function () {
                            self.hide();
                        }, self.hideDelay);
                    }
                });

                mouseEventListener.add('mouseenter', list, function () {
                    clearTimeout(self.hideTimerId);

                    var style = list.style;
                    style.zIndex = DropDownList.zIndex ++;
                    style.opacity = 0.96;
                });

                mouseEventListener.add('mouseleave', list, function () {

                    list.style.opacity = 0.04;
                    list.style.top = parseInt(list.style.top) +"px";
                    self.hideTimerId = setTimeout(function () {
                        self.hide();
                    }, self.hideDelay);
                });
            },
            show: function () {
                if (!this.hidden) return;
                this.hidden = false;

                var scrolled = getScrolled();
                var aBCRect = this.a.getBoundingClientRect();

                var style = this.list.style;

                var top = scrolled.y + aBCRect.bottom;
                var left = scrolled.x + aBCRect.left;

                style.top = top + 'px';
                style.left = left + 'px';
                style.zIndex = DropDownList.zIndex ++;
                style.display = 'block';

                setTimeout(function () {
                    style.opacity = 0.96;
                    style.top = top + 'px';
                }, 30);

                this.a.classList.add(this.aShownClass);

            },
            hide: function () {
                if (this.hidden) return;
                this.hidden = true;

                var style = this.list.style;
                style.display = 'none';
                style.opacity = 0.1;

                this.a.classList.remove(this.aShownClass);

            }
        };

        var pageEncoding = (document.characterSet || document.charset).toLowerCase();

        // 创建dom
        var aPattern = '<a href="" class="sej-engine" target="$blank$" encoding="$encoding$" url="$url$"><img src="$favicon$" class="sej-engine-icon" />$name$</a>';
        var container = document.createElement('sejspan');
        container.id = 'sej-container';
        container.className = "rwl-exempt";

        container.addEventListener('mousedown', mousedownhandler, true);

        if (matchedRule.style) {
            container.style.cssText = matchedRule.style;
        }

        var dropLists = [];
        engineList.details.forEach(function (item) {
            var category = item[1];
            var cName = item[0];
            var engines = [];

        engineList[category].forEach(function (engine) {
                // 检测是否用搜索搜某一网站 site:xxx.xx
                var engineUrl = engine.url;
                var siteIndex = engineUrl.lastIndexOf("site");
                var siteMark = null;
                if(~siteIndex){
                    var siteURL = engineUrl.slice(siteIndex);
                    siteMark = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/.test(siteURL);
                    // console.log(/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/.test(siteURL),siteURL);
                }

                if (!siteMark && matchedRule.url.test(engineUrl)) return;// 去掉跳转到当前引擎的引擎
                if(engine.disable) return;
                var a = aPattern.replace('$encoding$', (engine.encoding || 'utf-8').toLowerCase())
                    .replace('$url$', engineUrl)
                    .replace('$name$', engine.name);

                if (engine.favicon) {
                    a = a.replace('$favicon$', engine.favicon);
                } else {
                    a = a.replace('src="$favicon$"', '');
                }
                if (getSettingData.newtab || engine.blank) {
                    a = a.replace('$blank$', "_blank");
                } else {
                    a = a.replace('target="$blank$"', '');
                }

                engines.push(a);
            });
            // 非空列表
            if (!engines.length) return;

            engines = engines.join('');

            // 展开当前搜索分类列表
            if (!getSettingData.foldlist && category == matchedRule.engineList) {
                container.innerHTML = engines;
            } else {
                var dropList = document.createElement('sejspan');
                dropList.className = 'sej-drop-list rwl-exempt';
                dropList.innerHTML = engines;

                // 非空列表
                var a = dropList.firstElementChild.cloneNode(true);
                a.className = a.className + ' sej-drop-list-trigger';
                a.lastChild.nodeValue = cName;
                dropLists.push([a, dropList]);
            }
        });

        //将各个搜索列表插入文档中
        dropLists.forEach(function (item) {
            container.appendChild(item[0]);
            //document.body.appendChild(item[1]);插入head和body之间
            iTarget.parentNode.insertBefore(item[1], iTarget);
            item[1].addEventListener('mousedown', mousedownhandler, true);

            new DropDownList(item[0], item[1]);
        });

        // 插入到文档中
        switch (matchedRule.insertIntoDoc.where.toLowerCase()) {
            case 'beforebegin' :
                iTarget.parentNode.insertBefore(container, iTarget);
            break;
            case 'afterbegin' :
                if (iTarget.firstChild) {
                    iTarget.insertBefore(container, iTarget.firstChild);
                } else {
                    iTarget.appendChild(container);
                }
            break;
            case 'beforeend' :
                iTarget.appendChild(container);
            break;
            case 'afterend' :
                if (iTarget.nextSibling) {
                    iTarget.parentNode.insertBefore(container, iTarget.nextSibling);
                } else {
                    iTarget.parentNode.appendChild(container);
                }
            break;
        }

        // -------------------设置相关--------------------------------
        // 设置按钮相关
        var dragEl = null;
        var dragData = null;

        function SEJsetting(){
            this.ele = document.createElement("div");
            this.mask = document.createElement("div");

            this.parentTemp = null;
            this.editTemp = null;
            this.online = null;
            this.init();
        }

        SEJsetting.prototype = {
            testabc : "hahah",
            aPatternParent : "<div></div>",

            init: function () {
                // console.log("init...");
                var that = this;

                this.ele.id = "settingLayer";
                this.mask.id = "settingLayerMask";

                this.addGlobalStyle();

                this.addContent();

                this.mask.addEventListener("click",function(){
                    that.hide();
                });
                this.ele.addEventListener("click",function(e){
                    e.stopPropagation();
                });

                this.mask.appendChild(this.ele);
                document.body.appendChild(this.mask);

                // 绑定事件
                this.ele.addEventListener("click",that.domClick.bind(this),false);
                this.dragEvent();
                // input[range] 滑动条相关
                that.rangeChange(true);
                document.querySelector("#setBtnOpacityRange").addEventListener("input",that.rangeChange);
                document.querySelector("#leftRange").addEventListener("input",that.rangeChange);
                document.querySelector("#topRange").addEventListener("input",that.rangeChange);
            },
            //拖拽相关
            dragEvent: function(){
                var that = this;
                var odivsdrag = document.querySelectorAll(".drag");
                [].forEach.call(odivsdrag,function(odiv){
                    odiv.addEventListener("dragstart",that.domdragstart,false);
                    odiv.addEventListener('dragenter', that.domdragenter, false);
                    odiv.addEventListener('dragover', that.domdragover, false);
                    odiv.addEventListener('dragleave', that.domdragleave, false);
                    odiv.addEventListener('drop', that.domdrop, false);
                    odiv.addEventListener('dragend',that.domdropend, false);
                });
            },
            //按钮相关
            addContent: function(){
                var aPattern = '<span draggable="true" class="drag">' +
                                '<span class="sej-engine"' +
                                ' data-xin="$xin$" ' +
                                ' data-iqxinimg="$img$" ' +
                                ' data-iqxintitle="$title$" ' +
                                ' data-iqxinlink="$link$" ' +
                                ' data-iqxintarget="$blank$" ' +
                                ' data-iqxindisabled="$disabled$" ' +
                                ' title="点击启用或者禁用或者拖拽排序" ' +
                                '><img src="$favicon$" class="sej-engine-icon" style="padding-bottom:3px;"/><span>$name$</span></span>' +
                                ' <span class="iqxin-set-edit" title="编辑"><img class="sej-engine-icon-edit" src="' + icon.edit + '"/></span>' +
                                ' <span class="iqxin-set-del" title="删除"><img class="sej-engine-icon-edit" src="' + icon.del + '"/></span>' +
                                '</span>';
                var details = engineList.details;
                // 若根据数组长度获取，负数引导的为属性，不再length长度之内，所以来个大体的数字，当都为空时，结束循环
                // var detailsLength = details.length;
                var detailsLength = 99;
                for (let i=0;i<detailsLength;i++){
                    var j = i;
                    j = details[j] ? j : -j;
                    if (!details[j]){break;}

                    var odiv = document.createElement("div");
                    odiv.id = details[j][1]; // "web"
                    odiv.classList.add("iqxin-items");

                    var oDivTitle = document.createElement("div");
                    oDivTitle.classList.add("sejtitle","drag");
                    oDivTitle.setAttribute("draggable","true");
                    oDivTitle.dataset.iqxintitle = details[j][1];
                    oDivTitle.dataset.xin = j;
                    oDivTitle.innerHTML ='<span class="iqxin-pointer-events">' + details[j][0] + '</span>' +
                                        '<span class="iqxin-title-edit" title="编辑"><img class="sej-engine-icon-edit" src="' + icon.edit + '"/></span>'+
                                        ' <span class="iqxin-set-title-del" title="删除"><img class="sej-engine-icon-edit" src="' + icon.del + '"></span>';
                    odiv.appendChild(oDivTitle);

                    var oDivCon = document.createElement("div");
                    oDivCon.classList.add("sejcon");
                    var oDivConStr = "";
                    var engineListItme = engineList[details[j][1]];
                    var itemLength = engineListItme.length;
                    for(let ii=0;ii<itemLength;ii++){
                        var jj = ii;
                        if (!engineListItme[jj]){break;}
                        var a = aPattern.replace('$name$', engineListItme[jj].name)
                                .replace('$favicon$', engineListItme[jj].favicon)
                                .replace("$xin$",jj);
                        // 添加属性
                        a = a.replace("$img$", engineListItme[jj].favicon)
                            .replace("$title$", engineListItme[jj].name)
                            .replace("$link$", engineListItme[jj].url);
                        if (engineListItme[jj].blank) {
                            a = a.replace('$blank$', "_blank");
                        } else {
                            a = a.replace('data-iqxintarget="$blank$"', '');
                        }
                        if (engineListItme[jj].disable) {
                            a = a.replace('$disabled$', "true");
                        } else {
                            a = a.replace('data-iqxindisabled="$disabled$"', '');
                        }

                        oDivConStr += a;
                    }

                    oDivConStr +=  "" +
                        '<span class="iqxin-additem" title="添加新的搜索引擎">' +
                        '<img class="sej-engine-icon" src="' + icon.plus + '">' +
                        '</span>' +
                "";

                    oDivCon.innerHTML = oDivConStr;
                    odiv.appendChild(oDivCon);

                    this.ele.appendChild(odiv);
                }

                var fixedTop_checked = getSettingData.fixedTop?"checked":"";
                var debug_checked = getSettingData.debug?"checked":"";
                var foldlist_checked = getSettingData.foldlist?"checked":"";
                var closetext_checked = getSettingData.closetext?"checked":"";
                var animation_checked = getSettingData.animation?"checked":"";

                // 增加搜索列表
                var nSearchList = document.createElement("div");
                nSearchList.id = "nSearchList";
                nSearchList.setAttribute("title","添加新的搜索列表");
                nSearchList.innerHTML = ""+
                "<img class='sej-engine-icon' src='" + icon.plus + "'>" +
                "";
                this.ele.appendChild(nSearchList);

                // 添加按钮
                var btnEle = document.createElement("div");
                btnEle.id = "btnEle";

                var btnStr = "<div class='btnEleLayer'>" +
                            "<span><a target='_blank' href='https://greasyfork.org/zh-CN/scripts/38748-searchenginejump'>油猴</a> <a target='_blank' href='https://github.com/jasonwelld/searchEngineJump'>代码</a></span>" +
                            "<span title='open newtab 是否采用新标签页打开的方式'>打开方式" +
                                "<select id='iqxin-globalNewtab'>" +
                                    "<option value='globalDef'>默认页面</option>" +
                                    "<option value='globalNewtab'" + (getSettingData.newtab?"selected":"")  + ">新标签页</option>" +
                                "</select>" +
                            "</span> " +
                            "<span title='搜索按钮排列方向'>方向" +
                                "<select id='iqxin-prefs-position'>" +
                                    "<option value='Horizontal'>水平</option>" +
                                    "<option value='vertical'" + (getSettingData.position?"selected":"")  + ">竖排</option>" +
                                "</select>" +
                            "</span> " +
                            "<span id='xin-reset' title='慎点，出厂重置'>重置</span>" +
                            "<span id='xin-modification' title='编辑分享自己的配置或清空配置'>配置</span>" +
                            "<span id='iqxin-debugS' title='对设置菜单有一定的影响'>" +
                                "<label>调试<input id='iqxin-debug' type='checkbox' name='' " +
                                    debug_checked +
                                " style='vertical-align:middle;'></label>" +
                            "</span>" +
                            "<span id='xin-foldlists'>" +
                                "<label>折叠分类<input id='iqxin-foldlist' type='checkbox' name='' " +
                                    foldlist_checked +
                                " style='vertical-align:middle;'></label>" +
                            "</span>" +
                            "<span id='xin-closetext'>" +
                                "<label>隐藏文字<input id='iqxin-closetext' type='checkbox' name='' " +
                                    closetext_checked +
                                " style='vertical-align:middle;'></label>" +
                            "</span>" +
                            "<span id='xin-animation'>" +
                                "<label>开启动画<input id='iqxin-animation' type='checkbox' name='' " +
                                    animation_checked +
                                " style='vertical-align:middle;'></label>" +
                            "</span>" +
                            "<span id='iqxin-fixedTopS' title='fixedTop 当滚动页面时，固定按钮'>" +
                                "<label>固定按钮<input id='iqxin-fixedTop' type='checkbox' name='' " +
                                    fixedTop_checked +
                                " style='vertical-align:middle;'></label>" +
                            "</span>" +
                            "<span title='设置按钮透明度'>透明度 <input type='range' step='0.1'  min='0' max='1' value='"+ (getSettingData.setBtnOpacity) +"' id='setBtnOpacityRange'><i style='display:inline-block;width:2em;text-align:center;' class='iqxin-setBtnOpacityRangeValue' title='按钮显示透明度'></i></span>" +
                            "<span title='设置靠左宽度'>靠左 <input type='range' step='1'  min='0' max='95' value='"+ (getSettingData.left) +"' id='leftRange'><i style='display:inline-block;width:2em;text-align:center;' class='iqxin-leftRangeValue' title='设置靠左宽度'></i></span>" +
                            "<span title='设置靠上高度'>靠上 <input type='range' step='1'  min='0' max='50' value='"+ (getSettingData.top) +"' id='topRange'><i style='display:inline-block;width:2em;text-align:center;' class='iqxin-topRangeValue' title='设置靠上高度'></i></span>" +
                            "<span id='xin-save' title='save'>应用</span>" +
                            "<span id='xin-save-close' title='save & close'>保存并关闭</span>" +
                            "</div>";
                btnEle.innerHTML = btnStr;
                this.ele.appendChild(btnEle);

                // 关闭按钮
                    var closebtnELe = document.createElement("span");
                    closebtnELe.id = "xin-close";
                    closebtnELe.setAttribute("title","close 关闭");
                    this.ele.appendChild(closebtnELe);
            },
            show: function(){
                var style = this.mask.style;
                var eleStyle = this.ele.style;
                style.display = "flex";
                eleStyle.transform = "translateY(-20%)";
                document.body.style.overflow = "hidden";

                this.windowResize();

                setTimeout(function () {
                    style.opacity = 1;
                    eleStyle.transform = "none";
                }, 30);
            },
            hide: function(){
                this.allBoxClose(); // 关闭所有次级窗口、菜单

                var style = this.mask.style;
                this.ele.style.transform = "translateY(20%)";
                style.opacity = 0;
                setTimeout(function () {
                    style.display = "none";
                    document.body.style.overflow = "auto";
                }, 500);
                var elems = document.querySelectorAll('#settingLayerMask');
                if (!elems) return;
                console.log("elems: " + elems);
                // return;
                [].forEach.call(elems, function(elem) {
                    elem.parentNode.removeChild(elem);
                });
            },
            reset: function(){
                if(confirm("将会删除用户设置！")){
                    GM_deleteValue("searchEngineJumpData");
                    window.location.reload();
                }
            },

            // 界面，框：添加新的搜索
            addItemBox: function(bool){
                this.isOnline();
                this.addItemBoxRemove();

                var newDiv = document.createElement("div");
                newDiv.id= "newSearchBox";
                newDiv.innerHTML=""+
                    "<span>标&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp题 : </span><input id='iqxin-newTitle' placeholder='必填' onfocus='this.select()' /> <br/><br/>" +
                    "<span>链&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp接 : </span><input id='iqxin-newLink' placeholder='必填' onfocus='this.select()' /> <br/><br/>" +
                    "<span>图&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp标 : </span><input id='iqxin-newIcon' placeholder='选填，留空则自动获取' onfocus='this.select()' /> <br/><br/>" +
                    "<span>打开方式 : " +
                        '<select id="iqxin-newTarget" style="border-radius: 4px;border: none;padding: 2px 0 2px 2px"> ' +
                        '<option value="default">新标签页打开</option> ' +
                        '<option value="newtab">当前页打开</option> ' +
                        '<select> ' +
                    "</span>" +
                    "<br/><br/>" +
                    "<span style=''><a target='_blank' style='color:#999;' href='https://greasyfork.org/zh-CN/scripts/27752-searchenginejump'>相关使用说明</a></span>" +
                    "&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp;" +
                    "<button id='addItemBoxEnter' class='addItemBoxEnter addItemBoxBtn iqxin-enterBtn'>确定</button>&nbsp;&nbsp;&nbsp&nbsp&nbsp;&nbsp" +
                    "<button id='addItemBoxCancel' class='addItemBoxCancel addItemBoxBtn iqxin-closeBtn'>取消</button>" +
                    "";

                this.ele.appendChild(newDiv);
                document.querySelector("#iqxin-newTitle").focus();
            },
            // 内部逻辑，：添加新的搜索
            addItemEnger: function(){
                var otitle,olink,oimg,oblank;
                otitle = document.querySelector("#iqxin-newTitle").value;
                olink = document.querySelector("#iqxin-newLink").value;
                oimg = document.querySelector("#iqxin-newIcon").value;
                oblank = document.querySelector("#iqxin-newTarget").selectedIndex;

                if (!oimg){
                    var uri = parseUri(olink);
                    var ohttp = uri.protocol?uri.protocol:"http";
                    debug("能否连接至google：",this.online);
                    if (this.online){
                        oimg = 'https://www.google.com/s2/favicons?domain=' + uri.host;
                    } else {
                        oimg =  ohttp + "://" + uri.host + "/favicon.ico";
                    }
                }

                var a = '<span class="sej-engine"' +
                            ' data-iqxinimg="$img$" ' +
                            ' data-iqxintitle="$title$" ' +
                            ' data-iqxinlink="$link$" ' +
                            ' data-iqxintarget="$blank$" ' +
                            '><img src="$favicon$" class="sej-engine-icon" />$name$</span>' +
                            '<span class="iqxin-set-edit" title="编辑">' +
                                '<img class="sej-engine-icon-edit" src="' + icon.edit + '">' +
                            '</span> ' +
                            '<span class="iqxin-set-del" title="删除">' +
                                '<img class="sej-engine-icon-edit" src="' + icon.del + '">' +
                            '</span>' ;

                a = a.replace("$img$", oimg)
                    .replace("$title$", otitle)
                    .replace("$link$", olink);

                if (oblank){
                    a = a.replace('data-iqxintarget="$blank$"', '');
                } else {
                    a = a.replace('$blank$', "_blank");
                }

                a = a.replace('$name$', otitle)
                    .replace('$favicon$', oimg);

                var ospan = document.createElement("span");
                ospan.className = "drag";
                ospan.innerHTML = a;

                this.parentNode.insertBefore(ospan,this.parentNode.lastChild);

                // 添加完成，移除添加框
                this.addItemBoxRemove();
            },
            addItemBoxRemove: function(ele){
                ele = ele?ele:"#newSearchBox";
                var newBox = document.querySelector(ele);
                if(newBox){
                    newBox.style.transform = "scale(0.01, 0.01)";
                    newBox.style.opacity = "0";
                    setTimeout(function(){
                        newBox.parentNode.removeChild(newBox);
                    },550);
                }
            },

            // 界面， 框: 添加新的搜索列表
            addSearchListBox: function(){
                var odiv = document.querySelector("#newSearchListBox");
                if (odiv){
                    this.boxClose("#newSearchListBox");
                    return;
                }
                var newDiv = document.createElement("div");
                newDiv.id= "newSearchListBox";

                var myDate = new Date();
                var hash = "user" + myDate.getTime();

                newDiv.innerHTML=""+
                    "<span>列表名称: </span><input id='iqxin-newSearchListName' onfocus='this.select()'>" +
                    "<br><br>" +
                    "<span>内部名称: </span><input id='iqxin-newSearchListInnerName' onfocus='this.select()' value='" + hash + "'>" +
                    "<br><br>" +
                    "<button id='addSearchListBoxEnter' class='addSearchListBoxEnter addItemBoxBtn'>确定</button>&nbsp;&nbsp;&nbsp&nbsp&nbsp;&nbsp" +
                    "<button id='addSearchListBoxCancel' class='addSearchListBoxCancel addItemBoxBtn'>取消</button>" +
                    "";
                this.ele.appendChild(newDiv);

                document.querySelector("#iqxin-newSearchListName").focus();
            },
            addSearchListEnger: function(){
                var name = document.querySelector("#iqxin-newSearchListName").value;
                var innerName = document.querySelector("#iqxin-newSearchListInnerName").value;

                if(innerName.length===0){
                    alert("内部名称不能为空");
                    return;
                }
                if(name.length===0){
                    name = innerName;
                }

                var odiv = document.createElement("div");
                odiv.id = innerName;
                odiv.className = "iqxin-items";
                odiv.innerHTML = "" +
                    '<div class="sejtitle" data-iqxintitle="' + innerName + '" data-xin="99">' +
                        '<span class="iqxin-pointer-events">'+ name +'</span>' +
                        '<span class="iqxin-title-edit" title="编辑">' +
                            '<img class="sej-engine-icon-edit" src="' + icon.edit + '">' +
                        '</span> ' +
                        '<span class="iqxin-set-title-del" title="删除">' +
                            '<img class="sej-engine-icon-edit" src="' + icon.del + '">' +
                        '</span>' +
                    '</div>' +
                    '<div class="sejcon">' +
                        '<span class="iqxin-additem" title="添加新的搜索引擎">' +
                            '<img class="sej-engine-icon" src="' + icon.plus + '">' +
                        '</span>' +
                    '</div>' +
                "";

                // this.boxClose("#newSearchListBox");
                this.addItemBoxRemove("#newSearchListBox");

                var nSearchList = document.querySelector("#nSearchList");
                nSearchList.parentNode.insertBefore(odiv,nSearchList);
            },

            boxClose: function(ele){
                var odiv = document.querySelector(ele);
                if(odiv){
                    odiv.parentNode.removeChild(odiv);
                }
            },

            // 界面 框：修改框
            addEditBox: function(e){
                console.log(e);
                this.addItemBoxRemove();

                var target = e.target.parentNode.firstChild;

                var otitle = target.dataset.iqxintitle;
                var olink = target.dataset.iqxinlink;
                var oicon = target.dataset.iqxinimg;
                var otarget = target.dataset.iqxintarget;
                var odisabled = target.dataset.iqxindisabled;

                this.editTemp = target;

                var strblank;
                if(otarget){
                    strblank = '<option value="default">新标签页打开</option><option value="newtab">当前页打开</option> ';
                } else{
                    strblank = '<option value="default">新标签页打开</option><option value="newtab" selected="selected">当前页打开</option>';
                }

                var strdisable = "";
                if(odisabled){
                    strdisable = "checked='checked'";
                }

                var newDiv = document.createElement("div");
                newDiv.id= "newSearchBox";
                newDiv.style.cssText = "top:"+(e.screenY-120) +"px;left:"+(e.screenX-140) +"px;";
                var innerHTML=""+
                    "<span>标&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp题 : </span><input id='iqxin-newTitle' placeholder='必填' onfocus='this.select()' value='"+ otitle +"' /> <br/><br/>" +
                    "<span>链&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp接 : </span><input id='iqxin-newLink' placeholder='必填' onfocus='this.select()' value='"+ olink +"' /> <br/><br/>" +
                    "<span>图&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp标 : </span><input id='iqxin-newIcon' placeholder='选填，留空则自动获取' onfocus='this.select()' value='"+ oicon +"' /> <br/><br/>" +
                    "<span>打开方式 : " +
                        '<select id="iqxin-newTarget" style="border-radius: 4px;border: none;padding: 2px 0 2px 2px"> ' +
                            '$strblank$' +
                        '<select> ' +
                    "</span>" +
                    "<br/><br/>" +
                    "<span style=''><label>禁用：<input type='checkbox' name='' id='iqxin-newDisabled' $checked$ style='vertical-align:middle;'></label></span>" +
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "<button id='editItemBoxEnter' class='editItemBoxEnter addItemBoxBtn iqxin-enterBtn'>确定</button>&nbsp;&nbsp;&nbsp&nbsp&nbsp;&nbsp" +
                    "<button id='addItemBoxCancel' class='addItemBoxCancel addItemBoxBtn iqxin-closeBtn'>取消</button>" +
                    "";

                newDiv.innerHTML = innerHTML.replace("$strblank$", strblank)
                                    .replace("$checked$",strdisable);

                this.ele.appendChild(newDiv);
                setTimeout(function(){newDiv.style.cssText="";},10);
                document.querySelector("#iqxin-newTitle").select();
            },
            addEditBoxEnger: function(){
                var otitle,olink,oimg,oblank,odisabled;
                otitle = document.querySelector("#iqxin-newTitle").value;
                olink = document.querySelector("#iqxin-newLink").value;
                oimg = document.querySelector("#iqxin-newIcon").value;
                oblank = document.querySelector("#iqxin-newTarget").selectedIndex;
                odisabled = document.querySelector("#iqxin-newDisabled").checked;

                this.editTemp.dataset.iqxintitle = otitle;
                this.editTemp.lastChild.innerText = otitle;  //文本节点

                this.editTemp.dataset.iqxinlink = olink;
                this.editTemp.dataset.iqxinimg = oimg;
                this.editTemp.firstChild.src = oimg;

                // 是否新标签页打开
                if (oblank){
                    this.editTemp.removeAttribute("data-iqxintarget");
                } else {
                    this.editTemp.dataset.iqxintarget = "_blank";
                }
                // 是否禁用
                if (odisabled){
                    this.editTemp.dataset.iqxindisabled = "true";
                } else{
                    this.editTemp.removeAttribute("data-iqxindisabled");
                }

                // 修改完成，移除添加框
                this.addItemBoxRemove();
            },

            // 标题编辑
            addTitleEditBox: function(e){
                this.addItemBoxRemove();

                var element = e.target.parentNode.firstChild;
                element.classList.remove("iqxin-pointer-events");

                var flag = document.querySelector("#titleEdit");
                if(flag){
                    element.innerHTML = element.firstChild.value?element.firstChild.value:"空";
                    element.classList.add("iqxin-pointer-events");
                }else{
                    var oldhtml = element.innerHTML;
                    var newobj = document.createElement("input");
                    newobj.id = "titleEdit";
                    newobj.type = "text";
                    newobj.value = oldhtml;
                    // newobj.onblur = function(){
                    //     element.innerHTML = this.value?this.value:oldhtml;
                    // }
                    newobj.onkeydown = function(e){
                        if((e.keyCode || e.which) == 13){
                            element.innerHTML = this.value?this.value:oldhtml;
                        } else if((e.keyCode || e.which) == 27){
                            element.innerHTML = oldhtml;
                        }

                        element.classList.add("iqxin-pointer-events");
                    };
                    element.innerHTML = "";
                    element.appendChild(newobj);
                    newobj.select();
                }
            },
            addTitleEditBoxRemove:function(){
                var odiv = document.querySelector("#titleEdit");
                if(odiv){
                    odiv.parentNode.innerHTML = odiv.value?odiv.value:"空";
                }
            },

            // 高级菜单，配置文件编辑界面
            editCodeBox: function(){
                console.log("原始数据： ",getSettingData);
                var userSetting = GM_getValue("searchEngineJumpData");
                var editbox = document.createElement("div");
                // var sData =
                editbox.id = "iqxin-editCodeBox";
                editbox.style.cssText = "position:fixed;" +
                    "top:50%;left:50%;" +
                    "transform:translate(-50%,-50%);" +
                    "background:#ccc;" +
                    "border-radius:4px;" +
                    "padding:10px 20px;" ;
                var innerH = " "+
                    "<p><span style='color:red;font-size:1.2em;'>! ! !</span></br>"+
                    "此处有更多的设置选项，自由度更高，</br>"+
                    "但设置错误会导致脚本无法运行"+
                    "</p>" +
                    "<textarea wrap='off' cols='70%' rows='20' style='overflow:auto;border-radius:4px;'>" + JSON.stringify(userSetting,false,4) + "</textarea>" +
                    "<br>" +
                    "<button id='xin-reset'>清空设置</button> &nbsp;&nbsp;&nbsp;" +
                    "<button id='xin-copyCode'>复制</button> &nbsp;&nbsp;&nbsp;" +
                    "<button id='codeboxclose' class='iqxin-closeBtn'>关闭</button> &nbsp;&nbsp;&nbsp;" +
                    "<button id='xin-codeboxsave' class='iqxin-enterBtn'>保存</button>" +
                "";
                // console.log(JSON.stringify(getSettingData,4));
                // console.log(JSON.stringify(getSettingData,null,4));
                editbox.innerHTML = innerH;
                this.ele.appendChild(editbox);
            },
            editCodeBoxSave: function(){
                var codevalue = document.querySelector("#iqxin-editCodeBox textarea").value;
                if(codevalue){
                    // console.log(JSON.parse(codevalue));
                    GM_setValue("searchEngineJumpData",JSON.parse(codevalue));
                    // console.log(GM_getValue("searchEngineJumpData"));
                    // 刷新页面
                    setTimeout(function(){
                        window.location.reload();
                    },300);
                } else {
                    // alert("输入为空");
                    this.reset();
                }
            },
            editCodeBoxClose: function(){
                var box = document.querySelector("#iqxin-editCodeBox");
                if(box){
                    box.parentNode.removeChild(box);
                }
            },

            // 标题点击 （开关搜索列表）（可以并入到下面的点击事件）
            titleClick: function(e){
                var target = e.target;
                target.dataset.xin = -parseInt(target.dataset.xin);
            },
            // 点击事件   此处的 if 需要根据实际情况替换成 elseif (switch)
            domClick: function(e){
                var targetClass = e.target.className;
                var targetid = e.target.id;
                debug("点击事件：%o, ID: %o, class: %o, e: %o",e.target,targetid,targetClass,e);

                // 删除搜索
                if(~e.target.className.indexOf("iqxin-set-del")){
                    // console.log(e.target);
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                }
                // 删除搜索列表
                if(~e.target.className.indexOf("iqxin-set-title-del")){
                    // console.log(e.target, e.target.parentNode.parentNode);
                    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
                }

                if(~e.target.className.indexOf("iqxin-additem")){
                    // console.log("此处会有个弹框添加新搜索");
                    this.parentNode = e.target.parentNode;
                    this.addItemBox();
                    // console.log(this);
                }
                if(e.target.className==="sej-engine"){
                    console.log("sej-engine 被点击");
                    e.target.dataset.iqxindisabled = e.target.dataset.iqxindisabled?"":"true";
                }
                if(~targetClass.indexOf("addItemBoxCancel")){
                    this.addItemBoxRemove();
                }
                // 添加新的搜索 确定
                if(~targetClass.indexOf("addItemBoxEnter")){
                    this.addItemEnger();
                }
                // 添加新的搜索列表 确定
                if(targetid === "nSearchList"){
                    debug("添加新的搜索列表");
                    this.addSearchListBox();
                }
                if(targetid === "addSearchListBoxEnter"){
                    debug("向网页添加元素");
                    this.addSearchListEnger();
                }
                if(targetid === "addSearchListBoxCancel"){
                    debug("移除盒子");
                    // this.boxClose("#newSearchListBox");
                    this.addItemBoxRemove("#newSearchListBox");

                }

                // 修改搜索 确定
                if(~targetClass.indexOf("editItemBoxEnter")){
                    // console.log(e);
                    this.addEditBoxEnger();
                }

                // 编辑框
                if(~e.target.className.indexOf("iqxin-set-edit")){
                    this.addEditBox(e);
                }
                // 标题编辑框
                if(~targetClass.indexOf("iqxin-title-edit")){
                    e.stopPropagation();
                    this.addTitleEditBox(e);
                }
                if(~targetClass.indexOf("sejtitle")){
                    this.titleClick(e);
                }
                // codebox  源代码编辑框
                if(targetid ==="codeboxclose"){
                    this.editCodeBoxClose();
                } else if(targetid==="xin-reset"){
                    this.reset();
                } else if( targetid === "xin-codeboxsave"){
                    this.editCodeBoxSave();
                } else if( targetid === "xin-copyCode"){
                    // this.copyCode();
                    GM_setClipboard(JSON.stringify(getSettingData,false,4));
                    iqxinShowTip("复制成功");
                }

                // 关闭设置菜单
                if (targetid === "xin-close"){
                    this.hide();
                }

                // 空白地方点击
                if(~targetClass.indexOf("iqxin-items") || targetid === "settingLayer" || targetClass==="btnEleLayer"){
                    this.allBoxClose();
                }
            },

            // 关闭所有次级窗口、菜单
            allBoxClose: function(){
                this.addItemBoxRemove(); // 新的搜索添加框
              //  this.addDelremove();  //  增加/删除界面
                this.editCodeBoxClose(); // code编辑框
                this.addTitleEditBoxRemove(); //标题编辑框
                this.addItemBoxRemove("#newSearchListBox"); // 添加新的搜索列表
                this.boxClose("#iqxin-sortBox"); // 搜索列表排序
             //   document.querySelector("#btnEle2").classList.remove("btnEle2active"); // 更多设置
            },

            // 拖拽相关
            domdragstart:function (e) {
                if(~this.className.indexOf("sejtitle")){
                    dragEl = this.parentNode;
                } else{
                    dragEl = this;

                }
                dragData = dragEl.innerHTML;
                    console.info("start");
                    console.info(e.target);

                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/html",dragEl.innerHTML);
            },
            domdragenter:function (e) {
                var target = e.target;
                var targetClass = target.className;
                if(~targetClass.indexOf("sejtitle")){
                    target = target.parentNode;
                }
                target.classList.add('drop-over');
            },
            domdragover:function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'move';
               // return false;

                var _this = e.target;
                var that = _this.parentNode;
                var pparentNode = that.parentNode;

                // 防止跨区域移动
                SEJsetting.prototype.domdropend();
                if(dragEl.className != that.className){
                    console.log("移动对象 之前，现在: ", dragEl.className);
                    console.log(that.className);
                    return;
                }

                // Sortable.js https://github.com/RubaXa/Sortable
                var targetRect = _this.getBoundingClientRect(); //
                var width = targetRect.right - targetRect.left; //目标节点的宽
                var height = targetRect.bottom - targetRect.top; //目标节点的高
                var domPosition = null;
                if(~_this.className.indexOf("sejtitle")){
                    debug(e.clientX,targetRect.left,height,e.clientX - targetRect.left,(e.clientX - targetRect.left) / height);
                    if((e.clientX - targetRect.left) / width > 0.5){
                        debug("右");
                        domPosition = true;
                    }else{
                        debug("左");
                        domPosition = false;
                    }
                } else {
                    if((e.clientY - targetRect.top) / height > 0.5){
                        debug("下");
                        domPosition = true;
                    }else{
                        debug("上");
                        domPosition = false;
                    }
                }

                if(domPosition){
                    if(pparentNode.lastChild == that){
                        pparentNode.insertBefore(dragEl,that);
                    }else{
                        pparentNode.insertBefore(dragEl,that.nextElementSibling);
                    }
                }else{
                    that.parentNode.insertBefore(dragEl,that);
                }
            },
            domdragleave:function (e) {
                var target = e.target;
                var targetClass = target.className;
                if(~targetClass.indexOf("sejtitle")){
                    target = target.parentNode;
                }
                target.classList.remove('drop-over');
            },
            domdrop:function (e) {
                debug("拖拽结束");
                //dragEl.style.transformOrigin = "top center";
                //dragEl.style.animation = "sejopen 0.3s";
                // 重新绑定拖拽事件
                SEJsetting.prototype.dragEvent();
                return false;
            },
            domdropend:function(){
                var dom = document.querySelector(".drop-over");
                if(dom){
                    dom.classList.remove("drop-over");
                }
            },

            // 判断是否能连接至google
            isOnline: function(){
                console.log("this.online",this.online);
                if(this.online)return;

                var that = this;
                var myImage = new Image();
                myImage.src = 'https://www.google.com/s2/favicons?domain=www.baidu.com&' + Math.random() ;
                setTimeout(function(){
                    // console.log("取消加载");
                    console.log(myImage.width);
                    if(myImage.width){
                        that.online = true;
                    }else{
                        myImage.src = undefined;
                        // that.online = "哈哈";
                    }
                },2000);
            },

            // 重新加载工具
            reloadSet: function(){
                var elems = document.querySelectorAll('#sej-container, sejspan.sej-drop-list');
                if (!elems) return;
                console.log("elems: " + elems);
                // return;

                [].forEach.call(elems, function(elem) {
                    elem.parentNode.removeChild(elem);
                });

                iqxinstart();
                iqxinShowTip("保存成功");
            },

            // 设置按钮透明度，靠左宽度，靠上宽度进度条
            rangeChange: function(bool){
                // console.log(this);
                console.log(bool);
                // if(bool){
                var odombtn = document.querySelector("#setBtnOpacityRange");
                    odombtn.style.background = "-webkit-linear-gradient(left,#3ABDC1,#83e7ea) no-repeat, #fff";
                    odombtn.style.backgroundSize = odombtn.value*100 +"% 100%";
                    document.querySelector(".iqxin-setBtnOpacityRangeValue").innerHTML = odombtn.value*100 +"%";
                    getSettingData.setBtnOpacity = odombtn.value;
                var odomleft = document.querySelector("#leftRange");
                    odomleft.style.background = "-webkit-linear-gradient(left,#3ABDC1,#83e7ea) no-repeat, #fff";
                    odomleft.style.backgroundSize = odomleft.value*1 +"% 100%";
                    document.querySelector(".iqxin-leftRangeValue").innerHTML = odomleft.value +"%";
                    getSettingData.left = odomleft.value;
                    var odomtop = document.querySelector("#topRange");
                    odomtop.style.background = "-webkit-linear-gradient(left,#3ABDC1,#83e7ea) no-repeat, #fff";
                    odomtop.style.backgroundSize = odomtop.value*2 +"% 100%";
                    document.querySelector(".iqxin-topRangeValue").innerHTML = odomtop.value +"%";
                    getSettingData.top = odomtop.value;
               // }
            },

            // 窗口大小改变
            windowResize: function(){
                var eleStyle = window.getComputedStyle(this.ele , null);
                var w = parseInt(eleStyle.width) ;
                var h = parseInt(eleStyle.height)  + 54;
                var ww = document.documentElement.clientWidth;
                var wh = document.documentElement.clientHeight;
                var maskStyle = this.mask.style;

                if(w>=ww){
                    maskStyle.justifyContent = "stretch";
                }else{
                    maskStyle.justifyContent = "center";
                }
                if(h>=wh){
                    maskStyle.alignItems = "stretch";
                }else{
                    maskStyle.alignItems = "center";
                }
            },
            saveData: function(){
                //
                this.addTitleEditBoxRemove(); //标题栏处于编辑状态

                var obj = {};
                var parentdiv = document.querySelectorAll("#settingLayer .iqxin-items");
                for (let i=0;i<parentdiv.length;i++){
                    var data = parentdiv[i].querySelectorAll(".sej-engine");
                    var id = parentdiv[i].id;
                    obj[id]=[];
                    for(let ii=0;ii<data.length;ii++){
                        var ij;
                        if (data[ii].dataset.xin<0){
                            ij = -ii;
                        } else {
                            ij = ii;
                        }
                        obj[id][ij]={};
                        obj[id][ij].favicon=data[ii].dataset.iqxinimg;
                        obj[id][ij].name=data[ii].dataset.iqxintitle;
                        obj[id][ij].url=data[ii].dataset.iqxinlink;
                        if(data[ii].dataset.iqxintarget){
                            obj[id][ij].blank=data[ii].dataset.iqxintarget;
                        }
                        if(data[ii].dataset.iqxindisabled){
                            obj[id][ij].disable=data[ii].dataset.iqxindisabled;
                        }
                    }
                }

                // 分类名称
                var engineDetails=[];

                // 分类排序
                var odetails = document.querySelectorAll(".sejtitle");
                var odetailsLength = odetails.length;
                for(let i=0;i<odetailsLength;i++){
                    debug(odetails[i]);
                    engineDetails[i] = [];
                    engineDetails[i][0] = odetails[i].firstChild.innerHTML;
                    engineDetails[i][1] = odetails[i].dataset.iqxintitle;
                    engineDetails[i][2] = odetails[i].dataset.xin>=0?true:false;
                }

                // 新标签页全局设置
                var onewtab = document.querySelector("#iqxin-globalNewtab").selectedIndex;
                //折叠搜索分类
                var foldlist = document.querySelector("#iqxin-foldlist").checked;
                //隐藏按钮文字
                var closetext = document.querySelector("#iqxin-closetext").checked;
                //开启动画
                var animation = document.querySelector("#iqxin-animation").checked;
                // 工具条方向设置
                var position = document.querySelector("#iqxin-prefs-position").selectedIndex;

                // 以防不测，重新获取本地配置文件
                var getData = GM_getValue("searchEngineJumpData");
                getData.newtab = onewtab;
                getData.position = position;
                getData.foldlist = foldlist;
                getData.closetext = closetext;
                getData.animation = animation;
                getData.setBtnOpacity = getSettingData.setBtnOpacity;
                getData.left = getSettingData.left;
                getData.top = getSettingData.top;
                getData.debug = document.querySelector("#iqxin-debug").checked;
                getData.fixedTop = document.querySelector("#iqxin-fixedTop").checked;
                getData.engineDetails = engineDetails;
                getData.engineList = obj;

                debug('将要保存的数据：',getData);
                GM_setValue("searchEngineJumpData",getData);
            },
            addGlobalStyle: function(){
                var head, style;
                var css =
                    "#settingLayerMask{" +
                        "display: none;" +
                        "justify-content: center;" +
                        "align-items: center;" +
                        "position: fixed;" +
                        "top:0; right:0; bottom:0; left:0;" +
                        "background-color: rgba(130,130,130,.5);" +
                        "z-index: 200000000;" +
                        "overflow: auto;" +
                        "font-family: arial,sans-serif;" +
                        "min-height: 100%;" +
                        "font-size:14px;" +
                        "transition:0.5s;" +
                        "opacity:0;" +
                        "user-select: none;" +
                        "-moz-user-select: none;" +
                        //"padding-bottom: 80px;" +
                        "box-sizing: border-box;" +
                    "}" +
                    "#settingLayer{" +
                        "display: inline-block;" +
                        "flex-wrap: wrap;" +
                        "padding: 20px;" +
                        "margin: 0px 5px 50px 5px;" +
                        "background-color: #fff;" +
                        "border-radius: 4px;" +
                        "position: absolute;" +
                        "min-width: 700px;" +
                        "width: 70%;" +
                        "transition:0.5s;" +
                    "}" +
                    ".iqxin-items{" +
                        "min-width:50px;" +
                        "margin: 20px 5px 20px 5px;" +
                    "}" +
                    "#settingLayer .drag{" +
                        "float:left;" +
                        "position: relative;" +
                    "}" +
                    "#settingLayer .sej-engine{" +
                        "display: inline-block;" +
                        "width: 100%;" +
                        "box-sizing: border-box;" +
                    "}" +
                    ".iqxin-pointer-events," +
                    ".sej-engine-icon," +
                    ".sej-engine-icon-edit," +
                    "#settingLayer .sej-engine *{" +
                        "pointer-events:none;" +
                    "}" +
                    ".sejtitle{" +
                        "float:left;" +
                        "text-align: center;" +
                        "padding: 58px 15px 2px 15px;" +
                        "cursor: pointer;" +
                        "position: relative;" +
                    "}" +
                    "#settingLayerMask [data-xin]{" +
                        "margin:4px 0;" +
                        "line-height:1.5;" +
                        "border-radius:4px;" +
                    "}" +
                    ".sejtitle:not([data-xin^='-']):hover{" +
                    "background:#cff9ff;" +
                    "}" +
                    ".sejcon [data-xin]{"+
                        "cursor: pointer;" +
                    "}" +
                    "#settingLayerMask .sej-engine:hover{" +
                        "background-color:#cff9ff" +
                    "}" +
                    "#settingLayerMask [data-iqxindisabled='true']," +
                    "[data-xin^='-']{" +
                        "background-color: #ccc;" +
                        "text-decoration: line-through;" +
                        "text-decoration-color:red;" +
                        "border-radius:2px;" +
                        "transition:.3s;" +
                    "}" +
                    "#settingLayerMask [data-iqxindisabled='true']:hover," +
                    "[data-xin^='-']:hover{" +
                        "background-color: #ffa2a2;" +
                    "}" +
                    "#settingLayerMask label{" +
                        "cursor:pointer;" +
                    "}" +
                    "#settingLayerMask .sej-engine-icon-edit{" +
                        "vertical-align:middle;" +
                    "}" +
                    "#btnEle span{" +
                        "display: inline-block;" +
                        "background: #CCCCCC;" +
                        "margin: 5px 2px 0 5px;" +
                        "padding: 5px 10px;" +
                        "border-radius: 4px;" +
                        "cursor: pointer;" +
                        "outline: none;" +
                        "transition: 0.3s;" +
                    "}" +
                    "#btnEle a{" +
                        "color: #999;" +
                        "text-decoration: none;" +
                    "}" +
                    "#btnEle a:hover{" +
                        "text-decoration: underline;" +
                        "color: #ef8957;" +
                    "}" +
                    "#btnEle>div{" +
                        "width: 100%;" +
                        "display:block;" +
                        "justify-content: space-around;" +
                        "border-radius: 4px;" +
                    "}" +
                    ".drop-over{" +
                        "opacity: 0.6;" +
                    "}" +
                    ".iqxin-title-edit," +
                    ".iqxin-set-edit {" +
                        "visibility: hidden;" +
                        "opacity:0;" +
                        "position: absolute;" +
                        "background: rgba(135, 247, 141, 0.86);" +
                        "color: red;" +
                        "top: 0;" +
                        "transform: translate(0,-50%);" +
                        "left: 0;" +
                        "padding: 3px 3px 3px 3px;" +
                        "border-radius: 2px;" +
                        "cursor: pointer;" +
                        "transition: .3s;" +
                    "}" +
                    ".iqxin-set-title-del," +
                    ".iqxin-set-del {" +
                        "visibility: hidden;" +
                        "opacity:0;" +
                        "position: absolute;" +
                        "background: rgba(135, 247, 141, 0.86);" +
                        "color: red;" +
                        "top: 0;" +
                        "transform: translate(0,-50%);" +
                        "right: 0;" +
                        "padding: 3px 3px 3px 3px;" +
                        "border-radius: 2px;" +
                        "cursor: pointer;" +
                        "transition: .3s;" +
                    "}" +
                    ".iqxin-set-title-del {" +
                        "background: #f18d96;" +
                    "}" +
                    "span.iqxin-additem {" +
                        "display: inline-block;" +
                        "text-align: center;" +
                        "margin: 10px 0;" +
                        "border: 1px" +
                        "color: red;" +
                        "cursor: pointer;" +
                        "visibility:hidden;" +
                        "opacity:0;" +
                        "transition:0.3s;" +
                        "transform:scale(0);" +
                    "}" +
                    "#settingLayer .sejtitle:hover .iqxin-title-edit," +
                    "#settingLayer .sejtitle:hover .iqxin-set-title-del," +
                    "#settingLayer .sejcon:hover .iqxin-additem," +
                    "#settingLayer .sejcon>span:hover .iqxin-set-edit," +
                    "#settingLayer .sejcon>span:hover .iqxin-set-del{" +
                        "visibility:visible;" +
                        "opacity:0.8;" +
                        "transform:scale(1);" +
                    "}" +
                    "#nSearchList {" +
                        "opacity:0.3;" +
                        "position:relative;" +
                        "width: 50px;" +
                        "margin: 20px 5px 20px 5px;" +
                        "border-radius:4px;" +
                        "cursor:pointer;" +
                        "background:#fff;" +
                    "}" +
                    "#nSearchList:hover{" +
                        "opacity:1;" +
                    "}" +
                    "#newSearchListBox," +
                    "#newSearchBox{" +
                        "transition:0.6s;" +
                        "transform-origin: center center;" +
                        "animation-timing-function: ease-in;" +
                        "animation: iqxinsejopen 0.8s;" +
                        "position:fixed;" +
                        "z-index:200000100;" +
                        "top:50%;" +
                        "left:50%;" +
                        "padding:22px;" +
                        "background:rgb(29, 29, 29);" +
                        "border-radius:4px;" +
                        "color: #e8e8e8;" +
                        "margin: -149px -117px;" +
                    "}" +
                    "#newSearchListBox input," +
                    "#newSearchBox input{" +
                        "border: none;" +
                        "padding: 4px 0 4px 5px;" +
                        "border-radius: 4px;" +
                        "outline: none;" +
                    "}" +
                    "#newSearchListBox input:focus," +
                    "#newSearchBox input:focus {" +
                        "background: #f1d2d2;" +
                        "transition: 0.5s;" +
                    "}" +
                    ".addItemBoxBtn{" +
                        "cursor: pointer;" +
                        "background: #fff;" +
                        "border: none;" +
                        "border-radius: 4px;" +
                        "padding: 4px 10px;" +
                        "color: #333;" +
                        "transition:0.3s;" +
                    "}" +
                    "#titleEdit{" +
                        "width:6em;" +
                    "}" +
                    // 按钮效果 ： 确定 取消按钮
                    ".iqxin-closeBtn," +
                    ".iqxin-enterBtn{" +
                        "box-sizing: border-box;" +
                    "}" +
                    ".iqxin-closeBtn:hover{" +
                        "background: #ff6565;" +
                        "border-color: #ff6565;" +
                        "color: #fff;" +
                    "}" +
                    ".iqxin-enterBtn:hover{" +
                        "background: #84bb84;" +
                         "border-color: #84bb84;" +
                         "color: #fff;" +
                    "}" +
                    "#iqxin-editCodeBox button{" +
                        "cursor:pointer;" +
                    "}" +

                    // 关闭按钮
                    "#xin-close{" +
                        "background:white;" +
                        "color:#3ABDC1;" +
                        "line-height:20px;" +
                        "text-align:center;" +
                        "height:20px;" +
                        "width:20px;" +
                        "text-align:center;" +
                        "font-size:20px;" +
                        "padding:10px;" +
                        "border: 3px solid #3ABDC1;" +
                        "border-radius: 50%;" +
                        "transition: .5s;" +
                        "top: -20px;" +
                        "right:-20px;" +
                        "position: absolute;" +
                    "}" +
                    "#xin-close::before{" +
                        "content:'\\2716';" +
                    "}" +
                    "#xin-close:hover{" +
                        "background: indianred;" +
                        "border-color: indianred;" +
                        "color: #fff;" +
                    "}" +
                    // type[range] 效果
                    "input[type=range] {" +
                        "outline: none;" +
                        "-webkit-appearance: none;" +
                        "background:-webkit-linear-gradient(left,#3ABDC1,#83e7ea) no-repeat, #fff;" +
                        "border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/" +
                    "}" +
                    "input[type=range]::-webkit-slider-thumb {" +
                        "-webkit-appearance: none;" +
                    "} " +
                    "input[type=range]::-webkit-slider-runnable-track {" +
                        "height: 10px;" +
                        "border-radius: 10px; /*将轨道设为圆角的*/" +
                        "box-shadow: 0 1px 1px #def3f8, inset 0 .125em .125em #0d1112; /*轨道内置阴影效果*/" +
                    "}" +
                    "input[type=range]::-webkit-slider-thumb {" +
                        "-webkit-appearance: none;" +
                        "height: 18px;" +
                        "width: 18px;" +
                        "margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/" +
                        "background: #fff; " +
                        "border-radius: 50%; /*外观设置为圆形*/" +
                        "border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/" +
                        "box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/" +
                    "}" +
                    "";
                head = document.getElementsByTagName('head')[0];
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = css;
                head.appendChild(style);
            }
        };

        // 设置按钮相关：图标透明度 靠左宽度 靠上宽度 是否固定按钮 是否竖排还是水平排列搜索图标 是否开启动画 是否隐藏文字(当折叠搜索分类功能关闭时才能隐藏文字，避免隐藏搜索分类文字)
        var setBtnStyle = document.createElement('style');
        setBtnStyle.type = 'text/css';
        setBtnStyle.textContent = "#sej-container{" +
                            "opacity:"+getSettingData.setBtnOpacity+";"+
                            "left:"+getSettingData.left+"%;"+
                            "top:"+getSettingData.top+"%;"+
                            (getSettingData.position?"width:50px;":"width:100%;") +
                            (getSettingData.fixedTop?"position:fixed;":"position:absolute;") +
                            (getSettingData.animation?"animation:sejopen 0.5s !important;":"") +
                            (getSettingData.closetext && !getSettingData.foldlist?"font-size:0;":"") +
                        "}" +
                        "#sej-container:hover{" +
                            "opacity:1;" +
                        "}" +
                        "";
            //插入设置按钮
            var setBtn = document.createElement("span");
            setBtn.id = "setBtn";
            iTarget.parentNode.insertBefore(setBtnStyle, iTarget); //插入head和body之间
            setBtn.innerHTML = "<img style='margin:10px 0 20px 20px;width:20px;vertical-align: baseline;display:inline-block;cursor:pointer;' src=" + icon.config + ">";
            document.querySelector("#sej-container").appendChild(setBtn);
            var sejSet = null;

            setBtn.addEventListener("click",setBtnStart);

        // 注册菜单
        GM_registerMenuCommand("search jump 搜索跳转设置",setBtnStart);

        function setBtnStart(){
            if(!document.querySelector("#settingLayerMask")){
                sejSet = new SEJsetting();

                var sej_save = document.querySelector("#xin-save");
                var sej_save_close = document.querySelector("#xin-save-close");
                var odombtn = document.querySelector("#setBtnOpacityRange");
                var odomleft = document.querySelector("#leftRange");
                var odomtop = document.querySelector("#topRange");
                var sej_edit = document.querySelector("#xin-modification");

                // sej_save.addEventListener("click",function(){sejSet.saveData();sejSet.hide();if(!getSettingData.debug)window.location.reload();});
                sej_save.addEventListener("click",function(){sejSet.saveData();sejSet.reloadSet();});
                sej_save_close.addEventListener("click",function(){sejSet.saveData();sejSet.hide();sejSet.reloadSet();});
                odombtn.addEventListener("click",function(){sejSet.saveData();sejSet.reloadSet();});
                odomleft.addEventListener("click",function(){sejSet.saveData();sejSet.reloadSet();});
                odomtop.addEventListener("click",function(){sejSet.saveData();sejSet.reloadSet();});
                // sej_reset.addEventListener("click",function(){sejSet.reset();sejSet.hide();window.location.reload();});
                sej_edit.addEventListener("click",function(){sejSet.editCodeBox();});

                window.addEventListener("resize",sejSet.windowResize.bind(sejSet));
            }
            sejSet.show();
        }

        // 获取存储的数据信息
        function get_data(){
            setData = GM_getValue("searchEngineJumpData");
        }
        var setData = null;
        // get_data();
    }

    // 从此处开始执行
    var debug;
    function reloadDebug(bool) {
        debug = bool ? console.info.bind(console) : function() {};
    }

    // 消息提示框
        // 目前只是为了给用户一个反馈。 - 成功了么 - 嗯，成功了
    var iqxinTimerGlobalTip = null;
    function iqxinShowTip(text,duration){
        console.log("iqxin -- 消息提示框: ", text);
        var odom = document.querySelector("#iqixn-global-tip");
        if(!odom){
            odom = document.createElement("iqxinDiv");
            odom.id = "iqixn-global-tip";
            odom.style.cssText = "" +
                "opacity: 0;" +
                "height: 25px;" +
                "line-height: 25px;" +
                "letter-spacing: 1px;" +
                "font-size: 1em;" +
                "color: #fff;" +
                "padding: 5px 20px;" +
                "border-radius: 5px;" +
                "background-color: #666;" +
                "position: fixed;" +
                "z-index: 200000001;" +
                "left: 50%;" +
                "bottom: 5%;" +
                "transform: translate(-50%);" +
                "transition: .4s;" ;
            document.body.appendChild(odom);
        }

        odom.innerHTML=text;
        odom.style.opacity=1;

        duration = duration?duration:1500;
        //防止持续时间内多次触发提示
        if(!iqxinTimerGlobalTip){
            iqxinTimerGlobalTip = setTimeout(function(){
                odom.style.opacity=0;
                iqxinTimerGlobalTip = null;
            },duration);
        }
    }
        // console.log("普通插入");
        iqxinstart();
})();
