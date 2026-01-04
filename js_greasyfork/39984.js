// ==UserScript==
// @name         MyFigureCollection: instant tooltip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Override tooltip function
// @author       Rafael Vuijk
// @match        http*://myfigurecollection.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39984/MyFigureCollection%3A%20instant%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/39984/MyFigureCollection%3A%20instant%20tooltip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tooltip_index = null;  // added to prevent duplicate tooltips

    $(".tbx-tooltip").each(function() {
        var $this=$(this), _move=function(e){
            if(!TB.tooltip){return false;}
            TB.tooltip.show().css({
                top:e.pageY>TB.window.height()/2+TB.window.scrollTop()?e.pageY-TB.tooltip.innerHeight()-10:e.pageY+20,left:e.pageX>TB.window.width()/2?e.pageX-TB.tooltip.innerWidth()-10:e.pageX+20
            });
        };
        $this.off(".tooltip")
        .on("mouseenter.tooltip",function(e) {
            _resetTooltip();
            var vars = _getVars($this).split(":"), index = vars[0]+":"+vars[1];
            tooltip_index = index;
            if (!(index in TB.cache.tooltip)) {
                TB.timer.tooltip = setTimeout(function(){
                   if (tooltip_index == index) {   // added extra check
                       $.post(jroot+"/actions.php","commit=loadTooltip&objectId="+vars[1]+"&objectType="+vars[0],function(j){
                           if(TB.timer.tooltip){
                               if (tooltip_index == index) {   // added extra check
                                   TB.cache.tooltip[index]=$("<div></div>").addClass("tooltip").appendTo("#content").html(j.htmlValues.TOOLTIP);
                                   TB.tooltip=TB.cache.tooltip[index]; _move(e);
                               }
                           }
                       }, "json");
                   }
                },0);
            } else {
               TB.tooltip=TB.cache.tooltip[index]; _move(e);
            }
        })
        .on("mousemove.tooltip",function(e){
            _move(e);
        })
        .on("mouseleave.tooltip",function(){
            _resetTooltip();
        });
    });

})();