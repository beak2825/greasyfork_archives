// ==UserScript==
// @name         Adminer JSONify
// @namespace    thetomcz.adminer.jsonify
// @version      0.3
// @description  pretty print json in adminer columns
// @author       TheTomCZ <hejl.tomas@gmail.com>
// @include        */adminer*
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40005/Adminer%20JSONify.user.js
// @updateURL https://update.greasyfork.org/scripts/40005/Adminer%20JSONify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let AdmJ = {

      idCounter: 0,
      counter: 0,

      init: function(){
        AdmJ.initCss();
        AdmJ.checkCols();
      },

      checkCols: function(){
        $("tbody tr:first td").each(function(){
          if(AdmJ.isJson($(this).text())){
            AdmJ.jsonifyCol(AdmJ.idCounter);
          }
          AdmJ.idCounter++;
        });
      },

      isJson: function(text){
        if(!text || (text.substring(0,1)!='{' && text.substring(0,1)!='[')){
          return false;
        }
        try{
          JSON.parse(text);
          return true;
        } catch(e){
          return false;
        }
      },


      initCss: function(){
        $("head").append("<style>.jsonifyBtn{float: left; cursor: pointer;}.admj.key{font-weight:bold}.admj.boolean{color:darkgreen}.admj.string{color:darkblue}.admj.null{color:#333}.admj.number{color:darkred}</style>");
      },

      jsonifyCol: function(colId){
        $("tr td:nth-child("+(colId+1)+")").each(function(){
          AdmJ.jsonifyCell($(this));
        });
      },

      jsonifyCell: function($cell){
        let json = JSON.parse($cell.text());
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let html = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'admj number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'admj key';
            } else {
              cls = 'admj string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'admj boolean';
          } else if (/null/.test(match)) {
            cls = 'admj null';
          }
        return '<span class="' + cls + '">' + match + '</span>';
        });
        $cell.html(html);
      },
      
    };

  AdmJ.init();
})();