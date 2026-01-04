// ==UserScript==
// @name         省网继续教育代码
// @namespace    https://greasyfork.org/
// @version      1.5
// @description  广东公需课和继教刷课，章节完成自动进入下章
// @author       浩浩
// @match        http*://ggfw.hrss.gd.gov.cn/zxpx/auc/play*
// @downloadURL https://update.greasyfork.org/scripts/427704/%E7%9C%81%E7%BD%91%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/427704/%E7%9C%81%E7%BD%91%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
 
setTimeout(function(){
  p.tag.muted=true;//静音
  p.on("ended", function() {
    $('body').stopTime();
    p.dispose;
    overWatch();
    var learnlist = $("a:contains('未完成')").length != 0 ? $("a:contains('未完成')") : $("a:contains('未开始')");
    if(learnlist.length == 0){
      if(confirm('本课程全部学习完成!即将关闭页面！')){
        window.close();
      }
    }else {
      learnlist.each(function(){
        this.click();
      })
    }
  });
  map = {};//删题
  var errChecking = setInterval(function(){
    if($(".prism-ErrorMessage").css("display")!='none'){
      location.reload(); 
    }
    if(!$('.prism-play-btn').hasClass('playing')){
      $('.prism-play-btn').click();
    }//停止时开始播放
  },500)//错误自动刷新
}, 1000);//延时1秒进行