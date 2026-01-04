    // ==UserScript==
    // @name        Invidious Redirect
    // @description Redirect YouTube video link to Invidious instances
    // @namespace   io.github.zeinok.invidiousRedirect
    // @match       *://*.youtube.com/*
    // @match       *://*.youtube.com/watch
    // @match       *://youtu.be/
    // @run-at      document-start
    // @grant       none
    // @version     1.03
    // @author      Zeinok
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446755/Invidious%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/446755/Invidious%20Redirect.meta.js
    // ==/UserScript==
     
    /* CONFIG */
    // List of invidious instances, will be randomly chosen upon redirection.
    // URI schema (https://) is required.
    // View list of instances here: https://instances.invidio.us
    const instances = ["https://invidious.snopyta.org"];
     
    /* SCRIPT START */
    let url = new URL(window.location);
    let redirectURL = new URL(instances[Math.floor(Math.random()*instances.length)])
    let pathname = url.pathname.substring(1);
    let videoID = url.searchParams.get("v");
    let time = url.searchParams.get("t");
     
    redirectURL.pathname = "/watch";
    if(!videoID)
      videoID = pathname;
    redirectURL.searchParams.set("v", videoID);
    if(time)
      redirectURL.searchParams.set("t", time);
     
    window.location = redirectURL.toString();

