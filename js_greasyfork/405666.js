// ==UserScript==
// @name         洛谷假人神器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  给一个人改成紫名并给予金钩，适合用于假人或膜拜等情形
// @author       rui_er
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405666/%E6%B4%9B%E8%B0%B7%E5%81%87%E4%BA%BA%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/405666/%E6%B4%9B%E8%B0%B7%E5%81%87%E4%BA%BA%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  $('document').ready(function(){setTimeout(function () {
    var uid;
    var username;
    var color;
    var tag;
    var argon;
    var haveTag;
    if(localStorage.LG_tag == undefined) localStorage.LG_tag = "管理员";
    if(localStorage.LG_haveTag == undefined) localStorage.LG_haveTag = null;
    color = localStorage.LG_color;
    uid = localStorage.LG_uid;
    username = localStorage.LG_username;
    tag = localStorage.LG_tag;
    argon = localStorage.LG_isargon;
    haveTag = localStorage.LG_haveTag;
    var html = '<button class="am-btn am-btn-danger am-btn-sm" id="re_log">重新渲染</button>'
    var TNode = document.createElement('div');
	TNode.className = 'lg-article';
    TNode.id = 're_log';
	TNode.innerHTML = html;
	document.querySelector('div.lg-index-benben > div:nth-child(3)').insertAdjacentElement('afterend', TNode);
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
    $finder = $(`
      <div class="lg-article" id="search-user-form">
        <h2>假人神器</h2>
        <script>
          function do_user_clear() {
            localStorage.LG_color = undefined;
            localStorage.LG_uid = undefined;
            localStorage.LG_username = undefined;
            color = undefined;
            uid = undefined;
            username = undefined;
            location.href = "/";
            return true;
          }
          function do_change_tag() {
            localStorage.LG_tag = $('[name=change-tag]')[0].value;
            tag = localStorage.LG_tag;
            location.href = "/";
            return true;
          }
          function use_argon() {
            localStorage.LG_isargon = 1;
            argon = 1;
            location.href = "/";
          }
          function dont_use_argon() {
            localStorage.LG_isargon = 0;
            argon = 0;
            location.href = "/";
          }
          function loadSettings() {
            console.log("success!");
            document.getElementById("setting_fake").innerHTML = "<ul><li>uid="+localStorage.LG_uid+"</li><li>tag="+localStorage.LG_tag+"</li><li>isargon="+localStorage.LG_isargon+"</li></ul>";
          }
        </script>
        <p>当前设置：</p>
        <div id="setting_fake">
          <button class="am-btn am-btn-sm am-btn-primary" onclick="loadSettings()">显示</button></div>
        <form id="search-user-form">
          <input type="text" class="am-form-field" name="search-uid" placeholder="用户名或uid" autocomplete="off" />
        </form>
        <button class="am-btn am-btn-sm am-btn-primary" id="delete-user-button" onclick="do_user_clear()" style="margin-top:16px">取消</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="search-user-button" style="margin-top:16px;">查找</button>
        <form id="change-tag-form">
          <input type="text" class="am-form-field" name="change-tag" placeholder="更改的tag" autocomplete="off" />
        </form>
        <button class="am-btn am-btn-sm am-btn-primary" id="change-tag-button" onclick="do_change_tag()" style="margin-top:16px;">更改</button>
        <br>
        <button class="am-btn am-btn-sm am-btn-primary" id="use-argon" onclick="use_argon()" style="margin-top:16px">氩洛谷</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="dont-use-argon" onclick="dont_use_argon()" style="margin-top:16px">普通洛谷</button>
      </div>
    `);
    $finder.insertAfter($firstele);
    var find_func = function() {
      $('#search-user-button').addClass('am-disabled');
      $.get("/api/user/search?keyword=" + $('[name=search-uid]')[0].value,
        function (data) {
          var arr = data;
          if (!arr['users'][0]) {
            $('#search-user-button').removeClass('am-disabled');
            show_alert("好像哪里有点问题", "无法找到指定用户");
          }
          else {
            uid = arr['users'][0]['uid'];
            username = arr['users'][0]['name'];
            color = arr['users'][0]['color'];
            haveTag = arr['users'][0]['badge'] == null ? 0 : 1;
            localStorage.LG_color = color;
            localStorage.LG_uid = uid;
            localStorage.LG_username = username;
            localStorage.LG_haveTag = haveTag;
            location.href = "/";
          }
        }
      );
      return false;
    };
    $('#search-user-button').click(find_func);
    $('#search-user-form').submit(find_func);
    console.log(color);
    console.log(uid);
    console.log(username);
    console.log(tag); // 输出到 F12-Console 中，用于调试
    var classname = "lg-fg-"+color.toLowerCase(); // 更改洛谷名字颜色类的代码，下两行同
    if (color.toLowerCase() == "red" || color.toLowerCase() == "orange") classname += " lg-bold";
    if (color.toLowerCase() == "blue") classname += "light";
function re_log(){
    console.log("re_log");
    var tar = document.getElementsByClassName(classname);
    var ele = "&nbsp;<a class=\"sb_amazeui\" target=\"_blank\" href=\"/discuss/show/142324\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"#f1c40f\" style=\"margin-bottom: -3px;\"><path d=\"M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z\"></path></svg></a>";
    for (var i = 0; i < tar.length; i++)
    {
        if (tar[i].attributes['href'] == undefined) continue;
        if (tar[i].attributes['href'].value == "/user/"+uid)
        {
            tar[i].innerHTML = username+"&nbsp;<a class=\"sb_amazeui\" target=\"_blank\" href=\"/discuss/show/142324\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"#f1c40f\" style=\"margin-bottom: -3px;\"><path d=\"M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z\"></path></svg>";
            if(tar[i].nextElementSibling != null) {
                tar[i].nextElementSibling.innerHTML="";
            }
        }
    }}
    re_log();
    $("#re_log").click(function(){ // 点击“重新渲染”按钮
        re_log();
    });
    var oDiv = document.getElementById("feed-more"); // 点击“点击查看更多”所在 div（id 查找）
    oDiv.onclick = function(){
        re_log();
    }
    $('ul li').click(function(){ // 点击“我关注的”“我发布的”所在 ul（id 查找）
        setTimeout(function(){re_log()}, 500);
    });
    var iDiv = document.getElementsByTagName("li");
    for(var i=0; i<iDiv.length; i++){
        iDiv[i].onclick = function () {
            setTimeout(function(){re_log()}, 500);
        };
    }
    if(haveTag != 1) {
    var css = "";
if (false || (new RegExp("^((?!blog).)*https://www.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*http://www.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*https://www2.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*http://www2.luogu.com.cn((?!blog).)*$")).test(document.location.href))
{ // 如果你使用了氩洛谷，不用改任何地方
    if(argon == 1){
        css += [ // 更改洛谷部分 CSS 代码，下面不使用氩洛谷处同
        "a[class^=\"lg-fg-\"][href^=\"/user/"+uid+"\"][href$=\"/user/"+uid+"\"] {",
"    color: #8e44ad !important;",
"    font-weight: bold",
"}",
"a[class^=\"lg-fg-\"][href^=\"/user/"+uid+"\"][href$=\"/user/"+uid+"\"]:after {",
"    content:\""+tag+"\";",
"    display: inline-block;",
"    min-width: 10px;",
"    padding: .25em .625em;",
"    font-size: 1.2rem;",
"    font-weight: 700;",
"    color: #fff;",
"    line-height: 1;",
"    vertical-align: baseline;",
"    white-space: nowrap;",
"    background-color: #8e44ad;",
"    border-radius: 50px;",
"    margin-left: 3px;",
"    padding-left: 10px;",
"    padding-right: 10px;",
"    padding-top: 4px;",
"    padding-bottom: 4px;",
"    transition: all .15s;",
"}"
	].join("\n");}
    else{

   css += [
      "a[class^=\"lg-fg-\"][href^=\"/user/"+uid+"\"][href$=\"/user/"+uid+"\"] {",
"    color: #8e44ad !important;",
"    font-weight: bold",
"}",
"a[class^=\"lg-fg-\"][href^=\"/user/"+uid+"\"][href$=\"/user/"+uid+"\"]:after {",
"    content:\""+tag+"\";",
"    display: inline-block;",
"    min-width: 10px;",
"    padding: .25em .625em;",
"    font-size: 1.2rem;",
"    font-weight: 700;",
"    color: #fff;",
"    line-height: 1;",
"    vertical-align: baseline;",
"    white-space: nowrap;",
"    background-color: #8e44ad;",
"    margin-left: 3px;",
"    transition: all .15s;",
"}"
      ].join("\n"); }
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
}
}
}
  },500)});
})();