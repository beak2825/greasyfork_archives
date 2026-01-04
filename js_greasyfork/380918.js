// ==UserScript==
// @name         下载卫士
// @namespace    http://go.newday.me/s/down-home
// @version      0.2.0
// @icon         http://cdn.newday.me/addon/down/favicon.ico
// @author       哩呵
// @description  拒绝高(捆)速(绑)下载，隐藏高速下载器的链接
// @match        *://*.onlinedown.net/*
// @match        *://*.cr173.com/*
// @match        *://*.xiazaiba.com/*
// @match        *://*.mydown.com/*
// @match        *://*.pc6.com/*
// @match        *://*.zol.com.cn/*
// @match        *://*.pconline.com.cn/*
// @match        *://*.jb51.net/*
// @match        *://*.cncrk.com/*
// @match        *://pc.qq.com/*
// @match        *://*.crsky.com/*
// @match        *://*.duote.com/*
// @match        *://*.downza.cn/*
// @match        *://*.yesky.com/*
// @match        *://*.ddooo.com/*
// @match        *://*.pchome.net/*
// @match        *://*.xpgod.com/*
// @match        *://*.52z.com/*
// @match        *://*.opdown.com/*
// @match        *://*.newday.me/*
// @match        *://*.likestyle.cn/*
// @connect      newday.me
// @connect      likestyle.cn
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/380918/%E4%B8%8B%E8%BD%BD%E5%8D%AB%E5%A3%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/380918/%E4%B8%8B%E8%BD%BD%E5%8D%AB%E5%A3%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var manifest = {
        "name": "xzws",
        "urls": {},
        "apis": {
            "version": "https://api.newday.me/share/down/version"
        },
        "logger_level": 3,
        "options_page": "http://go.newday.me/s/down-option"
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
            option: {
                site_onlinedown: {
                    name: "site_onlinedown",
                    value: "yes"
                },
                site_cr173: {
                    name: "site_cr173",
                    value: "yes"
                },
                site_xiazaiba: {
                    name: "site_xiazaiba",
                    value: "yes"
                },
                site_mydown: {
                    name: "site_mydown",
                    value: "yes"
                },
                site_pc6: {
                    name: "site_pc6",
                    value: "yes"
                },
                site_zol: {
                    name: "site_zol",
                    value: "yes"
                },
                site_pconline: {
                    name: "site_pconline",
                    value: "yes"
                },
                site_jb51: {
                    name: "site_jb51",
                    value: "yes"
                },
                site_cncrk: {
                    name: "site_cncrk",
                    value: "yes"
                },
                site_pc_qq: {
                    name: "site_pc_qq",
                    value: "yes"
                },
                site_crsky: {
                    name: "site_crsky",
                    value: "yes"
                },
                site_duote: {
                    name: "site_duote",
                    value: "yes"
                },
                site_downza: {
                    name: "site_downza",
                    value: "yes"
                },
                site_yesky: {
                    name: "site_yesky",
                    value: "yes"
                },
                site_ddooo: {
                    name: "site_ddooo",
                    value: "yes"
                },
                site_pchome: {
                    name: "site_pchome",
                    value: "yes"
                },
                site_xpgod: {
                    name: "site_xpgod",
                    value: "yes"
                },
                site_52z: {
                    name: "site_52z",
                    value: "yes"
                },
                site_opdown: {
                    name: "site_opdown",
                    value: "yes"
                }
            }
        };
    });

    container.define("api", ["manifest", "oneData"], function (manifest, oneData) {
        var obj = {};

        obj.versionQuery = function (callback) {
            oneData.requestOneApi(manifest.getApi("version"), {}, callback);
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

    container.define("core", ["runtime"], function (runtime) {
        var obj = {};

        obj.ready = function (callback) {
            runtime.initRuntime();

            callback && callback();
        };

        return obj;
    });

    container.define("guarder", ["$"], function ($) {
        var obj = {};

        obj.hideSelectorTip = function (selector) {
            $(selector).each(function () {
                obj.hideSingleTip(this);
            });
        };

        obj.hideSingleTip = function (element) {
            var $element = $(element);
            var text = $element.text();
            if (text.indexOf("下载器") >= 0) {
                $element.hide();
            }
        };

        obj.hideSelectorHref = function (selector) {
            $(selector).each(function () {
                obj.hideSingleHref(this);
            });
        };

        obj.hideSingleHref = function (element) {
            var $element = $(element);
            var href = $element.attr("href");
            if (href.indexOf("@") >= 0 && href.indexOf(".exe") >= 0) {
                $element.hide();
            }
            else if (href.indexOf("javascript") >= 0) {
                $element.hide();
            }
        };

        return obj;
    });

    /** app **/
    // http://www.onlinedown.net/soft/5.htm
    container.define("app_onlinedown", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("onlinedown.net/soft") > 0) {
                option.isOptionActive(option.constant.site_onlinedown) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $(".onedownbtn2").hide();

            // 底部高速下载
            $($(".downDz h4").get(0)).hide();
            $(".downDz .gaosu").hide();

            // 移除弹窗
            $(".wxWp").remove();
        };

        return obj;
    });

    // https://www.cr173.com/soft/18645.html
    container.define("app_cr173", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("cr173.com/soft") > 0 || url.indexOf("cr173.com/game") > 0) {
                option.isOptionActive(option.constant.site_cr173) && obj.initSoftPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initSoftPage = function () {
            // 顶部高速下载
            $(".downnowgaosu").hide();

            // 底部高速下载
            $(".ul_Address").each(function () {
                if ($(this).find(".f-gsh3").length > 1) {
                    $($(this).find(".f-gsh3").get(0)).hide();
                }
            });
            $(".ul_Address .downurl").hide();
        };

        return obj;
    });

    // https://www.xiazaiba.com/html/82.html
    container.define("app_xiazaiba", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("xiazaiba.com/html") > 0) {
                option.isOptionActive(option.constant.site_xiazaiba) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $(".hspeed").hide();

            // 底部高速下载
            $(".needfast").parent().hide();
        };

        return obj;
    });

    // http://www.mydown.com/soft/421/472030921.shtml
    container.define("app_mydown", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("mydown.com/soft") > 0) {
                option.isOptionActive(option.constant.site_mydown) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 高速下载
            $(".downbtn").hide();
        };

        return obj;
    });

    // http://www.pc6.com/softview/SoftView_1822.html
    // http://www.pc6.com/mod/647389.html
    // http://www.pc6.com/az/254734.html
    container.define("app_pc6", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("pc6.com/softview") > 0) {
                option.isOptionActive(option.constant.site_pc6) && obj.initDownloadPageSoft();
                return true;
            }
            else if (url.indexOf("pc6.com/mod") > 0) {
                option.isOptionActive(option.constant.site_pc6) && obj.initDownloadPageSoft();
                return true;
            }
            else if (url.indexOf("pc6.com/az") > 0) {
                option.isOptionActive(option.constant.site_pc6) && obj.initDownloadPageAndroid();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPageSoft = function () {
            // 顶部高速下载
            $("#xzbtn .downnow").hide();

            // 底部高速下载
            $(".ul_Address").each(function () {
                if ($(this).find("h3").length > 1) {
                    $($(this).find("h3").get(0)).hide();
                }
            });
            $(".ul_Address #gaosuxiazai").hide();
        };

        obj.initDownloadPageAndroid = function () {
            $(".ul_Address").each(function () {
                if ($(this).find("h3").length > 1) {
                    $($(this).find("h3").get(0)).hide();
                }
            });
            $(".ul_Address #gaosuxiazai").hide();
        };

        return obj;
    });

    // http://xiazai.zol.com.cn/detail/9/89734.shtml
    // http://xiazai.zol.com.cn/index.php?c=Detail_DetailMini&n=e4bd1f21d0c761d05&softid=89734
    container.define("app_zol", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("zol.com.cn/detail") > 0) {
                option.isOptionActive(option.constant.site_zol) && obj.initDownloadPage();
                return true;
            }
            else if (url.indexOf("zol.com.cn/index.php") > 0) {
                option.isOptionActive(option.constant.site_zol) && obj.initDownloadPageMini();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $(".soft-text-l").hide();
            $(".soft-text-r").addClass("soft-text-l").removeClass("soft-text-r");

            // 底部高速下载
            $(".box-top-ad").hide();
        };

        obj.initDownloadPageMini = function () {
            $(".down-h4").parent().hide();
            $(".down-jisu").hide();
        };

        return obj;
    });

    // https://dl.pconline.com.cn/download/91034.html
    container.define("app_pconline", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("pconline.com.cn/download") > 0) {
                option.isOptionActive(option.constant.site_pconline) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $("#JhsBtn").hide();

            // 底部高速下载
            $(".links p").not(".mb10").hide();

            // 误导性广告
            $(".ivy").hide();
        };

        return obj;
    });

    // https://www.jb51.net/softs/40589.html
    // https://www.jb51.net/fonts/658225.html
    // https://www.jb51.net/game/649384.html
    // https://www.jb51.net/codes/575492.html
    container.define("app_jb51", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("jb51.net/softs") > 0) {
                option.isOptionActive(option.constant.site_jb51) && obj.initDownloadPage();
                return true;
            }
            else if (url.indexOf("jb51.net/fonts") > 0) {
                option.isOptionActive(option.constant.site_jb51) && obj.initDownloadPage();
                return true;
            }
            else if (url.indexOf("jb51.net/game") > 0) {
                option.isOptionActive(option.constant.site_jb51) && obj.initDownloadPage();
                return true;
            }
            else if (url.indexOf("jb51.net/codes") > 0) {
                option.isOptionActive(option.constant.site_jb51) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $(".gsdw").hide();

            // 底部高速下载
            $($(".address-wrap .gs").get(0)).hide();
            $("#gaosu").hide();
        };

        return obj;
    });

    // http://www.cncrk.com/downinfo/180262.html
    container.define("app_cncrk", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("cncrk.com/downinfo") > 0) {
                option.isOptionActive(option.constant.site_cncrk) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 高速下载
            $("#gsxza").hide();
            $(".gsdt").html("<p>全是高(捆)速(绑)下载，已作隐藏处理</p>");
        };

        return obj;
    });

    // https://pc.qq.com/detail/8/detail_11488.html
    container.define("app_qq", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("pc.qq.com/detail") > 0) {
                option.isOptionActive(option.constant.site_pc_qq) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 高速下载
            $(".detail-install-fast").hide();
        };

        return obj;
    });

    // https://www.crsky.com/soft/48442.html
    container.define("app_crsky", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("crsky.com/soft") > 0) {
                option.isOptionActive(option.constant.site_crsky) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            $($(".i_dwon a").get(1)).hide();

            $(".Adown_dli").hide();
        };

        return obj;
    });

    // http://www.duote.com/soft/314065.html
    container.define("app_duote", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("duote.com/soft") > 0) {
                option.isOptionActive(option.constant.site_duote) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 误导广告
            $(".dl-banner").hide();

            // 底部高速下载
            $(".down-lists").each(function () {
                if ($(this).find(".download-box").length > 1) {
                    $($(this).find(".download-box").get(0)).hide();
                }
            });
        };

        return obj;
    });

    // http://www.downza.cn/soft/193456.html
    container.define("app_downza", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("downza.cn/soft") > 0 || url.indexOf("downza.cn/android") > 0) {
                option.isOptionActive(option.constant.site_downza) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $("#xzqIMG1").hide();

            // 底部高速下载
            $($(".pc-down_url_left .pull-left div").get(0)).hide();
            $(".pc-down_url_left .down_top").hide();
        };

        return obj;
    });

    // http://mydown.yesky.com/pcsoft/266126.html
    container.define("app_yesky", ["router", "option", "guarder", "$"], function (router, option, guarder, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("yesky.com/pcsoft") > 0) {
                option.isOptionActive(option.constant.site_yesky) && obj.initDownloadPage();
                return true;
            }
            else if (url.indexOf("yesky.com/game") > 0) {
                option.isOptionActive(option.constant.site_yesky) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $(".bkdown:not(#local_down)").hide();

            // 高速下载提示
            guarder.hideSelectorTip(".bk-soft_downurl h4");

            // 底部高速下载
            $(".bk-soft_downurl .down_referer").hide();

            // 隐藏横线
            $(".bk-soft_downurl hr").hide();
        };

        return obj;
    });

    // http://www.ddooo.com/softdown/65448.htm
    container.define("app_ddooo", ["router", "option", "guarder", "$"], function (router, option, guarder, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("ddooo.com/softdown") > 0) {
                option.isOptionActive(option.constant.site_ddooo) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 顶部高速下载
            $(".gsbtn").hide();

            // 底部高速下载
            guarder.hideSelectorHref(".gs_list a");
        };

        return obj;
    });

    // https://download.pchome.net/mobile/games/other/download-193583.html
    container.define("app_pchome", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("download.pchome.net") > 0 && url.indexOf("/download-") > 0) {
                option.isOptionActive(option.constant.site_pchome) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            // 不需提示
            $(".dl-tip").hide();

            // 混淆广告
            $(".mod_banner").hide();
        };

        return obj;
    });

    // https://www.xpgod.com/soft/121.html
    container.define("app_xpgod", ["router", "option", "$"], function (router, option, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("xpgod.com/soft") > 0) {
                option.isOptionActive(option.constant.site_xpgod) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            if ($(".bzxz").length) {
                $("#bzxz a:not(#maodian)").hide();

                // 底部高速下载
                $(".show_xzq").hide();
            }
            else {
                setTimeout(obj.initDownloadPage, 1000);
            }
        };

        return obj;
    });

    // https://www.52z.com/soft/389669.html
    container.define("app_52z", ["router", "option", "guarder", "$"], function (router, option, guarder, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("52z.com/soft") > 0) {
                option.isOptionActive(option.constant.site_52z) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            if ($(".elYxxzIn").length) {
                guarder.hideSelectorHref(".elYxxzIn a");
            }
            else {
                setTimeout(obj.initDownloadPage, 1000);
            }
        };

        return obj;
    });

    // http://www.opdown.com/soft/23485.html
    container.define("app_opdown", ["router", "option", "guarder", "$"], function (router, option, guarder, $) {
        var obj = {};

        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("opdown.com/soft") > 0) {
                option.isOptionActive(option.constant.site_opdown) && obj.initDownloadPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            if ($(".listaddr").length) {
                $(".downnows").hide();

                guarder.hideSelectorTip(".downbox div");

                guarder.hideSelectorHref(".downbox a");
            }
            else {
                setTimeout(obj.initDownloadPage, 1000);
            }
        };

        return obj;
    });

    container.define("app_manage", ["meta", "unsafeWindow"], function (meta, unsafeWindow) {
        var obj = {};

        obj.run = function () {
            if (meta.existMeta("manage")) {
                unsafeWindow.OneDown = container;
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
                    name: "app_onlinedown",
                    matchs: [
                        "onlinedown.net"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_cr173",
                    matchs: [
                        "cr173.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_xiazaiba",
                    matchs: [
                        "xiazaiba.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_mydown",
                    matchs: [
                        "mydown.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_pc6",
                    matchs: [
                        "pc6.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_zol",
                    matchs: [
                        "zol.com.cn"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_pconline",
                    matchs: [
                        "pconline.com.cn"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_jb51",
                    matchs: [
                        "jb51.net"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_cncrk",
                    matchs: [
                        "cncrk.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_qq",
                    matchs: [
                        "pc.qq.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_crsky",
                    matchs: [
                        "www.crsky.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_duote",
                    matchs: [
                        "duote.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_downza",
                    matchs: [
                        "downza.cn"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_yesky",
                    matchs: [
                        "yesky.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_ddooo",
                    matchs: [
                        "ddooo.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_pchome",
                    matchs: [
                        "pchome.net"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_xpgod",
                    matchs: [
                        "xpgod.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_52z",
                    matchs: [
                        "52z.com"
                    ],
                    switch: obj.check_switch
                },
                {
                    name: "app_opdown",
                    matchs: [
                        "opdown.com"
                    ],
                    switch: obj.check_switch
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