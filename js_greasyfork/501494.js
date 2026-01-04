// ==UserScript==
// @name         PTT Article Save to archive.is
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  Save the PTT article to archive.is
// @author       hangjeff
// @match        https://www.ptt.cc/bbs/*/*.html
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/501494/PTT%20Article%20Save%20to%20archiveis.user.js
// @updateURL https://update.greasyfork.org/scripts/501494/PTT%20Article%20Save%20to%20archiveis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let Bootstrap = $('<link>', {
                	href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
                    rel: 'stylesheet'
                }).appendTo('head');

                let PTT_Article_Url = window.location.href;
                console.log(PTT_Article_Url);

            	let form = $('<form>', {
        			id: 'submiturl',
        			action: 'https://archive.ph/submit/',
        			method: 'GET',
        			target: '_blank'
    			});

                // Because the color of balck ground has been changed by Bootstrap
                $('body').css('background-color', 'black');

    			form.append(
        			$('<input>', {
                		id: 'url',
                		type: 'hidden',
                		name: 'url',
                		value: PTT_Article_Url
            		})
    			);

    			form.append(
        			$('<input>', {
                		type: 'submit',
                		value: 'Save to archive.is',
                		tabindex: '1',
                        class: 'btn btn-primary'
            		})
    			);
                $('.article-metaline').last().after(form);
})();