// ==UserScript==
// @name         PTP Bookmark Icon
// @version      0.252
// @description  Makes cute little bookmark icons
// @author       SentientCrab
// @match        https://passthepopcorn.me/torrents.php*
// @exclude      https://passthepopcorn.me/torrents.php?id=*
// @match        https://passthepopcorn.me/collages.php?*
// @match        https://passthepopcorn.me/artist.php?id=*
// @match        https://passthepopcorn.me/user.php?id=*
// @match        https://passthepopcorn.me/top10.php*
// @match        https://passthepopcorn.me/
// @match        https://passthepopcorn.me/index.php
// @grant        none
// @namespace    https://greasyfork.org/users/49589
// @downloadURL https://update.greasyfork.org/scripts/20673/PTP%20Bookmark%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/20673/PTP%20Bookmark%20Icon.meta.js
// ==/UserScript==

//do a better job handling json, maybe split
//some of these things need document.url checks, text center is way too slippery.
//main page has two images
//Fix hacky code
//Figure out what page each segment modifies

var bookmarkImage="data:image/png;base64,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";

(function() {
    var changed=-1;
    var covers = document.getElementsByClassName("basic-movie-list__movie__cover-link");//list view
    for(var x=0; x<covers.length; x++){
        if(covers[x].parentElement.parentElement.innerHTML.indexOf("Remove bookmark")!=-1)
        {
            changed=1;
            covers[x].innerHTML="<img id=ovrlayImage src="+'"'+bookmarkImage+'"'+">"+covers[x].innerHTML;
        }
    }
    covers = document.getElementsByClassName("huge-movie-list__movie__cover");//list view
    for(var x=0; x<covers.length; x++){
        if(covers[x].parentElement.innerHTML.indexOf("Remove bookmark")!=-1)
        {
            changed=1;
            covers[x].innerHTML="<img id=ovrlayImage src="+'"'+bookmarkImage+'"'+">"+covers[x].innerHTML;
        }
    }
    covers = document.getElementsByClassName("cover-movie-list__movie js-movie-tooltip-triggerer");//cover view
    if(covers.length==0)
    {
        covers=document.getElementsByClassName("cover-movie-list__movie");//cover view
    }
    if(covers.length>0)
    {
        var scriptToUse;
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; ++i) {
            var check=scripts[i].innerHTML.indexOf("overViewJsonData");
            if(check==-1)
            {
                check=scripts[i].innerHTML.indexOf("PageData");
            }
            if(check!=-1)
            {
                //alert(scripts[i].innerHTML);
                scriptToUse = scripts[i];
                //alert("found");
                var bookmarkIndex=0;
                for(;;)
                {
                    bookmarkIndex=scriptToUse.innerHTML.indexOf("Bookmarked",bookmarkIndex);
                    //alert(bookmarkIndex);
                    if(bookmarkIndex!=-1)
                    {
                        changed=1;
                        var torrentIndex=scriptToUse.innerHTML.indexOf("torrents.php",bookmarkIndex);
                        var torrentIndex2=scriptToUse.innerHTML.indexOf("&amp",torrentIndex);
                        //torrentIndex2--;
                        var torrentURL=scriptToUse.innerHTML.substr(torrentIndex,torrentIndex2-torrentIndex);
                        for(var x=0; x<covers.length; x++){
                            var urlCheck=covers[x].innerHTML.indexOf(torrentURL);
                            if(urlCheck!=-1)
                            {
                                covers[x].innerHTML="<img id=ovrlayImage src="+'"'+bookmarkImage+'"'+">"+covers[x].innerHTML;
                            }
                        }
                        bookmarkIndex=torrentIndex2;
                        //alert("url="+torrentURL);
                    }
                    else
                    {
                        break;
                    }
                }
            }
        }
    }
    covers = document.getElementsByClassName("text--center");//front page
    if(covers.length>0)
    {
        var scriptToUse;
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; ++i) {
            var check=scripts[i].innerHTML.indexOf("overViewJsonData");
            if(check!=-1)
            {
                //alert(scripts[i].innerHTML);
                scriptToUse = scripts[i];
                //alert("found");
                var bookmarkIndex=0;
                for(;;)
                {
                    bookmarkIndex=scriptToUse.innerHTML.indexOf("Bookmarked",bookmarkIndex);
                    //alert(bookmarkIndex);
                    if(bookmarkIndex!=-1)
                    {
                        bookmarkIndex-=1000;
                        var torrentIndex=scriptToUse.innerHTML.indexOf("GroupId",bookmarkIndex);
                        torrentIndex+=10;
                        var torrentIndex2=scriptToUse.innerHTML.indexOf('"',torrentIndex);
                        torrentIndex2--;
                        var torrentURL=scriptToUse.innerHTML.substr(torrentIndex,torrentIndex2-torrentIndex);
                        torrentURL="torrents.php?id="+torrentURL;
                        //alert(torrentURL);
                        for(var x=0; x<covers.length; x++){
                            var urlCheck=covers[x].innerHTML.indexOf(torrentURL);
                             var urlCheck2=covers[x].innerHTML.indexOf("last5-movies__link js-movie-tooltip-triggerer");
                            if(urlCheck!=-1&&urlCheck2!=-1)
                            {
                                //alert("change");
                                changed=1;
                                covers[x].innerHTML="<img id=ovrlayImage src="+'"'+bookmarkImage+'"'+">"+covers[x].innerHTML;
                            }
                        }
                        bookmarkIndex+=1100;
                        //alert("url="+torrentURL);
                    }
                    else
                    {
                        break;
                    }
                }
            }
        }
    }
    covers = document.getElementsByClassName("small-cover-movie-list__movie js-movie-tooltip-triggerer");//small view
    if(covers.length>0)
    {
        var scriptToUse;
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; ++i) {
            //var check=scripts[i].innerHTML.indexOf("overViewJsonData");
            var check=scripts[i].innerHTML.indexOf("PageData");
            if(check!=-1)
            {
                //alert(scripts[i].innerHTML);
                scriptToUse = scripts[i];
                //alert("found");
                var bookmarkIndex=0;
                for(;;)
                {
                    bookmarkIndex=scriptToUse.innerHTML.indexOf("Bookmarked",bookmarkIndex);
                    //alert(bookmarkIndex);
                    if(bookmarkIndex!=-1)
                    {
                        var torrentIndex=scriptToUse.innerHTML.indexOf("torrents.php",bookmarkIndex);
                        var torrentIndex2=scriptToUse.innerHTML.indexOf("&amp",torrentIndex);
                        //torrentIndex2--;
                        var torrentURL=scriptToUse.innerHTML.substr(torrentIndex,torrentIndex2-torrentIndex);
                        //alert(torrentURL);
                        for(var x=0; x<covers.length; x++){
                            var urlCheck=covers[x].innerHTML.indexOf(torrentURL);
                            if(urlCheck!=-1)
                            {
                                changed=1;
                                covers[x].innerHTML="<img id=ovrlayImage src="+'"'+bookmarkImage+'"'+">"+covers[x].innerHTML;
                            }
                        }
                        bookmarkIndex=torrentIndex2;
                        //alert("url="+torrentURL);
                    }
                    else
                    {
                        break;
                    }
                }
            }
        }
    }
    if(changed!=-1)
    {
        const css = "#ovrlayImage {position:absolute;z-index:1;}";
        // Add style to <head>
        const styleTag = document.createElement('style');
        styleTag.innerHTML = css;
        document.head.appendChild(styleTag);
    }
})();