// ==UserScript==
// @name         Creed Plus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Additional quality of life features for Pokemon Creed.
// @author       inTech (https://github.com/tejaboy)
// @match        https://pokemoncreed.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/390043/Creed%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/390043/Creed%20Plus.meta.js
// ==/UserScript==

$(document).ready(() => {
    var path = window.location.href.split("/");
    path = path[path.length - 1];

    if (path == "plus.php")
        showConfigurationPage();

    if (GM_getValue("enabled"))
    {
        if (path == "signature.php")
            showSignaturePage();
        else if (path.substr(0, 19) == "messages.php?f=send")
            showMessagePage();
        else if (path.substr(0, 12) == "map.php?map=")
            showMapPage();
        else if (path == "account.php")
            showAccountPage();
    }
});

// plus.php - custom page
function showConfigurationPage()
{
    // First Title
    $(".title").text("Creed Plus Configuration");

    // CSS Fix
    $(".contentcontent").css("text-align", "center");
    $(".contentcontent").css("padding", "10px");

    // Add enabled checkbox
    $(".contentcontent").html(
        '<input type="checkbox" name="enable"' + ((GM_getValue("enabled") == true) ? "checked" : "") + '> Enable CreedPlus' +
		'<div id="moreSettings">' +
			'<input type="checkbox" name="editorEnabled"' + ((GM_getValue("editorEnabled") == true) ? "checked" : "") + '> Enable WYSIWYG Editor (Message and Signature)<br />' +
		'</div>'
    )

    // QoL Animation
    if (!GM_getValue("enabled"))
        $("#moreSettings").hide();

    configurationInputHandler();
}

function configurationInputHandler()
{
    $("input[name='enable']").on("click", () => {
        GM_setValue("enabled", $("input[name='enable']").prop("checked"));

        // QoL Animation
        if (GM_getValue("enabled"))
            $("#moreSettings").fadeIn();
        else
            $("#moreSettings").fadeOut();
    });

    // TODO: Potential loop use for shoter codebase.
    $("input[name='editorEnabled']").on("click", () => {
        GM_setValue("editorEnabled", $("input[name='editorEnabled']").prop("checked"));
    });

    $("input[name='wasdMovementEnabled']").on("click", () => {
        GM_setValue("wasdMovementEnabled", $("input[name='wasdMovementEnabled']").prop("checked"));
    });

    $("input[name='QoLEnabled']").on("click", () => {
        GM_setValue("QoLEnabled", $("input[name='QoLEnabled']").prop("checked"));
    });
}

// signature.php
function showSignaturePage()
{
    showWYSIWYG($("textarea[name='signature']")[0]);
}

// message.php
function showMessagePage()
{
    showWYSIWYG($("#message")[0]);
}

// map.php
function showMapPage()
{
    // Enable WASD movement - could use IF statements but switch would be faster (by just a few ms).
    $(document).keydown((evt) => {
        switch(evt.keyCode)
        {
            case 87:
                move('up');
                break;

            case 83:
                move('down');
                break;

            case 65:
                move('left');
                break;

            case 68:
                move('right');
                break;
        }
    });

    // Enable sound effect when wild Pokemon appeared
    var audio = new Audio('http://23.237.126.42/ost/pokemon-gameboy-sound-collection/gbhogmtx/107-battle%20%28vs%20wild%20pokemon%29.mp3');

    $("#mapresult").on("DOMSubtreeModified", () => {
        if ($("input[value='Catch Pokemon']").length)
        {
            console.log("Pokemon appeared!");
            audio.play();
        }
        else
            audio.pause();
    });
}

function showAccountPage()
{
    var styles = {
        "Pokemon Creed": "s.css?v=4",
        "Night Fall": "s2.css",
        "Toxic Tech": "s3.css",
        "Black Royale": "s4.css",
        "Dream Eater": "s5.css",
        "Night Fall": "s50.css",
        "Night Fall": "s11.css",
    }

    $("form[method='post'] select[name='style']").on("change", () => {
        var selectedStyle = $("form[method='post'] select[name='style']").val()

        if (selectedStyle == 0)
            selectedStyle = ""

        $("link").first().attr("href", "s" + selectedStyle + ".css");
    });
}

// Plus Functions
function showWYSIWYG(element)
{
    if (!GM_getValue("editorEnabled"))
        return;

    var emotions = {
        dropdown: {
            ':3:': '3.gif',
            ':@': 'angry.gif',
            ':bad:': 'bad.gif',
            ':\'(': 'cry.gif'
        },

        more: {
            ':eee:': 'eee.gif',
            ':error:': 'error.gif',
            ':excited:': 'excited.gif',
            ':explode:': 'explode.gif',
        }
    };

    // Stylesheet can be loaded anytime. BBCode.js has to be loaded only when sceditor is 'read',
    loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/sceditor/2.1.3/themes/default.min.css");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/sceditor/2.1.3/sceditor.min.js", () => {
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/sceditor/2.1.3/formats/bbcode.js", () => {
            var textarea = element;

            sceditor.create(textarea, {
                format: 'bbcode',
                emoticonsRoot: 'https://pokemoncreed.net/forums/img/smilies/',
                emoticons: emotions,
                style: 'https://cdnjs.cloudflare.com/ajax/libs/sceditor/2.1.3/themes/default.min.css'
            });
        });
    });
}

// HELPERS
// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
function loadScript(url, callback = null)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    if (callback != null)
    {
        script.onreadystatechange = callback;
        script.onload = callback;
    }

    // Fire the loading
    head.appendChild(script);
}

// https://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
function loadStylesheet(url)
{
    var link = document.createElement("link");
    link.href = url;
    link.type = "text/css";
    link.rel = "stylesheet";

    document.head.appendChild(link);
}