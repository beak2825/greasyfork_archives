// ==UserScript==
// @name         4chan Good Morning
// @include      http://boards.4channel.org/*
// @include      https://boards.4channel.org/*
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @description:en    Adds a button so you can easily wish everyone on 4channel or 4chan good morning in a reply.
// @version 0.0.4
// @namespace https://greasyfork.org/users/823204
// @description Adds a button so you can easily wish everyone on 4channel or 4chan good morning in a reply.
// @downloadURL https://update.greasyfork.org/scripts/444316/4chan%20Good%20Morning.user.js
// @updateURL https://update.greasyfork.org/scripts/444316/4chan%20Good%20Morning.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function addWH(qr){
        var goodMorningBtn = document.createElement("button");
        var goodMorningBtnText = document.createTextNode("Good morning");
        goodMorningBtn.setAttribute("style",`color:white;font-size:23px;-webkit-text-stroke: 0.5px #006600;text-shadow: 1px 1px 0 orange,  -1px -1px 0 green;background-color:#333333;background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='flag-icons-in' viewBox='0 0 640 480'%3E%3Cpath fill='%23f93' d='M0 0h640v160H0z'/%3E%3Cpath fill='%23fff' d='M0 160h640v160H0z'/%3E%3Cpath fill='%23128807' d='M0 320h640v160H0z'/%3E%3Cg transform='matrix(3.2 0 0 3.2 320 240)'%3E%3Ccircle r='20' fill='%23008'/%3E%3Ccircle r='17.5' fill='%23fff'/%3E%3Ccircle r='3.5' fill='%23008'/%3E%3Cg id='d'%3E%3Cg id='c'%3E%3Cg id='b'%3E%3Cg id='a' fill='%23008'%3E%3Ccircle r='.9' transform='rotate(7.5 -8.8 133.5)'/%3E%3Cpath d='M0 17.5.6 7 0 2l-.6 5L0 17.5z'/%3E%3C/g%3E%3Cuse xlink:href='%23a' width='100%25' height='100%25' transform='rotate(15)'/%3E%3C/g%3E%3Cuse xlink:href='%23b' width='100%25' height='100%25' transform='rotate(30)'/%3E%3C/g%3E%3Cuse xlink:href='%23c' width='100%25' height='100%25' transform='rotate(60)'/%3E%3C/g%3E%3Cuse xlink:href='%23d' width='100%25' height='100%25' transform='rotate(120)'/%3E%3Cuse xlink:href='%23d' width='100%25' height='100%25' transform='rotate(-120)'/%3E%3C/g%3E%3C/svg%3E%0A");background-repeat: repeat-x;background-size: 20% 100%`);

        goodMorningBtn.onclick = function(){

          var postArray = Array.from(document.querySelectorAll(".postContainer"));
          console.log(postArray.length);

          var message = "\nGood morning";

          if(postArray.length==1){
            message += ", Sir";
          } else {
            message += ", Sirs";
          }

          var arr = postArray.map(e=>{ return ">>" + e.id.slice(2) });

          if(postArray.length < 20) {

            document.querySelector('[placeholder="Comment"]').value = arr.slice(Math.max(arr.length - 150, 0)).join("\n") + message;
          } else {

            // var arr = Array.from(document.querySelectorAll(".postContainer")).map(e=>{ return ">>"+e.id.slice(2)+" " }).join("")
            // var arr = postArray.map(e=>{ return ">>" + e.id.slice(2) })
            document.querySelector('[placeholder="Comment"]').value = arr.slice(Math.max(arr.length - 150, 0)).join(" ") + message;

          }

        }
        goodMorningBtn.appendChild(goodMorningBtnText);
        qr.appendChild(goodMorningBtn);
    }

    var checkqrexists = new MutationObserver(function(mutations, me) {
        var qr = document.getElementById('qr');
        if(qr){
            addWH(qr);
            me.disconnect();
            return;
        }
    });

    checkqrexists.observe(document, { childList: true, subtree: true });
})();