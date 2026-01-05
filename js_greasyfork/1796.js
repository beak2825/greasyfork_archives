// ==UserScript==
// @name          YTRating
// @namespace     absolut-fair.com
// @description   Shows the rating of videos in the related videos
// @include       http://*youtube.com*
// @include       https://*youtube.com*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @version       1.1.3
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_info
// @grant         GM_setClipboard
// @grant         GM_addStyle
// @grant         GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/1796/YTRating.user.js
// @updateURL https://update.greasyfork.org/scripts/1796/YTRating.meta.js
// ==/UserScript==

$(document).ready(function () {
    window.setInterval(function() { loadrating(); },1000);
});

function loadrating(div,link)
{
    $("img").each(function() {
        if( $(this).attr("ytrating-preprocessed") ) return;

        var myhref = $(this).attr("src");
        if( typeof myhref == 'undefined') {
            //console.log(this);
        } else if( myhref.indexOf("ytimg.com") != -1) {
            if( !$(this).attr("alt")!="Thumbnail" && !$(this).attr("data-thumb") && !$(this).attr("aria-hidden")!="true" ) $(this).attr("ytrating-queue",1);
        }
        $(this).attr("ytrating-preprocessed", 1);
    });
    $('img[alt="Thumbnail"], img[data-thumb], img[aria-hidden="true"], img[ytrating-queue], img.yt-img-shadow').closest('a').each(function (i) {
        //console.log("ytrating "+i);
        var that=this;
        var that_parent = $(that).closest("div,li");
        var inda=i;
        var hrea = $(this).attr('href');
        if( typeof hrea == "undefined" || hrea == null || hrea == "" ) return;

        if(hrea.indexOf('?v=')==-1) {
            if($(this).closest('div[data-context-item-id]').length)	{
                hrea = "/watch?v="+($(this).closest('div[data-context-item-id]').attr("data-context-item-id"));
            }
            else return true;
        }
        hrea = hrea.replace("&amp;","&");
        hrea=hrea+"&";
        var vidid = hrea.between('?v=','&');
        /*
        if( $(this).attr('done') || $('.video_time',that_parent).attr('done') ) {
            return true;
        }
		else {
            $(this).attr('done','1');
            $('.video_time',that_parent).attr('done','1');
        }
		*/
        if( $("span.ytd-thumbnail-overlay-time-status-renderer > label", that_parent).length ) return true;

        var nowdate = Math.floor(Date.now() / 1000);
        var cachedvalue = GM_getValue("ytrating_cache_"+vidid,"nothing|0").split("|");
        //console.log("cache", vidid, cachedvalue);
        //$(that_parent).attr("data-debug","this is "+vidid);
        if( cachedvalue[1] < nowdate - 2*24*60*60 ) {
            //console.log("loadlive", vidid);
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.googleapis.com/youtube/v3/videos?id="+vidid+"&key=AIzaSyBUB918luaFnGAoT6x6-l4agPIb8RcgxN0&part=statistics&fields=items/statistics,items/snippet",
                onload: function(resp) {
                    var jsondata = jQuery.parseJSON(resp.responseText);
                    var items = jsondata.items;

                    let appendstr;
                    if(typeof items[0] !== 'undefined')
                    {
                        var stats = items[0].statistics;
                        var likes = parseInt(stats.likeCount);
                        var dislikes = parseInt(stats.dislikeCount);

                        var resul = nFormatter(likes)+"/"+nFormatter(dislikes);
                        var dr = (likes/(likes+dislikes))*100;
                        dr=Math.round(dr);

                        if((likes+dislikes)>80) {
                            if(dr > 70) appendstr="<label style='color:#82FA58;font-size:10px;'> "+resul+"</label>";
                            else if(dr > 40) appendstr="<label style='color:#C9C618;font-size:10px;'> "+resul+"</label>";
                            else appendstr="<label style='color:red;font-size:10px;'> "+resul+"</label>";
                        }
                        else {
                            if((likes+dislikes)==0)	appendstr="<label style='color:red; font-size:10px;'> OFF</label>";
                            else appendstr="<label style='color:#848484; font-size:10px;'> "+resul+"</label>";
                        }
                    }
                    else appendstr="<label style='color:red;font-size:10px;'> ERR</label>";
                    GM_setValue("ytrating_cache_"+vidid, appendstr+"|"+nowdate);
                    $('span.ytd-thumbnail-overlay-time-status-renderer', that_parent).attr("loadlive",1).append(appendstr);
                }
            });
        }
        else {
            //console.log("loadcache", that_parent, cachedvalue,  $('span.ytd-thumbnail-overlay-time-status-renderer', that_parent));
            $('span.ytd-thumbnail-overlay-time-status-renderer', that_parent).attr("loadcache",1).append(cachedvalue[0]);
        }
        //return false;
    });
    $('span.ytd-thumbnail-overlay-time-status-renderer').each(function() {
        if($("label", this).length > 1) $("label",this).not(':first').remove();
    });
}


String.prototype.between = function(prefix, suffix) {
    const s = this;
    var i = s.indexOf(prefix);
    if (i >= 0) {
        s = s.substring(i + prefix.length);
    }
    else {
        return '';
    }
    if (suffix) {
        i = s.indexOf(suffix);
        if (i >= 0) {
            s = s.substring(0, i);
        }
        else {
            return '';
        }
    }
    return s;
}

function nFormatter(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num;
}