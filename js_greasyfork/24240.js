// ==UserScript==
// @name         HSLO LITE v2|PS Support Version
// @version      2.2
// @author       szymy, 2coolife, sniikz (themes)
// @namespace    ogario.v2
// @description  OGARio - HSLO LITE v2 Private Server Edition 
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/24240/HSLO%20LITE%20v2%7CPS%20Support%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/24240/HSLO%20LITE%20v2%7CPS%20Support%20Version.meta.js
// ==/UserScript==

function loadScript(e) {var script = e.replace("</head>", '<script src="http://2coolife.com/hslolite2/perfect-scrollbar.jquery.min.js"></script><script src="http://2coolife.com/hslolite2/sniff.js"></script><link href="http://2coolife.com/hslolite2/style.css" rel="stylesheet"></link><script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.6/js/bootstrap-colorpicker.min.js"></script><link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.6/css/bootstrap-colorpicker.css" rel="stylesheet"></link><script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" charset="utf-8"></script><link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet"></link></head>').replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "").replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "").replace("</body>", '<script src="http://2coolife.com/hslolite2/litev2.js" charset="utf-8"></script><link href="https://fonts.googleapis.com/css?family=Oswald:400,300" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Arimo:400,700" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500" rel="stylesheet"></body>');return script;}window.stop();document.documentElement.innerHTML = "";GM_xmlhttpRequest({method : "GET",url : "http://agar.io/",onload : function(e) {var doc = loadScript(e.responseText);document.open();document.write(doc);document.close();}});if (location.host == "agar.io" && location.pathname == "/") {location.href = "http://agar.io/hslolite" + window.location.search + location.hash;return;}
