// ==UserScript==
// @name         B站视频显示av号和bv号
// @version      0.1
// @description  在B站视频下方提供av和bv号
// @author       sunfkny
// @match        *://*.bilibili.com/video/*
// @grant        none
// @namespace https://greasyfork.org/users/367486
// @downloadURL https://update.greasyfork.org/scripts/405817/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BAav%E5%8F%B7%E5%92%8Cbv%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/405817/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BAav%E5%8F%B7%E5%92%8Cbv%E5%8F%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';


    function bv2av(x) {
        let i = 0;
        let r = BigInt(0);
        for (i = 0; i < 10; i++) {
            r += BigInt(tr[x[s[i]]]) * BigInt(58) ** BigInt(i)
        }
        return (BigInt(r) - add) ^ xor
    }

    function add(){
        clearInterval(myInterval);
        console.log("显示av号和bv号 "+window.aid);
        console.log("显示av号和bv号 "+window.bvid);
        var ih;
        if (document.URL.indexOf("watchlater/#/")!=-1){
            if (document.URL.indexOf("watchlater/#/list")!=-1){
                //ih=document.querySelector("div.tm-info.tminfo");
            }else{
                ih=document.querySelector("div.tm-info.tminfo");
            }
        }else{
            ih = document.querySelectorAll('.video-data')[0];
        }

        var eleAV = document.createElement('a');
        var eleBV = document.createElement('a');
        eleAV.innerText = "av"+ window.aid;
        eleBV.innerText = window.bvid;
        eleAV.style.marginLeft="16px";
        eleBV.style.marginLeft="16px";
        eleAV.style.color = "#00a1d6";
        eleBV.style.color = "#00a1d6";
        eleAV.id="eleAV";
        eleBV.id="eleBV";
        eleAV.setAttribute("target","_blank");
        eleBV.setAttribute("target","_blank");
        eleAV.setAttribute("onMouseOver","this.style.color='#f25d8e'");
        eleBV.setAttribute("onMouseOver","this.style.color='#f25d8e'");
        eleAV.setAttribute("onMouseOut","this.style.color='#00a1d6'");
        eleBV.setAttribute("onMouseOut","this.style.color='#00a1d6'");
        eleAV.setAttribute("href","https://www.bilibili.com/video/av" + window.aid );
        eleBV.setAttribute("href","https://www.bilibili.com/video/" + window.bvid);
        var eleSpanAV=document.createElement('a');
        eleSpanAV.id="eleSpanAV"
        var eleSpanBV=document.createElement('a');
        eleSpanBV.id="eleSpanBV"

        if (document.URL.indexOf("watchlater")!=-1){
            if(Boolean(document.querySelector("#eleAV")&&document.querySelector("#eleBV"))){
                document.querySelector("#eleAV").innerText = "av"+ window.aid;
                document.querySelector("#eleBV").innerText = window.bvid;
                document.querySelector("#eleAV").setAttribute("href","https://www.bilibili.com/video/av" + window.aid );
                document.querySelector("#eleBV").setAttribute("href","https://www.bilibili.com/video/" + window.bvid);
            }else{
                ih.append(eleAV);
                ih.append(eleBV);
            }
        }else{
            ih.appendChild(eleSpanAV);
            ih.appendChild(eleSpanBV);
            eleSpanAV.appendChild(eleAV);
            eleSpanBV.appendChild(eleBV);
        }
        console.log("显示av号和bv号 add成功");
    }

    function main(){
        flag=0;
        console.log("显示av号和bv号 main运行中");
        if (window.bvid && !window.aid){
            window.aid=bv2av(window.bvid);
            console.log("显示av号和bv号 BV2AV");
        }

        if ( (window.bvid && window.aid) && Boolean(document.querySelector("div.bb-comment"))){
            clearInterval(myInterval);
            add();
        }
        if ((window.bvid==undefined)&&(window.aid ==undefined)){
            clearInterval(myInterval);
            console.error("显示av号和bv号 没有BV/AV");
        }
        if (document.URL.indexOf("/#/list")!=-1){
            clearInterval(myInterval);
            console.log("显示av号和bv号 匹配稍后再看");
            //whatchlater();
        }
        flag=1;
    }

    var flag;
    var myInterval;
    window.addEventListener("load", function() {
        console.log("显示av号和bv号 load");
        flag=1;
        myInterval = setInterval(function(){if(flag){main()}}, 1000);
    });
    window.addEventListener('popstate', function(event) {
        console.log("显示av号和bv号 popstate");
        if(Boolean(document.querySelector("#eleAV")&&document.querySelector("#eleBV"))){
            document.querySelector("#eleAV").remove();
            document.querySelector("#eleBV").remove();
        }
        flag=1;
        myInterval = setInterval(function(){if(flag){main()}}, 1000);
    });


})();
