// ==UserScript==
// @name         Make Twitter Great Again
// @namespace    https://github.com/androidcn/userscripts/
// @version      2024-12-25
// @description  为Twitter增加两个按钮，快速让Twitter算法知道你“不感兴趣的推文“ From Chrome Extension "Make Twitter Great Again" not interesting this post
// @author       theopenprojects.io
// @match        https://twitter.com/home
// @match        https://x.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489599/Make%20Twitter%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/489599/Make%20Twitter%20Great%20Again.meta.js
// ==/UserScript==

var hideButton = document.createElement('button');
 function createButton() {
        // Create a button element
        hideButton.textContent = '隐藏';
        hideButton.style.position = 'fixed';
        hideButton.style.top = '60px';
        hideButton.style.right = '20px';
        hideButton.style.zIndex = '9999';
        // Append the button to the body
        document.body.appendChild(hideButton);
        // Add click event listener to the button
        hideButton.addEventListener('click', performHidedAction);
    }
function hideIt(){
    document.querySelector("header[role='banner']").style="display:none;";
    document.querySelector('div[aria-label="Home timeline"] div:first-child').style="display:none;";
    //console.log('已隐藏');
    hideButton.textContent = '显示';
    //GM_setValue("leftSideBar_hide",true);
}
function showIt(){
    document.querySelector("header[role='banner']").style="";
    document.querySelector('div[aria-label="Home timeline"] div:first-child').style="";
    //console.log('已显示');
    hideButton.textContent = '隐藏';
    //GM_setValue("leftSideBar_hide",false);
}
    function performHidedAction() {
        var HideText = hideButton.textContent ;
        if (HideText == "隐藏"){
            hideIt();
        }
        else{
             showIt();
        }
    }

    // Wait for the page to load
    window.addEventListener('load', createButton);
    //Scroll to hide lefe bar and top bar
    //window.addEventListener('scroll',hideIt);

const silencePath = 'path[d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"]'
const shitPath = 'path[d="M9.5 7c.828 0 1.5 1.119 1.5 2.5S10.328 12 9.5 12 8 10.881 8 9.5 8.672 7 9.5 7zm5 0c.828 0 1.5 1.119 1.5 2.5s-.672 2.5-1.5 2.5S13 10.881 13 9.5 13.672 7 14.5 7zM12 22.25C6.348 22.25 1.75 17.652 1.75 12S6.348 1.75 12 1.75 22.25 6.348 22.25 12 17.652 22.25 12 22.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25S16.549 3.75 12 3.75zM8.947 17.322l-1.896-.638C7.101 16.534 8.322 13 12 13s4.898 3.533 4.949 3.684l-1.897.633c-.031-.09-.828-2.316-3.051-2.316s-3.021 2.227-3.053 2.322z"]'
const moreProfilePath = 'path[d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"]'

const sleep = ms => new Promise(r => setTimeout(r, ms));

const waitForElm = (selector) => {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const elm = mutation.target.querySelector(selector);
                if (elm) {
                    observer.disconnect();
                    resolve(elm);
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};

const setTabStatusToBody = () => {
    const body = document.querySelector('body')
    if (!body || !document.querySelectorAll('[role="tablist"] [role="tab"]')) return
    //if (document.URL !== 'https://twitter.com/home') return;

    if (!Array.from(document.querySelectorAll('[role="tablist"] [role="tab"][data-index]')).length > 0) Array.from(document.querySelectorAll('[role="tablist"] [role="tab"]')).map((el, idx) => el.closest('div').setAttribute('data-index', idx + 1))

    const selectedIndexElm = document.querySelector('[role="tablist"] [role="tab"][aria-selected="true"]')
    if (selectedIndexElm) {
        const parent = selectedIndexElm.closest('div')
        if (parent) {
            body.setAttribute('data-make-twitter-great-again', parent.getAttribute('data-index'))
        }
    }
}

const createShityBtn = (tweet) => {
    if (!tweet || tweet.querySelector('.shitBtn')) return;
    //if (document.URL !== 'https://twitter.com/home') return;

    const button = document.createElement('button');
    tweet.setAttribute('data-shit', true);
    button.classList.add('shitBtn');
    button.innerHTML = '没兴趣';

    const navAction = tweet.querySelector('div[role="group"][id*="id__"]');
    if (navAction) navAction.appendChild(button);
}

const createSilenceBtn = tweet => {
    if (!tweet || tweet.querySelector('.silenceBtn')) return;
   // if (document.URL !== 'https://twitter.com/home') return;

    const button = document.createElement('button');
    tweet.setAttribute('data-silence', true);
    button.classList.add('silenceBtn');
    button.innerHTML = '封禁';

    const navAction = tweet.querySelector('div[role="group"][id*="id__"]');
    if (navAction) navAction.appendChild(button);
}

const handleBtnClick = async (e, selector) => {
    const tweet = e.target.closest('article');
    document.querySelector('body').setAttribute('data-pop-open', true)

    const btnDropdown = tweet.querySelector('[aria-haspopup="menu"][role="button"][data-testid="caret"]');
    if (!btnDropdown) return

    btnDropdown.click();

    await sleep(5);
    const dropdown = document.querySelector('[data-testid="Dropdown"],[data-testid="sheetDialog"]');
    if (!dropdown) return;
    
    const item = dropdown.querySelector(selector)
    if (item) item.closest('[role]').click()

    btnDropdown.click();

    if (document.querySelector('body').getAttribute('data-make-twitter-great-again') !== "1" || document.querySelector('body').getAttribute('data-make-twitter-great-again') !== "2") tweet.remove()
}

const handleProfileBtnClick = async (e, selector) => {
    const userActions = document.querySelector('[role="main"] [data-testid="userActions"]')
    if (!userActions) return

    document.querySelector('body').setAttribute('data-pop-open', true)

    const path = userActions.querySelector(moreProfilePath);
    if (!path) return
    const btnDropdown = path.closest('div[dir]')
    if (!btnDropdown) return

    btnDropdown.click();

    await sleep(5);
    const dropdown = document.querySelector('[data-testid="Dropdown"]');
    if (!dropdown) return;

    const item = dropdown.querySelector(selector)
    if (item) item.closest('[role]').click()

    dropdown.remove()
}

const addBtnToTweets = () => {
    const tweets = document.querySelectorAll('[role="region"] article:not([data-shit]):not([data-silence])');
    if (tweets && tweets.length > 0) tweets.forEach(tweet => {
        createShityBtn(tweet)
        createSilenceBtn(tweet)
    });
}

const addProfileSilenceBtn = () => {
    const userActions = document.querySelector('[role="main"] [data-testid="userActions"]')
    if (!userActions) return

    const contentActions = userActions.parentElement
    if (!contentActions || contentActions.getAttribute('data-silence') === 'true') return

    const button = document.createElement('button');
    contentActions.setAttribute('data-silence', true);
    button.classList.add('profileSilence');
    button.innerHTML = '🤫';

    contentActions.insertBefore(button, contentActions.firstChild);
}

const isProfile = () => {
    if (document.querySelector('head meta[content*="twitter://user?screen_name="]')) {
        document.querySelector('body').setAttribute('data-profile', true)

        addProfileSilenceBtn()
    }
    else document.querySelector('body').removeAttribute('data-profile')
}

const observeTweets = () => {
    const observer = new MutationObserver((mutations) => {
        setTabStatusToBody();
        isProfile()
        if (!document.querySelector('[data-make-twitter-great-again] [role="group"] > div > [role="menu"]')) document.querySelector('body').removeAttribute('data-pop-open')
        mutations.forEach(() => addBtnToTweets());
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    return observer;
}

(async () => {
    await waitForElm('[role="region"] article');

    setTabStatusToBody();
    isProfile();
    addBtnToTweets();

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('shitBtn')) handleBtnClick(e, shitPath);
        if (e.target.classList.contains('silenceBtn')) handleBtnClick(e, silencePath);
        if (e.target.classList.contains('profileSilence')) handleProfileBtnClick(e, silencePath);
    })

    const tweetsObserver = observeTweets();
    window.addEventListener('beforeunload', () => {
        tweetsObserver.disconnect();
    });
})();
