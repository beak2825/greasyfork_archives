// ==UserScript==

// @name        ad free twitter unlisted
// @namespace   twitter_kboudy
// @description hides promoted tweets (in your feed & the sidebar)
// @include     https://twitter.com/*
// @include     https://twitter.com
// @version     1.1
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/429584/ad%20free%20twitter%20unlisted.user.js
// @updateURL https://update.greasyfork.org/scripts/429584/ad%20free%20twitter%20unlisted.meta.js
// ==/UserScript==

//NOTE: Twitter obfuscates their css class names
//      so we traverse via html tag hierarchy, hence all the .children[1].children[0] chains

const getPromoted = (p) => {
    if (!p || !p.innerText)
    {
        return false;
    }
    for (const l of p.innerText.split('\n'))
    {
      if (l.startsWith("Promoted"))
      {
          // Hide the "Promoted Tweet" divider bar (so there's not two in a row)
          //p.previousSibling.style.display="none";
          return p;
      }
    }
    const LOOKBACK_WORD_COUNT = 15;
    const text = p.innerText;
    const words = text.match(/\S+\s*/g).map(w=>w.trim()).slice(-LOOKBACK_WORD_COUNT);
    if (words.filter(w=>w.includes('Promoted')).length > 0)
    {
      return p;
    }
    return null;
}

const hidePromotedTweets =() => {
    // Primary twitter post section
    const posts = document.getElementsByTagName("article");
    if (posts)
    {
        for (const p of posts)
        {
            let postWrapper = p;
            while (postWrapper.className)
            {
                postWrapper = postWrapper.parentElement;
            }

            const promoted = getPromoted(postWrapper);
            if (promoted)
            {
                promoted.style.display="none";
                promoted.style.visibility="hidden";
            }
        }
    }

    // The "What's Happening" side-bar section
    const sideBar = document.getElementsByTagName("section");
    if (sideBar && sideBar[1] && sideBar[1].children[1] && sideBar[1].children[1].children[0])
    {
        const sideBarChildren = sideBar[1] && sideBar[1].children[1].children[0].children;
        for (let i = 2; i < sideBarChildren.length; i++)
        {
            const sideBarPost = sideBarChildren[i];
            const promoted = getPromoted(sideBarPost);
            if (promoted)
            {
                promoted.style.display="none";
            }
        }
    }

    // The "Who to follow" (& similar) side-bar section
    const asides = document.getElementsByTagName("aside");
    for (const aside of asides)
    {
        if (aside && aside.children && aside.children[1])
        {
            const asideChildren = aside.children[1].children;
            for (let i = 0; i < asideChildren.length; i++)
            {
                const asidePost = asideChildren[i];
                const promoted = getPromoted(asidePost);
                if (promoted)
                {
                    promoted.style.display="none";
                }
            }
        }
    }
}

hidePromotedTweets();
setInterval(function(){
    hidePromotedTweets();
},1000);
