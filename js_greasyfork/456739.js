// ==UserScript==
// @name         Social Icons for Plex
// @namespace    http://thlayli.detrave.net
// @version      0.7.1
// @description  Display social media icons from Artist Biography web links
// @author       Nathan Blume <thlayli@detrave.net>
// @license      MIT
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @match        https://app.plex.tv/desktop/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456739/Social%20Icons%20for%20Plex.user.js
// @updateURL https://update.greasyfork.org/scripts/456739/Social%20Icons%20for%20Plex.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var default_icon = 'background: no-repeat url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 -35 448 512\' stroke=\'%23FFF\' fill=\'none\'%3E%3Cpath stroke-width=\'26\'%0Ad=\'M209,15a195,195 0 1,0 2,0z\'/%3E%3Cpath stroke-width=\'18\'%0Ad=\'m210,15v390m195-195H15M59,90a260,260 0 0,0 302,0 m0,240 a260,260 0 0,0-302,0M195,20a250,250 0 0,0 0,382 m30,0 a250,250 0 0,0 0-382\'/%3E%3C/svg%3E");';
    var lastfm_icon = 'background: no-repeat url("data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'iso-8859-1\'%3F%3E%3C!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --%3E%3C!DOCTYPE svg PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'%3E%3Csvg fill=\'%23FFFFFF\' version=\'1.1\' id=\'Capa_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' width=\'100px\' height=\'100px\' viewBox=\'0 0 280 280\' xml:space=\'preserve\'%3E%3Cg%3E%3Cpath d=\'M89,0H5C2.238,0,0,2.239,0,5v84c0,2.761,2.238,5,5,5h84c2.762,0,5-2.239,5-5V5C94,2.239,91.762,0,89,0z M67.611,68.875 c-15.605,0-21.019-7.036-23.904-15.786l-2.887-9.021c-2.164-6.585-4.689-11.727-12.629-11.727c-5.504,0-11.094,3.969-11.094,15.064 c0,8.659,4.42,14.073,10.643,14.073c7.037,0,11.729-5.232,11.729-5.232l2.887,7.848c0,0-4.873,4.78-15.066,4.78 c-12.627,0-19.664-7.396-19.664-21.108c0-14.251,7.037-22.642,20.297-22.642c11.998,0,18.043,4.33,21.83,16.057l2.978,9.02 c2.164,6.585,5.953,11.367,15.063,11.367c6.136,0,9.379-1.354,9.379-4.691c0-2.616-1.53-4.51-6.131-5.593l-6.138-1.442 c-7.483-1.804-10.463-5.684-10.463-11.817c0-9.833,7.939-12.9,16.058-12.9c9.203,0,14.795,3.338,15.517,11.457l-9.021,1.082 c-0.361-3.879-2.705-5.502-7.035-5.502c-3.972,0-6.403,1.804-6.403,4.871c0,2.706,1.17,4.33,5.141,5.232l5.773,1.263 c7.758,1.804,11.905,5.593,11.905,12.899C86.375,65.448,78.799,68.875,67.611,68.875z\'/%3E%3C/g%3E%3C/svg%3E");';
    var image_icon = 'background: no-repeat url("data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'utf-8\'%3F%3E%3Csvg version=\'1.1\' id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' viewBox=\'0 0 512 512\' style=\'enable-background:new 0 0 512 512;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M460,4.9H52C26,4.9,4.9,26,4.9,52V460c0,26,21.1,47.1,47.1,47.1H460c26,0,47.1-21.1,47.1-47.1V52 C507.1,26,486,4.9,460,4.9L460,4.9z M52,36.3H460c8.7,0,15.7,7,15.7,15.7v321.7H423l-55.6-116.1c-2.3-4.9-7-8.2-12.4-8.8 c-5.3-0.6-10.7,1.6-14,5.8l-35.9,45l-84.9-138.2c-3-4.9-8.5-7.7-14.1-7.5c-5.7,0.3-10.8,3.6-13.4,8.8l-103.4,211H36.3V52 C36.3,43.3,43.3,36.3,52,36.3z M124.4,373.6l84-171.5l81.7,133c2.7,4.4,7.3,7.1,12.4,7.5c5.2,0.3,10-1.9,13.2-5.9l34.2-42.9 l38.3,79.9L124.4,373.6L124.4,373.6z M460,475.7H52c-8.6,0-15.7-7-15.7-15.7v-54.9h439.5V460C475.7,468.7,468.7,475.7,460,475.7z M365.9,208.9c34.7,0,62.8-28.1,62.8-62.8c0-34.7-28.1-62.8-62.8-62.8c-34.7,0-62.8,28.1-62.8,62.8S331.2,208.9,365.9,208.9z M365.9,114.7c17.3,0,31.4,14.1,31.4,31.4s-14.1,31.4-31.4,31.4c-17.3,0-31.4-14.1-31.4-31.4C334.5,128.8,348.6,114.7,365.9,114.7z\' /%3E%3C/svg%3E%0A");';
    var facebook_icon = 'background: no-repeat url("data:image/svg+xml,%3Csvg aria-hidden=\'true\' focusable=\'false\' data-prefix=\'fab\' data-icon=\'facebook-square\' class=\'svg-inline--fa fa-facebook-square fa-w-14\' role=\'img\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'%3E%3Cpath fill=\'%23FFFFFF\' d=\'M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z\'%3E%3C/path%3E%3C/svg%3E");';
    var instagram_icon = 'background: no-repeat url("data:image/svg+xml,%3Csvg aria-hidden=\'true\' focusable=\'false\' data-prefix=\'fab\' data-icon=\'instagram-square\' class=\'svg-inline--fa fa-instagram-square fa-w-14\' role=\'img\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'%3E%3Cpath fill=\'%23FFFFFF\' d=\'M224,202.66A53.34,53.34,0,1,0,277.36,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.41-30.41c-21-8.29-71-6.43-94.3-6.43s-73.25-1.93-94.31,6.43a54,54,0,0,0-30.41,30.41c-8.28,21-6.43,71.05-6.43,94.33S91,329.26,99.32,350.33a54,54,0,0,0,30.41,30.41c21,8.29,71,6.43,94.31,6.43s73.24,1.93,94.3-6.43a54,54,0,0,0,30.41-30.41c8.35-21,6.43-71.05,6.43-94.33S357.1,182.74,348.75,161.67ZM224,338a82,82,0,1,1,82-82A81.9,81.9,0,0,1,224,338Zm85.38-148.3a19.14,19.14,0,1,1,19.13-19.14A19.1,19.1,0,0,1,309.42,189.74ZM400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32ZM382.88,322c-1.29,25.63-7.14,48.34-25.85,67s-41.4,24.63-67,25.85c-26.41,1.49-105.59,1.49-132,0-25.63-1.29-48.26-7.15-67-25.85s-24.63-41.42-25.85-67c-1.49-26.42-1.49-105.61,0-132,1.29-25.63,7.07-48.34,25.85-67s41.47-24.56,67-25.78c26.41-1.49,105.59-1.49,132,0,25.63,1.29,48.33,7.15,67,25.85s24.63,41.42,25.85,67.05C384.37,216.44,384.37,295.56,382.88,322Z\'%3E%3C/path%3E%3C/svg%3E");';
    var twitter_icon = 'background: no-repeat url("data:image/svg+xml,%3Csvg aria-hidden=\'true\' focusable=\'false\' data-prefix=\'fab\' data-icon=\'twitter-square\' class=\'svg-inline--fa fa-twitter-square fa-w-14\' role=\'img\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'%3E%3Cpath fill=\'%23FFFFFF\' d=\'M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z\'%3E%3C/path%3E%3C/svg%3E");';
    var bandcamp_icon = 'background: no-repeat url("data:image/svg+xml,%3Csvg id=\'Layer_1\' data-name=\'Layer 1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\' fill=\'%23FFFFFF\'%3E%3Cpath d=\'M274.06,242.45c-15.73,0-23.76,12.38-23.76,31,0,17.62,8.69,30.85,23.76,30.85,17,0,23.43-15.59,23.43-30.85C297.48,257.54,289.45,242.45,274.06,242.45Z\'/%3E%3Cpath d=\'M400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32ZM279.63,319.57c-11.47,0-23.76-2.87-29.33-14.4H250v12H232.28V196.4L167,317H26.87L92.29,196.17h140v.22l.12-.23H251v44.75h.33c5.08-8.47,15.73-13.73,25.23-13.73,26.71,0,39.66,21,39.66,46.63C316.18,297.37,304.71,319.57,279.63,319.57Zm85.28-15.24c10.81,0,18.35-7.47,20.15-20h18.68c-3.44,22.71-17,35.25-38.83,35.25-26.55,0-41.13-19.48-41.13-45.25,0-26.44,13.93-47.12,41.79-47.12,19.66,0,36.38,10.17,38.17,31.7H385.06c-1.47-10.68-9-16.45-19.33-16.45-9.67,0-23.27,5.26-23.27,31.87C342.46,288.9,348.69,304.33,364.91,304.33Z\' fill=\'%23FFFFFF\'/%3E%3C/svg%3E");';

    //var has_run = false;
    //var first_link = true;

    waitForKeyElements("[data-testid^=metadataSummary-summary]", main_func);
    waitForKeyElements("[class^=PosterCard-card]", img_func);
    waitForKeyElements("[data-testid^=metadata-title]", lastfm_func);

    function img_func(){

        var cover = $("[class^=MetadataSimplePosterCard-image]");
        if(cover.length)
            add_link(cover[0].firstChild.src.replace(/\/photo\/:\/transcode\?width=\d+&height=\d+&minSize=1&upscale=1&url=/,"").replace(/%2F/gi,"/").replace(/%3FX-Plex-Token[^&]+&/,"?"));

    }
    function lastfm_func(){

        var title = $("[data-testid^=metadata-title]");
        var subtitle = $("[data-testid^=metadata-subtitle]");
        var watchlist = $("[data-testid^=preplay-addToWatchlist]");
        if(!watchlist.length){
            if(title.length && title[0].textContent != '' && subtitle.length && subtitle[0].textContent != '')
                add_link("https://www.last.fm/music/"+title[0].textContent+"/"+subtitle[0].textContent);
            else if(title.length && title[0].textContent != '')
                add_link("https://www.last.fm/music/"+title[0].textContent);
        }
    }
    function main_func(){

        if(!$(".soc_link").length){

            var bio = $("[data-testid^=metadataSummary-summary]")[0]
            var links = bio.innerText.match(/(https?:\/\/[^\s|^<]+)/g)

            if(links){
                $.each(links, function(value){
                    add_link(value);
                });
            }

        }
    }

    function add_link(soc_url){

        var soc_icon = default_icon;

        switch(true){
            case soc_url.includes("X-Plex-Token"):
                soc_icon = image_icon
                break;
            case soc_url.includes("last.fm"):
                soc_icon = lastfm_icon
                break;
            case soc_url.includes("facebook"):
                soc_icon = facebook_icon
                break;
            case soc_url.includes("instagram"):
                soc_icon = instagram_icon
                break;
            case soc_url.includes("twitter"):
                soc_icon = twitter_icon
                break;
            case soc_url.includes("bandcamp"):
                soc_icon = bandcamp_icon
                break;
            default:
                break;

        }

        var action_bar = $("[data-testid^=preplay-addToPlaylist],[data-testid^=preplay-addToWatchlist]");
        var soc_link = document.createElement('a');
        soc_link.className = "soc_link";
        if(!$(".soc_link").length)
            soc_link.style = "display: block; margin-right: 0.7em; margin-left: auto; width: 2.6em; height: 2.6em; " + soc_icon;
        else
            soc_link.style = "display: block; margin-right: 0.7em; width: 2.6em; height: 2.6em; " + soc_icon;

        soc_link.href = soc_url;
        soc_link.target = "_blank";
        action_bar[0].parentNode.append(soc_link);
    }

})();