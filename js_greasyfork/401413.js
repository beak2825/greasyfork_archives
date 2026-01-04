// ==UserScript==
// @name         Steam愿望单工具
// @namespace    sourcewater
// @version      0.1.11
// @description  批量导入和导出愿望单
// @author       sourcewater
// @match        https://store.steampowered.com/wishlist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401413/Steam%E6%84%BF%E6%9C%9B%E5%8D%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/401413/Steam%E6%84%BF%E6%9C%9B%E5%8D%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function importWL(){
        console.log("导入愿望单");
        let file=file_chooser.files[0];
        let freader=new FileReader();
        freader.readAsText(file);
        freader.onload=function(){
            let appidlist;
            appidlist=freader.result.split(",");
            if(appidlist.length==0) return;
            let wl=[];
            function loadWL(){
                if(g_rgWishlistData){
                    for(let i=0;i<g_rgWishlistData.length;++i){
                        wl.push(g_rgWishlistData[i].appid);
                    }
                }else{
                    console.log("wait for the wishlist data...");
                    setTimeout(loadWL,100);
                }
            }
            loadWL();
            let temp=[];
            for(let i=0;i<appidlist.length;++i){
                let index=wl.indexOf(parseInt(appidlist[i]));
                if(index<0){
                    temp.push(appidlist[i]);
                }
            }
            if(temp.length>0){
                appidlist=temp;
                let i=0;
                let failed=0;
                let failedList=[];
                let bdialog;
                function addWL(){
                    if(i==appidlist.length){
                        if(failed>0){
                            if(bdialog) bdialog.Dismiss();
                            appidlist=failedList;
                            i=0;
                            failed=0;
                            failedList=[];
                            exportFailedWL(appidlist);
                            ShowConfirmDialog("提示！", '是否重试添加愿望单失败的游戏？数量：'+appidlist.length+'<br><br>可能的失败原因：<br>1、切换过钱包区域（或者切换账单地址），游戏锁区了？<br>2、在导入愿望单之前购买了愿望单内的游戏？<br>3、游戏下架了？').done(function(){setTimeout(addWL,500);});
                        }else{
                            console.log("success");
                            if(i!=0) bdialog.Dismiss();
                            ShowAlertDialog("成功","已经全部添加至愿望单");
                            file_chooser.value="";
                            return;
                        }
                    }else{
                        let appid=appidlist[i];
                        let url = 'https://store.steampowered.com/api/addtowishlist';
                        $J.post( url, {sessionid: g_sessionID, appid: appid} )
                            .done( function( data ) {
                            if ( data && data.success ) {
                                ++i;
                            }else {
                                ++failed;
                                ++i;
                                failedList.push(appid);
                            }
                            if(bdialog) bdialog.Dismiss();
                            bdialog=ShowBlockingWaitDialog('正在添加...',i+'/'+appidlist.length+'&nbsp;&nbsp;&nbsp;&nbsp;失败：'+failed);
                            setTimeout(addWL,500);
                        }).fail( function() {
                            ++failed;
                            ++i;
                            failedList.push(appid);
                            if(bdialog) bdialog.Dismiss();
                            bdialog=ShowBlockingWaitDialog('正在添加...',i+'/'+appidlist.length+'&nbsp;&nbsp;&nbsp;&nbsp;失败：'+failed);
                            setTimeout(addWL,500);
                        });
                    }
                }
                addWL();
            }else{
                ShowAlertDialog("提示","当前需要导入的已经存在于现有的愿望单中！");
                file_chooser.value="";
            }
        }
    }

    function saveTxt(filename,data){
        let winObj=window.URL || window.webkitURL || window;
        let blob = new Blob([data],{type:'text/html'});
        let url=document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        url.href=winObj.createObjectURL(blob);
        url.download = filename;
        let ev = new MouseEvent ("click");
        url.dispatchEvent(ev);
    }

    function exportWL(){
        let wl=[];
        for(let i=0;i<g_rgWishlistData.length;++i){
            wl.push(g_rgWishlistData[i].appid);
        }
        let wln=wl.length;
        saveTxt("wishlist_total_"+wln+".txt",wl);
    }

    function exportFailedWL(appidlist){
        let failedwl="";
        for(let i=0;i<appidlist.length;++i){
            failedwl+="https://store.steampowered.com/app/"+appidlist[i]+"\n";
        }
        failedwl+="\n===============================steam db===============================\n\n";
        for(let i=0;i<appidlist.length;++i){
            failedwl+="https://steamdb.info/app/"+appidlist[i]+"\n";
        }
        saveTxt("failed_wishlist_total_"+appidlist.length+".txt",failedwl);
    }

    function emptyWL(){
        console.log("清空愿望单");
        exportWL();
        let wl=[];
        for(let i=0;i<g_rgWishlistData.length;++i){
            wl.push(g_rgWishlistData[i].appid);
        }
        let i=0;
        let fi=0;
        let bdialog;
        function removeWL(){
            if(i==(wl.length-1)){
                if(i!=0) bdialog.Dismiss();
                if(fi==0){
                    ShowAlertDialog("成功","已经清空了所有愿望单！");
                }else{
                    ShowAlertDialog("成功","已经成功从愿望单移除了"+(i-fi)+"个，还有"+fi+"个失败了！");
                }
                return;
            }
            let appId=wl[i];
            jQuery.ajax({ type: "POST",url: g_strWishlistBaseURL + 'remove/',data: {'appid':appId, sessionid: g_sessionID},success:function(html){
                if(bdialog) bdialog.Dismiss();
                bdialog=ShowBlockingWaitDialog('正在移除...',(i+1-fi)+'/'+wl.length+'&nbsp;&nbsp;&nbsp;&nbsp;失败：'+fi);
                ++i;
                setTimeout(removeWL,500);
            }}).fail(function(html){
                ++fi;
                if(bdialog) bdialog.Dismiss();
                bdialog=ShowBlockingWaitDialog('正在移除...',(i+1-fi)+'/'+wl.length+'&nbsp;&nbsp;&nbsp;&nbsp;失败：'+fi);
                ++i;
                setTimeout(removeWL,500);
            }).always(function(){
                //
            });
        }
        ShowConfirmDialog("警告！", "你确定要清空愿望单？").done(function(){removeWL();});
    }

    let wl_header=document.getElementsByClassName("wishlist_header")[0];
    let wl_tools=document.createElement("span");
    wl_tools.style="margin-left:100px;";
    let export_btn=document.createElement("span");
    let import_btn=document.createElement("span");
    let empty_btn=document.createElement("span");
    export_btn.addEventListener("click",function(){exportWL()});
    empty_btn.addEventListener("click",function(){emptyWL()});
    export_btn.className="pulldown btnv6_blue_hoverfade btn_small";
    import_btn.className="pulldown btnv6_blue_hoverfade btn_small";
    empty_btn.className="btn_small s_s_s_empty_btn";
    export_btn.innerHTML="<span>导出愿望单</span>";
    import_btn.innerHTML="<span>导入愿望单</span>";
    empty_btn.innerHTML="<span>清空愿望单</span>";
    import_btn.style="position: relative;overflow: hidden;vertical-align:top;";
    let file_chooser=document.createElement("input");
    file_chooser.type="file";
    file_chooser.style="position: absolute;right: 0;top: 0;opacity: 0;display: inline-block;cursor:pointer;width:100%;height:100%;";
    file_chooser.addEventListener("change",function(){importWL()});
    import_btn.appendChild(file_chooser);
    wl_tools.appendChild(export_btn);
    wl_tools.appendChild(import_btn);
    wl_tools.appendChild(empty_btn);
    wl_header.appendChild(wl_tools);
    let empty_btn_style=document.createElement("style");
    empty_btn_style.innerHTML=`
.s_s_s_empty_btn{
border-radius: 2px;
border: none;
padding: 1px;
display: inline-block;
cursor: pointer;
text-decoration: none !important;
float: right;
vertical-align: middle;
margin: 0px;
background-color:#9b1414;
color:#ffffff;
}
.s_s_s_empty_btn:hover{
color:#000000;
background-color:#ee5555;
}
`;
    document.head.appendChild(empty_btn_style);
})();