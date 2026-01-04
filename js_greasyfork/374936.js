// ==UserScript==
// @name         王总音乐后台2
// @namespace    baiwudu.com
// @version      1.2.2
// @description  王总js音乐后台2
// @author       作者：王总
// @match        *://www.baiwudu.com*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/374936/%E7%8E%8B%E6%80%BB%E9%9F%B3%E4%B9%90%E5%90%8E%E5%8F%B02.user.js
// @updateURL https://update.greasyfork.org/scripts/374936/%E7%8E%8B%E6%80%BB%E9%9F%B3%E4%B9%90%E5%90%8E%E5%8F%B02.meta.js
// ==/UserScript==
// < ![CDATA[
var music = document.getElementById("music");
var musicArr=[
{url:'http://other.web.nf01.sycdn.kuwo.cn/resource/n2/59/93/3834809730.mp3',title:"pp之力"},
{url:'http://fs.open.kugou.com/718d2820aaf48bc24aca0673c35f3e18/5c8139c2/G143/M01/07/01/L4cBAFuM5LOAMEMFAx5ZUHe-JIg973.mp3',title:"DJ小州"},
{url:'http://so.sycdn.kuwo.cn/resource/n3/79/37/3778074545.mp3',title:"山"},
{url:'http://other.web.nj01.sycdn.kuwo.cn/resource/n1/87/84/2495771643.mp3',title:"生"},
{url:'http://sd.sycdn.kuwo.cn/resource/n1/47/70/1534907298.mp3',title:"狂狼"},

{url:'//www.ytmp3.cn/down/53157.mp3',title:"一百万个可能"},  {url:'//www.ytmp3.cn/down/55494.mp3',title:"可不可以"},   {url:'http://www.ytmp3.cn/down/47251.mp3',title:"逆流成河"},
{url:'//ku.oioweb.cn/music/music1.mp3',title:"沈念 - 青花瓷 (粤语童声咚鼓版)"},
{url:'http://www.ytmp3.cn/down/43997.mp3',title:"音阙诗听 - 红昭愿"},
{url:'//www.ytmp3.cn/down/46383.mp3',title:"Double C - 2.14"},
{url:'http://www.ytmp3.cn/down/47838.mp3',title:"麦小兜 - 9420"},
{url:'//www.ytmp3.cn/down/43813.mp3',title:"离人愁-李袁杰"},
{url:'//www.ytmp3.cn/down/55013.mp3',title:"再也不会遇见第二个她-李哈哈"},
{url:'http://www.ytmp3.cn/down/47833.mp3',title:"沈念_承利 - 谁的青春不迷茫 (咚鼓版)"},
{url:'http://www.ytmp3.cn/down/54204.mp3',title:"樱花树下的约定"},
{url:'http://www.ytmp3.cn/down/47848.mp3',title:"烟火里的尘埃-郁欢"},
{url:'http://www.ytmp3.cn/down/47833.mp3',title:"平凡之路-朴树"},
{url:'http://www.ytmp3.cn/down/56368.mp3',title:"티라미수 케익 (提拉米苏蛋糕)"},
{url:'//www.ytmp3.cn/down/54249.mp3',title:"李袁杰 - 离人愁"},
{url:'http://www.ytmp3.cn/down/51257.mp3',title:"白羊 - 徐秉龙"},
{url:'http://www.ytmp3.cn/down/32106.mp3',title:"Skin - Rag\'N\'Bone Man"},
{url:'http://www.ytmp3.cn/down/33085.mp3',title:"绅士 + 如果有来生 + 我们的爱 - 薛之谦"},
{url:'//http://www.ytmp3.cn/down/48377.mp3',title:"Poacher's Pride-Nicole Dollanganger"},
{url:'http://www.ytmp3.cn/down/47841.mp3',title:"不染-霏箬"},
];
$("#audio").click(function(){
	if(music.paused){music.play();
	   $("#audio").removeClass("pause").addClass("play");
	}else{music.pause();
	   $("#audio").removeClass("play").addClass("pause");
        }
});
function randomMusic(){
   var isone=$("#music").attr('src');
   var noone=musicArr[parseInt(Math.random()*musicArr.length)];
   if (noone.url==isone){var noone=musicArr[parseInt(Math.random()*musicArr.length)];}
   $("#music").attr('src',noone.url);
   $("#audio").attr('title',noone.title);
}
randomMusic();
$("#music").on('ended',function(){
   randomMusic();	
});
function c(){
var imgObj = document.getElementById("d");
var Flag=(imgObj.getAttribute("src",2)=="https://api.3v1.cc/music/weimusic2.gif")
imgObj.src=Flag?"https://api.3v1.cc/music/weimusic1.gif":"https://api.3v1.cc/music/weimusic2.gif";
};
// ]]>