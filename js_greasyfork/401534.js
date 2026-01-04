// ==UserScript==
// @name         wangke downloader
// @name:zh-CN   济南网课视频下载工具
// @description  Jinan wangke downloader
// @description:zh-CN 济南空中课堂视频下载工具
// @namespace    https://www.larva.com.cn
// @version      1.0.0
// @author       Larva
// @match        http://db.jndjg.cn/*
// @compatible   firefox >=52
// @compatible   chrome >=55
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401534/wangke%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/401534/wangke%20downloader.meta.js
// ==/UserScript==
(function() {
    var localurl = location.href;
    var videoSrc= '';
    var Subject = '';
    var teachernName= '';
    var subjectName = '';
    var school = '';

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
            }
        }
        // 转码 decodeURI
        videoSrc = decodeURI(theRequest.video);
        Subject = decodeURI(theRequest.subject);
        teachernName = decodeURI(theRequest.name);
        subjectName = decodeURI(theRequest.subjectName);
        school = decodeURI(theRequest.school);
    }

    // 增加css
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.a-dl{color:white;background:red;padding:10px;text-decoration:none;margin-left:10px}')


    const addbtn = async()=>{
        if(localurl.search('video')>0){
            $('#dival').remove();
            var basebtn = '<div id="dival" style="line-height:60px;">下载链接：<span id="adl">正在获取下载链接...</span></div>';
            $('.tea-info').after(basebtn);
            var abtn = '<a class="a-dl"  target="_blank"  href="'+videoSrc+'">'+subjectName+'</a>';
            $('#adl').remove();
            $('#dival').append(abtn);
        }
    }

    function refreshlink(){
        //console.log(localurl,location.href)
        if(location.href!==localurl){
            console.log('urlchange');
            localurl=location.href;
            addbtn();
        }else{
            //console.log('same')
        }
    }
    GetRequest();
    setInterval(refreshlink,500);
    addbtn();

})();