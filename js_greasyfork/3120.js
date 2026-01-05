// ==UserScript==
// @name         Custom Mturk Tab Titles
// @version      1.1
// @description  Adds new settings to the very bottom of your Dashboard page that allow you to set tab titles for urls.  
// @author       Cristo
// @grant       GM_getValue
// @grant       GM_setValue
// @include      https://www.mturk.com*
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3120/Custom%20Mturk%20Tab%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/3120/Custom%20Mturk%20Tab%20Titles.meta.js
// ==/UserScript==

//In the footer of the Dashboard page you'll find two new links "Add Title" and "Saved Title".
//Click "Add Title"
//Two boxes will appear and allow you to enter a new tab title for a URL.
//You can add * to the end of any url to match all pages that start with what you entered.
// * Example - https://www.mturk.com* will match all mturk urls but be overwritten by https://www.mturk.com/mturk/myhits
//Clcik "Saved Title"
//Shows all save titles.
//Hover your mouse over a title to reveal the URL. URLs are highlighted automatically to make copying simple.
//Click to delete.

var titles;
var urls;
var title = document.getElementsByTagName("title")[0]; 

if (GM_getValue("titlelist") == undefined) {
    titles = [];
    urls = [];
} else {
    titles = GM_getValue("titlelist");
    urls = GM_getValue("urllist");
}
for (var u = 0; u < urls.length; u++) {                    
    if (urls[u].indexOf("*") > -1){
        var create = urls[u].replace(/[^a-zA-Z ]/g, "");
        var createish = create + "(.*)";
        var created = new RegExp(createish);
        var sring = document.URL.toString().replace(/[^a-zA-Z ]/g, "");
        if (sring.match(created)) {
            title.innerHTML = titles[u];
        }
    } else {
        if (urls[u] == document.URL.toString()) {
            title.innerHTML = titles[u];
        }
    }
}

if(document.URL.toString() == "https://www.mturk.com/mturk/dashboard"){
    var foot = document.getElementsByClassName("footer_separator")[0].nextSibling.nextSibling;
    //For Chets AMT
    //var foot = document.getElementsByClassName("footer")[0];     
    
    var foottable = document.createElement("table");
    foottable.style.textAlign = "center";
    foottable.style.marginLeft = "auto";
    foottable.style.marginRight = "auto";
    foot.parentNode.insertBefore(foottable, foot.nextSibling);
    
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    foottable.appendChild(td1);
    foottable.appendChild(td2);
    foottable.appendChild(td3);
    
    var trig1 = document.createElement("span");
    trig1.style.color = "#1170A0";
    trig1.style.textDecoration = "underline";
    trig1.style.cursor = "pointer";
    trig1.innerHTML =  "Add Titles";
    td1.appendChild(trig1);
    
    td2.innerHTML = "&nbsp"+"|"+"&nbsp";
    
    var trig2 = document.createElement("span");
    trig2.style.color = "#1170A0";
    trig2.style.textDecoration = "underline";
    trig2.style.cursor = "pointer";
    trig2.innerHTML =  "Saved Titles";
    td3.appendChild(trig2);
    
    var divy = document.createElement("div");
    divy.style.textAlign = "center";
    foottable.parentNode.insertBefore(divy, foottable.nextSibling);    
    
    var check;										
    
    trig1.addEventListener( "click", function(){
        if (check == "table0"){
            divy.innerHTML = "";
            check = "nope";
        } else {
            divy.innerHTML = "";
            var table0 = document.createElement("table");
            table0.style.marginLeft = "auto";
            table0.style.marginRight = "auto";
            table0.style.textAlign = "center";
            check = "table0"; 							 
            divy.appendChild(table0);
            var topRow = document.createElement("tr");
            var middleRow = document.createElement("tr");
            table0.appendChild(topRow);
            topRow.parentNode.insertBefore(middleRow, topRow.nextSibling);
            
            var nameRow = document.createElement("td");
            topRow.appendChild(nameRow);
            var ptag1 = document.createElement("p");
            nameRow.appendChild(ptag1);
            ptag1.innerHTML = "Tab Name";
            
            var urlRow = document.createElement("td");
            nameRow.parentNode.insertBefore(urlRow, nameRow.nextSibling);
            var ptag2 = document.createElement("p");
            urlRow.appendChild(ptag2);
            ptag2.innerHTML = "URL";          
            
            var inputRow1 = document.createElement("td");
            middleRow.appendChild(inputRow1);
            var input1 = document.createElement("input");
            inputRow1.appendChild(input1);
            input1.type = "text";
            
            var inputRow2 = document.createElement("td");
            inputRow1.parentNode.insertBefore(inputRow2, inputRow1.nextSibling);
            var input2 = document.createElement("input");
            inputRow2.appendChild(input2);
            input2.type = "text";        	
            
            var addBut = document.createElement("span");
            addBut.style.color = "#1170A0";
            addBut.style.textDecoration = "underline";
            addBut.style.cursor = "pointer";
            addBut.innerHTML =  "Add";
            table0.parentNode.insertBefore(addBut, table0.nextSibling);
            
            addBut.addEventListener( "click", function() {
                var userName;
                var userUrl;
                if (input1.value.length < 1) {
                    userName = "Blank";
                } else {
                    userName = input1.value;
                }
                if (input2.value.length < 1) {
                    userUrl = "Blank";
                } else {
                    userUrl = input2.value;
                }
                titles.push(userName);
                urls.push(userUrl);
                var both = [];
                for (var w = 0; w < titles.length; w++){
                    both.push({ "A": titles[w], "B": urls[w] });
                }
                both.sort(function(a,b){
                    return a.B.length - b.B.length;
                });
                var temptitles = [];
                var tempurls = [];
                for (var h = 0; h < both.length; h++) {
                    temptitles.push(both[h].A);
                    tempurls.push(both[h].B);
                } 
                titles = temptitles;
                urls = tempurls;
                GM_setValue("titlelist", titles);
                GM_setValue("urllist", urls);
                input1.value = "";
                input2.value = "";
            }, false);
        }}, false);     
    
    trig2.addEventListener( "click", function(){
        if (check == "table"){
            divy.innerHTML = "";
            check = "nope";
        } else {
            divy.innerHTML = "";
            var table = document.createElement("table");
            table.style.marginLeft = "auto";
            table.style.marginRight = "auto";
            table.style.textAlign = "center";
            check = "table";   			     
            divy.appendChild(table);
            
            for (var g = 0; g < GM_getValue("urllist").length; g++){
                var row = document.createElement("tr");
                table.appendChild(row);
                var cell1 = document.createElement("td");
                row.appendChild(cell1);
                var emptyP = document.createElement("p");
                emptyP.style.color = "#7fb4cf";
                emptyP.style.textDecoration = "underline";
                emptyP.style.cursor = "pointer";
                cell1.appendChild(emptyP);
                emptyP.setAttribute("class","urltable");
                emptyP.innerHTML = GM_getValue("titlelist")[g];
            }
            function overit(l) {
                var inex1 = l.target.innerHTML;
                var switchp1 = GM_getValue("titlelist").indexOf(inex1);
                l.target.innerHTML = GM_getValue('urllist')[switchp1];
                var selection = window.getSelection();        
                var range = document.createRange();
                range.selectNodeContents(this);
                selection.removeAllRanges();
                selection.addRange(range);
            }    
            function outofit(l) {
                var newDex;
                var inex2 = l.target.innerHTML;
                if (inex2.indexOf("&amp;") > -1){
                    newDex = inex2.replace(/&amp;/g,"&");
                } else {
                    newDex = inex2;
                }
                var switchp2 = GM_getValue("urllist").indexOf(newDex);
                l.target.innerHTML = GM_getValue("titlelist")[switchp2];
            }    
            function gonenow(l) {
                var inexd = l.target.innerHTML;
                var dele = GM_getValue("urllist").indexOf(inexd);
                titles.splice(dele,1);
                urls.splice(dele,1);
                GM_setValue("titlelist", titles);
                GM_setValue("urllist", urls);
            }
            var pps = document.getElementsByClassName("urltable");
            for (var p = 0; p < pps.length; p++) {
                pps[p].addEventListener("mouseover", overit, false);
                pps[p].addEventListener("mouseout", outofit, false);
                pps[p].addEventListener("click", gonenow, false); 
            }
        }}, false);
}
