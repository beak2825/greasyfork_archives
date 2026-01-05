// ==UserScript==
// @name         Clixgrid viewer
// @namespace    jorgequintt
// @version      1
// @description  enter something useful
// @author       Jorge Quintero
// @match        www.clixsense.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/13037/Clixgrid%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/13037/Clixgrid%20viewer.meta.js
// ==/UserScript==
if(window.location.href.indexOf("ClixGrid")==28){
    if(window.location.href.length<=36){
        //ik=0;
        chances=document.getElementById("clxs1").innerText;
        grids = document.getElementsByTagName("table")[3].getElementsByTagName("td");
        back=document.getElementById("clxpic").src;
        avGrids = [];

        for (var i=(grids.length-1);i>=0;i--){
            if(grids[i].title!=="You have already clicked this position today"){
                avGrids.push(grids[i]);
            }
        }

        function seeGrid(n){
            setTimeout(function() {avGrids[n].click()},1500);
        }      

        randomFromAv=Math.floor(Math.random() * avGrids.length);
        document.title="("+chances+" grids restantes)";
        if(chances!=="0"){seeGrid(randomFromAv);}

        function roll(){
            if(document.getElementById("clxs1").innerText!==chances){
                //ik+=1;
                chances=document.getElementById("clxs1").innerText;
                grids = document.getElementsByTagName("table")[3].getElementsByTagName("td");

                avGrids = [];

                for (var i=(grids.length-1);i>=0;i--){
                    if(grids[i].title!=="You have already clicked this position today"){
                        avGrids.push(grids[i]);
                    }
                }

                function seeGrid(n){
                    setTimeout(function(){avGrids[n].click()},2200);
                }      

                randomFromAv=Math.floor(Math.random() * avGrids.length);
                document.title="("+chances+" grids restantes)";
                if(chances!=="0"/* && (ik==1)*/){seeGrid(randomFromAv);}
            }
            back=document.getElementById("clxpic").src;
            //if(ik==2){ik=0;}
        }

        setInterval(roll,100);
    }else if(window.location.href.length>36){
        function check(){
            if(!document.getElementsByClassName("msgx")[0]){
            }else{
                window.close();
            }
        }
        setInterval(check,500)
    }
}