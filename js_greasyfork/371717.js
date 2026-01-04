// ==UserScript==
// @name         Flot Example
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/item.php?temp=2
// @require      https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371717/Flot%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/371717/Flot%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var placeholder = $('<div id="placeholder" style="width:600px;height:300px;background-color: white;"></div>');
    $('.info-msg-cont').after(placeholder);
    console.log("Flot Script Running");


    /*

    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);

    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

    // a null signifies separate line segments
    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

    $.plot($("#placeholder"), [ d1, d2, d3 ]);

    */

    var data,data1,options,chart;
    data1 = [ ];
    var data2 = [[Date.now(), 11], [Date.now()+1000, 4], [Date.now()+2000, 2], [Date.now()+3000, 14], [Date.now()+5000, 29]];
    //for(var i = 1; i < 10; i++) { data2.push([i,i * 2])}
    data = [{ data:data1, label:"fixed", lines:{show:true}}
            ,{ data:data2, label:"linear", lines:{show:true}, points:{show:true}}];
    options = {legend:{position:"nw"},
               grid: { clickable: false, hoverable: true },
               xaxis: {
                   mode: "time",
                   timezone: "browser",
                   timeformat: "%I:%M %P", }
              }
    $(document).ready(function(){chart = $.plot($("#placeholder"),data,options);});
    $("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) { alert("item " + item.dataIndex + " in " + item.series + " clicked");
                   chart.highlight(item.series, item.datapoint);
                  }
    });
    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute', display: 'none', top: y + 5, left: x + 5,
            border: '1px solid #fdd', padding: '2px', 'background-color': '#black', opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
    $("#placeholder").bind("plothover", function (event, pos, item) {
        $("#tooltip").remove();
        if (item) {
            var x = item.datapoint[0].toFixed(2),y = item.datapoint[1].toFixed(2);
            showTooltip(item.pageX, item.pageY,item.series.label + " of " + x + " = " + y);
        }
    });
})();