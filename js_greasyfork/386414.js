// ==UserScript==
// @name         Tsubaseitor
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  try to take over the world!
// @author       Tidon
// @match        https://tsubasa.im/global/*/player/*
// @match        https://tsubasa.im/global/*/skills/*
// @match        https://tsubasa.im/global/*/player/calc/*
// @grant        none
/* // @require      http://code.jquery.com/jquery-3.3.1.min.js */
// @require      https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js

//You can update it directly on https://greasyfork.org/es/scripts/386414-tsubaseitor
// @downloadURL https://update.greasyfork.org/scripts/386414/Tsubaseitor.user.js
// @updateURL https://update.greasyfork.org/scripts/386414/Tsubaseitor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var path = location.pathname;
    var pagina;
    var tab;
    var language;

    var punch, catching, tackle, block, intercept, pass, dribble, shot, header, volley, onetwo;
    switch (true) {
            case path.indexOf('/es/') !== -1:
            language="spa";
            punch="Puño";catching="Blocaje"; tackle="Entrada"; block="Bloqueo"; intercept="Intercepción"; pass="Pase"; dribble="Regate"; shot="Remate"; header="Cabezazo"; volley="Volea"; onetwo="Pared";
            break;
            case path.indexOf('/en/') !== -1:
            language="eng";
            punch="Punch";catching="Catch"; tackle="Tackle"; block="Block"; intercept="Intercept"; pass="Pass"; dribble="Dribble"; shot="Shot"; header="Header"; volley="Volley"; onetwo="One-Two";
            break;
            case path.indexOf('/fr/') !== -1:
            language="fra";
            punch="Arrêt";catching="Coup de poing"; tackle="Tacle"; block="Contre"; intercept="Interception"; pass="Passe"; dribble="Dribble"; shot="Tir"; header="Tête"; volley="Volée"; onetwo="Une-deux";
            break;
    }

    switch (true) {

        case path.indexOf('/stats/') !== -1:
        pagina="player";
        tab="stats";
        break;

        case path.indexOf('/calc/') !== -1:
        pagina="player";
        tab="calc";
        break;

        case path.indexOf('/player/') !== -1:
        pagina="player";
        break;

        case path.indexOf('/skills/') !== -1:
        pagina="skills";
        break;


    }
    //round function
    function round5(x){
    return Math.round(x/5)*5;
    }

    function dark(){
        var $ = window.jQuery;
        $("body").css({"background-color": "black", "color": "white"});
        $("table th").css({"background-color": "#241c1c", "olor": "white"});
        $("table td").css({"background-color": "#241c1c", "color": "white"});
        $("table").css({"background-color": "#241c1c", "color": "white"});
    }
   /* $('.breadcrumb').after("<button type='button' class='btn btn-primary' id='dark'>Dark</button>");
    $('#dark').on('mousedown', function(){
        dark();
    });
*/


    if(pagina=="player"){
    //var banner = document.querySelector("body > div.container > div:nth-child(5) > table > tbody > tr:nth-child(1) > td > img");
    var jugador= document.querySelector("body > div.container-lg > nav:nth-child(4) > ol > li:nth-child(2) > a").text;
    var foto_jugador;

    /*if (banner) {
        foto_jugador = document.querySelector("body > div.container > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(3) > a > img");
    }
    else {*/
        foto_jugador = document.querySelector("body > div.container-lg > div.table-responsive > table > tbody > tr:nth-child(2) > td:nth-child(3) > a > img");
    //}
    var foto_jugador_clone = foto_jugador.cloneNode(true);

    $("#player_skills").after("<h2 id='player' style='text-align: center' >"+ jugador + "</h2>");
    $("#player").append(foto_jugador_clone);

    }

    //table skills calculation and additions
    $('#DataTables_Table_0,#DataTables_Table_1').find('tr').each(function(){
      var tecnica = $(this).find('td').eq(0).text();

      var type = $(this).find('td').eq(1).text();
      var style = $(this).find('td').eq(2).text();
      var powerOri = parseInt($(this).find('td').eq(3).text());

      var distance;
      var energy;
        if(pagina=="player") {
            energy = $(this).find('td').eq(5).text();
            distance = $(this).find('td').eq(8).text();
        }
        if(pagina=="skills") {
            energy = $(this).find('td').eq(4).text();
            distance = $(this).find('td').eq(7).text();
        }
      var eficiencia = (powerOri/energy).toFixed(2);
      var Maxlvl = 0;
      var increment = 0;

      //no distance fix
      var power;
      if ( distance == "No Distance / Angle" || distance =="No Distance" ) {

          if( type == "S" || type == "A") { power=powerOri+10;}
          if( type == "B" || type == "C") { power=powerOri+5;}
      }
      else { power=powerOri;}


      //initial momentum calculation aproximation

      if( type == "S"){
          Maxlvl = 99;
          increment = 0.57;
      }
      else if ( type == "A"){
          if ( tecnica.indexOf( "(EX)" ) != -1 ){
              increment = 0.64;
          }
          else {
          increment = 0.60;
          }
          Maxlvl = 80;
      }
      else if ( type == "B"){
          Maxlvl = 60;
          increment = 0.60;
      }
      else if ( type == "C"){
          Maxlvl = 40;
          increment = 0.68;
      }

      var power0;
      power0 = powerOri * increment;
      var power00 = round5(power0);

      $(this).find('th').eq(2).after('<th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 34px;">Initial</th>');
      $(this).find('td').eq(2).after("<td>" + (power00).toFixed(0) + "</td>");

       if(pagina=="player") {
           $(this).find('th').eq(10).after('<th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 34px;">Ratio</th>');
           $(this).find('td').eq(10).after("<td>" + eficiencia + "</td>");

           $(this).find('th').eq(11).after('<th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 34px;">Rank</th>');
       }
       if(pagina=="skills"){
           $(this).find('th').eq(8).after('<th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 34px;">Ratio</th>');
           $(this).find('td').eq(8).after("<td>" + eficiencia + "</td>");

           $(this).find('th').eq(9).after('<th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 34px;">Rank</th>');

       }

      var rank;
      var nota;
      var color = "";

        if ( style == punch ){
          if ( type =="S" ) {
              if ( power > 455 ) {rank=4;}
              else if ( power >= 440 ) {rank= 3;}
              else if ( power >= 405 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="A" ) {
              if ( power > 325 ) {rank=4;}
              else if ( power >= 315 ) {rank= 3;}
              else if ( power >= 290 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="B" ) {
              if ( power > 260 ) {rank=4;}
              else if ( power >= 240 ) {rank= 3;}
              else if ( power >= 230 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="C" ) {
              if ( power > 210 ) {rank=4;}
              else if ( power >= 190 ) {rank= 3;}
              else if ( power >= 165 ) {rank= 2;}
              else {rank=1;}
          }
      }
      if ( style == catching) {
          if ( type =="S" ) {
              if ( power > 475 ) {rank=4;}
              else if ( power >= 450 ) {rank= 3;}
              else if ( power >= 415 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="A" ) {
              if ( power > 350 ) {rank=4;}
              else if ( power >= 320 ) {rank= 3;}
              else if ( power >= 290 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="B" ) {
              if ( power > 275 ) {rank=4;}
              else if ( power >= 240 ) {rank= 3;}
              else if ( power >= 230 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="C" ) {
              if ( power > 215 ) {rank=4;}
              else if ( power >= 205 ) {rank= 3;}
              else if ( power >= 180 ) {rank= 2;}
              else {rank=1;}
          }
      }
      if ( style == shot || style == header || style == volley) {
           if ( type =="S" ) {
              if ( power > 490 ) {rank=4;}
              else if ( power >= 465 ) {rank= 3;}
              else if ( power >= 420 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="A" ) {
              if ( power > 340 ) {rank=4;}
              else if ( power >= 325 ) {rank= 3;}
              else if ( power >= 290 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="B" ) {
              if ( power > 270 ) {rank=4;}
              else if ( power >= 240 ) {rank= 3;}
              else if ( power >= 230 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="C" ) {
              if ( power > 220 ) {rank=4;}
              else if ( power >= 210 ) {rank= 3;}
              else if ( power >= 185 ) {rank= 2;}
              else {rank=1;}
          }
      }

      if ( style == pass) {
           if ( type =="S" ) {
              if ( power > 455 ) {rank=4;}
              else if ( power >= 415 ) {rank= 3;}
              else if ( power >= 380 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="A" ) {
              if ( power > 315 ) {rank=4;}
              else if ( power >= 290 ) {rank= 3;}
              else if ( power >= 275 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="B" ) {
              if ( power > 250 ) {rank=4;}
              else if ( power >= 240 ) {rank= 3;}
              else if ( power >= 220 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="C" ) {
              if ( power > 205 ) {rank=4;}
              else if ( power >= 190 ) {rank= 3;}
              else if ( power >= 165 ) {rank= 2;}
              else {rank=1;}
          }
      }

      if ( style == onetwo || style == dribble || style == tackle || style == intercept || style == block) {
           if ( type =="S" ) {
              if ( power > 455 ) {rank=4;}
              else if ( power >= 420 ) {rank= 3;}
              else if ( power >= 405 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="A" ) {
              if ( power > 325 ) {rank=4;}
              else if ( power >= 295 ) {rank= 3;}
              else if ( power >= 275 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="B" ) {
              if ( power > 260 ) {rank=4;}
              else if ( power >= 240 ) {rank= 3;}
              else if ( power >= 230 ) {rank= 2;}
              else {rank=1;}
          }
          if ( type =="C" ) {
              if ( power > 210 ) {rank=4;}
              else if ( power >= 190 ) {rank= 3;}
              else if ( power >= 165 ) {rank= 2;}
              else {rank=1;}
          }
      }



      if(rank==4) {nota="A"; color= "<td  style='background-color:	#18aa24e0; color:white;  text-align: center;'>";}
      if(rank==3) {nota="B"; color= "<td  style='background-color:	#197cb8e0; color:white;  text-align: center;'>";}
      if(rank==2) {nota="C"; color= "<td  style='background-color:	#7519b8e0; color:white;  text-align: center;'>";}
      if(rank==1) {nota="D"; color= "<td  style='background-color:	#b81977e0; color:white;  text-align: center;'>";}

      var plus="";
      if (eficiencia > 1.8) {
          plus="+"
      }
      if (eficiencia < 1){
          plus="-"
      }
      if(pagina=="player") {$(this).find('td').eq(11).after(color + nota + plus + "</td>");}
      if(pagina=="skills") {$(this).find('td').eq(9).after(color + nota + plus + "</td>");}
    });

//change reoder function to work good with A+ A- etc.
$.extend( $.fn.dataTableExt.oSort, {

    "signed-num-asc": function ( a, b ) {
      if(a=="A+") {
        if(b=="A") { return 1;}
        else {return -1;}
      }
      if(b=="A+"){
        if(a=="A") { return 1;}
        else {return -1;}
      }
      if(a=="B+") {
        if(b=="B") { return 1;}
        else {return -1;}
      }
      if(b=="B+"){
        if(a=="B") { return 1;}
        else {return -1;}
      }
      if(a=="C+") {
        if(b=="C") { return 1;}
        else {return -1;}
      }
      if(b=="C+"){
        if(a=="C") { return 1;}
        else {return -1;}
      }
      if(a=="D+") {
        if(b=="D") { return 1;}
        else {return -1;}
      }
      if(b=="D+"){
        if(a=="D") { return 1;}
        else {return -1;}
      }

        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "signed-num-desc": function ( a, b ) {
      if(a=="A+") {
        if(b=="A") { return -1;}
        else {return 1;}
      }
      if(b=="A+"){
        if(a=="A") { return -1;}
        else {return 1;}
      }
      if(a=="B+") {
        if(b=="B") { return -1;}
        else {return 1;}
      }
      if(b=="B+"){
        if(a=="B") { return -1;}
        else {return 1;}
      }
      if(a=="C+") {
        if(b=="C") { return -1;}
        else {return 1;}
      }
      if(b=="C+"){
        if(a=="C") { return -1;}
        else {return 1;}
      }
      if(a=="D+") {
        if(b=="D") { return -1;}
        else {return 1;}
      }
      if(b=="D+"){
        if(a=="D") { return -1;}
        else {return 1;}
      }
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );

//if (tab=="stats" || tab=="calc"){
if(pagina=="player"){
    var idj = $("body > div.container-lg > div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(2)").text();

    var urllink = "/global/es/player/skills/?id=" + idj;
   // var tabskill = document.querySelector("body > div.container-lg > ul > li:nth-child(4) > a");

    //$(tabskill).removeAttr('data-toggle');
    //$(tabskill).attr("href", urllink);

    var list = document.querySelector("body > div.container-lg > ul");

    var anode = document.createElement('a');
    var textnode = document.createTextNode("List");
    anode.appendChild(textnode);
    anode.title = "Link to all skills including the player ones";
    anode.href = urllink;
    anode.classList.add("nav-link");

    var entry = document.createElement('li');
    entry.appendChild(anode);

    entry.classList.add("nav-item");
    list.appendChild(entry);

}


//reodern main table and add changes depending on route
var table;
if(pagina=="player"){
    table = $('#DataTables_Table_0').DataTable({
    paging: false,
    "order": [ 2, 'asc' ],
    columnDefs: [ { targets: 12, type: 'signed-num' } ]
});
}

if(pagina=="skills"){
    table = $('#DataTables_Table_0').DataTable({
    paging: false,
    "order": [ 2, 'asc' ],
    columnDefs: [ { targets: 10, type: 'signed-num' } ]
});
}

//lets reoder other skills table
var table2 = $('#DataTables_Table_1').DataTable({
    paging: false,
    "order": [ 2, 'asc' ],
     buttons: [
        'copy', 'excel', 'pdf'
    ]
});


//draw tables
//table.draw();
//table2.draw();


})();
