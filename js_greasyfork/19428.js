// ==UserScript==
// @name        ScholarChart
// @namespace   ScholarChartNameSpace
// @description A charting userscript for Google Scholar distinguishing articles by the publication year and the number of citations
// @include     http://scholar.google.ca/*
// @include     https://scholar.google.ca/*
// @include     http://scholar.google.com/*
// @include     https://scholar.google.com/*
// @version     1.0
// @license     Creative Commons Attribution-NonCommercial-ShareAlike 3.0; http://creativecommons.org/licenses/by-nc-sa/3.0/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js

// @require     http://code.highcharts.com/highcharts.js
// @require     http://code.highcharts.com/highcharts-more.js
// @require     http://code.highcharts.com/modules/exporting.js

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19428/ScholarChart.user.js
// @updateURL https://update.greasyfork.org/scripts/19428/ScholarChart.meta.js
// ==/UserScript==

    document.body.style.background = '#F8F8FF';

    // Code to remove User Profile h3 if searching for people by adding an id    

    if ($("h3").first().text().substring(0, 17) == "User profiles for")
    {
        $("h3").first().attr('id', 'UserProfile');
    }

    // end user profile code
    
    var elemNumber = 0;

    $("h3[id!='UserProfile']").each(function() {
    elemNumber++;
        });
    
    
    var resultObject = new Array(elemNumber);
    var resultObjectYear = new Array(elemNumber);
    var resultObjectCitation = new Array(elemNumber);
    
    var resultObjectCitationLink = new Array(elemNumber);

    var resultObjectUrl = new Array(elemNumber);
   
    $("h3[id!='UserProfile']").each(function(i, l) {
       resultObject[i]=$(l).text();
       resultObjectUrl[i] = $(this).find('a[href]').first().attr('href');
    });


    var yearLessArticleFound = false;
    
     $(".gs_a").each(function(i , l) {
         
         try {
                 resultObjectYear[i] = parseInt($(this).text().match(/\s(19|20)\d\d/)[0]);//replace(/[^0-9$]/gi, ''));
                   
          }
          catch(err) { // if no year is found
               yearLessArticleFound = true;
               
               yearToUseInstead = new Date().getFullYear() + 5;
               resultObjectYear[i] =  yearToUseInstead;
          }
         
         
         resultObjectYear[i] = resultObjectYear[i] + ((Math.random()/4)-0.125);
      
    });
    
    var chartSubtitleText = "";
    if (yearLessArticleFound == true)
         chartSubtitleText = "No year is found for one or more articles. The year " +     (yearToUseInstead.toString())    + " is used instead.";

    
    
    
    $(".gs_fl:not(.gs_ggs)").each(function(i, l) {
    if($(this).find( "a:contains('Cited by')").html() != null)
    {
        resultObjectCitation[i] = parseInt($(this).find( "a:contains('Cited by')").html().replace(/[^0-9]/gi, ''));
        resultObjectCitationLink[i] = window.location.host + $(this).find( "a:contains('Cited by')").attr( "href" );
    }
    else
    {
    	resultObjectCitation[i] = 0;
    }
    });
   
    var resultObjectCombined = new Array(elemNumber);
    
    for (i = 0; i < elemNumber; i++) {
       resultObjectCombined[i]=
           {"x": resultObjectYear[i],
            "y": resultObjectCitation[i],
            "name": resultObject[i],
            "url" : resultObjectUrl[i],
            "url_citation" : resultObjectCitationLink[i]
           }
        
    };
    
    

    //Cloning google navigation to the top below the chart    

    var itm = document.getElementById("gs_n");

    if (itm != null)
    {
        var cln = itm.cloneNode(true);

        $("#gs_ccl").prepend(cln);
    }

    //end clone
    
    $("#gs_ccl").prepend("<div id='container'> text to be replaced </div>"); // the div for the chart


    document.getElementById("container").style.border = "thin solid #000000"; //setting border for the chart

    
    chart = new Highcharts.Chart({

        chart: { renderTo:'container', defaultSeriesType: 'scatter', zoomType: 'xy' }, 
		legend: { align: 'left', backgroundColor: '#FFFFFF', borderWidth: 1, floating: true, layout: 'vertical', verticalAlign: 'top', x: 100, y: 50 }, 
		plotOptions: { 
        
                    series: {
                cursor: 'pointer',
                point: {
                events: {
                    click: function (event) {
                        //alert(this.name + ' clicked\n' +
                          //    'Alt: ' + event.altKey + '\n' +
                            //  'Control: ' + event.ctrlKey + '\n' +
                              //'Shift: ' + event.shiftKey + '\n');
                        if(event.altKey) 
                        {
                            if (typeof  this.options.url_citation != "undefined")
                            {
                               window.location.href = this.options.url_citation;    
                            }
                            else
                            {
                                alert("no citation");
                            }                                                            
                        }
                        else if (event.ctrlKey)
                        {
                            var linksForScroll = $('a[href="'+ this.options.url +'"]').first(); 
                            linksForScroll.get(0).scrollIntoView(); // "get" to get DOM element instead of JQuery
                            
                            $('a[href="'+ this.options.url +'"]').each(function()
                                                                      
                            {                                
                               $(this).parent().parent().fadeOut("slow");
                               $(this).parent().parent().fadeIn("slow");                                                                
                            }                                          
                                                                                                                                                                                                               
                            );
                            
                            
                            // Changed because PDF links were the same as the one on the right
                            //linksForScroll.fadeOut("slow");
                            //linksForScroll.fadeIn("slow");                                                     
                            
                        }
                        else
                        {
                            window.location.href = this.options.url;
                        }
                        
                        
                    }
                    }
                }
            },
        
        scatter: { marker: { radius: 5, states: { hover: { enabled: true, lineColor: '#646464' } } }, states: { hover: { enabled: false } } } }, 
        subtitle: { text: chartSubtitleText}, 
		title: { text: 'Click for the paper, alt+click for citations, ctrl+click for scroll' }, 
        tooltip: {
                style: {
                padding: 10,
                fontWeight: 'bold',
                fontSize: '14px',
               },
            
            formatter: function() {return this.point.name +', year: '+ Math.round(this.x) +', citation: '+ this.y +' ' +  ' ' ; } }, 
        Axis: { allowDecimals : false, endOnTick: true, showLastLabel: true, startOnTick: true, title: { text: 'year ' } }, 
        yAxis: { min : 0, title: { text: 'Citation' }, allowDecimals : false,
                labels: {
            style: {
                color: '#525151',
                font: '14px Helvetica',
                fontWeight: 'bold'
            },
            formatter: function () {
                return this.value;
            }
        },
 
        }, //, type: 'logarithmic' }, 
		series: [{ data: [{ name: 'OQLC Extending C with an Object Query Capability', x: 1995, y: 14 }, { name: 'Transaction Management in Multidatabase Systems', x: 1995, y: 22 }, { name: 'Overview of the ADDS System', x: 1995, y: 0 }, { name: 'Multimedia Information Systems Issues and Approaches', x: 1995, y: 25 }, { name: 'Active Database Systems', x: 1995, y: 0 }], name: 'Cat1', color: 'rgba(0, 100, 0, .5)' }]//'rgba(223, 83, 83, .5)' }]	
    });
    
    chart.series[0].setData(resultObjectCombined);
