// ==UserScript==
// @name         [SteamGifts] Additional giveaway search tools
// @description  Fixes header to the top of the page so it "moves with it" and adds a search input to it. In addition, adds a "more like this" button close to giveaway's image for searching by item (same as small icon close to the game's name, but more usable).
// @author       MetalTxus
// @version      1.3.1

// @include      /^https?:\/\/\www.steamgifts.com*/
// @icon         http://i.imgur.com/OG97ZbN.png
// @namespace    https://greasyfork.org/users/8682
// @downloadURL https://update.greasyfork.org/scripts/24713/%5BSteamGifts%5D%20Additional%20giveaway%20search%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/24713/%5BSteamGifts%5D%20Additional%20giveaway%20search%20tools.meta.js
// ==/UserScript==

/* Constants */

var STRINGS, HTML, SELECTORS, URLS, KEY_CODES, STYLE;
STRINGS = {
    searchGiveaways: 'Search giveaways',
    moreLikeThis: 'Giveaways including this item'
};
HTML = {
    searchInput:
        `<div class="nav__button-container mt-search-wrapper">
             <input type="text" class="mt-search" placeholder="${STRINGS.searchGiveaways}">
             <i class="fa fa-search mt-search-icon"></i>
         </div>`,

    moreLikeThisButton:
        `<a class="mt-more-like-this white-gradient-background truncate" title="${STRINGS.moreLikeThis}"><i class="fa fa-search"></i></a>`,

	enterAllButton:
        `<a href><i class="fa fa-check-square-o"></i>&nbsp;Enter All</a>`
};
SELECTORS = {
    searchInput: '.mt-search',
    moreLikeThis: '.mt-more-like-this',
	es_enterButtons: '.widget-container > div:nth-child(2) > div:nth-child(3) .sidebar__entry-insert:not(.is-hidden)'
};
URLS = {
    query: 'http://www.steamgifts.com/giveaways/search'
};
KEY_CODES = {
    enter: 13
};
STYLE = `<style>
	header { position: fixed; top: 0; width: 100%; z-index: 42; }
	.giveaway__heading .fa { font-size: 16px !important; }
	.featured__container { margin-top: 40px; }
	.sidebar__entry-insert, .sidebar__entry-delete, .sidebar__error, .sidebar__search { margin-bottom: 8px !important; min-width: 58px !important; }

	.mt-more-like-this { display: block !important; width: 30px; text-align: center; border: 1px solid; border-color: #E4E4E4 #CCCCCC #B4B4B4 #CCCCCC !important; border-radius: 4px; }
		.mt-more-like-this .fa { margin-bottom: 2px; }
		.mt-more-like-this:hover * { opacity: .85; }

	.mt-more-like-this:not(.sidebar__search) { margin: 0 !important; }
	.mt-more-like-this.sidebar__search { width: 341px; height: 32px; line-height: 32px; padding: 0 8px; font-weight: bold; margin: 0 0 8px 0 !important; }

	.white-gradient-background {
		background-image: linear-gradient(#FFFFFF 0%, #E5E5E5 100%) !important;
		background-image: -moz-linear-gradient(#FFFFFF 0%, #E5E5E5 100%) !important;
		background-image: -webkit-linear-gradient(#FFFFFF 0%, #E5E5E5 100%) !important;
	}

    .mt-search-wrapper {
        position: relative;
    }
    .mt-search-wrapper .mt-search {
        width: 192px;
    }
    .mt-search-wrapper .mt-search-icon {
        position: absolute;
        top: 6px;
        right: 6px;
        font-size: 16px;
        cursor: pointer;
        color: #3c465c;
    }

	.truncate { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

	@media (max-width: 1024px) {
		.nav__button { padding: 0 6px !important; }
		a.mt-more-like-this { display: none !important; }
	}
</style>;`;


/* Global variables */

var searchInput, searchButton, moreLikeThisButton;


/* Flow */

initialize();


/* Functions */

function initialize () {
    var extendedEnabled = $('.nav__left-container').find('img[src*="https://raw.githubusercontent.com/nandee95"]').length > 0;

    $('head').append(STYLE);
    if (!$('.featured__container').length) $('.page__outer-wrap').css({ 'margin-top': '40px' });

    var neighbour = $('.nav__left-container').find('.nav__button-container').eq(0);
    var searchInputWrapper = $(HTML.searchInput);
    searchInputWrapper = $(HTML.searchInput);
    searchInputWrapper.keypress(onSearchInputKeyPress);
    searchInputWrapper.find('.mt-search-icon').click(onSearchButtonClick);
    neighbour.before(searchInputWrapper);
    searchInput = searchInputWrapper.find('input');

	setTimeout(function () {
		if ($('.sidebar__entry-custom').length) {
			var enterAllButton = $(HTML.enterAllButton);
			enterAllButton.click(enterAll);
			$('a[href="/account/settings/giveaways"]').after(enterAllButton);
		}
	}, 1);

    processNewRows();
    $(window).scroll(processNewRows);
}

function processNewRows () {
    $('.giveaway__row-inner-wrap:not(.mt)').each(function (i, element) {
		element = $(element);

        element.addClass('mt');
    });
}


function onSearchInputKeyPress (event) {
    if (event.keyCode === KEY_CODES.enter) {
        searchGiveaways(searchInput.val());
    }
}
function onSearchButtonClick () {
    searchGiveaways(searchInput.val());
}

function searchGiveaways (query, inNewTab) {
    query = query || searchInput.val();
    openLocation(`${URLS.query}${query ? `?q=${query}` : ''}`, inNewTab);
}

function openLocation (newLocation, inNewTab) {
    if (!!inNewTab) {
        window.open(newLocation);
    } else {
        location.href = newLocation;
    }
}

function enterAll (event) {
	event.preventDefault();
	$(SELECTORS.es_enterButtons).click();
}