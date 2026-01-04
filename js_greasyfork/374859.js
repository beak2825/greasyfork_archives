// ==UserScript==
// @name           Gmail Mobile Enhancer
// @description    A few enhancement on the Gmail mobile site to use it as desktop.
// @version        1.27
// @date           2024-03-21
// @author         Cqoicebordel
// @namespace      http://www.cqoicebordel.net/gmail-mobile-enhancer
// @include        http://mail.google.com/mail/mu/*
// @include        https://mail.google.com/mail/mu/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374859/Gmail%20Mobile%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/374859/Gmail%20Mobile%20Enhancer.meta.js
// ==/UserScript==

(function (){

	/***************************************
	*           SETTINGS                  *
	***************************************/

	// How often to attempt to update the favicon. In ms.
	var pollDurationMS = 1000;

	// How often to force an update of the current folder in minutes. 0 to deactivate.
	var forceUpdate = 5;

	// Go and read the comments on InitStaticMenu to know how to fill those variables.
	var textsUsual = [];

	var textsLabels = [];
	var commandsLabels = [];
	var colors = [];


	/***************************************
	*      STRINGS TO TRANSLATE           *
	***************************************/

	// Text that appears on hover on the new mail button
	var titleTextNewMailButton = "Ctrl+click to open in a new tab";
	// Text that appears on hover on the Open in a new tab button
	var titleTextOpenInNewTabButton = "Open current thread in a new tab, in the classic Gmail interface";
	// Text that appears on the previous mail button ('<')
	var titleTextMoreRecentMailButton = "Fresher mail";
	// Text that appears on the next mail button ('>')
	var titleTextOlderMailButton = "Older mail";



	/***************************************
	*           STYLES                    *
	***************************************/

	var css = [
	// Translate the buttons to avoid occulting other buttons
		".Dh{padding: 0 6px !important;min-height: 0 !important;}",
	// Dark mode
		"body{filter: invert(85%);}",
	// Protect from dark mode
		"div[role='listitem'] > div > div > span[style],", // Labels // div[role="listitem"] > div > div > span[style]
		"div[data-onclick-arg] > div[style],", // Patch of colors in menu of labels // div[data-onclick-arg] > div[style]
		".messageCount,",
		"#tltbt > div:nth-child(4n) > div,", // New mail button // Last of #tltbt > div:nth-child(4n) > div
		"#cv_ div[role='presentation'],", // Avatar of correspondant in mail view //
        "#cv_ div span div span[style],",
        "div[role=listitem] > div > div[aria-label='Activer le suivi'] > div,", // Star in list view // div[role=listitem] > div > div[aria-label="Activer le suivi"] > div (before last)
		"#views > div > div:nth-child(1) > div:nth-child(5),", // Submenu of the toolbar in mail view // #views > div > div:nth-child(1) > div:nth-child(5)
        "#views > div > div:nth-child(1) > div:not([tabindex]):has(div > div > div[data-onclick-arg] > div),", // Same as above for spams
        ".pi,", // Warning message in a spams // div[id^=cvcfullmsg] > :nth-child(3)
		".realarrows,",
		"#cvcstar,", // Star in mail view
		".labels,",
		"img{filter: invert(100%) !important;}",
	// Reduce height of the empty bar at the top
		"#gba{height: 40px !important;}",
	// Second bar of the UI can go over the buttons
		".Bc{left: 200px !important;padding-right: 200px !important;}",
	// Change background if the page doesn't go all the way down
		"html{background-color: #262626 !important;}",
	// Enhance the unreads // div[role=listitem]
		".Yk .nk, .Yk .ok, .Yk .pk  {font-style: italic !important;font-weight: bold !important;}",
	// Enhance the reads //div.Xf.Sk > div.Kk - div.Xf.Mk > div.Lk
//		".Mk .jk{color: #DDD;filter: invert(1);}",
    // Reinvert to have the emoji in from, subject, and snippet
        ".Yk .nk b {color: #F9F9F9;filter: invert(1);}", // From
        ".Yk .ok span {filter: invert(1);color: #FFF;}", // Subject
        ".Yk .pk {filter: invert(1);color: #888;}", // Snippet
        ".Sk .ok {color:#CCC; filter:invert(1);}", // Read from
        ".Sk .pk span, .Sk .pk {filter:invert(1)}", // Read subject and snippet
    // Message indicator
        "div[role=listitem]  span > span {color: #888;}", // div[role=listitem]  span > span // Selector OK
        "div[role=listitem] > div:nth-child(1) {z-index:10;}", // Full mail // div[role=listitem] > div:nth-child(1)
    // Bold date of unread mail
		".Yk .Ei {font-weight: bold !important}",
	// Margins of arrows
		".arrows{margin: 1px 6px; width: 20px; height: 20px; vertical-align: text-top; }",
        ".messageCount{width:auto; margin-top:2px;}",
		".arrowleft{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAAKklEQVR4AWMY9uA/7/8d/y2JUXbs////NcQpa6aTMkyFA6u0hvgAH74AALYNOnGv1Wh5AAAAAElFTkSuQmCC)}",
		".arrowright{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAAK0lEQVR4AWMYxuC/5f8d/3mJUVjz////Y8QpbR5ApQiFdFSGCB5iA3y4AwCbRTpxjexg8AAAAABJRU5ErkJggg==)}",
		//".pi{color:#007b35cc !important;}",
	// Give space for the left vertical menu //#tl_ #menu + div // Selector OK, use second class
		"#tl_ #menu + div {margin-left: 42px;}",
	// Position the menu
		"#menu{float:left; width:42px;}",
	// Use img for usual buttons
		".usual{height:24px;padding: 9px;}",
	// Use colors for the labels
		".labels{height:15px;width:24px;margin:15px 9px; border-radius:3px}",
	// Bigger help background
//		".Dw{min-height: 700px;}",
	// Allow full text of labels stickers // div[role=listitem] > div[aria-hidden=true] > div > span // Selector OK
		"div[role=listitem] > div[aria-hidden=true] > div > span{max-width:none !important;}",
	// Reduce the header height
//		".gb_mg>.gb_R, .gb_eg>.gb_R,.gb_eg{line-height:38px !important;height:40px !important;}",
//		".gb_mg{height:40px !important;}",
		"div:has(> div > #cvcstar) {padding-top:10px !important;}", // Title of mail in mail view
		"div:has( > #cvcstar) {margin-top: 0px !important;}", // Star, first child of above
		"div:has( > #cvcstar) + div {margin-top: -10px !important;}", // Second child of above above
	// Subject line when in mail view
		"span[role=heading]>span {font-size:20px !important;font-weight: bold !important;user-select: text !important;color: #DDD;filter: invert(1);}",
	// Add external link to open mail in Gmail classic
		".external{-webkit-background-size: 24px 24px !important; background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURQAAAGBgYGFhYWNjY2FhYWBgYGFhYfUIR/gAAAAGdFJOUwA9rhncf2Rja9EAAADkSURBVEjH1ZVJEoUgDAXJgPc/8scBJSED7r5vY5V2Q0IhlPK9gEiKE28iTNn4mwq8nKELgGwEDOMQQA8zflQGWHXK6aUB1wuuRqw+mlDbo4adoxSajyFfZUmULW5Vfe0t0zKfC51HXhNuvq9VIjx8X91YGPnLCAXJnwYFguabAVR8YeafX4Re8J7g8o7g87YQ8KYQ8ZageNwYQgHU+Gr/z8K1ze56UuE0nvpzYTeGfheEQuOpsCKI/L+QnkuggbbonB2U085BtyjC+eg9dgI6sS424i0MgzmtG7Ncql5JNb+av5cfhQIO95cXPYkAAAAASUVORK5CYII=);}"
	].join("\n");

	/***************************************
	*          INTERNAL VARS              *
	***************************************/

	// List of icons for the static menu
	// Inbox, Important, My Circles, Starred, Sent, Draft, All, Trash, Spam
	var icons = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAWklEQVR4Ad3TtQGAMBBA0axBBkL3uZXDCPinwt3ld5HX3anXRkDIXAavCwxLmS7IyNRMAN2L/H2g+AHgBtBk1beaujkg9a2sAzGCRiPEy2Cmg+PtLy6Qo95aCTc+VSvrTsHRAAAAAElFTkSuQmCC',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAd0lEQVR4AWMYweC/3v9v//8C4T8whIEf/5f958SlpfI/djAdlwam/0dwaPHFpUXp/2esGl79l8ClJQWHHTv+M+LSsgmHlnxcGsSADkAGiPDShahgIjbcKXISYU9v/89ISbASjjgKkwYi8f0BQtQE+B2Y+DgYRgEADJdOa/NoTNkAAAAASUVORK5CYII=',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMACJsR2vNuKbtMUzQX/gAAAMdJREFUeAFtkgcWwzAIQx1ANuj+B655kbt/m8RTT4zxxrIAwmp84kYR6+N4kLA5rb9vlzxI86uZIF53jJyXWGAMscd2PZlkHT9kWvklgnb7AdngqBlDfsjI/qRLC/KTTPdKMs+G/BjDNz0+Uovtp8jyTRJbzEEbdobpmz7QF7hG0GTdfNPTHo8BRZxkVmulkeGvDU95VnolpeQ1hPmdvbiElyVpymzd1oW9ZTz2WMvyIxZO8lx+DgUyuqj4U25hPj6pu3Hejz8AHm4IoaGa7oEAAAAASUVORK5CYII=',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAyklEQVQ4Ec3BsS4DARgA4P+SPsBZeADSkU6dvEDHDox04xE68AAdm3RiY+Qx2DrzAj3C2umSSz4u1YTTqzPxffFXdHXjN1y7iuZsyeU2oynnSmfRjJaZ0kwrmnBo6SDWkWrb1ze1NNW3ry2NrwxlcuvkMsNYkhj5yUgSnzlVqFM4ie/0zK0y14vVdGSqMp2o51bVTazjWdVT1LNjle2o49hCYWyssHAUdVwq3dmNd/bcK11EHY9eDCTxQWLg1UOsJjWRRoUNE2n8Z2/nTE57cbWqEAAAAABJRU5ErkJggg==',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAtElEQVR4AdWSKZRBARhGZ+/T3tSZXmajH3qxL5WeiE+jJ6qdnqh2eqKSqPZrX9/euP2ec///fA83CjX8vBkRFsCACB96hSU7pmQwGxF2NDUDkbIJFIwIu8A0Zk1BQgOfJJB3frATIk6JLjOjgS98YiFAlAJthmeBJiXhCytBYhTpMGLHhBT/p6RfHIRJUKYnk9RHRNB/tFd6tBy7CPlq0IqQTEPz81JB+jrteYv6513dRdwpK17LZ8s419tpAAAAAElFTkSuQmCC',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAT0lEQVR4Ae3LsRVAUBBFwS1FNdCVUkW2CLhCWOdFAH/ysetQ4GzVKrRsNbLQh5DJwsCGGbHosF9kiEWHRYlhRHpFIIUzgqN4DJUoTmGXmQCfL0D8bQexOAAAAABJRU5ErkJggg==',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAmklEQVR4Ad2StwHCMBAACa3ZwCyBh3CJJyEsQpgEDwJDENVD6XD8N86x1TlK+vw/sQV8DH0Y/FzhwxBMrhADAU/aeLAGyBUSXeBwIqZKzBFHTqsKhLjy53GjyJWV7C4J6wrwY8dcrp38KV+2umav67JCWrDoydol5FL32KQAMScc3WXBmRj6FJQnQa1qJYV+LFQwDMGMH29L+AOkk1IhVvZs/wAAAABJRU5ErkJggg==',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAANklEQVR4AWMYAuC/wv8H/6EAyFLApxQPoFwDYUCSHSRrGNUwquE5VvXPcWtwx9QCFHEf5HkeADQnkqwevxl8AAAAAElFTkSuQmCC',
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAW0lEQVR4AdXTtxGAQAwFUWxp138TqkGpTITfUSg+GbMvgbup/WyY2nlqo5ADgfxCIAdCeb5DkjmBJFdgDHK/ATAGYsJAb/kez5Uo/bgrKP1r4bx++JhgDheo+xw1vwnfRDBVBgAAAABJRU5ErkJggg=='
					];


	// Var to identify class or id. Google can change them often, so putting them here is helpful
	// <div class="Og" data-onclick="j">Réception<span class="Yl">6</span></div> // #tltbt > div > div > div > span
	var numberOfUnreadSpan_class = "zk";
	// <div class="Tk ec" tabindex="0" role="menuitem" onclick="_e(event, 'Wb','^i')"><div class="bl undefined"></div><div class="Nk"></div><span>Réception</span></div> .Uk
	var listOfUsualInMenu_class = "#mn_ > div > div > div > div[role='menuitem']";
	// <div class="Uk gl "><div onclick="_e(event, 'Xb','label1')" class="fl">
	var listOfLabelsInMenu_class = "uj";
	// <div class="wj " style="background:#FFC8AF;color:#7A2E0B">&nbsp;</div>
	var ListOfLabelsPatchOfColorInMenu_class = "Bj";
	// <div class="Pg Vp" onclick="_e(event, 'Wb','label2')"><div class="Pk"></div><span>Label 2</span></div>// Vp
	var ListOfLabelsActionTextInMenu_class = "nj";
	// <div id="tl_" class=" Wg  " style="">
	var mainTimeline_id = "tl_";
	// <div class="Yg" style="bottom: 0px;"><div id="menu">
	var parentOfTheMenu_class = "#tl_ > div:nth-child(1)";
	// <div class="M j T b hc Pm  Ke" onclick="_e(event, 'wa')" role="button" aria-label="Nouveau message" tabindex="0"><div class="V j od"></div></div>
	var newMailButton_class = "#tltbt > div > [aria-label='Nouveau message']";
	// <div class="us Jm" style="">
	var mailToolboxBar_class = "#views > div > div:has(div[aria-label='Archiver'])";
	// <div class="kc">
	var backButtonsInMailView_class = "#cv__cntbt > div.Ol, #cv__cntbb > div.Ol";
	// <div class="jm" role="list"> .km
	var mainListOfMail_class = "#tl_ > div > div > div[role='list']";
	// <div class="fc Im Vm Rc qc Sc" id="tltbt" style="width: 100%;">
	var secondLineUI_id = "tltbt";
    // Menu in mail view, first classes // div[role=button][data-onclick-arg="1"]
    var firstClassesOfButtonsMenu_class = "Ml d Aq ff tm Il ql";
    // First two of above
    var arrowsPosition_class = "Ml d";
    // Menu in mail, classes of buttons // div[role=button][data-onclick-arg="1"] > div
    var secondClassesOfButtonsMenu_class = "ol d a";


	/*
	* Apply the style defined in var 'css'
	*/
	function ApplyStyle(){
		if (typeof GM_addStyle != "undefined")
		{
			GM_addStyle(css);
		}
		else if (typeof PRO_addStyle != "undefined")
		{
			PRO_addStyle(css);
		}
		else if (typeof addStyle != "undefined")
		{
			addStyle(css);
		}
		else
		{
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			var heads = document.getElementsByTagName("head");
			if (heads.length > 0)
			{
				heads[0].appendChild(node);
			}
			else
			{
				document.documentElement.appendChild(node);
			}
		}
	}

	/**
	* Change the favicon based on the unread number. Dependant on the folder selected.
	*/
	function GmailFavIconUnreadCount(){

		this.poll_ = function() {
			self.checkCount_();
		}

		this.setIcon_ = function(icon) {
			var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = icon;
			document.getElementsByTagName('head')[0].appendChild(link);
		}

		// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20+, 30+, 40+, 50+, 60+, 70+, 80+, 90+, 100+
		this.icons_ = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADlQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru784+P+aen/eHh/7a2/9vb/+Li//X1////A7qkQAAAAAR0Uk5TAB2AqETj5SgAAABvSURBVBjTlc7BDsMgDANQWpJRKKGQ///YOsnYfZZ88FOQSMxc+zcVI6E81DM4oJaQwaU6aIhtDXDxvWFAsMeG2SHlfmTp9QHMPvHqVl2y2gWw7SGi1uxib9yQQfxShARtaSdnytY/4MQi2A8OCHK+Pf4IFQW768kAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADxQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru784+P+aen/NPT/eHh/7a2/76+/+Li//X1////iGnB/wAAAAR0Uk5TAB2AqETj5SgAAABzSURBVBjTXc7rDsMgCIZhV6SOzcKU+7/XcZhr2i/xx/uEJi2ISP03sij2UDQmmEAtRbBRgKZ4a0JI9AIxsZYFo5s0+hxTd4fRh331Vp08nw7eucqvuFhZ6wzIvzyYOS7WHhtABSh32P5g7XCeWPrgcuH7AmEZCEEDjz9TAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADxQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru784+P+aen/NPT/eHh/7a2/9vb/+Li//X1////niQ0sQAAAAR0Uk5TAB2AqETj5SgAAAB0SURBVBjTVc7RDoMgDIVhtXQIMjro+7/rTltZ3Em4+L/UxI2ZS7tXEBsei/qEA0oOEc7FQUOsNcDFe4FA0LJgNEi+Pn3q+QKMNvDVpTr7rCfA2pdSqtUuVuMmGcRfvrsNsLYfRJSI/gB9/CD6cYG20fPC9wVtwQhh+k67lAAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADxQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru784+P+aen/NPT/eHh/7a2/9vb/+Li//X1////niQ0sQAAAAR0Uk5TAB2AqETj5SgAAAB1SURBVBjTVc7bDsMgDAPQtiSjUEYK+f9/nZOMXSzx4KNYYmPm0t4pKBsei3qEA0oOEc7FQUOsa4CL9wUCQZcFo0Hydfep5wMw2sDqUp191hNg3UNEtdrF6rghg/jls1sAK/uRElFKH0BH6AtW/sAXv5M9NscLbqwIYVFjjHUAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADxQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru7+aen+rGx/NPT/eHh/7a2/+Li//Hx//X1////ywS18AAAAAR0Uk5TAB2AqETj5SgAAABwSURBVBjTXc5RDoQgDARQBaoCStHe/65OW8muTuBjXoaEiYhyfZJRJlxisTA55NWFac0G4qJdHEysD2AIOg/oFYK+n7ItgF47XmF/tqtsAO2eK5Wii9ElOfgvj9ZSUxiJMdn5B80PQozvxRw+8IzCDWFJCES6cQruAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADlQTFRFAAAA////////////AAAA2jg46Vpa621t7Zyc8oGB8ru7+aen+cDA/eHh/7a2/+Li/+bm//X1////WbimYAAAAAR0Uk5TAB2AqETj5SgAAABuSURBVBjTdcxRDoAgDANQFKYCMmT3P6zdJjExsQkffekIRJTrk4wS8IjFwuSQNxemLRuIi3ZxMLE+gSHoPKFXyH5ebUg5AL12XJ0io41SANo1SaPwdEnY+MLSmg1KmFmjJsV/0PJd4I/4wuI36w0dogfYr55plgAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADlQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru7+aen/NPT/eHh/7a2/76+/+Li//X1////sOvBUgAAAAR0Uk5TAB2AqETj5SgAAABwSURBVBjTdcvBDsQgCATQtshadLHK/39sR6ibXnYSDvMybMws9YmgbDhu5mkcIDmkcRYHC5ndAly8L2gQ9LagV0iW6zvs/AB67fjCfugoJ2D2SEqlzMWv27PwqCZVBawQJYToDTTvPxz+83rZIchxAzkqCBdUsJhUAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAD9QTFRFAAAA////////////AAAA2jg46Vpa621t7Zyc8oGB8ru7+aen+cDA+rGx/NPT/eHh/7a2/+Li/+bm//X1////1mm31AAAAAR0Uk5TAB2AqETj5SgAAAB0SURBVBjTXc7rCsMgDIZhNaab2i1x5v6vdTm0CP2gP96HCE2I2Ma1ppH0QxYfY0A7QhiP5iAh1hLg4n0Dq2jzDXOovM4fLelvhTmmvjpFFq3eFaxt1WZwtW05xF9+vkRU9cleAagAu7N3eR7kDc8Du4CS0x+CaghoVGlZcwAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADlQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru784+P+aen/eHh/7a2/9vb/+Li//X1////A7qkQAAAAAR0Uk5TAB2AqETj5SgAAABzSURBVBjTdc7BDgMhCARQd4G6umqV///YDrD20nQSDvMCCUlESntSUBJGhnqGBJQcMiQXBw2xrgEu3jcMCPrYMBsk3+++9HoBZpu4ulVXX/UCWPcwc622sTt22CC+7J07pqadkwgnRF9AJ5v/8HNyQJDzAz36CBWzs54UAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAADlQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru784+P+aen/eHh/7a2/9vb/+Li//X1////A7qkQAAAAAR0Uk5TAB2AqETj5SgAAAB2SURBVBgZBcFBbsMwEAQw7mjlwJf+/53pQSiiWCVr0gPw3TT2bLD/MIb2GcFeGY9wJ2uzV3IT3MnaeyU3GubHkkwInmcm6esco5pnd3rlJbujplcHeHNpOsD7x/m9mg2KDxRASuEMAAolAAfqaAClHGcAqMI5/2U6KEhkmrZpAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru784+P9K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl//X1////3cSV3gAAAAR0Uk5TAB2AqETj5SgAAAB7SURBVBjTbc3RDsIwCAVQbMG5Vp0b3YT//1GBrj4Yb0LoPWkCEFF5nilWwIaaRhp1KFOXRlMJ0C7etUNI9AHNxHobcLz29XG77yw6Xw3em6iui6qw1NnAO/oZRKzVQPylgYIOGzPjmAoAl5Qz5jH/IOUfsOWJlcePb9IHpEEKbtni4moAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru79K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li/+Xl//X1////iXkzlQAAAAR0Uk5TAB2AqETj5SgAAAB8SURBVBjTXc2NCsIwDATguCbOxb8tndq8/4t6STsEAzvuPgYlEdH7OMUgfFI9r0oHnbtUmTXBu8T2Dim5D6gQ7HrA+/labxfdt+bngA+Krw/3Zm0JiM35Lts1oDlzALIlbGbGZpkAotNUCpfSk/5hAqBFHQlAiRs5/vjdF34VCir9YSU3AAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru784+P9K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl//X1////3cSV3gAAAAR0Uk5TAB2AqETj5SgAAAB+SURBVBjTVc2NDsMgCARgO2FddX8ttoP3f9EdaLPsEtH7NDExc3mOFJSExc0ijTuUuUvjuQRYF+/WIST6CQ2C3k443vv6uN13UVuugM+mZuvLTEXrAvBO/g0R1QpQP1mgksMmIiQ9gJSmS86UM6Zvf+ATMK7GAODkGXO8+OULqGMKevNsaKsAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru784+P9K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl//X1////3cSV3gAAAAR0Uk5TAB2AqETj5SgAAACBSURBVBjTTc2LDoIwDAXQubYim4rQoe3//6h9QPQme9yTLitE1J5HmpVii4ZGBiW0KWXQ1AI0xbsmhEQ/YZhYHye8X/v6uN13Fp2vBp9NVNdFVVj6bOAd/RtE7N1A/KaBgg4bMyNnDEq5VAAE8N2OH0TQoUICnuCj6NN4PKnwl/oFqREKe5fG/nkAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru79K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl//Hx//X1////aMENQwAAAAR0Uk5TAB2AqETj5SgAAAB/SURBVBjTTc2LDsMgCAVQJ7Cuuq2trK38/4+OR11GxHgPJCYiKq+rioakTSxeTAFlCmGaioOEWJYAF88DWEUzD9iXz/p8FF5Ome8Kx9ZF1rfI2XqdFSyj/9uxVoUuiAEYsLXWsPllkNItAyB46/kHK4McU4CxMWY/yDGFbI/8BY/dClAbb42OAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEtQTFRFAAAA////////////AAAA2jg46Vpa621t7Zyc8oGB8ru79K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl/+bm//X1////YZEF6gAAAAR0Uk5TAB2AqETj5SgAAAB6SURBVBjTbc3rDsIwCAVgLDBtdc52U3j/J5XL6i9PQuj5QlJg5vo4U62ADQ+NDE6oS8rgpQZoindNCIk+YZhYHxOO577dr+uni7abwfslqtuqKl1aM/BO9gt5HMSfGnhe9N7Jxw8aAFwKImGG8B8UTKAJtjyxcF78Ur4p9wmmuY1tjgAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru79K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li/+Xl//X1////iXkzlQAAAAR0Uk5TAB2AqETj5SgAAAB8SURBVBjTXc2JDgMhCARQK9Dtao+t9JD//9HOgjZNSSYyLyQmESmXMQUlIaLmoxJQlhCVpThYyN4twMX7BIWg64TX7bmdT+Vx77YeAW8stl3Neut1Beyd/V/mWgEdiwPbuGit8QggpUMmYkIwRL/gAWT6gzhmf2hefCd/AJbWCmYF7ke4AAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEtQTFRFAAAA////////////AAAA2jg46Vpa621t7Zyc8oGB8ru79K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl/+bm//X1////YZEF6gAAAAR0Uk5TAB2AqETj5SgAAACASURBVBjTPc4LEoMgDARQEGILrdXQT3L/k3aToDsDZN/gSCKi9pxpKAmLhnoGBbQ1ZNDaHDTEuga4eD9hQNDHCZ/Xe3/cth+L9jvge4jqvqkKS+8A6xV/qRYDsTFeIg4HM1dmP/BJSnkppZaS5nHB3AGYbIw9AzBYrgt+Y2bJ6Q861AnG/33dHwAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru784+P9K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl//X1////3cSV3gAAAAR0Uk5TAB2AqETj5SgAAACASURBVBjTXc2BDsIwCATQWsC5Vp0b3YT//1GBrsZ4Ccnu5ZYmIirPM8VKsqOmkUYdytSl0VQCtIt37RASfUAzsd4GHK99fdzuO4vOV4P3JqrroiosdTbwjv4MItZqIP6lgYIOGzPjuJpSumQABIsNAX6gn0GGP4itr8cvvvgmfwCkiQpvjd762AAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAE5QTFRFAAAA////////////AAAA2jg43k9P6Vpa621t7Zyc8oGB8ru784+P9K2t+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li/+Xl//X1////3cSV3gAAAAR0Uk5TAB2AqETj5SgAAACCSURBVBjTRc2BDsIgDARQBq1zoM4Npu3//6jXArFJU+7lEgIz59eYjBCw3NSncYe8dmm8ZgftYlk7uHie0CDIbcLnfR3P++OqotsN8D1F9dhVpUrZAJbJviGiUgBiL3UUMjhrrTS3hBCWmBIlDIqU/hDdDGIaDT+A3iU76I3GnLj8AKQMCmlkxpH7AAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEhQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li//Hx//X1////tdc8awAAAAN0Uk5THYCoDQZHbAAAAIFJREFUGNNNjYsSwyAIBBFolLRNtA/5/z8tnmnTExl3xZFUtVyPlACKrc2RplOUZZqmS4HwaQb7FDDgr2hhghtENu/747au2/P+GsKs1+6+be7vvecLmYjEF+i9Wiax7uJwUWbxpFaJNXodgpkFxYLQAT9POP8LzGF+XHAiPpNS8AfHKgkHOzqm/AAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEhQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li//Hx//X1////tdc8awAAAAN0Uk5THYCoDQZHbAAAAIJJREFUGNNdzdsSAiEIBmBWaJWtXOwA7/+mcaibUHH+b3AEIhrXbw0P4IeWZS0qGHvJon0kWElkK0jJ/IPl4nkldDY9H7fjmM/7K4BZRc3mNHuf2i/AiOhfZFfhDshqaGm+mf2JCPqKLgGtIfppcUc5REzIDfgPMVnzMds2qKv65vkDx2AJBrWyYeUAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEtQTFRFAAAA////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li//Hx//X1////+DOqhAAAAAR0Uk5TAB2AqETj5SgAAACCSURBVBjTTc0JDgMhCAVQKugo09bRLnL/k5alk5Yg+F9MhJxzu36raQA9eYrXzAFtC5l5aw4SYlkCXDyfMFU0z4Ai63jc9r0/7y+DUtdYIr2LvI9VC1QepF8Q6VyDKzDb1U2bGZgGDWtfCoQYjeQFPgO8AX8v/sHeo1UCSLYiJEyXD0glCfR84sSZAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEVQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li//Hx//X1////vqZVfAAAAAN0Uk5THYCoDQZHbAAAAHpJREFUGNNdio0SwjAIg9nArUytdNq8/6PKj955poRePkIi0q4fNQ/kloHUkAJtKzJkawlQJDIKJMn8BcOJ55FAFdPO23H08/4sMG0CvQOvx9wvxCEg1zTdidXv4DKrZsPMJxxgdbE/36lfkEP8D6JZ/eiuC9VXe/H8BposCLjbZAgSAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEhQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li//Hx//X1////tdc8awAAAAN0Uk5THYCoDQZHbAAAAH5JREFUGNNljVESwyAIBQmQKGlrtEnh/jctQvrVN/B0d8YRmLk+7lQH8OVhkcEp6pZm8FZDWJrJliJM8E8MN84jxFpMj/dz39v5uqYool3NWjP7HFpWECHyL2i2dikgpJNzSQRIuodyQ3gQfZAiENcUMf8C48ndiAvkkb04fwHTGQkkXBGw5AAAAABJRU5ErkJggg==',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEVQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/9vb/+Li//Hx//X1////vqZVfAAAAAN0Uk5THYCoDQZHbAAAAHxJREFUGNN1jFsWgyAMRCFJFbRFsGX2v1Tz0M8OCTn3nkASkbLfKQpJWwY8Q0KUJcyQpbhAGGOEcOP8iKFGebioFbOf721r5+cbYvYJtAb8jrm+ElsAv2avq22A9cCaa1XRuVv5UJGJ2Iv8Macb6PH/hO3boGx/UM4BWfkCnVwIvuM4obkAAAAASUVORK5CYII=',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEhQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li//Hx//X1////tdc8awAAAAN0Uk5THYCoDQZHbAAAAIBJREFUGNNlzVsSgzAIBVAMVINtY9IH7H+nvQH7JRLknokjiUi9n1URCEeGRw1JqGvKkLUGeMrMnhAS+Q8DgjwCNnU7Xo99b+/nZ4KqdXNvzf172HYjZWb8IqZ13YjVnD0MrQronfHM2ScUXC4FPRcUxZoQfYX85JylLJSvnAvyD8WYCQKDIN3CAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA4LzI0LzA5pv4QvgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wOC0yNFQxNjozMToxMFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOC0yNFQxNjo0MjowNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgh0HbBAAAAEhQTFRF////////////AAAA2jg43k9P6Vpa7Zyc8oGB8ru798fH+aen+cDA+rGx+9TU/NPT/eHh/7a2/76+/9vb/+Li//Hx//X1////tdc8awAAAAN0Uk5THYCoDQZHbAAAAINJREFUGNM9zQkSwyAIAEAEGiVtjfaA//+0CGkUOXZ0BGZu93M1H8APT4s1OaFtKZO3FmApa7aEkJj/MF18ngFVTI/XY9/7+/lZIKJDzXo3+x5abyBE5F9E1iEVSNTIwjxEHMYg3yuPBeiXCQkxGiLA1SZEwNVdQIR5fxUs8aQUPEuBH8VKCP/ACovVAAAAAElFTkSuQmCC',
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAVdEVYdENyZWF0aW9uIFRpbWUAOC8yNC8wOab+EL4AAAQRdEVYdFhNTDpjb20uYWRvYmUueG1wADw/eHBhY2tldCBiZWdpbj0iICAgIiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMS1jMDM0IDQ2LjI3Mjk3NiwgU2F0IEphbiAyNyAyMDA3IDIyOjExOjQxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4YXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8eGFwOkNyZWF0b3JUb29sPkFkb2JlIEZpcmV3b3JrcyBDUzM8L3hhcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhhcDpDcmVhdGVEYXRlPjIwMDktMDgtMjRUMTY6MzE6MTBaPC94YXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhhcDpNb2RpZnlEYXRlPjIwMDktMDgtMjRUMTY6NDI6MDVaPC94YXA6TW9kaWZ5RGF0ZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIIdB2wQAAAF9SURBVDjLlZAxawJBEIW3OVJYWWsbbEzvb1EsJZY2KXKQHP6BdBYKsVThIKUKEtHqGsHGoKQRBYuE0+IOOTSRyb71dlnlFDLwmNmded/sHfvMZEjKK5dp12xeFWZ0D9MPELXbdDF473ye6du/stnLkNCMGf0VCoC4CDkzIyIBkZAI81UADDrkxKy9SgHcapW8bvd4u9nQ72xGNJ/TznHIbzQoGAxoPx4TTae073SIlstTgNfrEUTbLR0WC5Fl/EwmQip4T0Bclxa53BEwqtfpxjCUOZVKKQVBQPF4XMiyLAXBLJa6tRqxx3xeANAYDodUqVTEHAwwrtdrcQZQhmWahMWAiE+4TSYF9blUoo9+X9TIjDFRn/dQKwAHthKJhIdcKBQmjuPgV7eQAUAte7FYbIdZwzAOsj4B2Lb9bprmCDUyhlar1RvO6XT6W4fJRUxQ+CZkDCNL+b5vAwLBFAmQl/8RwGH9BMBLeEC+D7PUA9drKNR3XMVwvshfzv4AAvH5xhSlJ6sAAAAASUVORK5CYII='];

		this.checkCount_ = function() {
			var countspan = document.getElementsByClassName(numberOfUnreadSpan_class)[0];
			var count = countspan ? parseInt(countspan.innerText, 10) : 0;

			// Change the favicon only if the unread message count has
			// changed, or if the new chat status has changed.
			if (this.lastCount_ != count) {
				var index;
				if (count < 20){
					index = count; //0-19
				} else if (count < 100) {
					index = 18+Math.floor(count/10); //20-100
				} else {
					index = 28; //100+
				}

				var icon = this.icons_[index];
				this.setIcon_(icon);

				// Set the status/count, so we can compare next time.
				this.lastCount_ = count;
				ChangeTitle();
			}
		};

		// Needed to circumvent Greasemonkey problems with "this"-scoping.
		var self = this;
		this.lastCount_ = -1;

		// Checks every second for a change in the unread count.
		var timer = setInterval(this.poll_, pollDurationMS);
		this.poll_();

		return true;
	}

	/**
	* Create a statically build menu to the interface
	*/
	function CreateStaticMenu(){
		var divString = '<div id="menu">';

		for(var i=0; i<textsUsual.length; i++){
			divString += '<div class="menuitem usual usuC'+i+'"><img src="'+icons[i]+'" title="'+textsUsual[i]+'" /></div>';
		}

		for(var i=0; i<textsLabels.length; i++){
			divString += '<div class="menuitem labels labC'+i+'" title="'+textsLabels[i]+'" style="background-color:'+((colors[i]===undefined)?'#777777':colors[i])+'"></div>';
		}

		divString += '</div>';
		var div = document.createElement('div');
		div.innerHTML = divString;

		var parent = document.querySelector(parentOfTheMenu_class);
		var menuDiv = document.getElementById("menu");
		if(menuDiv != null){
			menuDiv.remove();
		}
		parent.prepend(div.firstChild);
	}

	/**
	* Go to the menu page and copy paste the code inside this function to be executed in the devtools. You'll have the text to copy for the settings
	*/
	function InitStaticMenu(){
		var TkList = document.querySelectorAll(listOfUsualInMenu_class);
		//var textsUsual = [];
		for(var i=0; i<TkList.length; i++){
			if(TkList[i].innerText.split("\n").length > 1){
				textsUsual[i] = TkList[i].innerText.split("\n")[1];
			}else{
				textsUsual[i] = TkList[i].innerText;
			}
		}

		var UkList = document.getElementsByClassName(listOfLabelsInMenu_class);
		//var textsLabels = [];
		//var colors = [];
		//var commandsLabels = [];
		for(var i=0; i<UkList.length; i++){
			if(UkList[i].innerText.trim().split("\n").length > 1){
				textsLabels[i] = UkList[i].innerText.trim().split("\n")[1];
			}else{
				textsLabels[i] = UkList[i].innerText.trim();
			}
			var blList = UkList[i].getElementsByClassName(ListOfLabelsPatchOfColorInMenu_class);
			if(blList.length > 0){
				colors[i] = blList[0].style.background;
			}
			var OgList = UkList[i].getElementsByClassName(ListOfLabelsActionTextInMenu_class);

			commandsLabels[i] = OgList[0].getAttribute('data-onclick-arg');
		}

		var stringTextUsual = 'var textsUsual = [';
		for(var i=0; i<textsUsual.length; i++){
			stringTextUsual += '"'+textsUsual[i]+'", ';
		}
		stringTextUsual = stringTextUsual.substring(0, stringTextUsual.length-2)+"];";
		console.log(stringTextUsual);

		var stringTextLabels = 'var textsLabels = [';
		for(var i=0; i<textsLabels.length; i++){
			stringTextLabels += '"'+textsLabels[i]+'", ';
		}
		stringTextLabels = stringTextLabels.substring(0, stringTextLabels.length-2)+"];";
		console.log(stringTextLabels);

		var stringColors = 'var colors = [';
		for(var i=0; i<colors.length; i++){
			stringColors += '"'+colors[i]+'", ';
		}
		if(colors.length>0){
			stringColors = stringColors.substring(0, stringColors.length-2)+"];";
		}else{
			stringColors = stringColors+"];";
		}
		console.log(stringColors);

		var stringCommandsLabels = 'var commandsLabels = [';
		for(var i=0; i<commandsLabels.length; i++){
			stringCommandsLabels += '"'+commandsLabels[i]+'", ';
		}
		stringCommandsLabels = stringCommandsLabels.substring(0, stringCommandsLabels.length-2)+"];";
		console.log(stringCommandsLabels);
	}


	/**
	* Create a dynamic menu with unread count. Doesn't work.
	*/
	function CreateMenu(){
		var TkList = document.querySelectorAll(listOfUsualInMenu_class);
		var textsUsual = [];
		var commandsUsual = [];
		var unreadUsual = [];
		for(var i=0; i<TkList.length; i++){
			if(TkList[i].innerText.split("\n").length > 1){
				unreadUsual[i] = TkList[i].innerText.split("\n")[0];
				textsUsual[i] = TkList[i].innerText.split("\n")[1];
			}else{
				unreadUsual[i] = "0";
				textsUsual[i] = TkList[i].innerText;
			}
			commandsUsual[i] = textsUsual[i];
		}

		var UkList = document.getElementsByClassName(listOfLabelsInMenu_class);
		var textsLabels = [];
		var colors = [];
		var commandsLabels = [];
		var unreadLabel = [];
		for(var i=0; i<UkList.length; i++){
			if(UkList[i].innerText.trim().split("\n").length > 1){
				unreadLabel[i] = UkList[i].innerText.trim().split("\n")[0];
				textsLabels[i] = UkList[i].innerText.trim().split("\n")[1];
			}else{
				unreadLabel[i] = "0";
				textsLabels[i] = UkList[i].innerText.trim();
			}
			var blList = UkList[i].getElementsByClassName(ListOfLabelsPatchOfColorInMenu_class);
			colors[i] = blList[0].style.background;
			var OgList = UkList[i].getElementsByClassName(ListOfLabelsActionTextInMenu_class);

			commandsLabels[i] = OgList[0].getAttribute('onclick').split("'")[3];
		}

		var divString = '<div id="menu">';

		for(var i=0; i<textsUsual.length; i++){
			divString += '<div class="menuitem usual usuC'+i+'"><img src="'+icons[i]+'" title="'+textsUsual[i]+' '+unreadUsual[i]+'" /></div>';
		}
		divString += '</div>';
		var div = document.createElement('div');
		div.innerHTML = divString;
		var parent = document.querySelector(parentOfTheMenu_class);
		var menuDiv = document.getElementById("menu");
		if(menuDiv != null){
			menuDiv.remove();
		}
		parent.prepend(div.firstChild);
	}

	/**
	 * Change the Hash to change the folder
	 */
	function GoTo(label){
		document.location.hash='tl/'+label;
	}

	/**
	 * Add event listener for the menu
	 */
	function CreateMenuActions(){
		for(var i=0; i<textsUsual.length; i++){
			var el = document.querySelector('.usuC'+i);
			el.commandTarget = textsUsual[i];
			el.addEventListener('click', function(e){
				var target = e.target.commandTarget;
				if(target === undefined){
                    if(e.path === undefined){
                        target = e.currentTarget.commandTarget;
                    }else{
                        target = e.path[1].commandTarget;
                    }
				}
				GoTo(target);
			});
		}

		for(var i=0; i<commandsLabels.length; i++){
			var el = document.querySelector('.labC'+i);
			el.commandTarget = commandsLabels[i];
			el.addEventListener('click', function(e){
				var target = e.target.commandTarget;
				if(target === undefined){
					if(e.path === undefined){
                        target = e.currentTarget.commandTarget;
                    }else{
                        target = e.path[1].commandTarget;
                    }
				}
				GoTo(target);
			});
		}
	}

	/**
	* Change the title of the page to show the number of unread. Careful, it shows the number of unread for the current page, not for the Inbox.
	* (=> if you are in the spam folder, it will show how many spams you have)
	*/
	function ChangeTitle(){
		var countspan = document.getElementsByClassName(numberOfUnreadSpan_class)[0];
		var count = countspan ? parseInt(countspan.innerText, 10) : 0;
		document.title = "("+count+") "+ USER_EMAIL + " - Gmail";
	}

	/**
	* Create a link to be able to write a new mail in a new tab. Ctrl+click the new mail icon. Uses the desktop Gmail for it.
	*/
	function CreateNewMailTab(){
		var el = document.querySelector(newMailButton_class);
		var elClone = el.cloneNode(true);
		elClone.addEventListener('click', function(e){
			if(event.ctrlKey){
				window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1', '_blank');
				event.stopPropagation();
			}else{
				_e(event, 'tlacmp+75');
			}
		});
		elClone.title = titleTextNewMailButton;
		el.parentNode.replaceChild(elClone, el);
	}

	/**
	* Add a button to open the current mail thread in the classic desktop Gmail, to have all the options there.
	*/
	function AddExternalLink(){
		var div = document.createElement('div');
		div.innerHTML = '<div class="'+firstClassesOfButtonsMenu_class+'" id="external" role="button" aria-label="Open in new tab" title="'+titleTextOpenInNewTabButton+'" tabindex="0"><div class="'+secondClassesOfButtonsMenu_class+' external"></div></div>';
		div.firstChild.addEventListener('click', function(e){
			var mailID = window.location.href.split('/').slice(-1).pop();
			window.open('https://mail.google.com/mail/u/0/#inbox/'+mailID, '_blank');
		});

		var parent = document.querySelector(mailToolboxBar_class);
		while(parent === undefined){
			parent = document.querySelector(mailToolboxBar_class);
		}
		parent.prepend(div.firstChild);

		var observerExternal = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				AddExternalLinkAgain();
			});
		});

		// configuration of the observer:
		var configExternal = { attributes: true, childList: true, characterData: true, subtree: true };

		// pass in the target node, as well as the observer options
		observerExternal.observe(parent, configExternal);
	}

	/**
	* Make sure the button is always present
	*/
	function AddExternalLinkAgain(){
		var test = document.getElementsByClassName("external")[0];
		if(test === undefined && window.location.hash.split('/')[0] == "#cv"){
			var div = document.createElement('div');
			div.innerHTML = '<div class="'+firstClassesOfButtonsMenu_class+'" id="external" role="button" aria-label="Open in new tab" title="'+titleTextOpenInNewTabButton+'" tabindex="0"><div class="'+secondClassesOfButtonsMenu_class+' external"></div></div>';
			div.firstChild.addEventListener('click', function(e){
				var mailID = window.location.href.split('/').slice(-1).pop();
				window.open('https://mail.google.com/mail/u/0/#inbox/'+mailID, '_blank');
			});

			var parent = document.querySelector(mailToolboxBar_class);
			parent.prepend(div.firstChild);
		}
	}

	/**
	* Adds arrows to go up or down in mail view
	*/
	function CreateBackAndForth(){
		var div1 = document.createElement('div');
		div1.innerHTML = '<div class="'+arrowsPosition_class+' realarrows arrows arrowleft" title="'+titleTextMoreRecentMailButton+'"></div>';
		var divIn = document.createElement('div');
		divIn.innerHTML = '<div class="'+arrowsPosition_class+' arrows messageCount" ></div>';
		var div2 = document.createElement('div');
		div2.innerHTML = '<div class="'+arrowsPosition_class+' realarrows arrows arrowright" title="'+titleTextOlderMailButton+'"></div>';


		var nodes = document.querySelectorAll(backButtonsInMailView_class);
		for(var i=0; i<nodes.length; i++){
			var elClone1 = div1.cloneNode(true);
			elClone1.firstChild.addEventListener('click', clickHandlerBack);
			nodes[i].appendChild(elClone1.firstChild);
			var elIn = divIn.cloneNode(true);
			nodes[i].appendChild(elIn.firstChild);
			var elClone2 = div2.cloneNode(true);
			elClone2.firstChild.addEventListener('click', clickHandlerForth);
			nodes[i].appendChild(elClone2.firstChild);
		}

		var elem = document.getElementById(secondLineUI_id);
		if(elem !== undefined){
			var wrongArrows = elem.getElementsByClassName("arrows");
			while(wrongArrows.length>0){
				wrongArrows[0].remove();
			}
		}
	}

    function clickHandlerBack(element) {
        var pressthiskey='k';
        var e = new Event('keypress');
        e.key=pressthiskey;
        e.keyCode=e.key.charCodeAt(0);
        e.which=e.keyCode;
        e.altKey=false;
        e.ctrlKey=false;
        e.shiftKey=false;
        e.metaKey=false;
        e.bubbles=true;
        document.dispatchEvent(e);
    }

    function clickHandlerForth(element) {
        var pressthiskey='j';
        var e = new Event('keypress');
        e.key=pressthiskey;
        e.keyCode=e.key.charCodeAt(0);
        e.which=e.keyCode;
        e.altKey=false;
        e.ctrlKey=false;
        e.shiftKey=false;
        e.metaKey=false;
        e.bubbles=true;
        document.dispatchEvent(e);
    }

	/**
	* Adds message count between the arrows in mail view
	*/
	function AddMessageCount(){
		var mailList = document.querySelector(mainListOfMail_class).children;
		var tabSplit =  window.location.hash.split('/');
		var currentId = tabSplit[tabSplit.length-1];
		for(var i=0; i<mailList.length; i++){
			if(mailList[i].id.substring(3) == currentId){
				var counts = document.getElementsByClassName("messageCount");
				while(counts.length==0){
					counts = document.getElementsByClassName("messageCount");
				}
				for(var j=0; j<counts.length; j++){
					counts[j].innerText = i+1;
				}
				break;
			}
		}
	}

	/**
	* Scroll the right size with PgUp and PgDown and with space, shift+space
	*/
	function AddScrollEvents(){
		window.addEventListener('keydown', function (e) {
			if (e.keyCode === 33 || (e.shiftKey && e.keyCode === 32 && e.target.tagName.toLowerCase() != "input" && !(document.activeElement.isContentEditable || document.activeElement.type == "search"))) {
				window.scrollBy(0,-(window.innerHeight-100));
				e.stopPropagation();
				e.preventDefault();
			}else if (e.keyCode === 34 || (e.keyCode === 32 && e.target.tagName.toLowerCase() != "input" && !(document.activeElement.isContentEditable || document.activeElement.type == "search"))) {
				window.scrollBy(0,(window.innerHeight-100));
				e.stopPropagation();
				e.preventDefault();
			}
		}, true);
	}

	/**
	* Force an update of the current folder to have the new mails, even in background
	*/
	function ForceFolderUpdate(){
		if(forceUpdate != 0){
			var workerData = new Blob(["var interval = setInterval(function() {postMessage('');}, "+forceUpdate*60000+");"], {
				type: "text/javascript"
			});

			var myWorker = new Worker(window.URL.createObjectURL(workerData));
			myWorker.postMessage("");
			myWorker.onmessage = function(event) {
				_e(event, 'j');
				poll_();
			};
		}
	}

	/**
	* Trigger some function when the hash part of the URL change (after the '#').
	* Indicates when we change view, from timeline to mail view (for example)
	*/
	function CheckHash(){
		var array = window.location.hash.split('/');
		var test = document.getElementsByClassName("external")[0];
		if(test === undefined){
			if(array.length>2 && array[0] == "#cv"){
				AddExternalLink();
			}else{
				var elem = document.getElementById("external");
				if(elem != null){
					elem.remove();
				}
			}
		}

		var mailList = document.querySelector(mainListOfMail_class);
		if(mailList !== undefined){
			if(array.length>2 && array[0] == "#cv"){
				var interval = setInterval(function() {
					var nodeMenu = document.getElementsByClassName("messageCount")[0];
					if (typeof nodeMenu == 'undefined') return;
					clearInterval(interval);

					AddMessageCount();

				}, 100);
			}else{
				var elems = document.getElementsByClassName("messageCount");
				for(var i=0; i<elems.length; i++){
					elems[i].innerText="";
				}
			}
		}

		if(array.length==1 && array[0] == "#mn"){
			var interval = setInterval(function() {
				// Wait for "Labels" to exist
				var nodeLabels = document.getElementsByClassName(listOfLabelsInMenu_class);
				if (typeof nodeLabels == 'undefined') return;
				clearInterval(interval);

				InitStaticMenu();
				CreateStaticMenu();
				CreateMenuActions();

			}, 100);
		}
	}

	/**
	* Launch the functions that need to have a DOM node already present before being executed.
	* Makes also sure that we are in the right view to run the functions (mail view, timeline, menu, etc.)
	*/
	function AsyncFunctions(){
		var interval = setInterval(function() {
			// Wait for "New Mail" button to exist
			var nodeMenu = document.querySelector(newMailButton_class);
			if (typeof nodeMenu == 'undefined') return;
			clearInterval(interval);

			CreateNewMailTab();

		}, 100);

		var interval2 = setInterval(function() {
			// Makes sure we are in the "timeline" mode, and that it is loaded
			var nodeMenu = document.getElementById(mainTimeline_id);
			if (typeof nodeMenu == 'undefined' || nodeMenu.querySelector(parentOfTheMenu_class) === undefined || document.location.hash.split('/')[0] != "#tl") return;
			clearInterval(interval2);

			CreateStaticMenu();
			CreateMenuActions();

		}, 100);

		var interval3 = setInterval(function() {
			// Makes sure we are in "mail view" mode, and wait for the "back" button to be there
			var nodeMenu = document.querySelectorAll(backButtonsInMailView_class);
			if (typeof nodeMenu == 'undefined'|| document.location.hash.split('/')[0] != "#cv") return;
			clearInterval(interval3);

			CreateBackAndForth();

		}, 100);
	}

	GmailFavIconUnreadCount();
	ApplyStyle();
	AddScrollEvents();
	ForceFolderUpdate();
	AsyncFunctions();


	window.onhashchange = CheckHash;
	CheckHash();

}());

