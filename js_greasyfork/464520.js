// ==UserScript==
// @name           Block Promoted Tweets and Stuff
// @name:fr        Bloque les Gazouillis Sponsorisés et Tout Ça
// @namespace      Itsnotlupus Industries
// @match          https://twitter.com/*
// @version        2.0
// @author         Itsnotlupus
// @description    If twitter promotes their tweet, we'll block it, or your money back!
// @description:fr Si twitter promouvois leur gazouillage, on les bloque, ou remboursé!
// @license        MIT
// @match          https://twitter.com/*
// @match          https://platform.twitter.com/*
// @run-at         document-start
// @grant          none
// @require        https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @require        https://greasyfork.org/scripts/472943-itsnotlupus-middleman/code/middleman.js
// @require        https://greasyfork.org/scripts/473998-itsnotlupus-react-tools/code/react-tools.js
// @downloadURL https://update.greasyfork.org/scripts/464520/Block%20Promoted%20Tweets%20and%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/464520/Block%20Promoted%20Tweets%20and%20Stuff.meta.js
// ==/UserScript==

log("This script is deprecated. Please switch to https://greasyfork.org/en/scripts/474045-twitter-prime to continue getting updates.");
// Since the script largely stopped working after Twitter updated their markup, the script below is actually from "Twitter Prime" linked above.
// This means things should continue to "just work", even for people that don't pay attention to their dev tools console logs.

/* jshint esversion:11 */
/* global globalThis, ReactTools, middleMan, decodeEntities, logGroup */

// disable google analytics
(globalThis.unsafeWindow??window).ga = (method, field, details) => {};

// hook into Twitter's React tree, and find a redux store off of one of the components there.
async function withReduxState(fn) {
  const react = new ReactTools();
  const disconnect = react.observe(() => {
    const store = react.getProp('store');
    if (store) {
      fn(store.getState());
      disconnect();
    }
  });
}

withReduxState(state => {
  // we're mutating a redux store. this is widely seen as poor form, as it skips/breaks most of redux' logic.
  Object.assign(state.featureSwitch.user.config, {
    //// The next line prevents the appearance of "get verified" upsell messaging.
    subscriptions_sign_up_enabled: { value: false },
    //// If you uncomment it, the next line unlocks the "Community Notes" UI, giving you some visibility into that process.
    // responsive_web_birdwatch_note_writing_enabled: { value: true },
    //// If you uncomment it, the line below unlocks a way to find live and upcoming Spaces.
    //// The UX is a bit wonky on desktop, which might be why it's hidden. Still, it's neat.
    // voice_rooms_discovery_page_enabled: { value: true },
  });
});

// Twitter doesn't *need* to know what's happening in your browser. They'd like to, but maybe you have a say too.
// The next line means "If you see a network request like this, short-circuit it and return an empty response instead."
middleMan.addHook("https://twitter.com/i/api/1.1/jot/*", { requestHandler: () => new Response() });

// Intercept twitter API calls to use real URLs and remove ads.
middleMan.addHook("https://twitter.com/i/api/graphql/*", { responseHandler: processTwitterJSON });
middleMan.addHook("https://twitter.com/i/api/*.json?*", { responseHandler: processTwitterJSON });
middleMan.addHook("https://cdn.syndication.twimg.com/tweet-result?*", { responseHandler: processTwitterJSON });

async function processTwitterJSON(req, res, err) {

  function unshortenLinks(obj) {
    const map = {};
    // 1st pass: gather associations between t.co and actual URLs
    (function populateURLMap(obj) {
      if (obj.url && obj.expanded_url) map[obj.url] = obj.expanded_url;
      Object.keys(obj).forEach(k => obj[k] && typeof obj[k] == "object" && populateURLMap(obj[k]));
    })(obj);
    // 2d pass: replace (almost) any string that contains a t.co string
    (function replaceURLs(obj) {
      Object.keys(obj).forEach(key => ({
        string() { if (map[obj[key]] && key!=='full_text') obj[key] = map[obj[key]]; },
        object() { if (obj[key] != null) replaceURLs(obj[key]); }
      }[typeof obj[key]]?.()));
    })(obj);
    return obj;
  }

  // Why struggle to remove ads/promoted tweets from X's html tag soup when you can simply remove them from the wire?
  function removeAds(obj) {
    if (obj && typeof obj == 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key]?.content?.itemContent?.promotedMetadata ||
            obj[key]?.item?.itemContent?.promotedMetadata) {
          const { itemContent } = obj[key].content ?? obj[key].item;
          const { name, screen_name } = itemContent.promotedMetadata.advertiser_results?.result?.legacy ?? {};
          const { result = {} } = itemContent.tweet_results;
          const { full_text, id_str } = result.legacy ?? result.tweet?.legacy ?? {};
          const url = `https://twitter.com/${screen_name}/status/${id_str}`;
          logGroup(`[AD REMOVED] @${screen_name} ${url}`, `From ${name}`, decodeEntities(full_text));
          delete obj[key];
        } else {
          removeAds(obj[key]);
        }
      });
    }
    return obj;
  }

  if (err) return;

  return Response.json(removeAds(unshortenLinks(await res.json())), {
    status: res.status,
    headers: res.headers
  });
}
