    // ==UserScript==
    // @name           ResHack
    // @description    A brief description of your script
    // @author         Austin Fairgray
    // @include        https://discord.com*
    // @version        1.1
// @namespace https://greasyfork.org/users/708168
// @downloadURL https://update.greasyfork.org/scripts/416625/ResHack.user.js
// @updateURL https://update.greasyfork.org/scripts/416625/ResHack.meta.js
    // ==/UserScript==

    function displayContent(filter) {
        var src = [];
        var imgs = document.images;
        for (var i = 0, iLen = imgs.length; i < iLen; i++) {
            if (imgs[i].src.includes(filter)) {
                src[i] = imgs[i].src;
                window.open(imgs[i].src, '_blank');
                console.log(imgs[i].src);
            }
        }
    }

    var guiButtonUser = document.createElement("DIV");
    guiButtonUser.innerHTML = "User Icons";
    guiButtonUser.style = "border-radius:7px;background-color:#7289DA;padding:5px 70px;display:inline-block;font-family:sans-serif;border:0.5px solid #2C2F33;";
    guiButtonUser.id = "guiButtonUser";
    document.body.insertBefore(guiButtonUser, document.body.firstChild);

    var guiButtonIcons = document.createElement("DIV");
    guiButtonIcons.innerHTML = "Server Icons";
    guiButtonIcons.style = "border-radius:7px;background-color:#7289DA;padding:5px 70px;display:inline-block;font-family:sans-serif;border:0.5px solid #2C2F33;margin:0px 5px;";
    guiButtonIcons.id = "guiButtonIcons";
    document.body.insertBefore(guiButtonIcons, document.body.firstChild);

    document.getElementById('guiButtonUser').addEventListener("click", function () {
        displayContent("avatars"); //icons channel-icons
    });

    document.getElementById('guiButtonIcons').addEventListener("click", function () {
        displayContent("icons");
    });