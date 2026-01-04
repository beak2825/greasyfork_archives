// ==UserScript==
// @name Stack Exchange comment template context menu
// @namespace http://ostermiller.org/
// @version 1.17.0
// @description Adds a context menu (right click, long press, command click, etc) to comment boxes on Stack Exchange with customizable pre-written responses.
// @match https://*.stackexchange.com/questions/*
// @match https://*.stackexchange.com/review/*
// @match https://*.stackexchange.com/admin/*
// @match https://*.stackoverflow.com/*questions/*
// @match https://*.stackoverflow.com/review/*
// @match https://*.stackoverflow.com/admin/*
// @match https://*.askubuntu.com/questions/*
// @match https://*.askubuntu.com/review/*
// @match https://*.askubuntu.com/admin/*
// @match https://*.superuser.com/questions/*
// @match https://*.superuser.com/review/*
// @match https://*.superuser.com/admin/*
// @match https://*.serverfault.com/questions/*
// @match https://*.serverfault.com/review/*
// @match https://*.serverfault.com/admin/*
// @match https://*.mathoverflow.net/questions/*
// @match https://*.mathoverflow.net/review/*
// @match https://*.mathoverflow.net/admin/*
// @match https://*.stackapps.com/questions/*
// @match https://*.stackapps.com/review/*
// @match https://*.stackapps.com/admin/*
// @match https://*.stackoverflow.com/*staging-ground/*
// @connect raw.githubusercontent.com
// @connect *
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/433721/Stack%20Exchange%20comment%20template%20context%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/433721/Stack%20Exchange%20comment%20template%20context%20menu.meta.js
// ==/UserScript==
(function() {
	'use strict'

	// Access to JavaScript variables from the Stack Exchange site
	var $ = unsafeWindow.jQuery

	// eg. physics.stackexchange.com -> physics
	function validateSite(s){
		var m = /^((?:meta\.)?[a-z0-9]+(?:\.meta)?)\.?[a-z0-9\.]*$/.exec(s.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/,""))
		if (!m) return null
		return m[1]
	}

	function validateTag(s){
		return s.toLowerCase().trim().replace(/ +/g,"-")
	}

	// eg hello-world, hello-worlds, hello world, hello worlds, and hw all map to hello-world
	function makeFilterMap(s){
		var m = {}
		s=s.split(/,/)
		for (var i=0; i<s.length; i++){
			// original
			m[s[i]] = s[i]
			// plural
			m[s[i]+"s"] = s[i]
			// with spaces
			m[s[i].replace(/-/g," ")] = s[i]
			// plural with spaces
			m[s[i].replace(/-/g," ")+"s"] = s[i]
			// abbreviation
			m[s[i].replace(/([a-z])[a-z]+(-|$)/g,"$1")] = s[i]
		}
		return m
	}

	var userMapInput = "moderator,user"
	var userMap = makeFilterMap(userMapInput)
	function validateUser(s){
		return userMap[s.toLowerCase().trim()]
	}

	var typeMapInput = "question,answer,edit-question,edit-answer,close-question,flag-comment,flag-question,flag-answer,decline-flag,helpful-flag,decline-flag-very-low-quality,helpful-flag-very-low-quality,decline-flag-not-an-answer,helpful-flag-not-an-answer,decline-flag-auto,helpful-flag-auto,decline-flag-plagiarism,helpful-flag-plagiarism,decline-flag-gai,helpful-flag-gai,decline-flag-sock,helpful-flag-sock,decline-flag-migration,helpful-flag-migration,decline-flag-custom,helpful-flag-custom,reject-edit"
	var typeMap = makeFilterMap(typeMapInput)
	typeMap.c = 'close-question'
	typeMap.close = 'close-question'

	function loadComments(urls){
		loadCommentsRecursive([], urls.split(/[\r\n ]+/))
	}

	function loadCommentsRecursive(aComments, aUrls){
		if (!aUrls.length) {
			if (aComments.length){
				comments = aComments
				storeComments()
				if(GM_getValue(storageKeys.url)){
					GM_setValue(storageKeys.lastUpdate, Date.now())
				}
			}
			return
		}
		var url = aUrls.pop()
		if (!url){
			loadCommentsRecursive(aComments, aUrls)
			return
		}
		console.log("Loading comments from " + url)
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: function(r){
				var lComments = parseComments(r.responseText)
				if (!lComments || !lComments.length){
					alert("No comment templates loaded from " + url)
				} else {
					aComments = aComments.concat(lComments)
				}
				loadCommentsRecursive(aComments, aUrls)
			},
			onerror: function(){
				alert("Could not load comment templates from " + url)
				loadCommentsRecursive(aComments, aUrls)
			}
		})
	}

	function validateType(s){
		return typeMap[s.toLowerCase().trim()]
	}

	// Map of functions that clean up the filter-tags on comment templates
	var tagValidators = {
		tags: validateTag,
		sites: validateSite,
		users: validateUser,
		types: validateType
	}

	var attributeValidators = {
		socvr: trim
	}

	function trim(s){
		return s.trim()
	}

	// Given a filter tag name and an array of filter tag values,
	// clean up and canonicalize each of them
	// Put them into a hash set (map each to true) for performant lookups
	function validateAllTagValues(tag, arr){
		var ret = {}
		for (var i=0; i<arr.length; i++){
			// look up the validation function for the filter tag type and call it
			var v = tagValidators[tag](arr[i])
			// Put it in the hash set
			if (v) ret[v]=1
		}
		if (Object.keys(ret).length) return ret
		return null
	}

	function validateValues(tag, value){
			if (tag in tagValidators) return validateAllTagValues(tag, value.split(/,/))
			if (tag in attributeValidators) return attributeValidators[tag](value)
			return null
	}

	// List of keys used for storage, centralized for multiple usages
	var storageKeys = {
		comments: "ctcm-comments",
		url: "ctcm-url",
		lastUpdate: "ctcm-last-update"
	}

	// On-load, parse comment templates from local storage
	var comments = parseComments(GM_getValue(storageKeys.comments))
	// The download comment templates from URL if configured
	if(GM_getValue(storageKeys.url)){
		loadStorageUrlComments()
	} else if (!comments || !comments.length){
		// If there are NO comments, fetch the defaults
		loadComments("https://raw.githubusercontent.com/stephenostermiller/stack-exchange-comment-templates/master/default-templates.txt")
	}

	function hasCommentWarn(){
		return checkCommentLengths().length > 0
	}

	function commentWarnHtml(){
		var problems = checkCommentLengths()
		if (!problems.length) return $('<span>')
		var s = $("<ul>")
		for (var i=0; i<problems.length; i++){
			s.append($('<li>').text("⚠️ " + problems[i]))
		}
		return $('<div>').append($('<h3>').text("Problems")).append(s)
	}

	function checkCommentLengths(){
		var problems = []
		for (var i=0; i<comments.length; i++){
			var c = comments[i]
			var length = c.comment.length;
			if (length > 600){
				problems.push("Comment template is too long (" + length + "/600): " + c.title)
			} else if (length > 500 && (!c.types || c.types['flag-question'] || c.types['flag-answer'])){
				problems.push("Comment template is too long for flagging posts (" + length + "/500): " + c.title)
			} else if (length > 300 && (!c.types || c.types['edit-question'] || c.types['edit-answer'])){
				problems.push("Comment template is too long for an edit (" + length + "/300): " + c.title)
			} else if (length > 200 && (!c.types || c.types['decline-flag'] || c.types['helpful-flag'])){
				problems.push("Comment template is too long for flag handling (" + length + "/200): " + c.title)
			} else if (length > 200 && (!c.types || c.types['flag-comment'])){
				problems.push("Comment template is too long for flagging comments (" + length + "/200): " + c.title)
			}
		}
		return problems
	}

	// Serialize the comment templates into local storage
	function storeComments(){
		if (!comments || !comments.length) GM_deleteValue(storageKeys.comments)
		else GM_setValue(storageKeys.comments, exportComments())
	}

	function parseJsonpComments(s){
		var cs = []
		var callback = function(o){
			for (var i=0; i<o.length; i++){
				var c = {
					title: o[i].name,
					comment: o[i].description
				}
				var m = /^(?:\[([A-Z,]+)\])\s*(.*)$/.exec(c.title);
				if (m){
					c.title=m[2]
					c.types=validateValues("types",m[1])
				}
				if (c && c.title && c.comment) cs.push(c)
			}
		}
		eval(s)
		return cs
	}

	function parseComments(s){
		if (!s) return []
		if (s.startsWith("callback(")) return parseJsonpComments(s)
		var lines = s.split(/\n|\r|\r\n/)
		var c, m, cs = []
		for (var i=0; i<lines.length; i++){
			var line = lines[i].trim()
			if (!line){
				// Blank line indicates end of comment
				if (c && c.title && c.comment) cs.push(c)
				c=null
			} else {
				// Comment template title
				// Starts with #
				// May contain type filter tag abbreviations (for compat with SE-AutoReviewComments)
				// eg # Comment title
				// eg ### [Q,A] Comment title
				m = /^#+\s*(?:\[([A-Z,]+)\])?\s*(.*)$/.exec(line);
				if (m){
					// Stash previous comment if it wasn't already ended by a new line
					if (c && c.title && c.comment) cs.push(c)
					// Start a new comment with title
					c={title:m[2]}
					// Handle type filter tags if they exist
					if (m[1]) c.types=validateValues("types",m[1])
				} else if (c) {
					// Already started parsing a comment, look for filter tags and comment body
					m = /^(sites|types|users|tags|socvr)\:\s*(.*)$/.exec(line);
					if (m){
						// Add filter tags
						c[m[1]]=validateValues(m[1],m[2])
					} else {
						// Comment body (join multiple lines with spaces)
						if (c.comment) c.comment=c.comment+" "+line
						else c.comment=line
					}
				} else {
					// No comment started, didn't find a comment title
					console.log("Could not parse line from comment templates: " + line)
				}
			}
		}
		// Stash the last comment if it isn't followed by a new line
		if (c && c.title && c.comment) cs.push(c)
		return cs
	}

	function sort(arr){
		if (!(arr instanceof Array)) arr = Object.keys(arr)
		arr.sort()
		return arr
	}

	function exportComments(){
		var s ="";
		for (var i=0; i<comments.length; i++){
			var c = comments[i]
			s += "# " + c.title + "\n"
			s += c.comment + "\n"
			if (c.types) s += "types: " + sort(c.types).join(", ") + "\n"
			if (c.sites) s += "sites: " + sort(c.sites).join(", ") + "\n"
			if (c.users) s += "users: " + sort(c.users).join(", ") + "\n"
			if (c.tags) s += "tags: " + sort(c.tags).join(", ") + "\n"
			if (c.socvr) s += "socvr: " + c.socvr + "\n"
			s += "\n"
		}
		return s;
	}

	// inner lightbox content area
	var ctcmi = $('<div id=ctcm-menu>')
	// outer translucent lightbox background that covers the whole page
	var ctcmo = $('<div id=ctcm-back>').append(ctcmi)
	GM_addStyle("#ctcm-back{z-index:999998;display:none;position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,.5)}")
	GM_addStyle("#ctcm-menu{z-index:999999;min-width:320px;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--white);border:5px solid var(--theme-header-foreground-color);padding:1em;max-width:100vw;max-height:100vh;overflow:auto}")
	GM_addStyle(".ctcm-body{display:none;background:var(--black-050);padding:.3em;cursor: pointer;")
	GM_addStyle(".ctcm-expand{float:right;cursor: pointer;}")
	GM_addStyle(".ctcm-title{margin-top:.3em;cursor: pointer;}")
	GM_addStyle("#ctcm-menu textarea{width:90vw;min-width:300px;max-width:1000px;height:60vh;resize:both;display:block}")
	GM_addStyle("#ctcm-menu input[type='text']{width:90vw;min-width:300px;max-width:1000px;display:block}")
	GM_addStyle("#ctcm-menu button{margin-top:1em;margin-right:.5em}")
	GM_addStyle("#ctcm-menu button.right{float:right}")
	GM_addStyle("#ctcm-menu h3{margin:.5em auto;font-size: 150%;}")

	// Node input: text field where content can be written.
	// Used for filter tags to know which comment templates to show in which contexts.
	// Also used for knowing which clicks should show the context menu,
	// if a type isn't returned by this method, no menu will show up
	function getType(node){
		var prefix = "";

		// Most of these rules use properties of the node or the node's parents
		// to deduce their context

		if (!node.is('.js-comment-text-input,.js-comments-menu')){
			if (node.is('.js-rejection-reason-custom')) return "reject-edit"
			if (node.parents('.js-comment-flag-option').length) return "flag-comment"
			if (node.parents('.js-flagged-post').length){
				var type = /decline/.exec(node.attr('placeholder'))?"decline-flag":"helpful-flag"
				var text = node.closest('.js-flagged-post').find('.js-flag-text').text()
				if (/^Very low quality/.exec(text)) type += "-very-low-quality"
				else if (/^Not an answer/.exec(text)) type += "-not-an-answer"
				else if (/\(auto\)/.exec(text)) type += "-auto"
				else if (/^Plagiarism/.exec(text)) type += "-plagiarism"
				else if (/\b(generated|chatgpt|chatbot|gpt|gai|ai|aigc|llm)\b/i.exec(text)) type += "-gai"
				else if (/\b(sock|sockpuppet)\b/i.exec(text)) type += "-sock"
				else if (/\b(move|moved|migrate|migrated|belongs)\b/i.exec(text)) type += "-migration"
				else type += "-custom"
				return type
			}
			if (node.parents('.site-specific-pane').length) prefix = "close-"
			else if (node.parents('.mod-attention-subform').length) prefix = "flag-"
			else if (node.is('.edit-comment,#edit-comment')) prefix = "edit-"
			else if(node.is('.js-comment-text-input')) prefix = ""
			else return null
		}

		if (node.parents('#question,.question').length) return prefix + "question"
		if (node.parents('#answers,.answer').length) return prefix + "answer"

		// Staging Ground
		if (location.pathname.startsWith("/staging-ground") && node.is(".js-comment-text-input")) return "question";

		// Fallback for single post edit page
		if (node.parents('.post-form').find('h2:last').text()=='Question') return prefix + "question"
		if (node.parents('.post-form').find('h2:last').text()=='Answer') return prefix + "answer"

		return null
	}

	// Mostly moderator or non-moderator (user.)
	// Not-logged in and low rep users are not able to comment much
	// and are unlikely to use this tool, no need to identify them
	// and give them special behavior.
	// Maybe add a class for staff in the future?
	var userclass
	function getUserClass(){
		if (!userclass){
			if ($('.js-mod-inbox-button').length) userclass="moderator"
			else if ($('.s-topbar--item.s-user-card').length) userclass="user"
			else userclass="anonymous"
		}
		return userclass
	}

	// The Stack Exchange site this is run on (just the subdomain, eg "stackoverflow")
	var site
	function getSite(){
		if(!site) site=validateSite(location.hostname)
		return site
	}

	// Which tags are on the question currently being viewed
	var tags
	function getTags(){
		if(!tags) tags=$.map($('.post-taglist .post-tag'),function(tag){return $(tag).text()})
		return tags
	}

	// The id of the question currently being viewed
	function getQuestionId(){
		var id = $('.question').attr('data-questionid')
		if (!id){
			var l = $('.answer-hyperlink')
			if (l.length) id=l.attr('href').replace(/^\/questions\/([0-9]+).*/,"$1")
		}
		if (!id) id="-"
		return id
	}

	// The human readable name of the current Stack Exchange site
	function getSiteName(){
		return $('meta[property="og:site_name"]').attr('content').replace(/ ?Stack Exchange/, "")
	}

	// The Stack Exchange user id for the person using this tool
	function getMyUserId() {
		return $('a.s-topbar--item.s-user-card').attr('href').replace(/^\/users\/([0-9]+)\/.*/,"$1")
	}

	// The Stack Exchange user name for the person using this tool
	function getMyName() {
		var n=$('header .s-avatar[title]').attr('title')
		if (!n) return "-"
		return n.replace(/ /g,"")
	}


	// The full host name of the Stack Exchange site
	function getSiteUrl(){
		return location.hostname
	}

	// Store the comment text field that was clicked on
	// so that it can be filled with the comment template
	var commentTextField

	// Insert the comment template into the text field
	// called when a template is clicked in the dialog box
	// so "this" refers to the clicked item
	function insertComment(){
		// The comment to insert is stored in a div
		// near the item that was clicked
		var body = $(this).parent().children('.ctcm-body')
		var socvr = body.attr('data-socvr')
		if (socvr){
			var url = "//" + getSiteUrl() + "/questions/" + getQuestionId()
			var title = $('h1').first().text()
			title = new Option(title).innerHTML
			$('#content').prepend($(`<div style="border:5px solid blue;padding:.7em;margin:.5em 0"><a target=_blank href=//chat.stackoverflow.com/rooms/41570/so-close-vote-reviewers>SOCVR: </a><div>[tag:cv-pls] ${socvr} [${title}](${url})</div></div>`))
		}
		var cmt = body.text()

		// Put in the comment
		commentTextField.val(cmt).focus().trigger("change").trigger("input")

		// highlight place for additional input,
		// if specified in the template
		var typeHere="[type here]"
		var typeHereInd = cmt.indexOf(typeHere)
		if (typeHereInd >= 0) commentTextField[0].setSelectionRange(typeHereInd, typeHereInd + typeHere.length)

		closeMenu()
	}

	// User clicked on the expand icon in the dialog
	// to show the full text of a comment
	function expandFullComment(){
		$(this).parent().children('.ctcm-body').show()
		$(this).hide()
	}

	// Apply comment tag filters
	// For a given comment, say whether it
	// should be shown given the current context
	function commentMatches(comment, type, user, site, tags){
		if (comment.types){
			var isType = false
			while(type){
				if (comment.types[type]) isType = true
				type = type.replace(/\-?[^\-]*$/,"")
			}
			if (!isType) return false
		}
		if (comment.users && !comment.users[user]) return false
		if (comment.sites && !comment.sites[site]) return false
		if (comment.tags){
			var hasTag = false
			for(var i=0; tags && i<tags.length; i++){
				if (comment.tags[tags[i]]) hasTag=true
			}
			if(!hasTag) return false
		}
		return true
	}

	// User clicked "Save" when editing the list of comment templates
	function doneEditing(){
		comments = parseComments($(this).prev('textarea').val())
		storeComments()
		closeMenu()
	}

	// Show the edit comment dialog
	function editComments(){
		// Pointless to edit comments that will just get overwritten
		// If there is a URL, only allow the URL to be edited
		if(GM_getValue(storageKeys.url)) return urlConf()
		ctcmi.html(
			"<pre># Comment title\n"+
			"Comment body\n"+
			"types: "+typeMapInput.replace(/,/g, ", ")+"\n"+
			"users: "+userMapInput.replace(/,/g, ", ")+"\n"+
			"sites: stackoverflow, physics, meta.stackoverflow, physics.meta, etc\n"+
			"tags: javascript, python, etc\n"+
			"socvr: Message for Stack Overflow close vote reviews chat</pre>"+
			"<p>types, users, sites, tags, and socvr are optional.</p>"
		)
		.append($('<textarea>').val(exportComments()))
		.append($('<button>Save</button>').click(doneEditing))
		.append($('<button>Cancel</button>').click(closeMenu))
		.append($('<button>From URL...</button>').click(urlConf))
		return false
	}

	// Show info
	function showInfo(){
		ctcmi.html(
			"<div><h2><a target=_blank href=//github.com/stephenostermiller/stack-exchange-comment-templates>Stack Exchange Comment Templates Context Menu</a></h2></div>"
		)
		.append(commentWarnHtml())
		.append(htmlVars())
		.append($('<button>Cancel</button>').click(closeMenu))
		return false
	}
	function getAuthorNode(postNode){
		return postNode.find('.post-signature .user-details[itemprop="author"]')
	}

	function getOpNode(){
		return getAuthorNode($('#question,.question'))
	}

	function getUserNodeId(node){
		if (!node) return "-"
		var link = node.find('a')
		if (!link.length) return "-"
		var href = link.attr('href')
		if (!href) return "-"
		return href.replace(/[^0-9]+/g, "")
	}

	function getOpId(){
		return getUserNodeId(getOpNode())
	}

	function getUserNodeName(node){
		if (!node) return "-"
		var link = node.find('a')
		if (!link.length) return "-"
		// Remove spaces from user names so that they can be used in @name references
		return link.text().replace(/ /g,"")
	}

	function getOpName(){
		return getUserNodeName(getOpNode())
	}

	function getUserNodeRep(node){
		if (!node) return "-"
		var r = node.find('.reputation-score')
		if (!r.length) return "-"
		return r.text()
	}

	function getOpRep(){
		return getUserNodeRep(getOpNode())
	}

	function getPostNode(){
		return commentTextField.parents('#question,.question,.answer')
	}

	function getPostAuthorNode(){
		return getAuthorNode(getPostNode())
	}

	function getAuthorId(){
		return getUserNodeId(getPostAuthorNode())
	}

	function getAuthorName(){
		return getUserNodeName(getPostAuthorNode())
	}

	function getAuthorRep(){
		return getUserNodeRep(getPostAuthorNode())
	}

	function getPostId(){
		var postNode = getPostNode();
		if (!postNode.length) return "-"
		if (postNode.attr('data-questionid')) return postNode.attr('data-questionid')
		if (postNode.attr('data-answerid')) return postNode.attr('data-answerid')
		return "-"
	}

	// Map of variables to functions that return their replacements
	var varMap = {
		'SITENAME': getSiteName,
		'SITEURL': getSiteUrl,
		'MYUSERID': getMyUserId,
		'MYNAME': getMyName,
		'QUESTIONID': getQuestionId,
		'OPID': getOpId,
		'OPNAME': getOpName,
		'OPREP': getOpRep,
		'POSTID': getPostId,
		'AUTHORID': getAuthorId,
		'AUTHORNAME': getAuthorName,
		'AUTHORREP': getAuthorRep
	}

	// Cache variables so they don't have to be looked up for every single question
	var varCache={}

	function getCachedVar(key){
		if (!varCache[key]) varCache[key] = varMap[key]()
		return varCache[key]
	}

	function hasVarWarn(){
		var varnames = Object.keys(varMap)
		for (var i=0; i<varnames.length; i++){
			if (getCachedVar(varnames[i]).match(/^-?$/)) return true
		}
		return false
	}

	function htmlVars(){
		var n = $("<ul>")
		var varnames = Object.keys(varMap)
		for (var i=0; i<varnames.length; i++){
			var li=$("<li>")
			var val = getCachedVar(varnames[i])
			if (val.match(/^-?$/)) li.append($("<span>").text("⚠️ "))
			li.append($("<b>").text(varnames[i])).append($("<span>").text(": ")).append($("<span>").text(val))
			n.append(li)
		}
		return $('<div>').append($('<h3>').text("Variables")).append(n)
	}

	// Build regex to find variables from keys of map
	var varRegex = new RegExp('\\$('+Object.keys(varMap).join('|')+')\\$?', 'g')
	function fillVariables(s){
		// Perform the variable replacement
		return s.replace(varRegex, function (m) {
			// Remove $ from variable name
			return getCachedVar(m.replace(/\$/g,""))
		});
	}

	// Show the URL configuration dialog
	function urlConf(){
		var url = GM_getValue(storageKeys.url)
		ctcmi.html(
			"<p>Comments will be loaded from these URLs when saved and once a day afterwards. Multiple URLs can be specified, each on its own line.  Github raw URLs have been whitelisted. Other URLs will ask for your permission.</p>"
		)
		if (url) ctcmi.append("<p>Remove all the URLs to be able to edit the comments in your browser.</p>")
		else ctcmi.append("<p>Using a URL will <b>overwrite</b> any edits to the comments you have made.</p>")
		ctcmi.append($('<textarea placeholder=https://raw.githubusercontent.com/user/repo/123/stack-exchange-comments.txt>').val(url))
		ctcmi.append($('<button>Save</button>').click(doneUrlConf))
		ctcmi.append($('<button>Cancel</button>').click(closeMenu))
		return false
	}

	// User clicked "Save" in URL configuration dialog
	function doneUrlConf(){
		GM_setValue(storageKeys.url, $(this).prev('textarea').val())
		// Force a load by removing the timestamp of the last load
		GM_deleteValue(storageKeys.lastUpdate)
		loadStorageUrlComments()
		closeMenu()
	}

	// Look up the URL from local storage, fetch the URL
	// and parse the comment templates from it
	// unless it has already been done recently
	function loadStorageUrlComments(){
		var url = GM_getValue(storageKeys.url)
		if (!url) return
		var lu = GM_getValue(storageKeys.lastUpdate);
		if (lu && lu > Date.now() - 8600000) return
		loadComments(url)
	}

	// Hook into clicks for the entire page that should show a context menu
	// Only handle the clicks on comment input areas (don't prevent
	// the context menu from appearing in other places.)
	$(document).contextmenu(function(e){
		var target = $(e.target)
		if (target.is('.comments-link')){
			// The "Add a comment" link
			var parent = target.parents('.answer,#question,.question')
			// Show the comment text area
			target.trigger('click')
			// Bring up the context menu for it
			showMenu(parent.find('textarea'))
			e.preventDefault()
			return false
		} else if (target.closest('#review-action-Reject,label[for="review-action-Reject"]').length){
			// Suggested edit review queue - reject
			target.trigger('click')
			$('button.js-review-submit').trigger('click')
			setTimeout(function(){
				// Click "causes harm"
				$('#rejection-reason-0').trigger('click')
			},100)
			setTimeout(function(){
				showMenu($('#rejection-reason-0').parents('.flex--item').find('textarea'))
			},200)
			e.preventDefault()
			return false
		} else if (target.closest('#review-action-Unsalvageable,label[for="review-action-Unsalvageable"]').length){
			// Triage review queue - unsalvageable
			target.trigger('click')
			$('button.js-review-submit').trigger('click')
			showMenuInFlagDialog()
			e.preventDefault()
			return false
		} else if (target.is('.js-flag-post-link')){
			// the "Flag" link for a question or answer
			// Click it to show pop up
			target.trigger('click')
			showMenuInFlagDialog()
			e.preventDefault()
			return false
		} else if (target.closest('.js-comment-flag').length){
			// The flag icon next to a comment
			target.trigger('click')
			setTimeout(function(){
				// Click "Something else"
				$('#comment-flag-type-CommentOther').prop('checked',true).parents('.js-comment-flag-option').find('.js-required-comment').removeClass('d-none')
			},100)
			setTimeout(function(){
				showMenu($('#comment-flag-type-CommentOther').parents('.js-comment-flag-option').find('textarea'))
			},200)
			e.preventDefault()
			return false
		} else if (target.closest('#review-action-Close,label[for="review-action-Close"],#review-action-NeedsAuthorEdit,label[for="review-action-NeedsAuthorEdit"]').length){
			// Close votes review queue - close action
			// or Triage review queue - needs author edit action
			target.trigger('click')
			$('button.js-review-submit').trigger('click')
			showMenuInCloseDialog()
			e.preventDefault()
			return false
		} else if (target.is('.js-close-question-link')){
			// The "Close" link for a question
			target.trigger('click')
			showMenuInCloseDialog()
			e.preventDefault()
			return false
		} else if (target.is('.js-resolve-action')){
			// Flag handling Helpul... or Decline.. link
			target.trigger('click')
			setTimeout(function(){
				showMenu(target.closest('.js-flagged-post').find('.is-expanded input.js-feedback[type="text"]'))
			},100)
			e.preventDefault()
			return false
		} else if (target.is('textarea,input[type="text"]') && (!target.val() || target.val() == target[0].defaultValue)){
			// A text field that is blank or hasn't been modified
			var type = getType(target)
			if (type){
				// A text field for entering a comment
				showMenu(target)
				e.preventDefault()
				return false
			}
		} else if (target.closest('.js-reply-bar').length){
			// "Add a comment" button
			target.trigger('click')
			showMenu(target.closest('.js-reply-bar').parent().find('.js-comment-text-input'))
			e.preventDefault()
			return false
		}
	})

	function showMenuInFlagDialog(){
		// Wait for the popup
		setTimeout(function(){
			$('input[value="PostOther"]').trigger('click')
		},100)
		setTimeout(function(){
			showMenu($('input[value="PostOther"]').parents('label').find('textarea'))
		},200)
	}

	function showMenuInCloseDialog(){
		setTimeout(function(){
			$('#closeReasonId-SiteSpecific').trigger('click')
		},100)
		setTimeout(function(){
			$('#siteSpecificCloseReasonId-other').trigger('click')
		},200)
		setTimeout(function(){
			showMenu($('#siteSpecificCloseReasonId-other').parents('.js-popup-radio-action').find('textarea'))
		},300)
	}

	function filterComments(e){
		if (e.key === "Enter") {
			// Pressing enter in the comment filter
			// should insert the first visible comment
			insertComment.call($('.ctcm-title:visible').first())
			e.preventDefault()
			return false
		}
		if (e.key == "Escape"){
			closeMenu()
			e.preventDefault()
			return false
		}
		// Show comments that contain the filter (case-insensitive)
		var f = $(this).val().toLowerCase()
		$('.ctcm-comment').each(function(){
			var c = $(this).text().toLowerCase()
			$(this).toggle(c.includes(f))
		})
	}

	function showMenu(target){
		varCache={} // Clear the variable cache
		commentTextField=target
		var type = getType(target)
		var user = getUserClass()
		var site = getSite()
		var tags = getTags()
		ctcmi.html("")
		var filter=$('<input type=text placeholder="filter... (type then press enter to insert the first comment)">').keyup(filterComments).change(filterComments)
		ctcmi.append(filter)
		for (var i=0; i<comments.length; i++){
			if(commentMatches(comments[i], type, user, site, tags)){
				ctcmi.append(
					$('<div class=ctcm-comment>').append(
						$('<span class=ctcm-expand>\u25bc</span>').click(expandFullComment)
					).append(
						$('<h4 class=ctcm-title>').text(comments[i].title).click(insertComment)
					).append(
						$('<div class=ctcm-body>').text(fillVariables(comments[i].comment)).click(insertComment).attr('data-socvr',comments[i].socvr||"")
					)
				)
			}
		}
		var info = (hasVarWarn()||hasCommentWarn())?"⚠️":"ⓘ"
		ctcmi.append($('<button>Edit</button>').click(editComments))
		ctcmi.append($('<button>Cancel</button>').click(closeMenu))
		ctcmi.append($('<button class=right>').text(info).click(showInfo))
		target.parents('.popup,#modal-base,body').first().append(ctcmo)
		ctcmo.show()
		filter.focus()
	}

	function closeMenu(){
		ctcmo.hide()
		ctcmo.remove()
	}

	// Hook into clicks anywhere in the document
	// and listen for ones that related to our dialog
	$(document).click(function(e){
		// dialog is open
		if(ctcmo.is(':visible')){
			// Allow clicks on links in the dialog to have default behavior
			if($(e.target).is('a')) return true
			// click wasn't on the dialog itself
			if(!$(e.target).parents('#ctcm-back').length) closeMenu()
			// Clicks when the dialog are open belong to us,
			// prevent other things from happening
			e.preventDefault()
			return false
		}
	})
})();
