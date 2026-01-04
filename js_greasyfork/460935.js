// ==UserScript==
// @name         28chan Options
// @namespace    28chop
// @version      0.1.1
// @description  Userscript that adds the vichan options JS.
// @author       Eye of Horus
// @match        https://www.28chan.org/board/*
// @icon         https://www.28chan.org//board/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460935/28chan%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/460935/28chan%20Options.meta.js
// ==/UserScript==

/*
 * options.js - allow users choose board options as they wish
 *
 * Copyright (c) 2014 Marcin Łabanowski <marcin@6irc.net>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/options.js';
 */

+function(){

var options_button, options_handler, options_background, options_div
  , options_close, options_tablist, options_tabs, options_current_tab;

var Options = {};
window.Options = Options;

var first_tab = function() {
  for (var i in options_tabs) {
    return i;
  }
  return false;
};

Options.show = function() {
  if (!options_current_tab) {
    Options.select_tab(first_tab(), true);
  }
  options_handler.fadeIn();
};
Options.hide = function() {
  options_handler.fadeOut();
};

options_tabs = {};

Options.add_tab = function(id, icon, name, content) {
  var tab = {};

  if (typeof content == "string") {
    content = $("<div>"+content+"</div>");
  }

  tab.id = id;
  tab.name = name;
  tab.icon = $("<div class='options_tab_icon'><i class='fa fa-"+icon+"'></i><div>"+name+"</div></div>");
  tab.content = $("<div class='options_tab'></div>").css("display", "none");

  tab.content.appendTo(options_div);

  tab.icon.on("click", function() {
    Options.select_tab(id);
  }).appendTo(options_tablist);

  $("<h2>"+name+"</h2>").appendTo(tab.content);

  if (content) {
    content.appendTo(tab.content);
  }

  options_tabs[id] = tab;

  return tab;
};

Options.get_tab = function(id) {
  return options_tabs[id];
};

Options.extend_tab = function(id, content) {
  if (typeof content == "string") {
    content = $("<div>"+content+"</div>");
  }

  content.appendTo(options_tabs[id].content);

  return options_tabs[id];
};

Options.select_tab = function(id, quick) {
  if (options_current_tab) {
    if (options_current_tab.id == id) {
      return false;
    }
    options_current_tab.content.fadeOut();
    options_current_tab.icon.removeClass("active");
  }
  var tab = options_tabs[id];
  options_current_tab = tab;
  options_current_tab.icon.addClass("active");
  tab.content[quick? "show" : "fadeIn"]();

  return tab;
};

options_handler = $("<div id='options_handler'></div>").css("display", "none");
options_background = $("<div id='options_background'></div>").on("click", Options.hide).appendTo(options_handler);
options_div = $("<div id='options_div'></div>").appendTo(options_handler);
options_close = $("<a id='options_close' href='javascript:void(0)'><i class='fa fa-times'></i></div>")
  .on("click", Options.hide).appendTo(options_div);
options_tablist = $("<div id='options_tablist'></div>").appendTo(options_div);


$(function(){
  options_button = $("<a href='javascript:void(0)' title='"+_("Options")+"'>["+_("Options")+"]</a>").css("float", "right");

  if ($(".boardlist.compact-boardlist").length) {
    options_button.addClass("cb-item cb-fa").html("<i class='fa fa-gear'></i>");
  }

  if ($(".boardlist:first").length) {
    options_button.appendTo($(".boardlist:first"));
  }
  else {
    options_button.prependTo($(document.body));
  }

  options_button.on("click", Options.show);

  options_handler.appendTo($(document.body));
});



}();

/*
 * options/general.js - general settings tab for options panel
 *
 * Copyright (c) 2014 Marcin Łabanowski <marcin@6irc.net>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/options.js';
 *   $config['additional_javascript'][] = 'js/style-select.js';
 *   $config['additional_javascript'][] = 'js/options/general.js';
 */

+function(){

var tab = Options.add_tab("general", "home", _("General"));

$(function(){
  var stor = $("<div>"+_("Storage: ")+"</div>");
  stor.appendTo(tab.content);

  $("<button>"+_("Export")+"</button>").appendTo(stor).on("click", function() {
    var str = JSON.stringify(localStorage);

    $(".output").remove();
    $("<input type='text' class='output'>").appendTo(stor).val(str);
  });
  $("<button>"+_("Import")+"</button>").appendTo(stor).on("click", function() {
    var str = prompt(_("Paste your storage data"));
    if (!str) return false;
    var obj = JSON.parse(str);
    if (!obj) return false;

    localStorage.clear();
    for (var i in obj) {
      localStorage[i] = obj[i];
    }

    document.location.reload();
  });
  $("<button>"+_("Erase")+"</button>").appendTo(stor).on("click", function() {
    if (confirm(_("Are you sure you want to erase your storage? This involves your hidden threads, watched threads, post password and many more."))) {
      localStorage.clear();
      document.location.reload();
    }
  });


  $("#style-select").detach().css({float:"none","margin-bottom":0}).appendTo(tab.content);
});

}();

/*
 * options/user-css.js - allow user enter custom css entries
 *
 * Copyright (c) 2014 Marcin Łabanowski <marcin@6irc.net>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/options.js';
 *   $config['additional_javascript'][] = 'js/options/user-css.js';
 */

+function(){

var tab = Options.add_tab("user-css", "css3", _("User CSS"));

var textarea = $("<textarea></textarea>").css({
  "font-size": 12,
  position: "absolute",
  top: 35, bottom: 35,
  width: "calc(100% - 20px)", margin: 0, padding: "4px", border: "1px solid black",
  left: 5, right: 5
}).appendTo(tab.content);
var submit = $("<input type='button' value='"+_("Update custom CSS")+"'>").css({
  position: "absolute",
  height: 25, bottom: 5,
  width: "calc(100% - 10px)",
  left: 5, right: 5
}).click(function() {
  localStorage.user_css = textarea.val();
  apply_css();
}).appendTo(tab.content);

var apply_css = function() {
  $('.user-css').remove();
  $('link[rel="stylesheet"]')
    .last()
    .after($("<style></style>")
      .addClass("user-css")
      .text(localStorage.user_css)
    );
};

var update_textarea = function() {
  if (!localStorage.user_css) {
    textarea.text("/* "+_("Enter here your own CSS rules...")+" */\n" +
                  "/* "+_("If you want to make a redistributable style, be sure to\nhave a Yotsuba B theme selected.")+" */\n" +
                  "/* "+_("You can include CSS files from remote servers, for example:")+" */\n" +
                  '@import "http://example.com/style.css";');
  }
  else {
    textarea.text(localStorage.user_css);
    apply_css();
  }
};

update_textarea();


}();

/*
 * options/user-js.js - allow user enter custom javascripts
 *
 * Copyright (c) 2014 Marcin Łabanowski <marcin@6irc.net>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/options.js';
 *   $config['additional_javascript'][] = 'js/options/user-js.js';
 */

+function(){

var tab = Options.add_tab("user-js", "code", _("User JS"));

var textarea = $("<textarea></textarea>").css({
  "font-size": 12,
  position: "absolute",
  top: 35, bottom: 35,
  width: "calc(100% - 20px)", margin: 0, padding: "4px", border: "1px solid black",
  left: 5, right: 5
}).appendTo(tab.content);
var submit = $("<input type='button' value='"+_("Update custom Javascript")+"'>").css({
  position: "absolute",
  height: 25, bottom: 5,
  width: "calc(100% - 10px)",
  left: 5, right: 5
}).click(function() {
  localStorage.user_js = textarea.val();
  document.location.reload();
}).appendTo(tab.content);

var apply_js = function() {
  var proc = function() {
    $('.user-js').remove();
    $('script')
      .last()
      .after($("<script></script>")
        .addClass("user-js")
        .text(localStorage.user_js)
      );
  }

  if (/immediate()/.test(localStorage.user_js)) {
    proc(); // Apply the script immediately
  }
  else {
    $(proc); // Apply the script when the page fully loads
  }
};

var update_textarea = function() {
  if (!localStorage.user_js) {
    textarea.text("/* "+_("Enter here your own Javascript code...")+" */\n" +
                  "/* "+_("Have a backup of your storage somewhere, as messing here\nmay render you this website unusable.")+" */\n" +
                  "/* "+_("You can include JS files from remote servers, for example:")+" */\n" +
                  'load_js("http://example.com/script.js");');
  }
  else {
    textarea.text(localStorage.user_js);
    apply_js();
  }
};

update_textarea();


// User utility functions
window.load_js = function(url) {
  $('script')
    .last()
    .after($("<script></script>")
      .prop("type", "text/javascript")
      .prop("src", url)
    );
};
window.immediate = function() { // A dummy function.
}

}();









/*
 * post-menu.js - adds dropdown menu to posts
 *
 * Creates a global Menu object with four public methods:
 *
 *   Menu.onclick(fnc)
 *     registers a function to be executed after button click, before the menu is displayed
 *   Menu.add_item(id, text[, title])
 *     adds an item to the top level of menu
 *   Menu.add_submenu(id, text)
 *     creates and returns a List object through which to manipulate the content of the submenu
 *   Menu.get_submenu(id)
 *     returns the submenu with the specified id from the top level menu
 *
 *   The List object contains all the methods from Menu except onclick()
 *
 *   Example usage:
 *     Menu.add_item('filter-menu-hide', 'Hide post');
 *     Menu.add_item('filter-menu-unhide', 'Unhide post');
 *
 *     submenu = Menu.add_submenu('filter-menu-add', 'Add filter');
 *         submenu.add_item('filter-add-post-plus', 'Post +', 'Hide post and all replies');
 *         submenu.add_item('filter-add-id', 'ID');
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/post-menu.js';
 */
$(document).ready(function () {

var List = function (menuId, text) {
	this.id = menuId;
	this.text = text;
	this.items = [];

	this.add_item = function (itemId, text, title) {
		this.items.push(new Item(itemId, text, title));
	};
	this.list_items = function () {
		var array = [];
		var i, length, obj, $ele;

		if ($.isEmptyObject(this.items))
			return;

		length = this.items.length;
		for (i = 0; i < length; i++) {
			obj = this.items[i];

			$ele = $('<li>', {id: obj.id}).text(obj.text);
			if ('title' in obj) $ele.attr('title', obj.title);

			if (obj instanceof Item) {
				$ele.addClass('post-item');
			} else {
				$ele.addClass('post-submenu');

				$ele.prepend(obj.list_items());
				$ele.append($('<span>', {class: 'post-menu-arrow'}).text('»'));
			}

			array.push($ele);
		}

		return $('<ul>').append(array);
	};
	this.add_submenu = function (menuId, text) {
		var ele = new List(menuId, text);
		this.items.push(ele);
		return ele;
	};
	this.get_submenu = function (menuId) {
		for (var i = 0; i < this.items.length; i++) {
			if ((this.items[i] instanceof Item) || this.items[i].id != menuId) continue;
			return this.items[i];
		}
	};
};

var Item = function (itemId, text, title) {
	this.id = itemId;
	this.text = text;

	// optional
	if (typeof title != 'undefined') this.title = title;
};

function buildMenu(e) {
	var pos = $(e.target).offset();
	var i, length;

	var $menu = $('<div class="post-menu"></div>').append(mainMenu.list_items());

	//  execute registered click handlers
	length = onclick_callbacks.length;
	for (i = 0; i < length; i++) {
		onclick_callbacks[i](e, $menu);
	}

	//  set menu position and append to page
	 $menu.css({top: pos.top, left: pos.left + 20});
	 $('body').append($menu);
}

function addButton(post) {
	var $ele = $(post);
	$ele.find('input.delete').after(
		$('<a>', {href: '#', class: 'post-btn', title: 'Post menu'}).text('▶')
	);
}


/* * * * * * * * * *
    Public methods
 * * * * * * * * * */
var Menu = {};
var mainMenu = new List();
var onclick_callbacks = [];

Menu.onclick = function (fnc) {
	onclick_callbacks.push(fnc);
};

Menu.add_item = function (itemId, text, title) {
	mainMenu.add_item(itemId, text, title);
};

Menu.add_submenu = function (menuId, text) {
	return mainMenu.add_submenu(menuId, text);
};

Menu.get_submenu = function (id) {
	return mainMenu.get_submenu(id);
};

window.Menu = Menu;


/* * * * * * * *
    Initialize
 * * * * * * * */

/*  Styling
 */
var $ele, cssStyle, cssString;

$ele = $('<div>').addClass('post reply').hide().appendTo('body');
cssStyle = $ele.css(['border-top-color']);
cssStyle.hoverBg = $('body').css('background-color');
$ele.remove();

cssString =
	'\n/*** Generated by post-menu ***/\n' +
	'.post-menu {position: absolute; font-size: 12px; line-height: 1.3em;}\n' +
	'.post-menu ul {\n' +
	'    background-color: '+ cssStyle['border-top-color'] +'; border: 1px solid #666;\n' +
	'    list-style: none; padding: 0; margin: 0; white-space: nowrap;\n}\n' +
	'.post-menu .post-submenu{white-space: normal; width: 90px;}' +
	'.post-menu .post-submenu>ul{white-space: nowrap; width: auto;}' +
	'.post-menu li {cursor: pointer; position: relative; padding: 4px 4px; vertical-align: middle;}\n' +
	'.post-menu li:hover {background-color: '+ cssStyle.hoverBg +';}\n' +
	'.post-menu ul ul {display: none; position: absolute;}\n' +
	'.post-menu li:hover>ul {display: block; left: 100%; margin-top: -3px;}\n' +
	'.post-menu-arrow {float: right; margin-left: 10px;}\n' +
	'.post-menu.hidden, .post-menu .hidden {display: none;}\n' +
	'.post-btn {transition: transform 0.1s; width: 15px; text-align: center; font-size: 10pt; opacity: 0.8; text-decoration: none; margin: -6px 0px 0px -5px !important; display: inline-block;}\n' +
	'.post-btn:hover {opacity: 1;}\n' +
	'.post-btn-open {transform: rotate(90deg);}\n';

if (!$('style.generated-css').length) $('<style class="generated-css">').appendTo('head');
$('style.generated-css').html($('style.generated-css').html() + cssString);

/*  Add buttons
 */
$('.reply:not(.hidden), .thread>.op').each(function () {
	addButton(this);
 });

 /*  event handlers
  */
$('form[name=postcontrols]').on('click', '.post-btn', function (e) {
	e.preventDefault();
	var post = e.target.parentElement.parentElement;
	$('.post-menu').remove();

	if ($(e.target).hasClass('post-btn-open')) {
		$('.post-btn-open').removeClass('post-btn-open');
	} else {
		//  close previous button
		$('.post-btn-open').removeClass('post-btn-open');
		$(post).find('.post-btn').addClass('post-btn-open');

		buildMenu(e);
	}
});

$(document).on('click', function (e){
	if ($(e.target).hasClass('post-btn') || $(e.target).hasClass('post-submenu'))
		return;

	$('.post-menu').remove();
	$('.post-btn-open').removeClass('post-btn-open');
});

// on new posts
$(document).on('new_post', function (e, post) {
	addButton(post);
});

$(document).trigger('menu_ready');
});


if (active_page === 'thread' || active_page === 'index' || active_page === 'catalog' || active_page === 'ukko') {
	$(document).on('menu_ready', function () {
		'use strict';

		// returns blacklist object from storage
		function getList() {
			return JSON.parse(localStorage.postFilter);
		}

		// stores blacklist into storage and reruns the filter
		function setList(blacklist) {
			localStorage.postFilter = JSON.stringify(blacklist);
			$(document).trigger('filter_page');
		}

		// unit: seconds
		function timestamp() {
			return Math.floor((new Date()).getTime() / 1000);
		}

		function initList(list, boardId, threadId) {
			if (typeof list.postFilter[boardId] == 'undefined') {
				list.postFilter[boardId] = {};
				list.nextPurge[boardId] = {};
			}
			if (typeof list.postFilter[boardId][threadId] == 'undefined') {
				list.postFilter[boardId][threadId] = [];
			}
			list.nextPurge[boardId][threadId] = {timestamp: timestamp(), interval: 86400};  // 86400 seconds == 1 day
		}

		function addFilter(type, value, useRegex) {
			var list = getList();
			var filter = list.generalFilter;
			var obj = {
				type: type,
				value: value,
				regex: useRegex
			};

			for (var i=0; i<filter.length; i++) {
				if (filter[i].type == type && filter[i].value == value && filter[i].regex == useRegex)
					return;
			}

			filter.push(obj);
			setList(list);
			drawFilterList();
		}

		function removeFilter(type, value, useRegex) {
			var list = getList();
			var filter = list.generalFilter;

			for (var i=0; i<filter.length; i++) {
				if (filter[i].type == type && filter[i].value == value && filter[i].regex == useRegex) {
					filter.splice(i, 1);
					break;
				}
			}

			setList(list);
			drawFilterList();
		}

		function nameSpanToString(el) {
			var s = '';

			$.each($(el).contents(), function(k,v) {
				if (v.nodeName === 'IMG')
					s=s+$(v).attr('alt')

				if (v.nodeName === '#text')
					s=s+v.nodeValue
			});
			return s.trim();
		}

		var blacklist = {
			add: {
				post: function (boardId, threadId, postId, hideReplies) {
					var list = getList();
					var filter = list.postFilter;

					initList(list, boardId, threadId);

					for (var i in filter[boardId][threadId]) {
						if (filter[boardId][threadId][i].post == postId) return;
					}
					filter[boardId][threadId].push({
						post: postId,
						hideReplies: hideReplies
					});
					setList(list);
				},
				uid: function (boardId, threadId, uniqueId, hideReplies) {
					var list = getList();
					var filter = list.postFilter;

					initList(list, boardId, threadId);

					for (var i in filter[boardId][threadId]) {
						if (filter[boardId][threadId][i].uid == uniqueId) return;
					}
					filter[boardId][threadId].push({
						uid: uniqueId,
						hideReplies: hideReplies
					});
					setList(list);
				}
			},
			remove: {
				post: function (boardId, threadId, postId) {
					var list = getList();
					var filter = list.postFilter;

					// thread already pruned
					if (typeof filter[boardId] == 'undefined' || typeof filter[boardId][threadId] == 'undefined')
						return;

					for (var i=0; i<filter[boardId][threadId].length; i++) {
						if (filter[boardId][threadId][i].post == postId) {
							filter[boardId][threadId].splice(i, 1);
							break;
						}
					}

					if ($.isEmptyObject(filter[boardId][threadId])) {
						delete filter[boardId][threadId];
						delete list.nextPurge[boardId][threadId];

						if ($.isEmptyObject(filter[boardId])) {
							delete filter[boardId];
							delete list.nextPurge[boardId];
						}
					}
					setList(list);
				},
				uid: function (boardId, threadId, uniqueId) {
					var list = getList();
					var filter = list.postFilter;

					// thread already pruned
					if (typeof filter[boardId] == 'undefined' || typeof filter[boardId][threadId] == 'undefined')
						return;

					for (var i=0; i<filter[boardId][threadId].length; i++) {
						if (filter[boardId][threadId][i].uid == uniqueId) {
							filter[boardId][threadId].splice(i, 1);
							break;
						}
					}

					if ($.isEmptyObject(filter[boardId][threadId])) {
						delete filter[boardId][threadId];
						delete list.nextPurge[boardId][threadId];

						if ($.isEmptyObject(filter[boardId])) {
							delete filter[boardId];
							delete list.nextPurge[boardId];
						}
					}
					setList(list);
				}
			}
		};

		/*
		 *  hide/show the specified thread/post
		 */
		function hide(ele) {
			var $ele = $(ele);

			if ($(ele).data('hidden'))
				return;

			$(ele).data('hidden', true);
			if ($ele.hasClass('op')) {
				$ele.parent().find('.body, .files, .video-container').not($ele.children('.reply').children()).hide();

				// hide thread replies on index view
				if (active_page == 'index' || active_page == 'ukko') $ele.parent().find('.omitted, .reply:not(.hidden), post_no, .mentioned, br').hide();
			} else {
				// normal posts
				$ele.children('.body, .files, .video-container').hide();
			}
		}
		function show(ele) {
			var $ele = $(ele);

			$(ele).data('hidden', false);
			if ($ele.hasClass('op')) {
				$ele.parent().find('.body, .files, .video-container').show();
				if (active_page == 'index') $ele.parent().find('.omitted, .reply:not(.hidden), post_no, .mentioned, br').show();
			} else {
				// normal posts
				$ele.children('.body, .files, .video-container').show();
			}
		}

		/*
		 *  create filter menu when the button is clicked
		 */
		function initPostMenu(pageData) {
			var Menu = window.Menu;
			var submenu;
			Menu.add_item('filter-menu-hide', _('Hide post'));
			Menu.add_item('filter-menu-unhide', _('Unhide post'));

			submenu = Menu.add_submenu('filter-menu-add', _('Add filter'));
				submenu.add_item('filter-add-post-plus', _('Post +'), _('Hide post and all replies'));
				submenu.add_item('filter-add-id', _('ID'));
				submenu.add_item('filter-add-id-plus', _('ID +'), _('Hide ID and all replies'));
				submenu.add_item('filter-add-name', _('Name'));
				submenu.add_item('filter-add-trip', _('Tripcode'));

			submenu = Menu.add_submenu('filter-menu-remove', _('Remove filter'));
				submenu.add_item('filter-remove-id', _('ID'));
				submenu.add_item('filter-remove-name', _('Name'));
				submenu.add_item('filter-remove-trip', _('Tripcode'));

			Menu.onclick(function (e, $buffer) {
				var ele = e.target.parentElement.parentElement;
				var $ele = $(ele);

				var threadId = $ele.parent().attr('id').replace('thread_', '');
				var boardId = $ele.parent().data('board');
				var postId = $ele.find('.post_no').not('[id]').text();
				if (pageData.hasUID) {
					var postUid = $ele.find('.poster_id').text();
				}

				var postName;
				var postTrip = '';
				if (!pageData.forcedAnon) {
					postName = (typeof $ele.find('.name').contents()[0] == 'undefined') ? '' : nameSpanToString($ele.find('.name')[0]);
					postTrip = $ele.find('.trip').text();
				}

				/*  display logic and bind click handlers
				 */

				 // unhide button
				if ($ele.data('hidden')) {
					$buffer.find('#filter-menu-unhide').click(function () {
						//  if hidden due to post id, remove it from blacklist
						//  otherwise just show this post
						blacklist.remove.post(boardId, threadId, postId);
						show(ele);
					});
					$buffer.find('#filter-menu-hide').addClass('hidden');
				} else {
					$buffer.find('#filter-menu-unhide').addClass('hidden');
					$buffer.find('#filter-menu-hide').click(function () {
						blacklist.add.post(boardId, threadId, postId, false);
					});
				}

				//  post id
				if (!$ele.data('hiddenByPost')) {
					$buffer.find('#filter-add-post-plus').click(function () {
						blacklist.add.post(boardId, threadId, postId, true);
					});
				} else {
					$buffer.find('#filter-add-post-plus').addClass('hidden');
				}

				// UID
				if (pageData.hasUID && !$ele.data('hiddenByUid')) {
					$buffer.find('#filter-add-id').click(function () {
						blacklist.add.uid(boardId, threadId, postUid, false);
					});
					$buffer.find('#filter-add-id-plus').click(function () {
						blacklist.add.uid(boardId, threadId, postUid, true);
					});

					$buffer.find('#filter-remove-id').addClass('hidden');
				} else if (pageData.hasUID) {
					$buffer.find('#filter-remove-id').click(function () {
						blacklist.remove.uid(boardId, threadId, postUid);
					});

					$buffer.find('#filter-add-id').addClass('hidden');
					$buffer.find('#filter-add-id-plus').addClass('hidden');
				} else {
					// board doesn't use UID
					$buffer.find('#filter-add-id').addClass('hidden');
					$buffer.find('#filter-add-id-plus').addClass('hidden');
					$buffer.find('#filter-remove-id').addClass('hidden');
				}

				//  name
				if (!pageData.forcedAnon && !$ele.data('hiddenByName')) {
					$buffer.find('#filter-add-name').click(function () {
						addFilter('name', postName, false);
					});

					$buffer.find('#filter-remove-name').addClass('hidden');
				} else if (!pageData.forcedAnon) {
					$buffer.find('#filter-remove-name').click(function () {
						removeFilter('name', postName, false);
					});

					$buffer.find('#filter-add-name').addClass('hidden');
				} else {
					// board has forced anon
					$buffer.find('#filter-remove-name').addClass('hidden');
					$buffer.find('#filter-add-name').addClass('hidden');
				}

				//  tripcode
				if (!pageData.forcedAnon && !$ele.data('hiddenByTrip') && postTrip !== '') {
					$buffer.find('#filter-add-trip').click(function () {
						addFilter('trip', postTrip, false);
					});

					$buffer.find('#filter-remove-trip').addClass('hidden');
				} else if (!pageData.forcedAnon && postTrip !== '') {
					$buffer.find('#filter-remove-trip').click(function () {
						removeFilter('trip', postTrip, false);
					});

					$buffer.find('#filter-add-trip').addClass('hidden');
				} else {
					// board has forced anon
					$buffer.find('#filter-remove-trip').addClass('hidden');
					$buffer.find('#filter-add-trip').addClass('hidden');
				}

				/*  hide sub menus if all items are hidden
				 */
				if (!$buffer.find('#filter-menu-remove > ul').children().not('.hidden').length) {
					$buffer.find('#filter-menu-remove').addClass('hidden');
				}
				if (!$buffer.find('#filter-menu-add > ul').children().not('.hidden').length) {
					$buffer.find('#filter-menu-add').addClass('hidden');
				}
			});
		}

		/*
		 *  hide/unhide thread on index view
		 */
		function quickToggle(ele, threadId, pageData) {
			/*if ($(ele).find('.hide-thread-link').length)
				$('.hide-thread-link').remove();*/

			if ($(ele).hasClass('op') && !$(ele).find('.hide-thread-link').length) {
				$('<a class="hide-thread-link" style="float:left;margin-right:5px" href="javascript:void(0)">[' + ($(ele).data('hidden') ? '+' : '&ndash;') + ']</a>')
					.insertBefore($(ele).find(':not(h2,h2 *):first'))
					.click(function() {
						var postId = $(ele).find('.post_no').not('[id]').text();
						var hidden = $(ele).data('hidden');
						var boardId = $(ele).parents('.thread').data('board');

						if (hidden) {
							blacklist.remove.post(boardId, threadId, postId, false);
							$(this).html('[&ndash;]');
						} else {
							blacklist.add.post(boardId, threadId, postId, false);
							$(this).text('[+]');
						}
					});
			}
		}

		/*
		 *  determine whether the reply post should be hidden
		 *   - applies to all posts on page load or filtering rule change
		 *   - apply to new posts on thread updates
		 *   - must explicitly set the state of each attributes because filter will reapply to all posts after filtering rule change
		 */
		function filter(post, threadId, pageData) {
			var $post = $(post);

			var list = getList();
			var postId = $post.find('.post_no').not('[id]').text();
			var name, trip, uid, subject, comment;
			var i, length, array, rule, pattern;  // temp variables

			var boardId	      = $post.data('board');
			if (!boardId) boardId = $post.parents('.thread').data('board');

			var localList   = pageData.localList;
			var noReplyList = pageData.noReplyList;
			var hasUID      = pageData.hasUID;
			var forcedAnon  = pageData.forcedAnon;

			var hasTrip = ($post.find('.trip').length > 0);
			var hasSub = ($post.find('.subject').length > 0);

			$post.data('hidden', false);
			$post.data('hiddenByUid', false);
			$post.data('hiddenByPost', false);
			$post.data('hiddenByName', false);
			$post.data('hiddenByTrip', false);
			$post.data('hiddenBySubject', false);
			$post.data('hiddenByComment', false);

			// add post with matched UID to localList
			if (hasUID &&
				typeof list.postFilter[boardId] != 'undefined' &&
				typeof list.postFilter[boardId][threadId] != 'undefined') {
				uid = $post.find('.poster_id').text();
				array = list.postFilter[boardId][threadId];

				for (i=0; i<array.length; i++) {
					if (array[i].uid == uid) {
						$post.data('hiddenByUid', true);
						localList.push(postId);
						if (array[i].hideReplies) noReplyList.push(postId);
						break;
					}
				}
			}

			// match localList
			if (localList.length) {
				if ($.inArray(postId, localList) != -1) {
					if ($post.data('hiddenByUid') !== true) $post.data('hiddenByPost', true);
					hide(post);
				}
			}

			// matches generalFilter
			if (!forcedAnon)
				name = (typeof $post.find('.name').contents()[0] == 'undefined') ? '' : nameSpanToString($post.find('.name')[0]);
			if (!forcedAnon && hasTrip)
				trip = $post.find('.trip').text();
			if (hasSub)
				subject = $post.find('.subject').text();

			array = $post.find('.body').contents().filter(function () {if ($(this).text() !== '') return true;}).toArray();
			array = $.map(array, function (ele) {
				return $(ele).text().trim();
			});
			comment = array.join(' ');


			for (i = 0, length = list.generalFilter.length; i < length; i++) {
				rule = list.generalFilter[i];

				if (rule.regex) {
					pattern = new RegExp(rule.value);
					switch (rule.type) {
						case 'name':
							if (!forcedAnon && pattern.test(name)) {
								$post.data('hiddenByName', true);
								hide(post);
							}
							break;
						case 'trip':
							if (!forcedAnon && hasTrip && pattern.test(trip)) {
								$post.data('hiddenByTrip', true);
								hide(post);
							}
							break;
						case 'sub':
							if (hasSub && pattern.test(subject)) {
								$post.data('hiddenBySubject', true);
								hide(post);
							}
							break;
						case 'com':
							if (pattern.test(comment)) {
								$post.data('hiddenByComment', true);
								hide(post);
							}
							break;
					}
				} else {
					switch (rule.type) {
						case 'name':
							if (!forcedAnon && rule.value == name) {
								$post.data('hiddenByName', true);
								hide(post);
							}
							break;
						case 'trip':
							if (!forcedAnon && hasTrip && rule.value == trip) {
								$post.data('hiddenByTrip', true);
								hide(post);
							}
							break;
						case 'sub':
							pattern = new RegExp('\\b'+ rule.value+ '\\b');
							if (hasSub && pattern.test(subject)) {
								$post.data('hiddenBySubject', true);
								hide(post);
							}
							break;
						case 'com':
							pattern = new RegExp('\\b'+ rule.value+ '\\b');
							if (pattern.test(comment)) {
								$post.data('hiddenByComment', true);
								hide(post);
							}
							break;
					}
				}
			}

			// check for link to filtered posts
			$post.find('.body a').not('[rel="nofollow"]').each(function () {
				var replyId = $(this).text().match(/^>>(\d+)$/);

				if (!replyId)
					return;

				replyId = replyId[1];
				if ($.inArray(replyId, noReplyList) != -1) {
					hide(post);
				}
			});

			// post didn't match any filters
			if (!$post.data('hidden')) {
				show(post);
			}
		}

		/*  (re)runs the filter on the entire page
		 */
		 function filterPage(pageData) {
			var list = getList();

			if (active_page != 'catalog') {

				// empty the local and no-reply list
				pageData.localList = [];
				pageData.noReplyList = [];

				$('.thread').each(function () {
					var $thread = $(this);
					// disregard the hidden threads constructed by post-hover.js
					if ($thread.css('display') == 'none')
						return;

					var threadId = $thread.attr('id').replace('thread_', '');
					var boardId = $thread.data('board');
					var op = $thread.children('.op')[0];
					var i, array;  // temp variables

					// add posts to localList and noReplyList
					if (typeof list.postFilter[boardId] != 'undefined' && typeof list.postFilter[boardId][threadId] != 'undefined') {
						array = list.postFilter[boardId][threadId];
						for (i=0; i<array.length; i++) {
							if ( typeof array[i].post == 'undefined')
								continue;

							pageData.localList.push(array[i].post);
							if (array[i].hideReplies) pageData.noReplyList.push(array[i].post);
						}
					}
					// run filter on OP
					filter(op, threadId, pageData);
					quickToggle(op, threadId, pageData);

					// iterate filter over each post
					if (!$(op).data('hidden') || active_page == 'thread') {
						$thread.find('.reply').not('.hidden').each(function () {
							filter(this, threadId, pageData);
						});
					}

				});
			} else {
				var postFilter = list.postFilter[pageData.boardId];
				var $collection = $('.mix');

				if ($.isEmptyObject(postFilter))
					return;

				// for each thread that has filtering rules
				// check if filter contains thread OP and remove the thread from catalog
				$.each(postFilter, function (key, thread) {
					var threadId = key;
					$.each(thread, function () {
						if (this.post == threadId) {
							$collection.filter('[data-id='+ threadId +']').remove();
						}
					});
				});
			}
		 }

		function initStyle() {
			var $ele, cssStyle, cssString;

			$ele = $('<div>').addClass('post reply').hide().appendTo('body');
			cssStyle = $ele.css(['background-color', 'border-color']);
			cssStyle.hoverBg = $('body').css('background-color');
			$ele.remove();

			cssString = '\n/*** Generated by post-filter ***/\n' +
				'#filter-control input[type=text] {width: 130px;}' +
				'#filter-control input[type=checkbox] {vertical-align: middle;}' +
				'#filter-control #clear {float: right;}\n' +
				'#filter-container {margin-top: 20px; border: 1px solid; height: 270px; overflow: auto;}\n' +
				'#filter-list {width: 100%; border-collapse: collapse;}\n' +
				'#filter-list th {text-align: center; height: 20px; font-size: 14px; border-bottom: 1px solid;}\n' +
				'#filter-list th:nth-child(1) {text-align: center; width: 70px;}\n' +
				'#filter-list th:nth-child(2) {text-align: left;}\n' +
				'#filter-list th:nth-child(3) {text-align: center; width: 58px;}\n' +
				'#filter-list tr:not(#header) {height: 22px;}\n' +
				'#filter-list tr:nth-child(even) {background-color:rgba(255, 255, 255, 0.5);}\n' +
				'#filter-list td:nth-child(1) {text-align: center; width: 70px;}\n' +
				'#filter-list td:nth-child(3) {text-align: center; width: 58px;}\n' +
				'#confirm {text-align: right; margin-bottom: -18px; padding-top: 2px; font-size: 14px; color: #FF0000;}';

			if (!$('style.generated-css').length) $('<style class="generated-css">').appendTo('head');
			$('style.generated-css').html($('style.generated-css').html() + cssString);
		}

		function drawFilterList() {
			var list = getList().generalFilter;
			var $ele = $('#filter-list');
			var $row, i, length, obj, val;

			var typeName = {
				name: 'name',
				trip: 'tripcode',
				sub: 'subject',
				com: 'comment'
			};

			$ele.empty();

			$ele.append('<tr id="header"><th>Type</th><th>Content</th><th>Remove</th></tr>');
			for (i = 0, length = list.length; i < length; i++) {
				obj = list[i];

				// display formatting
				val = (obj.regex) ? '/'+ obj.value +'/' : obj.value;

				$row = $('<tr>');
				$row.append(
					'<td>'+ typeName[obj.type] +'</td>',
					'<td>'+ val +'</td>',
					$('<td>').append(
						$('<a>').html('X')
							.addClass('del-btn')
							.attr('href', '#')
							.data('type', obj.type)
							.data('val', obj.value)
							.data('useRegex', obj.regex)
					)
				);
				$ele.append($row);
			}
		}

		function initOptionsPanel() {
			if (window.Options && !Options.get_tab('filter')) {
				Options.add_tab('filter', 'list', _('Filters'));
				Options.extend_tab('filter',
					'<div id="filter-control">' +
						'<select>' +
							'<option value="name">'+_('Name')+'</option>' +
							'<option value="trip">'+_('Tripcode')+'</option>' +
							'<option value="sub">'+_('Subject')+'</option>' +
							'<option value="com">'+_('Comment')+'</option>' +
						'</select>' +
						'<input type="text">' +
						'<input type="checkbox">' +
						'regex ' +
						'<button id="set-filter">'+_('Add')+'</button>' +
						'<button id="clear">'+_('Clear all filters')+'</button>' +
						'<div id="confirm" class="hidden">' +
							_('This will clear all filtering rules including hidden posts.')+' <a id="confirm-y" href="#">'+_('yes')+'</a> | <a id="confirm-n" href="#">'+_('no')+'</a>' +
						'</div>' +
					'</div>' +
					'<div id="filter-container"><table id="filter-list"></table></div>'
				);
				drawFilterList();

				// control buttons
				$('#filter-control').on('click', '#set-filter', function () {
					var type = $('#filter-control select option:selected').val();
					var value = $('#filter-control input[type=text]').val();
					var useRegex = $('#filter-control input[type=checkbox]').prop('checked');

					//clear the input form
					$('#filter-control input[type=text]').val('');

					addFilter(type, value, useRegex);
					drawFilterList();
				});
				$('#filter-control').on('click', '#clear', function () {
					$('#filter-control #clear').addClass('hidden');
					$('#filter-control #confirm').removeClass('hidden');
				});
				$('#filter-control').on('click', '#confirm-y', function (e) {
					e.preventDefault();

					$('#filter-control #clear').removeClass('hidden');
					$('#filter-control #confirm').addClass('hidden');
					setList({
						generalFilter: [],
						postFilter: {},
						nextPurge: {},
						lastPurge: timestamp()
					});
					drawFilterList();
				});
				$('#filter-control').on('click', '#confirm-n', function (e) {
					e.preventDefault();

					$('#filter-control #clear').removeClass('hidden');
					$('#filter-control #confirm').addClass('hidden');
				});


				// remove button
				$('#filter-list').on('click', '.del-btn', function (e) {
					e.preventDefault();

					var $ele = $(e.target);
					var type = $ele.data('type');
					var val = $ele.data('val');
					var useRegex = $ele.data('useRegex');

					removeFilter(type, val, useRegex);
				});
			}
		}

		/*
		 *  clear out pruned threads
		 */
		function purge() {
			var list = getList();
			var board, thread, boardId, threadId;
			var deferred;
			var requestArray = [];

			var successHandler = function (boardId, threadId) {
				return function () {
					// thread still alive, keep it in the list and increase the time between checks.
					var list = getList();
					var thread = list.nextPurge[boardId][threadId];

					thread.timestamp = timestamp();
					thread.interval = Math.floor(thread.interval * 1.5);
					setList(list);
				};
			};
			var errorHandler = function (boardId, threadId) {
				return function (xhr) {
					if (xhr.status == 404) {
						var list = getList();

						delete list.nextPurge[boardId][threadId];
						delete list.postFilter[boardId][threadId];
						if ($.isEmptyObject(list.nextPurge[boardId])) delete list.nextPurge[boardId];
						if ($.isEmptyObject(list.postFilter[boardId])) delete list.postFilter[boardId];
						setList(list);
					}
				};
			};

			if ((timestamp() - list.lastPurge) < 86400)  // less than 1 day
				return;

			for (boardId in list.nextPurge) {
				board = list.nextPurge[boardId];
				for (threadId in board) {
					thread = board[threadId];
					if (timestamp() > (thread.timestamp + thread.interval)) {
						// check if thread is pruned
						deferred = $.ajax({
							cache: false,
							url: '/'+ boardId +'/res/'+ threadId +'.json',
							success: successHandler(boardId, threadId),
							error: errorHandler(boardId, threadId)
						});
						requestArray.push(deferred);
					}
				}
			}

			// when all requests complete
			$.when.apply($, requestArray).always(function () {
				var list = getList();
				list.lastPurge = timestamp();
				setList(list);
			});
		}

		function init() {
			if (typeof localStorage.postFilter === 'undefined') {
				localStorage.postFilter = JSON.stringify({
					generalFilter: [],
					postFilter: {},
					nextPurge: {},
					lastPurge: timestamp()
				});
			}

			var pageData = {
				boardId: board_name,  // get the id from the global variable
				localList: [],  // all the blacklisted post IDs or UIDs that apply to the current page
				noReplyList: [],  // any posts that replies to the contents of this list shall be hidden
				hasUID: (document.getElementsByClassName('poster_id').length > 0),
				forcedAnon: ($('th:contains(Name)').length === 0)  // tests by looking for the Name label on the reply form
			};

			initStyle();
			initOptionsPanel();
			initPostMenu(pageData);
			filterPage(pageData);

			// on new posts
			$(document).on('new_post', function (e, post) {
				var threadId;

				if ($(post).hasClass('reply')) {
					threadId = $(post).parents('.thread').attr('id').replace('thread_', '');
				} else {
					threadId = $(post).attr('id').replace('thread_', '');
					post = $(post).children('.op')[0];
				}

				filter(post, threadId, pageData);
				quickToggle(post, threadId, pageData);
			});

			$(document).on('filter_page', function () {
				filterPage(pageData);
			});

			// shift+click on catalog to hide thread
			if (active_page == 'catalog') {
				$(document).on('click', '.mix', function(e) {
					if (e.shiftKey) {
						var threadId = $(this).data('id').toString();
						var postId = threadId;
						blacklist.add.post(pageData.boardId, threadId, postId, false);
					}
				});
			}

			// clear out the old threads
			purge();
		}
		init();
	});

	if (typeof window.Menu !== "undefined") {
		$(document).trigger('menu_ready');
	}
}




