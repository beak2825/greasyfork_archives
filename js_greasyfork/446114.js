// ==UserScript==
// @name         JS网易云音乐下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网易云音乐一键下载
// @author       HUI
// @match        https://music.163.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446114/JS%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/446114/JS%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('开始');
    //声明两个数组存储id,name
    var allid=[]
    var allname=[]
    //setTimeoutsetTimeout(function(){
    $(document).ready(function(){
        console.log('开始执行');
        var z=document.getElementsByClassName("f-ff2")//返回的z是数组
        var j=0;
        while(z[j]){
            z[j].addEventListener("click", downloadclick);//易错： z 是数组，所以必须是z[i]否则为 null
            z[j].innerHTML = '开始下载';
            j++
        }
        console.log('点击事件添加成功');
        function downloadclick() {
            //获取歌单长度
            var leng=Number(document.getElementById("playlist-track-count").innerHTML);
            console.log(leng)
            //document.getElementsByClassName("f-ff2").innerHTML = '开始下载';
            console.log('开始获取')
            var x = document.getElementsByTagName("tbody");
            var j=0;
            //此处为获取name,id
            while(x[j]&&j<leng){
                var y = x[j].getElementsByTagName("tr");
                console.log('y已获取')
                j++
                var i=0;
                while(y[i] && y[i].getElementsByTagName("b")!== 'undefined'&&i<leng){
                    //console.log(y[i].id)
                    //获取歌曲id
                    var l=y[i].id.length
                    //console.log('l已获取')
                    var id = y[i].id.substring(0,l-13);
                    allid[i]=id
                    console.log(allid[i])
                    //获取歌曲名
                    var nameb = y[i].getElementsByTagName("b");
                    var t=0
                    while(nameb[t] && nameb[t].childNodes[1]!== 'undefined'){
                        nameb[t].removeChild(nameb[t].childNodes[1]);//清除名字中的div
                        //nameb[t].childNodes[1].remove()//清除名字中的div
                        var namea=nameb[t].innerHTML
                        var name = namea.replace(/&nbsp;/g, " ");
                        t++
                    }
                    allname[i]=name
                    console.log(allname[i])
                    i++
                }
            }
            console.log('id,name已获取')
            //id,name已获取
            //下载歌曲
            var k=0
            console.log(allid)
            console.log(allname)
            while(allid[k]){
                console.log('准备下载')
                //var song = document.createElement('a');
                //song.setAttribute('href','https://music.163.com/song/media/outer/url?id='+allid[k]+'.mp3');
                //song.setAttribute('download',allname[k] );
                //song.style.display = 'none';
                //document.body.appendChild(song);
                //setTimeout(song.click(), 1000)
                //document.body.removeChild(song);
                let url ='https://music.163.com/song/media/outer/url?id='+allid[k]+'.mp3';
                let name =allname[k];
                const downloadRes = async () => {
                    let response = await fetch(url); // 内容转变成blob地址
                    let blob = await response.blob(); // 创建隐藏的可下载链接
                    let objectUrl = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = objectUrl;
                    a.download = name;
                    a.click()
                    a.remove();
                }
                downloadRes();
                k++
            }
        }
    });
    //},3000);
    // Your code here...
})();