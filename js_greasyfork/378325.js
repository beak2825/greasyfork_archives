// ==UserScript==
// @name         Bilibili B站开播提醒
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  请手动打开我的关注页面并放置在后台(https://link.bilibili.com/p/center/) 有主播开播时自动发送系统级浏览器提醒
// @author       P
// @include      https://link.bilibili.com/p/center/*
// @connect      bilibili.com
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/378325/Bilibili%20B%E7%AB%99%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/378325/Bilibili%20B%E7%AB%99%E5%BC%80%E6%92%AD%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
console.log("开播提醒init")
var baseURL = "https://live.bilibili.com/"
var save={}
var all = 0
shim_GM_notification ()

//Source: https://blog.csdn.net/dingwen_888/article/details/81977352
function difference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}
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

function newSetFromDict(d){
    var mem=new Set()
    for (var i in d){
        mem.add(i)
    }
    return mem
}
function append_notify(mem,res,i,first){
    console.log(save)
    var status;
    var done=0
    var uid
    if(mem===null){
        mem=newSetFromDict(save)
        //console.log(mem) //DEBUG
    }
    for(var each in res.data.list){
        uid=res.data.list[each]["roomid"]
        status=res.data.list[each]["live_status"]

        if (!(uid in save)){
            save[uid] = status
            if(status!=1){
                done=1
                break
            }
            //continue //DEBUG
        }else if (save[uid]==status){
            if(status!=1){
                done=1
                break
            }
            continue
        }
        save[uid]=status
        if(status!=1){
            done=1
            break
        }
        mem.add(uid)
        if (first){continue}
        var notificationDetails = function(){
            var tempUrl = uid
            return {
                text:       res.data.list[each]["title"],
                title:      res.data.list[each]["uname"]+'开播了',
                image:      res.data.list[each]["face"],
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
    //Rem
    //console.log(done)
    if(done==0){
        check(i+1,mem,first)
    }else{
        for (var left in difference(newSetFromDict(save),mem)){save[left]=2}
    }
}

function check(i=1,mem=null,first=false){
    console.log ('Interval Check Running.');
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.live.bilibili.com/i/api/following?page=`+i+`&pageSize=9`,
        onload: response => {
            var res=JSON.parse(response.responseText)
            if(!res.hasOwnProperty("code") || !res.code===0){
                alert("API 变动或未登陆 如果一直发生 请暂时禁用并留言告知")
            }
            //console.log(res)
            append_notify(mem,res,i,first)
        }
    });

}

check(1,null,true)
function notifyTitle(s){
    GM_notification ({
        text:       "Duang",
        title:      s,
        timeout:    3000,
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAAAXNSR0IArs4c6QAABEhJREFUWAm9Vk1oXFUU/s57Q8bYZLLowlIXbRUFkxS6iFhaUUKhixbclGYlJNNKbSmK4MKFLmbhRnCjpdSKzkzAVfxDsUIEjT80tDTVVmdS3CWC0OIPTNqkyaTvHc+9b+6b+968+Qupd3Pv/e53fu7POecCsUbITfXQruE1g6fUhJluY+KJjAapOM9mNbEnmowyKKQVbywRcT9wdMo1YIStJ+fnBvRisTQdLsrAR67cY6TsXpEcAcT5oSoK1/eGi9aY8NLXaRrZuRoubmwwWb4kJ3DPCGsHczN9aq42rg4u0UlmfAPNNqKx3uxCwzbRHqtt6sagT5LGbU2kRMqzVRotqhets/XbEsAQubI0gJf3LtlkPS6ULpLj7GPPn8Cx4UmFBQrkHWHn8AWZPClIcKEMT9bvaMGAGeIMvimrb+L40HuEfPkLcuk5AS+DnNdCgZaDe1uJ3U81RbltXNdA4ZfHULzxaoN8DDdy4TEbAXLSJXm5b5u56Zvh6pQjjccH0xGgNmmGp+S9/EiEZ1Ccn8aD6bEk4QassrLdYNYtDF4kckbMQquemZfB/uvI7n6nFa+jtcADRc2Xxsl1iuz7s8gO72+QfvdShgYyFYXLeYRy9Vv44y99r+qlQbJCRIESzmT+1cLqvVgt0PRh+SRcvEGgbfISg7zD0NZq3D4bl+R2BQulw8iNVQnF36aJ3IOW0k6HVZ5byIS5kMk7AqT+6Uia/bfE26fY4y/rCqyDaatEEiXtIpWLdGKM8lUcqHcfbzauEmnQqH4LBlFxQA9cjcvr+EjAGxQoQSEnxkMS3qCAPe9z9tefjXvQDN/YISova5WswYO45cR5vchxPR9MXnscvf23EgXi4MralIIkFfwk+YAkjHk/oed33A3rc1wkOlcBwOzj6uJBRwr40+x7r+gYj9KazkR2jhfKvThzaC0Mywg7N5PCjoc+kAA6BOLvULl9IrFORIRiE4lgDPS/D6YDUoEuYPHWC8iNhiXWsJMdyP+aJTeVNyRR4DH8b7F052hbR5ThTN/HBOdAmAFEkag4jvHddZ015ckOqMUzP29HJv2ZCtoaV2vRjqytjuHFETvdAE0NS/5aWT+CU3v+DPVYg8CBs+Vt2MJ58VoZ2yKeqw9Hc+csBV0MpfZC5YBl2cRlLNMxnB66SSiUJ8ih87KQ+MvpwkB3VOZ1CYMTkpDLfxPRViMtL3oUi86s/voZcDN69dfc4e8jx50x6qQyiO3Y59YuWIa4mX3cXj2TNLNSmD9HDj+vltmnj5AdPNWMqvEu+W1zoVSMk/Ie5UtMfcG4pXn54HXHb+uAJLzvxWRVUl9VSsIPrc2rU+qO3/4KsoOj8lg6b13y255A55Y3xnSkiNyNiBbnHpWD3OwkJCpFZ/7KI7Yt9rlCkF8duTgrH4n/9zSkJLKH08FOz117GL2pr8SHPbaH92sspq9jdf1ws/pwv+wm6v0PqUzJKtyXGdkAAAAASUVORK5CYII="
    })
}
notifyTitle('Bilibili开播提醒启动了')
//window.onbeforeunload = function(event){notifyTitle('Bilibili开播提醒已退出')}
window.onunload = function(event) {notifyTitle('Bilibili开播提醒已退出')}
window.setInterval(check,10000)