// ==UserScript==
// @name      搜索跳转
// @namespace  http://www.findspace.name
// @author    Alan
// @version    1.0.4
// @description  方便在各种搜索引擎进行跳转
// @require        http://cdn.bootcss.com/jquery/2.2.4/jquery.js
// @include        https://www.baidu.com/*
// @include        https://www.google*
// @include        http://cn.bing.com/search?q*
// @include        http://www.bing.com/search?q=*
// @copyright      2015+, f9y4ng ,Find
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/375154/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/375154/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
var classtypeTop = {
    position: 'fixed',
    top: '0px',
    display: 'block',
    width: '100%'
};
var classtype = {
    position: 'relative',
    top: '0px',
    display: 'block',
    width: '100%'
};
$(".faviconT").hide();
$("#content_right").hide();
$(window).load(function(){
　　$(window).bind('scroll resize', function(){
　　var $this = $(this);
　　var $this_Top=$this.scrollTop();
　　if($this_Top < 150){
         $("#hdtbSum").css(classtype);
　　　}
　　　if($this_Top > 150){
         $("#hdtbSum").css(classtypeTop);
　　　 }
　　}).scroll();
　});

    $(document).keypress(function(e) {
    // 回车键事件
       if(e.which == 13) {
        console.log("回车啦");
        var ss = $("#kw").val();
        Baidu(ss);
       }
   });
      $("#wrapper,.mw,#b_content").append('<div style="border-left:1px solid #e1e1e1;padding:10px;margin-top:230px;position:fixed;right:0px;top:0px;"><span style="cursor:pointer;width:60px;height:40px;display:block" id="abd" class="SearchTo">百度</span><span style="cursor:pointer;width:60px;height:40px;display:block" id="agg" class="SearchTo">谷歌</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="abg" class="SearchTo">必应</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="azh" class="SearchTo">知乎</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="atb" class="SearchTo">淘宝</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="ajd" class="SearchTo">京东</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="add" class="SearchTo">当当</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="adb" class="SearchTo">豆瓣</span> <span style="cursor:pointer;width:60px;height:40px;display:block" id="afy" class="SearchTo">翻译</span> <span style="cursor:pointer;width:60px;height:25px;display:block" id="adt" class="SearchTo">地图</span></div>');
      $(".SearchTo").on("click",function(){
        var sFlag = $(this).attr('id');
        var sVal = $("#kw").val()||$("#lst-ib").val()||$("#sb_form_q").val()||$("[name='q']").val();
                sVal = encodeURIComponent(sVal);
        if (sFlag == "" || sFlag == undefined) {return false;}
        switch (sFlag) {
              case "abd": Baidu(sVal); break;//百度搜索
              case "agg": GoogleJX(sVal); break;//谷歌搜索
              case "ajd": JDSearch(sVal); break;//京东
              case "atb": TBSearch(sVal); break;//淘宝
              case "azh": ZHSearch(sVal); break;//知乎
              case "adb": Douban(sVal); break;//豆瓣
              case "adm": PangCI(sVal); break;//动漫
              case "add": DangDang(sVal); break;//当当
              case "adt": Ditu(sVal); break;//地图
              case "ayy": YInyue(sVal); break;//音乐
              case "abl": BiliBili(sVal); break;//bilibili
              case "afy": Translate(sVal); break;//翻译
              case "abg": sBing(sVal);break;
              default: Baidu(sVal); break;
          }
          return false;
      });

      function Baidu(argument) {
          OpenUrl("https://www.baidu.com/s?wd=" + argument);
      }
      function GoogleJX(argument) {
          OpenUrl("https://www.google.com/search?q=" + argument);
      }
      function JDSearch(argument) {
          OpenUrl("http://search.jd.com/Search?enc=utf-8&keyword=" + argument);
      }
      function TBSearch(argument) {
          OpenUrl("https://s.taobao.com/search?q=" + argument);
      }
      function ZHSearch(argument) {
          OpenUrl("https://www.zhihu.com/search?q=" + argument);
      }
      function Douban(argument) {
          OpenUrl("https://www.douban.com/search?q=" + argument);
      }
      function PangCI(argument) {
          OpenUrl("http://218.50.4.4/s/" + argument + "/td_0");
      }
      function DangDang(argument) {
          OpenUrl("http://search.dangdang.com/?key=" + argument);
      }
      function Ditu(argument) {
          OpenUrl("http://ditu.amap.com/search?query=" + argument);
      }
      function YInyue(argument) {
          OpenUrl("http://music.163.com/#/search/m/?s=" + argument + "&type=1");
      }
      function BiliBili(argument) {
          var v = "http://search.bilibili.com/all?keyword=" + argument + "&type=1";
          if (!argument) {
              v = "http://www.bilibili.com/";
          }
          OpenUrl(v);
      }
      function sBing(argument) {
          var v = "http://cn.bing.com/search?q=" + argument;
          OpenUrl(v);
      }
      function Translate(argument) {
          OpenUrl("http://fanyi.baidu.com/#zh/en/" + argument);
      }

      function OpenUrl(surl) {
          window.location.href=surl;
      }