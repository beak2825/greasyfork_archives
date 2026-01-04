// ==UserScript==
// @name        Insta Companion Tool
// @include     https://www.instagram.com/*
// @version     6.5
// @description Instagram Companion Tool
// @grant       none
// @namespace https://greasyfork.org/users/158457
// @downloadURL https://update.greasyfork.org/scripts/412218/Insta%20Companion%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/412218/Insta%20Companion%20Tool.meta.js
// ==/UserScript==

if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
else {document.addEventListener('load', afterLoad, false);}

// General Variables
var shift_down = false;
var new_tab_override = false;
var header_number = 0;
var instant_download_option = false;

// URL Checking
var original_url = window.location.href;
var dynamic_url = original_url;
var page_is_content = false;
var media_in_focus = false;
var story_focus = false;
if (original_url.includes("instagram.com/p/")) page_is_content = true;
else setInterval(intervalCheck, 500);

console.log("Page is content only: " + page_is_content);
document.addEventListener('keydown', checkKey, false);
document.addEventListener('keyup', checkKeyup, false);

function intervalCheck()
{
    var current_url = window.location.href;
    if (current_url != dynamic_url)
    {
        console.log("Media focus has changed.");
        if (current_url.includes("instagram.com/stories/"))
        {
            story_focus = true;
            console.log("story mode");
        }
        else if (current_url.includes("instagram.com/p/"))
        {
            if (dynamic_url.includes("instagram.com/p/"))
            {
                // Switching from one media tab to a new one...
                destroyInstaComboButton();
                setTimeout(createInstaComboButton, 300);
                media_in_focus = true;
            }
            else
            {
                // Switching from thumbnail view to media highlight
                header_number = 1;
                createInstaComboButton();
                media_in_focus = true;
            }
            story_focus = false;
        }
        else
        {
            // Switching from media highlight to thumbnail view
            destroyInstaComboButton();
            media_in_focus = false;
            story_focus = false;
        }

        dynamic_url = current_url;
    }
}

function afterLoad()
{
    //alert(window.location.href);
    if (page_is_content)
    {
        // If it's a content page, add the Insta original button stuff
        createInstaComboButton(0);
    }
	else
	{
		// Add a profile DP link
	}

    // Add topbar kill button
    var parent_elm = document.getElementsByClassName("_47KiJ")[0];
    var new_elm = parent_elm.getElementsByTagName("div")[0].cloneNode(true);
    var new_elm_SVGpath = "M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z";
    new_elm.getElementsByTagName("svg")[0].innerHTML = "<path d='" + new_elm_SVGpath + "'></path>";
    parent_elm.appendChild(new_elm);
    new_elm.getElementsByTagName("a")[0].href = "javascript:void(0)";
    new_elm.addEventListener("click", function() {
        var kill_element = document.getElementsByClassName("NXc7H")[0];
        if (kill_element && kill_element.parentNode) kill_element.parentNode.removeChild(kill_element);
    });
}
var fullSizeDPFormCreated = false;
function getFullSizeDP()
{
	var usrname = window.location.href.replace("https://www.instagram.com/", "");
	if (usrname.indexOf("/") > -1)
	{
		usrname = usrname.substring(0, usrname.indexOf("/"));
	}

	if (usrname != "p")	// "p" means content focus is up. This is just for catalogue page.
	{
		console.log("User: " + usrname);
		//document.getElementById("birds").value = usrname;
		//document.getElementById("fullSizeDPform").submit();
		/*
			This doesn't work, so for not it will just post the name to make it easier to use.
		*/

		//window.open("http://izuum.com/index.php?user=" + usrname, '_blank');
		window.open("https://www.instadp.com/fullsize/" + usrname, '_blank');
	}
}


function destroyInstaComboButton()
{
    var icb = document.getElementById("InstaComboButton");
    if (icb) icb.parentNode.removeChild(icb);
}

function createInstaComboButton()
{
    var append_cont = document.getElementsByTagName("header")[header_number];

    if (append_cont) // If the element exists
    {
        var main_btn_w = "60%";
        var main_btn_brad = "25px 0 0 25px";
        if (!page_is_content)
        {
            main_btn_w = "100%";
            main_btn_brad = "25px";
        }

        var containerDiv = document.createElement('div');
        containerDiv.id = "InstaComboButton";
        containerDiv.style.position="absolute";
        containerDiv.style.setProperty("font-size", "60%", "important");
        containerDiv.style.display="block";
        containerDiv.style.width="100%";
        containerDiv.style.height="25px";
        containerDiv.style.bottom="-11px";
        containerDiv.style.zIndex="999";
        containerDiv.style.borderRadius="25px";
        append_cont.appendChild(containerDiv);

        var button_0 = document.createElement('button');
        button_0.type = "button";
        button_0.onmousedown = grabberButtonPressed;
        button_0.style.fontFamily="monospace";
        button_0.style.fontSize="158%";
        button_0.id = "img_but0";
        button_0.innerHTML = "GET MEDIA";
        button_0.style.width=main_btn_w;
        button_0.style.height="25px";
        button_0.style.backgroundColor="lightsteelblue";
        button_0.style.borderRadius=main_btn_brad;
        containerDiv.appendChild(button_0);

        if (page_is_content)
        {
            var button_1 = document.createElement('button');
            button_1.type = "button";
            button_1.onmousedown = grabberButtonPressed;
            button_1.id = "img_but1";
            button_1.innerHTML = "NEW TAB";
            button_1.style.fontFamily="monospace";
            button_1.style.fontSize="158%";
            button_1.style.width="40%";
            button_1.style.height="25px";
            button_1.style.borderRadius="0 25px 25px 0";
            button_1.style.backgroundColor="#5780C1";
            containerDiv.appendChild(button_1);
        }
    }
    else
    {
        setTimeout(createInstaComboButton, 300);
    }
}
function grabberButtonPressed(event)
{
    var caller_id = event.currentTarget.id;
    new_tab_override = caller_id.indexOf("1") > -1;
    getMedia();
    new_tab_override = false; // reset the toggle
}
function getMedia(download)
{
    var newURL = "";
	if (arguments.length == 0) download = false;

    if (story_focus)
    {
        var story_cont = document.getElementsByTagName("header")[0].parentNode;
        var img_collect = story_cont.getElementsByTagName("img");
        var vid_collect = story_cont.getElementsByTagName("video");

        console.log("Num of imgs: " + img_collect.length);
        console.log("Num of vids: " + vid_collect.length);

        //var time_stamp = document.getElementsByClassName("PwV9z")[0].getAttribute("datetime");
        var time_stamp = document.getElementsByTagName('time')[0].dateTime
        time_stamp = "&dnld_ts=" + time_stamp.substring(0, 10);
        console.log(time_stamp);

        if (vid_collect.length > 0) newURL = vid_collect[0].getElementsByTagName("source")[0].src + time_stamp;
        //else if (img_collect.length > 1) newURL = img_collect[1].src + time_stamp;
        else {
            //document.getElementsByClassName('zKGE8')[0].click(); // have to click to reveal source apparently...
            //var get_cont = document.getElementsByClassName('i1HvM')[0];
            //console.log(get_cont);
            newURL = document.getElementsByClassName('szopg')[0].getElementsByTagName('img')[0].srcset.split(' ')[0];
            //newURL = get_cont.srcset.split(' ')[0];
        }
    }
    else
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

        var time_stamp = document.getElementsByClassName("_1o9PC")[0].getAttribute("datetime");
        time_stamp = "&dnld_ts=" + time_stamp.substring(0, 10);


		if (current_highlight_src != "")
		{
            //Add time stamp
            current_highlight_src = current_highlight_src + time_stamp;

            if (instant_download_option)
            {
                current_highlight_src += "&instantdownload_go";
                instant_download_option = false;
            }
			if (!download) window.open(current_highlight_src, '_blank');
			else downloadURL(current_highlight_src);
		}
        else console.log("SRC is blank.");
    }
    if (newURL != "")
    {
        if (!shift_down && !new_tab_override && page_is_content && !story_focus)
        {
            window.location.href = newURL;
        }
        else
        {
            window.open(newURL, '_blank');
            shift_down = false;
        }
    }
}

function checkKeyup(event)
{
    event = event || window.event;
    if (event.keyCode=='16') shift_down = false; // [SHIFT]
}
function checkKey(event)
{
    event = event || window.event;
    if (event.keyCode=='16') shift_down = true; // [SHIFT]
    else if (page_is_content)
    {
		console.log("pressed");
        if (event.keyCode=='111') instant_download_option = true;       // [/]
        if (event.keyCode=='67' || event.keyCode=='111') getMedia(); 	// [C]

    }
    else
    {
        // If not on main content page
        if (media_in_focus || story_focus)
        {
            if (event.keyCode=='67' || event.keyCode=='104' || event.keyCode=='111')				// [C] or [num-8] or [/]
            {
                if (event.keyCode=='111') instant_download_option = true;
                getMedia();
            }
			else if (event.keyCode=='86' || event.keyCode=='88' ||			// [V] or [X] or
					 event.keyCode=='103' || event.keyCode=='105')			// [num-7] or [num-9]
			{
				// var elm_to_click = null;
                // Main Navigation Control (left right scrolling inside posts and to new posts)
                var inner_arrow_class;
                var outer_arrow_class;
                if (event.keyCode=='86' || event.keyCode=='105')
                {
                    inner_arrow_class = "coreSpriteRightChevron";
                    outer_arrow_class = "coreSpriteRightPaginationArrow";
                }
                else if (event.keyCode=='88' || event.keyCode=='103')
                {
                    inner_arrow_class = "coreSpriteLeftChevron";
                    outer_arrow_class = "coreSpriteLeftPaginationArrow";
                }

                var particular_elm_list = document.getElementsByClassName(inner_arrow_class);
                if (particular_elm_list.length > 0)
                {
                    particular_elm_list[0].parentNode.click();
                }
                else
                {
                    particular_elm_list = document.getElementsByClassName(outer_arrow_class);
                    if (particular_elm_list.length > 0) simulateMouseclick(particular_elm_list[0]);
                }
			}
			//else if (event.keyCode=='68') getMedia(true); 				// [D]
			else if (event.keyCode=='100' || event.keyCode=='102')			// [num-4] or [num-6]
			{
				// Simulate arrow keys
				var elm_to_click = null;
				if (event.keyCode=='100') elm_to_click = document.getElementsByClassName("coreSpriteLeftPaginationArrow")[0];
				else if (event.keyCode=='102') elm_to_click = document.getElementsByClassName("coreSpriteRightPaginationArrow")[0];
				if (elm_to_click != null) simulateMouseclick(elm_to_click);
			}
			else if (event.keyCode=='98' || event.keyCode=='96')			// [num-2] or [num-0]
			{
				var middle_x = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) / 2;
				var all_play_buttons = document.getElementsByClassName("videoSpritePlayButton");
				var closest_button = -1;
				var closest_dist = 2000;
				for (var i=0; i<all_play_buttons.length;i++)
				{
					var elm_left = all_play_buttons[i].getBoundingClientRect().x;

					if (elm_left >= 0)
					{
						var elm_dist = Math.abs(middle_x - elm_left);
						console.log(elm_left + ", " + elm_dist);
						if (elm_dist < closest_dist)
						{
							closest_dist = elm_dist;
							closest_button = i;
						}
					}
				}
				var elm_to_click = all_play_buttons[closest_button];
				if (elm_to_click != null) simulateMouseclick(elm_to_click);
				else console.log("play button to click is null");
			}
        }
		if (event.keyCode=='70') getFullSizeDP(); // [F]
    }
}

function downloadURL(ulr_to_save)
{
	console.log("Downloading attempt...");

	var link_elm = document.createElement("a");
		link_elm.href = ulr_to_save;
		link_elm.id = "testelm";
		link_elm.setAttribute("download","");
	document.getElementsByTagName("body")[0].appendChild(link_elm);

	var down_button = document.createElement("p");
		down_button.innerHTML = "direct download";
		down_button.style.position = "absolute";
	link_elm.appendChild(down_button);

	link_elm.click();
	document.getElementsByTagName("body")[0].removeChild(link_elm);
}

function simulateMouseclick(target, options)
{
	/*
		Code taken from: https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
	*/
	var event = target.ownerDocument.createEvent('MouseEvents'),
		options = options || {},
		opts = { // These are the default values, set up for un-modified left clicks
			type: 'click',
			canBubble: true,
			cancelable: true,
			view: target.ownerDocument.defaultView,
			detail: 1,
			screenX: 0, //The coordinates within the entire page
			screenY: 0,
			clientX: 0, //The coordinates within the viewport
			clientY: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
			button: 0, //0 = left, 1 = middle, 2 = right
			relatedTarget: null,
		};
	//Merge the options with the defaults
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			opts[key] = options[key];
		}
	}
  //Pass in the options
	event.initMouseEvent(
		opts.type,
		opts.canBubble,
		opts.cancelable,
		opts.view,
		opts.detail,
		opts.screenX,
		opts.screenY,
		opts.clientX,
		opts.clientY,
		opts.ctrlKey,
		opts.altKey,
		opts.shiftKey,
		opts.metaKey,
		opts.button,
		opts.relatedTarget
	);

	//Fire the event
	target.dispatchEvent(event);
}