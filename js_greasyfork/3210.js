// ==UserScript==
// @name         DTs Dashboard Charts
// @namespace    localhost
// @version      0.4b
// @description  Adds charts to the mturk dashboard
// @match        https://www.mturk.com/mturk/dashboard
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @require		 http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment.min.js
// @require		 http://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.2.0/moment-timezone.min.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/jquery.jqplot.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.pieRenderer.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.dateAxisRenderer.min.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.canvasAxisTickRenderer.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.canvasAxisLabelRenderer.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.canvasTextRenderer.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.categoryAxisRenderer.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.barRenderer.js
// @require      http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.pointLabels.js
// @resource     jqplot http://cdn.jsdelivr.net/jqplot/1.0.8/jquery.jqplot.css
// @grant        GM_addStyle
// @grant		 GM_getResourceText
// @run-at       document-end
// @copyright    2014+, DeliriumTremens
// @downloadURL https://update.greasyfork.org/scripts/3210/DTs%20Dashboard%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/3210/DTs%20Dashboard%20Charts.meta.js
// ==/UserScript==

var jqplotCSS = GM_getResourceText("jqplot");
GM_addStyle(jqplotCSS);


// Display dollar and hit count charts
moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0'); // Add Amazon timezone to moment.js

var dates = [];
$('a[href*="statusdetail"]').each( function () {
    dates.push($(this).attr('href'));
});
 
var HITStorage = {};
HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;
 
var curr = new Date();
var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var secondday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var thirdday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var fourthday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var fifthday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var sixthday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
var seventhday = new Date(curr.setDate(curr.getDate() - curr.getDay()));

/*console.log(firstday.toLocaleDateString({timeZone: 'America/Los_Angeles'}).replace(/\//g, '-')); // Convert date to usable string */

secondday.setDate(secondday.getDate() + 1);
thirdday.setDate(thirdday.getDate() + 2);
fourthday.setDate(fourthday.getDate() + 3);
fifthday.setDate(fifthday.getDate() + 4);
sixthday.setDate(sixthday.getDate() + 5);
seventhday.setDate(seventhday.getDate() + 6);

firstdy = (firstday.getFullYear()+ '-' + ('0' + (firstday.getMonth()+1)).slice(-2) + '-' + ('0' + (firstday.getDate())).slice(-2));
seconddy = (secondday.getFullYear()+ '-' + ('0' + (secondday.getMonth()+1)).slice(-2) + '-' + ('0' + (secondday.getDate())).slice(-2));
thirddy = (thirdday.getFullYear()+ '-' + ('0' + (thirdday.getMonth()+1)).slice(-2) + '-' + ('0' + (thirdday.getDate())).slice(-2));
fourthdy = (fourthday.getFullYear()+ '-' + ('0' + (fourthday.getMonth()+1)).slice(-2) + '-' + ('0' + (fourthday.getDate())).slice(-2));
fifthdy = (fifthday.getFullYear()+ '-' + ('0' + (fifthday.getMonth()+1)).slice(-2) + '-' + ('0' + (fifthday.getDate())).slice(-2));
sixthdy = (sixthday.getFullYear()+ '-' + ('0' + (sixthday.getMonth()+1)).slice(-2) + '-' + ('0' + (sixthday.getDate())).slice(-2));
seventhdy = (seventhday.getFullYear()+ '-' + ('0' + (seventhday.getMonth()+1)).slice(-2) + '-' + ('0' + (seventhday.getDate())).slice(-2));
 
var hitMeter = {};
hitMeter[firstdy.toString()] = 0;
hitMeter[seconddy.toString()] = 0;
hitMeter[thirddy.toString()] = 0;
hitMeter[fourthdy.toString()] = 0;
hitMeter[fifthdy.toString()] = 0;
hitMeter[sixthdy.toString()] = 0;
hitMeter[seventhdy.toString()] = 0;
 
var hitCounter = {};
hitCounter[firstdy.toString()] = 0;
hitCounter[seconddy.toString()] = 0;
hitCounter[thirddy.toString()] = 0;
hitCounter[fourthdy.toString()] = 0;
hitCounter[fifthdy.toString()] = 0;
hitCounter[sixthdy.toString()] = 0;
hitCounter[seventhdy.toString()] = 0;
 
function HITpull() {
        var request = indexedDB.open("HITDB", 4);
        request.onsuccess = function(e) {
                HITStorage.indexedDB.db = e.target.result;
                var db = HITStorage.indexedDB.db;
        var results = [];
        var tmp_results = {};
                var transaction = db.transaction('HIT','readonly');
                var store = transaction.objectStore('HIT');
                var index = store.index('date');
                var range = IDBKeyRange.bound(firstdy, seventhdy, false, false);
                index.openCursor(range).onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                                var hit = cursor.value;
                                if (tmp_results[hit.date] === undefined) {
                                        tmp_results[hit.date] = [];
                                        tmp_results[hit.date][0] = hit.reward;
                                        tmp_results[hit.date][1] = 1;
                    tmp_results[hit.date][2] = hit.date;
                                        }
                                else if (hit.status === 'Rejected'){}
                                else {
                                        tmp_results[hit.date][0] += hit.reward;
                                        tmp_results[hit.date][1] += 1;
                    tmp_results[hit.date][2] = hit.date;
                                        }
                                cursor.continue();
                        }
                        else {
                                for (var key in tmp_results) {
                                results.push(tmp_results[key]);
                                }
                printHitCount(results);
                                printDollarCount(results);
                        }
                db.close();
                };
                request.onerror = HITStorage.indexedDB.onerror;
        };
}
 
function printHitCount (results) {
        $(".container-content:eq(1)").append('<div id="hitCount" style="height:200px;width:350px;float:left;"></div>');
        for (var key in results) {
                hitMeter[results[key][2]] += results[key][1];
        };
        var ticks = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
        var plot2 = $.jqplot('hitCount', [[hitMeter[firstdy.toString()],hitMeter[seconddy.toString()],hitMeter[thirddy.toString()],hitMeter[fourthdy.toString()],hitMeter[fifthdy.toString()],
                                      hitMeter[sixthdy.toString()],hitMeter[seventhdy.toString()]]], {
        animate: !$.jqplot.use_excanvas,
                seriesDefaults:{
                        renderer:$.jqplot.BarRenderer,
                        rendererOptions: {fillToZero: true},
            pointLabels: {
                show: true,
                hideZeros: true,
                location: 'n',
                ypadding: 1
            }
                },
                series:[
                        {label:firstdy.toString()},
                        {label:seconddy.toString()},
                        {label:thirddy.toString()},
                        {label:fourthdy.toString()},
                        {label:fifthdy.toString()},
            {label:sixthdy.toString()},
            {label:seventhdy.toString()}
                ],
                title: {
                        text: 'Daily Count (Current Week)',
                        fontFamily: '"Trebuchet MS", Arial, Helvetica, sans-serif',
                        fontSize: '10pt',
                        textColor: '#666666'
                },
                axes: {
                        xaxis: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
                                tickOptions: {
                                        //angle: -15,
                                        fontSize: '8pt',
                    showGridline: false,
                    formatString: '%a'
                                },
                                renderer: $.jqplot.CategoryAxisRenderer,
                                ticks: ticks
                        },
                        yaxis: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
                                tickOptions: {
                                        fontSize: '8pt',
                                        markSize: '0'
                                },
                                pad: 1.2,
                                min: 0
                        }
                }
        });
    var imgData = $('#hitCount').jqplotToImageStr({});
    $('#hitCount').on('click',function () {
             $.ajax({
                        url: 'https://api.imgur.com/3/image',
                        headers: {
                                'Authorization': 'Client-ID 6ebabcf714f0bb3'
                        },
                        type: 'POST',
                        data: {
                                'image': imgData.substr(22)
                        },
                        success: function(response) { prompt("Copy to clipboard: Ctrl+C, Enter", response.data.link); }
             });  
        });
};
 
function printDollarCount (results) {
        $(".container-content:eq(1)").append('<div id="dollarCount" style="height:200px;width:350px;float:right;"></div>');
        for (var key in results) {
                hitCounter[results[key][2]] += results[key][0];;
        };
        var ticks = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
        var plot2 = $.jqplot('dollarCount', [[hitCounter[firstdy.toString()],hitCounter[seconddy.toString()],hitCounter[thirddy.toString()],hitCounter[fourthdy.toString()],
                                          hitCounter[fifthdy.toString()],hitCounter[sixthdy.toString()],hitCounter[seventhdy.toString()]]], {
        animate: !$.jqplot.use_excanvas,
                seriesDefaults:{
                        renderer:$.jqplot.BarRenderer,
                        rendererOptions: {fillToZero: true},
            pointLabels: {
                show: true,
                hideZeros: true,
                location: 'n',
                formatString: '$%#.2f',
                ypadding: 1
            }
                },
                series:[
                        {label:firstdy.toString()},
                        {label:seconddy.toString()},
                        {label:thirddy.toString()},
                        {label:fourthdy.toString()},
                        {label:fifthdy.toString()},
            {label:sixthdy.toString()},
            {label:seventhdy.toString()}
                ],
                title: {
                        text: 'Daily Earnings (Current Week)',
                        fontFamily: '"Trebuchet MS", Arial, Helvetica, sans-serif',
                        fontSize: '10pt',
                        textColor: '#666666'
                },
                axes: {
                        xaxis: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
                                tickOptions: {
                                        //angle: -15,
                                        fontSize: '8pt',
                    showGridline: false
                                },
                                renderer: $.jqplot.CategoryAxisRenderer,
                                ticks: ticks
                        },
                        yaxis: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
                                tickOptions: {
                                        fontSize: '8pt',
                                        prefix: '$',
                                        markSize: '0'
                                },
                                pad: 1.2,
                                min: 0
                        }
                }
        });
    var imgData = $('#dollarCount').jqplotToImageStr({});
    $('#dollarCount').on('click',function () {
             $.ajax({
                        url: 'https://api.imgur.com/3/image',
                        headers: {
                                'Authorization': 'Client-ID 6ebabcf714f0bb3'
                        },
                        type: 'POST',
                        data: {
                                'image': imgData.substr(22)
                        },
                        success: function(response) { prompt("Copy to clipboard: Ctrl+C, Enter", response.data.link); }
             });  
        });
}
 
HITpull();