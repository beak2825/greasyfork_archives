// ==UserScript==
// @name         Rozvrh Enhancer
// @namespace    http://tfalesni.comxa.com/
// @version      1
// @description  Přidá možnost vidět rozdíly předmětů mezi jednotlivými dny
// @author       Tomáš Falešník
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js     
// @match        http://znamky.zsunesco.cz/*
// @downloadURL https://update.greasyfork.org/scripts/23964/Rozvrh%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/23964/Rozvrh%20Enhancer.meta.js
// ==/UserScript==

//Prosím upravte @match na vaši školu, jinak to nebude fungovat..
//Př: http://bakalari.nejaka.skola.cz/* - Ta hvězdička za lomítkem tam musí být.

(function() {
  'use strict';

  $("#cphmain_pravyrozvrh").css("max-width", "250px");
  var sidebarContent = '<div style="white-space: normal; word-break: break-word; font-size: 13px; font-weight: bold;">Rozvrh Enhancer: </div><table> <tbody> <tr> <td> Ze dne: </td> <td> <select size="1" id="dayFrom" style="margin-left: 10px; width: 100px;"> <option>Po</option> <option>Út</option> <option>St</option> <option>Čt</option> <option>Pa</option> </select> </td> </tr> <tr> <td> Na den: </td> <td> <select size="1" id="dayTo" style="margin-left: 10px; width: 100px;"> <option>Po</option> <option>Út</option> <option>St</option> <option>Čt</option> <option>Pa</option> </select> </td> </tr> <tr style="font-weight: bold;"> <td> Přidat: </td> <td id="add"> nic </td> </tr> <tr style="font-weight: bold;"> <td> Odebrat: </td> <td id="remove"> nic </td> </tr></tbody> </table> <div style="white-space: normal; word-break: break-word;">Zkontrolujte si své věci, je možné že bylo suplování minulý pátek, tzn. že suplované předměty z pátku nebudou započítány.</div>';
  var dayFrom = "";
  var dayTo = "";

  if ($("#cphmain_roundrozvrh_HTC_labelnadpisrozvrh_0") !== undefined && $("#cphmain_roundrozvrh_HTC_labelnadpisrozvrh_0").html() === "Rozvrh") {
    $("#cphmain_pravyrozvrh > div > div > div > div").append(sidebarContent);
    dayFrom = $("#dayFrom").val();
    dayTo = $("#dayTo").val();

    $("#dayFrom, #dayTo").change(function() {
      dayFrom = $("#dayFrom").val();
      dayTo = $("#dayTo").val();

      var fromArr = [];
      var toArr = [];


      $.each($(".r_den:contains(" + dayFrom + ")").parent().parent().parent().find(".r_rrw > .r_bunka > .r_predm") /*Select all subjects from that day*/, function(index, item){
        item = $(item);
        var value;

        //Because Bakalaři system is a bit retarded, there might be a span instead of text...
        value = ((item.find("span").length > 0) ? item.find("span").html().trim() : item.html().trim());

        //remove duplicates 
        if (fromArr.indexOf(value) == -1) fromArr.push(value); 

      });

      //and once again but with dayTo ↓
      $.each($(".r_den:contains(" + dayTo + ")").parent().parent().parent().find(".r_rrw > .r_bunka > .r_predm") /*Select all subjects from that day*/, function(index, item){
        item = $(item);
        var value = "";

        value = ((item.find("span").length > 0) ? item.find("span").html().trim() : item.html().trim());

        if (toArr.indexOf(value) == -1) toArr.push(value);
      });

      var add = [];
      var remove = [];

      //We have to do this separately, because of different lengths
      $.each(toArr, function(index, item){
        if(fromArr.indexOf(item) === -1){
          add.push(item);
        }
      });  

      $.each(fromArr, function(index, item){
        if(toArr.indexOf(item) === -1){
          remove.push(item);
        }
      });  

      var addString = ((add.length > 0) ? add.join(", ") : "nic");
      var removeString = ((remove.length > 0) ? remove.join(", ") : "nic");

      $("#remove").html(removeString);
      $("#add").html(addString);
    });
  }
})();