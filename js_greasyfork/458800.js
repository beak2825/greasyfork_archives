// ==UserScript==
// @name         Steam Workshop simple Gallery
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  After opening an image in the lightbox/popup use your right arrow to slide to the next image
// @author       Trommelpeter05
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458800/Steam%20Workshop%20simple%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/458800/Steam%20Workshop%20simple%20Gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findUrls( text )
    {
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while( (matchArray = regexToken.exec( source )) !== null )
        {
            var token = matchArray[0];
            urlArray.push( token );
        }

        return urlArray;
    }

    function getNextImage(element) {
        var imageholder = element.closest('.highlight_player_item.highlight_screenshot').next().find('.workshopItemPreviewImageEnlargeable').parent().attr('href');
        imageholder = findUrls(imageholder)[0]

        return imageholder;
    }

    jQuery('.workshopItemPreviewImageEnlargeable').on("click",function(e) {

        var $this = jQuery(this);
        setTimeout(function() {
            if(jQuery('#previewImageEnlarged').is(':visible')) {

                jQuery(document).keydown(function(e) {
                    if (e.keyCode == 39)
                        var image = getNextImage($this);
                    if(typeof image == 'undefined') {
                        image = jQuery('.highlight_player_item.highlight_screenshot:first-of-type').find('.workshopItemPreviewImageEnlargeable').parent().attr('href');
                        image = findUrls(image)[0]
                        $this = jQuery('.highlight_player_item.highlight_screenshot:first-of-type').find('.workshopItemPreviewImageEnlargeable');
                    }
                    else {
                        $this = $this.closest('.highlight_player_item.highlight_screenshot').next().find('.workshopItemPreviewImageEnlargeable')
                    }

                    jQuery('#enlargedImage').attr('src',image)
                });
            }

        }, 500)

    });
})();