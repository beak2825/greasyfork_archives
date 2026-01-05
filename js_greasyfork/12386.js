// ==UserScript==
// @name         Shoutbox Linkify
// @namespace    fortytwo
// @homepageURL	 https://greasyfork.org/en/users/14247-fortytwo
// @supportURL	 http://games-fortytwo.tumblr.com/tagged/shoutbox%20linkify
// @version      2.1
// @description  Links certain text (e.g. /profile/pet/42) in the shoutbox.
// @author       fortytwo
// @match        http://www.clanheart.com/*
// @grant        GM_getValue
// @grant		 GM_setValue
// @noframes
// @compatible	 chrome
// @compatible	 firefox
// @downloadURL https://update.greasyfork.org/scripts/12386/Shoutbox%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/12386/Shoutbox%20Linkify.meta.js
// ==/UserScript==
/***
	NOTICE: YOU ARE AGREEING THAT ANY USE OF THE FOLLOWING SCRIPT IS AT
	YOUR OWN RISK. I DO NOT MAKE ANY GUARANTEES THE SCRIPT WILL WORK, NOR 
	WILL I HOLD MYSELF ACCOUNTABLE FOR DAMAGE TO YOUR DEVICE.

	WHILE THE SCRIPT IS UNLIKELY TO CAUSE ANY HARM, AS WITH ALL TECHNICAL
	COMPONENTS, BUGS AND GLITCHES CAN HAPPEN.

	IF THE SCRIPT ISN'T WORKING FOR YOU, FEEL FREE TO SEND ME A MESSAGE: http://games-fortytwo.tumblr.com/
***/
(function(){
	//No shoutbox, then don't run.
	if(!document.getElementById('shoutbox-panel')){
		return;
	}

	var data = GM_getValue('shoutbox-linkify-data', {
		regexp:		'',
		text_comma: ''
	});

	//console.log(data);

	var replaceables =[
		//profile/pet/42
		{ match: /\/?profile\/pet\/([0-9]+)\/?/gim, content: "<a href='http://clanheart.com/profile/pet/$1'>pet #$1</a> "},
		//forums/topic/42?page=5
		{ match: /\/?forums\/topic\/([0-9]+)\/?\?page=([0-9]+)/gim, content: "<a href='http://clanheart.com/forums/topic/$1?page=$2'>topic #$1?page=$2</a> "},
		//forums/topic/42
		{ match: /\/?forums\/topic\/([0-9]+)\/?/gim, content: "<a href='http://clanheart.com/forums/topic/$1'>topic #$1</a> "},
		//trading/make_offer/42
		{ match: /\/?trading\/make_offer\/([0-9]+)\/?/gim, content: "<a href='http://clanheart.com/trading/make_offer/$1'>offer on pet #$1</a> "},
		//settings/changeClan, settings/whatever
		{ match: /\/?settings\/([0-9a-z]+)\/?/gim, content: "<a href='http://clanheart.com/settings/$1'>settings: #$1</a> "}
	];
	
	//Add highlights, if there are any by piping them together
	if(data.regexp){
		//Use the one we saved as regexp safe (escaped)
		var arr = JSON.parse(data.regexp);

		replaceables.push({
			match: new RegExp("([\\s|,|\.|@|!|:])("+arr.join("|")+")([\\s|,|\.|@|!|:])", "gim"),
			content: "$1<mark class='bg-danger'>$2</mark>$3"
		});
	}

	//for testing
	//console.log(replaceables);
	//console.log(linkify("@42 forty lfkmfk.nf \n4242\nlorem /profile/pet/42: no fkfnjk /profile/pet/42 42: hello lorem ipsum \n` 42 "));

	function linkify(text){
		for(var i = 0; i < replaceables.length; ++i){
			text = text.replace(replaceables[i].match, replaceables[i].content);
		}
		return text;
	};

	function magic(){
		var posts = document.getElementById('shoutbox-panel').getElementsByClassName('col-md-10');
		for(var i = 0; i < posts.length; ++i){
			//Fetch data. We want to get the string itself, manipulate it
			//and then add time and user link back in
			var post = posts[i];
			var e_userlink = post.getElementsByClassName('sb-link')[0];
			var e_time = post.getElementsByClassName("shoutbox-date")[0];

			//Collect data
			var a = {
				href: e_userlink.href,
				html: e_userlink.innerHTML
			};

			var time = e_time.innerHTML;

			//Eliminate all but the text content of our post
			for(var j = 0; j < post.childNodes.length; ++j){
				if(post.childNodes[j].nodeType != 3){
					post.removeChild(post.childNodes[j--]);
				}
			}

			//Add a ' ' otherwise our regexp doesn't match at the end or start? Bluh
			var text = linkify(" "+post.innerHTML.trim()+" ");

			//Form content back as it was with our new content
			post.innerHTML = [
				"<a href='"+a.href+"' class='sb-link'>"+a.html+"</a>",
				"<br>",
				text,
				"<div class='shoutbox-date'>"+time+"</div>"
			].join("");
		}
	};

	//Make sure to monitor changes to the shoutbox
	var sbObserver = new MutationObserver(function(mutations){
		for(var i = 0; i < mutations.length; ++i){
			var mutation = mutations[i];

			if(mutation.addedNodes.length > 0){
				magic();
			}
		}
	}).observe(document.getElementById('shoutbox-panel'), { childList: true });
	
	//Initial state
	magic();
	
	
	/* Settings Page */
	if(window.location.pathname === "/settings"){
		//Find the form
		var forms = document.forms,
			myForm;

		for(var i = 0; i < forms.length; ++i){
			var form = forms[i];
			if(form.action === "http://www.clanheart.com/settings/update"){
				myForm = form;
				break;
			}
		}

		//Exit if no form could be found
		if(!myForm){
			return;
		}
		
		//Get on with it
		var newNode = document.createElement('div');
		newNode.className = "form-group";
		newNode.innerHTML = [
			'<label for="name-in" class="col-md-3 label-heading">Shoutbox Linkify</label>',
			'<div class="col-md-12">',
				'<input type="text" id="sb_linkify_highlights" class="form-control" value="'+data.text_comma+'" />',
				'<span class="help-block">Pick words to highlight on in the shoutbox. Separate by ", ". Changes will take effect when you click Update.</span>',
			'</div>'
		].join("");

		//Insert the content
		myForm.insertBefore(newNode, myForm.getElementsByTagName('input')['s']);

		//Add onchange handler
		document.getElementById('sb_linkify_highlights').onchange = function(){
			//remove ws and stuff
			var words = this.value
				.split(", ")
				.map(function(value){
					return value.trim();
				})
				//clean it up
				.filter(function(value){
					return value.length > 0;
				});

			if(words.length){
				//We need to escape it to our regex
				var words_regexp = JSON.stringify(words.map(function(value){
					return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
				}));
			}
			else{
				var words_regexp = '';
			}
			GM_setValue("shoutbox-linkify-data", {
				regexp:		words_regexp,
				text_comma:	words.join(", ")
			});
		};
	}
})();