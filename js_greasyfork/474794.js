// ==UserScript==
// @name        cddyjy.com
// @namespace   Violentmonkey Scripts
// @include       *://new.cddyjy.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.2
// @author      -
// @description 2023/8/23 上午10:17:37
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/474794/cddyjycom.user.js
// @updateURL https://update.greasyfork.org/scripts/474794/cddyjycom.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("location.hostname:",location.hostname);
    console.log("location.href:",location.href);
    var myDate = new Date();
    var dt=myDate.toLocaleDateString();
/**    if(GM_getValue("dt","1")!=dt){
        GM_setValue("limit", 0);
        GM_setValue("dt", dt);
    }

    if(GM_getValue("limit", 0)==1 && GM_getValue("dt", "1")==dt){
        document.title="已到达今日上限";
    }
**/
     var a=setTimeout(function() {
       if(location.href.indexOf("new.cddyjy.com/member-space/home")!=-1){
       //document.write("<p>aaaaaaaaaaaaaaaa</p>");
         var c=document.getElementsByClassName("layout-footer-center ivu-layout-footer")[0];
         c.outerHTML="<div class='layout-footer-center ivu-layout-footer'>©版权所有：中共成都市委组织部主办，成都开放大学承办 <a href='javascript:readdoc=1;readvod=0;location.href=\"https://new.cddyjy.com/member-education/net-school/classroom/tj\";'>1</a> <a href='javascript:readvod=1;readdoc=0;location.href=\"https://new.cddyjy.com/member-education/net-school/classroom/tj\";'>2</a></div>";
       console.log("bbbbbbbbbbbbb: "+c);
     }
     },5000);


    if(location.href.indexOf("xxpt.scxfks.com/study/course/")!=-1 && location.href.indexOf("chapter")==-1 && GM_getValue("limit", 0)==0){
        const more_element = document.querySelectorAll("div");
        // var i=GM_getValue("n",20);
        var i=20;
        var run1=setInterval(() => {
            console.log(i-19);
            console.log(more_element[i].innerHTML);
            if(more_element[i].innerHTML.indexOf("&nbsp; &nbsp;")!=-1){
                console.log("点击未学");
                // GM_setValue("n",i+2);
                clearInterval(run1);
                more_element[i].click();

            }
            i=i+2;
        }, 10);
    }

    if(location.href.indexOf("https://new.cddyjy.com/member-education/net-school/classroom/tj")!=-1){
      var run5=setInterval(() => { clearInterval(run5);
        const more_element = document.querySelector("#lhyj-content > div.ivu-layout-content > div > div:nth-child(3) > div > div.filter-wrap > div:nth-child(1) > div.options > span:nth-child(4)");
            more_element.click();
                                 },5000);
      var run3=setInterval(() => { clearInterval(run3);
            const cards=document.getElementsByClassName("news-info");
            console.log(cards);
            var cardnum=cards.length;
                                  var j=0;
              console.log("----");

                var title1=GM_getValue("PAGES");
              for(var i=0;i<cardnum;i++){
              if(cards[i].innerHTML.indexOf("已学完")==-1 && cards[i].innerHTML.indexOf("data-v-")!=-1 && cards[i].innerHTML.indexOf(title1)==-1){
                console.log(cards[i]);
                var title2=cards[i].childNodes[0].childNodes[0].innerHTML;
                console.log(title2);
                if(title1.indexOf(title2)==-1){
                console.log(cards[i]);
                cards[i].click();
                window.close();
                break;}else{j++;}
                }else{
                j++;
              }
              }
                                  console.log(j);
                                  console.log(cardnum);
              if(j==cardnum){
                const page1=document.getElementsByClassName("ivu-page-next")[0];
                console.log(page1);
                page1.click();
                j=0;
                setInterval(run3,10000);
                }


            },10000);

    }




    if(location.href.indexOf("new.cddyjy.com/member-education/net-school/classroom/fileInfo?id=")!=-1){
      var nowt = new Date();
      console.log("----");
      console.log(nowt.toLocaleTimeString());
      var st=nowt.getTime();
      var run4=setInterval(() => {
                                  nowt = new Date();
                                  console.log(((nowt.getTime()-st)/190000)*100+"%");
                                 },10000);
        var run6=setInterval(() => { clearInterval(run6);
                                    const backbtn=document.querySelector("#lhyj-content > div.bread-crumb > div > span:nth-child(1) > i");
                                    var title1=document.querySelector("#wrap-box > div > p").innerHTML.replace("\n","").replace(" ","");
                                    title1=title1.substring(0,title1.indexOf("<")).trim();
                                    var pages=GM_getValue("PAGES");
                                    GM_setValue("PAGES",pages+title1);
                                    console.log(title1);
                                    var run31 =setInterval(() => { clearInterval(run31);
                                        nowt = new Date();
                                        console.log(nowt.toLocaleTimeString());
                                        console.log("返回");
                                        // 跳转上一页
                                        location.href = "https://new.cddyjy.com/member-education/net-school/classroom/tj";
                                    },1000);
                                   },190000);

    }



})();
