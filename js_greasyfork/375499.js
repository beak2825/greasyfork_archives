// ==UserScript==
// @name         Rule34Hentai Improved
// @namespace    Hentiedup
// @author       Hentiedup
// @version      1.3.3
// @icon         https://i.imgur.com/Aea35p5.png
// @description  Fixes stuff, adds like/favorite/Mark-as-read under images, highlights animated, makes the site more compact, etc.
// @license      unlicense
// @match        https://rule34hentai.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @noframes
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/375499/Rule34Hentai%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/375499/Rule34Hentai%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Temporary fix for multi tag search issue. (credit mostly to SUzuhara)
    (() => {
        const currentURL = window.location.href;
        const fixedURL = currentURL.replace(/%20|\s/g, '+');
        if (currentURL !== fixedURL) {
            window.location.href = fixedURL;
        }
    })();

    var BlockedTagsString, MarkedAsSeenString, Settings;
    LoadSettings(); //populate: BlockedTagsString, MarkedAsSeenString, Settings

    var banIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ban" class="svg-inline--fa fa-ban fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"></path></svg>`;
    var eyeIcon = `<svg class="eyeIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path></svg>`;
    var eyeSlashIcon = `<svg class="eyeSlashIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye-slash" class="svg-inline--fa fa-eye-slash fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path></svg>`;

    //AJAX post loading variables
    var path, pageNumString, pageNum, hadPageNum, loadingPage, stopLoading;

    if(Settings["ExperimentalExtraAdRemoval"]) {
        //NOT A GOOD WAY TO DO THIS, BUT IT WORKS, SO DOING IT FOR NOW...
        setInterval(() => {
            $("script[src*='popunder'], script[src*='adsco.re'], script[src*='nativeads'], script[src*='wpnsrv.com'], script[src*='xadsmart.com'], script[src*='bxczchdxynw.com'], script[src*='vsyaiejmfooba.com']").remove();
            $("script[src*='irtyvhrthhya.com'], script[src*='realsrv.com'], script[src*='/zuofwximhl.php'], script[src*='wpnjs.com']").remove(); //unsure
            $("head iframe").remove();
        }, 10);
    }

    if(Settings["OnlyAnimated"]) {
        //if in post lists, but doesn't include animated
        if(window.location.href.includes("/post/list") && !(/list\/.*(%20)?Animated(%20)?/g).test(window.location.href))
        {
            window.stop();
            $("body").html("");
            let newUrl;
            const splitted = window.location.href.split("/list/");
            if(splitted && splitted.length >= 2)
            {
                const partToCheck = splitted[1].split("?")[0].split("#")[0];
                newUrl = splitted[0] + "/list/Animated%20" + ((partToCheck == "" || /^\d+$/.test(partToCheck)) ? "/" : "") + splitted[1];
            }
            else
                newUrl = window.location.href + "/Animated%20/";

            window.location.href = newUrl;
        }
    }

    $(function() {
        //fix new tabs (chrome problem only, apparently)
        if(!!window.chrome)
        {
            //! Right now it would seem I pretty much need to rewrite the search tag handling myself to prevent the new tab behaviour for removing tags

            //Find submit button
            $("#Navigationleft form input[value='Find']").click((e) => {
                e.preventDefault();
                e.stopPropagation();
                $("#Navigationleft form")[0].submit();
            });

            //Find form
            $("#Navigationleft form").submit((e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });

            //download
            let DLTarget = $("#Post_Controlsleft > .blockbody > a[download]");
            if(!!DLTarget && DLTarget.length > 0)
            {
                DLTarget.replaceWith(`<a href="`+DLTarget.prop("href")+`" download><button id="newDLButton" class="image_button_set">Download</button></a>`);
                $("#newDLButton").click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let link = document.createElement("a");
                    let nameArr = $(this).parent().prop("href").split("/");
                    link.download = decodeURI(nameArr[nameArr.length-1]);
                    link.href = $(this).parent().prop("href");
                    link.click();
                });
            }

            //main header img link
            let mainHeaderImg = $("#header h1 a");
            if(!!mainHeaderImg && mainHeaderImg.length > 0)
            {
                $("#header h1").prop("style", "position: relative;");
                $("#header h1").append(`<a id="mainheaderImg" href="`+mainHeaderImg.prop("href")+`" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></a>`);
                $("#mainheaderImg").click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = mainHeaderImg.prop("href");
                });
            }

            //featured image link
            let featImg = $("#Featured_Postleft .blockbody");
            if(!!featImg && featImg.length > 0)
            {
                $("#Featured_Postleft .blockbody").css("position", "relative");
                $("#Featured_Postleft .blockbody").append(`<a id="featuredImgLinkCatcher" href="`+$("#Featured_Postleft img").parent().prop("href")+`" title="`+$("#Featured_Postleft img").parent().prop("title")+`" style="position: absolute;top: 8px;left: 8px;width: calc(100% - 17px);height: calc(100% - 17px);"></a>`);
                $("#featuredImgLinkCatcher").click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = $("#Featured_Postleft img").parent().prop("href");
                });
            }

            //Private Messages -> PMs
            $("#header a[href='/user#private-messages']").before('<br>');

            //main list images
            $(".shm-image-list > a.thumb").each(function() {
                $(this).css("position", "relative");
                $(this).append(`<a class="LinkClickCatcher" href="`+$(this).prop("href")+`" title="`+$(this).find("[title]").prop("title")+`"></a>`);
            });

            //most other links
            addGlobalStyle(`
				.LinkClickCatcher, .LinkClickCatcher:hover, .LinkClickCatcher:active, .LinkClickCatcher:focus
				{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					width: -moz-available;          /* WebKit-based browsers will ignore this. */
					width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
					width: fill-available;
					height: 100%;
					height: -moz-available;          /* WebKit-based browsers will ignore this. */
					height: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
					height: fill-available;
                    background: transparent;
                    background-color: transparent;
				}
			`);
            $("a").filter("*:not(a[download]):not(#header h1 a):not(.custom-button):not(#Featured_Postleft a):not(.shm-image-list > a.thumb):not(.LinkClickCatcher):not(.optionsHelpLink)").each(function() {
                $(this).css("position", "relative");
                $(this).append(`<a class="LinkClickCatcher" href="`+$(this).prop("href")+`" title="`+$(this).prop("title")+`"></a>`);
            });
            $(".LinkClickCatcher").click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = $(this).parent().prop("href");
            });
        }

        //Styles
        if(true) {
			//main
			if(true) {
                //CSS for elements added by R34HI
                if(true) {
                    addGlobalStyle(`
                    .custom-button {
						cursor: pointer;
						width: 35px;
						padding: 3px;
						margin: 0;
						border-radius: 20px;
					}
					.custom-button:hover {
						background-color: rgba(255,255,255,.75);
					}
					.customButtonText {
						position: relative;
						top: -1px;
						width: auto;
						display: block;
						text-align: center;
					}
					.customButtonDiv {
                        position: relative;
						display: inline-block;
						margin: 0;
						padding: 0;
						width: auto;
						float: left;
					}
					.customButtonDiv:nth-of-type(1) { margin-right: 10px; }
					.customButtonDiv:nth-of-type(2) { margin-left: 10px; margin-right: 10px; }
					.customButtonDiv:nth-of-type(3) { margin-left: 10px; }
                    #nulllike-butt {
                        position: absolute;
                        width: 12px;
                        right: -5px;
                        bottom: 15px;
                    }

                    #r34hi_settings label
					{
						display: inline;
					}
					#r34hi_settings input[type="checkbox"]
					{
						transform: scale(1.2);
					}
					#r34hi_settings select
					{
						width: auto;
					}
					#r34hi_settings > .blockbody
					{
						padding-bottom: 30px;
                        text-align: left;
					}
					#r34hi_settings h4
					{
						margin: 23px 0 15px 0;
					}
					#tag-block-save-button
					{
						display: none;
						margin-left: 5px;
					}
					.optionsHelpLink {
						cursor: pointer;
						color: #8f8fff;
					}

					#markedAsSeenCB
					{
						display: inline-block;
						width: 35px;
						height: 35px;
					}
					#markedAsSeenCB > svg
					{
						height: 35px;
						width: 35px;
						margin: 0;
						cursor: pointer;
					}
					svg.eyeSlashIcon
					{
						color: white;
					}
					svg.eyeIcon
					{
						color: #00c85f;
					}

					.blockTagButton
					{
						display: inline-block;
						width: 11px;
						height: 11px;
						vertical-align: middle;
						cursor: pointer;
					}
					.blockTagButton > svg
					{
						vertical-align: top;
						color: #ff5454;
					}
                `);
                }

                //post listing thumbnail inner image margins
                if(true) {
                    addGlobalStyle(`
                    a.shm-thumb-link > img {
					    padding: 0;
                        margin: 0;
                        border: 0;
					}
                    `);
                }

                //Make sure image/video section on post pages is visible (not sure what makes it otherwise not always showup without this)
                if(true) {
                    addGlobalStyle("section#Imagemain { display: block !important; }");
                }

                //fix search bar tag elements
                if(true) {
                    addGlobalStyle("a.tagit-close { display: inline; padding: 0; }");
                }
			}

            if(Settings["CompactPostListing"]) {
                addGlobalStyle(`
                    .thumb {
                        width: unset;
                        margin: 2px;
                    }
                    .shm-image-list {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-around;
                        align-items: center;
                    }
                `);
            }

            if(Settings["EnableMarkAsSeenSystem"] && Settings["MarkedAsSeen"].length > 0 && Settings["MarkSeenEffect"] != "nothing") {
                addGlobalStyle(`.marked-as-seen `+(Settings["MarkSeenEffect"] == "fade" ? `{ opacity: 0.2; }` : `{ display: none; }`));
            }

            if(Settings["BlockedTags"].length > 0) {
                let rules = '';
                for(let i = 0; i < Settings["BlockedTags"].length; i++)
                    rules += ('a.shm-thumb-link[data-tags~="'+Settings["BlockedTags"][i]+'"]' + (i < Settings["BlockedTags"].length-1 ? ',\n' : ''));
                rules += '\n{ display: none; }';
                //console.log(rules);
                addGlobalStyle(rules);
            }

            if(Settings["HighlightVideos"]) {
                addGlobalStyle(`
					a.shm-thumb-link > img[title*='// webm'], a.shm-thumb-link > img[title*='// mp4'], a.shm-thumb-link > img[title*='// gif'],
                    #Featured_Postleft a > img[title*='// webm'], #Featured_Postleft a > img[title*='// mp4'], #Featured_Postleft a > img[title*='// gif']
					{
						border: solid 2px #fb2ccc !important; box-shadow: 0 0 5px 1px red;
					}
				`);
            }

            if(Settings["RemoveSomeSneakyAds"]) {
                addGlobalStyle(`
					/*The site only uses iframes for ads, so might as well hide all of them*/
					iframe { display: none; }

					/* Not sure what this was, but no longer hiding it...
                    #header td:nth-of-type(1) center:nth-of-type(2) > div { display: none; }
                    */

					/*As far as I can tell the "Recommended" div is only for ads (no longer exists? Keeping this line, because it's specific enough to not break anything)*/
					section[id="Recommended_for_youleft"] { display: none; }

					/*Hiding some links from the header that are pretty much just ads*/
					#header td ul > li a:not([href^="https://rule34hentai.net"]):not([href^="#"]) { display: none; }
					#header td ul > li img[src^="https://rule34hentai.net/TPD-Favicon"] { display: none; }

					/*The site is now loading fake posts in with the real ones. Hiding those*/
					a.thumb:not([href^="/post/"]) { display: none; }

					/*some new ad section below the paginator. Seems safe to assume all sections below the paginator are ads*/
					article > #paginator ~ section { display: none; }
				`);
			}

            //sections with no id don't appean to be a thing anymore, but leaving it here in case those come back, because this probably wont break anything
            if(Settings["RemovePremiumAds"]) {
                addGlobalStyle(`
					section[id=""] { display: none; }
				`);
			}

            /* What is this again?
            if(Settings["CenterContent"]) {
                addGlobalStyle(`
					#fluid_video_wrapper_video-id, #main_image
					{
						display: block;
						margin: auto;
					}

					#Imagemain + section > .blockbody, #Videomain + section > .blockbody
					{
						width: 720px;
						display: block;
						margin: auto;
					}
				`);
			}
            */

			// hide sections
			if(true) {
				if(Settings["HideNavigationInSidePanel"])
					addGlobalStyle(`#Navigationleft { display: none; }`);
				if(Settings["HideFeaturedImgInSidePanel"])
					addGlobalStyle(`#Featured_Postleft { display: none; }`);
				if(Settings["HideNewsInSidePanel"])
					addGlobalStyle(`#Newsleft { display: none; }`);
				if(Settings["HideCommentsInSidePanel"])
					addGlobalStyle(`#comment-list-recent { display: none; }`);
				if(Settings["HidePopularTagsInSidePanel"])
					addGlobalStyle(`#Popular_Tagsleft { display: none; }`);
				if(Settings["HideTagsInSidePanel"])
					addGlobalStyle(`#Tagsleft { display: none; }`);
				if(Settings["HideFavByInSidePanel"])
					addGlobalStyle(`#Favorited_Byleft { display: none; }`);
				/*if(Settings["HideReportInSidePanel"])
					addGlobalStyle(`#Report_Imageleft { display: none; }`);*/
				if(Settings["HideImgControlInSidePanel"])
					addGlobalStyle(`#Post_Controlsleft { display: none; }`);
				/*if(Settings["HidePoolsInSidePanel"])
					addGlobalStyle(`#Poolsleft { display: none; }`);*/
				if(Settings["HideLikesInSidePanel"])
					addGlobalStyle(`#Post_Scoreleft { display: none; }`);
                if(Settings["HideBulkActionsInSidePanel"])
					addGlobalStyle(`#Bulk_Actionsleft { display: none; }`);

                if(Settings["HideSidepanel"] == "all")
					addGlobalStyle(`
						body > nav { display: none; }
						body > article { margin-left: 16px; }
					`);

                
				if(Settings["StopHidingMyCursorOnVideo"])
					addGlobalStyle(`#video-id { cursor: auto !important; }`);
                

				if(Settings["HideImageVideoHeader"])
					addGlobalStyle(`#Imagemain > h3, #Videomain > h3, #image-list > h3 { display: none; }`);
			}

            //AKA More compact
            if(Settings["CompactSiteHeader"] == "compacter") {
                addGlobalStyle(`
					#header { height: auto; }
					#header tr > td {
                        text-align: left;
                        margin: 0;
                        padding: 0;
                        border: 0;
                    }
					#header tr > td > center:last-of-type { width: calc(100% - 290px); }
                    #header tr > td > center > form { min-width: 300px; }
                    #header tr > td > center > ul { margin-left: -270px; }
					#header tr > td > center { display: inline-block; }
					#header tr > td > center:first-of-type
					{
					    vertical-align: top;
					    padding: 0 10px 0 10px;
					}
                    #header tr > td section > h3,
					#header tr > td section > .blockbody { margin: 0; padding: 5px; }
				`);
			}

            //fix video not properly sizing when loaded in a non-active tab (chrome)
            addGlobalStyle(`#fluid_video_wrapper_video-id { width: auto !important; height: auto !important; }`);

            if(Settings["DownsizeToFit"]) {
                addGlobalStyle(`
					#fluid_video_wrapper_video-id,
					#fluid_video_wrapper_video-id > #video-id,
					#main_image {
						max-height: calc(100vh - 37px` +
					   (Settings["HideHeaderOnPosts"] ? `` : (Settings["CompactSiteHeader"] == "no" ? ` - 350px` : (Settings["CompactSiteHeader"] == "compact" ? ` - 146px` : ` - 96px`))) +
					   (Settings["HideImageVideoHeader"] ? `` : ` - 41px`) +
					   (Settings["DownsizeToFitLeaveSpaceInfo"] ? ` - 156px` : (Settings["LikeFavMASLocation"] == "sidepanel" ? `` : `  - 85px`)) + `) !important; max-width: 100% !important;
					}

					#Post_Controlsleft form:not([action]):not([href]), #Post_Controlsleft form:not([action]):not([href]) + br { display: none; }
				`);
            }

            if(Settings["CompactSiteHeader"] != "no") {
                addGlobalStyle(`
					header {margin: 0; padding: 0;}
					header p {display: none;}
					header ul.ui-widget {
						margin: 5px;
						display: inline-block;
						vertical-align: middle;
						box-sizing: border-box;
						width: calc(100% - 100px);
					}
					header form > input[value=Search],
					header form > input[value=Search]:visited {
						vertical-align: middle;
						height: 36px;
						border-radius: 8px;
						background-color: #dec4a0;
						border-color: #725327;
						font-weight: 700;
						cursor: pointer;
					}
					header form > input[value=Search]:hover,
					header form > input[value=Search]:active {
						background-color: #dabc92;
					}
					#header h1 {font-size: 14px;}
					#header img.wp-image-67962 {
						height: 50px;
						width: auto;
					}
					#header img.wp-image-69454 {
						display: none;
					}
					#header td > center > ul {margin: 2px 0 0 0;}

					#Uploadhead > .blockbody > .mini_upload > small,
					#Uploadhead > .blockbody > .mini_upload > form > ul,
					#Uploadhead > .blockbody > .mini_upload > form > input[type=submit]
					{
						display: none;
					}

					#Loginhead > .blockbody {
						display: none;
					}
					#Loginhead > h3 {
						cursor: pointer;
					}
				`);
			}

            if(Settings["HideLog"])
                addGlobalStyle(`b#flash { display: none; }`);
        }

        if(Settings["HideHeaderOnPosts"] && window.location.href.includes("/post/view/")) {
            addGlobalStyle(`
				header { display: none; }
			`);
        }

        //sidepanel hiding for image-only
        if(Settings["HideSidepanel"] == "vid-img" && window.location.href.includes("/post/view/")) {
            addGlobalStyle(`
				body > nav { display: none; }
				body > article { margin-left: 16px; }
			`);
        }

        //cleanup cloudflare GET string
        if(window.location.href.includes("?__cf"))
            window.history.replaceState( {} , $("title").html(), window.location.href.split("?__cf")[0]);

        if(Settings["RemoveSomeSneakyAds"]) {
            //nasty new full screen input blocking ad thingamajig that can't be removed with CSS rules
            let interval;
            interval = setInterval(() => {
                let thing = $("body > footer~div:not([id]):not([class])");
                if(thing.length > 0)
                {
                    $("body > footer~div:not([id]):not([class])").remove();
                    stopInterval(interval);
                }
            }, 50);
        }

        if(Settings["CompactSiteHeader"] != "no") {
            $("#Uploadhead #data0").change(function(){
                $("#Uploadhead > .blockbody > .mini_upload > small, #Uploadhead > .blockbody > .mini_upload > form > ul, #Uploadhead > .blockbody > .mini_upload > form > input[type=submit]").show(100);
            });

            $("#Loginhead > h3").click(function(){
                $(this).next(".blockbody").toggle(100);
            });
        }

		if(Settings["RemovePremiumAds"]) {
            //The only section directly under article appears to now be the news section, which also includes the ad. Hiding only the last <strong> that contains the ad phrase to hopefully avoid hiding more text due to nesting
            $("article > section strong:contains('ign up for a premium account')").last().hide();
		}

        //options menu
        if(window.location.pathname == "/user") {
            if(Settings["EnableMarkAsSeenSystem"])
                $("#Statsmain > .blockbody > a[href^='/post/list/upvoted_by']").before(`<b>Posts seen</b>: ` + Settings["MarkedAsSeen"].length + "<br>");

            let blockedTagsDisplay = BlockedTagsString.replace(/[\[\]\"\s]/g, "");
            blockedTagsDisplay = blockedTagsDisplay.replace(/,/g, ",\n");
            let textareaH = Settings["BlockedTags"].length * 14 + 50;
            if(textareaH > 400)
                textareaH = 400;
            $("#IPsmain").after(`<section id="r34hi_settings"><h3 data-toggle-sel="#Optionsmain">R34H Improved Settings</h3><div class="blockbody"><form action="#">` +
                                    `<h4>Video/Image</h4>` +
                                    `<label><input type="checkbox" name="InfiniteLoadPosts" `+(Settings["InfiniteLoadPosts"] ? "checked" : "")+`> Dynamically load more posts on post listing pages</label> <a id="infiniteLoadHelp" class="optionsHelpLink">?</a><br>` +
									`<label><input type="checkbox" name="OnlyAnimated" `+(Settings["OnlyAnimated"] ? "checked" : "")+`> Show ONLY videos</label><br>` +
                                    `<label><input type="checkbox" name="HighlightVideos" `+(Settings["HighlightVideos"] ? "checked" : "")+`> Highlight videos</label><br>` +
                                    `<label><input type="checkbox" name="AutoplayVideos" `+(Settings["AutoplayVideos"] ? "checked" : "")+`> Autoplay videos</label><br>` +
                                    `<label><input type="checkbox" name="StopHidingMyCursorOnVideo" `+(Settings["StopHidingMyCursorOnVideo"] ? "checked" : "")+`> Show cursor on videos</label><br>` +
                                    `<label><input type="checkbox" name="ClickOnVideoToPause" `+(Settings["ClickOnVideoToPause"] ? "checked" : "")+`> Click on video to pause</label><br>` +
                                    `<label><input type="checkbox" name="DownsizeToFit" `+(Settings["DownsizeToFit"] ? "checked" : "")+`> Downsize images/videos to fit on screen</label> <a id="downsizeHelp" class="optionsHelpLink">?</a><br>` +
                                    `<label><input type="checkbox" name="DownsizeToFitLeaveSpaceInfo" `+(Settings["DownsizeToFitLeaveSpaceInfo"] ? "checked" : "")+`> When Downsizing, leave space for info box below post</label><br>` +
                                    /*`<label><input type="checkbox" name="CenterContent" `+(Settings["CenterContent"] ? "checked" : "")+`> Center video/image and info-box below it</label><br>` +*/
                                    /*`<label><input type="checkbox" name="AllowContextMenuOnImages" `+(Settings["AllowContextMenuOnImages"] ? "checked" : "")+`> Allow context-menu/right-click on images</label><br>` +*/

                                    `<h4>Hotkeys <a id="CTRLHelp" class="optionsHelpLink">?</a></h4>` +
									`<label><input type="checkbox" name="CTRLSave" `+(Settings["CTRLSave"] ? "checked" : "")+`> Hotkey CTRL+S to save image/video on post page</label><br>` +
                                    `<label><input type="checkbox" name="CTRLFav" `+(Settings["CTRLFav"] ? "checked" : "")+`> Hotkey CTRL+F to favorite image/video on post page</label><br>` +
                                    `<label><input type="checkbox" name="CTRLLike" `+(Settings["CTRLLike"] ? "checked" : "")+`> Hotkey CTRL+A to like image/video on post page</label><br>` +
                                    `<label><input type="checkbox" name="CTRLDislike" `+(Settings["CTRLDislike"] ? "checked" : "")+`> Hotkey CTRL+D to dislike image/video on post page</label><br>` +
                                    `<label><input type="checkbox" name="CTRLMAS" `+(Settings["CTRLMAS"] ? "checked" : "")+`> Hotkey CTRL+G to mark as seen image/video on post page</label><br>` +

                                    `<h4>Like/Favorite</h4>` +
                                    `<label><input type="checkbox" name="EnableLikeFavoriteButtonsBelowImage" `+(Settings["EnableLikeFavoriteButtonsBelowImage"] ? "checked" : "")+`> Enable AJAX like and favorite buttons</label><br>` +
                                    `<label> <select name="LikeFavMASLocation">` +
									`<option value="under">Under post</option>` +
									`<option value="sidepanel">Sidepanel Image Controls</option></select>  Like/Favorite/Mark as seen button location</label><br>` +

                                    `<h4>Marked as Seen</h4>` +
                                    `<label><input type="checkbox" name="EnableMarkAsSeenSystem" `+(Settings["EnableMarkAsSeenSystem"] ? "checked" : "")+`> Enable the Mark as seen system</label><br>` +
                                    `<label><input type="checkbox" name="AutoMarkAsSeen" `+(Settings["AutoMarkAsSeen"] ? "checked" : "")+`> Automatically mark posts as seen as you open them</label><br>` +
                                    `<label> <select name="MarkSeenEffect">` +
									`<option value="nothing">Display normally</option>` +
									`<option value="fade">Display faded</option>` +
									`<option value="hide">Hide</option></select>  What to do with posts marked as seen</label><br>` +

                                    `<h4>Compact Site</h4>` +
									`<label> <select name="CompactSiteHeader">` +
									`<option value="no">Normal</option>` +
									`<option value="compact">Compact</option>` +
									`<option value="compacter">More Compact</option></select>  Header</label><br>` +
                                    `<label><input type="checkbox" name="HideHeaderOnPosts" `+(Settings["HideHeaderOnPosts"] ? "checked" : "")+`> Hide the site header on post pages</label><br>` +
                                    `<label><input type="checkbox" name="HideEmptySections" `+(Settings["HideEmptySections"] ? "checked" : "")+`> Hide Empty site sections</label><br>` +
                                    `<label><input type="checkbox" name="HideLog" `+(Settings["HideLog"] ? "checked" : "")+`> Hide the yellow log</label><br>` +
                                    `<label><input type="checkbox" name="CompactPostListing" `+(Settings["CompactPostListing"] ? "checked" : "")+`> Compact spacing for the thumbnails in post listings</label><br>` +
                                    `<label><input type="checkbox" name="HideImageVideoHeader" `+(Settings["HideImageVideoHeader"] ? "checked" : "")+`> Hide the image/video header</label><br>` +
                                    `<label><input type="checkbox" name="RemoveSomeSneakyAds" `+(Settings["RemoveSomeSneakyAds"] ? "checked" : "")+`> Remove some sneaky ads</label><br>` +
									`<label><input type="checkbox" name="ExperimentalExtraAdRemoval" `+(Settings["ExperimentalExtraAdRemoval"] ? "checked" : "")+`> Experimental extra ad removal</label> <a id="experimentalAdHelp" class="optionsHelpLink">?</a><br>` +
									`<label><input type="checkbox" name="RemovePremiumAds" `+(Settings["RemovePremiumAds"] ? "checked" : "")+`> Remove ads for premium</label><br>` +

                                    `<h4>Sidepanel</h4>` +
                                    `<label> <select name="HideSidepanel">` +
									`<option value="no">Don't Hide</option>` +
									`<option value="all">Always Hide</option>` +
									`<option value="vid-img">Hide in img-video pages</option></select>  Hide the entire sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideNavigationInSidePanel" `+(Settings["HideNavigationInSidePanel"] ? "checked" : "")+`> Hide the Navigation section in the sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideFeaturedImgInSidePanel" `+(Settings["HideFeaturedImgInSidePanel"] ? "checked" : "")+`> Hide the Featured image section in the home page sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideNewsInSidePanel" `+(Settings["HideNewsInSidePanel"] ? "checked" : "")+`> Hide the News section in the homepage sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideCommentsInSidePanel" `+(Settings["HideCommentsInSidePanel"] ? "checked" : "")+`> Hide the Comments section in the homepage sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HidePopularTagsInSidePanel" `+(Settings["HidePopularTagsInSidePanel"] ? "checked" : "")+`> Hide the Popular tags section in the homepage sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideBulkActionsInSidePanel" `+(Settings["HideBulkActionsInSidePanel"] ? "checked" : "")+`> Hide the Bulk Actions section in the sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideTagsInSidePanel" `+(Settings["HideTagsInSidePanel"] ? "checked" : "")+`> Hide the Tags section in the sidepanel</label><br>` +
									/*`<label><input type="checkbox" name="HidePoolsInSidePanel" `+(Settings["HidePoolsInSidePanel"] ? "checked" : "")+`> Hide the Pools section in the sidepanel</label><br>` +*/
                                    `<label><input type="checkbox" name="HideLikesInSidePanel" `+(Settings["HideLikesInSidePanel"] ? "checked" : "")+`> Hide the Likes/Score section in the site sidepanel</label><br>` +
                                    `<label><input type="checkbox" name="HideFavByInSidePanel" `+(Settings["HideFavByInSidePanel"] ? "checked" : "")+`> Hide the Favorited by section in the site sidepanel</label><br>` +
                                    /*`<label><input type="checkbox" name="HideReportInSidePanel" `+(Settings["HideReportInSidePanel"] ? "checked" : "")+`> Hide the Report image section in the site sidepanel</label><br>` + */
                                    `<label><input type="checkbox" name="HideImgControlInSidePanel" `+(Settings["HideImgControlInSidePanel"] ? "checked" : "")+`> Hide the Image controls section in the site sidepanel</label><br>` +

                                    `<h4>Blocked Tags<button id="tag-block-save-button">Save</button></h4>` +
                                    `<textarea name="BlockedTags" style="width: 350px; height: `+textareaH+`px;">`+blockedTagsDisplay+`</textarea><p>This is mainly for removing blocked tags from the list, but you can add them from here as well.<br>Just seperate tags with "," and use "_" in place of spaces.</p>` +
                                    `<h4>Import/Export saved data</h4>` +
                                    `<input type="button" id="exportR34HIData" value="Export"> <input type="button" id="importR34HIData" value="Import"><input id="r34hiImportFile" type="file" style="display: none;">` +
                                    `</form></div></section>`);

            $("#r34hi_settings select[name='HideSidepanel'] > option[value='"+Settings["HideSidepanel"]+"']").attr("selected", "selected");
			$("#r34hi_settings select[name='CompactSiteHeader'] > option[value='"+Settings["CompactSiteHeader"]+"']").attr("selected", "selected");
            $("#r34hi_settings select[name='MarkSeenEffect'] > option[value='"+Settings["MarkSeenEffect"]+"']").attr("selected", "selected");
            $("#r34hi_settings select[name='LikeFavMASLocation'] > option[value='"+Settings["LikeFavMASLocation"]+"']").attr("selected", "selected");

            $("#downsizeHelp").click(function(){
                alert(`The image/video is downsized to fit the screen if it's too large.\n
The downsizing is calculated so that the image/video + voting buttons (if at the bottom) are fully visible with the page scroll position at 0 (top of page).\n
Site header and image header sizing is taken into account.\n
"Hide empty site sections" and "Hide the yellow log" are assumed to be enabled. The downsizing does not take those into account.`);
            });
            $("#experimentalAdHelp").click(function(){
                alert(`TLDR; If you still get ads with Ublock Origins and "Remove some sneaky ads" turned on, you can try turning this option on as well.\n
A while ago there were some nasty popup ads that weren't caught by Ublock Origins or my extra ad blocking features in this script, so I made this.\n
It's a more aggressive ad blocking method that is kind of a quick, dirty, and not very efficient way to block them, but it does work.\n
It seems those ads were removed from the site for now, so this setting is off by default, as it is not needed as of writing this.`);
            });
            $("#CTRLHelp").click(function(){
                alert(`Currently you can't change the keys.\n\nLike/Dislike/Favorite hotkeys currently only work if you use "Enable AJAX like and favorite buttons".\nObviously the mark-as-read hotkey only works if the mark-as-read feature is enabled.`);
            });
            $("#infiniteLoadHelp").click(function(){
                alert(`On post listing pages, whenever the page is scrolled to the bottom, the next page's posts are dynamically added to the current page's list.`);
            });

            $("#exportR34HIData").click(() => {
                LoadSettings(); //reload settings to make sure we are exporting the latest state. (in case the user made changes in other tabs since loading this one for example)
                SaveToJSONFile("R34HI-Backup_" + new Date().toISOString().replace(/:/g, "-") + ".r34hi", JSON.stringify(Settings));
            });

            $("#importR34HIData").click(() => {
                $("#r34hiImportFile").animate({width:'toggle'},200);
            });
            $("#r34hiImportFile").change((event) => {
                if (typeof window.FileReader !== 'function')
                    throw ("The file API isn't supported on this browser.");
                let input = event.target;
                if (!input)
                    throw ("The browser does not properly implement the event object");
                if (!input.files)
                    throw ("This browser does not support the `files` property of the file input.");

                let file = input.files[0];
                let fr = new FileReader();
                fr.onload = (ev) => {
                    let importedData = ev.target.result;
                    if(importedData != null && confirm("File received. Import this file?"))
                    {
                        Settings = JSON.parse(importedData);
                        SaveAllSettings();
                        importedData = null;
                        location.reload();
                    }
                    else
                        $("#r34hiImportFile").val('');
                };
                fr.readAsText(file);
            });

            $("#r34hi_settings input").change(function(){
				Settings[$(this).attr("name")] = $(this).is(':checked'); //runtime
                GM_setValue($(this).attr("name"), $(this).is(':checked')); //disk

            });
            $("#r34hi_settings select").change(function(){
				Settings[$(this).attr("name")] = $(this).val(); //runtime
                GM_setValue($(this).attr("name"), $(this).val()); //disk
            });
            $("#r34hi_settings textarea").on("input", function(){
                if($(this).val() != blockedTagsDisplay)
                    $("#tag-block-save-button").show(200);
            });
            $("#tag-block-save-button").click(function(e){
                e.preventDefault();
                e.stopPropagation();

                let temp = $("textarea[name='BlockedTags']").val().replace(/\s/g, "");

                //remove , if used at the end
                if(temp[temp.length-1] == ",")
                    temp = temp.substr(0, temp.length-1);

                if(temp == "")
                    Settings["BlockedTags"] = [];
                else
                    Settings["BlockedTags"] = temp.split(",");
                BlockedTagsString = JSON.stringify(Settings["BlockedTags"]);
                GM_setValue("BlockedTagsString", BlockedTagsString);
                blockedTagsDisplay = $("textarea[name='BlockedTags']").val();
                $(this).hide(200);
            });
        }
        else {
            //post view
            if(window.location.href.match(/^https:\/\/rule34hentai\.net\/post\/view\/\d+?(\?.*|\#.*|)$/g)) {
                //Mark as seen
                if($("#Loginhead").length == 0 && Settings["EnableMarkAsSeenSystem"]) {
                    var imageID = $("[name='image_id']").prop("value");
                    if(!imageID)
                        console.log("R34HI: failed to get imageID");
                    let seen = Settings["MarkedAsSeen"].includes(imageID);

                    let insertHTML = `<div class="customButtonDiv"><span id="markedAsSeenCB" class="custom-button" alt="`+(seen ? `seen` : `unseen`)+`" title="`+(seen ? `Mark as Unseen?` : `Mark as Seen?`)+`">`+(seen ? eyeIcon : eyeSlashIcon)+`</span> <span class="customButtonText">`+(seen ? `Seen` : `Unseen`)+`</span></div>`;

                    if(Settings["LikeFavMASLocation"] == "under")
                        $(".image_info").parent().parent().prepend(insertHTML);
                    else
                    {
                        $("#Post_Controlsleft > .blockbody > form:last").css("margin-bottom", "15px");
                        $("#Post_Controlsleft > .blockbody").append(insertHTML);
                        $("#Post_Controlsleft > .blockbody").css("padding-bottom", "70px");
                    }

                    $("#markedAsSeenCB").click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        MarkedAsSeenString = GM_getValue("MarkedAsSeenString", "[]");
                        if(MarkedAsSeenString) { Settings["MarkedAsSeen"] = JSON.parse(MarkedAsSeenString); }
                        seen = Settings["MarkedAsSeen"].includes(imageID);

                        if(seen)
                        {
                            seen = false;
                            let index = Settings["MarkedAsSeen"].indexOf(imageID);
                            while(index > -1)
                            {
                                Settings["MarkedAsSeen"].splice(index, 1);
                                index = Settings["MarkedAsSeen"].indexOf(imageID);
                            }
                        }
                        else
                        {
                            seen = true;
                            Settings["MarkedAsSeen"].push(imageID);
                        }
                        $(this).attr("alt", (seen ? `seen` : `unseen`));
                        $(this).attr("title", (seen ? `Mark as Unseen?` : `Mark as Seen?`));
                        $(this).html((seen ? eyeIcon : eyeSlashIcon));
                        $(this).next(".customButtonText").text((seen ? `Seen` : `Unseen`));
                        MarkedAsSeenString = JSON.stringify(Settings["MarkedAsSeen"]);
                        GM_setValue("MarkedAsSeenString", MarkedAsSeenString);
                    });

                    //Hotkey
                    if(Settings["CTRLMAS"]) {
                        $(document).bind('keydown keypress', function(e) {
                            if(e.ctrlKey && (e.which == 71)) {
                                e.preventDefault();
                                $("#markedAsSeenCB").click();
                                return false;
                            }
                        });
                    }

                    if(Settings["AutoMarkAsSeen"]) {
                        var waitForFocus;
                        waitForFocus = setInterval(function(){
                            console.log("waitForFocusInterval");
                            if(document.hasFocus())
                            {
                                console.log("waitForFocusInterval - has focus");
                                if(!seen)
                                {
                                    $("#markedAsSeenCB").click();
                                    console.log("waitForFocusInterval - auto marked");
                                }
                                clearInterval(waitForFocus);
                            }
                        }, 100);
                    }
                }

                //like favorite buttons
                if($("#Loginhead").length == 0 && Settings["EnableLikeFavoriteButtonsBelowImage"]) {
                    let insertHTML = `<div class="customButtonDiv"><img id="like-butt" class="custom-button" src="https://i.imgur.com/Kh1HzGr.png" alt="like" title="like">` +
                        `<img id="dislike-butt" class="custom-button" src="https://i.imgur.com/b4syBNK.png" alt="dislike" title="dislike">` +
                        `<img id="nulllike-butt" class="custom-button" src="https://i.imgur.com/HbY3cDV.png" alt="null-like" title="Remove your vote">` +
                        `<span id="customLikeButtonText" class="customButtonText">` +
                        $("#Post_Scoreleft > .blockbody").text().trim().replace(/[^(0-9)-]/g, "") +
                        `</span>` +
                        `</div><div class="customButtonDiv"><img id="favorite-butt" class="custom-button` +
                        ($("#Post_Controlsleft form input[value='Un-Favorite']").length > 0 ? " unfavorite" : "") + `" src="` +
                        ($("#Post_Controlsleft form input[value='Un-Favorite']").length > 0 ? "https://i.imgur.com/wAB0t48.png" : "https://i.imgur.com/dTpBrIj.png") +
                        `" alt="` + ($("#Post_Controlsleft form input[value='Un-Favorite']").length > 0 ? "unfavorite" : "favorite") +
                        `" title="` + ($("#Post_Controlsleft form input[value='Un-Favorite']").length > 0 ? "unfavorite" : "favorite") +
                        `"><span id="customFavButtonText" class="customButtonText">` +
                        $("#Favorited_Byleft > .blockbody").text().split(":")[0].trim().replace(/[^0-9]/g, "") + `</span></div>`;

                    if(Settings["LikeFavMASLocation"] == "under")
                        $(".image_info").parent().parent().prepend(insertHTML);
                    else
                    {
                        $("#Post_Controlsleft > .blockbody > form[action='/change_favorite']").css("display", "none");
                        $("#Post_Controlsleft > .blockbody > form:last").css("margin-bottom", "15px");
                        $("#Post_Controlsleft > .blockbody").append(insertHTML);
                        $("#Post_Controlsleft > .blockbody").css("padding-bottom", "70px");
                    }

                    $("#like-butt").click(function() {
                        let auth = $("#Post_Scoreleft form input[value='Vote Up']").parent().find("input[name='auth_token']").prop("value");
                        let id = $("#Post_Scoreleft form input[value='Vote Up']").parent().find("input[name='image_id']").prop("value");
                        $("#customLikeButtonText").text("...");
                        $.post( "/numeric_score_vote", { auth_token: auth, image_id: id, vote: "up" }, function(data){
                            $("#customLikeButtonText").text($(data).find("#Post_Scoreleft > .blockbody").text().trim().replace(/[^(0-9)-]/g, ""));
                        }).fail(function(){
                            $("#customLikeButtonText").text("error");
                        });
                    });
                    $("#dislike-butt").click(function() {
                        let auth = $("#Post_Scoreleft form input[value='Remove Vote']").parent().find("input[name='auth_token']").prop("value");
                        let id = $("#Post_Scoreleft form input[value='Remove Vote']").parent().find("input[name='image_id']").prop("value");
                        $("#customLikeButtonText").text("...");
                        $.post( "/numeric_score_vote", { auth_token: auth, image_id: id, vote: "down" }, function(data){
                            $("#customLikeButtonText").text($(data).find("#Post_Scoreleft > .blockbody").text().trim().replace(/[^(0-9)-]/g, ""));
                        }).fail(function(){
                            $("#customLikeButtonText").text("error");
                        });
                    });
                    $("#nulllike-butt").click(function() {
                        let auth = $("#Post_Scoreleft form input[value='Remove Vote']").parent().find("input[name='auth_token']").prop("value");
                        let id = $("#Post_Scoreleft form input[value='Remove Vote']").parent().find("input[name='image_id']").prop("value");
                        $("#customLikeButtonText").text("...");
                        $.post( "/numeric_score_vote", { auth_token: auth, image_id: id, vote: "null" }, function(data){
                            $("#customLikeButtonText").text($(data).find("#Post_Scoreleft > .blockbody").text().trim().replace(/[^(0-9)-]/g, ""));
                        }).fail(function(){
                            $("#customLikeButtonText").text("error");
                        });
                    });
                    $("#favorite-butt").click(function() {
                        if($(this).hasClass("unfavorite"))
                        {
                            let auth = $("#Post_Controlsleft form input[value='Un-Favorite']").parent().find("input[name='auth_token']").prop("value");
                            let id = $("#Post_Controlsleft form input[value='Un-Favorite']").parent().find("input[name='image_id']").prop("value");
                            $("#customFavButtonText").text("...");
                            $.post( "/change_favorite", { auth_token: auth, image_id: id, favorite_action: "unset" }, function(data){
                                $("#customFavButtonText").text($(data).find("#Favorited_Byleft > .blockbody").text().split(":")[0].trim().replace(/[^0-9]/g, ""));
                                $("#favorite-butt").attr("src", "https://i.imgur.com/dTpBrIj.png");
                                $("#favorite-butt").attr("alt", "favorite");
                                $("#favorite-butt").attr("title", "favorite");
                                $("#Post_Controlsleft form input[value='Un-Favorite']").attr("value", "Favorite");
                                $("#Post_Controlsleft form input[name='favorite_action']").attr("value", "set");
                                $("#favorite-butt").removeClass("unfavorite");
                            }).fail(function(){
                                $("#customFavButtonText").text("error");
                            });
                        }
                        else
                        {
                            let auth = $("#Post_Controlsleft form input[value='Favorite']").parent().find("input[name='auth_token']").prop("value");
                            let id = $("#Post_Controlsleft form input[value='Favorite']").parent().find("input[name='image_id']").prop("value");
                            $("#customFavButtonText").text("...");
                            $.post( "/change_favorite", { auth_token: auth, image_id: id, favorite_action: "set" }, function(data){
                                $("#customFavButtonText").text($(data).find("#Favorited_Byleft > .blockbody").text().split(":")[0].trim().replace(/[^0-9]/g, ""));
                                $("#favorite-butt").attr("src", "https://i.imgur.com/wAB0t48.png");
                                $("#favorite-butt").attr("alt", "unfavorite");
                                $("#favorite-butt").attr("title", "unfavorite");
                                $("#Post_Controlsleft form input[value='Favorite']").attr("value", "Un-Favorite");
                                $("#Post_Controlsleft form input[name='favorite_action']").attr("value", "unset");
                                $("#favorite-butt").addClass("unfavorite");
                            }).fail(function(){
                                $("#customFavButtonText").text("error");
                            });
                        }
                    });

                    //Hotkeys
                    if(Settings["CTRLFav"] || Settings["CTRLLike"] || Settings["CTRLDislike"])
                    {
                        $(document).bind('keydown keypress', function(e) {
                            if(Settings["CTRLFav"] && e.ctrlKey && (e.which == 70)) {
                                e.preventDefault();
                                $("#favorite-butt").click();
                                return false;
                            }
                            else if(Settings["CTRLLike"] && e.ctrlKey && (e.which == 65)) {
                                e.preventDefault();
                                $("#like-butt").click();
                                return false;
                            }
                            else if(Settings["CTRLDislike"] && e.ctrlKey && (e.which == 68)) {
                                e.preventDefault();
                                $("#dislike-butt").click();
                                return false;
                            }
                        });
                    }
                }

                //CTRL+S save
                if(Settings["CTRLSave"]) {
                    $(document).bind('keydown keypress', function(e) {
                        if(e.ctrlKey && (e.which == 83)) {
                            e.preventDefault();
                            $("#newDLButton, #Post_Controlsleft a[download] > button").click();
                            return false;
                        }
                    });
                }

                /*
                if(Settings["AllowContextMenuOnImages"]) {
                    //looks like the site's own scripts add the events after the page loads, but I'm not sure how I could detect when that happens...
                    //Also, .off() seems to not be sufficient, so I guess I'll just keep re-inserting for a while -.-
                    let time = 0;
                    let interv = setInterval(() => {
                        $("#main_image").replaceWith($("#main_image").clone());
                        time += 200;
                        if(time > 5000)
                            clearInterval(interv);
                    }, 200);
                }
                */

                if(Settings["AutoplayVideos"]) {

                    //the "initial" play button (one in middle) sometimes doesn't dissapear with autoplay, so here's a CSS rule that keeps it invisible always, except when there's a "transation". i.e. when user presses play/pause, it shows up for a second as normal
                    addGlobalStyle(`.fluid_initial_play:not(.transform-active) { display: none; }`);

                    let interv = setInterval(() => {
                        let vid = $("#Videomain #video-id");
                        if(vid && vid[0]) {
                            clearInterval(interv);

                            //reliable and doesn't leave initial play button visible, but fails silently if no permissions
                            vid.prop("autoplay", "true");

                            //code below is ran just so we can catch the permission failure and tell the user about missing permissions
                            let playNow = () => {
                                //only run if the video is still paused
                                if(vid[0].paused) {
                                    vid[0].play().then(() => {}).catch((error) => {
                                        if (error.name === "NotAllowedError") {
                                            alert("Your browser is blocking autoplay! Please allow autoplay on this domain.\n\nHow? See here:\nhttps://i.imgur.com/zl98mvs.png");
                                        }
                                    });
                                }
                            };

                            if(vid[0].readyState == 4)
                                playNow();
                            else
                                vid[0].oncanplay = playNow;
                        }
                    }, 20);
                }

                if(Settings["ClickOnVideoToPause"]) {
                    $("#video-id").on("click", (e) => {
                        e.preventDefault();
                        if(e.target.paused)
                            e.target.play();
                        else
                            e.target.pause();
                    });
                }
            }

            if(Settings["HideEmptySections"]) {
                $("article > section > .blockbody, article > strong > section > .blockbody, nav > section > .blockbody").each(function(){
                    if($(this).find("*:visible").not("*:empty").length == 0)
                        $(this).parent().hide();
                });
            }

            if(Settings["EnableMarkAsSeenSystem"]) {
                $("a.thumb[data-post-id]").each(function(){
                    let curID = $(this).attr("data-post-id");
                    if(Settings["MarkedAsSeen"].includes(curID))
                        $(this).addClass("marked-as-seen");
                });
                let featImg = $("#Featured_Postleft img");
                if(featImg.length > 0 && Settings["MarkedAsSeen"].includes(featImg.attr("id").split("_").pop()))
                    featImg.addClass("marked-as-seen");
            }

            //append tag blocking buttons
            if(true) {
                $("td.tag_name_cell").after(`<div class="blockTagButton" alt="block-tag" title="block tag">`+banIcon+`</div>`);
                $(".blockTagButton").click(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    BlockTag($(this).prev().find(".tag_name").text());

                    let target = $(this);
                    target.css("cursor", "wait");
                    setTimeout(function(){ target.css("cursor", "pointer"); }, 1000);
                });
            }

            //NOTE: Sorting seems to be broken on the site in general. It's always newest first now...
            if(Settings["SortFixed"]) {
                if(window.location.href.match(/^https:\/\/rule34hentai\.net\/post\/list.*?\/1.*$/g)) //post list pages only
                {
                    let sortNew = $("#header ul > li .dropdown a[href*='order%3Did_desc']");
                    if(sortNew.length > 0)
                    {
                        let newHref = window.location.href;
                        newHref = newHref.replace(/(\s?|\%20)order\%3Dscore_(desc|asc)/, ""); //remove other (known)ordering tags
                        if(!newHref.includes("order%3Did_desc"))
                            newHref = newHref.split("/1")[0] + " order%3Did_desc/1";

                        sortNew.prop("href", newHref);
                    }
                    let sortTop = $("#header ul > li .dropdown a[href*='order%3Dscore_desc']");
                    if(sortTop.length > 0)
                    {
                        let newHref = window.location.href;
                        newHref = newHref.replace(/(\s?|\%20)order\%3Did_(desc|asc)/, ""); //remove other (known)ordering tags
                        if(!newHref.includes("order%3Dscore_desc"))
                            newHref = newHref.split("/1")[0] + " order%3Dscore_desc/1";

                        sortTop.prop("href", newHref);
                    }
                }
            }

            //post list page (infinite load posts)
            if(Settings["InfiniteLoadPosts"] && window.location.href.includes("/post/list")) {
                addGlobalStyle(`
					#postsAjaxLoadingImg { display: inline-flex; }
					#postsAjaxLoadingImg > img { height: 125px; }
					#postsAjaxLoadingImg > span {
					margin: 45px auto auto -60px;
						font-size: 1.4em;
						font-weight: bold;
					}
				`);

                path = window.location.pathname;
                if(path == "/post/list")
                    path += "/";
                const pathSplit = path.split("/");
                pageNumString = pathSplit[pathSplit.length-1];
                pageNum = parseInt(pageNumString);
                hadPageNum = true;
                if(!pageNum) {
                    hadPageNum = false;
                    pageNum = 1;
                }
                loadingPage = false;

                stopLoading = ($("#paginator a[href$='/"+(pageNum+1)+"']").length < 1);

                if(!loadingPage && !stopLoading && ScrollIsNearButtom())
                    LoadNextPagePostsAJAX();

                $(window).scroll(function() {
                    if(!loadingPage && !stopLoading && ScrollIsNearButtom())
                        LoadNextPagePostsAJAX();
                });
            }
        }
    });



    //=== FUNCTIONS ===//
    function LoadNextPagePostsAJAX() {
        loadingPage = true;
        const pageToLoad = (hadPageNum ? path.substring(0, path.length - pageNumString.length) + (pageNum+1) : path + (pageNum+1));

        $("#image-list .shm-image-list").append(`<div id="postsAjaxLoadingImg"><img id="postsAjaxLoadingImg" src="https://i.imgur.com/vioCiRn.gif"><span>Looking for more...</span></div>`);
        $("#postsAjaxLoadingImg").hide().fadeIn(300);
        $.ajax({
            url: pageToLoad,
            method: "GET"
        }).done(function(data){
            let posts = $(data).find("#image-list .shm-image-list > .thumb");
            if(posts.length)
            {
                LoadSettings(); //reload settings in case there have been changes since last load
                posts.each(function() {
                    if($("#image-list .shm-image-list .thumb[data-post-id='"+$(this).attr("data-post-id")+"']").length === 0)
                    {
                        let el = $(this);
                        if(Settings["MarkedAsSeen"].includes(el.attr("data-post-id")))
                            el.addClass("marked-as-seen");

                        $("#image-list .shm-image-list").append(el);
                    }
                });
                pageNum++;
                if(!($(data).find("#paginator a[href$='/"+(pageNum+1)+"']").length))
                {
                    stopLoading = true;
                }
            }
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log("R34HI: failed to load next page: " + textStatus);
        }).always(() => {
            $("#postsAjaxLoadingImg").remove();
            loadingPage = false;
            if(ScrollIsNearButtom())
                LoadNextPagePostsAJAX();
        });
    }
    function ScrollIsNearButtom() {
        return ($(window).scrollTop() + $(window).height() > $(document).height() - 50);
    }
    function SaveToJSONFile(filename, data) {
        var blob = new Blob([data], {type: 'text/plain'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }
    function SaveAllSettings() {
        Object.keys(Settings).forEach((k) => {
            if(Array.isArray(Settings[k]))
                GM_setValue(k+"String", JSON.stringify(Settings[k]));
            else
                GM_setValue(k, Settings[k]);
        });
    }
    function LoadSettings() {
        BlockedTagsString = GM_getValue("BlockedTagsString", "[]");
        MarkedAsSeenString = GM_getValue("MarkedAsSeenString", "[]");

        Settings = {
            /*       video/image       */
            "InfiniteLoadPosts": GM_getValue("InfiniteLoadPosts", true),
			"OnlyAnimated": GM_getValue("OnlyAnimated", false),
            "HighlightVideos": GM_getValue("HighlightVideos", true),
            "AutoplayVideos": GM_getValue("AutoplayVideos", true),
            "StopHidingMyCursorOnVideo": GM_getValue("StopHidingMyCursorOnVideo", false),
            "DownsizeToFit": GM_getValue("DownsizeToFit", true),
            "DownsizeToFitLeaveSpaceInfo": GM_getValue("DownsizeToFitLeaveSpaceInfo", false),
            "ClickOnVideoToPause": GM_getValue("ClickOnVideoToPause", true),
            "AllowContextMenuOnImages": GM_getValue("AllowContextMenuOnImages", true),

            /*         Hotkeys         */
			"CTRLSave": GM_getValue("CTRLSave", true),
            "CTRLFav": GM_getValue("CTRLFav", false),
            "CTRLLike": GM_getValue("CTRLLike", false),
            "CTRLDislike": GM_getValue("CTRLDislike", false),
            "CTRLMAS": GM_getValue("CTRLMAS", false),

            /*      Compact site       */
            "CompactSiteHeader": GM_getValue("CompactSiteHeader", "compacter"),
            "HideHeaderOnPosts": GM_getValue("HideHeaderOnPosts", false),
            "HideEmptySections": GM_getValue("HideEmptySections", true),
            "HideLog": GM_getValue("HideLog", true),
            "CompactPostListing": GM_getValue("CompactPostListing", false),
            "HideImageVideoHeader": GM_getValue("HideImageVideoHeader", true),
            "RemoveSomeSneakyAds": GM_getValue("RemoveSomeSneakyAds", true),
            "ExperimentalExtraAdRemoval": GM_getValue("ExperimentalExtraAdRemoval", false),
            "RemovePremiumAds": GM_getValue("RemovePremiumAds", true),
            "CenterContent": GM_getValue("CenterContent", false),

            /*   Sidepanel   */
            "HideSidepanel": GM_getValue("HideSidepanel", "no"),
            "HideNavigationInSidePanel": GM_getValue("HideNavigationInSidePanel", false),
            "HideFeaturedImgInSidePanel": GM_getValue("HideFeaturedImgInSidePanel", false),
            "HideNewsInSidePanel": GM_getValue("HideNewsInSidePanel", false),
            "HideCommentsInSidePanel": GM_getValue("HideCommentsInSidePanel", false),
            "HidePopularTagsInSidePanel": GM_getValue("HidePopularTagsInSidePanel", false),
            "HideTagsInSidePanel": GM_getValue("HideTagsInSidePanel", false),
			"HidePoolsInSidePanel": GM_getValue("HidePoolsInSidePanel", false),
            "HideLikesInSidePanel": GM_getValue("HideLikesInSidePanel", true),
            "HideFavByInSidePanel": GM_getValue("HideFavByInSidePanel", false),
            "HideReportInSidePanel": GM_getValue("HideReportInSidePanel", false),
            "HideImgControlInSidePanel": GM_getValue("HideImgControlInSidePanel", false),
            "HideBulkActionsInSidePanel": GM_getValue("HideBulkActionsInSidePanel", false),

            /*      like/favorite      */
            "EnableLikeFavoriteButtonsBelowImage": GM_getValue("EnableLikeFavoriteButtonsBelowImage", true),
            "LikeFavMASLocation": GM_getValue("LikeFavMASLocation", "under"),

            /*       Block tags       */
            "BlockedTags": JSON.parse(BlockedTagsString),

            /*     Mark as seen     */
            "EnableMarkAsSeenSystem": GM_getValue("EnableMarkAsSeenSystem", true),
            "MarkSeenEffect": GM_getValue("MarkSeenEffect", "fade"),
            "AutoMarkAsSeen": GM_getValue("AutoMarkAsSeen", true),
            "MarkedAsSeen": JSON.parse(MarkedAsSeenString),

            "SortFixed": true
        };
    }
    function BlockTag(tag) {
        tag = tag.toLowerCase();
        tag = tag.replace(/\s/g, "_");
        console.log("added to tag block list: " + tag);
        if(!tag || tag.length <= 0)
            return;

        if(!Settings["BlockedTags"].includes(tag))
            Settings["BlockedTags"].push(tag);
        else
            Settings["BlockedTags"].splice(Settings["BlockedTags"].indexOf(tag), 1);

        BlockedTagsString = JSON.stringify(Settings["BlockedTags"]);
        GM_setValue("BlockedTagsString", BlockedTagsString);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();