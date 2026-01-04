// ==UserScript==
// @name         Torrent9 - Previewer
// @author       Silv3r
// @description  Adds a preview window for each torrent on the site's homepage and add a button to download directly.
// @version      1.0
// @include      https://*.torrent9.*/*
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/393151
// @downloadURL https://update.greasyfork.org/scripts/391833/Torrent9%20-%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/391833/Torrent9%20-%20Previewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery; // Just to remove all tampermonkey warning 😉 -- Only this one cannot be removed 😭

    var downloadButton = $('<a title="Download torrent" style="margin-left: 10px"><img /></a>');
    var downloadImg = $(downloadButton).find('img')
    .attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFw2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTI4VDIxOjE0OjQyKzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0zMFQxNToxNjoyMyswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNC0zMFQxNToxNjoyMyswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OWUxNTkyZDMtZTM2Mi0xNTRhLWFhMzAtYmNiOWZmNmY5MWQ5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmVmNzQyNWZhLTU1MTYtYjc0NC1hMmMyLTIyNmYzZjQ1ZDlhYyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmVmNzQyNWZhLTU1MTYtYjc0NC1hMmMyLTIyNmYzZjQ1ZDlhYyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWY3NDI1ZmEtNTUxNi1iNzQ0LWEyYzItMjI2ZjNmNDVkOWFjIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTI4VDIxOjE0OjQyKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjllMTU5MmQzLWUzNjItMTU0YS1hYTMwLWJjYjlmZjZmOTFkOSIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0zMFQxNToxNjoyMyswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqSpW/cAAAK+SURBVDiNbZLLaxV3FMc/v5nfzM3MfSR1ojHkcSOFplwQsxA3pRtTCkUw0C4Cuug2dOGjXQrZSLrOwug/EMwie5VAVtpS+iAUpa1eTGxeettJrnNnxps7c+f36+Ka4iWe1eGc8/2cB0dMTU19Ojs7e2dra2sEaNu2raMwYmPjBUopAAxhMHaqTKm3RKvVEoAcGhranp+fv2LOzMz84nneqUqlkiuVSs74+Mfu4uKia87fdEe3n7vFx7+5+0sr7pMTJffypcuu67pOuVzO1Wq147ZtX5Rra2t9c3NzTE9PE4YhKlN8d2+RiZ1NsB1QGsh4MjLI1fprpCUpFossLy8zOTnpSM/zIt/3jy0sLHBoEydhworh5yq0gU+G+MGBu0t3edc8z4tllmWdPQ0DrUFrRcEHfvwDtt8ABvzUoKfeEQkEwhAopciyDHlIKxQKKKWJohDZ7oH1F/BP54ikEjPpuPl8AVMaBEGAEAIphPgfkCWKNBJo0YBnmxBL0ECUoRXkKJF3XEy7AzBNE6m1xrIszu42+L1/kAIOSrdh829oOp22QZO27iGPh4PkjF/lvm2htUYmSaJP9J9k3fG4vf6Yip0xmnhQ3QMkoADF1xT5zNlg1zf5pnKO4/u7JEmC9H0f0Ax+MMw4Txk73we/NqG6A4buTKAExqBi5PQASyv/8tezP0FmBEGgZaPR0DsvtwE43zvMtQevuN7XhDcKpXNvP7ENx2K+X7G5gYJ2CG2o1+vINE01wCHkW6D82uHLyRGMqgXagI9a3Fvd5AZh1x8cHBxghGF3EOArmtRWX8Hno3BhmGC1xgWO1kVRpGUcx+6RDPAhe0RPG5AzKbP3vhLiOHalaZoHlmXl0zTtTgJjDx9hIAjQR8RSSqSUmRgYGPjCtu1bYRj2a62zLkjQAiDfm+sSCyHMYrG4n6bp1f8A/WEnvlBZ4dcAAAAASUVORK5CYII=')

    var mouseX, mouseY;
    var onLink = false;

    $( document ).ready(function() {
        $('.table-responsive tr').each(function(index, element) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: $(this).find('td:nth-child(1) a').attr('href'),
                onload: function(details) {
                    var tmpButton = downloadButton.clone();
                    var data = details.responseText;
                    var downloadLink = $(data).find('a[class~=download]')[0].href;

                    $(tmpButton).attr('href', downloadLink);
                    $(element).find('td:nth-child(1)').append(tmpButton);
                }
            });
        });

    });

    $( document ).ready(function() {
        CreateDiv();

        $('.table-responsive').each(function(index, section) {
            $(section).find('a').each(function(index2, item) {
                $( this )
                    .removeAttr('title')
                    .mouseenter(function(event) { ShowDiv(this.href); })
                    .mousemove(function() { CenterDiv() })
                    .mouseleave(function() { HideDiv() });
            });
        });
    }).mousemove(function(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    });

    function CreateDiv() {
        var containerDiv = $('<div id="containerDiv"></div>')
        .css('z-index', '1000')
        .css('padding', '10px')
        .css('position', 'absolute')
        .css('background-color', '#333')
        .css('max-height', '600px')
        .css('overflow', 'hidden')
        .css('color', '#eee')
        .css('border', '2px solid #eee')
        .css('display', 'none')
        .appendTo('body');

        var leftDiv = $('<div id="leftDiv"></div>')
        .css('float', 'left')
        .appendTo(containerDiv);

        var imgTag = $('<img />')
        .css('max-width', '250px')
        .css('border', '1px solid #eee')
        .appendTo(leftDiv);

        var rightDiv = $('<div id="rightDiv"></div>')
        .css('float', 'left')
        .css('max-width', '600px')
        .css('display', 'grid')
        .css('padding-left', '10px')
        .appendTo(containerDiv);
    }

    function ShowDiv(link) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            onload: function(details) {
                var data = details.responseText;
                var container = $('#containerDiv');
                var image_tag = $('#leftDiv img');
                var image_link = $(data).find('.movie-detail .movie-img img')[0].src;
                var span = $('<span></span>')
                .css('float', 'left')
                .css('clear', 'both')
                .css('margin', '5px 5px')
                .css('text-align', 'justify');

                // CLEANING STUFF (!SECURE AVOID BUG!)
                $('#leftDiv img').attr('src', null);
                $('#rightDiv').empty();

                // MOVIE IMAGE
                image_tag.on('load', function() {
                    if(onLink) { CenterDiv(); container.fadeIn('slow'); }
                });
                image_tag.attr('src', image_link);

                // TORRENT INFOS (SEED, LEECH, ...)
                $(data).find('.movie-information ul').each(function() {
                    $('#rightDiv').append(span.clone());

                    $(this).find('li').each(function() {
                        $('#rightDiv span:last-child').append($(this).html() + ' ');
                    });

                    $('<br />').appendTo('#rightDiv span:last-child');
                });

                // RELEASE NAME AND SUMMARY
                $(data).find('.movie-information p').each(function() {
                    if($(this).html()) {
                        $('#rightDiv').append(span.clone());
                        $('#rightDiv span:last-child').append($(this).html());
                        $('<br />').appendTo('#rightDiv span:last-child');
                    }
                });
            }
        });
    }

    function HideDiv() {
        $('#containerDiv').css('display', 'none');
        $('#leftDiv img').attr('src', null);
        $('#rightDiv').empty();
        onLink = false;
    }

    function CenterDiv() {
        $('#containerDiv')
            .css('left', mouseX + 40)
            .css('top', mouseY - ( $('#containerDiv').height() / 2 ));
        onLink = true;
    }
})();