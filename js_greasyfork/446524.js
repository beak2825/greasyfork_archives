
// ==UserScript==
// @name         YouTube Reduced
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  Limit comments, stops infinite scroll, and removes the 3rd recommendation (random low view count video)
// @author       mewen25
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446524/YouTube%20Reduced.user.js
// @updateURL https://update.greasyfork.org/scripts/446524/YouTube%20Reduced.meta.js
// ==/UserScript==


/*

  Aiming to reduce time spent on each video, whether that be drastically fewer commments or videos on the side.
  I found options to completely remove those elements to be too much.

  The method for selecting the elements is not very good, probably some inconsistency.
  And other extensions affecting these areas will probably just make this break.

  There's a fair bit of bloat just to handle navigating to videos without a full refresh

*/

var commentCount = 5;
var recommendedCount = 11;

var verbose = true;

var url = '';
var readyInterval;

var thirdRemoved = false;
var commentsLimited = false;
var recommendedLimited = false;

var commentRefresher;
var recommendRefresher;

const config = { attributes: true, childList: true, subtree: false };

(async function() {
    setInterval(checkPageChanged, 500);
})();

//window.addEventListener('resize', () => {
//    console.log("resized?");
//    checkPageReady();
//});

function checkPageChanged(){
    if(document.location.toString() != url && document.location.toString().startsWith("https://www.youtube.com/watch?v")){
        if(verbose) console.log("[yt-reduced] - new vid");
        thirdRemoved = false;
        commentsLimited = false;
        recommendedLimited = false;
        const more = document.querySelector('#show-more-comments')
        if(more) more.remove();
        url = document.location.toString();
        handleVid();
        //readyInterval = setInterval(checkPageReady, 100);
    }
}

function handleVid() {
    console.log("handling vid");
    const checkReady = () => {
       const comments = document.getElementsByTagName("YTD-COMMENTS")?.[0];
       const vids = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")?.[2]?.querySelector("#contents") ?? document.getElementsByTagName("YTD-WATCH-NEXT-SECONDARY-RESULTS-RENDERER")?.[0].querySelector("#items") ?? null;

       if(comments?.children?.length > 0 && comments.querySelector("#contents")?.children?.length > 1 && (vids?.children?.length > 1)) {
           console.log(`[yt-reduced] - elements loaded`);
           clearInterval(elementsInterval);
           removeComments();
           limitRecommendations();
       }
    }


    var elementsInterval = setInterval(checkReady, 100);

}

function checkPageReady(){
    const comments = document.getElementsByTagName("YTD-COMMENTS")?.[0];
    const vids = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")?.[2]?.querySelector("#contents");
    const vids2= document.getElementsByTagName("YTD-WATCH-NEXT-SECONDARY-RESULTS-RENDERER")?.[0];

    //console.log("[yt-reduced] - activating", vids?.children.length, comments?.children.length);


    if(comments?.children.length > 0 && comments?.querySelector("#contents").children?.length > 1 && (vids?.children?.length > 0 || vids2?.children?.length > 0)) {
      removeComments();
      limitRecommendations();
      setTimeout(limitRecommendations, 2000);
      clearInterval(readyInterval);
    }

}

/*
// was thinking about removing all recommendations that don't match with the main video title

function titleMatch(main, rec) {
    return main.some(t => {
        return rec.includes(t.toLowerCase());
    })
}

function onlyRelevant() {
    const container = document.getElementsByClassName("ytd-watch-next-secondary-results-renderer")[1];
    const contents = container.querySelector("#contents");

    const title = document.getElementsByClassName("ytd-video-primary-info-renderer")[5].textContent.split(" ").map(l => l.toLowerCase());
    contents.removeChild(contents.lastElementChild);
    console.log("updates", title, contents.children.length);
    var child;
    for(let i=contents.children.length; i>0;i--) {
        child = contents.lastElementChild;
        const recTitle = child.getElementsByTagName("H3")[0]?.textContent.trim().split(" ").map(l => l.toLowerCase());
        const match = titleMatch(title, recTitle);
        console.log('checking', child.tagName, match);
        if(!match || child.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
            console.log("removing", recTitle);
            contents.removeChild(child);
        }
    }
}
*/

function limitRecommendations() {
    const contents = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")?.[2];
    const vids = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")?.[2]?.querySelector("#contents") ?? document.getElementsByTagName("YTD-WATCH-NEXT-SECONDARY-RESULTS-RENDERER")?.[0]?.querySelector("#items") ?? null;
    console.log("rec", vids);
    if(!vids) return;
    if(verbose) console.log("[yt-reduced] - Limiting recommendations to ["+recommendedCount+"]");


    const callback = function(mutationsList, observer) {
        //console.log("update", mutationsList);
        const extra = vids.getElementsByTagName("YTD-PROMOTED-SPARKLES-WEB-RENDERER");
        //if(extra.length > 0) extra.forEach(e => vids.removeChild(e));
        if(mutationsList?.[0].target.firstChild.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
            const vids = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")?.[2].querySelector("#contents");
            const renderer = mutationsList?.[0].target.firstChild;
            renderer.style.display = "unset";
            const contents = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")[2].querySelector("#contents");
            vids.lastElementChild.style.display = "unset";
            recommendedLimited = false;
            return;
        }

        let child;

        if(!recommendedLimited) {
        for(let i=vids.children.length; i>0;i--) {
            child = vids.lastElementChild;
            if(i > recommendedCount || child.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
                if(child.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
                    //if(verbose) console.log("[yt-reduce] - removed recommended auto refresh");
                    child.style.display = "none"; // last child in recommended fetches more, so gets hidden, and then gets reset on a new video
                    recommendRefresher = child;
                    recommendedLimited = true;
                }
                else vids.removeChild(child);
            }
        }
        }

        //}
    };

    const bodyObserver = new MutationObserver(callback); // runs the comments check when the container changes
    if(vids) bodyObserver.observe(vids, config);
    //removeThirdRecommendation();

    addCommentsButton();

}


function removeThirdRecommendation() {
    const contents = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")?.[2]?.querySelector("#contents") ?? document.getElementsByTagName("YTD-WATCH-NEXT-SECONDARY-RESULTS-RENDERER")?.[0].querySelector("#items") ?? null;
    if(!contents) return
    const third = contents.getElementsByTagName("YTD-COMPACT-VIDEO-RENDERER");
    if(!thirdRemoved) {
        console.log("[yt-reduced] - removing 3rd video");
        // sometimes this video isn't in the 3rd slot? I think because of the playlists around that area
        contents.removeChild(third[2]);
        contents.removeChild(third[1]);
        thirdRemoved = true;
    }
}

function addCommentsButton() {
    const container = document.querySelector("#comments > #sections");
    let showMoreComments = document.createElement('div');
    let showMoreText = document.querySelector('.more-button.ytd-video-secondary-info-renderer') == null ? 'SHOW MORE' : document.querySelector('.more-button.ytd-video-secondary-info-renderer').textContent;
    showMoreComments.id = 'show-more-comments';
    showMoreComments.style = 'text-align:center; margin-bottom: 16px; margin-right: 15px;margin-bottom:20px;';
    showMoreComments.innerHTML = '<input type="button" style="font-family: Roboto, Arial, sans-serif; padding-top: 9px; width: 100%; border-top: 1px solid #e2e2e2; border-bottom: none; border-left: none; border-right: none; background:whitesmoke; font-size: 1.1rem; outline: none; cursor:pointer; text-transform: uppercase; font-weight: 500; color: var(--redux-spec-text-secondary); letter-spacing: 0.007px; padding-bottom: 8px;"></input>';
    showMoreComments.querySelector('input').value = showMoreText;
    container.append(showMoreComments);
    document.querySelector('#show-more-comments').onclick = function() {
        commentRefresher.style.display = "unset";
        commentCount += 5;
        setTimeout(() => {commentRefresher.style.display = "none";}, 1000);
        window.scrollBy({top: 50, left: 0, behavior: "smooth"});
    };
}


function removeComments() {
    const commentsContainer = document.getElementsByTagName("YTD-COMMENTS")[0].querySelector("#contents");
    const comments = document.querySelector('#comments > #sections > #contents.style-scope.ytd-item-section-renderer');


    if(verbose) console.log("[yt-reduced] - limiting comments to ["+commentCount+"]");

    const callback = function(mutationsList, observer) {
        //console.log("update", mutationsList);

        if(mutationsList?.[0].target.firstChild.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
            if(verbose) console.log("[yt-reduced] - resetting page");
            const vids = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")[2].querySelector("#contents");
            const renderer = mutationsList?.[0].target.firstChild;
            renderer.style.display = "unset";
            const contents = document.getElementsByTagName("YTD-ITEM-SECTION-RENDERER")[2].querySelector("#contents");
            contents.lastElementChild.style.display = "unset";
            vids.lastElementChild.style.display = "unset";
            commentCount = 5;
            commentsLimited = false;
            recommendedLimited = false;
            thirdRemoved = false;
            return;
        }

        //if(!commentsLimited) {
        var child = comments.firstElementChild;

        for(let i=comments.children.length; i>0;i--) {
            child = comments.lastElementChild;
            if(i > commentCount || child.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
                if(child.tagName == "YTD-CONTINUATION-ITEM-RENDERER") {
                    console.log("[yt-reduce] - removed comments auto refresh");
                    child.style.display = "none"; // last child in comments fetches more, so gets hidden, and then gets reset on a new video
                    commentRefresher = child;
                }
                else {
                    comments.removeChild(child);
                }
            }
        }
        commentsLimited = true;
        //}
    };

    const bodyObserver = new MutationObserver(callback); // runs the comments check when the container changes
    bodyObserver.observe(comments, config);
}