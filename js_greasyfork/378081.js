// ==UserScript==
// @name         优惠购
// @namespace    http://go.newday.me/s/hui-home
// @version      1.4.0
// @icon         http://cdn.newday.me/addon/hui/favicon.ico
// @author       哩呵
// @description  以最优惠的价格，把宝贝抱回家。插件主要功能有：[1] 淘宝商品的优惠券查询与领取 [2] 京东商品的优惠券查询与获取 [3] 展示淘宝、京东等主流商城的商品历史价格图表 [4] 查询、展示淘宝商品的店铺全部优惠券
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://item.jd.com/*
// @match        *://item.jd.hk/*
// @match        *://goods.kaola.com/product/*
// @match        *://you.163.com/item/*
// @match        *://product.suning.com/*
// @match        *://product.dangdang.com/*
// @match        *://item.gome.com.cn/*
// @match        *://*.newday.me/*
// @match        *://*.likestyle.cn/*
// @connect      taobao.com
// @connect      newday.me
// @connect      likestyle.cn
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      https://cdn.staticfile.org/dompurify/2.0.10/purify.min.js
// @require      https://cdn.staticfile.org/qrcode-generator/1.4.4/qrcode.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// @require      https://cdn.staticfile.org/echarts/4.7.0/echarts.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/378081/%E4%BC%98%E6%83%A0%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/378081/%E4%BC%98%E6%83%A0%E8%B4%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var manifest = {
        "name": "yhg",
        "urls": {},
        "apis": {
            "version": "https://api.newday.me/share/hui/version",
            "simple": "https://api.newday.me/share/hui/simple",
            "query": "https://api.newday.me/share/hui/query",
            "trend": "https://api.newday.me/share/hui/trend"
        },
        "logger_level": 3,
        "options_page": "http://go.newday.me/s/hui-option"
    };

    var container = (function () {
        var obj = {
            defines: {},
            modules: {}
        };

        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj.defines[name] = {
                requires: requires,
                callback: callback
            };
        };

        obj.require = function (name, cache) {
            if (typeof cache == "undefined") {
                cache = true;
            }

            name = obj.processName(name);
            if (cache && obj.modules.hasOwnProperty(name)) {
                return obj.modules[name];
            } else if (obj.defines.hasOwnProperty(name)) {
                var requires = obj.defines[name].requires;
                var callback = obj.defines[name].callback;

                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };

        obj.use = function (requires, callback) {
            var module = {
                exports: undefined
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            } else {
                return module.exports;
            }
        };

        obj.register = function (name, module) {
            name = obj.processName(name);
            obj.modules[name] = module;
        };

        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };

        obj.processName = function (name) {
            return name.toLowerCase();
        };

        return {
            define: obj.define,
            use: obj.use,
            register: obj.register,
            modules: obj.modules
        };
    })();

    container.define("gm", [], function () {
        var obj = {};

        obj.ready = function (callback) {
            if (typeof GM_getValue != "undefined") {
                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.ready(callback);
                }, 100);
            }
        };

        return obj;
    });

    /** common **/
    container.define("gmDao", [], function () {
        var obj = {
            items: {}
        };

        obj.get = function (name) {
            return GM_getValue(name);
        };

        obj.getBatch = function (names) {
            var items = {};
            names.forEach(function (name) {
                items[name] = obj.get(name);
            });
            return items;
        };

        obj.getAll = function () {
            return obj.getBatch(GM_listValues());
        };

        obj.set = function (name, item) {
            GM_setValue(name, item);
        };

        obj.setBatch = function (items) {
            for (var name in items) {
                obj.set(name, items[name]);
            }
        };

        obj.setAll = function (items) {
            var names = GM_listValues();
            names.forEach(function (name) {
                if (!items.hasOwnProperty(name)) {
                    obj.remove(name);
                }
            });
            obj.setBatch(items);
        };

        obj.remove = function (name) {
            GM_deleteValue(name);
        };

        obj.removeBatch = function (names) {
            names.forEach(function (name) {
                obj.remove(name);
            });
        };

        obj.removeAll = function () {
            obj.removeBatch(GM_listValues());
        };

        return obj;
    });

    container.define("ScopeDao", [], function () {
        return function (dao, scope) {
            var obj = {
                items: {}
            };

            obj.get = function (name) {
                return obj.items[name];
            };

            obj.getBatch = function (names) {
                var items = {};
                names.forEach(function (name) {
                    if (obj.items.hasOwnProperty(name)) {
                        items[name] = obj.items[name];
                    }
                });
                return items;
            };

            obj.getAll = function () {
                return obj.items;
            };

            obj.set = function (name, item) {
                obj.items[name] = item;

                obj.sync();
            };

            obj.setBatch = function (items) {
                obj.items = Object.assign(obj.items, items);

                obj.sync();
            };

            obj.setAll = function (items) {
                obj.items = Object.assign({}, items);

                obj.sync();
            };

            obj.remove = function (name) {
                delete obj.items[name];

                obj.sync();
            };

            obj.removeBatch = function (names) {
                names.forEach(function (name) {
                    delete obj.items[name];
                });

                obj.sync();
            };

            obj.removeAll = function () {
                obj.items = {};

                obj.getDao().remove(obj.getScope());
            };

            obj.init = function () {
                var items = obj.getDao().get(obj.getScope());
                if (items instanceof Object) {
                    obj.items = items;
                }
            };

            obj.sync = function () {
                obj.getDao().set(obj.getScope(), obj.items);
            };

            obj.getDao = function () {
                return dao;
            };

            obj.getScope = function () {
                return scope;
            };

            return obj.init(), obj;
        };
    });

    container.define("config", ["factory"], function (factory) {
        var obj = {};

        obj.getConfig = function (name) {
            return obj.getDao().get(name);
        };

        obj.setConfig = function (name, value) {
            obj.getDao().set(name, value);
        };

        obj.getAll = function () {
            return obj.getDao().getAll();
        };

        obj.getDao = function () {
            return factory.getConfigDao();
        };

        return obj;
    });

    container.define("storage", ["factory"], function (factory) {
        var obj = {};

        obj.getValue = function (name) {
            return obj.getDao().get(name);
        };

        obj.setValue = function (name, value) {
            obj.getDao().set(name, value);
        };

        obj.getAll = function () {
            return obj.getDao().getAll();
        };

        obj.getDao = function () {
            return factory.getStorageDao();
        };

        return obj;
    });

    container.define("option", ["config", "constant"], function (config, constant) {
        var obj = {
            name: "option",
            constant: constant.option
        };

        obj.isOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };

        obj.setOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };

        obj.setOptionUnActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };

        obj.getOption = function () {
            var option = [];
            var optionList = obj.getOptionList();
            Object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (optionList.hasOwnProperty(name)) {
                    if (optionList[name] != "no") {
                        option.push(name);
                    }
                }
                else if (item.value != "no") {
                    option.push(name);
                }
            });
            return option;
        };

        obj.setOption = function (option) {
            var optionList = {};
            Object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (option.indexOf(name) >= 0) {
                    optionList[name] = "yes";
                } else {
                    optionList[name] = "no";
                }
            });
            obj.setOptionList(optionList);
        };

        obj.getOptionList = function () {
            var optionList = config.getConfig(obj.name);
            return optionList ? optionList : {};
        };

        obj.setOptionList = function (optionList) {
            config.setConfig(obj.name, optionList);
        };

        return obj;
    });

    container.define("manifest", [], function () {
        var obj = {
            manifest: manifest
        };

        obj.getItem = function (name) {
            return obj.manifest[name];
        };

        obj.getManifest = function () {
            return obj.manifest;
        };

        obj.getName = function () {
            return obj.getItem("name");
        };

        obj.getAppName = function () {
            return obj.getItem("app_name");
        };

        obj.getUrl = function (name) {
            var urls = obj.getItem("urls");
            (urls instanceof Object) || (urls = {});
            return urls[name];
        };

        obj.getApi = function (name) {
            var apis = obj.getItem("apis");
            (apis instanceof Object) || (apis = {});
            return apis[name];
        };

        obj.getOptionsPage = function () {
            if (GM_info.script.optionUrl) {
                return GM_info.script.optionUrl;
            }
            else {
                return obj.getItem("options_page");
            }
        };

        return obj;
    });

    container.define("env", ["config", "manifest"], function (config, manifest) {
        var obj = {
            modes: {
                ADDON: "addon",
                SCRIPT: "script"
            },
            browsers: {
                FIREFOX: "firefox",
                EDG: "edg",
                EDGE: "edge",
                BAIDU: "baidu",
                LIEBAO: "liebao",
                UC: "uc",
                QQ: "qq",
                SOGOU: "sogou",
                OPERA: "opera",
                MAXTHON: "maxthon",
                IE2345: "2345",
                SE360: "360",
                CHROME: "chrome",
                SAFIRI: "safari",
                OTHER: "other"
            }
        };

        obj.getName = function () {
            return manifest.getName();
        };

        obj.getMode = function () {
            if (GM_info.mode) {
                return GM_info.mode;
            }
            else {
                return obj.modes.SCRIPT;
            }
        };

        obj.getAid = function () {
            if (GM_info.scriptHandler) {
                return GM_info.scriptHandler.toLowerCase();
            }
            else {
                return "unknown";
            }
        };

        obj.getUid = function () {
            var uid = config.getConfig("uid");
            if (!uid) {
                uid = obj.randString(32);
                config.setConfig("uid", uid);
            }
            return uid;
        };

        obj.getBrowser = function () {
            if (!obj._browser) {
                obj._browser = obj.matchBrowserType(navigator.userAgent);
            }
            return obj._browser;
        };

        obj.getVersion = function () {
            return GM_info.script.version;
        };

        obj.getEdition = function () {
            return GM_info.version;
        };

        obj.getInfo = function () {
            return {
                mode: obj.getMode(),
                aid: obj.getAid(),
                uid: obj.getUid(),
                browser: obj.getBrowser(),
                version: obj.getVersion(),
                edition: obj.getEdition()
            };
        };

        obj.matchBrowserType = function (userAgent) {
            var browser = obj.browsers.OTHER;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/firefox/) != null) {
                browser = obj.browsers.FIREFOX;
            } else if (userAgent.match(/edge/) != null) {
                browser = obj.browsers.EDGE;
            } else if (userAgent.match(/edg/) != null) {
                browser = obj.browsers.EDG;
            } else if (userAgent.match(/bidubrowser/) != null) {
                browser = obj.browsers.BAIDU;
            } else if (userAgent.match(/lbbrowser/) != null) {
                browser = obj.browsers.LIEBAO;
            } else if (userAgent.match(/ubrowser/) != null) {
                browser = obj.browsers.UC;
            } else if (userAgent.match(/qqbrowse/) != null) {
                browser = obj.browsers.QQ;
            } else if (userAgent.match(/metasr/) != null) {
                browser = obj.browsers.SOGOU;
            } else if (userAgent.match(/opr/) != null) {
                browser = obj.browsers.OPERA;
            } else if (userAgent.match(/maxthon/) != null) {
                browser = obj.browsers.MAXTHON;
            } else if (userAgent.match(/2345explorer/) != null) {
                browser = obj.browsers.IE2345;
            } else if (userAgent.match(/chrome/) != null) {
                if (navigator.mimeTypes.length > 10) {
                    browser = obj.browsers.SE360;
                } else {
                    browser = obj.browsers.CHROME;
                }
            } else if (userAgent.match(/safari/) != null) {
                browser = obj.browsers.SAFIRI;
            }
            return browser;
        };

        obj.randString = function (length) {
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            var text = "";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        return obj;
    });

    container.define("http", [], function () {
        var obj = {};

        obj.ajax = function (option) {
            var details = {
                method: option.type,
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    option.success && option.success(result.response);
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };

            // 提交数据
            if (option.data instanceof Object) {
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }

            // 自定义头
            if (option.headers) {
                details.headers = option.headers;
            }

            // 超时
            if (option.timeout) {
                details.timeout = option.timeout;
            }

            GM_xmlhttpRequest(details);
        };

        return obj;
    });

    container.define("router", [], function () {
        var obj = {};

        obj.getUrl = function () {
            return location.href;
        };

        obj.goUrl = function (url) {
            location.href = url;
        };

        obj.openUrl = function (url) {
            window.open(url);
        };

        obj.openTab = function (url, active) {
            GM_openInTab(url, !active);
        };

        obj.jumpLink = function (jumpUrl, jumpMode) {
            switch (jumpMode) {
                case 9:
                    // self
                    obj.goUrl(jumpUrl);
                    break;
                case 6:
                    // new
                    obj.openUrl(jumpUrl);
                    break;
                case 3:
                    // new & not active
                    obj.openTab(jumpUrl, false);
                    break;
                case 1:
                    // new & active
                    obj.openTab(jumpUrl, true);
                    break;
            }
        };

        obj.getUrlParam = function (name) {
            var param = obj.parseUrlParam(obj.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };

        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };

        return obj;
    });

    container.define("logger", ["env", "manifest"], function (env, manifest) {
        var obj = {
            constant: {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                NONE: 4
            }
        };

        obj.debug = function (message) {
            obj.log(message, obj.constant.DEBUG);
        };

        obj.info = function (message) {
            obj.log(message, obj.constant.INFO);
        };

        obj.warn = function (message) {
            obj.log(message, obj.constant.WARN);
        };

        obj.error = function (message) {
            obj.log(message, obj.constant.ERROR);
        };

        obj.log = function (message, level) {
            if (level < manifest.getItem("logger_level")) {
                return false;
            }

            console.group("[" + env.getName() + "]" + env.getMode());
            console.log(message);
            console.groupEnd();
        };

        return obj;
    });

    container.define("meta", ["env", "$"], function (env, $) {
        var obj = {};

        obj.existMeta = function (name) {
            name = obj.processName(name);
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.appendMeta = function (name, content) {
            name = obj.processName(name);
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };

        obj.processName = function (name) {
            return env.getName() + "::" + name;
        };

        return obj;
    });

    container.define("unsafeWindow", [], function () {
        if (typeof unsafeWindow == "undefined") {
            return window;
        }
        else {
            return unsafeWindow;
        }
    });

    container.define("svgCrypt", ["Snap"], function (Snap) {
        var obj = {};

        obj.getReqData = function () {
            var reqTime = Math.round(new Date().getTime() / 1000);
            var reqPoint = obj.getStrPoint("timestamp:" + reqTime);
            return {
                req_time: reqTime,
                req_point: reqPoint
            };
        };

        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }

            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = Snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };

        return obj;
    });

    container.define("calendar", [], function () {
        var obj = {};

        obj.getTime = function () {
            return (new Date()).getTime();
        };

        obj.formatTime = function (format, timestamp) {
            format || (format = "Y-m-d H:i:s");
            timestamp || (timestamp = obj.getTime());
            var date = new Date(timestamp);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return obj.replaceVars(vars, format);
        };

        obj.replaceVars = function (vars, value) {
            Object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };

        return obj;
    });

    container.define("oneData", ["env", "http"], function (env, http) {
        var obj = {};

        obj.requestOneApi = function (url, data, callback) {
            http.ajax({
                type: "post",
                url: url,
                dataType: "json",
                data: Object.assign(env.getInfo(), data),
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        return obj;
    });

    container.define("$extend", ["$", "DOMPurify", "logger"], function ($, DOMPurify, logger) {
        var obj = {};

        obj.init = function () {
            if (DOMPurify && DOMPurify instanceof Function) {
                var domPurify = DOMPurify(window);
                $.fn.safeHtml = function (html) {
                    try {
                        this.html(domPurify.sanitize(html));
                    }
                    catch (err) {
                        logger.error(err);
                    }
                };
            }
            else {
                $.fn.safeHtml = function (html) {
                    this.html(html);
                };
            }
        };

        return obj.init(), obj;
    });

    container.define("appRunner", ["router", "logger", "meta", "$"], function (router, logger, meta, $, require) {
        var obj = {};

        obj.run = function (appList) {
            var metaName = "status";
            if (meta.existMeta(metaName)) {
                logger.info("setup already");
            }
            else {
                // 添加meta
                meta.appendMeta(metaName);

                // 运行应用
                $(function () {
                    obj.runAppList(appList);
                });
            }
        };

        obj.runAppList = function (appList) {
            var url = router.getUrl();
            for (var i in appList) {
                var app = appList[i];

                var match = obj.matchApp(url, app);
                if (match == false) {
                    continue;
                }

                if (require(app.name).run() == true) {
                    break;
                }
            }
        };

        obj.matchApp = function (url, app) {
            var match = false;
            app.matchs.forEach(function (item) {
                if (url.indexOf(item) > 0 || item == "*") {
                    match = true;
                }
            });
            return match;
        };

        return obj;
    });

    /** custom **/
    container.define("factory", ["gmDao", "ScopeDao"], function (gmDao, ScopeDao) {
        var obj = {
            daos: {}
        };

        obj.getConfigDao = function () {
            return obj.getDao("config", function () {
                return ScopeDao(gmDao, "$config");
            });
        };

        obj.getStorageDao = function () {
            return obj.getDao("storage", function () {
                return ScopeDao(gmDao, "$storage");
            });
        };

        obj.getDao = function (key, createFunc) {
            if (!obj.daos.hasOwnProperty(key)) {
                obj.daos[key] = createFunc();
            }
            return obj.daos[key];
        };

        return obj;
    });

    container.define("constant", [], function () {
        return {
            site: {
                taobao: "taobao",
                jd: "jd",
                kaola: "kaola",
                guomei: "guomei",
                yanxuan: "yanxuan",
                suning: "suning",
                dangdang: "dangdang",
                newday: "newday"
            },
            option: {
                chart_scale: {
                    name: "chart_scale",
                    value: "yes"
                },
                chart_point: {
                    name: "chart_point",
                    value: "yes"
                },
                chart_zoom: {
                    name: "chart_zoom",
                    value: "no"
                },
                taobao_detail: {
                    name: "taobao",
                    value: "yes"
                },
                taobao_shop_coupon: {
                    name: "taobao_shop_coupon",
                    value: "yes"
                },
                taobao_search: {
                    name: "taobao_search",
                    value: "yes"
                },
                taobao_shop: {
                    name: "taobao_shop",
                    value: "yes"
                },
                jd_detail: {
                    name: "jd",
                    value: "yes"
                },
                kaola_detail: {
                    name: "kaola",
                    value: "yes"
                },
                yanxuan_detail: {
                    name: "yanxuan",
                    value: "yes"
                },
                suning_detail: {
                    name: "suning",
                    value: "yes"
                },
                dangdang_detail: {
                    name: "dangdang",
                    value: "yes"
                },
                guomei_detail: {
                    name: "guomei",
                    value: "yes"
                }
            }
        };
    });

    container.define("resource", [], function () {
        var obj = {};

        obj.getText = function (name) {
            if (name == "style") {
                return obj.getStyleText();
            }
            else {
                return "";
            }
        };

        obj.getStyleText = function () {
            return '#tb-cool-area{border:1px solid #eee;margin:0 auto;position:relative;clear:both;display:none}#tb-cool-area .tb-cool-area-home{position:absolute;top:5px;right:10px;z-index:10000}#tb-cool-area .tb-cool-area-home a{cursor:pointer;color:#515858;font-size:10px;text-decoration:none}#tb-cool-area .tb-cool-area-home a.new-version{color:#ff0036}#tb-cool-area .tb-cool-area-benefit{width:240px;float:left}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode{text-align:center;min-height:150px;margin-top:40px}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode canvas,#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode img{margin:0 auto}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title{margin-top:20px;color:#000;font-size:14px;font-weight:700;text-align:center}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title span{color:#ff0036;font-weight:700}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action{margin-top:10px;text-align:center}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action a{text-decoration:none}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button{min-width:120px;padding:0 8px;line-height:35px;color:#fff;background:#ff0036;font-size:13px;font-weight:700;letter-spacing:1.5px;margin:0 auto;text-align:center;border-radius:15px;display:inline-block;cursor:pointer}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button.quan-none{color:#000;background:#bec5c5}#tb-cool-area .tb-cool-area-history{height:300px;overflow:hidden;position:relative}#tb-cool-area .tb-cool-area-history #tb-cool-area-chart,#tb-cool-area .tb-cool-area-history .tb-cool-area-container{width:100%;height:100%}#tb-cool-area .tb-cool-area-history .tb-cool-history-tip{position:absolute;margin:0;top:50%;left:50%;letter-spacing:1px;font-size:15px;transform:translateX(-50%) translateY(-50%)}#tb-cool-area .tb-cool-area-table{margin-top:10px;position:relative;overflow:hidden}#tb-cool-area .tb-cool-quan-tip{position:absolute;margin:0;top:50%;left:50%;letter-spacing:1px;font-size:15px;opacity:0;transform:translateX(-50%) translateY(-50%)}#tb-cool-area .tb-cool-quan-tip a{color:#333;font-weight:400;text-decoration:none}#tb-cool-area .tb-cool-quan-tip a:hover{color:#ff0036}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table{width:100%;font-size:14px;text-align:center}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td{padding:4px;color:#1c2323;border-top:1px solid #eee;border-left:1px solid #eee}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td span{color:#ff0036;font-weight:700}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td:first-child{border-left:none}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link{width:60px;line-height:24px;font-size:12px;background:#ff0036;text-decoration:none;display:inline-block}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-enable{cursor:pointer;color:#fff}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-disable{cursor:default;color:#000;background:#ccc}#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-tip{opacity:1}#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-table{filter:blur(3px);-webkit-filter:blur(3px);-moz-filter:blur(3px);-ms-filter:blur(3px)}.tb-cool-box-area{position:absolute;top:10px;left:5px;z-index:9999}.tb-cool-box-wait{cursor:pointer}.tb-cool-box-already{position:relative}.tb-cool-box-info{width:auto!important;height:auto!important;padding:6px 8px!important;font-size:12px;color:#fff!important;border-radius:15px;cursor:pointer}.tb-cool-box-info,.tb-cool-box-info:hover,.tb-cool-box-info:visited{text-decoration:none!important}.tb-cool-box-info-default{background:#3186fd!important}.tb-cool-box-info-find{background:#ff0036!important}.tb-cool-box-info-empty{color:#000!important;background:#ccc!important}.tb-cool-box-info-translucent{opacity:.33}.mui-zebra-module .tb-cool-box-info{font-size:10px}.import-shangou-itemcell .tb-cool-box-area,.zebra-ziying-qianggou .tb-cool-box-area{right:10px;left:auto}.item_s_cpb .tb-cool-box-area{top:auto;bottom:10px}.j-mdv-chaoshi .m-floor .tb-cool-box-area a{width:auto;height:auto}.left-wider .proinfo-main{margin-bottom:40px}.detailHd .m-info{margin-bottom:20px}.tb-cool-quan-date{color:#233b3d;font-weight:400;font-size:12px}.tb-cool-area-has-date .tb-cool-quan-qrcode{margin-top:30px!important}.tb-cool-area-has-date .tb-cool-quan-title{margin-top:10px!important}';
        };

        return obj;
    });

    container.define("api", ["http", "manifest", "oneData", "svgCrypt"], function (http, manifest, oneData, svgCrypt) {
        var obj = {};

        obj.versionQuery = function (callback) {
            oneData.requestOneApi(manifest.getApi("version"), {}, callback);
        };

        obj.itemQuery = function (url, callback) {
            var data = {
                item_url: url,
                item_point: svgCrypt.getStrPoint(url)
            };
            oneData.requestOneApi(manifest.getApi("query"), data, callback);
        };

        obj.basicQuery = function (itemId, callback) {
            var data = {
                item_id: itemId,
                item_point: svgCrypt.getStrPoint(itemId)
            };
            oneData.requestOneApi(manifest.getApi("simple"), data, callback);
        };

        obj.trendQuery = function (url, callback) {
            var data = {
                item_url: url,
                item_point: svgCrypt.getStrPoint(url)
            };
            oneData.requestOneApi(manifest.getApi("trend"), data, callback);
        };

        obj.couponQueryShop = function (shopId, callback) {
            http.ajax({
                type: "get",
                url: "https://cart.taobao.com/json/GetPriceVolume.do?sellerId=" + shopId,
                dataType: "json",
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        return obj;
    });

    container.define("runtime", ["router", "manifest", "calendar", "storage", "api"], function (router, manifest, calendar, storage, api) {
        var obj = {};

        obj.openOptionsPage = function () {
            router.openTab(manifest.getOptionsPage(), true);
        };

        obj.initVersion = function () {
            var versionDate = parseInt(storage.getValue("version_date"));
            var currentDate = calendar.formatTime("Ymd");
            if (!versionDate || versionDate < currentDate) {
                api.versionQuery(function (response) {
                    storage.setValue("version_date", currentDate);

                    if (response && response.code == 1 && response.data instanceof Object) {
                        var versionPayload = response.data;
                        storage.setValue("version_payload", versionPayload);
                        storage.setValue("version_latest", versionPayload.version);
                    }
                });
            }
        };

        obj.initRuntime = function () {
            obj.initVersion();
        };

        return obj;
    });

    container.define("core", ["config", "env", "router", "resource", "runtime", "$", "$extend"], function (config, env, router, resource, runtime, $) {
        var obj = {};

        obj.appendStyle = function () {
            var styleText = resource.getText("style");
            $("<style></style>").text(styleText).appendTo($("head"));
        };

        obj.jumpCouponLink = function (jumpUrl, jumpMode) {
            var callback = function () {
                router.jumpLink(jumpUrl, jumpMode);
            };

            var swal = swal ? swal : window.swal;
            if (!swal || env.getBrowser() != env.browsers.SE360) {
                callback();
            }
            else if (config.getConfig("remember")) {
                callback();
            }
            else {
                swal({ text: "...", button: false });
                $(".swal-text").html('<div style="line-height:35px;font-size:.8rem;text-align:center"><span style="font-size:1rem;font-weight:700">即将跳转到淘宝客链接领取优惠券...</span><br><span style="font-size:.8rem">只是去领取优惠券，对购物没有任何影响哦！</span><br><span><input id="nd-ignore-jump-dialog" type="checkbox" style="vertical-align:middle"></span><span>不再提示</span> <span><a id="nd-canel-jump-link" style="cursor:pointer;color:#333;text-decoration:none;border:1px solid #b8b7bd;padding:5px;margin-left:10px">还是算了</a> <a id="nd-confirm-jump-link" style="cursor:pointer;color:#ff0036;text-decoration:none;background-color:#ffeded;border:1px solid #ff0036;padding:5px;margin-left:10px">同意跳转</a></span></div>');
                $(".swal-overlay").css("z-index", 99999999);
                $("#nd-canel-jump-link").click(function () {
                    swal.close();
                });
                $("#nd-confirm-jump-link").click(function () {
                    if ($("#nd-ignore-jump-dialog").prop("checked")) {
                        config.setConfig("remember", "yes");
                    }
                    callback();
                });
            }
        };

        obj.ready = function (callback) {
            runtime.initRuntime();

            obj.appendStyle();

            callback && callback();
        };

        return obj;
    });

    /** app **/
    container.define("app_detail", ["router", "option", "env", "calendar", "constant", "core", "runtime", "api", "echarts", "$"], function (router, option, env, calendar, constant, core, runtime, api, echarts, $) {
        var obj = {
            trendData: null
        };

        obj.getSite = function () {
            return obj.matchSite(router.getUrl());
        };

        obj.getItemUrl = function () {
            return obj.matchItemUrl(router.getUrl());
        };

        obj.run = function () {
            var site = obj.getSite();
            switch (site) {
                case constant.site.taobao:
                    option.isOptionActive(option.constant.taobao_detail) && obj.initDetailTaoBao();
                    break;
                case constant.site.jd:
                    option.isOptionActive(option.constant.jd_detail) && obj.initDetailJd();
                    break;
                case constant.site.kaola:
                    option.isOptionActive(option.constant.kaola_detail) && obj.initDetailKaoLa();
                    break;
                case constant.site.yanxuan:
                    option.isOptionActive(option.constant.yanxuan_detail) && obj.initDetailYanXuan();
                    break;
                case constant.site.suning:
                    option.isOptionActive(option.constant.suning_detail) && obj.initDetailSuNing();
                    break;
                case constant.site.dangdang:
                    option.isOptionActive(option.constant.dangdang_detail) && obj.initDetailDangDang();
                    break;
                case constant.site.guomei:
                    option.isOptionActive(option.constant.guomei_detail) && obj.initDetailGuoMei();
                    break;
                default:
                    return false;
            }
            return true;
        };

        obj.initDetailTaoBao = function () {
            if ($('#detail').length || $(".ju-wrapper").length) {
                var html = obj.getAppendHtml();
                if ($("#J_DetailMeta").length) {
                    $("#J_DetailMeta").append(html);
                } else {
                    $("#detail").append(html + "<br/>");
                }

                var onEmpty = function () {
                    obj.showText("打开淘宝扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailTaoBao();
                }, 1000);
            }
        };

        obj.initDetailJd = function () {
            if ($(".product-intro").length) {
                var html = obj.getAppendHtml();
                $(".product-intro").append(html);

                var onEmpty = function () {
                    obj.showText("打开京东扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailJd();
                }, 1000);
            }
        };

        obj.initDetailKaoLa = function () {
            if ($("#j-producthead").length) {
                var html = obj.getAppendHtml();
                $("#j-producthead").after(html);

                var onEmpty = function () {
                    obj.showText("打开考拉扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailKaoLa();
                }, 1000);
            }
        };

        obj.initDetailYanXuan = function () {
            if ($(".detailHd").length) {
                var html = obj.getAppendHtml();
                $(".detailHd").append(html);

                var onEmpty = function () {
                    obj.showText("打开严选扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailYanXuan();
                }, 1000);
            }
        };

        obj.initDetailSuNing = function () {
            if ($(".proinfo-container").length) {
                var html = obj.getAppendHtml();
                $(".proinfo-container").append(html);

                var onEmpty = function () {
                    obj.showText("打开苏宁扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailSuNing();
                }, 1000);
            }
        };

        obj.initDetailDangDang = function () {
            if ($(".product_main").length) {
                var html = obj.getAppendHtml();
                $(".product_main").append(html);

                var onEmpty = function () {
                    obj.showText("打开当当扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailDangDang();
                }, 1000);
            }
        };

        obj.initDetailGuoMei = function () {
            if ($(".gome-container").length) {
                var html = obj.getAppendHtml();
                $(".gome-container").append(html);

                var onEmpty = function () {
                    obj.showText("打开国美扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailGuoMei();
                }, 1000);
            }
        };

        obj.initDetail = function (onEmpty) {
            // 版本信息
            obj.showVersion();

            // 商品查询
            api.itemQuery(router.getUrl(), function (response) {
                $("#tb-cool-area").show();

                if (response && response.code == 1) {
                    var data = response.data;

                    // 价格趋势
                    obj.showChart(data.good_url);

                    // 优惠信息
                    if (data.act_url || data.coupon_money > 0) {
                        obj.showCoupon(data);
                    }
                    else {
                        onEmpty();
                    }

                    // 优惠券列表
                    if (obj.getSite() == constant.site.taobao && option.isOptionActive(option.constant.taobao_shop_coupon)) {
                        obj.showCouponList(data.item_id, data.shop_id);
                    }

                    // 二维码
                    obj.showQrcode(data.app_url);
                }
                else {
                    var itemUrl = obj.getItemUrl();

                    // 价格趋势
                    obj.showChart(itemUrl);

                    // 无优惠券
                    onEmpty();

                    // 二维码
                    obj.showQrcode(itemUrl);
                }
            });
        };

        obj.openCouponLink = function (couponId, shopId) {
            var couponLink = obj.buildCouponLink(couponId, shopId);
            window.open(couponLink, "领取优惠券", "width=600,height=600,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
        };

        obj.showCoupon = function (data) {
            var html;
            if (data.act_url) {
                html = "<p>" + data.act_text + "</p>";
                if (data.act_tip) {
                    html += "<p class=\"tb-cool-quan-date\">" + data.act_tip + "</p>";

                    $(".tb-cool-area-benefit").addClass("tb-cool-area-has-date");
                }
                $(".tb-cool-quan-title").safeHtml(html);

                html = '<a class="tb-cool-quan-button quan-exist" data-url="' + data.act_url + '" data-mode="' + data.act_mode + '">' + data.act_title + '</a>';
                $(".tb-cool-quan-action").safeHtml(html);
            }
            else {
                html = "<p>券后价 <span>" + data.coupon_price.toFixed(2) + "</span> 元</p>";
                if (data.start_time && data.end_time) {
                    html += "<p class=\"tb-cool-quan-date\">（" + data.start_time + " ~ " + data.end_time + "）</p>";

                    $(".tb-cool-area-benefit").addClass("tb-cool-area-has-date");
                }
                $(".tb-cool-quan-title").safeHtml(html);

                html = '<a class="tb-cool-quan-button quan-exist" data-url="' + data.jump_url + '" data-mode="' + data.jump_mode + '">领' + data.coupon_money + '元优惠券</a>';
                $(".tb-cool-quan-action").safeHtml(html);
            }

            $(".tb-cool-quan-button.quan-exist").each(function () {
                var $this = this;
                var jumpUrl = $($this).attr("data-url");
                var jumpMode = parseInt($($this).attr("data-mode"));
                $this.onclick = function () {
                    core.jumpCouponLink(jumpUrl, jumpMode);
                };
            });
        };

        obj.showQrcode = function (url) {
            var type = 0;
            if (url.length < 80) {
                type = 5;
            }
            var qr = qrcode(type, "M");
            qr.addData(url);
            qr.make();
            $(".tb-cool-quan-qrcode").safeHtml(qr.createImgTag(4, 2));
        };

        obj.showText = function (buttonText, infoText) {
            var infoTextArr = ["移动端<span>快捷</span>购买"];
            if (!infoText) {
                var index = (new Date()).valueOf() % infoTextArr.length;
                infoText = infoTextArr[index];
            }
            var infoHtml = "<p>" + infoText + "</p>";
            $(".tb-cool-quan-title").safeHtml(infoHtml);

            buttonText || (buttonText = "手机扫一扫");
            var buttonHtml = '<a class="tb-cool-quan-button quan-none">' + buttonText + '</a>';
            $(".tb-cool-quan-action").safeHtml(buttonHtml);
        };

        obj.showVersion = function () {
            var html = '<a class="nd-open-page-option" title="当前版本：' + env.getVersion() + '">[ 配置 ]</a>';
            $(".tb-cool-area-home").safeHtml(html);

            // 打开配置页
            $(".nd-open-page-option").each(function () {
                this.onclick = function () {
                    runtime.openOptionsPage();
                };
            });
        };

        obj.showChart = function (itemUrl) {
            $(".tb-cool-history-tip").safeHtml("查询历史价格中...");

            api.trendQuery(itemUrl, function (response) {
                obj.trendData = obj.parseTrendResponse(response);
                obj.showChartRefresh();
            });
        };

        obj.showChartRefresh = function () {
            obj.showChartData(obj.trendData);
        };

        obj.showChartData = function (trendData) {
            if (trendData) {
                var option = obj.buildChartOption(trendData);
                $(".tb-cool-area-container").safeHtml('<div id="tb-cool-area-chart"></div>');
                echarts.init(document.getElementById("tb-cool-area-chart")).setOption(option);
                $(".tb-cool-history-tip").safeHtml("");
            }
            else {
                $(".tb-cool-history-tip").safeHtml("暂无商品历史价格信息");
            }
        };

        obj.showCouponList = function (itemId, shopId) {
            api.couponQueryShop(shopId, function (response) {
                var couponList;
                if (response) {
                    couponList = obj.parseCouponListShop(itemId, shopId, response);
                    obj.showCouponListLoginYes(couponList);
                }
                else {
                    couponList = obj.parseCouponListPadding();
                    obj.showCouponListLoginNo(couponList);
                }
            });
        };

        obj.showCouponListLoginYes = function (couponList) {
            obj.buildCouponListTable(couponList);
        };

        obj.showCouponListLoginNo = function (couponList) {
            obj.buildCouponListTable(couponList);

            var loginUrl = obj.buildLoginUrl();
            $(".tb-cool-quan-tip").safeHtml('<a href="' + loginUrl + '">登录后可以查看店铺优惠券哦</a>');
            $(".tb-cool-area-table").addClass("tb-cool-quan-empty");
        };

        obj.buildCouponListTable = function (couponList) {
            var list = Object.values(couponList);
            var compare = function (a, b) {
                if (a.coupon_money == b.coupon_money) {
                    if (a.coupon_money_start > b.coupon_money_start) {
                        return 1;
                    } else if (a.coupon_money_start == b.coupon_money_start) {
                        return 0;
                    } else {
                        return -1;
                    }
                } else {
                    if (a.coupon_money > b.coupon_money) {
                        return 1;
                    } else if (a.coupon_money == b.coupon_money) {
                        return 0;
                    } else {
                        return -1;
                    }
                }
            };
            list.sort(compare);

            var html = '<table class="tb-cool-quan-table">';
            list.forEach(function (item) {
                html += "<tr>";
                html += "<td>满 " + item.coupon_money_start + " 减 <span>" + item.coupon_money + "</span> 元</td>";
                var couponCommon;
                if (item.coupon_common == 1) {
                    couponCommon = "限定商品";
                } else if (item.coupon_common == 0) {
                    couponCommon = "<span>通用</span>";
                } else {
                    couponCommon = "--";
                }
                html += "<td> " + couponCommon + "</td>";
                html += "<td>" + item.coupon_start + " ~ <span>" + item.coupon_end + "</span></td>";
                html += "<td>已领 <span>" + item.coupon_num + "</span> 张</td>";
                if (item.coupon_receive) {
                    html += '<td><a class="tb-cool-quan-link tb-cool-quan-link-disable">已领取</a></td>';
                } else {
                    html += '<td><a class="tb-cool-quan-link tb-cool-quan-link-enable" data-shop="' + item.shop_id + '" data-coupon="' + item.coupon_id + '">领 取</a></td>';
                }
                html += "</tr>";
            });
            html += "</table>";
            $(".tb-cool-table-container").safeHtml(html);

            $(".tb-cool-quan-link-enable").each(function () {
                var $this = this;
                var couponId = $($this).attr("data-coupon");
                var shopId = $($this).attr("data-shop");
                $this.onclick = function () {
                    obj.openCouponLink(couponId, shopId);
                };
            });
        };

        obj.buildLoginUrl = function () {
            var itemUrl = obj.getItemUrl();
            return "https://login.tmall.com/?redirectURL=" + escape(itemUrl);
        };

        obj.buildCouponLink = function (couponId, shopId) {
            return "https://market.m.taobao.com/apps/aliyx/coupon/detail.html?wh_weex=true&activity_id=" + couponId + "&seller_id=" + shopId;
        };

        obj.buildChartOption = function (trendData) {
            var text = "历史低价：{red|￥" + parseFloat(trendData.stat.min_price).toFixed(2) + "} ( {red|" + trendData.stat.min_date + "} )";
            var chartOption = {
                title: {
                    left: "center",
                    subtext: text,
                    subtextStyle: {
                        color: "#000",
                        rich: {
                            red: {
                                color: "red"
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross"
                    },
                    formatter: function (params) {
                        params = params[0];
                        var year = params.name.getFullYear();
                        var month = params.name.getMonth() + 1;
                        var day = params.name.getDate();
                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        return "日期：" + year + "-" + month + "-" + day + "<br/>价格：￥" + params.value[1].toFixed(2);
                    }
                },
                grid: {
                    left: 0,
                    right: 20,
                    top: 50,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: {
                    type: "time"
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        type: "line",
                        step: "end",
                        data: trendData.data,
                        symbolSize: 3,
                        lineStyle: {
                            width: 1.5,
                            color: "#ed5700"
                        }
                    }
                ]
            };

            // 自动刻度
            if (option.isOptionActive(option.constant.chart_scale)) {
                var step = 10;
                var Ymin = Math.floor(trendData.stat.min_price * 0.9 / step) * step;
                var Ymax = Math.ceil(trendData.stat.max_price * 1.1 / step) * step;
                chartOption.yAxis.min = Ymin;
                chartOption.yAxis.max = Ymax;
            }

            // 标记极值
            if (option.isOptionActive(option.constant.chart_point)) {
                var series = chartOption.series[0];
                series.markPoint = {
                    data: [
                        {
                            value: trendData.stat.min_price,
                            coord: [trendData.stat.min_time, trendData.stat.min_price],
                            name: "最小值",
                            itemStyle: {
                                color: "green"
                            }
                        },
                        {
                            value: trendData.stat.max_price,
                            coord: [trendData.stat.max_time, trendData.stat.max_price],
                            name: "最大值",
                            itemStyle: {
                                color: "red"
                            }
                        }
                    ]
                };
            }

            // 自由缩放
            if (option.isOptionActive(option.constant.chart_zoom)) {
                chartOption.dataZoom = [
                    {
                        type: "inside",
                        start: 0,
                        end: 100
                    }
                ];
            }

            return chartOption;
        };

        obj.parseTrendResponse = function (response) {
            if (response && response.code == 1 && response.data.list.length) {
                var list = response.data.list;

                var trendData = {
                    stat: {
                        min_price: 0,
                        min_time: null,
                        min_date: null,
                        max_price: 0,
                        max_time: null,
                        max_date: null
                    },
                    data: []
                };
                list.forEach(function (item, index) {
                    var price = Math.ceil(item.price);
                    var time = new Date(item.time * 1000);
                    var date = calendar.formatTime("Y-m-d", item.time * 1000);

                    var point = {
                        name: time,
                        value: [
                            date,
                            price
                        ]
                    };
                    trendData.data.push(point);

                    if (trendData.stat.min_price == 0 || trendData.stat.min_price >= price) {
                        trendData.stat.min_price = price;
                        trendData.stat.min_time = time;
                        trendData.stat.min_date = date;
                    }

                    if (trendData.stat.max_price <= price) {
                        trendData.stat.max_price = price;
                        trendData.stat.max_time = time;
                        trendData.stat.max_date = date;
                    }
                });
                return trendData;
            }
            else {
                return null;
            }
        };

        obj.parseCouponListPadding = function () {
            return [
                {
                    shop_id: "",
                    coupon_receive: false,
                    coupon_num: 0,
                    coupon_id: "",
                    coupon_money: 10,
                    coupon_money_start: 20,
                    coupon_start: "2018-01-01",
                    coupon_end: "2018-12-12",
                    coupon_common: 0
                },
                {
                    shop_id: "",
                    coupon_receive: false,
                    coupon_num: 0,
                    coupon_id: "",
                    coupon_money: 20,
                    coupon_money_start: 40,
                    coupon_start: "2018-01-01",
                    coupon_end: "2018-12-12",
                    coupon_common: 1
                },
                {
                    shop_id: "",
                    coupon_receive: false,
                    coupon_num: 0,
                    coupon_id: "",
                    coupon_money: 40,
                    coupon_money_start: 80,
                    coupon_start: "2018-01-01",
                    coupon_end: "2018-12-12",
                    coupon_common: 0
                }
            ];
        };

        obj.parseCouponListShop = function (itemId, shopId, response) {
            var couponList = {};
            if (response && response.priceVolumes) {
                response.priceVolumes.forEach(function (item) {
                    var couponId = item.id;
                    var receive = item.status == "received";
                    if (couponList.hasOwnProperty(couponId)) {
                        couponList[couponId].coupon_receive = receive;
                        couponList[couponId].coupon_num = item.receivedAmount;
                    }
                    else {
                        var couponMoneyStart = item.condition.replace("满", "").split("减")[0];
                        var couponStart = item.timeRange.split("-")[0];
                        var couponEnd = item.timeRange.split("-")[1];
                        couponList[couponId] = {
                            shop_id: shopId,
                            coupon_receive: receive,
                            coupon_num: item.receivedAmount,
                            coupon_id: couponId,
                            coupon_money: parseFloat(item.price).toFixed(2),
                            coupon_money_start: parseFloat(couponMoneyStart).toFixed(2),
                            coupon_start: couponStart,
                            coupon_end: couponEnd,
                            coupon_common: -1
                        };
                    }
                });
            }
            return couponList;
        };

        obj.matchItemUrl = function (url) {
            var site = obj.matchSite(url);
            var itemId = router.getUrlParam("id");

            if (site == constant.site.taobao) {
                if (itemId) {
                    return "https://item.taobao.com/item.htm?id=" + itemId;
                } else {
                    return url;
                }
            }

            if (site == constant.site.yanxuan) {
                if (itemId) {
                    return "http://you.163.com/item/detail?id=" + itemId;
                } else {
                    return url;
                }
            }

            // 去除参数和哈希
            url = url.split("?")[0];
            url = url.split("#")[0];

            if (site == constant.site.guomei) {
                url = url.replace("https", "http");
                return url;
            }

            return url;
        };

        obj.matchSite = function (url) {
            // 淘宝
            if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
                return constant.site.taobao;
            }

            // 京东
            if (url.indexOf("item.jd.com") > 0 || url.indexOf("item.jd.hk") > 0) {
                return constant.site.jd;
            }

            // 考拉
            if (url.indexOf("goods.kaola.com") > 0) {
                return constant.site.kaola;
            }

            // 严选
            if (url.indexOf("you.163.com/item") > 0) {
                return constant.site.yanxuan;
            }

            // 苏宁
            if (url.indexOf("product.suning.com") > 0) {
                return constant.site.suning;
            }

            // 当当
            if (url.indexOf("product.dangdang.com") > 0) {
                return constant.site.dangdang;
            }

            // 国美
            if (url.indexOf("item.gome.com.cn") > 0) {
                return constant.site.guomei;
            }

            return null;
        };

        obj.getAppendHtml = function () {
            return '<div id="tb-cool-area"><div class="tb-cool-area-home"></div><div class="tb-cool-area-benefit"><div class="tb-cool-quan-qrcode"></div><div class="tb-cool-quan-title"></div><div class="tb-cool-quan-action"></div></div><div id="tb-cool-area-history" class="tb-cool-area-history"><div class="tb-cool-area-container"></div><p class="tb-cool-history-tip"></p></div><div class="tb-cool-area-table"><div class="tb-cool-table-container"></div><p class="tb-cool-quan-tip"></p></div></div>';
        };

        return obj;
    });

    container.define("app_search", ["router", "option", "api", "$"], function (router, option, api, $) {
        var obj = {};

        obj.run = function () {
            var selectorList = [];

            // 搜索页
            if (option.isOptionActive(option.constant.taobao_search)) {
                var url = router.getUrl();
                if (url.indexOf("//s.taobao.com/search") > 0 || url.indexOf("//s.taobao.com/list") > 0) {
                    selectorList.push(".items .item");
                }
                else if (url.indexOf("//list.tmall.com/search_product.htm") > 0) {
                    selectorList.push(".product");
                    selectorList.push(".chaoshi-recommend-list .chaoshi-recommend-item");
                }
                else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0) {
                    selectorList.push("#J_ItemList .product");
                }
            }

            // 店铺页
            if (option.isOptionActive(option.constant.taobao_shop)) {
                selectorList.push("#J_ShopSearchResult .item");
            }

            if (selectorList && selectorList.length > 0) {
                obj.initSearchHtml(selectorList);
                obj.initSearchEvent();
                obj.basicQuery();
            }

            return true;
        };

        obj.initSearchHtml = function (selectorList) {
            setInterval(function () {
                selectorList.forEach(function (selector) {
                    obj.initSearchItemSelector(selector);
                });
            }, 3000);
        };

        obj.initSearchEvent = function () {
            $(document).on("click", ".tb-cool-box-area", function () {
                var $this = $(this);
                if ($this.hasClass("tb-cool-box-wait")) {
                    obj.basicQueryItem(this);
                } else if ($this.hasClass("tb-cool-box-info-translucent")) {
                    $this.removeClass("tb-cool-box-info-translucent");
                } else {
                    $this.addClass("tb-cool-box-info-translucent");
                }
            });
        };

        obj.basicQuery = function () {
            setInterval(function () {
                $(".tb-cool-box-wait").each(function () {
                    obj.basicQueryItem(this);
                });
            }, 3000);
        };

        obj.initSearchItemSelector = function (selector) {
            $(selector).each(function () {
                obj.initSearchItem(this);
            });
        };

        obj.initSearchItem = function (selector) {
            var $this = $(selector);
            if ($this.hasClass("tb-cool-box-already")) {
                return;
            } else {
                $this.addClass("tb-cool-box-already")
            }

            var nid = $this.attr("data-id");
            if (!obj.isVailidItemId(nid)) {
                nid = $this.attr("data-itemid");
            }

            if (!obj.isVailidItemId(nid)) {
                if ($this.attr("href")) {
                    nid = location.protocol + $this.attr("href");
                } else {
                    var $a = $this.find("a");
                    if (!$a.length) {
                        return;
                    }

                    nid = $a.attr("data-nid");
                    if (!obj.isVailidItemId(nid)) {
                        if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
                            nid = location.protocol + $($a[1]).attr("href");
                        } else {
                            nid = location.protocol + $a.attr("href");
                        }
                    }
                }
            }

            if (obj.isValidNid(nid)) {
                obj.appenBasicQueryHtml($this, nid);
            }
        };

        obj.appenBasicQueryHtml = function (selector, nid) {
            selector.append('<div class="tb-cool-box-area tb-cool-box-wait" data-nid="' + nid + '"><a class="tb-cool-box-info tb-cool-box-info-default" title="点击查询">待查询</a></div>');
        };

        obj.basicQueryItem = function (selector) {
            var $this = $(selector);
            $this.removeClass("tb-cool-box-wait");

            var nid = $this.attr("data-nid");
            api.basicQuery(nid, function (response) {
                if (response && response.code == 1) {
                    var data = response.data;
                    if (data.coupon_money > 0) {
                        obj.showBasicQueryFind($this, data.item_id, data.item_price_buy, data.coupon_money);
                    } else {
                        obj.showBasicQueryEmpty($this);
                    }
                } else {
                    obj.showBasicQueryEmpty($this);
                }
            });
        };

        obj.showBasicQueryFind = function (selector, itemId, itemPriceBuy, couponMoney) {
            selector.safeHtml('<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="切换透明度">券后 ' + itemPriceBuy + '（减' + couponMoney + '元）</a>');
        };

        obj.showBasicQueryEmpty = function (selector) {
            selector.addClass("tb-cool-box-info-translucent");
            selector.safeHtml('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" title="切换透明度">暂无优惠</a>');
        };

        obj.isVailidItemId = function (itemId) {
            if (!itemId) {
                return false;
            }

            var itemIdInt = parseInt(itemId);
            if (itemIdInt == itemId && itemId > 10000) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isValidNid = function (nid) {
            if (!nid) {
                return false;
            }
            else if (nid.indexOf('http') >= 0) {
                if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };

        obj.isDetailPageTaoBao = function (url) {
            if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
                return true;
            } else {
                return false;
            }
        };

        return obj;
    });

    container.define("app_manage", ["meta", "unsafeWindow"], function (meta, unsafeWindow) {
        var obj = {};

        obj.run = function () {
            if (meta.existMeta("manage")) {
                unsafeWindow.OneHui = container;
                return true;
            }
            else {
                return false;
            }
        };

        return obj;
    });

    container.define("app", ["appRunner"], function (appRunner) {
        var obj = {};

        obj.run = function () {
            appRunner.run([
                {
                    name: "app_detail",
                    matchs: [
                        "taobao.com",
                        "tmall.com",
                        "tmall.hk",
                        "jd.com",
                        "jd.hk",
                        "kaola.com",
                        "163.com",
                        "suning.com",
                        "dangdang.com",
                        "gome.com.cn",
                    ]
                },
                {
                    name: "app_search",
                    matchs: [
                        "taobao.com",
                        "tmall.com",
                        "tmall.hk"
                    ]
                },
                {
                    name: "app_manage",
                    matchs: [
                        "*"
                    ]
                }
            ]);
        };

        return obj;
    });

    /** lib **/
    container.define("$", [], function () {
        return window.$;
    });
    container.define("Snap", [], function () {
        if (typeof Snap != "undefined") {
            return Snap;
        }
        else {
            return window.Snap;
        }
    });
    container.define("DOMPurify", [], function () {
        if (typeof DOMPurify != "undefined") {
            return DOMPurify;
        }
        else {
            return window.DOMPurify;
        }
    });
    container.define("echarts", [], function () {
        if (typeof echarts != "undefined") {
            return echarts;
        }
        else {
            return window.echarts;
        }
    });

    /** run **/
    container.use(["gm", "core", "app"], function (gm, core, app) {
        gm.ready(function () {
            core.ready(app.run);
        });
    });

})();