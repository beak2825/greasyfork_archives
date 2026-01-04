// ==UserScript==
// @name        Insta Grabber Companion
// @namespace   PolllyPecker
// @include     https://www.instagram.com/*
// @version     1.41
// @description Tool to get raw images and vids
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/370791/Insta%20Grabber%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/370791/Insta%20Grabber%20Companion.meta.js
// ==/UserScript==

if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
else {document.addEventListener('load', afterLoad, false);}

// General Variables
var shift_down = false;
var new_tab_override = false;
var header_number = 0;

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
        //containerDiv.style.fontFamily="monospace";
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
    //if (caller_id == "img_but0" || caller_id == "img_but1") getMedia();
    //else if (caller_id == "vid_but0" || caller_id == "vid_but1") getMedia();
    new_tab_override = false; // reset the toggle
}
function getMedia()
{
    var newURL = "";

    if (story_focus)
    {
        var story_cont = document.getElementsByTagName("header")[0].parentNode;
        var img_collect = story_cont.getElementsByTagName("img");
        var vid_collect = story_cont.getElementsByTagName("video");

        console.log("Num of imgs: " + img_collect.length);
        console.log("Num of vids: " + vid_collect.length);

        if (vid_collect.length > 0) newURL = vid_collect[0].getElementsByTagName("source")[0].src;
        else if (img_collect.length > 1) newURL = img_collect[1].src;
    }
    else
    {
        //var cont = document.getElementsByClassName("YlNGR")[0].getElementsByTagName("img");
        var cont = document.getElementsByClassName("FFVAD");
        var all_img_boys = null;
        if (original_url.includes("instagram.com/p/")) all_img_boys = document.getElementsByClassName("KL4Bh");
        else all_img_boys = document.getElementsByClassName("zZYga")[0].getElementsByClassName("KL4Bh");

        console.log("There are " + all_img_boys.length + " <img> elements.");

        var closest_to_zero = -1;
        var closest_measure = 2000;
        var str_url = "";
        for (var i=0; i< all_img_boys.length; i++)
        {
            var img_elm = all_img_boys[i].getElementsByClassName("FFVAD")[0];
            var bbox_x_dist = Math.abs(img_elm.getBoundingClientRect().x);
            if (bbox_x_dist < closest_measure)
            {
                closest_measure = bbox_x_dist;
                closest_to_zero = i;
                str_url = img_elm.src;
            }
        }
        if (str_url != "")
        {
            window.open(str_url, '_blank');
        }
        else
        {
            //console.log("URL is blank, so is vid.");
            var vid_elm = document.getElementsByClassName("oJub8")[0].getElementsByTagName("video")[0];
            window.open(vid_elm.src, '_blank');
        }
        /*
        var vid_contain = document.getElementsByTagName("video")[0];
        if (vid_contain)
        {
            console.log("Vid element exists.");
            newURL = vid_contain.src;
        }
        else
        {
            var img_contain = document.getElementsByClassName("KL4Bh")[0].getElementsByTagName("img")[0];
            if (!page_is_content)
            {
                var main_loci = document.getElementsByTagName("header")[1].parentNode;
                img_contain = main_loci.getElementsByClassName("KL4Bh")[0].getElementsByTagName("img")[0];
            }
            newURL = img_contain.src;
        }
        */
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
        if (event.keyCode=='67') getMedia(); // [C]
    }
    else
    {
        // If not on main content page
        if (media_in_focus || story_focus)
        {
            if (event.keyCode=='67') getMedia(); // [C]
        }
    }
}