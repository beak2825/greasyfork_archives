// ==UserScript==
// @name    _Echo360 ID Revealer
// @namespace   Violentmonkey Scripts
// @include https://echo360.org/admin/courses*
// @include https://echo360.org/admin/users*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant   GM_addStyle
// @run-at document-idle
// @version     1.0
// @author      Jim Monaco
// @description Adds user IDs to the echo360 Users admin page. Prints section IDs to the console on the Courses page.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441172/_Echo360%20ID%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/441172/_Echo360%20ID%20Revealer.meta.js
// ==/UserScript==

var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 3000, observer); // wait for the page to stay still for 3 seconds
observer.observe(document, {childList: true, subtree: true});

// reset timer every time something changes
function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 3000, observer);
}

function action(observer) {
    observer.disconnect();
  $("div.adminList-item.child.section > .adminListItem-cell.sectionNumber").each(  
      function(index){   
                         var txt = $(this).siblings().find("a[title='Instructor View']" ).attr("href");
                         var id = txt.replace("/section/", "");
                         id = id.replace("/home", "");
        
                         console.log($( this ).text() + " : "+ id);
                      //$(this).append("<span> id:</span><span>"+id+"</span></span>");
                     }  ); 
  
  $(".adminList-item.userList-item").each(
    function(index){
      var txt = $(this).attr("data-object");
      //console.log(txt);
      const obj = JSON.parse(txt);
      var id = obj.userId;
      var email = $(this).find(".adminListItem-cell.email").text();
      console.log(email+" : "+id);
      $(this).find(".adminListItem-cell.name").parent().append("<div>"+id+"</div>");
    });
  
}