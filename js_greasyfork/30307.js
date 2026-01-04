// ==UserScript==
// @name            批量下载贴吧原图
// @name:zh         批量下载贴吧原图
// @name:en         Batch srcImage downloader for tieba
// @namespace       https://github.com/Jeffrey-deng/userscript
// @version         3.4.2
// @description     一键打包下载贴吧中一贴的原图
// @description:zh  一键打包下载贴吧中一贴的原图
// @description:en  Batch Download Src Image From Baidu Tieba
// @author          Jeffrey.Deng
// @supportURL      https://imcoder.site/a/detail/HuXBzyC
// @homepageURL     https://imcoder.site
// @weibo           http://weibo.com/3983281402
// @match           http://tieba.baidu.com/*
// @match           https://tieba.baidu.com/*
// @match           http://imgsrc.baidu.com/*
// @match           https://imgsrc.baidu.com/*
// @match           http://tiebapic.baidu.com/*
// @match           https://tiebapic.baidu.com/*
// @connect         baidu.com
// @connect         bdimg.com
// @require         https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @require         https://cdn.bootcss.com/toastr.js/2.1.3/toastr.min.js
// @require         https://cdn.bootcss.com/jszip/3.1.5/jszip.min.js
// @resource        toastr_css https://cdn.bootcss.com/toastr.js/2.1.3/toastr.min.css
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlHttpRequest
// @grant           GM_notification
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/30307/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%B4%B4%E5%90%A7%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/30307/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%B4%B4%E5%90%A7%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

// @更新日志
// v.3.4.1      2020.7.11      1.修复jQuery下载失败问题
// v.3.3        2020.6.3       1.修复图片被删除但页面仍能看到却下载不到的问题
// v.3.1        2020.5.26      1.支持只下载楼主
//                             2.图片后缀名根据图片实际类型命名
// v.3.0        2020.5.21      1.支持下载多页
//                             2.支持下载被吞掉的图
// v.2.6.1      2019.12.16     1.修改压缩包名称为帖子的标题
//                               如果还是要以前的id作为压缩包名称，那么修改449行："packNameBy": "title",
//                               将 packNameBy 的值 title 修改为 id, 再按 ctrl + s 保存。
// v.2.6        2.19.12.16     1.修改图片域名为tiebapic.baidu.com时下载图片显示“你查看的图片不存在的”的问题
// v 2.5.1      2019.12.11     1.修复格式化数字排序未生效的问题
// V 2.5        2019.12.2      1.修改为toastr提示方式
//                             2.采用队列下载
// V 2.4        2019.3.17      1.调整图片排序的命名，格式化数字（1显示为01），便于查看时顺序一样
//                             2.edge会闪退，原因不知，未修复
// V 2.3        2018.5.31      1.兼容edge
// V 2.2        2018.4.7       1.调整匹配图片策略
// V 2.1        2018.4.2       1.调用Tampermonkey API 实现跨域下载，无需修改启动参数
// V 2.0        2018.4.1       1.压缩包内增加贴子地址txt
//                             2.修复https不能下载
// V 1.9        2018.4.1       1.新增打包下载,图片重命名（需开启浏览器跨域）
// V 1.8        2018.3.31      1.修复BUG
//                             2.可自定义输入文件名后缀
// V 1.7        2017.6.9       1.修复魅族等贴吧下载图标不显示的问题
// V 1.6        2017.6.5       1.提高下载的图片正确率
// V 1.5        2017.6.4       1.增加右键新标签打开图片直接打开原图
// V 1.4        2017.6.3       1.更新对 https 的支持
//                             2.提高图片匹配成功率

(function (factory) {
    factory(document, jQuery);
    // console.time('ready_init_use_time');
    // $().ready(function(){
    //     console.timeEnd('ready_init_use_time');
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
                        if (responseDetails.status === 200 || responseDetails.status === 304 || responseDetails.status === 0) {
                            var blob = responseDetails.response, size = blob && blob.size;
                            if (size && (size / 1024 >= 5)) {
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
                return $.Deferred(function (dfd) {
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
                }).done(function (blob, folder, isSave) {
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
            options = $.extend(true, {}, options, config);
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
            }).fail(function (message) {
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

    //右键新标签打开图片直接打开原图
    function initRightClickOpenSource() {
        var url = document.location.toString();
        var m = null;
        if (!(m = url.match(/^https?:\/\/(imgsrc|tiebapic)\.baidu\.com\/forum\/pic\/item\/.+/i))) {
            if ((m = url.match(/^(https?):\/\/(imgsrc|imgsa|tiebapic|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i))) {
                document.location = m[1] + "://" + (m[2] == "tiebapic" ? "tiebapic" : "imgsrc") + ".baidu.com/forum/pic/item/" + m[3];
            }
        }
    }

    /*** start main ***/

    //右键新标签打开图片直接打开原图
    initRightClickOpenSource();

    var getReplyAuthorUid = function ($reply) { // 获取回复UID
        let userInfoStr = $reply.find('.d_name').attr('data-field');
        return (userInfoStr && userInfoStr.match(/"user_id":(\d+)/) && RegExp.$1) || 0;
    }

    var getPostAuthorUid = function () { // 获取楼主UID
        return getReplyAuthorUid($('#j_p_postlist').children('.j_l_post').first());
    }

    // css
    GM_addStyle(GM_getResourceText('toastr_css'));
    // 添加按钮
    var $lis_nav = $('#tb_nav').find('ul').eq(0).find('li'),
        li_count = $lis_nav.length,
        $li_right = $lis_nav.eq(li_count - 1),
        html = '';
    if ($li_right.hasClass('none_right_border')) {
        var isStarTie = $li_right.hasClass('star_nav_tab');
        if (isStarTie) {
            html = '<li class="none_right_border star_nav_tab" style="cursor: pointer"><div class="star_nav_tab_inner"><div class="space">' +
                '<a title="点击下载本页图片" class="star_nav_ico star_nav_ico_photo" id="batchDownloadBtn"><i class="icon"></i>下载</a></div></div></div>';
        } else {
            html = '<li class="none_right_border j_tbnav_tab" style="cursor: pointer"><div class="tbnav_tab_inner"><p class="space">' +
                '<a title="点击下载本页图片" class="nav_icon icon_jingpin  j_tbnav_tab_a" id="batchDownloadBtn"  location="tabplay" >下载</a></p></div></div>';
        }
        $li_right.removeClass('none_right_border').after(html);
    } else {
        html = '<li class="j_tbnav_tab" style="cursor: pointer"><a class="j_tbnav_tab_a" id="batchDownloadBtn">下载</a> </li>';
        $li_right.after(html);
    }
    // 仪表盘控制栏添加按钮
    GM_registerMenuCommand('下载图片', function() {
        tiebaImagesDownload();
    });
    GM_registerMenuCommand('只下楼主', function() {
        tiebaImagesDownload({"onlyLz": true});
    });

    $('#batchDownloadBtn').click(function () {
        tiebaImagesDownload({"onlyLz": (document.location.href.indexOf('see_lz=1') !== -1 && confirm("是否只下载楼主的图片"))});
    });

    var tiebaImagesDownload = unsafeWindow.tiebaImagesDownload = function (options) {
        var config = {
            "type": 2,
            "minWidth": 100,
            "suffix": null,
            "packNameBy": "title", // "id" or "title"
            "baiduLoadPhotosApi": "https://tieba.baidu.com/photo/bw/picture/guide",
            "findPhotoByApi": true,
            "onlyLz": false,
            "callback": {
                "parseFiles_callback": function (location_info, options) {
                    let pn = location_info.params.pn || 1,
                        authorUid = getPostAuthorUid(),
                        findPhotosByPage = function () {
                            let photo_arr = [],
                                $part_nodes_one = $('.d_post_content,.d_post_content_main').find("img");
                            //var part_nodes_two = $('.d_post_content_main,.post_bubble_middle,.d_post_content').find("img");
                            $.each($part_nodes_one, function (i, img) {
                                let $img = $(img);
                                if (options.onlyLz) { // 只下楼主
                                    let replyUid = getReplyAuthorUid($img.closest('.j_l_post'));
                                    if (replyUid != authorUid) {
                                        return;
                                    }
                                }
                                // 如果是广告图片则跳过
                                if (img.parentNode.tagName == "A" && img.parentNode.className.indexOf("j_click_stats") != -1) {
                                    return true;
                                }
                                if (img.clientWidth >= options.minWidth) {
                                    if ($img.hasClass("BDE_Image") || $img.hasClass("d_content_img")) {
                                        var photo = {};
                                        photo.location = "";
                                        var thumb_url = img.src;
                                        photo.folder_sort_index = photo_arr.length + 1;
                                        // 如果是用户上传的图片
                                        if ($img.attr("pic_type") == "0") {
                                            var urlMatcher = thumb_url.match(/^(https?):\/\/([a-zA-Z]+)\..*\/([^/]+)$/);
                                            photo.url = urlMatcher[1] + "://" + (urlMatcher[2] == "tiebapic" ? "tiebapic" : "imgsrc") + ".baidu.com/forum/pic/item/" + urlMatcher[3];
                                            photo.id = urlMatcher[3].match(/^[^.]+/)[0];
                                        }
                                        // 如果是用户引用的图片
                                        else {
                                            var m = thumb_url.match(/^(https?):\/\/(imgsrc|imgsa|tiebapic|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/((\w+)\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i);
                                            // 如果引用的是贴吧图片
                                            if (m !== null) {
                                                photo.url = m[1] + "://" + (m[2] == "tiebapic" ? "tiebapic" : "imgsrc") + ".baidu.com/forum/pic/item/" + m[3];
                                                photo.id = m[4];
                                            } else {
                                                photo.url = thumb_url;
                                            }
                                        }
                                        photo.size = $img.attr("size") || 0;
                                        photo.location = "photos";
                                        photo_arr.push(photo);
                                    }
                                }
                            });
                            return photo_arr;
                        };
                    let notify_photo_data_loading = toastr.success("正在请求图片数据～", "", {
                        "progressBar": false,
                        "hideDuration": 0,
                        "showDuration": 0,
                        "timeOut": 0,
                        "closeButton": false
                    });
                    return $.Deferred(function (finalDfd) {
                        if (options.findPhotoByApi) {
                            let photo_arr = [], curr_load_count = 0, loadQueue = new common_utils.TaskQueue(function (startPicId) {
                                return $.Deferred(function (dfd) {
                                    $.get(options.baiduLoadPhotosApi, {
                                        'tid': location_info.file,
                                        'see_lz': options.onlyLz ? 1 : 0, // 只下楼主
                                        'from_page': 0,
                                        // 'alt': 'jview',
                                        'next': 50,
                                        'prev': 0,
                                        'pic_id': startPicId,
                                        '_': new Date().getTime(),
                                    }, function (resp) {
                                        let data = resp.data;
                                        if (data && data.pic_list) {
                                            let pic_amount = data.pic_amount,
                                                pic_list = data.pic_list,
                                                lastPicId,
                                                startPushPic = false;
                                            $.each(pic_list, function (key, pic) {
                                                let original = pic.img.original, photo;
                                                switch (true) {
                                                    case original.id == startPicId:
                                                        startPushPic = true;
                                                        break;
                                                    case !startPicId:
                                                        startPushPic = true;
                                                    case startPushPic:
                                                        photo = {};
                                                        photo.location = "photos";
                                                        photo.folder_sort_index = photo_arr.length + 1;
                                                        photo.id = original.id;
                                                        photo.url = (original.waterurl && original.waterurl.replace(/^http:\/\//, 'https://')) ||
                                                            (`https://imgsrc.baidu.com/forum/pic/item/${original.id}.jpg`);
                                                        photo.size = original.size;
                                                        photo_arr.push(photo);
                                                        curr_load_count++;
                                                        lastPicId = original.id;
                                                }
                                            });
                                            if (lastPicId && curr_load_count < pic_amount) {
                                                loadQueue.append(lastPicId);
                                            } else {
                                                // 队列下载结束
                                                // 对比页面数据和api返回数据，两者合并结果，并尝试按页面显示顺序排序
                                                let combine_photo_arr = [],
                                                    page_photo_arr = findPhotosByPage().filter(function(photo) {
                                                        return photo.size != 0; // 有些页面图片没写size，所以这里过滤了没写size的，暂时先这样处理
                                                    }).map(function(photo) {
                                                        let has_delete = true;
                                                        if (photo.id) {
                                                            for (let p of photo_arr) {
                                                                // 由于同样一张图片，id有两个，这里采用对比文件大小的方式来确定是否同一张图片
                                                                if (p.id == photo.id || (p.size != 0 && p.size == photo.size)) {
                                                                    has_delete = false;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        photo.has_delete = has_delete;
                                                        return photo;
                                                    }),
                                                    pageLength = page_photo_arr.length,
                                                    serverLength = photo_arr.length,
                                                    hasDeleteLength = page_photo_arr.filter(function(photo) {
                                                        return photo.has_delete;
                                                    }).length;
                                                if (hasDeleteLength > 0) {
                                                    let start_left_index = 0, start_right_index = 0, unshift_length = 0, i, j,
                                                        photo_url_arr = photo_arr.map(function (photo) {
                                                            return photo.url;
                                                        });
                                                    pn > 1 && $.each(page_photo_arr, function(i, photo) {
                                                        let index = photo_url_arr.indexOf(photo.url);
                                                        if (index != -1) {
                                                            start_right_index = index;
                                                            start_left_index = i;
                                                            return false;
                                                        } else {
                                                            unshift_length++;
                                                        }
                                                    });
                                                    if (start_right_index > 0) {
                                                        combine_photo_arr.push.apply(combine_photo_arr, photo_arr.slice(0, start_right_index));
                                                    }
                                                    if (start_left_index > 0) {
                                                        combine_photo_arr.push.apply(combine_photo_arr, page_photo_arr.slice(start_left_index - unshift_length, start_left_index));
                                                    }
                                                    for (i = start_left_index, j = start_right_index; i < pageLength && j < serverLength;) {
                                                        let photo, left = page_photo_arr[i], right = photo_arr[j];
                                                        if (left.id === right.id || (left.size != 0 && left.size == right.size)) {
                                                            photo = right;
                                                            i++;
                                                            j++;
                                                        } else {
                                                            if (left.has_delete) {
                                                                photo = left;
                                                                i++;
                                                            } else {
                                                                photo = right;
                                                                j++;
                                                            }
                                                        }
                                                        combine_photo_arr.push(photo);
                                                    }
                                                    if (i <= pageLength - 1) {
                                                        combine_photo_arr.push.apply(combine_photo_arr, page_photo_arr.slice(i, pageLength));
                                                    }
                                                    if (j <= serverLength - 1) {
                                                        combine_photo_arr.push.apply(combine_photo_arr, photo_arr.slice(j, serverLength));
                                                    }
                                                    $.each(combine_photo_arr, function(i, photo) {
                                                        photo.folder_sort_index = i + 1;
                                                    });
                                                } else {
                                                    combine_photo_arr = photo_arr;
                                                }
                                                finalDfd.resolve(combine_photo_arr);
                                            }
                                            dfd.resolve();
                                        } else {
                                            dfd.reject('api返回错误');
                                        }
                                    }, 'json').fail(function () {
                                        dfd.reject('api返回错误');
                                    });
                                }).fail(function (msg) {
                                    console.warn(msg);
                                    options.findPhotoByApi = false;
                                    finalDfd.resolve(findPhotosByPage());
                                });
                            });
                            loadQueue.append(null);
                        } else {
                            finalDfd.resolve(findPhotosByPage());
                        }
                    }).always(function () {
                        notify_photo_data_loading.css("display", "none").remove();
                    });
                },
                "makeNames_callback": function (photos, location_info, options) {
                    var names = {},
                        tie_id = location_info.file,
                        pn = location_info.params.pn || 1,
                        title = $(".core_title_txt").attr("title"),
                        forum = ($('#container').find('.card_title a.card_title_fname').text() || '贴').replace(/^\s*|\s*$/g, '');
                    names.infoName = "tie_info.txt";
                    names.infoValue = "id：" + tie_id + "\r\n" +
                        "title：" + title + "\r\n" +
                        "url：" + location_info.source + "\r\n" +
                        "page：" + pn + "\r\n" +
                        "image_amount：" + photos.length + "\r\n";
                    names.zipName = (options.packNameBy == "id" ? ("tie_" + tie_id) : (forum + '_' + tie_id + '_' + title)) + ((options.findPhotoByApi || pn == 1) ? "" : ("_" + pn));
                    names.folderName = names.zipName;
                    names.prefix = tie_id + (options.findPhotoByApi ? "" : ("_" + common_utils.paddingZero(pn, 3)));
                    names.suffix = options.suffix;
                    names.tie = {
                        'id': tie_id,
                        'title': title,
                        'pn': pn,
                        'forum': forum
                    };
                    return names;
                },
                "beforeFilesDownload_callback": function (photos, names, location_info, options, zip, main_folder) {
                    const paddingZeroLength = (photos.length + "").length;
                    $.each(photos, function (i, photo) {
                        photo.fileName = names.prefix + "_" + common_utils.paddingZero(photo.folder_sort_index, paddingZeroLength) + "." + (names.suffix || photo.url.substring(photo.url.lastIndexOf('.') + 1));
                    });
                    options.failFiles = undefined;
                },
                "eachFileOnload_callback": function (blob, photo, location_info, options, zipFileLength, zip, main_folder, folder) {
                    if (blob == null) {
                        if (!options.failFiles) {
                            options.failFiles = [];
                        }
                        options.failFiles.push(photo);
                    } else if (!options.names.suffix && photo.location == 'photos' && blob.type && blob.type.indexOf('image/') === 0) {
                        // 如果没有指定后缀名，那么后缀根据content-type来判断
                        let suffixRegex = /\.[^.]+$/, suffix = ('.' + blob.type.replace('image/', '').replace('jpeg', 'jpg'));
                        photo.fileName = photo.fileName.replace(suffixRegex, suffix);
                        photo.url = photo.url.replace(suffixRegex, suffix);
                    }
                    return true;
                },
                "allFilesOnload_callback": function (photos, names, location_info, options, zip, main_folder) {
                    let photo_urls_str = "", failPhotoListStr = "";
                    // 链接列表文件
                    $.each(photos, function (i, photo) {
                        photo_urls_str += ((photo.location ? (photo.location + "/") : "" ) + photo.fileName) + "\t" + photo.url + "\r\n";
                    });
                    main_folder.file("photo_url_list.txt", photo_urls_str);
                    // 帮助文件
                    main_folder.file("帮助.txt", "有些图片可能下载下来是裂掉的缩略图，可以从photo_url_list.text中按文件名手动找到链接下载。");
                    // 失败链接列表
                    if (options.failFiles && options.failFiles.length > 0) {
                        toastr.error("共 " + options.failFiles.length + " 张下载失败，已记录在photos_fail_list.txt！", "", {"progressBar": false, timeOut: 0});
                        failPhotoListStr = "";
                        for (var i in options.failFiles) {
                            var failFile = options.failFiles[i];
                            failPhotoListStr += (failFile.location + "/" + failFile.fileName + "\t" + failFile.url + "\r\n");
                        }
                        main_folder.file("photos_fail_list.txt", failPhotoListStr);
                    }
                }
            }
        };
        if (options) {
            $.extend(true, config, options);
        }
        batchDownload(config);
    };

});