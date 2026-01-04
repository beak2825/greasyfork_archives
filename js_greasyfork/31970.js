// ==UserScript==
// @name         osu!-download-beatmap-from-bloodcat
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description   Download osu beatmap from bloodcat(support new design page)
// @author       jacky2001114(blow)
// @match        *://bloodcat.com/osu/?q=*&c=b&s=&m=*
// @match        *://osu.ppy.sh/b/*
// @match        *://osu.ppy.sh/s/*
// @match        *://osu.ppy.sh/p/beatmap?b=*
// @match        *://osu.ppy.sh/p/beatmap?s=*
// @match        *://bloodcat.com/osu/*
// @match        *://osu.ppy.sh/beatmapsets/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/31970/osu%21-download-beatmap-from-bloodcat.user.js
// @updateURL https://update.greasyfork.org/scripts/31970/osu%21-download-beatmap-from-bloodcat.meta.js
// ==/UserScript==

(function() {

    'use strict';

    var str=location.href;

    var bool_cat = true;
    var bool_osu = true;


    var osu_b = str.indexOf("osu");
    var osu_c = str.indexOf(".sh");

    //check user is in osu/bloodcat page
    if(str.substring(osu_b,osu_c)!= "osu.ppy")
    {
        bool_osu=false;
    }
    else
    {
        bool_cat=false;
    }




    var beatmap_id="";


    //開始運行本腳本


    if(bool_osu){

        GM_setValue('OSU_enable',"true");
        var isS = str.indexOf('osu.ppy.sh/s');
        var isB = str.indexOf('osu.ppy.sh/b');
        var isP = str.indexOf('osu.ppy.sh/p');
        var isBeatmapset = str.indexOf('osu.ppy.sh/beatmapsets');
        var eee=str.indexOf("?");
        var fff=str.indexOf("&");
        var isBeatmap =str.indexOf('beatmap');


        //check /s or /b
        if(isS != -1 || isB != -1 || isP !=-1 ||isBeatmapset != -1 || isBeatmap !=-1)
        {

            //Get title
            getTitle();

        }


    }


    function creatButton(id){
        var add_html ="<button id='blood_bt' style='float:left;top:0;width:180px;height:43px;background-color:red;color:white;'>bloodCat</button>";        
        var div = document.createElement("div");
        div.innerHTML = add_html;
        if( document.getElementsByClassName('paddingboth')[0]!==undefined){
            document.getElementsByClassName('paddingboth')[0].append(div);
            document.getElementById('blood_bt').addEventListener("click", function(){window.open("http://bloodcat.com/osu/?q="+id+"&c=b&s=&m=");});
        }
        else{//find element every 1 second
            var findElement= setInterval(()=>{

                document.getElementsByClassName('beatmapset-header__buttons')[0].append(div);
                document.getElementById('blood_bt').addEventListener("click", function(){window.open("http://bloodcat.com/osu/?q="+id+"&c=b&s=&m=");});
                clearInterval(findElement);
            },1000);

        }

    }




    function getTitle(){
        //Get song name
        var artist,title,creator='';
        var mix='';
        if(isBeatmapset!=-1){


            var findElement= setInterval(()=>{

                title =document.getElementsByClassName("beatmapset-header__details-text")[0].innerHTML;
                artist =document.getElementsByClassName("beatmapset-header__details-text")[1].innerHTML;
                creator=document.getElementsByClassName("beatmapset-mapping__user")[0].innerHTML;
                if(title&&artist&&creator){

                    mix=artist+' '+title+' '+creator;
                    creatButton(mix);
                    clearInterval(findElement);
                }

            },1000);




        }else{

            artist =document.getElementById("songinfo").getElementsByClassName("colour")[0].getElementsByTagName("a")[0].innerHTML;
            title=document.getElementById("songinfo").getElementsByClassName("colour")[3].getElementsByTagName("a")[0].innerHTML;
            creator=document.getElementById("songinfo").getElementsByClassName("colour")[6].getElementsByTagName("a")[0].innerHTML;
            mix=artist+' '+title+' '+creator;
            //creat a button element to bloodcat
            creatButton(mix);
        }



    }



    //script in bloodcat
    if(bool_cat)
    {
        if(GM_getValue('OSU_enable')==="true"){
            verify();
        }
        GM_setValue('OSU_enable',"false");
    }


    //check have the same beatmap in bloodcat
    function verify(){
        //get length of sets
        var set_num = document.getElementsByClassName('set').length;
       





        if(set_num===0){
            alert('The beatmap have not exist!');

        }else if(set_num==1){
           document.getElementsByClassName('title')[1].click();
        }else{

            alert('more than 1 beatmap');

        }




    }
})();