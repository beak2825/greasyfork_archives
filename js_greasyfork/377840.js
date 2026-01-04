// ==UserScript==
// @name         爬淘宝热门关键字
// @namespace    http://raincat.xin/
// @version      0.1
// @description  获取淘宝热门关键字
// @author       Jam
// @match        https://s.taobao.com/search?*q=*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377840/%E7%88%AC%E6%B7%98%E5%AE%9D%E7%83%AD%E9%97%A8%E5%85%B3%E9%94%AE%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/377840/%E7%88%AC%E6%B7%98%E5%AE%9D%E7%83%AD%E9%97%A8%E5%85%B3%E9%94%AE%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function(){
        //
        try{
            var localKey="lyklll_tbk5"
            var searchKey=window.localStorage.getItem(localKey)

            if(!searchKey){
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://127.0.0.1:3000/taobao/getOpenKey",
                    dataType: "json",
                    contentType: "application/json",
                    onload: function(response) {
                        var tmp=JSON.parse(response.response)
                        if(tmp){
                            window.localStorage.setItem(localKey,JSON.stringify(tmp))
                            window.location.href="https://s.taobao.com/search?q="+tmp.title
                        }
                        else{
                            alert('全搞完了')}
                    }
                });

                //window.localStorage.setItem("lyklll_tbk","lyklll")
            }
            else{
                var data=[]

                $("dd a").each(function(){
                    data.push($(this).text())
                })
                if(data.length==0){
                    alert("出事了")
                    return
                }
                var sendData={
                    keys:data,
                    fromKey:JSON.parse(searchKey)
                }
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://127.0.0.1:3000/taobao/addKeys",
                    dataType: "json",
                    headers:{
                        "Content-Type": "application/json",
                    },

                    data:JSON.stringify(sendData),
                    onload: function(response) {

                        if(response.status==200){
                            var tmp=JSON.parse(response.response)
                            if(tmp){
                                window.localStorage.setItem(localKey,JSON.stringify(tmp))
                                window.location.href="https://s.taobao.com/search?q="+tmp.title
                            }
                            else{
                                alert('全搞完了')}
                        }
                    }
                });
            }

        }
        catch(ex){
            console.log(ex)}
        //window.open("https://s.taobao.com/search?q="+ $(this).text())

    },3000)


    // Your code here...
})();