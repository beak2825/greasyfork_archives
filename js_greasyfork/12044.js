// ==UserScript==
// @name         Local drupal images
// @namespace    http://regretless.com/
// @version      0.1.1
// @description  Fix local drupal image issue
// @author       Ying Zhang
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://local.parents.com:1235/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12044/Local%20drupal%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/12044/Local%20drupal%20images.meta.js
// ==/UserScript==
var didNotFindImagesToReplace = 0;

function fixImageSrc(url, replaceUrl) {
    var $totalImagesNeedFixing = $('img[src^="' + url + '"], img[data-src^="' + url + '"]');
    if($totalImagesNeedFixing.length) {
        $totalImagesNeedFixing.each(function() {
            var imageSrc = $(this).attr('src') || $(this).attr('data-src');
            if(imageSrc) {
                if(imageSrc.indexOf('/sites/parents') !== -1) {
                    var newImageSrc = imageSrc.replace(url, replaceUrl);
                    $(this).attr('data-src', newImageSrc).attr('src', newImageSrc).data('src', newImageSrc);
                  
                    console.log('%c replaced img src ' + imageSrc + ' with ' + newImageSrc + ' ', 'background: #222; color: #bada55');
                }
            }
        });
    } else {
        console.log('%c did not find images to replace ', 'background: #222; color: #bada55');
        didNotFindImagesToReplace++;
    }
    $('*').filter(function() {
        var backgroundImage = '';
        if (this.currentStyle) {
            backgroundImage = this.currentStyle['backgroundImage'];
        } else if (window.getComputedStyle) {
            backgroundImage = document.defaultView.getComputedStyle(this,null)
            .getPropertyValue('background-image');
        }
        if(backgroundImage !== 'none' && backgroundImage.indexOf('/sites/parents') !== -1 && backgroundImage.indexOf(replaceUrl) === -1) {
            var newBackgroundImage = backgroundImage.replace(url, replaceUrl);
            $(this).css('background-image', newBackgroundImage);
            console.log('%c replaced background-image ' + backgroundImage + ' with ' + newBackgroundImage + ' ', 'background: #222; color: #bada55');
        }
    });
}



var intervalID = window.setInterval(function() {
    
    
    fixImageSrc('http://9020-jy6dj02.ad.mdp.com:1235', 'http://www.parents.com');
    fixImageSrc('http://local.parents.com:1235', 'http://www.parents.com');
    

}, 1000);