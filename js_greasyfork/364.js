// ==UserScript==
// @name        Camp-Firefox.de - Ignorefunktion
// @description Ignorefunktion für camp-firefox.de
// @namespace   camp
// @include     http://www.camp-firefox.de/forum/viewtopic.php?*
// @version     20140917
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.1/jquery.min.js
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/364/Camp-Firefoxde%20-%20Ignorefunktion.user.js
// @updateURL https://update.greasyfork.org/scripts/364/Camp-Firefoxde%20-%20Ignorefunktion.meta.js
// ==/UserScript==
'use strict';
	//<![CDATA[
	if (!window.jQuery) {
		alert("koa jquery im haus");
	}
	//]]>
	
this.$ = this.jQuery = jQuery.noConflict(true); //jQuery-conflicts

$(document).ready(onLoad);
function onLoad() {
	cfg.load();
	GM_registerMenuCommand('camp-firefox.de - Ignorefunktion einstellen', setup.show);
	window.setTimeout(ehfignore, 50);
}

function ce(n, props) {
	var n = d.createElement(n);
	if(props) {
		forEach(props, function(p) {
			if(p == 'click' || p == 'mousedown' || p == 'mousedown') {
				n.addEventListener(p, props[p], false);
			} else {
				n[p] = props[p];
			}
		});
	}
	return n;
}

function forEach(o, f) {
	var props = Object.keys(o);
	for(var i = props.length, p; i-- && (p = props[i]);) {
		if(o.hasOwnProperty(p)) f(p);
	}
}

function rm(id) {
	var node = document.getElementById(id);
	if(node) node.parentNode.removeChild(node);
}

var d = document;

var setup = {
	id: 'EHF-setup',
	html: function() {
		var h = '<div>Eishockeyforum.com - Ignorierfunktion</div><ul>';
		this.forEach(function(n) {
			var s = cfg.settings[n];
			if(typeof s.default == 'string') {
				h += '<li> ' + s.title + ': (keine Leerzeichen oder Komma am Ende!)<br><textarea onkeypress="javascript:if(event.keyCode==13){return false;}" value="" cols="100" style="width:100%;" name="' + n + '"></textarea></li>';
			}
		});
		return h += '</ul><div><button name="save">Speichern</button>&nbsp;<button name="close">Schließen</button>&nbsp;&nbsp;&nbsp;<button name="ignreset">Zurücksetzen</button></div></div>'
	},
	q: function(n) {
		return d.querySelector('#' + this.id + ' *[name="' + n + '"]');
	},
	get: function(n) {
		return this.q(n).value;
	},
	set: function(n, val) {
		this.q(n).value = val;
	},
	forEach: function(f) {
		forEach(cfg.settings, function(n) { if(cfg.settings[n].title) f(n); });
	},
	show: function() {
	    rm(setup.id);
	    GM_addStyle('\
	        #'+setup.id+' { z-index:10001;position:fixed;top:36%;left:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);padding:20px 30px;background-color:white;border:1px solid black }\
	        #'+setup.id+' * { color:black;text-align:left;line-height:normal;font-size:12px }\
	        #'+setup.id+' div { text-align:center;font-weight:bold;font-size:14px }\
	        #'+setup.id+' ul { margin:15px 0 15px 0;padding:0;list-style:none }\
	        #'+setup.id+' li { margin:0;padding:3px 0 3px 0;vertical-align:middle }'
	    );
		d.body.appendChild(ce('div', {id:setup.id,innerHTML:setup.html()}));
		setup.q('save').addEventListener('click', function() {
			setup.forEach(function(n) { cfg[n] = setup.get(n); });
			cfg.x = cfg.y = false;
			cfg.save();
			this.disabled = true;
			this.innerHTML = 'Aktualisieren...';
			ehfregexp();
			window.location.reload();
		}, false);
		setup.q('ignreset').addEventListener('click', function() {
      reset_frage();
		}, false);
		setup.q('close').addEventListener('click', function() {
      rm(setup.id);
		}, false);
		setup.forEach(function(n) {
			setup.set(n, cfg[n]);
			//setup.q(n).addEventListener('change', setup.update, false);
		});
		//setup.update();
	},
	/*
	update: function() {
		setup.forEach(function(n) {
			var s = cfg.settings[n];
			if(!s.depends) return;
			setup.q(n).parentNode.style.display = (Object.keys(s.depends).every(function(dn) { return s.depends[dn].test(setup.get(dn)); })) ? '' : 'none';
		});
	}
	*/
}

var cfg = {
	settings: {
		ignore: { title:'Usernamen', default:'Beispiel, Bespiel2, Beispiel 3, Beispiel-4, Beispiel.5, Beispiel #6' }
	},
	load: function() {
		forEach(cfg.settings, function(n) { cfg[n] = GM_getValue(n, cfg.settings[n].default); });
	},
	save: function() {
		forEach(cfg.settings, function(n) { if(typeof cfg[n] != 'undefined') GM_setValue(n, cfg[n]); });
	}
};

function reset_frage(){
var r=confirm("Sollen die Daten zurückgesetzt werden?");
if (r==true) {
      GM_deleteValue("ignore");
      GM_deleteValue("ignore_regex");
      window.location.reload();
      }
}

function ehfregexp(){
//var pattern2 = "Eisprinz - das Original, WiPe, iceman #2, philip -k., Powerhockey, Malone"
var pattern = GM_getValue("ignore", "pattern derp");
var regexpSpecialChars = /([\`\´\"\@\'\-\.\#\[\]\^\$\|\(\)\\\+\*\?\{\}\=\!])/gi;
var pattern = pattern.replace(regexpSpecialChars, '\\$1').replace(/\s*\,\s*/g, '|').replace(/\s/g, '\\ ');
//var pattern = new RegExp(pattern, 'i');
var pattern = pattern.replace(/\\/g, '\\');
var pattern = '/(' + pattern + ')/i';
//alert(pattern + ' 3');
GM_setValue("ignore_regex", pattern);
}
//}


function ehfignore()
{
    var itemDivs = $("strong").children("a");
    //var itemDivsQuote = $("blockquote").children("div").children("cite");
    //var itemPost = $("span.username");
    var ignoranten = eval(GM_getValue("ignore_regex","/Here\\ Be\\ Dragons/i"));
    /* var ignoranten = new RegExp(
    '('
// Moderatoren und Admins
    + 'WiPe|'
    + 'iceman|'
    + 'Powerhockey|'
    + 'Malone|'
// User
    + 'EpiD|'
    + 'Eisprinz\\ \\-\\ das\\ Original|'
    + 'Philipp\\ K\\.u\\.K\\.|'
    + 'MacReady|'
    + 'VEUforever|'
    + 'Herby\\ \\#30|'
    + 'iron\\-markus|'
    + 'sonne|'
    + 'RedDawn|'
    + 'ZigaretteDanach'
    + ')', 'i');*/
    itemDivs.each 
    (
        function()
        {
            var itemDiv = $(this);
            //alert(typeof ignoranten + ' each');
            if (ignoranten.test(itemDiv.text())) {
            //alert("blah");
                itemDiv.parent().parent().parent().children(".content").css('display','none');
                itemDiv.parent().parent().parent().children(".attachbox").css('display','none');
                itemDiv.parent().parent().parent().children(".signature").css('display','none');
                itemDiv.parent().parent().parent().parent().children(".postprofile").css('display','none');
                itemDiv.parent().parent().css("background-color", "rgba(192,192,192,0.25)");
                itemDiv.parent().parent().hover(
                  function() {
                    $( this ).css("background-color", "rgba(128,128,128,0.25)").append( $( "<span>&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;Click post</span>" ) );
                  }, function() {
                    $( this ).css("background-color", "rgba(192,192,192,0.25)").find( "span:last" ).remove();
                  }
                );
                itemDiv.parent().parent().click(
                  function() {
                      if(itemDiv.parent().parent().parent().children(".content").css("display") == 'none'){
                        itemDiv.parent().parent().parent().children(".content").css('display','block');
                        itemDiv.parent().parent().parent().children(".attachbox").css('display','block');
                        itemDiv.parent().parent().parent().children(".signature").css('display','block');
                        itemDiv.parent().parent().parent().parent().children(".postprofile").css('display','block');
                      }
                      else {
                        itemDiv.parent().parent().parent().children(".content").css('display','none');
                        itemDiv.parent().parent().parent().children(".attachbox").css('display','none');
                        itemDiv.parent().parent().parent().children(".signature").css('display','none');
                        itemDiv.parent().parent().parent().parent().children(".postprofile").css('display','none');
                      }
                  }
                );
                }
                /*itemDiv.parent().parent().parent().parent().parent().css("outline", "red dotted 2px");*/
        } 
    );
    
    /*itemDivsQuote.each
    (
        function()
        {
            var itemDiv = $(this);
            if (ignoranten.test(itemDiv.text())){
                if (!(itemDiv.children("div").css('display') == 'none') && !(itemDiv.parent().parent().children("div").css('display') == 'none')){
                //itemDiv.parent().css('outline', 'red dotted 2px');
                itemDiv.parent().parent().children("div").css('display','none');
               // if (!(itemDiv.parent("header").parent(".quoteBox").parent("div").parent(".quoteBox").parent(".messageText").length > 0)) {
                itemDiv.css("background-color", "rgba(192,192,192,0.25)").hover(
                  function() {
                    $( this ).css("background-color", "rgba(128,128,128,0.25)").append( $( "<span\ class=\"ehfscriptclick\">\&nbsp\;\&nbsp\;\&nbsp\;---\&nbsp\;\&nbsp\;\&nbsp\;Click<\/span>" ) );
                  }, function() {
                    $( this ).css("background-color", "rgba(192,192,192,0.25)").find( "span:last" ).remove();
                  }
                );
                
                itemDiv.click(function() {
                    if(itemDiv.parent().parent().children("div").css('display') == 'none')
                    {
                    itemDiv.parent().parent().children("div").css('display','block');
                    }
                    else{
                    itemDiv.parent().parent().children("div").css('display','none');
                    }
                });
               }
               //}
             }
        }
    );*/
    /*itemPost.each 
    (
        function()
        {
            var itemDiv = $(this);
            //alert(typeof ignoranten + ' each');
            if (ignoranten.test(itemDiv.text())) {
                itemDiv.parent().parent().parent().children(".framed").css('display','none');
                itemDiv.parent().parent().parent().parent().parent().children(".messageBody").children("div").children(".messageText").css('display','none');
                itemDiv.css("background-color", "rgba(192,192,192,0.25)");
                itemDiv.hover(
                  function() {
                    $( this ).css("background-color", "rgba(128,128,128,0.25)").append( $( "<span>&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;Click post</span>" ) );
                  }, function() {
                    $( this ).css("background-color", "rgba(192,192,192,0.25)").find( "span:last" ).remove();
                  }
                );
                itemDiv.click(
                  function() {
                      if(itemDiv.parent().parent().parent().parent().parent().children(".messageBody").children("div").children(".messageText").css("display") === 'none'){
                        itemDiv.parent().parent().parent().children(".framed").css('display','block');
                        itemDiv.parent().parent().parent().parent().parent().children(".messageBody").children("div").children(".messageText").css('display','block');
                      } else {
                        itemDiv.parent().parent().parent().children(".framed").css('display','none');
                        itemDiv.parent().parent().parent().parent().parent().children(".messageBody").children("div").children(".messageText").css('display','none');
                      }
                  }
                );
                }
                //itemDiv.parent().parent().parent().parent().parent().css("outline", "red dotted 2px");
        } 
    );*/
  unread();
}

function unread(){
  var url = window.location.href;
  var type = url.split('#');
  var hash = '';
  if(type.length > 1){
    hash = type[1];
    //$(window).scrollTop($('a#' + hash).position().top);
    //alert(hash);
    var element_to_scroll_to = document.getElementById(hash);
    element_to_scroll_to.scrollIntoView(true);
  }
}
/*if(window.location.hash) {
  alert(window.location.hash.substr(1));
} else {
  // Fragment doesn't exist
}*/
/*
$("ul.messageList").bind("DOMSubtreeModified", function() {
    setTimeout(function(){ehfignore();},500);
});
*/
// http://stackoverflow.com/questions/6309870/if-contains-certain-text-then-run-jquery
//http://wiki.greasespot.net/Greasemonkey_access_violation