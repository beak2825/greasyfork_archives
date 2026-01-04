// ==UserScript==
// @name         doc batch
// @namespace    http://tampermonkey.net/
// @version      2024-06-24
// @description  批量导出
// @author       bavol
// @match        https://doc.weixin.qq.com/home/recent
// @match        https://doc.weixin.qq.com/home/mydoc
// @match        http://doc.weixin.qq.com/home/recent
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource     toastrCss   https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_cookie
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498334/doc%20batch.user.js
// @updateURL https://update.greasyfork.org/scripts/498334/doc%20batch.meta.js
// ==/UserScript==
//本地vue存储的文档信息
let list_data;
//doc下载API
let doc_export_api="https://doc.weixin.qq.com/v1/export/export_office?sid="
//doc导出进度查询
let doc_export_query_api="https://doc.weixin.qq.com/v1/export/query_progress?"
var localHref = window.location.href;
var UA = navigator.userAgent;
//正在导出的作业
var exporting_operationId=[]
var docCookies = {
    getItem: function (sKey) {
      return (
        decodeURIComponent(
          document.cookie.replace(
            new RegExp(
              "(?:(?:^|.*;)\\s*" +
                encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
                "\\s*\\=\\s*([^;]*).*$)|^.*$",
            ),
            "$1",
          ),
        ) || null
      );
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires =
              vEnd === Infinity
                ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie =
        encodeURIComponent(sKey) +
        "=" +
        encodeURIComponent(sValue) +
        sExpires +
        (sDomain ? "; domain=" + sDomain : "") +
        (sPath ? "; path=" + sPath : "") +
        (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) {
        return false;
      }
      document.cookie =
        encodeURIComponent(sKey) +
        "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
        (sDomain ? "; domain=" + sDomain : "") +
        (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return new RegExp(
        "(?:^|;\\s*)" +
          encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
          "\\s*\\=",
      ).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie
        .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
        .split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    },
  };
 
//vue数据初始化
function setData(){
    list_data=document.querySelector(".fileList_item_wrapper").__vue__.$attrs.list;
    console.log("数据已更新: " + list_data.length)
}
//恢复console.log
function setConsole() {
    // var iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // document.body.appendChild(iframe);
    // var console = iframe.contentWindow.console;
    // window.console = console;
    // window.__autoClearConsoleTimer && clearInterval(window.__autoClearConsoleTimer)
    setInterval(()=>{window.__autoClearConsoleTimer && clearInterval(window.__autoClearConsoleTimer)},3000)
    // window.__resetConsole()
    // setTimeout(window.__resetConsole(),1000)
    //清除定时器
    // clearInterval(window.__autoClearConsoleTimer)
}
function JSON_to_URLEncoded(element,key,list){
    var list = list || [];
    if(typeof(element)=='object'){
      for (var idx in element)
        JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
    } else {
      list.push(key+'='+encodeURIComponent(element));
    }
    return list.join('&');
}
function AjaxCall(href,type,data,callback) {
    var encode_data="";
    if(data){
        encode_data=JSON_to_URLEncoded(data);
    }
    console.log("AjaxCall:"+href+","+type+","+encode_data+","+encode_data.length)
    GM_xmlhttpRequest({
        method: type,
        url: href,
        data: encode_data,
        headers: {
            "User-Agent": UA,
            "Origin": "https://doc.weixin.qq.com/home",
            "content-type":"application/x-www-form-urlencoded; charset=UTF-8",
            // "cookie": document.cookie,
            // "Content-Length":encode_data.length,
            // "Host":"doc.weixin.qq.com"
        },
        onload: function(data,status) {
            if(data.readyState==4 && data.status==200){
                var htmlTxt = data.responseText;
                callback(null,htmlTxt);
            };
        },
        onerror: function (error) {
            console.info("AjaxCall.onerror")
            callback(error);
        },
        ontimeout: function (error) {
            console.info("AjaxCall.ontimeout")
            callback(error);
        },
    });
};
// 下载文档
function downLoadDoc(url,data){
    return new Promise(function(reslove,reject){
        AjaxCall(url,"POST",data,(error,reponse)=>{
            if(error){
                console.log("downLoadDoc error")
                resolve([false]);
                return;
            }
            var json = JSON.parse(reponse);
            if(json.ret==0){
                console.log("downLoadDoc return :"+reponse)
                console.log(reponse)
                reslove([true,json.operationId])
            }else{
                console.warn("downLoadDoc return :"+reponse)
                console.warn(reponse)
                reslove([false])
            }
        })
    })
}
//查询进度
function queryProgress(url,itemId){
    return new Promise(function(reslove,reject){
        AjaxCall(url,"GET",null,(error,reponse)=>{
            if(error){
                console.log("queryProgress error")
                resolve([false,itemId]);
                return;
            }
            var json = JSON.parse(reponse);
            if(json.ret==0&&json.progress==100){
                console.log("queryProgress ret:"+json.ret)
                console.log(reponse)
                reslove([true,json.file_url])
            }else{
                console.warn("queryProgress ret "+json.ret)
                console.warn(reponse)
                reslove([false,itemId])
            }
        })
    })
}
// selector is optional - defaults to all elements including window and document
// Do not pass window / document objects. Instead use pseudoselectors: 'window' or 'document'
// eTypeArray is optional - defaults to clearing all event types
function removeAllEventListeners(selector = '*', eTypeArray = ['*']) {
    switch (selector.toLowerCase()) {
      case 'window':
        removeListenersFromElem(window);
        break;
      case 'document':
        removeListenersFromElem(document);
        break;
      case '*':
        removeListenersFromElem(window);
        removeListenersFromElem(document);
      default:
        document.querySelectorAll(selector).forEach(removeListenersFromElem);
    }
    
    function removeListenersFromElem(elem) {
      let eListeners = getEventListeners(elem);
      let eTypes = Object.keys(eListeners);
      for (let eType of inBoth(eTypes, eTypeArray)) {
        eListeners[eType].forEach((eListener)=>{
          let options = {};
          inBoth(Object.keys(eListener), ['capture', 'once', 'passive', 'signal'])
            .forEach((key)=>{ options[key] = eListener[key] });
          elem.removeEventListener(eType, eListener.listener, eListener.useCapture);
          elem.removeEventListener(eType, eListener.listener, options);
        });
      }
    }
  
    function inBoth(arrA, arrB) {
      setB = new Set(arrB);
      if (setB.has('*')) {
        return arrA;
      } else {
        return arrA.filter(a => setB.has(a));
      }
    }
  }
//阻止冒泡，去除框外取消勾选 todo
function cancelBubble(){
    document.querySelector("body").addEventListener("click",(e)=>{e.stopPropagation();})
    document.querySelector("body").addEventListener("mousedown",(e)=>{e.stopPropagation();})
    var home_topfile=document.querySelector(".home_topfile");
    // removeAllEventListeners(".home_topfile")
    // home_topfile.replaceWith(home_topfile.cloneNode(true))
    // getEventListeners(document.querySelector(".home_topfile"))
    var placeToReplace;
    if (window.EventTarget && EventTarget.prototype.addEventListener) {
      placeToReplace = EventTarget;
    } else {
      placeToReplace = Element;
    }
 
    placeToReplace.prototype.oldaddEventListener = placeToReplace.prototype.addEventListener;
    placeToReplace.prototype.addEventListener = function(event, handler, placeholder) {
    //   console.log("calling substitute");
      if (arguments.length < 3) {
        this.oldaddEventListener(event, handler, false);
      } else {
        this.oldaddEventListener(event, handler, placeholder);
      }
    }
    document.querySelector(".home_topfile").addEventListener("mousedown", function() {
      console.log("foo");
    });
 
 
}
//onLoad
function pageOnload(){
    // setData
    setData();
    // setConsole
    setConsole();
    console.log("localHref: " + localHref);
    // cancelBubble();
    //recent页面显示在tab-container
    // if(localHref.includes("home")){
    //     //批量导出按钮
    //     document.querySelector(".tab-container").insertAdjacentHTML('afterbegin','<button id="batchExport" type="button" class="xd_btn fileToolbar_button xd_btn_Blue xd_btn_Supper" style="width: auto; ">批量导出</button>')
    //     //全选按钮
    //     document.querySelector(".tab-container").insertAdjacentHTML('afterbegin','<button id="selectAllItem" type="button" class="xd_btn fileToolbar_button xd_btn_Supper" style="width: auto;color: white;background: seagreen;display:inline">全选</button>')
    // }else{
    //     document.querySelector(".xd-web-header_toolbar").insertAdjacentHTML('beforeend','<button id="selectAllItem" type="button" class="xd_btn fileToolbar_button xd_btn_Supper" style="width: auto;color: white;background: seagreen;display:inline">全选</button>')
    //     document.querySelector(".xd-web-header_toolbar").insertAdjacentHTML('beforeend','<button id="batchExport" type="button" class="xd_btn fileToolbar_button xd_btn_Blue xd_btn_Supper" style="width: auto; ">批量导出</button>')
    // }

    if(localHref.includes("home")){
        //批量导出按钮
        // document.querySelector(".tab-container").insertAdjacentHTML('afterbegin','<button id="batchExport" type="button" class="xd_btn fileToolbar_button xd_btn_Blue xd_btn_Supper" style="width: auto; ">批量导出</button>')
        //全选按钮
        // document.querySelector(".tab-container").insertAdjacentHTML('afterbegin','<button id="selectAllItem" type="button" class="xd_btn fileToolbar_button xd_btn_Supper" style="width: auto;color: white;background: seagreen;display:inline">全选</button>')
        document.querySelector(".xd-web-header_toolbar").insertAdjacentHTML('afterbegin','<button id="selectAllItem" type="button" class="xd_btn fileToolbar_button xd_btn_Supper" style="width: 80px;color: white;background: seagreen;display:inline">全选</button>')
        document.querySelector(".xd-web-header_toolbar").insertAdjacentHTML('afterbegin','<button id="batchExport" type="button" class="xd_btn fileToolbar_button xd_btn_Blue xd_btn_Supper" style="width: 120px; ">批量导出</button>')
    }else{
    }
    // document.querySelectorAll(".xd_checkbox").forEach(item=>{
    //     console.log("debug for fileList_item_checkbox")
    //     parentDiv=item.parentNode.parentNode;
    //     item.addEventListener("click",(e)=>{
    //         if(parentDiv.getAttribute("class").indexOf("fileList_item_Active")==-1){
    //             //勾选
    //             console.log("click select")
    //             parentDiv.classList.add("fileList_item_Active");  
    //             item.firstChild.classList.replace("xd_common_unselect-normal","xd_common_select-normal");
    //         }
    //         else{
    //             //取消勾选
    //             console.log("rever select")
    //             parentDiv.classList.remove("fileList_item_Active");  
    //             item.firstChild.classList.replace("xd_common_select-normal","xd_common_unselect-normal");
    //         }
    //     })
    // });
    document.querySelectorAll(".fileList_item_checkbox").forEach(item=>{item.style.display="flex";});
    //点击批量导出
    document.querySelector("#batchExport").addEventListener("click",(e)=>{
        console.log("batchExport")
        if(list_data.length<=0){
            console.warn("data is null")
            return
        }
        var docList=document.querySelectorAll(".fileList_item_wrapper");
        console.log("batch file length: " + docList.length)
        for(var i=0;i<docList.length;i++){
            var docItem=docList[i];
            console.log("i:"+i+","+docItem.firstChild.className+","+list_data[i].doc_id)
            //选中
            if(docItem.firstChild.className.includes("fileList_item_Active")){
                // if(i>0){
                //     return;
                // }
                // 执行导出作业
                var url=doc_export_api+docCookies.getItem("wedoc_sid")
                console.log("docItem.doc_id:"+list_data[i].doc_id)
                downLoadDoc(url,{"docId":list_data[i].doc_id})
                    .then((resp)=>{
                        console.log("downLoadDoc then:"+resp)
                        if(resp[0]){
                            //加入到待查询列表中
                            exporting_operationId.push(resp[1])
                            //清除选中状态，默认会清除
                            // docItem.firstChild.className.remove("fileList_item_Active")
 
                        }
                })
            }
        }
    })
    //点击全选
    document.querySelector("#selectAllItem").addEventListener("click",()=>{
        //全选
        if(document.querySelector(".fileList_item_wrapper > div:first-child").getAttribute("class").indexOf("fileList_item_Active")==-1){
            console.log("click selectAll")
            document.querySelectorAll(".fileList_item_wrapper > div:first-child").forEach(item=>item.classList.add("fileList_item_Active"));  
            document.querySelectorAll(".xd_checkbox > i").forEach(item=>item.classList.replace("xd_common_unselect-normal","xd_common_select-normal"));
        }else{
            //取消全选
            console.log("rever selectAll")
            document.querySelectorAll(".fileList_item_wrapper > div:first-child").forEach(item=>item.classList.remove("fileList_item_Active"));  
            document.querySelectorAll(".xd_checkbox > i").forEach(item=>item.classList.replace("xd_common_select-normal","xd_common_unselect-normal"));
        }
    })
    console.log("pageOnload end")
}
let await_flag=false;
(function() {
    'use strict';

    localHref = window.location.href; // 存储当前页面的URL
    await_flag = false;

    // 每1秒检查URL变化的定时器
    setInterval(function() {
        if (window.location.href !== localHref) {
            console.log("检测到URL变化: " + window.location.href);
            localHref = window.location.href; // 更新localHref为当前的URL
            setData(); // 如果URL变化，重新加载数据
        }
    }, 1000); // 检查频率为1秒

    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            setTimeout(()=>pageOnload(),1000)
        }
    };
    //window.addEventListener("load", (event)=>pageOnload(event));
    var wedoc_skey=docCookies.getItem("wedoc_skey");
    var wedoc_ticket=docCookies.getItem("wedoc_ticket");
 
    setInterval(async()=>{
        if(await_flag){
            console.log("busy")
            return;
        }
        await_flag=true;
        var time_stmap=new Date().getTime();
        // console.log(time_stmap+","+exporting_operationId.length)
        var new_exporting_operationId=[];
        for(var i=0 ;i<exporting_operationId.length;i++){
            var item=exporting_operationId[i];
            var url=doc_export_query_api+"operationId="+item+"&timestamp="+new Date().getTime()
             await queryProgress(url,item)
                .then((resp)=>{
                    console.log("downLoadDoc retuen:"+resp)
                    if(resp[0]){
                        //下载
                        window.open(resp[1])
                    }else{
                        new_exporting_operationId.push(resp[1])
                    }
                })
            
        }
        exporting_operationId=new_exporting_operationId;
        await_flag=false;
    },3000)
    
    // alert("wedoc_skey:"+wedoc_skey+"\n"+"wedoc_ticket"+wedoc_ticket);
})();
 