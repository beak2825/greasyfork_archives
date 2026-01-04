// ==UserScript==
// @name         Douyu 斗鱼开播提醒
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  请手动打开我的关注页面并放置在后台(https://www.douyu.com/directory/myFollow) 有主播开播时自动发送系统级浏览器提醒
// @author       P
// @match        https://www.douyu.com/directory/myFollow
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/378317/Douyu%20%E6%96%97%E9%B1%BC%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/378317/Douyu%20%E6%96%97%E9%B1%BC%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

var baseURL = "https://douyu.com"
var save={}
shim_GM_notification ()


/*--- Cross-browser Shim code follows:
Source: https://stackoverflow.com/questions/36779883/userscript-notifications-work-on-chrome-but-not-firefox
*/
function shim_GM_notification () {
    if (typeof GM_notification === "function") {
        return;
    }
    window.GM_notification = function (ntcOptions) {
        checkPermission ();

        function checkPermission () {
            if (Notification.permission === "granted") {
                fireNotice ();
            }
            else if (Notification.permission === "denied") {
                console.log ("User has denied notifications for this page/site!");
                return;
            }
            else {
                Notification.requestPermission ( function (permission) {
                    console.log ("New permission: ", permission);
                    checkPermission ();
                } );
            }
        }

        function fireNotice () {
            if ( ! ntcOptions.title) {
                console.log ("Title is required for notification");
                return;
            }
            if (ntcOptions.text && !ntcOptions.body) {
                ntcOptions.body = ntcOptions.text;
            }
            var ntfctn = new Notification (ntcOptions.title, ntcOptions);

            if (ntcOptions.onclick) {
                ntfctn.onclick = ntcOptions.onclick;
            }
            if (ntcOptions.timeout) {
                setTimeout ( function() {
                    ntfctn.close ();
                }, ntcOptions.timeout);
            }
        }
    }
}

function append_notify(res){
    var status;
    for(var each in res.data.list){
        status=res.data.list[each]["show_status"]
        if (!(each in save)){
            save[each] = status
            continue
        }else if (save[each]==status){
            continue
        }
        save[each]=status
        if (status==1){
            var notificationDetails = function(){
                var tempUrl = res.data.list[each]["url"]
                return {
                    text:       res.data.list[each]["room_name"],
                    title:      res.data.list[each]["nickname"]+'开播了',
                    image:      res.data.list[each]["avatar_small"],
                    timeout:    60000,
                    onclick:    function () {
                        console.log ("Notice clicked.");
                        GM_openInTab(baseURL+tempUrl,{active: true, insert: true})
                        //window.focus ();
                    }
                }
            }()
            GM_notification (notificationDetails)
        }

    }
}

function check(){
    console.log ('Interval Check Running.');
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.douyu.com/wgapi/livenc/room/followList?isAjax=1`,
        onload: response => {
            var res=JSON.parse(response.responseText)
            if(!res.hasOwnProperty("error") || !res.error===0){alert("API 变动或未登陆 如果一直发生 请暂时禁用并留言告知")}
            append_notify(res)
        }
    });
}

check()
function notifyTitle(s){
    GM_notification ({
        text:       "Duang",
        title:      s,
        timeout:    3000,
        image: "https://apic.douyucdn.cn/upload/avatar/001/30/57/81_avatar_small.jpg"
    })
}
notifyTitle('斗鱼开播提醒启动了')
//window.onbeforeunload = function(event){notifyTitle('开播提醒已退出')}
window.onunload = function(event) {notifyTitle('斗鱼开播提醒已退出')}
window.setInterval(check,10000)