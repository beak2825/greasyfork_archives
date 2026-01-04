// ==UserScript==
// @name        Quicklink Loader
// @icon        https://getquick.link/assets/images/icons/favicon-32x32.png
// @match       *://*/*
// @exclude     *://github.com/*
// @exclude     *://gitlab.com/*
// @exclude     *://pairdrop.net/*
// @exclude     *://snapdrop.net/*
// @exclude     *://search.*/*
// @exclude     *://mail.*/*
// @exclude     *://calendar.*/*
// @exclude     *://drive.*/*
// @exclude     *://messages.*/*
// @exclude     *://*bank*/*
// @grant       none
// @version     1.1.4
// @author      NoUser
// @description Quicklink is a JavaScript library that speeds up subsequent page loads by intelligently prefetching resources. This userscript adds Quicklink to every webpage, preloading links that the user is likely to click. By prefetching these resources, the next page loads faster, improving the overall browsing experience.
// @namespace   https://greasyfork.org/en/scripts/459274-quicklink-loader
// @homepage    https://greasyfork.org/en/scripts/459274-quicklink-loader
// @require     https://cdnjs.cloudflare.com/ajax/libs/quicklink/2.3.0/quicklink.umd.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459274/Quicklink%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/459274/Quicklink%20Loader.meta.js
// ==/UserScript==

// Test on
// https://mini-ecomm.glitch.me/

const ignore = [
  // Ignore all api urls
  /\/api\/?/,
  /^api\./,
  // Ignore login/signup urls
  /\/(sign|log)\/?/,
  // Ignore "Premium" stuffs
  /^https?:\/\/.+\/(.+)?premium/,
  // Ignore urls that contain the word "video"
  uri => uri.includes('video'),
  // Don't prefetch links with dom selectors
  uri => uri.includes('#'),
  // Don't prefetch socials
  uri => ['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'youtubeeducation.com', 'discord.com', 'discordapp.com', 'facebook.com', 'facebook.net', 'pin.it', 'pinimg.com', 'pinterest.com', 'redd.it', 'reddit.com', 'redditmedia.com', 'tiktok.com', 'twitter.com', 'twimg.com', 't.co'].some(soc => uri.includes(soc)),
  // Don't prefetch these file types and extensions
  uri => /\.(zip|tar|7z|rar|js|apk|xapk|woff2|tff|otf|pdf|mp3|mp4|wav|exe|msi|bat|deb|rpm|bin|dmg|iso|csv|log|sql|xml|key|odp|ods|pps|ppt|xls|doc|jpg|jpeg|jpe|jif|jfif|jfi|png|gif|webp|tif|psd|raw|arw|cr2|nrw|k25|bmp|dib|heif|heic|ind|indd|indt|jp2|j2k|jpf|jpx|jpm|mj2|svg|ai|eps)$/i.test(uri),
  // Don't prefetch these protocols
  uri => /^(http|file|ftp|mailto|tel):/i.test(uri),
  // Ignore all links, scripts which has explicit noprefetch
  (uri, elem) => elem.hasAttribute('noprefetch'),
];

quicklink.listen({ origins: true, limit: 15, delay: 2000, ignores: ignore });