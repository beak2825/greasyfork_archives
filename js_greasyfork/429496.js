// ==UserScript==
// @name         Better w8r (Nattie)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to get watch 8
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429496/Better%20w8r%20%28Nattie%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429496/Better%20w8r%20%28Nattie%29.meta.js
// ==/UserScript==

var watchPageLoaded = false;

var categoryLinks = {
	'Film & Animation':      '',
	'Autos & Vehicles':      '',
	'Music':                 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ',
	'Pets & Animals':        '',
	'Sports':                'https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw',
	'Travel & Events':       '',
	'Gaming':                'https://www.youtube.com/gaming',
	'People & Blogs':        '',
	'Comedy':                '',
	'Entertainment':         '',
	'News & Politics':       'https://www.youtube.com/channel/UCYfdidRxbB8Qhf0Nx7ioOYw',
	'Howto & Style':         'https://www.youtube.com/channel/UCtFRv9O2AHqOZjjynzrv-xg',
	'Education':             '',
	'Science & Technology':  '',
	'Nonprofits & Activism': ''
};

function insertInlineCss(css, id)
{
	document.head.insertAdjacentHTML('beforeend', '<style id='+ id + '>' + css + '</style');
}

function insertInlineScript(script, id)
{
	var newScriptElm = document.createElement('script');
	newScriptElm.text = script;
	newScriptElm.setAttribute('id', id);
	document.head.appendChild(newScriptElm);
}
function insertScript(srcUrl, id)
{
	var newScriptElm = document.createElement('script');
	newScriptElm.src = srcUrl;
	newScriptElm.setAttribute('id', id);
	document.head.appendChild(newScriptElm);
}

// Doesn't work :/
/* 
function polymerExtractData(query)
{
	insertInlineScript(
	`var polymerExtractDataTempElement = document.querySelector('` + query + `');
	 var polymerExtractDataTempDataObj = polymerExtractDataTempElement.data;
	 document.body.insertAdjacentHTML('beforeend', '<div id="polymerExtractDataTempTransport">' + JSON.stringify(polymerExtractDataTempDataObj) + '</div>');`,
	'polymerExtractDataTemp');
	var returnval;
	var waitForDataElm = setInterval(
		function()
		{
			if (document.querySelector('#polymerExtractDataTempTransport') != null)
			{
				returnval = JSON.parse(document.querySelector('#polymerExtractDataTempTransport').innerHTML);
				clearInterval(waitForDataElm);
			}
		},
	1);
	return returnval;
}
// */

function createScript(input, id) {
	a = document.body;
	var b = document.createElement("script");
	b.text = input;
	b.setAttribute("id", id);
	a.appendChild(b);
}

// Thanks Daylin from GoodTube for the next two functions:
function waitForElementAlt(selector, callback, checkFrequency, timeout)
// also shamelessly stolen from taniko lmfao
{
	// uses ms
	// from https://stackoverflow.com/a/29754070

	var startTime = Date.now();
	(function loopSearch()
	{

		if (document.querySelector(selector) != null)
		{

			callback();
			return;

		}
		else
		{

			setTimeout(function()
			{

				if (timeout && Date.now() - startTime > timeout)
				{
					return;
				}

				loopSearch();

			}, checkFrequency);

		}
	}

	)();

}
function polymerExtractData(element) {
	var randomId = Date.now().toString();
    createScript(`
	var pelement` + randomId + ` = document.querySelector("` + element + `");
	var pdata` + randomId + ` = pelement`+randomId+`.data;
	document.body.insertAdjacentHTML('beforeend', '<div id="apsgde`+randomId+`">' + JSON.stringify(pdata`+randomId+`) + '</div>');
	`, (`apsgds` + randomId));
	var retrievedData;
	waitForElementAlt(("#apsgde"+randomId), function() {
		retrievedData = document.querySelector("#apsgde"+randomId).innerHTML;
		document.querySelector("#apsgde"+randomId).remove();
		document.querySelector("#apsgds"+randomId).remove();
	}, 5, 15000);
	return JSON.parse(retrievedData);
}

function polymerNavigateToVideo(videoId) 
{
	document.querySelector('ytd-app').insertAdjacentHTML('beforeend',
	'<ytd-guide-entry-renderer class="ytd-guide-entry-renderer polymerNavigateToVideoTemp"></ytd-guide-entry-renderer>');
	createScript(
	`document.querySelector('.polymerNavigateToVideoTemp').data = {};
	document.querySelector('.polymerNavigateToVideoTemp').data.navigationEndpoint = {
		"clickTrackingParams": "CIwCENwwIhMIptzB_fzP8QIVUpDECh2QawSWMgpnLWhpZ2gtcmVjWg9GRXdoYXRfdG9fd2F0Y2iaAQYQjh4YngE=",
		"commandMetadata": {
			"webCommandMetadata": {
				"url": "/watch?v=` + videoId + `",
				"webPageType": "WEB_PAGE_TYPE_WATCH",
				"rootVe": 3832
			}
		},
		"watchEndpoint": {
			"videoId": "` + videoId + `"
		}
	};`,
	'polymerNavigationScript');
	document.querySelector('.polymerNavigateToVideoTemp').click();
	document.querySelector('.polymerNavigateToVideoTemp').remove();
	document.querySelector('#polymerNavigationScript').remove();
}
function polymerNavigateToChannel(channelUrl, channelId)
{
	document.querySelector('ytd-app').insertAdjacentHTML('beforeend',
	'<ytd-guide-entry-renderer class="ytd-guide-entry-renderer polymerNavigateToChannelTemp"></ytd-guide-entry-renderer>');
	createScript(
	`document.querySelector('.polymerNavigateToChannelTemp').data = {};
	document.querySelector('.polymerNavigateToChannelTemp').data.navigationEndpoint = {
		"clickTrackingParams": "CIwCENwwIhMIptzB_fzP8QIVUpDECh2QawSWMgpnLWhpZ2gtcmVjWg9GRXdoYXRfdG9fd2F0Y2iaAQYQjh4YngE=",
		"commandMetadata": {
			"webCommandMetadata": {
				"apiUrl": "/youtubei/v1/browse",
				"url": "` + channelUrl + `",
				"webPageType": "WEB_PAGE_TYPE_CHANNEL",
				"rootVe": 3611
			}
		},
		"browseEndpoint": {
			"browseId": "`+ channelId + `",
			"canonicalBaseUrl": "` + channelUrl + `"
		}
	};`,
	'polymerNavigationScript');
	document.querySelector('.polymerNavigateToChannelTemp').click();
	document.querySelector('.polymerNavigateToChannelTemp').remove();
	document.querySelector('#polymerNavigationScript').remove();
}

function simpleFuseRunsTextObject(obj)
{
	/*
	 * Use this in the majority of cases.
	 * This does have some limitations that makes it unsuitable for certain parsing:
	 * i.e. video descriptions. Another function is used for those.
    */
	var out = '';
	for (i = 0, j = obj.runs.length; i < j; i++)
	{
		out += obj.runs[i].text;
	}
	return out;
}

function parseTextObject(obj)
{
	if (obj.runs != null)
	{
		return simpleFuseRunsTextObject(obj);
	}
	else if (obj.simpleText != null)
	{
		return obj.simpleText;
	}
	else
	{
		// THIS SHOULD NEVER HAPPEN!!!
		throw new Error('Failed to parse text object.');
	}
}

function createWatchPage(wpData)
{
	/*
	 * NOTICE:
	 * Should ALWAYS index at "twoColumnWatchNextResults"!!!!!!!!!!
	 * If the index is off, then this WON'T work!!!!!!!!!!
	*/
	
	var isPlaylist = false;
	
	function getCurrentVideoId()
	{
		/*
		 * Do this from the URL for reliability.
		*/
		var getVideoIdRegex = window.location.search.split(/(\?)|(v\=)/g);
		for (i = 0, j = getVideoIdRegex.length; i < j; i++)
		{
			if (getVideoIdRegex[i] == "v=")
			{
				return getVideoIdRegex[i + 1];
			}
		}
	}
	
	var videoId = getCurrentVideoId();
	var primaryInfo = wpData.results.results.contents[0].videoPrimaryInfoRenderer;
	var secondaryInfo = wpData.results.results.contents[1].videoSecondaryInfoRenderer;
	if (!yt.config_.LOGGED_IN)
	{
		var secondaryResults = wpData.secondaryResults.secondaryResults.results;
	}
	else
	{
		var secondaryResults = wpData.secondaryResults.secondaryResults.results[1].itemSectionRenderer.contents;
	}
	var ownerInfo = secondaryInfo.owner.videoOwnerRenderer;
	var videoActionsMenu = primaryInfo.videoActions.menuRenderer;
	var videoTitle = parseTextObject(primaryInfo.title);
	var videoViewCount = parseTextObject(primaryInfo.viewCount.videoViewCountRenderer.viewCount);
	
	var playerAutoplayToggle = document.querySelector(`button.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]`);
	
	function createUserHeader()
	{
		var ownerName = parseTextObject(ownerInfo.title);
		var ownerPhoto = ownerInfo.thumbnail.thumbnails[0].url;
		var ownerEndpoint;
		// One of these variables should always be set.
		if (typeof ownerInfo.navigationEndpoint.browseEndpoint.canonicalBaseUrl !== 'undefined')
		{
			ownerEndpoint = ownerInfo.navigationEndpoint.browseEndpoint.canonicalBaseUrl;
		}
		else
		{
			ownerEndpoint = '/channel/' + ownerInfo.navigationEndpoint.browseEndpoint.browseId;
		}
		var ownerBrowseId = ownerInfo.navigationEndpoint.browseEndpoint.browseId;
		function createUserInfo()
		{
			var ownerVerified = false;
			if (typeof ownerInfo.badges !== 'undefined')
			{
				ownerVerified = true;
			}
			return `<div class="yt-user-info">
			<a href="` + ownerEndpoint + `" class="g-hovercard yt-uix-sessionlink       spf-link " data-ytid="` + ownerBrowseId + `" data-sessionlink="itct=CDQQ4TkiEwjbqYnt7c_TAhWE1X4KHRV5BiEo-B0" >` + ownerName + `</a>
       
      ` + (ownerVerified ? `<span aria-label="Verified" class="yt-channel-title-icon-verified yt-uix-tooltip yt-sprite" data-tooltip-text="Verified"></span>` : '') + `
  </div>`;
		}
		
		function createSubscriptionContainer()
		{
			var ownerHasSubscriberCount = false;
			var ownerSubscriberCount = '';
			if (typeof ownerInfo.subscriberCountText !== 'undefined')
			{
				ownerHasSubscriberCount = true;
				var ownerSubCountVar = parseTextObject(ownerInfo.subscriberCountText).replace(/(subscribers)|(subscriber)/g, '');
				ownerSubscriberCount =
				`<span class="yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count" title="` + ownerSubCountVar + `" aria-label="` + ownerSubCountVar + `" tabindex="0">` + ownerSubCountVar + `</span><span class="yt-subscription-button-subscriber-count-branded-horizontal yt-short-subscriber-count" title="` + ownerSubCountVar + `" aria-label="` + ownerSubCountVar + `" tabindex="0">` + ownerSubCountVar + `</span>  `;
			}
			return `<span id="watch7-subscription-container"><span class=" yt-uix-button-subscription-container"><span class="unsubscribe-confirmation-overlay-container">  
  <div class="yt-uix-overlay "  data-overlay-style="primary" data-overlay-shape="tiny">
    
        <div class="yt-dialog hid ">
    <div class="yt-dialog-base">
      <span class="yt-dialog-align"></span>
      <div class="yt-dialog-fg" role="dialog">
        <div class="yt-dialog-fg-content">
          <div class="yt-dialog-loading">
              <div class="yt-dialog-waiting-content">
      <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

  </div>

          </div>
          <div class="yt-dialog-content">
              <div class="unsubscribe-confirmation-overlay-content-container">
    <div class="unsubscribe-confirmation-overlay-content">
      <div class="unsubscribe-confirmation-message">
        Unsubscribe from ` + ownerName + `?
      </div>
    </div>

    <div class="yt-uix-overlay-actions">
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-overlay-close" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span></button>
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-primary overlay-confirmation-unsubscribe-button yt-uix-overlay-close" type="button" onclick=";return false;"><span class="yt-uix-button-content">Unsubscribe</span></button>
    </div>
  </div>

          </div>
          <div class="yt-dialog-working">
              <div class="yt-dialog-working-overlay"></div>
  <div class="yt-dialog-working-bubble">
    <div class="yt-dialog-waiting-content">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
        Working...
    </span>
  </p>

      </div>
  </div>

          </div>
        </div>
        <div class="yt-dialog-focus-trap" tabindex="0"></div>
      </div>
    </div>
  </div>


  </div>

</span><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-subscribe-branded yt-uix-button-has-icon no-icon-markup yt-uix-subscription-button yt-can-buffer" type="button" onclick=";return false;" aria-busy="false" aria-live="polite" data-subscribed-timestamp="0" data-show-unsub-confirm-dialog="true" data-clicktracking="itct=CDUQmysiEwjbqYnt7c_TAhWE1X4KHRV5BiEo-B0yBXdhdGNo" data-href="https://accounts.google.com/ServiceLogin?uilel=3&amp;service=youtube&amp;passive=true&amp;hl=en&amp;continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Fcontinue_action%3DQUFFLUhqbTA2MXc1eFBLdTE2Z1dSTWROMzJOQW5wQXB2Z3xBQ3Jtc0ttWEdOOEx0QWc0QkZPcjQ4SzRRNVRkMjBKNXo3OXBaNnVkY0YtZUR1SlI0U1BuaFZQQXdmdVN4ZmRuV3BqTHhEUTR6bzdNalF3bDNYRlZxOU9kdHVicTkzb2hELXZrTUVPVGhYd1FKYzFwVkpxWWU3ZzRTOFl3MWVQVENELXdQOUxGX2w4aHA0U3JpcjB2RmwyUDRON3BaempkUTN6Y05feGZ6ZS1IbGtUXzc2Y1NUdi1NS3FSTE51SERaNFBpTlRnaDF4N0dZUXRvaThYc1pCcnAxenRHd19UUXN3%26feature%3Dsubscribe%26app%3Ddesktop%26next%3D%252Fchannel%252FUC38IQsAvIsxxjztdMZQtwHA%26hl%3Den%26action_handle_signin%3Dtrue" data-channel-external-id="UC38IQsAvIsxxjztdMZQtwHA" data-show-unsub-confirm-time-frame="always" data-style-type="branded"><span class="yt-uix-button-content"><span class="subscribe-label" aria-label="Subscribe">Subscribe</span><span class="subscribed-label" aria-label="Unsubscribe">Subscribed</span><span class="unsubscribe-label" aria-label="Unsubscribe">Unsubscribe</span></span></button><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon yt-uix-subscription-preferences-button" type="button" onclick=";return false;" aria-role="button" aria-busy="false" aria-label="Subscription preferences" aria-live="polite" data-channel-external-id="UC38IQsAvIsxxjztdMZQtwHA"><span class="yt-uix-button-icon-wrapper"><span class="yt-uix-button-icon yt-uix-button-icon-subscription-preferences yt-sprite"></span></span></button>` + ownerSubscriberCount + `<span class="subscription-preferences-overlay-container">
    
  <div class="yt-uix-overlay "  data-overlay-style="primary" data-overlay-shape="tiny">
    
        <div class="yt-dialog hid ">
    <div class="yt-dialog-base">
      <span class="yt-dialog-align"></span>
      <div class="yt-dialog-fg" role="dialog">
        <div class="yt-dialog-fg-content">
          <div class="yt-dialog-loading">
              <div class="yt-dialog-waiting-content">
      <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

  </div>

          </div>
          <div class="yt-dialog-content">
              <div class="subscription-preferences-overlay-content-container">
    <div class="subscription-preferences-overlay-loading ">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

    </div>
    <div class="subscription-preferences-overlay-content">
    </div>
  </div>

          </div>
          <div class="yt-dialog-working">
              <div class="yt-dialog-working-overlay"></div>
  <div class="yt-dialog-working-bubble">
    <div class="yt-dialog-waiting-content">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
        Working...
    </span>
  </p>

      </div>
  </div>

          </div>
        </div>
        <div class="yt-dialog-focus-trap" tabindex="0"></div>
      </div>
    </div>
  </div>


  </div>

  </span>
</span></span>`;
		}
		
		return `<div id="watch7-user-header" class=" spf-link ">  <a href="` + ownerEndpoint + `" class="yt-user-photo g-hovercard yt-uix-sessionlink      spf-link " data-ytid="` + ownerBrowseId + `" data-sessionlink="itct=CDQQ4TkiEwjbqYnt7c_TAhWE1X4KHRV5BiEo-B0" >
      <span class="video-thumb  yt-thumb yt-thumb-48 g-hovercard"
      data-ytid="` + ownerBrowseId + `"
    >
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">
        
  <img width="48" src="` + ownerPhoto + `" alt="` + ownerName + `" data-ytimg="1" height="48" >

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>

  </a>
  ` + createUserInfo() + `
` + createSubscriptionContainer() + `</div>`;
	}
	
	function createSparkbars()
	{
		if (typeof primaryInfo.sentimentBar.sentimentBarRenderer !== 'undefined')
		{
			var sentimentNumber = primaryInfo.sentimentBar.sentimentBarRenderer.percentIfIndifferent;
			var sentimentInverse = 100 - sentimentNumber;
			return `<div class="video-extras-sparkbars">
			<div class="video-extras-sparkbar-likes" style="width: ` + sentimentNumber + `%"></div>
			<div class="video-extras-sparkbar-dislikes" style="width: ` + sentimentInverse + `%"></div>
			</div>`;
		}
		else
		{
			return '';
		}
	}
	
	function createLikeButtons()
	{
		console.log(videoActionsMenu);
		var likeCountText = '';
		var dislikeCountText = '';
		//*
		if (videoActionsMenu.topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label == 'No likes')
		{
			likeCountText = '0';
		}
		else
		{
			likeCountText = videoActionsMenu.topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/(likes)|(like)/g, '');
		}
		if (videoActionsMenu.topLevelButtons[1].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label == 'No dislikes')
		{
			dislikeCountText = '0';
		}
		else
		{
			dislikeCountText = videoActionsMenu.topLevelButtons[1].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/(dislikes)|(dislike)/g, '');
		}
		// */
		//likeCountText = '1';
		//dislikeCountText = '2';
		
		return `<span class="like-button-renderer " data-button-toggle-group="optional" >
    <span class="yt-uix-clickcard">
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup like-button-renderer-like-button like-button-renderer-like-button-unclicked yt-uix-clickcard-target   yt-uix-tooltip" type="button" onclick=";return false;" aria-label="like this video along with 1,924,213 other people" title="I like this" data-position="bottomright" data-force-position="true" data-orientation="vertical"><span class="yt-uix-button-content">` + likeCountText + `</span></button>
          <div class="signin-clickcard yt-uix-clickcard-content">
    <h3 class="signin-clickcard-header">Like this video?</h3>
    <div class="signin-clickcard-message">
      Sign in to make your opinion count.
    </div>
    <a href="https://accounts.google.com/ServiceLogin?uilel=3&amp;service=youtube&amp;passive=true&amp;hl=en&amp;continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26feature%3D__FEATURE__%26app%3Ddesktop%26hl%3Den%26next%3D%252Fwatch%253Fv%253D` + videoId +  `" class="yt-uix-button  signin-button yt-uix-sessionlink yt-uix-button-primary yt-uix-button-size-default" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg"><span class="yt-uix-button-content">Sign in</span></a>
  </div>

    </span>
    <span class="yt-uix-clickcard">
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup like-button-renderer-like-button like-button-renderer-like-button-clicked yt-uix-button-toggled  hid yt-uix-tooltip" type="button" onclick=";return false;" aria-label="like this video along with 1,924,213 other people" title="Unlike" data-position="bottomright" data-force-position="true" data-orientation="vertical"><span class="yt-uix-button-content">1,924,214</span></button>
    </span>
    <span class="yt-uix-clickcard">
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup like-button-renderer-dislike-button like-button-renderer-dislike-button-unclicked yt-uix-clickcard-target   yt-uix-tooltip" type="button" onclick=";return false;" aria-label="dislike this video along with 92,738 other people" title="I dislike this" data-position="bottomright" data-force-position="true" data-orientation="vertical"><span class="yt-uix-button-content">` + dislikeCountText + `</span></button>
          <div class="signin-clickcard yt-uix-clickcard-content">
    <h3 class="signin-clickcard-header">Don't like this video?</h3>
    <div class="signin-clickcard-message">
      Sign in to make your opinion count.
    </div>
    <a href="https://accounts.google.com/ServiceLogin?uilel=3&amp;service=youtube&amp;passive=true&amp;hl=en&amp;continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26feature%3D__FEATURE__%26app%3Ddesktop%26hl%3Den%26next%3D%252Fwatch%253Fv%253D` + videoId +  `" class="yt-uix-button  signin-button yt-uix-sessionlink yt-uix-button-primary yt-uix-button-size-default" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg"><span class="yt-uix-button-content">Sign in</span></a>
  </div>

    </span>
    <span class="yt-uix-clickcard">
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup like-button-renderer-dislike-button like-button-renderer-dislike-button-clicked yt-uix-button-toggled  hid yt-uix-tooltip" type="button" onclick=";return false;" aria-label="dislike this video along with 92,738 other people" title="I dislike this" data-position="bottomright" data-force-position="true" data-orientation="vertical"><span class="yt-uix-button-content">92,739</span></button>
    </span>
  </span>`;
	}
	
	function createSuperTitleLinks()
	{
		function createLinks()
		{
			var res = '';
			for (i = 0, j = primaryInfo.superTitleLink.runs.length; i < j; i++)
			{
				if (primaryInfo.superTitleLink.runs[i].text != ' ')
				{
					if (typeof primaryInfo.superTitleLink.runs[i].navigationEndpoint !== 'undefined')
					{
						res += `<a href="` + primaryInfo.superTitleLink.runs[i].navigationEndpoint.commandMetadata.webCommandMetadata.url + `" class=" yt-uix-sessionlink      spf-link " data-sessionlink="ei=e408W9SXItaT-gOTs5D4Dg">` + primaryInfo.superTitleLink.runs[i].text + `</a>`;
					}
					else
					{
						res += `<a class=" yt-uix-sessionlink      spf-link " data-sessionlink="ei=e408W9SXItaT-gOTs5D4Dg">` + primaryInfo.superTitleLink.runs[i].text + `</a>`;
					}
				}
			}
			return res;
		}
		if (typeof primaryInfo.superTitleLink !== 'undefined')
		{
			return `<span class="standalone-collection-badge-renderer-text">
   ` + createLinks() + `
</span>`;
		}
		else
		{
			return '';
		}
	}
	
	function createWatchHeader()
	{
		return `<div id="watch-header" class="yt-card yt-card-has-padding">
      <div id="watch7-headline" class="clearfix">
    <div id="watch-headline-title">
	 ` + createSuperTitleLinks() + `
      <h1 class="watch-title-container" >

  <span id="eow-title" class="watch-title" dir="ltr" title="` + videoTitle +  `">
    ` + videoTitle +  `
  </span>

      </h1>
    </div>
  </div>

    ` + createUserHeader() + `
    <div id="watch8-action-buttons" class="watch-action-buttons clearfix"><div id="watch8-secondary-actions" class="watch-secondary-actions yt-uix-button-group" data-button-toggle-group="optional">    <span class="yt-uix-clickcard">
      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup yt-uix-clickcard-target addto-button pause-resume-autoplay yt-uix-tooltip" type="button" onclick=";return false;" title="Add to" data-position="bottomleft" data-orientation="vertical"><span class="yt-uix-button-content">Add to</span></button>
        <div class="signin-clickcard yt-uix-clickcard-content">
    <h3 class="signin-clickcard-header">Want to watch this again later?</h3>
    <div class="signin-clickcard-message">
      Sign in to add this video to a playlist.
    </div>
    <a href="https://accounts.google.com/ServiceLogin?uilel=3&amp;service=youtube&amp;passive=true&amp;hl=en&amp;continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26feature%3D__FEATURE__%26app%3Ddesktop%26hl%3Den%26next%3D%252Fwatch%253Fv%253D` + videoId +  `" class="yt-uix-button  signin-button yt-uix-sessionlink yt-uix-button-primary yt-uix-button-size-default" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg"><span class="yt-uix-button-content">Sign in</span></a>
  </div>

    </span>
  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay action-panel-trigger action-panel-trigger-share   yt-uix-tooltip" type="button" onclick=";return false;" title="Share
" data-trigger-for="action-panel-share" data-button-toggle="true"><span class="yt-uix-button-content">Share
</span></button>
<div class="yt-uix-menu " >  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-trigger yt-uix-tooltip" type="button" onclick=";return false;" role="button" aria-pressed="false" aria-label="Action menu." title="More actions" id="action-panel-overflow-button" aria-haspopup="true"><span class="yt-uix-button-content">More</span></button>
<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu"><ul id="action-panel-overflow-menu">  <li>
      <span class="yt-uix-clickcard" data-card-class=report-card>
          <button type="button" class="yt-ui-menu-item has-icon action-panel-trigger action-panel-trigger-report report-button yt-uix-clickcard-target"
 data-position="topright" data-orientation="horizontal">
    <span class="yt-ui-menu-item-label">Report</span>
  </button>

          <div class="signin-clickcard yt-uix-clickcard-content">
    <h3 class="signin-clickcard-header">Need to report the video?</h3>
    <div class="signin-clickcard-message">
      Sign in to report inappropriate content.
    </div>
    <a href="https://accounts.google.com/ServiceLogin?uilel=3&amp;service=youtube&amp;passive=true&amp;hl=en&amp;continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26feature%3D__FEATURE__%26app%3Ddesktop%26hl%3Den%26next%3D%252Fwatch%253Fv%253D` + videoId +  `" class="yt-uix-button  signin-button yt-uix-sessionlink yt-uix-button-primary yt-uix-button-size-default" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg"><span class="yt-uix-button-content">Sign in</span></a>
  </div>

      </span>
  </li>
  <li>
        <button type="button" class="yt-ui-menu-item has-icon yt-uix-menu-close-on-select action-panel-trigger action-panel-trigger-stats"
 data-trigger-for="action-panel-stats">
    <span class="yt-ui-menu-item-label">Statistics</span>
  </button>

  </li>
  <a href="/timedtext_video?bl=watch&amp;v=` + videoId +  `&amp;ref=wt&amp;auto=yes" class="yt-ui-menu-item has-icon action-panel-trigger-translate" rel="nofollow"
>
    <span class="yt-ui-menu-item-label">Add translations</span>
  </a>
</ul></div></div></div><div id="watch8-sentiment-actions"><div id="watch7-views-info"><div class="watch-view-count">` + videoViewCount + `</div>
  ` + createSparkbars() + `
</div>




  `+ createLikeButtons() +` 
</div></div>
  </div>`;
	}
	
	function createWatchDetails()
	{
		function convertDateFormat()
		{
			// Apr 26, 2005 => Published on Apr 26, 2005
			dateText = primaryInfo.dateText.simpleText;
			if (dateText.search(/(Premiered)|(Streamed live)|(Scheduled)|(Started)/g) == -1)
			{
				return 'Published on ' + dateText;
			}
			else
			{
				return dateText;
			}
		}
		
		function parseDescription()
		{
			// Thanks to Daylin from GoodTube.
			// Used in her PHP frontend; translated to Javascript.
			function timeToSeekEquation(time)
			{
				var tSplit = time.split(':');
				var tCount = tSplit.length;
				var result = '';
				var remaining;
				if (tSplit[0] != 0) {
					for (i = 0; i < tCount; i++)
					{
						remaining = tCount - i - 1;
						if (i < tCount - 1)
						{
							result += tSplit[i] + '*' + (60 ** remaining) + '+';
						}
						else
						{
							result += tSplit[i];
						}
					}
				}
				else
				{
					result = tSplit[1];
				}
				return result;
			}
			var resBuffer = '';
			var description = secondaryInfo.description.runs;
			console.log(description);
			/*
			for (i = 0, j = description.length; i < j; i++)
			{
				if (typeof description[i].navigationEndpoint != 'undefined')
				{
					if (description[i].text.search(/[0-9]{1,}:[0-9]{1,}/g) == -1)
					{
						if (typeof description[i].navigationEndpoint.urlEndpoint !== 'undefined') {
							resBuffer += (`<a href="` + description[i].navigationEndpoint.urlEndpoint.url + `" class="yt-uix-servicelink  " data-servicelink="CDIQ6TgYACITCNupie3tz9MCFYTVfgodFXkGISj4HQ" data-target-new-window="True" target="_blank" rel="nofollow noopener">` + description[i].text + `</a>`);
						}
						else
						{
							resBuffer += (`<a href="` + description[i].navigationEndpoint.commandMetadata.webCommandMetadata.url + `" class="yt-uix-servicelink  " data-servicelink="CDIQ6TgYACITCNupie3tz9MCFYTVfgodFXkGISj4HQ" data-target-new-window="True" target="_blank" rel="nofollow noopener">` + description[i].text + `</a>`);
						}
					}
					else
					{
						resBuffer += (`<a href="#" onclick="yt.www.watch.player.seekTo(` + timeToSeekEquation(description[i].text) + `);return false;">` + description[i].text + `</a>`);
					}
				}
				else
				{
					resBuffer += (description[i].text.replace('\\n', '<br>'));
				}
			}
			// */
			//*
			for (i = 0, j = description.length; i < j; i++)
			{
				if (typeof description[i].navigationEndpoint !== 'undefined')
				{
					if (typeof description[i].navigationEndpoint.urlEndpoint !== 'undefined')
					{
						resBuffer += `<a href="` + description[i].navigationEndpoint.urlEndpoint.url + `" class="yt-uix-servicelink  " data-servicelink="CDIQ6TgYACITCNupie3tz9MCFYTVfgodFXkGISj4HQ" data-target-new-window="True" target="_blank" rel="nofollow noopener">` + description[i].text + `</a>`;
					}
					else if (typeof description[i].navigationEndpoint.commandMetadata.webCommandMetadata !== 'undefined')
					{
						resBuffer += `<a href="` + description[i].navigationEndpoint.commandMetadata.webCommandMetadata.url + `" class="yt-uix-servicelink  " data-servicelink="CDIQ6TgYACITCNupie3tz9MCFYTVfgodFXkGISj4HQ" data-target-new-window="True" target="_blank" rel="nofollow noopener">` + description[i].text + `</a>`;
					}
				}
				else
				{
				resBuffer += description[i].text.replace(/\n/g, '<br>');
				}
			}
			// */
			//resBuffer.push('hello!');
			//var res = resBuffer.join('');
			var res = resBuffer;
			return res;
		}
		
		var license = 'Standard YouTube License'; // Default
		var topMetadata = '';
		var bottomMetadata = '';
		
		function parseMetadata()
		{
			if (typeof secondaryInfo.metadataRowContainer !== 'undefined' && typeof secondaryInfo.metadataRowContainer.metadataRowContainerRenderer.rows !== 'undefined')
			{
				var metadata = secondaryInfo.metadataRowContainer.metadataRowContainerRenderer.rows;
				for (i = 0, j = metadata.length; i < j; i++)
				{
					/*
					switch(parseTextObject(metadata[i].metadataRowRenderer.title))
					{
						case 'License':
							license = '<a href="/t/creative_commons">Creative Commons Attribution license (reuse allowed)</a>';
							break;
						case 'Source videos': // Add to bottom
							bottomMetadata += `<li class="watch-meta-item yt-uix-expander-body">
    <h4 class="title">
      Source videos
    </h4>
    <ul class="content watch-info-tag-list">
        <li><a href="` + metadata[i].metadataRowRenderer.contents[0].runs[0].navigationEndpoint.urlEndpoint.url + `" class="g-hovercard yt-uix-sessionlink      spf-link " data-ytid="UC-9-kyTW8ZkZNDHQJ6FgpwQ" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg" >View attributions</a></li>
    </ul>
  </li>`;
							break;
						default: // Attempt to add to top:
							topMetadata += `<li class="watch-meta-item yt-uix-expander-body">
    <h4 class="title">
      ` + parseTextObject(metadata[i].metadataRowRenderer.title) + `
    </h4>
    <ul class="content watch-info-tag-list">
        <li>Unimplemented.</li>
    </ul>
  </li>`;
							break;
					}
					// */
					//*
					if (parseTextObject(metadata[i].metadataRowRenderer.title) == "License") {
						license = '<a href="/t/creative_commons">Creative Commons Attribution license (reuse allowed)</a>';
					}
					if (parseTextObject(metadata[i].metadataRowRenderer.title) == "Source videos") {
						bottomMetadata += `<li class="watch-meta-item yt-uix-expander-body">
    <h4 class="title">
      Source videos
    </h4>
    <ul class="content watch-info-tag-list">
        <li><a href="` + metadata[i].metadataRowRenderer.contents[0].runs[0].navigationEndpoint.urlEndpoint.url + `" class="g-hovercard yt-uix-sessionlink      spf-link " data-ytid="UC-9-kyTW8ZkZNDHQJ6FgpwQ" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg" >View attributions</a></li>
    </ul>
  </li>`;
					}
					// */
				}
			}
		}
		parseMetadata();
		
		function getCategoryName()
		{
			return JSON.parse(document.querySelector("#scriptTag.ytd-player-microformat-renderer").innerHTML).genre;
		}
		var categoryName = getCategoryName();
		var categoryLink = categoryLinks[categoryName];
		var finalCategory = '';
		if (categoryLink != '')
		{
			finalCategory = '<a href="' + categoryLink + '" class="g-hovercard yt-uix-sessionlink      spf-link " data-ytid="UC-9-kyTW8ZkZNDHQJ6FgpwQ" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg" >' + categoryName + '</a>'
		}
		else
		{
			finalCategory = categoryName;
		}
		
		return `<div id="action-panel-details" class="action-panel-content yt-uix-expander yt-card yt-card-has-padding yt-uix-expander-collapsed"><div id="watch-description" class="yt-uix-button-panel"><div id="watch-description-content"><div id="watch-description-clip"><div id="watch-uploader-info"><strong class="watch-time-text">` + convertDateFormat() + `</strong></div><div id="watch-description-text" class=""><p id="eow-description" class="" >` + parseDescription() + `</p></div>  <div id="watch-description-extras">
    <ul class="watch-extras-section">
	` + topMetadata + `
            <li class="watch-meta-item yt-uix-expander-body">
    <h4 class="title">
      Category
    </h4>
    <ul class="content watch-info-tag-list">
        <li>` + finalCategory + `</li>
    </ul>
  </li>

            <li class="watch-meta-item yt-uix-expander-body">
    <h4 class="title">
      License
    </h4>
    <ul class="content watch-info-tag-list">
        <li>` + license + `</li>
    </ul>
  </li>

            ` + bottomMetadata + `

    </ul>
  </div>
</div></div></div>  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-collapsed-body yt-uix-gen204" type="button" onclick=";return false;" data-gen204="feature=watch-show-more-metadata"><span class="yt-uix-button-content">Show more</span></button>
  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-body" type="button" onclick=";return false;"><span class="yt-uix-button-content">Show less</span></button>
</div>`;
	}
	
	function createWatchSidebar()
	{
		//*
		function createWatchRecommendedVideoLockup(cvr)
		{
			function findThumbnailTimeOverlay()
			{
				for (q = 0, w = cvr.thumbnailOverlays.length; q < w; q++)
				{
					if (typeof cvr.thumbnailOverlays[q].thumbnailOverlayTimeStatusRenderer !== 'undefined')
					{
						cvrHasTimeOverlay = true;
						return cvr.thumbnailOverlays[q].thumbnailOverlayTimeStatusRenderer.text.simpleText;
					}
				}
			}
			
			var cvrTitle = parseTextObject(cvr.title);
			var cvrHasViewCount = false;
			var cvrHasTimeOverlay = false;
			var cvrThumbnail = cvr.thumbnail.thumbnails[0].url;
			var cvrByline = parseTextObject(cvr.longBylineText);
			if (typeof cvr.viewCountText !== 'undefined')
			{
				var cvrHasViewCount = true;
				var cvrViewCount = parseTextObject(cvr.viewCountText);
			}
			if (typeof cvr.thumbnailOverlays !== 'undefined')
			{
				cvrTimeOverlay = findThumbnailTimeOverlay();
			}
		
			return (`<li class="video-list-item related-list-item related-list-item-compact-video">

    <div class="content-wrapper">
    <a href="/watch?v=` + cvr.videoId + `" class=" content-link spf-link  yt-uix-sessionlink      spf-link " data-sessionlink="itct=CCkQpDAYAiITCNupie3tz9MCFYTVfgodFXkGISj4HTIHcmVsYXRlZEjEu4GtvZiOhnU" rel="spf-prefetch" title="` + cvrTitle + `" data-visibility-tracking="CCkQpDAYAiITCNupie3tz9MCFYTVfgodFXkGISj4HUDe7vO217rdmnY=">
  <span dir="ltr" class="title" aria-describedby="description-id-487217">
    ` + cvrTitle + `
  </span>
  `+(cvrHasTimeOverlay ? `<span class="accessible-description" id="description-id-487217">
     - Duration: ` + cvrTimeOverlay + `.
  </span>` : '')+`
  <span class="stat attribution"><span class="g-hovercard" data-name="related" data-ytid="UCWEtnEiVwUy7mwFeshyAWLA">`+ cvrByline +`</span></span>
  ` + (cvrHasViewCount ? `<span class="stat view-count">` + cvrViewCount +  `</span>` : '') + `
</a>
  </div>
  <div class="thumb-wrapper">

    <a href="/watch?v=` + cvr.videoId + `" class="thumb-link spf-link yt-uix-sessionlink" data-sessionlink="itct=CCkQpDAYAiITCNupie3tz9MCFYTVfgodFXkGISj4HTIHcmVsYXRlZEjEu4GtvZiOhnU" tabindex="-1" rel="spf-prefetch" data-visibility-tracking="CCkQpDAYAiITCNupie3tz9MCFYTVfgodFXkGISj4HUDe7vO217rdmnY=" aria-hidden="true"><span class="yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related" tabindex="0" data-vid="djV11Xbc914"><img aria-hidden="true" alt="" src="` + cvrThumbnail + `" style="top: 0px" width="168" height="94">`+(cvrHasTimeOverlay ? `<span class="video-time">`+ cvrTimeOverlay +`</span>` : '')+`</span></a>

  

  <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup addto-button video-actions spf-nolink hide-until-delayloaded addto-watch-later-button-sign-in yt-uix-tooltip" type="button" onclick=";return false;" role="button" title="Watch Later" data-button-menu-id="shared-addto-watch-later-login" data-video-ids="djV11Xbc914"><span class="yt-uix-button-arrow yt-sprite"></span></button>
  <span class="thumb-menu dark-overflow-action-menu video-actions">
    <button aria-expanded="false" type="button" class="yt-uix-button-reverse flip addto-watch-queue-menu spf-nolink hide-until-delayloaded yt-uix-button yt-uix-button-dark-overflow-action-menu yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup yt-uix-button-empty" onclick=";return false;" aria-haspopup="true"><span class="yt-uix-button-arrow yt-sprite"></span><ul class="watch-queue-thumb-menu yt-uix-button-menu yt-uix-button-menu-dark-overflow-action-menu hid"><li role="menuitem" class="overflow-menu-choice addto-watch-queue-menu-choice addto-watch-queue-play-next yt-uix-button-menu-item" data-action="play-next" onclick=";return false;" data-video-ids="djV11Xbc914"><span class="addto-watch-queue-menu-text">Play next</span></li><li role="menuitem" class="overflow-menu-choice addto-watch-queue-menu-choice addto-watch-queue-play-now yt-uix-button-menu-item" data-action="play-now" onclick=";return false;" data-video-ids="djV11Xbc914"><span class="addto-watch-queue-menu-text">Play now</span></li></ul></button>
  </span>
  <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup addto-button addto-queue-button video-actions spf-nolink hide-until-delayloaded addto-tv-queue-button yt-uix-tooltip" type="button" onclick=";return false;" title="Queue" data-video-ids="djV11Xbc914" data-style="tv-queue"></button>
</div>

</li>`);
		}
		// */
		//function createWatchRecommendedVideoLockup()
		//{
		//	return 'a';
		//}
		
		var sidebarBuffer0 = [];
		var sidebarBuffer1 = '';
		for (e = 0, r = secondaryResults.length; e < r; e++)
		{
			console.log(e);
			if (typeof secondaryResults[e].compactVideoRenderer !== 'undefined')
			{
				//sidebarBuffer0[i] = createWatchRecommendedVideoLockup(secondaryResults[i].compactVideoRenderer);
				//console.log('hi!');
				//sidebarBuffer0[i] = 'hi!!';
				sidebarBuffer0[e] = createWatchRecommendedVideoLockup(secondaryResults[e].compactVideoRenderer);
			}
		}
		
		console.log(sidebarBuffer0);
		
		if (!isPlaylist)
		{
			sidebarBuffer1 += `<div class="watch-sidebar-section">
    <div class="autoplay-bar">
      <div class="checkbox-on-off">
       <label for="autoplay-checkbox">Autoplay</label>
       <span class="autoplay-hovercard yt-uix-hovercard">
          <span class="autoplay-info-icon yt-uix-button-opacity yt-uix-hovercard-target yt-sprite" data-position="topright" data-orientation="vertical"></span>
<span class="yt-uix-hovercard-content">When autoplay is enabled, a suggested video will automatically play next.</span>        </span>
          <span class="yt-uix-checkbox-on-off ">
<input id="autoplay-checkbox" class="" type="checkbox"  ` + ((playerAutoplayToggle.querySelector(".ytp-autonav-toggle-button").getAttribute("aria-checked") == "true") ? `checked` : "") + `><label for="autoplay-checkbox" id="autoplay-checkbox-label"><span class="checked"></span><span class="toggle"></span><span class="unchecked"></span></label>  </span>

      </div>
      <h4 class="watch-sidebar-head">
        Up next
      </h4>
        <div class="watch-sidebar-body">
    <ul class="video-list">
        ` + sidebarBuffer0[0] + `
    </ul>
  </div>

    </div>
  </div>`;
			var processIndex = 1;
		}
		else
		{
			var processIndex = 0;
		}
		
		sidebarBuffer1 += `<div class="watch-sidebar-section">
    `+(isPlaylist ? '' : `<hr class="watch-sidebar-separation-line">`)+`
      <div class="checkbox-on-off">
        <div class="watch-sidebar-body">
    <ul class="video-list">`;
		
		for (i = processIndex, j = sidebarBuffer0.length; i < j; i++)
		{
			sidebarBuffer1 += sidebarBuffer0[i];
		}
		
		sidebarBuffer1 += `</ul></div></div></div>`;
		
		return sidebarBuffer1;
	}
	
	var finalOutputBuffer = [];
	finalOutputBuffer.push(createWatchHeader());
	finalOutputBuffer.push(createWatchDetails());
	finalOutputBuffer.push(createWatchSidebar());
	var watchHeader = finalOutputBuffer[0];
	var watchDetails = finalOutputBuffer[1];
	var watchSidebar = finalOutputBuffer[2];
	
	function injectOldPage()
	{
		var oldDocument = `<div id="page" class="watch"><div id="content" class="  content-alignment" role="main">      <div id="placeholder-player">
    <div class="player-api player-width player-height"></div>
  </div>

  <div id="watch7-container" class="">
      <div id="player-messages">
  </div>
    
  <div id="watch7-main-container">
    <div id="watch7-main" class="clearfix">
      <div id="watch7-preview" class="player-width player-height hid">
      </div>
      <div id="watch7-content" class="watch-main-col " itemscope itemid="" itemtype="http://schema.org/VideoObject"
      >
              <link itemprop="url" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
    <meta itemprop="name" content="Rick Astley - Never Gonna Give You Up">
    <meta itemprop="description" content="Rick Astley - Never Gonna Give You Up (Official Music Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Download Rick&#39;s Number 1 album &quot;50&quot; - http...">
    <meta itemprop="paid" content="False">

      <meta itemprop="channelId" content="UC38IQsAvIsxxjztdMZQtwHA">
      <meta itemprop="videoId" content="dQw4w9WgXcQ">

      <meta itemprop="duration" content="PT3M33S">
      <meta itemprop="unlisted" content="False">

        <span itemprop="author" itemscope itemtype="http://schema.org/Person">
          <link itemprop="url" href="http://www.youtube.com/user/RickAstleyVEVO">
        </span>
        <span itemprop="author" itemscope itemtype="http://schema.org/Person">
          <link itemprop="url" href="https://plus.google.com/118341150529602077100">
        </span>

          <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@id": "http:\/\/www.youtube.com\/user\/RickAstleyVEVO",
            "name": "RickAstleyVEVO"
          }
        }
      ]
    }
    </script>


    <link itemprop="thumbnailUrl" href="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg">
    <span itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject">
      <link itemprop="url" href="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg">
      <meta itemprop="width" content="1280">
      <meta itemprop="height" content="720">
    </span>

      <link itemprop="embedURL" href="https://www.youtube.com/embed/dQw4w9WgXcQ">
      <meta itemprop="playerType" content="HTML5 Flash">
      <meta itemprop="width" content="1280">
      <meta itemprop="height" content="720">

      <meta itemprop="isFamilyFriendly" content="True">
      <meta itemprop="regionsAllowed" content="AD,AE,AF,AG,AI,AL,AM,AO,AQ,AR,AS,AT,AU,AW,AX,AZ,BA,BB,BD,BE,BF,BG,BH,BI,BJ,BL,BM,BN,BO,BR,BS,BT,BV,BW,BY,BZ,CA,CC,CD,CF,CG,CH,CI,CK,CL,CM,CN,CO,CR,CU,CV,CX,CY,DJ,DK,DM,DO,DZ,EC,EE,EG,EH,ER,ES,ET,FI,FJ,FK,FM,FO,FR,GA,GB,GD,GE,GF,GG,GH,GI,GL,GM,GN,GP,GQ,GR,GS,GT,GU,GW,GY,HK,HM,HN,HR,HT,HU,ID,IE,IL,IM,IN,IO,IQ,IR,IS,IT,JE,JM,JO,JP,KE,KG,KH,KI,KM,KN,KP,KR,KW,KY,KZ,LA,LB,LC,LI,LK,LR,LS,LT,LU,LV,LY,MA,MC,MD,ME,MF,MG,MH,MK,ML,MM,MN,MO,MP,MQ,MR,MS,MT,MU,MV,MW,MX,MY,MZ,NA,NC,NE,NF,NG,NI,NL,NO,NP,NR,NU,NZ,OM,PA,PE,PF,PG,PH,PK,PL,PM,PN,PR,PS,PT,PW,PY,QA,RE,RO,RS,RU,RW,SA,SB,SC,SD,SE,SG,SH,SI,SJ,SL,SM,SN,SO,SR,ST,SV,SY,SZ,TC,TD,TF,TG,TH,TJ,TK,TL,TM,TN,TO,TR,TT,TV,TW,TZ,UA,UG,UM,US,UY,UZ,VA,VC,VE,VG,VI,VN,VU,WF,WS,YE,YT,ZA,ZM,ZW">
      <meta itemprop="interactionCount" content="309216835">
      <meta itemprop="datePublished" content="2009-10-24">
      <meta itemprop="genre" content="Music">


              <div id="watch7-speedyg-area">
      <div class="yt-alert yt-alert-actionable yt-alert-info hid " id="speedyg-template">  <div class="yt-alert-icon">
    <span class="icon master-sprite yt-sprite"></span>
  </div>
<div class="yt-alert-content" role="alert">    <div class="yt-alert-message" tabindex="0">
    </div>
</div><div class="yt-alert-buttons"><a href="https://www.google.com/get/videoqualityreport/?v=dQw4w9WgXcQ" class="yt-uix-button   yt-uix-sessionlink yt-uix-button-alert-info yt-uix-button-size-small" data-sessionlink="ei=CsYHWdv8MISr-wOV8pmIAg" id="speedyg-link" target="_blank"><span class="yt-uix-button-content">Find out why</span></a><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-close close yt-uix-close" type="button" onclick=";return false;" aria-label="Close" data-close-parent-class="yt-alert"><span class="yt-uix-button-content">Close</span></button></div></div>
    </div>


          ` + watchHeader + `




  

      <div id="watch-action-panels" class="watch-action-panels yt-uix-button-panel hid yt-card yt-card-has-padding">
      <div id="action-panel-share" class="action-panel-content hid">
      <div id="watch-actions-share-loading">
    <div class="action-panel-loading">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

    </div>
  </div>
  <div id="watch-actions-share-panel"></div>

  </div>

      <div id="action-panel-stats" class="action-panel-content hid">
    <div class="action-panel-loading">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

    </div>
  </div>

      <div id="action-panel-report" class="action-panel-content hid"
      data-auth-required="true"
  >
    <div class="action-panel-loading">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

    </div>
  </div>

    
  <div id="action-panel-rental-required" class="action-panel-content hid">
      <div id="watch-actions-rental-required">
    <strong>Rating is available when the video has been rented.</strong>
  </div>

  </div>

  <div id="action-panel-error" class="action-panel-content hid">
    <div class="action-panel-error">
      This feature is not available right now. Please try again later.
    </div>
  </div>

    <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup yt-uix-button-opacity yt-uix-close" type="button" onclick=";return false;" id="action-panel-dismiss" aria-label="Close" data-close-parent-id="watch8-action-panels"></button>
  </div>



    ` + watchDetails + `





        <div id="watch-discussion" class="branded-page-box yt-card">
          <div class="action-panel-loading">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

    <span class="yt-spinner-message">
Loading...
    </span>
  </p>

    </div>

  </div>


      </div>
      <div id="watch7-sidebar" class="watch-sidebar">
            <div id="placeholder-playlist" class="watch-playlist player-height  hid"></div>



  <div id="watch7-sidebar-contents" class="watch-sidebar-gutter   yt-card yt-card-has-padding    yt-uix-expander yt-uix-expander-collapsed">
      <div id="watch7-sidebar-offer">
        
      </div>

    <div id="watch7-sidebar-ads">
      
    </div>
    <div id="watch7-sidebar-modules">
        ` + watchSidebar + `
    </div>
  </div>

      </div>
    </div>
  </div>
  <div id="watch7-hidden-extras">
      <div style="visibility: hidden; height: 0px; padding: 0px; overflow: hidden;">
      <img src="//www.youtube-nocookie.com/gen_204?attributionpartner=vevo" border="0" width="1" height="1">
  </div>

  </div>


  </div>

</div></div>`;
		document.querySelector('ytd-page-manager').insertAdjacentHTML('beforebegin', oldDocument);
		
		(function movePlayer()
		{
			document.querySelector("#page .player-api").appendChild(document.querySelector('#movie_player'));
		})()
		
		insertInlineCss(`#page{margin-top:50px;}
		ytd-watch-flexy{display:none!important;}`,
		'watchStyleRewrite');
	
	}
	
	injectOldPage();
	watchPageLoaded = true;
	
	// Player fixes:
	function byebyeDark()
	{
		document.querySelector("ytd-masthead").removeAttribute("dark");
	}
	
	function setWidePlayer()
	{
		if (document.querySelector("#movie_player .ytp-size-button").getAttribute("title") == "Theater mode (t)")
		{
			document.querySelector("#movie_player .ytp-size-button").click();
		}
		if (document.querySelector("ytd-masthead").getAttribute("dark") != null)
		{
			byebyeDark();
		}
	}
	
	function fixPlayer()
	{
		setWidePlayer();
	}
	
	var fixPlayerInterval = setInterval(function() // Fix off cases
	{
		fixPlayer();
	}, 250)
	
	// Autoplay button JS rewrite:
	if (!isPlaylist)
	{
		document.querySelector("#autoplay-checkbox").onclick = function()
		{
			playerAutoplayToggle.click();
		};
	}
	
	// PBJ navigation on spf-links:
	for (i = 0; i < document.querySelectorAll("a.spf-link").length; i++)
	{
		if (document.querySelectorAll("a.spf-link")[i].href.split("/")[3].search("watch") > -1)
		{
			document.querySelectorAll("a.spf-link")[i].onclick = function(e)
			{
				e.preventDefault();
				//polymerNavigateToVideo(document.querySelectorAll("a.spf-link")[i].href.replace(/(((https)|(http)):\/\/|(www\.)|(youtube\.com)|\/watch\?v\=)|(&.*)/g, ""));
			};
			document.querySelectorAll("a.spf-link")[i].addEventListener("click", function()
			{
				polymerNavigateToVideo(this.href.replace(/(((https)|(http)):\/\/|(www\.)|(youtube\.com)|\/watch\?v\=)|(&.*)/g, ""));
			});
		}
		else if (document.querySelectorAll("a.spf-link")[i].href.match(/channel\/|c\/|user\//))
		{
			document.querySelectorAll("a.spf-link")[i].onclick = function(e)
			{
				e.preventDefault();
				//polymerNavigateToVideo(document.querySelectorAll("a.spf-link")[i].href.replace(/(((https)|(http)):\/\/|(www\.)|(youtube\.com)|\/watch\?v\=)|(&.*)/g, ""));
			};
			document.querySelectorAll("a.spf-link")[i].addEventListener("click", function()
			{
				polymerNavigateToChannel(this.href, this.getAttribute("data-ytid"));
			});
		}
	}
	
	//return finalOutputBuffer.join('');
}

function insertCoreStyle()
{
	insertInlineCss(`
	body {
 line-height:1;
 text-align:left;
 text-align:start
}
menu,
ol,
ul {
 list-style:none
}
blockquote,
q {
 quotes:none
}
blockquote:before,
blockquote:after,
q:before,
q:after {
 content:'';
 content:none
}
ins {
 text-decoration:none
}
del {
 text-decoration:line-through
}
table {
 border-collapse:collapse;
 border-spacing:0
}
strong,
b {
 font-weight:500
}
body {
 border:0
}
a,
abbr,
acronym,
address,
applet,
b,
big,
blockquote {
 margin:0;
 padding:0;
 border:0;
 font-size:100%;
 background:transparent
}
button {
 margin:0;
 padding:0;
 border:0;
 background:transparent
}
canvas,
caption,
center,
cite,
code,
dd,
del,
dfn,
div,
dl,
dt,
em,
embed,
fieldset,
font,
form {
 margin:0;
 padding:0;
 border:0;
 font-size:100%;
 background:transparent
}
h1,
h2,
h3,
h4,
h5,
h6 {
 margin:0;
 padding:0;
 border:0;
 background:transparent
}
hr,
html,
i,
iframe,
img,
ins,
kbd,
label,
legend,
li,
menu,
object,
ol,
p,
pre,
q,
s,
samp,
small,
span,
strike,
strong,
sub {
 margin:0;
 padding:0;
 border:0;
 font-size:100%;
 background:transparent
}
sup {
 margin:0;
 padding:0;
 border:0;
 background:transparent
}
table,
tbody,
td,
tfoot,
th,
thead,
tr,
tt,
u,
ul,
var {
 margin:0;
 padding:0;
 border:0;
 font-size:100%;
 background:transparent
}
body {
 word-wrap:break-word;
 margin:0;
 padding:0;
 font:12px "YouTube Noto",Roboto,arial,sans-serif
}
button,
input,
textarea {
 font:12px "YouTube Noto",Roboto,arial,sans-serif
}
a:focus {
 outline:1px dotted #666;
 border:0
}
button:focus {
 outline:1px solid #767676
}
h1,
h2 {
 font-weight:normal
}
h3,
h4,
h5,
h6 {
 font-weight:500
}
h1 {
 font-size:20px
}
h2 {
 font-size:16px
}
h3,
h4 {
 font-size:13px
}
h5,
h6 {
 font-size:10px
}
dt {
 font-weight:500
}
ul.bulleted {
 margin-left:1em;
 list-style-type:disc
}
span.warning {
 color:#d00
}
sup {
 font-size:80%
}
.clearfix:before {
 content:'.';
 display:block;
 height:0;
 visibility:hidden
}
.clearfix:after {
 content:'.';
 display:block;
 height:0;
 visibility:hidden;
 clear:both
}
html,
body,
#body-container {
 height:100%
}
body>#body-container {
 height:auto;
 min-height:100%
}
#content-container,
#body-container {
 padding-bottom:195px;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
body.lite #content-container {
 padding-bottom:0
}
body {
 background:#f1f1f1
}
.no-focus-outline :focus {
 outline:0
}
body,
input,
button,
textarea,
select {
 font-family:"YouTube Noto",Roboto,arial,sans-serif;
 font-size:13px
}
a {
 color:#167ac6;
 cursor:pointer;
 text-decoration:none
}
a:hover,
a:focus {
 text-decoration:underline
}
embed,
object {
 position:relative
}
.off-screen-trigger .off-screen-target {
 position:absolute;
 left:-9999px;
 top:0
}
.off-screen,
.hide-players embed,
.hide-players object {
 left:-9999px;
 top:0
}
.hide-players .preserve-players embed,
.hide-players .preserve-players object {
 left:auto;
 top:auto
}
.hid {
 display:none
}
.yt-deemphasized-text {
 color:#b8b8b8
}
#content {
 position:relative;
 top:10px
}
.branded-page-gutter-padding {
 padding-left:15px;
 padding-right:15px
}
.branded-page-gutter-margin {
 margin-left:15px;
 margin-right:15px
}
#browse-items-primary .item-section>li>.yt-lockup-tile,
.branded-page-box,
.branded-page-box-padding {
 padding:15px
}
#browse-items-primary .item-section>li>.multirow-shelf {
 padding-top:15px
}
.yt-fragment-target {
 background-clip:content-box;
 margin-top:-90px;
 padding-top:90px;
 pointer-events:none;
 vertical-align:top
}
.appbar-hidden .yt-fragment-target {
 margin-top:-50px;
 padding-top:50px
}
.exp-searchbox-redesign.appbar-hidden .yt-fragment-target {
 margin-top:-56px;
 padding-top:56px
}
.sitewide-ticker-visible .yt-fragment-target {
 margin-top:-125px;
 padding-top:125px
}
.appbar-hidden.sitewide-ticker-visible .yt-fragment-target {
 margin-top:-85px;
 padding-top:85px
}
.sitewide-consent-visible .yt-fragment-target {
 margin-top:-146px;
 padding-top:146px
}
.appbar-hidden.sitewide-consent-visible .yt-fragment-target {
 margin-top:-106px;
 padding-top:106px
}
.delayed-frame-styles-not-in .hide-until-delayloaded {
 display:none
}
.content-alignment {
 margin-left:auto;
 margin-right:auto;
 width:1003px;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
.page-loaded .yt-base-gutter,
.page-loaded #page,
.page-loaded #appbar-content {
 -moz-transition:padding 0s ease-in-out
}
.yt-base-gutter,
.yt-unlimited #footer-container.yt-base-gutter {
 min-width:943px;
 padding-left:30px;
 padding-right:30px
}
@media screen and (max-width:656px) {
 .yt-base-gutter {
  padding:0
 }
}
#alerts .yt-alert {
 margin:10px 0
}
.guide-pinned.show-guide .guide-pinning-enabled #page,
.guide-pinned.show-guide .guide-pinning-enabled #appbar-content {
 padding-left:230px
}
.guide-pinned.show-guide .guide-pinning-enabled #footer-container {
 min-width:713px;
 padding-left:260px
}
.flex-width-enabled .content-alignment {
 max-width:1415px;
 min-width:1003px;
 width:auto
}
.flex-width-enabled.flex-width-enabled-snap .content-alignment,
.content-snap-width-1 .flex-width-enabled.flex-width-enabled-snap .content-alignment {
 max-width:none;
 min-width:0;
 width:850px
}
.content-snap-width-2 .flex-width-enabled.flex-width-enabled-snap .content-alignment {
 width:1056px
}
.content-snap-width-3 .flex-width-enabled.flex-width-enabled-snap .content-alignment {
 width:1262px
}
@media screen and (max-width:656px) {
 .flex-width-enabled.flex-width-enabled-snap .watch .content-alignment {
  width:426px
 }
}
body #sb-wrapper {
 min-width:1003px;
 width:auto!important
}
@media only screen and (min-width:0px) and (max-width:498px) {
 .exp-responsive .home .browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-prev,
 .exp-responsive .home .compact-shelf:hover .yt-uix-shelfslider-prev {
  left:-18px
 }
 .exp-responsive .home .browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-next,
 .exp-responsive .home .compact-shelf:hover .yt-uix-shelfslider-next {
  right:-18px
 }
}
@media only screen and (min-width:0px) and (max-width:498px),only screen and (min-width:499px) and (max-width:704px) {
 .exp-responsive .home #content {
  width:438px
 }
 .exp-responsive .home #content .multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .yt-shelf-grid-item:nth-child(-1n+4) {
  display:inline-block
 }
 .exp-responsive .home #content .multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .yt-shelf-grid-item:nth-child(n+5) {
  display:none
 }
}
@media only screen and (min-width:705px) and (max-width:910px) {
 .exp-responsive .home #content {
  width:644px
 }
 .exp-responsive .home #content .multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .yt-shelf-grid-item:nth-child(-1n+6) {
  display:inline-block
 }
 .exp-responsive .home #content .multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .yt-shelf-grid-item:nth-child(n+7) {
  display:none
 }
}
.floatL {
 float:left
}
.floatR {
 float:right
}
.clear {
 clear:both
}
.clearL {
 clear:left
}
.clearR {
 clear:right
}
.spacer {
 clear:both;
 font-size:1px;
 height:1px
}
.alignC {
 text-align:center
}
.alignR {
 text-align:right
}
.force-layer {
 -moz-transform:translateZ(0);
 -ms-transform:translateZ(0);
 -webkit-transform:translateZ(0);
 transform:translateZ(0)
}
.ytg-base {
 text-align:center
}
.ytg-wide {
 width:970px;
 margin-left:auto;
 margin-right:auto;
 text-align:left
}
.ltr .ytg-wide .rtl {
 text-align:right
}
.rtl .ytg-wide .ltr {
 text-align:left
}
.ytg-fl {
 overflow:hidden
}
.ytg-4col,
.ytg-3col,
.ytg-2col,
.ytg-1col {
 float:left;
 margin-right:20px
}
.ytg-4col {
 width:640px
}
.ytg-3col {
 width:475px
}
.ytg-2col {
 width:310px
}
.ytg-1col {
 width:145px
}
.ytg-last {
 margin-right:0
}
#a11y-announcements-container {
 position:absolute;
 clip:rect(0,0,0,0)
}
.accessible-description {
 display:none
}
.yt-pl-thumb {
 position:relative;
 display:inline-block;
 vertical-align:top;
 overflow:hidden
}
.yt-pl-thumb-fluid,
.yt-pl-thumb-square {
 width:100%
}
.is-movie-pl .yt-pl-main-thumb-wrapper {
 padding-right:0
}
.yt-pl-main-thumb-wrapper {
 padding-right:43.75%;
 display:block
}
.yt-pl-thumb .sidebar {
 position:absolute;
 right:0;
 top:0;
 height:100%;
 width:43.75%;
 background:rgba(0,0,0,.8)
}
.yt-show-thumb .sidebar {
 position:absolute;
 background-color:#000;
 bottom:0;
 color:#fff;
 height:24px;
 text-align:center;
 width:100%
}
.exp-mix-as-radio .yt-pl-thumb.yt-mix-thumb .sidebar {
 width:100%;
 background:rgba(0,0,0,.6)
}
.yt-pl-thumb .yt-pl-sidebar-content {
 display:block;
 opacity:.8;
 filter:alpha(opacity=80);
 text-align:center
}
.yt-pl-thumb .formatted-video-count-label {
 display:block;
 margin:0 .75em;
 font-size:10px;
 line-height:1.25em;
 word-break:break-word;
 white-space:normal;
 text-transform:uppercase
}
.yt-pl-thumb .formatted-video-count-label b {
 display:block;
 font-weight:normal;
 font-size:18px;
 line-height:22px
}
.yt-pl-thumb.is-small .formatted-video-count-label {
 font-size:8px
}
.yt-pl-thumb.is-small .formatted-video-count-label b {
 font-size:14px
}
.yt-pl-thumb .yt-pl-sidebar-content {
 height:100%;
 color:#cfcfcf
}
.yt-pl-thumb-link {
 display:block;
 position:relative;
 text-align:left
}
.yt-pl-thumb-link:hover {
 text-decoration:none
}
.yt-pl-thumb-link .yt-pl-thumb-overlay {
 display:none;
 position:absolute;
 left:0;
 right:0;
 min-width:120px;
 top:0;
 bottom:0;
 background:rgba(0,0,0,.7);
 background:progid:DXImageTransform.Microsoft.gradient(startColorStr='#B2000000',endColorStr='#B2000000')
}
.yt-pl-thumb-link:hover .yt-pl-thumb-overlay,
.yt-pl-thumb-link:focus .yt-pl-thumb-overlay {
 display:block
}
.remote-connected .yt-pl-thumb-link:hover .yt-pl-thumb-overlay {
 display:none
}
.yt-pl-thumb-overlay .yt-pl-thumb-overlay-content {
 position:absolute;
 text-align:center;
 top:50%;
 margin-top:-9px;
 width:100%;
 height:18px;
 font-size:16px;
 font-weight:500;
 color:#fff;
 text-shadow:0 1px 1px rgba(255,255,255,.6);
 text-transform:uppercase
}
.is-small .yt-pl-thumb-overlay .yt-pl-thumb-overlay-text {
 font-size:11px
}
.yt-pl-thumb-overlay .play-icon {
 margin-right:3px;
 vertical-align:middle;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px 0;
 background-size:auto;
 width:9px;
 height:12px
}
.yt-pl-thumb-overlay-text {
 vertical-align:middle;
 font-weight:normal;
 font-size:13px
}
.yt-pl-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -90px -51px;
 background-size:auto;
 width:24px;
 height:24px
}
.is-small .yt-pl-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -436px -353px;
 background-size:auto;
 width:18px;
 height:18px
}
.yt-pl-icon.yt-pl-icon-mix {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -339px -146px;
 background-size:auto;
 width:32px;
 height:32px
}
.is-small .yt-pl-icon.yt-pl-icon-mix {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -80px;
 background-size:auto;
 width:24px;
 height:24px
}
.yt-pl-icon.yt-pl-icon-mix-blue {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -436px -400px;
 background-size:auto;
 width:39px;
 height:39px
}
.yt-pl-icon.yt-pl-icon-mix-white {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -445px;
 background-size:auto;
 width:58px;
 height:58px
}
.yt-pl-icon.yt-pl-icon-mix-circle {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -123px;
 background-size:auto;
 width:54px;
 height:54px
}
.is-small .yt-pl-icon.yt-pl-icon-mix-circle {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -229px 0;
 background-size:auto;
 width:40px;
 height:40px
}
.yt-pl-thumb-link:hover .yt-pl-thumb .sidebar {
 background:rgba(0,0,0,.85);
 background:progid:DXImageTransform.Microsoft.gradient(startColorStr='#D8000000',endColorStr='#D8000000')
}
.yt-pl-thumb .yt-thumb-default-43 {
 height:20px;
 width:43px
}
.yt-lockup .yt-lockup-meta .yt-pl-thumb .video-count-text b {
 font-weight:normal;
 color:#555
}
.yt-rounded {
 border-radius:2px
}
.yt-rounded-top {
 -moz-border-radius-topleft:2px;
 border-top-left-radius:2px;
 -moz-border-radius-topright:2px;
 border-top-right-radius:2px
}
.yt-rounded-bottom {
 -moz-border-radius-bottomleft:2px;
 border-bottom-left-radius:2px;
 -moz-border-radius-bottomright:2px;
 border-bottom-right-radius:2px
}
.yt-alert {
 position:relative;
 padding:0;
 overflow:hidden;
 opacity:1;
 -moz-transition:opacity 1s;
 -webkit-transition:opacity 1s;
 transition:opacity 1s
}
.yt-alert.yt-alert-fading {
 opacity:0
}
.yt-alert:not(:first-child) {
 margin-top:5px
}
.yt-alert .icon {
 vertical-align:middle;
 cursor:auto;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -371px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-alert .yt-alert-content {
 overflow:hidden;
 display:table-cell;
 width:100%;
 line-height:1.2
}
.yt-alert .yt-uix-button {
 outline:0
}
.yt-alert-buttons {
 display:table-cell;
 vertical-align:middle;
 overflow:hidden;
 white-space:nowrap;
 padding:0 13px
}
.yt-alert-actionable .yt-alert-icon,
.yt-alert-default .yt-alert-icon {
 display:table-cell;
 vertical-align:middle
}
.yt-alert-actionable .yt-alert-content {
 color:#fff;
 font-weight:500
}
.yt-alert-actionable .yt-alert-buttons,
.yt-alert-default .yt-alert-content {
 color:#fff;
 font-size:13px;
 font-weight:500
}
.yt-alert-small .yt-alert-content {
 color:#fff;
 font-weight:500
}
.yt-alert-actionable .yt-alert-content,
.yt-alert-default .yt-alert-content {
 padding:11px 13px 11px 0
}
.yt-alert-icon {
 padding:0 13px
}
.yt-alert-naked.yt-alert {
 margin:5px 0
}
.yt-alert-naked .yt-alert-content a {
 color:#167ac6
}
.yt-alert-naked .yt-alert-content {
 color:#333;
 padding:4px 13px 3px 0
}
.yt-alert-small .yt-alert-content {
 padding:4px 13px 3px 0
}
.yt-alert-naked .yt-alert-icon {
 padding:0
}
.yt-alert-naked .icon,
.yt-alert-naked .yt-alert-icon,
.yt-alert-small .icon,
.yt-alert-small .yt-alert-icon {
 width:20px;
 height:20px;
 line-height:20px
}
.yt-alert.yt-alert-naked .yt-alert-icon,
.yt-alert.yt-alert-small .yt-alert-icon {
 float:left;
 margin-right:10px;
 border-radius:2px
}
.yt-alert-small {
 padding-right:5px
}
.yt-alert-small .yt-alert-content {
 font-size:11px
}
.yt-alert-small .yt-alert .icon {
 float:left
}
.yt-alert-default .yt-alert-content a,
.yt-alert-actionable .yt-alert-content a,
.yt-alert-small .yt-alert-content a {
 color:inherit;
 text-decoration:underline
}
.yt-alert-default.yt-alert-error,
.yt-alert-actionable.yt-alert-error,
.yt-alert-naked.yt-alert-error .yt-alert-icon,
.yt-alert-small.yt-alert-error {
 background-color:#b91f1f;
 border-color:#a11b1a
}
.yt-alert-actionable.yt-alert-error .icon,
.yt-alert-default.yt-alert-error .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -496px -52px;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-naked.yt-alert-error .icon,
.yt-alert-small.yt-alert-error .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -421px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-alert-actionable .yt-uix-button-alert-error {
 border:1px solid rgba(0,0,0,.2);
 background:transparent
}
.yt-alert-actionable .yt-uix-button-alert-error:hover {
 background:#b31217
}
.yt-alert-actionable .yt-uix-button-alert-error:active {
 background:#921818;
 border-color:#7a1515;
 box-shadow:0 0 0 #000,0 0 1px rgba(255,255,255,.25),inset 0 1px 3px rgba(0,0,0,.25)
}
.yt-alert-warn .yt-alert-content,
.yt-alert-warn .yt-alert-buttons .yt-uix-button-content {
 color:#333;
 text-shadow:none
}
.yt-alert-actionable.yt-alert-warn,
.yt-alert-default.yt-alert-warn,
.yt-alert-naked.yt-alert-warn .yt-alert-icon,
.yt-alert-small.yt-alert-warn {
 background-color:#f5d562
}
.yt-alert-default.yt-alert-warn .icon,
.yt-alert-actionable.yt-alert-warn .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -436px -375px;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-naked.yt-alert-warn .icon,
.yt-alert-small.yt-alert-warn .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -204px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-alert-actionable .yt-uix-button-alert-warn {
 border:1px solid rgba(0,0,0,.2);
 background:transparent
}
.yt-alert-actionable .yt-uix-button-alert-warn:hover {
 background:#edc947
}
.yt-alert-actionable .yt-uix-button-alert-warn:active,
.yt-alert-actionable .yt-uix-button-alert-warn.yt-uix-button-toggled {
 background:#a55e1a;
 border-color:#8a4f16;
 box-shadow:0 0 0 #000,0 0 1px rgba(255,255,255,.25),inset 0 1px 3px rgba(0,0,0,.25)
}
.yt-alert-default.yt-alert-success,
.yt-alert-actionable.yt-alert-success,
.yt-alert-naked.yt-alert-success .yt-alert-icon,
.yt-alert-small.yt-alert-success {
 background:#167ac6
}
.yt-alert-actionable.yt-alert-success .icon,
.yt-alert-default.yt-alert-success .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -480px -218px;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-naked.yt-alert-success .icon,
.yt-alert-small.yt-alert-success .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -390px -16px;
 background-size:auto;
 width:19px;
 height:20px
}
.yt-alert-actionable .yt-uix-button-alert-success {
 border:1px solid rgba(0,0,0,.2);
 background:transparent
}
.yt-alert-actionable .yt-uix-button-alert-success:hover {
 background:#126db3
}
.yt-alert-actionable .yt-uix-button-alert-success:active,
.yt-alert-actionable .yt-uix-button-alert-success.yt-uix-button-toggled {
 background:#356d9b;
 border-color:#4d6c2e;
 box-shadow:0 0 0 #000,0 0 1px rgba(255,255,255,.25),inset 0 1px 3px rgba(0,0,0,.25)
}
.yt-alert-default.yt-alert-info,
.yt-alert-actionable.yt-alert-info,
.yt-alert-naked.yt-alert-info .yt-alert-icon,
.yt-alert-small.yt-alert-info {
 background:#167ac6
}
.yt-alert-default.yt-alert-info .icon,
.yt-alert-actionable.yt-alert-info .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -152px 0;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-naked.yt-alert-info .icon,
.yt-alert-small.yt-alert-info .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -333px -487px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-alert-actionable .yt-uix-button-alert-info {
 border:1px solid rgba(0,0,0,.2);
 background:transparent
}
.yt-alert-actionable .yt-uix-button-alert-info:hover {
 background:#126db3
}
.yt-alert-actionable .yt-uix-button-alert-info:active,
.yt-alert-actionable .yt-uix-button-alert-info.yt-uix-button-toggled {
 border-color:#2c5b82;
 background:#356d9b;
 box-shadow:0 0 0 #000,0 0 1px rgba(255,255,255,.25),inset 0 1px 3px rgba(0,0,0,.25)
}
.yt-consent-banner {
 display:none;
 box-sizing:border-box;
 position:relative;
 padding:0;
 overflow:hidden;
 background:#fff;
 height:56px;
 border-bottom:1px solid #e8e8e8;
 min-width:700px
}
.sitewide-consent-visible .yt-consent-banner {
 display:block
}
.yt-consent-banner div {
 position:relative;
 top:50%;
 -moz-transform:translateY(-50%);
 -ms-transform:translateY(-50%);
 -webkit-transform:translateY(-50%);
 transform:translateY(-50%)
}
.yt-consent-banner .yt-consent-icon {
 margin-left:30px;
 float:left;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-consent-vflw_z5Ye.webp) 0 -24px;
 background-size:auto;
 width:32px;
 height:32px
}
.yt-consent-banner .yt-consent-content {
 overflow:hidden;
 line-height:1.2;
 padding-left:16px;
 color:#333;
 font-weight:normal
}
@media (max-width:1150px) {
 .yt-consent-banner .yt-consent-content {
  font-size:11px
 }
}
@media (max-width:1000px) {
 .yt-consent-banner .yt-consent-content {
  font-size:10px
 }
}
@media (max-width:900px) {
 .yt-consent-banner .yt-consent-content {
  font-size:9px
 }
}
.yt-consent-banner .yt-consent-buttons {
 display:block;
 float:right;
 overflow:hidden;
 white-space:nowrap;
 padding:0 30px
}
.yt-consent-banner .yt-consent-buttons button {
 margin-left:16px
}
.yt-consent-banner .consent-close {
 background-color:transparent;
 border-width:0;
 color:#767676;
 cursor:pointer;
 font-size:12px;
 font-weight:normal
}
.yt-consent-banner .consent-close:hover {
 background-color:transparent;
 border-width:0;
 color:#167ac6;
 text-decoration:none
}
#yt-consent-dialog .yt-dialog-base {
 top:64px;
 bottom:64px;
 height:inherit;
 overflow:hidden;
 min-width:640px
}
#yt-consent-dialog .yt-dialog-fg {
 box-sizing:border-box;
 height:100%
}
@media (max-height:575px) {
 #yt-consent-dialog .yt-dialog-base {
  top:0;
  bottom:0
 }
 #yt-consent-dialog .yt-dialog-fg {
  max-height:448px
 }
}
@media (max-width:645px) {
 #yt-consent-dialog .yt-dialog-base {
  overflow:initial
 }
 #yt-consent-dialog .yt-dialog-align {
  height:0
 }
 #yt-consent-dialog .yt-dialog-fg {
  display:inline
 }
}
#yt-consent-dialog .yt-dialog-fg-content {
 height:100%;
 padding:0
}
#yt-consent-dialog .yt-dialog-content {
 height:100%
}
.yt-consent-dialog-content {
 height:100%;
 width:640px;
 position:relative
}
.yt-consent-dialog-content iframe {
 height:100%;
 width:100%
}
.yt-alert-player {
 margin:0;
 text-align:left
}
.yt-alert-player .yt-alert-content {
 text-align:center
}
.yt-alert-player.yt-alert-error .yt-alert-icon .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -496px -52px;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-player.yt-alert-success .yt-alert-icon .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -480px -218px;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-player.yt-alert-info .yt-alert-icon .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -152px 0;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-player.yt-alert-warn .yt-alert-icon .icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -436px -375px;
 background-size:auto;
 width:20px;
 height:21px
}
.yt-alert-promo {
 background:#fff;
 filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#f0f0f0,EndColorStr=#fff);
 background-image:-moz-linear-gradient(top,#f0f0f0 0,#fff 45px);
 background-image:-ms-linear-gradient(top,#f0f0f0 0,#fff 45px);
 background-image:-o-linear-gradient(top,#f0f0f0 0,#fff 45px);
 background-image:-webkit-linear-gradient(top,#f0f0f0 0,#fff 45px);
 background-image:linear-gradient(to bottom,#f0f0f0 0,#fff 45px)
}
.yt-alert-promo .yt-alert-icon {
 display:none
}
.yt-alert-promo .yt-alert-content {
 padding:20px;
 color:#333;
 font-weight:normal
}
.yt-alert-promo .yt-alert-content a {
 color:#167ac6
}
.yt-alert-promo .close {
 opacity:.4;
 top:10px;
 right:10px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -255px;
 background-size:auto;
 width:9px;
 height:9px
}
.yt-alert-promo .close:hover {
 opacity:1;
 background-color:transparent
}
.yt-alert-watch-promo {
 background:#fff
}
.yt-alert-watch-promo .yt-alert-icon {
 display:none
}
.yt-alert-watch-promo .yt-alert-content {
 color:#333;
 font-weight:normal;
 padding:10px
}
.yt-alert-watch-promo .yt-alert-buttons .close {
 margin:10px;
 padding:0;
 opacity:.5;
 border-radius:0;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -255px;
 background-size:auto;
 width:9px;
 height:9px
}
.yt-alert-watch-promo .yt-alert-watch-promo-divider {
 float:left;
 margin-right:8px;
 margin-top:5px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -333px -110px;
 background-size:auto;
 width:2px;
 height:35px
}
.yt-alert-watch-promo .yt-alert-buttons .close:hover {
 border-radius:0;
 opacity:1
}
.yt-alert-watch-promo .yt-alert-watch-promo-right {
 float:right;
 padding-right:30px;
 position:relative;
 width:180px
}
.yt-alert-watch-promo .yt-alert-watch-promo-thumb {
 float:left;
 padding-right:10px
}
.yt-alert-watch-promo .yt-alert-watch-promo-text {
 padding-top:7px
}
.yt-alert-watch-promo .yt-alert-watch-promo-title {
 display:inline;
 position:absolute;
 top:-9px
}
.yt-uix-button-alert-error .yt-uix-button-content,
.yt-uix-button-alert-info .yt-uix-button-content,
.yt-uix-button-alert-success .yt-uix-button-content,
.yt-uix-button-alert-warn .yt-uix-button-content {
 color:#fff
}
.yt-alert-actionable .yt-alert-message {
 vertical-align:middle;
 display:inline-block
}
.yt-alert-actionable .yt-alert-content {
 white-space:nowrap;
 word-break:normal;
 font-size:0
}
.yt-alert-actionable .yt-alert-message {
 white-space:normal;
 font-size:13px
}
.alert-with-actions.yt-alert-actionable .yt-alert-message {
 bottom:10px;
 left:40px;
 position:absolute;
 right:200px;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.alert-with-actions.yt-alert-actionable .yt-alert-buttons {
 padding-top:1px
}
.yt-alert-actionable .yt-alert-buttons .yt-uix-button-arrow {
 border-top-color:#fff
}
.yt-alert-actionable .yt-alert-buttons .yt-uix-button-toggled .yt-uix-button-arrow {
 border-top-color:transparent;
 border-bottom-color:#fff;
 border-width:0 4px 4px
}
.yt-alert-panel {
 padding:10px 20px;
 margin:0 2px 2px;
 background:#fff
}
.yt-alert .close {
 padding:0;
 margin:6px 0;
 border:none;
 overflow:hidden;
 cursor:pointer;
 box-shadow:none;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -310px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-alert.yt-alert-warn .close {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -371px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-alert .close .yt-uix-button-content {
 display:none
}
.yt-alert .close:hover {
 background-color:rgba(0,0,0,.15);
 border-radius:3px
}
.yt-alert.yt-alert-actionable .close {
 margin-left:6px;
 padding:0
}
.yt-alert-error-multiple-list {
 font-weight:500;
 line-height:1.4;
 list-style:disc;
 margin-left:20px
}
#yt-lang-alert-container .yt-alert-icon .master-sprite {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -236px;
 background-size:auto;
 width:25px;
 height:15px
}
#yt-lang-alert-content {
 overflow:hidden;
 line-height:20px
}
#yt-lang-alert-content .yt-lang-alert-controls {
 float:right;
 margin-left:10px;
 line-height:normal;
 font-size:11px
}
#yt-lang-alert-content .yt-uix-button {
 margin-top:-2px
}
#yt-lang-alert-content .view-all {
 white-space:nowrap
}
.yt-card {
 margin:0 0 10px;
 border:0;
 background:#fff;
 box-shadow:0 1px 2px rgba(0,0,0,.1);
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
.yt-card.yt-card-has-padding {
 padding:15px
}
.yt-card .yt-card-title {
 font-size:15px;
 margin-bottom:10px
}
.yt-card.yt-card-has-padding .yt-alert {
 margin:-15px -15px 15px
}
.yt-card.yt-card-has-padding .yt-alert.yt-alert-naked {
 margin:0
}
.yt-card .yt-uix-button-expander {
 display:block;
 width:100%;
 text-transform:uppercase;
 color:#767676;
 border-top:1px solid #e2e2e2;
 box-shadow:none
}
.yt-card .yt-uix-button-expander:hover {
 color:#222
}
.yt-card.yt-uix-expander .yt-uix-button-expander,
.yt-card .yt-uix-expander .yt-uix-button-expander {
 margin:10px 0 -15px
}
.watch-inline-edit-active button.yt-uix-button-expander {
 display:none
}
.yt-card .yt-uix-tabs {
 margin-bottom:15px;
 border-bottom:1px solid #e2e2e2
}
.yt-card .yt-uix-tabs .yt-uix-button {
 margin-right:40px;
 margin-bottom:-1px;
 padding:0 0 8px;
 border-width:0 0 2px;
 border-radius:0;
 opacity:.5;
 filter:alpha(opacity=50)
}
.yt-card .yt-uix-tabs .yt-uix-button:hover,
.yt-card .yt-uix-tabs .yt-uix-button:active,
.yt-card .yt-uix-tabs .yt-uix-button.yt-uix-button-active,
.yt-card .yt-uix-tabs .yt-uix-button.yt-uix-button-toggled {
 border-bottom-color:#cc181e;
 background:none;
 opacity:1;
 filter:none
}
.compact-shelf,
.compact-shelf-content-container {
 position:relative
}
.compact-shelf.yt-uix-shelfslider {
 overflow:visible
}
.compact-shelf .yt-uix-shelfslider-list {
 width:100%;
 overflow:visible
}
.compact-shelf .yt-uix-button-shelf-slider-pager {
 position:absolute;
 bottom:10px;
 background:#fff;
 border:none;
 width:15px;
 height:60px;
 top:50%;
 margin-top:-60px
}
.compact-shelf .yt-uix-shelfslider-next {
 right:-15px;
 box-shadow:none
}
.compact-shelf .yt-uix-shelfslider-prev {
 left:-15px;
 box-shadow:none
}
.compact-shelf .yt-uix-shelfslider-prev-arrow,
.compact-shelf .yt-uix-shelfslider-next-arrow {
 border:none;
 opacity:.5;
 filter:alpha(opacity=50)
}
.compact-shelf .yt-uix-shelfslider-prev-arrow,
.rtl .compact-shelf .yt-uix-shelfslider-next-arrow {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -218px;
 background-size:auto;
 width:7px;
 height:10px
}
.compact-shelf .yt-uix-shelfslider-next-arrow,
.rtl .compact-shelf .yt-uix-shelfslider-prev-arrow {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -400px -110px;
 background-size:auto;
 width:7px;
 height:10px
}
.compact-shelf .yt-uix-shelfslider-prev:hover .yt-uix-shelfslider-prev-arrow,
.compact-shelf .yt-uix-shelfslider-next:hover .yt-uix-shelfslider-next-arrow {
 opacity:1;
 filter:alpha(opacity=100)
}
.browse-list-item-container:hover .compact-shelf .yt-uix-button-shelf-slider-pager,
.compact-shelf:hover .yt-uix-button-shelf-slider-pager {
 width:40px;
 border:1px solid #e3e3e3;
 box-shadow:1px 1px 3px rgba(0,0,0,.1)
}
.browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-prev,
.compact-shelf:hover .yt-uix-shelfslider-prev {
 left:-40px;
 border-right:0
}
.browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-next,
.compact-shelf:hover .yt-uix-shelfslider-next {
 right:-40px;
 border-left:0
}
.browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-prev-arrow,
.compact-shelf:hover .yt-uix-shelfslider-prev-arrow,
.browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-next-arrow,
.compact-shelf:hover .yt-uix-shelfslider-next-arrow {
 opacity:1;
 filter:alpha(opacity=100)
}
.compact-shelf .shelf-action-container {
 display:inline-block
}
.compact-shelf .shelf-subscription-button {
 margin-left:5px;
 text-align:right;
 vertical-align:middle;
 display:inline-block
}
.compact-shelf .compact-shelf-view-all-card {
 height:108px;
 box-sizing:border-box
}
.compact-shelf .movie-shelf-item+.compact-shelf-view-all-card {
 width:152px;
 height:218px
}
.channels-content-item.channel-shelf-item {
 margin-right:20px;
 width:104px
}
.compact-shelf .channel-shelf-item+.compact-shelf-view-all-card {
 width:108px;
 height:108px
}
.compact-shelf .movie-playlist-shelf-item+.compact-shelf-view-all-card {
 width:183px;
 height:186px
}
.compact-shelf .compact-shelf-view-all-card-link {
 margin-left:15px;
 width:100%;
 height:100%;
 display:inline-block
}
.compact-shelf .compact-shelf-view-all-card-link:hover,
.compact-shelf .compact-shelf-view-all-card-link:hover a {
 text-decoration:none
}
.compact-shelf .compact-shelf-view-all-card h4,
.compact-shelf .compact-shelf-view-all-card-link a {
 color:#767676;
 font-weight:500
}
.compact-shelf .compact-shelf-view-all-card-link:hover h4,
.compact-shelf .compact-shelf-view-all-card-link:hover a {
 color:#167ac6
}
.compact-shelf .compact-shelf-view-all-card h4 {
 font-size:13px
}
.yt-ui-ellipsis {
 background-color:#fff;
 display:block;
 line-height:1.3em;
 overflow:hidden;
 position:relative;
 text-overflow:ellipsis;
 white-space:normal;
 word-wrap:break-word
}
.yt-ui-ellipsis-nowrap-single-line {
 background-color:#fff;
 display:block;
 line-height:1.3em;
 overflow:hidden;
 position:relative;
 text-overflow:ellipsis;
 white-space:nowrap;
 word-wrap:break-word;
 max-height:1.3em
}
.yt-ui-ellipsis::before {
 background-color:inherit;
 position:absolute
}
.yt-ui-ellipsis::after {
 background-color:inherit;
 position:absolute
}
.yt-ui-ellipsis::before {
 content:'…';
 right:0
}
.yt-ui-ellipsis::after {
 content:'';
 height:100%;
 width:100%
}
.yt-ui-ellipsis-2::before {
 top:1.3em
}
.yt-ui-ellipsis-3::before {
 top:2.6em
}
.yt-ui-ellipsis-4::before {
 top:3.9em
}
.yt-ui-ellipsis-6::before {
 top:6.5em
}
.yt-ui-ellipsis-10::before {
 top:11.7em
}
.yt-ui-ellipsis-2 {
 max-height:2.6em
}
.yt-ui-ellipsis-3 {
 max-height:3.9em
}
.yt-ui-ellipsis-4 {
 max-height:5.2em
}
.yt-ui-ellipsis-6 {
 max-height:7.8em
}
.yt-ui-ellipsis-10 {
 max-height:13em
}
.webkit .yt-ui-ellipsis {
 display:-webkit-box;
 -webkit-box-orient:vertical
}
.webkit .yt-ui-ellipsis-2 {
 -webkit-line-clamp:2
}
.webkit .yt-ui-ellipsis-3 {
 -webkit-line-clamp:3
}
.webkit .yt-ui-ellipsis-4 {
 -webkit-line-clamp:4
}
.webkit .yt-ui-ellipsis-6 {
 -webkit-line-clamp:6
}
.webkit .yt-ui-ellipsis-10 {
 -webkit-line-clamp:10
}
.webkit .yt-ui-ellipsis::before {
 content:initial
}
.webkit .yt-ui-ellipsis::after {
 content:'�';
 position:static;
 visibility:hidden
}
.yt-ui-ellipsis[dir="rtl"]::before {
 left:0;
 right:auto
}
.guided-help-box {
 padding:20px;
 border:1px solid #434343;
 background:#464646;
 color:#fff;
 box-shadow:1px 1px 2px rgba(0,0,0,.25)
}
.yt-uix-button.yt-uix-button-guided-help {
 margin:5px 0 -5px;
 border:none;
 background:#7cabe3;
 color:#fff;
 text-shadow:none;
 box-shadow:1px 1px 2px rgba(0,0,0,.25)
}
.yt-nav {
 font-size:0;
 text-align:left;
 margin:0 auto;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-nav li {
 display:inline
}
.yt-nav .yt-nav-item {
 padding:0 25px;
 font-size:13px;
 font-weight:500;
 line-height:40px;
 text-decoration:none;
 vertical-align:top;
 white-space:nowrap;
 display:inline-block
}
.yt-nav li:first-child .yt-uix-button-subnav {
 margin-left:7px
}
.yt-nav .yt-uix-button-subnav {
 margin:6px 7px 6px 0;
 padding:0 10px
}
.yt-nav-aside {
 float:right
}
.yt-nav-dark {
 background:#535353;
 text-shadow:0 -1px 1px #000
}
.yt-nav-dark .yt-nav-item {
 outline:none;
 color:#fff
}
.yt-nav-dark .yt-nav-item:hover {
 background:#666
}
.yt-nav-dark .yt-nav-item:active,
.yt-nav-dark .yt-nav-item:focus {
 background:#343434
}
.yt-nav-dark .selected .yt-nav-item {
 background:#343434;
 cursor:default
}
a.yt-uix-button.yt-uix-button-epic-nav-item,
button.yt-uix-button-epic-nav-item,
.epic-nav-item {
 border:none;
 padding:0 3px 3px;
 cursor:pointer;
 background:none;
 color:#666;
 font-size:13px;
 font-weight:normal;
 height:29px;
 line-height:29px;
 vertical-align:bottom;
 -moz-box-sizing:content-box;
 box-sizing:content-box;
 border-radius:0;
 display:inline-block
}
.epic-nav-item-heading {
 border:none;
 padding:0 3px 3px;
 cursor:pointer;
 background:none;
 font-size:13px;
 vertical-align:bottom;
 -moz-box-sizing:content-box;
 box-sizing:content-box;
 border-radius:0;
 display:inline-block
}
a.yt-uix-button-epic-nav-item:hover,
a.yt-uix-button-epic-nav-item.selected,
a.yt-uix-button-epic-nav-item.yt-uix-button-toggled {
 height:29px;
 line-height:29px;
 border-bottom:3px solid;
 border-color:#cc181e;
 padding-bottom:0;
 display:inline-block
}
a.yt-uix-button-epic-nav-item.partially-selected {
 height:29px;
 line-height:29px;
 border-bottom:3px solid;
 padding-bottom:0;
 display:inline-block
}
a.yt-uix-button-epic-nav-item.partially-selected:hover,
button.yt-uix-button-epic-nav-item:hover,
button.yt-uix-button-epic-nav-item.selected,
button.yt-uix-button-epic-nav-item.yt-uix-button-toggled,
.epic-nav-item:hover,
.epic-nav-item.selected,
.epic-nav-item.yt-uix-button-toggled,
.epic-nav-item-heading {
 height:29px;
 line-height:29px;
 border-bottom:3px solid;
 border-color:#cc181e;
 padding-bottom:0;
 display:inline-block
}
a.yt-uix-button-epic-nav-item.partially-selected {
 border-color:#767676
}
a.yt-uix-button-epic-nav-item.selected,
a.yt-uix-button-epic-nav-item.yt-uix-button-toggled,
button.yt-uix-button-epic-nav-item.selected,
button.yt-uix-button-epic-nav-item.yt-uix-button-toggled,
.epic-nav-item.selected,
.epic-nav-item.yt-uix-button-toggled,
.epic-nav-item-heading {
 color:#333;
 font-weight:500
}
.feed-header-feed-filter .yt-uix-button-epic-nav-item.selected,
.feed-header-feed-filter .yt-uix-button-epic-nav-item:hover {
 border-bottom:3px solid;
 border-color:#cc181e;
 padding-bottom:0
}
.feed-header-feed-filter .yt-uix-button-epic-nav-item.selected {
 color:#333
}
.epic-nav-item-heading-icon {
 vertical-align:middle
}
.secondary-nav.yt-uix-button-epic-nav-item:hover,
.secondary-nav.epic-nav-item:hover {
 border-bottom:0;
 color:#666
}
.yt-uix-button-group .start.epic-nav-item-heading,
.yt-uix-button-group .end.epic-nav-item-heading,
.yt-uix-button-group .start.yt-uix-button-epic-nav-item,
.yt-uix-button-group .end.yt-uix-button-epic-nav-item {
 border-radius:0
}
.yt-uix-button-epic-nav-item .yt-uix-button-arrow {
 border:none;
 margin-right:-2px;
 margin-left:1px;
 margin-top:-1px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -488px -108px;
 background-size:auto;
 width:13px;
 height:13px
}
.yt-uix-button-epic-nav-item.selected:hover .yt-uix-button-arrow,
.yt-uix-button-epic-nav-item.yt-uix-button-toggled:hover .yt-uix-button-arrow,
.yt-uix-button-epic-nav-item:hover .yt-uix-button-arrow {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -267px -422px;
 background-size:auto;
 width:13px;
 height:13px
}
.yt-uix-button-epic-nav-item .yt-uix-button-icon {
 margin-right:3px
}
.yt-ui-menu-content:focus {
 outline:none
}
.yt-ui-menu-content {
 background:#fff;
 border:1px solid #d3d3d3;
 outline:none;
 overflow:visible;
 padding:10px 0;
 box-shadow:0 2px 4px rgba(0,0,0,.2)
}
.yt-ui-menu-item {
 position:relative;
 color:#333;
 cursor:pointer;
 display:block;
 font-size:13px;
 line-height:25px;
 margin:0;
 padding:0 15px;
 text-align:left;
 text-decoration:none;
 white-space:nowrap;
 width:100%;
 word-wrap:normal;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
a.yt-ui-menu-item {
 text-decoration:none
}
.yt-ui-menu-item.has-icon:before,
.yt-ui-menu-item-label {
 display:inline-block;
 vertical-align:middle
}
.yt-ui-menu-item.has-icon:before {
 margin-right:10px;
 content:""
}
.yt-ui-menu-item-checked:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -174px;
 background-size:auto;
 width:15px;
 height:14px
}
.yt-ui-menu-item-checked-hid:before {
 width:15px;
 height:14px
}
.yt-ui-menu-item.has-icon:before {
 opacity:.5;
 filter:alpha(opacity=50)
}
.yt-ui-menu-item.has-icon:hover:before {
 opacity:.6;
 filter:alpha(opacity=60)
}
.yt-ui-menu-item.has-icon:active:before {
 opacity:.8;
 filter:alpha(opacity=80)
}
.yt-ui-menu-item.has-icon:hover:active:before {
 opacity:1;
 filter:alpha(opacity=100)
}
.yt-uix-menu-trigger-selected .yt-ui-menu-item,
.yt-ui-menu-item:hover {
 background:#eee
}
.yt-ui-menu-item:focus {
 outline:none;
 background:#eee
}
.yt-ui-menu-content ul:focus {
 outline:none
}
.yt-ui-menu-content li.yt-ui-menu-new-section-separator {
 border-top:1px solid #b8b8b8;
 margin-top:10px;
 padding-top:10px
}
.overflow-container.empty-overflow-list {
 position:absolute;
 left:-19999px
}
.yt-default h1,
.yt-default h2,
.yt-default h3,
.yt-default h4,
.yt-default h5,
.yt-default h6,
h1.yt,
h2.yt,
h3.yt,
h4.yt,
h5.yt,
h6.yt {
 margin-top:0;
 margin-bottom:13px;
 color:#222
}
.yt-default h1,
h1.yt {
 font-size:24px;
 font-weight:normal
}
.yt-default h2,
h2.yt {
 font-size:13px
}
.yt-default h3,
h3.yt {
 font-size:13px;
 font-weight:normal
}
.yt-default h4,
h4.yt {
 font-size:12px
}
.yt-default h5,
h5.yt {
 font-size:12px;
 font-weight:normal
}
.yt-default h6,
h6.yt {
 font-size:11px;
 font-weight:500;
 text-transform:uppercase
}
.yt-default h2 small,
.yt-default h4 small,
h2.yt small,
h4.yt small {
 color:#555;
 font-size:12px;
 font-weight:normal
}
.yt-default h6 small,
h6.yt small {
 color:#555;
 font-size:11px;
 font-weight:normal;
 text-transform:none
}
.yt-badge-ypc {
 border:1px solid #73c421;
 color:#73c421;
 text-transform:none
}
.yt-badge-ypc-free,
.yt-badge-ypc-purchased,
.yt-badge-ypc-seasonpass {
 border:1px solid #757575;
 color:#757575;
 text-transform:uppercase
}
.yt-badge.standalone-ypc-badge-renderer-icon {
 border:0;
 padding:0 5px;
 color:#fff;
 line-height:16px;
 height:16px;
 font-size:12px;
 border-radius:2px
}
.yt-badge.standalone-ypc-badge-renderer-icon-available {
 background:#2793e6
}
.yt-badge.standalone-ypc-badge-renderer-icon-not-available {
 background:#b8b8b8
}
.yt-badge.standalone-ypc-badge-renderer-icon-purchased {
 background:#767676
}
.standalone-ypc-badge-renderer-label {
 color:#767676;
 font-size:12px
}
.standalone-ypc-badge-renderer-secondary-label {
 font-weight:500;
 color:#767676;
 border-radius:2px;
 padding-left:4px;
 padding-right:4px;
 margin-right:4px;
 text-align:center
}
.rotten-rotomatoes-fresh-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -479px -400px;
 background-size:auto;
 width:13px;
 height:13px
}
.rotten-rotomatoes-splat-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -381px -487px;
 background-size:auto;
 width:13px;
 height:13px
}
.rotten-rotomatoes-certified-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -400px;
 background-size:auto;
 width:13px;
 height:13px
}
.review-aggregate-badge-renderer-icon {
 vertical-align:top;
 padding-right:2px
}
.grid-movie-renderer-meta-info {
 padding-top:6px;
 padding-bottom:5px
}
.grid-movie-renderer-metadata,
.review-aggregate-badge-renderer-text,
.review-aggregate-badge-renderer-text a:link,
.review-aggregate-badge-renderer-text a:visited {
 color:#767676;
 font-size:12px
}
.yt-badge {
 border:1px solid #ddd;
 padding:0 4px;
 height:13px;
 color:#444;
 font-size:11px;
 font-weight:normal;
 text-transform:uppercase;
 text-decoration:none;
 line-height:13px;
 display:inline-block
}
.yt-badge-beta-noframe {
 border:none
}
.yt-badge-list {
 color:#555;
 line-height:100%;
 vertical-align:middle;
 text-transform:uppercase;
 font-size:0;
 display:inline-block
}
.yt-badge-item {
 margin-right:4px;
 vertical-align:middle;
 display:inline-block
}
.yt-badge-item:last-child {
 margin-right:0
}
.yt-badge-ad {
 background:#e6bc27;
 border:0;
 border-radius:2px;
 color:#fff;
 font-size:13px;
 height:16px;
 line-height:16px;
 padding:0 5px;
 text-transform:none;
 vertical-align:middle
}
.yt-badge-live {
 border:1px solid #e62117;
 color:#e62117
}
.yt-music-pass-badge-container {
 display:inline-block;
 vertical-align:middle
}
.yt-badge-music {
 text-transform:none;
 border:none;
 color:#fff;
 background-color:#2793e6
}
.music-pass-icon {
 margin-top:3px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -151px -257px;
 background-size:auto;
 width:13px;
 height:13px
}
.yt-badge-mde-recoupment {
 margin:5px;
 color:#2793e6;
 border:1px solid #2793e6;
 text-transform:uppercase
}
.standalone-collection-badge-renderer-icon {
 background-color:#f1f1f1;
 border-radius:2px;
 color:#000;
 border:none;
 margin:3px 6px 3px 0;
 text-transform:none
}
.standalone-collection-badge-renderer-text a {
 background-color:#f1f1f1;
 border-radius:2px;
 color:#000;
 padding:0 4px;
 margin-right:6px;
 text-transform:none
}
.standalone-collection-red-badge-renderer-icon {
 background-color:#f1f1f1;
 border-radius:2px;
 border:1px solid #f1f1f1;
 color:#e62117;
 margin:3px 0;
 text-transform:none
}
.standalone-collection-badge-renderer-text {
 font-size:11px;
 color:#555
}
.standalone-collection-badge-renderer-red-text {
 font-size:11px;
 color:#e62117
}
button.yt-close {
 background:none;
 border:0
}
.yt-close-img,
.box-close-link img,
.yt-uix-clickcard-close,
.close-small {
 opacity:.4;
 cursor:pointer;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -255px;
 background-size:auto;
 width:9px;
 height:9px
}
.yt-close:hover .yt-close-img,
.yt-close-img:hover,
.box-close-link:hover img,
.yt-uix-clickcard-close:hover,
.yt-uix-clickcard-close:focus,
.close-small:hover,
.close-small:focus {
 opacity:1;
 background-color:transparent
}
.yt-grid-1,
.yt-grid-4,
.yt-grid-5,
.yt-grid-6,
.yt-grid-7,
.yt-grid-8,
.yt-grid-9,
.yt-grid-10,
.yt-grid-11,
.yt-grid-12,
.yt-grid-13,
.yt-grid-14,
.yt-grid-15,
.yt-grid-18,
.yt-grid-19,
.yt-grid-24 {
 float:left;
 margin-right:14px
}
.yt-grid-container {
 margin-right:-14px
}
.yt-grid-box:before,
.yt-grid-box:after,
.yt-grid-container:before,
.yt-grid-container:after {
 content:'.';
 display:block;
 height:0;
 visibility:hidden
}
.yt-grid-box:after,
.yt-grid-container:after {
 clear:both
}
.yt-grid-fluid {
 overflow:hidden
}
.yt-grid-inline {
 font-size:0;
 margin-right:-14px
}
.yt-grid-1-inline,
.yt-grid-4-inline,
.yt-grid-5-inline,
.yt-grid-6-inline,
.yt-grid-7-inline,
.yt-grid-8-inline,
.yt-grid-9-inline,
.yt-grid-10-inline,
.yt-grid-11-inline,
.yt-grid-12-inline,
.yt-grid-13-inline,
.yt-grid-14-inline,
.yt-grid-15-inline,
.yt-grid-18-inline,
.yt-grid-19-inline,
.yt-grid-24-inline {
 font-size:13px;
 margin-right:14px;
 vertical-align:top;
 display:inline-block
}
.yt-grid-1,
.yt-grid-1-inline {
 width:27px
}
.yt-grid-4,
.yt-grid-4-inline {
 width:150px
}
.yt-grid-5,
.yt-grid-5-inline {
 width:191px
}
.yt-grid-6,
.yt-grid-6-inline {
 width:232px
}
.yt-grid-7,
.yt-grid-7-inline {
 width:273px
}
.yt-grid-8,
.yt-grid-8-inline {
 width:314px
}
.yt-grid-9,
.yt-grid-9-inline {
 width:355px
}
.yt-grid-10,
.yt-grid-10-inline {
 width:396px
}
.yt-grid-11,
.yt-grid-11-inline {
 width:437px
}
.yt-grid-12,
.yt-grid-12-inline {
 width:478px
}
.yt-grid-13,
.yt-grid-13-inline {
 width:519px
}
.yt-grid-14,
.yt-grid-14-inline {
 width:560px
}
.yt-grid-15,
.yt-grid-15-inline {
 width:601px
}
.yt-grid-18,
.yt-grid-18-inline {
 width:724px
}
.yt-grid-19,
.yt-grid-19-inline {
 width:765px
}
.yt-grid-24,
.yt-grid-24-inline {
 width:970px
}
.yt-lockup {
 color:#767676;
 line-height:1.3em;
 position:relative
}
.yt-lockup .yt-lockup-meta a,
.yt-lockup .yt-lockup-description a,
.yt-lockup .yt-lockup-byline a {
 color:#767676
}
.yt-lockup .yt-lockup-byline.polymer-byline {
 margin-bottom:4px
}
.yt-lockup .yt-lockup-byline.polymer-byline a {
 color:#111;
 font-size:13px
}
.yt-lockup .yt-lockup-byline.polymer-byline a:hover {
 color:#111;
 text-decoration:none
}
.yt-lockup-title a,
.yt-lockup:hover a,
.yt-lockup:hover .yt-lockup-meta a,
.yt-lockup:hover .yt-lockup-description a {
 color:#167ac6
}
.yt-lockup-title a.polymer-title-link {
 color:#111;
 font-size:14px
}
.yt-lockup-title a.polymer-title-link:hover {
 text-decoration:none
}
.yt-lockup-title a .yt-deemphasized-text {
 color:#167ac6;
 font-weight:normal;
 font-style:italic
}
.exp-responsive .yt-lockup-tile .yt-lockup-byline {
 white-space:nowrap
}
.exp-responsive .yt-lockup-tile .yt-lockup-byline .yt-uix-sessionlink {
 white-space:normal;
 word-wrap:break-word
}
.yt-lockup.yt-lockup-tile {
 font-size:12px
}
.yt-lockup.yt-lockup-grid {
 font-size:11px
}
.yt-lockup.yt-lockup-mini {
 display:block;
 font-size:11px
}
.yt-lockup-title {
 margin-bottom:2px
}
.yt-lockup-actor .yt-lockup-title a {
 color:#333
}
.yt-lockup-tile .yt-lockup-title {
 font-size:14px;
 max-width:499px
}
.yt-lockup-tile .yt-lockup-title.contains-action-menu {
 margin-right:30px
}
.yt-lockup-grid .yt-lockup-title {
 font-size:13px;
 margin-bottom:1px;
 max-width:196px
}
.yt-lockup-grid .yt-lockup-title.polymer-title {
 margin-top:6px;
 margin-bottom:8px
}
.yt-lockup-grid .yt-lockup-thumbnail {
 margin-bottom:4px
}
.yt-shelf-grid-item .yt-lockup-grid .yt-lockup-thumbnail.polymer-thumbnail-padding {
 margin-top:15px
}
.yt-lockup-grid .yt-lockup-title.contains-action-menu {
 margin-right:20px
}
.yt-lockup-tile .yt-lockup-meta,
.yt-lockup-tile .yt-lockup-description {
 max-width:499px
}
.yt-lockup .yt-lockup-meta.polymer-metadata {
 font-size:12px;
 margin-top:2px;
 margin-bottom:4px
}
.yt-lockup-grid .yt-lockup-meta {
 max-width:196px
}
.yt-lockup-mini .yt-lockup-title {
 color:#222;
 font-size:13px;
 font-weight:500;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-lockup-mini:hover .yt-lockup-title {
 color:#167ac6
}
.yt-lockup-mini:hover {
 text-decoration:none
}
.yt-lockup .yt-lockup-meta b {
 color:#222
}
.yt-lockup-description {
 margin:2px 0 0
}
.yt-lockup-badges {
 margin:5px 0 0
}
.exp-responsive .yt-lockup-badges {
 margin:2px 0 0
}
.exp-responsive .yt-lockup-badges .yt-badge-list .yt-badge-item,
.exp-responsive .yt-lockup-badges .yt-badge-list .yt-lockup-badge-item,
.exp-responsive .yt-lockup-badges .yt-uix-button-subscription-container {
 margin-bottom:2px;
 margin-top:2px
}
.yt-uix-menu-container.yt-lockup-action-menu {
 position:absolute;
 right:0;
 top:5px
}
.yt-lockup-grid .yt-lockup-badges {
 margin:0
}
.yt-lockup-grid .yt-uix-menu-container.yt-lockup-action-menu {
 right:-8px
}
.yt-lockup-mini .yt-lockup-badges {
 margin:1px 0 0
}
.yt-lockup-meta {
 display:block
}
.yt-lockup-description {
 line-height:1.3em;
 word-wrap:break-word
}
.gecko .yt-lockup-description .yt-ui-ellipsis:before {
 content:''
}
.yt-lockup-thumbnail {
 line-height:0;
 position:relative
}
.yt-lockup.yt-lockup-tile .yt-lockup-thumbnail {
 float:left;
 margin-right:10px;
 text-align:center;
 width:196px
}
.fluid.yt-lockup-tile .yt-lockup-thumbnail {
 max-width:480px;
 width:60%
}
.yt-lockup.yt-lockup-mini .yt-lockup-thumbnail {
 display:inline-block;
 float:left;
 margin-right:8px;
 text-align:right
}
.yt-lockup-clip {
 overflow:hidden;
 padding-bottom:56.25%
}
.yt-thumb.yt-lockup-clip {
 display:block
}
.yt-lockup-clip img {
 margin-top:-9.375%;
 position:absolute
}
.yt-lockup.yt-lockup-mini .yt-lockup-badges {
 float:right
}
.yt-lockup .yt-lockup-content {
 overflow:hidden;
 position:relative
}
.yt-lockup-meta-info>li {
 line-height:1.3em;
 display:inline-block
}
.yt-lockup-meta-info>li:before {
 content:'•';
 margin:0 5px
}
.yt-lockup-meta-info>li:first-child:before {
 display:none
}
.yt-lockup-meta-info>li:last-child {
 margin-right:0
}
.yt-lockup-grid .yt-uix-button-subscription-container.vertical {
 margin-top:2px
}
.yt-lockup-movie-vertical-poster {
 height:223px
}
.yt-lockup-movie-vertical-poster .yt-lockup-movie-top-content {
 height:85%
}
.yt-lockup-movie-vertical-poster .yt-lockup-movie-bottom-content {
 height:15%
}
.yt-lockup-movie-vertical-poster .yt-lockup-content .yt-lockup-byline,
.yt-lockup-movie-vertical-poster .yt-lockup-content .yt-lockup-meta {
 margin-top:5px;
 margin-bottom:5px
}
.yt-lockup-movie-vertical-poster .yt-lockup-content .yt-lockup-description,
.yt-lockup-movie-vertical-poster .yt-lockup-content .yt-lockup-cast {
 margin-top:13px;
 margin-bottom:8px
}
.yt-lockup-movie-vertical-poster .yt-lockup-content .yt-lockup-meta li {
 margin-bottom:3px
}
.yt-lockup-movie-regular-thumbnail {
 height:138px
}
.yt-lockup-movie-regular-thumbnail .yt-lockup-movie-top-content {
 height:80%
}
.yt-lockup-movie-regular-thumbnail .yt-lockup-movie-bottom-content {
 height:20%
}
.yt-lockup-movie-regular-thumbnail .yt-lockup-content .yt-lockup-byline,
.yt-lockup-movie-regular-thumbnail .yt-lockup-content .yt-lockup-meta {
 margin-top:2px;
 margin-bottom:2px
}
.yt-bottom-aligned-button {
 position:absolute;
 bottom:0;
 left:0
}
.yt-lockup-tile .yt-badge-list {
 margin-right:5px
}
.yt-standalone-badge-item {
 margin-right:10px;
 vertical-align:middle;
 display:inline-block
}
.yt-standalone-badge-item:last-child {
 margin-right:0
}
.yt-bottom-aligned-badge-list {
 position:absolute;
 bottom:0;
 left:0
}
.exp-responsive .yt-lockup-tile .yt-badge-list {
 display:inline;
 margin-right:4px
}
.view-count .yt-badge-list {
 margin-left:5px;
 vertical-align:bottom
}
.yt-lockup-badge-item {
 margin-right:4px;
 vertical-align:middle;
 display:inline-block
}
.yt-lockup-badge-item:last-child {
 margin-right:0
}
.yt-lockup-badge-link {
 vertical-align:middle
}
.yt-lockup-notifications-container {
 border:1px solid #e2e2e2
}
.yt-lockup-playlist-items {
 font-size:12px;
 margin:4px 0;
 white-space:nowrap
}
.yt-lockup-playlist-item {
 border-bottom:1px solid #e2e2e2;
 padding:1px 0
}
.yt-lockup-playlist-item-title {
 display:block;
 font-weight:normal;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-lockup-playlist-item-length {
 float:right
}
.yt-lockup-playlist-item-ypc-badge {
 float:right;
 margin-right:4px
}
.yt-lockup-channel-subscriber-count {
 width:100%;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-lockup-channel.yt-lockup-grid .qualified-channel-title,
.yt-lockup-channel.yt-lockup-tile .qualified-channel-title {
 line-height:18px
}
.yt-lockup-channel.yt-lockup-grid .yt-channel-title-autogenerated,
.yt-lockup-channel.yt-lockup-grid .yt-channel-title-icon-verified,
.yt-lockup-channel.yt-lockup-tile .yt-channel-title-autogenerated,
.yt-lockup-channel.yt-lockup-tile .yt-channel-title-icon-verified {
 margin-bottom:0;
 vertical-align:inherit
}
#browse-items-primary .item-section>li>.yt-lockup-tile.yt-lockup-notification,
.yt-lockup-notification {
 padding:15px;
 min-height:71px;
 box-sizing:border-box
}
.yt-lockup.yt-lockup-notification {
 font-size:11px
}
.yt-lockup-notification .notification-avatar {
 position:absolute;
 left:0;
 top:0;
 padding:15px
}
.yt-lockup-notification .unread-dot {
 position:absolute;
 left:7.5px;
 top:50%;
 width:4px;
 height:4px;
 border-radius:50%;
 background:#167ac6;
 -moz-transform:translate(-50%,-50%);
 -ms-transform:translate(-50%,-50%);
 -webkit-transform:translate(-50%,-50%);
 transform:translate(-50%,-50%)
}
.yt-lockup-notification .notification-avatar .yt-thumb {
 line-height:normal;
 border-radius:50%
}
.yt-lockup-notification .yt-lockup-content {
 display:inline-block;
 margin-left:55px;
 margin-right:100px
}
.yt-lockup-notification .yt-lockup-content-no-thumb {
 display:inline-block;
 margin-left:55px;
 margin-right:28px
}
.yt-lockup-notification .yt-lockup-title a {
 color:#222;
 font-size:13px;
 font-weight:normal
}
.yt-lockup-notification .yt-lockup-byline li {
 display:inline-block
}
.yt-lockup-notification .yt-lockup-byline li:after {
 content:'•';
 margin:0 4px
}
.yt-lockup-notification .yt-lockup-byline li:last-child:after {
 content:''
}
.yt-lockup-notification .notification-thumb {
 position:absolute;
 width:72px;
 right:13px;
 top:0;
 padding:15px
}
.yt-lockup-notification .notification-thumb .yt-thumb {
 display:block;
 height:41px;
 background:transparent
}
.yt-lockup-notification .notification-thumb .yt-thumb img {
 position:absolute;
 top:50%;
 transform:translateY(-50%);
 height:auto
}
.yt-lockup-notification .yt-uix-menu-container {
 top:12px;
 right:4px
}
.yt-lockup.yt-lockup-notification .service-endpoint-replace-enclosing-action-notification {
 padding:0;
 height:auto
}
.actor-shelf-watchpage .yt-uix-shelfslider-item {
 max-width:80px;
 padding-right:8px;
 margin-right:0
}
.yt-lockup-actor .yt-lockup-title {
 height:35px;
 text-align:center
}
.movie-shelf-watchpage .yt-uix-shelfslider-item {
 max-width:156px;
 padding-right:16px;
 margin-right:0
}
.exp-wfv-home .yt-lockup-grid .yt-lockup-title,
.exp-wfv-home .yt-lockup-tile .yt-lockup-title {
 font-size:14px;
 font-weight:normal
}
.exp-wfv-home-2 .yt-lockup-grid .yt-lockup-title,
.exp-wfv-home-2 .yt-lockup-tile .yt-lockup-title {
 font-size:15px;
 font-weight:normal
}
ol.yt,
ul.yt,
.yt-default ol,
.yt-default ul {
 margin:13px 0 13px 30px;
 color:#333;
 font-size:13px;
 line-height:1.4em
}
ol.yt,
.yt-default ol {
 list-style:decimal
}
ul.yt,
.yt-default ul {
 list-style:disc
}
.yt li,
.yt-default li {
 margin-bottom:6px
}
.yt-default p,
.yt-default .yt-notes,
p.yt,
p.yt-notes {
 line-height:1.3em;
 margin-top:0;
 margin-bottom:13px
}
.yt-default p,
p.yt {
 font-size:13px;
 color:#333
}
.yt-default .yt-notes,
p.yt-notes {
 font-size:11px;
 color:#666
}
.yt-horizontal-rule {
 position:relative;
 margin:20px;
 height:0;
 border-top:1px solid #e2e2e2;
 border-bottom:0
}
.yt-vertical-rule-main {
 position:absolute;
 top:0;
 bottom:0;
 left:0;
 height:auto;
 z-index:-1;
 width:30px;
 border:0;
 _display:none
}
.yt-scrollbar ::-webkit-scrollbar {
 width:9px;
 height:9px
}
.yt-scrollbar ::-webkit-scrollbar-thumb {
 background:#ccc
}
.yt-scrollbar ::-webkit-scrollbar-thumb:hover {
 background:#777
}
.yt-scrollbar-dark ::-webkit-scrollbar {
 width:10px;
 height:9px
}
.yt-scrollbar-dark ::-webkit-scrollbar-track {
 border-left-color:#434343;
 background:#434343;
 -webkit-box-shadow:inset 0 0 1px #434343
}
.yt-scrollbar-dark ::-webkit-scrollbar-thumb {
 border-left-color:#8e8e8e;
 background:#8e8e8e
}
.yt-scrollbar-dark ::-webkit-scrollbar-track:hover {
 -webkit-box-shadow:inset 0 0 1px #000
}
.yt-scrollbar-dark ::-webkit-scrollbar-thumb:hover {
 background:#1b1b1b
}
.yt-scrollbar-wide ::-webkit-scrollbar {
 width:18px
}
.yt-uix-simple-thumb-wrap {
 position:relative;
 overflow:hidden;
 display:inline-block
}
.yt-uix-simple-thumb-related {
 height:94px
}
.yt-uix-simple-thumb-related>img {
 position:relative;
 top:0
}
.watch-sidebar-body .yt-uix-simple-thumb-wrap.watched>img {
 opacity:.7;
 filter:alpha(opacity=70)
}
.video-list-item .related-movie-vertical-poster .yt-uix-simple-thumb-related {
 height:173px;
 float:none;
 margin:0
}
.related-movie .yt-uix-simple-thumb-related>img {
 top:0
}
.video-list-item .yt-uix-simple-thumb-wrap {
 float:left;
 margin:0 8px 0 0
}
a:hover .yt-uix-simple-thumb-wrap .video-time,
a:hover .yt-uix-simple-thumb-wrap .video-time-overlay {
 display:none
}
p.yt-spinner {
 text-align:center;
 padding:1em;
 margin:0;
 line-height:20px;
 white-space:nowrap
}
.yt-spinner-img,
.yt-spinner-overlay {
 background:url(//s.ytimg.com/yts/img/icn_loading_animated-vflff1Mjj.gif) no-repeat center
}
.yt-spinner-img {
 width:20px;
 height:20px;
 vertical-align:middle
}
.yt-spinner-message {
 vertical-align:middle
}
.yt-large-spinner-img {
 width:48px;
 height:48px;
 background:url(//s.ytimg.com/yts/img/loader_large-vflin3vnt.gif) no-repeat center
}
.yt-material-spinner-img {
 background:url(//s.ytimg.com/yts/img/loader_material-vfl3KuxkB.gif) no-repeat center;
 height:44px;
 width:44px
}
.yt-sprite {
 display:inline-block
}
.yt-thumb {
 overflow:hidden;
 background:#f1f1f1;
 font-size:0;
 vertical-align:middle;
 display:inline-block
}
.yt-thumb .vertical-align {
 height:100%
}
.yt-thumb img {
 font-size:13px;
 outline:none
}
.yt-thumb-clip {
 position:absolute;
 _position:static;
 bottom:-100px;
 top:-100px;
 left:-100px;
 right:-100px;
 text-align:center;
 white-space:nowrap;
 word-break:normal
}
.yt-thumb-clip img,
.yt-thumb-clip .vertical-align {
 display:inline-block;
 vertical-align:middle
}
.yt-thumb-poster,
.yt-thumb-square,
.yt-thumb-feed,
.yt-thumb-related-playlist,
.yt-thumb-default {
 display:block;
 height:auto
}
.yt-thumb-poster {
 padding-bottom:142.857143%
}
.yt-thumb-square {
 padding-bottom:100%
}
.yt-thumb-feed {
 padding-bottom:67.027027%
}
.yt-thumb-related-playlist {
 padding-bottom:63.333333%
}
.yt-thumb-default {
 padding-bottom:56.25%
}
.yt-pl-thumb .yt-thumb-43 .yt-thumb-default {
 padding-bottom:46.511628%
}
.yt-thumb-10 {
 width:10px
}
.yt-thumb-18 {
 width:18px
}
.yt-thumb-20 {
 width:20px
}
.yt-thumb-23 {
 width:23px
}
.yt-thumb-24 {
 width:24px
}
.yt-thumb-26 {
 width:26px
}
.yt-thumb-27 {
 width:27px
}
.yt-thumb-28 {
 width:28px
}
.yt-thumb-31 {
 width:31px
}
.yt-thumb-32 {
 width:32px
}
.yt-thumb-33 {
 width:33px
}
.yt-thumb-34 {
 width:34px
}
.yt-thumb-36 {
 width:36px
}
.yt-thumb-40 {
 width:40px
}
.yt-thumb-43 {
 width:43px
}
.yt-thumb-46 {
 width:46px
}
.yt-thumb-48 {
 width:48px
}
.yt-thumb-54 {
 width:54px
}
.yt-thumb-56 {
 width:56px
}
.yt-thumb-60 {
 width:60px
}
.yt-thumb-64 {
 width:64px
}
.yt-thumb-65 {
 width:65px
}
.yt-thumb-68 {
 width:68px
}
.yt-thumb-72 {
 width:72px
}
.yt-thumb-74 {
 width:74px
}
.yt-thumb-75 {
 width:75px
}
.yt-thumb-76 {
 width:76px
}
.yt-thumb-77 {
 width:77px
}
.yt-thumb-80 {
 width:80px
}
.yt-thumb-84 {
 width:84px
}
.yt-thumb-88 {
 width:88px
}
.yt-thumb-90 {
 width:90px
}
.yt-thumb-91 {
 width:91px
}
.yt-thumb-96 {
 width:96px
}
.yt-thumb-100 {
 width:100px
}
.yt-thumb-104 {
 width:104px
}
.yt-thumb-106 {
 width:106px
}
.yt-thumb-110 {
 width:110px
}
.yt-thumb-120 {
 width:120px
}
.yt-thumb-168 {
 height:94px;
 width:168px
}
.yt-thumb-124 {
 width:124px
}
.yt-thumb-126 {
 width:126px
}
.yt-thumb-128 {
 width:128px
}
.yt-thumb-138 {
 width:138px
}
.yt-thumb-141 {
 width:141px
}
.yt-thumb-145 {
 width:145px
}
.yt-thumb-150 {
 width:150px
}
.yt-thumb-152 {
 width:152px
}
.yt-thumb-154 {
 width:154px
}
.yt-thumb-160 {
 width:160px
}
.yt-thumb-162 {
 width:162px
}
.yt-thumb-165 {
 width:165px
}
.yt-thumb-167 {
 width:167px
}
.yt-thumb-169 {
 width:169px
}
.yt-thumb-175 {
 width:175px
}
.yt-thumb-176 {
 width:176px
}
.yt-thumb-182 {
 width:182px
}
.yt-thumb-185 {
 width:185px
}
.yt-thumb-185 .yt-thumb-feed img {
 height:124px;
 width:auto
}
.yt-thumb-189 {
 width:189px
}
.yt-thumb-194 {
 width:194px
}
.yt-thumb-196 {
 width:196px
}
.yt-thumb-224 {
 width:224px
}
.yt-thumb-234 {
 width:234px
}
.yt-thumb-250 {
 width:250px
}
.yt-thumb-279 {
 width:279px
}
.yt-thumb-288 {
 width:288px
}
.yt-thumb-320 {
 width:320px
}
.yt-thumb-350 {
 width:350px
}
.yt-thumb-370 {
 width:370px
}
.yt-thumb-380 {
 width:380px
}
.yt-thumb-527 {
 width:527px
}
.yt-thumb-640 {
 width:640px
}
.yt-fluid-thumb-link,
.yt-thumb-fluid {
 width:100%
}
.yt-thumb-fluid .yt-thumb-clip {
 left:0;
 right:0
}
.yt-thumb-fluid img {
 width:100%
}
.exp-mouseover-img .yt-lockup-thumbnail .video-actions,
.exp-mouseover-img .thumb-wrapper .video-actions {
 z-index:3
}
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-img {
 z-index:2
}
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-play {
 height:48px;
 width:48px;
 margin:auto;
 z-index:1
}
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-img,
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-play {
 display:none;
 opacity:0;
 position:absolute
}
.exp-mouseover-img .yt-uix-mouseover-img-wrap:hover .mouseover-img,
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-img:focus,
.exp-mouseover-img .yt-uix-mouseover-img-wrap:hover .mouseover-play,
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-play:focus {
 display:block;
 bottom:0;
 left:0;
 right:0;
 top:0
}
.exp-mouseover-img .yt-uix-mouseover-img-wrap .mouseover-play svg {
 filter:drop-shadow(0px 0px 4px rgba(0,0,0,0.5));
 -webkit-filter:drop-shadow(0px 0px 4px rgba(0,0,0,0.5));
 opacity:.8
}
.ux-thumb-wrap {
 position:relative;
 overflow:hidden;
 display:inline-block
}
a.ux-thumb-wrap {
 text-decoration:none;
 *cursor:pointer
}
#results-main-content .playlist-video .ux-thumb-wrap {
 float:none;
 vertical-align:middle;
 margin-bottom:3px
}
.contains-percent-duration-watched .video-time,
.contains-percent-duration-watched .video-time-overlay,
.contains-percent-duration-watched .addto-button,
.contains-percent-duration-watched .addto-queue-button {
 margin-bottom:4px
}
.contains-addto {
 display:block;
 position:relative;
 height:100%;
 overflow:hidden
}
a:hover .contains-addto .video-time,
.contains-addto:hover .video-time,
a:hover .contains-addto .video-time-overlay,
.contains-addto:hover .video-time-overlay {
 display:none
}
.contains-addto:hover .video-actions,
.ux-thumb-wrap:hover .video-actions,
a:hover .video-actions,
.video-actions:focus,
.video-actions.yt-uix-button-active {
 right:2px
}
.video-list-item .ux-thumb-wrap,
.video-list-item .yt-pl-thumb {
 float:left;
 margin:0 8px 0 0
}
.video-thumb {
 position:relative
}
.ux-thumb-wrap .yt-uix-button-arrow {
 margin:0
}
.video-actions {
 position:absolute;
 bottom:2px
}
.video-time,
.video-time-overlay {
 position:absolute;
 right:2px;
 bottom:2px
}
.video-actions {
 display:block;
 right:-60px;
 cursor:pointer;
 cursor:hand
}
.video-time {
 margin-top:0;
 margin-right:0;
 padding:0 4px;
 font-weight:500;
 font-size:11px;
 background-color:#000;
 color:#fff!important;
 height:14px;
 line-height:14px;
 opacity:.75;
 filter:alpha(opacity=75);
 display:-moz-inline-stack;
 vertical-align:top;
 display:inline-block
}
.watched-badge {
 position:absolute;
 top:10px;
 left:10px;
 padding:2px 4px;
 line-height:1.3em;
 text-align:left;
 color:#fff;
 font-size:11px;
 font-weight:500;
 background-color:#000;
 opacity:.5;
 filter:alpha(opacity=50);
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.watched .video-thumb {
 opacity:.7;
 filter:alpha(opacity=70)
}
.resume-playback-background,
.resume-playback-progress-bar {
 bottom:0;
 height:4px;
 left:0;
 position:absolute
}
.resume-playback-background {
 background:#eee;
 opacity:.6;
 width:100%
}
.resume-playback-progress-bar {
 background:#e62117;
 opacity:1
}
.video-time-overlay {
 margin-top:0;
 margin-right:0;
 padding:0 4px;
 font-weight:500;
 font-size:11px;
 color:#fff;
 height:14px;
 line-height:14px;
 display:-moz-inline-stack;
 vertical-align:top;
 display:inline-block
}
.video-time-overlay-live {
 background-color:#e62117
}
.video-time-overlay-upcoming {
 background-color:#000
}
.video-time-overlay-default {
 background-color:#000;
 opacity:.75;
 filter:alpha(opacity=75)
}
.yt-valign {
 white-space:nowrap
}
.yt-valign-center {
 white-space:nowrap;
 text-align:center
}
.yt-valign:before,
.yt-valign-container {
 vertical-align:middle;
 display:inline-block
}
.yt-valign:before {
 content:'';
 height:100%
}
.music-pass-badge-renderer-logo {
 margin:10px auto;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -118px -487px;
 background-size:auto;
 width:132px;
 height:23px
}
.music-pass-badge-renderer-ad-free-button {
 text-transform:uppercase
}
.music-pass-badge-renderer-upsell-text {
 text-align:center
}
.music-pass-badge-renderer-upsell-enabled-video {
 margin-bottom:10px;
 font-size:13px
}
.music-pass-badge-renderer-upsell-join {
 font-size:11px
}
#fancy-dismissible-dialog-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-title {
 padding-bottom:12px
}
#fancy-dismissible-dialog-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-close {
 margin-top:8px;
 margin-right:-18px
}
#fancy-dismissible-dialog-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-close .yt-uix-button-content {
 background:no-repeat url(https://www.gstatic.com/images/icons/material/system/1x/close_black_24dp.png);
 height:24px;
 width:24px
}
#fancy-dismissible-dialog-renderer .yt-dialog-fg-content {
 padding:0 16px 20px
}
#fancy-dismissible-dialog-renderer .yt-dialog-fg-content .yt-dialog-title {
 line-height:initial;
 padding-top:24px
}
#fancy-dismissible-dialog-renderer .yt-dialog-content {
 margin:-24px 0;
 font-size:13px;
 line-height:1.3em;
 padding-top:5px;
 width:340px;
 word-wrap:break-word;
 white-space:pre-line
}
#fancy-dismissible-dialog-renderer .yt-deemphasized-text {
 color:#000;
 font-weight:500
}
#fancy-dismissible-dialog-renderer .yt-dialog-footer button {
 margin-left:8px
}
#legal-report-details-form-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-title {
 padding-bottom:12px
}
#legal-report-details-form-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-close {
 margin-top:8px;
 margin-right:-18px
}
#legal-report-details-form-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-close .yt-uix-button-content {
 background:no-repeat url(https://www.gstatic.com/images/icons/material/system/1x/close_black_24dp.png);
 height:24px;
 width:24px
}
#legal-report-details-form-renderer .yt-dialog-fg-content {
 padding:0 16px 20px
}
#legal-report-details-form-renderer .yt-dialog-fg-content .yt-dialog-title {
 line-height:initial;
 padding-top:24px
}
#legal-report-details-form-renderer .yt-dialog-content {
 font-size:13px;
 line-height:1.5em;
 padding-top:5px;
 width:340px;
 word-wrap:break-word
}
#legal-report-details-form-renderer label {
 padding:3px 0
}
#legal-report-details-form-renderer .yt-dialog-footer {
 padding-top:16px
}
#legal-report-details-form-renderer .yt-dialog-footer button {
 margin-left:8px
}
#legal-report-details-form-renderer .legal-report-details-form-renderer-description-label {
 margin-bottom:8px
}
#legal-report-details-form-renderer .legal-report-details-form-renderer-description {
 width:310px
}
#legal-report-details-form-renderer .legal-report-details-form-renderer-issue-type-label,
#legal-report-details-form-renderer .legal-report-details-form-renderer-affiliation-label,
#legal-report-details-form-renderer .legal-report-details-form-renderer-name-label {
 margin-top:12px;
 margin-bottom:8px
}
#legal-report-details-form-renderer .legal-report-details-form-renderer-name {
 width:310px
}
#legal-report-details-form-renderer .legal-report-details-form-renderer-footer-text {
 margin-top:18px;
 font-size:11px;
 color:#b8b8b8;
 line-height:normal
}
.options-renderer-captcha,
.options-renderer-form,
.options-renderer-confirmation,
.options-renderer-message-abuse,
.options-renderer-message-continue,
.options-renderer-message-required,
.options-renderer-message-confirm,
.options-renderer-message-review,
.options-renderer-message-redirect,
.options-renderer-form-other,
.options-renderer-button-back,
.options-renderer-button-submit,
.options-renderer-button-continue {
 display:none
}
.options-renderer-step1 .options-renderer-captcha,
.options-renderer-step1 .options-renderer-message-review,
.options-renderer-step1 .options-renderer-button-continue,
.options-renderer-step2 .options-renderer-form,
.options-renderer-step2 .options-renderer-message-review,
.options-renderer-step2 .options-renderer-message-required,
.options-renderer-step2 .options-renderer-button-submit,
.options-renderer-step3 .options-renderer-confirmation,
.options-renderer-step3 .options-renderer-message-confirm,
.options-renderer-step3 .options-renderer-button-continue,
.options-renderer-step4 .options-renderer-button-continue,
.options-renderer-step4 .options-renderer-form-other,
.options-renderer-step4 .options-renderer-message-abuse,
.options-renderer-step4 .options-renderer-message-continue,
.options-renderer-step4 .options-renderer-message-required,
.options-renderer-step4 .options-renderer-button-back,
.options-renderer-step5 .options-renderer-message-redirect {
 display:block
}
.options-renderer {
 position:relative;
 width:100%
}
.options-renderer-info {
 position:relative;
 border-bottom:1px solid #ddd;
 padding:5px 0 15px 160px;
 height:75px
}
.options-renderer-step3 .options-renderer-info {
 margin-top:5px;
 border-bottom:none;
 padding-bottom:0
}
.options-renderer-info p {
 padding:2px 0
}
.options-renderer-info .video-thumb {
 position:absolute;
 top:0;
 left:10px
}
.options-renderer-captcha-hint {
 padding:10px 0
}
.options-renderer-captcha .captcha-container {
 margin-left:0
}
.options-renderer-message-review {
 bottom:48px;
 color:#555;
 font-size:11px
}
.options-renderer-message-abuse {
 margin-bottom:15px;
 border-bottom:1px solid #ddd;
 padding-bottom:15px
}
.options-renderer-message-captcha,
.options-renderer-message-failed {
 padding-bottom:10px
}
.options-renderer-message-continue {
 float:right;
 margin-right:10px;
 width:300px;
 font-size:11px;
 text-align:right
}
.options-renderer-buttons {
 bottom:0;
 padding-top:15px;
 width:100%
}
.options-renderer-button-submit,
.options-renderer-button-continue,
.options-renderer-submit-button {
 float:right
}
.options-renderer-button-back {
 float:left
}
.options-renderer-message-required {
 font-size:11px;
 line-height:32px
}
.options-renderer-step4 .options-renderer-message-required {
 margin-left:63px
}
.options-renderer-step2 .options-renderer-message-required {
 float:right;
 margin-right:15px
}
.options-renderer-form {
 position:relative
}
.options-renderer-categories {
 width:250px
}
.options-renderer-category {
 padding:5px 0
}
.options-renderer-category.clearfix .yt-uix-form-input-radio-container,
.options-renderer-category.clearfix label,
.options-renderer-category.clearfix .yt-uix-tooltip {
 float:left
}
.options-renderer-category .yt-uix-form-input-radio-container {
 margin-right:3px
}
.options-renderer-category-label {
 float:left;
 margin-top:2px
}
.options-renderer-question-mark {
 margin-left:15px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -97px -383px;
 background-size:auto;
 width:15px;
 height:16px
}
.options-renderer-type-select {
 display:none;
 padding:5px 0 5px 20px;
 width:152px
}
.options-renderer-type-select .yt-uix-form-input-select {
 width:150px
}
.options-renderer-type-select .yt-uix-form-input-select .yt-uix-form-input-select-element {
 min-width:150px
}
.options-renderer-category-selected .options-renderer-type-select {
 display:block
}
.options-renderer-addition {
 float:left;
 width:300px
}
.options-renderer-addition p {
 padding:5px 0;
 color:#555;
 font-size:11px
}
.options-renderer-addition-legal-checkbox {
 padding-bottom:10px
}
.options-renderer-addition-legal-checkbox label {
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex
}
.options-renderer-legal-checkbox {
 padding-right:5px
}
.options-renderer-details,
.options-renderer-details-legal {
 height:50px;
 width:280px;
 font-size:11px
}
.options-renderer-timestamp {
 width:20px
}
.options-renderer-form-other {
 position:relative;
 padding:10px
}
.options-renderer-confirmation {
 padding:10px;
 line-height:18px
}
.options-renderer-confirmation p {
 color:#555;
 font-size:11px;
 padding-bottom:10px
}
.options-renderer-message-confirm {
 padding-bottom:10px
}
.options-renderer-title {
 line-height:20px;
 display:inline-block
}
.options-renderer-captcha {
 padding:0
}
.options-renderer-buttons {
 border-top:none
}
.options-renderer-confirmation {
 background-color:#efefef
}
.options-renderer-step3 .options-renderer-buttons {
 display:none
}
.options-renderer {
 height:auto
}
.options-renderer-categories,
.options-renderer-other-categories {
 float:left;
 margin-right:50px;
 margin-top:10px
}
.options-renderer-form {
 padding:0
}
.options-renderer-message-review {
 position:static;
 padding:10px 0
}
.options-renderer-buttons {
 position:static
}
.options-renderer-a11y-container {
 clip:rect(0,0,0,0);
 position:absolute
}
.options-renderer-content {
 font-size:13px;
 line-height:1.5em;
 padding:20px 0;
 width:300px;
 word-wrap:break-word
}
.options-renderer-content li {
 padding:3px 0
}
.options-renderer-content li:first-child {
 padding-top:0
}
.options-renderer-content li:last-child {
 padding-bottom:0
}
.options-renderer-content .yt-uix-form-input-radio-container {
 margin-right:6px;
 height:15px;
 width:15px;
 vertical-align:text-top
}
.options-renderer-content .yt-uix-form-input-radio-container input {
 top:0;
 left:0;
 height:15px;
 width:15px
}
.options-renderer-content .yt-uix-form-input-radio-element {
 height:15px;
 width:15px
}
.options-renderer-content .yt-uix-form-input-radio-container input:checked+.yt-uix-form-input-radio-element {
 background:none;
 height:15px;
 width:15px
}
.options-renderer-content .yt-uix-form-input-radio-container input:checked+.yt-uix-form-input-radio-element:after {
 content:'';
 display:block;
 position:relative;
 top:4px;
 left:4px;
 width:7px;
 height:7px;
 background:#555;
 border-radius:50%
}
.option-item-supported-renderers-sub-options {
 padding:10px 0 0 19px
}
#report-form-modal-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-close {
 margin-top:8px;
 margin-right:-18px
}
#report-form-modal-renderer .yt-dialog-base .yt-dialog-header .yt-dialog-close .yt-uix-button-content {
 background:no-repeat url(https://www.gstatic.com/images/icons/material/system/1x/close_black_24dp.png);
 height:24px;
 width:24px
}
#report-form-modal-renderer .yt-dialog-fg-content {
 padding:0 16px 20px
}
#report-form-modal-renderer .yt-dialog-fg-content .yt-dialog-title {
 line-height:initial;
 padding-top:24px
}
#report-form-modal-renderer .yt-dialog-content {
 font-size:13px;
 line-height:1.5em;
 padding-top:5px;
 width:340px;
 word-wrap:break-word
}
#report-form-modal-renderer .options-renderer-content {
 padding:0;
 width:auto
}
#report-form-modal-renderer .legal-report-checkbox-container {
 border-top:1px solid #b8b8b8;
 margin-top:24px;
 padding-top:24px
}
#report-form-modal-renderer label {
 padding:3px 0
}
#report-form-modal-renderer .legal-report-checkbox {
 float:left;
 margin:3px 6px 0 0;
 height:15px;
 width:15px;
 vertical-align:text-top
}
#report-form-modal-renderer .legal-report-checkbox-label {
 margin-left:24px
}
#report-form-modal-renderer .yt-dialog-footer {
 padding-top:16px
}
#report-form-modal-renderer .yt-dialog-footer button {
 margin-left:8px
}
.add-to-button-renderer-icon:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -152px;
 background-size:auto;
 width:20px;
 height:20px
}
.like-button-renderer-like-button:active .yt-uix-button-content,
.like-button-renderer-like-button.yt-uix-button-toggled .yt-uix-button-content {
 color:#167ac6
}
.like-button-renderer-like-button:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -344px 0;
 background-size:auto;
 width:20px;
 height:20px
}
.like-button-renderer-dislike-button:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -496px -353px;
 background-size:auto;
 width:20px;
 height:20px;
 padding-bottom:1px
}
.like-button-renderer-like-button.yt-uix-button:active:before,
.like-button-renderer-like-button.yt-uix-button.yt-uix-button-toggled:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -251px -332px;
 background-size:auto;
 width:20px;
 height:20px
}
.share-button-renderer .yt-uix-button-icon-share {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -40px -346px;
 background-size:auto;
 width:20px;
 height:20px
}
.share-button-renderer-panel-container .yt-uix-clickcard-card-content {
 width:600px
}
.share-button-renderer-panel-container #share-panel-buttons .yt-uix-button.share-panel-email {
 margin-right:0
}
.share-button-renderer-panel-container .share-panel-url {
 width:580px;
 color:#333;
 font-size:12px;
 padding:7px
}
.share-button-renderer-panel-container .yt-uix-clickcard-card-content {
 padding-bottom:10px
}
.inline-playback-metadata-renderer {
 line-height:2;
 margin:20px auto;
 max-width:640px
}
.inline-playback-metadata-renderer-title {
 color:#333;
 font-size:16px;
 font-weight:normal
}
.inline-playback-metadata-renderer-byline a,
.inline-playback-metadata-renderer-viewcount {
 color:#555;
 display:inline-block;
 font-size:11px;
 font-weight:normal
}
.inline-playback-metadata-renderer-byline {
 margin-right:20px
}
.inline-playback-renderer-inline-player {
 height:360px;
 margin:0 auto;
 width:640px
}
.play-all-icon-btn:before {
 margin-right:0;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -468px -108px;
 background-size:auto;
 width:16px;
 height:16px
}
.addto-icon-button:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -227px -209px;
 background-size:auto;
 width:13px;
 height:13px
}
.video-unlisted-icon {
 vertical-align:middle;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -395px;
 background-size:auto;
 width:24px;
 height:20px
}
.video-private-icon {
 vertical-align:middle;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -487px;
 background-size:auto;
 width:24px;
 height:20px
}
.yt-uix-button {
 display:inline-block;
 height:28px;
 border:solid 1px transparent;
 padding:0 10px;
 outline:0;
 font-weight:500;
 font-size:11px;
 text-decoration:none;
 white-space:nowrap;
 word-wrap:normal;
 line-height:normal;
 vertical-align:middle;
 cursor:pointer;
 *overflow:visible;
 border-radius:2px;
 box-shadow:0 1px 0 rgba(0,0,0,0.05)
}
.yt-uix-button:hover {
 text-decoration:none
}
.yt-uix-button:focus,
.yt-uix-button:focus:hover,
.yt-uix-button-focused,
.yt-uix-button-focused:hover {
 box-shadow:0 0 0 2px rgba(27,127,204,0.4)
}
.no-focus-outline .yt-uix-button:focus,
.no-focus-outline .yt-uix-button:focus:hover,
.no-focus-outline .yt-uix-button-focused,
.no-focus-outline .yt-uix-button-focused:hover {
 box-shadow:none
}
.yt-uix-button::-moz-focus-inner {
 border:0;
 padding:0
}
.yt-uix-button[disabled],
.yt-uix-button[disabled]:hover,
.yt-uix-button[disabled]:active,
.yt-uix-button[disabled]:focus {
 opacity:.5;
 filter:alpha(opacity=50);
 cursor:auto;
 box-shadow:none
}
.yt-uix-button img,
.yt-uix-button-has-icon.no-icon-markup .yt-uix-button-content,
.yt-uix-button-icon-wrapper+.yt-uix-button-content {
 vertical-align:middle
}
.yt-uix-button .yt-uix-button-icon,
.yt-uix-button .yt-uix-button-arrow {
 display:inline-block;
 vertical-align:middle
}
.yt-uix-button-icon-wrapper {
 display:inline-block;
 font-size:0;
 vertical-align:middle
}
.yt-uix-button-has-icon:before {
 content:'';
 display:inline-block;
 vertical-align:middle
}
a.yt-uix-button:after {
 content:'';
 display:inline-block;
 vertical-align:middle;
 height:100%
}
.yt-uix-button-icon-wrapper,
.yt-uix-button-has-icon.no-icon-markup:before {
 margin-right:6px
}
.yt-uix-button-empty .yt-uix-button-icon-wrapper,
.yt-uix-button-empty.yt-uix-button-has-icon.no-icon-markup:before {
 margin-right:0
}
.yt-uix-button-empty .yt-uix-button-icon-wrapper {
 max-height:none;
 max-width:none
}
.yt-uix-button.hid {
 display:none
}
.yt-uix-button-short,
.yt-uix-button-size-small {
 height:20px;
 color:#666
}
.yt-uix-button-size-large {
 height:32px;
 padding:0 15px;
 font-size:13px
}
.yt-uix-button-size-xlarge {
 height:36px;
 padding:0 20px;
 font-size:15px
}
.yt-uix-button-default:hover,
.yt-uix-button-text:hover {
 border-color:#c6c6c6;
 background:#f0f0f0;
 box-shadow:0 1px 0 rgba(0,0,0,0.10)
}
.yt-uix-button-default:active,
.yt-uix-button-default.yt-uix-button-toggled,
.yt-uix-button-default.yt-uix-button-active,
.yt-uix-button-default.yt-uix-button-active:focus,
.yt-uix-button-text:active {
 border-color:#c6c6c6;
 background:#e9e9e9;
 box-shadow:inset 0 1px 0 #ddd
}
.yt-uix-button-default.yt-uix-button-toggled:hover {
 border-color:#b9b9b9;
 background:#e5e5e5;
 box-shadow:inset 0 1px 0 #ddd
}
.yt-uix-button-default,
.yt-uix-button-default[disabled],
.yt-uix-button-default[disabled]:hover,
.yt-uix-button-default[disabled]:active,
.yt-uix-button-default[disabled]:focus {
 border-color:#d3d3d3;
 background:#f8f8f8;
 color:#333
}
.yt-uix-button-default:before,
.yt-uix-button-default .yt-uix-button-icon {
 opacity:.5;
 filter:alpha(opacity=50)
}
.yt-uix-button-default:hover .yt-uix-button-icon,
.yt-uix-button-default:hover:before {
 opacity:.6;
 filter:alpha(opacity=60)
}
.yt-uix-button-default:active .yt-uix-button-icon,
.yt-uix-button-default:active:before,
.yt-uix-button-default.yt-uix-button-active .yt-uix-button-icon,
.yt-uix-button-default.yt-uix-button-active:before,
.yt-uix-button-default.yt-uix-button-toggled .yt-uix-button-icon,
.yt-uix-button-default.yt-uix-button-toggled:before {
 opacity:.8;
 filter:alpha(opacity=80)
}
.yt-uix-button-default:active:hover .yt-uix-button-icon,
.yt-uix-button-default:active:hover:before,
.yt-uix-button-default.yt-uix-button-active:hover .yt-uix-button-icon,
.yt-uix-button-default.yt-uix-button-active:hover:before,
.yt-uix-button-default.yt-uix-button-toggled:hover .yt-uix-button-icon,
.yt-uix-button-default.yt-uix-button-toggled:hover:before {
 opacity:1;
 filter:alpha(opacity=100)
}
.yt-uix-button-dark .yt-uix-button-icon,
.yt-uix-button-dark:before {
 opacity:.4;
 filter:alpha(opacity=40)
}
.yt-uix-button-dark:hover .yt-uix-button-icon,
.yt-uix-button-dark:hover:before {
 opacity:.55;
 filter:alpha(opacity=55)
}
.yt-uix-button-dark:active .yt-uix-button-icon,
.yt-uix-button-dark:active:before,
.yt-uix-button-dark.yt-uix-button-active .yt-uix-button-icon,
.yt-uix-button-dark.yt-uix-button-active:before,
.yt-uix-button-dark.yt-uix-button-toggled .yt-uix-button-icon,
.yt-uix-button-dark.yt-uix-button-toggled:before {
 opacity:.85;
 filter:alpha(opacity=85)
}
.yt-uix-button-dark:active:hover .yt-uix-button-icon,
.yt-uix-button-dark:active:hover:before,
.yt-uix-button-dark.yt-uix-button-active:hover .yt-uix-button-icon,
.yt-uix-button-dark.yt-uix-button-active:hover:before,
.yt-uix-button-dark.yt-uix-button-toggled:hover .yt-uix-button-icon .yt-uix-button-dark.yt-uix-button-toggled:hover:before {
 opacity:1;
 filter:alpha(opacity=100)
}
.yt-uix-button-opacity,
.yt-uix-button-opacity:hover,
.yt-uix-button-dark-opacity,
.yt-uix-button-dark-opacity:hover {
 box-shadow:none
}
.yt-uix-button-opacity {
 opacity:.5;
 filter:alpha(opacity=50)
}
.yt-uix-menu-top-level-flow-button .yt-uix-button-opacity {
 opacity:.4;
 filter:alpha(opacity=40)
}
.yt-uix-button-opacity:hover {
 opacity:.6;
 filter:alpha(opacity=60)
}
.yt-uix-menu-top-level-flow-button .yt-uix-button-opacity:hover {
 opacity:.5;
 filter:alpha(opacity=50)
}
.yt-uix-button-opacity:active,
.yt-uix-button-opacity.yt-uix-button-active,
.yt-uix-button-opacity.yt-uix-button-toggled,
.yt-uix-menu-top-level-flow-button .yt-uix-button-opacity[disabled] {
 opacity:.8;
 filter:alpha(opacity=80)
}
.yt-uix-button-opacity:active:hover,
.yt-uix-button-opacity.yt-uix-button-active:hover,
.yt-uix-button-opacity.yt-uix-button-toggled:hover,
.yt-uix-menu-top-level-flow-button .yt-uix-button-opacity[disabled]:hover {
 opacity:1;
 filter:alpha(opacity=100)
}
.yt-uix-button-opacity-dark {
 opacity:.4;
 filter:alpha(opacity=40)
}
.yt-uix-button-opacity-dark:hover {
 opacity:.55;
 filter:alpha(opacity=55)
}
.yt-uix-button-opacity-dark:active,
.yt-uix-button-opacity-dark.yt-uix-button-active,
.yt-uix-button-opacity-dark.yt-uix-button-toggled {
 opacity:.85;
 filter:alpha(opacity=85)
}
.yt-uix-button-opacity-dark:active:hover,
.yt-uix-button-opacity-dark.yt-uix-button-active:hover,
.yt-uix-button-opacity-dark.yt-uix-button-toggled:hover {
 opacity:1;
 filter:alpha(opacity=100)
}
.yt-uix-button-primary,
.yt-uix-button-primary[disabled],
.yt-uix-button-primary[disabled]:hover,
.yt-uix-button-primary[disabled]:active,
.yt-uix-button-primary[disabled]:focus {
 border-color:#167ac6;
 background:#167ac6;
 color:#fff
}
.yt-uix-button-primary:hover {
 background:#126db3
}
.yt-uix-button-primary:active,
.yt-uix-button-primary.yt-uix-button-toggled,
.yt-uix-button-primary.yt-uix-button-active,
.yt-uix-button-primary.yt-uix-button-active:focus {
 background:#095b99;
 box-shadow:inset 0 1px 0 rgba(0,0,0,0.5)
}
.yt-uix-button-primary[disabled]:active,
.yt-uix-button-primary[disabled].yt-uix-button-toggled {
 box-shadow:none
}
.yt-uix-button-destructive,
.yt-uix-button-destructive[disabled],
.yt-uix-button-destructive[disabled]:hover,
.yt-uix-button-destructive[disabled]:active,
.yt-uix-button-destructive[disabled]:focus {
 border-color:#cc181e;
 background:#cc181e;
 color:#fff
}
.yt-uix-button-destructive:hover {
 background:#b31217
}
.yt-uix-button-destructive:active,
.yt-uix-button-destructive.yt-uix-button-toggled,
.yt-uix-button-destructive.yt-uix-button-active,
.yt-uix-button-destructive.yt-uix-button-active:focus {
 background:#990c11;
 box-shadow:inset 0 1px 0 rgba(0,0,0,0.5)
}
.yt-uix-button-destructive[disabled]:active,
.yt-uix-button-destructive[disabled].yt-uix-button-toggled {
 box-shadow:none
}
.yt-uix-button-dark,
.yt-uix-button-dark[disabled],
.yt-uix-button-dark[disabled]:hover,
.yt-uix-button-dark[disabled]:active,
.yt-uix-button-dark[disabled]:focus {
 border-color:#333;
 background:#333;
 color:#fff
}
.yt-uix-button-dark:hover {
 background:#3c3c3c
}
.yt-uix-button-dark:active,
.yt-uix-button-dark.yt-uix-button-toggled,
.yt-uix-button-dark.yt-uix-button-active,
.yt-uix-button-dark.yt-uix-button-active:focus {
 background:#1a1a1a;
 box-shadow:inset 0 1px 0 rgba(0,0,0,0.5)
}
.yt-uix-button-dark[disabled]:active,
.yt-uix-button-dark[disabled].yt-uix-button-toggled {
 box-shadow:none
}
.yt-uix-button-light,
.yt-uix-button-light[disabled],
.yt-uix-button-light[disabled]:hover,
.yt-uix-button-light[disabled]:active,
.yt-uix-button-light[disabled]:focus {
 border-color:#666;
 background:#666;
 color:#fff
}
.yt-uix-button-light:hover {
 background:#6f6f6f
}
.yt-uix-button-light:active,
.yt-uix-button-light.yt-uix-button-toggled,
.yt-uix-button-light.yt-uix-button-active,
.yt-uix-button-light.yt-uix-button-active:focus {
 background:#4d4d3d;
 box-shadow:inset 0 1px 0 rgba(0,0,0,0.5)
}
.yt-uix-button-light[disabled]:active,
.yt-uix-button-light[disabled].yt-uix-button-toggled {
 box-shadow:none
}
.yt-uix-button-payment,
.yt-uix-button-payment[disabled],
.yt-uix-button-payment[disabled]:hover,
.yt-uix-button-payment[disabled]:active,
.yt-uix-button-payment[disabled]:focus {
 border-color:#61ad15;
 background:#61ad15;
 color:#fff
}
.yt-uix-button-payment:hover {
 background:#54900f
}
.yt-uix-button-payment:active,
.yt-uix-button-payment.yt-uix-button-toggled,
.yt-uix-button-payment.yt-uix-button-active,
.yt-uix-button-payment.yt-uix-button-active:focus {
 background:#478509;
 box-shadow:inset 0 1px 0 rgba(0,0,0,0.5)
}
.yt-uix-button-payment[disabled]:active,
.yt-uix-button-payment[disabled].yt-uix-button-toggled {
 box-shadow:none
}
.yt-uix-button-text,
.yt-uix-button-text[disabled] {
 border:solid 1px transparent;
 outline:0;
 background:none;
 color:#333;
 box-shadow:none
}
.yt-uix-button-blue-text {
 border:solid 1px transparent;
 outline:0;
 background:none;
 box-shadow:none
}
.yt-uix-button-blue-text[disabled] {
 border:solid 1px transparent;
 outline:0;
 background:none;
 color:#333;
 box-shadow:none
}
.yt-uix-button-blue-text {
 color:#167ac6
}
.yt-uix-button-link {
 padding:0;
 border:none;
 height:auto;
 background:transparent;
 color:#167ac6;
 font-weight:normal;
 font-size:inherit;
 text-decoration:none;
 box-shadow:none
}
.yt-uix-button-link:active,
.yt-uix-button-link:hover {
 background:transparent;
 text-decoration:underline;
 box-shadow:none
}
.yt-uix-button-link-strong {
 font-weight:500;
 font-size:12px
}
a.yt-uix-button {
 text-decoration:none;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
.yt-uix-button-group {
 display:inline-block;
 white-space:nowrap;
 vertical-align:middle
}
.yt-uix-button-group .yt-uix-button {
 margin-right:-1px;
 border-radius:0
}
.yt-uix-button-group .yt-uix-button:hover {
 position:relative;
 z-index:2147483645
}
.yt-uix-button-group .start {
 -moz-border-radius-topleft:2px;
 border-top-left-radius:2px;
 -moz-border-radius-bottomleft:2px;
 border-bottom-left-radius:2px
}
.yt-uix-button-group .end {
 margin-right:0;
 -moz-border-radius-topright:2px;
 border-top-right-radius:2px;
 -moz-border-radius-bottomright:2px;
 border-bottom-right-radius:2px
}
.yt-uix-button-arrow {
 margin-top:-3px;
 margin-left:5px;
 border:1px solid transparent;
 border-top-color:#333;
 border-width:4px 4px 0;
 width:0;
 height:0
}
.yt-uix-button-reverse .yt-uix-button-arrow {
 border-width:0 4px 4px;
 border-top-color:transparent;
 border-bottom-color:#333
}
.yt-uix-button-empty .yt-uix-button-arrow {
 margin-left:0
}
.yt-uix-button-primary .yt-uix-button-arrow,
.yt-uix-button-destructive .yt-uix-button-arrow,
.yt-uix-button-dark .yt-uix-button-arrow,
.yt-uix-button-light .yt-uix-button-arrow,
.yt-uix-button-payment .yt-uix-button-arrow {
 border-top-color:#fff
}
.yt-uix-button-primary.yt-uix-button-reverse .yt-uix-button-arrow,
.yt-uix-button-destructive.yt-uix-button-reverse .yt-uix-button-arrow,
.yt-uix-button-dark.yt-uix-button-reverse .yt-uix-button-arrow,
.yt-uix-button-light.yt-uix-button-reverse .yt-uix-button-arrow,
.yt-uix-button-payment.yt-uix-button-reverse .yt-uix-button-arrow {
 border-bottom-color:#fff
}
.yt-uix-button .yt-uix-button-menu {
 display:none
}
.yt-uix-button .yt-uix-button-menu:focus {
 outline:none
}
.yt-uix-button-menu {
 outline:none;
 padding:8px 0;
 position:absolute;
 border:1px solid #ccc;
 z-index:2147483647;
 overflow:auto;
 background:#fff;
 border-radius:2px
}
.yt-uix-button-menu-external {
 overflow:visible
}
.yt-uix-button-menu li {
 margin:0;
 padding:0
}
.yt-uix-button-menu li.yt-uix-button-menu-new-section-separator {
 padding-top:8px;
 margin-top:8px;
 border-top:1px solid #b8b8b8
}
.yt-uix-button-menu .yt-uix-button-menu-item {
 display:block;
 margin:0;
 padding:0 25px;
 color:#333;
 font-size:13px;
 text-decoration:none;
 white-space:nowrap;
 word-wrap:normal;
 line-height:25px;
 cursor:pointer;
 cursor:hand
}
.yt-uix-button-menu-item-selected .yt-uix-button-menu-item {
 font-weight:500
}
.yt-uix-button-menu .yt-uix-button-menu-item.selected,
.yt-uix-button-menu .yt-uix-button-menu-item-highlight .yt-uix-button-menu-item,
.yt-uix-button-menu .yt-uix-button-menu-item:hover {
 background-color:#333;
 color:#fff
}
.yt-uix-button-menu-mask {
 position:absolute;
 z-index:2147483646;
 opacity:0;
 filter:alpha(opacity=0);
 border:0;
 padding:0;
 margin:0
}
div.yt-uix-button-menu>table {
 background:#ebebeb;
 border-collapse:separate;
 border-spacing:1px
}
.yt-uix-button-menu .yt-uix-button-icon-checkbox {
 float:left;
 padding:5px 0 5px 4px
}
.yt-uix-button-menu .yt-uix-button-icon-dropdown-checked {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -174px;
 background-size:auto;
 width:15px;
 height:14px
}
.yt-uix-button-menu li:hover .yt-uix-button-icon-dropdown-checked {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -404px;
 background-size:auto;
 width:15px;
 height:14px
}
.yt-uix-button-icon-trash {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -20px -284px;
 background-size:auto;
 width:12px;
 height:16px
}
.yt-uix-button-icon-channel-back {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -313px -176px;
 background-size:auto;
 width:15px;
 height:10px
}
.rtl .yt-uix-button-icon-channel-back {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -381px -346px;
 background-size:auto;
 width:15px;
 height:10px
}
.yt-uix-button-icon-dismissal {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -252px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-uix-button-icon-settings {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -356px;
 background-size:auto;
 width:16px;
 height:16px
}
.yt-uix-button-icon-settings-material {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -152px -78px;
 background-size:auto;
 width:24px;
 height:24px
}
.yt-uix-button-icon-view-list {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -313px;
 background-size:auto;
 width:24px;
 height:24px
}
.yt-uix-button-icon-view-module {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -88px -198px;
 background-size:auto;
 width:24px;
 height:24px
}
.yt-uix-button-icon-close {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -16px -80px;
 background-size:auto;
 width:10px;
 height:10px
}
.yt-uix-button-icon-search {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -131px -174px;
 background-size:auto;
 width:15px;
 height:15px
}
.yt-uix-button-disabled-aria-label {
 display:none;
 opacity:0
}
.yt-uix-button[disabled]+.yt-uix-button-disabled-aria-label {
 display:block;
 position:absolute
}
.yt-uix-button.yt-uix-button-nakedicon {
 padding:0
}
.yt-uix-expander-arrow {
 vertical-align:middle;
 float:right;
 margin:0;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -353px;
 background-size:auto;
 width:16px;
 height:16px
}
.yt-uix-expander-arrow-left {
 vertical-align:middle;
 float:left;
 margin:0 5px 0 0;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -353px;
 background-size:auto;
 width:16px;
 height:16px
}
.yt-uix-expander-head {
 cursor:pointer;
 -moz-user-select:none;
 -ms-user-select:none;
 -webkit-user-select:none
}
.yt-uix-expander-collapsed .yt-uix-expander-arrow-left,
.yt-uix-expander-collapsed .yt-uix-expander-arrow {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -417px;
 background-size:auto;
 width:16px;
 height:16px
}
.yt-uix-expander .yt-uix-expander-collapsed-body,
.yt-uix-expander-collapsed .yt-uix-expander-body {
 display:none
}
.yt-uix-expander-collapsed .yt-uix-expander-collapsed-body {
 display:block
}
.yt-uix-expander-animated .yt-uix-expander-body {
 display:block;
 -moz-transition:all .2s ease-in;
 -o-transition:all .2s ease-in;
 -webkit-transition:all .2s ease-in;
 overflow:hidden
}
.yt-uix-expander-animated.yt-uix-expander-collapsed .yt-uix-expander-body {
 visibility:hidden;
 height:0!important
}
.yt-uix-expander-collapsed .collapsable {
 display:none
}
.yt-uix-button-livereminder-set,
.yt-uix-button-livereminder-set:hover {
 color:#fff;
 background:#167ac6;
 border-color:#167ac6
}
.yt-uix-livereminder-main-button.yt-uix-button-livereminder-set:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -460px -373px;
 background-size:auto;
 width:12px;
 height:12px
}
.yt-uix-livereminder-main-button:before {
 opacity:.6;
 filter:alpha(opacity=60);
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -80px;
 background-size:auto;
 width:12px;
 height:12px
}
.yt-uix-tabs-tab.epic-nav-item.disabled {
 color:#ccc;
 cursor:auto
}
.yt-uix-tabs-tab.epic-nav-item.disabled:hover {
 border-color:transparent
}
.yt-uix-button-subscription-container {
 max-width:100%;
 white-space:nowrap;
 display:inline-block
}
.yt-uix-button.yt-uix-button-subscribe-branded,
.yt-uix-button.yt-uix-button-subscribed-branded,
.yt-uix-button.yt-uix-button-subscribe-unbranded,
.yt-uix-button.yt-uix-button-subscribed-unbranded {
 max-width:100%
}
.yt-uix-button.yt-uix-button-subscribe-branded,
.yt-uix-button.yt-uix-button-subscribed-branded {
 padding:0 8px 0 5.5px;
 height:24px
}
.yt-uix-button.yt-uix-button-subscribe-unbranded,
.yt-uix-button.yt-uix-button-subscribed-unbranded {
 padding:0 8px 0 2px;
 height:20px
}
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-freetrial-eligible {
 padding:0 8px
}
.yt-uix-button-size-xlarge.yt-uix-button-subscribe-branded,
.yt-uix-button-size-xlarge.yt-uix-button-subscribed-branded {
 height:36px
}
.yt-uix-button-size-xlarge.yt-uix-subscription-button.yt-uix-button-subscribe-branded,
.yt-uix-button-size-xlarge.yt-uix-subscription-button.yt-uix-button-subscribed-branded {
 padding:0 20px
}
.yt-uix-button-size-xlarge.yt-uix-button-subscribe-branded .yt-uix-button-content,
.yt-uix-button-size-xlarge.yt-uix-button-subscribed-branded .yt-uix-button-content {
 font-size:15px
}
.yt-uix-button-subscribe-branded,
.yt-uix-button-subscribe-branded[disabled],
.yt-uix-button-subscribe-branded[disabled]:hover,
.yt-uix-button-subscribe-branded[disabled]:active,
.yt-uix-button-subscribe-branded[disabled]:focus {
 color:#fefefe;
 background-color:#e62117
}
.yt-uix-button-subscribe-branded:hover {
 background-color:#cc181e
}
.yt-uix-button-subscribe-branded.yt-is-buffered,
.yt-uix-button-subscribe-branded:active,
.yt-uix-button-subscribe-branded.yt-uix-button-toggled,
.yt-uix-button-subscribe-branded.yt-uix-button-active,
.yt-uix-button-subscribed-branded.external,
.yt-uix-button-subscribed-branded.external[disabled],
.yt-uix-button-subscribed-branded.external:active,
.yt-uix-button-subscribed-branded.external.yt-uix-button-toggled,
.yt-uix-button-subscribed-branded.external.yt-uix-button-active {
 background-color:#b31217
}
.yt-uix-button-subscribe-unbranded,
.yt-uix-button-subscribe-unbranded[disabled],
.yt-uix-button-subscribe-unbranded[disabled]:hover,
.yt-uix-button-subscribe-unbranded[disabled]:active,
.yt-uix-button-subscribe-unbranded[disabled]:focus {
 border:1px solid #ccc;
 background-color:#f8f8f8;
 color:#333
}
.yt-uix-button-subscribe-unbranded:hover {
 border-color:#bfbfbf;
 background-color:#f6f6f6
}
.yt-uix-button-subscribe-unbranded.yt-is-buffered,
.yt-uix-button-subscribe-unbranded:active,
.yt-uix-button-subscribe-unbranded.yt-uix-button-toggled,
.yt-uix-button-subscribe-unbranded.yt-uix-button-active {
 border-color:#bfbfbf;
 background-color:#ededed
}
.yt-uix-button-subscribed-branded,
.yt-uix-button-subscribed-branded[disabled],
.yt-uix-button-subscribed-branded[disabled]:hover,
.yt-uix-button-subscribed-branded[disabled]:active,
.yt-uix-button-subscribed-branded[disabled]:focus,
.yt-uix-button-subscribed-unbranded,
.yt-uix-button-subscribed-unbranded[disabled],
.yt-uix-button-subscribed-unbranded[disabled]:hover,
.yt-uix-button-subscribed-unbranded[disabled]:active,
.yt-uix-button-subscribed-unbranded[disabled]:focus {
 border:1px solid #ccc;
 background-color:#f8f8f8;
 color:#666
}
.yt-uix-button-subscribed-branded:active,
.yt-uix-button-subscribed-branded.yt-uix-button-toggled,
.yt-uix-button-subscribed-branded.yt-uix-button-active,
.yt-uix-button-subscribed-unbranded:active,
.yt-uix-button-subscribed-unbranded.yt-uix-button-toggled,
.yt-uix-button-subscribed-unbranded.yt-uix-button-active {
 background-color:#ededed
}
.yt-uix-button-subscribe-branded.ypc-enabled,
.yt-uix-button-subscribe-branded.ypc-enabled[disabled],
.yt-uix-button-subscribe-branded.ypc-enabled[disabled]:hover,
.yt-uix-button-subscribe-branded.ypc-enabled[disabled]:active,
.yt-uix-button-subscribe-branded.ypc-enabled[disabled]:focus {
 background-color:#61ad15
}
.yt-uix-button-subscribe-branded.ypc-enabled:hover {
 background-color:#54990f
}
.yt-uix-button-subscribe-branded.ypc-enabled.yt-is-buffered,
.yt-uix-button-subscribe-branded.ypc-enabled:active,
.yt-uix-button-subscribe-branded.ypc-enabled.yt-uix-button-toggled,
.yt-uix-button-subscribe-branded.ypc-enabled.yt-uix-button-active {
 background-color:#478509
}
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button[disabled],
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button[disabled]:hover,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button[disabled]:active,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button[disabled]:focus {
 border-color:#167ac6;
 background:#167ac6;
 color:#fff
}
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button:hover {
 background:#126db3
}
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button.yt-is-buffered,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button:active,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button.yt-uix-button-toggled,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button.yt-uix-button-active {
 background:#095b99;
 box-shadow:inset 0 1px 0 rgba(0,0,0,0.5)
}
.yt-uix-button-subscribed-branded.external {
 border-color:transparent;
 color:#fefefe
}
.exp-responsive #content .yt-uix-button-subscription-container .yt-short-subscriber-count {
 display:inline-block
}
.exp-responsive #content .yt-uix-button-subscription-container .yt-subscriber-count {
 display:none
}
@media only screen and (min-width:850px) {
 .exp-responsive #content .yt-uix-button-subscription-container .yt-short-subscriber-count {
  display:none
 }
 .exp-responsive #content .yt-uix-button-subscription-container .yt-subscriber-count {
  display:inline-block
 }
}
.yt-uix-button-subscribe-branded .yt-uix-button-content,
.yt-uix-button-subscribed-branded .yt-uix-button-content,
.yt-uix-button-subscribe-unbranded .yt-uix-button-content,
.yt-uix-button-subscribed-unbranded .yt-uix-button-content {
 display:inline-block;
 max-width:100%;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-uix-button-subscribe-branded .yt-uix-button-content,
.yt-uix-button-subscribed-branded .yt-uix-button-content {
 font-size:12px;
 font-weight:normal
}
.subscribe-label,
.subscribed-label,
.unsubscribe-label,
.unavailable-label,
.yt-uix-button-subscribed-branded.hover-enabled:hover .subscribed-label,
.yt-uix-button-subscribed-unbranded.hover-enabled:hover .subscribed-label {
 display:none;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
.yt-uix-button-subscribe-branded .subscribe-label,
.yt-uix-button-subscribe-branded .unavailable-label,
.yt-uix-button-subscribed-branded .subscribed-label,
.yt-uix-button-subscribed-branded.hover-enabled:hover .unsubscribe-label,
.yt-uix-button-subscribe-unbranded .subscribe-label,
.yt-uix-button-subscribe-unbranded .unavailable-label,
.yt-uix-button-subscribed-unbranded .subscribed-label,
.yt-uix-button-subscribed-unbranded.hover-enabled:hover .unsubscribe-label {
 display:inline
}
.fixed-width .subscribe-label,
.fixed-width .subscribed-label,
.fixed-width .unsubscribe-label,
.fixed-width .unavailable-label,
.yt-uix-button-subscribed-branded.fixed-width.hover-enabled:hover .subscribed-label,
.yt-uix-button-subscribed-unbranded.fixed-width.hover-enabled:hover .subscribed-label {
 display:block;
 height:0;
 visibility:hidden;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
.yt-uix-button-subscribe-branded.fixed-width .subscribe-label,
.yt-uix-button-subscribe-branded.fixed-width .unavailable-label,
.yt-uix-button-subscribed-branded.fixed-width .subscribed-label,
.yt-uix-button-subscribed-branded.fixed-width.hover-enabled:hover .unsubscribe-label,
.yt-uix-button-subscribe-unbranded.fixed-width .subscribe-label,
.yt-uix-button-subscribe-unbranded.fixed-width .unavailable-label,
.yt-uix-button-subscribed-unbranded.fixed-width .subscribed-label,
.yt-uix-button-subscribed-unbranded.fixed-width.hover-enabled:hover .unsubscribe-label {
 height:auto;
 visibility:visible
}
.yt-uix-button-subscription-container .unsubscribe-confirmation-overlay-container {
 display:none
}
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-music-subscription-button:before,
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-freetrial-eligible:before {
 display:none
}
.yt-uix-button-subscribe-branded.ypc-enabled.ypc-freetrial-eligible .yt-uix-button-content {
 vertical-align:middle
}
.yt-uix-button-subscribe-unbranded .yt-uix-button-icon-wrapper,
.yt-uix-button-subscribed-unbranded .yt-uix-button-icon-wrapper,
.yt-uix-button-subscribe-unbranded .yt-uix-button-valign,
.yt-uix-button-subscribed-unbranded .yt-uix-button-valign {
 display:none
}
.yt-uix-button-subscribe-unbranded.ypc-enabled .yt-uix-button-icon-wrapper,
.yt-uix-button-subscribe-unbranded.ypc-enabled .yt-uix-button-valign {
 display:inline-block
}
.yt-uix-button-subscribe-unbranded.ypc-enabled.ypc-music-subscription-button:before,
.yt-uix-button-subscribe-unbranded.ypc-enabled.ypc-freetrial-eligible:before {
 display:none
}
.yt-uix-button-subscribe-branded:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -284px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribe-branded.ypc-enabled:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -17px -62px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribe-branded.ypc-unavailable:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -75px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribe-unbranded.ypc-enabled:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -209px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribe-unbranded.ypc-enabled:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -248px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribed-branded:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -382px 0;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribed-branded.hover-enabled:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -368px -40px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribed-branded.external:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -90px -35px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-uix-button-subscribed-branded.hover-enabled.external:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -36px -284px;
 background-size:auto;
 width:16px;
 height:12px
}
.yt-subscription-button-disabled-mask-container {
 position:relative;
 display:inline-block
}
.yt-subscription-button-disabled-mask {
 display:none;
 position:absolute;
 top:0;
 right:0;
 bottom:0;
 left:0
}
.yt-subscription-button-disabled-mask-container .yt-subscription-button-disabled-mask {
 display:block
}
.yt-uix-subscription-preferences-button {
 display:none;
 margin-left:-2px;
 padding:0 4px;
 height:24px;
 border-radius:0 2px 2px 0
}
.yt-uix-button-subscribed-branded+.yt-uix-subscription-preferences-button {
 display:inline-block
}
.yt-uix-subscription-preferences-button .yt-uix-button-icon-wrapper {
 height:13px
}
.yt-uix-subscription-preferences-button:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -513px 0;
 background-size:auto;
 width:18px;
 height:18px
}
.yt-uix-subscription-preferences-button.yt-uix-subscription-notifications-all:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -20px;
 background-size:auto;
 width:18px;
 height:18px
}
.yt-uix-subscription-preferences-button.yt-uix-subscription-notifications-none:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -152px -56px;
 background-size:auto;
 width:18px;
 height:18px
}
.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-subscription-button-subscriber-count-unbranded-horizontal {
 display:none;
 margin-left:-2px;
 border:1px solid #ccc;
 background-color:#fafafa;
 vertical-align:middle;
 border-radius:0 2px 2px 0
}
.yt-subscription-button-subscriber-count-branded-horizontal.yt-uix-tooltip,
.yt-subscription-button-subscriber-count-unbranded-horizontal.yt-uix-tooltip {
 display:none
}
.yt-uix-button-subscribe-branded+.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-uix-button-subscribe-unbranded+.yt-subscription-button-subscriber-count-unbranded-horizontal,
.yt-uix-button-subscribe-branded+.yt-uix-subscription-preferences-button+.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-uix-button-subscribed-branded+.yt-subscription-button-subscriber-count-branded-horizontal.subscribed,
.yt-uix-button-subscribed-unbranded+.yt-subscription-button-subscriber-count-unbranded-horizontal.subscribed,
.yt-uix-button-subscribed-branded+.yt-uix-subscription-preferences-button+.yt-subscription-button-subscriber-count-branded-horizontal.subscribed {
 display:inline-block
}
.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-subscription-button-subscriber-count-unbranded-horizontal {
 padding:0 6px;
 color:#737373;
 font-size:11px;
 text-align:center
}
.yt-subscription-button-subscriber-count-branded-horizontal {
 height:22px;
 line-height:24px
}
.yt-subscription-button-subscriber-count-unbranded-horizontal {
 height:18px;
 line-height:20px
}
.yt-uix-button-subscribe-branded+.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-uix-button-subscribe-branded+.yt-uix-subscription-preferences-button+.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-uix-button-subscribed-branded.external+.yt-subscription-button-subscriber-count-branded-horizontal,
.yt-uix-button-subscribed-branded.external+.yt-uix-subscription-preferences-button+.yt-subscription-button-subscriber-count-branded-horizontal {
 border-left:none;
 padding-left:7px
}
.yt-subscribe-button-right {
 float:right
}
.yt-material-subscribe-button .yt-uix-button.yt-uix-button-subscribe-branded,
.yt-material-subscribe-button .yt-uix-button.yt-uix-button-subscribed-branded {
 border:none;
 padding:10px 16px;
 height:initial
}
.yt-material-subscribe-button .yt-uix-button-subscribe-branded:before,
.yt-material-subscribe-button .yt-uix-button-subscribed-branded:before {
 display:none
}
.yt-material-subscribe-button .yt-uix-button-subscribe-branded .yt-uix-button-content,
.yt-material-subscribe-button .yt-uix-button-subscribed-branded .yt-uix-button-content {
 font-size:14px;
 font-weight:500;
 letter-spacing:.007px;
 text-transform:uppercase
}
.yt-material-subscribe-button .yt-subscriber-count {
 margin:0 0 0 4px;
 padding:0;
 background:initial;
 border:initial;
 line-height:initial;
 vertical-align:initial;
 font-size:inherit
}
.yt-material-subscribe-button .yt-uix-button.yt-uix-button-subscribe-branded {
 background-color:hsl(3,81.8%,49.6%);
 color:#fff
}
.yt-material-subscribe-button .yt-uix-button.yt-uix-button-subscribed-branded {
 background-color:hsl(0,0%,93.3%);
 color:hsla(0,0%,6.7%,.6)
}
.yt-material-subscribe-button .yt-subscriber-count:before {
 content:' '
}
.yt-material-subscribe-button .yt-uix-button-subscribe-branded .yt-subscription-button-subscriber-count-branded-horizontal.yt-subscriber-count {
 color:rgba(255,255,255,0.8)
}
.yt-material-subscribe-button .yt-uix-button-subscribed-branded .yt-subscription-button-subscriber-count-branded-horizontal.yt-subscriber-count {
 color:rgba(17,17,17,0.6)
}
.yt-material-subscribe-button .yt-uix-button-subscribed-branded.hover-enabled:hover .subscribed-label {
 display:initial
}
.yt-material-subscribe-button .yt-uix-button-subscribed-branded.hover-enabled:hover .unsubscribe-label {
 display:none
}
.yt-material-subscribe-button .yt-uix-subscription-preferences-button {
 margin-left:10px
}
.exp-responsive #content .yt-material-subscribe-button.yt-uix-button-subscription-container .yt-subscriber-count {
 display:inline
}
.yt-uix-clickcard-content,
.yt-uix-hovercard-content,
* html .yt-uix-card-border-arrow,
* html .yt-uix-card-body-arrow {
 display:none
}
.yt-uix-clickcard-card,
.yt-uix-hovercard-card {
 position:absolute;
 z-index:2000000006;
 -moz-transition:opacity .2s ease-out;
 -webkit-transition:opacity .2s ease-out;
 transition:opacity .2s ease-out
}
.yt-uix-card-iframe-mask {
 position:absolute;
 z-index:2000000005
}
.yt-uix-clickcard-card-border,
.yt-uix-hovercard-card-border {
 float:left;
 background:#fff;
 border:1px solid #c5c5c5;
 box-shadow:0 0 15px rgba(0,0,0,.18)
}
.yt-uix-clickcard-card-body,
.yt-uix-hovercard-card-body {
 min-height:54px;
 overflow:hidden;
 font-size:13px;
 color:#555
}
.yt-uix-clickcard-card-content,
.yt-uix-hovercard-card-content {
 display:block;
 padding:20px;
 width:235px;
 line-height:1.3em
}
.yt-uix-clickcard-title,
.yt-uix-hovercard-title {
 margin-bottom:20px;
 font-weight:500;
 font-size:15px;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-uix-hovercard-card-reverse .yt-uix-card-arrow {
 display:block
}
.ie7 .yt-uix-card-arrow,
.ie8 .yt-uix-card-arrow {
 display:none
}
.yt-uix-card-arrow {
 position:absolute;
 display:none;
 top:-11px;
 width:24px;
 height:24px;
 margin-left:12px;
 overflow:hidden;
 -moz-transform:rotate(45deg);
 -ms-transform:rotate(45deg);
 -webkit-transform:rotate(45deg);
 transform:rotate(45deg);
 -moz-transform-origin:0 0;
 -ms-transform-origin:0 0;
 -webkit-transform-origin:0 0;
 transform-origin:0 0
}
.yt-uix-card-arrow-background {
 position:absolute;
 top:0;
 -moz-transform:rotate(-45deg);
 -ms-transform:rotate(-45deg);
 -webkit-transform:rotate(-45deg);
 transform:rotate(-45deg);
 -moz-transform-origin:0 0;
 -ms-transform-origin:0 0;
 -webkit-transform-origin:0 0;
 transform-origin:0 0
}
.yt-uix-card-border-arrow,
.yt-uix-card-body-arrow {
 position:absolute;
 width:0;
 height:0;
 vertical-align:top;
 background:none;
 border:12px solid transparent
}
.yt-uix-card-border-arrow-horizontal,
.yt-uix-card-body-arrow-horizontal {
 border-right-width:0
}
.yt-uix-card-border-arrow-vertical,
.yt-uix-card-body-arrow-vertical {
 bottom:-10px;
 border-bottom-width:0
}
.yt-uix-card-border-arrow-horizontal {
 right:-12px;
 border-left-color:#c5c5c5
}
.yt-uix-card-body-arrow-horizontal {
 right:-11px;
 border-left-color:#fff
}
.yt-uix-card-border-arrow-vertical {
 margin-bottom:-1px;
 border-top-color:#c5c5c5
}
.yt-uix-card-body-arrow-vertical {
 border-top-color:#fff
}
.yt-uix-clickcard-card-flip .yt-uix-card-border-arrow-horizontal,
.yt-uix-clickcard-card-flip .yt-uix-card-body-arrow-horizontal,
.yt-uix-hovercard-card-flip .yt-uix-card-border-arrow-horizontal,
.yt-uix-hovercard-card-flip .yt-uix-card-body-arrow-horizontal {
 right:auto;
 border-right-width:12px;
 border-left-width:0;
 border-left-color:transparent
}
.yt-uix-clickcard-card-flip .yt-uix-card-border-arrow-horizontal,
.yt-uix-hovercard-card-flip .yt-uix-card-border-arrow-horizontal {
 left:-12px;
 border-right-color:#c5c5c5
}
.yt-uix-clickcard-card-flip .yt-uix-card-body-arrow-horizontal,
.yt-uix-hovercard-card-flip .yt-uix-card-body-arrow-horizontal {
 left:-11px;
 border-right-color:#fff
}
.yt-uix-clickcard-card-reverse .yt-uix-card-border-arrow-vertical {
 bottom:auto;
 border-bottom-width:12px;
 border-top-color:transparent;
 border-top-width:0;
 top:-10px
}
.yt-uix-clickcard-card-reverse .yt-uix-card-body-arrow-vertical {
 bottom:auto;
 border-bottom-width:12px;
 border-top-color:transparent;
 border-top-width:0
}
.yt-uix-hovercard-card-reverse .yt-uix-card-border-arrow-vertical {
 bottom:auto;
 border-bottom-width:12px;
 border-top-color:transparent;
 border-top-width:0;
 top:-10px
}
.yt-uix-hovercard-card-reverse .yt-uix-card-body-arrow-vertical {
 bottom:auto;
 border-bottom-width:12px;
 border-top-color:transparent;
 border-top-width:0
}
.yt-uix-clickcard-card-reverse .yt-uix-card-border-arrow-vertical,
.yt-uix-hovercard-card-reverse .yt-uix-card-border-arrow-vertical {
 border-bottom-color:#c5c5c5;
 margin-top:-1px
}
.yt-uix-clickcard-card-reverse .yt-uix-card-body-arrow-vertical,
.yt-uix-hovercard-card-reverse .yt-uix-card-body-arrow-vertical {
 top:-10px;
 border-bottom-color:#fff
}
.yt-uix-clickcard-close {
 float:right;
 margin:-5px -5px 5px 5px
}
#ie .yt-uix-card-body-arrow-vertical {
 border-top-color:#fff
}
.yt-uix-hovercard-target,
.yt-uix-clickcard-target {
 cursor:pointer
}
.yt-uix-clickcard-promo .yt-uix-clickcard-card-border {
 background:#2793e6;
 border-color:#2793e6
}
.yt-uix-clickcard-promo .yt-uix-card-body-arrow-vertical {
 border-top-color:#2793e6
}
.yt-uix-clickcard-promo .yt-uix-card-body-arrow-horizontal {
 border-right-color:#2793e6
}
.yt-uix-clickcard-promo.yt-uix-clickcard-card-reverse .yt-uix-card-body-arrow-vertical {
 border-bottom-color:#2793e6
}
.yt-uix-clickcard-promo .yt-uix-clickcard-close {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -310px;
 background-size:auto;
 width:20px;
 height:20px
}
.yt-uix-clickcard-promo .yt-uix-clickcard-card-body {
 color:#fff
}
.yt-uix-clickcard-promo.guide-hint {
 position:fixed
}
.yt-uix-form-fielset {
 display:block;
 margin:10px 0
}
.yt-uix-form-list-option li {
 margin:5px 0
}
.yt-uix-form-legend,
.yt-uix-form-label {
 display:block;
 font-size:11px;
 font-weight:500;
 color:#333;
 text-transform:uppercase
}
.yt-uix-form-legend {
 padding-bottom:10px
}
.yt-uix-form-label .yt-uix-form-input-text,
.yt-uix-form-label .yt-uix-form-input-textarea {
 display:block
}
.yt-uix-form-label .yt-uix-form-input-text-container,
.yt-uix-form-label .yt-uix-form-input-textarea-container,
.yt-uix-form-label .yt-uix-form-input-select {
 margin-top:5px
}
.yt-uix-form-error {
 font-weight:normal;
 color:#e52d27
}
.yt-uix-form-error .yt-uix-form-error-message {
 display:block
}
.yt-uix-form-error input,
.yt-uix-form-error input:hover,
.yt-uix-form-error textarea,
.yt-uix-form-error textarea:hover,
.yt-uix-form-error .yt-uix-form-input-checkbox-element,
.yt-uix-form-error.yt-uix-form-input-checkbox-container:hover .yt-uix-form-input-checkbox-element,
.yt-uix-form-error .yt-uix-form-input-radio-element,
.yt-uix-form-error.yt-uix-form-input-radio-container:hover .yt-uix-form-input-radio-element {
 border-color:#e52d27
}
.yt-uix-form-error .yt-uix-form-input-text,
.yt-uix-form-error .yt-uix-form-input-textarea {
 margin-bottom:5px;
 margin-right:5px
}
.yt-uix-form-input-select,
.yt-uix-form-input-text,
.yt-uix-form-input-textarea {
 border:1px solid #d3d3d3;
 color:#333
}
.yt-uix-form-input-select:hover,
.yt-uix-form-input-text:hover,
.yt-uix-form-input-textarea:hover {
 border-color:#b9b9b9
}
.yt-uix-form-input-checkbox-element,
.yt-uix-form-input-radio-element,
.yt-uix-form-input-text,
.yt-uix-form-input-textarea {
 box-shadow:inset 0 0 1px rgba(0,0,0,.05)
}
.yt-uix-form-input-checkbox-container:hover .yt-uix-form-input-checkbox-element,
.yt-uix-form-input-radio-container:hover .yt-uix-form-input-radio-element {
 border-color:#b9b9b9
}
.yt-uix-form-input-select.focused,
.yt-uix-form-input-checkbox:focus+.yt-uix-form-input-checkbox-element,
.yt-uix-form-input-radio:focus+.yt-uix-form-input-radio-element,
.yt-uix-form-input-text:focus,
.yt-uix-form-input-textarea:focus {
 outline:0;
 border-color:#167ac6;
 box-shadow:inset 0 0 1px rgba(0,0,0,.1)
}
.yt-uix-form-input-select {
 position:relative;
 display:inline-block;
 font-weight:500;
 font-size:11px;
 vertical-align:middle;
 cursor:pointer;
 text-shadow:0 1px 0 rgba(255,255,255,.5);
 background-color:#f8f8f8;
 filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#fffcfcfc,EndColorStr=#fff8f8f8);
 background-image:-moz-linear-gradient(top,#fcfcfc 0,#f8f8f8 100%);
 background-image:-ms-linear-gradient(top,#fcfcfc 0,#f8f8f8 100%);
 background-image:-o-linear-gradient(top,#fcfcfc 0,#f8f8f8 100%);
 background-image:-webkit-linear-gradient(top,#fcfcfc 0,#f8f8f8 100%);
 background-image:linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%)
}
.yt-uix-form-input-select.hid {
 display:none
}
body .yt-uix-form-input-select-disabled {
 opacity:.6;
 filter:alpha(opacity=60)
}
.yt-uix-form-input-select-element {
 position:relative;
 height:26px;
 padding:0 16px;
 -webkit-appearance:none;
 -moz-appearance:none;
 opacity:0;
 filter:alpha(opacity=0);
 _filter:none
}
#ie .yt-uix-form-input-select-element,
.ie .yt-uix-form-input-select-element {
 min-width:100px;
 padding:0;
 font-size:13px
}
.yt-uix-form-input-select-element option {
 padding:0
}
.yt-uix-form-input-select-content {
 position:absolute;
 top:0;
 left:0;
 width:100%;
 height:100%;
 line-height:26px
}
.yt-uix-form-input-select-value {
 display:block;
 margin:0 10px;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
#ie .yt-uix-form-input-select-value,
.ie .yt-uix-form-input-select-value {
 margin:0 5px;
 *margin:0 0 0 5px
}
.yt-uix-form-input-select-arrow {
 float:right;
 width:0;
 height:0;
 border:1px solid transparent;
 border-width:4px 4px 0;
 border-top-color:#666;
 margin-top:11px;
 margin-right:10px
}
.yt-uix-form-input-text {
 width:250px;
 padding:5px 10px 6px;
 margin-top:0;
 margin-bottom:0;
 font-size:13px
}
.yt-uix-form-input-textarea {
 padding:5px 10px 6px;
 margin-top:0;
 margin-bottom:0;
 font-size:13px;
 width:550px;
 resize:vertical
}
.yt-uix-form-input-textarea[disabled],
.yt-uix-form-input-text[disabled] {
 opacity:.4;
 filter:alpha(opacity=40)
}
.yt-uix-form-input-text::-webkit-input-placeholder {
 color:#767676
}
.yt-uix-form-input-textarea::-webkit-input-placeholder {
 color:#767676
}
.yt-uix-form-input-text:-moz-placeholder,
.yt-uix-form-input-textarea:-moz-placeholder {
 color:#767676;
 opacity:1
}
.yt-uix-form-input-text::-moz-placeholder {
 color:#767676;
 opacity:1
}
.yt-uix-form-input-textarea::-moz-placeholder {
 color:#767676;
 opacity:1
}
.yt-uix-form-input-text:-ms-input-placeholder,
.yt-uix-form-input-textarea:-ms-input-placeholder,
.yt-uix-form-input-placeholder {
 color:#767676
}
.yt-uix-form-input-placeholder-container {
 position:relative;
 display:inline-block
}
.ie .yt-uix-form-input-placeholder {
 display:inline
}
.ie.ie10 .yt-uix-form-input-placeholder,
.ie.ie11 .yt-uix-form-input-placeholder {
 display:none
}
.ie .yt-uix-form-input-container.yt-uix-form-input-fluid-container,
.ie .yt-uix-form-label .yt-uix-form-input-container,
.yt-uix-form-input-fluid.yt-uix-form-input-placeholder-container {
 display:block
}
.yt-uix-form-input-placeholder-container {
 overflow:hidden
}
.yt-uix-form-input-placeholder {
 display:none;
 position:absolute;
 top:8px;
 left:9px;
 font-weight:normal;
 line-height:13px;
 font-size:13px;
 text-transform:none
}
.ie .yt-uix-form-error .yt-uix-form-input-text,
.ie .yt-uix-form-error .yt-uix-form-input-textarea {
 margin-bottom:0;
 margin-right:0
}
.ie .yt-uix-form-error .yt-uix-form-input-placeholder-container {
 margin-bottom:5px;
 margin-right:5px
}
.ie .yt-uix-form-input-non-empty .yt-uix-form-input-placeholder,
.ie .yt-uix-form-input-text:focus+.yt-uix-form-input-placeholder,
.ie .yt-uix-form-input-textarea:focus+.yt-uix-form-input-placeholder {
 display:none
}
.yt-uix-form-input-text+.yt-uix-form-input-placeholder {
 white-space:nowrap
}
.yt-uix-form-input-radio {
 width:14px;
 height:14px
}
.yt-uix-form-input-radio-element {
 width:14px;
 height:14px;
 border-radius:50%
}
#ie .yt-uix-form-input-radio-container.checked .yt-uix-form-input-radio-element,
.ie8 .yt-uix-form-input-radio-container.checked .yt-uix-form-input-radio-element,
.ie7 .yt-uix-form-input-radio-container.checked .yt-uix-form-input-radio-element,
.yt-uix-form-input-radio-container input:checked+.yt-uix-form-input-radio-element {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -211px -56px;
 background-size:auto;
 width:14px;
 height:14px
}
.yt-uix-form-input-checkbox,
.yt-uix-form-input-checkbox-element {
 width:14px;
 height:14px
}
#ie .yt-uix-form-input-checkbox-container.checked .yt-uix-form-input-checkbox-element,
.ie8 .yt-uix-form-input-checkbox-container.checked .yt-uix-form-input-checkbox-element,
.ie7 .yt-uix-form-input-checkbox-container.checked .yt-uix-form-input-checkbox-element {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -339px -437px;
 background-size:auto;
 width:14px;
 height:14px
}
.yt-uix-form-input-checkbox-container input:checked+.yt-uix-form-input-checkbox-element {
 border:1px solid #36649c;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -339px -437px;
 background-size:auto;
 width:14px;
 height:14px
}
.yt-uix-form-input-checkbox-container.partial .yt-uix-form-input-checkbox-element {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -363px -346px;
 background-size:auto;
 width:14px;
 height:14px
}
.yt-uix-form-input-radio-container,
.yt-uix-form-input-checkbox-container {
 position:relative;
 display:inline-block;
 height:20px;
 line-height:0;
 font-size:0;
 vertical-align:middle
}
.yt-uix-form-input-radio-element,
.yt-uix-form-input-checkbox-element {
 border:1px solid #c6c6c6;
 display:inline-block;
 vertical-align:middle;
 cursor:pointer
}
.ie8 .yt-uix-form-input-radio-element {
 border:0
}
.yt-uix-form-input-radio-container input:focus+.yt-uix-form-input-radio-element,
.yt-uix-form-input-checkbox-container input:focus+.yt-uix-form-input-checkbox-element {
 border:1px solid #4496e7;
 margin:0
}
.yt-uix-form-input-radio-container input[disabled]+.yt-uix-form-input-radio-element,
.yt-uix-form-input-checkbox-container input[disabled]+.yt-uix-form-input-checkbox-element {
 cursor:default;
 opacity:.4;
 filter:alpha(opacity=40)
}
.yt-uix-form-input-radio-container input,
.yt-uix-form-input-checkbox-container input {
 cursor:pointer;
 position:absolute;
 top:1px;
 left:1px;
 border:0;
 outline:0;
 margin:0;
 padding:0;
 -moz-appearance:none;
 -webkit-appearance:none
}
.yt-uix-form-input-container.yt-uix-form-input-fluid-container {
 display:block;
 overflow:hidden;
 padding-bottom:1px
}
.yt-uix-form-input-fluid {
 display:block;
 overflow:hidden;
 padding-bottom:1px;
 padding-right:22px
}
.yt-uix-form-input-fluid .yt-uix-form-input-text,
.yt-uix-form-input-fluid .yt-uix-form-input-textarea {
 width:100%
}
.yt-uix-form-select-fluid {
 overflow:hidden;
 padding-right:2px
}
.yt-uix-form-select-fluid .yt-uix-form-input-select,
.yt-uix-form-select-fluid select {
 width:100%
}
.yt-uix-checkbox-on-off {
 position:relative;
 display:inline-block;
 width:35px;
 height:15px;
 padding-right:2px;
 overflow:hidden;
 vertical-align:middle;
 cursor:pointer
}
.yt-uix-checkbox-on-off input[type=checkbox] {
 position:absolute;
 margin:0;
 width:37px;
 height:15px;
 opacity:0
}
.yt-uix-checkbox-on-off label {
 display:inline-block;
 border:1px solid transparent;
 height:13px;
 width:100%;
 background:#b8b8b8;
 border-radius:20px
}
.yt-uix-checkbox-on-off input[type=checkbox]:checked+label {
 background-color:#167ac6
}
.yt-uix-checkbox-on-off label>* {
 display:inline-block;
 height:100%;
 vertical-align:top;
 -moz-transition:width .1s;
 -webkit-transition:width .1s;
 transition:width .1s
}
.yt-uix-checkbox-on-off .checked {
 text-align:center;
 line-height:13px
}
.yt-uix-checkbox-on-off .checked:before {
 content:'';
 display:inline-block;
 vertical-align:middle;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -363px -335px;
 background-size:auto;
 width:10px;
 height:7px
}
.yt-uix-checkbox-on-off .toggle {
 background:#fbfbfb;
 width:13px;
 border-radius:13px
}
.yt-uix-checkbox-on-off .checked,
.yt-uix-checkbox-on-off input[type=checkbox]:checked+label .unchecked {
 width:0
}
.yt-uix-checkbox-on-off .unchecked,
.yt-uix-checkbox-on-off input[type=checkbox]:checked+label .checked {
 width:22px
}
.yt-uix-checkbox-on-off input[type=checkbox]:disabled+label {
 opacity:.5
}
.yt-uix-checkbox-on-off.large {
 width:54px;
 height:24px
}
.yt-uix-checkbox-on-off.large input[type=checkbox] {
 width:56px;
 height:24px
}
.yt-uix-checkbox-on-off.large label {
 height:22px;
 border-radius:22px
}
.yt-uix-checkbox-on-off.large .checked {
 line-height:22px
}
.yt-uix-checkbox-on-off.large label .toggle {
 width:22px;
 height:22px;
 border-radius:22px
}
.yt-uix-checkbox-on-off.large .unchecked,
.yt-uix-checkbox-on-off.large input[type=checkbox]:checked+label .checked {
 width:32px
}
.yt-uix-form-input-paper-toggle-container {
 display:inline-block;
 vertical-align:baseline;
 position:relative;
 top:5px;
 width:36px;
 height:14px
}
.yt-uix-form-input-paper-toggle-container.disabled {
 opacity:.5
}
.yt-uix-form-input-paper-toggle-container:hover {
 cursor:pointer
}
.yt-uix-form-input-paper-toggle-container input {
 position:absolute;
 width:0;
 height:0;
 opacity:0
}
.yt-uix-form-input-paper-toggle-bar {
 position:absolute;
 height:100%;
 width:100%;
 border-radius:8px;
 background-color:#000;
 opacity:.26;
 -moz-transition:background-color linear .08s;
 -webkit-transition:background-color linear .08s;
 transition:background-color linear .08s
}
.yt-uix-form-input-paper-toggle-button {
 position:absolute;
 top:-3px;
 height:20px;
 width:20px;
 border-radius:50%;
 box-shadow:0 1px 5px 0 rgba(0,0,0,.4);
 background-color:#f1f1f1;
 -moz-transition:transform linear .08s,background-color linear .08s;
 -webkit-transition:transform linear .08s,background-color linear .08s;
 transition:transform linear .08s,background-color linear .08s
}
.yt-uix-form-input-paper-toggle-container.checked .yt-uix-form-input-paper-toggle-bg {
 background-color:#4285f4
}
.yt-uix-form-input-paper-toggle-container.checked .yt-uix-form-input-paper-toggle-bar {
 opacity:.5
}
.yt-uix-form-input-paper-toggle-container.checked .yt-uix-form-input-paper-toggle-button {
 -moz-transform:translate(16px,0);
 -ms-transform:translate(16px,0);
 -webkit-transform:translate(16px,0);
 transform:translate(16px,0)
}
.yt-uix-menu-container,
.yt-uix-menu {
 display:inline-block;
 position:relative
}
.yt-uix-menu-content {
 position:absolute;
 z-index:2000000100
}
.yt-uix-menu-content .yt-uix-menu,
.yt-uix-menu-trigger {
 width:100%
}
.yt-uix-menu-content-hidden {
 display:none
}
.yt-uix-menu .yt-uix-menu-mask,
.yt-uix-menu .yt-uix-menu-content {
 left:100%;
 top:0
}
.yt-uix-menu.yt-uix-menu-sibling-content>.yt-uix-menu-mask,
.yt-uix-menu.yt-uix-menu-sibling-content>.yt-uix-menu-content {
 left:auto;
 top:0
}
.yt-uix-menu.yt-uix-menu-reversed>.yt-uix-menu-mask,
.yt-uix-menu.yt-uix-menu-reversed>.yt-uix-menu-content {
 top:auto;
 bottom:0
}
.yt-uix-menu.yt-uix-menu-flipped>.yt-uix-menu-mask,
.yt-uix-menu.yt-uix-menu-flipped>.yt-uix-menu-content {
 right:100%;
 left:auto
}
.yt-uix-menu-mask {
 border:0;
 filter:alpha(opacity=0);
 margin:0;
 opacity:0;
 overflow:visible;
 padding:0;
 position:absolute;
 z-index:2000000099
}
.yt-uix-menu-top-level-button-container,
.yt-uix-menu-top-level-button {
 display:inline-block
}
.yt-uix-menu-top-level-flow-button {
 margin-left:4px
}
.yt-uix-menu-top-level-button .yt-uix-button-opacity {
 padding:0
}
.service-endpoint-replace-enclosing-action-notification {
 text-align:center;
 color:#555;
 font-size:13px;
 line-height:1.3em
}
.yt-lockup .service-endpoint-replace-enclosing-action-notification {
 padding:15px 5px
}
.service-endpoint-replace-enclosing-action-notification .undo-replace-action {
 vertical-align:baseline;
 margin-top:10px
}
.replace-enclosing-action-options {
 margin-top:20px
}
.service-endpoint-replace-enclosing-action-notification .replace-enclosing-action-options .undo-replace-action {
 margin-top:0
}
.service-endpoint-replace-enclosing-action-notification .replace-enclosing-action-options .dismissal-follow-up-dialog-target {
 padding-top:10px
}
body.yt-dialog-active {
 height:100%;
 overflow:hidden
}
.yt-dialog-base,
.yt-uix-overlay-base {
 position:fixed;
 _position:absolute;
 top:0;
 left:0;
 width:100%;
 height:100%;
 text-align:center;
 z-index:2000000004;
 overflow:auto;
 -moz-user-select:none;
 -ms-user-select:none;
 -webkit-user-select:none
}
.yt-dialog-base .yt-uix-button-menu,
.yt-uix-overlay-base .yt-uix-button-menu {
 text-align:left
}
.yt-dialog-fg,
.yt-uix-overlay-fg {
 position:relative;
 background:#fff;
 border:1px solid #e2e2e2;
 outline:0;
 text-align:left;
 z-index:2000000003;
 box-shadow:0 0 15px rgba(0,0,0,.18);
 display:inline-block;
 -moz-user-select:text;
 -ms-user-select:text;
 -webkit-user-select:text
}
.no-focus-outline .yt-dialog-fg:focus {
 position:relative;
 background:#fff;
 border:1px solid #e2e2e2;
 outline:0;
 text-align:left;
 vertical-align:middle;
 z-index:2000000003;
 box-shadow:0 0 15px rgba(0,0,0,.18);
 display:inline-block;
 -moz-user-select:text;
 -ms-user-select:text;
 -webkit-user-select:text
}
.yt-dialog-fg:focus {
 box-shadow:0 0 0 2px rgba(27,127,204,0.4)
}
.yt-dialog-bg,
.yt-uix-overlay-bg {
 position:absolute;
 top:0;
 left:0;
 width:100%;
 border:none;
 z-index:2000000002;
 background-color:#fff;
 opacity:.8;
 filter:alpha(opacity=80)
}
.yt-dialog-bg {
 *display:none
}
.yt-dialog-align,
.yt-dialog-fg,
.yt-uix-overlay-align {
 vertical-align:middle;
 display:inline-block
}
.yt-uix-overlay-fg {
 vertical-align:middle;
 display:inline-block;
 *width:680px
}
.yt-dialog-align,
.yt-uix-overlay-align {
 height:100%
}
.yt-dialog-focus-trap {
 height:0
}
.yt-dialog-base .yt-dialog-header .yt-dialog-title,
.yt-uix-overlay-base .yt-uix-overlay-header .yt-dialog-title {
 margin:0;
 font-weight:500;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-dialog-base .yt-dialog-header .yt-dialog-close,
.yt-uix-overlay-base .yt-uix-overlay-header .yt-uix-overlay-close {
 float:right;
 border:0;
 background:none;
 height:auto;
 margin-top:10px;
 margin-right:-20px
}
.yt-dialog-base .yt-dialog-header .yt-dialog-close .yt-uix-button-content,
.yt-uix-overlay-base .yt-uix-overlay-header .yt-uix-overlay-close .yt-uix-button-content {
 display:block;
 text-indent:-9999em;
 color:#000;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -255px;
 background-size:auto;
 width:9px;
 height:9px;
 border-radius:3px
}
.yt-dialog-close .yt-uix-button-content {
 opacity:.5
}
.yt-dialog-close:hover .yt-uix-button-content {
 opacity:inherit
}
.yt-dialog-footer {
 clear:both;
 padding-top:20px;
 text-align:right
}
.yt-dialog-footer button {
 margin-left:10px
}
.yt-uix-overlay-content {
 display:none
}
.yt-dialog-fg-content,
.yt-uix-overlay-fg-content {
 overflow:hidden;
 padding:0 20px 20px;
 color:#333
}
.yt-dialog-fg-content .yt-dialog-title,
.yt-uix-overlay-fg-content .yt-dialog-title {
 color:#333;
 font-weight:500;
 font-size:15px;
 margin:0 -20px;
 padding-top:18px;
 padding-bottom:16px;
 vertical-align:middle;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.yt-dialog-fg-content .close-small,
.yt-uix-overlay-fg-content .close-small {
 background-color:#ccc;
 overflow:hidden;
 position:absolute;
 right:2px;
 top:2px;
 text-indent:-9999em
}
.yt-dialog-close,
.yt-dialog-close:hover,
.yt-dialog-close:focus {
 border-color:transparent;
 box-shadow:none
}
.yt-uix-overlay-actions {
 margin:20px -20px -20px;
 padding:15px 20px;
 text-align:right;
 background:#f1f1f1
}
.yt-uix-overlay-actions button {
 margin:0 3px
}
.yt-dialog-loading,
.yt-dialog-working {
 display:none
}
.yt-dialog-content {
 visibility:hidden
}
.yt-dialog-show-content .yt-dialog-content,
.yt-dialog-show-loading .yt-dialog-loading,
.yt-dialog-show-working .yt-dialog-working,
.yt-dialog-show-working .yt-dialog-content {
 display:block;
 line-height:1.3em;
 visibility:visible
}
.yt-dialog-waiting-content {
 position:absolute;
 top:50%;
 left:50%;
 margin-left:-50px
}
.yt-dialog-loading .yt-dialog-waiting-content {
 margin-top:-20px;
 font-size:14px;
 text-align:center
}
.yt-dialog-working-bubble .yt-dialog-waiting-content {
 margin-top:-25px
}
.yt-dialog-waiting-text {
 float:left;
 color:#000;
 margin-top:2px
}
.yt-dialog-working-overlay {
 position:absolute;
 height:100%;
 width:100%;
 top:-1px;
 left:-1px;
 border:1px solid #fff;
 background-color:#fff;
 opacity:.7;
 filter:alpha(opacity=70)
}
.yt-dialog-working-bubble {
 position:absolute;
 height:100px;
 width:200px;
 top:50%;
 left:50%;
 margin:-50px 0 0 -100px;
 background-color:#f1f1f1;
 border:1px solid #ddd;
 text-align:center;
 border-radius:6px
}
.yt-uix-overlay-simple .yt-dialog-header {
 background:#f1f1f1
}
.yt-uix-overlay-primary .yt-dialog-header {
 border-bottom:0;
 background-color:#fff
}
.yt-uix-overlay-primary .yt-dialog-header h2 {
 color:#000
}
.yt-uix-overlay-tiny .yt-dialog-header {
 height:35px;
 margin-bottom:20px
}
.yt-uix-overlay-tiny .yt-dialog-header .yt-dialog-title {
 font-size:15px;
 font-weight:500
}
.yt-uix-slider-body,
.yt-uix-shelfslider-body {
 position:relative;
 overflow:hidden
}
.yt-uix-slider-list,
.yt-uix-shelfslider-list {
 position:relative;
 left:0;
 white-space:nowrap;
 font-size:0;
 vertical-align:top;
 -moz-transition:left .3s ease-in-out;
 -webkit-transition:left .3s ease-in-out;
 transition:left .3s ease-in-out;
 display:inline-block
}
.yt-uix-slider-item,
.yt-uix-shelfslider-item {
 white-space:normal;
 vertical-align:top;
 display:inline-block
}
.yt-uix-slider-next-arrow,
.yt-uix-slider-prev-arrow {
 width:0;
 height:0;
 border:1px solid transparent;
 vertical-align:middle
}
.yt-uix-slider-next-arrow {
 border-width:10px 0 10px 10px;
 border-left-color:#999
}
.yt-uix-slider-prev-arrow {
 border-width:10px 10px 10px 0;
 border-right-color:#999
}
.yt-uix-button:hover .yt-uix-slider-next-arrow,
.yt-uix-button:focus .yt-uix-slider-next-arrow {
 border-left-color:#333
}
.yt-uix-button:hover .yt-uix-slider-prev-arrow,
.yt-uix-button:focus .yt-uix-slider-prev-arrow {
 border-right-color:#333
}
.yt-uix-button[disabled]:hover .yt-uix-slider-next-arrow,
.yt-uix-button[disabled]:focus .yt-uix-slider-next-arrow {
 border-left-color:#999
}
.yt-uix-button[disabled]:hover .yt-uix-slider-prev-arrow,
.yt-uix-button[disabled]:focus .yt-uix-slider-prev-arrow {
 border-right-color:#999
}
.yt-uix-tile {
 cursor:pointer
}
.yt-tile-default {
 display:block;
 padding:6px;
 font-size:11px;
 border-radius:3px;
 -moz-transition:background-color .18s;
 -webkit-transition:background-color .18s;
 transition:background-color .18s
}
.yt-tile-static {
 display:block;
 padding:6px;
 color:#666;
 font-size:11px;
 border-radius:3px;
 -moz-transition:background-color .18s;
 -webkit-transition:background-color .18s;
 transition:background-color .18s
}
.yt-tile-visible {
 display:block;
 padding:6px;
 font-size:11px;
 border-radius:3px;
 -moz-transition:background-color .18s;
 -webkit-transition:background-color .18s;
 transition:background-color .18s
}
.yt-tile-default,
.yt-tile-default a,
.yt-tile-visible,
.yt-tile-visible a {
 color:#333
}
.yt-tile-default h3,
.yt-tile-visible h3 {
 font-weight:500;
 font-size:13px;
 margin-bottom:5px
}
.yt-tile-default h3,
.yt-tile-default h3 a,
.yt-tile-visible h3,
.yt-tile-visible h3 a {
 color:#333
}
.yt-tile-default h3 a:visited,
.yt-tile-visible h3 a:visited {
 color:#036!important
}
.yt-tile-static,
.yt-tile-visible {
 background:#fff;
 box-shadow:0 1px 2px #ccc
}
.yt-tile-default:hover {
 background:#fff;
 box-shadow:0 1px 2px #ccc;
 -moz-transition:none;
 -webkit-transition:none;
 transition:none
}
.yt-tile-visible:hover {
 box-shadow:0 1px 3px rgba(0,0,0,.5),inset 0 -1px 0 #fff;
 background-image:-moz-linear-gradient(top,#fff 0,#f0f0f0 100%);
 background-image:-ms-linear-gradient(top,#fff 0,#f0f0f0 100%);
 background-image:-o-linear-gradient(top,#fff 0,#f0f0f0 100%);
 background-image:-webkit-linear-gradient(top,#fff 0,#f0f0f0 100%);
 background-image:linear-gradient(to bottom,#fff 0,#f0f0f0 100%);
 filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#fff,EndColorStr=#f0f0f0)
}
#ie .yt-tile-default {
 border-bottom:2px solid transparent
}
#ie .yt-tile-static,
#ie .yt-tile-visible,
#ie .yt-tile-default:hover {
 border-bottom:2px solid #ccc
}
#ie .yt-tile-visible:hover {
 border-bottom-color:#aaa
}
.yt-tile-static a,
.yt-tile-visible:hover a,
.yt-tile-default:hover a {
 color:#167ac6
}
.yt-uix-tooltip {
 display:inline-block
}
.yt-uix-tooltip.hid {
 display:none
}
.yt-uix-range-tooltip-tip,
.yt-uix-tooltip-tip {
 position:absolute;
 z-index:2147483647;
 opacity:0;
 -moz-transition:opacity .2s ease-out;
 -o-transition:opacity .2s ease-out;
 -webkit-transition:opacity .2s ease-out
}
.yt-uix-range-tooltip-tip-visible,
.yt-uix-tooltip-tip-visible {
 opacity:1;
 filter:alpha(opacity=100)
}
.yt-uix-range-tooltip-tip-body,
.yt-uix-tooltip-tip-body,
.yt-uix-tooltip-tip-mask {
 position:absolute;
 bottom:4px
}
.yt-uix-range-tooltip-tip-body,
.yt-uix-tooltip-tip-body {
 z-index:2147483647
}
.yt-uix-tooltip-tip-mask {
 z-index:999999;
 border:0;
 padding:0;
 margin:0;
 opacity:0;
 filter:alpha(opacity=0);
 height:0;
 width:0;
 left:0
}
.yt-uix-range-tooltip-tip-arrow,
.yt-uix-tooltip-tip-arrow {
 position:absolute;
 z-index:2147483647;
 bottom:-1px;
 width:0;
 height:0;
 vertical-align:top;
 border:1px solid transparent;
 border-width:5px 5px 0;
 border-top-color:#000;
 opacity:1;
 filter:alpha(opacity=100)
}
* html .yt-uix-range-tooltip-tip-arrow,
* html .yt-uix-tooltip-tip-arrow {
 display:none
}
.yt-uix-range-tooltip-tip-content,
.yt-uix-tooltip-tip-content {
 position:relative;
 padding:6px;
 color:#fff;
 background:#000;
 font-size:11px;
 font-weight:500;
 white-space:nowrap;
 border-radius:2px;
 box-shadow:0 1px 1px rgba(0,0,0,.25)
}
@-moz-document url-prefix() {
 .yt-uix-tooltip-tip-mask+.yt-uix-tooltip-tip-body>.yt-uix-tooltip-tip-content {
  background:#000;
  -moz-border-radius:0
 }
 .yt-uix-tooltip-tip-mask+.yt-uix-tooltip-tip-body+.yt-uix-tooltip-tip-arrow {
  border-top-color:#000
 }
}
.yt-uix-tooltip-tip-reverse .yt-uix-tooltip-tip-body,
.yt-uix-tooltip-tip-reverse .yt-uix-tooltip-tip-mask {
 bottom:auto;
 top:4px
}
.yt-uix-tooltip-tip-reverse .yt-uix-tooltip-tip-arrow {
 bottom:auto;
 top:0;
 border-width:0 5px 5px;
 border-color:#000;
 border-left-color:transparent;
 border-top-color:transparent;
 border-right-color:transparent
}
.yt-uix-tooltip-normal-wrap {
 white-space:normal;
 word-wrap:normal
}
.yt-uix-tooltip-tip .tooltip-label {
 font-weight:500
}
.yt-uix-tooltip-arialabel {
 position:absolute;
 top:-100px;
 opacity:0
}
.captcha-container {
 display:block;
 margin-left:10px
}
.captcha-image {
 border:1px solid #ccc;
 margin-right:10px;
 float:left
}
.captcha-input-label {
 display:block;
 color:#666
}
.captcha-input-container {
 float:left
}
.captcha-help {
 color:#4272db;
 font-size:90%;
 cursor:pointer
}
#hats-container {
 position:fixed;
 bottom:24px;
 right:24px;
 z-index:2000000001
}
#hats-container.hats-categorical-style-horizontal {
 background-color:#fff;
 box-shadow:0 8px 32px 0 rgba(0,0,0,0.5)
}
#hats-container.hats-categorical-style-vertical {
 background-color:#fff;
 box-shadow:0 8px 32px 0 rgba(0,0,0,0.5);
 width:325px
}
.hats-header {
 padding:16px;
 overflow:hidden;
 line-height:20px;
 background-color:#3d3d3d
}
.hats-categorical-style-horizontal .hats-header,
.hats-categorical-style-vertical .hats-header {
 padding:24px 24px 20px;
 background-color:#fff
}
.hats-title,
.hats-thanks {
 float:left;
 max-width:300px;
 color:#fff;
 font-size:13px;
 font-weight:normal;
 line-height:20px
}
.hats-categorical-style-vertical .hats-title,
.hats-categorical-style-vertical .hats-thanks {
 max-width:250px
}
.hats-categorical-style-horizontal .hats-title,
.hats-categorical-style-horizontal .hats-thanks,
.hats-categorical-style-vertical .hats-title,
.hats-categorical-style-vertical .hats-thanks {
 color:#333
}
.hats-categorical-style-horizontal .hats-title,
.hats-categorical-style-vertical .hats-title {
 font-weight:500;
 font-size:18px;
 line-height:26px
}
.hats-thanks a {
 color:#03a9f4;
 font-weight:500;
 text-transform:uppercase
}
.hats-dismiss {
 float:right;
 padding-left:16px;
 line-height:20px
}
.hats-categorical-style-vertical .hats-dismiss {
 padding-left:0
}
.hats-dismiss-text-button {
 height:auto;
 background:transparent
}
.hats-dismiss-icon-button {
 opacity:.5;
 cursor:pointer
}
.hats-dismiss-icon-button:hover {
 opacity:.6
}
.hats-dismiss-button,
.hats-dismiss-button:hover,
.hats-dismiss-button:active {
 padding:0;
 border:0;
 color:#03a9f4;
 font-size:13px;
 font-weight:500;
 text-transform:uppercase;
 box-shadow:none
}
.hats-content {
 padding:16px;
 background-color:#e9e9e9
}
.hats-categorical-style-horizontal .hats-content,
.hats-categorical-style-vertical .hats-content {
 padding:0;
 background-color:#fff
}
.hats-options {
 display:block;
 text-align:justify
}
.hats-options:after {
 display:inline-block;
 width:100%;
 content:''
}
.hats-categorical-style-vertical .hats-options:after {
 display:none
}
.hats-categorical-style-horizontal .hats-options {
 padding:0 24px
}
.hats-categorical-style-vertical .hats-options {
 margin-bottom:24px
}
.hats-option {
 display:inline-block
}
.hats-categorical-style-horizontal .hats-option:hover,
.hats-categorical-style-vertical .hats-option:hover {
 background-color:#eee;
 cursor:pointer
}
.hats-categorical-style-horizontal .hats-option {
 color:#767676
}
.hats-categorical-style-vertical .hats-option {
 display:list-item;
 color:#767676;
 font-size:16px;
 line-height:24px;
 vertical-align:middle;
 padding:6px 0
}
.hats-categorical-style-horizontal .hats-option label {
 cursor:pointer
}
.hats-categorical-style-vertical .hats-option label {
 display:block;
 cursor:pointer;
 padding:0 24px
}
.hats-categorical-style-vertical .hats-option .hats-option-button {
 padding:0 24px
}
button.hats-option-button {
 display:block;
 color:inherit;
 font-size:inherit;
 width:100%;
 line-height:inherit;
 text-align:inherit;
 cursor:pointer
}
.hats-categorical-style-vertical .hats-option .hats-option-checkbox-container {
 padding-right:16px
}
.hats-categorical-style-horizontal .hats-footer,
.hats-categorical-style-vertical .hats-footer {
 padding:8px 24px;
 height:36px;
 line-height:36px;
 vertical-align:middle
}
.hats-categorical-style-horizontal .hats-footer button,
.hats-categorical-style-vertical .hats-footer button {
 height:36px;
 line-height:36px;
 vertical-align:middle;
 text-transform:uppercase
}
.hats-categorical-style-horizontal .hats-submit-text-button,
.hats-categorical-style-vertical .hats-submit-text-button {
 float:right;
 outline:0;
 height:48px;
 border-color:transparent;
 padding:0;
 background:none;
 color:#4285f4;
 font-size:14px;
 line-height:48px;
 box-shadow:none
}
.hats-categorical-style-horizontal .hats-submit-text-button[disabled],
.hats-categorical-style-horizontal .hats-submit-text-button[disabled]:hover,
.hats-categorical-style-vertical .hats-submit-text-button[disabled],
.hats-categorical-style-vertical .hats-submit-text-button[disabled]:hover {
 background:none;
 cursor:default;
 color:#4285f4;
 opacity:.3
}
.hats-categorical-style-horizontal .hats-submit-text-button:active,
.hats-categorical-style-horizontal .hats-submit-text-button:hover,
.hats-categorical-style-vertical .hats-submit-text-button:active,
.hats-categorical-style-vertical .hats-submit-text-button:hover {
 cursor:pointer;
 border-color:transparent;
 background-color:#fff;
 box-shadow:none
}
.hats-spacer {
 display:inline-block;
 width:12px
}
.hats-legend {
 margin-top:8px;
 overflow:hidden;
 line-height:1.3em
}
.hats-categorical-style-horizontal .hats-legend,
.hats-categorical-style-vertical .hats-legend {
 color:#767676;
 margin:0 0 8px;
 padding:0 24px
}
.hats-legend-first {
 float:left;
 max-width:150px;
 word-spacing:150px;
 overflow:visible;
 text-align:left
}
.hats-legend-last {
 float:right;
 max-width:150px;
 word-spacing:150px;
 overflow:visible;
 text-align:right
}
.hats-categorical-style-horizontal .hats-legend-first,
.hats-categorical-style-horizontal .hats-legend-last,
.hats-categorical-style-vertical .hats-legend-first,
.hats-categorical-style-vertical .hats-legend-last {
 word-spacing:normal
}
.hats-option-icon,
.hats-option-icon:hover,
.hats-option-icon:active {
 padding:0;
 border:0;
 background:transparent;
 box-shadow:none
}
.hats-option-icon::before {
 opacity:1;
 filter:alpha(opacity=100)
}
.hats-option-icon:hover::before {
 opacity:1;
 filter:alpha(opacity=100)
}
.hats-option-icon:active::before {
 opacity:1;
 filter:alpha(opacity=100)
}
.hats-option-icon-very-happy::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -167px;
 background-size:auto;
 width:24px;
 height:24px
}
.hats-option-icon-happy::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -196px -28px;
 background-size:auto;
 width:24px;
 height:24px
}
.hats-option-icon-meh::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -365px;
 background-size:auto;
 width:24px;
 height:24px
}
.hats-option-icon-sad::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -144px -383px;
 background-size:auto;
 width:24px;
 height:24px
}
.hats-option-icon-very-sad::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -97px -351px;
 background-size:auto;
 width:24px;
 height:24px
}
.hats-logo {
 vertical-align:middle;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -344px -56px;
 background-size:auto;
 width:38px;
 height:15px
}
.signin-clickcard.yt-uix-clickcard-card-content {
 width:auto
}
.signin-clickcard-header {
 margin-bottom:15px;
 font-size:15px
}
.signin-clickcard-message {
 margin-bottom:10px;
 font-size:13px;
 line-height:1.3em
}
.signin-button.yt-uix-button {
 padding:0 40px;
 font-size:15px;
 height:35px
}
.signin-clickcard-netzdg-link {
 display:block;
 margin-bottom:10px
}
.yt-commentbox {
 position:relative;
 margin:0 0 30px
}
.yt-commentbox .yt-commentbox-working {
 display:none;
 position:absolute;
 left:50%;
 top:25%
}
.yt-commentbox.posting .yt-commentbox-ready {
 opacity:.25;
 pointer-events:none
}
.yt-commentbox.posting .yt-commentbox-working {
 display:block
}
.yt-commentbox-arrow {
 width:12px;
 height:12px;
 position:absolute;
 top:0;
 left:10px
}
.yt-commentbox-arrow-inner {
 top:1px;
 left:2px;
 position:absolute;
 border:7px solid white;
 z-index:1;
 border-bottom-color:transparent;
 border-left-color:transparent
}
.yt-commentbox-arrow-outer {
 top:0;
 left:0;
 position:absolute;
 border:6px solid #ddd;
 border-bottom-color:transparent;
 border-left-color:transparent
}
.yt-commentbox-container .yt-commentbox-arrow,
.yt-commentbox-top.reply .yt-commentbox-arrow {
 display:none
}
.yt-commentbox-photo {
 float:left;
 margin-right:10px
}
.yt-commentbox-text {
 margin:0 0 0 22px;
 border:1px solid #ddd;
 padding:6px 25px 5px 10px;
 min-height:48px;
 line-height:16px;
 overflow:auto;
 resize:vertical;
 background-color:#fff;
 border-radius:2px;
 box-shadow:inset 0 0 1px rgba(0,0,0,.05);
 color:#333;
 white-space:pre-wrap
}
.yt-commentbox-text:focus {
 border-color:#167ac6;
 box-shadow:inset 0 0 1px rgba(0,0,0,.1);
 outline:0
}
.yt-commentbox-text:focus+.yt-commentbox-arrow .yt-commentbox-arrow-outer {
 border-top-color:#167ac6;
 border-right-color:#167ac6
}
.yt-commentbox-input {
 margin:0 10px 0 0
}
.yt-commentbox-top.reply .yt-commentbox-text {
 margin-left:42px
}
.yt-commentbox-buttons {
 float:right;
 margin-top:5px
}
.yt-commentbox-button {
 margin-left:10px
}
.display-message {
 text-align:center;
 font-size:15px;
 font-weight:normal;
 color:#767676;
 padding:25px 15px;
 line-height:1.5
}
.display-message .display-message-thumbnail {
 padding:25px 15px
}
.yt-lockup-clarification {
 border-bottom:1px solid #f1f1f1;
 margin-bottom:10px;
 padding:15px
}
.yt-clarification-content {
 font-size:13px;
 line-height:1.4em;
 padding-right:24px
}
.yt-clarification-content .yt-clarification-text {
 color:#222;
 line-height:1.4em
}
.yt-clarification-content .yt-clarification-text.yt-ui-ellipsis-3 {
 max-height:4.2em
}
.yt-clarification-content .yt-lockup-action-menu {
 top:0
}
.yt-clarification-thumb {
 float:left;
 line-height:0;
 margin-right:15px
}
.comments .separator {
 margin:0 5px;
 vertical-align:top
}
.comments {
 position:relative
}
.comments .comments-list {
 box-sizing:border-box;
 padding:10px 0
}
.comments .feedback-banner {
 padding:10px 0;
 background:#fcf4d8;
 text-align:center
}
.comments .comments-list fieldset {
 min-width:0
}
@-moz-document url-prefix() {
 .comments .comments-list fieldset {
  display:table-cell
 }
}
.comments .right-content {
 display:inline-block;
 position:absolute;
 right:10px
}
.comments .video-thumb-rt .video-content {
 display:block;
 max-height:55px
}
.comments .thumb-title {
 display:block;
 margin-left:auto;
 margin-right:auto;
 max-width:100px;
 color:#888;
 text-align:center;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.comments .actions {
 display:inline-block;
 position:absolute;
 top:0;
 right:0
}
.comments .video-thumb-rt {
 display:inline-block;
 position:absolute;
 width:100px;
 top:0;
 right:0
}
.comments .video-thumb-rt .yt-uix-tooltip {
 text-decoration:none
}
.comments .buttons {
 display:inline-block;
 vertical-align:top
}
.comments-wait {
 position:absolute;
 top:0;
 bottom:0;
 left:0;
 right:0;
 background-color:#fff;
 opacity:.6
}
.comments-wait .yt-spinner-img {
 position:absolute;
 top:50px;
 left:50%
}
.comments .comment-entry {
 position:relative;
 margin:0;
 padding:0 0 26px;
 line-height:17px
}
.comments .comment-replies-header {
 margin:6px 0 16px 60px;
 color:#888
}
.comments .comment-replies-header .load-comments a,
.comments .comment-replies-header .hide-comments a {
 color:#2793e6;
 font-weight:500
}
.comments .comment-checkbox {
 display:inline-block;
 margin:14px 12px 0 0
}
.comments .reply .comment-checkbox {
 position:absolute;
 left:10px;
 margin:6px 0 0
}
.comments .comment-item {
 position:relative;
 margin-left:48px
}
.comments .comment-item.reply {
 margin:0;
 padding:12px 0 0 58px
}
.comments .comment-item .user-photo {
 float:left;
 margin-left:-48px;
 width:48px;
 height:48px;
 vertical-align:top;
 background-color:#ddd
}
.comments .comment-item.reply .user-photo {
 width:32px;
 height:32px;
 margin:3px 0 0
}
.comments .comment-item .content {
 padding:0 10px
}
.comments .comment-item.reply .content {
 margin-left:42px;
 padding:0;
 display:block
}
.comments .comment-header .user-name {
 vertical-align:top;
 color:#167ac6;
 font-weight:500;
 text-decoration:none;
 word-break:break-all
}
.comments .channel-owner .comment-header .user-name {
 background-color:#dbe4eb
}
.comments .comment-header .comment-renderer-verified-badge {
 border:none;
 padding:0
}
.comments .comment-header .linked-comment {
 display:inline-block;
 margin-top:4px;
 border:1px solid #ccc;
 padding:0 5px;
 color:#767676;
 font-size:10px;
 line-height:12px;
 vertical-align:top;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.comments .comment-header .time,
.comments .comment-header .moderation-reason {
 color:#767676;
 display:inline-block;
 font-size:11px;
 vertical-align:top
}
.comments .comment-header .time a {
 color:#767676
}
.comments .comment-header .spacer {
 color:#767676;
 margin:0 3px;
 font-size:11px
}
.comments .comment-header .visibility-link {
 display:inline-block;
 max-width:30%;
 vertical-align:top;
 color:#767676;
 font-size:11px;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.comments .comment-text .comment-text-content {
 max-height:104px;
 overflow:hidden;
 white-space:pre-wrap;
 word-wrap:break-word
}
.comments .comment-text.expanded .comment-text-content {
 max-height:none
}
.comments .comment-text.long .comment-text-toggle {
 display:block;
 color:#888
}
.comments .comment-text.expanded .comment-text-toggle .expand {
 display:none
}
.comments .comment-text.expanded .comment-text-toggle .collapse {
 display:inline
}
.comments .visibility-inspector {
 z-index:10000
}
.comments .comment-entry:hover .thumb-title,
.comments .comment-entry:hover .vis-inspect-link {
 color:#128ee9
}
.comments .vis-inspect-link {
 color:#888;
 font-weight:normal
}
.comments .comment-entry .vis-inspect-link {
 padding:0;
 height:12px;
 border:0
}
.comments .comment-item:hover .mod-buttonbar,
.comments .comment-item:hover .mod-buttonbar .mod-button {
 color:#000;
 border-color:#eee;
 opacity:1
}
.comments .mod-button {
 cursor:pointer
}
.comments .mod-button .default-state {
 opacity:.5
}
.comments .comment-item .mod-button .default-state.sprite_like,
.comments .comment-item .mod-button .default-state.sprite_dislike,
.comments .comment-item .creator-heart-big-unhearted {
 opacity:.2
}
.comments .comment-item:hover .mod-button .default-state.sprite_like,
.comments .comment-item:hover .mod-button .default-state.sprite_dislike,
.comments .comment-item:hover .creator-heart-big-unhearted {
 opacity:.4
}
.comments .comment-item:hover .mod-button .default-state:hover.sprite_like,
.comments .comment-item:hover .mod-button .default-state:hover.sprite_dislike,
.comments .comment-item:hover .creator-heart-big-unhearted:hover {
 opacity:.6
}
.comments:not(.embedded) .mod-button.disabled-s,
.comments.embedded .mod-button.disabled-e {
 opacity:.25!important;
 pointer-events:none
}
.comments .mod-button.on {
 opacity:1
}
.comments .mod-button.on .default-state {
 display:none
}
.comments .mod-button.on .on-state {
 display:inline-block
}
.comments .mod-button-content {
 display:inline-block;
 vertical-align:top
}
.comments .mod-button-content .mod-list-button {
 display:block;
 text-align:left
}
.comments .check-mark-container {
 margin-top:-3px;
 padding-left:11px;
 padding-right:4px;
 line-height:23px;
 visibility:hidden
}
.comments .is-checked .check-mark-container {
 visibility:visible
}
.comments .mod-list-button.approved-container,
.comments .mod-list-button.moderator-container {
 padding:3px 0
}
.comments .add-options-separator {
 height:1px;
 margin:9px 0 8px;
 background-color:#ccc
}
.comments .dropdown {
 display:inline-block
}
.comments .mod-arrow {
 display:inline-block;
 margin:-2px -3px 0 3px;
 vertical-align:top;
 font-size:9px
}
.comments .mod-list {
 position:absolute;
 right:0;
 margin-top:7px;
 border:1px solid #ccc;
 padding:8px 0;
 background-color:#fff;
 white-space:nowrap;
 min-width:150px;
 z-index:2
}
.comments .mod-list-button {
 background-color:#fff;
 cursor:pointer;
 font-size:13px;
 min-width:100%;
 padding:4px 12px 4px 29px
}
.comments .mod-list-button:hover {
 background-color:#555;
 color:#fff
}
.comments.embedded .mod-buttonbar .mod-button,
.comments.embedded .mod-buttonbar .mod-button-content {
 display:inline-block;
 border:0;
 padding:0
}
.comments.embedded .mod-button.disabled-e,
.comments.embedded .mod-button .sprite_approve,
.comments.embedded .mod-button .sprite_delete,
.comments.embedded .mod-button .sprite_flag,
.comments.embedded .mod-button .mod-arrow {
 display:none;
 padding:0
}
.comments .mod-list-button.embed {
 display:none
}
.comments.embedded .mod-list-button.embed {
 display:block
}
.comments.embedded .mod-button:hover {
 background-color:inherit
}
.comments.embedded .mod-button[data-action="flag"] {
 opacity:0
}
.comments.embedded .comment-item:hover .mod-button {
 opacity:.5
}
.comments.embedded .comment-entry .mod-button:hover,
.comments.embedded .mod-button.on {
 opacity:1
}
.comments.embedded .mod-list {
 margin-top:-2px
}
.comments .mod-buttonbar {
 display:inline-block;
 border-collapse:collapse
}
.comments .mod-buttonbar .mod-button {
 border:1px solid transparent
}
.comments .mod-buttonbar .mod-button-content {
 padding:6px 12px 4px
}
.comments .comment-footer-actions {
 margin-top:5px
}
.comments .comment-footer-action {
 color:#555;
 cursor:pointer;
 font-size:11px;
 font-weight:500;
 opacity:.75;
 vertical-align:top
}
.comments .like-count {
 margin-right:8px;
 color:#128ee9;
 font-size:9pt;
 vertical-align:top
}
.comments .comment-item .like-count.on,
.comments .comment-item.liked .like-count.off {
 display:none
}
.comments .comment-item .like-count.off,
.comments .comment-item.liked .like-count.on {
 display:inline
}
.comments .footer-button-bar {
 display:inline-block
}
.comments .comment-footer-actions .mod-button-content {
 margin-right:12px
}
.comments .comment-footer-action:hover,
.comments .comment-footer-actions .mod-button:hover {
 opacity:1
}
.comments .paginator {
 padding:10px 0;
 margin:15px 25px;
 cursor:pointer;
 font-weight:500;
 text-align:center;
 background-color:#f8f8f8;
 border:1px solid #d3d3d3;
 color:#333;
 font-size:12px;
 outline:0;
 background-image:-moz-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:-ms-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:-o-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:-webkit-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:linear-gradient(to top,#fcfcfc 0,#f8f8f8 100%)
}
.comments .paginator:hover {
 background-color:#f0f0f0;
 border-color:#c6c6c6;
 text-decoration:none;
 background-image:-moz-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-ms-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-o-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-webkit-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%)
}
.comments .paginator.activated {
 background-color:#f0f0f0;
 border-color:#c6c6c6;
 text-decoration:none;
 background-image:-moz-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-ms-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-o-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-webkit-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%);
 padding:6px 0
}
.comments .load-comments.activated .show-more {
 display:none
}
.comments .load-comments.activated .loading {
 display:inline
}
.comments .visibility-inspector {
 position:absolute
}
.comments .sprite_approve,
.comments #yt-comments-batch-a:before {
 display:inline-block;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -172px -74px;
 background-size:auto;
 width:14px;
 height:14px
}
.comments .sprite_caret {
 display:inline-block;
 opacity:.7;
 vertical-align:text-bottom
}
.comments .sprite_caret:hover {
 opacity:1
}
.comments .sprite_caret.down {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -152px -20px;
 background-size:auto;
 width:16px;
 height:16px
}
.comments .sprite_caret.up {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -152px -74px;
 background-size:auto;
 width:16px;
 height:16px
}
.comments .sprite_delete,
.comments #yt-comments-batch-r:before {
 display:inline-block;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -188px 0;
 background-size:auto;
 width:14px;
 height:14px
}
.comments .sprite_dislike {
 display:inline-block;
 vertical-align:top;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px 0;
 background-size:auto;
 width:14px;
 height:14px
}
.comments .sprite_dislike_on {
 display:none;
 vertical-align:top;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -30px 0;
 background-size:auto;
 width:14px;
 height:14px
}
.comments .sprite_flag,
.comments #yt-comments-batch-rs:before {
 display:inline-block;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -74px -74px;
 background-size:auto;
 width:14px;
 height:14px
}
.comments .sprite_like {
 display:inline-block;
 vertical-align:top;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px 0;
 background-size:auto;
 width:14px;
 height:14px
}
.comments .sprite_like_on {
 display:none;
 vertical-align:top;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px -74px;
 background-size:auto;
 width:14px;
 height:14px
}
@-webkit-keyframes pulse {
 30% {
  opacity:.6
 }
 60% {
  opacity:0
 }
 to {
  opacity:.6
 }
}
@keyframes pulse {
 30% {
  opacity:.6
 }
 60% {
  opacity:0
 }
 to {
  opacity:.6
 }
}
.attachment-editor {
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-flex-direction:row;
 flex-direction:row;
 -ms-flex-wrap:wrap;
 -webkit-flex-wrap:wrap;
 flex-wrap:wrap;
 -moz-justify-content:flex-start;
 -webkit-justify-content:flex-start;
 justify-content:flex-start;
 padding-left:2px
}
.attachment-editor-button {
 -webkit-flex-grow:0;
 flex-grow:0;
 -webkit-flex-shrink:0;
 flex-shrink:0;
 -webkit-flex-basis:auto;
 flex-basis:auto;
 -webkit-order:-1;
 order:-1;
 box-shadow:none;
 text-transform:uppercase;
 color:#128ee9;
 height:23px;
 padding:0;
 margin:0 0 8px 8px
}
.attachment-editor-button::before {
 opacity:.5
}
.attachment-editor-button:hover::before {
 opacity:.6
}
.attachment-editor-video-link-add::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -64px -52px;
 background-size:auto;
 width:19px;
 height:15px;
 margin:0
}
.attachment-editor-poll-option-add::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px -82px;
 background-size:auto;
 width:15px;
 height:15px;
 margin:0
}
.attachment-editor-image-add::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -40px -18px;
 background-size:auto;
 width:15px;
 height:15px;
 margin:0
}
.attachment-editor-poll-option-add-more {
 -webkit-order:1;
 order:1;
 height:auto;
 border:0
}
.attachment-editor-active .attachment-editor-video-link-add,
.attachment-editor-active .attachment-editor-poll-option-add,
.attachment-editor-active .attachment-editor-image-add,
.attachment-editor-poll-option-template {
 display:none
}
#attachment-editor-video-link {
 position:relative
}
#attachment-editor-video-link:hover yt-lockup-action-menu {
 display:none
}
.attachment-editor-alert {
 margin-bottom:10px
}
.video-link-preview-loading {
 display:none;
 width:auto;
 text-align:center;
 padding:10px
}
#attachment-editor-video-link.loading .video-link-preview-loading {
 display:block
}
.video-link-cancel {
 box-shadow:none;
 position:absolute;
 top:0;
 right:0;
 height:20px;
 padding:6px;
 border:0;
 opacity:.7;
 background-color:#fff;
 z-index:1
}
.video-link-cancel:hover {
 opacity:1
}
.video-link-cancel::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) 0 0;
 background-size:auto;
 width:8px;
 height:8px;
 vertical-align:super
}
.attachment-editor-poll-options {
 -ms-flex:1 100%;
 -webkit-flex:1 100%;
 flex:1 100%
}
.attachment-editor-poll-option {
 margin:0 0 12px
}
.attachment-editor-poll-option.yt-uix-form-error .yt-uix-form-input-text:focus {
 border-color:#e52d27
}
.attachment-editor-poll-option-counter {
 margin-left:8px;
 font-size:11px
}
.attachment-editor-poll-option:not(.yt-uix-form-error) .attachment-editor-poll-option-counter {
 color:#767676
}
.attachment-editor-poll-option-input {
 width:380px
}
.attachment-editor-poll-option-input::-webkit-input-placeholder {
 color:#b8b8b8
}
.attachment-editor-poll-option-input::-moz-placeholder {
 color:#b8b8b8
}
.attachment-editor-poll-option-input:-ms-input-placeholder {
 color:#b8b8b8
}
.yt-uix-form-error .attachment-editor-poll-option-input {
 margin:0
}
.attachment-editor-poll-option-clear {
 box-shadow:none;
 height:18px;
 padding:3px;
 margin:0 5px
}
.attachment-editor-poll-option-clear::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -173px -52px;
 background-size:auto;
 width:10px;
 height:10px;
 vertical-align:baseline
}
#attachment-editor-image-uploader {
 position:relative;
 margin-top:10px;
 overflow:hidden
}
.i-u-drop-zone {
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-flex-direction:column;
 flex-direction:column;
 -webkit-align-items:center;
 align-items:center;
 -moz-justify-content:center;
 -webkit-justify-content:center;
 justify-content:center;
 border-radius:2px;
 min-height:100px;
 border:2px dashed #ddd;
 padding:14px 10px 24px;
 color:#b8b8b8
}
.i-u-drop-zone.i-u-error {
 border-color:#e52d27
}
.i-u-hover {
 border-color:#167ac6
}
.comment-simplebox-edit .i-u-cancel,
.comment-simplebox-edit .video-link-cancel {
 display:none
}
.i-u-cancel {
 box-shadow:none;
 border-radius:0;
 position:absolute;
 top:0;
 right:0;
 height:20px;
 padding:6px;
 border:0;
 opacity:.7;
 background-color:#fff;
 z-index:1
}
.i-u-drop-zone .i-u-cancel {
 top:2px;
 right:2px
}
.i-u-cancel:hover {
 opacity:1
}
.i-u-cancel::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) 0 0;
 background-size:auto;
 width:8px;
 height:8px;
 vertical-align:super
}
.i-u-drop-prompt {
 font-size:13px;
 padding-top:6px;
 padding-bottom:14px
}
.i-u-license-text {
 font-size:11px;
 padding-top:12px
}
.i-u-drop-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -100px 0;
 background-size:auto;
 width:48px;
 height:48px
}
.i-u-preview-container {
 position:relative;
 display:inline-block
}
.i-u-preview-container.hid {
 display:none
}
.i-u-preview {
 max-width:100%;
 max-height:420px
}
.i-u-preview[src=''] {
 display:none
}
.creator-heart-background-unhearted {
 display:none
}
.creator-heart-background-hearted {
 width:16px;
 height:16px;
 padding:0;
 position:relative
}
.creator-heart-big-unhearted {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -112px -90px;
 background-size:auto;
 width:16px;
 height:16px;
 border:none;
 padding:0;
 position:relative;
 vertical-align:bottom;
 opacity:.42;
 background-color:transparent
}
.creator-heart-big-hearted {
 display:none
}
.creator-heart {
 position:relative;
 width:16px;
 height:16px;
 border:2px
}
.yt-uix-creator-heart-button {
 padding:0 7px 6px 0;
 margin:0 -7px -4px 0
}
.creator-heart-big-unhearted:hover,
.creator-heart-small-hearted:hover,
.yt-uix-creator-heart-button,
.yt-uix-creator-heart-button:hover {
 box-shadow:none;
 cursor:pointer
}
.creator-heart-big-unhearted:hover,
.yt-uix-creator-heart-button:hover:before {
 opacity:.54
}
.creator-heart-small-unhearted {
 display:none
}
.creator-heart-small-hearted {
 position:absolute;
 right:-7px;
 bottom:-4px
}
.creator-heart-small-container {
 position:relative;
 width:13px;
 height:13px
}
.creator-heart-small-left {
 position:absolute;
 right:0;
 bottom:1px;
 width:6px;
 height:10px;
 -webkit-border-radius:6px 6px 0 0;
 -moz-border-radius:6px 6px 0 0;
 border-radius:6px 6px 0 0;
 -webkit-transform:rotate(-45deg);
 -moz-transform:rotate(-45deg);
 -ms-transform:rotate(-45deg);
 -o-transform:rotate(-45deg);
 transform:rotate(-45deg);
 -webkit-transform-origin:0 100%;
 -moz-transform-origin:0 100%;
 -ms-transform-origin:0 100%;
 -o-transform-origin:0 100%;
 transform-origin:0 100%
}
.creator-heart-small-right {
 position:absolute;
 right:6px;
 bottom:1px;
 width:6px;
 height:10px;
 -webkit-border-radius:6px 6px 0 0;
 -moz-border-radius:6px 6px 0 0;
 border-radius:6px 6px 0 0;
 -webkit-transform:rotate(45deg);
 -moz-transform:rotate(45deg);
 -ms-transform:rotate(45deg);
 -o-transform:rotate(45deg);
 transform:rotate(45deg);
 -webkit-transform-origin:100% 100%;
 -moz-transform-origin:100% 100%;
 -ms-transform-origin:100% 100%;
 -o-transform-origin:100% 100%;
 transform-origin:100% 100%
}
.image-attachment-viewer {
 position:fixed;
 top:0;
 left:0;
 background:#000;
 height:100%;
 width:100%;
 z-index:2000000000
}
.i-a-v-image {
 position:absolute;
 top:0;
 bottom:0;
 left:0;
 right:0;
 margin:auto;
 width:auto;
 height:auto;
 max-width:100vw;
 max-height:100vh
}
.i-a-v-top-gradient {
 position:fixed;
 top:0;
 height:56px;
 width:100%;
 background-image:-moz-linear-gradient(top,rgba(0,0,0,0.6) 0,rgba(255,255,255,0) 100%);
 background-image:-ms-linear-gradient(top,rgba(0,0,0,0.6) 0,rgba(255,255,255,0) 100%);
 background-image:-o-linear-gradient(top,rgba(0,0,0,0.6) 0,rgba(255,255,255,0) 100%);
 background-image:-webkit-linear-gradient(top,rgba(0,0,0,0.6) 0,rgba(255,255,255,0) 100%);
 background-image:linear-gradient(to bottom,rgba(0,0,0,0.6) 0,rgba(255,255,255,0) 100%)
}
.i-a-v-close {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -36px -46px;
 background-size:auto;
 width:24px;
 height:24px;
 position:fixed;
 top:16px;
 right:24px;
 border:none
}
.i-a-v-comment-background {
 position:absolute;
 width:100%;
 max-height:25%;
 bottom:0;
 overflow-y:scroll;
 background-color:rgba(0,0,0,0.9)
}
.i-a-v-comment-background::-webkit-scrollbar {
 width:4px;
 background:transparent
}
.i-a-v-comment-background::-webkit-scrollbar-thumb {
 background:rgba(255,255,255,0.6)
}
.i-a-v-comment-header {
 position:relative;
 margin-left:24px;
 margin-right:24px;
 margin-top:16px
}
.i-a-v-comment-author-text {
 color:#fff;
 font-weight:500;
 margin-right:8px
}
.i-a-v-comment-author-text:hover {
 color:#4285f4
}
.i-a-v-comment-renderer-time a {
 color:#fff;
 margin-right:12px
}
.i-a-v-like-count {
 color:#4285f4
}
#comment-section-renderer .image-attachment-viewer .sprite-comment-actions {
 border:none
}
#comment-section-renderer .image-attachment-viewer .i-a-v-sprite-dislike:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px -92px;
 background-size:auto;
 width:14px;
 height:14px;
 opacity:.87;
 border:none
}
#comment-section-renderer .image-attachment-viewer .i-a-v-sprite-dislike:hover:before {
 opacity:1!important
}
#comment-section-renderer .image-attachment-viewer .i-a-v-sprite-dislike[aria-checked="true"]:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -30px 0;
 background-size:auto;
 width:14px;
 height:14px
}
#comment-section-renderer .image-attachment-viewer .i-a-v-sprite-like:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -186px -92px;
 background-size:auto;
 width:14px;
 height:14px;
 margin-left:8px;
 margin-right:8px;
 opacity:.87;
 border:none
}
#comment-section-renderer .image-attachment-viewer .i-a-v-sprite-like:hover:before {
 opacity:1!important
}
#comment-section-renderer .image-attachment-viewer .i-a-v-sprite-like[aria-checked="true"]:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px -74px;
 background-size:auto;
 width:14px;
 height:14px
}
.comment-renderer .i-a-v-like-count.on,
.comment-renderer.liked .i-a-v-like-count.off {
 display:none
}
.comment-renderer .i-a-v-like-count.off,
.comment-renderer.liked .i-a-v-like-count.on {
 display:inline
}
.i-a-v-comment-text-content {
 color:#fff;
 margin-left:24px;
 margin-right:24px;
 margin-top:8px;
 margin-bottom:16px
}
.i-a-v-comment-text-content a {
 color:#4285f4
}
.comment-poll-attachment {
 padding:0 27px 2px 0;
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-flex-direction:column;
 flex-direction:column
}
.comment-poll-footer {
 color:#555;
 opacity:.75
}
.comment-poll-footer:after {
 content:"•";
 margin:0 5px
}
.comment-poll-choice-results {
 text-align:left;
 word-wrap:normal;
 min-width:27px;
 width:27px;
 margin-right:9px
}
.comment-poll-choice {
 padding:0 2px 4px 0;
 font-weight:500;
 font-size:11px;
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-align-items:center;
 align-items:center
}
.comment-poll-choice:last-of-type {
 padding-bottom:0
}
.yt-uix-poll-choice-button,
.yt-uix-poll-choice-button:hover {
 padding:0;
 border:none;
 background-color:transparent;
 box-shadow:none;
 font-size:inherit;
 font-weight:inherit
}
.yt-uix-poll-choice-button[disabled],
.yt-uix-poll-choice-button[disabled]:hover {
 opacity:1;
 background:transparent;
 color:#000
}
.comment-poll-choice[aria-checked="true"] .comment-poll-choice-radio {
 background-color:white;
 border-color:white
}
.comment-poll-choice-radio {
 border-radius:12px;
 border-color:#767676;
 border-style:solid;
 border-width:1px;
 margin-right:5px;
 width:12px;
 height:12px;
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex
}
.comment-poll-choice[aria-checked="true"] .comment-poll-choice-radio-sprite {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -172px 0;
 background-size:auto;
 width:12px;
 height:12px
}
.comment-poll-choice-bar {
 min-width:28px;
 height:24px;
 border-radius:2px;
 background-color:#ddd
}
.comment-poll-choice-bar-inner {
 position:absolute;
 height:24px;
 padding-left:9px;
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-align-items:center;
 align-items:center
}
.comment-poll-choice[aria-checked="true"] {
 font-weight:500;
 color:#128ee9
}
.comment-poll-choice-bar-zero {
 background-color:transparent
}
.comment-poll-choice[aria-checked="true"] .comment-poll-choice-bar {
 background-color:#def0ff
}
.comment-poll-choice-closed {
 cursor:auto
}
.comment-poll-change-confirmation .yt-dialog-fg {
 width:300px
}
.promo-alert,
.comment-section-renderer-alert {
 margin:20px 0
}
.comment-section-renderer-items {
 margin-bottom:20px;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
.comment-section-renderer-items fieldset {
 min-width:0
}
.comment-section-renderer-items.loading {
 opacity:.25;
 pointer-events:none
}
.comment-section-renderer-items.loading .comment-section-items-loading {
 display:block
}
.comment-section-renderer-items .display-message {
 padding:0;
 margin-top:20px
}
.comment-renderer {
 overflow:hidden;
 position:relative;
 padding-right:20px
}
.comment-author-thumbnail {
 float:left;
 margin-right:10px
}
.comment-renderer .comment-renderer-content {
 overflow:hidden;
 min-height:48px
}
.comment-section-renderer-constrained .comment-renderer-content,
.comment-section-renderer-constrained .comment-simplebox,
.comment-section-renderer-constrained .comment-simplebox-renderer-collapsed,
.comment-section-renderer-constrained .comment-moderation-panel-renderer {
 max-width:502px
}
.comment-section-renderer-constrained .comment-replies-renderer .comment-renderer-content,
.comment-section-renderer-constrained .comment-replies-renderer .comment-simplebox {
 max-width:460px
}
.comment-section-renderer-constrained .comment-replies-renderer .comment-renderer-creator-reply .comment-renderer-content,
.comment-section-renderer-constrained .comment-replies-renderer .comment-renderer-creator-reply .comment-simplebox,
.comment-section-renderer-constrained .comment-replies-renderer .comment-simplebox-renderer-creator-reply .comment-simplebox {
 max-width:418px
}
.comment-renderer .comment-renderer-like-count.on,
.comment-renderer.liked .comment-renderer-like-count.off {
 display:none
}
.comment-renderer .comment-renderer-like-count.off,
.comment-renderer.liked .comment-renderer-like-count.on {
 display:inline
}
.comment-renderer.loading,
.comment-thread-renderer.loading {
 opacity:.25;
 pointer-events:none
}
.comment-renderer.loading .comment-renderer-loading,
.comment-thread-renderer.loading .comment-renderer-loading {
 display:block
}
.comment-simplebox-content+.comment-renderer-content {
 display:none
}
.comment-section-items-loading {
 display:none;
 left:50%;
 position:relative;
 top:38%
}
.comment-action-buttons-renderer-thumb {
 cursor:pointer
}
.comment-action-buttons-toolbar .yt-uix-button,
.comment-moderation-buttons-renderer .yt-uix-button {
 border:none;
 vertical-align:top
}
.creator-heart-hint {
 display:inline-block
}
.creator-heart-hint .yt-uix-clickcard-target {
 height:16px;
 display:block
}
#comment-section-renderer .sprite-comment-actions {
 height:14px;
 padding:0 3px;
 vertical-align:top;
 background:transparent;
 box-shadow:none
}
#comment-section-renderer .sprite-comment-actions:hover {
 box-shadow:none
}
#comment-section-renderer .sprite-comment-actions:before {
 opacity:.54
}
#comment-section-renderer .comment-renderer .sprite-comment-actions:hover:before {
 opacity:.6
}
#comment-section-renderer .comment-renderer .sprite-comment-actions[aria-checked="true"]:before {
 opacity:1
}
#comment-section-renderer .sprite-dislike:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px 0;
 background-size:auto;
 width:14px;
 height:14px
}
#comment-section-renderer .sprite-dislike[aria-checked="true"]:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -30px 0;
 background-size:auto;
 width:14px;
 height:14px
}
#comment-section-renderer .sprite-like:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px 0;
 background-size:auto;
 width:14px;
 height:14px
}
#comment-section-renderer .sprite-like[aria-checked="true"]:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px -74px;
 background-size:auto;
 width:14px;
 height:14px
}
.comment-section-sort-menu {
 margin-bottom:20px
}
.comment-replies-sort-menu {
 margin:12px 0 4px
}
.comment-replies-renderer-pages.loading {
 position:relative;
 opacity:.25;
 pointer-events:none
}
.comment-replies-renderer-pages.loading>.comment-renderer-loading {
 display:block;
 left:50%;
 position:absolute;
 top:50px
}
.comment-renderer-loading {
 display:none;
 left:45%;
 position:absolute
}
.comment-renderer-action-menu {
 position:absolute;
 right:0;
 top:0
}
.pinned-comment-hint {
 display:inline-block;
 position:absolute;
 top:10px;
 right:20px
}
#comment-section-renderer .comment-renderer:hover .comment-action-buttons-toolbar .yt-uix-menu-trigger {
 opacity:.8
}
.comment-renderer-like-count {
 margin-right:8px;
 color:#128ee9;
 font-size:9pt;
 vertical-align:top
}
.comment-renderer-pinned-comment-badge::before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -112px -74px;
 background-size:auto;
 width:12px;
 height:12px;
 background-repeat:no-repeat;
 display:inline-block;
 margin-left:-3px;
 margin-right:0;
 vertical-align:middle;
 content:""
}
.comment-renderer-pinned-comment-badge {
 color:#767676;
 font-size:11px;
 margin-bottom:4px
}
.comment-renderer-author-comment-badge.creator {
 background-color:#008bec;
 border-radius:9px;
 padding:1px 6px;
 vertical-align:middle
}
.comment-renderer-author-comment-badge.creator .comment-author-text {
 color:#fff;
 font-size:12px
}
.comment-renderer-author-comment-badge .yt-comment-author-verified-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -235px -332px;
 background-size:auto;
 width:12px;
 height:9px
}
.comment-renderer-author-comment-badge .yt-comment-author-verified-icon:hover {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -232px;
 background-size:auto;
 width:12px;
 height:9px
}
.comment-renderer-author-comment-badge.creator .yt-comment-author-verified-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -172px -92px;
 background-size:auto;
 width:10px;
 height:10px
}
.comment-renderer-author-comment-badge .comment-author-verified-badge {
 border:none;
 height:10px;
 padding-right:0
}
.comment-author-text {
 color:#128ee9;
 font-weight:500;
 text-decoration:none;
 word-break:break-all
}
.comment-renderer.channel-owner .comment-author-text {
 background-color:#dbe4eb
}
.comment-renderer-header .comment-renderer-linked-comment {
 margin:0 5px;
 border:1px solid #ccc;
 padding:0 5px;
 color:#767676;
 font-size:10px;
 line-height:12px;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.comment-renderer-header .comment-renderer-time {
 color:#767676;
 font-size:11px;
 margin-left:6px
}
.comment-renderer-header .comment-renderer-time a {
 color:#767676
}
.comment-renderer-header .comment-renderer-moderation-reason:before {
 content:"•";
 margin-right:6px
}
.comment-renderer-header .comment-renderer-moderation-reason {
 color:#767676;
 font-size:11px;
 margin-left:6px
}
.comment-renderer-header .comment-renderer-verified-badge {
 border:none;
 padding:0 0 0 3px
}
.zero-state-message {
 margin-top:16px;
 text-align:center
}
.backstage-logo {
 margin:auto;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-backstage-vfl-nm6RK.webp) 0 0;
 background-size:auto;
 width:140px;
 height:140px
}
.message-title {
 margin-bottom:8px;
 color:#000;
 font-size:18px;
 line-height:24px
}
.message-text {
 margin-bottom:16px;
 color:#000;
 font-size:14px;
 line-height:21px
}
.message-link {
 margin-bottom:24px;
 text-transform:uppercase;
 color:#167ac6;
 font-size:13px;
 line-height:16px
}
.message-footer {
 padding-top:24px;
 color:#b8b8b8;
 border-top:1px solid #f1f1f1
}
.comment-renderer-image-attachment {
 margin:2px 0;
 display:inline-block
}
.comment-renderer-image-attachment .comment-image {
 max-width:100%;
 max-height:420px
}
.comment-renderer-text {
 margin:3px 0 8px
}
.comment-renderer-text-content {
 max-height:65px;
 overflow:hidden;
 white-space:pre-wrap;
 word-wrap:break-word;
 margin-bottom:8px
}
.comment-renderer-text-content:empty {
 display:none
}
.comment-renderer-text-content.expanded {
 max-height:none
}
.comment-text-toggle {
 margin:-8px 0 10px
}
.comment-renderer-text-prologue {
 font-weight:500;
 padding-bottom:2px
}
.comment-replies-renderer {
 margin-left:58px
}
.comment-replies-renderer .comment-renderer,
.comment-replies-renderer .feedback-banner {
 margin:12px 0
}
.comment-renderer.comment-renderer-creator-reply,
.feedback-banner.comment-renderer-creator-reply,
.comment-simplebox-renderer-creator-reply {
 margin-left:42px
}
.comment-replies-renderer .comment-renderer-content {
 min-height:32px
}
.comment-replies-renderer-paginator {
 display:block;
 margin:6px 0 0;
 color:#2793e6;
 font-weight:500
}
.comment-replies-renderer-view,
.comment-replies-renderer-hide {
 margin:6px 0 0;
 color:#2793e6;
 font-weight:500
}
.comment-replies-renderer-expander-down:after {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -152px -20px;
 background-size:auto;
 width:16px;
 height:16px;
 content:"";
 display:inline-block;
 opacity:.7;
 vertical-align:text-bottom
}
.comment-replies-renderer-expander-up:after {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -152px -74px;
 background-size:auto;
 width:16px;
 height:16px;
 content:"";
 display:inline-block;
 vertical-align:text-bottom
}
.comment-replies-renderer-paginator:hover:after,
.comment-replies-renderer-view:hover:after {
 opacity:1
}
.comment-section-header-renderer {
 padding:0 0 20px;
 text-transform:uppercase;
 font-size:13px;
 color:#555
}
.comment-simplebox {
 background-color:#fff;
 overflow:hidden;
 display:none;
 position:relative
}
.comment-simplebox-content>.comment-simplebox {
 display:block
}
.comment-simplebox-frame {
 border:1px solid #d5d5d5;
 border-radius:2px;
 box-shadow:inset 0 0 1px rgba(0,0,0,.05);
 margin-left:11px;
 margin-bottom:8px;
 padding:10px;
 min-height:28px
}
.comment-simplebox:not(.yt-uix-form-error).focus .comment-simplebox-frame {
 border-color:#167ac6;
 box-shadow:inset 0 0 1px rgba(0,0,0,.1)
}
.comment-simplebox:not(.yt-uix-form-error).focus .comment-simplebox-arrow .arrow-outer {
 border-right-color:#167ac6;
 border-top-color:#167ac6
}
.yt-uix-form-error .comment-simplebox-frame {
 border-color:#e52d27
}
.yt-uix-form-error .comment-simplebox-arrow .arrow-outer {
 border-right-color:#e52d27;
 border-top-color:#e52d27
}
.comment-simplebox-arrow {
 height:12px;
 position:absolute;
 top:0;
 width:12px;
 left:0;
 margin:0
}
.comment-simplebox-arrow .arrow-inner {
 border:7px solid #fff;
 left:2px;
 top:1px;
 z-index:1
}
.comment-simplebox-arrow .arrow-outer {
 border:6px solid #d5d5d5;
 left:0;
 top:0
}
.comment-simplebox-arrow .arrow-inner,
.comment-simplebox-arrow .arrow-outer {
 border-bottom-color:transparent;
 border-left-color:transparent;
 position:absolute
}
.comment-simplebox-error-message {
 -webkit-flex-grow:1;
 flex-grow:1;
 -webkit-flex-basis:0;
 flex-basis:0;
 -webkit-align-self:center;
 align-self:center;
 color:#e62117;
 font-size:11px;
 margin-left:11px
}
.comment-simplebox-error .comment-simplebox-error-message {
 display:initial
}
.comment-simplebox-error-message:empty:after {
 content:attr(data-placeholder)
}
.comment-simplebox-text,
.comment-simplebox-prompt {
 background-color:#fff;
 color:#333;
 line-height:16px;
 text-align:left
}
.comment-simplebox-text {
 min-height:inherit;
 overflow:hidden;
 white-space:pre-wrap
}
.comment-simplebox-prompt:not(:empty)+.comment-simplebox-text {
 min-height:22px
}
.comment-simplebox-text-reduced-height {
 min-height:16px
}
.comment-simplebox-text:empty:after {
 content:attr(data-placeholder);
 color:#b8b8b8;
 display:inline-block;
 width:0;
 white-space:nowrap
}
.comment-simplebox-prompt {
 font-weight:500;
 word-wrap:normal
}
.comment-simplebox-text:focus {
 outline:0
}
.comment-simplebox-controls {
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-flex-direction:row;
 flex-direction:row;
 -ms-flex-wrap:wrap;
 -webkit-flex-wrap:wrap;
 flex-wrap:wrap;
 -webkit-align-items:flex-end;
 align-items:flex-end
}
.comment-simplebox-buttons {
 margin-left:auto
}
.comment-simplebox-buttons>* {
 margin-left:10px
}
.comment-simplebox-loading {
 display:none;
 left:50%;
 position:absolute;
 top:38%
}
.comment-simplebox.submitting {
 opacity:.25;
 pointer-events:none
}
.comment-simplebox.submitting .comment-simplebox-loading {
 display:block
}
.comment-simplebox-renderer,
.comment-renderer-replybox {
 overflow:hidden;
 position:relative
}
.comment-simplebox-renderer {
 padding:0 0 20px;
 margin-bottom:20px;
 border-bottom:1px solid #e2e2e2
}
.comment-simplebox-renderer-collapsed {
 display:block;
 overflow:hidden;
 position:relative;
 text-align:left
}
.comment-simplebox-content+.comment-simplebox-renderer-collapsed {
 display:none
}
.comment-simplebox-renderer-collapsed-content {
 border:1px solid #d5d5d5;
 color:#b8b8b8;
 cursor:pointer;
 margin-left:11px;
 min-height:28px;
 border-radius:2px;
 padding:10px
}
.comment-renderer-reply {
 color:#555;
 opacity:.75
}
.comment-renderer-reply:hover,
.comment-renderer:hover .comment-renderer-reply {
 text-decoration:none;
 opacity:1
}
.has-creator-reply .comment-renderer-reply,
.has-creator-reply .comment-renderer-replybox.comment-simplebox-content {
 display:none
}
.comment-renderer-reply:after {
 content:"•";
 margin:0 5px
}
.comment-renderer-replybox {
 display:none;
 margin-top:10px
}
.comment-renderer-replybox.comment-simplebox-content {
 display:block
}
.comment-thread-renderer {
 margin:0 10px 30px 0;
 line-height:1.3em
}
.comment-video-link {
 border:1px solid #ddd;
 padding:10px;
 margin:10px 0
}
.comment-video-link .yt-lockup-title {
 margin-right:30px
}
.comment-video-link .yt-lockup-title>a {
 color:#333
}
.comment-video-link:hover .yt-lockup-title>a {
 color:#167ac6
}
.comment-section-renderer-paginator {
 margin:15px 25px;
 border:1px solid #d3d3d3;
 padding:10px 0;
 cursor:pointer;
 font-weight:500;
 text-align:center;
 background-color:#f8f8f8;
 color:#333;
 font-size:12px;
 outline:0;
 height:100%;
 width:95%;
 background-image:-moz-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:-ms-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:-o-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:-webkit-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%);
 background-image:linear-gradient(to top,#fcfcfc 0,#f8f8f8 100%)
}
.comment-section-renderer-paginator:hover {
 background-color:#f0f0f0;
 border-color:#c6c6c6;
 text-decoration:none;
 background-image:-moz-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-ms-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-o-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:-webkit-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%);
 background-image:linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%)
}
.feedback-banner {
 padding:10px 0;
 background:#fcf4d8;
 text-align:center;
 margin:0 0 10px
}
.zero-step-footer-text {
 -webkit-flex-grow:1;
 flex-grow:1;
 -webkit-flex-basis:0;
 flex-basis:0;
 -webkit-align-self:center;
 align-self:center;
 text-align:right
}
.yt-alert-naked.yt-alert.zero-step-tooltip {
 margin-top:0;
 margin-bottom:18px
}
.confirm-dialog-renderer .yt-dialog-show-content .yt-dialog-content {
 width:340px
}
.comment-hint .yt-uix-clickcard-buttons {
 margin-top:6px;
 text-align:right
}
.comment-hint .yt-uix-clickcard-buttons .yt-uix-clickcard-buttons-separator {
 margin:auto 4px;
 opacity:.6
}
.comment-hint .yt-uix-clickcard-buttons .yt-uix-clickcard-close {
 float:none;
 width:auto;
 opacity:1;
 margin:0
}
.comment-moderation-panel-renderer {
 background-color:#f1f1f1;
 margin:10px 0 12px 58px
}
.comment-moderation-panel-renderer:hover {
 background-color:#eee
}
.comment-moderation-panel-expander-renderer {
 position:relative;
 padding:0 24px;
 height:48px;
 line-height:48px;
 white-space:nowrap
}
.comment-moderation-panel-renderer.yt-uix-expander .comment-moderation-panel-expander-renderer {
 z-index:100
}
.comment-moderation-panel-renderer.yt-uix-expander.onscroll .comment-moderation-panel-expander-renderer {
 box-shadow:0 2px 1px 0 rgba(0,0,0,0.2)
}
.comment-moderation-panel-renderer.yt-uix-expander-collapsed .comment-moderation-panel-expander-renderer {
 box-shadow:none
}
.comment-moderation-panel-expander-renderer-text {
 display:inline-block
}
.comment-moderation-panel-expander-renderer-icon {
 display:inline-block;
 cursor:pointer;
 color:#767676;
 opacity:.5;
 margin-left:4px;
 margin-top:-1px;
 vertical-align:middle;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -386px -56px;
 background-size:auto;
 width:16px;
 height:16px
}
.comment-moderation-panel-expander-renderer-icon:hover {
 opacity:.6
}
.comment-moderation-panel-expander-renderer-icon-tooltip,
.comment-moderation-panel-expander-renderer-icon-tooltip:hover {
 text-decoration:none
}
.comment-moderation-panel-expander-renderer-caret {
 display:inline-block;
 opacity:.7;
 position:absolute;
 right:24px;
 bottom:12px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -172px -18px;
 background-size:auto;
 width:24px;
 height:24px
}
.yt-uix-expander-collapsed .comment-moderation-panel-expander-renderer-caret {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px -18px;
 background-size:auto;
 width:24px;
 height:24px
}
.comment-moderation-panel-renderer-body {
 max-height:336px;
 min-height:106px;
 padding:12px 24px 0;
 overflow-x:auto
}
.comment-moderation-panel-renderer-body::-webkit-scrollbar {
 width:4px;
 min-height:48px
}
.comment-moderation-panel-renderer-body::-webkit-scrollbar-thumb {
 background-color:rgba(0,0,0,0.26)
}
.comment-moderation-panel-renderer .comment-renderer {
 margin-top:12px;
 margin-bottom:30px
}
.comment-moderation-panel-renderer .spam-header-text {
 color:#333;
 font-size:13px;
 font-weight:500;
 border:none;
 height:48px;
 margin:0 -24px 8px;
 padding:0 24px;
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-flex-direction:column;
 flex-direction:column;
 -moz-justify-content:center;
 -webkit-justify-content:center;
 justify-content:center
}
.comment-renderer+.spam-header-text {
 border-top:1px solid rgba(0,0,0,0.12)
}
.comment-moderation-panel-renderer .comment-moderation-panel-renderer-paginator {
 display:block;
 margin-top:32px;
 margin-left:40%;
 height:30px;
 width:30px;
 border:none;
 background:none;
 box-shadow:none;
 cursor:initial
}
.comment-moderation-panel-renderer .comment-moderation-panel-renderer-paginator:hover {
 box-shadow:none
}
#comment-section-renderer .comment-moderation-buttons-renderer {
 margin-left:-4px
}
#comment-section-renderer .comment-moderation-buttons-renderer .yt-uix-button {
 height:18px;
 margin-right:6px;
 padding:0 3px;
 vertical-align:top;
 background:transparent;
 box-shadow:none
}
#comment-section-renderer .comment-moderation-buttons-renderer .yt-uix-button:hover {
 box-shadow:none
}
#comment-section-renderer .comment-moderation-buttons-renderer .yt-uix-button:before {
 opacity:1
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-approve:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -78px -22px;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-approve:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -52px -74px;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-remove:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -87px -52px;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-remove:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px -38px;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-report:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px -60px;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-report:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -78px 0;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-ban:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -30px -74px;
 background-size:auto;
 width:18px;
 height:18px
}
#comment-section-renderer .comment-moderation-buttons-renderer .sprite-ban:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -129px -52px;
 background-size:auto;
 width:18px;
 height:18px
}
.comments-settings.confirm-dialog-renderer .yt-dialog-show-content .yt-dialog-content {
 width:320px
}
.comments-settings.confirm-dialog-renderer .yt-dialog-header {
 margin-bottom:20px
}
#gaming-event-promo-overlay {
 position:fixed;
 bottom:24px;
 left:24px;
 width:408px;
 min-height:168px;
 z-index:1999999994;
 background-color:#fff;
 box-shadow:0 0 4px 0 rgba(0,0,0,0.1),0 4px 4px 0 rgba(0,0,0,0.2)
}
#gaming-event-promo-overlay:not(.hid) {
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex
}
#gaming-event-promo-overlay .video-thumb {
 width:168px;
 height:168px;
 -ms-flex:none;
 -webkit-flex:none;
 flex:none;
 -webkit-align-self:center;
 align-self:center
}
#gaming-event-promo-metadata {
 padding:10px;
 -ms-flex:1;
 -webkit-flex:1;
 flex:1;
 display:-moz-flexbox;
 display:-ms-flexbox;
 display:-webkit-flex;
 display:flex;
 -webkit-flex-direction:column;
 flex-direction:column
}
.gaming-wordmark {
 padding:4px;
 display:inline-block
}
.gaming-wordmark-sprite {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-search-vflDw8dmA.webp) -42px 0;
 background-size:auto;
 width:101px;
 height:15px
}
.gaming-wordmark.external-link:hover::after {
 content:'';
 display:inline-block;
 margin:0 4px;
 opacity:.55;
 position:absolute;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-search-vflDw8dmA.webp) -147px 0;
 background-size:auto;
 width:16px;
 height:16px
}
#gaming-event-promo-title {
 font-size:15px;
 line-height:30px;
 color:#000
}
#gaming-event-promo-body {
 font-size:13px;
 line-height:18px;
 color:#767676;
 -ms-flex:1;
 -webkit-flex:1;
 flex:1
}
#gaming-event-promo-buttons {
 -webkit-align-self:flex-end;
 align-self:flex-end;
 -ms-flex:none;
 -webkit-flex:none;
 flex:none
}
#gaming-event-promo-buttons .yt-uix-button {
 font-size:13px;
 text-transform:uppercase
}
.ad-info-container {
 position:absolute
}
.companion-with-wta .ad-info-container {
 display:none
}
.ytp-out-of-player-ad-info {
 position:absolute;
 right:0;
 top:0;
 z-index:1001
}
.ytp-out-of-player-ad-info .ad-info-icon {
 opacity:.72
}
.ytp-out-of-player-ad-info .ytp-ad-info-dialog-relative-container {
 width:320px
}
.ytp-out-of-player-hover-container {
 white-space:nowrap;
 background:#444;
 border-radius:2px;
 box-sizing:border-box;
 color:#fff;
 font-size:12px;
 line-height:normal;
 opacity:.8;
 right:-40px;
 padding:7px;
 top:30px;
 pointer-events:auto;
 position:absolute;
 -moz-user-select:none;
 -ms-user-select:none;
 -webkit-user-select:none
}
.ytp-out-of-player-ad-info-button-container {
 cursor:pointer
}
.ytp-out-of-player-ad-info-button {
 cursor:pointer;
 position:absolute;
 top:0;
 right:0;
 padding:3px;
 background:#fff
}
.ytp-out-of-player-ad-info-button:hover .ad-info-icon {
 opacity:1
}
.ad-info-icon {
 display:block;
 cursor:pointer;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -308px;
 background-size:auto;
 width:12px;
 height:12px
}
.ad-info-reasons {
 margin:6px 0;
 padding-left:20px;
 list-style-type:disc
}
.pyv-afc-ads-container {
 position:relative;
 visibility:hidden
}
.pyv-afc-ads-container .ad-info-container {
 right:15px;
 top:12px
}
.pyv-afc-ads-container.pyv-afc-mute .ad-info-container {
 right:36px
}
#watch-related .ad-info-container {
 right:0;
 top:0
}
#watch-related .contains-mute-button .ad-info-container {
 right:20px
}
#watch-related #pyv-watch-related-dest-url .title {
 margin-right:10px
}
.ads-mute-button,
.ads-mute-undo {
 position:absolute;
 top:0;
 right:0;
 cursor:pointer
}
.ads-mute-button {
 padding:12px 15px 8px 8px;
 color:#808080;
 font-size:16pt;
 -moz-user-select:none;
 -ms-user-select:none;
 -webkit-user-select:none
}
.ads-mute-button:hover {
 color:#666
}
#watch-related .ads-mute-button {
 top:-7px;
 padding:0 0 8px 8px
}
.ads-mute-undo {
 padding:20px 20px 10px 10px;
 color:#167ac6;
 font-size:13px
}
#watch-related .ads-mute-undo {
 padding:0 0 10px 10px
}
.ads-mute-survey {
 position:absolute;
 top:0;
 bottom:0;
 left:0;
 right:0;
 z-index:1;
 padding:20px;
 cursor:default;
 background:#fff;
 font-size:13px;
 -moz-user-select:none;
 -ms-user-select:none;
 -webkit-user-select:none
}
#watch-related .ads-mute-survey {
 padding:0 0 0 5px
}
.ads-mute-option {
 display:block;
 margin:6px 0;
 cursor:pointer;
 font-size:100%
}
.ads-mute-option:first-of-type {
 margin-top:10px
}
.ads-mute-option .yt-uix-form-input-radio-container {
 margin-right:5px;
 height:19px
}
.ads-mute-check {
 display:inline-block;
 margin:0 6px 0 2px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -324px -24px;
 background-size:auto;
 width:14px;
 height:10px
}
#watch-related .contains-mute-survey {
 height:90px
}
.why-this-ad-hovercard-content ul {
 list-style:unset;
 margin:6px 0;
 padding-left:20px
}
.lockup-video-list-item {
 margin-bottom:15px
}
.video-list-item a {
 position:relative;
 padding:0 5px;
 display:block;
 overflow:hidden;
 color:#333
}
.video-list-item .content-wrapper a {
 padding:0
}
.video-list-item a:hover {
 background:#fff;
 text-decoration:none
}
.yt-tile-default.video-list-item a:hover {
 background:transparent
}
.video-list-item a:visited .title {
 color:#408
}
.video-list-item a:hover .title {
 text-decoration:underline
}
.video-list-item a:visited .video-thumb .img {
 opacity:.75;
 filter:alpha(opacity=75)
}
.video-list-item a:hover .video-thumb .img {
 opacity:1;
 filter:none
}
.video-list-item .title {
 display:block;
 font-size:1.1666em;
 font-weight:normal;
 line-height:1.2;
 color:#03c;
 max-height:3.6em;
 margin-bottom:2px;
 overflow:hidden;
 cursor:pointer;
 cursor:hand
}
.video-list-item .episodic-item .title {
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.video-list-item .stat {
 display:block;
 font-size:.9166em;
 color:#666;
 line-height:1.4em;
 height:1.4em;
 white-space:nowrap
}
.video-list-item .stat .time-created {
 margin-left:.25em;
 padding-left:.5em;
 border-left:1px solid #ccc;
 white-space:nowrap
}
.video-list-item .mix-playlist .stat {
 white-space:normal
}
.video-list-item .stat strong {
 color:#333
}
.video-list-item .views {
 color:#333;
 font-weight:500
}
.video-list-item .alt {
 float:right;
 margin-right:5px
}
.video-list-item .playlist-video-count {
 margin-left:10px
}
.video-list-item .playlist-video {
 height:15px;
 overflow:hidden
}
.video-list-item .ux-thumb-wrap .video-count {
 position:absolute;
 top:2px;
 right:2px;
 padding:2px;
 background:rgba(0,0,0,.8);
 color:#fff;
 font-weight:normal;
 font-size:90%;
 line-height:1;
 text-align:center
}
.video-list-item .ux-thumb-wrap .video-count strong {
 display:block
}
.video-grid .video-list-item {
 float:left;
 clear:none;
 width:116px
}
.video-grid .video-list-item .video-thumb {
 float:none;
 margin:0
}
.video-grid .video-list-item .title {
 width:100%;
 max-height:3.6em;
 overflow:hidden
}
.ad-badge-byline {
 margin-right:3px
}
.video-list .video-list-item .title {
 color:#333;
 font-size:14px;
 font-weight:500
}
.video-list .video-list-item .title:hover {
 text-decoration:underline
}
.video-list .video-list-item .title:visited {
 color:#036
}
.video-list .video-list-item .description,
.video-list .video-list-item .stat {
 color:#767676;
 font-size:11px
}
.video-list .video-list-item .description {
 line-height:1.2em;
 max-height:2.4em;
 overflow:hidden
}
.video-list .video-list-item a.related-channel {
 padding-left:61px
}
.video-list .yt-thumb-64 .yt-thumb-square {
 background-color:#333
}
.video-list .related-list-item-compact-movie-vertical-poster a.related-movie {
 text-align:center
}
.video-list .related-list-item-compact-movie-vertical-poster .content-wrapper,
.video-list .related-list-item-compact-movie-vertical-poster .content-wrapper .content-link {
 height:100%
}
.video-list .movie-data {
 font-size:11px;
 line-height:1.4em;
 color:#767676;
 text-overflow:ellipsis;
 overflow:hidden
}
.video-list .movie-data li {
 white-space:nowrap
}
.video-list .related-list-item-compact-movie-vertical-poster .movie-data {
 margin-top:2px
}
.video-list .movie-description {
 margin-top:4px
}
.video-list .related-list-item-compact-movie-vertical-poster .movie-description {
 margin-top:7px
}
.video-list .movie-bottom-aligned-badge {
 position:absolute;
 bottom:0;
 left:0
}
.related-list-item .content-wrapper {
 margin-left:181px
}
.related-list-item .content-link {
 display:block;
 min-height:94px;
 text-decoration:none
}
.related-list-item .thumb-wrapper {
 position:absolute;
 top:0;
 margin:0 5px;
 width:168px;
 height:94px;
 overflow:hidden
}
.related-list-item.related-list-item-compact-movie,
.related-list-item.related-list-item-compact-movie .thumb-wrapper {
 height:94px
}
.related-list-item.related-list-item-compact-movie-vertical-poster,
.related-list-item.related-list-item-compact-movie-vertical-poster .thumb-wrapper {
 height:174px
}
.related-list-item .thumb-wrapper a {
 padding:0
}
.related-list-item .video-actions {
 position:absolute;
 right:-60px;
 bottom:2px
}
.related-list-item .video-time,
.related-list-item .video-time-overlay,
.related-list-item .video-actions:focus,
.related-list-item:hover .video-actions {
 right:2px
}
.related-list-item:hover .video-time,
.related-list-item:hover .video-time-overlay {
 right:-60px
}
.related-list-item.show-video-time:hover .video-time,
.related-list-item.show-video-time:hover .video-time-overlay {
 right:2px
}
@media screen and (-webkit-min-device-pixel-ratio:0) {
 .thumb-normal .video-list .yt-thumb-64 .yt-thumb-square .clip img {
  position:relative;
  left:-1px
 }
}
.video-list .video-list-item .yt-uix-button-subscription-container {
 position:absolute;
 left:133px;
 bottom:4px
}
.related-list-item .related-item-action-menu {
 position:absolute;
 top:0;
 right:0
}
.related-item-dismissed-container {
 border:1px solid #e2e2e2;
 height:100%
}
.service-endpoint-replace-enclosing-action-notification {
 height:92px
}
.related-list-item .replace-enclosing-action-message {
 padding-top:26px
}
.related-list-item .replace-enclosing-action-options {
 margin-top:10px
}
.related-item-dismissable .title {
 margin-right:15px
}
.related-item-dismissable .related-item-action-menu .yt-uix-button {
 margin-top:-10px;
 margin-right:-1px;
 height:10px;
 width:10px
}
.related-item-dismissable {
 height:100%
}
.exp-wfv-wn .video-list .video-list-item .title {
 font-weight:normal;
 line-height:1.3em;
 max-height:3.9em
}
.exp-wfv-wn-2 .video-list .video-list-item .title {
 font-size:15px;
 font-weight:normal;
 line-height:1.3em;
 max-height:3.9em
}
.ac-renderer {
 position:absolute;
 color:#03c;
 background-color:#fff;
 border:1px solid #999;
 z-index:199
}
.ac-renderer .active {
 color:#03c;
 background-color:#eff4fc
}
.ac-renderer .active b {
 color:#000
}
.share-email .yt-alert-content {
 text-align:center;
 line-height:25px
}
.share-email .yt-alert-content .share-email-remail {
 margin-left:1em
}
.share-email .yt-alert-success .icon {
 margin-top:4px
}
.share-email label {
 display:block;
 margin-bottom:.5em;
 color:#666
}
.share-email label span {
 color:#999
}
.share-email .section {
 margin-bottom:10px
}
.share-email-form .yt-uix-form-input-container,
.share-email-form .yt-uix-form-input-placeholder-container {
 width:100%
}
.share-email .share-email-recipients,
.share-email .share-email-note {
 width:100%;
 box-sizing:border-box;
 padding:5px
}
.share-email .share-email-recipients {
 height:3em
}
.share-email .share-email-note {
 height:4em
}
.share-email-preview-container {
 padding:10px;
 background:#f1f1f1
}
.share-email-preview-header {
 margin-bottom:.25em;
 line-height:16px
}
.share-email-preview-note {
 margin-bottom:.25em;
 line-height:16px;
 margin-left:1em;
 overflow:hidden
}
.share-email-preview-body {
 margin-left:1em;
 overflow:hidden
}
.share-email-captcha {
 overflow:hidden
}
.iv-btp-companion {
 background-color:#fff;
 height:182px;
 position:relative;
 width:100%
}
.iv-btp-companion a,
.iv-btp-companion a:link,
.iv-btp-companion a:visited,
.iv-btp-companion a:hover,
.iv-btp-companion a:focus,
.iv-btp-companion a:active {
 text-decoration:none
}
.iv-btp-block-clicks {
 background:transparent;
 height:100%;
 position:absolute;
 width:100%;
 z-index:1
}
.iv-btp-attribution {
 height:15px;
 position:relative;
 text-align:left
}
.iv-btp-attribution .ad-info-container {
 float:right;
 position:relative
}
.iv-btp-sponsored {
 color:#767676;
 font-size:11px
}
.iv-btp-companion .ad-info-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -24px -346px;
 background-size:auto;
 width:12px;
 height:12px;
 display:inline-block;
 margin-left:4px;
 vertical-align:middle
}
.iv-btp-title {
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis;
 color:#333;
 position:absolute;
 left:0;
 right:90px;
 font-weight:500
}
.iv-btp-card {
 border-right:1px solid #e8e8e8;
 height:160px;
 margin-right:20px;
 overflow:hidden;
 padding-right:20px;
 white-space:normal;
 width:120px
}
.ad-carousel-listitem:last-child .iv-btp-card {
 border-right:none
}
.iv-btp-card-headline {
 background-color:transparent;
 color:#333;
 font-size:12px;
 margin:6px 0;
 text-align:left
}
.iv-btp-card:hover .iv-btp-card-headline {
 color:#2793e6
}
.iv-btp-large-card .iv-btp-card-text-box {
 height:64px;
 position:relative
}
.iv-btp-card-text-valign {
 position:absolute;
 top:50%;
 transform:translateY(-50%)
}
.iv-btp-card img {
 display:block;
 height:auto;
 margin:auto;
 max-height:120px;
 max-width:120px;
 vertical-align:middle;
 width:auto
}
.ad-carousel {
 margin-top:10px
}
.ad-carousel-clip {
 margin:0 4px;
 overflow:hidden
}
.ad-carousel-list {
 -moz-transition:left .3s ease-in-out;
 -webkit-transition:left .3s ease-in-out;
 transition:left .3s ease-in-out;
 margin:1px 0 0;
 left:0;
 position:relative;
 white-space:nowrap
}
.btp-companion-no-animation .ad-carousel-list {
 -moz-transition:none;
 -webkit-transition:none;
 transition:none
}
.ad-carousel-listitem {
 display:inline-block;
 position:relative
}
.ad-carousel-nav-button {
 cursor:pointer;
 padding:14px 10px;
 position:absolute;
 top:91px;
 -moz-transform:translateY(-50%);
 -ms-transform:translateY(-50%);
 -webkit-transform:translateY(-50%);
 transform:translateY(-50%)
}
.ad-carousel-nav-button:hover,
.promotion-shelf-slot:hover .ad-carousel-nav-button {
 box-shadow:0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.24);
 background-color:#fff
}
.ad-carousel-nav-button span {
 display:inline-block;
 opacity:.5
}
.promotion-shelf-slot:hover .ad-carousel-nav-button span {
 opacity:1
}
.ad-carousel-nav-next {
 right:-18px
}
.promotion-shelf-slot:hover .ad-carousel-nav-next {
 right:-23px
}
.ad-carousel-next-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -400px -110px;
 background-size:auto;
 width:7px;
 height:10px
}
.ad-carousel .ad-carousel-nav-prev {
 left:-18px
}
.promotion-shelf-slot:hover .ad-carousel-nav-prev {
 left:-10px
}
.ad-carousel .ad-carousel-prev-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -218px;
 background-size:auto;
 width:7px;
 height:10px
}
.iv-btp-small-card {
 display:block
}
.iv-btp-large-card {
 display:none
}
.iv-btp-card-action,
.iv-btp-hovercard-action {
 color:#333;
 display:block;
 font-size:13px;
 font-weight:500;
 line-height:15px;
 text-align:left;
 width:100%;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.iv-btp-card-image {
 background-color:#fff;
 display:block;
 height:120px;
 width:120px
}
.iv-btp-large-card .iv-btp-card-image {
 display:inline-block
}
.iv-btp-card-image-aligned {
 display:inline-block;
 width:120px;
 vertical-align:middle
}
.iv-btp-card-image span {
 display:inline-block;
 height:100%;
 vertical-align:middle
}
.iv-btp-small-card .iv-btp-card-info {
 margin-top:5px
}
.iv-btp-large-card .iv-btp-card-info {
 display:inline-block;
 height:120px;
 margin-left:10px;
 vertical-align:top;
 width:120px
}
.iv-btp-card-merchant {
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis;
 color:#767676;
 margin-bottom:4px
}
.iv-btp-card-merchant-text {
 color:#767676;
 font-size:11px
}
.iv-btp-card-rating {
 display:inline-block;
 vertical-align:bottom
}
.iv-btp-card-rating-fg {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -263px -487px;
 background-size:auto;
 width:66px;
 height:13px;
 display:block
}
.iv-btp-card-rating-bg {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -469px;
 background-size:auto;
 width:66px;
 height:13px;
 display:block
}
.iv-btp-card-reviews {
 display:inline-block;
 color:#767676;
 font-size:11px;
 padding-left:4px
}
.iv-btp-impressions img {
 display:none
}
.iv-btp-hovercard {
 width:140px
}
.iv-btp-hovercard a,
.iv-btp-hovercard a:link,
.iv-btp-hovercard a:hover,
.iv-btp-hovercard a:visited,
.iv-btp-hovercard a:focus,
.iv-btp-hovercard a:active {
 text-decoration:none
}
.iv-btp-hovercard-headline {
 background-color:transparent;
 color:#333;
 font-size:12px;
 margin:6px 0;
 text-align:left;
 text-decoration:none
}
.iv-btp-hovercard:hover .iv-btp-hovercard-headline {
 color:#2793e6
}
@media screen and (max-width:656px) {
 .iv-btp-card {
  margin-right:7px;
  padding-right:8px
 }
}
@media screen and (min-width:1294px) and (min-height:630px) {
 .iv-btp-companion {
  height:152px
 }
 .iv-btp-card {
  height:120px;
  margin-right:10px;
  padding-right:10px;
  width:250px
 }
 .iv-btp-small-card {
  display:none
 }
 .iv-btp-large-card {
  display:block
 }
 .ad-carousel-clip {
  margin-right:30px
 }
 .ad-carousel-nav-button {
  top:90px
 }
}
@media screen and (min-width:1720px) and (min-height:980px) {
 .iv-btp-companion {
  height:152px
 }
 .iv-btp-card {
  height:120px;
  margin-right:10px;
  padding-right:10px;
  width:296px
 }
 .iv-btp-card-image {
  display:inline-block
 }
 .iv-btp-small-card {
  display:none
 }
 .iv-btp-large-card {
  display:block
 }
 .ad-carousel-nav-button {
  top:90px
 }
}
.stats-header {
 font-size:11px;
 line-height:normal
}
.stats-sub-header {
 font-size:11px;
 font-weight:normal;
 color:#767676;
 margin-left:10px
}
.stats-sub-header .yt-uix-clickcard {
 position:relative;
 z-index:1;
 vertical-align:sub;
 margin-left:4px
}
.stats-opt-out .stats-opt-out-text {
 margin-left:4px
}
.stats-view-more-button {
 position:relative;
 top:0;
 left:10px
}
.stats-header p,
.stats-header .stats-opt-out {
 display:block;
 margin-top:-6px;
 font-size:11px;
 font-weight:normal;
 color:#767676
}
.watch-actions-stats-rats {
 margin:0 6px
}
.watch-actions-stats-rats h1 {
 font-size:13px;
 margin:0 1px 16px 0;
 height:20px;
 line-height:20px
}
#watch-actions-stats .stats-bragbar-container {
 display:table;
 width:auto;
 height:55px;
 border-collapse:separate;
 border-spacing:0;
 border-bottom:1px solid #e2e2e2;
 margin-top:15px;
 margin-bottom:0
}
#watch-actions-stats .stats-bragbar {
 display:table-cell;
 height:49px;
 border-color:#e2e2e2;
 background-color:#f8f8f8
}
#watch-actions-stats .stats-bragbar-filler {
 display:table-cell;
 height:49px;
 position:relative
}
#watch-actions-stats .stats-bragbar {
 position:relative;
 z-index:0;
 width:150px;
 padding:0 12px;
 border-left-width:1px;
 border-right-width:1px;
 border-top-width:1px;
 border-bottom-width:0;
 color:#555;
 opacity:1;
 text-align:left;
 white-space:normal;
 vertical-align:middle
}
#watch-actions-stats .stats-bragbar-filler {
 border:1px solid #e2e2e2;
 border-right-width:0;
 border-bottom-width:0;
 background-color:#f8f8f8
}
#watch-actions-stats .stats-bragbar:hover {
 border-color:#c6c6c6;
 background-color:#eee
}
#watch-actions-stats .stats-bragbar.yt-uix-button {
 padding-top:4px;
 padding-bottom:4px
}
#watch-actions-stats .stats-bragbar.yt-uix-button-toggled {
 padding-bottom:3px;
 border-color:#bababa;
 border-bottom-width:1px;
 border-bottom-style:solid;
 background-color:#e5e5e5
}
#watch-actions-stats .metric-label {
 font-size:11px;
 font-weight:500;
 color:#444;
 text-shadow:0 -1px 0 rgba(255,255,255,0.5);
 text-transform:uppercase
}
#watch-actions-stats .stats-bragbar .bragbar-metric,
#watch-actions-stats .stats-bragbar .bragbar-metric-large {
 font-size:14px;
 font-weight:normal;
 margin-top:7px;
 color:#222
}
#watch-actions-stats .stats-bragbar em {
 font-size:11px;
 font-style:normal
}
.watch-actions-stats-rats .stats-charts-container {
 position:relative;
 margin:5px auto 20px;
 width:100%
}
.watch-actions-stats-rats .stats-chart-menu {
 width:100%;
 height:30px
}
#stats-chart-tab-watch-time {
 text-align:right
}
.watch-actions-stats-rats .stats-menu-metric {
 border-bottom:3px solid transparent;
 margin-left:10px;
 line-height:38px;
 font-size:11px;
 padding:3px 0
}
.watch-actions-stats-rats .menu-metric-value {
 margin-left:10px
}
.watch-actions-stats-rats .stats-chart-mode {
 position:absolute;
 left:0;
 top:10px
}
.watch-actions-stats-rats .stats-mode-button {
 height:20px
}
.watch-actions-stats-rats .stats-chart-mode .yt-uix-clickcard {
 margin-left:4px
}
.watch-actions-stats-rats .stats-chart-mode .yt-uix-clickcard-target {
 vertical-align:middle
}
.watch-actions-stats-rats .stats-chart-gviz {
 width:100%;
 height:160px;
 margin-bottom:20px
}
.watch-actions-stats-rats .stats-top-container {
 width:612px
}
.watch-actions-stats-rats .stats-top-container tr {
 height:92px
}
.watch-actions-stats-rats.top-selected-views .top-site-watch-time,
.watch-actions-stats-rats.top-selected-watch-time .top-site-views {
 display:none
}
.watch-actions-stats-rats .stats-top-container tr.bottom {
 height:72px
}
.watch-actions-stats-rats .stats-top-container td {
 width:290px;
 vertical-align:top;
 white-space:normal;
 padding-right:10px
}
.watch-actions-stats-rats .stats-top-container dl {
 margin-top:10px
}
.watch-actions-stats-rats .stats-top-container dt {
 max-width:288px;
 overflow:hidden;
 text-overflow:ellipsis;
 white-space:nowrap
}
.watch-actions-stats-rats .stats-top-container .site-url {
 display:inline-block;
 max-width:150px;
 line-height:20px;
 overflow:hidden;
 text-overflow:ellipsis
}
.watch-actions-stats-rats .stats-top-container .site-url a {
 display:inline-block;
 max-width:134px;
 overflow:hidden;
 white-space:nowrap;
 text-overflow:ellipsis;
 margin-right:2px
}
.watch-actions-stats-rats .stats-top-container .external-link-icon {
 opacity:.5;
 vertical-align:text-bottom;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 0;
 background-size:auto;
 width:16px;
 height:16px
}
.watch-actions-stats-rats .sub-views,
.watch-actions-stats-rats .sub-watch-time,
.watch-actions-stats-rats .sub-time {
 margin-left:10px;
 font-size:11px;
 color:#767676
}
.watch-actions-stats-rats .sub-views,
.watch-actions-stats-rats .sub-watch-time {
 text-transform:uppercase
}
.share-panel {
 color:#555
}
.share-panel-playlist-options {
 margin:12px 0
}
.share-panel-start-at-container {
 display:block;
 margin-top:10px
}
.share-panel-url-container.share-panel-reverse {
 clear:left;
 margin-bottom:0;
 margin-top:10px
}
.share-panel-url-label {
 float:left;
 margin-right:.5em;
 max-width:400px;
 width:100%
}
.share-panel-url-label span {
 color:#666;
 display:block;
 margin-bottom:.25em
}
.ie .share-panel-url-input-container {
 display:inline
}
.share-panel-url {
 color:#666;
 font-size:1.6em;
 padding:3px;
 width:385px
}
.share-panel-url-container .yt-uix-expander-head {
 display:block;
 line-height:2em
}
.share-panel-url-options {
 float:right;
 line-height:2.2;
 width:200px
}
.share-panel-show-url-options {
 color:#333;
 display:block;
 text-align:right
}
.share-panel .yt-uix-expander .collapsed-message {
 display:none
}
.share-panel .yt-uix-expander .expanded-message,
.share-panel .yt-uix-expander.yt-uix-expander-collapsed .collapsed-message {
 display:inline
}
.share-panel .yt-uix-expander.yt-uix-expander-collapsed .expanded-message {
 display:none
}
.share-panel .arrow {
 border:1px solid transparent;
 margin-bottom:1px
}
.share-panel .collapsed-message .arrow {
 border-top-color:#8d8d8d;
 border-width:4px 4px 0
}
.share-panel .expanded-message .arrow {
 border-bottom-color:#8d8d8d;
 border-width:0 4px 4px
}
.share-panel-start-at-time {
 width:50px
}
#hangout-popout-icon {
 display:inline-block;
 margin-left:6px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -520px -413px;
 background-size:auto;
 width:11px;
 height:11px
}
.share-panel-embed {
 font-weight:500
}
.share-panel .share-email {
 width:auto
}
.share-panel .yt-share-verticals {
 margin-bottom:10px
}
.share-panel-services {
 clear:both
}
.share-panel-services.watch-top-level {
 float:right
}
.share-panel-services.watch-top-level .share-service-icon {
 -moz-transform:scale(0.45);
 -ms-transform:scale(0.45);
 -webkit-transform:scale(0.45);
 transform:scale(0.45)
}
.share-panel-services.watch-top-level .share-group li {
 margin-right:0
}
.share-panel-services .share-service-button {
 background:none;
 border:none;
 cursor:pointer;
 text-align:left
}
.clicked-service-button {
 position:relative
}
.clicked-service-button .share-service-icon {
 opacity:.3
}
.share-service-checkmark {
 display:none;
 position:absolute;
 top:0
}
.clicked-service-button .share-service-checkmark {
 display:inline-block;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1781px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-group {
 float:left
}
.share-group li {
 float:left;
 margin-right:5px
}
@media screen and (max-width:656px) {
 .share-group li {
  margin-right:0
 }
}
.share-panel-show-more {
 color:#333;
 display:block;
 line-height:2em;
 margin-left:0
}
.share-service-icon {
 vertical-align:middle;
 margin:-1px
}
.share-service-icon-ameba {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1277px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-bebo {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1673px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-blogger {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1637px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-cyworld {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1097px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-delicious {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -108px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-digg {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1061px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-facebook {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -953px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-fotka {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1349px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-goo {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1565px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-googleplus {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -660px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-grono {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1313px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-hi5 {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1745px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-hyves {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -72px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-linkedin {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -276px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-livejournal {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -180px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-kakao {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -552px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-mail {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -384px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-meneame {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -825px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-mixi {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1493px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-mixx {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1421px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-myspace {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1817px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-naver {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -36px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-nujij {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1133px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-odnoklassniki {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1169px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-pinterest {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -696px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-rakuten {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1709px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-reddit {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1385px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-skyblog {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 0;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-skype {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -732px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-sledzik {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -516px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-stumbleupon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -312px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-tuenti {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -989px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-tumblr {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -144px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-twitter {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1025px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-vkontakte {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1241px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-webryblog {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -624px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-weibo {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -1601px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-wykop {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -348px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-yahoo {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -881px;
 background-size:auto;
 width:32px;
 height:32px
}
.share-service-icon-yigg {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vfl3jrtOa.webp) 0 -216px;
 background-size:auto;
 width:32px;
 height:32px
}
#share-email .share-email {
 margin-top:50px
}
.share-embed-code {
 box-sizing:border-box;
 width:100%
}
.share-panel-embed-container hr {
 border-color:#ccc;
 border-style:solid;
 margin:1em 0
}
.share-embed-options {
 margin-top:10px
}
.share-embed-options li {
 margin-top:6px
}
.share-panel-embed-container form {
 overflow:auto
}
.share-size-options .yt-uix-form-input-select {
 margin:0 15px 0 10px
}
.share-panel-embed-legal {
 color:#767676;
 font-size:11px;
 line-height:3;
 vertical-align:middle
}
#share-embed-customize input {
 width:50px
}
#video-preview {
 text-align:center
}
@media screen and (max-width:656px) {
 #share-preview {
  display:none
 }
}
#watch7-sidebar .related-tweaks-normal a span.title {
 font-weight:normal
}
#watch7-sidebar .related-tweaks-large a span.title {
 font-size:15px
}
#watch7-sidebar .related-tweaks-larger a span.title {
 font-size:17px
}
#watch7-sidebar .related-tweaks-largest a span.title {
 font-size:19px
}
#watch7-sidebar .related-tweaks-alternate a span.title {
 color:#167ac6
}
#watch7-sidebar .related-tweaks-alternate a:hover span.title {
 color:#333
}
.exp-polymer-load #watch7-subscription-container {
 opacity:0
}
#watch7-main {
 position:relative;
 margin-top:0;
 margin-bottom:30px
}
#player-playlist {
 position:relative
}
@media screen and (max-width:656px) {
 #player-playlist {
  width:426px
 }
}
#watch7-sidebar {
 margin-bottom:20px;
 margin-top:-370px;
 position:relative;
 -moz-transition:margin-top .3s ease-in-out,padding-top .3s ease-in-out;
 -webkit-transition:margin-top .3s ease-in-out,padding-top .3s ease-in-out;
 transition:margin-top .3s ease-in-out,padding-top .3s ease-in-out
}
#watch-more-related-loading {
 color:#767676;
 font-size:11px;
 font-weight:500;
 text-align:center;
 text-transform:uppercase
}
#watch7-preview {
 position:relative;
 z-index:1000
}
.watch-sidebar-gutter {
 padding-left:10px;
 padding-right:10px
}
#watch7-sidebar-contents {
 margin-top:0;
 padding-left:5px
}
#watch-header {
 min-height:150px;
 padding-bottom:5px;
 position:relative
}
#watch-header.yt-card-short {
 min-height:112px
}
.watch-wide #watch7-sidebar,
.watch-wide #watch7-preview {
 margin-top:0
}
#watch7-content {
 z-index:0
}
@media screen and (max-width:656px) {
 #watch7-sidebar-contents {
  margin-bottom:0
 }
 #watch7-main #watch7-content {
  position:relative;
  width:426px
 }
 #watch7-sidebar.watch-sidebar {
  clear:both;
  margin:10px auto;
  top:0;
  width:426px
 }
 #watch-discussion {
  display:none
 }
}
.watch-main-col {
 clear:left;
 float:left;
 width:640px
}
@media screen and (max-width:656px) {
 .watch-main-col {
  margin:0 auto;
  float:none
 }
}
#page.watch .content-alignment {
 min-width:1003px;
 width:auto
}
@media screen and (max-width:656px) {
 #page.watch .content-alignment {
  min-width:426px
 }
}
#watch7-content {
 width:640px
}
#page.watch .content-alignment {
 max-width:1066px
}
#watch7-preview {
 margin-top:-360px
}
#player-playlist .watch-playlist {
 left:650px
}
#watch7-sidebar {
 margin-left:650px
}
#watch7-sidebar-contents {
 min-height:520px
}
@media screen and (min-width:1294px) and (min-height:630px) {
 #watch7-content {
  width:854px
 }
 #page.watch .content-alignment {
  max-width:1280px
 }
 #watch7-preview {
  margin-top:-480px
 }
 #player-playlist .watch-playlist {
  left:864px
 }
 #watch7-sidebar {
  margin-left:864px;
  top:-120px
 }
 #watch7-sidebar-contents {
  min-height:640px
 }
}
@media screen and (min-width:1720px) and (min-height:980px) {
 #watch7-content {
  width:1280px
 }
 #page.watch .content-alignment {
  max-width:1706px
 }
 #watch7-preview {
  margin-top:-720px
 }
 #player-playlist .watch-playlist {
  left:1290px
 }
 #watch7-sidebar {
  margin-left:1290px;
  top:-360px
 }
 #watch7-sidebar-contents {
  min-height:880px
 }
}
@media screen and (max-width:656px) {
 #watch7-preview {
  margin-top:-240px;
  position:relative;
  z-index:1000
 }
}
.watch-queue-preview {
 position:relative;
 top:-10px
}
#page.watch-stage-mode #player.content-alignment {
 max-width:none;
 min-width:none
}
.watch-stage-mode #watch7-sidebar {
 top:0
}
#watch7-speedyg-area .yt-alert {
 margin:0
}
#watch8-action-buttons {
 position:relative;
 padding-top:5px;
 border-top:1px solid #e2e2e2
}
#watch-action-panels {
 position:relative
}
#action-panel-dismiss {
 position:absolute;
 top:3px;
 right:3px
}
#action-panel-details a {
 color:#333
}
#action-panel-details:hover a {
 color:#167ac6
}
.action-panel-login,
.action-panel-loading,
.action-panel-error {
 padding:20px;
 text-align:center
}
.action-panel-loading,
.action-panel-error {
 color:#666
}
#watch8-sentiment-actions {
 float:right
}
#watch8-secondary-actions {
 position:relative;
 left:-10px
}
#watch8-sentiment-actions .like-button-renderer .yt-uix-button {
 margin-right:0;
 padding-right:0
}
#watch8-action-buttons .yt-uix-button,
#watch8-action-buttons .yt-uix-button:hover,
#action-panel-dismiss,
#action-panel-dismiss:hover {
 background:none;
 border:none
}
#action-panel-add-transcript p {
 margin-bottom:10px;
 font-size:13px;
 color:#333
}
.alloffers-button {
 color:#167ac6;
 box-shadow:none
}
.alloffers-button:hover {
 box-shadow:none;
 color:#126db3
}
.alloffers-icon:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -443px;
 background-size:auto;
 width:24px;
 height:24px
}
.alloffers-icon:hover:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -181px;
 background-size:auto;
 width:24px;
 height:24px
}
.action-panel-trigger-stats:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -351px;
 background-size:auto;
 width:16px;
 height:16px
}
.action-panel-trigger-details:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -190px;
 background-size:auto;
 width:20px;
 height:20px
}
.addto-button:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -152px;
 background-size:auto;
 width:20px;
 height:20px
}
.action-panel-trigger-share:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -40px -346px;
 background-size:auto;
 width:20px;
 height:20px
}
#action-panel-overflow-button:before,
.action-panel-trigger-overflow:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -520px -353px;
 background-size:auto;
 width:20px;
 height:20px
}
.action-panel-trigger-report:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -195px;
 background-size:auto;
 width:16px;
 height:16px
}
.action-panel-trigger-transcript:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -178px -345px;
 background-size:auto;
 width:16px;
 height:16px
}
.action-panel-trigger-translate:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -259px -376px;
 background-size:auto;
 width:16px;
 height:16px
}
#action-panel-dismiss:before,
.action-panel-trigger-dismiss:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -16px -80px;
 background-size:auto;
 width:10px;
 height:10px
}
#action-panel-report #flag-video-panel {
 margin-bottom:0
}
#flag-video-panel h3,
#flag-video-panel p {
 margin-bottom:10px
}
#watch8-secondary-actions.yt-uix-button-group .yt-uix-button.yt-uix-button-toggled {
 z-index:0
}
#watch-description {
 color:#333;
 line-height:14px;
 overflow:hidden;
 position:relative;
 z-index:1
}
.appbar-flexwatch #watch-description-clip {
 max-width:780px
}
#watch-description h2 {
 color:#000;
 font-size:16px;
 font-weight:500;
 margin:0 0 10px
}
#watch-uploader-info .yt-music-pass-badge-container {
 margin-right:3px
}
.watch-title-container {
 width:75%
}
#watch-disclaimer {
 color:#333
}
.offer-poster-watchpage {
 float:left;
 margin-right:15px;
 margin-bottom:15px
}
#watch-headline-title .watch-title a {
 color:#167ac6
}
#watch-headline-title .subtitle {
 font-style:italic;
 text-align:left
}
.donate-button-renderer {
 float:right
}
.video-metadata-renderer-music-pass-badge-renderer {
 padding-left:10px;
 text-align:right
}
.watch-time-text {
 vertical-align:middle
}
.watch-page-item-section-header {
 padding-bottom:12px
}
#watch-description-extras {
 margin-top:8px
}
.watch-s2l-thumb {
 float:left;
 margin-right:8px;
 margin-top:3px
}
#watch-checkout-offers .checkout-button {
 margin-bottom:5px
}
.watch-extras-section .title,
.watch-extras-section .content {
 font-size:11px;
 line-height:11px;
 margin-bottom:5px
}
.watch-extras-section .title {
 float:left;
 font-weight:500;
 width:100px;
 margin-right:10px
}
.watch-meta-item {
 clear:both
}
.yt-uix-expander-collapsed #watch-description-text {
 max-height:42px;
 overflow:hidden;
 padding-top:4px
}
.watch-info-tag-list a {
 white-space:nowrap
}
.watch-meta-item .watch-info-tag-list li {
 display:inline
}
.watch-meta-item .watch-info-tag-list li:after {
 content:","
}
.watch-meta-item .watch-info-tag-list li:last-child:after {
 content:""
}
.watch-meta-item.has-image .watch-info-tag-list li {
 display:list-item;
 line-height:15px
}
.watch-meta-item.has-image .watch-info-tag-list li:after {
 content:""
}
.watch-meta-item.has-image .metadata-row-image {
 float:left;
 margin-right:10px
}
.watch-meta-item.has-image .metadata-row-image img {
 width:40px
}
#limited-state-header {
 margin-bottom:8px
}
#watch-limited-actions {
 float:right;
 margin-top:10px
}
#watch-limited-actions a:not(:last-child) {
 margin-right:4px
}
@media screen and (max-width:656px) {
 #watch8-secondary-actions .yt-uix-button-content {
  display:none
 }
 #watch8-secondary-actions {
  left:0
 }
 #watch8-secondary-actions .yt-uix-button {
  padding:0
 }
}
.video-extras-sparkbars {
 height:2px;
 overflow:hidden
}
.video-extras-sparkbar-likes {
 float:left;
 height:2px;
 background:#167ac6
}
.video-extras-sparkbar-dislikes {
 float:left;
 height:2px;
 background:#ccc
}
.video-extras-likes-dislikes,
.video-extras-likes-dislikes .dislikes {
 color:#666
}
#watch7-notification-area {
 position:relative;
 padding-bottom:10px;
 padding-top:10px
}
#watch7-user-header {
 position:relative;
 padding-bottom:10px;
 padding-top:10px;
 overflow:hidden
}
#watch7-user-header-placeholder {
 min-height:10px
}
#watch7-notification-area {
 overflow:auto
}
#watch7-user-header.unavailable {
 border-bottom-width:1px;
 min-height:53px
}
#watch7-headline h1 {
 line-height:normal;
 word-wrap:break-word
}
#watch7-headline h1 a {
 color:inherit
}
#watch7-headline #watch-privacy-icon {
 float:left;
 margin-right:5px
}
#watch7-headline #watch-privacy-icon .privacy-icon {
 vertical-align:middle
}
#watch7-headline #watch-privacy-icon.public .privacy-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -207px -332px;
 background-size:auto;
 width:24px;
 height:20px
}
#watch7-headline #watch-privacy-icon.private .privacy-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -487px;
 background-size:auto;
 width:24px;
 height:20px
}
#watch7-headline #watch-privacy-icon.unlisted .privacy-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -395px;
 background-size:auto;
 width:24px;
 height:20px
}
#watch7-views-info {
 position:absolute;
 bottom:33px;
 right:0;
 min-width:160px
}
.watch-view-count {
 line-height:24px;
 max-height:24px;
 text-align:right;
 font-size:19px;
 color:#666;
 white-space:nowrap;
 margin-bottom:2px
}
.watch-view-count.gs2b-active {
 font-size:16px
}
.watch-view-count-hovercard .yt-uix-hovercard-card-body {
 min-height:0;
 padding:15px
}
.watch-view-count-hovercard-content {
 font-size:13px;
 line-height:1.4em;
 width:203px
}
.watch-view-count-info {
 margin-left:3px
}
#watch7-views-info .video-extras-likes-dislikes .yt-sprite {
 position:relative;
 vertical-align:middle
}
.icon-watch-stats-like {
 top:-1px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) 0 -62px;
 background-size:auto;
 width:13px;
 height:14px
}
.icon-watch-stats-dislike {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -20px;
 background-size:auto;
 width:13px;
 height:14px
}
#watch-header .yt-user-photo {
 float:left
}
#watch-header .yt-user-info {
 margin-left:58px;
 white-space:nowrap;
 width:380px
}
#watch-header .yt-user-info a {
 display:inline-block;
 height:22px;
 color:#333;
 font-weight:500;
 max-width:315px;
 overflow:hidden;
 text-overflow:ellipsis;
 vertical-align:top
}
#watch-header .yt-user-separator {
 font-size:11px;
 color:#666;
 margin:0 5px
}
#watch7-subscription-container {
 margin-left:10px
}
#watch7-subscription-container .channel-settings-link {
 height:24px
}
#watch7-subscription-container .channel-settings-link:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -91px;
 background-size:auto;
 width:20px;
 height:20px
}
.watch-stage-mode .alerts-wrapper {
 background-color:#000;
 overflow:hidden
}
.watch-stage-mode .alerts-wrapper .yt-alert {
 margin:10px 0
}
#shared-conversation-header .yt-user-info {
 margin-top:15px
}
#shared-conversation-header .yt-user-info a {
 color:#b8b8b8;
 font-size:19px;
 font-weight:500
}
@media screen and (min-width:894px) and (min-height:630px) {
 .watch-stage-mode #alerts {
  width:854px
 }
}
@media screen and (min-width:1320px) and (min-height:870px) {
 .watch-stage-mode #alerts {
  width:1280px
 }
}
#watch-header .mealbar-promo-renderer .yt-dialog-base {
 height:initial;
 left:initial;
 padding-left:5px;
 position:absolute;
 right:0;
 top:-5px;
 width:initial;
 z-index:1999999998
}
.ie #watch-header .mealbar-promo-renderer .yt-dialog-base {
 height:auto;
 left:auto;
 width:auto
}
#watch-header .mealbar-promo-renderer .yt-dialog-fg {
 bottom:5px;
 box-shadow:0 4px 4px rgba(0,0,0,.24);
 right:5px
}
#watch-header .yt-dialog-content {
 padding-top:18px
}
#watch-header .yt-dialog-content:empty {
 padding-top:0
}
.ad-blocker-messaging {
 min-width:350px;
 max-width:530px
}
@media screen and (max-width:656px) {
 #watch-header .mealbar-promo-renderer .yt-dialog-fg {
  max-width:421px
 }
}
body:-webkit-full-screen-ancestor>:not(:-webkit-full-screen-ancestor):not(:-webkit-full-screen),
body :-webkit-full-screen-ancestor>:not(:-webkit-full-screen-ancestor):not(:-webkit-full-screen) {
 display:none!important
}
#player,
#placeholder-player {
 color:#fff;
 margin-left:auto;
 margin-right:auto;
 position:relative;
 -moz-transition:background-color .3s ease-in-out,background-image .3s ease-in-out;
 -webkit-transition:background-color .3s ease-in-out,background-image .3s ease-in-out;
 transition:background-color .3s ease-in-out,background-image .3s ease-in-out
}
#player {
 top:10px;
 width:100%
}
#placeholder-player {
 margin-bottom:10px;
 z-index:0
}
.watch-stage-mode #player,
.watch-stage-mode #placeholder-player {
 margin-top:-10px
}
@media screen and (max-width:656px) {
 .watch-stage-mode #player,
 .watch-stage-mode #placeholder-player {
  margin-top:0
 }
}
#player.off-screen {
 position:absolute
}
.player-api {
 background:#000
}
.player-api:focus {
 outline:none
}
#player .player-api {
 position:absolute;
 z-index:5
}
html[data-player-size=fullscreen] #player .player-api {
 z-index:100
}
#placeholder-player .player-api {
 position:relative
}
.player-api object,
.player-api embed {
 height:100%!important;
 position:relative;
 width:100%!important
}
#theater-background {
 background-color:transparent;
 left:0;
 position:absolute;
 width:100%;
 -moz-transition:background-color .3s ease;
 -webkit-transition:background-color .3s ease;
 transition:background-color .3s ease
}
.watch-stage-mode #theater-background {
 background-color:#000
}
.shared-conversation-watch #theater-background {
 background-color:transparent
}
.shared-conversation-watch-content-alignment {
 margin-left:auto;
 margin-right:auto;
 position:relative
}
.shared-conversation-watch .player-height {
 top:105px
}
.share-info-thumbnail {
 display:inline-block;
 height:72px;
 position:relative;
 width:72px
}
.share-info-thumbnail-image {
 border-radius:36px
}
.share-info-pointer {
 background-color:#fff;
 height:22px;
 margin:3px 0 0 25px;
 position:absolute;
 transform:rotate(45deg);
 width:22px;
 z-index:5
}
.share-info-content-container {
 display:inline-block;
 height:72px;
 margin-left:16px;
 vertical-align:top;
 width:85%
}
.share-info-comment {
 display:inline-block;
 font-size:18px;
 height:44px;
 overflow:hidden;
 vertical-align:top;
 width:100%
}
.share-info-user-container {
 color:#505050;
 font-size:1em;
 margin-top:12px
}
.share-info-user-name {
 color:#505050
}
.share-info-dot {
 padding:0 3px
}
.shared-conversation-title {
 color:#222
}
.player-unavailable {
 background:#262626;
 font-size:13px;
 line-height:1.2;
 position:absolute;
 text-align:left;
 z-index:10;
 background-image:-moz-linear-gradient(top,#383838 0,#131313 100%);
 background-image:-ms-linear-gradient(top,#383838 0,#131313 100%);
 background-image:-o-linear-gradient(top,#383838 0,#131313 100%);
 background-image:-webkit-linear-gradient(top,#383838 0,#131313 100%);
 background-image:linear-gradient(to bottom,#383838 0,#131313 100%);
 filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#ff383838,EndColorStr=#ff131313)
}
.player-unavailable.with-background {
 filter:none
}
.player-unavailable.with-background .video-thumb {
 background:#000
}
.player-unavailable.with-background .video-thumb img {
 filter:alpha(opacity=20);
 opacity:.2
}
.player-unavailable .icon {
 height:100px;
 left:50%;
 margin-left:-70px;
 margin-top:-50px;
 position:absolute;
 top:60%;
 width:140px
}
.player-unavailable div.icon.meh {
 background-image:url(//s.ytimg.com/yts/img/meh7-vflGevej7.png);
 background-repeat:no-repeat
}
.player-unavailable div.icon.delay {
 background-image:url(//s.ytimg.com/yts/img/timedelay7-vfljunAOV.png);
 background-repeat:no-repeat
}
.player-unavailable .content {
 bottom:50px;
 left:25px;
 position:absolute;
 right:25px;
 top:25px
}
.player-unavailable .content .message {
 border-bottom:1px solid #888;
 font-size:19px;
 font-weight:normal;
 margin:0 -5px 15px;
 padding:0 5px 14px;
 text-shadow:0 2px 2px #000
}
.player-unavailable .content .forced-signin-message {
 font-size:30px
}
.player-unavailable .content .forced-signin-submessage p {
 font-size:14px
}
.player-unavailable .content .forced-signin-submessage a {
 color:#fff;
 display:block;
 margin-top:14px
}
.player-unavailable .content .submessage .forced-signin-submessage button {
 font-size:18px;
 font-weight:500;
 padding:0 40px;
 text-shadow:0 1px 1px #000
}
.player-unavailable .content .submessage {
 text-shadow:0 1px 1px #000
}
#watch7-player-age-gate-content .yt-uix-button,
#watch7-player-age-gate-content .date-selector {
 margin-top:20px
}
#watch7-player-age-gate-content .safety-mode-message {
 bottom:0;
 left:0;
 position:absolute
}
#switch-users-player {
 margin:30px 20px
}
#switch-users-player .title {
 font-size:18px
}
#switch-users-player .yt-thumb {
 float:left;
 margin-right:10px
}
#switch-users-player .yt-horizontal-rule {
 border-color:#b8b8b8;
 margin:15px 0
}
#switch-users-player .lockup {
 margin:10px
}
#switch-users-player .name {
 float:left;
 margin:0 20px 0 10px
}
.player-width {
 width:640px
}
.player-height {
 height:360px
}
@media screen and (max-width:656px) {
 .player-width {
  width:426px
 }
 .player-height {
  height:240px
 }
}
@media screen and (min-width:1294px) and (min-height:630px) {
 .player-width {
  width:854px
 }
 .player-height {
  height:480px
 }
}
@media screen and (min-width:1720px) and (min-height:980px) {
 .player-width {
  width:1280px
 }
 .player-height {
  height:720px
 }
}
.watch-stage-mode .player-width {
 margin-left:50%
}
@media screen and (max-width:656px) {
 .player-width {
  margin-left:50%;
  left:-213px
 }
}
.watch-stage-mode .player-width {
 width:854px;
 left:-427px
}
.watch-stage-mode .player-height {
 height:480px
}
@media screen and (min-width:1320px) and (min-height:870px) {
 .watch-stage-mode .player-width {
  left:-640px;
  width:1280px
 }
 .watch-stage-mode .player-height {
  height:720px
 }
}
#placeholder-playlist {
 background-color:transparent
}
#placeholder-playlist.watch-shell-playlist {
 background-color:#1a1a1a
}
@media screen and (max-width:656px) {
 #placeholder-playlist {
  display:none
 }
}
#player-playlist .watch-playlist {
 margin-left:-10px;
 position:absolute;
 right:0;
 top:0;
 z-index:3;
 -moz-transition:transform .3s ease-in-out;
 -webkit-transition:transform .3s ease-in-out;
 transition:transform .3s ease-in-out
}
.watch-wide #player-playlist .watch-playlist {
 -moz-transform:translateY(370px);
 -ms-transform:translateY(370px);
 -webkit-transform:translateY(370px);
 transform:translateY(370px)
}
.ie8 .watch-wide #player-playlist .watch-playlist {
 margin-top:370px
}
.watch-stage-mode #player-playlist .watch-playlist {
 top:120px;
 margin-left:0
}
@media screen and (min-width:1320px) and (min-height:870px) {
 .watch-stage-mode #player-playlist .watch-playlist {
  top:360px
 }
}
@media screen and (max-width:656px) {
 #player-playlist .watch-playlist {
  border-top:1px solid #3a3a3a;
  height:240px;
  left:0;
  margin-bottom:0;
  margin-left:auto;
  margin-right:auto;
  position:relative;
  top:240px;
  width:426px;
  -moz-transform:none;
  -ms-transform:none;
  -webkit-transform:none;
  transform:none
 }
 .watch-wide #player-playlist .watch-playlist {
  top:240px;
  -moz-transform:none;
  -ms-transform:none;
  -webkit-transform:none;
  transform:none
 }
 .ie8 #player-playlist .watch-playlist {
  margin-top:0
 }
}
#watch7-playlist-index-and-length {
 padding:0 4px
}
#watch7-playlist-loading {
 position:absolute;
 top:158px;
 width:100%;
 z-index:3
}
.video-list-item.remove-button-present .attribution {
 width:170px
}
.watch7-playlist-interstitial {
 background:#000;
 display:table;
 text-align:center
}
.hid.watch7-playlist-interstitial {
 display:none
}
.watch7-interstitial-content {
 display:table-cell;
 position:relative;
 vertical-align:middle
}
.watch7-interstitial-button {
 margin-top:15px
}
.playlist[data-autoplay-countdown="1"] .autoplay-notification-1,
.playlist[data-autoplay-countdown="2"] .autoplay-notification-2,
.playlist[data-autoplay-countdown="3"] .autoplay-notification-3,
.playlist[data-autoplay-countdown="4"] .autoplay-notification-4,
.playlist[data-autoplay-countdown="5"] .autoplay-notification-5 {
 display:inline
}
.yt-uix-button-playlist-remove-item {
 float:right;
 margin:10px 10px 0 0
}
.yt-uix-button-icon-playlist-remove-item {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -383px;
 background-size:auto;
 width:12px;
 height:12px
}
.watch-playlist .main-content {
 overflow:hidden
}
.watch-playlist {
 background:#1a1a1a;
 color:#b8b8b8;
 margin-bottom:10px;
 position:relative
}
#player-playlist .playlist-header {
 padding:0 10px
}
#player-playlist .control-bar {
 border-top:1px solid #3a3a3a;
 height:24px;
 padding:7px 5px 8px
}
#player-playlist .radio-playlist .control-bar,
#player-playlist .watch-queue-nav .control-bar {
 display:none
}
#player-playlist .yt-uix-button-player-controls {
 color:#333;
 font-size:11px;
 margin-left:10px;
 padding:0
}
#player-playlist .yt-uix-button-player-controls:first-child {
 margin-left:0
}
#player-playlist .yt-uix-button-player-controls:focus {
 box-shadow:0 0 0 2px rgba(27,127,204,.8)
}
.no-focus-outline #player-playlist .yt-uix-button-player-controls:focus {
 box-shadow:none
}
.ie8 #player-playlist .yt-uix-button-player-controls:focus {
 outline:2px solid #1b6ba8
}
.no-focus-outline .ie8 #player-playlist .yt-uix-button-player-controls:focus {
 outline:none
}
#player-playlist .yt-uix-button-icon-playlist-edit {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -252px -458px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .yt-uix-playlistlike:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -416px -215px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .yt-uix-button-toggled.yt-uix-playlistlike:before {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -231px -376px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .yt-uix-button-icon-watch-appbar-play-prev,
.rtl #player-playlist .yt-uix-button-icon-watch-appbar-play-next {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -196px 0;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .yt-uix-button-icon-watch-appbar-play-next,
.rtl #player-playlist .yt-uix-button-icon-watch-appbar-play-prev {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -110px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .yt-uix-button-icon-watch-appbar-shuffle-video-list {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -52px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .yt-uix-button-icon-watch-appbar-autoplay {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -150px -174px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .playlist-header-content {
 font-size:11px;
 height:37px;
 line-height:1.5;
 padding:15px 5px 8px
}
#player-playlist .playlist-mix-icon {
 float:left;
 margin-right:10px;
 margin-top:4px;
 overflow:hidden;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -285px -176px;
 background-size:auto;
 width:24px;
 height:24px
}
#player-playlist .playlist-info {
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
#player-playlist .playlist-label {
 color:#c03636;
 display:block;
 font-weight:500;
 margin-bottom:2px
}
#player-playlist .playlist-title {
 color:#fff;
 display:inline;
 font-size:15px;
 font-weight:normal
}
#player-playlist .playlist-title a {
 color:inherit
}
#player-playlist .playlist-details>li {
 display:inline-block
}
#player-playlist .playlist-details>li:after {
 content:'•'
}
#player-playlist .playlist-details>li:last-child:after {
 content:''
}
#player-playlist .author-attribution {
 font-size:11px
}
#player-playlist .author-attribution a {
 color:inherit
}
#player-playlist .playlist-progress #playlist-current-index:after {
 content:'/'
}
#player-playlist .appbar-playlist-controls {
 float:right
}
#player-playlist .playlist-videos-container {
 clear:both
}
#player-playlist .playlist-videos-list {
 background-color:#222;
 bottom:0;
 counter-reset:playlist-video-section;
 left:0;
 overflow:auto;
 right:0;
 position:absolute;
 top:100px
}
#player-playlist .radio-playlist .playlist-videos-list {
 top:60px
}
.watch-stage-mode #player-playlist .player-height {
 height:460px
}
.watch-stage-mode #player-playlist .playlist-videos-list {
 max-height:360px;
 position:relative;
 top:0
}
.watch-stage-mode #player-playlist .radio-playlist .playlist-videos-list,
.watch-queue-nav .playlist-videos-list {
 max-height:400px
}
.watch-stage-mode #placeholder-playlist {
 max-height:460px
}
#player-playlist .playlist-videos-list li {
 overflow:hidden;
 padding:10px 10px 10px 0;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
#player-playlist .playlist-videos-list li .index {
 font-size:10px;
 float:left;
 line-height:41px;
 margin:0 2px;
 text-align:center;
 width:24px
}
#player-playlist .radio-playlist .playlist-videos-list li .index,
#player-playlist .radio-playlist:not(.watch-queue-nav) .playlist-videos-list li.currently-playing .index {
 margin:0;
 width:15px
}
#player-playlist .playlist-videos-list li:hover {
 background-color:#525252
}
#player-playlist :not(.watch-queue-nav) .playlist-videos-list li.currently-playing {
 background-color:#3a3a3a;
 height:61px
}
#player-playlist :not(.watch-queue-nav) .playlist-videos-list li.currently-playing .index {
 color:#c03636;
 line-height:40px
}
#player-playlist .radio-playlist .playlist-videos-list li:nth-last-child(4),
#player-playlist .radio-playlist .playlist-videos-list li:nth-last-child(3) {
 opacity:.5
}
#player-playlist .radio-playlist .playlist-videos-list li:nth-last-child(2) {
 opacity:.2
}
#player-playlist .radio-playlist .playlist-videos-list li:last-child {
 opacity:.1
}
#player-playlist .yt-uix-button-playlist-remove-item {
 display:none;
 float:right;
 height:14px;
 margin:0
}
#player-playlist .playlist-videos-list li:hover .yt-uix-button-playlist-remove-item {
 display:inline-block
}
#player-playlist .playlist-video {
 display:block;
 height:41px;
 position:relative
}
#player-playlist .playlist-video .video-thumb {
 float:left;
 margin-left:0;
 margin-right:8px;
 height:40px
}
#player-playlist :not(.watch-queue-nav) .currently-playing .playlist-video .video-thumb {
 margin-left:0;
 -moz-box-sizing:border-box;
 box-sizing:border-box
}
#player-playlist .playlist-video-description {
 overflow:hidden;
 position:relative;
 top:-2px
}
#player-playlist .playlist-video h4 {
 color:#cacaca;
 font-size:13px;
 font-weight:normal
}
#player-playlist .video-uploader-byline {
 color:#767676;
 font-size:11px
}
#player-playlist .playlist-video:hover {
 text-decoration:none
}
#player-playlist .playlist-videos-list .yt-ui-ellipsis {
 background-color:#222
}
#player-playlist .playlist-videos-list li:hover .yt-ui-ellipsis {
 background-color:#525252
}
#player-playlist :not(.watch-queue-nav) .playlist-videos-list li.currently-playing .yt-ui-ellipsis {
 background-color:#3a3a3a
}
.playlist-link-item {
 display:inherit;
 margin-top:8px;
 text-align:center;
 text-transform:uppercase
}
.watch-queue-preview {
 background-color:#2a2a2a;
 width:100%;
 height:100%
}
.watch-queue-preview-thumbnail-overlay-big {
 opacity:.4;
 position:absolute;
 overflow:hidden;
 top:0;
 -ms-filter:blur(8px);
 -webkit-filter:blur(8px);
 filter:blur(8px);
 width:100%;
 height:100%
}
.watch-queue-preview-thumbnail-overlay-big .video-thumb {
 width:100%;
 height:100%
}
.watch-queue-preview-content {
 position:absolute;
 width:100%;
 height:100%;
 top:0
}
.watch-queue-preview-center-overlay {
 position:absolute;
 top:50%;
 left:50%;
 width:320px;
 -moz-transform:translate(-50%,-50%);
 -ms-transform:translate(-50%,-50%);
 -webkit-transform:translate(-50%,-50%);
 transform:translate(-50%,-50%)
}
.watch-queue-preview-title {
 width:200%;
 text-align:center;
 font-size:20px;
 line-height:25px;
 color:#ccc;
 overflow:hidden;
 margin-bottom:1em;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis;
 -moz-transform:translateX(-25%);
 -ms-transform:translateX(-25%);
 -webkit-transform:translateX(-25%);
 transform:translateX(-25%)
}
.watch-queue-preview-title .video-receiver {
 color:#fff
}
.watch-queue-preview-actions-container {
 position:relative;
 width:320px
}
.watch-queue-preview-actions-container .dark-overflow-action-menu {
 position:absolute;
 top:0;
 right:0
}
.watch-queue-preview-actions-container .dark-overflow-action-menu .yt-uix-button {
 box-shadow:none
}
.watch-queue-preview-button-actions {
 width:100%;
 top:180px;
 text-align:center;
 z-index:1
}
.preview-play-loading {
 display:inline-block
}
.preview-play-loading .yt-spinner {
 padding:10px
}
.preview-play-loading {
 height:44px;
 width:100%;
 color:#fff;
 font-size:15px;
 font-weight:normal;
 background-color:rgba(0,0,0,0.7);
 margin-top:8px;
 overflow:hidden;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.watch-queue-preview-button-actions .yt-uix-button {
 height:44px;
 width:100%;
 color:#fff;
 font-size:15px;
 font-weight:normal;
 background-color:rgba(0,0,0,0.7);
 margin-top:8px;
 overflow:hidden;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis;
 box-shadow:none
}
.watch-queue-preview-button-actions .yt-uix-button:focus,
.watch-queue-preview-button-actions .yt-uix-button:focus:hover {
 box-shadow:none
}
.yt-uix-button-icon-queue-play {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -339px -271px;
 background-size:auto;
 width:32px;
 height:32px
}
.yt-uix-button-icon-queue-add {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -121px -315px;
 background-size:auto;
 width:32px;
 height:32px
}
.yt-uix-button-icon-queue-add-success {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -390px -16px;
 background-size:auto;
 width:19px;
 height:20px
}
.yt-uix-button-icon-queue-add-error {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -69px -371px;
 background-size:auto;
 width:20px;
 height:20px
}
.preview-addto-queue-button-success .yt-uix-button-icon-wrapper {
 background:#167ac6
}
.preview-addto-queue-button-error .yt-uix-button-icon-wrapper {
 background-image:-moz-linear-gradient(top,#c95145 0,#913d37 100%);
 background-image:-ms-linear-gradient(top,#c95145 0,#913d37 100%);
 background-image:-o-linear-gradient(top,#c95145 0,#913d37 100%);
 background-image:-webkit-linear-gradient(top,#c95145 0,#913d37 100%);
 background-image:linear-gradient(to bottom,#c95145 0,#913d37 100%);
 filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#c95145,EndColorStr=#913d37)
}
.preview-playlist-mode .preview-play-now-button,
.preview-play-all-now-button {
 display:none
}
.preview-playlist-mode .preview-play-all-now-button {
 display:inline-block
}
.watch-queue-preview-thumbnail-overlay-small {
 width:100%;
 height:100%
}
.watch-queue-preview-playlist-control {
 text-align:center;
 margin-top:20px;
 color:#eee;
 text-shadow:0 0 5px rgba(0,0,0,0.2)
}
.watch-queue-preview-playlist-control .yt-uix-form-input-checkbox-container {
 background-color:#fff;
 height:16px;
 margin-bottom:4px
}
.watch-queue-preview-playlist-control .playlist-control-desc {
 padding-left:12px
}
.watch-queue-preview-playlist-control .playlist-control-videos-count {
 font-weight:500
}
.preview-playlist-mode .watch-queue-preview-playlist-control {
 color:#fff
}
#watch-response {
 margin-top:-1px;
 background:#fff
}
#watch-response-content,
#watch-response-header {
 padding:10px
}
#watch-response-header-content {
 margin-top:8px
}
#watch-response-content {
 border-top:1px solid #e2e2e2
}
#watch-response-header-content h3 {
 margin-bottom:2px;
 line-height:14px
}
#watch-response-header-content p {
 margin-bottom:2px;
 line-height:14px;
 font-size:11px;
 color:#767676
}
#watch-response-header-content p a {
 color:#000;
 font-weight:500
}
#watch-response-header-content p a:hover {
 color:#167ac6
}
#watch-response-header-thumb {
 float:left;
 margin-right:10px
}
#watch-response-list {
 margin-right:-10px
}
#watch-response-content-sort {
 margin:0 -10px 15px;
 padding:0 10px 10px;
 border-bottom:1px solid #e2e2e2
}
#watch-response-content .comments-post-container {
 padding-bottom:0
}
#watch-response-content .comments-post-alert {
 width:auto
}
#watch-response-content #watch-discussion {
 border:0;
 padding:0
}
#watch7-sidebar .watch-sidebar-section {
 position:relative;
 z-index:2;
 margin:0 0 15px 5px
}
#watch7-sidebar .watch-sidebar-section:last-child {
 margin-bottom:0
}
#watch-sidebar-discussion .live-chat-widget {
 visibility:hidden
}
#watch-sidebar-discussion .unavailable {
 color:#555;
 text-align:center
}
#watch-sidebar-live-chat {
 background:#f8f8f8;
 padding:0
}
#watch-sidebar-live-chat #hide-live-comments {
 margin:0 12px
}
#watch-sidebar-live-chat .yt-uix-button-expander {
 margin:0
}
#watch-sidebar-live-chat .yt-uix-expander-collapsed {
 background:#fff
}
#watch-sidebar-live-chat .yt-uix-expander-collapsed-body {
 border-top:none
}
#watch7-sidebar .live-chat-iframe {
 width:100%;
 height:592px;
 margin-bottom:-3px
}
#watch7-sidebar .watch-sidebar-head {
 margin:0 5px 10px;
 font-size:13px;
 color:#222;
 line-height:1.3em;
 width:290px;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
#watch7-sidebar .watch-sidebar-head.shelf-renderer-sidebar-head {
 margin-top:-5px
}
#watch7-sidebar .watch-sidebar-head a {
 color:#444
}
#watch7-sidebar .watch-sidebar-head:hover a {
 color:#1c62b9
}
#watch7-sidebar .watch-sidebar-section .watch-sidebar-play-all {
 padding-left:10px;
 margin-top:-3px;
 position:absolute;
 right:0;
 top:0
}
#watch7-sidebar .watch-sidebar-separation-line {
 border-bottom:1px solid #e2e2e2;
 margin:0 5px 15px
}
.video-list-item {
 position:relative;
 margin-bottom:15px
}
#watch7-sidebar .watch-sidebar-body .video-list-item:last-child {
 margin-bottom:0
}
#watch7-sidebar .video-list-item a:hover {
 background:none
}
#watch7-sidebar .video-list-item a .title .yt-deemphasized-text {
 color:#222;
 font-style:italic;
 font-weight:normal
}
#watch7-sidebar .video-list-item:hover .title,
#watch7-sidebar .video-list-item:hover .title .yt-deemphasized-text {
 color:#167ac6;
 text-decoration:none
}
#watch7-sidebar .video-list-item a:visited .title,
#watch7-sidebar .video-list-item a:visited .title .yt-deemphasized-text {
 color:#333
}
#watch7-sidebar .video-list-item a:hover .title,
#watch7-sidebar .video-list-item a:hover .title .yt-deemphasized-text {
 color:#167ac6
}
#watch7-sidebar .video-list-item a:hover:visited .title,
#watch7-sidebar .video-list-item a:hover:visited .title .yt-deemphasized-text {
 color:#036
}
#watch7-sidebar hr.yt-horizontal-rule {
 margin:7px 0 15px
}
#watch_companion_legal_text {
 position:relative;
 margin:0 0 15px 10px;
 border:1px solid #e2e2e2;
 padding:5px;
 width:300px;
 height:250px;
 overflow:auto
}
#watch-channel-brand-div {
 position:relative;
 text-align:center;
 margin-left:10px;
 max-height:265px;
 width:300px
}
#google_companion_ad_div>div,
#google_companion_ad_div>iframe,
#google_companion_ad_div>table {
 margin-bottom:15px
}
#watch-channel-brand-div-text {
 display:none;
 position:absolute;
 top:-10px;
 height:10px;
 text-align:center;
 line-height:10px;
 font-size:10px;
 color:#767676;
 width:300px
}
#watch-channel-brand-div.with-label #watch-channel-brand-div-text {
 display:block
}
#watch-related>.yt-spinner {
 opacity:.5;
 filter:alpha(opacity=50)
}
.video-list-item.button-list-item .title {
 margin-right:15px
}
#watch7-sidebar .video-list-item .close {
 position:absolute;
 left:-9999px;
 z-index:1;
 padding:0
}
#watch7-sidebar .video-list-item .close .yt-uix-button-arrow {
 display:none
}
#watch7-sidebar .video-list-item:hover .close,
#watch7-sidebar .video-list-item .close:focus {
 left:auto;
 right:0
}
.yt-uix-button-icon-related-close {
 opacity:.8;
 filter:alpha(opacity=80);
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -97px -446px;
 background-size:auto;
 width:17px;
 height:17px
}
.yt-uix-button-icon-related-close:hover {
 opacity:1;
 filter:none
}
.yt-uix-button-active .yt-uix-button-icon-related-close {
 opacity:1;
 filter:none;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -276px -48px;
 background-size:auto;
 width:17px;
 height:17px
}
#watch7-sidebar.spf-animate .spf-animate-old {
 position:relative
}
.remote-connected #watch7-sidebar-modules .autoplay-bar {
 display:none
}
.autoplay-bar .autoplay-info-icon {
 cursor:pointer;
 margin-left:4px;
 margin-right:4px;
 margin-top:-1px;
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -386px -56px;
 background-size:auto;
 width:16px;
 height:16px
}
.autoplay-bar .checkbox-on-off {
 position:absolute;
 top:0;
 right:0;
 vertical-align:top;
 font-size:13px;
 font-weight:500;
 color:#767676
}
.autoplay-hovercard {
 display:inline-block;
 vertical-align:middle
}
.yt-channel-title-autogenerated,
.yt-channel-title-icon-verified {
 vertical-align:middle;
 margin-bottom:2px;
 *margin-right:6px;
 -webkit-user-drag:none;
 display:inline-block
}
.channel-header-autogenerated-label a {
 color:#dfdfdf
}
.yt-channel-title-autogenerated {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -22px -42px;
 background-size:auto;
 width:12px;
 height:9px
}
.yt-channel-title-icon-verified {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -235px -332px;
 background-size:auto;
 width:12px;
 height:9px
}
.yt-channel-title-icon-verified:hover {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -232px;
 background-size:auto;
 width:12px;
 height:9px
}
.qualified-channel-title.ellipsized {
 width:100%;
 white-space:nowrap;
 display:inline-block
}
.qualified-channel-title.ellipsized .qualified-channel-title-wrapper {
 max-width:100%;
 display:inline-block
}
.qualified-channel-title.ellipsized .qualified-channel-title-text {
 display:block;
 overflow:hidden;
 white-space:nowrap;
 word-wrap:normal;
 -o-text-overflow:ellipsis;
 text-overflow:ellipsis
}
.qualified-channel-title.ellipsized.has-badge .qualified-channel-title-text {
 margin-right:15px
}
.qualified-channel-title-badge {
 margin-left:5px
}
.qualified-channel-title.ellipsized .qualified-channel-title-badge {
 position:relative;
 left:-15px;
 vertical-align:top;
 display:inline-block
}
.persistent-ypc-module .ypc-transact-offer {
 display:none
}
.ypc-transact-offer {
 margin:0 0 15px 10px;
 overflow:hidden;
 color:#505050;
 font-size:11px;
 line-height:16px
}
.ypc-transact-offer .help-link,
.ypc-transact-offer .ypc-offer-rating-score a {
 color:#767676
}
.ypc-transact-offer .ypc-offer-thumbnail {
 float:left;
 margin:0 10px 0 0
}
.ypc-transact-offer .ypc-offer-metadata-container {
 float:left;
 width:255px
}
.ypc-transact-offer .ypc-offer-title {
 margin:0 0 5px;
 font-size:15px;
 font-weight:500;
 line-height:15px
}
.ypc-transact-offer .ypc-offer-rating-scores {
 margin-bottom:10px
}
.ypc-transact-offer .ypc-offer-rating-score {
 margin:0 0 2px
}
.ypc-transact-offer .ypc-offer-star-rating-bg {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -444px -469px;
 background-size:auto;
 width:66px;
 height:13px;
 display:inline-block;
 position:relative;
 top:1px
}
.ypc-transact-offer .ypc-offer-star-rating-fg {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -263px -487px;
 background-size:auto;
 width:66px;
 height:13px;
 display:inline-block;
 overflow:hidden
}
.ypc-transact-offer .ypc-offer-badge {
 margin:10px 0
}
.ypc-transact-offer .ypc-offer-duration {
 font-weight:500
}
.ypc-transact-offer .ypc-offer-metadata {
 display:block
}
.ytr-transact-offer .ytr-offer-title {
 color:#333;
 font-size:15px;
 font-weight:500;
 margin:0 0 10px
}
.ytr-transact-offer .ytr-offer-subtitle {
 display:block;
 color:#767676;
 font-size:13px;
 font-weight:normal;
 margin:5px 0 0
}
.ytr-transact-offer .ytr-purchase-button {
 float:right;
 margin:0 0 0 5px
}
.ytr-transact-offer .ytr-offer-thumbnail {
 display:block
}
.ytr-transact-offer .ytr-offer-thumbnail .yt-thumb-default {
 margin-top:-1px
}
#watch-offer .ypc-wide-button {
 padding-left:30px;
 padding-right:30px
}
#watch-offer .ypc-spaced-button {
 margin-left:10px
}
#watch-offer.ypc-transact-offer .ypc-offer-metadata-container {
 font-size:13px;
 width:auto
}
#watch-header .ypc-transact-offer {
 margin:0;
 float:right
}
#watch-metadata-description-offer.ypc-direct-offer {
 min-width:310px
}
#watch-metadata-description-offer .ypc-stacked-button {
 width:200px;
 margin-top:20px;
 text-transform:uppercase
}
#watch-metadata-description-offer .ypc-spaced-button {
 margin-left:4px;
 margin-right:4px;
 width:140px
}
.offer-module-menu {
 display:table;
 width:100%;
 table-layout:fixed
}
.offer-module-menu span {
 display:table-cell;
 height:48px;
 vertical-align:middle;
 text-transform:uppercase;
 background-color:#fafafa;
 border-bottom:1px solid #e2e2e2
}
.offer-module-menu>span:hover {
 background-color:#eee;
 cursor:pointer
}
.offer-module-menu>span.active-tab {
 border-bottom:2px solid #167ac6;
 color:#167ac6
}
.offer-module-tab-content {
 display:none
}
#watch-metadata-description-purchase {
 display:table-cell;
 text-align:center
}
#watch-metadata-description-offer div.active-tab {
 display:block;
 background-color:#fafafa
}
#watch-metadata-header .ypc-channel-icon {
 float:right
}
#watch-metadata {
 color:#333
}
#watch-metadata-header {
 height:56px
}
#watch-metadata-description {
 margin-top:10px;
 overflow:hidden
}
#watch-metadata-description-poster {
 display:table-cell;
 margin-right:15px
}
#watch-metadata-description-text {
 line-height:16px;
 display:table-cell;
 vertical-align:top;
 width:100%;
 max-width:475px
}
#watch-metadata-description-text.offer-module-present {
 max-width:204px;
 padding-right:15px
}
#watch-metadata-description-offer {
 display:table-cell;
 text-align:center;
 width:256px;
 min-width:256px
}
.alloffer-button-wrapper {
 height:38px;
 padding-top:10px;
 background-color:#fafafa
}
li.metadata-item {
 margin-top:10px
}
div.yt-uix-expander-collapsed li.metadata-item.metadata-item-is-hidden {
 display:none
}
div.yt-uix-expander-collapsed #watch-metadata-description-text-synopsis {
 max-height:112px;
 overflow:hidden
}
#watch-metadata-header .review-aggregate-badge-renderer-text a {
 color:#333;
 font-size:13px
}
#movie-upsell-card {
 display:table;
 width:100%;
 padding:15px
}
.movie-upsell-column-left {
 float:left;
 display:table-cell;
 margin-right:15px
}
.movie-upsell-column-right {
 display:table-cell;
 width:100%;
 vertical-align:top
}
.movie-upsell-column-content {
 width:100%;
 height:171px
}
.movie-upsell-content {
 position:relative;
 overflow:hidden;
 height:100%
}
.movie-upsell-offer-button {
 position:absolute;
 bottom:0;
 left:0
}
.movie-upsell-offer-button-top {
 position:absolute;
 top:0;
 right:0
}
.movie-upsell-header {
 font-size:13px;
 color:#333;
 margin-bottom:3px
}
.movie-upsell-title {
 margin-bottom:6px;
 max-width:65%;
 font-size:17px;
 height:20px;
 font-weight:normal
}
.movie-upsell-title-compact {
 margin-bottom:5px;
 max-width:65%;
 font-size:16px;
 height:19px;
 font-weight:normal
}
.movie-upsell-title-compact a,
.movie-upsell-title a {
 color:#333
}
.movie-upsell-title-compact a:hover,
.movie-upsell-title a:hover {
 color:#167ac6;
 text-decoration:none
}
.movie-upsell-subtitle {
 font-size:13px;
 color:#333
}
.movie-upsell-subtitle .standalone-ypc-badge-renderer .review-aggregate-badge-renderer-text a:visited,
.movie-upsell-subtitle .standalone-ypc-badge-renderer .review-aggregate-badge-renderer-text a:link {
 font-weight:400;
 font-size:13px;
 color:#333
}
a.movie-upsell-metadata:hover,
a.movie-upsell-metadata {
 text-decoration:none
}
.movie-upsell-description {
 color:#333;
 padding-top:15px
}
#movie-upsell-description-extras {
 margin-top:15px
}
.movie-upsell-extras-section .title,
.movie-upsell-extras-section .content {
 line-height:15px
}
.movie-upsell-extras-section .title {
 float:left;
 margin-right:2px;
 color:#000;
 font-weight:400
}
.movie-upsell-title.yt-ui-ellipsis,
.movie-upsell-subtitle.yt-ui-ellipsis,
.content.watch-info-tag-list.yt-ui-ellipsis {
 -webkit-line-clamp:1;
 max-height:1.3em
}
.movie-upsell-info-icon {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -386px -56px;
 background-size:auto;
 width:16px;
 height:16px
}
.yt-uix-hovercard {
 display:inline-block;
 vertical-align:middle
}
.movie-upsell-info-yt-bottom {
 position:absolute;
 bottom:0;
 left:20px;
 color:#767676;
 font-size:13px;
 font-weight:500
}
.yt-uix-button-icon-calendar-plus {
 background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -496px -377px;
 background-size:auto;
 width:16px;
 height:16px;
 opacity:.6;
 filter:alpha(opacity=60)
}
.yt-uix-button:hover .yt-uix-button-icon-calendar-plus {
 opacity:1;
 filter:alpha(opacity=100)
}
.live-badge,
.hoa-badge {
 border:1px solid #b91f1f;
 padding:0 4px;
 color:#b91f1f;
 font-size:10px;
 background-color:#fff;
 line-height:1.5em;
 text-transform:uppercase;
 display:inline-block
}

	`, 'hhcorestyle');
}


/*
function debug()
{
	insertScript('https://s.ytimg.com/yts/jsbin/www-core-vflmxrio_/www-core.js');
	insertCoreStyle();
	//document.querySelector('ytd-watch-flexy #info').insertAdjacentHTML('beforebegin', createWatchPage(polymerExtractData('ytd-watch-flexy.style-scope').contents.twoColumnWatchNextResults));
	createWatchPage(polymerExtractData('ytd-watch-flexy.style-scope').contents.twoColumnWatchNextResults);
}
debug();
// */

function killWatchPage()
{
	// Move the player so that it doesn't become an issue.
	document.querySelector("ytd-watch-flexy ytd-player #container").appendChild(document.querySelector('#movie_player'));
	document.querySelector('#hhcorestyle').remove();
	document.querySelector('#watchStyleRewrite').remove();
	document.querySelector('#page').remove();
	clearInterval(fixPlayerInterval);
	watchPageLoaded = false;
}

function init()
{
	var loadEvents = 0;
	insertScript('https://s.ytimg.com/yts/jsbin/www-core-vflmxrio_/www-core.js');
	
	window.addEventListener('yt-page-data-updated', function()
	{
		loadEvents++;
		console.log(loadEvents);
		if (window.location.pathname == '/watch')
		{
			if (!watchPageLoaded)
			{
				insertCoreStyle();
				createWatchPage(polymerExtractData('ytd-watch-flexy.style-scope').contents.twoColumnWatchNextResults);
			}
			else
			{
				killWatchPage();
				insertCoreStyle();
				createWatchPage(polymerExtractData('ytd-watch-flexy.style-scope').contents.twoColumnWatchNextResults);
			}
		}
		else
		{
			killWatchPage();
		}
	});
}

init();