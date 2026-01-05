// ==UserScript==
// @name         kissanime series check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://kissanime.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25245/kissanime%20series%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/25245/kissanime%20series%20check.meta.js
// ==/UserScript==
var missingList; //no decision yet;
var checkedList; //already in bookmark list;
var deniedList;  //decided not to add
(function UpdateChecking() {
    var lasTime=0;
    try{
        lastTime=JSON.parse(localStorage.getItem('last'));
    }catch(e){
    }
    if(new Date().valueOf()-lastTime>(1000*60*60*24*15)){
        localStorage.setItem('last', JSON.stringify(new Date().valueOf()));
        deniedList=new Array(0);
        missingList=new Array(0);
        checkedList=new Array(0);
        if(window.location.href.indexOf("kissanime.to/BookmarkList")>-1){
            var Animelist=document.getElementsByClassName("listing")[0].firstElementChild.children;
            //var openedArray=new Array(Animelist.length);
            for(var t=2 ;t<Animelist.length;t++){
                checkedList.push(cutString(Animelist[t].children[0].children[0].href));
            }
            localStorage.setItem('currentList', JSON.stringify(checkedList));
            rekursive(Animelist,2,checkedList);
            log(checkedList);
        }
    }else{
        console.log((1000*60*60*24*15)-(new Date().valueOf()-lastTime));
    }
})();
function log(e){
    var alertS="";
    for(var j=0;j<e.length;j++){
        alertS +=e[j]+"\n";
    }
    console.log(alertS);
}
function cutString(e){
    e=e.toString();
    e=e.replace("-Dub","");
    e=e.replace("http://kissanime.com","http://kissanime.to");
    return e;
}

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while (new Date().getTime() < unixtime_ms + ms) {}
}
function rekursive(Animelist,i,checkedList){
    var index;
    var hasremoved=0;
    var counter=JSON.parse(localStorage.getItem('kissanimeCounter'));
    if(counter>i){
        // i=counter+1;
    }
    if(i<Animelist.length-1){
        var openedArray=new Array(Animelist.length);
        openedArray[i]=open(Animelist[i].children[0].children[0].href);
        openedArray[i].addEventListener("DOMContentLoaded", (function(nr){
            return function(){
                localStorage.setItem('kissanimeCounter',JSON.stringify(nr));
                // alert(openedArray[nr].document.getElementsByClassName("bigChar")[0].href);
                var rL=openedArray[i].document.getElementsByClassName("rightBox")[1].children[1].children[1].children;
                for(var k=0;k<rL.length;k++){
                    if(rL[k].localName=="a"&&rL[k].href.indexOf("Episode")==-1)  {
                        var looking=cutString(rL[k].href);
                        checkedList=JSON.parse(localStorage.getItem('currentList'));
                        deniedList=JSON.parse(localStorage.getItem('nopelist'));
                        if(!checkedList.includes(looking)&&!deniedList.includes(looking)&&!missingList.includes(looking)){
                            missingList.push(looking);
                        }
                        index=findArray(checkedList,looking);
                        if(index>-1&&checkedList[index]!=cutString(Animelist[nr].children[0].children[0].href)){
                            //Animelist=removeArray(Animelist,index);
                        }
                        //localStorage.setItem('currentList', JSON.stringify(checkedList));
                    }else if(rL[k].className=="line"){
                        break;
                    }
                }
                console.log(nr);
                for(var l=0;l<missingList.length;l++){
                    var openedLink=new Array(missingList.length);
                    deniedList=JSON.parse(localStorage.getItem('nopelist'));
                    checkedList=JSON.parse(localStorage.getItem('currentList'));
                    if(!deniedList.includes(missingList[l])&&!checkedList.includes(missingList[l])){
                        if(openedArray[nr].confirm(missingList[l].toString())){
                            checkedList.push(missingList[l]);
                            localStorage.setItem('currentList', JSON.stringify(checkedList));
                            openedLink[l]=open(missingList[l]);
                            openedLink[l].onload=(function(i){
                                return function(){
                                    openedLink[i].document.getElementById("btnAddBookmark").click();
                                };
                            }(l));
                        }else{
                            deniedList.push(missingList[l]);
                            localStorage.setItem('nopelist',JSON.stringify(deniedList));
                        }
                    }
                }
                openedArray[nr].close();
                if(nr<Animelist.length){
                    rekursive(Animelist,nr+1,checkedList);

                }
            };
        }(i)));

    }

    /*function check(e,i){
 //if(e[i]===false){
    log("recheck");
      //setInterval(check(e,i),50);
    return;
    }

}*/
    //check(boolList,i);
}


function removeArray(e,f){     //array e element of e f
    var g=new Array(e.length-1);
    for(var i=0;i<e.length;i++){
        if(i<f){
            g[i]=e[i];
        }
        else{
            if(i==f){
            }
            else{
                g[i-1]=e[i];
            }
        }
    }
    return g;
}
function findArray(e,f){
    for(var i=0;i<e.length-2;i++) {
        if(f==cutString(e[i])){
            return i;
        }
    }
    return -1;
}
//localStorage.setItem("names", JSON.stringify(names));

//...
//var storedNames = JSON.parse(localStorage.getItem("names"));
//deniedList=JSON.parse(localStorage.getItem('deniedList');
//checkedList=JSON.parse(localStorage.getItem('currentList'));
//log(checkedList);
//close();
//completedList.push(Animelist[i].children[0].children[0].href.toString());
// var opened= open(Animelist[i].children[0].children[0].href.toString());
// opened.onload=function(){
//loaded();
//    var url = opened.document.getElementsByClassName("bigChar")[0].href;
//    if(!missingList.includes(url)){
//        missingList.push(url);
//    }
//    opened.close();
// };


/*for(var i=2;i<Animelist.length;i++){
            if(new Date().getDate()*7==i){
                openedArray[i]=open(Animelist[i].children[0].children[0].href);
                openedArray[i].onload= (function(nr){
                    return function(){
                        // alert(openedArray[nr].document.getElementsByClassName("bigChar")[0].href);
                        var rL=openedArray[nr].document.getElementsByClassName("rightBox")[1].children[1].children[1].children;
                        for(var k=0;k<rL.length;k++){
                            if(rL[k].localName=="a"&&rL[k].href.indexOf("Episode")==-1)  {
                                var looking=cutString(rL[k].href);
                                checkedList=JSON.parse(localStorage.getItem('currentList'));
                                deniedList=JSON.parse(localStorage.getItem('nopelist'));
                                if(!checkedList.includes(looking)&&!deniedList.includes(looking)&&!missingList.includes(looking)){
                                    missingList.push(looking);
                                }
                            }else if(rL[k].className=="line"){
                                break;
                            }
                        }
                        openedArray[nr].close();
                        for(var l=0;l<missingList.length;l++){
                            var openedLink=new Array(missingList.length);
                            deniedList=JSON.parse(localStorage.getItem('nopelist'));
                            checkedList=JSON.parse(localStorage.getItem('currentList'));
                            if(!deniedList.includes(missingList[l])&&!checkedList.includes(missingLink[l])){
                                if(confirm(missingList[l])){
                                    checkedList.push(missingList[l]);
                                    localStorage.setItem('currentList', JSON.stringify(checkedList));
                                    openedLink[l]=open(missingList[l]);
                                    openedLink[l].onload=(function(i){
                                        return function(){
                                            openedLink[i].document.getElementById("btnAddBookmark").click();
                                        };
                                    }(l));
                                }else{
                                    deniedList.push(missingList[l]); 
                                    localStorage.setItem('nopelist',JSON.stringify(deniedList));
                                }
                            }
                        }

                    };
                }(i));
            }
        }*/