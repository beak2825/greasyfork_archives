// ==UserScript==
// @name       Geneparmesean's bitchfest
// @version    0.4
// @description  Does whatever he wants because I am a slave.
// @match      https://bvd.crowdcomputingsystems.com/mturk-web*
// @require      http://code.jquery.com/jquery-git.js
// @copyright  2014+, Tjololo12
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/2688/Geneparmesean%27s%20bitchfest.user.js
// @updateURL https://update.greasyfork.org/scripts/2688/Geneparmesean%27s%20bitchfest.meta.js
// ==/UserScript==

var radios = document.getElementsByTagName("input");
var googleAPIPrefix="https://www.google.com/search?q=";

for (i = 0; i < radios.length; i++) {
    if (radios[i].value == 'No') {
            radios[i].checked = true;
        }
}

function httpGet(theUrl)
{
  //console.log(theUrl);
  GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,

        onload: function (xhr) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            try{
                //var data = $.parseJSON(xhr.responseText);
                ret = getUrl(r);
                window.postMessage({magicword: "mumbojumbo", url: ret}, "*");
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function getGoogleResults(term){
    url = googleAPIPrefix+encodeURIComponent(term);
    console.log(url);
    var ret = httpGet(url);
    return ret;
}

function getUrl(obj){
    console.log("Gotten Object");
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = "";
    el.html(html);
    console.log(el);
    var element = $("#rso li.g", el).eq(0);
    if (element.attr("class") === "g" || element.attr("class") === "g no-sep" && element.attr("id") == null){
             var $h3 = element.find("h3.r").first();
             if ($h3.length > 0) {
                 console.log($h3.find("a")[0].href);
                 finalUrl = $h3.find("a")[0].href;
         }
    return finalUrl;
}
}

window.addEventListener("message", function(e) {
         if (e.data.magicword === "mumbojumbo") {
             console.log("Message Received");
             console.log(e.data);
             //document.getElementsByClassName("cc-input text")[1].value=e.data.url;
             $( "input[id$='input_url_url']" ).val( e.data.url );
             //$(".task-{0}".format(e.data.task)).next().find("input").val(e.data.url);
         }
          else{
              console.log("Also message received");
              console.log(e.data);
          }
      }, false);

String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless 
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
     str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
       uppers[i].toUpperCase());

  return str;
}

container = document.getElementsByClassName("place bg-dark")[0].innerHTML;
brsplit = container.split("<br>")[0];
strongsplit = brsplit.split("</strong>")[1].trim().replace("amp;", "");
console.log("|"+strongsplit+"|");
document.getElementsByClassName("cc-input text")[0].value = strongsplit.toTitleCase();
//url = $('a[href^="https://www.google.com/#q="]').href;
var resultURL = getGoogleResults(strongsplit);