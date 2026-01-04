// ==UserScript==
// @license        GNU GPLv3
// @name           Revert X Embed back to Twitter Embed
// @name:fr        Nom et logo originaux de Twitter sur les embeds (contenus externes embarqués)
// @name:es        Revertir X a Twitter en los Tweets insertados
// @namespace      https://github.com/CatmanFan/Revert-X-to-Twitter-Embed/
// @icon           https://www.iconarchive.com/download/i76545/xenatt/minimalism/App-Twitter.256.png
// @author         Mr._Lechkar / CatmanFan
// @description    Replaces X references in the Twitter/X embed with the original Twitter ones.
// @description:fr Modifier les embeds (contenus externes embarqués) de Twitter/X en replaçant les références à X par les originales de Twitter (par exemple, « Poster sur X » devient désormais « Tweeter sur Twitter »).
// @description:es Reemplazar el logotipo de X y sus otras referencias en los Tweets insertados (embeds) por las originales de Twitter.
// @version        0.35
// @match          https://platform.twitter.com/embed/Tweet.html
// @match          https://platform.twitter.com/embed/Tweet.html*
// @match          https://platform.x.com/embed/Tweet.html
// @match          https://platform.x.com/embed/Tweet.html*
// @match          https://platform.twitter.com/embed/index.html
// @match          https://platform.twitter.com/embed/index.html*
// @match          https://platform.x.com/embed/index.html
// @match          https://platform.x.com/embed/index.html*
// @match          https://syndication.twitter.com/*
// @match          https://syndication.x.com/*
// @run-at         document-start
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481893/Revert%20X%20Embed%20back%20to%20Twitter%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/481893/Revert%20X%20Embed%20back%20to%20Twitter%20Embed.meta.js
// ==/UserScript==


// Original color (copied from Yakisova's X to Twitter userscript)
GM_addStyle(`
svg.r-18jsvk2 {
	color: rgb(29, 155, 240);
}
`);

// Original bird (copied from Yakisova's X to Twitter userscript)
var birdPath = 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z';
const xPath = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'

// Check for "X"/"post" string and return reverted, function
function revertString(item) {
    var string = item;

    // Other languages
    switch (document.getElementsByTagName('html')[0].getAttribute('lang'))
    {
        case "ru":
            if (string.includes(" пост"))  { string = string.replace(" пост", " твит"); }
            break;
        case "uk":
            if (string.includes(" пост"))  { string = string.replace(" пост", " твіт"); }
            break;
        case "de":
            if (string.includes("Post"))  { string = string.replace("Post", "Tweet"); }
            break;
        case "pl":
            if (string.includes("wpis"))  { string = string.replace("wpis", "Tweet"); }
            break;
        case "ro":
            string = string.replace("această postare", "acest Tweet");
            string = string.replace("postare", "Tweet");
            break;
        case "fi":
            string = string.replace("julkaisusta", "twiitistä");
            string = string.replace("julkaisuun", "twiittiin");
            string = string.replace("julkaisu", "twiitti");
            break;
        case "tr":
            string = string.replace("Gönderinin", "Tweet'in");
            string = string.replace("gönderiyi", "Tweet'i");
            if (string.includes("gönderi"))  { string = string.replace("gönderi", "Tweet"); }
            if (string.includes("Gönderi"))  { string = string.replace("Gönderi", "Tweet"); }
            break;
        case "ar": // Broken currently, so it is unimplemented
            // string = string.replace(" X", " تويتر");
            // string = string.replace("هذا المنشور", "هذه التغريدة");
            // if (string.includes("المنشور"))  { window.alert(string); string = string.replace("منشور", "تغريدة"); }
            break;
        case "ko":
            string = string.replace("게시물", "트윗에");
            string = string.replace("게시", "트윗");
            break;
        case "ja":
            string = string.replace("ポスト", "ツイート");
            break;
    }

    // Copy link
    if (string == "Copy link")  { string = "Copy link to post"; }
    if (string == "Copy link to post")  { string = "Copy link to Tweet"; }

    if (string.includes("post"))  { string = string.replace("post", "Tweet"); }
    if (string.includes("Post"))  { string = string.replace("Post", "Tweet"); }
    if (string.includes("&nbsp;X"))    { string = string.replace("&nbsp;X", "&nbsp;Twitter"); }
    if (string.includes(" X"))    { string = string.replace(" X", " Twitter"); }

    return string;
}

function revertXLogo() {
  SVG = document.getElementsByClassName("r-18jsvk2 r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr")[0].querySelector('g').querySelector('path');
  SVG.setAttribute('d', birdPath);

  SVG = document.getElementsByClassName("r-jwli3a r-4qtqp9 r-yyyyoo r-1yevf0r r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-meisx5")[2].querySelector('g').querySelector('path');
  SVG.setAttribute('d', birdPath);

  SVG = document.getElementsByClassName("css-901oao r-1awozwy r-jwli3a r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-1b43r93 r-b88u0q r-1777fci r-hjklzo r-bcqeeo r-q4m81j r-qvutc0")[0];
  SVG.getElementsByClassName("r-jwli3a r-4qtqp9 r-yyyyoo r-1yevf0r r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-meisx5")[0].querySelector('g').querySelector('path').setAttribute('d', birdPath);
}

function revertXLogoEmbed() {
  SVG1 = document.getElementsByClassName("r-jwli3a r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03")[2].querySelector('g').querySelector('path');
  SVG1.setAttribute('d', birdPath);
}

function checkValidity(item) {
  var valid = false;
  if (item) { valid = true; }
  if (item.parentNode && item.parentNode.getAttribute('data-testid') == "tweetText") { return false; }
  return valid;
}

function revertHover() {
  var item = document.getElementById("layers").getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];

  if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
}

// Revert all strings
function revertStrings() {

  // "Share this post"
  var items = document.getElementsByClassName("css-901oao css-1hf3ou5 r-14j79pv r-1qd0xha r-1b43r93 r-b88u0q r-1cwl3u0 r-13hce6t r-bcqeeo r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
  }

  // "Copy link" / "Copy link to post"
  items = document.getElementsByClassName("css-901oao css-1hf3ou5 r-14j79pv r-1qd0xha r-1b43r93 r-b88u0q r-1cwl3u0 r-13hce6t r-bcqeeo r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
  }

  // "Read more on X"
  items = document.getElementsByClassName("css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
  }

  // "View on X"
  items = document.getElementsByClassName("css-901oao r-jwli3a r-1qd0xha r-1gkfh8e r-16dba41 r-56xrmm r-146iojx r-bcqeeo r-s1qlax r-1vvnge1 r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
  }

  // "Watch on X" / "Continue watching on X"
  items = document.getElementsByClassName("css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-n6v787 r-fxxt2n r-bcqeeo r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
  }

  // "Context is written by people who use X, and appears when rated helpful by others."
  items = document.getElementsByClassName("css-901oao r-14j79pv r-1qd0xha r-1enofrn r-16dba41 r-fxxt2n r-bcqeeo r-kmv1fd r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }

    var items1 = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0");
    for (itemX1 of items1) {
      item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
      if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
    }
  }

  // "Some or all of the content shared in this Post is disputed and might be misleading about an election or other civic process."
  items = document.getElementsByClassName("css-901oao r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0");

  for (itemX of items) {
    item = itemX.getElementsByClassName("css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0")[0];
    if (checkValidity(item) == true) { item.innerHTML = revertString(item.innerHTML); }
  }


  // Same for Accessibility Labels
  // NOTE: Not fully working at the present moment
  /* items = document.querySelectorAll('body *');

  for (item of items) {
    if (item.getAttribute('aria-label').includes(" X") || item.getAttribute('aria-label').includes(" post"))
    {
      string = item.getAttribute('aria-label');
      window.alert(string);
      item.setAttribute('aria-label', revertString(string));
    }
  } */
}

// Delete "Not found" error, which was not present before Musk takeover iirc
function deleteNotFound()
{
  const txt = document.documentElement.innerHTML;

  if (txt.includes("M12 20.25c4.56 0 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75 3.75 7.44 3.75 12s3.69 8.25 8.25 8.25zM22.25 12c0 5.66-4.59 10.25-10.25 10.25S1.75 17.66 1.75 12 6.34 1.75 12 1.75 22.25 6.34 22.25 12zM10.5 15.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S12.83 17 12 17s-1.5-.67-1.5-1.5zm.5-2.8L10.75 7h2.5L13 12.7s-.5-.2-1-.2-1 .2-1 .2z") && txt.includes(">Not found</span>"))
  {
    document.documentElement.innerHTML = "";
  }
}

setInterval(revertXLogo, 1);
setInterval(revertXLogoEmbed, 1);
setInterval(revertHover, 1);
setInterval(revertStrings, 1);
setInterval(deleteNotFound, 1);