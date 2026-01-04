// ==UserScript==
// @name         在线视频字幕抓取
// @namespace    http://tampermonkey.net/
// @version      4.1.2
// @description  try to take over the world!
// @author       You-get
// @match        https://www.xuetangx.com/learn/*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421544/%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421544/%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var turndownService = new TurndownService();
    var style = document.createElement("style");
    style.innerHTML = `a[data-v-100]:link, a[data-v-100]:visited { color: #323c47; text-decoration: none; }
a[data-v-100]:hover { color: rgb(52,105,248); border: 1px solid rgb(52,105,248); }
.download[data-v-100] {
border: 1px solid #ebebeb;
-webkit-border-radius: 4px;
border-radius: 4px;
width: 246px;
height: 52px;
line-height: 52px;
display: inline-block;
position: relative;
padding: 0 0 0 50px;
font-size: 0;
font-weight: 400;
color: #323c47;
letter-spacing: .11px;
overflow: hidden;
-o-text-overflow: ellipsis;
text-overflow: ellipsis;
white-space: nowrap;
margin: 10px 15px 10px 0;
cursor: pointer;
}
.iconfont[data-v-100] {
font-size: 20px;
position: absolute;
top: 15px;
left: 18px;
}
.text.hassize[data-v-100] {
width: 115px;
}
.text[data-v-100] {
display: inline-block;
vertical-align: middle;
width: 175px;
font-size: 12px;
overflow: hidden;
-o-text-overflow: ellipsis;
text-overflow: ellipsis;
}
.line[data-v-100] {
width: 2px;
height: 18px;
background: #ebebeb;
display: inline-block;
vertical-align: middle;
margin: 0 15px 0 9px;
}
.size[data-v-100] {
display: inline-block;
vertical-align: middle;
width: 40px;
font-size: 12px;
}
.t1[data-v-100] {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin: 16px 0 8px;
}
i[data-v-101] {
    width: 3px;
    height: 13px;
    display: inline-block;
    vertical-align: bottom;
    background: #333;
    margin-right: 8px;
    position: relative;
    top: -4px;
}`;
    document.getElementsByTagName("head")[0].appendChild(style);
    var oldpathname="";
    function downLoad(filename, text) {
        var pom = document.createElement("a");
        pom.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        pom.setAttribute("download", filename);
        if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }
    function addZero(str,num){
        while(str.length<num){
            str = "0"+str;
        }
        return str;
    }
    var ccid;
    var name = "";
    function createDownLoadE(q){
        var download = document.createElement("a");
        download.className = "download";
        download.setAttribute("data-v-100","");
        download.onclick = function(){
            var xhr3 = new XMLHttpRequest();
            xhr3.open("POST","/api/v1/lms/service/s_t_g_p/", true);
            xhr3.setRequestHeader('content-type', 'application/json');
            xhr3.onload = function(e) {
                var subtitle_list = JSON.parse(e.currentTarget.response).data;
                for(let j=0;j<subtitle_list.length;j++){
                    var xhr33 = new XMLHttpRequest();
                    xhr33.open("GET",subtitle_list[j].data, true);
                    xhr33.onload = function(e) {
                        var vttdata = JSON.parse(e.currentTarget.response);
                        var text = "";
                        for(var i=0;i<vttdata.start.length;i++){
                            var ms_s = addZero((vttdata.start[i]%1000).toFixed(0),3);
                            var s_s = addZero(parseInt(vttdata.start[i]%60000/1000).toFixed(0),2);
                            var m_s = addZero(parseInt(vttdata.start[i]%3600000/60000).toFixed(0),2);
                            var h_s = addZero(parseInt(vttdata.start[i]/3600000).toFixed(0),2);
                            var ms_e = addZero((vttdata.end[i]%1000).toFixed(0),3);
                            var s_e = addZero(parseInt(vttdata.end[i]%60000/1000).toFixed(0),2);
                            var m_e = addZero(parseInt(vttdata.end[i]%3600000/60000).toFixed(0),2);
                            var h_e = addZero(parseInt(vttdata.end[i]/3600000).toFixed(0),2);
                            text += `${i}\n${h_s}:${m_s}:${s_s}.${ms_s} --> ${h_e}:${m_e}:${s_e}.${ms_e}\n${vttdata.text[i]}\n\n`;
                        }
                        downLoad(`${name}(${j}).srt`, text);
                    };
                    xhr33.send(null);
                }
            };
            xhr3.send(JSON.stringify({c_d: ccid}));
            var xhr4 = new XMLHttpRequest();
            xhr4.open("GET",`/api/v1/lms/service/playurl/${ccid}/?appid=10000`, true);
            xhr4.onload = function(e) {
                var video_list = JSON.parse(e.currentTarget.response).data.sources[`quality${q}`];
                for(var i=0;i<video_list.length;i++){
                    var src = video_list[i].replace("http","https").replace(".com/",".com/download/")+`&name=${name}`;
                    var eleLink = document.createElement('a');
                    eleLink.download = src;
                    eleLink.style.display = 'none';
                    eleLink.href = src;
                    eleLink.target = "_blank";
                    document.body.appendChild(eleLink);
                    eleLink.click();
                    document.body.removeChild(eleLink);
                }
            };
            xhr4.send(null);
        };
        return download;
    }
    function downLoadOneVideo(){
        var path = window.location.pathname.split('/');
        var sign = path[2];
        var cid = path[4];
        if(path[5]=="video"){
            var vid = path[6];
            var download10 = createDownLoadE(10);
            var download20 = createDownLoadE(20);
            var xhr1 = new XMLHttpRequest();
            var url_leaf = `/api/v1/lms/learn/course/chapter?cid=${cid}&sign=${sign}`;
            xhr1.open("GET",url_leaf,true);
            xhr1.onload = function(e) {
                var chapter = JSON.parse(e.currentTarget.response).data.course_chapter;
                var all_leaf_list = [];
                for(var i=0;i<chapter.length;i++){
                    var section_leaf_list = chapter[i].section_leaf_list;
                    if(section_leaf_list)
                        for(var j=0;j<section_leaf_list.length;j++){
                            var leaf_list = section_leaf_list[j].leaf_list;
                            if(leaf_list)
                                for(var k=0;k<leaf_list.length;k++){
                                    // if(leaf_list[k].leaf_type === 0)
                                    all_leaf_list.push({name:leaf_list[k].name,id:leaf_list[k].id});
                                }
                        }
                }
                var timerL = setInterval(function(){
                    if(document.querySelectorAll(".third li.title")){
                        clearInterval(timerL);
                        document.querySelectorAll(".third li.title").forEach((item,i)=>{
                            if(item.className === "title active"){
                                var vid = all_leaf_list[i].id;
                                name = all_leaf_list[i].name;
                            }
                        });
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("GET",`/api/v1/lms/learn/leaf_info/${cid}/${vid}/?sign=${sign}`, true);
                        xhr2.setRequestHeader('content-type', 'application/json');
                        xhr2.onload = function(e) {
                            var leaf = JSON.parse(e.currentTarget.response).data.content_info;
                            // console.log(leaf);
                            ccid = leaf.media.ccid;
                            var size = leaf.media.size;
                            download10.innerHTML =`<i data-v-100="" class="iconfont">顦�</i> 
<span data-v-100="" class="text hassize">瑙嗛瀛楀箷涓嬭浇(鏍囨竻)</span> 
<i data-v-100="" class="line"></i> 
<span data-v-100="" class="size">${size<1024?`${size}B`:(size<1024*1024?`${(size/1024).toFixed(1)}K`:`${(size/1024/1024).toFixed(1)}M`)}</span>`;
                            download20.innerHTML =`<i data-v-100="" class="iconfont">顦�</i> 
<span data-v-100="" class="text hassize">瑙嗛瀛楀箷涓嬭浇(楂樻竻)</span> 
<i data-v-100="" class="line"></i> 
<span data-v-100="" class="size">${size<1024?`${size}B`:(size<1024*1024?`${(size/1024).toFixed(1)}K`:`${(size/1024/1024).toFixed(1)}M`)}</span>`;
                            var timerE = setInterval(function(){
                                if(document.querySelector('.hover_overflow div')){
                                    clearInterval(timerE);
                                    var list_element = document.createElement('div');
                                    list_element.className = 'list dvideo';
                                    list_element.innerHTML = `<p data-v-100="" class="t1"><i data-v-101=""></i>瑙嗛</p>`;
                                    if(document.querySelector('.hover_overflow div .dvideo'))
                                        document.querySelector('.hover_overflow div').removeChild(document.querySelector('.hover_overflow div .dvideo'));
                                    list_element.appendChild(download10);
                                    list_element.appendChild(download20);
                                    document.querySelector('.hover_overflow div').insertBefore(list_element,document.querySelector('.hover_overflow div .lesson_video'));
                                }
                            },100);
                            setTimeout(function(){ 
                                clearInterval(timerE);
                            },1000);
                        };
                        xhr2.setRequestHeader('xtbz', 'xt');
                        xhr2.send();
                    }
                },100);
            };
            xhr1.setRequestHeader('xtbz', 'xt');
            xhr1.send(null);
        } else if(path[5]=="article"){
            var timerA = setInterval(function(){
                if(document.querySelector('p.title')){
                    clearInterval(timerA);
                    var ad = document.createElement('span');
                    ad.className = 'dactive';
                    ad.innerHTML = '<a>涓嬭浇</a>';
                    var title = document.querySelector('p.title');
                    while(title.lastChild.className=='dactive'){
                        title.removeChild(title.lastChild);
                    }
                    title.appendChild(ad);
                    ad.onclick = function(){
                        var aname = document.querySelector('p.title').firstChild.wholeText.trim();
                        var markdown = turndownService.turndown(document.getElementById('article-content-box'));
                        markdown = markdown.replace(/\*\*\*\*/g,"** **");
                        downLoad(`${aname}.md`, markdown);
                    };
                }
            },100);
        }
    }
    // downLoadOneVideo();
    var timerL = setInterval(function(){
        if(document.getElementsByClassName('listScroll')){
            clearInterval(timerL);
            document.getElementsByClassName('listScroll')[0].onclick = function(){
                // console.log('listScroll');
                var timerP = setInterval(function(){
                    if(window.location.pathname !== oldpathname){
                        // console.log(oldpathname);
                        oldpathname = window.location.pathname;
                        clearInterval(timerP);
                        // console.log(oldpathname);
                        downLoadOneVideo();
                    }
                },200);
                setTimeout(function(){ clearInterval(timerP); },3000);
            };
        }
    },300);
    // Your code here...
})();