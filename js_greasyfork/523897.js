// ==UserScript==
// @name         发送测试邮件脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  用于发送测试邮件脚本 使用教程：https://vcnfrvmmsvtc.feishu.cn/docx/QPoWdMebIob8IYxxMAgcUZwPnHh
// @author       jie
// @match        *://*/*
// @match        https://oa.epoint.com.cn/*
// @match        https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailsend
// @match        https://oa.epoint.com.cn/OA9/oa9/mail/mailsend
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523897/%E5%8F%91%E9%80%81%E6%B5%8B%E8%AF%95%E9%82%AE%E4%BB%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523897/%E5%8F%91%E9%80%81%E6%B5%8B%E8%AF%95%E9%82%AE%E4%BB%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var name = '发送测试邮件脚本:',
        url = window.location.href,
        isOA = false,
        userInfo = {
            userName:'',
            userGuid:'',
        };

    if(url.indexOf('oa.epoint.com.cn/epointoa9/frame/fui/pages/themes/aide/aide')>-1){
        isOA = true;

        // 更新用户信息
        var userInterval = null;
        userInterval = setInterval(function () {

            if (userInfo && userInfo.userName != '' && userInfo.userGuid != '') {
                epoint.showTips(name + '同时按下 Alt + u 跳转测试邮件发送页面！');
                epoint.showTips(name + '同时按下 Alt + u 跳转测试邮件发送页面！');
                epoint.showTips(name + '同时按下 Alt + u 跳转测试邮件发送页面！');
                clearInterval(userInterval);
            } else {
                if (window._userName_ && window._userGuid_) {
                    userInfo.userName = window._userName_;
                    userInfo.userGuid = window._userGuid_;
                    // 存储
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
            }
        }, 1000);

        $(document).keydown(function (event) {
            //console.log('event=', event);
            //console.log('event.altKey=', event.altKey);
            //console.log('event.keyCode=', event.keyCode);
            //console.log('event.keyCode==83=', event.keyCode == 83);
            //console.log('event=', event.altKey && event.keyCode == 83);

            if(isOA){
                // Alt+ u
                if (event.altKey && event.keyCode == 85) {
                    event.preventDefault(); // 阻止默认行为

                    // 打开邮件发送页面
                    window.open('https://oa.epoint.com.cn/OA9/oa9/mail/mailsend', "_blank");
                    return false;
                }
            }

        });
    }

    /**
    * 发送邮件
    * @param {Integer} num 发送几封邮件
    * @param {Integer} startIndex 开始序号
    */
    function sendMail(num, startIndex) {
        // 获取日志
        var mailTestInfo = localStorage.getItem('mailTestInfo');
        if (typeof mailTestInfo == 'string') {
            mailTestInfo = JSON.parse(mailTestInfo);
        }
        //console.log('mailTestInfo=', mailTestInfo);
        //console.log('typeof mailTestInfo=', typeof mailTestInfo);

        var date = new Date();
        var year = date.getFullYear() + '';
        var month = date.getMonth() + 1 + '';
        var day = date.getDate() + '';
        day = day.length < 2 ? '0' + day : day;
        month = month.length < 2 ? '0' + month : month;

        var notTodayFirst = localStorage.getItem('notTodayFirst');
        //console.log('notTodayFirst=', notTodayFirst);
        // 不是今天第一次
        if (notTodayFirst == year + month + day) {
            console.log('不是今天第一次.notTodayFirst1=', notTodayFirst);
        } else {
            // 是今天第一次
            startIndex = 1;
            localStorage.setItem('notTodayFirst', year + month + day);
            console.log('是今天第一次.notTodayFirst2=', notTodayFirst);
        }

        // 若日志不存在，则初始化日志
        if (!mailTestInfo || typeof mailTestInfo !== 'object') {
            mailTestInfo = {
                mailInfo: {}
            };
            localStorage.setItem('mailTestInfo', JSON.stringify(mailTestInfo));
        }

        var $body = $('body');
        var $btnAddRec = $body.find('.btn-addrec[title="添加收件人"]');
        var $btnSend = $body.find('.btn-group .mini-button:eq(0)');
        var role = 'sj';
        var handlerItem = userHandler.getInstance(role);
        //console.log('$btnAddRec=', $btnAddRec);

        setTimeout(function () {
            // 当iframe加载完成后，获取iframe中的元素
            var $iframeBody = $body.find('.mini-panel.mini-corner-all.mini-window iframe').contents();

            var $subject = $body.find('#subject');
            var $iframeBodyWebEditor = $body.find('#mailcontent>iframe').contents();
            var $mailcontent_fromEditor = $body.find('#mailcontent_fromEditor');
            var mail = null;

            // 日志
            var key = 'mail_' + year + '_' + month + day;
            //console.log('mailTestInfo3=', mailTestInfo);
            //console.log('mailTestInfo.mailInfo[key]=', mailTestInfo.mailInfo[key]);
            // 创建存放今天日志的数组
            if (!mailTestInfo.mailInfo[key]) {
                mailTestInfo.mailInfo[key] = new Array();
                localStorage.setItem('mailTestInfo3.1', JSON.stringify(mailTestInfo));
            }

            // 创建收件人列表数组
            var userList = [
                {
                    id: userInfo.userGuid,
                    name: userInfo.userName,
                    userType: '0'
                },
                //{
                //    id: '1e6538de-8ea4-48bb-a457-aa06b1ff1f4b',
                //    name: '徐海',
                //    userType: '0'
                //}
            ];

            var i = 1;
            function startSend() {

                // 设置收件人列表
                handlerItem.setUserList(userList);
                initAllListContainer();

                // 日志
                mail = new Object();
                mail.sendTo = userList;

                // 初始化序号
                var mailTestIndex = localStorage.getItem('mailTestIndex');
                if (!mailTestIndex) {
                    mailTestIndex = '001';
                    localStorage.setItem('mailTestIndex', mailTestIndex);
                }
                if (startIndex && i == 1) {
                    mailTestIndex = startIndex;
                    if ((mailTestIndex + '').length == 1) {
                        mailTestIndex = '00' + mailTestIndex;
                    }
                    if ((mailTestIndex + '').length == 2) {
                        mailTestIndex = '0' + mailTestIndex;
                    }
                    localStorage.setItem('mailTestIndex', mailTestIndex);
                }

                // 生成内容
                var str = '测试邮件：' + year + '_' + month + day + '_' + mailTestIndex;

                console.log('i=', i);
                console.log('str=', str);

                // 设置主题
                $subject.val(str);

                // 发送
                $btnSend.trigger('click');

                // 日志
                mail.sendTheme = str;
                mail.sendTime = date;

                // 更新序号
                mailTestIndex = parseInt(mailTestIndex);
                mailTestIndex++;
                if ((mailTestIndex + '').length == 1) {
                    mailTestIndex = '00' + mailTestIndex;
                }
                if ((mailTestIndex + '').length == 2) {
                    mailTestIndex = '0' + mailTestIndex;
                }

                localStorage.setItem('mailTestIndex', mailTestIndex);

                mailTestInfo.mailInfo[key].push(mail);
                // 存储日志
                localStorage.setItem('mailTestInfo', JSON.stringify(mailTestInfo));

                if (i < num) {
                    setTimeout(function () {
                        i++;
                        startSend();
                        console.log('i2=', i);
                    }, 1000);
                } else {
                    // 清空主题
                    $subject.val('');
                    // 清空收件人
                    handlerItem.setUserList([]);
                    initAllListContainer();
                    // 输出日志
                    console.log('mailTestInfo5=', mailTestInfo);
                }
            }
            startSend();
        }, 1000);
    }


    if (
        url.indexOf('https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailsend') > -1 ||
        url.indexOf('https://oa.epoint.com.cn/OA9/oa9/mail/mailsend') > -1
    ) {
        console.log('yesyes');
        var s = document.createElement('script');
        s.src = 'https://code.jquery.com/jquery-migrate-1.2.1.min.js';
        document.body.appendChild(s);

        epoint.showTips(name + '同时按下 ctrl+alt 开始发送');

        setTimeout(function() {
            epoint.showTips(name + '同时按下 Alt+ k 清空测试邮件日志');
        }, 3000);

        // 获取用户信息
        var info = localStorage.getItem('userInfo');
        if (typeof info == 'string') {
            info = JSON.parse(info);
        }
        if(info && info.userName && info.userName != '' && info.userGuid && info.userGuid != ''){
            userInfo = info;
        }

        $(document).keydown(function (event) {
            //console.log('event=', event);
            //console.log('event.altKey=', event.altKey);
            //console.log('event.keyCode=', event.keyCode);
            //console.log('event.keyCode==83=', event.keyCode == 83);
            //console.log('event=', event.altKey && event.keyCode == 83);

            var sendMailNum = localStorage.getItem('sendMailNum');
            if (!sendMailNum) {
                sendMailNum = 10;
            }

            // Ctrl+alt
            if (event.ctrlKey && event.altKey) {
                event.preventDefault(); // 阻止默认行为

                //console.log('userInfo=', userInfo);
                if(!userInfo || userInfo.userName == '' || userInfo.userGuid == ''){
                    //epoint.showTips('获取用户信息失败，发送终止！',{
                    //    state:'danger'
                    //});
                    alert("获取用户信息失败，发送终止！");
                }else{
                    //alert("开始发送!");
                    var num = prompt('需要发送多少封邮件？',sendMailNum); //显示默认文本 "10"
                    if (num != null && name != 0){
                        sendMailNum = num;
                        localStorage.setItem('sendMailNum', sendMailNum);
                        epoint.showTips('开始发送！',{
                            state:'success'
                        });
                        console.log('开始发送!开始发送!开始发送!开始发送!');
                        // 发送
                        sendMail(sendMailNum);
                    }
                }

                return false;
            }

            // Alt+ k
            if (event.altKey &&  event.keyCode==75) {
                event.preventDefault(); // 阻止默认行为
                var mailTestInfo = localStorage.getItem('mailTestInfo');
                if (typeof mailTestInfo == 'string') {
                    mailTestInfo = JSON.parse(mailTestInfo);
                }
                console.log('mailTestInfo=', mailTestInfo);

                var r=confirm("清空后不可恢复！确认要清空日志吗？");
                if (r==true){

                    mailTestInfo = {
                        mailInfo: {}
                    };
                    localStorage.setItem('mailTestInfo', JSON.stringify(mailTestInfo));

                    var mailTestInfo222 = localStorage.getItem('mailTestInfo');
                    if (typeof mailTestInfo222 == 'string') {
                        mailTestInfo222 = JSON.parse(mailTestInfo222);
                    }
                    console.log('mailTestInfo222=', mailTestInfo222);
                }else{
                    // "你按下的是\"取消\"按钮。";
                }

                return false;
            }

        });
    }
})();
