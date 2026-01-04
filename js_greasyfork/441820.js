// ==UserScript==
// @name         poipiku图片下载
// @namespace    https://github.com/coofo/someScript
// @version      0.2.6
// @license      AGPL License
// @description  poipiku图片下载的试做，需要key才能看的图片要输入key后才能下载
// @author       coofo
// @supportURL   https://github.com/coofo/someScript/issues
// @include      /^https://poipiku\.com/\d+/\d+\.html/
// @include      /^https://poipiku\.com/(\d+)(/?$|/?\?)/
// @include      /^https://poipiku.com/IllustListPcV\.jsp\?.*ID=(\d+)/
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.15.10/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://greasyfork.org/scripts/442002-coofoutils/code/coofoUtils.js?version=1107527
// @require      https://update.greasyfork.org/scripts/453330/1541594/coofoUtils-tampermonkeyUtils.js
// @require      https://greasyfork.org/scripts/453329-coofoutils-comicinfo/code/coofoUtils-comicInfo.js?version=1106598
// @connect      img.poipiku.com
// @connect      img-org.poipiku.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/441820/poipiku%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/441820/poipiku%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function (tools) {
    'use strict';
    //setting
    let setting = tools.setting;

    Object.assign(setting, {
        def: {
            /**
             * 文件名格式（包括路径）
             * ${userId}       用户ID
             * ${userName}     用户名
             * ${id}           插图ID
             * ${page}         插图序号
             * ${page2}        插图序号（2位）
             * ${page3}        插图序号（3位）
             * ${page4}        插图序号（4位）
             */
            imageNameTemplate: "[poipiku]/[${userId}]${userName}/[${id}]-${page_index2}",

            /**
             * zip文件名格式（包括路径）
             */
            zipNameTemplate: "[poipiku][${userId}]${userName}"
        },
        threadNum: 8,
        /**
         * 下载模式
         * single：将图片文件单个下载（如果需要保存的文件有文件夹结构，则需要将tampermonkey下载模式调整为【浏览器API】）
         * zip：将图片打成zip包下载
         */
        downloadMode: "zip",

        /**
         * 下载失败重试次数
         * @type {number}
         */
        downloadRetryTimes: 2

    });

    //setting end

    //设置按钮
    GM_registerMenuCommand("文件名设置", function () {
        let html = `图片名格式<br/><input id="imageNameTemplate" style="width: 90%;"><br/>
                    压缩包名格式<br/><input id="zipNameTemplate" style="width: 90%;"><br/>
                        <!--<button id="saveTemplate">保存</button><button id="resetTemplate">默认值</button>-->`;
        Swal.fire({
            title: '命名模板设置',
            html: html,
            footer: `<div><table border="1">
                             <tr><td>巨集</td><td>说明</td></tr>
                             <tr><td>\${userId}</td><td>用户ID</td></tr>
                             <tr><td>\${userName}</td><td>用户名</td></tr>
                             <tr><td>\${id}</td><td>插图ID</td></tr>
                             <tr><td>\${page}</td><td>插图序号</td></tr>
                          </table><br>
                          <table border="1">
                             <tr><td>后缀</td><td>说明（取到值时才生效，取不到则替换为空字符串）</td></tr>
                             <tr><td>empty</td><td>未取到时填充为空字符串</td></tr>
                             <tr><td>parenthesis</td><td>圆括号</td></tr>
                             <tr><td>squareBracket</td><td>方括号</td></tr>
                             <tr><td>curlyBracket</td><td>大括号</td></tr>
                             <tr><td>path</td><td>后加文件夹分隔符</td></tr>
                             <tr><td>index2</td><td>向前添0补全至2位</td></tr>
                             <tr><td>index3</td><td>向前添0补全至3位（以此类推）</td></tr>
                         </table></div>`,
            confirmButtonText: '保存',
            showDenyButton: true,
            denyButtonText: `恢复默认`,
            showCancelButton: true,
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                let templateSetting = {
                    imageNameTemplate: $('#imageNameTemplate').val(),
                    zipNameTemplate: $('#zipNameTemplate').val()
                };
                GM_setValue("templateSetting", templateSetting);
            } else if (result.isDenied) {
                GM_deleteValue("templateSetting");
            }
        });
        let templateSetting = Object.assign({}, setting.def, GM_getValue("templateSetting", {}));

        $('#imageNameTemplate').val(templateSetting.imageNameTemplate);
        $('#zipNameTemplate').val(templateSetting.zipNameTemplate);

    });


    const userName = $("h2.UserInfoUserName a").html();
    coofoUtils.commonUtils.assert.hasLength(userName, "未获取到userName");


    if (tools.poipiku.utils.isUserPage()) {
        //用户页面
        $("a.GiftBtn").after('<a class="BtnBase" id="a_download" style="margin-left: 5px;" href="javascript: void(0);">⬇下载</a>');
        $("#a_download").click(function () {
            if (!tools.poipiku.utils.isLogin()) {
                alert("请先登入");
                return;
            }
            if (tools.runtime.nowDownloading) return;
            tools.runtime.nowDownloading = true;

            Object.assign(setting, setting.def, GM_getValue("templateSetting", {}));

            let context = tools.runtime.downloadTask;

            Object.assign(context, {
                info: {
                    userName: userName
                },
                items: []
            });

            tools.runtime.downloadTask.showMsg("分析页面");

            let btn = $("#a_download");
            tools.runtime.downloadTask.showMsg = function (msg) {
                btn.html(msg);
            };

            let itemList = $("a.IllustThumbImg");
            for (let i = 0; i < itemList.length; i++) {
                let detailUrl = $(itemList[i]).attr("href");
                let match = detailUrl.match(/\/(\d+)\/(\d+)\.html$/);
                if (match === null) continue;

                context.info.userId = match[1];

                let item = {
                    parent: context,
                    info: {
                        id: match[2]
                    },
                    images: []
                };
                context.items.push(item);
            }
            download(context);
        });

    } else if (tools.poipiku.utils.isDetailPage()) {
        //详情页面
        let span = $('div.IllustItemUser span');
        // span.before('<span class="BtnBase UserInfoCmdFollow UserInfoCmdFollow_581115" style="margin-right: 10px;;padding: 0 10px 0 10px;flex: initial;" id="span_download">⬇下载</span>');
        span.before('<span class="BtnBase UserInfoCmdFollow UserInfoCmdFollow_581115" style="margin-right: 10px;flex: 0 0 0;padding: 0 13px" id="span_download">⬇下载</span>');
        $("#span_download").click(function () {
            let getImgUrlFunction = tools.poipiku.api.getOrgImgUrl;
            if (!tools.poipiku.utils.isLogin()) {
                alert("请先登入");
                return;
            }
            if (tools.runtime.nowDownloading) return;
            tools.runtime.nowDownloading = true;

            Object.assign(setting, setting.def, GM_getValue("templateSetting", {}));

            let context = tools.runtime.downloadTask;

            let btn = $("#span_download");
            tools.runtime.downloadTask.showMsg = function (msg) {
                btn.html(msg);
            };

            setting.pass = $("input.IllustItemExpandPass").val();
            let url = window.location.href;
            let match = url.match(tools.poipiku.regex.detailUrl);

            Object.assign(context, {
                info: {
                    userName: userName,
                    userId: match[1]
                },
                items: []
            });

            context.items.push({
                parent: context,
                info: {
                    id: match[2]
                },
                images: []
            });

            download(context);

        });

    }

    let download = async function (context) {
        //获取下载地址
        let generateTask = coofoUtils.service.task.create();
        tools.runtime.downloadTask.generateTask = generateTask;

        context.items.forEach(item => {
            generateTask.api.addTask(taskItem => tools.poipiku.downloadHelp.generateTask(taskItem, item), setting.downloadRetryTimes);
        });

        let generateTaskReturn = await generateTask.api.exec(setting.threadNum);
        if (generateTaskReturn.retryTimesOutNum > 0) {
            Swal.fire({
                icon: 'error',
                title: '下载出错',
                text: '解析地址 ' + generateTaskReturn.completeNum + ' - ' + generateTaskReturn.retryTimesOutNum
            });
            return;
        }

        //执行下载操作
        let downloadTask = coofoUtils.service.task.create();
        tools.runtime.downloadTask.downloadTask = downloadTask;

        context.items
            .flatMap(item => item.images)
            .forEach(image => downloadTask.api.addTask(taskItem => tools.poipiku.downloadHelp.downloadTask(taskItem, image), setting.downloadRetryTimes));

        let downloadTaskReturn = await downloadTask.api.exec(setting.threadNum);
        if (downloadTaskReturn.retryTimesOutNum > 0) {
            Swal.fire({
                icon: 'error',
                title: '下载出错',
                text: '下载 ' + downloadTaskReturn.completeNum + ' - ' + downloadTaskReturn.retryTimesOutNum
            });
        }

        //创建zip
        let zipFile = await new Promise(resolve => tools.poipiku.downloadHelp.generateZip(context, zipFile => resolve(zipFile)));

        //触发下载
        let zipFileName = coofoUtils.commonUtils.format.string.filePathByMap(tools.setting.zipNameTemplate, context.info) + ".zip";
        coofoUtils.commonUtils.downloadHelp.toUser.asTagA4Blob(zipFile, zipFileName);
        tools.runtime.downloadTask.showFinished(downloadTaskReturn.completeNum, 0);

    }


})((function () {
    const constants = {};
    const cache = {};

    const tools = {
        setting: {pass: ""},
        runtime: {
            nowDownloading: false,
            downloadTask: {
                zip: null,
                generateTask: null,
                getGeneratedNum: function () {
                    if (this.generateTask == null) {
                        return 0;
                    }
                    let i = 0;
                    let list = this.generateTask.runtime.taskList;
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].complete === true) {
                            i++;
                        }
                    }
                    return i;
                },
                downloadTask: null,
                getDownloadedNum: function () {
                    if (this.downloadTask == null) {
                        return 0;
                    }
                    let i = 0;
                    let list = this.downloadTask.runtime.taskList;
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].complete === true) {
                            i++;
                        }
                    }
                    return i;
                },
                showMsg: function (msg) {
                    console.log(msg);
                },
                refreshGenerateStatus: function () {
                    let completeNum = tools.runtime.downloadTask.getGeneratedNum();
                    let totalNum = tools.runtime.downloadTask.generateTask.runtime.taskList.length;
                    let digitNum;
                    if (totalNum > 1000) {
                        digitNum = 2;
                    } else if (totalNum > 100) {
                        digitNum = 1;
                    } else {
                        digitNum = 0;
                    }
                    let percent = coofoUtils.commonUtils.format.num.toThousands(completeNum / totalNum * 100, null, digitNum) + "%";
                    tools.runtime.downloadTask.showMsg("解析地址 " + percent);
                },
                refreshDownLoadStatus: function () {
                    let completeNum = tools.runtime.downloadTask.getDownloadedNum();
                    let totalNum = tools.runtime.downloadTask.downloadTask.runtime.taskList.length;
                    let digitNum;
                    if (totalNum > 1000) {
                        digitNum = 2;
                    } else if (totalNum > 100) {
                        digitNum = 1;
                    } else {
                        digitNum = 0;
                    }
                    let percent = coofoUtils.commonUtils.format.num.toThousands(completeNum / totalNum * 100, null, digitNum) + "%";
                    tools.runtime.downloadTask.showMsg("下载 " + percent);
                },
                showFinished: function (completeNum, retryTimesOutNum) {
                    let msg = "下载完成：" + completeNum;
                    if (retryTimesOutNum > 0) {
                        msg = msg + " - " + retryTimesOutNum;
                    }
                    this.showMsg(msg);
                    tools.runtime.downloadTask.generateTask = null;
                    tools.runtime.downloadTask.downloadTask = null;
                }
            }
        },
        poipiku: {
            regex: {
                userUrl: [/^https:\/\/poipiku\.com\/(\d+)(\/?$|\/?\?)/, /https:\/\/poipiku.com\/IllustListPcV\.jsp\?.*ID=(\d+)/],
                detailUrl: /^https:\/\/poipiku\.com\/(\d+)\/(\d+)\.html/
            },
            utils: {
                isLogin: function () {
                    return $("a.LoginButton").length <= 0;
                },
                isUserPage: function () {
                    let url = window.location.href;
                    for (let i = 0; i < tools.poipiku.regex.userUrl.length; i++) {
                        if (url.match(tools.poipiku.regex.userUrl[i]) != null) {
                            return true;
                        }
                    }
                    return false;
                },
                isDetailPage: function () {
                    let url = window.location.href;
                    return url.match(tools.poipiku.regex.detailUrl) != null;
                },
                tryGetImgUrlFromSmallUrl: function (url) {
                    let match = url.match(/^(.*)_\d+\.[0-9a-zA-Z]+$/);
                    if (match === null) {
                        return url;
                    }
                    return match[1];
                },
                tagImgItem: function (userId, id, color) {
                    if (this.isDetailPage()) {
                        $("#span_download").css("border", "2px solid " + color);
                    } else {
                        $("#a_download").css("border", "2px solid " + color);
                        let itemList = $("a.IllustThumbImg");
                        for (let i = 0; i < itemList.length; i++) {
                            let item = $(itemList[i]);
                            let match = item.attr("href").match(/\/(\d+)\/(\d+)\.html$/);
                            // if (match === null || match[1] !== userId || match[2] !== id) continue;
                            // item.css("border","4px solid red");
                            if (match !== null && match[1] === userId && match[2] === id) {
                                item.parent().css("border", "4px solid " + color);
                                return;
                            }
                        }
                    }
                },
                tagZeroImgItem: function (userId, id) {
                    this.tagImgItem(userId, id, "red");
                },
                tagWarnImgItem: function (userId, id) {
                    this.tagImgItem(userId, id, "orange");
                }
            },
            api: {
                /**
                 * 如果当前作品第一张图是直接能看的，该接口的返回中不包括第一张图，该接口预定将不再使用
                 * result_num 返回值统计
                 *     成功返回                1
                 *     sign in                 1
                 *     follower                2
                 *     需要密码但是密码错误    -2
                 *     需要关注                -5
                 *     需要关注                -6
                 */
                getSmallImgUrl: function (uid, iid, onSuccess, onError, onComplete) {
                    let data = {
                        UID: uid,
                        IID: iid,
                        PAS: tools.setting.pass,
                        MD: 0,
                        TWF: 1
                    };
                    $.ajax({
                        url: "/f/ShowAppendFileF.jsp",
                        data: data,
                        type: 'post',
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        success: function (request) {
                            // console.log(request);

                            let div = document.createElement("div");
                            div.innerHTML = request.html;
                            let imgUrls = [];
                            let imgs = $(div).find("img");
                            for (let i = 0; i < imgs.length; i++) {
                                imgUrls[i] = tools.poipiku.utils.tryGetImgUrlFromSmallUrl($(imgs[i]).attr("src"));
                            }
                            if (imgUrls.length <= 0) {
                                tools.poipiku.utils.tagZeroImgItem(uid, iid);
                            }
                            onSuccess(imgUrls);
                        },
                        error: onError,
                        complete: onComplete
                    });
                },
                /**
                 * result 返回值统计
                 *     成功返回                1
                 *     sign in                 1
                 *     需要密码但是密码错误    -3
                 *     需要关注                -3
                 * error_code
                 *     需要关注                -3
                 */
                getOrgImgUrl: function (id, td, onSuccess, onError, onComplete) {
                    let data = {
                        ID: id,
                        TD: td,
                        AD: -1,
                        PAS: tools.setting.pass
                    };
                    $.ajax({
                        url: "/f/ShowIllustDetailF.jsp",
                        data: data,
                        type: 'post',
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        success: function (request) {
                            if (request.error_code === -3) {
                                tools.poipiku.utils.tagWarnImgItem(id, td);
                                tools.poipiku.api.getSmallImgUrl(id, td, onSuccess, onError, onComplete)
                            } else {
                                // console.log(request);
                                let div = document.createElement("div");
                                div.id = "temp";
                                document.body.appendChild(div);
                                div.innerHTML = request.html;
                                let imgs = $("#temp img");
                                // console.log(imgs);
                                let imgUrls = [];
                                for (let i = 0; i < imgs.length; i++) {
                                    imgUrls[i] = $(imgs[i]).attr("src");
                                }
                                if (imgUrls.length <= 0) {
                                    tools.poipiku.utils.tagZeroImgItem(id, td);
                                }
                                document.body.removeChild(div);

                                onSuccess(imgUrls);
                            }
                        },
                        error: onError,
                        complete: onComplete
                    });
                }
            },
            downloadHelp: {
                generateTask: function (taskItem, item) {
                    tools.poipiku.api.getOrgImgUrl(item.parent.info.userId, item.info.id, imgUrls => {
                        for (let i = 0; i < imgUrls.length; i++) {
                            item.images.push({
                                parent: item,
                                info: {
                                    page: i + 1,
                                    suffix: "." + coofoUtils.commonUtils.format.file.getSuffix(imgUrls[i])
                                },
                                imgUrl: imgUrls[i],
                                file: null
                            });
                        }
                        taskItem.success();
                        tools.runtime.downloadTask.refreshGenerateStatus();
                    }, () => {
                        taskItem.failed();
                    });
                },
                downloadTask: function (taskItem, image) {
                    coofoUtils.tampermonkeyUtils.downloadHelp.toBlob.asBlob(image.imgUrl, responseDetails => {
                        if (responseDetails.status === 200) {

                            image.file = responseDetails.response;
                            taskItem.success();
                            tools.runtime.downloadTask.refreshDownLoadStatus();
                        } else {
                            console.error(responseDetails);
                            setTimeout(() => taskItem.failed(), 500);
                        }
                    })
                },
                generateZip: function (context, onFinished) {
                    let zip = new JSZip();
                    context.items
                        .flatMap(item => item.images)
                        .forEach(image => {
                            if (image.file !== null) {
                                let info = Object.assign({}, image.parent.parent.info, image.parent.info, image.info);
                                let name = coofoUtils.commonUtils.format.string.filePathByMap(tools.setting.imageNameTemplate, info) + image.info.suffix;
                                zip.file(name, image.file);
                            }
                        });
                    zip.generateAsync({type: "blob", compression: "STORE"}).then(onFinished);
                },
            }
        }
    };

    return tools;
})());