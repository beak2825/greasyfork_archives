// ==UserScript==
// @name        批量下载Attrangs照片
// @name:zh     批量下载Attrangs照片
// @name:en     Batch srcImage downloader for Attrangs
// @version     0.5.4
// @description   一键批量下载Attrangs中的图片
// @description:zh  一键批量下载Attrangs中的图片
// @description:en  Batch Download Image From Attrangs
// @supportURL  https://imcoder.site/article/detail?aid=124
// @match       http://attrangs.co.kr/*
// @match       https://attrangs.co.kr/*
// @match       http://cn.attrangs.com/*
// @match       https://cn.attrangs.com/*
// @match       http://justone.co.kr/*
// @match       http://www.justone.co.kr/*
// @connect     sonyunara.com
// @connect     poxo.com
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlHttpRequest
// @grant       GM_notification
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @require 	http://code.jquery.com/jquery-latest.js
// @require 	https://cdn.bootcss.com/toastr.js/2.1.3/toastr.min.js
// @require 	https://cdn.bootcss.com/jszip/3.1.5/jszip.min.js
// @resource    toastr_css https://cdn.bootcss.com/toastr.js/2.1.3/toastr.min.css
// @author      Jeffrey.Deng
// @namespace https://greasyfork.org/users/129338
// @downloadURL https://update.greasyfork.org/scripts/40200/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BDAttrangs%E7%85%A7%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/40200/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BDAttrangs%E7%85%A7%E7%89%87.meta.js
// ==/UserScript==

// @blog        https://imcoder.site
// @date        2018.4.1

// @更新日志
// v 0.5.1      2019.12.11     1.修复格式化数字排序未生效的问题
// V 0.5        2019.12.2      1.修改为toastr提示方式
//                             2.采用队列下载
// V 0.4        2019.1.30      1.修复网站更新后报错问题
//                             2.调整图片排序的命名，格式化数字（1显示为01），便于查看时顺序一样
//                             3.edge会闪退，原因不知，未修复
// V 0.2        2018.4.7       增加对justone.co.kr的支持
// V 0.1        2018.4.1       打包成zip压缩包下载

(function (document, $) {

    var common_utils = (function(document, $) {
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
        function ajaxDownload(url, callback, args, tryTimes) {
            tryTimes = tryTimes || 0;
            var GM_download = GM.xmlHttpRequest || GM_xmlHttpRequest,
                clearUrl = url.replace(/[&\?]?download_timestamp=\d+/, ''),
                retryUrl = clearUrl + (clearUrl.indexOf('?') === -1 ? '?' : '&') + 'download_timestamp=' + new Date().getTime();
            GM_download({
                method: 'GET',
                responseType: 'blob',
                url: url,
                onreadystatechange: function (responseDetails) {
                    if (responseDetails.readyState === 4) {
                        if (responseDetails.response != null && (responseDetails.status === 200 || responseDetails.status === 0)) {
                            var blob = responseDetails.response, size = blob && blob.size;
                            if (size && (size / 1024 > 0)) {
                                callback(blob, args);
                            } else if (tryTimes++ == 3) {
                                callback(blob, args);
                            } else {
                                ajaxDownload(retryUrl, callback, args, tryTimes);
                            }
                        } else {
                            if (tryTimes++ == 3) {
                                callback(null, args);
                            } else {
                                ajaxDownload(retryUrl, callback, args, tryTimes);
                            }
                        }
                    }
                },
                onerror: function (responseDetails) {
                    if (tryTimes++ == 3) {
                        callback(null, args);
                    } else {
                        ajaxDownload(retryUrl, callback, args, tryTimes);
                    }
                    console.log(responseDetails.status);
                }
            });
            /*try {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = "blob";
                xhr.onreadystatechange = function(evt) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 0) {
                            callback(xhr.response, args);
                        } else {
                            callback(null, args);
                        }
                    }
                };
                xhr.send();
            } catch (e) {
                callback(null, args);
            }*/
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
                aLink.download = fileName;
                aLink.style = "display:none;";
                var blob = new Blob([content]);
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
            aLink.target = "_blank";
            aLink.style = "display:none;";
            aLink.href = url;
            document.body.appendChild(aLink);
            if(document.all) {
                aLink.click(); //IE
            } else {
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                aLink.dispatchEvent(evt ); // 其它浏览器
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
        var context = {
            "ajaxDownload": ajaxDownload,
            "fileNameFromHeader": fileNameFromHeader,
            "downloadBlobFile": downloadBlobFile,
            "downloadUrlFile": downloadUrlFile,
            "parseURL": parseURL,
            "paddingZero": paddingZero,
            "TaskQueue": TaskQueue
        };
        return context;
    })(document, jQuery);

    var options = {
        "type": 2,
        "isNeedConfirmDownload": true,
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
        if (files && files.length > 0) {
            var zip = new JSZip();
            var main_folder = zip.folder(names.folderName);
            var zipFileLength = 0;
            var maxIndex = files.length;
            var paddingZeroLength = (files.length + "").length;
            if (names.infoName) {
                main_folder.file(names.infoName, names.infoValue);
            }
            options.callback.beforeFilesDownload_callback(files, names, location_info, options, zip, main_folder);
            var downloadFile = function (file, resolveCallback) {
                return $.Deferred(function(dfd) {
                    var folder = file.location ? main_folder.folder(file.location) : main_folder;
                    var isSave = options.callback.beforeFileDownload_callback(file, location_info, options, zipFileLength, zip, main_folder, folder);
                    if (isSave !== false) {
                        common_utils.ajaxDownload(file.url, function (blob, file) {
                            var isSave = options.callback.eachFileOnload_callback(blob, file, location_info, options, zipFileLength, zip, main_folder, folder);
                            if (isSave !== false) {
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
                    zipFileLength++;
                    notify_start.find(".toast-message").text("正在打包～ 第 " + zipFileLength + " 张" + (isSave ? "" : "跳过"));
                    resolveCallback && resolveCallback();   // resolve延迟对象
                    if (zipFileLength >= maxIndex) {
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
            if (maxIndex < options.useQueueDownloadThreshold) {
                // 并发数在useQueueDownloadThreshold内，直接下载
                for (var i = 0; i < maxIndex; i++) {
                    downloadFile(files[i]);
                }
            } else {
                // 并发数在useQueueDownloadThreshold之上，采用队列下载
                var queue = new common_utils.TaskQueue(function (file) {
                    if (file) {
                        var dfd = $.Deferred();
                        downloadFile(file, function () {
                            dfd.resolve();
                        });
                        return dfd;
                    }
                });
                for (var j = 0; j < maxIndex; j++) {
                    queue.append(files[j]);
                }
            }
        } else {
            notify_start.css("display", "none").remove();
            toastr.error("未解析到图片！", "错误", {"progressBar": false});
        }
    };

    /** 批量下载 **/
    function batchDownload(config) {
        try {
            options = $.extend(true, options, config);
            var location_info = options.callback.parseLocationInfo_callback(options);
            var files = options.callback.parseFiles_callback(location_info, options);
            if (!(files && files.promise)) {
                files = $.when(files);
            }
            files.done(function (files) {
                if (files && files.length > 0) {
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

    /*** start main ***/

    if (typeof GM_addStyle == 'undefined') {
        this.GM_addStyle = (aCss) => {
            'use strict';
            let head = document.getElementsByTagName('head')[0];
            if (head) {
                let style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.textContent = aCss;
                head.appendChild(style);
                return style;
            }
            return null;
        };
    }

    function addDownloadBtn() {
        // css
        GM_addStyle(GM_getResourceText('toastr_css'));
        GM_addStyle(
            ".goBottom { " +
            "    display: block; " +
            "    width: 38px; " +
            "    height: 38px; " +
            "    background-color: #ddd; " +
            "    border-radius: 3px; " +
            "    border: 0; " +
            "    cursor: pointer; " +
            "    position: fixed; " +
            "    right: 50px; " +
            "    bottom: -40px; " +
            "} " +
            ".goBottom .arrow { " +
            "    width: 0; " +
            "    height: 0; " +
            "    bottom: 6px; " +
            "    border-width: 9px 9px 0; " +
            "    border-style: solid; " +
            "    border-color: transparent; " +
            "    border-top-color: #429e46; " +
            "} " +
            ".goBottom div { " +
            "    position: absolute; " +
            "    right: 0; " +
            "    left: 0; " +
            "    margin: auto; " +
            "} " +
            ".goBottom .stick { " +
            "    width: 8px; " +
            "    height: 14px; " +
            "    top: 9px; " +
            "    border-radius: 1px; " +
            "    background-color: #429e46; }"
        );

        $("body").append(
            '<div id="batchDownloadBtn" class="goBottom" style="bottom: 30px;z-index: 10000" title="点击打包下载所有图片"><div class="stick"></div><div class="arrow"></div>'
        );
    }

    function doSomethingBeforePageLoad() {
        var location_info = common_utils.parseURL(document.location.href);
        if (location_info.host == "attrangs.co.kr" || location_info.host == "cn.attrangs.com") {
            if (location_info.file == "view.php" && location_info.params.hasOwnProperty("cate")) {
                var search = "";
                $.each(location_info.params, function (key, value) {
                    if(key != "cate") {
                        search += "&" + key + "=" + value;
                    }
                });
                search = search.substring(search.indexOf("&") == -1 ? 0 : 1);
                history.replaceState(
                    null,
                    document.title,
                    location_info.protocol + "://" + location_info.host + location_info.path + "?" + search
                );
            }
        } else if (location_info.host == "justone.co.kr" || location_info.host == "www.justone.co.kr") {
            if (location_info.file == "shopdetail.html" && location_info.params.branduid) {
                var jt_search = "?branduid=" + location_info.params.branduid;
                history.replaceState(
                    null,
                    document.title,
                    location_info.protocol + "://" + location_info.host + location_info.path + jt_search
                );
            }
            var R = function (a) {
                var ona = "on" + a;
                if (window.addEventListener){
                    window.addEventListener(a, function (e) {
                        for (var n = e.originalTarget; n; n = n.parentNode){
                            n[ona] = null;
                        }
                    }, true);
                }
                window[ona] = null;
                document[ona] = null;
                if (document.body){
                    document.body[ona] = null;
                }
            };
            R("contextmenu");R("click");R("mousedown");R("mouseup");R("selectstart");
        }
    }

    doSomethingBeforePageLoad();
    addDownloadBtn();

    $('#batchDownloadBtn').click(function () {
        var location_info = common_utils.parseURL(document.location.href);
        if (location_info.host == "attrangs.co.kr" || location_info.host == "cn.attrangs.com") {
            unsafeWindow.attrangsPhotoDownload();
        } else if (location_info.host == "justone.co.kr" || location_info.host == "www.justone.co.kr") {
            unsafeWindow.justonePhotoDownload();
        }
    });

    // attrangs
    unsafeWindow.attrangsPhotoDownload = function (options) {
        var config = {
            "type": 2,
            "callback": {
                "parseFiles_callback": function (location_info, options) {
                    var photo_arr = [];
                    if (location_info.host == "attrangs.co.kr") {
                        var kr_part_nodes_one = $("#detail .addimg .slick-track img"); // $('.detailPage .left .thumb ul li a');
                        var kr_part_nodes_two = $('#infoImageLine').find('img'); // $('.viewCon').eq(1).find("img").length == 0 ? $('.viewCon').eq(2).find("img") : $('.viewCon').eq(1).find("img");
                        var kr_part_nodes_three = $('#detail .related .prdimg a');
                        var kr_part_nodes_four = $("#detail > div.wrap_info > div.tabcnt_detail.tabcnt_detail1 .prdimg a");
                        //var kr_part_nodes_three = null;
                        //var kr_part_nodes_four = null;
                        //if($('.detailPage .likeSlides').length == 2) {
                        //    kr_part_nodes_three = $('.detailPage .likeSlides').eq(0).find("a");
                        //    kr_part_nodes_four = $('.detailPage .likeSlides').eq(1).find("a");
                        //} else {
                        //    kr_part_nodes_three = $('.detailPage .likeSlides').eq(1).find("a");
                        //    kr_part_nodes_four = $('.detailPage .likeSlides').eq(0).find("a");
                        //}

                        var complete_url_test = /^https?:/;
                        $.each(kr_part_nodes_one, function (i, a){
                            var photo = {};
                            photo.url = null;
                            if (!$(this).data("video")) {
                                photo.url = $(this).data('href');
                                if (!complete_url_test.test(photo.url)) {
                                    photo.url = "https:" + photo.url;
                                    $(this).attr('data-href', photo.url)
                                }
                                photo.type = "image";
                            } else {
                                photo.url = $(this).data('video');
                                if (!complete_url_test.test(photo.url)) {
                                    photo.url = "https:" + photo.url;
                                    $(this).attr('data-video', photo.url)
                                }
                                photo.type = "video";
                            }
                            photo.location = "summary";
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });

                        var gif_url = $('head meta[property="og:image"]').attr("content");
                        photo_arr.push({
                            "url": "https://atimg.sonyunara.com/files/attrangs/" + gif_url.substring(gif_url.indexOf('goods')),
                            "location": "summary",
                            "folder_sort_index": photo_arr.length + 1
                        });

                        $.each(kr_part_nodes_two, function (i, img){
                            var photo = {};
                            photo.url = img.src;
                            photo.location = "detail";
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });

                        $.each(kr_part_nodes_three, function (i, a){
                            var photo = {};
                            var img = $(a).find("img");
                            photo.url = img.get(0).src;
                            photo.location = "like";
                            photo.folder_sort_index = i + 1;
                            photo.good_name = img.attr("alt");
                            photo.good_url = a.href;
                            photo_arr.push(photo);
                        });

                        $.each(kr_part_nodes_four, function (i, a){
                            var photo = {};
                            var img = $(a).find("img");
                            photo.url = img.get(0).src;
                            photo.location = "relation";
                            photo.folder_sort_index = i + 1;
                            photo.good_name = img.attr("alt"); // $(a).text().replace(/^\s*|\s*$/, '');
                            photo.good_url = a.href;
                            photo_arr.push(photo);
                        });

                    } else if (location_info.host == "cn.attrangs.com") {
                        var cn_part_nodes_one = [];
                        cn_part_nodes_one.push($("#container .xans-product-detail .detailArea .keyImg img"));
                        cn_part_nodes_one.push($("#container .xans-product-detail .detailArea .listImg img"));
                        var cn_part_nodes_two = $('#prdRelated .bxslider_slide03_wrapper .xans-record-');
                        var cn_part_nodes_three = $('#prdDetail div img');

                        $.each(cn_part_nodes_one, function (i, img){
                            var photo = {};
                            photo.url = img.get(0).src;
                            photo.location = "summary";
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });

                        if ($("#prdRelated").length > 0) {
                            $.each(cn_part_nodes_two, function (i, li){
                                var photo = {};
                                var img = $(li).find("img");
                                photo.url = img.get(0).src;
                                photo.location = "relation";
                                photo.folder_sort_index = i + 1;
                                var a = $(li).find(".name").find("a");
                                photo.good_name = a.text();
                                photo.good_url = a.get(0).href;
                                photo_arr.push(photo);
                            });
                        }

                        $.each(cn_part_nodes_three, function (i, img){
                            var photo = {};
                            photo.url = img.src;
                            photo.location = "detail";
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });
                    }
                    return photo_arr;
                },
                "makeNames_callback": function (photos, location_info, options) {
                    var names = {};
                    if (location_info.host == "attrangs.co.kr") {
                        var product_property_node = $("head"); // $(".aw-product");
                        var good_id = location_info.params.index_no; // product_property_node.find('div[data-product-property="id"]').text();
                        var good_name = product_property_node.find('meta[property="og:title"]').attr('content'); // product_property_node.find('div[data-product-property="title"]').text();
                        var good_keyName = good_name.substring(0, good_name.indexOf(" ")) || good_id;
                        var good_type_little = product_property_node.find('meta[name="subject"]').attr('content'); // product_property_node.find('div[data-product-property="product_type"]').text();
                        var good_type_large = good_type_little.substring(0, 4);
                        var good_description = product_property_node.find('meta[property="og:description"]').attr('content'); // product_property_node.find('div[data-product-property="description"]').text();
                        var good_price = product_property_node.find('meta[property="product:price:amount"]').attr('content'); // product_property_node.find('div[data-product-property="price"]').text();
                        var good_cover = product_property_node.find('meta[property="og:image"]').attr('content'); // product_property_node.find('div[data-product-property="image_link"]').text();
                        names.infoName = "clothing_info.txt";
                        names.infoValue = "good_id：" + good_id + "\r\n" +
                            "good_keyName：" + good_keyName + "\r\n" +
                            "good_name：" + good_name + "\r\n" +
                            "good_type_large：" + good_type_large + "/" + $(".detailPage .right .location").find("a").eq(1).text() + "\r\n" +
                            "good_type_little：" + good_type_little + "/" + $(".detailPage .right .location").find("a").eq(2).text() + "\r\n" +
                            "good_description：" + good_description + "\r\n" +
                            "good_price：" + good_price + "\r\n" +
                            "good_cover：" + good_cover + "\r\n" +
                            "page_url：" + location_info.source + "\r\n" +
                            "image_amount：" + photos.length + "\r\n";
                        names.zipName = "attrangs_" + good_keyName;
                        names.folderName = good_keyName;
                        names.prefix = good_keyName;
                        names.suffix = null;
                        names.good = {};
                        names.good.good_id = good_id;
                        names.good.good_keyName = good_keyName;
                        names.good.good_name = good_name;
                    } else if (location_info.host == "cn.attrangs.com") {
                        var cn_good_id = location_info.segments[2];
                        var cn_good_name = $(".infoArea .product_name_css").find("td").eq(0).text();
                        var cn_good_keyName = cn_good_id;
                        if(/^[a-zA-Z]+[\d]+$/.test(location_info.segments[1])) {
                           cn_good_keyName = location_info.segments[1];
                        } else if (/^[a-zA-Z]+[\d]+.*?/.test(cn_good_name)) {
                           cn_good_keyName = cn_good_name.substring(0, cn_good_name.indexOf(" "));
                        }
                        var cate_nodes = $("#container  .xans-product-headcategory li");
                        var cn_good_type_little = cate_nodes.eq(2).find("a").text();
                        var cn_good_type_little_href = cate_nodes.eq(2).find("a").get(0).href;
                        var cn_good_type_large = cate_nodes.eq(1).find("a").text();
                        var cn_good_type_large_href = cate_nodes.eq(1).find("a").get(0).href;
                        var cn_good_price = $("#span_product_price_text").text();
                        var cn_good_cover = $("#container .xans-product-detail .detailArea .keyImg img").get(0).src;
                        var cn_good_description = ($("#span_additional_description_translated").length > 0 ? $("#span_additional_description_translated").text() : "");
                        names.infoName = "clothing_info.txt";
                        names.infoValue = "good_id：" + cn_good_id + "\r\n" +
                            "good_keyName：" + cn_good_keyName + "\r\n" +
                            "good_name：" + cn_good_name + "\r\n" +
                            "good_type_large：" + cn_good_type_large + "（" + cn_good_type_large_href + "）\r\n" +
                            "good_type_little：" + cn_good_type_little + "（" + (cn_good_type_little ? cn_good_type_little_href : "") + "）\r\n" +
                            "good_description：" + cn_good_description + "\r\n" +
                            "good_price：" + cn_good_price + "\r\n" +
                            "good_cover：" + cn_good_cover + "\r\n" +
                            "page_url：" + decodeURIComponent(decodeURIComponent(location_info.source)) + "\r\n" +
                            "image_amount：" + photos.length + "\r\n";
                        names.zipName = "attrangs_" + cn_good_keyName;
                        names.folderName = cn_good_keyName;
                        names.prefix = cn_good_keyName;
                        names.suffix = null;
                        names.good = {};
                        names.good.good_id = cn_good_id;
                        names.good.good_keyName = cn_good_keyName;
                        names.good.good_name = cn_good_name;
                    }
                    return names;
                },
                "beforeFilesDownload_callback": function(photos, names, location_info, options, zip, main_folder) {
                    var photo_urls_str = "";

                    // 保存html文件
                    var htmlNode = document.cloneNode(true);
                    var pageDom = $(htmlNode);

                    // 删除脚本，添加一个点击切换图片方法
                    pageDom.find("script").each(function(i, script){
                        $(script).remove();
                    });
                    //pageDom.find('.detailPage .left .thumb ul li a').addClass("clickToChange");
                    //pageDom.find('.detailPage .left .photo img').attr("id","clickToChange-img");
                    pageDom.find('.add_slide img').addClass("clickToChange");
                    pageDom.find('.main-photo').attr("id","clickToChange-img");
                    pageDom.find("body").append(
                     "<script type='text/javascript'>var arr = document.getElementsByClassName('clickToChange');for(var i=0;i<arr.length;i++){arr[i].onclick= function(){if (this.getAttribute('data-video') == ''){" +
					"var path = this.getAttribute('data-href');var img = document.getElementById('clickToChange-img');img.setAttribute('src',path);img.style =  img.style + 'visibility:visible';" +
					"} else {document.getElementById('goods_video').innerHTML = this.getAttribute('data-video');}};}"
					);

                    // 替换相对url为绝对url
                    pageDom.find("img").each(function(i, img){
                        img.setAttribute("src", img.src);
                    });
                    pageDom.find("link").each(function(i, style){
                        if(style.getAttribute("href")) {
                            style.setAttribute("href", style.href);
                        }
                    });
                    pageDom.find("a").each(function(i, a){
                        if(a.getAttribute("href")) {
                            a.setAttribute("href", a.href);
                        }
                    });

                    //pageHtml = pageDom.children(0)[0].outerHTML;
                    var paddingZeroLength = (photos.length + "").length;
                    $.each(photos, function(i, photo){
                        var photoDefaultName = names.prefix + "_" + common_utils.paddingZero(photo.folder_sort_index, paddingZeroLength) + "." + (names.suffix || photo.url.substring(photo.url.lastIndexOf('.') + 1));
                        var photo_save_path = ((photo.location ? (photo.location + "/") : "" ) + photoDefaultName);
                        if (location_info.host == "attrangs.co.kr") {
                            if (photo.location == "like" || photo.location == "relation") {
                                var kr_good_keyName = photo.good_name.substring(0, photo.good_name.indexOf(" "));
                                photo_save_path = ((photo.location ? (photo.location + "/") : "" ) + kr_good_keyName + "." + photo.url.substring(photo.url.lastIndexOf('.') + 1));
                            } else if (photo.location == "summary" && photo.type == "video") {
                                photo_save_path = (photo.location ? (photo.location + "/") : "" ) + "video_info.txt";
                            }
                        } else if (location_info.host == "cn.attrangs.com") {
                            if (photo.location == "relation") {
                                var cn_good_keyName = "";
                                if (/^[a-zA-Z]+[\d]+.*?/.test(photo.good_name)) {
                                    cn_good_keyName = photo.good_name.substring(0, photo.good_name.indexOf(" "));
                                } else {
                                    cn_good_keyName = common_utils.parseURL(photo.good_url).params.product_no;
                                }
                                photo_save_path = ((photo.location ? (photo.location + "/") : "" ) + cn_good_keyName + "." + photo.url.substring(photo.url.lastIndexOf('.') + 1));
                            }
                        }
                        photo_urls_str +=  (photo_save_path + "\t" + photo.url + "\r\n");

                        // 替换html文件中图片地址为本地文件地址
                        if (photo.type != "video") {
                            pageDom.find('img[src="' + photo.url + '"]').attr("src", "./" + photo_save_path);
                            pageDom.find('a[data-href="' + photo.url + '"]').attr("data-href", "./" + photo_save_path);
                        }
                        //pageHtml.replace(new RegExp(photo.url,"gm"), "./" + photo_save_path);
                    });
                    main_folder.file("photo_url_list.txt", photo_urls_str); // 图片链接列表
                    main_folder.file("page.html", pageDom.children(0)[0].outerHTML); // 保存本页面的html文件
                },
                "eachFileOnload_callback": function(blob, photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                    if (location_info.host == "attrangs.co.kr") {
                        if (photo.location == "like" || photo.location == "relation") {
                            var kr_good_keyName = photo.good_name.substring(0, photo.good_name.indexOf(" "));
                            photo.fileName = kr_good_keyName + "." + photo.url.substring(photo.url.lastIndexOf('.') + 1);
                            folder.file(kr_good_keyName + "_info.txt", "good_keyName：" + kr_good_keyName + "\r\n" + "good_name：" + photo.good_name + "\r\n" + "good_url：" + photo.good_url);
                        } else if (photo.location == "summary" && photo.type == "video") {
                            folder.file("video_" + zipFileLength + ".txt", photo.url);
                            return false;
                        }
                    } else if (location_info.host == "cn.attrangs.com") {
                        if (photo.location == "relation") {
                            var cn_good_keyName = "";
                            if (/^[a-zA-Z]+[\d]+.*?/.test(photo.good_name)) {
                                cn_good_keyName = photo.good_name.substring(0, photo.good_name.indexOf(" "));
                            } else {
                                cn_good_keyName = common_utils.parseURL(photo.good_url).params.product_no;
                            }
                            photo.fileName = cn_good_keyName + "." + photo.url.substring(photo.url.lastIndexOf('.') + 1);
                            folder.file(cn_good_keyName + "_info.txt", "good_keyName：" + cn_good_keyName + "\r\n" + "good_name：" + photo.good_name + "\r\n" + "good_url：" + photo.good_url);
                        }
                    }
                    return true;
                }
            }
        };
        if (options) {
            $.extend(true, config , options);
        }
        batchDownload(config);
    };

    // justone
    unsafeWindow.justonePhotoDownload = function (options) {
        var config = {
            "type": 2,
            "shopdetail_url": "http://justone.co.kr/shop/shopdetail.html",
            "callback": {
                "parseLocationInfo_callback": function (location_info, options) {
                    return common_utils.parseURL(document.location.href);
                },
                "parseFiles_callback": function (location_info, options) {
                    var photo_arr = [];
                    if (location_info.host == "justone.co.kr" || location_info.host == "www.justone.co.kr") {
                        var kr_part_nodes_one = $('#productDetail .thumb-wrap .origin-img a');
                        //var kr_part_nodes_two = $('#productDetail .tmb-info .SMP-container').next().find('iframe').find('table .thumbnail-wrap img');
                        var kr_part_nodes_three = $('#productDetail #detailCnt1 .prd-detail center img');
                        var kr_part_nodes_four = $('#SP_slider_detail_recommend_wrap .SP_slider_detail .bx-viewport .product').not('.bx-clone');
                        //var kr_part_nodes_five = $('#productDetail #detailCnt4 iframe table .thumbnail-wrap img');

                        $.each(kr_part_nodes_one, function (i, a){
                            var photo = {};
                            var img = $(a).find("img");
                            photo.location = "summary";
                            var sp_index = img.get(0).src.indexOf('?');
                            photo.url = (sp_index == -1 ? img.get(0).src : img.get(0).src.substring(0, sp_index));
                            img.attr("src", photo.url);
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });

                        /*$.each(kr_part_nodes_two, function (i, img){
                            var photo = {};
                            photo.location = "collocation";
                            var sp_index = img.src.indexOf('?');
                            photo.url = (sp_index == -1 ? img.src : img.src.substring(0, sp_index));
                            img.src = photo.url;
                            photo.folder_sort_index = i + 1;
                            var good_url = img.parentNode.parentNode.href;
                            var good_id = good_url.substring(good_url.indexOf('branduid') + 9);
                            photo.good_url = options.shopdetail_url + "?branduid=" + good_id;
                            photo.good_id = good_id;
                            photo_arr.push(photo);
                        });*/

                        $.each(kr_part_nodes_three, function (i, img){
                            var photo = {};
                            photo.url = img.src;
                            photo.location = "detail";
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });

                        $.each(kr_part_nodes_four, function (i, li){
                            var photo = {};
                            var good_id = li.id.substring(li.id.lastIndexOf('_') + 1);
                            photo.good_url = options.shopdetail_url + "?branduid=" + good_id;
                            photo.good_id = good_id;
                            var img = $(li).find("img");
                            var sp_index = img.attr('big').indexOf('?');
                            img.attr("big", (sp_index == -1 ? img.attr('big') : img.attr('big').substring(0, sp_index)));
                            photo.url = img.get(0).src.substring(0, img.get(0).src.indexOf('/shopimages/')) + img.attr('big');
                            img.attr("src", photo.url);
                            photo.location = "relation";
                            photo.folder_sort_index = i + 1;
                            photo_arr.push(photo);
                        });

                        /*$.each(kr_part_nodes_five, function (i, img){
                            var photo = {};
                            photo.location = "like";
                            var sp_index = img.src.indexOf('?');
                            photo.url = (sp_index == -1 ? img.src : img.src.substring(0, sp_index));
                            img.src = photo.url;
                            photo.folder_sort_index = i + 1;
                            var good_url = img.parentNode.parentNode.href;
                            var good_id = good_url.substring(good_url.indexOf('branduid') + 9);
                            photo.good_url = options.shopdetail_url + "?branduid=" + good_id;
                            photo.good_id = good_id;
                            photo_arr.push(photo);
                        });*/
                    }
                    return photo_arr;
                },
                "makeNames_callback": function (photos, location_info, options) {
                    // tb_tagManager
                    var names = {};
                    if (location_info.host == "justone.co.kr" || location_info.host == "www.justone.co.kr") {
                        var product_property_node = $(".tb_tagManager");
                        var good_id = product_property_node.find('.itemId').text();
                        var good_name = product_property_node.find('.itemName').text();
                        var good_keyName = good_name.substring(0, good_name.indexOf("_")) || good_id;
                        var good_type_little = product_property_node.find('.categoryName2').text() + "(" + product_property_node.find('.categoryCode2').text() + ")";
                        var good_type_large = product_property_node.find('.categoryName1').text() + "(" + product_property_node.find('.categoryCode1').text() + ")";
                        var good_description = product_property_node.find('.itemDesc').text();
                        var good_price = product_property_node.find('.itemPrice').text();
                        var good_cover = "http://" + location_info.host + product_property_node.find('.itemImg1').text();
                        names.infoName = "clothing_info.txt";
                        names.infoValue = "good_id：" + good_id + "\r\n" +
                            "good_keyName：" + good_keyName + "\r\n" +
                            "good_name：" + good_name + "\r\n" +
                            "good_type_large：" + good_type_large + "\r\n" +
                            "good_type_little：" + good_type_little + "\r\n" +
                            "good_description：" + good_description + "\r\n" +
                            "good_price：" + good_price + "\r\n" +
                            "good_cover：" + good_cover + "\r\n" +
                            "page_url：" + (options.shopdetail_url + "?branduid=" + good_id) + "\r\n" +
                            "image_amount：" + photos.length + "\r\n";
                        names.zipName = "justone_" + good_id;
                        names.folderName = good_id;
                        names.prefix = good_id;
                        names.suffix = null;
                        names.good = {};
                        names.good.good_id = good_id;
                        names.good.good_keyName = good_keyName;
                        names.good.good_name = good_name;
                    }
                    return names;
                },
                "beforeFilesDownload_callback": function(photos, names, location_info, options, zip, main_folder) {
                    // 保存html文件
                    var htmlNode = document.cloneNode(true);
                    var pageDom = $(htmlNode);

                    // 删除脚本，添加一个点击切换图片方法
                    pageDom.find("script").each(function(i, script){
                        $(script).remove();
                    });

                    // 替换相对url为绝对url
                    pageDom.find("img").each(function(i, img){
                        img.setAttribute("src", img.src);
                    });
                    pageDom.find("link").each(function(i, style){
                        if(style.getAttribute("href")) {
                            style.setAttribute("href", style.href);
                        }
                    });
                    pageDom.find("a").each(function(i, a){
                        if(a.getAttribute("href")) {
                            a.setAttribute("href", a.href);
                        }
                    });

                    var photo_urls_str = "";
                    var paddingZeroLength = (photos.length + "").length;
                    $.each(photos, function(i, photo){
                        var photoDefaultName = names.prefix + "_" + common_utils.paddingZero(photo.folder_sort_index, paddingZeroLength) + "." + (names.suffix || photo.url.substring(photo.url.lastIndexOf('.') + 1));
                        var photo_save_path = ((photo.location ? (photo.location + "/") : "" ) + photoDefaultName);
                        if (location_info.host == "justone.co.kr") {
                            if (photo.location == "like" || photo.location == "relation" || photo.location == "collocation") {
                                var kr_good_id = photo.good_id;
                                photo_save_path = ((photo.location ? (photo.location + "/") : "" ) + kr_good_id + "." + photo.url.substring(photo.url.lastIndexOf('.') + 1));
                            } else if (photo.location == "summary" && photo.type == "video") {
                                //photo_save_path = (photo.location ? (photo.location + "/") : "" ) + "video_info.txt";
                            }
                        }
                        photo_urls_str += (photo_save_path + "\t" +  photo.url + "\r\n");

                        // 替换html文件中图片地址为本地文件地址
                        if (photo.type != "video") {
                            pageDom.find('img[src="' + photo.url + '"]').attr("src", "./" + photo_save_path);
                        }
                        //pageHtml.replace(new RegExp(photo.url,"gm"), "./" + photo_save_path);
                    });
                    main_folder.file("photo_url_list.txt", photo_urls_str); // 图片链接列表
                    main_folder.file("page.html", pageDom.children(0)[0].outerHTML); // 保存本页面的html文件

                    if ($("#player_1").length > 0) {
                        main_folder.folder("summary").file("video.txt", $("#player_1").attr("src"));
                    }
                },
                "eachFileOnload_callback": function(blob, photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                    if (location_info.host == "justone.co.kr" || location_info.host == "www.justone.co.kr") {
                        if (photo.location == "like" || photo.location == "relation" || photo.location == "collocation") {
                            var kr_good_id = photo.good_id;
                            photo.fileName = kr_good_id + "." + photo.url.substring(photo.url.lastIndexOf('.') + 1);
                            folder.file(kr_good_id + "_info.txt", "good_id：" + kr_good_id + "\r\n" + "good_url：" + photo.good_url);
                        } else if (photo.location == "summary" && photo.type == "video") {
                            //folder.file("video_" + zipFileLength + ".txt", photo.url);
                            return false;
                        }
                    }
                    return true;
                }
            }
        };
        if (options) {
            $.extend(true, config , options);
        }
        batchDownload(config);
    };

})(document, jQuery);