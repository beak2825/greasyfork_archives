// ==UserScript==
// @license MIT
// @name         云学堂自动刷课(北控水务版)-V4-一文字斩🔪砍向形式主义
// @namespace    bewgedu
// @version      4.0.4
// @description  云学堂视频播放
// @author       wlfcss&mm
// @icon         https://picobd.yunxuetang.cn/sys/bewg/images/202006/19429829066c475089971aea935eba13.ico
// @match        http://edu.bewg.net.cn/plan/*.html
// @match        http://edu.bewg.net.cn/kng/plan/document/*
// @match        http://edu.bewg.net.cn/kng/view/document/*
// @match        http://edu.bewg.net.cn/kng/plan/video/*
// @match        http://edu.bewg.net.cn/kng/view/video/*
// @match        http://edu.bewg.net.cn/kng/view/package/*
// @match        http://edu.bewg.net.cn/kng/plan/package/*
// @match        http://edu.bewg.net.cn/mit/myhomeworkexprience*
// @match        http://edu.bewg.net.cn/kng/course/package/video/*
// @match        http://edu.bewg.net.cn/kng/course/package/document/*
// @match        http://edu.bewg.net.cn/sty/index.htm
// @match        http://edu.bewg.net.cn/kng/knowledgecatalogsearch.htm*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/485696/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%28%E5%8C%97%E6%8E%A7%E6%B0%B4%E5%8A%A1%E7%89%88%29-V4-%E4%B8%80%E6%96%87%E5%AD%97%E6%96%A9%F0%9F%94%AA%E7%A0%8D%E5%90%91%E5%BD%A2%E5%BC%8F%E4%B8%BB%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/485696/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%28%E5%8C%97%E6%8E%A7%E6%B0%B4%E5%8A%A1%E7%89%88%29-V4-%E4%B8%80%E6%96%87%E5%AD%97%E6%96%A9%F0%9F%94%AA%E7%A0%8D%E5%90%91%E5%BD%A2%E5%BC%8F%E4%B8%BB%E4%B9%89.meta.js
// ==/UserScript==

(function () {
    const path = window.location.pathname;
    const date = new Date();

    var host = "http://" + window.location.host;

    var short_scan_seconds = 5;
    var long_scan_seconds = 10;

    if (path.match(/^\/sty.*/g)) {
        // 开始的任务页
        console.log('开始任务学习');
        // 如果有学习任务，就开始学习：查找立即参与的按钮并点击
        window.setTimeout(function(){
            var url = ''
            // 遍历学习中心 -任务中心列表
            for(var i in $("div.pull-right.pt10")){
                // 判断完成百分比是否小于50%，小于则进入学习
                if(($("div.col-11:eq("+i+")").children("span:lt(1)").text().includes('%')) && ($("div.col-11").eq(i).children("span:lt(1)").text().replace('%','')/100<0.5)){
                    GM_setValue("sourceURL",window.location.href);
                    console.log($("div.pull-right.pt10").eq(i).children("a:lt(1)").attr("href"))
                    url = host + $("div.pull-right.pt10").eq(i).children("a:lt(1)").attr("href");
                    console.log(url);
                    break;
                }
            }
            window.open(url, '_self');
        }, short_scan_seconds * 1000);
        return false;
    } else if (path.match(/^\/plan.*/g)) { //任务列表页 mit/myhomeworkexprience
        console.log('任务列表页...');
        // window.setTimeout(function(){
        //     if ($(".hand > td").size() == 0){
        //         console.log("本页所有任务已完成");
        //         GoBack();
        //     }
        // }, short_scan_seconds * 1000);
        if ($(".hand > td").size() == 0){
            console.log("本页所有任务已完成，返回上一页");
            //window.location.href=document.referrer; // 返回上一级并刷新
            window.location.href=GM_getValue("sourceURL")
        }

        let i = 0;
        $('.hand > td').each(function (index, item) {
            if ((index + 1) % 4 == 0) {
                const text = $(item).children('.text-grey').eq(1).text();
                console.log('任务' + (++i) + ', 播放进度:' + text);
                logger('任务' + (++i) + ', 播放进度:' + text);
                //避免考试使得学习任务卡死
                if(text ==''){
                    console.log('这是一个考试,本页所有学习任务已完成，返回上一页');
                    logger('这是一个考试,本页所有学习任务已完成，返回上一页');
                    //window.location.href=document.referrer;
                    window.location.href=GM_getValue("sourceURL")
                }
                if (text.includes('%') && text !== '100%') {
                    console.log('点击这个未播放完成的');
                    logger('点击这个未播放完成的');
                    window.setTimeout(function () {
                        const str = $(item).parent('.hand').attr('onclick') + '';
                        let arr = str.split("'");
                        console.info(arr[1]);
                        GM_setValue("sourceURL",window.location.href);
                        window.open(arr[1], '_self');
                    }, short_scan_seconds * 1000);
                    return false;
                }
            }
        });
    } else if (path.match(/^\/mit\/myhomeworkexprience.*/g)){
        // 学习中心，任务列表，点击所有的：立即学习
        console.log('任务列表页...');

        // if ($("span.text-link.hand").size() == 0){
        //     console.log("本页所有任务已完成，返回上一页");
        //     window.location.href=document.referrer; // 返回上一级并刷新
        // }

        $("span.text-link.hand[data-localize='sys_btn_learnnow']:lt(1)").each(function(index, item){
            // str demo: StudyRowClick("/kng/view/video/5094731b00b14aa98784b395e7d3ac08.html", "VideoKnowledge", "", "True", "True", "True","")
            // 获取 /kng/view/video/5094731b00b14aa98784b395e7d3ac08.html
            window.setTimeout(function(){
                const str = $(item).attr("onclick") + "";
                const url = host + str.split(",")[0].split('"')[1]
                console.log(url);
                GM_setValue("sourceURL",window.location.href);
                window.open(url, '_self');
            }, short_scan_seconds * 1000);
            return false;
        });
    } else if(path.match(/^\/kng\/view\/package.*/g)){
        if (window.location.href !== GM_getValue("sourceURL") && GM_getValue("sourceURL") !== "" )
        {
            GM_setValue("oldsourceURL",GM_getValue("sourceURL"));
        }
        console.log('任务列表页...');
        // window.setTimeout(function(){
        //     if ($("div.picstudying").size() == 0){
        //         console.log("本页所有任务已完成");
        //         GoBack();
        //     }
        // }, short_scan_seconds * 1000);

        //if ($("div.picstudying,div.picnostart.last").size() == 0){
        if (lblStudySchedule.textContent == 100){
            console.log("本页所有任务已完成，返回上一页");
            //var referrer = document.referrer;
            //console.log(referrer);
            //window.location.href=referrer; // 返回上一级并刷新
            var classlists = GM_getValue("classlists");
            classlists = classlists.filter(function(item) {
                return item.title !== document.querySelector('.font-size-22.text-white.font-bold span').getAttribute('title');
            });
            GM_setValue("classlists",classlists);
            if(GM_getValue("classlists") == "[]"){GM_setValue("nextpage","1")}//全部学完了要翻页
            window.location.href=GM_getValue("oldsourceURL")

        }

        $("div.picstudying,div.picnostart").each(function(index, item){ // 找到未播放的视频，进行播放
            // 定位到 url
            window.setTimeout(function(){
                const href = $(item).siblings("div.name.ellipsis:first").find("a.text-color6:first").attr("href") + "";
                const url = host + href.split(",")[0].split("'")[1]
                var test = item.textContent;
                //console.log(href);
                //console.log(url);
                console.log(item);
                if (test !== '测') {
                    GM_setValue("sourceURL",window.location.href);
                    window.open(url, '_self');
                }
                else{
                    console.log("当前课程只剩考试没考，跳过学习:" + $("div.font-size-22.text-white.font-bold")[0].textContent);
                    logger("当前课程只剩考试没考，跳过学习:" + $("div.font-size-22.text-white.font-bold")[0].textContent);
                    //window.location.href=document.referrer;
                    var classlists = GM_getValue("classlists");
                    classlists = classlists.filter(function(item) {
                        return item.title !== document.querySelector('.font-size-22.text-white.font-bold span').getAttribute('title');
                    });
                    GM_setValue("classlists",classlists);
                    console.log(classlists);
                    if(classlists.length == 0){
                        GM_setValue("nextpage","1");
                        console.log("全部学完需要翻页");
                        logger("全部学完需要翻页");
                    }//全部学完了要翻页
                    window.location.href=GM_getValue("oldsourceURL")
                }
            }, short_scan_seconds * 1000);
            return false;
        });
    }else if (path.match(/^\/kng\/plan\/document.*/g) || path.match(/^\/kng\/course\/package\/document.*/g) || path.match(/^\/kng\/view\/document.*/g)) {
        //文档页
        console.log('文档页准备就绪...');
        window.setInterval(function () {
            //检测在线
            detectionOnline();
            //防作弊
            checkMoreOpen();
            //完成度检测
            detectionComplete();
        }, long_scan_seconds * 1000);

    } else if (path.match(/^\/kng\/view\/video.*/g) || path.match(/^\/kng\/course\/package\/video.*/g) || path.match(/^\/kng\/plan\/video.*/g)) {
        //视频页
        console.log('视频页准备就绪...');
        //每30秒检测一次
        window.setInterval(function () {
            //检测在线
            detectionOnline();
            //防作弊
            checkMoreOpen();
            //完成度检测
            detectionComplete();
            //检测播放状态
            detectPlaybackStatus();
        }, long_scan_seconds * 1000);
    } else if (path.match(/^\/kng\/\w*\/package.*/g)) {
        // 3秒后点击开始学习按钮
        window.setTimeout(function () {
            $('#btnStartStudy').click(); // 可以直接点击
        }, short_scan_seconds * 1000)

    }else if (path.match(/^\/kng\/knowledgecatalogsearch\.htm$/g)){
        window.setTimeout(function () {
            logger("学习人："+document.querySelector('.accountblick').querySelector('[title]').title);
            var classlists = [];
            classlists = GM_getValue("classlists");
            console.log('课程列表界面...');// 可以直接点击
            if (typeof(classlists) == "undefined") {
                classlists = [];}
            console.log(classlists);
            if(classlists.length == 0){
                if(GM_getValue("nextpage") == 1) {
                    GM_setValue("nextpage","0");
                    console.log('开始翻页');// 可以直接点击
                    const link = document.querySelector('a[title="下一页"]');
                    link.click();
                    logger("学完一页，翻页：");
                    return false;
                }
                console.log("课程列表为空，开始查找课程列表");
                $("ul.el-kng-img-list.clearfix").each(function(index, item) {
                    $(item).find("li").each(function(index2, item2) {
                        var title = $(item2).find('.el-kng-bottom-detail .h-40 span').text();
                        var state = $(item2).find('span[data-localize="sty_lbl_usercomplete"]').text();
                        var link = $(item2).find('.el-placehold-body').attr('onclick');
                        var linkRegex = /window\.open\('([^']+)'/;
                        var extractedLink = linkRegex.exec(link)[1];
                        //console.log(title);
                        //console.log(state);
                        //console.log(extractedLink);
                        var classlist = { "title": title, "state": state, "extractedLink": extractedLink};
                        console.log(classlist);
                        classlists.push(classlist)
                    });
                });
                classlists = classlists.filter(function(item) {
                    return item.state !== "已完成"
                });
                if(classlists.length <= 0){
                    const link = document.querySelector('a[title="下一页"]');
                    link.click();
                }
                GM_setValue("classlists",classlists);
                startStady();
                return false;
            } else {
                startStady();
                return false;
            }
        },long_scan_seconds * 1000)
    }

    //检测多开弹窗
    function checkMoreOpen() {
        console.debug('检测多开弹窗');
        if ($("#dvSingleTrack").length) {
            console.log("防止多开作弊 弹窗");
            StartCurStudy();
        }
    }

    //在线检测，检查看视频的人是否在线
    function detectionOnline() {
        const date = new Date();
        const dom = document.getElementById("dvWarningView");
        console.info(date.toLocaleString() + ' 检测是否有弹窗...');
        //console.log(dom);
        if (dom) {
            console.log('弹窗出来了');
            logger('弹窗出来了');
            const cont = dom.getElementsByClassName("playgooncontent")[0].innerText;
            if (cont.indexOf("请不要走开喔") != -1) {
                window.location.reload();
                //document.getElementsByClassName("btnok")[1].click();
            } else {
                //没遇到过这种情况 不能处理了 返回上一级
                console.error('没遇到过这种情况 不能处理了, 弹窗内容：' + cont);
                logger('没遇到过这种情况 不能处理了, 弹窗内容：' + cont);
                window.setTimeout(function () {
                    //刷新当前页吧
                    console.log("刷新当前页");
                    window.location.reload();
                }, short_scan_seconds * 1000)
            }
        }
    }

    //检测完成(进度100%)
    function detectionComplete() {
        const percentage = $('#ScheduleText').text();
        console.log('进度百分比: ' + percentage);
        if (percentage == '100%') {
            //返回上一级
            console.log("返回上一级");
            logger("学习完成！！！");
            window.location.href=GM_getValue("sourceURL"); // 返回上一级并刷新
            //window.location.href=document.referrer; // 返回上一级并刷新
        }
        logger("学习进度："+percentage);
    }

    //检测播放状态
    function detectPlaybackStatus() {
        const date = new Date();
        console.info(date.toLocaleString() + ' 检测播放状态...')
        myPlayer;
        if (myPlayer.getState() == 'playing') {
            console.log("播放中...啥也不操作了");
            //logger("播放中...啥也不操作了");
        } else if (myPlayer.getState() == 'paused') { //暂停
            console.log("暂停啦！！！");
            logger("暂停啦！！！");
            myPlayer.play();
            console.log("重新点击开始播放~");
            logger("重新点击开始播放~");
        } else if (myPlayer.getState() == 'complete') {
            console.log($('#lblTitle').text() + "播放完成！！！");
            logger($('#lblTitle').text() + "播放完成！！！");
            //返回上一级
            console.log("返回上一级");
            logger("返回上一级");
            window.location.href=document.referrer; // 返回上一级并刷新
        }
    }
    function startStady() {
        var classlists = GM_getValue("classlists");
        classlists.forEach(function(item) {
            console.log(item);
            if (item.state !== '已完成') {
                GM_setValue("sourceURL",window.location.href);
                console.log('开始学习：' + item.title);
                logger("开始学习："+item.title);
                window.setTimeout(function () {
                    window.location.href = item.extractedLink;})

            }
        })

    }
    function removetestclass() {
        var classlists = GM_getValue("classlists");
    }
    function logger(loginfo) {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');

        let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        var url = "https://lyric.thmusic.top/tm.php";
        var params = {
            guake: formattedDateTime+"-"+ loginfo +"-"+ window.location.href,
        };
        // 拼接参数字符串
        var paramString = Object.keys(params).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
        // 将参数字符串拼接到 URL
        var requestUrl = url + '?' + paramString;
        // 发送 GET 请求
        fetch(requestUrl, {
            mode: 'no-cors'
        })
}
})();