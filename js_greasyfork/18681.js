// ==UserScript==
// @name        Pixiv Image Preload
// @namespace   https://greasyfork.org/en/users/37676
// @description Preload pixiv images
// @match       *://*.pixiv.net/member_illust.php?*mode=manga*
// @match       *://*.pixiv.net/member_illust.php?*mode=medium*
// @match       *://*.pixiv.net/*/artworks/*
// @run-at      document-end
// @version     2.0.0
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/18681/Pixiv%20Image%20Preload.user.js
// @updateURL https://update.greasyfork.org/scripts/18681/Pixiv%20Image%20Preload.meta.js
// ==/UserScript==

var preloadMeta = document.querySelector('meta[name="preload-data"]');

if (preloadMeta)
{
	var preloadContent = preloadMeta.getAttribute('content');

    if (preloadContent)
    {
        var illustID = null;

        try
        {
            preloadContent = JSON.parse(preloadContent);
            illustID = Object.values(preloadContent.illust)[0].id;

        } catch(e) {

        }
		
        if (illustID)
        {
            fetch('https://www.pixiv.net/ajax/illust/'+illustID+'/pages?lang=en').then((response) => {
                return response.json();
            }).then((imagesObj) => {
                if (imagesObj.error == false && Array.isArray(imagesObj.body))
                {
                    var arrayImage = [];

                    for (const element of imagesObj.body)
                    {
                        if (element.urls.regular)
                        arrayImage.push(element.urls.regular);
                    }

                    if (arrayImage.length > 0)
                    loadImage(0, arrayImage);
                }

            }).catch(function(error) {
                console.log("error fetching json data");
                console.log(error);
            });
        }
    }
}

function loadImage(index, arrayImage)
{
	if (index < arrayImage.length)
	{
		var image = new Image();
		image.onload = function() {
			loadImage(index+1, arrayImage);
		};
		image.src = arrayImage[index];
	}
}
