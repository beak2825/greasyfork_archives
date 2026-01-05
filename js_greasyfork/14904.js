// ==UserScript==
// @name         matternorn
// @namespace    matterhorn
// @version      0.1
// @description  display download button on matterhorn
// @author       n0b0dy
// @match        http://mh-engage.ltcc.tuwien.ac.at/engage/ui/*
// @match        https://mh-engage.ltcc.tuwien.ac.at/engage/ui/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/14904/matternorn.user.js
// @updateURL https://update.greasyfork.org/scripts/14904/matternorn.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$.ajaxSetup({
        dataFilter: function (data, type) {
            if( type == "json"){
                var res = JSON.parse(data);
                if (res && res.hasOwnProperty("org")){
                    //console.log(res);
                    res.org.properties["engageui.link_download.enable"]="true";
                    //console.log("spoofed true");
                    return JSON.stringify(res);
                }
            }
            return data;
        }
});

$('#oc_download-button').click( function() {
    $.ajax(
        {
            url: Opencast.Watch.getDescriptionEpisodeURL(),
            data: "id=" + Opencast.Player.getMediaPackageId(),
            dataType: 'json',
            success: function(data)
            {
                //console.log("generating link list");
                
                var i,
                    tracks = data["search-results"] ? data["search-results"]["result"]["mediapackage"]["media"]["track"] : [],
                    video_files = [],
                    audio_files = [],
                    video_markup = "",
                    audio_markup = "";

                var buildLinks = function(media){
                    //console.log("entered buildLinks");
                    var myHTML = "",
                        media_href,
                        media_type,
                        media_resolution,
                        media_description,
                        j;

                    for( i = 0; i < media.length; i+=1 ){
                        //console.log("now parsing:");
                        //console.log(media[i]);
                                                    
                        media_href = media[i].url;
                        media_type = media[i].type;
                        media_type = (media_type === 'presenter/delivery') ? "Presenter " : "Presentation ";
                        media_resolution = media[i].video ? media[i].video.resolution : " ";
                        media_description = media_resolution;

                        var media_format = media_href.split(":");
                        myHTML += " <a href="+ media_href + ">" +  media_type + " - " + media_description  + " [ download type : <em>"+  media_format[0] +"</em> ] " + "</a><br>";
                    }

                    return myHTML;
                };

                // Separate Video and Audio files
                for( i = 0; i < tracks.length; i+=1 ){
                    tracks[i].video ? video_files.push(tracks[i]) : audio_files.push(tracks[i]);
                }

                video_markup = buildLinks(video_files);
                audio_markup = buildLinks(audio_files);

                $('#oc_client_downloads').empty();
                $('#oc_client_downloads').append("<span><b>Video Files</b></span><br>");
                $('#oc_client_downloads').append("<div id=\"oc_download_video\"></div>");
                (video_files.length > 0 && video_markup !== "") ?  $('div#oc_download_video').html(video_markup) : $('div#oc_download_video').html("No video files available for download.");

                $('#oc_client_downloads').append("<br><span><b>Audio Files</b></span><br>");
                $('#oc_client_downloads').append("<div id=\"oc_download_audio\"></div>");
                (audio_files.length > 0 && audio_markup !== "") ? $('div#oc_download_audio').html(audio_markup) : $('div#oc_download_audio').html("No audio files available for download.");

                $('#oc_client_downloads').append("<br><span><b>Please Note :</b></span><br>");
                $('#oc_client_downloads').append("<span>Some files may not download automatically, you may need to \"Right click\" the download link and select \"Save Link As..\" to save the file. In some browsers where the \"Right click\" is disabled - e.g. Firefox 8 on Mac OS X - you may have to press ALT and then click the download link to prompt a download.</span><br>");

            }
        });
});