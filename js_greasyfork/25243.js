// ==UserScript==
// @name         bs check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bs.to/home
// @match        https://bs.to
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25243/bs%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/25243/bs%20check.meta.js
// ==/UserScript==
var loadcounter;
var preferedHoster="OpenLoad";
var reference;
var ref;
var seriesRef;
var i;

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while (new Date().getTime() < unixtime_ms + ms) {}
}

(function start() {
    $(sbState)[0].hidden=true;
    //variables--------------------------
    var elements =top.document.getElementsByTagName("ul")[1].children;
    i=new Array(elements.length);
    rekursive(elements,0);
    //ref=new Array(elements.length);
})();
function rekursive(elements,nr){
    i[nr]=open(elements[nr].firstChild.href.toString()+"/0");
    i[nr].addEventListener("DOMContentLoaded", (function(nrI){
        return function(){

            var series =i[nrI].document.getElementsByClassName("pages")[0].children;
            var seriesRef=new Array(series.length);
            for(var j=0;j<series.length-1;j++){
                if(series[j].className===""){
                    seriesRef[j]=open(series[j].firstChild.href);
                    seriesRef[j].addEventListener("DOMContentLoaded", (function(m){
                        return function(){
                            //-------------------------------------------------------------
                            var episodes = seriesRef[m].document.getElementsByTagName("tbody")[0].children;
                            for(var k=1;k<episodes.length;k++){
                                if(episodes[k].className!="watched"){
                                    var hoster=episodes[k].children[3].children;
                                    var opened=0;
                                    for(var l=0;l<hoster.length;l++){
                                        if(hoster[l].title==preferedHoster){
                                            open(hoster[l].href);
                                            opened=1;
                                        }
                                    }
                                    if(opened===0){
                                        open(hoster[0].href);
                                    }
                                }
                            }
                            seriesRef[m].window.close();
                            //----------------------------------------------------------------
                        };
                    }(j)));
                }
            }
            i[nrI].window.close();
            if(nr<elements.length-2){
                rekursive(elements,nr+1);
            }
        };
    }(nr)));
}


/*function rekursive(nr,elements,ref){
    return function(){
        var series =ref[nr].document.getElementsByClassName("pages")[0].children;
        seriesRef=new Array(series.length);
        for(var j=0;j<series.length-1;j++){
            if(series[j].className===""){
                seriesRef[j]=open(series[j].firstChild.href);
                seriesRef[j].onload=rekursiveSeries(j,elements);
            }
        }
       /* if(nr%10===0){
            for(var o=nr+1;o<elements.length;o++){
                ref[o]=open(elements[o].firstChild.href.toString()+"/0");
                ref[o].onload=rekursive(o,elements,ref);
                if(o%10===0){
                    break;
                }
            }

        ref[nr].window.close();
    };
}

function rekursiveSeries(m,elements){
    return function(){
        var windo;
        var episodes = seriesRef[m].document.getElementsByTagName("tbody")[0].children;
        for(var k=1;k<episodes.length;k++){
            if(episodes[k].className!="watched"){
                var hoster=episodes[k].children[3].children;
                var opened=0;
                for(var l=0;l<hoster.length;l++){
                    if(hoster[l].title==preferedHoster){
                        windo=open(hoster[l].href);
                        opened=1;
                    }
                }
                if(opened===0){
                    windo =open(hoster[0].href);
                }
            }
        }
        seriesRef[m].window.close();
    };
}*/