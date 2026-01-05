// ==UserScript==
// @name         Contest Count
// @include      *myanimelist.net/forum/*
// @version      1.0.2
// @description  Counts the votes in contest threads
// @author       Ghost
// @grant        none
// @namespace https://greasyfork.org/users/10763
// @downloadURL https://update.greasyfork.org/scripts/19228/Contest%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/19228/Contest%20Count.meta.js
// ==/UserScript==


var votingThreadIDs = ["1474323", "1501620"];
var entries = ['A','B','C','D','E','F','G'];

var currentThreadID = window.location.href.match(/id=\d+/)[0].replace("id=","");
var votingThreadIndex = "";
var totalReplies = $('#totalReplies')[0].value;

function matchString() {
    var aString = 'Entry: (';
    for (var i = 0; i<entries.length; i++) {
        if (i === (entries.length-1)) {
            aString = aString + entries[i];
        }
        else {
            aString = aString + entries[i] + '|';
        }
    }
    
    var reg = new RegExp(aString+')', 'g');
    return reg;
}

var resultObject = function() {
    var $forumMsgElement = $('div.forum_border_around td.forum_boardrow1').not($('div.forum_border_around td.forum_boardrow1')[0]);
    var votes;
    var result = {};
    //var matchStringAJAX = getMatchString();
    
    for (var i = 0; i < $forumMsgElement.length; i++) {
        votes = votes + $forumMsgElement[i].innerText;
    }
    
    votes = votes.match(matchString());
    
    if ((+totalReplies+1) > 50) {
        for (var x = 50; x < (+totalReplies+1); x=x+50) {
            var lookaheadPageLinks = "https://myanimelist.net/forum/?topicid="+votingThreadIDs[votingThreadIndex]+"&show="+x;
            var response;
            
            var ajax = $.ajax({
	                     method: "GET",
	                     url: lookaheadPageLinks,
	                     success: function(text) {
                             response = text.slice(text.search("class=\"postnum\">"), text.search("<!-- end of contentHome -->")).match(matchString());
                             votes = votes.concat(response);
                             votes.forEach(function(x) { result[x] = (result[x] || 0)+1; });
                             return getResults(result);
                         }});
        }
    }
    else {
    votes.forEach(function(x) { result[x] = (result[x] || 0)+1; });
    return getResults(result);
    }
};

var makeObjectKeys = function() {
    var array = entries.slice(0);

    for(i=0;i<array.length;i++) {
        array[i] = "Entry: "+array[i];
    }

    return array;
};

var getResults = function(object) {
    var objectKeys = makeObjectKeys();
    var results = object;
    var resultString = "";

    for (i=0; i<objectKeys.length;i++) {
        if (results[objectKeys[i]] === undefined) {
            resultString = resultString + objectKeys[i]+ " - 0\n";
        }
        else {
            resultString = resultString + objectKeys[i]+ " - " + results[objectKeys[i]]+"\n";
        }
    }
    console.log(resultString);
    alert("Results:\n" + resultString);
};

console.log(votingThreadIDs.indexOf(currentThreadID));
if (votingThreadIDs.indexOf(currentThreadID) !== -1) {
    votingThreadIndex = votingThreadIDs.indexOf(currentThreadID);
    resultObject();
}