// ==UserScript==
// @name        scxfks.com
// @namespace   Violentmonkey Scripts
// @match        http://xxpt.scxfks.com/*
// @match        https://xxpt.scxfks.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.07
// @author      -
// @description 2024/10/16 上午9:17:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451740/scxfkscom.user.js
// @updateURL https://update.greasyfork.org/scripts/451740/scxfkscom.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("location.hostname:",location.hostname)
    console.log("location.href:",location.href)
    var myDate = new Date();
    var dt=myDate.toLocaleDateString();
    if(GM_getValue("dt","1")!=dt){
        GM_setValue("limit", 0);
        GM_setValue("dt", dt);
    }
    if(GM_getValue("limit", 0)==1 && GM_getValue("dt", "1")==dt){
        document.title="已到达今日上限";
    }

    if(location.href.indexOf("xxpt.scxfks.com/study/course/")!=-1 && location.href.indexOf("chapter")==-1 && GM_getValue("limit", 0)==0){
        const more_element = document.querySelectorAll("table > tbody > tr > td.title > div:nth-child(2)")
        // var i=GM_getValue("n",20);
        var k=0;
        for(var i=0;i<more_element.length;i++){
            if(more_element[i].innerHTML.indexOf("获得")==-1){
                k++;
                console.log(more_element[i]);
                console.log("点击未学");
                // GM_setValue("n",i+2);
                more_element[i].click();
            }
        }
        if(k==0){
             location.href="http://xxpt.scxfks.com/study/courses/all";
            }
    }

    if(location.href.indexOf("xxpt.scxfks.com/study/courses/all")!=-1 && GM_getValue("limit", 0)==0){
        const more_element = document.querySelectorAll("a")
        // var i=GM_getValue("n",20);
        console.log("QQQQ"+more_element);
        var run11=setInterval(() => {
            console.log("aaaa"+more_element);
            more_element.forEach(function(m_element){
                console.log("bbbb"+m_element);
                if(m_element.innerHTML.indexOf("继续学习")!=-1 || m_element.innerHTML.indexOf("开始学习")!=-1){
                    console.log("点击未学");
                    // GM_setValue("n",i+2);
                    clearInterval(run11);
                    m_element.click();
                    return false();
            }
            });
        }, 10);
    }


    if(location.href.indexOf("http://xxpt.scxfks.com/study/courses/require")!=-1){
        const more_element = document.querySelector("body > section > div > div.contblock > div:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a")
        run1=setInterval(() => {
            console.log(more_element);
            console.log("进入课程");
            clearInterval(run1);
            more_element.click();


        }, 10);
    }




    if(location.href=="http://xxpt.scxfks.com/study/login"){
        GM_setValue("limit", 0);
        var run3=setInterval(() => {
            const limit=document.getElementById("know")
            if(limit!=null){
                console.log("input.know")
                limit.click();
                clearInterval(run3);}
        },100)
        }
    if(location.href=="http://xxpt.scxfks.com/study/index"){

        var j=1;
        var run4=setInterval(() => {

          var ndkcnum=0;
          console.log("aaaaaaaaaa   j="+j);
          const alineboxs=document.querySelectorAll("#linebox > div.linebar");
          var i=1;
          var run41=setInterval(() => {

            if(i<alineboxs.length){
            if(alineboxs[i].innerHTML.indexOf("100%")==-1){
              clearInterval(run41);
              const alinebox=document.querySelectorAll("#indexkejian > a");
              console.log("alinebox:"+alinebox.length);
              console.log("alinebox["+i+"]:"+alinebox[i]);
              alinebox[i].click();
            };
            i++;}
            else{
              clearInterval(run41);
            }

          },300);

          const ndkc=document.querySelectorAll("#c > div.film_focus_desc > ul > li");
          console.log("ndkc："+ndkc.length);
              if(ndkcnum<ndkc.length){
                ndkc[j].click();
                j++;
              }
         /*--
            const limit=document.querySelector("#indexkejian > a")
            if(limit!=null){
                console.log(limit.innerHTML)
                limit.click();
                clearInterval(run4);
                }
        --*/

        },2000)
        }




    if(location.href.indexOf("xxpt.scxfks.com/study/course/")!=-1 && location.href.indexOf("chapter")!=-1){
        const limit=document.querySelector("div.limit")
        if(limit!=null){
            if(limit.innerHTML.indexOf("已到达今日上限")!=-1){
                console.log("已到达今日上限")
                GM_setValue("limit", 1);
                GM_setValue("dt", dt);
                //GM_setValue("n", 20);
            }
        }
        var run2=setInterval(() => {
            if(GM_getValue("limit", 0)==0){
                const button1 = document.querySelector("button")
                console.log("学完返回")
                button1.click();
            }else{
                const button1 = document.querySelector("button")
                button1.click();
                console.log("已到达今日上限");
                document.title="已到达今日上限";
            }
        }, 10000+Math.random()*5000);
    }
})()
