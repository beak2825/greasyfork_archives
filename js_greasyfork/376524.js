// ==UserScript==
// @name        Fuck Trance
// @description Trance is so 2015
// @namespace   http://facebook.com
// @author      Ben Kalish
// @include     http://*.facebook.com/*
// @include     https://*.facebook.com/*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/376524/Fuck%20Trance.user.js
// @updateURL https://update.greasyfork.org/scripts/376524/Fuck%20Trance.meta.js
// ==/UserScript==

window.fuckTrance = function() {

  var comments = document.getElementsByClassName("_72vr");
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];

    var commentAuthorElementList = comment.getElementsByClassName("_6qw4");
    if(commentAuthorElementList.length > 0){
        var commentAuthor = commentAuthorElementList[0].innerHTML;
        if(commentAuthor.indexOf("Dev Chatterjee") === 0 || commentAuthor.indexOf("Matt Pokrzywa") === 0){
            var commentTextElementList = comment.getElementsByClassName("_3l3x");
            if(commentTextElementList.length > 0){
                var commentText = commentTextElementList[0].firstChild.innerHTML;
                commentTextElementList[0].firstChild.innerHTML = commentText.replace(new RegExp("trance", 'g'), "my tiny penis");
            }
        }
    }
  }
};

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var target = document.getElementsByTagName("body")[0];
var config = { attributes: true, childList: true, characterData: true };

var mutationObserver = new MutationObserver(function(mutations) {
  fuckTrance();

});



mutationObserver.observe(target, config);
fuckTrance();