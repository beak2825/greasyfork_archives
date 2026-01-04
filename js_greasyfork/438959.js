// ==UserScript==
// @name        鬼东西爬虫
// @namespace   https://wtf.hiigara.net/
// @description 鬼东西网站爬虫，1-列表，2-input和颜色，3-保存res
// @include     https://wtf.hiigara.net/*
// @author      sco
// @version     0.01
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438959/%E9%AC%BC%E4%B8%9C%E8%A5%BF%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/438959/%E9%AC%BC%E4%B8%9C%E8%A5%BF%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

(function(){
  /* 脚本正式开始 */

  'use strict';
  console.log("浏览器爬虫脚本运行开始!");

  // 自定义爬虫地址数组
  var urlList = [
    'https://wtf.hiigara.net/ranking?page=83',
    'https://wtf.hiigara.net/ranking?page=82'
  ];
  var list = $("#testList")
  var url = window.location.href;
  var type = 2;//1-页面 2-func
  if(type==1){
    var pcdata = [];
    var page = getUrlParam('page');
    $("ul li").each(function(){
        var y = $(this).clone();
        y.find(':nth-child(n)').remove();
        var obj = {};
        obj.text2= y.text();
        obj.text1 = $(this).find('a').text();
        obj.func = $(this).find('a').attr('href');
        pcdata.push(obj);
    });
    console.log(page, pcdata);
    //pcpage(pcdata);
  }else if(type==2){
      var funcdata = {};
      var this_url = window.location.pathname;
      funcdata.url = this_url;
      funcdata.inputs = [];
      $(".inputGroup label").each(function(){
          funcdata.inputs.push($(this).text());
      });
      funcdata.bg_color = $(":root").css('--main-bg-color');
      funcdata.res = $("#resultText div").text();
      console.log( funcdata, $("#resultText div").text());
      pcsave2(funcdata);
  }

    // 主函数
    function main(){
        //addDiv();
        //getNextUrl();
        console.log('main')
    }

   //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    function pcpage(pcdata){
      $.ajax({
          url:"https://a.chengyingtx.com/star/apix50/pcsave",
          type: 'post',
          dataType: 'json',
          data:{data:JSON.stringify(pcdata)},
          success:function(e){
              if(page<92){
                  var url = "https://wtf.hiigara.net/ranking?page=" + (Number(page)+1)
                  setTimeout(function(){
                      window.location.href = url;
                  }, 5000 )
                  console.log(url)
              }
          },
          error:function(e){
              console.log(e)
          }
      });
    }
    function pcsave2(pcdata){
      $.ajax({
          url:"https://a.chengyingtx.com/star/apix50/pcsave2",
          type: 'post',
          dataType: 'json',
          data:{data:JSON.stringify(pcdata)},
          success:function(e){
              var url = "https://wtf.hiigara.net" + e.func;
              console.log(url, e)
              if(e.func){
                  setTimeout(function(){
                      window.location.href = url;
                  }, 5000 )
              }
          },
          error:function(e){
              console.log(e)
          }
      });
    }
    function pcsave3(){
      $.ajax({
          url:"https://a.chengyingtx.com/star/apix50/pcsave3",
          type: 'post',
          dataType: 'json',
          data:{data:JSON.stringify(pcdata)},
          success:function(e){
              var url = "https://wtf.hiigara.net/" + e.func;
              console.log(url, e)
          },
          error:function(e){
              console.log(e)
          }
      });
    }

    /* Main Script */
    GM_registerMenuCommand('运行爬虫脚本',main);

/* 脚本结束 */
})();
