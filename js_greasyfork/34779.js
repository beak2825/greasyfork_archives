// ==UserScript==
// @name         LookML Auto Generated Measures
// @namespace    http://looker.com/
// @version      0.14
// @description  Automatically generate measures from LookML dimensions in Looker
// @author       You
// @match        https://*.looker.com/*.lkml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34779/LookML%20Auto%20Generated%20Measures.user.js
// @updateURL https://update.greasyfork.org/scripts/34779/LookML%20Auto%20Generated%20Measures.meta.js
// ==/UserScript==

function waitForKeyElements(e,t,a,n){var o,r;(o=void 0===n?$(e):$(n).contents().find(e))&&o.length>0?(r=!0,o.each(function(){var e=$(this);e.data("alreadyFound")||!1||(t(e)?r=!1:e.data("alreadyFound",!0))})):r=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),c=l[i];r&&a&&c?(clearInterval(c),delete l[i]):c||(c=setInterval(function(){waitForKeyElements(e,t,a,n)},300),l[i]=c),waitForKeyElements.controlObj=l}

function loadscript() {

    'use strict';
    if ($('#dev-mode-bar').length<1){ return;
    }
    console.log($('.ace-content'));


    String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


function findBackwards(text,lines){
  var endindex;
  var index = lines.length - 1;
  for (; index >= 0; index--) {
      if (lines[index].trim().includes(text)) {
          endindex=index;
          break;
      }
  }
  return endindex;
}


function generatemeasure (dimension,measure,label){

  var s=`  measure: ${label}_${dimension} {
    type: ${measure}
    sql: $\{${dimension}\} ;;
  }`;
  return s;
}


function addMeasure(label,measure,start,lines,editor,dimension,startRow){

     var measureblock=generatemeasure(dimension,measure,label);
     lines.splice(start+1,0,measureblock);
     var newtext=lines.join("\n");
     editor.setValue(newtext);
     editor.gotoLine(startRow);
}


function automeasure(e){
  $('#generated_measures').remove();
  var editor = e.editor;

  var startRow = editor.getCursorPosition().row;
  var text=editor.getValue();
  var lines=text.split("\n");
  var currentline=lines[startRow];
  var isDimension=currentline.includes("dimension");




  if (isDimension){

    var trimmeddim = currentline.replaceAll(" ","");
    var myRegexp = /dimension:(.*?){/g;
    var dimension = myRegexp.exec(trimmeddim)[1];


    var start=findBackwards("########## Generated ##########",lines);
    if (start!=null){
    }
    else{
      start=findBackwards("}",lines);
      lines.splice(start, 0, "");
      lines.splice(start, 0, "########## Generated ##########");
    }

    var div= $('<div id="generated_measures"/>');
    var buttondiv=$('<div  style="padding-top: 1px;padding-left: 10px;"/>');

    var measures=[
      {measure:"sum", label:"total", text:"Total"},
      {measure:"average", label:"average", text:"Average"},
      {measure:"count_distinct", label:"unique", text:"Uniques"}
    ];

    for (var m in measures) {
        var m2=measures[m]["measure"];
        var mtext=measures[m]["text"];
        var m3=measures[m];
      //var li=$('<div/>');

      var a=$('<a/>', {
          class: "btn btn-default btn-sm btn-fieldpicker active",
          text: `${mtext}`,
          style:"margin-left:3px; width:30%",
          id: `btn_${m2}`,
          click: function (e) { var targ=$(e.target);
            addMeasure(targ.attr("label"),targ.attr("measure"),start,lines,editor,dimension,startRow); }
      });
      a.attr({"label":m3["label"],"measure":m3["measure"]});
      //li.append(a);

      buttondiv.append(a);
    }
    var form=$('<form id="custom_measure" style="margin-top:5px"/>')
    var sel=$('<select style="width:60%; margin-left:10px; display:inline-block" class="select clause-type-select form-control ng-pristine ng-valid ng-not-empty ng-touched" id="custom_measure_sel"/>')
    var othermeasures=["average_distinct","count_distinct","date","list","max","median","median_distinct","min","number","percent_of_previous","percent_of_total","percentile","percentile_distinct","running_total","string","sum","sum_distinct"]
    for (var m in othermeasures){
      var mname=othermeasures[m]
      var opt=$(`<option value="${mname}">${mname}</option>`)
      sel.append(opt)
    }
    form.append(sel)
    var button=$('<span/>',{
      id:"custom_measure_submit",
      class:"btn btn-default btn-sm btn-info active",
      style:"width:25%; background-color:#87b9dd; border-color:#73add7",
      text:"Submit",
      click:function(e) {
        var val=$("#custom_measure_sel").val();
        addMeasure(val,val,start,lines,editor,dimension,startRow)
        //return false;
      }
    })
    form.append(button)



    div.append(buttondiv);
    div.append(form);
    $('.lookml-suggestion-pane .title').after(div);




//    measure=generatemeasure(dimension,"average")
//    lines.splice(start+1,0,measure)
//    newtext=lines.join("\n")
//    editor.setValue(newtext)
//    editor.gotoLine(startRow)
  }

}


var editor = ace.edit($(".editor-wrapper")[0]);
editor.on("click", automeasure);

//console.log(startRow)
//lines =editor.session.getLines(startRow,startRow+20)
//console.log(lines)
//editor.insert("dimension: cool{}")

    // Your code here...
};


waitForKeyElements('.ace_content',loadscript);
