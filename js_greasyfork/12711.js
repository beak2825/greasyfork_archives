// ==UserScript==
// @name 	SwagTv script
// @description	this script will automatically fetch and go to the next video after the meter goes up. 
// @version 2.7.7
// @match	http://www.swagbucks.com/watch*
// @require      http://code.jquery.com/jquery-git.js
// @namespace swagtv
// @downloadURL https://update.greasyfork.org/scripts/12711/SwagTv%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/12711/SwagTv%20script.meta.js
// ==/UserScript==
//
// --------------------------------------------------------------------

if (window.location.href == "http://www.swagbucks.com/watch")
{
    var list = [];
    var windows = $("#mainNavCategoriesList").find("a");
    for (var i = 0; i < windows.length; i++)
    {
        list.push(windows[i].href);
    }
    var first = list.shift();
    localStorage['cats'] = JSON.stringify(list);
    list = JSON.parse(localStorage['cats']);
    console.log(first);
    console.log(list);
    window.location.href=first;
}

if (window.location.href.indexOf("playlists") > -1)
{
    var cards = initialCardLoad.cards;
    var playlists = [];
    for (var i = 0; i < cards.length; i++)
    {
        var url = "http://www.swagbucks.com"+cards[i].link;
        playlists.push(url);
    }
    var first = playlists.shift();
    localStorage['plays'] = JSON.stringify(playlists);
    console.log(first);
    console.log(JSON.parse(localStorage['plays']));
    window.location.href=first;
}

if (window.location.href.indexOf("video") > -1)
{
    if ($("#watchPlaylistText").text().indexOf("Just so you know, you'll only receive SB for watching it once a day.") > -1)
    {
        console.log(">-1");
        if (localStorage['plays'].length == 0){
            if (localStorage['cats'].length == 0){
                alert("No more videos");
            }
            else{
                var cats = JSON.parse(localStorage['cats']);
                var next = cats.shift();
                localStorage['cats'] = (cats.length == 0) ? null : JSON.stringify(cats);
                window.location.href=next;
            }
        }
        else{
            var playlists = JSON.parse(localStorage['plays']);
            var next = playlists.shift();
            localStorage['plays'] = (playlists.length == 0) ? "" : JSON.stringify(playlists);
            window.location.href=next;
        }
    }
    else
    {
        var oldText = $("#watchVideosEarn").text();
        found = false;
        setInterval(function() { 
            //check(oldText,found);
            if ($("#SBCredited").length>0)
                advance();
        },5000);
    }
}

$('#watchVideosEarn').change(function(){
    oldText = $("#watchVideosEarn").text();
    var playing = $('a.sbPlaylistVideo').has('div[class*="sbPlaylistVideoNowPlaying"]');
    var nextVid = playing.next().not(':has("div[class*=sbPlaylistVideoWatched]")');
    if (nextVid.length == 0){
        nextVid = $('a.sbPlaylistVideo:not(:has(div[class*=sbPlaylistVideoWatched])):first');
        if (nextVid.length == 0)
            alert("umm...");
        else
            nextVid.click();
    }
    else{
        nextVid.click();
    }
});

var watched = unsafeWindow.alreadyWatched;
unsafeWindow.completeVideo = function (stillPlaying) {
    var index = $("#sbPlaylistVideoContainer").attr("index");
    if (intervalKey) {
        return
    }
    if (!stillPlaying) {
        $("#sbPlaylistVideoStatus" + videos[index]["vrid"]).removeClass("sbPlaylistVideoNowPlaying");
        if (videos[index]["watched"]) {
            $("#sbPlaylistVideoStatus" + videos[index]["vrid"]).removeClass("noVideoStatus").addClass("sbPlaylistVideoWatched").text("WATCHED")
        } else {
            $("#sbPlaylistVideoStatus" + videos[index]["vrid"]).addClass("noVideoStatus")
        }
    }
    if (videos[index]["watched"] && !stillPlaying) {
        $("#sbPlaylistVideoStatus" + videos[index]["vrid"]).removeClass("sbPlaylistVideoNowPlaying").removeClass("noVideoStatus").addClass("sbPlaylistVideoWatched").text("WATCHED")
    }
    var nextIndex = findFirstUnwatchedVideo(-1, index);
    finishPlaylist(nextIndex == -1);
    if (nextIndex == -1) {
        if (alreadyWatched && $(".postCaptcha").children().length) {
            $(".postCaptcha").removeClass("hidden").addClass("visible")
        }
        if (!stillPlaying) {
            if (alreadyWatched) {
                $("#watchVideosEarn").html(watchVideo)
            }
            if ($("#sbPlaylistShowOtherPlaylists").children().length && !$("#sbPlaylistCaptchaEndPlaylist").children().length) {
                $("#sbPlaylistShowOtherPlaylists").removeClass("hidden").addClass("visible")
            }
            $("#sbPlaylistVideoStatus" + videos[index]["vrid"]).removeClass("sbPlaylistVideoNowPlaying").removeClass("noVideoStatus").addClass("sbPlaylistVideoWatched").text("WATCHED")
        }
    }
}
if (watched)
    advance();
previousVal = $('#watchVideosEarn').text();
var prev = false;
window.timer = null;
myRegExp = /.* (\d+) .*videos and earn .*/i;
numVids = parseInt(myRegExp.exec($('#watchVideosEarn').text())[1]);
if (numVids >= 20)
    advance();
function InputChangeListener()
{
    //if ($("#videoPlayerIframe").length > 0)
    //    $("#videoPlayerIframe").remove();
    var maxNumber = 10;
    var minNumber = 1;
    var wait = Math.floor((Math.random() * maxNumber) + minNumber)*1000;
    if($('#watchVideosEarn').text() != previousVal && $('#watchVideosEarn').text().indexOf("Watched") == -1)
    {
        prev = false;
        previousVal  = $('#watchVideosEarn').text();
        setTimeout(function() { $('#watchVideosEarn').change(); }, wait);
    }
    if ($('#watchVideosEarn').text().indexOf("Watched") > -1)
    {
        setTimeout(function() { advance(); }, wait);
    }
}

function forwardCheck()
{
    if ($('#watchVideosEarn').text().indexOf("Watched") > -1)
    {
        setTimeout(function() { advance(); }, wait);
    }
    else
        location.reload();
}

if (!window.timer)
    window.timer = setInterval(InputChangeListener, 500);
setInterval(forwardCheck, 600000);

function advance(){    
    console.log("Credited");
    if (localStorage['plays'].length == 0){
        console.log(localStorage['cats']);
        if (localStorage['cats'].length == 0){
            alert("No more videos");
        }
        else{
            var cats = JSON.parse(localStorage['cats']);
            var next = cats.shift();
            localStorage['cats'] = (cats.length == 0) ? null : JSON.stringify(cats);
            window.location.href=next;
        }
    }
    else{
        var playlists = JSON.parse(localStorage['plays']);
        var next = playlists.shift();
        localStorage['plays'] = (playlists.length == 0) ? "" : JSON.stringify(playlists);
        window.location.href=next;
    }
}

$("#sbWatchPlaylistDetailHeading").append($("<button></button>").text("Force Advance").click(function() { advance(); }));