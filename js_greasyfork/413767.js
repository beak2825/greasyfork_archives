// ==UserScript==
// @name         Script to Stream YouTube videos
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  위즈원은 영원히 아이즈원의 비밀친구 Wiz*one是IZ*ONE永远的秘密朋友
// @author       Koon Kee
// @match        http://*/*
// @grant        none
// @include      https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/413767/Script%20to%20Stream%20YouTube%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/413767/Script%20to%20Stream%20YouTube%20videos.meta.js
// ==/UserScript==

//initiate title, link and keyword
var web = "https://www.youtube.com";
//library (the stream target at lib[0]) [title,link,keyword,streamduration]
var lib = [["IZ*ONE (아이즈원) 'Panorama' MV", "/watch?v=G8GaQdW2wHc","panorama","3:51"],
           ["IZ*ONE (아이즈원) - 환상동화 (Secret Story of the Swan) MV","/watch?v=nnVjsos40qk","secret story of the swan","3:21"],
           ["IZ*ONE (아이즈원) - \'FIESTA\' MV","/watch?v=eDEFolvLn0A","fiesta","3:37"],
           ];
//            ["[MV] 마마무 (MAMAMOO) - 딩가딩가 (Dingga)","/watch?v=dfl9KIX1WpU", "dingga","3:52"],
//            ["IZ*ONE (아이즈원) - 'Beware' MV","/watch?v=QqsvrV1_XEA","izone","4:43"],
//            ["Red Velvet - IRENE & SEULGI 'Monster' MV","/watch?v=Ujb-gvqsoi0","Red Velvet","3:01"],
//            ["IZ*ONE (아이즈원) - 비올레타 (Violeta) MV","/watch?v=6eEZ7DJMzuk","violeta","3:24"],
//            ["IZ*ONE (아이즈원) - 라비앙로즈 (La Vie en Rose) MV","/watch?v=WZwr2a_lFWY","La Vie En Rose","3:39"]
//           ];

//index
var title = 0;
var link = 1;
var keyword = 2;
var streamduration = 3;

//constant
var SongLength = 20;
var DelayMin = 30;
var DelayMax = 40;
var DelaySec;
var videolength = 0;
var querylink = "https://www.youtube.com/results?search_query=";
var adscnt = 0;
var adscntmin = 10;
var adscntmax = 30;
var maxadscnt = adscntmax; //Wait time /2
var element;
var index = 0;
var mode = "passive";
var str;
var repeat = false; //repeat the first song or go as the original
var timeoutdur = 20;
var passivetestcounter = 0;
exeScript();

function timeout(){
    window.setTimeout(function () { window.location.href = querylink + replace(lib[0][keyword]," ","+"); }, timeoutdur * 60 * 1000);
}

function replace(str,ToBeReplaced,ToReplaceWith){
    return str.replace(ToBeReplaced, ToReplaceWith);
}

function exeScript() {
    //Stream target
    console.log("Start script");
    console.log(lib[index][keyword]);
    if (document.getElementsByTagName("input")[0].value == lib[index][keyword]){
        timeout();
        try{
            element = document.querySelector("[title=\"" + lib[index][title] + "\"]");
            element.click();
            document.getElementsByTagName("input")[0].value = "";
            console.log("jump");
            window.setTimeout(function () { checklocation(); }, 500);
        }
        catch(err){
            console.log(err.message);
            window.location.href = querylink + replace(lib[0][keyword]," ","+");
        }
    }
    else{
        if (mode == "passive"){
        if (passivetestcounter < 20 * lib.length - 1){
            passivetestcounter += 1;
            if (index < lib.length - 1){
                index = index + 1;
            }
            else {
                index = 0;
            }
            window.setTimeout(function () { exeScript(); }, 200);
        }
        }
        else if (mode == "aggresive"){
            var valid = false;
            for (var i = 0; i <lib.length; i++){
                if(window.location.href == web+lib[i][link]){
                    index = i;
                    valid = true;
                    console.log("hoho");
                    window.setTimeout(function () { checklocation(); }, 2000);
                    break;
                }
            }
            if (valid != true){
                window.setTimeout(function () { window.location.href = web + lib[0][link]; }, 2000);
            }
        }
    }
}

function gotosearch(){
    console.log(lib[index][keyword]);
    maxadscnt = (index == 0)? adscntmax : adscntmin;
    try{
        document.getElementsByTagName("input")[0].value = lib[index][keyword];
    }
    catch(err){
        console.log(err.message);
    }
    try{
        var button = document.getElementsByTagName("button")[2];
        button.click();
    }
    catch(err){
        index = 0;
        console.log(err.message);
        window.location.href = querylink + replace(lib[0][keyword]," ","+");
    }
    if (document.getElementsByTagName("input")[0].value == lib[index][keyword]){
        console.log(lib[index][keyword]);
        window.setTimeout(function () {
            try{
                element = document.querySelector("[title=\"" + lib[index][title] + "\"]");
                element.click();
                document.getElementsByTagName("input")[0].value = "";
                console.log("jump");
                window.setTimeout(function () { checklocation(); }, 500);
            }
            catch(err){
                console.log(err.message);
                window.setTimeout(function () { exeScript(); }, 1000);
            }
        }, 2000);
    }
}

function checklocation(){
    if (window.location.href == (web+lib[index][link])){
        window.setTimeout(function () { loop(); }, 1000); //check if it is an ads
    }
}

function getVideoLength(){
    videolength = document.getElementsByClassName("ytp-time-duration")[0];
    videolength = videolength.textContent;
    return videolength;
}

function loop(){
    if (getVideoLength() != lib[index][streamduration] && adscnt <maxadscnt){
        window.setTimeout(function () { loop(); }, 2000);
        adscnt +=1 ;
        console.log("Ads counter: " + adscnt);
    }
    else{
        if (adscnt >= maxadscnt){
            //             var button = document.getElementsByTagName("button")[2];
            try{
                var button = document.querySelector("[class=\"ytp-ad-skip-button ytp-button\"]");
                button.click();
            }
            catch(err){
                index = 0;
                console.log(err.message);
                window.location.href = querylink + replace(lib[0][keyword]," ","+");
            }
        }
        adscnt = 0;
        getVideoLength();
        window.setTimeout(function () { jump(); }, 500);
    }
}

function jump(){
    //If Stream Target
    if (window.location.href == (web + lib[0][link])){
        console.log("Start Streaming");
        getVideoLength()
        console.log(videolength);
        index = (repeat)? 0 : 1 + Math.floor(Math.random() * (lib.length - 1));
        var arrTime = videolength.split(":");
        if(arrTime.length == 2){
            for(var i=0;i<arrTime.length;i++){
                arrTime[i] = parseInt(arrTime[i]);
                SongLength = (arrTime[0]) * 60 + arrTime[1] - 2;
            }
        }
        console.log("Stream for " + arrTime[0] +" minutes and " + arrTime[1] + " seconds");
        console.log(lib[index][keyword]);
        window.setTimeout(function () { gotosearch(); }, SongLength * 1000);
    }
    else{
        //Randomize the delay duration between half a minute and a minute
        DelaySec = DelayMin + Math.floor(Math.random() * (DelayMax - DelayMin));
        index = 0;
        getVideoLength()
        console.log(videolength);
        console.log("Playing for " + DelaySec + " seconds");
        window.setTimeout(function () { gotosearch(); }, DelaySec*1000);
    }
}