// ==UserScript==
// @name         coofoUtils
// @namespace    https://github.com/coofo/someScript
// @version      0.3.4
// @license      MIT License
// @description  一些工具
// @author       coofo
// @downloadURL  https://github.com/coofo/someScript/raw/main/tampermonkey/coofoUtils.user.js
// @supportURL   https://github.com/coofo/someScript/issues
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    window.coofoUtils = {
        commonUtils: {
            format: {
                num: {
                    fullNum: function (num, length) {
                        return (Array(length).join('0') + num).slice(-length);
                    },
                    toThousands: function (value, seperator, digitNum) {
                        if ((value = ((value = value + "").replace(/^\s*|\s*$|,*/g, ''))).match(/^\d*\.?\d*$/) == null)
                            return value;
                        value = digitNum >= 0 ? (Number(value).toFixed(digitNum) + "") : value;
                        let r = [],
                            tl = value.split(".")[0],
                            tr = value.split(".")[1];
                        tr = typeof tr !== "undefined" ? tr : "";
                        if (seperator != null && seperator !== "") {
                            while (tl.length >= 3) {
                                r.push(tl.substring(tl.length - 3));
                                tl = tl.substring(0, tl.length - 3);
                            }
                            if (tl.length > 0)
                                r.push(tl);
                            r.reverse();
                            r = r.join(seperator);
                            return tr === "" ? r : r + "." + tr;
                        }
                        return value;
                    },
                    percentAutoDigitNum: function (num, total, maxDigitNum) {
                        let standard = 100;
                        let digitNum = 0;
                        while (standard > total && maxDigitNum < digitNum) {
                            standard *= 10;
                            digitNum++;
                        }
                        return this.toThousands(num / total * 100, null, digitNum) + "%";
                    }
                },
                file: {
                    getSuffix: function (name) {
                        let index = name.lastIndexOf('.');
                        if (index < 0) {
                            return "";
                        } else {
                            return name.substring(index + 1);
                        }
                    }
                },
                string: {
                    byMap: function (str, map, preprocessing) {
                        let reg = new RegExp('\\${([a-z][a-zA-Z0-9_.]+)}', 'g');
                        return str.replace(reg, function (match, pos, originalText) {
                            let key = match.replace(reg, '$1');
                            let value = map[key];
                            if (value === null || value === undefined) {
                                value = match;
                            }
                            if (typeof preprocessing === "function") {
                                value = preprocessing(value, key, map);
                            }
                            return value;
                        });
                    },
                    filePathByMap: function (str, map) {
                        let preprocessing = function (value, key, map) {
                            let match = key.match(/^(.*)_([a-zA-Z0-9]+)$/);
                            let ext = null;
                            if (match != null) {
                                let rKey = match[1];
                                ext = match[2];
                                let rValue = map[rKey];
                                if (rValue !== null && rValue !== undefined) {
                                    value = rValue;
                                } else {
                                    value = "";
                                }
                            }

                            if (typeof value === "string") {
                                value = value.replace(/[\/:?"<>*|~]/g, function (match, pos, originalText) {
                                    switch (match) {
                                        case "\\":
                                            return "＼";
                                        case "/":
                                            return "／";
                                        case ":":
                                            return "：";
                                        case "?":
                                            return "？";
                                        case '"':
                                            return '＂';
                                        case '<':
                                            return '＜';
                                        case '>':
                                            return '＞';
                                        case '*':
                                            return '＊';
                                        case '|':
                                            return '｜';
                                        case '~':
                                            return '～';
                                    }
                                });
                            }

                            if (ext !== null && value !== "") {
                                switch (ext) {
                                    case "empty":
                                        break;
                                    case "path":
                                        value += '/';
                                        break;
                                    case "parenthesis":
                                        value = "(" + value + ")";
                                        break;
                                    case "squareBracket":
                                        value = "[" + value + "]";
                                        break;
                                    case "curlyBracket":
                                        value = "{" + value + "}";
                                        break;
                                    default:
                                        let indexMatch = ext.match(/index([0-9]+)/);
                                        if (indexMatch !== null && (typeof value === "number" || ('' + value).match(/^\d+$/))) {
                                            value = coofoUtils.commonUtils.format.num.fullNum(value, Number(indexMatch[1]));
                                        }
                                        break;
                                }
                            }

                            return value;
                        };
                        return coofoUtils.commonUtils.format.string.byMap(str, map, preprocessing);
                    }
                },
                url: {
                    fullUrl: function (url) {
                        if (url.match(/^[a-zA-Z0-9]+:\/\//) !== null) {
                            return url;
                        } else if (url.match(/^\/\/[a-zA-Z0-9]+/) !== null) {
                            return window.location.protocol + url;
                        } else if (url.match(/^\/[a-zA-Z0-9]+/) !== null) {
                            return window.location.origin + url;
                        } else {
                            return url;
                        }
                    }
                }
            },
            assert: {
                isTrue: function (value, message) {
                    if (true !== value) {
                        console.error(message);
                        console.error(value);
                        throw message;
                    }
                },
                isNull: function (value, message) {
                    if (value !== null) {
                        console.error(message);
                        console.error(value);
                        throw message;
                    }
                },
                notNull: function (value, message) {
                    if (value === null) {
                        console.error(message);
                        console.error(value);
                        throw message;
                    }
                },
                hasLength: function (value, message) {
                    if (!(value !== null && value.length > 0)) {
                        console.error(message);
                        console.error(value);
                        throw message;
                    }
                },
            },
            downloadHelp: {
                toBlob: {},
                toUser: {
                    asTagA4Url: function (url, fileName) {
                        let aLink = document.createElement('a');
                        if (fileName) {
                            aLink.download = fileName;
                        } else {
                            aLink.download = url.substring(url.lastIndexOf('/') + 1);
                        }
                        aLink.className = 'download-temp-node';
                        aLink.target = "_blank";
                        aLink.style = "display:none;";
                        aLink.href = url;
                        document.body.appendChild(aLink);
                        if (document.all) {
                            aLink.click(); //IE
                        } else {
                            let evt = document.createEvent("MouseEvents");
                            evt.initEvent("click", true, true);
                            aLink.dispatchEvent(evt); // 其它浏览器
                        }
                        document.body.removeChild(aLink);
                    },
                    asTagA4Blob: function (content, fileName) {
                        if ('msSaveOrOpenBlob' in navigator) {
                            navigator.msSaveOrOpenBlob(content, fileName);
                        } else {
                            let aLink = document.createElement('a');
                            aLink.className = 'download-temp-node';
                            aLink.download = fileName;
                            aLink.style = "display:none;";
                            let blob = new Blob([content], {type: content.type});
                            aLink.href = window.URL.createObjectURL(blob);
                            document.body.appendChild(aLink);
                            if (document.all) {
                                aLink.click(); //IE
                            } else {
                                let evt = document.createEvent("MouseEvents");
                                evt.initEvent("click", true, true);
                                aLink.dispatchEvent(evt); // 其它浏览器
                            }
                            window.URL.revokeObjectURL(aLink.href);
                            document.body.removeChild(aLink);
                        }
                    },
                    asHref4Blob: function (content, fileName) {
                        let blob = new Blob([content], {type: content.type});
                        let file = new File([blob], fileName, {type: blob.type});
                        let url = window.URL.createObjectURL(file);
                        window.open(url, "_self")
                    },
                    asForm: function (url, method, data = null) {
                        //新建form表单
                        let form = document.createElement("form");
                        form.id = "eform";
                        form.name = "eform";
                        form.target = "_blank";
                        document.body.appendChild(form);
                        //添加参数
                        if (data != null) {
                            Object.keys(data).forEach(function (key) {
                                let sdate_input = document.createElement("input");
                                sdate_input.type = "text";
                                sdate_input.name = key;
                                sdate_input.value = data[key];
                                form.appendChild(sdate_input);
                            });
                        }
                        form.method = method;
                        form.action = url;
                        form.submit();
                        document.body.removeChild(form);
                    }
                },

            },
            xss: {
                htmlEscape: function (text) {
                    if (!text) {
                        return text;
                    }
                    text = text + "";
                    return text.replace(/[<>"&']/g, function (match, pos, originalText) {
                        switch (match) {
                            case "<":
                                return "&lt;";
                            case ">":
                                return "&gt;";
                            case "&":
                                return "&amp;";
                            case "\"":
                                return "&quot;";
                            case "'":
                                return "&#39;";
                        }
                    })
                }
            },
            url: {
                //获取url中的参数
                getQueryVariable: function (variableKey, defaultValue = null) {
                    let query = window.location.search.substring(1);
                    let vars = query.split("&");
                    for (let i = 0; i < vars.length; i++) {
                        let pair = vars[i].split("=");
                        if (pair[0] === variableKey) {
                            return decodeURIComponent(pair[1]);
                        }
                    }
                    return defaultValue;
                },
                //在url中添加参数keyValue格式[{key: xx, value: xx}]
                addVariable: function (url, keyValues) {
                    if (!keyValues || keyValues.length === 0) return url;
                    let add = (u) => {
                        if (u.lastIndexOf("?") !== -1) {
                            u += "&";
                        } else {
                            u += "?";
                        }
                        for (let i = 0; i < keyValues.length; i++) {
                            if (!(keyValues[i].key || keyValues[i].value)) continue;
                            u += keyValues[i].key + "=" + encodeURIComponent(keyValues[i].value);
                            if (i !== keyValues.length - 1) {
                                u += "&"
                            }
                        }
                        return u;
                    };
                    //处理有url有hash的情况
                    let index = url.indexOf("#");
                    if (index !== -1) {
                        let realUrl = url.substr(0, index);
                        let hash = url.substr(index);
                        url = add(realUrl) + hash;
                    } else {
                        url = add(url);
                    }
                    return url;
                },
                addVariableByData: function (url, data) {
                    let keyValues = [];
                    let i = 0;
                    Object.keys(data).forEach(function (key) {
                        keyValues[i] = {
                            key: key,
                            value: data[key]
                        };
                        i++;
                    });
                    return coofoUtils.commonUtils.url.addVariable(url, keyValues);
                },
                getBaseUrl: function () {
                    return window.location.protocol + '//' + window.location.host;
                }
            },
            browser: {
                type: function () {
                    let u = navigator.userAgent;
                    let app = navigator.appVersion;
                    let name = {};

                    name.isAndroid = /Android/i.test(u);
                    name.isiPhone = /iPhone/i.test(u);
                    name.isiPad = /iPad/i.test(u);
                    name.isWindowsPc = /Windows/i.test(u);
                    name.isWindowsPhone = /Windows Phone/i.test(u);
                    return name;
                }(),
            },
        },
        service: {
            //可自动重试的Promise
            retryablePromise: {
                create: function (exec, retryTimes) {
                    let taskInfo = {
                        resolve: null,
                        reject: null,
                        retryTimes: retryTimes + 1
                    };
                    let p = new Promise((res, rej) => {
                        taskInfo.resolve = res;
                        taskInfo.reject = rej;
                    });

                    let doTask = function () {
                        new Promise((res, rej) => {
                            exec(res, rej);
                        }).then(
                            r => taskInfo.resolve(r),
                            r => {
                                taskInfo.retryTimes--;
                                if (taskInfo.retryTimes > 0) {
                                    doTask();
                                } else {
                                    taskInfo.reject(r);
                                }
                            }
                        );
                    };
                    doTask();

                    return p;
                }
            },
            task: {
                create: function ()  {
                    let task = {
                        runtime: {taskList: [], executing: [], nowExec: false},
                        api: {
                            addTask: function (exec, lastRetryTimes) {
                                if (task.runtime.nowExec) {
                                    return;
                                }
                                let taskItem = {
                                    complete: false,
                                    lastFinishTime: 0,
                                    lastRetryTimes: lastRetryTimes + 1,
                                    exec: exec,
                                    success: null,
                                    failed: null
                                };
                                task.runtime.taskList.push(taskItem);
                            },
                            exec: async function (poolLimit) {
                                if (task.runtime.nowExec) {
                                    return;
                                }
                                const executing = task.runtime.executing;
                                for (const taskItem of task.runtime.taskList) {
                                    let createPromise = function (taskItem) {
                                        let p = new Promise((resolve, reject) => {
                                            taskItem.success = resolve;
                                            taskItem.failed = reject;
                                            taskItem.exec(taskItem)
                                        }).then(() => {
                                                taskItem.complete = true;
                                                executing.splice(executing.indexOf(p), 1)
                                            },
                                            () => {
                                                taskItem.lastFinishTime = Date.now();
                                                taskItem.lastRetryTimes--;
                                                if (taskItem.lastRetryTimes > 0) {
                                                    executing.splice(executing.indexOf(p), 1, createPromise(taskItem));
                                                } else {
                                                    executing.splice(executing.indexOf(p), 1)
                                                }
                                            }
                                        );
                                        return p;
                                    };
                                    executing.push(createPromise(taskItem));
                                    while (executing.length >= poolLimit) {
                                        await Promise.race(executing);
                                    }
                                }
                                while (executing.length > 0) {
                                    await Promise.race(executing);
                                }
                                let completeNum = 0;
                                let retryTimesOutNum = 0;
                                for (const taskItem of task.runtime.taskList) {
                                    if (taskItem.complete) {
                                        completeNum++;
                                    } else {
                                        retryTimesOutNum++;
                                    }
                                }
                                return {completeNum: completeNum, retryTimesOutNum: retryTimesOutNum};
                            }
                        }
                    };
                    return task;
                }
            },
            taskCount: {
                create: function () {
                    let taskListInfo = {
                        size: 0,
                        finished: 0,
                    };
                    let callback = null;
                    let callCallback = function () {
                        try {
                            if (typeof callback === 'function') callback(taskListInfo);
                        } catch (e) {
                            console.error(e);
                        }
                    };
                    return {
                        addTask: function (runnable) {
                            taskListInfo.size++;
                            let pending = true;
                            callCallback();
                            return function (resolve, reject) {
                                let taskResolve = function (o) {
                                    if (!pending) {
                                        throw "taskCount task can not exec again"
                                    }
                                    pending = false;
                                    taskListInfo.finished++;
                                    callCallback();
                                    resolve(o);
                                };
                                let taskReject = function (o) {
                                    taskListInfo.finished++;
                                    callCallback();
                                    reject(o);
                                };
                                runnable(taskResolve, taskReject);
                            }
                        },
                        setStatusCallback: function (thisCallback) {
                            callback = thisCallback;
                        },
                        getInfo: function () {
                            return taskListInfo;
                        }
                    };
                }
            },
            //线程池
            threadPoolTaskExecutor: {
                create: function (size) {
                    let executing = [];
                    let pending = [];

                    let execOne = function () {
                        if (executing.length < size && pending.length > 0) {
                            let pendingItem = pending.shift();
                            let e = new Promise((r, s) => {
                                pendingItem.runnable(r, s);
                            }).then(r => {
                                executing.splice(executing.indexOf(e), 1);
                                execOne();
                                pendingItem.resolve(r);
                            }, r => {
                                executing.splice(executing.indexOf(e), 1);
                                execOne();
                                pendingItem.reject(r);
                            });
                            executing.push(e);
                        }
                    };

                    return {
                        execute: function (runnable) {
                            let thisPendingItem = {runnable: runnable};
                            let p = new Promise((resolve, reject) => {
                                thisPendingItem.resolve = resolve;
                                thisPendingItem.reject = reject;
                            });
                            pending.push(thisPendingItem);

                            execOne();
                            return p;
                        },
                        cancelAll: function () {
                            pending.splice(0);
                        }
                    };
                }
            }
        }
    };
})();