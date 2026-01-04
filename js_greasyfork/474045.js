// ==UserScript==
// @name        Twitter Prime
// @description Free yourself from X ads and analytics.
// @icon        https://abs.twimg.com/favicons/twitter.2.ico
// @namespace   Itsnotlupus Industries
// @author      itsnotlupus
// @license     MIT
// @version     1.5
// @match       https://twitter.com/*
// @match       https://platform.twitter.com/*
// @match       https://x.com/*
// @match       https://platform.x.com/*
// @run-at      document-start
// @require     https://update.greasyfork.org/scripts/468394/1247001/utils.js
// @require     https://update.greasyfork.org/scripts/472943/1320613/middleman.js
// @require     https://update.greasyfork.org/scripts/473998/1246974/react-tools.js
// @downloadURL https://update.greasyfork.org/scripts/474045/Twitter%20Prime.user.js
// @updateURL https://update.greasyfork.org/scripts/474045/Twitter%20Prime.meta.js
// ==/UserScript==
/* jshint esversion:11 */
/* eslint-env es2020 */
/* global ReactTools, middleMan, traverse, decodeEntities, logGroup, log */

// NOTE: You can edit the following config flags to taste.
const CONFIG = {
  // This setting hides upsell, subscriptions, grok and super follow nonsense.
  hide_upselling: true,
  // When set to true, this setting will show a "Community Notes" tab.
  show_community_notes_tag: false,
  // When set to true, this settings will show a "Spaces" tab to find Spaces to listen to.
  // The UX is a bit wonky on desktop, which might be why it's hidden. Still, it's neat.
  show_spaces_tab: false
};

// Apply our config settings to a Twitter user config object.
function applyConfigOverrides(obj) {
  // disable any config key that has a whiff of monetization
  Object.keys(obj.config).forEach(key => key.match(/_upsell|subscriptions_|super_follow/) && (obj.config[key] = { value: !CONFIG.hide_upselling }));

  // I use this to browse for new relevant config values, sometimes.
  // const logConfig = Object.assign({},obj.config);
  // Object.keys(logConfig).forEach(key => key.match(/_upsell|subscriptions_|super_follow/) || (logConfig[key].value == false) && (delete logConfig[key]));
  // log("Twitter Config", logConfig);

  // other optional fun config tweaks
  return Object.assign(obj.config, {
    responsive_web_birdwatch_note_writing_enabled: { value: CONFIG.show_community_notes_tag },
    voice_rooms_discovery_page_enabled: { value: CONFIG.show_spaces_tab },
  });
}

// Replace t.co shortened links with real URLs
function unshortenLinks(obj) {
  const map = {};
  // 1st pass: gather associations between t.co and actual URLs
  traverse(obj, (obj) => {
    if (obj && obj.url && obj.expanded_url) map[obj.url] = obj.expanded_url;
  });
  // 2d pass: replace (almost) any string that contains a t.co URL
  traverse(obj, (str, parent, key) => {
    if (typeof str == 'string' && map[str] && key !== 'full_text') parent[key] = map[str];
  });
  return obj;
}

// Log removed ads to the console, for the curious cats among us.
function logAd(obj) {
  const { itemContent } = obj.content ?? obj.item;
  const { name, screen_name } = itemContent.promotedMetadata.advertiser_results?.result?.legacy ?? {};
  const { result = {} } = itemContent.tweet_results;
  const { full_text, id_str } = result.legacy ?? result.tweet?.legacy ?? {};
  const url = `https://twitter.com/${screen_name}/status/${id_str}`;
  logGroup(`[AD REMOVED] @${screen_name} ${url}`, `From ${name}`, decodeEntities(full_text));
}

// Why struggle to remove ads/promoted tweets from X's html tag soup when you can simply remove them from the wire?
function removeAds(obj) {
  traverse(obj, (obj, parent, key) => {
    if (obj && (obj.content ?? obj.item)?.itemContent?.promotedMetadata) {
      logAd(obj);
      delete parent[key];
      return false;
    }
  });
  return obj;
}

// Twitter has degraded and currently loads tweets from users that blocked you when looking at the timeline of someone who replied to those tweets.
// This attempts to prevent the blocked tweets from getting tombstoned when expanding them.
function avoidTombstonePayloads(obj) {
  log("avoidTombstonePayloads", obj);
  if (obj?.data?.threaded_conversation_with_injections_v2?.instructions?.[0]?.entries?.[0]?.content?.itemContent?.tweet_results?.result?.tombstone) {
    // still a bit too brutal, doesn't allow replies to load. XXX
    // we might need to store items fetched previously and inject them in instructions payload to replace tombstones instead of simply deleting them.
    obj?.data?.threaded_conversation_with_injections_v2?.instructions.shift();
  }
  return obj;
}

function expandAllTweets(obj) {
  return obj; // doesn't work well enough to enable by default.
  log("expandAllTweets", obj);
  traverse(obj, (obj, parent, key) => {
    if (obj && obj.note_tweet?.is_expandable && obj.note_tweet?.note_tweet_results?.result?.text) {
      obj.full_text = obj.note_tweet.note_tweet_results.result.text;
      obj.legacy.full_text = obj.full_text;
      obj.legacy.display_text_range[1] = obj.full_text.length;
      delete obj.note_tweet;
      log("Replaced full tweet:", obj.full_text);
      // doesn't fully work XXX. the twitter frontend truncates at around 500-650 characters anyway.
    }
  });
  return obj;
}

// Middleman response handler generator. Just add a json editing function.
function transformResponse(transform) {
  return async (req, res, err) => {
    if (err) return;

    return Response.json(transform(await res.json()), {
      status: res.status,
      headers: res.headers
    });
  };
}

function main() {
  // Disable google analytics
  (globalThis.unsafeWindow??window).ga = (method, field, details) => {};

  // Mutate Twitter's redux store. This is widely seen as poor form, as it skips/breaks most of redux' logic.
  ReactTools.withReduxState(state => applyConfigOverrides(state.featureSwitch.user));

  // Intercept requests that would invalidate our config flags
  const processSettings = transformResponse(applyConfigOverrides);
  middleMan.addHook("https://api.twitter.com/1.1/help/settings.json?*", { responseHandler: processSettings });

  // Intercept twitter API calls to use real URLs and remove ads.
  const processTwitterJSON = transformResponse(obj => removeAds(unshortenLinks(obj)));
  middleMan.addHook("https://twitter.com/i/api/graphql/*", { responseHandler: processTwitterJSON });
  middleMan.addHook("https://twitter.com/i/api/*.json?*", { responseHandler: processTwitterJSON });
  middleMan.addHook("https://cdn.syndication.twimg.com/tweet-result?*", { responseHandler: processTwitterJSON });

  // Twitter doesn't *need* to know what's happening in your browser. They'd like to, but maybe you have a say too.
  // The next line means "If you see a network request like this, short-circuit it and return an empty response instead."
  middleMan.addHook("https://twitter.com/i/api/1.1/jot/*", { requestHandler: () => new Response() });

  // Don't bother loading tombstones. Things work "better" without them.
  const showBlockedTweetsSometimes = transformResponse(avoidTombstonePayloads);
  middleMan.addHook("https://twitter.com/i/api/graphql/*/TweetDetail?*", { responseHandler: showBlockedTweetsSometimes });

  // Attempt to auto expand tweets by default. Not currently working.
  middleMan.addHook("https://twitter.com/i/api/graphql/*/TweetDetail?*", { responseHandler: transformResponse(expandAllTweets) });
}

main();