// ==UserScript==
// @name         [Lemmy] Sort Posts, Comments, Communities & Search
// @include      /^https:\/\/lemmy(?:[^.]+)?\./
// @include      /^https:\/\/feddit\./
// @match        https://aussie.zone/*
// @match        https://beehaw.org/*
// @match        https://discuss.tchncs.de/*
// @match        https://hexbear.net/*
// @match        https://infosec.pub/*
// @match        https://jlai.lu/*
// @match        https://midwest.social/*
// @match        https://programming.dev/*
// @match        https://reddthat.com/*
// @match        https://sh.itjust.works/*
// @match        https://slrpnk.net/*
// @match        https://sopuli.xyz/*
// @noframes
// @run-at       document-start
// @inject-into  page
// @grant        GM_deleteValue
// @grant        GM_getValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @namespace    Violentmonkey Scripts
// @author       SedapnyaTidur
// @version      1.0.9
// @license      MIT
// @revision     1/15/2025, 5:00:00 AM
// @description  Sort Lemmy posts, comments, communities & search. Reload the webpage after changing the sort type in menu to take effect. To make this script runnable, the CSP for the website must be disabled/modified/removed using an addon.
// @downloadURL https://update.greasyfork.org/scripts/546301/%5BLemmy%5D%20Sort%20Posts%2C%20Comments%2C%20Communities%20%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/546301/%5BLemmy%5D%20Sort%20Posts%2C%20Comments%2C%20Communities%20%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const posts = {
    Hot: 'Hot',
    Active: 'Active',
    Scaled: 'Scaled',
    Controversial: 'Controversial',
    New: 'New',
    Old: 'Old',
    MostComments: 'Most Comments',
    NewComments: 'New Comments',
    TopHour: 'Top Hour',
    TopSixHour: 'Top 6 Hours',
    TopTwelveHour: 'Top 12 Hours',
    TopDay: 'Top Day',
    TopWeek: 'Top Week',
    TopMonth: 'Top Month',
    TopThreeMonths: 'Top 3 Months',
    TopSixMonths: 'Top 6 Months',
    TopNineMonths: 'Top 9 Months',
    TopYear: 'Top Year',
    TopAll: 'Top All Time'
  };
  const comments = ['Hot', 'Top', 'Controversial', 'New', 'Old'];

  // Based on the keys of "posts" above and not the values for posts, communities & search.
  const defaults = {
    posts: 'Active',
    comments: 'Hot',
    communities: 'TopMonth',
    search: 'TopAll'
  };

  //https://lemmy.ml/?dataType=Post&listingType=Subscribed&sort=New
  //https://lemmy.world/comment/2421890?sort=New

  const window = unsafeWindow;
  let { postsSortBy, commentsSortBy, communitiesSortBy, searchSortBy, hideSettings } = GM_getValues({
    postsSortBy: defaults.posts,
    commentsSortBy: defaults.comments,
    communitiesSortBy: defaults.communities,
    searchSortBy: defaults.search,
    hideSettings: true
  });

  const configs = [{
    path: /^\/(?:$|c\/)/,
    defaultSort: defaults.posts,
    sort: function() { return postsSortBy; }
  }, {
    path: /^\/(?:comment|post)\//,
    defaultSort: defaults.comments,
    sort: function() { return commentsSortBy; }
  }, {
    path: /^\/communities/,
    defaultSort: defaults.communities,
    sort: function() { return communitiesSortBy; }
  }, {
    path: /^\/search/,
    defaultSort: defaults.search,
    sort: function() { return searchSortBy; }
  }];

  const redirect = function() {
    const location = window.location;
    // For URL like this "https://lemmy.ca/search?" remove the "?" at the end and window.location.search is empty.
    const href = location.href.replace(/([^=])\?+$/, '$1');
    const path = location.pathname;
    const search = location.search;
    const reload = (window.performance?.getEntriesByType('navigation')[0]?.type === 'reload' || false);

    // May redirect to a different URL for the first visit.
    for (const config of configs) {
      if (config.path.test(path)) {
        if (!search) { //window.location.search is empty.
          if (config.sort() !== config.defaultSort) {
            window.stop();
            location.replace(href + `?sort=${config.sort()}`);
            return true;
          }
        } else if (/[?&]sort=[^&]+/.test(search)) {
          if (!reload && !search.includes(`sort=${config.sort()}`)) {
            window.stop();
            location.replace(href.replace(/(.)sort=[^&]+/, `$1sort=${config.sort()}`));
            return true;
          }
        } else {
          window.stop();
          location.replace(href + `&sort=${config.sort()}`);
          return true;
        }
      }
    }
    return false;
  };

  if (redirect()) return;

  let attrObserver, currURL = window.location.href;
  let searchInterval, searchTimeout, scrollInterval = 0, scrollTimeout = 0, startInterval, startTimeout;
  const maxScrollHistory = 10, scrolls = [];
  let popstate = false, scrollIndex = 0, scrollAmountForPost = 0;
  const scrollTargets = [{
    path: /^\/$/,
    query: ':scope > div#root > div > main > div > div > div > div > div.main-content-wrapper > div > :is(div[class*="post-listings"],ul[class*="comments"]) > :is(div[class*="post-listing"],li[class*="comment"]) > :first-child'
  }, {
    path: /^\/c\//,
    query: ':scope > div#root > div > main > div > div > div > div > div.post-listings:has(> div.post-listing > :first-child, > div:not([class]))'
  }, {
    path: /^\/post\//,
    query: ':scope > div#root > div > main > div > div > div > div > div:not([class])'
  }, {
    path: /^\/communities/,
    query: ':scope > div#root > div > main > div > div > div > div.table-responsive > table > :first-child'
  }, {
    path: /^\/search/,
    query: ':scope > div#root > div > main > div > div > h3'
  }, {
    path: /^\/modlog/,
    query: ':scope > div#root > div > main > div > div > div.table-responsive > table > :first-child'
  }, {
    path: /^\/instances/,
    query: ':scope > div#root > div > main > div > div > div > div > div > div > div.active > div.table-responsive > table > :first-child'
  }];

  const saveScroll = function(href, scrollY) {
    if (scrollIndex === (maxScrollHistory << 1)) scrollIndex = 0;
    scrolls[scrollIndex++] = href;
    scrolls[scrollIndex++] = scrollY;
  };

  // Cycle through the array reversely.
  const getScroll = function(scrollY = 0) {
    for (let i = Math.max(0, scrollIndex - 4), n = 0; n < scrolls.length; i = (scrolls.length + (i - 2)) % scrolls.length, n += 2) {
      if (scrolls[i] === window.location.href) return scrolls[i + 1];
    } return scrollY;
  };

  // "inject-into page" is a must for this to work.
  const pushState_ = window.History.prototype.pushState;
  window.History.prototype.pushState = function(state, unused, url) {
    saveScroll(window.location.href, window.scrollY);
    popstate = false;

    const location = new URL(url, window.location.href);
    const href = location.href;
    const path = location.pathname;
    const search = location.search;

    for (const config of configs) {
      if (config.path.test(path)) {
        if (!search) { // Consume if window.location.search is empty.
          if (config.sort() !== config.defaultSort) {
            arguments[2] = href + `?sort=${config.sort()}`;
          }
        } else if (!/[?&]sort=[^&]+/.test(search)) { // So that users can change to different sort types.
          arguments[2] = href + `&sort=${config.sort()}`;
        }
        // Avoid duplicate URLs in history when clicking the top-left icon/label.
        if(url === window.location.href && window.location.pathname === '/') return window.history.go(0);
        break;
      }
    }
    return pushState_.apply(this, arguments);
  };

  // There is no back/forward button listeners, so this is the best we could do.
  // onpopstate() is null when the document is not ready, that is why we use addEventListener().
  window.addEventListener('popstate', function(event) {
    saveScroll(currURL, window.scrollY); // Return from/to.
    popstate = true;
    window.clearInterval(scrollInterval);
    window.clearTimeout(scrollTimeout);
    scrollInterval = scrollTimeout = 0;
  }, true);

  // So many trash make the device runs like a snail.
  const setItem_ = window.Object.getPrototypeOf(window.sessionStorage).setItem;
  window.Object.getPrototypeOf(window.sessionStorage).setItem = function(keyName, keyValue) {
    if(keyName.startsWith('scrollPosition')) return;
    return setItem_.apply(this, arguments);
  };

  // Took me like forever to fix this. Imagine from v1.0.1 to v1.0.6. Not perfect but good enough.
  const scrollTo_ = window.scrollTo;
  window.scrollTo = function(xCoord_options, yCoord) {
    window.clearInterval(scrollInterval); // These two can't be called in reset() because the MutationObserver is triggered a bit late.
    window.clearTimeout(scrollTimeout);

    if (!/^\/(?:$|c\/|post\/|communities|search|modlog|instances)/.test(window.location.pathname)) return;
    if (!popstate && window.location.pathname.startsWith('/post/')) return;

    const query = scrollTargets.find(({path}) => path.test(window.location.pathname))?.query;
    if (!query) return;

    scrollTimeout = window.setTimeout(() => {
      window.clearInterval(scrollInterval);
    }, 60000);

    scrollInterval = window.setInterval(args => {
      if (!document.body.querySelector(query)) return; // Wait until the page is completely ready/loaded.
      window.clearInterval(scrollInterval);
      window.clearTimeout(scrollTimeout);
      scrollInterval = scrollTimeout = 0;
      if (typeof xCoord_options === 'object' && xCoord_options !== null) {
        args[0].top = getScroll(xCoord_options.top);
      } else {
        args[1] = getScroll(yCoord);
      }
      scrollTo_.apply(this, args);
    }, 500, arguments);
  };

  // Dirty trick to make the visited posts highlighted via a style a:visited.
  // I have this filter in my uBlock Origin:
  // *##:root a:visited:style(color: rgb(218,112,214) !important; font-weight: 900 !important;)
  const changeLinks = function(searchQuery, sort, defaultSort) {
    searchTimeout = window.setTimeout(() => {
      window.clearInterval(searchInterval);
    }, 60000);

    searchInterval = window.setInterval(() => {
      const anchors = document.body.querySelectorAll(searchQuery);
      if (anchors.length < 6) return;
      window.clearInterval(searchInterval);
      window.clearTimeout(searchTimeout);
      searchInterval = searchTimeout = 0;

      anchors.forEach((anchor, index) => {
        const href = anchor.href; // Complete URL.
        const search = href.replace(/^[^?]+/, '');

        if (!search) {
          if (sort !== defaultSort) {
            anchor.href = href + `?sort=${sort}`;
          }
        } else if (!/[?&]sort=[^&]+/.test(search)) {
          anchor.href = href + `&sort=${sort}`;
        }
        if (index === 0) { // May get overriden by Lemmy.
          attrObserver = new MutationObserver(() => {
            attrObserver.disconnect();
            changeLinks(searchQuery, sort, defaultSort);
          });
          attrObserver.observe(anchor, { attributes: true });
        }
      });
    }, 500);
  };

  const reset = function() {
    window.clearInterval(searchInterval);
    window.clearTimeout(searchTimeout);
    if (attrObserver) {
      attrObserver.disconnect();
      attrObserver = undefined;
    }
    searchInterval = searchTimeout = 0;
  };

  const start = function() {
    startTimeout = window.setTimeout(() => {
      window.clearInterval(startInterval);
    }, 10000);

    startInterval = window.setInterval(() => {
      if (!document.head) return;
      window.clearInterval(startInterval);
      window.clearTimeout(startTimeout);
      new MutationObserver(mutations => mutations.some(({addedNodes}) => {
        for (const node of addedNodes) {
          if (node instanceof HTMLLinkElement && node.rel === 'canonical' && window.location.href !== currURL) {
            currURL = window.location.href;
            reset();
            if (/^\/(?:$|c\/|search)/.test(window.location.pathname)) {
              changeLinks('a[href^="/post/"]', commentsSortBy, defaults.comments);
            } else if (window.location.pathname.startsWith('/communities')) {
              changeLinks('a[href^="/c/"]', postsSortBy, defaults.posts);
            }
            return true;
          }
        }
      })).observe(document.head, { childList: true });
    }, 500);

    // Change visited links for the first time or reload.
    if (/^\/(?:$|c\/|search)/.test(window.location.pathname)) {
      changeLinks('a[href^="/post/"]', commentsSortBy, defaults.comments);
    } else if (window.location.pathname.startsWith('/communities')) {
      changeLinks('a[href^="/c/"]', postsSortBy, defaults.posts);
    }
  };

  start();

  const next = function(array, startIndex, sortBy) {
    for (let i = startIndex; i < array.length; ++i) {
      if (array[i] === sortBy) {
        if (i === array.length - 1) return array[startIndex];
        return array[i + 1];
      }
    }
  };

  const menu = [{
    title: 'Posts: 《{}》',
    options: { id: '0', autoClose: false, title: 'Click to change the posts sort type.' },
    init: function() {
      this.title_ = this.title.replace('{}', posts[postsSortBy]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      postsSortBy = next(Object.keys(posts), 0, postsSortBy);
      GM_setValue('postsSortBy', postsSortBy);
      menu[0].title_ = menu[0].title.replace('{}', posts[postsSortBy]);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Comments: 《{}》',
    options: { id: '1', autoClose: false, title: 'Click to change the comments sort type.' },
    init: function() {
      this.title_ = this.title.replace('{}', commentsSortBy);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      commentsSortBy = next(comments, 0, commentsSortBy);
      GM_setValue('commentsSortBy', commentsSortBy);
      menu[1].title_ = menu[1].title.replace('{}', commentsSortBy);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Communities: 《{}》',
    options: { id: '2', autoClose: false, title: 'Click to change the communities sort type.' },
    init: function() {
      this.title_ = this.title.replace('{}', posts[communitiesSortBy]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      communitiesSortBy = next(Object.keys(posts), 0, communitiesSortBy);
      GM_setValue('communitiesSortBy', communitiesSortBy);
      menu[2].title_ = menu[2].title.replace('{}', posts[communitiesSortBy]);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Search: 《{}》',
    options: { id: '3', autoClose: false, title: 'Click to change the search sort type.' },
    init: function() {
      this.title_ = this.title.replace('{}', posts[searchSortBy]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      searchSortBy = next(Object.keys(posts), 3, searchSortBy);
      GM_setValue('searchSortBy', searchSortBy);
      menu[3].title_ = menu[3].title.replace('{}', posts[searchSortBy]);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: '{} Settings',
    choices: [ 'Show', 'Hide' ],
    options: { id: '4', autoClose: false, title: 'Click to show or hide settings.' },
    init: function() {
      this.title_ = this.title.replace('{}', this.choices[Number(!hideSettings)]);
      this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      hideSettings = !hideSettings;
      GM_setValue('hideSettings', hideSettings);
      menu[4].title_ = menu[4].title.replace('{}', menu[4].choices[Number(!hideSettings)]);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = (hideSettings) ? menu.length - 1 : 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init()];
})();
