// ==UserScript==
// @name         抽奖系统添加搜索按钮
// @description  对系统进行增强
// @namespace    Violentmonkey Scripts
// @match        http://*/School/kefu.jsp*
// @require      https://code.jquery.com/jquery-1.11.1.js
// @icon         https://bkimg.cdn.bcebos.com/pic/267f9e2f07082838b61e8eedb199a9014c08f13c?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxNTA=,g_7,xp_5,yp_5
// @author       xzq
// @version      0.1.5.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383629/%E6%8A%BD%E5%A5%96%E7%B3%BB%E7%BB%9F%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/383629/%E6%8A%BD%E5%A5%96%E7%B3%BB%E7%BB%9F%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
  
    //定义搜索引擎
    var searchs = {
      "百度":"http://www.baidu.com/s?wd=",
      "必应":"https://cn.bing.com/search?q=",
      "360搜索":"http://www.so.com/s?q=",
      "搜狗":"http://www.sogou.com/sogou?query=",
      "Google(VPN)":"http://www.google.com.hk/search?q=",
      "Yahoo(VPN)":"https://search.yahoo.com/search?p="
    };
  
    //添加----“搜索按钮的添加按钮”
    var addSearchBtn = $("#search").clone(true).attr("type","button").attr("id","addSearchBtn").attr("style","margin-left:5px").attr("class","btn btn-info").text("添加搜索按钮").appendTo($("#search").parent());
    
    //添加select选择框
    var str = "<div class='input-group' style='margin-left:8px'><span class='input-group-addon'>搜索引擎</span><select id='searcgEngine' class='selectpicker show-tick form-control'>";
    for(var key in searchs){
        str += "<option value="+ searchs[key] +">"+ key +"</option>";
    }
    str += "</select></div>";
    var searcgEngine = $(str).appendTo($("#search").parent());
  
    //绑定选择框的change事件--选择对应引擎
    $('#searcgEngine').change(function(){
        addBtn();
    });
  
    var addBtn = function(){
        //删除存在的按钮
        $(".newbtn").remove();
      
        var cjBtns = $("button:contains(抽奖咯)");
        //遍历每一个学校
        cjBtns.each(function(i){
            //删除多余的br
            $(this).parent().next().find('br').remove();
          
           //获取学校名称
            var schoolNameElem = $(this).parent().next();
            var schoolName = schoolNameElem.text();
            var reg = RegExp(/\(\d+\)/);
            if(reg.test(schoolName)){
                schoolName = schoolName.substring(0, schoolName.indexOf("("));
            }
            // 替换学校名
            if($(schoolNameElem).html().indexOf("seachrName") == -1){
               $(schoolNameElem).html($(schoolNameElem).html().replace(schoolName, "<a href='" + $('#searcgEngine').val() + schoolName + "' target='_blank' id='seachrName'’>"+schoolName+"</a>"));
            }
            // 学校名存在其他搜索引擎的绑定，重置属性即可
            if($(schoolNameElem).html().indexOf("href") != -1){
               $("#seachrName").attr("href", $('#searcgEngine').val() + schoolName);
            }
            

           
            //添加搜索按钮
            var newjwbtn = $("<br/><button type='button' class='sjwbtn newbtn btn btn-default btn-xs' style='margin-top:5px'><span class='glyphicon glyphicon-search'></span> 搜教务系统</button>").appendTo($(this).parent().next());
            var newtbbtn = $("<br/><button type='button' class='stbbtn newbtn btn btn-default btn-xs' style='margin-top:5px'><span class='glyphicon glyphicon-search'></span> 搜百度贴吧</button>").appendTo($(this).parent().next());
            var newbkbtn = $("<br/><button type='button' class='sbkbtn newbtn btn btn-default btn-xs' style='margin-top:5px'><span class='glyphicon glyphicon-search'></span> 搜百度百科</button>").appendTo($(this).parent().next());

            //拼接url
            var jwurl = $('#searcgEngine').val() + schoolName + " 教务系统";
            var tburl = "http://tieba.baidu.com/f/search/res?ie=utf-8&kw=" + schoolName + "&qw=教务系统";
            var bkurl = "https://baike.baidu.com/item/" + schoolName;

            //绑定按钮的打开新页面的事件
            newjwbtn.click(function(){
               window.open(jwurl);
            });
            newtbbtn.click(function(){
               window.open(tburl);
            });
            newbkbtn.click(function(){
               window.open(bkurl);
            });
        });
    };
    
    //添加搜索按钮的点击事件
    addSearchBtn.click(addBtn);
  
})();