// ==UserScript==
// @name         Pornhub thumbnail
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Shows thumbnail in table row.
// @author       Splyez
// @match        https://pornbay.org/torrents.php*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21024/Pornhub%20thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/21024/Pornhub%20thumbnail.meta.js
// ==/UserScript==

/* jshint -W097 */
'use strict';


var ForbiddenCategorys = [];





var elements = $(".torrent");
 $("table[id=torrent_table] > tbody > tr:first > td:first").after("<td>Screenshot</td>");
elements.each(function(){
    var Category =$(this).find("td.center.cats_col > div").attr("title");
    //console.log(Category);
    
        var str= $(this).find("script").html();
        var re = /src=(.*\.\w\w\w)/; 
        var m;
        var src="";
        if ((m = re.exec(str)) !== null) 
        {
            if (m.index === re.lastIndex) 
            {
                re.lastIndex++;
            }
        
            if(m[1].indexOf("noimage.png") >=0)
            {
                src ="https://pornbay.org//";
            }
            src +=m[1];
            if($.inArray(Category,ForbiddenCategorys) == -1)
            {
                $("td:first",$(this)).after("<td><img style='width:300px' src='"+src+"'</img></td>");
            }
            else
            {
                 $("td:first",$(this)).after("<td><img style='width:300px' src='https://cdn2.cdnme.se/cdn/7-2/1301677/images/2010/big-no-no_87603504.jpg'</img></td>");
            }
                
            
        }
    
        
        
    
    
    
    //#torrent_table > tbody > tr:nth-child(28) > td.center.cats_col > div
    
    
  
});