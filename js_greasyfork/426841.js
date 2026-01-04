// ==UserScript==
// @name        comments test
// @version 1.0.0
// @description  comments testing
// @author Valmoiiaa
// @require https://unpkg.com/vue@2.6.12/dist/vue.js
// @require https://unpkg.com/xfetch-js@0.5.0/dist/xfetch.min.js
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @run-at document-start
// @license MIT
// @namespace https://greasyfork.org/users/766674
// @downloadURL https://update.greasyfork.org/scripts/426841/comments%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/426841/comments%20test.meta.js
// ==/UserScript==

// shorthand definitions

var d = document;
var db = document.body;
var $ = function(id) { return document.querySelector(id); };
var $a = function(id) { return document.querySelectorAll(id); };

/* Customisable HTML templates below.
// These are implemented to be easily modified, and thus patched.
// But feel free to modify them as you wish.
// ---------------------------------------------------------------
// These are defined in a function so the large HTML blocks can be
// easily minimised in most code editors.
*/

var isLoaded = false;
var tokenidstore;
var nextcontinuation;
var nextitct;
var nextxsrf;
var cachexcrf;
var cache


function i18n(string)
{
	
	// Get language from another source (todo)
	/* TEMP */ var lang = 0; 
	
	var i18nstrings = 
	[
	        /*--ENGLISH--*/
	        [
	         /* header */
	         "Comments", 
			 /* sort */
	         "Top comments", "Newest first", 
			 /* simplebox sample text */
			 "Add a public comment...", "Add a public reply...", "Commenting publicly as ",
			 /* no channel disclaimer */
			 "By completing this action you are creating a ", "channel", " and agree to ", "YouTube's Terms of Service", ".", 0,
			 /* simplebox post button */
	         "Cancel", "Comment", "Reply", 
			 /* comment actions */
			 "Reply", "❤ by ", "Love", "Unlove", "Read more", "Show less",
			 /* time */
			 " second ago", " seconds ago", " minute ago", " minutes ago", 
			 " hour ago", " hours ago", " day ago", " days ago", " week ago", 
			 " weeks ago", " month ago", " months ago", " year ago", 
			 " years ago", 0,
			 /* edited */
			 " (edited)", 
			 /* comment headers */
			 "Highlighted comment", "Pinned by ",
			 /* dropdown actions */
			 "Report", "Edit", "Delete",
			 /* creator dropdown actions */
			 "Pin", "Hide user from channel", "Remove",
			 /* reply strings */
			 "View ", "Hide", "View reply", "Hide reply", " replies", 0,
			 /* user verified */
			 "Verified",
			 /* load more comments */
			 "Show more",
			 /* general load text */
			 "Loading..."
			],
			
	        /*--JAPANESE--*/
	        [
	         /* header */
	         "コメント", 
			 /* sort */
	         "評価順", "新しい順", 
			 /* simplebox sample text */
			 "公開コメントを入力...", "公開の返信を追加...", " としてコメントを公開する",
			 /* no channel disclaimer */
			 "この操作を完了すると", "チャンネル", "が作成され、", "YouTube の利用規約", "に同意したことになります。", 0,
			 /* simplebox post button */
	         "キャンセル", "コメント", "返信", 
			 /* comment actions */
			 "返信", " さんが ❤ をつけました", "ハートを付ける", "ハートをはずす", "続きを読む", "一部を表示",
			 /* time */
			 " 秒前", " 秒前", " 分前", " 分前", 
			 " 時間前", " 時間前", " 日前", " 日前", " 週間前", 
			 " 週間前", " か月前", " か月前", " 年前", 
			 " 年前", 0,
			 /* edited */
			 "（編集済み）", 
			 /* comment headers */
			 "注目のコメント", " さんによって固定されています",
			 /* dropdown actions */
			 "報告", "編集", "削除",
			 /* creator dropdown actions */
			 "固定", "ユーザーをチャンネルに表示しない", "削除",
			 /* reply strings */
			 "表示", "非表示", "返信を表示", "返信を非表示", " 件の返信を", 1,
			 /* user verified */
			 "確認済み",
			 /* load more comments */
			 "显示更多内容",
			 /* general load text */
			 "読み込んでいます..."
			]
	];
	
	if (string = "loading")
	{
		
		return i18nstrings[lang][53];
		
	}
	
}

function getCommentTemplate(template, arg1, arg2, arg3, arg4, arg5, arg6)
{
	
	switch(template)
	{
		
		case "cMainLoading":
			return (
`<div id="watch-discussion" class="branded-page-box yt-card">
          <div class="action-panel-loading">
        <p class="yt-spinner ">
        <span class="yt-spinner-img  yt-sprite" title=""></span>

    <span class="yt-spinner-message">
` + i18n("loading") + `
    </span>
  </p>

    </div>

  </div>`
				);
		break;
		
		case "cMainHead":
			return (
`<div id="comment-section-renderer" class="comment-section-renderer vve-check" data-visibility-tracking="CAsQuy8iEwiOxOGjvpnRAhUXqH4KHR1AD08omxw" data-child-tracking="">
          <h2 class="comment-section-header-renderer" tabindex="0">
<b>Comments</b> • ` + arg2 + `<span class="alternate-content-link"></span>  </h2>

          
<div class="comment-simplebox-renderer yt-uix-servicelink vve-check" data-servicelink="itct=CA0QwXUiEwiOxOGjvpnRAhUXqH4KHR1AD08omxw" data-visibility-tracking="CA0QwXUiEwiOxOGjvpnRAhUXqH4KHR1AD08omxw">
  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-48">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">
        
  <img alt="Default profile photo" role="img" tabindex="0" data-ytimg="1" src="` + arg3 + `" onload=";__ytRIL(this)" width="48" height="48">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
<div class="comment-simplebox-renderer-collapsed comment-section-renderer-redirect" data-target="https://accounts.google.com/ServiceLogin?service=youtube&amp;uilel=3&amp;continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26next%3D%252Fchannel%252FUC-lHJZR3Gqxm24_Vd_AJ5Yw%26hl%3Den%26app%3DNone&amp;hl=en&amp;passive=true"><div class="comment-simplebox-renderer-collapsed-content">Add a public comment...</div><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div></div></div>
              <div class="yt-uix-menu comment-section-sort-menu">  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-pressed="false" aria-label="Action menu." aria-haspopup="true" role="button"><span class="yt-uix-button-content">Top comments</span><span class="yt-uix-button-arrow yt-sprite"></span></button>
<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu"><ul><li>  <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select comment-section-sort-menu-item yt-uix-sessionlink" data-sessionlink-target="/comment_service_ajax?action_get_comments=1" data-menu_name="top-comments" data-sessionlink="itct=CAwQ7pgBIhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-token="Ih4SGFVDLWxISlpSM0dxeG0yNF9WZF9BSjVZdygBMAA%3D" data-url="/comment_service_ajax?action_get_comments=1">
    <span class="yt-ui-menu-item-label">Top comments</span>
  </button>
</li><li>  <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select comment-section-sort-menu-item yt-uix-sessionlink" data-sessionlink-target="/comment_service_ajax?action_get_comments=1" data-menu_name="newest-first" data-sessionlink="itct=CAwQ7pgBIhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-token="Ih4SGFVDLWxISlpSM0dxeG0yNF9WZF9BSjVZdygBMAE%3D" data-url="/comment_service_ajax?action_get_comments=1">
    <span class="yt-ui-menu-item-label">Newest first</span>
  </button>
</li></ul></div></div>

        <div class="yt-alert yt-alert-naked yt-alert-success hid zero-step-tooltip">  <div class="yt-alert-icon">
    <span class="icon master-sprite yt-sprite"></span>
  </div>
<div class="yt-alert-content" role="alert"></div></div>
        <div class="comment-section-renderer-items" id="comment-section-renderer-items">
      <span title="Loading icon" class="yt-spinner-img comment-section-items-loading yt-sprite"></span>
 ` + arg1  + `
  </div>

          




    ` + (arg4 ? getCommentTemplate("cMainLoadMore") : "" ) + `


        <div class="comment-simplebox" id="comment-simplebox"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div><div class="comment-simplebox-frame">
<div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true"></div></div><div class="comment-simplebox-controls">
<div class="comment-simplebox-error-message hid" data-placeholder="Comment failed to post.
"></div><div class="comment-simplebox-buttons"><span class="comment-simplebox-character-counter"></span><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel
</span></button><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty comment-simplebox-submit yt-uix-sessionlink" type="button" onclick=";return false;" data-target="" data-params="" data-zero-step-params=""></button></div></div>  <span title="Loading icon" class="yt-spinner-img comment-simplebox-loading yt-sprite"></span>
</div>
      <div class="feedback-banner hid" aria-live="polite"></div>
        <span title="Loading icon" class="yt-spinner-img comment-renderer-loading yt-sprite"></span>

      <div class="hid" id="comment-renderer-abuse">
        <div class="comment-renderer-abuse-content"></div>
      </div>
    </div>`);
		break;
		
		case "cMainSort":
		break;
		
		case "cCommentBody":
		break;
		
		case "cCommentActions":
		break;
		
		case "cCommentActionReply":
		break;
		
		case "cCommentActionLike":
		break;
		
		case "cCommentActionDislike":
		break;
		
		case "cCommentActionHeart":
		break;
		
		case "cCommentReplyContainer":
		break;
		
		case "cCommentReplyLoadButton":
		break;
		
		case "cCommentRepliesLoading":
		break;
		
		case "cMainLoadMore":
			return (
`<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-section-renderer-paginator yt-uix-sessionlink" type="button" onclick=";return false;" aria-label="Show more
" data-uix-load-more-target-id="comment-section-renderer-items" data-uix-load-more-post-body="page_token=CqgCQ2cwUXhPcmlpTDZaMFFJZ0FDZ0JFcjBCQ0FBUXFPdTN0N2laMFFJcXJ3RzdqK1NLcTRQKzN3T2FudkR1OVlEYnBnUGVqdUNqaWVYV2E4ZWNuYTM3eXFlRkE1YVF2dHkycHB5d0EvUGVvK21IcHVSN2dZL254L1NONHhiOThZbjNvYWo1NkFMNC82bU4vSnl5Z2dMU21LdjZ2L3F0d2dQM3VJbmp6N0dJMEFLQnVKdmFvdVdHa0FHRnRkblBxZkxQM3dMeXU4dmo1cGpTNmdPV3FvdTZtK2o2aHdLcjBvV1VwOGJad2dPOHlkVGdqc1RMV0tHUTQreldwS3dwaUlLNDU3VEs2YmtDNW9PSnV0anVnTklCR0FFZ0ZDaWdzL2p3aTY3QWgyYz0iHBIYVUMtbEhKWlIzR3F4bTI0X1ZkX0FKNVl3KAEoFA%253D%253D" data-sessionlink="itct=CAsQuy8iEwiOxOGjvpnRAhUXqH4KHR1AD08omxw" data-uix-load-more-href="/comment_service_ajax?action_get_comments=1" data-sessionlink-target="/comment_service_ajax?action_get_comments=1" data-uix-load-more-post="true"><span class="yt-uix-button-content">  <span class="load-more-loading hid">
      <span class="yt-spinner">
      <span title="Loading icon" class="yt-spinner-img  yt-sprite"></span>

Loading...
  </span>

  </span>
  <span class="load-more-text">
    Show more

  </span>
</span></button>`);
		break;
		
	}
	
}

function waitForElementLoad(selector, callback, checkFrequency, timeout)
{
	// uses ms 
	// from https://stackoverflow.com/a/29754070
	
	var startTime = Date.now();
	(function loopSearch()
	{
		
		if ($(selector) != null) 
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


// TODO: comment reconstruct and futureproofing

// chOwner, cOwner, pic, name, nUrl, cUrl, cTime, cIsEdited, content, like, rExists, rCount, isHeart

function cCreateComment(commentText, channelPic, channelName, channelUrl, commentUrl, commentTime, commentLike, isReply, isLike, hasLike, isDislike, isHeart, repliesText)
{
	
	
	
	var comment = (
`<section class="` + (isReply ? `comment-replies-renderer` : `comment-thread-renderer`) + ` vve-check" data-visibility-tracking="CNQBEMJ1IhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-priority="0">
<div class="comment-renderer vve-check" data-visibility-tracking="CKQCELZ1IhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-cid="z12xyjpzcqbrjbarj04cdv2x5x3ujbaxgdg">
<a href="` + channelUrl + `" class=" yt-uix-sessionlink g-hovercard      spf-link " data-sessionlink="itct=CKQCELZ1IhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-ytid="UC-jvr-GfjbEfb_8xZMGkVvA">  <span class="video-thumb comment-author-thumbnail yt-thumb ` + (isReply ? `yt-thumb-32` : `yt-thumb-48`) + `">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">
        
  <img alt="` + channelName + `" role="img" tabindex="0" data-ytimg="1" src="` + channelPic + `" onload=";__ytRIL(this)" ` + (isReply ? `width="32" height="32"` : `width="48" height="48"`) + `>

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</a>


    <div id="comment-renderer-edit-z12xyjpzcqbrjbarj04cdv2x5x3ujbaxgdg" class="comment-simplebox-edit" data-editable-content-text="" data-image-src="" data-video-id="">
    </div>
<div class="comment-renderer-content"><div class="comment-renderer-header"><a href="` + channelUrl + `" class="comment-author-text yt-uix-sessionlink g-hovercard      spf-link " data-sessionlink="itct=CKQCELZ1IhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-ytid="UC-jvr-GfjbEfb_8xZMGkVvA">` + channelName + `</a><span class="comment-renderer-time" tabindex="0"><a href="` + commentUrl + `" class=" yt-uix-sessionlink      spf-link " data-sessionlink="itct=CKQCELZ1IhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc" data-ytid="UC-lHJZR3Gqxm24_Vd_AJ5Yw">` + commentTime + `</a></span></div><div class="comment-renderer-text" tabindex="0" role="article"><div class="comment-renderer-text-content">` + commentText + `﻿</div><div class="comment-text-toggle hid"><div class="comment-text-toggle-link read-more"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Read more
</span></button></div><div class="comment-text-toggle-link show-less hid"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Show less
</span></button></div></div></div>

<div class="comment-renderer-footer" data-vote-status="INDIFFERENT"><div class="comment-action-buttons-toolbar">

    <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply yt-uix-sessionlink" type="button" onclick=";window.location.href=this.getAttribute('href');return false;" href="https://accounts.google.com/ServiceLogin?service=youtube&amp;amp;uilel=3&amp;amp;continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26next%3D%252Fchannel%252FUC-lHJZR3Gqxm24_Vd_AJ5Yw%26hl%3Den%26app%3DNone&amp;amp;hl=en&amp;amp;passive=true" role="link" data-sessionlink="itct=CKkCEPBbIhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc"><span class="yt-uix-button-content">Reply</span></button>


    ` + (hasLike ? `
	<span class="comment-renderer-like-count off">` + commentLike + `</span>
	<span class="comment-renderer-like-count on">` + (commentLike * 1 + 1) + `</span>` : `
	<span class="comment-renderer-like-count on">1</span>`) + `

  <span role="radiogroup">
        <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like" type="button" onclick=";window.location.href=this.getAttribute('href');return false;" aria-checked="false" aria-label="Like" href="https://accounts.google.com/ServiceLogin?service=youtube&amp;amp;uilel=3&amp;amp;continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26next%3D%252Fchannel%252FUC-lHJZR3Gqxm24_Vd_AJ5Yw%26hl%3Den%26app%3DNone&amp;amp;hl=en&amp;amp;passive=true" role="link" data-sessionlink="itct=CKoCEPBbIhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc"></button>

        <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike" type="button" onclick=";window.location.href=this.getAttribute('href');return false;" aria-checked="false" aria-label="Dislike" href="https://accounts.google.com/ServiceLogin?service=youtube&amp;amp;uilel=3&amp;amp;continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26next%3D%252Fchannel%252FUC-lHJZR3Gqxm24_Vd_AJ5Yw%26hl%3Den%26app%3DNone&amp;amp;hl=en&amp;amp;passive=true" role="link" data-sessionlink="itct=CKgCEPBbIhMIjsTho76Z0QIVF6h-Ch0dQA9PKJsc"></button>

  </span>
</div></div></div></div></section>`);
	
	return comment;
	
}

function unicodeToChar(text) 
{
   return text.replace(/\\u[\dA-F]{4}/gi, 
          function (match) 
		  {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
}

async function getIdToken(r)
{
	async function reqGetIdToken()
	{
			
		var parse = new DOMParser();

		var response = await fetch(("https://www.youtube.com"), 
		{
			"method": 'GET',
			"mode": 'cors',
			"cache": 'no-cache',
			"credientials": 'same-origin',
			headers: 
			{
				'X-YOUTUBE-CLIENT-NAME': '1',
				'X-YOUTUBE-CLIENT-VERSION': '2.20200101.01.01'
			},
			redirect: 'follow',
			referrerPolicy: 'strict-origin-when-cross-origin',
		});
		
		return response.text();
		
	}
	
	var html = await reqGetIdToken().then(response => html = response);
	var parsed = new DOMParser().parseFromString(html, "text/html");
	
	function findScript()
	{
		for (i = 0; i < parsed.scripts.length; i++)
		{
			if (parsed.scripts[i].innerHTML.startsWith("(function() {window.ytplayer={}"))
				{
					return i;
				}
		}
	}
	
	var script = parsed.scripts[findScript()].innerHTML;
	var index = script.search("ID_TOKEN");
	var proc0 = script.substring(index);
	var proc1 = proc0.substring(0, proc0.search(/(?:[",]){2}/g));
	var response = unicodeToChar(decodeURIComponent(proc1.replace(/(ID_TOKEN\":\")|("")/g, "")));
	
	return response;
	
}

function getIdTokenPromise()
{
	
	var promiseval = getIdToken().then(response => promiseval = response);
	return promiseval;
	
}

async function getComments()
{
	
	videoId = (function()
	{

		return window.location.search.split(/\?|\&|\=/g)[2];
	
	})();
	
	// Request the current video page again and retrieve required data for loading comments.
	
	let paramsData;
	let commentData;
	
	async function gcGetCommentParams()
	{
		
		var response = await fetch(("https://www.youtube.com/watch?v=" + videoId + "&pbj=1"), 
		{
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credientials: 'same-origin',
			headers: 
			{
				'X-YOUTUBE-CLIENT-NAME': '1',
				'X-YOUTUBE-CLIENT-VERSION': '2.20200101.01.01'
			},
			redirect: 'follow',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: JSON.stringify("{}")
		});
		
		return response.json();
	
	}
	
	paramsData = await gcGetCommentParams();
	
	gcCommentParams = 
		paramsData[3].response.contents.twoColumnWatchNextResults.results.results.contents[2].itemSectionRenderer;
	gccpContinuation = 
		encodeURIComponent(gcCommentParams.continuations[0].nextContinuationData.continuation);
	gccpTracking = 
		encodeURIComponent(gcCommentParams.continuations[0].nextContinuationData.clickTrackingParams);
	gccpSession =
		encodeURIComponent(paramsData[3].xsrf_token);
	cachexcrf = gccpSession;
	
	 
	if (typeof gccpContinuation !== 'undefined' && typeof gccpTracking !== 'undefined')
	{
		
		commentData = await gcGetPbjComments();
		
	}
	
	
	async function gcGetHitchhikerComments(callback)
	{
		
		var response = await fetch(("https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1&ctoken=" + gccpContinuation + "&continuation=" + gccpContinuation + "&type=next&itct=" + gccpTracking), 
		{
			"method": 'POST',
			"mode": 'cors',
			"cache": 'no-cache',
			"credientials": 'same-origin',
			headers: 
			{
				"content-type": "application/x-www-form-urlencoded",
				'X-YOUTUBE-CLIENT-NAME': '1',
				'X-YOUTUBE-CLIENT-VERSION': '1.20200101.01.01'
			},
			redirect: 'follow',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: "session_token=" + gccpSession
		});
		
		return response.json();
    
	}
	
	async function gcGetPbjComments()
	{
		
		// Unlike hitchhiker comments, this requires X-Youtube-Identity-Token
		// We must retrieve this from another function.
		
		if (typeof tokenidstore !== 'undefined')
		{
			var tokenid = tokenidstore;
		}
		else
		{
			var tokenid = await getIdToken().then(response => tokenid = response);
			tokenidstore = tokenid;
		}
		
		var response = await fetch(("https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1&ctoken=" + gccpContinuation + "&continuation=" + gccpContinuation + "&type=next&itct=" + gccpTracking), 
		{
			"method": 'POST',
			"mode": 'cors',
			"cache": 'no-cache',
			"credientials": 'same-origin',
			headers: 
			{
				"content-type": "application/x-www-form-urlencoded",
				'X-YOUTUBE-CLIENT-NAME': '1',
				'X-YOUTUBE-CLIENT-VERSION': '2.20200101.01.01',
				"X-Youtube-Identity-Token": tokenid
			},
			redirect: 'follow',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: "session_token=" + gccpSession
		});
		
		return response.json();
    
	}
	
	return commentData;
	
}

async function getMoreComments(cont, track, nextxsrf)
{
	
	console.log("Called getMoreComments(cont, track)");
	console.log("Called getMoreComments(cont, track): cont = " + cont);
	console.log("Called getMoreComments(cont, track): track = " + track);
	
	videoId = (function()
	{

		return window.location.search.split(/\?|\&|\=/g)[2];
	
	})();
	
	console.log("getMoreComments(cont, track): video id resolved");
	
	// Request the current video page again and retrieve required data for loading comments.
	
	let commentData;
	
	gccpContinuation = 
		cont;
	gccpTracking = 
		track;
	gccpSession =
		encodeURIComponent(cachexcrf);
		
	console.log("getMoreComments(cont, track): cache resolved");
	
	 
	if (typeof gccpContinuation !== 'undefined' && typeof gccpTracking !== 'undefined')
	{
		
		commentData = await gcGetPbjComments();
		console.log("getMoreComments(cont, track): Awaiting gcGetPbjComments()");
		
	}
	
	async function gcGetPbjComments()
	{
		
		console.log("getMoreComments(cont, track): Called gcGetPbjComments()");
		
		// Unlike hitchhiker comments, this requires X-Youtube-Identity-Token
		// We must retrieve this from another function.
		
		if (typeof tokenidstore !== 'undefined')
		{
			var tokenid = tokenidstore;
			console.log("getMoreComments(cont, track): Using cached token");
		}
		else
		{
			console.log("getMoreComments(cont, track): Generating new token");
			var tokenid = await getIdToken().then(response => tokenid = response);
			tokenidstore = tokenid;
		}
		
		var response = await fetch(("https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1&ctoken=" + gccpContinuation + "&continuation=" + gccpContinuation + "&type=next&itct=" + gccpTracking), 
		{
			"method": 'POST',
			"mode": 'cors',
			"cache": 'no-cache',
			"credientials": 'same-origin',
			headers: 
			{
				"content-type": "application/x-www-form-urlencoded",
				'X-YOUTUBE-CLIENT-NAME': '1',
				'X-YOUTUBE-CLIENT-VERSION': '2.20200101.01.01',
				"X-Youtube-Identity-Token": tokenid
			},
			redirect: 'follow',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: "session_token=" + nextxsrf
		});
		
		console.log("getMoreComments(cont, track): Proper fetch");
		
		console.log("getMoreComments(cont, track): Returned response");
		return response.json();
		
    
	}
	
	console.log("getMoreComments(cont, track): Returned commentData");
	return commentData;
	
	
}

function buildComment(comments, i)
{
	
	// bool comments.response.continuationContents.itemSectionContinuation.contents[0].commentThreadRenderer.comment.commentRenderer.authorIsChannelOwner
	// very useful ^^
	
	// function cCreateComment(commentText, channelPic, channelName, channelUrl, commentUrl, commentTime, commentLike, isReply, isLike, isDislike, isHeart, repliesText)
	
	function getCommentText()
	{
		var finaltext = "";
		
		for (o = 0; o < comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.contentText.runs.length; o++)
		{
			
			finaltext = finaltext + comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.contentText.runs[o].text;
			console.log(finaltext);
			console.log(o);
			
		}
		
		return finaltext;
	}
	
	var commentText = getCommentText();
	var channelPic = comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.authorThumbnail.thumbnails[0].url;
	var channelName = comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.authorText.simpleText;
	var channelUrl = comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.authorEndpoint.browseEndpoint.canonicalBaseUrl;
	var commentUrl = "";
	var commentTime = comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.publishedTimeText.runs[0].text;
	if (typeof comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.voteCount !== 'undefined')
	{
		var commentLike = comments.response.continuationContents.itemSectionContinuation.contents[i].commentThreadRenderer.comment.commentRenderer.likeCount;
		var hasLike = true;
	}
	else
	{
		var commentLike = "";
		var hasLike = false;
	}
	var isReply = false;
	var isLike = false;
	var isDislike = false;
	var isHeart = false;
	var repliesText = "";
	
	
	return cCreateComment(commentText, channelPic, channelName, channelUrl, commentUrl, commentTime, commentLike, isReply, isLike, hasLike, isDislike, isHeart, repliesText);
	// return cCreateComment("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l");
	
	
}

function buildCommentTree(comments)
{
	
	var commentTree = "";
	
	for (i = 0; i < (comments.response.continuationContents.itemSectionContinuation.contents.length); i++)
	{
		
		var newComment = buildComment(comments, i);
		commentTree += newComment;
		
		
	}
	
	return commentTree;
	
}

function initBuildComments(comments)
{
	
	function getHasCont()
	{
		
		if (typeof comments.response.continuationContents.itemSectionContinuation.continuations !== 'undefined')
		{
			nextcontinuation = comments.response.continuationContents.itemSectionContinuation.continuations[0].nextContinuationData.continuation;
			nextitct = comments.response.continuationContents.itemSectionContinuation.continuations[0].nextContinuationData.clickTrackingParams;
			nextxsrf = comments.xsrf_token;
			
			return true;
		}
		else
		{
			return false;
		}
		
	}
	
	var commentsCount = comments.response.continuationContents.itemSectionContinuation.header.commentsHeaderRenderer.countText.runs[0].text;
	var userPfp = comments.response.continuationContents.itemSectionContinuation.header.commentsHeaderRenderer.createRenderer.commentSimpleboxRenderer.authorThumbnail.thumbnails[1].url;
	var hasCont = getHasCont();
	
	
	var response = getCommentTemplate("cMainHead", buildCommentTree(comments), commentsCount, userPfp, hasCont)
	return response;
	
}

function loadMoreButtonFunctionality()
{
	
	
	function lmLoadMoreOn()
	{
		$(".comment-section-renderer-paginator").setAttribute("disabled", "");
		$(".comment-section-renderer-paginator .load-more-loading").setAttribute("class", $(".comment-section-renderer-paginator .load-more-loading").getAttribute("class").replace("hid", ""));
		$(".comment-section-renderer-paginator .load-more-text").setAttribute("class", $(".comment-section-renderer-paginator .load-more-text").getAttribute("class") + " hid");
	}
	function lmLoadMoreOff()
	{
		$(".comment-section-renderer-paginator").removeAttribute("disabled");
		$(".comment-section-renderer-paginator .load-more-text").setAttribute("class", $(".comment-section-renderer-paginator .load-more-text").getAttribute("class").replace("hid", ""));
		$(".comment-section-renderer-paginator .load-more-loading").setAttribute("class", $(".comment-section-renderer-paginator .load-more-loading").getAttribute("class") + " hid");
	}
	
	$(".comment-section-renderer-paginator").onclick = function()
	{
		lmLoadMoreOn();
		
		loadMoreComments();
		
	}
	
}

function postloadEvents()
{
	
	if ($(".comment-section-renderer-paginator"))
	{
		loadMoreButtonFunctionality();
	}
	
}

function resetLoading(comments)
{
	
	$(".comment-section-renderer-paginator").outerHTML = ""; // clean up our garbage
	
	if (typeof comments.response.continuationContents.itemSectionContinuation.continuations !== 'undefined')
	{
		nextcontinuation = comments.response.continuationContents.itemSectionContinuation.continuations[0].nextContinuationData.continuation;
		nextitct = comments.response.continuationContents.itemSectionContinuation.continuations[0].nextContinuationData.clickTrackingParams;
		nextxsrf = comments.xsrf_token;
		
		$("#comment-section-renderer-items").insertAdjacentHTML("afterend", getCommentTemplate("cMainLoadMore"));
		postloadEvents();
	}
	else
	{
		return false;
	}
	
}

function loadComments(retry)
{
	
	var commentsp;
	var commentsg = getComments().then(response => commentsp = response);
	
	
	// Loop while waiting for comments to be gotten
	
	var loopload = setInterval(function()
	{
		/* if (typeof commentsp.content_html !== 'undefined')
		{
		
			var commentContainer = getCommentTemplate("cMainHead", commentsp.content_html);
			
			$("#watch-discussion .action-panel-loading").outerHTML = commentContainer;
		
		}	*/
		
		if (typeof commentsp.xsrf_token !== 'undefined')
		{
		
			var commentContainer = initBuildComments(commentsp);
			clearInterval(loopload);
			
			$("#watch-discussion .action-panel-loading").outerHTML = commentContainer;
			postloadEvents();
		
		}	
	}, 100)
	
}

function loadMoreComments()
{
	
	var commentsp;
	var commentsg = getMoreComments(nextcontinuation, nextitct, nextxsrf).then(response => commentsp = response);
	
	
	// Loop while waiting for comments to be gotten
	
	var loopload = setInterval(function()
	{
		/* if (typeof commentsp.content_html !== 'undefined')
		{
		
			var commentContainer = getCommentTemplate("cMainHead", commentsp.content_html);
			
			$("#watch-discussion .action-panel-loading").outerHTML = commentContainer;
		
		}	*/
		
		if (typeof commentsp.xsrf_token !== 'undefined')
		{
		
			var commentContainer = buildCommentTree(commentsp);
			clearInterval(loopload);
			
			$("#comment-section-renderer-items").insertAdjacentHTML("beforeend", commentContainer);
			resetLoading(commentsp);
		
		}	
	}, 100)
	
}

function mainloader()
{
	
	injectCss();
	
	/* Function loads the new comments upon the initial page visit
	// or upon a page change event. This is actually harder than
	// it may seem and we have to get hacky at times.
	*/
	
	// Evaluate page type and load/unload comments based on this:
	isWatch() ? reloadCheck() : commentsModuleUnload();
	
	function reloadCheck()
	{
		
		isLoaded ? commentsModuleUnload("reload") : commentsModuleLoad();
		
	}
	
	function commentsModuleLoad()
	{
		
		isLoaded = true;
		
		
		// Wait for w8r and load the elements
		
		waitForElementLoad("#action-panel-details", function()
		{
			
			/*var cMain = document.createElement("div");
			cMain.setAttribute("id", "commentModuleTemp_cMain");
			$("#action-panel-details").parentNode.insertBefore(cMain, $("action-panel-details").nextSibling);
			$("#commentModuleTemp_cMain").outerHTML = getCommentTemplate("cMainLoading");*/
			
			$("#action-panel-details").insertAdjacentHTML("afterend", getCommentTemplate("cMainLoading"));
			
			setTimeout(loadComments(), 1000);
			
		}, 5, 15000);
		
	}
	
	function commentsModuleUnload(arg0)
	{
		
		// Clean up garbage left over from a previous watch page:
		
		isLoaded = false;
		
		$("#watch-discussion").outerHTML = "";
		
		if (arg0 == "reload")
		{
			
			commentsModuleLoad();
			
		}
		
	}
	
}

function isWatch()
{
	
	return (window.location.pathname == "/watch" ? true : false);
	
}

function addStyle(styleString) 
{
	// Shamelessly stolen from the main w8r script
	const style = document.createElement('style');
	style.textContent = styleString;
	document.head.append(style);
}

function injectCss()
{
	
	addStyle(`#watch-discussion .yt-ui-menu-content:focus {
    outline: none;
}

#watch-discussion .yt-ui-menu-content {
    background: #fff;
    border: 1px solid #d3d3d3;
    outline: none;
    overflow: visible;
    padding: 10px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
}

#watch-discussion .yt-ui-menu-item {
    position: relative;
    color: #333;
    cursor: pointer;
    display: block;
    font-size: 13px;
    line-height: 25px;
    margin: 0;
    padding: 0 15px;
    text-align: left;
    text-decoration: none;
    white-space: nowrap;
    width: 100%;
    word-wrap: normal;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

#watch-discussion .yt-ui-menu-item-label {
    display: inline-block;
    vertical-align: middle;
}

#watch-discussion .yt-ui-menu-item:hover {
    background: #eee;
}

#watch-discussion .yt-ui-menu-item:focus {
    outline: none;
    background: #eee;
}

#watch-discussion .yt-ui-menu-content ul:focus {
    outline: none;
}

#watch-discussion .yt-spinner-img {
    background: url(https://s.ytimg.com/yts/img/icn_loading_animated-vflff1Mjj.gif) no-repeat center;
}

#watch-discussion .yt-spinner-img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
}


#watch-discussion .yt-thumb {
    overflow: hidden;
    background: #f1f1f1;
    font-size: 0;
    vertical-align: middle;
    display: inline-block;
}

#watch-discussion .yt-thumb .vertical-align {
    height: 100%;
}

#watch-discussion .yt-thumb img {
    font-size: 13px;
    outline: none;
}

#watch-discussion .yt-thumb-clip {
    position: absolute;
    _position: static;
    bottom: -100px;
    top: -100px;
    left: -100px;
    right: -100px;
    text-align: center;
    white-space: nowrap;
    word-break: normal;
}

#watch-discussion .yt-thumb-clip img,
#watch-discussion .yt-thumb-clip .vertical-align {
    display: inline-block;
    vertical-align: middle;
}

#watch-discussion .yt-thumb-square {
    display: block;
    height: auto;
}

#watch-discussion .yt-thumb-square {
    padding-bottom: 100%;
}

#watch-discussion .yt-thumb-32 {
    width: 32px;
}

#watch-discussion .yt-thumb-48 {
    width: 48px;
}

#watch-discussion .video-thumb {
    position: relative;
}

#watch-discussion .yt-uix-button {
    display: inline-block;
    height: 28px;
    border: solid 1px transparent;
    padding: 0 10px;
    outline: 0;
    font-weight: 500;
    font-size: 11px;
    text-decoration: none;
    white-space: nowrap;
    word-wrap: normal;
    line-height: normal;
    vertical-align: middle;
    cursor: pointer;
    *overflow: visible;
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

#watch-discussion .yt-uix-button:hover {
    text-decoration: none;
}

#watch-discussion .yt-uix-button:focus,
#watch-discussion .yt-uix-button:focus:hover {
    box-shadow: 0 0 0 2px rgba(27, 127, 204, 0.4);
}

#watch-discussion .yt-uix-button::-moz-focus-inner {
    border: 0;
    padding: 0;
}

#watch-discussion .yt-uix-button .yt-uix-button-arrow {
    display: inline-block;
    vertical-align: middle;
}

#watch-discussion .yt-uix-button-has-icon:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
}

#watch-discussion .yt-uix-button-has-icon.no-icon-markup:before {
    margin-right: 6px;
}

#watch-discussion .yt-uix-button-empty.yt-uix-button-has-icon.no-icon-markup:before {
    margin-right: 0;
}

#watch-discussion .yt-uix-button-size-small {
    height: 20px;
    color: #666;
}

#watch-discussion .yt-uix-button-default:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.10);
}

#watch-discussion .yt-uix-button-default:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}

#watch-discussion .yt-uix-button-default {
    border-color: #d3d3d3;
    background: #f8f8f8;
    color: #333;
}

#watch-discussion .yt-uix-button-default:before {
    opacity: .5;
    filter: alpha(opacity=50);
}

#watch-discussion .yt-uix-button-default:hover:before {
    opacity: .6;
    filter: alpha(opacity=60);
}

#watch-discussion .yt-uix-button-default:active:before {
    opacity: .8;
    filter: alpha(opacity=80);
}

#watch-discussion .yt-uix-button-default:active:hover:before {
    opacity: 1;
    filter: alpha(opacity=100);
}

#watch-discussion .yt-uix-button-primary {
    border-color: #167ac6;
    background: #167ac6;
    color: #fff;
}

#watch-discussion .yt-uix-button-primary:hover {
    background: #126db3;
}

#watch-discussion .yt-uix-button-primary:active {
    background: #095b99;
    box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.5);
}

#watch-discussion .yt-uix-button-link {
    padding: 0;
    border: none;
    height: auto;
    background: transparent;
    color: #167ac6;
    font-weight: normal;
    font-size: inherit;
    text-decoration: none;
    box-shadow: none;
}

#watch-discussion .yt-uix-button-link:active,
#watch-discussion .yt-uix-button-link:hover {
    background: transparent;
    text-decoration: underline;
    box-shadow: none;
}

#watch-discussion .yt-uix-button-arrow {
    margin-top: -3px;
    margin-left: 5px;
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    height: 0;
}

#watch-discussion .yt-uix-expander-head {
    cursor: pointer;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
}

#watch-discussion .yt-uix-expander .yt-uix-expander-collapsed-body,
#watch-discussion .yt-uix-expander-collapsed .yt-uix-expander-body {
    display: none;
}

#watch-discussion .yt-uix-expander-collapsed .yt-uix-expander-collapsed-body {
    display: block;
}

#watch-discussion .yt-uix-menu {
    display: inline-block;
    position: relative;
}

#watch-discussion .yt-uix-menu-content {
    position: absolute;
    z-index: 2000000100;
}

#watch-discussion .yt-uix-menu-trigger {
    width: 100%;
}

#watch-discussion .yt-uix-menu-content-hidden {
    display: none;
}

#watch-discussion .yt-uix-menu .yt-uix-menu-content {
    left: 100%;
    top: 0;
}

#watch-discussion .comment-section-renderer-items {
    margin-bottom: 20px;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

#watch-discussion .comment-renderer {
    overflow: hidden;
    position: relative;
    padding-right: 20px;
}

#watch-discussion .comment-author-thumbnail {
    float: left;
    margin-right: 10px;
}

#watch-discussion .comment-renderer .comment-renderer-content {
    overflow: hidden;
    min-height: 48px;
}

#watch-discussion .comment-renderer .comment-renderer-like-count.on {
    display: none;
}

#watch-discussion .comment-renderer .comment-renderer-like-count.off {
    display: inline;
}

#watch-discussion .comment-section-items-loading {
    display: none;
    left: 50%;
    position: relative;
    top: 38%;
}

#watch-discussion .comment-action-buttons-renderer-thumb {
    cursor: pointer;
}

#watch-discussion .comment-action-buttons-toolbar .yt-uix-button {
    border: none;
    vertical-align: top;
}

#watch-discussion .sprite-comment-actions {
    height: 14px;
    padding: 0 3px;
    vertical-align: top;
    background: transparent;
    box-shadow: none;
}

#watch-discussion .sprite-comment-actions:hover {
    box-shadow: none;
}

#watch-discussion .sprite-comment-actions:before {
    opacity: .54;
}

#watch-discussion .comment-renderer .sprite-comment-actions:hover:before {
    opacity: .6;
}

.sprite-dislike:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -255px -36px;
    background-size: auto;
    width: 14px;
    height: 14px;
}

.sprite-like:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -255px 0;
    background-size: auto;
    width: 14px;
    height: 14px;
}

.comment-section-sort-menu {
    margin-bottom: 20px;
}

.comment-renderer-loading {
    display: none;
    left: 45%;
    position: absolute;
}

.comment-renderer-like-count {
    margin-right: 8px;
    color: #128ee9;
    font-size: 9pt;
    vertical-align: top;
}

.comment-author-text {
    color: #128ee9;
    font-weight: 500;
    text-decoration: none;
    word-break: break-all;
}

.comment-renderer-header .comment-renderer-time {
    color: #767676;
    font-size: 11px;
    margin-left: 6px;
}

.comment-renderer-header .comment-renderer-time a {
    color: #767676;
}

.comment-renderer-text {
    margin: 3px 0 8px;
}

.comment-renderer-text-content {
    max-height: 65px;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: 8px;
}

.comment-text-toggle {
    margin: -8px 0 10px;
}

.comment-replies-renderer {
    margin-left: 58px;
}

.comment-replies-renderer .comment-renderer {
    margin: 12px 0;
}

.comment-replies-renderer .comment-renderer-content {
    min-height: 32px;
}

.comment-replies-renderer-paginator {
    display: block;
    margin: 6px 0 0;
    color: #2793e6;
    font-weight: 500;
}

.comment-replies-renderer-view,
.comment-replies-renderer-hide {
    margin: 6px 0 0;
    color: #2793e6;
    font-weight: 500;
}

.comment-replies-renderer-expander-down:after {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -20px 0;
    background-size: auto;
    width: 16px;
    height: 16px;
    content: "";
    display: inline-block;
    opacity: .7;
    vertical-align: text-bottom;
}

.comment-replies-renderer-expander-up:after {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -235px -32px;
    background-size: auto;
    width: 16px;
    height: 16px;
    content: "";
    display: inline-block;
    vertical-align: text-bottom;
}

.comment-replies-renderer-paginator:hover:after,
.comment-replies-renderer-view:hover:after {
    opacity: 1;
}

.comment-section-header-renderer {
    padding: 0 0 20px;
    text-transform: uppercase;
    font-size: 13px;
    color: #555;
}

.comment-section-header-renderer .alternate-content-link {
    margin-left: 15px;
}

.comment-simplebox {
    background-color: #fff;
    overflow: hidden;
    display: none;
    position: relative;
}

.comment-simplebox-frame {
    border: 1px solid #d5d5d5;
    border-radius: 2px;
    box-shadow: inset 0 0 1px rgba(0, 0, 0, .05);
    margin-left: 11px;
    margin-bottom: 8px;
    padding: 10px;
    min-height: 28px;
}

.comment-simplebox-arrow {
    height: 12px;
    position: absolute;
    top: 0;
    width: 12px;
    left: 0;
    margin: 0;
}

.comment-simplebox-arrow .arrow-inner {
    border: 7px solid #fff;
    left: 2px;
    top: 1px;
    z-index: 1;
}

.comment-simplebox-arrow .arrow-outer {
    border: 6px solid #d5d5d5;
    left: 0;
    top: 0;
}

.comment-simplebox-arrow .arrow-inner,
.comment-simplebox-arrow .arrow-outer {
    border-bottom-color: transparent;
    border-left-color: transparent;
    position: absolute;
}

.comment-simplebox-error-message {
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-flex-basis: 0;
    flex-basis: 0;
    -webkit-align-self: center;
    align-self: center;
    color: #e62117;
    font-size: 11px;
    margin-left: 11px;
}

.comment-simplebox-error-message:empty:after {
    content: attr(data-placeholder);
}

.comment-simplebox-text,
.comment-simplebox-prompt {
    background-color: #fff;
    color: #333;
    line-height: 16px;
    text-align: left;
}

.comment-simplebox-text {
    min-height: inherit;
    overflow: hidden;
    white-space: pre-wrap;
}

.comment-simplebox-text:empty:after {
    content: attr(data-placeholder);
    color: #b8b8b8;
    display: inline-block;
    width: 0;
    white-space: nowrap;
}

.comment-simplebox-prompt {
    font-weight: 500;
    word-wrap: normal;
}

.comment-simplebox-text:focus {
    outline: 0;
}

.comment-simplebox-controls {
    display: -moz-flexbox;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-items: flex-end;
    align-items: flex-end;
}

.comment-simplebox-buttons {
    margin-left: auto;
}

.comment-simplebox-buttons>* {
    margin-left: 10px;
}

.comment-simplebox-loading {
    display: none;
    left: 50%;
    position: absolute;
    top: 38%;
}

.comment-simplebox-renderer {
    overflow: hidden;
    position: relative;
}

.comment-simplebox-renderer {
    padding: 0 0 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e2e2e2;
}

.comment-simplebox-renderer-collapsed {
    display: block;
    overflow: hidden;
    position: relative;
    text-align: left;
}

.comment-simplebox-renderer-collapsed-content {
    border: 1px solid #d5d5d5;
    color: #b8b8b8;
    cursor: pointer;
    margin-left: 11px;
    min-height: 28px;
    border-radius: 2px;
    padding: 10px;
}

.comment-renderer-reply {
    color: #555;
    opacity: .75;
}

.comment-renderer-reply:hover,
.comment-renderer:hover .comment-renderer-reply {
    text-decoration: none;
    opacity: 1;
}

#watch-discussion .comment-renderer-reply:after {
    content: "•";
    margin: 0 5px;
}

.comment-thread-renderer {
    margin: 0 10px 30px 0;
    line-height: 1.3em;
}

.comment-section-renderer-paginator {
    margin: 15px 25px;
    border: 1px solid #d3d3d3;
    padding: 10px 0;
    cursor: pointer;
    font-weight: 500;
    text-align: center;
    background-color: #f8f8f8;
    color: #333;
    font-size: 12px;
    outline: 0;
    height: 100%;
    width: 95%;
    background-image: -moz-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: -ms-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: -o-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: -webkit-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: linear-gradient(to top, #fcfcfc 0, #f8f8f8 100%);
}

.comment-section-renderer-paginator:hover {
    background-color: #f0f0f0;
    border-color: #c6c6c6;
    text-decoration: none;
    background-image: -moz-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: -ms-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: -o-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: -webkit-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: linear-gradient(to top, #f0f0f0 0, #f8f8f8 100%);
}

.feedback-banner {
    padding: 10px 0;
    background: #fcf4d8;
    text-align: center;
    margin: 0 0 10px;
}

.yt-alert-naked.yt-alert.zero-step-tooltip {
    margin-top: 0;
    margin-bottom: 18px;
}

body:-webkit-full-screen-ancestor>:not(:-webkit-full-screen-ancestor):not(:-webkit-full-screen),
body :-webkit-full-screen-ancestor>:not(:-webkit-full-screen-ancestor):not(:-webkit-full-screen) {
    display: none!important;
}

.subscription-list-item.selected:not(:hover) .added-badge {
    display: inherit;
}


.comment-section-renderer-items {
    margin-bottom: 20px;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.comment-renderer {
    overflow: hidden;
    position: relative;
    padding-right: 20px;
}

.comment-author-thumbnail {
    float: left;
    margin-right: 10px;
}

.comment-renderer .comment-renderer-content {
    overflow: hidden;
    min-height: 48px;
}

.comment-renderer .comment-renderer-like-count.on {
    display: none;
}

.comment-renderer .comment-renderer-like-count.off {
    display: inline;
}

.comment-section-items-loading {
    display: none;
    left: 50%;
    position: relative;
    top: 38%;
}

.comment-action-buttons-renderer-thumb {
    cursor: pointer;
}

.comment-action-buttons-toolbar .yt-uix-button {
    border: none;
    vertical-align: top;
}

.sprite-comment-actions {
    height: 14px;
    padding: 0 3px;
    vertical-align: top;
    background: transparent;
    box-shadow: none;
}

#watch-discussion .sprite-comment-actions:hover {
    box-shadow: none;
}

#watch-discussion .sprite-comment-actions:before {
    opacity: .54;
}

#watch-discussion .comment-renderer .sprite-comment-actions:hover:before {
    opacity: .6;
}

.sprite-dislike:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -255px -36px;
    background-size: auto;
    width: 14px;
    height: 14px;
}

.sprite-like:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -255px 0;
    background-size: auto;
    width: 14px;
    height: 14px;
}

.comment-section-sort-menu {
    margin-bottom: 20px;
}

.comment-renderer-loading {
    display: none;
    left: 45%;
    position: absolute;
}

.comment-renderer-like-count {
    margin-right: 8px;
    color: #128ee9;
    font-size: 9pt;
    vertical-align: top;
}

.comment-author-text {
    color: #128ee9;
    font-weight: 500;
    text-decoration: none;
    word-break: break-all;
}

.comment-renderer-header .comment-renderer-time {
    color: #767676;
    font-size: 11px;
    margin-left: 6px;
}

.comment-renderer-header .comment-renderer-time a {
    color: #767676;
}

.comment-renderer-text {
    margin: 3px 0 8px;
}

.comment-renderer-text-content {
    max-height: 65px;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: 8px;
}

.comment-text-toggle {
    margin: -8px 0 10px;
}

.comment-replies-renderer {
    margin-left: 58px;
}

.comment-replies-renderer .comment-renderer {
    margin: 12px 0;
}

.comment-replies-renderer .comment-renderer-content {
    min-height: 32px;
}

.comment-replies-renderer-paginator {
    display: block;
    margin: 6px 0 0;
    color: #2793e6;
    font-weight: 500;
}

.comment-replies-renderer-view,
.comment-replies-renderer-hide {
    margin: 6px 0 0;
    color: #2793e6;
    font-weight: 500;
}

.comment-replies-renderer-expander-down:after {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -20px 0;
    background-size: auto;
    width: 16px;
    height: 16px;
    content: "";
    display: inline-block;
    opacity: .7;
    vertical-align: text-bottom;
}

.comment-replies-renderer-expander-up:after {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vfltA6rO3.png) -235px -32px;
    background-size: auto;
    width: 16px;
    height: 16px;
    content: "";
    display: inline-block;
    vertical-align: text-bottom;
}

.comment-replies-renderer-paginator:hover:after,
.comment-replies-renderer-view:hover:after {
    opacity: 1;
}

.comment-section-header-renderer {
    padding: 0 0 20px;
    text-transform: uppercase;
    font-size: 13px;
    color: #555;
}

.comment-section-header-renderer .alternate-content-link {
    margin-left: 15px;
}

.comment-simplebox {
    background-color: #fff;
    overflow: hidden;
    display: none;
    position: relative;
}

.comment-simplebox-frame {
    border: 1px solid #d5d5d5;
    border-radius: 2px;
    box-shadow: inset 0 0 1px rgba(0, 0, 0, .05);
    margin-left: 11px;
    margin-bottom: 8px;
    padding: 10px;
    min-height: 28px;
}

.comment-simplebox-arrow {
    height: 12px;
    position: absolute;
    top: 0;
    width: 12px;
    left: 0;
    margin: 0;
}

.comment-simplebox-arrow .arrow-inner {
    border: 7px solid #fff;
    left: 2px;
    top: 1px;
    z-index: 1;
}

.comment-simplebox-arrow .arrow-outer {
    border: 6px solid #d5d5d5;
    left: 0;
    top: 0;
}

.comment-simplebox-arrow .arrow-inner,
.comment-simplebox-arrow .arrow-outer {
    border-bottom-color: transparent;
    border-left-color: transparent;
    position: absolute;
}

.comment-simplebox-error-message {
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-flex-basis: 0;
    flex-basis: 0;
    -webkit-align-self: center;
    align-self: center;
    color: #e62117;
    font-size: 11px;
    margin-left: 11px;
}

.comment-simplebox-error-message:empty:after {
    content: attr(data-placeholder);
}

.comment-simplebox-text,
.comment-simplebox-prompt {
    background-color: #fff;
    color: #333;
    line-height: 16px;
    text-align: left;
}

.comment-simplebox-text {
    min-height: inherit;
    overflow: hidden;
    white-space: pre-wrap;
}

.comment-simplebox-text:empty:after {
    content: attr(data-placeholder);
    color: #b8b8b8;
    display: inline-block;
    width: 0;
    white-space: nowrap;
}

.comment-simplebox-prompt {
    font-weight: 500;
    word-wrap: normal;
}

.comment-simplebox-text:focus {
    outline: 0;
}

.comment-simplebox-controls {
    display: -moz-flexbox;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-items: flex-end;
    align-items: flex-end;
}

.comment-simplebox-buttons {
    margin-left: auto;
}

.comment-simplebox-buttons>* {
    margin-left: 10px;
}

.comment-simplebox-loading {
    display: none;
    left: 50%;
    position: absolute;
    top: 38%;
}

.comment-simplebox-renderer {
    overflow: hidden;
    position: relative;
}

.comment-simplebox-renderer {
    padding: 0 0 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e2e2e2;
}

.comment-simplebox-renderer-collapsed {
    display: block;
    overflow: hidden;
    position: relative;
    text-align: left;
}

.comment-simplebox-renderer-collapsed-content {
    border: 1px solid #d5d5d5;
    color: #b8b8b8;
    cursor: pointer;
    margin-left: 11px;
    min-height: 28px;
    border-radius: 2px;
    padding: 10px;
}

#watch-discussion .comment-renderer-reply {
    color: #555;
    opacity: .75;
}

#watch-discussion .comment-renderer-reply:hover,
#watch-discussion .comment-renderer:hover .comment-renderer-reply {
    text-decoration: none;
    opacity: 1;
}

#watch-discussion .comment-renderer-reply:after {
    content: "\\002022";
    margin: 0 5px;
}

.comment-thread-renderer {
    margin: 0 10px 30px 0;
    line-height: 1.3em;
}

.comment-section-renderer-paginator {
    margin: 15px 25px;
    border: 1px solid #d3d3d3;
    padding: 10px 0;
    cursor: pointer;
    font-weight: 500;
    text-align: center;
    background-color: #f8f8f8;
    color: #333;
    font-size: 12px;
    outline: 0;
    height: 100%;
    width: 95%;
    background-image: -moz-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: -ms-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: -o-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: -webkit-linear-gradient(bottom, #fcfcfc 0, #f8f8f8 100%);
    background-image: linear-gradient(to top, #fcfcfc 0, #f8f8f8 100%);
}

.comment-section-renderer-paginator:hover {
    background-color: #f0f0f0;
    border-color: #c6c6c6;
    text-decoration: none;
    background-image: -moz-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: -ms-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: -o-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: -webkit-linear-gradient(bottom, #f0f0f0 0, #f8f8f8 100%);
    background-image: linear-gradient(to top, #f0f0f0 0, #f8f8f8 100%);
}

.feedback-banner {
    padding: 10px 0;
    background: #fcf4d8;
    text-align: center;
    margin: 0 0 10px;
}

.yt-alert-naked.yt-alert.zero-step-tooltip {
    margin-top: 0;
    margin-bottom: 18px;
}

.branded-page-box, .branded-page-box-padding {
    padding: 15px;
}

#watch-discussion h1, #watch-discussion h2 {
	font-weight: normal;
}

#watch-discussion strong, #watch-discussion b {
	font-weight: 500;
}

 .comment-renderer-reply {
    color: #555;
    opacity: .75;
}

 .yt-uix-button-link {
    padding: 0;
    border: none;
    height: auto;
    background: transparent;
    color: #167ac6;
    font-weight: normal;
    font-size: inherit;
    text-decoration: none;
    box-shadow: none;
}

.comment-renderer-action-menu {
    position: absolute;
    right: 0;
    top: 0;
}
#watch-discussion .yt-uix-button-action-menu .yt-uix-button-arrow {
    display: none;
}
#watch-discussion .yt-uix-button-action-menu::before, .yt-uix-button-lockup-action-menu::before {
    opacity: .8;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) -86px -329px;
        background-size: auto;
    background-size: auto;
    width: 13px;
    height: 13px;
}
#watch-discussion .yt-uix-button-action-menu, .yt-uix-button-action-menu:focus:hover, .yt-uix-button-lockup-action-menu, .yt-uix-button-lockup-action-menu:focus:hover {
    box-shadow: none;
}
#browse-items-primary .item-section > li > .yt-lockup-tile .yt-uix-menu-top-level-button, .yt-section-hover-container .yt-uix-button-action-menu, .yt-section-hover-container .yt-uix-menu-top-level-button {
    opacity: .5;
    filter: alpha(opacity=50);
}
#browse-items-primary .item-section>li>.yt-lockup-tile:hover .yt-uix-menu-top-level-button,
.yt-section-hover-container .yt-uix-button-action-menu.yt-uix-button-active,
.yt-section-hover-container .yt-uix-menu-top-level-flow-button,
.yt-section-hover-container:hover .yt-uix-button-action-menu,
.yt-section-hover-container:hover .yt-uix-menu-top-level-button,
.yt-lockup .yt-uix-button-action-menu.yt-uix-button-active,
.yt-lockup:hover .yt-uix-button-action-menu,
.yt-uix-menu-trigger.yt-uix-menu-trigger-selected .yt-uix-button-action-menu,
.yt-uix-button-action-menu:focus,
.yt-lockup .yt-uix-button-lockup-action-menu.yt-uix-button-active,
.yt-lockup:hover .yt-uix-button-lockup-action-menu,
.yt-uix-button-lockup-action-menu:focus,
.yt-uix-menu-trigger.yt-uix-menu-trigger-selected .yt-uix-button-lockup-action-menu,
.video-list-item:hover .related-item-action-menu .yt-uix-button {
 opacity:1;
 filter:alpha(opacity=100)
}

ytd-comments {
    display: none !important;
}

.yt-uix-creator-heart-button {
    padding: 0 7px 6px 0;
}

.creator-heart-big-unhearted:hover, .creator-heart-small-hearted:hover, .yt-uix-creator-heart-button, .yt-uix-creator-heart-button:hover {
    box-shadow: none;
    cursor: pointer;
}

.yt-uix-creator-heart-button {
    padding: 0 7px 6px 0;
}

.creator-heart {
    position: relative;
    width: 16px;
    height: 16px;
    border: 2px;
}

.creator-heart-background-hearted {
    width: 16px;
    height: 16px;
    padding: 0;
    position: relative;
}

.creator-heart-big-hearted {
    display: none;
}

.creator-heart-small-hearted {
    position: absolute;
    right: -7px;
    bottom: -4px;
}

.creator-heart-small-container {
    position: relative;
    width: 13px;
    height: 13px;
}

.creator-heart-small-left {
    position: absolute;
    right: 0;
    bottom: 1px;
    width: 6px;
    height: 10px;
    -webkit-border-radius: 6px 6px 0 0;
    -moz-border-radius: 6px 6px 0 0;
    border-radius: 6px 6px 0 0;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 0 100%;
    -moz-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    -o-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

.creator-heart-small-right {
    position: absolute;
    right: 6px;
    bottom: 1px;
    width: 6px;
    height: 10px;
    -webkit-border-radius: 6px 6px 0 0;
    -moz-border-radius: 6px 6px 0 0;
    border-radius: 6px 6px 0 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform-origin: 100% 100%;
    -moz-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    -o-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
}
.comment-section-renderer-paginator {
    margin: 15px 25px !important;
    border: 1px solid #d3d3d3 !important;
    padding: 10px 0 !important;
    cursor: pointer !important;
    font-weight: 500 !important;
    text-align: center !important;
    background-color: #f8f8f8 !important;
    color: #333 !important;
    font-size: 12px !important;
    outline: 0 !important;
    height: 100% !important;
    width: 95% !important;
    background-image: -moz-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%) !important;
    background-image: -ms-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%) !important;
    background-image: -o-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%) !important;
    background-image: -webkit-linear-gradient(bottom,#fcfcfc 0,#f8f8f8 100%) !important;
    background-image: linear-gradient(to top,#fcfcfc 0,#f8f8f8 100%) !important;
}
.comment-section-renderer-paginator:hover {
    background-color: #f0f0f0 !important;
    border-color: #c6c6c6 !important;
    text-decoration: none !important;
    background-image: -moz-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%) !important;
    background-image: -ms-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%) !important;
    background-image: -o-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%) !important;
    background-image: -webkit-linear-gradient(bottom,#f0f0f0 0,#f8f8f8 100%) !important;
    background-image: linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%) !important;
}
.yt-uix-button-default:active, .yt-uix-button-default.yt-uix-button-toggled, .yt-uix-button-default.yt-uix-button-active, .yt-uix-button-default.yt-uix-button-active:focus, .yt-uix-button-text:active {
    border-color: #c6c6c6 !important;
    background: #e9e9e9 !important;
    box-shadow: inset 0 1px 0 #ddd !important;
}
.yt-uix-button-default, .yt-uix-button-default[disabled], .yt-uix-button-default[disabled]:hover, .yt-uix-button-default[disabled]:active, .yt-uix-button-default[disabled]:focus {
    border-color: #d3d3d3;
    background: #f8f8f8;
    color: #333;
}
.yt-uix-button[disabled], .yt-uix-button[disabled]:hover, .yt-uix-button[disabled]:active, .yt-uix-button[disabled]:focus {
    opacity: .5 !important;
    filter: alpha(opacity=50) !important;
    cursor: auto !important;
    box-shadow: none !important;
}`);
	
}

window.addEventListener("yt-page-data-updated", function(event){console.log("Event yt-page-data-updated");mainloader();});