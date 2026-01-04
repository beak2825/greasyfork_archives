// ==UserScript==
// @name         Creddit
// @namespace    github.com/JasonAMelancon
// @version      2025-09-24
// @description  Adds post authors to items in Reddit feed (on new Reddit)
// @author       Jason Melancon
// @license      GNU AGPLv3
// @match        http*://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545054/Creddit.user.js
// @updateURL https://update.greasyfork.org/scripts/545054/Creddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

//-- script begins here --//

const DEBUG = false;
// The msg is in a lambda expression body so that string interpolation only happens if we
// actually print the message (lazy evaluation).
function debugLog(lambdifiedMsg) {
    if (DEBUG) console.log(lambdifiedMsg());
}

const scriptName = GM_info.script.name;
const FEED = "shreddit-feed"; // Reddit's custom element name
const POST = "shreddit-post"; // Reddit's custom element name
const VIEW_CONTEXT = "view-context"; // Reddit's custom attribute name
const AGGREGATE_FEED = "AggregateFeed"; // Reddit's post element attribute value; indicates need to run script

const CREDITED = "is-credited"; // my custom attribute for the post element

//== This is the main part of the script. ==//

function runScript() {
    const feeds = document.getElementsByTagName(FEED);
    if (feeds.length > 1) { // I have no idea whether this is or will ever be necessary
        console.log(`[${scriptName}] Multiple Reddit feed nodes present`);
    }
    const feed = feeds[0];

    const articleCollection = feed.querySelectorAll("article");
    debugLog(() => `[${scriptName}] ${articleCollection.length} initial articles`);
    // Get the first few articles in the feed when the page loads, and add the author.
    articleCollection.forEach(article => {
        if (!isCredited(article)) {
            creditAuthor(article);
            markCredited(article);
        }
    });

    // Watch the page for new articles that appear when scrolling.
    const dynamicScroll = new MutationObserver(mutations => {
        debugLog(() => `[${scriptName}] ${mutations.length} new mutation objects`);
        for (let mutation of mutations) {
            const newArticleArray = Array.from(mutation.addedNodes).filter(node => node.nodeName === "ARTICLE");
            debugLog(() => `[${scriptName}] ${newArticleArray.length} new articles`);
            if (newArticleArray.length == 0) continue;
            // Add the author to the new articles as they appear.
            newArticleArray.forEach(article => {
                if (!isCredited(article)) {
                    creditAuthor(article);
                    markCredited(article);
                }
            });
        }
    });
    dynamicScroll.observe(feed, { childList: true, subtree: false, attributes: false, characterData: false });

    // Put the author of a single article on the top line, next to the subreddit and post age.
    function creditAuthor(article) {
        const post = article.querySelector(POST);
        const subreddit = post.getAttribute("subreddit-name");

        // Posts to a followed u/user have no true r/subreddit;
        // these already have the author credit inherently.
        const selfPost = !subreddit;
        if (selfPost) return; // no need for another byline

        const author = post.getAttribute("author");
        const creditBar = post.querySelector("[id*='credit-bar']");
        const separator = creditBar.querySelector(".created-separator");
        creditBar.appendChild(separator.cloneNode(/*deep = */true));
        const byLineClass = separator.nextElementSibling.getAttribute("class");
        const byLine = creditBar.appendChild(document.createElement("span"));
        byLine.setAttribute("class", byLineClass);
        byLine.textContent = "by ";
        byLine.insertAdjacentHTML("afterend", authorNameCard());

        // This code enables the author "hover card" with some info from the profile page.
        // Returns HTML copied and pasted almost verbatim from inside a subreddit.
        function authorNameCard() { return `
          <span slot="authorName" class="flex">
            <div class="inline-flex items-center max-w-full">
              <faceplate-hovercard enter-delay="500" leave-delay="150" position="bottom-start"
                                   data-id="user-hover-card" label="${author} details" mouse-only="" appearance="neutral">
                <faceplate-tracker source="post_credit_bar" action="click" noun="user_profile" class="visible">
                  <a rpl="" class="author-name whitespace-nowrap text-neutral-content visited:text-neutral-content-weak font-semibold
                                   focus-visible:-outline-offset-1 a cursor-pointer no-visited no-underline hover:no-underline"
                            href="/user/${author}/" aria-haspopup="dialog" aria-expanded="false">
                    ${author}
                  </a>
                </faceplate-tracker>
                <div slot="content">
                  <faceplate-partial src="/svc/shreddit/user-hover-card/${author}?subredditName=${subreddit}" loading="programmatic">
                    <div class="w-5xl h-4xl flex items-center justify-center">
                      <faceplate-progress value="20" class="animate-spin"></faceplate-progress>
                    </div>
                  </faceplate-partial>
                </div>
              </faceplate-hovercard>
            </div>
          </span>`;
        }
    }

    // When scrolling down far enough, Reddit unloads posts from the top of the page,
    // presumably to save memory. In general, Reddit unloads posts you scroll away from
    // and loads or reloads posts you scroll toward. Without checking to make sure the
    // post hasn't already been credited, this can cause this script to credit the post
    // multiple times when the MutationObserver notices a credited post reappear in the
    // feed.
    //
    // Therefore, check first.
    function isCredited(article) {
        const post = article.querySelector(POST);
        debugLog(() => `[${scriptName}] credited check: ${post.hasAttribute(CREDITED)}`);
        return post.hasAttribute(CREDITED);
    }

    // Marks a post as already credited.
    function markCredited(article) {
        const post = article.querySelector(POST);
        post.setAttribute(CREDITED, "");
    }
}

//== This is the part of the script that deals with the PITA way Reddit does scripted navigation. ==//

// Detect feed page on initial load or subsequent XHR/AJAX load by checking the view-context attribute
// of the first post.
//
// This script can run on any page that's designated by Reddit as an "aggregate feed," meaning a feed
// with posts taken from more than one subreddit. Examples would be r/popular, r/all, /new/, etc.
function runScriptIfNecessary() {
    const isAggregateFeed = document.querySelector(POST)?.getAttribute(VIEW_CONTEXT) == AGGREGATE_FEED;
    debugLog(() => `[${scriptName}] This page ${isAggregateFeed ? "contains" : "does not contain"} an aggregate feed`);

    if (isAggregateFeed) {
        runScript();
    }
}

runScriptIfNecessary();

// Run the script when using the site nav (fake AJAX navigation) to get to the feed. This apparently
// can be bouncy and fire multiple times and lead to repeated console debug messages. This code does
// contain a debouncing measure, but even without this the problem is not severe, since before
// modifying any post's DOM we always check if we've done it already.
{
    let lastObservation = 0;
    new MutationObserver(() => {
        let now = Date.now();
        if (now - lastObservation > 300) { // debounce
            const title = document.querySelector("title").textContent;
            debugLog(() => `[${scriptName}] Page <title> change detected (indicating navigation to a new page);\n` +
                           `[${scriptName}] <title> is now "${title}" at time ${now}`);

            runScriptIfNecessary();
            lastObservation = now;
        }
    }).observe(document.querySelector("title"), { childList: true });
}

//-- script ends here --//

})();
