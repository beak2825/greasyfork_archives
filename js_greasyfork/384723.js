// ==UserScript==
// @name         bilibili首页增加[关注]列表
// @version      7.2
// @description  在bilibili网页端上方菜单添加[关注]的列表，可自定义更改关注列表，快速进入你关注的up主空间。
// @author       冬瓜语
// @match        *://www.bilibili.com/*
// @namespace    https://greasyfork.org/users/307669
// @license GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/384723/bilibili%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%8A%A0%5B%E5%85%B3%E6%B3%A8%5D%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/384723/bilibili%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%8A%A0%5B%E5%85%B3%E6%B3%A8%5D%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    var cookies = document.cookie;
    var id=cookies.match(/DedeUserID=(\d+)/)[1];
    go();
    function go(){
        //var old = document.querySelector("[report-id=playpage_dynamic]");                                                                                                   //上古版本(不再支持)
        //var oldVersion = document.querySelector("#internationalHeader > div.mini-header.m-header > div > div.nav-user-center > div.user-con.signin > div:nth-child(3)");    //旧版(不再支持)

        var Obj;
        var newVersion = document.querySelector("#i_cecream > div.bili-header.large-header > div.bili-header__bar > ul.right-entry > li:nth-child(4)");                        //新版
        var Video = document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4)");                                                                  //视频栏
        var channel = document.querySelector("#i_cecream > div > div.bili-header-default > div > div.bili-header__bar > ul.right-entry > li:nth-child(4)");                    //频道栏
        var betaVersion = document.querySelector("#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__bar > ul.right-entry > li:nth-child(4)");      //内测版

        if(newVersion){
            Obj = newVersion;
        }else if(Video){
            Obj = Video;
        }else if(channel){
            Obj = channel;
        }else if(betaVersion){
            Obj = betaVersion;
        }else{setTimeout(go,500);}


        var newNode = document.createElement("li");
        newNode.setAttribute("id","close");
        newNode.setAttribute("class","v-popover-wrap right-entry__outside right-entry--message");
        newNode.innerHTML='<a id="ty" href="https://space.bilibili.com/'+ id +'/fans/follow" target="_blank" class="right-entry__outside"><svg width="20" height="21"   t="1666938607977" class="right-entry-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2593"><path d="M800 128H224C134.4 128 64 198.4 64 288v448c0 89.6 70.4 160 160 160h576c89.6 0 160-70.4 160-160V288c0-89.6-70.4-160-160-160z m96 608c0 54.4-41.6 96-96 96H224c-54.4 0-96-41.6-96-96V288c0-54.4 41.6-96 96-96h576c54.4 0 96 41.6 96 96v448z" p-id="2594" fill="currentColor"></path><path d="M419.2 544c0 51.2-3.2 108.8-83.2 108.8S252.8 595.2 252.8 544v-217.6H192v243.2c0 96 51.2 140.8 140.8 140.8 89.6 0 147.2-48 147.2-144v-240h-60.8V544zM710.4 326.4h-156.8V704h60.8v-147.2h96c102.4 0 121.6-67.2 121.6-115.2 0-44.8-19.2-115.2-121.6-115.2z m-3.2 179.2h-92.8V384h92.8c32 0 60.8 12.8 60.8 60.8 0 44.8-32 60.8-60.8 60.8z" p-id="2595" fill="currentColor"></path></svg><span class="right-entry-text">关注</span></a>';
        Obj.parentNode.insertBefore(newNode,Obj);

        var newNode_Menu = document.createElement("div");
        newNode_Menu.setAttribute("id","hh");
        newNode_Menu.setAttribute("class","v-popover is-bottom");
        newNode_Menu.setAttribute("style","padding-top: 15px; margin-left: 0px; display: none;");
        newNode_Menu.innerHTML = '<div class="v-popover-content"><div class="message-entry-popover"><div id="list_up" class="message-inner-list"></div></div></div>'
        newNode.insertBefore(newNode_Menu,null);

        main();


        function main() {

            var timer = null;
            var Obj_List = document.querySelector("#list_up");


            /**
             *自动添加列表元素
             */
            if(localStorage.length>0){
                var number = 1;
                var x="a";
                for(var i=0;i<localStorage.length;i++){
                    var sitename = localStorage.key(i);
                    var mark = sitename.search("兾");
                    if(mark == 0){
                        var Nname=sitename.substring(1)
                        var siteurl = localStorage.getItem(sitename);

                        var newNodeP = document.createElement("a");
                        newNodeP.setAttribute("id","a"+number.toString());
                        newNodeP.setAttribute("class","message-inner-list__item");
                        newNodeP.innerHTML=Nname;
                        newNodeP.href=siteurl;
                        newNodeP.setAttribute("target","_blank");
                        Obj_List.insertBefore(newNodeP,null);

                        number++;
                    }
                }
            }


            /**
             *鼠标悬停展开列表
             */
            var OpenListBtn = document.getElementById("ty");
            OpenListBtn.onmouseenter = function(){
                timer =setTimeout(function(){
                    document.getElementById("hh").style.display="";
                },300);
            }


            /**
             *鼠标移出隐藏列表
             */
            var CloseListBtn = document.getElementById("close");
            CloseListBtn.onmouseleave = function(){
                timer =setTimeout(function(){
                    document.getElementById("hh").style.display="none";
                },300);
            }


            /**
             *添加设置按钮
             */
            var newNode4 = document.createElement("a");
            newNode4.setAttribute("id","setting");
            newNode4.setAttribute("class","message-inner-list__item");
            newNode4.setAttribute("href","javascript:;");
            newNode4.innerHTML='设置&nbsp;<svg width="14" height="14" t="1658726041989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2024" width="200" height="200"><path d="M944.48 552.458667l-182.357333 330.666666a73.792 73.792 0 0 1-64.565334 38.325334h-362.133333a73.792 73.792 0 0 1-64.565333-38.325334l-182.357334-330.666666a75.338667 75.338667 0 0 1 0-72.682667l182.357334-330.666667a73.792 73.792 0 0 1 64.565333-38.325333h362.133333a73.792 73.792 0 0 1 64.565334 38.325333l182.357333 330.666667a75.338667 75.338667 0 0 1 0 72.682667z m-55.989333-31.146667a10.773333 10.773333 0 0 0 0-10.378667l-182.037334-330.666666a10.517333 10.517333 0 0 0-9.205333-5.482667H335.733333a10.517333 10.517333 0 0 0-9.205333 5.482667l-182.037333 330.666666a10.773333 10.773333 0 0 0 0 10.378667l182.037333 330.666667a10.517333 10.517333 0 0 0 9.205333 5.472h361.514667a10.517333 10.517333 0 0 0 9.205333-5.472l182.037334-330.666667zM513.738667 682.666667c-94.261333 0-170.666667-76.405333-170.666667-170.666667s76.405333-170.666667 170.666667-170.666667c94.250667 0 170.666667 76.405333 170.666666 170.666667s-76.416 170.666667-170.666666 170.666667z m0-64c58.912 0 106.666667-47.754667 106.666666-106.666667s-47.754667-106.666667-106.666666-106.666667-106.666667 47.754667-106.666667 106.666667 47.754667 106.666667 106.666667 106.666667z" p-id="2025" fill="currentColor"></path></svg>';
            Obj_List.insertBefore(newNode4,null);


            /**
             *设置按钮（打开设置面板）
             */
            var settingBtn = document.getElementById("setting");
            settingBtn.onclick = function(){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;                 //先回到页面顶部

                const body = window.document.getElementsByTagName('body')[0];
                body.style.overflow = 'hidden';                         //禁用滚动条

                document.getElementById("BackGround").style.display="";
                document.getElementById("hh").style.display="none";
            }


            /**==============================
             *        优化界面样式
             *===============================
             */
             /**
             *添加可视化设置窗口
             */
            var Obj2_shadow;
            if(Obj){
                Obj2_shadow = document.querySelector("#i_cecream");
            }else if(Obj2){
                Obj2_shadow = document.querySelector("#app");
            }

            var newTable1 = document.createElement("div");
            newTable1.setAttribute("id","BackGround");
            newTable1.setAttribute("style","display:none;");
            Obj2_shadow.insertBefore(newTable1,null);

            var newTable2 = document.createElement("div");
            newTable2.setAttribute("id","shadow");
            newTable2.setAttribute("style","width:100%;height:100%;background:black;position:absolute;z-index:10001;top: 0;left: 0;filter:alpha(opacity:80);opacity:0.8;");
            newTable1.insertBefore(newTable2,null);

            var newTable3 = document.createElement("div");
            newTable3.setAttribute("id","panel");
            newTable3.setAttribute("style","box-shadow:rgba(0.5,0.5,0.5,0.5) 4px 4px 4px 4px;position: absolute; background: white; border-radius: 10px; padding: 20px; top: 400px; left: 50%; width: 600px;height: 600px; transform: translate(-50%, -50%); cursor: default;z-index:10002;filter:alpha(opacity:100);opacity:1;");
            newTable1.insertBefore(newTable3,null);

            var newTable4 = document.createElement("div");
            newTable4.innerHTML=' <svg style="margin-bottom: 10px" width="24" height="24" t="1658726041989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2024" width="200" height="200"><path d="M944.48 552.458667l-182.357333 330.666666a73.792 73.792 0 0 1-64.565334 38.325334h-362.133333a73.792 73.792 0 0 1-64.565333-38.325334l-182.357334-330.666666a75.338667 75.338667 0 0 1 0-72.682667l182.357334-330.666667a73.792 73.792 0 0 1 64.565333-38.325333h362.133333a73.792 73.792 0 0 1 64.565334 38.325333l182.357333 330.666667a75.338667 75.338667 0 0 1 0 72.682667z m-55.989333-31.146667a10.773333 10.773333 0 0 0 0-10.378667l-182.037334-330.666666a10.517333 10.517333 0 0 0-9.205333-5.482667H335.733333a10.517333 10.517333 0 0 0-9.205333 5.482667l-182.037333 330.666666a10.773333 10.773333 0 0 0 0 10.378667l182.037333 330.666667a10.517333 10.517333 0 0 0 9.205333 5.472h361.514667a10.517333 10.517333 0 0 0 9.205333-5.472l182.037334-330.666667zM513.738667 682.666667c-94.261333 0-170.666667-76.405333-170.666667-170.666667s76.405333-170.666667 170.666667-170.666667c94.250667 0 170.666667 76.405333 170.666666 170.666667s-76.416 170.666667-170.666666 170.666667z m0-64c58.912 0 106.666667-47.754667 106.666666-106.666667s-47.754667-106.666667-106.666666-106.666667-106.666667 47.754667-106.666667 106.666667 47.754667 106.666667 106.666667 106.666667z" p-id="2025"></path></svg> <text style="font-size:25px">设置</text><text id="closeX" style="color:grey;font-size:25px;float:right">X</text> ';
            newTable3.insertBefore(newTable4,null);

            newTable3.innerHTML+="<p><br><br></p>";

            var newTable6 = document.createElement("form");
            newTable6.innerHTML=" &nbsp;  &nbsp;  &nbsp;  &nbsp; 请输入UP主的名称: &nbsp; ";
            newTable3.insertBefore(newTable6,null);

            var newTable7 = document.createElement("input");
            newTable7.setAttribute("id","Name");
            newTable7.setAttribute("type","text");
            newTable7.setAttribute("placeholder"," 如：硬核的半佛仙人");
            newTable7.setAttribute("required","required");
            newTable7.setAttribute("maxlength","9");
            newTable7.setAttribute("style","color:gray; width: 280px; border: 1px solid #ccc; border-radius: 5px;box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 3px 1px");
            newTable7.innerHTML=" &nbsp;  &nbsp;  &nbsp;  &nbsp; 请输入UP主的名称: &nbsp; ";
            newTable6.insertBefore(newTable7,null);

            newTable3.innerHTML+="<p><br></p>";

            var newTable8 = document.createElement("form");
            newTable8.setAttribute("report-id","Theurl");
            newTable8.innerHTML=" &nbsp;  &nbsp;  &nbsp;  &nbsp; 请输入UP主的网址: &nbsp; ";
            newTable3.insertBefore(newTable8,null);

            var newTable9 = document.createElement("input");
            newTable9.setAttribute("id","Url");
            newTable9.setAttribute("type","text");
            newTable9.setAttribute("placeholder"," 如：https://space.bilibili.com/37663924");
            newTable9.setAttribute("required","required");
            newTable9.setAttribute("style","color:gray; width: 280px; border: 1px solid #ccc; border-radius: 5px;box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 3px 1px");
            newTable9.innerHTML=" &nbsp;  &nbsp;  &nbsp;  &nbsp; 请输入UP主的名称: &nbsp; ";
            newTable8.insertBefore(newTable9,null);

            newTable8.innerHTML += "<br><br> &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp; <button id='submit'style='color:#00AED6; border: none;background-color: white;padding: 2px 10px;border-radius:6px 6px 6px 6px;box-shadow:0 5px 5px 0 rgba(0,0,0.1,0.1);cursor:pointer;' > 添加 </button>";
            newTable8.innerHTML += " &nbsp; &nbsp; &nbsp; <button id='delete' style='color:#00AED6; border: none;background-color: white;padding: 2px 10px;border-radius:6px 6px 6px 6px;box-shadow:0 5px 5px 0 rgba(0,0,0.1,0.1);cursor:pointer;'> 删除 </button>";
            newTable8.innerHTML += " &nbsp; &nbsp; &nbsp; <button id='clear'style='color:#00AED6; border: none;background-color: white;padding: 2px 10px;border-radius:6px 6px 6px 6px;box-shadow:0 5px 5px 0 rgba(0,0,0.1,0.1);cursor:pointer;'> 清空所有 </button>";
            newTable8.innerHTML += " &nbsp; &nbsp; &nbsp; <text style='font-size:7px;'>提示：删除操作只需填写已有的UP主名称</text>";

            newTable3.innerHTML+='<br><div style="background:linear-gradient(to left,#FFFFFF,#00AED6,#FFFFFF);height:1px;"></div>';
            newTable3.innerHTML+="<br><div id='list' style='cellpadding:10;'></div>";


            /**
             *显示现有元素
             */
            var list = document.getElementById("list");
            if(localStorage.length>0){
                var result = "<div style='margin-left:30px'><table border='1' style='text-align: center;'>";
                result += "<tr><td style='width:120px;height:30px'>名称</td><td style='width:270px;height:30px'>网址</td></tr>";
                for(var i=0;i<localStorage.length;i++){
                    var sitename = localStorage.key(i);
                    var mark = sitename.search("兾");
                    if(mark == 0){
                        var Nname=sitename.substring(1)
                        var siteurl = localStorage.getItem(sitename);
                        result += "<tr><td  style='width:120px;height:30px'>"+Nname+"</td><td style='width:270px;height:30px'>"+siteurl+"</td></tr>";
                    }
                }
                result += "</table></div>";
                list.innerHTML = result;
            }else{
                list.innerHTML = "数据为空……";
            }

            var Turl=document.querySelector("[report-id=Theurl]");


            /**
             *增加记录
             */
            var submitBtn = document.getElementById("submit");
            submitBtn.onmouseover = function(){
                document.getElementById("submit").style.color="red";
            }
            submitBtn.onmouseout = function(){
                document.getElementById("submit").style.color="#00AED6";
            }
            submitBtn.onclick = function(){
                var name=document.getElementById("Name").value;
                var Nname="兾"+name;
                var address=document.getElementById("Url").value;
                if (name==null || name==""){
                    alert("Up主名称不可为空！");
                }
                else if (address==null || address==""){
                    alert("Up主网址不可为空！");
                }else{
                    localStorage.setItem(Nname, address);
                    alert("添加成功！刷新后生效！");
                }
            }


            /**
             *删除记录
             */
            var deleteBtn = document.getElementById("delete");
            deleteBtn.onmouseover = function(){
                document.getElementById("delete").style.color="red";
            }
            deleteBtn.onmouseout = function(){
                document.getElementById("delete").style.color="#00AED6";
            }
            deleteBtn.onclick = function(){
                var name=document.getElementById("Name").value;
                var mk = 0;
                if (name==null || name==""){
                    alert("Up主名称不可为空！");
                }else{
                    for(var i=0;i<localStorage.length;i++){
                        var sitename = localStorage.key(i);
                        var mark = sitename.search("兾");
                        if(mark == 0 && name==sitename.substring(1)){
                            localStorage.removeItem(sitename);
                            mk = 1;
                        }
                    }
                    if(mk==1){alert("删除成功！刷新后生效！");mk=0;}
                    else{alert("删除失败！（可能没有找到您输入的Up主名称）");}
                }
            }


            /**
             *清空记录
             */
            var clearBtn = document.getElementById("clear");
            clearBtn.onmouseover = function(){
                document.getElementById("clear").style.color="red";
            }
            clearBtn.onmouseout = function(){
                document.getElementById("clear").style.color="#00AED6";
            }
            clearBtn.onclick = function(){
                var r=confirm("您确定要清空所有已添加的关注内容吗？");
                if (r==true){
                    localStorage.clear();
                    alert("清除成功！刷新后生效！");
                }
            }


            /**
             *关闭按钮X特效
             */
            var closeXBtn = document.getElementById("closeX");
            closeXBtn.onmouseover = function(){
                document.getElementById("closeX").style.color="black";
            }
            closeXBtn.onmouseout = function(){
                document.getElementById("closeX").style.color="grey";
            }

            closeXBtn.onclick = function(){
                const body = window.document.getElementsByTagName('body')[0];
                body.style.overflow = 'initial';//启用滚动条
                document.getElementById("BackGround").style.display="none";
            }

            var shadowBtn = document.getElementById("shadow");
            shadowBtn.onclick = function(){
                const body = window.document.getElementsByTagName('body')[0];
                body.style.overflow = 'initial';//启用滚动条
                document.getElementById("BackGround").style.display="none";
            }
        }

    }
})();



/*
特别说明：任何问题或反馈欢迎联系作者（e-mail：2514782900@qq.com）


更新日志：
version 7.2
    1、修正了许可证。
    2、适配了内测版。
    3、适配了频道栏。


version 7.1
    1、现已不再适配B站旧版页面，请切换至新版使用。
    2、重新开放了视频页面的【关注】入口（填了5.1版本的坑，谢谢b站，希望未来能全面开放）。
    3、优化了样式，使之尽量与B站整体样式保持一致（希望这会是B站更新的最后一个版本lol）。
    4、修复了一些bug（这可能是我最满意的版本）。
    5、优化了代码。


version 7.0
    1、又适配了b站新版页面。
    2、保留了旧版的全部内容，现在新版旧版都可以使用此脚本了。
    3、最近备考，粗糙的适配一下就发布了，考完有时间再做完善吧，代码也混乱不堪了。



version 6.2
    1、修复了一个重要的bug。



version 6.1
    1、修复了一个重要的bug。


version 6.0
    1、适配了b站新版页面。
    2、保留了旧版的全部内容，现在新版旧版都可以使用此脚本了。

    待解决的问题：
    1、本次更新是为了尽快适应b站新版本，功能已全部移植，动画细节将在后续版本中陆续优化。


version 5.2
    1、修复了首页以外的地方无法关闭设置窗口的问题。
    2、继续优化了设置界面。



version 5.1      2019/6/25
    1、优化了设置界面，试图使界面变得更美观（笑）。
    2、现在点击“清空所有”的按钮后会弹出确认框。
    3、暂时关闭了除b站首页以外地方的【关注】入口。

    *已知bug：在b站首页以外的地方无法读取本地储存。



version 5.0      2019/6/14
    1、增添了可视化设置界面，用户再也不用去改代码辣，更新也不再覆盖用户的自定义内容辣！
    2、现在用户可以在设置里对自己的关注列表进行增删查的操作。
    3、这是一次历史性的更新。



version 4.0      2019/6/9
    1、优化了代码结构。
    2、自动计算列表高度，方便用户自由增加或减少关注列表。
    3、修改了使用说明。



version 3.1      2019/6/8
    1、删除了【追番】入口。
    2、更改了脚本功能的描述。



version 3.0      2019/6/7
    1、实现了子菜单淡入淡出的同时滑动出场退场的效果。
    2、优化了子菜单的延迟显示效果。
    3、优化了代码算法逻辑。

    待解决的问题：
    1、鼠标悬停时每一个超链接都会变成圆角。
    2、当鼠标频繁选中和离开时会导致菜单频繁打开关闭。



version 2.0      2019/6/7
    1、更改了事件的触发方式，将“点击”触发替换成“悬停”触发。
    2、优化了鼠标选中时改变背景色和字体颜色。
    3、优化了菜单栏的圆角。
    4、优化了菜单栏的阴影。
    5、优化了字体。
    6、优化了菜单栏的居中。
    7、优化了代码逻辑。

    待解决的问题：
    1、存在鼠标悬停在最后一个超链接时改变背景色的同时会改变圆角的bug，修复后解决了此bug但又出现了使每一个超链接被选中时都变成圆角的新bug。
    2、子菜单弹出没有实现延迟显示功能。
    3、子菜单没有实现淡入淡出的效果。
    4、鼠标频繁选中会导致菜单频繁打开。



version 1.0      2019/6/3
    1、增添了【追番】入口。
    2、增添了【关注】入口。
    3、添加了子菜单栏。

    待解决的问题：
    1、【关注】入口的事件触发方式目前为“点击”，悬停触发事件的方式目前存在不可抗拒的Bug，后续版本更新中会陆续解决。
    2、子菜单中鼠标悬停还不能更改背景色。
    3、子菜单弹出没有实现延迟显示功能。
    4、子菜单没有实现圆角和阴影的样式。
    5、子菜单位置整体偏右。
    6、添加关注元素时需改动的代码过多。
    7、算法逻辑混乱，尚未修改。


*/