// ==UserScript==
// @name         LibReddit Dark Theme & LibReddit Settings Changer
// @namespace    https://violentmonkey.github.io/
// @version      1.9
// @description  Change the default Libreddit theme to Black, and set other preferences more convenient than on Reddit
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAAA5FBMVEUfHx////8B//8jHSM7Ozvp6ekiIiIALzAfHyEaGhohHiFhYWGcnJwMpKUd9fUL//4fIB0V9/Q41M0ATEQFKCN0dHQTJSUlmZukpKQcIR8f1dUCSEkWIiIHJyUfIBsAUlAyv78j7vUALDInlp4fICccIx8AMiwmHCEf1NcDR0sYICQjHxkhIRUpHBcfIxtCQkIAIS8yMjInaWkzfIgMOkYZLTI56+od6/VLys0QqqQA9/4Nppki9ekJ//YW4OVBuLQNSVIKJTIkJC8ASVQogX88ur9Kn5sQIx8APDwAQUELHyTLy8tHGpacAAADIUlEQVR4nO3cf1PaMBzH8Qw0pJmWgFqptHUixVJ/zjmnbk4252Ts+T+fJVh3gEJpNbT1Pu9/vOtx+rrvRdpyDYQghBBCCCGEEEIIIYTQXDFZ1obE5QItRLLX54Cs0I5jzV0YhgswGfTZ5PFHtG21WpWWrCKLfkyrdXISEkZsW6uZko8rjedaaWw8mIV1uru5+9jm7HY/nX22GddKVujj5XfP13gwk9bq+c6XnShzducXTdfhZa6XPQe6clkrXalK8Zn17fVQorWaJXppGnpl+ALb73z9dl2dAxyh3bDNdK9pGoP27xX6OhlaK3ketDOc9MioqzOqSTRjfG8vW7SdDL217RoKrXVVx6EZ8TuXtbElHTtpwsplneZYtHzzqqya8/4flszhpDNGc/nnE6MJKRi6XkR0kA80S45mms+JQAMN9NtFc60Xeq+NlmdEoU7+hUPbRPNdoga04RcMra6n1X1lrtGTN7tmfc1lwtN9N54aXa2a378HQbA1WnDTHHDh5XbS8tbqtNfrNkfrdnuDNhdRuUQHvR8/Q2e0MAzb8rySX3TJvLiVaHs8om4rhedpJL9o0mZwOyg/TjXK8zz1W/f384tuupM27+BAHTk81Eh+2fLY2l73JtAi7+hafW39ySLQuix0oRcS0EADDTTQQAMNNNBAAw000EADDTTQQAMNNNBAAw000EADDXRyNAca6CloUkg0LyKacLXh7OnOsqsr8zyvaOF5xP11d3f3YSJ55OZ35z6vaGF1+v2zPxN1z/r9/r2/kGdSEqKHT1JRyxoMrIE7ltqaKs16nwpLix6qKTVYKBt9kI1zQQQxcjjp4fo48o6OPNZut9lIttq2zDPabR2LFpIsU+j/akrVNkn1PHo26tjlIUft+77NImLEpI4jD+jeAJweLYRaxRMzjdDZvHnMQjeMNBGDjO0/XzD670aa6Pju+UWjU7W8lO2k06GPSREnTYEG+o2htTCBBhpooIEGGmiggQY6BVrPNfQYevoXoqVDHxv60Ybx+h8h6I/S968aXQSa0FSffs34VAwhhBBCCCGEEEIIIYQQKkT/AMjqwT28TZzjAAAAAElFTkSuQmCC
// @match        https://redlib.freedit.eu/*
// @match        https://discuss.whatever.social/*
// @match        https://l.opnxng.com/*
// @match        https://libreddit.bus-hit.me/*
// @match        https://libreddit.kylrth.com/*
// @match        https://libreddit.lunar.icu/*
// @match        https://libreddit.northboot.xyz/*
// @match        https://libreddit.oxymagnesium.com/*
// @match        https://libreddit.privacydev.net/*
// @match        https://libreddit.projectsegfau.lt/*
// @match        https://libreddit.pussthecat.org/*
// @match        https://libreddit.strongthany.cc/*
// @match        https://libreddit.tux.pizza/*
// @match        https://libreddit.miaoute.net/*
// @match        https://lr.artemislena.eu/*
// @match        https://lr.n8pjl.ca/*
// @match        https://lr.ggtyler.dev/*
// @match        https://reddit.invak.id/*
// @match        https://reddit.simo.sh/*
// @match        https://reddit.owo.si/*
// @match        https://reddit.nerdvpn.de/*
// @match        https://reddit.idevicehacked.com/*
// @match        https://safereddit.com/*
// @match        https://snoo.habedieeh.re/*
// @match        https://redlib.catsarch.com/*
// @match        https://redlib.ducks.party/*
// @match        https://redlib.seasi.dev/*
// @match        https://redlib.tux.pizza/*
// @match        https://redlib.vimmer.dev/*
// @match        https://redlib.xn--hackerhhle-kcb.org/*
// @match        https://redlib.privacyredirect.com/*
// @match        https://redlib.kittywi.re/*
// @match        https://redlib.baczek.me/*
// @match        https://redlib.frontendfriendly.xyz/*
// @match        https://redlib.incogniweb.net/*
// @match        https://redlib.nirn.quest/*
// @match        https://redlib.nohost.network/*
// @match        https://redlib.privacy.com.de/*
// @match        https://redlib.private.coffee/*
// @match        https://red.artemislena.eu/*
// @match        https://red.ngn.tf/*
// @match        https://red.arancia.click/*
// @match        https://rl.bloat.cat/*
// @match        https://rl.rootdo.com/*
// @match        https://r.darrennathanael.com/*
// @match        https://redlib.nadeko.net/*
// @match        https://redlib.pussthecat.org/*
// @match        https://i.opnxng.com/*
// @match        https://td.vern.cc/*
// @match        https://teddit.laserdisc.tokyo/*
// @match        https://teddit.projectsegfau.lt/*
// @match        https://teddit.pussthecat.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465206/LibReddit%20Dark%20Theme%20%20LibReddit%20Settings%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/465206/LibReddit%20Dark%20Theme%20%20LibReddit%20Settings%20Changer.meta.js
// ==/UserScript==

// Set a preference of your choice among the available options. Settings will be saved in browser cookies.
// Theme: black, dark, doomone, dracula, gold, gruvboxdark, gruvboxlight, laserwave, light, nord, rosebox, tokyoNight, violet
   var theme = 'black';

// Remove default feeds: on, off
   var remove_default_feeds = 'off';

// Front page: default, popular, all
   var front_page = 'default';

// Layout: card, clean, compact
   var layout = 'card';

// Wide UI: on, off
   var wide = 'off';

// Video quality: best, medium, worst
   var video_quality = 'best';

// Default subreddit post sort: hot, new, top, rising, controversial
   var post_sort = 'hot';

// Default comment sort: confidence, top, new, controversial, old
   var comment_sort = 'confidence';

// Blur spoiler previews: on, off
   var blur_spoiler = 'off';

// Show NSFW posts: on, off
   var show_nsfw = 'on';

// Blur NSFW previews: on, off
   var blur_nsfw = 'off';

// Autoplay videos: on, off
   var autoplay_videos = 'off';

// Use HLS for videos: on, off
// Reddit videos require JavaScript (via HLS.js) to be enabled to be played with audio. Therefore, this toggle lets you either use Libreddit JS-free or utilize this feature.
   var use_hls = 'on';

// Hide notification about possible HLS usage: on, off
   var hide_hls_notification = 'on';

// Hide awards: on, off
   var hide_awards = 'on';

// Keep navbar fixed: on, off
   var fixed_navbar = 'off';

// Hide the summary and sidebar: on, off
   var hide_sidebar_and_summary = 'off';

// Hide score: on, off
   var hide_score = 'off';

// Do not confirm before visiting content on Reddit: on, off
   var disable_visit_reddit_confirmation = 'on';

// Subscriptions: ?
   var subscriptions = '';

// Filters: ?
   var filters = '';

// Set the value of custom settings as activated, so that the script works properly
   var user_settings = 'activated';

// A Function to Set a Cookie
function setCookie(cName, cValue) {
  const domain = "domain=" + window.location.hostname;
  document.cookie = cName + "=" + cValue + ";" + domain + ";";
}

// A Function to Get a Cookie
function getCookie(cName) {
  let Name = cName + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(Name) == 0) {
      return c.substring(Name.length, c.length);
    }
  }
  return "";
}

// A Function that Checks if a Cookie is set
function checkCookie() {
  let user = getCookie("user_settings");
  if (user != "") {
 // Remember to open the console (Press F12)
    console.error("Сookies with custom user settings are set!");
  } else {
 // Apply setCookie
    setCookie('theme', theme);
    setCookie('remove_default_feeds', remove_default_feeds);
    setCookie('theme', theme);
    setCookie('front_page', front_page);
    setCookie('layout', layout);
    setCookie('wide', wide);
    setCookie('video_quality', video_quality);
    setCookie('post_sort', post_sort);
    setCookie('comment_sort', comment_sort);
    setCookie('blur_spoiler', blur_spoiler);
    setCookie('show_nsfw', show_nsfw);
    setCookie('blur_nsfw', blur_nsfw);
    setCookie('autoplay_videos', autoplay_videos);
    setCookie('use_hls', use_hls);
    setCookie('hide_hls_notification', hide_hls_notification);
    setCookie('hide_awards', hide_awards);
    setCookie('fixed_navbar', fixed_navbar);
    setCookie('hide_sidebar_and_summary', hide_sidebar_and_summary);
    setCookie('hide_score', hide_score);
    setCookie('disable_visit_reddit_confirmation', disable_visit_reddit_confirmation);
    setCookie('subscriptions', subscriptions);
    setCookie('filters', filters);
    setCookie('user_settings', user_settings);
    location.reload();
  }
}

// Check if Сookies are set and if not, set a Сookie with custom user settings
checkCookie();