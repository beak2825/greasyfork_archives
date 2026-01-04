// ==UserScript==
// @name         RARBG - Search on every page
// @namespace    NotNeo
// @version      0.2.0
// @description  Adds the search to the top-left corner on every page on RARBG
// @author       NotNeo
// @icon         https://therarbg.to/static/rarbg/image/rbg.png
// @match        https://*.therarbg.to/*
// @license      unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377367/RARBG%20-%20Search%20on%20every%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/377367/RARBG%20-%20Search%20on%20every%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addGlobalStyle(`
		#fixedSearch {
			position: fixed;
			left: 5px;
			top: 5px;
			z-index: 9999;
			background-color: #3860bb;
			border: 1px solid black;
			border-radius: 15px;
			padding: 5px;
		}

		#fixedSearchActivator {
			display: inline-block;
			vertical-align: top;
			cursor: pointer;
			background-color: rgba(255,255,255,.1);
			border-radius: 15px;
			padding: 10px;
		}
		#fixedSearchActivator > .userscript-search-icon {
			width: 25px;
			height: 25px;
		}

		#fixedSearchTorrent {
			border-radius: 15px;
			display: none;
			vertical-align: middle;
			float: right;
			margin-left: 10px;
		}
	`);
    $("body").append("<div id='fixedSearch'><span id='fixedSearchActivator'>" + `<svg class="userscript-search-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>` + "</span></div>");

    if($(".searchSec").length) {
        $(".searchSec").clone().appendTo("#fixedSearch");
        DoTheThings();
    }
    else {
        $.get("/", function(data){
            if(data) {
                try {
                    $("#fixedSearch").append($(data).find(".searchSec"));
                    DoTheThings();
                }
                catch(err) {
                    alert("error: something went wrong getting the search from the AJAX get data\n" + err.message);
                }
            }
            else {
                alert("error: something went wrong getting the data returned by the AJAX get");
            }
        }).fail(function(){
            alert("error: could not fetch data with AJAX get");
        });
    }

})();

function DoTheThings() {
    $("#fixedSearch").find(".searchSec").prop("id", "fixedSearchTorrent");
    $("#fixedSearchTorrent").find(".searchTerm").prop("id", "fixedSearchInput");
    //$("#fixedSearchTorrent").find("#SearchDescription").prop("id", "fixedSearchDescription");
    $("#fixedSearchInput").removeAttr("onclick").removeAttr("onfocus").removeAttr("onblur");
    $("#fixedSearchTorrent").find("#filterBtn").prop("id", "fixedShadvbutton");
    $("#fixedShadvbutton").removeAttr("onclick");
    $("#fixedShadvbutton").off();
    $("#fixedSearchTorrent").find(".filtOptn").prop("id", "fixedDivadvsearch");
    $("#fixedDivadvsearch").find(".filterButton[type='reset']").removeAttr("onclick");

    $("#fixedSearch").find("form").off();

    $("#fixedSearch").find(".searchButton[type='submit']").off();
    $("#fixedSearch").find(".searchButton[type='submit']").on('click', CopiedSubmit);

    $("#fixedShadvbutton").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $("#fixedDivadvsearch").toggle(100);
        return false;
    });

    $("#fixedDivadvsearch > .filterButton[type='reset']").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $("#fixedSearchTorrent input[type='checkbox']").prop("checked", false);
        return false;
    });

    $("#fixedSearchActivator").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $("#fixedSearchTorrent").toggle(100);
        $("#fixedSearchInput").focus();
        return false;
    });
    $(document).on('click', function(e) {
        if($(e.target).closest('#fixedSearch').length === 0) {
            $("#fixedSearchTorrent").hide(100);
        }
    });
}

function CopiedSubmit(event) {
    console.log("asdasd");
    event.preventDefault();
    event.stopPropagation();
    let searchValue = encodeURI($("#fixedSearch").find("#fixedSearchInput").val().replace(':', ' '));
    let sizeMinMb = encodeURI($("#fixedSearch").find("#sizeMin").val());
    let sizeMaxMb = encodeURI($("#fixedSearch").find("#sizeMax").val());
    let radMovies = encodeURI($("#fixedSearch").find("#radMovies").is(":checked"));
    let radTV = encodeURI($("#fixedSearch").find("#radTV").is(":checked"));
    let radGames = encodeURI($("#fixedSearch").find("#radGames").is(":checked"));
    let radMusic = encodeURI($("#fixedSearch").find("#radMusic").is(":checked"));
    let radAnime = encodeURI($("#fixedSearch").find("#radAnime").is(":checked"));
    let radApps = encodeURI($("#fixedSearch").find("#radApps").is(":checked"));
    let radOther = encodeURI($("#fixedSearch").find("#radOther").is(":checked"));
    let radXXX = encodeURI($("#fixedSearch").find("#radXXX").is(":checked"));

    if (searchValue) {
        let checked = {
            movies: radMovies,
            tv: radTV,
            games: radGames,
            music: radMusic,
            anime: radAnime,
            apps: radApps,
            other: radOther,
            xxx: radXXX,
            sizeMin: sizeMinMb,
            sizeMax: sizeMaxMb,
        };
        localStorage.setItem("checkedSearches", JSON.stringify(checked));
        let showAdultCon = localStorage.getItem("adultContentToggle") || "true";
        document.location =
            "/get-posts/keywords:" +
            searchValue +
            (radMovies === "true" ? `:category:Movies` : "") +
            (radTV === "true" ? `:category:TV` : "") +
            (radGames === "true" ? `:category:Games` : "") +
            (radMusic === "true" ? `:category:Music` : "") +
            (radAnime === "true" ? `:category:Anime` : "") +
            (radApps === "true" ? `:category:Apps` : "") +
            (radOther === "true" ? `:category:Other` : "") +
            (radXXX === "true" ? `:category:XXX` : "") +
            (showAdultCon === "false" ? `:ncategory:XXX` : "") +
            (Number(sizeMinMb) > 0 ? `:size__gte:${Number(sizeMinMb)*1000000}` : "") +
            (Number(sizeMaxMb) > 0 ? `:size__lte:${Number(sizeMaxMb)*1000000}` : "") +
            "/";
    }
    return false;
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