// ==UserScript==
// @name         微博内容抓取2.0
// @namespace    wwww
// @license MPL
// @version      2.1.0
// @description  可以抓取个人主页的微博内容
// @match        https://www.weibo.com/u/*
// @match        https://weibo.com/u/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/444813/%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%9620.user.js
// @updateURL https://update.greasyfork.org/scripts/444813/%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%9620.meta.js
// ==/UserScript==

(function() {
    'use strict';
       console.log("textstr");
       //https://weibo.com/ajax/statuses/mymblog?uid=1260134537&page=1&feature=0



    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "开始抓取";
    button.style.width = "90px";
    button.style.height = "30px";
    button.style.align = "center";
    button.style.backgroundColor = "#ea8011";

    var sleep_times = 1000*10;
    var sum = 0;
    var is_can_get_commests = true;

    //绑定按键点击功能
    button.onclick = function (){
        sum = 0;
        var repeat = prompt("请输入你要抓取的条数:","10");
        var doc =document.getElementsByTagName('html')[0]
        var uid = doc.baseURI.replace(/[^0-9]/ig,"")
        var page = 1
        is_can_get_commests = true;
        get_blog_request(uid,page,null,repeat);
        return;
    };

    var box = document.getElementById('cniil_wza');
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    box.parentNode.insertBefore(button, box)


    function get_blog_request(uid,page,since_id,repeat) {
        if(sum > parseInt(repeat)){
             alert("结束爬取，爬取条数：" + sum+"\n查询数据网址：http://43.134.187.127:8080/#/")
             console.log("结束爬取，爬取条数：" + sum)
             return;
        }
        //拼接url
        var url = "https://weibo.com/ajax/statuses/mymblog?uid="+uid+"&page="+page+"&feature=0";
        if(since_id != null){
           url+= ("&since_id="+since_id)
        }
        GM_xmlhttpRequest({
           method: "get",
           url: url,
           headers: {
               "Content-Type": "application/json",
               "cookie": document.cookie
           },
           onload: function(response){
                var data = analysisResponse(response);
                //发送微博下面的评论
                if(data.data.list.length == 0){
                    alert("请求不到更多的数据，结束爬取，爬取条数：" + sum+"\n 查询数据网址：http://43.134.187.127:8080/#/")
                    console.log("请求不到更多的数据，结束爬取，爬取条数：" + sum)
                    return;
                }
                sendBlogData(data);

                sum += data.data.list.length;
                console.log("已成功爬取条数：" + sum)

                delay_get_commests_rquest(data.data.list,uid,0);

                sleep(sleep_times).then(() => {
                     get_blog_request(uid,page+1,getSinceId(data),repeat);
                     }
                );

           },
           onerror: function(response){
               console.log(response);
               console.log("请求失败");
           }
       });
    }

    function delay_get_commests_rquest( dataList,uid, i){
       if(dataList.length<=i){
           return;
       }

        sleep(sleep_times/20).then(() => {
            try{
                var id = dataList[i].id;
                get_commests_rquest(id,null,uid,0);
                delay_get_commests_rquest(dataList,uid, i+1)
            }catch{
                 console.log("delay_get_commests_rquest error：" + dataList[i])
                 console.log(dataList[i])
            }
        })

    }

    function analysisResponse(response ){
        try{
        var data = JSON.parse(response.response)

        return data;

        }catch{
              is_can_get_commests = false;
        }
    }

    function sendBlogData(data) {
        GM_xmlhttpRequest({
           method: "POST",
           url: "http://43.134.187.127:8080/weibo/saveBlogs",
           headers: {
               "Content-Type": "application/json"
           },
           data:JSON.stringify(data.data.list),
           onload: function(response){
              //  console.log("sendBlogData 请求成功");

           },
           onerror: function(response){
               console.log("sendBlogData 请求失败");
               console.log(JSON.stringify(data.data.list));
           }
       });
    }
    function getSinceId(data) {
        // body...
        return data.data.since_id
    }


    function get_commests_rquest(id,max_id,uid,sum) {
        if(sum > 200){
            return;
        }
        var url = "https://weibo.com/ajax/statuses/buildComments?flow=0&is_reload=1&id="+id+"&is_show_bulletin=2&is_mix=0&count=20&uid="+uid;
        if(max_id!=null){
            url +=("&max_id="+max_id);
        }
        console.log("抓取评论:"+id+"\n");
        GM_xmlhttpRequest({
           method: "get",
           url: url,
           headers: {
               "Content-Type": "application/json",
               "cookie": document.cookie
           },
           onload: function(response){
                 //解析数据
                var data = analysisResponse(response);
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].blogId = id;
                }

                sendCommestsData(data);
                //如果还有数据 继续请求
                if(data.data.length>=20){
                    sleep(sleep_times/20 + sum *10).then(() => {
                        // 这里写sleep之后需要去做的事情
                        get_commests_rquest(id,getMaxId(data),uid, sum + 20);
                    })
                }

           },
           onerror: function(response){
               console.log("get_commests_rquest 请求失败");
               console.log(response);
           }
       });

    }

    function getMaxId(data) {
        return data.max_id
    }

    function sendCommestsData(data) {
       //  console.log("sendCommestsData ");
         GM_xmlhttpRequest({
           method: "POST",
           url: "http://43.134.187.127:8080/weibo/saveComments",
           headers: {
               "Content-Type": "application/json"
           },
           data:JSON.stringify(data.data),
           onload: function(response){
               // console.log("sendCommestsData 请求成功");
           },
           onerror: function(response){
               console.log("sendCommestsData 请求失败");
           }
       });

    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

})();