// ==UserScript==
// @id             c6a206b6-1d09-479b-8f25-5d04425f3c40
// @name           GameFAQs - Bluesky Embeds
// @version        1.7
// @namespace      Takato
// @author         Takato
// @description    Bluesky embedding on GameFAQs
// @include        https://gamefaqs.gamespot.com/boards/*
// @require        https://code.jquery.com/jquery-4.0.0-rc.1.min.js
// @grant          na
// @downloadURL https://update.greasyfork.org/scripts/541521/GameFAQs%20-%20Bluesky%20Embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/541521/GameFAQs%20-%20Bluesky%20Embeds.meta.js
// ==/UserScript==


var colorMode = "gfaqs";

/* 
	colorMode options are:
	- "gfaqs" - (Default) Matches your GameFAQs theme.
	- "system" - Matches your browser/OS setting.
	- "light" - Always use light mode.
	- "dark" - Always use dark mode.
*/



// Users don't need to edit anything below here unless modifying functionality.

var debugMode = false;
if ( (new URLSearchParams(window.location.search)).has("debug") ) {
	debugMode = true;
}

function debug(msg, override=false) {
	if (debugMode || override) {
		console.log(`%c[GFAQS Bluesky Script ${info.ver}]%c ${msg}`, "color:#0a7aff; color: light-dark(#0a7aff,#208bfe); background: light-dark(white,black); font-weight: bolder;", "",);
	}
}

var info = {};
var gminfo = GM.info || GM_info;
info.ver = gminfo.script.version;
info.ext = gminfo.scriptHandler;
info.extver = gminfo.version;
debug(`Running script version [${info.ver}] in userscripts extension ${info.ext} ${info.extver}`, true);

debug("Debug mode is enabled and will output messages to help diagnose issues.");



// Determine colour mode
if (!["gfaqs","system","light","dark"].includes(colorMode)) {
	colorMode = "gfaqs"; // force to default if not set to a valid option
}

if (colorMode == "gfaqs") { // match the GameFAQs theme.
	colorMode = "light";
	if ($("body[data-css*='dark'], body[data-css='cloudy']").length > 0) { colorMode = "dark"; }
}
debug(`Using colour mode "${colorMode}"`);



var embedMode = "first";
// Hook into forum_convert_links function to detect what type of embedding the user wants
var scriptInjector = function() {
	window.forum_convert_links_OG = window.forum_convert_links; // Save original
	
	window.forum_convert_links = function(link_type, target) {
		if (target == ".msg .msg_body .msg_text" && link_type >= 0 && link_type <= 5) {
			document.body.dataset.embedMode = link_type;
			window.forum_convert_links = window.forum_convert_links_OG; // got mode, set function back to normal
		}
		window.forum_convert_links_OG(link_type, target);
	};
}

injector = document.createElement("script");
injector.textContent = "(" + scriptInjector.toString() + ")();";
document.documentElement.appendChild(injector);



// Add CSS - handles link open/close display, the minimal embed iframe styling, and a loading indicator.
var css = `<style type='text/css'>
	.bsky-script-container {
		& {display:inline;} 
		&:open {display:contents;}
		
		summary {display:inline;} 
		
		&:open .fa-plus-square-o, &:not(:open) .fa-minus-square-o {display:none;} 
		
		.bluesky-embed {width:100%; max-width:600px; height:0; display:block; border:none; margin:0.5em 0;}
		
		.loading {
			width:28px; height:28px; animation: bskyloading 1s alternate infinite; background-size: contain; background-repeat: no-repeat; background-position: center; margin: 0.5em 6px;
			background-image:url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20viewBox='0%200%20320%20286'%3e%3cpath%20fill='rgb(10,122,255)'%20d='M67.364%2019.146c36.687%2027.806%2076.147%2084.186%2090.636%20114.439%2014.489-30.253%2053.948-86.633%2090.636-114.439C277.107-.917%20320-16.44%20320%2032.957c0%209.865-5.603%2082.875-8.889%2094.729-11.423%2041.208-53.045%2051.719-90.071%2045.357%2064.719%2011.12%2081.182%2047.953%2045.627%2084.785-80%2082.874-106.667-44.333-106.667-44.333s-26.667%20127.207-106.667%2044.333c-35.555-36.832-19.092-73.665%2045.627-84.785-37.026%206.362-78.648-4.149-90.071-45.357C5.603%20115.832%200%2042.822%200%2032.957%200-16.44%2042.893-.917%2069.364%2019.147Z'/%3e%3c/svg%3e");
		}
		
		.loading:has(+ iframe.loaded) {display: none;}
		
	}
	
	@keyframes bskyloading {
		0%, 60% { opacity:1; }
		100% { opacity:0.5; }
	}
</style>`;
$(css).appendTo(document.body);
debug("Added CSS to page");


// Process links
setTimeout(function() { // it's on a tiny delay so it runs after GameFAQs has already converted text into links.
	
	// Detect user's embed mode.
	embedMode = "first"; // Default, auto-expands the first embed but keeps the rest click-to-show. Matches GameFAQs setting "0".
	if (document.body.dataset.embedMode) {
		if (document.body.dataset.embedMode == "1" || document.body.dataset.embedMode == "4") {
			embedMode = "click"; // Click-to-show
		} else if (document.body.dataset.embedMode == "3") {
			embedMode = "auto"; // Show all media
		} else if (document.body.dataset.embedMode == "2") {
			// User doesn't have links linkified, script will not work.
			$("<div class='msg_warn'>The Bluesky embeds script requires your <a href='https://gamefaqs.gamespot.com/user/settings_advanced'>\"Links and Media in Messages\" setting</a> to be set to anything other than \"Keep all links as plain text\". <br/> Please choose an option, save, and refresh this topic to use embeds.</div>").insertBefore(".pod.board_wrap");
			return;
		}
	}
	debug(`Embed mode is "${embedMode}"`);
	
	debug("There are "+$(".msg_text a[href*='https://bsky.app/profile/']:not(.bluesky-link)").length+" Bluesky links on this page to process");
	
	// Process all links
	$(".msg_text a[href*='https://bsky.app/profile/']:not(.bluesky-link)").each(function() {
		debug("Processing a Bluesky link");
		var el = $(this);
		var url = el.attr("href");
		el.addClass("bluesky-link"); // Prevent later calls re-attempting the same link
		var matches = url.match(/https?:\/\/bsky\.app\/profile\/([a-z0-9_\-\:\.]{1,60})\/post\/([a-z0-9]{10,15})/i);
		if (matches) {
			var userdid = "";
			var userhandle = "";
			if (matches[1].startsWith("did:plc:")) { // Direct did:plc link
				userdid = matches[1];
			} else { // link with a handle
				userhandle = matches[1];
				if (sessionStorage.getItem("bsky1-handle-"+userhandle) !== null) { // Handle's did:plc is cached
					userdid = sessionStorage.getItem("bsky1-handle-"+userhandle);
					if (userdid == "error") { return; }// the cached value is an error, don't continue processing
					// Use the cached did:plc
					userdid = ($("<div></div>").text(userdid).html()); // html escaping
				}
			}
			createPlaceholder(el, userhandle, userdid, matches[2], colorMode);
		}
	});
	
	// Do any embeds need auto-expanding?
	debug("Handling any auto-expands if needed");
	if (embedMode == "first") { // Expand the first embed on the page.
		$(".msg_text .bsky-script-container").first().attr("open","open");
		
	} else if (embedMode == "auto") { // Expand all embeds on the page.
		var hasOpened = [];
		
		$(".msg_text .bsky-script-container").each(function() {
			if (this.dataset.bskyDidplc != "") { // Already has did:plc, safe to open
				this.setAttribute("open","open");
			} else { // Doesn't have a did:plc
				var handle = this.dataset.bskyHandle;
				if (!hasOpened.includes(handle)) { // Only request one per handle, to avoid multiple ajax requests for the same handle
					hasOpened.push(handle);
					this.setAttribute("open","open");
				}
			}
		});
	}
	
	debug("Finished processing any links present");

}, 1);



// Create the Bluesky toggle element, in place of the original link
function createPlaceholder(element, handle, didplc, messageid, color) {
	var handleOrId = (handle==""?didplc:handle);
	var linkUrl = `https://bsky.app/profile/${handleOrId}/post/${messageid}`;

	var html = $(`
		<details class="bsky-script-container" data-bsky-didplc="${didplc}" data-bsky-handle="${handle}" data-bsky-messageid="${messageid}" data-bsky-colormode="${color}">
			<summary class="click_embed">
				<i class="plusbox fa fa-plus-square-o"></i>
				<i class="plusbox fa fa-minus-square-o"></i>
				${linkUrl}
				<a class="bluesky-link" href="${linkUrl}" target="_blank">
					<i class="fa fa-external-link"></i>
				</a>
			</summary>
			<div class="loading"></div>
		</details>
	`);
	html[0].addEventListener("toggle", openDetails);
	element.replaceWith(html);
}


// Handle embeds being un-collapsed
function openDetails() {
	if (this.open && !this.dataset.requested) { // Element has been opened and hasn't been generated before
		this.dataset.requested = "true";
		
		// Has the did:plc, can go direct to embedding
		if (this.dataset.bskyDidplc && this.dataset.bskyDidplc != "") { 
			generateIframe(this, this.dataset.bskyDidplc, this.dataset.bskyMessageid, this.dataset.bskyColormode);
			
			return;
		} 
		
		// Only has a handle. request data.
		if (this.dataset.bskyHandle && this.dataset.bskyHandle != "") {
			
			debug(`Requesting handle resolution for "${this.dataset.bskyHandle}"`);
				 
			$.ajax({
				url: "https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle="+this.dataset.bskyHandle,
				context: this
			})
			.always(function(data) {
				var handle = this.dataset.bskyHandle;
				var success = false;
				try {
					if (data && data.did) {
						success = true;
					}
				} catch(ex) {}
				
				if (!success) {
					debug(`Handle request for "${handle}" failed. Caching as error.`);
					// store as an error so don't need to keep re-requesting
					sessionStorage.setItem("bsky1-handle-"+handle, "error");
					
					// Revert all messages for this handle
					$("details.bsky-script-container[data-bsky-handle='"+handle+"']").each(function(){
						revertToLink(this, handle, this.dataset.bskyMessageid);
					});
					
				} else {
					debug(`Handle request for "${handle}" succeeded. Caching the result.`);
					// We now have a did:plc, cache it
					var userdid = ($("<div></div>").text(data.did).html()); // html escaping
					sessionStorage.setItem("bsky1-handle-"+handle, data.did);
					
					$("details.bsky-script-container[data-bsky-handle='"+handle+"']").each(function(){
						// for all collapsed messages with the same handle, update them to have this did:plc data
						this.dataset.bskyDidplc = userdid;
						if (embedMode == "auto") { // User wants auto-open, so also open all collapsed messages with this handle
							this.setAttribute("open","open");
						}
					});
					
					// And generate this message's iframe.
					generateIframe(this, userdid, this.dataset.bskyMessageid, this.dataset.bskyColormode);
				}
			});
			
			
			return;
		}
		
		
	}
}


// Generate and insert the iframe
function generateIframe(element, didplc, messageid, color) {
	var rand = String(Math.random()).slice(2); // required for bluesky to identify and size unique frames of the same message
	var iframeUrl = `https://embed.bsky.app/embed/${didplc}/app.bsky.feed.post/${messageid}?id=${rand}&ref_url=https%253A%252F%252Fgamefaqs.gamespot.com&colorMode=${color}`;
	
	var html = $(`<iframe data-bluesky-id="${rand}" src="${iframeUrl}" class="bluesky-embed" loading="lazy" scrolling="no" target="_blank"></iframe>`);
	
	html.appendTo(element);
}


// Revert to link in case of error
function revertToLink(element, handleOrId, messageid) {
	var linkUrl = `https://bsky.app/profile/${handleOrId}/post/${messageid}`;
	
	var html = $(`<a class="bluesky-link" href="${linkUrl}" target="_blank">${linkUrl}</a>`);
	
	$(element).replaceWith(html);
}


// Resize the frames when loaded or page has changed size
// Taken from https://embed.bsky.app/static/embed.js so we don't need to use the full script.
window.addEventListener('message', function (event) {
	if (event.origin !== 'https://embed.bsky.app') {
		return;
	}
	var id = event.data.id;
	if (!id) {
		return;
	}
	var embed = document.querySelector("[data-bluesky-id=\"".concat(id, "\"]"));
	if (!embed) {
		return;
	}
	embed.classList.add("loaded");
	var height = event.data.height;
	if (height) {
		embed.style.height = "".concat(Math.ceil(height), "px");
	}
});