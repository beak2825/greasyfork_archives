// ==UserScript==
// @name         酷狗美化免费vip
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用动听的音乐温暖你我
// @author       煮酒
// @match        *://www.kugou.com/mixsong/*
// @match        *://www.kugou.com/song/*

// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/456126/%E9%85%B7%E7%8B%97%E7%BE%8E%E5%8C%96%E5%85%8D%E8%B4%B9vip.user.js
// @updateURL https://update.greasyfork.org/scripts/456126/%E9%85%B7%E7%8B%97%E7%BE%8E%E5%8C%96%E5%85%8D%E8%B4%B9vip.meta.js
// ==/UserScript==
console.log("==================================插件启动成功==================================")
let mp3_Hash = "";
let sq_hash = "";
let g_hash = "";
let albumid = "";
let mp3_Url = "";
let mp3_Name = "";
let url = "";
let download_url = "";
let download_hash = "";


window.location.href="https://www.kugou.com/song/#hash=";


// 添加按钮选择音质
var down_load_div = document.getElementsByClassName("btnArea2 clearfix")[0];
down_load_div.innerHTML = "";
// 超高音质
var button_ws = document.createElement("button");
button_ws.id = "down_load_ws";
button_ws.textContent = "下载超高音质(需设置flac为白名单)";
button_ws.style.width = "230px";
button_ws.style.height = "50px";
button_ws.style.color = "#fff";
button_ws.style.cursor = "pointer";
button_ws.style.background = "#000";
down_load_div.appendChild(button_ws);
// 高音质
var button_g = document.createElement("button");
button_g.id = "button_g";
button_g.textContent = "下载高音质";
button_g.style.width = "230px";
button_g.style.height = "50px";
button_g.style.color = "#fff";
button_g.style.cursor = "pointer";
button_g.style.background = "#000";
button_g.style.margin = "3px 0px";
down_load_div.appendChild(button_g);
// 普通音质
var button_mp3 = document.createElement("button");
button_mp3.id = "button_mp3";
button_mp3.textContent = "下载普通音质";
button_mp3.style.width = "230px";
button_mp3.style.height = "50px";
button_mp3.style.color = "#fff";
button_mp3.style.cursor = "pointer";
button_mp3.style.background = "#000";
down_load_div.appendChild(button_mp3);


var audio_au=document.getElementById('myAudio')
// 监听audio开始播放事件(事件在视频/音频（audio/video）开始播放时触发。)
audio_au.addEventListener("play", function () {
    // console.log("播放");
    vk=setInterval(abn,600);
    // 判断是否需要修改src属性
    if (audio_au.getAttribute("data-hash") != mp3_Hash) {
        getMp3Detail();
    }
})

// 监听audio暂停播放事件(事件在视频/音频（audio/video）停止播放时触发。)
audio_au.addEventListener("pause", function () {
    clearInterval(vk);
})


// 点击下载按钮 超高音质
button_ws.onclick = function () {
    if (download_url == mp3_Url) {
        alert(mp3_Name + " 已在下载中！")
    } else {
        downloadBySrc(mp3_Url);
    }
};
// 点击下载按钮 高音质
button_g.onclick = function () {
    if (g_hash == download_hash) {
        alert(mp3_Name + " 已在下载中！");
    } else {
        download_hash = g_hash;
        getMp3UrlSrc();
    }
};


// 点击下载按钮 普通音质
button_mp3.onclick = function () {
    if (mp3_Hash == download_hash) {
        alert(mp3_Name + " 已在下载中！");
    } else {
        download_hash = mp3_Hash;
        getMp3UrlSrc();
    }
};

// 点击下载按钮 超高音质
document.getElementById('pb_download').onclick = function () {
    if (download_url == mp3_Url) {
        alert(mp3_Name + " 已在下载中！")
    } else {
        downloadBySrc(mp3_Url);
        setTimeout(function () {
            document.getElementsByClassName('ui-popup ui-popup-show ui-popup-focus')[0].style.display = "none"
        }, 50)
    }
};

// 获取高音质或者普通音质的MP3地址并且下载
function getMp3UrlSrc() {
    url = "http://8.142.95.208:5001/url/byhash?hash=" + download_hash + "&albumid=" + albumid;
    GM_xmlhttpRequest({
        method: "get",
        url: url,
        onload: function (r) {
            let jsonTxt = r.responseText;
            let json = JSON.parse(jsonTxt);
            downloadBySrc(json.data.play_url);
        }
    })
}

// 点击下载 by url
function downloadBySrc(download_url_quality) {
    download_url = download_url_quality;
    let loaded = 0.0;
    NProgress.set(0.0);      // 与.start（）
    GM_download({
        url: download_url,
        name: mp3_Name + download_url.substr(download_url.lastIndexOf(".")), //不填则自动获取文件名
        saveAs: true, //布尔值，显示"保存为"对话框
        onerror: function (error) {
            //如果下载最终出现错误，则要执行的回调
            console.log(error)
            console.log(mp3_Name + "  下载报错，请反馈！");
        },
        onprogress: (pro) => {
            //如果此下载取得了一些进展，则要执行的回调
            // console.log(pro.loaded) //文件加载量
            // console.log(pro.totalSize) //文件总大小
            let size = (pro.loaded / pro.totalSize).toFixed(1);
            if (loaded != size) {
                loaded = size;
                NProgress.inc(0.1);
            }
        },
        ontimeout: () => {
            //如果此下载由于超时而失败，则要执行的回调
            console.log(mp3_Name + "下载超时，请反馈！");
        },
        onload: () => {
            //如果此下载完成，则要执行的回调
            console.log(mp3_Name + "   下载完成！");
            NProgress.done();
        }
    })
}

// 播放无损音质
function getSqMp3Play(url) {
    // get请求获取无损音质的信息
    GM_xmlhttpRequest({
        method: "get",
        url: url,
        onload: function (r) {
            let jsonTxt = r.responseText;
            let json = JSON.parse(jsonTxt);
            mp3_Url = json.data.play_url;
            mp3_Name = json.data.audio_name;
            document.getElementById('myAudio').src = mp3_Url;
            document.getElementById('openKugou').href = mp3_Url;
            if (document.getElementById('myAudio').paused) {
                document.getElementById('myAudio').play();
            }
            console.log(mp3_Name + mp3_Url.substr(mp3_Url.lastIndexOf(".")) + "   加载完成");
        }
    })
}

//隐藏原有进度条
down_yj=document.getElementById('bar');
down_yj.style.display="none";
// 添加进度条
down_j=document.getElementsByClassName("controls-bar")[0]
var button_m = document.createElement("progress");
button_m.id = "h";
button_m.style.width = "100%";
button_m.style.height = "3px";
button_m.style.color = "#fff";
button_m.style.cursor = "pointer";
button_m.style.background = "#000";
button_m.value = 0;
button_m.max = 0;
down_j.appendChild(button_m);


// 添加当前进度按钮
var button_ms = document.createElement("span");
button_ms.id = "h1";
button_ms.style.width = "13px";
button_ms.style.height = "13px";
// button_m.style.color = "#fff";
// button_ms.style.cursor = "span";
button_ms.style.position = "absolute";
button_ms.style.left =0;
button_ms.style.top ="51px";
// button_ms.textContent ="a";
button_ms.style.background="white";
button_ms.style.borderRadius="50%";
down_j.appendChild(button_ms);


//初始化
h1=document.getElementById("h1")
h2=document.getElementById("h")
aac=0;
v=1;
bb=0;
cc=0;
jia=0;
xx={};


//通过进度按钮调整进度条
h1.onmousedown=function(){
  v=0;
  document.onmousemove=function(event){
    xx={'x':event.pageX,'y':screenY};
    x=xx["x"];
    if(v==0){
      if (-1<jia && jia<362){
        cc=x-bb;
        if (cc<20){
          if(cc>-20){
            jia=jia+cc;
          }
        }
        console.log(jia)
        h1.style.left=jia+"px";
        h2.value=aac/362*jia;//进度条跟进
        bb=x
      }
    if(jia<0){
      jia=0
    }
    if(jia>361){
      jia=361
    }
    }
  }
}

//松开进度按钮时调整播放时间
document.onmouseup=function(){
  if(v==0){
    // console.log(jia);
    let video = document.getElementsByTagName('audio')
    video[0].currentTime = aac/362*jia;
  }
  v=1;
}

//实时更新进度条
abn= function skip() {
    if(v==1){
        var abc=document.getElementById('myAudio').currentTime;
        aac=document.getElementById('myAudio').duration;
        h2.value = abc;
        h2.max = aac;
        h1.style.left=364/aac*abc+"px";
    }
}

// 打开网页时检查是否播放音乐
// function c1(){
//     var video1 = document.getElementById('myAudio')
//     if(!video1.paused){
//       vk=setInterval(abn,600);
//     }else{
//       clearInterval(vk);
//       clearInterval(vk1);
//     }
// }
// vk1=setInterval(c1,600);


// js修改audio的src属性，即播放链接
function getMp3Detail() {
    mp3_Hash = document.getElementById('myAudio').getAttribute("data-hash");
    let play_hash = mp3_Hash;
    let searchQualityUrl = 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + play_hash;
    // 查询音质
    GM_xmlhttpRequest({
        method: "get",
        url: searchQualityUrl,
        onload: function (r) {
            let jsonTxt = r.responseText;
            let json = JSON.parse(jsonTxt);
            albumid = json.albumid.toString();
            g_hash = json.extra['320hash'];
            if (g_hash == '') {
                button_g.style.display = 'none';
            } else {
                button_g.style.display = 'block';
                play_hash = g_hash;
            }
            sq_hash = json.extra.sqhash;
            if (sq_hash == '') {
                button_ws.style.display = 'none';
            } else {
                button_ws.style.display = 'block';
                play_hash = sq_hash;
            }
            // 访问第三方解析无损接口
            url = "http://8.142.95.208:5001/url/byhash?hash=" + play_hash + "&albumid=" + albumid;
            getSqMp3Play(url);
            x=0;
            bb=0;
            cc=0;
            jia=0;

      }
    })
}


// 删除播放界面导航栏

sc_cc1=document.getElementsByClassName('cmhead1');
sc_cc2=document.getElementsByClassName('cmhead2');
sc_cc3=document.getElementsByClassName('singerContent clearfix');
sc_cc1[0].remove()
sc_cc2[0].remove()

//添加首页
var ss_s= document.createElement("iframe");
ss_s.id = "ss_s";
ss_s.style.width = "100%";
ss_s.style.height="calc(97vh - 80px)";
ss_s.src="https://www.kugou.com/";
ss_s.style.border="0px";
ss_s.style.overflowY="scroll";
ss_s.style.overflowX="scroll";
document.body.appendChild(ss_s);




//添加歌词
var yc=document.getElementById('audioModule')
var di_v1= document.createElement("div");
di_v1.id = "di_v";
di_v1.style.width = "100%";
di_v1.style.height = "30px";
di_v1.innerText="暂无歌词";
di_v1.style.position="absolute";
di_v1.style.left="0px";
di_v1.style.fontSize="17px";
di_v1.style.top="-30px";
di_v1.style.textAlign="center";
di_v1.style.backgroundColor="Gray";
// di_v1.style.zIndex="1001";
yc.appendChild(di_v1);
var ss_xs=document.getElementsByClassName('showHide-playbar');
ss_xs[0].style.marginTop="-125px";

function gc_hq(){
  sc_cc4=document.getElementsByClassName('ie8FontColor playOver')[0].innerHTML
  document.getElementById("di_v").innerText=sc_cc4
}


//调整首页高度
var ss_sss=document.getElementById('ss_s')
ss_xs[0].onclick=function(){
  // console.log(ss_sss.style.height)
  if(ss_sss.style.height=="calc(97vh - 80px)"){
    ss_sss.style.height="calc(112vh - 80px)";
  }else{
    ss_sss.style.height="calc(97vh - 80px)";
  }
  // ss_sss.style.height="calc(112vh - 80px)";
}







//添加播放界面隐藏按钮

var input_sk= document.createElement("span");
input_sk.id = "yc";
input_sk.style.width = "36px";
input_sk.style.height = "36px";
input_sk.style.backgroundImage="url(https://www.kugou.com/common/images/icon_rs_i4.png)";
input_sk.style.backgroundSize="100%";
input_sk.style.position="absolute";
input_sk.style.right="-100px";
input_sk.style.top="25px";
input_sk.style.zIndex="1001";
var yc_jia=document.getElementsByClassName('mode-volume-list');
yc_jia[0].appendChild(input_sk);

var spa=document.getElementsByClassName('mainPage');
var yc_1=document.getElementById('yc');
spa[0].style.position="fixed";
spa[0].style.width="100%";
spa[0].style.top="calc(110vh - 80px)";
spa[0].style.transition="top 1s linear 0s"
var ge_c=document.getElementById('di_v');

gc_ss=setInterval(gc_hq,"900");
yc_1.onclick=function(){
  if(spa[0].style.top !="0px"){
    spa[0].style.top="0px"
    ge_c.style.display="none"
    ss_xs[0].style.marginTop="-96px";
    clearInterval(gc_ss);
    yc_1.style.transform = "rotate(180deg)";
  }else{
    yc_1.style.transform = "rotate(0deg)";
    spa[0].style.top= "calc(110vh - 80px)";
    ge_c.style.display="block"
    ss_xs[0].style.marginTop="-125px";

    gc_ss=setInterval(gc_hq,"900");

  }

}


//播放界面下移
var qu_top=document.getElementsByClassName('content');
qu_top[0].style.top="0px"

//歌词隐藏与显示按钮
// var yc=document.getElementById('')
var di_gc_c= document.createElement("span");
di_gc_c.id = "di_gc_cc";
di_gc_c.style.width = "30px";
di_gc_c.style.height = "30px";
di_gc_c.innerText="词";
di_gc_c.style.position="absolute";
di_gc_c.style.right="-50px";
di_gc_c.style.top="30px";
di_gc_c.style.zIndex="1001";
di_gc_c.style.fontSize="17px";
di_gc_c.style.color="white"
// var kz_mb=document.getElementsByClassName('mode-volume-list');

yc_jia[0].appendChild(di_gc_c);

var di_gc_cc=document.getElementById('di_gc_cc')
var di_vv1=document.getElementById('di_v')
di_gc_cc.onclick=function(){
  if(spa[0].style.top !="0px"){
    if(di_vv1.style.display=="none"){
      gc_ss=setInterval(gc_hq,"900");
      di_vv1.style.display="block";
      ss_sss.style.height="calc(97vh - 80px)";
      ss_xs[0].style.marginTop="-125px";
    }else{
      di_vv1.style.display="none";
      ss_xs[0].style.marginTop="-96px";
      clearInterval(gc_ss);
      ss_sss.style.height="calc(103vh - 80px)";
    }
  }
}



















