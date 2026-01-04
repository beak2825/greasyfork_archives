// ==UserScript==
// @name        YouTube Live Subscriptions
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.4.10
// @author      CY Fung
// @license     MIT
// @description UX for YouTube Livestreams in https://www.youtube.com/feed/subscriptions
// @unwrap
// @inject-into page
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/475119/YouTube%20Live%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/475119/YouTube%20Live%20Subscriptions.meta.js
// ==/UserScript==

(() => {

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.


  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  let pageRenderPromise = null;

  let proxy = new Proxy({

  }, {
    set(target, prop, value) {
      /*
      if(prop ==='isFeedSubscriptions' && target[prop] !== value){

        target[prop] = value;


        if(!value){


        for(const s of document.querySelectorAll('ytd-rich-grid-row #contents.ytd-rich-grid-row[class], ytd-rich-item-renderer.ytd-rich-grid-row[class]')){

          s.classList.remove('feed-subscriptions');


        }


        }else{

        for(const s of document.querySelectorAll('ytd-rich-grid-row #contents.ytd-rich-grid-row[class], ytd-rich-item-renderer.ytd-rich-grid-row[class]')){


          s.classList.add('feed-subscriptions');


        }
        }

      }
      */

      target[prop] = value;

    }
  })




  const wm = new WeakMap();

  const dm = new WeakMap();

  let foregroundPromise = null;
  const foregroundPromiseFn = () => (foregroundPromise = (foregroundPromise || new Promise(resolve => {
    requestAnimationFrame(() => {
      foregroundPromise = null;
      resolve();
    });
  })));


  let m67t = 0;

  let pendingChannels = new Set();

  const closestYtComponentFn = (e) => {
    while (e instanceof HTMLElement) {
      if (typeof e.is === 'string') return e;
      e = e.parentNode;
    }
    return null;
  };


  const proceedChannels = () => {
    // if(location.pathname!=='/feed/subscriptions') return;
    let channels = [...pendingChannels];
    pendingChannels.clear();
    for (const channel of channels) {

      const cssSelector = `ytd-browse[page-subtype="subscriptions"]:not([hidden])`;

      let cssParent = document.querySelector(cssSelector) || document.querySelector('ytd-page-manager') || document.body;

      let videoIds = new Set([...HTMLElement.prototype.querySelectorAll.call(cssParent, `[media-owner-id="${channel}"][media-base-video-id]`)].map(e => e.getAttribute('media-base-video-id')))

      let medias = [...videoIds].map(videoId => HTMLElement.prototype.querySelector.call(cssParent, `[media-owner-id="${channel}"][media-base-video-id="${videoId}"]`)).filter(e => (e instanceof HTMLElement));
      let csContainer = null;
      // console.log(3343,channel, [...medias])

      for (let mi = 0; mi < medias.length; mi++) {

        const media = medias[mi];
        if (mi > 0) {
          let ytParentComponent = insp(insp(media).parentComponent || 0);

          if (ytParentComponent) {

            const ytParentComponentElement = ytParentComponent.hostElement;

            if (ytParentComponentElement && ytParentComponentElement.getElementsByTagName(media.tagName).length === 1) {
              ytParentComponentElement.setAttribute('hidden', '')
            }


          }

        } else {
          csContainer = media.parentNode.querySelector('ytd-channel-subscriptions');
          csContainer.setAttribute('channel-subscriptions-active', '');
          csContainer.textContent = '';



        }

        let videoMedia = (insp(media).hostElement || 0);

        let videoMediaData = videoMedia ? dm.get(videoMedia) : null;


        if (csContainer && videoMediaData) {
          const box = document.createElement('ytd-channel-subscription');

          const tnUrl = videoMediaData.thumbnail.thumbnails[0].url;
          box.style.setProperty('background-image', `url(${tnUrl})`);


          box.setAttribute('data-channel-id', media.getAttribute('media-owner-id'));
          box.setAttribute('data-video-id', media.getAttribute('media-base-video-id'));

          dm.set(box, videoMediaData);

          const data = videoMediaData || 0;
          let type = '';
          if (data.upcomingEventData) {
            type = 'upcoming';
          } else if (data.badges) {
            for (const badge of data.badges) {
              if (badge && badge.metadataBadgeRenderer) {
                const br = badge.metadataBadgeRenderer;
                if (br.style === "BADGE_STYLE_TYPE_LIVE_NOW" || (br.icon || 0).iconType === 'LIVE') {
                  type = 'live-now';
                }
              }
            }
          }

          if (!type && data.publishedTimeText) {
            type = 'published'
          }

          box.setAttribute('video-type', type)

          csContainer.appendChild(box);




        }
        //if(mi>0) let closestYtComponentFn(media)
      }

      if (csContainer) {

        let media = HTMLElement.prototype.querySelector.call(csContainer.parentNode, 'ytd-rich-grid-media');

        if (media) {

          // console.log(media);

          insp(media).setTargetData();
        }
      }




    }
  }

  let m68t = 0;
  let promiseT = Promise.resolve();
  const mo1 = new MutationObserver(() => {

    // if(!isFeedSubscriptions && location.pathname==='/feed/subscriptions') isFeedSubscriptions = true;
    if (!proxy.isFeedSubscriptions) return;
    let p = document.querySelector('a[href="/feed/subscriptions"]');
    if (p) p.setAttribute('href', '/feed/subscriptions?flow=1');




  });




  mo1.observe(document, { subtree: true, childList: true });


  const mo2 = new MutationObserver((entries) => {

    // if(!isFeedSubscriptions && location.pathname==='/feed/subscriptions') isFeedSubscriptions = true;
    if (!proxy.isFeedSubscriptions) return;


    let mx = false;

    for (const entry of entries) {

      const target = entry.target;

      if (target instanceof HTMLElement && target.isConnected === true) {

        foregroundPromiseFn().then(() => {




          let c = target.querySelector('ytd-channel-subscriptions');


          let media = target.querySelector('ytd-rich-grid-media');
          let mediaCnt = insp(media);

          let _c72_ = mediaCnt.data._c72_;
          let w = null;
          if (_c72_) {
            w = wm.get(_c72_);

          }


          return;



        })


      }
    }

  });

  document.addEventListener('click', function (evt) {

    if (!proxy.isFeedSubscriptions) return;

    // console.log(3, evt)
    if (evt && evt.isTrusted && evt.target.nodeName === 'YTD-CHANNEL-SUBSCRIPTION') {
      let media = HTMLElement.prototype.querySelector.call(evt.target.parentNode.parentNode, 'ytd-rich-grid-media');
      const videoId = evt.target.getAttribute('data-video-id');
      // console.log(4, media,videoId)
      if (media) {
        insp(media).setTargetData(videoId)
      }
    }

  }, true)

  let runStarted = 0;

  let styleElement = null;

  const runStart = () => {

    if (styleElement) return;

    styleElement = document.createElement('style');

    document.head.appendChild(styleElement).textContent = `

html {
    --min-preview-size: 128px;
    --feed-subscription-background: #fcfaff;
    --feed-subscription-bg-upcoming: #dedede80;
    --feed-subscription-bg-published: #b9b9b980;
}
html[dark] {
    --feed-subscription-background: #1d1d1d;
    --feed-subscription-bg-upcoming: #bdbdbd80;
    --feed-subscription-bg-published: #53535380;
}
@media all and (min-width: 600px) {
    html {
        --min-preview-size: 148px;
    }
}
@media all and (min-width: 792px) {
    html {
        --min-preview-size: 168px;
    }
}
@media all and (min-width: 1010px) {
    html {
        --min-preview-size: 16.5vw;
    }
}
@media all and (min-width: 1160px) {
    html {
        --min-preview-size: 192px;
    }
}
.feed-subscriptions ytd-rich-grid-row #contents.ytd-rich-grid-row[class] {
    display: flex;
    flex-direction: column;
}

.feed-subscriptions ytd-rich-item-renderer.ytd-rich-grid-row[class] {
    width: 100%;
    margin: 4px;
    display: flex;
    justify-content: center;
}

.feed-subscriptions #content.ytd-rich-item-renderer {
    column-gap: 16px;
}

ytd-rich-grid-media[media-base-video-id] {
    max-width: initial;
    flex: 0;
    flex-basis: 200px;
    max-width: initial;
}
ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#dismissible {
    justify-content: center;
    display: flex;
    flex-direction: row;
    column-gap: 8px;
    flex-wrap: wrap;
    flex-direction: column;
    flex-wrap: nowrap;
    min-width: min-content;
    justify-content: flex-start;
}
ytd-rich-grid-media[media-base-video-id] #avatar-link.ytd-rich-grid-media {
    margin: 0;
    padding: 0;
}
ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#dismissible > #thumbnail {
    /* margin: 2px; */
    margin: 12px 0 12px 12px;
    height: min-content;
    flex-shrink: 1;
}
ytd-rich-grid-media[media-base-video-id]
    .ytd-rich-grid-media#dismissible
    > #details {
    padding: 0;
    display: flex;
    flex-direction: column;
}
ytd-rich-grid-media[media-base-video-id]
    #details.ytd-rich-grid-media.no-pointer {
    cursor: initial;
}
ytd-rich-grid-media[media-base-video-id] #interaction.ytd-rich-grid-media {
    display: none;
}
ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#details {
    width: auto;
    max-width: 390px;
}
ytd-rich-grid-media[media-base-video-id]
    #video-title.ytd-rich-grid-media[class] {
    -webkit-line-clamp: 3;
    max-height: initial;
    white-space: break;
}
ytd-rich-grid-media[media-base-video-id] #video-title.ytd-rich-grid-media[class],
ytd-rich-grid-media[media-base-video-id] #video-title.ytd-rich-grid-media[class] yt-formatted-string {
    white-space: pre-wrap;
    word-break: keep-all;
    font-family: "游ゴシック Medium", "Yu Gothic Medium", 游ゴシック体, YuGothic,
        sans-serif;
    font-size: 14px;
    line-height: 1.5em;
}
ytd-rich-grid-media[media-base-video-id] ytd-menu-renderer.ytd-rich-grid-media {
    right: 6px;
}
ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#attached-survey {
    display: none;
}
ytd-rich-grid-media[media-base-video-id] + ytd-channel-subscriptions {
    display: flex;
}
ytd-rich-grid-media[media-base-video-id]:last-child {
    display: none;
}
ytd-rich-grid-media[media-base-video-id] #avatar-link {
    position: absolute;
    top: 14px;
    left: -45px;
}
ytd-rich-grid-media[media-base-video-id] ytd-video-meta-block {
    display: inline-block;
}
ytd-rich-grid-media[media-base-video-id] #meta.ytd-rich-grid-media {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 16px;
    padding: 0;
    margin: 0;
    margin-bottom: 30px;
    max-width: 290px;
    min-width: 290px;
}
ytd-rich-grid-media[media-base-video-id]
    ytd-video-meta-block.grid
    #metadata.ytd-video-meta-block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    row-gap: 4px;
}
ytd-rich-grid-media[media-base-video-id] {
    margin-left: 52px;
}
ytd-rich-grid-media[media-base-video-id] .title-badge.ytd-rich-grid-media,
ytd-rich-grid-media[media-base-video-id] .video-badge.ytd-rich-grid-media {
    margin: 0;
}
ytd-rich-grid-media[media-base-video-id] ytd-video-meta-block.grid {
    flex-basis: 66%;
}
ytd-channel-subscriptions {
    min-width: calc(var(--min-preview-size) + 38px);
    flex-direction: row;
    flex-wrap: wrap;
    flex: 0;
    min-height: min(calc(var(--min-preview-size) / 16 * 9 * 3 + 8px), 100%);
    height: 0;
    overflow: auto;
    overscroll-behavior: none;
    gap: 4px;
    scroll-snap-type: y proximity;
    scroll-snap-stop: always;
    display: none;
    align-content: flex-start;
    box-sizing: content-box;
    flex-basis: 260px;
}
ytd-channel-subscriptions::-webkit-scrollbar {
    width: 16px;
}
ytd-channel-subscriptions::-webkit-scrollbar-thumb {
    height: 56px;
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: var(--yt-spec-text-secondary);
}
ytd-channel-subscriptions::-webkit-scrollbar-thumb {
    height: 56px;
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: hsl(0, 0%, 67%);
}
ytd-channel-subscription {
    display: block;
    width: var(--min-preview-size);
    height: calc(var(--min-preview-size) / 16 * 9);
    background-repeat: no-repeat;
    background-size: contain;
    scroll-snap-align: center;
    cursor: pointer;
    margin-left: 14px;
    min-width: var(--min-preview-size);
}
ytd-channel-subscription:only-child {
    visibility: hidden;
}
ytd-channel-subscription[video-type="upcoming"] {
    filter: brightness(0.8);
    background-blend-mode: overlay;
    background-color: var(--feed-subscription-bg-upcoming);
    box-shadow: 0px 0px 2px 3px #ffffffee inset;
    order: 1;
}
ytd-channel-subscription[video-type="published"] {
    filter: brightness(0.5);
    background-blend-mode: overlay;
    background-color: var(--feed-subscription-bg-published);
    order: 3;
}
ytd-channel-subscription[video-type="live-now"] {
    filter: brightness(0.9);
    box-shadow: 0px 0px 2px 3px #ff0000ee inset;
    order: 2;
}
ytd-channel-subscription:hover {
    filter: brightness(0.99);
}
ytd-channel-subscription.selected::before {
    content: "";
    display: block;
    position: absolute;
    background: transparent;
    top: 50%;
    left: -14px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 0 5px 10px;
    border-color: transparent transparent transparent
        var(--yt-spec-text-primary);
}
ytd-channel-subscriptions {
    flex-basis: 16px;
}
ytd-rich-grid-media[media-base-video-id] {
    max-width: max-content;
}
ytd-rich-grid-media[media-base-video-id] #meta.ytd-rich-grid-media h3 {
    max-width: 100%;
}
.feed-subscriptions ytd-continuation-item-renderer {
    padding: 24px 0;
}
.feed-subscriptions ytd-continuation-item-renderer #ghost-cards {
    display: none;
}
@media all and (min-width: 1010px) {

    .feed-subscriptions #content.ytd-rich-item-renderer::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--background-rurl);
        background-repeat: no-repeat;
        background-size: 90090px 90090px;
        background-position: -22523px -27526px;
        background-blend-mode: color-dodge;
        background-origin: content-box;
        opacity: 0.15;
        background-color: #79797973;
        pointer-events: none;
    }
    ytd-rich-grid-media[media-base-video-id]
        ytd-menu-renderer.ytd-rich-grid-media {
        margin-top: 48px;
    }
    ytd-rich-grid-media[media-base-video-id] {
        margin-left: 0;
        max-width: max-content;
        flex-basis: 70%;
        flex-grow: 3;
        flex-basis: 200px;
    }
    ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#dismissible {
        align-items: center;
    }
    ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#details {
        width: auto;
        min-width: 390px;
        max-width: 468px;
    }
    ytd-rich-grid-media[media-base-video-id] #meta.ytd-rich-grid-media {
        max-width: initial;
        margin-bottom: 0px;
    }
    ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#dismissible > #details {
        padding: 26px 8px;
    }
    ytd-rich-grid-media[media-base-video-id] ytd-video-meta-block {
        display: flex;
    }
    ytd-rich-grid-media[media-base-video-id] #avatar-link {
        position: static;
        left: auto;
    }
    ytd-channel-subscriptions {
        max-width: 460px;
    }
    ytd-rich-grid-media[media-base-video-id]
        .ytd-rich-grid-media#dismissible
        > #thumbnail {
        width: 31vw;
        flex-shrink: 0;
        align-self: center;
    }
    .feed-subscriptions #content.ytd-rich-item-renderer {
        flex: 1;
        width: 100%;
        max-width: 1340px;
        background-color: var(--feed-subscription-background);
    }
    ytd-rich-grid-media[media-base-video-id] {
        max-width: initial;
    }
    ytd-rich-grid-media[media-base-video-id]
        .ytd-rich-grid-media#dismissible
        > #details {
        min-width: 200px;
        max-width: 480px;
    }
    ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#dismissible {
        flex-direction: row;
        flex-wrap: nowrap;
    }
    ytd-channel-subscriptions {
        flex-grow: 1;
        min-height: calc(var(--min-preview-size) / 16 * 9 * 2 + 4px);
        align-self: center;
    }
}
@media all and (min-width: 1160px) {
    ytd-rich-grid-media[media-base-video-id] .ytd-rich-grid-media#dismissible > #thumbnail {
        width: 360px;
        flex-shrink: 0;
    }
}
@media all and (min-width: 1313px) {
    ytd-channel-subscriptions {
        flex-basis: 260px;
    }
}



    `
  }

  (async () => {

    await Promise.all([
      customElements.whenDefined('ytd-rich-grid-renderer'),
      customElements.whenDefined('ytd-rich-grid-media'),
      customElements.whenDefined('ytd-rich-item-renderer'),
    ]);

    let dummy = document.createElement('ytd-rich-grid-media');

    let cProto = insp(dummy).constructor.prototype;

    cProto.onDetailsClick49 = cProto.onDetailsClick;
    cProto.onDetailsClick = function () {

      if (!proxy.isFeedSubscriptions) return this.onDetailsClick49.apply(this, arguments);

    }

    cProto.setTargetData = function (newVideoId) {
      const hostElement = this.hostElement;
      const baseVideoId = hostElement.getAttribute('media-base-video-id');
      const ownerId = hostElement.getAttribute('media-owner-id');

      if (!baseVideoId || !ownerId) return;
      const currentVideoId = hostElement.getAttribute('data-selected-video-id');
      if (!currentVideoId) {


        let q = document.querySelector(`ytd-channel-subscription[data-video-id="${baseVideoId}"]`);
        for (const p of q.parentNode.querySelectorAll('.selected')) p.classList.remove('selected');
        q.classList.add('selected');

        /*
              let q = document.querySelector(`ytd-channel-subscription[data-video-id="${newVideoId}"]`);
              q.parentNode.scrollTop= q.offsetTop - q.offsetHeight/2;
              */

        newVideoId = baseVideoId;

      } else {

        let q = document.querySelector(`ytd-channel-subscription[data-video-id="${currentVideoId}"]`);

        if (q && !q.classList.contains('selected')) {


          for (const p of q.parentNode.querySelectorAll('.selected')) p.classList.remove('selected');

          q.classList.add('selected');
          hostElement.removeAttribute('data-selected-video-id')
          newVideoId = newVideoId || currentVideoId;
        }


      }



      if (!newVideoId) return;
      newVideoId = `${newVideoId}`;

      Promise.resolve().then(() => {
        const hostElement = this.hostElement;

        if (hostElement.getAttribute('data-selected-video-id') !== newVideoId) {


          hostElement.setAttribute('data-selected-video-id', newVideoId);

          const videoMedia = document.querySelector(`ytd-rich-grid-media[media-base-video-id="${newVideoId}"]`)


          let videoMediaData = videoMedia ? dm.get(videoMedia) : null;

          if (videoMediaData && videoMediaData.videoId === newVideoId && this.data._c72_ && videoMediaData._c72_ && videoMediaData.videoId !== this.data._c72_.vid) {
            this.data = Object.assign({}, videoMediaData);
          }




          let q = document.querySelector(`ytd-channel-subscription[data-video-id="${newVideoId}"]`);
          for (const p of q.parentNode.querySelectorAll('.selected')) p.classList.remove('selected');
          q.classList.add('selected');


          q.parentNode.scrollTop = q.offsetTop - q.offsetHeight / 2;

        }







      })
      // q.scrollIntoView();
    }

    cProto.onDetailsClick._c49_ = 1;

    cProto.__fixPanel__ = function () {

      const _c72_ = ((this || 0).data || 0)._c72_ || 0;
      if (!_c72_) return;
      const media = this.hostElement;
      let ytParentComponent = insp(media).parentComponent;
      if (ytParentComponent) {
        ytParentComponent = insp(ytParentComponent);
        ytParentComponent.hostElement.removeAttribute('hidden');
      }
      let elem = wm.get(_c72_);
      if (elem) {

        media.parentNode.insertBefore(elem, media.nextSibling);


      } else {



        let div = document.createElement('ytd-channel-subscriptions');

        media.parentNode.insertBefore(div, media.nextSibling);

        wm.set(_c72_, div);






      }



      pendingChannels.add(_c72_.cid);




      let tid = ++m67t;
      foregroundPromiseFn().then(() => {
        if (tid !== m67t) return;
        proceedChannels();
      });




    }

    cProto.attached49 = cProto.attached;

    cProto.attached = function () {



      if (!proxy.isFeedSubscriptions && location.pathname === '/feed/subscriptions') proxy.isFeedSubscriptions = true;

      if (!proxy.isFeedSubscriptions) return this.attached49.apply(this, arguments);


      if (!this.hostElement) return this.attached49();
      if (this.hostElement && typeof this.hostElement.onDataChanged === 'function' && !this.hostElement.onDataChanged._c49_) {
        this.hostElement.onDataChanged = this.onDataChanged.bind(this);
        this.hostElement.onDataChanged._c49_ = 1;
      }


      if (this.hostElement && typeof this.hostElement.onDetailsClick === 'function' && !this.hostElement.onDetailsClick._c49_) {
        this.hostElement.onDetailsClick = this.onDetailsClick.bind(this);
        this.hostElement.onDetailsClick._c49_ = 1;
      }


      if (!runStarted) {

        runStarted = 1;
        runStart();
      }

      if (!this.hostElement._m51_) {
        this.hostElement._m51_ = true;
        let details = HTMLElement.prototype.querySelector.call(this.hostElement, '#details');
        if (details) {

          details.classList.add('no-pointer');


        }

        mo2.observe(this.hostElement.parentNode, { subtree: false, childList: true });



      }




      this.attached49();

    }

    /*
    cProto.detached49 =cProto.detached
    cProto.detached = function(){
      const data = this.data || 0;
      if(data){

        let browseId = null;
        try{

          browseId = data.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId
        }catch(e){}

        if(browseId){

          pendingChannels.add(browseId)
          foregroundPromiseFn().then(proceedChannels)


        }

      }
    }
    */

    cProto.dc01 = function () {

      const data = this.data || 0;
      if (data) {


        if (data.thumbnail && data.thumbnail.thumbnails) {
          let thumbnails = data.thumbnail.thumbnails;
          if (thumbnails.length > 1) {
            let u = -1;
            for (const tn of thumbnails) {
              let z = Math.round(tn.width * tn.height);
              if (z > u) u = z;
            }
            thumbnails = thumbnails.filter(e => Math.round(e.width * e.height) === u);
            if (thumbnails.length > 1) thumbnails.length = 1;
            data.thumbnail.thumbnails = thumbnails;
          }
        }
      }

    }


    let fetchedType = false;

    document.addEventListener('yt-page-data-fetched', (evt) => {


      if (evt && evt.detail) {

        const detail = evt.detail;

        if (detail.pageData && detail.pageData.page && detail.pageData.url) {
          if (detail.pageData.page === 'browse' && detail.pageData.url === '/feed/subscriptions') {
            proxy.isFeedSubscriptions = true;
          } else {
            proxy.isFeedSubscriptions = false;
          }
          fetchedType = true;
          // console.log(proxy.isFeedSubscriptions)
        }

      }
    });



    document.addEventListener('yt-navigate-finish', () => {

      proxy.isFeedSubscriptions = location.pathname === '/feed/subscriptions';

      // console.log(proxy.isFeedSubscriptions)

      /*

      if(!proxy.isFeedSubscriptions){


      for(const s of document.querySelectorAll('ytd-rich-grid-row #contents.ytd-rich-grid-row[class], ytd-rich-item-renderer.ytd-rich-grid-row[class]')){

        s.classList.remove('feed-subscriptions');


      }

        return;
      }

      for(const s of document.querySelectorAll('ytd-rich-grid-row #contents.ytd-rich-grid-row[class], ytd-rich-item-renderer.ytd-rich-grid-row[class]')){


        s.classList.add('feed-subscriptions');


      }
      */

      for (const media of document.querySelectorAll('ytd-rich-grid-media:not([media-base-video-id])')) {

        let selectedBox = media.parentNode.querySelector('ytd-channel-subscription.selected');


        let baseData = media.data;

        if (selectedBox) {



          let baseData = media.data;
          let selectedData = dm.get(selectedBox);
          if (baseData && selectedData && baseData._c72_ && selectedData._c72_ && baseData._c72_ === selectedData._c72_) {
            let w = baseData._c72_;
            media.setAttribute('media-base-video-id', w.vid)
            media.setAttribute('media-owner-id', w.cid)


            media.setAttribute('data-selected-video-id', w.vid)


            dm.set(media, baseData)

          } else if (baseData && selectedData && baseData._c72_ && selectedData._c72_ && baseData._c72_ !== selectedData._c72_) {
            let w = baseData._c72_;
            media.setAttribute('media-base-video-id', w.vid)
            media.setAttribute('media-owner-id', w.cid);



            media.setAttribute('data-selected-video-id', selectedData._c72_.vid)
            media.data = Object.assign({}, selectedData)

            dm.set(media, baseData)


          }

          /*
          if(baseData){


            pendingChannels.add(baseData.cid);
            let tid = ++m67t;
            foregroundPromiseFn().then(()=>{
              if(tid!==m67t) return;
              proceedChannels();
            });
          }
          */

        }

      }



      for (const media of document.querySelectorAll('ytd-rich-grid-media:not([media-base-video-id])')) {

        let baseData = media.data;




        if (baseData) {

          let w = baseData._c72_;

          if (w) {
            media.setAttribute('media-base-video-id', w.vid)
            media.setAttribute('media-owner-id', w.cid)

            dm.set(media, baseData)
          }

        }



      }



      for (const media of document.querySelectorAll('ytd-rich-item-renderer ytd-rich-grid-media')) {

        // insp(media).dc02();




        insp(media).setBackgroundRURL();

      }



    })

    cProto.setBackgroundRURL = function () {

      const media = this.hostElement;

      // insp(media).dc02();

      // const media = media.closest('ytd-rich-grid-media')
      const renderer = HTMLElement.prototype.closest.call(media, 'ytd-rich-item-renderer')
      if (!renderer) return;
      let src = null;
      try {
        src = this.data.owner.thumbnail.thumbnails[0].url;
      } catch (e) { }
      if (!src) return;
      renderer.style.setProperty('--background-rurl', `url(${src})`);

    }


    cProto.dc02 = function () {


      const data = this.data || 0;


      const media = this.hostElement;





      let browseId = null;
      try {
        browseId = data.owner.navigationEndpoint.browseEndpoint.browseId
      } catch (e) { }

      let videoId = null;


      try {
        videoId = data.videoId;
      } catch (e) { }



      if (data && browseId && videoId && !data._c72_) {



        data._c72_ = {};
        dm.set(media, data);


        data._c72_.vid = videoId || ''
        data._c72_.cid = browseId || ''

        pendingChannels.add(browseId);
        let tid = ++m67t;
        foregroundPromiseFn().then(() => {
          if (tid !== m67t) return;
          proceedChannels();
        });

        media.setAttribute('media-base-video-id', videoId || '');


        media.setAttribute('media-owner-id', browseId || '');

        this.setBackgroundRURL();

      } else if (data && browseId && videoId) {

        /*

        pendingChannels.add(browseId);
        let tid = ++m67t;
        foregroundPromiseFn().then(() => {
          if (tid !== m67t) return;
          proceedChannels();
        });
        */
        this.setBackgroundRURL();

      }


      if (!videoId || !browseId) {

        media.removeAttribute('media-base-video-id');


        media.removeAttribute('media-owner-id');

      } else if (!media.getAttribute('media-base-video-id') || !media.getAttribute('media-owner-id')) {


        /*
        let box = document.querySelector(`[data-channel-id="${browseId}"][data-video-id="${videoId}"]`);

        console.log(123100, box)
        if(box){
          let boxC72 = ((dm.get(box)||0)||0)._c72_||0;
          let thisC72 = (this.data||0)._c72_;
          console.log(123200, boxC72, thisC72,  boxC72 === thisC72)
          if(boxC72 && thisC72 && boxC72 === thisC72){

                media.setAttribute('media-base-video-id',videoId );
               media.setAttribute('media-owner-id',  browseId );
          }else if(boxC72 && thisC72 && boxC72 !== thisC72){

            let baseVideo = box.parentNode.querySelector('.selected');
            let baseVideoId = baseVideo ? baseVideo.getAttribute('data-video-id') : '';

            if(baseVideoId){

                media.setAttribute('media-base-video-id',baseVideoId );

                media.setAttribute('data-selected-video-id',videoId );
               media.setAttribute('media-owner-id',  browseId );
            }



          }
        }
        */




      }


      if (data && data._c72_ && !this.hostElement.parentNode.querySelector('ytd-channel-subscriptions')) {


        this.__fixPanel__();

      }

    }

    cProto.onDataChanged49 = cProto.onDataChanged;

    cProto.onDataChanged = function () {
      if (!proxy.isFeedSubscriptions && location.pathname === '/feed/subscriptions') proxy.isFeedSubscriptions = true;
      let skip = this.hostElement && !HTMLElement.prototype.closest.call(this.hostElement, 'ytd-browse[page-subtype="subscriptions"]');

      // if(location.pathname!=='/feed/subscriptions') return this.onDataChanged49.apply(this, arguments);
      if (!skip) this.dc01();
      let r = this.onDataChanged49.apply(this, arguments);
      if (!skip) this.dc02();
      return r;
    }

    cProto.onDataChanged._c49_ = 1;






    dummy = document.createElement('ytd-rich-grid-renderer');

    cProto = insp(dummy).constructor.prototype;


    cProto._triggerFeedSubscriptions = function () {



      if (!fetchedType && !proxy.isFeedSubscriptions && location.pathname === '/feed/subscriptions') proxy.isFeedSubscriptions = true;

      if (this.hostElement) {
        this.hostElement.classList.toggle('feed-subscriptions', proxy.isFeedSubscriptions)
        if (styleElement && proxy.isFeedSubscriptions && !styleElement.parentNode) document.head.appendChild(styleElement);
        else if (styleElement && !proxy.isFeedSubscriptions && styleElement.parentNode) (styleElement).remove();


      }
    }

    cProto.attached59 = cProto.attached;
    cProto.attached = function () {

      this._triggerFeedSubscriptions();
      return this.attached59();
    }


    cProto.refreshGridLayout49 = cProto.refreshGridLayout;
    cProto.refreshGridLayout = function () {

      this._triggerFeedSubscriptions();
      if (proxy.isFeedSubscriptions) {
        if (this._fs74_) return;
        this._fs74_ = 1;
      } else {
        this._fs74_ = 0;
      }
      return this.refreshGridLayout49.apply(this, arguments);

    }

    cProto.calcElementsPerRow49 = cProto.calcElementsPerRow;

    cProto.calcElementsPerRow = function () {

      this._triggerFeedSubscriptions();
      return this.calcElementsPerRow49.apply(this, arguments);

    }



  })();

})();