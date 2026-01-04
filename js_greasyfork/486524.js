// ==UserScript==
// @name copyTerminal
// @namespace InGame
// @author RedLine
// @date 01/02/2024
// @version 1.1
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @compat Firefox, Chrome
// @grant GM_setClipboard
// @grant GM_addStyle
// @require https://update.greasyfork.org/scripts/486572/1322825/jqueryUI%20-%20datepicker%20%20keycode%20only.js
// @description Copie rapidement le contenu d'une page du TP (STV, Cryo, Historiques des entreprises et OI)
// @downloadURL https://update.greasyfork.org/scripts/486524/copyTerminal.user.js
// @updateURL https://update.greasyfork.org/scripts/486524/copyTerminal.meta.js
// ==/UserScript==
// 1.1 Correctif de l'impossibilité de s'équiper si on s'est pas déséquipés avant : Conflit dû à JqueryUI dans sa version complète.

GM_addStyle(`
            #downloadCurrentHistoryContainer {
              display: flex;
            }
        
            #downloadCurrentHistory {
              margin: auto;
              margin-top: 10px;
              margin-bottom: 15px;
              width: 25%;
              text-transform: uppercase;
            }
        
            #historyCalendarForm {
              width: 100%;
            }
        
            #historyCalendarInput {
              margin: auto;
            }
        
            #calendarButton {
              margin: auto;
            }
        
            #companyId {
              display:none
            }
        
            .ui-widget-header {
              background: linear-gradient(to bottom,#00839d 0,#002c3e 100%)
            }
        
            .ui-widget-content {
              border: 1px solid #ddd;
              background: #002c3e;
              color: #d2c556;
              box-shadow: inset 0 0 25px 10px #006974;
            }
        
            .ui-state-default, .ui-widget-content .ui-state-default {
              border: 0px solid #ccc;
              background: #030607 50% 50% repeat-x;
              background-color: rgb(2, 11, 15);
              background-position-x: 50%;
              background-position-y: 50%;
              background-repeat: repeat-x;
              background-attachment: scroll;
              background-image: none;
              background-size: auto;
              background-origin: padding-box;
              background-clip: border-box;
              font-weight: 700;
              color: #1c94c4;
              box-shadow: inset 0 0 5px 1px #006974;
            }
        
          .ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight {
            border: 1px solid #fed22f;
            background: #ffe45c 50% top repeat-x;
            color: #363636;
          }
        
        .ui-datepicker select.ui-datepicker-month, .ui-datepicker select.ui-datepicker-year {
          width: 45%;
          color: #d2c556;
        }
        
          `);


var datePicker = new Date();
var monthPicker = datePicker.getMonth() + 1;
var dayPicker = datePicker.getDate();

var datePickerOutput = (('' + dayPicker).length < 2 ? '0' : '') + dayPicker + '/' +
  (('' + monthPicker).length < 2 ? '0' : '') + monthPicker + '/' +
  datePicker.getFullYear();


$(document).ready(function () {
  $(document).ajaxSuccess(function (e, xhr, opt) {
    if (opt.url.includes("/CrystalHistory")) {

      if ($("#datepicker").length == 0) {
        $("#db_historique_cristaux").append('<form id="historyCalendarForm" class="longTextInput"/>');
        $("#historyCalendarForm").append('<div id="historyCalendarInput" class="mediumTextInput"></div>');
        $("#historyCalendarInput").append('<div class="left"></div>');
        $("#historyCalendarInput").append('<div class="right"></div>');
        $("#historyCalendarInput").append('<input type="text" id="datepicker" class="variableTextInput" />');
        $("#datepicker").val(datePickerOutput)
        function generateCalendar() {
          $("#datepicker").datepicker({ changeMonth: true, changeYear: true, minDate: new Date(2010, 10, 22) }); $.datepicker.setDefaults($.datepicker.regional["fr"]);
        }


        function generateDateTimestamp() {

          var selectedDate = $("#datepicker").val();
          var formatDateToShittyUSFormat = selectedDate.split("/");
          var formattedDateInShittyUSFormat = formatDateToShittyUSFormat[1] + "/" + formatDateToShittyUSFormat[0] + "/" + formatDateToShittyUSFormat[2];
          generatedTimestamp = (new Date(formattedDateInShittyUSFormat).getTime()) / 1000;
          return generatedTimestamp
        }


        function generateHistoryURL() {
          var generatedDate = generateDateTimestamp()
          var historyURL = 'Main/DataBox/default=CrystalHistory&date=' + generatedDate
          return historyURL;
        }
        generateCalendar();

        var $calendarButton = $("#historyCalendarInput").append('<div class="mediumValidInput" id="calendarButton"></div>');
        $calendarButton.click(function () { engine.regenerateDataBox(generateHistoryURL()) });

      }


      var $button = $("#db_historique_cristaux").append('<div id="downloadCurrentHistoryContainer">');
      $("#downloadCurrentHistoryContainer").append('<button id="downloadCurrentHistory" class="btnTxt">Copier</button>');
      $button.click(function () {
        var copyText = $("#entreprise_historique").children().first().text().replace(/(\r\n|\n|\r|\t|")/gm, "").replace(/\s+/g, " ").replace(/Cr\. /gm, "Cr.\n").replace(/CF\ !\ /gm, "CF\!\n");
        GM_setClipboard(copyText);
      });


    }

    if (opt.url.includes("/ListeCryoFull")) {
      var $button = $("#db_liste_cryo").append('<button id="downloadCurrentHistory" class="btnTxt">Copier</button>');
      $button.click(function () {
        var copyText = $("#imperial_data").text().replace(/(\r\n|\n|\r|\t|")/gm, "").replace(/\s+/g, " ").replace(/\[/g, "\r\n[");
        GM_setClipboard(copyText);
      });
    }

    if (opt.url.includes("/DataBox/default=CompanyHistory")) {

      if ($("#datepicker").length == 0) {
        $("#db_historique_entreprise").append('<form id="historyCalendarForm" class="longTextInput"/>');
        $("#historyCalendarForm").append('<div id="historyCalendarInput" class="mediumTextInput"></div>');
        $("#historyCalendarInput").append('<div class="left"></div>');
        $("#historyCalendarInput").append('<div class="right"></div>');
        $("#historyCalendarInput").append('<input type="text" id="datepicker" class="variableTextInput" />');
        $("#datepicker").val(datePickerOutput)
        function generateCalendar() {
          $("#datepicker").datepicker({ changeMonth: true, changeYear: true, minDate: new Date(2010, 10, 22) }); $.datepicker.setDefaults($.datepicker.regional["fr"]);
        }


        function generateDateTimestamp() {

          var selectedDate = $("#datepicker").val();
          var formatDateToShittyUSFormat = selectedDate.split("/");
          var formattedDateInShittyUSFormat = formatDateToShittyUSFormat[1] + "/" + formatDateToShittyUSFormat[0] + "/" + formatDateToShittyUSFormat[2];
          generatedTimestamp = (new Date(formattedDateInShittyUSFormat).getTime()) / 1000;
          return generatedTimestamp
        }


        function generateHistoryURL() {
          var companyId = (opt.url).split("&")[1].split("=")[1];
          if ($("#companyId").length == 0) {
            $("#db_historique_entreprise").append('<div id=companyId>' + companyId + '</div>');
          }
          else {
            $("#companyId").text(companyId)
          }
          var generatedDate = generateDateTimestamp()
          var historyURL = 'Main/DataBox/default=CompanyHistory&company=' + companyId + '&date=' + generatedDate
          return historyURL;
        }
        generateCalendar();

        var $calendarButton = $("#historyCalendarInput").append('<div class="mediumValidInput" id="calendarButton"></div>');
        $calendarButton.click(function () { engine.regenerateDataBox(generateHistoryURL()) });

      }

      if ($("#downloadCurrentHistory").length == 0) {
        $("#db_historique_entreprise").append('<div id="downloadCurrentHistoryContainer">');
        var $button = $("#downloadCurrentHistoryContainer").append('<button id="downloadCurrentHistory" class="btnTxt">Copier</button>');

        $button.click(function () {
          var copyText = $("#entreprise_historique").children().eq(1).text().replace(/(\r|\t|")/gm, "").replace(/\s+/g, " ").replace(/Cr/gm, "Cr.\n").replace(/\ \[/gm, "\n [").replace(/(^\n)/gm, "").replace(/^\ /gm, "").replace(/\ $/gm, "\n");
          GM_setClipboard(copyText);
        });
      }

    }

    if (opt.url.includes("/SeeImperialData")) {
      $("#downloadCurrentHistoryContainer").remove()
      $("#historyCalendarForm").remove()
      $("#companyId").remove()
    }

    else {
      return 0
    }

  });
});