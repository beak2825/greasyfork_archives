// ==UserScript==
// @name         zonst_masterlab消息提示修改
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  纠正系统消息显示不对的问题
// @author       小灰灰
// @match        http*://masterlab.xq5.com/*
// @match        http://masterlab.xq5.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xq5.com
// @grant        none
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/451452/zonst_masterlab%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/451452/zonst_masterlab%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = document.scripts
    //console.log($('#unread-msg-count'))
    //console.log(s.length)
    var tmpid = 0;
    var re = new RegExp("current_uid[ ]*=[ ]*\"([\\d]+)\"");
    for (let index = 0; index < s.length; index++) {
        const element = s[index].text;
         if(element.indexOf("current_uid") >= 0 || true){

             var tmpids = element.match(re)
            //  console.log(tmpids != null)
             if(tmpids != null){
                 tmpid = tmpids[1]
             }
         }
    }
    console.log(tmpid)
    var tmpCOunt = 11142
    var count = parseInt($('#unread-msg-count').text());
    if(count <= tmpCOunt){
        $('#unread-msg-count').hide()
    }else if(count > tmpCOunt){
        var result = (count - tmpCOunt) + ""
        document.getElementById('unread-msg-count').innerHTML = result
        console.log(result)
    }
    var csrf_token = document.getElementById("csrf_token").value
    console.log(csrf_token)
    var cookie = document.cookie
    console.log(cookie)
    var id = cookie.split("; ")
    for (let index = 0; index < id.length; index++) {
        const element = id[index];
         if(element.indexOf("hornet_uid") >= 0){
             console.log(element)
             tmpid = element.replace("hornet_uid=","")
             break;
         }
    }
    console.log(tmpid)
    var xhr = new XMLHttpRequest();

    let url = `http://masterlab.xq5.com/user/fetchMyAssistantIssues?page=1&user_id=${tmpid}&_csrftoken=${csrf_token}`
    // console.log(url)
    var loadData = function(){
        xhr.open("get", url);
        xhr.setRequestHeader('content-type','application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var responseText = xhr.responseText;
                var data = JSON.parse(responseText)
                console.log(data)
                if(data.msg == 'ok'){
                    if(parseInt(data.data.total) > 0){
                        document.getElementById('unread-msg-count').innerHTML = data.data.total
                        $('#unread-msg-count').show()
                        //shortcuts-todos
                        console.log(document.getElementsByClassName('shortcuts-todos'))
                        console.log(document.getElementsByClassName('shortcuts-todos').href)
                        document.getElementsByClassName('shortcuts-todos')[0].href = "/user/assistant_issues/" + tmpid
                    }
                }
            }
        };
        xhr.send(null)
    }
    loadData()
    setInterval(loadData,5000)
    //http://masterlab.xq5.com/user/fetchMyAssistantIssues?page=1&user_id=12306&_csrftoken=1a27AVIHA1YGVVEHAwIPAQVcCFFUUgZSDFcAAQ9QPV0Ae2VlJ3RQJ2MSV1Zj
})();