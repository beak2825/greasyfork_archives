// ==UserScript==
// @name        ToggleGist
// @author      Kuba Niewiarowski
// @description Toggle files in GitHub Gist
// @namespace   jakub@niewiarowski.it
// @icon        https://github.com/favicon.ico
// @encoding    utf-8
// @include     /^https?:\/\/gist.github.com\/[\w-]+\/.*/
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @require     https://update.greasyfork.org/scripts/28721/1108163/mutations.js
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/31700/ToggleGist.user.js
// @updateURL https://update.greasyfork.org/scripts/31700/ToggleGist.meta.js
// ==/UserScript==

jQuery(function($) {
	function addBtn(){
		$('.file-box').each(function() {
			$('<a>', {
				class: 'Button--secondary Button--small Button git-toggle-file',
				href:  '#',
				text:  'Toggle'
			}).click((e) => {
				e.preventDefault();
				$wrapper = $(e.target).parents('.file').find('.blob-wrapper, .blob').first();
				$wrapper.prop('hidden', !$wrapper.prop('hidden'));
			}).appendTo($(this).find('.file-actions .Button').parent());
		});
	}

	document.addEventListener("ghmo:container", addBtn);

	addBtn();

});
