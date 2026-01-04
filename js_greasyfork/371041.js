// ==UserScript==
// @name LAY社区辅助签到和优化脚本
// @version  1.0.2
// @namespace Violentmonkey Scripts
// @match  *://fly.layui.com/*
// @include *://fly.layui.com/*
// @grant none
// @description 常用论坛辅助签到工具
// @downloadURL https://update.greasyfork.org/scripts/371041/LAY%E7%A4%BE%E5%8C%BA%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0%E5%92%8C%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/371041/LAY%E7%A4%BE%E5%8C%BA%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0%E5%92%8C%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(x=>{
  
    var init = ($)=>{
        $(".layui-nav.fly-nav").find("li:last-child").after("<li class='layui-nav-item'><a href='https://www.layui.com/doc/'><i class='layui-icon layui-icon-read'></i>示例文档</a></li>");
        $(".fly-column-right").html('<form  target="_blank"  onkeydown="if(event.keyCode==13)return false;" action="http://cn.bing.com/search" id="search_form" style="display: inline-block;width: 300px;"><input style="border: 1px solid #92c3ff;" id="searchInput" autocomplete="off" placeholder="搜索内容，回车跳转" type="text" name="q" class="layui-input"></form>');
  
        var trObj = document.getElementById('searchInput');
        trObj.onkeyup=function(event){if(event.keyCode == 13){

          //var form =  document.getElementById('search_form');
          //form.setAttribute("action","https://cn.bing.com/search?q=site:layui.com+"  + trObj.value);
          //form.action = "https://cn.bing.com/search?q=site:layui.com "  + trObj.value;
          //form.method='get';
          //form.submit();
          
          var params = {
              //必填参数
              "url":"https://cn.bing.com/search",
              "methond":"get",
              "target":"_blank",
              //下边为要提交的数据
              "q":"site:layui.com " +  trObj.value
          }                 
          jsFormSubmit(params);
          
        }}//使用js获取按下的键值
    }
  
    
    function jsFormSubmit(params) {
        var turnForm = document.createElement("form");
        //一定要加入到body中！！
        document.body.appendChild(turnForm);

        var method = params['methond'] || "POST"; //默认为post
        turnForm.method = method;
        delete params['methond'];

        var target = params['target'] || "_self"; //默认为当前页面
        turnForm.target = target;
        delete params['target'];

        var url = params.url; //提交地址
        turnForm.action = url;
        delete params['url'];


        //创建隐藏表单
        for(var item in params){
          var newElement = document.createElement("input");
          newElement.setAttribute("type","hidden");
          newElement.setAttribute("name",item);
          newElement.setAttribute("value",params[item]);
          turnForm.appendChild(newElement);
        }

        turnForm.submit();
    }
    
  
  	if(isURL("fly.layui.com")){
        layui.use(['layer','jquery'], function(){
          var layer = layui.layer,$ = layui.jquery;
          init($);
          setTimeout(function(){
            var trObj = document.getElementById('LAY_signin')
            if(trObj!=null){trObj.click();layer.msg('签到成功');}
          },3000);
        });        
    }
  
    function isURL(x){
        return window.location.href.indexOf(x) != -1;
    }
  
})()