// ==UserScript==
// @name        Goodreads Half-Stars and Rating Tags
// @namespace   http://www.goodreads.com/*
// @description Converts selected tags on GoodReads into rating images (such as tags with half-star ratings)
// @include     /^https?://.*\.goodreads\.com/.*$/
// @grant       none
// @version     1.0.4
// @downloadURL https://update.greasyfork.org/scripts/4709/Goodreads%20Half-Stars%20and%20Rating%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/4709/Goodreads%20Half-Stars%20and%20Rating%20Tags.meta.js
// ==/UserScript==

// TODO : Consider narrowing scope of anchor node scan and use query selector instead

// Some examples of the tag naming format that will get matched :
// (The range is 0-0 to 5-0)
//
//   clouds-3-0
//   stars-0-5
//   rating-clouds-3-0
//   rating-stars-0-5
//   example-clouds-2-0
//   example-stars-0-5
//   another-example-clouds-3-0
//   another-example-stars-0-5



//
// Load tag image data into keyed hash
//
function initImageData()
{
    /*
    // GoodReads style stars
    tagImages['stars-on'  ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAUVBMVEUAAAD7m1iCXkfwl1WebUqlcEpVRETIgE64d0v+nlj8nFa2d0v4mVOwdUzkj1CZaEa/ekzTh1CucUmAYEhlVEb8m1X6mVPejFDNg03xllP0llFfj+n0AAAAFXRSTlMAQFCPjzAP7+/f39/Pz49/b0A/IDrp95/4AAAAbElEQVQI11XMWQ6AIAxF0YqA82wf6P4XKlAw4X7QnISWJGOoqm1rD0NFw2yq78xl4WhCI/MY56FocfznlptIe4jgNcVUh1SnSDrFJ+VW4HmAtXiGmyaHOfN6vbZW+/cS771KZ/tdvFmZdgvPB4/9Bmn/QwdxAAAAAElFTkSuQmCC" };
    tagImages['stars-half']  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAilBMVEUAAADc3Nz7m1jslFTIyMjc3Nz9nVfY2Ni9vb2ebUq1tbWEX0fIyMjAwMClcEqnp6dVRETIgE64d0vExMS2d0vZ2dnDw8P4mVOwdUzT09O7u7uZaEbHx8e/ekyysrLTh1CucUmsrKy0tLSAYEjb29v8m1X6mVPZ2dnY2NjR0dHMzMzzllLejFDNg00dOFS2AAAAJHRSTlMAQECP79/fj4+PT08/MDAPD+/v39/Pz8/Pj39/b29XQD86ICBFgkJ2AAAAe0lEQVQI11XM1w6DMAxAUbcFyobuyU7ssP7/90hkQMp9iHWk2MClCVidzrY912IqRWJ9l2JbqI46Twr3oItLeE/SJEz9swEIZmTT4IMpuiAiETkhcDU73q8jjoros/mF0/3Wq8fKbpyDPPMH1bKLa2RG6PzZv5xn9tXPAm2HCyy7k3wtAAAAAElFTkSuQmCC" };
    tagImages['stars-off' ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAZlBMVEUAAABRUVGnp6dPT09dXV3Z2dm+vr7c3NympqaWlpagoKCDg4PIyMioqKiSkpJ/f39paWl8fHxxcXGWlpZQUFBMTEze3t7Q0NDd3d3IyMjY2NjW1taWlpbDw8O4uLi1tbWkpKSVlZWzvvflAAAAFnRSTlMAP08wD+/v39/fz8+Pj4+Pj39vPyBXxSPejwAAAHhJREFUCNdVzEcChCAMQNEI2HuZSQLY7n9JxeiCv4C8RQKS1hA1DLHLMqLe92ihZ+5BSkIFYvEMP6hP74/V2vXw/qwTgJYZHZFD5hZCKqX/HaUKpNkG2xneOgzG7nOFlOeE1ctlc40xjdsW8ZSp52w2iUcjvxnv5wL9swc1kspz8wAAAABJRU5ErkJggg==" };
    */

    // Readinglist style stars
    tagImages['stars-on'  ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAArlBMVEUAAACZhA2SfAeTfQiWgAqjjhSbhhCZhA6VfwmTfQiSfAe/qiG8pBq+qCG1oyOXgQyqlx2ZhA2ahQ6Ygg2SfAeSfAfFrh/DsS+ahg+1pCuznhuwmxqXggyahQ+ahQ+bhhCahQ+WgAuSfAeSfAeSfAeSfAeSfAeSfAf93SD92xz83yv82yDz0x741Rf95Dnawyvz0Bbw3UTo1D3izz333TPgyC/y1ijjySb21yH62BsxGQzCAAAAKHRSTlMA9Rr9+PDNpoqECvr49/Pw7+axmjkW/vvz8vLx7tXFwruRXEdELyACk7+DAAAAAJFJREFUCNdtj1cOgzAQRE0zjuktvVdXID25/8ViAkRBYn92nrR62gH9Yw86eDIWHd764+M/LwsHtVnX9dQUz+iggsK5pmmWWwrXUgECgMzLQ5RScpaPguo+i5yXfFPC/BX+CnA8pJSSadIa1wUhnHu/l4z8NvPYHTa4D68msq2zgWtOJjADIA3CXdNlU++4EnwAIugKeWWWGPcAAAAASUVORK5CYII=" };
    tagImages['stars-half']  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAtFBMVEUAAACwsLCwsLCwsLCWgAqZhA2wsLCwsLCSfAeTfAe1oyewsLCwsLCwsLCwsLCZgw2wsLCVfwmwsLCwsLCSfAewsLDFrh+/qiK9pBiwsLCwmxqplhykjxSXggyYgw2wsLCbhhCahQ+ahQ+ahQ+ZhA6wsLCWgAuwsLCSfAeSfAeSfAewsLCwsLCwsLCSfAf93B754DXy0h/10hbo1D3izz3bxC3YwSry1ij21yH62Bv41hjyzxbr3p9MAAAAL3RSTlMA5pMa+PWjgxr98tTHvLaeiYlFJBYG/vr6+PHv7+7n4M/Fu7Spm5GMXEQ7OC8NCqlfTewAAACKSURBVAjXbcxVDsMwEEXRZzt2HGywzMyBcrv/fVVWHKmRej9m5vwM/rc0m7bcBrf2JP717L4J6ltKuTeK2DkyxgCMOOfD7gfUIYR4QGhcHkVZAkBA1EzGnef7BaTCP0F1XrSzDBAUuvlNmZq1rTzvU0Se5m5wNcKVy3pp5ZY9TYAD8SPtdbWFevAFqBcJHezWuyEAAAAASUVORK5CYII=" };
    tagImages['stars-off' ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAVFBMVEUAAACwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLDhRk/qAAAAHHRSTlMA5hqTo4yIg/rvxry2m0MlDQbd1K2nV0g5Fr8vhYZdwQAAAHRJREFUCNdtjkkShCAMRT8EUBAUnO2+/z07QGtplX+RvLfIgPeE5umte+iqxuHuftPmZCnlbjFMXwZWwXEaoImhA4y9Jo3I9Rh1saR8LBCXcnwh/DOvuVJzPZPiTOi7agy9NcHJNlUn9TmAXfitetC1q7zgB1YDA4NW818dAAAAAElFTkSuQmCC" };


    // Readinglist style clouds
    tagImages['clouds-on'  ] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAVHYCaOZEkOjDgMprq+AyKZBLwWjmnDy7jbhonrt2JgRBDF4aB4NBKFBIQiHFUul8pkYsFYZq0wKTIWkcuj89m0FmfabXFcFAIAOw==" };
    tagImages['clouds-half'] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAVEYCaOZEkOjCgIpji8bxCsJgEPQM6WN57Po94r99sJfcQdRHE4KB4NIgA4qlwulclq2+qWIqTdbgQmq7plryidGavZoxAAOw==" };
    tagImages['clouds-off' ] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAU0YCaOZEkKgoiaahCg7loKQG0D6Xzb7wjvvBwNeBMKAkRAz4dqOlnQ2Ukl9VFZueh1q82SQgA7" };
}


//
// Installs a mutation observer callback for nodes matching the given css selector
//
function registerMutationObserver(selectorCriteria, monitorSubtree, callbackFunction)
{
    // Cross browser mutation observer support
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    // Find the requested DOM nodes
    var targetNodeList = document.querySelectorAll(selectorCriteria);


    // Make sure the required elements were found, otherwise don't install the observer
    if ((targetNodeList != null) && (MutationObserver != null)) {

        // Create an observer and callback
        var observer = new MutationObserver( callbackFunction );

        // Start observing the target element(s)
        //   Note : Repeated observe calls on the same target just replace the previous observe, so it's
        //          ok to re-observe the same target in the future without first disconnecting from it
        for(var i = 0; i < targetNodeList.length; ++i) {

            observer.observe(targetNodeList[i], {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: monitorSubtree
            });
        }
    }
}


//
// Monitors and converts dynamic content updates to tag shelfs (such as when a user edits tags via a pop-up)
// * Called on page load and by other dynamic content hooks (to capture new tag shelfs that get added after page load)
//
function installTagShelfUpdateHook()
{
    // Matches/watches the various types of tag shelfs (on the book list page, review edit page, book page, etc)
    registerMutationObserver('[id*=shelfList]', false,
        function(mutations) { convertTagsToImages(); }
    );
}


//
// Handles converting the in-page popup review editor (launched from book list pages)
//
function installPopupReviewHook()
{
    registerMutationObserver('[id=boxContents]', false,
        function(mutations) { convertTagsToImages(); installTagShelfUpdateHook(); }
    );
}


//
// Handles content updates generated by Infinite Scroll mode on book list pages
//
function installInfiniteScrollHook()
{
    // Subtree monitoring enabled in order to catch the text content changes in the infiniteStatus div
    registerMutationObserver('[id=infiniteStatus]', true,
        function(mutations) { convertTagsToImages(); installTagShelfUpdateHook(); }
    );
}

//
// Monitors for tags getting in-place renamed on the edit shelves page
//
function installEditShelfHook()
{
    registerMutationObserver('[class=displayShelfNameLnk]', false,
        function(mutations) {

            mutations.forEach( function(mutation) {

                // Only inspect nodes which have an 'inspected' flag to remove
                if (mutation.target.hasAttribute("data-tag-image-inspected") == true)
                {
                    // If a rename detection sub-tag was not found then it was probably removed by a rename event
                    // and this node needs to have it's 'inspected' flag cleared so it gets re-examined
                    if (mutation.target.querySelector('[class=tagRenameCanary]') == null) {
                            delete mutation.target.dataset.tagImageInspected;
                    }
                }
            } );

            convertTagsToImages();
        } ); // End observer callback function
}


//
// Attempt to match and support a variety of rating tag formats created by other users
//
// ---------------------------------------
// Some rating tag specimens from the wild
//
//   Whole star rating
//      four-stars
//      actual-rating-4-stars
//
//   Half star ratings
//      four-and-one-half
//      four-and-a-half-star
//      4-half-star
//      3-and-a-half-stars
//      four-ana-half-stars
//      actual-rating-4-half-star
//
function rewiteAlternateRatingFormats(tagName)
{
    // Ignore strings with the GoodReads format of 'N of N stars' in the formal (non-tag) rating area
    // (Narrowing scope of anchor node search would remove need for this)
    var ignoreGoodReadsRatingsAreaMatch = /.*\d of \d stars.*/i.exec(tagName);
    if (ignoreGoodReadsRatingsAreaMatch == null)
    {
        // Convert string numerics to digits
        tagName = tagName.replace(/five/gi,  "5");
        tagName = tagName.replace(/four/gi,  "4");
        tagName = tagName.replace(/three/gi, "3");
        tagName = tagName.replace(/two/gi,   "2");
        tagName = tagName.replace(/one/gi,   "1");
        tagName = tagName.replace(/zero/gi,  "0");

        // Remove leading and..."one"/"1"... sometimes found in front of "half" (complicates regexes below)
        tagName = tagName.replace(/and( |-)*1( |-)*half/gi,  "half");

        // Attempt to match half-star first, then whole star (whole star format is looser match, so must occur after half star)
        //
        // match : [0] = full match text, [1] = optional label, [2] = first numeric component, [3] = 'half'(half star regex) or 'star'(whole star regex)
        var tagMatchHalf  = /(.*)(\d).*(half).*/i.exec(tagName);
        var tagMatchWhole = /(.*)(\d).*(star).*/i.exec(tagName);

        // If a match was found then rewrite it to the desired format of : <label>-<stars>-<N-N>
        if (tagMatchHalf != null) {
            tagName = tagMatchHalf[1] + '-stars-' + tagMatchHalf[2] + '-5';
        } else if (tagMatchWhole != null) {
            tagName = tagMatchWhole[1] + '-stars-' + tagMatchWhole[2] + '-0';
        }
    }

    return(tagName);
}


//
// Append an <img> tag with the given image data to an element
//
function appendImage(parentObj, imgData)
{
    var tagImg     = document.createElement('img');
        tagImg.src = imgData;
    parentObj.appendChild(tagImg);
}


//
// Append a <span> tag as a rating label (with a trailing space) to an element.
// The label won't be added if the text is blank or has the generic name "rating"
//
function appendTagLabel(parentObj, labelText)
{
    if ((labelText != "") && (labelText != "rating"))
    {
        var tagSpan                   = document.createElement('span');

        tagSpan.innerHTML             = labelText;
        tagSpan.style.color           = "#555";
        tagSpan.style.backgroundColor = "#ddd";
        tagSpan.style.borderRadius    = "2px";
        tagSpan.style.padding         = "2px 5px 2px 5px";
        tagSpan.style.marginRight     = "5px";

        parentObj.appendChild(tagSpan);
    }
}


//
// Append an empty <span> tag to an element to help with detecting tag rename events
//
function appendRenameCanary(parentObj)
{
    var tagSpan           = document.createElement('span');
    tagSpan.style.display = "none";
    tagSpan.className     = "tagRenameCanary";

    parentObj.appendChild(tagSpan);
}


//
// Render a tag rating based on a type ("stars","clouds) and a numeric value in tag format ("4-0","1-5", etc)
//
function renderTagImages(parentObj, imgType, imgValue)
{
    var valMax = 5.0;
    var valOn  = parseFloat( imgValue.replace("-", ".") );
    var valOff = valMax - valOn;

    if ((imgType == "stars") || (imgType == "clouds"))
    {
        // Render whole "on" icons first
        while (valOn > 0.5) {
            appendImage(parentObj, tagImages[ imgType + '-on' ].imgData );
            valOn -= 1.0;
        }

        // Render half "on" icon if needed for 0.5 values
        if (valOn == 0.5) {
            appendImage(parentObj, tagImages[ imgType + '-half' ].imgData );
        }

        // Render the remaining slots as placeholders ("off")
        while (valOff >= 1) {
            appendImage(parentObj, tagImages[ imgType + '-off' ].imgData );
            valOff -= 1.0;
        }
    }
}


//
//  Find links with matching tag text and convert them to the paired images
//  (non-jquery version to avoid GoodReads breakage with jquery version conflict)
//
function convertTagsToImages()
{
    var objText;
    var elAnchor;
    var elLinks = document.getElementsByTagName( 'a' );

    // Walk through all the anchor tags on the page
    for ( var i = 0; i < elLinks.length; i++ ) {

        elAnchor = elLinks[ i ];

        // Only convert anchor tags which haven't already been inspected
        if (elAnchor.hasAttribute("data-tag-image-inspected") == false)
        {
            nodeText = elAnchor.text;

            // match[0] = full match text, [1] = optional label, [2] = "stars" or "clouds", [3] = "N1-N2" where (ideally) N1 is a digit 0-9 and N2 is 0 or 5
            var match = /([\w-]*?)-*(stars|clouds)-(\d-\d)/i.exec(nodeText);

            // No match? Rework the tag format if possible and try the match again
            if (match == null) {
                nodeText = rewiteAlternateRatingFormats(nodeText);
                match = /([\w-]*?)-*(stars|clouds)-(\d-\d)/i.exec(nodeText);
            }

            if (match != null) {

                // Strip out tag name and save off any trailing text (trailing text gets re-appended later)
                nodeText = nodeText.replace(match[0], "");

                // Remove tag text temporarily
                elAnchor.innerHTML = "";

                // Append the tag label, if suitable
                appendTagLabel(elAnchor, match[1]);

                // Render tag image
                renderTagImages(elAnchor, match[2], match[3]);

                // Prevent line breaks in the middle of rating images and labels
                elAnchor.style.whiteSpace="nowrap";

                // Restore trailing text
                elAnchor.innerHTML = elAnchor.innerHTML + nodeText;

            } // End regex string match test


            // If it's a tag on the edit-shelves page then add a shim to detect when they get renamed
            if (elAnchor.className.indexOf('displayShelfNameLnk') > -1) {
                appendRenameCanary(elAnchor);
            }

            // Flag the anchor has having been inspected so it won't get images appended
            // multiple times if the page is re-scanned to catch dynamic content (if tag text was not cleared).
            //
            //   Note : Data set name becomes "data-tag-image-inspected" when referenced as an Attribute.
            //
            elAnchor.dataset.tagImageInspected = "true";

        } // End previously inspected test

    } // End loop through all matching elements
}


// A couple globals
var tagImages = Object.create(null);  // Hash for storing tag image data by key name
var strInfiniteScrollStatusLast;
var objInfiniteStatusDiv;

// Initialize our tag images
initImageData();

// Convert any tags found on the page
convertTagsToImages();

// Install hooks for converting dynamic content that appears after initial page load
installInfiniteScrollHook();
installTagShelfUpdateHook();
installPopupReviewHook();
installEditShelfHook();

