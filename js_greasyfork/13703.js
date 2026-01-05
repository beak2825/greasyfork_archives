// ==UserScript==
// @name         RARBG Direct Download, Magnet and Magnet HASH Buttons
// @namespace    http://rarbg.to/
// @version      0.2
// @description  Adds direct download, magnet and reduced to HASH magnet buttons to RARBG.to 
// @author       BearNecessities
// @match        https://rarbg.to/*
// @match        http://rarbg.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13703/RARBG%20Direct%20Download%2C%20Magnet%20and%20Magnet%20HASH%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/13703/RARBG%20Direct%20Download%2C%20Magnet%20and%20Magnet%20HASH%20Buttons.meta.js
// ==/UserScript==
var ddicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMDNjOGQwOC0wMTA2LWM2NDEtOTFmOC1mYzlhYjVkNTgxNjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTFBMTk0NzY3RTU1MTFFNThDN0RCQjI5NjgzNURENEEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTFBMTk0NzU3RTU1MTFFNThDN0RCQjI5NjgzNURENEEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YzdlZWFmNzItNjYxMy1lOTQ5LTkyMmMtOTAzNjhkNTNkOTM0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIwM2M4ZDA4LTAxMDYtYzY0MS05MWY4LWZjOWFiNWQ1ODE2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoxqsEYAAACsSURBVHjaYvz//z+D/YeE/wxEgIMCCxgZbV5FYyg+LLoETNu+jsHQxPLvxy+cJmKTY/n7HbcGbHJM/779ZADhE2obGGBsuA3Y5IyOOP5HBsh8bHKM+jstwZ6+4HYMbwgZ7LKCOOnv1x8MIKy73ginYpAcTB1Qw08GGNZaoo2hGCSGrIZRbaYyRjzcTLsDptVnqWAYwKjSL0tULMM1gJKGcqckUZrulj9nBAgwADwzj6/MR80AAAAAAElFTkSuQmCC'
var mgicon = 'data:image/png;base64,R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw=='
var mhicon = 'data:image/png;base64,R0lGODlhDAAMALMAAOXl5RKn7LW1tebm5hJu7EVFRePj47a2thKN7OTk5BKS7BJu7BKx7BKi7EZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw=='
var selectedLinks = $('a[href^="/torrent/"]').not("a[href*=#]");
$.each(selectedLinks, function() {
    id = $(this).attr('href').split('/')[2];
    if (window.location.href.indexOf("/torrent/") > -1) {
        target = $(this).html();
    } else {
        target = $(this).attr('title');
    }

    ddhref = "http://rarbg.to/download.php?id=" + id + "&f=" + target + "-[rarbg.com].torrent";
    ddlink = "<a onmouseover='return overlib(\"Direct download.\")' onmouseout='return nd();'  id='dd-" + id + "' href='" + ddhref + "'><img src='" + ddicon + "'/></a>";
    $(this).after(ddlink);
    if ($('#dd' + id).prev().children().is("img")) {
        $('#dd' + id).css({
            'margin-left': '-12px',
            'margin-top': '-12px'
        });
    } else {
        $('#dd' + id).css({
            'margin-left': '3px'
        });
    }
    $.ajax({
        url: $(this).attr('href'),
        storedData: id,
        success: function(data) {
            mghref = data.match(/href\=\"(magnet[\:\_\-\+\%\?\=\&\;\.0-9a-zA-Z]*)\"/)[1];
            mhhref = mghref.replace(/&.*$/, '');
            mglink = "<a onmouseover='return overlib(\"Magnet link.\")' onmouseout='return nd();'  id='mg-" + this.storedData + "' href='" + mghref + "'><img src='" + mgicon + "'/></a>";
            mhlink = "<a onmouseover='return overlib(\"Magnet hash.\")' onmouseout='return nd();'  id='mh-" + this.storedData + "' href='" + mhhref + "'><img src='" + mhicon + "'/></a>";
            $.event.trigger({
                type: "requestDone",
                id: this.storedData,
                linkData: [mglink,mhlink]
            });
        }
    });
});
$(document).on("requestDone", function(event) {
    $('#dd-' + event.id).after(event.linkData[0]);
    $('#mg-' + event.id).after(event.linkData[1]);
    if ($('#dd-' + event.id).prev().children().is("img")) {
        $('#dd-' + event.id).css({
            'margin-left': '-42px',
            'margin-top': '-12px'
        });
        
        $('#mg-' + event.id).css({
            'margin-left': '3px',
            'margin-top': '-12px'
        });
        
        $('#mh-' + event.id).css({
            'margin-left': '3px',
            'margin-top': '-12px'
        });
    } else {
        $('#dd-' + event.id).css({
            'margin-left': '3px'
        });
        $('#mg-' + event.id).css({
            'margin-left': '3px'
        });
        
        $('#mh-' + event.id).css({
            'margin-left': '3px'
        });
    }        
});