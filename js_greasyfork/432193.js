// ==UserScript==
// @name         一键点赞
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键点赞10条帖子，目前只支持当前账号的点赞，多账号正在开发中……（帖子列表页会显示一键点赞的按钮，点击即可）
// @author       东东
// @include      *://*.fannstar.tf.co.kr/community*
// @include      *://*.fannstar.tf.co.kr/community#_ace
// @include      *://*.fannstar.tf.co.kr/community
// @include      *://fannstar.tf.co.kr/stars/community*

// @match        *://*.fannstar.tf.co.kr/community#_ace
// @match        *://*.fannstar.tf.co.kr/community
// @match        *://fannstar.tf.co.kr/stars/community*

// @icon         http://img.tf.co.kr/ss/2016/starwars/logo.png
// @grant        无
// @downloadURL https://update.greasyfork.org/scripts/432193/%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/432193/%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

//配置用户组
var UserList = [
　　//{UserID:'aaa',UserPwd:'bbb'},
];

var NowUserID="";
var UserMessage="";
//addFloatButton('一键点赞', thumbsUpAll)
addFloatButton('一键点赞', thumbsThisNow)
GetCookie("sid");

function thumbsThisNow()
{
    if(NowUserID!="")
    {
        //执行点赞10条
        var success=0;
        var tips="";
        var allLis=document.getElementsByClassName("lt1 pt");
        for (var i = 0; i < 10; i++) {
            var a=allLis[i].children[0];
            var aHref=a.href;
            var Idx=aHref.replace("http://fannstar.tf.co.kr/stars/read?Idx=","");
            var data = "boardType=BoardFan_kr&Idx="+Idx+"&UserID="+NowUserID+"&ActionType=recommend";
            $.ajax({
                url:'/api/addactions',
                type:"GET",
                data:data,
                dataType:"json",
                success:function(ret){
                    if(ret.res == 1)
                    {
                        success++;
                    }
                    else
                    {
                        tips=ret.message;
                        //continue;
                    }
                },
                error:function(e){
                    alert(e.responseText);
                }
            });
        }
        if(success<10)
        {
            tips=",可能原因:"+tips;
        }
        console.log(NowUserID+"操作成功，点赞"+success+"条"+tips);
        UserMessage+=NowUserID+"操作成功，点赞"+success+"条"+tips+"/n";
    }
    else
    {
    UserMessage="未登录账号";
    }
    //alert(UserMessage);
    alert("操作完成！");
}

//获取当前登录人的账号
function GetCookie(name)
{
    var CookieValue = null;
        if(document.cookie && document.cookie != ''){
            var Cookies = document.cookie.split(";");
            for( var i = 0; i < Cookies.length; i++){
                var Cookie = (Cookies[i] || "").replace(/^\s+|\s+$/g, "");
                //这个if写的屌
                if(Cookie.substring(0, name.length + 1) == (name + '=')){
                    CookieValue = decodeURIComponent(Cookie.substring(name.length + 1));
                    break;
                }
            }
        }
    NowUserID=CookieValue;
}

function thumbsUpAll (parentNode) {
    //先执行登出
    var NewWin = window.open("http://fannstar.tf.co.kr/members/logout", "_blank");
    //NewWin.close();
    //循环用户组
    for( var j=0;j<UserList.length;j++)
    {
        //获取账号密码
        var json_UserID=UserList[j].UserID;
        var json_UserPwd=UserList[j].UserPwd;
        setTimeout(ThumbsUpOne(json_UserID,json_UserPwd),20000);
        console.log(json_UserID+"_"+json_UserPwd);
        //点赞完成后登出用户，如果是最后一位用户，则不登出
        //if(j<UserList.length-1)
        //{
            var NewWin2 = window.open("http://fannstar.tf.co.kr/members/logout", "_blank");
            //NewWin2.close();
        //}
    }
    if(UserMessage!=""){
    alert(UserMessage);
    }
}

function ThumbsUpOne(json_UserID,json_UserPwd)
{
 //登录
        $.post( "/members/login", { userID: json_UserID, userPass: json_UserPwd, saveid: "Y", savesession: "Y" }).done(function( datas ) {
				console.log(json_UserID+"登录"+datas);
				if (datas.trim() != "success")
				{
                   UserMessage+=json_UserID+"登录失败，原因："+datas.trim()+"/n";
				}
				else
				{
                    //执行点赞10条
                    var success=0;
                    var tips="";
                    var allLis=document.getElementsByClassName("lt1 pt");
                    for (var i = 0; i < 10; i++) {
                        var a=allLis[i].children[0];
                        var aHref=a.href;
                        var Idx=aHref.replace("http://fannstar.tf.co.kr/stars/read?Idx=","");
                        var data = "boardType=BoardFan_kr&Idx="+Idx+"&UserID="+json_UserID+"&ActionType=recommend";
                        $.ajax({
                            url:'/api/addactions',
                            type:"GET",
                            data:data,
                            dataType:"json",
                            success:function(ret){
                                if(ret.res == 1)
                                {
                                    success++;
                                }
                                else
                                {
                                    tips=ret.message;
                                    //continue;
                                }
                            },
                            error:function(e){
                                alert(e.responseText);
                            }
                        });
                    }

                    if(success<10)
                    {
                        tips=",可能原因:"+tips;
                    }

                    console.log(json_UserID+"操作成功，点赞"+success+"条"+tips);
                    UserMessage+=json_UserID+"操作成功，点赞"+success+"条"+tips+"/n";
                }
			});
}

function addFloatButton (text, onclick) {
  if (!document.addFloatButton) {
    const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
    buttonContainer.innerHTML = '<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}.spsty{padding:0;box-shadow:none;background-color:none;display:none;}.txtsty{background:none;border:1px;padding:2px;box-shadow:none;background-color:#fff;color:black;text-indent:3px;}</style><span class=spsty><input type=text placeholder=当前登录账号 class=txtsty  id=txtids /></span>'
    document.addFloatButton = (text, onclick) => {
      const button = document.createElement('button')
      button.textContent = text
      button.addEventListener('click', onclick)
      return buttonContainer.appendChild(button)
    }
  }
  return document.addFloatButton(text, onclick)
}