// ==UserScript==
// @name         Douyu斗鱼 主播开播提醒 (新)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  手动打开关注页面并放置在后台(https://www.douyu.com/directory/myFollow)  有主播开播/更改标题时自动发送通知提醒
// @author       hlc1209, P
// @match        https://www.douyu.com/directory/myFollow
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/390499/Douyu%E6%96%97%E9%B1%BC%20%E4%B8%BB%E6%92%AD%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92%20%28%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390499/Douyu%E6%96%97%E9%B1%BC%20%E4%B8%BB%E6%92%AD%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92%20%28%E6%96%B0%29.meta.js
// ==/UserScript==

var baseURL = "https://douyu.com"
var save={}
var save_name={}
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
        // for room status
        status=res.data.list[each]["show_status"]==1 && !res.data.list[each]["videoLoop"]
        if (!(res.data.list[each]["room_id"] in save)){
            save[res.data.list[each]["room_id"]] = status;
        }else if (save[res.data.list[each]["room_id"]]!=status){
            save[res.data.list[each]["room_id"]]=status
            if (status==1){
                var notificationDetails = function(){
                    var tempUrl = res.data.list[each]["url"]
                    return {
                        text:       '点击通知快速传送',
                        title:      res.data.list[each]["nickname"]+'开播了',
                        image:      res.data.list[each]["avatar_small"],
                        //timeout:    60000,
                        onclick:    function () {
                            console.log ("Notice clicked.");
                            GM_openInTab(baseURL+tempUrl, false);
                            //window.focus ();
                        }
                    }
                }()
                GM_notification (notificationDetails)
            }
        }


        // for room name changing
        if (!(res.data.list[each]["room_id"] in save_name)){
            save_name[res.data.list[each]["room_id"]] = res.data.list[each]["room_name"];
        }else if (save_name[res.data.list[each]["room_id"]]!=res.data.list[each]["room_name"]){
            save_name[res.data.list[each]["room_id"]] = res.data.list[each]["room_name"];
            var notificationDetails_name = function(){
                var tempUrl = res.data.list[each]["url"]
                return {
                    text:       res.data.list[each]["room_name"],
                    title:      res.data.list[each]["nickname"]+' 更改了房间标题',
                    image:      res.data.list[each]["avatar_small"],
                    //timeout:    60000,
                    onclick:    function () {
                        console.log ("Notice clicked.");
                        GM_openInTab(baseURL+tempUrl, false);
                        //window.focus ();
                    }
                }
            }()
            GM_notification (notificationDetails_name)
        }

    }
    console.log ('Following rooms checked');
}

function check(){
    console.log ('Following rooms checking');
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.douyu.com/wgapi/livenc/liveweb/follow/list?sort=0&cid1=0`,
        onload: response => {
            var res=JSON.parse(response.responseText)
            append_notify(res)
        }
    });
}

check()
function notifyTitle(s){
    GM_notification ({
        text:       "斗鱼开播提醒",
        title:      s,
        timeout:    1800,
        image: "https://img.douyucdn.cn/data/yuba/admin/2018/08/13/201808131555573522222945055.jpg?i=31805464339f469e0d3f992e565e261803",
        onclick:    function () {
                        console.log ("Notice clicked.");
                        GM_openInTab("https://www.douyu.com", false);
                        //window.focus ();
                    }
    })
}
notifyTitle('斗鱼开播提醒启动了')
//window.onbeforeunload = function(event){notifyTitle('开播提醒已退出')}
//window.onunload = function(event) {notifyTitle('斗鱼开播提醒已退出')}
window.setInterval(check,10000)