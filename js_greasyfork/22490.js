// ==UserScript==
// @name         GGn Mobygames Uploady
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.26
// @include      https://gazellegames.net/upload.php
// @include      https://gazellegames.net/torrents.php?action=editgroup*
// @include      https://www.mobygames.com/*
// @include      http://www.mobygames.com/*
// @description  Uploady for mobygames
// @author       NeutronNoir
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant		 GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/23948-html2bbcode/code/HTML2BBCode.js
// 
// @downloadURL https://update.greasyfork.org/scripts/22490/GGn%20Mobygames%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/22490/GGn%20Mobygames%20Uploady.meta.js
// ==/UserScript==

try {
    init();
} catch (err) {
    console.log(err);
}

function init() {
	var mobygames = JSON.parse(GM_getValue("mobygames") || "{}");
	GM_setValue("mobygames", JSON.stringify(mobygames));

	if (window.location.hostname == "gazellegames.net") {
        if (window.location.pathname == '/upload.php') {
			add_search_buttons();
		}
		else if (window.location.pathname == '/torrents.php' && /action=editgroup/.test(window.location.search)) {
			add_search_buttons_alt();
        }
	}
	else if (window.location.hostname == "www.mobygames.com") {
		add_validate_button();
	}
    
	GM_addStyle(button_css());
}

function add_search_buttons() {
	$("input[name='title']").after('<input id="moby_uploady_Search" type="button" value="Search MobyGames"/>');
    $("#moby_uploady_Search").click(function() {
		var title = encodeURIComponent($("#title").val());

        window.open("https://www.mobygames.com/search/quick?q=" + title, '_blank');	//For every platform

		var mobygames = {};
        
		GM_setValue("mobygames", JSON.stringify(mobygames));
    });

	//need to add a button to fill the inputs and stop gathering links
	$("#moby_uploady_Search").after('<input id="moby_uploady_Validate" type="button" value="Validate MobyGames"/>');
	$("#moby_uploady_Validate").click( function () {
		var mobygames = JSON.parse(GM_getValue("mobygames") || "{}");

        $("#aliases").val(mobygames.alternate_titles);
        $("#title").val(mobygames.title);
        $("#tags").val(mobygames.tags);
        $("#year").val(mobygames.year);
        $("#image").val(mobygames.cover);
        $("#album_desc").val(mobygames.description);
        
        var add_screen = $("a:contains('+')");
        mobygames.screenshots.forEach(function(screenshot, index) {
			if (index >= 16) return;															//The site doesn't accept more than 16 screenshots
			if (index >= 3) add_screen.click();												//There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
            $("[name='screens[]']").eq(index).val(screenshot);											//Finally store the screenshot link in the right screen field.
		});

        $("#platform").val(mobygames.platform);
        
		GM_deleteValue("mobygames");
	});
}

function add_search_buttons_alt() {
	$("input[name='name']").after('<input id="moby_uploady_Search" type="button" value="Search MobyGames"/>');
    $("#moby_uploady_Search").click(function() {
		var title = encodeURIComponent($("[name='name']").val());

        window.open("https://www.mobygames.com/search/quick?q=" + title, '_blank');	//For every platform

		var mobygames = {};
        
		GM_setValue("mobygames", JSON.stringify(mobygames));
    });

	//need to add a button to fill the inputs and stop gathering links
	$("#moby_uploady_Search").after('<input id="moby_uploady_Validate" type="button" value="Validate MobyGames"/>');
	$("#moby_uploady_Validate").click( function () {
		var mobygames = JSON.parse(GM_getValue("mobygames") || "{}");

        $("input[name='image']").val(mobygames.cover);
        
        var add_screen = $("a:contains('+')");
        mobygames.screenshots.forEach(function(screenshot, index) {
			if (index >= 16) return;															//The site doesn't accept more than 16 screenshots
			if (index >= 3) add_screen.click();												//There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
            $("[name='screens[]']").eq(index).val(screenshot);											//Finally store the screenshot link in the right screen field.
		});
        
		GM_deleteValue("mobygames");
	});
}

function get_cover() {
    return new Promise( function (resolve, reject) {
                       GM_xmlhttpRequest({
                           method: "GET",
                           url: $("#coreGameCover>a").attr("href"),
                           onload: function(data) {
                               let cover = "";
                               cover = $(data.responseText).find("img[src*='covers']").attr("src");
                               if (cover.indexOf("http") == -1) cover = "https://" + window.location.hostname + cover;
                               resolve(cover);
                           },
                           onerror: function(error) {
                               throw error;
                           }
                       });
    });
}

function get_screenshots() {
    return new Promise( function (resolve, reject) {
        GM_xmlhttpRequest({
            method: "GET",
            url: document.URL+"/screenshots",
            onload: function(data) {
                let nbr_screenshots = 0;
                resolve(Promise.all($(data.responseText).find("#main .row:last a").map( function() {
                    let image_url = $(this).attr("href");
                    if ($(this).css("background-image").indexOf("title-screen") == -1 && nbr_screenshots < 16) {
                        nbr_screenshots++;
                        return new Promise (function (resolve, reject) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: image_url,
                                onload: function(data) {
                                    var screen = $(data.responseText).find(".screenshot img").attr("src");
                                    if (screen.indexOf("http") == -1) screen = "https://" + window.location.hostname + screen;
                                    resolve(screen);
                                },
                                onerror: function(error) {
                                    throw error;
                                }
                            });
                        }); 
                    }
                })));
            },
            onerror: function(error) {
                throw error;
            }
        });
    });
}

function add_validate_button() {
	if (typeof console != "undefined" && typeof console.log != "undefined") console.log("Adding button to window");
	$("body").prepend('<input type="button" id="save_link" value="Save link for GGn"/>');
	$("#save_link").click( function() {
		var mobygames = JSON.parse(GM_getValue("mobygames") || "{}");
        if (typeof mobygames == "string") mobygames = JSON.parse(mobygames);   //Fix for a weird bug happening on http://www.arkane-studios.com/uk/arx.php, transforming the array of strings into a string

        get_cover().then(function (cover) {
            mobygames.cover = cover;
        }).catch(function (err) {
            throw err;
        });
        
        get_screenshots().then(function(screenshots) {
            mobygames.screenshots = screenshots;
            GM_setValue("mobygames", JSON.stringify(mobygames));
        }).catch(function (err) {
            throw err;
        });
        
        mobygames.description = html2bb($(".col-md-8, .col-lg-8").html().replace(/[\n]*/g, "").replace(/.*<h2>Description<\/h2>/g, "").replace(/<div.*/g, "").replace(/< *br *>/g, "\n"));//YOU SHOULD NOT DO THIS AT HOME
        
        var alternate_titles = [];
        $("h2:contains('Alternate Titles')").next().find("li").each( function() {
            alternate_titles.push($(this).text().replace(/[^"]*"([^"]*)".*/g, "$1"));
        });
        mobygames.alternate_titles = alternate_titles.join(", ");
        
        var date_array = $("#coreGameRelease div:contains('Released')").next().text().split(", ");
        mobygames.year = date_array[date_array.length-1];
        
        var tags_array = $("#coreGameGenre div:contains('Genre')").next().text().split(/[\/,]/);
        tags_array = tags_array.concat($("#coreGameGenre div:contains('Setting')").next().text().split(/[\/,]/));
        tags_array = tags_array.concat($("#coreGameGenre div:contains('Gameplay')").next().text().split(/[\/,]/));
        var trimmed_tags_array = [];
        tags_array.forEach(function (tag) {
            if (tag.trim().toLowerCase().replace(" ", ".") !== "") trimmed_tags_array.push(tag.trim().toLowerCase().replace(" ", "."));
        });
        mobygames.tags = trimmed_tags_array.join(", ");
        
        mobygames.title = $(".niceHeaderTitle>a").text().trim();
        
        mobygames.platform = "";
        var platform = window.location.pathname.replace(/\/game\/([^\/]+)\/.*/, "$1");
        switch (platform) {
            case "macintosh":
                mobygames.platform = "Mac";
                break;
            case "iphone":
            case "ipad":
                mobygames.platform = "iOS";
                break;
            case "android":
                mobygames.platform = "Android";
                break;
            case "dos":
                mobygames.platform = "DOS";
                break;
            case "windows":
                mobygames.platform = "Windows";
                break;
            case "xbox":
                mobygames.platform = "Xbox";
                break;
            case "xbox360":
                mobygames.platform = "Xbox 360";
                break;
            case "gameboy":
                mobygames.platform = "Game Boy";
                break;
            case "gameboy-advance":
                mobygames.platform = "Game Boy Advance";
                break;
            case "gameboy-color":
                mobygames.platform = "Game Boy Color";
                break;
            case "nes":
                mobygames.platform = "NES";
                break;
            case "n64":
                mobygames.platform = "Nintendo 64";
                break;
            case "3ds":
                mobygames.platform = "Nintendo 3DS";
                break;
            case "nintendo-ds":
                mobygames.platform = "Nintendo DS";
                break;
            case "gamecube":
                mobygames.platform = "Nintendo GameCube";
                break;
            case "nintendo-ds":
                mobygames.platform = "Nintendo DS";
                break;
            case "snes":
                mobygames.platform = "Super NES";
                break;
            case "wii":
                mobygames.platform = "Wii";
                break;
            case "wii-u":
                mobygames.platform = "Wii U";
                break;
            case "playstation":
                mobygames.platform = "PlayStation 1";
                break;
            case "ps2":
                mobygames.platform = "PlayStation 2";
                break;
            case "ps3":
                mobygames.platform = "PlayStation 3";
                break;
            case "psp":
                mobygames.platform = "PlayStation Portable";
                break;
            case "ps-vita":
                mobygames.platform = "PlayStation Vita";
                break;
            case "dreamcast":
                mobygames.platform = "Dreamcast";
                break;
            case "game-gear":
                mobygames.platform = "Game Gear";
                break;
            case "sega-master-system":
                mobygames.platform = "Master System";
                break;
            case "genesis":
                mobygames.platform = "Mega Drive";
                break;
            case "sega-saturn":
                mobygames.platform = "Saturn";
                break;
            case "atari-2600":
                mobygames.platform = "Atari 2600";
                break;
            case "atari-5200":
                mobygames.platform = "Atari 5200";
                break;
            case "atari-7800":
                mobygames.platform = "Atari 7800";
                break;
            case "jaguar":
                mobygames.platform = "Atari Jaguar";
                break;
            case "lynx":
                mobygames.platform = "Atari Lynx";
                break;
            case "atari-st":
                mobygames.platform = "Atari ST";
                break;
            case "cpc":
                mobygames.platform = "Amstrad CPC";
                break;
            case "zx-spectrum":
                mobygames.platform = "ZX Spectrum";
                break;
            case "msx":
                mobygames.platform = "MSX";
                break;
            case "3do":
                mobygames.platform = "3DO";
                break;
            case "wonderswan":
                mobygames.platform = "Bandai WonderSwan";
                break;
            case "colecovision":
                mobygames.platform = "Colecovision";
                break;
            case "c64":
                mobygames.platform = "Commodore 64";
                break;
            case "amiga":
                mobygames.platform = "Commodore Amiga";
                break;
            case "commodore-16-plus4":
                mobygames.platform = "Commodore Plus-4";
                break;
            case "linux":
                mobygames.platform = "Linux";
                break;
            case "odyssey-2":
                mobygames.platform = "Magnavox-Phillips Odyssey";
                break;
            case "intellivision":
                mobygames.platform = "Mattel Intellivision";
                break;
            case "pc-fx":
                mobygames.platform = "NEC PC-FX";
                break;
            case "turbo-grafx":
                mobygames.platform = "NEC TurboGrafx-16";
                break;
            case "ngage":
                mobygames.platform = "Nokia N-Gage";
                break;
            case "ouya":
                mobygames.platform = "Ouya";
                break;
            case "sharp-x1":
                mobygames.platform = "Sharp X1";
                break;
            case "sharp-x68000":
                mobygames.platform = "Sharp X68000";
                break;
            case "neo-geo":
                mobygames.platform = "SNK Neo Geo";
                break;
            case "oric":
                mobygames.platform = "Tangerine Oric";
                break;
            case "thomson-mo":
                mobygames.platform = "Thomson MO5";
                break;
            case "supervision":
                mobygames.platform = "Watara Supervision";
                break;
            default:
                mobygames.platform = "Retro - Other";
                break;
        }
        
        alert("Uploady done !");
	});
}

function button_css () {
	return "input#save_link {\
                position: fixed;\
                left: 0;\
                top: 0;\
                z-index: 999999;\
                cursor: pointer;\
                height: auto;\
                width: auto;\
                padding: 10px;\
                background-color: lightblue;\
            }";
}