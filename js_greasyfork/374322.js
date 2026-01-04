// ==UserScript==
// @name    Monica Cleanup
// @name-en    Monica Cleanup
// @description Fix some display issues with MonicaHQ
// @version  1.2
// @grant    none

// @include     *monicahq.com/*


// @run-at document-idle

// @namespace https://greasyfork.org/users/26567
// @downloadURL https://update.greasyfork.org/scripts/374322/Monica%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/374322/Monica%20Cleanup.meta.js
// ==/UserScript==
function bootMe(){
  var parent = $('.mw9 .w-70');//homepage cleanup avatar list
  if(parent.length>0){
    var children = $('.mw9 .pr2');
    parent[0].prepend(children[0]);
    var avatars = $('.mw9 .items-center');
    avatars.css('flex-wrap','wrap');
    children.css('float','left');
    children.css('padding','0.25rem');
  }
  var nblock = $('.row.section.notes');//relocate notes to the end
  if(nblock.length>0){
    setTimeout(function(){
      var notes = $('.row.section.notes li span');
      notes.each(function(i,note){
        var obj = $(note)
        obj.addClass("toggleNumber"+i);
        obj.addClass("hidden");
        var parent=note.parentElement;
        var heading = "Toggle note '" + note.children[0].innerHTML + "'";
        var hhElChild = document.createElement('button');
        hhElChild.innerHTML=heading;
        parent.prepend(hhElChild);
        hhElChild.setAttribute('data-note',i);
        hhElChild.setAttribute('class','noteToggle');
        hhElChild.onclick=(function(){
          var target = ".toggleNumber"+$(this).data('note');
          $(target).toggleClass('hidden');
        });
      });
    },4000);
    var container = nblock[0].parentElement;
    container.append(nblock[0]);
  }
  //column based contact list
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = "\
      .people-list-item { min-width: 265px; }\
      .row .mb4 { background: white;}\
    ";
  document.body.appendChild(css);
  $('.row .mb4 ul').addClass('row');
}

bootMe();
