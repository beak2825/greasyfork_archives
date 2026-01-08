// ==UserScript==
// @name            批量下载微博原图、视频、livephoto
// @name:zh         批量下载微博原图、视频、livephoto
// @name:en         Batch Download Src Image From Weibo Card
// @namespace       https://github.com/Jeffrey-deng/userscript
// @version         2.3.7
// @description     一键打包下载微博中一贴的原图、视频、livephoto，收藏时本地自动备份
// @description:zh  一键打包下载微博中一贴的原图、视频、livephoto，收藏时本地自动备份
// @description:en  Batch download weibo's source image
// @author          Jeffrey.Deng
// @supportURL      https://imcoder.site/a/detail/HuXBzyC
// @homepageURL     https://imcoder.site
// @weibo           http://weibo.com/3983281402
// @match           https://weibo.com/*
// @match           https://www.weibo.com/*
// @match           https://d.weibo.com/*
// @match           http://*.sinaimg.cn/*
// @match           https://*.sinaimg.cn/*
// @match           http://*.sinaimg.com/*
// @match           https://*.sinaimg.com/*
// @connect         sinaimg.cn
// @connect         weibocdn.com
// @connect         weibo.com
// @connect         miaopai.com
// @connect         tbcache.com
// @connect         youku.com
// @connect         *
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @resource        toastr_css https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.css
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlHttpRequest
// @grant           GM_download
// @grant           GM_notification
// @grant           GM_setClipboard
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/394252/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%BE%AE%E5%8D%9A%E5%8E%9F%E5%9B%BE%E3%80%81%E8%A7%86%E9%A2%91%E3%80%81livephoto.user.js
// @updateURL https://update.greasyfork.org/scripts/394252/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%BE%AE%E5%8D%9A%E5%8E%9F%E5%9B%BE%E3%80%81%E8%A7%86%E9%A2%91%E3%80%81livephoto.meta.js
// ==/UserScript==

// @更新日志
// v.2.3.7      2026.1.9       1.修复批量下载问题
// v.2.3.6      2025.4.8       1.更改依赖包cdn地址
// v.2.3.5      2023.9.14      1.优化删除微博还原显示，不显示html代码而是显示解析值
// v.2.3.4      2023.4.24      1.修复微博打包下载zip内，文件修改时间错位8个时区问题
// v.2.3        2023.4.8       1.支持图片与视频混合微博、支持多视频微博
//                             2.新版微博支持在【收藏页面】的【被删除的微博】上用备份数据还原显示
// v.2.2        2023.4.2       1.简单适配新版微博批量下载、评论收藏、收藏面板；新版微博的html元素是往下滚动是复用的，所以脚本总是无法达到老版微博的体验，请理解
// v.2.1        2022.11.10     1.尝试解决一些下载图片报错问题，但不一定能解决，我没有网络能测试，我这边下载是一切正常的，我的浏览器是Chrome最新版/mac
// v.2.0.6      2022.7.1       1.增加微博收藏查看面板，只适配了旧版微博样式
// v.2.0        2021.5.30      1.初步适配新版微博，修复18图bug，修复批量下载bug
// v.1.9.4      2020.8.15      1.去掉下载超时时间，修复当照片大小超大时，陷于循环的情况
// v.1.9.3      2020.7.11      1.修复jQuery下载失败问题
// V 1.9.2      2020.06.29     1.照片按原页面显示顺序排序
// V 1.9.0      2020.06.10     1.一键下载用户一页的微博
//                             2.批量备份一页收藏
// V 1.8.7      2020.05.26     1.增加收藏时自动备份（不需要点击确认框）开关
//                             2.修复在超过9张图（over9pic）中含有gif时，gif的文件名后缀错误的问题
//                             3.修复当转发的微博被删除时可能出现备份读取不到的问题
// V 1.8.6      2020.05.23     1.修复www.weibo.com域名下不起作用的问题
// V 1.8.5      2020.05.15     1.修复视频下载失败，原因是不能弹出白名单确认框，解决办法是允许所有域名，弹出确认框后请点击总是允许所有域名，请放心点允许，代码绝对无后门
// V 1.8.3      2020.05.12     1.优化收藏备份
// V 1.8.2      2020.05.07     1.修复只有一张图片时，无法下载livephoto的问题
// V 1.8        2020.04.30     1.收藏时自动备份收藏到本地缓存(只备份图片链接)，这样博主删除微博仍能找到内容
// V 1.6        2020.04.29     1.打印链接直接用面板显示，感谢@indefined提供的代码
// V 1.5        2020.03.26     1.支持只打印链接，仅在控制台打印链接（按F12打开控制台console），【建议先按F12打开控制台console，在点按钮】
// V 1.4        2020.03.26     1.支持只下载链接，按钮【打包下载】：下载文件和链接，【下载链接】：仅下载链接
// V 1.3        2020.01.26     1.修复bug
// V 1.0        2019.12.26     1.支持打包下载用户一次动态的所有原图
//                             2.支持下载18图
//                             3.支持下载livephoto
//                             4.支持下载视频
//                             5.支持下载微博故事
//                             6.右键图片新标签直接打开原图

(function(factory) {
    factory(document, jQuery);
    // console.time('『微博原图下载』/ready_init_use_time');
    // $().ready(function(){
    //     console.timeEnd('『微博原图下载』/ready_init_use_time');
    //     factory(document, jQuery);
    // });
})(function (document, $) {

    var common_utils = (function (document, $) {
        function parseURL(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }

        function formatDate (date, fmt) {
            if (typeof date == 'number') {
                date = new Date(date);
            }
            var o = {
                "M+": date.getMonth() + 1,               //月份
                "d+": date.getDate(),                    //日
                "h+": date.getHours(),                   //小时
                "m+": date.getMinutes(),                 //分
                "s+": date.getSeconds(),                 //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds()              //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return fmt;
        };

        function ajaxDownload(url, callback, args, tryTimes) {
            var headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
                //'cache-control': 'max-age=0',
                'referer': 'https://weibo.com/'
            };
            if (typeof url === 'object') {
                headers = url.headers;
                url = url.url;
            }
            tryTimes = tryTimes || 0;
            var GM_download = GM.xmlHttpRequest || GM_xmlHttpRequest,
                clearUrl = url.replace(/[&\?]?download_timestamp=\d+/, ''),
                retryUrl = clearUrl + (clearUrl.indexOf('?') === -1 ? '?' : '&') + 'download_timestamp=' + new Date().getTime(),
                nocache = tryTimes === 0 ? false : true;
            GM_download({
                method: 'GET',
                responseType: 'blob',
                url: url,
                headers: headers,
                //timeout: 2000,
                nocache: nocache,
                onreadystatechange: function (responseDetails) {
                    if (responseDetails.readyState === 4) {
                        if (responseDetails.response != null && (responseDetails.status === 200)) {
                            var blob = responseDetails.response, size = blob && blob.size;
                            if (size && (size / 1024 > 0)) {
                                callback(blob, args);
                            } else if (tryTimes++ == 3) {
                                callback(blob, args);
                            } else {
                                setTimeout(function() {
                                    ajaxDownload(retryUrl, callback, args, tryTimes);
                                }, 500);
                            }
                        } else {
                            if (tryTimes++ == 3) {
                                callback(null, args);
                            } else {
                                setTimeout(function() {
                                    ajaxDownload(retryUrl, callback, args, tryTimes);
                                }, 500);
                            }
                        }
                    }
                },
                onerror: function (responseDetails) {
                    if (tryTimes++ == 3) {
                        callback(null, args);
                    } else {
                        setTimeout(function() {
                            ajaxDownload(retryUrl, callback, args, tryTimes);
                        }, 500);
                    }
                    console.log(responseDetails.status);
                }
            });
            // try {
            //     var xhr = new XMLHttpRequest();
            //     xhr.open('GET', url, true);
            //     xhr.responseType = "blob";
            //     xhr.onreadystatechange = function(evt) {
            //         if (xhr.readyState === 4) {
            //             if (xhr.status === 200 || xhr.status === 0) {
            //                 callback(xhr.response, args);
            //             } else {
            //                 callback(null, args);
            //             }
            //         }
            //     };
            //     xhr.send();
            // } catch (e) {
            //     callback(null, args);
            // }
        }

        function fileNameFromHeader(disposition, url) {
            var result = null;
            if (disposition && /filename=.*/ig.test(disposition)) {
                result = disposition.match(/filename=.*/ig);
                return decodeURI(result[0].split("=")[1]);
            }
            return url.substring(url.lastIndexOf('/') + 1);
        }

        function downloadBlobFile(content, fileName) {
            if ('msSaveOrOpenBlob' in navigator) {
                navigator.msSaveOrOpenBlob(content, fileName);
            } else {
                var aLink = document.createElement('a');
                aLink.className = 'download-temp-node';
                aLink.download = fileName;
                aLink.style = "display:none;";
                var blob = new Blob([content], {type: content.type});
                aLink.href = window.URL.createObjectURL(blob);
                document.body.appendChild(aLink);
                if (document.all) {
                    aLink.click(); //IE
                } else {
                    var evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    aLink.dispatchEvent(evt); // 其它浏览器
                }
                window.URL.revokeObjectURL(aLink.href);
                document.body.removeChild(aLink);
            }
        }

        function downloadUrlFile(url, fileName) {
            var aLink = document.createElement('a');
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
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                aLink.dispatchEvent(evt); // 其它浏览器
            }
            document.body.removeChild(aLink);
        }

        function paddingZero(num, length) {
            return (Array(length).join("0") + num).substr(-length);
        }

        /*  Class: TaskQueue
         *  Constructor: handler
         *      takes a function which will be the task handler to be called,
         *      handler should return Deferred object(not Promise), if not it will run immediately;
         *  methods: append
         *      appends a task to the Queue. Queue will only call a task when the previous task has finished
         */
        var TaskQueue = function (handler) {
            var tasks = [];
            // empty resolved deferred object
            var deferred = $.when();

            // handle the next object
            function handleNextTask() {
                // if the current deferred task has resolved and there are more tasks
                if (deferred.state() == "resolved" && tasks.length > 0) {
                    // grab a task
                    var task = tasks.shift();
                    // set the deferred to be deferred returned from the handler
                    deferred = handler(task);
                    // if its not a deferred object then set it to be an empty deferred object
                    if (!(deferred && deferred.promise)) {
                        deferred = $.when();
                    }
                    // if we have tasks left then handle the next one when the current one
                    // is done.
                    if (tasks.length >= 0) {
                        deferred.fail(function () {
                            tasks = [];
                        });
                        deferred.done(handleNextTask);
                    }
                }
            }

            // appends a task.
            this.append = function (task) {
                // add to the array
                tasks.push(task);
                // handle the next task
                handleNextTask();
            };
        };

        /**
        * 判断元素是否在出现在可见区域内
        *
        * @param element
        * @param {Number=} ON_SCREEN_HEIGHT  用来设置元素出现在屏幕中 N px的条件，也就是这里的ON_SCREEN_HEIGHT。只要保证元素的上下左右四个边界都在屏幕内显示超过npx，我们就可以认为元素出现在页面中了。
        * @param {Number=} ON_SCREEN_WIDTH
        * @returns {boolean}
        */
        var isOnScreen = function (element, ON_SCREEN_HEIGHT, ON_SCREEN_WIDTH) {
            var ON_SCREEN_HEIGHT = ON_SCREEN_HEIGHT || 20;
            var ON_SCREEN_WIDTH = ON_SCREEN_WIDTH || 20;

            var rect = element.getBoundingClientRect();
            var windowHeight = window.innerHeight || document.documentElement.clientHeight;
            var windowWidth = window.innerWidth || document.documentElement.clientWidth;

            var elementHeight = element.offsetHeight;
            var elementWidth = element.offsetWidth;

            var onScreenHeight = ON_SCREEN_HEIGHT > elementHeight ? elementHeight : ON_SCREEN_HEIGHT;
            var onScreenWidth = ON_SCREEN_WIDTH > elementWidth ? elementWidth : ON_SCREEN_WIDTH;

            // 元素在屏幕上方
            var elementBottomToWindowTop = rect.top + elementHeight;
            var bottomBoundingOnScreen = elementBottomToWindowTop >= onScreenHeight;

            // 元素在屏幕下方
            var elementTopToWindowBottom = windowHeight - (rect.bottom - elementHeight);
            var topBoundingOnScreen = elementTopToWindowBottom >= onScreenHeight;

            // 元素在屏幕左侧
            var elementRightToWindowLeft = rect.left + elementWidth;
            var rightBoundingOnScreen = elementRightToWindowLeft >= onScreenWidth;

            // 元素在屏幕右侧
            var elementLeftToWindowRight = windowWidth - (rect.right - elementWidth);
            var leftBoundingOnScreen = elementLeftToWindowRight >= onScreenWidth;

            return bottomBoundingOnScreen && topBoundingOnScreen && rightBoundingOnScreen && leftBoundingOnScreen;
        };

        var context = {
            "formatDate": formatDate,
            "ajaxDownload": ajaxDownload,
            "fileNameFromHeader": fileNameFromHeader,
            "downloadBlobFile": downloadBlobFile,
            "downloadUrlFile": downloadUrlFile,
            "parseURL": parseURL,
            "paddingZero": paddingZero,
            "TaskQueue": TaskQueue,
            "isOnScreen": isOnScreen
        };
        return context;
    })(document, jQuery);

    var options = {
        "type": 2,
        "isNeedConfirmDownload": true,
        "isNeedHasFiles": true,
        "useQueueDownloadThreshold": 0,
        "suffix": null,
        "callback": {
            "parseLocationInfo_callback": function (location_info, options) {
                return common_utils.parseURL(document.location.href);
            },
            "parseFiles_callback": function (location_info, options) {
                // file.url file.folder_sort_index
                // not folder_sort_index -> use fileName
                var files = [];
                return files;
            },
            "makeNames_callback": function (arr, location_info, options) {
                var names = {};
                var time = new Date().getTime();
                names.zipName = "pack_" + time;
                names.folderName = names.zipName;
                names.infoName = null;
                names.infoValue = null;
                names.prefix = time;
                names.suffix = options.suffix;
                return names;
            },
            "beforeFilesDownload_callback": function (files, names, location_info, options, zip, main_folder) {
            },
            "beforeFileDownload_callback": function (file, location_info, options, zipFileLength, zip, main_folder, folder) {
            },
            "eachFileOnload_callback": function (blob, file, location_info, options, zipFileLength, zip, main_folder, folder) {
            },
            "allFilesOnload_callback": function (files, names, location_info, options, zip, main_folder) {
            },
            "beforeZipFileDownload_callback": function (zip_blob, files, names, location_info, options, zip, main_folder) {
                common_utils.downloadBlobFile(zip_blob, names.zipName + ".zip");
            }
        }
    };

    var ajaxDownloadAndZipFiles = function (files, names, location_info, options) {
        // GM_notification("开始下载～", names.zipName);
        var notify_start = toastr.success("正在打包～", names.zipName, {
            "progressBar": false,
            "hideDuration": 0,
            "showDuration": 0,
            "timeOut": 0,
            "closeButton": false
        });
        if (!options.isNeedHasFiles || (files && files.length > 0)) {
            var fixTimezoneOffset = function () {
                const currDate = new Date();
                const dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
                // replace the default date with dateWithOffset
                JSZip.defaults.date = dateWithOffset;
            }
            var zip = new JSZip();
            fixTimezoneOffset();
            var main_folder = zip.folder(names.folderName);
            var zipFileLength = 0;
            var maxLength = files.length;
            var paddingZeroLength = (files.length + "").length;
            if (names.infoName) {
                fixTimezoneOffset();
                main_folder.file(names.infoName, names.infoValue);
            }
            options.callback.beforeFilesDownload_callback(files, names, location_info, options, zip, main_folder);
            var downloadFile = function (file, resolveCallback) {
                var triggerCompleted = file === true;
                return $.Deferred(function(dfd) {
                    if (triggerCompleted) {
                        dfd.resolve();
                        return;
                    }
                    fixTimezoneOffset();
                    var folder = file.location ? main_folder.folder(file.location) : main_folder;
                    var isSave = options.callback.beforeFileDownload_callback(file, location_info, options, zipFileLength, zip, main_folder, folder);
                    if (isSave !== false) {
                        common_utils.ajaxDownload(file.url, function (blob, file) {
                            var isSave = options.callback.eachFileOnload_callback(blob, file, location_info, options, zipFileLength, zip, main_folder, folder);
                            if (isSave !== false) {
                                fixTimezoneOffset();
                                if (file.fileName) {
                                    folder.file(file.fileName, blob);
                                } else {
                                    var suffix = names.suffix || file.url.substring(file.url.lastIndexOf('.') + 1);
                                    file.fileName = names.prefix + "_" + common_utils.paddingZero(file.folder_sort_index, paddingZeroLength) + "." + suffix;
                                    folder.file(file.fileName, blob);
                                }
                            }
                            dfd.resolveWith(file, [blob, folder, isSave]);
                        }, file);
                    } else {
                        dfd.resolveWith(file, [null, folder, false]);
                    }
                }).done(function(blob, folder, isSave){
                    if (!triggerCompleted) {
                        zipFileLength++;
                        notify_start.find(".toast-message").text("正在打包～ 第 " + zipFileLength + " 张" + (isSave ? "" : "跳过"));
                    }
                    resolveCallback && resolveCallback();   // resolve延迟对象
                    if (triggerCompleted || zipFileLength >= maxLength) {
                        var isDownloadZip = options.callback.allFilesOnload_callback(files, names, location_info, options, zip, main_folder);
                        if (isDownloadZip !== false) {
                            zip.generateAsync({type: "blob"}).then(function (content) {
                                options.callback.beforeZipFileDownload_callback(content, files, names, location_info, options, zip, main_folder);
                            });
                            // GM_notification({text: "打包下载完成！", title: names.zipName, highlight : true});
                            toastr.success("下载完成！", names.zipName, {"progressBar": false, timeOut: 0});
                        }
                        notify_start.css("display", "none").remove();
                    }
                });
            };
            if (maxLength < options.useQueueDownloadThreshold) {
                // 并发数在useQueueDownloadThreshold内，直接下载
                for (var i = 0; i < maxLength; i++) {
                    downloadFile(files[i]);
                }
            } else {
                // 并发数在useQueueDownloadThreshold之上，采用队列下载
                var queue = new common_utils.TaskQueue(function (file) {
                    if (file) {
                        return downloadFile(file);
                    }
                });
                for (var j = 0; j < maxLength; j++) {
                    queue.append(files[j]);
                }
            }
            if (maxLength == 0) {
                downloadFile(true);
            }
        } else {
            notify_start.css("display", "none").remove();
            toastr.error("未解析到图片！", "错误", {"progressBar": false});
        }
    };

    /** 批量下载 **/
    function batchDownload(config) {
        try {
            options = $.extend(true, {}, options, config);
            var location_info = options.callback.parseLocationInfo_callback(options);
            var files = options.callback.parseFiles_callback(location_info, options);
            if (!(files && files.promise)) {
                files = $.when(files);
            }
            files.done(function (files) {
                var hasFiles = files && files.length > 0;
                if (!options.isNeedHasFiles || hasFiles) {
                    if (!hasFiles) {
                        files = [];
                    }
                    if (!options.isNeedConfirmDownload || confirm("是否下载 " + files.length + " 张图片")) {
                        var names = options.callback.makeNames_callback(files, location_info, options);
                        options.location_info = location_info;
                        options.files = files;
                        options.names = names;
                        if (options.type == 1) {
                            urlDownload(files, names, location_info, options);
                        } else {
                            ajaxDownloadAndZipFiles(files, names, location_info, options);
                        }
                    }
                } else {
                    toastr.error("未找到图片~", "");
                }
            }).fail(function(message) {
                toastr.error(message, "错误");
            });
        } catch (e) {
            // GM_notification("批量下载照片 出现错误！", "");
            console.warn("批量下载照片 出现错误！, exception: ", e);
            toastr.error("批量下载照片 出现错误！", "");
        }

    }

    /** 下载 **/
    function urlDownload(photos, names, location_info, options) {
        GM_notification("开始下载～", names.zipName);
        var index = 0;
        var interval = setInterval(function () {
            if (index < photos.length) {
                var url = photos[index].url;
                var fileName = null;
                if (!names.suffix) {
                    fileName = names.prefix + "_" + (index + 1) + url.substring(url.lastIndexOf('.'));
                } else {
                    fileName = names.prefix + "_" + (index + 1) + "." + names.suffix;
                }
                common_utils.downloadUrlFile(url, fileName);
            } else {
                clearInterval(interval);
                return;
            }
            index++;
        }, 100);
    }

    // 右键新标签打开图片直接打开原图
    function initRightClickOpenSource() {
        var url = document.location.toString();
        var m;
        if ((m = url.match(/^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i))) {
            if (m[2] != "large") {
                document.location = m[1] + "large" + m[3];
            }
        }
    }

    /*** start main ***/

    //右键新标签打开图片直接打开原图
    initRightClickOpenSource();

    // css
    GM_addStyle(GM_getResourceText('toastr_css'));
    GM_addStyle('.download-link-pop {'+
        '    position: absolute;'+
        '    right: 4px;'+
        '    top: 40px;'+
        '    width: 70%;'+
        '    z-index: 100;'+
        '}'+
        '.download-link-pop > * {'+
        '    padding: 15px;'+
        '}'+
        '.download-link-pop .link-list ul li {'+
        '    border-top: 1px solid #eee;'+
        '    padding-top: 4px;'+
        '    padding-bottom: 4px;'+
        '}'+
        '.download-link-pop .link-list ul li:first-child {'+
        '    border-top: unset;'+
        '    padding-top: 0px;'+
        '}'+
        '.download-link-pop .link-list ul li:last-child {'+
        '    padding-bottom: 0px;'+
        '}'+
        '.download-link-pop .link-list li a{'+
        '    word-break: break-all;'+
        '}'+
        '.download-link-pop .sidebar {'+
        '    position: absolute;'+
        '    bottom: -1px;'+
        '    right: -65px;'+
        '    width: 65px;'+
        '    padding: 0px 0px 1px 0px;'+
        '    background: #fff;'+
        '    border: 1px solid #ccc;'+
        '    border-left-width: 0px;'+
        '    border-bottom-right-radius: 3px;'+
        '    border-top-right-radius: 3px;'+
        '    text-align: center;'+
        '    visibility:hidden;'+
        '}'+
        '.download-link-pop .sidebar-btn {'+
        '    font-weight: bold;'+
        '    font-size: 12px;'+
        '    padding: 3px 4px;'+
        '    line-height: 22px;'+
        '    border-top: 1px solid #ccc;'+
        '    cursor: pointer;'+
        '}'+
        '.download-link-pop .sidebar-btn:first-child {'+
        '    border-top-width: 0px;'+
        '}'+
        '.download-link-pop:hover .sidebar {'+
        '    visibility:visible;'+
        '}'+
        '.download-link-pop .preview {'+
        '    /*visibility:hidden;*/'+
        '    display: none;'+
        '}'+
        '.download-link-pop .preview img {'+
        '    width: 100%;'+
        '}'+
        '#app .download-link-pop {'+
        '   background: #f9f9f9;'+
        '   border-radius: 3px;'+
        '   border: 1px solid #ccc;'+
        '   box-shadow: 0 4px 20px 1px rgb(0 0 0 / 20%);'+
        '   font-size: 0.8rem!important;'+
        '   width: 80%;'+
        '}'+
        '#app .download-link-pop > * {'+
        '    padding: 0px;'+
        '}'+
        '#app .download-link-pop .link-list ul  {'+
        '    padding: 10px 0px 10px 35px;'+
        '    margin: 5px;'+
        '}'+
        '#app .download-link-pop .preview {'+
        '    padding: 0px 15px 15px 15px;'+
        '}'
    );

    const Constants = {
        KEY_FAV_BACKUP_GROUP: 'weibo_fav_backup_group',
        KEY_SETTING_AUTO_BACKUP_FAV: 'weibo_setting_auto_backup_fav'
    };


    /**
     * 接口
     */
    class Interface {

        /**
         * 构造函数
         * @param  {字符串} name    接口名
         * @param  {字符串数组} methods 该接口所包含的所有方法
         */
        constructor(name, methods) {

            //判断接口的参数个数(第一个为接口对象,第二个为参数数组)
            if (arguments.length != 2) {
                throw new Error('创建的接口对象参数必须为两个,第二个为方法数组！');
            }

            // 判断第二个参数是否为数组
            if(!Array.isArray(methods)){
                throw new Error('参数2必须为字符串数组！');
            }

            //接口对象引用名
            this.name = name;

            //自己的属性
            this.methods = []; //定义一个内置的空数组对象 等待接受methods里的元素（方法名称）

            //判断数组是否中的元素是否为string的字符串
            for (var i = 0; i < methods.length; i++) {

                //判断方法数组里面是否为string(字符串)的属性
                if (typeof methods[i] != 'string') {
                    throw new Error('方法名必须是string类型的!');
                }

                //把他放在接口对象中的methods中(把接口方法名放在Interface对象的数组中)
                this.methods.push(methods[i]);
            }
        }

        /**
         * 实现
         * @param  {对象} obj 待实现接口的对象
         * @param  {接口} I 接口对象
         * @param  {对象} proxy 接口的实现
         * @return {对象}           扩展后的当前对象
         */
        static impl(obj, I, proxy) {

            if (I.constructor != Interface) {
                throw new Error("参数2不是一个接口！");
            }

            // 校验实现是否实现了接口的每一个方法
            for (var i = 0; i < I.methods.length; i++) {

                // 方法名
                var methodName = I.methods[i];

                //判断obj中是否实现了接口的方法和methodName是方法(而不是属性)
                if (!proxy[methodName] || typeof proxy[methodName] != 'function') {
                    throw new Error('有接口的方法没实现');
                }

                // 将代理中的方法渡给obj
                obj[methodName] = proxy[methodName];
            }
        }
    }
    /*jshint esversion: 6 */


    /**
     * 微博解析器接口
     */
    const WeiboResolver = new Interface("WeiboResolver",[
        "getResolverName",
        "addDownloadBtnToWeiboCard", //
        "showPhotoLinksPopPanel", //
        "findWeiboCardMid", //
        "isWeiboDelete", //
        "downloadWeiboCardPhotos",
        "addFavWeiboBackup",
        "getFavWeiboBackup",
        "removeFavWeiboBackup",
        "generateBatchDownloadOptionsFromBackup",
        "batchDownloadPageWeiboCard",
        "showFavWeiboRestoreBtn",
        "findFeedCardItemList",
        "findCardArrowDown",
        "findElemClosestCard",
        "findCardPhotoDownloadBtn",
        "findDeletedCard",
        "findCardFavBtn",
        "findCardShowBackupBtn",
        "findCardRebuildBackupBtn",
        "findCardRestoreBackupBtn",
    ]);
    /*jshint esversion: 6 */


    const OldWeiboResolver = {};

    Interface.impl(OldWeiboResolver, WeiboResolver, {
        "getResolverName": function() {
            return "OldWeiboResolver"
        },
        "addDownloadBtnToWeiboCard": function ($wb_card) {
            var $card_btn_list = $wb_card.find(".WB_feed_detail .WB_screen .layer_menu_list ul:nth-child(1)");
            if ($card_btn_list.find(".WB_card_photos_download").length == 0) {
                $card_btn_list.append('<li class="WB_card_photos_download" title="下载文件和链接"><a>打包下载</a></li>');
                $card_btn_list.append('<li class="WB_card_photos_download WB_card_photos_download_only_download_url" title="仅下载链接，不下载文件"><a>下载链接</a></li>');
                $card_btn_list.append('<li class="WB_card_photos_download WB_card_photos_download_only_print_url" title="仅打印出链接"><a>打印链接</a></li>');
                $card_btn_list.append('<li class="WB_card_photos_show_fav_weibo_backup" title="查看当前微博是否有备份"><a>显示备份</a></li>');
                $card_btn_list.append('<li class="WB_card_photos_rebuild_fav_weibo_backup" title="重新备份当前微博"><a>重新备份</a></li>');
            }
        },
        "showPhotoLinksPopPanel": function ($wb_card, options, removeOnClickBody) {
            const resolver = this;
            options.names || (options.names = {});
            options.callback || (options.callback = {});
            const $pop = $('<div class="W_layer W_layer_pop download-link-pop"><div class="content link-list">' +
                '<div class="sidebar"><span class="sidebar-btn download-all-link" title="全部打包下载">打包下载</span><span class="sidebar-btn copy-all-link" title="复制所有链接">全部复制</span></div>' +
                '<ul></ul></div><div class="content preview"><img></div></div>'),
                $link_ul = $pop.find('.link-list ul'),
                $preview_img = $pop.find('.preview img'),
                photos = options.files, card = options.names.card || options.names.forwardCard || {};
            removeOnClickBody = removeOnClickBody !== false;
            $wb_card.find('.WB_feed_detail').append($pop);
            $.each(photos, function(i, photo) {
                if (photo.location == 'videos' && photo.download_disable) {
                    $link_ul.append(`<li><a href="${photo.url}" target="_blank" data-location="${photo.location}" class="clearfix" title="视频文件链接暂时无法备份，请通过视频链接去尝试获取">${photo.fileName}</a></li>`);
                } else {
                    $link_ul.append(`<li><a href="${photo.url}" target="_blank" download="${photo.fileName}" data-location="${photo.location}" class="clearfix" title="${photo.location == 'photos' ? '点击下载，右键链接另存为' : '右键链接另存为'}">${photo.url}</a></li>`);
                }
            });
            $link_ul.on({
                'mouseenter': function() {
                    let $self = $(this);
                    if ($self.attr('data-location') == 'photos') {
                        $preview_img.attr('src', $self.attr('href').replace('/large/', '/mw690/')).parent().show(); //css('visibility', 'visible');
                        $wb_card.hiding = false;
                    }
                },
                'mouseleave': function() {
                    if ($wb_card.hiding === true) {
                        return;
                    }
                    setTimeout(function () {
                        if ($wb_card.hiding === true) {
                            $preview_img.attr('src', '').parent().hide(); //.css('visibility', 'hidden');
                        }
                        $wb_card.hiding === false;
                    },500);
                    $wb_card.hiding = true;
                },
                'click': function(e) {
                    let $self = $(this), url = $self.attr('href'), fileName = $self.attr('download');
                    if ($self.attr('data-location') == 'photos') {
                        let notify_download_media = toastr.success('正在下载图片～', '', {
                            "progressBar": false,
                            "hideDuration": 0,
                            "showDuration": 0,
                            "timeOut": 0,
                            "closeButton": false,
                        });
                        // GM_download({'url': url, 'name': fileName, 'saveAs': true});
                        common_utils.ajaxDownload(url, function (blob) {
                            if (blob) {
                                if (blob.type === 'image/gif' && fileName.indexOf('.gif') === -1) {
                                    fileName = fileName.replace(/\.[^.]+$/, '.gif');
                                }
                                common_utils.downloadBlobFile(blob, fileName);
                            } else {
                                toastr.error('请手动打开链接下载', '下载失败');
                            }
                            notify_download_media.css("display", "none").remove();
                        });
                        // e.stopImmediatePropagation();
                        return false;
                    }
                }
            }, 'li a');
            $pop.on('click', '.copy-all-link', function() {
                GM_setClipboard($link_ul[0].innerText);
                toastr.success('复制全部链接成功');
            }).on('click', '.download-all-link', function() {
                options.isNeedConfirmDownload = true;
                options.only_download_url = false;
                options.only_print_url = false;
                // if (options.files && !options.callback.parseFiles_callback) {
                //     options.callback.parseFiles_callback = function () {
                //         return options.files;
                //     }
                // }
                resolver.downloadWeiboCardPhotos($wb_card, options);
            });
            if (removeOnClickBody) {
                function remove(ev) {
                    if(!ev.target.classList.contains('download-temp-node') && !$pop[0].contains(ev.target)){
                        $pop.remove();
                        $('body').off("click", remove);
                    }
                }
                $('body').on("click", remove);
            }
            console.log('\n--★-- print -- ' + (options.names.folderName || card.name || (card.text ? card.text.substr(0, 15) : card.mid) || '照片链接') + ' ----★--');
            console.table(JSON.parse(JSON.stringify(photos)), ['location', 'url']);
            console.log('当url被省略可以复制下面的链接，也可从上面 >Array(' + photos.length + ') 查看');
            $.each(photos, function (i, photo) {
                console.log(photo.url);
            });
            return $pop;
        }, //
        "findWeiboCardMid": function ($wb_card, findForwardIfHas) {
            const resolver = this;
            let mid, isForward = $wb_card.attr("isforward") == '1' ? true : false,
                isWeiboDelete = $wb_card.children('.WB_empty').length != 0;
            if (isForward && findForwardIfHas) {
                mid = $wb_card.attr('omid') || $wb_card.find('.WB_feed_detail .WB_detail .WB_feed_expand .WB_expand').find('.WB_handle').attr('mid');
            } else {
                mid = $wb_card.attr('mid');
                if (!mid && isWeiboDelete) {
                    mid = $wb_card.children('.WB_empty').attr('mid');
                }
            }
            return mid;
        }, //
        "isWeiboDelete": function ($wb_card, findForwardIfHas) {
            const resolver = this;
            var isForward = $wb_card.attr("isforward") == '1';
            if (isForward && findForwardIfHas) {
                return $wb_card.find('.WB_expand > .WB_empty').length > 0;
            } else {
                return $wb_card.find('> .WB_empty').length > 0;
            }
        }, //
        "downloadWeiboCardPhotos": function (wb_card_node, options) {
            const resolver = this;
            var $wb_card = (wb_card_node instanceof $) ? wb_card_node : $(wb_card_node);
            var config = {
                "$wb_card": $wb_card,
                "type": 2,
                "isNeedConfirmDownload": true, // 下载前是否需要弹出确认框
                "isNeedHasFiles": false,
                "useQueueDownloadThreshold": 0,
                "only_download_url": false, // 是否仅下载链接，true: 只下链接，false：下载文件和链接
                "only_print_url": false, // 是否仅打印出链接
                "sortByOrigin": true, // 照片按原页面显示顺序排序
                "suffix": null,
                "callback": {
                    "parseFiles_callback": function (location_info, options) {
                        var $wb_detail = $wb_card.find(".WB_feed_detail .WB_detail");
                        var photo_parse_index = 0;
                        var video_parse_index = 0;
                        var photo_arr = [];
                        // 视频
                        var $wb_video = $wb_detail.find(".WB_media_wrap .media_box .WB_video");
                        if ($wb_video.length != 0) {
                            var feedVideo = {};
                            var feedVideoCoverImg = {};
                            var video_data_str = $wb_video.attr("action-data");
                            var isFeedVideo = video_data_str.match(/&?type=feedvideo\b/) ? true : false;
                            if (isFeedVideo) {
                                feedVideo.url = decodeURIComponent(video_data_str.match(/&video_src=([^&]+)/)[1]);
                                feedVideo.url.indexOf("//") == 0 && (feedVideo.url = "https:" + feedVideo.url);
                                feedVideo.fileName = feedVideo.url.match(/\/([^/?]+?(\.mp4)?)\?/)[1] + (RegExp.$2 ? "" : ".mp4");;
                                feedVideo.folder_sort_index = ++video_parse_index;
                                feedVideo.location = "videos";
                                feedVideoCoverImg.url = decodeURIComponent(video_data_str.match(/&cover_img=([^&]+)/)[1]);
                                feedVideoCoverImg.fileName = feedVideoCoverImg.url.match(/\/([^/]+)$/)[1];
                                if (feedVideoCoverImg.url.indexOf("miaopai.com") != -1 || feedVideoCoverImg.url.indexOf("youku.com") != -1 ) {
                                    feedVideoCoverImg.url = feedVideoCoverImg.url;
                                    feedVideoCoverImg.url.indexOf("//") == 0 && (feedVideoCoverImg.url = "https:" + feedVideoCoverImg.url);
                                } else {
                                    feedVideoCoverImg.url = "https://wx3.sinaimg.cn/large/" + feedVideoCoverImg.fileName;
                                }
                                feedVideoCoverImg.folder_sort_index = ++photo_parse_index;
                                feedVideoCoverImg.location = "photos";
                                photo_arr.push(feedVideo);
                                photo_arr.push(feedVideoCoverImg);
                            }
                            var video_sources_str = $wb_video.attr("video-sources");
                            if (video_sources_str) {
                                // 取清晰度最高的
                                var video_source_list = video_sources_str.split("&").filter(function (line) {
                                    return /^\d+=.+/.test(line);
                                }).sort(function (a, b) {
                                    return parseInt(a.match(/^(\d+)=/)[1]) < parseInt(b.match(/^(\d+)=/)[1]) ? 1 : -1;
                                }).map(function (url) {
                                    return decodeURIComponent(url.replace(/^\d+=/, ""));
                                });
                                if (video_source_list.length > 0) {
                                    feedVideo.url = video_source_list[0].replace('label=mp4_720p', 'label=dash_720p');
                                    feedVideo.fileName = feedVideo.url.match(/\/([^/?]+?(\.mp4)?)\?/)[1] + (RegExp.$2 ? "" : ".mp4");
                                }
                            }
                        }
                        // 微博故事
                        var $wb_story = $wb_detail.find(".WB_media_wrap .media_box .li_story");
                        if ($wb_story.length != 0) {
                            var weiboStoryVideo = {};
                            var weibo_story_data_str = $wb_story.attr("action-data");
                            if (/&gif_ourl=([^&]+)/.test(weibo_story_data_str)) {
                                weiboStoryVideo.url = decodeURIComponent(RegExp.$1);
                            } else if (/&gif_url=([^&]+)/.test(weibo_story_data_str)) {
                                weiboStoryVideo.url = decodeURIComponent(RegExp.$1);
                            }
                            if (weiboStoryVideo.url) {
                                weiboStoryVideo.fileName = weiboStoryVideo.url.match(/\/([^/?]+?(\.mp4)?)\?/)[1] + (RegExp.$2 ? "" : ".mp4");
                                weiboStoryVideo.folder_sort_index = ++video_parse_index;
                                weiboStoryVideo.location = "videos";
                                photo_arr.push(weiboStoryVideo);
                            }
                        }
                        // 照片
                        var $dataNode = $wb_detail.find(".WB_media_wrap .media_box ul");
                        var pic_data_str = ($dataNode.children('li').length == 1 ? $dataNode.children('li') : $dataNode).attr("action-data");
                        var pic_ids_str_m = pic_data_str && pic_data_str.match(/&pic_ids=([^&]+)/);
                        if (pic_ids_str_m) {
                            // livephoto
                            var pic_video_ids = null;
                            var pic_video_ids_str_m = pic_data_str.match(/&pic_video=([^&]+)/);
                            if (pic_video_ids_str_m) {
                                pic_video_ids = pic_video_ids_str_m[1].split(",").map(function (pair) {
                                    return pair.split(":")[1];
                                });
                            }
                            var pic_thumb_str = pic_data_str.match(/&thumb_picSrc=([^&]+)/) && RegExp.$1;
                            var parsePhotosFromIds = function (pic_ids, pic_video_ids) {
                                $.each(pic_ids, function (i, photo_id) {
                                    var photo = {};
                                    photo.photo_id = photo_id;
                                    if (pic_thumb_str && pic_thumb_str.indexOf(photo_id + ".gif") != -1) { // 这里只能判断前九张图是否是gif
                                        photo.url = "https://wx3.sinaimg.cn/large/" + photo_id + ".gif";
                                    } else {
                                        photo.url = "https://wx3.sinaimg.cn/large/" + photo_id + ".jpg";
                                    }
                                    photo.folder_sort_index = ++photo_parse_index;
                                    photo.location = "photos";
                                    photo_arr.push(photo);
                                });
                                pic_video_ids && $.each(pic_video_ids, function (i, photo_video_id) {
                                    var photo = {};
                                    photo.video_id = photo_video_id;
                                    photo.url = "https://video.weibo.com/media/play?livephoto=//us.sinaimg.cn/" + photo_video_id + ".mov&KID=unistore,videomovSrc";
                                    photo.fileName = photo_video_id + ".mov";
                                    photo.folder_sort_index = ++video_parse_index;
                                    photo.location = "videos";
                                    photo_arr.push(photo);
                                });
                            };
                            if (/over9pic=1&/.test(pic_data_str) && !/isloadedover9pids=1/.test(pic_data_str)) {
                                var deferred = $.Deferred();
                                var isForward = $wb_card.attr("isforward") == "1" ? true : false;
                                var mid;
                                if (!isForward) {
                                    mid = $wb_card.attr("mid")
                                } else {
                                    mid = $wb_card.find(".WB_feed_detail .WB_detail .WB_feed_expand .WB_expand .WB_handle").attr("mid");
                                }
                                ($.ajax || GM.xmlHttpRequest ||　GM_xmlHttpRequest)({
                                    method: 'get',
                                    url: 'https://' + document.location.host + '/aj/mblog/getover9pic?' + $.param({
                                        "ajwvr": 6,
                                        "mid": mid,
                                        "__rnd": new Date().getTime(),
                                    }),
                                    responseType: 'json',
                                    //headers: {
                                    //    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
                                    //    'cache-control': 'max-age=0',
                                    //    'referer': document.location.href,
                                    //    'cookie': document.cookie
                                    //},
                                    success/*onload*/: function(responseType) {
                                        let response = responseType/*responseType.response*/,
                                            picIds = pic_ids_str_m[1].split(",");
                                        if (response.data && response.data.pids && Array.isArray(response.data.pids)) {
                                            response.data.pids.forEach(function(overPid) {
                                                if (picIds.indexOf(overPid) == -1) {
                                                    picIds.push(overPid);
                                                }
                                            });
                                        }

                                        parsePhotosFromIds(picIds, pic_video_ids);
                                        deferred.resolve(photo_arr);
                                    },
                                    error: function() {
                                        toastr.error('获取18图失败');
                                        parsePhotosFromIds(pic_ids_str_m[1].split(","), pic_video_ids);
                                        deferred.resolve(photo_arr);
                                    }
                                });
                                // $wb_detail.find(".WB_media_wrap .media_box ul .WB_pic .W_icon_tag_9p").trigger("click");
                                // setTimeout(function () {
                                //     parsePhotosFromIds($wb_detail.find(".WB_media_wrap .media_box ul").attr("action-data").match(/&pic_ids=([^&]+)&/)[1].split(","));
                                //     deferred.resolve(photo_arr);
                                // }, 1500);
                                return deferred; // 需要异步获取直接返回
                            } else {
                                parsePhotosFromIds(pic_ids_str_m[1].split(","), pic_video_ids);
                            }
                        } else {
                            var $wb_pics = $wb_detail.find(".WB_media_wrap .media_box ul .WB_pic img");
                            var regexp_search = /^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i;
                            $.each($wb_pics, function (i, img) {
                                var photo = {};
                                var thumb_url = img.src;
                                photo.url = thumb_url;
                                var m = thumb_url.match(regexp_search);
                                if (m) {
                                    if (m[2] != "large") {
                                        photo.url = m[1] + "large" + m[3];
                                    }
                                }
                                photo.folder_sort_index = ++photo_parse_index;
                                photo.location = "photos";
                                photo_arr.push(photo);
                            });
                        }
                        return photo_arr;
                    },
                    "makeNames_callback": function (photos, location_info, options) {
                        var names = {},
                            isForward = $wb_card.attr("isforward") == "1" ? true : false; // 是否是转发
                        names.infoName = "card_info.txt";
                        names.infoValue = "";
                        var printCardInfoToText = function (card) {
                            let infoValue = '', isForward = card.forward === true;
                            infoValue += "-----------" + (isForward ? "forward card" : "card") + "--------------" + "\r\n";
                            $.each(card, function (key, value) {
                                if (key !== 'user' && key !== 'photos' && key !== 'videos' && key !== 'rootCard') {
                                    infoValue += (isForward ? "forward_" : "") + "card_" + key + "：" + value + "\r\n";
                                }
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            $.each(card.user, function (key, value) {
                                infoValue += (isForward ? "forward_" : "") + "user_" + key + "：" + value + "\r\n";
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            return infoValue;
                        }
                        var findCardInfo = function ($wb_detail, isForward) {
                            if (resolver.isWeiboDelete($wb_card, isForward)) {
                                return {'user': {}};
                            }
                            var $user_home_link = $wb_detail.find(".W_fb").eq(0);
                            var $card_link = $wb_detail.find(".WB_from a").eq(0);
                            var user = {};
                            user.uid = $user_home_link.attr("usercard").match(/id=(\d+)/)[1];
                            user.nickname = $user_home_link.attr("nick-name") || $user_home_link.text();
                            user.home_link = $user_home_link.prop("href").replace(/\?.*/, "");
                            var card = {};
                            card.forward = isForward;
                            card.link = $card_link.prop("href").replace(/\?.*/, "");
                            card.id = card.link.match(/\d+\/([A-Za-z0-9]+)$/)[1];
                            card.mid = isForward ? $wb_detail.find(".WB_handle").attr("mid") : $wb_detail.closest(".WB_cardwrap").attr("mid");
                            card.date = $card_link.attr("title");
                            card.date_timestamp = $card_link.attr("date");
                            card.text = $wb_detail.find(".WB_text").eq(0).prop("innerText").replace(/[\u200b]+$/, "").replace(/^\s*|\s*$/g, "");
                            var textLines = card.text.split(/\s{4,}|\s*\n\s*/);
                            card.name = textLines[0];
                            if (card.name.length <= 5 && textLines.length > 1) {
                                card.name += textLines[1];
                            }
                            if (card.name.length > 30) {
                                card.name = card.name.substring(0, 30);
                            }
                            card.photo_count = photos.length;
                            var tab_type_flag = $(".WB_main_c").find("div:nth-child(1)").attr("id");
                            if (tab_type_flag && /.*(favlistsearch|likelistoutbox)$/.test(tab_type_flag)) {
                                var $page_list = $(".WB_cardwrap .W_pages .layer_menu_list ul");
                                if ($page_list.length != 0) {
                                    var maxPage = parseInt($page_list.find("li:nth-child(1) > a").text().match(/第(\d+)页/)[1]);
                                    var currPage = parseInt($page_list.find(".cur > a").text().match(/第(\d+)页/)[1]);
                                    card.countdown_page = maxPage - currPage + 1;
                                }
                            }
                            card.user = user;
                            card.photos = photos;
                            return card;
                        };
                        names.card = findCardInfo($wb_card.find(".WB_feed_detail .WB_detail"), false); // 主贴的信息
                        names.infoValue += printCardInfoToText(names.card);
                        if (isForward) {
                            // 转发的贴的信息
                            names.forwardCard = findCardInfo($wb_card.find(".WB_feed_detail .WB_detail .WB_feed_expand .WB_expand"), true);
                            names.infoValue += printCardInfoToText(names.forwardCard);
                        }
                        names.zipName = names.card.user.nickname + "_" + names.card.user.uid + "_" + names.card.id + "_" + (names.card.name
                            .replace(/\.\./g, "")
                            .replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "").replace(/[\u200b]+$/, "")
                            .replace(/(^[_-]+)|([_-]+$)/g, "")
                            .replace(/(^\s+)|(\s+$)/g, ""));
                        names.folderName = names.zipName;
                        names.prefix = null;
                        names.suffix = options.suffix;
                        return names;
                    },
                    "beforeFilesDownload_callback": function (photos, names, location_info, options, zip, main_folder) {
                        const paddingZeroLength = String(photos.length).length,
                            card = (names.forwardCard || names.card),
                            sortByOrigin = options.sortByOrigin;
                        $.each(photos, function (i, photo) {
                            if (!photo.fileName) {
                                photo.fileName = photo.url.substring(photo.url.lastIndexOf('/') + 1);
                            }
                            if (sortByOrigin) {
                                photo.originName = photo.fileName;
                                photo.fileName = card.user.uid + '_' + card.id + '_' + common_utils.paddingZero(photo.folder_sort_index, paddingZeroLength) + '_' + photo.originName;
                            }
                        });
                        options.failFiles = undefined;
                    },
                    "beforeFileDownload_callback": function (photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                        if (options.only_download_url || options.only_print_url) {
                            return false;
                        } else {
                            if (photo['download_disable']) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    "eachFileOnload_callback": function (blob, photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                        if (blob == null) {
                            if (!options.failFiles) {
                                options.failFiles = [];
                            }
                            options.failFiles.push(photo);
                        } else if (photo.location == 'photos' && blob.type === 'image/gif' && photo.fileName.indexOf('.gif') === -1) {
                            // 如果在超过9张图（over9pic）中含有gif，那么后缀需要根据content-type来判断
                            let suffixRegex = /\.[^.]+$/, suffix = '.gif';
                            photo.fileName = photo.fileName.replace(suffixRegex, suffix);
                            photo.url = photo.url.replace(suffixRegex, suffix);
                            photo.originName && (photo.originName = photo.originName.replace(suffixRegex, suffix));
                        }
                        return true;
                    },
                    "allFilesOnload_callback": function (photos, names, location_info, options, zip, main_folder) {
                        let photo_urls_str = "", failPhotoListStr = "", photo_url, failFile;
                        // 链接列表文件
                        $.each(photos, function (i, photo) {
                            if (photo.location == 'videos' && photo.url.indexOf('f.video.weibocdn.com') != -1 && photo.url.indexOf('&Expires=') == -1 && !/\.mov$/.test(photo.fileName)) {
                                photo_url = 'http://f.video.weibocdn.com/' + (photo.originName || photo.fileName) + '?KID=unistore,video';
                            } else {
                                photo_url = photo.url;
                            }
                            let line = ((photo.location ? (photo.location + "/") : "" ) + photo.fileName) + "\t" + photo_url + "\r\n";
                            photo_urls_str += line;
                        });
                        main_folder.file("photo_url_list.txt", photo_urls_str);
                        // 失败链接列表文件
                        if (options.failFiles && options.failFiles.length > 0) {
                            toastr.error("共 " + options.failFiles.length + " 张下载失败，已记录在photos_fail_list.txt！", "", {
                                "progressBar": false,
                                timeOut: 0
                            });
                            for (let i in options.failFiles) {
                                failFile = options.failFiles[i];
                                failPhotoListStr += (failFile.location + "/" + failFile.fileName + "\t" + failFile.url + "\r\n");
                            }
                            main_folder.file("photos_fail_list.txt", failPhotoListStr);
                        }
                        // 如果只是打印链接
                        if (options.only_print_url) {
                            resolver.showPhotoLinksPopPanel($wb_card, options);
                            toastr.success("已打印");
                            return false;
                        }
                    }
                }
            };
            if (options) {
                $.extend(true, config, options);
            }
            batchDownload(config);
        },
        "addFavWeiboBackup": function ($wb_card) { // 保存备份
            const resolver = this;
            var options = {
                "only_print_url": true,
                "isNeedConfirmDownload": false,
                "callback": {
                    "allFilesOnload_callback": function (photos, names, location_info, options, zip, main_folder) {
                        let fav_backup_group, beforeSaveCard, saveCard = {}, rootCard = {}, user = {}, picNames = [], livePhotos = [], videos = [], card = names.forwardCard || names.card;
                        if (!card.mid) {
                            toastr.error('未找到mid，代码需要改进');
                            return false;
                        }
                        fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {});
                        saveCard.id = card.id;
                        saveCard.mid = card.mid;
                        saveCard.date = card.date;
                        saveCard.text = card.text;
                        saveCard.forward = card.forward;
                        card.countdown_page !== undefined && (saveCard.countdown_page = card.countdown_page);
                        user.uid = card.user.uid;
                        user.nickname = card.user.nickname;
                        $.each(photos, function (i, photo) {
                            let originName = photo.originName || photo.fileName;
                            if (photo.location == 'photos') {
                                picNames.push(originName);
                            } else if (photo.location == 'videos') {
                                if (/\.mov$/.test(originName)) {
                                    livePhotos.push(originName);
                                } else if (photo.url.indexOf('f.video.weibocdn.com') != -1) { // 先存起来，可能以后有新办法
                                    videos.push(photo.video_id);
                                }
                            }
                        });
                        saveCard.user = user;
                        saveCard.photos = picNames;
                        saveCard.livePhotos = livePhotos;
                        saveCard.videos = videos;
                        if (names.forwardCard) {
                            beforeSaveCard = fav_backup_group[String(saveCard.mid)];
                            // 如果被转发的微博执行了明确收藏操作就不覆盖该forward值
                            if (saveCard.forward === true && beforeSaveCard && beforeSaveCard.forward === false) {
                                saveCard.forward = false;
                            }
                            rootCard.root = true;
                            rootCard.id = names.card.id;
                            rootCard.mid = names.card.mid;
                            rootCard.date = names.card.date;
                            rootCard.text = names.card.text;
                            rootCard.forward = names.forwardCard.mid;
                            rootCard.user = {
                                uid: names.card.user.uid,
                                nickname: names.card.user.nickname,
                            }
                        }
                        fav_backup_group[String(saveCard.mid)] = saveCard;
                        if (names.forwardCard) {
                            fav_backup_group[String(rootCard.mid)] = rootCard;
                        }
                        GM_setValue(Constants.KEY_FAV_BACKUP_GROUP, fav_backup_group);
                        toastr.success("收藏备份到本地成功~");
                        return false;
                    },
                }
            };
            resolver.downloadWeiboCardPhotos($wb_card, options);
        },
        "getFavWeiboBackup": function (mid) { // 获取备份
            const resolver = this;
            if (!mid) {
                toastr.error('未找到mid，代码需要改进');
                return;
            }
            let fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {}), card = fav_backup_group[String(mid)], rootCard, photos = [], photo_parse_index = 0, video_parse_index = 0;
            if (card) {
                if (card.root) { // 如果传入的mid只是一个转发mid
                    rootCard = card;
                    card = fav_backup_group[String(rootCard.forward)]; // 获取实际存储数据的mid
                    if (card) {
                        card.forward = true;
                        card.rootCard = rootCard;
                        if (!rootCard.name) {
                            rootCard.name = (rootCard.text ? rootCard.text.substr(0, 15) : rootCard.mid);
                        }
                    } else {
                        card = rootCard;
                    }
                }
                card.photos && $.each(card.photos, function(i, fileName) {
                    let photo = {url: 'https://wx3.sinaimg.cn/large/' + fileName, fileName: fileName, location: 'photos', folder_sort_index: ++photo_parse_index};
                    photos.push(photo);
                });
                card.livePhotos && $.each(card.livePhotos, function(i, fileName) {
                    let photo = {url: 'https://video.weibo.com/media/play?livephoto=//us.sinaimg.cn/' + fileName + '&KID=unistore,videomovSrc', fileName: fileName, location: 'videos', folder_sort_index: ++video_parse_index};
                    photos.push(photo);
                });
                // card.videos && $.each(card.videos, function(i, fileName) {
                //     let photo = {url: 'http://f.video.weibocdn.com/' + fileName + '?KID=unistore,video', fileName: fileName, location: 'videos', folder_sort_index: ++video_parse_index};
                //     photos.push(photo);
                // });
                card.videos && $.each(card.videos, function(i, fileName) {
                    if (fileName.indexOf(':') !== -1) {
                        let urls = (fileName.indexOf('@') !== -1 ? fileName : (fileName + '@')).split('@');
                        let title = 'https://video.weibo.com/show?fid=' + urls[0] + (urls[1] ? '<br>( ' + urls[1] + ' )' : '');
                        let photo = {url: 'https://video.weibo.com/show?fid=' + urls[0], short_url: urls[1], fileName: title, location: 'videos', folder_sort_index: ++video_parse_index, 'download_disable': true};
                        photos.push(photo);
                    }
                });
                card.photos = photos;
                delete card.livePhotos;
                delete card.videos;
                if (!card.name) {
                    card.name = (card.text ? card.text.substr(0, 15) : card.mid);
                }
            }
            return card;
        },
        "removeFavWeiboBackup": function (mid, cancleIfNotForward) { // 移除备份
            const resolver = this;
            if (!mid) {
                toastr.error('未找到mid，代码需要改进');
                return 400;
            }
            let fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {}), card = fav_backup_group[String(mid)], forwardCard;
            if (card) {
                if (card.root) { // 如果传入的mid只是一个转发mid
                    forwardCard = fav_backup_group[String(card.forward)];
                    if (forwardCard && forwardCard.forward === true) { // 如果实际存储数据的mid没有明确收藏操作，则一起删除
                        delete fav_backup_group[String(forwardCard.mid)];
                    }
                }
                if (card.root || cancleIfNotForward !== true || card.forward === true) {
                    delete fav_backup_group[String(card.mid)];
                    GM_setValue(Constants.KEY_FAV_BACKUP_GROUP, fav_backup_group);
                    toastr.success("删除收藏本地备份成功~");
                }
                return 200;
            } else {
                return 404;
            }
        },
        "generateBatchDownloadOptionsFromBackup": function ($wb_card, card) {
            const resolver = this;
            let options = {
                files: card.photos,
            }
            if (resolver.isWeiboDelete($wb_card, true)) {
                options.callback = {
                    'parseFiles_callback': function () {
                        return card.photos;
                    },
                    'makeNames_callback': function (files, location_info, options) {
                        var names = {};
                        names.infoName = "card_info.txt";
                        names.infoValue = "";
                        var printCardInfoToText = function (card) {
                            let infoValue = '', isForward = card.forward === true;
                            infoValue += "-----------" + (isForward ? "forward card" : "card") + "--------------" + "\r\n";
                            $.each(card, function (key, value) {
                                if (key !== 'user' && key !== 'photos' && key !== 'videos' && key !== 'rootCard') {
                                    infoValue += (isForward ? "forward_" : "") + "card_" + key + "：" + value + "\r\n";
                                }
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            $.each(card.user, function (key, value) {
                                infoValue += (isForward ? "forward_" : "") + "user_" + key + "：" + value + "\r\n";
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            return infoValue;
                        }
                        card.link = 'https://weibo.com/' + card.user.uid + '/' + card.id;
                        card.user.home_link = 'https://weibo.com/u/' + card.user.uid;
                        if (card.rootCard) {
                            card.rootCard.link = 'https://weibo.com/' + card.rootCard.user.uid + '/' + card.rootCard.id;
                            card.rootCard.user.home_link = 'https://weibo.com/u/' + card.rootCard.user.uid;
                            names.card = card.rootCard;
                            names.forwardCard = card;
                        } else {
                            names.card = card;
                        }
                        // 主贴的信息
                        names.infoValue += printCardInfoToText(names.card);
                        if (names.forwardCard) { // 被转发贴的信息
                            names.infoValue += printCardInfoToText(names.forwardCard);
                        }
                        names.zipName = names.card.user.nickname + "_" + names.card.user.uid + "_" + names.card.id + "_" + (names.card.name
                            .replace(/\.\./g, "")
                            .replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "").replace(/[\u200b]+$/, "")
                            .replace(/(^[_-]+)|([_-]+$)/g, "")
                            .replace(/(^\s+)|(\s+$)/g, ""));
                        names.folderName = names.zipName;
                        names.prefix = null;
                        names.suffix = options.suffix;
                        return names;
                    },
                };
            }
            return options;
        },
        "batchDownloadPageWeiboCard": function() {
            const resolver = this;
            if ($('#Pl_Official_Headerv6__1').length == 0 && !/weibo\.com\/(\d+\/profile|\d+(\?|$)|u\/\d+(\?|$)|fav(\?|$)|like\/outbox(\?|$))/.test(document.location.href)) {
                toastr.error('只支持在用户主页下载');
                return;
            }
            if (!confirm('确定要下载本页所有微博吗？')) {
                return;
            }
            let $notify_start = toastr.success("准备批量下载本页~", "", {
                "progressBar": false,
                "hideDuration": 0,
                "showDuration": 0,
                "timeOut": 0,
                "closeButton": false
            }).toggleClass('batch-download-list-tips', true), count = 0, failPhotoCount = 0;
            const downloadQueue = new common_utils.TaskQueue(function($wb_card) {
                return $.Deferred(function(dfd) {
                    if ($wb_card.length > 0 && ($wb_card.attr('action-type') === 'feed_list_item' || $wb_card.children().eq(0).attr('action-type') === 'feed_list_item')) {
                        count++;
                        if ($notify_start.length === 0 || !$notify_start.is(':visible')) {
                            $notify_start = toastr.success("本页批量下载第 1 个~", "", {
                                "progressBar": false,
                                "hideDuration": 0,
                                "showDuration": 0,
                                "timeOut": 0,
                                "closeButton": false
                            }).toggleClass('batch-download-list-tips', true);
                        } else {
                            $notify_start.find(".toast-message").text(`本页批量下载第 ${count} 个~`);
                        }
                        $wb_card[0].scrollIntoView({block: 'center'});
                        let options = {};
                        if (resolver.isWeiboDelete($wb_card, true)) {
                            let mid = resolver.findWeiboCardMid($wb_card, false),
                                omid = resolver.findWeiboCardMid($wb_card, true),
                                card;
                            card = resolver.getFavWeiboBackup(mid) || (mid != omid && resolver.getFavWeiboBackup(omid)) || null;
                            if (card) {
                                options = resolver.generateBatchDownloadOptionsFromBackup($wb_card, card);
                            } else {
                                dfd.resolve();
                                return;
                            }
                        }
                        $.extend(true, options, {
                            isNeedConfirmDownload: false,
                            callback:{
                                beforeZipFileDownload_callback:function (zip_blob, files, names, location_info, options, zip, main_folder) {
                                    common_utils.downloadBlobFile(zip_blob, names.zipName + ".zip");
                                    failPhotoCount += (options.failFiles && options.failFiles.length || 0);
                                    dfd.resolve();
                                }
                            }
                        });
                        resolver.downloadWeiboCardPhotos($wb_card, options);
                    } else {
                        dfd.reject();
                    }
                }).done(function() {
                    $('#toast-container').children('.toast').not('.batch-download-list-tips').hide().remove();
                    $notify_start.find(".toast-message").text(`本页批量下载第 ${count} 个完成~`);
                    if ($wb_card.next().attr('node-type') === 'lazyload') {
                        setTimeout(function(){
                            downloadQueue.append($wb_card.next());
                        }, 1500);
                    } else {
                        downloadQueue.append($wb_card.next());
                    }
                }).fail(function() {
                    $notify_start.hide().remove();
                    if (count > 0) {
                        toastr.success('本页批量下载完成');
                        if (failPhotoCount > 0) {
                            toastr.error(`共 ${failPhotoCount} 张图片或视频下载失败~<br>链接已记录在photos_fail_list.txt`);
                        }
                    } else {
                        toastr.error('本页没有微博');
                    }
                });
            });
            downloadQueue.append($('.WB_feed').children('.WB_cardwrap[action-type="feed_list_item"]').eq(0));
        },
        "showFavWeiboRestoreBtn": function () {
            $('.WB_cardwrap:not(.has-set-restore-btn)').find('> .WB_empty, .WB_expand > .WB_empty').find('.WB_innerwrap p')
                .prepend('<button class="restore-backup-fav-weibo" style="margin-right:15px;cursor:pointer;" title="made by Jeffrey.Deng">查看备份</button>').closest('.WB_cardwrap:not(.has-set-restore-btn)').addClass('has-set-restore-btn');
        },
        "findFeedCardItemList": function () {
            var list = $('.WB_feed').children('.WB_cardwrap[action-type="feed_list_item"]');
            return list.length > 0 ? list : $('.WB_cardwrap');
        },
        "findCardArrowDown": function () {
            return $(".WB_cardwrap .WB_screen .ficon_arrow_down");
        },
        "findElemClosestCard": function (elem) {
            return $(elem).closest(".WB_cardwrap");
        },
        "findCardPhotoDownloadBtn": function() {
            return $('.WB_cardwrap .WB_screen .layer_menu_list .WB_card_photos_download');
        },
        "findDeletedCard": function() {
            return $('.WB_cardwrap:not(.has-set-restore-btn) > .WB_empty, .WB_cardwrap:not(.has-set-restore-btn) .WB_expand > .WB_empty');
        },
        "findCardFavBtn": function() {
            return $('.WB_cardwrap .WB_feed_handle a[action-type="fl_favorite"]');
        },
        "findCardShowBackupBtn": function() {
            return $('.WB_cardwrap .WB_screen .layer_menu_list .WB_card_photos_show_fav_weibo_backup');
        },
        "findCardRebuildBackupBtn": function() {
            return $('.WB_cardwrap .WB_screen .layer_menu_list .WB_card_photos_rebuild_fav_weibo_backup');
        },
        "findCardRestoreBackupBtn": function() {
            return $('.WB_cardwrap .restore-backup-fav-weibo');
        },
    });

    const NewWeiboResolver = {
        'getNameFromText': function(text) {
            var textLines = $('<div/>').html(text).text().split(/\s{4,}|\s*\n\s*/);
            var name = textLines[0];
            if (name.length <= 5 && textLines.length > 1) {
                name += textLines[1];
            }
            if (name.length > 30) {
                name = name.substring(0, 30);
            }
            return name
        },
        'formatWeiboDate': function (dateText) {
            if (!dateText) {
                let date = new Date();
                return common_utils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            } else if (/[a-zA-Z].*\+[\d]{4}/.test(dateText)) {
                let date = new Date(dateText);
                return common_utils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            } else {
                return dateText;
            }
        },
        'findCardScrollerItem': function($wb_card) {
            return $wb_card.parent().hasClass('wbpro-scroller-item') ? $wb_card.parent() : null;
        },
        'findCardDefaultData': function($wb_card) {
            const resolver = this;
            let $cardScrollerItem = resolver.findCardScrollerItem($wb_card), defaultData = null;
            if ($cardScrollerItem) {
                if ($cardScrollerItem[0].hasOwnProperty('__vue__') && $cardScrollerItem[0].__vue__.item) {
                    defaultData = $cardScrollerItem[0].__vue__.item;
                }
            }
            return defaultData;
        },
        'findCardData': function($wb_card) {
            return $wb_card.data('weibo');
        },
        'findCardMblogId': function ($wb_card) {
            const resolver = this;
            let defaultData = resolver.findCardDefaultData($wb_card), mblogid;
            if (defaultData) {
                mblogid = defaultData['mblogid'];
            } else {
                let $author_head = $wb_card.find('> div > header > .woo-box-item-flex > div > div.woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter > a');
                mblogid = $author_head.attr("href").replace(/\?[^?]*$/,'').match(/\/([a-zA-Z0-9]+)$/) && RegExp.$1;
            }
            return mblogid;
        },
        "batchHandleWeiboCard": function(bacthName, bacthSize, callback) {
            const resolver = this;
            if (!/weibo\.com\/(\d+\/profile|\d+(\?|$)|u\/\d+(\?|$)|fav(\?|$)|like\/outbox(\?|$))|(\/u\/page\/fav\/)/.test(document.location.href)) {
                toastr.error('只支持在用户主页下载');
                return;
            }
            if (!confirm(`确定要${bacthName}本页 ${bacthSize} 个微博吗？`)) {
                return;
            }
            var $firstCard = null;
            if (confirm('点击【是】从当前微博开始，点击【否】从第一条微博开始')) {
                $.each(resolver.findFeedCardItemList(), function(i , $card) {
                    if ($card.find('header').length > 0 && common_utils.isOnScreen($card.find('header').eq(0)[0], 30)) {
                        $firstCard = $card;
                        return false;
                    }
                });
            } else {
                document.documentElement.scrollTop = 0;
            }
            let $notify_start = toastr.success(`准备${bacthName}本页~`, "", {
                "progressBar": false,
                "hideDuration": 0,
                "showDuration": 0,
                "timeOut": 0,
                "closeButton": false
            }).toggleClass('batch-download-list-tips', true), count = 0, failPhotoCount = 0;
            const downloadQueue = new common_utils.TaskQueue(function($wb_card) {
                return $.Deferred(function(dfd) {
                    if ($wb_card.length > 0 && count < bacthSize) {
                        count++;
                        if ($notify_start.length === 0 || !$notify_start.is(':visible')) {
                            $notify_start = toastr.success(`本页${bacthName}第 1 个~`, "", {
                                "progressBar": false,
                                "hideDuration": 0,
                                "showDuration": 0,
                                "timeOut": 0,
                                "closeButton": false
                            }).toggleClass('batch-download-list-tips', true);
                        } else {
                            $notify_start.find(".toast-message").text(`本页${bacthName}第 ${count} 个~`);
                        }
                        $wb_card[0].scrollIntoView({block: 'center'});
                        callback && callback.call(this, $wb_card, dfd);
                    } else {
                        dfd.reject();
                    }
                }).done(function() {
                    $('#toast-container').children('.toast').not('.batch-download-list-tips').hide().remove();
                    $notify_start.find(".toast-message").text(`本页${bacthName}第 ${count} 个完成~`);
                    $wb_card[0].scrollIntoView({block: 'start'});
                    setTimeout(function(){
                        var currentCardIndex = parseInt($wb_card.parent().attr('data-index')), isFindCurrentCard = false, $nextCard;
                        var cardList = resolver.findFeedCardItemList()
                        $.each(cardList, function(i , $card) {
                            if (isFindCurrentCard) {
                                $nextCard = $card;
                                return false;
                            }
                            if (parseInt($card.parent().attr('data-index')) == currentCardIndex) {
                                isFindCurrentCard = true;
                            }
                        });
                        downloadQueue.append($nextCard);
                    }, 500);
                }).fail(function() {
                    $notify_start.hide().remove();
                    if (count > 0) {
                        toastr.success(`本页${bacthName}完成`);
                        if (failPhotoCount > 0) {
                            toastr.error(`共 ${failPhotoCount} 张图片或视频${bacthName}失败~<br>链接已记录在photos_fail_list.txt`);
                        }
                    } else {
                        toastr.error('本页没有微博');
                    }
                });
            });
            $firstCard = $firstCard || resolver.findFeedCardItemList()[0];
            downloadQueue.append($firstCard);
        },
        "batchBackFavWeiboCard": function() {
            const resolver = this;
            let fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {});
            resolver.batchHandleWeiboCard("批量收藏", 20, function($wb_card, dfd) {
                if (!resolver.isWeiboDelete($wb_card, true)) {
                    try {
                        let mid = resolver.findWeiboCardMid($wb_card, false), card = fav_backup_group[String(mid)]
                        if (card) {
                            dfd.resolve();
                        } else {
                            resolver.addFavWeiboBackup($wb_card, function () {
                                dfd.resolve();
                            });
                        }
                    } catch (e) {
                        let herf = $wb_card.find('> div > header > .woo-box-item-flex > div > div.woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter > a').attr("href");
                        toastr.error(`此微博备份失败 <a href="${herf}" target="_blank">${herf}</a>`, "", {
                            "progressBar": false,
                            "hideDuration": 0,
                            "showDuration": 0,
                            "timeOut": 0,
                            "closeButton": false
                        });
                        dfd.resolve();
                    }
                } else {
                    dfd.resolve();
                }
            });
        }
    };

    Interface.impl($.extend(NewWeiboResolver,OldWeiboResolver), WeiboResolver, {
        "getResolverName": function() {
            return "NewWeiboResolver"
        },
        "addDownloadBtnToWeiboCard": function ($wb_card) {
            setTimeout(function () {
                var $card_btn_list = $wb_card.find('.woo-pop-wrap .woo-pop-wrap-main');
                if ($card_btn_list.find(".WB_card_photos_download").length == 0) {
                    $card_btn_list.append('<li class="woo-box-flex woo-box-alignCenter woo-pop-item-main WB_card_photos_download" title="下载文件和链接"><a>打包下载</a></li>');
                    $card_btn_list.append('<li class="woo-box-flex woo-box-alignCenter woo-pop-item-main WB_card_photos_download WB_card_photos_download_only_download_url" title="仅下载链接，不下载文件"><a>下载链接</a></li>');
                    $card_btn_list.append('<li class="woo-box-flex woo-box-alignCenter woo-pop-item-main WB_card_photos_download WB_card_photos_download_only_print_url" title="仅打印出链接"><a>打印链接</a></li>');
                    $card_btn_list.append('<li class="woo-box-flex woo-box-alignCenter woo-pop-item-main WB_card_photos_show_fav_weibo_backup" title="查看当前微博是否有备份"><a>显示备份</a></li>');
                    $card_btn_list.append('<li class="woo-box-flex woo-box-alignCenter woo-pop-item-main WB_card_photos_rebuild_fav_weibo_backup" title="重新备份当前微博"><a>重新备份</a></li>');
                }
                $card_btn_list.children().each(function (i, li) {
                    if (li.innerText == '收藏' || li.innerText == '取消收藏') {
                        $(li).addClass('fav_btn');
                    }
                });
            }, 500);
            if (!$wb_card.data('weibo') || ($wb_card.data('weibo').mblogid != this.findCardMblogId($wb_card))) {
                var mblogid = this.findCardMblogId($wb_card);
                $.get('https://' + document.location.host + '/ajax/statuses/show?id=' + mblogid, function (resp) {
                    $wb_card.data('weibo', resp);
                });
            }
        },
        "showPhotoLinksPopPanel": function ($wb_card, options, removeOnClickBody) {
            const resolver = this;
            options.names || (options.names = {});
            options.callback || (options.callback = {});
            const $pop = $('<div class="W_layer W_layer_pop download-link-pop"><div class="content link-list">' +
                '<div class="sidebar"><span class="sidebar-btn download-all-link" title="全部打包下载">打包下载</span><span class="sidebar-btn copy-all-link" title="复制所有链接">全部复制</span></div>' +
                '<ul></ul></div><div class="content preview"><img></div></div>'),
                $link_ul = $pop.find('.link-list ul'),
                $preview_img = $pop.find('.preview img'),
                photos = options.files, card = options.names.card || options.names.forwardCard || {};
            removeOnClickBody = removeOnClickBody !== false;
            $wb_card.append($pop);
            if (resolver.getResolverName() === 'NewWeiboResolver') {
                if (/(?:www\.)?weibo\.com\/(u\/page\/(fav|like)\/)|(u\/\d+)|(\d+\/\w+)/.test(document.location.href)) {
                    $pop.find('.preview').attr('style', 'position: absolute;width: 70%;right: 100%;top: 0%;')
                        .find('img').attr('style', 'border: 3px solid #f1912d3b;border-radius: 3px;');
                } else {
                    $pop.find('.sidebar')[0].style.left= '-67px';
                    $pop.find('.sidebar')[0].style.top= '0px';
                    $pop.find('.sidebar')[0].style.borderLeftWidth= '1px';
                    $pop.find('.sidebar')[0].style.height= 'min-content';
                }
                var $scroller = $pop.closest('.vue-recycle-scroller__item-view');
                if ($scroller.length > 0) {
                    $scroller[0].style.zIndex = "10001";
                    $scroller.siblings().each(function (i, scroller) {
                        if (scroller.style.zIndex == "10001") {
                            scroller.style.zIndex = null;
                        }
                    });
                }
            }
            $.each(photos, function(i, photo) {
                if (photo.location == 'videos' && photo.download_disable) {
                    if (photo.short_url) {
                        $link_ul.append(`<li>
                            <a href="${photo.url}" target="_blank" data-location="${photo.location}" class="clearfix" title="视频文件链接暂时无法备份，请通过视频链接去尝试获取">${photo.url}</a>
                            <br><a href="${photo.short_url}" target="_blank" data-location="${photo.location}" class="clearfix" title="视频文件链接暂时无法备份，请通过视频链接去尝试获取">( ${photo.short_url} )</a>
                        </li>`);
                    } else {
                        $link_ul.append(`<li><a href="${photo.url}" target="_blank" data-location="${photo.location}" class="clearfix" title="视频文件链接暂时无法备份，请通过视频链接去尝试获取">${photo.fileName}</a></li>`);
                    }
                } else {
                    $link_ul.append(`<li><a href="${photo.url}" target="_blank" download="${photo.fileName}" data-location="${photo.location}" class="clearfix" title="${photo.location == 'photos' ? '点击下载，右键链接另存为' : '右键链接另存为'}">${photo.url}</a></li>`);
                }
            });
            $link_ul.on({
                'mouseenter': function() {
                    let $self = $(this);
                    if ($self.attr('data-location') == 'photos') {
                        $preview_img.attr('src', $self.attr('href').replace('/large/', '/mw690/')).parent().show(); //css('visibility', 'visible');
                    }
                },
                'mouseleave': function() {
                    $preview_img.attr('src', '').parent().hide(); //css('visibility', 'hidden');
                },
                'click': function(e) {
                    let $self = $(this), url = $self.attr('href'), fileName = $self.attr('download');
                    if ($self.attr('data-location') == 'photos') {
                        let notify_download_media = toastr.success('正在下载图片～', '', {
                            "progressBar": false,
                            "hideDuration": 0,
                            "showDuration": 0,
                            "timeOut": 0,
                            "closeButton": false,
                        });
                        // GM_download({'url': url, 'name': fileName, 'saveAs': true});
                        common_utils.ajaxDownload(url, function (blob) {
                            if (blob) {
                                if (blob.type === 'image/gif' && fileName.indexOf('.gif') === -1) {
                                    fileName = fileName.replace(/\.[^.]+$/, '.gif');
                                }
                                common_utils.downloadBlobFile(blob, fileName);
                            } else {
                                toastr.error('请手动打开链接下载', '下载失败');
                            }
                            notify_download_media.css("display", "none").remove();
                        });
                        // e.stopImmediatePropagation();
                        return false;
                    }
                }
            }, 'li a');
            $pop.on('click', '.copy-all-link', function() {
                GM_setClipboard($link_ul[0].innerText);
                toastr.success('复制全部链接成功');
            }).on('click', '.download-all-link', function() {
                options.isNeedConfirmDownload = true;
                options.only_download_url = false;
                options.only_print_url = false;
                // if (options.files && !options.callback.parseFiles_callback) {
                //     options.callback.parseFiles_callback = function () {
                //         return options.files;
                //     }
                // }
                resolver.downloadWeiboCardPhotos($wb_card, options);
            });
            if (removeOnClickBody) {
                function remove(ev) {
                    if(!ev.target.classList.contains('woo-font--angleDown') && !ev.target.classList.contains('download-temp-node') && !$pop[0].contains(ev.target)){
                        var $scroller = $pop.closest('.vue-recycle-scroller__item-view');
                        if ($scroller.length > 0) {
                            $scroller[0].style.zIndex = null;
                     }
                        $pop.remove();
                        $('body').off("click", remove);
                    }
                }
                $('body').on("click", remove);
            }
            console.log('\n--★-- print -- ' + (options.names.folderName || card.name || (card.text ? card.text.substr(0, 15) : card.mid) || '照片链接') + ' ----★--');
            console.table(JSON.parse(JSON.stringify(photos)), ['location', 'url']);
            console.log('当url被省略可以复制下面的链接，也可从上面 >Array(' + photos.length + ') 查看');
            $.each(photos, function (i, photo) {
                console.log(photo.url);
            });
            return $pop;
        }, //
        "findWeiboCardMid": function ($wb_card, findForwardIfHas) {
            const resolver = this;
            let defaultData = resolver.findCardDefaultData($wb_card), weiboData;
            if (defaultData) {
                weiboData = defaultData;
            } else {
                weiboData = $wb_card.data('weibo')
            }
            let mid, isForward = weiboData.retweeted_status ? true : false; // 是否是转发
            if (isForward && findForwardIfHas) {
                mid = weiboData.retweeted_status.mid || weiboData.mid;
            } else {
                mid = weiboData.mid
            }
            return mid;
        }, //
        "isWeiboDelete": function ($wb_card, findForwardIfHas) {
            const resolver = this;
            let defaultData = resolver.findCardDefaultData($wb_card), weiboData;
            if (defaultData) {
                weiboData = defaultData;
            } else {
                weiboData = $wb_card.data('weibo');
            }
            if (weiboData) {
                let isForward = weiboData.retweeted_status ? true : false; // 是否是转发
                if (isForward && weiboData.retweeted_status.deleted == '1') {
                    return true;
                } else if (weiboData['deleted'] == '1') {
                    return true;
                }
                return false;
            } else {
                return $wb_card.find('header').length === 0 || $wb_card.hasClass('Fav-Panel-Card');
            }
        }, //
        "downloadWeiboCardPhotos": function (wb_card_node, options) {
            const resolver = this;
            var $wb_card = (wb_card_node instanceof $) ? wb_card_node : $(wb_card_node);
            var config = {
                "$wb_card": $wb_card,
                "type": 2,
                "isNeedConfirmDownload": true, // 下载前是否需要弹出确认框
                "isNeedHasFiles": false,
                "useQueueDownloadThreshold": 0,
                "only_download_url": false, // 是否仅下载链接，true: 只下链接，false：下载文件和链接
                "only_print_url": false, // 是否仅打印出链接
                "sortByOrigin": true, // 照片按原页面显示顺序排序
                "suffix": null,
                "callback": {
                    "parseFiles_callback": function (location_info, options) {
                        // var $author_head = $wb_card.find('> div > header > .woo-box-item-flex > div > div.woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter > a');
                        // var mblogid = $author_head.attr("href").replace(/\?[^?]*$/,'').match(/\/([a-zA-Z0-9]+)$/) && RegExp.$1;
                        var mblogid = resolver.findCardMblogId($wb_card);
                        var photo_parse_index = 0;
                        var video_parse_index = 0;
                        var photo_arr = [];
                        var buildPhoto = function (photo_id, photo_url, photo_video_id) {
                            var photo = {};
                            photo.photo_id = photo_id;
                            photo.url = photo_url;
                            photo.folder_sort_index = ++photo_parse_index;
                            photo.location = "photos";
                            photo_arr.push(photo);
                            if (photo_video_id) {
                                var video = {};
                                video.video_id = photo_video_id;
                                video.url = "https://video.weibo.com/media/play?livephoto=//us.sinaimg.cn/" + photo_video_id + ".mov&KID=unistore,videomovSrc";
                                video.fileName = photo_video_id + ".mov";
                                video.folder_sort_index = ++video_parse_index;
                                video.location = "videos";
                                photo_arr.push(video);
                            }
                        };
                        var buildVideo = function (video_id, video_url, short_url, video_cover_url) {
                            var video = {};
                            video.video_id = video_id;
                            video.url = video_url;
                            video.short_url = short_url;
                            video.fileName = video.url.match(/\/([^/?]+?(\.mp4)?)\?/)[1] + (RegExp.$2 ? "" : ".mp4");
                            video.folder_sort_index = ++video_parse_index;
                            video.location = "videos";
                            photo_arr.push(video);
                            var photo = {};
                            video_cover_url.match(/\/(([^\/]+)\.[a-zA-Z0-9]+)$/);
                            photo.photo_id = RegExp.$2;
                            photo.url = 'https://wx2.sinaimg.cn/large/' + RegExp.$1;
                            photo.folder_sort_index = ++photo_parse_index;
                            photo.location = "photos";
                            photo_arr.push(photo);
                        }
                        var parsePhotosFromIds = function (weibo, dfd) {
                            // 用户发表微博引用了别的用户的视频会有这种情况
                            if (weibo.page_info && weibo.retweeted_status && !weibo.retweeted_status.page_info) {
                                weibo.retweeted_status.page_info = weibo.page_info;
                            }
                            weibo = weibo.retweeted_status || weibo;
                            weibo.pic_infos && $.each(weibo.pic_infos, function(id, p) {
                                buildPhoto(id, p.largest.url, p.type == "livephoto" ? p.fid : null);
                            });
                            if (weibo.page_info && weibo.page_info.object_type=='video') {
                                weibo.page_info.media_info.playback_list.sort(function (a, b) {
                                    return a.meta.quality_index > b.meta.quality_index ? -1 : 1;
                                });
                                buildVideo(
                                    weibo.page_info.object_id,
                                    weibo.page_info.media_info.playback_list[0].play_info.url,
                                    weibo.page_info.short_url,
                                    weibo.page_info.page_pic
                                );
                            }
                            if (weibo.mix_media_info && weibo.mix_media_info.items) {
                                const videoIds = [], videoDfds = [];
                                function loadVideoDetail (item) {
                                    return $.Deferred(function (dfd) {
                                        if (item.type === 'video') {
                                            videoIds.push(item.id);
                                            $.ajax({
                                                type: 'POST',
                                                url: 'https://' + document.location.host + '/tv/api/component?page=' + encodeURIComponent('/tv/show/' + item.id),
                                                beforeSend: function (XMLHttpRequest) {
                                                    XMLHttpRequest.setRequestHeader("content-type", 'application/x-www-form-urlencoded');
                                                    XMLHttpRequest.setRequestHeader("page-referer", "/tv/show/" + item.id);
                                                },
                                                // headers: {
                                                //     'content-type': 'application/x-www-form-urlencoded',
                                                //     'page-referer': "/tv/show/" + item.id,
                                                // },
                                                // dataType: 'json',
                                                contentType: 'application/json',
                                                data: 'data=' + JSON.stringify({ "Component_Play_Playinfo": { "oid": item.id } }),
                                                success: function (resp) {
                                                    var video = {}, photo = {};
                                                    if (resp.code = "100000") {
                                                        const data = resp.data.Component_Play_Playinfo, videoUrls = [];
                                                        $.each(data.urls, function (k, v) {
                                                            videoUrls.push({
                                                                "k": k,
                                                                "v": v
                                                            });
                                                        });
                                                        videoUrls.sort(function (l, r) {
                                                            let l_level = parseInt(l.k.match(/\s(\d+)([PK])/)[1]);
                                                            let r_level = parseInt(r.k.match(/\s(\d+)([PK])/)[1]);
                                                            l_level == 2 && (l_level = 1440);
                                                            r_level == 2 && (r_level = 1440);
                                                            l_level == 4 && (l_level = 2560);
                                                            r_level == 4 && (r_level = 2560);
                                                            return l_level > r_level ? -1 : 1;
                                                        });
                                                        let videoUrl = videoUrls[0].v;
                                                        /^https?:/.test(videoUrl) || (videoUrl = 'https:' + videoUrl);
                                                        buildVideo(
                                                            item.id,
                                                            videoUrl,
                                                            data.url_short,
                                                            data.cover_image
                                                        );
                                                    } else {
                                                        buildVideo(
                                                            item.id,
                                                            item.media_info.mp4_720p_mp4 || item.media_info.mp4_hd_url || item.media_info.mp4_sd_url,
                                                            item.data.short_url,
                                                            item.data.page_pic
                                                        );
                                                    }
                                                    dfd.resolve();
                                                }
                                            });
                                        }
                                    });
                                }
                                for (let item of weibo.mix_media_info.items) {
                                    if (item.type === 'video') {
                                        videoDfds.push(loadVideoDetail(item));
                                    }
                                }
                                for (let item of weibo.mix_media_info.items) {
                                    if (item.type === 'pic') {
                                        buildPhoto(
                                            item.id,
                                            item.data.largest.url,
                                            item.data.type == 'livephoto' ? item.data.fid : null
                                        );
                                    }
                                }
                                $.when.apply(this, videoDfds).done(function () {
                                    dfd.resolve(photo_arr);
                                });
                            } else {
                                dfd.resolve(photo_arr);
                            }
                        };
                        return $.Deferred(function (dfd) {
                            let weibo = $wb_card.data('weibo');
                            if (weibo && ($wb_card.data('weibo').mblogid == resolver.findCardMblogId($wb_card))) {
                                parsePhotosFromIds(weibo, dfd);
                            } else {
                                $.get('https://' + document.location.host + '/ajax/statuses/show?id=' + mblogid, function (resp) {
                                    $wb_card.data('weibo', resp);
                                    parsePhotosFromIds(resp, dfd);
                                });
                            }
                        });
                    },
                    "makeNames_callback": function (photos, location_info, options) {
                        var names = {},
                            weibo = $wb_card.data('weibo'),
                            isForward = weibo.retweeted_status ? true : false; // 是否是转发
                        names.infoName = "card_info.txt";
                        names.infoValue = "";
                        var printCardInfoToText = function (card) {
                            let infoValue = '', isForward = card.forward === true;
                            infoValue += "-----------" + (isForward ? "forward card" : "card") + "--------------" + "\r\n";
                            $.each(card, function (key, value) {
                                if (key !== 'user' && key !== 'photos' && key !== 'videos' && key !== 'rootCard') {
                                    infoValue += (isForward ? "forward_" : "") + "card_" + key + "：" + value + "\r\n";
                                }
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            $.each(card.user, function (key, value) {
                                infoValue += (isForward ? "forward_" : "") + "user_" + key + "：" + value + "\r\n";
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            return infoValue;
                        }
                        var findCardInfo = function (weibo, isForward) {
                            var user = {};
                            user.uid = weibo.user.id;
                            user.nickname = weibo.user.screen_name;
                            user.home_link = 'https://www.weibo.com' + weibo.user.profile_url;
                            var card = {};
                            card.forward = isForward;
                            card.link = `https://weibo.com/${weibo.user.id}/${weibo.mblogid}`;
                            card.id = weibo.mblogid;
                            card.mid = weibo.mid;
                            card.date = resolver.formatWeiboDate(weibo.created_at);
                            card.date_timestamp = weibo.created_at;
                            card.fav_date = resolver.formatWeiboDate();
                            card.text = weibo.text;
                            card.name = resolver.getNameFromText(card.text) || card.mid;
                            card.photo_count = photos.length;
                            card.user = user;
                            card.photos = photos;
                            return card;
                        };
                        names.card = findCardInfo(weibo, false); // 主贴的信息
                        names.infoValue += printCardInfoToText(names.card);
                        if (isForward) {
                            // 转发的贴的信息
                            names.forwardCard = findCardInfo(weibo.retweeted_status, true);
                            names.infoValue += printCardInfoToText(names.forwardCard);
                        }
                        names.zipName = names.card.user.nickname + "_" + names.card.user.uid + "_" + names.card.id + "_" + (names.card.name
                            .replace(/\.\./g, "")
                            .replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "").replace(/[\u200b]+$/, "")
                            .replace(/(^[_-]+)|([_-]+$)/g, "")
                            .replace(/(^\s+)|(\s+$)/g, ""));
                        names.folderName = names.zipName;
                        names.prefix = null;
                        names.suffix = options.suffix;
                        return names;
                    },
                    "beforeFilesDownload_callback": function (photos, names, location_info, options, zip, main_folder) {
                        const paddingZeroLength = String(photos.length).length,
                            card = (names.forwardCard || names.card),
                            sortByOrigin = options.sortByOrigin;
                        $.each(photos, function (i, photo) {
                            if (!photo.fileName) {
                                photo.fileName = photo.url.substring(photo.url.lastIndexOf('/') + 1);
                            }
                            if (sortByOrigin) {
                                photo.originName = photo.fileName;
                                photo.fileName = card.user.uid + '_' + card.id + '_' + common_utils.paddingZero(photo.folder_sort_index, paddingZeroLength) + '_' + photo.originName;
                            }
                        });
                        options.failFiles = undefined;
                    },
                    "beforeFileDownload_callback": function (photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                        if (options.only_download_url || options.only_print_url) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    "eachFileOnload_callback": function (blob, photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                        if (blob == null) {
                            if (!options.failFiles) {
                                options.failFiles = [];
                            }
                            options.failFiles.push(photo);
                        } else if (photo.location == 'photos' && blob.type === 'image/gif' && photo.fileName.indexOf('.gif') === -1) {
                            // 如果在超过9张图（over9pic）中含有gif，那么后缀需要根据content-type来判断
                            let suffixRegex = /\.[^.]+$/, suffix = '.gif';
                            photo.fileName = photo.fileName.replace(suffixRegex, suffix);
                            photo.url = photo.url.replace(suffixRegex, suffix);
                            photo.originName && (photo.originName = photo.originName.replace(suffixRegex, suffix));
                        }
                        return true;
                    },
                    "allFilesOnload_callback": function (photos, names, location_info, options, zip, main_folder) {
                        let photo_urls_str = "", failPhotoListStr = "", photo_url, failFile;
                        // 链接列表文件
                        $.each(photos, function (i, photo) {
                            if (photo.location == 'videos' && photo.url.indexOf('f.video.weibocdn.com') != -1 && !options.only_download_url && !/\.mov$/.test(photo.fileName)) {
                                // photo_url = 'http://f.video.weibocdn.com/' + (photo.originName || photo.fileName) + '?KID=unistore,video';
                                photo_url = 'https://video.weibo.com/show?fid=' + photo.video_id + (photo.short_url ? '（' + photo.short_url + '）' : '');
                            } else {
                                photo_url = photo.url;
                            }
                            let line = ((photo.location ? (photo.location + "/") : "" ) + photo.fileName) + "\t" + photo_url + "\r\n";
                            photo_urls_str += line;
                        });
                        main_folder.file("photo_url_list.txt", photo_urls_str);
                        // 失败链接列表文件
                        if (options.failFiles && options.failFiles.length > 0) {
                            toastr.error("共 " + options.failFiles.length + " 张下载失败，已记录在photos_fail_list.txt！", "", {
                                "progressBar": false,
                                timeOut: 0
                            });
                            for (let i in options.failFiles) {
                                failFile = options.failFiles[i];
                                failPhotoListStr += (failFile.location + "/" + failFile.fileName + "\t" + failFile.url + "\r\n");
                            }
                            main_folder.file("photos_fail_list.txt", failPhotoListStr);
                        }
                        // 如果只是打印链接
                        if (options.only_print_url) {
                            resolver.showPhotoLinksPopPanel($wb_card, options);
                            toastr.success("已打印");
                            return false;
                        }
                    }
                }
            };
            if (options) {
                $.extend(true, config, options);
            }
            batchDownload(config);
        },
        "addFavWeiboBackup": function ($wb_card, callback) { // 保存备份
            const resolver = this;
            var options = {
                "only_print_url": true,
                "isNeedConfirmDownload": false,
                "callback": {
                    "allFilesOnload_callback": function (photos, names, location_info, options, zip, main_folder) {
                        let fav_backup_group, beforeSaveCard, saveCard = {}, rootCard = {}, user = {}, picNames = [], livePhotos = [], videos = [], card = names.forwardCard || names.card;
                        if (!card.mid) {
                            toastr.error('未找到mid，代码需要改进');
                            return false;
                        }
                        fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {});
                        saveCard.id = card.id;
                        saveCard.mid = card.mid;
                        saveCard.date = resolver.formatWeiboDate(card.date);
                        saveCard.fav_date = card.fav_date || saveCard.date;
                        saveCard.text = card.text;
                        saveCard.forward = card.forward;
                        card.countdown_page !== undefined && (saveCard.countdown_page = card.countdown_page);
                        user.uid = card.user.uid;
                        user.nickname = card.user.nickname;
                        $.each(photos, function (i, photo) {
                            let originName = photo.originName || photo.fileName;
                            if (photo.location == 'photos') {
                                picNames.push(originName);
                            } else if (photo.location == 'videos') {
                                if (/\.mov$/.test(originName)) {
                                    livePhotos.push(originName);
                                } else if (photo.url.indexOf('f.video.weibocdn.com') != -1) { // 先存起来，可能以后有新办法
                                    videos.push(photo.video_id + '@' + photo.short_url);
                                }
                            }
                        });
                        saveCard.user = user;
                        saveCard.photos = picNames;
                        saveCard.livePhotos = livePhotos;
                        saveCard.videos = videos;
                        if (names.forwardCard) {
                            beforeSaveCard = fav_backup_group[String(saveCard.mid)];
                            // 如果被转发的微博执行了明确收藏操作就不覆盖该forward值
                            if (saveCard.forward === true && beforeSaveCard && beforeSaveCard.forward === false) {
                                saveCard.forward = false;
                            }
                            rootCard.root = true;
                            rootCard.id = names.card.id;
                            rootCard.mid = names.card.mid;
                            rootCard.date = resolver.formatWeiboDate(names.card.date);
                            rootCard.fav_date = names.card.fav_date || rootCard.date;
                            rootCard.text = names.card.text;
                            rootCard.forward = names.forwardCard.mid;
                            rootCard.user = {
                                uid: names.card.user.uid,
                                nickname: names.card.user.nickname,
                            }
                        }
                        fav_backup_group[String(saveCard.mid)] = saveCard;
                        if (names.forwardCard) {
                            fav_backup_group[String(rootCard.mid)] = rootCard;
                        }
                        GM_setValue(Constants.KEY_FAV_BACKUP_GROUP, fav_backup_group);
                        callback || toastr.success("收藏备份到本地成功~");
                        callback && callback.call(this, saveCard);
                        return false;
                    },
                }
            };
            resolver.downloadWeiboCardPhotos($wb_card, options);
        },
        "getFavWeiboBackup": function (mid) { // 获取备份
            const resolver = this;
            if (!mid) {
                toastr.error('未找到mid，代码需要改进');
                return;
            }
            let fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {}), card = fav_backup_group[String(mid)], rootCard, photos = [], photo_parse_index = 0, video_parse_index = 0;
            if (card) {
                if (card.root) { // 如果传入的mid只是一个转发mid
                    rootCard = card;
                    card = fav_backup_group[String(rootCard.forward)]; // 获取实际存储数据的mid
                    if (card) {
                        card.forward = true;
                        card.rootCard = rootCard;
                        if (!rootCard.name) {
                            rootCard.name = resolver.getNameFromText(rootCard.text) || rootCard.mid;
                        }
                    } else {
                        card = rootCard;
                    }
                }
                card.photos && $.each(card.photos, function(i, fileName) {
                    let photo = {url: 'https://wx3.sinaimg.cn/large/' + fileName, fileName: fileName, location: 'photos', folder_sort_index: ++photo_parse_index};
                    photos.push(photo);
                });
                card.livePhotos && $.each(card.livePhotos, function(i, fileName) {
                    let photo = {url: 'https://video.weibo.com/media/play?livephoto=//us.sinaimg.cn/' + fileName + '&KID=unistore,videomovSrc', fileName: fileName, location: 'videos', folder_sort_index: ++video_parse_index};
                    photos.push(photo);
                });
                // card.videos && $.each(card.videos, function(i, fileName) {
                //     let photo = {url: 'http://f.video.weibocdn.com/' + fileName + '?KID=unistore,video', fileName: fileName, location: 'videos', folder_sort_index: ++video_parse_index};
                //     photos.push(photo);
                // });
                card.videos && $.each(card.videos, function(i, fileName) {
                    if (fileName.indexOf(':') !== -1) {
                        let urls = (fileName.indexOf('@') !== -1 ? fileName : (fileName + '@')).split('@');
                        let title = 'https://video.weibo.com/show?fid=' + urls[0] + (urls[1] ? '<br>( ' + urls[1] + ' )' : '');
                        let photo = {url: 'https://video.weibo.com/show?fid=' + urls[0], short_url: urls[1], fileName: title, location: 'videos', folder_sort_index: ++video_parse_index, 'download_disable': true};
                        photos.push(photo);
                    }
                });
                card.photos = photos;
                delete card.livePhotos;
                delete card.videos;
                if (!card.name) {
                    card.name = resolver.getNameFromText(card.text) || card.mid;
                }
                card.date = resolver.formatWeiboDate(card.date);
                card.fav_date = card.fav_date || card.date;
            }
            return card;
        },
        "removeFavWeiboBackup": function (mid, cancleIfNotForward) { // 移除备份
            const resolver = this;
            if (!mid) {
                toastr.error('未找到mid，代码需要改进');
                return 400;
            }
            let fav_backup_group = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {}), card = fav_backup_group[String(mid)], forwardCard;
            if (card) {
                if (card.root) { // 如果传入的mid只是一个转发mid
                    forwardCard = fav_backup_group[String(card.forward)];
                    if (forwardCard && forwardCard.forward === true) { // 如果实际存储数据的mid没有明确收藏操作，则一起删除
                        delete fav_backup_group[String(forwardCard.mid)];
                    }
                }
                if (card.root || cancleIfNotForward !== true || card.forward === true) {
                    delete fav_backup_group[String(card.mid)];
                    GM_setValue(Constants.KEY_FAV_BACKUP_GROUP, fav_backup_group);
                    toastr.success("删除收藏本地备份成功~");
                }
                return 200;
            } else {
                return 404;
            }
        },
        "generateBatchDownloadOptionsFromBackup": function ($wb_card, card) {
            const resolver = this;
            let options = {
                files: card.photos,
            }
            if (resolver.isWeiboDelete($wb_card, true)) {
                options.callback = {
                    'parseFiles_callback': function () {
                        return card.photos;
                    },
                    'makeNames_callback': function (files, location_info, options) {
                        var names = {};
                        names.infoName = "card_info.txt";
                        names.infoValue = "";
                        var printCardInfoToText = function (card) {
                            let infoValue = '', isForward = card.forward === true;
                            infoValue += "-----------" + (isForward ? "forward card" : "card") + "--------------" + "\r\n";
                            $.each(card, function (key, value) {
                                if (key !== 'user' && key !== 'photos' && key !== 'videos' && key !== 'rootCard') {
                                    infoValue += (isForward ? "forward_" : "") + "card_" + key + "：" + value + "\r\n";
                                }
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            $.each(card.user, function (key, value) {
                                infoValue += (isForward ? "forward_" : "") + "user_" + key + "：" + value + "\r\n";
                            });
                            infoValue += "-----------------------------------" + "\r\n";
                            return infoValue;
                        }
                        card.link = 'https://weibo.com/' + card.user.uid + '/' + card.id;
                        card.user.home_link = 'https://weibo.com/u/' + card.user.uid;
                        if (card.rootCard) {
                            card.rootCard.link = 'https://weibo.com/' + card.rootCard.user.uid + '/' + card.rootCard.id;
                            card.rootCard.user.home_link = 'https://weibo.com/u/' + card.rootCard.user.uid;
                            names.card = card.rootCard;
                            names.forwardCard = card;
                        } else {
                            names.card = card;
                        }
                        // 主贴的信息
                        names.infoValue += printCardInfoToText(names.card);
                        if (names.forwardCard) { // 被转发贴的信息
                            names.infoValue += printCardInfoToText(names.forwardCard);
                        }
                        names.zipName = names.card.user.nickname + "_" + names.card.user.uid + "_" + names.card.id + "_" + (names.card.name
                            .replace(/\.\./g, "")  .replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "").replace(/[\u200b]+$/, "")
                            .replace(/(^[_-]+)|([_-]+$)/g, "")
                            .replace(/(^\s+)|(\s+$)/g, ""));
                        names.folderName = names.zipName;
                        names.prefix = null;
                        names.suffix = options.suffix;
                        return names;
                    },
                };
            }
            return options;
        },
        "batchDownloadPageWeiboCard": function() {
            const resolver = this;
            let failPhotoCount = 0;
            resolver.batchHandleWeiboCard("批量下载", 50, function($wb_card, dfd) {
                let options = {};
                if (resolver.isWeiboDelete($wb_card, true)) {
                    let mid = resolver.findWeiboCardMid($wb_card, false),
                        omid = resolver.findWeiboCardMid($wb_card, true),
                        card;
                    card = resolver.getFavWeiboBackup(mid) || (mid != omid && resolver.getFavWeiboBackup(omid)) || null;
                    if (card) {
                        options = resolver.generateBatchDownloadOptionsFromBackup($wb_card, card);
                    } else {
                        dfd.resolve();
                        return;
                    }
                }
                $.extend(true, options, {
                    isNeedConfirmDownload: false,
                    callback:{
                        beforeZipFileDownload_callback:function (zip_blob, files, names, location_info, options, zip, main_folder) {
                            common_utils.downloadBlobFile(zip_blob, names.zipName + ".zip");
                            failPhotoCount += (options.failFiles && options.failFiles.length || 0);
                            dfd.resolve();
                        }
                    }
                });
                resolver.downloadWeiboCardPhotos($wb_card, options);
            });
        },
        "showFavWeiboRestoreBtn": function () {
            // $('.WB_cardwrap:not(.has-set-restore-btn)').find('> .WB_empty, .WB_expand > .WB_empty').find('.WB_innerwrap p')
            //     .prepend('<button class="restore-backup-fav-weibo" style="margin-right:15px;cursor:pointer;" title="made by Jeffrey.Deng">查看备份</button>').closest('.WB_cardwrap:not(.has-set-restore-btn)').addClass('has-set-restore-btn');
            const resolver = this;
            resolver.findFeedCardItemList().filter(function(i, $wb_card) {
                // !$wb_card.hasClass('has-set-restore-btn')
                let isDeleted = resolver.isWeiboDelete($wb_card);
                if (!isDeleted) {
                    $wb_card.find('> .Fav-Panel-Card, >.restore-fav-pop').remove();
                }
                return isDeleted && $wb_card.find('.restore-backup-fav-weibo').length === 0
            }).each(function(i, $wb_card) {
                $wb_card.find('.wbpro-feed-content .wbpro-feed-ogText > div')
                    .prepend('<button class="restore-backup-fav-weibo" style="margin-right: 12px;cursor:pointer;background-color: #3a90c6;border-width: 0.1px;border-radius: 2px;color: #FFF;padding: 2px 3px 2px 3px;" title="made by Jeffrey.Deng">查看备份</button>')
                    // .closest('article.woo-panel-main').addClass('has-set-restore-btn');
                $wb_card.find('.restore-backup-fav-weibo').click(resolver.RestoreBackupBtnEventFunc);
            });
        },
        "findFeedCardItemList": function () {
            var cardList = $('#scroller').find('.vue-recycle-scroller__item-wrapper').children().filter(function (i, c) {
                // c.getAttribute('style').indexOf('z-index: -1;') === -1
                return c.children[0].getAttribute('data-active') === "true"
            }).sort(function(l, r) {
                let $l = $(l).children(0);
                let $r = $(r).children(0);
                return $l.attr('data-index') - $r.attr('data-index') > 0 ? 1 : -1
            }).map(function(i, card) {
                return $(card).find("article.woo-panel-main");
            });
            return cardList;
        },
        "findCardArrowDown": function () {
            return $('article.woo-panel-main .woo-box-flex .woo-font.woo-font--angleDown');
        },
        "findElemClosestCard": function (elem) {
            return $(elem).closest("article.woo-panel-main");
        },
        "findCardPhotoDownloadBtn": function() {
            return $('article.woo-panel-main .woo-pop-wrap .woo-pop-wrap-main .WB_card_photos_download');
        },
        "findDeletedCard": function() {
            return $('.WB_cardwrap:not(.has-set-restore-btn) > .WB_empty, .WB_cardwrap:not(.has-set-restore-btn) .WB_expand > .WB_empty');
        },
        "findCardFavBtn": function() {
            return $('article.woo-panel-main .woo-pop-wrap .woo-pop-wrap-main > .woo-pop-item-main.fav_btn');
        },
        "findCardShowBackupBtn": function() {
            return $('article.woo-panel-main .woo-pop-wrap .woo-pop-wrap-main .WB_card_photos_show_fav_weibo_backup');
        },
        "findCardRebuildBackupBtn": function() {
            return $('article.woo-panel-main .woo-pop-wrap .woo-pop-wrap-main .WB_card_photos_rebuild_fav_weibo_backup');
        },
        "findCardRestoreBackupBtn": function() {
            return $('#scroller .vue-recycle-scroller__item-wrapper article.woo-panel-main .wbpro-feed-ogText .restore-backup-fav-weibo');
        },
    });

    var resolver;

    const core = {

        getWeiBoResolver: function () {
            if ($('body > #app').length > 0) {
                return NewWeiboResolver;
            } else {
                return OldWeiboResolver;
            }
        },
        init: function () {

            unsafeWindow.$ = $;

            resolver = this.getWeiBoResolver();

            unsafeWindow.showFavWeiboRestoreBtn = function() {
                resolver.showFavWeiboRestoreBtn.call(resolver)
            };

            // hack: 仪表盘控制栏添加按钮，暂时不启用
            if (false && document.location.href.match(/^https:\/\/(www\.)?weibo\.com\/(?!u\/)\d{8,}\/(?!profile\/)\w{8,}\?.*$/)) {
                GM_registerMenuCommand('下载', function() {
                    resolver.downloadWeiboCardPhotos(resolver.findFeedCardItemList().eq(0));
                }, 'd');
                GM_registerMenuCommand('备份', function() {
                    let $wb_card = resolver.findFeedCardItemList().eq(0), mid = resolver.findWeiboCardMid($wb_card, true);
                    if (!mid) {
                        toastr.error('未找到mid，代码需要改进');
                        return;
                    };
                    if (resolver.isWeiboDelete($wb_card, true) && resolver.getFavWeiboBackup(mid)) {
                        if (!unsafeWindow.confirm('原博已被删除，这会删除之前的备份，是否继续？')) {
                            return;
                        }
                    }
                    resolver.addFavWeiboBackup($wb_card);
                }, 'b');
            }

            $("body").on("mousedown", resolver.findCardArrowDown().selector, function (e) {
                if (e.data == 'mu') {
                    return;
                }
                resolver.addDownloadBtnToWeiboCard(resolver.findElemClosestCard(this));
            });
            $("body").on("click", resolver.findCardPhotoDownloadBtn().selector, function () {
                var $self = $(this);
                var options = {"only_download_url": $self.hasClass('WB_card_photos_download_only_download_url'), "only_print_url": $self.hasClass('WB_card_photos_download_only_print_url')};
                if (options.only_print_url) {
                    options.isNeedConfirmDownload = false;
                }
                resolver.downloadWeiboCardPhotos(resolver.findElemClosestCard($self), options);
                if (core.getWeiBoResolver() === NewWeiboResolver) {
                    resolver.findElemClosestCard(this).find('.woo-box-flex .woo-font.woo-font--angleDown').trigger('click', 'mu');
                }
            });

            GM_registerMenuCommand('一键下载(用户|收藏)一页的微博', function() {
                resolver.batchDownloadPageWeiboCard();
            });

            // 收藏备份
            let switch_auto_backup_fav_id;
            var getAutoBackUpSetting = function () { // 获取是否开启收藏时自动备份的设置值
                if (GM_getValue(Constants.KEY_SETTING_AUTO_BACKUP_FAV) == undefined) {
                    return true;
                }
                return !!GM_getValue(Constants.KEY_SETTING_AUTO_BACKUP_FAV);
            };
            var switchAutoBackUpSetting = function(on) { // 切换收藏时自动备份的设置值
                let saveValue = !!on;
                if (switch_auto_backup_fav_id) {
                    GM_unregisterMenuCommand(switch_auto_backup_fav_id);
                }
                if (saveValue) {
                    switch_auto_backup_fav_id = GM_registerMenuCommand('开启收藏时确认备份弹窗', function() {
                        switchAutoBackUpSetting(false);
                        toastr.success("已关闭自动备份~");
                    });
                } else {
                    switch_auto_backup_fav_id = GM_registerMenuCommand('关闭收藏时确认备份弹窗', function() {
                        switchAutoBackUpSetting(true);
                        toastr.success("已开启自动备份~");
                    });
                }
                if (getAutoBackUpSetting() !== saveValue) {
                    GM_setValue(Constants.KEY_SETTING_AUTO_BACKUP_FAV, saveValue);
                }
            };
            if (resolver.getResolverName() === "OldWeiboResolver") {
                $('body').on('click', '.WB_cardwrap .W_pages', function() {
                    setTimeout(function() {
                        resolver.showFavWeiboRestoreBtn();
                    }, 3000);
                    setTimeout(function() {
                        resolver.showFavWeiboRestoreBtn();
                    }, 4500);
                    setTimeout(function() {
                        resolver.showFavWeiboRestoreBtn();
                    }, 6000);
                });
                $('body').on('mouseenter', resolver.findDeletedCard().selector, function() {
                    resolver.showFavWeiboRestoreBtn();
                });
            } else {
                $(document).on('scroll', function () {
                    if (!/(?:www\.)?weibo\.com\/(u\/page\/(fav|like)\/)/.test(document.location.href)) {
                        return;
                    }
                    resolver.showFavWeiboRestoreBtn();
                });
            }
            $('body').on('mousedown', resolver.findCardFavBtn().selector, function () {
                var $self = $(this), $wb_card = resolver.findElemClosestCard($self),
                    isHasFavorite = $self.attr('favorite') == '1' || $self.text() === '取消收藏',
                    mid = resolver.findWeiboCardMid($wb_card, false),
                    omid = resolver.findWeiboCardMid($wb_card, true);
                if (!mid || !omid) {
                    toastr.error('未找到mid，代码需要改进');
                    return;
                }
                if (!isHasFavorite) {
                    if (!getAutoBackUpSetting() && !unsafeWindow.confirm('是否将收藏中的链接备份到缓存，以防止博主删除？')) {
                        return;
                    }
                    if (resolver.isWeiboDelete($wb_card, true) && resolver.getFavWeiboBackup(omid)) {
                        if (!unsafeWindow.confirm('原博已被删除，这会删除之前的备份，是否继续？')) {
                            return;
                        }
                    }
                    resolver.addFavWeiboBackup($wb_card);
                } else {
                    // 兼容旧版本
                    resolver.removeFavWeiboBackup(mid) === 404 && mid != omid && resolver.removeFavWeiboBackup(omid, true);
                }
            });
            $('body').on('click', resolver.findCardShowBackupBtn().selector, function () {
                let $wb_card = resolver.findElemClosestCard(this),
                    mid = resolver.findWeiboCardMid($wb_card, false),
                    omid = resolver.findWeiboCardMid($wb_card, true);
                if (!mid || !omid) {
                    toastr.error('未找到mid，代码需要改进');
                    return;
                }
                // 兼容旧版本
                let card = resolver.getFavWeiboBackup(mid) || (mid != omid && resolver.getFavWeiboBackup(omid)) || null;
                if (card) {
                    resolver.showPhotoLinksPopPanel($wb_card, resolver.generateBatchDownloadOptionsFromBackup($wb_card, card));
                } else {
                    toastr.info('本地备份没有备份该微博~');
                }
            });
            $('body').on('click', resolver.findCardRebuildBackupBtn().selector, function () {
                let $wb_card = resolver.findElemClosestCard(this),
                    mid = resolver.findWeiboCardMid($wb_card, true);
                if (!mid) {
                    toastr.error('未找到mid，代码需要改进');
                    return;
                };
                if (resolver.isWeiboDelete($wb_card, true) && resolver.getFavWeiboBackup(mid)) {
                    if (!unsafeWindow.confirm('原博已被删除，这会删除之前的备份，是否继续？')) {
                        return;
                    }
                }
                resolver.addFavWeiboBackup($wb_card);
            });

            resolver.RestoreBackupBtnEventFunc = function () {
                var $self = $(this), $wb_card = resolver.findElemClosestCard(this), mid, omid;
                mid = resolver.findWeiboCardMid($wb_card, false);
                omid = resolver.findWeiboCardMid($wb_card, true);
                if (!mid || !omid) {
                    toastr.error('未找到mid，代码需要改进');
                    return;
                }
                if (!$self.hasClass('has-restore')) {
                    let card = resolver.getFavWeiboBackup(mid) || (mid != omid && resolver.getFavWeiboBackup(omid)) || null;
                    if (card) {
                        let $pop;
                        if (resolver.getResolverName() === 'OldWeiboResolver') {
                            $wb_card.append('<div class="WB_feed_detail clearfix" style="padding-top:0px;"><div class="WB_detail"><div class="WB_info" style="display:inline-block;"><a target="_blank"></a></div>' +
                            '<div class="WB_from" style="display:inline-block;margin-left:10px"><a target="_blank"></a></div><div class="WB_text"><div><div></div>');
                            $wb_card.find('.WB_detail .WB_info a').text(card.user.nickname).attr('href', '//weibo.com/u/' + card.user.uid);
                            $wb_card.find('.WB_detail .WB_from a').text(card.date).attr('href', '//weibo.com/' + card.user.uid + '/' + card.id);
                            $wb_card.find('.WB_detail .WB_text').html(card.text);
                            $pop = resolver.showPhotoLinksPopPanel($wb_card, resolver.generateBatchDownloadOptionsFromBackup($wb_card, card), false);
                            $pop.attr('style', 'position:relative;top:0px;right:0px;margin:0 auto;padding:4px 20px 6px;width:75%;z-index:50;').find('.preview').attr('style', 'position:absolute;width:84%;');
                            $self.text('删除备份').attr('disabled', 'disabled').addClass('has-restore'); // 设置禁用，防止连续点击两下把备份删了
                            setTimeout(function(){
                                $self.removeAttr('disabled');
                            }, 800);
                        } else {
                            $wb_card.append(`<div class="WB_cardwrap S_bg2 has-set-restore-btn Fav-Panel-Card" omid="${card.mid}" mid="${card.mid}">
                                <div style="display:none;"><header><div class="woo-box-item-flex"><div><div class="woo-box-flex woo-box-alignCenter woo-box-justifyCenter"><a href="//weibo.com/${card.user.uid}/${card.id}"></a></div></div></div></header></div>
                                <div class="WB_feed_detail clearfix" style="padding-top:0px;padding: 13px 20px 10px 20px;border-top-width: 0.1px;border-top-color: #8080800f;border-top-style: inset;">
                                <div class="WB_detail"><div class="WB_info" style="display:inline-block;font-size: 15px;"><a target="_blank"></a></div>
                                <div class="WB_from" style="display:inline-block;margin-left:10px;font-size: 15px;"><a target="_blank"></a></div><div class="WB_text" style="font-size: 14px;padding: 10px 10px 0px 10px;"><div>
                                <div></div></div>`
                            );
                            $wb_card.find('.WB_detail .WB_info a').text(card.user.nickname).attr('href', '//weibo.com/u/' + card.user.uid);
                            $wb_card.find('.WB_detail .WB_from a').text(card.date).attr('href', '//weibo.com/' + card.user.uid + '/' + card.id);
                            $wb_card.find('.WB_detail .WB_text').html(card.text);
                            $pop = resolver.showPhotoLinksPopPanel($wb_card, resolver.generateBatchDownloadOptionsFromBackup($wb_card, card), false);
                            $pop.addClass('restore-fav-pop').attr('style', 'position:relative;top:0px;right:0px;margin:0 auto;padding:4px 20px 6px;width:75%;z-index:50;margin-bottom:15px;')
                                .find('.preview').attr('style', 'position: absolute;width: 70%;right: 100%;top: 0px;')
                                .find('img').attr('style', 'border: 3px solid #f1912d3b;border-radius: 3px;');
                            $self.text('删除备份').attr('disabled', 'disabled').addClass('has-restore'); // 设置禁用，防止连续点击两下把备份删了
                            resolver.findCardScrollerItem($wb_card)[0].__vue__.item.user = {'id': card.user.uid, 'screen_name': card.user.nickname};
                            setTimeout(function(){
                                $self.removeAttr('disabled');
                            }, 800);
                        }
                    } else {
                        toastr.info('本地备份没有备份该微博~');
                    }
                } else {
                    if (!unsafeWindow.confirm('你确定要删除收藏备份吗？删除后不可恢复')) {
                        return;
                    }
                    // 兼容旧版本
                    resolver.removeFavWeiboBackup(mid) === 404 && mid != omid && resolver.removeFavWeiboBackup(omid, true);
                    $self.remove();
                }
            };
            resolver.getResolverName() === 'OldWeiboResolver' && $('body').on('click', resolver.findCardRestoreBackupBtn().selector, resolver.RestoreBackupBtnEventFunc);

            // 批量备份一页收藏
            GM_registerMenuCommand('备份本页中所有的收藏', function() {
                if (!/(?:www\.)?weibo\.com\/(fav|u\/page\/fav\/)/.test(document.location.href)) {
                    toastr.error('只能在收藏页执行本操作');
                    return;
                }
                if (resolver.getResolverName() === "OldWeiboResolver") {
                    let $weibo_cards = resolver.findFeedCardItemList(), $not_backup_cards, $weibo_card, mid, count = 0;
                    $not_backup_cards = $weibo_cards.filter(function(i) {
                        $weibo_card = $(this);
                        mid = resolver.findWeiboCardMid($weibo_card, true);
                        if (!resolver.isWeiboDelete($weibo_card, true) && !resolver.getFavWeiboBackup(mid)) {
                            count++;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (count > 0) {
                        if (confirm(`共 ${count} 条微博未备份，是否备份？`)) {
                            $not_backup_cards.each(function () {
                                resolver.addFavWeiboBackup($(this));
                            });
                            toastr.success(`新备份 ${count} 个`);
                        }
                    } else {
                        toastr.info('本页之前已全部完成备份~');
                    }
                } else {
                    resolver.batchBackFavWeiboCard();

                }

            });
            // 收藏时自动备份提示开关
            switchAutoBackUpSetting(getAutoBackUpSetting());
            // 添加已删除微博还原按钮
            if (resolver.getResolverName() === "OldWeiboResolver") {
                setTimeout(function() {
                    var tab_type_flag = $(".WB_main_c").find("div:nth-child(1)").attr("id");
                    if (tab_type_flag && /.*(favlistsearch)$/.test(tab_type_flag)) {
                        resolver.showFavWeiboRestoreBtn();
                    }
                }, 1200);
                setTimeout(function() {
                    var tab_type_flag = $(".WB_main_c").find("div:nth-child(1)").attr("id");
                    if (tab_type_flag && /.*(favlistsearch)$/.test(tab_type_flag)) {
                        resolver.showFavWeiboRestoreBtn();
                    }
                }, 4000);
            } else {
                setTimeout(function() {
                    resolver.showFavWeiboRestoreBtn();
                }, 3000);
            }
        },
    };

    var selectWeiboFavToPanel = function (searchText, searchSize) {
        searchSize = searchSize || 20;
        var getFavWeiboBackup = function (fav_json, mid) { // 获取备份
            let fav_backup_group = fav_json, card = fav_backup_group[String(mid)], rootCard, photos = [], photo_parse_index = 0, video_parse_index = 0;
            if (card) {
                if (card.root) { // 如果传入的mid只是一个转发mid
                    rootCard = card;
                    card = fav_backup_group[String(rootCard.forward)]; // 获取实际存储数据的mid
                    if (card) {
                        //card.forward = true;
                        //card.rootCard = rootCard;
                        //if (!rootCard.name) {
                        //    rootCard.name = (rootCard.text ? rootCard.text.substr(0, 15) : rootCard.mid);
                        //}
                    } else {
                        card = rootCard;
                    }
                }
                if (card.photos && card.photos.length > 0 && typeof card.photos[0] == 'object') {
                    return card;
                }
                card.photos && $.each(card.photos, function(i, fileName) {
                    let photo = {url: 'https://wx3.sinaimg.cn/large/' + fileName, fileName: fileName, location: 'photos', folder_sort_index: ++photo_parse_index};
                    photos.push(photo);
                });
                card.livePhotos && $.each(card.livePhotos, function(i, fileName) {
                    let photo = {url: 'https://video.weibo.com/media/play?livephoto=//us.sinaimg.cn/' + fileName + '&KID=unistore,videomovSrc', fileName: fileName, location: 'videos', folder_sort_index: ++video_parse_index};
                    photos.push(photo);
                });
                // card.videos && $.each(card.videos, function(i, fileName) {
                //     let photo = {url: 'http://f.video.weibocdn.com/' + fileName + '?KID=unistore,video', fileName: fileName, location: 'videos', folder_sort_index: ++video_parse_index};
                //     photos.push(photo);
                // });
                card.videos && $.each(card.videos, function(i, fileName) {
                    if (fileName.indexOf(':') !== -1) {
                        let urls = (fileName.indexOf('@') !== -1 ? fileName : (fileName + '@')).split('@');
                        let title = 'https://video.weibo.com/show?fid=' + urls[0] + (urls[1] ? '<br>( ' + urls[1] + ' )' : '');
                        let photo = {url: 'https://video.weibo.com/show?fid=' + urls[0], short_url: urls[1], fileName: title, location: 'videos', folder_sort_index: ++video_parse_index, 'download_disable': true};
                        photos.push(photo);
                    }
                });
                card.photos = photos;
                delete card.livePhotos;
                delete card.videos;
                if (!card.name) {
                    card.name = resolver.getNameFromText(card.text) || card.mid;
                }
                card.date = resolver.formatWeiboDate(card.date);
                card.fav_date = card.fav_date || card.date;
            }
            return card;
        }

        var getFavList = function (fav_list_json, searchText, searchSize) {
            var fav_json = fav_list_json, fav_list = [], card, mid_list = [], index = 0;
            let keys = Object.keys(fav_json);
            for (let i = keys.length - 1; i >= 0; i--) {
                card = getFavWeiboBackup(fav_json, fav_json[keys[i]].mid);
                if (searchText && (card.user.nickname || '').indexOf(searchText) === -1 && (card.text || '').indexOf(searchText) === -1) {
                    continue;
                }
                //if ((card.text || '').indexOf('甲') === -1){
                //    continue;
                //}
                if (mid_list.indexOf(card.mid) === -1) {
                    mid_list.push(card.mid);
                    fav_list.push(card);
                }
                if (searchSize !== undefined && ++index >= searchSize) {
                    break;
                }
            }
            return fav_list;
        }

        // let fav_list_json = Object.values(GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {})).sort(function (l, r) {
        //         return (l.fav_date || l.date) > (r.fav_date || r.date) ? 1 : -1
        //     }).map(function (card) {
        //         return (card.mid, card);
        //     });
        let fav_list_json = GM_getValue(Constants.KEY_FAV_BACKUP_GROUP, {});
        let fav_list = getFavList(fav_list_json, searchText, searchSize), fav_list_html = '';
        for (let card of fav_list) {
            fav_list_html +=
                `<div class="WB_cardwrap S_bg2 has-set-restore-btn Fav-Panel-Card" omid="${card.mid}" mid="${card.mid}">
                 <div style="display:none;"><header><div class="woo-box-item-flex"><div><div class="woo-box-flex woo-box-alignCenter woo-box-justifyCenter"><a href="//weibo.com/${card.user.uid}/${card.id}"></a></div></div></div></header></div>
                <div class="WB_feed_detail clearfix WB_empty" style="padding-top:0px;">
                    <div class="WB_detail">
                        <div class="WB_info" style="display:inline-block;">
                            <a target="_blank" href="//weibo.com/u/${card.user.uid}">${card.user.nickname}</a>
                        </div>
                        <div class="WB_from" style="display:inline-block;margin-left:10px">
                            <a target="_blank" href="//weibo.com/${card.user.uid}/${card.id}">${card.date}</a>
                        </div>
                        <div class="WB_text">${card.text}</div>
                    </div>
                </div>
            </div>`;
        }

        let containerName = resolver.getResolverName() === "OldWeiboResolver" ? "#plc_main .WB_main_c" : "#app";

        $(containerName).find('.wb-fav-panel-content').html(fav_list_html);
        //document.querySelector('.wb-fav-panel-content').innerHTML = ;

        $('.wb-fav-panel-content').find('.WB_cardwrap').each(function (i, wb_card) {
            let $wb_card = $(wb_card), $pop, mid = $wb_card.attr('mid'), card = fav_list_json[mid];
            if (!card) {
                return false;
            }
            $pop = resolver.showPhotoLinksPopPanel($wb_card, resolver.generateBatchDownloadOptionsFromBackup($wb_card, card), false);
            $pop.attr('style', 'position:relative;top:0px;right:0px;margin:0 auto;padding:4px 20px 6px;width:75%;z-index:50;')
                // .find('.preview').attr('style', 'position:absolute;width:84%;');
                .find('.preview').attr('style', 'position: absolute;width: 33%;right: 100%;top: 0%;');
        });
    }
    var initWeiboFavPanel = function () {
        $('#WeiboFavPanelStyle').remove();
        $('head').append(`
            <style id="WeiboFavPanelStyle">

            .wb-fav-panel-location {
                position: fixed;
                width: 100%;
                left: 0%;
                top: 0%;
                z-index: 100000;
                background-color: rgba(189, 175, 175, 0.78);
                height: 100%;
            }

            .wb-fav-panel {
                position: fixed;
                width: 70%;
                left:0%;
                top:0%;
                z-index: 100000;
                padding: 5px 15% 5px 15%;
                background-color: rgba(237, 229, 229, 0.45);
                height: 100%;
                overflow: scroll;
                margin-top: 20px;
            }

            .wb-fav-panel-header {
                padding: 5px;
            }

            .wb-fav-panel-content {
                position: relative;
                background: #fff;
                border-radius: 3px;
                border: 1px solid #ccc;
                box-shadow: 0 4px 20px 1px rgba(0,0,0,0.2);
                padding-bottom: 500px;
            }
            .wb-fav-panel-content .WB_cardwrap {
                padding: 20px;
                position: relative;
                border-top-width: 2px;
                border-top-style: outset;
            }

            .wb-fav-panel-content .WB_cardwrap:nth-child(1) {
                padding-top: 30px;
            }

            .wb-fav-panel-content .WB_text {
                font-size: 14px;
                padding: 20px 0px 20px 20px;
            }

            .wb-fav-panel-content .WB_text img {
                width: 1em;
            }

            .wb-fav-panel-content .WB_from, .wb-fav-panel-content .WB_info {
                font-size: 16px;
            }

            .wb-fav-panel-content .WB_empty {
                text-align: unset;
            }

            .wb-fav-panel-content .download-link-pop .preview {
                display: none;
                /*position: relative!important;*/
            }

            /*
            #toast-container {
             font-size: 15px;
            }
            */

            </style>
        `);

        let containerName = resolver.getResolverName() === "OldWeiboResolver" ? "#plc_main .WB_main_c" : "#app";

        $(containerName).append(
            `<div class="WB_feed WB_feed_v3 WB_feed_v4 wb-fav-panel-location" node-type="feed_list">
                    <div class="wb-fav-panel">
                    <div class="wb-fav-panel-header">
                        <label>作者<input type="text" class="wb-fav-panel-search-input-author" placeholder="作者或微博内容"></label>
                        <label>数量<input type="text" class="wb-fav-panel-search-input-size" value="20"></label>
                        <button value="搜索" class="wb-fav-panel-search-submit">搜索</button>
                    </div>
                    <div class="wb-fav-panel-content"></div>
                    </div>
             </div>`);
        //document.querySelector('.wb-fav-panel-content').innerHTML = ;

        $(containerName).find('.wb-fav-panel .wb-fav-panel-header .wb-fav-panel-search-submit').click(function() {
            let text = $(this).closest('.wb-fav-panel-header').find('.wb-fav-panel-search-input-author').val();
            let size = $(this).closest('.wb-fav-panel-header').find('.wb-fav-panel-search-input-size').val();
            selectWeiboFavToPanel(text,size);
        });

        $('.wb-fav-panel-location').click(function(e) {
            if (e.target.classList.contains('wb-fav-panel')) {
                $(containerName).find('.wb-fav-panel-location').remove();
                switchWeiboFavPanel(true);
            }
        });
        selectWeiboFavToPanel(undefined, 15);

    }
    unsafeWindow.initWeiboFavPanel = initWeiboFavPanel;

    let switch_weibo_fav_panel;
    var switchWeiboFavPanel = function(on) { // 切换收藏面板
        let saveValue = !!on;
        if (switch_weibo_fav_panel) {
            GM_unregisterMenuCommand(switch_weibo_fav_panel);
        }
        if (saveValue) {
            switch_weibo_fav_panel = GM_registerMenuCommand('开启收藏备份面板', function() {
                initWeiboFavPanel();
                toastr.success("开启收藏备份面板~");
                switchWeiboFavPanel(false);
            });
        } else {
            switch_weibo_fav_panel = GM_registerMenuCommand('关闭收藏备份面板', function() {
                let containerName = resolver.getResolverName() === "OldWeiboResolver" ? "#plc_main .WB_main_c" : "#app";
                $(containerName).find('.wb-fav-panel-location').remove();
                toastr.success("关闭收藏备份面板~");
                switchWeiboFavPanel(true);
            });
        }
    };

    setTimeout(function(){switchWeiboFavPanel(true)}, 100);

    core.init();


});