// ==UserScript==
// @name         Iwara Like Rate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display the like rate. Make view, like and like view display colorful.
// @author       ihowhu
// @include        https://ecchi.iwara.tv/*
// @include        https://iwara.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403921/Iwara%20Like%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/403921/Iwara%20Like%20Rate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function callike(like, likeobj) {
        if(like<100)
            return;
        else if(like<200)
            likeobj.style.color = colorlist[0];
        else if(like<300)
            likeobj.style.color = colorlist[1];
        else if(like<400)
            likeobj.style.color = colorlist[2];
        else if(like<500)
            likeobj.style.color = colorlist[3];
        else if(like<600)
            likeobj.style.color = colorlist[4];
        else if(like<700)
            likeobj.style.color = colorlist[5];
        else if(like<800)
            likeobj.style.color = colorlist[6];
        else if(like<900)
            likeobj.style.color = colorlist[7];
        else if(like<1000)
            likeobj.style.color = colorlist[8];
        else
            likeobj.style.color = colorlist[9];
    }

    function calview(view, viewobj) {
        if(view<10)
            return;
        else if(view<15)
            viewobj.style.color = colorlist[0];
        else if(view<20)
            viewobj.style.color = colorlist[1];
        else if(view<25)
            viewobj.style.color = colorlist[2];
        else if(view<30)
            viewobj.style.color = colorlist[3];
        else if(view<35)
            viewobj.style.color = colorlist[4];
        else if(view<40)
            viewobj.style.color = colorlist[5];
        else if(view<45)
            viewobj.style.color = colorlist[6];
        else if(view<50)
            viewobj.style.color = colorlist[7];
        else if(view<55)
            viewobj.style.color = colorlist[8];
        else
            viewobj.style.color = colorlist[9];
    }

    function calrate(rate, node) {
        if(rate<10)
            node.style.color = colorlist[0];
        else if(rate<15)
            node.style.color = colorlist[1];
        else if(rate<20)
            node.style.color = colorlist[2];
        else if(rate<25)
            node.style.color = colorlist[3];
        else if(rate<30)
            node.style.color = colorlist[4];
        else if(rate<35)
            node.style.color = colorlist[5];
        else if(rate<40)
            node.style.color = colorlist[6];
        else if(rate<45)
            node.style.color = colorlist[7];
        else if(rate<50)
            node.style.color = colorlist[8];
        else
            node.style.color = colorlist[9];
    }

    const colorlist = ['#ffe6e6','#ffcccc','#ffb3b3','#ff9999','#ff8080','#ff6666','#ff4d4d','#ff3333','#ff1a1a','Red'];
    var objs=document.getElementsByClassName("node-video");
    for (var i=0;i<objs.length;i++){
        try {
            var likeobj=objs[i].firstElementChild.firstElementChild.firstElementChild;
            var like = parseFloat(likeobj.innerHTML.split("</i>").pop());
            callike(like,likeobj);
            var viewobj = objs[i].firstElementChild.firstElementChild.getElementsByTagName('div')[1];
            var view = parseFloat(viewobj.innerHTML.split("</i>").pop());
            if(viewobj.innerHTML.indexOf('k')===-1) continue;
            calview(view,viewobj);
            var rate = like/view;
            if(rate>1){
                var node = document.createElement("span");
                var textnode = document.createTextNode(rate.toFixed(3));
                node.appendChild(textnode);
                calrate(rate,node);
                objs[i].appendChild(node);
            }
        }
        catch(e) {}
    }
    objs=document.getElementsByClassName("node-views");
    if(objs[0]!==undefined){
        var str = objs[0].innerHTML;
        like = parseFloat(str.slice(str.indexOf("</i>")+4,str.indexOf('<i class="glyphicon glyphicon-eye-open">')));
        view = parseFloat(str.split("</i>").pop());
        rate = like/view;
        if(rate>1){
            node = document.createElement("span");
            textnode = document.createTextNode(rate.toFixed(3));
            node.appendChild(textnode);
            calrate(rate,node);
            console.log(node);
            objs[0].appendChild(node);
        }
    }
})();