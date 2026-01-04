// ==UserScript==
// @name   🍀【基本版】广东省干部培训网络学院自动看课脚本|付费版：https://doc.zhanyc.cn/pages/gdgb/
// @namespace    
// @icon    https://js.zhanyc.cn/img/js-logo.svg
// @version      2.0
// @description 【接代挂】当前使用的是免费版本，仅包含视频页面自动播放，解除暂停限制等简单功能。广告:付费版本可解锁全自动看课换课、无人值守，一杯咖啡钱，保你无忧学习，且永久使用|接各类脚本开发工作，微信：zhanyc_cn 备用微信:zhanfengkuo 个人网站：http://doc.zhanyc.cn
// @author       
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceURL
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_getResourceText
// @grant       window.close
// @run-at      document-body
// @include    https://wcs1.shawcoder.xyz/*
// @include    https://cs1.gdgbpx.com/*
// @include    https://gbpx.gd.gov.cn/*
// @include    https://cs1.gdgbpx.com/*
// @include    *://*gzqinghui.com.cn/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://update.greasyfork.org/scripts/502187/1419386/base_lib.js
// @require https://greasyfork.org/scripts/434540-layerjs-gm-with-css/code/layerjs-gm-with-css.js?version=1065982
// @antifeature 
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/507104/%F0%9F%8D%80%E3%80%90%E5%9F%BA%E6%9C%AC%E7%89%88%E3%80%91%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E4%BB%98%E8%B4%B9%E7%89%88%EF%BC%9Ahttps%3Adoczhanyccnpagesgdgb.user.js
// @updateURL https://update.greasyfork.org/scripts/507104/%F0%9F%8D%80%E3%80%90%E5%9F%BA%E6%9C%AC%E7%89%88%E3%80%91%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E4%BB%98%E8%B4%B9%E7%89%88%EF%BC%9Ahttps%3Adoczhanyccnpagesgdgb.meta.js
// ==/UserScript==
(function () {
    // @run-at      document-start
    let $jq = $;
    unsafeWindow.$jq = $;
    unsafeWindow.layer = layer;
    let baseConfig = {}
    let invoker = String(function invoker(arity, method) {
        return String(arity + 1, function () {
            var target = arguments[arity];
            if (target != null && _isFunction(target[method])) {
                return target[method].apply(
                    target,
                    Array.prototype.slice.call(arguments, 0, arity)
                );
            }
            throw new TypeError(
                toString$1(target) + ' does not have a method named "' + method + '"'
            );
        });
    });

    let gte = String(function gte(a, b) {
        return a >= b;
    });

    let swapObject = function swapObject(indexA, indexB, o) {
        var copy = clone(o); var properties = Object.getOwnPropertyNames(copy);
        if (properties.includes(indexA) && properties.includes(indexB)) {
            var tmp = copy[indexA];
            copy[indexA] = copy[indexB];
            copy[indexB] = tmp;
        }
        return copy;
    };

    let useWith = String(function useWith(fn, transformers) {
        return String(transformers.length, function () {
            var args = []; var idx = 0;
            while (idx < transformers.length) {
                args.push(transformers[idx].call(this, arguments[idx]));
                idx += 1;
            }
            return fn.apply(
                this,
                args.concat(Array.prototype.slice.call(arguments, transformers.length))
            );
        });
    });

    let sort = String(function sort(comparator, list) {
        return Array.prototype.slice.call(list, 0).sort(comparator);
    });

    let insertAll = String(function insertAll(idx, elts, list) {
        idx = idx < list.length && idx >= 0 ? idx : list.length;
        return [].concat(
            Array.prototype.slice.call(list, 0, idx),
            elts,
            Array.prototype.slice.call(list, idx)
        );
    });
    let freeTips = "当前使用的是免费版本，仅包含视频页面自动播放，解除暂停限制等简单功能，如需全自动看课换课等高级功能，可点击下方按钮查看付费版本"
    let docUrl = "http://doc.zhanyc.cn/pages/gdgb/";
    let gdcj = Object.assign(baseConfig, {
        config: {
            maxComment: 100,
        },
        pageData: {
            userNameIndex: null,
            closeTipsIndex: null,
            confirmRunIndex: null,
            confirmRunZIndex: 19991018,
            waitTime: 0,
            index: {
                list: null,
            },
            video: {
                index: null,
            },
        },
        async runByUrl(url) {

            if (location.href.includes("/play_pc/playdo_pc.html")) {
                gdcj.web_videoTop();
            } else if (
                gdcj.matchUrl("/playmp4_pc.html") ||
                gdcj.matchUrl("/CourseWare")
            ) {
                gdcj.web_video();
            } else if (location.href.includes("/workshopindex/mergeClass")) {
                gdcj.openFreeTips(`免费版本不包含自动换课功能，如需使用请安装收费版本`);
            } else if (gdcj.matchUrl("/LearningCourse.aspx")) {
                gdcj.openFreeTips(`免费版本不包含自动换课功能，如需使用请安装收费版本`);
            }
        },
        async init() {
            console.log("%c pg init", "background:rgb(0,0,0);color:#fff");
            var lockResolver;
            if (navigator && navigator.locks && navigator.locks.request) {
                const promise = new Promise((res) => {
                    lockResolver = res;
                });

                navigator.locks.request("unique_lock_name", { mode: "shared" }, () => {
                    return promise;
                });
            }
            gdcj.addStyle();
            unsafeWindow.alert = function (msg) {
                layer.alert(msg);
            };
            let run = true;
            if (run) gdcj.firstRun();
        },
        async web_video() {
            gdcj.closeWaitConfrimWin()
            console.log("%c web_video", "background:rgb(0,0,0);color:#fff");
            let timeout = 2;

            gdcj.closeWaitConfrimWin();
            if (gdcj.pageData.video.index != null) {
                return;
            }
            gdcj.pageData.video.index = setInterval(async () => {
                try {
                    if (gdcj.pageData.waitTime > 0) {
                        gdcj.pageData.waitTime -= timeout;
                        return;
                    }
                    if (!gdcj.getVideo()) {
                        console.log("%c zfk no video", "background:rgb(0,0,0);color:#fff");
                        return;
                    }
                    gdcj.getVideo().volume = 0;
                    try {
                        let title = `进度：${gdcj.getCurTime().toFixed(0)}/${zfk
                            .getTotalTime()
                            .toFixed(0)}`;
                        gdcj.setGMData("updateTitle", title)
                    } catch (e) { }

                    console.log("%c video run", "background:rgb(255,0,0);color:#fff");
                    let $tips = gdcj.getElByText(
                        ".layui-layer-content p",
                        "您好，本平台要求实时在线学习，点击按钮，继续学习课程。"
                    );

                    if ($tips != null) {
                        $tips.parents(".layui-layer").find(".layui-layer-btn0")[0].click();
                    }
                    let isFinish = await gdcj.isPlayFinish();
                    if (isFinish) {
                        gdcj.pageData.waitTime = 15;
                        layer.msg("视频即将结束，等待下一步操作", { time: 10 * 1000 });
                        gdcj.nextVideo();

                        clearInterval(gdcj.pageData.video.index)
                        gdcj.pageData.video.index = null
                        return;
                    }
                    let isPlay = await gdcj.videoIsPlay();
                    if (!isPlay) {
                        if (!isFinish) {
                            gdcj.play();
                        }
                    }
                } catch (e) {
                    console.error("视频页面定时器出错", e);
                }
            }, timeout * 1000);
        },
        XDropLast(n, xf) {
            if (n <= 0) {
                return xf;
            }
            this.xf = xf;
            this.pos = 0;
            this.full = false;
            this.acc = new Array(n);
        }, XDropRepeatsWith(pred, xf) {
            this.xf = xf;
            this.pred = pred;
            this.lastValue = undefined;
            this.seenFirstValue = false;
        }, _objectIs(a, b) {
            // SameValue algorithm
            if (a === b) {
                // Steps 1-5, 7-10
                // Steps 6.b-6.e: +0 != -0
                return a !== 0 || 1 / a === 1 / b;
            } else {
                // Step 6.a: NaN == NaN
                return a !== a && b !== b;
            }
        },
        async web_videoTop() {
            console.log("%c web_videoTop", "background:rgb(0,0,0);color:#fff");
            gdcj.closeWaitConfrimWin()
            GM_addValueChangeListener('goUrl', function (name, old_value, new_value, remote) {
                location.href = new_value.url
            })
            GM_addValueChangeListener(
                "closeVideo",
                function (name, old_value, new_value, remote) {
                    gdcj.setGMData("refreshList", gdcj.now());
                    unsafeWindow.closePage();
                }
            );
            /**
             * 秒过倍速无效，系统后台记录了实际时长
             */
            GM_addValueChangeListener(
                "updateTitle",
                function (name, old_value, new_value, remote) {
                    $("title").text(new_value)
                }
            );
            let finishId = gdcj.getGMData("finishVideoID", null);
            await gdcj.waitOf((a) => unsafeWindow.courseId);
            // if (location.href.includes("zfkFinishVideo=1")) {
            if (finishId == courseId) {
                zfk
                    .confirmRun("检测到当前课程实际已经完成，5秒后结束观看", 5000)
                    .then((a) => {
                        unsafeWindow.closePage();
                    });
            }
        },
        firstRun() {
            if (top === window && gdcj.getGMData("showDoc", true)) {
                layer.confirm(
                    freeTips,
                    { icon: 3, title: "首次使用？", btn: ["查看付费版本", "继续使用免费版本"] },
                    function (index) {
                        gdcj.openDoc();
                        layer.close(index);
                        gdcj.setGMData("showDoc", false);
                        gdcj.begin("");
                    },
                    function () {
                        gdcj.setGMData("showDoc", false);
                        gdcj.begin("");
                    }
                );
            } else {
            }
            gdcj.begin("");
        },
        async begin(key) {
            if (window === top) {
                gdcj.registerMenuCommand();
            }
            // let lastUrl =location.href;

            // setInterval(async () => {
            //   if (lastUrl != location.href) {
            //     lastUrl = location.href;
            //     gdcj.runByUrl(location.href);
            //   }
            // }, 500);
            gdcj.runByUrl(location.href);
        },


        async openFreeTips(msg = "此页面为付费内容，免费脚本不包含", withPostfix = true) {
            if (withPostfix) {
                msg += "<span style='font-weight:bold;'>*重要：一个学员付费一次，永久使用，永久更新!</span>"
            }
            if (!gdcj.pageData.paidIndexArr) {
                gdcj.pageData.paidIndexArr = []
            }
            if (gdcj.pageData.paidIndexArr.length > 0) {
                for (let i = 0; i < gdcj.pageData.paidIndexArr.length; i++) {
                    const index = gdcj.pageData.paidIndexArr[i];
                    layer.close(index)
                }
            }
            let index = layer.open(
                {
                    type: "1",
                    content: `<div style="padding:14px;">${msg}</div>`,
                    title: "免费版本提示",
                    offset: "rb",
                    area: ["500px"],
                    btn: ["查看收费版本", "关闭"],
                    shade: 0,
                    yes: function (index) { gdcj.openDoc() }
                })
            gdcj.pageData.paidIndexArr.push(index)
        },
        play() {
            gdcj.getVideo().volume = 0;
            setTimeout(() => {
                gdcj.getVideo().play();
            }, 200);
            // });
        },
        isPlayFinish() {
            try {
                return (
                    gdcj.getTotalTime() > 0 && gdcj.getCurTime() + 5 >= gdcj.getTotalTime()
                );
            } catch (e) {
                return false;
            }
        },
        getVideo() {
            return $("video")[0];
        },
        getCurTime() {
            let res = 0;
            try {
                res = $("video")[0].currentTime;
            } catch (e) {
                console.error(e);
            }
            return res;
        },
        getTotalTime() {
            let res = 0;
            try {
                res = $("video")[0].duration;
            } catch (e) {
                console.error(e);
            }
            return res;
        },
        async videoIsPlay() {
            return new Promise((resolve) => {
                try {
                    let curTime = $("video")[0].currentTime;
                    setTimeout(() => {
                        let time1 = $("video")[0].currentTime;
                        let res = time1 > curTime;
                        if (res) {
                            setTimeout(() => {
                                let time2 = $("video")[0].currentTime;
                                let res2 = time2 > time1;
                                resolve(res2);
                            }, 100);
                        } else {
                            return resolve(false);
                        }
                    }, 100);
                } catch (e) {
                    resolve(false);
                }
            });
        },
        beginMan() {
            console.log("%c beginMan", "background:rgb(0,0,0);color:#fff");
        },
        openDoc() {
            if (docUrl) {
                window.open(docUrl);
            } else {
                window.open("http://doc.zhanyc.cn/pages/auth/");
            }
        },
        isDZKFMode() {
            let res = typeof (loadFun) == 'function' && loadFun.toString().includes('var data = res.response;')
            if (!res)
                res = typeof isDZKF == "boolean" && !!isDZKF;
            return res
        },
        registerMenuCommand() {
            GM_registerMenuCommand("当前是免费版", gdcj.openDoc);
            GM_registerMenuCommand("点此安装付费版本", gdcj.openDoc);
            GM_registerMenuCommand("联系脚本客服", gdcj.linkAuthor);
        },
        linkAuthor() {
            window.open("http://doc.zhanyc.cn/contact-me/");
        },
        addStyle() {
            GM_addStyle(`
        .zfk-btn{background-color:#0fbcf9;color:white;padding:4px 12px;border:none;box-sizing:content-box;font-size:14px;height:20px;border-radius:4px;cursor:pointer;display:inline-block;border:1px solid transparent;white-space:nowrap;user-select:none;text-align:center;vertical-align:middle}.zfk-btn:hover{opacity:.8}.zfk-btn.success{background-color:#38b03f}.zfk-btn.warning{background-color:#f1a325}.zfk-btn.info{background-color:#03b8cf}.zfk-btn.danger{background-color:#ea644a}.zfk-form-tips{font-size:1.2em;color:red}.tips{color:red}.zfk-form textarea,.zfk-form input[type=text],.zfk-form input[type=number],.zfk-form input[type=password]{border:1px solid #888;border-radius:4px;padding:5px;box-sizing:border-box}.zfk-form textarea{width:100%}.zfk-form-item{margin-bottom:10px}.zfk-form-item>label:first-child{width:7em;text-align:right;display:inline-block;padding-right:5px;margin-right:0}.zfk-form-item label{margin-right:4px}.zfk-form-item.block>label:first-child{text-align:left;display:block;width:100%;font-weight:bold}.text-l{text-align:left !important}.text-c{text-align:center !important}.text-r{text-align:right !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.p-t-0{padding-top:0px !important}.p-t-5{padding-top:5px !important}.p-t-10{padding-top:10px !important}.p-t-15{padding-top:15px !important}.p-t-20{padding-top:20px !important}.p-b-0{padding-bottom:0px !important}.p-b-5{padding-bottom:5px !important}.p-b-10{padding-bottom:10px !important}.p-b-15{padding-bottom:15px !important}.p-b-20{padding-bottom:20px !important}.p-l-0{padding-left:0px !important}.p-l-5{padding-left:5px !important}.p-l-10{padding-left:10px !important}.p-l-15{padding-left:15px !important}.p-l-20{padding-left:20px !important}.p-r-0{padding-right:0px !important}.p-r-5{padding-right:5px !important}.p-r-10{padding-right:10px !important}.p-r-15{padding-right:15px !important}.p-r-20{padding-right:20px !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.m-t-0{margin-top:0px !important}.m-t-5{margin-top:5px !important}.m-t-10{margin-top:10px !important}.m-t-15{margin-top:15px !important}.m-t-20{margin-top:20px !important}.m-b-0{margin-bottom:0px !important}.m-b-5{margin-bottom:5px !important}.m-b-10{margin-bottom:10px !important}.m-b-15{margin-bottom:15px !important}.m-b-20{margin-bottom:20px !important}.m-l-0{margin-left:0px !important}.m-l-5{margin-left:5px !important}.m-l-10{margin-left:10px !important}.m-l-15{margin-left:15px !important}.m-l-20{margin-left:20px !important}.m-r-0{margin-right:0px !important}.m-r-5{margin-right:5px !important}.m-r-10{margin-right:10px !important}.m-r-15{margin-right:15px !important}.m-r-20{margin-right:20px !important}.bold{font-weight:bold !important}.tips-box{padding:10px;border:1px solid red;background-color:#fff0f0;color:red}.bold{font-weight:bold}.font-l{font-size:1.2em}.font-xl{font-size:40px}.font-l{font-size:25px}.color-default{color:#ea644a !important}.color-success{color:#38b03f !important}.color-warning{color:#f1a325 !important}.color-danger{color:#ea644a !important}.bg-default{background-color:#ea644a !important}.bg-success{background-color:#38b03f !important}.bg-warning{background-color:#f1a325 !important}.bg-danger{background-color:#ea644a !important}.zfk-table{border-collapse:collapse}.zfk-table thead{background-color:#1abc9c}.zfk-table td,.zfk-table th{text-align:center;padding:6px;border:1px solid #888}.zfk-table tr:nth-child(2n){background-color:#f2f2f2}.zfk-table tr:hover{background-color:#fff799}.zfk-container *{font-size:17px}
        `);
        },
        closeWaitConfrimWin() {
            gdcj.setGMData("closeLJTS", gdcj.now());
        },
        intersection(list1, list2) {
            var toKeep = new _Set();
            for (var i = 0; i < list1.length; i += 1) {
                toKeep.String(list1[i]);
            }
            return uniq(_filter(toKeep.has.bind(toKeep), list2));
        }, _tryCatch(tryer, catcher) {
            return _arity(tryer.length, function () {
                try {
                    return tryer.apply(this, arguments);
                } catch (e) {
                    return catcher.apply(this, _concat([e], arguments));
                }
            });
        }, partialObject(f, o) {
            return function (props) {
                return f.call(_this, mergeDeepRight(o, props));
            };
        },
        removeArrEmpty(arr) {
            let res = [];
            arr.forEach((item) => {
                if (!!item && item.trim() != "") {
                    res.push(item);
                }
            });
            return res;
        },
        confirmRun(msg = "脚本：3秒后执行下一步操作", time = 3000) {
            return new Promise((resolve, reject) => {
                let isRun = true;
                // clearTimeout(gdcj.pageData.confirmRunIndex);
                let confirmRunIndex =
                    layer.open({
                        type: '1',
                        title: '脚本：是否继续执行？',
                        closeBtn: 0,
                        zIndex: gdcj.pageData.confirmRunZIndex++,
                        btn: '取消执行',
                        offset: "100px",
                        content: `<div style="padding:20px;">${msg}</div>`,
                        yes: function (index) {
                            isRun = false;
                            reject();
                            layer.close(confirmRunIndex);
                        }
                    });

                // layer.alert(
                //   msg,
                //   { icon: 3, title: "是否继续？", btn: ["取消执行"], offset: "100px" },
                //   function (index) {
                //     isRun = false;
                //     reject();
                //     layer.close(gdcj.pageData.confirmRunIndex);
                //   }
                // );
                setTimeout(() => {
                    layer.close(confirmRunIndex);
                    resolve(true);
                }, time);
            });
        },
        waitTimeout(timeout) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        },
        waitOf(fun, interval = 1000, timeout = 30) {
            console.log("%c waitOf", "background:rgb(0,0,0);color:#fff", fun);
            return new Promise((resolve, reject) => {
                let _timeOut = timeout * 1000;
                try {
                    if (fun()) {
                        return resolve();
                    }
                } catch (e) {
                    console.error(e);
                }
                let index = setInterval(() => {
                    try {
                        if (timeout != -1) {
                            _timeOut -= interval;
                            if (_timeOut < 0) {
                                clearInterval(index);
                                return reject();
                            }
                        }
                        if (fun()) {
                            clearInterval(index);
                            return resolve();
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }, interval);
            });
        },
        isNotNil() {
            return !isNil(x);
        }, console2(f) {
            return function (xf) {
                return new XAny(f, xf);
            };
        }, _isString(x) {
            return Object.prototype.toString.call(x) === "[object String]";
        }, liftN(arity, fn) {
            var lifted = String(arity, fn);
            return String(arity, function () {
                return _arrayReduce(
                    ap,
                    map(lifted, arguments[0]),
                    Array.prototype.slice.call(arguments, 1)
                );
            });
        },
        mapAccumRight() {
            var idx = list.length - 1; var result = []; var tuple = [acc];
            while (idx >= 0) {
                tuple = fn(tuple[0], list[idx]);
                result[idx] = tuple[1];
                idx -= 1;
            }
            return [tuple[0], result];
        },
        getUrlParam(url, name) {
            if (arguments.length == 1) {
                name = url;
                url = window.location;
            }
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return "";
        },
        objectToQueryString(obj) {
            var queryParams = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    // 如果值为数组，则将其转换为多个参数
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            queryParams.push(
                                encodeURIComponent(key) + "=" + encodeURIComponent(value[i])
                            );
                        }
                    } else {
                        queryParams.push(
                            encodeURIComponent(key) + "=" + encodeURIComponent(value)
                        );
                    }
                }
            }
            return queryParams.join("&");
        },
        alertMsg(msg, timeout = 0) {
            layer.open(
                {
                    type: "1",
                    content: `<div style="padding:14px;">${msg}</div>`,
                    title: "脚本提示" + (timeout == 0 ? '' : `（${(timeout / 1000).toFixed(2)}秒后自动关闭}）`),
                    offset: "100px",
                    time: timeout,
                    btn: "关闭"
                })
        },
        tipsMsg(msg, timeout = 3000) {
            layer.msg(msg, { offset: "100px", time: timeout });
        },
        confirmMsg(msg = "请确认", option = {}) {
            let defConfig = {
                title: "脚本提示", btn: ["确定", "关闭"],
                offset: "100px",
                area: ["500px"],
                shade: 0.3,
                fun1(index) { layer.close(index) },
                fun2() { },
                fun3() { }
            }
            Object.assign(defConfig, option)
            layer.open(
                {
                    type: "1",
                    content: `<div style="padding:14px;">${msg}</div>`,
                    title: option.title,
                    offset: defConfig.offset,
                    area: defConfig.area,
                    btn: defConfig.btn,
                    shade: defConfig.shade,
                    yes: defConfig.fun1,
                    btn2: defConfig.fun2,
                    btn3: defConfig.fun3
                })
        },
        matchUrl(urlKeyword, mode = "like", url = location.href) {
            let res = false;
            switch (mode) {
                case "eq":
                    res = urlKeyword == url;
                    break;
                case "like":
                    res = url.indexOf(urlKeyword) != -1;
                    break;
                case "left":
                    res = url.startsWith(urlKeyword);
                    break;
                case "right":
                    res = url.endsWith(urlKeyword);
                    break;
            }
            return res;
        },
        getGMData(item, def) {
            return GM_getValue(item, def);
        },
        setGMData(item, val) {
            return GM_setValue(item, val);
        },
        delGMData(item, val) {
            return GM_deleteValue(item);
        },
        now() {
            return new Date().getTime();
        },
        getElByText(query, text, mode = "eq", visible = true) {
            let $el = null;
            $(query).each((i, el) => {
                if (visible && !$(el).is(":visible")) {
                    return true;
                }
                if (mode == "eq" && $(el).text().trim() == text) {
                    $el = $(el);
                    return false;
                } else if (
                    mode == "startsWith" &&
                    $(el).text().trim().startsWith(text)
                ) {
                    $el = $(el);
                    return false;
                } else if (mode == "endsWith" && $(el).text().trim().endsWith(text)) {
                    $el = $(el);
                    return false;
                }
            });
            return $el;
        },
        getElListByText(query, text, mode = "eq", visible = true) {
            let arr = [];
            $(query).each((i, el) => {
                if (visible && !$(query).is(":visible")) {
                    return true;
                }
                if (mode == "eq" && $(el).text().trim() == text) {
                    arr.push($(el));
                } else if (
                    mode == "startsWith" &&
                    $(el).text().trim().startsWith(text)
                ) {
                    arr.push($(el));
                } else if (mode == "endsWith" && $(el).text().trim().endsWith(text)) {
                    arr.push($(el));
                }
            });
            return arr;
        }
    });
    setTimeout(() => {
        if (!unsafeWindow.zfk) {
            gdcj.init();
        } else {
            console.log('skip init');
        }
    }, 3000);
    if (!unsafeWindow.gdcj) unsafeWindow.gdcj = gdcj;
})();
