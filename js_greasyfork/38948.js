// ==UserScript==
// @name     BlogClan Reference Helper
// @version  1.1
// @grant    none
// @include  http://blogclan.katecary.co.uk/*
// @require  https://code.jquery.com/jquery-2.2.4.min.js
// @description This is a userscript made to aid users who have to use BlogClan as a citation source
// @namespace https://greasyfork.org/users/172627
// @downloadURL https://update.greasyfork.org/scripts/38948/BlogClan%20Reference%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/38948/BlogClan%20Reference%20Helper.meta.js
// ==/UserScript==
(function () {
    var previousPageBtn = $(".nav-previous > a");
    var loadBtn = $("<div/>").attr({class: "js-ajax-load-comments btn btn-info"}).css({
        'padding': "8px 24px",
        'margin': "32px 0px"
    }).text("Load older");
    var loadAll = $("<div/>").attr({class: "js-ajax-load-all btn btn-info"}).css({
        'padding': "8px 24px",
        'margin': "0 0 32px 0px",
        'background-color': "#da3036",
        'border-color': "#c00000"
    }).text("Load all older");
    var pageNumRegex = /\d+(?=\/#comments)/;

    if (previousPageBtn.length > 0) {
        $("#respond").before(loadBtn, $("<br>"), loadAll);

        $(document).on("click", ".js-ajax-load-comments", function() {
            $(this).text("Loading...").addClass("disabled");
            loadOlder(false);
        }).on("click", ".js-ajax-load-all", function() {
            var shouldLoad = confirm("Are you sure? Loading all older comments might take a long time.");
            if(shouldLoad) {
                $(".js-ajax-load-comments").text("Loading...").addClass("disabled");
                $(this).addClass("disabled").text("This might take a while...");
                loadOlder(true);
            }
        });
    }

    addDirectLinks($(".commentlist"), getCurrentPage());
    highlightKatePosts($(".commentlist"));

    function loadOlder(shouldLoadAll) {
        $.get(previousPageBtn.attr("href"), function (data) {
            var previousUrl = previousPageBtn.attr("href");
            var ajaxBtn = $(".js-ajax-load-comments");
            var $data = $(data).find(".commentlist");

            addDirectLinks($data, previousUrl);
            highlightKatePosts($data);
            $(".commentlist").last().after($data);
            if(!shouldLoadAll) {
                ajaxBtn.text("Load older").removeClass("disabled");
            }

            if (getPageNum(previousUrl) === 1) {
                ajaxBtn.remove();
                $(".js-ajax-load-all").remove();
                $(".nav-previous").remove();
            }
            else {
                previousPageBtn.attr("href", previousUrl.replace(pageNumRegex, (getPageNum(previousUrl) - 1)));
                if(shouldLoadAll) {
                    loadOlder(true);
                }
            }
        });
    }

    function getPageNum(url) {
        return parseInt(url.match(pageNumRegex)[0]);
    }

    function getCurrentPage() {
        var result = "";
        var nextPageBtn = $(".nav-next > a");

        if(previousPageBtn.length > 0) {
            result = previousPageBtn.attr("href").replace(pageNumRegex, getPageNum(previousPageBtn.attr("href")) + 1);
        }
        else if (nextPageBtn.length > 0) {
            result = nextPageBtn.attr("href").replace(pageNumRegex, getPageNum(nextPageBtn.attr("href")) - 1);
        }
        else {
            var currentUrl = window.location.href;

            if(currentUrl.indexOf("/#comments") > -1) {
                result = currentUrl;
            }
            else if (currentUrl.slice(-1) === "/") {
                result = currentUrl + "#comments";
            }
            else {
                result = currentUrl + "/#comments";
            }
        }
        return result;
    }

    function addDirectLinks($container, page) {
        $container.find(".comment-body").each(function (i, e) {
            var $this = $(e);
            var id = $this.attr("id");
            var url = page.replace("#comments", "#" + id);
            var timestampEl = $this.find(".comment-meta");
            var link = $("<a/>").attr("href", url).text(timestampEl.text());

            timestampEl.html("").append(link);
        });
    }

    function highlightKatePosts($container) {
        $container.find(".comment-author-wp_hko7x6").each(function(i, e) {
            $(e).find(".comment-body").first().css({
                'background-color': "#ffffb9",
                'border-color': "#ffff72"
            });
            var author = $(e).find(".comment-author").first();
            author.text(author.text() + " - Kate Cary of BlogClan");
        });
    }
})();