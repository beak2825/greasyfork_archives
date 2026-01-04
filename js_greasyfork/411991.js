// ==UserScript==
// @name            Tweetdeck hide self retweets and more
// @namespace       https://github.com/argit2/tweetdeck-blacklist
// @version         0.0.8
// @license         GPL-3.0-or-later
// @supportURL      https://github.com/argit2/tweetdeck-blacklist
// @description     Hide self retweets. Blacklist accounts to not see retweets of their posts. Very useful when you have a group of users that retweet each other.
// @author          argit2
// @include         https://tweetdeck.twitter.com*
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/411991/Tweetdeck%20hide%20self%20retweets%20and%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/411991/Tweetdeck%20hide%20self%20retweets%20and%20more.meta.js
// ==/UserScript==

/*
Instructions

Self retweets are blocked by default
Click on a user on tweetdeck to access the user profile. The buttons to block and unblock will be there.

Features

- Self retweets are blocked by default. PS: a "self retweet" is when a user retweets posts of themselves.
- Hide when someone retweets or replies to this account, and also when the account replies to someone else. For now, both features at not separated. The idea is to stop situations where a group of users retweet and reply to each other.
- Hide text posts per user (show media posts only).
- Hide retweets per user. Useful when you like someone's original content but not their retweets. Very useful when an account keeps retweeting their other accounts.

- Implemented but no button yet: hide retweets containing a word per user. Useful mostly for blocking the user from making propaganda for youtube channels for example.

You can see and modify the full list of users by doing this:

1) Access tweetdeck.
2) Click on tampermonkey icon, right click on the script to access the page where you edit the script. Go to the Storage tab of the script and include the accounts you would like to not see retweets of. The storage tab is only visible if you have the advanced settings turned on inside of Tampermonkey.
3) Click save.

You can check which tweets are being removed in the console in the developer tools of your browser.
In Firefox: Ctrl Shift K
In Chrome: Ctrl Shift J

PS: I use storage instead of a variable so your blacklisted accounts are preserved across updates of the script
*/

// For self reference: based on my other youtube blacklist script, so any time you see "video" think it as "tweet".

const bannedWords = [
];

// returns a new object with the values at each key mapped using mapFn(value)
function objectMap (obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )};

function objectKeysMap(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [fn(k), v]
    )
  )};

function objectKeysToLowerCase(obj) {
   return objectKeysMap(obj, x => x.toLowerCase());
}

function arrayToObjKeys (arr) {
    return arr.reduce( (a, b) => {
        a[b] = '';
        return (a[b], a)
    }, {});
}

function wordsInText (regs, text) {
    let word = ""
    let found = (regs.some( (reg, index) => {
        word = reg.toString();
        // easier than checking if is string
        if (! (reg instanceof RegExp)) {
            return (new RegExp(reg).test(text));
        }
        return reg.test(text);
    }))
    if (found) {
        return word;
    }
    return false;
}

const defaultStorage = {
    "retweetBlacklist" : [],
    // {"exampleAccount1" : ["mutedword1", "mutedword2"]}
    "mutedWordByUser" : {},
    "mediaOnlyUsers" : [],
    "noRetweet" : []
}

// initializes storage if not initialized yet
Object.keys(defaultStorage).forEach( k => {
    if (! GM_getValue(k)) {
        GM_setValue(k, defaultStorage[k]);
    }
})

function getStorageValue(name) {
    let stored = GM_getValue(name);
    console.log(name, stored);
    if (stored instanceof Array) {
        let lowercase = stored.map( (user) => user.toLowerCase() );
        return arrayToObjKeys(lowercase);
    }
    // is object
    return objectKeysToLowerCase(stored);
}

function getStorage() {
    let storage = {};
    Object.keys(defaultStorage).forEach ( k => {
        storage[k] = getStorageValue(k)
    });
    return storage;
}

function updateStorage() {
    Object.keys(storage).forEach (k => {
        let value = storage[k];
        if (defaultStorage[k] instanceof Array) {
            value = Object.keys(storage[k]);
        }
        GM_setValue(k, value);
    })
}

var storage = getStorage();

function linkToUsername (link) {
    if (! link) return "";
    let split = link.split("/");
    let last = split[split.length - 1];
    // link ends in /, example twitter.com/whateveruser/
    if (last == "") {
        return split[split.length - 2];
    }
    return last.toLowerCase();
}

const nobody = "random username that nobody will ever have";

function tweetContent (tweet) {
    let elementWithText = tweet.querySelector(elementToCheckForWords);
            // Apparently sometimes a tweet has no text, only image
    let textContent = "";
    if (elementWithText) {
        textContent = elementWithText.textContent.toLowerCase();
    }
    return textContent;
}

function whoTweeted (tweet) {
    // when you scroll for a while, tweetdeck will display "show more" instead of new tweets and there'll be no link
    try {
        let linkElement = tweet.querySelector("a.account-link.link-complex");
        let link = linkElement.getAttribute("href");
        return linkToUsername(link);
    }
    catch {
        return nobody;
    }
}

function whoRetweeted (tweet) {
    // returns false if isn't retweet, returns who retweeted if true
    let retweet = tweet.querySelector("div.nbfc a")
    if (! retweet) {
        return false;
    }
    let user = linkToUsername(retweet.getAttribute("href"))
    // is reply instead of retweet
    if (user == "#") {
            //user = retweet.innerText.substring(1);
            return false;
        }
    return user;
}

function whoReplied (tweet) {
    // returns false if isn't reply, returns who replied if true
    let reply = tweet.querySelector("div.nbfc a")
    if (! reply) {
        return false;
    }
    let retweetUser = linkToUsername(reply.getAttribute("href"))
    // is reply instead of retweet
    if (retweetUser != "#") {
            return false;
        }
    return reply.innerText.substring(1);
}

function tweetInfo(tweet) {
    // this is pain, i had a similar function that corrected who was the user and who was the replier, but i lost it. lazy to do it now. will keep the usual values.
    let user = whoTweeted(tweet);
    let retweeter = whoRetweeted(tweet);
    let replier = whoReplied(tweet);
    let content = tweetContent(tweet);
    let info = {
        "user" : user,
        "retweeter" : retweeter ,
        "replier" : replier,
        "content" : content,
    };
    return info;
}

function inBlacklist (tweet) {

    let user = whoTweeted(tweet);
    let retweeter = whoRetweeted(tweet);
    let replier = whoReplied(tweet);

    let replyCondition = replier && (user in storage.retweetBlacklist || replier in retweetBlacklist);
    if (replyCondition) {
        return replier + ' replied to ' + user;
    }

    let retweetCondition = retweeter && user in storage.retweetBlacklist;
    if (retweetCondition) {
        return retweeter + ' retweeted ' + user;
    }
    return false
}

function isSelfRetweet (tweet) {
    let user = whoTweeted(tweet)
    let condition = user == whoRetweeted(tweet);
    if (condition) {
        return 'self retweet ' + user;
    }
    return false
};

function hasMutedWordByUser (tweet) {
    let info = tweetInfo(tweet);
    let mutedWords = storage.mutedWordByUser[info.user];
    if (info.content && mutedWords) {
        let word = wordsInText(mutedWords, info.content);
        if (word) {
            return 'word ' + word + ' for user ' + info.user;
        }
    }
    return false;
}

function isTextByMediaOnlyUser (tweet) {
    let info = tweetInfo(tweet);
    let mediaStrings = ["t.co/", "pic.twitter.com"]
    if (info.user in storage.mediaOnlyUsers && (! wordsInText(mediaStrings, info.content))) {
        return 'non-media tweet for user ' + info.user;
    }
}

function isNoRetweetUser (tweet) {
    let info = tweetInfo(tweet);
    if (info.retweeter in storage.noRetweet) {
        return 'retweet from user' + info.retweeter;
    }
}

const customConditions = [
   isSelfRetweet,
   inBlacklist,
   hasMutedWordByUser,
   isTextByMediaOnlyUser,
   isNoRetweetUser
];

const elementToObserve = "div.js-chirp-container" ; // columns
const elementToRemove = "article.stream-item" ; // tweet
const elementToCheckForWords = ".js-tweet-text" ;

(() => {
    "use strict";

    // so we can check if words are in the text alone
    // example: will match only "vlog" alone but not "devvlog" because not alone
    const regexes = bannedWords.map( (word) => {return new RegExp(`(?<![a-zA-Z])${word}(?![a-zA-Z])`)} );

    function filterTweets (column) {
        // sometimes there's an array of changes (apparently corresponds to show the more elements section appearing, old tweets being removed, and new tweets being added).
        // we pick only the added elements if possible. in many cases this doesn't make a difference
        // because as you scroll down, tweetdeck might reload all the tweets
        // but sometimes it won't.
        // then for example there are 40 tweets and only 3 of them are new (actually happens)
        // filtering only new elements reduces weird behavior
        // example: page moving suddenly because of many tweets being hidden
        let nodes = [];
        if (column instanceof Array) {
            let addedNodes = column.map( (ele) => Array.from(ele.addedNodes.values()));
            nodes = addedNodes.flat();
        }
        // might only happen when it's an array like above, but will keep it there anyway
        else if (column instanceof MutationRecord)
        {
            nodes = column.addedNodes;
        }
        else {
            nodes = column.querySelectorAll(elementToRemove);
        }
        nodes.forEach(tweet => {
            let textContent = tweetContent(tweet);
            if (textContent) {
                let found = wordsInText(regexes, textContent);
                if (found) {
                    console.log(`Removing ${found} : ${textContent}`);
                    tweet.style.display = "none";
                    return;
                }
            }

            // removes if match custom conditions
            for (const condition of customConditions) {
                let cond = condition(tweet);
                if (cond) {
                    console.log(`Removing '${cond}' : ${textContent}`);
                    tweet.style.display = "none";
                    return;

                }
            }

        });
    }

    // wait for videos to load.
    const interval = setTimeout(() => {
        // div containing videos
        const videos = document.querySelectorAll(elementToObserve);
        if (!videos) {
            console.log("Didn't find columns");
            return;
        }
        console.log("Found columns");
        clearInterval(interval);

        // observes new sections of videos being added to the subscription page
        // and removes videos that have blacklisted words
        for (const column of videos) {
            filterTweets(column);
            new MutationObserver(filterTweets).observe(column, { childList: true});
        }
    }, 2000);

})();

// State management https://github.com/MaiaVictor/PureState/
var PureState = (function(){
  var captured_deps = [];
  var capturing_deps = false;

  // Refreshes the value of a node.
  function refresh(node){
    // Gathers the values that this node depend on
    // and calls its compute() function with them.
    var depended_values = [];
    for (var i=0; i<node.dependencies.length; ++i)
      depended_values.push(node.dependencies[i].value);
    node.value = node.compute.apply(null, depended_values);

    // Refresh each node that depends on this one.
    for (var i=0; i<node.depended_by.length; ++i)
      refresh(node.depended_by[i]);
  };

  // To build a stateful value, you must provide either
  // the initial state (a JS value) or a computed state,
  // i.e., a function that uses other stateful values.
  function state(compute){
    // This sets the compute function of the node, i.e., the function that is
    // used to compute a state value in function of other states.  A
    // non-computed state is actually a computed state where the computing
    // function has no arguments, so we wrap such function around the value.
    function wrap_function(compute){
      if (typeof compute !== "function")
        return function(){ return compute; };
      else
        return compute;
    };
    node.compute = wrap_function(compute);

    // The state object can be called with or without an argument. If it is
    // called without an argument, it just returns its value. If it is caleld
    // with an argument, it refreshes the computing function of that state and
    // returns the new value.
    function node(new_compute){
      // If we are in the variable capture phase (ref below), then we push this
      // node to the `capture_deps` array.
      if (capturing_deps)
        captured_deps.push(node);
      // Otherwise, we do what was described above.
      if (new_compute !== undefined){
        node.compute = wrap_function(new_compute);
        refresh(node);
      };
      return node.value;
    }

    // The variable capture phase is a little small hack that allows us not to
    // need to specify a list of dependencies for a computed function. It works
    // by globally changing the behavior of every state object so that, instead
    // of doing what it does (get/set its state), it just reports its existence
    // to a dependency collector array. This looks ugly in code, but can be
    // seen as a workaround for a language limitation. It is mostly innofensive
    // and avoids a lot of boilerplate.
    node.depended_by = [];
    captured_deps = [];
    capturing_deps = true;
    node.compute();
    capturing_deps = false;
    node.dependencies = captured_deps;
    for (var i=0; i<captured_deps.length; ++i)
      captured_deps[i].depended_by.push(node);

    // When the node is properly built, we just bootstrap its initial value by
    // refreshing it. This avoids a little code duplication.
    refresh(node);

    return node;
  };

  return state;
})();

const state = PureState;


/*
 Button to add user to blacklist
*/

// AUX

function newNode(html) {
    let div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
}

let profileNode = document.querySelector("div.js-modals-container");

// MODEL

let user = state("");
// making the model depend on the storage variables
// so we alter the storage variables and the model changes
let block_replies = state(() => user() in storage.retweetBlacklist);
let media_only = state(() => user() in storage.mediaOnlyUsers);
let no_retweet = state(() => user() in storage.noRetweet);

function get_profile_user() {
    if ( (!profileNode) || profileNode.children.length == 0) return "";
    let link = profileNode.querySelector("a.js-action-url.link-clean").getAttribute("href");
    let user = linkToUsername(link);
    return user;
}

function initialize_model() {
    user(get_profile_user());
}

// UPDATE

function genericAdd(dict) {
    dict[user()] = "";
    updateStorage();
    refresh();
}

function genericRemove(dict) {
    delete dict[user()];
    updateStorage();
    refresh();
}

function addToMediaOnly(){
    genericAdd(storage.mediaOnlyUsers);
    console.log("Block text only posts from ", user());
}

function removeFromMediaOnly() {
    genericRemove(storage.mediaOnlyUsers);
    console.log("Unblocked text only posts from ", user());
}

function addToBlacklist(){
    genericAdd(storage.retweetBlacklist);
    console.log("Added user", user(), "to blacklist");
}

function removeFromBlacklist() {
    genericRemove(storage.retweetBlacklist);
    console.log("Removed user", user(), "from blacklist");
}

function blockRetweet(){
    genericAdd(storage.noRetweet);
    console.log("Blocked user", user(), "from retweeting");
}

function unblockRetweet() {
    genericRemove(storage.noRetweet);
    console.log("Unblocked user", user(), "from retweeting");
}


// VIEW

function generic_button (state_function, yes_text, no_text, yes_fn, no_fn) {
    // using nodes just to be able to set onclick in a way that works with tampermonkey
    let button = newNode (`
        <button class="btn-on-dark">
        <span class="label">${no_text}</span>
        </button>
        `);
    button.onclick = no_fn;
    if (state_function()) {
        button = newNode (`
        <button class="btn-on-dark">
        <span class="label">${yes_text}</span>
        </button>
        `);
        button.onclick = yes_fn;
    }
    return button;
}

// when a function is passed to state, state will execute the function to get an initial value.
// executing button() will also execute the function
// so i passed a function just to be able to pass arguments to generic_button
let button_block_replies = state(() => generic_button(block_replies, "Unblock replies and retweets", "Block replies and retweets", removeFromBlacklist, addToBlacklist));
let button_media_only = state(() => generic_button(media_only, "Unblock text posts", "Block text posts", removeFromMediaOnly, addToMediaOnly));
let button_no_retweet = state(() => generic_button(no_retweet, "Unblock from retweeting", "Block from retweeting", unblockRetweet, blockRetweet));

let buttons = [button_block_replies, button_media_only, button_no_retweet];

// APP

function add_div_profile () {
    if ( (!profileNode) || profileNode.children.length == 0) return "";
    let link = profileNode.querySelector("a.js-action-url.link-clean").getAttribute("href");
    let user = linkToUsername(link);

    let div = newNode(`<div id='tweetdeck-suite'><div>`)
    let parentNode = profileNode.querySelector("div.prf-actions");
    let childNode = parentNode.querySelector("div.js-social-proof.social-proof-container");
    parentNode.insertBefore(div, childNode);
    return div;
};

function app () {
    let div = document.querySelector("div#tweetdeck-suite");
    if (!div) return;
    initialize_model();
    div.textContent = "";
    buttons.forEach (button => div.append(button()));
}

function initialize_profile () {
    add_div_profile();
    app();
}

// refresh is the app which is a function that sets the content of the div to the view. the app updates by recalling the function
var refresh = app;

new MutationObserver(initialize_profile).observe(profileNode, { childList: true});
