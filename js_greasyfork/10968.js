// ==UserScript==
// @name        Sadpanda torrent inline
// @namespace   exh
// @description Inlines torrent into to gallery view in sadpanda & regular panda, and adds a hotkey to download the most popular torrent.
// @include     http://exhentai.org/g/*
// @include     https://exhentai.org/g/*
// @include			http://g.e-hentai.org/g/*
// @include			https://g.e-hentai.org/g/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10968/Sadpanda%20torrent%20inline.user.js
// @updateURL https://update.greasyfork.org/scripts/10968/Sadpanda%20torrent%20inline.meta.js
// ==/UserScript==


var link = getTorrentLink();
loadTorrentHtml(link);



function getTorrentLink() {
  var EXTRACT_URL_REGEX = /http.*\.php\?[a-zA-Z0-9&=]*/
  var linkElm = $('.gm a:contains("Torrent")')
  var link = linkElm.attr('onclick').match(EXTRACT_URL_REGEX);
  
  return link;
}

function loadTorrentHtml(link) {
  
  $.get(link,null,function(a,b,c) {    
    var data = extractTorrentInfoFromResp(a);
    data = $('<div></div>').append(data);
    data.addClass('gm');
		data.addClass('torrent-info');
    data.css('background','inherit');
    
    addHotkeys(data);
    
    var target = $('.gm').first();    
    target.after(data);
    
    //document.body.insertBefore(data[0],document.body.firstChild);
    
  })  
}

function addHotkeys(data) {
  
  var items = data.find('form');
  var maxDownloads = 0;
  var activeTorrent = null;
  var activeTorrentInfo = null;
  
  for (var i = 0; i < items.length; i++) {
    var tInfo = getTorrentInfo($(items[i]));
    
    if (tInfo.downloads > maxDownloads) {
			maxDownloads = tInfo.downloads;
      activeTorrent = $(items[i]);   
      activeTorrentInfo = tInfo;
    }       
  }
  
  if (activeTorrent) {
    addHotkey(activeTorrent);
  }
}

function addHotkey(item) {
  var cell = item.find('tr').first().find('td')[2];
  cell = $(cell);
  cell.css('font-weight','bold');
  cell.css('color','red');
  cell.css('font-size','125%');
  cell.text("Press space to download");
  
  var linkElm = item.find('a');
  
  shortcut.add('space', function() {
    linkElm[0].click();    
  });
}

function getTorrentInfo(item) {
  var seedsElm = item.find('span:Contains("Seeds")');
  var peersElm = item.find('span:Contains("Peers")');
  var downloadsElm = item.find('span:Contains("Downloads")');
  var sizeElm = item.find('span:Contains("Size")');
  var postedElm = item.find('span:Contains("Posted")'); 
  return {
    seeds: getInfo(seedsElm), 
    peers: getInfo(peersElm), 
    downloads: getInfo(downloadsElm), 
    size: getInfo(sizeElm), 
    posted: getInfo(postedElm)    
  }
}

function getInfo(elm) {  
  return parseInt(getTextComponent(elm.parent()))  
}
  
function getTextComponent(elm) {
    return elm.clone()    //clone the element
    .children() //select all the children
    .remove()   //remove all the children
    .end()  //again go back to selected element
    .text();
}

function extractTorrentInfoFromResp(resp) {
  
  var res = $(resp).find('#torrentinfo form');
  res.splice(res.length-1,1);
  return res;
  
}

function writeInfo(info) {
  
  
  var d = $('<div>' + info + '</div>')  
  document.body.insertBefore(d[0],document.body.firstChild);  
}








/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
	
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}