// ==UserScript==
// @name ffLogs2Xivanalysis
// @version 1.2
// @description open ffxiv xivanalysis
// @match https://*.fflogs.com/reports/*
// @run-at document-idle
// @namespace com.ffxiv.police
// @downloadURL https://update.greasyfork.org/scripts/447422/ffLogs2Xivanalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/447422/ffLogs2Xivanalysis.meta.js
// ==/UserScript==
(function() {
    var openPolice = function(){
        var r = new RegExp(`^http.://.*fflogs.com/reports/(?<id>[^\/]*)\/?#.*fight=(?<fight>[^&]*)`).exec(location.href);
        var fightId = r.groups.fight;
        if( fightId== "last"){
            var last = $("div.report-overview-boss-box:nth-child(2)>div>div>div>a.all-fights-entry:last").attr("onmousedown");
            fightId = /changeFightByIDAndIndex\((?<index>\d*), 0, this, true\)/.exec(last).groups.index;
        }
        var toUrl =`https://xivanalysis.com/fflogs/`+r.groups.id+"/"+ fightId +"/";

        var s = new RegExp(`source=(?<source>[^&]*)`).exec(location.href);
        if(s!= undefined){
            toUrl += s.groups.source;
        }
        window.open(toUrl,"_blank");
    }


    $("#filter-components-tab").remove();
    //"#filter-casts-tab").after(`<a  class="filter-type-tab" id="ffxiv-police"  >出警</a>`);
    //"#top-level-view-tabs").prepend(`<a class="big-tab view-type-tab" id="ffxiv-police"><span class="zmdi zmdi-help"></span> <span class="big-tab-text"><br>出警</span></a>`);
    $("#view-type-tabs").prepend(`<a class="big-tab view-type-tab" id="ffxiv-police"  ><span class="zmdi zmdi-help"></span><span class="big-tab-text"><br>出警</span></a>`);


     $("#ffxiv-police").on('click',(e)=>{

                openPolice()
     })


})();