// ==UserScript==
// @name         酷狗在线听(手机搜索)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @icon         https://i0.hdslb.com/bfs/album/0d58ba3462659867aa46633d4a4791e93160ffb5.jpg
// @description  无需登录在线听你想听的音乐
// @author       今天是充满希望的一天
// @match        *://www.kugou.com/mixsong/*
// @match        https://m.kugou.com/search/index
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js
// @connect      music.api.goodluckweb.top
// @downloadURL https://update.greasyfork.org/scripts/456873/%E9%85%B7%E7%8B%97%E5%9C%A8%E7%BA%BF%E5%90%AC%28%E6%89%8B%E6%9C%BA%E6%90%9C%E7%B4%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456873/%E9%85%B7%E7%8B%97%E5%9C%A8%E7%BA%BF%E5%90%AC%28%E6%89%8B%E6%9C%BA%E6%90%9C%E7%B4%A2%29.meta.js
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

// https://m.kugou.com/search/index
// https://m.kugou.com/mixsong/7rh458f8.html
// 添加按钮选择音质
// var down_load_div = document.getElementsByClassName("btnArea2 clearfix")[0];
// down_load_div.innerHTML = "";
// // 超高音质
// var button_ws = document.createElement("button");
// button_ws.id = "down_load_ws";
// button_ws.textContent = "下载超高音质(需设置flac为白名单)";
// button_ws.style.width = "230px";
// button_ws.style.height = "50px";
// button_ws.style.color = "#fff";
// button_ws.style.cursor = "pointer";
// button_ws.style.background = "#000";
// down_load_div.appendChild(button_ws);
// // 高音质
// var button_g = document.createElement("button");
// button_g.id = "button_g";
// button_g.textContent = "下载高音质";
// button_g.style.width = "230px";
// button_g.style.height = "50px";
// button_g.style.color = "#fff";
// button_g.style.cursor = "pointer";
// button_g.style.background = "#000";
// button_g.style.margin = "3px 0px";
// down_load_div.appendChild(button_g);
// // 普通音质
// var button_mp3 = document.createElement("button");
// button_mp3.id = "button_mp3";
// button_mp3.textContent = "下载普通音质";
// button_mp3.style.width = "230px";
// button_mp3.style.height = "50px";
// button_mp3.style.color = "#fff";
// button_mp3.style.cursor = "pointer";
// button_mp3.style.background = "#000";
// down_load_div.appendChild(button_mp3);

var h_id;

document.getElementById('searchBtn').onclick=function(){
  var ss=setInterval(function(){
    if(document.getElementById('panelSongsList')!=null){
      var h1=document.getElementById('panelSongsList').getElementsByTagName("li")
      // console.log(h1.length)
      for(i=0;i<h1.length;i++){
        h1[i].onclick=function(){
          h_id=this.getAttribute("id").slice(6);
          // https://m.kugou.com/mixsong/7rh458f8.html
          h_m=this.getElementsByTagName("span")[0].innerHTML

          window.location.href="https://m.kugou.com/mixsong/7rh458f8.html?"+h_id+"?"+h_m;
          // document.getElementById('myAudio').getAttribute("data-hash")
          // window.location.href="https://m.kugou.com/mixsong/4fql9xab.html";
        }
      }



      clearInterval(ss);
    }

  // console.log(document.getElementById('panelSongsList').getElementsByTagName("li")[0])
  },"100");
}






















// document.getElementById('mod_content').style.display = 'none';
// var div_1= document.createElement("div");
// div_1.id="xj";
// // div_1.width="100%";
// // div_1.height="300px"
// div_1.style.position="absolute";
// div_1.style.top="0px";
// div_1.style.left="0px";
// document.body.appendChild(div_1)

// var input_sk= document.createElement("span");
// input_sk.id = "yc";
// input_sk.style.width = "60px";
// input_sk.style.height = "60px";
// input_sk.style.backgroundImage="url(https://www.kugou.com/yy/static/images/play/btn.png)";
// // input_sk.style.backgroundSize="100%";
// input_sk.style.position="absolute";
// // input_sk.style.right="100px";
// // input_sk.style.top="25px";    margin-top: 10px;
// input_sk.style.marginTop="10px";

// input_sk.style.zIndex="1001";
// document.getElementById('xj').appendChild(input_sk);

// document.getElementById('yc').onclick=function(){
//   if(document.getElementById('kugou').paused){
//     document.getElementById('kugou').play()
//   }else{
//     document.getElementById('kugou').pause()
//   }
//   // mp3.pause();

// }


// // 监听audio开始播放事件(事件在视频/音频（audio/video）开始播放时触发。)
// document.getElementById('kugou').addEventListener("play", function () {
//     // 判断是否需要修改src属性
//     if (document.getElementById('kugou').getAttribute("data-hash") != mp3_Hash) {
//         getMp3Detail();
//     }
// })

// // 点击下载按钮 超高音质
// // button_ws.onclick = function () {
// //     if (download_url == mp3_Url) {
// //         alert(mp3_Name + " 已在下载中！")
// //     } else {
// //         downloadBySrc(mp3_Url);
// //     }
// // };
// // // 点击下载按钮 高音质
// // button_g.onclick = function () {
// //     if (g_hash == download_hash) {
// //         alert(mp3_Name + " 已在下载中！");
// //     } else {
// //         download_hash = g_hash;
// //         getMp3UrlSrc();
// //     }
// // };
// // // 点击下载按钮 普通音质
// // button_mp3.onclick = function () {
// //     if (mp3_Hash == download_hash) {
// //         alert(mp3_Name + " 已在下载中！");
// //     } else {
// //         download_hash = mp3_Hash;
// //         getMp3UrlSrc();
// //     }
// // };

// // // 点击下载按钮 超高音质
// // document.getElementById('pb_download').onclick = function () {
// //     if (download_url == mp3_Url) {
// //         alert(mp3_Name + " 已在下载中！")
// //     } else {
// //         downloadBySrc(mp3_Url);
// //         setTimeout(function () {
// //             document.getElementsByClassName('ui-popup ui-popup-show ui-popup-focus')[0].style.display = "none"
// //         }, 50)
// //     }
// // };

// // 获取高音质或者普通音质的MP3地址并且下载
// function getMp3UrlSrc() {
//     url = "https://music.api.goodluckweb.top/url/byhash?hash=" + download_hash + "&albumid=" + albumid;
//     GM_xmlhttpRequest({
//         method: "get",
//         url: url,
//         onload: function (r) {
//             let jsonTxt = r.responseText;
//             let json = JSON.parse(jsonTxt);
//             downloadBySrc(json.data.play_url);
//         }
//     })
// }

// // 点击下载 by url
// // function downloadBySrc(download_url_quality) {
// //     download_url = download_url_quality;
// //     let loaded = 0.0;
// //     NProgress.set(0.0);      // 与.start（）
// //     GM_download({
// //         url: download_url,
// //         name: mp3_Name + download_url.substr(download_url.lastIndexOf(".")), //不填则自动获取文件名
// //         saveAs: true, //布尔值，显示"保存为"对话框
// //         onerror: function (error) {
// //             //如果下载最终出现错误，则要执行的回调
// //             console.log(error)
// //             console.log(mp3_Name + "  下载报错，请反馈！");
// //         },
// //         onprogress: (pro) => {
// //             //如果此下载取得了一些进展，则要执行的回调
// //             // console.log(pro.loaded) //文件加载量
// //             // console.log(pro.totalSize) //文件总大小
// //             let size = (pro.loaded / pro.totalSize).toFixed(1);
// //             if (loaded != size) {
// //                 loaded = size;
// //                 NProgress.inc(0.1);
// //             }
// //         },
// //         ontimeout: () => {
// //             //如果此下载由于超时而失败，则要执行的回调
// //             console.log(mp3_Name + "下载超时，请反馈！");
// //         },
// //         onload: () => {
// //             //如果此下载完成，则要执行的回调
// //             console.log(mp3_Name + "   下载完成！");
// //             NProgress.done();
// //         }
// //     })
// // }

// // 播放无损音质
// function getSqMp3Play(url) {
//     // get请求获取无损音质的信息
//     GM_xmlhttpRequest({
//         method: "get",
//         url: url,
//         onload: function (r) {
//             let jsonTxt = r.responseText;
//             let json = JSON.parse(jsonTxt);
//             mp3_Url = json.data.play_url;
//             mp3_Name = json.data.audio_name;
//             document.getElementById('kugou').src = mp3_Url;
//             //document.getElementById('openKugou').href = mp3_Url;
//             if (document.getElementById('kugou').paused) {
//                 document.getElementById('kugou').play();
//             }
//             console.log(mp3_Name + mp3_Url.substr(mp3_Url.lastIndexOf(".")) + "   加载完成");
//         }
//     })
// }

// // js修改audio的src属性，即播放链接
// function getMp3Detail() {
//     mp3_Hash = document.getElementById('kugou').getAttribute("data-hash");
//     let play_hash = mp3_Hash;
//     let searchQualityUrl = 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + play_hash;
//     // 查询音质
//     GM_xmlhttpRequest({
//         method: "get",
//         url: searchQualityUrl,
//         onload: function (r) {
//             let jsonTxt = r.responseText;
//             let json = JSON.parse(jsonTxt);
//             albumid = json.albumid.toString();
//             g_hash = json.extra['320hash'];
//             play_hash = g_hash;
//             // if (g_hash == '') {
//             //     button_g.style.display = 'none';
//             // } else {
//             //     button_g.style.display = 'block';
//             //     play_hash = g_hash;
//             // }
//             // sq_hash = json.extra.sqhash;
//             // if (sq_hash == '') {
//             //     button_ws.style.display = 'none';
//             // } else {
//             //     button_ws.style.display = 'block';
//             //     play_hash = sq_hash;
//             // }
//             // 访问第三方解析无损接口
//             url = "https://music.api.goodluckweb.top/url/byhash?hash=" + play_hash + "&albumid=" + albumid;
//             getSqMp3Play(url);
//         }
//     })
// }


// console.log(document.getElementById('kugou').paused)
//========================================= nprogress.min.css
// GM_addStyle(`
// #nprogress{pointer-events:none}#nprogress .bar{background:#f90;position:fixed;z-index:1031;top:0;left:0;width:100%;height:5px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;box-shadow:0 0 10px #f90,0 0 5px #f90;opacity:1;-webkit-transform:rotate(3deg) translate(0,-4px);-ms-transform:rotate(3deg) translate(0,-4px);transform:rotate(3deg) translate(0,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:#f90;border-left-color:#f90;border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
// `);