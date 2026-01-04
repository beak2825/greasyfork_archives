// ==UserScript==
// @name 【电脑 && 手机 全网唯一全自动脚本】VIP会员视频自动解析
// @description 脚本功能目前有：1--A站、B站、优酷、土豆、腾讯、芒果、爱奇艺、搜狐、乐视、PPTV、1905、华数、风行、西瓜视频...等各大视频网站，2--解决 芒果TV 过滤视频广告 以后，会自动选择 标清画质 的问题，3--解决 官方普通视频 首次播放部分浏览器 默认静音 问题，4--解决 某社区 在线视频不能全屏的问题，5--A站,B站,优酷,腾讯,爱奇艺,芒果TV,PPTV,搜狐,乐视视频关闭弹幕，6--豆瓣资源 可以搜索观看视频，7--在猴子脚本站的搜索结果中添加评分，8--支持 网易云音乐、QQ音乐、酷狗、酷我、虾米、咪咕、5SING、喜马拉雅、懒人听书、全民K歌、一听音乐、echo回声、四季电台...等（非付费 和 非会员）音乐 和 MV 嗅探下载（先播放，然后再点击网页右上角--猫咪按钮）。（江小白提醒：手机网页 解析视频 容易出现 接口广告，请自行安装 广告过滤，另外 视频画质是 解析接口 本身决定的，并非本脚本可以左右，手机B站网页解析 要切换 桌面UA 才可以，还有 本脚本是 免费脚本，如果发现有人 售卖此脚本，均为骗子，请不要上当受骗。）
// @contributionURL https://gitee.com/q2257227289/00/raw/master/963540817-1.png
// @author jxb
// @version 963540817.49
// @include */tv/*
// @include */acg/*
// @include */mov/*
// @include *://*/*=http*
// @include *&type=1ting*
// @include *&type=ximalaya*
// @include *://www.bumimi*
// @include *://v.youku.com/v_show/id_*
// @include *://v.qq.com/x/cover/*
// @include *://v.qq.com/variety/p/topic/*
// @include *://w.mgtv.com/b/*
// @include *://www.mgtv.com/b/*
// @include *://tw.iqiyi.com/v_*
// @include *://www.iqiyi.com/v_*
// @include *://www.iqiyi.com/a_*
// @include *://www.iqiyi.com/w_*
// @include *://www.iqiyi.com/kszt/*
// @include *://tv.sohu.com/v/*
// @include *://film.sohu.com/album/*
// @include *://www.le.com/ptv/vplay/*
// @include *://v.pptv.com/show/*
// @include *://vip.1905.com/play/*
// @include *://www.wasu.cn/*/show/id/*
// @include *://www.fun.tv/vplay/g-*
// @include *://www.ixigua.com/*
// @include *://www.bilibili.com/bangumi/play/*
// @include *://www.acfun.cn/bangumi/*
// @match *://*/*=http*
// @match *://www.bilibili.com/blackboard/*
// @match *://www.bilibili.com/*video/*
// @match *://player.bilibili.com/*
// @match *://*.tudou.com/v/*
// @match *://*.tudou.com/*/id_*
// @match *://v-wb.youku.com/v_show/id_*
// @match *://vku.youku.com/live/*
// @match *://w.mgtv.com/l/*
// @match *://w.mgtv.com/s/*
// @match *://www.mgtv.com/l/*
// @match *://www.mgtv.com/s/*
// @match *://www.mgtv.com/act/*
// @match *://haokan.baidu.com/v*
// @match *://tieba.baidu.com/p/*
// @match *://www.jiaomh.com/search.php?searchword=*
// @match *://www.jiaomh.com/kmahua/*
// @match *://www.wbdy.tv/*
// @match *://www.ikukk.com/*
// @match *://www.cupfox.com/search?key=*
// @match *://movie.douban.com/subject/*
// @match *://www.acfun.cn/*/ac*
// @match *://m.youku.com/*/id_*
// @match *://m.mgtv.com/b/*
// @match *://m.pptv.com/show/*
// @match *://m.tv.sohu.com/v*
// @match *://m.tv.sohu.com/u/*
// @match *://m.tv.sohu.com/phone_play_film*
// @match *://m.le.com/vplay_*
// @match *://m.iqiyi.com/v_*
// @match *://m.v.qq.com/*
// @match *://3g.v.qq.com/*
// @match *://v.qq.com/x/page/*
// @match *://z1.m1907.cn/*
// @match *://www.yinyuetai.com/play?id=*
// @match *://m.bilibili.com/bangumi/play/*
// @match *://m.acfun.cn/v/*
// @match *://m.douban.com/movie/subject/*
// @match *://music.163.com/*
// @match *://y.music.163.com/*
// @match *://kuwo.cn/*
// @match *://bd.kuwo.cn/*
// @match *://www.kuwo.cn/*
// @match *://m.kuwo.cn/newh5*
// @match *://www.kugou.com/song/*
// @match *://www.kugou.com/mvweb/*
// @match *://m3ws.kugou.com/kgsong/*
// @match *://m3ws.kugou.com/mv/*
// @match *://m.kugou.com/*
// @match *://y.qq.com/*
// @match *://i.y.qq.com/*
// @match *://www.xiami.com/*
// @match *://h.xiami.com/*
// @match *://m.xiami.com/*
// @match *://music.migu.cn/*
// @match *://m.music.migu.cn/*
// @match *://5sing.kugou.com/*
// @match *://kg.qq.com/node/*
// @match *://www.app-echo.com/*
// @match *://radio.sky31.com/*
// @match *://www.lrts.me/playlist*
// @match *://m.ximalaya.com/*
// @match *://www.ximalaya.com/*
// @match *://m.mgtv.com/*
// @match *://greasyfork.org/*/scripts
// @match *://greasyfork.org/*/scripts?*
// @match *://greasyfork.org/*/users/*
// @match *://greasyfork.org/*/by-site/*
// @match *://sleazyfork.org/*/scripts
// @match *://sleazyfork.org/*/scripts?*
// @match *://sleazyfork.org/*/users/*
// @match *://sleazyfork.org/*/by-site/*
// @grant GM_setValue
// @grant GM_getValue
// @noframes
// @run-at document-end

// @namespace https://greasyfork.org/users/675587
// @downloadURL https://update.greasyfork.org/scripts/441850/%E3%80%90%E7%94%B5%E8%84%91%20%20%E6%89%8B%E6%9C%BA%20%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E5%85%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC%E3%80%91VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/441850/%E3%80%90%E7%94%B5%E8%84%91%20%20%E6%89%8B%E6%9C%BA%20%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E5%85%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC%E3%80%91VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
(function (){




var host=document.domain;

if(host.indexOf("mgtv.com")>-1&&!document.getElementById('linkmgtv2')){

var pans= document.createElement('b');		
pans.id='linkmgtv2';
document.body.appendChild(pans);

var ls=function (e) {			

var url="https://m.mgtv.com/so/?k="


window.qq_browser_obj.openUrl(url+this.innerText)



}//ls
var ls1=function (e) {			


window.qq_browser_obj.showtip("请点击【蓝色文字】搜索此视频");



}//ls1
setTimeout(info,500);




function info() {
host=document.domain;
if(host.indexOf("mgtv.com")==-1){return;

}




var xm=document.querySelectorAll("DIV.subtitle");

if(xm&&xm.length>0){




for(var j=0;j<xm.length;j++){
var x=xm[j];


var ok=x.getAttribute('style');

if(!ok){



x.setAttribute('style','color:blue');
x.addEventListener('click',ls , false);		
}






}


}
//2
xm=document.querySelectorAll("P");

if(xm&&xm.length>0){




for(var j=0;j<xm.length;j++){
var x=xm[j];
x.setAttribute('style','color:#5792db');








}


}

//2

//3
xm=document.querySelectorAll("SPAN.mgui-arr-bg");

if(xm&&xm.length>0){




for(var j=0;j<xm.length;j++){
var x=xm[j];

x.addEventListener('click',ls1 , false);		







}


}

//3
//4

xm=document.querySelectorAll("SPAN.mgui-arr-tips");

if(xm&&xm.length>0){




for(var j=0;j<xm.length;j++){
var x=xm[j];


x.innerText="";








}


}



//4
//setTimeout(info,1500);//继续



}







}


})();