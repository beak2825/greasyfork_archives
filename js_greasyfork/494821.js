// ==UserScript==
// @name         网盘有效性检查
// @namespace    https://www.877855.xyz
// @version      1.8.21
// @icon         https://pan.baidu.com/ppres/static/images/favicon.ico
// @author       appppplayer
// @license      AGPL-3.0-or-later
// @match        *://*/*
// @description  网盘助手,自动识别并检查链接状态,自动填写密码并跳转。现已支持 ✅百度网盘 ✅蓝奏云 ✅腾讯微云 ✅阿里云盘 ✅天翼云盘 ✅123网盘 ✅迅雷云盘 ✅夸克网盘 ✅奶牛网盘 ✅文叔叔 ✅115网盘 ✅移动彩云
// @note         支持百度云、蓝奏云、腾讯微云、阿里云盘、天翼云盘、123网盘、夸克网盘、迅雷网盘、奶牛网盘、文叔叔、115网盘、移动彩云
// @note         24-03-24 1.8.21 修正阿里云盘 TooManyRequests状态错误,优化无效链接判断, 快传失效链接识别错误
// @connect      lanzoub.com
// @connect      baidu.com
// @connect      weiyun.com
// @connect      aliyundrive.com
// @connect      cloud.189.cn
// @connect      123pan.com
// @connect      quark.cn
// @connect      xunlei.com
// @connect      cowtransfer.com
// @connect      wenshushu.cn
// @connect      115.com
// @connect      caiyun.139.com
// @exclude 	 *://baike.baidu.com/*
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/jquery/3.6.0/jquery.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/findAndReplaceDOMText/0.4.6/findAndReplaceDOMText.min.js
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @homepageURL  https://www.877855.xyz
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494821/%E7%BD%91%E7%9B%98%E6%9C%89%E6%95%88%E6%80%A7%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/494821/%E7%BD%91%E7%9B%98%E6%9C%89%E6%95%88%E6%80%A7%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var manifest = {
        "debugId": "1p4fyOm",
        "logger_level": 3,
        "checkTimes": 20,
        "checkInterval": 4,
        "options_page": ""
    };
    var passMap = {};
    var panRule = /lanzou|115|baidu|weiyun|aliyundrive|123pan|189|quark|caiyun|xunlei|cowtransfer|wss/gi;
    var excludingPwdHosts = ["pan.baidu.com", "baike.baidu.com"];

    function getQuery(param) {
        return new URLSearchParams(location.search).get(param);
    }
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

    /**
     *  配置网盘参数 网盘名
     *  reg 匹配正则
     *  replaceReg dom替换正则
     *  prefix shareId前缀
     *  checkFun 有效性检测函数
     **/
    container.define("constant", ["logger", "http"], function (logger, http) {
        return {
            baidu: {
                reg: /(?:https?:\/\/)?\b(e?yun|pan)\.baidu\.com\/s\/([\w\-]{5,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/s\/([\w\-]{5,})(?!\.)/gi,
                prefix: "https://pan.baidu.com/s/",
                checkFun: (shareId, callback) => {
                    let url = shareId.includes("http") ? shareId : "https://pan.baidu.com/s/" + shareId;
                    logger.info("baiddu checkFun", url, shareId);
                    http.ajax({
                        type: "get",
                        url: url,
                        success: (response) => {
                            let state = 1;
                            if (response.includes("过期时间：")) {
                                state = 1;
                            } else if (response.includes("输入提取")) {
                                state = 2;
                            } else if (response.includes("不存在") || response.includes("已失效")) {
                                state = -1;
                            }
                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            baidu2: {
                reg: /(?:https?:\/\/)?\b(e?yun|pan)\.baidu\.com\/(?:share|wap)\/init\?surl=([\w\-]{5,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/(?:share|wap)\/init\?surl=([\w\-]{5,})(?!\.)/gi,
                prefix: "https://pan.baidu.com/share/init?surl=",
                checkFun: (shareId, callback) => {
                    let url = shareId.includes("http") ? shareId : "https://pan.baidu.com/share/init?surl=" + shareId;
                    logger.info("baiddu checkFun", url, shareId);
                    http.ajax({
                        type: "get",
                        url: url,
                        success: (response) => {
                            let state = 1;
                            if (response.includes("过期时间：")) {
                                state = 1;
                            } else if (response.includes("输入提取")) {
                                state = 2;
                            } else if (response.includes("已失效") || response.includes("不存在")) {
                                state = -1;
                            }
                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            weiyun: {
                reg: /(?:https?:\/\/)?\bshare\.weiyun\.com\/([\w\-]{7,})(?!.)(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?share\.weiyun\.com\/([\w\-]{7,})(?!\.)/gi,
                prefix: "https://share.weiyun.com/",
                checkFun: (shareId, callback) => {
                    let url = shareId.includes("http") ? shareId : "https://share.weiyun.com/" + shareId;
                    http.ajax({
                        type: "get",
                        url: url,
                        success: (response) => {
                            let state = 0;
                            logger.info(shareId, "weiyun", response);
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response.includes("已删除")
                                || response.includes("违反相关法规")
                                || response.includes("已过期")
                                || response.includes("已经删除")
                                || response.includes("目录无效")) {
                                state = -1;
                            } else if (response.includes('"need_pwd":null') && response.includes('"pwd":""')) {
                                state = 1;
                            } else if (response.includes('"need_pwd":1') || response.includes('"pwd":"')) {
                                state = 2;
                            }
                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            lanzou: {
                reg: /(?:https?:\/\/)?(?:[\w\-]+\.)?\blanzou.?\.com\/([\w\-]{7,})(?!\.)(?:\/)?/gi,
                replaceReg: /(?:https?:\/\/)?(?:[\w\-]+\.)?lan(?:zou?|.v|z).?\.com\/([\w\-]{7,})(?!\.)(?:\/)?/gi,
                aTagRepalce: [/(?:[\w\-]+\.)?lanzou.?/, "www.lanzoub"],
                prefix: "https://www.lanzoub.com/",
                checkFun: (shareId, callback) => {
                    let url = shareId.includes("http") ? shareId : "https://www.lanzoub.com/" + shareId;
                    http.ajax({
                        type: "get",
                        url: url,
                        success: (response) => {
                            let state = 1;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response.includes("输入密码")) {
                                state = 2;
                            } else if (response.includes("来晚啦") || response.includes("不存在")) {
                                state = -1;
                            }
                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            aliyun: {
                reg: /(?:https?:\/\/)?www\.aliyundrive\.com\/s\/([\w\-]{8,})(?![.\/])$/gi,
                replaceReg: /(?:https?:\/\/)?www\.ali(?:pan|yundrive)\.com\/s\/([\w\-]{8,})(?![.\/])/gi,
                prefix: "https://www.aliyundrive.com/s/",
                checkFun: (shareId, callback) => {
                    logger.info("aliyun id ", shareId);
                    http.ajax({
                        type: "post",
                        url: "https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous",
                        data: JSON.stringify({
                            share_id: shareId
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        dataType: "json",
                        success: (response) => {
                            logger.debug("aliyun response ", response);
                            let state = 1;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response['code'] && (response['code'].indexOf("ShareLink") > -1)) {
                                // 网盘ShareLink异常
                                state = -1;
                            } else if (response['code'] || response['file_count'] && response['file_count'] == 0) {
                                // 其他状态未知，下次重新请求
                                state = 0;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            aliyun2: {
                reg: /(?:https?:\/\/)?www\.aliyundrive\.com\/t\/([\w\-]{8,})(?![.\/])$/gi,
                replaceReg: /(?:https?:\/\/)?www\.ali(?:pan|yundrive)\.com\/t\/([\w\-]{8,})(?![.\/])/gi,
                prefix: "https://www.aliyundrive.com/t/",
                checkFun: (shareId, callback) => {
                    logger.info("aliyun2 id ", shareId);
                    http.ajax({
                        type: "post",
                        url: "https://api.aliyundrive.com/adrive/v1/share/getByAnonymous?share_id=" + shareId,
                        data: JSON.stringify({
                            share_id: shareId
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        dataType: "json",
                        success: (response) => {
                            logger.debug("aliyun2 response ", response);
                            let state = 1;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response['code'] && (response['code'].includes("Exceed") || response['code'].includes("Share"))) {
                                state = -1;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            pan123: {
                reg: /(?:h?ttps?:\/\/)?(?:www\.)?\bpan123\.com\/s\/([\w\-]{8,})\b/gi,
                replaceReg: /(?:h?ttps?:\/\/)?(?:www\.)?123pan\.com\/s\/([\w\-]{8,})(\.html)?\b/gi,
                prefix: "https://www.123pan.com/s/",
                checkFun: (shareId, callback) => {
                    logger.info("Pan123 check id " + shareId);
                    http.ajax({
                        type: "get",
                        url: "https://www.123pan.com/api/share/info?shareKey=" + shareId,
                        success: (response) => {
                            logger.debug("Pan123 check response", response);
                            let rsp = typeof response == "string" ? JSON.parse(response) : response;
                            let state = 1;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response.includes("分享页面不存在") || rsp.code != 0) {
                                state = -1;
                            } else if (rsp.data.HasPwd) {
                                state = 2;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            ty189: {
                reg: /(?:https?:\/\/)?cloud\.189\.cn\/(?:t\/|web\/share\?code=)([\w\-]{8,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?cloud\.189\.cn\/(?:t\/|web\/share\?code=)([\w\-]{8,})(?!\.)/gi,
                prefix: "https://cloud.189.cn/t/",
                aTagRepalce: [/\/web\/share\?code=/, "/t/"],
                checkFun: (shareId, callback) => {
                    http.ajax({
                        type: "post",
                        url: "https://api.cloud.189.cn/open/share/getShareInfoByCodeV2.action",
                        data: {
                            shareCode: shareId
                        },
                        success: (response) => {
                            logger.debug("Ty189 chec", shareId, response);
                            let state = 1;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response.includes("ShareInfoNotFound")
                                || response.includes("ShareNotFound")
                                || response.includes("FileNotFound")
                                || response.includes("ShareExpiredError")
                                || response.includes("ShareAuditNotPass")) {
                                state = -1;
                            } else if (response.includes("needAccessCode")) {
                                state = 2;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: () =>
                            callback && callback({
                                state: 0
                            })

                    });
                }
            },
            quark: {
                reg: /(?:https?:\/\/)?\bpan.quark\.cn\/s\/([\w\-]{8,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?pan.quark\.cn\/s\/([\w\-]{8,})(?!\.)/gi,
                prefix: "https://pan.quark.cn/s/",
                checkFun: (shareId, callback) => {
                    logger.info("Quark check id " + shareId);
                    http.ajax({
                        type: "post",
                        data: JSON.stringify({
                            pwd_id: shareId,
                            passcode: ""
                        }),
                        url: "https://drive.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc",
                        success: (response) => {
                            logger.debug("Quark token response", response);
                            let rsp = typeof response == "string" ? JSON.parse(response) : response;
                            let state = 0;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (rsp.message.includes("需要提取码")) {
                                state = 2;
                            } else if (rsp.message.includes("ok")) {
                                state = 1;
                            } else {
                                state = -1;
                            }

                            callback && callback({
                                state: state
                            });

                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            xunlei: {
                reg: /(?:https?:\/\/)?\bpan.xunlei\.com\/s\/([\w\-]{25,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?pan.xunlei\.com\/s\/([\w\-]{25,})(?!\.)/gi,
                prefix: "https://pan.xunlei.com/s/",
                checkFun: (shareId, callback) => {
                    logger.info("checkXunlei id", shareId);
                    http.ajax({
                        type: "post",
                        data: JSON.stringify({
                            client_id: "Xqp0kJBXWhwaTpB6",
                            device_id: "925b7631473a13716b791d7f28289cad",
                            action: "get:/drive/v1/share",
                            meta: {
                                package_name: "pan.xunlei.com",
                                client_version: "1.45.0",
                                captcha_sign: "1.fe2108ad808a74c9ac0243309242726c",
                                timestamp: "1645241033384"
                            }
                        }),
                        url: "https://xluser-ssl.xunlei.com/v1/shield/captcha/init",
                        success: (response) => {
                            logger.debug("xunlei token response", response);
                            let rsp = JSON.parse(response);
                            let token = rsp.captcha_token;
                            http.ajax({
                                type: "get",
                                url: "https://api-pan.xunlei.com/drive/v1/share?share_id=" + shareId.replace("https://pan.xunlei.com/s/", ""),
                                headers: {
                                    "x-captcha-token": token,
                                    "x-client-id": "Xqp0kJBXWhwaTpB6",
                                    "x-device-id": "925b7631473a13716b791d7f28289cad",
                                },
                                success: (response) => {
                                    logger.debug("checkXunlei detail response", response);
                                    let state = 1;
                                    // 请求限制
                                    if (!response) {
                                        state = 0
                                    } else if (response.includes("NOT_FOUND")
                                        || response.includes("SENSITIVE_RESOURCE")
                                        || response.includes("EXPIRED")) {
                                        state = -1;
                                    } else if (response.includes("PASS_CODE_EMPTY")) {
                                        state = 2;
                                    }

                                    callback && callback({
                                        state: state
                                    });
                                },
                                error: function () {
                                    callback && callback({
                                        state: 0
                                    });
                                }

                            })
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            nainiu: {
                reg: /(?:https?:\/\/)?(?:[\w\-]+\.)?\bcowtransfer\.com\/s\/([\w\-]{10,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?(?:[\w\-]+\.)?cowtransfer\.com\/s\/([\w\-]{10,})(?!\.)/gi,
                prefix: "https://cowtransfer.com/s/",
                checkFun: (shareId, callback) => {
                    logger.info("nainiu check id", shareId);
                    http.ajax({
                        type: "get",
                        url: "https://cowtransfer.com/core/api/transfer/share?uniqueUrl=" + shareId,
                        success: (response) => {
                            logger.debug("nainiu check response", response);
                            let rsp = typeof response == "string" ? JSON.parse(response) : response;
                            let state = 1;

                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (rsp.code != "0000") {
                                state = -1;
                            } else if (rsp.data.needPassword && rsp.data.needPassword) {
                                state = 2;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            wenshushu: {
                reg: /(?:https?:\/\/)?\bt.wss.ink\/f\/([\w\-]{8,})(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?wss1.cn\/f\/([\w\-]{8,})(?!\.)/gi,
                prefix: "https://t.wss.ink/f/",
                checkFun: (shareId, callback) => {
                    logger.info("wenshushu id", shareId);
                    http.ajax({
                        type: "post",
                        url: "https://www.wenshushu.cn/ap/task/mgrtask",
                        data: JSON.stringify({
                            tid: shareId
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            "x-token": "wss:7pmakczzw6i"
                        },
                        dataType: "json",
                        success: (response) => {
                            logger.debug("wenshushu response ", response);
                            let state = 1;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (response.code != 0) {
                                state = -1;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            pan115: {
                reg: /(?:h?ttps?:\/\/)?(?:www\.)?\b115\.com\/s\/([\w\-]{8,})(?!\.)/gi,
                replaceReg: /(?:h?ttps?:\/\/)?(?:www\.)?115\.com\/s\/([\w\-]{8,})(?!\.)/gi,
                prefix: "https://115.com/s/",
                checkFun: (shareId, callback) => {
                    logger.info("Pan115 check id " + shareId);
                    shareId = shareId.replace("https://115.com/s/", "");
                    http.ajax({
                        type: "get",
                        url: "https://webapi.115.com/share/snap?share_code=" + shareId + "&receive_code=",
                        success: (response) => {
                            logger.debug("115Pan check response", response);
                            let rsp = typeof response == "string" ? JSON.parse(response) : response;
                            let state = 0;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (rsp.state) {
                                state = 1;
                            } else if (rsp.error.includes("访问码")) {
                                state = 2;
                            } else if (rsp.error.includes("链接")) {
                                state = -1;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: function () {
                            callback && callback({
                                state: 0
                            });
                        }
                    });
                }
            },
            caiyun: {
                reg: /(?:https?:\/\/)?\bcaiyun\.139\.com\/[mw]\/i[\?\/]([\w-]+)(?!\.)/gi,
                replaceReg: /(?:https?:\/\/)?caiyun\.139\.com\/[mw]\/i[\?\/]([\w-]+)(?!\.)/gi,
                prefix: "https://caiyun.139.com/w/i/",
                checkFun: (shareId, callback) => {
                    logger.debug("caiyun checkFun", shareId);
                    http.ajax({
                        type: "post",
                        url: "https://caiyun.139.com/stapi/custom/outlink/brief",
                        data: "linkId=" + shareId,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: (response) => {
                            let rsp = typeof response == "string" ? JSON.parse(response) : response;
                            logger.debug("caiyun chec", shareId, rsp);

                            let state = 0;
                            // 请求限制
                            if (!response) {
                                state = 0
                            } else if (rsp.code == 0) {
                                state = rsp.data.isPasswd === "1" ? 2 : 1;
                            } else {
                                state = -1;
                            }

                            callback && callback({
                                state: state
                            });
                        },
                        error: () =>
                            callback && callback({
                                state: 0
                            })

                    });
                }
            }
        };
    });

    /** step 2 auto_fill **/
    container.define("auto_fill", ["checkManage"], function (checkManage) {

        var obj = {
            run() {
                this.autoFillPassword();
                return false;
            },
            opt: {
                baidu: {
                    reg: /((?:https?:\/\/)?(?:yun|pan)\.baidu\.com\/(?:s\/\w*(((-)?\w*)*)?|share\/\S{4,}))/,
                    host: /(pan|yun)\.baidu\.com/,
                    input: ['#accessCode'],
                    button: ['#submitBtn'],
                    name: '百度网盘'
                },
                aliyun: {
                    reg: /((?:https?:\/\/)?(?:(?:www\.)?aliyundrive\.com\/s|alywp\.net)\/[A-Za-z0-9]+)/,
                    host: /www\.aliyundrive\.com|alywp\.net/,
                    input: ['.ant-input[placeholder="请输入提取码"]'],
                    button: ['.button--fep7l', 'button[type="submit"]'],
                    name: '阿里云盘'
                },
                weiyun: {
                    reg: /((?:https?:\/\/)?share\.weiyun\.com\/[A-Za-z0-9]+)/,
                    host: /share\.weiyun\.com/,
                    input: ['.mod-card-s input[type=password]'],
                    button: ['.mod-card-s .btn-main'],
                    name: '微云'
                },
                lanzou: {
                    reg: /((?:https?:\/\/)?(?:[A-Za-z0-9\-.]+)?lanzou[a-z]\.com\/[A-Za-z0-9_\-]+)/,
                    host: /(?:[A-Za-z0-9.]+)?lanzou[a-z]\.com/,
                    input: ['#pwd'],
                    button: ['.passwddiv-btn', '#sub'],
                    name: '蓝奏云'
                },
                tianyi: {
                    reg: /((?:https?:\/\/)?cloud\.189\.cn\/(?:t\/|web\/share\?code=)?[A-Za-z0-9]+)/,
                    host: /cloud\.189\.cn/,
                    input: ['.access-code-item #code_txt'],
                    button: ['.access-code-item .visit'],

                },
                caiyun: {
                    reg: /((?:https?:\/\/)?caiyun\.139\.com\/m\/i\?[A-Za-z0-9]+)/,
                    host: /caiyun\.139\.com/,
                    input: ['.token-form input[type=text]'],
                    button: ['.token-form .btn-token'],
                    name: '和彩云',
                },
                xunlei: {
                    reg: /((?:https?:\/\/)?pan\.xunlei\.com\/s\/[\w-]{10,})/,
                    host: /pan\.xunlei\.com/,
                    input: ['.pass-input-wrap .td-input__inner'],
                    button: ['.pass-input-wrap .td-button'],
                    name: '迅雷云盘'
                },
                pan123: {
                    reg: /((?:https?:\/\/)?www\.123pan\.com\/s\/[\w-]{6,})/,
                    host: /www\.123pan\.com/,
                    input: ['.ca-fot input'],
                    button: ['.ca-fot button'],
                    name: '123云盘'

                },
                pan115: {
                    reg: /((?:https?:\/\/)?115\.com\/s\/[\w-]{6,})/,
                    host: /115\.com/,
                    input: ['.form-decode input'],
                    button: ['.form-decode .button'],
                    name: '115'
                },
                quark: {
                    reg: /((?:https?:\/\/)?pan\.quark\.cn\/s\/[\w-]{6,})/,
                    host: /pan\.quark\.cn/,
                    input: ['.ant-input[placeholder="请输入提取码，不区分大小写"]'],
                    button: ['button[type="button"]'],
                    name: 'quark'
                },
            },
            //根据域名检测网盘类型
            panDetect() {
                let hostname = location.hostname;
                for (let name in this.opt) {
                    let val = this.opt[name];
                    if (val.host.test(hostname)) {
                        return name;
                    }
                }
                return '';
            },
            isHidden(el) {
                try {
                    return el.offsetParent === null;
                } catch (e) {
                    return false;
                }
            },

            sleep(time) {
                return new Promise((resolve) => setTimeout(resolve, time));
            },
            //自动填写密码
            autoFillPassword() {
                let query = getQuery('pwd');
                let hash = location.hash.slice(1).replace("/list/share", "");
                let pwd = query || hash;
                let panType = this.panDetect();
                let val = this.opt[panType];
                console.warn(">>>>autoFillPassword", query, hash, panType);
                // 从本地数据库查找
                if (!pwd) {
                    let shareId = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
                    if (shareId === "init")
                        shareId = getQuery('surl');
                    console.warn(">>>>>>>", panType, val, shareId)
                    let item = checkManage.getItem(panType, shareId);
                    // 百度有两种格式,默认没找到,查找baidu2
                    if (!item && panType === "baidu") {
                        item = checkManage.getItem("baidu2", shareId);
                        console.warn(">>>>baidu2", shareId)
                    }
                    console.warn(">>>>item", item)
                    if (item) {
                        pwd = item.pwd;
                    }
                    console.warn(">>>>pwd", pwd)
                }
                pwd && this.doFillAction(val.input, val.button, pwd);

            },
            doFillAction(inputSelector, buttonSelector, pwd) {
                let maxTime = 10;
                let ins = setInterval(async () => {
                    maxTime--;
                    let input = document.querySelector(inputSelector[0]) || document.querySelector(inputSelector[1]);
                    let button = document.querySelector(buttonSelector[0]) || document.querySelector(buttonSelector[1]);

                    if (input && !this.isHidden(input)) {
                        clearInterval(ins);
                        let lastValue = input.value;
                        input.value = pwd;
                        //Vue & React 触发 input 事件
                        let event = new Event('input', {
                            bubbles: true
                        });
                        let tracker = input._valueTracker;
                        if (tracker) {
                            tracker.setValue(lastValue);
                        }
                        input.dispatchEvent(event);

                        await this.sleep(1000); //1秒后点击按钮
                        button.click();

                    } else {
                        maxTime === 0 && clearInterval(ins);
                    }
                }, 800);
            }
        };

        return obj;
    });

    container.define("gm", [], function () {
        return {
            ready: function (callback) {
                if (typeof GM_getValue != "undefined") {
                    callback && callback();
                } else {
                    setTimeout(function () {
                        obj.ready(callback);
                    }, 100);
                }
            }
        };
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

            return obj.init(),
                obj;
        };
    });

    // 网络请求库 GM_xmlhttpRequest
    container.define("http", ["logger"], function (logger) {
        return {
            ajax: function (option) {
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
                    } else {
                        var formData = new FormData();
                        for (var i in option.data) {
                            formData.append(i, option.data[i]);
                        }
                        details.data = formData;
                    }
                } else {
                    details.data = option.data;
                    details.dataType = "json";
                }

                // 自定义头
                if (option.headers) {
                    details.headers = option.headers;
                }

                // 超时
                if (option.timeout) {
                    details.timeout = option.timeout;
                }

                logger.debug("xmlhttpRequest", details)
                GM_xmlhttpRequest(details);
            }
        };
    });
    //日志库
    container.define("logger", [], function () {
        var obj = {
            constant: {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                NONE: 4
            }
        };

        obj.debug = function () {
            obj.log(obj.constant.DEBUG, ...arguments);;
        }
        obj.info = function () {
            obj.log(obj.constant.INFO, ...arguments)
        };
        obj.warn = function () {
            obj.log(obj.constant.WARN, ...arguments)
        };
        obj.error = function () {
            obj.log(obj.constant.ERROR, ...arguments)
        };
        obj.d = function () {
            obj.log(obj.constant.NONE, ...arguments)
        };
        obj.log = function () {
            if (arguments[0] < manifest["logger_level"]) {
                return false;
            }

            console.log(...Array.from(arguments).slice(1).filter(data => data))
            console.groupEnd();
        };

        return obj;
    });

    container.define("appRunner", ["logger", "$"], function (logger, $, require) {
        var obj = {};

        obj.run = function (appList) {
            $(function () {
                obj.runAppList(appList);
            });
        };

        obj.runAppList = function (appList) {
            var url = location.href;
            // 网盘页面不提取密码
            $(document).ready(function () {
                if (excludingPwdHosts.indexOf(location.host) == -1) {
                    // 移除知乎错误的attr
                    setTimeout(() => $("div").removeAttr("href"), 5000);
                    var hasClicks = !!document.querySelector(".clicks");
                    var bodyEle = hasClicks ? $("body").clone(true) : $("body");
                    if (hasClicks)
                        bodyEle.find(".clicks,.only-like").remove();
                    var rrr = bodyEle.text()
                        .replaceAll("如遇到有带x的提取码请手打输入", "提取码")
                        .match(/(?<=\.baidu\.com|lanzou.\.com|weiyun.com|189\.cn|115\.com|139\.com|aliyundrive.com|123pan.com|quark.cn|xunlei.com)\/\S+(\s*([\(（])?(?:(提取|访问|訪問|密)[码碼]|Code:)\s*[:：﹕ ]?\s*|[\?&](?:pwd|password)=|#)([a-zA-Z\d]{4,8})/g);
                    for (let s in rrr) {
                        console.log(typeof s, "---", typeof rrr[s])

                        if (typeof rrr[s] === "function")
                            continue;
                        console.log(s, "---", rrr[s])

                        let r = /([\w-]{4,})(?:\.html)?[\W]*?(?:(?:[&?]pwd=|[&?]password=)|#)?([a-z\d]{4,8})\s*/ig.exec(rrr[s]
                            .replace("/web/share?code=", "")
                            .replace("/share/init?surl=", ""));
                        if (r) {
                            passMap[r[1]] = r[2];
                            console.log(r[1], " 密码---", r[2])
                        }
                    }
                    // 百度知道 网盘链接解析
                    var baiduZhidaos = document.querySelectorAll(".ikqb-reply-yun");
                    if (baiduZhidaos) {
                        for (let baiduZhidao of baiduZhidaos) {
                            var bdcode = baiduZhidao.attributes['data-code'].value
                            var bdlink = baiduZhidao.attributes['data-href'].value
                            passMap[bdlink.substring(bdlink.lastIndexOf("/") + 1)] = bdcode;
                        }
                    }
                    var freedict = document.querySelectorAll("a.inline-onebox");
                    if (freedict) {
                        for (let free of freedict) {
                            if (free.textContent.includes("请输入提取码")) {
                                var bdcode = /提取码: *(\w+)\b/ig.exec(free.parentElement.textContent)[1];
                                var bdlink = free.href;
                                passMap[bdlink.substring(bdlink.lastIndexOf("/") + 1)] = bdcode;
                                if (bdcode && free.href.indexOf("pwd=") === -1) {
                                    var linker = free.href.indexOf("?") > -1 ? "&" : "?"
                                    free.href = free.href + linker + "pwd=" + bdcode
                                }
                            }
                        }
                    }
                }
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
            });

        };

        obj.matchApp = function (url, app) {
            var match = false;

            app.matchs && app.matchs.forEach(function (item) {
                //console.error("matchApp",url,app)
                if (item == "*" || (url && url.match(item))) {
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

        obj.getStorageDao = () => obj.getDao("storage", () => ScopeDao(gmDao, "$storage"));
        obj.getCheckDao = () => obj.getDao("check", () => ScopeDao(gmDao, "$check"));

        obj.getDao = function (key, createFunc) {
            if (!obj.daos.hasOwnProperty(key)) {
                obj.daos[key] = createFunc();
            }
            return obj.daos[key];
        };

        return obj;
    });
    //网盘状态icon资源
    container.define("resource", [], function () {
        var obj = {};
        obj.getErrorIcon = () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACm0lEQVR4Xu2Xv47TQBDGfSf+iGQdCSS4gpKr4I6TvQl0lLwEb0HFS9BQ09JR8wQ0UNDQIihAoCsgdhJfOHF3ZsaSrfG36/U6cVIgPumnKPbM7Hh2Z70Ogv/aotI4fJPqcDrXYT4fE/S7oN+ZDpczrb4u9PAx+mxEeRDspFH4jgbO0w7kD0b5/L66hfF6URqpV10TQrii9HCXMPbK4oA4yHqoFzhGJ2XjQWQG7YdEhz9xPC9lR4OIpu4CA/ZJEodfcNxWYZBNQQ//FsduVP9ryk1+GFzHHAzNYvUaHTcNdzvmURPd3UWnPvCZgUQPn2E+lWgnf48OSKKv3ilsPRtDVsO1D/4eO6rmcsRBWGcT00ZyAoPRa+o72kjm++qmtK+Ehg1cSJ+m5DApujZFGxM1lT6Fklh9NA3tnE+wEvX7WFm6lmIMG5ltOunGDA1dcKWkPyfL17FSSce40reQT+dYqE0rnyLkf2qmXxYfJ9K/EJ+n0MgHrFyp1GtNmWCcVStWkD+ESml1ijbe3BvdkLFWTmxpW7BBc7e2gXH4KTM0asPsPnVW/++3CUukfxnkBxq5wEqV3YdrjhsCfV1I30LTSD1CoyYwqdRc6F6bMPJnUl+rldDQhjl99s0TK5d6TOs0Gj6VPpXanowbRNq3bZ74hjhtiU/GO9K+0uJguIfGElmt1Jy+Jqppben8T6WdVXz8sDhVcHL0Xv2G111wTP4QxusSzMNQroPL6LQF/M79tHZeWpw3Aq87HN+pZIUNtysL3TGpUvRhcozB+oKTyu8GV3BMb/FHKQZdF+f5vouyw4FuaXVvaIl8wPhri7aK53z8xcE8+YzxetfJ0bXb9OTLtr3pnF/g8egJzdsuxtiajg+CPTrk7dvfKf+Q/gIqVFE2PCWqFwAAAABJRU5ErkJggg==";
        obj.getSuccessIcon = () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACrUlEQVR4Xt2Yu2sUQRzHV/BFxNzMXhEQkRAEJbd763+gnYIWVjYitrYBC8FaSzttFBs7LQQLMdnZ3SSKWFhoYWFvOl+IoImJ5283Znf2O7PPmz3QL3zIcff9PZidnUcs63/V4Nm07QTskhvaC8PAvuoIfu7Y0tQh9E1EjmD3qIn1YWiP6G8xESHsNYw3qtlodv9wmavFa+Kt9keu35vDvGNpGPAnWKgtruDrmL+V3IBvYfKxoSkwEPYZrFVPI2uXt6JJahAn4texbKW6bmoHJ+xdwNqFooBNTNAlWF8rmlMPMLBzoorm5h9ae5WgSSHYXewnFb3K5t/AuoQlo6aYTRLvEhU7BW1nt7EnGi32CI0GebVThz5/0fye4C1rRo1W9w00GkGw93KdOZ/3FI+E7E1UNcxtoDn7Dus4Pj+LvlyMzxYydwdvIzW1khXY1syidaDGAGSnEc+3T2sMKiG/QWvOYTrKqL9JUFNvpX5Soa+A71mAYJc1hhx0EPSlGhTDP6En8QX8jeyLlYyUxlvARhroBPyKxgDwO1KtRPR9rjk3YEvoqfn4ZDbTYFoqzmsMeQoWQGr487aHp0uCLCVPBW5g/0iD531+BA1FSDVT0ZwL8LuGjy+FpsLHXCI0FFK14VqtHl+Gz0QuWXJxQFMRFc0p/gaciqzdmOwDmkrRzLm2j08GcyZCUyXSyLnPe7z145OQ+0nlrarGOnhNpkEJg5fTNvaUKL73oXlSxIOC/eSEAZPi6FNrH/aiyMRcaYIn2GPsQSs3ZCcxuDOEvYX1S0Ur8DUliWHiuyvWrSU34hcxmUF+Y73GMj3n6BSS33bGEe3698dt8MSL/iheiDG3EVGDt+LbDBYtg+brz+PiYB9zdSa6B96kwmvEN+LX3xGN/+/xNTmfvbb2YMw/rz8ZKxg+Um5CmgAAAABJRU5ErkJggg==";
        obj.getLockIcon = () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABwUlEQVR4Xu1XvUoDQRA+0EoMub+oJBpv9wQLFSzsbASfwc4nsLMwcffERPEJbH0BQXwG2zQWEmttRIuA2Ch2Ohs4vMzueUncjRDug6/Zmdnvy85m99aycuQYIzi0XnWr9RU8/i/wKLv3aPTlUY4IY4S94HzjcEK+KptR0yH8HNcbgVNlm1g8iy5hj3ge7cCiom1OwC5LwcGcHTTs4kK04YcNyZxDDs/wXNoAe+qzR5DwZ5wTA1q4i83hHD0o7U33CIVHmUIu4afJGmhpC+f8GSBykRQpl5tTOEcF8QOMrhr8/d/jycUewvE0uJRfGTUGAm3YYy1BWL07HE9Dkda24zowpr+VRuCFx93NaoIujTpYry/Asj8ke2yE8/sVrJsJ6O2HNJFmwgW+hnUzMZix7oX8ChygxrQxdATMED4r5aTQqLFChXlSLWE3OE9Fo8Ysa2dCruUM56lo1Jgd8HVc61L2hvNUNGpM0LK2JuM6OOmvcTyNxo1B7m1c5y81FXE1c2MCubH++PPk8sXFL8XVHIEx+PztvhX5Ex7/jSMxNgyHMgbnUQdPpJs2iRaxbib85VpB/YzXQz880f8dnyPHuOIbV69cHR4KWOMAAAAASUVORK5CYII=";
        obj.getOtherIcon = () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAD5UlEQVR4Xr2YT2jTUBzHMxR0wmDaNXndxIk6EA9TEPQo/rns5MHtJjK2JrHrhhcRBP/cRHYTFMXDQBAVdhVBBGEHDx48iHhQEQ8DFYS5Jenabd3i71eX9uXbpE3S6gce697vb977vT+JoiTAVZSOwlhPr2WIT+v5jLt8UbgONdsUboH+rk5k3JUJ4Vq6pv8a6+lC+7Zjm+nhNQrKCcRpnLxjimfor2VKo+kBJyBg3MY+LFN7i/4TUcrVB8BgPJW2ITbo/zX+zdOJemhTzHf3Y6xIcB1xraBTbpv9s4uGuh/tZGxTm+JpRPta0x6iTUPcEWVL0NQVc/y06mHUb8b8yO7OyqgG+LQN7T3qhxKUFDl4hXpxoQfuDJpmx1BfoG4dQUPv6OkjqNcKgaOXTZ1CvSo0KnUGPA2o1w7KE/DwlCzXNeopTlbVMKliTt2HemFY+b7UgpHZ40ykhTt1YBvKg1jJ+WdnjZJFnbq6sgxtBnUQ2tnH3Mn6qee2wf165hzaIBj3u9G7oypc1NUzsrBETyLZBkL71rxsw1sI12d9catzaCtjG+pdeKhCVYjOSk32Jzojr3i6/MQoXzZSx2V/KEdw1Lz+DrmTz0LZKAh55aLMgxbSm1ry6m2Uy1immJFzcAwxrfwe7+6XO6nNoiEi6a6jzIPq72otkPYU5TK8WOQcVnkRYK1YRuogGiaBpvub55OOLhPlSFmaBd7nfB1B9ZIEOgOveT65flEeBOl+lQfItwtHddIISuqDHID3R9QJgnTv+RILWxFJKMu3EboGobwRli4uhyZGv8toEBXfGUtXbpQ3g2xyvsTkqawUXUJa9WHr4oYvMfkymLT4HVO7VHWqa09QHgWyfe1LDK85aBAFKvDBJTNznlshmzmK8ihUzlY5D37FkjtorifR6H9QkHLgJBWX3vvkxHhfQ6N/jW3uOuQbHFP8PfhxOt3RvdvBtinuTWUrjfZJ7I8CXp2qpw+/rciCJBttzV77gbJG8HuAHLtuVeNG6w4pkW6hzPKFVF/VjusjBhiXVvgtnwJ1zskKcUeNjyK6viy4Qff2ECy6RDYcLQ/MPlSxDRSyqbNyLG6hNxs335VCZf5qg3qtUtTFCYxDF8ufqOeDFB6gEX+/QL2k0JQ/Rv+Ry4a/e6Fx5fuXod1B3TiQn3X0G7tc6PXtOTqpJGjypyTx6MtQtHdHJ7tzEPcpr0UeKcQZ1057XwqD2ubG/JGSneajzDK1cfp7nabrJZ8g+Pblb9pnjBcLXv7NvpHFaTx1S6PpAYyTmOERZQs5LmGgqI0TohKYRr9thQLdD6sbuVW+1xriHSV1DH004w9PygmOZFyzWwAAAABJRU5ErkJggg==";
        obj.getStyleText = () => ".one-pan-tip { cursor: pointer;}" +
            ".one-pan-tip::before {background-position: center;background-size: 100% 100%;background-repeat: no-repeat;box-sizing: border-box;width: 1em;height: 1em;margin: 0 1px .15em 1px;vertical-align: middle;display: inline-block;}" +
            ".one-pan-tip-success::before {content: '';background-image: url(" + obj.getSuccessIcon() + ")}" +
            ".one-pan-tip-error {text-decoration: line-through;}" +
            ".one-pan-tip-error::before {content: '';background-image: url(" + obj.getErrorIcon() + ")}" +
            ".one-pan-tip-other::before {content: '';background-image: url(" + obj.getOtherIcon() + ")}" +
            ".one-pan-tip-lock::before{content: '';background-image: url(" + obj.getLockIcon() + ")}";
        return obj;
    });

    //检测网盘链接
    container.define("api", ["logger", "constant"], function (logger, constant) {
        return {
            checkLinkLocal: function (shareSource, shareId, callback) {
                logger.info("checkLinkLocal", shareSource, shareId);
                var rule = constant[shareSource];
                if (rule) {
                    rule["checkFun"](shareId, callback)
                } else {
                    callback({
                        state: 0
                    });
                }
            }
        };
    });

    container.define("checkManage", ["logger", "factory", "api"], function (logger, factory, api) {
        var obj = {
            active: false,
            timer: null,
            queues: []
        };

        obj.activeQueue = function () {
            if (!obj.active) {
                obj.active = true;
                obj.consumeQueue();
            }
        };

        obj.consumeQueue = function () {
            if (obj.queues.length) {
                obj.timer && clearTimeout(obj.timer);

                var items = [];
                while (obj.queues.length && items.length < 5) {
                    items.push(obj.queues.shift());
                }
                obj.checkLinkBatch(items, obj.consumeQueue);
            } else {
                obj.active = false;
                obj.timer = setTimeout(obj.consumeQueue, 1000);
            }
        };

        obj.checkLinkAsync = function (shareSource, shareId, pwd, bearTime, callback) {
            obj.queues.push({
                share_source: shareSource,
                share_id: shareId,
                bear_time: bearTime,
                pwd,
                callback
            });
            obj.activeQueue();
        };

        obj.checkLinkBatch = function (items, callback) {
            obj.syncLinkBatch(items, function () {
                callback();
                items.forEach(function (item) {
                    try {
                        obj.checkLink(item.share_source, item.share_id, item.pwd, item.bear_time, item.callback);
                    } catch (err) {
                        logger.error(err);
                    }
                });
            });
        };

        obj.checkLink = function (shareSource, shareId, pwd, bearTime, callback) {
            let item = obj.getItem(shareSource, shareId);
            bearTime || (bearTime = 86400 * 1000);
            //失效链接,不再进行请求,有效及带密码链接(1 ,2 )1天内更新, 异常(0)链接重新请求
            if (item && item.check_time && (item.check_state < 0 || (item.check_state >= 1 && new Date()).getTime() - item.check_time < bearTime)) {
                if (item.check_state < 0) {
                    logger.info("=====checkLink state from db=====  ", "无效链接,不再进行网络请求");
                } else {
                    logger.info("=====checkLink state from db===== 剩余缓存时效(min) ", Math.round((bearTime - new Date().getTime() + item.check_time) / 1000 / 60));
                }
                callback && callback({
                    state: item.check_state
                });
            } else {
                logger.info("=====checkLink state from net=====")
                api.checkLinkLocal(shareSource, shareId, function (item) {
                    if (item instanceof Object && item.state != 0) {
                        obj.setItem(shareSource, shareId, item.state, pwd);
                    }
                    callback && callback(item);
                });
            }
        };

        obj.syncLinkBatch = function (items, callback) {
            var linkList = [];
            items.forEach(function (item) {
                linkList.push(obj.buildShareKey(item.share_source, item.share_id));
            });
            callback && callback();
        };

        obj.getItem = function (shareSource, shareId) {
            let key = obj.buildShareKey(shareSource, shareId);
            var conf = GM_getValue("$check");
            return conf && conf.hasOwnProperty(key) && conf[key];
        };

        obj.setItem = function (shareSource, shareId, checkState, pwd) {
            pwd = pwd == undefined || pwd === "undefined" ? "" : pwd
            obj.getDao().set(obj.buildShareKey(shareSource, shareId), obj.buildItem(shareId, shareSource, checkState, pwd));
        };

        obj.buildItem = function (shareId, shareSource, checkState, pwd) {
            return {
                share_id: shareId,
                share_source: shareSource,
                check_state: checkState,
                pwd,
                check_time: (new Date()).getTime()
            };
        };

        obj.buildShareKey = function (shareSource, shareId) {
            return shareSource + "#" + shareId;
        };
        obj.getDao = function () {
            return factory.getCheckDao();
        };
        return obj;
    });

    container.define("core", ["resource", "$"], function (resource, $) {
        var obj = {};
        obj.appendStyle = function () {
            var styleText = resource.getStyleText();
            $("<style></style>").text(styleText).appendTo($("head"));
        };

        obj.ready = function (callback) {
            obj.appendStyle();
            callback && callback();
        };

        return obj;
    });

    /** step 2 app_check_url **/
    container.define("app_check_url", ["constant", "checkManage", "findAndReplaceDOMText", "$", "logger"], function (constant, checkManage, findAndReplaceDOMText, $, logger) {
        var obj = {
            index: 0
        };

        obj.run = function () {
            obj.runMatch();
            return false;
        };

        obj.runMatch = function () {

            // 创建链接span
            for (var rule in constant) {
                obj.replaceTextAsLink(constant[rule]["replaceReg"], rule, function (match) {
                    return match[1];
                });
            }

            // 补超链接ATTR
            $("a:not([one-link-mark])").each(function () {
                var $this = $(this);
                var href = $this.attr("href");
                if (panRule.exec(href) == null) {
                    return;
                }
                // logger.error("@@@@@@@@@@", href)
                if (href) {
                    href = href.replace("#list/path=%2F", "");
                    // 匹配域名
                    if (href.includes(manifest["debugId"])) {
                        logger.error("补超链接  --" + href + "--");
                    }

                    for (var rule in constant) {
                        if (constant[rule]["reg"].exec(href) && $this.find(".one-pan-tip").length == 0) {
                            $this.attr("one-link-mark", "yes");
                            logger.error(constant[rule]["reg"], href, constant[rule]["reg"].exec(href), "___")

                            // 知乎卡片不处理
                            if ($this.hasClass("LinkCard")) {
                                break;
                            }
                            var node = obj.createOneSpanNode(href, rule);
                            if (href.includes(manifest["debugId"])) {
                                logger.error("create node", node);
                            }
                            logger.error("node", node)
                            $this.wrapInner(node);
                            break;
                        }
                    }
                }
            });

            // 检查链接状态并加上超链接
            $(".one-pan-tip:not([one-tip-mark])").each(function () {
                let $this = $(this);
                $this.attr("one-tip-mark", "yes");
                let shareSource = $this.attr("one-source");
                let shareId = $this.attr("one-id");

                var shareId2 = RegExp(shareId + "[\\w-]+").exec(document.body.innerHTML);
                if (shareId2 && shareId != shareId2[0]) {
                    logger.error("shareId 2 ", shareId, shareId2[0]);
                    shareId = shareId2[0];
                }
                let pwd = $this.attr("one-pwd");

                let parentNode = this.parentNode;
                let pp = parentNode.parentNode;
                let shareUrl = obj.buildShareUrl(shareId, shareSource, pwd);
                pwd = $this.attr("one-pwd");

                if (shareId.includes(manifest["debugId"])) {
                    logger.error("check link " + shareUrl);
                }
                if (parentNode.nodeName != "A") {
                    // 转超链接
                    $this.wrap('<a href="' + shareUrl + '" target="_blank"></a>');
                } else if (constant[shareSource]["aTagRepalce"]) {
                    let replacePair = constant[shareSource]["aTagRepalce"];
                    // 失效域名替换
                    parentNode.href = shareUrl.replace(replacePair[0], replacePair[1])
                } else {
                    parentNode.href = shareUrl;
                }

                checkManage.checkLinkAsync(shareSource, shareId, pwd, 0, (response) => {
                    if (response.state == 2) {
                        $this.addClass("one-pan-tip-lock");
                    } else if (response.state == 1) {
                        $this.addClass("one-pan-tip-success");
                    } else if (response.state == -1) {
                        $this.addClass("one-pan-tip-error");
                    } else {
                        $this.addClass("one-pan-tip-other");
                    }
                });

            });

            // 异常信息重新请求
            $(".one-pan-tip-other").each(function () {
                let $this = $(this);
                let shareSource = $this.attr("one-source");
                let shareId = $this.attr("one-id");
                let pwd = $this.attr("one-pwd");
                checkManage.checkLinkAsync(shareSource, shareId, pwd, 0, (response) => {
                    $this.removeClass("one-pan-tip-other")
                    if (response.state == 2) {
                        $this.addClass("one-pan-tip-lock");
                    } else if (response.state == 1) {
                        $this.addClass("one-pan-tip-success");
                    } else if (response.state == -1) {
                        $this.addClass("one-pan-tip-error");
                    } else {
                        $this.addClass("one-pan-tip-other");
                    }
                });
            })

            let checkTimes = manifest["checkTimes"];
            if (checkTimes == 0 || obj.index < checkTimes) {
                obj.index++;
                setTimeout(obj.runMatch, 1000 * manifest["checkInterval"]);
            }
        };

        obj.replaceTextAsLink = function (shareMatch, shareSource, getShareId) {
            findAndReplaceDOMText(document.body, {
                find: shareMatch,
                replace: function (portion, match) {
                    let parentNode = portion.node.parentNode;
                    let pp = parentNode.parentNode;
                    let ppp = pp.parentNode;
                    if (parentNode.nodeName == "SPAN" && $(parentNode).hasClass("one-pan-tip")
                        || $(portion.node).hasClass("one-pan-tip")
                        || (pp.nodeName == "SPAN" && $(pp).hasClass("one-pan-tip"))
                        || (ppp.nodeName == "SPAN" && $(ppp).hasClass("one-pan-tip"))
                        || !portion.text.includes("/")) {
                        return portion.text;
                    } else {
                        let shareId = getShareId(match);
                        if (shareId.includes(manifest["debugId"])) {
                            logger.error("replaceTextAsLink 000  ", portion, pp);
                            logger.error("replaceTextAsLink 001  ", pp.innerText);
                        }

                        var shareId2 = RegExp(shareId + "[\\w-]+").exec(document.body.inn);
                        if (shareId2) {
                            shareId = shareId2[0];
                        }

                        let node = obj.createOneSpanNode(shareId, shareSource);
                        node.textContent = obj.buildShowText(shareId, shareSource);
                        if (shareId.includes(manifest["debugId"])) {
                            logger.error("replaceTextAsLink  " + shareId, node);
                            logger.error("replaceTextAsLink shareId2  ", shareId2);
                        }
                        return node;
                    }
                },
                forceContext: function (el) {
                    return true;
                }
            });
        };

        obj.findATagCode = function (shareId, shareSource) {
            var tag = document.querySelector("a[href*='" + shareId + "']");
            if (tag) {
                var reg = new RegExp("(?:\\s*(?:[\\(（])?(?:(?:提取|访问|訪問|密)[码碼]| Code:)\\s*[:：﹕ ]?\\s*|[\\?&]pwd=|#)([a-zA-Z\\d]{4,8})", "g");
                console.log("___ a href 0", tag.href);
                var mm = reg.exec(tag.innerText);
                if (mm && mm[1]) {
                    //tag.href =obj.buildShareUrl(shareId,shareSource,mm[1]);
                    console.log("___ a href 1", tag.href, mm[1]);
                    return mm[1];
                } else {
                    var regHref = /(?:pwd=|#)([a-zA-Z\d]{4,8})/g;
                    mm = regHref.exec(decodeURIComponent(tag.href));
                    if (mm && mm[1]) {
                        //tag.href =obj.buildShareUrl(shareId,shareSource,mm[1]);
                        console.log("___ a href 2", mm);
                        return mm[1];
                    }
                }
            }
        }
        obj.createOneSpanNode = function (shareId, shareSource) {
            if (shareId.includes(manifest["debugId"])) {
                logger.error("createOneSpanNode ", shareId);
            }

            var m = /https:\/\/.*\/(?:init\?surl=)?([\w-]+)(?:(?:[\?&]pwd=|#)(\w+))?/g.exec(shareId);
            shareId = m && m[1] || (shareId.includes("http") ? shareId.replace(/^.*?([\w-]+$)/i, "$1") : shareId);
            var code = m && m[2] || passMap[shareId] || obj.findATagCode(shareId, shareSource);

            var node = document.createElementNS(document.lookupNamespaceURI(null) || "http://www.w3.org/1999/xhtml", "span");
            node.setAttribute("class", "one-pan-tip");
            node.setAttribute("one-id", shareId);
            node.setAttribute("one-pwd", code);
            node.setAttribute("one-source", shareSource);
            return node;
        };

        obj.buildShareUrl = function (shareId, shareSource, pwd) {
            var m = /https:\/\/.*\/([\w-]+)(?:(?:\?pwd=|#)(\w+))?/g.exec(shareId);
            shareId = m && m[1] || (shareId.includes("http") ? shareId.replace(/^.*?([\w-]+$)/i, "$1") : shareId);
            let code = m && m[2] || pwd || passMap[shareId] || obj.findATagCode(shareId, shareSource);
            // 如果没有重新查找
            if (code == "undefined" || code == "Code" || typeof (code) == "undefined") {
                if (shareId.includes(manifest["debugId"])) {
                    logger.error(shareId + " search");
                }

                var reg = new RegExp(shareId + "(?:\\s*(?:[\\(（])?(?:(?:提取|访问|訪問|密)[码碼]| Code:)\\s*[:：﹕ ]?\\s*|[\\?&]pwd=|#)([a-zA-Z\\d]{4,8})", "g");
                var mm = reg.exec(document.body.innerText);
                if (mm) {
                    passMap[shareId] = mm[1];
                    code = mm[1];
                    if (shareId.includes(manifest["debugId"])) {
                        logger.error(code + " search");
                    }
                    document.querySelectorAll("span[one-id='" + shareId + "']")
                        .forEach(e => e.setAttribute("one-pwd", code));

                    logger.info("buildCode reset", code);
                }
            }

            let appendCode = shareSource == "ty189" || shareSource == "pan123" ? "#" : "?pwd=";
            logger.info("buildCode", code, appendCode);
            if (code == "undefined") {
                code = ""
            } else {
                code = code ? (appendCode + code) : "";
            }
            let shareUrl = constant[shareSource]["prefix"] + shareId + code;
            // 修复https://pan.baidu.com/share/init?surl=xxxxxxx
            if (shareUrl.includes("/share/init?surl=")) {
                shareUrl = shareUrl.replace("/share/init?surl=", "/s/1")
            }
            return shareUrl;
        };
        obj.buildShowText = function (shareId, shareSource) {
            return constant[shareSource]["prefix"] + shareId;
        };

        return obj;
    });

    // step 1 入口app
    container.define("app", ["appRunner"], function (appRunner) {
        return {
            run: function () {
                appRunner.run([{
                    name: "app_check_url",
                    matchs: ["*"]
                }, {
                    name: "auto_fill",
                    matchs: [
                        /(pan|yun)\.baidu\.com/,
                        /www\.aliyundrive\.com|alywp\.net/,
                        /share\.weiyun\.com/,
                        /(?:[A-Za-z0-9.]+)?lanzou[a-z]\.com/,
                        /cloud\.189\.cn/,
                        /caiyun\.139\.com/,
                        /pan\.xunlei\.com/,
                        /pan\.quark\.cn/,
                        /www\.123pan\.com/,
                        /115\.com/,
                    ]
                }
                ]);
            }
        };
    });

    // lib
    container.define("$", [], () => window.$);
    // dom替换
    container.define("findAndReplaceDOMText", [], () => typeof findAndReplaceDOMText != "undefined" ? findAndReplaceDOMText : window.findAndReplaceDOMText);
    // 入口
    container.use(["gm", "core", "app", "logger"], (gm, core, app, logger) => gm.ready(() => {
        core.ready(app.run)
        window.navigation.oncurrententrychange = () => {
            // console.log("onhashchange");
            app.run();  
        }  

    }));
})();