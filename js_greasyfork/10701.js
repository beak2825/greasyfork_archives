// ==UserScript==
// @name        Voat Enhancement
// @namespace   septus.info
// @include		http://voat.co/*
// @include		http://*.voat.co/*
// @include		https://voat.co/*
// @include		https://*.voat.co/*
// @version		1.0.5
// @grant		GM_getValue
// @grant		GM_setValue
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @description:en	A simple script to provide some basic enhancement for voat. Includes auto-pagination, info bar detachment, and extra embedding for comments.
// @description A simple script to provide some basic enhancement for voat. Includes auto-pagination, info bar detachment, and extra embedding for comments.
// @downloadURL https://update.greasyfork.org/scripts/10701/Voat%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/10701/Voat%20Enhancement.meta.js
// ==/UserScript==

var PostProcessSubmissions = function(submissions){
	/*
	var toolTipsterData = {
    content: "Loading user info...",
    contentAsHTML: "true",
    functionBefore: function(n, t) {
      t();
      n.data("ajax") !== "cached" && $.ajax({
        type: "GET",
        url: "/ajaxhelpers/userinfo/" + n.attr("data-username"),
        success: function(t) {
          n.tooltipster("content", t).data("ajax", "cached");
        }
      });
    }
	};
	
	for(var i = 0; i < submissions.length; i++){
		$(submissions[i]).find(".userinfo").tooltipster(toolTipsterData);
	}
	*/
};


function Plugin_UserTag(framework){
	var _this = this;
	
	var defaults = {
		tags: {
			pathogenxd: "VES Creator"
		}
	}
	
	if(GM_getValue('Plugin_UserTag') === null){
		GM_setValue('Plugin_UserTag', JSON.stringify(defaults));
	}
	
	this.settings = JSON.parse(GM_getValue('Plugin_UserTag'));
	//console.log(this.settings);
	
	$(document).on("comments-loaded", function(event){
		
		for(var i = 0; i < event.comments.length; i++){
			var username = $($(event.comments[i]).find("p.tagline a.author")[0]).text().toLowerCase();
			//console.log(username);
			
			if(_this.settings.tags[username] !== undefined)
			{
				var userattrsElement = $(event.comments[i]).find("p.tagline span.userattrs")[0];
				$(userattrsElement).after("&nbsp;<span style='color: blue;'>" + _this.settings.tags[username] + "</span>");
			}
			
			var buttons = $(event.comments[i]).find("ul.buttons")[0];
			var button = $('<li><a>tag user</a></li>').on('click', function(event){
				var usernameToTag = $(event.currentTarget).attr('data-username');
				var newTag = prompt('Custom tag for '+usernameToTag);
				if(newTag !== null){
					_this.settings.tags[usernameToTag] = newTag;
					GM_setValue('Plugin_UserTag', JSON.stringify(_this.settings));
				}
			});
			button.attr('data-username', username);
			//console.log(button);
			$(buttons).append(button);
		}
	});
}

function Plugin_AutoPaginate(framework){
	this.framework = framework;
	this.currentPage = framework.page.currentPage;
	this.contentLoading = false;
	this.morePages = true;
	this.postIdLoaded = {};
	var _this = this;
	
	if(this.framework.page.type === "subverse"){
		this.HandleSubverse();
	}
	
}
Plugin_AutoPaginate.prototype.HandleSubverse = function(){
	var _this = this;
	if(! ($("li.btn-whoaverse-paging > a[rel^='next']")[0])){
		this.morePages = false;
	}
	//console.log(this.morePages);
	
	var url = "";
	if(this.framework.page.subverse === ""){
		url = "/"+this.framework.page.sorting;
	}
	else{
		url = "/v/" + this.framework.page.subverse +"/" + this.framework.page.sorting;
	}
	//console.log(url);
	
	$(document).on("submissions-loaded", function(event){
		// Hide duplicate posts as they appear
		for(var i = 0; i < event.submissions.length; i++){
			var postId = $(event.submissions[i]).attr('data-fullname');
			if(!_this.postIdLoaded[postId]){
				_this.postIdLoaded[postId] = true;
				
			}
			else{
				$(event.submissions[i]).css({display: "none"});
				//console.log("post id " + postId + " hidden");
			}
		}
	});
	
	$(document).on("scroll", function(event){
		var distanceToNewPage = $("div.pagination-container").offset().top - 
			(window.pageYOffset + $(window).height()) - 600;
		//console.log(distanceToNewPage + " " + _this.contentLoading + " " + _this.morePages);
		
		if(distanceToNewPage < 0 && !_this.contentLoading && _this.morePages){
			
			_this.contentLoading = true;
			_this.currentPage++;
			//console.log("Loading page " + _this.currentPage);
			
			$.get( url, {page: _this.currentPage} )
				.done(function( data ) {
					var loadedDocument = $(data);
					var loadedSubmissions = null;
					
					if(_this.framework.page.subverse === ""){
						loadedSubmissions = loadedDocument.find("div.sitetable > div.submission");
						var paginationContainer = $("div.pagination-container");
						for(var i = 0; i < loadedSubmissions.length; i++){
							paginationContainer.before(loadedSubmissions[i]);
						}
					}
					else{
						loadedSubmissions = loadedDocument.find("div.linklisting > div.submission");
						var linklisting = $("div.linklisting");
						for(var i = 0; i < loadedSubmissions.length; i++){
							linklisting.append(loadedSubmissions[i]);
						}
					}
					
					if(!loadedDocument.find("li.btn-whoaverse-paging > a[rel^='next']")[0]){
						_this.morePages = false;
					}
					_this.contentLoading = false;
					
					PostProcessSubmissions(loadedSubmissions);
					
					$.event.trigger({
						type: "submissions-loaded",
						submissions: loadedSubmissions
					});
				})
				.fail(function(error) {
					//console.log( error );
				});
		}
	});
};

var SaveStyles = function(domObject, styleObject){
	for (var property in styleObject) {
		styleObject[property] = $(domObject).css(property);
	}
};

function Plugin_DetachedInfoBar(framework){
	var infoBar = $("div#header-account > div:nth-child(1)");
	var infoBarTop = infoBar.offset().top;
	var infoBarRight = $(window).width() - (infoBar.offset().left + infoBar.width());
	var infoBarDetached = false;
	var detachedStyle = {"position": "fixed", "top": "0px", "right": "0px"};
	var originalStyle = {"position": "", "top": "", "right": ""};
	SaveStyles(infoBar, originalStyle);
	
	//console.log(originalStyle);
	var changingState = false;
	$(document).on("scroll", function(event){
		if(!changingState){
			if(!infoBarDetached && window.pageYOffset - infoBarTop > 0){
				changingState = true;
				var animateBeginStyle = jQuery.extend(true, {}, detachedStyle);
				animateBeginStyle["right"] = infoBarRight + "px";
				
				infoBar.css(animateBeginStyle);
				infoBar.animate(detachedStyle, 200, function(){
					infoBarDetached = true;
					changingState = false;
				});
				//console.log("Info bar detached");
			}
			else if(infoBarDetached && window.pageYOffset - infoBarTop <= 0){
				changingState = true;
				var animateEndStyle = jQuery.extend(true, {}, detachedStyle);
				animateEndStyle["right"] = infoBarRight + "px";
				//console.log(animateEndStyle);
				infoBar.animate(animateEndStyle, 200, function(){
					infoBar.css(originalStyle);
					infoBarDetached = false;
					changingState = false;
					//console.log("complete");
				});
			}
		}
		
	});
}

function Plugin_LinkEmbedder(framework){
	var collapsedButtonStyle = {
		"background": "transparent url(\"/Graphics/Light-SpriteSheet.png\") repeat scroll 0px -44px"
	};
	var uncollapsedButtonStyle = {
		"background": "transparent url(\"/Graphics/Light-SpriteSheet.png\") repeat scroll 0px -60px"
	};
	
	var EmbedRules = [
		//Imgur Album
		function(href){
			var result = {handled: false, embedHtml: ""};
			var match = null;
			
			match = href.match(/^https?:\/\/([^\.]*\.)?imgur\.com\/(gallery\/)?([a-zA-Z0-9]+)$/);
			if(match){
				result.handled = true;
				result.embedHtml = "<blockquote class=\"imgur-embed-pub\" lang=\"en\" data-id=\"a/"+ match[3] +"\"></blockquote><script async src=\"//s.imgur.com/min/embed.js\" charset=\"utf-8\"></script>";
			}
			
			return result;
		},
		//Daily motion
		function(href){
			var result = {handled: false, embedHtml: ""};
			var match = null;
			
			match = href.match(/^https?:\/\/www\.dailymotion\.com\/video\/([a-zA-Z0-9]+)_.*$/);
			if(match){
				result.handled = true;
				result.embedHtml = "<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/" + match[1] + "\" allowfullscreen></iframe>";
			}
			
			return result;
		}
	];
	
	
	$(document).on("submissions-loaded", function(event){
		//console.log("We need to process loaded submissions to attach embedded content");
		for(var i = 0; i < event.submissions.length; i++){
			
		}
	});
	
	$(document).on("comments-loaded", function(event){
		for(var i = 0; i < event.comments.length; i++){
			var links = $($(event.comments[i]).find("div.entry")[0]).find("div.md a");
			links.each(function(){
				for(var i = 0; i < EmbedRules.length; i++){
					var result = EmbedRules[i](this["href"]);
					if(result.handled === true){
						var embedDiv = $("<div class=\"embed-container\" style=\"display: block;\">" + result.embedHtml + "</div>");
						
						var button = $("<div></div>").css({
							"width": "16px",
							"height": "16px",
							"display": "inline-block"
						});
						button.css(collapsedButtonStyle);
						var buttonCollapsed = true;
						
						button.on("click", function(event){
							if(buttonCollapsed){
								buttonCollapsed = false;
								if(button.next().length === 0 || button.next()[0].tagName != 'DIV'){
									button.after(embedDiv);
								}
								else{
									button.next().css({"display": "block"});
								}
								button.css(uncollapsedButtonStyle);
								
							}
							else{
								buttonCollapsed = true;
								button.next().css({"display": "none"});
								button.css(collapsedButtonStyle);
							}
						});
						
						$(this).after(button);
						
						break;
					}
				}
			});
		}
	});
	
	
	
}

function Framework(){
	function SubversePage(){
		this.type = "subverse";
		this.subverse = null;
		this.currentPage = 0;
		this.sorting = null;
	}
	SubversePage.prototype.TriggerInitialEvents = function(){
		loadedSubmission = null;
		if(this.subverse === ""){
			loadedSubmissions = $("div.sitetable > div.submission");
		}
		else{
			loadedSubmissions = $("div.linklisting > div.submission");
		}
		
		$.event.trigger({
			type: "submissions-loaded",
			submissions: loadedSubmissions
		});
	};

	function SubmissionPage(){
		this.type = "submission";
		this.subverse = null;
		this.id = null;
		this.loadedParentComments = null;
	}
	SubmissionPage.prototype.TriggerInitialEvents = function(){
		var _this = this;
		$.event.trigger({
			type: "comments-loaded",
			comments: $("div.commentarea div.child")
		});
		
		this.loadedParentComments = $("div.commentarea > div.sitetable > div.child").length;
		//console.log(this.loadedParentComments);
		window.setInterval(function(){
			var temp = $("div.commentarea > div.sitetable > div.child");
			if(temp.length > _this.loadedParentComments){
				//("More comments loaded..." + _this.loadedParentComments + " " + temp.length);
				
				var event = {
					type: "comments-loaded",
					comments: []
				};
				for(var i = _this.loadedParentComments; i < temp.length; i++){
					event.comments.push(temp[i]);
					var temp2 = $(temp[i]).find("div.child");
					for(var j = 0; j < temp2.length; j++){
						event.comments.push(temp2[j]);
					}
				}
				
				$.event.trigger(event);
				//console.log(event);
				
				_this.loadedParentComments = temp.length;
			}
		}, 16);
	};

	function PermalinkPage(){
		this.type = "permalink";
		this.subverse = null;
		this.submissionId = null;
		this.id = null;
	}

	function UserSubmissionsPage(){
		this.type = "user-submissions";
		this.username = null;
		this.currentPage = 0;
	}

	function UserCommentsPage(){
		this.type = "user-comments";
		this.username = null;
		this.currentPage = 0;
	}

	function OtherPage(){
		this.type = "other";
	}
	
	//Find out what our page type is plus any useful information
	this.page = null;
	
	var urlHandled = false;
	
	var match = window.location.href.match(/^https?:\/\/(www\.)?voat\.co(\/(new))?\/?$/);
	if(!urlHandled && match !== null){
		this.page = new SubversePage();
		this.page.subverse = "";
		if(match[3]){
			this.page.sorting = match[3];
		}
		else{
			this.page.sorting = "";
		}
		urlHandled = true;
	}
	
	match = window.location.href.match(/^https?:\/\/(www\.)?voat\.co\/v\/([a-zA-Z0-9_]+)(\/(new|top))?$/);
	if(!urlHandled && match !== null){
		this.page = new SubversePage();
		this.page.subverse = match[2];
		if(match[4]){
			this.page.sorting = match[4];
		}
		else{
			this.page.sorting = "";
		}
		urlHandled = true;
	}
	
	match = window.location.href.match(/^https?:\/\/(www\.)?voat\.co\/v\/([a-zA-Z0-9_]+)\/comments\/([0-9]+)$/);
	if(!urlHandled && match !== null){
		this.page = new SubmissionPage();
		this.page.subverse = match[2];
		this.page.id = match[3];
		urlHandled = true;
	}
	
	match = window.location.href.match(/^https?:\/\/(www\.)?voat\.co\/v\/([a-zA-Z0-9_]+)\/comments\/([0-9]+)\/([0-9]+)$/);
	if(!urlHandled && match !== null){
		this.page = new PermalinkPage();
		this.page.subverse = match[2];
		this.page.submissionId = match[3];
		this.page.id = match[4];
		urlHandled = true;
	}
	
	match = window.location.href.match(/^https?:\/\/(www\.)?voat\.co\/user\/([a-zA-Z0-9_]+)\/submissions$/);
	if(!urlHandled && match !== null){
		this.page = new UserSubmissionsPage();
		this.page.username = match[2];
		urlHandled = true;
	}
	
	match = window.location.href.match(/^https?:\/\/(www\.)?voat\.co\/user\/([a-zA-Z0-9_]+)\/comments$/);
	if(!urlHandled && match !== null){
		this.page = new UserCommentsPage();
		this.page.username = match[2];
		urlHandled = true;
	}
	
	if(!urlHandled){
		this.page = new OtherPage();
	}
	console.log(this.page);
	
	new Plugin_AutoPaginate(this);
	new Plugin_DetachedInfoBar(this);
	new Plugin_LinkEmbedder(this);
	new Plugin_UserTag(this);
	
	if(this.page.TriggerInitialEvents){
		this.page.TriggerInitialEvents();
	}
	
	
	// $.event.trigger({
		// type: "submissions-loaded",
		// submissions: []
	// });
}
Framework.EventTypes = ["submissions-loaded", "comments-loaded"];

$(document).ready(function(){
	//console.log("test");
	var framework = new Framework();
	
	
	//InitializeAutoPaginate();
	//InitializeDetachedInfoBar();
	//InitializeLinkEmbedder();
});