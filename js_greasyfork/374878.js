// ==UserScript==
// @namespace ATGT
// @name            Save baidu wenku doc, press Ctrl-S after page load done. Disable Ads blockers if save failed.
// @name:zh-CN      保存百度文库中的文档，页面加载完后按Ctrl-S。如保存失败，请关闭广告过滤插件，如ABP、uBlock等。
// @description     Save baidu wenku doc as html. Need to Scroll down the web page to load all pages before press Ctrl-S to save, don't scroll too fast to ensure page of doc load complete, prefer use key <Page Down> on your keyboard. Chrome can not load saved html since it blocked some offline js script， Save to PDF in Yandex Browser is a better choice.
// @description:zh-CN 	将百度文库中的文档保存为html。保存前需要滚动页面到底部，不要滚太快以确保页面加载成功，最好用键盘上的<Page Down>键。因为Chrome屏蔽了部分离线js脚本，导致Chrome无法加载保存的html，在Yandex Browser中保存成PDF比较好。
// @version  1.2.2
// @icon       https://www.baidu.com/cache/icon/favicon.ico
// @include    http*://wenku.baidu.com/*

// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/374878/Save%20baidu%20wenku%20doc%2C%20press%20Ctrl-S%20after%20page%20load%20done%20Disable%20Ads%20blockers%20if%20save%20failed.user.js
// @updateURL https://update.greasyfork.org/scripts/374878/Save%20baidu%20wenku%20doc%2C%20press%20Ctrl-S%20after%20page%20load%20done%20Disable%20Ads%20blockers%20if%20save%20failed.meta.js
// ==/UserScript==

/*
ChangeLog:
v1.2:
    28 Nov 2018, update descript for chrome, need to save as pdf.
v1.1:
    28 Nov 2018, remove copy limit.
v1:
    28 Nov 2018, Remove ads and show all pages.
*/

console.log("!!!!!!!!!!!!!!!!!!!!!save-baidu-wenku-doc!!!!!!!!!!!!!!!!!!!!!!!!");
(function () {

    function injectFunction(func) {
        var script = document.createElement('script');
        //script.className = "injectFunction";
        //script.appendChild(document.createTextNode('('+ func +')();'));
        script.appendChild(document.createTextNode('(function (){' + '(' + func + ')();' + '})();'));
        try {
            (document.body || document.head || document.documentElement).appendChild(script);
        } catch(e) {
            console.error("Can not inject function ", func);
        }
    }
    function injectFunctionContent(func) {
        var script = document.createElement('script');
        //script.className = "injectFunction";
        //script.appendChild(document.createTextNode('('+ func +')();'));
        var funcContent = func.toSource();
        if (/^function\s*[\w\d_$]*\(.*\)\s*\{/.test(funcContent)) {
            funcContent = funcContent.replace(/^function\s*[\w\d_$]*\(.*\)\s*\{/, '');
            funcContent = funcContent.replace(/}$/g, '');
        }
        script.appendChild(document.createTextNode(funcContent));
        (document.body || document.head || document.documentElement).appendChild(script);
    }

    function saveConsole() {
        window.console_debug = console.debug;
        window.console_log = console.log;
        window.console_info = console.info;
        window.console_error = console.error;

    }
    injectFunction(saveConsole);

    function hookModJS() {
        console_info("--------> hookModJS");
        var require,
        define;
    !function (obj) {
        function create_async_script(script_src, load_fail_handler) {
            console_info("create_async_script", script_src);
            function load_ok() {
                clearTimeout(scriptLoadTimer)
            }
            if (!(script_src in async_script_list)) {
                async_script_list[script_src] = !0;
                var script = document.createElement('script');
                if (load_fail_handler) {
                    var scriptLoadTimer = setTimeout(load_fail_handler, require.timeout);
                    script.onerror = function () {
                        clearTimeout(scriptLoadTimer),
                        load_fail_handler()
                    },
                    'onload' in script ? script.onload = load_ok : script.onreadystatechange = function () {
                        ('loaded' == this.readyState || 'complete' == this.readyState) && load_ok()
                    }
                }
                return script.type = 'text/javascript',
                    script.src = script_src,
                    head.appendChild(script),
                    script
            }
        }
        function async_load_script(libName, fn_clean_up, fn_fail_handler) {
            var cleanUpHandlerList = libCleanUpHandlerList_Map[libName] || (libCleanUpHandlerList_Map[libName] = []);
            cleanUpHandlerList.push(fn_clean_up);
            var script_src,
                libAttr = libAttr_Map[libName] || {},
                pkg = libAttr.pkg;
            script_src = pkg ? libPkgNameList_Map[pkg].url : libAttr.url || libName,
                create_async_script(script_src, fn_fail_handler && function () {
                    fn_fail_handler(libName)
                })
        }
        var head = document.getElementsByTagName('head')[0],
            libCleanUpHandlerList_Map = {
            },
            libFunc_Map = {
            },
            libMod_Map = {
            },
            async_script_list = {
            },
            libAttr_Map = {
            },
            libPkgNameList_Map = {
            };
        define = function (libName, func) {
            console_info("define ", libName);
            libFunc_Map[libName] = func;
            var cleanUpHandlerList = libCleanUpHandlerList_Map[libName];
            if (cleanUpHandlerList) {
                for (var n = 0, o = cleanUpHandlerList.length; o > n; n++)
                    cleanUpHandlerList[n]();
                delete libCleanUpHandlerList_Map[libName]
            }
        },
            require = function (libName) {
                //console_info("require ", libName);
                if (libName && libName.splice) {
                    //console_info("call require.async");
                    return require.async.apply(this, arguments);
                }
                libName = require.alias(libName);
                //console_info("alias", libName);
                var module = libMod_Map[libName];
                if (module) {
                    //console_info("found in libModMap, return.");
                    return module.exports;
                }
                var modImplFunc = libFunc_Map[libName];
                if (!modImplFunc) {
                    //console_info("Can not found module");
                    throw '[ModJS] Cannot find module `' + libName + '`';
                }
                module = libMod_Map[libName] = {
                    exports: {
                    }
                };
                //console_info("modImplFunc", modImplFunc);
                var n = 'function' == typeof modImplFunc ? modImplFunc.apply(module, [
                    require,
                    module.exports,
                    module
                ]) : modImplFunc;
                //console_info("n", n, "module", module);
                if (libName === 'wkcommon:widget/ui/reader/view/doc/view.js') {
                    console_info('++++++++++++++++++ hook doc/view.js');
                    module.exports.view.prototype._recycleView = function(e) {
                        console_info("hooked _recycleView called");
                     };
                } else if (libName == "wkcommon:widget/ui/reader_plugin/copylimit/copylimit.js") {
                    console_info('++++++++++++++++++ hook copylimit/copylimit.js');
                    module.exports.prototype.isCanCopy = function(e) {
                        console_info("hooked isCanCopy called");
                        return true;
                     };
                }
                return n && (module.exports = n),
                    module.exports
            },
            require.async = function (libList_param, fn_clean_up_handler, fn_fail_handler) {
                function async_load_script_list(libList_tmp) {
                    for (var r = 0, n = libList_tmp.length; n > r; r++) {
                        var libName = libList_tmp[r];
                        if (libName in libFunc_Map) {
                            var libAttr = libAttr_Map[libName];
                            libAttr && 'deps' in libAttr && async_load_script_list(libAttr.deps)
                        } else if (!(libName in loading_status)) {
                            loading_status[libName] = !0,
                            load_cnt++ ,
                            async_load_script(libName, fn_clean_up, fn_fail_handler);
                            var libAttr = libAttr_Map[libName];
                            libAttr && 'deps' in libAttr && async_load_script_list(libAttr.deps)
                        }
                    }
                }
                function fn_clean_up() {
                    if (0 == load_cnt--) {
                        for (var modList = [], i = 0, a = libList_param.length; a > i; i++)
                            modList[i] = require(libList_param[i]);
                        fn_clean_up_handler && fn_clean_up_handler.apply(obj, modList)
                    }
                }
                'string' == typeof libList_param && (libList_param = [libList_param]);
                for (var c = 0, f = libList_param.length; f > c; c++)
                    libList_param[c] = require.alias(libList_param[c]);
                var loading_status = {},
                    load_cnt = 0;
                async_load_script_list(libList_param),
                    fn_clean_up()
            },
            require.resourceMap = function (resMap) {
                var r,
                    tmp_list;
                tmp_list = resMap.res;
                for (r in tmp_list)
                    tmp_list.hasOwnProperty(r) && (libAttr_Map[r] = tmp_list[r]);
                tmp_list = resMap.pkg;
                for (r in tmp_list)
                    tmp_list.hasOwnProperty(r) && (libPkgNameList_Map[r] = tmp_list[r])
            },
            require.loadJs = function (e) {
                create_async_script(e)
            },
            require.loadCss = function (e) {
                if (e.content) {
                    var style = document.createElement('style');
                    style.type = 'text/css',
                        style.styleSheet ? style.styleSheet.cssText = e.content : style.innerHTML = e.content,
                        head.appendChild(style)
                } else if (e.url) {
                    var link = document.createElement('link');
                    link.href = e.url,
                        link.rel = 'stylesheet',
                        link.type = 'text/css',
                        head.appendChild(link)
                }
            },
            require.alias = function (libName) {
                return libName
            },
            require.timeout = 5000
    }(this);
    
        Object.defineProperty(window, 'require', {
            get: function () { return require; },
            set: function (v) {
                //console_info('RO Value! New value: ' + v);
            }
        });
        Object.defineProperty(window, 'define', {
            get: function () { return define; },
            set: function (v) {
                //console_info('RO Value! New value: ' + v);
            }
        });
        /* IMPORTANT
         * must freeze `require', otherwize require.alias/.async/.resouceMap will be modified.
         */
        Object.freeze(define);
        Object.freeze(require);
    }
    injectFunction(hookModJS);

    function tunePage() {
        function continueRead() {
            try {
                /* _recycleView hooked in hookModJS() */
                var v = require('wkcommon:widget/ui/reader/view/doc/view.js').view.prototype._recycleView;
            } catch(e) {
                console_error(e.toString());
                var v = e.toString();
            }
            console_info("doc/view.js ... _recycleView:", v.toSource());
            console_info("continueRead >>> ");
            $('.doc-reader').attr('oncopy', "");
            $(".goBtn").click();
        }

        function removeUseless() {
            var rmNodes = [
                '.fix-searchbar-wrap',
                '.doc-tag',
                '.reader-tools-bar-wrap',
                '#Zuniqueid__3',
                '[id^=html-reader-AD]',
                '.banner-core-wrap',
                '.fc-container',
                '.fc-ppt',
                '#ggbtm-ads',
                '.banner-ad',
            ];
            for (var node of rmNodes) {
                var tmpNodes = $(node);
                if (tmpNodes.length == 0)
                    console_info("No node found for " + node);
                else {
                    $(node).hide();
                    $(node).remove();
                }
            }
        }

        window.addEventListener("load", function () {
            console_info("ready!");
            continueRead();
            removeUseless();
        });
    };
    injectFunction(tunePage);
})();

console.log("!!!!!!!!!!!!!!!!!!!!!/save-baidu-wenku-doc!!!!!!!!!!!!!!!!!!!!!!!!");
