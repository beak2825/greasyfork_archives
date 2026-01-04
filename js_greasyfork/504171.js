// ==UserScript==
// @name         Google interface cleanup
// @description  Remove junk from Google search results like "People also ask", etc.
// @license      MIT
// @version      129
// @match        https://*.google.com/search*
// @match        https://*.google.ca/search*
// @match        https://*.google.fr/search*
// @match        https://*.google.co.uk/search*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1354160
// @downloadURL https://update.greasyfork.org/scripts/504171/Google%20interface%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/504171/Google%20interface%20cleanup.meta.js
// ==/UserScript==

const annoyances = [
    'People also ask',
    'People also search for',
    'People also search',
    'Videos',
    'Short videos',
    'Refine this search',
    'Search a song',
    'Related searches',
    'Hum to search',
    'Trending videos',
    'Related videos',
    'For context',
    'Also searched for',
    'Often searched together',
    'Others searched',
    'Local news',
    'Popular on X',
    'People also watch',
    'Events',
    'Profiles',
    'Perspectives',
    'What to watch',
    'Posts on X',
    'Nearby stores',
    'People also buy from',
    'Trending movies',
    'Ticket prices',
    'Mentioned in the news',
    'Visual stories',
    'Latest posts from',
    'Twitter Results',
    'Images',
    'Related topics',
    'Context',
    'For reference',
    'Helpful context',
    'Recipes'
]

function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes =
        typeof selectorOrFunction === "function" ?
        selectorOrFunction() :
        document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function (targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                } else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function () {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}

// Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
    if (el === null) {
        return true;
    } else {
        return (el.offsetParent === null)
    }
}

function getbyXpath(xpath, contextNode) {
    let results = [];
    let query = document.evaluate(xpath, contextNode || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function removeJunk(jNode) {
    let div = jNode

    let matchingAnnoyances =
        annoyances
        .filter(a => div.innerHTML.indexOf(a) != -1)
        .flatMap(a => {
            let k = getbyXpath(`.//div[starts-with(text(), '${a}')]|//span[starts-with(text(), '${a}')]|//h2[starts-with(text(), '${a}')]`, div)
            // console.log(a, k)
            return k
        })
        .filter(node => !isHidden(node));

    // console.log(matchingAnnoyances)

    matchingAnnoyances.forEach(matchingAnnoyance => {
        if (matchingAnnoyance && !isHidden(matchingAnnoyance)) {
            console.log(div, matchingAnnoyance)
            traverseAncestors(matchingAnnoyance)
        }
    });
}

function undesiredElement(jNode) {
    jNode.style.display = 'none'
}

function destroyElement(jNode) {
    jNode.remove()
}

function undesiredElementParent(jNode) {
    let parent = jNode.parentElement;

    if (parent !== null) {
        parent.style.display = 'none';
    }
}

function traverseAncestors(node) {
    if (node) {
        if (node.tagName == 'DIV') {
            let parentElement = node.parentElement
            let childDivs = [...parentElement.children].filter(c => c.tagName == "DIV")
            let hasInfoSection = node.querySelector('.kp-wholepage')
            // console.log(childDivs)

            if (((childDivs.length > 1) && (node.hasAttribute('jsdata') || node.className == 'MjjYud')) || ((childDivs.length == 1) && (parentElement.id == 'bres'))) {
                // console.log(node)
                if (hasInfoSection === null) {
                    node.style.display = 'none';
                }
            } else {
                traverseAncestors(node.parentNode);
            }
        } else traverseAncestors(node.parentNode)
    }
}

function removeSearchSuggestions(jNode) {
    jNode.removeAttribute("jscontroller")
}

function visualDigest(jNode) {
    jNode.closest('div.ycw3p').style.display = 'none'
}

waitForKeyElements('#rso div.MjjYud', removeJunk);
waitForKeyElements('#botstuff div.MjjYud', removeJunk, false);
waitForKeyElements('#botstuff #bres div[id*=dub_]', undesiredElement);
waitForKeyElements('#media_result_group', undesiredElement)
waitForKeyElements('g-card:has(> div[class="mnr-c"])', undesiredElement, false)
waitForKeyElements('div[data-attrid="VisualDigestFullBleedVideoResult"]', undesiredElement)
waitForKeyElements('inline-video', undesiredElement)
waitForKeyElements('product-viewer-group', undesiredElement, false)
waitForKeyElements('block-component', undesiredElement, false) // featured snippets at top
waitForKeyElements('form[action="/search"] > div > div[jscontroller]', removeSearchSuggestions)
waitForKeyElements('div[data-attrid="VisualDigestNewsArticleResult"]', visualDigest)
waitForKeyElements('div[data-attrid="VisualDigestSocialMediaResult"]', visualDigest)
waitForKeyElements('div[data-attrid="VisualDigestWebResult"]', visualDigest)