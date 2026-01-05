// ==UserScript==
// @name           Danbooru - Miscellaneous Tweaks
// @namespace      https://greasyfork.org/scripts/3467
// @description    Adds a variety of useful tweaks to Danbooru
// @match          *://*.donmai.us/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @version        2025.07.04
// @downloadURL https://update.greasyfork.org/scripts/3467/Danbooru%20-%20Miscellaneous%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/3467/Danbooru%20-%20Miscellaneous%20Tweaks.meta.js
// ==/UserScript==

/*
	Settings are modified by clicking the "Tweaks" link at the right end of the navbar on most pages.
	You do not need to modify the script itself.
*/

var showError = false, recursion, login, loginID, content, navbar, subnavbar, isApprover;

try{
	initialize();
	loadTweaks();
} catch(err) {
	showError = true;
	MS_alert("Error loading tweaks: "+err);
}

function loadTweaks()
{
	var tweaks =
	[
		{ name:"Show Errors", desc:"Display error messages if tweaks fail.", func:showErrorFun, version:0, args:[] },
		
		{ name:"Add Tag Subscription", desc:"Adds pseudo tag subscriptions to your user page.<br>"+
			"<u>title</u>: Title of the subscription, linked to the first query.  The title must be unique.<br>"+
			"<u>timestamp</u>: Appends a timestamp of the last refresh to the title.<br>"+
			"<u>refresh</u>: Hours to wait before refreshing the subscription.<br>"+
			"<u>thumbs</u>: Number of thumbnails to display.<br>"+
			"<u>maxExpanded</u>: Number of thumbnails to display when the subscription is expanded.<br>"+
			"<u>intersect</u>: Return posts matching ALL queries (using the order of the last) rather than ANY (sorted by post ID).<br>"+
			"<u>queries</u>: List of objects representing post searches.<br>"+
			"<u>search</u>: Tags to search for; the usual limitations apply.<br>"+
			"<u>pages</u>: Number of pages to collect for this query, each page containing 100 posts.<br>", func:addTagSubscription, version:2, args:[ { desc:"", value:[
                { title:"Recently Translated", timestamp:false, refresh:1, thumbs:6, maxExpanded:100, intersect:true, queries:[ { search:"order:note user:"+login, pages:1 } ] },
                { title:"Recently Commented", timestamp:false, refresh:1, thumbs:6, maxExpanded:100, intersect:true, queries:[ { search:"order:comment user:"+login, pages:1 } ] } ], getValue:getTagSubscriptions } ] },
		
		{ name:"Blacklist", desc:"Blacklist implementation that replaces images with links labeled with the tags they matched in the blacklist.  Clicking the link/image alternates between the two.  Translation notes appear every other time the image is displayed.  User and rating metatags are supported.  Your own posts are exempt from the blacklist.", func:blacklistTags, version:1, args:[
            	{ desc:"Tag list:", value:[ "blocked_tag_1", "blocked_tag_2", "blocked_tag_*" ], getValue:getStringArray }] },
		
		{ name:"Add +/- Links", desc:"Adds +/- tag links to the tag list.", func:addPlusMinusLinks, version:1, args:[
            	{ desc:"Make links add/remove tags from search box instead of launching new searches", value:true }] },
		
		{ name:"Comment Listing Filter", desc:"Hides posts and comments in the comment listing for posts with any of the specified tags.  Click the replacement text to reveal.", func:commentListingFilter, version:1, args:[
            	{ desc:"", value:[ "Spoilers" ], getValue:getStringArray } ] },
		
		{ name:"Custom Taglist", desc:"Adds a new taglist section below tag lists, complete with +/- links.  Tag types are supported.", func:customTaglist, version:0, args:[
            	{ desc:"Title of list", value:"Custom Tags", elem:"input" },
            	{ desc:"Tags", value:[ 'art:bomber_grape', 'char:maribel_hearn', 'copy:hidamari_sketch', 'order:score', 'order:comment', 'comm:'+login, 'rating:e', 'rating:q', 'rating:s', 'status:any', 'fav:'+login, 'user:'+login, 'pixiv:>0', 'arttags:0', 'chartags:1', 'copytags:1', 'gentags:1' ], getValue:getStringArray }] },
		
		{ name:"DText Replace", desc:"Replaces text in DText-enabled textareas (to the 'Text' pattern) and the names of all links with DText or DText-like shorthand forms (to the 'Link' pattern).", func:dtextReplace, version:0, args:[ { desc:"", value:[
			{ regex:"(^|[^:])(http://seiga.nicovideo.jp/seiga/im(\\d+))$", text:"\"seiga #$3\":$2", link:"seiga #$3" },
			{ regex:"(^|[^:])http:..www.pixiv.net.member_illust.php.mode=(medium|big|manga)&illust_id=(\\d+)$", text:"$1pixiv #$3", link:"$1pixiv #$3" },
			{ regex:"(^|[^:])http:..www.pixiv.net.member_illust.php.mode=manga_big&illust_id=(\\d+)&page=(\\d+)$", text:"$1pixiv #$2/p$3", link:"$1pixiv #$2/p$3" },
			{ regex:"(^|[^:])https?:[^ \\.]+.donmai.us.(post|comment|pool|user|artist)s.(\\d+)((\\/|\\?)[^\\s]*)?$", text:"$1$2 #$3", link:"$1$2 #$3" },
			{ regex:"(^|[^:])https?:[^ \\.]+.donmai.us.forum_posts.(\\d+)$", text:"$1forum #$2", link:"$1forum #$2" },
			{ regex:"(^|[^:])https?:[^ \\.]+.donmai.us.forum_topics.(\\d+)$", text:"$1topic #$2", link:"$1topic #$2" },
			{ regex:"(^|[^:])https?:..github.com.r888888888.danbooru.issues.(\d+)$", text:"$1issue #$2", link:"$1issue #$2" }
		], getValue:getDTextArray } ] },
		
		{ name:"Hide User Statistics", desc:"", func:hideUserStatistics, version:0, args:[
            	{ desc:"Stats to remove from your profile", value:[ "Statistics", "Inviter", "Approvals" ], getValue:getStringArray },
            	{ desc:"Stats to remove from others' profiles", value:[ "Inviter" ], getValue:getStringArray }] },
		
		{ name:"Navbar Links", desc:"Adds links to the left side of the navbar.", func:navbarLinks, version:1, args:[
            	{ desc:"", value:[{ text:"Upload", href:"/uploads/new" }, { text:"IQDB", href:"http://danbooru.iqdb.org/" }], getValue:getLinkArray },
            	{ desc:"Links to remove from navbar or subnavbar", value:[ "Sign out" ], getValue:getStringArray } ] },
		
		{ name:"Navbar Tag Search", desc:"Adds/moves the post search box to the navbar.", func:navbarTagSearch, version:1, args:[
            	{ desc:"Move the post search box when it exists", value:true },
            	{ desc:"Add to subnavbar instead of navbar", value:true }] },

        { name:"Post Queue Tweaks", desc:"Various modifications to the post moderation queue", disabled:!isApprover, func:postQueueTweaks, version:1, args:[
            	{ desc:"Highlight posts with these tags in red, and style the matched tags in bold/underline", value:[ "downscaled", "duplicate", "image_sample", "md5_mismatch", "resized", "upscaled" ], getValue:getStringArray },
            	{ desc:"Reject ('No Interest'/'Skip') posts containing any of these tags", value:[], getValue:getStringArray },
            	{ desc:"Swap thumbnail of top post in window with larger size when this key is pressed (list mode only)", value:"", elem:"input", getValue:getSingleChar },
            	{ desc:"Swap thumbnail with larger size when clicked (list view only)", value:false },
            	{ desc:"Automatically up/down vote posts when the approval/disapproval links are clicked (except 'No Interest'/'Skip')", value:true },
                { desc:"Posts per page", value:0, getValue:getNumber(0,200) },
                { desc:"Move buttons to above the tag list (list view only)", value:false } ] },

		{ name:"Precision Time", desc:"Sets all time fields to the 'X units ago' form.", func:precisionTime, version:0, args:[
            	{ desc:"Precision", value:1, getValue:getNumber(0,6) } ] },
		
		{ name:"Score Thumbnails", desc:"Displays scores and favorite counts below thumbnails.", func:scoreThumbnails, version:0, args:[
            	{ desc:"Show score", value:true }, { desc:"Show favcount", value:false } ] }
	];
	
	var i, settings = MS_getValue( "settings", {} );
	for( i = 0; i < tweaks.length; i++ )
	{
		//Add tweaks to settings object if they don't exist, and reset those with changed versions or number of arguments.
		//Done in a separate loop since the function calls might modify the settings arguments.
		if( !tweaks[i].disabled && ( !settings[ tweaks[i].name ] || settings[ tweaks[i].name ].version != tweaks[i].version ) )
		{
			settings[ tweaks[i].name ] = { enable:!!tweaks[i].enable, version:tweaks[i].version };
			MS_setValue( "settings", settings, -1 );
		}
	}
	
	for( i = 0; i < tweaks.length; i++ )
	{
		try{
			if( !tweaks[i].disabled && settings[ tweaks[i].name ].args && settings[ tweaks[i].name ].enable )
				tweaks[i].func.apply( this, settings[ tweaks[i].name ].args );
		}
		catch(e) { MS_alert("Error ("+tweaks[i].name+"): "+e); }
	}
	settings = null;
	
	content = !recursion && navbar && document.getElementById("page");
	if( !content )
		return;
	
	var settingsLink = navbar.appendChild( createElementX({ tag:"a", class:"py-1.5 px-3", text: "Tweaks" }) );
	var settingsDiv = content.parentNode.insertBefore( createElementX({ tag:"div", style:"display:none; padding:0 20px 30px 20px;", id:"tweaks_settings" }), content );
	
	settingsLink.addEventListener( "mousedown", function()
	{
		if( content.style.display == "none" )
		{
			//Closing settings.  Destroy the contents and unhide the original content.
			settingsDiv.style.display = "none";
			content.style.display = "block";
			settingsDiv.textContent = "";
		}
		else
		{
			//Opening settings.  Hide the current content and reconstruct the GUI from scratch.
			var settings = MS_getValue( "settings", {} );
			
			settingsDiv.appendChildX({ tag:"h4" }).appendChildX("Miscellaneous Tweaks settings", { tag:"hr" });
			var table = settingsDiv.appendChildX({ tag:"table", width:"100%", style:"margin-bottom: 2em; vertical-align:top;" });
			
			var resetAll = false, resetButtons = [];
			
			//Clear old unused settings
            for( let sName in settings )
			{
				for( var i = 0; i < tweaks.length && sName != tweaks[i].name; i++ );
				if( i == tweaks.length )
				{
					delete settings[sName];
					MS_setValue( "settings", settings, -1 );
				}
			}
			
			for( let i = 0; i < tweaks.length; i++ )
			{
                if( tweaks[i].disabled )
                    continue;

				let reset, body, check, title, tr = table.appendChildX({ tag:"tr", style:"vertical-align:top;" });
				let border = i != tweaks.length - 1 ? "border-bottom:4px solid #EEE; " : "";
				
				//Button to reset to default settings
				reset = tr.appendChildX({ tag:"td", style:border+"padding:1px 4px 1em 4px; width:1%" }).appendChildX({ tag:"button", title:"Reset to default settings for this tweak.", text:"Reset" });
				resetButtons.push( reset );//pad 1 4
				
				//Checkbox to toggle tweak
				check = tr.appendChildX({ tag:"td", style:border+"padding:0.3em 4px 1em 4px; text-align:center" }).appendChildX({ tag:"input", type:"checkbox", title:"Toggle this tweak." });
				check.checked = ( settings[ tweaks[i].name ].args ? !!settings[ tweaks[i].name ].enable : !!tweaks[i].enable );
				
				//Tweak description and arguments
				body = tr.appendChildX({ tag:"td", style:border+"padding:1px 4px 1em 4px; " });
				title = body.appendChildX({ tag:"b", text:tweaks[i].name });
				title.style.setProperty( "text-decoration", check.checked ? "none" : "line-through", null );
				
				body.appendChildX(": ");
				body.appendChildX({ tag:"span" }).innerHTML = tweaks[i].desc;
				
				//When the Reset button is clicked, delete any custom settings for it and fall back on defaults.
				reset.addEventListener( "click", (function(tweak,check){ return function()
				{
					if( !resetAll && !confirm("Reset this tweak?") )
						return;
					if( !!check.checked != !!tweak.enable )
						check.click();
					
					var settings = MS_getValue( "settings" );
					settings[ tweak.name ] = { enable:!!tweak.enable, version:tweak.version, args:defaultArgs( tweak ) };
					MS_setValue( "settings", settings, -1 );
					
					for( let i = 0; i < tweak.args.length; i++ )
						tweak.args[i].save(true);
				}; })( tweaks[i], check ), false );
				
				//When checkbox is clicked, toggle the title strikethrough and save settings
				check.addEventListener( "click", (function(tweak,title){ return function()
				{
					var settings = MS_getValue( "settings" );
					
					title.style.setProperty( "text-decoration", (settings[ tweak.name ].enable = this.checked) ? "none" : "line-through", null );
					if( !settings[tweak.name].args )
						settings[tweak.name].args = defaultArgs( tweak );
					MS_setValue( "settings", settings, -1 );
				}; })(tweaks[i],title), false );
				
				//If the tweak takes arguments, create the appropriate input elements and listeners.
				if( tweaks[i].args.length )
				{
					var list = body.appendChildX({ tag:"ul", style:"margin:0 0 0 2em;  list-style:disc" });
					for( var j = 0; j < tweaks[i].args.length; j++ )
						setupArg( settings, tweaks[i], j, list.appendChildX({ tag:"li", text:tweaks[i].args[j].desc+(tweaks[i].args[j].desc.length ? ": " : ""), style:"margin-top:4px" }) );
				}
			}
			
			settingsDiv.appendChildX({ tag:"hr" }, "Questions?  Comments?   Problems?  Leave some feedback at ", { tag:"a", href:"https://sleazyfork.org/en/scripts/3467", text:"https://sleazyfork.org/en/scripts/3467" }, "!" );
			settingsDiv.appendChildX({ tag:"hr" }, { tag:"b", text:"Raw settings:" }, { tag:"br" });
			settingsDiv.appendChildX({ tag:"textarea", type:"text", readonly:"true", style:"display: inline-block; width:98%; height:20px", title:"raw settings data!" }).value = JSON.stringify(settings);
			settingsDiv.appendChildX({ tag:"hr" });
			
			//"Reset All Tweaks" button
			settingsDiv.appendChildX({ tag:"input", type:"button", value:"Reset All Tweaks", title:"Reset all settings." }).addEventListener( "click", function()
			{
				if( confirm("Reset all tweaks?") && confirm("...Really?") )
				{
					resetAll = true;
					for( let i = 0; i < resetButtons.length; i++ )
						resetButtons[i].click();
					resetAll = false;
				}
			}, false );
			
			//"Delete All Variables" button
			settingsDiv.appendChildX({ tag:"input", type:"button", value:"Delete All Variables", title:"Reset all settings." }).addEventListener( "click", function()
			{
				if( confirm("WARNING: This will delete all variables associated with this script.") && confirm("...Really?") )
				{
					var varList = GM_listValues();
					while( varList.length > 0 )
						GM_deleteValue( varList.pop() );
					settingsLink.click();
				}
			}, false );
			
			content.style.display = "none";
			settingsDiv.style.display = "block";
		}
	}, false );
	
	//Returns an array with just the "value" properties from an array of arguments for a tweak
	function defaultArgs( tweak )
	{
		var defArgs = [];
		for( let i = 0; i < tweak.args.length; i++ )
			defArgs.push( tweak.args[i].value );
		return defArgs;
	}
		
	//Creates the input element for an element and sets up the appropriate settings/listeners
	function setupArg( oldSettings, tweak, argI, elem )
	{
		//Let the starting value be the custom setting, or default if nothing set
		var currentValue = tweak.args[argI].value, event = "input";
		if( oldSettings[ tweak.name ] && oldSettings[ tweak.name ].args && oldSettings[ tweak.name ].args[argI] != null )
			currentValue = oldSettings[ tweak.name ].args[argI];
		
		if( typeof( tweak.args[argI].value ) == "boolean" )
		{
			//Checkbox
			elem = elem.appendChildX({ tag:"input", type:"checkbox", title:tweak.args[argI].desc });
			
			if( !tweak.args[argI].getValue )
				tweak.args[argI].getValue = function(thing){ return thing.checked; };
			if( !tweak.args[argI].setValue )
				tweak.args[argI].setValue = function(thing,val){ thing.checked = val; }
			
			event = "click";
		}
		else if( typeof( tweak.args[argI].value ) == "number" )
		{
			elem = elem.appendChildX({ tag:"input", type:"text", title:tweak.args[argI].desc });
			
			if( !tweak.args[argI].getValue )
				tweak.args[argI].getValue = function(thing){ var val = Number( thing.value ); return isNaN(val) || thing.value.length == 0 ? null : val; };
			if( !tweak.args[argI].setValue )
				tweak.args[argI].setValue = function(thing,val){ thing.value = val; }
		}
		else if( typeof( tweak.args[argI].value ) == "string" )
		{
			if( tweak.args[argI].elem == "input" )
			{
				//Size element to fit the contents
				elem = elem.appendChildX({ tag:"input", type:"text", title:tweak.args[argI].desc });
				elem.addEventListener( "input", function() { elem.setAttribute("size", elem.value.length + 5); }, false );
				elem.setAttribute("size", currentValue.length + 5);
			}
			else
			{
				//Size to fit, with a timeout since hidden elements don't have a height
				elem = elem.appendChildX({ tag:"textarea", type:"text", style:"display: inline-block; width:95%; height:20px", title:tweak.args[argI].desc });
				setTimeout( function() { elem.style.height = Math.max( elem.scrollHeight, elem.clientHeight, 20 ) + "px"; }, 0 );
				elem.addEventListener( "input", function(){ setTimeout( function(){ if( elem.scrollTop > 0 ) elem.style.height = Math.max( elem.scrollHeight, elem.clientHeight )+"px"; }, 50 ); }, false );
			}
			
			if( !tweak.args[argI].getValue )
				tweak.args[argI].getValue = function(thing){ return thing.value; }
			if( !tweak.args[argI].setValue )
				tweak.args[argI].setValue = function(thing,val){ thing.value = val; }
		}
		else if( typeof( tweak.args[argI].value ) == "object" )
		{
			if( tweak.args[argI].desc.length )
				elem.appendChildX({tag:"br"});
			
			elem = elem.appendChildX({ tag:"textarea", type:"text", style:"display: inline-block; width:95%; height:20px", title:tweak.args[argI].desc });
			setTimeout( function() { elem.style.height = Math.max( elem.scrollHeight, elem.clientHeight, 20 ) + "px"; }, 0 );
			elem.addEventListener( "input", function(){ setTimeout( function(){ if( elem.scrollTop > 0 ) elem.style.height = Math.max( elem.scrollHeight, elem.clientHeight )+"px"; }, 50 ); }, false );
			
			if( !tweak.args[argI].getValue )
				tweak.args[argI].getValue = function(thing){ try{ return MS_parseJSON( elem.value ); } catch(err){ return null; } };
			if( !tweak.args[argI].setValue )
				tweak.args[argI].setValue = function(thing,val){ thing.value = JSON.stringify( val, null, 1 ).replace(/\s+/g,' '); }
		}
		else
		{
			MS_alert("Unknown argument type "+typeof( tweak.args[argI].value )+" ("+tweak.name+")");
			tweak.args[argI].getValue = function(){return null;}
			tweak.args[argI].setValue = function(){}
		}
		
		tweak.args[argI].setValue(elem, currentValue);
		tweak.args[argI].save = function(reset)
		{
			var settings = MS_getValue( "settings" );
			
			if( !settings[ tweak.name ].args )
				settings[ tweak.name ].args = defaultArgs( tweak );
			
			if( reset === true )
				tweak.args[argI].setValue( elem, tweak.args[argI].value );
			
			var value = tweak.args[argI].getValue( elem );
			if( value === null )
				elem.style.color = 'red';
			else
			{
				elem.style.removeProperty("color");
				settings[tweak.name].args[argI] = value;
				MS_setValue( "settings", settings, -1 );
			}
		}
		elem.addEventListener( event, tweak.args[argI].save, false );
	}
	
	function getNumber(a,b)
	{
		a = Number(a);
		b = Number(b);
		return function(elem)
		{
			var num = Number( elem.value );
			if( elem.value.length == 0 || isNaN(num) || num < a || num > b )
				return null;
			return num;
		}
	};
	
	function getDTextArray(elem)
	{
		try{
			var list = MS_parseJSON( elem.value );
			if( list.length == 0 )
				return null;
			
			for( let i = 0; i < list.length; i++ )
			{
				if( new RegExp( list[i].regex ).test("```````````") )
					return null;//Check for valid regex, reject those that match "everything"
				if( list[i].text && ( typeof(list[i].text) != "string" || list[i].text.length < 1 ) )
					return null;
				if( list[i].link && ( typeof(list[i].link) != "string" || list[i].link.length < 1 ) )
					return null;
				if( !list[i].text && !list[i].link )
					return null;
			}
			return list;
		} catch(err){}
		
		return null;
	}
	
	function getBlacklistString(elem)
	{
		try{
			if( !(new RegExp( "(^|.* )("+elem.value+")( .*|$)", "i" ).test("```````````")) )
				return elem.value;
		}catch(err){}
		
		return null;
	}
	
	function getLinkArray(elem)
	{
		try{
			var list = JSON.parse(elem.value);
			if( list.length == 0 )
				return null;
			
			for( let i = 0; i < list.length; i++ )
				if( typeof(list[i].text) != "string" || list[i].text.length == 0 || typeof(list[i].href) != "string" || list[i].href.length == 0 )
					return null;
			
			return list;
		}catch(err) {}
		
		return null;
	}
	
	function getTagSubscriptions(elem)
	{
		try{
			var json = MS_parseJSON( elem.value );
			if( json.length == 0 )
				return null;
			for( var call = 0; call < json.length; call++ )
			{
				//Add missing properties
				if( !json[call].maxExpanded )
					json[call].maxExpanded = 0;
				if( !json[call].intersect )
					json[call].intersect = false;
				if( !json[call].timestamp )
					json[call].timestamp = false
				
				if( json[call].title.length == 0 ||
					typeof(json[call].title) != "string" ||
					typeof(json[call].refresh) != "number" ||
					json[call].refresh <= 0 ||
					typeof(json[call].thumbs) != "number" ||
					json[call].thumbs < 0 ||
					typeof(json[call].maxExpanded) != "number" ||
					json[call].maxExpanded < 0 ||
					( !json[call].thumbs && !json[call].maxExpanded) ||
					json[call].queries.length == 0 )
				{
					return null;
				}
				
				//Titles must be unique
				for( let subCall = 0; subCall < json.length; subCall++ )
					if( call != subCall && json[subCall].title == json[call].title )
						return null;
				
				for( var query = 0; query < json[call].queries.length; query++ )
				{
					if( !json[call].queries[query].pages )
						json[call].queries[query].pages = 1;
					if( json[call].queries[query].search.length == 0 ||
						typeof(json[call].queries[query].search) != "string" ||
						typeof(json[call].queries[query].pages) != "number" ||
						json[call].queries[query].pages < 0 ||
						json[call].queries[query].pages > 1000 )
					{
						return null;
					}
				}
			}
			return json;
		}
		catch(err){ }
		
		return null;
	}
	
	function getStringArray(elem)
	{
		try{
			let list = JSON.parse( elem.value );
			
			if( !( list instanceof Array ) )
				return null;
			
			for( let i = 0; i < list.length; i++ )
				if( typeof(list[i]) != "string" )
					return null;
			
			return list;
		}catch(err){}
		
		return null;
	}

    function getSingleChar(elem)
    {
        if( elem.value.length > 1 )
            return null;
        return elem.value.charAt(0);
    }
}

function initialize()
{
	if( typeof(unsafeWindow) == "undefined" )
		var unsafeWindow=window;
	if( typeof(GM_getValue) == "undefined" || GM_getValue('a', 'b') == undefined )
	{
		//GM_log = console.log || function() { };
		GM_deleteValue = function(a){ localStorage.removeItem("danbooru_miscellaneous."+a); }
		GM_openInTab = function(a){ return window.open(a,a); }
		GM_getValue = function(name, defaultValue)
		{
			var value = localStorage.getItem("danbooru_miscellaneous."+name);
			if( !value )
				return defaultValue;
			
			var type = value[0];
			value = value.substring(1);
			
			if( type == 'b' )
				return value == 'true';
			else if( type == 'n' )
				return Number(value);
			return value;
		}
		GM_setValue = function(name, value)
		{
			value = (typeof value)[0] + value;
			localStorage.setItem("danbooru_miscellaneous."+name, value);
		}
		GM_listValues = function()
		{
			let j = 0, list = new Array(localStorage.length);
			for( let i = 0; i < localStorage.length; i++ )
				if( /^danbooru_miscellaneous/.test( localStorage.key(i) ) )
					list[j++] = localStorage.key(i).replace(/^danbooru_miscellaneous./,'');
			return list;
		}
		GM_xmlhttpRequest = function(obj)
		{
			//Unlike the Greasemonkey function, XMLHttpRequest can't access sites outside Danbooru
			if( !/^https?:..([^.]+\.)?donmai.us\//.test(obj.url) )
				return;
			
			let request = new XMLHttpRequest();
			request.onreadystatechange = function()
			{
				if( obj.onreadystatechange )
					obj.onreadystatechange( request );
				if( request.readyState == 4 && obj.onload )
					obj.onload( request );
			}
			request.onerror = function()
			{
				if( obj.onerror )
					obj.onerror( request );
			}
			try {
				request.open( obj.method, obj.url, true );
			} catch(e) {
				if( obj.onerror )
					obj.onerror( { readyState:4, responseHeaders:'', responseText:'', responseXML:'', status:403, statusText:'Forbidden'} );
				return;
			}
			if( obj.headers )
				for( let name in obj.headers )
					request.setRequestHeader( name, obj.headers[name] );
			
			request.send( obj.data );
			return request;
		}
	}
	
	recursion = (window != window.top);
	
	loginID = document.body.getAttribute("data-current-user-id");
	if( !loginID || loginID.length == 0 )
	{
		login = "";
		loginID = 0;
	}
	else
	{
		login = document.body.getAttribute("data-current-user-name");
		loginID = parseInt(loginID);
	}
	
    navbar = document.getElementById("main-menu");
    subnavbar = document.getElementById("subnav-menu");
    content = !recursion && document.getElementById("page");
    
    if( !subnavbar && navbar )
    {
        //Insert subnavbar if it doesn't exist but the navbar does.
        subnavbar = navbar.parentNode.insertBefore( createElementX({id:"subnav-menu"}), navbar.nextSibling );

        //Add a dummy link element so the subnavbar is the right height.
        subnavbar.appendChildX({tag:"a", href:"#"});
    }

    isApprover = ( document.body.getAttribute("data-current-user-is-approver") == "true" );
}


function showErrorFun()
{
	showError = true;
}


/**
	Adds/moves the post search box to the navbar.
 */
function navbarTagSearch(moveBox,useSubnavbar)
{
	let targetBar = ( useSubnavbar ? subnavbar : navbar );
	if( recursion || !targetBar )
		return;
	
	let searchBox = document.getElementById("search-box-form"), value = "";
	if( searchBox )
	{
        let zid = document.getElementById("z");
        if( zid )
            zid.parentNode.removeChild(zid);
        
        let tagbox = document.getElementById("tags");
        if( tagbox )
            tagbox.setAttribute("placeholder", "Search posts");
        
		if( !moveBox )
			return;
		
		if( tagbox )
			value = tagbox.value.replace(/"/g,'');
		
		//To keep a consistent location for the search box, remove the original one wherever it appears.
		searchBox.parentNode.parentNode.removeChild(searchBox.parentNode);
	}
    
    if( !searchBox )
    {
        searchBox = createElementX({ tag:"section", id:"search-box" });
        searchBox.innerHTML = '<form id="search-box-form" accept-charset="UTF-8" action="/posts" method="get">'
                             +'  <input id="tags" name="tags" type="text" ' + ( value ? 'value="'+value+'" ' : 'placeholder="Search posts" ' ) + '/>'
                             +'  <button id="search-box-submit" type="submit"><svg class="icon svg-icon search-icon" viewBox="0 0 512 512"><use fill="currentColor" href="/packs/static/icons-9fcf22a5166a2c24e889.svg#magnifying-glass"></use></svg></button>'
                             +'</form>';
    }
	
	targetBar.insertBefore( searchBox, targetBar.firstChild );
}


/**
	Adds +/- links next to tags in the taglist to add/remove/negate tags from the tag search box. Tags cannot be added or negated more than once.
 */
function addPlusMinusLinks(addListeners)
{
	if( recursion || !document.getElementById("tags") )
		return;

    let boxValue = document.getElementById("tags").value;
    if( boxValue.length > 0 )
        boxValue += '+';
    
	setTimeout( function() //0-timeout to let the custom tags get added
	{
		for( let listItem of document.querySelectorAll("section .tag-list li") )
		{
            let links = listItem.getElementsByTagName("a");
			if( links.length < 4 )
			{
                var urlTag = boxValue + links[0].href.substring( links[0].href.lastIndexOf("/") + 1, links[0].href.indexOf("?") );
                
                if( links[0].parentNode == listItem )
                    links[0].style.marginRight = ".3rem";
                
                listItem.insertBefore( createElementX( { tag:'a', text:'+', class:"search-inc-tag", style:"margin-right: .4rem", href:"/posts?tags=" +urlTag },
                                                       { tag:'a', text:'-', class:"search-exl-tag", style:"margin-right: .4rem", href:"/posts?tags=-"+urlTag } ), ( listItem == links[1].parentNode ? links[1] : links[1].parentNode ) );
                
				links = listItem.getElementsByTagName("a");
				links[2].innerHTML="&ndash;";
			}
			
			if( addListeners )
			{
				let tag = links[3].textContent.replace( /\s+/g, '_' );
				
				//Plus
				links[1].setAttribute("onclick","return false;");
				links[1].addEventListener( "click", searchBoxChange(" "+tag+" ", " -"+tag+" "), false );
				
				//Minus
				links[2].setAttribute("onclick","return false;");
				links[2].addEventListener( "click", searchBoxChange(" -"+tag+" ", " "+tag+" "), false );
			}
		}
	}, 0 );
	
	function searchBoxChange(add, remove) { return function(e)
	{
		let searchBox = document.getElementById("tags");
		let value = " "+searchBox.value+" ";
		if( value.indexOf(remove) >= 0 )
			value = value.replace(remove," ");
		else if( value.indexOf(add) < 0 )
			value = value + add;
		
		//Trim excess whitespace from search box and give it focus
		searchBox.value = value.replace(/(^ +| +$)/g,'').replace(/  +/,' ');
		searchBox.focus();
	}}
}


/**
	Adds a new section to the taglist, complete with +/- links.
 */
function customTaglist(title, newTags)
{
	var tagList = !recursion && ( document.getElementById("tag-box") || document.getElementById("tag-list") );
	if( !tagList )
		return;
	
	var fragment = createElementX([{ tag:( tagList.id == "tag-box" ? "h2" : "h3" ), text:title, style:"margin-top: 1rem" }]);
	var newList = fragment.appendChildX({ tag:"ul", class:"tag-list" });
	var tagsValue = document.getElementById("tags").value;
	if( tagsValue.length > 0 )
		tagsValue = '+'+tagsValue;
	
	for( let i = 0; i < newTags.length; i++ )
	{
		let newListItem = createElementX({ tag: "li", class:"tag-type-0"/* general tag by default */ });
		let thisTag = newTags[i];//Make copy to avoid removing tag type from original settings
		
		if( thisTag.indexOf("art:") == 0 )
			newListItem.className = "tag-type-1";
		else if( thisTag.indexOf("copy:") == 0 )
			newListItem.className = "tag-type-3";
		else if( thisTag.indexOf("char:") == 0 )
			newListItem.className = "tag-type-4";
		else if( thisTag.indexOf("meta:") == 0 )
			newListItem.className = "tag-type-5";
		
		thisTag = thisTag.replace(/^(art|char|copy|gen):/,'');
		
		if( thisTag.indexOf(":") > 0 )
			newListItem.innerHTML = '<a class="wiki-link" style="margin-right: .2rem" href="/wiki_pages?title=help:cheatsheet">?</a>';
		else
			newListItem.innerHTML = '<a class="wiki-link" style="margin-right: .2rem" href="/wiki_pages?title='+thisTag.replace(/ /g,'_')+'">?</a>';
		
		newListItem.innerHTML += ' <a href="/posts?tags='+thisTag.replace(/ /g,'_')+tagsValue+'" class="search-inc-tag" style="margin-right: .2rem">+</a> <a href="/posts?tags=-'+thisTag.replace(/ /g,'_')+tagsValue+'" class="search-exl-tag" style="margin-right: .2rem">&ndash;</a>'+' <a href="/posts?tags='+thisTag.replace(/ /g,'_')+'" class="search-tag">'+thisTag.replace(/_/g,' ')+'</a>';
		newList.appendChild(newListItem);
	}
	
	tagList.appendChild(fragment);
}


/**
	Adds links to the navbar, and removes links from the navbar or subnavbar.
 */
function navbarLinks(addLinks, removeLinks)
{
    if( !navbar || recursion )
		return;
	
	var fragment = createElementX([]);
	
	for( let i = 0; i < addLinks.length; i++ )
		if( addLinks[i].text && addLinks[i].href )
			fragment.appendChildX({ tag:"a", class:"py-1.5 px-3", href:addLinks[i].href, text:addLinks[i].text });
	
	navbar.insertBefore( fragment, navbar.firstChild );
	
	if( removeLinks.length )
	{
		var navLinks = Array.prototype.slice.call( navbar.getElementsByTagName("a") ).concat( Array.prototype.slice.call( subnavbar.getElementsByTagName("a") ) );
		for( let i = 0; i < navLinks.length; i++ )
			for( let j = 0; j < removeLinks.length; j++ )
				if( navLinks[i].textContent == removeLinks[j] )
					navLinks[i].parentNode.removeChild( navLinks[i] );
	}
}


/**
	Removes the specified statistics from user profiles.
 */
function hideUserStatistics(deleteMe, deleteThem)
{    
	var deleteArray, statBlock = !recursion && document.getElementsByClassName("user-statistics")[0];
	if( !statBlock )
		return;
	
	if( statBlock.parentNode.parentNode.getElementsByTagName("h1")[0].textContent == login )
		deleteArray = ( deleteMe instanceof Array ) ? deleteMe : [];//Your profile
	else
		deleteArray = ( deleteThem instanceof Array ) ? deleteThem : [];//Someone else's profile
	
	if( deleteArray.indexOf("Statistics") >= 0 )
		statBlock.parentNode.getElementsByTagName("h2")[0].style.display = "none";
	
	var statLabels = statBlock.getElementsByTagName("th");
	
	for( let i = 0; i < statLabels.length; i++ )
		if( deleteArray.indexOf( statLabels[i].textContent ) >= 0 )
			statLabels[i].parentNode.style.display = "none";
}


/**
	Appends images' scores and/or favorite counts below their thumbnails.
	
	appendScore: If true, append the score.
	appendFavcount: If true, append the favcount.
 */
function scoreThumbnails( appendScore, appendFavcount )
{
	if( recursion || ( !appendScore && !appendFavcount ) )
		return;
	
	setTimeout( function() { MS_observeInserts( giveSomething )(); }, 0 );
	
	function giveSomething(e)
	{
		if( e && !e.target.querySelectorAll )
			return;
		
        //Clicking on a vote link replaces the "post-votes" class element
        if( e && appendScore && e.target.classList.contains("post-votes") )
        {
            let score = e.target.parentNode.querySelector("span.post-score a");
            if( score.textContent < 0 )
                score.style.color = "red";
            return;
        }
		
        let articles;
        if( !e )
            articles = document.querySelectorAll("article.post-preview");
        else if( e.target.classList.contains("post-preview") )
            articles = [ e.target ];
        else
            articles = e.target.querySelectorAll("article.post-preview");
        
        for( let thumbArt of articles )
        {
            let outerBlock = thumbArt.getElementsByClassName("post-preview-score")[0] || createElementX({ tag:"div", class:"post-preview-score text-sm text-center mt-1" });
            
            if( appendFavcount && !outerBlock.getElementsByClassName("post-fav_count")[0] )
                outerBlock.insertBefore( createElementX({tag:"span", class:"post-score post-fav_count", style:"vertical-align:middle" }), outerBlock.firstChild );
            
            if( appendScore && !outerBlock.getElementsByClassName("post-votes")[0] )
            {
                let postID = thumbArt.getAttribute("data-id");
                outerBlock.appendChild( createElementX({ tag: "span", class:"post-votes inline-flex gap-1", "data-id":postID }) ).innerHTML =
                    '<a class="post-upvote-link inactive-link" data-remote="true" rel="nofollow" data-method="post" href="/posts/'+postID+'/votes?score=1">' +
                        '<svg class="icon svg-icon upvote-icon" viewBox="0 0 448 512"><use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#arrow-alt-up"></use></svg></a>' +
                    '<span class="post-score inline-block text-center whitespace-nowrap align-middle min-w-4"><a rel="nofollow" href="/post_votes?search%5Bpost_id%5D='+postID+'&variant=compact" aria-expanded="false"></a></span>' +
                    '<a class="post-downvote-link inactive-link" data-remote="true" rel="nofollow" data-method="post" href="/posts/'+postID+'/votes?score=-1">' +
                        '<svg class="icon svg-icon downvote-icon" viewBox="0 0 448 512"><use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#arrow-alt-down"></use></svg></a>';
            }
            
            if( !outerBlock.parentNode )
                thumbArt.appendChild( outerBlock );
        }
        MS_usingArticles( articles, function(art)
        {
            let score = appendScore && art.querySelector(".post-votes .post-score a");
            if( score )
            {
                if( art.getAttribute("score") < 0 )
                    score.style.color = "red";
                score.textContent = art.getAttribute("score");
            }
            
            if( appendFavcount )
                art.getElementsByClassName("post-fav_count")[0].innerHTML = art.getAttribute("fav_count")+"&hearts;&nbsp;";
        } );
	}
}


/**
	Blacklist implementation that replaces images with links labeled with tags they matched in the blacklist.  Clicking the link/image alternates between the two.
    Translation notes appear every other time the image is displayed.

	Your own uploads are exempt from the blacklist.
	
	blacklistTags: array of individual tags ('*' supported)
 */
function blacklistTags( blacklist )
{
	if( recursion || blacklist.length == 0 )
		return;
	
    let imageContainer = document.getElementsByClassName("image-container")[0];
	
    let exBlacklist = [];
    for( let tag of blacklist )
        if( tag.indexOf('*') >= 0 )
            exBlacklist.push( new RegExp("^"+tag.replace(/(\$|\^|\)|\(|\+|\.|\[|\])/g,"\\$1").replace("*",".*")+"$", "i" ) );
    
    MS_observeInserts( function(e)
    {
        let found;
        if( !e )
        {
            found = Array.from( document.querySelectorAll("article.post-preview") );
            if( imageContainer )//Apply to image in single-post page
            {
                setTimeout( function(){ imageContainer.style.fontSize = "inherit"; }, 0 );//What is setting font-size to some small value???
                found.push( imageContainer );
            }
        }
        else if( e.target.tagName == "ARTICLE" && e.target.classList && e.target.classList.contains("post-preview") )
            found = [ e.target ];
        else if( e.target.querySelectorAll )
            found = e.target.querySelectorAll("article.post-preview");
        else
            return;
        
        if( !found.length )
            return;
        
        if( !found[0].hasAttribute("data-tags") )
            MS_usingArticles( found, applyBlacklist );
        else for( let target of found )
            applyBlacklist( target );
    })();
	
	function applyBlacklist(elem)
	{
        if( !elem || ( elem.getAttribute("data-uploader-id") || elem.getAttribute("uploader_id") ) == loginID )
			return;
		let tags = elem.getAttribute("data-tags") || elem.getAttribute("tag_string");
        if( !tags )
            return;
        
		var badTags = [];//List of all of this post's tags that hit the blacklist
        
        for( let tag of tags.split(" ") )
        {
            if( blacklist.indexOf(tag) >= 0 )
                badTags.push( tag );
            else for( let extag of exBlacklist )
                if( extag.test(tag) )
                {
                    badTags.push( tag );
                    break;
                }
        }
		
		var image = badTags.length && !elem.getAttribute("blacklisted") && elem.getElementsByTagName("img")[0];
		
		if( !image )
			return;
		
		elem.setAttribute("blacklisted","true");
		
		let blackLink = createElementX({ tag: "a", href:image.src, text:('hidden ('+badTags+')').replace(/,/g,', '), title:( image.title || "" ) });
		
        if( elem.classList.contains("post-status-deleted") )
            blackLink.style.color = "#000";
        else if( elem.classList.contains("post-status-pending") )
            blackLink.style.color = "#00F";
        else if( elem.classList.contains("post-status-flagged") )
            blackLink.style.color = "#F00";
        else if( elem.classList.contains("post-status-has-parent") )
            blackLink.style.color = "#CC0";
        else if( elem.classList.contains("post-status-has-children") )
            blackLink.style.color = "#0F0";
		
        for( let parent = image; parent != elem; parent = parent.parentNode )
            if( parent.href )
            {
                //Thumbnails are surrounded by links.  Hide those instead of the images themselves.
                image = parent;
                blackLink.href = image.href;

                //Comments have div.post-preview/div.preview/a/img
                elem = image.parentNode;
                elem.style.textAlign = "center";
                break;
            }
        
		var showNotes = true;
		if( elem == imageContainer )
        {
            for( let note of elem.getElementsByClassName("note-box") )
                note.style.display = "none";
        }
        image.style.display = "none";
		
		elem.insertBefore( blackLink, elem.firstChild );
		
		blackLink.addEventListener( "click", function(e) { if( !e.ctrlKey ) e.preventDefault(); }, false );
		elem.addEventListener( "click", function(e)
		{
			if( e.ctrlKey ) return;
			e.preventDefault();

			//Swap styles
			let oldImageStyle = image.style.display || "none";
			image.style.display = blackLink.style.display || "block";
			blackLink.style.display = oldImageStyle;
			
			if( elem == imageContainer )
            {
                let display = ( image.style.display == "none" || (showNotes = !showNotes) ? "none" : "block" );
                for( let note of imageContainer.getElementsByClassName("note-box") )
                    note.style.display = display;
            }
		}, true );
	}
}


/**
	Sets all times to the "X units ago" form with custom precision.
 */
function precisionTime(precision)
{
	if( recursion )
		return;
	
	MS_observeInserts( function(e)
	{
		if( e && !e.target.getElementsByTagName )
			return;
		
		var timeNodes = ( e ? e.target : document ).querySelectorAll("time[title]");
		for( let i = 0; i < timeNodes.length; i++ )
		{
			//<time datetime="2013-02-26T22:16-05:00" title="2013-02-26 22:16:25 -0500">2013-02-26 22:16</time>
			var unit = "", title = timeNodes[i].getAttribute("title").split(" ");
			var duration = ( Date.now() - new Date(title[0]+'T'+title[1]+title[2]) ) / 1000;
			//new Date(timeNodes[i].getAttribute("datetime")).getTime() - 1000*parseInt( (timeNodes[i].getAttribute("title") || "0 0:0:0").split(/[\s:]+/,4)[3], 10 );
			
			if( duration < 60 )
				unit = "second";
			else if( (duration /= 60) < 60 )
				unit = "minute";
			else if( (duration /= 60) < 24 )
				unit = "hour";
			else if( (duration /= 24) < 30.4375 )
				unit = "day";
			else if( (duration /= 30.4375) < 12 )
				unit = "month";
			else if( (duration /= 12) > 0 )
				unit = "year";
			else continue;//Parsing error
			
			if( precision > 0 && unit != "second" )
				timeNodes[i].textContent = duration.toFixed(precision)+" "+unit+"s ago";
			else
			{
				duration = ( duration <= 0 ? "0" : duration.toFixed(0) );
				timeNodes[i].textContent = duration+" "+unit+( duration == "1" ? " ago" : "s ago" );
			}
		}
	})();
}


/**
	Adds a pseudo-tag subscription to your profile.
	
	title:           Title of tag subscription; must be unique
	useTimestamp:    If true, append a timestamp to the title with each refresh
	refreshInterval: Hours to wait before refreshing the subscription
	maxThumbs:       Number of thumbnails to display
	maxExpanded:	 Number of thumbnails to display when the >> link is clicked
	isIntersect:     If true, find posts that contained in all the queries.  Otherwise, find posts in any query.
	queryList		 [ { search:"", pages# }, ... ]
	
	If isIntersect is true, posts will be in the order of the final query.
	Otherwise, posts are sorted by descending ID.
	
	The subscription title points to a tag search using the tags passed to the first query.
    
	When the subscription refreshes, all queries will be rerun with every page load until all
	have completed on the same page.
 */
function addTagSubscription( title, useTimestamp, refreshInterval, maxThumbs, maxExpanded, isIntersect, queryList )
{
	//Validate arguments
	if( recursion || !login )
		return;
	if( title instanceof Array )
	{
		for( let i = 0; i < title.length; i++ )
			addTagSubscription( title[i].title, title[i].timestamp, title[i].refresh, title[i].thumbs, title[i].maxExpanded, title[i].intersect, title[i].queries );
		return;
	}
	
	var varPrefix = "addTagSubscription."+title;
	var loadingMessage = false, subDiv = false;
	var queryString = queryList[0].search.replace(/,/g, ',\u200B');
	for( let i = 1; i < queryList.length; i++ )
		queryString += '\n***'+( isIntersect ? 'AND' : 'OR' )+'***\n'+queryList[i].search.replace(/,/g, ',\u200B');
	
	//Add the DIV to contain the thumbs to your own user page and append the thumbs if they already exist
	var userStats = document.getElementsByClassName("user-statistics")[0];
	var userContent = userStats && document.getElementById("a-show");
	if( userContent && ( location.pathname == "/users/"+loginID || location.pathname == "/profile" || userContent.getElementsByTagName("h1")[0].textContent == login ) )
	{
		subDiv = createElementX({ tag: "div", class:"box", id: varPrefix+"_thumbList" });
		
		var thumbList = MS_getValue( varPrefix+"_thumbList" );
		if( thumbList )
		{
			subDiv.innerHTML = thumbList;
			addExpandLink(subDiv);
		}
		else
		{
			subDiv.appendChildX({ tag:"h2", title:JSON.stringify(queryList) }).appendChildX({ tag:"a", href:"/posts?tags="+queryList[0].search.replace(/ +/,'+'), text:title });
			if( MS_getValue( varPrefix+"_lock" ) )
				MS_setValue( varPrefix+"_lock", true, 30 );
		}
		
		userContent.appendChild(subDiv);
		
		var subStat = document.evaluate(".//th[text()='Subscriptions']/../td", userStats, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
		if( !subStat )
		{
			var newStat = userStats.getElementsByTagName("tbody")[0].appendChild( createElementX({tag:"tr"}) );
			newStat.appendChildX({ tag:"th", text:"Subscriptions" });
			subStat = newStat.appendChildX({tag:"td"});
		}
		
		var para = createElementX({tag:"p"});
		var allTags = [];
		para.appendChildX([ { "tag":"strong", "text":title, "title":queryString }, " - " ]);
		for( let i = 0; i < queryList.length; i++ )
		{
			var tags = queryList[i].search.split(" ");
			for( var j = 0; j < tags.length; j++ )
			{
				if( tags[j][0] == '-' )//Don't list negated tags
					continue;
				
				tags[j] = tags[j].replace( /^(-|~)/, '' );
				
				if( allTags.indexOf( tags[j] ) >= 0 )
					continue;
				allTags.push( tags[j] );
				
				if( i > 0 || j > 0 )
					para.appendChildX(", ");
				para.appendChildX({ tag:"a", href:"/posts?tags="+encodeURIComponent(tags[j]), text:tags[j].replace(/_+/g, ' ').replace(/,/g, ',\u200B') });
			}
		}
		
		subStat.appendChild(para);
	}
	
	//If query string has changed since the last update, force another update.  Change the #. prefix to force a refresh.
	if( "0."+JSON.stringify(queryList) != MS_getValue( varPrefix+"_lastQueries", "" ) )
	{
		MS_deleteValue( varPrefix+"_lastUpdate" );
		MS_setValue( varPrefix+"_lastQueries", "0."+JSON.stringify(queryList), 7*24*3600 );
	}
	
	if( MS_getValue( varPrefix+"_lock" ) || MS_getValue( varPrefix+"_lastUpdate", 0 ) + refreshInterval * 3600 * 1000 > new Date().getTime() )
		return;
	
	if( subDiv )
		subDiv.getElementsByTagName("h2")[0].appendChild(document.createElement("span")).textContent = " [Loading...]";
	
	var postResults = [], currentResults = [];
	runQuery(0, 1);
	
	function runQuery( argIndex, page )
	{
		//Set 10 second lock every time a query runs, to prevent concurrent queries
		MS_setValue( varPrefix+"_lock", true, 10 );
		
		if( argIndex >= queryList.length )
			return subBuildThumbs();//No more arguments, start building
		
		if( page == 1 )
			currentResults = [];//First page, no results yet
		if( page > queryList[argIndex].pages )
		{
			//No more pages.

			if( argIndex == 0 || !isIntersect )
				postResults = postResults.concat( currentResults );
			else
			{
				//Find the intersection between the previous queries and this one, using the order of this one.
				var oldPostResults = postResults;
				postResults = [];
				
				for( let i = 0; i < currentResults.length; i++ )
				{
					for( let j = 0; j < oldPostResults.length; j++ )
						if( oldPostResults[j]["id"] == currentResults[i]["id"] )
						{
							postResults.push( oldPostResults[j] );
							break;
						}
				}
				if( postResults.length == 0 )
					argIndex = queryList.length;//Intersection with empty set :(
			}
			return runQuery( argIndex + 1, 1 );
		}

		//Fetch next page
		MS_requestAPI( "/posts.json?tags="+encodeURIComponent(queryList[argIndex].search)+"&page="+page, function(responseDetails)
		{
			var result;
			try { result = MS_parseJSON(responseDetails.responseText); }
			catch(e) { return runQuery( argIndex, page ); }
			
			currentResults = currentResults.concat( result );
			
			//Go to next page if less than the maximum amount was returned, or if we have enough thumbs already
			if( result.length < 100 || ( queryList.length == 1 && currentResults.length > maxThumbs && currentResults.length > maxExpanded ) )
				page = 9999;
			
			//Get next page
			runQuery( argIndex, page + 1 );
		});
	}
	
	function subBuildThumbs()
	{
		//Sort union subscriptions by decreasing post ID
		if( !isIntersect && queryList.length > 1 )
			postResults.sort( function(a,b) { return( b["id"] - a["id"] ); } );
		
		//Remove duplicates
		for( let i = 1; i < postResults.length; i++ )
		{
			for( var j = i - 1; j >= 0; j-- )
				if( postResults[j].id == postResults[i].id )
				{
					//An earlier post already has this ID, so remove this post
					postResults.splice( i--, 1 );
					break;
				}
		}
		
		if( postResults.length > 0 && !postResults[0].id )
		{
			if( postResults[0].success === false && postResults[0].message )
				throw "Unable to build thumbnails; post result returned '"+postResults[0].message+"'";
			return;
		}
		
		if( subDiv )
			subDiv.innerHTML = "";//Remove the old title that may have been added at the start
		else
			subDiv = createElementX({ tag:"div" });//Dummy DIV, only its contents are used
		
		function zeroIt(a) { return( a < 10 ? "0"+a : a ); }
		var tdate = new Date();
		var timestamp = " ("+(tdate.getMonth()+1)+"-"+zeroIt(tdate.getDate())+" "+zeroIt(tdate.getHours())+":"+zeroIt(tdate.getMinutes())+")";

		subDiv.appendChildX({ tag:"h2", title:timestamp+'\n\n'+queryString }).appendChildX([ { tag:"a", href:"/posts?tags="+queryList[0].search.replace(/ +/,'+'), text:title }, ( useTimestamp ? timestamp : "" ) ]);
		subDiv.appendChildX({ tag:"div", class:"post-gallery post-gallery-grid post-gallery-180" }).appendChildX({ tag:"div", class:"posts-container" }).appendChild( buildThumbs( postResults, maxThumbs ) );
		
		MS_setValue( varPrefix+"_thumbList", subDiv.innerHTML, 7*24*3600 );
		//MS_setValue( varPrefix+"_lock", true, refreshInterval * 3600 );
		MS_setValue( varPrefix+"_lastUpdate", tdate.getTime(), 7*24*3600 );
		
		if( maxExpanded > maxThumbs )
		{
			postResults = postResults.slice( 0, maxExpanded );
			MS_setValue( varPrefix+"_JSON", postResults, 7*24*3600 );
		}
		
		addExpandLink(subDiv);
	}
	
	function addExpandLink(outerDiv)
	{
		var json = maxExpanded > 0 && MS_getValue( varPrefix+"_JSON" );
		var head = json && json.length > maxThumbs && outerDiv.getElementsByTagName("h2")[0];
		if( !head ) return;
		
		json.splice( 0, maxThumbs );
		
		var linkShow = head.appendChild( createElementX({ tag:"a", href:"#", onclick:"return false;", text:" \u00BB", style:"display:inline" }) );//»
		var linkHide = head.appendChild( createElementX({ tag:"a", href:"#", onclick:"return false;", text:" \u00AB", style:"display:none" }) );//«
		var spanMore = outerDiv.appendChild( createElementX({ tag:"span", style:"display:none" }) );
		
		linkShow.addEventListener( "click", function()
		{
			if( spanMore.innerHTML == "" )
				spanMore.appendChildX({ tag:"div", class:"post-gallery post-gallery-grid post-gallery-180" }).appendChildX({ tag:"div", class:"posts-container" }).appendChild( buildThumbs( json, maxExpanded ) );
			linkShow.style.display = "none";
			linkHide.style.display = "inline";
			spanMore.style.display = "inline";
		}, true );
		
		linkHide.addEventListener( "click", function()
		{
			linkShow.style.display = "inline";
			linkHide.style.display = "none";
			spanMore.style.display = "none";
		}, true );
	}
}


/**
	Replaces text in DText (http://danbooru.donmai.us/help/dtext) textareas as it is being input,
	as well as the names of all links.
	
	Only the first match will be used for a given input/link.
	
	replaceList: An array of objects with the following properties (regex and at least one of the others):
		regex: Regex to match against
		text: Replacement for textareas
		link: Replacement for link names
 */
function dtextReplace( replaceList )
{
	var list = content && !recursion && ( replaceList instanceof Array ) && replaceList;
	if( !list ) return;

	for( let i = 0; i < replaceList.length; i++ )
		replaceList[i].regex = new RegExp( replaceList[i].regex );
	
	MS_observeInserts( subReplace )();
	////////////////
	function subReplace(e)
	{
		if( e && !e.target.getElementsByTagName )
			return;
		
		var textList = ( e ? e.target : document ).getElementsByTagName("textarea");
		var linkList = ( e ? e.target : document ).getElementsByTagName("a");
		
		for( let i = 0; i < textList.length; i++ )
			if( !/(artist_url_string|post_tag_string)/.test(textList[i].id) )
				textList[i].addEventListener( "input", function()
				{
					for( let i = 0; i < list.length; i++ )
					{
						if( list[i].text && list[i].regex.test(this.value) )
						{
							this.value = this.value.replace( list[i].regex, list[i].text );
							break;
						}
					}
				}, false );
		for( let i = 0; i < linkList.length; i++ )
			for( let j = 0; j < list.length; j++ )
				if( list[j].link && list[j].regex.test(linkList[i].textContent) )
				{
					linkList[i].textContent = linkList[i].textContent.replace( list[j].regex, list[j].link );
					break;
				}
	}
}


/**
	Hides posts and comments in the comment listing for posts with any of the specified tags.  Click the replacement text to reveal.
 */
function commentListingFilter(tagList)
{
	if( !recursion && tagList.length ) MS_observeInserts( function(e)
	{
		for( let k = 0; k < tagList.length; k++ )
		{
			let unwantedLinks = ( e ? e.target : document ).querySelectorAll(".post-preview .comments-for-post .list-of-tags span a[href$='="+encodeURIComponent(tagList[k].toLowerCase().replace(/ +/g,'_')).replace(/[!'()*]/g, function(c) { return '%'+c.charCodeAt(0).toString(16); })+"']");
			for( let i = 0; i < unwantedLinks.length; i++ )
			{
				//Get container element for thumbnail+comments
				let mainCom = unwantedLinks[i].parentNode;
				while( !(mainCom = mainCom.parentNode).classList.contains("post-preview") );
				
				//If this comment block has already been hidden, just append this tag to the Hidden tag list for that block
				let hideList = mainCom.getElementsByClassName("hideList")[0];
				if( hideList )
				{
					if( !hideList.querySelector('a[href="'+unwantedLinks[i].href+'"]') )
					{
						hideList.appendChildX(", ");
						hideList.appendChildX({ tag:"span", class:unwantedLinks[i].parentNode.className })
							.appendChildX({ tag: "a", href:unwantedLinks[i].href, onclick:"return false;", text:tagList[k] });
					}
					continue;
				}
				
				//Hidden: [tags to hide]
				let hideBlock = mainCom.insertBefore( createElementX({tag:"blockquote", class:"inline-tag-list"}), mainCom.firstChild );
				hideBlock.appendChildX("Hidden (");
				hideBlock.appendChildX({ tag:"span", class:"hideList" })
					.appendChildX({ tag:"span", class:unwantedLinks[i].parentNode.className })
					.appendChildX({ tag: "a", href:unwantedLinks[i].href, onclick:"return false;", text:tagList[k] });
				hideBlock.appendChildX(")");
                
				//If the post has copyright tags, append them to the blockquote
				let copyTags = mainCom.querySelector(".list-of-tags .copyright-tag-list");
                if( copyTags )
					hideBlock.appendChild( createElementX([ ": ", copyTags.cloneNode(true) ]) );
				
				let thumb = mainCom.getElementsByClassName("preview")[0];
				let comments = mainCom.getElementsByClassName("comments-for-post")[0];
				
				hideBlock.addEventListener( "click", (function(link,prev,coms){ return function(){ link.style.display = "none"; prev.style.display = coms.style.display = ""; }; })( hideBlock, thumb, comments ) );
				thumb.style.display = "none";
				comments.style.display = "none";
			}
		}
	} )();
}


/*
  Tweaks the post queue page.  Vote links are always added.

  badTags: Highlight (in red) posts containing any of these tags.  The tags themselves are styled in bold/underline.
  disapproveTags: Reject ("No Interest") posts containing any of these tags.
  swapKey: Swap (with a larger size) the first thumbnail whose top is within the viewing pane.
  swapClick: Swap thumbnails when left-clicked.
  autoVote: Automatic up/down vote when approval/disapproval links are clicked (except 'No Interest')
  limit: Number of entries per page, applied to all modqueue links.
  moveButtons: Move buttons to above the tag lists
*/
function postQueueTweaks( badTags, disapproveTags, swapKey, swapClick, autoVote, limit, moveButtons )
{
    if( limit > 0 )
    {
        // Add limit=# to all /modqueue links
        
        for( let link of document.querySelectorAll('a[href*="/modqueue"]') )
            if( link.href.indexOf("limit=") < 0 )
                link.href += ( link.href.indexOf("?") < 0 ? "?" : "&" ) + "limit=" + ( limit > 200 && link.href.indexOf("mode=list") < 0 ? 200 : limit );
    }
    
    if( autoVote )
    {
        //Vote up for approvals, down for rejection/deletion (except "Skip"/"No interest")
        
        let linkDisapproval = document.body.querySelectorAll("a[href*='/post_disapprovals'], a.detailed-rejection-link, a[data-method='delete'][href*='/posts/']");
        if( linkDisapproval.length == 0 )
            return;
        let linkApprovals = document.body.querySelectorAll("a[href*='/post_approvals?']");//Doesn't exist for your own uploads
        
        let voteLink = document.body.appendChild( createElementX({ tag:"a", style:"display:none", "data-remote":"true", rel:"nofollow", "data-method":"post" }) );
        function voteMe(link, inc)
        {
            voteLink.href = "/posts/"+( /^.posts.(\d+)/.exec( location.pathname ) || (/post_id=(\d+)/.exec( link.parentNode.querySelector("a[href*='post_id=']").href )) )[1]+"/votes?score="+inc;
            voteLink.click();
        }
        
        for( let link of linkApprovals )
            link.addEventListener( "click", function(){ voteMe(link,+1); } );
        for( let link of linkDisapproval )
            if( link.href.indexOf("disinterest") < 0 )
                link.addEventListener( "click", function(){ voteMe(link,-1); } );
    }
    
    let queueItems = location.pathname.indexOf("/modqueue") == 0 && Array.from( document.body.querySelectorAll( ( location.search.indexOf("mode=list") >= 0 ? "div" : "article" ) + ".mod-queue-preview" ) );
    if( !queueItems || !queueItems.length )
        return;

    // Immediately hide post when approve/disapprove button clicked (but not the detailed rejection)
    for( let item of queueItems )
        for( let link of item.querySelectorAll("a[href*='/post_approvals?'], a[href*='/post_disapprovals']") )//, a.detailed-rejection-link
            link.addEventListener( "click", function(){ item.style.display = "none"; } );
    
    //Hide posts matching any of the disapproveTags and schedule their disapproval
    if( disapproveTags.length > 0 )
    {
        let clickLinks = [];
        
        for( let i = 0; i < queueItems.length; i++ )
        {
            for( let tag of ( queueItems[i].getAttribute("data-tags") || "" ).split(" ") )
            {
                if( disapproveTags.indexOf( tag ) >= 0 )
                {
                    let link = queueItems[i].querySelector("a[href*='/post_disapprovals'][href*=disinterest]");
                    if( link )
                        clickLinks.push( link );
                    queueItems[i].style.display = "none";
                    queueItems.splice( i--, 1 );
                    break;
                }
            }
        }
        
        //Disapprove with delay
        let hiddenBlock = clickLinks.length > 0 && document.body.appendChild( createElementX({ tag:"div", style:"display:none" }) );
        function disapproveChain()
        {
            let link = clickLinks.pop();
            if( link )
            {
                hiddenBlock.appendChild(link);//Move to hidden block to avoid scrollbar flickering
                link.click();
                setTimeout( disapproveChain, 400 );
            }
        }
        disapproveChain();
    }
    
    //Remainder only applicable to "list" mode
    if( location.search.indexOf("mode=list") < 0 )
        return;
    
    //Use mode=list for search results
    let searchForm = document.querySelector("form[action] > div.search_tags")?.parentNode;
    if( searchForm )
        searchForm.appendChild( createElementX({ tag:"input", type:"hidden", name:"mode", value:"list" }) );
    
    //Sub-function to enlarge queue thumbnails
    function swapImage(post)
    {
        //First "picture" is the original thumbnail; the second is the "large" size added below this function
        let media = post.getElementsByTagName("picture");
        if( !media || media.length != 2 )
            return;
        
        if( !media[1].firstChild.src )
        {
            //large image hasn't been loaded yet; query again.
            let art = post.getElementsByTagName("article");
            if( art ) MS_usingArticles( [ art ], function()
            {
                let url = media[1].firstChild.src = art.getAttribute("data-720x720");
                if( url )
                    swapImage(swapDiv);
            } );
            return;
        }
        
        media[0].style.display = media[1].style.display;
        media[1].style.display = ( media[1].style.display == "none" ? "block" : "none" );
    }
    
    let artSwaps = [];
    for( let post of queueItems )
    {
        //If this post has any 'bad' tags, bold/highlight them and shade the background red
        if( badTags.length > 0 )
        {
            for( let tagLink of post.querySelectorAll("a.search-tag") )
                if( badTags.indexOf( tagLink.textContent ) >= 0 )
                {
                    post.style.background = "rgb(255, 230, 230)";//same as 'post-neg-score'
                    tagLink.style.fontWeight = "bold";
                    tagLink.textDecoration = "underline";
                }
        }
        
        if( moveButtons )
        {
            //Move buttons from under thumbnail to above tags/etc...
            let modButtons = post.querySelector("div > a[href*='/post_approvals?']")?.parentNode;
            modButtons.classList.remove("justify-center");
            modButtons.style.marginBottom = "5px";
            let textArea = post.querySelector("div.space-x-4")?.parentNode;
            textArea.insertBefore( modButtons, textArea.firstChild );
            
            //Split the Reject links into separate buttons
            let inverseLabels = post.querySelectorAll("div > span.text-inverse");
            if( inverseLabels && inverseLabels[0] )
                inverseLabels[0].parentNode.style.display = "none";
            modButtons.getElementsByTagName("div")[0].style.display = "none";
            for( let link of modButtons.querySelectorAll("li > a") )
            {
                link.className += " popup-menu-button button-outline-danger button-xs align-top";
                for( let label of inverseLabels )
                    if( label.textContent.toUpperCase().indexOf( link.textContent.toUpperCase() ) >= 0 )
                        link.textContent = label.textContent;
                modButtons.appendChild( link );
            }
        }
        
        if( swapClick || swapKey )
        {
            //Add hidden IMG with the sample size
            let art = post.getElementsByTagName("article")[0];
            let previewLink = post.querySelector("a.post-preview-link");
            let largeURL = art.getAttribute("data-720x720");
            let largePic = previewLink.appendChild( createElementX({ tag:"picture", style:"display:none" }) ).appendChildX({ tag:"img", style:"max-height:850px" });
            
            if( largeURL )
                largePic.src = largeURL;
            else
                artSwaps.push(art);
            
            if( swapClick )
                previewLink.onclick = function() { swapImage( post ); return false; };
        }
    }
    
    // Load "data-720x720" and "source"
    MS_usingArticles( artSwaps, function(art)
    {
        //Add a "Source" line
        let sourceLine = createElementX({ tag:"span", style:"overflow-wrap: anywhere" });
        sourceLine.appendChildX( { tag:"strong", text:"Source" }, " " );
        let source = art.getAttribute("source");
        if( source.indexOf("http") != 0 )
            sourceLine.appendChildX( source );
        else
            sourceLine.appendChildX( { tag:"a", text:source, href:( art.querySelector("a[rel*='external'][href]")?.href || source ) } );
        let afterRow = art.parentNode.parentNode.querySelector("div.space-x-4").nextSibling;
        afterRow.parentNode.insertBefore( sourceLine, afterRow );
        
        //Add the large image URL used for swapping
        if( artSwaps.length )
            art.querySelectorAll(".post-preview-link picture img")[1].src = art.getAttribute("data-720x720");
    } );
    
    //Press a key to expand the thumbnail whose row is closest to the top without going over.
	if( swapKey ) window.addEventListener( "keydown", function(key)
	{
        //Don't trigger if Alt/Ctrl/Meta are also being pressed, or if a text field has focus.
		if( key.key.toLowerCase() != swapKey.toLowerCase() || key.altKey || key.ctrlKey || key.metaKey || document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA" )
			return;

        let i = 0, j = 0;

        //Collect the queue elements that are still visible and have a 'large' size
        let shownQueue = []
        for( let item of queueItems )
            if( item.style.display != "none" && ( item.getBoundingClientRect().top || item.getBoundingClientRect().bottom ) )
                shownQueue.push( item );

        //Find first post whose top is isn't above the current window
        for( i = 0; i < shownQueue.length - 1 && shownQueue[i].getBoundingClientRect().top <= 0; i++ );

        if( i + 1 == shownQueue.length || shownQueue[shownQueue.length - 1].getBoundingClientRect().bottom > window.innerHeight )
        {
            //The bottom of the last post is outside the window, only swap the post found above.
            swapImage( shownQueue[i] );
        }
        else for( j = i; j < shownQueue.length; j++ )
        {
            //The bottom of the last post is inside the window; swap them all
            swapImage( shownQueue[j] );
        }
	} );
}


//=====================================================================================
//=============================== HELPER FUNCTIONS ====================================
//=====================================================================================


function nbsp(count)
{
	var result = "";
	while( count-- > 0 )
		result += "\u00a0";
	return result;
}

function createElementX(obj)
{
	if( arguments.length > 1 || (arguments = obj) instanceof Array )
	{
		var fragment = createElementX(document.createDocumentFragment());
		for( let i = 0; i < arguments.length; i++ )
			fragment.appendChildX( arguments[i] );
		return fragment;
	}
	
	if( obj instanceof Element || obj instanceof DocumentFragment )
	{
		obj.appendChildX = function() { return obj.appendChild( createElementX.apply(this,arguments) ); }
		return obj;
	}
	else if( typeof(obj) == "string" )
		return document.createTextNode(obj);
	else if( !obj.tag )
	{
		if( obj.childNodes )
			return obj;
		if( elem in obj )
			return document.createTextNode(""+obj);
		return createElementX([]);// {}
	}
	
	var elem = document.createElement(obj.tag);
	for( var key in obj )
	{
		if( key == "text" || key == "textContent" )
			elem.textContent = obj[key];
		else if( key == "innerHTML" )
			elem.innerHTML = obj[key];
		else if( key != "tag" )
			elem.setAttribute(key, obj[key]);
	}
	return createElementX(elem);
}


function MS_setValue( key, value, expires, memObj )
{
	//If 0 or less, value never expires
	if( expires > 0 )
		expires = Math.floor( new Date().getTime()/1000 + expires );
	else
		expires = 0;
	
	var i, keyList = [];
	
	if( !memObj )
	{
		GM_setValue( key, JSON.stringify({ "value": value, "expires": expires }) );
		try{ keyList = MS_parseJSON( GM_getValue( "Miscellaneous.keyList" ) ) || []; }
		catch(err){ keyList = []; }
	}
	else
	{
		keyList = memObj.keyList = MS_parseJSON( memObj.keyList ) || [];
		memObj[key] = { "value": value, "expires": expires };
		MS_setMemObj( memObj, "MS_setValue" );
	}
	
	if( !(keyList instanceof Array) )
		throw "MS_setValue(): Invalid keyList ("+typeof(keyList)+"): "+keyList;
	
	//Find insertion point, deleting duplicates along the way
	for( i = 0; i < keyList.length && keyList[i].expires <= expires; i++ )
		if( keyList[i].key == key )
			keyList.splice( i--, 1 );
	keyList.splice( i, 0, { "key":key, "expires":expires });
	
	if( !memObj )
		GM_setValue( "Miscellaneous.keyList", JSON.stringify(keyList) );
}

function MS_getValue( key, defaultValue, memObj )
{
	if( !memObj && typeof(defaultValue) == "object" && defaultValue.saveName )
	{
		memObj = defaultValue;
		defaultValue = null;
	}
	if( memObj )
	{
		if( !memObj[key] || ( memObj[key].expires > 0 && memObj[key].expires < new Date().getTime()/1000 ) )
			return defaultValue;
		return memObj[key].value;
	}
	
	var value = GM_getValue( key );
	
	if( !value )
		return defaultValue;
	
	try{ value = MS_parseJSON( value ); }
	catch(e) { return defaultValue; }
	
	if( value.expires > 0 && value.expires < new Date().getTime()/1000 )
		return defaultValue;
	
	return value["value"];
}

function MS_deleteValue( key, memObj )
{
	var keyList;
	if( memObj )
		keyList = memObj.keyList = MS_parseJSON( memObj.keyList ) || [];
	else
	{
		try{ keyList = MS_parseJSON( GM_getValue( "Miscellaneous.keyList" ) ) || []; }
		catch(err){ keyList = []; }
	}
	
	if( !(keyList instanceof Array) )
		throw "MS_deleteValue(): Invalid keyList ("+typeof(keyList)+"): "+keyList;
	
	var now = new Date().getTime()/1000;
	
	for( let i = keyList.length - 1; i >= 0; i-- )
		if( keyList[i].key == key )
		{
			keyList.splice(i,1);
			
			if( !memObj )
			{
				GM_deleteValue( key );
				GM_setValue( "Miscellaneous.keyList", JSON.stringify(keyList) );
			}
			else
			{
				delete memObj[key];
				MS_setMemObj( memObj, "MS_deleteValue" );
			}
		}
}

function MS_clearValues(num, memObj)
{
	if( num <= 0 )
		return;
	
	var keyList;
	if( memObj )
		keyList = memObj.keyList = MS_parseJSON( memObj.keyList ) || [];
	else
	{
		try{ keyList = MS_parseJSON( GM_getValue( "Miscellaneous.keyList" ) ) || []; }
		catch(err){ keyList = []; }
	}
	var now = new Date().getTime()/1000;
	var oldLen = keyList.length;
	
	for( let i = 0; num > 0 && i < keyList.length && keyList[i].expires < now; i++ )
		if( keyList[i].expires > 0 )
		{
			num--;
			GM_deleteValue( keyList.splice( i--, 1 )[0].key );
		}
	
	if( oldLen != keyList.length && !memObj )
		GM_setValue( "Miscellaneous.keyList", JSON.stringify(keyList) );
} MS_clearValues(1);

function MS_setMemObj(obj,func)
{
	if( obj._timer != null )
		clearTimeout( obj._timer );
	obj._timer = setTimeout( function()
	{
		delete obj._timer;
		MS_clearValues( 20, obj );
		MS_setValue( obj.saveName, obj, obj.expires );
	}, 1500 );
}

function MS_parseJSON(text,count)
{
	if( !count )
		count = 1;
	else if( ++count > 20 )
	{
		MS_alert( "Dug too deep while parsing JSON: "+text );
		return text;
	}
	
	if( text instanceof Array )
	{
		//Parse all elements in arrays of strings
		for( let i = 0; i < text.length && typeof(text[i]) == "string"; i++ )
			if( isNaN( Number(text[i]) ) )
			{
				try{ text[i] = MS_parseJSON( text[i], count ); }
				catch(err){ throw "Bad JSON in text["+i+"]: "+text[i]; }
			}
		return text;
	}
	else if( typeof(text) == "string" ) return JSON.parse(text, function(key,val)
	{
		//Recursively parse strings that look like objects
		if( typeof(val) == "string" && isNaN( Number(val) ) )
		{
			try{ return MS_parseJSON( val, count ); }
			catch(err){}
		}
		return val;
	});
	//Not a string or array, so return unchanged
	return text;
}

function MS_alert( messageP )
{
	if( !showError )
		return;
	
	//First call: Create a hidden container for all alerts
	var dialog = document.body.appendChild( createElementX({ tag:"div", style:"position:fixed; left:10%; top:10%; z-index:10; background-color:white; display:none; width:20em; height:20em; border:2px solid black; padding:20px 20px 20px 20px; overflow:auto" }) );
	
	var header = dialog.appendChildX({ tag:"h4", text: "Miscellaneous Tweaks " });
	dialog.appendChildX({ tag:"hr" });
	var text = dialog.appendChildX({ tag:"div" });
	
	header.appendChildX({ tag:"input", type:"button", value:"Clear", title:"Clear all warnings and hide this alert." }).addEventListener( "click", function(){ dialog.style.display = "none"; text.innerHTML = ""; } );
	header.appendChildX(" ");
	header.appendChildX({ tag:"input", type:"button", value:"Hide", title:"Hide this alert without clearing its contents." }).addEventListener( "click", function(){ dialog.style.display = "none"; } );
	header.appendChildX(" ");
	header.appendChildX({ tag:"input", type:"button", value:"Stop", title:"Stop additional alerts from being triggered." }).addEventListener( "click", function(){ showError = false; } );
	
	//Replace this function with one to just append to the above container
	MS_alert = function(message)
	{
		if( showError )
		{
			text.appendChildX(""+message, { tag:"hr" });
			dialog.style.display = "block";
			dialog.style.width = "80%";
			dialog.style.height = "60%";
		}
	}
	
	//Call the alert again with the new function definition to actually display the first alert
	MS_alert(messageP);
}

function MS_observeInserts(funcP)
{
	if( !content || recursion )
		return funcP;
	
	//Listen to node insertions only under id=content node
	var funcList = [ ];
	function mutateManager(e)
	{
		for( let i = 0; i < funcList.length; i++ )
		{
			try{ funcList[i](e); }
			catch(err){ MS_alert("Tweaks - Insertion error - "+funcList[i].toString().replace(/\(.*/,'()')+": "+err); }
		}
	}
	
	var MutObj = window.MutationObserver || window.WebKitMutationObserver;
	if( !MutObj )
		content.addEventListener( "DOMNodeInserted", mutateManager, false );
	else
	{
		var monitor = new MutObj( function(mutationSet){
			mutationSet.forEach( function(mutation){
				for( let i = 0; i < mutation.addedNodes.length; i++ )
					if( mutation.addedNodes[i].nodeType == 1 )
						mutateManager({ "target":mutation.addedNodes[i] });
			});
		});
		monitor.observe( content, { childList:true, subtree:true } );
	}
	
	MS_observeInserts = function(func)
	{
		if( !content || recursion )
			return function(){};
		funcList.push( func );
		return func;
	};
	return MS_observeInserts(funcP);
}

/** Makes request to API link, e.g. "/posts.json". If "limit=" isn't included, limit=200 is added to the end. */
function MS_requestAPI( link, loadFun, errFun )
{
	GM_xmlhttpRequest(
	{
		method: "GET",
		url:location.protocol+"//"+location.host+link+( link.indexOf("limit=") < 0 ? ( link.indexOf("?") > 0 ? "&limit=200" : "?limit=200" ) : "" ),
		onload:loadFun,
		onerror:( errFun ? errFun : function(err){ MS_requestAPI( link, loadFun ); } )
	});
}

/** Helper method to construct a document fragment of thumbnails from post API results */
function buildThumbs(json, limit)
{
	var i, result = document.createDocumentFragment();
	if( limit <= 0 )
		return result;
	
	if( typeof(json) == "string" )
		try{ json = MS_parseJSON(json); } catch(e){ return result; }
	
	for( i = 0; limit-- > 0 && i < json.length; i++ )
	{
		if( !json[i].id )
			continue;//Connection problems?
		
		var borderColors = [], imgStyle = "", status = "post-preview post-preview-fit-compact post-preview-180", flag = "";

		if( json[i].has_active_children )
		{
			borderColors.push("#0F0");
			status += " post-status-has-children";
		}
		if( json[i].parent_id )
		{
			borderColors.push("#CC0");
			status += " post-status-has-parent";
		}
		
		if( json[i].is_deleted )
		{
			borderColors.push("#000");
			status += " post-status-deleted";
			flag = "deleted";
		}
		else if( json[i].is_pending )
		{
			borderColors.push("#00F");
			status += " post-status-pending";
			flag = "pending";
		}
		else if( json[i].is_flagged )
		{
			borderColors.push("#F00");
			status += " post-status-flagged";
			flag = "flagged";
		}
		
		if( borderColors.length > 1 )
		{
			//	app/assets/javascripts/posts.js
			imgStyle = "border-color: "
			if( borderColors.length == 3 )
				imgStyle += borderColors[0]+" "+borderColors[2]+" "+borderColors[2]+" "+borderColors[1];
			else
				imgStyle += borderColors[0]+" "+borderColors[1]+" "+borderColors[1]+" "+borderColors[0];
		}
		        
        let article = createElementX({ "tag":"article",
				"class":status,
				"id":"post_"+json[i].id,
				"data-id":json[i].id,
				"data-tags":json[i].tag_string,
				"data-uploader-id":json[i].uploader_id,
                "data-score":json[i].score,
				"data-flags":flag,//unused

                //Extra attributes, same as in MS_usingArticles():
				"fav_count":json[i].fav_count,
                "score":json[i].score,
                "source":json[i].source,
                "tag_string":json[i].tag_string,
                "uploader_id":json[i].uploader_id
        });
        
        for( let size of json[i]["media_asset"]["variants"] )
            if( size.type == "720x720" )
                article.setAttribute( "data-"+size.type, size.url );
        
		article.appendChildX({ tag:"div", class:"post-preview-container" })
            .appendChildX({ tag:"a", class:"post-preview-link", href:"/posts/"+json[i].id })
            .appendChildX({ tag:"picture" })
            .appendChildX({ tag:"img", class:"post-preview-image", src:json[i].preview_file_url, alt:json[i].tag_string, title:json[i].tag_string+" rating:"+json[i].rating+" score:"+json[i].score, style:imgStyle });
		result.appendChild(article);
	}
	return result;
}


/** Queries the post API for extra attributes, then passes the posts to the consumer function. */
function MS_usingArticles(artNodes,artConsumer)
{
    if( !artNodes || !artNodes.length )
        return;
    if( !Array.isArray(artNodes) )
        artNodes = Array.from(artNodes);
    
	//Array of extra post attributes used by this script, using the same names as the Post API
	const totalAttr = [ "score", "tag_string", "uploader_id", "fav_count", "source" ];
	
	//If the article has already been processed by this function or buildThumbs(), remove it from the array and pass it to the consumer.
	for( let i = artNodes.length - 1; i >= 0; i-- )
		if( !artNodes[i] || artNodes[i].hasAttribute( "data-720x720" ) || ( !artNodes[i].hasAttribute("data-id") && ( !artNodes[i].id || artNodes[i].id.indexOf("post_") != 0 ) ) )
            artConsumer( artNodes.splice( i, 1 )[0] );
    
	if( artNodes.length == 0 )
        return;
    
	//Break up article array into 200-size arrays (the largest limit)
	while( artNodes.length > 200 )
		MS_usingArticles( artNodes.splice( 0, 200 ), artConsumer );
	
	//Build query string
	let query = "/posts.json?only=id,media_asset,"+totalAttr.toString()+"&tags=status:any+id:";
	for( let art of artNodes )
    {
        if( !art.hasAttribute("data-id") )
            art.setAttribute("data-id", art.id.substring(5) );
		query += art.getAttribute("data-id")+",";
    }
	
	MS_requestAPI( query, function(responseDetails)
	{
		let results = MS_parseJSON(responseDetails.responseText);
		for( let art of artNodes )
		{
			let artID = art.getAttribute("data-id");
			for( let post of results )
				if( post["id"] == artID )
				{
					for( let attr of totalAttr )
						art.setAttribute( attr, post[attr] );
                    
                    for( let size of post["media_asset"]["variants"] )
                        if( size.type == "720x720" )
                        {
                            art.setAttribute( "data-"+size.type, size.url );
                            break;
                        }
                    
                    artConsumer(art);
					break;
				}
		}
	});
}
