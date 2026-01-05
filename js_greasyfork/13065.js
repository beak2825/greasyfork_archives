// ==UserScript==
// @name         Počítání váženého průměru bakaláři
// @namespace    none
// @version      2
// @description  Počítání váženého průměru známek bakaláři
// @author       Tomáš Falešník (2016)
// @match        http://znamky.zsunesco.cz/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/13065/Po%C4%8D%C3%ADt%C3%A1n%C3%AD%20v%C3%A1%C5%BEen%C3%A9ho%20pr%C5%AFm%C4%9Bru%20bakal%C3%A1%C5%99i.user.js
// @updateURL https://update.greasyfork.org/scripts/13065/Po%C4%8D%C3%ADt%C3%A1n%C3%AD%20v%C3%A1%C5%BEen%C3%A9ho%20pr%C5%AFm%C4%9Bru%20bakal%C3%A1%C5%99i.meta.js
// ==/UserScript==

//Prosím upravte @match na vaši školu, jinak to nebude fungovat..
//Př: http://bakalari.nejaka.skola.cz/* - Ta hvězdička za lomítkem tam musí být.

(function() {
  'use strict';

/* not used
  var WEIGHT_MAP = {
    'D': 6,
    'M': 4,
    'F': 3,
    'T': 2,
    'C': 10,
    'O': 3,
    'P': 6,
    'L': 4,
    'A': 1,
    'U': 6
  };
*/

  var MARKS_TO_SKIP = ['A', 'X', '?', 'N'];

  var roundTo = 2;

  if($("#cphmain_roundprub_HTC_labelnadpisprub_0") !== undefined && $("#cphmain_roundprub_HTC_labelnadpisprub_0").html().indexOf("Průběžná klasifikace") !== -1) {
    $("#cphmain_pravyprub > div > div > div > div").append('<div style="white-space: normal; word-break: break-word; font-size: 13px; font-weight: bold;"> Počítání průměru: </div> <table> <tbody> <tr> <td>Zaokrouhlit na: </td> <td><input type="number" min="0" value="2" id="pz_round"> des. míst</td> </tr> </tbody> </table>');
    $("#pz_round").change(function(e) {
      roundTo = $("#pz_round").val();
      count();
    });
    count();
  }

  function count() {
    var subjectWraps = $(".nazevprdiv");
    var markWraps = $(".detznamka");
    var weightWraps = $(".typ");

    $(".pz_prumer").remove();


    for(var i = 0; subjectWraps.length > i; i++) {
      var weightedMarks = 0.0;
      var summedWeights = 0.0;

      var marks = $(markWraps[i]).find("td");
      var weights = $(weightWraps[i]).find("td");
      var subjectName = $(subjectWraps[i]).find("a")[0].innerHTML;

      for(var o = 0; marks.length > o; o++) {
        var weightsTitle = weights[o].title;
        var crrWeight = weightsTitle.substring(weightsTitle.length - 1, weightsTitle.length);
        var crrMark = marks[o].innerHTML;

        // Badly specified weight, skip it
        if (crrWeight === undefined) continue;

        if(MARKS_TO_SKIP.indexOf(crrMark) === -1) {
          weightedMarks += parseInt(crrWeight) * parseInt(crrMark);
          summedWeights += parseInt(crrWeight);
        }
      }
      var result = Math.round((parseFloat(weightedMarks) / parseFloat(summedWeights)) * Math.pow(10, roundTo)) / Math.pow(10, roundTo);
      $(subjectWraps[i]).append('<div class="nazevpr pz_prumer" style="text-align:left;font-size:9pt;text-decoration:none;">' + result + '</div>');
    }
  }
})();
