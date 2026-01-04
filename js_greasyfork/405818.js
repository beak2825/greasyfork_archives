// ==UserScript==
// @name         B站稍后再看显示av号和bv号
// @version      0.1
// @description  在稍后再看的每个视频下方提供av和bv号
// @author       sunfkny
// @match        https://www.bilibili.com/watchlater/
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/367486
// @downloadURL https://update.greasyfork.org/scripts/405818/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E6%98%BE%E7%A4%BAav%E5%8F%B7%E5%92%8Cbv%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/405818/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E6%98%BE%E7%A4%BAav%E5%8F%B7%E5%92%8Cbv%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*$.ajax({
        url:"https://api.bilibili.com/x/v2/history/toview/web",
        type : "get",
        success : function(data) {
            console.log(data);
        }
    });*/
    function ea(l){
        var eleAV = document.createElement('a');
        eleAV.innerText = "av"+ l.aid;
        eleAV.style.marginLeft="16px";
        eleAV.style.color = "#00a1d6";
        eleAV.id="eleAV";
        eleAV.setAttribute("target","_blank");
        eleAV.setAttribute("onMouseOver","this.style.color='#f25d8e'");
        eleAV.setAttribute("onMouseOut","this.style.color='#00a1d6'");
        eleAV.setAttribute("href","https://www.bilibili.com/video/av"+ l.aid);
        return eleAV;
    }
    function eb(l){
        var eleBV = document.createElement('a');
        eleBV.innerText = l.bvid;
        eleBV.style.marginLeft="16px";
        eleBV.style.color = "#00a1d6";
        eleBV.id="eleBV";
        eleBV.setAttribute("target","_blank");
        eleBV.setAttribute("onMouseOver","this.style.color='#f25d8e'");
        eleBV.setAttribute("onMouseOut","this.style.color='#00a1d6'");
        eleBV.setAttribute("href","https://www.bilibili.com/video/"+l.bvid);
        return eleBV;
    }
    function run(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.bilibili.com/x/v2/history/toview/web",
            onload: function(response) {
                if (response.status == 200){
                    var r = JSON.parse( response.responseText )
                    console.log(r.data.list);
                    var list = r.data.list;
                    var info = document.querySelectorAll("div.info.clearfix");
                    if (info.length==list.length){
                        for(let [index,item] of new Map( list.map( ( item, i ) => [ i, item ] ) )){
                            //console.log(index);
                            //console.log(item);
                            info[index].appendChild(ea(list[index]));
                            info[index].appendChild(eb(list[index]));
                        }}else{
                            console.log('document.querySelectorAll("div.info.clearfix").length='+document.querySelectorAll("div.info.clearfix").length+'\nr.data.list.length='+r.data.list.length);
                        }

                }else{
                    console.log("=========\n\nApi 错误\n\n=========");
                }

            }
        });
    }
    var myInterval;
    window.addEventListener("load", function() {
        myInterval = setInterval(function(){if(document.querySelector("div.list-box")){run();clearInterval(myInterval);}}, 1000);
    });

})();
