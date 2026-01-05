// ==UserScript==
// @name        Pixiv Image on top
// @namespace   shurikn.com
// @description place the image at the top of the screen when loading an illustration page
// @include     *://www.pixiv.net/member_illust*
// @version     1.4
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @require http://code.jquery.com/jquery-latest.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17573/Pixiv%20Image%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/17573/Pixiv%20Image%20on%20top.meta.js
// ==/UserScript==

var imageAnchor;
var observer;

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) 
{
    for(var mutation of mutationsList) 
    {
        if (mutation.type == 'attributes') 
        {
            if(mutation.attributeName="href")
            {
                scrollImageToTop();
            }
        }
    }
};

function InitializeScrollImage(elements)
{
  imageAnchor=elements;
  scrollImageToTop();
  var image=$(elements).find("div[role='presentation'] a");
  var config={attributes:true,childList:false,wubtree:true};
  observer = new MutationObserver(callback);
  observer.observe(image[0], config);
}

function scrollImageToTop()
{
  imageAnchor[0].scrollIntoView();
}

//class id of the "figure" node holding the image
waitForKeyElements ("._290uSJE", InitializeScrollImage);

