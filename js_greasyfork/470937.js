// ==UserScript==
// @name        YouTube Live DateTime Tooltip
// @namespace   UserScript
// @match       https://www.youtube.com/*
// @version     0.1.5
// @license     MIT
// @author      CY Fung
// @run-at      document-start
// @grant       none
// @unwrap
// @inject-into page
// @description Make a tooltip to show the actual date and time for livestream
// @downloadURL https://update.greasyfork.org/scripts/470937/YouTube%20Live%20DateTime%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/470937/YouTube%20Live%20DateTime%20Tooltip.meta.js
// ==/UserScript==

((__CONTEXT__) => {

  const { Promise, requestAnimationFrame } = __CONTEXT__;

  const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
  const bubblePassive = isPassiveArgSupport ? { capture: false, passive: true } : false;
  const capturePassive = isPassiveArgSupport ? { capture: true, passive: true } : true;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  let pageFetchedDataLocal = null;
  document.addEventListener('yt-page-data-fetched', (evt) => {
    pageFetchedDataLocal = evt.detail;


  }, bubblePassive);

  function getFormatDates() {

    if (!pageFetchedDataLocal) return null;

    const formatDates = {}
    try {
      formatDates.publishDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.publishDate
    } catch (e) { }
    // 2022-12-30

    try {
      formatDates.uploadDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.uploadDate
    } catch (e) { }
    // 2022-12-30

    try {
      formatDates.publishDate2 = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.dateText.simpleText
    } catch (e) { }
    // 2022/12/31

    if (typeof formatDates.publishDate2 === 'string' && formatDates.publishDate2 !== formatDates.publishDate) {
      formatDates.publishDate = formatDates.publishDate2
      formatDates.uploadDate = null
    }

    try {
      formatDates.broadcastBeginAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.startTimestamp
    } catch (e) { }
    try {
      formatDates.broadcastEndAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.endTimestamp
    } catch (e) { }
    try {
      formatDates.isLiveNow = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.isLiveNow
    } catch (e) { }


    return formatDates;
  }



  function createElement() {

    /** @type {HTMLElement} */
    const ytdWatchFlexyElm = document.querySelector('ytd-watch-flexy');
    if (!ytdWatchFlexyElm) return;
    const ytdWatchFlexyCnt = insp(ytdWatchFlexyElm);
    let newPanel = ytdWatchFlexyCnt.createComponent_({
      "component": "ytd-button-renderer",
      "params": {
        buttonTooltipPosition: "top",
        systemIcons: false,
        modern: true,
        forceIconButton: false,

      }
    }, "ytd-engagement-panel-section-list-renderer", true) || 0;
    const newPanelHostElement = newPanel.hostElement || newPanel || 0;
    const newPanelCnt = insp(newPanelHostElement) || 0;

    newPanelCnt.data = {
      "style": "STYLE_DEFAULT",
      "size": "SIZE_DEFAULT",
      "isDisabled": false,
      "serviceEndpoint": {
      },
      "icon": {
      },
      "tooltip": "My ToolTip",
      "trackingParams": "",
      "accessibilityData": {
        "accessibilityData": {
          "label": "My ToolTip"
        }
      }
    };

    newPanelHostElement.classList.add('style-scope', 'ytd-watch-flexy');
    // $0.appendChild(newPanel);

    // window.ss3 = newPanel
    // console.log(HTMLElement.prototype.querySelector.call(newPanel,'tp-yt-paper-tooltip'))
    return newPanelHostElement;

  }



  const formatDateFn = (d) => {

    let y = d.getFullYear()
    let m = d.getMonth() + 1
    let date = d.getDate()

    let sy = y < 1000 ? (`0000${y}`).slice(-4) : '' + y

    let sm = m < 10 ? '0' + m : '' + m
    let sd = date < 10 ? '0' + date : '' + date

    return `${sy}.${sm}.${sd}`

  }

  const formatTimeFn = (d) => {

    let h = d.getHours()
    let m = d.getMinutes()
    let s = d.getSeconds()

    const k = this.dayBack

    if (k) h += 24

    let sh = h < 10 ? '0' + h : '' + h
    let sm = m < 10 ? '0' + m : '' + m

    let ss = s < 10 ? '0' + s : '' + s;


    return `${sh}:${sm}:${ss}`

  }


  function onYtpTimeDisplayHover(evt) {

    const promiseReady = new Promise((resolve) => {

      if (document.querySelector('#live-time-display-dom')) {
        resolve()
        return;
      }

      // evt.target.style.position='relative';
      let p = createElement();
      p.id = 'live-time-display-dom';
      p.setAttribute('hidden', '');
      let events = {}
      let controller = null;
      let running = false;
      const loop = async (o) => {
        const { formatDates, video } = o;

        if (!formatDates || !video) return;

        while (true) {


          if (!running) return;




          let k = formatDates.broadcastBeginAt;
          if (k) {
            let dt = new Date(k);
            dt.setTime(dt.getTime() + video.currentTime * 1000);

            let t = formatDateFn(dt) + ' ' + formatTimeFn(dt);
            if (controller.data.tooltip !== t) {

              controller.data.tooltip = t;
              controller.data = Object.assign({}, controller.data);
            }
          }



          // controller.data.tooltip=Date.now()+"";
          //  controller.data = Object.assign({}, controller.data);

          if (!running) return;
          await new Promise(requestAnimationFrame);


        }
      }
      let pres = {
        'mouseenter': function (evt) {

          if (!controller) return -1;
          running = true;
          const formatDates = getFormatDates();
          const video = document.querySelector('#movie_player video');


          // controller.data.tooltip=Date.now()+"";
          // controller.data = Object.assign({}, controller.data);

          if (formatDates && video && formatDates.broadcastBeginAt) {
            loop({ formatDates, video });

          } else {
            if (controller.data.tooltip) {

              controller.data.tooltip = '';
              controller.data = Object.assign({}, controller.data);
            }

            return -1;
          }



        }, 'mouseleave': function () {



          if (!controller) return -1;
          if (!running) return -1;
          running = false;



        }
      };

      const eventHandler = function (evt) {
        const res = pres[evt.type].apply(this, arguments);
        if (res === -1) return;
        return events[evt.type].apply(this, arguments);
      };

      p.addEventListener = function (type, fn, opts) {
        if (type === 'mouseenter' || type === 'mouseleave') {
          if (controller === null) {
            let cnt = insp(this);
            if (cnt.data !== null) {
              controller = cnt;
              if (!('data' in evt.target)) evt.target.data = controller.data;
            }
          }
          events[type] = fn;
          evt.target.addEventListener(type, eventHandler, opts);
        }
        // console.log(155, type, fn, opts)
      }
      // p.style.position='relative';
      p.style.position = 'absolute'
      evt.target.insertBefore(p, evt.target.firstChild);

      Promise.resolve().then(() => {
        if (!events.mouseenter || !events.mouseleave) {
          return p.remove();
        }
        HTMLElement.prototype.querySelector.call(p, 'yt-button-shape').remove();

        let tooltip = HTMLElement.prototype.querySelector.call(p, 'tp-yt-paper-tooltip');
        if (!tooltip) return p.remove();

        const rect = evt.target.getBoundingClientRect()
        p.style.width = rect.width + 'px';
        p.style.height = rect.height + 'px';

        let tooltipCnt = insp(tooltip);
        if (tooltip && tooltipCnt.position === 'bottom') {
          tooltipCnt.position = 'top';
        }

        tooltip.removeAttribute('fit-to-visible-bounds');
        tooltip.setAttribute('offset', '0');
        p.removeAttribute('hidden')

        if (evt.target.matches(':hover')) {
          eventHandler.call(evt.target, { type: 'mouseenter', target: evt.target });
        }

      }).then(resolve);

    });

    promiseReady.then(() => {
      let dom = document.querySelector('#live-time-display-dom');
      if (!dom) return;
      // evt.target.data.tooltip=
    })

  }

  document.addEventListener('animationstart', (evt) => {

    if (evt.animationName === 'ytpTimeDisplayHover') onYtpTimeDisplayHover(evt);

  }, capturePassive);

  const styleOpts = {
    id: 'vEXik',
    textContent: `

    @keyframes ytpTimeDisplayHover {
      0% {
        background-position-x: 3px;
      }
    
      100% {
        background-position-x: 4px;
      }
    
    }
    
    ytd-watch-flexy #movie_player .ytp-time-display:hover {
      animation: ytpTimeDisplayHover 1ms linear 120ms 1 normal forwards;
    }
    
    #live-time-display-dom {
      position: absolute;
      pointer-events: none;
    }
    
    #live-time-display-dom yt-button-shape {
      display: none;
    }
    
    @supports (-webkit-text-stroke:0.5px #000) {
      #live-time-display-dom tp-yt-paper-tooltip #tooltip {
        background: transparent;
        color: #fff;
        -webkit-text-stroke: 0.5px #000;
        font-weight: 700;
        font-size: 12pt;
      }
    
    }

  `

  };

  function onReady() {

    document.head.appendChild(Object.assign(document.createElement('style'), styleOpts));

  }

  Promise.resolve().then(() => {

    if (document.readyState !== 'loading') {
      onReady();
    } else {
      window.addEventListener("DOMContentLoaded", onReady, false);
    }

  });

})({ Promise, requestAnimationFrame });