// ==UserScript==
// @name        Google Improved
// @namespace   Alfur
// @description Makes Google bearable
// @include     https://encrypted.google.com/?*
// @include     *://www.google.*/?*
// @include     *://google.*/?*
// @include     https://encrypted.google.com/#*
// @include     *://www.google.*/#*
// @include     *://google.*/#*
// @include     https://encrypted.google.com/
// @include     *://www.google.*/
// @include     *://google.*/
// @include     https://encrypted.google.com/webhp*
// @include     *://www.google.*/webhp*
// @include     *://google.*/webhp*
// @include     https://encrypted.google.com/imghp*
// @include     *://www.google.*/imghp*
// @include     *://google.*/imghp*
// @include     https://encrypted.google.com/search*
// @include     *://www.google.*/search*
// @include     *://google.*/search*
// @version     1.0.10
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @icon        https://raw.githubusercontent.com/AlphaDelta/Google-Improved/master/icon.png
// @downloadURL https://update.greasyfork.org/scripts/11134/Google%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/11134/Google%20Improved.meta.js
// ==/UserScript==

var nuke = GM_getValue("nuke", true);
var rownum = GM_getValue("rownum", true);
var antigateway = GM_getValue("antigateway", true);
var cleansearch = GM_getValue("cleansearch", true);
var removenonsearch = GM_getValue("removenonsearch", true);

var x;

var del;

var doneappbar = false, donenavbar = false, donesearchbar = false, hit = 0, chrome = navigator.userAgent.toLowerCase().indexOf('chrome') !== -1;
function DoMod() {
  hit++;
  if(cleansearch) {
    if(!doneappbar) {
      var appbar = $("#appbar");
      if(appbar.length > 0) {
        appbar.after("<br />");
        appbar.remove();
        doneappbar = true;
      }
    }
    if(!donenavbar) {
      var navbar = $("#hdtb-msb");
      if(navbar.length > 0) {
        var imagesi = false, webi = null;
        $(".hdtb-mitem", navbar).each(function() {
          var item = $(this);
          if(item.text() === "Web") webi = item;
          else if(item.text() === "Images") imagesi = true;
          else item.remove();
        });
        $("#hdtb-tls", navbar).remove();
        if(!imagesi && webi.length > 0) {
          $("#hdtb-more-mn .hdtb-mitem").each(function() {
            var item = $(this);
            if(item.text() === "Images") {
              webi.after(item[0].outerHTML);
              return false;
            }
          });
        }
        $("#hdtb-more", navbar).remove();
        //donenavbar = true;
      }
    }
    
    /*if(!donesearchbar) {
      var searchbar = $("#sfdiv");
      if(searchbar.length > 0) {
        $(".sfsbc").remove();
        searchbar.css("border-right-width", "1px").css("border-right-color", "inherit");
        donesearchbar = true;
      }
    }*/
    
    if(removenonsearch) {
      var inthenews = $(".mnr-c");
      if(inthenews.length > 0) {
        inthenews.each(function() {
          var parent = $(inthenews.parent()[0]);
          if(parent.is("div")) {
            if(parent.prev().is("hr")) parent.prev().remove();
            if(parent.next().is("hr")) parent.next().remove();
            parent.remove();
          } else inthenews.remove();
        });
      }
    }
    
    $("#footcnt").remove();
    $("#extrares").remove();
  }
  
  $('#rso .srg .g:not(.gi-parsed), #rso > .g:not(.gi-parsed)').each(function (index) {
    var t = $(this);
    t.addClass('gi-parsed');
    t.css('position', 'relative');
    if(rownum) t.prepend('<div style="color: #AAA; position: absolute; height: 100%; width: 20px; margin-left: -25px; margin-top: 2px; text-align: right;">' + (index + 1) + '</div>');
    
    if(antigateway) t.find(".rc > .r > a").first().removeAttr("onmousedown");
  });
}

function DoLines() {
  clearTimeout(del);
  del = setTimeout(DoMod, 200);
}

var settings = false;
var viewport = null;
function ToggleSettings() {
  settings = !settings;
  
  if(viewport === null) viewport = $("#viewport");
  
  if(settings) {
    $("body").prepend("\
<div id=\"gi-settings\" style=\"position: fixed; margin: 5px; padding: 5px; background: #F2F2F2; border: 1px solid #888; font-size: 11px; color: #222; z-index: 1000;\">\
<input id=\"gi-nuke\" type=\"checkbox\" " + (nuke ? "checked" : "") + "/><label for=\"gi-nuke\">Nuke <span style=\"color: #888;\">(Nuke the front page to a more minimal interface, no bullshit fogging up your screen)</span></label>\
  <br /><input id=\"gi-rownum\" type=\"checkbox\" " + (rownum ? "checked" : "") + "/><label for=\"gi-rownum\">Row numbers <span style=\"color: #888;\">(Adds row numbers to search results)</span></label>\
  <br /><input id=\"gi-antigateway\" type=\"checkbox\" " + (antigateway ? "checked" : "") + "/><label for=\"gi-antigateway\">Anti-gateway <span style=\"color: #888;\">(Prevents Google from jacking your link clicks and forcing them to go through their redirect gateway)</span></label>\
  <br /><input id=\"gi-cleansearch\" type=\"checkbox\" " + (cleansearch ? "checked" : "") + "/><label for=\"gi-cleansearch\">Clean search <span style=\"color: #888;\">(Removes clutter from the search page)</span></label>\
  <br /><input id=\"gi-removenonsearch\" type=\"checkbox\" style=\"margin-left: 25px;\" " + (removenonsearch ? "checked" : "") + (cleansearch ? "" : " disabled=\"disabled\"") + "/><label for=\"gi-removenonsearch\">Remove non-search items <span style=\"color: #888;\">(Removes non-search items such as 'In the news')</span></label>\
  <br /><div style=\"margin-top: 5px; font-style: italic; color: #555;\">Page must be refreshed in order for new settings to take effect</div>\
</div>");
    $("#gi-nuke").change(function() { nuke = this.checked; GM_setValue("nuke", this.checked); });
    $("#gi-rownum").change(function() { rownum = this.checked; GM_setValue("rownum", this.checked); });
    $("#gi-antigateway").change(function() { antigateway = this.checked; GM_setValue("antigateway", this.checked); });
    $("#gi-cleansearch").change(function() {
      cleansearch = this.checked;
      GM_setValue("cleansearch", this.checked);
      if(!this.checked)
        $("#gi-removenonsearch").attr("disabled", "disabled");
      else
        $("#gi-removenonsearch").removeAttr("disabled");
    });
    $("#gi-removenonsearch").change(function() { removenonsearch = this.checked; GM_setValue("removenonsearch", this.checked); });
    
    viewport.mousedown(function() { ToggleSettings(); });
  } else {
    $("#gi-nuke").unbind();
    $("#gi-rownum").unbind();
    $("#gi-antigateway").unbind();
    $("#gi-cleansearch").unbind();
    $("#gi-removenonsearch").unbind();
    viewport.unbind();
    
    $("#gi-settings").remove();
  }
}


(function() {
  console.log("%c Google Improved - 1.0.10 ", 'background: #166BEC; color: #f1f1f1');
  x = document.getElementById("main");
  
  if(x.addEventListener){
    x.addEventListener('DOMSubtreeModified', DoLines, false);
  }
  
  if(nuke) {
    /* DEATH TO THE CLUTTER */
    $("#prm-pt").remove(); //Prompt
    $("#footer").remove(); //Footer (obviously)
    $("#gb").remove(); //Top bar
    $("input[name='btnK']").remove(); //Google Search button, farewell
    $("input[name='btnI']").remove(); //I'm Feeling Lucky button, I'll enjoy killing you the most
    
    //var search = $("#searchform.jhp");
    //search.css("top", "45%");
    
    $("head").append("<style type=\"text/css\">#searchform.jhp { top: 45% !important; }</style>");
    
    var logo = $("#hplogo");
    if(chrome && (window.location.toString().indexOf("//www.google.com/") !== -1 || window.location.toString().indexOf("//google.com/") !== -1)) logo.css("padding-top", "");
    logo.parent().css("padding-top", "").css("margin-top", "");
    logo.parent().parent()
    .css("height", "")
    .css("position", "absolute")
    .css("left", "50%")
    .css("margin-left", "-134px")
    .css("top", "45%")
    .css("margin-top", (
      window.location.toString().indexOf("https://encrypted.google.com") === 0 ||
      (!chrome && window.location.toString().indexOf("webhp?hl=en") !== -1) ? "-220px" : "-115px"));
    
    logo.children().first().text("Clean");
  }
  
  var ctrl = false, alt = false;
  $("body").on("keydown", function(evt) {
    if(evt.which == 17) ctrl = true;
    else if(evt.which == 18) alt = true;
    else if(ctrl && alt && evt.which == 73) ToggleSettings();
    else if(ctrl && alt && evt.which == 68) {
		console.log("%c Dumping debug data... ", 'background: #f1f1f1; color: #166BEC');
		console.log("DoLines() hit " + hit + " times");
		console.log("nuke=" + nuke + ";rownum=" + rownum + ";antigateway=" + antigateway + ";cleansearch=" + cleansearch + ";removenonsearch=" + removenonsearch);
	}
  });
  $("body").on("keyup", function(evt) {
    if(evt.which == 17) ctrl = false;
    else if(evt.which == 18) alt = false;
  });
  DoLines();
})();