// ==UserScript==
// @name         8chan-MD5
// @version      0.3.1
// @description  Display image md5s
// @author       Anonymous
// @match        *://8ch.net/*
// @grant        none
// @namespace    https://greasyfork.org/users/18941
// @downloadURL https://update.greasyfork.org/scripts/13395/8chan-MD5.user.js
// @updateURL https://update.greasyfork.org/scripts/13395/8chan-MD5.meta.js
// ==/UserScript==

String.prototype.hexEncode = function() {
	var result = "";
	for (var i = 0; i < this.length; i++) { result += this.charCodeAt(i).toString(16); }
	return result;
};

(function(window, $) {
	var md5 = {
		init: function() {
			// apply md5 to all posts now.
			md5.append(document.body);

			// add md5 to any posts that may be added.
			this.observer = new MutationObserver(function(mutations) { mutations.forEach(function(mutation) { var newNodes = mutation.addedNodes; if (newNodes !== null) { $(newNodes).each(function() { md5.append(this); }); } }); });
			this.observer.observe($('.thread')[0], {attributes: true, childList: true, characterData: true});
		},

		append: function(root) {
			$(root).find('.files .file').each(function() {
				var md5 = window.atob($(this).find('.post-image').attr('data-md5')).hexEncode();
				$(this).find('.fileinfo .unimportant').append(" <a href='javascript:md5.toggle(\"" + md5 + "\");'>#</a><br/><span id='md5_" + md5 + "' class='hidden'>MD5: " + md5 + "</span>");
			});
		},
		
		toggle: function(md5) {
		  $('#md5_' + md5).toggleClass('hidden');
		}
	};

	md5.init();
	window.md5 = md5;
})(window, jQuery);
