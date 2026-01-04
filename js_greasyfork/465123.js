// ==UserScript==
// @name         TVTime Torrents Support
// @license      MIT
// @version      1.0.1
// @description  Quick Episode Torrent Results and Torrent Search at many Torrent Sites, Adds buttons of favorite torrent providers that populate list with episode search results and direct buttons for torrent search in providers space, in order to work requires "Allow CORS: Access-Control-Allow-Origin" addon, tested on firefox. Based on etcho "TVTime fast search episodes at many torrent sites" script.
// @author       MagicTouch
// @include      *www.tvtime.com*
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAIAAAC0D9CtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACL0lEQVQoz4WSMYtcZRiFn/N9372zO0mIwmJiirQmGIe1SIpY2NmJgUD+QP6DXf6B/8JGu4AWCYh2giCEFIKEQEhwE4NZl3Hmzs69c7/3WMwSFhsPvOXDec/7Ht24fl0CgR22EBgJG2QkCdhOFkCxI+cMICX+R4YIih2ffbr8eN8eI8Y5rjLukXj2R/724cXS7AI2ESAZl7D398cvbok+YviH2hN4gTK/PGq+ebBnn5ikRISj1jKOsVjor9ekgXMNGWrl6FAhjub5LbBVOJTQbDZ7b2/YndZpO967e/DB5eHgTbnz5f7OxLmAw6e4qEBfgDd/78Shzu70/Sp5pF/ntqm3P+8++tCxWXtc4GBAwYtX+evv94ok2xgDFUaopBxXrtRPbqJhk+qCqGNHjJx/UvrhQjk5ou3qcc7mkJi7H/zocerXceGcr14mi9+ftgevm+cvm+OhLSeAsV1EERLrtb970D78sd68li/dZtKmH35+56df3z3us52KbUkpy6TfXrRdH3/OG1vLrqRVXi5zDKqw7JqjxXSsKWIoKaWUUs65Rv7q/vuOapMathljQ10SLbGJWmuttik2ETFpCzm3zfltvG613u5LtQYkXKk1ajVQhP/zOEA6aeriOD85aJomjhayDUlYs9lM0nR3cprpVutSSkqSh8IKx/GmqbRSkihJMnTdOuVUSgEiQoRjrEFYvc+AkBMYpFSmu5O+7zdhnfIZq5O9rbMEWGAh0nSn/RecmV5Rm5YiMAAAAABJRU5ErkJggg==
// @grant        none
// @namespace https://greasyfork.org/users/1063753
// @downloadURL https://update.greasyfork.org/scripts/465123/TVTime%20Torrents%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/465123/TVTime%20Torrents%20Support.meta.js
// ==/UserScript==

var providers = [
    {id: "torrentgalaxy", label: "Torrent Galaxy", url: "https://torrentgalaxy.to/torrents.php?search=", sufix: ""},
    {id: "1337x", label: "1337x", url: "http://1337x.to/search/", sufix: "/1/"},
    {id: "thepiratebay", label: "The Pirate Bay", url: "https://thepiratebay.org/search/", sufix: ""},
    {id: "rarbg", label: "RARBG", url: "https://rarbgget.org/torrents.php?search=", sufix: ""},
    {id: "eztv", label: "EZTV", url: "https://eztv.ag/search/", sufix: ""},
    {id: "extratorrent", label: "Extra Torrent", url: "https://extratorrent.cyou/fullsearch?q=", sufix: ""},
    {id: "torrentdownloads", label: "Torrent Downloads", url: "https://www.torrentdownloads.me/search/?search=", sufix: ""},
    {id: "demonoid", label: "Demonoid", url: "https://dnoid.to/files/?query=", sufix: ""},
    {id: "torlock", label: "Torlock", url: "https://www.torlock.com/television/torrents/", sufix: ".html?sort=seeds"}
];

var last_watchlist_count=0;

$(document).ready(function(){
    var provider_html = "";
    var torrentlist_html = "";

    provider_html += "<style>";
    provider_html += "#torrent-provider-button{font-size: 10px; box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px; margin-top: -18px; margin-right: 3px; cursor: pointer; background-color: #444444; color: #ffd90e; padding: 0px 5px; border-radius: 3px; position: fixed; z-index: 101;right: 0; }";
    provider_html += "#torrent-provider-button:hover{ background-color: #666; }";
    provider_html += "#torrent-provider-list{ display: none; list-style: none; box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px; text-align: right; position: absolute; width: 90px; right: 2px; font-size: 10px; line-height: 11px; background: #ffda0e; border-radius: 3px; padding: 0; margin-top: -7px; padding-top: 4px; padding-bottom: 2px; z-index: 100;position: fixed; }";
    provider_html += "#torrent-provider-list li{ padding: 1px 3px 0px 0px; cursor: pointer; color: #444; }";
    provider_html += "#torrent-provider-list li:hover, #torrent-provider-list li.selected{ background-color: #444; color: #ffee51; }";
    provider_html += "#torrent-quality-button {font-size: 10px;box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px;margin-top: -18px;margin-right: 85px;cursor: pointer;background-color: #444444;color: #ffd90e;padding: 0px 5px;border-radius: 3px;z-index: 101;position: fixed;right: 0;}";
    provider_html += "#torrent-quality-button:hover{ background-color: #666; }";
    provider_html += "#torrent-quality-list {display: none;list-style: none;box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px;text-align: right;width: 90px;right: 86px;font-size: 10px;line-height: 11px;background: #ffda0e;border-radius: 3px;padding: 0;margin-top: -7px;padding-top: 4px;padding-bottom: 2px;z-index: 100;position: fixed;}";
    provider_html += "#torrent-quality-list li{ padding: 1px 3px 0px 0px; cursor: pointer; color: #444; }";
    provider_html += "#torrent-quality-list li:hover, #torrent-quality-list li.selected{ background-color: #444; color: #ffee51; }";
    provider_html += "#torrent-list {display:none;position:absolute;z-index:9999;background-color:#ffffffef;border-radius:5px;box-shadow: 0 0 2px #777;padding:5px;}";
    provider_html += "#torrent-list table tbody th {background-color: #fbef4554;padding: 2px;font-size: 14px;}";
    provider_html += "#torrent-list td {padding-left:5px;padding-right:5px;}";
    provider_html += "#torrent-list table {font-size:12px;}";
    provider_html += "#torrent-list.show{display:block;}";
    provider_html += ".to-watch-list > li:hover .dl_links {transition: opacity 0.5s;opacity: 1;}";
    provider_html += ".dl_links {opacity: 0;}";
    provider_html += ".dl_button.quick {background-color: #686868 !important;color: #ddbb03 !important;border-radius: 3px;padding-left: 2px !important;padding-right: 4px !important;letter-spacing: 0.2px;padding-top: 3px !important;padding-bottom: 2px !important;width: 24px;height: 24px;}";
    provider_html += ".dl_button.quick:hover {text-shadow: 0px 0 3px black;background-color: #a4a4a4 !important;}";
    provider_html += "</style>";

    provider_html += "<div id='torrent-quality-button'>";
    provider_html += "torrent quality";
    provider_html += "</div>";

    provider_html += "<ul id='torrent-quality-list'>";
    provider_html += "<li identifier='720p'" + (getTorrentQualityCookie() == "720p" ? " class='selected'" : "") + ">[HD] 720p</li>";
    provider_html += "<li identifier='1080p'" + (getTorrentQualityCookie() == "1080p" ? " class='selected'" : "") + ">[FHD] 1080p</li>";
    provider_html += "<li identifier='2160p'" + (getTorrentQualityCookie() == "2160p" ? " class='selected'" : "") + ">[4K] 2160p</li>";
    provider_html += "<li identifier='all'" + (getTorrentQualityCookie() == "all" || (getTorrentQualityCookie() === "") ? " class='selected'" : "") + ">All Results</li>";
    provider_html += "</ul>";

    provider_html += "<div id='torrent-provider-button'>";
    provider_html += "torrent provider";
    provider_html += "</div>";

    provider_html += "<ul id='torrent-provider-list'>";
    for (var i=0; i<providers.length; i++){
        provider_html += "<li identifier='" + providers[i].id + "'" + (getTorrentProviderCookie() == providers[i].id || (getTorrentProviderCookie() === "" && providers[i].id == "1337x") ? " class='selected'" : "") + ">" + providers[i].label + "</li>";
    }
    provider_html += "</ul>";

    $("#to-watch").prepend(provider_html);
    torrentlist_html+="<div id='torrent-list'></div>";
    $("#to-watch").prepend(torrentlist_html);

    $("#torrent-provider-button").on("click", function(){
        $("#torrent-provider-list").slideToggle(150);
    });

    $("#torrent-provider-list li").on("click", function(){
        setCookie("torrent-provider", $(this).attr("identifier"), 365);
        $("#torrent-provider-list li").removeClass("selected");
        $(this).addClass("selected");
        $("#torrent-provider-list").slideUp(150);
        update_dl_links(true);
    });
    update_dl_links();

    $("#torrent-quality-button").on("click", function(){
        $("#torrent-quality-list").slideToggle(150);
    });
    $("#torrent-quality-list li").on("click", function(){
        setCookie("torrent-quality", $(this).attr("identifier"), 365);
        $("#torrent-quality-list li").removeClass("selected");
        $(this).addClass("selected");
        $("#torrent-quality-list").slideUp(150);
    });

    $(document).on('click', function(e) {
        //Hide torrent providers menu in case left open
        if ($(e.target).attr("id")!='torrent-provider-button') {
            $("#torrent-provider-list").slideUp(200);
        }
        if ($(e.target).attr("id")!='torrent-quality-button') {
            $("#torrent-quality-list").slideUp(200);
        }
        //Hide torrent list when clicked outside list
        if ($(e.target).attr("id")!='torrent-list') {
            $("#torrent-list").removeClass("show");
        }
        //Check if torrentlist clicked on button or prodiver logo and call prodiver results function
        var quickEleFound;
        if ($(e.target).hasClass("dl_button") && $(e.target).hasClass("quick")) {
            quickEleFound=$(e.target);
        } else if($(e.target).parent().hasClass("dl_button") && $(e.target).parent().hasClass("quick")){
            quickEleFound=$(e.target).parent();
        }
        if (quickEleFound !=null) {
            if ($(quickEleFound).hasClass("tgx")){
                parseTGx(quickEleFound);
            } else if ($(quickEleFound).hasClass("1337x")){
                parse1337x(quickEleFound);
            } else if ($(quickEleFound).hasClass("eztv")){
                parseEZTV(quickEleFound);
            } else if ($(quickEleFound).hasClass("thepiratebay")){
                parseThePirateBay(quickEleFound);
            } else if ($(quickEleFound).hasClass("torrentdownloads")){
                parseTorrentDownloads(quickEleFound);
            } else if ($(quickEleFound).hasClass("torlock")){
                parseTorlock(quickEleFound);
            }
        }
    });
});

function update_dl_links(update_html_only){
    $(".dl_links").remove();
    $("#to-watch .secondary-link").each(function(){
        var episode = $(this).prev().children("a").html();
        if (episode.match(/^(a-Z)*S[0-9]+E[0-9]+/)){
            var name = $(this).text().trim();

            if (name.indexOf("(") >= 0){
                name = name.substring(0, name.indexOf("(") - 1);
            }
            var base_url = torrentProvider().url;
            var sufix = torrentProvider().sufix;
            var url = encodeURIComponent(name + " " + episode);
            url = url.replace(/%26amp%3B/g, "%20").replace(/\./g, "%20").replace(/'/g, "");//.replace(/[%20]{5,}/g, ' ')
            var target = $(this).parent().parent().children(".nav");
            var style = "font-size: 12px; position: absolute; font-weight: 700; font-family: ProximaNova;";
            var dl_div = "<div class='dl_links' style='float: left; margin-top: -4px;'>";
            dl_div += " <a class='dl_button' href='" + base_url + url + " 1080p" + sufix + "' style='margin-left: 30px; " + style + "' target='_blank'>1080p</a>";
            dl_div += " <a class='dl_button' href='" + base_url + url + sufix + "' style='margin-top: 12px; margin-left: 30px; " + style + "' target='_blank'>see all</a>";
            dl_div += " <a class='dl_button' href='" + base_url + url + " 720p" + sufix + "' style='margin-top: 0px; " + style + "' target='_blank'>720p</a>";
            dl_div += " <a class='dl_button' href='" + base_url + url + " 2160p" + sufix + "' style='margin-top: 12px; " + style + "' target='_blank'>4K</a>";
            dl_div += " <a class='dl_button quick tgx' provider-name='Torrent Galaxy' href='javascript:void(0);' style='margin-left: -25px;margin-top: 28px; " + style + "' ><img class='logo' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIiGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDQtMjFUMTQ6NTE6MjUrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDQtMjFUMTQ6NTE6MzYrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA0LTIxVDE0OjUxOjM2KzAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MzMyYjQ3Ny0yMGUwLWUwNDQtYjc0Mi04ZTIzMWQ2MWM1NzkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZDIyMDNiNi05YmU4LWFiNGQtOTVlZi04YjBjZjg0MWJiNGUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5MDczMDExZS1hNDgyLTc3NGQtYjZjNi1hYTllOTM0ZjQxNmMiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjkwNzMwMTFlLWE0ODItNzc0ZC1iNmM2LWFhOWU5MzRmNDE2YyIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0yMVQxNDo1MToyNSswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NTQ2MDYyNi0xNzBmLWVkNDUtODc3My02ZDA5YWE2ZDZlOGQiIHN0RXZ0OndoZW49IjIwMjMtMDQtMjFUMTQ6NTE6MzYrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDMzMmI0NzctMjBlMC1lMDQ0LWI3NDItOGUyMzFkNjFjNTc5IiBzdEV2dDp3aGVuPSIyMDIzLTA0LTIxVDE0OjUxOjM2KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg1NDYwNjI2LTE3MGYtZWQ0NS04NzczLTZkMDlhYTZkNmU4ZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MDczMDExZS1hNDgyLTc3NGQtYjZjNi1hYTllOTM0ZjQxNmMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5MDczMDExZS1hNDgyLTc3NGQtYjZjNi1hYTllOTM0ZjQxNmMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4l+Wj3AAACfklEQVQ4jaWQX0hTYRjG3y66DkG67yaIIoRM77rVZgiJ9IdmkFlgZF5IEWWiVprBxJtwGTpzrcI/mEKSWy3MM9rsyGikCz3bOcez3Jabm/uDBNHX93xa2HUXLy/v8/ye5zscYoxRSnnGx05ZfYwy6mhBXLZVrgZ8uxNqH6VW2wkbN3T44MAjRzsLcsYEpYKDZQnvQMNa+B0lY320HnsoNm7o8AX3b4GD0towJfw9p1anmsZTgYE9yXjPobTS0JYOXvZj44YOHxx45ETB95CNor6O4tBQZSo6c2vfWqSrKOM9Fs+597Ps+wMMGzd0+ILjPHKiIBrq36uNnJXDw+fefgu0UDJQbc8j7Cn9O7ihwwcHHjlRYHju1Kn9ZSw03dhpaHdpff7EVH7mMMtKPCyViI0bOnxw4JETBeGxmpeajRdMXe1W5FaKfL5Qu/nhIMtJR/gcFRs3dPjgwCMnCtRR85huK2faq1qnIl2nL4EbtOI905qRSjayUjHDxg0dPjjwyG19wet6i/rUxNQX1fmIv6tQCdyjJd9FWvKcLgxLVUXYuKHDBwceOVGgzLaZNMfJn5rtONNd1+4bH1soHnxAsWAnnw6xcUOHDw48cqLgq89SoEzUTeuD5Sw8VLlpuBvPpw37rnTEQSk+2LihwwcHHjlRsOCzUHCm1aTbK5g+VMHU51U/jDf17oizYYJPFBs3dPjgwCMnCvzzveT3P6EF1812w25iEf7CCv/LGH17Y6DDBwceue0CK5/HJMtWWpy8Yl4cvzS7PGzeWBoxp5dHan6JzW/o8MGBR25HgZXkT73k8T4iSeounXM1N805+bhuT27t5ibo8MH9yYiC/5nfmN+Y53yGr9QAAAAASUVORK5CYII=' width='16'><img class='loading' src='' width='19'></a>";
            dl_div += " <a class='dl_button quick 1337x' provider-name='1337x' href='javascript:void(0);' style='margin-left: -25px;margin-top: 52px; " + style + "' ><img class='logo' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB80lEQVQ4y8WTvWtUURDFz8y99+3bDQgRERQWEQQRROwsRRQEtYo2KW0s1NJFEMVCJFXsRSGQNBYiamX+AUEQXFHBwgjixyJhzcdu3r637905FjFC2FilcJqZYvgxM+eMkMR2wmOb8RfwffLQ+WTH+C2K0oBQ9lZmWAymqR6a1E6ku/dOwfkUqmnV+fJ4z2z75iZANcjeQL1z9cZhisIltStWFo8qix1fH7ssqscgApaFlYPs9cgEFuPnMuu1fAhPxYcaQrLfnJ8QxLea1s+RhAAoe8t3oPp8BOC8hwDzscifiOgkSWjaaKm6JYikEEWZ9T9U/dX7ELERgKwnVvnalHP+NEKy0ydpk843xXlYMaiG3z5Nx2LQgejoERnjRvUu5tmDJG1chwjUO1hvCcXXhVf56vKchABwCxWqrA+Q0PqYhrTRhAhi1gd//kJc6cLK4S4RGUdZLv7DB1zfI5YnbW3lQux2wDwDYoSGABeSg+p5taqq21sDhjkAqamV12K2mggAA9oQ+SHkmT9dFwnMAljYSkaI6llST4k6kESsqnsCvIfIcQXGoNoEcInkDQBxM4A84ETuAlCSIPmR5Auods04r04nLEaoastifAng2WYfOHfEOZeTbAMIZvZQRBbXJeaMme0j6bz36dDs6AZA/vs3/gavd/GjHse0AwAAAABJRU5ErkJggg==' width='16'><img class='loading' src='' width='19'></a>";
            dl_div += " <a class='dl_button quick eztv' provider-name='EZTV' href='javascript:void(0);' style='margin-left: -25px;margin-top: 76px; " + style + "' ><img class='logo' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABr0lEQVQoz5WSv0/CQBTHH1igGolhQxcNjgySsJLgQKKDRhI1cdPBzQH8C+yIkww6gAPgqolGTFxIJBE3DB3UySKLxYnyo0JLe30Op5VfDn6Wu3t5d9/3vu8siAj/gaELL5LoTYcXCQDs+O3x1fF8WQ+fffamzrmsfMQJiCi1jYV4807QEDFVVKcO6kf3yuVTN1VUERERg4nWbKxRetcRkQGA9GO3Ihm97/FVEg046D6a7fAiSW9O+GbGfkv6lhsiXlDTj10uxIa9tr4eKpJRkYw5l5Ue82V90cNcPWtcTgl7baYaAAAivtXIbKwRTLRolXeCliqqpXedBvGHtYyMiBZqa76sczmlIhIWYCvg4ELsYlKmpo1widJqG7vx5u2PM39hMQe3n5RfRQIAbpf1QzJo8DTi5Mv6SbYDAFlu6rsHk5WDOlWo1shWrGGqHV+3S4JG98zI+btd1mW/XRAJ+AEAZAV9HqbP1mEWPMzheXs7xL5Wyfz02OBfGsbnYSZZS+FFE0Sy3jOHwQtyBy8K6kbAAQBLfvvDs0YrHH0h4LVlcsre6rgpkskp2yG2N+cLe1UoltMvaXYAAAAASUVORK5CYII=' width='16'><img class='loading' src='' width='19'></a>";
            dl_div += " <a class='dl_button quick thepiratebay' provider-name='The Pirate Bay' href='javascript:void(0);' style='margin-left: -25px;margin-top: 100px; " + style + "' ><img class='logo' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wNC0yNFQxNDo1ODo1NiswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0yNFQxNDo1ODo1NiswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDQtMjRUMTQ6NTg6NTYrMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzM5ZWZkYzEtNmVjNS1iNzQzLWE3YzQtMWRiYjAyZWIxOTVmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NTM2YjcxN2MtZjAzMS1iZTRjLThlNjAtNDQyZTJjYjMyZmNhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWIzZmJhYjMtYTQ0ZS1iZTQ5LThkNTMtMmVlNDMyMjMxNGUzIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWIzZmJhYjMtYTQ0ZS1iZTQ5LThkNTMtMmVlNDMyMjMxNGUzIiBzdEV2dDp3aGVuPSIyMDIzLTA0LTI0VDE0OjU4OjU2KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzOWVmZGMxLTZlYzUtYjc0My1hN2M0LTFkYmIwMmViMTk1ZiIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0yNFQxNDo1ODo1NiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgE9pC8AAAHISURBVCiRhVJLiEFhFL5MVpLnRsojRZEtKcLMylbKa4GFnRQbZUmJlC0Ldl4RYqEsJErZkpKFjZKNkuzQmI87zcxtXt/i3u+e83/nnvOdn7h9wevv+DhDkK/lcmm1Wi0Wy8s3PD9Qq9UogkajQfwJu91OEbTbbTLBYDDodDqfz+dwOE8P0Gg0xN1u9w8CjUYzn8+9Xm+3212tVoFAACSVSiHlcrkoglarhahWq91ut8hJJBKlUimXy2ezWTKZRMrhcFAEhUKBbInNZn9tncVioSuy1vl8/kEAoDyTyQRRKBQYiQyq1ep3wWKxCIfD+XyerKTT6WCISCQCxzAGg4HL5YLDcWzjer0Sw+EQ3/F4PJvNlsvlXq9Xr9crlQp4qVRqNpvwo9PpYLZcLufxeIhYLEYWMJlMPp8PMgx6uVzIVg+Hw2QyKRaLiUQCXpvNZqLf7weDQbBqtRqNRgUCAfR46vV6mUwmFAqNRiN8w7JVKhWsuw+92+2wJqlUiijsg/2ZTCadTttsNhyCIBQKicViv98/Go3ugtPpxOPxIpHI8Xi8UYHIeDx2Op347XQ6fbcVsw8Gg/1+f/sFm80GV3O9Xn/u4V983PA3KcaiePyEycsAAAAASUVORK5CYII=' width='16'><img class='loading' src='' width='19'></a>";
            dl_div += " <a class='dl_button quick torrentdownloads' provider-name='TorrentDownloads' href='javascript:void(0);' style='margin-left: -25px;margin-top: 124px; " + style + "' ><img class='logo' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wNC0yNVQxNDowNjoyMSswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0yNVQxNDowNjoyMSswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDQtMjVUMTQ6MDY6MjErMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzkwZWJkMTUtZTE5OS1lMDQ2LWEyY2EtZjU4NzE3N2U3MGI2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MjkwZjhmMWEtNDc2My1kMDRkLTg0YzktZWMzMWUzZmY0MmYzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6N2E1ZGQzNzAtZjI4MS05ODQ5LWFlOTMtOTdiZDM2OGU2ZTAxIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6N2E1ZGQzNzAtZjI4MS05ODQ5LWFlOTMtOTdiZDM2OGU2ZTAxIiBzdEV2dDp3aGVuPSIyMDIzLTA0LTI1VDE0OjA2OjIxKzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmM5MGViZDE1LWUxOTktZTA0Ni1hMmNhLWY1ODcxNzdlNzBiNiIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0yNVQxNDowNjoyMSswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvgrT3kAAAD1SURBVCiRlZKxSgNBEIZlIc+RB7DKE6QJeY2IlYWQ7horIWkiFmIK24CPIeRdxML6YrK3szOH/+7cTS5q4Bw+lp/Zf5jZm3PFlv6FiyLj4aAnMDsSuegdMLvAHKTuC7MLkT3X4PFh/QPNd4E5FexjDWa3N8D7CqjWfJdUUEX+IjEOOSA26xfDbmF2PsYdiaEFENpqenWN8/XpWW9hTh3KIIYW/ClAlUeKZWDD54BofUcBqqYDiUE5yna2riip6XAy0uRuBSDaVkfRjIRddB9taKu3ZYFzNL/XZFoc8clnNS7nC8OSlAvk94LOAXP6Wz8/3nsC8zfNzGzvmfDabQAAAABJRU5ErkJggg==' width='16'><img class='loading' src='' width='19'></a>";
            dl_div += " <a class='dl_button quick torlock' provider-name='Torlock' href='javascript:void(0);' style='margin-left: -25px;margin-top: 148px; " + style + "' ><img class='logo' src=' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wNC0yNVQxNDoyNjo1MSswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDQtMjVUMTQ6Mjc6NDUrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDQtMjVUMTQ6Mjc6NDUrMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmUyYjQ5NTM2LTdkZDYtY2Y0YS04NWZlLWNiZWMyMWNhMDk2OCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlYjg1MTkxLWQ1YWUtMTI0MC04NDc0LWIyNjg0Y2Y4MzU4MiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmRlZjYyOGZkLTE2NTgtNjE0NC04OTIxLTZkNzc3ZGZjZGFiZiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGVmNjI4ZmQtMTY1OC02MTQ0LTg5MjEtNmQ3NzdkZmNkYWJmIiBzdEV2dDp3aGVuPSIyMDIzLTA0LTI1VDE0OjI2OjUxKzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUyYjQ5NTM2LTdkZDYtY2Y0YS04NWZlLWNiZWMyMWNhMDk2OCIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0yNVQxNDoyNzo0NSswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjWmq6sAAAFySURBVDgRpcE9S1UBGADg5z2dq7e0hqBZClpamsVBl2wI9AdINocNDYUIFdIeQUFTRPUDgoREWiIp1whuRkskTlH0QZQa1/N2/UhvmJPPE5lpLwp7FK7c1+YqZvFcUdMZNVPz1w1+atDpvwrChkCeJLpFUHSpr3w2+K1BaVcFYUMcQy/OEDVSVXT4UdZJa2oYwXkctakQWvIi1V3iAdkhqxdUfbb1YxYDOI57uKClxAhGMYxFAjEsV2/L1UEhhZuYxJQNPXiEL6WszhHjWLQlH5O9IoZkBJ5iyrYFTGCsRBOvrUsEURDFWxxGHfN2eqOlwE8MUCC06ZfVB+Gd1GunATQL3MEkThPIumxek9mDGXIGJzBh2xDGcaPEM+ISOUaeRTfxC6NYsiaM4haeYBmHcFmaK62LaXKa7GPfd7JBWomajNCygGE8xBGcsqn0r5e2FA5WS4oqtXmPr9KW0m7KLkMfX9m//Juav+ZwQJvITHvxB3aqdc3dELU1AAAAAElFTkSuQmCC' width='16'><img class='loading' src='' width='19'></a>";
            dl_div += "</div>";
            $(target).prepend(dl_div);
        }
    });
    if (update_html_only !== true){
        setTimeout(function(){
            if(last_watchlist_count!=$(".to-watch-list LI").length){
                last_watchlist_count=$(".to-watch-list LI").length;
                update_dl_links();
            }
        }, 3000);
    }
}

function parse1337xMagnetic(urlPage) {
    //console.log(urlPage);
    $.ajax({
            type:'GET',
            cache:false,
            url: urlPage,
            success:function(data)
            {
                var doc = document.createElement( 'html' );
                doc.innerHTML=data;
                jQuery(doc).find(".box-info a").each(function(){
                    if (jQuery(this).attr("href").startsWith("magnet:?xt=")){
                        window.open(jQuery(this).attr("href"), '_self');
                        return false;
                    }
                });
            }
        })
}

function parseTorlockMagnetic(urlPage,tname) {
    //console.log(urlPage);
    $.ajax({
            type:'GET',
            cache:false,
            url: "https://www.torlock.com" + urlPage,
            success:function(data)
            {
                var doc = document.createElement( 'html' );
                doc.innerHTML=data;
                jQuery(doc).find(".well .row div dl dt").each(function(){
                    if (jQuery(this).text().trim()=="INFOHASH"){
                        window.open(print_magnet(jQuery(this).parent().find("dd").text().trim(), tname), '_self');
                        return false;
                    }
                });
            }
        })
}

function parseTGx(element){
    var showname = $(element).closest("li").find(".episode-details .secondary-link").text().trim();
    showname = showname.replace(/%26amp%3B/g, "%20").replace(/\./g, "%20").replace(/'/g, "");//.replace(/[%20]{5,}/g, ' ');
    var showepisode = $(element).closest("li").find(".episode-details h2 a").text().trim();
    var quantity = getTorrentQualityCookie();
    var providerName = $(element).attr("provider-name");
    var ele = $(element);$(ele).find("img.logo").css("display","none");$(ele).find("img.loading").attr("src",gif_loading);
    if (quantity==="" || quantity==="all"){quantity=""} else { quantity = " " + quantity;}
    $("#torrent-list").removeClass("show");
    $.ajax({
        type:'GET',
        cache:false,
        url:'https://torrentgalaxy.to/torrents.php?search=' + showname + " " + showepisode + quantity,
        success:function(data)
        {
            var doc = document.createElement( 'html' );
            doc.innerHTML=data;
            var torrentslist_html="<table><tr><th colspan='3'>" + providerName + " - (" + jQuery(doc).find(".tgxtable .tgxtablerow").length + ") Torrent Results for [" + showname + " " + showepisode + quantity + "]</th></tr>";
            jQuery(doc).find(".tgxtable .tgxtablerow").each(function(){
                torrentslist_html+="<tr>";
                torrentslist_html+="<td><a href='"+jQuery(this).find(".tgxtablecell:nth-child(5) a:nth-child(2)").attr("href")+"'>"+jQuery(this).find(".tgxtablecell:nth-child(4)").text().trim()+"</a></td>";
                torrentslist_html+="<td>"+jQuery(this).find(".tgxtablecell:nth-child(8)").text()+"</td>";
                torrentslist_html+="<td>"+jQuery(this).find(".tgxtablecell:nth-child(11)").text()+"</td>";
                torrentslist_html+="</tr>";
            });
            $("#torrent-list").css({left:$(ele).position().left,top:$(ele).parent().parent().parent().find(".image-crop").offset().top}).html(torrentslist_html).addClass("show");
            $(ele).find("img.logo").css("display","unset");$(ele).find("img.loading").attr("src","");
        }
    })
}

function parse1337x(element){
    var showname=$(element).closest("li").find(".episode-details .secondary-link").text().trim();
    showname = showname.replace(/%26amp%3B/g, "%20").replace(/\./g, "%20").replace(/'/g, "");//.replace(/[%20]{5,}/g, ' ');
    var showepisode=$(element).closest("li").find(".episode-details h2 a").text().trim();
    var quantity=getTorrentQualityCookie();
    var providerName = $(element).attr("provider-name");
    if (quantity==="" || quantity==="all"){quantity=""} else { quantity = " " + quantity;}
    //console.log(showname+" "+showepisode);
    $("#torrent-list").removeClass("show");
    var ele=$(element);
    $(ele).find("img.logo").css("display","none");$(ele).find("img.loading").attr("src",gif_loading);
    $.ajax({
        type:'GET',
        cache:false,
        url:'https://1337x.to/search/'+ encodeURIComponent(showname + " " + showepisode + quantity) +'/1/',
        success:function(data)
        {
            var doc = document.createElement( 'html' );
            doc.innerHTML=data;
            var torrentslist_html="<table><tr><th colspan='3'>" + providerName + " - (" + jQuery(doc).find(".table-list tbody tr").length + ") Torrent Results for [" + showname + " " + showepisode + quantity + "]</th></tr>";
            jQuery(doc).find(".table-list tbody tr").each(function(){
                jQuery(this).find(".size .seeds").text("");
                torrentslist_html+="<tr>";
                torrentslist_html+="<td><a class='1337xStep2' href='javascript:void(0);' data-url='https://1337x.to"+jQuery(this).find(".name a:nth-child(2)").attr("href")+"'>"+jQuery(this).find(".name a:nth-child(2)").text().trim()+"</a></td>";
                torrentslist_html+="<td>"+jQuery(this).find(".size").text()+"</td>";
                torrentslist_html+="<td>["+jQuery(this).find(".seeds").text()+"/"+jQuery(this).find(".leeches").text()+"]</td>";
                torrentslist_html+="</tr>";
            });
            $("#torrent-list").css({left:$(ele).position().left,top:$(ele).parent().parent().parent().find(".image-crop").offset().top}).html(torrentslist_html).addClass("show");
            $(ele).find("img.logo").css("display","unset");$(ele).find("img.loading").attr("src","");
            $(".1337xStep2").on("click", function(){
                parse1337xMagnetic($(this).attr("data-url"));
            });
        }
    })
}

function parseEZTV(element){
    var showname=$(element).closest("li").find(".episode-details .secondary-link").text().trim();
    var showepisode=$(element).closest("li").find(".episode-details h2 a").text().trim();
    var quantity=getTorrentQualityCookie();
    var providerName = $(element).attr("provider-name");
    if (quantity==="" || quantity==="all"){quantity=""} else { quantity = " " + quantity;}
    $("#torrent-list").removeClass("show");
    var ele=$(element);
    $(ele).find("img.logo").css("display","none");
    $(ele).find("img.loading").attr("src",gif_loading);
    $.ajax({
        type:'GET',
        cache:false,
        url:'https://eztv.re/search/'+ encodeURIComponent(showname + " " + showepisode + quantity),
        success:function(data)
        {
            var doc = document.createElement( 'html' );
            doc.innerHTML=data;
            var torrentslist_html="<table><tr><th colspan='3'>"+providerName + " - (" + jQuery(doc).find("table.forum_header_border tbody tr.forum_header_border").length + ") Torrent Results for [" + showname + " " + showepisode + quantity + "]</th></tr>";
            jQuery(doc).find("table.forum_header_border tbody tr.forum_header_border").each(function(){
                torrentslist_html+="<tr>";
                torrentslist_html+="<td><a href='"+jQuery(this).find("a.magnet").attr("href")+"'>"+jQuery(this).find("a.epinfo").text().trim()+"</a></td>";
                torrentslist_html+="<td>"+jQuery(this).find("td.forum_thread_post:nth-child(4)").text()+"</td>";
                torrentslist_html+="<td>["+jQuery(this).find(".forum_thread_post_end").text()+"]</td>";
                torrentslist_html+="</tr>";
            });
            $("#torrent-list").css({left:$(ele).position().left,top:$(ele).parent().parent().parent().find(".image-crop").offset().top}).html(torrentslist_html).addClass("show");
            $(ele).find("img.logo").css("display","unset");
            $(ele).find("img.loading").attr("src","");
        }
    })
}

function parseThePirateBay(element){
    var showname=$(element).closest("li").find(".episode-details .secondary-link").text().trim();
    var showepisode=$(element).closest("li").find(".episode-details h2 a").text().trim();
    var quantity=getTorrentQualityCookie();
    var providerName = $(element).attr("provider-name");
    if (quantity==="" || quantity==="all"){quantity=""} else { quantity = " " + quantity;}
    $("#torrent-list").removeClass("show");
    var ele=$(element);$(ele).find("img.logo").css("display","none");$(ele).find("img.loading").attr("src",gif_loading);
    $.ajax({
        dataType: "json",
        url:'https://apibay.org/q.php?q='+ showname + " " + showepisode + quantity+'&cat=0',
        success:function(data)
        {
            var torrentslist_html="<table><tr><th colspan='3'>"+providerName + " - (#results#) Torrent Results for [" + showname + " " + showepisode + quantity + "]</th></tr>";
            var counter=0;
            data.forEach(function(obj) {
                if (obj.name!="No results returned"){
                    counter+=1;
                    torrentslist_html+="<tr>";
                    torrentslist_html+="<td><a href='"+print_magnet(obj.info_hash, obj.name)+"'>"+obj.name+"</a></td>";
                    torrentslist_html+="<td>"+print_size(obj.size, 0)+"</td>";
                    torrentslist_html+="<td>["+obj.seeders+"/"+obj.leechers+"]</td>";
                    torrentslist_html+="</tr>";
                }
            });
            torrentslist_html=torrentslist_html.replaceAll("#results#",counter);
            $("#torrent-list").css({left:$(ele).position().left,top:$(ele).parent().parent().parent().find(".image-crop").offset().top}).html(torrentslist_html).addClass("show");
            $(ele).find("img.logo").css("display","unset");$(ele).find("img.loading").attr("src","");
        }
    })
}

function parseTorrentDownloads(element){
    var showname = $(element).closest("li").find(".episode-details .secondary-link").text().trim();
    var showepisode = $(element).closest("li").find(".episode-details h2 a").text().trim();
    var quantity = getTorrentQualityCookie();
    var providerName = $(element).attr("provider-name");
    var ele = $(element);$(ele).find("img.logo").css("display","none");$(ele).find("img.loading").attr("src",gif_loading);
    if (quantity==="" || quantity==="all"){quantity=""} else { quantity = " " + quantity;}
    $("#torrent-list").removeClass("show");
    $.ajax({
        type:'GET',
        cache:false,
        url:'https://www.torrentdownloads.pro/rss.xml?type=search&search=' + encodeURIComponent(showname + " " + showepisode + quantity),
        success:function(data)
        {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data,"text/xml");
            var x = xmlDoc.getElementsByTagName("item");
            var torrentslist_html = "<table><tbody><tr><th colspan='3'>" + providerName + " - (" + x.length + ") Torrent Results for [" + showname + " " + showepisode + quantity + "]</th></tr>";
            var i=0;
            for (i = 0; i < x.length; i++) {
                torrentslist_html+="<tr>";
                torrentslist_html+="<td><a href='"+print_magnet(x[i].getElementsByTagName('info_hash')[0].textContent, x[i].getElementsByTagName('title')[0].textContent)+"'>" + x[i].getElementsByTagName('title')[0].textContent + "</a></td>";
                torrentslist_html+="<td>"+print_size(x[i].getElementsByTagName('size')[0].textContent,0)+"</td>";
                torrentslist_html+="<td>["+x[i].getElementsByTagName('seeders')[0].textContent+"/"+x[i].getElementsByTagName('leechers')[0].textContent+"]</td>";
                torrentslist_html+="</tr>";
            }
            torrentslist_html+="</tbody></table>"
            $("#torrent-list").css({left:$(ele).position().left,top:$(ele).parent().parent().parent().find(".image-crop").offset().top}).html(torrentslist_html).addClass("show");
            $(ele).find("img.logo").css("display","unset");
            $(ele).find("img.loading").attr("src","");
        }
    })
}

function parseTorlock(element){
    var showname=$(element).closest("li").find(".episode-details .secondary-link").text().trim();
    var showepisode=$(element).closest("li").find(".episode-details h2 a").text().trim();
    var quantity=getTorrentQualityCookie();
    var providerName = $(element).attr("provider-name");
    if (quantity==="" || quantity==="all"){quantity=""} else { quantity = " " + quantity;}
    $("#torrent-list").removeClass("show");
    var ele=$(element);
    $(ele).find("img.logo").css("display","none");
    $(ele).find("img.loading").attr("src",gif_loading);
    $.ajax({
        type:'GET',
        cache:false,
        url:'https://www.torlock.com/television/torrents/'+ showname + " " + showepisode + quantity + ".html?sort=seeds",
        success:function(data)
        {
            var doc = document.createElement( 'html' );
            doc.innerHTML=data;
            var torrentslist_html="<table><tr><th colspan='3'>" + providerName + " - (" + jQuery(doc).find(".table-responsive table:nth-child(1) tbody tr").length + ") Torrent Results for [" + showname + " " + showepisode + quantity + "]</th></tr>";
            jQuery(doc).find(".table-responsive table:nth-child(1) tbody tr").each(function(){
                torrentslist_html+="<tr>";
                torrentslist_html+="<td><a class='TorlockStep2' href='javascript:void(0);' data-url='"+jQuery(this).find("td:nth-child(1) a").attr("href")+"'>"+jQuery(this).find("td:nth-child(1) a").text().trim()+"</a></td>";
                torrentslist_html+="<td>"+jQuery(this).find("td.ts").text()+"</td>";
                torrentslist_html+="<td>["+jQuery(this).find("td.tul").text()+"/"+jQuery(this).find("td.tdl").text()+"]</td>";
                torrentslist_html+="</tr>";
            });
            $("#torrent-list").css({left:$(ele).position().left,top:$(ele).parent().parent().parent().find(".image-crop").offset().top}).html(torrentslist_html).addClass("show");
            $(ele).find("img.logo").css("display","unset");$(ele).find("img.loading").attr("src","");
            $(".TorlockStep2").on("click", function(){
                parseTorlockMagnetic($(this).attr("data-url"),$(this).text().trim());
            });
        }
    })
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getTorrentProviderCookie(){
    return getCookie("torrent-provider");
}

function getTorrentQualityCookie(){
    return getCookie("torrent-quality");
}

function torrentProvider(){
    for (var i=0; i<providers.length; i++){
        if (providers[i].id == getTorrentProviderCookie()){
            return providers[i];
        }
    }
    return providers[0];
}

function print_magnet(ih, name) {
    return 'magnet:?xt=urn:btih:' + ih + '&dn=' + encodeURIComponent(name) + print_trackers();
}

function print_trackers() {
    let tr = '&tr=' + encodeURIComponent('udp://tracker.coppersurfer.tk:6969/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.openbittorrent.com:6969/announce');
    tr += '&tr=' + encodeURIComponent('udp://9.rarbg.to:2710/announce');
    tr += '&tr=' + encodeURIComponent('udp://9.rarbg.me:2780/announce');
    tr += '&tr=' + encodeURIComponent('udp://9.rarbg.to:2730/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.opentrackr.org:1337');
    tr += '&tr=' + encodeURIComponent('http://p4p.arenabg.com:1337/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.torrent.eu.org:451/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.tiny-vps.com:6969/announce');
    tr += '&tr=' + encodeURIComponent('udp://open.stealth.si:80/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.opentrackr.org:1337/announce');
    tr += '&tr=' + encodeURIComponent('udp://exodus.desync.com:6969/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.cyberia.is:6969/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.moeking.me:6969/announce');
    tr += '&tr=' + encodeURIComponent('udp://tracker.open-internet.nl:6969/announce');
    return tr;
}

function print_size(size, f) {
    let e = '';
    if (f) {
        e = '&nbsp;(' + size + ' Bytes)';
    }
    if (size >= 1125899906842624) return round_to_precision(size / 1125899906842624, 0.01) + '&nbsp;PiB' + e;
    if (size >= 1099511627776) return round_to_precision(size / 1099511627776, 0.01) + '&nbsp;TiB' + e;
    if (size >= 1073741824) return round_to_precision(size / 1073741824, 0.01) + '&nbsp;GiB' + e;
    if (size >= 1048576) return round_to_precision(size / 1048576, 0.01) + '&nbsp;MiB' + e;
    if (size >= 1024) return round_to_precision(size / 1024, 0.01) + '&nbsp;KiB' + e;
    return size + '&nbsp;B';
}

function round_to_precision(x, precision) {
    let y = +x + (precision === undefined ? 0.5 : precision / 2);
    let sz = y - (y % (precision === undefined ? 1 : +precision)) + '';
    if (sz.indexOf('.') == -1) return sz;
    else return sz.substring(0, sz.indexOf('.') + 3);
}

var gif_loading="data:image/gif;base64,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";