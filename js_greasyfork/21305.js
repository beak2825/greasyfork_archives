// ==UserScript==
// @name         Premier Account
// @namespace    http://tampermonkey.net/
// @version      1.8.7
// @description  Changes Premier Presses to pink and do other stuff
// @author       Tuval
// @match        http://c2w16154.itcs.hpicorp.net/HP/real-time-mtr/open/open.php?queue%5B%5D=carecntr&queue%5B%5D=npi-cc&domain=IICC&subregion%5B%5D=ALL
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21305/Premier%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/21305/Premier%20Account.meta.js
// ==/UserScript==


(function() {
    'use strict';
window.location.href = "http://c2w16154.itcs.hpicorp.net/HP/npi-cc-rtm/open/open.php?queue%5B%5D=carecntr&queue%5B%5D=npi-cc&domain=IICC&subregion%5B%5D=ALL"
          //setting missing ID for the table and thead
        $("td:contains('HW')").closest("tr").children("td").each (function() {
            $(this).closest("table").attr("id","callTable");
        });
        $('<thead></thead>').prependTo('#callTable').append($('#callTable tr:first'));
        $("th:contains('Sev')").attr("id","severity");
        $("th:contains('Sub')").attr("id","subregion");
        $("th:contains('Open')").attr("id","time");

        
    //Time Based Color
/*$("td:contains('C')").closest("tr").children("td").each (function() {
    //green
           if ($(this).text() == "0m" || 
           $(this).text() == "1m" || 
           $(this).text() == "2m" || 
           $(this).text() == "3m" || 
           $(this).text() == "4m" || 
           $(this).text() == "5m" || 
           $(this).text() == "6m" || 
           $(this).text() == "7m" ||
           $(this).text() == "8m" ||
           $(this).text() == "9m") {
            $(this).closest('tr').children('td').each (function () {
               $(this).css("background-color", "#2AD98F");
            });
           //yellow
           } else if ($(this).text() == "10m" ||
           $(this).text() == "11m" ||
           $(this).text() == "12m" ||
           $(this).text() == "13m" ||
           $(this).text() == "14m" ||
           $(this).text() == "15m" ||
           $(this).text() == "16m" ||
           $(this).text() == "17m" ||
           $(this).text() == "18m" ||
           $(this).text() == "19m" ||
           $(this).text() == "20m") {
            $(this).closest('tr').children('td').each (function () {
               $(this).css("background-color", "#E9C46A");
            });
           //red
           } else {
           $(this).closest('tr').children('td').each (function () {
               $(this).css("background-color", "#F4A261");
               $(this).find("font").attr("color","white");
               $(this).find("a").attr("style", "color:white");
           });
           }
        });
        */
        
//More flags
 $("td:contains('NA SOUTH')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });
                
 $("td:contains('NA WE SO')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });  
                
 $("td:contains('NA WE NO')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                }); 
                
 $("td:contains('NA ATLT')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });   
                
 $("td:contains('NA EA SO')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });         
                
 $("td:contains('NA EA NO')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });    
                
 $("td:contains('NA CTRL')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });  
                
 $("td:contains('NA MOUNT')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });      
                
 $("td:contains('NA MDWST')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20151118161037!Flag_of_the_United_States.svg");
                });                

 $("td:contains('ISRAEL')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag-of-Israel(boxed).png");
                });    

 $("td:contains('ISR CNTR')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag-of-Israel(boxed).png");
                });  
                
 $("td:contains('ISR NRTH')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag-of-Israel(boxed).png");
                });
                
 $("td:contains('MCA')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Argentina_(2-3).png");
                });  

 $("td:contains('Brazil')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png");
                }); 
                
 $("td:contains('BRAZIL')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png");
                }); 
    
 $("td:contains('MEXICO')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/2000px-Flag_of_Mexico.svg.png");
                }); 
                
 $("td:contains('Mexico')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/2000px-Flag_of_Mexico.svg.png");
                }); 
                
 $("td:contains('ANZ')").closest("td").each (function() {
            $(this).find("img").attr("src","https://upload.wikimedia.org/wikipedia/en/b/b9/Flag_of_Australia.svg");
                }); 
    
    //'24x7' Calls
        $("td:contains('24x7')").closest("tr").children("td").each (function() {
                $(this).closest("tr").children("td").each (function() {
                $(this).css("background-color", "#C183E7");
                $(this).find("font").attr("color","white");
                $(this).find("a").attr("style", "color:white");
                });
                
                
        });

//Remove AP/EMEA DC

 $("td:contains('GR CHINA')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });
 
  $("td:contains('GR China')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });
 
 $("td:contains('MEMA')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });
 
  $("td:contains('KOREA')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });
 
   $("td:contains('CEE')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });

   $("td:contains('GWE')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });
 
    $("td:contains('SEA')").closest("td").each (function() {
            $(this).closest("tr").remove();
 });


    //Hasan 20K Germany Calls
    var hasanRow = $("td").filter(function() {
        return $(this).text() == "51000015" || $(this).text() == "51000124" || $(this).text() == "51000129" || $(this).text() == "51000128";
    }).closest("tr");
    hasanRow.css("background-color","#004d1a");
    hasanRow.children('td').each (function () {
    $(this).find("font").attr("color","white");
    $(this).find("a").attr("style", "color:white");
});

    //Proactive Calls
        var severityRow = $("td").filter(function() {
        return $(this).text() == "S" || $(this).text() == "P";
    }).closest("tr");
        severityRow.children('td').each (function() {
            $(this).css("background-color", "#0b8c7b");
            $(this).find("font").attr("color","white");
            $(this).find("a").attr("style", "color:white");

        });
        
    //Premier Calls
            var serialRow = $("td").filter(function() {
        return $(this).text() == "50000121"|| 
        $(this).text() == "50000124"|| 
        $(this).text() == "50000133"|| 
        $(this).text() == "50000168"|| 
        $(this).text() == "50000203"||
        $(this).text() == "50000241"||
        $(this).text() == "50000243"||
        $(this).text() == "50000309"||
        $(this).text() == "50000334"||
        $(this).text() == "50000356"||
        $(this).text() == "50000385"||
        $(this).text() == "50000430"||
        $(this).text() == "50000450"||
        $(this).text() == "50000451"||
        $(this).text() == "50000452"||
        $(this).text() == "50000453"||
        $(this).text() == "50000454"||
        $(this).text() == "50000455"||
        $(this).text() == "50000456"||
        $(this).text() == "50000457"||
        $(this).text() == "50000458"||
        $(this).text() == "50000459"||
        $(this).text() == "50000460"||
        $(this).text() == "50000462"||
        $(this).text() == "50000462"||
        $(this).text() == "50000465"||
        $(this).text() == "50000466"||
        $(this).text() == "50000467"||
        $(this).text() == "50000468"||
        $(this).text() == "50000470"||
        $(this).text() == "50000475"||
        $(this).text() == "50000477"||
        $(this).text() == "50000479"||
        $(this).text() == "50000480"||
        $(this).text() == "50000481"||
        $(this).text() == "50000482"||
        $(this).text() == "50000483"||
        $(this).text() == "50000484"||
        $(this).text() == "50000485"||
        $(this).text() == "50000486"||
        $(this).text() == "50000489"||
        $(this).text() == "50000493"||
        $(this).text() == "50000495"||
        $(this).text() == "50000497"||
        $(this).text() == "50000499"||
        $(this).text() == "50000500"||
        $(this).text() == "50000503"||
        $(this).text() == "50000537"||
        $(this).text() == "52000106"||
        $(this).text() == "50110009"||
        $(this).text() == "51000148"||
        $(this).text() == "51000168"||
        $(this).text() == "50000132";
                
            }).closest("tr");
    serialRow.css("background-color", "Magenta");

    


    //'NO CALL' Calls
        $("td:contains('NO CALL')").closest("tr").children("td").each (function() {
            if($(this).text() == "10K" || $(this).text() == "12000" || $(this).text() == "12K"){
                $(this).closest("tr").children("td").each (function() {
                    $(this).css("background-color","#DCD7D7");
                    $(this).find("font").attr("color","black");
                    $(this).find("a").attr("style","color:black");

                    
                });
                $(this).closest('tr').each (function(){
                    $(this).attr('class','noCallRow');
                });
            }
        });
        
    
        $("td:contains('HOLIDAY')").closest("tr").children("td").each (function() {
           if($(this).text() == "10K"){
                $(this).closest("tr").children("td").each (function() {
            $(this).css("background-color","#DCD7D7");
            $(this).find("font").attr("color","black");
            $(this).find("a").attr("style","color:black");
                });
            }
        });
            

        
//setting sort 
    $('#severity').click(function(){
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc){rows = rows.reverse()}
            for (var i = 0; i < rows.length; i++){table.append(rows[i])}
        });
        function comparer(index) {
            return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
        };
    }
function getCellValue(row, index){ return $(row).children('td').eq(index).html() }
$("#severity").trigger("click"); 

//after sorting, set the 'nocall' calls to the bottom of the table
        $('tr.noCallRow').each(function(){
            $(this).insertAfter($('tbody'));
        });

//Color Guideline iFrame
     $('<iframe>', {
   src: 'https://s12.postimg.org/wrnodyt2l/RTM.png',
   id:  'myFrame',
   frameborder: 0,
   scrolling: 'no',
   width: 600,
   height: 600
   }).appendTo('body');   
   
})();