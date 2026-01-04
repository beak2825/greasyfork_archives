// ==UserScript==
// @name         CoCo中控台Waddle商城
// @namespace    https://bcmcreator.cn/
// @version      3.0
// @description  CoCo编辑器扩展控件商城，无需官方审核即可上传，快速下载其他人控件。独乐乐不如众乐乐！还有Waddle编辑内置，超宽屏幕更好的实现预览操作，即开即用！
// @match        https://coco.codemao.cn/editor/*
// @author       冷鱼闲风
// @icon         https://storage.bcmcreator.cn/Coco/coco.jpg
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457186/CoCo%E4%B8%AD%E6%8E%A7%E5%8F%B0Waddle%E5%95%86%E5%9F%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/457186/CoCo%E4%B8%AD%E6%8E%A7%E5%8F%B0Waddle%E5%95%86%E5%9F%8E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz").style= 'width: 306px;height: 36px;margin-right: 16px;margin-top: 2px;position: relative;display: flex;justify-content: flex-end';
    document.querySelector("#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div").style= 'max-height:100%;max-width:100%';
    document.querySelector("#root > div > div.coco-dialog.style_ReleaseInfoDialog__1tjfC > div.coco-dialog-scroll > div > div.coco-dialog-content").style= 'height:0px;width:0px';
    GM_xmlhttpRequest({
        method: "get",
        url: "https://api.codemao.cn/web/users/details",
        data:document.cookie,
        binary: true,
        async onload({ response }) {
            document.querySelector('#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(5) > div > span ').innerHTML="传控件/作品";
            var up=document.querySelector("#root > div > div.coco-dialog.style_ReleaseInfoDialog__1tjfC > div.coco-dialog-scroll > div > div.coco-dialog-content")
            var xup = document.createElement('iframe');
            xup.class = "myFrameup";
            xup.style='height:600px;width:600px;position: relative;border:none;';
            xup.src = 'https://storage.bcmcreator.cn/Coco/upkj.php?id='+JSON.parse(response).id+'&user='+JSON.parse(response).nickname;
            xup.scrolling = "no";
            up.parentNode.insertBefore(xup, up);
            var box=document.querySelector("#root > div > section > main > div > div.BlockEditor_wrapper__3A0d7");
            var p = document.createElement('iframe');
            p.id = "myFrame";
            p.allow="clipboard-write";
            p.style='margin-left: 0px;height:100%;width:0.1%;position: relative;border:none; z-index:6;';
            p.src = "https://waddle.coco-central.cn/?id="+JSON.parse(response).id+"&user="+JSON.parse(response).nickname;
            p.scrolling = "no";
            box.parentNode.insertBefore(p, box);
            var url='<div>CoCo中控台控件商城<a onClick="alert(\'1.选择你想要的控件，点击“导入”按钮，系统自动复制链接。\\n2..在下方“文件名”输入框里粘贴链接，点击确认即可导入。\');" style="margin-left: 10px;">（不会导入控件？）</a><a   onclick="document.querySelector(\'#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(5) > div \').click();document.querySelector(\'#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div > div.coco-dialog-title > span\').click();" style="background-color: #6e4ff4;border-color: #6e4ff4;color: #fff;cursor: pointer;-webkit-transition: all ease-in 0.3s;transition: all ease-in 0.3s;border-radius: 2px;text-transform: capitalize;font-size: 15px;padding: 0px 19px;float:right;margin-right:55px;height:60px;">上传控件</a></div>';
            document.querySelector("#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div > div.coco-dialog-title > div").innerHTML=url;
            GM_xmlhttpRequest({
                method: "get",
                url: "https://storage.bcmcreator.cn/Coco/jsdata.php?id="+JSON.parse(response).id+"&user="+JSON.parse(response).nickname,
                binary: true,
                async onload({ response }) {
                    document.querySelector("#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div > div.coco-dialog-content > div.WidgetMallDialog_cardContainer__5WIn4").innerHTML=response;
                }});
        }});
    document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz").innerHTML='<button class="style_playButton___kJLc" style="background: #f304cb; margin-right:10px; display:none;  width: 127px;">运行作品</button><button class="style_playButton___kJLc" style="background: #f304cb; margin-right:10px;   width: 127px;">Waddle</button><button class="style_playButton___kJLc" style="background: #f304cb;    width: 127px;">超宽屏幕</button>';
    var btn = document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button");
    var i =0;
    btn.onclick=function(){
        if(i%2==0){
            document.querySelector("#root > div > section > main > div > iframe").style = "margin-left: 0px;height:100%;width:100%;position: relative;border:none;z-index:6;";
            document.querySelector("#root > div > section > main > div > div.RightSideMenu_wrapper__pn2lJ").style.width='0px';
            document.querySelector("#root > div > section > main > div > div.WidgetPanel_wrapper__2VUPf").style.width='0px';
        }else{
            document.querySelector("#root > div > section > main > div > iframe").style = "margin-left: 0px;height:100%;width:0.1%;position: relative;border:none;z-index:6;";
            document.querySelector("#root > div > section > main > div > div.RightSideMenu_wrapper__pn2lJ").style.width='36px';
            document.querySelector("#root > div > section > main > div > div.WidgetPanel_wrapper__2VUPf").style.width='181px';

        }
        i+=1;
    }
    function handleEvent() {
        var f = document.getElementById('myFrame');
        f.contentWindow.postMessage('233', '*');
    }
    window.addEventListener('message', (e) => {
        if(e.data=='ImportFile')
        {
            document.querySelector("#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div.coco-dropdown.Header_fileDropdown__3MYW_ > div > div.coco-popover-content.coco-dropdown-overlay.hide > div > div > div:nth-child(6) > div").click();
            document.querySelector("#previewAreaWrapper > section > aside > div > div.WidgetList_tabNav__aT0g3 > div:nth-child(2)").click();
            document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(2)").click();
        }
    }, false);
    var btn = document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(2)");
    var i =0;
    btn.onclick=function(){
        if(i%2==0){
            document.querySelector("#root > div > section > main > div > iframe").style = "margin-left: 0px;height:100%;width:100%;position: relative;border:none;z-index:6;";
            document.querySelector("#root > div > section > main > div > div.RightSideMenu_wrapper__pn2lJ").style.width='0px';
            document.querySelector("#root > div > section > main > div > div.WidgetPanel_wrapper__2VUPf").style.width='0px';
        }else{
            document.querySelector("#root > div > section > main > div > iframe").style = "margin-left: 0px;height:100%;width:0.1%;position: relative;border:none;z-index:6;";
            document.querySelector("#root > div > section > main > div > div.RightSideMenu_wrapper__pn2lJ").style.width='36px';
            document.querySelector("#root > div > section > main > div > div.WidgetPanel_wrapper__2VUPf").style.width='181px';

        }
        i+=1;
    }
    var wk = document.querySelector("  #root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(3)");
    var j =0;
    var scrennwid='';
    wk.onclick=function(){
        if(j%2==0){
            scrennwid=document.querySelector("#previewAreaWrapper > section > div.ScreenList_wrapper__nhsQ3").style.width;
            document.querySelector("#previewAreaWrapper").style = "margin-left: 0px;width: 100%;";
            document.querySelector("#COCO_APP_ZONE").style = "width: 66vw;height: 640px";
            document.querySelector("#root > div > header > div > div.Header_center__3KSi7 > div.style_playBox__G3pSb ").style.display="none";
            document.querySelector("  #root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(1)").style.display="inline";
            document.querySelector("#previewAreaWrapper > section > div.ScreenList_wrapper__nhsQ3").style.width="66vw";
        }else{
            document.querySelector("#previewAreaWrapper").style = "margin-left: 0px;width: 640px;";
            document.querySelector("#COCO_APP_ZONE").style = "width: 360px;height: 640px;";
            document.querySelector("#root > div > header > div > div.Header_center__3KSi7 > div.style_playBox__G3pSb ").style.display="";
            document.querySelector("  #root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(1)").style.display="none";
            document.querySelector("#previewAreaWrapper > section > div.ScreenList_wrapper__nhsQ3").style.width=scrennwid;
        }
        j+=1;
    }
    var ck = document.querySelector("  #root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(1)");
    ck.onclick=function(){
        document.querySelector("#root > div > header > div > div.Header_center__3KSi7 > div.style_playBox__G3pSb > button").click();
        setTimeout(() => {
            var windowObjectReference = window.open( document.querySelector("#previewAreaWrapper > section > div.Player_wrapper__2nUp9 > div.Player_deviceFrameWrapper__2Slra > div > div > iframe").src, "CoCo作品预览", "height=700px, width=1500px, top=100, left=100, toolbar=no, menubar=no,scrollbars=no,resizable=no, location=no, status=no");
            //var loop = setInterval(() => {
            //   if (windowObjectReference.closed) {
            //        clearInterval(loop);
            //    }
            // }, 1000);
            document.querySelector("#root > div > header > div > div.Header_center__3KSi7 > div.style_playBox__G3pSb > button").click();
        }, 100);
    }
  
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_settingWrapper__AJO6Y > div.style_workInfo__7CeCV").style.width="560px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk").style.width="690px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk").style.width="690px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk > div.style_link__3VnNA").style.width="528px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk > div.style_copyBtn__Iz1FI").style.width="161px";
})();
