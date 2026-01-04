// ==UserScript==
// @name        天天基金 - 基金PC详情页精简
// @namespace   Violentmonkey Scripts
// @grant       none
// @description 移除页面乱七八糟的内容, 专注走势和净值
// @version     1.0.4
// @author      SkayZhang
// @license     MIT
// @icon        https://j5.dfcfw.com/image/201502/20150227144530.png
// @supportURL  https://greasyfork.org/zh-CN/scripts/436307/feedback
// @match       *://fund.eastmoney.com/*
// @description 2021/11/30 上午10:54:52
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436307/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%20-%20%E5%9F%BA%E9%87%91PC%E8%AF%A6%E6%83%85%E9%A1%B5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/436307/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%20-%20%E5%9F%BA%E9%87%91PC%E8%AF%A6%E6%83%85%E9%A1%B5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
(function () {
  'use strict'
  let id = ""
  let chatDom
  
  $("body>*").css("opacity","0")
  
  let state = localStorage.getItem("cleanState")
  
  setTimeout(()=>{
    if(state){
      main.init()
      main.clean()
      main.build()
    }else main.addBtn()
  },500);
  let main = {
    init(){
      id = window.location.pathname.replace("/","")
      id = id.substring(0,id.indexOf("."))
      $("body").append(`<style>.estimatedMap .estimatedchart{padding:0} .fund-common-second-menu{padding-bottom:5px;} .title{padding-left:7px;font-size:23px;line-height:28px;float:left;} .btnBox{display:flex;align-items:center;justify-content:center;} .btn{cursor:pointer;margin:0 7.5px;width:80px;height:40px;background-color:#4372ba;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:8px;}</style>`)
      chatDom = $(".estimatedchart").html()
    },
    clean(){
      // 移除顶部广告
      $("body>div[id!=body]").first().remove()
      
      // 待移除元素列表
      let removeList = ["#rightadvert","#BottomSwith","#_AdSame_divsub_pd",".buyWayWrap",".fund_item.quotationItem_DataMap.popTab",".choseBuyWay-shadow",".dropdown.head-item.droplist",".logo.fl","h1.fl",".item_title.hd",".quotationItem",".estimatedsideInfo",".fundDetail-footer",".fundDetail-tools",".fl.links","#referAd1",".referAdDiv"]
      // 遍历列表并移除元素
      for(let i in removeList){
        $(removeList[i]).remove()
      }

      // 待移除元素下级列表
      let removeSubList = [".adcommon",".fundtypeNav",".SitePath",".lazy",".recentBrowse",".declare",".cpright",".cls_btn","#float_phone"]
      // 遍历下级列表并移除元素
      for(let i in removeSubList){
        $(removeSubList[i]).parent().remove()
      }
    },
    build(){
      // 移动走势图未知
      $(".choseBuyWay").append(`<div class="estimatedMap" id="estimatedMap"><div class="estimatedchart hasLoading">${chatDom}</div></div>`)
      $(".choseBuyWay img").css("width","430px")
      $(".merchandiseDetail .fundDetail-main").css("border","1px solid #cce0ff")
      
      // 加入脚本控制按钮
      $(".fundDetail-main").css("height","270px")
      $(".fundInfoItem").append(`<div class="btnBox"><div class="btn" onclick="javascript:location.reload();">刷新页面</div><div class="btn" onclick="javascript:localStorage.removeItem('cleanState');location.reload();">正常模式</div></div>`)
      
      // 修改页面头部
      $(".inner").prepend(`<div class="title">${$(".fundDetail-tit").text()}</div>`);
      $(".fundDetail-header").remove();
      
      // 移除顽固内容
      let cleanAIAssistant = setInterval(()=>{
        if($("#AIAssistant")){
          let domHtml = $("#AIAssistant").html()
          if(domHtml && domHtml.length>5){
            $("#AIAssistant").remove();
            clearInterval(cleanAIAssistant)
            main.update();
          }
        }
      },500);
      
      $("body>*").css("opacity","1")
    },
    addBtn(){
      $("body").append(`<style>#cleanBtn{cursor:pointer;position:fixed;left:15px;bottom:calc(50vh - 30px);width:60px;height:60px;background-color:#4372ba;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:8px;}</style>`)
      $("body").append(`<div id="cleanBtn" onclick="javascript:localStorage.setItem('cleanState','true');location.reload();"><div>精简模式</div></div>`)
      $("body>*").css("opacity","1")
    },
    update(){
      // 清除所有计时器
      let end = setInterval(()=>{}, 100);
      for (let i = 1; i <= end; i++) {
          clearInterval(i);
      }
      
      // 开始准备更新趋势图和净值
      let img = $("#estimatedMap").find("img");
      let imgurl = $(img).attr("src");
      setInterval(function() {
        let today = new Date();
        if (today.getDay() > 0 && today.getDay() < 6) {
          if (today.getHours() >= 9 && today.getHours() < 12) {
            $(img).attr("src", imgurl + "?v=" + Math.random())
            main.queryData()
          } else {
            if (today.getHours() >= 13 && today.getHours() < 15) {
              $(img).attr("src", imgurl + "?v=" + Math.random())
              main.queryData()
            }
          }
        }
      }, 30000)
    },
    queryData(){
      // 跨域请求获取净值
      var _script = document.createElement("script");
      _script.setAttribute("charset", "utf-8");
      _script.setAttribute("type", "text/javascript");
      _script.setAttribute("src", "http://fundgz.1234567.com.cn/js/" + id + ".js?rt=" + new Date().getTime());
      document.getElementsByTagName("head")[0].appendChild(_script);
      if(/safari/.test(window.navigator.userAgent.toLowerCase())){
        _script.parentNode.removeChild(_script);
      }else{
        _script.onload = function() {
          _script.parentNode.removeChild(_script);
        }
      }
    }
  }
})();