    // ==UserScript==
    // @name        学堂云 作业解析 xuetangYun_gogut 
    // @namespace   Violentmonkey Scripts
    // @match       https://*.xuetangx.com/*
    // @version     1.2
    // @author      gobut
    // @grant       GM_xmlhttpRequest
    // @require     https://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js
    // @supportURL   免费题库查题小程序：小宇查题
    // @description  作业解析查看
// @downloadURL https://update.greasyfork.org/scripts/403119/%E5%AD%A6%E5%A0%82%E4%BA%91%20%E4%BD%9C%E4%B8%9A%E8%A7%A3%E6%9E%90%20xuetangYun_gogut.user.js
// @updateURL https://update.greasyfork.org/scripts/403119/%E5%AD%A6%E5%A0%82%E4%BA%91%20%E4%BD%9C%E4%B8%9A%E8%A7%A3%E6%9E%90%20xuetangYun_gogut.meta.js
    // ==/UserScript==

    // 自定义时间参数，不推荐更改
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }

// console.log(randomNum(1,3));
    let settings = {
        timeout: 20e3, // 题库响应等待时间，默认20s， 不必修改
        requestInterval: randomNum(2, 4)*1000, // 请求间隔，不要太快，不建议动
        // 注意，考虑到每次间隔一致可能会太过明显，所以在下面间隔的基础上加了随机数，0-2 s
        clickLoopInterval: randomNum(3, 5)*1000, //点击事件查询间隔，一次打一个，必须大于2s，否则极易造成请求失败，浪费资源，自动打勾默认关闭
    };

    // 失败重试列表
    let retry = [];

    // 左侧栏跳转提示
    let lpanel = $('<div>', {
        html: "按q查询答案",
        id: "retry",
        style: "position:fixed;z-index:9999;width: 200px;background-color: greenyellow;top:100px;left:0px;opacity: 0.7;color: purple;"
    });
    lpanel.appendTo('body');

    // 右侧边栏操作提示
    let rpanel = $('<div>', {
        html: "提示：<br>加载完成后按 q 查询答案，按 s 开/关 自动点击（注意：默认关闭，间隔必须大于2s，是否开启自行判断，网络阻塞--页面转圈圈或出现重试提示时最好暂停）<br>" +
            "<br><br>登录身份会时不时过期，导致页面跳转，网络不佳时或请求频繁时更严重<br><br>" +
            "自行判断是否适用 <br><br>成功：<span></span> 个<br>自动点击：<em>关闭</em>",
        style: "position:fixed;z-index:9999;width: 200px;background-color: greenyellow;top:100px;right:0px;opacity: 0.7;color: purple;"
    });
    rpanel.appendTo('body');

    // 点击事件，每次点击都是一次请求
    let clickList = [];

    // 是否全部查询成功
    let successNum = 0;
    let allNum = 0;

    let nChange = 0;

    // 控制按键 q 触发的重复请求
    let submit = false;
    // 开启点击
    let autoClick = false;

    // title 页面标识
    let title = $('.title').text();

    // 初始化函数
    function init() {
        title = $('.title').text();
        autoClick = false;
        retry = [];
        submit = false;
        successNum = 0;
        allNum = 0;
        nChange = 0;
        clickList = [];
        lpanel.html('按q查询答案');
        rpanel.html("提示：<br>加载完成后按 q 查询答案，按 s 开/关 自动点击（注意：默认关闭，间隔必须大于2s，是否开启自行判断，网络阻塞--页面转圈圈或出现重试提示时最好暂停）<br>" +
            "<br><br>登录身份会时不时过期，导致页面跳转，网络不佳时或请求频繁时更严重<br><br>如果页面退出或者其他的意外事件，请重复进入即可，因为服务器比较卡！" +
            "自行判断是否适用 <br><br>成功：<span></span> 个<br>自动点击：<em>关闭</em>");
    }

    // s n 按键事件
    $(window).keydown(function (event) {
        switch (event.key) {
            case 's':
                autoClick = !autoClick;
                nChange++;
                if (autoClick){
                    clickLoop();
                }else{
                    rpanel.find('em').text("关闭");
                }
                return false;
            case 'q':
                // 查询事件
                // 新页面
                if ($('.title').text() != title)
                    init();

                // 主体只需要提交一次即可，其余就是处理失败请求
                if (retry.length == 0 && submit) {
                    alert("没有请求可以发了");
                    return false;
                }
                lpanel.html("已开始查询，长时间无反应请刷新重试，或脚本失效");
                if (retry.length == 0 && !submit) {
                    // 主体请求
                    let lis = $('.paper-list>li');
                    // 主体页面没有加载完
                    if (lis.length == 0) {
                        lpanel.html("还没加载完，请重试");
                        alert("还没加载完，请重试");
                        return false;
                    }
                    // 加载完成后获取总长度
                    allNum = lis.length;
                    // 标志位-主体请求已发出
                    submit = true;
                    (async () => {
                        for (let i = 0; i < lis.length; i++) {
                            let question = $(lis[i]).find('span.content').text();
                            // 建立好每个 li 的提示信息容器
                            $(lis[i]).attr("id", "li" + i);
                            $(lis[i]).append($('<div>', {
                                id: "div" + i,
                            }));
                            // 查询
                            post(question, lis[i]);
                            await sleep(settings.requestInterval);
                        }
                    })();
                } else {
                    // 失败重试
                    (async () => {
                        for (let i = 0; i < retry.length; i++) {
                            let question = $(retry[i]).find('span.content').text();
                            post(question, retry[i]);
                            await sleep(settings.requestInterval);
                        }
                    })();
                }
        }
    });

    // 发请求
    function post(question, li) {
        // 提示信息容器
        let div = $(li).find('#div' + $(li).attr("id").substring(2));

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://tiku.71kpay.com/jk/api.php?tm='+question,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            // data: 'openid=ocgIw5TSj8f1JmALChj5N_mzDt3c&w=' + question,
            // 超时时间 20s
            timeout: settings.timeout,
            onload: function (xhr) {
                // 200 且不为空
                if (xhr.status == 200 && xhr.responseText != '') {
                    let obj = $.parseJSON(xhr.responseText) || {};
                    div.html("问题：<span style='color: mediumpurple'>" + obj['question'] + '</span><br>' + '答案：' + "<span style='color: green'>" + '&nbsp;'+ obj['answer'] + '&nbsp;' + '</span>');
                    // 点击事件入列
                    clickList.push(click(li, obj['da']));
                    successNum++;
                    rpanel.find('span').text(successNum);
                    // 去除失败查询
                    if (retry.indexOf(li) != -1) {
                        retry.splice(retry.indexOf(li), 1);
                        updatelist();
                    }
                    // 所有请求都成功提示
                    if (successNum == allNum) {
                        lpanel.html("查询结束，请自行检查");
                        lpanel1.html("OK!")
                    }
                } else {
                    // 错误响应提示
                    div.html("<span style='color: red'>响应错误，请稍后重试</span>");
                    if (retry.indexOf(li) == -1) {
                        retry.push(li);
                        updatelist();
                    }
                }
            },
            ontimeout: function () {
                div.html("<span style='color: red'>超时，请稍后重试</span>");
                if (retry.indexOf(li) == -1) {
                    retry.push(li);
                    updatelist();
                }
            }
        });
    }

    // 更新左侧边栏
    function updatelist() {
        lpanel.html("失败 " + retry.length + "个，结束后按s重试")
        retry.forEach(function (value, index, array) {
            let a = $('<a>', {
                html: '<br>第 ' + eval($(value).attr('id').substring(2) + '+1') + '题， 点击查看',
                href: "#" + $(value).attr('id'),
            });
            lpanel.append(a);
        })
    }

    // 点击事件
    function click(li, answer) {
        return function () {
            let choices = $(li).find('.answer-info');
            for (let i = 0; i < choices.length; i++) {
                if ($(li).find('.type').text().replace(" ", '') == '多选') {
                    if (answer.indexOf($(choices[i]).text().replace(" ", '')) != -1) {
                        if (!$(choices[i]).find('input').prop("checked")) {
                            $(choices[i]).click();
                            return true;
                        }
                    }else{
                        if ($(choices[i]).find('input').prop("checked")) {
                            $(choices[i]).click();
                            return true;
                        }
                    }
                } else {
                    // 单选和选择
                    if (answer == $(choices[i]).text().replace(" ", '')) {
                        if (!$(choices[i]).find('input').prop("checked")) {
                            $(choices[i]).click();
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }

    // 执行点击事件
    async function clickLoop() {
        rpanel.find('em').text('点击中。。。');
        while (autoClick) {
            let tmp = nChange;
            let flag = false;
            for (let i = 0; i < clickList.length; i++) {
                if (clickList[i]()) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                rpanel.find('em').text("结束，一定检查！！！  已关闭自动点击");
                $(document).scrollTop(0);
                autoClick=false;
                alert('已经答题结束！请检查后提交！')
                return false;
            }
            await sleep(settings.clickLoopInterval + (100*Math.random()>>0)*20 );
            if (tmp!=nChange)
                return false;
        }
    }

    const sleep = (timer) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timer);
        });
    };



