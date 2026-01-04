// ==UserScript==
// @name         Hide Shorts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes every "shorts" video on your Subscriptions list. I'm on Twitter/X at JennaGrip. Come say hi!
// @author       Jojo
// @match        https://www.youtube.com/feed/subscriptions
// @match        http://www.youtube.com/feed/subscriptions
// @match        youtube.com/feed/subscriptions
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471542/Hide%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/471542/Hide%20Shorts.meta.js
// ==/UserScript==

function getList(){
    let vids = document.querySelectorAll("ytd-rich-grid-row[class=\"style-scope ytd-rich-grid-renderer\"]");
    return vids;
}
function checkList(vids){
    return vids.length;
}
function removeShorts(vids){
    console.log("Removing shorts...");

    for(let d = 0; d < vids.length; ++d){
        const element = vids[d].querySelector("ytd-thumbnail-overlay-time-status-renderer[overlay-style=\"SHORTS\"]");
        console.log(element);
        if(element !== null){
            vids[d].remove();
        }
    }
}

(function() {

    var listSize = -1;
    //Retry check every second until it finds something. After which, do it "onScroll" instead.
    const interval = setInterval(() => {
        let vids = getList();
        let count = checkList(vids);
        if(count > 0){
            //Do a first-time removal of shorts before switching to the onScroll method
            removeShorts(vids);

            //Clear the interval and make it so that removeShorts only happens when you scroll.
            document.getElementsByTagName('body')[0].onscroll = () => {
                //Limit the amount of times this check can happen by only doing it again if the list size gets changed.
                //A future version should probably limit the amount of times it checks to something other than every onScroll
                let v = getList();
                let curListSize = checkList(v);
                if(curListSize !== listSize){
                    listSize = curListSize;
                    removeShorts(v);
                }
            };
            clearInterval(interval);
        }
    }, 1000);

})();
