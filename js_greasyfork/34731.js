// ==UserScript==
// @name         Adminer Rotate
// @namespace    thetomcz.adminer.rotate
// @version      0.7.2
// @description  Rotate Adminer Tables
// @author       TheTomCZ <hejl.tomas@gmail.com>
// @include        http://db.loc*
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @homepage   https://greasyfork.org/en/scripts/34731-adminer-rotate
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34731/Adminer%20Rotate.user.js
// @updateURL https://update.greasyfork.org/scripts/34731/Adminer%20Rotate.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.AdmR = {
    columns: [],
    columnId: 0,
    $table: null,
    rotated: false,
    selector: "#table, #content > div > table",

    init: function(){
      AdmR.$table = $(AdmR.selector);
        console.log(AdmR.$table.length, AdmR.$table)
      if(AdmR.$table.length!=1){
        return;
      }

      $("body").on("keydown", function(e){
        console.log("fire", e.keyCode, e.ctrlKey, e.shiftKey);
        if (e.keyCode === 82 && e.ctrlKey && e.shiftKey) { //press ctrl+shift+r
          e.preventDefault();
          AdmR.rotate();
        }
      });
      $("body").append("<style>.rotatedMultiColumn td, .rotatedMultiColumn th{max-width:300px; overflow: hidden} </style>");
      if(AdmR.$table.find('tr').length <= 3){
        AdmR.rotate();
      }
    },

    rotate: function(){
      AdmR.$table = $(AdmR.selector);
      AdmR.grabTable();
      AdmR.rotateTable();
    },

    grabTable: function(){
      AdmR.columns = [];
      AdmR.columnId = 0;

      AdmR.$table.find("tr").each(function(){
        $(this).find("td, th").each(function(){
          if(!AdmR.columns[AdmR.columnId]){
            AdmR.columns[AdmR.columnId] = [];
          }
          AdmR.columns[AdmR.columnId].push($(this));
        });
        AdmR.columnId++;
      });
    },

    rotateTable: function(){
      AdmR.rotated = !AdmR.rotated;
      let $newTable = $("<table id='table' cellspacing='0' class='nowrap checkable' onclick='tableClick(event);' ondblclick='tableClick(event, true);' onkeydown='return editingKeydown(event);'>");
      if(AdmR.rotated && AdmR.columns.length>2){
        $newTable.addClass('rotatedMultiColumn');
      }
      let first = true;
      let colCount = AdmR.columns[0].length;
      let target = null;
      for(let i=0; i<colCount; i++){
        if(first){
          let thead = $("<thead>");
          target = thead;
        }
        let $row = $("<tr>");
        for(var c in AdmR.columns){
          let $cell = AdmR.columns[c][i];
          $row.append($cell);
        }
        if(first){
          first = false;
          target.append($row);
          $newTable.append(target);
          target = $("<tbody>");
        }
        else {
          target.append($row);
        }
      }
      $newTable.append(target);
      AdmR.$table.after($newTable);
      AdmR.$table.remove();
    },
  };

  AdmR.init();
})();