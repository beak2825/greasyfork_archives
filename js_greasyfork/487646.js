// ==UserScript==
// @name         Chauthanh.info - Mark files and extract downloads URLs
// @namespace    https://chauthanh.info/
// @version      2024.2.18
// @description  Mark episodes E01-E04 (or EP01-EP04, or Ep01-Ep04), or chosen
// @author       AJ
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @match        https://chauthanh.info/drama/*
// @match        https://chauthanh.info/anime/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487646/Chauthanhinfo%20-%20Mark%20files%20and%20extract%20downloads%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/487646/Chauthanhinfo%20-%20Mark%20files%20and%20extract%20downloads%20URLs.meta.js
// ==/UserScript==
/* eslint-disable */

/* Copy to Clipboard */
// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
/* End of Clipboard */


function MarkEPs(A,B) {
    for(var i=A; i<=B; i++) {
      $('table[class*="table-striped"').find('a:contains("E'+(i<10?'0'+i:i)+'")').css('background-color', '#ffff80');
      $('table[class*="table-striped"').find('a:contains("EP'+(i<10?'0'+i:i)+'"), a:contains("Ep'+(i<10?'0'+i:i)+'")').css('background-color', '#ffff80');
    }
}

function Do_Mark() {
  var mark = $('#mark_episodes').val();
  //alert( mark );
  if(mark.length >= 3 && mark.indexOf('-') > -1) {
     var int = mark.split("-");
     var A = parseInt(int[0], 10);
     var B = parseInt(int[1], 10);
     if(A >= 1 && B >= 1 && A <= B) {
       //alert(A + " ... " + B);
       UnMarkAllEPs();
       MarkEPs(A,B);
     }
  }
}

function UnMarkAllEPs() {
  $('table[class*="table-striped"').find('a').css('background-color', '#ffffff');
}

(function() {
    'use strict';

  $(document).ready(function() {
    //var jqVersion = $.fn.jquery;
    //alert(jqVersion);

    var uri = window.location.href;

    // Hide sidebar on left
    $("div#sidebar").css('opacity','0.05'); //hide();

    $('h2[itemprop="name"]').before('<div><a href="'+uri+'" target="_blank" style="font-size:80%;background-color:#ffff80">'+uri+'</a></div>');

    var nameOri = $('h2[itemprop="name"]').text();
    var name = nameOri.split("[");
    if( name.length > 1 ) name = name[0].trim();

    $('h2[itemprop="name"]').html('<a href="https://mydramalist.com/search?q='+name+'" target="_blank" style="background-color:#CAF08D">'+nameOri+'</a>');

    $.fn.enterKey = function (fnc) {
        return this.each(function () {
            $(this).keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '13') {
                    fnc.call(this, ev);
                }
            })
        })
    }

    var s = "Mark: <input id='mark_episodes' name='mark_episodes' type='text' value='1-4'> <input id='mark_set' type='button' value='SET'><br><input id='url_part' name='url_part' type='text' value='https://eri7.chauthanh.info/eri/download.php?id=1&file=' size='54'><br><textarea id='url_links' cols='54' rows='8'></textarea><br><input id='copy_links' type='button' value='COPY'>";
    $("body").append('<div style="color: #f7f7f7; background: linear-gradient(#8E588E, #533658, #8E588E); border-radius: 7px; font-weight: bold; display: block; position: fixed; top: 50px; right: 10px; width: 410px; padding: 7px;">'+s+'</div>')

    MarkEPs(1,4);

    var u = $("#filelist a");
    //$('#url_links').val( u.length );

    var r,t,v,w,p;
    t = ".html";
    v = t.length;
    w = $('#url_part').val();
    s = "";

    var da = "anime";
    if( u[0].href.indexOf("/drama/") > 0 ) da = "drama";

    for(var i=0; i<u.length; i++) {
      r = u[i].href;
      r = r.replace("https://chauthanh.info/"+da+"/download/", w);
      p = r.lastIndexOf('/');
      r = r.substring(0,p) + "&name=" + r.substring(p+1);
      if( (r.indexOf(t) + v) == r.length ) {
        r = r.slice(0, -v);
      }
      s += r + "\n";
    }
    /* 02/2024: Correct links */
    s = s.replaceAll("%28","(");
    s = s.replaceAll("%29",")");

    $('#url_links').val( s );

    $('#copy_links').click(function(e) {
      copyTextToClipboard( s );
    });

    $('#mark_episodes').enterKey(function () {
      //alert('Enter!');
      Do_Mark();
    });

    $('#mark_set').click(function(e) {
      Do_Mark();
    });
  });

})();