// ==UserScript==
// @name         YiKeEscapeHelper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一刻出坑助手
// @author       foreach
// @match        https://photo.baidu.com/photo/web/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459914/YiKeEscapeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/459914/YiKeEscapeHelper.meta.js
// ==/UserScript==

function sleep(duration) { return new Promise(resolve => { setTimeout(resolve, duration); })};

function anlyseQueryParams(url){
  let params = {}
  let paramStr = url.split("?")[1];
  for(let eachParamStr of paramStr.split("&")){
     let temp=eachParamStr.split("=");
     params[temp[0]]=temp[1];
  }
  return params;
}

async function loadPicInfos(){
    window.ykdownload_temp.picLoadStatus="loading";
    window.ykdownload_temp.picList=[];
    try {
        let cursor;
        let count = 0;
        while(true){
            count++;
            let url = "/youai/file/v1/list?clienttype=70&bdstoken="+window.ykdownload_temp.bdstoken+"&need_thumbnail=1&need_filter_hidden=0" + (cursor === undefined?"":"&cursor="+cursor);
            let response = await fetch(url, {"method": "GET"});
            let json = await response.json();
            console.log("获取到第"+count+"批照片信息："+json.list.length)
            for(let picinfo of json.list){
              window.ykdownload_temp.picList.push({
                  fsid:picinfo.fsid,
                  path:picinfo.path,
                  shoot_time:picinfo.shoot_time,
                  size:picinfo.size
              })
            }
            if(json.has_more == 0){
                break;
            }
            cursor=encodeURIComponent(json.cursor);
            await sleep(2000);
        }
        window.ykdownload_temp.picLoadStatus="completed";
        console.log("获取完成，获取到"+window.ykdownload_temp.picList.length+"张照片/视频的信息，接下来，请先随便选择2张照片进行下载，以便抓取下载必要的参数，然后，你可以执行downloadALL()，生成所有照片的下载链接");
    }
    catch(error){
        window.ykdownload_temp.picLoadStatus="error";
        console.log(error)
    }
}

async function getDownloadUrl(picIds,zipname){
    let url = "/youai/file/v1/batchdownload?"+
        "clienttype=70"+
        "&bdstoken="+window.ykdownload_temp.bdstoken+
        "&fsid_list=["+picIds.join(",")+"]"+
        "&zipname="+encodeURIComponent(zipname)+".zip"+
        "&sign="+window.ykdownload_temp.sign+
        "&timestamp="+window.ykdownload_temp.timestamp;
    let response = await fetch(url, {"method": "GET"});
    let json = await response.json();
    return json.dlink;
}

function num2LongStr(num,length){
   let rst = num+"";
   while(rst.length < length){
     rst = "0"+rst;
   }
    return rst;
}

async function downloadALL(){
    if(window.ykdownload_temp.picLoadStatus === undefined){
        console.log("请先执行 loadPicInfos()")
        return;
    }
    if(window.ykdownload_temp.picLoadStatus === "loading"){
       console.log("loadPicInfos()正在执行，请稍后")
       return;
    }
    if(window.ykdownload_temp.picLoadStatus !== "completed"){
       console.log("loadPicInfos()执行状态["+window.ykdownload_temp.picLoadStatus+"]未知，请刷新页面后重试")
       return;
    }
    if(window.ykdownload_temp.sign === undefined){
        console.log("请先随便选择2张照片进行下载，以便抓取下载用的相关参数信息");
        return;
    }
    console.log("由于相册限制，最多只能同时进行5-6个下载，多出的下载请求将会一直等待，直到有部分下载完成");
    let index = -1;
    let picIds = [];
    let downloadCount = 0;
    for(let index = 0; index　< window.ykdownload_temp.picList.length; index++) {
        let picInfo = window.ykdownload_temp.picList[index];
        picIds.push(picInfo.fsid);

        if(picIds.length === 100){
            downloadCount++;
            let startIndex = index-picIds.length+2;
            let endIndex = index+1;
            let downloadUrl = await getDownloadUrl(picIds,"pictures-from-"+num2LongStr(startIndex,8)+"-to-"+num2LongStr(endIndex,8));
            console.log("第"+startIndex+"-"+endIndex+"张照片的下载链接已生成，点击下载："+downloadUrl);
            picIds = [];
            await sleep(2000);
        }
    }

    if(picIds.length > 0){
        let startIndex = window.ykdownload_temp.picList.length-picIds.length+1;
        let endIndex = window.ykdownload_temp.picList.length;
        let downloadUrl =await getDownloadUrl(picIds,"pictures-from-"+num2LongStr(startIndex,8)+"-to-"+num2LongStr(endIndex,8));
        console.log("第"+startIndex+"-"+endIndex+"张照片的下载链接已生成，点击下载："+downloadUrl);
    }
    console.log("所有下载链接已生成完成，请自行复制保存，并尽量在一天内完成下载，否则下载链接可能失效");
    console.log("下载前，请先在浏览器登录好你的一刻相册");
    console.log("由于相册限制，最多只能同时进行5-6个下载，多出的下载请求将会一直等待，直到有部分下载完成");
}


(function() {
    'use strict';

    window.ykdownload_temp={};

    let bdstoken;
    let sign;
    let timestamp;
    console.log("欢迎使用一刻出坑助手！");
    console.log("出坑助手可以辅助你完成全量照片/视频下载的工作");
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
      if (window.ykdownload_temp.bdstoken === undefined && url.startsWith("/youai/file/v1/list?clienttype")){
          console.log("检测到首次获取照片信息请求："+url);
          let params = anlyseQueryParams(url);
          window.ykdownload_temp.bdstoken = params.bdstoken;
          console.log("抓到关键参数："+window.ykdownload_temp.bdstoken);
          console.log("接下来，你可以执行loadPicInfos()，获取所有照片/视频的信息，以备下载");
      }
      if (window.ykdownload_temp.sign === undefined && url.startsWith("/youai/file/v1/batchdownload?clienttype")) {
          console.log("检测到首次批量下载请求："+url);
          let params = anlyseQueryParams(url);
          window.ykdownload_temp.bdstoken = params.bdstoken;
          window.ykdownload_temp.sign = params.sign;
          window.ykdownload_temp.timestamp = params.timestamp;
          console.log("抓到关键参数："+window.ykdownload_temp.bdstoken + " "+ window.ykdownload_temp.sign + " "+ window.ykdownload_temp.timestamp);
      }
      originOpen.apply(this, arguments);
    };

    window.loadPicInfos=loadPicInfos;
    window.downloadALL=downloadALL;
})();

