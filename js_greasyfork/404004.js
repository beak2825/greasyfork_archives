// ==UserScript==
// @name         muahahaha eztv
// @namespace    muahahaha
// @version      1.0.0
// @description  filter torrents in shows
// @match        https://eztv.io/shows/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/404004/muahahaha%20eztv.user.js
// @updateURL https://update.greasyfork.org/scripts/404004/muahahaha%20eztv.meta.js
// ==/UserScript==

(function() {

	function muahahaha_eztv(){
		if(typeof(unsafeWindow.$)==='function'){

			var $=unsafeWindow.$;

            $('#searchsearch_submit').append('<input type="text" id="muahahaha_q" style="float: right; width: 8em; height: 26px;">');

            $('#muahahaha_q').keyup(e => {
                if (e.target.value === '') {
                    $('tr.forum_header_border').css('display', '');
                } else {
                    $('tr.forum_header_border').each((i, r) => {
                        r = $(r);
                        r.css(
                            'display',
                            r.is(`:contains(${e.target.value})`) ? '' : 'none'
                        );
                    });
                }
            });

		}
		else{

			setTimeout(muahahaha_eztv,100);

		}
	}

	muahahaha_eztv();

})();