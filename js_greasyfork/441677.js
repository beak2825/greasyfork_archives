// ==UserScript==
// @name         北森
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.italent.cn/portal/convoy/ItalentIframeHome?_userSpecialType=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=italent.cn
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441677/%E5%8C%97%E6%A3%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/441677/%E5%8C%97%E6%A3%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){
location.reload();
},1000*60*10)
    let dateReg=/(\d+)-(\d+)-(\d+)/;
    let timeReg=/(\d+):(\d+)~\d+:\d+/
    setInterval(function(){
        console.log('running')
        $(window.frames["iTalentFrame"].contentDocument).find('.content_ml.daiban').each((index,item)=>{

            let content=jQuery(item).text();
            
            if(content){
                let dateResult=content.match(dateReg);
                let timeResult=content.match(timeReg);
                if(dateResult && timeResult){
                console.log(dateResult,timeResult)
                    let year=dateResult[1];
                    let month=dateResult[2];
                    let day=dateResult[3];
                    let hour=timeResult[1];
                    let munite=timeResult[2];
                    let storageKey=`${month}${day}${hour}${munite}`;
                    let dateTime=`${year}-${month}-${day} ${hour}:${munite}:00`;
                    
                    let date=new Date();
                    let deadline=new Date(dateTime);
                    if(localStorage.getItem(storageKey)){
                        return ;
                    }
                    // 提醒过的记录下来
                    
                    if(deadline.getTime()-date.getTime()<=1000*60*30){
                        localStorage.setItem(storageKey,'true');
                        if (window.Notification.permission != 'granted') {
                            Notification.requestPermission(function (status) {
                                //status是授权状态，如果用户允许显示桌面通知，则status为'granted'
                                console.log('status: ' + status);
                                //permission只读属性:
                                //  default 用户没有接收或拒绝授权 不能显示通知
                                //  granted 用户接受授权 允许显示通知
                                //  denied  用户拒绝授权 不允许显示通知
                                var permission = Notification.permission;
                                console.log('permission: ' + permission);
                            });
                        }
                        //var n = new Notification("您有一条消息！", { "icon": "", "body": "您有面试即将开始！" });
                        // alert('您有面试即将开始!')
                        $.ajax({
                            url:'http://localhost:8999/cgi-bin/webhook/send?key=b7a1ea77-f4a3-42c1-968a-be7715e3eab4',
                            data:JSON.stringify({
                                msgtype: 'text',
                                text: {
                                    content: `面试还有半小时开始${dateTime}`,
                                    mentioned_list: ['@all'],
                                },
                            }),
                            type:'post',
                            dataType:'json',
                            contentType: 'application/json',
                        })

                    }
                }else {
                    // console.error('dateTime format error')
                }
            }

        })
    },2000)
    // Your code here...
})();