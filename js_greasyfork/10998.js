// ==UserScript==
// @name        HTML5 player for BBC News
// @match       http://www.bbc.com/*
// @version     2016.04.14
// @description Use a natively uncluttered hardware-accelerated player, no ads or annoyances. Also, easily downloadable videos.
// @grant       GM_xmlhttpRequest
// @namespace   https://greasyfork.org/users/4813
// @icon        https://i.imgur.com/hygPGJg.png
// @downloadURL https://update.greasyfork.org/scripts/10998/HTML5%20player%20for%20BBC%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/10998/HTML5%20player%20for%20BBC%20News.meta.js
// ==/UserScript==

for (var i in (src = document.querySelectorAll('script:not([src])')))
{
    if (typeof src[i] !== 'object' || src[i].textContent.indexOf('externalId') === -1)
        continue;

    var vpid = src[i].textContent.match(/externalId":"([^"]+)"/)[1];

    console.log(i, vpid);
}

var vpid = document.documentElement.innerHTML.match(/p0\w+/)[0];

if (!vpid)
  throw 'BBC HTML5: nothing to do :)';

GM_xmlhttpRequest(
{
  method: 'GET',
  url: 'https://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/format/json/mediaset/journalism-http-tablet/transferformat/plain/vpid/' + vpid,

  onreadystatechange: function(e)
  {
    if (e.readyState !== XMLHttpRequest.DONE)
      return;

    this.responseJSON = JSON.parse(e.responseText);

    /* just for taking a look, please don't mind me! :-) */
    console.log(e, this.responseJSON);

    if (!this.responseJSON.media)
    {
      console.warn('BBC HTML5: the listing did not come with any video at all!', this.responseJSON);
      return;
    }

    /* initial setup for finding the video we're ending up playing */
    var hq = 2, hq_bitrate = 0;

    /* add a download button per result video */
    for(var vid in this.responseJSON.media)
    {
      console.log("=>", vid, this.responseJSON.media[vid].width,
                             this.responseJSON.media[vid].height,
                             this.responseJSON.media[vid],
                             this.responseJSON.media[vid].connection[0].href);

      dwnbutton = document.createElement("a");
      dwnbutton.setAttribute('style', 'padding-right: 10px;');

      dwnbutton.textContent = this.responseJSON.media[vid].width + 'p';
      dwnbutton.href        = this.responseJSON.media[vid].connection[0].href;
      dwnbutton.className   = 'icon';
      dwnbutton.title       = 'Download the ' + this.responseJSON.media[vid].width  + 'x'
                                              + this.responseJSON.media[vid].height + ' px version of this video.';
      dwnbutton.download    = document.querySelector('#media-asset-page-text > h1').textContent + '.' + dwnbutton.textContent + '.mp4';

      /* replace it on the page */
      dwnbuttonHolderElement = document.querySelector('.player-wrapper');
      dwnbuttonHolderElement.appendChild(dwnbutton);

      /* reuse the loop to find the version w/ the best quality */
      if (+(this.responseJSON.media[vid].bitrate) > hq_bitrate)
      {
        console.log(this.responseJSON.media[vid].bitrate, hq_bitrate, +(this.responseJSON.media[vid].bitrate) > hq_bitrate);
        hq = vid;
        hq_bitrate = this.responseJSON.media[vid].bitrate;
      }
    }

    /* build our own html5 player with our own stuff */
    vplayer = document.createElement('video');
      
    console.log(vplayer);

    vplayer.src      = this.responseJSON.media[hq].connection[0].href;
    
    //vplayer.poster = document.querySelector('#media-asset-placeholder').src || "";
    vplayer.poster   = document.querySelector('meta[name="twitter:image:src"]').content;
    vplayer.controls = 'yes';
    vplayer.autoplay = false;
    vplayer.preload  = 'none';

    vplayer.volume   = '0.8';

    vplayer.style.width = '100%';
      
      console.log("asdf=>", vplayer);

    /* replace it on the page */
    videoHolderElement = document.querySelector('#media-asset-page-video, .media-player');
    videoHolderElement.parentElement.replaceChild(vplayer, videoHolderElement);
  },

  onerror: function(e)
  {
    console.warn('BBC HTML5: Houston, we have an unidentified problem!', e);
  }
});