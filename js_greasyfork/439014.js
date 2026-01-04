// ==UserScript==
// @name         real-debrid torrents: textbox with all links
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.4
// @description  adds a button which when pressed creates a textbox with all links for you to copy in jDownloader2
// @author       Alistair1231
// @match        https://real-debrid.com/torrents*
// @icon         https://icons.duckduckgo.com/ip2/real-debrid.com.ico
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439014/real-debrid%20torrents%3A%20textbox%20with%20all%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/439014/real-debrid%20torrents%3A%20textbox%20with%20all%20links.meta.js
// ==/UserScript==
// https://openuserjs.org/scripts/Alistair1231/real-debrid_torrents_textbox_with_all_links
// https://greasyfork.org/en/scripts/439014-real-debrid-torrents-textbox-with-all-links

(function () {


    var linkButton = document.createElement("input");
    linkButton.type = "button";
    linkButton.value = "Show Links";
    linkButton.onclick = function () {
        createTextArea();
    }
    // align right
    jQuery(linkButton).css("float", "inline-end");
    // make vertically centered
    jQuery(linkButton).css("margin-top", "10px");

    jQuery(".content_separator_mini")[1].append(linkButton);


    function createTextArea() {
        var textbox = document.createElement("textarea");

        jQuery(textbox).css({ "position": "fixed", "width": "80%", "height": "80%", "z-index": "999998", "background": "rgba(0,0,0,0.7)", "color": "#fff", "font-size": "16px", "font-family": "Consolas", "padding": "10px", "resize": "none", "outline": "none", "border": "none", "box-shadow": "0 0 10px #fff", "-webkit-box-shadow": "0 0 10px #fff", "-moz-box-shadow": "0 0 10px #fff", "-o-box-shadow": "0 0 10px #fff", "left": "10%", "top": "8%" });
        // get all the links
        var links = jQuery.makeArray(jQuery("tr form[action='./downloader'] textarea")).map(e => e.value);
        var names = jQuery.makeArray(jQuery("tbody  td.t-left span")).map(x => x.innerText);
        names.forEach((x, i) => {
            links[i] = links[i] + "#name=" + x;
            console.log(links[i]);
        });
        // add the links to the textbox
        textbox.value = links.join('\n');

        document.getElementsByTagName("body")[0].prepend(textbox);
        // highlight the text in the textbox
        textbox.select();


        //create close button in top right corner
        var close = document.createElement("div");
        jQuery(close).css({ "position": "fixed", "top": "10%", "right": "10%", "width": "30px", "height": "30px", "background": "#fff", "border-radius": "50%", "cursor": "pointer", "text-align": "center", "line-height": "30px", "font-size": "25px", "font-weight": "bold", "color": "#000", "z-index": "999999" });
        close.innerHTML = "X";
        //when button clicked remove elements
        jQuery(close).click(function () {
            jQuery(textbox).remove();
            jQuery(close).remove();
        });

        // remove elements when escape is pressed
        jQuery(document).keyup(function (e) {
            if (e.keyCode == 27) {
                jQuery(textbox).remove();
                jQuery(close).remove();
            }
        });

        //remove elements when clicked outside of them
        jQuery(document).click(function (e) {
            if (e.target != textbox && e.target != close && e.target != linkButton) {
                jQuery(textbox).remove();
                jQuery(close).remove();
            }
        });
        document.getElementsByTagName("body")[0].prepend(close);


    }
})();
