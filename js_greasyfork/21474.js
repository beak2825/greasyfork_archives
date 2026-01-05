// ==UserScript==
// @name         ZTBuilder
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       iti
// @match        http://www.x10000000.aspidanetwork.com/dorf*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/21474/ZTBuilder.user.js
// @updateURL https://update.greasyfork.org/scripts/21474/ZTBuilder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function xGet(url) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, false);
        xhttp.send();
        return xhttp.response;
    }
    
    function xPost(spage, sbody){
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", spage, false);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send(sbody);
        return xhttp.response;
    }
    
    function main(iid, c){
        var areas = document.querySelectorAll('#rx area'); 
        areas.length === 0 ? areas = document.querySelectorAll('#clickareas area') : 0;
        //var html = document.querySelectorAll('#rx area');
        for(var j=0; j<c-1; j++){
            var html = document.createElement('html');
            html.innerHTML = xGet(areas[parseInt(iid)].href);
            areas = html.querySelectorAll('#rx area');
            areas.length === 0 ? areas = html.querySelectorAll('#clickareas area') : 0;
            console.log(j);
        }
        location.href = areas[parseInt(iid)].href;
    }
    
    function main2(iid, c){
        var areas = document.querySelectorAll('#rx area'); 
        areas.length === 0 ? areas = document.querySelectorAll('#clickareas area') : 0;
        //var html = document.querySelectorAll('#rx area');
        for(var j=0; j<c; j++){
            var html = document.createElement('html');
            html.innerHTML = xGet(areas[parseInt(iid)].href);
            areas = html.querySelectorAll('#rx area');
            areas.length === 0 ? areas = html.querySelectorAll('#clickareas area') : 0;
            console.log(j);
        }
        //location.href = areas[parseInt(iid)].href;
    }

    function main3(iid, c, html0){
        var areas = html0.querySelectorAll('#rx area'); 
        areas.length === 0 ? areas = html0.querySelectorAll('#clickareas area') : 0;
        //var html = document.querySelectorAll('#rx area');
        var html;
        for(var j=0; j<c; j++){
            html = document.createElement('html');
            html.innerHTML = xGet(areas[parseInt(iid)].href);
            areas = html.querySelectorAll('#rx area');
            areas.length === 0 ? areas = html.querySelectorAll('#clickareas area') : 0;
            console.log(j);
        }
        return html;
        //location.href = areas[parseInt(iid)].href;
    }
    
    function usendRaid(x, y, t1){
        var page = "a2b.php";
        var stbody = "t1="+t1+"&t5=&t11=&x="+x+"&y="+y+"&c=4&s1=ok";
    
        var html = document.createElement('html');
        xGet(page);
        html.innerHTML = xPost(page, stbody);
        //console.log(html.querySelector('input[name="timestamp"]'));
        //console.log(html);
        var sbody2 = "timestamp="+html.querySelector('input[name="timestamp"]').value;
        sbody2 += "&timestamp_checksum="+html.querySelector('input[name="timestamp_checksum"]').value;
        sbody2 += "&ckey="+html.querySelector('input[name="ckey"]').value;
        sbody2 += "&id="+html.querySelector('input[name="id"]').value;
        sbody2 += "&a="+html.querySelector('input[name="a"]').value;
        sbody2 += "&c="+html.querySelector('input[name="c"]').value;
        sbody2 += "&s1="+html.querySelector('#btn_ok').value;
        xPost(page, sbody2);
        return true;
    }
    
    function usendAdventure(){
        var page = "hero_adventure.php";
        var page3 = "a2b.php";
    
        var html = document.createElement('html');
        html.innerHTML = xGet(page);
        var page2 = html.querySelector('a.gotoAdventure');
        html.innerHTML = xGet(page2.href);
        
        var sbody2 = "a="+html.querySelector('input[name="a"]').value;
        sbody2 += "&c="+html.querySelector('input[name="c"]').value;
        sbody2 += "&h="+html.querySelector('input[name="h"]').value;
        sbody2 += "&id="+html.querySelector('input[name="id"]').value;
        sbody2 += "&s1="+html.querySelector('#btn_ok').value;
 
        xPost(page3, sbody2);
        return true;
    }
    
    function ufarm(units){
        var coord = [ /* [x,y], [x,y] , ...*/ ];
        for(var i=0; i<coord.length; i++){
            usendRaid(coord[i][0], coord[i][1], units);
        }
    }

    function botBuilder(aidp, btype){
        var html = document.createElement('html');
        var page1;
        var idp;
        while( (idp = aidp.shift()) ){
            page1 = "build.php?id="+idp;
            html.innerHTML = xGet(page1);
            var blinks = html.querySelectorAll('#build button.green.new');
            var link;
            for(var i=0; i<blinks.length; i++){
                var temp = blinks[i].getAttribute('onclick').match(/'(.*)'/)[1];
                if(temp.indexOf('а='+btype+'&') !== -1){
                    link = temp;
                    break;
                }
            }
            console.log("link = "+link);
            if(link !== undefined){
                html.innerHTML = xGet(link);
                for(var j=0; j<19; j++){
                    var alinks = html.querySelectorAll('#clickareas area');
                    var link2;
                    for(var i=0; i<alinks.length; i++){
                        var temp = alinks[i].href;
                        if(temp.indexOf('='+idp+'&c=') !== -1){
                            link2 = temp;
                            break;
                        }
                    }
                    console.log("link2 = "+link2);
                    if(link2 !== undefined){
                        html.innerHTML = xGet(link2);
                    }
                }
            }
        }
    }

    unsafeWindow.autoBuild   = exportFunction (main, unsafeWindow);
    unsafeWindow.autoBuild2  = exportFunction (main2, unsafeWindow);
    unsafeWindow.usendRaid1 = exportFunction (usendRaid, unsafeWindow);
    unsafeWindow.ufarm1 = exportFunction (ufarm, unsafeWindow);
    unsafeWindow.usendAdventure = exportFunction (usendAdventure, unsafeWindow);
    unsafeWindow.botBuilder = exportFunction (botBuilder, unsafeWindow);
})();