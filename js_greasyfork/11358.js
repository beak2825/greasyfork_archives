
// ==UserScript==
// @name         Find All posts in PostActivity
// @namespace    http://saadtronics.com/
// @version      1.4
// @description      posts in PostActivity
// @author       Saad Tronics (King of Hearts, saadtronics)
// @match        http://www.hackforums.net/postactivity.php*
// @match        http://hackforums.net/postactivity.php*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11358/Find%20All%20posts%20in%20PostActivity.user.js
// @updateURL https://update.greasyfork.org/scripts/11358/Find%20All%20posts%20in%20PostActivity.meta.js
// ==/UserScript==

$(document).ready(function(){
    
    var username = $('#content > div.navigation > span > a').html();
    
    console.log('hello');
    var navBit = document.getElementsByClassName('navigation')[0];          
    var postkey = ($('[name="my_post_key"]').val());
    var table=document.querySelector("div.quick_keys table");
    var x = table.rows[1].insertCell(1);
    x.innerHTML = "Find all threads";
    x.className="tcat";
    var x = table.rows[1].insertCell(2);
    x.innerHTML = "Find all posts";
    x.className="tcat";

    for(var i = 2; i < table.rows.length; i++){
        var x = table.rows[i].insertCell(1);
        var forumId = table.rows[i].cells[0].innerHTML.match(/fid=(.*)">/)[1];
        var form = '<form action="search.php" method="post"><input type="hidden" name="action" value="do_search"> <input type="hidden" name="keywords" value=""> <input type="hidden" name="postthread" value="2"> <input type="hidden" name="author" value="'+username+'"> <input type="hidden" name="matchusername" value="1"> <input type="hidden" name="forums[]" value="'+forumId+'"> <input type="hidden" name="findthreadst" value="1"> <input type="hidden" name="numreplies" value=""> <input type="hidden" name="postdate" value="0"> <input type="hidden" name="pddir" value="1"> <input type="hidden" name="threadprefix" value="any"> <input type="hidden" name="sortby" value="lastpost"> <input type="hidden" name="sortordr" value="desc"> <input type="hidden" name="showresults" value="threads"> <input type="submit" name="submit" value="Find All Threads"></form>';
        x.innerHTML = form;
        x.className="tcat";

        var z = table.rows[i].insertCell(2);
        var form = '<form action="search.php" method="post"><input type="hidden" name="action" value="do_search"> <input type="hidden" name="keywords" value=""> <input type="hidden" name="postthread" value="1"> <input type="hidden" name="author" value="'+username+'"> <input type="hidden" name="matchusername" value="1"> <input type="hidden" name="forums[]" value="'+forumId+'"> <input type="hidden" name="findthreadst" value="1"> <input type="hidden" name="numreplies" value=""> <input type="hidden" name="postdate" value="0"> <input type="hidden" name="pddir" value="1"> <input type="hidden" name="threadprefix" value="any"> <input type="hidden" name="sortby" value="lastpost"> <input type="hidden" name="sortordr" value="desc"> <input type="hidden" name="showresults" value="posts"> <input type="submit" name="submit" value="Find All Posts"></form>';
        z.innerHTML = form;
        z.className="tcat";

    }

});