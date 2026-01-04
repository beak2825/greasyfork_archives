// ==UserScript==
// @name         MyBilibili
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  b站主页面视频推荐挂载脚本，可以下载b站视频（最新版包括互动视频，番剧）呦~~~
// @author       N-cat
// @match        https://api.bilibili.com/x/web-interface/dynamic/region?ps=*&rid=*
// @match        *://www.bilibili.com/
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/444136/MyBilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/444136/MyBilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // api及参数说明来自 https://zhuanlan.zhihu.com/p/210779665
    const style = `<style>
    .add-main{
        margin:auto;
        width:1100px;
        z-index:999999;
    }
    .add-div{
        width: 206px;
        height: 206px;
        display:inline-block;
        padding:7px 7px 7px 7px;
        box-sizing:content-box;
        position:relative;
        z-index:999999;
    }
    .add-a{
        color: #212121;
        margin: 10px 0 8px;
        height: 40px;
        text-decoration: none;
        width: 206px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 14px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color .3s;
        z-index:999999;
    }
    .add-a:hover{
        color: #00a1d6;
        transition: color .3s;
        z-index:999999;
    }
    .add-img{
        width: 206px;
        height: 116px;
        border-radius: 2px;
        z-index:999999;
    }
    .add-author{
        color:#999;
        text-decoration: none;
        transition: color .3s;
        font-size: 12px;
        z-index:999999;
    }
    .add-author:hover{
        color: #00a1d6;
        transition: color .3s;
        z-index:999999;
    }
    .re{
        position:fixed;
        right:80px;
        bottom:80px;
        background-color:#00a1d6;
        color:white;
        height:50px;
        width:50px;
        border-radius: 10px;
        font-size:15px;
        border:solid 3px #FA5A57;
        cursor:pointer;
        outline: none;
        z-index:999999;
    }
    .top{
        position:fixed;
        right:80px;
        bottom:150px;
        background-color:#00a1d6;
        color:white;
        height:50px;
        width:50px;
        border-radius: 10px;
        font-size:15px;
        border:solid 3px #FA5A57;
        cursor:pointer;
        outline: none;
        z-index:999999;
    }
    .add-bds{
        position: absolute;
        height: 22px;
        width: 206px;
        top: 101px;
        color: white;
        font-size: 14px;
        background-color: rgba(0,0,0,.6);
        // text-align: center;
        border-radius: 2px;
        z-index:999999;
    }
    .jindu{
        position:fixed;
        right:80px;
        bottom:40px;
        background-color:#00a1d6;
        width: 80px;
        color:white;
        border-radius: 10px;
        height: 20px;
        border:solid 3px #FA5A57;
        outline: none;
        cursor:default;
        text-align: center;
        font-size: 10px;
        z-index:999999;
    }
    </style>`;
    var ps = 50; // 页数
    var rid = 1; // 类型（1:综合）
    // var cookie = document.cookie;
    // console.log(cookie)
    var data
    // api删除原数据
    var pre = document.getElementsByTagName('pre')
    if(pre.length != 0){
        pre[0].remove();
    }
    // 主站隐藏原数据(旧)
    var olddiv = document.getElementsByClassName('b-wrap');
    for(let i in olddiv){
        if(i > 1){
            olddiv[i].style.display = "none";
        }
    }
    olddiv = document.getElementsByClassName('international-footer');
    if(olddiv.length != 0){
        olddiv[0].style.display = "none";
    }
    // 主站隐藏原数据(新)
    var newdiv = document.getElementsByClassName('bili-layout');
    if(newdiv.length != 0){
        newdiv[0].style.display = "none";
    }
    // 请求推荐api
    function getvideo(){
        GM_xmlhttpRequest({
            url:"https://api.bilibili.com/x/web-interface/dynamic/region?ps=" + ps + "&rid=" + rid,
            // url:"https://api.bilibili.com/x/web-interface/popular?ps=50&pn=10",
            method:"get",
            // cookie:cookie,
            onload:function(xhr){
                data = JSON.parse(xhr.response)
                console.log(data.data.archives)
                // 添加元素
                let div = document.createElement("div");
                div.classList.add('add-main');
                for(let i of data.data.archives){
                    //div.innerHTML += '<div class="add-div">'
                    //div.innerHTML += '<a href="https://www.bilibili.com/video/' + i.bvid + '" target="_blank"><img class="add-img" src="' + i.pic + '" /></a><br>'
                    //div.innerHTML += '<a class="add-a" href="https://www.bilibili.com/video/' + i.bvid + '" target="_blank">' + i.title + '</a></div>';
                    // 视频总div
                    let id = document.createElement("div");
                    div.appendChild(id);
                    id.classList.add('add-div');
                    // 图片链接
                    let a1 = document.createElement("a");
                    id.appendChild(a1);
                    a1.innerHTML = '<img class="add-img" src="' + i.pic + '" />'
                    a1.setAttribute('href',"https://www.bilibili.com/video/" + i.bvid );
                    a1.setAttribute('target',"_blank");
                    // 文字链接
                    let a2 = document.createElement("a");
                    id.appendChild(a2);
                    a2.classList.add('add-a');
                    a2.setAttribute('href',"https://www.bilibili.com/video/" + i.bvid );
                    a2.setAttribute('target',"_blank");
                    // 文字
                    let txt = document.createTextNode(i.title);
                    a2.appendChild(txt);
                    // 作者
                    let a3 = document.createElement("a");
                    id.appendChild(a3);
                    a3.classList.add('add-author');
                    a3.setAttribute('href',"https://space.bilibili.com/" + i.owner.mid );
                    a3.setAttribute('target',"_blank");
                    let author = document.createTextNode(i.owner.name);
                    a3.appendChild(author);
                    // 播放量，点赞，时常
                    let bds = document.createElement("div");
                    bds.classList.add('add-bds');
                    let b = i.stat.view;
                    if(i.stat.view >= 10000){
                        b = (i.stat.view/10000).toFixed(1) + '万'
                    }
                    let d = i.stat.like;
                    if(i.stat.like >= 10000){
                        d = (i.stat.like/10000).toFixed(1) + '万'
                    }
                    let s = i.duration;
                    if(i.duration >= 3600){
                        let mm = parseInt((i.duration%3600)/60);
                        if(mm < 10){
                            mm = '0' + mm;
                        }
                        let ss = i.duration%60;
                        if(ss < 10){
                            ss = '0' + ss;
                        }
                        s = parseInt(i.duration/3600) + ':' + mm + ':' + ss;
                    } else if(i.duration <= 3600 && i.duration >= 60){
                        let mm = parseInt(i.duration/60);
                        if(mm < 10){
                            mm = '0' + mm;
                        }
                        let ss = i.duration%60;
                        if(ss < 10){
                            ss = '0' + ss;
                        }
                        s = mm + ':' + ss;
                    } else {
                        let ss = i.duration%60;
                        if(ss < 10){
                            ss = '0' + ss;
                        }
                        s = '00:' + ss
                    }
                    bds.innerHTML = '<span style="padding-left:10px;float:left;line-height:22px"> ▶ ' + b + ' ❤ ' + d + '</span><span style="padding-right:10px;float:right;line-height:22px">' + s + '</span>';
                    id.appendChild(bds);
                }
                div.innerHTML += style;
                // 设置添加位置
                var header = document.getElementsByClassName('bili-layout');
                if(header.length != 0){
                    header[0].parentNode.insertBefore(div, header[0]); // 新
                } else {
                    document.body.append(div); // 旧
                }
            }
        })
    }
    function getQueryVariable(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    // 进度条
    let jindu = document.createElement("input");
    jindu.classList.add('jindu');
    jindu.setAttribute("value", "下载进度条");
    jindu.setAttribute("readonly", "true");
    document.body.append(jindu);
    // 请求事件监听（每0.5s输出一次）
    var ms= 500;
    var lastClick = Date.now() - ms;
    function downloadProgress(event, type) {
    // 如果lengthComputable属性的值是false，那么意味着总字节数是未知并且total的值为零
        if ((event.lengthComputable && Date.now() - lastClick >= ms) || event.loaded == event.total) {
            let progress = event.loaded / event.total * 100;
            jindu.setAttribute("value", `${type}下载${progress.toFixed(0)}%`);
            console.log(`${type}下载${progress.toFixed(0)}%`);
            // 更新时间
            lastClick = Date.now();
        }
    }
    getvideo();
    var url = window.location.href;
    var btn = document.createElement("input");
    // 创建blob下载
    function downloadVideo(data, filename, type, page){
        try {
            // 文件流可以自定义文件名
            var blob = new Blob([data], { type: `${type}/mp4` });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `${filename}-P${page}-${type}.mp4`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // 释放 URL
            console.log(`下载成功: ${filename}-P${page}-${type}.mp4`);
        } catch (error) {
            console.error("下载失败: ", error);
        }
    }
    // 下载视频或音频
    function download(url, name, type, page){
        GM_xmlhttpRequest({
            url: url,
            method: "GET",
            responseType: 'blob',
            // cookie:document.cookie,
            headers: {
                'Referer': 'https://www.bilibili.com', // 根据实际情况设置
                // 'Cookie':document.cookie,
            },
            onload: function(xhr) {
                console.log("下载完成");
                console.log(xhr.response)
                downloadVideo(xhr.response, name, type, page);
            },
            onerror: function(error) {
                console.error("下载失败", error);
            },
            onprogress: function(progress) {
                downloadProgress(progress, type);
            }
        });
    }
    // 获下载链接
    function getUrl(name, bv, cid, mod, page) {
        var url = 'https://api.bilibili.com/x/player/playurl?bvid='+bv+'&cid='+cid+'&qn=120';
        console.log(url);
        if(mod == 3 || mod == 2){
            url += '&fnval=4048';
        }
        GM_xmlhttpRequest({
            url:url,
            method:"get",
            // cookie:cookie,
            onload:function(xhr){
                data = JSON.parse(xhr.response)
                console.log(data);
                var con = confirm('确认后视频开始下载，请耐心等待...\n下载视频及音频：'+name+'-P'+page);
                if(con == true){
                    if(mod == 3 || mod == 2){
                        var videourl = data.data.dash.video[0].baseUrl;
                        console.log(videourl);
                        download(videourl, name, "video", page);
                        var audiourl = data.data.dash.audio[0].baseUrl;
                        console.log(audiourl);
                        download(audiourl, name, "audio", page);
                    } else {
                        var allurl = data.data.durl[0].url;
                        download(allurl, name, "all", page);
                    }
                }
                // 复制视频音频合并软件链接到剪切板
                const input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', "https://gitee.com/z2322739526/mybilibili/blob/master/%E5%90%88%E5%B9%B6%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91.exe");
                input.select(); // 选取文本域的内容
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    console.log('复制成功');
                }
                document.body.removeChild(input);
            }
        });
    }
    if(url.split('/')[3] == 'video' || url.split('/')[3] == "bangumi"){
        // 下载按钮
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "下载");
        btn.classList.add('re');
        document.body.append(btn);
        var page = 1;
        var bv = "";
        btn.onclick = function(){
            var page = 1;
            var bv = "";
            // 番剧类型获取bv
            if(url.includes('www.bilibili.com/bangumi/play')){
                const parentElement = document.querySelector('.mediainfo_mediaRight__SDOq4');
                const divElement = parentElement.getElementsByTagName('div')[1]; // 第二个div（索引1）
                const spanElement = divElement.getElementsByTagName('span')[3]; // 第四个span（索引3）
                bv = spanElement.textContent;
            } else {
                bv = url.split('/')[4].split('?')[0];
                if(getQueryVariable('p')){
                    page = getQueryVariable('p');
                }
            }
            console.log('bvid:' + bv);
            GM_xmlhttpRequest({
                url:'https://api.bilibili.com/x/web-interface/view/detail?bvid='+bv,
                method:"get",
                // cookie:cookie,
                onload:function(xhr){
                    data = JSON.parse(xhr.response);
                    console.log(data);
                    console.log(data.data.View);
                    var name = data.data.View.title;
                    var cid = data.data.View.pages[page-1].cid;
                    // cid = 268123629 // test
                    var aid = data.data.View.aid;
                    var part = data.data.View.pages[page-1].part;
                    console.log('aid:' + aid);
                    console.log('cid:' + cid);
                    // 判断是否是互动视频
                    // https://api.bilibili.com/x/player/wbi/v2?bvid=BV1DK411u7QX&cid=267642140
                    // https://api.bilibili.com/x/stein/nodeinfo?bvid=BV1DK411u7QX&graph_version=397257
                    GM_xmlhttpRequest({
                        url:'https://api.bilibili.com/x/player/wbi/v2?bvid='+bv+'&cid='+cid,
                        method:"get",
                        // cookie:cookie,
                        onload:function(xhr){
                            data = JSON.parse(xhr.response)
                            console.log(data);
                            var graph_version = 0;
                            if('interaction' in data.data){
                                console.log('互动视频graph_version:' + data.data.interaction.graph_version);
                                graph_version = data.data.interaction.graph_version;
                            } else {
                                console.log('未检测到interaction字段，该视频非互动视频');
                            }
                            var mod = 1; // 默认1直接完整视频，2视频音频分别下载，3互动视频
                            if(graph_version != 0){
                                // 互动视频
                                GM_xmlhttpRequest({
                                    url:'https://api.bilibili.com/x/stein/nodeinfo?bvid='+bv+'&graph_version='+graph_version,
                                    method:"get",
                                    // cookie:cookie,
                                    onload:function(xhr){
                                        data = JSON.parse(xhr.response)
                                        console.log(data);
                                        var story_list = data.data.story_list;
                                        var outlist = {}
                                        var outtext = "检测到该视频为互动视频，视频音频合并软件链接将在确认后复制到剪切板，请输入下载视频名称对应id：\n"
                                        for(let i of story_list){
                                            outlist[i.cursor] = [i.title, i.cid];
                                            // outtext += 'id：' + i.cursor + '-' + i.title + '，';
                                            outtext += `${i.title}（id=${i.cursor}）;`
                                        }
                                        var id = 0; // 默认为0
                                        id = prompt(outtext);
                                        cid = outlist[id][1];
                                        name += "-" + outlist[id][0];
                                        console.log('互动视频cid:' + cid);
                                        mod = 3;
                                        getUrl(name, bv, cid, mod, page);
                                    }
                                });
                            } else {
                                // 非互动视频
                                mod = prompt("请选择下载模式id：\nid：1-直接下载视频，画质较低（默认）\nid：2-分别下载视频音频，画质较高（视频音频合并软件链接将在确认后复制到剪切板）")
                                getUrl(name, bv, cid, mod, page);
                            }
                        }
                    });
                }
            });
        }
    }else{
        // 刷新按钮
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "刷新");
        btn.classList.add('re');
        document.body.append(btn);
        btn.onclick = function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var dd = document.getElementsByClassName('add-main');
            for(let j of dd){
                j.style.display = "none";
            }
            getvideo(); // 请求后刷新也会请求一次，这里待优化
        }
    }
    // 顶部按钮
    var top = document.createElement("input");
    top.setAttribute("type", "button");
    top.setAttribute("value", "顶部");
    top.classList.add('top');
    document.body.append(top);
    top.onclick = function(){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    // 下拉刷新
    let timeout = null;
    window.onscroll = function() {
      const scrollH = document.documentElement.scrollHeight;// 文档的完整高度
      const scrollT = document.documentElement.scrollTop || document.body.scrollTop; // 当前滚动条的垂直偏移
      const screenH = window.screen.height; // 屏幕可视高度
      if ((scrollH - scrollT - screenH) < 500) { // 只是一个相对值，可以让页面再接近底面的时候就开始请求
          timeout && clearTimeout(timeout); // 判断timeout是否在执行
          timeout = setTimeout(() => {
              console.log('下拉刷新')
              getvideo();
          }, 3000); // api在3s内请求返回重复内容
      }
    };
})();