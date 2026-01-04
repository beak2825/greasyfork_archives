// ==UserScript==
// @name         [F.CO] Anime Links (LiveChart)
// @description  It gets MAL, AniDB and Anilist links from LiveChart
// @version      0.2
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @license      MIT
// @icon         data:image/png;base64,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

// @run-at       document-idle
// @grant        GM_xmlhttpRequest

// @match        *://localhost:8080/*
// @match        *://ficodex-demo.web.app/*
// @include      *://*turkanime.co/?q=*

// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/427315-url-based-search-for-some-websites/code/URL%20Based%20Search%20for%20Some%20Websites.js

// @downloadURL https://update.greasyfork.org/scripts/473224/%5BFCO%5D%20Anime%20Links%20%28LiveChart%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473224/%5BFCO%5D%20Anime%20Links%20%28LiveChart%29.meta.js
// ==/UserScript==
/* global $, waitForKeyElements */

(function() {
    'use strict';
	waitForKeyElements( '#app form [name="lc"]', (a) => {
		var pageUrl = window.location.href
		if(pageUrl.search(/(anime\/edit|anime\/create)/ ) >= 0) {
			$('.buttons').append('<button id="getLinks" type="button" style="margin-left: auto;">Auto Fill</button>')
			$('#getLinks').click(() => {
				const lcLink = $('[name="lc"]').val()
				if (!lcLink) alert('Please fill the LiveCart link.')
				else {
					const lcId = lcLink.replace(/.*livechart\.me\/anime\/(\d+)/, '$1')
					$('#malId').val('')
					$('[name="mal"]').val('')
					$('[name="anilist"]').val('')
					$('[name="anidb"]').val('')
					getLinks(lcId)
				}
			})
		}
	});

	const getLinks = (lcId) => {
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.livechart.me/anime/" + lcId,
			onloadstart: function() {
				$('#getLinks').attr('disabled', true).html('Filling...')
			},
			onerror: function(err) {
				$('#getLinks').attr('disabled', false).html('Auto Fill')
				alert(err)
				console.log(err)
			},
			onload: function(res) {
				const htmlObj = $(res.responseText)
				const title = htmlObj.find('.line-clamp-3').text()
				const linksParent = htmlObj.find( '.lc-btn-myanimelist, .lc-btn-anilist, .lc-btn-anidb' ).parent()[0]
				const links = $(linksParent).children().toArray().map(a => a.href)

				if (links.length) {
					$('#getLinks').attr('disabled', false).html('Auto Fill')
					$('#app #malId')
						.val(links.find(l => l.search('myanimelist') > -1)).get(0).dispatchEvent( new Event('input', { bubbles: true }) )
					$('#app [name="mal"]')
						.val(links.find(l => l.search('myanimelist') > -1))
					$('#app [name="anilist"]')
						.val(links.find(l => l.search('anilist') > -1))
					$('#app [name="anidb"]')
						.val(links.find(l => l.search('anidb') > -1))
					window.open("https://www.turkanime.tv/?q=" + title);
					//window.open( "https://www.google.com.tr/search?q=" + title + " turkanime" );
					window.open("https://planetdp.org/movie/search?title=" + title)
				}
				else {
					alert( "There is a problem about getting links. Please be sure LiveChart ID is correct." )
				}
			}
		});
	}

    function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that specifies the desired element(s). */
        actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
        bWaitOnce,      /* Optional: If false, will continue to scan for new elements even after the first match is found. */
        iframeSelector  /* Optional: If set, identifies the iframe to search. */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents().find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they are new. */
            targetNodes.each(function() {
                var jThis        = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj  = waitForKeyElements.controlObj || {};
        var controlKey  = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function() {
                        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                    },
                    300
                );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

})();