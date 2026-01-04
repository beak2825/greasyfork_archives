// ==UserScript==
// @name            exmail.qq.com_notification_plus
// @description     让腾讯企业邮箱支持浏览器通知
// @version         1.1
// @namespace       https://wanyaxing.com/blog/20181203203742.html
// @author          wyx@wanyaxing.com
// @include         https://exmail.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/376947/exmailqqcom_notification_plus.user.js
// @updateURL https://update.greasyfork.org/scripts/376947/exmailqqcom_notification_plus.meta.js
// ==/UserScript==


function setCheckout(check,fuc,time){
    if (check())
    {
        fuc();
    }
    else
    {
        setTimeout(function(){
            setCheckout(check,fuc,time);
        },time);
    }
}

// 新邮件通知
if (document.getElementById("useraddr") && document.getElementById("useraddrcontainer") )
{
    function receiveTheNewest()
    {
        console.log("尝试收取最新邮件！！！",document.getElementById('folder_1'),document.getElementById('readmailbtn_link'));
        if (document.getElementById('folder_1'))
        {
            document.getElementById('folder_1').click();
        }

        if (document.getElementById('readmailbtn_link'))
        {
            document.getElementById('readmailbtn_link').click();
            eval(document.getElementById('readmailbtn_link').getAttribute('onclick'));
        }
    }
    function notifyMail(title,body)
    {
        // 收到来信就刷新收件箱。
        receiveTheNewest();
        var tag = "sds"+Math.random();
        Notification.requestPermission(function (perm) {
            if (perm == "granted") {
                var notify = new Notification(title.replace(/&nbsp;/g,''), {
                    tag: tag,
                    // icon: "https://exmail.qq.com/favicon.ico",
                    body: body.replace(/&nbsp;/g,'')
                });
                notify.onclick=function(){
                    notify.close();
                    window.focus();
                    //如果通知消息被点击,通知窗口将被激活。
                };
                notify.onerror = function () {
                    console.log("桌面消息出错！！！");
                };
                notify.onshow = function () {
                    console.log("桌面消息成功");
                };
                notify.onclose = function () {
                    console.log("桌面消息关闭！！！");
                };
            }
        });
    }

    setCheckout(function(){
            return (unsafeWindow.QMWebpushTip && unsafeWindow.QMWebpushTip._addData)
        },function(){
            var oldUpdateTip = unsafeWindow.QMWebpushTip._addData;
            unsafeWindow.QMWebpushTip._addData = function(g,h){
                console.log('_addData',g,h);
                // setTimeout(function(){
                if (h && h[0] && h[0]['subject'] && h[0]['summary'] )
                {
                    notifyMail(h[0]['subject'] , h[0]['summary']);
                }
                // },2000);
                return oldUpdateTip(g,h);
            }
            console.log('unsafeWindow.QMWebpushTip hooked');
            var checkStatusNode = document.createElement('span');
            checkStatusNode.style.cssText = 'margin-left: 10px;';
            checkStatusNode.innerHTML = '☑︎收到新邮件时使用桌面通知。';
            checkStatusNode.onclick=function(){
                receiveTheNewest();
            }
            document.getElementById("useraddrcontainer").parentNode.appendChild(checkStatusNode);
    },1000);

    //每小时刷新一次
    // setTimeout(function(){
    //     window.history.go(0);
    // },1000 * 60 * 60);

}

