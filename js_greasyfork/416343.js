// ==UserScript==
// @name         Membean Cheat (patched)
// @version      1.0
// @description  This is the only undetectable membean userscript that I have seen.  How the other "cheats" work is they click a hidden button that the membean devs purposefully put there to catch cheaters!  This script is undetectable because it works by clearing the cookie that remembers when a question is answered incorrectly.  What this script essentially does is deletes a cookie, which is something that any user can do manually, so it would not be possible for membean to detect this in it's current state.
// @author       https://github.com/dayoshiguy
// @match        *://*.membean.com/dashboard/training-sessions/*
// @match        *://*.membean.com/dashboard/training-history*
// @match        *://*.membean.com/training_sessions/*
// @match        *://*.membean.com/dashboard
// @match        *://*.membean.com/dashboard?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://unpkg.com/draggabilly@2/dist/draggabilly.pkgd.min.js
// @namespace https://greasyfork.org/users/706584
// @downloadURL https://update.greasyfork.org/scripts/416343/Membean%20Cheat%20%28patched%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416343/Membean%20Cheat%20%28patched%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var url=window.location.href;
    var jqNewButton="html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div>ul>li:eq(4)>span";
    var jqNewWords="html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div>div:eq(4)>div>div>div:eq(0)>div>span>strong>span";
    $( document ).ready(()=>{
        // Your code here...
        if(url.indexOf("dashboard")>-1&&url.indexOf("training-sessions")<=-1&&url.indexOf("training-history")<=-1){
            let i=0;
            let I=setInterval(()=>{
                if($("html>body>div:eq(0)>div>div>main>div:eq(1)>div:eq(0)>section>div:eq(1)>ul>li:eq(0)>div:eq(1)>p>span:eq(0)").width()!=null){
                    if($("html>body>div:eq(0)>div>div>main>div:eq(1)>div:eq(0)>section>div:eq(1)>ul>li:eq("+i+")>div:eq(1)>p>span:eq(0)").width()!=null){
                        i++;
                    }
                    else{
                        clearInterval(I);
                        callBack(i);
                    }
                }
                function callBack(param){
                    for(let i=0;i<=param;i++){
                        $("html>body>div:eq(0)>div>div>main>div:eq(1)>div:eq(0)>section>div:eq(1)>ul>li:eq("+i+")>div:eq(1)>p>span:eq(0)").css("color","#6d6e71");
                        $("html>body>div:eq(0)>div>div>main>div:eq(1)>div:eq(0)>section>div:eq(1)>ul>li:eq("+i+")>div:eq(1)>p>span:eq(0)").text(randInt(79,95)+"% accuracy");
                        $("html>body>div:eq(0)>div>div>main>div:eq(1)>div:eq(0)>section>div:eq(1)>ul>li:eq("+i+")>p>button").html("");
                    }
                }
            },10);
        }
        if(url.indexOf("user_state")>-1){//if in a membean training session
            /*var a="html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(1)>div:eq(0)>ul>li:eq(0)";//jq paths of choices
            var a2="html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(1)>div>ul>li:eq(0)"
            var b="html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(1)>div:eq(0)>ul>li:eq(1)";
            var b2="html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(1)>div>ul>li:eq(1)"
            var c="html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(1)>div:eq(0)>ul>li:eq(2)";
            var c2="html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(1)>div>ul>li:eq(2)"
            var d="html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(1)>div:eq(0)>ul>li:eq(3)";
            var d2="html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(1)>div>ul>li:eq(3)"*/
            //<li class="choice wrong"
            makeButton();
            let i=setInterval(()=>{
                var timeElapsed=$("html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(3)>div>div>div:eq(0)>div").width();
                var altTimeElapsed=$("html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(3)>div>div>div:eq(0)>div").width();
                /*these are both innefficient and suck but ill keep this here bc i might want it later idk
                if($(a).attr("class").indexOf("wrong")>-1 || $(a2).attr("class").indexOf("wrong")>-1
                   || $(b).attr("class").indexOf("wrong")>-1 || $(b2).attr("class").indexOf("wrong")>-1
                   || $(c).attr("class").indexOf("wrong")>-1 || $(c2).attr("class").indexOf("wrong")>-1
                   || $(d).attr("class").indexOf("wrong")>-1 || $(d2).attr("class").indexOf("wrong")>-1){//if they got it wrong
                    location.reload();
                    clearInterval(i);
                }*/
                /*if(timeElapsed==0||altTimeElapsed==0){//checks if the timer is at zero for long enough to indicate that the answer is wrong
                    let a=setTimeout(()=>{
                        let b=setInterval(()=>{
                            timeElapsed=$("html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(3)>div>div>div:eq(0)>div").width();
                            altTimeElapsed=$("html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(3)>div>div>div:eq(0)>div").width();
                            if(timeElapsed==0||altTimeElapsed==0){
                                location.reload();
                                clearInterval(b);
                                clearInterval(i);
                            }
                        },100);
                    },750);
                }*/
                if(getCookie("answered-incorrectly")!="" && document.getElementById("toggleGodMode").innerHTML=="disable no wrong words"){
                    setCookie("answered-incorrectly","",365);
                    location.reload();
                    clearInterval(i);
                }
                if(timeElapsed!=null){
                    //alert("");
                    $("html>body>div:eq(0)>div:eq(1)>div>div:eq(1)>div:eq(3)>div>div:eq(3)>div>div>div:eq(1)>div").text(timeElapsed+"/257");
                    if(timeElapsed>200){
                        location.reload();
                        clearInterval(i);
                    }
                }else if(altTimeElapsed!=null){
                    //alert("");
                    $("html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(3)>div>div>div:eq(1)>div").text(altTimeElapsed+"/257");//for some reason it can be either one of these two
                    $("html>body>div:eq(0)>div:eq(1)>div:eq(1)>div>div:eq(3)>div>div:eq(4)>div>div>div:eq(1)>div").text(altTimeElapsed+"/257");//for the first question after reload
                    if(altTimeElapsed>200){
                        location.reload();
                        clearInterval(i);
                    }
                    //alert("");
                }
                //else{alert("aa");}
            },50);
        }
        if(url.indexOf("training-sessions")>-1){
            var interval=setInterval(()=>{
                if($(jqNewButton).length){//if exists
                    $(jqNewButton).click();
                    var newWords;
                    if($(jqNewWords).text().indexOf("new words")>-1){
                        newWords=parseInt($(jqNewWords).text().split(" new words")[0],10);//i.e. get "10" in "10 new words were introduced in this session." as int
                    }else{
                        newWords=0;
                    }
                    if(GM_getValue("subtract",false)!=true){
                        GM_setValue("total",parseInt(GM_getValue("total",0),10)+newWords);
                    }else{
                        GM_setValue("total",parseInt(GM_getValue("total",0),10)-newWords);
                    }
                    GM_setValue("newWordsThisSession",newWords);
                    GM_setValue("closed",true);
                    window.close();

                    clearInterval(interval);
                }
            },50);
        }

        function twoDigits(n){return n<10? '0'+n:''+n;}
        if(url.indexOf("training-history")>-1){
            //GM_setValue("checkedSessions","{}");
            //GM_setValue("total",0);
            var twbt = new Date();//(two weeks before today)
            var cd=new Date();//(current date)
            var urlParam="";//?startAt=2020-11-03T00:00:00-05:00&endAt=2020-11-17T11:05:22-05:00  encoded: ?startAt=2020-11-03T00%3A00%3A00-05%3A00&endAt=2020-11-17T11%3A05%3A22-05%3A00
            //twbt.setDate(twbt.getDate() - (2)); //single day only for testing purposes
            twbt.setDate(twbt.getDate() - (7*2));//two weeks before today
            urlParam="?startAt="+twbt.getFullYear()+"-"+twoDigits(twbt.getMonth()+1)+"-"+twoDigits(twbt.getDate())+"T00:00:00-05:00&endAt="+cd.getFullYear()+"-"+twoDigits(cd.getMonth()+1)+"-"+twoDigits(cd.getDate())+"T11:05:22-05:00";
            if(!(url.indexOf(urlParam)>-1)){
                window.location.href="https://membean.com/dashboard/training-history"+urlParam;
            }
            var intrval = setInterval(()=>{
                var currentHrefs={};//will store the ids on the current page
                if($("html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div:eq(1)>ul>li:eq(0)>a").length){
                    var i=0;
                    var intervaal=setInterval(()=>{
                        if($("html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div:eq(1)>ul>li:eq("+i+")>a").length){
                            if(GM_getValue("closed",true)==true){
                                var linkHref=$("html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div:eq(1)>ul>li:eq("+i+")>a").attr("href");
                                var sessionID=linkHref.split("/training-sessions/")[1];//the number after /training-sessions/
                                var checkedSessionsJSON=JSON.parse(GM_getValue("checkedSessions","{}"));
                                //currentHrefs[sessionID]=="checked";
                                //var pTotal=parseInt(GM_getValue("total",0),10);//previous total for finding how many new minutes from session

                                if(!(sessionID in checkedSessionsJSON)){//if didnt check session already - if it doesnt exist in object
                                    //checkedSessionsJSON[sessionID]="checked";//add current sessionID to JSON
                                    GM_setValue("checkedSessions",JSON.stringify(checkedSessionsJSON));//GM_setValue can not store arrays so stringify and parse are used.
                                    /////////
                                    window.open(linkHref);
                                    //var nTotal=parseInt(GM_getValue("total",0),10);//new total for finding how many new minutes from session
                                    //var NewWords=nTotal-pTotal;
                                    GM_setValue("closed",false);
                                    GM_getValue("newWordsThisSession",69420).then((result)=>{
                                        $("html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div:eq(1)>ul>li:eq("+i+")>a>div>div>div:eq(1)>div>p>span:eq(0)").html("new words: "+result);
                                        checkedSessionsJSON[sessionID]=result;
                                        updateText(parseInt(GM_getValue("total",0),10));
                                        GM_setValue("checkedSessions",JSON.stringify(checkedSessionsJSON));
                                    });


                                }else{
                                    GM_setValue("checkedSessions",JSON.stringify(checkedSessionsJSON));
                                    $("html>body>div:eq(0)>div>div>div>div>div:eq(1)>main>div>div>div:eq(1)>ul>li:eq("+i+")>a>div>div>div:eq(1)>div>p>span:eq(0)").html("new words: "+checkedSessionsJSON[sessionID]);
                                    updateText(parseInt(GM_getValue("total",0),10));
                                    GM_setValue("checkedSessions",JSON.stringify(checkedSessionsJSON));
                                }
                                i++;
                                updateText(parseInt(GM_getValue("total",0),10));
                            }
                        }
                        else{
                            /*for(var id in checkedSessionsJSON){//scuffed and doesnt work
                                //check if there are sessions that are contributing to the total word counter but are from a time before two days ago
                                if(!(currentHrefs[id]=="checked")){
                                    //subtract minutes in that session from total
                                    GM_setValue("subtract",true);
                                    window.open("https://membean.com/dashboard/training-sessions/"+id);
                                    delete checkedSessionsJSON[id];
                                    GM_setValue("checkedSessions",JSON.stringify(checkedSessionsJSON));
                                    updateText(parseInt(GM_getValue("total",0),10));
                                }
                            }
                            */
                            GM_setValue("checkedSessions",JSON.stringify(checkedSessionsJSON));
                            updateText(parseInt(GM_getValue("total",0),10));
                            clearInterval(intervaal);
                        }
                    },50);
                    clearInterval(intrval);
                }
            },1000);

        }
        function updateText(a){
            var jqTHText="html>body>div:eq(0)>div>div>div>div>div:eq(0)>div>div:eq(1)>h1";
            if($(jqTHText).text!="Training History |\n"+a+" new words in the past 2 weeks"){
                $(jqTHText).text("Training History |\n"+a+" new words in the past 2 weeks");
            }
        }
        function makeButton(){
            var button = document.createElement('button');
            button.style.top = 0;
            button.style.left = 0;
            button.style.width = 50;
            button.style.height = 50;
            button.style.position = "fixed";
            button.style.color="#FFFFFF";
            button.style.background="#FF0000";
            //if(GM_getValue("buttonOn",false)==true){
            //    button.innerHTML="enable no wrong words";
            //}else{
                button.innerHTML="disable no wrong words";
            //}
            button.id="toggleGodMode";
            button.classList.add("draggable");
            button.setAttribute("onClick", "if(getElementById(\"toggleGodMode\").innerHTML==\"enable no wrong words\"){getElementById(\"toggleGodMode\").innerHTML=\"disable no wrong words\";}else{getElementById(\"toggleGodMode\").innerHTML=\"enable no wrong words\";}");
            var $draggable = $('.draggable').draggabilly({
                // options...
            })
            document.body.appendChild(button);
            setInterval(()=>{
                if(document.getElementById("toggleGodMode").innerHTML=="enable no wrong words"||GM_getValue("buttonOn",false)!=true){
                    GM_setValue("buttonOn",true);
                }else if(document.getElementById("toggleGodMode").innerHTML=="disable no wrong words"||GM_getValue("buttonOn",false)!=false){
                    GM_setValue("buttonOn",false);
                }
            },500);

        }
        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        function rand(min,max){
            return (Math.random() * (min - max) + max).toFixed(2);
        }
        //https://www.w3schools.com/js/js_cookies.asp
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

    });
})();






