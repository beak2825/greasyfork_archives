// ==UserScript==
// @name        Save Instagram Images (Broken)
// @description This used to let you right-click Instagram images and "save as..."
// @version  1.1
// @grant    none
// @include https://www.instagram.com/p/*
// @include http://www.instagram.com/p/*
// @namespace https://greasyfork.org/users/13157
// @downloadURL https://update.greasyfork.org/scripts/404644/Save%20Instagram%20Images%20%28Broken%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404644/Save%20Instagram%20Images%20%28Broken%29.meta.js
// ==/UserScript==

// we're going to search for a facade element that blocks us from right-clicking on the image directly, by lying on top of it.
// The classnames are randomized, some elements have more then one, and it looks like they're all matched by /[A-Za-z0-9_]{5}/
// the html looks like this:
//
// <div class="?????" role="button" tabindex="0">                         <- we'll call this the image container or just the container
//   <div class="????? ?????">
//     <div class="?????" style="padding-bottom: 112.222%">
//       <img class="?????" alt="[image details]" srcset="?" src="?">     <- this is the image we want
//     </div>
//     <div class="?????"></div>                                          <- this is the facade; it sits on top of the image and blocks us from right-clicking it
//   </div>
// </div>

// yes, the XPath functions really are this ugly
function getElementsByXPath(path) {
    let elemIter = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE);

    let elem;
    let elems = [];
    while (true) {
        elem = elemIter.iterateNext()

        if (elem === null) {
            break;
        } else {
            elems.push(elem);
        }
    }

    return elems;
}

function disableFacade() {
    // first we need to find the image with this long-ass XPath
    let possibleImages = getElementsByXPath(
        "//main[@role='main']//article"
        + "//div[@role='button'][@tabindex='0']"       // this is the image container
        + "/div/div[@style]/img[@alt][@srcset][@src]"  // and this is the image
    );

    if (possibleImages.length !== 1) {
        console.error("Found " + possibleImages.length + " possible images!");
        console.error(possibleImages);
    }

    let image = possibleImages[0];
    let facade = image.parentElement.nextSibling;

    console.log('Hiding facade element:')
    console.log(facade)
    facade.style = 'display: none;';
}

// we have to wait for the html to load fully before we can change it
window.addEventListener('load', disableFacade, false);
