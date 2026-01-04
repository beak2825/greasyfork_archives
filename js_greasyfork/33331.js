// ==UserScript==
// @name    BETA Elite shoutbox
// @match   https://elite-tracker.net
// @match   https://elite-tracker.net/index.php*
// @match   https://elite-tracker.net/ts_shoutbox/ts_update_shout.php
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @version 0.1.2.0
// @description Ce script permet de cacher les messages système.
// @run-at document-start
// @namespace https://greasyfork.org/users/74987
// @downloadURL https://update.greasyfork.org/scripts/33331/BETA%20Elite%20shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/33331/BETA%20Elite%20shoutbox.meta.js
// ==/UserScript==


var hide=false;


var HideDupe = false;
var HideMember = false;
var HideSystem = false;

//var IgnoreList = ['Earl', 'Kara'];
var IgnoreList = [];

var addMemberList=[];
var removeMemberList=[];

if (window.top === window.self) {

}
else {
}

function parseHtml(html) {

  // replace html, head and body tag with html_temp, head_temp and body_temp
  html = html.replace(/<!DOCTYPE HTML>/i, '<doctype></doctype>');
  html = html.replace(/(<\/?(?:html)|<\/?(?:head)|<\/?(?:body))/ig, '$1_temp');

  // wrap the dom into a <container>: the html() function returns only the contents of an element
  html = "<container>"+html+"</container>";
  var element = $(html); // parse the html

  return element;
}

function convertBackToHtml(element) {

  // reset the initial changes (_temp)
  var extended_html = element.html();
  extended_html = extended_html.replace(/<doctype><\/doctype>/, '<!DOCTYPE HTML>');
  extended_html = extended_html.replace(/(<\/?html)_temp/ig, '$1');
  extended_html = extended_html.replace(/(<\/?head)_temp/ig, '$1');
  extended_html = extended_html.replace(/(<\/?body)_temp/ig, '$1');

  // replace all &quot; inside data-something=""
  while(extended_html.match(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g)) {
    extended_html = extended_html.replace(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g, "$1'$3");
  }

  return extended_html;
}

function readStringLocalStorage(name){
    return localStorage.getItem("shout_"+name);
}

function readBoolLocalStorage(name){
    return (localStorage.getItem("shout_"+name) == 'true');
}

function readListLocalStorage(name){
    value = localStorage.getItem("shout_"+name);
    if (value)
        return value.split(",");
    return;
}

function writeLocalStorage(name, value){
    localStorage.setItem("shout_"+name, value);
}

function addMember(pseudo){
    pseudolc = pseudo.toLowerCase();
    if (addMemberList.indexOf(pseudolc)==-1 && IgnoreList.indexOf(pseudolc)==-1)
    {
        $("#ListMember").append("<l>"+pseudo+"</l><br>");
        addMemberList.push(pseudo);
    }
}

function removeMember(pseudo){
    pseudolc = pseudo.toLowerCase();

    if (addMemberList.indexOf(pseudolc)==-1)
    {
        $("#ListMember").append("<l>"+pseudo+" <i id='remove_member' class='remove_member fa fa-minus-circle' aria-hidden='true' style='color:red'></i></l><br>");
        //removeMemberList.push(pseudo);
    }
}


var rawOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function() {
	if (!this._hooked) {
		this._hooked = true;
		setupHook(this);
	}
	rawOpen.apply(this, arguments);
};

function setupHook(xhr) {
	function getter() {
		console.log('get responseText');

		delete xhr.responseText;

        var ret = xhr.responseText;

        doc = parseHtml(ret);

        doc.find(".shoutboxnotice").each(function() {

            var List_a = $( this ).find('a');
            if (List_a.length>0)
            {
                FirstBalise=List_a[0];
                ValueAttributeHref = FirstBalise.getAttribute("href");
                if (ValueAttributeHref)
                {
                    var tiiiii = ValueAttributeHref.indexOf("-s-");
                    if (ValueAttributeHref.indexOf("-s-") !== -1 && ValueAttributeHref.indexOf("-s-") > ValueAttributeHref.length-13)
                    {
                        console.log(ValueAttributeHref);
                        newhref = ValueAttributeHref.replace("-s-","-d-");
                        $(FirstBalise).attr("href", newhref);
                    }
                }
            }
        });

        setup();
        var HTMLCustom =  convertBackToHtml(doc);

		return HTMLCustom;
	}

	function setter(str) {
		console.log('set responseText: %s', str);
	}

	function setup() {
		Object.defineProperty(xhr, 'responseText', {
			get: getter,
			set: setter,
			configurable: true
		});
	}
	setup();
}