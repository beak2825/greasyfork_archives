// ==UserScript==
// @name         HF Forum Parser
// @namespace    http://saadtronics.com/
// @version      0.3
// @description  enter something useful
// @author       Saad Tronics (King of Hearts)
// @match        http://www.hackforums.net/*
// @match        http://hackforums.net/*
// @grant        GM_xmlhttpRequest 
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11490/HF%20Forum%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/11490/HF%20Forum%20Parser.meta.js
// ==/UserScript==

$(document).ready(function(){
    var toDo = [];
    var rows = document.getElementsByTagName('table')[0].rows;
    for(var i = 2; i < rows.length; i++){
        var cell = rows[i].cells[1];
        var forumName = (cell.getElementsByTagName('strong')[0].innerText);
        var forumDesc = cell.getElementsByClassName('smalltext')[0].childNodes[0].data;
        var forumMod = '';
        var childNodes = (cell.getElementsByClassName('smalltext')[0].childNodes);
        
        var forumSubForums = [];
        var forumMods = [];
        for(var j = 0; j < childNodes.length; j++){
            if(childNodes[j].nodeName == "UL"){
                for(var z = 1; z < childNodes[j].childNodes.length; z++){
                    forumSubForums.push(childNodes[j].childNodes[z].innerText);
                    toDo.push(forumName);
                }
            }else if(childNodes[j].nodeName == "#text"){
                if(childNodes[j].nodeValue.indexOf("Mentors") > -1){
                    forumMods.push('Mentors');
                }
            }else if(childNodes[j].localName == "a"){
                    forumMods.push(childNodes[j].innerText);
            }
        }
        var forumLink = (cell.getElementsByTagName('strong')[0].childNodes[0].href);
        var forumId = (forumLink.split('=')[1]);
        var forumStickies = [];
        var forumRules = [];
        var parentForum = '';
        var forumPrefixes = [];
        $.ajax({
            url: "newthread.php?fid=" + forumId,
            async:   false,
            success: function (data) {
                var innderElement = document.createElement( 'html' );
                innderElement.innerHTML = data;
                if(innderElement.getElementsByTagName('select').length > 0){
                    for (var i = 3; i < innderElement.getElementsByTagName('select')[0].childNodes.length; i+=2) {
                        forumPrefixes.push(innderElement.getElementsByTagName('select')[0].childNodes[i].innerText);
                    };
                }
            }
        });
        $.ajax({
             url: forumLink,
             async:   false,
             success: 
                function(data) {
                        var responseElement = document.createElement( 'html' );
                        responseElement.innerHTML = data;                
                        
                        for(var j = 0; j < responseElement.getElementsByClassName('navigation')[0].childNodes.length; j++){
                            if(responseElement.getElementsByClassName('navigation')[0].childNodes[j].localName == "a"){
                                parentForum = responseElement.getElementsByClassName('navigation')[0].childNodes[j].innerText;
                            }
                        }
                        if(data.indexOf('Important Threads') > -1){
                            
                            var elements = (responseElement.getElementsByClassName('forumdisplay_sticky'));
                            var numStickies = elements.length / 5;
                            for(var i = 0; i < numStickies; i++){
                                var threadName = '';
                                var tid = '';
                                if(elements[(i*5) + 1].childNodes[1].childNodes[1].childNodes[1].innerText){
                                    threadName = elements[(i*5) + 1].childNodes[1].childNodes[1].childNodes[1].innerText;
                                    tid = elements[(i*5) + 1].childNodes[1].childNodes[1].childNodes[1].href.split('=')[1];
                                }else if(elements[(i*5) + 1].childNodes[1].childNodes[1].childNodes[6].innerText){
                                    threadName = elements[(i*5) + 1].childNodes[1].childNodes[1].childNodes[6].innerText;
                                    tid = elements[(i*5) + 1].childNodes[1].childNodes[1].childNodes[6].href.split('=')[1];
                                }
                                var author = elements[(i*5) + 1].childNodes[1].childNodes[5].innerText;
                                forumStickies.push([threadName, tid, author]);
                            }
                        }
                        if(data.indexOf('Important Rules') > -1){
                            var table  = responseElement.getElementsByClassName('tborder')[0];
                            for(i = 1; i < table.rows.length; i++){
                                forumRules.push(table.rows[i].innerText);
                            }
                        }
                        
                        var wiki = "{{ForumBox";
                        wiki += "\n| ForumName   = " + forumName;
                        wiki += "\n| ForumPic    = " + forumName + " (Ficon).png";
                        wiki += "\n| ForumDesc   = " + forumDesc;
                        wiki += "\n| FID         = " + forumId;
                        wiki += "\n| Status      = Open";
                        if(forumRules.length > 1){
                            wiki += "\n| Rules       = ";
                            for (var i = 0; i < forumRules.length; i++) {
                                wiki += "\n* " + forumRules[i];
                            };
                        }
                        for (var i = 0; i < forumMods.length; i++) {
                            wiki += "\n| Mod"+ (i+1) +"        = " + forumMods[i];
                        };
                        if(forumPrefixes.length > 1){                                    
                            wiki += "\n| Prefixes       = ";
                            for (var i = 0; i < forumPrefixes.length; i++) {
                                wiki += "\n* " + forumPrefixes[i];
                            };
                        }
                        wiki += "\n| Tab         = Coding";
                        wiki += "\n| ParentForum = " + parentForum;
                        for (var i = 0; i < forumSubForums.length; i++) {
                            if(forumSubForums[i].indexOf(0) == ' ')
                                forumSubForums[i] = forumSubForums[i].substring(1, forumSubForums[i].length);
                            wiki += "\n| SubForum"+ (i+1) +"   =" + forumSubForums[i];
                        };
                        for (var i = 0; i < forumStickies.length; i++) {
                            wiki += "\n| Sticky"+ (i+1) +"     = <nowiki>" + forumStickies[i][0] + "</nowiki>";
                            wiki += "\n| StickyTID"+ (i+1) +"  = " + forumStickies[i][1];
                            wiki += "\n| Author"+ (i+1) +"     = [[" + forumStickies[i][2] + "]]";
                        
                        };
                        wiki += "\n}}";
                        console.log(wiki);
                        
                  }
        });  
        
        
    }
console.log(toDo);
});