// ==UserScript==
// @name         Vrutal ignore list
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  No more XdXdXd
// @author       MrBloodyshadow
// @match        http://www.vrutal.com/humor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32665/Vrutal%20ignore%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/32665/Vrutal%20ignore%20list.meta.js
// ==/UserScript==


//    Users to ignore here    ////
    //    Example: 
    //    var ignoredUsers = ["user1", "user2", "user3"];
    
    var ignoredUsers = ["wistfulness"];
    
    ///////////////////////////////////////////////////////////////////////
    //    Don't touch from here unless you know what are you doing.    ////
    ///////////////////////////////////////////////////////////////////////

(function() {
    'use strict';
    
    if(ignoredUsers.length === 0){
        return;
    }

    var baseUserUrl = "http://www.vrutal.com/usuario/";
    var postClass = "post-article";
    
    var articles = document.getElementsByClassName(postClass);
    for (var i = 0; i < articles.length; i++){
        var article = articles[i];
        var removed = false;
        var anchors = article.getElementsByTagName('a');
        for (var j = 0; j < anchors.length && !removed; j++) {
            var url = anchors[j].getAttribute('href');
            for (var k = 0; k < ignoredUsers.length && !removed; k++) {
                var userUrl = baseUserUrl + ignoredUsers[k];
                if(url == userUrl){
                    article.parentNode.removeChild(article);
                    removed = true;
                }
            }
        }
    }

})();