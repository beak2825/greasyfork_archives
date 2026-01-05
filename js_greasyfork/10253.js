// ==UserScript==
// @name           bw-text-rapidpanel
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn/*
// @exclude http://www.bloodyworld.com/xfn2/*
// @version 0.0.1.20150604004702
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10253/bw-text-rapidpanel.user.js
// @updateURL https://update.greasyfork.org/scripts/10253/bw-text-rapidpanel.meta.js
// ==/UserScript==
// (c) Anton Fedorov aka DataCompBoy, 2006-2007
// Clan <The Keepers of Balance>.

  window.opera.defineMagicFunction(
	'RP_ajaxCompleteUse',
	function (real, thisObject) {
	  var content = '<div style="margin: 0px; padding: 0px; position: absolute; z-index: 100; right: 10px; top: 0;">';
	  content += '<table style="border: 1px solid blue" border="0" cellpadding="0">';
	  for ( var i = 1; i < RP_slots.length; i++) {
		var el = RP_slots[i];
		var num_slot = i;
		if (!((i-1) % 4)) content += '<tr>';
		if (el) {
		  if (el.item_type=='complete') {
			var image_src=RP_layout_url_all+'/subject/rapid/shlem' + el.image + '.gif';
		  } else {
			var image = el.image.replace(/01\.gif/, "00.gif");
			var image_src = RP_layout_url_all+'/subject' + image;
		  }
		  var onclick = "RP_useSlot(" + el.slot + ")";
		  var comment_alt = num_slot;
		  var comment_title = 'Slot ' + num_slot + ': ' + el.name + '';
		  content += '<td style="width: 20; height: 20;" id="slot_'
					 + num_slot + '"><img onclick="' + onclick
					 + ';" src="' + image_src + '" alt="' + comment_alt + '" title="' + comment_title + '" border="0"></td>';
		} else {
		  content += '<td style="width: 20; height: 20;" id="slot_'
					 + num_slot + '"><img src="'+RP_layout_url_all+'/subject/defaults/ge-spell.gif"></td>';
		}
	  }
	  content += '</tr></table></div>';
	  $('RP_use').innerHTML = content;
	}
  );

  window.opera.addEventListener('AfterEvent.load',function(e){
	if( e.event.target instanceof Document ) {
	  openMenu();
	}
  },false);
