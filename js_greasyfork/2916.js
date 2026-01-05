// ==UserScript==
// @name       GreasyFork script list beautifier
// @namespace  http://websocket.bplaced.net
// @version    1.4.1
// @description  Reformat script list on GreasyFork
// @match      https://greasyfork.org/users/*
// @match      https://greasyfork.org/forum*
// @match      https://greasyfork.org/scripts*
// @match      https://greasyfork.org/*/users/*
// @match      https://greasyfork.org/*/scripts*
// @copyright  2014, Thomas Theiner
// @downloadURL https://update.greasyfork.org/scripts/2916/GreasyFork%20script%20list%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/2916/GreasyFork%20script%20list%20beautifier.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    if(unsafeWindow.jQuery) {
        $ = unsafeWindow.jQuery;
        
        $('section .script-list, body > .script-list').each(function() {
            $table = $('<table border="0" width="84%"></table>');
            $tbody = $('<tbody></tbody>');
            $thead = $('<thead></thead>');
            $theadtr = $('<tr></tr>');
            
            $th = $('<td style="font-weight: bold" width="60%"></td>');
            $th.html('<span class="title" style="cursor: pointer;">Title</span>');
            $theadtr.append($th);
            $th = $('<td style="font-weight: bold" width="8%"></td>');
            $th.html('Author');
            $theadtr.append($th);
            $th = $('<td style="font-weight: bold" width="8%"></td>');
            $th.html('Daily');
            $theadtr.append($th);
            $th = $('<td style="font-weight: bold" width="8%"></td>');
            $th.html('<span class="total" style="cursor: pointer;">Total</span>');
            $theadtr.append($th);
            $th = $('<td style="font-weight: bold" width="8%"></td>');
            $th.html('Fans');
            $theadtr.append($th);
            $th = $('<td style="font-weight: bold" width="8%"></td>');
            $th.html('Created');
            $theadtr.append($th);
            $th = $('<td style="font-weight: bold" width="8%"></td>');
            $th.html('Updated');
            $theadtr.append($th);
            
            $tbody.append($theadtr);
            
            $(this).find('li').each(function() {
                var $scriptlink = $(this).find('article h2 a');
                var $scriptdesc = $(this).find('article h2 .description');
                $tr = $('<tr></tr>');
                $td = $('<td></td>');
                $td.append($scriptlink);
                $td.append('<br/>');
                $td.append($scriptdesc);
                $tr.append($td);
                
                $(this).find('article dl dd').each(function() {
                    $td = $('<td></td>');
                    $td.html($(this).html());
                    $tr.append($td);
                });
                
                $tbody.append($tr);
            });
            
            $table.append($tbody);
            
            $(this).replaceWith($table);
            //$(this).hide();
        });
        
        $('.total').click(function() {
            // sort total column
            var $rowArray = [];
            var totalArray = [];
            var $tbody = $(this).parent().parent().parent();
            $tbody.find('tr').each(function(index) {
                if(index > 0) {
                    $rowArray.push($(this));
                    var total = parseInt($(this).find('td').eq(3).text(), 10);
                    totalArray.push(total);
                }
            });
            for(i=0; i<totalArray.length-1; i++) {
                for(j=i+1; j<totalArray.length; j++) {
                    if(totalArray[i] < totalArray[j]) {
                        var help = totalArray[i];
                        var helpTR = $rowArray[i];
                        totalArray[i] = totalArray[j];
                        $rowArray[i] = $rowArray[j];
                        totalArray[j] = help;
                        $rowArray[j] = helpTR;
                    }
                }
            }
            for(i=0; i<totalArray.length; i++) {
                $tbody.append($rowArray[i]);
            }
            
        });

        $('.title').click(function() {
            // sort title column
            var $rowArray = [];
            var titleArray = [];
            var $tbody = $(this).parent().parent().parent();
            $tbody.find('tr').each(function(index) {
                if(index > 0) {
                    $rowArray.push($(this));
                    var title = $(this).find('td').eq(0).text();
                    titleArray.push(title);
                }
            });
            for(i=0; i<titleArray.length-1; i++) {
                for(j=i+1; j<titleArray.length; j++) {
                    if(titleArray[i] > titleArray[j]) {
                        var help = titleArray[i];
                        var helpTR = $rowArray[i];
                        titleArray[i] = titleArray[j];
                        $rowArray[i] = $rowArray[j];
                        titleArray[j] = help;
                        $rowArray[j] = helpTR;
                    }
                }
            }
            for(i=0; i<titleArray.length; i++) {
                $tbody.append($rowArray[i]);
            }
            
        });
        
    }
}, false);