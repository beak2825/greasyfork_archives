// ==UserScript==
// @name         洛谷使用体验优化合集
// @namespace    https://www.qqzhi.cc/
// @version      2024.11.18.20
// @description  大大优化洛谷使用体验
// @author       旅禾
// @license MIT
// @match        *://*/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/510926/%E6%B4%9B%E8%B0%B7%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/510926/%E6%B4%9B%E8%B0%B7%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==
function 移除首页多余元素(){
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div:nth-child(1)").remove();
    //删去本站公告
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div.lg-article.am-hide-sm").remove();
    //删去友情链接
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-8").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-9.am-u-md-8.lg-index-benben.lg-right > div:nth-child(2)").remove();
   //删去slider
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div").className="am-u-md-12 lg-punch am-text-center";
    //打卡高度修复
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    //删去智能推荐
    document.querySelectorAll(".lg-article.lg-index-stat")[0].remove();
    //删去题号跳转
    document.querySelectorAll(".am-u-md-12")[0].className="am-u-md-4";
    //打卡宽度修复
    document.querySelectorAll(".am-g")[0].className="";
    //合并首排卡片
    document.querySelectorAll(".am-u-md-9")[0].className="am-u-md-8";
    //适配统计图宽
    window.onload=function(){document.querySelectorAll(".lg-article")[1].style.height=document.querySelectorAll(".lg-article")[0].clientHeight+"px"};
    document.querySelectorAll(".lg-article")[1].style.display="flex";
    document.querySelectorAll(".lg-article")[1].style.alignContent="center";
    document.querySelectorAll(".lg-article")[1].style.justifyContent="center";
    document.querySelectorAll(".lg-article")[1].style.flexWrap="wrap";
    document.querySelectorAll(".lg-article>.am-g")[1].style.height=""
    //适配折线图高
}
function 移除用户主页维护提示(){
    window.addEventListener('load',function(){
        var main = document.getElementsByClassName("card padding-default");
        main = main[main.length-1];
        var maintenance = main.getElementsByTagName('div')[0];
        var introduction = main.getElementsByTagName('div')[1];
        if(maintenance.innerText!='系统维护，该内容暂不可见。') return;
        maintenance.style.display="none";
        introduction.style.display="block";
    })
}
function 移除跨域提示(){
    if (document.querySelector("h3")&&document.querySelector("h3").innerText=="即将离开洛谷"){
        window.location.host="www.luogu.com";
    }
}
function 首页自动聚焦搜索栏(){
    $(function(){
        document.querySelectorAll(".icon.color-none")[0].click();
    })
}
function 添加顶栏置顶链接功能(){
    $(function(){
        var title = $(".link-container");
        var state=GM_getValue("user_link")&&true
        初始化();
        function 重置(){
            if (state){
                document.querySelector(".link-container").lastChild.remove();
                document.querySelector(".link-container").lastChild.remove();
            }
            document.querySelector(".link-container").lastChild.remove();
            document.querySelector(".link-container").lastChild.remove();
            state=GM_getValue("user_link")&&true
            初始化();
        }
        function 设置链接(){
            var link = prompt("请输入链接地址（为空清除）");
            if (!link)
                { GM_deleteValue("user_link_text");GM_deleteValue("user_link");return; }
            var text = prompt("请输入链接文字");
            GM_setValue("user_link_text", text);
            GM_setValue("user_link", link);
        }
        function 初始化(){
            var prelink = GM_getValue("user_link");
            var pretext = GM_getValue("user_link_text")
            var link = '<a href="' + prelink + '" id="userLink" target="_blank" class="header-link color-default">' + pretext + '</a>';
            var button = document.createElement("button");
            button.innerText = '编辑';
            button.className = 'am-btn am-btn-sm am-btn-primary'
            button.addEventListener('click', 设置链接);
            var helper = '<span class="helper"></span>';
            if (prelink){
                button.style.marginLeft="2em";
                title.append(link, helper);
            }
            title.append(button, helper);
        }
         GM_addValueChangeListener(
             "user_link",
             function (name, old_value, new_value, remote) {
                 重置()
             }
         );
    });
}
function 洛谷大吉每一天(){
    $('document').ready(function(){
    var x=document.querySelectorAll(".lg-punch-result");
    var y=document.querySelectorAll(".am-u-sm-6");
    if(x[0].innerHTML=="§ 大凶 §"){
        var sum="<span id='yi' style='font-weight:bold'>宜：</span>出行<br><span style='font-size:10px;color:#7f7f7f'>一路顺风</span></br>";
        sum+="<span id='yi' style='font-weight:bold'>宜：</span>继续完成WA的题<br><span style='font-size:10px;color:#7f7f7f'>下一次就可以AC了</span></br>";
        y[0].innerHTML=sum;
    }
    x[0].innerHTML="§ 大吉 §";
    x[0].style="color:#e74c3c!important";
    y[1].innerHTML="万事皆宜";
    y[1].style="color:rgba(0, 0, 0, .75)!important";
    y[1].style="font-weight:bold";
});
}
function 添加用户查找功能(){
  $('document').ready(function(){setTimeout(function () {
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
    $finder = $(`
      <div class="lg-article" id="find-user-form">
        <h2>查找用户</h2>
        <form id="find-user-form">
          <input type="text" class="am-form-field" name="finder-uid" placeholder="用户名或uid" autocomplete="off" />
        </form>
        <button class="am-btn am-btn-sm am-btn-primary" style="margin-top:16px;visibility:hidden">查找</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="find-user-button" style="margin-top:16px;">查找</button>
      </div>
    `);
    $finder.insertAfter($firstele);
    var find_func = function() {
      $.get("/api/user/search?keyword=" + $('[name=finder-uid]')[0].value,
        function (data) {
          var arr = data;
          if (!arr['users'][0]) {
            $('#find-user-button').removeClass('am-disabled');
            show_alert("好像哪里有点问题", "无法找到指定用户");
          }
          else {
            location.href = "/user/"+arr['users'][0]['uid'];
          }
        }
      );
      return false;
    };
    $('#find-user-button').click(find_func);
    $('#find-user-form').submit(find_func);
  },500)});
}
function 添加题号跳转功能(){
  $('document').ready(function(){setTimeout(function () {
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
    $finder = $(`
      <div class="lg-article" id="problem-form">
        <h2>跳转题目</h2>
        <input type="text" class="am-form-field" id="problem-id" placeholder="题号" autocomplete="off" />
        <button class="am-btn am-btn-sm am-btn-primary" style="margin-top:16px;visibility:hidden">查找</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="problem-button" style="margin-top:16px;">跳转</button>
      </div>
    `);
    $finder.insertAfter($firstele);
    var handleEnter = function(event) {
          if (event.keyCode === 13) {
              find_func();
          }
      }
    var find_func = function() {
        let id=$("#problem-id")[0].value;
        $("#problem-id")[0].value=""
        window.open("/problem/"+(isNaN(id)?id:("P"+id)));
        return false;
    };
    $('#problem-button').click(find_func);
    $('#problem-id').keydown(handleEnter);
  },500)});
}
function 添加将洛谷顶栏链接设为当前页面功能(){
    function 设定当前页面为置顶链接() {
            GM_setValue("user_link_text",document.title)
            GM_setValue("user_link",location.href)
        }
    GM_registerMenuCommand(
        "添加到洛谷顶栏",
        设定当前页面为置顶链接
    );
}
(function() {
    'use strict';
    添加将洛谷顶栏链接设为当前页面功能();
    if (location.href.match("://www.luogu.com.cn/")||location.href.match("://www.luogu.com/")){
        let 功能编辑开关="禁用";
        if (GM_getValue("功能编辑")=="启用"){
            功能编辑开关="启用"
        }else{
            GM_setValue("功能编辑","禁用")
        }
        let 启用功能列表=[],禁用功能列表=[],禁用功能菜单列表=[],启用功能菜单列表=[]
        let 功能列表=["移除跨域提示","移除用户主页维护提示","洛谷大吉每一天","首页自动聚焦搜索栏","移除首页多余元素","添加用户查找与题号跳转功能","添加顶栏置顶链接功能"]
        .forEach((element) => {
            if (GM_getValue(element)=="启用"){
                启用功能列表.push(element)
            }else if (GM_getValue(element)=="禁用"){
                禁用功能列表.push(element)
            }else{
                启用功能列表.push(element)
                GM_setValue(element,"启用")
            }
        });
        if (功能编辑开关=="启用"){
            启用功能列表.forEach((element) => {
                禁用功能菜单列表[element] = GM_registerMenuCommand(
                    "禁用"+element,
                    function () {
                        GM_setValue(element,"禁用")
                        window.navigation.reload();
                    }
                );
            });
            禁用功能列表.forEach((element) => {
                启用功能菜单列表[element] = GM_registerMenuCommand(
                    "启用"+element,
                    function () {
                        GM_setValue(element,"启用")
                        window.navigation.reload();
                    }
                );
            });
            GM_registerMenuCommand(
                "禁用功能编辑",
                function () {
                    GM_setValue("功能编辑","禁用")
                    window.navigation.reload();
                }
            );
        }else{
            GM_registerMenuCommand(
                "启用功能编辑",
                function () {
                    GM_setValue("功能编辑","启用")
                    window.navigation.reload();
                }
            );
        }
        if (location.href.match("://www.luogu.com.cn/user/")){
            if (启用功能列表.includes("移除用户主页维护提示")){
                try{
                    移除用户主页维护提示();
                }catch(e){console.error(e)}
            }
        }
        if (location.href.match("://www.luogu.com.cn/paste/")){
            if (启用功能列表.includes("移除跨域提示")){
                try{
                    移除跨域提示();
                }catch(e){console.error(e)}
            }
        }
        if (location.href.match("://www.luogu.com.cn/discuss/")){
            if (启用功能列表.includes("移除跨域提示")){
                try{
                    移除跨域提示();
                }catch(e){console.error(e)}
            }
        }
        if (location.href.match("://www.luogu.com.cn/article/")){
            if (启用功能列表.includes("移除跨域提示")){
                try{
                    移除跨域提示();
                }catch(e){console.error(e)}
            }
        }
        if (location.href=="https://www.luogu.com.cn/"){
            if (启用功能列表.includes("洛谷大吉每一天")){
                try{
                    洛谷大吉每一天();
                }catch(e){console.error(e)}
            }
            if (启用功能列表.includes("移除首页多余元素")){
                try{
                    移除首页多余元素();
                }catch(e){console.error(e)}
            }
            if (启用功能列表.includes("首页自动聚焦搜索栏")){
                try{
                    首页自动聚焦搜索栏();
                }catch(e){console.error(e)}
            }
            if (启用功能列表.includes("添加用户查找与题号跳转功能")){
                try{
                    添加用户查找功能();
                    添加题号跳转功能();
                }catch(e){console.error(e)}
            }
        }
        if (location.href.match("://www.luogu.com.cn/")){
            if (启用功能列表.includes("添加顶栏置顶链接功能")){
                try{
                    添加顶栏置顶链接功能();
                }catch(e){console.error(e)}
            }
        }
    }
})();