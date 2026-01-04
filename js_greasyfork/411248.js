// ==UserScript==
// @name         New Userscript
// @namespace    Bend
// @version      4.54
// @description  Ease
// @author       You
// @include      https://www.tiktok.com/@*/video/*
// @include      https://www.tiktok.com/@*
// @include      *.tiktokcdn.com/*
// @include      *web.tiktok.com/video/tos/*
// @include      https://*.muscdn.com/*
// @include      https://au.carousell.com/p/*
// @include      https://www.depop.com/*
// @include      https://snaptik.app/?tk=*
// @include      *.cloudfront.net/*
// @include      https://instagram.*.fna.fbcdn.net/v/*
// @include      https://scontent-*.cdninstagram.com/*
// @include      https://izuum.com/*
// @include      https://www.instadp.com/fullsize/*
// @include      https://www.realpeople.com.au/profile/*
// @include      https://www.realpeople.com.au/images/*
// @include      https://cdn*.snaptik.app/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/411248/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/411248/New%20Userscript.meta.js
// ==/UserScript==
/*
    Note: install this addon https://chrome.google.com/webstore/detail/undisposition-racle-fork/bbppejejjfancffmhncgkhjdaikdgagc?hl=en
    This way no images will download rather than open in browser. This is so the userscript can name the files.
	Additional: it doesn't work...
*/

var searchableStr = document.URL;

var strmatch_tiktok = searchableStr.includes("tiktok.com/@");
var strmatch_tiktok_vidHighlight = searchableStr.includes("tiktok.com/@") && searchableStr.includes("/video/") && !searchableStr.includes("snaptik.app");
var strmatch_tiktok_rawvid = searchableStr.includes("muscdn.com") || searchableStr.includes("tiktokcdn.com") || searchableStr.includes("web.tiktok.com/video/tos");
var strmatch_depopp = searchableStr.includes("depop");
var strmatch_depop_prod = searchableStr.includes("depop.com/products/")
var strmatch_cloudf = searchableStr.includes("cloudfront.net");
var strmatch_aucaro = searchableStr.includes("au.carousell.com/p/");
var strmatch_instrsc = searchableStr.includes("fna.fbcdn.") || searchableStr.includes("cdninstagram");
var strmatch_instadp = searchableStr.includes("izuum");
var strmatch_instadp_2 = searchableStr.includes("instadp.com/fullsize/")
var strmatch_realppl = searchableStr.includes("realpeople");
var strmatch_realppl_src = searchableStr.includes("realpeople.com.au/images/");
var strmatch_tiktok_getsite = searchableStr.includes("snaptik.app/?tk=");
var strmatch_tiktok_getsite_media = searchableStr.includes("snaptik.app") && searchableStr.includes("dl.php");

var strmatch_depop_prod_focusrefresh = 0;
var depop_prod_pageisdown = false;
var depop_navigation_arrow = 0;
var depop_navigation_arrow_max = 1;
var window_close_on_focus = false;
var download_content_page = false;
var depop_prod_allMedia = [];
var depop_prod_selector = -1;

document.addEventListener('keydown', pressIt, false);
window.addEventListener("focus", windowFocus, false);
window.addEventListener("scroll", windowScroll, false);
// Webpage fully loaded [listener]
if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
else {document.addEventListener('load', afterLoad, false);}

if (strmatch_cloudf || strmatch_instrsc || strmatch_tiktok_rawvid || strmatch_realppl_src || strmatch_tiktok_getsite_media)
{
    setup_strmatch_cloudf();
    download_content_page = true;
}
if (strmatch_instadp)
{
    removeElement(document.getElementById("main-header"));
    removeElement(document.getElementById("main-footer"));
    removeElement(document.getElementsByClassName("et_pb_code_inner")[0]);
}
if (strmatch_cloudf)
{
    if (searchableStr.includes("m_")) window.location.href = searchableStr.replace("m_", "");
}
if (strmatch_depopp)
{
	dynamicallyLoadScript("https://github.com/niklasvh/html2canvas/releases/download/v1.0.0-rc.7/html2canvas.js");
	console.log("imported JS");
}

function afterLoad()
{
    if (strmatch_depopp)
    {
        removeElement(document.getElementsByClassName("CovidBannerstyles__StyledBanner-sc-1mwsgry-0")[0]);
		removeElement(document.getElementsByClassName("duVwHZ")[0]);
        removeElement(document.getElementsByTagName("header")[0]);
        removeElement(document.getElementsByClassName("styles__Cookie-sc-8dzl2j-0")[0]);
		document.getElementsByTagName("footer")[0].style.display = "none";
        if (strmatch_depop_prod) depop_postload_productpage();
        else depop_links_to_blank();

		var sheet = document.createElement('style')
        sheet.innerHTML = ".special_prod_selector{border: red solid 4px; border-radius: 12px;} html {scroll-behavior: smooth;}";
        document.body.appendChild(sheet);
    }
    else if (download_content_page)
    {
        if (searchableStr.includes("instantdownload_go"))
        {
            console.log("element instant-clicked");
            //document.getElementById("iamtheoneyouwant").click();
            //window.close();
        }
        else console.log("element not a instant-click");
    }
	else if (strmatch_instadp_2)
	{
		window.location.href = document.getElementsByClassName("download-btn")[0].href;
	}
    else if (strmatch_instadp)
    {
        var img_elm_array = document.getElementsByClassName("et_pb_section_2")[0].getElementsByTagName("img");
        //var img_elm_array = document.getElementsByClassName("et_pb_section_3")[0].getElementsByTagName("img");
        console.log("length: " + img_elm_array.length);

        if (img_elm_array.length <= 0)
        {
            var potential_usrname = searchableStr.slice(searchableStr.indexOf("?")+1,searchableStr.length);
            potential_usrname = potential_usrname.replace("user=", "");
            console.log(potential_usrname);
            document.getElementById("birds").value = potential_usrname;

            removeElement(document.getElementById("birds2"));

            var subbutt = document.createElement("input");
            subbutt.type = "submit";
            subbutt.value = "submit";
            subbutt.id = "super_submit_btn";
            document.getElementsByTagName("form")[0].appendChild(subbutt); // This was [0], but the other element  gets removed now...
            //document.getElementsByTagName("form")[1].appendChild(subbutt); // This was [0], but now there is a donate form
            subbutt.click();
        }
        else
        {
            var img_src = img_elm_array[0].src;
            window.location.href = img_src;
        }
    }
	else if (strmatch_tiktok_vidHighlight)
	{
		// The content does not load as normal content... so, this will execute before the DOM is actually loaded. So, a timer is used
		setTimeout(function()
		{
            if (searchableStr.includes("autocontent"))
            {
                tiktok_keypressExecute();
            }
            else
            {
                var insert_cont = document.getElementsByClassName("action-left")[0];
                var new_button = document.createElement('button');
                new_button.classList = "wpO6b ins_dwnld_btn";
                new_button.style = "position: absolute; top: 19px; cursor: pointer;"
                new_button.type = "button";
                insert_cont.appendChild(new_button);
                new_button.addEventListener("click", tiktok_keypressExecute);
                // inner image
                var new_button_img = document.createElement('img');
                new_button_img.src = "https://cdns.iconmonstr.com/wp-content/assets/preview/2018/96/iconmonstr-save-thin.png";
                new_button_img.style = "max-height: 25px;"
                new_button.appendChild(new_button_img);
            }
		}, 1500);
	}
	else if (strmatch_tiktok_getsite)
	{
		var main_cont = document.getElementById("get_video");
		if (main_cont.style.display != "none")
		{

			if (!document.getElementsByClassName("progress")[0].classList.contains("active")) // not currently working
			{
				var url_content = window.location.href;
				var qmark_location = url_content.indexOf("?");
				var arguments = url_content.substring(qmark_location + 1, url_content.length);
				url_content = url_content.substring(0, qmark_location);
				console.log(url_content);

				var tiktok_url = arguments.substring(arguments.indexOf("tk=")+3, arguments.length);

				main_cont.getElementsByTagName("input")[0].value = tiktok_url;
				main_cont.getElementsByTagName("button")[0].click();
			}

			setTimeout(afterLoad, 1000); // every second poll to then click the get media button (sice no href change)
		}
		else
		{
			var button_to_press = document.getElementsByClassName("zhay")[0].getElementsByTagName("a")[1];
			//https://snaptik.app/?tk=https://www.tiktok.com/@marissams.16/video/6715231775133535493?pd=2019-7-19
			var url_content = window.location.href;
			var arguments = url_content.substring(url_content.indexOf("?") + 1, url_content.length);
			var date_stamp = arguments.split("?pd=")[1];

			button_to_press.href = button_to_press.href + "&pd=" + date_stamp;
			button_to_press.click();
		}

	}
    else if (strmatch_realppl)
    {
        var sheet = document.createElement('style')
        sheet.innerHTML = ".photo_thumb {height: 1079px;} .photo_thumb img:hover {transform: scale(1.1); cursor: pointer;} .photo_display {display: flex; width: 475px;} .photo_container {display:none;}";
        document.body.appendChild(sheet);

        var all_media_imgs = document.getElementsByClassName("photo_thumb")[0].getElementsByTagName("img")
        for (var i=0;i<all_media_imgs.length; i++)
        {
            all_media_imgs[i].addEventListener("click", open_img_src);
        }

        var all_media_imgs_cc = document.getElementsByClassName("general_compcard")[0].getElementsByTagName("img")
        for (i=0;i<all_media_imgs_cc.length; i++)
        {
            all_media_imgs_cc[i].addEventListener("click", open_img_src);
        }

        // Tweaks
        var title_elm = document.getElementsByClassName("title_profile")[0];
        title_elm.innerHTML = "<p>" + title_elm.innerHTML + "</p>";

        //document.getElementsByClassName("profile_general")[0].scrollIntoView(true);
        setTimeout(function(){document.getElementsByClassName("profile_general")[0].scrollIntoView(true);}, 0);

        // Add Open All button
        var button_to_use = document.getElementsByClassName("go_back")[0];
        button_to_use.href = "javascript:void(0);";
        button_to_use.innerHTML = "Open All";
        button_to_use.addEventListener("click", function () {
            var all_media_imgs = document.getElementsByClassName("photo_thumb")[0].getElementsByTagName("img")
            for (var i=0;i<all_media_imgs.length; i++)
            {
                all_media_imgs[i].click();
            }
        });
    }
    else if (strmatch_tiktok)
    {
        // because of lazy loading messing up the code
		setTimeout(tiktok_vidsInNewTabs_updater, 2000);
        //setTimeout(tiktok_vidsInNewTabs, 2000);
        //tiktok_vidsInNewTabs();
    }
}
function windowFocus()
{
    if (strmatch_depop_prod)
    {
        if (depop_prod_pageisdown)
        {
            console.log("going up");
            window.scrollTo(0, 0);
            depop_prod_pageisdown = false;
        }
    }
    else if (strmatch_cloudf)
    {
        setup_strmatch_cloudf();
    }

    if (window_close_on_focus) window.close();
}
function windowScroll()
{
    if (strmatch_depopp)
    {
        if (!strmatch_depop_prod) depop_links_to_blank();
        else depop_postload_productpage_updatelinks();
    }
    else if (strmatch_tiktok)
    {
        //tiktok_vidsInNewTabs();
		tiktok_vidsInNewTabs_updater();
    }
}
function windowClose()
{
    window.close();
}

function pressIt(event)
{
    event = event || window.event;
    if (strmatch_aucaro)
    {
        // On keypress 'D' (this doesn't work because of security limitiations)
        if (event.keyCode=='68') window.close();
    }
    else if (strmatch_tiktok)
    {
        // On keypress 'C'
        if (event.keyCode=='67')
		{
			tiktok_keypressExecute();
		}
    }
    else if (strmatch_depopp && searchableStr.includes("depop.com/products/"))
    {
        // Navigation
        if (clickCheck("nav-left", event.keyCode))
        {
            depop_productpage_navigate(-1);
        }
        else if (clickCheck("nav-right", event.keyCode))
        {
            depop_productpage_navigate(1);
        }
        else if (clickCheck("nav-execute", event.keyCode))
        {
			var elm_in_q = depop_prod_allMedia[depop_navigation_arrow];
			if (elm_in_q.tagName == "IMG")
            {
				var name_str = elm_in_q.parentNode.getElementsByTagName("a")[0].href;

				// Check the links have been updated (this is a glitch)
				if (name_str.indexOf(".jpg") < 0)
				{
					depop_postload_productpage_addlinks();
					name_str = elm_in_q.parentNode.getElementsByTagName("a")[0].href;
				}

                // copy a suggested filename to the clipboard
				var name_str = elm_in_q.parentNode.getElementsByTagName("a")[0].href;
				var all_parts = name_str.split("/");
				var dateStmp = all_parts[all_parts.length-1].replace("?ts=", "");
				dateStmp = dateStmp.substring(6, dateStmp.length);
				var out_str = dateStmp + "   " + all_parts[all_parts.length-2] + '.jpg';
                copy_to_clip(out_str);

                elm_in_q.parentNode.getElementsByTagName("a")[0].click();
            }
			else if (elm_in_q.classList.contains("JxWOU"))
			{
				// It's a video
				var date_section = document.getElementsByClassName("dFgHcz")[0];
				var year_stamp = "?ts=" + date_section.getAttribute("datetime").substring(0, 10);

				var resource = elm_in_q.getElementsByTagName("source")[0].src + year_stamp;
				window.open(resource);
			}
            // Then navigate to next
            depop_productpage_navigate(1);
        }
        else if (clickCheck("nav-quit", event.keyCode))
        {
            window.close();
        }
		else if (clickCheck("nav-ss", event.keyCode))
		{
			console.log("ss");
			// create a new element to capture		 (didn't help capture the img)
			/*
			if (!document.getElementById("cool_new_eml"))
			{
				var new_elm = document.createElement('div');
				new_elm.style.display = "flex";
				document.body.appendChild(new_elm);

				var new_img = document.createElement('img');
				new_img.src = document.getElementsByClassName("byiVlq")[0].src.replace("U2", "U5");
				new_elm.appendChild(new_img);

				var new_title = document.getElementsByClassName("jNASfP")[0].getElementsByTagName("div")[1].cloneNode(true);
				new_title.style.display = "inline-block";
				new_title.style.margin = "14px";
				new_elm.appendChild(new_title);
				new_elm.id = "cool_new_eml";
			}
			*/

			html2canvas(document.getElementsByClassName('iNGlri')[0]).then( function(canvas) {
			//html2canvas(document.getElementById('cool_new_eml')).then( function(canvas) {
				document.body.appendChild(canvas);
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = '00 - ' + document.getElementsByClassName("cHKrLa")[0].innerHTML + '.png';
				a.click();

				removeElement(document.getElementsByTagName("canvas")[0]);
			});
			// also get DP
			window.open(document.getElementsByClassName("byiVlq")[0].src.replace("U2", "U5"), '_blank');
		}
    }
	else if (strmatch_depopp)
	{
		var classname_to_grab = "bVpHsn"; //"cKdjfY", "bmyOnE"

		// non-product depop page
		if (clickCheck("nav-left", event.keyCode))			nonproductpage_navigate(-1);
		else if (clickCheck("nav-bigleft", event.keyCode))	nonproductpage_navigate(-6);
        else if (clickCheck("nav-right", event.keyCode))	nonproductpage_navigate(1);
		else if (clickCheck("nav-bigright", event.keyCode))	nonproductpage_navigate(6);
		else if (clickCheck("nav-execute", event.keyCode))
		{
			var all_the_things = document.getElementsByClassName(classname_to_grab);
			all_the_things[depop_prod_selector].click();
			nonproductpage_navigate(1);
		}
		else if (clickCheck("nav-ss", event.keyCode))
		{
			var deet_elm = document.getElementsByClassName("PBfHO")[0];
			deet_elm.style.width = "600px";

			html2canvas(document.getElementsByClassName('PBfHO')[0]).then( function(canvas) {
				document.body.appendChild(canvas);
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = '00 - deets.png';
				a.click();

				removeElement(document.getElementsByTagName("canvas")[0]);
				document.getElementsByClassName("PBfHO")[0].style.width = "auto";
			});
		}

		function nonproductpage_navigate(direction)
		{
			var all_the_things = document.getElementsByClassName(classname_to_grab);
			var max_limit = all_the_things.length;
			if (depop_prod_selector > -1)
			{
				all_the_things[depop_prod_selector].classList.remove("special_prod_selector");
			}

			depop_prod_selector += direction;
			if (depop_prod_selector >= max_limit) depop_prod_selector = 0;
			else if (depop_prod_selector < 0) depop_prod_selector = max_limit -1;

			var new_selected_elm = all_the_things[depop_prod_selector];

			new_selected_elm.classList.add("special_prod_selector");
			new_selected_elm.scrollIntoView(true);
		}
	}
    //else if (strmatch_cloudf || strmatch_instrsc)
    else if (download_content_page)
    {
        if (clickCheck("nav-execute", event.keyCode)) document.getElementById("iamtheoneyouwant").click();
        else if (clickCheck("nav-quit", event.keyCode)) window.close();
    }
}
// Keypress Functions (for buttons)
function tiktok_keypressExecute()
{
	// Get the date string
	/*
		Note: it doesn't like me adding info into the string and will throw an error
	*/

	if (false)
	{
		var vid_src = document.getElementsByTagName("video")[0].src;
		var temp_el = document.createElement('a');
		temp_el.href = vid_src;

		var clean_str = vid_src.substring(9,vid_src.indexOf("?"));
		var brkn_str = clean_str.split("/");
		var filename_str = brkn_str[brkn_str.length-2];

		var dateStampStr = document.lastModified.substring(0,10);
		var dateStampStr_split = dateStampStr.split("/");
		var dateStamp = dateStampStr_split[2] + "-" + dateStampStr_split[0] + "-" + dateStampStr_split[1];

		temp_el.download = dateStamp + "   " + filename_str + ".mp4";

		document.body.appendChild(temp_el);
		temp_el.click();
		document.body.removeChild(temp_el);
	}
	else
	{
		// alternative website while tiktok code is broken
		var post_date = ""
		var get_things = document.getElementsByClassName("author-nickname");
		if (get_things.length < 1) get_things = document.getElementsByClassName("user-nickname");
		if (get_things.length > 0)
		{
			var post_date_rawData = get_things[0].innerHTML;
			if (post_date_rawData)
			post_date = post_date_rawData.substring(post_date_rawData.indexOf("</span>")+7,post_date_rawData.length);
			//console.log(post_date);
			if (post_date.indexOf("ago") > -1)
			{
				var numMult = 1;
				var numBase = parseInt(post_date);
				if (post_date.indexOf("w ago") > 0) numMult = 7;
				if (post_date.indexOf("m ago") > 0) numMult = 0;
				//console.log(numBase * numMult);
				var tmp_dte = new Date();
				tmp_dte.setDate(tmp_dte.getDate() - (numBase * numMult));
				post_date = tmp_dte.getFullYear() + "-" + (tmp_dte.getMonth()+1) + "-" + tmp_dte.getDate();
			}
			else if(char_count(post_date, "-") < 2)
			{
				var this_year = new Date().getFullYear();
				post_date = this_year + "-" + post_date;
			}
		}
		var website_main = "https://snaptik.app/?tk="
		var new_url = website_main + window.location.href + "?pd=" + post_date;
		window.location.href = new_url;
		//https://snaptik.app/?tk=https://www.tiktok.com/@bhadbri7/video/6869456252527807750
	}
}

// Specific Functions
function setup_strmatch_cloudf()
{
    if (document.getElementById("iamtheoneyouwant") == null)
    {
        var is_image = searchableStr.includes(".jpg") || searchableStr.includes(".png");
        var main_img;
        if (is_image)
        {
            main_img = document.getElementsByTagName("img")[0];
        }
        /*
        else if (strmatch_tiktok_rawvid)
        {
			"&ts="
        }
        */
        else
        {
            main_img = document.getElementsByTagName("source")[0];
        }

        var new_a = document.createElement("a");
        new_a.href = main_img.src;
        new_a.id = "iamtheoneyouwant";
        new_a.style.position = "absolute";
        new_a.style.width = "200px";
        new_a.style.height = "50px";
        new_a.style.left = "0";
        new_a.style.top = "0";
        new_a.style.backgroundColor = "#7b253f";
        new_a.style.color = "black";
        new_a.style.textAlign = "center";
        new_a.innerHTML = "Download";
        if (main_img.src.includes("P7.jpg") || main_img.src.includes("P8.jpg"))
        {
            var dateStmp = window.location.search.replace("?ts=", "");

            var new_name = main_img.src.substring(8, main_img.src.length - 7);
            new_name = new_name.substring(0, new_name.indexOf(".jpg")) ;
            var all_parts = new_name.split("/");
            new_a.download = dateStmp + "   " + all_parts[all_parts.length-2] + '.jpg';
        }
		else if (main_img.src.includes("cloudfront.net") && main_img.src.includes(".mp4"))
		{
			// depop vid
			var dateStmp = window.location.search.replace("?ts=", "");
			var new_name = main_img.src.substring(8, main_img.src.length - 14);
			var all_parts = new_name.split("/");
			console.log(all_parts[3]);
            new_a.download = dateStmp + "   " + all_parts[3];
		}
		else if (strmatch_tiktok_getsite_media)
		{
			var url_content = window.location.href;
			var arguments = url_content.substring(url_content.indexOf("?") + 1, url_content.length);
			var date_stamp = "[no date]";
			if (arguments.indexOf("&pd=") != arguments.length-4)
			{
				date_stamp = arguments.split("&pd=")[1];

				if (date_stamp.length < 10)
				{
					var ds_split = date_stamp.split("-");
					if (ds_split[1].length < 2) ds_split[1] = "0" + ds_split[1];
					if (ds_split[2].length < 2) ds_split[2] = "0" + ds_split[2];
					date_stamp = ds_split[0] +"-"+ ds_split[1] +"-"+ ds_split[2];
				}
			}
			var filestr = arguments.substring(arguments.indexOf("&id_video=") + 10, arguments.indexOf("&pd=") - 5);
			console.log(date_stamp + "   " + filestr);
			new_a.download = date_stamp + "   " + filestr + ".mp4";

			new_a.addEventListener("click", function () {
				copy_to_clip(date_stamp + "   " + filestr + ".mp4");
				console.log(date_stamp + "   " + filestr + ".mp4");
			});
		}
        else if (strmatch_tiktok_rawvid)
        {
			var clean_str = main_img.src.substring(9,main_img.src.indexOf("?"));
			var brkn_str = clean_str.split("/");
			var filename_str = brkn_str[brkn_str.length-2];

			var dateStampStr = document.lastModified.substring(0,10);
			var dateStampStr_split = dateStampStr.split("/");
			var dateStamp = dateStampStr_split[2] + "-" + dateStampStr_split[0] + "-" + dateStampStr_split[1];

			new_a.download = dateStamp + "   " + filename_str + ".mp4";
			/*
			// File download gets forbidden if the name is changed, so clipboard like depop
			new_a.href = "javascript:void(0)";
			new_a.addEventListener("click", function () {
				copy_to_clip(dateStamp + "   " + filename_str);
				console.log(dateStamp + "   " + filename_str);
			});
			*/
        }
		else if (strmatch_instrsc)
		{
			var working_str = document.URL.substring(8, document.URL.indexOf("?"));
			var broken_url = working_str.split("/");
			var filename = broken_url[broken_url.length-1];

			var location_of_ds = document.URL.indexOf("&dnld_ts=");
			if (location_of_ds < 0)
			{
				// no datestamp
				var datestamp = document.lastModified.substring(0,10);
				var ds_year = datestamp.substring(6,10);
				datestamp = ds_year + "-" + datestamp;
				datestamp = datestamp.substring(0,10);
				datestamp = datestamp.replace('/', '-');
				console.log(datestamp);
			}
			else
			{
				var datestamp = document.URL.substring(document.URL.indexOf("&dnld_ts=")+9,document.URL.length);
			}

			new_a.download = datestamp + "   " + filename;
		}
        else if (strmatch_tiktok_rawvid || strmatch_realppl_src)
        {
            new_a.download = "";
        }
        if (is_image) main_img.parentNode.appendChild(new_a);
        else main_img.parentNode.parentNode.appendChild(new_a);
        new_a.addEventListener("click", function newfunction() {window_close_on_focus = true;});
    }
}
function depop_links_to_blank()
{
	var classname_str = "bVpHsn"; // prev "iRAalM", "bmyOnE"

    //var all_prod_links = document.getElementsByClassName("YcaYq");		// Old class name
	/*
		The line below will get the second <img> on the page, and grab the class of its <a>. Should work for search and profile pages.
	*/

	//var class_name = document.getElementsByTagName("img")[1].parentNode.parentNode.classList.value;
	//var all_prod_links = document.getElementsByClassName(class_name);
	//var all_prod_links = document.getElementsByClassName(document.getElementsByTagName("img")[1].parentNode.parentNode.classList.value);
	var all_prod_links = all_prod_links = document.getElementsByClassName(classname_str); // new class name

	//if (all_prod_links.length == 0) all_prod_links = document.getElementsByClassName(classname_str); // new class name
    for (var i=0; i<all_prod_links.length; i++) all_prod_links[i].target = "_blank";
}
function depop_productpage_navigate(direction)
{
    depop_navigation_arrow += direction;
    if (depop_navigation_arrow >= depop_navigation_arrow_max) depop_navigation_arrow = 0;
    else if (depop_navigation_arrow < 0) depop_navigation_arrow = depop_navigation_arrow_max -1;

	depop_prod_allMedia[depop_navigation_arrow].scrollIntoView();
}
function depop_postload_productpage()
{
    if (searchableStr.includes("depop.com/products/"))
    {
        // Delete the mobile node (no point in leaving it there, plus it conlicts)
        var mobile_display_elm = document.getElementsByClassName("cGxJUF")[0];
        mobile_display_elm.parentNode.removeChild(mobile_display_elm);
        // Hide the top bar
        //document.getElementsByClassName("duVwHZ")[0].style.display = "none";

		// Add the listed date into the page:
		var date_section = document.getElementsByClassName("dFgHcz")[0]; // old name: eTMzfu
		var year_stamp = date_section.getAttribute("datetime").substring(0, 10);
		var new_date_section = document.createElement("time");
			new_date_section.innerHTML = year_stamp;
			new_date_section.classList = "Time-pkm14p-0 dFgHcz";
		date_section.parentNode.appendChild(new_date_section);

        // Scroll to bottom of page and back up (to load lazy images (will find better workaround one day)...
        var min_wait_time = 50;
        window.scrollTo(0,document.body.scrollHeight); depop_prod_pageisdown = true;
        document.getElementsByTagName("html")[0].style.scrollBehavior = "smooth";
        setTimeout(function(){ depop_postload_productpage_addlinks(); }, min_wait_time + 75);

        // Navigation setup
		var all_images = document.getElementsByClassName("cKdjfY");
		var all_videos = document.getElementsByClassName("JxWOU");
		var all_media_l = all_images.length + all_videos.length;
		var all_media = [];
		for (var cnt_i=0; cnt_i<all_media_l; cnt_i++)
		{
			if (cnt_i < all_images.length) all_media[cnt_i] = all_images[cnt_i];
			else all_media[cnt_i] = all_videos[cnt_i-all_images.length];
		}
		depop_prod_allMedia = all_media;
        depop_navigation_arrow_max = all_media.length;
    }
}
function depop_postload_productpage_addlinks()
{
    var all_images = document.getElementsByClassName("cKdjfY");
    var num_of_imgs = all_images.length;
    for (var i=0; i<num_of_imgs; i++)
    {
        // get make source the bigger
        var bigger_src_img = all_images[i].src.replace("P0","P8"); // was P7 but now there is P8
        all_images[i].src = bigger_src_img;
        console.log(bigger_src_img);

        // For every image make a link overlay
        var new_a = document.createElement("a");
        new_a.href = bigger_src_img;
        new_a.target = "_blank";
        new_a.style.width = "100%";
        new_a.style.height = "100%";
        new_a.style.top = "0";
        new_a.style.position = "absolute";
        all_images[i].parentNode.appendChild(new_a);
    }
}
function depop_postload_productpage_updatelinks()
{
    var date_section = document.getElementsByClassName("dFgHcz")[0];
    var year_stamp = date_section.getAttribute("datetime").substring(0, 10);

    var all_images = document.getElementsByClassName("cKdjfY");
    var num_of_imgs = all_images.length;
    for (var i=0; i<num_of_imgs; i++)
    {
        // get make source the bigger
        var bigger_src_img = all_images[i].src.replace("P0","P8");	// was P7 but now there is P8
        all_images[i].src = bigger_src_img;
        all_images[i].parentNode.getElementsByTagName("a")[0].href = bigger_src_img + "?ts=" + year_stamp;
    }
}
function tiktok_vidsInNewTabs()
{
	var all_entries = document.getElementsByClassName("video-feed-item");
	for (var i=0,m=all_entries.length; i<m; i++)
	{
		if (all_entries[i].getElementsByClassName("newTab_linkOpener").length <= 0)
		{
			all_entries[i].style.position = "relative";

			var link_out = all_entries[i].getElementsByTagName("a")[0].href;
			var new_link = document.createElement("a");
			new_link.href = link_out + "?autocontent";
			new_link.className = "newTab_linkOpener";
			new_link.target = "_blank";
			new_link.style.width = "100%";
			new_link.style.height = "80%"; /*so the vid can be previewed by mouse-over bottom*/
			new_link.style.position = "absolute";
			new_link.style.top = "0";

			all_entries[i].appendChild(new_link);
		}
	}
}
function tiktok_vidsInNewTabs_updater()
{
	var all_entries = document.getElementsByClassName('video-feed-item');
	console.log("All entries: " + all_entries.length);
	for (var i=0,m=all_entries.length; i<m; i++)
	{
		var checkler = all_entries[i].getElementsByClassName('dnldbtn');
		if (checkler.length < 1)
		{
			var vid_elm = all_entries[i].getElementsByTagName('video');
			var vid_elm_it = vid_elm[0];
			if (vid_elm_it)
			{
				var link_out = vid_elm_it.src
				var actionbar = all_entries[i].getElementsByClassName('pc-action-bar')[0];
				// Get the date
				var post_date = "[no date]";
				var get_things = all_entries[i].getElementsByClassName("author-nickname");
				if (get_things.length > 0)
				{
					var post_date_rawData = get_things[0].innerHTML;
					if (post_date_rawData)
					post_date = post_date_rawData.substring(post_date_rawData.indexOf("</span>")+7,post_date_rawData.length);
					if (post_date.indexOf("ago") > -1)
					{
						var numMult = 1;
						var numBase = parseInt(post_date);
						if (post_date.indexOf("w ago") > 0) numMult = 7;
						if (post_date.indexOf("m ago") > 0) numMult = 0;
						var tmp_dte = new Date();
						tmp_dte.setDate(tmp_dte.getDate() - (numBase * numMult));
						post_date = tmp_dte.getFullYear() + "-" + (tmp_dte.getMonth()+1) + "-" + tmp_dte.getDate();
					}
					else if(char_count(post_date, "-") < 2)
					{
						var this_year = new Date().getFullYear();
						post_date = this_year + "-" + post_date;
					}
				}
				var new_sect = document.createElement("div");
				new_sect.style.height = "50px";
				new_sect.style.width = "50px";
				new_sect.style.color = "black";
				new_sect.style.backgroundColor = "pink";
				new_sect.style.borderRadius = "25px"
				new_sect.className = "dnldbtn";

				var new_link = document.createElement("a");
				new_link.target = "_blank";
				new_link.href = link_out + "?pd=" + post_date;
				new_link.download = post_date + ".mp4"

				actionbar.appendChild(new_link);
				new_link.appendChild(new_sect);
			}
		}
	}
}
function open_img_src()
{
    window.open(event.target.src);
}
// Function Tools
function char_count(str, letter)
{
	var letter_Count = 0;
	for (var position = 0; position < str.length; position++)
	{
		if (str.charAt(position) == letter)
		{
			letter_Count += 1;
		}
	}
	return letter_Count;
}
function dynamicallyLoadScript(url)
{
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}
function copy_to_clip(string_text)
{
    var temp_el = document.createElement('textarea');
    temp_el.value = string_text;
    document.body.appendChild(temp_el);
    temp_el.select();
    document.execCommand('copy');
    document.body.removeChild(temp_el);
}
function removeElement(element)
{
    if (element && element.parentNode) element.parentNode.removeChild(element);
}
function clickCheck(type, keycode)
{
    if (type == "nav-left") // [[] or [V]
    {
        if (keycode=='219' || keycode=='186') return true;
    }
    else if (type == "nav-right") // []] or [X]
    {
        if (keycode=='221' || keycode=='222') return true;
    }
    else if (type == "nav-execute") // [C] or ['] (next to enter key) or [Enter] or [\]
    {
        if (keycode=='67' || keycode=='222' || keycode=='13' || keycode=='220') return true;
    }
    else if (type == "nav-quit") // [ESC] or [;] or [p]
    {
        if (keycode=='27' || keycode=='186' || keycode=='80') return true;
    }
	else if (type == "nav-bigleft") // [-] or [-](num)
	{
		if (keycode=='189' || keycode=='109') return true;
	}
	else if (type == "nav-bigright") // [+] or [+](num)
	{
		if (keycode=='187' || keycode=='107') return true;
	}
	else if (type == "nav-ss") // [S] or [L]
	{
		if (keycode=='83' || keycode=='76') return true;
	}
    return false;
}