// ==UserScript==
// @name         F1- ID display
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try it!
// @author       Antony.kao
// @include       *MarketManagement/*
// @include       *://gmm*.gmm88.com/*
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436084/F1-%20ID%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/436084/F1-%20ID%20display.meta.js
// ==/UserScript==

(function() {
    if(UrlContains("MarketManagement")){
        //ShowMarketlineId();
    }
$("body").keydown(function(e){
         //now we caught the key code, yabadabadoo!!
         var keyCode = e.keyCode || e.which;
         if(keyCode == 112) // F1
         {
             //well you need keep on mind that your browser use some keys
             //to call some function, so we'll prevent this
             e.preventDefault();

             if($("[name='youyou']").length >0)
             {
                 $("[name='youyou']").remove();
                 $("#AllColorCategoryCriteria").attr("style","");
                     $('label[name=newMemberCriteriaLabel]').each(function(i,obj){
                 $(this).text('');
                 });
                 return;
             }

             var SportIds = $("#SportIds");

             // reorder event criteria by id
             $("#EventCriteria").find("li").sort(function (a, b) {
                 return parseInt($(a).find("input")[0].id) - parseInt($(b).find("input")[0].id);
             }).each(function () {
                 var elem = $(this);
                 elem.remove();
                 $(elem).appendTo("#EventCriteria ul");
             });

             $("#EventCriteriaSubmit").attr("disabled", false);

             //$("#EventCriteriaSubmit").prop('disabled', false);

             //your keyCode contains the key code, F1 to F12
             //is among 112 and 123. Just it.
             //console.log(keyCode);
             var pauseDiv = $(".pause").filter(function() {
                return $(this).attr("actionsrc") === "MarketLineStatusControl.js" ;
            });
            pauseDiv.each(function(i, obj) {
                $(this).parent().prepend("<span name='youyou' style = 'background:#80ced6'>"+$(obj).attr("id").match(/\d+/)[0]+"</span>");
            });

            var oddsdiv = $("tr:not([isalgorow])").find("div.odds,div.oddsnonlink").each(function(i, obj) {
                // selection id
                $(this).prepend("<span name='youyou' style = 'background:#d5f4e6'>"+$(obj).attr("id").match(/\d+/)[0]+" </span>");

                // bettype id
                $(obj).find("a").each(function(yi, yobj){

                    var $td = $(obj).parent();
                    var $th = GetThByTd($td);
                    if(!$th.html() || $th.html().indexOf("BT") > 0){ return; }
                    $th.append("<span name='youyou' style = 'color:#1e5469'>(BT:"+$(yobj).attr("bettypeid").match(/\d+/)[0]+")</span>");
                 });

                // markettype id
                $(obj).find("a").each(function(yi, yobj){
                    if($(yobj).attr("mtid")){
                       //$(yobj).append("<span name='youyou' style = 'color:red'>MT:"+$(yobj).attr("mtid").match(/\d+/)[0]+" </span>");
                    }
                });
            });

            // AdditionalPoint
            //$("div[actionsrc='AdditionalPoint.js']").prepend("<span name='youyou' style = 'background:#ffef96'>FT</span>");
            $("div[actionsrc='AdditionalPoint.js']").each(function(i, obj) {
                if(SportIds == 1){
                    var inx = 1;
                    $(this).parent().find("div[actionsrc='AdditionalPoint.js']").each(function(yi, yobj){
                        var text = "FT";
                        if(inx == 2){ text = "HT"; }
                        if(!$(yobj).html() || $(yobj).html().indexOf("youyou") > 0){ return; }
                        $(yobj).prepend("<span name='youyou' style = 'background:#ffef96'>"+text+"</span>");
                        inx++;
                    });
                }


            });

            // 將 parent id顯示
//              $('[id^=hparentEventId]').each(function(i,obj){
//                  if($(this).val() > 0){
//                      $(this).parent().prepend("<span name='youyou' style = 'background:#ffef96'>"+$(this).val()+" </span>");
//                  }
//              }); // eea29a

             $('[id^=hparentEventId]').each(function(i,obj){
                 if($(this).val() > 0){
                     $(this).parent().parent().find("td[cellname='Participant']").prepend("<div name='youyou' style = 'background:#ffef96;text-align:left'>"+$(this).val()+" </div>");
                 }
             });

             // 顯示ColorName
             $('label[name=colorCriteriaLabel]').each(function(i,obj){
                 $("#MemberAccountCategoryCriteria").attr("style","width:1000px");
                 $(this).parent().append("<label name='youyou' style = 'background:#ffef96;text-align:left;display: inline-block'>"+$(this).attr("title")+" </label>");
             });
             // 顯示NewMemberColorId
             $('label[name=newMemberCriteriaLabel]').each(function(i,obj){
                 $(this).text($(this).attr("for"));
             });

             // 顯示Participant ID
             $("td[cellname='Participant']").each(function(i,obj){
                 $(obj).find("div").each(function(ii, objj){
                     if($(objj).attr("id")){
                         var actionsrc = $(objj).attr("actionsrc");
                         var filterlist = ["MarketlineCounter.js","Unhide.js","CashOut.js"];
                         if(filterlist.includes(actionsrc)){ return; }

                         $(objj).prepend("<span name='youyou' style = 'background:#DDEFF4'>"+$(objj).attr("id").match(/\d+/)[0]+" </span>");
                     }
                 });
             });

             // 將ML-LV顯示
             $("tr:[ml-lvl]not([isalgorow])").each(function(i,obj){
                 var ml_level = $(this).attr("ml-lvl");
                 if(ml_level == 1){
                     $(this).children('td:first').append("<span name='youyou' style = 'background:#E0E0E0'>ml-lvl:"+$(this).attr("ml-lvl")+" </span>");
                 }
                 else
                 {
                     $(this).children('td:first').append("<span name='youyou' style = 'background:#E1C4C4'>ml-lvl:"+$(this).attr("ml-lvl")+" </span>");
                 }
             }); //

             // PeriodTypeId
            var PidInput = $("input[id^='pid']").each(function(i, obj) {
                $(this).parent().prepend("<span name='youyou'>("+$(this).val()+") </span>");
            });

         }
         //if(keyCode == 113) // F2
         //{
         //    e.preventDefault();
         //    $("[name='youyou']").remove();
         //}
    });
    // Your code here...
})();

function GetThByTd(tdNode){

   var idx = tdNode.index(); // get td index
   var td_current_idx = 1;
   tdNode.parent().find("td").each(function(i,obj){
       if(i < idx)
       {
          td_current_idx += $(obj).attr("colspan") || 1;
       }
   });

   var th_colSpan_acc = 0;   // accumulator
   var thArray = [];
   $('#event_table > thead > tr > th').each(function(){
       thArray.push($(this))
   });

   // iterate all th cells and add-up their colSpan value
   for( var i=0; i < thArray.length; i++ ){
      th_colSpan_acc += thArray[i].attr("colspan") || 1;
      if( th_colSpan_acc >= td_current_idx) {
          //console.log("td_current_idx",td_current_idx);
          break;
      }
   }
   //console.log("td_current_idx",td_current_idx);
   //console.log("th_colSpan_acc",th_colSpan_acc);

   return thArray[i];
}

//用來顯示MMPage的MarketlineId
function ShowMarketlineId(){
    $('.search-panel >ul,#top-panel > div > ul').prepend('<li><input type="button" id="ShowAllMarketLine" value="TEST" class="btn_refresh" ></li>');
    $( "#ShowAllMarketLine" ).click(function() {
        //將marketline id加到html中
            var pauseDiv = $(".pause").filter(function() {
                return $(this).attr("actionsrc") === "MarketLineStatusControl.js" ;
            });
            pauseDiv.each(function(i, obj) {
                $(this).parent().prepend("<span style = 'background:#c9e1f6'>"+$(obj).attr("id").match(/\d+/)[0]+"</span>");
            });
            //將selection id加到html中
            var oddsdiv = $("tr:not([isalgorow])").find("div.odds,div.oddsnonlink").each(function(i, obj) {
                $(this).prepend("<span style = 'background:#fe98b0'>"+$(obj).attr("id").match(/\d+/)[0]+" </span>");
            });
    });//end of ShowAllMarketLine click
}

function UrlContains(urlfragment){
    return document.URL.indexOf(urlfragment) != -1;
}