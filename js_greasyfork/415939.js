// ==UserScript==
// @name         提取码管家
// @namespace    http://go.newday.me/s/pwd-home
// @version      0.1.1
// @icon         http://cdn.newday.me/addon/pwd/favicon.ico
// @author       哩呵
// @description  面向个人的网盘提取码管家
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://*.weiyun.com/*
// @match        *://*.lanzous.com/*
// @match        *://*.lanzoux.com/*
// @match        *://cloud.189.cn/*
// @match        *://*.newday.me/*
// @match        *://*.likestyle.cn/*
// @connect      newday.me
// @connect      likestyle.cn
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require      https://cdn.staticfile.org/dompurify/2.0.10/purify.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415939/%E6%8F%90%E5%8F%96%E7%A0%81%E7%AE%A1%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/415939/%E6%8F%90%E5%8F%96%E7%A0%81%E7%AE%A1%E5%AE%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var manifest = {
        "name": "mpwd",
        "title": "提取码管家",
        "urls": {},
        "apis": {
            "version": "https://disk.newday.me/disk/pwd/version",
            "query": "https://disk.newday.me/disk/pwd/query",
            "store": "https://disk.newday.me/disk/pwd/store"
        },
        "logger_level": 3,
        "options_page": "http://go.newday.me/s/pwd-option"
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

        obj.getTitle = function () {
            return obj.getItem("title");
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
                    if (!result.status || parseInt(result.status / 100) == 2) {
                        option.success && option.success(result.response);
                    }
                    else {
                        option.error && option.error("");
                    }
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

    container.define("notify", [], function () {
        var obj = {};

        obj.showNotify = function (text, title, image, onclick) {
            GM_notification(text, title, image, onclick);
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
            source: {
                baidu: "baidu",
                weiyun: "weiyun",
                lanzous: "lanzous",
                ty189: "ty189"
            },
            option: {
                baidu_page_verify: {
                    name: "baidu_page_verify",
                    value: "yes"
                },
                baidu_share_status: {
                    name: "baidu_share_status",
                    value: "yes"
                },
                weiyun_page_verify: {
                    name: "weiyun_page_verify",
                    value: "yes"
                },
                weiyun_share_status: {
                    name: "weiyun_share_status",
                    value: "yes"
                },
                lanzous_page_verify: {
                    name: "lanzous_page_verify",
                    value: "yes"
                },
                lanzous_share_status: {
                    name: "lanzous_share_status",
                    value: "yes"
                },
                ty189_page_verify: {
                    name: "189_page_verify",
                    value: "yes"
                },
                ty189_share_status: {
                    name: "189_share_status",
                    value: "yes"
                }
            }
        };
    });

    container.define("setting", ["config"], function (config) {
        var obj = {};

        obj.getAccessToken = function () {
            return config.getConfig("access_token");
        };

        obj.setAccessToken = function (accessToken) {
            config.setConfig("access_token", accessToken);
        };

        obj.getNotifyStatus = function () {
            var notifyStatus = config.getConfig("notify_status");
            if (!notifyStatus) {
                notifyStatus = "success";
            }
            return notifyStatus;
        };

        obj.setNotifyStatus = function (notifyStatus) {
            config.setConfig("notify_status", notifyStatus);
        };

        obj.showNotifySuccess = function () {
            if (obj.getNotifyStatus() == "all" || obj.getNotifyStatus() == "success") {
                return true;
            }
            else {
                return false;
            }
        };

        obj.showNotifyFail = function () {
            if (obj.getNotifyStatus() == "all" || obj.getNotifyStatus() == "fail") {
                return true;
            }
            else {
                return false;
            }
        };

        return obj;
    });

    container.define("api", ["manifest", "setting", "oneData"], function (manifest, setting, oneData) {
        var obj = {};

        obj.versionQuery = function (callback) {
            oneData.requestOneApi(manifest.getApi("version"), {}, callback);
        };

        obj.querySharePwd = function (shareSource, shareId, shareLink, callback) {
            var data = {
                access_token: setting.getAccessToken(),
                share_id: shareId,
                share_source: shareSource,
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("query"), data, callback);
        };

        obj.storeSharePwd = function (shareSource, shareId, sharePwd, shareLink, callback) {
            var data = {
                access_token: setting.getAccessToken(),
                share_id: shareId,
                share_pwd: sharePwd,
                share_source: shareSource,
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("store"), data, callback);
        };

        return obj;
    });

    container.define("runtime", ["router", "manifest", "notify", "calendar", "storage", "api"], function (router, manifest, notify, calendar, storage, api) {
        var obj = {};

        obj.optionNotify = function () {
            notify.showNotify("点击去设置令牌...", null, null, function () {
                obj.openOptionsPage();
            });
        };

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

    container.define("core", ["runtime", "$extend"], function (runtime) {
        var obj = {};

        obj.ready = function (callback) {
            runtime.initRuntime();

            callback && callback();
        };

        return obj;
    });

    /** app **/
    container.define("app_baidu", ["manifest", "router", "option", "logger", "unsafeWindow", "constant", "setting", "runtime", "api", "$"], function (manifest, router, option, logger, unsafeWindow, constant, setting, runtime, api, $) {
        var obj = {
            verify_page: {
                share_pwd: null,
                setPwd: null,
                backupPwd: null,
                restorePwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/share/init") > 0) {
                option.isOptionActive(option.constant.baidu_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.getShareId = function () {
            var url = obj.getShareLink();
            var match = url.match(/share\/init\?surl=([a-z0-9-_]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return router.getUrl();
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".input-area input");
            if (shareId && $pwd.length) {
                // 设置提取码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 备份提取码
                obj.verify_page.backupPwd = function (pwd) {
                    $pwd.attr("data-pwd", pwd);
                };

                // 还原提取码
                obj.verify_page.restorePwd = function () {
                    $pwd.val($pwd.attr("data-pwd"));
                };

                // 提交提取码
                var $button = $(".input-area .g-button");
                if ($button.length) {
                    obj.verify_page.submit_pwd = function () {
                        $button.click();
                    };
                }

                return true;
            }
            else {
                return false;
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.baidu, shareId, shareLink, function (response) {
                if (response instanceof Object) {
                    if (response.code == 1) {
                        var sharePwd = response.data.share_pwd;
                        obj.verify_page.share_pwd = sharePwd;
                        obj.verify_page.setPwd(sharePwd);
                        setting.showNotifySuccess() && obj.showTipSuccess("[" + manifest.getTitle() + "] 填充提取码成功");
                    }
                    else if (response.code == -22) {
                        runtime.optionNotify();
                    }
                    else {
                        setting.showNotifyFail() && obj.showTipError("[" + manifest.getTitle() + "] 未查询到提取码");
                    }
                }
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/share/verify") >= 0) {
                    var match = options.data.match(/pwd=([a-z0-9]+)/i);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }

                    // 拒绝*号
                    if (obj.verify_page.backupPwd) {
                        obj.verify_page.backupPwd(match[1]);
                        setTimeout(obj.verify_page.restorePwd, 500);
                    }

                    var response = xhr.responseJSON;
                    if (!(response && response.errno == 0)) {
                        return logger.warn("pwd share error");
                    }

                    var sharePwd = match[1];
                    if (sharePwd == obj.verify_page.share_pwd) {
                        return logger.warn("pwd share not change");
                    }

                    if (!option.isOptionActive(option.constant.baidu_share_status)) {
                        return logger.warn("pwd share closed");
                    }

                    var shareId = obj.getShareId();
                    var shareLink = obj.getShareLink();
                    api.storeSharePwd(constant.source.baidu, shareId, sharePwd, shareLink);
                }
            });
        };

        obj.showTipSuccess = function (msg, hasClose, autoClose) {
            obj.showTip("success", msg, hasClose, autoClose);
        };

        obj.showTipError = function (msg, hasClose, autoClose) {
            obj.showTip("failure", msg, hasClose, autoClose);
        };

        obj.showTipLoading = function (msg, hasClose, autoClose) {
            obj.showTip("loading", msg, hasClose, autoClose);
        };

        obj.showTip = function (mode, msg, hasClose, autoClose) {
            var option = {
                mode: mode,
                msg: msg
            };

            // 关闭按钮
            if (typeof hasClose != "undefined") {
                option.hasClose = hasClose;
            }

            // 自动关闭
            if (typeof autoClose != "undefined") {
                option.autoClose = autoClose;
            }

            obj.require("system-core:system/uiService/tip/tip.js").show(option);
        };

        obj.hideTip = function () {
            obj.require("system-core:system/uiService/tip/tip.js").hide({
                hideTipsAnimationFlag: 1
            });
        };

        obj.getJquery = function () {
            return obj.require("base:widget/libs/jquerypacket.js");
        };

        obj.require = function (name) {
            return unsafeWindow.require(name);
        };

        return obj;
    });

    container.define("app_weiyun", ["manifest", "router", "option", "logger", "unsafeWindow", "constant", "setting", "runtime", "api", "$"], function (manifest, router, option, logger, unsafeWindow, constant, setting, runtime, api, $) {
        var obj = {
            modules: {},
            webpack_require: null,
            verify_page: {
                setPwd: null,
                share_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("share.weiyun.com") > 0) {
                option.isOptionActive(option.constant.weiyun_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.getShareId = function () {
            var url = obj.getShareLink();
            var match = url.match(/share.weiyun.com\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return router.getUrl();
        };

        obj.initVerifyPage = function () {
            obj.initWebpackRequire();

            obj.registerStoreSharePwd();

            obj.initVerifyPageElement(function () {
                obj.autoPaddingSharePwd();
            });
        };

        obj.initVerifyPageElement = function (callback) {
            var shareId = obj.getShareId();
            var $pwd = $(".card-inner .input-txt");
            var $button = $(".card-inner .btn-main");
            if (shareId && $pwd.length && $button.length) {

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 重造按钮
                var $itemButton = $button.parent();
                $itemButton.safeHtml($button.prop("outerHTML"));
                $button = $itemButton.find(".btn-main");

                // 按钮事件
                $button.on("click", function () {
                    obj.getStore() && obj.getStore().dispatch("shareInfo/loadShareInfoWithoutLogin", $pwd.val());
                });

                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.initVerifyPageElement(callback);
                }, 500);
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.weiyun, shareId, shareLink, function (response) {
                if (response instanceof Object) {
                    if (response.code == 1) {
                        var sharePwd = response.data.share_pwd;
                        obj.verify_page.share_pwd = sharePwd;
                        obj.verify_page.setPwd(sharePwd);
                        setting.showNotifySuccess() && obj.showTipSuccess("[" + manifest.getTitle() + "] 填充密码成功");
                    }
                    else if (response.code == -22) {
                        runtime.optionNotify();
                    }
                    else {
                        setting.showNotifyFail() && obj.showTipError("[" + manifest.getTitle() + "] 未查询到密码");
                    }
                }
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.addResponseInterceptor(function (request, response) {
                var requestUrl = request.responseURL;
                if (requestUrl.indexOf("weiyunShareNoLogin/WeiyunShareView") > 0) {
                    if (response.data.data.rsp_header.retcode == 0) {
                        var match = response.config.data.match(/\\"share_pwd\\":\\"([\w]+)\\"/);
                        if (!match) {
                            return logger.warn("pwd share not match");
                        }

                        var sharePwd = match[1];
                        if (sharePwd == obj.verify_page.share_pwd) {
                            return logger.warn("pwd share not change");
                        }

                        if (!obj.isPwdShareOpen()) {
                            return logger.warn("pwd share closed");
                        }

                        var shareId = obj.getShareId();
                        var shareLink = obj.getShareLink();
                        api.storeSharePwd(constant.source.weiyun, shareId, sharePwd, shareLink);
                    }
                    else {
                        return logger.warn("pwd share error");
                    }
                }
            });
        };

        obj.addResponseInterceptor = function (callback) {
            var success = function (response) {
                try {
                    callback && callback(response.request, response);
                }
                catch (e) {
                    logger.warn(e);
                }
                return response;
            };
            var error = function () {
                return Promise.reject(error);
            };
            obj.getAxios() && obj.getAxios().interceptors.response.use(success, error);
        };

        obj.showTipSuccess = function (msg) {
            obj.getModal() && obj.getModal().success(msg);
        };

        obj.showTipError = function (msg) {
            obj.getModal() && obj.getModal().error(msg);
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.weiyun_share_status);
        };

        obj.getAxios = function () {
            return obj.matchWebpackModule("axios", function (module, name) {
                if (module && module.Axios) {
                    return module;
                }
            });
        };

        obj.getModal = function () {
            return obj.matchWebpackModule("modal", function (module, name) {
                if (module && module.confirm && module.success) {
                    return module;
                }
            });
        };

        obj.getStore = function () {
            return obj.matchWebpackModule("store", function (module, name) {
                if (module && module.default && module.default._modulesNamespaceMap) {
                    return module.default;
                }
            });
        };

        obj.matchWebpackModule = function (name, matchFunc) {
            if (!obj.modules.hasOwnProperty(name)) {
                for (var key in obj.webpack_require.c) {
                    var match = matchFunc(obj.webpack_require(key), key);
                    if (match) {
                        obj.modules[name] = match;
                    }
                }
            }
            return obj.modules[name];
        };

        obj.initWebpackRequire = function () {
            var injectName = "_opwd_inject_";
            var moreModules = {};
            moreModules[injectName] = function (module, exports, __webpack_require__) {
                obj.webpack_require = __webpack_require__;
            };
            unsafeWindow.webpackJsonp([injectName], moreModules, [injectName]);
        };

        return obj;
    });

    container.define("app_lanzous", ["manifest", "router", "option", "logger", "unsafeWindow", "constant", "setting", "runtime", "api", "$"], function (manifest, router, option, logger, unsafeWindow, constant, setting, runtime, api, $) {
        var obj = {
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("lanzous.com") > 0 || url.indexOf("lanzoux.com") > 0) {
                option.isOptionActive(option.constant.lanzous_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.getShareId = function () {
            var url = obj.getShareLink();
            var match;

            match = /[lanzous|lanzoux].com\/([\w]+)\/([a-z0-9-_]{4,})/gi.exec(url);
            if (match) {
                return match[1] + "/" + match[2];
            }

            match = /[lanzous|lanzoux].com\/([a-z0-9-_]{4,})/gi.exec(url);
            if (match) {
                return match[1];
            }

            return null;
        };

        obj.getShareLink = function () {
            return router.getUrl();
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            obj.initVerifyPageElement(function () {
                obj.autoPaddingSharePwd();
            });
        };

        obj.initVerifyPageElement = function (callback) {
            var shareId = obj.getShareId();
            var $pwd = $("#pwd");
            if (shareId && $pwd.length) {

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $("#sub").click();
                };

                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.initVerifyPageElement(callback);
                }, 500);
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.lanzous, shareId, shareLink, function (response) {
                if (response instanceof Object) {
                    if (response.code == 1) {
                        var sharePwd = response.data.share_pwd;
                        obj.verify_page.share_pwd = sharePwd;
                        obj.verify_page.setPwd(sharePwd);
                        setting.showNotifySuccess() && obj.showTip(1, "[" + manifest.getTitle() + "] 填充密码成功", 2000);
                    }
                    else if (response.code == -22) {
                        runtime.optionNotify();
                    }
                    else {
                        setting.showNotifyFail() && obj.showTip(0, "[" + manifest.getTitle() + "] 未查询到密码", 2000);
                    }
                }
            });
        };

        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var match = options.data.match(/pwd=(\w+)/);
                if (!match) {
                    match = options.data.match(/p=(\w+)/);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }
                }

                var sharePwd = match[1];

                if (sharePwd == obj.verify_page.share_pwd) {
                    return logger.warn("pwd share not change");
                }

                if (!option.isOptionActive(option.constant.lanzous_share_status)) {
                    return logger.warn("pwd share closed");
                }

                var response = obj.parseJson(xhr.response);
                if (response && response.zt == 1 && sharePwd) {
                    api.storeSharePwd(constant.source.lanzous, obj.getShareId(), sharePwd, obj.getShareLink());
                }
                else {
                    return logger.warn("pwd share error");
                }
            });
        };

        obj.showTip = function (code, msg, timeout) {
            if (unsafeWindow.sms) {
                unsafeWindow.sms(msg);
            }
            else {
                var selector;
                if ($(".off").length) {
                    selector = "#pwderr";
                }
                else {
                    selector = "#info";
                }
                if (code) {
                    $(selector).safeHtml('<span style="color: green;">' + msg + '</span>');
                }
                else {
                    $(selector).safeHtml('<span style="color: red;">' + msg + '</span>');
                }
                setTimeout(function () {
                    $(selector).text("");
                }, timeout);
            }
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("app_189", ["manifest", "router", "option", "logger", "unsafeWindow", "constant", "setting", "runtime", "api", "$"], function (manifest, router, option, logger, unsafeWindow, constant, setting, runtime, api, $) {
        var obj = {
            verify_page: {
                share_pwd: null
            }
        };

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("cloud.189.cn/t") > 0) {
                option.isOptionActive(option.constant.ty189_page_verify) && obj.initSharePage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.getShareId = function () {
            var url = obj.getShareLink();
            var match = url.match(/cloud\.189\.cn\/t\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return router.getUrl();
        };

        obj.initSharePage = function () {
            if ($(".code-panel").length) {
                obj.initVerifyPage();
            }
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            obj.autoPaddingSharePwd();
        };

        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var response = xhr.responseJSON;
                var sharePwd = null;
                if (options.url.indexOf("listShareDir.action") > 0) {
                    if (response instanceof Object && response.digest) {
                        var match = options.url.match(/accessCode=(\w+)/);
                        if (!match) {
                            return logger.warn("pwd share not match");
                        }

                        sharePwd = match[1];
                    }
                    else {
                        return logger.warn("pwd share not match");
                    }
                }
                else if (options.url.indexOf("shareFileVerifyPass.action") > 0) {
                    if (response instanceof Object && response.shareId && response.accessCode) {
                        sharePwd = response.accessCode;
                    }
                    else {
                        return logger.warn("pwd share not match");
                    }
                }
                else {
                    return logger.warn("not pwd request");
                }

                if (sharePwd == obj.verify_page.share_pwd) {
                    return logger.warn("pwd share not change");
                }

                if (!option.isOptionActive(option.constant.ty189_share_status)) {
                    return logger.warn("pwd share closed");
                }

                var shareId = obj.getShareId();
                var shareLink = obj.getShareLink();
                api.storeSharePwd(constant.source.ty189, shareId, sharePwd, shareLink);
            });
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.ty189, shareId, shareLink, function (response) {
                if (response instanceof Object) {
                    if (response.code == 1) {
                        var sharePwd = response.data.share_pwd;
                        obj.verify_page.share_pwd = sharePwd;

                        $("#code_txt").val(sharePwd);
                        setting.showNotifySuccess() && obj.showTip(1, "[" + manifest.getTitle() + "] 填充访问码成功", 2000);
                    }
                    else if (response.code == -22) {
                        runtime.optionNotify();
                    }
                    else {
                        setting.showNotifyFail() && obj.showTip(0, "[" + manifest.getTitle() + "] 未查询到访问码", 2000);
                    }
                }
            });
        };

        obj.showTip = function (code, msg, timeout) {
            var $element = $(".visit_error");
            if (code) {
                $element.safeHtml('<span style="color: green;">' + msg + '</span>');
            }
            else {
                $element.safeHtml('<span style="color: red;">' + msg + '</span>');
            }
            $element.show();
            setTimeout(function () {
                $element.hide();
            }, timeout);
        };

        return obj;
    });

    container.define("app_manage", ["meta", "unsafeWindow"], function (meta, unsafeWindow) {
        var obj = {};

        obj.run = function () {
            if (meta.existMeta("manage")) {
                unsafeWindow.OnePwd = container;
                return true;
            }
        };

        return obj;
    });

    container.define("app", ["appRunner"], function (appRunner) {
        var obj = {};

        obj.run = function () {
            appRunner.run([
                {
                    name: "app_baidu",
                    matchs: [
                        "baidu.com"
                    ]
                },
                {
                    name: "app_weiyun",
                    matchs: [
                        "weiyun.com"
                    ]
                },
                {
                    name: "app_lanzous",
                    matchs: [
                        "lanzous.com",
                        "lanzoux.com"
                    ]
                },
                {
                    name: "app_189",
                    matchs: [
                        "cloud.189.cn"
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

    container.use(["gm", "core", "app"], function (gm, core, app) {
        gm.ready(function () {
            core.ready(app.run);
        });
    });
})();