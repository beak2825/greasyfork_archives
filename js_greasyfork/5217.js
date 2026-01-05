// ==UserScript==
// @name         Number of Search Results
// @version      3.5
// @description  Click on the circle task number indicators on the left to start working
// @copyright    2013+, John Stoehr, Tjololo12
// ------------------------------------------------------------------------------------
// @match        https://www.mturkcontent.com/dynamic/hit*
// @match        https://www.google.com/search*
// @run-at       document-end
// @require      http://code.jquery.com/jquery-git.js
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/5217/Number%20of%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/5217/Number%20of%20Search%20Results.meta.js
// ==/UserScript==
 
//parseUri.options.strictMode = true;
 
// Source: http://stackoverflow.com/a/4673436/2405722
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(match, number) {
    return args[number] !== undefined ? args[number] : match;
  });
};

var mturkOrigins = ["https://www.mturkcontent.com"];
//var googleAPIPrefix="https://ajax.googleapis.com/ajax/services/search/web?v=1.0&";
var googleAPIPrefix="https://www.google.com/search?q=";
//var ip = myIP();
//console.log(ip);

function httpGet(theUrl)
{
  GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,

        onload: function (xhr,theUrl) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            try{
                //var data = $.parseJSON(xhr.responseText);
                ret = getUrl(r);
                //console.log(taskNumber);
                window.postMessage({magicword: "mumbojumbo", url: ret, source: theUrl}, "*");
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function isMturkOrigin(url) {
  for (var i = 0; i < mturkOrigins.length; ++i) {
    if (url.indexOf(mturkOrigins[i]) === 0) {
      return true;
    }
  }
 
  return false;
}

function getGoogleResults(domain,term){
    //var searchURL = domain+"/search?q="+encodeURIComponent(term);
    var searchURL = term;
    console.log(searchURL);
    var ret = httpGet(searchURL);
    return ret;
}
 
function getUrl(obj){
    //console.log(obj["responseData"]);
    var html = $.parseHTML(obj);
    //var results = obj["responseData"]["results"];
    //var responseNum = getRandomInt(0,3);
    //var finalUrl = results[responseNum]["unescapedUrl"];
    var el = $( '<div></div>' );
    var finalUrl = "";
    el.html(html);
    //var element = $("#rso li.g", el).eq(getRandomInt(0,4));
    var element = $("#resultStats", el).eq(0);
    if (element.length==0)
        finalUrl=0;
    else
    	finalUrl = element.text().split(" ")[1];
    console.log(element);
    return finalUrl;
}

if (isMturkOrigin(location.href)) {
  // make task number indicator (circle) clickable
    $('span:first').append(
        $("<button></button>", {
            type: "button",
            text: "Search",
            id: "button1"
        }).click(function() {
            var prefix = "Keyword:";
            //var keywords = $("table:first > tbody:first > tr:first > td:last").text().trim();
            //console.log($("table:first > tbody:first > tr:first > td:last").text());
            //var keywordsEncoded = encodeURIComponent(keywords).replace(/%20/g, "+");
            
            var keywords = $('a:first').attr('href');
            var googleOrigin = "https://www.google.com";
            //alert(keywords);
            var resultURL = getGoogleResults(googleOrigin, keywords);
        }));
        
            $("#button1").click();
      window.addEventListener("message", function(e) {
         if (e.data.magicword === "mumbojumbo") {
             console.log("Message Received");
             //console.log(e.data);
             $("input[type=text]:first").val(e.data.url);
         }
          else{
              console.log("Also message received");
              console.log(e.data);
          }
      }, false);
}