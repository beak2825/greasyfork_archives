// ==UserScript==
// @name         keyControl
// @namespace    
// @version      0.21
// @description  various utility key presses to save mouse usage
// @author       Rothman
// @match        http://localhost:8000/*.html
// @match        https://*.crownofthegods.com/World*.php
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @require       http://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13201/keyControl.user.js
// @updateURL https://update.greasyfork.org/scripts/13201/keyControl.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0.
    It restores the sandbox.
*/
// @grant        none


(function ($, undefined) {
  $(function () {
    //Your code here;

// the keybord shortcuts code would not load properly in Tampermonkey @require
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
		};
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
		var func = _.debounce(function(e) {
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
			};
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
			};
	
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
		}, 500);  // run maximum of once per 500 msecs
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
		delete(this.all_shortcuts[shortcut_combination]);
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
};



shortcut.add("Shift+1",function() {
    $( "#reports" ).click();
});
shortcut.add("Shift+2",function() {
    $( "#rewards" ).click();
});
shortcut.add("Shift+3",function() {
    $( "#research" ).click();
});
shortcut.add("Shift+4",function() {
    $( "#overviews" ).click();
});
shortcut.add("Shift+5",function() {
    $( "#rankings" ).click();
});
shortcut.add("Shift+6",function() {
    $( "#mail" ).click();
});
shortcut.add("Shift+7",function() {
    $( "#alliance" ).click();
});
shortcut.add("Shift+8",function() {
    $( "#friends" ).click();
});
shortcut.add("Shift+9",function() {
    $( "#items" ).click();
});
shortcut.add("Shift+0",function() {
    $( "#cityButton" ).click();
});

// these next two not working for some reason
//
shortcut.add("Shift+_",function() {
    $( "#regionButton" ).click();
});
shortcut.add("Shift++",function() {
    $( "#worldButton" ).click();
});



var RaidIdx=1;

// councillor raid functionality
// open with Shift+R, set raid Alt+R, next city Alt+G
shortcut.add("Shift+R",function() {
    $( "#loccavwarconGo" ).click();
  // the war councillor cavern raid is now open
  // set the selected raid to first in list
  RaidIdx = 1;
  // give councilllor time to open
  setTimeout( function(){$('#dungloctab tr:nth-child(' + RaidIdx + ') td.cityblink').css('background', 'red');}, 500);
});

shortcut.add("Alt+G",function() {
  RaidIdx = 1;
  $( "#nidleGo" ).click();
  setTimeout( function(){$('#dungloctab tr:nth-child(' + RaidIdx + ') td.cityblink').css('background', 'red');}, 500);
});

shortcut.add("space",function() {
  $('#dungloctab tr:nth-child(' + RaidIdx + ') td:eq(0) button').click();

  // move to next row
  // focus on count
  setTimeout( function(){$('#dungloctab tr:nth-child(' + parseInt(RaidIdx + 1) + ') td:eq(0) table:eq(0) tr:eq(0) td:eq(0) select').focus();}, 500);
  //$('#dungloctab tr:nth-child(' + parseInt(RaidIdx + 1) + ') td:eq(0) table:eq(1) tr:eq(0) td:eq(2)').focus();
});

shortcut.add("Alt+R",function() {
  // click the selected RaidIdx button, and then try to execute raid
  // no attempt at the moment to try to set a count
  //
  $('#dungloctab tr:nth-child(' + RaidIdx + ') td:eq(0) button').click();

  setTimeout( function(){$( "#raidaidGo" ).click();}, 1000);
    
});

shortcut.add("down",function() {
  // this used for many purposes
  //

  // this button is on the councillor dungeon raid tab - specific to find dungeons
  if ($('#findung').is(':visible'))
    {
      // use the arrow keys to navigate through set of caverns
      $('#dungloctab tr:nth-child(' + RaidIdx + ') td.cityblink').css('background', 'beige');
      ++RaidIdx;
      $('#dungloctab tr:nth-child(' + RaidIdx + ') td.cityblink').css('background', 'red');
    }
});


shortcut.add("up",function() {
  // this used for many purposes
  //

  // this button is on the councillor dungeon raid tab - specific to find dungeons
  if ($('#findung').is(':visible'))
    {
      // use the arrow keys to navigate through set of caverns
      $('#dungloctab tr:nth-child(' + RaidIdx + ') td.cityblink').css('background', 'beige');

      RaidIdx = RaidIdx>0 ? RaidIdx-1: RaidIdx;
      $('#dungloctab tr:nth-child(' + RaidIdx + ') td.cityblink').css('background', 'red');
    }
});


// some keys are missing from the keyboard shortcut code
//
var keyCodeLeftSquareBracket = 219;
var keyCodeRightSquareBracket = 221;

$( "body" ).keydown(function(e) {
  console.log( "Handler for .keypress() called..." + e.which);
  switch(e.which) {

  case keyCodeLeftSquareBracket: // previous city
    $( "#arrowPreviousCityButton" ).click();
    $('#Queues').animate({ scrollTop: 0 }, "slow");
    e.preventDefault();
    break;

  case keyCodeRightSquareBracket: // next city
    $('#Queues').animate({ scrollTop: 0 }, "slow");
    $( "#arrowNextCityButton" ).click();
    e.preventDefault();
    break;

    default:
    // pass the key event through

  }
  

});


  });
})(window.jQuery.noConflict(true));
