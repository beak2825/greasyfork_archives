// ==UserScript==
// @name         唱吧下载器
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  在听歌页面，提供该用户的所有歌曲下载
// @author       cw2012
// @match        http*://changba.com/s/*
// @icon         https://changba.com/favicon.ico
// @connect      *
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/419197/%E5%94%B1%E5%90%A7%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/419197/%E5%94%B1%E5%90%A7%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

// 2021-01 歌手个人主页已不可用： http*://changba.com/u/*

function newSong(id, name,enworkid, hasMV){
    let song = new Object();
    song.id = id;
    song.name = name;
    song.enworkid = enworkid;
    song.hasMV = hasMV;
    return song;
}

// 利用blob下载文件
function downloadFileByBlob(blobContent, filename) {
    const blobUrl = URL.createObjectURL(blobContent)
    const eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    eleLink.href = blobUrl
    eleLink.click();
}
(function() {
    'use strict';

    //首先禁止自动播放，烦死了
    let audioEle = document.getElementById('audio');
    if(audioEle){
        audioEle.autoplay = false;
    }
    insertCss();
    let userId, userName=document.querySelector('.ulevel').innerText;
    let pageIndex = 0, curSongIndex = 0;
    let songList = [], songCount, zip, mvCount = 0;
    $('span.info').css('width','60px');
    let sibling = document.querySelector('span.fav');
    sibling.parentNode.innerHTML = '<span class="export info" style="width:60px" data-status="0" id="btn_download"><em>下载</em></span>'+ sibling.parentNode.innerHTML;
    document.getElementById('btn_download').addEventListener('click',()=>{
        if(audioEle){
            GM_download({
                url: audioEle.src,
                name: `${userName}-${$('.title').html()}.mp3`
        });
        }else{
            GM_download({
                url:document.getElementById('jp_video_0').src,
                name: `${userName}-${$('.title').html()}.mp4`
            });
        }
    });
    addListBox();
    analysisSongList();

    function addListBox(){
        let listBox= document.createElement('div');
        listBox.id = 'songListBox';
        let titleDiv = document.createElement('div');
        titleDiv.className ='widget-header-simple song-list-title';
        titleDiv.innerHTML = '<p id="songListTitle" style="font-size:16px">正在解析用户作品列表</p>';
        listBox.append(titleDiv);
        document.body.append(listBox);
    }
    function analysisSongList(){
        userId = document.querySelector('.focus').getAttribute('data-userid');
        let tmpEle = document.querySelectorAll('.ulevel>a.uname')[0];
        tmpEle.onclick = ()=>{window.open('https://changba.com/wap/index.php?s='+document.querySelector('.focus').getAttribute('data-userid'),'_blank')};
        updateSongList();
    }
    function updateSongList(){
        GM_xmlhttpRequest({
            url: `https://changba.com/member/personcenter/loadmore.php?ver=1&pageNum=${pageIndex>0?pageIndex:''}&type=0&userid=${userId}`,
            method: 'get',
            timeout: 15000,
            responseType : 'json',
            onload: res=>{
                pageIndex++;
                const data = res.response;
                if(data.length>0){
                    for(var i = 0; i< data.length;i++){
                        if(data[i].ismv ==`style='display:inline'`){
                            songList.push(newSong(data[i].workid, data[i].songname, data[i].enworkid, true));
                            mvCount++;
                        }else{
                            songList.push(newSong(data[i].workid, data[i].songname, data[i].enworkid, false));
                        }
                    }
                    updateSongList();
                }else{
                    showSongList();
                }
            },
            ontimeout:()=>{console.log('获取列表超时'+pageIndex)},
            onerror: err=>{
                alert(`获取歌曲列表失败`);
            }
        });
    }
    function showSongList(){
        document.getElementById('songListTitle').innerText = `该用户有${songList.length}首歌${mvCount?('(其中包含'+mvCount+'个MV)'):''}`;
        let songListDiv = document.createElement('div');
        songListDiv.className = 'songList';
        let ol = document.createElement('ol');
        songList.forEach((item,index)=>{
            let li = document.createElement('li');
            li.className = 'song';
            let a = document.createElement('a');
            a.innerText = '下载';
            a.href = '#';
            let span = document.createElement('span');
            span.innerText = item.name;
            if(item.hasMV){
                let img = document.createElement('img');
                img.className = 'mv';
                img.src='https://www.zhangxinxu.com/study/image/pixel.gif';
                span.append(img);
            }
            a.addEventListener('click',()=>{
                downloadSingleSong(item,a);
            });
            li.append(span);
            li.append(a);
            a = document.createElement('a');
            a.innerText = '查看';
            a.href = 'https://changba.com/s/' + item.enworkid;
            li.append(a);
            ol.append(li);
        });
        songListDiv.append(ol);
        document.getElementById('songListBox').append(songListDiv);
    }
    function downloadSingleSong(song,a){
        let id= song.id, name=song.name,enworkid=song.enworkid;
        let fileName = `${userName}-${name}${song.hasMV?'.mp4':'.mp3'}`;
        let progress = document.createElement('progress');
        progress.value= 0;
        progress.max = 100;
        GM_xmlhttpRequest({
            url: `https://changba.com/s/${enworkid}`,
            method: 'get',
            timeout: 5000,
            onload: res =>{
                let html = res.responseText;
                let index = html.indexOf(song.hasMV?'video_url:':'commonObj.url');
                if(index!=-1){
                    html = html.substr(index, 200);
                    html = html.match(/'[\w/=+]+'/g)[0];
                    html = html.substr(1, html.length -2);
                    let url = getMp3Url(html);
                    if(song.hasMV)
                        url = 'http:'+getMp4Url(url);
                    a.parentElement.insertBefore(progress, a);
                    GM_download({
                        url: url,
                        name: fileName,
                        onprogress: prog=>{progress.value = prog.loaded;progress.max = prog.total;},
                        onload: res=>{ progress.remove();},
                        ontimeout: res=>{alert(`下载"${fileName}"超时，请重试`); progress.remove();},
                        onerror:res=>{alert(`下载"${fileName}"出错，请重试`); progress.remove();}
                    });
                }
            }
        });
    }
    function getMp3Url(html){
        var km= 'a17fe74e421c2cbf3dc323f4b4f3a1af' , iv = CryptoJS.enc.Utf8.parse(km.substring(0,16))
        , iv2 = CryptoJS.enc.Utf8.parse(km.substring(16))
        , audio_url = '';
        audio_url = CryptoJS.AES.decrypt(html, iv2, {
            'iv': iv,
            'padding': CryptoJS.pad.Pkcs7
        })['toString'](CryptoJS.enc.Utf8);
        return audio_url;
    }
    function getMp4Url(origin_video_url){
        var arr = new Array(-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,0x3e,-0x1,-0x1,-0x1,0x3f,0x34,0x35,0x36,0x37,0x38,0x39,0x3a,0x3b,0x3c,0x3d,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xa,0xb,0xc,0xd,0xe,0xf,0x10,0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,-0x1,-0x1,-0x1,-0x1,-0x1,-0x1,0x1a,0x1b,0x1c,0x1d,0x1e,0x1f,0x20,0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2a,0x2b,0x2c,0x2d,0x2e,0x2f,0x30,0x31,0x32,0x33,-0x1,-0x1,-0x1,-0x1,-0x1);
        var charCode1, charCode2, charCode3, charCode4, i, length, resultStr;
        for (length = origin_video_url['length'],
             i = 0x0,
             resultStr = ''; i < length;) {
            do {
                charCode1 = arr[0xff & origin_video_url['charCodeAt'](i++)];
            } while (i < length && -0x1 == charCode1);
            if (-0x1 == charCode1)
                break;
            do {
                charCode2 = arr[0xff & origin_video_url['charCodeAt'](i++)];
            } while (i < length && -0x1 == charCode2);
            if (-0x1 == charCode2)
                break;

            resultStr += String['fromCharCode'](charCode1 << 0x2 | (0x30 & charCode2) >> 0x4);
            do {
                if (0x3d == (charCode3 = 0xff & origin_video_url['charCodeAt'](i++)))
                    return resultStr;
                charCode3 = arr[charCode3];
            } while (i < length && -0x1 == charCode3); if (-0x1 == charCode3)
                break;
            resultStr += String['fromCharCode']((0xf & charCode2) << 0x4 | (0x3c & charCode3) >> 0x2);
            do {
                if (0x3d == (charCode4 = 0xff & origin_video_url['charCodeAt'](i++)))
                    return resultStr;
                charCode4 = arr[charCode4];
            } while (i < length && -0x1 == charCode4); if (-0x1 == charCode4)
                break;
            resultStr += String['fromCharCode']((0x3 & charCode3) << 0x6 | charCode4);
        }
        return resultStr;
    }

    // 显示下载进度
    function progress(){
        let bar = document.getElementById('progressBar');
        if(bar){
            document.getElementById('prog-num').innerText = `正在下载：${curSongIndex + 1}/${songCount}`;
            document.getElementById('song-name').innerText = songList[curSongIndex].name;
            if(curSongIndex + 1 == songCount){
                bar.remove();
            }
            return;
        }
        let progressBox = document.createElement('div');
        progressBox.id = 'progressBar';
        progressBox.style.position = 'fixed';
        progressBox.style.background='white';
        progressBox.style.borderRadius='10px';
        progressBox.style.background= `rgb(255 80 70)`;
        progressBox.style.border = 'solid white 1px';
        progressBox.style.boxShadow='0 8px 16px 0 rgba(0,0,0,.2), 0 6px 20px 0 rgba(0,0,0,.19)';
        progressBox.style.color = '#fff';
        progressBox.style.bottom='200px';     // 显示的位置不能离底部太低了，会被其他元素遮挡
        progressBox.style.left='2vh';
        progressBox.style.transition='1.5s';
        progressBox.style.padding = '10px';
        let progNum = document.createElement('p');
        progNum.id = 'prog-num';
        progNum.innerText = `1/${songCount}`;
        let downName = document.createElement('p');
        downName.id = 'song-name';
        downName.innerText='正在下载...';
        progressBox.append(progNum);
        progressBox.append(downName);
        document.body.appendChild(progressBox);
    }
})();

function insertCss(){
    var style=document.createElement('style');
    const myStyle = `
#songListBox{
position:fixed;
height:400px;
width:400px;
border-radius:0px 10px 10px 0px;
box-shadow:#fba9a9 3px 4px 40px 1px;
top:100px;
}
.widget-header-simple.song-list-title{
color:#fff;
text-align:center;
display:flex;
align-items:center;
justify-content:center;
border-radius:0px 10px 0px 0px;
}
ol{
padding:10px;
}
li.song{
margin:10px 0;
font-size:14px;
color:black;
    padding: 5px;
    background: #ffeded;
display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
}
li.song span{
width: 210px;
}
div.songList{
overflow: scroll;
    overflow-y: auto;
    overflow-x: hidden;
    height: 330px;
}
.mv{
background: url(https://greasyfork.s3.us-east-2.amazonaws.com/xv0qosox3hocgp4jni3qydurnlom) no-repeat;
background-size: 100% 100%;
    width: 25px;
    height: 25px;
margin-left: 4px;
}
li a {
    color: #ff142e;
}
/*进度条的样式*/
progress{
width:40px;
height:15px;
}

progress::-webkit-progress-value
{
     background-color:#ff0040;
}
`;
    style.type='text/css';
    if(style.styleSheet){
        style.styleSheet.cssText=myStyle;
    }else{
        style.appendChild(document.createTextNode(myStyle));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}