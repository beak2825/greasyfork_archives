// ==UserScript==
// @name        Google Search - Time selections and EU popup
// @namespace   thing123
// @include        *://*.google.*/*
// @exclude        *://mail.*
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @run-at      document-start
// @description Add extra time ranges to Google Search (from 6 hours to 8 years), and as an aside, always show tools and remove any search result redirects (Search engine only) if nothing else has removed them.
// @version    2
// @downloadURL https://update.greasyfork.org/scripts/31357/Google%20Search%20-%20Time%20selections%20and%20EU%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/31357/Google%20Search%20-%20Time%20selections%20and%20EU%20popup.meta.js
// ==/UserScript==

// handle loading state when it happens
if (document.readyState == "loading") {
   is_loading();
}
//and trap future states...
document.onreadystatechange=function(){
  if (document.readyState == "interactive") {
     is_interactive();      // interactive
  }
  if (document.readyState == "complete") {
     is_complete();      // complete
  }
}
document.addEventListener ("DOMContentLoaded", is_complete);
window.addEventListener ("load", is_complete);



function is_loading() {
//   alert("loading...");
//jQuery('head').html(do_HTML_regex_edits(jQuery('head').html()));
//alert(s);
//  alert (document.documentElement.outerHTML);
}

function is_interactive() {
   // interactive
//alert("interactive...");
//  alert (document.documentElement.outerHTML);

do_jQuery_edits();
//jQuery('head').html(do_HTML_regex_edits(jQuery('head').html()));
//jQuery('body').html(do_HTML_regex_edits(jQuery('body').html()));

//  alert("After interactive:\n" + jQuery('head').html());
}

function is_complete() {
   // complete
// alert("complete...");
//  alert (document.documentElement.outerHTML);

do_jQuery_edits();
//jQuery('head').html(do_HTML_regex_edits(jQuery('head').html()));
//jQuery('body').html(do_HTML_regex_edits(jQuery('body').html()));

//  alert("After complete:\n" + jQuery('head').html());
   
}


function do_jQuery_edits() {
//   jQuery('#search *').removeAttr('onmouseover');
//   jQuery('#search *').removeAttr('onmouseout');
//   jQuery('#search *').removeAttr('onclick');
//   jQuery('#search *').off('click');
//   jQuery('#search div').bind('amodaldestroy', function(e){
//    e.stopPropagation();
//   });

   jQuery('#search a').removeAttr('onmousedown').removeAttr('onmouseover').removeAttr('onmouseout').removeAttr('onclick');
   jQuery('#taw').remove();
   jQuery('#cnsi').remove();
   jQuery('#cnso').remove();
   jQuery('#hdtbMenus').attr('aria-expanded', 'true').attr('class', 'hdtb-td-o');
   if (jQuery('#qdr_h').html() !== undefined) {
      var list = new Array;
      list[0] = ['h','Past hour'];
      list[1] = ['h6','Past 6 hours'];
      list[2] = ['h26','Past 24 hours (same time yesterday)'];
      list[3] = ['d','Past day'];
      list[4] = ['SEP'];
      list[5] = ['w','Past week'];
      list[6] = ['m','Past month'];
      list[7] = ['m3','Past 3 months'];
      list[8] = ['m6','Past 6 months'];
      list[9] = ['m9','Past 9 months'];
      list[10] = ['SEP'];
      list[11] = ['y','Past year'];
      list[12] = ['m18','Past 18 months'];
      list[13] = ['y2','Past 2 years'];
      list[14] = ['y3','Past 3 years'];
      list[15] = ['y5','Past 5 years'];
      list[16] = ['y8','Past 8 years'];
      var line_tplt = jQuery('#qdr_h').prop('outerHTML');
      var to_add = '';
      for (var ii=0; ii < list.length; ii++) {
        if (list[ii][0] == 'SEP') {
           to_add += '<div class="cdr_sep"></div>';
        } else {
           to_add += line_tplt.replace('qdr_h', 'qdr_' + list[ii][0]).replace('qdr:h', 'qdr:' + list[ii][0]).replace('>Past hour</a>', '>' + list[ii][1] + '</a>');
        }
      }
      var to_rmv = ['h','d','w','m','y'];
      for (var ii=0; ii < to_rmv.length; ii++) {
         jQuery('#qdr_' + to_rmv[ii]).remove();
      }
      jQuery('.modded').remove();
      jQuery('#qdr_').after('<span class="modded">' + to_add + '</span>');
      $.removeCookie('CONSENT', { path: '/' });
   }
}

function do_HTML_regex_edits(s) {
// alert(s);
//  s = s.replace(/(on)?(mousedown|mouseover|mouseout|click|keydown|keyup|keypress)\s*=\s*['"][^'"]+['"]/g, '');
//  s = s.replace(/(\.hdtb-td-h\s*\{[^}]*)display\s*:\s*none([^}]*\})/g, '$1 display:block $2');
//   console.log(s);
//  s = s.replace(/hdtb-td-h/g, 'hdtb-td-hx');
alert("ping!");
   return s;
}

