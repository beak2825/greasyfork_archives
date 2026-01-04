// ==UserScript==
// @name         Fanly Baike
// @namespace    https://zhangzifan.com
// @version      1.4
// @description  360自动SEO脚本。
// @author       Fanly
// @match        https://baike.so.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/492264/Fanly%20Baike.user.js
// @updateURL https://update.greasyfork.org/scripts/492264/Fanly%20Baike.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    var ONCE = 10;//间隔时间s
    var currentUrl = window.location.href;//当前地址
    var isStop = false;//停止运行状态
    var reloadTimer = null; // 刷新 倒计时计时器
    var isDownTimer = false;//刷新 倒计时运行状态
    var GetPG = currentUrl.match(/#(\d+)$/)?.[1] ?? '';//获取页码
    var GETAPI = '';//数据获取接口
    var POSTAPI = '';//数据接收接口
    //TearSnow
    //GETAPI = "https://tearsnow.com/api/x.php?so&paged=1&page=10";//数据获取接口
    //POSTAPI = "https://tearsnow.com/api/xs.php";//数据接收

    //GETAPI = "https://adm.leixue.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//1270

    GETAPI = "https://faruo.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//3781
    GETAPI = "https://zaoruo.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//
    ///GETAPI = "https://ruomima.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//
    //GETAPI = "https://tandianji.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//830

    //RAND
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.xujiacm.com/wildcard/&s=a&d=.html&n=10&x=wildcard";//wildcard
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.xujiacm.com/hack/&s=a&d=.html&n=10&x=HK在线";//黑客在线
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.xujiacm.com/wpk/&s=a&d=.html&n=10&x=WPK";//WPK
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.xujiacm.com/p/&s=a&d=.html&n=10&x=旭佳广告";
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.rxjingguan.com/a/&s=a&d=.html&n=10&x=园林景观";
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.zaoruo.com/news/&s=a&d=.html&n=10&x=早若新闻";
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.zaoruo.com/hk/&s=a&d=.html&n=10&x=早若HK";
    //GETAPI = "https://tearsnow.com/api/randso.php?u=https://www.rxjingguan.com/wpk/&s=a&d=.html&n=10&x=园林景观";

    //WebSite
    //GETAPI = "https://www.xujiacm.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//4
    //GETAPI = "https://semfaq.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );
    //GETAPI = "https://iimao.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//40
    //GETAPI = "https://seoclout.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//585
    //GETAPI = "https://ruokouling.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//644
    //GETAPI = "https://ruanluyou.net/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );
    //GETAPI = "https://loadcool.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//29
    //GETAPI = "https://nasgod.com/api/so.php" + ( GetPG ? '?paged=' + GetPG : '' );//36

    //GETAPI = "https://maskpc.com/api/so.php?cat=hk&u=https://www.seoclout.com/hacker/" + ( GetPG ? '&paged=' + GetPG : '' );//10
    //GETAPI = "https://maskpc.com/api/so.php?cat=kf&u=https://seoclout.com/kf/" + ( GetPG ? '&paged=' + GetPG : '' );//1092
    //GETAPI = "https://maskpc.com/api/so.php?cat=hk&u=https://seoclout.com/hk/" + ( GetPG ? '&paged=' + GetPG : '' );//168
    //GETAPI = "https://maskpc.com/api/so.php?cat=wepoker,dpzx,aapoker,poker&u=https://seoclout.com/wpk/" + ( GetPG ? '&paged=' + GetPG : '' );//无效

    //MASK
    //GETAPI = "https://maskpc.com/api/x.php?so";//数据获取
    //POSTAPI = "https://maskpc.com/api/xs.php";//数据接收

    //URL随机进入
    var URLS = [
        'https://baike.so.com/doc/6791722-10461591.html', //张子凡
        'https://baike.so.com/doc/1004133-1061599.html', //云咨询
        'https://baike.so.com/doc/6306218-7039754.html', //爱范儿
        'https://baike.so.com/doc/2031779-2149791.html', //阿斯汤伽瑜伽
        'https://baike.so.com/doc/6441288-6654968.html', //冥想瑜伽
        'https://baike.so.com/doc/6528512-6742245.html', //博客网站
        'https://baike.so.com/doc/70002-73859.html', //酒店管理
        'https://baike.so.com/doc/5567654-5782800.html', //酒店试睡员
        'https://baike.so.com/doc/700707-741595.html', //酒店搜索引擎
        'https://baike.so.com/doc/6537334-6751072.html', //酒店管理系统
        'https://baike.so.com/doc/6004235-6217216.html', //宾馆管理软件
        'https://baike.so.com/doc/5398605-5636019.html', //开房
        'https://baike.so.com/doc/3563393-3747473.html', //开房门
        'https://baike.so.com/doc/6940665-7163026.html', //游戏修改器
        'https://baike.so.com/doc/5754935-5967696.html', //游戏修改工具
        'https://baike.so.com/doc/6736941-6951353.html', //棋牌游戏平台
        'https://baike.so.com/doc/6102377-6315488.html', //棋牌游戏下载
        'https://baike.so.com/doc/7292424-7521947.html', //棋牌游戏网
        'https://baike.so.com/doc/25820345-28104188.html', //科技媒体
        'https://baike.so.com/doc/6452667-6666352.html', //低科技生活
        'https://baike.so.com/doc/6197765-6411027.html', //高科技改变生活
        'https://baike.so.com/doc/8556939-8877597.html', //科技改变生活教案
        'https://baike.so.com/doc/5989837-6202804.html', //科技管理
        'https://baike.so.com/doc/6616984-6830778.html', //信息科技
        'https://baike.so.com/doc/5989821-6202788.html', //科技活动
        'https://baike.so.com/doc/5536051-24837771.html', //互联网金融
        'https://baike.so.com/doc/5409842-5647880.html', //互联网电视
        'https://baike.so.com/doc/3023074-24913716.html', //it
    ];
    //清除刷新倒计时，避免页面还在运行是刷新
    function reloadPause(){
        if(isDownTimer && reloadTimer && !reloadTimer.isPaused()){
            reloadTimer.pause();//暂停倒计时
        }
    }
    // 定义倒计时函数 倒计时，执行函数，动作名称
    function downTimer(seconds, callback, status) {
        reloadPause();//暂停倒计时
        var timer = null;
        var reSeconds = seconds;
        var isPaused = false;
        status = callback ? (status || '') : (status || '刷新');
        function countDown() {
            if(isStop)return; //停止
            if (!isPaused) {//是否暂停
                showMessage(status + '倒计时：' + reSeconds + 's', status + '即将执行：' + reSeconds + 's');
                if (reSeconds === 0) {
                    clearTimeout(timer);
                    if (typeof callback === 'function') {
                        callback(); // 执行回调函数
                    } else {
                        location.reload(); // 默认刷新页面
                    }
                } else {
                    reSeconds--; // 倒计时减
                    timer = setTimeout(countDown, 1000); // 每秒更新一次倒计时
                }
            }
        }
        countDown(); // 初始化倒计时
        isDownTimer = true; // 更新倒计时运行状态
        // 返回控制函数
        return {
            stop: function() {//停止
                showMessage(status + '倒计时：停止');
                isPaused = false;
                isDownTimer = false; // 倒计时运行状态
                clearTimeout(timer); //清除倒计时
            },
            pause: function() {//暂停
                showMessage(status + '倒计时：暂停（' + reSeconds + 's）');
                isPaused = true;
            },
            resume: function() {//继续
                showMessage(status + '倒计时：继续（' + reSeconds + 's）');
                isPaused = false;
                isDownTimer = true; // 更新倒计时运行状态
                countDown(); // 重新启动倒计时
            },
            isPaused: function() {//是否暂停
                return isPaused;
            }
        };
    }

    //获取URL参数
    function getUrlParam(n){
        var s = window.location.search.substr(1).match(new RegExp('(^|&)'+n+'=([^&]*)(&|$)'));
        return s!=null ? unescape(s[2]) : null;
    }

    //360百科首页
    if(window.location.href == 'https://baike.so.com/'){
        setTimeout(function() {
            // 随机选择一个URL
            var randomIndex = Math.floor(Math.random() * URLS.length);
            var randomURL = URLS[randomIndex];
            if(randomURL){
                // 重定向到选定的URL
                window.location.href = randomURL;
                return;
            }
            //输入词条进入 默认
            $('#so-search form.so-search__form input[name="word"]').val('爱范儿');
            setTimeout(function() {
                var searchBtn = document.querySelector('body #so-search form.so-search__form button.so-search__button');
                if (searchBtn) {
                    searchBtn.click();
                }
            }, 1000);
        }, 3000);// 延迟 3 秒
    }

    //进入编辑页面
    var pattern = /https:\/\/baike.so.com\/doc\/(\d+)-(\d+).html/;
    var match = pattern.exec(window.location.href);
    if (match) {//判断是否百科页面
        var eid = match[1]; // 获取第一个匹配值
        var sid = match[2]; // 获取第二个匹配值
        setTimeout(function() {
            window.location.href = "https://baike.so.com/create/edit/?eid="+eid+"&sid="+sid;
        }, 1000);
    }

    //预览页面 https://baike.so.com/?c=doc&a=preview&time=1712132380
    if(getUrlParam('c')=='doc'&&getUrlParam('a')=='preview'){
        //重载装置
        setTimeout(function() {
            var statusToCheck = ['504 Gateway Time-out', '404 Not Found'];
            var pageTitle = $('title').text(); // 获取页面<title>标签的文本内容
            for (var i = 0; i < statusToCheck.length; i++) {
                if (pageTitle.indexOf(statusToCheck[i]) !== -1) {// 如果<title>标签中包含指定状态码字符串之一，则刷新页面
                    location.reload();
                    return;
                }
            }
        }, 3000);
        //自毁装置
        setTimeout(function() {
            if(!isStop){//判断是否手动停止
                window.close(); // 关闭窗口
            }
        }, 15000);
        //开始表演
        setTimeout(function() {
            $('html, body').animate({ scrollTop: $('.reinforce').offset().top }, 'slow');//滑动到参考资料
            setTimeout(function() {
                //展开参考资料
                var refBtn = document.querySelector('body a.ref-btn');
                if(refBtn){
                    refBtn.click();
                }
                //收集链接
                var links = [];
                $('.reinforce a').each(function() {
                    var href = $(this).attr('href');
                    if (href && href.startsWith('http://c.360webcache.com/c')) {
                        links.push(href);
                    }
                });
                //判断是否收集到链接
                if (links.length) {
                    if(POSTAPI){//判断收集接口
                        $.post(POSTAPI, { links: JSON.stringify(links, null, 0) }, function(response) {// 将数组通过 POST 请求发送到指定的 URL
                            showMessage('','发送成功：' + links.length);//提示
                            //关闭窗口
                            setTimeout(function() {
                                downTimer(2, function() { window.close(); }, '关闭');//关闭窗口 3s
                            }, 500);
                        }).fail(function(xhr, status, error) {
                            showMessage('错误：'+ status + error,'发送失败');//提示
                            downTimer(3, function() { window.close(); }, '关闭');//关闭窗口
                        });
                    }else{
                        downTimer(3, function() { window.close(); }, '关闭');//关闭窗口
                    }
                } else {
                    showMessage('没有找到匹配的链接','没有数据');//提示
                    downTimer(3, function() { window.close(); }, '关闭');//关闭窗口
                }
            }, 500);
        }, 1000);
    }

    //编辑页面 https://baike.so.com/create/edit/?eid=6791722&sid=10461591
    if(getUrlParam('eid')&&getUrlParam('sid')){
        // 重写 window.alert 和 window.confirm 方法
        window.alert = window.confirm = function(message) {
            console.log(message); // 输出弹窗内容
            showMessage(message);
            return true;// 自动点击确认按钮
        };
        //重载装置
        setTimeout(function() {
            var statusToCheck = ['504 Gateway Time-out', '404 Not Found'];
            var pageTitle = $('title').text(); // 获取页面<title>标签的文本内容
            for (var i = 0; i < statusToCheck.length; i++) {
                if (pageTitle.indexOf(statusToCheck[i]) !== -1) {// 如果<title>标签中包含指定状态码字符串之一，则刷新页面
                    location.reload();
                    return;
                }
            }
        }, 3000);
        //自毁装置
        setTimeout(function() {
            if(!isStop){//判断是否手动停止
                location.reload(); // 刷新
            }
        }, 1000 * 60 * 5);//5分钟
        //关闭快速学习弹窗
        setTimeout(function() {
            var guideBtn = document.querySelector('body .guide-box a.aui_close');
            if (guideBtn) {
                guideBtn.click();
            }
        }, 1000);
        // 检测页面可见状态改变事件
        $(document).on("visibilitychange", function() {
            if(isStop)return; //停止
            if(document.visibilityState === "visible") {
                //showMessage("当前为活动标签页");
                //避免重复执行刷新倒计时
                if (!isDownTimer && !reloadTimer) {
                    reloadTimer = downTimer(ONCE);
                } else if (reloadTimer && reloadTimer.isPaused()) {
                    reloadTimer.resume();//继续
                }
            } else {
                //showMessage("当前不是活动标签页");
                // 如果倒计时在运行中，则暂停
                if (reloadTimer && !reloadTimer.isPaused()) {
                    //reloadTimer.pause();
                }
            }
        });
        if(isStop)return; //停止
        // 获取远程 JSON 数据
        GM_xmlhttpRequest({
            method: "GET",
            url: GETAPI,
            responseType: "json",
            onload: function(response) {
                reloadPause();//暂停倒计时
                if(isStop)return; //停止
                showMessage('获取：' + GETAPI);
                // 处理远程 JSON 数据
                var jsonData = response.response;
                //转换为数组 主要是直接兼容站点的so.php数据
                if (jsonData && typeof jsonData.s === 'object' && !Array.isArray(jsonData.s)) {
                    jsonData.s = Object.values(jsonData.s).map(item => ({
                        q: item.q,
                        u: item.u,
                        x: jsonData.x.name
                    }));
                }
                //去重
                //var S = (jsonData && jsonData.s && Array.isArray(jsonData.s)) ? Array.from(new Set(jsonData.s.map(JSON.stringify)), JSON.parse) : [];
                var S = jsonData && jsonData.s && Array.isArray(jsonData.s) ? jsonData.s.filter( (item, index, self) => index === self.findIndex(t => t.u === item.u || t.q === item.q) ) : [];
                // 检查 jsonData 是否为非空对象
                if (S && Object.keys(S).length > 0) {
                    var index = 0;
                    var keys = Object.keys(S);
                    var N = keys.length;//数据数量
                    var X = jsonData.x ? ' ' + jsonData.x.paged + '/' + jsonData.x.total : '';
                    showMessage('即将开始处理数据','获取数据：'+ N + ' ' + X);//提示
                    //开始循环处理数据
                    var localArray = [];//用于记录和判断是否重复填写
                    setTimeout(function iterate() {
                        reloadPause();//暂停倒计时
                        if(isStop)return; //停止
                        if (index < N) {
                            var key = keys[index];
                            var val = S[key];
                            if (localArray.includes(val.q)) {// 判断是否重复添加
                                index++;//跳过重复添加
                                showMessage('重复添加：' + val.q);//提示
                                return setTimeout(iterate, 500);
                            }
                            showMessage('','添加数据：' + (index+1) + '/' + N + X);//提示
                            setTimeout(function() {
                                reloadPause();//暂停倒计时
                                if(isStop)return; //停止
                                // 点击添加参考资料
                                $('body #btn-for-reference').click();
                                setTimeout(function() {
                                    reloadPause();//暂停倒计时
                                    if(isStop)return; //停止
                                    // 判断参考资料弹窗
                                    var popup = $('body .bkeditor-dialog form.js-ref-netresource');
                                    if (popup.length > 0) {
                                        $('body .bkeditor-dialog form.js-ref-netresource input[name="name"]').val(val.q).trigger('input');// 文章名 q
                                        $('body .bkeditor-dialog form.js-ref-netresource input[name="url"]').val(val.u).trigger('input');// URL u
                                        $('body .bkeditor-dialog form.js-ref-netresource input[name="site"]').val(val.x).trigger('input');// 网站名 name
                                        //$('body .bkeditor-dialog form.js-ref-netresource input[name="date"]').val(val.date).trigger('input');// 发表日期 date
                                        setTimeout(function() {
                                            reloadPause();//暂停倒计时
                                            if(isStop)return; //停止
                                            $('body .bkeditor-dialog .aui_footer button.aui_state_highlight').click();// 点击添加按钮
                                            showMessage(val.x + '：' + val.q);//提示
                                            index++;
                                            localArray.push(val.q);//添加到判断，避免重复添加
                                            setTimeout(iterate, 600); // 继续执行循环 添加
                                        }, 600); //添加参考资料
                                    }else{
                                        //$('body .bkeditor-dialog-withtitle .aui_close').click();//关闭添加参考资料
                                        setTimeout(iterate, 600); // 继续执行循环 添加
                                    }
                                }, 800);//显示弹窗过程
                            }, 600);
                        } else {
                            reloadPause();//暂停倒计时
                            if(isStop)return; //停止
                            showMessage('本次数据添加完成','添加完成：' + N);//提示
                            //随机滚动
                            var totalExecutions = 3; // 设置要执行的总次数
                            var rollingInterval = setInterval(function() {// 设置滚动的间隔和执行次数
                                if(isStop)return; //停止
                                if (totalExecutions <= 0) { clearInterval(rollingInterval); return; }
                                var randomNumber = Math.floor(Math.random() * (900 - 300 + 1)) + 300;//随机数
                                var currentScrollTop = $('body').scrollTop();
                                var windowHeight = $(window).height();
                                var documentHeight = $(document).height();
                                var direction = Math.random() < 0.5 ? -1 : 1;// 随机选择向上或向下滚动
                                var newScrollTop = currentScrollTop + (randomNumber * direction);
                                newScrollTop = Math.max(0, Math.min(documentHeight - windowHeight, newScrollTop));// 控制滚动范围
                                $('body,html').stop().animate({ scrollTop: newScrollTop }, 500);// 执行滚动动作
                                totalExecutions--;
                            }, 500); //多久执行一次滚动
                            //预览
                            reloadPause();//暂停倒计时
                            if(isStop)return; //停止
                            setTimeout(function() {
                                var previewBtn = document.querySelector('body .preview-btn');
                                if (previewBtn) {
                                    if(isStop)return; //停止
                                    previewBtn.click();
                                    showMessage('打开预览页面');//提示
                                    //通过x字段来判断是否是so.php
                                    if(jsonData.x.name && jsonData.x.paged <= jsonData.x.total){
                                        var newPaged = ++jsonData.x.paged;
                                        if(jsonData.x.paged >= jsonData.x.total){
                                            showMessage('','停止运行：处理完成 ' + GETAPI);//提示
                                            newPaged = jsonData.x.total;
                                            isStop = true;//停止
                                            if(reloadTimer){
                                                reloadTimer.stop();//停止倒计时
                                            }
                                        }
                                        console.log(newPaged);
                                        var newUrl = currentUrl.match(/#(\d+)$/) ? currentUrl.replace(/#(\d+)$/, `#${newPaged}`) : `${currentUrl}#${newPaged}`;
                                        window.location.replace(newUrl);//让URL生效
                                    }
                                }
                            }, 500);
                        }
                    }, 1000); // 开始循环
                } else {
                    showMessage('数据为空，进入重载倒计时');//提示
                    if(reloadTimer && reloadTimer.isPaused()){
                        reloadTimer.resume(); // 继续
                    }else{
                        reloadTimer = downTimer( 60 * 10, function() {
                            window.location.href = "https://baike.so.com/";
                        }, '重载');//10分钟重载倒计时到首页
                    }
                }
            }
        });
    }

    //控制按钮
    $("body").on("click", "div.tips", function(event) {//单击 暂停/继续
        if(isStop){//手动停止
            showMessage('已经手动停止，双击继续');
        }else
        if (reloadTimer) {
            if (reloadTimer.isPaused()) {
                reloadTimer.resume(); // 继续
            } else {
                reloadTimer.pause(); // 暂停
            }
        }else{
            showMessage('没有可操作的倒计时');
        }
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
    });
    $("body").on("dblclick", "div.tips", function(event) {// 双击 停止所有动作/刷新
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        isStop = !isStop; //当前状态
        if(isStop){
            showMessage('已双击手动停止所有操作','手动停止');
            if(reloadTimer){
                reloadTimer.stop();//停止倒计时
            }
            reloadTimer = null; //重置
        }else{
            showMessage('已双击手动继续','手动继续');
            if(reloadTimer){
                reloadTimer.resume(); // 继续
            }else{
                showMessage('开始重载倒计时');
                downTimer(3);//重载
            }
        }
    });
    //控制按钮
    //添加一个消息提示框的容器
    var $messageContainer = $('<div class="tips">').css({
        position: 'fixed',
        top: '50px',
        left: '10px',
        zIndex: 999999
    }).appendTo('body');
    var $style = {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '5px',
        width: 'max-content'
    };
    var $fixedMessage; // 用于存储固定显示的消息元素
    function showMessage(message, status) {
        // 如果传入了 status 参数，则创建一条固定显示的消息，并更新固定消息内容
        if (status) {
            // 如果已存在固定显示的消息，则更新其内容
            if ($fixedMessage) {
                $fixedMessage.text(status);
            } else {
                // 如果消息容器中没有固定显示的消息，则创建一条
                $fixedMessage = $('<div>').css($style).text(status).prependTo($messageContainer);
            }
        }
        if (message) {
            // 创建普通消息元素并添加到容器中
            var $messageItem = $('<div>').css($style).text( new Date().toLocaleString() + ' ' + message ).appendTo($messageContainer);
        }
        // 如果有固定显示的消息存在，则将其移动到消息列表的第一个位置
        if ($fixedMessage) {
            $fixedMessage.prependTo($messageContainer);
        }
        // 自动隐藏消息
        setTimeout(function() {
            // 隐藏消息并往上移动
            if($messageItem){
                $messageItem.animate({
                    opacity: 0, // 设置透明度为0，实现渐隐效果
                    marginTop: '-50px' // 向上移动50px
                }, 500, function() {
                    $(this).remove();// 动画完成后移除消息元素
                });
            }
        }, 20000);
    }
    //添加一个消息提示框的容器
})(jQuery);