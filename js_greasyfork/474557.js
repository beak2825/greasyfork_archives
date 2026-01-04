// ==UserScript==
// @name         Click-a-picture-to-Hide
// @namespace    https://www.hornmiclink.com/
// @version      1.0.1
// @description  点击图片隐藏它 click a picture to Hide it
// @author       Tsuihan@163.com
// @require      https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @match        *://*/*
// @icon         https://web-generate.oss-accelerate.aliyuncs.com//temp/HJSMshortcuticon_1653040529394.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474557/Click-a-picture-to-Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/474557/Click-a-picture-to-Hide.meta.js
// ==/UserScript==

//updated @ 230905 8:48
$(function($){
    //添加界面    //alert(window.location.hostname);
    var node = document.createElement("div");
    node.id = "uiDiv";
    //node.className = "uiDivCCS";
    node.style.cssText = "position:fixed; top:80px; left:0px; z-index=2147483647; padding:6px; border-radius:6px; font-size:12px;"
        +" background-color:#329CC0; opacity: 0.88; text-align:center; "
    //node.style.position ="fixed";    //node.style.top = 10;    //node.style.left = 100;    //node.style.z-index= 999;
    node.innerHTML ="<button id='hideBtn' title='click to HIDE all images'>Hide</button> or "+
        "<button id='showBtn' title='click to SHOW all images'>Show</button><br> all images" +
        "<br><button id='closeBtn' title='click to Close this menu. And press F2 to reload this tool.' width=80% >&nbsp;X&nbsp;</button>"
    //document.body.appendChild(node);
    document.documentElement.appendChild(node);
    node.title="Please contact Tsuihan@163.com to get more. Thanks.";
    //为hideBtn添加click事件
    document.querySelector("#hideBtn").addEventListener("click",hideBtnDo);
    document.querySelector("#showBtn").addEventListener("click",showBtnDo);
    document.querySelector("#closeBtn").addEventListener("click",closeMyself);


    //点击图片隐藏它
    $("img").click(
        function(){
            $(this).hide();
            console.log("Click-a-picture-to-Hide点击图片隐藏它-调试@230815")
        }) //end of .click

    var hasHided = 0;  //是否隐藏的标记，默认为0（unhided status）；
    $("body").keyup(function(event){
        //按下F2则显/隐主界面(Show the main UI)
        //alert("Key: " + event.which);
        if (event.which==113){
            if (hasHided==0){
                closeMyself();
                hasHided=1;
            }
            else {
                showUI();
                hasHided=0;
            }
            //按下F2则Show or Hide主界面(Show/Hide the main UI)
        }
    });// end of .keyup
})();

//click #hideBtn BUTTON
function hideBtnDo(){
    //select by DOM Name：img - select all images
    $("img").hide();//隐藏所有图片
}
//click #showBtn BUTTON
function showBtnDo(){
    $("img").show();//显示所有图片 //select by DOM Name：img - select all images
}
//click #closeBtn to HIDE #uiDiv
function closeMyself(){
    $("#uiDiv").hide();//关闭当前界面(hide it)//select by #ID
}
//click #closeBtn to HIDE #uiDiv
function showUI(){
    $("#uiDiv").show();//显示主界面(Show the main UI)
}