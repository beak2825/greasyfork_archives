// ==UserScript==
// @name         KSS PostImg it
// @namespace    http://tampermonkey.net/
// @version      1.3
// @include      https://gazellegames.net/upload.php*
// @include      https://gazellegames.net/torrents.php?action=editimages*
// @include      https://postimages.org/web
// @include      https://postimg.cc*
// @description  Migrate image links to and from Postimage
// @author       KSS
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/434647/KSS%20PostImg%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/434647/KSS%20PostImg%20it.meta.js
// ==/UserScript==

(function() {

	if (window.location.hostname == "gazellegames.net") {
        add_search_buttons()
    }
	else {
        if (window.location.hostname == "postimages.org") {
            add_validate_button();
        }
        else {
        if (window.location.hostname == "postimg.cc") {
            add_retrieve_button();
        }}
    }
	GM_addStyle(button_css());
})();

function add_search_buttons() {
    if(window.location.href.includes("editimages")) {
        var covfield = "[name='image']"
        }
    else {
        covfield = "#image";
        $("#image_block").prepend('<tr><td><input id="to_postimg" type="button" style="background-color:green;color:black" value="Send screenshots links to PostImg"/><input id="fill_form" type="button" style="background-color:red;color:black" value="Fill screenshots fields"/></td></tr>');
    }
    $(covfield).after('<tr><td><input id="cover_to_postimg" type="button" style="background-color:green;color:black" value="Send cover link to PostImg"/><input id="fill_cover" type="button" style="background-color:red;color:black" value="Fill cover field"/></td></tr>');


    $("#cover_to_postimg").click(function () {
        GM_setValue("covlink", $(covfield)[0].value);
        GM_setValue("typlink", 0);
        window.open("https://postimages.org/web")
    })

    $("#fill_cover").click(function () {
        $(covfield)[0].value = GM_getValue("covlink")
    })

    $("#to_postimg").click(function () {
        var imagelinks = "";
        for (let i = 0; i < 4; i++) {
            imagelinks += $("#screen"+i)[0].value + "\n"
        }
        for (let i = 3; i < 15; i++) {
            if ($("#screenSpan"+i)[0] !== undefined) {imagelinks += "\n" + $("#screenSpan"+i)[0].children[0].value}
        }
        GM_setValue("ilinks", imagelinks);
        GM_setValue("typlink", 1);
        window.open("https://postimages.org/web");
    })

        $("#fill_form").click(function () {
            var imagelinks = GM_getValue("ilinks");
            var links = imagelinks.split('\n');
            for(var i = 0;i < 4;i++){
                $("#screen"+i)[0].value = links[i]
            }
            if (links.length > 4) {
                for(i = 3;i < links.length - 1;i++){
                    $("#screenSpan"+i)[0].children[0].value = links[i+1]
            }}


    })


}



function add_validate_button() {
    var type = GM_getValue("typlink", 2);
    if (type == 0) {
        $("#uploadLinks").prepend('<input type="button" style="margin-top:3px;margin-right:5px;background-color: green; height: 50px" id="paste_links" value="Paste cover link and upload"/>');
    }
    else if (type == 1) {
         $("#uploadLinks").prepend('<input type="button" style="margin-top:3px;margin-right:5px;background-color: green; height: 50px" id="paste_links" value="Paste screenshot links and upload"/>');
    }

	$("#paste_links").click( function() {
        $("#weblinks")[0].focus();
        if (type == 0) {$("#weblinks")[0].value = GM_getValue("covlink")} else {$("#weblinks")[0].value = GM_getValue("ilinks")};
        var ulbutton = $("#uploadControls2")[0].firstElementChild.firstElementChild;
        ulbutton.focus();
        ulbutton.click()
	});
}

function add_retrieve_button() {
    var type = GM_getValue("typlink", 2);
    if (type == 0) {
        $("#code_direct").after('<input type="button" style="margin-top:3px;margin-right:5px;background-color: green; height: 50px; width: 200px" id="send_links" value="Send cover link to GGn"/>');
    }
    else if (type == 1) {
         $("#code_box").after('<input type="button" style="margin-top:3px;margin-right:5px;background-color: green; height: 50px; " id="send_links" value="Send screenshot links to GGn"/>');
    }

	$("#send_links").click( function() {
        if (type == 0) {
            GM_setValue("covlink",$("#code_direct")[0].value)
        }
        else {
            GM_setValue("ilinks",$("#code_box")[0].value)
        }
        GM_deleteValue("typlink");
        window.close();
	});

}


function button_css () {
	return "\
		#save_link {\
			position: fixed;\
			left: 0;\
			top: 0;\
			z-index: 9999999;\
			cursor: pointer;\
            height: 5vh;\
            width: 10vh;\
            background-color: lightblue;\
		}\
	";
}