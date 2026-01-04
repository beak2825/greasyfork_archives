// ==UserScript==
// @name         Copy PMs FreeForums
// @namespace    GeorgeBailey
// @version      0.1
// @description  GeorgeBailey
// @author       GeorgeBailey
// @match        *.freeforums.net/*
// @icon         https://www.google.com/s2/favicons?domain=freeforums.net
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/428469/Copy%20PMs%20FreeForums.user.js
// @updateURL https://update.greasyfork.org/scripts/428469/Copy%20PMs%20FreeForums.meta.js
// ==/UserScript==

$(document).ready(function(){

    function Post(author, quoteTimeStamp, text) {
  this.author = author;
  this.quoteTimeStamp = quoteTimeStamp;
  this.text = text;

}

    jQuery.extend({
    getValues: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            async: false,
            cache: false,
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});
        Post.prototype.toString = function quoteToString() {
  return "[quote timestamp=\"" + `${this.quoteTimeStamp}` + "\" author=\"" + `${this.author}` + "\"]" + `${this.text}` + "[/quote]" ;
};

    // Button stuff
    var button1 = document.createElement ('input');
    button1.setAttribute("name","quoteAll");
      button1.setAttribute("type","button");
button1.setAttribute("value","Quote All");
button1.setAttribute("class","button1");
    button1.setAttribute("role","button");
document.querySelector("#content > div.container.messages > div.title-bar > ul > li").prepend(button1);
     document.querySelector(".button1").addEventListener (
        "click", quoteAll, false
);
    button1.setAttribute("style","margin-right: 5px;");

const newPosts = new Post();
var collection = [];
var names = [];
 // Add a regex function to Jquery
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

//Text
// ("td > table > tbody > tr:nth-child(1) > td.content > article > div.message").text()




var regex = /(<br>)/g;

    // Timestamp
// $(value).find("abbr").data().timestamp;

   // message
//$(value).find("div.message")[0].innerHTML

var message = "";
    //Author
    //$("td > table > tbody > tr:nth-child(1) > td.left-panel > div > a")[key].title

    var posts = $('tr:regex(id,[a-zA-Z]+-[0-9]+)');
console.log(posts);

    function quoteAll(){
posts.each( function (key, value){


collection[key] = new Post($("td > table > tbody > tr:nth-child(1) > td.left-panel > div > a")[key].title,$(value).find("abbr").data().timestamp,$(value).find("div.message")[0].innerHTML.replaceAll(regex, "\n"));





   });

    for(var i = 0; i < collection.length; i++){

    message += collection[i] + "\n"

    }

   GM_setClipboard (message);


    }
});