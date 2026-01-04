// ==UserScript==
// @name 下载爱奇艺m3u8视频
// @namespace Violentmonkey Scripts
// @match *://*.iqiyi.com/*
// @grant none
// @version 1.0
// @author -
// @description 12/31/2022, 9:17:14 PM
// @downloadURL https://update.greasyfork.org/scripts/457425/%E4%B8%8B%E8%BD%BD%E7%88%B1%E5%A5%87%E8%89%BAm3u8%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457425/%E4%B8%8B%E8%BD%BD%E7%88%B1%E5%A5%87%E8%89%BAm3u8%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==




(function () {
	// alert("你好1");
	'use strict';
	console.log('我的脚本加载了');
	var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "id001";
	button.textContent = "下载爱奇艺视频";
	button.style.width = "60px";
	button.style.height = "60px";
	button.style.align = "center";
 button.style.color= "red"
 button.style.backgroundColor= "green"

	//绑定按键点击功能
	button.onclick = function (){
		console.log('点击了按键');
		//alert("你好");



 var download = function (text, filename, type) {
 let b = new Blob([text], {
 type: type || 'text/plain'
 });
 let a = document.createElement("a");
 a.href = URL.createObjectURL(b);
 a.setAttribute("download", filename);
 a.click();
 };
 var findPssh = function (base64Str) {
 var ba = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));
 for(let i = 0, f = false; i < ba.length - 5; i++) {
 if(ba[i+1] == 0x70 && ba[i+2] == 0x73 && ba[i+3] == 0x73 && ba[i+4] == 0x68) {
 if(f) {
 let p_len = ba[i];
 let pssh = ba.slice(i-3, i+p_len-3);
 return btoa(String.fromCharCode.apply(null, pssh));
 }
 f = true;
 }
 }
 };
 var importCmd5xAsync = async function() {
 let jsCode = await fetch("https://static.iqiyi.com/js/common/f6a3054843de4645b34d205a9f377d25.js").then(resp => resp.text());
 let script = document.createElement("script");
 script.text = jsCode;
 document.getElementsByTagName("head")[0].appendChild(script);
 };
 var importJsZipAsync = async function() {
 let jsCode = await fetch("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js").then(resp => resp.text());
 let script = document.createElement("script");
 script.text = jsCode;
 document.getElementsByTagName("head")[0].appendChild(script);
 };
 var formatTime = function(dur) {
 var date = new Date(0);
 date.setSeconds(dur);
 return date.toISOString().substr(11, 8).replace(/:/,"h").replace(/:/,"m")+"s";
 };
 var fetchFlvAsync = async function(info) {
 var fs = info.fs;
 var content = "#EXTM3U\n";
 var prefix = "https://data.video.iqiyi.com/videos";
 let results = fs.map(async fs_i => {
 let url = fs_i.l;
 let api = prefix + url;
 let t = "";
 if(playerObject._player.package.engine.adproxy.engine.movieinfo.current.boss){
 t = playerObject._player.package.engine.adproxy.engine.movieinfo.current.boss.data.t;
 }
 api = prefix + url + "%E2%9C%97domain=1&t=" + t + "&QY00001=" + /qd_uid=(\d+)/g.exec(url)[1] + "&ib=4&ptime=0&ibt=" + cmd5x(t + /\/(\w{10,})/g.exec(url)[1]);
 let resp = await fetch(api,{credentials: 'same-origin'});
 let json = await resp.json();
 return "#EXTINF:"+(fs_i.d/1000).toFixed(2)+"\n" + json["l"];
 });
 let urls = await Promise.all(results);
 content += urls.join('\n');
 content += "\n#EXT-X-ENDLIST";
 return content;
 };
 var ndIqyAsync = async function() {
 var vTracks = playerObject._player.package.engine.adproxy.engine.movieinfo.current.vidl.filter(a=>a.isUsable && a.realArea.width).sort((a,b)=>b.vsize-a.vsize);
 let info = vTracks[0];
 if(vTracks.length > 1) {
 let p = "";
 vTracks.forEach(function (item, index) {
 p += `\r\n[${index}]: [${item.realArea.width}x${item.realArea.height}]_${(item.vsize / 1024 / 1024).toFixed(2)}MB`;
 });
 let _input = prompt("请选择视频" + p);
 info = vTracks[Number(_input)];
 }
 var title = "";
 try{
 title = document.querySelector('h1.player-title a.title-link[title]')['title'] + "_" + document.querySelector('h1.player-title em').innerText + "_" + info.realArea.width + "_" + info.realArea.height + "_" + formatTime(info.duration) + "_" + (info.vsize / 1024 / 1024).toFixed(2) + "MB";
 } catch(err){
 title = document.title + "_" + info.realArea.width + "_" + info.realArea.height + "_" + formatTime(info.duration) + "_" + (info.vsize / 1024 / 1024).toFixed(2) + "MB";
 }
 var m3u8Content = "";
 if(typeof info.playlist == "string" && info.playlist.length>0){
 m3u8Content = info.playlist;
 }else if(typeof info.playlist == "object" && !info.playlist.drm){
 m3u8Content = "#EXTM3U\n" + info.playlist.urls.map((u,i)=>"#EXTINF:"+info.playlist.durations[i]+",\nhttps:"+u+info.playlist.qdp[/\/(\w{10,})/g.exec(u)[1]]).join('\n') + "\n#EXT-X-ENDLIST";
 }else if(typeof info.playlist == "object" && info.playlist.drm){
 let keyServer = info.playlist.drm.keySystemServer;
 let aTrack1 = info.playlist.m3u8.audio_track1;
 let vTrack1 = info.playlist.m3u8.video_track1;
 /* 生成audio m3u8 */
 let aM3u8 = "#EXTM3U\n";
 aM3u8 += `#EXT-X-MAP:URI=\"init.m4a\"\n`;
 aM3u8 += "#EXT-X-KEY:METHOD=PLZ-KEEP-RAW,URI=\"None\"\n";
 let aUrl = aTrack1.files[0].file_name;
 for (let i = 0; i < aTrack1.files[0].seekable.time.length-1; i++) {
 let _start = aTrack1.files[0].seekable.pos[i];
 let _end = aTrack1.files[0].seekable.pos[i+1];
 let _dur = aTrack1.files[0].seekable.time[i+1]-aTrack1.files[0].seekable.time[i];
 aM3u8 += `#EXTINF:${_dur.toFixed(2)},\n`;
 aM3u8 += `${aUrl}&start=${_start}&end=${_end}\n`;
 }
 aM3u8 += "\n#EXT-X-ENDLIST";
 /* 生成video m3u8 */
 let vM3u8 = "#EXTM3U\n";
 vM3u8 += `#EXT-X-MAP:URI=\"init.mp4\"\n`;
 vM3u8 += "#EXT-X-KEY:METHOD=PLZ-KEEP-RAW,URI=\"None\"\n";
 vM3u8 += vTrack1.files.map((u)=>`#EXTINF:${u.duration_second.toFixed(2)},\n${u.file_name}&start=${u.seekable.pos_start}&end=${u.seekable.pos_end}`).join('\n');
 vM3u8 += "\n#EXT-X-ENDLIST";
 /* 引入JSZip */
 await importJsZipAsync();
 /* zip打包 */
 var zip = new JSZip();
 /* 塞入文件 */
 zip.file("init.m4a",aTrack1.codec_init, {base64: true});
 zip.file("init.mp4",vTrack1.codec_init, {base64: true});
 zip.file("m4a.m3u8",aM3u8);
 zip.file("mp4.m3u8",vM3u8);
 zip.file("license_url.txt",keyServer);
 zip.file("pssh.txt",findPssh(vTrack1.codec_init));
 zip.generateAsync({type:"blob"}).then(function(content) {
 download(content, title + ".zip", "application/octet-stream");
 });
 }else{
 await importCmd5xAsync();
 m3u8Content = await fetchFlvAsync(info);
 }
 if(m3u8Content!="") download(m3u8Content, title + ".m3u8");
 };
 ndIqyAsync();





		return;

	};





 function myalert(){
 // alert('来啦 老弟!')
 var x = document.getElementsByClassName('head-title')[0];
 console.log(1111111111111111111111111111111)
 console.log(x)
	x.appendChild(button);
 // alert("你好");
}

window.onload=myalert;
// setTimeout(myalert, 10000);



})();