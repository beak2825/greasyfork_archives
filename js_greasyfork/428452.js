// ==UserScript==
// @name         学习强国网页版全功能辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  学习强国，自动答题测试工具，可测试每题，每周，专题自动答题，本代码公开无加密，仅用于学习js所用。
// @license MIT
// @author       Roy
// @run-at       document-end
// @match        https://www.xuexi.cn/
// @match        https://pc.xuexi.cn/points/login.html*
// @match        https://pc.xuexi.cn/points/my-points.html*
// @match        https://pc.xuexi.cn/points/exam-practice.html*
// @match        https://pc.xuexi.cn/points/exam-weekly-list.html*
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html*
// @match        https://pc.xuexi.cn/points/exam-paper-list.html
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html*
// @match        https://www.xuexi.cn/lgpage/detail/index.html*
// @match        https://pc.xuexi.cn/points/login.html*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/428452/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%A8%E5%8A%9F%E8%83%BD%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/428452/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%A8%E5%8A%9F%E8%83%BD%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


$(function(){
    'use strict';
    // Your code here...

    //全局变量，配置文件
    let YH_CONFIG = {
        "autoNext": true, //每个任务自动运行
        "pointPageWaitTime": 5, //每次打开积分页时等候时间（秒）；避免页面未完全打开时无法读取取dom元素
        "loginWaitTime": 30, //登录页打开页面停留时间
        "article": {
            "articlePageList":[
                "https://www.xuexi.cn/lgdata/1crqb964p71.json", //头条新闻
                "https://www.xuexi.cn/lgdata/1jscb6pu1n2.json", //重要新闻
                "https://www.xuexi.cn/lgdata/1ajhkle8l72.json", //综合新闻
                "https://www.xuexi.cn/lgdata/slu9169f72.json", //中宣部发布
                "https://www.xuexi.cn/lgdata/1ap1igfgdn2.json", //学习时评
                "https://www.xuexi.cn/lgdata/tuaihmuun2.json"  //新闻发布厅
            ],
            "articleReadingTime":[90, 60], //文章阅读时长设置（秒） 0:长阅读时间，1:短阅读时间
            "articleLongReadingCount": 6  //长阅读的文章数目
        },
        "video":{
            "playRate": 1, //视频播放倍速
            "playTime": 180, //视频最长播放时间
            "pageList": [
                "https://www.xuexi.cn/lgdata/2qfjjjrprmdh.json", //国防军事新闻
                "https://www.xuexi.cn/lgdata/31c9ca1tgfqb.json", //学习科学
                "https://www.xuexi.cn/lgdata/3m1erqf28h0r.json", //红色故事
                "https://www.xuexi.cn/lgdata/525pi8vcj24p.json", //红色书信
                "https://www.xuexi.cn/lgdata/4d82ahlubmol.json", //法治微电影
                "https://www.xuexi.cn/lgdata/56ao086isdu2.json",
                "https://www.xuexi.cn/lgdata/48cdilh72vp4.json",
                "https://www.xuexi.cn/lgdata/4sg3vhk2csq6.json",
                "https://www.xuexi.cn/lgdata/41gt3rsjd6l8.json",
                "https://www.xuexi.cn/lgdata/54tjo9frmhm7.json",
                "https://www.xuexi.cn/lgdata/4akevmg39ve0.json",
                "https://www.xuexi.cn/lgdata/4p8ukmanart0.json",
                "https://www.xuexi.cn/lgdata/3pmpl2p3nshf.json",
                "https://www.xuexi.cn/lgdata/38sfhpqcktn3.json",
                "https://www.xuexi.cn/lgdata/4fm13avfpbau.json",
                "https://www.xuexi.cn/lgdata/2sgo9h2rpc6t.json",
                "https://www.xuexi.cn/lgdata/3j2u3cttsii9.json",
                "https://www.xuexi.cn/lgdata/3ta5r2pp691k.json",
                "https://www.xuexi.cn/lgdata/5atk41jfgid9.json",
                "https://www.xuexi.cn/lgdata/533m3s0sj1nh.json",
                "https://www.xuexi.cn/lgdata/3vgbcdm1uifo.json",
                "https://www.xuexi.cn/lgdata/55dke6hh8s88.json",
                "https://www.xuexi.cn/lgdata/55dke6hh8s88.json",
                "https://www.xuexi.cn/lgdata/584m77j0cd3d.json",
                "https://www.xuexi.cn/lgdata/4482vukq9ocv.json",
                "https://www.xuexi.cn/lgdata/3415vllh4uao.json",
                "https://www.xuexi.cn/lgdata/3h85bk43dm8o.json",
                "https://www.xuexi.cn/lgdata/591ht3bc22pi.json",
                "https://www.xuexi.cn/lgdata/1lth3moi9nl.json",
                "https://www.xuexi.cn/lgdata/1oj66esmr7l.json",
                "https://www.xuexi.cn/lgdata/4tiagbqngp0n.json",
                "https://www.xuexi.cn/lgdata/16421k8267l.json",
                "https://www.xuexi.cn/lgdata/16cqa8jnh7l.json",
                "https://www.xuexi.cn/lgdata/eta8vnluqmd.json",
                "https://www.xuexi.cn/lgdata/4gthifurutvd.json",
                "https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json"
            ]
        },
        "qa":{
            "waitTime": 3  //答题任务中的循环等候时间
        }
    }

    let Task = new(_TaskObj)
    let Tools = new(_Tools)

    let _main = function(){
        // //截取当前页面文件名
        // let _p = location.pathname
        // let filename = Tools.GetFileName()

        //检测是否有任务对象，及任务对象是否设置了自动运行，修改本地变量
        let _taskObj = Task.Get()
        if(!Tools.IsNullOrEmpty(_taskObj)){
            if(!_taskObj.autoNext){
                YH_CONFIG.autoNext = false
            } else {
                YH_CONFIG.autoNext = true
            }
        }

        //进行页面初始化
        _initPage();

        //如果设置为自动运行，则开始进行任务
        if(YH_CONFIG.autoNext){
            _mainTasks();
        }

    }

    //页页初始化
    let _initPage = function(){
        //主方法
        let _2_main = function(){
            _2_pageCss()
            _2_checkTaskDate()
            // _2_main_init_button();
            _2_initPage()
            _2_bindEvent();
        }

        //设置不同页面的特定样式
        let _2_pageCss = function(){
            let _3_main = function(){
                switch(Tools.GetFileName()){
                    case 'login.html':{
                        _3_login()
                        break
                    }
                    case 'my-points.html':{
                        _3_myPoint()
                        break
                    }
                }
                
            }

            //检查当前是否登录页，是则关闭页面的音乐
            let _3_login = function(){
                let _c = 0;
                let _loginId = window.setInterval(function(){
                    $("#audio").remove()
                    $("audio").remove()
                    $('html, body').animate({ scrollTop: (1200)}, 500);
                    if(_c > 20){ window.clearInterval(_loginId)}
                    _c++
                }, 100)
            }

            //积分页-页面跳到中部显示所有积分
            let _3_myPoint = function(){
                let i = 0
                let _cid = window.setInterval(function(){
                    $('html, body').animate({ scrollTop: (500)}, 500);
                    if(i>20) {window.clearInterval(_cid)}
                    i++
                }, 500)
                
            }

            //主方法运行
            _3_main()
        }
       

        //检查是否已有任务对象，并且检查与本日日期相同，否则认定为是之前的任务，清除任务对象
        let _2_checkTaskDate = function(){
            let _taskObj = Task.Get()
            if(!Tools.IsNullOrEmpty(_taskObj)){
                //如果非空
                let today = Tools.DateShow({type:1})
                if(today > _taskObj.today){
                    //任务对象的日期在本日之前，清空任务对象
                    Task.Remove()
                }
            }
        }

        //创建页面任务层及操作按钮
        let _2_initPage = function(){
            let t = ""
            //检查当前任务情况，用于在任务栏中显示详情
            let _taskObj = Task.Get()
            let _stat = ""
            console.log(_taskObj)
            
            if(Tools.IsNullOrEmpty(_taskObj)){
                _stat = "未开始"
            } else {
                switch(_taskObj.taskflag){
                    case 1:{
                        _stat = "准备开始登录任务"
                        break;
                    }
                    case 2:{
                        _stat = "准备开始文章任务"
                        break;
                    }
                    case 3:{
                        _stat = "准备开始视频任务"
                        break;
                    }
                    case 4:{
                        _stat = "准备开始答题任务"
                        break;
                    }
                    case 999:{
                        _stat = "自动任务已完成"
                        break;
                    }
                }
            }

            t += `<div id="yh-mainDiv" style="display:block; height:20px; width:100%; background-color:#cb0001; color:#ffea85; font-size:12px; position:fixed; left:0px; top:0px; z-index:999;">\n`
            t += `<div id="yh-title" style="height:20px; height:100%; line-height:20px;">【任务】\n`
            t += `<span id="yh-action-list">${_stat}</span>\n`
            t += `<span id="yh-action-timeLeave" style="width:70px; display:inline-block; margin-left:10px;"></span>\n`
            t += `<span id="yh_reset" style="display:block;width:50px;cursor:pointer; float:right;" title="中止任务并清除任务对象">【重置】</span>\n`
            t += `<span id="yh_stop" style="display:block;width:50px;cursor:pointer; float:right;" title="中止任务，但不清除任务对象，点击“开始”按钮可以继续。">【停止】</span>\n`
            t += `<span id="yh_qa" style="display:block;width:60px;cursor:pointer; float:right;" title="在单独的答题页面中运行">【只答题】</span>\n`
            t += `<span id="yh_doit" style="display:block;width:50px;cursor:pointer; float:right;" title="开始自动任务">【开始】</span>\n`
            t += `</div>`
            t += `<div id="yh-detail" style="height:auto; width:100%; line-height:20px;></div>\n`
            t += `</div>`

            $("body").prepend(t)

        }

        //设置按钮事件
        let _2_bindEvent = function(){

            //点击【开始】按钮
            $("#yh_doit").on("click", function(){

                let _taskObj = Task.Get()
                if(!Tools.IsNullOrEmpty(_taskObj)){
                    _taskObj.autoNext = true
                    Task.Set(_taskObj)
                }
                YH_CONFIG.autoNext = true
                _2_setInitObj();
                _mainTasks();
            })

            //点击【只答题】按钮
            $("#yh_qa").on("click", function(){
                Task.Show({ title: "正在进行单项题型自动答题"})
                //创建返回函数

                //答题开始
                _answer(null);
            })

            //点击【停止】键，停止自动运行操作
            $("#yh_stop").on("click", function(){
                console.log("task stop!")
                let _taskObj = Task.Get()
                if(!Tools.IsNullOrEmpty(_taskObj)){
                    _taskObj.autoNext = false
                    Task.Set(_taskObj)
                }
                YH_CONFIG.autoNext = false
                _mainTasks();
            })

            //点击【重置】按钮-清除任务对象，并刷新页面
            $("#yh_reset").on("click", function(){
                //任务对象清除，本地变量恢复
                console.log("清除对象")
                Task.Remove()
                YH_CONFIG.autoNext = true
                window.setTimeout(function(){
                    window.location.reload();
                }, 1000)

            })
        }

        //初始化任务对象并写入缓存和变量
        let _2_setInitObj = function(){
            //任务列表整理
            let _taskObj = {
                "today": Tools.DateShow({type:1}),
                "autoNext": true,
                "taskflag": 1, //当前任务进度
                "newpageFunc": null, //页面完成后执行的方法，对象{returnUrl:跳转页面, waitTime:等候时间}
                "divshow":{ //将于每个页面上方信息层显示的内容
                    "title": "",
                    "points": null,
                    "secondshow": 0
                },
                "login": false,
                "article": {
                    "complete": false,
                    "points": 0, //当前积分
                    "readedCount": 0,  //已阅读数
                    "articleList": []  //随机文章列表
                },
                "video": {
                    "complete": false,
                    "points": 0, //数量积分
                    "timePoint": 0, //时间积分
                    "watchedCount": 0,
                    "videoList": []
                },
                "daily": false,
                "weekly": false,
                "special": false
            }

            //写入变量
            Task.Set(_taskObj)
            Task.Show({title:"创建任务对象成功！"})
        }

        //主方法运行
        _2_main();
    }

    //每天任务主程序
    let _mainTasks = function(){


        //主方法
        let _2_main = function(){
            let _taskObj = Task.Get()
            let _nextActionWaitTime = YH_CONFIG.pointPageWaitTime * 1000  //重新进入积分页时执行下一任务的等候时间，主要用于等候页面生成

            //页面首次进入，或任务被重置
            //没有任务对象，本方法退出
            if(!_taskObj) { return}

            //如果不自动运行，跳出本自动程序
            if(!YH_CONFIG.autoNext){ return}

            console.log(`_taskObj.taskflag:`, _taskObj.taskflag)
            //console.log("gm登录页面方法", GM_getValue("newpagefunc"))
            // console.log(`_taskObj:`, _taskObj)
            //检查登录任务
            if(_taskObj.taskflag == 1){
                if(!_taskObj.login){
                    // window.setTimeout(_2_login, _nextActionWaitTime)

                    let _id = window.setInterval(function(){
                        if(document.readyState == "complete"){
                            window.clearInterval(_id)
                            _2_login()
                        }
                    }, 500)
                } else {
                    console.log("修改任务进度为2")
                    _taskObj.taskflag = 2
                    Task.Set(_taskObj)
                }
            }

            //检查文章任务
            if(_taskObj.taskflag == 2){
                if(!_taskObj.article.complete){
                    console.log("开始进入文章任务")
                    // window.setTimeout(_2_article, _nextActionWaitTime)

                    let _id = window.setInterval(function(){
                        if(document.readyState == "complete"){
                            window.clearInterval(_id)
                            _2_article()
                        }
                    }, 500)
                } else {
                    console.log("修改任务进度为3")
                    _taskObj.taskflag = 3
                    Task.Set(_taskObj)
                }
            }

            //检查视频任务
            if(_taskObj.taskflag == 3){
                if(!_taskObj.video.complete){
                    console.log("开始进入视频任务")
                    // window.setTimeout(_2_video, _nextActionWaitTime)

                    let _id = window.setInterval(function(){
                        if(document.readyState == "complete"){
                            window.clearInterval(_id)
                            _2_video()
                        }
                    }, 500)
                } else {
                    console.log("修改任务进度为4")
                    _taskObj.taskflag = 4
                    Task.Set(_taskObj)
                }
            }

            //答题任务
            if(_taskObj.taskflag == 4){
                console.log("开始进入答题任务")
                // window.setTimeout(_2_qa, _nextActionWaitTime)

                let _id = window.setInterval(function(){
                    if(document.readyState == "complete"){
                        window.clearInterval(_id)
                        _2_qa()
                    }
                }, 500)
            }

        }

        //登录任务
        let _2_login = function(){
            //登录任务
            let _taskObj = Task.Get()
            let filename = Tools.GetFileName()

            console.log("进入登录方法")
            if(filename == "my-points.html"){
                // //如果任务未完成
                if(!_checkTask({"title":"登录", "result":"未获取", "fullpoint":1, "checktype":"login"})){

                    //创建页面方法
                    console.log("登录任务未完成，整理页面方法")
                    _taskObj.newpageFunc = { "returnUrl":"https://pc.xuexi.cn/points/my-points.html", "waitTime": YH_CONFIG.loginWaitTime }
                    _taskObj.divshow = {"title":"登录任务进行中！", "secondshow":YH_CONFIG.loginWaitTime}
                    Task.Set(_taskObj)

                    window.location.href = "https://www.xuexi.cn/"
                } else {
                    console.log("登录任务已完成，整理任务对象")
                    _taskObj.newpageFunc = null
                    _taskObj.divshow = {"title":"", "secondshow":0}
                    _taskObj.login = true
                    Task.Set(_taskObj)
                    window.location.reload() //刷新本页面
                }
            } else {
                // 运行页面方法
                if(!Tools.IsNullOrEmpty(_taskObj.newpageFunc)){
                    console.log("运行页面方法")
                    Task.Show(_taskObj.divshow)
                    // console.log(_taskObj.newpageFunc)
                    window.setTimeout(function(){
                        window.location.href = _taskObj.newpageFunc.returnUrl
                    }, (_taskObj.newpageFunc.waitTime * 1000))
                } else {
                    console.log("登录方法没有页面方法，也未完成任务，则先跳到积分页")
                    window.location.href = "https://pc.xuexi.cn/points/my-points.html"
                }

            }
        }

        //文章任务
        let _2_article = function(){
            let _taskObj = Task.Get()
            let filename = Tools.GetFileName()

            //任务首次进入时是在积分页，所以先检查-获取文章列表，再跳转浏览
            let _3_main = function(){
                if(filename == "my-points.html"){

                    //检查进度
                    if(!_checkTask({"title":"我要选读文章", "result":"去看看", "fullpoint":12, "checktype":"article"})){
                        //进度未完成
                        if((_taskObj.article.articleList.length == 0) && (_taskObj.article.readedCount == 0)){
                            //文章列表为空，已阅文章数是0，表示初次进入，需要整理可阅读的文章列表
                            return _3_xhr(0)
                        } else {
                            //非空及有已阅，继续阅读
                            return _3_reading()
                        }
                    } else {
                        //进度已完成
                        console.log("文章任务已完成，整理任务对象")
                        _taskObj.newpageFunc = null
                        _taskObj.divshow = {"title":"", "secondshow":0}
                        _taskObj.article.complete = true
                        Task.Set(_taskObj)
                        window.location.reload() //刷新本页面
                    }
                } else {
                    //任务页面，显示任务进度，并执行页面方法
                    return _detailPage({"type":"article"})
                }
            }

            //跨域异步方法
            let _3_xhr = function(i){
                let url = ""
                let atList = YH_CONFIG.article.articlePageList

                if(i < atList.length){
                    Task.Show({title:`读取文章列表！(${(i+1)}/${atList.length})`})
                    url = atList[i]
                    console.log(`异步：进行第${i+1}/${atList.length}次循环读取文章列表，url:${url}`)
                } else {
                    Task.Show({title:"文章列表已载入，开始阅读文章！", secondshow:0})
                    //对文章列表以发布时间进行倒序排序
                    let _taskObj = Task.Get()
                    Tools.SetArray(_taskObj.article.articleList)
                    Task.Set(_taskObj)
                    //文章阅读方法
                    return _3_reading()
                }

                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    responseType: 'json',
                    data: '_st=27057050',
                    headers: { "Content-Type": "application/json" },
                    onload: function(r) {
                        let _taskObj = Task.Get()
                        let _todayCount = 0;
                        let _today = Tools.DateShow({type:1})

                        //对获取的数据进行排序
                        // Tools.SetArray(r.response)

                        //本日任务列表
                        for(let i2=0; i2<r.response.length; i2++){
                            let a = r.response[i2]

                            if(a.hasOwnProperty("publishTime") && (Tools.HasUrl({"type":2, "str":a.url, "re": "/lgpage/detail/index.html"}))){
                                let _ptime = Tools.DateShow({type:2, dateStr:a.publishTime})  //转换日期的分隔符，并生成时间戳，用于日期对象

                                if(_today <= _ptime ){
                                    let o = {
                                        "publishTime": a.publishTime,
                                        "publishTimeInt": _ptime,
                                        "title": a.title,
                                        "url": a.url
                                    }
                                    _taskObj.article.articleList.push(o)
                                } else {
                                    _todayCount = i2;
                                    break;  //跳出循环
                                }
                            }
                        }

                        //随机任务列表
                        //本日数据获取完后，随机获取整个列表中的10条记录
                        for(let i2=0; i2<10; i2++){
                            let rand = Tools.Random(_todayCount, r.response.length)
                            let a = r.response[rand]
                            if(a.hasOwnProperty("publishTime") && (Tools.HasUrl({"type":2, "str":a.url, "re": "/lgpage/detail/index.html"}))){
                                let o = {
                                    "publishTime": a.publishTime,
                                    "publishTimeInt": Tools.DateShow({type:2, dateStr:a.publishTime}),
                                    "title": a.title,
                                    "url": a.url
                                }
                                _taskObj.article.articleList.push(o)
                            }
                        }
                        Task.Set(_taskObj)

                        return _3_xhr(i+1)
                    }
                });
            }

            let _3_reading = function(){
                //获取任务对象
                let _taskObj = Task.Get()
                //文章阅读时间
                let _readTime = YH_CONFIG.article.articleReadingTime
                //长阅读数量
                let _longReadingCount = YH_CONFIG.article.articleLongReadingCount
                //获取文章列表
                let j = _taskObj.article.articleList;

                console.log(`_taskObj.article.readedCount`, _taskObj.article.readedCount)
                if(j){
                    //文章数量不足，阅读任务无法完成，跳出本方法进入下一个任务
                    if(_taskObj.article.readedCount >= j.length-1){
                        console.log(`全部文章阅读完成，文章任务完成`)
                        _taskObj.newpageFunc = null
                        _taskObj.divshow = {"title":"所有文章已阅读完成，可手动再阅读其它文章！", "secondshow":0}
                        _taskObj.article.complete = true
                        Task.Set(_taskObj)
                        window.location.reload() //刷新本页面
                        return
                    }

                    let o = j[_taskObj.article.readedCount]  //获取当前循环的文章
                    let _timeShow = _taskObj.article.readedCount < _longReadingCount ? _readTime[0] : _readTime[1]

                    console.log(`设置页面方法；url:${o.url} ；等候时间：${_timeShow}`)
                    //整理页面方法
                    _taskObj.newpageFunc = { "returnUrl":"https://pc.xuexi.cn/points/my-points.html", "waitTime": _timeShow }
                    _taskObj.divshow = {
                        title:`【文章${(_taskObj.article.readedCount+1)}】${Tools.CutTitle(o.title, 40)}${Tools.DateShow({type:3, dateInt:o.publishTimeInt})} `,
                        points: `文章积分：(${_taskObj.article.points}/12)，`,
                        secondshow:_timeShow
                    }
                    _taskObj.article.readedCount++
                    Task.Set(_taskObj)
                    //完成任务设置，跳到目标页
                    window.location.href = o.url
                }
            }

            //主方法运行
            _3_main()
        }

        //视频任务
        let _2_video = function(){
            let _taskObj = Task.Get()
            let filename = Tools.GetFileName()

            //主方法
            let _3_main = function(){
                if(filename == "my-points.html"){
                    //检查进度

                    let _count = _checkTask({"title":"视听学习时长", "result":"去看看", "fullpoint":6, "checktype":"videotime"})
                    let _time = _checkTask({"title":"视听学习", "result":"去看看", "fullpoint":6, "checktype":"videocount"})

                    if(!_count || !_time){
                        //进度未完成
                        if((_taskObj.video.videoList.length == 0) && (_taskObj.video.watchedCount == 0)){
                            //文章列表为空，已阅文章数是0，表示初次进入，需要整理可阅读的文章列表
                            return _3_xhr(0)
                        } else {
                            //非空及有已阅，继续阅读
                            return _3_watching()
                        }
                    } else {
                        //进度已完成
                        console.log("视频任务已完成，整理任务对象")
                        _taskObj.newpageFunc = null
                        _taskObj.divshow = {"title":"", "secondshow":0}
                        _taskObj.video.complete = true
                        Task.Set(_taskObj)
                        window.location.reload() //刷新本页面
                    }
                } else {
                    //任务页面，显示任务进度，并执行页面方法
                    return _detailPage({"type":"video"})
                }
            }

            //跨域异步方法
            let _3_xhr = function(i){
                let url = ""
                let _3_list = YH_CONFIG.video.pageList

                if(i < _3_list.length){
                    Task.Show({title:`读取视频列表！(${(i+1)}/${_3_list.length})`})
                    url = _3_list[i]
                    console.log(`异步：进行第${i+1}/${_3_list.length}次循环读取视频列表，url:${url}`)
                } else {
                    Task.Show({title:"视频列表已载入，开始观看视频！", secondshow:0})
                    //对文章列表以发布时间进行倒序排序
                    let _taskObj = Task.Get()
                    Tools.SetArray(_taskObj.video.videoList)
                    Task.Set(_taskObj)
                    //文章阅读方法
                    return _3_watching()
                }

                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    responseType: 'json',
                    data: '_st=27057050',
                    headers: { "Content-Type": "application/json" },
                    onload: function(r) {
                        let _taskObj = Task.Get()
                        let _todayCount = 0;
                        let _today = Tools.DateShow({type:1})

                        //对获取的数据进行排序
                        // Tools.SetArray(r.response)

                        //本日任务列表
                        for(let i2=0; i2<r.response.length; i2++){
                            let a = r.response[i2]

                            if(a.hasOwnProperty("publishTime") && (Tools.HasUrl({"type":2, "str":a.url, "re": "/lgpage/detail/index.html"}))){
                                let _ptime = Tools.DateShow({type:2, dateStr:a.publishTime})  //转换日期的分隔符，并生成时间戳，用于日期对象

                                if(_today <= _ptime ){
                                    let o = {
                                        "publishTime": a.publishTime,
                                        "publishTimeInt": _ptime,
                                        "title": a.title,
                                        "url": a.url
                                    }
                                    _taskObj.video.videoList.push(o)
                                } else {
                                    _todayCount = i2;
                                    break;  //跳出循环
                                }
                            }
                        }

                        //随机任务列表
                        //本日数据获取完后，随机获取整个列表中的10条记录
                        for(let i2=0; i2<10; i2++){
                            let rand = Tools.Random(_todayCount, r.response.length)
                            let a = r.response[rand]
                            if(a.hasOwnProperty("publishTime") && (Tools.HasUrl({"type":2, "str":a.url, "re": "/lgpage/detail/index.html"}))){
                                let o = {
                                    "publishTime": a.publishTime,
                                    "publishTimeInt": Tools.DateShow({type:2, dateStr:a.publishTime}),
                                    "title": a.title,
                                    "url": a.url
                                }
                                _taskObj.video.videoList.push(o)
                            }
                        }
                        Task.Set(_taskObj)

                        return _3_xhr(i+1)
                    }
                });
            }

            let _3_watching = function(){
                //获取任务对象
                let _taskObj = Task.Get()
                //获取视频列表
                let j = _taskObj.video.videoList;

                // console.log(`_taskObj.video.watchedCount`, _taskObj.video.watchedCount)
                if(j){
                    //文章数量不足，阅读任务无法完成，跳出本方法进入下一个任务
                    if(_taskObj.video.watchedCount >= j.length-1){
                        console.log(`全部视频观看完成，视频任务完成`)
                        _taskObj.newpageFunc = null
                        _taskObj.divshow = {"title":"所有视频已观看完成，可手动观看其它视频！", "secondshow":0}
                        _taskObj.video.complete = true
                        Task.Set(_taskObj)
                        window.location.reload() //刷新本页面
                        return
                    }

                    let o = j[_taskObj.video.watchedCount]  //获取当前循环的文章

                    console.log(`设置页面方法，url:${o.url} `)
                    //整理页面方法
                    _taskObj.newpageFunc = { "returnUrl":"https://pc.xuexi.cn/points/my-points.html", "waitTime": 0 }
                    //设置10秒时长将滚动条滚到下方
                    _taskObj.divshow = {
                        title:`【视频${(_taskObj.video.watchedCount+1)}】${Tools.CutTitle(o.title, 50)}${Tools.DateShow({type:3, dateInt:o.publishTimeInt})} `,
                        points: `视频积分：数量(${_taskObj.video.points}/6)，时长(${_taskObj.video.timePoint}/6)，`
                    }
                    _taskObj.video.watchedCount++
                    Task.Set(_taskObj)
                    //完成任务设置，跳到目标页
                    window.location.href = o.url
                }
            }

            //主方法运行
            _3_main()
        }

        //答题任务
        let _2_qa = function(){
            let _taskObj = Task.Get()
            let filename = Tools.GetFileName()
            if(!YH_CONFIG.autoNext) { return}  //没有设置自动任务则不进行下面的自动操作

            //主方法
            let _3_main = function(){

                switch(filename){
                    case "my-points.html":{ //积分页，任务分配
                        if(!_taskObj.daily){
                            //每日答题
                            if(!_checkTask({"title":"每日答题", "result":"去答题", "fullpoint":5, "checktype":"daily"})){
                                _taskObj.divshow = {
                                    "title": "进行每日答题",
                                    "points": null,
                                    "secondshow": 0
                                }
                                if(YH_CONFIG.autoNext){ window.location.href = "https://pc.xuexi.cn/points/exam-practice.html"}
                            } else {
                                //检测通过，表示题目已完成
                                _taskObj.daily = true
                                Task.Set(_taskObj)
                                window.location.reload()  //修改任务对象，并刷新页面
                            }
                        } else {
                            //每日答题已完成，进入每周答题
                            console.log("进入每周答题任务")
                            if(!_taskObj.weekly){
                                if(!_checkTask({"title":"每周答题", "result":"去答题", "fullpoint":5, "checktype":"weekly"})){
                                    _taskObj.divshow = {
                                        "title": "进行每周答题",
                                        "points": null,
                                        "secondshow": 0
                                    }
                                    if(YH_CONFIG.autoNext){ window.location.href = "https://pc.xuexi.cn/points/exam-weekly-list.html"}
                                } else {
                                    //检测通过，表示题目已完成
                                    _taskObj.weekly = true
                                    Task.Set(_taskObj)
                                    window.location.reload()  //修改任务对象，并刷新页面
                                }
                            } else {
                                //每周答题已完成，进入专项答题
                                console.log("进入专项答题任务")
                                if(!_taskObj.special){
                                    if(!_checkTask({"title":"专项答题", "result":"去答题", "fullpoint":10, "checktype":"special"})){
                                        _taskObj.divshow = {
                                            "title": "进行专项答题",
                                            "points": null,
                                            "secondshow": 0
                                        }
                                        if(YH_CONFIG.autoNext){ window.location.href = "https://pc.xuexi.cn/points/exam-paper-list.html"}
                                    } else {
                                        //检测通过，表示题目已完成
                                        _taskObj.special = true
                                        Task.Set(_taskObj)
                                        window.location.reload()  //修改任务对象，并刷新页面
                                    }
                                }
                            }
                        }
                        break
                    }
                    case "exam-practice.html":{  //每日答题
                        Task.Show(_taskObj.divshow)
                        //创建返回函数
                        let _return = function(){
                            _taskObj = Task.Get()
                            _taskObj.daily = true
                            Task.Set(_taskObj)
                            if(YH_CONFIG.autoNext) {window.location.href = "https://pc.xuexi.cn/points/my-points.html" }
                        }
                        //答题开始
                        _answer(_return);

                        //检测答题完成后返回积分页
                        break;
                    }
                    case "exam-weekly-list.html": //每周答题-选择页
                    {
                        _taskObj = Task.Get()
                        Task.Show(_taskObj.divshow)
                        if(!_taskObj.special){
                            //如果没有新的题目，则默认任务已完成，并返回积分页
                            if($("button:not(.ant-btn-background-ghost):last").length > 0){
                                $("button:not(.ant-btn-background-ghost):last").click()
                            } else {
                                _taskObj = Task.Get()
                                _taskObj.weekly = true
                                Task.Set(_taskObj)
                                if(YH_CONFIG.autoNext) {window.location.href = "https://pc.xuexi.cn/points/my-points.html"}
                            }
                        }
                        break;
                    }
                    case "exam-weekly-detail.html":  //每周答题-答题页
                        {
                            Task.Show(_taskObj.divshow)
                            //创建返回函数
                            let _return = function(){
                                _taskObj = Task.Get()
                                _taskObj.weekly = true
                                Task.Set(_taskObj)
                                if(YH_CONFIG.autoNext) {window.location.href = "https://pc.xuexi.cn/points/my-points.html"}
                            }
                            //答题开始
                            _answer(_return);
                            break
                        }
                    case "exam-paper-list.html":  //专项答题-选择页
                        {
                            _taskObj = Task.Get()
                            Task.Show(_taskObj.divshow)
                            if(!_taskObj.special){
                                if($("button:not(.ant-btn-background-ghost):last").length > 0){
                                    $("button:not(.ant-btn-background-ghost):last").click()
                                } else {
                                    _taskObj = Task.Get()
                                    _taskObj.special = true
                                    Task.Set(_taskObj)

                                    if(YH_CONFIG.autoNext) {
                                        window.setTimeout(function(){
                                            window.location.href = "https://pc.xuexi.cn/points/my-points.html"
                                        }, 2000)
                                    }
                                    //全部任务完成
                                    _taskEnd() 
                                }
                            }
                            break;
                        }
                    case "exam-paper-detail.html":  //专项答题-答题页
                        {
                            Task.Show(_taskObj.divshow)
                            //创建返回函数
                            let _return = function(){
                                _taskObj = Task.Get()
                                _taskObj.special = true
                                Task.Set(_taskObj)
                                if(YH_CONFIG.autoNext) {window.location.href = "https://pc.xuexi.cn/points/my-points.html"}
                            }
                            //答题开始
                            _answer(_return);
                            break
                        }

                    default: { //其它页面，跳回积分页分配任务
                        if(YH_CONFIG.autoNext) {window.location.href = "https://pc.xuexi.cn/points/my-points.html"}
                        break
                    }
                }
            }
            //主方法运行
            _3_main()
        }

        //主方法运行
        _2_main();
    }

    //任务全部完成，关闭自动操作
    let _taskEnd = function(){
        let _taskObj = Task.Get()

        _taskObj.autoNext = false
        _taskObj.taskflag = 999  //没有该任务标识，任务不可能再继续
        _taskObj.login = true
        _taskObj.article.complete = true
        _taskObj.video.complete = true
        _taskObj.daily = true
        _taskObj.weekly = true
        _taskObj.special = true

        _taskObj.divshow = {
            title: `全部任务已完成！&nbsp;<a href="https://pc.xuexi.cn/points/my-points.html">回积分页</a>`, 
            points: null,
            secondshow: 0
        }

        Task.Set(_taskObj)
        YH_CONFIG.autoNext = false  //全部任务完成
    }

    //内容页方法
    let _detailPage = function({type="article"}){
        let _taskObj = Task.Get()

        console.log("_taskObj", _taskObj)

        if(!Tools.IsNullOrEmpty(_taskObj.newpageFunc)){
            console.log("运行页面方法")
            //页面回跳方法
            if(type == "article"){
                //页顶任务说明文字
                Task.Show(_taskObj.divshow)
                //文章阅读任务，按设定的时间返回
                window.setTimeout(function(){
                    window.location.href = _taskObj.newpageFunc.returnUrl
                }, (_taskObj.newpageFunc.waitTime * 1000))
            } else {
                //视频观看任务，在视频播放结束后，再等1.5秒返回
                window.setTimeout(function(){
                    let v = document.querySelector("video")
                    //绑定视频结束跳转网页事件
                    v.addEventListener('ended', function () {
                        window.setTimeout(function(){
                            window.location.href = _taskObj.newpageFunc.returnUrl
                        }, 1500)
                    })
                    //设定视频播放倍速
                    v.playbackRate = YH_CONFIG.video.playRate
                    //获取视频时长
                    let _videoTime = Math.ceil(v.duration / YH_CONFIG.video.playRate)
                    if(_videoTime > YH_CONFIG.video.playTime) { _videoTime = YH_CONFIG.video.playTime}  //设置视频播放实际时长
                    _taskObj.divshow.secondshow = _videoTime
                    //如果视频播放时长超过设定的时长，则当作播放结束，跳到下一视频
                    window.setTimeout(function(){
                        window.location.href = _taskObj.newpageFunc.returnUrl
                    }, _videoTime*1000)

                    //页顶任务说明文字
                    Task.Show(_taskObj.divshow)
                }, 1000)

            }

            //在任务层添加快进按钮
            let _newBtn = `<span id="yh_donext" style="display:block;width:75px;cursor:pointer; float:right;">【下一任务】</span>\n`
            $("#yh-title").append(_newBtn)
            $("#yh_donext").on("click", function(){
                window.location.href = _taskObj.newpageFunc.returnUrl
            })

            //页面视频静音
            let _i = 0
            let _vid = window.setInterval(function(){
                if($("video").length > 0){
                    document.querySelector("video").muted = true
                    _i++
                }
                if(_i>50){ window.clearInterval(_vid)}
                
            }, 800)

            //页面自动滚动到底部
            $('html, body').animate({ scrollTop: ($(document.body).height() - $(window).height() - 500)}, 8000);
        } else {
            console.log("没有页面方法，也未完成任务，则先跳到积分页")
            if(YH_CONFIG.autoNext) {window.location.href = "https://pc.xuexi.cn/points/my-points.html"}
        }

    }

    //根据页面检查当前任务是否完成
    let _checkTask = function({title="", result="", fullpoint=0, checktype=""}){
        let _2_Card= $(`p.my-points-card-title:contains('${title}')`).siblings(".my-points-card-footer")
        let _2_btn = _2_Card.find("div.big");  //按钮元素
        let _point = $.trim(_2_Card.find("div.my-points-card-text").text())
        let _taskObj = Task.Get()


        _point = parseInt(_point.match(/(\d+)/)[1])  //获取当前文章分数
        // console.log(`checkTask:_point` ,_point)

        switch(checktype){
            case "article":{  //文章任务
                _taskObj.article.points = _point
                break;
            }
            case "videocount":{  //视频任务-视频数
                _taskObj.video.points = _point
                break
            }
            case "videotime":{  //视频任务-观看时长
                _taskObj.video.timePoint = _point
                break
            }
        }
        Task.Set(_taskObj)

        if((_2_btn.text() == result) || (_point < fullpoint)){
            //任务未完成
            return false
        } else {
            return true
        } 
    }

    //重自动写答题方法
    let _answer = function(returnFunc){
        //检测本题是否自动操作成功，如不成功则停止自动操作、提示用户、重新绑定按钮自动事件
        let _submitSeccess = true
        let _actionFlag = 0
        //循环等候时间
        let _time = YH_CONFIG.qa.waitTime * 1000

        let _2_answer_action = function(){
            var _btnNext = $(".ant-btn")
            // console.log("_btnNext:", _btnNext.text())

            // console.log("_btnNext.length:", _btnNext.length)
            //如果有多个按钮，说明有一个按钮是【交卷】，当前操作按钮为第1个，由于float的原因，第1个按钮，所以是eq(1)
            if(_btnNext.length > 1){
                _btnNext = _btnNext.eq(1)
            }

            //如果按钮为disabled，则表示可以分析题目并答题
            if(_btnNext.attr("disabled") == "disabled"){
                //如果标识大于0，表示在未完成本题的情况下，再次进入本操作，即选项或填空无法自动完成，需要手动操作
                if(_actionFlag>1){
                    Task.Show({title:"本题无法自动识别答案完成，请手动操作！"})
                    window.clearInterval(_waitId)
                    _btnNext.one("click", function(){
                        _actionFlag = 0
                        Task.Show({title:"继续自动答题！"})
                        _waitId = window.setInterval(_2_answer_action, _time);
                    })
                }

                //获取题型
                let _qType = $(".q-header").text().substr(0,3)

                //如果不是视频题，则进行正常答题操作
                if($("video").length == 0){
                    //查看提示
                    $(".tips").click()
                    //填空题的textbox
                    let _text = $("input")
                    //单选多选按钮
                    let _buttons = $(".q-answer");

                    //获取所有提示文字
                    let _allTips = $("font[color=red]")
                    console.log("提示点：", _allTips.text())

                    switch(_qType){
                        case "填空题":{
                            
                            //创建input事件
                            let myEvent = document.createEvent('Events')
                            myEvent.initEvent('input', true, false)

                            if(_text.length > 1){
                                //多个填空
                                if(_text.length == _allTips.length){
                                    //填空数量与提示数量一致
                                    _allTips.each(function(i){
                                        let _tipTxt = $.trim($(this).text())
                                        console.log(`填空内容：`, _tipTxt)
                                        if(!Tools.IsNullOrEmpty(_tipTxt)){
                                            _text.eq(i).attr("value", _tipTxt)
                                            _text.eq(i)[0].dispatchEvent(myEvent);

                                        }
                                    })

                                } else {
                                    //填空数和提示数不一致，一般是提示数较多
                                    if(_allTips.length > _text.length){
                                        //提示的所有内容，不止红色答案部分
                                        let _lineFeed = $(".line-feed").text()

                                        //第几个tip
                                        let n = 0
                                        _text.each(function(i){
                                            let _tipTxt = _allTips[n].text()
                                            let _nextTipTxt = ""

                                            do{
                                                _tipTxt += _nextTipTxt
                                                if(n < (_text.length - 1)){
                                                    n++
                                                    _nextTipTxt = _allTips[n].text()
                                                } else {
                                                    _nextTipTxt = "结束了，没有了。"
                                                }
                                            } while(_lineFeed.indexOf(_tipTxt + _nextTipTxt))
                                            console.log(`填空内容：`, _tipTxt)
                                            // _text[i].attr("value", _tipTxt);
                                            _text.eq(i).attr("value", _tipTxt)
                                            _text.eq(i)[0].dispatchEvent(myEvent);
                                        })
                                    } else {
                                        //提示数量少于填空数量，则我无法分析
                                        //人工操作吧。不易拆分出答案。
                                        //TODO 暂停定时器
                                    }
                                }
                            } else if(_text.length == 1) {
                                //只有一个空
                                let _tipTxt = ""
                                _allTips.each(function(i){
                                    _tipTxt += $(this).text();
                                })
                                _text.attr("value", _tipTxt)
                                _text[0].dispatchEvent(myEvent);

                                break;
                            } else {
                                //没有空的情况（暂不设定）
                            }
                            break
                        }
                        case "多选题":{
                            _buttons.each(function(i){
                                //循环每个按钮进行比对
                                let _btnTxt = $.trim($(this).text())
                                //通过使用此标识，避免同时两个tip的内容相似
                                //如 选项“文化安全”，tip1:“文化”, tip2:“文化安全”
                                let _isClick = false

                                _allTips.each(function(j){
                                    let _tipTxt = $.trim($(this).text())
                                    //提示的文字不为空
                                    if(!Tools.IsNullOrEmpty(_tipTxt)){
                                        if((_btnTxt.indexOf(_tipTxt) > -1) || (_tipTxt.indexOf(_btnTxt) > -1)){
                                            console.log(`多选选项：`, _btnTxt, _tipTxt)
                                            _isClick = true
                                        }
                                    }
                                })
                                if(_isClick){ $(this).click();}
                            })
                            break
                        }
                        case "单选题":{
                            //单选，所以所有的提示，其实是同一个。有时候，对方提示会分成多个部分。
                            //把红色提示组合为一条
                            let _tipTxt = ""
                            _allTips.each(function(i){
                                _tipTxt += $.trim($(this).text())
                            })

                            if(!Tools.IsNullOrEmpty(_tipTxt)){
                                _buttons.each(function(i){
                                    let _btnTxt = $.trim($(this).text()).replace(/\s/, '')
                                    console.log(`选项：`, _btnTxt, _tipTxt)
                                    //通过判断是否相互包含，来确认是不是此选项
                                    if((_btnTxt.indexOf(_tipTxt) > -1) || (_tipTxt.indexOf(_btnTxt) > -1)){
                                        console.log(`匹配：`, _btnTxt, _tipTxt)
                                        _buttons.eq(i).click();
                                    }
                                })
                            }
                            break;
                        }
                    }

                    //关闭tip
                    $(".tips").click()
                } else {
                    //视频题
                    console.log("取消定时器", _waitId)
                    window.clearInterval(_waitId)
                    _btnNext.one("click", function(){
                        _waitId = window.setInterval(_2_answer_action, _time);
                    })
                }

                _actionFlag++  //修改答题标识，用于检测题目是否正常选中或填入内容
            } else {
                
                if(_btnNext.text() != "再练一次" && _btnNext.text() != "再来一组" && _btnNext.text() != "查看解析"){
                    _actionFlag = 0 //恢复答题标识
                    _btnNext.click();
                } else {
                    console.log("本类答题已完成，取消定时器", _waitId)
                    Task.Show({title:`答题已完成  &nbsp;<a href="https://pc.xuexi.cn/points/my-points.html" style="color:#ffea85;">回积分页</a>`})
                    window.clearInterval(_waitId)
                    if(returnFunc != null){
                        window.setTimeout(returnFunc, (_time + 1000)) //完成答题后，执行回调函数
                    }
                }
            }
        }

        //主方法运行
        // _4_main()
        let _waitId = window.setInterval(_2_answer_action, _time);
        console.log("设置定时器", _waitId)
    }

    //主方法运行
    _main()
});

let _Tools = function(){
    //检测内容是否为空
    this.IsNullOrEmpty = function(t){ return _isNullOrEmpty(t)}
    let _isNullOrEmpty = function (t) {
        var r = false;
        if (t == undefined || t == "" || t == null) {
            r = true;
        }
        return r;
    }

    //对页面json返回中的日期字符串进行排序
    this.SetArray = function(c) {
        c.sort(_compare("publishTime"))
        // console.log(c)
        return c
    }
    let _compare = function(property){
        return function (a,b){
            //Date.parse("2021-06-08 11:22:44")
            //Date.parse(a[property].replace(/-/g, "/"))
            // return a[property]-b[property];
            // console.log("a[property]:"+a[property])
            return Date.parse(b[property].replace(/-/g, "/"))-Date.parse(a[property].replace(/-/g, "/"));
        }
    }

    //标题长度过长进行截取
    this.CutTitle = function(t, length){
        if(t.length > length){
            t = t.substring(0, length) + "...";
        }
        return t
    }

    //获取日期格式
    this.DateShow = function({type=1, dateInt=0, dateStr=''}){
        //根据条件返回日期显示内容
        switch(type){
            case 1:{ //返回本日0点0分0秒的时间戳
                // return new Date(new Date().toLocaleDateString()).getTime()
                return Date.parse(new Date().toLocaleDateString().replace(/-/g, "/"))
            }
            case 2:{ //传入指定日期的字符串格式，转换为时间戳
                return Date.parse(dateStr.replace(/-/g, "/"))
            }
            case 3: //传入时间戳，返回(mm/dd)的格式
            {
                if(dateInt > 0) {
                    let d = new Date(dateInt)
                    let M = ("0" + (d.getMonth()+1)).slice(-2)
                    let D = ("0" + d.getDate()).slice(-2)
                    return `(${M}/${D})`
                }
            }
        }
    }

    //获取当前页的文件名
    this.GetFileName = function(){
        let _p = location.pathname
        let filename = _p.substr(_p.lastIndexOf("/") + 1);
        return filename
    }

    //网页链接的字符串对比方法（参数为正则表达式）
    this.HasUrl = function({type=1, str="", re=""}){
        let re_result = null
        switch(type){
            case 1:{  //当前页面链接的字符串对比
                let url = window.location.href;
                re_result = url.search(re)
                break;
            }
            case 2:{  //指定网址的字符串对比
                if(!_isNullOrEmpty(str)){
                    if(str.search(re) > -1){
                        re_result = true
                    } else {
                        re_result = false
                    }
                }
            }
        }
        //获取本网页链接
        return re_result
    }

    //获取两个数字之间的随机数
    this.Random = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


}



//操作任务对象
let _TaskObj = function(){
    let _taskobj = {}
    //读取ls或gm的任务对象变量
    this.Get = function(){
        //获取任务对象-先检查缓存-有则设置变量再返回--没有则检查变量并返回--都没有则返回null
        let _lsValue = window.localStorage.getItem("yh_DailyTasks")
        let _gmValue = GM_getValue("yh_DailyTasks")

        if(_lsValue != null){
            _taskobj = JSON.parse(_lsValue)
            return _taskobj
        } else {
            if(_gmValue != undefined){
                _taskobj = _gmValue
                return _taskobj
            } else {
                _taskobj = null
                return _taskobj
            }
        }
    }

    //设置ls及gm的任务对象变量，变量会自动转换为字符串
    this.Set = function(_para){
        if(_para != undefined && _para != null){
            // let _jtxt = JSON.stringify(_para)
            // window.localStorage.setItem("yh_DailyTasks", _jtxt)
            // GM_deleteValue("yh_DailyTasks")
            GM_setValue("yh_DailyTasks", _para)
        }

    }

    //删除任务对象
    this.Remove = function(){
        window.localStorage.removeItem("yh_DailyTasks")
        GM_deleteValue("yh_DailyTasks")
    }

    //在页面显示当前任务进度
    this.Show = function({title="", points="", secondshow=0}){
        //如果内容不为空
        if(title != ""){
            // let _pTxt = ""
            // if(points!=""){
            //     _pTxt = `积分：(${points[0]}/${points[1]})，`
            // }
            console.log(`${points}任务：${title}，时间：${secondshow}`)
            $("span#yh-action-list").html(points + title)
        }

        //如果显示秒数不为空
        if(secondshow > 0){
            let s = secondshow
            let _timeid = window.setInterval(function(){
                if(s>=0){
                    $("#yh-action-timeLeave").text(`[剩${s-1}秒]`)
                    s--
                } else {
                    window.clearInterval(_timeid)
                }
            }, 1000)
        }

    }

}
