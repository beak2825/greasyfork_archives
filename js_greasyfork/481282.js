// ==UserScript==
// @name         Tuxun Toolkit
// @name:zh-CN   图寻工具箱
// @namespace    tool-xun
// @version      0.2.2
// @description        Powerful toolkit for tuxun.com
// @description:zh-CN  让图寻更加好用
// @author       JasonYing
// @copyright    2023, JasonYing (https://github.com/strombooli)
// @license      GPL-2.0
// @match        https://map.google.com/
// @match        https://www.google.com/maps/*
// @match        https://tuxun.fun/maps_modify?*
// @run-at       document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @connect      restapi.amap.com
// @downloadURL https://update.greasyfork.org/scripts/481282/Tuxun%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/481282/Tuxun%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(GM_getValue("cnt") === undefined){GM_setValue("cnt",0);}
    if(GM_getValue("list") === undefined){GM_setValue("list","");}
    GM_addValueChangeListener("list", function(key, oldValue, newValue, remote) {
        console.log("The value of the '" + key + "' key has changed from '" + oldValue + "' to '" + newValue + "'");
        GM_setValue("cnt",newValue.split(";").length-1);
        if(document.getElementById("tt-addto"))document.getElementById("tt-addto").innerText="加入备选清单("+GM_getValue("cnt")+")";
        if(document.getElementById("tt-copy"))document.getElementById("tt-copy").innerText="复制备选清单("+GM_getValue("cnt")+")";
    });

    if(window.location.host=="www.google.com"){
        function isStreet(str){ // 是否为街景
            if(str.indexOf("data")!=-1){return true;}
            return false;
        }
        function extrlongla(str){ // 提取经纬度
            if(!isStreet(str)){return;}
            let t = window.location.href.split("@")[1].split(",");
            return t[1]+","+t[0];
        }
        function showprov(str){
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://restapi.amap.com/v3/geocode/regeo?key=968b77318a6fdd31a0541632d794a61e&location="+str,
                headers: {"Content-Type": "application/json"},
                onload: function(response) {
                    alert(JSON.parse(response.responseText).regeocode.addressComponent.province)
                }
            });
        }
        let oDiv = document.createElement("div");
        oDiv.style.cssText="position:absolute;left:80%;top:70%;z-index:9999;background:white;border-radius:5px;border:black 2px dashed;";
        let oBtn = document.createElement("button");
        oBtn.id="tt-addto";
        oBtn.innerText="加入备选清单("+GM_getValue("cnt")+")";
        oBtn.style.cssText="margin:10px;font-weight:800";
        let oBtn2 = document.createElement("button");
        oBtn2.id="tt-prov";
        oBtn2.innerText="检查所属省份";
        oBtn2.style.cssText="margin:10px;font-weight:800";
        oDiv.appendChild(oBtn);
        oDiv.appendChild(document.createElement("br"));
        oDiv.appendChild(oBtn2);
        document.body.append(oDiv);
        oBtn.addEventListener("click", function(){
            let url = window.location.href;
            if(!isStreet(url)){return;}
            if(GM_getValue("list").indexOf(url)!=-1){return;}
            GM_setValue("list",GM_getValue("list")+url+";");
        })
        oBtn2.addEventListener("click", function(){
            let url = window.location.href;
            showprov(extrlongla(url));
        })
    }
    if(window.location.host=="tuxun.fun"){
        let oBtn = document.createElement("button");
        let oBtn2 = document.createElement("button");
        oBtn.id="tt-copy";
        oBtn.innerText="复制备选清单("+GM_getValue("cnt")+")";
        oBtn2.innerText="清空备选清单";
        oBtn.className = "el-button el-button--default el-button--small";
        oBtn2.className = "el-button el-button--default el-button--small";
        let oPad = document.createElement("div");
        oPad.style.cssText="padding-bottom:0.5rem;";
        let ist = setInterval(function(){
            if(document.getElementsByClassName("el-button--small")[8]){
                document.getElementsByClassName("el-button--small")[8].insertAdjacentElement('afterend',oPad);
                oPad.insertAdjacentElement('afterend',oBtn);
                oBtn.insertAdjacentElement('afterend',oBtn2);
                clearInterval(ist);
                //console.log("[TTK]inserted");
            }
            else{
                //console.log("[TTK]insert fail");
            }
        },50)
        oBtn.addEventListener("click", function(){
            GM_setClipboard(GM_getValue("list").replaceAll(";","\n"), "text");
        })
        oBtn2.addEventListener("click", function(){
            GM_setValue("list","");
        })
    }
})();
