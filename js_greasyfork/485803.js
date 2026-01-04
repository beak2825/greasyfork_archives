// ==UserScript==
// @name            Klocksnack/Uhrforum
// @namespace       noc7c9
// @description     Klocksnack/Uhrforum image preview
// @include         https://klocksnack.se/forums/*
// @include         https://uhrforum.de/forums/*
// @require         https://code.jquery.com/jquery-3.1.1.min.js
// @version         1.0.20
// @license         MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @require      https://update.greasyfork.org/scripts/470224/1459364/Tampermonkey%20Config.js
// @downloadURL https://update.greasyfork.org/scripts/485803/KlocksnackUhrforum.user.js
// @updateURL https://update.greasyfork.org/scripts/485803/KlocksnackUhrforum.meta.js
// ==/UserScript==

const configDesc = {
    $default: {
        autoClose: false
    },
    age: {
        name: "Hide adds older than",
        type: "int"
    },
    hide_finished: {
        name: "Hide adds that are Avslutad",
        type: "bool", // Priority: High
        value: true // Priority: Highest
    },
    hide_tillbakadragen: {
        name: "Hide adds that are Tillbakadragen",
        type: "bool", // Priority: High
        value: true // Priority: Highest
    },
    hide_foretag: {
        name: "Hide adds Företagsannons",
        type: "bool", // Priority: High
        value: true // Priority: Highest
    },
    hide_vintage: {
        name: "Hide adds Vintage",
        type: "bool", // Priority: High
        value: false // Priority: Highest
    },
    hide_ohpf: {
        name: "Hide adds OHPF",
        type: "bool", // Priority: High
        value: false // Priority: Highest
    },
    hide_sales: {
        name: "Hide adds Säljes",
        type: "bool", // Priority: High
        value: false // Priority: Highest
    },
    hide_sales_bytes: {
        name: "Hide adds Säljes/Bytes",
        type: "bool", // Priority: High
        value: false // Priority: Highest
    }
};

var remove = [];
var remove_older_than = 10000;

// cached references
var initialUrl = document.location.href;
var $doc = $(document);
var $window = $(window);
var $windowScrollPos = $window.scrollTop.bind($window);
var $title = $('title');
var $replacementDiv;

// page load state vars
var nextUrl;
var pagesLoaded;
var scrollLoadPoints;

// load queue state vars
// used to make sure pages are always loaded in order
var loadInProgress = false;
var loadQueued = 0;

function get_links(obj) {
    let urls = obj.find(".structItem-cell--main");
    let size = 20.5

    let data_array = [];

    for (let i=0; i<urls.length; i++)
    {
        data_array.push("<div id='item' style='position: relative;float: left; margin:1em; width:" + size +"em; height:" + (size+4) +"em;'><a href='.'><img src='/favicon.ico' style='height:" + size +"em;object-fit: cover;width:" + size +"em;'>loading...<br>...</a></div>");
    }

    obj.html("<div>" + data_array.join("") + "</div>");
    $(urls).each(function(id) {
        let item = urls.eq(id);
        let anchor = $(item).find(".structItem-title").eq(0).find("a").eq(-1);
        let link = $(anchor).attr("href");

        $.get(link.replace(/unread$/, ''))
            .done(function (rawData) {
            var $data = $(rawData);
            var to_remove = false;

            let tags = $data.find('.bbImageWrapper, .attachmentList, .js-lbImage');
            if(tags.length == 0)
            {
                tags = $data.find('.bbWrapper');
            }

            let image_tag = tags.find("img").eq(0);

            let price = $data.find('.message-fields').eq(0).find("dd").eq(0);
            if(price.length > 0){
                price = "<div style='opacity:0.6;color:white;text-align:right;width:10em;background-color:red;position: absolute;  bottom: 4.5em;right: 0em;'>Price: " + price.html() + "&nbsp;&nbsp;</div>"
            }
            else
            {
                price = "";
            }
            let days = Math.round(((Date.now()/1000) - $data.find('.p-description').eq(0).find("time").eq(0).attr('data-time')) / (60 * 60 * 24));
            if (days > remove_older_than)
            {
                to_remove = true;
            }
            let age = "<div style='opacity:0.6;color:black;text-align:left;width:7em;background-color:yellow;position: absolute;  top: 0.4em;left: 0em;'>&nbsp;&nbsp;" + days + "&nbsp;days&nbsp;old&nbsp;&nbsp;</div>"

            var src = "";
            if(image_tag.attr("data-src") != null)
            {
                src = image_tag.attr('data-src');
            }
            else
            {
                src = image_tag.attr('src');
            }

            for (var i = 0; i < remove.length; i++) {
                if(item.html().includes("?prefix_id=" + remove[i] + "\""))
                {
                    to_remove = true
                }
            }
            if(to_remove)
            {
                let html = "";
                data_array[id] = html;
                obj.html("<div>" + data_array.join("") + "</div>");
            }
            else
            {
                let html = "<div id='item' style='position: relative;float: left; margin:1em; width:" + size +"em; height:" + (size+4) +"em;'><a href='" + link + "'><img src='" + src + "' style='height:" + size +"em;object-fit: cover;width:" + size +"em;'>" + price + age + "<br>" + item.html() + "</a></div>";
                data_array[id] = html;
                obj.html("<div>" + data_array.join("") + "</div>");
            }
        });
    });
    return obj;
}


// setup handler to actually reload if user changes history
$window.on('popstate', function (e) {
    var state = e.originalEvent.state;
    var url = state && state.url;
    if (url) {
        document.location = url;
    }
    console.log('popstate', state);
});

// don't allow auto scrolling on back/forward
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

$("document").ready( function() {
    if (initialUrl.startsWith("https://klocksnack.se/forums/handla-s%C3%A4ljes-bytes-k%C3%B6pes.11/") ||
        initialUrl.startsWith("https://klocksnack.se/forums/handla-s%C3%A4ljes-bytes-tillbeh%C3%B6r.50/") ||
        initialUrl.startsWith("https://klocksnack.se/forums/professional-dealers.66/") ||
        initialUrl.startsWith("https://klocksnack.se/forums/lifestyle-k%C3%B6p-s%C3%A4lj.46/") ||
        initialUrl.startsWith("https://uhrforum.de/forums/uhren-news.901/") ||
        initialUrl.startsWith("https://uhrforum.de/forums/angebote.11/")
       ) {
        const config = new GM_config(configDesc, { immediate: false, debug: false }); // Register menu commands

        remove_older_than = config.proxy.age;
        remove = [];
        if (config.proxy.hide_finished) remove.push(8);
        if (config.proxy.hide_tillbakadragen) remove.push(9);
        if (config.proxy.hide_foretag) remove.push(26);
        if (config.proxy.hide_vintage) remove.push(21);
        if (config.proxy.hide_ohpf) remove.push(11);
        if (config.proxy.hide_sales) remove.push(2);
        if (config.proxy.hide_sales_bytes) remove.push(6);

        console.log(remove);

        get_links($("div.js-threadList"));

        config.addEventListener("set", (e) => { // Listen to config changes
            location.reload();
        });
    }

});


