// ==UserScript==
// https://greasyfork.org/scripts/26513-mangaupdates-cover-preview/
// @name        mangaupdates Cover Preview
// @namespace   szMangaupdatesCoverPreview
// @include     https://www.mangaupdates.com/*
// @include     http://www.mangaupdates.com/*
// @version     2.7
// @description Previews covers in mangaupdates.com when hovering over hyperlinks that lead to serie pages.
// @author      SZ
// @supportURL  https://greasyfork.org/en/scripts/26513-mangaupdates-cover-preview/feedback
// @inject-into content
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @run-at   	  document-end
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/26513/mangaupdates%20Cover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/26513/mangaupdates%20Cover%20Preview.meta.js
// ==/UserScript==
(function () {
	//console.log("cover preview start");
	"use strict";
	//#region frontend settings
	const MAXCACHEAGE = 90 * 24 * 60 * 60 * 1000; // Max Age before Cached data of serieinfo gets overridden with current data. Max Age is 90 days in milliseconds  //days * h * min  * sec * ms
	const DEFAULTTITLEBACKGROUNDCOLOR = "#2e3033"; //if no hijack class style available use plain color
	const DEFAULTBACKGROUNDCOLOR = "#17181a"; //if no hijack class style available use plain color
	let STYLESHEETHIJACKFORBACKGROUND = ""; //if unknown set empty ""; classname with leading dot seperated with comma
	let STYLESHEETHIJACKFORTITLE = ""; //if unknown set empty ""; classname with leading dot seperated with comma

	const PREDIFINEDNATIVTITLE = "Click for series info, Series Info"; //forum, index
	const isOnIndex = false; //now autodetect display style by checking container of link is tablecell "td"
	/*
      this.location.href == "https://www.novelupdates.com/" ||
      this.location.href.startsWith("https://www.novelupdates.com/?pg=");
      this.location.href.startsWith("https://www.novelupdates.com/group/"); //popup style next to container instead of next to linkitem
      */
	const targetContainerIDArrayToObserve = [
		"profile_content3",
		"messageList",
		"myTable",
	];
	/*
    observer needed for ajax changed page data. (here personal readinglist tab change and in the forum a quickedit of a post)
      update eventlistener on content change if element id found: isOnReadingListIndex [#profile_content3], in forum[#messageList] and on index[myTable] on tablesorting
      Attach container to a MutationObserver function which refreshes the eventlistener on links to seriepages
    */

	const internalLink = {
		//links on individual pages only relative without domain
		//mangaupdates.com/series.html?id=
		"www.mangaupdates.com/series/": {
			serieRegex: "\\w*/([\\w-]*)",
			rateLimitCount: 5,
			rateLimitTimeInSeconds: 10,
			//rateLimitQueryAfterSeconds:"2" //if not set, but both other values are available will be calculated into rateLimitQueryAfterSeconds = (rateLimitTimeInSeconds/rateLimitCount)
			seriePageTitle: ".releasestitle",
			serieAlternativeNames: 'div[data-cy="info-box-associated"]',
			IMAGELINKCONTAINERS: 'div[data-cy="info-box-image"] > div > img', //instead of single element class name with dot seperated with comma
			//IMAGEBLOCKER: "images/stat_increase.gif, images/stat_decrease.gif",
			//imageblocker was needed for previous non unique IMAGELINKCONTAINERS selector. ("".sContent img") since a page without cover would query the next available image (in this case rate up/down icon)
			//CONTAINERNUMBER: 0,
			seriePageVotes:
				"#mu-main > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(35)",
			seriePageStatus: 'div[data-cy="info-box-status"] > div > p',
			seriePageGenre: 'div[data-cy="info-box-genres"]',
			seriePageTags: 'div[data-cy="info-box-categories"] > div > div > ul',
			seriePageDescription:
				'div[data-cy="info-box-description"] > div > div > p',
			serieReadingListIcon: "#listLink", //#list_image
			serieReadingListTitle: "#showList > div > a > u",
		},
	};

	const internalLinkKey = Object.keys(internalLink);
	const INDIVIDUALPAGETEST = internalLinkKey[0]; //"www.novelupdates.com/series/"; //matched with includes
	let currentLinkLoadingTitle = "";
	let currentMousePopupData = { e: null, forceReload: false };
	let currentHoverTimeout;
	let lastPageGrab = 0;
	let rateLimitDelay = 1000;
	const hoverdelay = 1000; // updated in main() internalLink[individualLinksToTest].rateLimitTimeInSeconds/internalLink[individualLinksToTest].rateLimitCount;

	//console.log('internalLinkKey', internalLinkKey);
	//console.log('INDIVIDUALPAGETEST', INDIVIDUALPAGETEST);
	/*
    max possible externalLinkObject to insert into externalLinks
    {
      "individualSiteLink":{
        seriePageTitle:undefined,
        IMAGELINKCONTAINERS:undefined,
        CONTAINERNUMBER:0,
        seriePageDescription:undefined,
        seriePageStatus:undefined,
        seriePageChapters:undefined,
        seriePageVotes:undefined,
        seriePageGenre:undefined,
        seriePageTags:undefined,
        serieRegex:undefined,
      }
    }
    */
	const defaultRateLimitQueryAfterSeconds = 0.5;
	const defaultSerieRegex = "([0-9]+)(?!\\w)([/]+.*)?"; //block popup generation for externalLink without appended serie id
	// example: "link/"(id); "link/"(id)/; "link/"(id)/anything
	//not "link/"/; "link/"(id)something; "link/"(id)something/
	const externalLinks = {
		//#region site urls with public api access implemented
		/* https://mangadex.org/thread/351011
          chapter counts https://mangadex.org/api/v2/manga/" + id + "/chapters
          genre/tags id to name: https://mangadex.org/api/v2/tag
        */
		"mangadex.org/title/": {
			serieRegex: "([0-9]+)", //block popup generation for mangadex.org/title/ link without serie id
			mainAPI: "https://mangadex.org/api/v2/manga/",
			/* not possible no unique identification possible (no id or unique class for a container)
          depending on serie div count changing since not all values are always used
          data not at the same position and no unique selector available
          using public mangadex api
          */
		},
		"mangadex.org/manga/": {
			//alternative address same function
			serieRegex: "([0-9]+)",
			mainAPI: "https://mangadex.org/api/v2/manga/",
		},
		/* http://www.tvmaze.com/api
          alternative names http://api.tvmaze.com/shows/(id)/akas
          episode counts http://api.tvmaze.com/shows/(id)/episodes
        */
		"www.tvmaze.com/shows/": {
			serieRegex: "([0-9]+)",
			mainAPI: "http://api.tvmaze.com/shows/",
			//http://www.tvmaze.com/api#rate-limiting
			rateLimitCount: 10,
			rateLimitTimeInSeconds: 10,
			//rateLimitQueryAfterSeconds:"1" //if not set, but both other values are available will be calculated into rateLimitQueryAfterSeconds = (rateLimitTimeInSeconds/rateLimitCount)
			//if incomplete will use defaultRateLimitQueryAfterSeconds
		},
		//#endregion
		//https://www.wlnupdates.com/api-docs
		"wlnupdates.com/series-id/": {
			serieRegex: "([0-9]+)",
			mainAPI: "https://www.wlnupdates.com/api",
			/* using public api. no need to update if only page layout changes
        seriePageTitle: "h2",
        IMAGELINKCONTAINERS: ".imgDiv img",
        seriePageDescription: ".description",
        seriePageStatus: ".updating-current", //updating-stalled
        seriePageChapters: ".orig_status",
        seriePageVotes: ".br-current-rating",
        seriePageGenre: "#genre-container > .rowContents",
        seriePageTags: "#tag-container > .rowContents",
        */
			//serieRegex:undefined,
		},
		"www.novelupdates.com/series/": {
			serieRegex: "([\\w-]+/?).*",
			seriePageTitle: ".seriestitlenu",
			IMAGELINKCONTAINERS: ".serieseditimg img, .seriesimg img", //instead of single element class name with dot seperated with comma
			//CONTAINERNUMBER: 0, //in case that the query for IMAGELINKCONTAINERS has multiple img node results it can be selected by CONTAINERNUMBER or with img:nth-child(index) inside the query
			//the same can be used for external links
			seriePageVotes: ".seriesother > .uvotes",
			seriePageStatus: "#editstatus",
			seriePageGenre: "#seriesgenre",
			seriePageTags: "#showtags", //
			seriePageDescription: "#editdescription",
			serieAlternativeNames: "#editassociated",
			serieReadingListIcon: ".sticon img",
			serieReadingListTitle: ".sttitle > a",
		},
		"www.scribblehub.com/series/": {
			/*
        https://www.scribblehub.com/series/211234/the-impossible-fate-that-leads-to-a-god-of-a-new-world/
        exception linkid not forwared to url. linkID needs tobe number+/+stringuntil next slash
        https://www.scribblehub.com/series/211234
        */
			serieRegex: "([0-9]+(?=/)[/]?[\\w-]+[/]?)", //get #ID + / + string
			serieRegex2: "([0-9]+)", //if has not detailed regex get only #ID
			IMAGELINKCONTAINERS: ".fic_image img", //instead of single element class name with dot seperated with comma
			seriePageTitle: ".fic_title",
			seriePageVotes: "#ratefic_user > span",
			seriePageStatus: ".fic_stats > span:nth-child(3)",
			seriePageGenre: ".wi_fic_genre",
			seriePageTags: ".wi_fic_showtags_inner", //
			seriePageDescription: ".wi_fic_desc",
		},
		"www.webnovel.com/book/": {
			serieRegex: "([\\w'-]+[/]?).*", //domain/ + spring-blooms-when-i'm-with-you_12023713305779105
			IMAGELINKCONTAINERS: ".g_thumb > img", //instead of single element class name with dot seperated with comma
			seriePageTitle: ".det-info > div:nth-child(2) > h2",
			seriePageVotes: "._score > strong",
			seriePageStatus: ".det-hd-detail > strong > span",
			seriePageGenre: ".det-hd-detail > a > span",
			seriePageTags: ".m-tags",
			seriePageDescription: ".det-abt > div > p",
		},
		"royalroad.com/fiction/": {
			serieRegex: "([0-9]+)", //"([\\w-]+[/]?).*",
			//alternative serieRegex:"([0-9]+)(?=\/)""  would block detection if string after domain is "21220mother-of-learning"
			IMAGELINKCONTAINERS: ".fic-header > div > img", //instead of single element class name with dot seperated with comma
			seriePageTitle: ".fic-title > h1",
			seriePageVotes: undefined,
			seriePageStatus:
				".fiction-info > div > div:nth-child(2) > div > span:nth-child(2)",
			seriePageGenre: ".tags",
			seriePageTags: undefined, //
			seriePageDescription: ".description",
		},
		"royalroadl.com/fiction/": {
			//old domain? forwarded to standard domain
			serieRegex: "([0-9]+)",
			IMAGELINKCONTAINERS: ".fic-header > div > img", //instead of single element class name with dot seperated with comma
			seriePageTitle: ".fic-title > h1",
			seriePageVotes: undefined,
			seriePageStatus:
				".fiction-info > div > div:nth-child(2) > div > span:nth-child(2)",
			seriePageGenre: ".tags",
			seriePageTags: undefined, //
			seriePageDescription: ".description",
		},
		// haven't found a recent used  link no need to activate for incomplete data
		/*
      "wuxiaworld.com/novel/":{
        seriePageTitle: ".novel-body h2",
        IMAGELINKCONTAINERS: ".novel-left img", //instead of single element class name with dot seperated with comma
        seriePageStatus: ".novel-body > div:nth-child(2)",
        seriePageGenre: ".genres",
        seriePageDescription: ".novel-bottom > div:nth-child(4) > div",
      },*/
		"www.mtlnovel.com/": {
			serieRegex: "([\\w-]+[/]?).*",
			seriePageTitle: ".entry-title",
			IMAGELINKCONTAINERS: ".nov-head > amp-img", //instead of single element class name with dot seperated with comma
			seriePageVotes: ".star-avg",
			seriePageStatus: ".info tr:nth-child(3) > td:nth-child(3)",
			seriePageChapters: ".info-wrap div:nth-child(2)",
			seriePageGenre: "#currentgen",
			seriePageTags: ".info tr:nth-child(6)",
			seriePageDescription: ".desc",
			serieAlternativeNames: ".info tr:nth-child(2) > td:nth-child(3)",
		},
		/*
        not possible for the details and haven't seen an api
        example with different div row counts: https://bato.to/series/72644, https://bato.to/series/74357
        data not at the same position and no unique selector available
        */
		"bato.to/series/": {
			serieRegex: "([0-9]+[/]?)",
			seriePageTitle: ".item-title",
			IMAGELINKCONTAINERS: ".attr-cover > img", //instead of single element class name with dot seperated with comma
			seriePageDescription: ".attr-main > pre",
			seriePageChapters: ".episode-list > div.head > h4",
			seriePageGenre: ".attr-main > div:nth-child(3) > span",
			serieAlternativeNames: ".alias-set",
		},
		"mydramalist.com/": {
			serieRegex: "([0-9]+-[\\w-]+[/]?).*",
			seriePageTitle: ".film-title",
			serieAlternativeNames: ".mdl-aka-titles",
			IMAGELINKCONTAINERS: ".film-cover img",
			seriePageVotes: "#show-detailsxx .hfs",
			seriePageStatus:
				".content-side > div:nth-child(2) > div:nth-child(2) li:nth-child(4)",
			seriePageGenre: ".show-genres",
			seriePageTags: ".show-tags", //
			seriePageDescription: ".show-synopsis",
		},
		"www.imdb.com/title/": {
			serieRegex: "(tt[0-9]+[/]?).*",
			seriePageTitle: ".title_wrapper h1",
			IMAGELINKCONTAINERS: ".poster img",
			seriePageVotes: ".imdbRating > .ratingValue",
			seriePageStatus: ".title_wrapper .subtext",
			//seriePageGenre non static position. can be pushed down by Taglines box if available
			seriePageTags: "#titleStoryLine > div:nth-child(6)",
			seriePageDescription: "#titleStoryLine > div > p > span",
		},
		"www.tv.com/shows/": {
			serieRegex: "([\\w-]+[/]?).*",
			seriePageTitle: ".show_head > h1",
			IMAGELINKCONTAINERS: ".image_border img",
			seriePageVotes: ".score",
			seriePageStatus: ".tagline",
			seriePageGenre: ".categories > p",
			seriePageTags: ".themes > p",
			seriePageDescription: ".description > p",
		},
		"wiki.d-addicts.com/": {
			serieRegex: "([\\w-]+)",
			seriePageTitle: "#content .title",
			serieAlternativeNames:
				"#mw-content-text > .mw-parser-output > ul > li:nth-child(1)",
			IMAGELINKCONTAINERS: ".thumbinner img",
			seriePageVotes: ".voteboxrate",
			seriePageStatus:
				"#mw-content-text > .mw-parser-output > ul > li:nth-child(6)",
			seriePageChapters:
				"#mw-content-text > .mw-parser-output > ul > li:nth-child(4)",
			seriePageGenre:
				"#mw-content-text > .mw-parser-output > ul > li:nth-child(3)",
			seriePageDescription: "#mw-content-text p",
		},
		"asianwiki.com/": {
			serieRegex: "([\\w()-]+).*",
			seriePageTitle: ".article > h1",
			serieAlternativeNames: "#mw-content-text > ul > li:nth-child(2)",
			IMAGELINKCONTAINERS: ".thumbimage",
			seriePageVotes: "#w4g_rb_area-1",
			seriePageStatus: "#mw-content-text > ul > li:nth-child(8)",
			seriePageChapters: "#mw-content-text > ul > li:nth-child(7)",
			seriePageDescription: "#mw-content-text > ul ~ p", //next p sibling after ul
		},
		/*
      not possible.
      example https://myanimelist.net/manga/2 and https://myanimelist.net/manga/11 Alternative Titles is changing div child count and no unique selector possible
      no anonymous public api access available
      "https://myanimelist.net/manga/":{
        seriePageTitle: ".h1-title",
        IMAGELINKCONTAINERS: ".borderClass > div > div img",
        seriePageVotes: ".score-label",

        //serieAlternativeNames: ".borderClass > div > div:nth-child(8)",
        //seriePageStatus:".borderClass > div > div:nth-child(16)",
      // seriePageGenre:".borderClass > div > div:nth-child(17)",
        seriePageDescription: 'span[itemprop="description"',
      }
      */
	};
	const externalLinkKeys = Object.keys(externalLinks);

	const defaultshowIconNextToLink = false;
	let preloadUrlRequestsDefault = false; //if not set will default to true in release
	let deactivatePreloadUrlRequestOnUrls = [
		"wiki.d-addicts.com",
		"https://forum.novelupdates.com/threads/novel-updates-userscript-to-preview-cover-images-on-greasyfork.117240/", //deactivated urlPreload on this forum thread to stop bombardedment of requesting domain access in tampermonkey since all external links are listed in the nu forum post.
	];
	const preloadImagesDefault = false;
	let useReadingListIconAndTitle = false;
	const eventListenerStyle = 0; //undefined/0 forEach serieLink addeventlistener(mouseenter/mouseleave) / 1 window addeventlistener(mousemove)
	//#endregion end of frontend settings

	/* not available in firefox
    would have liked to automatically set preloadImages to true for wifi and non metered connections with speeds over 2MB/s
    console.log(navigator);
    let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let type = connection.effectiveType;

    function updateConnectionStatus() {
      console.log(connection)
      console.log("Connection type changed from " + type + " to " + connection.effectiveType);
      type = connection.effectiveType;

      if(connection.saveData==false){
        preloadUrlRequests = true;
        if(type=="wifi" || preloadImagesDefault)
          preloadImages = true;
      }
    }
    updateConnectionStatus();
    connection.addEventListener('change', updateConnectionStatus);
    */

	//#region backend variables ^^^^	frontend settings over this line	^^^^
	const version = "2.6.5";
	const forceUpdate = false;
	const debugCSSClasses = false; //log if css class is accessible else default include
	const lastUpdateCheck = 28 * 24 * 60 * 60 * 1000; //recheck if CSS available
	const settingsToKeepOnDataReset = [
		"showDescription",
		"showDetails",
		"showSmaller",
		"useReadingListIconAndTitle",
		"showIconNextToLink",
	];

	//console.log(GM_info);
	//console.log(GM_info.script.name);
	const isReleaseVersion = GM_info.script.name == "mangaupdates Cover Preview";
	//console.log("isReleaseVersion: " + isReleaseVersion);
	let preloadUrlRequests =
		isReleaseVersion &&
		(preloadUrlRequestsDefault === undefined || preloadUrlRequestsDefault);
	let preloadImages = false || (preloadImagesDefault && isReleaseVersion);
	//console.log("preloadUrlRequests: " + preloadUrlRequests)
	let showIconNextToLink = defaultshowIconNextToLink;
	//const maxWaitingTime = 120;

	const linkIconEnum = {
		popupPossibleNotLoadedOrMarkedForPreloading: 1,
		popupMarkedForPreloading: 2,
		popupLoading: 3,
		popupHasCoverData: 4,
		error: 5,
	};
	Object.freeze(linkIconEnum);
	const emptyCoverData = {
		url: undefined,
		title: undefined,
		alternativeNames: undefined,
		votes: undefined,
		status: undefined,
		chapters: undefined,
		genre: undefined,
		showTags: undefined,
		description: undefined,
		isExternal: undefined,
		readingListIcon: undefined,
		readingListIconText: undefined,
		readingListTitle: undefined,
	};

	const RE = /\s*,\s*/; //Regex for split and remove empty spaces
	const REGEX_DOTCOMMA = /[.,]/g;
	const reChapters = new RegExp("([0-9.]+)[ ]*(wn)?[ ]*chapters");
	const reChaptersNumberBehind = new RegExp("chapter[s]?[ ]*[(]?[ ]*([0-9.]+)");
	const reChaptersOnlyNumbers = new RegExp("([0-9.]+)");
	const reRating = new RegExp("([0-9.]+) / ([0-9.]+)");
	const reRatingSingleNumber = new RegExp("([0-9.]+)");
	const reVoteCount = new RegExp("([0-9.]+)[ ]*(votes|ratings|users)"); //

	//const reStripHTMLLiteral = "(<[\/]?(?!span|b|i|p|br[^\w]+\s*)(([\/]?[^>]+))>)";
	const reWhiteListStripHTML = new RegExp(
		"(<[/]?\\b(?!(b|i|br|p)[^\\w]+\\s*)(([/]?[^>]+))>)",
		"g"
	); //needed escape character changes remove escaping for / (\/) , specialFunction additional escaping for()
	//const reWhiteListHTML = /(<[\/]?\b(?!(b|u|i|br|p)[^\w]+\s*)(([\/]?[^>]+))>)/g   // /(<[\/]?\b(?!span|b|i|p|br[^\w]+\s*)(([\/]?[^>]+))>)/g;
	const offsetToBottomBorderY = 22; //offset to bottom border
	const offsetToRightBorderX = 10; //offset to right border
	const defaultHeight = 400; //in pixel
	const smallHeight = 250;
	//const IMAGEBLOCKERARRAY = IMAGEBLOCKER.split(RE);
	const PREDIFINEDNATIVTITLEARRAY = PREDIFINEDNATIVTITLE.split(RE);
	const STYLESHEETHIJACKFORBACKGROUNDARRAY =
		STYLESHEETHIJACKFORBACKGROUND.split(RE);
	const STYLESHEETHIJACKFORTITLEARRAY = STYLESHEETHIJACKFORTITLE.split(RE);

	let refreshInitValues = false;
	let showDetails = false;
	let popoverVisible = false; //not all links have a title or text(img link) to set currentTitelHover. Manual state saving needed
	let ALLSERIENODES = []; // = document.querySelectorAll('a[href*="' + INDIVIDUALPAGETEST + '"]');
	let ALLEXTERNALLINKNODES = [];
	let previousTitelHover,
		currentTitelHover,
		currentCoverData,
		currentPopupEvent;
	let popover, popoverTitle, popoverContent, arrowContainer;
	let lastTarget;
	let isShowingSpinnerAnimation = false;
	let showDescription = false;
	let showSmaller = false;
	let showHotkeys = false;
	let showAlternativeNames = false;
	let autoScrollCoverData = true;
	let coverDataContainer = [];
	let mediumTextStyle = "mediumText";
	let smallTextStyle = "smallText";
	let pressedKeys = [];
	let mangaDexTAGS;
	let currentOpenedUrl;
	let popoverBackgroundColor, popoverForegroundColor;
	let popoverBorderWidth;
	let popoverBorderColor;

	const supportsCSSMin = CSS.supports("max-Height", "min(400px, 100%)");
	const arrowWidthInPx = 40;
	//#endregion
	//console.log("after variable settings");
	//console.log(this.location)
	//console.log(this.location.href)

	//console.log("isOnIndex: " + isOnIndex)

	//#region helper functions

	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };
	//const configClass = { attributes: true, characterData: true, childList: true, subtree: true };

	//get value from key. Decide if timestamp is older than MAXCACHEAGE than look for new image
	function GM_getCachedValue(key) {
		const DEBUG = false;
		const currentTime = Date.now();
		const rawCover = GM_getValue(key, null);
		DEBUG && console.group("GM_getCachedValue key request: " + key);
		DEBUG && console.log("rawCover: " + rawCover);
		let result = null;
		if (rawCover === null || rawCover == "null") {
			result = null;
		} else {
			let coverData;
			try {
				//is json parseable data? if not delete for refreshing
				coverData = JSON.parse(rawCover);
				DEBUG && console.log("coverData: " + coverData);
				DEBUG && console.log(coverData);
				if (!(coverData.title && coverData.cachedTime)) {
					//has same variable definitions?
					GM_deleteValue(key);
					result = null;
				}
			} catch (e) {
				GM_deleteValue(key);
				result = null;
			}

			const measuredTimedifference = currentTime - coverData.cachedTime;
			if (measuredTimedifference < MAXCACHEAGE) {
				result = {
					url: coverData.url,
					title: coverData.title,
					alternativeNames: coverData.alternativeNames,
					votes: coverData.votes,
					status: coverData.status,
					chapters: coverData.chapters,
					genre: coverData.genre,
					showTags: coverData.showTags,
					description: coverData.description,
					isExternal: coverData.isExternal,
					readingListIcon: coverData.readingListIcon,
					readingListIconText: coverData.readingListIconText,
					readingListTitle: coverData.readingListTitle,
				};
			} else {
				GM_deleteValue(key);
				result = null;
			}
		}
		DEBUG && console.groupEnd("GM_getCachedValue");
		DEBUG && console.log(result);

		return result;
	}

	//set value and currenttime for key
	function GM_setCachedValue(key, coverData) {
		const DEBUG = false;
		const cD = {
			url: coverData.url,
			title: coverData.title,
			alternativeNames: coverData.alternativeNames,
			votes: coverData.votes,
			status: coverData.status,
			chapters: coverData.chapters,
			genre: coverData.genre,
			showTags: coverData.showTags,
			description: coverData.description,
			isExternal: coverData.isExternal,
			readingListIcon: coverData.readingListIcon,
			readingListIconText: coverData.readingListIconText,
			readingListTitle: coverData.readingListTitle,
			cachedTime: Date.now(),
		};
		GM_setValue(key, JSON.stringify(cD));
		DEBUG && console.group("GM_setCachedValue key: " + key);
		DEBUG && console.log("save coverdata");
		DEBUG && console.log("coverData cD", cD);
		DEBUG && console.group("GM_setCachedValue");
	}
	function styleSheetContainsClass(f) {
		const DEBUG = false;
		var localDomainCheck = "^http://" + document.domain;
		var localDomainCheckHttps = "^https://" + document.domain;
		// DEBUG && console.log("Domain check with: " + localDomainCheck);
		var hasStyle = false;
		var stylename = f;
		var fullStyleSheets = document.styleSheets;
		// DEBUG && console.log("start styleSheetContainsClass " + stylename);
		if (fullStyleSheets) {
			const styleSheetsLengthToLoop = fullStyleSheets.length - 1;
			for (let i = 0; i < styleSheetsLengthToLoop; i++) {
				//DEBUG && console.log("loop fullStyleSheets " + stylename);
				let styleSheet = fullStyleSheets[i];
				if (
					styleSheet != null &&
					styleSheet.href !== null &&
					(styleSheet.href.match(localDomainCheck) ||
						styleSheet.href.match(localDomainCheckHttps)) &&
					styleSheet.cssRules //https://gold.xitu.io/entry/586c67c4ac502e12d631836b "However since FF 3.5 (or thereabouts) you don't have access to cssRules collection when the file is hosted on a different domain" -> Access error for Firefox based browser. script error not continuing
				) {
					//DEBUG && console.log("styleSheet.cssRules.length: " + styleSheet.cssRules.length)
					const ruleLengthToLoop = styleSheet.cssRules.length - 1;
					for (let rulePos = 0; rulePos < ruleLengthToLoop; rulePos++) {
						if (styleSheet.cssRules[rulePos] !== undefined) {
							//DEBUG && console.log("styleSheet.cssRules[rulePos] "+ stylename);
							//DEBUG && console.log(styleSheet.cssRules[rulePos])
							if (styleSheet.cssRules[rulePos].selectorText) {
								//  console.log(styleSheet.cssRules[rulePos].selectorText)
								if (styleSheet.cssRules[rulePos].selectorText == stylename) {
									// console.log('styleSheet class has been found - class: ' + stylename);
									hasStyle = true; //break;
									break; //return hasStyle;
								}
							} //else DEBUG && console.log("undefined styleSheet.cssRules[rulePos] "+rulePos +" - "+ stylename);
						}
						//else DEBUG && console.log("loop undefined styleSheet.cssRules[rulePos] "+ stylename);
					}
					//else DEBUG && console.log("undefined styleSheet.cssRules "+ stylename);
				}
				//   DEBUG && console.log("stylesheet url " + styleSheet.href);
				//else DEBUG && console.log("undefined styleSheet "+ stylename);
				if (hasStyle) break;
			}
		} //else console.log("undefined fullStyleSheets=document.styleSheets "+ stylename);
		if (!hasStyle) {
			console.log("styleSheet class has not been found - style: " + stylename);
		}
		return hasStyle;
	}

	// Callback function to execute when mutations are observed
	/* https://www.freecodecamp.org/news/var-let-and-const-whats-the-difference/
          const function can not be overwritten //https://stackoverflow.com/questions/54915917/overwrite-anonymous-const-function-in-javascript
          https://www.digitalocean.com/community/tutorials/understanding-hoisting-in-javascript
          function callback  () is anonymous var function which can be overwritten?
          */

	const debounce = function (func, timeout) {
		let timer;
		return (...args) => {
			const next = () => func(...args);
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(next, timeout > 0 ? timeout : 300);
		};
	};

	//https://gist.github.com/peduarte/969217eac456538789e8fac8f45143b4#file-index-js
	const throttle = function (func, wait = 100) {
		let timer = null;
		return function (...args) {
			if (timer === null) {
				timer = setTimeout(() => {
					func.apply(this, args);
					timer = null;
				}, wait);
			}
		};
	};

	const callbackMutationObserver = function (mutationsList, observer) {
		console.group("new observer");
		console.log("mutationsList", mutationsList);
		// Use traditional 'for loops' for IE 11
		for (const mutation of mutationsList) {
			console.log("mutation.type", mutation.type);
			if (mutation.type === "childList" || mutation.type === "characterData") {
				// console.log('A child node has been added or removed.');
				//debouncedTest()
				hidePopOver();
				debouncedpreloadCoverData();
			} else if (mutation.type === "attributes") {
				//   console.log('The ' + mutation.attributeName + ' attribute was modified.');
			}
		}
		console.groupEnd();
	};
	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callbackMutationObserver);
	const debouncedpreloadCoverData = debounce(preloadCoverData, 100);
	const throttledGetHoveredItem = throttle(getHoveredItem, 50);

	//https://math.stackexchange.com/questions/814950/how-can-i-rotate-a-coordinate-around-a-circle
	/**
	 *
	 *
	 * @param {*} cx = pivot
	 * @param {*} cy = pivot
	 * @param {*} mx = offset
	 * @param {*} my = offset
	 * @param {*} angle
	 * @returns
	 */
	function getRotatedPoint(cx, cy, mx, my, angle) {
		let x, y;
		angle = ((angle % 360) / 180) * Math.PI;
		x = ((mx - cx) * Math.cos(angle) - (my - cy) * Math.sin(angle) + cx) | 0;
		y = ((mx - cx) * Math.sin(angle) + (my - cy) * Math.cos(angle) + cy) | 0;
		return { x: x, y: y };
	}

	//https://stackoverflow.com/questions/1887104/how-to-get-the-background-color-of-an-html-element
	const getComputedStyle = function (element, property) {
		return window.getComputedStyle
			? window.getComputedStyle(element, null).getPropertyValue(property)
			: element.style[
					property.replace(/-([a-z])/g, function (g) {
						return g[1].toUpperCase();
					})
			  ];
	};
	//adjusted from https://stackoverflow.com/questions/34980574/how-to-extract-color-values-from-rgb-string-in-javascript/34980657
	function getRGBValues(str) {
		var vals = str.substring(str.indexOf("(") + 1, str.length - 1).split(", ");
		return vals;
	}
	//adjusted from https://gist.github.com/JordanDelcros/518396da1c13f75ee057
	function blendColorsToRGBA(colors = []) {
		var base = [0, 0, 0, 0];
		var mix;
		var added;
		while ((added = colors.shift())) {
			//console.log(added)
			//console.log(typeof added)
			if (typeof added == "string") {
				const arrayColor = getRGBValues(added);
				//console.log(arrayColor)
				added = arrayColor;
			}

			//console.log(added[3])
			//console.log(typeof added[3])
			if (typeof added[3] === "undefined") {
				//if rgb add alpha 1

				added[3] = 1;
			}
			//console.log(added)
			//console.log(base)
			// check if both alpha channels exist.
			if (base[3] && added[3]) {
				mix = [0, 0, 0, 0];
				// alpha
				mix[3] = 1 - (1 - added[3]) * (1 - base[3]);
				//console.log(added)
				//console.log(base)
				// red
				mix[0] = Math.round(
					(added[0] * added[3]) / mix[3] +
						(base[0] * base[3] * (1 - added[3])) / mix[3]
				);
				// green
				mix[1] = Math.round(
					(added[1] * added[3]) / mix[3] +
						(base[1] * base[3] * (1 - added[3])) / mix[3]
				);
				// blue
				mix[2] = Math.round(
					(added[2] * added[3]) / mix[3] +
						(base[2] * base[3] * (1 - added[3])) / mix[3]
				);
				//console.log(mix);
			} else if (added) {
				//console.log(added)
				mix = added;
			} else {
				//console.log(base)
				mix = base;
			}
			//console.log(mix)
			base = mix;
		}
		//console.log(mix)
		return "rgba(" + mix + ")";
	}
	//#endregion helper functions
	function checkDataVersion() {
		//Remove possible incompatible old data
		const DEBUG = false;
		const dataVersion = GM_getValue("version", null);
		DEBUG && console.log("dataVersion: " + dataVersion);

		if (
			dataVersion === null ||
			dataVersion === undefined ||
			dataVersion != version ||
			forceUpdate
		) {
			resetDatabase();
			//resetSettings();
		}
	}
	function resetDatabase() {
		const DEBUG = false;
		const oldValues = GM_listValues();
		DEBUG && console.log("oldValues.length: " + oldValues.length);
		const oldValuesLengthToLoop = oldValues.length;
		for (let i = 0; i < oldValuesLengthToLoop; i++) {
			if (!settingsToKeepOnDataReset.includes(oldValues[i])) {
				GM_deleteValue(oldValues[i]);
			} else {
				//console.log("keep setting")
				//console.log(oldValues[i])
			}
			//console.log(oldValues[i])
		}
		GM_setValue("version", version);
		DEBUG && console.log(oldValues);
		!isReleaseVersion && console.log("Finished clearing CoverData");
	}
	function resetSettings() {
		for (let i = 0; i < settingsToKeepOnDataReset.length; i++) {
			GM_deleteValue(settingsToKeepOnDataReset[i]);
		}
		GM_setValue("version", version);
	}
	//https://www.w3resource.com/javascript-exercises/javascript-math-exercise-27.php
	function pointDirection(x1, y1, x2, y2) {
		return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
	}
	function checkIsTableElement(element) {
		if (
			element.tagName == "TD" ||
			element.parentElement.tagName == "TD" ||
			element.className.includes("col-") || //tailwind column styles  needed for mangaupdates
			element.parentElement.className.includes("col-")
		) {
			return true;
		}
		return false;
	}

	function showBorderArrowBox(
		event,
		arrowWidth = 20,
		upside = false,
		isExternal = false,
		arrowTableSideRight = true
	) {
		const DEBUG = false;

		/*
      - getPopover Rect
      - generate circleBox
      - generate arrow
      - rotate arrow to target
    */
		const nativElement = event.target;
		let targetElement = nativElement;
		let isInChildContainer = false;
		let tableElement = checkIsTableElement(nativElement);
		DEBUG && console.group("showBorderArrowBox");
		const elementLinkHasNoText = targetElement.textContent.length == 0;
		//elementLinkHasNoText
		if (isOnIndex || elementLinkHasNoText || tableElement) {
			isInChildContainer = true;
			targetElement = nativElement.parentElement; //get container element/table cell
		}
		/*
      if(elementLinkHasNoText){
        targetElement = nativElement.parentElement.parentElement;
        console.log(targetElement);
      }
      */
		const targetRectBounds = targetElement.getBoundingClientRect();
		let targetRect = targetRectBounds;
		//https://stackoverflow.com/questions/52712760/get-how-many-lines-a-textarea-has
		/*
    TODO
    novelupdates forum/xenforum script is somehow changing element with class "ugc" which prevents getting the pseudo element a::before from getClientRects()
    */
		DEBUG && console.log(targetElement);
		const targetLineRects = targetElement.getClientRects();

		let firstLineRect, lastLineRect;
		let firstRectIndex;
		DEBUG && console.log(targetRect);
		//console.log(targetLineRects);
		firstRectIndex = 0;
		if (targetLineRects.length > 0) {
			if (showIconNextToLink && targetLineRects.length > 1) {
				firstRectIndex = 1;
			}

			targetRect = targetLineRects[firstRectIndex];
			firstLineRect = targetRect;
			lastLineRect = targetLineRects[targetLineRects.length - 1];
		}

		//if (lastLineRect != firstLineRect)
		if (lastLineRect) targetRect = lastLineRect;
		if (!upside) {
			if (firstLineRect) targetRect = firstLineRect;
		}

		let popoverRect = popover.getBoundingClientRect();
		DEBUG && console.log(popoverRect);
		DEBUG && console.log(targetRect);
		DEBUG && console.log(targetRectBounds);
		const scrollPosY =
			window.scrollY ||
			window.scrollTop ||
			document.getElementsByTagName("html")[0].scrollTop;
		const scrollPosX =
			window.scrollX ||
			window.scrollLeft ||
			document.getElementsByTagName("html")[0].scrollLeft;

		arrowContainer.style.position = "absolute";
		arrowContainer.style.zIndex = "8";

		arrowContainer.style.height = arrowWidth + "px";
		arrowContainer.style.width = arrowWidth + "px";
		let posY = 0;
		let rotateArrowInDegree = 0;
		let targetPosY, sourcePosY;
		let targetXSourcePosition;
		let popupSourceX;
		const targetHalfHeight = targetRect.height / 2;
		const halfArrowWidth = arrowWidth / 2;
		let halfWidth = arrowWidth / 2;
		const quarterArrowWidth = arrowWidth / 4;
		let arrowContainerTopPositionLocal;
		let targetRectTopDistance = targetRect.top - popoverRect.top;
		let targetElementDistanceY =
			targetRectTopDistance - targetRect.height / 4 + 1;
		const minYPosOnPopup = -quarterArrowWidth;
		const maxYPosOnPopup =
			popoverRect.height - (arrowWidth - quarterArrowWidth);
		if (targetElementDistanceY < minYPosOnPopup) {
			targetElementDistanceY = minYPosOnPopup;
		}
		if (targetElementDistanceY > maxYPosOnPopup) {
			targetElementDistanceY = maxYPosOnPopup;
		}

		//if (isExternal) externalStyle = "isExternalContentArrow ";
		//|| elementLinkHasNoText
		if (isOnIndex || tableElement) {
			//#region "index/container layout"
			DEBUG && console.log("index/container layout");
			DEBUG && console.log(targetRect);
			DEBUG && console.log("targetRect.height: " + targetRect.height);

			const upperBorder = popoverRect.top - quarterArrowWidth;
			const lowerBorder =
				popoverRect.bottom - halfArrowWidth - quarterArrowWidth;

			DEBUG &&
				console.log(
					"targetRect.height: " +
						targetRect.height +
						", targetHalfHeight: " +
						targetHalfHeight
				);
			targetPosY = targetRect.top; //targetRectYMiddle;
			sourcePosY = targetPosY;
			//#region get targetPointY
			DEBUG &&
				console.log(
					"targetPosY: " +
						targetPosY +
						", upperBorder: " +
						upperBorder +
						", lowerBorder: " +
						lowerBorder
				);
			if (targetPosY < upperBorder) {
				sourcePosY = upperBorder;
				DEBUG && console.log("set targetPosY = upperBorder");
			}
			if (targetPosY > lowerBorder) {
				sourcePosY = lowerBorder;
				DEBUG && console.log("set  targetPosY = lowerBorder");
			}
			//#endregion
			//#region limit popover sourceY position
			//sourcePosY = targetPosY;
			//#endregion

			DEBUG &&
				console.log(
					"targetPosY: " +
						targetPosY +
						", sourcePosY: " +
						sourcePosY +
						", scrollPosY: " +
						scrollPosY +
						", top: " +
						(scrollPosY + targetPosY)
				);

			DEBUG &&
				console.log(
					"targetElementDistanceY: " +
						targetElementDistanceY +
						",  popoverRect.top: " +
						popoverRect.top +
						", targetRect.top: " +
						targetRect.top
				);
			arrowContainerTopPositionLocal = popoverRect.top + targetElementDistanceY;
			arrowContainer.style.top =
				scrollPosY + arrowContainerTopPositionLocal + "px"; //sourcePosY
			//#endregion arrow vertical position

			//#region arrow on leftOrRightSide of popover
			if (arrowTableSideRight) {
				arrowContainer.style.left =
					scrollPosX + popoverRect.left - halfWidth + "px";
			} else {
				arrowContainer.style.left =
					scrollPosX + popoverRect.left + popoverRect.width - halfWidth + "px";
			}
			//#endregion arrow on leftOrRightSide of popover

			DEBUG &&
				console.log(
					"posY: " +
						posY +
						", popoverRect.top + posY + arrowWidth: " +
						(popoverRect.top + posY + arrowWidth)
				);
			targetXSourcePosition = targetRect.right;
			popupSourceX = popoverRect.left;
			rotateArrowInDegree =
				pointDirection(
					popupSourceX,
					sourcePosY,
					targetXSourcePosition - arrowWidth,
					targetPosY
				) - 45;

			//width:100%;height:100%;
			//#endregion "index/container layout"
		} else {
			//#region "under/over link layout"
			DEBUG && console.log("under/over link layout");
			//#region horizontal

			//#region targetPosX
			// let targetX = targetRect.right;
			let diffXTarget = targetRect.right - popoverRect.left;
			const diffXTargetWithHalfwidth = diffXTarget + halfWidth;
			if (diffXTarget - halfWidth < 0) diffXTarget = halfWidth;
			let targetXSourcePosition = targetRect.right - diffXTargetWithHalfwidth;
			if (diffXTarget > targetRect.width) {
				targetXSourcePosition = targetRect.left;
			}
			//#endregion targetPosX

			//#region popoverPosX
			popupSourceX = popoverRect.left - halfWidth;
			DEBUG &&
				console.log(
					"diffXTargetWithHalfwidth: " +
						diffXTargetWithHalfwidth +
						", targetRect.width: " +
						targetRect.width
				);
			if (diffXTargetWithHalfwidth > targetRect.width) {
				popupSourceX = targetXSourcePosition;
			}
			//#endregion popoverPosX
			//#region move arrowHead in targetDirection
			if (diffXTarget < halfWidth) {
				targetXSourcePosition -= halfWidth;
			}
			//#endregion move arrowHead in targetDirection
			if (targetXSourcePosition) {
				DEBUG &&
					console.log(
						"diffXTarget: " +
							diffXTarget +
							", popupSourceX: " +
							popupSourceX +
							", targetRect.width: " +
							targetRect.width +
							", targetXSourcePosition: " +
							targetXSourcePosition
					);
			}
			//#endregion
			//#region vertical position over/under popup
			arrowContainer.style.left = scrollPosX + popupSourceX + "px";
			if (upside) {
				//arrow at topside
				let popoverOutsideTargetHorizontal = 0;

				DEBUG &&
					console.log(
						"popoverOutsideTargetHorizontal: " + popoverOutsideTargetHorizontal
					);
				arrowContainer.style.top =
					scrollPosY + popoverRect.top - arrowWidth / 2 + "px";

				rotateArrowInDegree =
					pointDirection(
						popupSourceX,
						popoverRect.top + posY + arrowWidth,
						targetXSourcePosition, //targetX+popoverOutsideTargetHorizontal
						targetRect.top + arrowWidth
					) - 45;
				//width:100%;height:100%;
			} else {
				//arrow at bottom
				arrowContainer.style.top =
					scrollPosY + popoverRect.bottom - arrowWidth / 2 + "px";

				rotateArrowInDegree =
					pointDirection(
						popupSourceX,
						popoverRect.bottom + posY + halfWidth,
						targetXSourcePosition,
						targetRect.bottom + halfWidth
					) - 45;
				//width:100%;height:100%;
			}
			//#endregion vertical position over/under popup
			//#endregion "under/over link layout"
		}
		let targetRotation = rotateArrowInDegree - 45;
		// let targetSourceAbsoluteDiffY = sourcePosY - targetPosY;
		let targetDiffX = popupSourceX - targetXSourcePosition;
		DEBUG && console.log("isInChildContainer:" + isInChildContainer);
		if (isInChildContainer) {
			const nativRect = nativElement.getBoundingClientRect();
			targetDiffX = popupSourceX - nativRect.right - halfArrowWidth;
			DEBUG && console.log(nativRect);
		}

		DEBUG &&
			console.log(
				"popupSourceX: " +
					popupSourceX +
					", targetXSourcePosition: " +
					targetXSourcePosition +
					", targetDiffX: " +
					targetDiffX
			);
		let containerOffsetX = 12; //12;

		let offsetPointOnArrow = { x: 20, y: 40 + containerOffsetX };
		let pivotOnArrow = { x: 20, y: 20 }; //svg viewbox height/width = 24
		let newSourcePointXY = getRotatedPoint(
			pivotOnArrow.x,
			pivotOnArrow.y,
			offsetPointOnArrow.x,
			offsetPointOnArrow.y,
			rotateArrowInDegree - 45
		);
		DEBUG && console.log("newSourcePointXY: " + newSourcePointXY);
		DEBUG && console.log(newSourcePointXY);
		let x1, y1, x2, y2;

		let rectDistance = 0;
		// if (targetRect.top < popoverRect.top)
		{
			rectDistance = targetRect.top - popoverRect.top;
		}
		let arrowOffsetY = targetRectTopDistance - targetElementDistanceY;
		DEBUG &&
			console.log(
				"popoverRect.top: " +
					popoverRect.top +
					", targetRect.top: " +
					targetRect.top +
					", popoverRect.bottom: " +
					popoverRect.bottom +
					", targetRect.bottom: " +
					targetRect.bottom +
					", rectDistance: " +
					rectDistance +
					", targetDiffX: " +
					targetDiffX +
					", targetElementDistanceY: " +
					targetElementDistanceY +
					", popoverRect.height: " +
					popoverRect.height +
					", arrowContainerTopPositionLocal: " +
					arrowContainerTopPositionLocal +
					", arrowOffsetY: " +
					arrowOffsetY +
					", targetRectTopDistance: " +
					targetRectTopDistance
			);

		const circleRadius = 1;
		x1 = -targetDiffX + circleRadius; //-(targetDiffX-newSourcePointXY.x)-newSourcePointXY.x//targetRect.right; //0 - containerOffsetX;
		y1 = arrowOffsetY + targetHalfHeight; //;//rectDistance; // + targetHalfHeight  //targetElementDistanceY  arrowContainerTopPositionLocal-popoverRect.top
		DEBUG &&
			console.log(
				"y1: " +
					y1 +
					", rectDistance: " +
					rectDistance +
					", targetHalfHeight: " +
					targetHalfHeight
			);
		//(targetRect.height/2) + targetElementDistanceY;//targetRect.top+targetRect.height/2;//targetSourceAbsoluteDiffY;  //

		x2 = newSourcePointXY.x;
		y2 = newSourcePointXY.y;

		DEBUG &&
			console.log(
				"newSourcePointXY.x: " +
					newSourcePointXY.x +
					", newSourcePointXY.y: " +
					newSourcePointXY.y +
					", targetX: " +
					x2 +
					", targetY: " +
					y2 +
					", targetElementDistanceY: " +
					targetElementDistanceY
			);
		let point =
			'<circle cx="' +
			newSourcePointXY.x +
			'" cy="' +
			newSourcePointXY.y +
			'" r="' +
			circleRadius +
			'" stroke="red" fill="transparent" stroke-width="1"/>' +
			'<circle cx="' +
			x1 +
			'" cy="' +
			y1 +
			'" r="' +
			circleRadius +
			'" stroke="green" fill="transparent" stroke-width="1"/>';
		let line = //startY
			//'<line x1="'+(x1-targetDiffX+arrowWidth-quarterArrowWidth)+'" y1="'+(y1-(arrowWidth-quarterArrowWidth))+'" x2="'+(x2-targetDiffX)+'" y2="'+(y2)+'" stroke="black" stroke-width="1"/></svg>';
			'<line x1="' +
			x1 +
			'" y1="' +
			y1 +
			'" x2="' +
			x2 +
			'" y2="' +
			y2 +
			'" stroke="black" stroke-width="1"/>';

		let additionalLineSVG = "";
		if (isOnIndex || tableElement) {
			additionalLineSVG =
				'<div style="width:100%;height:100%;position:absolute;top:0;left:0;"><svg xmlns="http://www.w3.org/2000/svg" style="overflow:visible">' +
				line +
				point +
				"</svg></div>";
		}
		let borderColor = "black";
		if (isExternal) borderColor = "red";
		arrowContainer.innerHTML =
			'<div style="width:40px;height:40px;transform: rotate(' +
			targetRotation +
			'deg);padding:2px">' +
			'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-down" style="width:100%;height:100%;overflow:visible" viewBox="0 0 24 24" stroke-width="1" vector-effect="non-scaling-stroke" stroke="currentColor" fill="' +
			popoverForegroundColor +
			'" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 ' +
			containerOffsetX +
			')">' +
			//'<rect width="100%" height="100%" style="fill:rgb(100,155,255);stroke-width:1;stroke:rgb(0,0,0)" />' +
			'<filter id="shadow"><feDropShadow dx="0.5" dy="-0.5" stdDeviation="0.8"/></filter>' +
			'<circle cx="12" cy="12" r="13" stroke="' +
			borderColor +
			'" fill="' +
			popoverBackgroundColor +
			'" stroke-width="' +
			popoverBorderWidth +
			'" style="filter:url(#shadow);"/>' +
			'<path d="M 15 0 v 15 h 3.586 a 1 1 0 0 1 0.707 1.707 l -6.586 6.586 a 1 1 0 0 1 -1.414 0 l -6.586 -6.586 a 1 1 0 0 1 0.707 -1.707 h 3.586 L 9 0 z" transform=""/>' +
			"</svg></div>" +
			additionalLineSVG;
		DEBUG && console.log("scrollPosY: " + scrollPosY);
		arrowContainer.style.pointerEvents = "none";
		DEBUG && console.log("posY: " + posY);
		// rotateArrowInDegree+=-135; //https://www.w3schools.com/howto/howto_css_arrows.asp
		DEBUG && console.log("rotateArrowInDegree: " + rotateArrowInDegree);

		DEBUG && console.groupEnd("showBorderArrowBox");
		//arrowContainer.style.visibility = "visible";
		//arrowContainer.classList.remove("hidePopover");
	}
	function getPopupPos(event, arrowWidth = 0, isExternal = false) {
		const DEBUG = false;

		const scrollPosY =
			window.scrollY ||
			window.scrollTop ||
			document.getElementsByTagName("html")[0].scrollTop;
		const scrollPosX =
			window.scrollX ||
			window.scrollLeft ||
			document.getElementsByTagName("html")[0].scrollLeft;

		let targetHeight = defaultHeight;
		if (showSmaller) targetHeight = smallHeight;
		let targetWidth = targetHeight;
		if (showDetails) targetWidth = targetHeight * 2;
		//console.log("targetWidth: " + targetWidth)
		//console.log(event)
		popover.style.maxHeight = ""; //reset to max height
		//popover.style.maxWidth = "";  //reset to max height
		const popoverRect = popover.getBoundingClientRect();

		const nativElement = event.target;
		let targetElement = nativElement;

		let tableElement = checkIsTableElement(nativElement);
		//console.log("nativElement.classList")
		//console.log(nativElement.classList)
		//console.log(nativElement.className)
		//console.log('nativElement.classList.contains("externalLink") ' + nativElement.className.split(" ").some(classname => classname.startsWith("externalL")))
		//console.log('nativElement.className.includes("externalL") ' + nativElement.className.includes("externalL"))
		//

		const elementLinkHasNoText = targetElement.textContent.length == 0;
		// || elementLinkHasNoText
		if (isOnIndex || elementLinkHasNoText || tableElement) {
			DEBUG &&
				console.log(
					"(isOnIndex || elementLinkHasNoText || tableElement) -> targetElement = nativElement.parentElement"
				);
			targetElement = nativElement.parentElement; //get container element/table cell
		}

		let X, Y;
		DEBUG && console.group("getPopupPos");

		DEBUG &&
			console.log(
				"elementLinkHasNoText: " +
					elementLinkHasNoText +
					", targetElement.textContent: " +
					targetElement.textContent +
					" targetElement.textContent.length: " +
					targetElement.textContent.length
			);
		DEBUG && console.log(nativElement.parentElement);
		DEBUG && console.log(nativElement.parentElement.tagName);
		DEBUG && console.log(targetElement);
		let targetRect = targetElement.getBoundingClientRect();
		const targetLineRects = targetElement.getClientRects();
		let firstLineRect, lastLineRect, firstRectIndex;
		DEBUG && console.log("targetLineRects.length: " + targetLineRects.length);
		for (let i = 0; i < targetLineRects.length; i++) {}
		if (targetLineRects.length > 0) {
			firstRectIndex = 0;
			if (showIconNextToLink && targetLineRects.length > 1) {
				firstRectIndex = 1; //TODO to double check if needed sometimes the pseudo element(state icon) seems to be counted in the DOMRectList
				//chrome https://www.novelupdates.com/reading-list/?list=0
				//vs https://forum.novelupdates.com/threads/chapter-numbering-error.119015/ pseudo element not counted?
			}
			//console.log(targetLineRects)
			firstLineRect = targetLineRects[firstRectIndex];
			lastLineRect = targetLineRects[targetLineRects.length - 1];
			//TODO check if line.bottom is visible in container(edge case word wrapped link in container with overflow:hidden) else loop check previous line.
		} else {
			//case empty text link with only an image
			firstLineRect = targetRect;
		}

		if (lastLineRect) targetRect = lastLineRect;

		const Rx = targetRect.right;
		const Ry = targetRect.bottom;

		DEBUG && console.group("debug rects");
		DEBUG && console.log("scrollPosX: " + scrollPosX);
		DEBUG && console.log("scrollPosY: " + scrollPosY);
		DEBUG &&
			console.log(
				"document.body.offsetHeight: " +
					document.body.offsetHeight +
					", document.body.scrollHeight: " +
					document.body.scrollHeight
			);
		DEBUG && console.log("window.innerHeight: " + window.innerHeight);
		DEBUG && console.log("window.innerWidth: " + window.innerWidth);
		DEBUG && console.log(targetElement);
		DEBUG && console.log(targetLineRects);
		DEBUG && console.log(firstLineRect);
		DEBUG && console.log(lastLineRect);
		DEBUG && console.log("Rx: " + Rx + ", Ry: " + Ry);
		DEBUG && console.groupEnd();
		const nonOverlappingArrowWidth = (arrowWidth * 3) / 4;
		const marginY = offsetToBottomBorderY + nonOverlappingArrowWidth;
		let distanceToTopFromLink = firstLineRect.top - nonOverlappingArrowWidth;
		let distanceToBottomFromLink =
			window.innerHeight -
			targetRect.bottom -
			offsetToBottomBorderY +
			nonOverlappingArrowWidth; //lastLineRect -> targetRect
		let distanceToRightFromlink = window.innerWidth - targetRect.right;
		let distanceToLeftFromlink = targetRect.left;
		let arrowTableSideRight = true;
		//reset width/height
		//popover.style.height="100%";
		if (supportsCSSMin) {
			popover.style.height = "";
			popover.style.width = "";
		} else {
			popover.style.height = targetHeight + "px";
			popover.style.width = targetWidth + "px";
		}

		//#region set to top/bottom position
		DEBUG && console.group("top/bottom placement");
		let upside = false;
		let targetYPosition = 0;
		let maxHeight = targetHeight;
		let maxHeightInsideAvailableSpace;

		//#region  calculate maxHeight between targetHeight and image/popover height
		popover.style.maxHeight = targetHeight + "px";
		//setPopoverHeight(targetHeight,0);
		if (popoverRect.height < targetHeight) {
			maxHeight = popoverRect.height;
		} else maxHeight = targetHeight;
		//#endregion
		maxHeightInsideAvailableSpace = maxHeight;
		if (!(isOnIndex || tableElement)) {
			//#region "not on index/table cell td"
			DEBUG && console.log("not on index/table cell td");
			/*
        bottom bigger than top || bottomSpaceIsBiggerThanTargetHeight
          -> bottom bigger than full height
          -> bottom smaller than full height
        bottom smaller than top
          -> top bigger than full height
          -> top smaller than full height
        */
			const targetHeightMarginAdded = targetHeight + marginY;
			DEBUG &&
				console.log("targetHeightMarginAdded: " + targetHeightMarginAdded);
			const bottomHasMoreSpaceThanTop =
				distanceToBottomFromLink > distanceToTopFromLink;
			const bottomSpaceIsBiggerThanTargetHeight =
				distanceToBottomFromLink > targetHeight + marginY; //maxHeight;
			DEBUG &&
				console.log(
					"bottomHasMoreSpaceThanTop: " +
						bottomHasMoreSpaceThanTop +
						", distanceToTopFromLink: " +
						distanceToTopFromLink +
						", distanceToBottomFromLink: " +
						distanceToBottomFromLink
				);
			DEBUG &&
				console.log(
					"bottomSpaceIsBiggerThanTargetHeight: " +
						bottomSpaceIsBiggerThanTargetHeight +
						", targetHeight: " +
						targetHeight +
						", maxHeight: " +
						maxHeight +
						", popoverRect.height: " +
						popoverRect.height +
						", marginY: " +
						marginY +
						", distanceToBottomFromLink: " +
						distanceToBottomFromLink +
						", targetHeight + marginY: " +
						targetHeightMarginAdded
				);
			if (bottomHasMoreSpaceThanTop || bottomSpaceIsBiggerThanTargetHeight) {
				//arrow at top, popup under link
				//#region bottom is bigger than top - show on bottom
				upside = true;
				DEBUG && console.group("bottom is bigger than top");
				DEBUG &&
					console.log(
						"lastLineRect.bottom: " +
							lastLineRect.bottom +
							", nonOverlappingArrowWidth: " +
							nonOverlappingArrowWidth
					);

				targetYPosition = lastLineRect.bottom + nonOverlappingArrowWidth;
				// let targetYAdjustment;
				if (!bottomSpaceIsBiggerThanTargetHeight) {
					DEBUG &&
						console.log(
							"show reduced height. spacer under link is smaller than target height"
						);
					maxHeight = distanceToBottomFromLink - marginY; //targetHeight;
				}
				DEBUG && console.groupEnd();
				//#endregion bottom is bigger than top - show on bottom
			} else {
				//arrow at bottom
				//#region "bottom has less space than top" -> show on top
				DEBUG && console.group("bottom has less space than top");

				//"show full height BetweenFirstLineAndTop"
				//targetYPosition = firstLineRect.top - maxHeight - halfArrowWidth;
				//maxHeightInsideAvailableSpace = maxHeight;

				DEBUG && console.log(popoverRect);
				DEBUG &&
					console.log(
						"targetHeight: " +
							targetHeight +
							", popoverRect.height: " +
							popoverRect.height +
							", maxHeight without offset reduction: " +
							maxHeight +
							", distanceToTopFromLink: " +
							distanceToTopFromLink +
							", distanceToTopFromLink < maxHeight: " +
							(distanceToTopFromLink < maxHeight) +
							", marginY: " +
							marginY
					);

				if (distanceToTopFromLink < maxHeight + marginY) {
					//#region "available maxHeight is smaller than targeted maxHeight -show reduced height BetweenFirstLineAndTop"
					DEBUG &&
						console.log(
							"maxHeight is smaller than distanceToTopFromLink -show reduced height BetweenFirstLineAndTop"
						);
					targetYPosition =
						firstLineRect.top - maxHeight - nonOverlappingArrowWidth;
					maxHeightInsideAvailableSpace = distanceToTopFromLink; //reduced maxHeight
					DEBUG &&
						console.log(
							"maxHeightReducedToAvailableSpace?: " +
								maxHeightInsideAvailableSpace +
								", targetYPosition: " +
								targetYPosition
						);
					DEBUG &&
						console.log(
							"targetYPosition: " + targetYPosition + ", marginY: " + marginY
						);
					if (targetYPosition < marginY) {
						//if targetYPosition(firstLineRect.top - maxHeight - marginY;) smaller marginY
						console.log(
							"reposition smaller than marginY. Set at offset marginY"
						);

						DEBUG &&
							console.log(
								"targetheight overflows at top side, maxHeight before margin change: " +
									maxHeight +
									", new maxHeightInsideAvailableSpace: " +
									maxHeightInsideAvailableSpace
							);
						const magicNumber = 3; //weird. container position relative top=-3 why needed?
						targetYPosition =
							offsetToBottomBorderY - magicNumber + nonOverlappingArrowWidth;
						maxHeightInsideAvailableSpace = distanceToTopFromLink - marginY;
					}
					//#endregion "maxHeight is smaller than distanceToTopFromLink -show reduced height BetweenFirstLineAndTop"
				} else {
					//#region "show full height BetweenFirstLineAndTop"
					DEBUG && console.log("show full height BetweenFirstLineAndTop");
					DEBUG &&
						console.log(
							"maxHeight: " +
								maxHeight +
								", nonOverlappingArrowWidth: " +
								nonOverlappingArrowWidth
						);
					const magicNumber = 3;
					maxHeightInsideAvailableSpace = maxHeight + nonOverlappingArrowWidth;
					targetYPosition =
						firstLineRect.top - maxHeightInsideAvailableSpace - magicNumber;
					//#endregion "show full height BetweenFirstLineAndTop"
				}

				DEBUG &&
					console.log(
						"targetYPosition: " +
							targetYPosition +
							", maxHeightInsideAvailableSpace: " +
							maxHeightInsideAvailableSpace +
							", distanceToTopFromLink: " +
							distanceToTopFromLink +
							", targetHeight: " +
							targetHeight +
							", firstLineRect.top: " +
							firstLineRect.top +
							", scrollPosY: " +
							scrollPosY +
							",  popoverRect.height: " +
							popoverRect.height
					);
				DEBUG && console.groupEnd();
				//#endregion "bottom has less space than top"
			}

			//#endregion "not on index/table cell td"
		} else {
			//#region "on index/table cell td"
			DEBUG && console.log("on index/table cell td");
			//auto height push up along table column
			DEBUG &&
				console.log(
					", distanceToBottomFromLink: " +
						distanceToBottomFromLink +
						", targetHeight: " +
						targetHeight
				);
			targetYPosition = lastLineRect.top;
			const overFlowPxY = maxHeight - distanceToBottomFromLink;
			if (overFlowPxY > 0) {
				DEBUG &&
					console.log("space under link smaller targetHeight. move popover up");
				DEBUG &&
					console.log("lastLineRect.top: " + lastLineRect.top + ", Y" + Y);
				targetYPosition -= overFlowPxY;
			}
			const posOverTopBorder = targetYPosition < offsetToBottomBorderY;
			if (posOverTopBorder) {
				//top offset
				DEBUG &&
					console.log("overflows top border set to offsetToBottomBorderY");
				targetYPosition = offsetToBottomBorderY;
			}
			//#endregion "on index/table cell td"
		}
		//Y += scrollPosY;
		DEBUG &&
			console.log(
				"maxHeight: " + maxHeight + ", targetYPosition: " + targetYPosition
			);
		setPopoverHeight(maxHeightInsideAvailableSpace, targetYPosition);
		Y = targetYPosition + scrollPosY;

		DEBUG && console.log("popover.style.height: " + popover.style.height);
		DEBUG && console.groupEnd();
		//#endregion set to top/bottom position

		//#region select from which line to calculate the  right position
		if (!upside) {
			targetRect = firstLineRect;
			distanceToRightFromlink = window.innerWidth - targetRect.right;
		}
		//#endregion
		//#region set to left/right position
		DEBUG && console.group("left/right placement");
		if (!(isOnIndex || tableElement)) {
			DEBUG &&
				console.log(
					"placement on non table cell/container list. non index list"
				);
			X = targetRect.right;
			DEBUG &&
				console.log(
					"full calculated width for non reposition: " +
						(X + distanceToRightFromlink + offsetToRightBorderX)
				);
			DEBUG &&
				console.log(
					"lastLineRect.right: " +
						targetRect.right +
						", distanceToRightFromlink: " +
						distanceToRightFromlink +
						", targetWidth: " +
						targetWidth
				);

			if (distanceToRightFromlink - offsetToRightBorderX * 2 > targetWidth) {
				DEBUG &&
					console.log(
						"full popup width with padding without reposition: " + targetWidth
					);
			} else {
				let diffX =
					targetWidth - distanceToRightFromlink + offsetToRightBorderX * 2;
				DEBUG &&
					console.log("touch right side, move left of amount diffX: " + diffX);

				//move left amount diffX
				X -= diffX;
				if (X + targetWidth < targetRect.left) {
					X = targetRect.left - targetWidth;
				}
			}
		} else {
			DEBUG && console.log("on Index/tablecell");
			distanceToRightFromlink = distanceToRightFromlink - arrowWidth;
			X = targetRect.right;
			const rightBiggerThenLeft =
				distanceToLeftFromlink < distanceToRightFromlink;
			const containerWidthWithPadding =
				targetWidth + arrowWidth + offsetToRightBorderX;
			DEBUG &&
				console.log(
					"distanceToRightFromlink: " +
						distanceToRightFromlink +
						", containerWidthWithPadding: " +
						containerWidthWithPadding
				);
			if (
				rightBiggerThenLeft ||
				distanceToRightFromlink > containerWidthWithPadding
			) {
				DEBUG &&
					console.log(
						"right side space bigger than left side. distanceToRightFromlink: " +
							distanceToRightFromlink
					);
				const availableSpaceRight =
					distanceToRightFromlink + offsetToRightBorderX * 2;
				DEBUG &&
					console.log(
						"targetWidth: " +
							targetWidth +
							", containerWidthWithPadding: " +
							containerWidthWithPadding
					);
				if (availableSpaceRight < containerWidthWithPadding) {
					DEBUG &&
						console.log(
							"right space smaller than targetWidth. distanceToRightFromlink: " +
								distanceToRightFromlink
						);
					//X = lastLineRect.right;
					popover.style.width =
						distanceToRightFromlink - offsetToRightBorderX * 2 + "px";
				} else {
					DEBUG &&
						console.log(
							"right space bigger than targetWidth+offset" +
								", distanceToRightFromlink: " +
								distanceToRightFromlink +
								", offsetToRightBorderX: " +
								offsetToRightBorderX +
								", availableSpaceRight : " +
								availableSpaceRight +
								", containerWidthWithPadding: " +
								containerWidthWithPadding
						);
					popover.style.width = targetWidth + "px";
					// X = lastLineRect.right;
				}
			} else {
				DEBUG && console.log("right side smaller than left side");
				X = targetRect.left - containerWidthWithPadding;
				arrowTableSideRight = false;
				if (distanceToLeftFromlink > containerWidthWithPadding) {
					DEBUG && console.log("move to left side of container");
				} else {
					DEBUG && console.log("shrink popupwidth");
					if (X < offsetToRightBorderX) {
						X = offsetToRightBorderX;
						popover.style.width =
							distanceToLeftFromlink -
							offsetToRightBorderX * 2 -
							arrowWidth +
							"px";
					}
				}
				//X = targetRect.left-;
			}
		}
		DEBUG &&
			console.log("X: " + X + ", popover.style.width: " + popover.style.width);
		DEBUG && console.groupEnd();
		//#endregion
		DEBUG && console.groupEnd();
		//let tableMargin=0;
		//if(isOnIndex || tableElement)
		//tableMargin = arrowWidth;
		//popover.style.top = Y + "px";
		// popover.style.left = X +tableMargin+ "px";
		/*
    showBorderArrowBox(
      event,
      arrowWidth,
      upside,
      isExternal,
      arrowTableSideRight
    );*/
		return {
			Px: X,
			Py: Y,
			upside: upside,
			arrowTableSideRight: arrowTableSideRight,
		};
	}
	function sleep() {
		return new Promise(requestAnimationFrame);
	}
	// popupPositioning function
	async function popupPos(event, isExternal = false) {
		const DEBUG = false;
		DEBUG && console.group("popupPos showSmaller:" + showSmaller);
		if (event && event !== undefined) {
			showPopOver();
			await sleep();
			await sleep();

			DEBUG && console.group("popover rect");
			DEBUG && console.log(popover);
			DEBUG && console.log("popover.offsetHeight: " + popover.offsetHeight);
			DEBUG && console.log("popover[0].offsetHeight: " + popover.offsetHeight);
			DEBUG && console.groupEnd("popover rect");
			const { Px, Py, upside, arrowTableSideRight } = getPopupPos(
				event,
				arrowWidthInPx,
				isExternal
			);

			let tableMargin = 0;
			let tableElement = checkIsTableElement(event.target);
			if (isOnIndex || tableElement) tableMargin = arrowWidthInPx;
			popover.style.left = Px + tableMargin + "px";
			if (!upside) {
				//popover.style.bottom = "unset";
				popover.style.top = Py + "px";
			} else {
				//popover.style.bottom="unset";
				popover.style.top = Py + "px";
			}
			showBorderArrowBox(
				event,
				arrowWidthInPx,
				upside,
				isExternal,
				arrowTableSideRight
			);
			//const popoverHeightMargin = offsetToBottomBorderY * 2;
			//const popoverWidthMargin = offsetToRightBorderX * 2;
			/*
              popover.style.maxHeight =
                "min(400px,calc(100% - " + popoverHeightMargin + "px))";
              popover.style.maxWidth =
                "min(800px,calc(100% - " + popoverWidthMargin + "px))";
                */

			DEBUG && console.log(popover.getBoundingClientRect());
			DEBUG &&
				console.log(
					"window.innerHeight: " +
						window.innerHeight +
						", window.innerWidth: " +
						window.innerWidth
				);

			DEBUG && console.groupEnd("popupPos");
			//console.log("final popup position "+X+' # '+Y);
			// return this;
			autoScrollData();
			autoScrollData("coverPreviewContentAutoScroll");
		}
	}

	function tryToGetTextContent(element, query, queryName) {
		let result = element;
		if (result && result !== undefined) {
			result = result.innerHTML; //changed from textContent to innerHTML to get html tags(b/i/p/br) and text line breaks
			result = result.replace(reWhiteListStripHTML, ""); //strip all other html tags
		} else if (element !== null && element !== undefined) {
			console.log(
				"Wrong or changed querySelector for " + queryName + ". not: " + query
			);
		}

		return result;
	}

	function getTargetDomain(individualSiteLink) {
		let domain = "";
		if (individualSiteLink) {
			//console.log(individualSiteLink);
			let hasSlashIndex = individualSiteLink.indexOf("/");
			if (hasSlashIndex) hasSlashIndex = hasSlashIndex + 1;
			else hasSlashIndex = individualSiteLink.length - 1;
			domain = individualSiteLink.slice(0, hasSlashIndex);
		}
		return domain;
	}

	function getElementID(elementUrl, targetPage) {
		const DEBUG = false;
		let elementID;
		//DEBUG && console.log("targetPage", targetPage);
		DEBUG && console.log("internalLinkKey[0]", internalLinkKey[0]);
		DEBUG && console.log("INDIVIDUALPAGETEST", INDIVIDUALPAGETEST);
		const internalLinkRegex = internalLink[internalLinkKey[0]].serieRegex;
		if (internalLinkRegex) {
			//targetPage = internalLink[internalLinkKey[0]];
			//TODO look for neater solution
			const basisIndex = elementUrl.indexOf(INDIVIDUALPAGETEST);
			let urlAfterDomain = elementUrl.slice(
				basisIndex + INDIVIDUALPAGETEST.length
			);
			DEBUG && console.log("urlAfterDomain", urlAfterDomain);
			DEBUG && console.log("internalLinkRegex", internalLinkRegex);
			const regexResult = urlAfterDomain.match(internalLinkRegex);
			DEBUG && console.log("regexResult", regexResult);
			//linkAfterDomain = link.slice(indexID);
			if (regexResult && regexResult[1]) {
				elementID = regexResult[1];
				elementUrl = elementID;
			}
		}
		return elementID;
	}

	function getLinkID(link, individualPage) {
		const DEBUG = false;
		let ID, domainInfrontOfID;
		let stringFromID;
		let boolHasSlashAfterID = false;
		if (link && individualPage) {
			//example individualPage = "mangadex.org/title/"
			DEBUG && console.group("getLinkID");
			DEBUG && console.log(link);
			const isApiLink = link.indexOf(individualPage);
			let linkAfterDomain;
			if (isApiLink >= 0) {
				let indexID = isApiLink + individualPage.length;
				domainInfrontOfID = link.slice(0, indexID);
				linkAfterDomain = link.slice(indexID);
				DEBUG && console.log("linkAfterDomain: " + linkAfterDomain);
				if (individualPage && externalLinks[individualPage]) {
					DEBUG &&
						console.log(
							"externalLink: " +
								individualPage +
								", match with linkAfterDomain to get full ID: " +
								linkAfterDomain
						);
					//externalLinks
					if (externalLinks[individualPage].serieRegex) {
						stringFromID = linkAfterDomain.match(
							externalLinks[individualPage].serieRegex
						);
					}
					DEBUG && console.log(stringFromID);
					DEBUG && console.log("stringFromID: " + stringFromID);
					if (stringFromID === null) {
						if (externalLinks[individualPage].serieRegex2) {
							DEBUG &&
								console.log("getLinkID serieRegex2 for: " + individualPage);
							stringFromID = linkAfterDomain.match(
								externalLinks[individualPage].serieRegex2
							);
						} else {
							stringFromID = linkAfterDomain.match(defaultSerieRegex);
						}
					}

					//stringFromID = link.slice(indexID);
				} else {
					DEBUG &&
						console.log(
							"internallink, match with linkAfterDomain to get full ID: " +
								linkAfterDomain
						);
					//internalLink
					stringFromID = linkAfterDomain.match(
						internalLink[INDIVIDUALPAGETEST].serieRegex
					);
					//stringFromID = link.slice(indexID);
				}
				DEBUG &&
					console.log(
						"domainInfrontOfID: " +
							domainInfrontOfID +
							", stringFromID: " +
							stringFromID
					);
				if (stringFromID?.length > 0) {
					if (stringFromID[1]) {
						stringFromID = stringFromID[1]; //exact match
					} else {
						stringFromID = stringFromID[0]; //complete matching string after domain
					}
				}
				DEBUG && console.log(stringFromID);
				DEBUG && console.log(stringFromID);
				/*
          let hasSlashAfterID = stringFromID.indexOf("/");
          boolHasSlashAfterID = hasSlashAfterID>=0;

          if (boolHasSlashAfterID) ID = stringFromID.slice(0, hasSlashAfterID);
          else */
				//ID = stringFromID;
				//DEBUG && console.log(ID);
			}

			DEBUG && console.groupEnd();
		}
		return { ID: stringFromID, Domain: domainInfrontOfID }; //,hasSlashAfterID:boolHasSlashAfterID
	}
	async function getCoverDataFromUrl(
		elementUrl,
		external = false,
		individualPage = undefined
	) {
		const DEBUG = false;

		DEBUG && console.group("getCoverDataFromUrl for: " + currentTitelHover);
		const isExternal = external;
		let coverData;
		let linkID;
		let hasApiAccess;

		if (isExternal) hasApiAccess = externalLinks[individualPage].mainAPI;
		else {
			hasApiAccess = internalLink[INDIVIDUALPAGETEST].mainAPI; //todo change with individualPage. Forward individualPage for internal site
		}
		//console.log(hasApiAccess);
		//console.log("xhr.finalUrl: " + xhr.finalUrl +", elementUrl: " + elementUrl)
		DEBUG && console.log("elementUrl: " + elementUrl);
		elementUrl = getLinkToSeriePage(elementUrl, individualPage);
		DEBUG && console.log("getLinkToSeriePage() -> elementUrl: " + elementUrl);
		if (hasApiAccess) {
			const { ID } = getLinkID(elementUrl, individualPage);
			linkID = ID;
			console.log("elementUrl", elementUrl);
			console.log("individualPage", individualPage);
			//console.log(linkID);
			DEBUG && console.log("linkID: " + linkID);
		}
		DEBUG && console.log("elementUrl: " + elementUrl);
		let targetDomain;
		let hasExternalTargetPage;
		let targetPage;
		//#region check is external link
		DEBUG &&
			console.log(
				"isExternal: " + isExternal + ", individualPage: " + individualPage
			);
		if (isExternal && individualPage) {
			hasExternalTargetPage = externalLinks[individualPage];
			if (hasExternalTargetPage) {
				targetPage = hasExternalTargetPage;
				targetDomain = getTargetDomain(individualPage);
			}
		} else {
			targetPage = internalLink[internalLinkKey[0]];
			//targetDomain = getTargetDomain(INDIVIDUALPAGETEST); //for now leave empty (since only one internal link possible)
		}
		DEBUG &&
			console.log(
				"hasExternalTargetPage: " +
					hasExternalTargetPage +
					", targetDomain: " +
					targetDomain
			);
		//#endregion
		let apiData;
		if (hasApiAccess) {
			DEBUG &&
				console.log("hasApiAccess for individualPage: " + individualPage);
			switch (individualPage) {
				//API access
				case "mangadex.org/manga/":
				case "mangadex.org/title/":
					//url: "https://mangadex.org/api/v2/manga/" + id,
					apiData = await getCoverDataFromMangaDex(linkID);
					break;
				case "www.tvmaze.com/shows/":
					apiData = await getCoverDataFromTVmaze(linkID);
					break;
				case "wlnupdates.com/series-id/":
					apiData = await getCoverDataFromWLNupdates(linkID);
					break;
			}
		} else {
			DEBUG &&
				console.log(
					"before getCoverDataFromParsingTargetUrl - elementUrl: " + elementUrl
				);
			//coverData = Object.assign({}, emptyCoverData);
			apiData = await getCoverDataFromParsingTargetUrl(
				elementUrl,
				targetPage,
				isExternal
			);
			DEBUG && console.log(apiData);
		}
		DEBUG && console.log(apiData);
		let imagelink;
		if (apiData !== undefined) {
			coverData = apiData;
			imagelink = coverData.url;
		}
		//console.log(imagelink);
		//console.log("save imageUrl into coverData.url: " + imagelink);

		let externalUrl;
		//console.log("targetDomain: " + targetDomain)
		if (isExternal && targetDomain) externalUrl = targetDomain;

		imagelink = processRelativeImageLink(imagelink, targetDomain, isExternal);
		//console.log("serieAlternativeNames: " + serieAlternativeNames)
		let cData;
		DEBUG && console.log("externalUrl: " + externalUrl);
		DEBUG && console.log(coverData);
		//#region merge final complete coverData
		if (coverData !== undefined) {
			cData = coverData;
			cData.isExternal = externalUrl;
			cData.url = imagelink;
			//console.log(coverData);
			//console.log(cData);
		}
		//#endregion merge final complete coverData
		DEBUG && console.log(cData);

		const internalElementID = getElementID(elementUrl, targetPage);
		DEBUG &&
			console.log(
				"internalElementID before GM_setCachedValue",
				internalElementID
			);
		if (internalElementID) {
			GM_setCachedValue(internalElementID, cData); //cache imageurl link
		} else {
			GM_setCachedValue(elementUrl, cData); //cache imageurl link
		}

		DEBUG &&
			console.log(
				elementUrl +
					" url has been found and is written to temporary cache.\n" +
					imagelink +
					" successfully cached."
			); // for testing purposes
		DEBUG && console.groupEnd("parseSeriePage onLoad");
		return cData;
	}
	function processRelativeImageLink(imagelink, targetDomain, isExternal) {
		const DEBUG = false;
		//#region adjust relative link to absolute domain
		if (imagelink && imagelink !== undefined && imagelink !== null) {
			if (imagelink.tagName && imagelink.tagName == "IMG") {
				imagelink = imagelink.getAttribute("src");
			}
			if (imagelink instanceof HTMLElement) {
				let hasSrc = imagelink.getAttribute("src");
				if (hasSrc) imagelink = imagelink.getAttribute("src");
			}

			DEBUG && console.log(imagelink);

			if (imagelink.startsWith("//")) {
				imagelink = "https://" + imagelink.slice(2);
			}
			if (imagelink.startsWith("/")) {
				DEBUG && console.log(targetDomain);
				DEBUG && console.log(imagelink);
				imagelink = targetDomain + imagelink;
			}

			if (
				isExternal &&
				!(imagelink.startsWith("http://") || imagelink.startsWith("https://"))
			) {
				//if relativeLink on external site change to absolute link
				imagelink = "https://" + imagelink;
			}
		}
		//#endregion
		return imagelink;
	}
	function rejectErrorStatusMessage(xhr) {
		let rejectNotification = "";
		//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
		switch (true) {
			case xhr.status == 400:
				rejectNotification = "bad request: xhr response == " + xhr.status;
				break;
			case xhr.status == 401:
				rejectNotification = "unauthorized: xhr response == " + xhr.status;
				break;
			case xhr.status == 402:
				rejectNotification = "Payment Required: xhr response == " + xhr.status;
				break;
			case xhr.status == 403:
				rejectNotification = "Forbidden: xhr response == " + xhr.status;
				break;
			case xhr.status == 404:
				rejectNotification =
					xhr.finalUrl + "<br/>page not found: xhr response == " + xhr.status;
				break;
			case xhr.status == 408:
				rejectNotification = "request timeout: xhr response == " + xhr.status;
				break;
			case xhr.status == 410:
				rejectNotification =
					"page gone and not available: xhr response == " + xhr.status;
				break;
			case xhr.status == 425:
				rejectNotification =
					"page request too early: xhr response == " + xhr.status;
				break;
			case xhr.status == 429:
				rejectNotification =
					"rate limit reached. Please notify to increase/adjust rate limit to setting for this domain: xhr response == " +
					xhr.status;
				break;
			case xhr.status == 451:
				rejectNotification =
					"page was removed cause of legal reasons: xhr response == " +
					xhr.status;
				break;
			case xhr.status == 500:
				{
					console.log(xhr.responseHeaders);
					let serverMessage = xhr.responseHeaders
						.toString()
						.match(new RegExp("server:(.*)"));
					if (serverMessage != null)
						rejectNotification =
							"page has an internal server error: xhr response == " +
							xhr.status +
							"<br />" +
							serverMessage;
				}

				break;
			case xhr.status == 503:
				rejectNotification =
					"page Unavailable. Down for maintenance or overloaded: xhr response == " +
					xhr.status;
				break;
			case xhr.status == 511:
				rejectNotification =
					"page Network Authentication Required: xhr response == " + xhr.status;
				break;
			default:
				rejectNotification = xhr;
		}
		return rejectNotification;
	}
	function setLinkState(element, state = undefined, preloadUrlRequest = false) {
		const DEBUG = false;
		if (element) {
			let hasText = element.textContent != "";
			if (showIconNextToLink) {
				/*  0: popup possible/no coverdata preloaded; if preloadUrlRequest true set inactive preloading icon
              1: currently active loading coverData link
              2: coverData preloaded
          */
				const externalTarget = element.getAttribute("coverDataExternalTarget");
				let elementUrl = getLinkToSeriePage(element.href, externalTarget);

				let elementID = getElementID(element.href);
				if (elementID == null || elementID == undefined) {
					elementID = elementUrl;
				}
				DEBUG && console.group("link: " + elementUrl);
				DEBUG && console.log("state before check: " + state);
				if (state === undefined) {
					const coverData = GM_getCachedValue(elementID);
					DEBUG && console.log(coverData);
					if (
						coverData === undefined ||
						coverData === null ||
						coverData === "null" ||
						preloadUrlRequest
					) {
						state = linkIconEnum.popupPossibleNotLoadedOrMarkedForPreloading; //no coverData wating for interaction or forced reloading/preloading
					} else {
						state = linkIconEnum.popupHasCoverData; //coverData available and loaded
					}
				}
				DEBUG && console.log("state: " + state);
				DEBUG && console.groupEnd();
				element.classList.remove(
					"hasCoverPreviewPopup",
					"loadingUrlPreload",
					"loadingUrl",
					"hasLoadedCoverPreviewPopup"
				);
				switch (state) {
					case linkIconEnum.popupPossibleNotLoadedOrMarkedForPreloading: //popup possible/no coverdata preloaded; if preloadUrlRequest true set inactive preloading icon
						if (hasText) {
							if (preloadUrlRequest) {
								element.classList.add("loadingUrlPreload");
							} else {
								element.classList.add("hasCoverPreviewPopup");
							}
						}
						break;
					case linkIconEnum.popupLoading: //currently loading coverData
						if (hasText) element.classList.add("loadingUrl");
						break;
					case linkIconEnum.popupHasCoverData: //coverData preloaded
						if (hasText) element.classList.add("hasLoadedCoverPreviewPopup");
						break;
					case linkIconEnum.error:
						//don't add any icon
						//console.log("set state to linkError")
						break;
				}
			} else {
				//if not showIconNextToLink -> cleanup icons
				element.classList.remove(
					"hasCoverPreviewPopup",
					"loadingUrlPreload",
					"loadingUrl",
					"hasLoadedCoverPreviewPopup"
				);
			}
		}
	}
	function setLinkStateOfSameLinks(element, state, preloadUrlRequest = false) {
		const DEBUG = false;
		const elementUrl = element.href;
		DEBUG && console.log("elementUrl: " + elementUrl);
		//console.log(elementUrl)
		const slashIndex = elementUrl.indexOf(INDIVIDUALPAGETEST);
		const elementUrlWithoutDomain = elementUrl.slice(slashIndex);
		DEBUG && console.log("elementUrlWithoutDomain", elementUrlWithoutDomain);
		const sameLinks = document.querySelectorAll(
			'a[href="' + elementUrl + '"], a[href="' + elementUrlWithoutDomain + '"]'
		);
		DEBUG && console.group("setLinkStateOfSameLinks: " + elementUrl);
		DEBUG && console.log("sameLinks", sameLinks);
		DEBUG && console.log("sameLinks.length: " + sameLinks.length);
		DEBUG && console.groupEnd();
		if (sameLinks.length > 0) {
			for (let i = 0; i < sameLinks.length; i++) {
				DEBUG && console.log(sameLinks[i]);
				setLinkState(sameLinks[i], state, preloadUrlRequest);
			}
		}
	}
	function getLinkToSeriePage(elementUrl, individualPage = undefined) {
		const DEBUG = false;
		if (individualPage) {
			let linkID;
			const { ID, Domain } = getLinkID(elementUrl, individualPage);
			linkID = ID;
			//console.log(linkID);

			elementUrl = Domain + linkID; //in case of direct chapter link provided with linkIK
			//elementUrl = linkID; //in case of direct chapter link provided with linkIK
			DEBUG &&
				console.log(
					"new elementUrl: " +
						elementUrl +
						", individualPage: " +
						individualPage +
						", linkID: " +
						linkID +
						", Domain: " +
						Domain
				);
		} else {
			/*
			const DEBUGINTERNAL = true;
			let elementID;
			const targetPage = internalLink[internalLinkKey[0]];
			DEBUGINTERNAL && console.log("internalLinkKey[0]", internalLinkKey[0]);
			DEBUGINTERNAL && console.log("targetPage", targetPage);
			DEBUGINTERNAL && console.log("INDIVIDUALPAGETEST", INDIVIDUALPAGETEST);
			const internalLinkRegex = targetPage.serieRegex;
			if (internalLinkRegex) {

				//TODO look for neater solution
				const basisIndex = elementUrl.indexOf(INDIVIDUALPAGETEST);
				let urlAfterDomain = elementUrl.slice(
					basisIndex + INDIVIDUALPAGETEST.length
				);
				DEBUGINTERNAL && console.log("urlAfterDomain", urlAfterDomain);
				DEBUGINTERNAL && console.log("internalLinkRegex", internalLinkRegex);
				const regexResult = urlAfterDomain.match(internalLinkRegex);
				DEBUGINTERNAL && console.log("regexResult", regexResult);
				//linkAfterDomain = link.slice(indexID);
				if (regexResult && regexResult[1]){
					elementID = regexResult[1];
					elementUrl = elementID;
				}
			}*/
		}
		return elementUrl;
	}

	function getCurrentTime() {
		const d = new Date();
		const currentTime = d.getTime();
		return currentTime;
	}

	function isOtherLinkLoading() {
		let isLoading = false;
		//firstLinkload || no otherlink loading during set rateLmit
		const timeDifference = getCurrentTime() - lastPageGrab;
		if (currentLinkLoadingTitle.length > 0 && rateLimitDelay > timeDifference) {
			isLoading = true;
		} else {
			currentLinkLoadingTitle = "";
		}
		console.log("timeDifference", timeDifference);
		console.log("hoverdelay", hoverdelay);
		return isLoading;
	}
	async function parseSeriePage(
		element,
		forceReload = false,
		hoveredTitle = undefined,
		event = undefined,
		external = false,
		targetPage = undefined
	) {
		const DEBUG = false;
		DEBUG &&
			console.log("before getLinkToSeriePage - element.href: " + element.href);
		const elementUrl = getLinkToSeriePage(element.href, targetPage);
		let elementID = getElementID(element.href, targetPage);
		if (elementID == null || elementID == undefined) {
			elementID = elementUrl;
		}

		DEBUG && console.group("parseSeriePage: " + elementUrl);
		DEBUG && console.log("elementUrl: " + elementUrl);
		let coverData;
		if (!forceReload) coverData = GM_getCachedValue(elementID);
		// let retrievedImgLink;
		let PromiseResult;
		DEBUG && console.log(coverData);
		if (
			!forceReload &&
			coverData !== undefined &&
			coverData !== null &&
			coverData.title
		) {
			//retrievedImgLink = coverData.url;
			DEBUG &&
				console.log(
					"parseSeriePage has cached coverData  for: " +
						coverData.title +
						" at " +
						elementUrl
				);
			PromiseResult = coverData;
		} else {
			//console.log("before showPopupLoadingSpinner")
			showPopupLoadingSpinner(hoveredTitle, hoveredTitle, event);
			//console.log("before getCoverDataFromUrl - elementUrl: " + elementUrl)

			if (isOtherLinkLoading()) {
				showPopupLoadingSpinner(
					hoveredTitle,
					hoveredTitle,
					event,
					"Currently loading " + currentLinkLoadingTitle
				);
			} else {
				PromiseResult = getCoverDataFromUrl(elementUrl, external, targetPage);
				currentLinkLoadingTitle = hoveredTitle;
				lastPageGrab = getCurrentTime();
			}
		}

		DEBUG && console.groupEnd("parseSeriePage: " + elementUrl);
		PromiseResult = await PromiseResult;
		setLinkStateOfSameLinks(element, linkIconEnum.popupHasCoverData); //coverData loading finished
		DEBUG && console.log(PromiseResult);
		//DEBUG && console.log(PromiseResult)
		//after GM_xmlhttpRequest PromiseResult

		return PromiseResult;
	}
	//renamed targetNodeArray -> arrayTargetNode to remove compatibility mode in tampermonkey
	function removeEventListenerFromNodes(arrayTargetNode, external = false) {
		if (arrayTargetNode && arrayTargetNode.length > 0) {
			//console.log(targetNodeArray);
			arrayTargetNode.map(function (el) {
				if (
					eventListenerStyle === undefined ||
					eventListenerStyle === null ||
					eventListenerStyle == 0
				) {
					el.removeEventListener("mouseenter", mouseEnterPopup);
					el.removeEventListener("mouseleave", hideOnMouseLeave);
				}
			});
		}
	}
	function wait(ms) {
		return new Promise((resolve, reject) => setTimeout(resolve, ms));
	}
	function getCachedCoverDataValue(element, individualLinksToTest) {
		const DEBUG = false;
		const elementUrl = getLinkToSeriePage(element.href, individualLinksToTest);
		let elementID = getElementID(element.href);
		DEBUG && console.log("elementID: " + elementID);
		if (elementID == null || elementID == undefined) {
			elementID = elementUrl;
		}
		DEBUG && console.log("elementUrl: " + elementUrl);

		DEBUG &&
			console.log(
				"start parseSeriePage for links of domain: " + individualLinksToTest
			);

		// console.log("external: " + external);

		const coverData = GM_getCachedValue(elementID);
		DEBUG &&
			console.group(
				"preloadForIndividualPageTest GM_getCachedValue elementUrl: " +
					elementUrl
			);
		DEBUG && console.log("elementUrl: " + elementUrl);
		DEBUG && console.log(coverData);
		DEBUG && console.groupEnd();

		return coverData;
	}
	//renamed targetNodeArray -> arrayTargetNode to remove compatibility setting in tampermonkey
	async function preloadForIndividualPageTest(
		arrayTargetNode = [],
		individualLinksToTest,
		external = false,
		forceReload = false
	) {
		const DEBUG = false;

		DEBUG && console.log("arrayTargetNode", arrayTargetNode);

		DEBUG && console.log("preloadCoverData");

		DEBUG &&
			console.log(
				"before parseSeriePage for each url with a link to individual seriepage"
			);
		//#region addEventlistener
		if (arrayTargetNode && arrayTargetNode.length > 0) {
			//console.log(targetNodeArray);
			arrayTargetNode.map(function (el) {
				//console.log(el)
				// const elementUrl = el.href;
				//const externalTarget = el.getAttribute("coverDataExternalTarget");
				// console.log(elementUrl)
				if (
					eventListenerStyle === undefined ||
					eventListenerStyle === null ||
					eventListenerStyle == 0
				) {
					//console.log(el); //TODO external overwrite/removes previous mouseEnterPopup?

					el.addEventListener("mouseenter", mouseEnterPopup);
					el.addEventListener("mouseleave", hideOnMouseLeave);
					/* if (external)
                el.setAttribute("coverDataExternalTarget", IndividualTargetToTest);*/
				}
			});
		}
		//#endregion addEventlistener
		//#region setLinkState of already preloaded data
		if (arrayTargetNode && arrayTargetNode.length > 0) {
			let nodeArrayIndex = 0;
			if (arrayTargetNode.length > 0) {
				while (nodeArrayIndex < arrayTargetNode.length) {
					const element = arrayTargetNode[nodeArrayIndex];

					const coverData = getCachedCoverDataValue(
						element,
						individualLinksToTest,
						external
					);

					if (forceReload && (coverData == null || coverData == undefined)) {
						setLinkState(element, linkIconEnum.popupLoading, forceReload); //active loading icon
					} else {
						setLinkState(element, undefined, forceReload); //coverData already loaded
					}

					nodeArrayIndex++;
				}
			}
		}
		//#endregion
		//#region preload
		if (arrayTargetNode && arrayTargetNode.length > 0) {
			let targetPage = undefined;
			if (external) {
				targetPage = individualLinksToTest;

				//console.log("targetPage: " + targetPage);
			}
			let nodeArrayIndex = 0;
			//rateLimitQueryAfterSeconds:"0.5"
			//if not set, but both other values are available will be calculated into rateLimitTimeInSeconds/rateLimitCount
			let hasRateLimitQueryAfterSeconds,
				hasRateLimitTimeInSeconds,
				hasRateLimitCount,
				hasRateLimitQueryAfterMS;

			if (external) {
				//externalLinks[individualLinksToTest]["lastQuery"] = Date.now();
				hasRateLimitQueryAfterSeconds =
					externalLinks[individualLinksToTest].rateLimitQueryAfterSeconds;
				if (!hasRateLimitQueryAfterSeconds) {
					hasRateLimitTimeInSeconds =
						externalLinks[individualLinksToTest].rateLimitTimeInSeconds;
					hasRateLimitCount =
						externalLinks[individualLinksToTest].rateLimitCount;
					if (hasRateLimitTimeInSeconds && hasRateLimitCount) {
						hasRateLimitQueryAfterSeconds =
							hasRateLimitTimeInSeconds / hasRateLimitCount;
					} else {
						hasRateLimitQueryAfterSeconds = defaultRateLimitQueryAfterSeconds;
					}
				}
			} else {
				hasRateLimitQueryAfterSeconds =
					internalLink[individualLinksToTest].rateLimitQueryAfterSeconds;
				if (!hasRateLimitQueryAfterSeconds) {
					hasRateLimitTimeInSeconds =
						internalLink[individualLinksToTest].rateLimitTimeInSeconds;
					hasRateLimitCount =
						internalLink[individualLinksToTest].rateLimitCount;
					if (hasRateLimitTimeInSeconds && hasRateLimitCount) {
						hasRateLimitQueryAfterSeconds =
							hasRateLimitTimeInSeconds / hasRateLimitCount;
					} else {
						hasRateLimitQueryAfterSeconds = defaultRateLimitQueryAfterSeconds;
					}
				}
			}
			if (hasRateLimitQueryAfterSeconds) {
				hasRateLimitQueryAfterMS = hasRateLimitQueryAfterSeconds * 1000;
			}
			DEBUG &&
				console.log("hasRateLimitQueryAfterMS: " + hasRateLimitQueryAfterMS);
			if (
				arrayTargetNode.length > 0 &&
				(forceReload || preloadUrlRequests) &&
				!deactivatePreloadUrlRequestOnUrls.includes(individualLinksToTest)
			) {
				while (nodeArrayIndex < arrayTargetNode.length) {
					const element = arrayTargetNode[nodeArrayIndex];

					const coverData = getCachedCoverDataValue(
						element,
						individualLinksToTest
					);
					/*
            if (!(coverData!==undefined && coverData !== null && coverData != "null"))
            {//has coverData
              setLinkState(element, 0, forceReload);//set inactive preloadingMarker or preloaded Data
            }else{

              setLinkState(element, 1, forceReload); //active loading icon
            }*/
					if (coverData == null || coverData == undefined) {
						setLinkState(element, linkIconEnum.popupLoading, forceReload); //active loading icon
						const hoveredTitle = undefined;
						const event = undefined;

						const promiseParsingPage = parseSeriePage(
							element,
							forceReload,
							hoveredTitle,
							event,
							external,
							targetPage
						).then(
							function (coverData) {
								if (coverData !== undefined) {
									if (preloadImages) {
										DEBUG &&
											console.log(
												"preloadCoverData preloadImages: " + preloadImages
											);
										DEBUG && console.log(coverData);
										loadImageFromBrowser({ coverData: coverData });
									}
								}
							},
							function (Error) {
								DEBUG && console.log(Error + " failed to fetch " + element);
								GM_deleteValue(element.href);
								setLinkStateOfSameLinks(element, linkIconEnum.error);
							}
						);
						DEBUG &&
							console.log("preloading current linkelement", element.href);
						DEBUG && console.log("coverData", coverData);
						if (hasRateLimitQueryAfterMS) {
							// const coverData = GM_getCachedValue(elementUrl);
							//console.log("preloaded url: " + elementUrl);
							if (
								!(
									coverData !== undefined &&
									coverData !== null &&
									coverData != "null"
								)
							) {
								await Promise.all([
									promiseParsingPage,
									wait(hasRateLimitQueryAfterMS),
								]);
							} else {
								setLinkState(element, undefined, forceReload); //coverData already loaded
							}
						}
					}
					nodeArrayIndex++;
				}
			}
		}
	}
	async function preloadCoverData(forceReload = false) {
		const DEBUG = false;
		//#region create complete nodelist
		ALLSERIENODES = [];
		ALLEXTERNALLINKNODES = [];
		let allPreloadingPromises = [];
		//console.log("preloadCoverData forceReload: " + forceReload)
		updateSerieNodes(ALLSERIENODES, INDIVIDUALPAGETEST, forceReload);
		if (externalLinks && externalLinkKeys.length > 0) {
			for (let i = 0; i < externalLinkKeys.length; i++) {
				updateSerieNodes(
					ALLEXTERNALLINKNODES,
					externalLinkKeys[i],
					forceReload,
					true
				);
			}
		}
		//#endregion

		//#region add eventlistener mouseenter/leave to links and preloadCoverData if preloading set to true
		removeEventListenerFromNodes(ALLSERIENODES);
		allPreloadingPromises.push(
			preloadForIndividualPageTest(
				ALLSERIENODES,
				INDIVIDUALPAGETEST,
				false,
				forceReload
			)
		);

		//console.log(externalLinks);
		//console.log(externalLinkKeys[0]);
		//console.log(externalLinkKeys.length);
		removeEventListenerFromNodes(ALLEXTERNALLINKNODES);
		//console.log(ALLEXTERNALLINKNODES)

		if (ALLEXTERNALLINKNODES.length > 0) {
			if (externalLinks && externalLinkKeys.length > 0) {
				for (let i = 0; i < externalLinkKeys.length; i++) {
					allPreloadingPromises.push(
						preloadForIndividualPageTest(
							ALLEXTERNALLINKNODES.filter((link) =>
								link.href.includes(externalLinkKeys[i])
							),
							externalLinkKeys[i],
							true,
							forceReload
						)
					);
				}
			}
		}
		//#endregion
		if (forceReload) {
			await Promise.all(allPreloadingPromises);
			console.log(
				"has finished preloading all links on this page: " +
					window.location.href
			);
		}
	}

	function addStyles() {
		GM_addStyle(`
            @keyframes rotate {
                    to {transform: rotate(360deg);}
                }

            @keyframes dash {
                0% {
                stroke-dasharray: 1, 150;
                stroke-dashoffset: 0;
                }
                50% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -35;
                }
                100% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -124;
                }
            }

            .spinner {
                /*
                z-index: 2;
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;*/
                width: 100%;
                height: 100%;
            }

            .spinner .path{
                stroke: hsl(210, 70%, 75%);
                stroke-linecap: round;
                animation: dash 1.5s ease-in-out infinite;
            }
            #popover_arrow{
              margin: unset;
              padding: unset;
              text-size-adjust: unset;
              line-height: unset;
              font-family: unset;
              font: unset;

              opacity: 1;
              visibility:visible;
              transition: visibility 0.2s, opacity 0.2s linear;
            }
            .arrowCSS{
              box-sizing: border-box;
              border: 1px solid #000;
              box-shadow:1px 1px 0px #7A7A7A;
              border-width: 0 2px 2px 0;
              display: inline-block;
              padding: 0;
              margin: unset;
              text-size-adjust: unset;
              line-height: unset;
              font-family: unset;
              font: unset;
            }


            @keyframes dotsLoading{
              0%{
                opacity: 0;
              }
              50%{
                opacity: 1;
              }
              100%{
                opacity: 0;
              }
            }
            #dotLoading1{
              animation: dotsLoading 1s infinite;
            }

            #dotLoading2{
              animation: dotsLoading 1s infinite;
              animation-delay: 0.2s;
            }

            #dotLoading3{
              animation: dotsLoading 1s infinite;
              animation-delay: 0.4s;
            }
            .loadingUrl, .loadingUrlPreload, .hasCoverPreviewPopup, .hasLoadedCoverPreviewPopup{
             /* position:relative;
              display: inline;*/
              padding:0 !important;
              margin:0 !important;
            }
            .loadingUrl:link, .loadingUrlPreload:link, .hasCoverPreviewPopup:link, .hasLoadedCoverPreviewPopup:link{
               padding:0 !important;
               margin:0 !important;
             }
            .loadingUrl::before{
              content:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-dots" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z" stroke="none" fill="none"/><path stroke="red" d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" /><line x1="12" y1="11" x2="12" y2="11.01" stroke="red" fill="red" id="dotLoading1" /><line x1="8" y1="11" x2="8" y2="11.01" stroke="red" fill="red" id="dotLoading2" /><line x1="16" y1="11" x2="16" y2="11.01" stroke="red" fill="red" id="dotLoading3" /></svg>');
            }
            .loadingUrlPreload::before{
              content:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-dots" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"/><line x1="12" y1="11" x2="12" y2="11.01" stroke="red" fill="red" id="dotLoading1" /><line x1="8" y1="11" x2="8" y2="11.01" stroke="red" fill="red" id="dotLoading2" /><line x1="16" y1="11" x2="16" y2="11.01" stroke="red" fill="red" id="dotLoading3" /></svg>');
            }
            /* https://tablericons.com/ "message" without newlines set width/height to 12px; removed two lines to get empty popup */
            .hasCoverPreviewPopup::before{
              content:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message" width="12px" height="12px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" /></svg>');
            }
            /* https://tablericons.com/ "message" without newlines set width/height to 12px */
            .hasLoadedCoverPreviewPopup::before{
              content:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message" width="12px" height="12px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="14" y2="13" /></svg>');
            }

            .blackFont {
                color:#000;
            }
            .whiteFont {
                color:#fff
            }
            .defaultTitleStyle {
                box-sizing: border-box;
                padding:5px 8px;
                min-height:unset;
                height:auto;
                display:inline-block;
                width:100%;
                /*max-width:auto;*/
                text-align:center !important;
                justify-content: center;
                justify-items: center;
                border: 0 !important;
                border-bottom: 1px solid #000 !important;
                border-radius:10px 10px 0 0 !important;
                line-height:1.4em;
            }
            .defaultTitleStyleSmall {
              line-height:1.2em;
            }
            .defaultBackgroundStyle {
                align-items:center;
                pointer-events:none;
                /*width:100%;
                height:100%;*/
                max-width:100%;
                max-height:100%;
                text-align:center !important;
                justify-content: center;
                justify-items: center;
                height:auto;
                padding:0;
                background-color:#fff;
            }
            .ImgFitDefault{
                object-fit: contain;
                min-width: 0;
                min-height: 0;
                max-height: 400px;
                max-width: 400px;
                width:100%;
                height:100%;
                margin:2px;
                padding:0;
                position:unset;
                border-radius: 10%;
            }

            #coverPreviewAutoScroll#style-4::-webkit-scrollbar-track,#coverPreviewContentAutoScroll::#style-4::-webkit-scrollbar-track
            {
              -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
              background-color: #F5F5F5;
            }

            #coverPreviewAutoScroll::-webkit-scrollbar,#coverPreviewContentAutoScroll::-webkit-scrollbar
            {
              width: 2px;
              background-color: #F5F5F5;
            }

            #coverPreviewAutoScroll::-webkit-scrollbar-thumb, #coverPreviewContentAutoScroll::-webkit-scrollbar-thumb
            {
              background-color: #888;
            }
            #coverPreviewAutoScroll{
              overflow:auto;
              scrollbar-width: thin;
              scrollbar-color: #888 #F5F5F5;
            }
            #coverPreviewContentAutoScroll{
              display:block;
              overflow:auto;
              scrollbar-width: thin;
              scrollbar-color: #888 #F5F5F5;
            }

            #popover{
              box-sizing: border-box;
              overflow: hidden;

              /* min() not compatible with firefox 56
              max-height: min(400px, (100vh - (100vh - 100%) - 44px));
              max-width: min(400px, calc(100vw - (100vw - 100%)));
              */
              max-height: calc(100vh - (100vh - 100%) - 44px);
              max-width: calc(100vw - (100vw - 100%));
              min-height: 0;
              min-width: 0;
              /*height: 400px;*/
              width: 100%;

              margin:0 0 22px 0;
              border: 1px solid #000;
              border-radius:10px 10px 5px 5px;
              box-shadow: 0px 0px 5px #7A7A7A;
              position:absolute;
              z-index:10;


              text-align: center !important;
              justify-content: start;
              justify-items: center;
              display: flex;
              flex-shrink: 1;
              flex-direction: column;

              opacity: 1;
              transition: visibility 0.2s, opacity 0.2s linear;
            }
            .hidePopover {
              visibility:hidden !important;
              opacity: 0 !important;
              transition: visibility 0.4s, opacity 0.4s linear !important;
            }
            .isExternalContent{
              border:2px solid red !important;
            }
            .isExternalContentArrow{
              border:2px solid red !important;
              border-width:0 2px 2px 0 !important
            }
            .popoverContent {
              box-sizing: border-box;
              text-align: center !important;
              justify-content: center;
              justify-items: center;
              align-items: center;

              display: flex;
              flex-direction: column;
              min-height: 0;
              min-width: 0;
              padding: 1px !important;

              width: 100%;
              height: 100%;
              flex: 1;
              padding:1px !important;
              border-radius:0;
            }
            .popoverDetail{
              flex-direction:unset !important;
              height:400px;
            }
            .coverDataTitle{
              border-bottom:1px solid white;
              padding:2px 0;
            }
            .containerPadding{
              justify-items:center;
              padding:10px
            }
            .popoverTitleDetail{
              height:100% !important;
              width:auto !important;
              max-width:65% !important;
              border-radius: 10px 0 0 5px !important;
              border:0 !important;
              border-right: 1px solid #000 !important;
              word-break: break-word; /* word wrap/break long links/texts */
            }

            .smallText{
                font-size: 0.8em;
            }
            .mediumText{
              font-size: 0.98em;
            }

            .small_smallText{
            /* display:inline-block;*/ /* line height not working if the element is not a block */
              font-size: 0.82em;
              line-height: 1.4em;
            }
            .small_mediumText{
            /*  display:inline-block;*/
              font-size: 0.78em;
              line-height: 1.2em;
            }
            .wordBreak {
                word-wrap: break-word !important;
                word-break: break-word;
            }
            .borderTop {
              width:100%;
              border-top:1px solid#fff;
              margin: 2px 0;
            }
            `);
	}
	function setStyleClasses() {
		const lastUpdated = GM_getValue("lastUpdated");
		const currentTime = Date.now();
		const timeDifference = currentTime - lastUpdated;
		const cachedBackgroundClasses = GM_getValue(
			"STYLESHEETHIJACKFORBACKGROUND"
		);
		//console.log({lastUpdated,currentTime,timeDifference})
		//console.log("timeDifference: " + timeDifference)
		if (
			lastUpdated === null ||
			lastUpdated === undefined ||
			timeDifference > lastUpdateCheck
		) {
			GM_setValue("lastUpdated", currentTime);
			refreshInitValues = true;
			// console.log("set lastUpdated to now")
		}
		//console.log(refreshInitValues);

		if (debugCSSClasses) {
			if (
				STYLESHEETHIJACKFORBACKGROUND !== "" &&
				(refreshInitValues ||
					cachedBackgroundClasses === undefined ||
					forceUpdate)
			) {
				let styleSheetToAddBackground = "";
				for (let i = 0; i < STYLESHEETHIJACKFORBACKGROUNDARRAY.length; i++) {
					if (styleSheetContainsClass(STYLESHEETHIJACKFORBACKGROUNDARRAY[i])) {
						console.log(
							"+ has found class: " + STYLESHEETHIJACKFORBACKGROUNDARRAY[i]
						);
						styleSheetToAddBackground += STYLESHEETHIJACKFORBACKGROUNDARRAY[i];
					} else {
						console.log(
							"- has not found class: " + STYLESHEETHIJACKFORBACKGROUNDARRAY[i]
						);
					}
				}
				STYLESHEETHIJACKFORBACKGROUND = styleSheetToAddBackground
					.replace(REGEX_DOTCOMMA, " ")
					.trim();
				GM_setValue(
					"STYLESHEETHIJACKFORBACKGROUND",
					STYLESHEETHIJACKFORBACKGROUND
				);
				//console.log("STYLESHEETHIJACKFORBACKGROUND: " + STYLESHEETHIJACKFORBACKGROUND)
			} else {
				STYLESHEETHIJACKFORBACKGROUND = cachedBackgroundClasses;
				console.log("cachedBackgroundClasses: " + cachedBackgroundClasses);
			}
			const cachedTitleClasses = GM_getValue("STYLESHEETHIJACKFORTITLE");
			if (
				STYLESHEETHIJACKFORTITLE !== "" &&
				(refreshInitValues || cachedTitleClasses === undefined || forceUpdate)
			) {
				let styleSheetToAddTitle = "";
				for (let i = 0; i < STYLESHEETHIJACKFORTITLEARRAY.length; i++) {
					if (styleSheetContainsClass(STYLESHEETHIJACKFORTITLEARRAY[i])) {
						console.log(
							"+ has found class: " + STYLESHEETHIJACKFORTITLEARRAY[i]
						);
						styleSheetToAddTitle += STYLESHEETHIJACKFORTITLEARRAY[i];
					} else {
						console.log(
							"- has not found class: " + STYLESHEETHIJACKFORTITLEARRAY[i]
						);
					}
				}
				STYLESHEETHIJACKFORTITLE = styleSheetToAddTitle
					.replace(REGEX_DOTCOMMA, " ")
					.trim();
				GM_setValue("STYLESHEETHIJACKFORTITLE", STYLESHEETHIJACKFORTITLE);
				//console.log("STYLESHEETHIJACKFORTITLE: " + STYLESHEETHIJACKFORTITLE)
			} else {
				STYLESHEETHIJACKFORTITLE = cachedTitleClasses;
				console.log("cachedTitleClasses: " + cachedTitleClasses);
			}
		} else {
			//console.log("not debugging CSS classes")
			STYLESHEETHIJACKFORBACKGROUND = STYLESHEETHIJACKFORBACKGROUND.replace(
				REGEX_DOTCOMMA,
				" "
			).trim();
			STYLESHEETHIJACKFORTITLE = STYLESHEETHIJACKFORTITLE.replace(
				REGEX_DOTCOMMA,
				" "
			).trim();
		}
	}

	function setPopoverHeight(
		adjustedTargetHeigt = 400,
		targetTopPxYPosition = 0
	) {
		//https://developer.mozilla.org/en-US/docs/Web/CSS/min() not compatible with firefox 56

		let targetHeight = defaultHeight;
		if (showSmaller) targetHeight = smallHeight;
		if (adjustedTargetHeigt < targetHeight) targetHeight = adjustedTargetHeigt;
		const minHeightValue =
			"min(" +
			targetHeight +
			"px, (100vh - (100vh - 100%) - " +
			offsetToBottomBorderY * 2 +
			"px - " +
			targetTopPxYPosition +
			"px))";
		if (supportsCSSMin) {
			//console.log("supports min()");
			popover.style.maxHeight = minHeightValue;
			popover.style.height = "";
		} else {
			console.log("does not support CSS min() for max-Height");
			/* popover.style.maxHeight =
          "calc(100vh - (100vh - 100%) - " + offsetToBottomBorderY * 2 + "px))";*/
			popover.style.height = targetHeight + "px";
		}
	}
	function setPopoverWidth(adjustedTargetWidth = 400, targetTopPxPostion = 0) {
		let targetHeight = defaultHeight;
		if (showSmaller) targetHeight = smallHeight;

		// if (adjustedTargetWidth < targetHeight) targetHeight = adjustedTargetWidth;

		if (showDetails) {
			popover.classList.add("popoverDetail");
			popoverTitle.classList.add("popoverTitleDetail");

			const minWidthValue =
				"min(" +
				targetHeight * 2 +
				"px, (100vw - (100vw - 100%) - " +
				offsetToRightBorderX * 2 +
				"px))";
			//const supportsCSSMin = CSS.supports("max-Width", minWidthValue);
			if (supportsCSSMin) {
				//console.log("supports min()");
				popover.style.maxWidth = minWidthValue;
			} else {
				console.log("does not support CSS min() for max-Width");
				popover.style.maxWidth =
					"calc(100vw - (100vw - 100%) - " + offsetToRightBorderX * 2 + "px))";
				popover.style.width = targetHeight * 2 + "px";
			}
		} else {
			popover.classList.remove("popoverDetail");
			popoverTitle.classList.remove("popoverTitleDetail");

			const minWidthValue =
				"min(" +
				targetHeight +
				"px, (100vw - (100vw - 100%) - " +
				offsetToRightBorderX * 2 +
				"px))";
			//const supportsCSSMin = CSS.supports("max-Width", minWidthValue);
			if (supportsCSSMin) {
				popover.style.maxWidth = minWidthValue;
			} else {
				/*
          popover.style.maxWidth =
            "calc(100vw - (100vw - 100%) - " + offsetToRightBorderX * 2 + "px))"; //popover.style.height = targetHeight + "px !important";
            */
				popover.style.width = targetHeight + "px";
			}
		}
	}
	function createPopover() {
		let bodyElement = document.getElementsByTagName("BODY")[0];

		popover = document.createElement("div");
		popover.id = "popover";
		popoverTitle = document.createElement("header");
		popoverContent = document.createElement("content");

		popover.appendChild(popoverTitle);
		popover.appendChild(popoverContent);
		arrowContainer = document.createElement("div");
		arrowContainer.id = "popover_arrow";
		bodyElement.appendChild(arrowContainer);
		popover.className = (
			"defaultBackgroundStyle " + STYLESHEETHIJACKFORBACKGROUND
		).trim();
		popoverContent.className =
			"popoverContent blackFont " + STYLESHEETHIJACKFORBACKGROUND;
		if (
			!STYLESHEETHIJACKFORBACKGROUND &&
			DEFAULTBACKGROUNDCOLOR &&
			DEFAULTBACKGROUNDCOLOR != ""
		) {
			popover.style.backgroundColor = DEFAULTBACKGROUNDCOLOR;
		}
		//setPopoverHeight();
		//setPopoverWidth();
		setTimeout(setPopoverHeight, 500); //hack. why is a wait time needed?
		setTimeout(setPopoverWidth, 500); //hack. Can not apply style.height without a short wait time in older firefox 56
		//console.log(popover)
		//console.log(popover.style)
		popoverTitle.className = (
			STYLESHEETHIJACKFORTITLE + " defaultTitleStyle"
		).trim();
		if (
			!STYLESHEETHIJACKFORTITLE &&
			DEFAULTTITLEBACKGROUNDCOLOR &&
			DEFAULTTITLEBACKGROUNDCOLOR != ""
		) {
			popoverTitle.style.backgroundColor = DEFAULTTITLEBACKGROUNDCOLOR;
			popoverTitle.style.color = "#fff";
		}
		popover.addEventListener("mouseleave", hideOnMouseLeave);
		popover.style.left = 0;
		popover.style.top = 0; //avoid invisible popover outside regular site height

		hidePopOver();

		bodyElement.insertAdjacentElement("beforeend", popover);
		popoverBorderWidth = 0.6; //getComputedStyle(popoverTitle,"border-bottom-width")
		updateArrowStyle(); //Forum
		updateArrowColor();

		/*
        console.log("popover.style.height: " + popover.style.height);
        popover.style.minHeight="0px";
        popover.style.position="absolute";
        popover.style.height = '333px';
        console.log("popover.style.height: " + popover.style.height);
        setPopoverHeight();*/
	}
	function updateArrowStyle() {
		//console.log("updateArrowStyle");
		popoverForegroundColor = getComputedStyle(popover, "background-color");
		let popoverContentForegroundColor = getComputedStyle(
			popoverContent,
			"background-color"
		);
		const blendedForegroundColor = blendColorsToRGBA([
			popoverForegroundColor,
			popoverContentForegroundColor,
		]);

		popoverBackgroundColor = getComputedStyle(popoverTitle, "background-color");
		/* console.log(
      "backgroundColor of popoverTitle: " +
        popoverBackgroundColor +
        ", popoverBorderWidth: " +
        popoverBorderWidth +
        ", popoverForegroundColor: " +
        popoverForegroundColor +
        ", popoverContentForegroundColor: " +
        popoverContentForegroundColor +
        ", blendedForegroundColor: " +
        blendedForegroundColor
    );*/
		popoverForegroundColor = blendedForegroundColor;
	}
	function updateArrowColor() {
		let styleSheetIDElement = "mesh-nightmode-css";
		let linkElement = document.getElementById(styleSheetIDElement);

		//console.log(linkElement);
		function loadedCb() {
			//console.log("finished loading stylesheet " + linkElement.href);
			updateArrowStyle();
		}
		function errorCb(error) {
			console.log(error);
			console.log("error loading stylesheet: " + linkElement.href);
		}
		if (linkElement) {
			//console.log(linkElement.href);
			let url = linkElement.href;
			linkElement.href = "";
			linkElement.removeEventListener("loaddata", loadedCb); // or: file.onload = loadedCb;
			linkElement.onload = () => {
				loadedCb();
			};
			linkElement.onerror = (error) => {
				errorCb(error);
			};
			linkElement.href = url;

			if (linkElement.complete) {
				loadedCb();
			}
		}
	}

	function showPopupLoadingSpinner(
		hoveredTitleLink,
		title,
		event,
		notification = "",
		coverData = undefined
	) {
		const DEBUG = false;

		//console.log(event)
		const isActivePopup =
			currentTitelHover !== undefined &&
			hoveredTitleLink !== undefined &&
			currentTitelHover == hoveredTitleLink;
		/*
              console.group("showPopupLoadingSpinner")
              //"currentCoverData: " +currentCoverData +
              console.log("currentTitelHover: " + currentTitelHover+", hoveredTitleLink: " + hoveredTitleLink+", currentTitelHover == hoveredTitleLink: " + (currentTitelHover == hoveredTitleLink))
              console.log("isActivePopup: " + isActivePopup)
              console.groupEnd();*/
		if (isActivePopup) {
			popover.classList.remove("isExternalContent"); //last link was external. remove isExternal class style
			// console.group("showPopupLoadingSpinner")
			//popover.empty();
			//popover.innerHTML = "";
			DEBUG && console.log("popover.offsetHeight: " + popover.offsetHeight);
			if (coverData !== undefined) {
				//console.log("showPopupLoadingSpinner")
				DEBUG && console.log(coverData);
				adjustPopupTitleDetail(coverData, title);
			} else popoverTitle.textContent = title;

			if (notification != "") {
				isShowingSpinnerAnimation = false;
				popoverContent.innerHTML =
					'<div id="coverPreviewContentAutoScroll" class="popoverContent ">' +
					notification +
					"</div>";
				popoverContent.className =
					"popoverContent wordBreak " + STYLESHEETHIJACKFORBACKGROUND; //blackfont
			} else {
				isShowingSpinnerAnimation = true;
				popoverContent.innerHTML = `<svg class="spinner" viewBox="0 0 50 50">
                            <g transform="translate(25, 25)">
                            <circle class="" cx="0" cy="0" r="25" fill="black" stroke-width="5" />
                            <circle class="path" cx="0" cy="0" r="23" fill="none" stroke-width="5">
                                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0" to="360"  dur="1.6s" repeatCount="indefinite" />
                            </circle>
                            </g>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="fill:#fff;font-size:11px">Loading </text>
                        </svg>`;

				//popoverContent.innerHTML = '<div class="forground" style="z-index: 3;">Loading Data</div><svg class="spinner" viewBox="0 0 50 50"><circle class="" cx="25" cy="25" r="22" fill="black" stroke-width="5"></circle><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>';
				popoverContent.className =
					"popoverContent " + STYLESHEETHIJACKFORBACKGROUND; //whitefont
			}
			DEBUG && console.log(popover);
			//   DEBUG && console.log("popover.offsetHeight: " + popover.offsetHeight);
			//console.log(event)
			if (coverData) {
				popupPos(event, coverData.isExternal);
			} else popupPos(event);
			//  console.groupEnd("showPopupLoadingSpinner")
		}
	}
	//#region adapted code from scrollToTarget of https://htmldom.dev/scroll-to-an-element-smoothly/
	let direction = 1;
	let pauseTimeDifference = null;
	let currentPercent = null;
	let percentBeforeStyleChange;
	let hasChangedStyle = false;
	let requestId = [];
	let startTime = null;
	const scrollToTarget = function (idToScroll, node, duration = 7000) {
		const DEBUG = false;
		let scrollOverflow = node.scrollHeight - node.offsetHeight;
		const updateStartValues = function (percent, currentTime) {
			if (percent) {
				DEBUG && console.group("updateStartValues");
				scrollOverflow = node.scrollHeight - node.offsetHeight;
				startTime = currentTime - pauseTimeDifference;
				pauseTimeDifference = null;
				// if (direction == 1) startPos = scrollOverflow * percent;
				// else startPos = scrollOverflow * (1 - percent);

				DEBUG && console.log("percent: " + percent + ", startPos: ");

				let time = currentTime - startTime;
				//console.log("pauseTimeDifference, time: " + time);
				let targetPercent = Math.min(time / duration, 1);
				DEBUG &&
					console.log(
						"percent after pause: " +
							targetPercent +
							", percent: " +
							percent +
							", direction: " +
							direction +
							", scrolltop percent: "
					);
				DEBUG && console.groupEnd("updateStartValues");
			}
		};
		const loop = function (currentTime) {
			if (!startTime) {
				startTime = currentTime;
			}

			//console.log("scrollOverflow: " + scrollOverflow);
			//#region set StartValues
			if (currentPercent != undefined && currentPercent !== null) {
				DEBUG &&
					console.log(
						"currentPercent:" + currentPercent + ", direction: " + direction
					);
				updateStartValues(currentPercent, currentTime);
				currentPercent = null;
			}

			if (hasChangedStyle) {
				DEBUG && console.log("hasChangedStyle");
				updateStartValues(percentBeforeStyleChange, currentTime);
				hasChangedStyle = false;
			}
			//#endregion

			// Elapsed time in miliseconds
			let time = currentTime - startTime;

			const percent = Math.min(time / duration, 1);

			let targetScrollTop, targetScrollTopPercent;
			if (direction == 1) {
				targetScrollTopPercent = easeInOutQuad(percent);
			} else {
				targetScrollTopPercent = 1 - easeInOutQuad(percent);
			}

			targetScrollTop = scrollOverflow * targetScrollTopPercent;
			//console.log(targetScrollTop +", percent: " + percent)
			node.scrollTo(0, targetScrollTop, "auto");
			pauseTimeDifference = currentTime - startTime;
			if (autoScrollCoverData && popoverVisible) {
				//#region loop Animation
				const insideContainerValue =
					targetScrollTop <= scrollOverflow && targetScrollTop >= 0;

				if (time < duration && insideContainerValue) {
					// Continue moving
					//requestId = window.requestAnimationFrame(loop);
					//startPos = 0;
				} else {
					//startPos=0;
					startTime = currentTime;

					direction *= -1;
				}
				percentBeforeStyleChange = percent;
				requestId[idToScroll] = window.requestAnimationFrame(loop);
				//#endregion
			} else {
				//#region pause animation
				//console.group("loop scrolldata before pause");
				window.cancelAnimationFrame(requestId[idToScroll]);
				//pauseTimeDifference = currentTime - startTime;
				currentPercent = percent;
				DEBUG &&
					console.log(
						"scrollPos before pause: " +
							node.scrollTop +
							", percent: " +
							percent +
							", direction: " +
							direction +
							", targetScrollTop: " +
							targetScrollTop
					);

				//console.groupEnd("loop scrolldata before pause");
				//#endregion
			}
		};

		//start animation
		requestId[idToScroll] = window.requestAnimationFrame(loop);
	};
	const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); //https://gist.github.com/gre/1650294
	//#endregion
	function autoScrollData(idToScroll = "coverPreviewAutoScroll") {
		coverDataContainer[idToScroll] = document.getElementById(idToScroll);
		setStartScrollPosition(idToScroll);
		if (autoScrollCoverData) {
			if (coverDataContainer[idToScroll]) {
				/*console.log(
              "coverDataContainer.offsetHeight: " +
                coverDataContainer.offsetHeight +
                ", coverDataContainer.scrollHeight: " +
                coverDataContainer.scrollHeight
            );*/
				const hasOverflowValue =
					coverDataContainer[idToScroll].scrollHeight >
					coverDataContainer[idToScroll].offsetHeight;
				if (hasOverflowValue) {
					if (requestId[idToScroll])
						window.cancelAnimationFrame(requestId[idToScroll]);
					//console.log("currentPercent: " + currentPercent);
					scrollToTarget(idToScroll, coverDataContainer[idToScroll]);
				}
			}
		}
	}
	function resetAutoScroll(idToScroll = "coverPreviewAutoScroll") {
		//autoScrollCoverData = true;
		direction = 1;

		currentPercent = null;
		startTime = null;
		pauseTimeDifference = null;
		hasChangedStyle = false;
		//console.log(requestId);
		if (requestId[idToScroll])
			window.cancelAnimationFrame(requestId[idToScroll]);
	}
	function setStartScrollPosition(idToScroll) {
		const DEBUG = false;

		if (coverDataContainer[idToScroll] && currentPercent) {
			let scrollOverflow =
				coverDataContainer[idToScroll].scrollHeight -
				coverDataContainer[idToScroll].offsetHeight;
			DEBUG &&
				console.log(
					"scrollOverflow: " +
						scrollOverflow +
						", currentPercent: " +
						currentPercent
				);
			let targetScrollTop, targetScrollTopPercent;
			if (direction == 1) {
				targetScrollTopPercent = easeInOutQuad(currentPercent);
			} else {
				targetScrollTopPercent = 1 - easeInOutQuad(currentPercent);
			}

			targetScrollTop = scrollOverflow * targetScrollTopPercent;
			DEBUG && console.log("targetScrollTop: " + targetScrollTop);
			DEBUG &&
				console.log(
					"coverDataContainer.scrollTop: " +
						coverDataContainer[idToScroll].scrollTop
				);
			coverDataContainer[idToScroll].scrollTop = targetScrollTop;
			DEBUG &&
				console.log(
					"coverDataContainer.scrollTop: " +
						coverDataContainer[idToScroll].scrollTop
				);
		}
	}
	function refreshPopover(coverData, e = undefined) {
		//only call when isActivePopup
		const DEBUG = false;
		if (coverData && coverData !== undefined) {
			isShowingSpinnerAnimation = false;
			DEBUG && console.log("currentTitelHover: " + currentTitelHover);

			DEBUG && console.group("refreshPopover");
			const link = coverData.url;
			// const title = coverData.title;
			//console.log(coverData)
			//console.log(e)
			// popoverTitle.textContent = title;
			// console.log(link)
			if (
				link === undefined ||
				link === null ||
				link == "" ||
				link == "undefined"
			) {
				popoverContent.innerHTML =
					'<div class="containerPadding">No Cover Image found</div>';
			} else {
				popoverContent.innerHTML =
					'<img src="' + link + '" class="ImgFitDefault" ></img>';
			}
			adjustPopupTitleDetail(coverData);

			DEBUG && console.groupEnd("refreshPopover");
			DEBUG && console.log(e);
			//if (currentTitelHover == title)
			if (e !== undefined) {
				popupPos(e, coverData.isExternal);
			}
		}
	}

	//#region get serieDetails
	function getRatingNumber(ratingString) {
		//const ratingString = "Rating(3.3 / 5.0, 1940 votes)"
		let ratingNumber;

		if (ratingString) {
			const matchesVotes = ratingString.toLowerCase().match(reVoteCount);
			const matches = ratingString.match(reRating); //"Rating(3.3 / 5.0, 1940 votes)"
			const matchesSingleNumber = ratingString.match(reRatingSingleNumber); //4.5

			//console.log(matches)
			//console.log(matchesSingleNumber)
			//console.log(matches.length)
			let hasVoteCountBigger0 = true;
			let hasVoteString = false;
			// console.log(matchesVotes)
			if (matchesVotes && matchesVotes.length > 1) {
				//console.log(matchesVotes[1])
				hasVoteString = true;
				if (matchesVotes[1] == 0 || matchesVotes[1] == "0") {
					//console.log("no vote count")
					hasVoteCountBigger0 = false;
				}
			}

			if (matches && matches.length == 3 && hasVoteCountBigger0) {
				//display rating when vote count found and more than 0
				//console.log(matches[1])
				ratingNumber = matches[1];
			} else {
				//no votecount found
				//no rating in relation to max rating -> search for single number
				//console.log(matchesSingleNumber[1])
				if (
					hasVoteCountBigger0 &&
					matchesSingleNumber &&
					matchesSingleNumber.length == 2
				) {
					ratingNumber = matchesSingleNumber[1];
				}
			}
		}

		return ratingNumber;
	}
	function getChapters(statusString) {
		//TODO "Episodes" instead of chapter for tv series
		const DEBUG = false;
		let result;
		if (statusString && statusString.length > 0) {
			DEBUG && console.group("getChapters");
			let chapterCount;
			let lowerCaseStatusString = statusString.toLowerCase();
			DEBUG && console.log("lowerCaseStatusString: " + lowerCaseStatusString);
			const matches = lowerCaseStatusString.match(reChapters);
			let webnovel = "";
			let hasVolumenInString = false;
			let hasChapterInString = false;
			if (matches && matches.length >= 2) {
				hasChapterInString = true;
				chapterCount = matches[1];
				if (matches[2]) {
					webnovel = " WN";
				}
			}
			DEBUG && console.log("chapterCount reChapters: " + chapterCount);
			if (!chapterCount) {
				const matchesBehind = lowerCaseStatusString.match(
					reChaptersNumberBehind
				);
				if (matchesBehind && matchesBehind.length >= 2) {
					hasChapterInString = true;
					chapterCount = matchesBehind[1];
				}
			}
			DEBUG &&
				console.log("chapterCount reChaptersNumberBehind: " + chapterCount);
			if (!chapterCount) {
				const matchesNumbers = lowerCaseStatusString.match(
					reChaptersOnlyNumbers
				); //example string "6892(Ongoing)"
				if (matchesNumbers && matchesNumbers.length >= 2) {
					chapterCount = matchesNumbers[1];
				}
			}
			DEBUG &&
				console.log("chapterCount reChaptersOnlyNumbers: " + chapterCount);
			if (lowerCaseStatusString.includes("vol")) hasVolumenInString = true;

			if (chapterCount) {
				let numberType = " Chapters";
				if (hasVolumenInString && !hasChapterInString) numberType = " Vol";
				result = chapterCount + webnovel + numberType;
			}
			DEBUG && console.groupEnd();
		}
		DEBUG && console.log("result: " + result);
		return result;
	}
	function getCompletedState(statusString) {
		let result = false;
		if (statusString && statusString.toLowerCase().includes("complete")) {
			//complete | completed
			result = true;
		}
		return result;
	}
	function getOngoingState(statusString) {
		let result = false;
		if (statusString && statusString.toLowerCase().includes("ongoing")) {
			result = true;
		}
		return result;
	}
	function getDetailsString(coverData) {
		let completeDetails = "";
		if (showDescription) {
			if (coverData.description && coverData.description.length > 0) {
				completeDetails +=
					'<div class="borderTop">Description: ' +
					coverData.description +
					"</div>";
			} else {
				completeDetails +=
					'<div class="borderTop">Description: Description Empty or error in coverData. Please reload seriepage info</div>';
			}
		} else {
			if (coverData.votes) {
				completeDetails +=
					'<div class="borderTop">Rating: ' + coverData.votes + "</div>";
			}
			if (coverData.status) {
				completeDetails +=
					'<div class="borderTop">Status: ' + coverData.status + "</div>";
			}
			if (coverData.chapters) {
				completeDetails +=
					'<div class="borderTop">Chapters: ' + coverData.chapters + "</div>";
			}
			if (coverData.genre) {
				completeDetails +=
					'<div class="borderTop">Genre: ' + coverData.genre + "</div>";
			}
			if (coverData.showTags) {
				completeDetails +=
					'<div class="borderTop">Tags: ' + coverData.showTags + "</div>";
			}
		}

		return completeDetails;
	}
	function getShortendDetailsString(coverData) {
		let completeDetails = "";
		let rating = getRatingNumber(coverData.votes);
		let chapters = getChapters(coverData.status);
		let serieChapters = getChapters(coverData.chapters);
		let completed = getCompletedState(coverData.status);
		let ongoing = getOngoingState(coverData.status);
		//console.log(rating)
		//console.log(chapters)
		//console.log(serieChapters)
		//console.log(completed)
		//console.log(ongoing)
		if (rating || chapters || serieChapters || completed || ongoing) {
			if (rating !== undefined) rating += "★ ";
			else rating = "";
			//console.log(coverData);

			if (chapters !== undefined) chapters = chapters + " ";
			else chapters = "";

			if (serieChapters !== undefined) serieChapters = serieChapters + " ";
			else serieChapters = "";
			//console.log("chapters: " + chapters);
			//console.log("serieChapters: " + serieChapters);
			if (serieChapters != "") chapters = "";

			if (completed) completed = "🗹 ";
			else completed = ""; //https://www.utf8icons.com/
			if (ongoing) ongoing = "✎ ";
			else ongoing = "";

			completeDetails +=
				'<span class="' +
				smallTextStyle +
				'" style="white-space: nowrap;"> [' +
				rating +
				chapters +
				serieChapters +
				completed +
				ongoing +
				"]</span>";
		}
		return completeDetails;
	}
	async function adjustPopupTitleDetail(coverData, title = undefined) {
		let titleToShow = "";
		popoverTitle.textContent = "";

		if (coverData && coverData.title) titleToShow = coverData.title;
		else if (title !== undefined) titleToShow = title;
		//popoverTitle.textContent = titleToShow;
		//console.log("adjustPopupTitleDetail - showDetails: " + showDetails)
		let completeDetails = "";
		let externalIcon = "";
		let showReadingListIcon = "";
		let showReadingListIconText = "";

		//console.log(coverData.readingListIcon);
		//console.log(coverData.readingListTitle)
		if (useReadingListIconAndTitle && !coverData.isExternal) {
			//console.log(coverData.readingListIcon)
			// showReadingListIcon="[&nbsp;] ";
			if (coverData.readingListIcon !== undefined) {
				if (showDetails) {
					showReadingListIcon =
						'<img src="' +
						coverData.readingListIcon +
						'" width="16px"; height="16px" /> ';
				} else {
					showReadingListIcon =
						'<img src="' +
						coverData.readingListIcon +
						'" width="12px"; height="12px" /> ';
				}
			} else {
				if (coverData.readingListIconText !== undefined) {
					showReadingListIconText = coverData.readingListIconText;
				}
			}
		}
		//console.log(coverData)
		if (coverData.isExternal) {
			externalIcon = '<span style="background-color:darkred">🔗</span> ';
			popover.classList.add("isExternalContent");
		} else {
			popover.classList.remove("isExternalContent");
		}
		let alternativeNames = "";
		if (showDetails) {
			//console.log("showDetails should be true")

			let showExternalLink = "";
			let showReadingListTitle = "";
			if (useReadingListIconAndTitle && !coverData.isExternal) {
				showReadingListTitle = "";
				if (coverData.readingListTitle) {
					showReadingListTitle =
						"<div>" +
						showReadingListIcon +
						showReadingListIconText +
						" " +
						coverData.readingListTitle +
						"</div>";
				} else {
					showReadingListTitle =
						"<div>[&nbsp;] not in a reading list or logged in</div>";
				}
			}

			if (coverData.alternativeNames && coverData.alternativeNames != "") {
				alternativeNames = " [Key A]";
			}
			if (coverData.isExternal) {
				showExternalLink =
					' <div style="background-color:darkred" class="coverDataTitle">🔗[' +
					coverData.isExternal +
					"]</div>";
			}
			completeDetails +=
				'<span class="' +
				mediumTextStyle +
				'" style="height:100%;display:flex;flex-direction:column"><span class="coverDataTitle"><b>' +
				titleToShow +
				"</b>" +
				alternativeNames +
				showReadingListTitle +
				"</span> " +
				showExternalLink +
				'<div id="coverPreviewAutoScroll">' +
				getDetailsString(coverData);
			+"</div>"; //autoscroll

			completeDetails +=
				'<div class="borderTop ' +
				smallTextStyle +
				'">[KeyH show hotkey list]<br />[Key1 Switch detailed and simple popup] [Key2 Switch between description and tags] [Key3 small and big popup style] </div></span>';
		} else {
			if (coverData.alternativeNames && coverData.alternativeNames != "") {
				alternativeNames = " [A]";
			}
			completeDetails =
				'<span class="' +
				mediumTextStyle +
				'">' +
				externalIcon +
				showReadingListIcon +
				showReadingListIconText +
				"<b>" +
				titleToShow +
				"</b>" +
				alternativeNames +
				" " +
				getShortendDetailsString(coverData);
			completeDetails +=
				' <span class="' +
				smallTextStyle +
				'">[KeyH hotkey list]</span></span>';
		}
		//popoverTitle.innerHTML = completeDetails;

		popoverTitle.innerHTML = completeDetails;
	}
	//#endregion

	function setCurrentCoverDataAndLoadImage(coverData, hoveredTitle, e) {
		const DEBUG = false;
		//GM_getCachedValue
		DEBUG && console.group("setCurrentCoverDataAndLoadImage");

		DEBUG && console.log(coverData);
		let serieTitle = hoveredTitle;
		if (!hoveredTitle || coverData.title) {
			//pure link without title get title of seriepage
			serieTitle = coverData.title;
		}
		DEBUG &&
			console.log(
				"hoveredTitle: " + hoveredTitle + ", serieTitle: " + serieTitle
			);

		if (
			coverData !== undefined &&
			coverData !== null &&
			hoveredTitle == currentTitelHover
		) {
			currentCoverData = coverData;
		}

		if (e) {
			loadImageFromBrowser({
				coverData: currentCoverData,
				e: e,
				serieTitle: serieTitle,
				hoveredTitleLink: hoveredTitle,
			});
		}

		DEBUG && console.groupEnd("setCurrentCoverDataAndLoadImage");
	}

	function ajaxLoadImageUrlAndShowPopup(
		forceReload = false,
		element,
		hoveredTitle,
		e,
		external = false,
		targetPage = undefined
	) {
		const currentEvent = e;

		//console.log(currentEvent)
		//console.log("mouseenter")
		// console.group("ajaxLoadImageUrlAndShowPopup")

		return parseSeriePage(
			element,
			forceReload,
			hoveredTitle,
			currentEvent,
			external,
			targetPage
		).then(
			function (coverData) {
				if (coverData !== undefined) {
					setCurrentCoverDataAndLoadImage(
						coverData,
						hoveredTitle,
						currentEvent
					);
				}
			},
			function (Error) {
				const elementUrl = element.href;
				console.log(Error);
				let errorMessage = '"(' + Error + ')" failed to fetch ' + elementUrl;
				console.log("errorMessage: " + errorMessage);
				setLinkStateOfSameLinks(element, linkIconEnum.error);
				showPopupLoadingSpinner(
					hoveredTitle,
					hoveredTitle,
					currentEvent,
					errorMessage
				);
			}
		);
		// console.groupEnd("ajaxLoadImageUrlAndShowPopup")
	}

	function imageLoaded(
		coverData,
		hoveredTitleLink,
		serieTitle = undefined,
		e = undefined
	) {
		const DEBUG = false;
		const hasMouseEnterEvent = serieTitle && e !== undefined;
		const isActivePopup =
			currentTitelHover !== undefined &&
			hoveredTitleLink !== undefined &&
			currentTitelHover == hoveredTitleLink &&
			hasMouseEnterEvent; //currentTitelHover == hoveredTitleLink currentCoverData == coverData
		DEBUG && console.group("loadImageFromBrowser img.onload: " + serieTitle);
		DEBUG && console.log("finished loading imgurl: " + coverData.url);
		DEBUG &&
			console.log(
				"currentTitelHover: " +
					currentTitelHover +
					", isActivePopup: " +
					isActivePopup
			);
		DEBUG && console.log("isActivePopup: " + isActivePopup);
		if (isActivePopup) {
			DEBUG && console.log("refreshPopover");
			refreshPopover(coverData, e); //popup only gets refreshed when currentTitelHover == serieTitle
		}
		DEBUG && console.groupEnd("loadImageFromBrowser img.onload");
	}

	function imageLoadingError(
		coverData,
		errorText = undefined,
		hoveredTitleLink,
		serieTitle = undefined,
		e = undefined
	) {
		console.group("loadImageFromBrowser img.onerror: " + serieTitle);
		/*
            const hasMouseEnterEvent = serieTitle && e !== undefined;
            const isActivePopup =
              currentTitelHover !== undefined &&
              hoveredTitleLink !== undefined &&
              currentTitelHover == hoveredTitleLink &&
              hasMouseEnterEvent; //currentTitelHover == hoveredTitleLink currentCoverData == coverData
            console.log("isActivePopup: " + isActivePopup);*/
		console.log("hoveredTitleLink:" + hoveredTitleLink);
		console.log(errorText);
		let filename = "";
		console.log("coverData.url: " + coverData.url);

		if (coverData.url !== undefined && coverData.url != "undefined") {
			filename = decodeURIComponent(coverData.url);
		} else {
			filename = "";
		}
		let additionalText = "";
		if (errorText) additionalText = errorText;
		let errorMessage =
			'<div class="containerPadding">browser blocked/has error loading the cover: <br />' +
			filename +
			"<br />" +
			additionalText +
			"</div>";
		if (filename == "") {
			errorMessage =
				'<div class="containerPadding">target site has no coverImage<br />[no image tag found]<br /></div>';
		}
		console.log("errorMessage: " + errorMessage);
		//console.log(window)
		console.log(navigator);
		//console.log(navigator.userAgent)
		const useragentString = navigator.userAgent;
		console.log("useragentString: " + useragentString);
		const isChrome = useragentString.includes("Chrome");
		if (isChrome) {
			console.log(
				"look in the developer console if 'net::ERR_BLOCKED_BY_CLIENT' is displayed or manually check if the imagelink still exists/reload the coverdata"
			);
		} else {
			console.log(
				"image loading most likely blocked by browser or addon. Check if the imagelink still exists/reload the coverdata"
			);
		}

		// if (isActivePopup)
		showPopupLoadingSpinner(
			hoveredTitleLink,
			serieTitle,
			e,
			errorMessage,
			coverData
		);
		console.groupEnd("loadImageFromBrowser img.onerror");
	}
	async function loadImageFromBrowser({
		coverData,
		e = undefined,
		serieTitle = undefined,
		hoveredTitleLink = undefined,
	}) {
		const DEBUG = false;
		//console.log(e)
		//console.group("loadImageFromBrowser")
		let img = document.createElement("img"); //put img into dom. Let the image preload in background
		const hasMouseEnterEvent =
			hoveredTitleLink !== undefined && e !== undefined;
		//console.log(currentCoverData)
		//console.log(coverData)

		DEBUG && console.log("loadImageFromBrowser");
		DEBUG && console.log(hasMouseEnterEvent);
		img.onload = () => {
			imageLoaded(coverData, hoveredTitleLink, serieTitle, e);
		};

		img.onerror = async (error) => {
			let imageCanBeLoaded = checkImageServerState(coverData.url);
			console.log("imageCanBeLoaded result before await: ");
			console.log(imageCanBeLoaded);
			imageCanBeLoaded = await imageCanBeLoaded;
			// console.log("imageCanBeLoaded after await: " + imageCanBeLoaded)
			DEBUG &&
				console.log(
					"imageCanBeLoaded: " +
						imageCanBeLoaded +
						", coverData.url: " +
						coverData.url
				);
			console.log(
				"imageCanBeLoaded: " +
					imageCanBeLoaded +
					", coverData.url: " +
					coverData.url
			);
			let errorMessage;
			if (imageCanBeLoaded) {
				errorMessage =
					"image fetching is possible, but image is blocked from loading.<br />Check for example ublock/umatrix or similar if domain is allowed to load images or image sizes exceeds allowed media size";
			} else {
				errorMessage =
					"image could not be loaded. Check in console.log what error state checkImageServerState() produces";
			}
			console.group("img node has loading error");
			console.log(error);
			console.log("errorMessage: " + errorMessage);
			console.groupEnd();
			imageLoadingError(
				coverData,
				errorMessage,
				hoveredTitleLink,
				serieTitle,
				e
			);
		};
		//console.log(coverData)
		if (coverData !== undefined) {
			if (coverData.url !== undefined && coverData.url != "undefined") {
				img.src = coverData.url;

				if (img.complete) {
					DEBUG &&
						console.log(
							"loadImageFromBrowser preload completed: " + serieTitle
						);
					DEBUG && console.log(img.src);
				} else {
					//if image not available/cached in browser show loading pinner
					/*
                  const isActivePopup =
                    currentCoverData !== undefined &&
                    currentTitelHover !== undefined &&
                    hoveredTitleLink !== undefined &&
                    currentTitelHover == hoveredTitleLink &&
                    hasMouseEnterEvent; //currentTitelHover == hoveredTitleLink currentCoverData == coverData
                  //console.log(e)
                  if (isActivePopup) {
                      */
					DEBUG &&
						console.log(
							"loadImageFromBrowser image not completely loaded yet. Show loading spinner : " +
								serieTitle
						);
					showPopupLoadingSpinner(
						hoveredTitleLink,
						serieTitle,
						e,
						"",
						coverData
					);
					//  }
				}
			} else {
				imageLoadingError(
					coverData,
					"coverData has no image",
					hoveredTitleLink,
					serieTitle,
					e
				);
			}
		}

		// console.groupEnd("loadImageFromBrowser")
	}

	function hidePopOver() {
		// popover.style.visibility = "hidden";
		//arrowContainer.style.visibility = "hidden";
		arrowContainer.classList.add("hidePopover");
		popover.classList.add("hidePopover");

		//popover.style.height = "0";
		//popover.style.width = "0";
		//console.group("hidePopOver")
		//console.log("currentTitelHover: " + currentTitelHover)

		currentTitelHover = undefined;
		currentCoverData = undefined;
		popoverVisible = false;
		if (isShowingSpinnerAnimation) popoverContent.innerHTML = ""; //remove infinite spinner animation when popup not shown
		pressedKeys = []; //window blur release keys
		//console.log("currentTitelHover: " + currentTitelHover)
		//console.groupEnd("hidePopOver")
	}
	function showPopOver() {
		// popover.style.display = "flex";
		//popover.style.height = "100%";
		// popover.style.width = "100%";
		//popover.style.visibility = "visible";
		//popover.style.opacity="1";
		popover.classList.remove("hidePopover");
		arrowContainer.classList.remove("hidePopover");
		popoverVisible = true;
	}
	function hideOnMouseLeave() {
		//if (!e.target.matches(concatSelector())) return;
		//popover.hide();
		hidePopOver();
	}

	/*
	 * get links into ALLSERIENODES and convert this nodearray to array
	 *
	 */
	//renamed targetNodeArray -> arrayTargetNode to remove compatibility setting in tampermonkey () misdetected? (targetNodeArray.foreach, targetNodeArray.map, targetNodeArray.push)
	function updateSerieNodes(
		arrayTargetNode = [],
		individualLinksToTest,
		forceReload = false,
		external = false
	) {
		const DEBUG = false;
		if (arrayTargetNode && arrayTargetNode.length > 0) {
			arrayTargetNode.forEach(function (selector) {
				if (
					eventListenerStyle === undefined ||
					eventListenerStyle === null ||
					eventListenerStyle == 0
				) {
					selector.removeEventListener("mouseleave", hideOnMouseLeave);
					//selector.removeEventListener("mouseenter", mouseEnterPopup);
				}
			});
		}
		//let allSeriesLinksTest = document.querySelectorAll('a[href*="mangaupdates.com/series.html"]');
		//console.log('allSeriesLinksTest',allSeriesLinksTest)
		let serieLinkNodes = document.querySelectorAll(
			':not(.digg_pagination) > a[href*="' + individualLinksToTest + '"]' //not(.digg_pagination) > fix to block linking from pagination
		);

		DEBUG && console.log("serieLinkNodes", serieLinkNodes);
		serieLinkNodes = Array.from(serieLinkNodes);
		let prunedSerieLinkNodes = [];
		if (serieLinkNodes && serieLinkNodes.length > 0) {
			//console.log(serieLinkNodes);
			serieLinkNodes.map(function (el) {
				//console.log(el)
				const elementUrl = el.href;

				//#region if has serieRegex check for  externalLink+serieRegex match
				let hasLinkMatch = false;
				if (external) {
					hasLinkMatch = externalLinkKeys.some((key) => {
						let completeKey = key;
						/*
              console.log("key: " + key);
              console.log(externalLinks[key]);
              console.log(
                'externalLinks["serieRegex"]: ' + externalLinks[key]["serieRegex"]
              );*/
						let indexOfDomain = elementUrl.indexOf(key);
						let characterAfterIndividualPage = elementUrl.slice(
							indexOfDomain + key.length
						); //get characters after targetAdress to parse ID

						if (indexOfDomain >= 0 && characterAfterIndividualPage.length > 0) {
							DEBUG &&
								console.log(
									"elementUrl: " +
										elementUrl +
										", key: " +
										key +
										", indexOfDomain on key " +
										indexOfDomain +
										",characterAfterIndividualPage: " +
										characterAfterIndividualPage
								);

							if (externalLinks[key].serieRegex !== undefined) {
								completeKey = externalLinks[key].serieRegex;
								//console.log("serieRegex regex: " + completeKey)
								/*  const hasMatch =  xhr.finalUrl.match(new RegExp(completeKey));
                  return hasMatch; //performance exclusion regex only used for a few links
                  */
							} else {
								completeKey = defaultSerieRegex;
								//console.log("default regex: " + completeKey)
							}

							let hasMatch = characterAfterIndividualPage.match(
								new RegExp(completeKey)
							);
							if (hasMatch === null || hasMatch.length == 0) {
								if (externalLinks[key].serieRegex2 !== undefined) {
									hasMatch = characterAfterIndividualPage.match(
										new RegExp(externalLinks[key].serieRegex2)
									);
								}
							}
							//console.log(hasMatch)
							return hasMatch !== null && hasMatch.length > 1;
							//return elementUrl.includes(key);
						}

						return false; //no further serieid available
					});
				} else {
					let indexOfDomain = elementUrl.indexOf(INDIVIDUALPAGETEST);
					let characterAfterIndividualPage = elementUrl.slice(
						indexOfDomain + INDIVIDUALPAGETEST.length
					); //get characters after targetAdress to parse ID
					if (characterAfterIndividualPage.length > 0) hasLinkMatch = true; //internal without serieRegex
				}
				//console.log("hasLinkMatch: " + hasLinkMatch);
				//#endregion
				if (hasLinkMatch) {
					prunedSerieLinkNodes.push(el);
					if (external) {
						el.setAttribute("coverDataExternalTarget", individualLinksToTest);
					}

					setLinkState(el, undefined, forceReload || preloadUrlRequests);
				}
				// console.log(elementUrl)
			});
		}
		arrayTargetNode.push(...prunedSerieLinkNodes);

		//console.log(ALLSERIENODES)
		/*
        console.log(ALLSERIENODES)

        const sliceItemCount = 100;
        if (ALLSERIENODES.length > sliceItemCount) {
            ALLSERIENODES = ALLSERIENODES.slice(0, sliceItemCount);
        }
        console.log(ALLSERIENODES)
        */
	}
	function switchShowIconNextToLink() {
		showIconNextToLink = !showIconNextToLink;
		GM_setValue("showIconNextToLink", showIconNextToLink);
		preloadCoverData();
		updateCurrentPopupContent();
	}
	function switchDetailsAndUpdatePopup() {
		const DEBUG = false;

		DEBUG && console.group("switchDetailsAndUpdatePopup");
		changeToNewDetailStyle();
		//console.log(currentCoverData)
		DEBUG && console.log("switchDetails refreshPopup");

		updateCurrentPopupContent();

		console.groupEnd("switchDetails");
	}
	function switchTagsDescriptionAndUpdatePopup() {
		const DEBUG = false;
		if (showDetails) {
			showDescription = !showDescription;
			//console.log("switch showDetails to : " + showDetails)
			GM_setValue("showDescription", showDescription);

			updateCurrentPopupContent();
		}
	}
	function switchShowReadingListIconAndTitle() {
		useReadingListIconAndTitle = !useReadingListIconAndTitle;
		GM_setValue("useReadingListIconAndTitle", useReadingListIconAndTitle);
		updateCurrentPopupContent();
	}
	function updateCurrentPopupContent() {
		const DEBUG = false;
		if (currentCoverData !== undefined) {
			DEBUG && console.log(currentCoverData);
			loadImageFromBrowser({
				coverData: currentCoverData,
				e: currentPopupEvent,
				serieTitle: currentTitelHover,
				hoveredTitleLink: currentTitelHover,
			});
		} else if (currentTitelHover !== undefined) {
			//currentCoverData not yet set
			showPopupLoadingSpinner(
				currentTitelHover,
				currentTitelHover,
				currentPopupEvent
			);
		}
	}
	function changeToNewDetailStyle(toggleDetails = true) {
		if (toggleDetails) showDetails = !showDetails;
		//console.log("switch showDetails to : " + showDetails)
		GM_setValue("showDetails", showDetails);
		//localStorage.setItem("showDetails", showDetails);
		//https://developer.mozilla.org/en-US/docs/Web/CSS/min() not compatible with firefox 56
		//setPopoverWidth();
		//console.log("changeToNewDetailStyle - setPopoverHeight();");
		//setPopoverHeight();
		updatePopoverSize();
	}

	function openMousePopup(
		forceReload,
		target, //Href
		currentTitelHover,
		e,
		external,
		targetPage
	) {
		ajaxLoadImageUrlAndShowPopup(
			forceReload,
			target, //Href
			currentTitelHover,
			e,
			external,
			targetPage
		);
	}

	//#region eventListener
	function mouseEnterPopup(e, forceReload = false) {
		//if (!e.target.matches(concatSelector())) return;
		const DEBUG = false;
		DEBUG && console.group("mouseEnterPopup");
		//let element = undefined;//$(this);
		//let nativElement = e.target//this;
		//console.log(this)
		//console.log(e)
		if (e !== undefined) {
			e.preventDefault();
			const target = e.target;
			let Href = target.href; // element.attr('href');
			let coverDataExternalTarget = target.getAttribute(
				"coverDataExternalTarget"
			);
			//console.log("coverDataExternalTarget: " + coverDataExternalTarget);
			if (Href && coverDataExternalTarget === undefined) {
				//TODO double check if needed
				//no preloadUrlRequests happend
				/*
          const externalLinkKeys = Object.keys(externalLinks);
          const isExternal = externalLinkKeys.some((key) => Href.includes(key));

          if (isExternal) {
            target.setAttribute("coverDataExternalTarget", key);
            coverDataExternalTarget = key;
          } else target.setAttribute("coverDataExternalTarget", null);
            */
			}
			DEBUG &&
				console.log(
					"Href: " + Href + ", INDIVIDUALPAGETEST: " + INDIVIDUALPAGETEST
				);

			if (
				Href &&
				(Href.includes(INDIVIDUALPAGETEST) ||
					(coverDataExternalTarget !== undefined &&
						coverDataExternalTarget !== null &&
						Href.includes(coverDataExternalTarget)))
			) {
				//only trigger for links that point to serie pages
				//console.log(this)
				//console.log(this.text) //shortTitle
				//console.log(this.title) //LongTitle
				let shortSerieTitle = target.text; //element.text(); //get linkname
				//console.log(this)
				//console.log(shortSerieTitle)
				const dataTitle = target.getAttribute("datatitle");
				const linkTitle = target.getAttribute("title");
				//console.log("linkTitle: " + linkTitle)
				const hasDataTitle =
					dataTitle === null ||
					dataTitle == "null" ||
					dataTitle === undefined ||
					!dataTitle;
				//move native title to custom data attribute. Suppress nativ title popup
				if (linkTitle !== null && hasDataTitle) {
					target.setAttribute("datatitle", linkTitle);
					target.removeAttribute("title");
				}

				let serieTitle = target.getAttribute("datatitle"); //element.attr('datatitle'); //try to get nativ title if available from datatitle
				//console.log(serieTitle)
				if (
					serieTitle === null || //has no set nativ long title -> use (available shortend) linkname
					serieTitle == "null" ||
					PREDIFINEDNATIVTITLEARRAY.some((nativTitle) =>
						serieTitle.includes(nativTitle)
					)
				) {
					//catch on individual serie page nativ title begins with "Recommended by" x people -> use linkname
					serieTitle = shortSerieTitle;
				}
				if (
					serieTitle === undefined ||
					serieTitle === null ||
					serieTitle == ""
				) {
					//image link: example link which content is only the cover image https://www.mangaupdates.com/series.html?letter=A
					serieTitle = Href;
				}

				currentTitelHover = serieTitle; //mark which titel is currently hovered
				const wasOverDifferentLink = currentTitelHover != previousTitelHover;
				if (wasOverDifferentLink) {
					resetAutoScroll();
					autoScrollCoverData = true;
				}

				if (currentTitelHover != undefined) {
					previousTitelHover = currentTitelHover;
				}
				currentPopupEvent = e;
				//console.log(serieTitle)
				//console.log(Href)

				//console.log(currentCoverData)
				//console.log("currentTitelHover: " + currentTitelHover)
				const external =
					coverDataExternalTarget !== undefined &&
					coverDataExternalTarget !== null;
				let targetPage;
				//console.log("external: " + external);
				//console.log("coverDataExternalTarget: " + coverDataExternalTarget);
				if (external) targetPage = coverDataExternalTarget;
				//console.log("targetPage: " + targetPage);
				const mainSerieHref = getLinkToSeriePage(Href, targetPage);
				const internalElementID = getElementID(Href, targetPage);
				let hasCoverData;
				DEBUG && console.log("mainSerieHref", mainSerieHref);
				DEBUG && console.log("internalElementID", internalElementID);
				if (internalElementID) {
					hasCoverData = GM_getCachedValue(internalElementID);
				} else {
					hasCoverData = GM_getCachedValue(mainSerieHref);
				}

				if (!hasCoverData || forceReload) {
					setLinkStateOfSameLinks(
						target,
						linkIconEnum.popupLoading,
						forceReload
					);
				} else {
					if (forceReload) {
						setLinkStateOfSameLinks(target, undefined, forceReload);
					}
				}

				//clearTimeout(currentHoverTimeout)
				currentMousePopupData = { e, forceReload };
				currentHoverTimeout = setTimeout(
					openMousePopup(
						forceReload,
						target, //Href
						currentTitelHover,
						e,
						external,
						targetPage
					),
					hoverdelay
				);
			}
		}
		DEBUG && console.groupEnd("mouseEnterPopup");
	}
	function forceReload(forceReload = true) {
		mouseEnterPopup(currentPopupEvent, forceReload);
	}

	function updatePopoverSize() {
		//console.log("updatePopoverSize - setPopoverHeight();");
		//setPopoverHeight(); //happens after updateCurrentPopupContent update
		setPopoverWidth();

		if (showSmaller) {
			mediumTextStyle = "small_mediumText";
			smallTextStyle = "small_smallText";
			popoverTitle.classList.add("defaultTitleStyleSmall");
		} else {
			popoverTitle.classList.remove("defaultTitleStyleSmall");
			mediumTextStyle = "mediumText";
			smallTextStyle = "smallText";
		}

		updateCurrentPopupContent();
	}

	function showAlternativeNamesList() {
		if (!showAlternativeNames || showAlternativeNames == "") {
			if (currentCoverData !== undefined) updateCurrentPopupContent();
		} else {
			if (
				currentCoverData.alternativeNames &&
				currentCoverData.alternativeNames != ""
			) {
				let alternativeNames = "";
				alternativeNames = currentCoverData.alternativeNames;

				popoverContent.innerHTML =
					'<div id="coverPreviewContentAutoScroll" class="popoverContent ' +
					STYLESHEETHIJACKFORBACKGROUND +
					" " +
					mediumTextStyle +
					'" style="text-align:start !important; width:100%;"><b>Alternative Titles:</b><br />' +
					alternativeNames +
					"</div>";
				if (currentCoverData !== undefined) popupPos(currentPopupEvent);
				autoScrollData("coverPreviewContentAutoScroll");
			}
		}
	}

	function showHotkeyList() {
		if (!showHotkeys) {
			if (currentCoverData !== undefined) {
				loadImageFromBrowser({
					coverData: currentCoverData,
					e: currentPopupEvent,
					serieTitle: currentTitelHover,
					hoveredTitleLink: currentTitelHover,
				});
			}
		} else {
			popoverContent.innerHTML =
				'<div id="coverPreviewContentAutoScroll" class="popoverContent ' +
				STYLESHEETHIJACKFORBACKGROUND +
				" " +
				mediumTextStyle +
				'" style="text-align:start !important">[Key 1]: Switch detailed and simple popup<br />' +
				`[Key 2]: Switch between description and tags<br />
          [Key 3]: Switch between small and big popup style<br />
          [Key 4]: Pause/unpause autoscrolling coverData<br/>
          [Key 5]: Reload coverdata of hovered link<br />
          [Key 6]: Reload all links of current Page<br/>
          [Key 9]: Clear all cover data info<br />
          [Key A]: If available will show <b>a</b>lternative titles during holding of key A<br />
          [Key I]: Toggle coverPreview pre/loading state <b>i</b>con displaying next to link<br />
          [Key P]: Switch displaying of readinglist icon of <b>p</b>ersonal lists<br />
          [Key H]: Show this <b>h</b>otkey list during holding of key H<br />
          </div>`;

			if (currentCoverData !== undefined) popupPos(currentPopupEvent);
			autoScrollData("coverPreviewContentAutoScroll");
		}
	}

	function reactToKeyPressWhenPopupVisible(event) {
		//console.log(event);
		//console.log(currentTitelHover)
		const key = event.key;
		if (popoverVisible) {
			if (!pressedKeys.includes(key)) {
				//console.log(event);
				pressedKeys.push(key);
				switch (key) {
					case "1":
						switchDetailsAndUpdatePopup();
						break;
					case "5":
						forceReload();
						break;
					case "6":
						{
							const _forceReload = true;
							preloadCoverData(_forceReload);
						}
						break;
					case "9":
						resetDatabase();
						preloadCoverData();
						forceReload();
						break;
					case "2":
						switchTagsDescriptionAndUpdatePopup();

						resetAutoScroll();
						autoScrollCoverData = true;
						autoScrollData();
						autoScrollData("coverPreviewContentAutoScroll");
						break;
					case "3":
						showSmaller = !showSmaller;
						GM_setValue("showSmaller", showSmaller);
						updatePopoverSize();
						hasChangedStyle = true;
						break;
					case "4":
						autoScrollCoverData = !autoScrollCoverData;
						if (autoScrollCoverData) {
							autoScrollData();
							autoScrollData("coverPreviewContentAutoScroll");
						}
						break;
					case "h":
						showHotkeys = true;
						showHotkeyList();
						break;
					case "a":
						showAlternativeNames = true;
						showAlternativeNamesList();
						break;
					case "p":
						switchShowReadingListIconAndTitle();
						updateCurrentPopupContent();
						//forceReload();
						break;
					case "i":
						switchShowIconNextToLink();
						break;
				}
			}
		}
	}
	function releaseKey(event) {
		const key = event.key;
		//console.log(pressedKeys)
		pressedKeys.splice(pressedKeys.indexOf(key), 1);
		if (event.key == "h") {
			showHotkeys = false;
			showHotkeyList();
		}
		if (event.key == "a") {
			showAlternativeNames = false;
			showAlternativeNamesList();
		}
		//console.log(pressedKeys)
	}

	function prepareEventListener() {
		window.addEventListener("blur", hidePopOver);
		window.addEventListener("keypress", reactToKeyPressWhenPopupVisible); //keypress gets repeated during keydown
		window.addEventListener("keyup", releaseKey);

		if (
			targetContainerIDArrayToObserve &&
			targetContainerIDArrayToObserve.length > 0
		) {
			for (let i = 0; i < targetContainerIDArrayToObserve.length; i++) {
				let targetNodeList = document.getElementById(
					targetContainerIDArrayToObserve[i]
				); //forum.novelupdates.com quickedit change. ajax content change
				if (targetNodeList) {
					console.log("targetNodeList ID", targetNodeList);
					observer.observe(targetNodeList, config);
				}
			}
		}

		let themeSelector = document.getElementById("wi_themes");
		if (themeSelector)
			themeSelector.addEventListener("change", updateArrowColor);

		window.onunload = function () {
			window.removeEventListener("blur", hidePopOver);
			window.removeEventListener("keypress", reactToKeyPressWhenPopupVisible);
			window.addEventListener("keyup", releaseKey);
			popover.removeEventListener("mouseleave", hideOnMouseLeave);
			if (themeSelector)
				themeSelector.removeEventListener("change", updateArrowColor);
			//possible memoryleaks?
			ALLSERIENODES = [];
			updateSerieNodes(ALLSERIENODES, INDIVIDUALPAGETEST);
			observer.disconnect();
		};
		if (eventListenerStyle == 1) {
			window.addEventListener("mousemove", throttledGetHoveredItem);
		}
	}

	//assumption that a single eventlistener is more performant than dozens of mouseEnter/MouseLeave events
	//https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/#web-performance
	//https://davidwalsh.name/event-delegate
	//https://web.archive.org/web/20170121035049/http://jsperf.com/click-perf
	//https://stackoverflow.com/questions/29836326/is-using-a-universal-document-addeventlistenerclick-f-listener-slower-or-wea
	/*
    This is the proper pattern for creating event listeners that will work for dynamically-added elements. It's essentially the same approach as used by jQuery's event delegation methods (e.g. .on).
  */

	function getHoveredItem(e) {
		if (eventListenerStyle == 1) {
			if (
				e.target &&
				e.target != lastTarget &&
				e.target.nodeName == "A" &&
				e.target.href &&
				e.target.href.includes(INDIVIDUALPAGETEST)
			) {
				lastTarget = e.target;
				//console.group("target A")
				//console.log(e.target.text)
				//console.log(e)

				mouseEnterPopup(e);
				//console.groupEnd();
			} else {
				if (e.target.nodeName != "A") {
					lastTarget = undefined;
					hideOnMouseLeave();
				}
			}
		}
	}

	document.addEventListener("DOMContentLoaded", main());

	//#endregion

	//#region mangaDex api
	function getMangaDexNamedTag(tags, type = "Genre") {
		const DEBUG = false;
		DEBUG && console.group("getMangaDex" + type);
		let namedTags = "";
		DEBUG && console.log(mangaDexTAGS);
		DEBUG && console.log(tags);

		DEBUG && console.log("tags.length: " + tags.length);
		if (tags && tags.length > 0) {
			for (let i = 0; i < tags.length; i++) {
				let searchTag = tags[i];
				//console.log(searchTag)
				const tag = mangaDexTAGS[searchTag];
				if (tag.group == type) {
					//console.log(tag)
					namedTags += " " + tag.name;
				}
			}
		}

		DEBUG && console.groupEnd();
		DEBUG && console.log(namedTags);
		return namedTags;
	}
	async function requestDataFromAPIpostCall(
		apiPoint,
		postData,
		hasDataContainer = undefined
	) {
		const DEBUG = false;
		let PromiseResult = new Promise(async function (resolve, reject) {
			function onLoad(xhr) {
				DEBUG && console.log(xhr);
				//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status Successful responses (200–299)
				switch (true) {
					case xhr.status == 304:
						console.log("xhr.status == 304: getting data from browser cache");
					//fall through to status==200 ok
					case xhr.status >= 200 && xhr.status < 399:
						{
							DEBUG &&
								console.group("requestDataFromAPIpostCall onLoad: " + apiPoint);
							DEBUG && console.log(xhr);
							let tempJSON = JSON.parse(xhr.responseText);
							let apiData;
							DEBUG && console.log(tempJSON);
							if ((tempJSON.status = "OK")) {
								if (hasDataContainer) apiData = tempJSON[hasDataContainer];
								else apiData = tempJSON;
							}
							DEBUG && console.log(apiData);
							return resolve(apiData);
						}
						break;
					default:
						/*
              console.group("error in getCoverDataFromUrl");
              console.log(xhr);
              console.groupEnd();*/
						return reject(rejectErrorStatusMessage(xhr));
				}
			}
			function onError(error) {
				console.log(error);
				const err = new Error(
					"GM_xmlhttpRequest could not load " +
						apiPoint +
						"; script is not compatible or url does not exists."
				);
				console.log(err);
				return reject(err);
			}

			GM_xmlhttpRequest({
				method: "POST",
				data: JSON.stringify(postData),
				url: apiPoint,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				dataType: "json",
				contentType: "application/json",
				overrideMimeType: "application/json",
				onload: onLoad,
				onerror: onError,
			});

			return undefined; //reject("status error")
		});
		PromiseResult = await PromiseResult;

		return PromiseResult;
	}
	async function checkImageServerState(url) {
		const DEBUG = false;
		let PromiseResult = new Promise(async function (resolve, reject) {
			function onLoad(xhr) {
				DEBUG && console.log("checkImageServerState");
				DEBUG && console.log(xhr);
				DEBUG && console.log("xhr.status: " + xhr.status);
				switch (true) {
					case xhr.status == 304:
						console.log(
							"xhr.status == 304: getting data from browser cache for " +
								xhr.finalUrl
						);
					case xhr.status >= 200 && xhr.status < 399: {
						DEBUG && console.log("no error");
						return resolve(true);
					}
					default:
						/*
              console.group("error in getCoverDataFromUrl");
              console.log(xhr);
              console.groupEnd();*/
						console.log(rejectErrorStatusMessage(xhr));
						return resolve("imageurl not loadable: " + url);
				}
			}
			function onError(error) {
				console.log(error);
				const err = new Error(
					"checkImageServerState() could not load " +
						url +
						"; script is not compatible or url does not exists."
				);
				console.log(err);
				return reject(
					"could not load " +
						url +
						"; script is not compatible or url does not exists."
				);
			}
			GM_xmlhttpRequest({
				method: "HEAD",
				url: url,
				onload: onLoad,
				onerror: onError,
				// onreadystatechange,
				// onprogress
			});
			return "error or skipped processing GM_xmlhttpRequest() in checkImageServerState()"; //reject("status error")
		});
		//  if(PromiseResult!=undefined)
		{
			PromiseResult = await PromiseResult;
			return PromiseResult;
		}
		//  return "checkImageServerState function error";
	}
	async function getDataFromAPI(
		apiPoint,
		{ hasDataContainer = undefined, responsetype = "json" } = {}
	) {
		const DEBUG = false;
		DEBUG && console.log("responsetype", responsetype);
		let PromiseResult = new Promise(async function (resolve, reject) {
			function onLoad(xhr) {
				DEBUG && console.log("xhr", xhr);
				//console.log(xhr.responseHeaders)
				DEBUG && console.log("xhr.status: " + xhr.status);
				//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status Successful responses (200–299)

				switch (true) {
					case xhr.status == 304:
						DEBUG &&
							console.log(
								"xhr.status == 304: getting data from browser cache for " +
									xhr.finalUrl
							);
					//fall through to status==200 ok
					case xhr.status >= 200 && xhr.status < 399: {
						DEBUG && console.group("getDataFromAPI onLoad: " + apiPoint);
						//DEBUG && console.log(xhr);
						let apiData;
						DEBUG && console.log("responsetype", responsetype);
						switch (responsetype) {
							case "json":
								{
									let tempJSON = JSON.parse(xhr.responseText);
									DEBUG && console.log("tempJSON", tempJSON);
									if ((tempJSON.status = "OK")) {
										if (hasDataContainer) apiData = tempJSON[hasDataContainer];
										else apiData = tempJSON;
									}
								}
								break;
							case "Document":
								{
									const domDocument = xhr.response;
									//tampermonkey 4.12.6130 seems to deprecate some old api? document response is now undefined
									//only responseXML would be usable
									apiData = domDocument;
								}
								break;
							case "text":
								{
									const domText = xhr.responseText;
									let parser = new DOMParser();
									const domDocument = parser.parseFromString(
										domText,
										"text/html"
									);
									apiData = domDocument;
								}
								break;
							default:
								const domDocument = xhr.responseText;
								apiData = domDocument;
								break;
						}

						DEBUG && console.log("apiData", apiData);
						if (apiData !== undefined) return resolve(apiData);
						else
							return reject(
								"no apiData error for responsetype: " + responsetype
							);
					}

					default:
						/*
              console.group("error in getCoverDataFromUrl");
              console.log(xhr);
              console.groupEnd();*/
						return reject(rejectErrorStatusMessage(xhr));
				}
			}
			function onError(error) {
				console.log(error);
				const err = new Error(
					"GM_xmlhttpRequest could not load " +
						apiPoint +
						"; script is not compatible or url does not exists."
				);
				console.log(err);
				return reject(err);
			}
			function onreadystatechange(stateChangeResponse) {
				console.log(stateChangeResponse);
			}
			function onprogress(progressResponse) {
				//console.log(progressResponse)
			}

			GM_xmlhttpRequest({
				method: "GET",
				//overrideMimeType:'text/html;',
				responseType: responsetype,
				url: apiPoint,
				onload: onLoad,
				onerror: onError,
				// onreadystatechange,
				// onprogress
			});

			return undefined; //reject("status error")
		});
		PromiseResult = await PromiseResult;

		return PromiseResult;
	}

	async function getCoverDataFromMangaDex(id) {
		const DEBUG = false;
		if (id) {
			if (mangaDexTAGS === undefined || mangaDexTAGS === null) {
				//only needed one time per session
				mangaDexTAGS = getDataFromAPI("https://mangadex.org/api/v2/tag", {
					hasDataContainer: "data",
				}); //getAllMangaDexTags
			}
			DEBUG && console.log(mangaDexTAGS);

			let mangaDexData = getDataFromAPI(
				"https://mangadex.org/api/v2/manga/" + id,
				{ hasDataContainer: "data" }
			);
			DEBUG && console.log(mangaDexData);

			let serieChapters = getDataFromAPI(
				"https://mangadex.org/api/v2/manga/" + id + "/chapters",
				{ hasDataContainer: "data" }
			); //await getMangaDexChapterCount(id);

			DEBUG && console.log(serieChapters);
			[mangaDexTAGS, mangaDexData, serieChapters] = await Promise.all([
				mangaDexTAGS,
				mangaDexData,
				serieChapters,
			]);
			let serieGenre = getMangaDexNamedTag(mangaDexData.tags, "Genre");
			let serieTags = getMangaDexNamedTag(mangaDexData.tags, "Theme");
			DEBUG && console.log(mangaDexTAGS);
			DEBUG && console.log(serieChapters);
			if (serieChapters && serieChapters.chapters) {
				serieChapters = serieChapters.chapters.length;
			}
			DEBUG && console.log("serieChapters: " + serieChapters);
			let status;
			DEBUG && console.log(mangaDexData);
			switch (mangaDexData.publication.status) {
				case 1:
					status = "Ongoing";
					break;
				case 2:
					status = "Completed";
					break;
			}

			let cData = Object.assign({}, emptyCoverData);
			cData.url = mangaDexData.mainCover;
			cData.title = mangaDexData.title;
			cData.alternativeNames = mangaDexData.altTitles.join("<br /> ");
			cData.votes = mangaDexData.rating.bayesian.toString();
			cData.status = status;
			cData.chapters = serieChapters.toString();
			cData.genre = serieGenre;
			cData.showTags = serieTags;
			cData.description = mangaDexData.description;
			return cData;
		}
		return undefined;
	}
	//#endregion mangadex api
	//#region http://api.tvmaze.com/
	async function getCoverDataFromTVmaze(id) {
		const DEBUG = false;
		if (id) {
			let apiData = getDataFromAPI("http://api.tvmaze.com/shows/" + id);
			DEBUG && console.log(apiData);
			let serieAlternativeNames = getDataFromAPI(
				"http://api.tvmaze.com/shows/" + id + "/akas"
			);
			let episodes = getDataFromAPI(
				"http://api.tvmaze.com/shows/" + id + "/episodes"
			);
			[apiData, serieAlternativeNames, episodes] = await Promise.all([
				apiData,
				serieAlternativeNames,
				episodes,
			]);
			DEBUG && console.log(serieAlternativeNames);
			if (serieAlternativeNames !== undefined) {
				serieAlternativeNames = serieAlternativeNames
					.map((e) => e.name)
					.join("<br /> ");
			}
			///console.log(serieAlternativeNames);
			let serieEpisodeCount;
			if (episodes && episodes.length) {
				serieEpisodeCount = episodes.length.toString();
			}
			let targetImageUrl;
			if (apiData.image.medium) targetImageUrl = apiData.image.medium;
			else targetImageUrl = apiData.image.original;
			let serieRating;
			if (apiData.rating && apiData.rating.average) {
				serieRating = apiData.rating.average.toString();
			}
			/*
        let cData = {
          url: targetImageUrl,
          title: apiData.name,
          alternativeNames: serieAlternativeNames,
          votes: serieRating,
          //status: apiData.status, //status property value is overwritten by GM_xmlhttpRequest
          chapters: serieEpisodeCount,
          genre: apiData.genres,
          description: apiData.summary,
        };
        */
			let cData = Object.assign({}, emptyCoverData);
			cData.url = targetImageUrl;
			cData.title = apiData.name;
			cData.alternativeNames = serieAlternativeNames;
			cData.votes = serieRating;
			//cData.status = status; //status property value is overwritten by GM_xmlhttpRequest
			cData.chapters = serieEpisodeCount;
			cData.genre = apiData.genres;
			//cData.showTags = serieTags;
			cData.description = apiData.summary;
			DEBUG && console.log(cData);
			return cData;
		}
		return undefined;
	}
	//#endregion http://api.tvmaze.com/
	//#region https://www.wlnupdates.com/api-docs
	async function getCoverDataFromWLNupdates(linkID) {
		const DEBUG = false;
		if (linkID) {
			let apiData = await requestDataFromAPIpostCall(
				"https://www.wlnupdates.com/api",
				{ id: linkID, mode: "get-series-id" },
				"data"
			);
			DEBUG && console.log(apiData);
			let imagelink;
			if (apiData.covers.length > 0) imagelink = apiData.covers[0].url;

			let serieTitle = apiData.title;
			let serieAlternativeNames = apiData.alternatenames.join("<br />");
			let serieVotes;
			let serieStatus;
			if (apiData.ratin_count > 0) serieVotes = apiData.rating.avg;
			if (apiData.most_recent) {
				serieStatus = "most_recent: " + apiData.most_recent;
			}
			//console.log(apiData.releases);
			//console.log("apiData.releases: " + apiData.releases.length);

			let serieChapters;
			if (apiData && apiData.releases && apiData.releases.length) {
				serieChapters = apiData.releases.length;
			}
			if (apiData.type) serieChapters += " (" + apiData.type + ")";
			let serieGenre = apiData.genres.map((e) => e.genre).join(", ");
			let serieShowtags = apiData.tags.map((e) => e.tag).join(", ");
			let serieDescription = apiData.description;

			let cData = Object.assign({}, emptyCoverData);
			cData.url = imagelink;
			cData.title = serieTitle;
			cData.alternativeNames = serieAlternativeNames;
			cData.votes = serieVotes;
			cData.status = serieStatus;
			cData.chapters = serieChapters;
			cData.genre = serieGenre;
			cData.showTags = serieShowtags;
			cData.description = serieDescription;
			DEBUG && console.log(cData);
			return cData;
		}

		return undefined;
	}
	//#endregion https://www.wlnupdates.com/api-docs
	//#region getCoverData from parsing document of url
	async function getCoverDataFromParsingTargetUrl(
		elementUrl,
		targetPage,
		isExternal = false
	) {
		const DEBUG = false;
		if (targetPage) {
			DEBUG &&
				console.log(
					"getCoverDataFromParsingTargetUrl - elementUrl: " + elementUrl
				);
			let domDocument = await getDataFromAPI(elementUrl, {
				responsetype: "text",
			});
			DEBUG && console.log(domDocument);
			//getData from parsed site by query selectors

			let temp;
			let imagelink;
			let containerNumber = 0;
			let serieTitle;
			let serieAlternativeNames;
			let serieVotes;
			let serieStatus;
			let serieChapters;
			let serieGenre;
			let serieShowtags;
			let serieDescription;
			let serieReadingListIcon, serieReadingListIconText, serieReadingListTitle;
			//#region general selectors for internal and external sites
			DEBUG && console.group("internal/external link selectors");
			DEBUG && console.log("targetPage: " + targetPage);
			//console.log(domDocument);
			//external links

			//console.log(targetPage);
			temp = domDocument.querySelectorAll(targetPage.IMAGELINKCONTAINERS);
			DEBUG && console.log(temp);
			if (targetPage.CONTAINERNUMBER) {
				containerNumber = targetPage.CONTAINERNUMBER;
			}

			imagelink = temp[containerNumber];
			//console.log(imagelink)
			serieTitle = domDocument.querySelector(targetPage.seriePageTitle);
			serieAlternativeNames = domDocument.querySelector(
				targetPage.serieAlternativeNames
			);
			serieVotes = domDocument.querySelector(targetPage.seriePageVotes);
			serieStatus = domDocument.querySelector(targetPage.seriePageStatus);
			serieChapters = domDocument.querySelector(targetPage.seriePageChapters);
			serieGenre = domDocument.querySelector(targetPage.seriePageGenre);
			serieShowtags = domDocument.querySelector(targetPage.seriePageTags);

			serieDescription = domDocument.querySelector(
				targetPage.seriePageDescription
			);

			serieTitle = tryToGetTextContent(
				serieTitle,
				targetPage.seriePageTitle,
				"seriePageTitle"
			);
			serieAlternativeNames = tryToGetTextContent(
				serieAlternativeNames,
				targetPage.serieAlternativeNames,
				"serieAlternativeNames"
			);
			//console.log(targetPage.seriePageVotes)
			serieVotes = tryToGetTextContent(
				serieVotes,
				targetPage.seriePageVotes,
				"seriePageVotes"
			);
			//console.log(serieVotes)
			serieStatus = tryToGetTextContent(
				serieStatus,
				targetPage.seriePageStatus,
				"seriePageStatus"
			);
			serieChapters = tryToGetTextContent(
				serieChapters,
				targetPage.seriePageChapters,
				"seriePageChapters"
			);
			//console.log(targetPage.seriePageGenre)
			serieGenre = tryToGetTextContent(
				serieGenre,
				targetPage.seriePageGenre,
				"seriePageGenre"
			);
			//console.log(serieGenre)
			serieShowtags = tryToGetTextContent(
				serieShowtags,
				targetPage.seriePageTags,
				"seriePageTags"
			);
			serieDescription = tryToGetTextContent(
				serieDescription,
				targetPage.seriePageDescription,
				"seriePageDescription"
			);
			DEBUG && console.groupEnd("internal/external link selectors");
			//#endregion general selectors for internal and external sites
			//#region internal extra selectors
			DEBUG && console.group("internal extra selectors");
			if (!isExternal) {
				//hasInternalTargetPage- > targetPage

				//console.log(serieReadingListTitle)
				if (useReadingListIconAndTitle) {
					if (targetPage.serieReadingListIcon) {
						DEBUG &&
							console.log(
								'try to query: targetPage.serieReadingListIcon + " img"',
								targetPage.serieReadingListIcon + " img"
							);
						serieReadingListIcon = domDocument.querySelector(
							targetPage.serieReadingListIcon + " img"
						);
					}
					if (targetPage.serieReadingListTitle) {
						serieReadingListTitle = domDocument.querySelector(
							targetPage.serieReadingListTitle
						);
					}
				}
				//console.log("hasInternalTargetPage.serieReadingListTitle: " + hasInternalTargetPage.serieReadingListTitle)

				//console.log(targetPage.serieReadingListTitle)
				//console.log(serieReadingListTitle)
				serieReadingListTitle = tryToGetTextContent(
					serieReadingListTitle,
					targetPage.serieReadingListTitle,
					"serieReadingListTitle"
				);
				if (serieReadingListTitle == "Add series to...") {
					serieReadingListTitle = undefined;
				}
				//console.log(serieReadingListIcon)
				if (
					serieReadingListIcon !== undefined &&
					serieReadingListIcon !== null &&
					serieReadingListIcon.tagName == "IMG"
				) {
					serieReadingListIcon = serieReadingListIcon.getAttribute("src");
					//console.log("serieReadingListIcon: " + serieReadingListIcon)
				}
				DEBUG && console.log("serieReadingListIcon", serieReadingListIcon);
				DEBUG &&
					console.group("try to get text/emoji since no image icon found");
				if (serieReadingListIcon === null) {
					DEBUG &&
						console.log(
							"targetPage.serieReadingListIcon",
							targetPage.serieReadingListIcon
						);
					DEBUG && console.log("domDocument", domDocument);
					serieReadingListIconText = domDocument.querySelector(
						targetPage.serieReadingListIcon
					);
					DEBUG &&
						console.log("serieReadingListIconText", serieReadingListIconText);
					DEBUG &&
						console.log(
							"targetPage.serieReadingListIcon",
							targetPage.serieReadingListIcon
						);
					if (serieReadingListIconText) {
						serieReadingListIconText = tryToGetTextContent(
							serieReadingListIconText,
							targetPage.serieReadingListIcon,
							"serieReadingListIconText"
						);
					}
					DEBUG &&
						console.log(
							"serieReadingListIconText after tryToGetTextContent",
							serieReadingListIconText
						);
				}
				DEBUG && console.groupEnd();
				if (
					serieReadingListIcon === null ||
					serieReadingListIcon ==
						"//www.novelupdates.com/wp-content/themes/ndupdates-child/js/selectico/addme.png"
				) {
					serieReadingListIcon = undefined;
				}
				//console.log("serieReadingListTitle: " + serieReadingListTitle)
			}
			DEBUG && console.groupEnd("internal extra selectors");
			//#endregion internal extra selectors

			let cData = Object.assign({}, emptyCoverData);
			cData.url = imagelink;
			cData.title = serieTitle;
			cData.alternativeNames = serieAlternativeNames;
			cData.description = serieDescription;
			cData.status = serieStatus;
			cData.chapters = serieChapters;
			cData.genre = serieGenre;
			cData.showTags = serieShowtags;
			cData.votes = serieVotes;
			cData.readingListIcon = serieReadingListIcon;
			cData.readingListIconText = serieReadingListIconText;
			cData.readingListTitle = serieReadingListTitle;
			DEBUG && console.log(cData);
			return cData;
		}
		return undefined;
	}
	//#endregion getCoverData from parsing document of url

	function main() {
		const DEBUG = false;
		if (
			internalLink[INDIVIDUALPAGETEST].rateLimitTimeInSeconds &&
			internalLink[INDIVIDUALPAGETEST].rateLimitCount
		) {
			rateLimitDelay =
				(internalLink[INDIVIDUALPAGETEST].rateLimitTimeInSeconds * 1000) /
				internalLink[INDIVIDUALPAGETEST].rateLimitCount;
		}
		console.log("final rateLimitDelay", rateLimitDelay);
		//console.log(window.location)
		currentOpenedUrl = window.location.href;
		//console.log("preloadUrlRequests: " + preloadUrlRequests)
		for (let i = 0; i < deactivatePreloadUrlRequestOnUrls.length; i++) {
			//no need to check on each link hover
			if (deactivatePreloadUrlRequestOnUrls[i] == currentOpenedUrl) {
				preloadUrlRequests = false;
			}
		}
		//console.log("preloadUrlRequests: " + preloadUrlRequests)
		DEBUG && console.log("started main function of coverPreview");
		//#region get greasemonkey settings for popup
		DEBUG && console.log("before starting checkDataVersion");
		checkDataVersion();
		showDetails = GM_getValue("showDetails");
		showDescription = GM_getValue("showDescription");
		showSmaller = GM_getValue("showSmaller");
		useReadingListIconAndTitle = GM_getValue("useReadingListIconAndTitle");
		showIconNextToLink = GM_getValue("showIconNextToLink");
		//deactivatePreloadUrlRequestOnUrls = GM_getValue("deactivatePreloadUrlRequestOnUrls");
		if (showDetails === undefined || showDetails == "undefined") {
			showDetails = false;
		}
		if (showDescription === undefined || showDescription == "undefined") {
			showDescription = false;
		}
		if (showSmaller === undefined || showSmaller == "undefined") {
			showSmaller = false;
		}
		if (
			useReadingListIconAndTitle === undefined ||
			useReadingListIconAndTitle == "undefined"
		) {
			useReadingListIconAndTitle = false;
		}
		if (showIconNextToLink === undefined || showIconNextToLink == "undefined") {
			showIconNextToLink = defaultshowIconNextToLink;
		}
		//#endregion

		DEBUG && console.log("before starting setStyleClasses");
		addStyles();
		setStyleClasses();
		DEBUG && console.log("before starting createPopover");
		createPopover();

		DEBUG && console.log("before starting hidePopOver");
		//#region preset needed for older browser

		//#endregion
		//hidePopOver();
		/*
      if (showSmaller) {
        //console.log("show smaller style");
        updatePopoverSize();
      }
      */
		//if(showDetails) showDetails = JSON.parse(showDetails);
		//showDetails = localStorage.getItem("showDetails") == "true";
		//console.log("localStorage state showDetails: " + showDetails)
		DEBUG && console.log("before starting changeToNewDetailStyle");
		changeToNewDetailStyle(false);

		DEBUG && console.log("before starting preloadCoverData");
		preloadCoverData();
		DEBUG && console.log("before starting prepareEventListener");
		prepareEventListener();
		DEBUG && console.log("finished main function of coverPreview");
	}
	//console.log("cover preview end");
})();
