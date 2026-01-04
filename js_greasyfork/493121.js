// ==UserScript==
// @name         网易刷量养号
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  网易云音乐协议刷量脚本!
// @author       HacKer
// @match        https://music.163.com/artist?id=61204621
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://update.greasyfork.org/scripts/493118/1366844/%E7%BD%91%E6%98%93%E6%8E%A5%E5%8F%A3%E5%8A%A0%E5%AF%86%E5%BA%93.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493121/%E7%BD%91%E6%98%93%E5%88%B7%E9%87%8F%E5%85%BB%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/493121/%E7%BD%91%E6%98%93%E5%88%B7%E9%87%8F%E5%85%BB%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var list,id,dict_id
    ,Brush_list=[]
    ,Hot_list=[]
    ,switching = false;
    console.log("当前网址:" + window.location.href);
    function objToQueryString(obj) {
    // 使用URLSearchParams来转换对象为查询字符串，并自动进行URL编码
        const searchParams = new URLSearchParams(obj);

        // 获取转换后的查询字符串
        const queryString = searchParams.toString();

        // 将+替换为%2B，将/替换为%2F
        const formattedString = queryString.replace(/\+/g, '%2B').replace(/\//g, '%2F');

        return formattedString;
    }

    // 获取token
    function get_crsf_token(){
        var tG7z = document.cookie
        , vt7m = "\\b__csrf="
        , YZ7S = tG7z.search(vt7m);
        if (YZ7S < 0)
            return "";
        YZ7S += vt7m.length - 2;
        var xM8E = tG7z.indexOf(";", YZ7S);
        if (xM8E < 0)
            xM8E = tG7z.length;
        return tG7z.substring(YZ7S, xM8E) || ""
    }
    async function get_Brush_list(ids) {
        // 构建请求的URL
        var url = "https://music.163.com/api/album/" + ids;

        // 设置请求的选项
        var options = {
            headers: {
                "Accept": "application/json",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cache-Control": "no-cache",
                "Save-Data": "on",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Pragma": "no-cache",
                "Referer": "https://music.163.com/"
            },
            method: "GET",
            mode: "cors",
            credentials: "include"
        };

        try {
            // 使用fetch发送请求，并等待响应
            const response = await fetch(url, options);

            // 确保服务器响应的状态是OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // 解析JSON数据并返回
            return await response.json();
        } catch (error) {
            // 打印错误信息
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // 获取列表
    async function get_Hot_list() {
        // 构建请求的URL
        var url = "https://music.163.com/weapi/v3/playlist/detail";

        // 设置请求的选项
        var options = {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "none",
                "referrer": "https://music.163.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
            },
            method: "POST",
            mode: "cors",
            credentials: "include",
            "body":objToQueryString(get_hot()),
        };

        try {
            // 使用fetch发送请求，并等待响应
            const response = await fetch(url, options);

            // 确保服务器响应的状态是OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // 解析JSON数据并返回
            return await response.json();
        } catch (error) {
            // 打印错误信息
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    // 获取随机列表
    function getRandomElementFromArray(arr) {
        var randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }
    // 获取外网地址
    async function get_ip(){
        try {
            await fetch('https://api.ipify.org')
                .then(response => response.text())
                .then(ip => {
                console.log('您的外网IP地址是:', ip);
            })
                .catch(error => {
                console.error('获取IP地址时出错:', error);
            });
        }catch (error){
            console.log("get_ip_error:" + error);
        }
    }

    // 获取vip到期时间
    async function get_vip(){
         // 构建请求的URL
        var url = "https://interface.music.163.com/weapi/batch?csrf_token=" + get_crsf_token();

        // 设置请求的选项
        var options = {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "none",
                "referrer": "https://music.163.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
            },
            method: "POST",
            mode: "cors",
            credentials: "include",
            "body":objToQueryString(get_userinfo(get_crsf_token())),
        };

        try {
            // 使用fetch发送请求，并等待响应
            const response = await fetch(url, options);

            // 确保服务器响应的状态是OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            // 打印错误信息
            console.error('There has been a problem with your fetch operation:', error);
            console.error("获取vip到期时间失败,请检查账号是否正常")
        }
    }
    // 发送数据
    async function send_data(){
        var i7b;
        get_ip();
        console.log("开始随机播放");
        if (switching){
            dict_id = getRandomElementFromArray(Brush_list);

            console.log("当前播放为刷量列表,播放id:" + dict_id.id)
            i7b = {
                 "logs": "[{\"action\":\"play\",\"json\":{\"type\":\"song\",\"wifi\":0,\"download\":0,\"id\":" + dict_id.id + ",\"time\":" + Math.round(parseFloat(dict_id.dt) / 1000)  + ",\"end\":\"playend\",\"source\":\"artist\",\"sourceId\":\"61204621\",\"mainsite\":\"1\",\"content\":\"\"}}]",
                 "csrf_token": get_crsf_token()
            }
            switching = false
        }else{
            dict_id = getRandomElementFromArray(Hot_list);
            console.log("当前播放为热门列表,播放id:" + dict_id.id)
            i7b ={
                "logs": "[{\"action\":\"play\",\"json\":{\"type\":\"song\",\"wifi\":0,\"download\":0,\"id\":" + dict_id.id + ",\"time\":"+ Math.round(parseFloat(dict_id.dt) / 1000)  +",\"end\":\"playend\",\"mainsite\":\"1\",\"content\":\"id="+dict_id.id +"\"}}]",
                "csrf_token": get_crsf_token()
            }
            switching = true
        }

        console.log(i7b)

        fetch("https://music.163.com/weapi/feedback/weblog?csrf_token=" + get_crsf_token(), {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "nm-gcore-status": "1",
                "save-data": "on",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://music.163.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body":objToQueryString(get_data(i7b)),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        var vip = await get_vip();
        if (vip["/api/music-vip-membership/front/vip/info"].data.associator.expireTime > Date.now()){
             console.log("当前账号vip到期时间:" + new Date(vip["/api/music-vip-membership/front/vip/info"].data.associator.expireTime).toLocaleString());
        }else{
            // alert('当前账号vip已到期请及时更换！');
        }
       
    }

    // 主方法
    async function main(){
        try{
            var key;
            // 获取刷量列表
            list = await get_Brush_list("191767164");
            for (key in list.album.songs){
                Brush_list.push({"id":list.album.songs[key].id,"dt":list.album.songs[key].hMusic.playTime})
            }

            // 获取热门列表
            list =  await get_Hot_list();
            for (key in list.playlist.tracks){
                Hot_list.push({"id":list.playlist.tracks[key].id,"dt":list.playlist.tracks[key].dt});
            }
            console.log(Brush_list);
            console.log(Hot_list);
            console.log("初始化成功");

        }catch(error) {
           // 打印错误信息
           console.error('There has been a problem with your fetch operation:', error);
       }

       var IDs =  setInterval(send_data,60000 );
        console.log("定时任务id:" + IDs);

    }

    main()
})();