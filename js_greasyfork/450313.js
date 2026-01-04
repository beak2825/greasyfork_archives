// ==UserScript==
// @name         CoCo点鸭控件商城
// @namespace    https://pgaot.com/
// @version      4.9
// @description  CoCo编辑器扩展控件商城，无需官方审核即可上传，和点鸭社区控件同步。内置CoJS.E控件编辑器，快速导入商城其他用户代码或自己编写的代码，一键导入CoCo编辑器。
// @match        https://coco.codemao.cn/editor/*
// @author       冷鱼闲风
// @icon         https://shequ.pgaot.com/static/img/favicon.svg
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450313/CoCo%E7%82%B9%E9%B8%AD%E6%8E%A7%E4%BB%B6%E5%95%86%E5%9F%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/450313/CoCo%E7%82%B9%E9%B8%AD%E6%8E%A7%E4%BB%B6%E5%95%86%E5%9F%8E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var workDataCode;
    var div = document.createElement('div');
    div.id = "CODEWR";
    div.style="display: none;"
    div.innerHTML = '<div style="  border-style: dotted; right: 243px; text-align: left; margin-top: 48px;width: 270px;max-height: 430px; white-space: nowrap; text-overflow: ellipsis; overflow: auto;position: absolute;FONT-WEIGHT: 800;background: #fff;border-radius: 16px;"></div>';
    var bo = document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz");;
    bo.parentNode.insertBefore(div, bo);
    document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz").style= 'width: 306px;height: 36px;margin-right: 16px;margin-top: 2px;position: relative;display: flex;justify-content: flex-end';
    document.querySelector("#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div").style= 'max-height:100%;max-width:100%';
    document.querySelector("#root > div > div.coco-dialog.style_ReleaseInfoDialog__1tjfC > div.coco-dialog-scroll > div > div.coco-dialog-content").style= 'height:0px;width:0px';
    GM_xmlhttpRequest({
        method: "get",
        url: "https://api.codemao.cn/web/users/details",
        data:document.cookie,
        binary: true,
        async onload({ response }) {
            var userdata=JSON.parse(response);
            document.querySelector('#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(5) > div > span ').innerHTML="传控件/作品";
            var up=document.querySelector("#root > div > div.coco-dialog.style_ReleaseInfoDialog__1tjfC > div.coco-dialog-scroll > div > div.coco-dialog-content")
            var xup = document.createElement('iframe');
            xup.class = "myFrameup";
            xup.style='height:600px;width:600px;position: relative;border:none;';
            xup.src = 'https://shequ.pgaot.com/upf/upjs.php?id='+userdata.id+'&user='+userdata.nickname;
            xup.scrolling = "no";
            up.parentNode.insertBefore(xup, up);
            var box=document.querySelector("#root > div > section > main > div > div.BlockEditor_wrapper__3A0d7");
            var p = document.createElement('iframe');
            if(GetQueryString('workId')){
                p.src = "https://monaco.pgaot.com/coco?id="+userdata.id+"&user="+userdata.nickname+"&iswork="+GetQueryString('workId');
            }else{
                p.src = "https://monaco.pgaot.com/coco?id="+userdata.id+"&user="+userdata.nickname;
            }
            p.id = "myFrame";
            p.allow="clipboard-write";
            p.style='margin-left: 0px;height:100%;width:0.1%;position: relative;border:none; z-index:6;';

            p.scrolling = "no";
            box.parentNode.insertBefore(p, box);
            var url='<div>CoCo点鸭控件商城<a onClick="alert(\'1.选择你想要的控件，点击“导入”按钮，弹出文件选择界面。\\n2.程序自动为您复制好链接，直接在下方 文件名 旁输入框粘贴链接，点击 打开 即可。\\n3.导入完毕，上方会弹出成功提示框，如未成功，可能是控件bug或文件链接失效。\\n4.提示：因控件储存改动，2023年2月13日前的控件已经转移到网页版控件商城，需要请移步，谢谢。\');" style="margin-left: 10px;">（不会导入控件？）</a><a   onclick="document.querySelector(\'#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(5) > div \').click();document.querySelector(\'#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div > div.coco-dialog-title > span\').click();" style="background-color: #6e4ff4;border-color: #6e4ff4;color: #fff;cursor: pointer;-webkit-transition: all ease-in 0.3s;transition: all ease-in 0.3s;border-radius: 2px;text-transform: capitalize;font-size: 15px;padding: 0px 19px;float:right;margin-right:55px;height:60px;">上传</a><a target="_blank"  href="https://shequ.pgaot.com/?mod=cocojs" style="background-color: #6e4ff4;border-color: #6e4ff4;color: #fff;cursor: pointer;-webkit-transition: all ease-in 0.3s;transition: all ease-in 0.3s;border-radius: 2px;text-transform: capitalize;font-size: 15px;padding: 0px 19px;float:right;margin-right:20px;height:60px;">网页版商城</a></div>';
            document.querySelector("#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div > div.coco-dialog-title > div").innerHTML=url;
            GM_xmlhttpRequest({
                method: "get",
                url: "https://shequ.pgaot.com/upf/getcontrol.php?id="+userdata.id+"&user="+userdata.nickname,
                binary: true,
                async onload({ response }) {
                    document.querySelector("#_cocoDialogContainer > div.coco-dialog.WidgetMallDialog_widgetMallDialog__1URzI > div.coco-dialog-scroll > div > div.coco-dialog-content > div.WidgetMallDialog_cardContainer__5WIn4").innerHTML=response;
                }});
        }});
    document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz").innerHTML='<button class="style_playButton___kJLc" style="background: #f304cb; margin-right:10px; display:none;  width: 127px;">运行作品</button><button class="style_playButton___kJLc" style="background: #f304cb; margin-right:10px;   width: 127px;">CoJS.E</button><button class="style_playButton___kJLc" style="background: #f304cb;    width: 127px;">超宽屏幕</button>';

    setTimeout(()=>{
        document.getElementById('myFrame').style.height='0.1%';
    },2000)
    var worddata=0
    window.addEventListener('message', (e) => {
        if(e.data=='WordDataCode')
        {
            if(worddata%2==0){
                getWorkData()

            }else{
                document.getElementById('CODEWR').style.display='none'
            }
            worddata+=1
        }
        if(e.data=='ImportFile')
        {
            document.querySelector("#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div.coco-dropdown.Header_fileDropdown__3MYW_ > div > div.coco-popover-content.coco-dropdown-overlay.hide > div > div > div:nth-child(6) > div").click();
            document.querySelector("#previewAreaWrapper > section > aside > div > div.WidgetList_tabNav__aT0g3 > div:nth-child(2)").click();
            // document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(2)").click();
            document.getElementById('CODEWR').style.display='none'
            try {
                document.querySelector('#previewAreaWrapper > section > div.PreviewArea_foldBtn__29ByC.PreviewArea_show__j9QuI').click()
            } catch(err) {}
        }
    }, false);
    var btn = document.querySelector("#root > div > header > div > div.Header_right__3m7KF > div.Header_otWrapper__1Q0pY > div.style_users__1_LCz > button:nth-child(2)");
    var i =false;
    btn.onclick=function(){
        if(!i){
            try {
                document.querySelector('#previewAreaWrapper > section > div.PreviewArea_foldBtn__29ByC.PreviewArea_hide__2HaDd').click()
            } catch(err) {}
            document.querySelector("#root > div > section > main > div > iframe").style = "margin-left: 0px;height:100%;width:100%;position: relative;border:none;z-index:6;";
            i=true;
        }else{
            try {
                document.querySelector('#previewAreaWrapper > section > div.PreviewArea_foldBtn__29ByC.PreviewArea_show__j9QuI').click()
            } catch(err) {}
            document.querySelector("#root > div > section > main > div > iframe").style = "margin-left: 0px;height:0.1%;width:0.1%;position: relative;border:none;z-index:6;";
            document.getElementById('CODEWR').style.display='none'
            i=false;
        }


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
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r =window.location.search.substr(1).match(reg);
        if(r!=null) {
            return decodeURI(r[2]);
        } else {
            return null;
        }
    }
    function getWorkData(){
        if(GetQueryString('workId')){
            GM_xmlhttpRequest({
                method: "get",
                url: "https://api-creation.codemao.cn/coconut/web/work/"+GetQueryString('workId')+"/content",
                binary: true,
                data:document.cookie,
                async onload({ response }) {
                    let bcm_url=JSON.parse(response).data.bcm_url
                    GM_xmlhttpRequest({
                        method: "get",
                        url: bcm_url,
                        binary: true,
                        data:document.cookie,
                        async onload({ response }) {
                            let workDataCodeText='<ol style="list-style: auto;color: black;">';
                            let datajson=JSON.parse(response)
                            let widgetslist={}
                            let printtext=''
                            workDataCode=datajson.unsafeExtensionWidgetList;
                            if(datajson.screenIds.length){
                                for (let key in datajson.screens) {
                                    for (let widgets in datajson.screens[key].widgets) {
                                        if(!widgetslist[datajson.screens[key].widgets[widgets].type]) widgetslist[datajson.screens[key].widgets[widgets].type]=datajson.screens[key].widgets[widgets].title
                                    }
                                }
                            }
                            for (let key in datajson.globalWidgets) {
                                if(!widgetslist[datajson.globalWidgets[key].type]) widgetslist[datajson.globalWidgets[key].type]=datajson.globalWidgets[key].title
                            }
                            if(JSON.parse(response).unsafeExtensionWidgetList.length==0){workDataCodeText = '<p style="text-align: center;color: red;font-size: 20px;margin: 10px;">当前作品暂无第三方控件，<br>请先导入第三方控件后，<br>再尝试获取。</p>';}
                            for (let i = 0; i <datajson.unsafeExtensionWidgetList.length; i++) {
                                let data=bcm_url+"?codeid="+i;
                                if(widgetslist[workDataCode[i].type]){printtext=widgetslist[workDataCode[i].type]}else{printtext=workDataCode[i].type}
                                workDataCodeText+="<li onclick='document.getElementById(\"myFrame\").contentWindow.postMessage(\""+data+"\", \"*\")'>"+printtext+"</li>";
                            }
                            if(JSON.parse(response).unsafeExtensionWidgetList.length!=0) workDataCodeText+='</ol>'
                            document.getElementById('CODEWR').innerHTML = '<div style="  border-style: dotted; right: 243px; text-align: left; margin-top: 48px;width: 270px;max-height: 430px; white-space: nowrap; text-overflow: ellipsis; overflow: auto;position: absolute;FONT-WEIGHT: 800;background: #fff;border-radius: 16px;">'+workDataCodeText.replace(new RegExp('UNSAFE_EXTENSION_','g'),"")+'</div>';
                            document.getElementById('CODEWR').style.display='block'
                        }});
                }});
        }else{
            document.getElementById('CODEWR').innerHTML = '<div style="  border-style: dotted; right: 243px; text-align: left; margin-top: 48px;width: 270px;max-height: 430px; white-space: nowrap; text-overflow: ellipsis; overflow: auto;position: absolute;FONT-WEIGHT: 800;background: #fff;border-radius: 16px;"><p style="text-align: center;color: red;font-size: 20px;margin: 10px;">当前状态下作品并未保存，<br>请先保存作品后，<br>再尝试获取。</p></div>';
            document.getElementById('CODEWR').style.display='block'
        }
    }

    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_settingWrapper__AJO6Y > div.style_workInfo__7CeCV").style.width="560px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk").style.width="690px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk").style.width="690px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk > div.style_link__3VnNA").style.width="528px";
    document.querySelector("#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk > div.style_copyBtn__Iz1FI").style.width="161px";
})();

