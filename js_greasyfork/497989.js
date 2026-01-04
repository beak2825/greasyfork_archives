// ==UserScript==
// @name         缘觉影视推送下载-M3U8Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  推送缘觉影视播放链接至M3U8批量下载器下载
// @author       zsandian
// @require      https://cdn.jsdelivr.net/npm/notiflix@3.2.6/dist/notiflix-aio-3.2.6.min.js
// @require      https://unpkg.com/vconsole@latest/dist/vconsole.min.js
// @icon         https://www.yjys01.com/images/favicon.png
// @include      *://*.*yjys*
// @match        *://www.yjys01.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497989/%E7%BC%98%E8%A7%89%E5%BD%B1%E8%A7%86%E6%8E%A8%E9%80%81%E4%B8%8B%E8%BD%BD-M3U8Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/497989/%E7%BC%98%E8%A7%89%E5%BD%B1%E8%A7%86%E6%8E%A8%E9%80%81%E4%B8%8B%E8%BD%BD-M3U8Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let URL = window.location.href;
    let domparser = new DOMParser();
    let path;
    let years = [];
    let history = [];
    let update;
    let inHistory = [];
    //历史记录长度限制，0 为不限制，默认 100，过长影响运行效率
    let historyLimit = 100;
    let debug = '';
    let retry = 5;
    //M3U8批量下载器后台推送地址
    let M3U8DownloaderHost = "http://127.0.0.1:8787";
    let bdysHost = window.location.origin;
    let M3U8DownloaderStatus;
    let checkPathStatus;
    let m3u8Urls = [];
    //解析模式 网页名称https://www.yjys* 1 / 否则为2
    let parserModel = 1;

    async function main() {

        //开启消息提示
        tips();
        //关闭广告
        closeAd();

        //检测M3U8下载器是否运行
        M3U8DownloaderStatus = await checkM3U8Downloader();
        //检查下载目录是否设置
        checkPathStatus = checkPath();

        log("log", "main_解析插件加载成功");
        log("log", "main_path:" + path);

        //添加首页、分类页面 1080P下载 按钮
        $('div.card.card-sm.card-link div.card-body').each(function (index, Element) {
            $('div.card.card-sm.card-link div.card-body:eq(' + index + ')').append(`<button class="btn btn-square me-2" type="submit" id="btn_submit" href=`
                + $('a.d-block')[index].href + ` onclick="return false"> 1080P 下载 </button>`)
        });
        //添加分类页面 本页下载 按钮
        $('div.card-body.all-filter-wrapper dd:last').append('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 本页下载 </button>');
        //首页、分类页面 1080P下载 按钮功能设置
        $('div.card.card-sm.card-link #btn_submit').click(async function () {
            if (await checkStatus()) {
                this.disabled = true;

                let url = $(this).attr('href');
                let vod_name = $(this).parent().find('.card-title').text();
                await bdysParser(vod_name, url, 0, 0);
            }
        });

        //分类页面 本页下载 按钮功能设置
        $('div.card-body.all-filter-wrapper #btn_submit').click(async function () {
            if (await checkStatus()) {
                this.disabled = true;

                let list = [];

                $('div.card.card-sm.card-link').each(async function (index, Element) {
                    let url = $(this).find('.d-block')[0].href;
                    let vod_name = $(this).find('.card-title').text();
                    list.push({ url: url, vod_name: vod_name });
                });

                for (let i = 0; i < list.length; i++) {
                    await bdysParser(list[i].vod_name, list[i].url, 0, 0);
                }
            }
        });

        if ($('h1.d-none.d-md-block').text().match('\d*集')) {
            //修改滑动条宽度
            $('body').append(`<style type="text/css">.scroll-x::-webkit-scrollbar {height: 20px}</style>`)
            //添加 电视剧详情页面 全剧下载 按钮
            $('h3.card-title:eq(1)').not('.text-truncate').append('&nbsp;&nbsp;&nbsp;<button class="btn btn-square me-2" type="submit" id="btn_submit_a"> 全剧下载 </button>');
            //添加 电视剧详情页面 单集下载 按钮
            $('h3.card-title button#btn_submit_a').after('<button class="btn btn-square me-2" type="submit" id="btn_submit_s"> 单集下载 </button>');
            //添加 电视剧详情页面 迅雷批量下载 按钮
            $('h3.card-title:eq(2)').not('.text-truncate').append('&nbsp;&nbsp;&nbsp;<button class="btn btn-square me-2" type="submit" id="btn_submit_x"> 迅雷批量下载 </button>');

            /*
            //电视剧详情页面 迅雷批量下载 功能设置
            $('h3.card-title button#btn_submit_x').click(async function () {

                this.disabled = true;

                let title = $('h1.d-none.d-md-block').text().replace("&4K", "") + ($("p.mb-0.mb-md-2:contains('类型：')").text() !== "" ? "_" + $("p.mb-0.mb-md-2:contains('类型：')").text() : "") + ($('.badge.bg-green-lt').text() !== "豆瓣评分：暂无" ? "_" + $('.badge.bg-green-lt').text() : "");
                let checked = [];
                let noChecked = [];

                $("[name='check-download']:checkbox").each(function () {
                    let url = $(this).parent().parent().find('a').prop('href');
                    let name = /《(.*?)》/.exec(title)[1] + '.' + $(this).parent().next().text().replaceAll(' ', '');
                    if (url.match('.mp4')) {
                        name = name + '.mp4'
                    } else if (url.match('.mkv')) {
                        name = name + '.mkv'
                    }
                    if (this.checked) {
                        checked.push({ 'name': name, 'url': url })
                    } else if (url.match('ed2k')) {
                        noChecked.push({ 'name': name, 'url': url })
                    }
                })

                if (checked.length !== 0) {
                    thunderLink.newTask({
                        downloadDir: '',
                        tasks: checked
                    });
                } else {
                    thunderLink.newTask({
                        taskGroupName: title,
                        tasks: noChecked
                    });
                }
            })
            */


            //电视剧详情页面 全剧下载 功能设置
            $('h3.card-title button#btn_submit_a').click(async function () {
                if (await checkStatus()) {
                    this.disabled = true;

                    let title = $('h1.d-none.d-md-block').text().replace("&4K", "") + ($("p.mb-0.mb-md-2:contains('类型：')").text() !== "" ? "_" + $("p.mb-0.mb-md-2:contains('类型：')").text() : "") + ($('.badge.bg-green-lt').text() !== "豆瓣评分：暂无" ? "_" + $('.badge.bg-green-lt').text() : "");
                    let playList = $('a.btn.btn-square.me-2');
                    let vod_name = /《(.*?)》/.exec(title)[1];
                    console.log(title)
                    await bdysParser(vod_name, URL, 1, 0, title, playList);
                }

            })
            //电视剧详情页面 单集下载 功能设置
            $('h3.card-title #btn_submit_s').click(async function () {
                if (await checkStatus()) {
                    //this.disabled = true;

                    if ($('div#download-list').length == 0) {
                        $('div.card.mt-3:first').append('<div class="card-header py-2" id="download-list"> <h3 class="card-title">下载列表</h3> </div>');
                        $('div.card.mt-3:first').append('<div class="card-body scroll-x" id="download-list"> <div class="d-flex"></div> </div>');
                        $('a.btn.btn-square.me-2').each(async function (index, Element) {
                            $('div#download-list div.d-flex').append(`<button class="btn btn-square me-2" type="submit" id="btn_submit" href="`
                                + $('a.btn.btn-square.me-2')[index].href + `">` + $('a.btn.btn-square.me-2')[index].text + `</button>`);
                        });

                        $('button#btn_submit.btn.btn-square.me-2').click(async function () {
                            if (await checkStatus()) {
                                this.disabled = true;

                                let title = $('h1.d-none.d-md-block').text();
                                let url = $(this).attr('href');
                                let vod_name = /《(.*?)》/.exec(title)[1] + '.' + this.textContent;
                                await bdysParser(vod_name, url, 0, 0, vod_name);
                            }

                        });
                    } else {
                        $('div#download-list').remove()
                    }
                }
            });
        } else {
            //添加 电影详情页面 1080P下载 按钮
            //$('div#play-list div.d-flex').append('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 1080P 下载 </button>');
            $('a.btn.btn-square.me-2').each(async function (index, Element) {
                $('div#play-list div.d-flex').append(`<button class="btn btn-square me-2" type="submit" id="btn_submit" href="`
                    + $('a.btn.btn-square.me-2')[index].href + `"> ` + $('a.btn.btn-square.me-2')[index].text + `下载 </button>`);
            });
            $('div#play-list div.d-flex button#btn_submit').click(async function () {
                if (await checkStatus()) {
                    this.disabled = true;

                    let title = $('h1.d-none.d-md-block').text() + ($('.badge.bg-green-lt').text() !== "豆瓣评分：暂无" ? "_" + $('.badge.bg-green-lt').text() : "");
                    //let url = $('a.btn.btn-square.me-2:last')[0].href;
                    let url = $(this).attr('href');
                    let vod_name = /《(.*?)》/.exec(title)[1] + '.' + this.textContent.replace("下载", "");
                    await bdysParser(vod_name, url, 0, 0, title);
                }
            })
        }

        //匹配播放页面
        if ($('div.card-footer h2').length !== 0) {
            //添加播放页面 下载按钮
            $('div.card-footer h2').append('<h3></h3><button class="btn btn-square me-2" type="submit" id="btn_submit"> 下载 </button>');
            //播放页面 下载按钮 功能设置
            $('div.card-footer h2 #btn_submit').click(async function () {
                if (await checkStatus()) {
                    this.disabled = true;

                    //获取标题
                    let title = $('title')[0].outerText;
                    let title2 = $('a.text-pinterest')[0].attributes['title'].value;
                    let vod_name;
                    //获取文件名称
                    if (title2.match('集全|更至.*集')) {
                        vod_name = reSub(title, /.*《|\..*/, "》", ".");
                    } else {
                        vod_name = reSub(title, / .*/, "在线观看", reSub(title2, /《.*/));
                    };
                    await bdysParser(vod_name, URL, 0, 0, vod_name, 1);
                }
            });

            while (true) {
                //等待页面获取播放线路
                await wait(100)
                //Notiflix.Notify.info('正在获取播放线路')
                if ($('.art-selector-item.art-current')) {
                    if ($('.art-selector-item.art-current').length !== 0) {
                        //添加播放页面 m3u8线路下载按钮
                        if (lines.length == 1) {
                            $('div.card-footer h2').append('<button class="btn btn-square me-2" type="submit" id="xl_submit"> 线路1 </button>');
                        } else {
                            for (let i = 0; i < lines.length - 1; i++) {
                                $('div.card-footer h2').append('<button class="btn btn-square me-2" type="submit" id="xl_submit" title="' + lines[i] + '"> 线路' + (i + 1) + ' </button>');
                            }
                            $('div.card-footer h2').append('<button class="btn btn-square me-2" type="submit" id="xl_submit2" title="' + lines[lines.length - 1] + '"> 线路' + (lines.length) + ' </button>');
                        }
                        break;
                    }
                }
            }

            //播放页面 线路下载按钮 功能设置
            $('div.card-footer #xl_submit').click(async function () {
                if (await checkStatus()) {
                    this.disabled = true;

                    //获取标题
                    let title = $('title')[0].outerText;
                    let title2 = $('a.text-pinterest')[0].attributes['title'].value;
                    let pid = window.pid;
                    let vod_name;
                    let postData;

                    if (title2.match('集全|更至.*集')) {
                        vod_name = reSub(title, /.*《|\..*/, "》", ".");
                    } else {
                        vod_name = reSub(title, / .*/, "在线观看", reSub(title2, /《.*/));
                    };
                    Notiflix.Notify.info('正在推送：' + vod_name)
                    postData = "#OUT," + path + "\r\n" + vod_name.replaceAll(" ", "") + ".mp4,";
                    if (this.title.match(".m3u8")) {
                        postData = postData + this.title.replace("https://www.bde4.cc", bdysHost);
                    } else if (this.title.match("god")) {
                        postData = postData + this.title;
                    } else {
                        postData = postData + "raw@" + this.title;
                    }
                    let status = await pushToM3U8Downloader(vod_name, postData);
                    if (status == 1) {
                        Notiflix.Notify.success('推送成功：' + vod_name)
                        log("log", "main_下载任务推送成功");
                    } else {
                        log("error", "main_下载任务推送失败");
                    }
                }
            })

            //播放页面最后一个线路下载按钮功能设置，需要输入验证码
            $('div.card-footer #xl_submit2').click(async function () {
                if (time != null && new Date().getTime() - time < 86400000) {
                    error("距离发布未超过24小时不予开放！");
                    return
                }

                if (await checkStatus()) {
                    //this.disabled = true;

                    //获取标题
                    let title = $('title')[0].outerText;
                    let title2 = $('a.text-pinterest')[0].attributes['title'].value;
                    let vod_name;
                    let postData;

                    //获取文件名称
                    if (title2.match('集全|更至.*集')) {
                        vod_name = reSub(title, /.*《|\..*/, "》", ".");
                    } else {
                        vod_name = reSub(title, / .*/, "在线观看", reSub(title2, /《.*/));
                    };
                    postData = "#OUT," + path + "\r\n" + vod_name.replaceAll(" ", "") + ".mp4,"

                    //验证码显示
                    $('body').append(`<div class="modal modal-blur fade show" id="myModal2" tabindex="-1" role="dialog" aria-modal="true" style="display: block;">
                             <div class="modal-dialog modal-dialog-centered" role="document">
                             <div class="modal-content"> <div class="modal-header">
                             <h5 class="modal-title">输入验证码</h5>
                             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>
                             <div class="modal-body">
                             <div class="mb-2">
                             <div class="input-group mt-2">
                             <span class="input-group-text">验证码</span>
                             <input type="text" class="form-control col-lg-3" id="code" autocomplete="off">
                             <img class="input-group-text col-sm-3 col-md-3 p-0 cursor-pointer" id="aaa" > </div> </div> </div>
                             <div class="modal-footer"> <button type="button" class="btn btn-danger" data-bs-dismiss="modal">取消</button>
                             <button type="button" class="btn btn-primary">确定</button> </div> </div> </div> </div>`);
                    $('#myModal2 img#aaa').click(function () {
                        this.src = '/play/verifyCode?t=' + new Date().getTime()
                    });
                    $('#myModal2 img#aaa').click();


                    $('#myModal2 button.btn.btn-primary').click(async function () {
                        this.disabled = true;
                        let url;
                        let status = 0;
                        let verifyCode = $('#myModal2 input#code').val();
                        let test = "";
                        $('#myModal2').remove();
                        Notiflix.Notify.info('正在推送：' + vod_name)

                        let data = { "video": { "src": "" } };

                        getUrl(verifyCode, data);
                        let count = 0;
                        while (count < 100) {
                            await wait(100)
                            count += 1
                            if (data.video.src !== "") {
                                break;
                            }
                        }
                        //await wait(3000);
                        //$.ajaxSettings.async = true;
                        if (data.video.src !== "") {
                            console.log(5)
                            status = 1;
                            $('div.card-footer #xl_submit2').attr('title', data.video.src);
                            postData = postData + "raw@" + data.video.src;
                            await pushToM3U8Downloader(vod_name, postData);
                        }
                        if (status == 1) {
                            console.log(6)
                            Notiflix.Notify.success('推送成功：' + vod_name)
                            log("log", "main_下载任务推送成功");
                        } else {
                            console.log(7)
                            Notiflix.Notify.failure('推送失败：' + vod_name)
                            log("error", "main_下载任务推送失败");
                        }
                    });
                }
                $('#myModal2 button.btn.btn-danger').click(function () {
                    $('#myModal2').remove();
                });
                $('#myModal2 button.btn-close').click(function () {
                    $('#myModal2').remove();
                });
            });
        }

        //添加 记录设置按钮
        $('div.navbar-nav.flex-row.order-md-last').prepend('<button class="btn btn-square me-2" type="submit" id="history_submit"> 记录设置 </button>');
        //添加 年份设置按钮
        $('div.navbar-nav.flex-row.order-md-last').prepend('<button class="btn btn-square me-2" type="submit" id="function_submit"> 功能设置 </button>');
        //添加 目录设置按钮
        $('div.navbar-nav.flex-row.order-md-last').prepend('<button class="btn btn-square me-2" type="submit" id="path_submit"> 目录设置 </button>');

        //目录设置按钮 功能设置
        $('div.container-xl #path_submit').click(function () {
            let path2 = "";
            if (localStorage.getItem('bdys_path')) {
                path2 = localStorage.getItem('bdys_path')
            }
            $('body').append(`<div class="modal modal-blur fade show" id="pathModal" tabindex="-1" role="dialog" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content"> <div class="modal-header">
            <h5 class="modal-title">输入下载目录</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>
            <div class="modal-body"> <div class="mb-2">
            <div class="input-group mt-2">
            <span class="input-group-text">下载目录</span>
            <input type="text" class="form-control col-lg-3" id="path" value="` + path2 + `" autocomplete="off">  </div> </div>首次运行需要输入下载目录 例如：D:\\Downloads</div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary">确定</button> </div> </div> </div> </div>`);

            $('#pathModal button.btn.btn-danger').click(function () {
                $('#pathModal').remove();
            });
            $('#pathModal button.btn-close').click(function () {
                $('#pathModal').remove();
            });
            $('#pathModal button.btn.btn-primary').click(async function () {
                path = $('#pathModal input#path').val()
                $('#pathModal').remove();
                console.log(path)
                var regex = /^[a-zA-Z]:(((\\(?! )[^/:*?<>\""|\\]+)+\\?)|(\\)?)\s*$/;
                if (regex.test(path)) {
                    localStorage.setItem('bdys_path', path);
                    //location.reload();
                } else {
                    Notiflix.Report.failure('目录设置失败', '请检查输入目录格式是否正确，例如：D:\\Downloads', '确定');
                }
            });
        })

        //记录设置按钮 功能设置
        $('div.container-xl #history_submit').click(function () {
            $('body').append(`<div class="modal modal-blur fade show" id="historyModal" tabindex="-1" role="dialog" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content"> <div class="modal-header">
            <h5 class="modal-title">推送记录设置</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>
            <div class="modal-body">点击名称跳转至播放页面<br>点击 X 按钮删除记录<br><br>
            <div class="card" style="height: calc(18rem - 2px)">
            <div class="card-body card-body-scrollable card-body-scrollable-shadow py-2">
            <div class="divide-y-2"></div> </div> </div></div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">清除所有记录</button>
            <button type="button" class="btn btn-primary">确定</button> </div> </div> </div> </div>`);
            let bdys_history = JSON.parse(localStorage.getItem('bdys_history'));
            //console.log(bdys_history)
            if (!bdys_history) {
                bdys_history = [];
            }
            if (bdys_history.length == 0) {
                $('#historyModal div.divide-y-2').text("暂无推送记录")
            } else {
                for (var i in bdys_history) {
                    $('#historyModal div.divide-y-2').append('<a href="' + bdys_history[i].palyUri + '" class="dropdown-item text-muted">' + bdys_history[i].name + '<span class="badge ms-auto" onclick="return false">X</span></a>');
                }
            }
            $('#historyModal .badge.ms-auto').click(function () {
                for (var i in bdys_history) {
                    if (bdys_history[i].palyUri == $(this).parent().attr("href")) {
                        console.log(i)
                        bdys_history.splice(i, 1)
                        break;
                    }
                }
                $(this).parent().remove();
                if (bdys_history.length == 0) {
                    $('#historyModal div.divide-y-2').text("暂无推送记录")
                }
                console.log(JSON.stringify(bdys_history))
                localStorage.setItem('bdys_history', JSON.stringify(bdys_history));
            });
            $('#historyModal button.btn.btn-danger').click(function () {
                bdys_history = [];
                localStorage.setItem('bdys_history', JSON.stringify(bdys_history));
                $('#historyModal div.divide-y-2 a').remove();
                $('#historyModal div.divide-y-2').text("暂无推送记录")
                $('#pathModal').remove();
            });
            $('#historyModal button.btn-close').click(function () {
                $('#historyModal').remove();
            });
            $('#historyModal button.btn.btn-primary').click(async function () {
                $('#historyModal').remove();
            });
        })

        //功能设置按钮 功能设置
        $('div.container-xl #function_submit').click(function () {
            $('body').append(`<div class="modal modal-blur fade show" id="functionModal" tabindex="-1" role="dialog" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content"> <div class="modal-header">
            <h5 class="modal-title">功能设置</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div>
            <div class="modal-body">
            <div class="col-auto mt-2">
            <label class="form-check form-check-inline form-switch m-0">
            <input class="form-check-input" id="plugin" type="checkbox">
            <span class="form-check-label">未开启追剧模式-功能开发中</span> </label>  </div>
            追剧模式仅适配剧集 全剧下载 按钮，开启后保存剧集推送记录，检测到任务已存在直接跳过。若需重复下载可以使用 单集下载 按钮或 点击 记录设置 按钮 删除失败记录！！！未开启追剧模式，重复 全剧下载 会重复下载已成功剧集</div>
            <div class="modal-footer">
            <button type="button" class="btn btn-primary">确定</button> </div> </div> </div> </div>`);
            /*             update = localStorage.getItem('bdys_update');
            if (update == 1) {
                $('#functionModal input#plugin.form-check-input').prop("checked", true);
                $('#functionModal .form-check-label').text("已开启追剧模式")

            } else {
                $('#functionModal input#plugin.form-check-input').prop("checked", false)
            }

            $('#functionModal input#plugin.form-check-input').click(function () {
                if ($(this).is(":checked")) {
                    //console.log("checked")
                    $('#functionModal .form-check-label').text("已开启追剧模式")
                    update = 1
                } else {
                    //console.log("unchecked")
                    $('#functionModal .form-check-label').text("未开启追剧模式")
                    update = 0
                    localStorage.setItem('bdys_updating', '{}');
                }
                localStorage.setItem('bdys_update', update);
            })
            */
            $('#functionModal button.btn-close').click(function () {
                $('#functionModal').remove();
            });
            $('#functionModal button.btn.btn-primary').click(async function () {
                $('#functionModal').remove();
            });
        })
    }

    //电视剧、电影页面解析
    async function bdysParser(vod_name, url, type, count, title, playList) {
        let doc;
        let responsedata;
        let info = [];
        let info2;
        let ninHistory = [];
        let name;
        let palyUrl;
        let palyUri;
        let m3u8Urls = [];
        let pid;

        Notiflix.Notify.info('正在解析：' + vod_name)
        log("log", "bdysParser_url:" + url);


        if (!count) {
            count = 0;
        };
        if (!title) {
            try {
                await $.ajax({
                    method: "GET",
                    url: url,
                    async: true
                }).done(function (data, textStatus, jqXHR) {
                    responsedata = data
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    log("error", "bdysParser_jqXHR:" + jqXHR);
                    log("error", "bdysParser_textStatus:" + textStatus);
                    log("error", "bdysParser_errorThrown:" + errorThrown);
                });
                if (responsedata) {
                    doc = domparser.parseFromString(responsedata, "text/html");
                    title = doc.querySelector('h1.d-none.d-md-block').textContent;
                    let lx = doc.querySelectorAll("p.mb-0.mb-md-2")[4].textContent;
                    let douban = doc.querySelector('.badge.bg-green-lt').textContent;
                    if (title.match('集全|更至.*集') && lx.match('类型')) {
                        title = title + '_' + lx + (douban !== "豆瓣评分：暂无" ? "_" + douban : "");
                        console.log(title)
                    }
                    playList = doc.querySelectorAll('a.btn.btn-square.me-2');
                }
            } catch (error) {
                if (count < retry) {
                    count++;
                    return await bdysParser(vod_name, url, count, title, playList)
                } else {
                    Notiflix.Notify.failure('解析错误：' + vod_name)
                    log("error", error);
                    return
                }
            }
        }

        log("log", "bdysParser_title:" + title);

        info.push(title);
        info[1] = [];
        if (type == 1) {
            info[2] = 1;
        }

        history = JSON.parse(localStorage.getItem('bdys_history'));
        if (history && historyLimit > 0) {
            if (history.length > historyLimit) {
                history.splice(historyLimit)
            }
        }
        //years = JSON.parse(localStorage.getItem('bdys_years'));
        if (!history) {
            history = [];
        }
        if (!years) {
            years = [];
        }

        log("log", "bdysParser_history:" + JSON.stringify(history));
        log("log", "bdysParser_years:" + JSON.stringify(years));

        let year = info[0].substr(0, 4);

        inHistory.push(title);
        inHistory[1] = [];

        if (url.match("http(s?)://(.*?)/play/")) {
            if (!title.match('\d*集')) {
                vod_name = reSub(title, /&|HD720P|BD720P/);
            }
            pid = await getPid(url, vod_name);
            if (pid == undefined) { return }
            info2 = {
                'name': vod_name,
                'palyUrl': url,
                'pid': pid
            };
            console.log(pid)
            palyUri = url.replace(bdysHost, "")
            let status = 0;
            for (let i in history) {
                if (palyUri == history[i].palyUri) {
                    let inHistory = history[i];
                    history.splice(i, 1);
                    history.unshift(inHistory);
                    status = 1
                    break;
                }
            }
            if (status == 0) {
                ninHistory.push({
                    'name': vod_name.split('_')[0],
                    'palyUri': palyUri,
                });
            }
            console.log(info2)
            info[1].push(info2);
        } else {
            if (years.length == 0 || years.indexOf(year) !== -1) {
                //电视剧解析
                if (title.match('\d*集')) {

                    for (let i = 0; i < playList.length; i++) {
                        name = vod_name + '.' + playList[i].textContent;
                        palyUrl = playList[i].href;
                        palyUri = playList[i].attributes.href.textContent;
                        pid = await getPid(palyUrl, name)
                        if (pid == undefined) { return }
                        info2 = {
                            'name': name,
                            'palyUrl': palyUrl,
                            'palyUri': palyUri,
                            'pid': pid
                        };

                        let status = 0;
                        for (let i in history) {
                            if (palyUri == history[i].palyUri) {
                                if (update != 1) {
                                    let inHistory = history[i];
                                    history.splice(i, 1);
                                    history.unshift(inHistory);
                                }
                                status = 1
                                break;
                            }
                        }
                        if (status == 0) {
                            ninHistory.push({
                                'name': name,
                                'palyUri': palyUri
                            });
                            info[1].push(info2);
                        } else {
                            update = localStorage.getItem('bdys_update');
                            if (update == 1) {
                                inHistory[1].push(info2);
                                Notiflix.Notify.info('已存在于解析记录：' + info2.name);
                                log("log", "infoParser_链接已存在于解析记录，playUrl：" + palyUrl);
                                continue;
                            } else {
                                info[1].push(info2);
                            }
                        }
                    }
                    //追剧自动更新文件夹
                    if (update == 1) {
                        let mid = /.*\/(.*?).htm/.exec(url)[1];
                        console.log(mid)
                        let updating = JSON.parse(localStorage.getItem('bdys_updating'));
                        if (!updating) {
                            updating = {};
                        }
                        console.log(updating[mid])
                        if (updating[mid] && updating[mid] != reSub(title)) {
                            let postData = 'rename,' + bdysHost + '/rename/' + path + '\\' + updating[mid] + '/' + path + '\\' + reSub(title) + '\r\n'
                            console.log(postData)
                            await pushToM3U8Downloader('rename', postData)
                        }
                        if (title.match('更至.*集')) {
                            updating[mid] = reSub(title);
                        } else {
                            delete updating[mid];
                        }
                        localStorage.setItem('bdys_updating', JSON.stringify(updating));
                    }

                }
                else {
                    name = reSub(title, /&|HD720P|BD720P|4K/);
                    palyUrl = playList[playList.length - 1].href;
                    palyUri = playList[playList.length - 1].attributes.href.textContent;
                    pid = await getPid(palyUrl, name)
                    if (pid == undefined) { return }
                    info2 = {
                        'name': name,
                        'palyUrl': palyUrl,
                        'palyUri': palyUri,
                        'pid': pid
                    };

                    let status = 0;
                    for (let i in history) {
                        if (palyUri == history[i].palyUri) {
                            let inHistory = history[i];
                            history.splice(i, 1);
                            history.unshift(inHistory);
                            localStorage.setItem('bdys_history', JSON.stringify(history));
                            status = 1
                            break;
                        }
                    }
                    if (status == 0) {
                        ninHistory.push({
                            'name': name.split('-')[0],
                            'palyUri': palyUri
                        });
                        log("log", "bdysParser_ninHistory:" + name + JSON.stringify(ninHistory));
                    }
                    info[1].push(info2)
                }
            }
            else {
                log("info", "bdysParser_已使用年份过滤");
                return
            }
            //log("log", "bdysParser_info:" + JSON.stringify(info));
        }
        await infoParser(info, ninHistory);
    }

    async function infoParser(info, ninHistory) {
        let status;
        if (info[1].length > 0) {
            log("log", "infoParser_info:" + JSON.stringify(info));

            let postData = [];
            let mp4Urls = [];
            path = localStorage.getItem('bdys_path');

            if (info[2] == 1 || info[1].length > 1) {
                path = path + '\\' + reSub(info[0], "", "&4K", "")

            };
            postData.push("#OUT," + path);

            for (let i = 0; i < info[1].length; i++) {
                //let palyUrl = info[1][i].palyUrl;
                let url = bdysHost + "/pid/" + info[1][i].pid;
                let file_name = reSub(info[1][i].name, "", " ", "") + ".mp4";
                postData.push(file_name + "," + url)
                log("log", "infoParser_path:" + path);
                log("log", "infoParser_file_name:" + file_name);
                log("log", "infoParser_m3u8Url:" + url);
            }

            if (postData.length > 1) {
                status = await pushToM3U8Downloader(info[0], postData.join("\r\n"))
                if (status == 1) {
                    log("log", "infoParser_ninHistory:" + JSON.stringify(ninHistory));
                    history = ninHistory.concat(history);

                    //log("log", "infoParser_history:"+history);
                    //log("log", "infoParser_playCodes:"+playCodes);

                    localStorage.setItem('bdys_history', JSON.stringify(history));
                    Notiflix.Notify.success('推送成功：' + info[0])
                    log("log", "infoParser_下载任务推送成功");
                } else {
                    log("error", "infoParser_下载任务推送失败");
                }
            }

            /*
            if(inHistory[1].length>0){
                Notiflix.Confirm.show(
                    'infoParser',
                    '检测到有链接已存在于历史记录，是否重新下载？',
                    '确定',
                    '取消',
                    async function okCb() {
                        for(let i = 0;i<inHistory[1].length;i++){
                            let palyUrl = inHistory[1][i].palyUrl
                            let vod_url = /\/play\/(.*?).htm/.exec(palyUrl)[1]
                            let index = history.indexOf(vod_url)
                            history.splice(index,1)
                        }
                        localStorage.setItem('bdys_history',JSON.stringify(history));
                        return await infoParser(inHistory)
                    },
                    function cancelCb() {
                    },
                    {
                        width: '400px',
                        borderRadius: '8px',
                        // etc...
                    },
                );
            }
            */
        }
    }

    async function getPid(url, name) {
        let doc;
        let responsedata;
        let pid;
        let count = 0;

        try {
            await $.ajax({
                method: "GET",
                url: url,
                async: true
            }).done(function (data, textStatus, jqXHR) {
                responsedata = data
                doc = domparser.parseFromString(responsedata, "text/html");
                pid = /var pid = (.*?);/.exec(responsedata)[1];
                Notiflix.Notify.success('获取成功：' + name)
            }).fail(function (jqXHR, textStatus, errorThrown) {

                //log("error", "bdysParser_jqXHR:" + jqXHR);
                //log("error", "bdysParser_textStatus:" + textStatus);
                //log("error", "bdysParser_errorThrown:" + errorThrown);
                window.location.href = url
            });
        } catch (error) {
            console.log(error)
        }
        return pid
    }

    //检查m3u8下载器是否运行
    async function checkM3U8Downloader(status) {

        try {
            await $.ajax({
                method: "GET",
                url: M3U8DownloaderHost + '/info',
                timeout: 500,
                async: true
            }).done(function (msg) {
                //log("log", "checkM3U8Downloader_M3U8下载器后台连接成功");
                //log("log", "checkM3U8Downloader_msg:" + JSON.stringify(msg));
                status = 1
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //log("error", "checkM3U8Downloader_M3U8下载器后台连接失败");
                //log("error", "checkM3U8Downloader_jqXHR:" + jqXHR);
                //log("error", "checkM3U8Downloader_textStatus:" + textStatus);
                //log("error", "checkM3U8Downloader_errorThrown:" + errorThrown);
                status = 0
            });
        } catch (error) {
            //log("error", "checkM3U8Downloader_M3U8下载器后台连接失败");
            //log("error", error);
            status = 0
        }
        return status
    }

    //推送下载链接到m3u8下载器
    async function pushToM3U8Downloader(name, datastr) {
        let status;

        log("log", "pushToM3U8Downloader_datastr:" + datastr);

        //return 1
        var postdata = {
            "data": datastr,
            "type": '2' //模式2
        };
        try {
            await $.ajax({
                method: "POST",
                url: M3U8DownloaderHost,
                data: postdata
            }).done(function (msg) {
                log("log", "pushToM3U8Downloader_msg:" + JSON.stringify(msg));
                status = 1
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Notiflix.Notify.failure('推送失败：' + name)
                log("error", "pushToM3U8Downloader_jqXHR:" + jqXHR);
                log("error", "pushToM3U8Downloader_textStatus:" + textStatus);
                log("error", "pushToM3U8Downloader_errorThrown:" + errorThrown);
                status = 0
            });
        } catch (error) {
            Notiflix.Notify.failure('推送错误：请检查M3U8下载器是否正常运行')
            log("error", error);
            status = 0
        }
        return status
    }

    function checkPath() {
        if (!path) {
            if (localStorage.getItem('bdys_path')) {
                path = localStorage.getItem('bdys_path');
                update = localStorage.getItem('bdys_update')
            }
        }
        if (path) {
            return 1
        } else {
            return 0
        }
    }

    async function checkStatus() {

        if (!checkPath()) {
            Notiflix.Report.failure('检测到下载目录未设置', '请点击 目录设置 按钮设置目录后刷新网页', '确定');
            return 0
        }
        if (M3U8DownloaderStatus != 1) {
            Notiflix.Report.failure('M3U8下载器后台连接失败',
                '请确认 M3U8下载器 正常运行后,刷新网页重试',
                '确认',
                () => {
                    //location.reload();
                });
            return 0
        }
        return 1
    }

    function reSub(text, regex, o, n) {
        if (!regex) {
            regex = /[\\/:*?"<>|]/;
        }
        while (text.match(regex)) {
            text = text.replace(regex, '');
        };
        return text.replaceAll(o, n)
    }

    function log(type, text) {
        if (debug === "debug") {
            if (type === "log") {
                console.log(text);
            } else if (type === "error") {
                console.error(text);
            }
        }
    }

    function wait(timeoutms) {
        return new Promise((resolve, reject) => {
            function check() {
                if ((timeoutms -= 100) < 0) {
                    resolve()
                }
                else {
                    setTimeout(check, 100)
                }
            }
            setTimeout(check, 100)
        });
    }


    main()

    //关闭提示信息和广告
    async function closeAd() {
        var t = new Date();
        t.setDate(t.getDate() + 2);
        t.setHours(0);
        t.setMinutes(0);
        t.setSeconds(0);
        if (!$.cookie("read")) {
            $.cookie('read', true, {
                expires: t,
                path: '/'
            });
            $.cookie('closeAd', true, { expires: t, path: '/' });
            location.reload()
        }

        $.cookie('read', true, {
            expires: t,
            path: '/'
        });
        $.cookie('closeAd', true, { expires: t, path: '/' });
    }

    function tips() {
        if (debug === "debug") {
            var vConsole = new VConsole();
        }
        Notiflix.Notify.init({
            width: '380px',
            fontSize: "16px",
            plainText: false,
            //showOnlyTheLastOne: true,
            clickToClose: true,
            timeout: 5000
        });
        Notiflix.Report.init();
        Notiflix.Confirm.init();
    }


    // Your code here...
})();