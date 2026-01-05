// ==UserScript==
// @name         Video Uploader by @anpep
// @namespace    https://anpep.xyz
// @version      0.2
// @description  Sube WebM, MP4 y Vines a Taringa! sin que los demás tengan que instalar la extensión
// @author       @anpep / @NY
// @match        *://*.taringa.net/mi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15607/Video%20Uploader%20by%20%40anpep.user.js
// @updateURL https://update.greasyfork.org/scripts/15607/Video%20Uploader%20by%20%40anpep.meta.js
// ==/UserScript==

function main() {
	mi.attach.submitUrlProgressBar = function(el) {
		var perc = 0;

		$(el).find('.my-shout-attach').html(tmpl('template_attach_progress')).show();
		mi.attach.progressBar(el, 0);
		mi.attach.submitUrlProgressBarTimer = setInterval(function() {
			perc++;
			mi.attach.progressBar(el, perc);

			if (perc === 100)
				perc = 0;
		}, 10);
	};

	mi.attach.submitUrl = function(el, type) {
		if (typeof $(el).data('inUpload') !== 'undefined' && $(el).data('inUpload'))
			return false;

		var url = $(el).find('.my-shout-attach input[name=url]').val().trim();

		if (!url.length || url.split('.').length < 2)
			return false;

		var params = {
			key: global_data.user_key,
			url: url
		};

		if (type === 'image')
			params.isImage = 1;
		else if (type === 'video')
			params.isVideo = 1;

		var inUpload = Math.floor(Math.random() * 99999);
		$(el).data('inUpload', inUpload);

		mi.attach.submitUrlProgressBar(el);

		if (!url.match(/^https?:\/\/(vine.co\/v\/[a-z0-9_-]+|(i\\.)?imgur.com\/[a-z0-9_-]+\\.gifv?|gfycat.com\/[a-z0-9]+|.+?\.webm|.+?\?swf)$/i)) {
			$.ajax({
				type: 'POST',
				url: '/ajax/shout/attach',
				data: params,
				dataType: 'json',
				success: function(data) {
					if ($(el).data('inUpload') !== inUpload)
						return;

					$(el).data('inUpload', false);
					clearInterval(mi.attach.submitUrlProgressBarTimer);

					if (data.status === 1)
						mi.attach.show(el, data);
					else
						mi.attach.showError(el, data.data);

					$(el).find('.my-shout-attach-options').hide();

					if (data.type !== 'image')
						$(el).find('.attach-' + data.type).show();
				},
				error: function() {
					if ($(el).data('inUpload') !== inUpload)
						return;

					$(el).data('inUpload', false);
					$(el).find('.my-shout-attach-options').hide();

					clearInterval(mi.attach.submitUrlProgressBarTimer);
					mi.attach.showError(el, 'El servidor no responde');
				}
			});
		} else {
			if (url.indexOf('://') === -1)
				url = 'http://' + url;

			$.ajax({
				type: 'GET',
				url: '//anpep-webm.herokuapp.com/api/v1/process',
				data: { key: '', url: url },
				jsonp: 'callback',
				dataType: 'jsonp',
	      crossDomain: true,
				timeout: 600000,
				success: function(data) {
					if ($(el).data('inUpload') !== inUpload)
						return;

					$(el).data('inUpload', false);
					clearInterval(mi.attach.submitUrlProgressBarTimer);

					if (data.ok) {
						mi.attach.show(el, {
							data: {
								type: 'video',
								url: data.data.url,
								html: '<center><embed src="' + data.data.url + '" width="425" height="350" type="application/x-shockwave-flash" allownetworking="internal" allowscriptaccess="never" autoplay="false" wmode="transparent"></embed></center>'
							}
						});
					} else {
						mi.attach.showError(el, data.description);
					}

					$(el).find('.my-shout-attach-options').hide();
					$(el).find('.attach-video').show();
				},
				error: function() {
					if ($(el).data('inUpload') !== inUpload)
						return;

					$(el).data('inUpload', false);
					$(el).find('.my-shout-attach-options').hide();

					clearInterval(mi.attach.submitUrlProgressBarTimer);
					mi.attach.showError(el, 'El servidor no responde');
				}
			});
		}
	}
}

// run script in page context
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
(document.body || document.head).appendChild(script);