// ==UserScript==
// @name JVC to Gilbert
// @namespace https://www.jeuxvideo.com/
// @version 1.0.1
// @author unpnj
// @match  https://www.jeuxvideo.com/*
// @include * https://www.jeuxvideo.com/*
// @grant none
// @description JVC to Gilbert ou comment break la boucle
// @downloadURL https://update.greasyfork.org/scripts/415745/JVC%20to%20Gilbert.user.js
// @updateURL https://update.greasyfork.org/scripts/415745/JVC%20to%20Gilbert.meta.js
// ==/UserScript==

var current_url = document.location;
var new_url = ["https://image.noelshack.com/fichiers/2019/30/1/1563768508-winnie-gilbert-2.png",
               "https://image.noelshack.com/fichiers/2016/44/1478467982-risitas-police4.png",
               "https://image.noelshack.com/fichiers/2016/52/1483107685-jesuscrs2agentfisher.png",
               "https://image.noelshack.com/fichiers/2016/50/1481985771-gendarmedeuxsucres.png",
               "https://image.noelshack.com/fichiers/2016/50/1481985771-gendarmedeuxsucres.png",
              "https://image.noelshack.com/fichiers/2016/52/1482925260-risitas-attention.png",
              "https://image.noelshack.com/fichiers/2017/13/1490886827-risibo.png",
              "https://image.noelshack.com/fichiers/2017/11/1489890704-circulez5.png",
              "https://image.noelshack.com/fichiers/2017/11/1489890293-circulez2.png"
              ];
location.replace(new_url[Math.floor(Math.random() * 8)]);