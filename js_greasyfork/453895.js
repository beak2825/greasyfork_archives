// ==UserScript==
// @name 【CD】⑨
// @description 脚本功能视频解析
// @contributionURL https://gitee.com/slzx543/raw/raw/master/142857-1.png
// @author nlm
// @license MIT
// @version 142857.33
// @include */tv/*
// @include */acg/*
// @include */mov/*
// @include *=http*
// @include *&type=1ting*
// @include *&type=ximalaya*
// @include *&autoplay=1&metareferer=*
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
// @include *://www.bilibili.com/bangumi/play/*
// @include *://www.acfun.cn/bangumi/*
// @match *://*/*/tv/*
// @match *://*/*/acg/*
// @match *://*/*/mov/*
// @match *://*/*=http*
// @match *://*/*&type=1ting*
// @match *://*/*&type=ximalaya*
// @match *://*/*&autoplay=1&metareferer=*
// @match *://www.douyin.com/video/*
// @match *://www.kuaishou.com/*
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
// @match *://haokan.hao123.com/v*
// @match *://tieba.baidu.com/p/*
// @match *://www.jiaomh.com/search.php?searchword=*
// @match *://www.jiaomh.com/kmahua/*
// @match *://www.555dy6.com/vodsearch/*
// @match *://www.555dy6.com/vodplay/*
// @match *://pgso.cnjsjf.com/?*
// @match *://miao101.com/search*
// @match *://miao101.com/video*
// @match *://www.wbdy.tv/*
// @match *://www.ikukk.com/*
// @match *://www.cupfox.com/search?key=*
// @match *://movie.douban.com/subject/*
// @match *://www.9ku.com/play/*
// @match *://m.9ku.com/play/*
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
// @match *://www.1ting.com/*
// @match *://www.zhaojiaoben.cn/*
// @grant GM_setValue
// @grant GM_getValue
// @noframes
// @run-at document-end
// @namespace nlm
// @downloadURL https://update.greasyfork.org/scripts/453895/%E3%80%90CD%E3%80%91%E2%91%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453895/%E3%80%90CD%E3%80%91%E2%91%A8.meta.js
// ==/UserScript==
//添加定时

var func = setInterval(()=>{
 //确定页面加载完毕
if($(".callEnd_title").length!=0){
     //删除继续浏览提示
     $(".weixin-shadowbox").remove();
     //删除打开app提示
     $(".btn_open_app_prompt_div").remove();
     $(".open_app_channelCode").remove();
     $(".openApp").remove();
     //自动展开
    $(".detail-open-removed").click();
    $(".app-bt-cance").click();
   $(".hide-preCode-bt").click();
   //复制代码
   $(".signin").removeAttr("onclick");
   $(".signin").unbind("click");
   $("code").removeAttr("onclick");
   $("code").unbind('click').bind("click",function(){
   const ele = document.createElement('input')
  // 设置元素内容
  ele.setAttribute('value', $(this).text())
 // 将元素插入页面进行调用
  document.body.appendChild(ele)
  // 复制内容
  ele.select()
  // 将内容复制到剪贴板
  document.execCommand('copy')
  // 删除创建元素
  document.body.removeChild(ele)
 });
  clearInterval(func);
}
},500);
setInterval(()=>{
	$(".passport-login-container").remove();
},200);
