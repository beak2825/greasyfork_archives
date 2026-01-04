// ==UserScript==
// @name         MyAnimeList BBCode Toolbar
// @namespace    https://github.com/eskander
// @version      2022-05-26
// @description  Advanced BBCode Editor for MyAnimeList.net
// @author       eskander
// @license      MIT

// @include      https://myanimelist.net/forum/?topicid=*
// @include      https://myanimelist.net/forum/?action=message&msgid=*
// @include      https://myanimelist.net/forum/?action=message&topic_id=*
// @include      https://myanimelist.net/forum/?action=post*
// @include      https://myanimelist.net/forum/index.php?action=post&boardid=*
// @include      https://myanimelist.net/forum/index.php?topicid=*
// @include      https://myanimelist.net/panel.php?go=editmanga&id=*
// @include      https://myanimelist.net/panel.php?go=add&selected_series_id=*
// @include      https://myanimelist.net/panel.php?go=addmanga&selected_manga_id=*
// @include      https://myanimelist.net/panel.php?go=anime_series&do=add
// @include      https://myanimelist.net/panel.php?go=mangadb&do=add
// @include      https://myanimelist.net/mymessages.php?go=send*
// @include      https://myanimelist.net/mymessages.php?toname=*
// @include      https://myanimelist.net/people.php?id=*
// @include      https://myanimelist.net/people/*
// @include      https://myanimelist.net/ownlist/anime/*
// @include      https://myanimelist.net/ownlist/manga/*
// @include      https://myanimelist.net/editprofile.php*
// @include      https://myanimelist.net/myblog.php*
// @include      https://myanimelist.net/clubs.php?cid=*
// @include      https://myanimelist.net/editclub.php?cid=*
// @include      https://myanimelist.net/profile/*
// @include      https://myanimelist.net/modules.php?go=report&type=forummessage&id=*
// @include      https://myanimelist.net/comtocom.php?id1=*
// @include      https://myanimelist.net/comments.php?id=*
// @include      https://myanimelist.net/editlist.php?type=anime&id=*
// @include      https://myanimelist.net/myfriends.php?go=add&id=*
// @include      https://myanimelist.net/blog.php?eid=*

// @exclude      https://myanimelist.net/editprofile.php?go=stylepref&do=cssadv&id=*
// @exclude      https://myanimelist.net/profile/*/*

// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @homepage     https://github.com/Eskander/myanimelist-bbcode-toolbar
// @supportURL   https://github.com/Eskander/myanimelist-bbcode-toolbar/issues/new
// @compatible   firefox
// @compatible   chrome
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/370335/MyAnimeList%20BBCode%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/370335/MyAnimeList%20BBCode%20Toolbar.meta.js
// ==/UserScript==

/**************************************************************************************************/
/* Disclaimer: MyAnimeList BBCode Toolbar is based on "BBCodes for MAL" script by Al_eXs          */
/*             and its continuation by Serhiyko.                                                  */
/*             Original source code: https://userscripts-mirror.org/scripts/show/142850 (mirror)  */
/*             Continuation:         https://greasyfork.org/en/scripts/5709-bbcodes-for-mal       */
/**************************************************************************************************/


// ----------------- Toolbar styling ----------------- //

(function () {
    // import font-awesome 
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/fontawesome.min.css');
    document.head.appendChild(link);

    // Greasemonkey compatibility
    if (typeof GM_addStyle == "undefined") {
        function GM_addStyle(css) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                // no head yet, stick it whereever
                document.documentElement.appendChild(node);
            }
        }
    }

    // toolbar style
    GM_addStyle(`
        #myBBcode {
            margin: 10px 0px 5px 0px;
            display: block;
            background-color: #2e51a2;
            width: 100%;
        }

        .bbcbtn {
            background-color: #2e51a2;
            border: none;
            color: #fff;
            width: 40px;
            height: 40px;
            font-family: 'FontAwesome';
            text-align: center;
            display: inline-block;
            cursor: pointer;
            outline:none;
        }

        .bbcbtn:hover {
            background-color: #e1e7f5;
            color: #000
        }

        .hidearrow {
            /* for Firefox */
            -moz-appearance: none;
            /* for Chrome */
            -webkit-appearance: none;
        }

        .divider {
            display: inline;
            border-left: 2px solid white;
        }

        .cpanel {
            display: none;
            color: #fff;
            text-align: center;
            padding: 10px;
        }

        .cfgbtn {
            float: right;
        }
    `);

    // forum quick reply overrides
    if (window.location.href.includes('myanimelist.net/forum/?topicid')) {
        GM_addStyle(`
            #myBBcode {
                background-color: #4f74c8 !important;
                min-width: 750px !important;
            }

            .bbcbtn {
                background-color: #4f74c8 !important;
            }

            .bbcbtn:hover {
                background-color: #e1e7f5 !important;
            }
        `);
    }
})();

var Interactive = GM_getValue('Interactive', true);

function interractivePopup(desc) {
    if (Interactive) {
        return prompt(desc, "");
    }
    else {
        return "";
    }
}

// ----------------- Functionality of each button ----------------- //

function addtag(snap, tag) {
    var textareaNumber = getXpathSnapNumber(snap);
    obj = document.getElementsByTagName("textarea")[textareaNumber];

    beforeText = obj.value.substring(0, obj.selectionStart);
    selectedText = obj.value.substring(obj.selectionStart, obj.selectionEnd);
    afterText = obj.value.substring(obj.selectionEnd, obj.value.length);
    newText = null;

    switch (tag) {

        case "bold":
            tagOpen = "[b]";
            tagClose = "[/b]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "strike":
            tagOpen = "[s]";
            tagClose = "[/s]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "italic":
            tagOpen = "[i]";
            tagClose = "[/i]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "underline":
            tagOpen = "[u]";
            tagClose = "[/u]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "code":
            tagOpen = "[code]";
            tagClose = "[/code]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "centre":
            tagOpen = "[center]";
            tagClose = "[/center]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "right":
            tagOpen = "[right]";
            tagClose = "[/right]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "spoiler":
            spoiler = interractivePopup("Enter spoiler name (or leave blank)");

            if (spoiler) {
                spoiler = '="' + spoiler + '"';
            }

            tagOpen = "[spoiler" + spoiler + "]";
            tagClose = "[/spoiler]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "url":
            urlOrDesc = interractivePopup("Enter URL or URL description");

            if (!urlOrDesc) {
                urlOrDesc = selectedText;
                selectedText = '';
            }

            if (urlOrDesc.indexOf("http://") == 0 || urlOrDesc.indexOf("https://") == 0) {
                tagOpen = "[url=" + urlOrDesc + "]";
                tagClose = "[/url]";
            } else {
                tagOpen = "[url=";
                tagClose = "]" + urlOrDesc + "[/url]";
            }

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "image":
            imgValue = document.getElementById("Image").value;
            imgURL = interractivePopup("Enter image URL");

            if (imgURL) {
                selectedText = imgURL;
            }

            tagOpen = "[img" + String(imgValue) + "]";
            tagClose = "[/img]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "size":
            txtSize = document.getElementById("Size");

            if (txtSize.value == "enter") {
                txtSizeName = interractivePopup("Enter the size (1 is minimum, 100 is default)");
            } else {
                txtSizeName = txtSize.value;
            }

            tagOpen = "[size=" + String(txtSizeName) + "]";
            tagClose = "[/size]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "youtube":
            yt = interractivePopup("Enter complete Youtube url");

            if (yt.includes("youtube.com")) {
                yt = yt.replace("https://", "http://");
                yt = yt.replace("http://www.youtube.com/watch?v=", "http://youtube.com/watch?v=");
                yt = yt.replace("http://youtube.com/watch?v=", "");
                yt = yt.substring(0, 11);
            }

            tagOpen = "[yt]";
            tagClose = "[/yt]";

            newText = beforeText + tagOpen + yt + tagClose + afterText;
            break;

        case "colour":
            colour = document.getElementById("Colour");

            if (colour.value == "enter") {
                colourName = interractivePopup("Enter the colour name or hex value (e.g. #abc123)");
            } else {
                colourName = colour.value;
            }

            tagOpen = "[color=" + String(colourName) + "]";
            tagClose = "[/color]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "quote":
            quote = interractivePopup("Enter quoted person name");

            if (quote) {
                quote = "=" + quote;
            }

            tagOpen = "[quote" + quote + "]";
            tagClose = "[/quote]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "list":
            tagOpen = "[list][*]";
            tagClose = "[/list]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "list=1":
            tagOpen = "[list=1][*]";
            tagClose = "[/list]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "[*]":
            tagOpen = "[*]";
            tagClose = "";

            newText = beforeText + tagOpen + selectedText + afterText;
            break;
    }

    if (newText != null) {
        caretStart = obj.selectionStart;
        caretEnd = obj.selectionEnd;
        if (selectedText.length == 0) {
            caretEnd -= tagClose.length;
        }
        caretEnd += newText.length - obj.value.length;
        caretStart = caretEnd;
        obj.value = newText;
        obj.setSelectionRange(caretStart, caretEnd);
    }
    obj.focus();
}

// ----------------- Some preliminary magic ----------------- //

function xpath(query, object) {
    if (!object) var object = document;
    return document.evaluate(query, object, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function getXpathSnap() {
    var path = xpath("//textarea[@class='textarea']");
    if (path.snapshotLength == 0 || path.snapshotItem(0).id == "add_anime_tags" || path.snapshotItem(0).id == "add_manga_tags") {
        path = xpath("//textarea[@class='inputtext']");
        if (path.snapshotItem(j).previousElementSibling == null) {
            return (path.snapshotLength > 0) ? path.snapshotItem(0) : false;
        }
    }
    for (var j = 0; j < path.snapshotLength; j++) {
        if (path.snapshotItem(j).previousElementSibling == null) {
            if (path.snapshotItem(j).id != "add_anime_tags" && path.snapshotItem(j).id != "add_manga_tags") {
                return path.snapshotItem(j);
            }
        } else {
            if (path.snapshotItem(j).previousElementSibling.id != 'myBBcode' && (path.snapshotItem(j).previousElementSibling.tagName != 'GRAMMARLY-GHOST' && (path.snapshotItem(j).previousElementSibling.previousElementSibling === null || path.snapshotItem(j).previousElementSibling.previousElementSibling.id != 'myBBcode'))) {
                return path.snapshotItem(j);
            }
        }
    }
    return false;
}

function getXpathSnapNumber(xpathToBeNumbered) {
    var path = xpath("//textarea");
    for (var i = 0; i < path.snapshotLength; i++) {
        if (path.snapshotItem(i) === xpathToBeNumbered) {
            return i;
        }
    }
}

setTimeout(function () {
    var allReplies = xpath("//a[@title='Reply to this comment'] | //a[contains(@class, 'ml8')][text() = 'Reply'] | //input[@id='postReply'][@value='Submit']");
    for (var i = 0; i < allReplies.snapshotLength; i++) {
        (function (ind) {
            allReplies.snapshotItem(ind).addEventListener("click", function () {

                var repeatCount0 = 0;
                var replyTimer0 = setInterval(function () {
                    var replied;
                    var replyButton = xpath("//input[@value='Submit Reply'] | //a[@class='quickEdit'][text() = 'Quick Edit']");
                    if (replyButton.snapshotLength > 0) {
                        xpathSnap = getXpathSnap();
                        createButtons();
                        replyButton.snapshotItem(0).addEventListener("click", function () {
                            replied = replyTimer();
                        }, false);  //Modern browsers
                    }

                    function replyTimer() {
                        var repeatCount = 0;
                        return setInterval(function () {
                            addCodeToEdits();
                            repeatCount += 1;
                            if (repeatCount >= 18) {
                                clearInterval(replied);
                            }
                        }, 500);
                    }

                    repeatCount0 += 1;
                    if (repeatCount0 >= 72) {
                        clearInterval(replyTimer0);
                    }
                }, 100);

            }, true);
        })(i);
    }

    addCodeToEdits();
}, 100);

function addCodeToEdits() {
    var allEdits = xpath("//a[@title='Edit Comment']");
    var toEdit;
    for (var i = 0; i < allEdits.snapshotLength; i++) {
        (function (ind) {
            allEdits.snapshotItem(ind).removeEventListener("click", function () {
                toEdit = editTimer();
            });
            allEdits.snapshotItem(ind).addEventListener("click", function () {
                toEdit = editTimer();
            }, true);
        })(i);
    }
    function editTimer() {
        var repeatCount = 0;
        return setInterval(function () {
            xpathSnap = getXpathSnap();
            createButtons();
            repeatCount += 1;
            if (repeatCount >= 12) {
                clearInterval(toEdit);
            }
        }, 400);
    }
}

while (xpathSnap = getXpathSnap()) {
    createButtons();
}

// ----------------- Generate toolbar ----------------- //

function createButtons() {
    if (xpathSnap) {

        var xpathSnapCur = xpathSnap;
        var div1 = document.createElement("div");
        div1.align = "Left";
        div1.id = "myBBcode";
        div1.innerHTML = " ";
        xpathSnap.parentNode.insertBefore(div1, xpathSnap);

        // set button content
        function setButton(name, glyph) {
            var post = document.createElement("button");
            post.type = "button";
            post.innerHTML = glyph;
            post.title = name[0].toUpperCase() + name.slice(1);
            post.setAttribute('class', 'fa bbcbtn');
            post.addEventListener('click', function () {
                addtag(xpathSnapCur, name);
            }, false);
            div1.appendChild(post);
        }

        function setSize(size) {
            var opt = document.createElement("option");
            opt.value = size;
            opt.appendChild(document.createTextNode(size + "%"));
            postSize.appendChild(opt);
        }

        function setColor(color) {
            var opt = document.createElement("option");
            opt.value = color;
            opt.appendChild(document.createTextNode(color));
            postColour.appendChild(opt);
        }

        function setImage(imgText, imgVal) {
            var opt = document.createElement("option");
            opt.value = imgVal;
            opt.appendChild(document.createTextNode(imgText));
            postImage.appendChild(opt);
        }

        function setDivider() {
            var opt = document.createElement("div");
            opt.setAttribute('class', 'divider');
            div1.appendChild(opt);
        }

        // ----------------- Toolbar layout ----------------- //

        setButton("bold", "&#xf032;");
        setButton("italic", "&#xf033;");
        setButton("strike", "&#xf0cc;");
        setButton("underline", "&#xf0cd;");

        // Size selector
        var postSize = document.createElement("select");
        postSize.id = "Size";
        postSize.title = "Size";
        postSize.setAttribute('class', 'fa bbcbtn hidearrow');

        // First size selector
        var opt = document.createElement("option");
        opt.value = "";
        opt.setAttribute('selected', '');
        opt.setAttribute('disabled', '');
        opt.setAttribute('hidden', '');
        opt.appendChild(document.createTextNode(""));
        postSize.appendChild(opt);

        // Predefined sizes
        setSize("20");
        setSize("50");
        setSize("100");
        setSize("300");
        setSize("600");

        // Custom size
        var opt = document.createElement("option");
        opt.value = "enter";
        opt.appendChild(document.createTextNode('Enter size'));
        postSize.appendChild(opt);

        postSize.addEventListener('change', function () {
            document.getElementById("Size").value = postSize.value;
            addtag(xpathSnapCur, 'size');
            postSize.value = 'Size';
            this.selectedIndex = 0;
        }, false);
        div1.appendChild(postSize);

        // Color selector
        var postColour = document.createElement("select");
        postColour.id = "Colour";
        postColour.title = "Color";
        postColour.setAttribute('class', 'fa bbcbtn hidearrow');

        // First color selector
        var opt = document.createElement("option");
        opt.value = "";
        opt.setAttribute('selected', '');
        opt.setAttribute('disabled', '');
        opt.setAttribute('hidden', '');
        opt.appendChild(document.createTextNode(""));
        postColour.appendChild(opt);

        // Predefined colors
        setColor("Grey");
        setColor("Blue");
        setColor("Red");
        setColor("Green");
        setColor("Yellow");
        setColor("Pink");
        setColor("Navy");
        setColor("White");
        setColor("Black");
        setColor("Orange");
        setColor("Purple");

        // Custom color
        var opt = document.createElement("option");
        opt.value = "enter";
        opt.appendChild(document.createTextNode('Enter colour'));
        postColour.appendChild(opt);

        postColour.addEventListener('change', function () {
            document.getElementById("Colour").value = postColour.value;
            addtag(xpathSnapCur, 'colour');
            postColour.value = 'Select';
            this.selectedIndex = 0;
        }, false);
        div1.appendChild(postColour);

        setDivider();

        setButton("centre", "&#xf037;");
        setButton("right", "&#xf038;");

        setDivider();

        setButton("url", "&#xf0c1;");
        setButton("spoiler", "&#xf06a;");

        // Image selector
        var postImage = document.createElement("select");
        postImage.id = "Image";
        postImage.title = "Image";
        postImage.setAttribute('class', 'fa bbcbtn hidearrow');

        // First image selector
        var opt = document.createElement("option");
        opt.value = "";
        opt.setAttribute('selected', '');
        opt.setAttribute('disabled', '');
        opt.setAttribute('hidden', '');
        opt.appendChild(document.createTextNode(""));
        postImage.appendChild(opt);

        // Predefined image alignments
        setImage("Image", "");
        setImage("Image right", " align=right");
        setImage("Image left", " align=left");

        postImage.addEventListener('change', function () {
            document.getElementById("Image").value = postImage.value;
            addtag(xpathSnapCur, 'image');
            postImage.value = 'Select';
            this.selectedIndex = 0;
        }, false);
        div1.appendChild(postImage);

        setButton("youtube", "&#xf03d;");
        setButton("code", "&#xf121;");
        setButton("quote", "&#xf10d;");

        setDivider();

        setButton("list", "&#xf0ca;");
        setButton("list=1", "&#xf0cb;");
        setButton("[*]", "&#xf0fe;");

        // ----------------- Settings panel ----------------- //

        // Create settings button
        var post = document.createElement("button");
        post.type = "button";
        post.innerHTML = "&#xf013;";
        post.title = "Show/Hide settings";
        post.setAttribute('class', 'fa bbcbtn cfgbtn');
        post.addEventListener('click', function () {
            if (document.getElementById("cpanel").style.display == "block") {
                for (i=0; i < document.getElementsByClassName("cpanel").length; i++){
                    document.getElementsByClassName("cpanel")[i].style.display = "none"
                  }
            } else {
                for (i=0; i < document.getElementsByClassName("cpanel").length; i++){
                    document.getElementsByClassName("cpanel")[i].style.display = "block"
                  }
            }
        }, false);
        div1.appendChild(post);

        // Popups checkbox logic
        var InteractiveBoxState = '';

        if (Interactive) {
            InteractiveBoxState = 'checked';
        } else {
            InteractiveBoxState = '';
        }

        var opt = document.createElement("div");
        opt.setAttribute('class', 'cpanel');
        opt.id = "cpanel";
        opt.innerHTML = '<input type="checkbox" id="IntBox" ' + InteractiveBoxState + '><label for="IntBox" title="Show dedicated pop-ups for certain buttons.">Enable pop-ups.</label>';
        div1.appendChild(opt);

        // Remember setting across sessions
        document.getElementById("IntBox").addEventListener('change', function () {
            if (document.getElementById("IntBox").checked == true) {
                Interactive = true;
                GM_setValue('Interactive', true);
            } else {
                Interactive = false;
                GM_setValue('Interactive', false);
            }
        }, false);

    }
}
