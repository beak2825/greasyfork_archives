// ==UserScript==
// @author		   adinbied
// @name           PassThePopcorn Collection Export Tool
// @description    Saves a collection of torrents as a text file
// @version		   1.11
// @namespace      http://greasyfork.org
// @include 	   *://passthepopcorn.me/collages.php*
// @comment        Based upon the WCD/RED Collage Export Utility by Elevory
// @downloadURL https://update.greasyfork.org/scripts/37112/PassThePopcorn%20Collection%20Export%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/37112/PassThePopcorn%20Collection%20Export%20Tool.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

var btnExport = document.createElement("a");
var container = document.getElementById("content").getElementsByClassName("linkbox")[0];
var data = "";

var pageSpans = document.getElementById("pageslinksdiv");

window.URL = window.URL || window.webkitURL; // support for additional browsers

btnExport.innerHTML = "[Export]";
btnExport.href="#";
btnExport.setAttribute("onclick", "saveData();");

btnExport.onclick = function()
{
	var entries = document.getElementById("coverart");
    var pagetitle = document.title;
    collageName = pagetitle.replace(' :: PassThePopcorn','');

	if (pageSpans !== null)
	{
	    pageSpans = pageSpans.getElementsByTagName("span");

	    for (var i = 0; i < pageSpans.length; i++)
	    {
	        if(pageSpans[i].id.indexOf("pagelink") != -1)
	        {
	        	pageSpans[i].firstChild.click();
	        }
	    }
	    if (pageSpans.length > 0) document.getElementById("pagelink0").firstChild.click(); // return to first page
	}

	PopulateData(entries);

	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
    {
		var a = document.createElement("a");
		a.download = "Collage - " + collageName + ".txt";
		var blob = new Blob([data], {"data":"application/octet-stream"});
		a.href = window.URL.createObjectURL(blob);
		a.click();
	}
	else
    {
		var taExport;
        if (!document.getElementsByName("taExport")[0])
        {
			taExport = document.createElement("textarea");
			taExport.name = "taExport";
			taExport.rows = "5";
			container.appendChild(taExport);
		}
		taExport.value = data;
	}


};

container.appendChild(btnExport);

function PopulateData(entries)
{
let list = document.getElementById("collection_movielist").getElementsByClassName("list")[0];
 if ('firstElementChild' in list) {
                var child = list.firstElementChild;
                var array1 = [];
                while (child) {
                    array1.push(child.innerHTML);
                    child = child.nextElementSibling;
var re = /\>([^[<]+)<\/a\> \[([^\]]+)\]/g;
var s = array1;
var m;
var input = []; // initialise an empty array
do {
    m = re.exec(s);
    if (m) {
        input.push(m[1]+" ["+m[2]+"]"+"\r\n");
    }
} while (m);
var ready = input;
var NumberString = input.join('');
data = NumberString;

                }
           }
}