// ==UserScript==
// @name         哔嘀影视解析下载（m3u8）
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  获取哔嘀影视在线播放链接，然后推送至M3U8批量下载器下载
// @author       zsandianv
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/notiflix@3.2.4/dist/notiflix-aio-3.2.4.min.js
// @require      https://cdn.jsdelivr.net/npm/growl-notification@1.0.0/dist/growl-notification.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/blueimp-md5/2.18.0/js/md5.min.js
// @icon         https://www.bdys01.com/images/favicon.png
// @match        *://www.bdys01.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.bdys01.com

// @downloadURL https://update.greasyfork.org/scripts/448086/%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%EF%BC%88m3u8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/448086/%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%EF%BC%88m3u8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let URL = window.location.href;
    let domparser = new DOMParser();
    let path;
    let years = [];
    let history = [];
    let playCodes = [];
    let inHistory = [];
    let debug = 'debug';
    let retry = 5;
    //M3U8批量下载器后台地址
    let M3U8DownloaderHost = "http://127.0.0.1:8787";
    //Aria后台地址
    let MotrixHost = 'http://127.0.0.1:16800/jsonrpc';
    let bdysHost = 'https://www.bdys01.com';
    let M3U8DownloaderStatus;
    let checkPathStatus;

    async function main() {
        //匹配链接
        if (URL.match(bdysHost)) {

            //首页添加本页下载按钮
            //$('div.btn-list:eq(0) .d-sm-inline').before('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 本页下载 </button>');
            //添加首页 全部下载按钮
            $('div.btn-list .d-sm-inline').before('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 全部下载 </button>');
            //添加首页、分类页面电视剧、电影 下载按钮
            $('div.card.card-sm.card-link div.card-body').not('.player').append('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 1080P下载 </button>');
            //屏蔽多余按钮
            $('div#yalayi.row.row-cards #btn_submit').hide()
            $('div#related.row.row-cards #btn_submit').hide()
            //添加分类页面 本页下载按钮
            $('div.card-body.all-filter-wrapper dd:last').append('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 本页下载 </button>');
            //添加 电视剧、电影详情页面 下载按钮
            $('h3.card-title:eq(1)').not('.text-truncate').append('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 1080P下载 </button>');
            //添加播放页面 下载按钮
            $('div.card-footer h2').append('<button class="btn btn-square me-2" type="submit" id="btn_submit"> 下载 </button>');
            //添加 记录设置按钮
            $('div.navbar-nav.flex-row.order-md-last').prepend('<button class="btn btn-square me-2" type="submit" id="history_submit"> 记录设置 </button>');
            //添加 年份设置按钮
            $('div.navbar-nav.flex-row.order-md-last').prepend('<button class="btn btn-square me-2" type="submit" id="years_submit"> 年份设置 </button>');
            //添加 目录设置按钮
            $('div.navbar-nav.flex-row.order-md-last').prepend('<button class="btn btn-square me-2" type="submit" id="path_submit"> 目录设置 </button>');

            //检测M3U8下载器是否运行
            M3U8DownloaderStatus = await checkM3U8Downloader();
            //检查下载目录是否设置
            checkPathStatus = checkPath();

            log("log", "main_解析插件加载成功");
            log("log", "main_M3U8DownloaderStatus:" + M3U8DownloaderStatus);
            log("log", "main_checkPathStatus:" + checkPathStatus);

            //首页 全部下载按钮 功能设置
            for (let i = 0; i < $('div.btn-list #btn_submit').length; i++) {
                $('div.btn-list #btn_submit:eq(' + i + ')').click(async function () {
                    if (!checkPathStatus) {
                        Notiflix.Report.failure('检测到下载目录未设置', '请点击 目录设置 按钮设置目录后刷新网页', '确定');
                        return
                    }
                    if (!M3U8DownloaderStatus) {
                        Notiflix.Report.failure('M3U8下载器后台连接失败', '请确认M3U8下载器正常运行后刷新网页重试', '确定');
                        return
                    }
                    $('div.btn-list #btn_submit:eq(' + i + ')')[0].disabled = true;

                    let list = $('div.container:eq(' + i + ') .d-block');
                    for (let i = 0; i < list.length; i++) {
                        let url = list[i].href;
                        let vod_name = list[i].title;
                        await bdysParser(vod_name, url);
                    };
                });
            };

            //首页、分类页面电视剧、电影 下载按钮 功能设置
            for (let i = 0; i < $('div.card.card-sm.card-link').length; i++) {
                $('div.card.card-sm.card-link:eq(' + i + ') #btn_submit').click(async function () {
                    if (!checkPathStatus) {
                        Notiflix.Report.failure('检测到下载目录未设置', '请点击 目录设置 按钮设置目录后刷新网页', '确定');
                        return
                    }
                    if (!M3U8DownloaderStatus) {
                        Notiflix.Report.failure('M3U8下载器后台连接失败', '请确认M3U8下载器正常运行后刷新网页重试', '确定');
                        return
                    }
                    $('div.card.card-sm.card-link:eq(' + i + ') #btn_submit')[0].disabled = true;

                    let url = $('div.card.card-sm.card-link:eq(' + i + ') .d-block')[0].href;
                    let vod_name = $('div.card.card-sm.card-link:eq(' + i + ') .card-title')[0].outerText;
                    await bdysParser(vod_name, url);
                });
            };

            //分类页面 本页下载按钮 功能设置
            $('div.card-body.all-filter-wrapper #btn_submit').click(async function () {
                if (!checkPathStatus) {
                    Notiflix.Report.failure('检测到下载目录未设置', '请点击 目录设置 按钮设置目录后刷新网页', '确定');
                    return
                }
                if (!M3U8DownloaderStatus) {
                    Notiflix.Report.failure('M3U8下载器后台连接失败', '请确认M3U8下载器正常运行后刷新网页重试', '确定');
                    return
                }
                $('div.card-body.all-filter-wrapper #btn_submit')[0].disabled = true;

                for (let i = 0; i < $('div.card.card-sm.card-link').length; i++) {
                    let url = $('div.card.card-sm.card-link:eq(' + i + ') .d-block')[0].href;
                    let vod_name = $('div.card.card-sm.card-link:eq(' + i + ') .card-title')[0].outerText;
                    await bdysParser(vod_name, url);
                }
            });

            //电视剧、电影详情页 下载按钮 功能设置
            $('h3.card-title:eq(1) #btn_submit').click(async function () {
                if (!checkPathStatus) {
                    Notiflix.Report.failure('检测到下载目录未设置', '请点击 目录设置 按钮设置目录后刷新网页', '确定');
                    return
                }
                if (!M3U8DownloaderStatus) {
                    Notiflix.Report.failure('M3U8下载器后台连接失败', '请确认M3U8下载器正常运行后刷新网页重试', '确定');
                    return
                }
                $('h3.card-title:eq(1) #btn_submit')[0].disabled = true;

                let title = $('h1.d-none.d-md-block').text();
                let playList = $('a.btn.btn-square.me-2');
                let vod_name = /《(.*?)》/.exec(title)[1];
                await bdysParser(vod_name, URL, 0, title, playList);
            })

            //播放页面 下载按钮 功能设置
            $('div.card-footer h2 #btn_submit').click(async function () {
                if (!checkPathStatus) {
                    Notiflix.Report.failure('检测到下载目录未设置', '请点击 目录设置 按钮设置目录后刷新网页', '确定');
                    return
                }
                if (!M3U8DownloaderStatus) {
                    Notiflix.Report.failure('M3U8下载器后台连接失败', '请确认M3U8下载器正常运行后刷新网页重试', '确定');
                    return
                }
                $('div.card-footer h2 #btn_submit')[0].disabled = true;

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
                await bdysParser(vod_name, URL, 0, vod_name);
            });

            //记录设置按钮 功能设置
            $('div.container-xl #history_submit').click(function () {
                Notiflix.Report.success(
                    '记录设置',
                    '功能开发中',
                    '确认',
                );
            });

            //目录设置按钮 功能设置
            $('div.container-xl #path_submit').click(function () {
                Notiflix.Confirm.prompt(
                    '哔嘀影视解析下载',
                    '请输入下载目录：',
                    path,
                    '确认',
                    '取消',
                    (clientAnswer) => {
                        path = clientAnswer;
                        log("log", "main_path:" + path);
                        var regex = /^[a-zA-Z]:(((\\(?! )[^/:*?<>\""|\\]+)+\\?)|(\\)?)\s*$/;
                        if (regex.test(path)) {
                            localStorage.setItem('btbdys_path', path);
                            Notiflix.Report.success(
                                '目录设置成功',
                                '请点击 确认 按钮刷新网页',
                                '确定',
                                () => {
                                    location.reload();
                                },
                            );
                        } else {
                            Notiflix.Report.failure('目录设置失败', '请检查输入目录格式是否正确，例如：D:\Downloads', '确定');
                        }

                    },
                    (clientAnswer) => { },
                );
            });

            //年份设置按钮 功能设置
            $('div.container-xl #years_submit').click(function () {
                Notiflix.Confirm.prompt(
                    '哔嘀影视解析下载',
                    '请输入限制年份：',
                    '',
                    '确认',
                    '取消',
                    (clientAnswer) => {
                        if (clientAnswer) {
                            years = clientAnswer.split(',');
                            log("log", "main_years:" + years);
                            localStorage.setItem('btbdys_years', JSON.stringify(years));
                        }
                    },
                    (clientAnswer) => { },
                );
            });
        }
        //不支持的链接
        else {
            console.log(URL)
        };
    }

    //电视剧、电影页面解析
    async function bdysParser(vod_name, url, count, title, playList) {
        let doc;
        let responsedata;
        let info = [];
        let info2;
        let name;
        let palyUrl;
        let palyUri;
        let m3u8Urls = [];
        let type = 0;

        log2('bdysParser', 'info', '正在解析：' + vod_name);
        //Notiflix.Notify.info('bdysParser<br/>正在解析：' + vod_name)
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
                    playList = doc.querySelectorAll('a.btn.btn-square.me-2');
                }
            } catch (error) {
                if (count < retry) {
                    //Notiflix.Notify.warning('bdysParser<br/>' + vod_name + '：解析失败，正在重试')
                    log2('bdysParser', 'warning', vod_name + '：解析失败，正在重试');
                    count++;
                    return await bdysParser(vod_name, url, count, title, playList)
                } else {
                    //Notiflix.Notify.failure('bdysParser<br/>' + vod_name + '：解析错误')
                    log2('bdysParser', 'error', vod_name + '：解析错误');
                    log("error", error);
                    return
                }
            }
        }

        log("log", "bdysParser_title:" + title);

        info.push(title);
        info[1] = [];

        history = JSON.parse(localStorage.getItem('btbdys_history'));
        years = JSON.parse(localStorage.getItem('btbdys_years'));
        if (!history) {
            history = [];
        }
        if (!years) {
            years = [];
        }

        log("log", "bdysParser_history:" + JSON.stringify(history));
        log("log", "bdysParser_years:" + JSON.stringify(years));

        let year = info[0].substr(0, 4);
        if (url.match("http(s?)://(.*?)/play/")) {
            type = 1;
            info2 = {
                'name': vod_name,
                'm3u8Url': '',
                'palyUrl': url
            };
            info[1].push(info2);
        } else {
            if (years.length == 0 || years.indexOf(year) !== -1) {
                //电视剧解析
                if (title.match('集全|更至.*集')) {

                    for (let i = 0; i < playList.length; i++) {
                        name = vod_name + '.' + playList[i].textContent;
                        palyUri = playList[i].attributes.href.textContent;
                        info2 = {
                            'name': name,
                            'm3u8Url': '',
                            'palyUrl': palyUri
                        };
                        info[1].push(info2);
                    }
                    //追剧自动更新文件夹
                    let mid = /.*\/(.*?).htm/.exec(url)[1];
                    console.log(mid)
                    let updating = JSON.parse(localStorage.getItem('btbdys_updating'));
                    if (!updating) {
                        updating = {};
                    }
                    console.log(updating[mid])
                    if (updating[mid] && updating[mid] != reSub(title)) {
                        let postData = 'rename,'+bdysHost+'/rename/' + path + '\\' + updating[mid] + '/' + path + '\\' + reSub(title) + '\r\n'
                        console.log(postData)
                        await pushToM3U8Downloader('rename', postData)
                    }
                    if (title.match('更至.*集')) {
                        updating[mid] = reSub(title);
                    } else {
                        delete updating[mid];
                    }
                    localStorage.setItem('btbdys_updating', JSON.stringify(updating));
                }
                //电影解析
                else {
                    name = reSub(title, /&|HD720P|BD720P/);
                    if (playList.length > 1) {
                        palyUri = playList[playList.length - 1].attributes.href.textContent;
                    } else {
                        palyUri = playList[0].attributes.href.textContent;
                    }
                    info2 = {
                        'name': name,
                        'm3u8Url': '',
                        'palyUrl': palyUri
                    };
                    info[1].push(info2)
                };
            }
            else{
                log2('bdysParser','error','已使用年份过滤');
                log("info", "bdysParser_已使用年份过滤");
                return
            }
        }


        playCodes = [];

        inHistory.push(title);
        inHistory[1] = [];

        let s = url.split('/');
        s = s.slice(0, s.length - 1);
        let indexs = [];
        for (let i = 0; i < info[1].length; i++) {
            palyUrl = info[1][i].palyUrl;
            if (palyUrl.indexOf('https') == -1) {
                if (palyUrl.indexOf('/') > 3) {
                    palyUrl = s.join('/') + palyUrl.replaceAll('.', '')
                } else {
                    palyUrl = bdysHost + palyUrl
                }
                info[1][i].palyUrl = palyUrl;
            }
            let playCode = /\/play\/(.*?).htm/.exec(palyUrl)[1];
            info[1][i].playCode = playCode;
            log("log", "infoParser_playCode：" + playCode);
            let index = history.indexOf(playCode);
            if (index == -1) {
                m3u8Urls = await m3u8Parser(palyUrl);
                playCodes.push(playCode);
            } else {
                if (type == 1) {
                    m3u8Urls = await m3u8Parser(palyUrl);
                } else {
                    indexs.push(i);
                    inHistory[1].push(info[1][i]);
                    log2('infoParser', 'error', info[1][i].name + '：已存在于解析记录');
                    log("log", "infoParser_链接已存在于解析记录，playUrl：" + palyUrl);
                    continue;
                }
            }

            if (m3u8Urls.length > 0) {
                for (let i in m3u8Urls) {
                    m3u8Urls[i] = reSub(m3u8Urls[i], /\\/, "www.bde4.cc", "www.btbdys.com");
                    //m3u8Urls[i] = reSub(m3u8Urls[i], /\\/);
                }
                info[1][i].m3u8Url = m3u8Urls[0];
                log2('bdysParser', 'success', info[1][i].name + '：解析成功');
                //Notiflix.Notify.success('bdysParser<br/>' + info[1][i].name + '：解析成功')
            } else {
                log2('bdysParser', 'error', info[1][i].name + '：获取m3u8Url失败');
                //Notiflix.Notify.failure('bdysParser<br/>' + info[1][i].name + '：获取m3u8Url失败')
                log("error", "bdysParser_获取m3u8Url失败");
                log("error", "bdysParser_name:" + info[1][i].name);
                log("error", "bdysParser_palyUrl:" + info[1][i].palyUrl);
                return
            }
        }
        for(let i=0;i<indexs.length;i++){
            info[1].splice(indexs[i],1);
        }
        //log("log", "bdysParser_info:" + JSON.stringify(info));
        await infoParser(info)
    }

    //解析播放页面，获取m3u8播放链接
    async function m3u8Parser(url, count) {
        let m3u8;
        let m3u8_2;
        let url3;
        let pid;
        let m3u8Urls = [];
        let responsedata;
        log("log", "m3u8Parser_url:" + url)

        if (!count) {
            count = 0;
        }
        if (url == URL) {
            responsedata = $('head')[0].innerText
            /*             m3u8 = window.m3u8;
            m3u8_2 = window.m3u8_2;
            url3 = window.url3;
            pid = window.pid;
            console.log(pid)
            console.log(url3)
            if(m3u8_2){
                if (',' in m3u8_2) {
                    m3u8_2 = m3u8_2.split(',');
                }
            } */
        } else {
            try {
                await $.ajax({
                    method: "GET",
                    url: url,
                    async: true
                }).done(function (data, textStatus, jqXHR) {
                    responsedata = data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    log("error", "jqXHR:" + jqXHR);
                    log("error", "textStatus:" + textStatus);
                    log("error", "errorThrown:" + errorThrown);
                });
            } catch (error) {
                if (count < retry) {
                    //Notiflix.Notify.warning('m3u8Parser_m3u8链接获取失败，正在重试')
                    //log2('m3u8Parser','warning','m3u8链接获取失败，正在重试')
                    count++
                    return await m3u8Parser(url, count)
                } else {
                    //Notiflix.Notify.failure('m3u8Parser_m3u8链接获取失败')
                    //log2('m3u8Parser','error','m3u8链接获取错误')
                    log("error", error);
                }
            }
        }
        if (responsedata) {
            if (responsedata.match('var m3u8_2 =')) {
                m3u8 = /var m3u8 = "(.*?)";/.exec(responsedata);
                m3u8_2 = /var m3u8_2 = "(.*?)";/.exec(responsedata);
                url3 = /var url3 = "(.*?)";/.exec(responsedata);
                pid = /var pid = (.*?);/.exec(responsedata)[1];
            }
        }
        //默认优先使用 m3u8_2 中的链接
        if(url3){
            m3u8Urls.push(url3[1])
        }
        if (m3u8_2) {
            m3u8_2 = m3u8_2[1].split(',');
            if (m3u8_2[0]) {
                for (let i in m3u8_2) {
                    m3u8Urls.push(m3u8_2[i]);
                }
            }
        }
        if (m3u8) {
            m3u8Urls.push(m3u8[1])
        }
        if(m3u8Urls.length == 0){
            console.log(pid)
            var url2 = await getUrl(666, pid)
            if(url2){
                console.log(url2)
                m3u8Urls.push(url2)
            }

        }

        log("log", "m3u8Parser_m3u8Url:" + JSON.stringify(m3u8Urls))
        return m3u8Urls
    }

    async function infoParser(info) {
        let status;
        if (info.length == 2 & info[1].length > 0) {
            log("log", "infoParser_info:" + JSON.stringify(info));

            let postData = [];
            let mp4Urls = [];
            path = localStorage.getItem('btbdys_path');

            if (info[1].length > 1 && path) {
                path = path + '\\' + reSub(info[0])

            };
            postData.push("#OUT," + path);

            for (let i = 0; i < info[1].length; i++) {
                let m3u8Url = info[1][i].m3u8Url;
                let file_name = reSub(info[1][i].name);
                if(m3u8Url.match("http(s?):.*?\\.mp4")){
                    status = await pushToMotrix(info[0],m3u8Url,path,file_name)
                    if (status == 1) {
                        history.push(info[1][i].playCode);

                        //log("log", "infoParser_history:"+history);
                        //log("log", "infoParser_playCodes:"+playCodes);

                        localStorage.setItem('btbdys_history', JSON.stringify(history));
                        //Notiflix.Notify.success('infoParser<br/>' + info[0] + '：下载任务推送成功')
                        log2('infoParser', 'success', file_name + '：下载任务推送成功');
                        log("log", "infoParser_下载任务推送成功");
                    } else {
                        log("error", "infoParser_下载任务推送失败");
                    }
                }else(
                    postData.push(file_name + "," + m3u8Url)
                )
                log("log", "infoParser_path:" + path);
                log("log", "infoParser_file_name:" + file_name);
                log("log", "infoParser_m3u8Url:" + m3u8Url);
            }

            if (postData.length > 1) {
                status = await pushToM3U8Downloader(info[0], postData.join("\r\n"))
                if (status == 1) {
                    history = history.concat(playCodes);

                    //log("log", "infoParser_history:"+history);
                    //log("log", "infoParser_playCodes:"+playCodes);

                    localStorage.setItem('btbdys_history', JSON.stringify(history));
                    //Notiflix.Notify.success('infoParser<br/>' + info[0] + '：下载任务推送成功')
                    log2('infoParser', 'success', info[0] + '：下载任务推送成功');
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
                        localStorage.setItem('btbdys_history',JSON.stringify(history));
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

    //检查m3u8下载器是否运行
    async function checkM3U8Downloader(status) {
        try {
            await $.ajax({
                method: "GET",
                url: M3U8DownloaderHost + '/info',
                async: true
            }).done(function (msg) {
                log("log", "checkM3U8Downloader_M3U8下载器后台连接成功");
                log("log", "checkM3U8Downloader_msg:" + JSON.stringify(msg));
                status = 1
            }).fail(function (jqXHR, textStatus, errorThrown) {
                log("error", "checkM3U8Downloader_M3U8下载器后台连接失败");
                log("error", "checkM3U8Downloader_jqXHR:" + jqXHR);
                log("error", "checkM3U8Downloader_textStatus:" + textStatus);
                log("error", "checkM3U8Downloader_errorThrown:" + errorThrown);
                status = 0
            });
        } catch (error) {
            log("error", "checkM3U8Downloader_M3U8下载器后台连接失败");
            log("error", error);
            status = 0
        }
        return status
    }

    //推送下载链接到m3u8下载器
    async function pushToM3U8Downloader(name, datastr) {
        let status;

        log("log", "pushToM3U8Downloader_datastr:" + datastr);
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
                //Notiflix.Notify.success('pushToM3U8Downloader_推送成功')
                //log2('pushToM3U8Downloader','success',name+'：推送成功')
                status = 1
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //Notiflix.Notify.failure('pushToM3U8Downloader<br/>' + name + '：推送失败')
                log2('pushToM3U8Downloader', 'error', name + '：推送失败');
                log("error", "pushToM3U8Downloader_jqXHR:" + jqXHR);
                log("error", "pushToM3U8Downloader_textStatus:" + textStatus);
                log("error", "pushToM3U8Downloader_errorThrown:" + errorThrown);
                status = 0
            });
        } catch (error) {
            //Notiflix.Notify.failure('pushToM3U8Downloader<br/>' + name + '：推送错误 - 请检查M3U8下载器是否正常运行')
            log2('pushToM3U8Downloader', 'error', '推送错误：请检查M3U8下载器是否正常运行');
            log("error", error);
            status = 0
        }
        return status
    }

    //推送下载链接到Motrix
    async function pushToMotrix(name, url,path,file_name) {
        let status;

        log("log", "pushToMotrix_name:" + name);
        log("log", "pushToMotrix_url:" + url);
        log("log", "pushToMotrix_path:" + path);
        var postdata = {"jsonrpc":"2.0","method":"aria2.addUri","id":"bdys01","params":[[url],{"dir": path,"out":file_name+".mp4","max-connection-per-server": "8"}]};;
        try {
            await $.ajax({
                method: "POST",
                url: MotrixHost,
                data: JSON.stringify(postdata),
            }).done(function (msg) {
                log("log", "pushToMotrix_msg:" + JSON.stringify(msg));
                //Notiflix.Notify.success('pushToMotrix_推送成功')
                //log2('pushToMotrix','success',name+'：推送成功')
                status = 1
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //Notiflix.Notify.failure('pushToMotrix<br/>' + name + '：推送失败')
                log2('pushToMotrix', 'error', name + '：推送失败');
                log("error", "pushToMotrix_jqXHR:" + jqXHR);
                log("error", "pushToMotrix_textStatus:" + textStatus);
                log("error", "pushToMotrix_errorThrown:" + errorThrown);
                status = 0
            });
        } catch (error) {
            //Notiflix.Notify.failure('pushToMotrix<br/>' + name + '：推送错误 - 请检查M3U8下载器是否正常运行')
            log2('pushToMotrix', 'error', '推送错误：请检查M3U8下载器是否正常运行');
            log("error", error);
            status = 0
        }
        return status
    }

    function checkPath() {
        if (!path) {
            path = localStorage.getItem('btbdys_path');
        }
        log("log", "checkPath_path:" + path);
        if (path) {
            return 1
        } else {
            return 0
        }
    }

    function reSub(text, regex, o, n) {
        if (!regex) {
            regex = /[\\/:*?"<>|]/;
        }
        while (text.match(regex)) {
            text = text.replace(regex, '');
        };
        return text.replace(o, n)
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

    function log2(title, type, description) {
        try {
            GrowlNotification.notify({
                title: title,
                description: description,
                type: type,
                position: 'top-right',
                showProgress: true,
                closeTimeout: 10000
            });
        } catch { }
    }

    tips()
    main()

    function tips() {

        let head = document.getElementsByTagName("head")[0];
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://cdn.jsdelivr.net/npm/growl-notification@1.0.0/dist/colored-theme.min.css";
        head.appendChild(link);
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/growl-notification@1.0.0/dist/growl-notification.min.js";
        head.appendChild(script);
        Notiflix.Notify.init({
            width: '380px',
            fontSize: "16px",
            plainText: false,
            //showOnlyTheLastOne: true,
            timeout: 10000
        });
        Notiflix.Report.init();
        Notiflix.Confirm.init();

    }


    function base64ToHex(str) {

        const base64 = atob(str);
        let result = '';
        for (let i = 0;i < base64.length;i++) {
            const hex = base64.charCodeAt(i).toString(16);
            result += hex.length=== 2 ? hex : '0'+ hex;
        }
        return result.toUpperCase();
    }
    async function getUrl(code, pid) {

        var tp = new Date().getTime();

        var key = CryptoJS.enc.Utf8.parse(md5(pid + '-' + tp).substring(0, 16));
        var encryptedData = CryptoJS.AES.encrypt(pid + '-' + tp, key, {
            'mode': CryptoJS.mode.ECB,
            'padding': CryptoJS.pad.Pkcs7
        });
        var sg = base64ToHex(encryptedData + '');

        let postdata = 't=' + tp+'&sg='+sg+'&verifyCode=666';
        let loadbt_headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'

        }
        let responsedata = [];
        let url;
        await ajax( 'POST', 'https://www.bdys01.com/god/'+pid, postdata,loadbt_headers )
            .then( response => {
            responsedata = response;
            console.log( responsedata )
        } );
        if ( responsedata.status === 200 ) {
            if(responsedata.responseText.indexOf('?')!==-1){
                url = JSON.parse( responsedata.responseText ).url.replace('?',tp+'.mp4?')
            }else if(responsedata.responseText.indexOf('ftn_handler')!==-1){
                url = JSON.parse( responsedata.responseText ).url.replace('ftn_handler/',tp+'.mp4?rkey=')
        }
        }
        return url
    }

    function ajax(Method, Url, Data, Headers ) {
        let p = new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                url: Url,
                method: Method,
                data: Data,
                headers: Headers,
                //responseType: responseType,
                ontimeout: function() {
                    console.log('ontimeout')
                    reject()
                },
                onerror: function() {
                    console.log('onerror')
                    reject()
                },
                onload: function(response) {
                    console.log('onload')
                    setTimeout(function() {
                        resolve(response);
                    }, 1000);
                }
            });
        })
        return p
    }

    function myGetData(Method, Url, Data, responseType) {
        return new Promise(function(resolve, reject) {
            function attempt() {
                ajax(Method, Url, Data, responseType).then(response => {
                    resolve(response);
                }).catch(function(erro) {
                    console.log('erro' + erro)
                    attempt()
                })
            }
            attempt()
        })
    }

    // Your code here...
})();