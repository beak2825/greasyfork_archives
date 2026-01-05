// ==UserScript==
// @name           Compteur politique 2017 fr
// @include        http*://*
// @require        http://code.jquery.com/jquery-3.1.1.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js
// @grant       none
// @version 3
// @namespace https://greasyfork.org/users/111783
// @description Compteur politique des élus 2017
// @downloadURL https://update.greasyfork.org/scripts/28353/Compteur%20politique%202017%20fr.user.js
// @updateURL https://update.greasyfork.org/scripts/28353/Compteur%20politique%202017%20fr.meta.js
// ==/UserScript==

 setTimeout(function() {
   document.body.innerHTML = document.body.innerHTML.replace(/ Fillon/g,' <span class="fillion-ctn" style="background: #2ecc71; font-weight: bold; color: #FFF;">Fillon</span>');
   document.body.innerHTML = document.body.innerHTML.replace(/ Mélenchon/g,' <span class="melenchon-ctn" style="background: #3498db; font-weight: bold; color: #FFF;">Mélenchon</span>');
   document.body.innerHTML = document.body.innerHTML.replace(/ Macron/g,' <span class="macron-ctn" style="background: #C72C1C; font-weight: bold; color: #FFF;">Macron</span>');
   document.body.innerHTML = document.body.innerHTML.replace(/ Hamon/g,' <span class="hamon-ctn" style="background: #9b59b6; font-weight: bold; color: #FFF;">Hamon</span>');
   document.body.innerHTML = document.body.innerHTML.replace(/ Le Pen/g,' <span class="lepen-ctn" style="background: #f1c40f; font-weight: bold; color: #FFF;">Le Pen</span>');
   var fillon = $(".fillion-ctn").length;
   var melenchon = $(".melenchon-ctn").length;
   var macron = $(".macron-ctn").length;
   var hamon = $(".hamon-ctn").length;
   var lepen = $(".lepen-ctn").length;
   /*$( "body" ).append("<bar style=\"background: #FFF; position: fixed; top: 0; left: 0; right: 0; z-index: 99999999999;\"> Compteur<br/> fillon : "+fillon+" | mélenchon : "+melenchon+" | macron : "+macron+" | hamon : "+hamon+" | le pen : "+lepen+"</bar>");*/
   
$( "body" ).append("<canvas id=\"stats-pol\" style=\"position: fixed; bottom: 0; right: 0; z-index: 99999999999; max-width: 400px; max-height: 400px; height: 400px; width: 400px;\">");   
   
   var ctx = document.getElementById("stats-pol").getContext('2d');
   var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Fillon", "Mélenchon", "Macron", "Hamon", "Le pen"],
      datasets: [{
        backgroundColor: [
          "#2ecc71",
          "#3498db",
          "#C72C1C",
          "#9b59b6",
          "#f1c40f"
        ],
        data: [fillon, melenchon, macron, hamon, lepen]
      }]
    }
  });
},1500);