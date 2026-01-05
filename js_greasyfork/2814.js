// ==UserScript==
// @name         CrowdSource: Search Image URL
// @version      0.9
// @namespace    localhost
// @description  Click the search button to begin. Then simply click on the matching image in the google results.
// @copyright    2013+, John Stoehr, Tjololo12, modified for Image URL Hits by BenWo
// ------------------------------------------------------------------------------------
// @match        https://work.crowdsource.com/amt/view*
// @match        https://www.google.com/search*
// @match        https://www.google.co.uk/search*
// @run-at       document-end
// @require      http://code.jquery.com/jquery-2.1.0.js
// @require      https://greasyfork.org/scripts/2352-parseuri-license/code/parseuri%20license.js?version=6261
// @downloadURL https://update.greasyfork.org/scripts/2814/CrowdSource%3A%20Search%20Image%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/2814/CrowdSource%3A%20Search%20Image%20URL.meta.js
// ==/UserScript==

// Source: http://stackoverflow.com/a/4673436/2405722
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(match, number) {
    return args[number] !== undefined ? args[number] : match;
  });
};

var mturkOrigins = ["https://work.crowdsource.com/amt/view"];
var googlePrefix="https://www.google.com/search?tbm=isch&q=site:";
var numTasks = 0;
 
function isMturkOrigin(url) {
  for (var i = 0; i < mturkOrigins.length; ++i) {
    if (url.indexOf(mturkOrigins[i]) === 0) {
      return true;
    }
  }
 
  return false;
}

function sleep(ms) {
  var start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
  return;
}

if (isMturkOrigin(location.href)) {
    $('label[for^=Url]').each( 
        function() {
            numTasks++;
            $(this).append(
                $("<button></button>", {
                    type: "button",
                    text: "Search "+numTasks
                }).click(function() {
                    var $task = $(this).parent().parent().prev().prev().prev().prev();
                    var taskNumber = parseInt($(this).text().replace('Search ',''));
                    $task.addClass("task-" + taskNumber);
                    var textRepText = $task.text();
                    
                    var pageCheck = 1;
                    var pageText = $(this).parent().parent().prev().text();
                    if (pageText.indexOf("View Image.") > -1) {
                        pageCheck = 0;
                    }
                    
                    //console.log(pageText);
                    
                    var prefixKeyword = 'Keyword:';
                    var prefixSite = 'URL:';
                    var keywords = $.trim(textRepText.replace(prefixKeyword,'').replace(prefixSite,''));
                    var keywordsEncoded = encodeURIComponent(keywords).replace(/%0A/g, '');
                    //console.log(keywords);
   
                    sleep(500); //added in rate limiting because issues. Should be virtually un-noticeable.
                    window.open("https://www.google.co.uk/search?tbm=isch&q=site:{0}&magicword={1}&task={2}&isPage={3}".format(keywordsEncoded, "oogieboogie", taskNumber, pageCheck));
                    
                    //console.log("https://www.google.com/search?tbm=isch&q=site:{0}&magicword={1}&task={2}".format(keywordsEncoded, "oogieboogie", taskNumber));
                }));
    });
    console.log(numTasks+" tasks");
    window.addEventListener("message", function(e) {
        if (e.data.magicword === "oogieboogie") {
            console.log("Message Received");
            console.log(e.data);
            $("textarea#Url-{0}".format(e.data.task)).val(e.data.url);
        } else{
            console.log("MSG "+e.data);
        }
    }, false);
} else if (window.opener != null && window.location.href.indexOf("oogieboogie") > -1) {
    window.opener.postMessage("Child Frame Loaded", "*");
    $('#rg_s div.rg_di a').each(function() {
        var taskNumber = parseUri(location.href).queryKey.task;
        
        var tHref = $(this).attr('href');
        var dHref = decodeURIComponent(tHref);
       
        // *** GET IMAGE DIRECT URL ***
	  	var refRegex = new RegExp("[\\?&]imgurl=([^&#]*)");
        
        // *** GET PAGE URL IF TASK CALLS FOR IT ***
        if (parseUri(location.href).queryKey.isPage == 1) {
            refRegex = new RegExp("[\\?&]imgrefurl=([^&#]*)");
        }
  		var pageUrl = refRegex.exec(dHref)[1];
        
        $(this).click(function() {
        	window.opener.postMessage({magicword: "oogieboogie", task: taskNumber, url: pageUrl}, "*");
            //console.log({magicword: "oogieboogie", task: taskNumber, url: pageUrl});
            //sleep(100);
            window.close();          
        });
    });
}