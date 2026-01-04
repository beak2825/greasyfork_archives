// ==UserScript==
// @name        Mobile Tricks
// @namespace   You
// @description Mobile Tricks for Mobile
// @version     1.3
// @include     https://www.instagram.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/411078/Mobile%20Tricks.user.js
// @updateURL https://update.greasyfork.org/scripts/411078/Mobile%20Tricks.meta.js
// ==/UserScript==

var searchableStr = document.URL;
var strmatch_instaMedia = searchableStr.includes("instagram.com/p/");
var strmatch_instaMedia__CSSadded = false;
initiateScript();

setInterval(checkPageURLforChanges, 500);

function initiateScript()
{
	searchableStr = document.URL;
	strmatch_instaMedia = searchableStr.includes("instagram.com/p/");
	if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
	else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
	else {document.addEventListener('load', afterLoad, false);}

	var addition_sheet = document.createElement('style');
	addition_sheet.innerHTML = ".Z_Gl2 {display: none !important;}"; // use the app banner
	document.body.appendChild(addition_sheet);
	
	if (strmatch_instaMedia && !strmatch_instaMedia__CSSadded)
	{
		var insta_media_addition_sheet = document.createElement('style');
		//insta_media_addition_sheet.innerHTML = ".ins_dwnld_btn {border: black solid 2px; border-radius: 11px; margin-left: 14px; margin-top: 5px; padding: 3px; height: 75%;}";
		insta_media_addition_sheet.innerHTML = ".ins_dwnld_btn {margin-left: 14px; margin-top: 5px; padding: 3px; height: 32px;} .ins_dwnld_btn img {max-width: 100%; max-height: 100%;}";
		document.body.appendChild(insta_media_addition_sheet);
		strmatch_instaMedia__CSSadded = true;
	}
}

function afterLoad()
{
	if (strmatch_instaMedia)
	{
		// Create Content Button
		var insert_into_cont = document.getElementsByClassName("ltpMr")[0];
		var new_button = document.createElement('button');
		new_button.classList = "wpO6b ins_dwnld_btn";
		new_button.type = "button";
		insert_into_cont.appendChild(new_button);
		new_button.addEventListener("click", getInstaContent);
		// inner image
		var new_button_img = document.createElement('img');
		new_button_img.src = "https://cdns.iconmonstr.com/wp-content/assets/preview/2018/96/iconmonstr-save-thin.png"
		new_button.appendChild(new_button_img);
	}
}

// General Functions
function checkPageURLforChanges()
{
	if (searchableStr != document.URL)	// page has silently navigated
	{
		console.log("Page has changed.");
		initiateScript();
		setTimeout(afterLoad, 1000);	// Simulate onLoad
	}
}

//Specific Functions
function getInstaContent()
{
	var elmcont_img_classname = "KL4Bh"; // Is a div, and inside is the img
	var elmcont_vid_classname = "tWeCl"; // Is the <video> element
	// On a profile page there are two article elements. [0]: the main catalogue layout, [1]: the focused post
	// On a single post page, there is just one... the post itself.
	var article_array = document.getElementsByTagName("article");
	var media_container = article_array[0];
	if (article_array.length > 1) media_container = article_array[1];

	var all_elements_img = media_container.getElementsByClassName(elmcont_img_classname);
	var all_elements_vid = media_container.getElementsByClassName(elmcont_vid_classname);
	var all_elements_count = all_elements_img.length + all_elements_vid.length;
	var current_highlight_src = "";

	if (all_elements_count == 1)	// Post only has one entry
	{
		console.log("Post only has 1 entry");
		if (all_elements_img.length > 0) current_highlight_src = all_elements_img[0].getElementsByTagName("img")[0].src;
		else current_highlight_src = all_elements_vid[0].src;
	}
	else
	{
		// Multiple entries, so combine all imgs and vids into one array (all elements are the elm with the src now)
		var all_elements_combined = [];
		for (var i=0; i<all_elements_count; i++)
		{
			if (i < all_elements_img.length) all_elements_combined[i] = all_elements_img[i].getElementsByTagName("img")[0];
			else all_elements_combined[i] = all_elements_vid[i - (all_elements_img.length)];
		}

		var media_container_box_left = media_container.getBoundingClientRect().x;
		var closest_dist = 6000;
		var closest_elm = -1;
		for (var i=0; i<all_elements_count; i++)
		{
			var elm_left = all_elements_combined[i].getBoundingClientRect().x;
			var elm_dist = Math.abs(media_container_box_left - elm_left);
			if (elm_dist < closest_dist)
			{
				closest_dist = elm_dist;
				closest_elm = i;
			}
		}
		current_highlight_src = all_elements_combined[closest_elm].src;
	}

	if (current_highlight_src != "")
	{
		window.open(current_highlight_src, '_blank');
	}
	else console.log("SRC is blank.");
}