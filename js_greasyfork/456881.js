// ==UserScript==
// @name               跟踪链接净化
// @name:zh-CN         跟踪链接净化
// @name:zh-TW         跟蹤鏈接凈化
// @name:en            Clean Tracking URLs
// @name:ja            トラッカーの浄化
// @name:ko            추적 URL 정리
// @name:ru            Очистить ссылки отслеживания
// @name:de            Tracking-URLs bereinigen
// @name:fr            Nettoyer les URLs de suivi
// @name:es            Limpiar URLs de seguimiento
// @namespace          https://github.com/cilxe/JavaScriptProjects
// @author             cilxe
// @version            0.7.8
// @description        净化所有网站上的跟踪链接和事件
// @description:zh-CN  净化所有网站上的跟踪链接和事件
// @description:zh-TW  凈化網際網路上的所有網站鏈接和事件
// @description:en     Clean all tracking URLs, block tracking events on all websites
// @description:ja     すべてのサイトの追跡リンクとイベントをサニタイズする
// @description:ko     모든 추적 URL 정리, 모든 웹사이트에서 추적 이벤트 차단
// @description:ru     Очистить все ссылки отслеживания, заблокировать события отслеживания на всех веб-сайтах
// @description:de     Alle Tracking-URLs bereinigen, Tracking-Ereignisse auf allen Websites blockieren
// @description:fr     Nettoyer toutes les URLs de suivi, bloquer les événements de suivi sur tous les sites
// @description:es     Limpiar todas las URLs de seguimiento, bloquear eventos de seguimiento en todos los sitios web
// @match              *://*/*
// @exclude            /^https?:\/\/([a-z0-9-.]{0,52})(hdslb.com|csdnimg.cn)\/.*$/
// @run-at             document-start
// @grant              GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @icon               data:image/png;base64,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
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/456881/%E8%B7%9F%E8%B8%AA%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456881/%E8%B7%9F%E8%B8%AA%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
/*
## Main features
- Auto clean up all URLs and block tracking events by default.
- Manually clean all links with keyboard shortcuts (Shift + Alt + X). `(v0.6.3~)`

## Additional features (via the script menu)
- Manually clean up the links again. `(v0.5.2~)`
- Add specific tracking params for the current site (match by domain). `(v0.6.1~)`
- Remove custom added params for the current site (match by domain). `(v0.6.2~)`

## Websites that support common cleaning
- All websites on the internet.

## Websites that support additional cleaning
- Bilibili
- Baidu (Unencrypted) URLs
- CSDN
- Alibaba sites
  - alibaba.com/aliyun.com/alibabagroup.com/alimama.com
  - taobao.com/tmall.com/tmall.hk/1688.com/aliexpress.com/trendyol/lazada
  - youku.com
- Douyin/Tiktok.com
- Amazon
- Youtube
*/
(() => {
  const DELAY_TIME = { fast: 600, normal: 1000, slow: 3000 };
  const doc = document;
  const pageHost = window.location.hostname;
  const pageURL = window.location.href;
  const pagePath = window.location.pathname;
  let topScroll = 0;
  let isLogin = false;
  const hostRegex = /[a-z0-9-]{1,128}\.[a-z]{2,15}$/;
  // Matches all tracking parameters *contains/starts/ends* with the name
  const paramsRegStr = '^(spm|from_|ref_|track|trk|share_|embeds_|refer_)|'
  + '_from$|scm|referrer';
  let paramsReg = new RegExp(paramsRegStr);

  const commonParams = ['spm', 'mkt', 'src', 'from', 'source', 'alias',
    'vd_source', 'brand', 'curator_clanid', 'snr', 'redir', 'sprefix',
    'utm_id', 'utm_content', 'utm_source', 'utm_medium', 'utm_sources',
    'utm_term', 'utm_campaign', 'utm_referrer', 'utm_keyword', 'ref',
    'feature'];

  // Tracking or other params for certain sites
  const bilibiliParams = ['vd_source', 'hotRank', 'launch_id', 'popular_rank',
    'session_id', 'business', 'sort_field', 'is_room_feed', 'visit_id',
    'is_live_full_webview', 'is_live_webview', 'vt', 'theme', 'noReffer',
    'timestamp', 'unique_k', 'hasBack', 'noTitleBar', 'plat_id', 'is_preview',
    'buvid', 'up_id', 'is_story_h5', 'hybrid_set_header', 'lottery_id', 'seid',
    '-Abrowser', 'from', 'pagefrom', 'schema', 'preUrl', 'jumpLinkType',
    'referfrom', 'spm_id', 'plat_id', 'p2p_type', 'broadcast_type',
    'event_source_type'];
  // 'share_medium', 'share_plat', 'share_source', 'share_tag'
  // 'from_source', 'from_spmid', 'goFrom', 'sourceFrom', 'share_session_id'
  // 'refer_from', 'spm_id_from',  'dynamicspm_id_from', 'extra_jump_from'
  // 'search_source', 'bsource', 'msource', 'csource'
  // 'p2p_type', 'broadcast_type', 'event_source_type'
  const biliParamsReg = /^(utm_|share_|spm|from_)|(From|_from|source)$/;

  const baiduParams = ['rsv_idx', 'hisfilter', 'rsf', 'rsv_pq', 'rsv_t', 'qid', // baidu
    'rsv_dl', 'oq', 'gpc', 'usm', 'tfflag', 'bs', 'rqlang', 'tn',
    'sc_us', 'wfr', 'fenlei', 'platform', 'rqid', 'base_query', 'entry', 'qbl',
    'for', 'from', 'topic_pn', 'rsp', 'rs_src', 'f', 'rsv_page', 'dyTabStr',
    'ct', 'lm', 'site', 'sites', 'fr', 'cl', 'bsst', 'lid', 'rsv_spt',
    'rsv_bp', 'src', 'sfrom', 'refer', 'zp_fr', 'channel', 'p_from', 'n_type',
    'eqid', '_at_', 'sa', 'pd', 'source', 'tag_key', 'uname', 'uid',
    'fromModule', 'lemmaFrom', 'structureId', 'structureClickId', 'ie',
    'structureItemId', 'xzhid', 'rsv_enter', 'rsv_btype', 'prefixsug',
    'client_type', 'task', 'locate', 'page', 'type', 'is_new_user', 'frwh', // tieba
    'obj_id', 'fid', 'fname', '_t', 'topic_name', 'frs', 'share_from', 'tpl',
    'u', 'tb_mod', 'tb_fr', 'share', 'sfc', 'idfrom', 'client_version', 'st',
    'qq-pf-to',
    'unique', 'is_video', '_wkts_', 'ai', 'ck', 'shh', // wenku
    'utm_source', 'utm_medium', 'utm_term', 'utm_campaign', 'utm_content',
    'utm_id',
  ];

  const douyinParams = ['rsv_idx', 'hisfilter', 'source', 'aid', 'enter_from',
    'focus_method', 'previous_page', 'extra_params', 'gid', 'enter_method', // douyin
    'is_from_webapp', 'sender_device', 'web_id']; // tiktok

  // 'from_wecom', 'source', 
  const csdnParams = commonParams.concat(['ops_request_misc', 'request_id',
    'biz_id', 'ydreferer', 'usp']);

  const youkuTudouParams = ['spm', 'scm', 'from', 's', 'playMode', 'client_id'];

  const aliSitesStr = '(alibaba|alibabagroup|aliyun|alimama|aliexpress'
  + '|taobao|tmall|1688|jiyoujia|fliggy)'
  + '.(com|hk|cn)$|(lazada|trendyol).[a-z.]{2,15}$';
  const aliSitesReg = new RegExp(aliSitesStr);

  const aliParams = [
    'spm', 'acm', 'scm', 'scene', 'from', 'pvid', 'pvid2',
  ]; // 'wh_pid', 'wh_random_str', 'wx_navbar_transparent', 'wh_weex'
  const aliParamsRegStr = '^(utm_|spm_|from_|ref|track|wh_|wx_)';
  const aliParamsReg = new RegExp(aliParamsRegStr);

  const amaznParams = ['content-id', 'qid', 'crid', 'isAmazonFulfilled',
    'sbo', 'plattr', 'sprefix', 'ld', '_encoding', 'ie', 'ds',
  ];
  const amznParamsRegStr = '_ref|^(utm_|ref|pd_rd_|pf_rd_|track|sc_)';
  const amznParamsReg = new RegExp(amznParamsRegStr, 'i');

  const ytParams = commonParams.concat(['embeds_referring_euri', 'embeds_euri',
    'source_ve_path', 'feature', 'embeds_referring_origin', 'redir_token',
    'pp', 'origin', 'ab_channel', 'enablejsapi', 'widgetid']);

  // If <true> block [Lucky Draw (The Selection)] popups on live.bilibili.com.
  const BlockLivePopups = true;

  // Add a custom 'urlchange' event to pushState and replaceState
  (() => { //  [https://stackoverflow.com/a/52809105]
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    window.history.pushState = function pushState(...args) {
      const newPushState = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('urlchange'));
      return newPushState;
    };
    window.history.replaceState = function replaceState(...args) {
      const newReplaceState = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('urlchange'));
      return newReplaceState;
    };
  })();
  //  Restore history state, remove redundant parameters
  function restoreState(siteParams) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
    Array.from(params.keys()).forEach((k) => {
      if (paramsReg.test(k)) { params.delete(k); }
    });
    if (url.href !== window.location.href) {
      window.history.replaceState({}, 'Restore', url.href);
    }
  }
  let cleanLinks; // Clean most of <a> links
  switch (true) {
    case aliSitesReg.test(pageHost): // Alibaba sites      
      cleanLinks = (siteParams) => {
        const links = doc.getElementsByTagName('a');
        for (let i = 0; i < links.length; i += 1) {
          if (hostRegex.test(links[i].hostname)) {
            const url = new URL(links[i].href);
            const params = url.searchParams;
            if (params.has('q')) { params.set('q', links[i].innerText); } // //  1. Ali sites (decoding error)
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            Array.from(params.keys()).forEach((k) => { if (aliParamsReg.test(k)) { params.delete(k); } });
            if (links[i].href !== url.href) { links[i].href = url.href; }
          }
        }
        const areaLinks = doc.getElementsByTagName('area');
        for (let i = 0; i < areaLinks.length; i += 1) {
          if (hostRegex.test(areaLinks[i].hostname)) {
            const url = new URL(areaLinks[i].href);
            const params = url.searchParams;
            if (params.has('q')) { params.set('q', areaLinks[i].innerText); } // //  1. Ali sites (decoding error)
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            Array.from(params.keys()).forEach((k) => { if (aliParamsReg.test(k)) { params.delete(k); } });
            if (areaLinks[i].href !== url.href) { areaLinks[i].href = url.href; }
          }
        }
      };
      break;
    case /baidu.com$/.test(pageHost): // Baidu sites
      cleanLinks = (siteParams) => {
        const links = doc.getElementsByTagName('a');
        for (let i = 0; i < links.length; i += 1) {
          if (hostRegex.test(links[i].hostname)) {
            const url = new URL(links[i].href);
            const params = url.searchParams;
            if (links[i].hostname === 'passport.baidu.com' && siteParams.includes('u')) {
              siteParams.splice(siteParams.indexOf('u'), 1);
            }
            if (links[i].innerText === '应用中心') { params.set('kw', links[i].innerText); } //  2. Tieba.baidu.com            
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            if (url.href !== links[i].href) { links[i].href = url.href; }
          }
        }
      };
      break;
    case /(bilibili|biligame)\.com$/.test(pageHost):
      cleanLinks = (siteParams) => {
        const links = doc.getElementsByTagName('a');
        for (let i = 0; i < links.length; i += 1) {
          if (hostRegex.test(links[i].hostname)) {
            links[i].removeAttribute('data-mod');
            links[i].removeAttribute('data-spmid');
            links[i].removeAttribute('data-idx');
            links[i].removeAttribute('data-target-url');
            const url = new URL(links[i].href);
            const params = url.searchParams;
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            Array.from(params.keys()).forEach((k) => { if (biliParamsReg.test(k)) { params.delete(k); } });
            if (links[i].href !== url.href) { links[i].href = url.href; }
          }
          // 3. Bilibili
          // Clean <a> link data-url on video/bangumi of bilibili.com
          const dataLink = links[i].getAttribute('data-url');
          if (/^(https?:\/\/|\/\/)[a-zA-Z0-9-.]{1,128}\.[a-z]{2,15}/.test(dataLink)) {
            let dlURL;
            if (dataLink.startsWith('//')) {
              dlURL = new URL(`https:${dataLink}`);
            } else {
              dlURL = new URL(dataLink);
            }
            const dlParams = dlURL.searchParams;
            if (dlURL.hostname.endsWith('bilibili.com')) {
              Array.from(dlParams.keys()).forEach((k) => { if (biliParamsReg.test(k)) { dlParams.delete(k); } });
              siteParams.forEach((k) => { if (dlParams.has(k)) { dlParams.delete(k); } });
            } else {
              const dlParamsReg = paramsReg;
              Array.from(dlParams.keys()).forEach((k) => { if (dlParamsReg.test(k)) { dlParams.delete(k); } });
              commonParams.forEach((k) => { if (dlParams.has(k)) { dlParams.delete(k); } });
            }
            links[i].href = dlURL.href;
            links[i].classList.remove('jump-link');
            links[i].target = '_blank';
            if (links[i].innerText.startsWith(dlURL.href)) {
              links[i].innerText = dlURL.href;
            }
          }
        }
      };
      break;
    case /amazon\.[a-z.]{2,15}$/.test(pageHost):
      cleanLinks = (siteParams) => {
        const links = doc.getElementsByTagName('a');
        for (let i = 0; i < links.length; i += 1) {
          if (hostRegex.test(links[i].hostname)) {
            const url = new URL(links[i].href);
            const params = url.searchParams;
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            Array.from(params.keys()).forEach((k) => { if (amznParamsReg.test(k)) { params.delete(k); } });
            if (links[i].href !== url.href) { links[i].href = url.href; }
          }
          if (/amazon\.[a-z.]{2,15}$/.test(links[i].hostname)) { // 4. Amazon
            if (links[i].pathname.includes('/ref')) {
              links[i].pathname = links[i].pathname.substring(links[i].pathname.indexOf('/ref'), 1);
            }
          }
        }
      };
      break;
    case /google\.[a-z.]{2,15}$|about.google$/.test(pageHost):
      cleanLinks = (siteParams) => {
        const links = doc.getElementsByTagName('a'); const iParamsReg = paramsReg;
        for (let i = 0; i < links.length; i += 1) {
          if (hostRegex.test(links[i].hostname)) {
            const url = new URL(links[i].href);
            const params = url.searchParams;
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            Array.from(params.keys()).forEach((k) => { if (iParamsReg.test(k)) { params.delete(k); } });
            if (links[i].href !== url.href) { links[i].href = url.href; }
            // Clean params at the hash of urls   // 5. Google
            if (/utm_/.test(url.hash)) {
              const ua = url.hash.substring(1).split('&');
              ua.forEach((key, index) => { if (/^utm_/.test(key)) ua.splice(index, 8); });
              links[i].hash = `#${ua.toString().replaceAll(',', '&')}`;
            }
          }
        }
      };
      break;
    default:
      cleanLinks = (siteParams) => {
        const links = doc.getElementsByTagName('a'); const iParamsReg = paramsReg;
        for (let i = 0; i < links.length; i += 1) {
          if (hostRegex.test(links[i].hostname)) {
            const url = new URL(links[i].href);
            const params = url.searchParams;
            siteParams.forEach((k) => { if (params.has(k)) { params.delete(k); } });
            Array.from(params.keys()).forEach((k) => { if (iParamsReg.test(k)) { params.delete(k); } });
            if (links[i].href !== url.href) { links[i].href = url.href; }
          }
        }
      };
      break;
  }
  function deferredCleanLinks(siteParams, delayTime) {
    const tid = setTimeout(() => {
      restoreState(siteParams); cleanLinks(siteParams); clearTimeout(tid);
    }, delayTime);
  }
  // Block link clicking events
  function blockClickEvents(siteParams, delayTime) {
    const tid = setTimeout(() => {
      const handleLinkClick = () => { cleanLinks(siteParams); };
      const handleLinkCM = (e) => { e.stopImmediatePropagation(); cleanLinks(siteParams); };
      const handleLinkClickN = () => { deferredCleanLinks(siteParams, 0); };
      const divs = doc.getElementsByTagName('div');
      for (let i = 0; i < divs.length; i += 1) {
        if (divs[i].className) {
          divs[i].removeEventListener('click', handleLinkClickN);
          divs[i].addEventListener('click', handleLinkClickN);
          divs[i].removeEventListener('auxclick', handleLinkCM);
          divs[i].addEventListener('auxclick', handleLinkCM);
          divs[i].removeEventListener('mousedown', handleLinkClick);
          divs[i].addEventListener('mousedown', handleLinkClick);
          divs[i].removeEventListener('keydown', handleLinkClick);
          divs[i].addEventListener('keydown', handleLinkClick);
        }
      }
      const btns = doc.getElementsByTagName('button');
      for (let i = 0; i < btns.length; i += 1) {
        if (btns[i].className) {
          btns[i].removeEventListener('click', handleLinkClickN);
          btns[i].addEventListener('click', handleLinkClickN);
        }
      }
      const links = doc.getElementsByTagName('a');
      for (let i = 0; i < links.length; i += 1) {
        if (hostRegex.test(links[i].hostname)) {
          // links[i].removeEventListener('mousedown', handleLinkCM); // mail.qq.com/web.telegram.org
          // links[i].addEventListener('mousedown', handleLinkCM);
          links[i].removeEventListener('keyup', handleLinkCM);
          links[i].addEventListener('keyup', handleLinkCM);
          links[i].removeEventListener('click', handleLinkClick);
          links[i].addEventListener('click', handleLinkClick);
          links[i].removeEventListener('auxclick', handleLinkClick);
          links[i].addEventListener('auxclick', handleLinkClick);
          links[i].removeEventListener('contextmenu', handleLinkCM);
          if (links[i].ontouchstart === undefined) {
            links[i].addEventListener('contextmenu', handleLinkCM);
          }
        }
      }
      clearTimeout(tid);
    }, delayTime);
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Custom clean ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  // Youku, Tudou, Douyin, Amazon
  function customClean(siteParams) {
    restoreState(siteParams); cleanLinks(siteParams);
    let x = 0; let y = 0;
    doc.addEventListener('pointermove', (e) => {
      if (Math.abs(e.clientX - x) > 20 || Math.abs(e.clientY - y) > 20) {
        cleanLinks(siteParams); x = e.clientX; y = e.clientY;
      }
    });
    doc.addEventListener('DOMContentLoaded', () => {
      blockClickEvents(siteParams, 0);
    });
  }
  // Hide elements (common)
  function hideElement(attrs, intervals, duration, isRemove) {
    const intervalID = setInterval(() => {
      attrs.forEach((attr) => {
        if (document.querySelector(attr)) {
          if (!isRemove) {
            document.querySelector(attr).style.visibility = 'hidden';
          } else {
            document.querySelector(attr).remove();
          }
        }
      });
    }, intervals);
    document.addEventListener('DOMContentLoaded', () => {
      const timeoutId = setTimeout(() => {
        clearInterval(intervalID); clearTimeout(timeoutId);
      }, duration);
    });
  }
  // Auto close (common)
  function autoClick(attrs, attrIndex, intervals, duration) {
    const intervalID = setInterval(() => {
      attrs.forEach((attr) => {
        const closeBtn = document.querySelectorAll(attr)[attrIndex];
        if (closeBtn) { closeBtn.click(); }
      });
    }, intervals);
    document.addEventListener('DOMContentLoaded', () => {
      const timeoutId = setTimeout(() => {
        clearInterval(intervalID); clearTimeout(timeoutId);
      }, duration);
    });
  }
  // Auto close (mutation observer)
  function autoClose(loginWindow, closeButton, loginButton, timeout) {
    doc.addEventListener('DOMContentLoaded', () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (document.querySelector(loginWindow)) {
              if (node.querySelector(closeButton) && !isLogin) {
                console.info('Auto Cloesd!');
                node.querySelector(closeButton).click();
              }
            }
          });
        });
      });
      observer.observe(doc, { childList: true, subtree: true });
      if (isLogin) {
        const timeoutID = setTimeout(() => {
          loginButton.addEventListener('click', () => {
            isLogin = true;
            observer.disconnect();
          });
          clearTimeout(timeoutID);
        }, DELAY_TIME.normal * 2);
      } else { // Set timeout to disconnect observer whithout login button
        const timeoutID = setTimeout(() => {
          isLogin = true;
          observer.disconnect();
          clearTimeout(timeoutID);
        }, timeout);
      }
    });
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Common sites ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  function commonClean() {
    switch (true) { // additional params for certain sites
      case /google\.[a-z.]{2,15}$|(about|wellbeing).google/.test(pageHost):
        commonParams.push(
          'device',
          'pcampaignid',
          'subid',
          'hl',
          'fg',
          'ved',
          'ei',
          'prev',
          'sig',
          'sca_esv',
          'visit_id',
          'dest_src',
        );
        break;
      case pageHost.endsWith('facebook.com'):
        commonParams.push(
          'privacy_mutation_token',
          'ars',
          'helpref',
          'search_session_id',
          'entry_point',
          'campaign_id',
          'nav_source',
          'placement',
          'privacy_source',
          '__cft__[0]',
          '__tn__',
        );
        break;
      case /(twitter|x)\.com$/.test(pageHost):
        commonParams.push('screen_name');
        break;
      case pageHost.endsWith('reddit.com'):
        commonParams.push('embed_host_url', 'actionSource', 'shreddit');
        paramsReg = /^(utm_|spm_|from_|ref|track|trk|experiment_d2x_|experiment_mweb)/;
        break;
      case pageHost.endsWith('linkedin.com'):
        commonParams.push( // 'trk' , 'trkInfo'
          'original_referer',
          'origin',
          'upsellOrderOrigin',
          'lipi',
          'desktopBackground',
          'profileFormEntryPoint',
          'entityUrn',
          'veh',
          'miniCompanyUrn',
          'courseSlug',
          'upsellTrk',
          'upsellTrackingId',
          'contextUrn',
          'ct',
          'pt',
          'refId',
          'position',
        );
        document.addEventListener('DOMContentLoaded', () => {
          blockClickEvents(commonParams, 8500);
          deferredCleanLinks(commonParams, DELAY_TIME.normal * 2);
        });
        break;
      case pageHost.endsWith('dzen.ru'):
        commonParams.push(
          'lang',
          'country_code',
          'rid',
          'clid',
          'stid',
          'issue_tld',
          'parent_rid',
          'persistent_id',
          'story',
          't',
          'utr',
          'place',
          'secdata',
          'integration',
          'feed_exp',
          'force_common_feed',
          'feed_filter_type',
          'feed_filter_source',
        );
        break;
      case pageHost.endsWith('vk.com'):
        commonParams.push('scheme', 'initial_stats_info');
        break;
      case /(microsoft|bing|xbox|skype|office|microsoft365)\.com$/.test(pageHost):
        commonParams.push(
          'ocid',
          'OCID',
          'ICID',
          'icid',
          'CLCID',
          'clcid',
          'es',
          'response_mode',
          'exp',
          'form',
          'FORM',
          'xr',
          'cat0',
          'culture',
          'country',
          'WT.mc_id',
          'uiflavor', // office
          'activetab',
          'fl',
          'client_id',
          'wreply',
          'cobrandid', // signin
          'deeplink',
          'referrer',
          'mode',
          'pos',
        );
        break;
      case /msn.(com|cn)$/.test(pageHost): // No effect on the [Shadow Root] elements.
        commonParams.push('ocid', 'cvid', 'ei', '.cn', 'fullscreen');
        break;
      case /bestbuy\.(com|ca)$/.test(pageHost):
        commonParams.push(
          'id',
          'ar',
          'cmp',
          'loc',
          'irgwc',
          'mpid',
          'irclickid',
          'intlreferer',
          'intl',
          'browsedCategory',
          'qp',
          'type',
          'usc',
          'iht',
          'ks',
          'sc',
          '_dyncharset',
          'icmp',
        ); // 'subId1', 'subId2', 'subId3', 'nrtv_cid', 'nrtv_as_src',
        paramsReg = /^(utm_|nrtv_|subId)/;
        break;
      case pageHost.endsWith('github.com'):
        commonParams.push('ref_cta', 'ref_loc', 'ref_page');
        break;
      case pageHost.endsWith('stackoverflow.com'):
        paramsReg = /^(utm_|spm_|from_|ref|track|trk|so_)/;
        break;
      case pageHost.endsWith('pixiv.net'):
        commonParams.push('provider');
        break;
      case pageHost.endsWith('music.apple.com'):
        commonParams.push('at', 'ct', 'itscg', 'itsct');
        break;
      case pageHost.endsWith('zhihu.com'):
        commonParams.push(
          'search_source',
          'hybrid_search_source',
          'hybrid_search_extra',
          'utm_psn',
        );
        autoClose(
          '.Modal-content',
          '.Modal-closeButton',
          doc.querySelector('.AppHeader-profile button'),
          2000,
        );
        break;
      case /(163|126|yeah)\.(com|net)$/.test(pageHost):
        commonParams.push('scene', 'session_id', 'fromDlpro', 'dltype');
        break;
      case pageHost.endsWith('weibo.com'):
        commonParams.push(
          'mark_id',
          'entry',
          '_rand',
          'sudaref',
          'refer',
          'band_rank',
          'gid',
          'ua',
        );
        break;
      case pageHost.endsWith('qq.com'):
        commonParams.push('ADTAG', 'fromSource');
        break;
      case /ebay\.[a-z.]{2,15}$/.test(pageHost):
        commonParams.push(
          '_trkparms',
          '_trksid',
          'ssPageName',
          'amdata',
          'mc',
          'hash',
          'epid',
          'var',
          '_ssn',
          'store_name',
          'requested',
          'itmprp',
          'itmmeta',
        );

        break;
      case pageHost.endsWith('jd.com'):
        commonParams.splice(commonParams.indexOf('utm_campaign'), 1);
        commonParams.push(
          'gx',
          'ad_od',
          'needRecommendFlag',
          'uabt',
          'd',
          '_fd',
          'pvid',
          'jxsid',
          'csid',
          'ss_projid',
          'scan_orig',
          'ss_expid',
          'ss_sexpid',
          'ss_ruleid',
          'ss_sruleid',
          'ss_symbol',
          'ss_mtest',
          'sceneval',
        );
        paramsReg = /^(track|wxa_|spm_|from_)/;
        break;
      case pageHost.endsWith('yangkeduo.com'):
        commonParams.push(
          'gx',
          'ad_od',
          'needRecommendFlag',
          'uabt',
          'd',
          'pxq_secret_key',
          'cpsSignjb_act',
          'launch_pdd',
          'customParameters',
          'duoduo_type',
          'goods_sign',
        );
        paramsReg = /^(track|from_|utm_|_oak_|_wv|_x_)/;
        break;
      case /(hoyolab|hoyoverse|mihoyo|miyoushe|mihoyogift)\.com$/.test(pageHost):
        // _auth_require _presentation_style _hide_status_bar _landscape _theme _theme_device
        commonParams.push('game_version', 'visit_device', 'device_type', 'plat_type');
        paramsReg = /^(track|utm|spm_|from_|hyl_|bbs_|mhy_)|_from$/;
        (() => {
          // /account.(hoyoverse|hoyolab).com$|user.miyoushe.com$/
          const css = document.createElement('style');
          css.innerText += 'body{overflow: auto !important}';
          doc.addEventListener('DOMContentLoaded', () => {
            document.head.append(css);
          });
        })();
        customClean(commonParams);
        break;
      case pageHost.endsWith('douban.com'):
        commonParams.push(
          'target_user_id',
          'dcs',
          'dcm',
          'dt_time_source',
          'channel',
          'fullscreen',
          'autorotate',
          'hidenav',
        );
        break;
      case /(imdb|boxofficemojo)\.com$/.test(pageHost):
        commonParams.push('rf', 'imdbPageAction', 'u', 'tag');
        paramsReg = amznParamsReg;
        break;
      case pageHost.endsWith('gitee.com'):
        (() => {
          const intervalID = setInterval(() => {
            if (doc.querySelector('.menu.transition.visible')) {
              doc.querySelector('.menu.transition.visible').style = 'display: none !important;';
            }
          }, 50);
          document.addEventListener('DOMContentLoaded', () => {
            const timeoutId = setTimeout(() => {
              clearInterval(intervalID); clearTimeout(timeoutId);
            }, 3000);
          });
        })();
        break;
      case pageHost.endsWith('xda-developers.com'):
        commonParams.push(
          'tag',
          'ascsubtag',
          'asc_refurl',
          'asc_campaign',
          'newsletter_popup',
        );
        break;
      case pageHost.endsWith('cctv.com'):
        commonParams.push('toc_style_id');
        break;
      case pageHost.endsWith('fiverr.com'):
        commonParams.push(
          'pckg_id',
          'funnel',
          'context_type',
          'context_alg',
          'imp_id',
          'pos',
          'seller_online',
          'context',
        );
        break;
      case pageHost.endsWith('newegg.com'):
        commonParams.push(
          'cm_sp',
          'nextpage',
        );
        break;
      case pageHost.endsWith('theverge.com'):
        commonParams.push(
          'u1',
          'tag',
          'ascsubtag',
          'subId1',
          'subId2',
          'subId3',
        );
        break;
      case pageHost.endsWith('bluestacks.com'):
        commonParams.push(
          'platform',
          'client_uuid',
          'app_pkg',
          'platform_cloud',
          'preferred_lang',
          'gaCookie',
          'gclid',
          'clickid',
          'msclkid',
          'affiliateId',
          'offerId',
          'transaction_id',
          'aff_sub',
          'first_landing_page',
          'user_id',
          'incompatible',
          'bluestacks_version',
          'referrer',
          'download_page_referrer',
        ); // win_version, mac_version, exit_utm_campaign, 
        // device_memory, device_cpu_cores
        paramsReg = /^device_|(_version|utm_campaign)$/;
        break;
      case pageHost.endsWith('xiaohongshu.com'):
        autoClose(
          '.login-container',
          '.close-button',
          doc.querySelector('.login-btn'),
          3700,
        );
        break;
      case pageHost.endsWith('nicovideo.jp'):
        commonParams.push(
          'cmnhd_ref',
          'device',
          'site',
          'pos',
        );
        break;
      default: break;
    }
    const params = commonParams; restoreState(params); cleanLinks(params);
    document.addEventListener('DOMContentLoaded', () => {
      blockClickEvents(params, 1200);
      deferredCleanLinks(params, 1000); deferredCleanLinks(params, 7000);
    });
    window.onscroll = () => {
      const scrolls = doc.documentElement.scrollTop;
      if (scrolls - topScroll > 120) { cleanLinks(params); topScroll = scrolls; }
    };
    return params;
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Bilibili ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  // Remove Bilibili metadata
  function removeBiliMetadData() {
    const metas = doc.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i += 1) {
      if (metas[i].name === 'spm_prefix') { metas[i].remove(); }
    }
  }
  // Remove Bilibili Annoyances [Login popups, Ads]
  function removeBiliAnnoyances(delayTime) {
    const tid = setTimeout(() => {
      let index = 0;
      do {
        const cardAds = doc.getElementsByTagName('a');
        for (let i = 0; i < cardAds.length; i += 1) {
          if (cardAds[i].hostname.endsWith('cm.bilibili.com')) {
            cardAds[i].parentNode.removeChild(cardAds[i]);
          } // bilibili ads
        }
        index += 1;
      } while (index < 2); // bilibili login tips
      const traceDivs = doc.getElementsByClassName('bili-video-card');
      for (let i = 0; i < traceDivs.length; i += 1) {
        if (traceDivs[i].getAttribute('data-report').includes('tianma.')) {
          traceDivs[i].setAttribute('data-report', '0');
        } // bilibili ads
      }
      /**
       * *******************************************************
       * *******************************************************
       */
      const rightEntyItems = doc.getElementsByClassName('right-entry-item')
       || doc.getElementsByClassName('item');
      if (rightEntyItems[0] && rightEntyItems[0].innerText.includes('登录')) {
        hideElement(['.lt-row', '.bili-login-card', '.bili-mini-mask',
          '.is-bottom', '.v-popover-content', '.unlogin-popover'], 30, 6000, false);
        const loginTab = rightEntyItems[0].getElementsByTagName('span')[0];
        if (/登录/.test(rightEntyItems[0].innerText) && loginTab) {
          loginTab.outerHTML = '<a href="https://passport.bilibili.com/login"'
            + ' target="_blank" onmouseup="cleanLinks(bilibiliParams)">登录</a>';
        }
      } clearTimeout(tid);
      doc.getElementById('right-bottom-banner').remove();
    }, delayTime);
  }
  // block clicking events (link, button, li)
  function blockBClickEvents() {
    const handleBClickBub = (e) => { e.stopImmediatePropagation(); };
    function blockBLinkEvents() {
      const links = doc.getElementsByTagName('a');
      for (let i = 0; i < links.length; i += 1) {
        if (links[i].getAttribute('data-video-time') === null && hostRegex.test(links[i].hostname)) {
          const isLinkJump = links[i].classList.contains('jump-link');
          const isLinkJumpVideo = links[i].classList.contains('video-time')
          || links[i].classList.contains('video');
          if (!(isLinkJump && isLinkJumpVideo)) {
            if (pageHost.endsWith('bilibili.com')) {
              links[i].removeEventListener('click', handleBClickBub);
              links[i].addEventListener('click', handleBClickBub);
            }
            links[i].removeEventListener('contextmenu', handleBClickBub);
            if (links[i].ontouchstart === undefined) {
              links[i].addEventListener('contextmenu', handleBClickBub);
            }
            links[i].removeEventListener('pointerdown', handleBClickBub);
            links[i].addEventListener('pointerdown', handleBClickBub);
          }
        }
      }
    }
    blockBLinkEvents();

    function deferredBlockBLinkEvents(delayTime) {
      const tid = setTimeout(() => {
        cleanLinks(bilibiliParams); removeBiliAnnoyances(0); blockBLinkEvents(); clearTimeout(tid);
      }, delayTime);
    }
    const handleClickFast = () => { deferredBlockBLinkEvents(DELAY_TIME.fast); };
    const buttons = doc.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i += 1) {
      if (buttons[i].className) {
        buttons[i].removeEventListener('click', handleClickFast);
        buttons[i].addEventListener('click', handleClickFast);
      }
    }
    const lines = doc.getElementsByTagName('li');
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].className && !lines[i].classList.contains('context-sub-menu-item')) {
        lines[i].removeEventListener('click', handleClickFast);
        lines[i].addEventListener('click', handleClickFast);
      }
    }
    // iframe - live
    if (pageURL.startsWith('https://live.bilibili.com/blackboard/dropdown')) {
      document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('click', (e) => { e.stopPropagation(); }, true);
      });
    }
  }
  function deferredBlockBClickEvents(delayTime) {
    restoreState(bilibiliParams);
    const tid = setTimeout(() => { blockBClickEvents(); clearTimeout(tid); }, delayTime);
  }
  // Loop execution when the mouse moves
  function bilibiliListenMoving() {
    let x = 0; let y = 0;
    if (/live.bilibili.com$/.test(pageHost)
      || /^https?:\/\/(www|m).bilibili\.com\/(video|bangumi)/.test(pageURL)) {
      window.onpointermove = (e) => {
        if (e.clientY < 200) {
          cleanLinks(bilibiliParams);
          blockBClickEvents();
        }
      };
    } else {
      window.onpointermove = (e) => {
        if (Math.abs(e.clientX - x) > 20 || Math.abs(e.clientY - y) > 20) {
          cleanLinks(bilibiliParams);
          blockBClickEvents();
          x = e.clientX; y = e.clientY;
        }
      };
    }
  }
  // Loop execution when scrolling
  function biliListenScrolling() {
    window.onscroll = () => {
      const scrolls = doc.documentElement.scrollTop;
      if (scrolls - topScroll > 120) {
        cleanLinks(bilibiliParams);
        removeBiliAnnoyances(0);
        blockBClickEvents();
        topScroll = scrolls;
      }
    };
  }
  // bilibili search events
  function blockBSearchItemEvents() {
    function blockSearchEvents() {
      // input suggested items
      const suggestItems = doc.getElementsByClassName('suggest-item');
      const handleBSearchClick = () => { deferredBlockBClickEvents(DELAY_TIME.fast); };
      if (suggestItems) {
        for (let i = 0; i < suggestItems.length; i += 1) {
          suggestItems[i].addEventListener('click', handleBSearchClick, true);
        }
      }
      // search trending items
      const topSearchs = doc.getElementsByClassName('trending-item');
      if (topSearchs) {
        for (let i = 0; i < topSearchs.length; i += 1) {
          topSearchs[i].addEventListener('click', handleBSearchClick, true);
        }
      }
      // search history items
      const historyItems = doc.getElementsByClassName('history-item');
      if (historyItems) {
        for (let i = 0; i < historyItems.length; i += 1) {
          historyItems[i].addEventListener('click', handleBSearchClick, true);
        }
      }
    }
    const handleBSearchClickB = () => {
      const tid = setTimeout(() => { blockSearchEvents(); clearTimeout(tid); }, DELAY_TIME.fast);
    };
    // search input area
    if (doc.querySelector('.search-input-el')) {
      doc.querySelector('.search-input-el').addEventListener('click', handleBSearchClickB, true);
    }
    // clear icon
    if (doc.querySelector('.clear-icon')) {
      doc.querySelector('.clear-icon').addEventListener('click', handleBSearchClickB, true);
    }
  }
  // search.bilibili.com/*
  function cleanBSearch() {
    blockBSearchItemEvents();
    // paging button clicking event
    const pageButtons = doc.getElementsByClassName('vui_pagenation--btn'); // div
    if (pageButtons) {
      for (let i = 0; i < pageButtons.length; i += 1) {
        pageButtons[i].addEventListener('click', () => { deferredBlockBClickEvents(DELAY_TIME.fast); }, true);
      }
    }
    deferredBlockBClickEvents(DELAY_TIME.normal); deferredCleanLinks(bilibiliParams, DELAY_TIME.slow - 600);
  }
  // www.bilibili.com/video/*
  function cleanBVideoURL() {
    cleanLinks(bilibiliParams);
    doc.addEventListener('DOMContentLoaded', () => {
      if (doc.querySelector('.rec-footer')) {
        doc.querySelector('.rec-footer').addEventListener('click', () => {
          deferredCleanLinks(bilibiliParams, DELAY_TIME.fast);
          deferredBlockBClickEvents(bilibiliParams, DELAY_TIME.fast);
        }, true);
      }
      // Clean copying of video URLs (copy share)
      let toolBar; let sharInner; let sharOuter;
      if (/^\/video\//.test(pagePath)) {
        toolBar = '#arc_toolbar_report'; sharOuter = 'share-btn-outer'; sharInner = 'share-btn-inner';
      } else if (/^\/bangumi\//.test(pagePath)) {
        toolBar = '.toolbar'; sharOuter = 'share-container-id'; sharInner = 'link_copy';
      }
      let vid; const url = new URL(window.location.href);
      const handleWriteText = () => { navigator.clipboard.writeText(pageURL); };
      if (doc.querySelector(toolBar)) {
        doc.querySelector(toolBar).addEventListener('pointermove', () => {
          if (doc.getElementById(sharOuter)) {
            doc.getElementById(sharOuter).removeEventListener('click', handleWriteText);
            doc.getElementById(sharOuter).addEventListener('click', handleWriteText);
            doc.getElementById(sharInner).addEventListener('click', (event) => {
              event.stopImmediatePropagation();
              if (doc.getElementById(sharInner).innerText.includes('精准')) {
                if (pagePath.indexOf('/video/') === 0) {
                  vid = doc.querySelector('video') || doc.querySelector('bwp-video'); // Chrome Firefox Edge ..
                } else if (pagePath.indexOf('/bangumi/') === 0) {
                  vid = doc.getElementsByTagName('video')[1] || doc.querySelector('bwp-video');
                }
                url.searchParams.set('t', vid.currentTime.toFixed(2));
                navigator.clipboard.writeText(url.toString());
              } else { navigator.clipboard.writeText(pageURL); }
            });
          }
        });
      }
    });
  }
  // live.bilibili.com/*
  function cleanBLive(delayTime) {
    // live.bilibili.com popups
    const livePopupBlock = (selection) => {
      if (selection && doc.getElementById('anchor-guest-box-id')) {
        doc.getElementById('anchor-guest-box-id').style.display = 'none';
      } else if (!selection) {
        doc.getElementById('anchor-guest-box-id').style.display = '';
      }
      const iframes = doc.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i += 1) {
        if (iframes[i].src.includes('live-lottery')) {
          if (selection) {
            iframes[i].style.visibility = 'hidden';
          } else {
            iframes[i].style.visibility = '';
          }
        }
      }
    };
    const tid1 = setTimeout(() => {
      const navis = doc.getElementsByClassName('tabs__tag-item'); // cat
      if (navis) {
        for (let i = 0; i < navis.length; i += 1) {
          navis[i].addEventListener('click', () => {
            deferredCleanLinks(bilibiliParams, DELAY_TIME.fast);
          }, true);
        }
      }
      const tabItems = doc.getElementsByClassName('tab-item'); // sort
      if (tabItems) {
        for (let i = 0; i < tabItems.length; i += 1) {
          tabItems[i].addEventListener('click', () => {
            blockBClickEvents();
            deferredCleanLinks(bilibiliParams, DELAY_TIME.fast);
          }, true);
        }
      } clearTimeout(tid1);
    }, delayTime);
    const intervalID = setInterval(
      livePopupBlock(BlockLivePopups),
      DELAY_TIME.normal * 2,
    );
    const tid2 = setTimeout(() => {
      clearInterval(intervalID);
      clearTimeout(tid2);
    }, DELAY_TIME.slow + 3000 * 300);
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Baidu ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  // Baidu related search, Hot search URL cleaning
  function cleanBaidu() {
    if (pageHost.endsWith('news.baidu.com')) {
      baiduParams.push('toc_style_id', 'share_to', 'track_id');
    }
    restoreState(baiduParams);
    function removeBDAds() {
      const searchAds = document.getElementsByClassName('EC_result');
      if (searchAds) {
        for (let i = 0; i < searchAds.length; i += 1) {
          searchAds[i].remove();
        }
      }
    }
    if (pageHost.endsWith('tieba.baidu.com') && baiduParams.includes('ie')) {
      baiduParams.splice(baiduParams.indexOf('ie'), 1);
    }
    function cleanBDLinks(siteParams) {
      cleanLinks(baiduParams);
      const links = doc.getElementsByTagName('a');
      for (let i = 0; i < links.length; i += 1) {
        if (hostRegex.test(links[i].hostname)) {
          if (links[i].hostname.endsWith('zhidao.baidu.com') && links[i].pathname === '/q') {
            links[i].pathname = '/search';
          }
          links[i].href = links[i].href.replace('from=', '');
        }
      }
      if (doc.querySelector('area')) {
        const areaURL = new URL(doc.querySelector('area').href);
        const params = areaURL.searchParams;
        siteParams.forEach((k) => {
          if (params.has(k)) { params.delete(k); }
        });
        doc.querySelector('area').href = areaURL.href;
      }
    }
    function blockBDTrackingEvents() {
      doc.addEventListener('DOMContentLoaded', () => {
        const links = doc.getElementsByTagName('a');
        for (let i = 0; i < links.length; i += 1) {
          if (links[i].href !== '') {
            links[i].addEventListener('click', () => {
              cleanBDLinks(baiduParams);
            }, true);
          }
        }
      });
    }
    cleanBDLinks(baiduParams); blockBDTrackingEvents();
    if (pagePath === '/s') removeBDAds();
    window.onscroll = () => {
      const scrolls = doc.documentElement.scrollTop;
      if (scrolls - topScroll > 120) {
        cleanLinks(baiduParams); topScroll = scrolls;
      }
      if (pagePath === '/s') { removeBDAds(); } // Baidu search ads
    };
    let x = 0; let y = 0;
    window.onpointermove = (e) => {
      if (Math.abs(e.clientX - x) > 20 || Math.abs(e.clientY - y) > 20) {
        cleanLinks(baiduParams); x = e.clientX; y = e.clientY;
      }
    };
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ CSDN ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  function cleanCSDN() {
    restoreState(csdnParams); deferredCleanLinks(csdnParams, DELAY_TIME.normal);
    // CSDN.net tracking events
    function blockCSDNEvents() {
      const links = doc.getElementsByTagName('a');
      for (let i = 0; i < links.length; i += 1) {
        if (links[i].hostname) {
          links[i].addEventListener('click', (e) => {
            e.stopImmediatePropagation();
          });
        }
      }
    }
    window.onpointermove = (e) => {
      if (e.clientY < 170 || e.clientY > 450) {
        cleanLinks(csdnParams); blockCSDNEvents();
      }
    };
    window.onscroll = () => {
      const scrolls = doc.documentElement.scrollTop;
      if (scrolls - topScroll > 120) {
        cleanLinks(csdnParams);
        blockCSDNEvents(); topScroll = scrolls;
      }
    };
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Ali Sites ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  function cleanAliSites() {
    switch (true) { // taobao.com/tmall.com/tmall.hk
      case /(taobao|tmall).(com|hk)$/.test(pageHost):
        aliParams.push(
          'scm2',
          'stats_click',
          'initiative_id',
          'source',
          'suggest',
          'suggest_query',
          'iconType',
          'traceId',
          'relationId',
          'union_lens',
          'ref',
          'ali_trackid',
          'ak',
          'detailSharePosition',
          'topOfferIds',
          'sp_abtk',
          'search_condition',
          'industryCatId',
          'tbSocialPopKey',
          'bxsign',
          'utparam',
          'eurl',
          'itemIds',
          'country',
          'epid',
          'user_number_id',
          'rootPageId',
          'lwfrom',
          'disableNav',
          'es',
          'rand',
          '_lgt_',
          'x5referer',
          'status_bar_transparent',
          'tracelog',
        );
        break;
      case pageHost.endsWith('fliggy.com'):
        aliParams.push('ad_id', 'am_id', 'cm_id', 'pm_id', '_k');
        break;
      case pageHost.endsWith('1688.com'):
        aliParams.push(
          'scm2',
          'topOfferIds',
          '__pageId__',
          'resourceId',
          'offerId',
          'offerIds',
          'object_id',
          'udsPoolId',
          'resultType',
          'cms_id',
          'pha_html',
          '__existtitle__',
          'object_type',
          'delivery_pool_id',
          'delivery_pool_type',
          'ilike_session',
          'tracelog',
          'clickid',
          'sessionid',
          'cosite',
          '_p_isad',
          'exp',
          'rootPageId',
          'lwfrom',
          'disableNav',
          'es',
          'hpageId',
        );
        break;
      case /(lazada|trendyol).[a-z.]{2-10}/.test(pageHost):
        aliParams.push(
          'shareUniqueId',
          'clickTrackInfo',
          'data_prefetch',
          'at_iframe',
          'prefetch_replace',
          'wc',
        );
        break;
      default: break;
    }
    restoreState(aliParams);
    deferredCleanLinks(aliParams, DELAY_TIME.slow);
    doc.addEventListener('DOMContentLoaded', () => {
      blockClickEvents(aliParams, DELAY_TIME.fast);
    });
    window.onscroll = () => {
      const scrolls = doc.documentElement.scrollTop;
      if (scrolls - topScroll > 120) {
        cleanLinks(aliParams);
        blockClickEvents(aliParams, 0); topScroll = scrolls;
      }
    };
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Youtube ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  function cleanYoutube() {
    function blockytLinksRedirection(timeout) {
      setTimeout(() => {
        const outerLinks = document.getElementsByClassName('yt-core-attributed-string--link-inherit-color');
        for (let i = 0; i < outerLinks.length; i += 1) {
          outerLinks[i].addEventListener('click', (e) => {
            e.stopPropagation();
          }, true);
        }
      }, timeout);
    }
    restoreState(ytParams); cleanLinks(ytParams);
    doc.addEventListener('DOMContentLoaded', () => {
      deferredCleanLinks(ytParams, DELAY_TIME.slow);
      blockClickEvents(ytParams, 0);
      blockytLinksRedirection(DELAY_TIME.normal * 2);
    });
    doc.addEventListener('contextmenu', () => {
      cleanLinks(ytParams);
      if (pagePath === '/results') {
        doc.addEventListener('pointerenter', (e) => {
          e.stopPropagation();
          cleanLinks(ytParams);
        }, true);
      }
      window.onscroll = () => {
        const scrolls = doc.documentElement.scrollTop;
        if (scrolls - topScroll > 120) {
          cleanLinks(ytParams);
          blockytLinksRedirection(0);
          topScroll = scrolls;
        }
      };
      // Modifications for CM of youtube player
      const shareURL = new URL('https://youtube.com/watch');
      if (new URL(pageURL).searchParams.has('list')) {
        shareURL.searchParams
          .set('list', new URL(pageURL).searchParams.get('list'));
      }
      if (pagePath.startsWith('/watch')) {
        shareURL.searchParams.set('v', new URL(pageURL).searchParams.get('v'));
        const videoCM = doc.getElementsByClassName('ytp-contextmenu')[0]
          .getElementsByClassName('ytp-menuitem');
        videoCM[1].addEventListener('click', () => {
          navigator.clipboard.writeText(shareURL.href);
        });
        videoCM[2].addEventListener('click', () => {
          shareURL.searchParams.set(
            't',
            doc.getElementsByTagName('video')[0].currentTime.toFixed(0),
          );
          navigator.clipboard.writeText(shareURL.href);
        });
      }
      if (pagePath.startsWith('/embed')) { // Embedded youtube videos
        shareURL.searchParams.set('v', pagePath.replace('/embed/', ''));
        const videoCM = doc.getElementsByClassName('ytp-contextmenu')[0]
          .getElementsByClassName('ytp-menuitem');
        videoCM[2].addEventListener('click', () => {
          navigator.clipboard.writeText(shareURL.href);
        });
        videoCM[3].addEventListener('click', () => {
          shareURL.searchParams.set(
            't',
            doc.getElementsByTagName('video')[0].currentTime.toFixed(0),
          );
          navigator.clipboard.writeText(shareURL.href);
        });
      }
    });
  }
  // ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦ Main Function ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
  (() => {
    // Menu language (May not change properly due to browser settings)
    let MenuClean; let MenuAddParams; let InputTitle; let invalidFormat;
    let MenuRemoveParam; let noSuchParam; let addedParamsMenu;
    let noCustomParamPrompt;
    switch (navigator.language) {
      case 'zh-CN' || 'zh-SG':
        MenuClean = '手动清理链接';
        MenuAddParams = '添加自定义参数（半角英文模式）';
        InputTitle = '请输入单个指定的参数（仅支持字母，数字，下划线，短破折号(-)与任意类型的括号）';
        invalidFormat = '无效的参数格式 ';
        MenuRemoveParam = '移除一个手动添加的参数（页面刷新后生效）';
        noSuchParam = '无此参数';
        addedParamsMenu = '已添加的自定义参数\n\n';
        noCustomParamPrompt = '暂未添加任何的自定义参数';
        break;
      case 'zh-TW' || 'zh-HK':
        MenuClean = '手動清理鏈接';
        MenuAddParams = '添加自定義参数（半角英文模式）';
        InputTitle = '請輸入單個指定的參數（僅支持字母，數字，下劃線，短破折號(-)與任意類型的括號）';
        invalidFormat = '無效的參數格式 ';
        MenuRemoveParam = '移除一個手動添加的參數（頁面刷新後生效）';
        noSuchParam = '無此參數';
        addedParamsMenu = '已添加的自定義參數\n\n';
        noCustomParamPrompt = '暫未添加任何的自定義參數';
        break;
      default: // English and others
        MenuClean = 'Retry link cleaning';
        MenuAddParams = 'Add a custom parameter (English Mode)';
        InputTitle = 'Please enter a single parameter below \n(only support '
          + 'letters, numbers, underscore, en-dash and all types of brackets):';
        invalidFormat = 'Not a valid parameter format ';
        MenuRemoveParam = 'Remove a custom parameter (Effect after refresh)';
        noSuchParam = 'No such parameter.';
        addedParamsMenu = 'Get all custom added params:\n\n';
        noCustomParamPrompt = 'No added custom parameters now!';
        break;
    } // -._~:/?#[]@!$&'()*+,;=
    // Add custom params from the Script menu (Submenu of addons)
    function addCustomParam(inputParam, storedArray) {
      if (/^[a-zA-Z0-9()[\]{}<>_-]*$/.test(inputParam)) {
        let list; // eslint-disable-next-line no-undef
        if (GM_getValue(pageHost)) { // eslint-disable-next-line no-undef
          list = GM_getValue(pageHost);
        } else {
          list = [];
        } // eslint-disable-next-line no-undef
        if (inputParam) { list.push(inputParam); GM_setValue(pageHost, list); }
        list.forEach((v) => {
          if (!storedArray.includes(v)) { storedArray.push(v); }
        });
      } else {
        alert(invalidFormat);
      }
    }
    // get all custom added param
    function getCustomParams() {
      let list; // eslint-disable-next-line no-undef
      if (GM_getValue(pageHost)) { // eslint-disable-next-line no-undef
        list = GM_getValue(pageHost);
      } else {
        list = [];
      } // eslint-disable-next-line no-undef
      return list;
    }
    // Remove a parameter that has been added from the script menu
    function removeCustomAddedParam(inputParam) {
      if (inputParam !== null && inputParam !== undefined) {
        let list; // eslint-disable-next-line no-undef
        if (GM_getValue(pageHost)) { // eslint-disable-next-line no-undef
          list = GM_getValue(pageHost);
        } else {
          list = [];
        }
        if (list.includes(inputParam)) {
          list = list.filter((item) => item !== inputParam); // eslint-disable-next-line no-undef
          GM_setValue(pageHost, list);
        } else {
          alert(noSuchParam);
        }
      }
    }
    let siteParams;// For script menu
    switch (true) {
      case pageHost.endsWith('youtube.com'):
        siteParams = ytParams; cleanYoutube(siteParams);
        break;
      case pageHost.endsWith('baidu.com'):
        siteParams = baiduParams; cleanBaidu(); cleanLinks(baiduParams);
        break;
      case /amazon\.[a-z.]{2,15}$/.test(pageHost):
        siteParams = amaznParams; paramsReg = amznParamsReg;
        customClean(siteParams, paramsReg);
        break; // REST:  space passport account message member t app manga show link biligame mall pay
      case /(bilibili|biligame)\.com$/.test(pageHost): //  && pagePath !== '/mall/upower-pay/'
        siteParams = bilibiliParams; paramsReg = biliParamsReg;
        restoreState(bilibiliParams);
        cleanLinks(bilibiliParams);
        blockBClickEvents();

        if (pageHost.endsWith('www.bilibili.com')) cleanBVideoURL();
        if (pageHost.endsWith('search.bilibili.com')) cleanBSearch();
        if (pageHost.endsWith('live.bilibili.com')) cleanBLive(DELAY_TIME.normal);
        doc.addEventListener('DOMContentLoaded', () => {
          biliListenScrolling(); bilibiliListenMoving();
          removeBiliMetadData();
          deferredBlockBClickEvents(1000);
        });
        break;
      case aliSitesReg.test(pageHost):
        siteParams = aliParams; paramsReg = aliParamsReg;
        cleanAliSites();
        break;
      case pageHost.endsWith('csdn.net'):
        siteParams = csdnParams; cleanCSDN();
        break;
      case /(youku|tudou)\.com$/.test(pageHost):
        siteParams = youkuTudouParams; paramsReg = aliParamsReg;
        customClean(siteParams);
        break;
      case /(tiktok|douyin)\.com$/.test(pageHost):
        siteParams = douyinParams; customClean(siteParams);
        // '#login-pannel', '.dy-account-close',
        break;
      default:
        siteParams = commonClean();
        break;
    }
    addCustomParam('', siteParams);
    // show all custom added param
    function showCustomParams() {
      const list = getCustomParams(siteParams);
      if (list.length > 0) {
        alert(addedParamsMenu + list.join(', '));
      } else {
        alert(noCustomParamPrompt);
      }
    } // eslint-disable-next-line no-undef
    GM_registerMenuCommand(MenuClean, () => { // Menu: Retry clean all links
      restoreState(siteParams);
      cleanLinks(siteParams);
      console.log(baiduParams);
    }, 'C');
    // eslint-disable-next-line no-undef
    GM_registerMenuCommand(MenuAddParams, () => { // Menu: Add a custom param
      addCustomParam(prompt(InputTitle, ''), siteParams);
    });
    // eslint-disable-next-line no-undef
    GM_registerMenuCommand(MenuRemoveParam, () => { // Menu: Remove a custom param
      const list = getCustomParams(siteParams);
      if (list.length > 0) {
        const inputParam = prompt(`${addedParamsMenu + list.join(', ')}`, '');
        removeCustomAddedParam(inputParam);
      } else {
        alert(noCustomParamPrompt);
      }
    });
    // eslint-disable-next-line no-undef
    GM_registerMenuCommand(addedParamsMenu, showCustomParams);

    window.addEventListener('urlchange', () => {
      restoreState(siteParams);
      cleanLinks(siteParams);
      blockClickEvents(siteParams, 0);
    });
    window.addEventListener('keydown', (e) => { // [Alt + Shift + X]
      if (e.key === 'X' && e.altKey && e.shiftKey) {
        restoreState(siteParams);
        cleanLinks(siteParams);
        if (pageHost.includes('bilibili.com')) removeBiliAnnoyances(0);
      }
    });
  })();
})();

/*
# Changelog
v0.7.8 2024.09.27  
- Clear more tracking elements on bilibili|nicovideo|google|microsoft|ebay.
- Optimised the clean condtions on baidu search result.
- Various script optimisations.
- Add some menus to get or delete custom added params. (Thanks to @JerryYang-30)

v0.7.7 2024.03.21  
- Fix some issues on douyin.com|hoyolab.com under certain conditions.
- Fix an issus that this script may keep preventing users to pay for bili ups.
- Certain functions optimisations.

v0.7.6.2 2024.03.14  
- Fix an issue that certain pages of bilibili may not be functional.

v0.7.6.1 2024.03.12  
- Fix an issue that certain pages of bilibili may not be functional.

v0.7.6 2024.03.12  
- Clean more parameters on google.com.
- Remove a banner ad on bilibili's video page.
- Adjust cleanup scope on t.bilibili.com.
- Fix an issue that some contents may not be loaded properly on Zhihu or other sites.

v0.7.5 2023.11.21  
- Resotore necessary parameters for baidu.com|qq.com in some cases.
- Minor adjustments.

v0.7.4 2023.10.22  
- Clean more tracking parameters on 1688|microsoft|linkedin|bluestacks.com and for all.
- Skip the links redirection on youtube video.
- Minor improvements.

v0.7.3 2023.09.28  
- Clean more tracking parameters on (newegg|bestbuy|skype|office|microsoft365|douban).com.
- Minor issue fixes.

v0.7.2 2023.09.16  
- Fixed an issue that some prompts unable to close on live.bilibili.com.
- Fixed an issue that some contents may not be loaded properly.
- Fixed an issue that certain login prompts may failed to popup.

v0.7.1 2023.09.10  
- Restore the essential parameters for discord callbacks.
- Clean more parameters.

v0.7.0 2023.09.08  
- Clean more tracking params on bestbuy|amazon|baidu|douyin|ebay|jd.
- Improves the performance on ali sites.
- Minor issues fixes and improvements.

v0.6.12 2023.08.28  
- Minor optimisations to be compatible with page adjustments of zhihu.com.

v0.6.11 2023.08.24  
- Fixed an issue when preventing certain events may cause parts of the page malfunctional.
- Fixed an issue that some contents on the video page of bilibili failed to load.
- Minor issues fixes.

v0.6.10 2023.08.19  
- Fix an issue where the CM for soem sites may fail to prompt in mobile-view mode.

v0.6.9 2023.08.15  
- Clean more parameters common, (bilibili|1688|taobao|pixiv|fiverr).
- Improve performance on ali sites (reduce regex mathcing words).
- Minor issues fixes and performance improvments.

v0.6.8 2023.07.02  
- Temporarily hide annoying content on `gitee.com`.
- Clean more parameters for ali sties includes `jiyoujia|fliggy.com`.
- Minor issuss fixes and performance improvemets.

v0.6.7 2023.06.24  
- Clean more parameters for `all|dzen.ru|yangkeduo.com|imdb|boxofficemojo|qq|bilibili.com`.
- Clean all parameters whose names match `^spm|scm`, optimised the regexp matching.
- Allow using en-dash `(-)` on the function of add custom parameters.
- Performance improvements.

v0.6.6.1 2023.06.15  
- Fixed an issue where the missing existence detection for bilibili may cause numerous error messages (Check before use).

v0.6.6 2023.06.15  
- Remove more tracking parameters on `Amazon|LinkedIn.com|ebay|Youtube.com|Imdb|Bilibili|Apple.com` and common parameters.
- Allow adding custom parameters to the websites that in additional cleaning.
- Block more tracking events within its iframe, remove ad-links`(right-bottom-banner|bannerAd)`  on bilibili.com.
- Performance improvements and issue fixes.

v0.6.5 2023.06.07  
- Clean more tracking params on `Google|Bilibili|Youtube|Stackoverflow|Bing.com|Xbox.com|Facebook|Amazon`, block more tracking events.
- Clean tracking params at the hash of URLs on `Google`.
- Allow using numbers and other types of brackets on the function of add custom parameters.
- More precise domain name matching. (function includes() >> startsWith/endsWith/Regular Expression).
- Fix most timeout issues, and other issue fixes and performance improvements (events listening optimisations).
- Additional feature: hide login popups for `zhihu.com|hoyolab.com`.

v0.6.4 2023.06.02  
- Reduce event blocking scope that binds to the elements `<a>` (capturing >> bubbling).
- Clean more tracking params on `linkedin|tmall|facebook|google|ebay.com`, block tracking events on `linkedin.com`.
- Clean copying of video urls after right-click at the main video on `youtube.com` (unshorten without tracking params).
- Other improvements.

v0.6.3 2023.05.26  
- Description optimisation (Script menu).
- Script optimisation, update excludes.
- Remove more parameters for `Amazon, Taobao, Reddit`, bilibili.com/bangumi.
- Add a function of quick cleaning with keyboard (Shift + Alt + X), find in the script code to custom: `e.key === 'X'`.

v0.6.2.2 2023.05.22  
- Regex checking (when add custom param) optimisation (allow using `[]` in parameter).

v0.6.2.1 2023.05.22  
- Script language optimisation.

v0.6.2 2023.05.22  
- Script logic and performance optimisation.
- Add format validation before adding params (from GM_setValue to storage);
- Add a script menu function which can remove a custom added parameter.
- Remove more tracking params.
- Remove Baidu Search ad results (Testing).

v0.6.1 2023.05.18  
- Fix an error about array merging, from Array.push() to Array.concat().
- Clean more params for common sites and `Amazon`, `weibo|stackoverflow|tmall.com`.
- Reconstruct the functions of history (bind urlchange event to pushState and replaceState).
- Custom cleaning for `Amazon`.
- Added a submenu to support adding custom params for current site (host).

v0.6.0 2023.05.15  
- Clean more parameters for `(douban|imdb|vk|weibo|163|126|baidu.com)|yeah.net`.
- Resote some parameters for `xda-developers.com`.
- Add a function of copy cleaning precise time on the video pages of `bilibili`.
- Clean up copy link behavior on context menu.
- Script code and regexps matching optimisation, fix several bugs.

v0.5.8 2023.05.10  
- Fix an issue where the script submenu on github.com was not displayed successfully.
- Clean copy texts when share video on the video page of bilibili.
- Clean more parameters for `douyin|tiktok|zhihu|douban|twitter|xda-developers|baidu|cctv.com`.
- Block signin popups once when enter the pages of zhihu.com.
- Remove more params for `hoyolab|hoyoverse|mihoyo|miyoushe|miyougift.com` with futnion-commonClean.
- Timeuout logic optimisation.

v0.5.7 2023.05.05  
- Optiomise the monitoring of certain events.
- Remove more parameters for `github|medium|xda-developers|youku.(com)`.
- Bug fixes.

v0.5.6 2023.04.28  
- Restore a necessary parameter for baidu.com.

v0.5.5 2023.04.28  
- Restore normall events within the bili-live player under right-menu clicking.
- Fixed some coding errors and bug fixes.
- Update script icon.
- Add more tracking parameters.
- Several optimisations, improve cleaning speed.

v0.5.2 2023.04.20  
- Update site params (add, remove) (Duplicate or necessary parameters for certain sites).
- Add a condition before bind a event-listenser to button tags.
- Manually cleaning: Add a script menu on tampermonkey's drop-down menu during default situations.
- Fixed a problem that clicking to switch page number was invalid (Add label attribute url verificaiton).
- Code reduction.

v0.5.1 2023.04.15  
- Fix some bugs where block clicking-events on empty `<a>` link
- Update excludes pages.
- Clean some tracking links under space.bilibili.com after click expand more games.
- Clean `<a>` links with `data-url` as its target url instead of `href`.
- Clean the params at embedded youtube videos.

v0.5.0  2023.04.09  
- Added tmall.hk.
- Added common cleaning to support all websites.
- Now this script can clean common contents for all sites and specific cleaning for certain sites.
- Performance optimisation.

v0.4.10 2023.04.04  
- Added 1688.com.
- Script operating improvements.

v0.4.9 2023.04.03  
- Clean Ali sites URLs and block tracking events.
  - alibaba.com
  - alibabagroup.com
  - aliyun.com
  - aliexpress.com
  - alimama.com
  - taobao.com
  - tmall.com
  - youku.com
- Minor bug fixes.

v0.4.8-2023.03.25  
- Script optimisation.
- Minor bug fixes.

v0.4.7-2023.03.14  
- Clean Youku URLs. [Youku.com].(Testing)
- Code reduction.
- Performance optimisation and bug fixes.

v0.4.6-2023.03.11  
- Clean more baidu links. [Baidu]
- Clean CSDN URLs. [csdn.net]
- Script optimisation and bug fixes.
- Code reduction.

v0.4.5 2023.03.09  
- Clean more URL under Baidu.com, replace search URL state. [Baidu]
- Script optimisation and bug fixes. [bilibili]
- Code reduction.

v0.4.4 2023.03.05  
- Restore history state at live.bilibili.com. [Bilibili]
- Clean Bilibili Manga & Show links. [manga/show.bilibili.com]
- Clean redundant params at douyin.com search page. [Douyin]
- Code reduction.

v0.4.3.1 2023.03.01  
- Clean more links at live.bilibili.com. [Bilibili]
- Script optimisation.

v0.4.3 2023.02.24  
- Block more tracking events. [Bilibili]
- Clean more links.[Bilibili]
- Restore link jump events at comment area. [Bilibili]
- Script optimisation. [Bilibili]

v0.4.2.1 2023.02.22  
- Restore `<a>` link click-events on precise time jump at comment area.[www.bilibili.com/video]

v0.4.2 2023.02.07  
- Optimised events at the search-input-block. [Bilibili]
- Bug fixes. [search.bilibili.com, www.bilibili.com]

v0.4.1.2 2023.01.28  
- Bug fixes and performance optimisation. [Bilibili]

v0.4.1.1 2023.01.25  
- Expanded the effective pages of the script. [Bilibili]

v0.4.1.0 2023.01.23  
- Performance optimisation and bug fixes.
- Code reduction.

v0.4.0.1 2023.01.21  
- Clean other untracked links. [space.bilibili.com]
- Several bugs fixes. [bilibili.com]

v0.4.0 2023.01.20  
- Clean Bilibili Video page collections clicking event URL state changes. [www.bilibili.com/video/]
- Clean Bilibili Search tracking events. [search.bilibili.com]
- Clean other tracking events (top-menu clicking). [Bilibili]

v0.3.8.3 2023.01.20  
- Fixed tracking event after video sorting navigation bar items clicked. [space.bilibili.com]

v0.3.8.2 2023.01.19  
- Fixed navibar items click events [www.bilibili.com/v/popular].

v0.3.8.1 2023.01.13  
- Clean more links of Baidu.com

v0.3.8 2023.01.06  
- Block Card-Ads for Bilibili. (And now blocked banner-ads & card-ads for Bilibili)
- Block [Lucky Draw (The Selection)] popup at [live.bilibili.com]. Disabled by default.
- (SET [{BlockLivePopups} = true] to enable it.)
- The script may add menus to unlock custom setting.

v0.3.7.1 2023.01.02  
- Fixed [space.bilibili.com] effects after paged, navi-bar clicked or menu-item clicked.
- Added support to clean tracking url at [search.bilibili.com].

v0.3.7 2023-01-02  
- Naming optimisation.
- Script handling optimisation. (Bilibili)
- Added support to block part of Bilibili Ads.

v0.3.6 2022.12.28  
- Optimise Baidu related search URL, paging URL processing method.

v0.3.5 2022.12.27  
- Script logic optimisation.

v0.3.4 2022.12.23  
- Code optimisation. Fixed script's effect range. [Bilibili]

v0.3.3 2022.12.23  
- Added site support：Clean Baidu <Related Search> URLs.
- Script optimisations. [space.bilibili.com]

v0.3.2 2022.12.22  
- Restore pushstate session (address bar url display, replace history). [Bilibili]
- Minor optimisations. [Bilibili]

v0.3.1 2022.12.22  
- Optimized the effective range. [Bilibili]

v0.3 2022.12.22  
- Added Bilibili Home page, Popular/Rank page, now it can takeeffect on most pages.  [Bilibili]

v0.2 2022.12.21  
- Added missing tags.  [Bilibili]

v0.1 2022.12.20  
- Initial release.
*/
