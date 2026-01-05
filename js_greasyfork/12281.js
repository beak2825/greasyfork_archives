// ==UserScript==
// @name         EX Better Thumbnails
// @description      Provides infinite scroll and larger thumbnails for gallery browsing. 
// @version      0.63
// @match        https://exhentai.org/g/*
// @grant        none
// @namespace https://greasyfork.org/users/13871
// @downloadURL https://update.greasyfork.org/scripts/12281/EX%20Better%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/12281/EX%20Better%20Thumbnails.meta.js
// ==/UserScript==

const titleInputBoxMode = false;

var thisURL = document.createElement("a");
thisURL.href = document.URL;
var i = 0;
var URLGen = URLGenerator();
var fileCount;
var len = 0;
var gdata;
const jQueryCDN = "https://code.jquery.com/jquery-1.11.3.min.js";
const api = "https://exhentai.org/api.php";

const CSSCode = ".select {float: left}";

function loadJS(URL, callback) {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = URL;
    if (callback) {
        js.onload = callback;
    }
    document.head.appendChild(js);
}

(function() {
    callback = function() {
        changeLayout();
        injectCSS();
        // injectBar();
        request(gid, token);
        main();
    }
    loadJS(jQueryCDN, callback);
})();

function injectCSS() {
    var css = $("<style></style>");
    css.html(CSSCode);
    $("body").append(css);
}

function injectBar() {
    $('<div id="controlbar"></div>').prependTo($("#gdt"));
    var button = $('<button id="debug">debug</button>').click(function() {listChecked();});
    $('#controlbar').append(button);
}

function request(gid, token) {
    var data = {
        method: "gdata",
        gidlist: [
            [gid, token]
        ]
    };
    data = JSON.stringify(data);
    var r = $.ajax({
        url: api,
        data: data,
        dataType: "JSON",
        type: "POST",
        contentType: "application/json",
        success: function(res, error) {
            gdata = res;
            fileCount = Number(gdata["gmetadata"][0]["filecount"]);
            console.log("File count: " + fileCount);
        }
    });
}

function* URLGenerator() {
    var base = thisURL.protocol + "//" + thisURL.hostname + thisURL.pathname + "?inline_set=ts_l";
    while (true) {
        yield base + "&" + "p=" + i;
        i += 1;
    }
}

function openPageURL(URL, elem) {
    var callback = function(data) {
        var DOM = $.parseHTML(data);
        var imgURL = $(DOM).find("#img").prop("src");
        var original = ""
        try {
            original = $(DOM).find("#i7").find("a").prop("href");
        } catch (err) {
            console.log(err);
        }
        if (original) {
            imgURL = original;
        }
        if (elem) {
            var k = document.createElement('a');
            k.href = imgURL;
            k.download = true;
            k.click();
            k.remove();
        }
    }
    $.get(URL, callback);
}

function insert(URL) {
    $.get(URL, function(data) {
        var DOM = $.parseHTML(data);
        $(DOM).find(".gdtl").each(function() {
            var title = $(this).find("img").prop("title");
            var fname = title
            var caption = $('<div class="caption"></div>');
            $(caption).appendTo(this);
            var pageURL = $(this).find("a").prop("href");
            $(caption).html("<a href=" + '"javascript: void(0);"' +">"+ fname + "</a>");
            $(caption).find("a").click(function() {
                openPageURL(pageURL, $(caption).find("a"));
            });
            $("#gdt > .c").before(this);
            $(this).hide().fadeIn();
        });
    })
}

function call() {
    var url = URLGen.next().value;
    console.log(url);
    insert(url);
}

function changeLayout() {
    if (titleInputBoxMode) {
        var i =$( '<input type="text" value=""></input>');
        i.prop("value", $("#gn").html());
        $("#gn").html(i);
    }
    $("#asm, #gdo, .gtb, #frontpage").remove();
    var thumbnails = document.getElementById("gdt");
    document.body.insertBefore(thumbnails, document.body.lastChild);
    $(".gdtm, .gdtl").each(function() {
        $(this).remove()
    })
}

function main() {
    if (len == 0) {
        call();
    }
    $(window).scroll(function() {
        len = $(".gdtl").length;
        if (len < fileCount && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            call();
        }
    })
}