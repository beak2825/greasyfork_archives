// ==UserScript==
// @name         Pw+ by Sios
// @namespace    https://www.politicsandwar.com
// @version      1.0.2
// @description  Adds useful utility functions to Politics and War
// @author       Sios
// @match        https://politicsandwar.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25204/Pw%2B%20by%20Sios.user.js
// @updateURL https://update.greasyfork.org/scripts/25204/Pw%2B%20by%20Sios.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function notFound(selector, isRegex) {}
    var ownNation = {}; // Contains information about user's nations
    var nation = {}; // Contains information about the nation user is viewing; false by default
    //------------------------------------------------- Ajax stuff -------------------------------------------------//
    var ajaxDoneCallbacks = [];
    var completedAjax = [];

    function doAjaxCallbacks(doneAjax){
      for(var i=0;i<ajaxDoneCallbacks[doneAjax].length;i++){
        ajaxDoneCallbacks[doneAjax][i]();
      }
    }
    function onAjaxDone(doneAjax){
      if (!ajaxDoneCallbacks[doneAjax]) {
          return; // Because there are no callbacks for this ajax
      }
      completedAjax[doneAjax] = true;
      doAjaxCallbacks(doneAjax);
    }
    function addAjaxCallback(doneAjax,callback,alreadyDoneCheck){
      alreadyDoneCheck = alreadyDoneCheck || true;
      if (!ajaxDoneCallbacks[doneAjax]) {
        ajaxDoneCallbacks[doneAjax] = [];
      }
      if (alreadyDoneCheck && completedAjax[doneAjax]){
        callback();
        return;
      }
      ajaxDoneCallbacks[doneAjax].push(callback);
    }
    //------------------------------------------------- Ajax stuff END -------------------------------------------------//
    var splitParams = [];
    splitParams = window.location.href.match(/^.*\?(.*)$/i) ? window.location.href.match(/^.*\?(.*)$/i)[1].match(/(\w+)=(\w+)?/ig) : false;
    var uriParams = false;
    if(splitParams) {
      uriParams = [];
      for (var i = 0; i < splitParams.length; i++) {
        uriParams[splitParams[i].split(/=/)[0]] = splitParams[i].split(/=/)[1];
      }
    }

    if(/^(https:\/\/politicsandwar\.com\/nation\/id=)\d*$/i.test($("div#leftcolumn span:contains('Nation')").parent().find("li:contains('View')").parent().attr("href"))){
      var nationId = /^(https:\/\/politicsandwar\.com\/nation\/id=)(\d*)$/i.exec($("div#leftcolumn span:contains('Nation')").parent().find("li:contains('View')").parent().attr("href"));
      nationId = nationId[2];
      $.get("https://politicsandwar.com/api/nation/id="+nationId,function(data) {
        $.each(data,function(i,v) {
          ownNation[i] = v;
        });
        onAjaxDone("getOwnNationInfo");
      },"json");
    } else {notFound("div#leftcolumn a#nation");}

    var headerFunctions = {
      '^.*(View nation).*$': function() {
        var nationId = /^(https:\/\/politicsandwar\.com\/nation\/id=)(\d*)$/i.exec(window.location.href);
        nationId = nationId[2];
        if (ownNation.nationid == nationId) {
          nation = ownNation;
          onAjaxDone("getNationInfo");
        } else {
          $.get("https://politicsandwar.com/api/nation/id="+nationId,function(data) {
            $.each(data,function(i,v) {
              nation[i] = v;
            });
            onAjaxDone("getNationInfo");
          },"json");
        }
      },
      '^.*(Nations).*$': function(){
        if (!uriParams) {return;}
        // !!WARNING!! Messy code ahead !!WARNING!!
       function refreshNationList(stateChange){
         var nations = [];
         stateChange = stateChange || false;
         var index = 0;
         var inactiveText = 'Active more than a week ago';

         $('table.nationtable tr').each(function(){
           nations[index] = [];
           if($(this).find('td:eq(0)').text() === '') {return;}

           if($(this).find("td:eq(1) a[href^='https://politicsandwar.com/nation/id=']")) {
             nations[index].href = $(this).find("td:eq(1) a[href^='https://politicsandwar.com/nation/id=']").attr("href");
             nations[index].Nation = $(this).find("td:eq(1) a[href^='https://politicsandwar.com/nation/id=']").clone().children().remove().end().text();
             nations[index].Leader = $.trim($(this).find("td:eq(1) a[href^='https://politicsandwar.com/nation/id=']").parent().clone().children().remove().end().text());
           } else {notFound("tr td:eq(1) a[href^='https://politicsandwar.com/nation/id=']");}
           if($(this).find("td:eq(2) span[title^='Active']")){
             var statusText = $(this).find("td:eq(2) span[title^='Active']").attr("title");
             if (statusText === inactiveText) {
               nations[index].isActive = false;
             } else {
               nations[index].isActive = true;
             }
           } else {notFound("tr td:eq(2) span[style^='color:']");}
           if($(this).find("td:eq(3)")){
             var alliance = $.trim($(this).find("td:eq(3)").html());
             if (alliance === "None") {
               nations[index].isAA = false;
             } else {
               nations[index].isAA = true;
             }
           } else {notFound("tr td:eq(3)");}
           if($(this).find("td:eq(4) img[src^='https://politicsandwar.com/img/colors/']")){
             var nationColor = $.trim($(this).find("td:eq(4) img[src^='https://politicsandwar.com/img/colors/']").attr('alt'));
             if (nationColor === 'beige') {
               nations[index].isBeige = true;
             } else {
               nations[index].isBeige = false;
             }
           } else {notFound("tr td:eq(4) img[src^='https://politicsandwar.com/img/colors/']");}
           index++;
         });

         $.each(nations,function(i,nation){
           if (buttonData.active[0] && nation.isBeige) {
             $("table.nationtable").find("a[href^='"+nation.href+"']").parent().parent().remove();
           }
           if (buttonData.active[1] && nation.isActive) {
             $("table.nationtable").find("a[href^='"+nation.href+"']").parent().parent().remove();
           }
           if (buttonData.active[2] && nation.isAA) {
             $("table.nationtable").find("a[href^='"+nation.href+"']").parent().parent().remove();
           }
         });
         if ((!buttonData.active[0] || !buttonData.active[1] || !buttonData.active[2]) && stateChange) {
           $.get("/index.php?id="+uriParams.id+"&keyword="+uriParams.keyword+"&cat="+uriParams.cat+"&ob="+uriParams.ob+"&od="+uriParams.od+"&maximum="+uriParams.maximum+"&minimum="+uriParams.minimum+"&search="+uriParams.search,function(data){
             $("table.nationtable").replaceWith($(data).find("table.nationtable"));
             refreshNationList(false);
           },"html");
         }
       }

       var configButton = '<button style="border: 1px solid white;padding: 10px; margin: 0px 5px; background-color:green; color:white;font-weight: bold;"></button>';
       var buttonData = [];
       buttonData.active = []; // Stores the state of buttons; true = hidden, false = shown
       buttonData.text = ["Beige nations","Active nations","AA nations"];
       function onMouseIn(e,button,index){
          e.preventDefault();
         button.css({'text-decoration':'none','background-color':'white','color':buttonData.active[index] ? 'red' : 'green','border':'1px dashed black'});
       }
       function onMouseOut(e,button,index){
         e.preventDefault();
         button.css(
           {'background-color':buttonData.active[index] ? 'red' : 'green','color':'white','font-weight':'bold','border':'1px solid white'}
         );
       }
      function onClick(e,button,index) {
         e.preventDefault();
         if (buttonData.active[index]) {
           buttonData.active[index] = false;
           button.css("color","green");
           button.html(buttonData.text[index] + " shown");
         } else {
           buttonData.active[index] = true;
           button.css("color","red");
           button.html(buttonData.text[index] + " hidden");
         }
         refreshNationList(true);
       }
       function onHoverStart(index){
         return function(e){
           onMouseIn(e,$(this),index);
         };
       }
       function onHoverEnd(index){
         return function(e){
           onMouseOut(e,$(this),index);
         };
       }
       function onMouseButtonDown(index){
         return function(e){
           onClick(e,$(this),index);
         };
       }
       if ($('form[action="https://politicsandwar.com/index.php"][method="get"] p:first').length) {
         $('<p style="text-align:center"></p>').insertAfter($('form[action="https://politicsandwar.com/index.php"][method="get"] p:eq(1)'));
         for (var btn_index = 0; btn_index < 3; btn_index++) {
           var btn = $($('form[action="https://politicsandwar.com/index.php"][method="get"] p:eq(2)')).append(configButton);
           btn.find("button:eq("+btn_index+")")
           .hover(onHoverStart(btn_index),onHoverEnd(btn_index))
           .click(onMouseButtonDown(btn_index))
           .html(buttonData.text[btn_index] + " shown");
           buttonData.active[btn_index] = false;
           if (uriParams.cat == "war_range") {
             buttonData.active[btn_index] = true;
             btn.find("button:eq("+btn_index+")").css("background-color","red").html(buttonData.text[btn_index] + " hidden");
           }
         }
         refreshNationList(); // Refresh nation list to hide "non-attackable" nations on pageLoad
       } else {notFound("form[action='https://www.politicsandwar.com/index.php'][method='get'] p:first");}
      }
    };
    if($("div .columnheader")){
      var columnHeader = $("div.columnheader").html();
      for (var regex in headerFunctions) {
        if (headerFunctions.hasOwnProperty(regex)) {
          if (new RegExp(regex,'im').test(columnHeader)) {
            headerFunctions[regex]();
          } else {notFound(regex,true);}
        }
      }
    } else {notFound("div .columnHeader");}
    if (nation.length > 0){

    }
    addAjaxCallback("getOwnNationInfo",function(){
    });
})();