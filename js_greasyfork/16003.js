// ==UserScript==
// @name         Close ADS
// @namespace    http://tampermonkey.net/
// @version      0.62
// @description  Close unwanted popup ads
// @author       You
// @match        https://populators.info/*
// @match        http://www.tradeadexchange.com/*
// @match        http://onclickads.net/*
// @match        http://www.avtv.cc/*
// @match        http://www.terraclicks.com/*
// @match        http://apapi.dc121677.com/*
// @match        http://videowood.tv/pop
// @match        http://www.adcash.com/ad/*
// @match        http://serve.popads.net/*
// @match        http://ad.directrev.com/*
// @match        http://www.onclickpredictiv.com/*
// @match        http://adv.videomega.tv/*
// @match        http://see-work.info/*
// @match        http://adplexmedia.adk2x.com/*
// @match        http://adrunnr.com/*
// @match        http://*.mackeeper.com/*
// @match        http://serve.popads.net/*
// @match        http://track.frwdx.com/*
// @match        http://wp0p1.redirectvoluum.com/*
// @match        http://www.duplicashapp.com/dream-silver.php?t=*
// @match        http://online-bizlovers.com/my/*
// @match        http://prestoris.com/afu.php?zoneid=*
// @match        http://appsyst.s3.amazonaws.com/
// @match        http://trk.servedbytrackingdesk.com/*
// @match        http://www.orion-code-access.net/?t=*
// @match        http://www.clicksgear.com/watch?key=*
// @match        http://www.trackingclick.net/redirect?target=*
// @match        http://engine.spotscenered.info/Redirect.eng?*
// @match        http://birdieulx.com/?&tid=*
// @match        http://milblueprint.com/*
// @match        https://serve.popads.net/*
// @match        http://pipeschannels.com/*
// @match        http://target1.track-p958o4.link/*
// @match        http://www.performanceadexchange.com/script/preurl.php?r=*
// @match        http://asdfz.pro/*
// @match        http://pgy.ginx.gdn/*
// @match        http://adexchangeprediction.com/script/packcpm.php?*
// @match        https://onclkds.com/*
// @match        http://unhardward.com/*
// @match        http://track.absoluteclickscom.com/redirect?target=*
// @match        http://track.aptitudemedia.co/redirect?target=*
// @match        http://redonetype.com/*
// @match        https://www.onclickmax.com/script/preurl.php?r=*
// @match        https://deloton.com/*
// @match        http://www.buzzadnetwork.com/jump/next.php?*
// @match        http://lie2anyone.com/watch?key=*
// @match        http://syndication.exdynsrv.com/splash.php?*
// @match        http://fapmeth.com/afu.php*
// @match        http://track.aptitudemedia.co/redirect?*
// @match        http://h8vzwpv.com/watch?*
// @match        https://syndication.exdynsrv.com/splash.php?*
// @match        http://www.hibids10.com/*
// @match        https://ziffsite.net/*
// @match        http://constintptr.com/*
// @match        http://jf71qh5v14.com/*
// @match        https://rotumal.com/*
// @match        https://zukxd6fkxqn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16003/Close%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/16003/Close%20ADS.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
setInterval(function(){document.body.innerHTML='';window.close();},1);