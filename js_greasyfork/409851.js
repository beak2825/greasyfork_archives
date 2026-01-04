// ==UserScript==
// @name         [LiveChart] Quick Search
// @description  It adds quick seach buttons for other sites on LiveChart (season charts and anime pages).
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @version      1.1.1

// @license      MIT
// @icon         https://images2.imgbox.com/f4/a8/i0WG5otW_o.png

// @match        *://www.livechart.me/*
// @match        *://www.turkanime.co/?q=*

// @grant   	 GM_addStyle
// @run-at       document-end

// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/427315-url-based-search-for-some-websites/code/URL%20Based%20Search%20for%20Some%20Websites.js
// @downloadURL https://update.greasyfork.org/scripts/409851/%5BLiveChart%5D%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/409851/%5BLiveChart%5D%20Quick%20Search.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
/* global $ */

(function() {

	'use strict';

	// CONTROL BOARD
	var sites = // Add New Buttons // Search parameters: %title%
	[//===========================================================================================================================================================================================
        { name: 'AnimeBytes',     status: 'active',  url: 'https://animebytes.tv/torrents.php?searchstr=%title%&force_default=1',     chart: "0", page: "1",    color: '#ed106a', hover_color: '#323442',  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEa8AABGvAff9S4QAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAANlSURBVFhHvVdJaxRBFG4EUSRJL5NF4xIVcUEQ8aD+CS8iQlQ8STJVPUkQEUQPAQ0qGD2IImgQEREUwZt3QUJwyUWQHMxBBSWZ7ulZNIuRjN/r1Mz0UjPdMyZ+8DFJ1Xvfq6r3Xne1EheOOqBlNHYqq6e6xZCST6R2Wyr/aGvMsjU+ntH4SFrjJ8lWmPw7Mnr/FlvndxBkxtL4q0Wlbw2N59f3tdkq+4bAxTDZDOYeTbeaO12RRlBUelZbGruOoL+F8Ifihp51YlpBgCv+oGHCfyGjmcNev1jItvAdCPy+IsQdHOtWMe0CRz/qDRbBccvo3ShcayPdnNxlq/y7VyCrm0kxXQbGJ7w2kUS6Mlr/PuEuB+08GBz8VFQGVwmTMjD+PGAXTZX9qHoSSzmvHHuJyONpYeIDhA7CfjFoH01zrFTIPqDSrwaNMyrPFrsG1wqTELC4gUYWgXa9ISSWYOtsM4RK1V4mAjwTJlWRM/gh2L4EZ72+tUjd4WtR7P62zBDjvcIkEpbR15LR+QX4/QrpSIj2HCk7YkDqZBnJw65RHbCMgT1o0a8yPT/ZTDpxvpl23y03cHPVJXTrAjT3ouILMk0/zRNUSPflk7xYbBtsEpp1A4u/KNP0kmJTP78LTpRY6DjXLvTqBr2QoBFVmG9pAenAYJmOyvcLvYaANLyW6Xo4jRSE269ERzfPCK2GgDQ8lOmWSLFrLgB8IbQagq2ajyWaPlIKpoODFbI5yzgb7y0mAdrxjVy3QiyAjckmKmS3hF5dyHWaCXriyTUrrNmGRErRVAPFiAK8LNMLUsnq/LhsIsDJQkcydks6reYB91om1/JRmWrjTfGeWnwi1xx9x3ODh+8UVek64ZgfyCbDpMsmH0onzE7X0QPKua2mhuLuvETXOauy7fhnPjhZg/OonVFqM/w+pb+xiT8Su0i6CyAgDddkBitNEV5R6JqEXUT27XJThF9Cob2/Aw+PLzLDlaIIXQG9y//nIkRYP6jnlzMdKNKqnSFChkE1gZbDTZnNyRxjchbBLzkGOyqZcynCVYejprbhNO6hS/IyARlh7+BVfJN8SYOu9hifDNoR3SBxQB+YlsGPoUbu4nuB0kNPu59YWA6/n+nNh90O4xP+CD1dhVsZuPxusnXzCWwcnCpeUkS28BcsrCLIFNRP+gAAAABJRU5ErkJggg=='},
        { name: 'Nyaa',           status: 'active',  url: 'https://nyaa.si/?&q=%title%',                                              chart: "1", page: "1",    color: '#337ab7', hover_color: '#AF00FF',  icon: 'data:image/png;base64,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'},
        { name: 'AnimeTosho',     status: 'active',  url: 'https://animetosho.org/series/%title%',                                    chart: "1", page: "1",    color: '#063207', hover_color: '#D67A6E',  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAADrSURBVDhPtVKxDcJADLSERMEqIEU0tEyARGo6qOjCGlRhEhIxACOgtIxARUVDccTmnbw/nyJCnPRS4rfPd/bT34B7hYRmoFHSnnGG0wNwKXHgXSGjJWhSoHza5IZ0c4uTaMLh3N9FG5icCi/4F4o8JWvBqcK1BK0KcJ0QSPYlFWkCRzY/tl3k3hWx0inlrcVvwV4GxCh2defAJ8eUkPO3hsCTFPPIpGxHY10FTr58M1mwLi5Y0LqJdWcQEgQrDGO+HYEhCFap//6AjX9G6EkIdXW11HCd5g0oYpMfBJ1+7AkPgpGv51fSfhB9ADUGVK7f/SFaAAAAAElFTkSuQmCC'},
        { name: 'IMDB_Google',    status: 'active',  url: 'https://www.google.com.tr/search?q=%title%+imdb',                          chart: "1", page: "1",    color: '#1a73e8', hover_color: '#333333',  icon: 'data:image/png;base64,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'},
        { name: 'PlanetDP',       status: 'passive', url: 'https://www.planetdp.org/movie/search?title=%title%',                      chart: "1", page: "1",    color: '#f80',    hover_color: '#3F51B5',  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAf1JREFUOI2Vkz1I1WEUxn/nvP/bjXuvtyLNRqvFjC5GFBUWdKmlpWhsDLcWuWNDNDekODY0RoNTOFWLGiERVt5r3qxAxPIjHKSS6P++72nwqy8tD5zpnOfHw8M5YmbCpLYSaUFkkH1hiS2UAtAS62Aes17eJ1e2AsDMZK3fZJptQh/Z22TOJpKLv8w26HXAWCFv1YbdZiY2nrlm4xmzembG6tsO/xswlj1gtXzWqrlXNprvXluoZas2ljWrZYeslj34N8ByBl5LePWYvsNCF6OFeaoNxzn0rYR3FaLrAPeaWu4J1Vz7nyEGLeETJU2mLDjMS6OlDPOiWKP0tYegBb7LIN6dIrgRXhYeM9LQwUhRVwCuDS85UjdFUPCKmANEeb4jR/vnJaLrM788I7iyRR3E5PKqg1aiFgluUoJDxEVSKXNksQ1zJZ7tmiW6XoLDUgepG5YoJzi62JesONhP1EZwS6g+4NjCJQCeNvWjegEgelBlGqyTkwsPVzMQG2jKR+OLinRyZu4uAEPNN6NxQ51hHkSZR6xCx6d7v99RQtSdKgIWiwzsLWP0o7JdAhAlClzn9OytjQ4xIZVGUyFGd9slRAxdsXsHrMLZmU1/IwHZQxQUsBQV5b6qdVH+OL+ZcB2g2iIBEIYRu8q5D/X/Ef6UgUVEKpyf7tmKcLV+AFjUL400aZecAAAAAElFTkSuQmCC'},
        { name: 'TürkAnime',      status: 'active',  url: 'https://www.turkanime.tv/?q=%title%',                                      chart: "1", page: "1",    color: '#2c2c2c', hover_color: '#222222',  icon: 'data:image/png;base64,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'},

		{ name: 'Example',        status: 'passive', url: 'https://nyaa.si/?&q=%title%',                                              chart: "1", page: "1",    color: '#2c2c2c', hover_color: '#222222',  icon: 'data:image/png;base64,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'},
    ];//==========================================================================================================================================================================================


    var removes = // Remove Existing Buttons (Only removes from seasonal charts)
    [//=====================================================================
        { name: 'Official Site',             remove: "no",    		class: '.website-icon'     },
        { name: 'Trailer',                   remove: "no",    		class: '.preview-icon'     },
		{ name: 'Official Ways to Watch',    remove: "remove",   		class: '.watch-icon'       },
        { name: 'Twitter',                   remove: "remove",    		class: '.twitter-icon'     },
        { name: 'AniList',                   remove: "no",    		class: '.anilist-icon'     },
        { name: 'MAL',                       remove: "no",    		class: '.mal-icon'         },
        { name: 'AniDB',                     remove: "no",    		class: '.anidb-icon'       },
		{ name: 'AnimePlanet',               remove: "remove",   		class: '.anime-planet-icon'},
		{ name: 'AniSearch',                 remove: "remove",   		class: '.anisearch-icon'   },
        { name: 'Kitsu',                     remove: "no",    		class: '.kitsu-icon'       },
		{ name: 'Crunchyroll',               remove: "remove",   		class: '.-lc-icon-only' },
		{ name: 'Crunchyroll',               remove: "remove",   		class: '.crunchyroll-icon' },
    ];//=====================================================================

	// Set required styles and hovers
	var styles = `
#LiveChart648 {
  display: flex;
  justify-content: center;
  align-items: center;
}
#LiveChart648-page .btn {
  border-color: transparent;
}
#LiveChart648-page .btn:hover {
  opacity: .75;
}
`;

	// SEASONAL CHART
	var pageUrl = window.location.href;
	var title, titleArea,anidbID;
	if (pageUrl.search(/livechart\.me\/(tba|summer-|winter-|fall-|spring-)/) >= 0) {
		// PlanetDP exception
	    var myScriptCheck = document.querySelector( '[id="LiveChart648"]' );
	    if (myScriptCheck)
	    {
	        var g = getFirstItem(sites, 'name', 'PlanetDP');
	        if (g) {sites[g].status = 'deactive';}
	    }

	    for( var i = 0, len = sites.length; i < len; i++ )
	    {
	        styles += "." + sites[i].name + ":hover {background-color: " + sites[i].hover_color + "; border-radius: 15px;} ";
	    }
	    GM_addStyle ( styles );

	    // Work on each anime
		var elBox = document.querySelectorAll( '[class="anime-card"]');
	    for ( var x = 0; x < elBox.length; x++ )
	    {
	        // Vars
	        title = titleEdit( elBox[x].querySelector( '[class="main-title"]' ).textContent );
	        var editedTitle = title
	                        .replace( /(:)?(second|third|[0-9](st|nd|rd|th)|(II|III|IV|V|VI)(st|nd|rd|th))? (season part|part|season chapter|chapter|season) ?(two|three|four|five|[0-9]|II|III|IV|V|VI)?/i, "" )
	                        .replace( / (2|3|4|5|II|III|IV|V|VI)$/i, "" );


	        //if it exist, get the anidb id. If does not exist but needed, replace url
	        let anidbButon = elBox[x].querySelector( '[class="anidb-icon"]' );
	        let r;
	        if (anidbButon) {
	            anidbID = anidbButon.href.match( /\/a(\d+)/ )[1];
	            r = getFirstItem(sites, 'name', 'AnimeTosho');
	            if (r != null) {sites[r].url = 'https://animetosho.org/series/%anidbID%';}
	        }
	        else {
	            r = getFirstItem(sites, 'name', 'AnimeTosho');
	            if (r != null) {sites[r].url = 'https://animetosho.org/search?q=%title%';}
	        }

	        // Areas
	        var count = x;
	        titleArea = elBox[x].querySelector( '.related-links > .icon-buttons-set' );
	        titleArea.innerHTML += chartHtml();

			// Romove Sites
			for (let z = 0; z < removes.length; z++) {
				var n = removes[z];
				if (elBox[x].querySelector(n.class) && n.remove == "remove") {
					elBox[x].querySelector(n.class).style.display = "none";
				}
			}
	    }
	}
	// PAGE
	else if (pageUrl.search(/livechart\.me\/anime\/\d+/) >= 0) {
		// Vars
        title = titleEdit( $('[property="og:title"]').attr("content") );

	    //if it exist, get the anidb id. If does not exist but needed, replace url
	    let anidbButon = document.querySelector( 'a.lc-btn-anidb' );
	    let r;
	    if (anidbButon) {
	        anidbID = anidbButon.href.match( /\/a(\d+)/ )[1];
	        r = getFirstItem(sites, 'name', 'AnimeTosho');
	        if (r != null) {sites[r].url = 'https://animetosho.org/series/%anidbID%';}
	    }
	    else {
	        r = getFirstItem(sites, 'name', 'AnimeTosho');
	        if (r != null) {sites[r].url = 'https://animetosho.org/search?q=%title%';}
	    }

        // Areas
        titleArea = document.querySelector( 'a.lc-btn-myanimelist, a.lc-btn-anilist, a.lc-btn-anidb' ).closest('div');
        titleArea.insertAdjacentHTML( "afterend", pageHtml() );
	}

	function pageHtml() {
		var h = '';

		for( var i = 0, len = sites.length; i < len; i++ ) {
			var p = sites[i];
			if (p.status == "active" && p.page == 1) {
				h += '<a class="btn btn-sm btn-block lc-btn-' + p.name.toLowerCase() + '" href="' + url( p.url ) + '" target="_blank" rel="noopener nofollow">' + p.name.toUpperCase() + '</a>';
				styles += '.lc-btn-' + p.name.toLowerCase() + ', .lc-btn-' + p.name.toLowerCase() + ':hover, .lc-btn-' + p.name.toLowerCase() + ':focus {background-color: ' + p.color + '; color: white}';
			}
		}
		GM_addStyle(styles);
	    return `<div class="text-sm font-medium mt-4 h-8">Search On</div><div id="LiveChart648-page" class="grid grid-cols-2 md:grid-cols-3 gap-2"> ${h} </div>`;
	}

    function url( g_site )
	{
        g_site = g_site
            .replace( /%title%/, title )
            .replace( /%editedTitle%/, editedTitle )
            .replace( /%anidbID%/, anidbID );

		return g_site;
    }


	function chartHtml()
	{
		var h = '';
        var styles;
		for( var i = 0, len = sites.length; i < len; i++ )
		{
			var s = sites[i];
            if (s.status == "active" && s.chart == 1) {
                h += '<a id="LiveChart648" class="' + s.name + '" href="' + url( s.url ) + '" target="_blank" rel="noopener nofollow"><img style="height:16px; weight: 16px;" src="' + s.icon + '" title="' + s.name + '"><\/a>';
            }
        }

		return h;
	}


    function titleEdit( e_title )
    {
        e_title = e_title
            .replace( ":", " " )
            .replace( "-", " " )
            .replace("&amp;","&") //replace & with code
            .replace("&nbsp;","") //delete nobreak space
            .replace(/[\/\\#+()$~%"*?<>{}]/g, " ") //remove bad chars
            .replace( /\s{2,}/g, " " )
            .trim()
        ;
        return e_title;
    }


    function getFirstItem(input, key, value) {
		for(var i = 0; i < input.length; i++) {
			var obj = input[i];
			if(obj[key] == value) {return i;}
		} return null;
    }

})();