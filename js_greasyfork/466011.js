// ==UserScript==
// @name         音乐下载
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  酷我音乐下载!
// @author       BigHan
// @match        https://www.kuwo.cn/play_detail/*
// @match        http://www.kuwo.cn/play_detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      GH
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/466011/%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466011/%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function import_js(src) {
        let script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    import_js("https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js");
    import_js("https://unpkg.com/axios/dist/axios.min.js");

    let getUrl = 'https://www.kuwo.cn/api/v1/www/music/playUrl?mid=';
    let type = '&type=convert_url3&httpsStatus=1&br=320kmp3';
    const currentUrl = window.location.href;
    const mid = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    let requestUrl = getUrl + mid + type;

    var button = document.createElement('button');
    //定义input的属性，即相当于
    button.className = 'butStyle';
    button.style.width="110px";
    button.style.hight="60px";
    button.style.position="fixed";
    button.style.top="20%";
    button.style.right="5px";
    button.style.align="center";
    button.style.borderRadius = '15px';
    button.style.background="rgb(222 225 205)";
    button.innerHTML = 'Download Music';
    button.onclick = async function() {
        let downloadUrl = '';
		//let lyric = document.getElementById('lyric');
		//let ps = lyric.getElementsByTagName('p');
		//let musicName = ps[0].innerText+'.mp3';
        let info_r = document.getElementsByClassName('info_r');
		let ps = info_r[0].getElementsByTagName('p');
		let musicName = ps[0].innerText+'-'+ps[1].innerText+'.mp3';

        //console.log("请求地址 ： ", requestUrl);
		var res = await promise_fetch(requestUrl);
        var resule =await promise_download(res.url, musicName);
		console.log(resule);
    }
	function promise_fetch(req_url){
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                method: "GET",
                url: req_url,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                responseType: "json",
                onload: function(r){
                    if(r.readyState == 4){
                        var res = r.response.data;
                        //console.log("mp3地址", res.url);
                        resolve(res);
                    }
                },
                onerror: function(err){
                    console.error("请求地址失败", err);
                    reject("请求地址失败");
                }
            });
        });
    }

	//下载url指定的资源，并指定文件名
    function promise_download(res_url, file_name) {
        return new Promise(function (resolve, reject) {
            GM_download({
                url: res_url,
                name: file_name,
                onload: function () {
                    resolve(`${file_name} 下载完成`);
                },
                onerror: function (error) {
                    reject(`${file_name} 下载失败 ${error.error}`);
                }
            });
        });

    }
    setTimeout(() => {
        document.body.appendChild(button);
        let tc = document.getElementsByClassName('model_out');
        tc[0].style.display = 'none';
        tc[1].style.display = 'none';
    }, 1000);

})();