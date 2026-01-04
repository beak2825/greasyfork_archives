// ==UserScript==
// @name        Milovana Preload
// @namespace   https://greasyfork.org/en/users/167665-zoecl
// @description Preloads the next image/tease
// @include     https://milovana.com/webteases/showtease.php?id=*
// @version     1.0.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37675/Milovana%20Preload.user.js
// @updateURL https://update.greasyfork.org/scripts/37675/Milovana%20Preload.meta.js
// ==/UserScript==

let preload = {
	init: function () {
		this.current_tease = document.getElementById('cm_wide');
		this.next_page = this.get_next_page();

		if (!this.next_page) {
			console.log('Could not find next page.');
			return;
		}

		this.preload();
		this.add_event_listeners();
	},

	get_next_page: function () {
		return document.getElementById('continue').href;
	},

	preload: function () {
		this.preloading = 1;

		fetch(this.next_page, { credentials: 'include' })
		.then(function (response) {
			return response.text();
		})
		.then(this.got_response.bind(this));
	},

	add_event_listeners: function () {
		for (let link of document.links) {
			if (link.href == this.next_page) {
				link.addEventListener('click', this.init_insert_tease.bind(this));
			}
		}
	},

	got_response: function (response) {
		let doc = new DOMParser().parseFromString(response, 'text/html');

		this.next_tease = document.importNode(doc.getElementById('cm_wide'), 1);
		this.next_image = this.next_tease.getElementsByClassName('tease_pic')[0];

		this.next_image.addEventListener('load', this.finish_preload.bind(this));
	},

	finish_preload: function (event) {
		this.preloading = 0;

		if (this.insert_asap) {
			this.insert_asap = 0;
			document.body.classList.remove('preloading');

			if (this.fallback) {
				this.fallback = window.clearTimeout(this.fallback);
			}

			this.insert_tease();
		}
	},

	init_insert_tease: function (event) {
		event.preventDefault();

		if (this.preloading) {
			this.insert_asap = 1;

			/* change cursor */
			document.body.classList.add('preloading');

			/* add timer in case preloading fails */
			if (!this.fallback) {
				this.fallback = window.setTimeout(this.force_next.bind(this), 1000);
			}

			return;
		}

		this.insert_tease();
	},

	insert_tease: function (tease) {
		window.history.pushState(this.next_page, document.title, this.next_page);

		this.current_tease.replaceWith(this.next_tease);

		this.init();
	},

	force_next: function () {
		window.location = this.next_page;
	},

	popstate: function (event) {
		/* force reload */
		window.location.reload(1);
	},
};

try {
	preload.init();
	window.addEventListener('popstate', preload.popstate);

	GM_addStyle('body.preloading * { cursor: progress; }');
}
catch (error) {
	console.log(error);
}
